package com.example.backend.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.example.backend.dto.LoginRequestDto;
import com.example.backend.dto.RegisterRequestDto;
import com.example.backend.dto.UserDto;
import com.example.backend.entity.User;
import com.example.backend.entity.enums.Role;
import com.example.backend.mapper.UserMapper;
import com.example.backend.repository.UserRepository;
import com.example.backend.security.JwtService;
import com.example.backend.service.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final UserService userService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDto req) {

        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        req.getEmail(),
                        req.getPassword()));

        User user = userRepository.findByEmail(req.getEmail())
                .orElseThrow();

        String token = jwtService.generateToken(user);

        return ResponseEntity.ok(
                Map.of(
                        "token", token,
                        "user", UserMapper.toDto(user)));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequestDto req) {

        if (!req.getPassword().equals(req.getConfirmPassword())) {
            return ResponseEntity.badRequest().body(
                    Map.of("message", "Password confirmation does not match"));
        }

        UserDto dto = UserDto.builder()
                .name(req.getName())
                .email(req.getEmail())
                .phone(req.getPhone())
                .role(Role.CUSTOMER) // ⚠️ QUAN TRỌNG
                .status(1)
                .build();

        UserDto created = userService.create(dto, req.getPassword());
        return ResponseEntity.ok(
                Map.of(
                        "status", true,
                        "user", created));
    }

}
