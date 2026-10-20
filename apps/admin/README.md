# @repo/admin

Production-ready **Next.js 16 Super Admin Portal** for the Fullstack Turborepo Starter Kit.

## Features

- **Next.js 16 (App Router)** with React 19 and Turbopack compiler.
- **Tailwind CSS v4** theming with full Dark / Light mode switching.
- **Single Root `.env`**: Configured via `dotenv-cli` reading root `.env`.
- **Role-Based Access Control (RBAC)**: Route protection for `/users`, `/settings`, `/analytics`.
- **Unified Port Mapping**: Runs on port `3001` (`http://localhost:3001`).
- **Live Backend Health Monitoring**: Direct connectivity indicator pinging Express API on `:5000`.

## Scripts

- `npm run dev`: Starts the Next.js dev server on port `3001`.
- `npm run build`: Generates optimized production build with Turbopack.
- `npm run lint`: Validates code against Next.js Core Web Vitals and TypeScript ESLint.
- `npm run typecheck`: Runs TypeScript `tsc --noEmit`.
