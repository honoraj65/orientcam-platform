import { Page } from '@playwright/test';

export const TEST_USER = {
  email: 'test@orientuniv.com',
  password: 'Test123456!',
};

/**
 * Se connecter avec l'utilisateur de test
 */
export async function loginAsTestUser(page: Page) {
  await page.goto('/login');

  // Attendre que la page se charge
  await page.waitForLoadState('networkidle');

  // Remplir le formulaire de connexion
  await page.locator('#email').fill(TEST_USER.email);
  await page.locator('#password').fill(TEST_USER.password);

  // Soumettre et attendre la redirection
  await page.getByRole('button', { name: 'Se connecter' }).click();

  // Attendre la redirection vers le dashboard avec un timeout plus long
  await page.waitForURL('/dashboard', { timeout: 30000 });

  // Attendre que le dashboard soit complètement chargé
  await page.waitForLoadState('networkidle');
}

/**
 * Naviguer vers une URL protégée avec re-login automatique si nécessaire
 */
export async function gotoProtected(page: Page, url: string) {
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
  await page.waitForLoadState('domcontentloaded', { timeout: 45000 });

  // Si on se retrouve sur /login, re-login automatiquement
  if (page.url().includes('/login')) {
    await loginAsTestUser(page);
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await page.waitForLoadState('domcontentloaded', { timeout: 30000 });
  }

  await page.waitForTimeout(2000);
}

/**
 * Vérifier si l'utilisateur est connecté
 */
export async function isLoggedIn(page: Page): Promise<boolean> {
  try {
    // Vérifier la présence d'un élément qui n'existe que si connecté
    const token = await page.evaluate(() => localStorage.getItem('access_token'));
    return !!token;
  } catch {
    return false;
  }
}

/**
 * Se déconnecter
 */
export async function logout(page: Page) {
  await page.evaluate(() => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  });

  await page.goto('/login');
}
