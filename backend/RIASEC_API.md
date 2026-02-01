# API RIASEC - Documentation

Endpoints pour le test d'orientation professionnelle RIASEC (Réaliste, Investigateur, Artistique, Social, Entreprenant, Conventionnel).

## Vue d'Ensemble

Le test RIASEC est un questionnaire de 30 items permettant d'identifier les intérêts professionnels d'un étudiant selon 6 dimensions. Le résultat est un **Holland Code** (code à 3 lettres) indiquant les 3 dimensions dominantes.

## Endpoints

### 1. GET /api/v1/riasec/questions
Récupérer les questions du test RIASEC.

**Authentication:** Non requise (test public)

**Réponse (200):**
```json
{
  "version": "1.0",
  "dimensions": [
    {
      "code": "R",
      "name": "Réaliste",
      "description": "Préfère les activités concrètes, techniques et manuelles",
      "color": "#2563EB"
    },
    {
      "code": "I",
      "name": "Investigateur",
      "description": "Aime analyser, chercher, comprendre et résoudre des problèmes",
      "color": "#7C3AED"
    }
    // ... 4 autres dimensions (A, S, E, C)
  ],
  "questions": [
    {
      "id": "uuid",
      "dimension_id": "uuid",
      "question_number": 1,
      "text": "J'aimerais réparer des ordinateurs, téléphones ou autres appareils électroniques",
      "reverse_scored": false
    }
    // ... 29 autres questions
  ],
  "answer_scale": {
    "1": "Pas du tout d'accord",
    "2": "Peu d'accord",
    "3": "Moyennement d'accord",
    "4": "D'accord",
    "5": "Tout à fait d'accord"
  }
}
```

---

### 2. POST /api/v1/riasec/submit
Soumettre les réponses au test RIASEC.

**Authentication:** Requise (étudiant)

**Corps de requête:**
```json
{
  "answers": [
    {
      "question_number": 1,
      "answer": 4
    },
    {
      "question_number": 2,
      "answer": 3
    }
    // ... exactement 30 réponses (questions 1 à 30)
  ],
  "duration_seconds": 450
}
```

**Validation:**
- Exactement 30 réponses requises
- Chaque question (1-30) doit être répondue exactement une fois
- `answer`: 1-5 (échelle de Likert)
- `duration_seconds`: Optionnel, 60-7200 secondes

**Réponse (201):**
```json
{
  "test_id": "uuid",
  "scores": {
    "realistic": 75,
    "investigative": 85,
    "artistic": 45,
    "social": 60,
    "enterprising": 50,
    "conventional": 40
  },
  "holland_code": "IRS",
  "interpretations": [
    {
      "dimension_code": "I",
      "dimension_name": "Investigateur",
      "score": 85,
      "description": "Personnes curieuses qui aiment observer, analyser, résoudre des problèmes...",
      "typical_careers": [
        "Chercheur scientifique",
        "Médecin",
        "Pharmacien",
        "Biologiste",
        "Mathématicien"
      ],
      "color": "#7C3AED"
    },
    {
      "dimension_code": "R",
      "dimension_name": "Réaliste",
      "score": 75,
      "description": "Personnes qui préfèrent les activités concrètes, techniques et manuelles...",
      "typical_careers": [
        "Ingénieur civil",
        "Technicien informatique",
        "Électricien",
        "Mécanicien",
        "Agriculteur"
      ],
      "color": "#2563EB"
    },
    {
      "dimension_code": "S",
      "dimension_name": "Social",
      "score": 60,
      "description": "Personnes bienveillantes qui aiment aider, enseigner...",
      "typical_careers": [
        "Enseignant",
        "Infirmier",
        "Psychologue",
        "Travailleur social",
        "Conseiller d'orientation"
      ],
      "color": "#10B981"
    }
  ],
  "created_at": "2024-01-15T10:30:00"
}
```

**Calcul des Scores:**
- Chaque dimension a 5 questions
- Score brut = somme des réponses (5-25)
- Score final = (score_brut / 25) × 100 = 0-100%

**Holland Code:**
- Code à 3 lettres formé des 3 dimensions les plus fortes
- Exemple: "IRS" = Investigateur (1er), Réaliste (2e), Social (3e)

---

### 3. GET /api/v1/riasec/results/latest
Récupérer le dernier résultat du test RIASEC.

**Authentication:** Requise (étudiant)

**Réponse (200):** Même format que POST /submit

**Erreur (404):** Aucun test trouvé

---

### 4. GET /api/v1/riasec/results/history
Récupérer l'historique des tests RIASEC.

**Authentication:** Requise (étudiant)

**Réponse (200):**
```json
[
  {
    "id": "uuid",
    "holland_code": "IRS",
    "realistic_score": 75,
    "investigative_score": 85,
    "artistic_score": 45,
    "social_score": 60,
    "enterprising_score": 50,
    "conventional_score": 40,
    "duration_seconds": 450,
    "created_at": "2024-01-15T10:30:00"
  },
  {
    "id": "uuid",
    "holland_code": "IRE",
    "realistic_score": 70,
    "investigative_score": 80,
    "artistic_score": 40,
    "social_score": 55,
    "enterprising_score": 65,
    "conventional_score": 35,
    "duration_seconds": 380,
    "created_at": "2023-12-10T14:20:00"
  }
]
```

---

### 5. GET /api/v1/riasec/careers/{holland_code}
Récupérer les métiers correspondant à un Holland Code.

**Authentication:** Non requise

**Paramètres:**
- `holland_code`: 1-3 lettres (R, I, A, S, E, C)
  - 1 lettre: Dimension principale uniquement
  - 2-3 lettres: Combinaison de dimensions

