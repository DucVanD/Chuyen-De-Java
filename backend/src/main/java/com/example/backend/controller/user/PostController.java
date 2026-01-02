package com.example.backend.controller.user;

import com.example.backend.dto.PostDto;
import com.example.backend.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/post")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    @GetMapping("/newest")
    public List<PostDto> getNewest() {
        return postService.getNewest();
    }

    @GetMapping("/all")
    public org.springframework.http.ResponseEntity<org.springframework.data.domain.Page<PostDto>> getAll(
            @RequestParam(required = false) com.example.backend.entity.enums.PostType type,
            @RequestParam(required = false) Integer topicId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "8") int size) {
        com.example.backend.entity.enums.PostType searchType = (type != null) ? type
                : com.example.backend.entity.enums.PostType.POST;
        return org.springframework.http.ResponseEntity
                .ok(postService.getPageByFilter(searchType, topicId, 1, page, size));
    }

    @GetMapping("/slug/{slug}")
    public org.springframework.http.ResponseEntity<PostDto> getBySlug(@PathVariable String slug) {
        return org.springframework.http.ResponseEntity.ok(postService.getBySlug(slug));
    }

    @GetMapping("/{id}")
    public PostDto getById(@PathVariable Integer id) {
        return postService.getById(id);
    }
}
