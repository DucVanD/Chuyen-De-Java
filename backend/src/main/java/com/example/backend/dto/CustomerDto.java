package com.example.backend.dto;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CustomerDto {

    private Integer id;
    private String name;
    private String email;
    private String phone;
    private String address;
    private String avatar;

    // Statistics
    private Long totalOrders; // Số đơn hàng
    private BigDecimal totalSpent; // Tổng tiền đã chi
    private LocalDateTime lastOrderDate; // Ngày mua gần nhất
    private BigDecimal averageOrderValue; // Giá trị đơn hàng trung bình

    // Account info
    private LocalDateTime createdAt; // Ngày đăng ký
    private String status; // Trạng thái tài khoản
}
