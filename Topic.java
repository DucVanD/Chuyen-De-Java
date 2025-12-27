package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "topics")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Topic {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id; // Giữ nguyên Integer theo ý bạn

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, unique = true, length = 100)
    private String slug;

    private String image; // Thêm trường này để hết lỗi Mapper

    @Column(length = 500)
    private String description;

    @Builder.Default
    private Integer status = 1;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;
}