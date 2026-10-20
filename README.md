# 🚀 Fullstack Turborepo Starter Kit v2

A production-grade, enterprise full-stack monorepo starter kit and project generator powered by **[Turborepo](https://turbo.build/repo)**. Built with **Next.js 16 (React 19, Tailwind CSS 4, Shadcn UI)**, **Express 5 (TypeScript, Prisma ORM 7, Socket.IO)**, **Expo SDK 57 (React Native)**, and **Flutter 3.47+**, unified under a single root `.env` architecture.

---

## 🌟 Template Variants & Branches

The `main` branch includes **everything**, while dedicated variant branches provide tailored platform subsets:

| Variant                           | Branch                                                                                                                   | Included Platforms                                  | Port Allocations                                    |
| :-------------------------------- | :----------------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------- | :-------------------------------------------------- |
| **All-in-One Suite (Everything)** | [`main`](https://github.com/adnanmahmud0/fullstack-turborepo-starter-kit-v2/tree/main)                                   | Web + Admin + React Native + Flutter + Express API  | `:3000` (Web)<br>`:3001` (Admin)<br>`:5000` (API)   |
| **Expo + Admin + API**            | [`expo-web-api`](https://github.com/adnanmahmud0/fullstack-turborepo-starter-kit-v2/tree/expo-web-api)                   | React Native (Expo) + Super Admin Web + Express API | `:3001` (Admin)<br>`:5000` (API)<br>Expo Dev Server |
| **Flutter + Admin + API**         | [`flutter-web-api`](https://github.com/adnanmahmud0/fullstack-turborepo-starter-kit-v2/tree/flutter-web-api)             | Flutter 3.47+ + Super Admin Web + Express API       | `:3001` (Admin)<br>`:5000` (API)<br>Flutter Engine  |
| **Web + Admin + API**             | [`web-admin-api`](https://github.com/adnanmahmud0/fullstack-turborepo-starter-kit-v2/tree/web-admin-api)                 | Next.js 16 Web + Next.js 16 Admin + Express API     | `:3000` (Web)<br>`:3001` (Admin)<br>`:5000` (API)   |
| **Web + API (Baseline)**          | [`web-api`](https://github.com/adnanmahmud0/fullstack-turborepo-starter-kit-v2/tree/web-api)                             | Next.js 16 Web + Express 5 & Prisma API             | `:3000` (Web)<br>`:5000` (API)                      |
| **Expo + Web + Admin + API**      | [`expo-web-admin-api`](https://github.com/adnanmahmud0/fullstack-turborepo-starter-kit-v2/tree/expo-web-admin-api)       | React Native (Expo) + Web + Admin + Express API     | `:3000` (Web)<br>`:3001` (Admin)<br>`:5000` (API)   |
| **Flutter + Web + Admin + API**   | [`flutter-web-admin-api`](https://github.com/adnanmahmud0/fullstack-turborepo-starter-kit-v2/tree/flutter-web-admin-api) | Flutter + Next.js 16 Web + Admin + Express API      | `:3000` (Web)<br>`:3001` (Admin)<br>`:5000` (API)   |

---

## ⚡ Instant Project Creation & Template Options

You can create new projects from this starter kit using any of the 4 methods below:

### Option 1: GitHub Native "Use this template" Button (Web UI)

1. **Enable Template in Settings (One-Time)**:
   - Go to 👉 **[Repository Settings](https://github.com/adnanmahmud0/fullstack-turborepo-starter-kit-v2/settings)**
   - Check the box: **☑ Template repository**
2. **Generate New Repository**:
   - Click the green **"Use this template"** button at the top of the repository, then click **"Create a new repository"**.
   - **Crucial**: Check **☑ Include all branches** to copy all 7 branch variants into your new repo.
   - Once created, you can switch your default branch to any variant in your new repo's **Settings > Branches**!

---

### Option 2: GitHub Actions 1-Click Cloud Generator (No CLI Required)

Spawn a new GitHub repository straight from your browser:

1. Go to the **Actions** tab in this repository.
2. Select **"Create Project from Template Branch"**.
3. Click **Run workflow** -> Select your branch variant, name your new repository, and click **Run**.
4. The workflow creates the repository on GitHub and pushes the selected branch as its `main` branch!
   _(Requires `GH_PAT` Personal Access Token secret in repo settings — see [docs/TEMPLATES.md](docs/TEMPLATES.md))_.

---

### Option 3: Interactive CLI Scaffolder Wizard

Generate a fresh standalone project locally with clean git history:

```bash
# Clone the repository (if not already local)
git clone https://github.com/adnanmahmud0/fullstack-turborepo-starter-kit-v2.git
cd fullstack-turborepo-starter-kit-v2

# Run interactive generator
npm run create
# Or on Windows: .\create-project.ps1
# Or on macOS/Linux: ./create-project.sh
```

**What the interactive wizard does:**

1. Prompts for your new project directory name.
2. Presents a selection menu to choose your template variant (1–7).
3. Clones only that variant branch with `--depth 1`.
4. Removes `.git` and initializes a fresh `git` repository with initial commit on `main`.
5. Auto-creates root `.env` from `.env.example` and updates `package.json`.
6. Optionally prompts for your new GitHub repository URL and pushes automatically!

---

### Option 4: Clone Any Variant Directly via Git (1-Liner)

```bash
# 1. Everything: Web + Admin + React Native + Flutter + API
git clone --depth 1 --branch main https://github.com/adnanmahmud0/fullstack-turborepo-starter-kit-v2.git my-suite

# 2. React Native (Expo) + Admin Web + API
git clone --depth 1 --branch expo-web-api https://github.com/adnanmahmud0/fullstack-turborepo-starter-kit-v2.git my-expo-admin-app

# 3. Flutter + Admin Web + API
git clone --depth 1 --branch flutter-web-api https://github.com/adnanmahmud0/fullstack-turborepo-starter-kit-v2.git my-flutter-admin-app

# 4. Web + Admin Web + API
git clone --depth 1 --branch web-admin-api https://github.com/adnanmahmud0/fullstack-turborepo-starter-kit-v2.git my-admin-app

# 5. Web + API Baseline
git clone --depth 1 --branch web-api https://github.com/adnanmahmud0/fullstack-turborepo-starter-kit-v2.git my-web-app

# 6. React Native (Expo) + Web + Admin + API
git clone --depth 1 --branch expo-web-admin-api https://github.com/adnanmahmud0/fullstack-turborepo-starter-kit-v2.git my-expo-web-admin-app

# 7. Flutter + Web + Admin + API
git clone --depth 1 --branch flutter-web-admin-api https://github.com/adnanmahmud0/fullstack-turborepo-starter-kit-v2.git my-flutter-web-admin-app
```

> 📖 For full detailed instructions, read the **[Template Guide (docs/TEMPLATES.md)](docs/TEMPLATES.md)** and **[Deployment Guide (docs/DEPLOYMENT.md)](docs/DEPLOYMENT.md)**.

---

## 🏗️ Monorepo Architecture & Directory Layout

```
.
├── apps/
│   ├── web/                         # Next.js 16 App Router Frontend (@repo/web - Port 3000)
│   ├── admin/                       # Next.js 16 Super Admin Portal (@repo/admin - Port 3001)
│   ├── expo/                        # Expo & React Native Client (@repo/expo)
│   ├── flutter/                     # Flutter Cross-Platform Client (@repo/flutter)
│   └── api/                         # Express.js 5 + Prisma ORM Backend (@repo/api - Port 5000)
│
├── packages/
│   ├── tsconfig/                    # Shared TypeScript configurations
│   ├── eslint-config/               # Shared ESLint flat configurations
│   ├── types/                       # Shared TypeScript types & DTO contracts
│   ├── validators/                  # Shared Zod validation schemas
│   └── ui/                          # Shared UI component primitives
│
├── scripts/
│   └── create-project.mjs           # Interactive project scaffolder CLI
│
├── .env.example                     # Single unified root environment template
├── package.json                     # Root npm workspaces manifest
├── turbo.json                       # Turborepo task pipeline & caching
└── README.md
```

---

## 🔐 Single Unified Root `.env` Architecture

No duplicate `.env` files scattered across sub-directories! The monorepo uses a **single root `.env`** clearly partitioned into labeled sections:

```bash
# Copy template to active configuration
cp .env.example .env
```

### Environment Layout:

- **1. SHARED**: `NODE_ENV` configuration.
- **2. FRONTEND & CLIENTS**:
  - `NEXT_PUBLIC_SITE_URL` (:3000)
  - `NEXT_PUBLIC_ADMIN_URL` (:3001)
  - `NEXT_PUBLIC_API_URL` (:5000/api/v1)
  - `EXPO_PUBLIC_API_URL` (:5000/api/v1)
  - `FLUTTER_API_URL` (:5000/api/v1)
- **3. BACKEND SERVER**: `PORT=5000`, `IP_ADDRESS=localhost`, `ENABLE_API_DOCS=true`.
- **4. DATABASE**: `DATABASE_URL` (PostgreSQL / Prisma connection pool).
- **5. AUTHENTICATION & SECURITY**: Bcrypt rounds, `JWT_SECRET`, `JWT_REFRESH_SECRET`, `SESSION_SECRET`, Super Admin seed credentials.
- **6. OAUTH**: Google, Facebook, and GitHub OAuth callback URLs and client secrets.
- **7. EMAIL**: Nodemailer SMTP credentials.
- **8. INTEGRATIONS**: Stripe, Firebase Cloud Messaging, Apple & Google Play In-App Purchases.

All applications automatically resolve variables from this root file.

---

## 🎨 Terminal Console Design

Starting any app prints a custom branded ASCII status box:

- **Frontend (`@repo/web`)**: Cyan console box displaying local URL (`:3000`), API target (`:5000/api/v1`), environment, and Turbopack status.
- **Super Admin (`@repo/admin`)**: Violet console box showing Admin Portal (`:3001`), API target, and RBAC security status.
- **Backend (`@repo/api`)**: Emerald console box showing Express 5 API status (`:5000`), Swagger UI URL (`/api-docs`), and Prisma DB status.
- **Backend Winston Logger**: Formatted badge logger `[HH:MM:SS] INFO/WARN/ERROR/DEBUG │ message` with automatic ANSI stripping for persistent disk files.
- **Browser DevTools Console**: Styled welcome banner in the browser console.

---

## 📜 Workspace Commands

Run from the monorepo root:

### 🚀 Development

```bash
# Start all apps concurrently
npm run dev

# App-specific development servers
npm run dev:web        # Starts Next.js Web on http://localhost:3000
npm run dev:admin      # Starts Next.js Admin on http://localhost:3001
npm run dev:api        # Starts Express Backend on http://localhost:5000
npm run dev:expo       # Starts Expo Mobile Dev Server
npm run dev:flutter    # Starts Flutter Client
```

### 🔨 Production Build

```bash
npm run build          # Builds all workspaces with Turborepo caching
npm run build:web      # Builds Next.js Web production bundle
npm run build:admin    # Builds Next.js Admin production bundle
npm run build:api      # Generates Prisma client & compiles Express TypeScript to dist/
npm run build:expo     # Bundles mobile app for EAS Build
npm run build:flutter  # Prepares Flutter build
```

### 🔍 Code Quality & Type Safety

```bash
npm run typecheck      # Runs tsc across all apps and shared packages
npm run lint           # Validates ESLint rules across all workspaces
npm run format         # Prettier formatting across the repository
npm run format:check   # Checks code style without modifications
```

---

## 📖 API Documentation & Swagger UI

Interactive Swagger / OpenAPI 3.0 documentation is automatically generated from Zod validation schemas:

- **Swagger UI**: [http://localhost:5000/api-docs](http://localhost:5000/api-docs)
- **OpenAPI 3.0 JSON**: [http://localhost:5000/api-docs.json](http://localhost:5000/api-docs.json)
- **Health Check Probe**: [http://localhost:5000/health](http://localhost:5000/health)

---

## 🔒 Git Hooks & Quality Control

Pre-configured with **Husky**, **lint-staged**, and **Commitlint**:

- **Pre-commit**: Automatically formats staged files with Prettier.
- **Commit-msg**: Enforces [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `docs:`, `chore:`).

---

## 📄 License

This project is open-source software licensed under the [MIT License](LICENSE).
