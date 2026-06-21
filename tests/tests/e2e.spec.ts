import { expect, test } from "@playwright/test";

const API_URL = "http://localhost:8080";
const PASSWORD = "Teste@123";

function createEmail() {
  return `teste${Date.now()}${Math.random()}@email.com`;
}

test("deve cadastrar um novo usuário", async ({ page }) => {
  await page.goto("/signup");

  await page.getByPlaceholder("seu@email.com").fill(createEmail());
  await page.locator('input[type="password"]').nth(0).fill(PASSWORD);
  await page.locator('input[type="password"]').nth(1).fill(PASSWORD);
  await page.locator('button[type="submit"]').click();

  await expect(page).toHaveURL("http://localhost:3000/");
  await expect(page.getByRole("button", { name: "Sair" })).toBeVisible();
});

test("deve fazer login com credenciais válidas", async ({ page, request }) => {
  const email = createEmail();

  await request.post(`${API_URL}/auth/signup`, {
    data: {
      email,
      password: PASSWORD,
    },
  });

  await page.goto("/signin");
  await page.getByPlaceholder("seu@email.com").fill(email);
  await page.locator('input[type="password"]').fill(PASSWORD);
  await page.locator('button[type="submit"]').click();

  await expect(page).toHaveURL("http://localhost:3000/");
  await expect(page.getByRole("button", { name: "Sair" })).toBeVisible();
});
