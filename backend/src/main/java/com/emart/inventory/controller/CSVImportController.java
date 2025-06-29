package com.emart.inventory.controller;

import com.emart.inventory.entity.CSVImport;
import com.emart.inventory.entity.CSVImportItem;
import com.emart.inventory.service.CSVImportService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/csv-import")
@CrossOrigin(origins = "http://localhost:3000")
public class CSVImportController {

    private static final Logger logger = LoggerFactory.getLogger(CSVImportController.class);

    @Autowired
    private CSVImportService csvImportService;

    @PostMapping("/upload")
    public ResponseEntity<Map<String, Object>> uploadCSV(
            @RequestParam("file") MultipartFile file,
            @RequestHeader("role") String role,
            @RequestHeader("username") String username) {
        
        logger.info("CSV upload request from user: {} with role: {}", username, role);
        
        if (!"MAKER".equals(role) && !"ADMIN".equals(role)) {
            logger.warn("Forbidden: Only MAKER and ADMIN can upload CSV files. Role provided: {}", role);
            return ResponseEntity.status(403).body(Map.of("error", "Only MAKER and ADMIN can upload CSV files"));
        }
        
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "File is empty"));
        }
        
        if (!file.getOriginalFilename().toLowerCase().endsWith(".csv")) {
            return ResponseEntity.badRequest().body(Map.of("error", "Only CSV files are allowed"));
        }
        
        try {
            Map<String, Object> result = csvImportService.uploadCSV(file, username);
            
            if ((Boolean) result.get("success")) {
                return ResponseEntity.ok(result);
            } else {
                return ResponseEntity.badRequest().body(result);
            }
            
        } catch (Exception e) {
            logger.error("Error uploading CSV: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body(Map.of("error", "Failed to upload CSV: " + e.getMessage()));
        }
    }

    @GetMapping("/pending")
    public ResponseEntity<Map<String, Object>> getPendingImports(
            @RequestHeader("role") String role,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        logger.info("Get pending imports request from role: {}", role);
        
        if (!"CHECKER".equals(role) && !"ADMIN".equals(role)) {
            logger.warn("Forbidden: Only CHECKER and ADMIN can view pending imports. Role provided: {}", role);
            return ResponseEntity.status(403).body(Map.of("error", "Access denied"));
        }
        
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<CSVImport> imports = csvImportService.getPendingImports(pageable);
            
            Map<String, Object> response = new HashMap<>();
            response.put("imports", imports.getContent());
            response.put("total", imports.getTotalElements());
            response.put("totalPages", imports.getTotalPages());
            response.put("currentPage", imports.getNumber());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Error getting pending imports: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body(Map.of("error", "Failed to get pending imports"));
        }
    }

    @GetMapping("/{importId}/items")
    public ResponseEntity<Map<String, Object>> getImportItems(
            @PathVariable Long importId,
            @RequestHeader("role") String role) {
        
        logger.info("Get import items request for import ID: {} from role: {}", importId, role);
        
        if (!"CHECKER".equals(role) && !"ADMIN".equals(role)) {
            logger.warn("Forbidden: Only CHECKER and ADMIN can view import items. Role provided: {}", role);
            return ResponseEntity.status(403).body(Map.of("error", "Access denied"));
        }
        
        try {
            List<CSVImportItem> items = csvImportService.getImportItems(importId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("items", items);
            response.put("total", items.size());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Error getting import items: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body(Map.of("error", "Failed to get import items"));
        }
    }

    @PostMapping("/{importId}/approve")
    public ResponseEntity<Map<String, Object>> approveImport(
            @PathVariable Long importId,
            @RequestHeader("role") String role,
            @RequestHeader("username") String username) {
        
        logger.info("Approve import request for import ID: {} from user: {} with role: {}", importId, username, role);
        
        if (!"CHECKER".equals(role) && !"ADMIN".equals(role)) {
            logger.warn("Forbidden: Only CHECKER and ADMIN can approve imports. Role provided: {}", role);
            return ResponseEntity.status(403).body(Map.of("error", "Only CHECKER and ADMIN can approve imports"));
        }
        
        try {
            Map<String, Object> result = csvImportService.approveImport(importId, username);
            
            if ((Boolean) result.get("success")) {
                return ResponseEntity.ok(result);
            } else {
                return ResponseEntity.badRequest().body(result);
            }
            
        } catch (Exception e) {
            logger.error("Error approving import: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body(Map.of("error", "Failed to approve import: " + e.getMessage()));
        }
    }

    @PostMapping("/{importId}/reject")
    public ResponseEntity<Map<String, Object>> rejectImport(
            @PathVariable Long importId,
            @RequestHeader("role") String role,
            @RequestHeader("username") String username,
            @RequestBody Map<String, String> request) {
        
        logger.info("Reject import request for import ID: {} from user: {} with role: {}", importId, username, role);
        
        if (!"CHECKER".equals(role) && !"ADMIN".equals(role)) {
            logger.warn("Forbidden: Only CHECKER and ADMIN can reject imports. Role provided: {}", role);
            return ResponseEntity.status(403).body(Map.of("error", "Only CHECKER and ADMIN can reject imports"));
        }
        
        try {
            String reason = request.get("reason");
            Map<String, Object> result = csvImportService.rejectImport(importId, username, reason);
            
            if ((Boolean) result.get("success")) {
                return ResponseEntity.ok(result);
            } else {
                return ResponseEntity.badRequest().body(result);
            }
            
        } catch (Exception e) {
            logger.error("Error rejecting import: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body(Map.of("error", "Failed to reject import: " + e.getMessage()));
        }
    }

    @GetMapping("/template")
    public ResponseEntity<String> getCSVTemplate(@RequestHeader("role") String role) {
        logger.info("CSV template request from role: {}", role);
        
        if (!"MAKER".equals(role) && !"ADMIN".equals(role)) {
            logger.warn("Forbidden: Only MAKER and ADMIN can download CSV template. Role provided: {}", role);
            return ResponseEntity.status(403).build();
        }
        
        try {
            String template = csvImportService.getCSVTemplate();
            
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=product_import_template.csv")
                    .contentType(MediaType.parseMediaType("text/csv"))
                    .body(template);
            
        } catch (Exception e) {
            logger.error("Error getting CSV template: {}", e.getMessage(), e);
            return ResponseEntity.status(500).build();
        }
    }
} 