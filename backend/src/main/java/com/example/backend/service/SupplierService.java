package com.example.backend.service;

import java.util.List;

import com.example.backend.dto.SupplierDto;

public interface SupplierService {
    List<SupplierDto> getAll();

    SupplierDto getById(Integer id);

    SupplierDto create(SupplierDto dto);

    SupplierDto update(Integer id, SupplierDto dto);

    void delete(Integer id);
}