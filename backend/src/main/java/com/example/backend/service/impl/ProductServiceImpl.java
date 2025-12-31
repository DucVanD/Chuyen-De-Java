package com.example.backend.service.impl;

import com.example.backend.config.CloudinaryService;
import com.example.backend.dto.ProductDto;
import com.example.backend.entity.Brand;
import com.example.backend.entity.Category;
import com.example.backend.entity.Product;
import com.example.backend.mapper.ProductMapper;
import com.example.backend.repository.BrandRepository;
import com.example.backend.repository.CategoryRepository;
import com.example.backend.repository.ProductRepository;
import com.example.backend.service.ProductService;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final BrandRepository brandRepository;
    private final CloudinaryService cloudinaryService;

    public ProductServiceImpl(
            ProductRepository productRepository,
            CategoryRepository categoryRepository,
            BrandRepository brandRepository,
            CloudinaryService cloudinaryService) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.brandRepository = brandRepository;
        this.cloudinaryService = cloudinaryService;
    }

    // =====================
    // GET ALL
    // =====================
    @Override
    public List<ProductDto> getAll() {
        return productRepository.findAll()
                .stream()
                .map(ProductMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public Page<ProductDto> getPage(int page, int size) {
        Pageable pageable = org.springframework.data.domain.PageRequest.of(page, size,
                org.springframework.data.domain.Sort.by("id").descending());
        return productRepository.findAll(pageable)
                .map(ProductMapper::toDto);
    }

    // =====================
    // SEARCH
    // =====================
    @Override
    public List<ProductDto> search(String keyword) {
        return productRepository.search(keyword, Pageable.unpaged())
                .getContent()
                .stream()
                .map(ProductMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public Page<ProductDto> search(String keyword, int page, int size) {
        Pageable pageable = org.springframework.data.domain.PageRequest.of(page, size,
                org.springframework.data.domain.Sort.by("id").descending());
        return productRepository.search(keyword, pageable)
                .map(ProductMapper::toDto);
    }

    // =====================
    // FILTER
    // =====================
    @Override
    public List<ProductDto> filter(Integer categoryId, Integer brandId, Integer status, java.math.BigDecimal minPrice,
            java.math.BigDecimal maxPrice, Boolean hasPromotion) {
        return productRepository
                .filter(categoryId, brandId, status, minPrice, maxPrice, hasPromotion, Pageable.unpaged())
                .getContent()
                .stream()
                .map(ProductMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public Page<ProductDto> filter(Integer categoryId, Integer brandId, Integer status, java.math.BigDecimal minPrice,
            java.math.BigDecimal maxPrice, Boolean hasPromotion, int page, int size) {
        Pageable pageable = org.springframework.data.domain.PageRequest.of(page, size,
                org.springframework.data.domain.Sort.by("id").descending());
        return productRepository.filter(categoryId, brandId, status, minPrice, maxPrice, hasPromotion, pageable)
                .map(ProductMapper::toDto);
    }

    // =====================
    // GET BY ID
    // =====================
    @Override
    public ProductDto getById(Integer id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        return ProductMapper.toDto(product);
    }

    // =====================
    // CREATE
    // =====================
    @Override
    public ProductDto create(ProductDto dto) {
        // Validation Logic
        if (dto.getDiscountPrice() != null && dto.getSalePrice().compareTo(dto.getDiscountPrice()) < 0) {
            throw new IllegalArgumentException("Giá khuyến mãi không được lớn hơn giá bán");
        }

        Category category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        Brand brand = brandRepository.findById(dto.getBrandId())
                .orElseThrow(() -> new RuntimeException("Brand not found"));

        Product product = ProductMapper.toEntity(dto, category, brand);

        // Auto-generate slug
        if (product.getSlug() == null || product.getSlug().isBlank()) {
            product.setSlug(generateUniqueSlug(dto.getName()));
        }

        product.setUpdatedBy(1); // TODO: Replace with actual User ID from context

        Product saved = productRepository.save(product);
        return ProductMapper.toDto(saved);
    }

    // =====================
    // UPDATE
    // =====================
    @Override
    public ProductDto update(Integer id, ProductDto dto) {
        // Validation Logic
        if (dto.getDiscountPrice() != null && dto.getSalePrice().compareTo(dto.getDiscountPrice()) < 0) {
            throw new IllegalArgumentException("Giá khuyến mãi không được lớn hơn giá bán");
        }

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Category category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        Brand brand = brandRepository.findById(dto.getBrandId())
                .orElseThrow(() -> new RuntimeException("Brand not found"));

        product.setName(dto.getName());

        // Auto-generate slug update logic
        if (dto.getSlug() == null || dto.getSlug().isBlank()) {
            if (product.getSlug() == null || product.getSlug().isBlank()) {
                product.setSlug(generateUniqueSlug(dto.getName()));
            }
            // Keep old slug if not provided
        } else {
            if (!dto.getSlug().equals(product.getSlug())) {
                product.setSlug(generateUniqueSlug(dto.getSlug()));
            }
        }

        product.setDescription(dto.getDescription());
        product.setDetail(dto.getDetail());
        product.setCostPrice(dto.getCostPrice());
        product.setSalePrice(dto.getSalePrice());
        product.setDiscountPrice(dto.getDiscountPrice());
        product.setStatus(dto.getStatus());
        product.setCategory(category);
        product.setBrand(brand);
        product.setUpdatedBy(1);

        // ✅ CHỈ SET ẢNH KHI CÓ ẢNH MỚI
        if (dto.getImage() != null && !dto.getImage().isBlank()) {
            if (product.getImagePublicId() != null) {
                try {
                    cloudinaryService.deleteImage(product.getImagePublicId());
                } catch (Exception e) {
                    System.err.println("Lỗi xóa ảnh cũ khi update: " + e.getMessage());
                }
            }
            product.setImage(dto.getImage());
            product.setImagePublicId(dto.getImagePublicId());
        }

        Product updated = productRepository.save(product);
        return ProductMapper.toDto(updated);
    }

    // =====================
    // DELETE (XÓA ẢNH + DB)
    // =====================
    @Override
    @Transactional
    public void delete(Integer id) {

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // 1️⃣ XÓA ẢNH CLOUDINARY
        try {
            cloudinaryService.deleteImage(product.getImagePublicId());
        } catch (Exception e) {
            System.err.println("Không xóa được ảnh Cloudinary: " + e.getMessage());
        }

        // 2️⃣ XÓA DB
        productRepository.delete(product);
    }

    // Helper: Generate Unique Slug
    private String generateUniqueSlug(String nameOrSlug) {
        if (nameOrSlug == null || nameOrSlug.isBlank()) {
            nameOrSlug = "product";
        }

        // 1. Convert to simple slug
        String baseSlug = nameOrSlug.trim().toLowerCase()
                .replaceAll("[^a-z0-9\\s-]", "")
                .replaceAll("\\s+", "-")
                .replaceAll("-+", "-");

        String uniqueSlug = baseSlug;
        int count = 1;

        // 2. Loop until finding a non-existing slug
        while (productRepository.existsBySlug(uniqueSlug)) {
            uniqueSlug = baseSlug + "-" + count;
            count++;
        }

        return uniqueSlug;
    }
}
