# ⚔️ Ashen Path

<div align="center">

![React 19](https://img.shields.io/badge/React-19.0.1-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.2-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.21.2-000000?style=for-the-badge&logo=express&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6.2.3-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1.14-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![PWA Ready](https://img.shields.io/badge/PWA-Installable-5A0FC8?style=for-the-badge&logo=pwa&logoColor=white)

<br />

**A retro dark fantasy habit & quest tracker with a 16-bit RPG design system.**

*Forge bodily fortitude, kindle your discipline, and conquer life's daily trials within a Souls-like progression engine.*

</div>

---

## 📖 Overview

**Ashen Path** bridges real-world self-improvement with retro dark fantasy gaming mechanics. Habits, study sessions, workouts, and daily commitments become quests that reward **XP**, **Gold**, and **Attribute Points**. Build your character, unlock archetypal classes (**Sorcerer**, **Knight**, **Ronin**, **Rogue**), equip legendary relic armor, and battle daily realm bosses.

---

## 🏛️ Architecture & Folder Structure

The codebase is engineered with strict modular encapsulation between the frontend single-page application (`client/`) and the backend REST API (`server/`):

```
ashen-path/
├── client/                     # 🌐 Frontend Application (React 19 + TypeScript + Tailwind CSS)
│   ├── public/                 # Static PWA assets, icons, manifest graphics
│   ├── components/
│   │   ├── artwork/            # Pixel art illustrations (Bonfire, Embers, Cathedral, Crests)
│   │   ├── auth/               # Modal login/register dialogue with token management
│   │   ├── character/          # Header greeting, avatar inspection, dynamic dialogue
│   │   ├── common/             # Global ErrorBoundary & safety fallback wrappers
│   │   ├── icons/              # 16-bit pixel icons for stats, classes, and actions
│   │   ├── pixel/              # Sprite animators (GSAP wizard sprite, pixel heroes)
│   │   ├── primitives/         # RPGCard, PixelButton, StatBar, XPBar, BottomNav, PWA
│   │   ├── providers/          # Smooth scroll (Lenis) provider
│   │   └── screens/            # Home, AddQuest, QuestDetail, Character, Inventory, Profile, Splash
│   ├── hooks/                  # useGameState (authoritative syncing), usePWAInstall
│   ├── services/               # api.ts (HTTP REST client with JWT authentication)
│   ├── utils/                  # audio.ts (Web Audio synthesis SFX), animations.ts, classes.ts
│   ├── App.tsx                 # Responsive layout (desktop sidebar + mobile navigation)
│   ├── index.css               # Tailwind CSS styles & 16-bit dark fantasy palette
│   ├── index.html              # HTML entry template (<script src="/main.tsx">)
│   ├── main.tsx                # Client application root
│   ├── tsconfig.json           # Client TypeScript configuration (DOM, JSX, Vite types)
│   ├── types.ts                # Client-side domain contracts and TypeScript types
│   └── vite.config.ts          # Vite & VitePWA bundler configuration
│
├── server/                     # ⚔️ Backend API Service (Express + TypeScript)
│   ├── controllers/            # Auth, Quests, Character, Inventory, Stats controllers
│   ├── data/                   # Server-side persistent storage
│   │   └── liferpg_db.json     # Sovereign JSON transactional document store
│   ├── db/                     # database.ts (Database singleton and persistence layer)
│   ├── middleware/             # auth.middleware.ts (JWT bearer validation)
│   ├── models/                 # types.ts (Backend data schema & domain models)
│   ├── routes/                 # Express REST endpoints (/api/auth, /api/quests, etc.)
│   ├── services/               # auth.service.ts (bcrypt + JWT), rpg-engine.service.ts (XP curves)
│   ├── app.ts                  # Express application factory & route mounts
│   ├── index.ts                # Server entry point (Vite dev integration + production static serving)
│   ├── tsconfig.json           # Server TypeScript configuration (Node, ES2022)
│   └── .env.example            # Backend environment variables
│
├── package.json                # Project dependencies & orchestrating lifecycle scripts
├── package-lock.json           # npm lockfile
├── tsconfig.json               # Root TypeScript solution configuration
├── .env.example                # Example environment variables
├── .gitignore                  # Git ignore rules
└── README.md                   # Complete documentation & quick start guide
```

---

## ⚡ Quick Start

### Prerequisites
- **Node.js** (v18.0.0 or higher)
- **npm** (v9.0.0 or higher)

### 1. Installation
```bash
git clone https://github.com/your-username/ashen-path.git
cd ashen-path
npm install
```

### 2. Environment Setup
```bash
cp .env.example .env
```
*(Default development settings are pre-configured to run out of the box).*

### 3. Launch Development Server
```bash
npm run dev
```
Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

---

## 👤 Demo Account Credentials

An instant demo account is pre-seeded in the database for testing:

| Username | Password | Default Class | Initial Level |
| :--- | :--- | :--- | :--- |
| `AshenOne` | `bonfire` | Sorcerer | Level 4 |

*You can also click **"Quick Demo Login"** inside the authentication modal.*

---

## 📜 Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Boots the fullstack dev server with live Vite HMR on port `3000` |
| `npm run build` | Compiles client assets into `dist/` and bundles server into `dist/server.cjs` |
| `npm run start` | Boots the production server from `dist/server.cjs` |
| `npm run lint` | Runs strict type checking across both client and server (`tsc -p client --noEmit && tsc -p server --noEmit`) |
| `npm run preview` | Runs Vite production preview for the client build |
| `npm run clean` | Cleans `dist/` and temporary build artifacts |

---

## 🎮 Core RPG Systems & Mechanics

### 1. Archetypal Player Classes
| Class | Emblem | Primary Focus | Stat Affinity | Unlock Cost |
| :--- | :---: | :--- | :--- | :--- |
| **Sorcerer** | 🔮 | Arcane Focus & Study | `Intelligence`, `Focus` | **Free** (Starter) |
| **Knight** | 🛡️ | Physical Fortitude & Strength | `Strength`, `Vitality` | 350 Gold |
| **Ronin** | ⚔️ | Relentless Execution & Habit Streaks | `Focus`, `Strength` | 600 Gold |
| **Rogue** | 🗡️ | Swiftness & Agile Multi-tasking | `Vitality`, `Focus` | 850 Gold |

### 2. Mathematical Progression Curve
$$ \text{MaxXP}(L) = \lfloor 100 \times L^{1.42} \rfloor $$

- **Level 1** $\rightarrow$ 100 XP
- **Level 2** $\rightarrow$ 273 XP
- **Level 3** $\rightarrow$ 490 XP
- **Level 4** $\rightarrow$ 741 XP
- **Level 5** $\rightarrow$ 1,022 XP
- **Level 10** $\rightarrow$ 2,630 XP

### 3. Bonfire Sanctuary & Kindling
- **Resting**: Restores focus energy, clears burnout fatigue, and resets daily streak checkpoints.
- **Kindling**: Kindle the flame using quest ember fragments to permanently elevate daily boss reward multipliers.

### 4. Relic Vault (Equipment Shop)
- Spend Gold earned from quests to buy and equip relics:
  - **Traveler's Cloak** (+2 Vitality)
  - **Iron Resolve** (+4 Strength)
  - **Scholar's Tome** (+5 Intellect)
  - **Ember Lantern** (+6 Focus)
  - **Ashen Greatsword** (+8 Strength)
  - **Ring of Focus** (+5 Focus)

### 5. Web Audio 16-Bit Sound Synthesis
- Zero external audio files or bandwidth required:
  - Dynamic procedural sound effects generated directly via the HTML5 Web Audio API oscillators and gain nodes (Sword slashes, level-up fanfares, ember pops, coin clinks).

---

## 🛡️ API Reference

All protected endpoints require `Authorization: Bearer <JWT_TOKEN>`.

### 🔐 Authentication (`/api/auth`)
- `POST /api/auth/register` - Create a new account (`email`, `username`, `password`, `playerClass`).
- `POST /api/auth/login` - Authenticate (`emailOrUsername`, `password`).
- `POST /api/auth/demo` - Instant demo session (`AshenOne`).
- `GET /api/auth/me` - Fetch authenticated user profile.

### 📜 Quests (`/api/quests`)
- `GET /api/quests` - Get all quests for authenticated user.
- `POST /api/quests` - Create a quest (`title`, `category`, `difficulty`, `statType`, `repeat`).
- `PUT /api/quests/:id` - Update quest attributes.
- `PATCH /api/quests/:id/toggle` - Authoritatively toggle completion with XP/Gold calculation.
- `DELETE /api/quests/:id` - Remove a quest.

### 🧙 Character (`/api/character`)
- `GET /api/character` - Fetch character sheet (stats, XP, gold, class roster, equipped items).
- `POST /api/character/switch-class` - Switch active player class.
- `POST /api/character/unlock-class` - Unlock a new class with gold.
- `POST /api/character/rest-bonfire` - Rest at the bonfire to restore energy and kindle level.

### 🛡️ Inventory (`/api/inventory`)
- `GET /api/inventory` - Fetch inventory items and ownership status.
- `POST /api/inventory/buy` - Purchase an item with gold.
- `POST /api/inventory/equip` - Equip or unequip an owned item.

### 📊 Stats & Audit (`/api/stats`)
- `GET /api/stats/logs` - Retrieve activity history and audit logs.
- `GET /api/stats/summary` - Retrieve aggregated completion and attribute metrics.

### 🩺 Health (`/api/health`)
- `GET /api/health` - Health check & server uptime status.

---

## 🔒 Security & Data Persistence
- **Password Hashing**: Industry-standard `bcryptjs` with salted hashes.
- **Stateless Tokens**: Signed JSON Web Tokens (`jsonwebtoken`) with configurable secret and expiry.
- **Atomic File Store**: Database mutations write to `server/data/liferpg_db.json.tmp` before performing an atomic rename to prevent corruption under concurrent requests.
- **Client Cache**: High-speed local cache ensures zero-lag offline tactile UI rendering with automatic server synchronization upon reconnection.

---

## 📱 Progressive Web App (PWA)
- **Installable**: Full standalone app experience on iOS, Android, macOS, Windows, and Linux.
- **Offline Support**: Caches core assets via `vite-plugin-pwa` and Service Workers for uninterrupted offline quest management.

---

## 📄 License
This project is open source and available under the [MIT License](LICENSE).
