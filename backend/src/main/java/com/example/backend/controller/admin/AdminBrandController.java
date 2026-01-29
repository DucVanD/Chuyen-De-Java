package com.example.backend.controller.admin;

import com.example.backend.dto.BrandDto;
import com.example.backend.service.BrandService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/brands")
@RequiredArgsConstructor
public class AdminBrandController {

    private final BrandService brandService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    public List<BrandDto> getAll() {
        return brandService.getAll();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public BrandDto getById(@PathVariable Integer id) {
        return brandService.getById(id);
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN')")
    public BrandDto create(@Valid @RequestBody BrandDto dto) {
        return brandService.create(dto);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public BrandDto update(@PathVariable Integer id, @Valid @RequestBody BrandDto dto) {
        return brandService.update(id, dto);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> delete(@PathVariable Integer id) {
        brandService.delete(id);
        return ResponseEntity.ok(Map.of("message", "Xóa thương hiệu thành công"));
    }
}
