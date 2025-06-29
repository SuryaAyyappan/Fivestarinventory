package com.emart.inventory.controller;

import com.emart.inventory.entity.Invoice;
import com.emart.inventory.entity.InvoiceItem;
import com.emart.inventory.entity.Product;
import com.emart.inventory.entity.Supplier;
import com.emart.inventory.repository.InvoiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/invoices")
@CrossOrigin(origins = "http://localhost:3000")
public class InvoiceController {
    @Autowired
    private InvoiceRepository invoiceRepository;

    @GetMapping
    public ResponseEntity<List<InvoiceDTO>> getAllInvoices() {
        List<Invoice> invoices = invoiceRepository.findAll();
        List<InvoiceDTO> dtos = invoices.stream().map(InvoiceDTO::new).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    public static class InvoiceDTO {
        public Long id;
        public String invoiceNumber;
        public SupplierDTO supplier;
        public Double amount;
        public String status;
        public String createdAt;
        public List<ProductDTO> products;

        public InvoiceDTO(Invoice invoice) {
            this.id = invoice.getId();
            this.invoiceNumber = invoice.getInvoiceNumber();
            this.supplier = invoice.getSupplier() != null ? new SupplierDTO(invoice.getSupplier()) : null;
            this.amount = invoice.getTotalAmount() != null ? invoice.getTotalAmount().doubleValue() : 0.0;
            this.status = invoice.getStatus() != null ? invoice.getStatus().name() : null;
            this.createdAt = invoice.getCreatedAt() != null ? invoice.getCreatedAt().toString() : null;
            this.products = invoice.getItems() != null ? invoice.getItems().stream().map(ProductDTO::new).collect(Collectors.toList()) : null;
        }
    }

    public static class SupplierDTO {
        public Long id;
        public String name;
        public String email;
        public String phone;
        public String address;
        public SupplierDTO(Supplier s) {
            this.id = s.getId();
            this.name = s.getName();
            this.email = s.getEmail();
            this.phone = s.getPhone();
            this.address = s.getAddress();
        }
    }

    public static class ProductDTO {
        public Long id;
        public String name;
        public Integer quantity;
        public Double price;
        public String manufacturerCode;
        public ProductDTO(InvoiceItem item) {
            Product p = item.getProduct();
            this.id = p != null ? p.getId() : null;
            this.name = p != null ? p.getName() : null;
            this.quantity = item.getQuantity();
            this.price = p != null && p.getMrp() != null ? p.getMrp().doubleValue() : 0.0;
            this.manufacturerCode = p != null ? p.getManufacturerCode() : null;
        }
    }
} 