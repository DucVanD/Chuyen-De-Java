package com.example.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductDto {
    private Integer id;
    private Integer categoryId;
    private String categoryName;
    private Integer brandId;
    private String brandName;
    private String name;
    private String slug;
    private String image;
    private String thumbnail; // matching frontend expectation if needed
    private String description;
    private String detail;
    private Integer qty;
    private BigDecimal price; // mapping to salePrice
    private BigDecimal sale; // mapping to discountPrice
    private BigDecimal costPrice;
    private Integer status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
