package com.example.backend.dto;

import com.example.backend.entity.enums.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderDto {

    private Integer id;
    private String orderCode;

    // User
    private Integer userId;

    // Receiver info
    private String receiverName;
    private String receiverPhone;
    private String receiverEmail;
    private String receiverAddress;
    private String ward;
    private String district;
    private String note;

    // Voucher
    private Integer voucherId;
    private String voucherCode;

    // Money
    private BigDecimal subtotal;
    private BigDecimal shippingFee;
    private BigDecimal discountAmount;
    private BigDecimal totalAmount;

    // Status
    private PaymentMethod paymentMethod;
    private PaymentStatus paymentStatus;
    private OrderStatus status;

    private String cancelReason;

    // Order details
    private List<OrderDetailDto> orderDetails;

    // Auditing
    private Integer createdBy;
    private String createdByName; // Tên người tạo
    private String createdByEmail; // Email người tạo
    private Integer updatedBy;
    private String updatedByName; // Nhân viên chốt đơn/xử lý
    private String updatedByEmail; // Email nhân viên xử lý
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
