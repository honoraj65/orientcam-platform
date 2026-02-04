import { defineConfig, devices } from '@playwright/test';

/**
 * Configuration Playwright pour OrientUniv
 * Tests E2E pour la plateforme d'orientation académique
 */
export default defineConfig({
  testDir: './tests',

  // Timeout pour chaque test
  timeout: 60 * 1000,

  // Nombre de tentatives en cas d'échec (1 localement pour auth intermittent)
  retries: process.env.CI ? 2 : 1,

  // Nombre de workers en parallèle (réduit à 2 pour éviter timeouts auth)
  workers: process.env.CI ? 1 : 2,

  // Reporter pour les résultats
  reporter: [
    ['html', { open: 'never' }],
    ['list']
  ],

  // Configuration globale
  use: {
    // URL de base pour les tests
    baseURL: 'http://localhost:3000',

    // Traces en cas d'échec
    trace: 'on-first-retry',

    // Screenshots en cas d'échec
    screenshot: 'only-on-failure',

    // Vidéos en cas d'échec
    video: 'retain-on-failure',
  },

  // Configuration des projets (navigateurs)
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    // Tests mobiles
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],

  // Démarrer le serveur de dev avant les tests
  webServer: {
    command: 'cd frontend && npm run dev',
    port: 3000,
    reuseExistingServer: true,
    timeout: 120 * 1000,
  },
});
