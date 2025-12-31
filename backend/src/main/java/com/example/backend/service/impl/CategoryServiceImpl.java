package com.example.backend.service.impl;

import com.example.backend.config.CloudinaryService;
import com.example.backend.dto.CategoryDto;
import com.example.backend.entity.Category;
import com.example.backend.mapper.CategoryMapper;
import com.example.backend.repository.CategoryRepository;
import com.example.backend.repository.ProductRepository;
import com.example.backend.service.CategoryService;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.Normalizer;
import java.util.List;
import java.util.Objects; // ✅ 1. Import thư viện này

@Service
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;
    private final CloudinaryService cloudinaryService;
    private final ProductRepository productRepository;

    public CategoryServiceImpl(
            CategoryRepository categoryRepository,
            CloudinaryService cloudinaryService,
            ProductRepository productRepository) {
        this.categoryRepository = categoryRepository;
        this.cloudinaryService = cloudinaryService;
        this.productRepository = productRepository;
    }

    @Override
    public List<CategoryDto> getAll() {
        return categoryRepository.findAll()
                .stream()
                .map(CategoryMapper::todto)
                .toList();
    }

    @Override
    public CategoryDto getById(Integer id) {
        // ✅ 2. Chặn null trước khi gọi Repository
        Objects.requireNonNull(id, "Category ID must not be null");

        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));
        return CategoryMapper.todto(category);
    }

    @Override
    public CategoryDto create(CategoryDto dto) {
        Objects.requireNonNull(dto, "CategoryDto must not be null");

        // ✅ TỰ ĐỘNG SINH SLUG TỪ NAME
        if (dto.getSlug() == null || dto.getSlug().isBlank()) {
            String baseSlug = generateSlugFromName(dto.getName());
            dto.setSlug(generateUniqueSlug(baseSlug, null));
        } else {
            // Nếu có slug, đảm bảo unique
            dto.setSlug(generateUniqueSlug(dto.getSlug(), null));
        }

        Category category = CategoryMapper.toEntity(dto);

        // ✅ XỬ LÝ PARENT ID
        if (dto.getParentId() != null) {
            Category parent = categoryRepository
                    .findById(dto.getParentId())
                    .orElseThrow(() -> new RuntimeException("Parent category not found"));
            category.setParent(parent);
        }

        Category saved = categoryRepository.save(category);
        return CategoryMapper.todto(saved);
    }

    @Override
    public CategoryDto update(Integer id, CategoryDto dto) {
        Objects.requireNonNull(id, "Category ID must not be null");
        Objects.requireNonNull(dto, "CategoryDto must not be null");

        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        // ✅ XỬ LÝ SLUG
        if (dto.getSlug() == null || dto.getSlug().isBlank()) {
            // Nếu không có slug, sinh từ name
            String baseSlug = generateSlugFromName(dto.getName());
            dto.setSlug(generateUniqueSlug(baseSlug, id));
        } else if (!category.getSlug().equals(dto.getSlug())) {
            // Nếu slug thay đổi, đảm bảo unique
            dto.setSlug(generateUniqueSlug(dto.getSlug(), id));
        }

        // Cập nhật fields cơ bản
        category.setName(dto.getName());
        category.setSlug(dto.getSlug());
        category.setDescription(dto.getDescription());
        category.setStatus(dto.getStatus());

        // ✅ CHỈ SET ẢNH KHI CÓ ẢNH MỚI
        if (dto.getImage() != null && !dto.getImage().isBlank()) {
            // Xóa ảnh cũ nếu có và khác với ảnh mới (trường hợp user gửi lại ảnh cũ thì
            // không xóa)
            // Tuy nhiên frontend chỉ gửi field image nếu có upload mới, nên check publicId
            // cũ là đủ
            if (category.getImagePublicId() != null) {
                try {
                    cloudinaryService.deleteImage(category.getImagePublicId());
                } catch (Exception e) {
                    System.err.println("Lỗi xóa ảnh cũ khi update: " + e.getMessage());
                }
            }
            category.setImage(dto.getImage());
            category.setImagePublicId(dto.getImagePublicId());
        }

        // ✅ XỬ LÝ PARENT
        if (dto.getParentId() != null) {
            // ❌ Không được là chính nó
            if (dto.getParentId().equals(id)) {
                throw new IllegalArgumentException("Danh mục không thể là cha của chính nó");
            }

            // ❌ Không được là con/cháu của nó (tránh vòng lặp)
            if (isDescendant(id, dto.getParentId())) {
                throw new IllegalArgumentException("Không thể set danh mục con làm cha (tạo vòng lặp)");
            }

            Category parent = categoryRepository.findById(dto.getParentId())
                    .orElseThrow(() -> new RuntimeException("Parent category not found"));
            category.setParent(parent);
        } else {
            category.setParent(null);
        }

        return CategoryMapper.todto(categoryRepository.save(category));
    }

    @Override
    @Transactional
    public void delete(Integer id) {
        Objects.requireNonNull(id, "Category ID must not be null");

        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        // ✅ 1. VALIDATE: Kiểm tra có sản phẩm không
        long productCount = productRepository.countByCategoryId(id);
        if (productCount > 0) {
            throw new IllegalStateException(
                    "Không thể xóa danh mục đang có " + productCount + " sản phẩm. " +
                            "Vui lòng chuyển sản phẩm sang danh mục khác trước.");
        }

        // ✅ 2. VALIDATE: Kiểm tra có danh mục con không
        long childCount = categoryRepository.countByParentId(id);
        if (childCount > 0) {
            throw new IllegalStateException(
                    "Không thể xóa danh mục cha đang có " + childCount + " danh mục con. " +
                            "Vui lòng xóa hoặc chuyển danh mục con trước.");
        }

        // ✅ 3. XÓA ẢNH CLOUDINARY
        try {
            cloudinaryService.deleteImage(category.getImagePublicId());
        } catch (Exception e) {
            System.err.println("Không xóa được ảnh Cloudinary: " + e.getMessage());
        }

        // ✅ 4. XÓA DATABASE
        categoryRepository.delete(category);
    }

    @Override
    public List<CategoryDto> bulkCreate(List<CategoryDto> dtos) {

        List<Category> categories = dtos.stream()
                .map(dto -> {
                    Category category = CategoryMapper.toEntity(dto);

                    // xử lý parentId
                    if (dto.getParentId() != null) {
                        Category parent = categoryRepository
                                .findById(dto.getParentId())
                                .orElse(null);
                        category.setParent(parent);
                    }

                    return category;
                })
                .toList();

        return categoryRepository.saveAll(categories)
                .stream()
                .map(CategoryMapper::todto)
                .toList();
    }

    @Override
    public Page<CategoryDto> getPage(int page, int size) {
        Pageable pageable = PageRequest.of(
                page,
                size,
                Sort.by("id").descending());

        return categoryRepository.findAll(pageable)
                .map(CategoryMapper::todto);
    }

    @Override
    public void toggleStatus(Integer id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        category.setStatus(category.getStatus() == 1 ? 0 : 1);
        categoryRepository.save(category);
    }

    // ========================================
    // HELPER METHODS
    // ========================================

    /**
     * Sinh slug từ tên (xử lý tiếng Việt)
     */
    private String generateSlugFromName(String name) {
        return Normalizer.normalize(name, Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "")
                .replaceAll("đ", "d")
                .replaceAll("Đ", "d")
                .toLowerCase()
                .replaceAll("\\s+", "-")
                .replaceAll("[^a-z0-9-]", "")
                .replaceAll("-+", "-")
                .replaceAll("^-+|-+$", "");
    }

    /**
     * Tạo slug unique (tự động thêm số nếu trùng)
     */
    private String generateUniqueSlug(String baseSlug, Integer excludeId) {
        String slug = baseSlug;
        int counter = 1;

        while (true) {
            boolean exists;
            if (excludeId != null) {
                // Khi update: bỏ qua chính nó
                exists = categoryRepository.existsBySlugAndIdNot(slug, excludeId);
            } else {
                // Khi create
                exists = categoryRepository.existsBySlug(slug);
            }

            if (!exists) {
                return slug;
            }

            slug = baseSlug + "-" + counter;
            counter++;
        }
    }

    /**
     * Kiểm tra xem descendantId có phải là con/cháu của ancestorId không
     * (Tránh vòng lặp circular reference)
     */
    private boolean isDescendant(Integer ancestorId, Integer descendantId) {
        Category current = categoryRepository.findById(descendantId).orElse(null);
        while (current != null && current.getParent() != null) {
            if (current.getParent().getId().equals(ancestorId)) {
                return true;
            }
            current = current.getParent();
        }
        return false;
    }
}