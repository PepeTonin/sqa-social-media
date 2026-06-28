package com.demoapp.demo.repository;

import java.util.Optional;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;
import static org.assertj.core.api.Assertions.assertThat;

import com.demoapp.demo.dto.UserDTO;
import com.demoapp.demo.model.User;

import jakarta.persistence.EntityManager;

@DataJpaTest
@ActiveProfiles("test")
class UserRepositoryTest {

    @Autowired
    UserRepository userRepository;

    @Autowired
    EntityManager entityManager;

    @Test
    @DisplayName("Should find user by email")
    void findUserByEmailSucess() {
        String email = "test@example.com";

        UserDTO data = new UserDTO(email, "password123");
        this.createUser(data);

        Optional<User> result = this.userRepository.findByEmail(email);

        assertThat((result).isPresent()).isTrue();
    }

    @Test
    @DisplayName("Should not find user by email")
    void findUserByEmailFailure() {
        String email = "test@example.com";

        Optional<User> result = this.userRepository.findByEmail(email);

        assertThat((result).isEmpty()).isTrue();
    }

    private User createUser(UserDTO data) {
        User newUser = new User();
        newUser.setEmail(data.getEmail());
        newUser.setPassword(data.getPassword());
        this.entityManager.persist(newUser);
        return newUser;
    }
}