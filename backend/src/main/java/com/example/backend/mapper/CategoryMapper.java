package com.example.backend.mapper;
import com.example.backend.dto.CategoryDto;
import com.example.backend.entity.Category;

public class CategoryMapper {
    public static CategoryDto todto(Category category) {
        if (category == null)
            return null;
        return CategoryDto.builder()
                .id(category.getId())
                .name(category.getName())
                .slug(category.getSlug())
                .image(category.getImage())
                .description(category.getDescription())
                .status(category.getStatus())
                .createdAt(category.getCreatedAt())
                .updatedAt(category.getUpdatedAt())
                .deletedAt(category.getDeletedAt())
                .parentId(category.getParent() != null ? category.getParent().getId() : null)
                .build();
    }

    public static Category toEntity(CategoryDto categoryDto) {
        if (categoryDto == null)
            return null;
        Category category = Category.builder()
                .id(categoryDto.getId())
                .name(categoryDto.getName())
                .slug(categoryDto.getSlug())
                .image(categoryDto.getImage())
                .description(categoryDto.getDescription())
                .status(categoryDto.getStatus())
                .createdAt(categoryDto.getCreatedAt())
                .updatedAt(categoryDto.getUpdatedAt())
                .deletedAt(categoryDto.getDeletedAt())
                .build();

        return category;
    }

}
