import { test as base } from '@playwright/test';

// Créer un compte de test utilisé pour tous les tests authentifiés
const TEST_USER = {
  email: 'test@orientuniv.com',
  password: 'Test123456!',
  firstName: 'Test',
  lastName: 'User',
};

export { TEST_USER };

// Étendre le test de base avec l'authentification
export const test = base.extend<{}, { authenticatedContext: void }>({
  // Contexte authentifié pour tous les tests qui en ont besoin
  authenticatedContext: [
    async ({ browser }, use) => {
      // Créer un contexte avec l'état d'authentification
      const context = await browser.newContext();
      const page = await context.newPage();

      // Se connecter une fois
      try {
        await page.goto('/login');
        await page.getByLabel(/email|adresse e-mail/i).fill(TEST_USER.email);
        await page.getByLabel(/mot de passe/i).fill(TEST_USER.password);
        await page.getByRole('button', { name: /se connecter|connexion/i }).click();

        // Attendre la redirection après connexion
        await page.waitForURL('/dashboard', { timeout: 5000 }).catch(() => {
          // Si pas de redirection, considérer que la connexion a échoué
        });
      } catch (error) {
        console.warn('Authentification échouée, les tests nécessitant une auth vont échouer');
      }

      await use();
      await context.close();
    },
    { scope: 'worker', auto: false },
  ],
});

export { expect } from '@playwright/test';
