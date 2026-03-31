# Game Fight V2 🎮

Application de combat RPG au tour par tour développée avec la stack MERN.

## 🚀 Technologies

### Frontend
- React (Vite)
- React Router
- Framer Motion (animations)
- Axios
- CSS classique

### Backend
- Node.js
- Express
- MongoDB (Mongoose)
- JWT (authentification)
- bcrypt (sécurité)

## 📋 Fonctionnalités

- **Authentification** : Système de login/register avec JWT
- **Gestion des personnages** : Interface admin pour créer et gérer les combattants
- **Combat 100% Frontend** : Système de combat en temps réel sans latence
- **Animations** : GIFs animés pour les personnages (idle/attack)
- **Système de compétences** : 4 types (Attack, Special, Heal, Defense)
- **Statistiques** : HP, MP, ATK, DEF, SPD
- **Historique de combat** : Logs détaillés de chaque action

## 🎯 Règles du jeu

- Combat au tour par tour entre deux personnages
- Chaque compétence coûte du mana (MP)
- Les dégâts sont calculés : `(Puissance + ATK) - DEF`
- 10% de chance de coup critique (dégâts x2)
- Victoire quand les HP de l'adversaire tombent à 0

## 🛠️ Installation

### Backend
```bash
cd backend
npm install
```

Créer un fichier `.env` :
```
MONGO_URI=mongodb://localhost:27017/gamefightv2
JWT_SECRET=votre_secret_jwt
PORT=5002
```

Lancer le serveur :
```bash
npm start
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

L'application sera accessible sur `http://localhost:5173`

## 📁 Structure du projet

```
GameFightV2/
├── backend/
│   ├── models/          # Modèles Mongoose (User, Character)
│   ├── routes/          # Routes API (auth, characters)
│   ├── middleware/      # Middlewares (auth, admin)
│   └── server.js        # Point d'entrée
├── frontend/
│   ├── src/
│   │   ├── components/  # Composants React (Navbar)
│   │   ├── context/     # Context API (AuthContext)
│   │   ├── pages/       # Pages (Home, Combat, Admin, Login)
│   │   ├── services/    # Services API (axios)
│   │   ├── styles/      # Fichiers CSS
│   │   └── images/      # Assets (PNG, GIF)
│   └── index.html
└── README.md
```

## 👤 Rôles utilisateurs

- **PLAYER** : Peut jouer et voir les personnages
- **ADMIN** : Peut créer, modifier et supprimer des personnages

## 🎨 Assets

Les personnages utilisent des fichiers PNG pour les avatars et des GIFs pour les animations (idle/attack).
Les fichiers doivent être placés dans `frontend/src/images/`.

## 📝 API Endpoints

### Auth
- `POST /api/auth/register` - Créer un compte
- `POST /api/auth/login` - Se connecter

### Characters
- `GET /api/characters` - Liste tous les personnages (admin)
- `GET /api/characters/active` - Liste les personnages actifs
- `POST /api/characters` - Créer un personnage (admin)
- `PUT /api/characters/:id` - Modifier un personnage (admin)
- `DELETE /api/characters/:id` - Supprimer un personnage (admin)
- `PATCH /api/characters/:id/toggle` - Activer/désactiver (admin)

## 🔒 Sécurité

- Mots de passe hashés avec bcrypt
- Routes protégées par JWT
- Middleware de vérification du rôle admin
- CORS configuré

## 🎮 Développé par

Kevin Castanho

## 📄 Licence

MIT
