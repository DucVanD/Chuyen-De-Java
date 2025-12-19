package com.example.backend.entity.enums;

public enum OrderStatus {
    PENDING,    // Chờ xử lý
    CONFIRMED,  // Xác nhận đơn hàng
    SHIPPING,   // Đang giao
    COMPLETED,  // Hoàn thành
    CANCELLED   // Đã hủy
}