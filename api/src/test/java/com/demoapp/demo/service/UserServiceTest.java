package com.demoapp.demo.service;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("test")
public class UserServiceTest {

    @Autowired
    UserService userService;

    @Test
    @DisplayName("Should validate correct email successfully")
    void testIsEmailValidSucess() {
        String email = "test@gmail.com";

        boolean result = this.userService.isEmailValid(email);

        assertThat(result).isTrue();
    }

    @Test
    @DisplayName("Should validate incorrect email successfully")
    void testIsEmailValidFailureCase1() {
        String email = "incorrectemail.com";

        boolean result = this.userService.isEmailValid(email);

        assertThat(result).isFalse();
    }

    @Test
    @DisplayName("Should validate correct password successfully")
    void testIsPasswordValidSuccess() {
        String password = "ValidPassword123!";

        boolean result = this.userService.isPasswordValid(password);

        assertThat(result).isTrue();
    }

    @Test
    @DisplayName("Should validate incorrect password successfully")
    void testIsPasswordValidFailure() {
        String password = "invalidpassword";

        boolean result = this.userService.isPasswordValid(password);

        assertThat(result).isFalse();
    }
    
}
