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
@PreAuthorize("hasAnyRole('ADMIN','STAFF')")
public class AdminOrderController {

    private final OrderService orderService;

    // 🔎 Admin / Staff xem tất cả đơn
    @GetMapping
    public ResponseEntity<List<OrderDto>> getAll() {
        return ResponseEntity.ok(orderService.getAll());
    }

    // 🔎 Xem chi tiết đơn
    @GetMapping("/{id}")
    public ResponseEntity<OrderDto> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(orderService.getById(id));
    }

    // 🔁 Cập nhật trạng thái (xác nhận, giao hàng, hoàn thành)
    @PutMapping("/{id}/status")
    public ResponseEntity<OrderDto> updateStatus(
            @PathVariable Integer id,
            @RequestBody OrderDto dto
    ) {
        return ResponseEntity.ok(orderService.updateStatus(id, dto));
    }

    // ❌ CHỈ ADMIN được xóa đơn
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        orderService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
