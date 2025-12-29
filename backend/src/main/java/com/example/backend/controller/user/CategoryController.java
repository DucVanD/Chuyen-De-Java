package com.example.backend.controller.user;

import com.example.backend.dto.CategoryDto;
import com.example.backend.service.CategoryService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    // ✅ USER: xem tất cả (menu, filter)
    @GetMapping
    public List<CategoryDto> getAll() {
        return categoryService.getAll();
    }

    // ✅ USER: xem chi tiết
    @GetMapping("/{id}")
    public CategoryDto getById(@PathVariable Integer id) {
        return categoryService.getById(id);
    }
}

