package com.demoapp.demo.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import java.util.Optional;
import java.util.logging.Logger;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.demoapp.demo.model.User;
import com.demoapp.demo.repository.UserRepository;

@ExtendWith(MockitoExtension.class)
@DisplayName("UserService - Testes Unitários")
class UserServiceTest {

  private static final Logger logger = Logger.getLogger(UserServiceTest.class.getName());

  @Mock
  private UserRepository userRepository;

  private UserService userService;

  @BeforeEach
  void setUp() {
    userService = new UserService(userRepository);
  }

  // ===== TESTES DE EMAIL VALIDATION =====

  @Test
  @DisplayName("✓ Deve validar email correto")
  void testValidEmailCorrect() {
    try {
      logger.info("Iniciando teste: validação de email correto");
      assertTrue(userService.isEmailValid("user@example.com"));
      logger.info("✓ SUCESSO: Email válido foi aceito corretamente");
    } catch (Exception e) {
      logger.severe("✗ ERRO: Falha na validação de email correto - " + e.getMessage());
      throw e;
    }
  }

  @Test
  @DisplayName("✓ Deve validar email com múltiplos domínios")
  void testValidEmailMultipleDomains() {
    try {
      logger.info("Iniciando teste: validação de email com múltiplos domínios");
      assertTrue(userService.isEmailValid("user@mail.co.uk"));
      logger.info("✓ SUCESSO: Email com múltiplos domínios foi aceito corretamente");
    } catch (Exception e) {
      logger.severe("✗ ERRO: Falha na validação de email com múltiplos domínios - " + e.getMessage());
      throw e;
    }
  }

  @Test
  @DisplayName("✗ BUG: Email sem domínio é aceito (DEVE FALHAR)")
  void testEmailValidationBugNoDomain() {
    try {
      logger.warning("Iniciando teste: verificação de BUG - email sem domínio");
      // BUG: isEmailValid só verifica se contém "@"
      // "invalid@" deveria ser inválido, mas é aceito
      boolean result = userService.isEmailValid("invalid@");
      assertTrue(result, "BUG ENCONTRADO: Email sem domínio é aceito!");
      logger.warning("✓ BUG CONFIRMADO: Email sem domínio foi aceito incorretamente");
    } catch (AssertionError e) {
      logger.info("✗ BUG NÃO DETECTADO: O teste falhou, indicando que o bug foi corrigido");
      throw e;
    }
  }

  @Test
  @DisplayName("✗ BUG: Email sem arroba mas com ponto é aceito (DEVE FALHAR)")
  void testEmailValidationBugNoDot() {
    try {
      logger.warning("Iniciando teste: verificação de BUG - email sem @");
      // BUG: "teste.com" deveria ser inválido
      boolean result = userService.isEmailValid("teste.com");
      assertFalse(result, "Esperado: false (inválido), Obtido: " + result);
      logger.info("✓ SUCESSO: Email sem @ foi rejeitado corretamente");
    } catch (Exception e) {
      logger.severe("✗ ERRO: Falha na validação de email sem @ - " + e.getMessage());
      throw e;
    }
  }

  @Test
  @DisplayName("✗ Email nulo deve retornar falso")
  void testEmailValidationNull() {
    try {
      logger.info("Iniciando teste: validação de email nulo");
      assertFalse(userService.isEmailValid(null));
      logger.info("✓ SUCESSO: Email nulo foi rejeitado corretamente");
    } catch (Exception e) {
      logger.severe("✗ ERRO: Falha na validação de email nulo - " + e.getMessage());
      throw e;
    }
  }

  @Test
  @DisplayName("✗ Email vazio deve retornar falso")
  void testEmailValidationEmpty() {
    try {
      logger.info("Iniciando teste: validação de email vazio");
      assertFalse(userService.isEmailValid(""));
      logger.info("✓ SUCESSO: Email vazio foi rejeitado corretamente");
    } catch (Exception e) {
      logger.severe("✗ ERRO: Falha na validação de email vazio - " + e.getMessage());
      throw e;
    }
  }

  @Test
  @DisplayName("✗ BUG: Email com espaços é aceito (DEVE FALHAR)")
  void testEmailValidationWithSpaces() {
    try {
      logger.warning("Iniciando teste: verificação de BUG - email com espaços");
      // BUG: isEmailValid apenas verifica "@", aceita "user @example.com"
      boolean result = userService.isEmailValid("user @example.com");
      assertTrue(result, "BUG ENCONTRADO: Email com espaço é aceito!");
      logger.warning("✓ BUG CONFIRMADO: Email com espaços foi aceito incorretamente");
    } catch (AssertionError e) {
      logger.info("✗ BUG NÃO DETECTADO: O teste falhou, indicando que o bug foi corrigido");
      throw e;
    }
  }

  // ===== TESTES DE PASSWORD VALIDATION =====

  @Test
  @DisplayName("✓ Deve validar senha correta com todos os requisitos")
  void testValidPasswordCorrect() {
    try {
      logger.info("Iniciando teste: validação de senha correta");
      assertTrue(userService.isPasswordValid("SecurePass123!"));
      logger.info("✓ SUCESSO: Senha válida foi aceita corretamente");
    } catch (Exception e) {
      logger.severe("✗ ERRO: Falha na validação de senha correta - " + e.getMessage());
      throw e;
    }
  }

  @Test
  @DisplayName("✓ Deve validar senha com caractere especial @")
  void testValidPasswordWithAt() {
    try {
      logger.info("Iniciando teste: validação de senha com @");
      assertTrue(userService.isPasswordValid("MyPass123@word"));
      logger.info("✓ SUCESSO: Senha com @ foi aceita corretamente");
    } catch (Exception e) {
      logger.severe("✗ ERRO: Falha na validação de senha com @ - " + e.getMessage());
      throw e;
    }
  }

