package com.example.backend.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.FetchType;
import jakarta.persistence.Table;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import org.springframework.data.annotation.LastModifiedBy;

@Entity
@Table(name = "products")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EntityListeners(AuditingEntityListener.class)
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY) // Lazy để tối ưu hiệu năng
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @ManyToOne(fetch = FetchType.LAZY) // Lazy để tối ưu hiệu năng
    @JoinColumn(name = "brand_id", nullable = false)
    private Brand brand;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String slug;

    private String image;
    private String imagePublicId;
    @Column(length = 500, nullable = false)
    private String description;

    @Column(nullable = false, columnDefinition = "LONGTEXT")
    private String detail;

    @Builder.Default
    private Integer qty = 0; // if WEIGHT: gram, if PACKAGE: units

    @Builder.Default
    @Column(name = "locked_qty", nullable = true)
    private Integer lockedQty = 0; // Hàng đang giữ chờ thanh toán

    @Enumerated(EnumType.STRING)
    @Column(name = "sale_type", nullable = false)
    @Builder.Default
    private SaleType saleType = SaleType.UNIT;

    @Column(name = "base_weight")
    private Integer baseWeight; // grams per 1 delivery unit (only for WEIGHT type)

    @Column(name = "unit_label", length = 20)
    private String unitLabel; // "gói", "chai", "thùng", "hộp", "phần", "khúc"

    @Column(name = "cost_price", nullable = true)
    private BigDecimal costPrice;

    @Column(name = "sale_price", nullable = false)
    private BigDecimal salePrice;

    @Column(name = "discount_price", nullable = true)
    private BigDecimal discountPrice;

    @Builder.Default
    private Integer status = 1; // 1: Active, 0: Hidden

    @LastModifiedBy
    @Column(name = "updated_by", nullable = false)
    private Integer updatedBy;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    private LocalDateTime deletedAt;
}
