package com.emart.inventory.entity;

import jakarta.persistence.*;
import java.util.Date;

@Entity
public class Barcode {

    @Id
    private String code; // e.g., UUID, UPC, QR string, etc.

    @OneToOne
    @JoinColumn(name = "product_id", referencedColumnName = "id")
    private Product product;

    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt;

    public Barcode() {
        this.createdAt = new Date();
    }

    public Barcode(String code, Product product) {
        this.code = code;
        this.product = product;
        this.createdAt = new Date();
    }

    // Getters & Setters
    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }
}
