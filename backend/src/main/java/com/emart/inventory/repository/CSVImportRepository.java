package com.emart.inventory.repository;

import com.emart.inventory.entity.CSVImport;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CSVImportRepository extends JpaRepository<CSVImport, Long> {
    
    List<CSVImport> findByStatusOrderByCreatedAtDesc(CSVImport.Status status);
    
    Page<CSVImport> findByStatusOrderByCreatedAtDesc(CSVImport.Status status, Pageable pageable);
    
    @Query("SELECT c FROM CSVImport c WHERE c.uploadedBy = ?1 ORDER BY c.createdAt DESC")
    List<CSVImport> findByUploadedByOrderByCreatedAtDesc(String uploadedBy);
    
    @Query("SELECT c FROM CSVImport c WHERE c.uploadedBy = ?1 AND c.status = ?2 ORDER BY c.createdAt DESC")
    List<CSVImport> findByUploadedByAndStatusOrderByCreatedAtDesc(String uploadedBy, CSVImport.Status status);
} 