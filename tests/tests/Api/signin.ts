import { test, expect, request as pwRequest } from "@playwright/test";

const API_BASE = "http://localhost:8080";

test.describe("API - auth signin", () => {
  test("retorna 401 e a mensagem de credenciais inválidas", async () => {
    const context = await pwRequest.newContext();

    const response = await context.post(`${API_BASE}/auth/signin`, {
      data: {
        email: "naoexiste@email.com",
        password: "Senha123!",
      },
    });

    expect(response.status()).toBe(401);

    const body = await response.json();
    expect(body).toHaveProperty("message", "Credenciais inválidas");

    await context.dispose();
  });
});
