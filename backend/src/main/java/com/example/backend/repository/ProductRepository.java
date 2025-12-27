package com.example.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.backend.entity.Product;

public interface ProductRepository extends JpaRepository<Product, Integer> {

    @Query("""
                SELECT p FROM Product p
                WHERE p.name LIKE %:keyword%
                   OR p.slug LIKE %:keyword%
            """)
    List<Product> search(@Param("keyword") String keyword);

    @Query("""
                SELECT p FROM Product p
                WHERE (:categoryId IS NULL OR p.category.id = :categoryId)
                  AND (:status IS NULL OR p.status = :status)
            """)
    List<Product> filter(
            @Param("categoryId") Integer categoryId,
            @Param("status") Integer status);

}
