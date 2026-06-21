import { Page, expect } from "@playwright/test";
import { TestUser } from "./user.factory";

export async function loginAs(page: Page, credentials: TestUser): Promise<void> {
  await page.goto("/signin");

  await page.getByPlaceholder("seu@email.com").fill(credentials.email);
  await page.getByPlaceholder("••••••••").fill(credentials.password);
  await page.getByRole("main").getByRole("button", { name: "Entrar" }).click();
  
  await expect(page).toHaveURL("/");

  const stored = await page.evaluate(() => localStorage.getItem("user"));

  expect(stored, "logged-in user should be persisted in localStorage").toContain(
    credentials.email
  );
}
