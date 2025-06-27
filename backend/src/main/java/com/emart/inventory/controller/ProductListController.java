package com.emart.inventory.controller;

import com.emart.inventory.entity.Product;
import com.emart.inventory.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/products-min")
@CrossOrigin(origins = "http://localhost:3000")
public class ProductListController {
    @Autowired
    private ProductRepository productRepository;

    @GetMapping
    public ResponseEntity<List<ProductMinDTO>> getProductsMin() {
        List<ProductMinDTO> products = productRepository.findByIsActiveTrue().stream()
            .map(p -> new ProductMinDTO(p.getId(), p.getName(), p.getExpiryDate(), p.getManufacturerDate(), p.getManufacturerCode()))
            .collect(Collectors.toList());
        return ResponseEntity.ok(products);
    }

    public static class ProductMinDTO {
        public Long id;
        public String name;
        public java.time.LocalDateTime expiryDate;
        public java.time.LocalDateTime manufacturerDate;
        public String manufacturerCode;
        public ProductMinDTO(Long id, String name, java.time.LocalDateTime expiryDate, java.time.LocalDateTime manufacturerDate, String manufacturerCode) {
            this.id = id;
            this.name = name;
            this.expiryDate = expiryDate;
            this.manufacturerDate = manufacturerDate;
            this.manufacturerCode = manufacturerCode;
        }
    }
} 