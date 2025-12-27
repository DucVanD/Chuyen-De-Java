package com.example.backend.mapper;

import com.example.backend.dto.TopicDto;
import com.example.backend.entity.Topic;

public class TopicMapper {

    // ✅ Chuyển từ Entity sang DTO (Dùng cho các lệnh GET)
    public static TopicDto toDto(Topic topic) {
        if (topic == null) return null;

        return TopicDto.builder()
                .id(topic.getId())
                .name(topic.getName())
                .slug(topic.getSlug())
                .description(topic.getDescription())
                .image(topic.getImage())
                .status(topic.getStatus())
                .createdAt(topic.getCreatedAt())
                .updatedAt(topic.getUpdatedAt())
                .deletedAt(topic.getDeletedAt())
                .build();
    }

    // ✅ Chuyển từ DTO sang Entity (Dùng cho lệnh POST/CREATE)
    public static Topic toEntity(TopicDto dto) {
        if (dto == null) return null;

        return Topic.builder()
                // Thường bỏ ID ở đây nếu là tạo mới hoàn toàn
                .id(dto.getId()) 
                .name(dto.getName())
                .slug(dto.getSlug())
                .description(dto.getDescription())
                .image(dto.getImage())
                .status(dto.getStatus() != null ? dto.getStatus() : 1) // Mặc định status = 1 nếu null
                .createdAt(dto.getCreatedAt())
                .updatedAt(dto.getUpdatedAt())
                .deletedAt(dto.getDeletedAt())
                .build();
    }

    // ✅ Thêm hàm cập nhật Entity từ DTO (Dùng cho lệnh PUT/UPDATE)
    // Cách này giúp giữ nguyên các trường không thay đổi trong Database
    public static void updateEntity(Topic topic, TopicDto dto) {
        if (dto == null || topic == null) return;

        if (dto.getName() != null) topic.setName(dto.getName());
        if (dto.getSlug() != null) topic.setSlug(dto.getSlug());
        if (dto.getDescription() != null) topic.setDescription(dto.getDescription());
        if (dto.getImage() != null) topic.setImage(dto.getImage());
        if (dto.getStatus() != null) topic.setStatus(dto.getStatus());
        // createdAt thường không bao giờ cập nhật lại
    }
}