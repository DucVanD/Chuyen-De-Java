package com.example.backend.service;

import com.example.backend.dto.TopicDto;
import org.springframework.data.domain.Page;
import java.util.List;

public interface TopicService {
    List<TopicDto> getAll();

    Page<TopicDto> getPage(int page, int size);

    TopicDto getById(Integer id);

    TopicDto create(TopicDto dto);

    TopicDto update(Integer id, TopicDto dto);

    void delete(Integer id);

    void toggleStatus(Integer id);
}
