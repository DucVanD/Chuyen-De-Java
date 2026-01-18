package com.example.backend.service.impl;

import com.example.backend.dto.ContactDto;
import com.example.backend.entity.Contact;
import com.example.backend.mapper.ContactMapper;
import com.example.backend.repository.ContactRepository;
import com.example.backend.service.ContactService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ContactServiceImpl implements ContactService {

    private final ContactRepository contactRepository;

    @Override
    @Transactional
    public Contact saveContact(Contact contact) {
        return contactRepository.save(contact);
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
