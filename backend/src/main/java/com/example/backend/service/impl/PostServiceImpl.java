package com.example.backend.service.impl;

import com.example.backend.dto.PostDto;
import com.example.backend.entity.Post;
import com.example.backend.mapper.PostMapper;
import com.example.backend.repository.PostRepository;
import com.example.backend.repository.TopicRepository;
import com.example.backend.service.PostService;
import com.example.backend.config.CloudinaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostServiceImpl implements PostService {

    private final PostRepository postRepository;
    private final TopicRepository topicRepository;
    private final CloudinaryService cloudinaryService;

    @Override
    public List<PostDto> getNewest() {
        return postRepository.findTop6ByStatusOrderByCreatedAtDesc(1).stream()
                .map(PostMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<PostDto> getAll() {
        return postRepository.findAll().stream()
                .map(PostMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public Page<PostDto> getPage(int page, int size) {
        return postRepository.findAll(PageRequest.of(page, size))
                .map(PostMapper::toDto);
    }

    @Override
    public Page<PostDto> getPageByFilter(com.example.backend.entity.enums.PostType type, Integer topicId,
            Integer status, int page, int size) {
        PageRequest pageable = PageRequest.of(page, size,
                org.springframework.data.domain.Sort.by("createdAt").descending());
        if (topicId != null) {
            return postRepository.findByPostTypeAndTopicIdAndStatus(type, topicId, status, pageable)
                    .map(PostMapper::toDto);
        }
        return postRepository.findByPostTypeAndStatus(type, status, pageable)
                .map(PostMapper::toDto);
    }

    @Override
    public Page<PostDto> getAdminPage(com.example.backend.entity.enums.PostType type, int page, int size) {
        PageRequest pageable = PageRequest.of(page, size, org.springframework.data.domain.Sort.by("id").descending());
        return postRepository.findByPostType(type, pageable)
                .map(PostMapper::toDto);
    }

    @Override
    public PostDto getById(Integer id) {
        if (id == null)
            return null;
        return postRepository.findById(id)
                .map(PostMapper::toDto)
                .orElse(null);
    }

    @Override
    public PostDto getBySlug(String slug) {
        return postRepository.findBySlug(slug)
                .map(PostMapper::toDto)
                .orElse(null);
    }

    @Override
    public PostDto create(PostDto dto) {
        if (dto == null)
            return null;

        Post post = PostMapper.toEntity(dto);

        if (dto.getSlug() == null || dto.getSlug().isBlank()) {
            post.setSlug(generateUniqueSlug(generateSlugFromName(dto.getTitle()), null));
        } else {
            post.setSlug(generateUniqueSlug(dto.getSlug(), null));
        }

        post.setImage(dto.getImage());
        post.setImagePublicId(dto.getImagePublicId());

        if (dto.getTopicId() != null) {
            topicRepository.findById(dto.getTopicId()).ifPresent(post::setTopic);
        }
        Post saved = java.util.Objects.requireNonNull(postRepository.save(post));
        return PostMapper.toDto(saved);
    }

    @Override
    public PostDto update(Integer id, PostDto dto) {
        if (id == null || dto == null)
            return null;
        return postRepository.findById(id).map(existing -> {
            existing.setTitle(dto.getTitle());

            if (dto.getSlug() == null || dto.getSlug().isBlank()) {
                String baseSlug = generateSlugFromName(dto.getTitle());
                existing.setSlug(generateUniqueSlug(baseSlug, id));
            } else if (!dto.getSlug().equals(existing.getSlug())) {
                existing.setSlug(generateUniqueSlug(dto.getSlug(), id));
            }

            // ✅ CHỈ SET ẢNH KHI CÓ ẢNH MỚI
            if (dto.getImage() != null && !dto.getImage().isBlank()) {
                // Chỉ xóa ảnh cũ nếu ID ảnh mới khác ID ảnh cũ
                if (existing.getImagePublicId() != null
                        && !existing.getImagePublicId().equals(dto.getImagePublicId())) {
                    try {
                        cloudinaryService.deleteImage(existing.getImagePublicId());
                    } catch (Exception e) {
                        System.err.println("Lỗi xóa ảnh cũ khi update post: " + e.getMessage());
                    }
                }
                existing.setImage(dto.getImage());
                existing.setImagePublicId(dto.getImagePublicId());
            }
            existing.setDescription(dto.getDescription());
            existing.setContent(dto.getContent());
            existing.setPostType(dto.getPostType());
            existing.setStatus(dto.getStatus());
            if (dto.getTopicId() != null) {
                topicRepository.findById(dto.getTopicId()).ifPresent(existing::setTopic);
            }
            Post saved = java.util.Objects.requireNonNull(postRepository.save(existing));
            return PostMapper.toDto(saved);
        }).orElse(null);
    }

    private String generateSlugFromName(String name) {
        if (name == null || name.isBlank()) {
            return "post";
        }
        return java.text.Normalizer.normalize(name, java.text.Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "")
                .replaceAll("đ", "d")
                .replaceAll("Đ", "d")
                .toLowerCase()
                .replaceAll("\\s+", "-")
                .replaceAll("[^a-z0-9-]", "")
                .replaceAll("-+", "-")
                .replaceAll("^-+|-+$", "");
    }

    private String generateUniqueSlug(String baseSlug, Integer excludeId) {
        String slug = baseSlug;
        int counter = 1;

        while (true) {
            boolean exists = (excludeId != null)
                    ? postRepository.existsBySlugAndIdNot(slug, excludeId)
                    : postRepository.existsBySlug(slug);

            if (!exists) {
                return slug;
            }

            slug = baseSlug + "-" + counter;
            counter++;
        }
    }

    @Override
    @org.springframework.transaction.annotation.Transactional
    public void delete(Integer id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        // 1️⃣ XÓA ẢNH CLOUDINARY
        if (post.getImagePublicId() != null) {
            try {
                cloudinaryService.deleteImage(post.getImagePublicId());
            } catch (Exception e) {
                System.err.println("Không xóa được ảnh Cloudinary: " + e.getMessage());
            }
        }

        // 2️⃣ XÓA DB
        postRepository.deleteById(id);
    }

    @Override
    public void toggleStatus(Integer id) {
        if (id == null)
            return;
        postRepository.findById(id).ifPresent(post -> {
            Integer status = post.getStatus();
            if (status != null) {
                post.setStatus(status == 1 ? 0 : 1);
                postRepository.save(post);
            }
        });
    }
}
