import { expect, test } from "@playwright/test";

const API_URL = process.env.API_URL || "http://localhost:8080";

test("deve cadastrar usuario pela API", async ({ request }) => {
  const response = await request.post(`${API_URL}/auth/signup`, {
    data: {
      email: `api${Date.now()}@teste.com`,
      password: "Senha@123"
    }
  });

  expect(response.status()).toBe(200);

  const body = await response.json();
  expect(body.id).toBeTruthy();
  expect(body.email).toContain("@teste.com");
});

test("deve recusar cadastro com email invalido", async ({ request }) => {
  const response = await request.post(`${API_URL}/auth/signup`, {
    data: {
      email: "email-invalido",
      password: "Senha@123"
    }
  });

  expect(response.status()).toBe(422);

  const body = await response.json();
  expect(body.status).toBe(422);
});

test("deve recusar login com credenciais invalidas", async ({ request }) => {
  const response = await request.post(`${API_URL}/auth/signin`, {
    data: {
      email: "naoexiste@teste.com",
      password: "Senha@123"
    }
  });

  expect(response.status()).toBe(401);

  const body = await response.json();
  expect(body.status).toBe(401);
});
