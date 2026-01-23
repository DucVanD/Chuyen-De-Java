package com.example.backend.config;

import java.util.HashMap;
import java.util.Map;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.cloudinary.Cloudinary;

@Configuration
public class CloudinaryConfig {

    /**
     * Cấu hình Bean Cloudinary để quản lý hình ảnh trên đám mây.
     * Các thông tin nhạy cảm (Cloud Name, API Key, API Secret) được lấy từ biến môi
     * trường (.env)
     * để đảm bảo tính bảo mật, không lộ mã nguồn.
     */
    @Bean
    public Cloudinary cloudinary() {
        Map<String, String> config = new HashMap<>();
        config.put("cloud_name", System.getenv("CLOUDINARY_CLOUD_NAME"));
        config.put("api_key", System.getenv("CLOUDINARY_API_KEY"));
        config.put("api_secret", System.getenv("CLOUDINARY_API_SECRET"));
        return new Cloudinary(config);
    }
}
