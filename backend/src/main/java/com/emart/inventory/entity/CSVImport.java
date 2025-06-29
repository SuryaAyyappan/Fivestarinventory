package com.emart.inventory.entity;

import jakarta.persistence.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "csv_imports")
@EntityListeners(AuditingEntityListener.class)
public class CSVImport {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fileName;
    private String uploadedBy;
    private Integer totalRecords;
    private Integer validRecords;
    private Integer invalidRecords;

    @Enumerated(EnumType.STRING)
    private Status status = Status.PENDING;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String errorDetails;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "csvImport", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<CSVImportItem> importItems;

    public enum Status {
        PENDING, APPROVED, REJECTED
    }

    // Constructors
    public CSVImport() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getFileName() { return fileName; }
    public void setFileName(String fileName) { this.fileName = fileName; }

    public String getUploadedBy() { return uploadedBy; }
    public void setUploadedBy(String uploadedBy) { this.uploadedBy = uploadedBy; }

    public Integer getTotalRecords() { return totalRecords; }
    public void setTotalRecords(Integer totalRecords) { this.totalRecords = totalRecords; }

    public Integer getValidRecords() { return validRecords; }
    public void setValidRecords(Integer validRecords) { this.validRecords = validRecords; }

    public Integer getInvalidRecords() { return invalidRecords; }
    public void setInvalidRecords(Integer invalidRecords) { this.invalidRecords = invalidRecords; }

    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }

    public String getErrorDetails() { return errorDetails; }
    public void setErrorDetails(String errorDetails) { this.errorDetails = errorDetails; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public List<CSVImportItem> getImportItems() { return importItems; }
    public void setImportItems(List<CSVImportItem> importItems) { this.importItems = importItems; }
} 