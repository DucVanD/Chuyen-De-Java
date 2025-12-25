package com.example.backend.service.impl;

import com.example.backend.dto.CategoryDto;
import com.example.backend.entity.Category;
import com.example.backend.mapper.CategoryMapper;
import com.example.backend.repository.CategoryRepository;
import com.example.backend.service.CategoryService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects; // ✅ 1. Import thư viện này

@Service
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryServiceImpl(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
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

        // ✅ Bọc Objects.requireNonNull để đảm bảo kết quả từ Mapper không null trước
        // khi lưu
        Category category = Objects.requireNonNull(CategoryMapper.toEntity(dto), "Mapped Entity must not be null");

        return CategoryMapper.todto(categoryRepository.save(category));
    }

    @Override
    public CategoryDto update(Integer id, CategoryDto dto) {

        Objects.requireNonNull(id, "Category ID must not be null");
        Objects.requireNonNull(dto, "CategoryDto must not be null");

        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        // cập nhật field cơ bản
        category.setName(dto.getName());
        category.setSlug(dto.getSlug());
        category.setImage(dto.getImage());
        category.setDescription(dto.getDescription());
        category.setStatus(dto.getStatus());

        // ✅ XỬ LÝ CHA (DÒNG QUAN TRỌNG NHẤT)
        if (dto.getParentId() != null) {

            // ❌ chặn parent = chính nó
            if (dto.getParentId().equals(id)) {
                throw new RuntimeException("Category cannot be parent of itself");
            }

            Category parent = categoryRepository.findById(dto.getParentId())
                    .orElseThrow(() -> new RuntimeException("Parent category not found"));

            category.setParent(parent);
        } else {
            category.setParent(null); // danh mục cha
        }

        return CategoryMapper.todto(categoryRepository.save(category));
    }

    @Override
    public void delete(Integer id) {
        Objects.requireNonNull(id, "Category ID must not be null");
        categoryRepository.deleteById(id);
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

}