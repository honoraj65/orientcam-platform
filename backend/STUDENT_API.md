# API Student - Documentation

Endpoints pour la gestion du profil étudiant, notes académiques et valeurs professionnelles.

## Authentication Required

Tous les endpoints Student nécessitent un token JWT valide dans le header Authorization:
```
Authorization: Bearer <access_token>
```

## Endpoints

### 1. Profile

#### GET /api/v1/student/profile
Récupérer le profil de l'étudiant connecté.

**Réponse (200):**
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "first_name": "Marie",
  "last_name": "Ngono",
  "phone": "+237612345678",
  "gender": "F",
  "date_of_birth": "2005-03-15",
  "city": "Bertoua",
  "region": "Est",
  "current_education_level": "Terminale",
  "bac_series": "C",
  "bac_year": 2024,
  "bac_grade": 15,
  "max_annual_budget": 500000,
  "financial_aid_eligible": 0,
  "completion_percentage": 85
}
```

#### PUT /api/v1/student/profile
Mettre à jour le profil de l'étudiant.

**Corps de requête:** (tous les champs sont optionnels)
```json
{
  "first_name": "Marie",
  "last_name": "Ngono",
  "phone": "+237612345678",
  "gender": "F",
  "date_of_birth": "2005-03-15",
  "city": "Bertoua",
  "region": "Est",
  "current_education_level": "Terminale",
  "bac_series": "C",
  "bac_year": 2024,
  "bac_grade": 15,
  "max_annual_budget": 500000,
  "financial_aid_eligible": 0
}
```

**Validation:**
- `phone`: Format Cameroun (+237XXXXXXXXX ou 6XXXXXXXX)
- `gender`: M, F, ou Autre
- `date_of_birth`: Âge entre 15 et 100 ans
- `bac_grade`: 0-20
- `bac_year`: 1950 à année courante +1
- `financial_aid_eligible`: 0 ou 1

**Réponse (200):** Profil mis à jour avec `completion_percentage` recalculé

**Calcul du completion_percentage:**
- Informations de base (30%): first_name, last_name, phone, gender, date_of_birth, city, region
- Éducation (30%): current_education_level, bac_series, bac_year, bac_grade
- Finance (10%): max_annual_budget
- Notes académiques (15%): Au moins 5 notes
- Valeurs professionnelles (15%): Évaluation complétée

---

### 2. Academic Grades

#### GET /api/v1/student/grades
Récupérer toutes les notes académiques de l'étudiant.

**Réponse (200):**
```json
[
  {
    "id": "uuid",
    "student_id": "uuid",
    "subject": "Mathématiques",
    "grade": 16,
    "coefficient": 4,
    "academic_year": "2023-2024",
    "term": "Trimestre 1",
    "created_at": "2024-01-15T10:30:00",
    "updated_at": "2024-01-15T10:30:00"
  },
  {
    "id": "uuid",
    "student_id": "uuid",
    "subject": "Physique",
    "grade": 14,
    "coefficient": 3,
    "academic_year": "2023-2024",
    "term": "Trimestre 1",
    "created_at": "2024-01-15T10:31:00",
    "updated_at": "2024-01-15T10:31:00"
  }
]
```

#### POST /api/v1/student/grades
Créer une nouvelle note académique.

**Corps de requête:**
```json
{
  "subject": "Mathématiques",
  "grade": 16,
  "coefficient": 4,
  "academic_year": "2023-2024",
  "term": "Trimestre 1"
}
```

**Validation:**
- `subject`: 2-100 caractères
- `grade`: 0-20
- `coefficient`: 1-10
- `academic_year`: Format YYYY-YYYY (années consécutives, entre 2000 et année courante +1)
- `term`: Max 20 caractères

**Réponse (201):** Note créée

#### PUT /api/v1/student/grades/{grade_id}
Mettre à jour une note existante.

**Corps de requête:** (tous les champs sont optionnels)
```json
{
  "subject": "Mathématiques Appliquées",
  "grade": 17,
  "coefficient": 5
}
```

**Réponse (200):** Note mise à jour

#### DELETE /api/v1/student/grades/{grade_id}
Supprimer une note.

**Réponse (200):**
```json
{
  "message": "Grade deleted successfully"
}
```

---

### 3. Professional Values

#### GET /api/v1/student/values
Récupérer l'évaluation des valeurs professionnelles.

**Réponse (200):**
```json
{
  "id": "uuid",
  "student_id": "uuid",
  "autonomy": 4,
  "creativity": 5,
  "helping_others": 3,
  "job_security": 4,
  "salary": 3,
  "work_life_balance": 5,
  "prestige": 2,
  "variety": 4,
  "created_at": "2024-01-15T10:30:00",
  "updated_at": "2024-01-15T10:30:00"
}
```

**Erreur (404):** Si les valeurs n'existent pas encore

#### POST /api/v1/student/values
Créer l'évaluation des valeurs professionnelles (une seule fois).

**Corps de requête:** (tous les champs requis, échelle 1-5)
```json
{
  "autonomy": 4,
  "creativity": 5,
  "helping_others": 3,
  "job_security": 4,
  "salary": 3,
  "work_life_balance": 5,
  "prestige": 2,
  "variety": 4
}
```

**Signification des valeurs:**
- `autonomy`: Autonomie et indépendance
- `creativity`: Créativité et innovation
- `helping_others`: Aider et soutenir les autres
- `job_security`: Sécurité de l'emploi
- `salary`: Salaire et rémunération
- `work_life_balance`: Équilibre vie pro/perso
- `prestige`: Prestige et reconnaissance sociale
- `variety`: Variété des tâches

**Échelle:**
- 1 = Pas du tout important
- 2 = Peu important
- 3 = Moyennement important
- 4 = Important
- 5 = Très important

**Validation:** Toutes les valeurs doivent être entre 1 et 5

**Réponse (201):** Valeurs créées

**Erreur (400):** Si les valeurs existent déjà (utiliser PUT pour mettre à jour)

#### PUT /api/v1/student/values
Mettre à jour les valeurs professionnelles.

**Corps de requête:** (tous les champs sont optionnels)
```json
{
  "creativity": 4,
  "work_life_balance": 4
}
```

**Réponse (200):** Valeurs mises à jour

**Erreur (404):** Si les valeurs n'existent pas (utiliser POST pour créer)

#### DELETE /api/v1/student/values
Supprimer l'évaluation des valeurs professionnelles.

**Réponse (200):**
```json
{
  "message": "Professional values deleted successfully"
}
```

---

## Exemples avec cURL

### Récupérer le profil

```bash
curl -X GET http://localhost:8000/api/v1/student/profile \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Mettre à jour le profil

