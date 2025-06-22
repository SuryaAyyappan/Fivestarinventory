package com.emart.inventory.service;

import com.emart.inventory.entity.Supplier;
import com.emart.inventory.repository.SupplierRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class SupplierService {

    @Autowired
    private SupplierRepository supplierRepository;

    public List<Supplier> getAllSuppliers() {
        return supplierRepository.findByIsActiveTrueOrderByNameAsc();
    }

    public Optional<Supplier> getSupplierById(Long id) {
        return supplierRepository.findById(id).filter(Supplier::getIsActive);
    }

    public Supplier createSupplier(Supplier supplier) {
        return supplierRepository.save(supplier);
    }

    public Supplier updateSupplier(Long id, Supplier supplierDetails) {
        return supplierRepository.findById(id)
                .filter(Supplier::getIsActive)
                .map(supplier -> {
                    supplier.setName(supplierDetails.getName());
                    supplier.setContactPerson(supplierDetails.getContactPerson());
                    supplier.setEmail(supplierDetails.getEmail());
                    supplier.setPhone(supplierDetails.getPhone());
                    supplier.setAddress(supplierDetails.getAddress());
                    supplier.setCity(supplierDetails.getCity());
                    supplier.setState(supplierDetails.getState());
                    supplier.setPincode(supplierDetails.getPincode());
                    supplier.setGstNumber(supplierDetails.getGstNumber());
                    return supplierRepository.save(supplier);
                })
                .orElseThrow(() -> new RuntimeException("Supplier not found with id: " + id));
    }

    public void deleteSupplier(Long id) {
        supplierRepository.findById(id)
                .filter(Supplier::getIsActive)
                .map(supplier -> {
                    supplier.setIsActive(false);
                    return supplierRepository.save(supplier);
                })
                .orElseThrow(() -> new RuntimeException("Supplier not found with id: " + id));
    }

    public long getTotalSuppliersCount() {
        return supplierRepository.countByIsActiveTrue();
    }
}