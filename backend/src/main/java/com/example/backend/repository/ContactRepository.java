package com.example.backend.repository;

import com.example.backend.entity.Contact;
import com.example.backend.entity.enums.ContactStatus;
import com.example.backend.entity.enums.ContactType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ContactRepository extends JpaRepository<Contact, Integer> {
    Optional<Contact> findByOrderIdAndTypeAndStatus(Integer orderId, ContactType type, ContactStatus status);

    List<Contact> findByOrderId(Integer orderId);
}
