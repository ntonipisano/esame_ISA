import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',

  // I test che modificano lo stato dell'applicazione
  // devono essere eseguiti in modo sequenziale.
  fullyParallel: false,

  // In CI un test.only rimasto accidentalmente deve
  // far fallire la pipeline.
  forbidOnly: !!process.env.CI,

  // Ritenta i test solo in CI.
  retries: process.env.CI ? 2 : 0,

  // In CI utilizziamo un solo worker.
  workers: process.env.CI ? 1 : undefined,

  // Report HTML di Playwright.
  reporter: 'html',

  use: {
    // Angular
    baseURL: 'http://localhost:4200',

    // Salva il trace se un test fallisce e viene ritentato.
    trace: 'on-first-retry',

    // Screenshot in caso di errore.
    screenshot: 'only-on-failure',

    // Video in caso di errore.
    video: 'retain-on-failure',

    ...devices['Desktop Chrome'],
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  // Avvia automaticamente Angular e Rails
  // prima dell'esecuzione dei test.
  webServer: [
    {
      command: 'npm start -- --host 0.0.0.0 --port 4200',
      url: 'http://localhost:4200',
      name: 'Angular',
      reuseExistingServer: !process.env.CI,
      timeout: 120 * 1000,
    },
    {
      command: 'cd ../flowboard-backend_api && RAILS_ENV=test bundle exec rails server -b 0.0.0.0 -p 3000',
      url: 'http://localhost:3000',
      name: 'Rails',
      reuseExistingServer: !process.env.CI,
      timeout: 120 * 1000,
    },
  ],
});

