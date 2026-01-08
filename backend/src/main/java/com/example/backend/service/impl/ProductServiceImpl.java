package com.example.backend.service.impl;

import com.example.backend.dto.ProductDto;
import com.example.backend.entity.Product;
import com.example.backend.entity.Category;
import com.example.backend.entity.Brand;
import com.example.backend.mapper.ProductMapper;
import com.example.backend.repository.ProductRepository;
import com.example.backend.repository.CategoryRepository;
import com.example.backend.repository.BrandRepository;
import com.example.backend.service.ProductService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final BrandRepository brandRepository;

    public ProductServiceImpl(ProductRepository productRepository,
            CategoryRepository categoryRepository,
            BrandRepository brandRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.brandRepository = brandRepository;
    }

    @Override
    public List<ProductDto> getAll() {
        return productRepository.findAll().stream()
                .map(ProductMapper::toDto)
                .toList();
    }

    @Override
    public Map<String, Object> getAllFiltered(Map<String, String> filters, int page) {
        Page<Product> productPage = productRepository.findAll(PageRequest.of(page - 1, 10));

        Map<String, Object> result = new HashMap<>();
        result.put("data", productPage.getContent().stream().map(ProductMapper::toDto).toList());
        result.put("current_page", productPage.getNumber() + 1);
        result.put("last_page", productPage.getTotalPages());
        result.put("total", productPage.getTotalElements());

        return result;
    }

    @Override
    public ProductDto getById(Integer id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        return ProductMapper.toDto(product);
    }

    @Override
    public ProductDto create(ProductDto dto) {
        Product product = ProductMapper.toEntity(dto);
        // Link category and brand
        if (dto.getCategoryId() != null) {
            Category category = categoryRepository.findById(dto.getCategoryId()).orElse(null);
            product.setCategory(category);
        }
        if (dto.getBrandId() != null) {
            Brand brand = brandRepository.findById(dto.getBrandId()).orElse(null);
            product.setBrand(brand);
        }
        return ProductMapper.toDto(productRepository.save(product));
    }

    @Override
    public ProductDto update(Integer id, ProductDto dto) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        // Update fields
        product.setName(dto.getName());
        product.setSlug(dto.getSlug());
        product.setImage(dto.getImage());
        product.setDescription(dto.getDescription());
        product.setDetail(dto.getDetail());
        product.setQty(dto.getQty());
        product.setSalePrice(dto.getPrice());
        product.setDiscountPrice(dto.getSale());
        product.setCostPrice(dto.getCostPrice());
        product.setStatus(dto.getStatus());

        if (dto.getCategoryId() != null) {
            Category category = categoryRepository.findById(dto.getCategoryId()).orElse(null);
            product.setCategory(category);
        }
        if (dto.getBrandId() != null) {
            Brand brand = brandRepository.findById(dto.getBrandId()).orElse(null);
            product.setBrand(brand);
        }

        return ProductMapper.toDto(productRepository.save(product));
    }

    @Override
    public void delete(Integer id) {
        productRepository.deleteById(id);
    }

    @Override
    public void toggleStatus(Integer id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        product.setStatus(product.getStatus() == 1 ? 0 : 1);
        productRepository.save(product);
    }
}
