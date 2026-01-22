package com.example.backend.dto;

import com.example.backend.entity.SaleType;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

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

    @NotNull(message = "Danh mục không được để trống")
    private Integer categoryId;
    private String categoryName;

    @NotNull(message = "Thương hiệu không được để trống")
    private Integer brandId;
    private String brandName;

    @NotBlank(message = "Tên sản phẩm không được trống")
    @Size(min = 3, max = 200, message = "Tên sản phẩm phải từ 3-200 ký tự")
    private String name;

    private String slug;
    private String image;
    private String imagePublicId;

    @Size(max = 1000, message = "Mô tả không được quá 1000 ký tự")
    private String description;

    @Size(max = 5000, message = "Chi tiết không được quá 5000 ký tự")
    private String detail; // Detail có thể null

    @Min(value = 0, message = "Số lượng không được âm")
    private Integer qty;
    private Integer lockedQty;
    private SaleType saleType;
    private Integer baseWeight;
    private String unitLabel;

    @Min(value = 0, message = "Giá nhập không được âm")
    private BigDecimal costPrice;

    @NotNull(message = "Giá bán không được trống")
    @Min(value = 0, message = "Giá bán không được âm")
    private BigDecimal salePrice;

    @Min(value = 0, message = "Giá giảm không được âm")
    private BigDecimal discountPrice;

    private Integer status;
    private Integer updatedBy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime deletedAt;
}
