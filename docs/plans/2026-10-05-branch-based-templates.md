# Branch-Based Multi-Variant Templates Implementation Plan

> **For Claude / Antigravity:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Implement Option A (Branch-Based Templates) across GitHub, creating isolated, production-grade starter branches for `template/web-admin-api`, `template/expo-web-api`, and `template/flutter-web-api` branching off `main`.

**Architecture:** Maintain `main` as the pure baseline (`apps/web` + `apps/api`). Branch out dedicated template branches where each variant contains only the specific apps and dependencies needed, sharing internal workspace packages (`@repo/ui`, `@repo/types`, `@repo/validators`) and the unified root `.env`.

**Tech Stack:** Git, Turborepo v2, Next.js 16 (React 19 + Tailwind v4), Express.js + Prisma ORM, React Native (Expo SDK 52+), Flutter 3.x, npm workspaces.

---

## 🌳 Branch Hierarchy & Map

```
main (v1.0.0-web-api) [BASELINE]
│   ├── apps/web (Next.js 16 - Port 3000)
│   ├── apps/api (Express.js - Port 5000)
│   └── packages/* (@repo/types, @repo/validators, @repo/ui)
│
├── template/web-admin-api
│   ├── apps/web (Client Portal - Port 3000)
│   ├── apps/admin (Super Admin Backoffice - Port 3001) [NEW]
│   ├── apps/api (Express.js - Port 5000)
│   └── packages/* (Shared UI, Types, Validators)
│
├── template/expo-web-api
│   ├── apps/web (Next.js 16 - Port 3000)
│   ├── apps/mobile (React Native / Expo SDK 52) [NEW]
│   ├── apps/api (Express.js - Port 5000)
│   └── packages/* (Types, Validators shared with Mobile)
│
└── template/flutter-web-api
    ├── apps/web (Next.js 16 - Port 3000)
    ├── apps/flutter (Flutter 3.x Cross-Platform App) [NEW]
    ├── apps/api (Express.js - Port 5000)
    └── packages/* (Shared contracts + OpenAPI codegen)
```

---

## Phase 1: Baseline Tagging & Release (`main`)

### Task 1.1: Create & Push Git Release Tag
- **Action**: Tag current `main` branch state as `v1.0.0-web-api` and push to GitHub.
- **Commands**:
  ```bash
  git tag -a v1.0.0-web-api -m "release: baseline Next.js 16 + Express + Prisma template with unified root .env"
  git push origin v1.0.0-web-api
  ```
- **Verification**: Check `git tag` output.

---

## Phase 2: Variant `template/web-admin-api`

### Task 2.1: Create Branch & Scaffold `apps/admin`
- **Branch**: Create and switch to `template/web-admin-api`.
  ```bash
  git checkout -b template/web-admin-api
  ```
- **Files to Create**:
  - `apps/admin/package.json`
  - `apps/admin/tsconfig.json`
  - `apps/admin/next.config.ts`
  - `apps/admin/src/env.ts`
  - `apps/admin/src/proxy.ts` (RBAC protecting `/admin` routes with `SUPER_ADMIN` check)
  - `apps/admin/src/app/layout.tsx`
  - `apps/admin/src/app/page.tsx` (Admin dashboard overview, analytics cards, user management table)
- **Key Configuration**:
  - Bound port: `--port 3001`
  - `dotenv-cli -e ../../.env -- next dev --port 3001`
  - Add to root `.env.example` and `.env`:
    ```env
    # ==============================================================================
    # ADMIN WEB CONFIGURATION (@repo/admin - Next.js)
    # ==============================================================================
    NEXT_PUBLIC_ADMIN_URL=http://localhost:3001
    ```
- **Verification**:
  - Run `npm run typecheck`
  - Run `npm run build` (builds web, admin, and api)
  - Run `npm run dev` and verify:
    - Web on `http://localhost:3000`
    - Admin on `http://localhost:3001`
    - API on `http://localhost:5000`
- **Commit & Push**:
  ```bash
  git add .
  git commit -m "feat(admin): implement Next.js 16 admin portal on port 3001 with shared UI & RBAC"
  git push -u origin template/web-admin-api
  ```

