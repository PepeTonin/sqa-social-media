import { test, expect } from "@playwright/test";

test.describe("E2E - Cadastro de usuário", () => {
  test("deve cadastrar um novo usuário e redirecionar para a Home autenticado", async ({
    page,
  }) => {
    await page.goto("http://localhost:3000/signup");

    const emailUnico = `aluno${Date.now()}@email.com`;

    await page.getByPlaceholder("seu@email.com").fill(emailUnico);
    await page.getByPlaceholder("••••••••").first().fill("Senha@123");
    await page.getByPlaceholder("••••••••").nth(1).fill("Senha@123");

    await page
      .getByRole("main")
      .getByRole("button", { name: "Criar Conta" })
      .click();

    await expect(page).toHaveURL("http://localhost:3000/");
    await expect(page.getByRole("button", { name: "Sair" })).toBeVisible();
  });
});
