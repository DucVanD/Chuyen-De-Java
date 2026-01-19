package com.example.backend.service;

import com.example.backend.dto.ProductDto;
import com.example.backend.dto.CategoryHomeDto;
import java.util.List;
import org.springframework.data.domain.Page;

public interface ProductService {

        ProductDto getById(Integer id);

        ProductDto getBySlug(String slug);

        ProductDto create(ProductDto dto);

        ProductDto update(Integer id, ProductDto dto);

        void delete(Integer id);

        // List methods (for User side / backward compatibility)
        List<ProductDto> getAll();

        List<ProductDto> search(String keyword);

        List<ProductDto> filter(String keyword, List<Integer> categoryIds, List<Integer> brandIds, Integer status,
                        java.math.BigDecimal minPrice,
                        java.math.BigDecimal maxPrice, Boolean hasPromotion);

        // Page methods (for Admin side)
        // Page methods (for Admin side)
        Page<ProductDto> getPage(int page, int size);

        Page<ProductDto> search(String keyword, int page, int size);

        Page<ProductDto> filter(String keyword, List<Integer> categoryIds, List<Integer> brandIds, Integer status,
                        java.math.BigDecimal minPrice,
                        java.math.BigDecimal maxPrice, Boolean hasPromotion, String sortBy, int page, int size);

        List<ProductDto> getLatestProducts(int limit);

        List<CategoryHomeDto> getCategoriesHome();

        List<ProductDto> getRelatedProducts(Integer categoryId, Integer productId, int limit);

        void toggleStatus(Integer id);
}
