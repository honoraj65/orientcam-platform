import { test, expect } from '@playwright/test';

const TEST_USER = {
  email: 'test@orientuniv.com',
  password: 'Test123456!',
};

test.describe('Authentification', () => {
  test.describe('Page de connexion', () => {
    test('devrait afficher le formulaire de connexion', async ({ page }) => {
      await page.goto('/login');

      // Vérifier le titre OrientUniv
      await expect(page.getByText('OrientUniv')).toBeVisible();

      // Vérifier les champs du formulaire avec les IDs exacts
      await expect(page.locator('#email')).toBeVisible();
      await expect(page.locator('#password')).toBeVisible();

      // Vérifier le bouton de connexion
      await expect(page.getByRole('button', { name: 'Se connecter' })).toBeVisible();
    });

    test('devrait permettre de se connecter avec des identifiants valides', async ({ page }) => {
      await page.goto('/login');

      // Remplir le formulaire
      await page.locator('#email').fill(TEST_USER.email);
      await page.locator('#password').fill(TEST_USER.password);

      // Soumettre
      await page.getByRole('button', { name: 'Se connecter' }).click();

      // Attendre la redirection vers le dashboard
      await expect(page).toHaveURL('/dashboard', { timeout: 10000 });

      // Vérifier qu'on est bien connecté
      await expect(page.getByText(/profil|recommandations|test riasec/i)).toBeVisible();
    });

    test('devrait afficher une erreur avec des identifiants invalides', async ({ page }) => {
      await page.goto('/login');

      // Remplir avec des identifiants invalides
      await page.locator('#email').fill('invalid@test.com');
      await page.locator('#password').fill('wrongpassword');

      // Soumettre
      await page.getByRole('button', { name: 'Se connecter' }).click();

      // Vérifier le message d'erreur
      await expect(page.getByText(/Email ou mot de passe incorrect|Erreur de connexion/i)).toBeVisible({ timeout: 5000 });
    });

    test('devrait avoir un lien vers la page d\'inscription', async ({ page }) => {
      await page.goto('/login');

      // Vérifier le lien vers l'inscription
      const registerLink = page.getByRole('link', { name: /inscrivez-vous/i });
      await expect(registerLink).toBeVisible();

      // Cliquer et vérifier la navigation
      await registerLink.click();
      await expect(page).toHaveURL('/register');
    });
  });

  test.describe('Page d\'inscription', () => {
    test('devrait afficher le formulaire d\'inscription', async ({ page }) => {
      await page.goto('/register');

      // Vérifier le titre
      await expect(page.getByText('OrientUniv')).toBeVisible();

      // Vérifier les champs essentiels (avec IDs)
      await expect(page.locator('#firstName, [name="firstName"]')).toBeVisible();
      await expect(page.locator('#lastName, [name="lastName"]')).toBeVisible();
      await expect(page.locator('#email, [name="email"]')).toBeVisible();
      await expect(page.locator('#password, [name="password"]')).toBeVisible();
    });

    test('devrait avoir un lien vers la page de connexion', async ({ page }) => {
      await page.goto('/register');

      // Vérifier le lien vers la connexion
      const loginLink = page.getByRole('link', { name: /connectez-vous|se connecter|connexion/i });
      await expect(loginLink).toBeVisible();
    });
  });
});
