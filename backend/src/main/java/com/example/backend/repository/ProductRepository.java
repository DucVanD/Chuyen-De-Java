package com.example.backend.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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
        Page<Product> search(@Param("keyword") String keyword, Pageable pageable);

        @Query("""
                            SELECT p FROM Product p
                            WHERE (:categoryId IS NULL OR p.category.id = :categoryId)
                              AND (:brandId IS NULL OR p.brand.id = :brandId)
                              AND (:status IS NULL OR p.status = :status)
                              AND (:minPrice IS NULL OR p.salePrice >= :minPrice)
                              AND (:maxPrice IS NULL OR p.salePrice <= :maxPrice)
                              AND (:hasPromotion IS NULL
                                   OR (:hasPromotion = true AND p.discountPrice > 0 AND p.discountPrice < p.salePrice)
                                   OR (:hasPromotion = false AND (p.discountPrice IS NULL OR p.discountPrice = 0 OR p.discountPrice >= p.salePrice)))
                        """)
        Page<Product> filter(
                        @Param("categoryId") Integer categoryId,
                        @Param("brandId") Integer brandId,
                        @Param("status") Integer status,
                        @Param("minPrice") java.math.BigDecimal minPrice,
                        @Param("maxPrice") java.math.BigDecimal maxPrice,
                        @Param("hasPromotion") Boolean hasPromotion,
                        Pageable pageable);

        // ✅ Đếm số sản phẩm theo category (để validate khi xóa)
        long countByCategoryId(Integer categoryId);

        // ✅ Check slug tồn tại
        boolean existsBySlug(String slug);

        // ✅ Đếm sản phẩm theo Brand để validate delete
        long countByBrandId(Integer brandId);

}
