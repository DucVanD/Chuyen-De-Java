package com.example.backend.mapper;

import com.example.backend.dto.ProductDto;
import com.example.backend.entity.Brand;
import com.example.backend.entity.Category;
import com.example.backend.entity.Product;

public class ProductMapper {

    // Entity → DTO
    public static ProductDto toDto(Product product) {
        if (product == null)
            return null;

        return ProductDto.builder()
                .id(product.getId())
                .categoryId(product.getCategory() != null ? product.getCategory().getId() : null)
                .categoryName(product.getCategory() != null ? product.getCategory().getName() : null) // ✅ Map Name
                .brandId(product.getBrand() != null ? product.getBrand().getId() : null)
                .brandName(product.getBrand() != null ? product.getBrand().getName() : null) // ✅ Map Name
                .name(product.getName())
                .slug(product.getSlug())
                .image(product.getImage())
                .imagePublicId(product.getImagePublicId())
                .description(product.getDescription())
                .detail(product.getDetail())
                .qty(product.getQty())
                .lockedQty(product.getLockedQty())
                .costPrice(product.getCostPrice())
                .salePrice(product.getSalePrice())
                .discountPrice(product.getDiscountPrice())
                .status(product.getStatus())
                .updatedBy(product.getUpdatedBy())
                .createdAt(product.getCreatedAt())
                .updatedAt(product.getUpdatedAt())
                .deletedAt(product.getDeletedAt())
                .build();
    }

    // DTO → Entity (CREATE)
    public static Product toEntity(ProductDto dto, Category category, Brand brand) {
        if (dto == null)
            return null;

        return Product.builder()
                .name(dto.getName())
                .slug(dto.getSlug())
                .image(dto.getImage())
                .imagePublicId(dto.getImagePublicId())
                .description(dto.getDescription())
                .detail(dto.getDetail())
                .qty(0)
                .lockedQty(0)
                .costPrice(dto.getCostPrice())
                .salePrice(dto.getSalePrice())
                .discountPrice(dto.getDiscountPrice())
                .status(dto.getStatus())
                .updatedBy(dto.getUpdatedBy())
                .category(category)
                .brand(brand)
                .build();

    }
}
