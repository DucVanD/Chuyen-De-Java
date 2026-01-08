package com.example.backend.controller;

import com.example.backend.dto.ProductDto;
import com.example.backend.service.ProductService;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/product")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public Map<String, Object> getAllFiltered(
            @RequestParam(required = false) Map<String, String> filters,
            @RequestParam(defaultValue = "1") int page) {

        Map<String, Object> data = productService.getAllFiltered(filters, page);
        Map<String, Object> response = new HashMap<>();
        response.put("status", true);
        response.put("data", data);
        return response;
    }

    @GetMapping("/{id}")
    public ProductDto getById(@PathVariable Integer id) {
        return productService.getById(id);
    }

    @PostMapping
    public ProductDto create(@RequestBody ProductDto dto) {
        return productService.create(dto);
    }

    @PutMapping("/{id}")
    public ProductDto update(@PathVariable Integer id, @RequestBody ProductDto dto) {
        return productService.update(id, dto);
    }

    @DeleteMapping("/delete/{id}")
    public Map<String, Object> delete(@PathVariable Integer id) {
        productService.delete(id);
        Map<String, Object> response = new HashMap<>();
        response.put("status", true);
        response.put("message", "Sản phẩm đã được xóa!");
        return response;
    }

    @GetMapping("/toggleStatus/{id}")
    public void toggleStatus(@PathVariable Integer id) {
        productService.toggleStatus(id);
    }
}
