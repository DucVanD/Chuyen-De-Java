package com.example.backend.service;

import com.example.backend.dto.UserDto;

import java.util.List;

public interface UserService {

    List<UserDto> getAll();

    UserDto getById(Integer id);

    UserDto getByEmail(String email);

    UserDto create(UserDto dto, String rawPassword);

    UserDto update(Integer id, UserDto dto);

    void lock(Integer id);

    void unlock(Integer id);
}
