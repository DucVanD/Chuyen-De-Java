package com.example.backend.service;

import java.math.BigDecimal;
import java.util.List;

import com.example.backend.dto.StockMovementDto;

public interface StockMovementService {

    List<StockMovementDto> getAll();

    org.springframework.data.domain.Page<StockMovementDto> getPage(int page, int size);

    StockMovementDto getById(Integer id);

    StockMovementDto create(StockMovementDto dto);

    BigDecimal getLastImportPrice(Integer productId);

    Integer getLastSupplierId(Integer productId);

    List<StockMovementDto> getByMovementType(String type);
}
