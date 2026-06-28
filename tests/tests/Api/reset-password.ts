import { test, expect, request as pwRequest } from "@playwright/test";

const API_BASE = "http://localhost:8080";

test.describe("API - auth reset password", () => {
  test("retorna 404 e a mensagem de usuário não encontrado para um e-mail desconhecido", async () => {
    const context = await pwRequest.newContext();

    const response = await context.post(`${API_BASE}/auth/reset-password`, {
      data: {
        email: "naoexiste@email.com",
      },
    });

    expect(response.status()).toBe(404);

    const body = await response.json();
    expect(body).toHaveProperty("message", "Usuário não encontrado");

    await context.dispose();
  });
});
