# OrientCam Frontend

[![Next.js](https://img.shields.io/badge/Next.js-15.5.9-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0.0-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7.3-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.17-38bdf8?logo=tailwind-css)](https://tailwindcss.com/)

Plateforme web d'orientation académique et professionnelle pour les étudiants camerounais.

## 📋 Table des Matières

- [Vue d'ensemble](#vue-densemble)
- [Technologies](#technologies)
- [Installation](#installation)
- [Structure du Projet](#structure-du-projet)
- [Fonctionnalités](#fonctionnalités)
- [Routes](#routes)
- [Développement](#développement)
- [Scripts Disponibles](#scripts-disponibles)
- [Déploiement](#déploiement)

## 🎯 Vue d'ensemble

OrientCam est une application web complète qui aide les étudiants camerounais à :
- Découvrir leurs intérêts professionnels via le test RIASEC
- Explorer les programmes universitaires disponibles
- Recevoir des recommandations personnalisées basées sur leur profil
- Prendre des décisions éclairées sur leur orientation académique

## 🛠 Technologies

### Frontend Core
- **Next.js 15.5.9** - Framework React avec App Router
- **React 19.0.0** - Bibliothèque UI
- **TypeScript 5.7.3** - Typage statique
- **Tailwind CSS 3.4.17** - Styling utility-first

### State & Forms
- **Zustand 5.0.3** - State management léger
- **React Hook Form 7.54.2** - Gestion de formulaires
- **Zod 3.24.1** - Validation de schémas

### HTTP & API
- **Axios 1.7.9** - Client HTTP avec intercepteurs

### Utilities
- **@hookform/resolvers** - Intégration RHF + Zod
- **clsx** - Utilitaire de classes CSS

## 🚀 Installation

### Prérequis

- Node.js 18+ et npm
- Backend OrientCam en cours d'exécution (port 8000)

### Étapes

```bash
# Cloner le repository
git clone <repository-url>
cd frontend

# Installer les dépendances
npm install

# Créer le fichier .env.local
cp .env.example .env.local

# Configuration de base
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_NAME=OrientCam
NEXT_PUBLIC_APP_VERSION=1.0.0

# Lancer le serveur de développement
npm run dev
```

L'application sera disponible sur [http://localhost:3000](http://localhost:3000)

## 📁 Structure du Projet

```
frontend/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Groupe de routes auth
│   │   ├── login/                # Page de connexion
│   │   └── register/             # Page d'inscription
│   ├── (dashboard)/              # Groupe de routes dashboard
│   │   ├── dashboard/            # Tableau de bord
│   │   ├── profile/              # Profil étudiant
│   │   │   ├── grades/           # Gestion des notes
│   │   │   └── values/           # Valeurs professionnelles
│   │   ├── test-riasec/          # Test RIASEC
│   │   │   ├── quiz/             # Questionnaire
│   │   │   └── results/          # Résultats
│   │   ├── programs/             # Programmes universitaires
│   │   │   └── [id]/             # Détail programme
│   │   └── recommendations/      # Recommandations
│   ├── about/                    # Page À propos
│   ├── layout.tsx                # Layout racine
│   ├── page.tsx                  # Page d'accueil
│   ├── not-found.tsx             # Page 404
│   └── globals.css               # Styles globaux
├── components/
│   ├── layout/                   # Composants de layout
│   │   └── Footer.tsx            # Footer réutilisable
│   └── ui/                       # Composants UI (futurs)
├── lib/
│   ├── api/                      # Clients API
│   │   ├── client.ts             # Axios instance
│   │   ├── auth.ts               # API Auth
│   │   ├── student.ts            # API Profil
│   │   ├── riasec.ts             # API RIASEC
│   │   ├── programs.ts           # API Programmes
│   │   └── recommendations.ts    # API Recommandations
│   └── store/                    # Stores Zustand
│       └── authStore.ts          # Store auth
├── public/                       # Assets statiques
├── .env.local                    # Variables d'environnement
├── next.config.ts                # Configuration Next.js
├── tailwind.config.ts            # Configuration Tailwind
├── tsconfig.json                 # Configuration TypeScript
└── package.json                  # Dépendances
```

## ✨ Fonctionnalités

### 1. Authentification
- [x] Inscription avec validation forte
- [x] Connexion avec JWT
- [x] Auto-refresh des tokens
- [x] Protection des routes
- [x] Déconnexion

### 2. Profil Étudiant
- [x] Formulaire de profil complet
- [x] Gestion CRUD des notes académiques
- [x] Évaluation des valeurs professionnelles
- [x] Calcul de progression (%)
- [x] Validation contextualisée (Cameroun)

### 3. Test RIASEC
- [x] Page de présentation
- [x] Questionnaire de 30 questions
- [x] Barre de progression
- [x] Navigation entre questions
- [x] Résultats détaillés avec Holland Code
- [x] Recommandations de carrières

### 4. Programmes Universitaires
- [x] Liste avec filtres avancés
- [x] Recherche par mots-clés
- [x] Page de détail complète
- [x] Score de compatibilité personnalisé
- [x] Décomposition des critères

### 5. Recommandations
- [x] Génération basée sur 5 critères
- [x] Classement par score
- [x] Explications détaillées
- [x] Points forts et faiblesses

### 6. Pages Utilitaires
- [x] Page À propos
- [x] Footer réutilisable
- [x] Page 404 personnalisée
- [x] Design responsive mobile-first

## 🛣 Routes

### Publiques
```
/                   Landing page
/about              À propos
/login              Connexion
/register           Inscription
```

### Protégées (Auth requise)
```
/dashboard                      Tableau de bord
/profile                        Profil principal
/profile/grades                 Notes académiques
/profile/values                 Valeurs professionnelles
/test-riasec                    Présentation test
/test-riasec/quiz               Questionnaire
/test-riasec/results            Résultats
/programs                       Liste programmes
/programs/[id]                  Détail programme
/recommendations                Recommandations
```

## 👨‍💻 Développement

### Conventions de Code

**TypeScript**:
- Utiliser les types explicites
- Éviter `any`, préférer `unknown`
- Interfaces pour les objets complexes

**React**:
- Composants fonctionnels avec hooks
- Props destructurées
- Noms de composants en PascalCase

**Styling**:
- Tailwind CSS utility-first
- Classes custom dans `globals.css`
- Mobile-first responsive

### Structure d'un Composant

```typescript
'use client'; // Si nécessaire (state, effects, etc.)

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Props {
  id: string;
  name: string;
}

export default function MyComponent({ id, name }: Props) {
  const router = useRouter();
  const [state, setState] = useState<Type>(initialValue);

  useEffect(() => {
    // Side effects
  }, [dependencies]);

  const handleAction = () => {
    // Logic
  };

  return (
    <div className="container-mobile">
      {/* JSX */}
    </div>
  );
}
```

### API Client Pattern

```typescript
// lib/api/myApi.ts
import apiClient from './client';

export interface MyType {
  id: string;
  name: string;
}

export const myAPI = {
  getAll: async (): Promise<MyType[]> => {
    const response = await apiClient.get('/api/v1/my-endpoint');
    return response.data;
  },

  create: async (data: CreateData): Promise<MyType> => {
    const response = await apiClient.post('/api/v1/my-endpoint', data);
    return response.data;
  },
};
```

## 📜 Scripts Disponibles

```bash
# Développement
npm run dev              # Démarrer le serveur de développement

# Build
npm run build            # Build de production
npm start                # Démarrer le serveur de production

# Linting
npm run lint             # Vérifier les erreurs ESLint

# Type Checking
npx tsc --noEmit         # Vérifier les erreurs TypeScript
```

## 🎨 Design System

### Couleurs RIASEC

```typescript
riasec: {
  realistic: '#2563EB',      // Bleu
  investigative: '#7C3AED',  // Violet
  artistic: '#EC4899',       // Rose
  social: '#10B981',         // Vert
  enterprising: '#F59E0B',   // Orange
  conventional: '#6B7280',   // Gris
}
```

### Classes Utilitaires

```css
.container-mobile        /* Container responsive mobile-first */
.btn                     /* Bouton de base */
.btn-primary             /* Bouton principal */
.btn-outline             /* Bouton outline */
.card                    /* Carte de contenu */
.input                   /* Input de formulaire */
```

### Breakpoints

```typescript
sm: '640px'   // Petits écrans
md: '768px'   // Tablettes
lg: '1024px'  // Ordinateurs
xl: '1280px'  // Grands écrans
```

## 🚢 Déploiement

### Vercel (Recommandé)

```bash
# Installer Vercel CLI
npm i -g vercel

# Déployer
vercel

# Production
vercel --prod
```

### Variables d'Environnement

Configurer dans le dashboard Vercel :
```
NEXT_PUBLIC_API_URL=https://api.orientcam.com
NEXT_PUBLIC_APP_NAME=OrientCam
NEXT_PUBLIC_APP_VERSION=1.0.0
```

### Build Manual

```bash
# Build
npm run build

# Les fichiers statiques sont dans .next/
# Déployer sur n'importe quel hébergeur Node.js
```

## 📊 Performances

- **Bundle Size**: Optimisé avec tree-shaking
- **Images**: Utiliser `next/image` pour l'optimisation
- **Fonts**: Inter font optimisé avec `next/font`
- **Code Splitting**: Automatique par route
- **Lazy Loading**: Composants dynamiques si nécessaire

## 🔒 Sécurité

- Tokens JWT stockés dans localStorage
- Auto-refresh des tokens expirés
- Protection CSRF avec tokens
- Validation côté client ET serveur
- HTTPS en production obligatoire

## 🤝 Contribution

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📝 License

© 2024 OrientCam. Université de Bertoua. Tous droits réservés.

## 📞 Contact

Pour toute question ou support, contactez l'équipe OrientCam à l'Université de Bertoua.

---

**Fait avec ❤️ au Cameroun**
