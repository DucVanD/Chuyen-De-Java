package com.example.backend.mapper;

import com.example.backend.dto.OrderDetailDto;
import com.example.backend.entity.Order;
import com.example.backend.entity.OrderDetail;
import com.example.backend.entity.Product;

public class OrderDetailMapper {

    // Entity → DTO
    public static OrderDetailDto toDto(OrderDetail entity) {
        if (entity == null) return null;

        return OrderDetailDto.builder()
                .id(entity.getId())
                .orderId(entity.getOrder() != null ? entity.getOrder().getId() : null)
                .productId(entity.getProduct() != null ? entity.getProduct().getId() : null)
                .priceBuy(entity.getPriceBuy())
                .quantity(entity.getQuantity())
                .amount(entity.getAmount())
                .createdAt(entity.getCreatedAt())
                .build();
    }

    // DTO → Entity (CREATE)
    public static OrderDetail toEntity(
            OrderDetailDto dto,
            Order order,
            Product product
    ) {
        if (dto == null) return null;

        return OrderDetail.builder()
                .order(order)
                .product(product)
                .priceBuy(dto.getPriceBuy())
                .quantity(dto.getQuantity())
                .amount(dto.getAmount())
                .build();
    }
}
