package com.example.backend.exception;

/**
 * Custom exception for business logic errors.
 * Used to provide clear, user-friendly error messages to the frontend.
 */
public class BusinessException extends RuntimeException {

    public BusinessException(String message) {
        super(message);
    }

    public BusinessException(String message, Throwable cause) {
        super(message, cause);
    }
}
