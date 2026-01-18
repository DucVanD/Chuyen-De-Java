package com.example.backend.dto;

import com.example.backend.entity.enums.ContactStatus;
import com.example.backend.entity.enums.ContactType;
import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ContactDto {

    private Integer id;

    private Integer userId;
    private Integer orderId;

    private ContactType type;
    private String priority;

    private String name;
    private String email;
    private String phone;

    private String title;
    private String content;
    private String replyContent;

    private ContactStatus status;

    // Auditing
    private Integer updatedBy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
