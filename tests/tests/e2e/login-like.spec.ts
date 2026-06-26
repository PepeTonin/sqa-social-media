import { test } from '@playwright/test';


test('E2E 2: Pode fazer login com credenciais válidas', async ({ page }) => {

  await page.goto('/signin');
  
  await page.fill('input[type="email"]', 'test@example.com');
  
  await page.fill('input[type="password"]', 'password123');
  
  await page.click('button[type="submit"]');
  
  await page.waitForTimeout(1000);
});
