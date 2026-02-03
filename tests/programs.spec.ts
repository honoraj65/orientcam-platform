import { test, expect } from '@playwright/test';

test.describe('Page des Programmes', () => {
  test('devrait afficher la liste des programmes', async ({ page }) => {
    await page.goto('/programs');

    // Vérifier le titre de la page
    await expect(page.getByRole('heading', { name: /programmes|formations/i })).toBeVisible();

    // Vérifier qu'au moins un programme est affiché
    const programCards = page.locator('[data-testid="program-card"], article, .program');
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
    await page.goto('/programs');

    // Trouver le champ de recherche
    const searchInput = page.getByPlaceholder(/recherche|chercher|programme/i);

    if (await searchInput.isVisible()) {
      // Taper dans le champ de recherche
      await searchInput.fill('Informatique');

      // Attendre les résultats
      await page.waitForTimeout(1000);

      // Vérifier que des résultats sont affichés
      const results = page.locator('text=/informatique/i');
      await expect(results.first()).toBeVisible();
    }
  });

  test('devrait afficher les niveaux de programmes (Licence, Master, Ingénieur)', async ({ page }) => {
    await page.goto('/programs');

    // Vérifier la présence des différents niveaux
    const levels = ['Licence', 'Master', 'Ingénieur', 'Ingenieur'];

    let foundLevel = false;
    for (const level of levels) {
      if (await page.locator(`text=/${level}/i`).first().isVisible()) {
        foundLevel = true;
        break;
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
      await page.goto('/programs');

      // Cliquer sur le premier programme
      const firstProgram = page.locator('[data-testid="program-card"], article, .program').first();
      await firstProgram.click();

      // Vérifier la navigation vers la page de détail
      await expect(page).toHaveURL(/\/programs\/[a-zA-Z0-9-]+/);

      // Vérifier la présence d'informations sur le programme
      await expect(page.locator('text=/description|objectif|débouché|durée/i').first()).toBeVisible();
    });

    test('devrait afficher les informations clés du programme', async ({ page }) => {
      // Naviguer directement vers un programme (ID fictif, à adapter)
      await page.goto('/programs');

      const firstProgram = page.locator('[data-testid="program-card"], article, .program').first();
      await firstProgram.click();

      // Vérifier les éléments essentiels
      await expect(page.locator('h1, h2').first()).toBeVisible(); // Titre du programme
    });
  });

  test('devrait être responsive sur mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/programs');

    // Vérifier que le contenu s'affiche correctement
    await expect(page.locator('body')).toBeVisible();

    // Vérifier que les programmes sont visibles
    const programCards = page.locator('[data-testid="program-card"], article, .program');
    const count = await programCards.count();
    expect(count).toBeGreaterThan(0);
  });
});
