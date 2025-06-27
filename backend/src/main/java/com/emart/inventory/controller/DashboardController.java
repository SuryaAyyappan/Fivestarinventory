package com.emart.inventory.controller;

import com.emart.inventory.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "http://localhost:3000")
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        Map<String, Object> stats = dashboardService.getDashboardStats();
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/low-stock")
    public ResponseEntity<Object> getLowStockProducts() {
        Object lowStockProducts = dashboardService.getLowStockProducts();
        return ResponseEntity.ok(lowStockProducts);
    }

    @GetMapping("/top-selling")
    public ResponseEntity<Object> getTopSellingProducts() {
        Object topSellingProducts = dashboardService.getTopSellingProducts();
        return ResponseEntity.ok(topSellingProducts);
    }

    @GetMapping("/expiring")
    public ResponseEntity<Object> getExpiringProducts(@RequestParam(defaultValue = "30") int days) {
        Object expiringProducts = dashboardService.getExpiringProducts(days);
        return ResponseEntity.ok(expiringProducts);
    }
}