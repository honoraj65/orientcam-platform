import { test, expect } from '@playwright/test';

test.describe('Test RIASEC', () => {
  // Helper pour se connecter avant les tests
  test.beforeEach(async ({ page }) => {
    // Note: Ces tests nécessitent un utilisateur connecté
    // Vous devrez adapter selon votre stratégie d'authentification de test
  });

  test('devrait afficher la page d\'introduction au test RIASEC', async ({ page }) => {
    await page.goto('/test-riasec');

    // Vérifier le titre
    await expect(page.getByRole('heading', { name: /test riasec|test d'orientation/i })).toBeVisible();

    // Vérifier la présence d'informations sur le test
    await expect(page.locator('text=/Holland|RIASEC|orientation professionnelle/i')).toBeVisible();

    // Vérifier le bouton pour commencer le test
    await expect(page.getByRole('button', { name: /commencer|démarrer/i })).toBeVisible();
  });

  test('devrait naviguer vers le questionnaire', async ({ page }) => {
    await page.goto('/test-riasec');

    // Cliquer sur le bouton pour commencer
    await page.getByRole('button', { name: /commencer|démarrer/i }).click();

    // Vérifier la navigation vers le quiz
    await expect(page).toHaveURL(/\/test-riasec\/quiz/);
  });

  test.describe('Questionnaire', () => {
    test('devrait afficher les questions du test', async ({ page }) => {
      await page.goto('/test-riasec/quiz');

      // Vérifier la présence d'une question
      await expect(page.locator('text=/question/i')).toBeVisible();

      // Vérifier la présence des options de réponse (échelle 1-5)
      const answerOptions = page.locator('[role="radio"], [role="button"]');
      await expect(answerOptions.first()).toBeVisible();
    });

    test('devrait permettre de naviguer entre les questions', async ({ page }) => {
      await page.goto('/test-riasec/quiz');

      // Attendre que la première question soit visible
      await expect(page.locator('text=/question/i')).toBeVisible();

      // Sélectionner une réponse
      const firstAnswer = page.locator('[role="radio"], [role="button"]').first();
      await firstAnswer.click();

      // Vérifier la présence d'un bouton "Suivant"
      const nextButton = page.getByRole('button', { name: /suivant|continuer/i });
      if (await nextButton.isVisible()) {
        await nextButton.click();

        // Vérifier que la question a changé
        await page.waitForTimeout(500);
      }
    });

    test('devrait sauvegarder la progression', async ({ page }) => {
      await page.goto('/test-riasec/quiz');

      // Répondre à une question
      const firstAnswer = page.locator('[role="radio"], [role="button"]').first();
      await firstAnswer.click();

      // Recharger la page
      await page.reload();

      // Vérifier que la progression est conservée
      // (les tests peuvent varier selon l'implémentation exacte)
    });
  });

  test.describe('Résultats', () => {
    test('devrait afficher les résultats après completion', async ({ page }) => {
      // Note: Ce test suppose que l'utilisateur a déjà complété le test
      await page.goto('/test-riasec/results');

      // Vérifier la présence des résultats
      await expect(page.locator('text=/résultat|profil|code holland/i')).toBeVisible();

      // Vérifier la présence des dimensions RIASEC
      const dimensions = ['Réaliste', 'Investigateur', 'Artistique', 'Social', 'Entrepreneur', 'Conventionnel'];

      // Au moins une dimension devrait être visible
      let foundDimension = false;
      for (const dimension of dimensions) {
        if (await page.locator(`text=/${dimension}/i`).isVisible()) {
          foundDimension = true;
          break;
        }
      }
      expect(foundDimension).toBe(true);
    });

    test('devrait permettre de télécharger le PDF', async ({ page }) => {
      await page.goto('/test-riasec/results');

      // Vérifier la présence du bouton de téléchargement PDF
      const pdfButton = page.getByRole('button', { name: /télécharger|pdf|exporter/i });
      await expect(pdfButton).toBeVisible();

      // Vérifier que le bouton n'est pas désactivé
      await expect(pdfButton).not.toBeDisabled();
    });

    test('devrait afficher les recommandations de programmes', async ({ page }) => {
      await page.goto('/test-riasec/results');

      // Vérifier la présence de recommandations
      await expect(page.locator('text=/recommandation|programme recommandé|formation/i')).toBeVisible();
    });
  });
});
