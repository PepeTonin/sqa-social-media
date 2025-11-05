import { test, expect } from "@playwright/test";

const BASE_URL = "http://localhost:3000";

test.describe("E2E - INTRO", () => {
  test("deve abrir a home e o título da página deve ser 'SQA Social Media'", async ({
    page,
  }) => {
    await page.goto(BASE_URL);
    await expect(page).toHaveTitle(/SQA Social Media/i);
  });
});
