package com.emart.inventory.service;

import com.emart.inventory.entity.Barcode;

import java.util.List;
import java.util.Optional;

public interface BarcodeService {
    Barcode generateBarcodeForProduct(Long productId);
    Barcode getBarcodeByCode(String code);
    Optional<Barcode> getBarcodeByProductId(Long productId);
    List<Barcode> getAllBarcodes();
}
