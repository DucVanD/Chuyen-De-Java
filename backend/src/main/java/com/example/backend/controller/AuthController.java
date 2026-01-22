package com.example.backend.controller;

import com.example.backend.dto.LoginRequestDto;
import com.example.backend.dto.RegisterRequestDto;
import com.example.backend.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

        private final AuthService authService;

        @PostMapping("/login")
        public ResponseEntity<?> login(@Valid @RequestBody LoginRequestDto req) {
                return ResponseEntity.ok(authService.login(req));
        }

        @PostMapping("/register")
        public ResponseEntity<?> register(@Valid @RequestBody RegisterRequestDto req) {
                return ResponseEntity.ok(Map.of(
                                "status", true,
                                "user", authService.register(req)));
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
