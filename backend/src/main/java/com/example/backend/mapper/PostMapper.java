package com.example.backend.mapper;

import com.example.backend.dto.PostDto;
import com.example.backend.entity.Post;

public class PostMapper {

    public static PostDto toDto(Post post) {
        if (post == null)
            return null;
        return PostDto.builder()
                .id(post.getId())
                .topicId(post.getTopic() != null ? post.getTopic().getId() : null)
                .topicName(post.getTopic() != null ? post.getTopic().getName() : null)
                .title(post.getTitle())
                .slug(post.getSlug())
                .image(post.getImage())
                .imagePublicId(post.getImagePublicId())
                .description(post.getDescription())
                .content(post.getContent())
                .postType(post.getPostType())
                .status(post.getStatus())
                .createdAt(post.getCreatedAt())
                .updatedAt(post.getUpdatedAt())
                .deletedAt(post.getDeletedAt())
                .build();
    }

    public static Post toEntity(PostDto dto) {
        if (dto == null)
            return null;
        return Post.builder()
                .id(dto.getId())
                .title(dto.getTitle())
                .slug(dto.getSlug())
                .image(dto.getImage())
                .imagePublicId(dto.getImagePublicId())
                .description(dto.getDescription())
                .content(dto.getContent())
                .postType(dto.getPostType())
                .status(dto.getStatus())
                .build();
    }
}
