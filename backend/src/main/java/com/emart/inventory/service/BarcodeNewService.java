package com.emart.inventory.service;

import com.emart.inventory.entity.BarcodeNew;
import com.emart.inventory.entity.Product;
import com.emart.inventory.repository.BarcodeNewRepository;
import com.emart.inventory.repository.ProductRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@Transactional
public class BarcodeNewService {
    private static final Logger logger = LoggerFactory.getLogger(BarcodeNewService.class);
    @Autowired
    private BarcodeNewRepository barcodeNewRepository;
    @Autowired
    private ProductRepository productRepository;

    // Generate barcode for a product
    public BarcodeNew generateBarcode(Long productId, String manufacturerCode) {
        logger.info("Generating barcode for productId: {} with manufacturerCode: '{}'", productId, manufacturerCode);
        if (manufacturerCode == null || manufacturerCode.length() != 5 || !manufacturerCode.matches("\\d{5}")) {
            throw new RuntimeException("Manufacturer code must be exactly 5 digits");
        }
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        // Check if barcode already exists
        Optional<BarcodeNew> existing = barcodeNewRepository.findByProduct(product);
        if (existing.isPresent()) return existing.get();

        String prefix = "890";
        String manu;
        try {
            manu = String.format("%05d", Integer.parseInt(manufacturerCode));
        } catch (NumberFormatException e) {
            logger.error("Invalid manufacturerCode '{}': {}", manufacturerCode, e.getMessage());
            throw new RuntimeException("Manufacturer code must be numeric and 5 digits");
        }
        String prod = String.format("%04d", product.getId());
        String base = prefix + manu + prod;
        int checkDigit = calculateEAN13CheckDigit(base);
        String fullBarcode = base + checkDigit;

        BarcodeNew barcode = new BarcodeNew(fullBarcode, product, manu);
        return barcodeNewRepository.save(barcode);
    }

    // Get barcode for a product
    public Optional<BarcodeNew> getBarcodeByProduct(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        return barcodeNewRepository.findByProduct(product);
    }

    // EAN-13 check digit calculation
    public int calculateEAN13CheckDigit(String number) {
        int sum = 0;
        for (int i = 0; i < number.length(); i++) {
            int digit = Character.getNumericValue(number.charAt(i));
            sum += (i % 2 == 0) ? digit : digit * 3;
        }
        int mod = sum % 10;
        return (mod == 0) ? 0 : 10 - mod;
    }
} 