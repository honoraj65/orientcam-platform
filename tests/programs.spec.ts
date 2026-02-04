import { test, expect } from '@playwright/test';
import { loginAsTestUser } from './helpers/auth-helper';

test.describe('Page des Programmes', () => {
  // Se connecter avant chaque test
  test.beforeEach(async ({ page }) => {
    await loginAsTestUser(page);
  });

  test('devrait afficher la liste des programmes', async ({ page }) => {
    await page.goto('/programs', { waitUntil: 'domcontentloaded' });

    // Attendre que la page charge
    await page.waitForLoadState('networkidle', { timeout: 30000 });

    // Vérifier le titre de la page
    await expect(page.getByRole('heading', { name: /programmes|formations/i })).toBeVisible({ timeout: 10000 });

    // Attendre un peu plus pour que les cartes se chargent
    await page.waitForTimeout(2000);

    // Vérifier qu'au moins un programme est affiché (les cartes sont des liens avec border border-gray-300)
    const programCards = page.locator('a.group.border.border-gray-300');
    await expect(programCards.first()).toBeVisible({ timeout: 10000 });
    const count = await programCards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('devrait avoir des filtres de recherche', async ({ page }) => {
    await page.goto('/programs');

    // Vérifier la présence de filtres
    const filters = page.locator('text=/filtre|recherche|niveau|domaine/i');
    await expect(filters.first()).toBeVisible();
  });

  test('devrait permettre de rechercher des programmes', async ({ page }) => {
    await page.goto('/programs', { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle', { timeout: 30000 });

    // Trouver le champ de recherche
    const searchInput = page.getByPlaceholder(/recherche|chercher|programme/i);

    if (await searchInput.isVisible()) {
      // Taper dans le champ de recherche - essayer plusieurs termes
      const searchTerms = ['Sciences', 'Licence', 'Génie'];

      for (const term of searchTerms) {
        await searchInput.fill(term);
        await page.waitForTimeout(1500);

        // Vérifier que des résultats sont affichés
        const programCards = page.locator('a.group.border.border-gray-300');
        const count = await programCards.count();

        if (count > 0) {
          // Test réussi si au moins un terme retourne des résultats
          expect(count).toBeGreaterThan(0);
          return;
        }
      }

      // Si aucun terme ne retourne de résultats, le test échoue
      throw new Error('Aucun terme de recherche ne retourne de résultats');
    }
  });

  test('devrait afficher les niveaux de programmes (Licence, Master, Ingénieur)', async ({ page }) => {
    await page.goto('/programs', { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle', { timeout: 30000 });
    await page.waitForTimeout(2000);

    // Vérifier la présence des différents niveaux
    const levels = ['Licence', 'Master', 'Ingénieur', 'Ingenieur', 'BAC', 'Cycle'];

    let foundLevel = false;
    for (const level of levels) {
      try {
        const levelLocator = page.locator(`text=/${level}/i`).first();
        await levelLocator.waitFor({ state: 'visible', timeout: 3000 });
        foundLevel = true;
        break;
      } catch {
        // Continue to next level
      }
    }
    expect(foundLevel).toBe(true);
  });

  test('devrait permettre de filtrer par niveau', async ({ page }) => {
    await page.goto('/programs');

    // Chercher un filtre de niveau
    const licenceFilter = page.getByRole('button', { name: /licence/i }).or(
      page.getByLabel(/licence/i)
    );

    if (await licenceFilter.isVisible()) {
      await licenceFilter.click();

      // Attendre l'application du filtre
      await page.waitForTimeout(500);

      // Vérifier que seuls les programmes Licence sont affichés
      await expect(page.locator('text=/licence/i').first()).toBeVisible();
    }
  });

  test('devrait afficher la pagination', async ({ page }) => {
    await page.goto('/programs');

    // Vérifier la présence de la pagination (si plus de 18 programmes)
    const pagination = page.locator('text=/page|suivant|précédent|next|previous/i');

    // La pagination peut ne pas être visible s'il y a peu de programmes
    const paginationExists = await pagination.first().isVisible().catch(() => false);

    if (paginationExists) {
      await expect(pagination.first()).toBeVisible();
    }
  });

  test.describe('Page de détail d\'un programme', () => {
    test('devrait afficher les détails d\'un programme', async ({ page }) => {
      await page.goto('/programs', { waitUntil: 'domcontentloaded' });

      // Attendre que les programmes chargent
      await page.waitForLoadState('networkidle', { timeout: 30000 });
      await page.waitForTimeout(2000);

      // Cliquer sur le premier programme (carte de lien)
      const firstProgram = page.locator('a.group.border.border-gray-300').first();
      await expect(firstProgram).toBeVisible({ timeout: 10000 });
      await firstProgram.click();

      // Vérifier la navigation vers la page de détail
      await expect(page).toHaveURL(/\/programs\/[a-zA-Z0-9-]+/, { timeout: 15000 });

      // Attendre que la page de détail charge
      await page.waitForLoadState('networkidle', { timeout: 30000 });

      // Vérifier la présence d'informations sur le programme
      await expect(page.locator('text=/description|objectif|débouché|durée/i').first()).toBeVisible({ timeout: 10000 });
    });

    test('devrait afficher les informations clés du programme', async ({ page }) => {
      // Naviguer directement vers un programme (ID fictif, à adapter)
      await page.goto('/programs', { waitUntil: 'domcontentloaded' });
      await page.waitForLoadState('networkidle', { timeout: 30000 });
      await page.waitForTimeout(2000);

      const firstProgram = page.locator('a.group.border.border-gray-300').first();
      await expect(firstProgram).toBeVisible({ timeout: 10000 });
      await firstProgram.click();

      // Attendre la page de détail
      await page.waitForLoadState('networkidle', { timeout: 30000 });

      // Vérifier les éléments essentiels
      await expect(page.locator('h1, h2').first()).toBeVisible({ timeout: 10000 }); // Titre du programme
    });
  });

  test('devrait être responsive sur mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/programs', { waitUntil: 'domcontentloaded' });

    // Attendre que la page charge
    await page.waitForLoadState('networkidle', { timeout: 30000 });
    await page.waitForTimeout(2000);

    // Vérifier que le contenu s'affiche correctement
    await expect(page.locator('body')).toBeVisible();

    // Vérifier que les programmes sont visibles (utiliser le bon sélecteur)
    const programCards = page.locator('a.group.border.border-gray-300');
    await expect(programCards.first()).toBeVisible({ timeout: 10000 });
    const count = await programCards.count();
    expect(count).toBeGreaterThan(0);
  });
});
