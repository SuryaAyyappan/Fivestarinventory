package com.emart.inventory.service;

import com.emart.inventory.entity.Invoice;
import com.emart.inventory.entity.InvoiceItem;
import com.emart.inventory.entity.Product;
import com.emart.inventory.entity.Supplier;
import com.emart.inventory.repository.InvoiceRepository;
import com.emart.inventory.repository.SupplierRepository;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.MultiFormatWriter;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.itextpdf.text.*;
import com.itextpdf.text.pdf.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.text.DecimalFormat;
import java.util.List;
import jakarta.mail.internet.MimeMessage;

@Service
public class SupplierInvoicePDFService {
    @Autowired
    private SupplierRepository supplierRepository;
    @Autowired
    private InvoiceRepository invoiceRepository;
    @Autowired
    private JavaMailSender mailSender;
    
    private static final DecimalFormat DECIMAL_FORMAT = new DecimalFormat("#,##0.00");

    public byte[] generateInvoicePDF(Long invoiceId) throws Exception {
        Invoice invoice = invoiceRepository.findById(invoiceId)
                .orElseThrow(() -> new RuntimeException("Invoice not found"));
        Supplier supplier = invoice.getSupplier();
        List<InvoiceItem> items = invoice.getItems();

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        Document document = new Document(PageSize.A4, 36, 36, 36, 36);
        PdfWriter.getInstance(document, out);
        document.open();

        // Header
        Paragraph header = new Paragraph("INVOICE - DISTRIBUTOR", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18));
        header.setAlignment(Element.ALIGN_CENTER);
        document.add(header);
        document.add(new Paragraph(" "));

        // Meta Table
        PdfPTable metaTable = new PdfPTable(2);
        metaTable.setWidthPercentage(100);
        metaTable.setWidths(new int[]{50, 50});

        PdfPTable left = new PdfPTable(1);
        left.addCell(getNoBorderCell("Invoice #: " + invoice.getInvoiceNumber()));
        left.addCell(getNoBorderCell("Invoice Date: " + invoice.getInvoiceDate().toLocalDate().toString()));
        left.addCell(getNoBorderCell("Due Date: " + (invoice.getDueDate() != null ? invoice.getDueDate().toLocalDate().toString() : "")));

        PdfPTable right = new PdfPTable(1);
        // Add logo
        try (InputStream logoStream = new ClassPathResource("static/logo.jpg").getInputStream()) {
            Image logo = Image.getInstance(logoStream.readAllBytes());
            logo.scaleToFit(100, 100);
            logo.setAlignment(Image.ALIGN_RIGHT);
            right.addCell(getNoBorderCell(logo));
        }
        right.addCell(getNoBorderCell("E - Mart Inventory Management Pvt. Ltd."));
        right.addCell(getNoBorderCell("27,Anna Nagar,Chennai ,Tamilnadu,600001"));
        right.addCell(getNoBorderCell("Phone: +91 9999999999"));

        metaTable.addCell(left);
        metaTable.addCell(right);
        document.add(metaTable);
        document.add(new Paragraph(" "));

        // Supplier Table
        PdfPTable supplierTable = new PdfPTable(1);
        supplierTable.setWidthPercentage(100);
        PdfPCell cell = new PdfPCell();
        cell.addElement(new Paragraph("Supplier: " + supplier.getName()));
        cell.addElement(new Paragraph("Email: " + supplier.getEmail()));
        cell.addElement(new Paragraph("Phone: " + supplier.getPhone()));
        cell.addElement(new Paragraph("Address: " + supplier.getAddress()));
        cell.setBorder(Rectangle.BOX);
        supplierTable.addCell(cell);
        document.add(supplierTable);
        document.add(new Paragraph(" "));

        // Items Table
        PdfPTable table = new PdfPTable(6);
        table.setWidthPercentage(100);
        table.setWidths(new int[]{8, 25, 10, 15, 15, 15});
        table.addCell("S.No");
        table.addCell("Item Name");
        table.addCell("Qty");
        table.addCell("Item ID");
        table.addCell("Manufacturer Code");
        table.addCell("Price");

        double subtotal = 0;
        int i = 1;
        for (InvoiceItem item : items) {
            Product product = item.getProduct();
            table.addCell(String.valueOf(i++));
            table.addCell(product.getName());
            table.addCell(String.valueOf(item.getQuantity()));
            table.addCell(String.valueOf(product.getId()));
            table.addCell(product.getManufacturerCode() != null ? product.getManufacturerCode() : "");
            double price = product.getMrp().doubleValue() * item.getQuantity();
            table.addCell("₹" + DECIMAL_FORMAT.format(price));
            subtotal += price;
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

        // Barcode
        String barcodeData = invoice.getInvoiceNumber();
        Image barcodeImage = generateBarcodeImage(barcodeData);
        barcodeImage.setAlignment(Image.ALIGN_CENTER);
        barcodeImage.scalePercent(150);
        document.add(barcodeImage);

        document.add(new Paragraph("Digitally Signed by Inventory System", FontFactory.getFont(FontFactory.HELVETICA_OBLIQUE, 10)));
        document.close();
        return out.toByteArray();
    }

    public byte[] generateCustomInvoicePDF(Long supplierId, List<ItemRequest> items) throws Exception {
        Supplier supplier = supplierRepository.findById(supplierId)
                .orElseThrow(() -> new RuntimeException("Supplier not found"));

        double subtotal = 0;
        int i = 1;
        List<InvoiceItemData> invoiceItems = new java.util.ArrayList<>();
        for (ItemRequest req : items) {
            Product product = req.product;
            int quantity = req.quantity;
            double price = product.getMrp() != null ? product.getMrp().doubleValue() * quantity : 0.0;
            subtotal += price;
            invoiceItems.add(new InvoiceItemData(i++, product, quantity, price));
        }

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        Document document = new Document(PageSize.A4, 36, 36, 36, 36);
        PdfWriter.getInstance(document, out);
        document.open();

        // Header: Title and Logo on the same row
        PdfPTable headerTable = new PdfPTable(2);
        headerTable.setWidthPercentage(100);
        headerTable.setWidths(new int[]{70, 30});
        PdfPCell titleCell = new PdfPCell(new Phrase("INVOICE - DISTRIBUTOR", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 20)));
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

