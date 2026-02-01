# Tests API OrientCam

Documentation des tests pour les endpoints d'authentification.

## Prérequis

```bash
# Installer requests si nécessaire
pip install requests

# Lancer l'API
python -m uvicorn app.main:app --reload
```

## Exécuter les Tests

```bash
# Depuis backend/
python test_api.py
```

## Tests Manuels avec cURL

### 1. Health Check

```bash
curl http://localhost:8000/health
```

**Réponse attendue:**
```json
{
  "status": "healthy",
  "version": "1.0.0",
  "database": "healthy",
  "redis": "unavailable",
  "timestamp": "2024-..."
}
```

### 2. Register (Inscription)

```bash
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "etudiant@example.com",
    "password": "Secure@123",
    "first_name": "Marie",
    "last_name": "Ngono"
  }'
```

**Réponse attendue (201):**
```json
{
  "access_token": "eyJhbGc...",
  "refresh_token": "eyJhbGc...",
  "token_type": "bearer",
  "expires_in": 1800,
  "user": {
    "id": "uuid...",
    "email": "etudiant@example.com",
    "role": "student",
    "first_name": "Marie",
    "last_name": "Ngono",
    "is_verified": false
  }
}
```

**Erreurs possibles:**
- `400` - Email déjà enregistré
- `422` - Validation échouée (mot de passe faible, email invalide)

### 3. Login (Connexion)

```bash
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "etudiant@example.com",
    "password": "Secure@123"
  }'
```

**Réponse attendue (200):**
```json
{
  "access_token": "eyJhbGc...",
  "refresh_token": "eyJhbGc...",
  "token_type": "bearer",
  "expires_in": 1800,
  "user": {
    "id": "uuid...",
    "email": "etudiant@example.com",
    "role": "student",
    "first_name": "Marie",
    "last_name": "Ngono",
    "is_verified": false
  }
}
```

**Erreurs possibles:**
- `401` - Email ou mot de passe incorrect
- `403` - Compte inactif
- `429` - Trop de tentatives (5 max, blocage 15min)

### 4. Get Current User (/auth/me)

```bash
# Remplacer YOUR_ACCESS_TOKEN par le token reçu
curl -X GET http://localhost:8000/api/v1/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Réponse attendue (200):**
```json
{
  "id": "uuid...",
  "email": "etudiant@example.com",
  "role": "student",
  "first_name": "Marie",
  "last_name": "Ngono",
  "is_verified": false
}
```

**Erreurs possibles:**
- `401` - Token invalide ou expiré
- `403` - Utilisateur inactif

### 5. Refresh Token

```bash
# Remplacer YOUR_REFRESH_TOKEN par le refresh token reçu
curl -X POST http://localhost:8000/api/v1/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refresh_token": "YOUR_REFRESH_TOKEN"
  }'
```

**Réponse attendue (200):**
```json
{
  "access_token": "eyJhbGc... (nouveau)",
  "refresh_token": "eyJhbGc... (nouveau)",
  "token_type": "bearer",
  "expires_in": 1800,
  "user": {
    "id": "uuid...",
    "email": "etudiant@example.com",
    "role": "student",
    "first_name": "Marie",
    "last_name": "Ngono",
    "is_verified": false
  }
}
```

**Erreurs possibles:**
- `401` - Refresh token invalide ou expiré

### 6. Logout (Déconnexion)

```bash
curl -X POST http://localhost:8000/api/v1/auth/logout \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Réponse attendue (200):**
```json
{
  "message": "Successfully logged out"
}
```

## Tests avec Postman

### Configuration

1. Créer une nouvelle collection "OrientCam API"
2. Ajouter une variable `base_url` = `http://localhost:8000`
3. Ajouter une variable `access_token` (sera remplie automatiquement)

### Script Post-Response pour Login/Register

Ajouter ce script dans l'onglet "Tests" pour sauvegarder automatiquement le token:

```javascript
if (pm.response.code === 200 || pm.response.code === 201) {
    const response = pm.response.json();
    pm.collectionVariables.set("access_token", response.access_token);
    pm.collectionVariables.set("refresh_token", response.refresh_token);
}
```

## Règles de Validation

### Email
- Format valide (RFC 5322)
- Unique dans la base de données

### Mot de passe
- Minimum 8 caractères
- Au moins 1 majuscule
- Au moins 1 minuscule
- Au moins 1 chiffre
- Au moins 1 caractère spécial (!@#$%^&*(),.?":{}|<>)
- Pas d'espaces

### Noms (first_name, last_name)
- Minimum 2 caractères
- Maximum 100 caractères
- Lettres, espaces, tirets, apostrophes uniquement
- Pas de chiffres ou caractères spéciaux

## Sécurité

### Rate Limiting

- **Login**: Maximum 5 tentatives échouées par email
  - Blocage: 15 minutes
  - Code: 429 Too Many Requests

### Tokens

- **Access Token**: 30 minutes (configurable)
  - Utilisé pour authentifier les requêtes
  - Inclus dans header: `Authorization: Bearer <token>`

- **Refresh Token**: 7 jours (configurable)
  - Utilisé pour obtenir un nouveau access token
  - Stocké dans Redis
  - Révoqué lors du logout

### Brute Force Protection

Le système incrémente un compteur Redis pour chaque tentative de login échouée:
- Clé: `login_attempts:<email>`
- TTL: 900 secondes (15 minutes)
- Max: 5 tentatives

## Documentation Interactive

Une fois l'API lancée, accéder à:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

Ces interfaces permettent de tester tous les endpoints directement depuis le navigateur.

## Exemples de Tests Automatisés

### Python (requests)

```python
import requests

# Register
response = requests.post(
    "http://localhost:8000/api/v1/auth/register",
    json={
        "email": "test@example.com",
        "password": "Test@1234",
        "first_name": "Test",
        "last_name": "User"
    }
)
tokens = response.json()

# Use access token
headers = {"Authorization": f"Bearer {tokens['access_token']}"}
response = requests.get(
    "http://localhost:8000/api/v1/auth/me",
    headers=headers
)
user = response.json()
print(user)
```

### JavaScript (fetch)

```javascript
// Register
const response = await fetch('http://localhost:8000/api/v1/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'test@example.com',
    password: 'Test@1234',
    first_name: 'Test',
    last_name: 'User'
  })
});
const tokens = await response.json();

// Use access token
const userResponse = await fetch('http://localhost:8000/api/v1/auth/me', {
  headers: { 'Authorization': `Bearer ${tokens.access_token}` }
});
const user = await userResponse.json();
console.log(user);
```

## Troubleshooting

### Erreur: "Database health check failed"
- Vérifier que la base de données est accessible
- SQLite: Vérifier que orientcam.db existe
- PostgreSQL: Vérifier la connexion dans .env

### Erreur: "Redis unavailable"
- Normal en développement local sans Redis
- Le cache est désactivé automatiquement
- Pour activer: `docker-compose up redis`

### Erreur: 422 Validation Error
- Vérifier le format JSON
- Vérifier les règles de validation (password, email, noms)
- Consulter le message d'erreur détaillé

### Erreur: CORS
- Vérifier que `http://localhost:3000` est dans CORS_ORIGINS
- Pour tester depuis un autre port, ajouter dans .env
