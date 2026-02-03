# Tests E2E OrientUniv

Tests end-to-end pour la plateforme OrientUniv utilisant Playwright.

## 📋 Structure des tests

```
tests/
├── home.spec.ts       # Tests de la page d'accueil
├── auth.spec.ts       # Tests d'authentification (login/register)
├── riasec.spec.ts     # Tests du parcours test RIASEC
├── programs.spec.ts   # Tests de la page programmes
└── README.md          # Cette documentation
```

## 🚀 Lancer les tests

### Tous les tests

```bash
npm test
```

### Tests avec interface visuelle

```bash
npm run test:headed
```

### Tests avec UI interactive

```bash
npm run test:ui
```

### Tests par navigateur

```bash
# Chrome uniquement
npm run test:chromium

# Firefox uniquement
npm run test:firefox

# Safari (WebKit) uniquement
npm run test:webkit

# Mobile seulement
npm run test:mobile
```

### Mode debug

```bash
npm run test:debug
```

### Voir le rapport HTML

```bash
npm run report
```

## 📝 Tests disponibles

### Page d'accueil (`home.spec.ts`)
- ✅ Affichage du titre OrientUniv
- ✅ Navigation et liens
- ✅ Bouton de connexion
- ✅ Responsive design

### Authentification (`auth.spec.ts`)
- ✅ Formulaire de connexion
- ✅ Validation des identifiants
- ✅ Formulaire d'inscription
- ✅ Validation des champs requis
- ✅ Navigation entre login/register

### Test RIASEC (`riasec.spec.ts`)
- ✅ Page d'introduction
- ✅ Navigation vers le questionnaire
- ✅ Affichage des questions
- ✅ Navigation entre questions
- ✅ Sauvegarde de la progression
- ✅ Affichage des résultats
- ✅ Téléchargement PDF
- ✅ Recommandations de programmes

### Programmes (`programs.spec.ts`)
- ✅ Liste des programmes
- ✅ Filtres de recherche
- ✅ Filtres par niveau (Licence, Master, Ingénieur)
- ✅ Pagination
- ✅ Page de détail d'un programme
- ✅ Responsive design

## ⚙️ Configuration

La configuration Playwright se trouve dans `playwright.config.ts` à la racine du projet.

### Navigateurs testés

- Chrome/Chromium (Desktop)
- Firefox (Desktop)
- Safari/WebKit (Desktop)
- Chrome Mobile (Pixel 5)
- Safari Mobile (iPhone 12)

### Serveur de développement

Les tests démarrent automatiquement le serveur frontend sur `http://localhost:3000` avant l'exécution.

## 📊 Rapports

Après chaque exécution, un rapport HTML est généré dans `playwright-report/`.

## 🐛 Debugging

### Traces

En cas d'échec, des traces sont automatiquement enregistrées et peuvent être visualisées:

```bash
npx playwright show-trace trace.zip
```

### Screenshots et vidéos

Les screenshots et vidéos sont conservés uniquement en cas d'échec et se trouvent dans `test-results/`.

## 🔧 Prérequis

- Node.js installé
- Serveurs frontend et backend fonctionnels
- Base de données avec données de test

## 📚 Ressources

- [Documentation Playwright](https://playwright.dev/)
- [Guide de test Playwright](https://playwright.dev/docs/writing-tests)
- [Best practices Playwright](https://playwright.dev/docs/best-practices)

## 🚧 TODO

- [ ] Ajouter des tests pour le profil utilisateur
- [ ] Ajouter des tests pour les recommandations
- [ ] Ajouter des tests pour les notes académiques
- [ ] Ajouter des tests pour les valeurs professionnelles
- [ ] Tests de performance
- [ ] Tests d'accessibilité
