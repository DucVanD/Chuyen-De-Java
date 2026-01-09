package com.example.backend.repository;

import com.example.backend.entity.enums.StockMovementType;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.backend.entity.StockMovement;

public interface StockMovementRepository extends JpaRepository<StockMovement, Integer> {
    // Lấy lần nhập kho (IN) gần nhất
    Optional<StockMovement> findTopByProductIdAndMovementTypeOrderByCreatedAtDesc(
            Integer productId,
            StockMovementType movementType);

    // Lấy có phân trang, loại trừ một loại (ví dụ: loại trừ OUT)
    org.springframework.data.domain.Page<StockMovement> findAllByMovementTypeNot(
            StockMovementType movementType,
            org.springframework.data.domain.Pageable pageable);

    long countBySupplierId(Integer supplierId);
}