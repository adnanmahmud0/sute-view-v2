# Fullstack Turborepo Starter Kit: Multi-Variant Architecture & Templating Plan

> **For Claude / Antigravity:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Establish a scalable templating system and monorepo structure to support multiple project variants (`web + backend`, `flutter + web + backend`, `react-native + web + backend`, `web + admin-web + backend`) sharing a single root `.env`, unified types, and shared packages.

**Architecture:** A multi-branch or modular workspace monorepo where internal packages (`@repo/types`, `@repo/validators`, `@repo/ui`) act as the shared core across all platforms, while `apps/*` houses target clients (Next.js consumer web, Next.js admin web, Expo/React Native, or Flutter).

**Tech Stack:** Turborepo v2, Next.js 16 (React 19, Tailwind CSS 4), Express.js + Prisma ORM, React Native (Expo SDK 52+), Flutter 3.x, npm workspaces.

---

## 🏛️ Strategy Comparison: How to Structure the Variants

There are two primary industry approaches for distributing template variants. Choose the one that best fits your workflow:

| Strategy | Structure | Pros | Best For |
| :--- | :--- | :--- | :--- |
| **Option A: Branch-Based Templates (Recommended)** | `main` = Web + Backend<br>`variant/react-native` = + Expo app<br>`variant/flutter` = + Flutter app<br>`variant/admin-web` = + Admin Portal | Cleanest project footprint for consumers; clone only what you need. Zero unused dependencies. | CLI scaffolding (`create-turbo`), standalone starter repos. |
| **Option B: All-in-One Modular Monorepo** | Single repository containing all apps under `apps/` with Turbo filters to run specific combinations | Single PR updates everything. Shared code is 100% unified in one place. | Teams building an entire suite (Web + Mobile + Admin) for a single product. |

---

## 📦 Variant Catalog & App Matrix

### Variant 1: `web + backend` (Baseline - Completed ✅)
- **Apps**:
  - `apps/web`: Next.js 16 (Port 3000)
  - `apps/api`: Express.js + Prisma (Port 5000)
- **Shared Packages**:
  - `packages/types`: DTOs, User, Auth, API response models
  - `packages/validators`: Zod schemas shared between frontend and backend
  - `packages/ui`: Shared React / Shadcn components
  - `packages/tsconfig` & `packages/eslint-config`

---

### Variant 2: `web + admin-web + backend`
Two distinct web applications (Public Landing/SaaS + Internal Backoffice Admin) + Express backend.

```
apps/
├── web/              # Next.js 16 client portal (:3000)
├── admin/            # Next.js 16 backoffice portal (:3001)
└── api/              # Express + Prisma backend (:5000)
packages/
├── ui/               # Shared UI kit (buttons, tables, dialogs)
├── types/            # Admin + Client types
└── validators/       # Auth + Resource schemas
```

- **Port Strategy**: Web on `3000`, Admin on `3001`, API on `5000`.
- **Root `.env` Extensions**:
  ```env
  # Public Client Web
  NEXT_PUBLIC_SITE_URL=http://localhost:3000
  NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1

  # Admin Backoffice Web
  NEXT_PUBLIC_ADMIN_URL=http://localhost:3001
  ```

---

### Variant 3: `react-native + web + backend`
Cross-platform JavaScript ecosystem sharing TypeScript interfaces and Zod validation rules with mobile.

```
apps/
├── web/              # Next.js 16 (:3000)
├── mobile/           # React Native via Expo SDK 52+
└── api/              # Express.js + Prisma (:5000)
packages/
├── types/            # Shared with Web, Mobile, and API
├── validators/       # Zod schemas used in mobile forms (react-hook-form)
└── ui/               # React components (or separate @repo/mobile-ui)
```

- **Code Sharing**:
  - `apps/mobile` imports `@repo/types` and `@repo/validators` directly via workspace dependencies.
  - NativeWind v4 (Tailwind for React Native) matches Web styling tokens.
- **Root `.env` Extensions**:
  ```env
  # Expo Mobile Environment
  EXPO_PUBLIC_API_URL=http://localhost:5000/api/v1
  ```

---

### Variant 4: `flutter + web + backend`
Dart/Flutter native mobile app + Next.js web + Express backend.

```
apps/
├── web/              # Next.js 16 (:3000)
├── api/              # Express.js + Prisma (:5000)
└── mobile_flutter/   # Flutter 3.x project (Dart)
packages/
├── types/            # TypeScript contracts
└── ...
```

- **Code Sharing Strategy**:
  - Backend OpenAPI 3.0 spec (`http://localhost:5000/api/docs.json`) is the single source of truth.
  - Run `openapi-generator-cli` or `swagger_dart_code_generator` in `apps/mobile_flutter` to automatically generate typed Dart API clients from the backend schema.
- **Root `.env` Extensions**:
  - Flutter reads environment variables via `--dart-define-from-file=.env` or `flutter_dotenv`.

---

## 🗺️ Step-by-Step Implementation Roadmap

### Phase 1: Git Branching & Template Setup
- [ ] **Task 1.1**: Tag baseline release: `git tag -a v1.0.0-web-api -m "Base Web + API Template" && git push origin --tags`.
- [ ] **Task 1.2**: Create branching convention for template variants:
  - `template/web-admin-api`
  - `template/expo-web-api`
  - `template/flutter-web-api`

### Phase 2: Variant "Web + Admin + Backend" Implementation
- [ ] **Task 2.1**: Scaffold `apps/admin` using Next.js 16 with `@repo/ui`, `@repo/types`, and `@repo/validators`.
- [ ] **Task 2.2**: Configure `apps/admin/package.json` to run on `--port 3001` with `dotenv-cli -e ../../.env`.
- [ ] **Task 2.3**: Add Role-Based Access Control (RBAC) middleware in `apps/admin/src/proxy.ts` verifying `SUPER_ADMIN` role.
- [ ] **Task 2.4**: Update `turbo.json` tasks to build and test both `web` and `admin`.

### Phase 3: Variant "React Native (Expo) + Web + Backend" Implementation
- [ ] **Task 3.1**: Scaffold `apps/mobile` using `create-expo-app` with TypeScript template.
- [ ] **Task 3.2**: Configure `metro.config.js` to enable monorepo package hoisting for `@repo/types` and `@repo/validators`.
- [ ] **Task 3.3**: Set up NativeWind or shared styling tokens.
- [ ] **Task 3.4**: Connect mobile API client to backend with `EXPO_PUBLIC_API_URL`.

### Phase 4: Variant "Flutter + Web + Backend" Implementation
- [ ] **Task 4.1**: Create `apps/mobile_flutter` via `flutter create --org com.starter apps/mobile_flutter`.
- [ ] **Task 4.2**: Add `flutter_dotenv` package to load the root `.env` file directly.
- [ ] **Task 4.3**: Add npm script `"codegen:flutter": "openapi-generator-cli generate -i apps/api/src/docs/swagger.json -g dart -o apps/mobile_flutter/lib/api"` to automate type synchronization.

### Phase 5: Template CLI Scaffolder (Optional / Advanced)
- [ ] **Task 5.1**: Create a root CLI tool (e.g., `npx create-my-stack <project-name> --template <variant>`).
- [ ] **Task 5.2**: Clone the selected variant branch into a fresh repository with initialized git.
