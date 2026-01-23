package com.example.backend.config;

import com.example.backend.security.CustomUserDetails;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.AuditorAware;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Optional;

@Configuration
@EnableJpaAuditing(auditorAwareRef = "auditorProvider")
public class JpaAuditingConfig {

    /**
     * Cấu hình JPA Auditing: Tự động ghi nhận người tạo/người sửa và thời gian
     * tạo/sửa
     * cho các Entity có các trường @CreatedAt, @LastModifiedBy...
     */
    @Bean
    @SuppressWarnings("null") // ✅ Tắt cảnh báo vàng của IDE
    public AuditorAware<Integer> auditorProvider() {
        return () -> {
            // Lấy thông tin user hiện tại đang đăng nhập từ Security Context
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

            // Nếu chưa đăng nhập hoặc là khách (Anonymous), không thể lấy ID
            if (authentication == null ||
                    !authentication.isAuthenticated() ||
                    authentication.getPrincipal().equals("anonymousUser")) {
                return Optional.empty();
            }

            Object principal = authentication.getPrincipal();

            // Nếu là User đã xác thực, trích xuất ID từ CustomUserDetails
            if (principal instanceof CustomUserDetails) {
                Integer userId = ((CustomUserDetails) principal).getId();
                // ✅ Trả về ID để JPA tự động điền vào các trường @CreatedBy / @LastModifiedBy
                return Optional.ofNullable(userId);
            }

            return Optional.empty();
        };
    }
}