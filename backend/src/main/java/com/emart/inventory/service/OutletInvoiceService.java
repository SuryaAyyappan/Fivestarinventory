package com.emart.inventory.service;

import com.emart.inventory.entity.Outlet;
import com.emart.inventory.entity.Product;
import com.emart.inventory.repository.OutletRepository;
import com.emart.inventory.repository.ProductRepository;
import com.itextpdf.text.*;
import com.itextpdf.text.pdf.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.core.io.ClassPathResource;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.MultiFormatWriter;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import java.io.InputStream;

import java.io.ByteArrayOutputStream;
import java.text.DecimalFormat;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import jakarta.mail.internet.MimeMessage;

@Service
public class OutletInvoiceService {
    @Autowired
    private OutletRepository outletRepository;
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private JavaMailSender mailSender;
    
    private static final DecimalFormat DECIMAL_FORMAT = new DecimalFormat("#,##0.00");

    public byte[] generateOutletInvoicePDF(Long outletId, List<Map<String, Object>> items) throws Exception {
        Outlet outlet = outletRepository.findById(outletId)
                .orElseThrow(() -> new RuntimeException("Outlet not found"));

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        Document document = new Document(PageSize.A4, 36, 36, 36, 36);
        PdfWriter.getInstance(document, out);
        document.open();

        // Header: Title and Logo on the same row (match supplier invoice)
        PdfPTable headerTable = new PdfPTable(2);
        headerTable.setWidthPercentage(100);
        headerTable.setWidths(new int[]{70, 30});
        PdfPCell titleCell = new PdfPCell(new Phrase("INVOICE - OUTLET", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 20)));
        titleCell.setBorder(Rectangle.NO_BORDER);
        titleCell.setHorizontalAlignment(Element.ALIGN_LEFT);
        titleCell.setVerticalAlignment(Element.ALIGN_MIDDLE);
        headerTable.addCell(titleCell);
        try (InputStream logoStream = new org.springframework.core.io.ClassPathResource("static/logo.jpg").getInputStream()) {
            Image logo = Image.getInstance(logoStream.readAllBytes());
            logo.scaleToFit(100, 100);
            PdfPCell logoCell = new PdfPCell(logo);
            logoCell.setBorder(Rectangle.NO_BORDER);
            logoCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
            logoCell.setVerticalAlignment(Element.ALIGN_MIDDLE);
            headerTable.addCell(logoCell);
        } catch (Exception e) {
            PdfPCell emptyLogo = new PdfPCell(new Phrase(""));
            emptyLogo.setBorder(Rectangle.NO_BORDER);
            headerTable.addCell(emptyLogo);
        }
        document.add(headerTable);
        document.add(new Paragraph(" "));

        // Meta Table
        PdfPTable metaTable = new PdfPTable(2);
        metaTable.setWidthPercentage(100);
        metaTable.setWidths(new int[]{50, 50});

        PdfPTable left = new PdfPTable(1);
        left.addCell(getNoBorderCell("Invoice #: INV-" + System.currentTimeMillis()));
        left.addCell(getNoBorderCell("Invoice Date: " + LocalDate.now()));
        left.addCell(getNoBorderCell("Due Date: " + LocalDate.now().plusMonths(1)));

        PdfPTable right = new PdfPTable(1);
        // Remove logo from metaTable right cell, only keep company info
        right.addCell(getNoBorderCell("E - Mart Inventory Management Pvt. Ltd."));
        right.addCell(getNoBorderCell("27, Anna Nagar, Chennai, Tamil Nadu - 600001"));
        right.addCell(getNoBorderCell("Phone: +91 9999999999"));

        metaTable.addCell(left);
        metaTable.addCell(right);
        document.add(metaTable);
        document.add(new Paragraph(" "));

        // Outlet Info
        PdfPTable outletTable = new PdfPTable(1);
        outletTable.setWidthPercentage(100);
        PdfPCell outletCell = new PdfPCell();
        outletCell.addElement(new Paragraph("Outlet: " + outlet.getName()));
        outletCell.addElement(new Paragraph("Manager: " + outlet.getManagerName()));
        outletCell.addElement(new Paragraph("Phone: " + outlet.getContactNumber()));
        outletCell.addElement(new Paragraph("Location: " + outlet.getLocation()));
        outletCell.setBorder(Rectangle.BOX);
        outletTable.addCell(outletCell);
        document.add(outletTable);
        document.add(new Paragraph(" "));

