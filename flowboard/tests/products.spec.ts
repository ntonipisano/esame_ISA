import { test, expect } from '@playwright/test';

test.describe('Products', () => {

  test('visualizza il catalogo e apre il dettaglio di un prodotto', async ({ page }) => {

    // Apertura del catalogo
    await page.goto('/products');

    // Verifica che la pagina sia stata caricata
    await expect(page).toHaveURL(/\/products$/);

    // Deve essere presente almeno un prodotto
    const products = page.locator('app-product-card');
    await expect(products.first()).toBeVisible();

    // Click sul titolo del primo prodotto
    await products.first()
      .locator('mat-card-title.clickable-title')
      .click();

    // Verifica apertura della pagina di dettaglio
    await expect(page).toHaveURL(/\/products\/.+/);
  });

});
