# OrientCam Frontend Guide

## Vue d'ensemble

Frontend web responsive de la plateforme OrientCam, construit avec Next.js 15 et React 19. Interface mobile-first pour guider les étudiants camerounais dans leur orientation académique.

## Technologies

- **Framework**: Next.js 15.5.9 (App Router)
- **React**: 19.0.0
- **TypeScript**: 5.7.3
- **Styling**: Tailwind CSS 3.4.17
- **State Management**: Zustand 5.0.3
- **Forms**: React Hook Form 7.54.2 + Zod 3.24.1
- **HTTP Client**: Axios 1.7.9

## Structure du Projet

```
frontend/
├── app/
│   ├── (auth)/                 # Groupe de routes authentification
│   │   ├── login/page.tsx      # Page de connexion
│   │   ├── register/page.tsx   # Page d'inscription
│   │   └── layout.tsx          # Layout auth
│   ├── (dashboard)/            # Groupe de routes dashboard
│   │   ├── dashboard/page.tsx  # Page tableau de bord
│   │   └── layout.tsx          # Layout dashboard
│   ├── layout.tsx              # Layout racine
│   ├── page.tsx                # Page d'accueil
│   └── globals.css             # Styles globaux
├── components/
│   ├── ui/                     # Composants UI réutilisables
│   └── layout/                 # Composants de mise en page
├── lib/
│   ├── api/                    # Clients API
│   │   ├── client.ts           # Instance Axios avec intercepteurs
│   │   └── auth.ts             # API d'authentification
│   └── store/                  # Stores Zustand
│       └── authStore.ts        # Store d'authentification
├── public/
│   └── images/                 # Images statiques
├── tailwind.config.ts          # Configuration Tailwind
├── tsconfig.json               # Configuration TypeScript
└── package.json                # Dépendances npm
```

## Démarrage Rapide

### Prérequis

- Node.js 18+ et npm
- Backend OrientCam en cours d'exécution (port 8000)

### Installation

```bash
cd frontend
npm install
```

### Configuration

Créer `.env.local` :

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_NAME=OrientCam
NEXT_PUBLIC_APP_VERSION=1.0.0
```

### Développement

```bash
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000)

### Build Production

```bash
npm run build
npm start
```

## Pages Implémentées

### 1. Page d'Accueil (`/`)

**Fichier**: `app/page.tsx`

**Fonctionnalités**:
- Hero section avec appel à l'action
- 3 cartes de fonctionnalités (Test RIASEC, Recommandations, Programmes)
- Design responsive mobile-first
- Liens vers Login et Register

**Routes**:
- `/login` - Connexion
- `/register` - Inscription
- `/about` - En savoir plus

### 2. Page de Connexion (`/login`)

**Fichier**: `app/(auth)/login/page.tsx`

**Fonctionnalités**:
- Formulaire email + mot de passe
- Validation avec Zod
- Gestion d'erreurs API
- Loading state pendant authentification
- Redirection automatique vers `/dashboard`
- Stockage des tokens JWT (access + refresh)

**Validation**:
```typescript
- Email: Format email valide
- Password: Requis
```

**Flow**:
1. Utilisateur entre email/password
2. POST `/api/v1/auth/login`
3. Stockage des tokens dans localStorage
4. Fetch profil utilisateur
5. Mise à jour du store Zustand
6. Redirection vers dashboard

### 3. Page d'Inscription (`/register`)

**Fichier**: `app/(auth)/register/page.tsx`

**Fonctionnalités**:
- Formulaire complet (prénom, nom, email, téléphone, mot de passe)
- Validation renforcée avec règles Cameroun
- Vérification de correspondance des mots de passe
- Indication de force du mot de passe
- Liens vers conditions d'utilisation

**Validation**:
```typescript
- Email: Format email valide
- Password:
  * Min 8 caractères
  * 1 majuscule
  * 1 minuscule
  * 1 chiffre
- Confirm Password: Doit correspondre à password
- First Name: Min 2 caractères
- Last Name: Min 2 caractères
- Phone (optionnel): Format Cameroun
  * 6XXXXXXXX ou +2376XXXXXXXX
  * Validation: /^(\+237)?6[0-9]{8}$/
```

