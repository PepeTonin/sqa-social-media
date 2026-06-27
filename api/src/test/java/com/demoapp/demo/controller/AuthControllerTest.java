package com.demoapp.demo.controller;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.Test;
import org.springframework.http.ResponseEntity;

import com.demoapp.demo.dto.ErrorResponse;
import com.demoapp.demo.dto.UserDTO;
import com.demoapp.demo.model.User;
import com.demoapp.demo.service.UserService;

class AuthControllerTest {

  @Test
  void deveRetornarConflitoQuandoEmailJaExiste() {
    UserService service = mock(UserService.class);
    AuthController controller = new AuthController(service);
    User existingUser = new User();
    existingUser.setEmail("aluno@example.com");

    when(service.isEmailValid("aluno@example.com")).thenReturn(true);
    when(service.isPasswordValid("Senha123!")).thenReturn(true);
    when(service.findByEmail("aluno@example.com")).thenReturn(existingUser);

    UserDTO dto = new UserDTO();
    dto.setEmail("aluno@example.com");
    dto.setPassword("Senha123!");

    ResponseEntity<?> response = controller.signup(dto);
    ErrorResponse body = (ErrorResponse) response.getBody();

    assertEquals(409, response.getStatusCode().value());
    assertEquals("E-mail j\u00e1 est\u00e1 em uso", body.getMessage());
  }
}
