package com.example.backend.repository;

import com.example.backend.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Integer> {
    // ✅ Kiểm tra slug đã tồn tại
    boolean existsBySlug(String slug);

    // ✅ Kiểm tra slug tồn tại (trừ category hiện tại khi update)
    boolean existsBySlugAndIdNot(String slug, Integer id);

    // ✅ Đếm số danh mục con
    long countByParentId(Integer parentId);
}