# 🎯 Multi-Variant Template Guide & Project Generator

This repository provides **7 production-ready stack variants**, allowing you to create new projects tailored to your specific application needs (Web, Super Admin, React Native Expo, Flutter, or API baseline).

---

## 📑 Table of Contents

1. [Stack Variants Matrix](#1-stack-variants-matrix)
2. [Method A: GitHub Native "Use this template" Button](#2-method-a-github-native-use-this-template-button)
3. [Method B: GitHub Actions 1-Click Cloud Generator](#3-method-b-github-actions-1-click-cloud-generator)
4. [Method C: Interactive CLI Generator (Recommended for Devs)](#4-method-c-interactive-cli-generator)
5. [Method D: Direct 1-Line Git Clone](#5-method-d-direct-1-line-git-clone)

---

## 1. Stack Variants Matrix

|   #   | Branch Name             | Template Mirror                  | Included Apps                                | Ideal For                                               |
| :---: | ----------------------- | -------------------------------- | -------------------------------------------- | ------------------------------------------------------- |
| **1** | `main`                  | -                                | `web` + `admin` + `expo` + `flutter` + `api` | Full enterprise suite with every client platform        |
| **2** | `expo-web-admin-api`    | `template/expo-web-admin-api`    | `expo` + `web` + `admin` + `api`             | Complete React/Next.js ecosystem (Web + Mobile + Admin) |
| **3** | `expo-web-api`          | `template/expo-web-api`          | `expo` + `admin` + `api`                     | Mobile-first product with dedicated Admin Backoffice    |
| **4** | `flutter-web-admin-api` | `template/flutter-web-admin-api` | `flutter` + `web` + `admin` + `api`          | Flutter cross-platform mobile + Next.js Web & Admin     |
| **5** | `flutter-web-api`       | `template/flutter-web-api`       | `flutter` + `admin` + `api`                  | Flutter Mobile app with Next.js Super Admin portal      |
| **6** | `web-admin-api`         | `template/web-admin-api`         | `web` + `admin` + `api`                      | SaaS platform with Public Landing/App + Admin Dashboard |
| **7** | `web-api`               | `template/web-api`               | `web` + `api`                                | Clean baseline for modern web applications & APIs       |

---

## 2. Method A: GitHub Native "Use this template" Button

### Step 1: Enable Template Setting on GitHub (One-Time Setup)

1. Go to your repository settings:
   👉 **[https://github.com/adnanmahmud0/fullstack-turborepo-starter-kit-v2/settings](https://github.com/adnanmahmud0/fullstack-turborepo-starter-kit-v2/settings)**
2. In the **General** section (near the top under Repository Name):
3. Check the box: **☑ Template repository**
   _(“Template repositories let users generate new repositories with the same directory structure and files.”)_

---

### Step 2: Use the Template to Create a New Repository

1. On the repository main page, click the green **"Use this template"** button at the top right, then select **"Create a new repository"**.
2. **Crucial**: Check the box **☑ Include all branches**.
   - If checked, GitHub will copy all 7 branch variants into your new repository.
   - If unchecked, GitHub only copies the default `main` branch.
3. Enter your new repository name (e.g. `my-awesome-startup`) and click **Create repository**.
4. In your new repository:
   - If you want a specific variant (e.g. `web-admin-api`) as your default branch:
     - Go to **Settings** > **Branches**.
     - Under **Default branch**, click the switch arrows icon 🔀 and choose `web-admin-api`.
     - Click **Update** -> **I understand, update the default branch**.

---

## 3. Method B: GitHub Actions 1-Click Cloud Generator

You can spawn a brand new GitHub repository directly from your browser with **zero command line tools**!

### Requirements:

1. Create a GitHub Personal Access Token (classic) with `repo` scope at **[github.com/settings/tokens](https://github.com/settings/tokens)**.
2. In this repo, go to **Settings** > **Secrets and variables** > **Actions**.
3. Add a new secret named `GH_PAT` and paste your token.

### How to Run:

1. Go to the **Actions** tab in this repository.
2. Select **"Create Project from Template Branch"** on the left sidebar.
3. Click **Run workflow** on the right:
   - **Select Template Variant Branch**: Choose your stack (e.g. `web-api`, `expo-web-admin-api`, etc.).
   - **New Repository Name**: Enter project name (e.g. `my-saas-platform`).
   - **Repository Visibility**: `private` or `public`.
   - **Repository Description**: Optional short description.
4. Click the green **Run workflow** button.
5. In ~10 seconds, the workflow:
   - Creates the new repository on GitHub under your account.
   - Clones only the chosen template branch.
   - Re-initializes clean git history on `main`.
   - Pushes the code directly to your new repository!

---

## 4. Method C: Interactive CLI Generator

Run the built-in generator script directly from your terminal:

```bash
npm run create
```

Or run the platform-specific scripts:

- **Windows (PowerShell)**: `.\create-project.ps1`
- **macOS / Linux (Bash)**: `./create-project.sh`

### What it does interactively:

1. Asks for your new project directory name (e.g., `my-saas-platform`).
2. Presents a selection menu of all 7 template variants.
3. Clones only that variant branch.
4. Auto-creates `.env` from `.env.example`.
5. Updates `package.json` with the new project name.
6. Initializes a fresh `git` repository with initial commit on `main`.
7. Prompts for your new GitHub repo URL and optionally pushes immediately!

### Non-Interactive / CLI Flags:

```bash
# Example: create from web-admin-api with automated git setup
node scripts/create-project.mjs my-app --branch web-admin-api --remote https://github.com/username/my-app.git
```

---

## 5. Method D: Direct 1-Line Git Clone

If you prefer pure `git` commands, you can clone any specific variant branch in a single command:

```bash
# 1. Clone only the specific template branch
git clone --depth 1 --branch web-admin-api https://github.com/adnanmahmud0/fullstack-turborepo-starter-kit-v2.git my-saas-app

# 2. Navigate to project
cd my-saas-app

# 3. Disconnect template git history & start fresh
rm -rf .git
git init -b main

# 4. Connect to your own GitHub repository
git remote add origin https://github.com/YOUR_USERNAME/my-saas-app.git
git add .
git commit -m "feat: initial commit from web-admin-api starter kit"
git push -u origin main
```
