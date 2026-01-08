package com.example.backend.controller;

import com.example.backend.dto.BrandDto;
import com.example.backend.service.BrandService;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/brand")
public class BrandController {

    private final BrandService brandService;

    public BrandController(BrandService brandService) {
        this.brandService = brandService;
    }

    @GetMapping
    public Map<String, Object> getAll() {
        List<BrandDto> brands = brandService.getAll();
        Map<String, Object> response = new HashMap<>();
        response.put("status", true);
        Map<String, Object> data = new HashMap<>();
        data.put("data", brands);
        response.put("data", data);
        return response;
    }

    @GetMapping("/{id}")
    public BrandDto getById(@PathVariable Integer id) {
        return brandService.getById(id);
    }

    @PostMapping
    public BrandDto create(@RequestBody BrandDto dto) {
        return brandService.create(dto);
    }

    @PutMapping("/{id}")
    public BrandDto update(@PathVariable Integer id, @RequestBody BrandDto dto) {
        return brandService.update(id, dto);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        brandService.delete(id);
    }
}
