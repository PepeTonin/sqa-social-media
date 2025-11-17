import { test, expect } from '@playwright/test';

test('deve fazer login com sucesso', async ({ page }) => {
    await page.goto('/signin');
    await page.fill('input[type="email"]', 'marco@email.com');
    await page.fill('input[type="password"]', 'TestPass$123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/'); // Verifica se redirecionou para a página inicial
});