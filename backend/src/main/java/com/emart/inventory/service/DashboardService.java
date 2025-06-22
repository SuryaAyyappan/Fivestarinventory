package com.emart.inventory.service;

import com.emart.inventory.repository.InventoryRepository;
import com.emart.inventory.repository.ProductRepository;
import com.emart.inventory.repository.SupplierRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.*;

@Service
public class DashboardService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private SupplierRepository supplierRepository;

    @Autowired
    private InventoryRepository inventoryRepository;

    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        
        // Get basic counts
        long totalProducts = productRepository.countByIsActiveTrue();
        long totalSuppliers = supplierRepository.countByIsActiveTrue();
        long lowStockCount = inventoryRepository.countLowStockProducts();
        
        // Get total stock value (default to 0 if null)
        BigDecimal totalStockValue = inventoryRepository.getTotalStockValue();
        if (totalStockValue == null) {
            totalStockValue = BigDecimal.ZERO;
        }
        
        // Mock revenue data for demo
        BigDecimal totalRevenue = BigDecimal.valueOf(3456789);
        double monthlyGrowth = 12.5;
        
        stats.put("totalProducts", totalProducts);
        stats.put("totalSuppliers", totalSuppliers);
        stats.put("totalStockValue", totalStockValue);
        stats.put("lowStockAlerts", lowStockCount);
        stats.put("totalRevenue", totalRevenue);
        stats.put("monthlyGrowth", monthlyGrowth);
        
        return stats;
    }

    public Object getLowStockProducts() {
        try {
            return productRepository.findLowStockProducts();
        } catch (Exception e) {
            // Return empty list if there's an error
            return new ArrayList<>();
        }
    }

    public Object getTopSellingProducts() {
        // Mock data for top selling products
        List<Map<String, Object>> topProducts = new ArrayList<>();
        
        Map<String, Object> product1 = new HashMap<>();
        product1.put("name", "Premium Basmati Rice");
        product1.put("sales", 45230);
        product1.put("growth", 15.2);
        topProducts.add(product1);
        
        Map<String, Object> product2 = new HashMap<>();
        product2.put("name", "Organic Honey");
        product2.put("sales", 32100);
        product2.put("growth", 8.7);
        topProducts.add(product2);
        
        Map<String, Object> product3 = new HashMap<>();
        product3.put("name", "Fresh Milk 1L");
        product3.put("sales", 28950);
        product3.put("growth", 12.1);
        topProducts.add(product3);
        
        return topProducts;
    }

    public Object getExpiringProducts(int days) {
        try {
            return productRepository.findExpiringProducts(days);
        } catch (Exception e) {
            // Return empty list if there's an error
            return new ArrayList<>();
        }
    }
}