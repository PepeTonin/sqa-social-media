import { test } from '@playwright/test';


test('E2E 1: Pode preencher e submeter formulário de cadastro', async ({ page }) => {
  await page.goto('/signup');
  
  await page.fill('input[type="email"]', `user_${Date.now()}@test.com`);
  
  await page.fill('input[type="password"]', 'Password123!');
  
  await page.click('button[type="submit"]');
  
  await page.waitForTimeout(1000);
});
