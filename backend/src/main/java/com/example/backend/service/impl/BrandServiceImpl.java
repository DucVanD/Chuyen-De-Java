package com.example.backend.service.impl;

import com.example.backend.config.CloudinaryService;
import com.example.backend.dto.BrandDto;
import com.example.backend.entity.Brand;
import com.example.backend.mapper.BrandMapper;
import com.example.backend.repository.BrandRepository;
import com.example.backend.service.BrandService;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BrandServiceImpl implements BrandService {

    private final BrandRepository brandRepository;
    private final CloudinaryService cloudinaryService;
    private final com.example.backend.repository.ProductRepository productRepository;

    public BrandServiceImpl(
            BrandRepository brandRepository,
            CloudinaryService cloudinaryService,
            com.example.backend.repository.ProductRepository productRepository) {
        this.brandRepository = brandRepository;
        this.cloudinaryService = cloudinaryService;
        this.productRepository = productRepository;
    }

    @Override
    public List<BrandDto> getAll() {
        return brandRepository.findAll()
                .stream()
                .map(BrandMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public BrandDto getById(Integer id) {
        Brand brand = brandRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Brand not found"));
        return BrandMapper.toDto(brand);
    }

    @Override
    public BrandDto create(BrandDto dto) {
        Brand brand = BrandMapper.toEntity(dto);

        // Auto-generate unique slug
        if (brand.getSlug() == null || brand.getSlug().isBlank()) {
            brand.setSlug(generateUniqueSlug(brand.getName()));
        }

        Brand saved = brandRepository.save(brand);
        return BrandMapper.toDto(saved);
    }

    @Override
    public BrandDto update(Integer id, BrandDto dto) {
        Brand brand = brandRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Brand not found"));

        brand.setName(dto.getName());
        brand.setDescription(dto.getDescription());
        brand.setCountry(dto.getCountry());
        brand.setStatus(dto.getStatus());

        // Slug Update Logic
        if (dto.getSlug() != null && !dto.getSlug().isBlank()) {
            if (!dto.getSlug().equals(brand.getSlug())) {
                brand.setSlug(generateUniqueSlug(dto.getSlug()));
            }
        } else {
            // Auto generate if name changed and slug is empty (optional, keeping it simple
            // for now)
            if (!dto.getName().equals(brand.getName())) {
                brand.setSlug(generateUniqueSlug(dto.getName()));
            }
        }

        // Image Handling
        if (dto.getImage() != null && !dto.getImage().isBlank()) {
            // Delete old image if exists
            if (brand.getImagePublicId() != null) {
                try {
                    cloudinaryService.deleteImage(brand.getImagePublicId());
                } catch (Exception e) {
                    System.err.println("Error deleting old brand image: " + e.getMessage());
                }
            }
            brand.setImage(dto.getImage());
            brand.setImagePublicId(dto.getImagePublicId());
        }

        Brand updated = brandRepository.save(brand);
        return BrandMapper.toDto(updated);
    }

    @Override
    @Transactional
    public void delete(Integer id) {
        Brand brand = brandRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Brand not found"));

        // ✅ VALIDATE: Không được xóa nếu có sản phẩm
        long productCount = productRepository.countByBrandId(id);
        if (productCount > 0) {
            throw new IllegalStateException(
                    "Không thể xóa thương hiệu đang có " + productCount + " sản phẩm. " +
                            "Vui lòng chuyển sản phẩm sang thương hiệu khác trước.");
        }

        // Delete image from Cloudinary
        if (brand.getImagePublicId() != null) {
            try {
                cloudinaryService.deleteImage(brand.getImagePublicId());
            } catch (Exception e) {
                System.err.println("Error deleting brand image from Cloudinary: " + e.getMessage());
            }
        }

        brandRepository.delete(brand);
    }

    // Helper: Generate Unique Slug
    private String generateUniqueSlug(String nameOrSlug) {
        if (nameOrSlug == null || nameOrSlug.isBlank()) {
            nameOrSlug = "brand";
        }

        String baseSlug = nameOrSlug.trim().toLowerCase()
                .replaceAll("[^a-z0-9\\s-]", "")
                .replaceAll("\\s+", "-")
                .replaceAll("-+", "-");

        String uniqueSlug = baseSlug;
        int count = 1;

        while (brandRepository.existsBySlug(uniqueSlug)) {
            uniqueSlug = baseSlug + "-" + count;
            count++;
        }

        return uniqueSlug;
    }
}
