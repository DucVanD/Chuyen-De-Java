package com.example.backend.mapper;

import com.example.backend.dto.PostDto;
import com.example.backend.entity.Post;
import com.example.backend.entity.enums.PostType;

public class PostMapper {
    public static PostDto toDto(Post post) {
        if (post == null) return null;
        return PostDto.builder()
                .id(post.getId())
                .title(post.getTitle())
                .slug(post.getSlug())
                .content(post.getContent())
                .image(post.getImage())
                .description(post.getDescription())
                .topicId(post.getTopicId())
                .status(post.getStatus())
                .type(post.getPostType() != null ? post.getPostType().name() : null)
                .createdAt(post.getCreatedAt())
                .updatedAt(post.getUpdatedAt())
                .build();
    }

    public static Post toEntity(PostDto dto) {
        if (dto == null) return null;
        Post post = Post.builder()
                .id(dto.getId())
                .title(dto.getTitle())
                .slug(dto.getSlug())
                .content(dto.getContent())
                .description(dto.getDescription())
                .topicId(dto.getTopicId())
                .status(dto.getStatus())
                .image(dto.getImage())
                .build();

        if (dto.getType() != null) {
            try {
                post.setPostType(PostType.valueOf(dto.getType().toUpperCase()));
            } catch (IllegalArgumentException e) {
                post.setPostType(PostType.POST);
            }
        }
        return post;
    }
}