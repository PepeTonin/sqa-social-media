package com.demoapp.demo.usecases;

import com.demoapp.demo.controller.AuthController;
import com.demoapp.demo.dto.EmailDTO;
import com.demoapp.demo.dto.UserDTO;
import com.demoapp.demo.model.User;
import com.demoapp.demo.service.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AuthController.class)
@DisplayName("AuthController — testes de camada web")
class AuthControllerTest {

    @Autowired
    MockMvc mockMvc;

    @Autowired
    ObjectMapper objectMapper;

    // @MockitoBean é o substituto de @MockBean (depreciado no Spring Boot 3.4+)
    @MockitoBean
    UserService userService;

    @Nested
    @DisplayName("POST /auth/signup")
    class Signup {

        @Test
        @DisplayName("E-mail já cadastrado deve retornar 409 Conflict e nunca chamar createUser")
        void emailNaoPodeSerCadastradoMaisDeUmaVez() throws Exception {
            UserDTO dto = new UserDTO();
            dto.setEmail("marcelo@email.com");
            dto.setPassword("Senha@123");

            User usuarioExistente = new User();
            usuarioExistente.setId(1L);
            usuarioExistente.setEmail(dto.getEmail());

            when(userService.isEmailValid(dto.getEmail())).thenReturn(true);
            when(userService.isPasswordValid(dto.getPassword())).thenReturn(true);
            when(userService.findByEmail(dto.getEmail())).thenReturn(usuarioExistente);

            mockMvc.perform(post("/auth/signup")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(dto)))
                    .andExpect(status().isConflict())
                    .andExpect(jsonPath("$.status").value(409))
                    .andExpect(jsonPath("$.message").value("E-mail já está em uso"));

            verify(userService, never()).createUser(anyString(), anyString());
        }
    }

    @Nested
    @DisplayName("POST /auth/signin")
    class Signin {

        @Test
        @DisplayName("Usuário cadastrado deve conseguir autenticar com credenciais corretas e receber 200 OK")
        void usuarioCadastradoDeveConseguirAutenticar() throws Exception {
            UserDTO dto = new UserDTO();
            dto.setEmail("marcelo@email.com");
            dto.setPassword("Senha@123");

            User usuario = new User();
            usuario.setId(1L);
            usuario.setEmail(dto.getEmail());
            usuario.setPassword(dto.getPassword());

            when(userService.isEmailValid(dto.getEmail())).thenReturn(true);
            when(userService.isPasswordValid(dto.getPassword())).thenReturn(true);
            when(userService.findByEmail(dto.getEmail())).thenReturn(usuario);

            mockMvc.perform(post("/auth/signin")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(dto)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.id").value(1))
                    .andExpect(jsonPath("$.email").value(dto.getEmail()));
        }

        @Test
        @DisplayName("Credenciais inválidas (senha errada) devem retornar 401 Unauthorized")
        void credenciaisInvalidasDevemRetornar401() throws Exception {
            UserDTO dto = new UserDTO();
            dto.setEmail("marcelo@email.com");
            dto.setPassword("Senha@123");

            User usuarioComSenhaDiferente = new User();
            usuarioComSenhaDiferente.setId(1L);
            usuarioComSenhaDiferente.setEmail(dto.getEmail());
            usuarioComSenhaDiferente.setPassword("OutraSenha@456");

            when(userService.isEmailValid(dto.getEmail())).thenReturn(true);
            when(userService.isPasswordValid(dto.getPassword())).thenReturn(true);
            when(userService.findByEmail(dto.getEmail())).thenReturn(usuarioComSenhaDiferente);

            mockMvc.perform(post("/auth/signin")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(dto)))
                    .andExpect(status().isUnauthorized())
                    .andExpect(jsonPath("$.status").value(401));
        }
    }

    @Nested
    @DisplayName("POST /auth/reset-password")
    class ResetPassword {

        @Test
        @DisplayName("Usuário existente deve receber 200 OK ao solicitar redefinição de senha")
        void usuarioCriadoDeveConseguirRedefinirASenha() throws Exception {
            EmailDTO dto = new EmailDTO();
            dto.setEmail("marcelo@email.com");

            User usuario = new User();
            usuario.setId(1L);
            usuario.setEmail(dto.getEmail());

            when(userService.isEmailValid(dto.getEmail())).thenReturn(true);
            when(userService.findByEmail(dto.getEmail())).thenReturn(usuario);

            mockMvc.perform(post("/auth/reset-password")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(dto)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.message").value("Senha redefinida com sucesso (fake)"));

            verify(userService, times(1)).findByEmail(dto.getEmail());
        }

        @Test
        @DisplayName("Usuário inexistente deve retornar 404 Not Found ao solicitar redefinição")
        void resetPasswordComUsuarioInexistenteDeveRetornar404() throws Exception {
            EmailDTO dto = new EmailDTO();
            dto.setEmail("naoexiste@email.com");

            when(userService.isEmailValid(dto.getEmail())).thenReturn(true);
            when(userService.findByEmail(dto.getEmail())).thenReturn(null);

            mockMvc.perform(post("/auth/reset-password")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(dto)))
                    .andExpect(status().isNotFound())
                    .andExpect(jsonPath("$.status").value(404))
                    .andExpect(jsonPath("$.message").value("Usuário não encontrado"));
        }
    }
}