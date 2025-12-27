package com.example.backend.service;

import com.example.backend.dto.OrderDto;

import java.util.List;

public interface OrderService {

    List<OrderDto> getAll();

    OrderDto getById(Integer id);

    OrderDto create(OrderDto dto);

    OrderDto updateStatus(Integer id, OrderDto dto);

    void cancel(Integer id, String reason);
}
