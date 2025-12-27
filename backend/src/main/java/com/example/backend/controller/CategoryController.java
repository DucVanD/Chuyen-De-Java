package com.example.backend.controller;

import com.example.backend.dto.CategoryDto;
import com.example.backend.service.CategoryService;

import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    // ✅ GET ALL (test đầu tiên)
    @GetMapping
    public List<CategoryDto> getAll() {
        return categoryService.getAll();
    }

    // ✅ GET BY ID
    @GetMapping("/{id}")
    public CategoryDto getById(@PathVariable Integer id) {
        return categoryService.getById(id);
    }

    // ✅ CREATE
    @PostMapping
    public CategoryDto create(@RequestBody CategoryDto dto) {
        return categoryService.create(dto);
    }

    // ✅ UPDATE
    @PutMapping("/{id}")
    public CategoryDto update(
            @PathVariable Integer id,
            @RequestBody CategoryDto dto) {
        return categoryService.update(id, dto);
    }

    // ✅ DELETE
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        categoryService.delete(id);
    }

    // ✅ BULK CREATE
    @PostMapping("/bulk")
    public List<CategoryDto> bulkCreate(@RequestBody List<CategoryDto> dtos) {
        return categoryService.bulkCreate(dtos);
    }

    @GetMapping("/page")
    public ResponseEntity<Page<CategoryDto>> getPage(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "8") int size) {
        return ResponseEntity.ok(categoryService.getPage(page, size));
    }

}
