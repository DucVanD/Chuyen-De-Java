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

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final BrandRepository brandRepository;
    private final CloudinaryService cloudinaryService; // ✅ THÊM DÒNG NÀY

    public ProductServiceImpl(
            ProductRepository productRepository,
            CategoryRepository categoryRepository,
            BrandRepository brandRepository,
            CloudinaryService cloudinaryService // ✅ THÊM VÀO CONSTRUCTOR
    ) {
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
        Category category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        Brand brand = brandRepository.findById(dto.getBrandId())
                .orElseThrow(() -> new RuntimeException("Brand not found"));

        Product product = ProductMapper.toEntity(dto, category, brand);
        product.setUpdatedBy(1);

        Product saved = productRepository.save(product);
        return ProductMapper.toDto(saved);
    }

    // =====================
    // UPDATE
    // =====================
  @Override
public ProductDto update(Integer id, ProductDto dto) {
    Product product = productRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Product not found"));

    Category category = categoryRepository.findById(dto.getCategoryId())
            .orElseThrow(() -> new RuntimeException("Category not found"));

    Brand brand = brandRepository.findById(dto.getBrandId())
            .orElseThrow(() -> new RuntimeException("Brand not found"));

    product.setName(dto.getName());
    product.setSlug(dto.getSlug());
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

    // =====================
    // SEARCH
    // =====================
    @Override
    public List<ProductDto> search(String keyword) {
        return productRepository.search(keyword)
                .stream()
                .map(ProductMapper::toDto)
                .collect(Collectors.toList());
    }

    // =====================
    // FILTER
    // =====================
    @Override
    public List<ProductDto> filter(Integer categoryId, Integer status) {
        return productRepository.filter(categoryId, status)
                .stream()
                .map(ProductMapper::toDto)
                .collect(Collectors.toList());
    }
}
