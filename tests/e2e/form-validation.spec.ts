import { expect, test } from "@playwright/test";

test("deve mostrar erro quando as senhas do cadastro forem diferentes", async ({ page }) => {
  await page.goto("/signup");
  await page.locator('input[type="email"]').fill("teste@teste.com");
  await page.locator('input[type="password"]').nth(0).fill("Senha@123");
  await page.locator('input[type="password"]').nth(1).fill("Outra@123");
  await page.getByRole("button", { name: "Criar Conta" }).click();

  await expect(page.getByText(/senhas/i)).toBeVisible();
});
