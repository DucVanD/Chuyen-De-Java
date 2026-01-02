package com.example.backend.service;

import com.example.backend.dto.PostDto;
import org.springframework.data.domain.Page;
import java.util.List;

public interface PostService {
    List<PostDto> getNewest();

    List<PostDto> getAll();

    Page<PostDto> getPage(int page, int size);

    Page<PostDto> getPageByFilter(com.example.backend.entity.enums.PostType type, Integer topicId, Integer status,
            int page, int size);

    Page<PostDto> getAdminPage(com.example.backend.entity.enums.PostType type, int page, int size);

    PostDto getById(Integer id);

    PostDto getBySlug(String slug);

    PostDto create(PostDto dto);

    PostDto update(Integer id, PostDto dto);

    void delete(Integer id);

    void toggleStatus(Integer id);
}