        // Items Table
        PdfPTable table = new PdfPTable(5);
        table.setWidthPercentage(100);
        table.setWidths(new int[]{10, 30, 10, 20, 20});
        table.addCell("S.No");
        table.addCell("Item Name");
        table.addCell("Qty");
        table.addCell("Item ID");
        table.addCell("Total");

        double subtotal = 0;
        int i = 1;
        for (Map<String, Object> item : items) {
            Long productId = Long.valueOf(item.get("productId").toString());
            int quantity = Integer.parseInt(item.get("quantity").toString());
            Product product = productRepository.findById(productId)
                    .orElseThrow(() -> new RuntimeException("Product not found: " + productId));
            double price = product.getMrp() != null ? product.getMrp().doubleValue() * quantity : 0.0;
            subtotal += price;
            table.addCell(String.valueOf(i++));
            table.addCell(product.getName());
            table.addCell(String.valueOf(quantity));
            table.addCell(String.valueOf(product.getId()));
            table.addCell("₹" + DECIMAL_FORMAT.format(price));
        }
        document.add(table);
        document.add(new Paragraph(" "));

        double tax = subtotal * 0.18;
        double total = subtotal + tax;

        PdfPTable totalTable = new PdfPTable(2);
        totalTable.setWidthPercentage(50);
        totalTable.setHorizontalAlignment(Element.ALIGN_RIGHT);
        totalTable.setWidths(new int[]{60, 40});
        totalTable.addCell(getNoBorderCell("Subtotal:"));
        totalTable.addCell(getNoBorderCell("₹" + DECIMAL_FORMAT.format(subtotal)));
        totalTable.addCell(getNoBorderCell("Tax (18%):"));
        totalTable.addCell(getNoBorderCell("₹" + DECIMAL_FORMAT.format(tax)));
        totalTable.addCell(getNoBorderCell("Total Amount:"));
        totalTable.addCell(getNoBorderCell("₹" + DECIMAL_FORMAT.format(total)));
        document.add(totalTable);
        document.add(new Paragraph(" "));

        // Barcode (real barcode like supplier invoice)
        String barcodeData = "OUTLET-" + outletId + "-" + System.currentTimeMillis();
        try {
            BitMatrix bitMatrix = new MultiFormatWriter().encode(barcodeData, BarcodeFormat.CODE_128, 250, 50);
            ByteArrayOutputStream barcodeOut = new ByteArrayOutputStream();
            MatrixToImageWriter.writeToStream(bitMatrix, "png", barcodeOut);
            Image barcodeImage = Image.getInstance(barcodeOut.toByteArray());
            barcodeImage.setAlignment(Image.ALIGN_CENTER);
            barcodeImage.scalePercent(150);
            document.add(barcodeImage);
        } catch (Exception e) {
            // fallback: show barcode data as text
            Paragraph barcode = new Paragraph(barcodeData, FontFactory.getFont(FontFactory.HELVETICA, 12));
            barcode.setAlignment(Element.ALIGN_CENTER);
            document.add(barcode);
        }

        document.add(new Paragraph("Digitally Signed by Inventory System", FontFactory.getFont(FontFactory.HELVETICA_OBLIQUE, 10)));
        document.close();
        return out.toByteArray();
    }

    private PdfPCell getNoBorderCell(String content) {
        PdfPCell cell = new PdfPCell(new Phrase(content));
        cell.setBorder(Rectangle.NO_BORDER);
        return cell;
    }

    private PdfPCell getNoBorderCell(Image image) {
        PdfPCell cell = new PdfPCell(image);
        cell.setBorder(Rectangle.NO_BORDER);
        return cell;
    }

    public void sendOutletInvoiceEmail(String to, String subject, String body, byte[] pdfBytes) throws Exception {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setFrom("sec21cj039@sairamtap.edu.in");
            helper.setTo("rammikaavi@gmail.com");
            helper.setSubject(subject);
            helper.setText(body);
            helper.addAttachment("outlet-invoice.pdf", new org.springframework.core.io.ByteArrayResource(pdfBytes));
            mailSender.send(message);
        } catch (Exception e) {
            // If email is not configured, just log the error and continue
            System.out.println("[WARNING] Email service not available: " + e.getMessage());
            System.out.println("[INFO] PDF generated successfully but email not sent due to configuration issues");
            // Don't throw the exception - just log it
        }
    }
} 