package com.example.backend.service.impl;

import com.example.backend.dto.CustomerDto;
import com.example.backend.dto.UserDto;
import com.example.backend.entity.Order;
import com.example.backend.entity.User;
import com.example.backend.entity.enums.OrderStatus;
import com.example.backend.exception.BusinessException;
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
    private final com.example.backend.repository.OrderRepository orderRepository;

    public UserServiceImpl(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            com.example.backend.config.CloudinaryService cloudinaryService,
            com.example.backend.repository.OrderRepository orderRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.cloudinaryService = cloudinaryService;
        this.orderRepository = orderRepository;
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
                .orElseThrow(() -> new BusinessException("Người dùng không tồn tại"));
        return UserMapper.toDto(user);
    }

    @Override
    public UserDto getByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BusinessException("Người dùng không tồn tại"));
        return UserMapper.toDto(user);
    }

    @Override
    public UserDto create(UserDto dto, String rawPassword) {

        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new BusinessException("Email đã tồn tại");
        }

        if (userRepository.existsByPhone(dto.getPhone())) {
            throw new BusinessException("Số điện thoại đã tồn tại");
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
                .orElseThrow(() -> new BusinessException("Người dùng không tồn tại"));

        user.setName(dto.getName());

        // Check phone uniqueness if changed
        if (dto.getPhone() != null && !dto.getPhone().equals(user.getPhone())) {
            if (userRepository.existsByPhone(dto.getPhone())) {
                throw new BusinessException("Số điện thoại đã tồn tại");
            }
            user.setPhone(dto.getPhone());
        }

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
                .orElseThrow(() -> new BusinessException("Người dùng không tồn tại"));

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
                .orElseThrow(() -> new BusinessException("Người dùng không tồn tại"));

        user.setStatus(0);
        userRepository.save(user);
    }

    @Override
    public void unlock(Integer id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Người dùng không tồn tại"));

        user.setStatus(1);
        userRepository.save(user);
    }

    @Override
    public List<CustomerDto> getCustomers() {
        List<User> usersWithOrders = userRepository.findUsersWithOrders();

        return usersWithOrders.stream()
                .map(user -> {
                    // Fetch orders for this user
                    List<Order> userOrders = orderRepository.findByUserId(user.getId());

                    List<Order> completedOrders = userOrders.stream()
                            .filter(order -> order.getStatus() == OrderStatus.COMPLETED)
                            .collect(Collectors.toList());

                    long totalOrders = (long) userOrders.size();
                    java.math.BigDecimal totalSpent = completedOrders.stream()
                            .map(Order::getTotalAmount)
                            .reduce(java.math.BigDecimal.ZERO, java.math.BigDecimal::add);

                    java.time.LocalDateTime lastOrderDate = userOrders.stream()
                            .map(Order::getCreatedAt)
                            .max(java.time.LocalDateTime::compareTo)
                            .orElse(null);

                    java.math.BigDecimal averageOrderValue = totalOrders > 0
                            ? totalSpent.divide(java.math.BigDecimal.valueOf(totalOrders), 2,
                                    java.math.RoundingMode.HALF_UP)
                            : java.math.BigDecimal.ZERO;

                    return CustomerDto.builder()
                            .id(user.getId())
                            .name(user.getName())
                            .email(user.getEmail())
                            .phone(user.getPhone())
                            .address(user.getAddress())
                            .avatar(user.getAvatar())
                            .totalOrders(totalOrders)
                            .totalSpent(totalSpent)
                            .lastOrderDate(lastOrderDate)
                            .averageOrderValue(averageOrderValue)
                            .createdAt(user.getCreatedAt())
                            .status(user.getStatus() == 1 ? "Active" : "Locked")
                            .build();
                })
                .collect(Collectors.toList());
    }
}
