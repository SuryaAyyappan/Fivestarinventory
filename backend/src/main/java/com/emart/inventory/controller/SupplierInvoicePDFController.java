package com.emart.inventory.controller;

import com.emart.inventory.service.SupplierInvoicePDFService;
import com.emart.inventory.repository.ProductRepository;
import com.emart.inventory.repository.InvoiceRepository;
import com.emart.inventory.repository.SupplierRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import jakarta.mail.internet.MimeMessage;

import java.util.List;

@RestController
@RequestMapping("/api/invoices/supplier")
public class SupplierInvoicePDFController {

    @Autowired
    private SupplierInvoicePDFService supplierInvoicePDFService;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private InvoiceRepository invoiceRepository;

    @Autowired
    private SupplierRepository supplierRepository;

    @Autowired
    private JavaMailSender mailSender;

    @GetMapping("/{invoiceId}")
    public ResponseEntity<byte[]> generatePDF(@PathVariable Long invoiceId) {
        try {
            byte[] pdf = supplierInvoicePDFService.generateInvoicePDF(invoiceId);
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDisposition(ContentDisposition.builder("attachment")
                    .filename("invoice_supplier_" + invoiceId + ".pdf").build());
            return new ResponseEntity<>(pdf, headers, HttpStatus.OK);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(("Failed to generate invoice: " + e.getMessage()).getBytes());
        }
    }

    @PostMapping("/generate")
    public ResponseEntity<byte[]> generateCustomPDF(@RequestBody GenerateInvoiceRequest request) {
        try {
            // Fetch products and build item list
            List<SupplierInvoicePDFService.ItemRequest> items = new java.util.ArrayList<>();
            for (GenerateInvoiceRequest.Item item : request.items) {
                SupplierInvoicePDFService.ItemRequest ir = new SupplierInvoicePDFService.ItemRequest();
                ir.productId = item.productId;
                ir.quantity = item.quantity;
                // Fetch product entity
                ir.product = productRepository.findById(item.productId).orElseThrow(() -> new RuntimeException("Product not found: " + item.productId));
                items.add(ir);
            }
            byte[] pdf = supplierInvoicePDFService.generateCustomInvoicePDF(request.supplierId, items);
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDisposition(ContentDisposition.builder("attachment")
                    .filename("invoice_supplier_custom.pdf").build());
            return new ResponseEntity<>(pdf, headers, HttpStatus.OK);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(("Failed to generate invoice: " + e.getMessage()).getBytes());
        }
    }

    // New endpoint: Generate PDF for all products of a supplier
    @GetMapping("/generate-pdf/{supplierId}")
    public ResponseEntity<byte[]> generatePDFBySupplier(@PathVariable Long supplierId) {
        try {
            // Fetch all active products for the supplier
            List<com.emart.inventory.entity.Product> products = productRepository.findBySupplierIdAndIsActiveTrue(supplierId);
            // Build item requests for PDF service
            List<SupplierInvoicePDFService.ItemRequest> items = new java.util.ArrayList<>();
            for (com.emart.inventory.entity.Product product : products) {
                SupplierInvoicePDFService.ItemRequest ir = new SupplierInvoicePDFService.ItemRequest();
                ir.productId = product.getId();
                ir.quantity = product.getQuantity() != null ? product.getQuantity() : 0;
                ir.product = product;
                items.add(ir);
            }
            byte[] pdf = supplierInvoicePDFService.generateCustomInvoicePDF(supplierId, items);
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDisposition(ContentDisposition.builder("attachment")
                    .filename("invoice_supplier_" + supplierId + ".pdf").build());
            return new ResponseEntity<>(pdf, headers, HttpStatus.OK);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(("Failed to generate invoice: " + e.getMessage()).getBytes());
        }
    }

