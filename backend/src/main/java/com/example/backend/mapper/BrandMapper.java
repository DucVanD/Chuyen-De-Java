package com.example.backend.mapper;

import com.example.backend.dto.BrandDto;
import com.example.backend.entity.Brand;

public class BrandMapper {
    public static BrandDto toDto(Brand entity) {
        if (entity == null)
            return null;
        return BrandDto.builder()
                .id(entity.getId())
                .name(entity.getName())
                .slug(entity.getSlug())
                .image(entity.getImage())
                .description(entity.getDescription())
                .country(entity.getCountry())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }

    public static Brand toEntity(BrandDto dto) {
        if (dto == null)
            return null;
        return Brand.builder()
                .id(dto.getId())
                .name(dto.getName())
                .slug(dto.getSlug())
                .image(dto.getImage())
                .description(dto.getDescription())
                .country(dto.getCountry())
                .build();
    }
}
