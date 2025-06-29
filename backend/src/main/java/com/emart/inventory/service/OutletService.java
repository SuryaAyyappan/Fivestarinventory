package com.emart.inventory.service;

import com.emart.inventory.entity.Outlet;
import com.emart.inventory.repository.OutletRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class OutletService {
    @Autowired
    private OutletRepository outletRepository;

    public Outlet saveOutlet(Outlet outlet) {
        return outletRepository.save(outlet);
    }

    public List<Outlet> getAllOutlets() {
        return outletRepository.findAll();
    }

    public Optional<Outlet> getOutletById(Long id) {
        return outletRepository.findById(id);
    }

    public void deleteOutlet(Long id) {
        outletRepository.deleteById(id);
    }
} 