package com.example.backend.service;

import java.util.List;

import com.example.backend.dto.SupplierDto;

public interface SupplierService {
    List<SupplierDto> getAll();

    SupplierDto getById(Integer id);

    SupplierDto create(SupplierDto dto);

    org.springframework.data.domain.Page<SupplierDto> getPage(int page, int size);

    SupplierDto update(Integer id, SupplierDto dto);

    void delete(Integer id);
}