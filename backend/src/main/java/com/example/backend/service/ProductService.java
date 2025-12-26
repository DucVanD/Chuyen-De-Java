package com.example.backend.service;

import java.util.List;

import com.example.backend.dto.ProductDto;

public interface ProductService {

    List<ProductDto> getAll();

    ProductDto getById(Integer id);

    ProductDto create(ProductDto dto);

    ProductDto update(Integer id, ProductDto dto);

    void delete(Integer id);
}
