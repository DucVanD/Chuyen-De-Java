package com.example.backend.entity;

import com.example.backend.entity.enums.StockMovementType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "stock_movements")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EntityListeners(AuditingEntityListener.class) // Để dùng @CreatedBy
public class StockMovement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    // Có thể null (Ví dụ: Xuất kho bán hàng thì không cần Nhà cung cấp)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "supplier_id")
    private Supplier supplier;

    // Có thể null (Ví dụ: Nhập hàng từ NCC thì không có Order của khách)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    private Order order;

    @Enumerated(EnumType.STRING)
    @Column(name = "movement_type", nullable = false)
    private StockMovementType movementType;

    @Column(nullable = false)
    private Integer quantity; // Số lượng biến động

    @Column(name = "unit_price")
    private BigDecimal unitPrice; // Giá nhập/xuất tại thời điểm đó

    @Column(name = "current_stock", nullable = false)
    private Integer currentStock; // Tồn kho sau khi biến động (Snapshot)

    private String note;

    @CreatedBy
    @Column(name = "created_by", updatable = false)
    private Integer createdBy; // Ai là người nhập/xuất kho

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;
}