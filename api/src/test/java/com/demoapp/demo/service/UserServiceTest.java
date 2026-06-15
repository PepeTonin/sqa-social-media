package com.demoapp.demo.service;

import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

class UserServiceTest {

  @Test
  @DisplayName("Deve aceitar senha forte com exatamente oito caracteres")
  void deveAceitarSenhaForteComExatamenteOitoCaracteres() {
    // Arrange
    UserService userService = new UserService(null);
    String password = "Aa1!aaaa";

    // Act
    boolean valid = userService.isPasswordValid(password);

    // Assert
    assertTrue(valid, "Uma senha forte com exatamente 8 caracteres deve ser válida");
  }
}