---

## Phase 3: Variant `template/expo-web-api`

### Task 3.1: Create Branch & Scaffold `apps/mobile` (Expo)
- **Branch**: Switch back to `main`, then create `template/expo-web-api`.
  ```bash
  git checkout main
  git checkout -b template/expo-web-api
  ```
- **Files to Create**:
  - `apps/mobile/package.json` (Expo SDK 52+, `@repo/types`, `@repo/validators`)
  - `apps/mobile/metro.config.js` (Configured for monorepo hoisting and symlink resolution)
  - `apps/mobile/app.json` (Expo config)
  - `apps/mobile/babel.config.js`
  - `apps/mobile/src/App.tsx` (Screen showing Auth Status, API Connectivity to Express, and shared types)
  - `apps/mobile/src/lib/api.ts` (Axios / Fetch connecting to `process.env.EXPO_PUBLIC_API_URL`)
- **Key Configuration**:
  - Add to root `.env.example` and `.env`:
    ```env
    # ==============================================================================
    # MOBILE CONFIGURATION (@repo/mobile - Expo React Native)
    # ==============================================================================
    EXPO_PUBLIC_API_URL=http://localhost:5000/api/v1
    ```
- **Verification**:
  - Run `npm run typecheck`
  - Run `npx expo start` inside `apps/mobile` to verify bundle initialization
- **Commit & Push**:
  ```bash
  git add .
  git commit -m "feat(mobile): integrate Expo React Native app sharing types and validators with root .env"
  git push -u origin template/expo-web-api
  ```

---

## Phase 4: Variant `template/flutter-web-api`

### Task 4.1: Create Branch & Scaffold `apps/flutter`
- **Branch**: Switch back to `main`, then create `template/flutter-web-api`.
  ```bash
  git checkout main
  git checkout -b template/flutter-web-api
  ```
- **Files to Create**:
  - `apps/flutter/pubspec.yaml` (dependencies: `http`, `flutter_dotenv`, `provider`)
  - `apps/flutter/lib/main.dart` (Flutter application displaying fullstack connectivity)
  - `apps/flutter/lib/config/env.dart` (reads root `.env` via `flutter_dotenv`)
  - `apps/flutter/lib/api/api_client.dart` (Typed API client communicating with Express `/api/v1`)
  - Root script in `package.json`:
    - `"dev:flutter": "cd apps/flutter && flutter run"`
- **Verification**:
  - Verify Flutter syntax and static analysis (`flutter analyze` or Dart format).
- **Commit & Push**:
  ```bash
  git add .
  git commit -m "feat(flutter): integrate Flutter mobile client with shared root .env and API client"
  git push -u origin template/flutter-web-api
  ```

---

## Phase 5: Template Selector & Scaffolder Script

### Task 5.1: Create Project Generator Script
- **Branch**: Switch to `main`.
  ```bash
  git checkout main
  ```
- **Files to Create**:
  - `scripts/create-project.mjs` (Interactive CLI tool prompt):
    - Prompts user:
      1. What is your project name?
      2. Which variant do you want to initialize?
         - 1) Web + Backend (`main`)
         - 2) Web + Admin Web + Backend (`template/web-admin-api`)
         - 3) React Native (Expo) + Web + Backend (`template/expo-web-api`)
         - 4) Flutter + Web + Backend (`template/flutter-web-api`)
    - Automatically clones the chosen branch into the target folder, resets `.git`, copies `.env.example` to `.env`, and installs dependencies!
- **Package Script**:
  - Add to root `package.json`: `"scaffold": "node scripts/create-project.mjs"`
- **Commit & Push**:
  ```bash
  git add .
  git commit -m "feat: add interactive CLI template scaffolder script"
  git push origin main
  ```

---

## 🚀 Execution Checklist

- [ ] Tag `v1.0.0-web-api` on `main` and push tag.
- [ ] Build and push `template/web-admin-api`.
- [ ] Build and push `template/expo-web-api`.
- [ ] Build and push `template/flutter-web-api`.
- [ ] Add `scripts/create-project.mjs` to `main` for instant 1-command project generation.
