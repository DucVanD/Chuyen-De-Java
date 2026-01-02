package com.example.backend.dto;

import com.example.backend.entity.enums.Role;
import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDto {

    private Integer id;

    private String name;
    private String email;
    private String phone;
    private String address;
    private String avatar;
    private String avatarPublicId;

    private Role role;
    private Integer status;

    // Không expose password ra ngoài
    private LocalDateTime emailVerifiedAt;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
