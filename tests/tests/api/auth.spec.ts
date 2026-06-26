import { test, expect } from '@playwright/test';

const API = 'http://localhost:8080';

const TEST_USER_EMAIL = 'test@example.com';
const TEST_USER_PASSWORD = 'Password123!';

test.beforeAll(async ({ request }) => {
  // Ensure the test user exists before running signin/duplicate tests
  await request.post(`${API}/auth/signup`, {
    data: {
      email: TEST_USER_EMAIL,
      password: TEST_USER_PASSWORD,
    },
  });
});

test('API 1: POST /auth/signin com credenciais válidas', async ({ request }) => {
  const response = await request.post(`${API}/auth/signin`, {
    data: {
      email: TEST_USER_EMAIL,
      password: TEST_USER_PASSWORD,
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
      email: TEST_USER_EMAIL,
      password: 'WrongPass1!',
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
      email: TEST_USER_EMAIL,
      password: TEST_USER_PASSWORD,
    },
  });
  
  expect([400, 409]).toContain(response.status());
});
