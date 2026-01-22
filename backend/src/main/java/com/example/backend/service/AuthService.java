package com.example.backend.service;

import com.example.backend.dto.LoginRequestDto;
import com.example.backend.dto.RegisterRequestDto;
import com.example.backend.dto.UserDto;
import java.util.Map;

/**
 * Service interface for authentication operations.
 * Handles login, registration, and password reset functionality.
 */
public interface AuthService {

    /**
     * Authenticate user and return JWT token
     * 
     * @param req Login request containing email and password
     * @return Map containing JWT token and user data
     * @throws com.example.backend.exception.BusinessException if credentials
     *                                                         invalid or user
     *                                                         locked
     */
    Map<String, Object> login(LoginRequestDto req);

    /**
     * Register new customer account
     * 
     * @param req Registration request containing user details
     * @return Created user DTO
     * @throws com.example.backend.exception.BusinessException if email/phone
     *                                                         already exists or
     *                                                         password mismatch
     */
    UserDto register(RegisterRequestDto req);

    /**
     * Send OTP to email for password reset
     * 
     * @param email User's email address
     * @throws com.example.backend.exception.BusinessException if email not found
     */
    void forgotPassword(String email);

    /**
     * Verify OTP code
     * 
     * @param email User's email address
     * @param code  OTP code to verify
     * @throws com.example.backend.exception.BusinessException if code invalid or
     *                                                         expired
     */
    void verifyCode(String email, String code);

    /**
     * Reset password with verified OTP
     * 
     * @param email       User's email address
     * @param code        Verified OTP code
     * @param newPassword New password
     * @throws com.example.backend.exception.BusinessException if code invalid or
     *                                                         password policy
     *                                                         violated
     */
    void resetPassword(String email, String code, String newPassword);
}
