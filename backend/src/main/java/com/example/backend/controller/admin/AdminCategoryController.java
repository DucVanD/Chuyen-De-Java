package com.example.backend.controller.admin;

import com.example.backend.dto.CategoryDto;
import com.example.backend.service.CategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/categories")
@RequiredArgsConstructor
public class AdminCategoryController {

    private final CategoryService categoryService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    public List<CategoryDto> getAll() {
        return categoryService.getAll();
    }

    @GetMapping("/page")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<Page<CategoryDto>> getPage(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "8") int size) {
        return ResponseEntity.ok(categoryService.getPage(page, size));
    }

    // 🔥 THIẾU CÁI NÀY
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public CategoryDto getById(@PathVariable Integer id) {
        return categoryService.getById(id);
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN')")
    public CategoryDto create(@Valid @RequestBody CategoryDto dto) {
        return categoryService.create(dto);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public CategoryDto update(
            @PathVariable Integer id,
            @Valid @RequestBody CategoryDto dto) {
        return categoryService.update(id, dto);
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public void toggleStatus(@PathVariable Integer id) {
        categoryService.toggleStatus(id);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> delete(@PathVariable Integer id) {
        categoryService.delete(id);
        return ResponseEntity.ok(Map.of("message", "Xóa danh mục thành công"));
    }
}
