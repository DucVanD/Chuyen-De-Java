package com.example.backend.controller;

import com.example.backend.dto.SupplierDto;
import com.example.backend.service.SupplierService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/suppliers")
public class SupplierController {

    private final SupplierService supplierService;

    public SupplierController(SupplierService supplierService) {
        this.supplierService = supplierService;
    }

    // 1️⃣ Lấy danh sách supplier
    @GetMapping
    public ResponseEntity<List<SupplierDto>> getAll() {
        return ResponseEntity.ok(supplierService.getAll());
    }

    // 2️⃣ Lấy supplier theo id
    @GetMapping("/{id}")
    public ResponseEntity<SupplierDto> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(supplierService.getById(id));
    }

    // 3️⃣ Tạo supplier mới
    @PostMapping
    public ResponseEntity<SupplierDto> create(@RequestBody SupplierDto dto) {
        return ResponseEntity.ok(supplierService.create(dto));
    }

    // 4️⃣ Cập nhật supplier
    @PutMapping("/{id}")
    public ResponseEntity<SupplierDto> update(
            @PathVariable Integer id,
            @RequestBody SupplierDto dto
    ) {
        return ResponseEntity.ok(supplierService.update(id, dto));
    }

    // 5️⃣ Xóa supplier
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        supplierService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
