package com.example.backend.controller.user;

import com.example.backend.dto.ContactDto;
import com.example.backend.entity.Order;
import com.example.backend.repository.OrderRepository;
import com.example.backend.service.ContactService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/user/contacts")
@RequiredArgsConstructor
public class UserContactController {

    private final ContactService contactService;
    private final OrderRepository orderRepository;

    // Get contacts by order code
    @GetMapping("/order/{orderCode}")
    public ResponseEntity<List<ContactDto>> getContactsByOrderCode(@PathVariable String orderCode) {
        // Find order by code to get orderId
        Optional<Order> orderOpt = orderRepository.findByOrderCode(orderCode);
        if (orderOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        List<ContactDto> contacts = contactService.getContactsByOrderId(orderOpt.get().getId());
        return ResponseEntity.ok(contacts);
    }
}
