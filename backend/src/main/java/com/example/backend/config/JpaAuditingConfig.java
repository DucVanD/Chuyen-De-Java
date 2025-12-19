package com.example.backend.config;

import com.example.backend.security.CustomUserDetails; // Class UserDetails của bạn (xem giải thích dưới)
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

    @Bean
    public AuditorAware<Integer> auditorProvider() { // <--- Đổi thành Integer
        return () -> {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

            if (authentication == null || 
                !authentication.isAuthenticated() || 
                authentication.getPrincipal().equals("anonymousUser")) {
                return Optional.empty();
            }

            // --- ĐOẠN QUAN TRỌNG ---
            // Bạn cần ép kiểu Principal về Object User của bạn để lấy ID
            Object principal = authentication.getPrincipal();
            
            // Giả sử class chứa thông tin user đăng nhập của bạn là 'CustomUserDetails'
            if (principal instanceof CustomUserDetails) {
                return Optional.of(((CustomUserDetails) principal).getId());
            }

            return Optional.empty();
        };
    }
}