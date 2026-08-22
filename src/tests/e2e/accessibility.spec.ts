import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Acessibilidade E2E (WCAG 2.2 AA)', () => {
  test('deve carregar a página inicial sem violações críticas de acessibilidade', async ({ page }) => {
    await page.goto('/');
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });


  test('deve permitir navegação por teclado até o link de salto (skip-link)', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Tab');
    
    const skipLink = page.getByRole('link', { name: /pular para conteúdo principal/i });
    await expect(skipLink).toBeFocused();
  });
});
