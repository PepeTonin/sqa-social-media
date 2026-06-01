package com.demoapp.demo;

import com.demoapp.demo.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.notNullValue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class AuthControllerTest {

  @Autowired
  private MockMvc mockMvc;

  @Autowired
  private UserRepository userRepository;

  @BeforeEach
  void setup() {
    // Limpa o banco H2 antes de cada teste para um teste nao interferir no outro.
    userRepository.deleteAll();
  }

  @Test
  void signupComDadosValidosDeveCriarUsuario() throws Exception {
    // Teste de sucesso: valida que a API permite cadastrar um usuario com e-mail valido
    // e senha forte como o cadastro pede.
    mockMvc.perform(post("/auth/signup")
        .contentType(MediaType.APPLICATION_JSON)
        .content("""
            {
              "email": "usuario@email.com",
              "password": "Senha@123"
            }
            """))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.id", notNullValue()))
        .andExpect(jsonPath("$.email").value("usuario@email.com"));
  }

  @Test
  void signinComCredenciaisInvalidasDeveRetornar401() throws Exception {
    // Teste de sucesso: valida que a API recusa login com credenciais incorretas
    // e retorna a mensagem de erro.
    mockMvc.perform(post("/auth/signin")
        .contentType(MediaType.APPLICATION_JSON)
        .content("""
            {
              "email": "naoexiste@email.com",
              "password": "Senha@123"
            }
            """))
        .andExpect(status().isUnauthorized())
        .andExpect(jsonPath("$.message").value("Credenciais inv\u00e1lidas"))
        .andExpect(jsonPath("$.status").value(401));
  }

  @Test
  void signupComEmailDuplicadoDeveRetornarMensagemEmailJaCadastrado() throws Exception {
    // Teste de bug: o requisito diz que e-mail duplicado deve exibir
    // "E-mail ja cadastrado". mas a API retorna outra mensagem, entao esse teste
    // deve falhar para provar a existencia do bug.
    String body = """
        {
          "email": "duplicado@email.com",
          "password": "Senha@123"
        }
        """;

    mockMvc.perform(post("/auth/signup")
        .contentType(MediaType.APPLICATION_JSON)
        .content(body))
        .andExpect(status().isOk());

    mockMvc.perform(post("/auth/signup")
        .contentType(MediaType.APPLICATION_JSON)
        .content(body))
        .andExpect(status().isConflict())
        .andExpect(jsonPath("$.message").value("E-mail j\u00e1 cadastrado"));
  }
}
