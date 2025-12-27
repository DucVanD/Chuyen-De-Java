package com.example.backend.service;

import java.util.List;

import com.example.backend.dto.BrandDto;

public interface BrandService {

    List<BrandDto> getAll();

    BrandDto getById(Integer id);

    BrandDto create(BrandDto dto);

    BrandDto update(Integer id, BrandDto dto);

    void delete(Integer id);
}
