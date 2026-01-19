package com.example.backend.exception;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<String> handleMaxSizeException(MaxUploadSizeExceededException exc) {
        return ResponseEntity.status(400).body("File quá lớn! Vui lòng chọn file nhỏ hơn 50MB.");
    }

    // Xử lý lỗi validation (@Valid, @NotBlank, @Size, etc.)
    @ExceptionHandler(org.springframework.web.bind.MethodArgumentNotValidException.class)
    public ResponseEntity<java.util.Map<String, Object>> handleValidationException(
            org.springframework.web.bind.MethodArgumentNotValidException e) {

        // Lấy message từ validation error đầu tiên
        String errorMessage = e.getBindingResult().getFieldErrors().stream()
                .findFirst()
                .map(error -> error.getDefaultMessage())
                .orElse("Dữ liệu không hợp lệ");

        return ResponseEntity.status(400).body(java.util.Map.of(
                "status", 400,
                "error", "Validation Error",
                "message", errorMessage));
    }

    // 1. Xử lý lỗi "No value present" (Khi dùng orElseThrow() mà không thấy dữ
    // liệu)
    @ExceptionHandler(java.util.NoSuchElementException.class)
    public ResponseEntity<java.util.Map<String, Object>> handleNoSuchElementException(
            java.util.NoSuchElementException e) {
        return ResponseEntity.status(404).body(java.util.Map.of(
                "status", 404,
                "error", "Not Found",
                "message", "Dữ liệu không tồn tại trong hệ thống (Ví dụ: Email chưa được tạo trong Database)"));
    }

    // 2. Xử lý lỗi phân quyền (Khi User cố tình vào API của Admin)
    @ExceptionHandler(org.springframework.security.access.AccessDeniedException.class)
    public ResponseEntity<java.util.Map<String, Object>> handleAccessDeniedException(
            org.springframework.security.access.AccessDeniedException e) {
        return ResponseEntity.status(403).body(java.util.Map.of(
                "status", 403,
                "error", "Forbidden",
                "message", "Bạn không có quyền truy cập vào chức năng này!"));
    }

    // 3. Xử lý tất cả các lỗi khác
    @ExceptionHandler(Exception.class)
    public ResponseEntity<java.util.Map<String, Object>> handleGeneralException(Exception e) {
        return ResponseEntity.status(500).body(java.util.Map.of(
                "status", 500,
                "error", "Internal Server Error",
                "message", "Đã có lỗi xảy ra: " + e.getMessage()));
    }
}
