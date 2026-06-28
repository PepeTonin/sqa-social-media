import { test, expect, request as pwRequest } from "@playwright/test";

const API_BASE = "http://localhost:8080";

test.describe("Sign-Up API", () => {
    test("POST /auth/signup", async () => {
    const api = await pwRequest.newContext({
      baseURL: API_BASE,
      extraHTTPHeaders: { "Content-Type": "application/json" },
    });

    const email = 'msduarte13@minha.fag.edu.br';
    const password = 'Dilminha123!#';

    const registerResp = await api.post("/auth/signup", {
        data: { email, password }
    });

    const registerBody = await registerResp.json();

    expect(registerResp.status()).toBe(200);
    expect(registerBody.email).toBe(email);
    expect(registerBody.password).toBe(password);
    });
});