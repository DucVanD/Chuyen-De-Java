package com.example.backend.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.example.backend.entity.enums.StockMovementType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StockMovementDto {

    private Integer id;

    // Quan hệ: chỉ dùng ID
    private Integer productId;
    private Integer supplierId;
    private Integer orderId;
    private String orderCode;
    private String productName;
    // ✅ THÊM: Để hiển thị đơn vị (gram/chai/gói...)
    private String saleType;
    private String unitLabel;
    private StockMovementType movementType;

    private Integer quantity;
    private BigDecimal unitPrice;
    private Integer currentStock;

    private String note;

    private Integer createdBy;
    private LocalDateTime createdAt;
}
