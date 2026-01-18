package com.example.backend.controller.admin;

import com.example.backend.dto.ContactDto;
import com.example.backend.service.ContactService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contacts")
@RequiredArgsConstructor
public class AdminContactController {

    private final ContactService contactService;

    // 📋 Get all contacts
    @GetMapping
    public ResponseEntity<List<ContactDto>> getAll() {
        return ResponseEntity.ok(contactService.getAllContacts());
    }

    // 🔍 Get contact by ID
    @GetMapping("/{id}")
    public ResponseEntity<ContactDto> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(contactService.getContactById(id));
    }

    // ✏️ Update contact (Admin reply)
    @PutMapping("/{id}")
    public ResponseEntity<ContactDto> update(
            @PathVariable Integer id,
            @RequestBody ContactDto contactDto) {
        return ResponseEntity.ok(contactService.updateContact(id, contactDto));
    }

    // 🗑️ Delete contact
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        contactService.deleteContact(id);
        return ResponseEntity.noContent().build();
    }
}
