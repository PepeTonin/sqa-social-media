package com.demoapp.demo.controller;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.demoapp.demo.model.User;
import com.demoapp.demo.service.UserService;

/**
 * Teste de integracao da camada web do {@link AuthController}.
 *
 * Usa MockMvc em modo "standalone" (sem subir o contexto Spring inteiro nem o
 * banco), com um {@link UserService} falso feito via subclasse anonima. Valida
 * o contrato HTTP do endpoint /auth/signin (rota, status e corpo da resposta).
 */
class AuthControllerTest {

  private MockMvc mockMvc;

  /**
   * UserService falso: e-mail/senha sempre passam nas validacoes de formato e
   * existe um unico usuario cadastrado com a senha "Senha@123".
   */
  private UserService fakeUserService() {
    return new UserService(null) {
      @Override
      public boolean isEmailValid(String email) {
        return true;
      }

      @Override
      public boolean isPasswordValid(String password) {
        return true;
      }

      @Override
      public User findByEmail(String email) {
        if ("user@example.com".equals(email)) {
          User u = new User();
          u.setId(1L);
          u.setEmail("user@example.com");
          u.setPassword("Senha@123");
          return u;
        }
        return null;
      }
    };
  }

  @BeforeEach
  void setUp() {
    AuthController controller = new AuthController(fakeUserService());
    mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
  }

  // ---------- Teste de SUCESSO (deve passar) ----------

  /**
   * Requisito (signin): "Caso as credenciais estejam incorretas, a mensagem de
   * erro 'Credenciais invalidas' deve ser exibida."
   *
   * O usuario existe, mas a senha informada nao bate com a armazenada ->
   * deve retornar 401 com a mensagem esperada.
   */
  @Test
  @DisplayName("POST /auth/signin com senha errada retorna 401 e 'Credenciais invalidas'")
  void signin_senhaIncorreta_retorna401() throws Exception {
    String body = "{\"email\":\"user@example.com\",\"password\":\"SenhaErrada@9\"}";

    mockMvc.perform(post("/auth/signin")
            .contentType(MediaType.APPLICATION_JSON)
            .content(body))
        .andExpect(status().isUnauthorized())
        .andExpect(jsonPath("$.message").value("Credenciais inválidas"));
  }
}
