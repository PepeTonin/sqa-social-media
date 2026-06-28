import { test, expect } from "@playwright/test";

test.describe("E2E - Curtida sem autenticação", () => {
  test("deve exibir alerta ao tentar curtir um post sem estar logado", async ({
    page,
  }) => {
    await page.goto("http://localhost:3000/");

    await page.evaluate(() => {
      localStorage.removeItem("sqa_social_user");
      localStorage.removeItem("user");
    });
    await page.reload();

    await expect(page.getByRole("button", { name: "Entrar" })).toBeVisible();

    const primeiroPost = page.getByRole("listitem").first();
    await expect(primeiroPost).toBeVisible();
    -+(await primeiroPost.getByRole("button", { name: "Curtir" }).click());

    await expect(page).toHaveURL("http://localhost:3000/");
  });
});
