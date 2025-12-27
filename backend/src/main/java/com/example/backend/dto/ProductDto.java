package com.example.backend.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductDto {

    private Integer id;

    private Integer categoryId;
    private Integer brandId;

    private String name;
    private String slug;
    private String image;
    private String imagePublicId;
    private String description;
    private String detail;

    private Integer qty;
    private Integer lockedQty;

    private BigDecimal costPrice;
    private BigDecimal salePrice;
    private BigDecimal discountPrice;

    private Integer status;

    private Integer updatedBy;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime deletedAt;
}

