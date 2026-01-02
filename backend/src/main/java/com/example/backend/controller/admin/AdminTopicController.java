package com.example.backend.controller.admin;

import com.example.backend.dto.TopicDto;
import com.example.backend.service.TopicService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/topic")
@RequiredArgsConstructor
public class AdminTopicController {

    private final TopicService topicService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    public List<TopicDto> getAll() {
        return topicService.getAll();
    }

    @GetMapping("/page")
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    public ResponseEntity<Page<TopicDto>> getPage(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "8") int size) {
        return ResponseEntity.ok(topicService.getPage(page, size));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    public TopicDto getById(@PathVariable Integer id) {
        return topicService.getById(id);
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    public TopicDto create(@RequestBody TopicDto dto) {
        return topicService.create(dto);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    public TopicDto update(@PathVariable Integer id, @RequestBody TopicDto dto) {
        return topicService.update(id, dto);
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    public void toggleStatus(@PathVariable Integer id) {
        topicService.toggleStatus(id);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void delete(@PathVariable Integer id) {
        topicService.delete(id);
    }
}
