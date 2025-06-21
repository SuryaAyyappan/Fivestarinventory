package com.emart.inventory.repository;

import com.emart.inventory.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    
    Optional<Product> findBySku(String sku);
    
    List<Product> findByIsActiveTrue();
    
    Page<Product> findByIsActiveTrue(Pageable pageable);
    
    Page<Product> findByIsActiveTrueAndNameContainingIgnoreCase(String name, Pageable pageable);
    
    Page<Product> findByIsActiveTrueAndCategoryId(Long categoryId, Pageable pageable);
    
    Page<Product> findByIsActiveTrueAndNameContainingIgnoreCaseAndCategoryId(
            String name, Long categoryId, Pageable pageable);
    
    @Query("SELECT p FROM Product p JOIN p.inventory i WHERE i.quantityInStock <= p.minStockLevel AND p.isActive = true")
    List<Product> findLowStockProducts();
    
    @Query("SELECT p FROM Product p WHERE p.expiryDate <= CURRENT_TIMESTAMP + :days DAY AND p.isActive = true")
    List<Product> findExpiringProducts(@Param("days") int days);
    
    long countByIsActiveTrue();
}