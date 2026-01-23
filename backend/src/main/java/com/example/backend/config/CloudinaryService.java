package com.example.backend.config;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CloudinaryService {

    private final Cloudinary cloudinary;

    /**
     * Hàm tải ảnh lên Cloudinary.
     * 
     * @param file:   Đối tượng file từ client gửi lên.
     * @param folder: Thư mục chứa ảnh trên Cloudinary (vd: products, posts).
     * @return Map chứa URL và Public ID của ảnh để lưu vào Database.
     */
    public Map<String, String> uploadImage(
            MultipartFile file,
            String folder) throws IOException {

        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File không hợp lệ");
        }

        // Thực hiện upload bằng SDK của Cloudinary
        Map uploadResult = cloudinary.uploader().upload(
                file.getBytes(),
                ObjectUtils.asMap(
                        "folder", folder,
                        "resource_type", "image"));

        // Trích xuất thông tin cần thiết trả về cho Controller
        Map<String, String> result = new HashMap<>();
        result.put("url", uploadResult.get("secure_url").toString());
        result.put("publicId", uploadResult.get("public_id").toString());

        return result;
    }

    /**
     * Hàm xóa ảnh khỏi Cloudinary khi xóa sản phẩm/bài viết.
     * 
     * @param publicId: ID của ảnh cần xóa.
     */
    public void deleteImage(String publicId) throws IOException {
        if (publicId == null || publicId.isBlank())
            return;
        cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
    }
}
