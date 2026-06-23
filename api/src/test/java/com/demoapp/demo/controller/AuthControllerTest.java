package com.demoapp.demo.controller;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.demoapp.demo.model.User;
import com.demoapp.demo.service.UserService;

@ExtendWith(MockitoExtension.class)
class AuthControllerTest {

  /** Dublê do service: nao toca o banco; o comportamento e definido por teste. */
  @Mock
  private UserService service;

  /** Controller real, com o mock injetado via construtor pelo Mockito. */
  @InjectMocks
  private AuthController controller;

  private MockMvc mockMvc;

  /** Usuario de apoio: existe na base e tem a senha "Senha@123". */
  private User usuarioCadastrado() {
    User u = new User();
    u.setId(1L);
    u.setEmail("user@example.com");
    u.setPassword("Senha@123");
    return u;
  }

  @BeforeEach
  void setUp() {
    mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
  }


  // ==================== Testes de SUCESSO (devem passar) ====================

  /**
   * Requisito (signin): "O sistema deve permitir que usuarios facam login com
   * e-mail e senha corretos."
   *
   * E-mail e senha batem com o usuario cadastrado -> 200 com os dados do usuario.
   */
  @Test
  @DisplayName("POST /auth/signin com credenciais corretas retorna 200 e o usuario")
  void signin_credenciaisCorretas_retorna200() throws Exception {
    when(service.isEmailValid(anyString())).thenReturn(true);
    when(service.isPasswordValid(anyString())).thenReturn(true);
    when(service.findByEmail(anyString())).thenReturn(usuarioCadastrado());

    String body = "{\"email\":\"user@example.com\",\"password\":\"Senha@123\"}";

    mockMvc.perform(post("/auth/signin")
            .contentType(MediaType.APPLICATION_JSON)
            .content(body))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.email").value("user@example.com"));
  }

  /**
   * Requisito (signin): "Caso as credenciais estejam incorretas, a mensagem de
   * erro 'Credenciais invalidas' deve ser exibida."
   *
   * O usuario existe, mas a senha informada nao bate com a armazenada ->
   * 401 com a mensagem esperada.
   */
  @Test
  @DisplayName("POST /auth/signin com senha errada retorna 401 e 'Credenciais inválidas'")
  void signin_senhaIncorreta_retorna401() throws Exception {
    when(service.isEmailValid(anyString())).thenReturn(true);
    when(service.isPasswordValid(anyString())).thenReturn(true);
    when(service.findByEmail(anyString())).thenReturn(usuarioCadastrado());

    String body = "{\"email\":\"user@example.com\",\"password\":\"SenhaErrada@9\"}";

    mockMvc.perform(post("/auth/signin")
            .contentType(MediaType.APPLICATION_JSON)
            .content(body))
        .andExpect(status().isUnauthorized())
        .andExpect(jsonPath("$.message").value("Credenciais inválidas"));
  }

  /**
   * Requisito (redefinicao de senha): "Caso o e-mail informado nao esteja
   * cadastrado, o sistema deve exibir a mensagem de erro 'Usuario nao encontrado'."
   *
   * O e-mail nao existe na base -> 404 com a mensagem esperada.
   */
  @Test
  @DisplayName("POST /auth/reset-password com e-mail nao cadastrado retorna 404 e 'Usuário não encontrado'")
  void resetPassword_emailNaoCadastrado_retorna404() throws Exception {
    when(service.isEmailValid(anyString())).thenReturn(true);
    when(service.findByEmail(anyString())).thenReturn(null);

    String body = "{\"email\":\"naoexiste@example.com\"}";

    mockMvc.perform(post("/auth/reset-password")
            .contentType(MediaType.APPLICATION_JSON)
            .content(body))
        .andExpect(status().isNotFound())
        .andExpect(jsonPath("$.message").value("Usuário não encontrado"));
  }

  // ==================== Teste de BUG (deve FALHAR) ====================

  /**
   * BUG capturado: o requisito diz que, "caso o e-mail seja valido e cadastrado,
   * um toast de sucesso deve ser exibido com a mensagem: 'E-mail enviado com
   * sucesso'."
   *
   * A implementacao atual ({@link AuthController#resetPassword}) responde
   * "Senha redefinida com sucesso (fake)" — alem da mensagem divergir, o
   * comportamento muda de sentido (afirma redefinir a senha em vez de enviar o
   * e-mail de redefinicao).
   *
   * Este teste documenta o comportamento exigido pelo requisito e, por isso,
   * FALHA na implementacao atual, provando a existencia do bug.
   */
  @Test
  @DisplayName("[BUG] POST /auth/reset-password com e-mail cadastrado deveria retornar 'E-mail enviado com sucesso'")
  void resetPassword_emailCadastrado_deveriaRetornarEmailEnviado() throws Exception {
    when(service.isEmailValid(anyString())).thenReturn(true);
    when(service.findByEmail(anyString())).thenReturn(usuarioCadastrado());

    String body = "{\"email\":\"user@example.com\"}";

    mockMvc.perform(post("/auth/reset-password")
            .contentType(MediaType.APPLICATION_JSON)
            .content(body))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.message").value("E-mail enviado com sucesso"));
  }
}
