package com.emart.inventory.controller;

import com.emart.inventory.service.OutletInvoiceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/outlet-invoice")
@CrossOrigin(origins = "*")
public class OutletInvoiceController {
    @Autowired
    private OutletInvoiceService outletInvoiceService;

    @PostMapping("/generate")
    public ResponseEntity<byte[]> generateOutletInvoice(@RequestBody OutletInvoiceRequest request) {
        try {
            byte[] pdf = outletInvoiceService.generateOutletInvoicePDF(request.getOutletId(), request.getItems());
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDisposition(ContentDisposition.builder("attachment")
                    .filename("outlet_invoice_" + request.getOutletId() + ".pdf").build());
            return new ResponseEntity<>(pdf, headers, HttpStatus.OK);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(("Failed to generate outlet invoice: " + e.getMessage()).getBytes());
        }
    }

    @PostMapping("/send-email")
    public ResponseEntity<String> sendOutletInvoiceEmail(@RequestBody OutletInvoiceRequest request, @RequestParam(required = false) String email) {
        try {
            System.out.println("[DEBUG] Sending outlet invoice email for outletId=" + request.getOutletId());
            
            // Validate request
            if (request.getOutletId() == null) {
                System.out.println("[DEBUG] Outlet ID is null");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Outlet ID is required");
            }
            
            if (request.getItems() == null || request.getItems().isEmpty()) {
                System.out.println("[DEBUG] No items provided for outlet invoice");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("At least one item is required");
            }
            
            System.out.println("[DEBUG] Processing " + request.getItems().size() + " items for outlet " + request.getOutletId());
            
            byte[] pdf = outletInvoiceService.generateOutletInvoicePDF(request.getOutletId(), request.getItems());
            String to = (email != null && !email.isEmpty()) ? email : "sec21cj039@sairamtap.edu.in";
            String subject = "Outlet Invoice from eMart";
            String body = "Dear Outlet,\n\nPlease find attached your invoice from eMart.\n\nThank you.";
            outletInvoiceService.sendOutletInvoiceEmail(to, subject, body, pdf);
            return ResponseEntity.ok("PDF generated successfully. Email sent to " + to + " (if email service is configured)");
        } catch (Exception e) {
            System.out.println("[DEBUG] Error sending outlet invoice email: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to generate PDF: " + e.getMessage());
        }
    }

    public static class OutletInvoiceRequest {
        private Long outletId;
        private List<Map<String, Object>> items;
        public Long getOutletId() { return outletId; }
        public void setOutletId(Long outletId) { this.outletId = outletId; }
        public List<Map<String, Object>> getItems() { return items; }
        public void setItems(List<Map<String, Object>> items) { this.items = items; }
    }
} 