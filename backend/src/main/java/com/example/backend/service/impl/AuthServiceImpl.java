package com.example.backend.service.impl;

import com.example.backend.dto.LoginRequestDto;
import com.example.backend.dto.RegisterRequestDto;
import com.example.backend.dto.UserDto;
import com.example.backend.entity.PasswordResetToken;
import com.example.backend.entity.User;
import com.example.backend.entity.enums.Role;
import com.example.backend.exception.BusinessException;
import com.example.backend.mapper.UserMapper;
import com.example.backend.repository.PasswordResetTokenRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.security.JwtService;
import com.example.backend.service.AuthService;
import com.example.backend.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Random;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final EmailService emailService;
    private final PasswordResetTokenRepository tokenRepository;
    private final PasswordEncoder passwordEncoder;

    // Password policy regex (same as RegisterRequestDto)
    private static final Pattern PASSWORD_PATTERN = Pattern.compile("^(?=.*[A-Z])(?=.*[a-z]).{6,}$");

    @Override
    public Map<String, Object> login(LoginRequestDto req) {

        // Check if user exists
        User user = userRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new BusinessException("Email hoặc mật khẩu không đúng"));

        // Check if user is locked
        if (user.getStatus() == 0) {
            throw new BusinessException("Tài khoản đã bị khóa");
        }

        // Authenticate
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            req.getEmail(),
                            req.getPassword()));
        } catch (org.springframework.security.authentication.BadCredentialsException e) {
            throw new BusinessException("Email hoặc mật khẩu không đúng");
        }

        // Generate tokens
        String accessToken = jwtService.generateAccessToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);

        return Map.of(
                "accessToken", accessToken,
                "refreshToken", refreshToken,
                "user", UserMapper.toDto(user));
    }

    @Override
    public Map<String, Object> refresh(String refreshToken) {
        if (!jwtService.isTokenValid(refreshToken)) {
            throw new BusinessException("Refresh token không hợp lệ hoặc đã hết hạn");
        }

        String email = jwtService.extractEmail(refreshToken);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BusinessException("Người dùng không tồn tại"));

        if (user.getStatus() == 0) {
            throw new BusinessException("Tài khoản đã bị khóa");
        }

        String newAccessToken = jwtService.generateAccessToken(user);
        String newRefreshToken = jwtService.generateRefreshToken(user);

        return Map.of(
                "accessToken", newAccessToken,
                "refreshToken", newRefreshToken,
                "user", UserMapper.toDto(user));
    }

    @Override
    public UserDto register(RegisterRequestDto req) {

        // Validate password confirmation
        if (!req.getPassword().equals(req.getConfirmPassword())) {
            throw new BusinessException("Mật khẩu xác nhận không khớp");
        }

        // Check email exists
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new BusinessException("Email đã tồn tại");
        }

        // Check phone exists
        if (userRepository.existsByPhone(req.getPhone())) {
            throw new BusinessException("Số điện thoại đã tồn tại");
        }

        // Create user
        User user = User.builder()
                .name(req.getName())
                .email(req.getEmail())
                .phone(req.getPhone())
                .password(passwordEncoder.encode(req.getPassword()))
                .role(Role.CUSTOMER)
                .status(1)
                .build();

        User saved = userRepository.save(user);
        return UserMapper.toDto(saved);
    }

    @Override
    @Transactional
    public void forgotPassword(String email) {

        // Check user exists
        userRepository.findByEmail(email)
                .orElseThrow(() -> new BusinessException("Email không tồn tại trong hệ thống"));

        // Generate OTP
        String otp = String.format("%06d", new Random().nextInt(1000000));

        // Delete old tokens
        tokenRepository.deleteByEmail(email);

        // Save new token
        PasswordResetToken token = PasswordResetToken.builder()
                .email(email)
                .token(otp)
                .expiryDate(LocalDateTime.now().plusMinutes(5))
                .build();
        tokenRepository.save(token);

        // Send email
        emailService.sendOtpEmail(email, otp);
    }

    @Override
    public void verifyCode(String email, String code) {

        PasswordResetToken token = tokenRepository.findByEmailAndToken(email, code)
                .orElseThrow(() -> new BusinessException("Mã xác thực không đúng"));

        if (token.isExpired()) {
            throw new BusinessException("Mã xác thực đã hết hạn");
        }
    }

    @Override
    @Transactional
    public void resetPassword(String email, String code, String newPassword) {

        // Verify code first
        PasswordResetToken token = tokenRepository.findByEmailAndToken(email, code)
                .orElseThrow(() -> new BusinessException("Mã xác thực không đúng"));

        if (token.isExpired()) {
            throw new BusinessException("Mã xác thực đã hết hạn");
        }

        // Validate password policy
        if (!PASSWORD_PATTERN.matcher(newPassword).matches()) {
            throw new BusinessException("Mật khẩu phải ≥ 6 ký tự, có chữ hoa và chữ thường");
        }

        // Update password
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BusinessException("Người dùng không tồn tại"));

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        // Delete used token
        tokenRepository.deleteByEmail(email);
    }
}
