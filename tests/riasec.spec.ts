import { test, expect } from '@playwright/test';
import { loginAsTestUser } from './helpers/auth-helper';

test.describe('Test RIASEC', () => {
  // Se connecter avant chaque test
  test.beforeEach(async ({ page }) => {
    await loginAsTestUser(page);
  });

  test('devrait afficher la page d\'introduction au test RIASEC', async ({ page }) => {
    await page.goto('/test-riasec');

    // Attendre que la page charge
    await page.waitForLoadState('networkidle');

    // Vérifier le titre principal (texte "Test d'Orientation RIASEC")
    await expect(page.getByRole('heading', { name: /test.*riasec/i })).toBeVisible({ timeout: 5000 });

    // Vérifier le bouton pour démarrer/repasser le test (lien vers /test-riasec/quiz)
    const startButton = page.getByRole('link', { name: /commencer le test|repasser le test/i });
    await expect(startButton).toBeVisible();
  });

  test('devrait naviguer vers le questionnaire', async ({ page }) => {
    await page.goto('/test-riasec');

    // Attendre que la page charge
    await page.waitForLoadState('networkidle');

    // Cliquer sur le bouton pour commencer/repasser (c'est un lien, pas un bouton)
    const startButton = page.getByRole('link', { name: /commencer le test|repasser le test/i });
    await startButton.click();

    // Vérifier la navigation vers le quiz
    await expect(page).toHaveURL(/\/test-riasec\/quiz/, { timeout: 10000 });
  });

  test.describe('Questionnaire', () => {
    test('devrait afficher les questions du test', async ({ page }) => {
      await page.goto('/test-riasec/quiz');

      // Attendre que la page charge
      await page.waitForLoadState('networkidle');

      // Vérifier la présence d'une question ou d'options
      const questionElements = page.locator('form, [role="radiogroup"], button');
      await expect(questionElements.first()).toBeVisible({ timeout: 5000 });
    });

    test('devrait permettre de sélectionner une réponse', async ({ page }) => {
      await page.goto('/test-riasec/quiz');

      // Attendre le chargement
      await page.waitForLoadState('networkidle');

      // Chercher et cliquer sur la première option de réponse
      const answerButton = page.locator('button, [role="radio"]').first();
      await answerButton.waitFor({ state: 'visible', timeout: 5000 });
      await answerButton.click();

      // Attendre un court instant
      await page.waitForTimeout(500);
    });
  });

  test.describe('Résultats', () => {
    test('devrait afficher les résultats si le test est complété', async ({ page }) => {
      await page.goto('/test-riasec/results');

      // Attendre le chargement
      await page.waitForLoadState('networkidle');

      // Vérifier la présence du code Holland (le test user a ISA)
      const hollandCode = page.getByText(/ISA|IAS|SIA|SAI|AIS|ASI/i);
      await expect(hollandCode.first()).toBeVisible({ timeout: 10000 });
    });

    test('devrait avoir un bouton de téléchargement PDF', async ({ page }) => {
      await page.goto('/test-riasec/results');

      // Attendre le chargement complet
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(3000);

      // Chercher le bouton PDF avec le texte exact
      const pdfButton = page.getByRole('button', { name: /télécharger.*pdf/i });

      // Vérifier qu'il existe et est visible
      await expect(pdfButton).toBeVisible({ timeout: 15000 });
    });

    test('devrait afficher des recommandations', async ({ page }) => {
      await page.goto('/test-riasec/results');

      // Attendre le chargement
      await page.waitForLoadState('networkidle');

      // Vérifier la présence du lien vers les recommandations
      const recommendLink = page.getByRole('link', { name: /recommandations|voir.*programme/i });
      await expect(recommendLink.first()).toBeVisible({ timeout: 10000 });
    });
  });
});
