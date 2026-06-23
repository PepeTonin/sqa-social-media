package com.demoapp.demo.service;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

/**
 * Testes unitarios da regra de validacao do {@link UserService}.
 *
 * Os metodos isPasswordValid e isEmailValid sao funcoes puras (nao tocam o
 * banco), entao o repositorio nao e necessario e passamos null no construtor.
 */
class UserServiceTest {

  private final UserService userService = new UserService(null);

  @Test
  @DisplayName("Senha forte (8+ chars, maiuscula, minuscula, numero e especial) e valida")
  void isPasswordValid_senhaForte_retornaTrue() {
    assertTrue(userService.isPasswordValid("Senha@123"));
    assertTrue(userService.isPasswordValid("Abcdef1!"));
  }

  @Test
  @DisplayName("Senha fraca (sem os criterios exigidos) e invalida")
  void isPasswordValid_senhaFraca_retornaFalse() {
    assertFalse(userService.isPasswordValid("12345678"), "so numeros");
    assertFalse(userService.isPasswordValid("senhafraca"), "so minusculas");
    assertFalse(userService.isPasswordValid("Abc1!"), "menos de 8 caracteres");
  }

  /**
   * BUG capturado: o requisito diz que o cadastro deve aceitar apenas um
   * "e-mail valido". A implementacao de isEmailValid apenas verifica se a
   * string contem "@", aceitando enderecos claramente invalidos como
   * "joao@" (sem dominio) ou "@dominio.com" (sem usuario).
   *
   * Este teste documenta o comportamento esperado pelo requisito e, por isso,
   * FALHA na implementacao atual, provando a existencia do bug.
   */
  @Test
  @DisplayName("[BUG] E-mail sem dominio deveria ser invalido")
  void isEmailValid_emailSemDominio_deveriaSerInvalido() {
    assertFalse(userService.isEmailValid("joao@"), "e-mail sem dominio deveria ser invalido");
    assertFalse(userService.isEmailValid("@dominio.com"), "e-mail sem usuario deveria ser invalido");
  }
}
