package com.emart.inventory.util;

import com.emart.inventory.dto.ProductCSVDTO;
import com.opencsv.CSVReader;
import com.opencsv.exceptions.CsvValidationException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

public class CSVHelper {
    
    private static final Logger logger = LoggerFactory.getLogger(CSVHelper.class);
    
    public static List<ProductCSVDTO> convert(MultipartFile file) {
        List<ProductCSVDTO> list = new ArrayList<>();
        
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream()));
             CSVReader csvReader = new CSVReader(reader)) {
            
            // Skip header row
            String[] header = csvReader.readNext();
            if (header == null) {
                throw new RuntimeException("CSV file is empty");
            }
            
            String[] line;
            int lineNumber = 1; // Start from 1 since we skipped header
            
            while ((line = csvReader.readNext()) != null) {
                lineNumber++;
                try {
                    ProductCSVDTO dto = new ProductCSVDTO();
                    
                    // Map CSV columns to DTO fields
                    if (line.length > 0) dto.setName(line[0]);
                    if (line.length > 1) dto.setDescription(line[1]);
                    if (line.length > 2) dto.setSku(line[2]);
                    if (line.length > 3) dto.setBarcode(line[3]);
                    if (line.length > 4) dto.setCategoryName(line[4]);
                    if (line.length > 5) dto.setSupplierName(line[5]);
                    if (line.length > 6) dto.setUnit(line[6]);
                    
                    // Handle numeric fields
                    if (line.length > 7 && !line[7].trim().isEmpty()) {
                        try {
                            dto.setPurchasePrice(new BigDecimal(line[7]));
                        } catch (NumberFormatException e) {
                            logger.warn("Invalid purchase price at line {}: {}", lineNumber, line[7]);
                        }
                    }
                    
                    if (line.length > 8 && !line[8].trim().isEmpty()) {
                        try {
                            dto.setMrp(new BigDecimal(line[8]));
                        } catch (NumberFormatException e) {
                            logger.warn("Invalid MRP at line {}: {}", lineNumber, line[8]);
                        }
                    }
                    
                    if (line.length > 9 && !line[9].trim().isEmpty()) {
                        try {
                            dto.setMinStockLevel(Integer.parseInt(line[9]));
                        } catch (NumberFormatException e) {
                            logger.warn("Invalid min stock level at line {}: {}", lineNumber, line[9]);
                        }
                    }
                    
                    if (line.length > 10 && !line[10].trim().isEmpty()) {
                        try {
                            dto.setMaxStockLevel(Integer.parseInt(line[10]));
                        } catch (NumberFormatException e) {
                            logger.warn("Invalid max stock level at line {}: {}", lineNumber, line[10]);
                        }
                    }
                    
                    // Handle date fields
                    if (line.length > 11) dto.setExpiryDate(line[11]);
                    if (line.length > 12) dto.setManufacturerDate(line[12]);
                    if (line.length > 13) dto.setBatchNumber(line[13]);
                    if (line.length > 14) dto.setManufacturerCode(line[14]);
                    // Handle units column
                    if (line.length > 15 && !line[15].trim().isEmpty()) {
                        try {
                            dto.setQuantity(Integer.parseInt(line[15]));
                        } catch (NumberFormatException e) {
                            logger.warn("Invalid quantity at line {}: {}", lineNumber, line[15]);
                        }
                    }
                    
                    if (line.length > 16) dto.setSupplierEmail(line[16]);
                    if (line.length > 17) dto.setSupplierPhone(line[17]);
                    if (line.length > 18) dto.setSupplierAddress(line[18]);
                    
                    list.add(dto);
                    
                } catch (Exception e) {
                    logger.error("Error processing line {}: {}", lineNumber, e.getMessage());
                    // Continue processing other lines
                }
            }
            
        } catch (IOException | CsvValidationException e) {
            logger.error("Error reading CSV file: {}", e.getMessage());
            throw new RuntimeException("CSV parse error: " + e.getMessage());
        }
        
        return list;
    }
    
    public static String getCSVTemplate() {
        return "name,description,sku,barcode,categoryName,supplierName,unit,purchasePrice,mrp,minStockLevel,maxStockLevel,expiryDate,manufacturerDate,batchNumber,manufacturerCode,quantity,supplierEmail,supplierPhone,supplierAddress\n" +
               "Sample Product,Sample Description,SKU001,1234567890123,Electronics,Supplier A,pcs,100.00,150.00,10,100,2024-12-31,2024-01-01,BATCH001,12345,50,supplier@email.com,1234567890,123 Main St";
    }
} 