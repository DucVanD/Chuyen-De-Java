package com.example.backend.service;

import com.example.backend.dto.BrandDto;
import java.util.List;

public interface BrandService {
    List<BrandDto> getAll();

    BrandDto getById(Integer id);

    BrandDto create(BrandDto dto);

    BrandDto update(Integer id, BrandDto dto);

    void delete(Integer id);
}
