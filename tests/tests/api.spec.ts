import { expect, test } from "@playwright/test";

const API_URL = "http://localhost:8080";
const PASSWORD = "Teste@123";

function createEmail() {
  return `teste${Date.now()}${Math.random()}@email.com`;
}

test("deve cadastrar um usuário com dados válidos", async ({ request }) => {
  const email = createEmail();

  const response = await request.post(`${API_URL}/auth/signup`, {
    data: {
      email,
      password: PASSWORD,
    },
  });

  expect(response.status()).toBe(200);

  const body = await response.json();
  expect(body.email).toBe(email);
  expect(body.id).toBeDefined();
});

test("não deve cadastrar um e-mail duplicado", async ({ request }) => {
  const email = createEmail();
  const user = {
    email,
    password: PASSWORD,
  };

  await request.post(`${API_URL}/auth/signup`, { data: user });
  const response = await request.post(`${API_URL}/auth/signup`, { data: user });

  expect(response.status()).toBe(409);

  const body = await response.json();
  expect(body.message).toBe("E-mail já está em uso");
});

test("deve fazer login com credenciais válidas", async ({ request }) => {
  const email = createEmail();
  const user = {
    email,
    password: PASSWORD,
  };

  await request.post(`${API_URL}/auth/signup`, { data: user });
  const response = await request.post(`${API_URL}/auth/signin`, { data: user });

  expect(response.status()).toBe(200);

  const body = await response.json();
  expect(body.email).toBe(email);
  expect(body.id).toBeDefined();
});

test("não deve fazer login com senha incorreta", async ({ request }) => {
  const email = createEmail();

  await request.post(`${API_URL}/auth/signup`, {
    data: {
      email,
      password: PASSWORD,
    },
  });

  const response = await request.post(`${API_URL}/auth/signin`, {
    data: {
      email,
      password: "Senha@Errada123",
    },
  });

  expect(response.status()).toBe(401);

  const body = await response.json();
  expect(body.message).toBe("Credenciais inválidas");
});
