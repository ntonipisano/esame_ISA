import { test, expect } from '@playwright/test';

test.describe('Carrello', () => {

  test('un utente può aggiungere un prodotto al carrello', async ({ page }) => {

    // Login
    await page.goto('/login');

    await page.getByLabel('Email').fill('elpis@gmail.com');
    await page.getByLabel('Password').fill('12345@');

    await page.getByRole('button', { name: 'Accedi' }).click();

    // Verifica che il login sia completato
    await expect(page).not.toHaveURL(/\/login/);

    // Catalogo
    await page.goto('/products');

    // Attende che il primo prodotto sia visibile
    const productCard = page.locator('app-product-card').first();
    await expect(productCard).toBeVisible();

    // Salva il nome del prodotto per verificarlo successivamente
    const productTitle = await productCard
      .locator('mat-card-title.clickable-title')
      .textContent();

    // Aggiunge il prodotto al carrello
    await productCard
      .getByRole('button', { name: 'Aggiungi al carrello' })
      .click();

    // Vai al carrello tramite la navbar
    await page.locator('button[aria-label="Carrello"]').click();

    // Verifica URL
    await expect(page).toHaveURL(/\/cart/);

    // Verifica che il prodotto appena aggiunto sia presente nel carrello
    if (productTitle) {
    const cartItem = page.locator('mat-list-item').filter({
        hasText: productTitle.trim()
    });

    await expect(cartItem).toBeVisible();
    }

    // Deve essere presente il totale
    await expect(
      page.getByText(/Totale provvisorio carrello:/i)
    ).toBeVisible();

    // Deve essere disponibile il checkout
    await expect(
      page.getByRole('button', { name: 'Procedi al checkout' })
    ).toBeVisible();
  });

});