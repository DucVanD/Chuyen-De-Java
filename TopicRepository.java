package com.example.backend.repository;

import com.example.backend.entity.Topic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TopicRepository extends JpaRepository<Topic, Integer> {
    // Kiểu dữ liệu ID ở đây phải là Integer để khớp với Entity Topic
}