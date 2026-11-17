import { expect, test } from '@playwright/test';

test('sin sesión la app abre en el login', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveURL(/\/login$/);
  await expect(page.locator('ion-title')).toContainText('Iniciar sesión');
});
