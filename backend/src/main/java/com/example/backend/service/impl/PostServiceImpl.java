package com.example.backend.service.impl;

import com.example.backend.dto.PostDto;
import com.example.backend.entity.Post;
import com.example.backend.mapper.PostMapper;
import com.example.backend.repository.PostRepository;
import com.example.backend.service.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.List;
import java.util.stream.Collectors;
import java.text.Normalizer;
import java.util.Locale;
import java.util.regex.Pattern;

@Service
public class PostServiceImpl implements PostService {

    @Autowired
    private PostRepository postRepository;

    // Sử dụng đường dẫn tuyệt đối để tránh lỗi không tìm thấy folder
    private final Path root = Paths.get("public/images/posts").toAbsolutePath().normalize();

    @Override
    public List<PostDto> getAll() {
        return postRepository.findAll().stream()
                .map(PostMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional // Đảm bảo dữ liệu toàn vẹn
    public PostDto create(PostDto dto) {
        try {
            // 1. Chuyển DTO sang Entity
            Post post = PostMapper.toEntity(dto);

            // 2. TỰ ĐỘNG TẠO SLUG (Rất quan trọng để không bị lỗi DB nếu cột slug là NOT NULL)
            if (dto.getTitle() != null) {
                post.setSlug(makeSlug(dto.getTitle()));
            }

            // 3. Xử lý lưu File ảnh
            if (dto.getThumbnail() != null && !dto.getThumbnail().isEmpty()) {
                String fileName = saveFile(dto.getThumbnail());
                post.setImage(fileName); 
            }

            // 4. Lưu vào Database
            Post savedPost = postRepository.save(post);
            return PostMapper.toDto(savedPost);
        } catch (Exception e) {
            e.printStackTrace(); // In lỗi ra console IntelliJ để debug
            throw new RuntimeException("Lỗi Backend khi tạo bài viết: " + e.getMessage());
        }
    }

    @Override
    @Transactional
    public PostDto update(Long id, PostDto dto) {
        Post existingPost = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bài viết với ID: " + id));

        existingPost.setTitle(dto.getTitle());
        existingPost.setDescription(dto.getDescription());
        existingPost.setContent(dto.getContent());
        existingPost.setTopicId(dto.getTopicId());
        existingPost.setStatus(dto.getStatus());
        existingPost.setSlug(makeSlug(dto.getTitle())); // Cập nhật lại slug nếu đổi title

        if (dto.getThumbnail() != null && !dto.getThumbnail().isEmpty()) {
            String fileName = saveFile(dto.getThumbnail());
            existingPost.setImage(fileName);
        }

        return PostMapper.toDto(postRepository.save(existingPost));
    }

    // Hàm hỗ trợ lưu file vật lý
    private String saveFile(MultipartFile file) {
        try {
            if (!Files.exists(root)) {
                Files.createDirectories(root);
            }
            // Tạo tên file duy nhất bằng timestamp để không bị trùng
            String extension = "";
            String originalFilename = file.getOriginalFilename();
            if (originalFilename != null && originalFilename.contains(".")) {
                extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }
            String fileName = System.currentTimeMillis() + extension;
            
            Files.copy(file.getInputStream(), this.root.resolve(fileName), StandardCopyOption.REPLACE_EXISTING);
            return fileName;
        } catch (IOException e) {
            throw new RuntimeException("Không thể lưu file ảnh: " + e.getMessage());
        }
    }

    // Hàm tạo Slug tiếng Việt chuẩn
    private String makeSlug(String input) {
        if (input == null) return "";
        String nowhitespace = Pattern.compile("\\s+").matcher(input).replaceAll("-");
        String normalized = Normalizer.normalize(nowhitespace, Normalizer.Form.NFD);
        String slug = Pattern.compile("[^\\w-]").matcher(normalized).replaceAll("");
        return slug.toLowerCase(Locale.ENGLISH);
    }

    @Override
    public PostDto getById(Long id) {
        return postRepository.findById(id).map(PostMapper::toDto).orElse(null);
    }

    @Override
    public List<PostDto> getByTopic(Long topicId) {
        return postRepository.findByTopicId(topicId).stream()
                .map(PostMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void delete(Long id) {
        postRepository.deleteById(id);
    }
}