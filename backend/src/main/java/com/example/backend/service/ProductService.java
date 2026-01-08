package com.example.backend.service;

import com.example.backend.dto.ProductDto;

import java.util.List;
import java.util.Map;

public interface ProductService {
    List<ProductDto> getAll();

    Map<String, Object> getAllFiltered(Map<String, String> filters, int page);

    ProductDto getById(Integer id);

    ProductDto create(ProductDto dto);

    ProductDto update(Integer id, ProductDto dto);

    void delete(Integer id);

    void toggleStatus(Integer id);
}
