package com.example.backend.service;

import com.example.backend.dto.TopicDto;
import java.util.List;

public interface TopicService {
    List<TopicDto> getAll();
    TopicDto getById(Integer id); // Đã sửa thành Integer
    TopicDto create(TopicDto dto);
    TopicDto update(Integer id, TopicDto dto); // Đã sửa thành Integer
    void delete(Integer id); // Đã sửa thành Integer
    void toggleStatus(Integer id);
    
}