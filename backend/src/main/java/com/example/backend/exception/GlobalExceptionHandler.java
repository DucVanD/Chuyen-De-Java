package com.example.backend.exception;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<String> handleMaxSizeException(MaxUploadSizeExceededException exc) {
        return ResponseEntity.status(400).body("File quá lớn! Vui lòng chọn file nhỏ hơn 10MB.");
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
