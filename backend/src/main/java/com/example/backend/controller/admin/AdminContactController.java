package com.example.backend.controller.admin;

import com.example.backend.dto.ContactDto;
import com.example.backend.entity.Contact;
import com.example.backend.mapper.ContactMapper;
import com.example.backend.service.ContactService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contacts")
@RequiredArgsConstructor

public class AdminContactController {

    private final ContactService contactService;

    // 📋 Get all contacts
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    @GetMapping
    public ResponseEntity<List<ContactDto>> getAll() {
        return ResponseEntity.ok(contactService.getAllContacts());
    }

    // ➕ Create new contact (User submit form)
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    @PostMapping
    public ResponseEntity<ContactDto> create(@RequestBody Contact contact) {
        Contact saved = contactService.saveContact(contact);
        return ResponseEntity.ok(ContactMapper.toDto(saved));
    }

    // 🔍 Get contact by ID
    @GetMapping("/{id}")
    public ResponseEntity<ContactDto> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(contactService.getContactById(id));
    }

    // ✏️ Update contact (Admin reply)
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    @PutMapping("/{id}")
    public ResponseEntity<ContactDto> update(
            @PathVariable Integer id,
            @RequestBody ContactDto contactDto) {
        return ResponseEntity.ok(contactService.updateContact(id, contactDto));
    }

    // 🗑️ Delete contact
    @PreAuthorize("hasAnyRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        contactService.deleteContact(id);
        return ResponseEntity.noContent().build();
    }
}
