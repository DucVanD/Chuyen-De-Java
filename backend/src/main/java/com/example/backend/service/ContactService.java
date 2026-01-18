package com.example.backend.service;

import com.example.backend.dto.ContactDto;
import com.example.backend.entity.Contact;

import java.util.List;

public interface ContactService {
    Contact saveContact(Contact contact);

    List<ContactDto> getAllContacts();

    ContactDto getContactById(Integer id);

    ContactDto updateContact(Integer id, ContactDto contactDto);

    void deleteContact(Integer id);

    List<ContactDto> getContactsByOrderId(Integer orderId);
}