**Flow**:
1. Utilisateur remplit le formulaire
2. POST `/api/v1/auth/register`
3. Stockage automatique des tokens
4. Fetch profil utilisateur
5. Redirection vers dashboard

### 4. Page Dashboard (`/dashboard`)

**Fichier**: `app/(dashboard)/dashboard/page.tsx`

**Fonctionnalités**:
- Vérification automatique d'authentification
- Message de bienvenue personnalisé
- Barre de progression du profil
- 3 actions rapides (Test RIASEC, Programmes, Recommandations)
- Prochaines étapes suggérées
- Header avec nom utilisateur et lien profil

**Protection**:
```typescript
useEffect(() => {
  const token = localStorage.getItem('access_token');
  if (!token) {
    router.push('/login');
  }
});
```

**Composants**:
- Header avec logo et profil
- Alerte de complétion de profil (si < 100%)
- Grid de 3 cartes d'actions rapides
- Liste des prochaines étapes

## API Client

### Axios Instance (`lib/api/client.ts`)

**Configuration**:
- Base URL: `process.env.NEXT_PUBLIC_API_URL`
- Timeout: 30 secondes
- Headers: `Content-Type: application/json`

**Intercepteurs**:

**Request Interceptor**:
```typescript
// Ajoute automatiquement le token Bearer
config.headers.Authorization = `Bearer ${localStorage.getItem('access_token')}`;
```

**Response Interceptor**:
```typescript
// Gestion automatique du refresh token
if (status === 401 && !retry) {
  1. POST /api/v1/auth/refresh avec refresh_token
  2. Stocke nouveaux tokens
  3. Réessaie la requête originale
  4. Si échec: Redirection vers /login
}
```

### Auth API (`lib/api/auth.ts`)

**Méthodes**:

```typescript
// Inscription
authAPI.register(data: RegisterData): Promise<AuthResponse>

// Connexion
authAPI.login(data: LoginData): Promise<AuthResponse>

// Profil utilisateur
authAPI.me(): Promise<UserProfile>

// Déconnexion
authAPI.logout(): Promise<void>
```

**Types**:

```typescript
interface AuthResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  user: {
    id: string;
    email: string;
    role: string;
    created_at: string;
  };
}

interface UserProfile {
  id: string;
  email: string;
  role: string;
  created_at: string;
  student_profile?: {
    first_name: string;
    last_name: string;
    phone?: string;
    date_of_birth?: string;
    gender?: string;
    completion_percentage: number;
  };
}
```

## State Management

### Auth Store (`lib/store/authStore.ts`)

Store Zustand pour l'état d'authentification global.

**État**:
```typescript
{
  user: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}
```

**Actions**:

```typescript
// Définir l'utilisateur
setUser(user: UserProfile | null): void

// Définir le chargement
setLoading(loading: boolean): void

// Définir l'erreur
setError(error: string | null): void

// Récupérer le profil utilisateur
fetchUser(): Promise<void>

// Déconnexion
logout(): Promise<void>

// Effacer l'erreur
clearError(): void
```

**Usage**:

```typescript
import { useAuthStore } from '@/lib/store/authStore';

function MyComponent() {
  const { user, isAuthenticated, fetchUser, logout } = useAuthStore();

  // Utiliser l'état et les actions
}
```

## Styling avec Tailwind

### Configuration (`tailwind.config.ts`)

**Couleurs RIASEC**:
```typescript
riasec: {
  realistic: '#2563EB',      // Bleu - Réaliste
  investigative: '#7C3AED',  // Violet - Investigateur
  artistic: '#EC4899',       // Rose - Artistique
  social: '#10B981',         // Vert - Social
  enterprising: '#F59E0B',   // Orange - Entrepreneur
  conventional: '#6B7280',   // Gris - Conventionnel
}
```

**Breakpoints Mobile-First**:
```typescript
sm: '640px'   // Petits écrans
md: '768px'   // Tablettes
lg: '1024px'  // Ordinateurs
xl: '1280px'  // Grands écrans
```

