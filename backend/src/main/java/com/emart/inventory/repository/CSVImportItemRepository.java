package com.emart.inventory.repository;

import com.emart.inventory.entity.CSVImportItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CSVImportItemRepository extends JpaRepository<CSVImportItem, Long> {
    
    List<CSVImportItem> findByCsvImportIdOrderByCreatedAtAsc(Long csvImportId);
    
    List<CSVImportItem> findByCsvImportIdAndStatusOrderByCreatedAtAsc(Long csvImportId, CSVImportItem.Status status);
    
    @Query("SELECT COUNT(i) FROM CSVImportItem i WHERE i.csvImport.id = ?1 AND i.status = ?2")
    Long countByCsvImportIdAndStatus(Long csvImportId, CSVImportItem.Status status);
} 