package com.example.backend.mapper;

import com.example.backend.dto.StockMovementDto;
import com.example.backend.entity.Order;
import com.example.backend.entity.Product;
import com.example.backend.entity.StockMovement;
import com.example.backend.entity.Supplier;

public class StockMovementMapper {

    // Entity → DTO
    public static StockMovementDto toDto(StockMovement entity) {
        if (entity == null)
            return null;

        return StockMovementDto.builder()
                .id(entity.getId())
                .productId(entity.getProduct() != null ? entity.getProduct().getId() : null)
                .productName(entity.getProduct() != null ? entity.getProduct().getName() : "N/A")
                // ✅ THÊM: Map saleType và unitLabel từ Product
                .saleType(entity.getProduct() != null && entity.getProduct().getSaleType() != null
                        ? entity.getProduct().getSaleType().name()
                        : null)
                .unitLabel(entity.getProduct() != null ? entity.getProduct().getUnitLabel() : null)
                .supplierId(entity.getSupplier() != null ? entity.getSupplier().getId() : null)
                .orderId(entity.getOrder() != null ? entity.getOrder().getId() : null)
                .orderCode(entity.getOrder() != null ? entity.getOrder().getOrderCode() : null)
                .movementType(entity.getMovementType())
                .quantity(entity.getQuantity())
                .unitPrice(entity.getUnitPrice())
                .currentStock(entity.getCurrentStock())
                .note(entity.getNote())
                .createdBy(entity.getCreatedBy())
                .createdAt(entity.getCreatedAt())
                .build();
    }

    // DTO → Entity (CREATE)
    public static StockMovement toEntity(
            StockMovementDto dto,
            Product product,
            Supplier supplier,
            Order order) {
        if (dto == null)
            return null;

        return StockMovement.builder()
                .product(product)
                .supplier(supplier)
                .order(order)
                .movementType(dto.getMovementType())
                .quantity(dto.getQuantity())
                .unitPrice(dto.getUnitPrice())
                .note(dto.getNote())
                .build();
    }
}
