package com.example.backend.mapper;

import com.example.backend.dto.TopicDto;
import com.example.backend.entity.Topic;

public class TopicMapper {

    public static TopicDto toDto(Topic topic) {
        if (topic == null)
            return null;
        return TopicDto.builder()
                .id(topic.getId())
                .name(topic.getName())
                .slug(topic.getSlug())
                .description(topic.getDescription())
                .status(topic.getStatus())
                .createdAt(topic.getCreatedAt())
                .updatedAt(topic.getUpdatedAt())
                .deletedAt(topic.getDeletedAt())
                .build();
    }

    public static Topic toEntity(TopicDto dto) {
        if (dto == null)
            return null;
        return Topic.builder()
                .id(dto.getId())
                .name(dto.getName())
                .slug(dto.getSlug())
                .description(dto.getDescription())
                .status(dto.getStatus())
                .build();
    }
}
