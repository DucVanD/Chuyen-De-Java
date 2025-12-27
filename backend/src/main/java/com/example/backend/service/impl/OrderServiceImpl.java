package com.example.backend.service.impl;
import com.example.backend.entity.enums.OrderStatus;
import com.example.backend.dto.OrderDto;
import com.example.backend.entity.*;
import com.example.backend.mapper.OrderMapper;
import com.example.backend.repository.*;
import com.example.backend.service.OrderService;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final VoucherRepository voucherRepository;

    public OrderServiceImpl(
            OrderRepository orderRepository,
            UserRepository userRepository,
            VoucherRepository voucherRepository
    ) {
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.voucherRepository = voucherRepository;
    }

    @Override
    public List<OrderDto> getAll() {
        return orderRepository.findAll()
                .stream()
                .map(OrderMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public OrderDto getById(Integer id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        return OrderMapper.toDto(order);
    }

    @Override
    public OrderDto create(OrderDto dto) {

        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Voucher voucher = null;
        if (dto.getVoucherId() != null) {
            voucher = voucherRepository.findById(dto.getVoucherId())
                    .orElseThrow(() -> new RuntimeException("Voucher not found"));
        }

        Order order = OrderMapper.toEntity(dto, user, voucher);
        Order saved = orderRepository.save(order);

        return OrderMapper.toDto(saved);
    }

    @Override
    public OrderDto updateStatus(Integer id, OrderDto dto) {

        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        order.setStatus(dto.getStatus());
        order.setPaymentStatus(dto.getPaymentStatus());

        Order updated = orderRepository.save(order);
        return OrderMapper.toDto(updated);
    }

    @Override
    public void cancel(Integer id, String reason) {

        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        order.setStatus(OrderStatus.CANCELLED);
        order.setCancelReason(reason);

        orderRepository.save(order);
    }
}
