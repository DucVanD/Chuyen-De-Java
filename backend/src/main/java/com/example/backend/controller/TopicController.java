package com.example.backend.controller;

import com.example.backend.dto.TopicDto;
import com.example.backend.service.TopicService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/topics")
/** * Đảm bảo CORS cho phép React truy cập. 
 * Nếu vẫn lỗi, bạn có thể tạm thời để origins = "*" để test.
 */
@CrossOrigin(origins = "http://localhost:5173", allowedHeaders = "*", methods = {
    RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE
})
public class TopicController {

    private final TopicService topicService;

    public TopicController(TopicService topicService) {
        this.topicService = topicService;
    }

    // 1. Lấy danh sách tất cả chủ đề
    @GetMapping
    public ResponseEntity<List<TopicDto>> getAll() {
        return ResponseEntity.ok(topicService.getAll());
    }

    // 2. Lấy chi tiết một chủ đề (Dùng cho nút "Con mắt" và trang "Edit")
    @GetMapping("/{id}")
    public ResponseEntity<TopicDto> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(topicService.getById(id));
    }

    // 3. Chức năng Bật/Tắt trạng thái (Sửa lỗi 404 bạn gặp trong ảnh)
    @GetMapping("/{id}/toggle")
    public ResponseEntity<Void> toggleStatus(@PathVariable Integer id) {
        topicService.toggleStatus(id); // Bạn cần thêm method này vào TopicService
        return ResponseEntity.ok().build();
    }

    // 4. Thêm mới chủ đề
    @PostMapping
    public ResponseEntity<TopicDto> create(@RequestBody TopicDto topicDto) {
        // Đảm bảo topicDto gửi lên không bị null các trường bắt buộc
        return new ResponseEntity<>(topicService.create(topicDto), HttpStatus.CREATED);
    }

    // 5. Cập nhật chủ đề
    @PutMapping("/{id}")
    public ResponseEntity<TopicDto> update(
            @PathVariable Integer id, 
            @RequestBody TopicDto topicDto
    ) {
        return ResponseEntity.ok(topicService.update(id, topicDto));
    }

    // 6. Xóa chủ đề (Xóa vĩnh viễn hoặc xóa mềm tùy logic Service của bạn)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        topicService.delete(id);
        return ResponseEntity.noContent().build();
    }
}