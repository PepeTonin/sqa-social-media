package com.demoapp.demo.service;

import com.demoapp.demo.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import static org.junit.jupiter.api.Assertions.*;

class UserServiceTest {

    private final UserRepository repo = Mockito.mock(UserRepository.class);
    private final UserService service = new UserService(repo);

    @Test
    void isPasswordValid() {
        assertTrue(service.isPasswordValid("Abc1@xyz9"));
        assertFalse(service.isPasswordValid("abc1@xyz9"));
        assertFalse(service.isPasswordValid("ABC1@XYZ9"));
        assertFalse(service.isPasswordValid("Abcdefg1"));
        assertFalse(service.isPasswordValid("Ab1@xy"));
    }
}