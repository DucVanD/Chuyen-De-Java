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
    public ResponseEntity<List<OrderDto>> getAll() {
        return ResponseEntity.ok(orderService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderDto> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(orderService.getById(id));
    }

    @PostMapping
    public ResponseEntity<OrderDto> create(@RequestBody OrderDto dto) {
        return ResponseEntity.ok(orderService.create(dto));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<OrderDto> updateStatus(
            @PathVariable Integer id,
            @RequestBody OrderDto dto
    ) {
        return ResponseEntity.ok(orderService.updateStatus(id, dto));
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<Void> cancel(
            @PathVariable Integer id,
            @RequestParam String reason
    ) {
        orderService.cancel(id, reason);
        return ResponseEntity.noContent().build();
    }
}
