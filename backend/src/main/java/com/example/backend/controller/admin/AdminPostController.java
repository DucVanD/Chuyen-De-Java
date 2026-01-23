package com.example.backend.controller.admin;

import com.example.backend.dto.PostDto;
import com.example.backend.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/post")
@RequiredArgsConstructor
public class AdminPostController {

    private final PostService postService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN')")
    public List<PostDto> getAll() {
        return postService.getAll();
    }

    @GetMapping("/page")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<Page<PostDto>> getPage(
            @RequestParam(required = false) com.example.backend.entity.enums.PostType type,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "8") int size) {
        com.example.backend.entity.enums.PostType searchType = (type != null) ? type
                : com.example.backend.entity.enums.PostType.POST;
        return ResponseEntity.ok(postService.getAdminPage(searchType, page, size));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public PostDto getById(@PathVariable Integer id) {
        return postService.getById(id);
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN')")
    public PostDto create(@RequestBody PostDto dto) {
        return postService.create(dto);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public PostDto update(@PathVariable Integer id, @RequestBody PostDto dto) {
        return postService.update(id, dto);
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public void toggleStatus(@PathVariable Integer id) {
        postService.toggleStatus(id);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void delete(@PathVariable Integer id) {
        postService.delete(id);
    }
}
