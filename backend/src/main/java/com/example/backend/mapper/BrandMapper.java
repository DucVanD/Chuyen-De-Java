package com.example.backend.mapper;

import com.example.backend.dto.BrandDto;
import com.example.backend.entity.Brand;

public class BrandMapper {

    // Entity → DTO
    public static BrandDto toDto(Brand brand) {
        if (brand == null) return null;

        return BrandDto.builder()
                .id(brand.getId())
                .name(brand.getName())
                .slug(brand.getSlug())
                .image(brand.getImage())
                .description(brand.getDescription())
                .country(brand.getCountry())
                .createdAt(brand.getCreatedAt())
                .updatedAt(brand.getUpdatedAt())
                .deletedAt(brand.getDeletedAt())
                .build();
    }

    // DTO → Entity (CREATE)
    public static Brand toEntity(BrandDto dto) {
        if (dto == null) return null;

        return Brand.builder()
                .name(dto.getName())
                .slug(dto.getSlug())
                .image(dto.getImage())
                .description(dto.getDescription())
                .country(dto.getCountry())
                .build();
    }
}
