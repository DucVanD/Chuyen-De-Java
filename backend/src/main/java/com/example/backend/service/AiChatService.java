package com.example.backend.service;

import java.util.List;

import com.example.backend.dto.ChatMessageDto;
import com.example.backend.dto.ChatResponse;

public interface AiChatService {
    /**
     * Send a message to AI and get response
     * 
     * @param message User's message
     * @param history Conversation history
     * @return AI's response with optional product recommendations
     * @throws Exception if API call fails
     */
    ChatResponse chat(String message, List<ChatMessageDto> history) throws Exception;
}