  @Test
  @DisplayName("✗ Senha sem maiúscula deve falhar")
  void testPasswordWithoutUpperCase() {
    try {
      logger.info("Iniciando teste: senha sem maiúscula");
      assertFalse(userService.isPasswordValid("securepass123!"));
      logger.info("✓ SUCESSO: Senha sem maiúscula foi rejeitada corretamente");
    } catch (Exception e) {
      logger.severe("✗ ERRO: Falha na validação de senha sem maiúscula - " + e.getMessage());
      throw e;
    }
  }

  @Test
  @DisplayName("✗ Senha sem minúscula deve falhar")
  void testPasswordWithoutLowerCase() {
    try {
      logger.info("Iniciando teste: senha sem minúscula");
      assertFalse(userService.isPasswordValid("SECUREPASS123!"));
      logger.info("✓ SUCESSO: Senha sem minúscula foi rejeitada corretamente");
    } catch (Exception e) {
      logger.severe("✗ ERRO: Falha na validação de senha sem minúscula - " + e.getMessage());
      throw e;
    }
  }

  @Test
  @DisplayName("✗ Senha sem número deve falhar")
  void testPasswordWithoutNumber() {
    try {
      logger.info("Iniciando teste: senha sem número");
      assertFalse(userService.isPasswordValid("SecurePass!"));
      logger.info("✓ SUCESSO: Senha sem número foi rejeitada corretamente");
    } catch (Exception e) {
      logger.severe("✗ ERRO: Falha na validação de senha sem número - " + e.getMessage());
      throw e;
    }
  }

  @Test
  @DisplayName("✗ Senha sem caractere especial deve falhar")
  void testPasswordWithoutSpecialChar() {
    try {
      logger.info("Iniciando teste: senha sem caractere especial");
      assertFalse(userService.isPasswordValid("SecurePass123"));
      logger.info("✓ SUCESSO: Senha sem caractere especial foi rejeitada corretamente");
    } catch (Exception e) {
      logger.severe("✗ ERRO: Falha na validação de senha sem caractere especial - " + e.getMessage());
      throw e;
    }
  }

  @Test
  @DisplayName("✗ Senha com menos de 8 caracteres deve falhar")
  void testPasswordTooShort() {
    try {
      logger.info("Iniciando teste: senha muito curta");
      assertFalse(userService.isPasswordValid("Pass1!"));
      logger.info("✓ SUCESSO: Senha curta foi rejeitada corretamente");
    } catch (Exception e) {
      logger.severe("✗ ERRO: Falha na validação de senha curta - " + e.getMessage());
      throw e;
    }
  }

  @Test
  @DisplayName("✗ BUG: Senha nula causa NullPointerException (CRASH)")
  void testPasswordNull() {
    try {
      logger.warning("Iniciando teste: verificação de BUG - senha nula causa NullPointerException");
      // BUG: Código não verifica null antes de usar regex
      assertThrows(NullPointerException.class, () -> {
        userService.isPasswordValid(null);
      }, "BUG ENCONTRADO: NullPointerException em isPasswordValid(null)!");
      logger.warning("✓ BUG CONFIRMADO: Senha nula causa NullPointerException");
    } catch (Exception e) {
      logger.severe("✗ ERRO: Falha na verificação de BUG de senha nula - " + e.getMessage());
      throw e;
    }
  }

  // ===== TESTES DE USER CREATION =====

  @Test
  @DisplayName("✓ Deve criar usuário com sucesso")
  void testCreateUserSuccess() {
    try {
      logger.info("Iniciando teste: criação de usuário");
      String email = "test@example.com";
      String password = "SecurePass123!";

      when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
        User user = invocation.getArgument(0);
        user.setId(1L);
        return user;
      });

      User user = userService.createUser(email, password);

      assertNotNull(user);
      assertEquals(email, user.getEmail());
      assertEquals(password, user.getPassword());
      verify(userRepository, times(1)).save(any(User.class));
      logger.info("✓ SUCESSO: Usuário criado com sucesso");
    } catch (Exception e) {
      logger.severe("✗ ERRO: Falha na criação de usuário - " + e.getMessage());
      throw e;
    }
  }

  @Test
  @DisplayName("✓ Deve encontrar usuário por email")
  void testFindByEmailSuccess() {
    try {
      logger.info("Iniciando teste: busca de usuário por email");
      String email = "test@example.com";
      User mockUser = new User();
      mockUser.setId(1L);
      mockUser.setEmail(email);

      when(userRepository.findByEmail(email)).thenReturn(Optional.of(mockUser));

      User result = userService.findByEmail(email);

      assertNotNull(result);
      assertEquals(email, result.getEmail());
      verify(userRepository, times(1)).findByEmail(email);
      logger.info("✓ SUCESSO: Usuário encontrado por email");
    } catch (Exception e) {
      logger.severe("✗ ERRO: Falha na busca de usuário por email - " + e.getMessage());
      throw e;
    }
  }

  @Test
  @DisplayName("✓ Deve retornar null quando usuário não encontrado")
  void testFindByEmailNotFound() {
    try {
      logger.info("Iniciando teste: busca de usuário não existente");
      String email = "notfound@example.com";

      when(userRepository.findByEmail(email)).thenReturn(Optional.empty());

      User result = userService.findByEmail(email);

      assertNull(result);
      verify(userRepository, times(1)).findByEmail(email);
      logger.info("✓ SUCESSO: Retornou null para usuário não encontrado");
    } catch (Exception e) {
      logger.severe("✗ ERRO: Falha ao buscar usuário não existente - " + e.getMessage());
      throw e;
    }
  }
}
