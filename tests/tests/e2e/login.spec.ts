import { test, expect, request as pwRequest } from "@playwright/test";

const API_BASE = "http://localhost:8080";
const VALID_PASSWORD = "Teste123@";

test.describe("E2E - Fluxo de login", () => {
  let email: string;

  test.beforeAll(async () => {
    email = `login${Date.now()}@teste.com`;
    const api = await pwRequest.newContext({
      baseURL: API_BASE,
      extraHTTPHeaders: { "Content-Type": "application/json" },
    });
    const resp = await api.post("/auth/signup", {
      data: { email, password: VALID_PASSWORD },
    });
    expect(resp.status()).toBe(200);
    await api.dispose();
  });

  test("usuário faz login com credenciais válidas e chega na home autenticado", async ({
    page,
  }) => {
    await page.goto("/");

    await page.getByRole("button", { name: "Entrar" }).click();
    await expect(page).toHaveURL(/\/signin$/);

    await page.getByPlaceholder("seu@email.com").fill(email);
    await page.getByPlaceholder("••••••••").fill(VALID_PASSWORD);
    await page.locator("form").getByRole("button", { name: "Entrar" }).click();

    await page.waitForURL("http://localhost:3000/");
    await expect(page.getByRole("button", { name: "Sair" })).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Posts Curtidos" })
    ).toBeVisible();
  });
});