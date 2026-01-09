package com.example.backend.service.impl;

import com.example.backend.dto.StockMovementDto;
import com.example.backend.entity.Order;
import com.example.backend.entity.Product;
import com.example.backend.entity.StockMovement;
import com.example.backend.entity.Supplier;
import com.example.backend.entity.enums.StockMovementType;
import com.example.backend.mapper.StockMovementMapper;
import com.example.backend.repository.OrderRepository;
import com.example.backend.repository.ProductRepository;
import com.example.backend.repository.StockMovementRepository;
import com.example.backend.repository.SupplierRepository;
import com.example.backend.service.StockMovementService;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class StockMovementServiceImpl implements StockMovementService {

    private final StockMovementRepository stockMovementRepository;
    private final ProductRepository productRepository;
    private final SupplierRepository supplierRepository;
    private final OrderRepository orderRepository;

    public StockMovementServiceImpl(
            StockMovementRepository stockMovementRepository,
            ProductRepository productRepository,
            SupplierRepository supplierRepository,
            OrderRepository orderRepository) {
        this.stockMovementRepository = stockMovementRepository;
        this.productRepository = productRepository;
        this.supplierRepository = supplierRepository;
        this.orderRepository = orderRepository;
    }

    @Override
    public List<StockMovementDto> getAll() {
        return stockMovementRepository.findAll()
                .stream()
                .map(StockMovementMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public StockMovementDto getById(Integer id) {
        StockMovement movement = stockMovementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("StockMovement not found"));
        return StockMovementMapper.toDto(movement);
    }

    @Override
    public org.springframework.data.domain.Page<StockMovementDto> getPage(int page, int size, String excludeType) {
        org.springframework.data.domain.Pageable pageable = org.springframework.data.domain.PageRequest.of(page, size,
                org.springframework.data.domain.Sort.by("createdAt").descending());

        if (excludeType != null && !excludeType.isEmpty()) {
            try {
                StockMovementType type = StockMovementType.valueOf(excludeType.toUpperCase());
                return stockMovementRepository.findAllByMovementTypeNot(type, pageable)
                        .map(StockMovementMapper::toDto);
            } catch (IllegalArgumentException e) {
                // If invalid type, fallback to normal page
            }
        }
        return stockMovementRepository.findAll(pageable)
                .map(StockMovementMapper::toDto);
    }

    @Override
    public StockMovementDto create(StockMovementDto dto) {

        Product product = productRepository.findById(dto.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Supplier supplier = null;
        if (dto.getSupplierId() != null) {
            supplier = supplierRepository.findById(dto.getSupplierId())
                    .orElseThrow(() -> new RuntimeException("Supplier not found"));
        }

        Order order = null;
        if (dto.getOrderId() != null) {
            order = orderRepository.findById(dto.getOrderId())
                    .orElseThrow(() -> new RuntimeException("Order not found"));
        }

        // 🔥 TỒN HIỆN TẠI
        int currentQty = product.getQty(); // qty trong bảng product
        int newQty = currentQty;

        switch (dto.getMovementType()) {
            case IN:
                newQty = currentQty + dto.getQuantity();
                // ✅ CẬP NHẬT GIÁ NHẬP MỚI NHẤT VÀO BẢNG PRODUCT
                if (dto.getUnitPrice() != null) {
                    product.setCostPrice(dto.getUnitPrice());
                }
                break;

            case OUT:
                if (currentQty < dto.getQuantity()) {
                    throw new RuntimeException("Không đủ tồn kho");
                }
                newQty = currentQty - dto.getQuantity();
                break;

            case RETURN:
                newQty = currentQty + dto.getQuantity();
                break;

            case ADJUSTMENT:
                newQty = currentQty + dto.getQuantity(); // cho phép âm/dương
                break;

            default:
                throw new RuntimeException("Movement type không hợp lệ");
        }

        // 🔥 CẬP NHẬT TỒN KHO SẢN PHẨM
        product.setQty(newQty);
        productRepository.save(product);

        // 🔥 LƯU LOG BIẾN ĐỘNG
        StockMovement movement = StockMovementMapper.toEntity(dto, product, supplier, order);
        movement.setCurrentStock(newQty);
        StockMovement saved = stockMovementRepository.save(movement);
        return StockMovementMapper.toDto(saved);
    }

    @Override
    public BigDecimal getLastImportPrice(Integer productId) {
        return stockMovementRepository
                .findTopByProductIdAndMovementTypeOrderByCreatedAtDesc(
                        productId, StockMovementType.IN)
                .map(StockMovement::getUnitPrice)
                .orElse(BigDecimal.ZERO);
    }

    @Override
    public Integer getLastSupplierId(Integer productId) {
        return stockMovementRepository
                .findTopByProductIdAndMovementTypeOrderByCreatedAtDesc(
                        productId, StockMovementType.IN)
                .map(m -> m.getSupplier() != null ? m.getSupplier().getId() : null)
                .orElse(null);
    }

    @Override
    public List<StockMovementDto> getByMovementType(String type) {
        StockMovementType movementType = StockMovementType.valueOf(type.toUpperCase());
        return stockMovementRepository.findAll()
                .stream()
                .filter(m -> m.getMovementType() == movementType)
                .map(StockMovementMapper::toDto)
                .collect(Collectors.toList());
    }
}
