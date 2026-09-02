package com.demoapp.demo.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.demoapp.demo.model.User;
import com.demoapp.demo.repository.UserRepository;

@ExtendWith(MockitoExtension.class)
public class UserServiceMockitoTests {

  @Mock
  private UserRepository userRepository;

  @InjectMocks
  private UserService userService;

  @Test
  @DisplayName("Cria usuário: o service pede para o repositório salvar e devolve o usuário persistido")
  void deveSalvarUsuarioQuandoCriar() {
    User salvo = new User();
    salvo.setId(1L);
    salvo.setEmail("aluno@teste.com");
    salvo.setPassword("Password123!");

    when(userRepository.save(any(User.class))).thenReturn(salvo);

    User resultado = userService.createUser("aluno@teste.com", "Password123!");

    assertEquals("aluno@teste.com", resultado.getEmail());
    verify(userRepository).save(any(User.class));
  }

  @Test
  @DisplayName("Busca por e-mail: quando o repositório encontra o usuário, o service o devolve")
  void deveRetornarUsuarioQuandoEmailExiste() {
    User usuario = new User();
    usuario.setId(1L);
    usuario.setEmail("aluno@teste.com");

    when(userRepository.findByEmail("aluno@teste.com")).thenReturn(Optional.of(usuario));

    User resultado = userService.findByEmail("aluno@teste.com");

    assertNotNull(resultado);
    assertEquals("aluno@teste.com", resultado.getEmail());
  }
}