    @PostMapping("/send-email")
    public ResponseEntity<String> sendInvoiceEmail(@RequestParam Long invoiceId, @RequestParam(required = false) String email) {
        try {
            System.out.println("[DEBUG] Sending supplier invoice email for invoiceId=" + invoiceId);
            
            // Check if invoice exists
            if (!invoiceRepository.existsById(invoiceId)) {
                System.out.println("[DEBUG] Invoice not found with ID: " + invoiceId);
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Invoice not found with ID: " + invoiceId);
            }
            
            byte[] pdf = supplierInvoicePDFService.generateInvoicePDF(invoiceId);
            String to = (email != null && !email.isEmpty()) ? email : "aahsurya0415@gmail.com";
            String subject = "Distributor Invoice from eMart";
            String body = "Dear Distributor,\n\nPlease find attached your invoice from eMart.\n\nThank you.";
            supplierInvoicePDFService.sendInvoiceEmail(to, subject, body, pdf);
            return ResponseEntity.ok("PDF generated successfully. Email sent to " + to + " (if email service is configured)");
        } catch (Exception e) {
            System.out.println("[DEBUG] Error sending supplier invoice email: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to generate PDF: " + e.getMessage());
        }
    }

    @PostMapping("/send-all-products-email")
    public ResponseEntity<String> sendAllProductsEmail(@RequestParam Long supplierId, @RequestParam(required = false) String email) {
        try {
            System.out.println("[DEBUG] Sending all-products supplier invoice email for supplierId=" + supplierId);
            
            // Check if supplier exists
            if (!supplierRepository.existsById(supplierId)) {
                System.out.println("[DEBUG] Supplier not found with ID: " + supplierId);
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Supplier not found with ID: " + supplierId);
            }
            
            List<com.emart.inventory.entity.Product> products = productRepository.findBySupplierIdAndIsActiveTrue(supplierId);
            System.out.println("[DEBUG] Found " + products.size() + " products for supplier " + supplierId);
            
            if (products.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("No active products found for supplier ID: " + supplierId);
            }
            
            List<SupplierInvoicePDFService.ItemRequest> items = new java.util.ArrayList<>();
            for (com.emart.inventory.entity.Product product : products) {
                SupplierInvoicePDFService.ItemRequest ir = new SupplierInvoicePDFService.ItemRequest();
                ir.productId = product.getId();
                ir.quantity = product.getQuantity() != null ? product.getQuantity() : 0;
                ir.product = product;
                items.add(ir);
            }
            byte[] pdf = supplierInvoicePDFService.generateCustomInvoicePDF(supplierId, items);
            String to = (email != null && !email.isEmpty()) ? email : "aahsurya0415@gmail.com";
            String subject = "Distributor Invoice (All Products) from eMart";
            String body = "Dear Distributor,\n\nPlease find attached your all-products invoice from eMart.\n\nThank you.";
            supplierInvoicePDFService.sendInvoiceEmail(to, subject, body, pdf);
            return ResponseEntity.ok("PDF generated successfully. Email sent to " + to + " (if email service is configured)");
        } catch (Exception e) {
            System.out.println("[DEBUG] Error sending all-products supplier invoice email: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to generate PDF: " + e.getMessage());
        }
    }

    @PostMapping("/test-email")
    public ResponseEntity<String> testEmail() {
        try {
            System.out.println("[DEBUG] Testing email service");
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setFrom("sec21cj039@sairamtap.edu.in");
            helper.setTo("rammikaavi@gmail.com");
            helper.setSubject("Test Email from eMart Inventory System");
            helper.setText("This is a test email to verify the email service is working.");
            mailSender.send(message);
            return ResponseEntity.ok("Test email sent successfully");
        } catch (Exception e) {
            System.out.println("[DEBUG] Error sending test email: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to send test email: " + e.getMessage());
        }
    }

    public static class GenerateInvoiceRequest {
        public Long supplierId;
        public java.util.List<Item> items;
        public static class Item {
            public Long productId;
            public int quantity;
        }
    }
} 