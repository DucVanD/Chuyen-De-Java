package com.example.backend.controller.user;

import com.example.backend.dto.TopicDto;
import com.example.backend.service.TopicService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/topic")
@RequiredArgsConstructor
public class TopicController {

    private final TopicService topicService;

    @GetMapping("/all")
    public List<TopicDto> getAll() {
        return topicService.getAll();
    }

    @GetMapping("/{id}")
    public TopicDto getById(@PathVariable Integer id) {
        return topicService.getById(id);
    }
}
