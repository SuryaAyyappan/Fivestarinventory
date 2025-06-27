package com.emart.inventory.repository;

import com.emart.inventory.entity.Inventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface InventoryRepository extends JpaRepository<Inventory, Long> {
    
    List<Inventory> findByProductId(Long productId);
    
    Optional<Inventory> findByProductIdAndLocation(Long productId, String location);
    
    List<Inventory> findByLocation(String location);
    
    @Query("SELECT COUNT(DISTINCT i.product.id) FROM Inventory i WHERE i.quantityInStock <= i.product.minStockLevel")
    long countLowStockProducts();

    @Query("SELECT SUM(i.quantityInStock * p.purchasePrice) FROM Inventory i JOIN i.product p WHERE p.isActive = true")
    BigDecimal getTotalStockValue();
}