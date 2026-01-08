package com.example.backend.dto;

import java.time.LocalDateTime;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TopicDto {
    private Integer id; // Phải là Integer
    private String name;
    private String slug;
    private String image; // Khớp với Entity
    private String description;
    private Integer status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime deletedAt;
}