package com.example.backend.dto;

import org.springframework.web.multipart.MultipartFile;
import lombok.*;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PostDto {
    private Long id;
    private String title;
    private String slug;
    private String content;      // Đồng bộ với content trong Entity
    private String description;
    private Long topicId;        // Đồng bộ với topicId trong Entity
    private String type;
    private Integer status;
    private String image;        // Lưu tên file trả về cho client
    
    // Nhận file từ FormData của React
    private MultipartFile thumbnail; 

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}