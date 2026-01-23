package com.example.backend.controller.user;

import com.example.backend.dto.OrderDto;
import com.example.backend.service.OrderService;
import com.example.backend.entity.enums.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.CollectionModel;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping
    @org.springframework.security.access.prepost.PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<CollectionModel<EntityModel<OrderDto>>> getAll() {
        List<EntityModel<OrderDto>> orders = orderService.getAll().stream()
                .map(this::toModel)
                .collect(Collectors.toList());
        return ResponseEntity.ok(CollectionModel.of(orders,
                linkTo(methodOn(OrderController.class).getAll()).withSelfRel()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<EntityModel<OrderDto>> getById(@PathVariable Integer id) {
        OrderDto dto = orderService.getById(id);
        return ResponseEntity.ok(toModel(dto));
    }

    @PostMapping
    public ResponseEntity<EntityModel<OrderDto>> create(@RequestBody OrderDto dto) {
        OrderDto createdOrder = orderService.create(dto);
        return ResponseEntity.ok(toModel(createdOrder));
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

        java.util.Map<String, Object> result = orderService.getUserOrders(userId, page, filters);

        // Wrap orders in EntityModel to add HATEOAS links
        if (result.get("data") instanceof java.util.Map) {
            java.util.Map<String, Object> data = (java.util.Map<String, Object>) result.get("data");
            if (data.get("orders") instanceof java.util.List) {
                java.util.List<OrderDto> orderDtos = (java.util.List<OrderDto>) data.get("orders");
                java.util.List<EntityModel<OrderDto>> orderModels = orderDtos.stream()
                        .map(this::toModel)
                        .collect(Collectors.toList());
                data.put("orders", orderModels);
            }
        }

        return ResponseEntity.ok(result);
    }

    private EntityModel<OrderDto> toModel(OrderDto dto) {
        EntityModel<OrderDto> model = EntityModel.of(dto);
        model.add(linkTo(methodOn(OrderController.class).getById(dto.getId())).withSelfRel());

        // Cancel link if PENDING
        if (dto.getStatus() == OrderStatus.PENDING) {
            model.add(linkTo(methodOn(OrderController.class).cancel(dto.getId(), "Reason"))
                    .withRel("cancel_order"));
        }

        // Pay link if VNPAY and UNPAID
        if (dto.getPaymentMethod() == PaymentMethod.VNPAY && dto.getPaymentStatus() == PaymentStatus.UNPAID) {
            model.add(linkTo(methodOn(VNPayController.class).createPayment(dto.getId(), null))
                    .withRel("payment_url"));
        }

        return model;
    }
}
