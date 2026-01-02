package com.example.backend.controller.admin;

import com.example.backend.dto.UserDto;
import com.example.backend.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
public class AdminUserController {

    private final UserService userService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public List<UserDto> getAll() {
        return userService.getAll();
    }

    @GetMapping("/page")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<Page<UserDto>> getPage(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) List<com.example.backend.entity.enums.Role> roles) {
        if (keyword != null && !keyword.isBlank()) {
            return ResponseEntity.ok(userService.search(keyword, roles, page, size));
        }
        return ResponseEntity.ok(userService.getPage(roles, page, size));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public UserDto getById(@PathVariable Integer id) {
        return userService.getById(id);
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public UserDto create(@RequestParam String password, @Valid @RequestBody UserDto dto) {
        return userService.create(dto, password);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public UserDto update(
            @PathVariable Integer id,
            @Valid @RequestBody UserDto dto) {
        return userService.update(id, dto);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> delete(@PathVariable Integer id) {
        try {
            userService.delete(id);
            return ResponseEntity.ok().body(Map.of("message", "Xóa người dùng thành công"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Lỗi: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}/lock")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public void lock(@PathVariable Integer id) {
        userService.lock(id);
    }

    @PutMapping("/{id}/unlock")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public void unlock(@PathVariable Integer id) {
        userService.unlock(id);
    }
}
