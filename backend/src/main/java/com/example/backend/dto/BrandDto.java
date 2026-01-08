package com.example.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BrandDto {
    private Integer id;
    private String name;
    private String slug;
    private String image;
    private String description;
    private String country;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
