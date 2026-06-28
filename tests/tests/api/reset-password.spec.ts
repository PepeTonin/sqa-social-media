import { test, expect, request as pwRequest } from "@playwright/test";

const API_BASE = "http://localhost:8080";
const email = "msduarte@gmail.com";

test.describe("Reset Password API", () => {
    test.beforeAll(async () => {
        const api = await pwRequest.newContext({ baseURL: API_BASE });
        await api.post("/auth/signup", {
            data: { email, password: "Test1234$%" }
        });
    });

    test("POST /reset-password", async () => {
        const api = await pwRequest.newContext({
            baseURL: API_BASE,
            extraHTTPHeaders: { "Content-Type": "application/json" },
        });

        const resp = await api.post("/auth/reset-password", {
            data: { email }
        });

        const body = await resp.json();

        expect(resp.status()).toEqual(200);
        expect(body.message).toBe("Senha redefinida com sucesso (fake)");
    });
});