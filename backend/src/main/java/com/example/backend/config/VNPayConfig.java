package com.example.backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class VNPayConfig {

    /**
     * Lớp cấu hình chứa các hằng số và tham số cần thiết để kết nối với cổng thanh
     * toán VNPay.
     * Các giá trị được nạp từ file application.properties.
     */

    @Value("${vnpay.api.url}")
    private String vnpApiUrl; // URL Sandbox của VNPay

    @Value("${vnpay.tmn.code}")
    private String vnpTmnCode; // Mã định danh website (Merchant ID)

    @Value("${vnpay.hash.secret}")
    private String vnpHashSecret; // Chuỗi bảo mật để tạo chữ ký (Check Sum)

    @Value("${vnpay.return.url}")
    private String vnpReturnUrl; // Link Backend sẽ bắt kết quả phản hồi từ VNPay

    @Value("${vnpay.version}")
    private String vnpVersion; // Phiên bản API VNPay (thường là 2.1.0)

    public String getVnpApiUrl() {
        return vnpApiUrl;
    }

    public String getVnpTmnCode() {
        return vnpTmnCode;
    }

    public String getVnpHashSecret() {
        return vnpHashSecret;
    }

    public String getVnpReturnUrl() {
        return vnpReturnUrl;
    }

    public String getVnpVersion() {
        return vnpVersion;
    }
}
