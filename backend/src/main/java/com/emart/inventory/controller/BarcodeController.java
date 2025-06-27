package com.emart.inventory.controller;

import com.emart.inventory.entity.Barcode;
import com.emart.inventory.service.BarcodeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/barcodes")
public class BarcodeController {

    @Autowired
    private BarcodeService barcodeService;

    @PostMapping("/generate/{productId}")
    public Barcode generateBarcode(@PathVariable Long productId) {
        return barcodeService.generateBarcodeForProduct(productId);
    }

    @GetMapping("/{code}")
    public Barcode getBarcodeByCode(@PathVariable String code) {
        return barcodeService.getBarcodeByCode(code);
    }

    @GetMapping("/product/{productId}")
    public Optional<Barcode> getBarcodeByProductId(@PathVariable Long productId) {
        return barcodeService.getBarcodeByProductId(productId);
    }

    @GetMapping
    public List<Barcode> getAllBarcodes() {
        return barcodeService.getAllBarcodes();
    }
}
