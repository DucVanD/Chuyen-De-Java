package com.example.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.cors.CorsConfigurationSource;

import java.util.Arrays;

@Configuration
public class CorsConfig {

    /**
     * Cấu hình CORS (Cross-Origin Resource Sharing).
     * Định nghĩa các Domain, Phương thức và Header được phép truy cập API.
     * Bean này sẽ được Spring Security tự động nhận diện.
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // 1. Chỉ định các domain Frontend được phép truy cập
        configuration.setAllowedOrigins(Arrays.asList(
                "http://localhost:5173",
                "http://127.0.0.1:5173",
                "https://bean-farm.vercel.app"));

        // 2. Cho phép tất cả các phương thức HTTP
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));

        // 3. Cho phép tất cả các Header
        configuration.setAllowedHeaders(Arrays.asList("*"));

        // 4. Cho phép gửi kèm Cookie/Authentication Header
        configuration.setAllowCredentials(true);

        // 5. Áp dụng cấu hình cho toàn bộ API bắt đầu bằng /api/
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", configuration);

        return source;
    }
}
