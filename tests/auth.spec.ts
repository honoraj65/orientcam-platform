import { test, expect } from '@playwright/test';

test.describe('Authentification', () => {
  test.describe('Page de connexion', () => {
    test('devrait afficher le formulaire de connexion', async ({ page }) => {
      await page.goto('/login');

      // Vérifier le titre
      await expect(page.getByRole('heading', { name: /connexion/i })).toBeVisible();

      // Vérifier les champs du formulaire
      await expect(page.getByLabel(/email|adresse e-mail/i)).toBeVisible();
      await expect(page.getByLabel(/mot de passe/i)).toBeVisible();

      // Vérifier le bouton de connexion
      await expect(page.getByRole('button', { name: /se connecter|connexion/i })).toBeVisible();
    });

    test('devrait afficher une erreur avec des identifiants invalides', async ({ page }) => {
      await page.goto('/login');

      // Remplir le formulaire avec des identifiants invalides
      await page.getByLabel(/email|adresse e-mail/i).fill('invalid@test.com');
      await page.getByLabel(/mot de passe/i).fill('wrongpassword');

      // Soumettre le formulaire
      await page.getByRole('button', { name: /se connecter|connexion/i }).click();

      // Vérifier le message d'erreur
      await expect(page.locator('text=/erreur|invalide|incorrect/i')).toBeVisible();
    });

    test('devrait avoir un lien vers la page d\'inscription', async ({ page }) => {
      await page.goto('/login');

      // Vérifier le lien vers l'inscription
      const registerLink = page.getByRole('link', { name: /inscription|créer un compte/i });
      await expect(registerLink).toBeVisible();

      // Cliquer et vérifier la navigation
      await registerLink.click();
      await expect(page).toHaveURL(/\/register/);
    });
  });

  test.describe('Page d\'inscription', () => {
    test('devrait afficher le formulaire d\'inscription', async ({ page }) => {
      await page.goto('/register');

      // Vérifier le titre
      await expect(page.getByRole('heading', { name: /inscription/i })).toBeVisible();

      // Vérifier les champs essentiels
      await expect(page.getByLabel(/nom/i)).toBeVisible();
      await expect(page.getByLabel(/prénom/i)).toBeVisible();
      await expect(page.getByLabel(/email|adresse e-mail/i)).toBeVisible();
      await expect(page.getByLabel(/mot de passe/i).first()).toBeVisible();
    });

    test('devrait valider les champs requis', async ({ page }) => {
      await page.goto('/register');

      // Essayer de soumettre sans remplir les champs
      await page.getByRole('button', { name: /créer|inscription/i }).click();

      // Vérifier les messages de validation
      await expect(page.locator('text=/requis|obligatoire/i').first()).toBeVisible();
    });

    test('devrait avoir un lien vers la page de connexion', async ({ page }) => {
      await page.goto('/register');

      // Vérifier le lien vers la connexion
      const loginLink = page.getByRole('link', { name: /connexion|se connecter|déjà un compte/i });
      await expect(loginLink).toBeVisible();
    });
  });
});
