package com.example.backend.config;

import com.example.backend.security.JwtFilter;
import com.example.backend.security.CustomUserDetailsService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableMethodSecurity // Cho phép phân quyền chi tiết trên từng hàm dùng @PreAuthorize
@RequiredArgsConstructor
public class SecurityConfig {

        private final JwtFilter jwtFilter;
        private final CustomUserDetailsService userDetailsService;

        /**
         * 1. Cấu hình băm mật khẩu:
         * Sử dụng BCrypt - thuật toán mạnh mẽ tự động thêm "muối" (salt) để chống Brute
         * Force.
         */
        @Bean
        public PasswordEncoder passwordEncoder() {
                return new BCryptPasswordEncoder();
        }

        /**
         * 2. Quản lý xác thực (Authentication Provider):
         * Kết nối giữa Service lấy User từ DB và cơ chế băm mật khẩu.
         */
        @Bean
        public DaoAuthenticationProvider authenticationProvider() {
                DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
                provider.setUserDetailsService(userDetailsService); // Load user từ database
                provider.setPasswordEncoder(passwordEncoder()); // So sánh pass đã băm
                return provider;
        }

        /**
         * 3. Bean quản lý Authentication:
         * Dùng để gọi lệnh đăng nhập từ AuthController.
         */
        @Bean
        public AuthenticationManager authenticationManager(
                        AuthenticationConfiguration config) throws Exception {
                return config.getAuthenticationManager();
        }

        /**
         * 4. "Bức tường lửa" SecurityFilterChain:
         * Đây là nơi định nghĩa toàn bộ quy tắc ra-vào hệ thống.
         */
        @Bean
        public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
                http
                                // Bật CORS hỗ trợ các request từ Frontend
                                .cors(org.springframework.security.config.Customizer.withDefaults())

                                // Tắt bảo vệ CSRF vì chúng ta dùng JWT (Authentication không qua Cookie)
                                .csrf(csrf -> csrf.disable())

                                // Cấu hình chế độ Stateless: Không dùng Session (mỗi request là độc lập qua
                                // Token)
                                .sessionManagement(session -> session
                                                .sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                                .authenticationProvider(authenticationProvider())

                                // 🛠️ XỬ LÝ LỖI TRẢ VỀ JSON (Tùy chỉnh để Frontend dễ xử lý)
                                .exceptionHandling(ex -> ex
                                                // Lỗi 403: Đã login nhưng Token không có ROLE phù hợp
                                                .accessDeniedHandler((request, response, accessDeniedException) -> {
                                                        response.setContentType("application/json;charset=UTF-8");
                                                        response.setStatus(403);
                                                        response.getWriter().write(
                                                                        "{\"status\": 403, \"error\": \"Truy cập bị từ chối\", \"message\": \"DEBUG: Bạn không có quyền Admin/Staff (Vui lòng đăng nhập lại account Admin)!\"}");
                                                })
                                                // Lỗi 401: Token sai, hết hạn hoặc chưa đăng nhập
                                                .authenticationEntryPoint((request, response, authException) -> {
                                                        response.setContentType("application/json;charset=UTF-8");
                                                        response.setStatus(401);
                                                        response.getWriter().write(
                                                                        "{\"status\": 401, \"error\": \"Xác thực thất bại\", \"message\": \"Phiên làm việc hết hạn, vui lòng đăng nhập lại!\"}");
                                                }))

                                // 🔐 ĐỊNH NGHĨA QUY TẮC PHÂN QUYỀN (ACCESS CONTROL)
                                .authorizeHttpRequests(auth -> auth
                                                // Các link công khai ai cũng vào được
                                                .requestMatchers("/api/auth/**", "/api/chat/**", "/api/vnpay/**",
                                                                "/v3/api-docs/**", "/v3/api-docs", "/swagger-ui/**",
                                                                "/swagger-ui.html", "/webjars/**")
                                                .permitAll()

                                                // Cho phép khách xem sản phẩm, bài viết mà không cần login
                                                .requestMatchers(org.springframework.http.HttpMethod.GET,
                                                                "/api/products/**", "/api/categories/**",
                                                                "/api/brands/**",
                                                                "/api/post/**", "/api/topic/**", "/api/suppliers/**",
                                                                "/api/vouchers/active")
                                                .permitAll()

                                                // Chặn API Admin: Chỉ cho phép ADMIN hoặc STAFF (Nhân viên)
                                                .requestMatchers("/api/admin/**").hasAnyRole("ADMIN", "STAFF")

                                                // Các API upload ảnh cho User (Avatar)
                                                .requestMatchers("/api/upload/user").authenticated()

                                                // Các API upload ảnh khác cho Admin: Chỉ cho phép ADMIN hoặc STAFF
                                                .requestMatchers("/api/upload/**").hasAnyRole("ADMIN", "STAFF")

                                                // Mọi request còn lại đều phải login mới được vào
                                                .anyRequest().authenticated())

                                // 🔥 QUAN TRỌNG: Gắn lớp lọc JWT trước khi kiểm tra User/Pass
                                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

                return http.build();
        }
}
