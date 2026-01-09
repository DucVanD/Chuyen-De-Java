package com.example.backend.repository;

import com.example.backend.entity.Voucher;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface VoucherRepository extends JpaRepository<Voucher, Integer> {

    Optional<Voucher> findByVoucherCode(String voucherCode);

    @org.springframework.data.jpa.repository.Query("SELECT v FROM Voucher v WHERE v.status = 1 AND v.deletedAt IS NULL "
            +
            "AND v.startDate <= :now AND v.endDate >= :now " +
            "AND (v.usageLimit IS NULL OR v.usedCount < v.usageLimit)")
    java.util.List<Voucher> findAllActive(
            @org.springframework.data.repository.query.Param("now") java.time.LocalDateTime now);

    @org.springframework.data.jpa.repository.Modifying
    @org.springframework.data.jpa.repository.Query("UPDATE Voucher v SET v.usedCount = v.usedCount + 1 WHERE v.id = :id")
    void incrementUsedCount(@org.springframework.data.repository.query.Param("id") Integer id);
}
