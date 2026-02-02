# 🚀 OrientUniv - Guide de Migration vers Supabase

Ce guide vous explique comment migrer votre base de données OrientUniv vers Supabase avec les meilleures pratiques pour une application fluide, sécurisée et facile à déployer.

## 📋 Table des Matières

1. [Pourquoi Supabase?](#pourquoi-supabase)
2. [Prérequis](#prérequis)
3. [Étape 1: Créer un Projet Supabase](#étape-1-créer-un-projet-supabase)
4. [Étape 2: Configurer la Base de Données](#étape-2-configurer-la-base-de-données)
5. [Étape 3: Configurer l'Application Backend](#étape-3-configurer-lapplication-backend)
6. [Étape 4: Migrer les Données Existantes](#étape-4-migrer-les-données-existantes)
7. [Étape 5: Tester la Migration](#étape-5-tester-la-migration)
8. [Étape 6: Déploiement](#étape-6-déploiement)
9. [Meilleures Pratiques](#meilleures-pratiques)
10. [Troubleshooting](#troubleshooting)

---

## 🎯 Pourquoi Supabase?

### Avantages de Supabase pour OrientUniv

✅ **Base de données PostgreSQL gérée** - Pas besoin de gérer l'infrastructure
✅ **Row Level Security (RLS)** - Sécurité au niveau des lignes
✅ **API REST automatique** - Endpoints générés automatiquement
✅ **Authentification intégrée** - Système d'auth complet
✅ **Temps réel** - Subscriptions aux changements de données
✅ **Storage** - Stockage de fichiers intégré
✅ **Scaling automatique** - Adapté aux croissances rapides
✅ **Gratuit pour commencer** - Plan gratuit généreux
✅ **Déploiement facile** - Un clic pour mettre en production

---

## 📦 Prérequis

- [ ] Compte Supabase ([https://supabase.com](https://supabase.com))
- [ ] Python 3.10+
- [ ] pip (gestionnaire de paquets Python)
- [ ] Accès à votre base de données actuelle (SQLite)

---

## 🔧 Étape 1: Créer un Projet Supabase

### 1.1 Inscription/Connexion

1. Allez sur [https://supabase.com](https://supabase.com)
2. Cliquez sur "Start your project"
3. Connectez-vous avec GitHub, Google, ou email

### 1.2 Créer un Nouveau Projet

1. Cliquez sur "New Project"
2. Sélectionnez votre organisation (ou créez-en une)
3. Remplissez les informations:
   - **Name**: `orientcam-production` (ou `orientcam-dev` pour développement)
   - **Database Password**: Générez un mot de passe fort (GARDEZ-LE EN SÉCURITÉ!)
   - **Region**: Choisissez la région la plus proche (ex: `Europe (Paris)` pour la France/Cameroun)
   - **Plan**: Commencez avec le plan gratuit

4. Cliquez sur "Create new project"

⏱️ *Attendez 2-3 minutes que le projet soit initialisé*

### 1.3 Récupérer les Credentials

Une fois le projet créé, allez dans **Project Settings > API**:

Notez ces valeurs (vous en aurez besoin):
- ✅ **Project URL**: `https://[votre-project-ref].supabase.co`
- ✅ **anon/public key**: `eyJhbG...` (clé publique)
- ✅ **service_role key**: `eyJhbG...` (clé secrète - NE JAMAIS EXPOSER!)

Allez dans **Project Settings > Database**:
- ✅ **Connection string**: `postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`

---

## 💾 Étape 2: Configurer la Base de Données

### 2.1 Exécuter le Script de Migration

1. Ouvrez le **SQL Editor** dans votre projet Supabase
2. Créez une nouvelle requête
3. Copiez tout le contenu de `supabase_migration.sql`
4. Cliquez sur "Run" pour exécuter

✅ *Toutes les tables seront créées avec leurs contraintes et indexes*

### 2.2 Configurer Row Level Security (RLS)

1. Dans le **SQL Editor**, créez une nouvelle requête
2. Copiez tout le contenu de `supabase_rls_policies.sql`
3. Cliquez sur "Run" pour exécuter

✅ *Toutes les politiques de sécurité seront activées*

### 2.3 Charger les Données de Base (RIASEC)

Dans le **SQL Editor**, exécutez:

```sql
-- Insérer les dimensions RIASEC
INSERT INTO public.riasec_dimensions (id, code, name, description, color) VALUES
('r-uuid', 'R', 'Réaliste', 'Personnes qui aiment travailler avec des objets, des machines ou des outils', '#3B82F6'),
('i-uuid', 'I', 'Investigateur', 'Personnes analytiques qui aiment résoudre des problèmes', '#8B5CF6'),
('a-uuid', 'A', 'Artistique', 'Personnes créatives qui s''expriment par l''art', '#EC4899'),
('s-uuid', 'S', 'Social', 'Personnes qui aiment aider et enseigner aux autres', '#10B981'),
('e-uuid', 'E', 'Entreprenant', 'Personnes qui aiment diriger et persuader', '#F59E0B'),
('c-uuid', 'C', 'Conventionnel', 'Personnes organisées qui aiment les données et les détails', '#6366F1');
```

---

## ⚙️ Étape 3: Configurer l'Application Backend

### 3.1 Installer les Dépendances Supabase

```bash
cd backend
pip install -r requirements.supabase.txt
```

### 3.2 Configurer les Variables d'Environnement

1. Copiez le fichier exemple:
```bash
cp .env.supabase.example .env
```

2. Modifiez `.env` avec vos credentials:

```env
# Application
APP_NAME=OrientUniv API
DEBUG=True

# Supabase Database
DATABASE_URL=postgresql://postgres:[VOTRE-MOT-DE-PASSE]@db.[VOTRE-PROJECT-REF].supabase.co:5432/postgres

# Supabase Settings
SUPABASE_URL=https://[VOTRE-PROJECT-REF].supabase.co
SUPABASE_ANON_KEY=eyJhbG...
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...

# Security
SECRET_KEY=générez-une-clé-secrète-forte-ici
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# CORS
CORS_ORIGINS=http://localhost:3000,https://votre-domaine.com
```

### 3.3 Tester la Connexion

Créez un fichier de test `test_supabase_connection.py`:

```python
from app.core.supabase_client import get_supabase

def test_connection():
    try:
        supabase = get_supabase()
        # Test simple: récupérer les dimensions RIASEC
        result = supabase.table('riasec_dimensions').select('*').execute()
        print(f"✅ Connexion réussie! {len(result.data)} dimensions RIASEC trouvées")
        return True
    except Exception as e:
        print(f"❌ Erreur de connexion: {e}")
        return False

if __name__ == "__main__":
    test_connection()
```

Exécutez:
```bash
python test_supabase_connection.py
```

---

## 📤 Étape 4: Migrer les Données Existantes

### 4.1 Exporter depuis SQLite

Créez `export_sqlite_data.py`:

```python
import sqlite3
import json

def export_data():
    conn = sqlite3.connect('orientcam.db')
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()

    # Exporter les programmes
    cursor.execute("SELECT * FROM programs")
    programs = [dict(row) for row in cursor.fetchall()]

    with open('programs_export.json', 'w', encoding='utf-8') as f:
        json.dump(programs, f, ensure_ascii=False, indent=2)

    print(f"✅ {len(programs)} programmes exportés")

    conn.close()

if __name__ == "__main__":
    export_data()
```

### 4.2 Importer dans Supabase

Créez `import_to_supabase.py`:

```python
import json
from app.core.supabase_client import get_supabase

def import_data():
    supabase = get_supabase()

    # Charger les données exportées
    with open('programs_export.json', 'r', encoding='utf-8') as f:
        programs = json.load(f)

    # Importer les programmes
    for program in programs:
        try:
            supabase.table('programs').insert(program).execute()
            print(f"✅ Programme importé: {program['name']}")
        except Exception as e:
            print(f"❌ Erreur: {e}")

if __name__ == "__main__":
    import_data()
```

---

## 🧪 Étape 5: Tester la Migration

### 5.1 Tests de Base

```bash
# Démarrer le serveur backend
cd backend
uvicorn app.main:app --reload
```

### 5.2 Tests API

Testez ces endpoints:

1. **Authentification**
   ```bash
   curl -X POST http://localhost:8000/api/v1/auth/register \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"Test123!","first_name":"Test","last_name":"User"}'
   ```

2. **Programmes**
   ```bash
   curl http://localhost:8000/api/v1/programs
   ```

3. **Test RIASEC**
   ```bash
   curl http://localhost:8000/api/v1/riasec/questions
   ```

---

## 🌐 Étape 6: Déploiement

### Option 1: Vercel (Frontend) + Supabase (Backend)

**Frontend (Next.js):**
1. Push votre code sur GitHub
2. Connectez Vercel à votre repo
3. Ajoutez les variables d'environnement:
   - `NEXT_PUBLIC_API_URL=https://votre-api.com`

**Backend (FastAPI):**
1. Déployez sur Render, Railway, ou Fly.io
2. Configurez les variables d'environnement
3. La base Supabase est déjà en ligne!

### Option 2: Tout sur Vercel

1. Déployez le frontend sur Vercel
2. Utilisez Vercel Edge Functions pour le backend
3. Connectez à Supabase

---

## 🎯 Meilleures Pratiques

### Sécurité

✅ **Ne jamais exposer** `service_role_key` côté client
✅ **Toujours utiliser** Row Level Security (RLS)
✅ **Valider** toutes les entrées utilisateur
✅ **Utiliser HTTPS** en production
✅ **Activer** 2FA sur votre compte Supabase

### Performance

✅ **Créer des indexes** sur les colonnes fréquemment recherchées
✅ **Utiliser des requêtes sélectives** (ne récupérer que les colonnes nécessaires)
✅ **Mettre en cache** avec Redis si besoin
✅ **Paginer** les résultats longs
✅ **Optimiser** les requêtes N+1

### Monitoring

✅ **Activer** les logs dans Supabase Dashboard
✅ **Surveiller** l'utilisation de la base de données
✅ **Configurer** des alertes pour les limites
✅ **Backup régulier** (Supabase fait des backups automatiques)

---

## 🐛 Troubleshooting

### Erreur: "Connection refused"

**Solution**: Vérifiez que votre IP est autorisée dans Supabase:
- Allez dans Project Settings > Database
- Ajoutez votre IP dans "IP Address"

### Erreur: "Row Level Security policy violation"

**Solution**: Vérifiez que les politiques RLS sont bien configurées:
```sql
-- Voir les politiques d'une table
SELECT * FROM pg_policies WHERE tablename = 'nom_table';
```

### Erreur: "Database connection pool exhausted"

**Solution**: Augmentez le pool de connexions:
```python
# Dans database.py
engine = create_engine(
    settings.DATABASE_URL,
    pool_size=20,  # Augmentez cette valeur
    max_overflow=10
)
```

### Données ne s'affichent pas

**Solution**: Vérifiez les politiques RLS:
```sql
-- Désactiver temporairement RLS pour debug (ATTENTION: Seulement en dev!)
ALTER TABLE public.programs DISABLE ROW LEVEL SECURITY;
```

---

## 📚 Ressources Supplémentaires

- 📖 [Documentation Supabase](https://supabase.com/docs)
- 🎓 [Tutoriels Supabase](https://supabase.com/docs/guides)
- 💬 [Community Discord](https://discord.supabase.com)
- 🐛 [GitHub Issues](https://github.com/supabase/supabase/issues)

---

## ✅ Checklist Finale

Avant de passer en production, vérifiez:

- [ ] Toutes les tables sont créées
- [ ] Les politiques RLS sont activées
- [ ] Les données de test sont importées
- [ ] L'API fonctionne correctement
- [ ] Le frontend se connecte à l'API
- [ ] Les variables d'environnement sont sécurisées
- [ ] Les backups automatiques sont configurés
- [ ] Le monitoring est en place
- [ ] La documentation est à jour

---

## 🎉 Félicitations!

Votre application OrientUniv est maintenant connectée à Supabase avec:
- ✅ Base de données PostgreSQL performante
- ✅ Sécurité au niveau des lignes (RLS)
- ✅ API REST automatique
- ✅ Scaling automatique
- ✅ Prêt pour la production!

**Besoin d'aide?** Consultez la documentation ou ouvrez une issue sur GitHub.
