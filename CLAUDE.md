# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Inmeta Games — a Turborepo monorepo for an internal tournament/scoreboard web app. Uses Next.js 14 (App Router) with an embedded Sanity CMS Studio. User-facing text is in **Norwegian**; code identifiers are in English.

## Commands

```bash
npm run dev          # Start all apps in dev mode
npm run build        # Build all packages/apps
npm run lint         # Lint all packages
npm run typecheck    # Type-check all packages
npm run format       # Prettier (ts, tsx, md)

# Filter to specific app
npx turbo dev --filter=inmeta-games-web

# Add shadcn/ui component to shared package
cd packages/ui && npm run ui:add

# Add shadcn/ui component to web app
cd apps/inmeta-games-web && npx shadcn@latest add <component>
```

No test framework is configured. Node.js >=24 and npm are required.

## Monorepo Structure

- **`apps/inmeta-games-web`** — Next.js 14 app with embedded Sanity Studio at `/studio`
- **`packages/ui`** (`@inmeta/ui`) — Shared shadcn/ui component library (Radix + CVA + Tailwind)
- **`packages/config-eslint`** (`@inmeta/eslint-config`) — Shared ESLint configs
- **`packages/config-typescript`** (`@inmeta/typescript-config`) — Shared tsconfig bases

## Architecture

### Route Groups

The web app uses two Next.js route groups with separate layouts:
- `src/app/(web)/` — Public site (ThemeProvider, Inter font, globals.css)
- `src/app/(sanity)/` — Sanity Studio (minimal layout, no theme provider)

### Sanity CMS

- Schema types: `tournament`, `person` (documents); `game`, `tournamentPointRules` (objects)
- Data fetching: GROQ queries in `src/lib/sanity/queries.ts` via `client.fetch()` with ISR
- Env vars: `NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET` (validated in `sanity/env.ts`)
- Path alias: `@/*` maps to `./src/*`

### Scoring Logic

Scoreboard calculation is in `src/lib/utils.ts` — `calculateScoreboard()` traverses game results and applies configurable `TournamentPointRules` from Sanity. Runs server-side in RSCs.

### Styling

Tailwind CSS with shadcn/ui design tokens (CSS variables, `slate` base). Dark mode via `class` strategy + `next-themes`. Component variants use `class-variance-authority`. Class merging via `cn()` utility (clsx + tailwind-merge).

## Important Gotchas

- **`organiziers` typo**: The field is consistently misspelled as `organiziers` (not `organizers`) across Sanity schemas, TypeScript types, and GROQ queries. Do not fix without a Sanity data migration.
- **Dual shadcn installs**: The web app has its own `src/components/ui/` alongside `packages/ui`. They are separate — the app does not import from `@inmeta/ui`.
- **ISR caching**: Pages use `revalidate = 300` (page-level) and `next: { revalidate: 60 }` (per-fetch). Sanity CDN is disabled (`useCdn = false`).
- **Security headers**: `next.config.mjs` sets restrictive CSP, HSTS, X-Frame-Options on all routes.
- **No auth**: No user-facing authentication. Sanity Studio handles its own auth via sanity.io.
- **README references pnpm**: The README is outdated — the project migrated to npm.
