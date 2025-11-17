import { test, expect} from '@playwright/test';

test('deve fazer o cadastro com sucesso', async ({ page }) => {
    await page.goto('/signup');
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'StrongPass$123');
    await page.getByLabel('Confirmar Senha').fill('StrongPass$123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/'); // Verifica se redirecionou para a página inicial
})