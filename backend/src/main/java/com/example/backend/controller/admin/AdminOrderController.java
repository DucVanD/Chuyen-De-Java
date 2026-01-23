package com.example.backend.controller.admin;

import com.example.backend.dto.OrderDto;
import com.example.backend.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/orders")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN','STAFF')") // Mặc định cả Admin và Staff đều được vào các hàm bên dưới
public class AdminOrderController {

    private final OrderService orderService;

    // 🔎 Xem danh sách đơn hàng (Admin / Staff)
    @GetMapping
    public ResponseEntity<List<OrderDto>> getAll() {
        return ResponseEntity.ok(orderService.getAll());
    }

    // 📄 Xem đơn hàng có phân trang và lọc (Admin / Staff)
    @GetMapping("/page")
    public ResponseEntity<org.springframework.data.domain.Page<OrderDto>> getPage(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String orderCode,
            @RequestParam(required = false) com.example.backend.entity.enums.OrderStatus status,
            @RequestParam(required = false) com.example.backend.entity.enums.PaymentMethod paymentMethod) {
        return ResponseEntity.ok(orderService.getPage(page, size, orderCode, status, paymentMethod));
    }

    // 🔎 Xem chi tiết một đơn hàng (Admin / Staff)
    @GetMapping("/{id}")
    public ResponseEntity<OrderDto> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(orderService.getById(id));
    }

    // 🔁 Cập nhật trạng thái đơn (Xác nhận, Giao hàng, Hoàn thành)
    // Cả Admin và Staff đều được phép làm việc này để xử lý đơn cho khách.
    @PutMapping("/{id}/status")
    public ResponseEntity<OrderDto> updateStatus(
            @PathVariable Integer id,
            @RequestBody OrderDto dto) {
        return ResponseEntity.ok(orderService.updateStatus(id, dto));
    }

    // ❌ XÓA ĐƠN HÀNG: Chỉ ADMIN mới có quyền xóa.
    // Dùng @PreAuthorize đè lên class-level để thắt chặt quyền xóa dữ liệu.
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        orderService.delete(id);
        return ResponseEntity.noContent().build();
    }

    // 🗑️ Xem thùng rác (Admin only)
    @GetMapping("/trash")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<OrderDto>> getTrash() {
        return ResponseEntity.ok(orderService.getTrash());
    }

    // 🔄 Khôi phục đơn hàng (Admin only)
    @PostMapping("/{id}/restore")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> restore(@PathVariable Integer id) {
        orderService.restore(id);
        return ResponseEntity.ok().build();
    }

    // 🔥 Xóa vĩnh viễn (Admin only)
    @DeleteMapping("/{id}/permanent")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> permanentDelete(@PathVariable Integer id) {
        orderService.permanentDelete(id);
        return ResponseEntity.noContent().build();
    }
}
