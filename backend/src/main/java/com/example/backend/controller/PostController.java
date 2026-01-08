package com.example.backend.controller;

import com.example.backend.dto.PostDto;
import com.example.backend.service.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
@CrossOrigin(origins = "http://localhost:5173")
public class PostController {

    @Autowired
    private PostService postService;

    // 1. Lấy danh sách bài viết
    @GetMapping
    public ResponseEntity<List<PostDto>> index() {
        return ResponseEntity.ok(postService.getAll());
    }

    // 2. Lấy chi tiết bài viết
    @GetMapping("/{id}")
    public ResponseEntity<PostDto> show(@PathVariable Long id) {
        return ResponseEntity.ok(postService.getById(id));
    }

    // 3. Tạo mới bài viết (Nhận FormData kèm File)
    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<PostDto> store(@ModelAttribute PostDto postDto) {
        PostDto createdPost = postService.create(postDto);
        return new ResponseEntity<>(createdPost, HttpStatus.CREATED);
    }

    // 4. Cập nhật bài viết (Nhận FormData kèm File)
    @PutMapping(value = "/{id}", consumes = {"multipart/form-data"})
    public ResponseEntity<PostDto> update(@PathVariable Long id, @ModelAttribute PostDto postDto) {
        return ResponseEntity.ok(postService.update(id, postDto));
    }

    // 5. Xóa bài viết
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        postService.delete(id);
        return ResponseEntity.noContent().build();
    }
}