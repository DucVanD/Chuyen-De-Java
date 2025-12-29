package com.example.backend.controller.admin;

import com.example.backend.dto.StockMovementDto;
import com.example.backend.service.StockMovementService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/stock-movements")
public class AdminStockMovementController {

    private final StockMovementService stockMovementService;

    public AdminStockMovementController(StockMovementService stockMovementService) {
        this.stockMovementService = stockMovementService;
    }

    @GetMapping
    public ResponseEntity<List<StockMovementDto>> getAll() {
        return ResponseEntity.ok(stockMovementService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<StockMovementDto> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(stockMovementService.getById(id));
    }

    @PostMapping
    public ResponseEntity<StockMovementDto> create(@RequestBody StockMovementDto dto) {
        return ResponseEntity.ok(stockMovementService.create(dto));
    }

    @GetMapping("/last-import-price/{productId}")
    public ResponseEntity<BigDecimal> getLastImportPrice(
            @PathVariable Integer productId) {
        return ResponseEntity.ok(
                stockMovementService.getLastImportPrice(productId));
    }

}
