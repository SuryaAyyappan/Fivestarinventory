package com.emart.inventory.repository;

import com.emart.inventory.entity.BarcodeNew;
import com.emart.inventory.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BarcodeNewRepository extends JpaRepository<BarcodeNew, Long> {
    Optional<BarcodeNew> findByProduct(Product product);
    Optional<BarcodeNew> findByCode(String code);
} 