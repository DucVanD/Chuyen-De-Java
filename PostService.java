package com.example.backend.service;

import com.example.backend.dto.PostDto;
import java.util.List;

public interface PostService {
    List<PostDto> getAll();
    PostDto getById(Long id);
    List<PostDto> getByTopic(Long topicId);
    PostDto create(PostDto dto);
    PostDto update(Long id, PostDto dto);
    void delete(Long id);
}