        // Meta Table: Invoice info and Company info side by side
        PdfPTable metaTable = new PdfPTable(2);
        metaTable.setWidthPercentage(100);
        metaTable.setWidths(new int[]{60, 40});
        PdfPTable left = new PdfPTable(1);
        String invoiceNumber = "INV-" + System.currentTimeMillis();
        left.addCell(getNoBorderCell("Invoice #: " + invoiceNumber));
        left.addCell(getNoBorderCell("Invoice Date: " + java.time.LocalDate.now()));
        left.addCell(getNoBorderCell("Due Date: " + java.time.LocalDate.now().plusMonths(1)));
        PdfPCell leftCell = new PdfPCell(left);
        leftCell.setBorder(Rectangle.BOX);
        metaTable.addCell(leftCell);
        PdfPTable right = new PdfPTable(1);
        right.addCell(getNoBorderCell("E - Mart Inventory Management Pvt. Ltd."));
        right.addCell(getNoBorderCell("27,Anna Nagar,Chennai ,Tamilnadu,600001"));
        right.addCell(getNoBorderCell("Phone: +91 9999999999"));
        PdfPCell rightCell = new PdfPCell(right);
        rightCell.setBorder(Rectangle.BOX);
        metaTable.addCell(rightCell);
        document.add(metaTable);
        document.add(new Paragraph(" "));

        // Supplier/Distributor block
        PdfPTable supplierTable = new PdfPTable(1);
        supplierTable.setWidthPercentage(100);
        PdfPCell cell = new PdfPCell();
        cell.addElement(new Paragraph("Supplier: " + supplier.getName()));
        cell.addElement(new Paragraph("Email: " + supplier.getEmail()));
        cell.addElement(new Paragraph("Phone: " + supplier.getPhone()));
        cell.addElement(new Paragraph("Address: " + supplier.getAddress()));
        cell.setBorder(Rectangle.BOX);
        supplierTable.addCell(cell);
        document.add(supplierTable);
        document.add(new Paragraph(" "));

        // Items Table
        PdfPTable table = new PdfPTable(6);
        table.setWidthPercentage(100);
        table.setWidths(new int[]{8, 25, 10, 15, 15, 15});
        table.addCell("S.No");
        table.addCell("Item Name");
        table.addCell("Qty");
        table.addCell("Item ID");
        table.addCell("Manufacturer Code");
        table.addCell("Price");
        for (InvoiceItemData item : invoiceItems) {
            table.addCell(String.valueOf(item.serial));
            table.addCell(item.product.getName());
            table.addCell(String.valueOf(item.quantity));
            table.addCell(String.valueOf(item.product.getId()));
            table.addCell(item.product.getManufacturerCode() != null ? item.product.getManufacturerCode() : "");
            table.addCell("₹" + DECIMAL_FORMAT.format(item.price));
        }
        document.add(table);
        document.add(new Paragraph(" "));

        // Totals Table
        double tax = subtotal * 0.18;
        double total = subtotal + tax;
        PdfPTable totalTable = new PdfPTable(2);
        totalTable.setWidthPercentage(30);
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

        // Barcode
        String barcodeData = invoiceNumber;
        Image barcodeImage = generateBarcodeImage(barcodeData);
        barcodeImage.setAlignment(Image.ALIGN_CENTER);
        barcodeImage.scalePercent(150);
        document.add(barcodeImage);

        document.add(new Paragraph("\n\n"));
        Paragraph sign = new Paragraph("Digitally Signed by Inventory System", FontFactory.getFont(FontFactory.HELVETICA_OBLIQUE, 10));
        sign.setAlignment(Element.ALIGN_LEFT);
        document.add(sign);
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
        cell.setHorizontalAlignment(Element.ALIGN_RIGHT);
        return cell;
    }
    private Image generateBarcodeImage(String data) throws Exception {
        BitMatrix bitMatrix = new MultiFormatWriter().encode(data, BarcodeFormat.CODE_128, 250, 50);
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        MatrixToImageWriter.writeToStream(bitMatrix, "png", out);
        return Image.getInstance(out.toByteArray());
    }

    public static class ItemRequest {
        public Long productId;
        public int quantity;
        public Product product;
    }

    private static class InvoiceItemData {
        int serial;
        Product product;
        int quantity;
        double price;
        InvoiceItemData(int serial, Product product, int quantity, double price) {
            this.serial = serial;
            this.product = product;
            this.quantity = quantity;
            this.price = price;
        }
    }

    public void sendInvoiceEmail(String to, String subject, String body, byte[] pdfBytes) throws Exception {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setFrom("sec21cj039@sairamtap.edu.in");
            helper.setTo("rammikaavi@gmail.com");
            helper.setSubject(subject);
            helper.setText(body);
            helper.addAttachment("invoice.pdf", new org.springframework.core.io.ByteArrayResource(pdfBytes));
            mailSender.send(message);
        } catch (Exception e) {
            // If email is not configured, just log the error and continue
            System.out.println("[WARNING] Email service not available: " + e.getMessage());
            System.out.println("[INFO] PDF generated successfully but email not sent due to configuration issues");
            // Don't throw the exception - just log it
        }
    }
} 