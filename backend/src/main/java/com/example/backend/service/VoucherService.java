package com.example.backend.service;

import com.example.backend.dto.VoucherDto;

import java.util.List;

public interface VoucherService {

    List<VoucherDto> getAll();

    List<VoucherDto> getAllActive();

    VoucherDto getById(Integer id);

    VoucherDto getByCode(String code);

    VoucherDto create(VoucherDto dto);

    VoucherDto update(Integer id, VoucherDto dto);

    void deactivate(Integer id);

    void delete(Integer id);

    void incrementUsage(String voucherCode);
}
