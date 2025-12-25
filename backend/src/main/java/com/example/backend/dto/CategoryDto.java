package com.example.backend.dto;

import java.time.LocalDateTime;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class CategoryDto {

    private Integer id;
    private String name;
    private String slug;
    private String image;
    private String description;
    private Integer status;
    private Integer parentId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime deletedAt;
}
