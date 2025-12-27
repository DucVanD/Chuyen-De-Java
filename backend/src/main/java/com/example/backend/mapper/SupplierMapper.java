package com.example.backend.mapper;

import com.example.backend.entity.Supplier;
import com.example.backend.dto.SupplierDto;

public class SupplierMapper {
    public static SupplierDto toDto(Supplier supplier) {
        if (supplier == null) {
            return null;
        }
        return SupplierDto.builder()
                .id(supplier.getId())
                .name(supplier.getName())
                .supplierCode(supplier.getSupplierCode())
                .email(supplier.getEmail())
                .phone(supplier.getPhone())
                .address(supplier.getAddress())
                .status(supplier.getStatus())
                .build();
    }

    public static Supplier toEntity(SupplierDto supplierDto) {
        if (supplierDto == null) {
            return null;
        }
        return Supplier.builder()
                .id(supplierDto.getId())
                .name(supplierDto.getName())
                .supplierCode(supplierDto.getSupplierCode())
                .email(supplierDto.getEmail())
                .phone(supplierDto.getPhone())
                .address(supplierDto.getAddress())
                .status(supplierDto.getStatus())
                .build();

    }
}
