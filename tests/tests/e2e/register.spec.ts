import { test, expect } from '@playwright/test';

let email = 'test34@gmail.com';
let password = 'Test1234$%';

test('register sucess test' , async ({ page }) => {
  await page.goto('http://localhost:3000/signup');

  await page.getByPlaceholder('Email').fill(email);
  await page.locator('[id="senha"]').fill(password);
  await page.locator('[id="confirmar-senha"]').fill(password);
  await page.locator('button[type="submit"]').click();

  await expect(page).toHaveURL('http://localhost:3000/');
  await expect(page.getByText('Posts Curtidos')).toBeVisible();
});