import { test, expect } from '@playwright/test';

const API = 'http://localhost:8080/api';


test('API 1: POST /auth/signin com credenciais válidas', async ({ request }) => {
  const response = await request.post(`${API}/auth/signin`, {
    data: {
      email: 'test@example.com',
      password: 'password123',
    },
  });
  
  expect(response.status()).toBe(200);
  const body = await response.json();
  expect(body).toHaveProperty('id');
  expect(body).toHaveProperty('email');
});


test('API 2: POST /auth/signin com senha inválida', async ({ request }) => {
  const response = await request.post(`${API}/auth/signin`, {
    data: {
      email: 'test@example.com',
      password: 'wrongpassword',
    },
  });
  
  expect([400, 401, 404]).toContain(response.status());
});


test('API 3: POST /auth/signup com email novo', async ({ request }) => {
  const response = await request.post(`${API}/auth/signup`, {
    data: {
      email: `newuser_${Date.now()}@test.com`,
      password: 'Password123!',
    },
  });
  
  expect([200, 201]).toContain(response.status());
  const body = await response.json();
  expect(body).toHaveProperty('id');
  expect(body).toHaveProperty('email');
});


test('API 4: POST /auth/signup com email duplicado', async ({ request }) => {
  const response = await request.post(`${API}/auth/signup`, {
    data: {
      email: 'test@example.com',
      password: 'Password123!',
    },
  });
  
  expect([400, 409]).toContain(response.status());
});
