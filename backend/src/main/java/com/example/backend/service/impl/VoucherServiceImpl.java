package com.example.backend.service.impl;

import com.example.backend.dto.VoucherDto;
import com.example.backend.entity.Voucher;
import com.example.backend.mapper.VoucherMapper;
import com.example.backend.repository.VoucherRepository;
import com.example.backend.service.VoucherService;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class VoucherServiceImpl implements VoucherService {

    private final VoucherRepository voucherRepository;

    public VoucherServiceImpl(VoucherRepository voucherRepository) {
        this.voucherRepository = voucherRepository;
    }

    @Override
    public List<VoucherDto> getAll() {
        return voucherRepository.findAll()
                .stream()
                .map(VoucherMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public VoucherDto getById(Integer id) {
        Voucher voucher = voucherRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Voucher not found"));
        return VoucherMapper.toDto(voucher);
    }

    @Override
    public VoucherDto getByCode(String code) {
        Voucher voucher = voucherRepository.findByVoucherCode(code)
                .orElseThrow(() -> new RuntimeException("Voucher not found"));
        return VoucherMapper.toDto(voucher);
    }

    @Override
    public VoucherDto create(VoucherDto dto) {

        // Validate thời gian
        if (dto.getStartDate().isAfter(dto.getEndDate())) {
            throw new RuntimeException("Start date must be before end date");
        }

        Voucher voucher = VoucherMapper.toEntity(dto);
        Voucher saved = voucherRepository.save(voucher);
        return VoucherMapper.toDto(saved);
    }

    @Override
    public VoucherDto update(Integer id, VoucherDto dto) {

        Voucher voucher = voucherRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Voucher not found"));

        voucher.setName(dto.getName());
        voucher.setDiscountType(dto.getDiscountType());
        voucher.setDiscountValue(dto.getDiscountValue());
        voucher.setMaxDiscount(dto.getMaxDiscount());
        voucher.setMinOrderAmount(dto.getMinOrderAmount());
        voucher.setUsageLimit(dto.getUsageLimit());
        voucher.setStartDate(dto.getStartDate());
        voucher.setEndDate(dto.getEndDate());
        voucher.setStatus(dto.getStatus());

        Voucher updated = voucherRepository.save(voucher);
        return VoucherMapper.toDto(updated);
    }

    @Override
    public void deactivate(Integer id) {

        Voucher voucher = voucherRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Voucher not found"));

        voucher.setStatus(0); // Inactive
        voucher.setEndDate(LocalDateTime.now());

        voucherRepository.save(voucher);
    }

    @Override
    public void delete(Integer id) {
        Voucher voucher = voucherRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Voucher not found"));

        // Soft delete
        voucher.setDeletedAt(LocalDateTime.now());
        voucherRepository.save(voucher);
    }

    @Override
    public void incrementUsage(String voucherCode) {
        Voucher voucher = voucherRepository.findByVoucherCode(voucherCode)
                .orElseThrow(() -> new RuntimeException("Voucher not found"));

        voucher.setUsedCount(voucher.getUsedCount() + 1);
        voucherRepository.save(voucher);
    }
}
