# OrientUniv API - Backend

API backend pour la plateforme d'orientation académique et professionnelle de l'Université de Bertoua.

## Stack Technique

- **Framework**: FastAPI
- **Base de données**: SQLite (dev) / PostgreSQL (prod)
- **ORM**: SQLAlchemy
- **Migrations**: Alembic
- **Cache**: Redis
- **Authentification**: JWT (python-jose)
- **Validation**: Pydantic

## Structure du Projet

```
backend/
├── app/
│   ├── core/           # Configuration, database, security
│   ├── models/         # SQLAlchemy models (12 tables)
│   ├── schemas/        # Pydantic schemas
│   ├── api/            # API endpoints
│   ├── db/             # Migrations et seeds
│   │   ├── migrations/ # Alembic migrations
│   │   └── seeds/      # Données initiales (RIASEC, programmes)
│   └── main.py         # Application FastAPI
├── alembic.ini         # Configuration Alembic
├── requirements.txt    # Dépendances Python
├── .env               # Variables d'environnement
└── orientcam.db       # Base de données SQLite (dev)
```

## Installation

### Option 1: Docker (Recommandé)

**Prérequis**: Docker Desktop installé

```bash
# Démarrer tous les services (PostgreSQL + Redis + API)
docker-compose up -d

# Vérifier les logs
docker-compose logs -f api

# Arrêter les services
docker-compose down

# Arrêter et supprimer les volumes
docker-compose down -v
```

L'API sera accessible sur `http://localhost:8000`
- Documentation interactive: `http://localhost:8000/docs`
- PostgreSQL: `localhost:5432`
- Redis: `localhost:6379`

### Option 2: Installation Locale

1. **Installer les dépendances**:
```bash
pip install -r requirements.txt
```

2. **Configurer les variables d'environnement**:
```bash
cp .env.example .env
# Modifier .env avec vos paramètres
```

3. **Initialiser la base de données**:
```bash
python -m app.db.init_db
```

Cette commande va:
- Exécuter les migrations Alembic (créer les 15 tables)
- Charger les données de référence:
  - 6 dimensions RIASEC (R, I, A, S, E, C)
  - 30 questions RIASEC
  - 3 programmes pilotes (Informatique, Mathématiques, Gestion)
  - 16 matières associées

## Commandes Utiles

### Docker

```bash
# Démarrer les services
docker-compose up -d

# Voir les logs en temps réel
docker-compose logs -f

# Redémarrer un service
docker-compose restart api

# Entrer dans un conteneur
docker-compose exec api bash
docker-compose exec postgres psql -U orientcam -d orientcam_db

# Reconstruire après modification du Dockerfile
docker-compose up -d --build

# Nettoyer tout
docker-compose down -v --remove-orphans
```

### Migrations

```bash
# Créer une nouvelle migration
alembic revision --autogenerate -m "description"

# Appliquer les migrations
alembic upgrade head

# Revenir en arrière
alembic downgrade -1

# Dans Docker
docker-compose exec api alembic upgrade head
```

### Développement

```bash
# Lancer le serveur de développement (local)
uvicorn app.main:app --reload

# Lancer avec Docker
docker-compose up api

# Exécuter les tests
pytest

# Dans Docker
docker-compose exec api pytest

# Vérifier la base de données
python -c "from sqlalchemy import inspect; from app.core.database import engine; print(inspect(engine).get_table_names())"
```

## Données Chargées

### RIASEC
- **6 dimensions**: Réaliste, Investigateur, Artistique, Social, Entreprenant, Conventionnel
- **30 questions**: 5 par dimension, contextualisées pour le Cameroun

### Programmes (Pilote)
1. **INFO-L3**: Licence en Informatique (60 places)
2. **MATH-L3**: Licence en Mathématiques (40 places)
3. **GEST-L3**: Licence en Gestion (80 places)

Chaque programme inclut:
- Prérequis (séries bac, note minimale, matières)
- Match RIASEC
- Coûts (inscription, scolarité annuelle)
- Taux d'emploi et salaire moyen
- Liste des matières avec crédits

## Base de Données

### Tables (15)
- `users` - Utilisateurs (étudiants, admins)
- `student_profiles` - Profils étudiants
- `riasec_dimensions` - Dimensions RIASEC
- `riasec_questions` - Questions du test
- `riasec_tests` - Résultats des tests
- `academic_grades` - Notes académiques
- `professional_values` - Valeurs professionnelles
- `programs` - Programmes académiques
- `program_subjects` - Matières des programmes
- `recommendations` - Recommandations générées
- `student_favorites` - Programmes favoris
- `testimonials` - Témoignages
- `notifications` - Notifications
- `activity_logs` - Logs d'activité
- `alembic_version` - Version des migrations

## Prochaines Étapes

1. Implémenter les endpoints Auth (register, login, refresh, logout)
2. Implémenter les endpoints Student (profile, grades, values)
3. Implémenter les endpoints RIASEC (submit test, get results)
4. Implémenter l'algorithme de recommandation
5. Créer le frontend Next.js
