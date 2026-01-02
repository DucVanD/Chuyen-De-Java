package com.example.backend.service.impl;

import com.example.backend.dto.UserDto;
import com.example.backend.entity.User;
import com.example.backend.mapper.UserMapper;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.UserService;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final com.example.backend.config.CloudinaryService cloudinaryService;

    public UserServiceImpl(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            com.example.backend.config.CloudinaryService cloudinaryService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.cloudinaryService = cloudinaryService;
    }

    @Override
    public List<UserDto> getAll() {
        return userRepository.findAll()
                .stream()
                .map(UserMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public org.springframework.data.domain.Page<UserDto> getPage(
            java.util.List<com.example.backend.entity.enums.Role> roles, int page, int size) {
        org.springframework.data.domain.Pageable pageable = org.springframework.data.domain.PageRequest.of(page, size,
                org.springframework.data.domain.Sort.by("id").descending());

        if (roles == null || roles.isEmpty()) {
            return userRepository.findAll(pageable).map(UserMapper::toDto);
        }
        return userRepository.findByRoles(roles, pageable).map(UserMapper::toDto);
    }

    @Override
    public org.springframework.data.domain.Page<UserDto> search(String keyword,
            java.util.List<com.example.backend.entity.enums.Role> roles, int page, int size) {
        org.springframework.data.domain.Pageable pageable = org.springframework.data.domain.PageRequest.of(page, size,
                org.springframework.data.domain.Sort.by("id").descending());

        if (roles == null || roles.isEmpty()) {
            // Re-implementing a basic search without roles if roles list is empty
            // Though in this system we usually have roles.
            return userRepository.search(keyword, List.of(com.example.backend.entity.enums.Role.values()), pageable)
                    .map(UserMapper::toDto);
        }
        return userRepository.search(keyword, roles, pageable)
                .map(UserMapper::toDto);
    }

    @Override
    public UserDto getById(Integer id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return UserMapper.toDto(user);
    }

    @Override
    public UserDto getByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return UserMapper.toDto(user);
    }

    @Override
    public UserDto create(UserDto dto, String rawPassword) {

        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        if (userRepository.existsByPhone(dto.getPhone())) {
            throw new RuntimeException("Phone already exists");
        }

        String encodedPassword = passwordEncoder.encode(rawPassword);

        User user = UserMapper.toEntity(dto, encodedPassword);
        User saved = userRepository.save(user);

        return UserMapper.toDto(saved);
    }

    @Override
    @org.springframework.transaction.annotation.Transactional
    public UserDto update(Integer id, UserDto dto) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setName(dto.getName());
        user.setPhone(dto.getPhone());
        user.setAddress(dto.getAddress());

        // Handle Avatar update and Cloudinary cleanup
        if (dto.getAvatar() != null && !dto.getAvatar().isBlank()) {
            if (user.getAvatarPublicId() != null && !user.getAvatarPublicId().equals(dto.getAvatarPublicId())) {
                try {
                    cloudinaryService.deleteImage(user.getAvatarPublicId());
                } catch (Exception e) {
                    System.err.println("Lỗi xóa ảnh cũ khi update user: " + e.getMessage());
                }
            }
            user.setAvatar(dto.getAvatar());
            user.setAvatarPublicId(dto.getAvatarPublicId());
        }

        if (dto.getRole() != null) {
            user.setRole(dto.getRole());
        }
        if (dto.getStatus() != null) {
            user.setStatus(dto.getStatus());
        }

        User updated = userRepository.save(user);
        return UserMapper.toDto(updated);
    }

    @Override
    @org.springframework.transaction.annotation.Transactional
    public void delete(Integer id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getAvatarPublicId() != null) {
            try {
                cloudinaryService.deleteImage(user.getAvatarPublicId());
            } catch (Exception e) {
                System.err.println("Không xóa được ảnh Cloudinary khi xóa user: " + e.getMessage());
            }
        }

        userRepository.delete(user);
    }

    @Override
    public void lock(Integer id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setStatus(0);
        userRepository.save(user);
    }

    @Override
    public void unlock(Integer id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setStatus(1);
        userRepository.save(user);
    }
}
