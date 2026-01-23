package com.example.backend.service.impl;

import com.example.backend.config.CloudinaryService;
import com.example.backend.dto.ProductDto;
import com.example.backend.dto.CategoryHomeDto;
import com.example.backend.entity.Brand;
import com.example.backend.entity.Category;
import com.example.backend.entity.Product;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.mapper.ProductMapper;
import com.example.backend.repository.BrandRepository;
import com.example.backend.repository.CategoryRepository;
import com.example.backend.repository.ProductRepository;
import com.example.backend.service.ProductService;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
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
    private final com.example.backend.repository.OrderDetailRepository orderDetailRepository;

    public ProductServiceImpl(
            ProductRepository productRepository,
            CategoryRepository categoryRepository,
            BrandRepository brandRepository,
            CloudinaryService cloudinaryService,
            com.example.backend.repository.OrderDetailRepository orderDetailRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.brandRepository = brandRepository;
        this.cloudinaryService = cloudinaryService;
        this.orderDetailRepository = orderDetailRepository;
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
    public List<ProductDto> filter(String keyword, List<Integer> categoryIds, List<Integer> brandIds, Integer status,
            java.math.BigDecimal minPrice,
            java.math.BigDecimal maxPrice, Boolean hasPromotion) {
        return productRepository
                .filter(keyword, categoryIds, brandIds, status, minPrice, maxPrice, hasPromotion, Pageable.unpaged())
                .getContent()
                .stream()
                .map(ProductMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public Page<ProductDto> filter(String keyword, List<Integer> categoryIds, List<Integer> brandIds, Integer status,
            java.math.BigDecimal minPrice,
            java.math.BigDecimal maxPrice, Boolean hasPromotion, String sortBy, int page, int size) {

        org.springframework.data.domain.Sort sort;
        if ("price_asc".equals(sortBy)) {
            sort = org.springframework.data.domain.Sort.by("salePrice").ascending();
        } else if ("price_desc".equals(sortBy)) {
            sort = org.springframework.data.domain.Sort.by("salePrice").descending();
        } else {
            sort = org.springframework.data.domain.Sort.by("id").descending();
        }

        Pageable pageable = org.springframework.data.domain.PageRequest.of(page, size, sort);
        return productRepository
                .filter(keyword, categoryIds, brandIds, status, minPrice, maxPrice, hasPromotion, pageable)
                .map(ProductMapper::toDto);
    }

    // =====================
    // GET BY ID
    // =====================
    @Override
    public ProductDto getById(Integer id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new com.example.backend.exception.BusinessException("Không tìm thấy sản phẩm"));
        return ProductMapper.toDto(product);
    }

    @Override
    public ProductDto getBySlug(String slug) {
        Product product = productRepository.findBySlug(slug)
                .orElseThrow(
                        () -> new ResourceNotFoundException("Không tìm thấy sản phẩm với đường dẫn '" + slug + "'"));
        return ProductMapper.toDto(product);
    }

    // =====================
    // CREATE
    // =====================
    @Override
    public ProductDto create(ProductDto dto) {
        // 1. Check category exists
        if (!categoryRepository.existsById(dto.getCategoryId())) {
            throw new com.example.backend.exception.BusinessException("Danh mục không tồn tại");
        }

        // 2. Check brand exists
        if (!brandRepository.existsById(dto.getBrandId())) {
            throw new com.example.backend.exception.BusinessException("Thương hiệu không tồn tại");
        }

        // 3. Check duplicate name
        if (productRepository.existsByName(dto.getName())) {
            throw new com.example.backend.exception.BusinessException("Tên sản phẩm đã tồn tại");
        }

        // 4. Check price logic: sale >= cost
        if (dto.getCostPrice() != null && dto.getSalePrice() != null) {
            if (dto.getSalePrice().compareTo(dto.getCostPrice()) < 0) {
                throw new com.example.backend.exception.BusinessException("Giá bán không được nhỏ hơn giá nhập");
            }
        }

        // 5. Check price logic: discount <= sale
        if (dto.getDiscountPrice() != null && dto.getSalePrice() != null) {
            if (dto.getDiscountPrice().compareTo(dto.getSalePrice()) > 0) {
                throw new com.example.backend.exception.BusinessException("Giá giảm không được lớn hơn giá bán");
            }
        }

        Category category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new com.example.backend.exception.BusinessException("Danh mục không tồn tại"));

        Brand brand = brandRepository.findById(dto.getBrandId())
                .orElseThrow(() -> new com.example.backend.exception.BusinessException("Thương hiệu không tồn tại"));

        Product product = ProductMapper.toEntity(dto, category, brand);

        // Auto-generate slug
        if (product.getSlug() == null || product.getSlug().isBlank()) {
            String baseSlug = generateSlugFromName(dto.getName());
            product.setSlug(generateUniqueSlug(baseSlug, null));
        } else {
            product.setSlug(generateUniqueSlug(dto.getSlug(), null));
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
        // 1. Check category exists
        if (!categoryRepository.existsById(dto.getCategoryId())) {
            throw new com.example.backend.exception.BusinessException("Danh mục không tồn tại");
        }

        // 2. Check brand exists
        if (!brandRepository.existsById(dto.getBrandId())) {
            throw new com.example.backend.exception.BusinessException("Thương hiệu không tồn tại");
        }

        // 3. Check duplicate name (exclude current product)
        if (productRepository.existsByNameAndIdNot(dto.getName(), id)) {
            throw new com.example.backend.exception.BusinessException("Tên sản phẩm đã tồn tại");
        }

        // 4. Check price logic: sale >= cost
        if (dto.getCostPrice() != null && dto.getSalePrice() != null) {
            if (dto.getSalePrice().compareTo(dto.getCostPrice()) < 0) {
                throw new com.example.backend.exception.BusinessException("Giá bán không được nhỏ hơn giá nhập");
            }
        }

        // 5. Check price logic: discount <= sale
        if (dto.getDiscountPrice() != null && dto.getSalePrice() != null) {
            if (dto.getDiscountPrice().compareTo(dto.getSalePrice()) > 0) {
                throw new com.example.backend.exception.BusinessException("Giá giảm không được lớn hơn giá bán");
            }
        }

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new com.example.backend.exception.BusinessException("Không tìm thấy sản phẩm"));

        Category category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new com.example.backend.exception.BusinessException("Danh mục không tồn tại"));

        Brand brand = brandRepository.findById(dto.getBrandId())
                .orElseThrow(() -> new com.example.backend.exception.BusinessException("Thương hiệu không tồn tại"));

        product.setName(dto.getName());

        // Auto-generate slug update logic
        if (dto.getSlug() == null || dto.getSlug().isBlank()) {
            String baseSlug = generateSlugFromName(dto.getName());
            product.setSlug(generateUniqueSlug(baseSlug, id));
        } else if (!dto.getSlug().equals(product.getSlug())) {
            product.setSlug(generateUniqueSlug(dto.getSlug(), id));
        }

        product.setDescription(dto.getDescription());
        product.setDetail(dto.getDetail());
        product.setCostPrice(dto.getCostPrice());
        product.setSalePrice(dto.getSalePrice());
        product.setDiscountPrice(dto.getDiscountPrice());
        product.setStatus(dto.getStatus());
        product.setCategory(category);
        product.setBrand(brand);
        // CẬP NHẬT CẤU HÌNH BÁN HÀNG
        product.setSaleType(dto.getSaleType());
        product.setBaseWeight(dto.getBaseWeight());
        product.setUnitLabel(dto.getUnitLabel());
        product.setUpdatedBy(1);

        // ✅ CHỈ SET ẢNH KHI CÓ ẢNH MỚI
        if (dto.getImage() != null && !dto.getImage().isBlank()) {
            if (product.getImagePublicId() != null && !product.getImagePublicId().equals(dto.getImagePublicId())) {
                try {
                    cloudinaryService.deleteImage(product.getImagePublicId());
                } catch (Exception e) {
                    System.err.println("Lỗi xóa ảnh cũ khi update product: " + e.getMessage());
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
                .orElseThrow(() -> new com.example.backend.exception.BusinessException("Không tìm thấy sản phẩm"));

        // 🔎 CHECK VALIDATION: Sản phẩm đã có trong lịch sử mua hàng thì không được xóa
        long orderCount = orderDetailRepository.countByProductId(id);
        if (orderCount > 0) {
            throw new com.example.backend.exception.BusinessException(
                    "Không thể xóa sản phẩm này vì đã có trong lịch sử đơn hàng. " +
                            "Bạn nên 'Ẩn' sản phẩm hoặc đưa vào 'Thùng rác' thay vì xóa vĩnh viễn.");
        }

        // 1️⃣ XÓA ẢNH CLOUDINARY
        try {
            cloudinaryService.deleteImage(product.getImagePublicId());
        } catch (Exception e) {
            System.err.println("Không xóa được ảnh Cloudinary: " + e.getMessage());
        }

        // 2️⃣ XÓA DB
        productRepository.delete(product);
    }

    @Override
    @Transactional
    public void toggleStatus(Integer id) {
        if (id == null)
            return;
        productRepository.findById(id).ifPresent(product -> {
            Integer status = product.getStatus();
            if (status != null) {
                product.setStatus(status == 1 ? 0 : 1);
                productRepository.save(product);
            }
        });
    }

    private String generateSlugFromName(String name) {
        if (name == null || name.isBlank()) {
            return "product";
        }
        return java.text.Normalizer.normalize(name, java.text.Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "")
                .replaceAll("đ", "d")
                .replaceAll("Đ", "d")
                .toLowerCase()
                .replaceAll("\\s+", "-")
                .replaceAll("[^a-z0-9-]", "")
                .replaceAll("-+", "-")
                .replaceAll("^-+|-+$", "");
    }

    private String generateUniqueSlug(String baseSlug, Integer excludeId) {
        String slug = baseSlug;
        int counter = 1;

        while (true) {
            boolean exists = (excludeId != null)
                    ? productRepository.existsBySlugAndIdNot(slug, excludeId)
                    : productRepository.existsBySlug(slug);

            if (!exists) {
                return slug;
            }

            slug = baseSlug + "-" + counter;
            counter++;
        }
    }

    @Override
    public List<CategoryHomeDto> getCategoriesHome() {
        // Chỉ lấy 3 danh mục cụ thể: Dầu ăn (21), Kẹo (18), Nước ngọt (13)
        List<Integer> targetCategoryIds = List.of(21, 18, 13);

        return targetCategoryIds.stream()
                .map(categoryId -> categoryRepository.findById(categoryId).orElse(null))
                .filter(cat -> cat != null)
                .map(cat -> {
                    // Fetch top 4 products for each category
                    Pageable topFour = PageRequest.of(0, 4, org.springframework.data.domain.Sort.by("id").descending());
                    List<ProductDto> products = productRepository.filter(
                            null, List.of(cat.getId()), null, 1, null, null, null, topFour)
                            .getContent()
                            .stream()
                            .map(ProductMapper::toDto)
                            .toList();

                    return CategoryHomeDto.builder()
                            .id(cat.getId())
                            .name(cat.getName())
                            .slug(cat.getSlug())
                            .products(products)
                            .build();
                })
                .filter(dto -> !dto.getProducts().isEmpty())
                .toList();
    }

    @Override
    public List<ProductDto> getLatestProducts(int limit) {
        return productRepository.findLatestProducts(PageRequest.of(0, limit)).stream()
                .map(ProductMapper::toDto)
                .toList();
    }

    @Override
    public List<ProductDto> getRelatedProducts(Integer categoryId, Integer productId, int limit) {
        return productRepository.findRelatedProducts(categoryId, productId, PageRequest.of(0, limit))
                .stream()
                .map(ProductMapper::toDto)
                .collect(Collectors.toList());
    }

}
