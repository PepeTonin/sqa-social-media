package com.demoapp.demo.service;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.mock;

import org.junit.jupiter.api.Test;

import com.demoapp.demo.repository.UserRepository;

class UserServiceTest {

  // O UserService depende do repositório, mas estes testes validam apenas regras puras.
  // Por isso usamos um mock simples e não precisamos acessar banco de dados.
  private final UserService service = new UserService(mock(UserRepository.class));

  @Test
  void deveAceitarEmailValido() {
    // Teste de sucesso: um e-mail com usuário, arroba e domínio deve ser aceito.
    assertTrue(service.isEmailValid("aluno@example.com"));
  }

  @Test
  void deveRejeitarSenhaSemCaractereEspecial() {
    // Teste de sucesso: a senha não possui caractere especial, então deve ser inválida.
    assertFalse(service.isPasswordValid("Senha123"));
  }

  @Test
  void deveAceitarSenhaForteComOitoCaracteres() {
    // Teste de sucesso: a API usa corretamente o critério de "mínimo 8 caracteres".
    assertTrue(service.isPasswordValid("Abc123!@"));
  }
}
