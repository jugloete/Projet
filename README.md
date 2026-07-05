# Internship Platform

Plateforme de gestion des stages : étudiants, entreprises partenaires, offres, candidatures, rapports, notes, notifications et administration.

## Stack corrigée

- Frontend : React 19 + TypeScript + Vite + TailwindCSS + Recharts + Lucide React.
- Backend : Node.js + Express.
- Base de données : MongoDB avec Mongoose.
- Déploiement local : Docker Compose avec `mongo`, `backend` et `frontend`.

## Comptes de démonstration

L'application utilise une connexion simplifiée pour la démonstration : choisir le rôle et saisir l'email.

| Rôle | Email |
|---|---|
| Admin | `admin@internship.com` |
| Étudiant | `sarah.student@example.com` |
| Entreprise | `recrutement@gecamines.cd` |

## Lancement simple en local

### 1. Installer les dépendances frontend

```bash
npm install
```

### 2. Installer les dépendances backend

```bash
npm --prefix backend install
```

### 3. Préparer l'environnement

Copier `.env.example` vers `.env` à la racine si nécessaire, puis copier `backend/.env.example` vers `backend/.env`.

Exemple backend :

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/internship_platform
CORS_ORIGIN=http://localhost:3000
```

### 4. Lancer MongoDB

Avec Docker :

```bash
docker run --name internship-mongo -p 27017:27017 -d mongo:7
```

### 5. Lancer le backend

```bash
npm run backend:dev
```

API disponible sur : `http://localhost:5000/api/health`

### 6. Lancer le frontend

Dans un autre terminal :

```bash
npm run dev
```

Application disponible sur : `http://localhost:3000`

## Lancement complet avec Docker Compose

```bash
npm run docker:up
```

Puis ouvrir : `http://localhost:8080`

Pour arrêter :

```bash
npm run docker:down
```

## Vérification

```bash
npm run lint
npm run build
npm run backend:check
```

## Fonctionnement MongoDB

Le frontend reste fluide grâce à une stratégie `local-first` : les actions de l'utilisateur sont appliquées immédiatement dans l'interface, puis synchronisées avec MongoDB via l'API `/api/snapshot` dès que le backend est disponible.

Collections MongoDB utilisées :

- `users`
- `students`
- `companies`
- `internships`
- `applications`
- `notifications`
- `audit_logs`
- `daily_reports`
- `student_grades`
- `student_acceptances`

## Points corrigés

Voir le fichier `ANALYSE_CORRECTIONS_MONGODB.md` pour la liste détaillée des problèmes trouvés, corrections et améliorations.

