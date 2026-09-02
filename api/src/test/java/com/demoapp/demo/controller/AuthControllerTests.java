package com.demoapp.demo.controller;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import com.demoapp.demo.model.User;
import com.demoapp.demo.service.UserService;

@WebMvcTest(AuthController.class)
public class AuthControllerTests {

  @Autowired
  private MockMvc mockMvc;

  @MockitoBean
  private UserService userService;

  @Test
  @DisplayName("POST /auth/signin com credenciais corretas retorna 200 e o e-mail do usuário")
  void deveAutenticarQuandoCredenciaisEstaoCorretas() throws Exception {
    User usuario = new User();
    usuario.setId(1L);
    usuario.setEmail("aluno@teste.com");
    usuario.setPassword("Password123!");

    when(userService.isEmailValid("aluno@teste.com")).thenReturn(true);
    when(userService.isPasswordValid("Password123!")).thenReturn(true);
    when(userService.findByEmail("aluno@teste.com")).thenReturn(usuario);

    mockMvc.perform(post("/auth/signin")
        .contentType(MediaType.APPLICATION_JSON)
        .content("""
            {
              "email": "aluno@teste.com",
              "password": "Password123!"
            }
            """))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.email").value("aluno@teste.com"));
  }

  @Test
  @DisplayName("POST /auth/signin com senha errada retorna 401 e a mensagem Credenciais inválidas")
  void deveRetornarErroQuandoSenhaEstaIncorreta() throws Exception {
    User usuario = new User();
    usuario.setEmail("aluno@teste.com");
    usuario.setPassword("Password123!");

    when(userService.isEmailValid("aluno@teste.com")).thenReturn(true);
    when(userService.isPasswordValid("SenhaErrada1!")).thenReturn(true);
    when(userService.findByEmail("aluno@teste.com")).thenReturn(usuario);

    mockMvc.perform(post("/auth/signin")
        .contentType(MediaType.APPLICATION_JSON)
        .content("""
            {
              "email": "aluno@teste.com",
              "password": "SenhaErrada1!"
            }
            """))
        .andExpect(status().isUnauthorized())
        .andExpect(jsonPath("$.message").value("Credenciais inválidas"));
  }
}
