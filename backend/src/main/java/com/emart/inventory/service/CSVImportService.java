package com.emart.inventory.service;

import com.emart.inventory.dto.ProductCSVDTO;
import com.emart.inventory.entity.*;
import com.emart.inventory.repository.CSVImportItemRepository;
import com.emart.inventory.repository.CSVImportRepository;
import com.emart.inventory.repository.InventoryRepository;
import com.emart.inventory.util.CSVHelper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class CSVImportService {

    private static final Logger logger = LoggerFactory.getLogger(CSVImportService.class);

    @Autowired
    private CSVImportRepository csvImportRepository;

    @Autowired
    private CSVImportItemRepository csvImportItemRepository;

    @Autowired
    private ProductService productService;

    @Autowired
    private CategoryService categoryService;

    @Autowired
    private SupplierService supplierService;

    @Autowired
    private InventoryRepository inventoryRepository;

    @Transactional
    public Map<String, Object> uploadCSV(MultipartFile file, String uploadedBy) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Parse CSV file
            List<ProductCSVDTO> csvData = CSVHelper.convert(file);
            
            // Create CSV Import record
            CSVImport csvImport = new CSVImport();
            csvImport.setFileName(file.getOriginalFilename());
            csvImport.setUploadedBy(uploadedBy);
            csvImport.setTotalRecords(csvData.size());
            csvImport.setStatus(CSVImport.Status.PENDING);
            
            CSVImport savedImport = csvImportRepository.save(csvImport);
            
            // Process each CSV row and create import items
            List<CSVImportItem> importItems = new ArrayList<>();
            int validRecords = 0;
            int invalidRecords = 0;
            List<String> errors = new ArrayList<>();
            
            for (int i = 0; i < csvData.size(); i++) {
                ProductCSVDTO dto = csvData.get(i);
                CSVImportItem item = new CSVImportItem();
                item.setCsvImport(savedImport);
                
                // Map DTO to Import Item
                item.setName(dto.getName());
                item.setDescription(dto.getDescription());
                item.setSku(dto.getSku());
                item.setBarcode(dto.getBarcode());
                item.setCategoryName(dto.getCategoryName());
                item.setSupplierName(dto.getSupplierName());
                item.setUnit(dto.getUnit());
                item.setPurchasePrice(dto.getPurchasePrice());
                item.setMrp(dto.getMrp());
                item.setMinStockLevel(dto.getMinStockLevel());
                item.setMaxStockLevel(dto.getMaxStockLevel());
                item.setExpiryDate(dto.getExpiryDate());
                item.setManufacturerDate(dto.getManufacturerDate());
                item.setBatchNumber(dto.getBatchNumber());
                item.setManufacturerCode(dto.getManufacturerCode());
                item.setQuantity(dto.getQuantity());
                item.setSupplierEmail(dto.getSupplierEmail());
                item.setSupplierPhone(dto.getSupplierPhone());
                item.setSupplierAddress(dto.getSupplierAddress());
                
                // Validate the item
                String validationError = validateImportItem(dto);
                if (validationError != null) {
                    item.setStatus(CSVImportItem.Status.REJECTED);
                    item.setErrorMessage(validationError);
                    invalidRecords++;
                    errors.add("Row " + (i + 2) + ": " + validationError);
                } else {
                    item.setStatus(CSVImportItem.Status.PENDING);
                    validRecords++;
                }
                
                importItems.add(item);
            }
            
            // Save all import items
            csvImportItemRepository.saveAll(importItems);
            
            // Update import record with counts
            savedImport.setValidRecords(validRecords);
            savedImport.setInvalidRecords(invalidRecords);
            if (!errors.isEmpty()) {
                savedImport.setErrorDetails(String.join("\n", errors));
            }
            csvImportRepository.save(savedImport);
            
            response.put("success", true);
            response.put("importId", savedImport.getId());
            response.put("totalRecords", csvData.size());
            response.put("validRecords", validRecords);
            response.put("invalidRecords", invalidRecords);
            response.put("message", "CSV uploaded successfully. Waiting for checker approval.");
            
        } catch (Exception e) {
            logger.error("Error uploading CSV: {}", e.getMessage(), e);
            response.put("success", false);
            response.put("error", "Failed to upload CSV: " + e.getMessage());
        }
        
        return response;
    }

    private String validateImportItem(ProductCSVDTO dto) {
        // Basic validation
        if (dto.getName() == null || dto.getName().trim().isEmpty()) {
            return "Product name is required";
        }
        
        if (dto.getSku() == null || dto.getSku().trim().isEmpty()) {
            return "SKU is required";
        }
        
        if (dto.getManufacturerCode() == null || dto.getManufacturerCode().trim().isEmpty()) {
            return "Manufacturer code is required";
        }
        
        if (dto.getManufacturerCode().length() != 5) {
            return "Manufacturer code must be exactly 5 digits";
        }
        
        // Check if SKU already exists
        if (productService.getProductBySku(dto.getSku()).isPresent()) {
            return "SKU already exists: " + dto.getSku();
        }
        
        // Validate dates if provided
        if (dto.getExpiryDate() != null && !dto.getExpiryDate().trim().isEmpty()) {
            try {
                LocalDateTime.parse(dto.getExpiryDate() + "T00:00:00");
            } catch (Exception e) {
                return "Invalid expiry date format. Use YYYY-MM-DD";
            }
        }
        
        if (dto.getManufacturerDate() != null && !dto.getManufacturerDate().trim().isEmpty()) {
            try {
                LocalDateTime.parse(dto.getManufacturerDate() + "T00:00:00");
            } catch (Exception e) {
                return "Invalid manufacturer date format. Use YYYY-MM-DD";
            }
        }
        
        return null; // No validation errors
    }

    public Page<CSVImport> getPendingImports(Pageable pageable) {
        return csvImportRepository.findByStatusOrderByCreatedAtDesc(CSVImport.Status.PENDING, pageable);
    }

    public List<CSVImportItem> getImportItems(Long importId) {
        return csvImportItemRepository.findByCsvImportIdOrderByCreatedAtAsc(importId);
    }

    @Transactional
    public Map<String, Object> approveImport(Long importId, String approvedBy) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            CSVImport csvImport = csvImportRepository.findById(importId)
                    .orElseThrow(() -> new RuntimeException("Import not found"));
            
            if (csvImport.getStatus() != CSVImport.Status.PENDING) {
                response.put("success", false);
                response.put("error", "Import is not in pending status");
                return response;
            }
            
            List<CSVImportItem> items = csvImportItemRepository.findByCsvImportIdAndStatusOrderByCreatedAtAsc(
                    importId, CSVImportItem.Status.PENDING);
            
            int processedCount = 0;
            List<String> errors = new ArrayList<>();
            
            for (CSVImportItem item : items) {
                try {
                    // Create or find category
                    Category category = null;
                    if (item.getCategoryName() != null && !item.getCategoryName().trim().isEmpty()) {
                        category = categoryService.findByName(item.getCategoryName())
                                .orElseGet(() -> {
                                    Category newCategory = new Category();
                                    newCategory.setName(item.getCategoryName());
                                    return categoryService.createCategory(newCategory);
                                });
                    }
                    
                    // Create or find supplier
                    Supplier supplier = supplierService.findByName(item.getSupplierName()).orElse(null);
                    if (supplier == null) {
                        supplier = new Supplier();
                        supplier.setName(item.getSupplierName());
                    }
                    // Update supplier details from CSV if present
                    if (item.getSupplierEmail() != null && !item.getSupplierEmail().isEmpty()) {
                        supplier.setEmail(item.getSupplierEmail());
                    }
                    if (item.getSupplierPhone() != null && !item.getSupplierPhone().isEmpty()) {
                        supplier.setPhone(item.getSupplierPhone());
                    }
                    if (item.getSupplierAddress() != null && !item.getSupplierAddress().isEmpty()) {
                        supplier.setAddress(item.getSupplierAddress());
                    }
                    supplierService.createSupplier(supplier);
                    
                    // Create product
                    Product product = new Product();
                    product.setName(item.getName());
                    product.setDescription(item.getDescription());
                    product.setSku(item.getSku());
                    product.setBarcode(item.getBarcode());
                    product.setCategory(category);
                    product.setSupplier(supplier);
                    product.setUnit(item.getUnit() != null ? item.getUnit() : "pcs");
                    product.setPurchasePrice(item.getPurchasePrice() != null ? item.getPurchasePrice() : java.math.BigDecimal.ZERO);
                    product.setMrp(item.getMrp() != null ? item.getMrp() : java.math.BigDecimal.ZERO);
                    product.setMinStockLevel(item.getMinStockLevel() != null ? item.getMinStockLevel() : 0);
                    product.setMaxStockLevel(item.getMaxStockLevel() != null ? item.getMaxStockLevel() : 1000);
                    product.setManufacturerCode(item.getManufacturerCode());
                    product.setStatus(Product.Status.APPROVED); // Direct approval
                    product.setIsActive(true);
                    
                    // Set dates if provided
                    if (item.getExpiryDate() != null && !item.getExpiryDate().trim().isEmpty()) {
                        product.setExpiryDate(LocalDateTime.parse(item.getExpiryDate() + "T00:00:00"));
                    }
                    if (item.getManufacturerDate() != null && !item.getManufacturerDate().trim().isEmpty()) {
                        product.setManufacturerDate(LocalDateTime.parse(item.getManufacturerDate() + "T00:00:00"));
                    }
                    // Set quantity from CSV
                    product.setQuantity(item.getQuantity());
                    productService.createProduct(product);
                    
                    // Mark item as processed
                    item.setStatus(CSVImportItem.Status.PROCESSED);
                    csvImportItemRepository.save(item);
                    
                    processedCount++;
                    
                } catch (Exception e) {
                    logger.error("Error processing import item {}: {}", item.getId(), e.getMessage());
                    item.setStatus(CSVImportItem.Status.REJECTED);
                    item.setErrorMessage(e.getMessage());
                    csvImportItemRepository.save(item);
                    errors.add("Item " + item.getName() + ": " + e.getMessage());
                }
            }
            
            // Update import status
            csvImport.setStatus(CSVImport.Status.APPROVED);
            csvImportRepository.save(csvImport);
            
            response.put("success", true);
            response.put("processedCount", processedCount);
            response.put("totalItems", items.size());
            response.put("errors", errors);
            response.put("message", "Import approved successfully. " + processedCount + " products created.");
            
        } catch (Exception e) {
            logger.error("Error approving import: {}", e.getMessage(), e);
            response.put("success", false);
            response.put("error", "Failed to approve import: " + e.getMessage());
        }
        
        return response;
    }

    @Transactional
    public Map<String, Object> rejectImport(Long importId, String rejectedBy, String reason) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            CSVImport csvImport = csvImportRepository.findById(importId)
                    .orElseThrow(() -> new RuntimeException("Import not found"));
            
            if (csvImport.getStatus() != CSVImport.Status.PENDING) {
                response.put("success", false);
                response.put("error", "Import is not in pending status");
                return response;
            }
            
            // Update import status
            csvImport.setStatus(CSVImport.Status.REJECTED);
            csvImport.setErrorDetails("Rejected by " + rejectedBy + ": " + reason);
            csvImportRepository.save(csvImport);
            
            // Mark all pending items as rejected
            List<CSVImportItem> pendingItems = csvImportItemRepository.findByCsvImportIdAndStatusOrderByCreatedAtAsc(
                    importId, CSVImportItem.Status.PENDING);
            
            for (CSVImportItem item : pendingItems) {
                item.setStatus(CSVImportItem.Status.REJECTED);
                item.setErrorMessage("Import rejected: " + reason);
                csvImportItemRepository.save(item);
            }
            
            response.put("success", true);
            response.put("message", "Import rejected successfully");
            
        } catch (Exception e) {
            logger.error("Error rejecting import: {}", e.getMessage(), e);
            response.put("success", false);
            response.put("error", "Failed to reject import: " + e.getMessage());
        }
        
        return response;
    }

    public String getCSVTemplate() {
        return CSVHelper.getCSVTemplate();
    }
} 