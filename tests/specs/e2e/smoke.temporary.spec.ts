import { expect, test } from "@playwright/test";

test("smoke temporário: a página inicial responde", async ({ page }) => {
  // Arrange + Act
  const response = await page.goto("/");

  // Assert
  expect(response, "A navegação deve produzir uma resposta HTTP").not.toBeNull();
  expect(response?.ok(), "A página inicial deve responder com HTTP 2xx").toBe(
    true
  );
  await expect(page.locator("body")).toBeVisible();
});
