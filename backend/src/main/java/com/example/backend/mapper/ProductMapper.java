package com.example.backend.mapper;

import com.example.backend.dto.ProductDto;
import com.example.backend.entity.Product;

public class ProductMapper {
    public static ProductDto toDto(Product entity) {
        if (entity == null)
            return null;
        return ProductDto.builder()
                .id(entity.getId())
                .categoryId(entity.getCategory() != null ? entity.getCategory().getId() : null)
                .categoryName(entity.getCategory() != null ? entity.getCategory().getName() : null)
                .brandId(entity.getBrand() != null ? entity.getBrand().getId() : null)
                .brandName(entity.getBrand() != null ? entity.getBrand().getName() : null)
                .name(entity.getName())
                .slug(entity.getSlug())
                .image(entity.getImage())
                .thumbnail(entity.getImage()) // Assuming thumbnail = image for now
                .description(entity.getDescription())
                .detail(entity.getDetail())
                .qty(entity.getQty())
                .price(entity.getSalePrice())
                .sale(entity.getDiscountPrice())
                .costPrice(entity.getCostPrice())
                .status(entity.getStatus())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }

    public static Product toEntity(ProductDto dto) {
        if (dto == null)
            return null;
        return Product.builder()
                .id(dto.getId())
                .name(dto.getName())
                .slug(dto.getSlug())
                .image(dto.getImage())
                .description(dto.getDescription())
                .detail(dto.getDetail())
                .qty(dto.getQty())
                .salePrice(dto.getPrice())
                .discountPrice(dto.getSale())
                .costPrice(dto.getCostPrice())
                .status(dto.getStatus())
                .build();
    }
}
