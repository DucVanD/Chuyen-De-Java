package com.example.backend.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Siêu Thị Mini API")
                        .version("1.0")
                        .description("Tài liệu hướng dẫn sử dụng API hệ thống Siêu Thị Mini"));
    }
}