```bash
curl -X PUT http://localhost:8000/api/v1/student/profile \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+237612345678",
    "city": "Bertoua",
    "bac_series": "C",
    "bac_grade": 15
  }'
```

### Créer une note

```bash
curl -X POST http://localhost:8000/api/v1/student/grades \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "subject": "Mathématiques",
    "grade": 16,
    "coefficient": 4,
    "academic_year": "2023-2024",
    "term": "Trimestre 1"
  }'
```

### Créer valeurs professionnelles

```bash
curl -X POST http://localhost:8000/api/v1/student/values \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "autonomy": 4,
    "creativity": 5,
    "helping_others": 3,
    "job_security": 4,
    "salary": 3,
    "work_life_balance": 5,
    "prestige": 2,
    "variety": 4
  }'
```

---

## Codes d'Erreur

- `400 Bad Request`: Validation échouée ou valeurs déjà existantes
- `401 Unauthorized`: Token manquant ou invalide
- `403 Forbidden`: Accès réservé aux étudiants
- `404 Not Found`: Ressource non trouvée
- `422 Unprocessable Entity`: Erreur de validation des données

## Flow Typique

1. **S'inscrire/Se connecter** → Obtenir access_token
2. **Compléter le profil** → PUT /student/profile (augmente completion_percentage)
3. **Ajouter des notes** → POST /student/grades (minimum 5 pour profile complet)
4. **Évaluer valeurs** → POST /student/values (compte pour 15% du profil)
5. **Passer le test RIASEC** → (endpoint à venir, compte pour recommandations)

Le `completion_percentage` est automatiquement calculé à chaque mise à jour du profil et affecte la qualité des recommandations.
