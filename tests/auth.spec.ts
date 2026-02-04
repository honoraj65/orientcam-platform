import { test, expect } from '@playwright/test';

const TEST_USER = {
  email: 'test@orientuniv.com',
  password: 'Test123456!',
};

test.describe('Authentification', () => {
  test.describe('Page de connexion', () => {
    test('devrait afficher le formulaire de connexion', async ({ page }) => {
      await page.goto('/login');

      // Attendre que la page charge
      await page.waitForLoadState('networkidle');

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

      // Vérifier qu'on est bien connecté - le simple fait d'être sur /dashboard suffit
      await page.waitForLoadState('networkidle');
    });

    test('devrait afficher une erreur avec des identifiants invalides', async ({ page }) => {
      await page.goto('/login');

      // Remplir avec des identifiants invalides
      await page.locator('#email').fill('invalid@test.com');
      await page.locator('#password').fill('wrongpassword');

      // Soumettre
      await page.getByRole('button', { name: 'Se connecter' }).click();

      // Attendre un peu pour que l'API réponde
      await page.waitForTimeout(3000);

      // Vérifier qu'on reste sur la page de login (pas de redirection = erreur)
      await expect(page).toHaveURL(/\/login/);

      // Optionnel: vérifier qu'il y a un élément d'erreur visible
      const errorIndicator = page.locator('div[class*="red"], .error, [role="alert"]');
      const hasError = await errorIndicator.count() > 0;
      expect(hasError).toBe(true);
    });

    test('devrait avoir un lien vers la page d\'inscription', async ({ page }) => {
      await page.goto('/login');

      // Vérifier le lien vers l'inscription (le texte est "Créer un compte")
      const registerLink = page.getByRole('link', { name: /créer un compte/i });
      await expect(registerLink).toBeVisible();

      // Vérifier que le lien pointe vers /register
      await expect(registerLink).toHaveAttribute('href', '/register');
    });
  });

  test.describe('Page d\'inscription', () => {
    test('devrait afficher le formulaire d\'inscription', async ({ page }) => {
      await page.goto('/register');

      // Attendre que la page charge
      await page.waitForLoadState('networkidle');

      // Vérifier les champs essentiels (IDs corrects: first_name, last_name, email, password)
      await expect(page.locator('#first_name')).toBeVisible();
      await expect(page.locator('#last_name')).toBeVisible();
      await expect(page.locator('#email')).toBeVisible();
      await expect(page.locator('#password')).toBeVisible();
    });

    test('devrait avoir un lien vers la page de connexion', async ({ page }) => {
      await page.goto('/register');

      // Vérifier le lien vers la connexion (le texte est "Se connecter")
      const loginLink = page.getByRole('link', { name: /se connecter/i });
      await expect(loginLink).toBeVisible();

      // Vérifier que le lien pointe vers /login
      await expect(loginLink).toHaveAttribute('href', '/login');
    });
  });
});
