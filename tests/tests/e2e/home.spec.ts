import { test, expect } from "@playwright/test";

const BASE_URL = "http://localhost:3000";

test.describe("E2E - HOME - USUÁRIO DESLOGADO", () => {
  test("deve exibir alerta ao tentar curtir um post sem estar autenticado com a seguinte mensagem: 'Você precisa estar autenticado para curtir posts!'", async ({
    page,
  }) => {
    await page.goto(BASE_URL);

    await expect(page.getByRole("button", { name: "Entrar" })).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Criar Conta" })
    ).toBeVisible();

    const likeButton = page.getByRole("button", { name: "Curtir" }).first();
    await expect(likeButton).toBeVisible();

    const dialogMessagePromise = new Promise<string>((resolve) => {
      page.once("dialog", async (dialog) => {
        const msg = dialog.message();
        await dialog.accept();
        resolve(msg);
      });
    });

    await likeButton.click();
    const message = await dialogMessagePromise;
    expect(message).toContain(
      "Você precisa estar autenticado para curtir posts!"
    );
  });
});
