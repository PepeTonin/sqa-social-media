package com.demoapp.demo.controller;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.demoapp.demo.model.User;
import com.demoapp.demo.service.UserService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

class AuthControllerTest {

  private MockMvc mockMvc;
  private ObjectMapper objectMapper;
  private FakeUserService userService;

  @BeforeEach
  void setUp() {
    userService = new FakeUserService();
    objectMapper = new ObjectMapper();
    mockMvc = MockMvcBuilders
        .standaloneSetup(new AuthController(userService))
        .build();
  }

  @Test
  @DisplayName("Deve retornar 401 e Credenciais inválidas para senha incorreta")
  void deveRetornarNaoAutorizadoQuandoSenhaEstiverIncorreta() throws Exception {
    // Arrange
    String email = "usuario@teste.com";
    String submittedPassword = "Errada1!";
    User existingUser = user(1L, email, "Correta1!");

    userService.emailValid = true;
    userService.passwordValid = true;
    userService.foundUser = existingUser;

    String requestBody = objectMapper.writeValueAsString(
        java.util.Map.of("email", email, "password", submittedPassword));

    // Act + Assert
    mockMvc.perform(post("/auth/signin")
            .contentType(MediaType.APPLICATION_JSON)
            .content(requestBody))
        .andExpect(status().isUnauthorized())
        .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
        .andExpect(jsonPath("$.message").value("Credenciais inválidas"))
        .andExpect(jsonPath("$.status").value(401));

    assertEquals(1, userService.emailValidationCalls);
    assertEquals(1, userService.passwordValidationCalls);
    assertEquals(1, userService.findByEmailCalls);
    assertEquals(0, userService.createUserCalls);
  }

  @Test
  @DisplayName("Deve retornar 409 e E-mail já cadastrado para e-mail duplicado")
  void deveRetornarConflitoQuandoEmailJaEstiverCadastrado() throws Exception {
    // Arrange
    String email = "duplicado@teste.com";
    String password = "Valida1!";
    User existingUser = user(7L, email, password);

    userService.emailValid = true;
    userService.passwordValid = true;
    userService.foundUser = existingUser;

    String requestBody = objectMapper.writeValueAsString(
        java.util.Map.of("email", email, "password", password));

    // Act
    MvcResult result = mockMvc.perform(post("/auth/signup")
            .contentType(MediaType.APPLICATION_JSON)
            .content(requestBody))
        .andExpect(status().isConflict())
        .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
        .andExpect(jsonPath("$.status").value(409))
        .andReturn();

    // Assert
    assertEquals(1, userService.emailValidationCalls);
    assertEquals(1, userService.passwordValidationCalls);
    assertEquals(1, userService.findByEmailCalls);
    assertEquals(0, userService.createUserCalls);

    JsonNode response = objectMapper.readTree(result.getResponse().getContentAsString());

    // BUG DOCUMENTADO: o requisito exige a mensagem "E-mail já cadastrado".
    assertThat(response.get("message").asText())
        .as("mensagem retornada para tentativa de cadastro com e-mail duplicado")
        .isEqualTo("E-mail já cadastrado");
  }

  private User user(Long id, String email, String password) {
    User user = new User();
    user.setId(id);
    user.setEmail(email);
    user.setPassword(password);
    return user;
  }

  static class FakeUserService extends UserService {

    private boolean emailValid;
    private boolean passwordValid;
    private User foundUser;
    private int emailValidationCalls;
    private int passwordValidationCalls;
    private int findByEmailCalls;
    private int createUserCalls;

    FakeUserService() {
      super(null);
    }

    @Override
    public boolean isEmailValid(String email) {
      emailValidationCalls++;
      return emailValid;
    }

    @Override
    public boolean isPasswordValid(String password) {
      passwordValidationCalls++;
      return passwordValid;
    }

    @Override
    public User findByEmail(String email) {
      findByEmailCalls++;
      return foundUser;
    }

    @Override
    public User createUser(String email, String password) {
      createUserCalls++;
      return null;
    }

  }
}
