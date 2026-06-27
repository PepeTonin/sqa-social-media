import { test, expect } from "@playwright/test";

const VALID_PASSWORD = "Teste123@";

test.describe("E2E - Curtir post autenticado", () => {
  test("usuário autenticado curte um post e ele aparece em 'Posts Curtidos'", async ({
    page,
  }) => {
    const email = `like${Date.now()}@teste.com`;

    await page.goto("/signup");
    await page.getByPlaceholder("seu@email.com").fill(email);
    const senhas = page.getByPlaceholder("••••••••");
    await senhas.nth(0).fill(VALID_PASSWORD);
    await senhas.nth(1).fill(VALID_PASSWORD);
    await page
      .locator("form")
      .getByRole("button", { name: "Criar Conta" })
      .click();

    await page.waitForURL("http://localhost:3000/");
    await expect(page.getByRole("button", { name: "Sair" })).toBeVisible();

    const primeiroCard = page.locator('[role="listitem"]').first();
    await expect(primeiroCard).toBeVisible();
    const titulo = await primeiroCard.locator("h2").innerText();

    await primeiroCard.getByRole("button", { name: "Curtir" }).click();
    await expect(
      primeiroCard.getByRole("button", { name: "Curtido" })
    ).toBeVisible();

    await page.getByRole("button", { name: "Posts Curtidos" }).click();
    await expect(page).toHaveURL(/\/auth\/liked$/);
    await expect(
      page.getByRole("heading", { name: titulo })
    ).toBeVisible();
  });
});