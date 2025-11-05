import { test, expect } from "@playwright/test";

const BASE_URL = "http://localhost:3000";

test.describe("E2E - CRIAR CONTA", () => {
  test("deve criar uma conta e redirecionar para a home quando forem preenchidos inputs válidos", async ({
    page,
  }) => {
    await page.goto(BASE_URL);

    await page.getByRole("button", { name: "Criar Conta" }).click();
    await expect(page).toHaveURL(/\/signup$/);

    const digits = Math.floor(1000 + Math.random() * 9000);
    const email = `teste${digits}@teste.com`;
    const senha = "Teste123@";

    await page.getByPlaceholder("seu@email.com").fill(email);
    const passwordInputs = page.getByPlaceholder("••••••••");
    await passwordInputs.nth(0).fill(senha);
    await passwordInputs.nth(1).fill(senha);

    await page
      .locator("form")
      .getByRole("button", { name: "Criar Conta" })
      .click();

    await page.waitForURL(BASE_URL);
    await expect(page).toHaveURL(BASE_URL);

    await expect(page.getByRole("button", { name: "Sair" })).toBeVisible();
  });
});
