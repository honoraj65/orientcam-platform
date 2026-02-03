import { test, expect } from '@playwright/test';
import { loginAsTestUser } from './helpers/auth-helper';

test.describe('Test RIASEC', () => {
  // Se connecter avant chaque test
  test.beforeEach(async ({ page }) => {
    await loginAsTestUser(page);
  });

  test('devrait afficher la page d\'introduction au test RIASEC', async ({ page }) => {
    await page.goto('/test-riasec');

    // Vérifier le titre ou des mots-clés
    await expect(page.getByText(/Test RIASEC|Holland|orientation/i).first()).toBeVisible();

    // Vérifier le bouton pour commencer le test
    const startButton = page.getByRole('button', { name: /commencer|démarrer|lancer/i });
    await expect(startButton).toBeVisible();
  });

  test('devrait naviguer vers le questionnaire', async ({ page }) => {
    await page.goto('/test-riasec');

    // Cliquer sur le bouton pour commencer
    const startButton = page.getByRole('button', { name: /commencer|démarrer|lancer/i });
    await startButton.click();

    // Vérifier la navigation vers le quiz
    await expect(page).toHaveURL(/\/test-riasec\/quiz/, { timeout: 5000 });
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

      // Vérifier la présence de résultats ou un message
      const resultElement = page.locator('text=/résultat|profil|code|dimension|réaliste|investigateur|artistique|social|entrepreneur|conventionnel/i');
      await expect(resultElement.first()).toBeVisible({ timeout: 5000 });
    });

    test('devrait avoir un bouton de téléchargement PDF', async ({ page }) => {
      await page.goto('/test-riasec/results');

      // Attendre le chargement
      await page.waitForLoadState('networkidle');

      // Chercher le bouton PDF
      const pdfButton = page.getByRole('button', { name: /télécharger|pdf|exporter/i });

      // Vérifier qu'il existe (peut être désactivé si pas de résultats)
      const exists = await pdfButton.count() > 0;
      expect(exists).toBeTruthy();
    });

    test('devrait afficher des recommandations', async ({ page }) => {
      await page.goto('/test-riasec/results');

      // Attendre le chargement
      await page.waitForLoadState('networkidle');

      // Vérifier la présence de recommandations ou programmes
      const recommendElement = page.locator('text=/recommandation|programme|formation/i');
      await expect(recommendElement.first()).toBeVisible({ timeout: 5000 });
    });
  });
});
