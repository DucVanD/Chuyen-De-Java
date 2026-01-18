package com.example.backend.controller.user;

import com.example.backend.dto.UserDto;
import com.example.backend.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    @org.springframework.security.access.prepost.PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<List<UserDto>> getAll() {
        return ResponseEntity.ok(userService.getAll());
    }

    @GetMapping("/{id}")
    @org.springframework.security.access.prepost.PreAuthorize("hasAnyRole('ADMIN', 'STAFF') or #id == principal.id")
    public ResponseEntity<UserDto> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(userService.getById(id));
    }

    @PostMapping
    @org.springframework.security.access.prepost.PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<UserDto> create(
            @RequestBody UserDto dto,
            @RequestParam String password) {
        return ResponseEntity.ok(userService.create(dto, password));
    }

    @PutMapping("/{id}")
    @org.springframework.security.access.prepost.PreAuthorize("hasAnyRole('ADMIN', 'STAFF') or #id == principal.id")
    public ResponseEntity<UserDto> update(
            @PathVariable Integer id,
            @RequestBody UserDto dto) {
        return ResponseEntity.ok(userService.update(id, dto));
    }

    @PutMapping("/{id}/lock")
    @org.springframework.security.access.prepost.PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<Void> lock(@PathVariable Integer id) {
        userService.lock(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/unlock")
    @org.springframework.security.access.prepost.PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<Void> unlock(@PathVariable Integer id) {
        userService.unlock(id);
        return ResponseEntity.noContent().build();
    }
}