### Classes Utilitaires Personnalisées (`globals.css`)

**Container Mobile**:
```css
.container-mobile {
  @apply w-full px-4 mx-auto;
  max-width: 100%;
}

@screen sm {
  .container-mobile {
    @apply px-6;
    max-width: 640px;
  }
}
```

**Boutons**:
```css
.btn {
  @apply px-4 py-2 rounded-lg font-medium transition-colors;
  @apply focus:outline-none focus:ring-2 focus:ring-offset-2;
}

.btn-primary {
  @apply bg-primary-600 text-white hover:bg-primary-700;
  @apply focus:ring-primary-500;
  @apply disabled:opacity-50 disabled:cursor-not-allowed;
}

.btn-outline {
  @apply border-2 border-primary-600 text-primary-600;
  @apply hover:bg-primary-50;
}
```

**Carte**:
```css
.card {
  @apply bg-white rounded-xl shadow-sm p-6 border border-gray-200;
}
```

**Input**:
```css
.input {
  @apply w-full px-4 py-2.5 border border-gray-300 rounded-lg;
  @apply focus:ring-2 focus:ring-primary-500 focus:border-transparent;
  @apply disabled:bg-gray-50 disabled:cursor-not-allowed;
}
```

## Validation de Formulaires

### React Hook Form + Zod

**Exemple - Login**:

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(1, 'Mot de passe requis'),
});

type LoginFormData = z.infer<typeof loginSchema>;

const {
  register,
  handleSubmit,
  formState: { errors },
} = useForm<LoginFormData>({
  resolver: zodResolver(loginSchema),
});

const onSubmit = async (data: LoginFormData) => {
  // Gérer la soumission
};

<form onSubmit={handleSubmit(onSubmit)}>
  <input {...register('email')} />
  {errors.email && <p>{errors.email.message}</p>}
</form>
```

### Règles de Validation Cameroun

**Téléphone**:
```typescript
z.string().regex(
  /^(\+237)?6[0-9]{8}$/,
  'Numéro invalide (ex: 6XXXXXXXX ou +2376XXXXXXXX)'
)
```

**Mot de Passe Fort**:
```typescript
z.string()
  .min(8, 'Minimum 8 caractères')
  .regex(/[A-Z]/, 'Au moins une majuscule')
  .regex(/[a-z]/, 'Au moins une minuscule')
  .regex(/[0-9]/, 'Au moins un chiffre')
```

**Confirmation de Mot de Passe**:
```typescript
.refine((data) => data.password === data.confirm_password, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirm_password'],
})
```

## Gestion d'Erreurs

### Erreurs API

**Format backend**:
```json
{
  "detail": "Message d'erreur"
}
```

**Gestion frontend**:
```typescript
try {
  await authAPI.login(data);
} catch (err: any) {
  const message = err.response?.data?.detail || 'Erreur générique';
  setError(message);
}
```

### Affichage des Erreurs

**Alerte d'erreur**:
```tsx
{error && (
  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
    {error}
  </div>
)}
```

**Erreurs de champ**:
```tsx
{errors.email && (
  <p className="mt-1 text-sm text-red-600">
    {errors.email.message}
  </p>
)}
```

## Sécurité

### Tokens JWT

**Stockage**:
```typescript
localStorage.setItem('access_token', token);
localStorage.setItem('refresh_token', refreshToken);
```

**Récupération**:
```typescript
const token = localStorage.getItem('access_token');
```

**Suppression (logout)**:
```typescript
localStorage.removeItem('access_token');
localStorage.removeItem('refresh_token');
```

### Protection de Routes

**Vérification côté client**:
```typescript
useEffect(() => {
  const token = localStorage.getItem('access_token');
  if (!token) {
    router.push('/login');
    return;
  }

  if (!user) {
    await fetchUser();
  }
}, [user, router]);

