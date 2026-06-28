package com.demoapp.demo.controller;

import com.demoapp.demo.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.is;
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
  void setUp() {
    // Garante que um teste nao interfira no outro.
    userRepository.deleteAll();
  }

  @Test
  void deveCadastrarUsuarioComEmailValidoESenhaForte() throws Exception {
    // Teste de sucesso: valida cadastro com e-mail valido e senha forte.
    String body = """
        {
          "email": "novo.usuario@email.com",
          "password": "Senha@123"
        }
        """;

    mockMvc.perform(post("/auth/signup")
        .contentType(MediaType.APPLICATION_JSON)
        .content(body))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.email", is("novo.usuario@email.com")))
        .andExpect(jsonPath("$.password", is("Senha@123")));
  }

  @Test
  void deveFazerLoginComCredenciaisCorretas() throws Exception {
    // Teste de sucesso: cria um usuario e valida login com as mesmas credenciais.
    String body = """
        {
          "email": "login@email.com",
          "password": "Senha@123"
        }
        """;

    mockMvc.perform(post("/auth/signup")
        .contentType(MediaType.APPLICATION_JSON)
        .content(body))
        .andExpect(status().isOk());

    mockMvc.perform(post("/auth/signin")
        .contentType(MediaType.APPLICATION_JSON)
        .content(body))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.email", is("login@email.com")));
  }

  @Test
  void bugDeveRetornarMensagemEmailJaCadastradoQuandoEmailJaExiste() throws Exception {
    // Teste de bug: o requisito pede "E-mail já cadastrado", mas a API retorna outra mensagem.
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
        .andExpect(jsonPath("$.message", is("E-mail já cadastrado")));
  }
}