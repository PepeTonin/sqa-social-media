import { test, expect, request as pwRequest } from "@playwright/test";

const API_BASE = "http://localhost:8080";

test.describe("API - AUTH", () => {
  test("POST /auth/signup cria usuário", async () => {
    const api = await pwRequest.newContext({
      baseURL: API_BASE,
      extraHTTPHeaders: { "Content-Type": "application/json" },
    });

    const digits = Math.floor(1000 + Math.random() * 9000);
    const email = `teste${digits}@teste.com`;
    const password = "Teste123@";

    const resp = await api.post("/auth/signup", {
      data: { email, password },
    });

    expect(resp.status()).toBeGreaterThanOrEqual(200);
    expect(resp.status()).toBeLessThan(300);

    const body = await resp.json();
    expect(typeof body.id).toBe("number");
    expect(body.email).toBe(email);
  });
});
