package com.example.backend.service.impl;

import com.example.backend.dto.BrandDto;
import com.example.backend.entity.Brand;
import com.example.backend.mapper.BrandMapper;
import com.example.backend.repository.BrandRepository;
import com.example.backend.service.BrandService;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BrandServiceImpl implements BrandService {

    private final BrandRepository brandRepository;

    public BrandServiceImpl(BrandRepository brandRepository) {
        this.brandRepository = brandRepository;
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
        Brand saved = brandRepository.save(brand);
        return BrandMapper.toDto(saved);
    }

    @Override
    public BrandDto update(Integer id, BrandDto dto) {
        Brand brand = brandRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Brand not found"));

        brand.setName(dto.getName());
        brand.setSlug(dto.getSlug());
        brand.setImage(dto.getImage());
        brand.setDescription(dto.getDescription());
        brand.setCountry(dto.getCountry());

        Brand updated = brandRepository.save(brand);
        return BrandMapper.toDto(updated);
    }

    @Override
    public void delete(Integer id) {
        if (!brandRepository.existsById(id)) {
            throw new RuntimeException("Brand not found");
        }
        brandRepository.deleteById(id);
    }
}
