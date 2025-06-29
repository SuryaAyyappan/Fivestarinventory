package com.emart.inventory.service;

import com.emart.inventory.entity.Barcode;
import com.emart.inventory.entity.Product;
import com.emart.inventory.repository.BarcodeRepository;
import com.emart.inventory.repository.ProductRepository;
import com.emart.inventory.service.BarcodeService;
import com.emart.inventory.util.BarcodeUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BarcodeServiceImpl implements BarcodeService {

    @Autowired
    private BarcodeRepository barcodeRepository;

    @Autowired
    private ProductRepository productRepository;

    @Override
    public Barcode generateBarcodeForProduct(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        String countryCode = "890"; // India
        String manufacturerCode = product.getManufacturerCode(); // Use product's manufacturerCode
        String productCode = String.format("%05d", product.getId()); // Ensure 5 digits

        String baseBarcode = countryCode + manufacturerCode + productCode;
        int checkDigit = BarcodeUtil.calculateEAN13CheckDigit(baseBarcode);
        String fullBarcode = baseBarcode + checkDigit;

        Barcode barcode = new Barcode(fullBarcode, product);
        return barcodeRepository.save(barcode);
    }

    @Override
    public Barcode getBarcodeByCode(String code) {
        return barcodeRepository.findById(code)
                .orElseThrow(() -> new RuntimeException("Barcode not found"));
    }

    @Override
    public Optional<Barcode> getBarcodeByProductId(Long productId) {
        return Optional.ofNullable(barcodeRepository.findByProductId(productId));
    }

    @Override
    public List<Barcode> getAllBarcodes() {
        return barcodeRepository.findAll();
    }
}
