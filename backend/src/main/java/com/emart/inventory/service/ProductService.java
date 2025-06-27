package com.emart.inventory.service;

import com.emart.inventory.entity.Product;
import com.emart.inventory.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    public List<Product> getAllProducts() {
        return productRepository.findByIsActiveTrue();
    }

    public Page<Product> getProducts(Pageable pageable) {
        return productRepository.findByIsActiveTrue(pageable);
    }

    public Page<Product> searchProducts(String search, Long categoryId, Pageable pageable) {
        if (search != null && !search.trim().isEmpty() && categoryId != null) {
            return productRepository.findByIsActiveTrueAndNameContainingIgnoreCaseAndCategoryId(
                    search.trim(), categoryId, pageable);
        } else if (search != null && !search.trim().isEmpty()) {
            return productRepository.findByIsActiveTrueAndNameContainingIgnoreCase(
                    search.trim(), pageable);
        } else if (categoryId != null) {
            return productRepository.findByIsActiveTrueAndCategoryId(categoryId, pageable);
        } else {
            return productRepository.findByIsActiveTrue(pageable);
        }
    }

    public Page<Product> searchProductsAll(String search, Long categoryId, Pageable pageable) {
        if (search != null && !search.trim().isEmpty() && categoryId != null) {
            return productRepository.findByNameContainingIgnoreCaseAndCategoryId(
                search.trim(), categoryId, pageable);
        } else if (search != null && !search.trim().isEmpty()) {
            return productRepository.findByNameContainingIgnoreCase(
                search.trim(), pageable);
        } else if (categoryId != null) {
            return productRepository.findByCategoryId(categoryId, pageable);
        } else {
            return productRepository.findAll(pageable);
        }
    }

    public Optional<Product> getProductById(Long id) {
        return productRepository.findById(id).filter(Product::getIsActive);
    }

    public Optional<Product> getProductBySku(String sku) {
        return productRepository.findBySku(sku).filter(Product::getIsActive);
    }

    public Product createProduct(Product product) {
        return productRepository.save(product);
    }

    public Product updateProduct(Long id, Product productDetails) {
        return productRepository.findById(id)
                .filter(Product::getIsActive)
                .map(product -> {
                    product.setName(productDetails.getName());
                    product.setDescription(productDetails.getDescription());
                    product.setSku(productDetails.getSku());
                    product.setBarcode(productDetails.getBarcode());
                    product.setCategory(productDetails.getCategory());
                    product.setSupplier(productDetails.getSupplier());
                    product.setUnit(productDetails.getUnit());
                    product.setPurchasePrice(productDetails.getPurchasePrice());
                    product.setMrp(productDetails.getMrp());
                    product.setMinStockLevel(productDetails.getMinStockLevel());
                    product.setMaxStockLevel(productDetails.getMaxStockLevel());
                    product.setExpiryDate(productDetails.getExpiryDate());
                    product.setManufacturerDate(productDetails.getManufacturerDate());
                    product.setManufacturerCode(productDetails.getManufacturerCode());
                    product.setBatchNumber(productDetails.getBatchNumber());
                    return productRepository.save(product);
                })
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
    }

    public void deleteProduct(Long id) {
        productRepository.findById(id)
                .filter(Product::getIsActive)
                .map(product -> {
                    product.setIsActive(false);
                    return productRepository.save(product);
                })
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
    }

    public List<Product> getLowStockProducts() {
        return productRepository.findLowStockProducts();
    }

    public List<Product> getExpiringProducts(int days) {
        return productRepository.findExpiringProducts(days);
    }

    public long getTotalProductsCount() {
        return productRepository.countByIsActiveTrue();
    }

    public Page<Product> findByStatus(Product.Status status, Pageable pageable) {
        return productRepository.findByStatusAndIsActiveTrue(status, pageable);
    }
}