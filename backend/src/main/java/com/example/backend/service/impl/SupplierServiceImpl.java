package com.example.backend.service.impl;

import com.example.backend.dto.SupplierDto;
import com.example.backend.entity.Supplier;
import com.example.backend.mapper.SupplierMapper;
import com.example.backend.repository.SupplierRepository;
import com.example.backend.service.SupplierService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SupplierServiceImpl implements SupplierService {

    private final SupplierRepository supplierRepository;

    public SupplierServiceImpl(SupplierRepository supplierRepository) {
        this.supplierRepository = supplierRepository;
    }

    @Override
    public SupplierDto create(SupplierDto supplierDto) {
        Supplier supplier = SupplierMapper.toEntity(supplierDto);

        supplier.setSupplierCode(generateSupplierCode());
        supplier.setStatus(1); // ACTIVE

        Supplier saved = supplierRepository.save(supplier);
        return SupplierMapper.toDto(saved);
    }

    @Override
    public SupplierDto getById(Integer id) {
        Supplier supplier = supplierRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Supplier not found"));
        return SupplierMapper.toDto(supplier);
    }

    @Override
    public List<SupplierDto> getAll() {
        return supplierRepository.findAll()
                .stream()
                .map(SupplierMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public SupplierDto update(Integer id, SupplierDto supplierDto) {
        Supplier supplier = supplierRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Supplier not found"));

        supplier.setName(supplierDto.getName());
        supplier.setEmail(supplierDto.getEmail());
        supplier.setPhone(supplierDto.getPhone());
        supplier.setAddress(supplierDto.getAddress());
        supplier.setStatus(supplierDto.getStatus());

        Supplier updated = supplierRepository.save(supplier);
        return SupplierMapper.toDto(updated);
    }

    @Override
    public void delete(Integer id) {
        if (!supplierRepository.existsById(id)) {
            throw new RuntimeException("Supplier not found");
        }
        supplierRepository.deleteById(id);
    }

    private String generateSupplierCode() {
        long count = supplierRepository.count() + 1;
        return String.format("SUP-%04d", count);
    }

}
