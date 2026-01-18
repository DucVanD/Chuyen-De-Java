package com.example.backend.mapper;

import com.example.backend.dto.ContactDto;
import com.example.backend.entity.Contact;

public class ContactMapper {

    // Entity → DTO
    public static ContactDto toDto(Contact contact) {
        if (contact == null)
            return null;

        return ContactDto.builder()
                .id(contact.getId())
                .userId(contact.getUser() != null ? contact.getUser().getId() : null)
                .orderId(contact.getOrderId())
                .type(contact.getType())
                .priority(contact.getPriority())
                .name(contact.getName())
                .email(contact.getEmail())
                .phone(contact.getPhone())
                .title(contact.getTitle())
                .content(contact.getContent())
                .replyContent(contact.getReplyContent())
                .status(contact.getStatus())
                .updatedBy(contact.getUpdatedBy())
                .createdAt(contact.getCreatedAt())
                .updatedAt(contact.getUpdatedAt())
                .build();
    }

    // DTO → Entity (for UPDATE - partial mapping)
    public static void updateEntityFromDto(Contact entity, ContactDto dto) {
        if (dto.getReplyContent() != null) {
            entity.setReplyContent(dto.getReplyContent());
        }
        if (dto.getStatus() != null) {
            entity.setStatus(dto.getStatus());
        }
    }
}
