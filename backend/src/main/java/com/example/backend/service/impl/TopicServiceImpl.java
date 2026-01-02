package com.example.backend.service.impl;

import com.example.backend.dto.TopicDto;
import com.example.backend.entity.Topic;
import com.example.backend.mapper.TopicMapper;
import com.example.backend.repository.TopicRepository;
import com.example.backend.service.TopicService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TopicServiceImpl implements TopicService {

    private final TopicRepository topicRepository;

    @Override
    public List<TopicDto> getAll() {
        return topicRepository.findAll().stream()
                .map(TopicMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public Page<TopicDto> getPage(int page, int size) {
        return topicRepository.findAll(PageRequest.of(page, size))
                .map(TopicMapper::toDto);
    }

    @Override
    public TopicDto getById(Integer id) {
        if (id == null)
            return null;
        return topicRepository.findById(id)
                .map(TopicMapper::toDto)
                .orElse(null);
    }

    @Override
    public TopicDto create(TopicDto dto) {
        if (dto == null)
            return null;

        Topic topic = TopicMapper.toEntity(dto);

        if (topic.getSlug() == null || topic.getSlug().isBlank()) {
            String baseSlug = generateSlugFromName(dto.getName());
            topic.setSlug(generateUniqueSlug(baseSlug, null));
        } else {
            topic.setSlug(generateUniqueSlug(dto.getSlug(), null));
        }

        Topic saved = java.util.Objects.requireNonNull(topicRepository.save(topic));
        return TopicMapper.toDto(saved);
    }

    @Override
    public TopicDto update(Integer id, TopicDto dto) {
        if (id == null || dto == null)
            return null;
        return topicRepository.findById(id).map(existing -> {
            existing.setName(dto.getName());

            if (dto.getSlug() == null || dto.getSlug().isBlank()) {
                String baseSlug = generateSlugFromName(dto.getName());
                existing.setSlug(generateUniqueSlug(baseSlug, id));
            } else if (!dto.getSlug().equals(existing.getSlug())) {
                existing.setSlug(generateUniqueSlug(dto.getSlug(), id));
            }

            existing.setDescription(dto.getDescription());
            existing.setStatus(dto.getStatus());
            Topic saved = java.util.Objects.requireNonNull(topicRepository.save(existing));
            return TopicMapper.toDto(saved);
        }).orElse(null);
    }

    private String generateSlugFromName(String name) {
        if (name == null || name.isBlank()) {
            return "topic";
        }
        return java.text.Normalizer.normalize(name, java.text.Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "")
                .replaceAll("đ", "d")
                .replaceAll("Đ", "d")
                .toLowerCase()
                .replaceAll("\\s+", "-")
                .replaceAll("[^a-z0-9-]", "")
                .replaceAll("-+", "-")
                .replaceAll("^-+|-+$", "");
    }

    private String generateUniqueSlug(String baseSlug, Integer excludeId) {
        String slug = baseSlug;
        int counter = 1;

        while (true) {
            boolean exists = (excludeId != null)
                    ? topicRepository.existsBySlugAndIdNot(slug, excludeId)
                    : topicRepository.existsBySlug(slug);

            if (!exists) {
                return slug;
            }

            slug = baseSlug + "-" + counter;
            counter++;
        }
    }

    @Override
    public void delete(Integer id) {
        topicRepository.deleteById(id);
    }

    @Override
    public void toggleStatus(Integer id) {
        if (id == null)
            return;
        topicRepository.findById(id).ifPresent(topic -> {
            Integer status = topic.getStatus();
            if (status != null) {
                topic.setStatus(status == 1 ? 0 : 1);
                topicRepository.save(topic);
            }
        });
    }
}
