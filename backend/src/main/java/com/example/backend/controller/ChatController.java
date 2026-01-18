package com.example.backend.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.dto.ChatMessageDto;
import com.example.backend.dto.ChatResponse;
import com.example.backend.service.AiChatService;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    @Autowired
    private AiChatService aiChatService;

    @PostMapping
    public ResponseEntity<?> chat(@RequestBody Map<String, Object> request) {
        try {
            String message = (String) request.get("message");
            @SuppressWarnings("unchecked")
            List<Map<String, String>> historyRaw = (List<Map<String, String>>) request.get("history");

            // Convert history to DTO
            List<ChatMessageDto> history = null;
            if (historyRaw != null) {
                history = historyRaw.stream()
                        .map(h -> new ChatMessageDto(h.get("role"), h.get("content")))
                        .toList();
            }

            ChatResponse response = aiChatService.chat(message, history);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(
                    Map.of("message", "Xin lỗi, đã có lỗi xảy ra: " + e.getMessage()));
        }
    }
}
