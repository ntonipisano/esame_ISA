import { test, expect } from '@playwright/test';

test.describe('Autenticazione', () => {

  test('login e accesso alla pagina protetta ordini', async ({ page }) => {

    // Apertura della pagina di login
    await page.goto('/login');

    // Inserimento delle credenziali
    await page.getByLabel(/email/i).fill('elpis@gmail.com');
    await page.getByLabel(/password/i).fill('12345@');

    // Invio del form
    await page.getByRole('button', { name: 'Accedi' }).click();

    // Dopo il login l'utente non deve più essere nella pagina di login
    await expect(page).not.toHaveURL(/\/login/);

    // Verifica che il token sia stato salvato
    const token = await page.evaluate(() => localStorage.getItem('auth_token'));

    expect(token).toBeTruthy();

    // Accesso a una pagina protetta
    await page.goto('/orders');

    // L'utente autenticato deve poter accedere alla pagina
    await expect(page).not.toHaveURL(/\/login/);
  });

});