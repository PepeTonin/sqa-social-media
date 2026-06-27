package com.demoapp.demo.controller;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import com.demoapp.demo.model.User;
import com.demoapp.demo.service.UserService;

@WebMvcTest(AuthController.class)
public class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserService userService;

    @Test
    @DisplayName("Teste de Sucesso 1: Signin com credenciais inválidas deve retornar 401 e mensagem de erro correta")
    void testSigninCredenciaisInvalidas() throws Exception {
        // Simulamos as validações iniciais passando
        when(userService.isEmailValid(anyString())).thenReturn(true);
        when(userService.isPasswordValid(anyString())).thenReturn(true);
        
        // Simulamos que o usuário não existe no banco
        when(userService.findByEmail(anyString())).thenReturn(null);

        String jsonPayload = "{\"email\":\"teste@teste.com\", \"password\":\"Senha123!\"}";

        // Executamos a requisição e esperamos que passe, validando a regra do requisito
        mockMvc.perform(post("/auth/signin")
                .contentType(MediaType.APPLICATION_JSON)
                .content(jsonPayload))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.message").value("Credenciais inválidas"));
    }

    @Test
    @DisplayName("Teste de Sucesso 2: Signup com dados corretos deve criar o usuário e retornar 200 OK")
    void testSignupComSucesso() throws Exception {
        // Simulamos as validações de email e senha passando
        when(userService.isEmailValid(anyString())).thenReturn(true);
        when(userService.isPasswordValid(anyString())).thenReturn(true);
        when(userService.findByEmail(anyString())).thenReturn(null);
        
        // Simulamos a criação do usuário
        User mockUser = new User();
        mockUser.setId(1L);
        mockUser.setEmail("novo@teste.com");
        when(userService.createUser(anyString(), anyString())).thenReturn(mockUser);

        String jsonPayload = "{\"email\":\"novo@teste.com\", \"password\":\"Senha123!\"}";

        // Executamos a requisição e esperamos que o cadastro seja feito com sucesso
        mockMvc.perform(post("/auth/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(jsonPayload))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("novo@teste.com"));
    }

    @Test
    @DisplayName("Teste de Bug (Falha Esperada): Signup com e-mail duplicado deve exibir a mensagem correta")
    void testSignupEmailDuplicado() throws Exception {
        when(userService.isEmailValid(anyString())).thenReturn(true);
        when(userService.isPasswordValid(anyString())).thenReturn(true);
        
        // Simulamos que o e-mail já existe no banco de dados
        User mockUser = new User();
        mockUser.setEmail("existente@teste.com");
        when(userService.findByEmail(anyString())).thenReturn(mockUser);

        String jsonPayload = "{\"email\":\"existente@teste.com\", \"password\":\"Senha123!\"}";

        // O teste VAI FALHAR AQUI! O requisito pede "E-mail já cadastrado", 
        // mas sabemos que o código atual tem um bug e devolve "E-mail já está em uso".
        mockMvc.perform(post("/auth/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(jsonPayload))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.message").value("E-mail já cadastrado")); 
    }
}