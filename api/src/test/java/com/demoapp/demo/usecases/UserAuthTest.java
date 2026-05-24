package com.demoapp.demo.usecases;

import com.demoapp.demo.model.User;
import com.demoapp.demo.repository.UserRepository;
import com.demoapp.demo.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("UserService — testes unitários")
public class UserAuthTest {

    @Mock
    UserRepository userRepository;

    UserService userService;

    @BeforeEach
    public void setup() {
        userService = new UserService(userRepository);
    }

    @Nested
    @DisplayName("Cadastro de usuário")
    class CadastroDeUsuario {

        @Test
        @DisplayName("Senha forte deve ter no mínimo 8 caracteres, 1 letra minúscula, 1 maiúscula, 1 número e 1 caractere especial")
        void usuarioComEmailESenhaForteDeveSerCadastrado() {
            String email = "marcelo@email.com";
            String senha = "Senha@123";

            User usuarioSalvo = new User();
            usuarioSalvo.setId(1L);
            usuarioSalvo.setEmail(email);
            usuarioSalvo.setPassword(senha);

            when(userRepository.save(any(User.class))).thenReturn(usuarioSalvo);

            User resultado = userService.createUser(email, senha);

            assertThat(resultado).isNotNull();
            assertThat(resultado.getId()).isEqualTo(1L);
            assertThat(resultado.getEmail()).isEqualTo(email);
            verify(userRepository, times(1)).save(any(User.class));
        }
    }

    @Nested
    @DisplayName("Validação de e-mail")
    class ValidacaoDeEmail {

        @Test
        @DisplayName("E-mail sem '@' deve ser rejeitado como inválido")
        void usuarioComEmailInvalidoNaoDeveSerCadastrado() {
            String emailSemArroba = "naoehumemail";

            boolean emailValido = userService.isEmailValid(emailSemArroba);

            assertThat(emailValido).isFalse();
            verifyNoInteractions(userRepository);
        }

        @Test
        @DisplayName("E-mail sem domínio ('usuario@') deveria ser inválido — BUG: isEmailValid aceita qualquer string com '@'")
        void emailSemDominioDeveSerRejeitado() {
            String emailSemDominio = "usuario@";

            boolean emailValido = userService.isEmailValid(emailSemDominio);

            assertThat(emailValido)
                    .as("'usuario@' não é e-mail válido, mas isEmailValid retorna true (bug)")
                    .isFalse();
        }
    }

    @Nested
    @DisplayName("Validação de senha")
    class ValidacaoDeSenha {

        @ParameterizedTest(name = "[{index}] senha \"{0}\" deve ser rejeitada")
        @DisplayName("Senha sem caractere especial / sem maiúscula / curta demais deve ser rejeitada")
        @ValueSource(strings = {
            "senha123",
            "SENHA123!",
            "Senha@ab",
            "S@1a",
            "SenhaForte1",
            "senh@123"
        })
        void senhaFracaNaoDeveSerAceita(String senhaFraca) {
            boolean valida = userService.isPasswordValid(senhaFraca);

            assertThat(valida)
                    .as("Senha '%s' não deveria ser aceita pelo validador", senhaFraca)
                    .isFalse();
            verifyNoInteractions(userRepository);
        }

        @Test
        @DisplayName("Senha que atende todos os critérios deve ser aceita pelo validador")
        void senhaForteDeveSerAceita() {
            String senhaForte = "Senha@123";

            assertThat(userService.isPasswordValid(senhaForte)).isTrue();
        }
    }
}