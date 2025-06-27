package com.emart.inventory.repository;

import com.emart.inventory.entity.Barcode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BarcodeRepository extends JpaRepository<Barcode, String> {

    // Custom query to find Barcode by Product ID
    Barcode findByProductId(Long productId);

    // Optional: find by exact product object
    Barcode findByProduct_Id(Long id); // Alternative using nested property

    // Optional: find barcode by code
    Barcode findByCode(String code);
}