**Exemple:** `GET /api/v1/riasec/careers/IRS`

**Réponse (200):**
```json
{
  "holland_code": "IRS",
  "matching_careers": [
    "Chercheur scientifique",
    "Médecin",
    "Pharmacien",
    "Biologiste",
    "Mathématicien",
    "Statisticien",
    "Vétérinaire",
    "Chimiste"
  ],
  "partially_matching_careers": [
    "Ingénieur civil",
    "Technicien informatique",
    "Électricien",
    "Enseignant",
    "Infirmier",
    "Psychologue"
  ],
  "description": "Personnes curieuses qui aiment observer, analyser, résoudre des problèmes et comprendre les phénomènes. Elles préfèrent la réflexion à l'action."
}
```

**Erreur (400):** Holland Code invalide

---

## Les 6 Dimensions RIASEC

### R - Réaliste (Bleu #2563EB)
**Profil:** Pratique, technique, concret

**Caractéristiques:**
- Aime travailler avec des outils et machines
- Préfère les activités physiques et manuelles
- Valorise le concret et le tangible

**Métiers typiques:** Ingénieur, Technicien, Mécanicien, Agriculteur, Pilote

---

### I - Investigateur (Violet #7C3AED)
**Profil:** Intellectuel, analytique, curieux

**Caractéristiques:**
- Aime observer, analyser, comprendre
- Préfère la réflexion à l'action
- Valorise la connaissance et la science

**Métiers typiques:** Chercheur, Médecin, Pharmacien, Biologiste, Mathématicien

---

### A - Artistique (Rose #EC4899)
**Profil:** Créatif, original, expressif

**Caractéristiques:**
- Aime créer et s'exprimer
- Préfère l'innovation à la routine
- Valorise l'esthétique et l'originalité

**Métiers typiques:** Graphiste, Designer, Musicien, Journaliste, Architecte d'intérieur

---

### S - Social (Vert #10B981)
**Profil:** Bienveillant, empathique, altruiste

**Caractéristiques:**
- Aime aider et enseigner
- Préfère le travail d'équipe
- Valorise les relations humaines

**Métiers typiques:** Enseignant, Infirmier, Psychologue, Travailleur social, Éducateur

---

### E - Entreprenant (Orange #F59E0B)
**Profil:** Ambitieux, persuasif, leader

**Caractéristiques:**
- Aime diriger et influencer
- Préfère les défis et la compétition
- Valorise le pouvoir et le statut

**Métiers typiques:** Manager, Entrepreneur, Commercial, Avocat, Consultant

---

### C - Conventionnel (Gris #6B7280)
**Profil:** Organisé, méthodique, précis

**Caractéristiques:**
- Aime l'ordre et la structure
- Préfère suivre des procédures
- Valorise la précision et l'exactitude

**Métiers typiques:** Comptable, Secrétaire, Banquier, Administrateur, Auditeur

---

## Exemples avec cURL

### Récupérer les questions

```bash
curl http://localhost:8000/api/v1/riasec/questions
```

### Soumettre le test

```bash
curl -X POST http://localhost:8000/api/v1/riasec/submit \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "answers": [
      {"question_number": 1, "answer": 4},
      {"question_number": 2, "answer": 3},
      {"question_number": 3, "answer": 5},
      ... // 27 autres réponses
    ],
    "duration_seconds": 450
  }'
```

### Récupérer le dernier résultat

```bash
curl http://localhost:8000/api/v1/riasec/results/latest \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Rechercher métiers par Holland Code

```bash
curl http://localhost:8000/api/v1/riasec/careers/IRS
```

---

## Utilisation Frontend

### Flow Typique

1. **Afficher le test:**
   ```javascript
   const { data } = await fetch('/api/v1/riasec/questions');
   // Afficher data.questions avec data.answer_scale
   ```

2. **Collecter les réponses:**
   ```javascript
   const answers = [
     { question_number: 1, answer: 4 },
     // ... collectées depuis le formulaire
   ];
   ```

3. **Soumettre:**
   ```javascript
   const result = await fetch('/api/v1/riasec/submit', {
     method: 'POST',
     headers: {
       'Authorization': `Bearer ${token}`,
       'Content-Type': 'application/json'
     },
     body: JSON.stringify({ answers, duration_seconds })
   });
   ```

4. **Afficher résultats:**
   ```javascript
   console.log(result.holland_code); // "IRS"
   console.log(result.scores); // { realistic: 75, ... }

   // Afficher interprétations avec couleurs
   result.interpretations.forEach(interp => {
     console.log(interp.dimension_name, interp.score);
     console.log(interp.typical_careers);
   });
   ```

---

## Recommandations

### Pour le Frontend
- Afficher les questions en plusieurs pages (6 pages de 5 questions)
- Utiliser les couleurs des dimensions pour la visualisation
- Montrer une jauge/graphique radar pour les scores
- Sauvegarder les réponses localement (localStorage) en cas d'interruption
- Timer optionnel pour mesurer `duration_seconds`

### Pour l'Expérience Utilisateur
- Minimum recommandé: 5 minutes pour bien réfléchir
- Maximum: 30 minutes (sinon test invalide)
- Afficher progrès (15/30 questions complétées)
- Permettre retour en arrière pour modifier réponses
- Confirmation avant soumission finale

### Interprétation des Résultats
- **Score > 70%**: Dimension très forte, excellent fit
- **Score 50-70%**: Dimension modérée, bon fit
- **Score < 50%**: Dimension faible, à éviter

Le Holland Code permet de matcher avec les programmes académiques qui ont un `riasec_match` correspondant.
