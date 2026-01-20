package com.example.backend.service.impl;

import com.example.backend.dto.ContactDto;
import com.example.backend.entity.Contact;
import com.example.backend.mapper.ContactMapper;
import com.example.backend.repository.ContactRepository;
import com.example.backend.service.ContactService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ContactServiceImpl implements ContactService {

    private final ContactRepository contactRepository;

    @Override
    @Transactional
    public Contact saveContact(Contact contact) {
        // Auto-generate ticket code nếu chưa có
        if (contact.getTicketCode() == null || contact.getTicketCode().isEmpty()) {
            contact.setTicketCode(generateTicketCode());
        }
        return contactRepository.save(contact);
    }

    /**
     * Generate ticket code theo format: CS-YYYYMMDD-XXXX
     * Ví dụ: CS-20260120-0001
     */
    private String generateTicketCode() {
        LocalDate today = LocalDate.now();
        String dateStr = today.format(DateTimeFormatter.ofPattern("yyyyMMdd"));

        // Đếm số contact đã tạo trong ngày hôm nay
        LocalDateTime startOfDay = today.atStartOfDay();
        LocalDateTime endOfDay = today.atTime(LocalTime.MAX);
        long countToday = contactRepository.countByCreatedAtBetween(startOfDay, endOfDay);

        // Sequence number bắt đầu từ 1
        int sequence = (int) countToday + 1;

        // Format: CS-YYYYMMDD-XXXX
        String ticketCode = String.format("CS-%s-%04d", dateStr, sequence);

        // Kiểm tra uniqueness (edge case: nếu có contact bị xóa trong ngày)
        // Retry với sequence tăng dần nếu trùng
        int maxRetries = 10;
        int retryCount = 0;
        while (contactRepository.findByTicketCode(ticketCode).isPresent() && retryCount < maxRetries) {
            sequence++;
            ticketCode = String.format("CS-%s-%04d", dateStr, sequence);
            retryCount++;
        }

        return ticketCode;
    }

    @Override
    public List<ContactDto> getAllContacts() {
        return contactRepository.findAll()
                .stream()
                .map(ContactMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public ContactDto getContactById(Integer id) {
        Contact contact = contactRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Contact not found with id: " + id));
        return ContactMapper.toDto(contact);
    }

    @Override
    @Transactional
    public ContactDto updateContact(Integer id, ContactDto contactDto) {
        Contact existing = contactRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Contact not found with id: " + id));

        ContactMapper.updateEntityFromDto(existing, contactDto);
        Contact updated = contactRepository.save(existing);
        return ContactMapper.toDto(updated);
    }

    @Override
    @Transactional
    public void deleteContact(Integer id) {
        contactRepository.deleteById(id);
    }

    @Override
    public List<ContactDto> getContactsByOrderId(Integer orderId) {
        return contactRepository.findByOrderId(orderId)
                .stream()
                .map(ContactMapper::toDto)
                .collect(Collectors.toList());
    }
}
