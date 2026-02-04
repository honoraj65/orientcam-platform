import { test, expect } from '@playwright/test';

test.describe('Page d\'accueil OrientUniv', () => {
  test('devrait afficher le titre OrientUniv', async ({ page }) => {
    await page.goto('/');

    // Vérifier le titre de la page
    await expect(page).toHaveTitle(/OrientUniv/);
  });

  test('devrait afficher le logo et les liens de navigation', async ({ page }) => {
    await page.goto('/');

    // Vérifier que la navigation est présente
    const header = page.locator('header');
    await expect(header).toBeVisible();

    // Vérifier le logo OrientUniv
    await expect(page.getByText('OrientUniv').first()).toBeVisible();

    // Vérifier les liens principaux de navigation
    await expect(page.getByRole('link', { name: /à propos/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /contact/i }).first()).toBeVisible();
  });

  test('devrait avoir un bouton de connexion', async ({ page }) => {
    await page.goto('/');

    // Vérifier la présence du bouton de connexion
    const loginButton = page.getByRole('link', { name: /connexion|se connecter/i });
    await expect(loginButton).toBeVisible();
  });

  test('devrait avoir un lien vers la page À propos', async ({ page }) => {
    await page.goto('/');

    // Vérifier le lien À propos
    const aboutLink = page.getByRole('link', { name: /à propos/i });
    await expect(aboutLink).toBeVisible();

    // Vérifier que le lien pointe vers /about
    await expect(aboutLink).toHaveAttribute('href', '/about');
  });

  test('devrait être responsive sur mobile', async ({ page }) => {
    // Simuler un viewport mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Vérifier que le contenu est visible
    await expect(page.locator('body')).toBeVisible();
  });
});
