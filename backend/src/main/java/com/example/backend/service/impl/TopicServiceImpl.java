package com.example.backend.service.impl;

import com.example.backend.dto.TopicDto;
import com.example.backend.entity.Topic;
import com.example.backend.mapper.TopicMapper;
import com.example.backend.repository.TopicRepository;
import com.example.backend.service.TopicService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TopicServiceImpl implements TopicService {

    private final TopicRepository topicRepository;

    public TopicServiceImpl(TopicRepository topicRepository) {
        this.topicRepository = topicRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<TopicDto> getAll() {
        return topicRepository.findAll().stream()
                .map(TopicMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public TopicDto getById(Integer id) {
        return topicRepository.findById(id)
                .map(TopicMapper::toDto)
                .orElseThrow(() -> new RuntimeException("Topic not found with id: " + id));
    }

    // ✅ CHỨC NĂNG MỚI: Toggle Status (Giải quyết lỗi 404 cho /toggle)
    @Override
    @Transactional
    public void toggleStatus(Integer id) {
        Topic topic = topicRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Topic not found with id: " + id));
        
        // Đảo ngược trạng thái: nếu là 1 thì thành 0, ngược lại thành 1
        topic.setStatus(topic.getStatus() == 1 ? 0 : 1);
        topicRepository.save(topic);
    }

    @Override
    @Transactional
    public TopicDto create(TopicDto dto) {
        // Kiểm tra tránh trùng slug (Nguyên nhân phổ biến gây lỗi 500)
        Topic topic = TopicMapper.toEntity(dto);
        
        // Đảm bảo status mặc định là 1 nếu null
        if (topic.getStatus() == null) {
            topic.setStatus(1);
        }
        
        Topic savedTopic = topicRepository.save(topic);
        return TopicMapper.toDto(savedTopic);
    }

    @Override
    @Transactional
    public TopicDto update(Integer id, TopicDto dto) {
        Topic topic = topicRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Topic not found with id: " + id));

        // Cập nhật các trường từ DTO vào Entity hiện tại
        TopicMapper.updateEntity(topic, dto);

        return TopicMapper.toDto(topicRepository.save(topic));
    }

    @Override
    @Transactional
    public void delete(Integer id) {
        if (!topicRepository.existsById(id)) {
            throw new RuntimeException("Topic not found with id: " + id);
        }
        topicRepository.deleteById(id);
    }
}