import { test, expect, request as pwRequest } from '@playwright/test';

const email = 'test34@gmail.com';
const password = 'Test1234$%';

test.beforeAll(async () => {
  const api = await pwRequest.newContext({ baseURL: 'http://localhost:8080' });
  await api.post('/auth/signup', {
    data: { email, password }
  });
});

test('successfully liked a post', async ({ page }) => {
  await page.goto('http://localhost:3000/');

  await page.getByText('Entrar').click();

  await page.locator('[type="email"]').fill(email);
  await page.locator('[type="password"]').fill(password);

  await page.locator('button[type="submit"]').click();

  await expect(page).toHaveURL('http://localhost:3000/');

  await page.getByText('Curtir').first().click();

  await expect(page.getByText('Curtido')).toBeVisible();
});