useEffect(() => {
  if (!isLoading && !isAuthenticated) {
    router.push('/login');
  }
}, [isAuthenticated, isLoading, router]);
```

### Refresh Token Automatique

L'intercepteur Axios gère automatiquement:
1. Détecte les erreurs 401
2. Utilise le refresh_token pour obtenir un nouveau access_token
3. Réessaie la requête originale
4. Redirige vers login si le refresh échoue

## Performance

### Next.js Optimisations

- **App Router**: Routing basé sur le système de fichiers
- **Server Components**: Par défaut (sauf avec 'use client')
- **Code Splitting**: Automatique par route
- **Image Optimization**: Utiliser `next/image`
- **Font Optimization**: Inter font avec `next/font/google`

### Client-Side

**Loading States**:
```typescript
const [isSubmitting, setIsSubmitting] = useState(false);

<button disabled={isSubmitting}>
  {isSubmitting ? 'Chargement...' : 'Soumettre'}
</button>
```

**Skeleton Screens**:
```tsx
if (isLoading) {
  return (
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
  );
}
```

## Accessibilité

### Principes

- Labels pour tous les inputs
- Messages d'erreur descriptifs
- Focus visible sur les éléments interactifs
- Contraste de couleurs suffisant
- Navigation au clavier

### Exemple

```tsx
<label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
  Email
</label>
<input
  id="email"
  type="email"
  className="input"
  placeholder="exemple@email.com"
  aria-invalid={errors.email ? 'true' : 'false'}
  aria-describedby={errors.email ? 'email-error' : undefined}
/>
{errors.email && (
  <p id="email-error" className="mt-1 text-sm text-red-600">
    {errors.email.message}
  </p>
)}
```

## Responsive Design

### Mobile-First

Commencer par le design mobile, puis ajouter les breakpoints:

```tsx
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  {/* 1 colonne sur mobile, 3 sur desktop */}
</div>

<div className="text-2xl sm:text-3xl">
  {/* Texte plus petit sur mobile */}
</div>

<div className="hidden sm:inline">
  {/* Caché sur mobile, visible sur desktop */}
</div>
```

### Breakpoints

- **Default (< 640px)**: Mobile
- **sm (≥ 640px)**: Grand mobile / Petit tablette
- **md (≥ 768px)**: Tablette
- **lg (≥ 1024px)**: Desktop
- **xl (≥ 1280px)**: Grand desktop

## Prochaines Étapes

### Pages à Créer

1. **Profil Étudiant** (`/profile`)
   - Formulaire de profil complet
   - Upload de photo
   - Gestion des notes
   - Valeurs professionnelles

2. **Test RIASEC** (`/test-riasec`)
   - Flow de questionnaire (30 questions)
   - Barre de progression
   - Affichage des résultats
   - Holland Code et carrières

3. **Programmes** (`/programs`)
   - Liste avec filtres
   - Recherche
   - Détails de programme
   - Score de compatibilité

4. **Recommandations** (`/recommendations`)
   - Liste personnalisée
   - Explications détaillées
   - Comparaison de programmes

### Fonctionnalités

- [ ] Mode hors ligne (Service Worker)
- [ ] Notifications push
- [ ] Export PDF des résultats
- [ ] Partage sur réseaux sociaux
- [ ] Chat de support
- [ ] Système de favoris

## Scripts Disponibles

```bash
# Développement
npm run dev

# Build production
npm run build

# Démarrer production
npm start

# Linter
npm run lint

# Type checking
npx tsc --noEmit
```

## Dépannage

### Erreur: Cannot find module

```bash
rm -rf node_modules package-lock.json
npm install
```

### Erreur: Port 3000 déjà utilisé

```bash
# Changer le port
PORT=3001 npm run dev
```

### Erreur CORS

Vérifier que le backend autorise `http://localhost:3000` dans `CORS_ORIGINS`.

### Token expiré

L'intercepteur Axios gère automatiquement le refresh. Si problème persistant:
```typescript
localStorage.removeItem('access_token');
localStorage.removeItem('refresh_token');
// Puis reconnexion
```

## Ressources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Zustand](https://zustand-demo.pmnd.rs/)
- [React Hook Form](https://react-hook-form.com/)
- [Zod](https://zod.dev/)

---

**Dernière mise à jour**: 2024-01-XX
**Version**: 1.0.0
