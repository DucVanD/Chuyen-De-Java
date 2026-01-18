package com.example.backend.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatResponse {
    private String message;
    private List<ProductDto> products;

    // Constructor for message-only responses
    public ChatResponse(String message) {
        this.message = message;
        this.products = null;
    }
}
