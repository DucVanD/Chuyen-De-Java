package com.example.backend.controller.admin;

import com.example.backend.dto.StockMovementDto;
import com.example.backend.service.StockMovementService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/admin/stock-movements")
public class AdminStockMovementController {

    private final StockMovementService stockMovementService;

    public AdminStockMovementController(StockMovementService stockMovementService) {
        this.stockMovementService = stockMovementService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    public ResponseEntity<List<StockMovementDto>> getAll() {
        return ResponseEntity.ok(stockMovementService.getAll());
    }

    @GetMapping("/page")
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    public ResponseEntity<org.springframework.data.domain.Page<StockMovementDto>> getPage(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(stockMovementService.getPage(page, size));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    public ResponseEntity<StockMovementDto> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(stockMovementService.getById(id));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    public ResponseEntity<StockMovementDto> create(@RequestBody com.example.backend.dto.StockMovementDto dto) {
        return ResponseEntity.ok(stockMovementService.create(dto));
    }

    @GetMapping("/last-import-price/{productId}")
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    public ResponseEntity<BigDecimal> getLastImportPrice(
            @PathVariable Integer productId) {
        return ResponseEntity.ok(
                stockMovementService.getLastImportPrice(productId));
    }

    @GetMapping("/last-supplier/{productId}")
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    public ResponseEntity<Integer> getLastSupplierId(
            @PathVariable Integer productId) {
        return ResponseEntity.ok(
                stockMovementService.getLastSupplierId(productId));
    }

}
