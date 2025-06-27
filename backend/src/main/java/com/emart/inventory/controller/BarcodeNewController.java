package com.emart.inventory.controller;

import com.emart.inventory.entity.BarcodeNew;
import com.emart.inventory.service.BarcodeNewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/barcodes-new")
@CrossOrigin(origins = "http://localhost:3000")
public class BarcodeNewController {
    @Autowired
    private BarcodeNewService barcodeNewService;

    // Generate and return barcode for a product
    @PostMapping("/generate/{productId}")
    public ResponseEntity<?> generateBarcode(@PathVariable Long productId, @RequestParam String manufacturerCode) {
        try {
            BarcodeNew barcode = barcodeNewService.generateBarcode(productId, manufacturerCode);
            return ResponseEntity.ok(barcode);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Get barcode for a product
    @GetMapping("/product/{productId}")
    public ResponseEntity<?> getBarcodeByProduct(@PathVariable Long productId) {
        return barcodeNewService.getBarcodeByProduct(productId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
} 