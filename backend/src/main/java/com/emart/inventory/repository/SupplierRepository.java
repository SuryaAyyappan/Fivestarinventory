package com.emart.inventory.repository;

import com.emart.inventory.entity.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SupplierRepository extends JpaRepository<Supplier, Long> {
    List<Supplier> findByIsActiveTrueOrderByNameAsc();
    long countByIsActiveTrue();
    Optional<Supplier> findByName(String name);
}