package com.example.backend.dto;

import com.example.backend.entity.enums.DiscountType;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VoucherDto {

    private Integer id;

    private String voucherCode;
    private String name;

    private DiscountType discountType;
    private BigDecimal discountValue;
    private BigDecimal maxDiscount;
    private BigDecimal minOrderAmount;

    private Integer usageLimit;
    private Integer usedCount;

    private LocalDateTime startDate;
    private LocalDateTime endDate;

    private Integer status;

    // Auditing
    private Integer createdBy;
    private Integer updatedBy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
