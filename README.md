# TaskFlow Dashboard

Application fullstack de gestion de tâches — Next.js · TypeScript · MySQL · Tailwind CSS

---

## 🚀 Installation rapide

### 1. Prérequis

- **Node.js** ≥ 18.x → [nodejs.org](https://nodejs.org)
- **MySQL** ≥ 8.x → [mysql.com](https://www.mysql.com)
- **npm** ou **yarn**

### 2. Cloner le projet

```bash
git clone <url-du-repo>
cd taskflow-dashboard
```

### 3. Installer les dépendances

```bash
npm install
```

### 4. Configurer l'environnement

```bash
cp .env.example .env.local
```

Puis édite `.env.local` et renseigne tes infos MySQL :

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=ton_mot_de_passe
DB_NAME=taskflow
JWT_SECRET=une-clé-secrète-longue-et-aléatoire
```

### 5. Créer la base de données MySQL

```bash
mysql -u root -p < schema.sql
```

Ou manuellement dans MySQL :

```sql
CREATE DATABASE taskflow CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE taskflow;

CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Table tasks
CREATE TABLE IF NOT EXISTS tasks (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
  user_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL DEFAULT NULL,   -- Soft delete
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;
```

### 6. Lancer le serveur de développement

```bash
npm run dev
```

Ouvre [http://localhost:3000](http://localhost:3000) dans ton navigateur.

---

## 📦 Scripts disponibles

| Commande | Description |
|----------|-------------|
| `npm run dev` | Serveur de développement (hot reload) |
| `npm run build` | Build de production |
| `npm run start` | Lancer le build de production |
| `npm run lint` | Vérification ESLint |

---

## 📁 Structure du projet

```
taskflow-dashboard/
├── app/
│   ├── layout.tsx              # Layout global (SSR)
│   ├── page.tsx                # Page d'accueil / redirect
│   ├── globals.css             # Design system & styles globaux
│   ├── login/page.tsx          # Page connexion (SSR)
│   ├── register/page.tsx       # Page inscription (SSR)
│   ├── dashboard/page.tsx      # Dashboard avec stats (SSR)
│   ├── tasks/page.tsx          # Liste des tâches (SSR)
│   └── api/
│       ├── auth/
│       │   ├── login/route.ts     # POST /api/auth/login
│       │   ├── register/route.ts  # POST /api/auth/register
│       │   └── logout/route.ts    # POST /api/auth/logout
│       └── tasks/
│           ├── route.ts           # GET, POST /api/tasks
│           └── [id]/route.ts      # PUT, DELETE /api/tasks/:id
├── components/
│   ├── Sidebar.tsx             # Navigation latérale (Server)
│   ├── Navbar.tsx              # Barre supérieure (Server)
│   ├── LogoutButton.tsx        # Bouton déconnexion (Client)
│   ├── StatsCard.tsx           # Carte statistique (Server)
│   ├── TaskCard.tsx            # Carte de tâche (Client)
│   ├── TaskForm.tsx            # Formulaire ajout tâche (Client)
│   ├── TasksClient.tsx         # Gestionnaire de tâches (Client)
│   ├── LoginForm.tsx           # Formulaire connexion (Client)
│   └── RegisterForm.tsx        # Formulaire inscription (Client)
├── lib/
│   ├── db.ts                   # Pool MySQL
│   └── auth.ts                 # JWT utilities
├── types/
│   └── index.ts                # Types TypeScript
├── schema.sql                  # Schéma base de données
├── .env.example                # Template variables d'environnement
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 🎯 Concepts Next.js illustrés

| Concept | Où |
|---|---|
| **Server Components** | `dashboard/page.tsx`, `tasks/page.tsx`, `Sidebar`, `Navbar`, `StatsCard` |
| **Client Components** | `TasksClient`, `TaskCard`, `TaskForm`, `LoginForm`, `RegisterForm`, `LogoutButton` |
| **SSR (fetch au render)** | `dashboard/page.tsx` → stats + tâches récentes |
| **CSR (interactions)** | `TasksClient` → ajout, suppression, filtres, modal |
| **API Routes** | `/app/api/...` → REST complet |
| **App Router** | Structure `app/` avec `page.tsx` |
| **Routing protégé** | `getSession()` + `redirect()` dans chaque page |
| **Props** | `<StatsCard label="..." value={...} />` |
| **useState** | Gestion des tâches, filtres, formulaires |
| **Event Handling** | `onClick`, `onChange`, `onSubmit` |
| **fetch API** | `fetch('/api/tasks', { method: 'POST', ... })` |

---

## 🔐 Sécurité

- Mots de passe hashés avec **bcrypt** (12 rounds)
- Sessions via **JWT** dans un cookie `httpOnly`
- Validation des données côté API
- Vérification de la propriété des ressources (user_id)
- Protection des routes via `getSession()`

---

## 🌐 API REST

| Méthode | Route | Description | Auth |
|---------|-------|-------------|------|
| `POST` | `/api/auth/register` | Créer un compte | ❌ |
| `POST` | `/api/auth/login` | Se connecter | ❌ |
| `POST` | `/api/auth/logout` | Se déconnecter | ✅ |
| `GET` | `/api/tasks` | Lister mes tâches | ✅ |
| `POST` | `/api/tasks` | Ajouter une tâche | ✅ |
| `PUT` | `/api/tasks/:id` | Modifier une tâche | ✅ |
| `DELETE` | `/api/tasks/:id` | Supprimer une tâche | ✅ |
