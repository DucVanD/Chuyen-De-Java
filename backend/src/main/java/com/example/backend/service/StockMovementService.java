package com.example.backend.service;

import java.math.BigDecimal;
import java.util.List;

import com.example.backend.dto.StockMovementDto;

public interface StockMovementService {

    List<StockMovementDto> getAll();

    StockMovementDto getById(Integer id);

    StockMovementDto create(StockMovementDto dto);

    BigDecimal getLastImportPrice(Integer productId);
}
