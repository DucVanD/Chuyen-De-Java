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

                // Định nghĩa thứ tự ưu tiên hiển thị lỗi (từ trên xuống)
                java.util.List<String> fieldOrder = java.util.List.of(
                                "name", "email", "phone", "password", "confirmPassword");

                // Lấy message từ validation error đầu tiên (theo thứ tự ưu tiên)
                String errorMessage = e.getBindingResult().getFieldErrors().stream()
                                .sorted((e1, e2) -> {
                                        int idx1 = fieldOrder.indexOf(e1.getField());
                                        int idx2 = fieldOrder.indexOf(e2.getField());

                                        // Nếu field không trong list, đẩy xuống cuối
                                        if (idx1 == -1)
                                                idx1 = Integer.MAX_VALUE;
                                        if (idx2 == -1)
                                                idx2 = Integer.MAX_VALUE;

                                        return Integer.compare(idx1, idx2);
                                })
                                .findFirst()
                                .map(error -> error.getDefaultMessage())
                                .orElse("Dữ liệu không hợp lệ");

                return ResponseEntity.status(400).body(java.util.Map.of(
                                "status", 400,
                                "error", "Lỗi dữ liệu",
                                "message", errorMessage));
        }

        // 1. Xử lý lỗi nghiệp vụ (Business logic errors)
        @ExceptionHandler(BusinessException.class)
        public ResponseEntity<java.util.Map<String, Object>> handleBusinessException(
                        BusinessException e) {
                return ResponseEntity.status(400).body(java.util.Map.of(
                                "status", 400,
                                "error", "Lỗi nghiệp vụ",
                                "message", e.getMessage()));
        }

        // 2. Xử lý lỗi "No value present" (Khi dùng orElseThrow() mà không thấy dữ
        // liệu)
        @ExceptionHandler(java.util.NoSuchElementException.class)
        public ResponseEntity<java.util.Map<String, Object>> handleNoSuchElementException(
                        java.util.NoSuchElementException e) {
                return ResponseEntity.status(404).body(java.util.Map.of(
                                "status", 404,
                                "error", "Không tìm thấy",
                                "message",
                                "Dữ liệu không tồn tại trong hệ thống"));
        }

        // 3. Xử lý lỗi phân quyền (Khi User cố tình vào API của Admin)
        @ExceptionHandler(org.springframework.security.access.AccessDeniedException.class)
        public ResponseEntity<java.util.Map<String, Object>> handleAccessDeniedException(
                        org.springframework.security.access.AccessDeniedException e) {
                return ResponseEntity.status(403).body(java.util.Map.of(
                                "status", 403,
                                "error", "Truy cập bị từ chối",
                                "message", "Bạn không có quyền truy cập vào chức năng này!"));
        }

        // 4. Xử lý lỗi không tìm thấy tài nguyên (Static resources, Swagger)
        @ExceptionHandler(org.springframework.web.servlet.resource.NoResourceFoundException.class)
        public ResponseEntity<java.util.Map<String, Object>> handleNoResourceFoundException(
                        jakarta.servlet.http.HttpServletRequest request,
                        org.springframework.web.servlet.resource.NoResourceFoundException e) {
                return ResponseEntity.status(404).body(java.util.Map.of(
                                "status", 404,
                                "error", "Không tìm thấy tài nguyên",
                                "path", request.getRequestURI(),
                                "message", "Đường dẫn không tồn tại: " + e.getResourcePath()));
        }

        // 5. Xử lý lỗi phương thức HTTP không hỗ trợ (Ví dụ: Gọi GET vào API chỉ nhận
        // POST)
        @ExceptionHandler(org.springframework.web.HttpRequestMethodNotSupportedException.class)
        public ResponseEntity<java.util.Map<String, Object>> handleMethodNotSupported(
                        jakarta.servlet.http.HttpServletRequest request,
                        org.springframework.web.HttpRequestMethodNotSupportedException e) {
                return ResponseEntity.status(405).body(java.util.Map.of(
                                "status", 405,
                                "path", request.getRequestURI(),
                                "error", "Phương thức không hỗ trợ",
                                "message",
                                String.format("Phương thức %s không được hỗ trợ cho đường dẫn này. Vui lòng dùng %s",
                                                e.getMethod(), e.getSupportedHttpMethods())));
        }

        // 6. Xử lý lỗi ràng buộc dữ liệu (DB Constraint Violation)
        @ExceptionHandler(org.springframework.dao.DataIntegrityViolationException.class)
        public ResponseEntity<java.util.Map<String, Object>> handleDataIntegrityViolation(
                        org.springframework.dao.DataIntegrityViolationException e) {
                return ResponseEntity.status(400).body(java.util.Map.of(
                                "status", 400,
                                "error", "Lỗi ràng buộc dữ liệu",
                                "message", "Dữ liệu đang được sử dụng ở nơi khác, không thể xóa hoặc sửa đổi."));
        }

        // 7. Xử lý tất cả các lỗi khác
        @ExceptionHandler(Exception.class)
        public ResponseEntity<java.util.Map<String, Object>> handleGeneralException(Exception e) {
                e.printStackTrace();
                java.io.StringWriter sw = new java.io.StringWriter();
                java.io.PrintWriter pw = new java.io.PrintWriter(sw);
                e.printStackTrace(pw);
                String stackTrace = sw.toString();

                return ResponseEntity.status(500).body(java.util.Map.of(
                                "status", 500,
                                "error", "Lỗi hệ thống",
                                "message", "Đã có lỗi xảy ra: " + e.getMessage(),
                                "debug", stackTrace.substring(0, Math.min(stackTrace.length(), 1000))));
        }
}
