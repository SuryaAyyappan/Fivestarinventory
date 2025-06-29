package com.emart.inventory.controller;

import com.emart.inventory.entity.Outlet;
import com.emart.inventory.service.OutletService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/outlets")
@CrossOrigin(origins = "*")
public class OutletController {
    @Autowired
    private OutletService outletService;

    @PostMapping
    public ResponseEntity<Outlet> createOutlet(@RequestBody Outlet outlet) {
        Outlet savedOutlet = outletService.saveOutlet(outlet);
        return ResponseEntity.ok(savedOutlet);
    }

    @GetMapping
    public ResponseEntity<List<Outlet>> getAllOutlets() {
        return ResponseEntity.ok(outletService.getAllOutlets());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Outlet> getOutletById(@PathVariable Long id) {
        Optional<Outlet> outlet = outletService.getOutletById(id);
        return outlet.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOutlet(@PathVariable Long id) {
        outletService.deleteOutlet(id);
        return ResponseEntity.noContent().build();
    }
} 