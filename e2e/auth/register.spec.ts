import { test, expect, Page } from "@playwright/test";
import { makeUser, VALID_PASSWORD } from "../helpers/user.factory";
import { seedUser } from "../helpers/api";

function emailInput(page: Page) {
  return page.getByPlaceholder("seu@email.com");
}

function passwordInput(page: Page) {
  return page.locator('input[type="password"]').first();
}

function confirmInput(page: Page) {
  return page.locator('input[type="password"]').nth(1);
}

function submitBtn(page: Page) {
  return page.locator('button[type="submit"]:has-text("Criar Conta")');
}

test.describe("Registration (/signup)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/signup");
  });

  test("happy path: registers a new user and redirects home", async ({ page }) => {
    const user = makeUser();

    await emailInput(page).fill(user.email);
    await passwordInput(page).fill(user.password);
    await confirmInput(page).fill(user.password);
    await submitBtn(page).click();
    await expect(page).toHaveURL("/");
    const stored = await page.evaluate(() => localStorage.getItem("user"));
    expect(stored).toContain(user.email);
  });

  test("duplicate email: shows already-in-use error", async ({ page, request }) => {
    await emailInput(page).fill("pedroprofessor@email.com");
    await passwordInput(page).fill("Senha@123");
    await confirmInput(page).fill("Senha@123");
    await submitBtn(page).click();

    await expect(page.getByText("E-mail já está em uso")).toBeVisible();
    await expect(page).toHaveURL(/\/signup$/);
  });

  test("weak password: shows password policy error", async ({ page }) => {
    const user = makeUser();
    await emailInput(page).fill(user.email);
    await passwordInput(page).fill("weak");
    await confirmInput(page).fill("weak");
    await submitBtn(page).click();

    await expect(page.getByText("A senha deve conter: m")).toBeVisible();
    await expect(page).toHaveURL(/\/signup$/);
  });

  test("empty form: all required-field errors appear", async ({ page }) => {
    await submitBtn(page).click();

    await expect(page.getByText("Email é obrigatório")).toBeVisible();
    await expect(page.getByText("Senha é obrigatória", { exact: true })).toBeVisible();
    await expect(
      page.getByText("Confirmação de senha é obrigatória")
    ).toBeVisible();
    await expect(page).toHaveURL(/\/signup$/);
  });
});
