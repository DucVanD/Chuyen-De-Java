package com.example.backend.entity;

import com.example.backend.entity.enums.PostType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "posts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // Sửa Integer thành Long để khớp với Repository và DTO

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "topic_id", insertable = false, updatable = false)
    private Topic topic;

    @Column(name = "topic_id")
    private Long topicId; // Thêm trường này để xử lý lưu ID đơn giản hơn trong Service

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, unique = true)
    private String slug;

    private String image;

    @Column(length = 500)
    private String description;

    @Column(nullable = false, columnDefinition = "LONGTEXT")
    private String content;

    @Enumerated(EnumType.STRING)
    @Column(name = "post_type", nullable = false)
    private PostType postType;

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