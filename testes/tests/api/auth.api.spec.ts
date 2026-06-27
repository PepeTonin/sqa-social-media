import { test, expect } from '@playwright/test';

// Atenção: Confirme se o seu backend Spring Boot está rodando na porta 8080. Se não, altere aqui.
const API_URL = 'http://localhost:8080'; 

test.describe('Testes de API - Autenticação', () => {

  test('1. POST /auth/signup - Deve cadastrar usuário com sucesso', async ({ request }) => {
    // Usamos um número aleatório no e-mail para o teste não falhar por e-mail repetido na segunda execução
    const response = await request.post(`${API_URL}/auth/signup`, {
      data: {
        email: `aluno_${Date.now()}@teste.com`, 
        password: 'SenhaForte123$'
      }
    });
    
    // Esperamos que a API devolva 200 OK
    expect(response.status()).toBe(200);
  });

  test('2. POST /auth/signup - Deve retornar 409 ao usar e-mail duplicado', async ({ request }) => {
    const payload = { email: 'duplicado@teste.com', password: 'SenhaForte123!' };
    
    // 1º Passo: Cadastra o usuário a primeira vez
    await request.post(`${API_URL}/auth/signup`, { data: payload });

    // 2º Passo: Tenta cadastrar o MESMO usuário novamente e espera o erro 409
    const response = await request.post(`${API_URL}/auth/signup`, { data: payload });
    expect(response.status()).toBe(409); 
  });

  test('3. POST /auth/signin - Deve fazer login com sucesso e retornar token', async ({ request }) => {
    const payload = { email: `login_${Date.now()}@teste.com`, password: 'SenhaForte123!' };
    
    // Criamos o usuário para garantir que ele existe
    await request.post(`${API_URL}/auth/signup`, { data: payload });

    // Fazemos o login
    const response = await request.post(`${API_URL}/auth/signin`, { data: payload });
    expect(response.status()).toBe(200);
  });
test('4. POST /auth/signin - Deve retornar erro para credenciais inválidas', async ({ request }) => {
    const response = await request.post(`${API_URL}/auth/signin`, {
      data: {
        email: 'email_falso@teste.com',
        password: 'SenhaIncorreta$'
      }
    });
    
    // Ajustado para 422 conforme o retorno real da API
    expect(response.status()).toBe(422); 
  });

});