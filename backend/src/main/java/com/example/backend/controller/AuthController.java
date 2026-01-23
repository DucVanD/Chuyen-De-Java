package com.example.backend.controller;

import com.example.backend.dto.LoginRequestDto;
import com.example.backend.dto.RegisterRequestDto;
import com.example.backend.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import jakarta.servlet.http.HttpServletRequest;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

        private final AuthService authService;

        @PostMapping("/login")
        public ResponseEntity<?> login(@Valid @RequestBody LoginRequestDto req, HttpServletRequest request) {
                Map<String, Object> result = authService.login(req);
                String accessToken = (String) result.get("accessToken");
                String refreshToken = (String) result.get("refreshToken");

                if (accessToken == null || refreshToken == null) {
                        return ResponseEntity.status(500).body(Map.of("message", "Token generation failed"));
                }

                ResponseCookie accessCookie = createCookie(request, "accessToken", accessToken, 15 * 60);
                ResponseCookie refreshCookie = createCookie(request, "refreshToken", refreshToken, 7 * 24 * 60 * 60);

                return ResponseEntity.ok()
                                .header(HttpHeaders.SET_COOKIE, accessCookie.toString())
                                .header(HttpHeaders.SET_COOKIE, refreshCookie.toString())
                                .body(Map.of("status", true, "user", result.get("user")));
        }

        @PostMapping("/refresh")
        public ResponseEntity<?> refresh(
                        @CookieValue(name = "refreshToken", required = false) String refreshToken,
                        HttpServletRequest request) {
                if (refreshToken == null) {
                        return ResponseEntity.status(401).body(Map.of("message", "Refresh token missing"));
                }

                Map<String, Object> result = authService.refresh(refreshToken);
                String newAccessToken = (String) result.get("accessToken");
                String newRefreshToken = (String) result.get("refreshToken");

                if (newAccessToken == null || newRefreshToken == null) {
                        return ResponseEntity.status(500).body(Map.of("message", "Token generation failed"));
                }

                ResponseCookie accessCookie = createCookie(request, "accessToken", newAccessToken, 15 * 60);
                ResponseCookie refreshCookie = createCookie(request, "refreshToken", newRefreshToken, 7 * 24 * 60 * 60);

                return ResponseEntity.ok()
                                .header(HttpHeaders.SET_COOKIE, accessCookie.toString())
                                .header(HttpHeaders.SET_COOKIE, refreshCookie.toString())
                                .body(Map.of("status", true, "user", result.get("user")));
        }

        @PostMapping("/logout")
        public ResponseEntity<?> logout(HttpServletRequest request) {
                ResponseCookie accessCookie = createCookie(request, "accessToken", "", 0);
                ResponseCookie refreshCookie = createCookie(request, "refreshToken", "", 0);

                return ResponseEntity.ok()
                                .header(HttpHeaders.SET_COOKIE, accessCookie.toString())
                                .header(HttpHeaders.SET_COOKIE, refreshCookie.toString())
                                .body(Map.of("status", true, "message", "Đã đăng xuất"));
        }

        @PostMapping("/register")
        public ResponseEntity<?> register(@Valid @RequestBody RegisterRequestDto req) {
                return ResponseEntity.ok(Map.of(
                                "status", true,
                                "user", authService.register(req)));
        }

        private ResponseCookie createCookie(HttpServletRequest request, String name, String value, long maxAge) {
                // Kiểm tra nếu là HTTPS (trực tiếp hoặc qua Proxy như Render/Vercel)
                boolean isSecure = request.isSecure() || "https".equals(request.getHeader("X-Forwarded-Proto"));

                return ResponseCookie.from(name, value)
                                .httpOnly(true)
                                .secure(isSecure)
                                .path("/")
                                .maxAge(maxAge)
                                .sameSite(isSecure ? "None" : "Lax")
                                .build();
        }

        @PostMapping("/forgot-password")
        public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> req) {
                authService.forgotPassword(req.get("email"));
                return ResponseEntity.ok(Map.of("message", "Mã OTP đã được gửi đến email của bạn"));
        }

        @PostMapping("/verify-code")
        public ResponseEntity<?> verifyCode(@RequestBody Map<String, String> req) {
                authService.verifyCode(req.get("email"), req.get("code"));
                return ResponseEntity.ok(Map.of("status", true, "message", "Mã xác thực hợp lệ"));
        }

        @PostMapping("/reset-password")
        public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> req) {
                authService.resetPassword(
                                req.get("email"),
                                req.get("code"),
                                req.get("newPassword"));
                return ResponseEntity.ok(Map.of("status", true, "message", "Thay đổi mật khẩu thành công"));
        }
}
