package com.example.backend.mapper;

import com.example.backend.dto.VoucherDto;
import com.example.backend.entity.Voucher;

public class VoucherMapper {

    // Entity → DTO
    public static VoucherDto toDto(Voucher voucher) {
        if (voucher == null) return null;

        return VoucherDto.builder()
                .id(voucher.getId())
                .voucherCode(voucher.getVoucherCode())
                .name(voucher.getName())
                .discountType(voucher.getDiscountType())
                .discountValue(voucher.getDiscountValue())
                .maxDiscount(voucher.getMaxDiscount())
                .minOrderAmount(voucher.getMinOrderAmount())
                .usageLimit(voucher.getUsageLimit())
                .usedCount(voucher.getUsedCount())
                .startDate(voucher.getStartDate())
                .endDate(voucher.getEndDate())
                .status(voucher.getStatus())
                .createdBy(voucher.getCreatedBy())
                .updatedBy(voucher.getUpdatedBy())
                .createdAt(voucher.getCreatedAt())
                .updatedAt(voucher.getUpdatedAt())
                .build();
    }

    // DTO → Entity (CREATE)
    public static Voucher toEntity(VoucherDto dto) {
        if (dto == null) return null;

        return Voucher.builder()
                .voucherCode(dto.getVoucherCode())
                .name(dto.getName())
                .discountType(dto.getDiscountType())
                .discountValue(dto.getDiscountValue())
                .maxDiscount(dto.getMaxDiscount())
                .minOrderAmount(dto.getMinOrderAmount())
                .usageLimit(dto.getUsageLimit())
                .usedCount(dto.getUsedCount())
                .startDate(dto.getStartDate())
                .endDate(dto.getEndDate())
                .status(dto.getStatus())
                .build();
    }
}
