package com.example.backend.repository;

import com.example.backend.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post, Integer> {
        List<Post> findTop6ByStatusOrderByCreatedAtDesc(Integer status);

        org.springframework.data.domain.Page<Post> findByPostTypeAndStatus(
                        com.example.backend.entity.enums.PostType postType, Integer status,
                        org.springframework.data.domain.Pageable pageable);

        org.springframework.data.domain.Page<Post> findByPostTypeAndTopicIdAndStatus(
                        com.example.backend.entity.enums.PostType postType, Integer topicId, Integer status,
                        org.springframework.data.domain.Pageable pageable);

        org.springframework.data.domain.Page<Post> findByPostType(com.example.backend.entity.enums.PostType postType,
                        org.springframework.data.domain.Pageable pageable);

        java.util.Optional<Post> findBySlug(String slug);

        boolean existsBySlug(String slug);

        boolean existsBySlugAndIdNot(String slug, Integer id);
}
