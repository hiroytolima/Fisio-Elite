import { test, expect } from '@playwright/test';

test.describe('Fluxo Clínico E2E', () => {
  test('deve renderizar a aplicação e permitir navegação acessível', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Fisio Elite/i);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });
});
