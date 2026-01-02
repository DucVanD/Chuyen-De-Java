package com.example.backend.repository;

import com.example.backend.entity.Voucher;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface VoucherRepository extends JpaRepository<Voucher, Integer> {

    Optional<Voucher> findByVoucherCode(String voucherCode);

    @org.springframework.data.jpa.repository.Modifying
    @org.springframework.data.jpa.repository.Query("UPDATE Voucher v SET v.usedCount = v.usedCount + 1 WHERE v.id = :id")
    void incrementUsedCount(@org.springframework.data.repository.query.Param("id") Integer id);
}
