package com.example.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.backend.entity.StockMovement;

public interface StockMovementRepository extends JpaRepository<StockMovement, Integer> {

}