package com.example.backend.controller;

import com.example.backend.dto.BrandDto;
import com.example.backend.service.BrandService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/brands")
public class BrandController {

    private final BrandService brandService;

    public BrandController(BrandService brandService) {
        this.brandService = brandService;
    }

    // 1️⃣ Lấy danh sách brand
    @GetMapping
    public ResponseEntity<List<BrandDto>> getAll() {
        return ResponseEntity.ok(brandService.getAll());
    }

    // 2️⃣ Lấy brand theo id
    @GetMapping("/{id}")
    public ResponseEntity<BrandDto> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(brandService.getById(id));
    }

    // 3️⃣ Tạo brand mới
    @PostMapping
    public ResponseEntity<BrandDto> create(@RequestBody BrandDto dto) {
        return ResponseEntity.ok(brandService.create(dto));
    }

    // 4️⃣ Cập nhật brand
    @PutMapping("/{id}")
    public ResponseEntity<BrandDto> update(
            @PathVariable Integer id,
            @RequestBody BrandDto dto
    ) {
        return ResponseEntity.ok(brandService.update(id, dto));
    }

    // 5️⃣ Xóa brand
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        brandService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
