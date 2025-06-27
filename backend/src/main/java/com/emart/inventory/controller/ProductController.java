package com.emart.inventory.controller;

import com.emart.inventory.entity.Product;
import com.emart.inventory.service.ProductService;
import com.opencsv.CSVWriter;
import com.opencsv.bean.CsvToBean;
import com.opencsv.bean.CsvToBeanBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import java.io.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:3000")
public class ProductController {

    private static final Logger logger = LoggerFactory.getLogger(ProductController.class);

    @Autowired
    private ProductService productService;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllProducts(
            @RequestHeader("role") String role,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Long categoryId) {

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Product> productPage;

        if ("ADMIN".equalsIgnoreCase(role)) {
            productPage = productService.findByStatus(Product.Status.APPROVED, pageable);
        } else if ("CHECKER".equalsIgnoreCase(role)) {
            productPage = productService.findByStatus(Product.Status.PENDING, pageable);
        } else if ("MAKER".equalsIgnoreCase(role)) {
            productPage = productService.findByStatus(Product.Status.PENDING, pageable);
        } else {
            return ResponseEntity.status(403).body(Map.of("error", "Invalid role"));
        }

        List<ProductDTO> productDTOs = productPage.getContent().stream()
            .map(ProductDTO::new)
            .collect(Collectors.toList());

        Map<String, Object> response = new HashMap<>();
        response.put("products", productDTOs);
        response.put("total", productPage.getTotalElements());
        response.put("totalPages", productPage.getTotalPages());
        response.put("currentPage", productPage.getNumber());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        return productService.getProductById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/sku/{sku}")
    public ResponseEntity<Product> getProductBySku(@PathVariable String sku) {
        return productService.getProductBySku(sku)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> createProduct(@Valid @RequestBody Map<String, Object> productData, @RequestHeader("role") String role) {
        logger.info("Received request to create product: {} by role: {}", productData, role);
        if (!"MAKER".equals(role)) {
            logger.warn("Forbidden: Only MAKER can add products. Role provided: {}", role);
            return ResponseEntity.status(403).body("Only MAKER can add products");
        }
        try {
            Product product = new Product();
            product.setName((String) productData.get("name"));
            product.setDescription((String) productData.get("description"));
            product.setSku((String) productData.get("sku"));
            product.setUnit((String) productData.get("unit"));
            if (productData.get("purchasePrice") != null) {
                product.setPurchasePrice(new java.math.BigDecimal(productData.get("purchasePrice").toString()));
            }
            if (productData.get("mrp") != null) {
                product.setMrp(new java.math.BigDecimal(productData.get("mrp").toString()));
            }
            if (productData.get("minStockLevel") != null) {
                product.setMinStockLevel(Integer.parseInt(productData.get("minStockLevel").toString()));
            }
            if (productData.get("maxStockLevel") != null) {
                product.setMaxStockLevel(Integer.parseInt(productData.get("maxStockLevel").toString()));
            }
            if (productData.get("manufacturerCode") != null) {
                product.setManufacturerCode((String) productData.get("manufacturerCode"));
            }
            if (productData.get("expiryDate") != null) {
                product.setExpiryDate(java.time.LocalDateTime.parse((String) productData.get("expiryDate") + "T00:00:00"));
            }
            if (productData.get("manufacturerDate") != null) {
                product.setManufacturerDate(java.time.LocalDateTime.parse((String) productData.get("manufacturerDate") + "T00:00:00"));
            }
            product.setStatus(Product.Status.PENDING);
            Product savedProduct = productService.createProduct(product);
            logger.info("Product saved successfully: {}", savedProduct);
            return ResponseEntity.ok(savedProduct);
        } catch (Exception e) {
            logger.error("Error saving product: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body("Error saving product: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @Valid @RequestBody Product product) {
        try {
            // Ensure manufacturerCode, expiryDate, and manufacturerDate are set if present
            Product updatedProduct = productService.updateProduct(id, product);
            return ResponseEntity.ok(updatedProduct);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        try {
            productService.deleteProduct(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/import")
    public ResponseEntity<Map<String, Object>> importProducts(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "File is empty"));
        }

        try (Reader reader = new BufferedReader(new InputStreamReader(file.getInputStream()))) {
            CsvToBean<Product> csvToBean = new CsvToBeanBuilder<Product>(reader)
                    .withType(Product.class)
                    .withIgnoreLeadingWhiteSpace(true)
                    .build();

            List<Product> products = csvToBean.parse();
            int imported = 0;
            
            for (Product product : products) {
                try {
                    // Set missing fields if needed (e.g., status)
                    if (product.getStatus() == null) {
                        product.setStatus(Product.Status.PENDING);
                    }
                    // Ensure manufacturerCode, expiryDate, manufacturerDate are set if present in CSV
                    // No action needed if already mapped by CSV
                    productService.createProduct(product);
                    imported++;
                } catch (Exception e) {
                    // Log error but continue processing
                }
            }

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Import completed");
            response.put("imported", imported);
            response.put("total", products.size());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to import products: " + e.getMessage()));
        }
    }

    @GetMapping("/export")
    public void exportProducts(HttpServletResponse response) throws IOException {
        response.setContentType("text/csv");
        response.setHeader(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=products.csv");

        List<Product> products = productService.getAllProducts();
        
        try (CSVWriter writer = new CSVWriter(response.getWriter())) {
            // Write header
            String[] header = {"ID", "Name", "SKU", "Description", "Unit", "Purchase Price", "MRP", "Min Stock", "Max Stock", "Expiry Date", "Manufacturer Date", "Manufacturer Code"};
            writer.writeNext(header);

            // Write data
            for (Product product : products) {
                String[] data = {
                    product.getId() != null ? product.getId().toString() : "",
                    product.getName(),
                    product.getSku(),
                    product.getDescription(),
                    product.getUnit(),
                    product.getPurchasePrice() != null ? product.getPurchasePrice().toString() : "",
                    product.getMrp() != null ? product.getMrp().toString() : "",
                    product.getMinStockLevel() != null ? product.getMinStockLevel().toString() : "",
                    product.getMaxStockLevel() != null ? product.getMaxStockLevel().toString() : "",
                    product.getExpiryDate() != null ? product.getExpiryDate().toString() : "",
                    product.getManufacturerDate() != null ? product.getManufacturerDate().toString() : "",
                    product.getManufacturerCode() != null ? product.getManufacturerCode() : ""
                };
                writer.writeNext(data);
            }
        }
    }

    @PostMapping("/{id}/approve")
    public ResponseEntity<?> approveProduct(@PathVariable Long id, @RequestHeader("role") String role) {
        if (!"CHECKER".equalsIgnoreCase(role)) {
            return ResponseEntity.status(403).body("Only CHECKER can approve products");
        }
        var productOpt = productService.getProductById(id);
        if (productOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        var product = productOpt.get();
        product.setStatus(Product.Status.APPROVED);
        productService.createProduct(product); // Save the updated product
        return ResponseEntity.ok(product);
    }

    @PostMapping("/{id}/reject")
    public ResponseEntity<?> rejectProduct(@PathVariable Long id, @RequestHeader("role") String role) {
        if (!"CHECKER".equalsIgnoreCase(role)) {
            return ResponseEntity.status(403).body("Only CHECKER can reject products");
        }
        var productOpt = productService.getProductById(id);
        if (productOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        var product = productOpt.get();
        product.setStatus(Product.Status.REJECTED);
        productService.createProduct(product); // Save the updated product
        return ResponseEntity.ok(product);
    }

    // DTO for safe serialization
    static class ProductDTO {
        public Long id;
        public String name;
        public String sku;
        public String description;
        public String unit;
        public java.math.BigDecimal purchasePrice;
        public java.math.BigDecimal mrp;
        public Integer minStockLevel;
        public Integer maxStockLevel;
        public String status;
        public String categoryName;
        public String supplierName;
        public String expiryDate;
        public String manufacturerDate;
        public String manufacturerCode;

        public ProductDTO(Product p) {
            this.id = p.getId();
            this.name = p.getName();
            this.sku = p.getSku();
            this.description = p.getDescription();
            this.unit = p.getUnit();
            this.purchasePrice = p.getPurchasePrice();
            this.mrp = p.getMrp();
            this.minStockLevel = p.getMinStockLevel();
            this.maxStockLevel = p.getMaxStockLevel();
            this.status = p.getStatus() != null ? p.getStatus().name() : null;
            this.categoryName = p.getCategory() != null ? p.getCategory().getName() : null;
            this.supplierName = p.getSupplier() != null ? p.getSupplier().getName() : null;
            this.expiryDate = p.getExpiryDate() != null ? p.getExpiryDate().toString() : null;
            this.manufacturerDate = p.getManufacturerDate() != null ? p.getManufacturerDate().toString() : null;
            this.manufacturerCode = p.getManufacturerCode();
        }
    }
}