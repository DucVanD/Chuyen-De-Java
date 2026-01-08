package com.example.backend.repository;

import com.example.backend.entity.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {

    // Tìm bài viết theo Topic ID thông thường
    List<Post> findByTopicId(Long topicId);

    // Tìm bài viết theo Topic ID và có hỗ trợ phân trang (Rất quan trọng cho danh sách dài)
    Page<Post> findByTopicId(Long topicId, Pageable pageable);

    // Tìm các bài viết đang ở trạng thái hiển thị (status = 1)
    List<Post> findByStatus(Integer status);

    // Tìm kiếm bài viết theo tiêu đề (Search chức năng)
    List<Post> findByTitleContainingIgnoreCase(String title);
}