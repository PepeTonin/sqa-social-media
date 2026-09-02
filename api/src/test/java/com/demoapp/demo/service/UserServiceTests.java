package com.demoapp.demo.service;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

public class UserServiceTests {

  @Test
  @DisplayName("Aceita senha válida: possui ao menos 8 caracteres, uma maiúscula, uma minúscula, um dígito e um caractere especial")
  void deveAceitarSenhaValidaQuandoAtendeTodosOsRequisitos() {
    String password = "Password123!";
    UserService userService = new UserService(null);
    boolean isValid = userService.isPasswordValid(password);
    assertTrue(isValid, "Esperava que 'Password123!' fosse considerada válida (>=8 caracteres, 1 maiúscula, 1 minúscula, 1 dígito e 1 caractere especial).");
  }

  @Test
  @DisplayName("Rejeita senha inválida: não contém letra maiúscula (apenas minúsculas e dígitos), portanto não atende à política")
  void deveRejeitarSenhaQuandoNaoContemMaiuscula() {
    String password = "password123";
    UserService userService = new UserService(null);
    boolean isValid = userService.isPasswordValid(password);
    assertFalse(isValid, "Esperava rejeitar 'password123' porque falta ao menos uma letra maiúscula e/ou caractere especial conforme a política.");
  }
}
