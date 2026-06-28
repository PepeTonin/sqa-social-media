import { test, expect, request as pwRequest } from "@playwright/test";

const API_BASE = "http://localhost:8080";

test.describe("API - auth signup", () => {
  test("cria um novo usuario com email unico", async () => {
    const context = await pwRequest.newContext();
    const email = `teste${Date.now()}@email.com`;

    const response = await context.post(`${API_BASE}/auth/signup`, {
      data: {
        email,
        password: "Senha123!",
      },
    });

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body).toHaveProperty("id");
    expect(body.email).toBe(email);

    await context.dispose();
  });
});
