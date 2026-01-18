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
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

        private final JwtFilter jwtFilter;
        private final CustomUserDetailsService userDetailsService;

        // 1️⃣ Encode password
        @Bean
        public PasswordEncoder passwordEncoder() {
                return new BCryptPasswordEncoder();
        }

        // ⚠️ GIAI ĐOẠN 1: Dùng InMemoryUserDetailsManager (chạy trên RAM, mất khi tắt
        // app)
        // Giảng viên yêu cầu có phần này trước khi chuyển sang Database

        // @Bean
        // public org.springframework.security.provisioning.InMemoryUserDetailsManager
        // userDetailsService() {

        // org.springframework.security.core.userdetails.UserDetails admin =
        // org.springframework.security.core.userdetails.User
        // .withUsername("admin@gmail.com")
        // .password(passwordEncoder().encode("123456"))
        // .roles("ADMIN")
        // .build();

        // org.springframework.security.core.userdetails.UserDetails user =
        // org.springframework.security.core.userdetails.User
        // .withUsername("user@gmail.com")
        // .password(passwordEncoder().encode("123456"))
        // .roles("CUSTOMER")
        // .build();

        // return new
        // org.springframework.security.provisioning.InMemoryUserDetailsManager(admin,
        // user);
        // }

        @Bean
        public DaoAuthenticationProvider authenticationProvider() {
                DaoAuthenticationProvider provider = new DaoAuthenticationProvider();

                // 🧪 CHẾ ĐỘ TEST (IN-MEMORY): Để test Postman với admin@gmail.com
                // provider.setUserDetailsService(userDetailsService());

                // 🏠 CHẾ ĐỘ THỰC TẾ (DATABASE): Khi nào dùng Web thật thì đổi sang dòng dưới
                provider.setUserDetailsService(userDetailsService);

                provider.setPasswordEncoder(passwordEncoder());
                return provider;
        }

        // 3️⃣ AuthenticationManager
        @Bean
        public AuthenticationManager authenticationManager(
                        AuthenticationConfiguration config) throws Exception {
                return config.getAuthenticationManager();
        }

        // 4️⃣ Security rules + JWT Filter
        @Bean
        public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
                http
                                .cors(cors -> {
                                })
                                .csrf(csrf -> csrf.disable())
                                .sessionManagement(session -> session
                                                .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                                .authenticationProvider(authenticationProvider())
                                // 🛠️ THÊM CẤU HÌNH XỬ LÝ LỖI Ở LỚP SECURITY
                                .exceptionHandling(ex -> ex
                                                // Lỗi 403: Đã đăng nhập nhưng không đủ quyền
                                                .accessDeniedHandler((request, response, accessDeniedException) -> {
                                                        response.setContentType("application/json;charset=UTF-8");
                                                        response.setStatus(403);
                                                        response.getWriter().write(
                                                                        "{\"status\": 403, \"error\": \"Forbidden\", \"message\": \"Bạn không có quyền vào thư mục Admin!\"}");
                                                })
                                                // Lỗi 401: Chưa đăng nhập hoặc Token hết hạn
                                                .authenticationEntryPoint((request, response, authException) -> {
                                                        response.setContentType("application/json;charset=UTF-8");
                                                        response.setStatus(401);
                                                        response.getWriter().write(
                                                                        "{\"status\": 401, \"error\": \"Unauthorized\", \"message\": \"Vui lòng đăng nhập để lấy Token!\"}");
                                                }))
                                .authorizeHttpRequests(auth -> auth
                                                .requestMatchers("/api/auth/**").permitAll()

                                                // ✅ Forgot Password endpoints (public for password reset flow)
                                                .requestMatchers("/api/auth/forgot-password").permitAll()
                                                .requestMatchers("/api/auth/verify-code").permitAll()
                                                .requestMatchers("/api/auth/reset-password").permitAll()

                                                // ✅ AI Chatbot (public for customer support)
                                                .requestMatchers("/api/chat/**").permitAll()

                                                // ✅ VNPay callback (public for payment gateway redirect)
                                                .requestMatchers("/api/vnpay/callback").permitAll()

                                                // ✅ Public GET requests (Xem sản phẩm, tin tức, v.v.)
                                                .requestMatchers(org.springframework.http.HttpMethod.GET,
                                                                "/api/products/**", "/api/categories/**",
                                                                "/api/brands/**",
                                                                "/api/post/**", "/api/topic/**", "/api/suppliers/**")
                                                .permitAll()

                                                // ✅ Voucher: Khách được xem mã active và check mã
                                                .requestMatchers(org.springframework.http.HttpMethod.GET,
                                                                "/api/vouchers/active", "/api/vouchers/code/**")
                                                .permitAll()

                                                // ✅ Required authentication for specific actions
                                                .requestMatchers("/api/upload/user").authenticated()

                                                // 🔐 Admin/Staff only for sensitive areas
                                                .requestMatchers("/api/admin/**").hasAnyRole("ADMIN", "STAFF")
                                                .requestMatchers("/api/upload/**").hasAnyRole("ADMIN", "STAFF")

                                                // 🔐 Restrict modifications on ALL core entities (Voucher, Supplier,
                                                // v.v.)
                                                .requestMatchers(org.springframework.http.HttpMethod.POST,
                                                                "/api/products/**", "/api/categories/**",
                                                                "/api/brands/**",
                                                                "/api/vouchers/**", "/api/suppliers/**", "/api/post/**",
                                                                "/api/topic/**")
                                                .hasAnyRole("ADMIN", "STAFF")

                                                .requestMatchers(org.springframework.http.HttpMethod.PUT,
                                                                "/api/products/**", "/api/categories/**",
                                                                "/api/brands/**",
                                                                "/api/vouchers/**", "/api/suppliers/**", "/api/post/**",
                                                                "/api/topic/**")
                                                .hasAnyRole("ADMIN", "STAFF")

                                                .requestMatchers(org.springframework.http.HttpMethod.DELETE,
                                                                "/api/products/**", "/api/categories/**",
                                                                "/api/brands/**",
                                                                "/api/vouchers/**", "/api/suppliers/**", "/api/post/**",
                                                                "/api/topic/**")
                                                .hasAnyRole("ADMIN", "STAFF")

                                                .anyRequest().authenticated())
                                // 🔥 GẮN JWT FILTER
                                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

                return http.build();
        }
}
