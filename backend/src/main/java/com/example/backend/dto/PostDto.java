package com.example.backend.dto;

import com.example.backend.entity.enums.PostType;
import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PostDto {
    private Integer id;
    private Integer topicId;
    private String topicName;
    private String title;
    private String slug;
    private String image;
    private String imagePublicId;
    private String description;
    private String content;
    private PostType postType;
    private Integer status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime deletedAt;
}
