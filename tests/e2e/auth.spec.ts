import { expect, test } from "@playwright/test";

test("deve criar uma conta nova pelo formulario", async ({ page }) => {
  const email = `usuario${Date.now()}@teste.com`;

  await page.goto("/signup");
  await page.locator('input[type="email"]').fill(email);
  await page.locator('input[type="password"]').nth(0).fill("Senha@123");
  await page.locator('input[type="password"]').nth(1).fill("Senha@123");
  await page.getByRole("button", { name: "Criar Conta" }).click();

  await expect(page.getByRole("heading", { name: "Feed de Posts" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Sair" })).toBeVisible();
});
