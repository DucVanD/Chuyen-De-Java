package com.example.backend.controller.user;

import com.example.backend.dto.OrderDto;
import com.example.backend.service.OrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping
    @org.springframework.security.access.prepost.PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<List<OrderDto>> getAll() {
        return ResponseEntity.ok(orderService.getAll());
    }

    @GetMapping("/{id}")
    @org.springframework.security.access.prepost.PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<OrderDto> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(orderService.getById(id));
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody OrderDto dto) {
        OrderDto createdOrder = orderService.create(dto);

        // If payment method is VNPAY, return order info for payment URL generation
        if (dto.getPaymentMethod() == com.example.backend.entity.enums.PaymentMethod.VNPAY) {
            return ResponseEntity.ok(java.util.Map.of(
                    "status", "success",
                    "order", createdOrder,
                    "message", "Order created, proceed to payment"));
        }

        // For COD/BANK, return order directly
        return ResponseEntity.ok(createdOrder);
    }

    @PutMapping("/{id}/status")
    @org.springframework.security.access.prepost.PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<OrderDto> updateStatus(
            @PathVariable Integer id,
            @RequestBody OrderDto dto) {
        return ResponseEntity.ok(orderService.updateStatus(id, dto));
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<?> cancel(
            @PathVariable Integer id,
            @RequestParam String reason) {
        orderService.cancel(id, reason);
        return ResponseEntity.ok(java.util.Map.of("status", true, "message", "Hủy đơn hàng thành công"));
    }

    @GetMapping("/my-orders")
    public ResponseEntity<?> getMyOrders(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(required = false) String from,
            @RequestParam(required = false) String to,
            @RequestParam(required = false) Integer status,
            @RequestParam(required = false) String payment,
            @RequestParam(required = false) java.math.BigDecimal min_total,
            @RequestParam(required = false) java.math.BigDecimal max_total,
            org.springframework.security.core.Authentication authentication) {
        // Get userId from JWT token
        String username = authentication.getName();
        Integer userId = orderService.getUserIdByUsername(username);

        // Build filters map
        java.util.Map<String, Object> filters = new java.util.HashMap<>();
        if (from != null)
            filters.put("from", from);
        if (to != null)
            filters.put("to", to);
        if (status != null)
            filters.put("status", status);
        if (payment != null)
            filters.put("payment", payment);
        if (min_total != null)
            filters.put("min_total", min_total);
        if (max_total != null)
            filters.put("max_total", max_total);

        return ResponseEntity.ok(orderService.getUserOrders(userId, page, filters));
    }
}
