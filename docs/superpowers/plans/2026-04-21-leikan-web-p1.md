# Leikan Web — P1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bootstrap `apps/web` — a Next.js + Payload v3 app with Nidaros v4 design, all P1 collections, and Railway deploy.

**Architecture:** Next.js App Router with Payload v3 embedded as route handlers. Public frontend in `(frontend)` route group, Payload admin at `/admin`. Postgres on Railway via `@payloadcms/db-postgres`, images via Railway Storage Buckets using `@payloadcms/storage-s3`.

**Tech Stack:** Next.js (latest via bun), Payload v3, Postgres, Tailwind CSS, Archivo Black + IBM Plex Mono + DM Serif Display (Google Fonts), Bun test runner, TypeScript.

---

## File Map

```
apps/web/
├── src/
│   ├── app/
│   │   ├── (frontend)/
│   │   │   ├── layout.tsx            ← Nav + providers
│   │   │   ├── globals.css           ← Nidaros v4 CSS tokens + Tailwind base
│   │   │   ├── page.tsx              ← Home
│   │   │   ├── tournaments/[slug]/page.tsx
│   │   │   ├── games/[id]/page.tsx
│   │   │   ├── players/page.tsx
│   │   │   └── players/[id]/page.tsx
│   │   └── (payload)/
│   │       ├── admin/[[...segments]]/page.tsx
│   │       └── api/[...slug]/route.ts
│   ├── collections/
│   │   ├── Users.ts
│   │   ├── Players.ts
│   │   ├── GameTypes.ts
│   │   ├── Tournaments.ts
│   │   ├── Games.ts
│   │   └── Media.ts
│   ├── globals/
│   │   └── SiteSettings.ts
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Avatar.tsx
│   │   │   ├── Button.tsx
│   │   │   ├── Chip.tsx
│   │   │   ├── Icon.tsx
│   │   │   ├── JerseyNumber.tsx
│   │   │   ├── FormCell.tsx
│   │   │   ├── SectionBar.tsx
│   │   │   └── BadgeHex.tsx
│   │   └── layout/
│   │       └── Nav.tsx
│   ├── lib/
│   │   ├── payload.ts                ← getPayload singleton helper
│   │   ├── theme.ts                  ← makeTheme() + token types
│   │   └── scoreboard.ts             ← calculateScoreboard + auto-stats
│   └── payload-types.ts              ← auto-generated, do not edit
├── payload.config.ts
├── next.config.mjs
├── tailwind.config.ts
├── .env.local                        ← gitignored, local dev secrets
└── package.json
```

---

## Task 1: Bootstrap apps/web

**Files:**
- Create: `apps/web/` (new Next.js app)

- [ ] **Step 1: Run create-next-app**

From monorepo root:
```bash
cd apps
bun create next-app@latest web --typescript --tailwind --app --no-src-dir --import-alias "@/*"
```
When prompted, accept all defaults. This creates `apps/web/` with TypeScript, Tailwind, App Router.

- [ ] **Step 2: Verify it runs**

```bash
cd web
bun dev
```
Expected: `✓ Ready on http://localhost:3000`

- [ ] **Step 3: Add to turborepo**

In `apps/web/package.json`, confirm `"name": "web"` is set. Then from monorepo root:
```bash
cd ../..
bun install
```

- [ ] **Step 4: Clean Next.js boilerplate**

Delete `apps/web/src/app/page.tsx` content and replace with:
```tsx
export default function Page() {
  return <main>Leikan</main>
}
```

Delete `apps/web/src/app/globals.css` content (keep the file, we fill it in Task 9).

- [ ] **Step 5: Commit**

```bash
git add apps/web
git commit -m "feat: bootstrap apps/web with Next.js"
```

---

## Task 2: Install and configure Payload v3

**Files:**
- Create: `apps/web/payload.config.ts`
- Create: `apps/web/src/app/(payload)/admin/[[...segments]]/page.tsx`
- Create: `apps/web/src/app/(payload)/api/[...slug]/route.ts`
- Modify: `apps/web/next.config.mjs`
- Modify: `apps/web/package.json`

- [ ] **Step 1: Install Payload packages**

```bash
cd apps/web
bun add payload @payloadcms/next @payloadcms/db-postgres @payloadcms/richtext-lexical @payloadcms/ui
bun add @payloadcms/storage-s3
```

- [ ] **Step 2: Create payload.config.ts**

```typescript
// apps/web/payload.config.ts
import path from 'path'
import { fileURLToPath } from 'url'
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: 'users',
  },
  collections: [],  // filled in later tasks
  globals: [],      // filled in later tasks
  editor: lexicalEditor({}),
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL,
    },
  }),
  plugins: [
    s3Storage({
      collections: { media: true },
      bucket: process.env.S3_BUCKET ?? '',
      config: {
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID ?? '',
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY ?? '',
        },
        region: process.env.S3_REGION ?? 'auto',
        endpoint: process.env.S3_ENDPOINT,
      },
    }),
  ],
  secret: process.env.PAYLOAD_SECRET ?? 'dev-secret-change-in-prod',
  typescript: {
    outputFile: path.resolve(dirname, 'src/payload-types.ts'),
  },
})
```

- [ ] **Step 3: Create Payload admin route**

```bash
mkdir -p src/app/\(payload\)/admin/\[\[...segments\]\]
```

```tsx
// apps/web/src/app/(payload)/admin/[[...segments]]/page.tsx
import { RootPage, generatePageMetadata } from '@payloadcms/next/views'
import { importMap } from '../importMap'

type Args = {
  params: Promise<{ segments: string[] }>
  searchParams: Promise<{ [key: string]: string | string[] }>
}

export const generateMetadata = ({ params, searchParams }: Args) =>
  generatePageMetadata({ config: import('../../../../payload.config'), params, searchParams })

export default function Page({ params, searchParams }: Args) {
  return RootPage({ config: import('../../../../payload.config'), params, searchParams, importMap })
}
```

Create the importMap file:
```typescript
// apps/web/src/app/(payload)/importMap.ts
export const importMap = {}
```

- [ ] **Step 4: Create Payload API route**

```bash
mkdir -p src/app/\(payload\)/api/\[...slug\]
```

```typescript
// apps/web/src/app/(payload)/api/[...slug]/route.ts
import { REST_DELETE, REST_GET, REST_OPTIONS, REST_PATCH, REST_POST, REST_PUT } from '@payloadcms/next/routes'
import config from '../../../../payload.config'

export const GET    = REST_GET(config)
export const POST   = REST_POST(config)
export const DELETE = REST_DELETE(config)
export const PATCH  = REST_PATCH(config)
export const PUT    = REST_PUT(config)
export const OPTIONS = REST_OPTIONS(config)
```

- [ ] **Step 5: Wrap next.config.mjs with withPayload**

```javascript
// apps/web/next.config.mjs
import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {}

export default withPayload(nextConfig)
```

- [ ] **Step 6: Create .env.local**

```bash
# apps/web/.env.local
DATABASE_URL=postgresql://localhost:5432/leikan_dev
PAYLOAD_SECRET=change-this-to-random-32-char-string
S3_BUCKET=leikan-media
S3_ACCESS_KEY_ID=
S3_SECRET_ACCESS_KEY=
S3_REGION=auto
S3_ENDPOINT=
```

Confirm `.env.local` is in `.gitignore` (Next.js does this by default).

- [ ] **Step 7: Start local Postgres and verify Payload boots**

```bash
# Requires local Postgres. Create the database:
createdb leikan_dev
# Or with psql:
# psql -c "CREATE DATABASE leikan_dev"

bun dev
```

Expected: `✓ Ready on http://localhost:3000`, visit `http://localhost:3000/admin` → Payload setup screen.

- [ ] **Step 8: Commit**

```bash
git add apps/web
git commit -m "feat: install and configure Payload v3 with Postgres"
```

---

## Task 3: Users collection + auth

**Files:**
- Create: `apps/web/src/collections/Users.ts`
- Modify: `apps/web/payload.config.ts`

- [ ] **Step 1: Create Users collection**

```typescript
// apps/web/src/collections/Users.ts
import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      options: ['admin', 'user'],
      defaultValue: ['user'],
      required: true,
      saveToJWT: true,
      access: {
        update: ({ req: { user } }) =>
          Boolean(user?.roles?.includes('admin')),
      },
    },
  ],
}
```

- [ ] **Step 2: Add Users to payload.config.ts**

```typescript
// apps/web/payload.config.ts  — update collections array
import { Users } from './src/collections/Users'

// ...
collections: [Users],
```

- [ ] **Step 3: Regenerate types and verify admin**

```bash
bun run payload generate:types
bun dev
```

Visit `http://localhost:3000/admin`, create first admin user. Expected: login works, Users collection visible in admin.

- [ ] **Step 4: Commit**

```bash
git add apps/web/src/collections/Users.ts apps/web/payload.config.ts apps/web/src/payload-types.ts
git commit -m "feat: add Users collection with admin/user roles"
```

---

## Task 4: Content collections — Players and GameTypes

**Files:**
- Create: `apps/web/src/collections/Players.ts`
- Create: `apps/web/src/collections/GameTypes.ts`
- Create: `apps/web/src/collections/Media.ts`
- Modify: `apps/web/payload.config.ts`

- [ ] **Step 1: Create Media collection**

```typescript
// apps/web/src/collections/Media.ts
import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  upload: {
    imageSizes: [
      { name: 'thumbnail', width: 300, height: 300, position: 'centre' },
      { name: 'medium', width: 800, height: 800, position: 'centre' },
      { name: 'large', width: 1600, height: 1600, position: 'centre' },
    ],
    adminThumbnail: 'thumbnail',
    mimeTypes: ['image/*'],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
    },
  ],
}
```

- [ ] **Step 2: Create GameTypes collection**

```typescript
// apps/web/src/collections/GameTypes.ts
import type { CollectionConfig } from 'payload'

export const GameTypes: CollectionConfig = {
  slug: 'game-types',
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'slug',
      type: 'text',
      required: true,
      admin: { description: 'dart, sjakk, discgolf, bar-quiz, …' },
    },
    {
      name: 'icon',
      type: 'text',
      admin: { description: 'Emoji: 🎯 🏓 ⛳' },
    },
  ],
}
```

- [ ] **Step 3: Create Players collection**

```typescript
// apps/web/src/collections/Players.ts
import type { CollectionConfig } from 'payload'

export const Players: CollectionConfig = {
  slug: 'players',
  admin: {
    useAsTitle: 'firstName',
  },
  fields: [
    { name: 'firstName', type: 'text', required: true },
    { name: 'lastName',  type: 'text', required: true },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'nickname',
      type: 'text',
      admin: { description: 'Vis på scoreboard — eks. «Grandmester»' },
    },
    {
      name: 'homeBase',
      type: 'text',
      admin: { description: 'Trondheim-bydel: Byåsen, Lade, Møllenberg, …' },
    },
    {
      name: 'signatureGame',
      type: 'relationship',
      relationTo: 'game-types',
    },
    {
      name: 'funFact',
      type: 'text',
    },
  ],
}
```

- [ ] **Step 4: Register all three in payload.config.ts**

```typescript
import { Users }     from './src/collections/Users'
import { Media }     from './src/collections/Media'
import { GameTypes } from './src/collections/GameTypes'
import { Players }   from './src/collections/Players'

// ...
collections: [Users, Media, GameTypes, Players],
```

- [ ] **Step 5: Regenerate types and smoke test**

```bash
bun run payload generate:types
bun dev
```

Visit `/admin` → verify GameTypes, Players, Media appear in sidebar. Create one GameType (e.g. "Dart", slug "dart", icon "🎯"). Expected: saves successfully.

- [ ] **Step 6: Commit**

```bash
git add apps/web/src/collections/ apps/web/payload.config.ts apps/web/src/payload-types.ts
git commit -m "feat: add Media, GameTypes, Players collections"
```

---

## Task 5: Content collections — Tournaments and Games

**Files:**
- Create: `apps/web/src/collections/Tournaments.ts`
- Create: `apps/web/src/collections/Games.ts`
- Modify: `apps/web/payload.config.ts`

- [ ] **Step 1: Create Tournaments collection**

```typescript
// apps/web/src/collections/Tournaments.ts
import type { CollectionConfig } from 'payload'

export const Tournaments: CollectionConfig = {
  slug: 'tournaments',
  admin: { useAsTitle: 'name' },
  fields: [
    { name: 'name',  type: 'text', required: true },
    { name: 'slug',  type: 'text', required: true },
    {
      name: 'status',
      type: 'select',
      options: ['planned', 'active', 'finished'],
      defaultValue: 'planned',
      required: true,
    },
    { name: 'startDate',   type: 'date' },
    { name: 'year',        type: 'number' },
    { name: 'coverImage',  type: 'upload', relationTo: 'media' },
    { name: 'posterImage', type: 'upload', relationTo: 'media' },
    {
      name: 'pointRules',
      type: 'group',
      fields: [
        { name: 'participation',               type: 'number', defaultValue: 3 },
        { name: 'firstPlace',                  type: 'number', defaultValue: 3 },
        { name: 'secondPlace',                 type: 'number', defaultValue: 2 },
        { name: 'thirdPlace',                  type: 'number', defaultValue: 1 },
        { name: 'organizedWithParticipation',  type: 'number', defaultValue: 1 },
        { name: 'organizedWithoutParticipation', type: 'number', defaultValue: 3 },
        { name: 'spectator',                   type: 'number', defaultValue: 1 },
      ],
    },
  ],
}
```

- [ ] **Step 2: Create Games collection**

```typescript
// apps/web/src/collections/Games.ts
import type { CollectionConfig } from 'payload'

export const Games: CollectionConfig = {
  slug: 'games',
  admin: { useAsTitle: 'name' },
  fields: [
    { name: 'name',       type: 'text', required: true },
    { name: 'tournament', type: 'relationship', relationTo: 'tournaments', required: true },
    { name: 'gameType',   type: 'relationship', relationTo: 'game-types' },
    { name: 'date',       type: 'date' },
    {
      name: 'status',
      type: 'select',
      options: ['planned', 'scheduled', 'live', 'done', 'cancelled'],
      defaultValue: 'planned',
    },
    { name: 'location', type: 'text' },
    { name: 'duration', type: 'number', admin: { description: 'Minutter' } },
    {
      name: 'format',
      type: 'select',
      options: ['placement', 'score', 'time', 'bracket'],
      defaultValue: 'placement',
    },

    // Deltakelse
    { name: 'organizers',   type: 'relationship', relationTo: 'players', hasMany: true },
    { name: 'participants', type: 'relationship', relationTo: 'players', hasMany: true },
    { name: 'spectators',   type: 'relationship', relationTo: 'players', hasMany: true },

    // Plasseringer
    { name: 'firstPlace',  type: 'relationship', relationTo: 'players', hasMany: true },
    { name: 'secondPlace', type: 'relationship', relationTo: 'players', hasMany: true },
    { name: 'thirdPlace',  type: 'relationship', relationTo: 'players', hasMany: true },

    // Innhold
    {
      name: 'gallery',
      type: 'array',
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media', required: true },
      ],
    },
    { name: 'heroPhoto', type: 'upload', relationTo: 'media' },
    { name: 'story',     type: 'richText' },
    {
      name: 'highlights',
      type: 'array',
      fields: [
        { name: 'quote',  type: 'text', required: true },
        { name: 'player', type: 'relationship', relationTo: 'players' },
      ],
    },

    // Tidsbasert
    {
      name: 'timeResults',
      type: 'array',
      admin: { condition: (data) => data.format === 'time' },
      fields: [
        { name: 'player',  type: 'relationship', relationTo: 'players', required: true },
        { name: 'round',   type: 'number', required: true },
        { name: 'lapTime', type: 'text',   required: true },
      ],
    },

    // Bracket
    {
      name: 'bracketType',
      type: 'select',
      options: ['single_elimination', 'double_elimination', 'round_robin'],
      admin: { condition: (data) => data.format === 'bracket' },
    },
    {
      name: 'bracketData',
      type: 'json',
      admin: { condition: (data) => data.format === 'bracket' },
    },
  ],
}
```

- [ ] **Step 3: Register in payload.config.ts**

```typescript
import { Tournaments } from './src/collections/Tournaments'
import { Games }       from './src/collections/Games'

collections: [Users, Media, GameTypes, Players, Tournaments, Games],
```

- [ ] **Step 4: Regenerate types and verify**

```bash
bun run payload generate:types
bun dev
```

In `/admin`: create a tournament (name "Inmeta Games 2024", slug "inmeta-games-2024", status "active"). Create a game under it. Expected: saves, references resolve.

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/collections/ apps/web/payload.config.ts apps/web/src/payload-types.ts
git commit -m "feat: add Tournaments and Games collections"
```

---

## Task 6: SiteSettings global

**Files:**
- Create: `apps/web/src/globals/SiteSettings.ts`
- Modify: `apps/web/payload.config.ts`

- [ ] **Step 1: Create SiteSettings global**

```typescript
// apps/web/src/globals/SiteSettings.ts
import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  admin: { group: 'Settings' },
  fields: [
    {
      name: 'accentColor',
      type: 'select',
      options: ['neon', 'signal', 'forest', 'red', 'blue'],
      defaultValue: 'neon',
    },
    {
      name: 'themeMode',
      type: 'select',
      options: ['light', 'dark', 'system'],
      defaultValue: 'system',
    },
    {
      type: 'collapsible',
      label: 'Auto-utleda stats',
      fields: [
        { name: 'showTettasteDuell',       type: 'checkbox', defaultValue: true },
        { name: 'showLengstePodiumStripe', type: 'checkbox', defaultValue: true },
        { name: 'showComebackOfTheYear',   type: 'checkbox', defaultValue: true },
        { name: 'showDebutantensSjokk',    type: 'checkbox', defaultValue: true },
        { name: 'showMestAktivArrangor',   type: 'checkbox', defaultValue: true },
        { name: 'showSpellKongar',         type: 'checkbox', defaultValue: true },
        {
          name: 'showBydelskamp',
          type: 'checkbox',
          defaultValue: false,
          admin: { description: 'Krev homeBase på alle spillere' },
        },
        {
          name: 'showNemesis',
          type: 'checkbox',
          defaultValue: false,
          admin: { description: 'Potensielt negativt — opt-in per person' },
        },
        { name: 'showActivityFeed', type: 'checkbox', defaultValue: true },
      ],
    },
  ],
}
```

- [ ] **Step 2: Register in payload.config.ts**

```typescript
import { SiteSettings } from './src/globals/SiteSettings'

// ...
globals: [SiteSettings],
```

- [ ] **Step 3: Verify**

```bash
bun run payload generate:types
bun dev
```

In `/admin` sidebar: "Site Settings" global appears. Expected: can toggle flags, saves.

- [ ] **Step 4: Commit**

```bash
git add apps/web/src/globals/ apps/web/payload.config.ts apps/web/src/payload-types.ts
git commit -m "feat: add SiteSettings global with feature flags and theme config"
```

---

## Task 7: Payload query helper + scoreboard utilities (TDD)

**Files:**
- Create: `apps/web/src/lib/payload.ts`
- Create: `apps/web/src/lib/scoreboard.ts`
- Create: `apps/web/src/lib/scoreboard.test.ts`

- [ ] **Step 1: Create getPayload singleton**

```typescript
// apps/web/src/lib/payload.ts
import { getPayload as getPayloadBase } from 'payload'
import config from '../../payload.config'

export const getPayload = () => getPayloadBase({ config })
```

- [ ] **Step 2: Write failing tests for calculateScoreboard**

```typescript
// apps/web/src/lib/scoreboard.test.ts
import { describe, expect, test } from 'bun:test'
import { calculateScoreboard, type GameResult, type PointRules } from './scoreboard'

const defaultRules: PointRules = {
  participation: 3,
  firstPlace: 3,
  secondPlace: 2,
  thirdPlace: 1,
  organizedWithParticipation: 1,
  organizedWithoutParticipation: 3,
  spectator: 1,
}

describe('calculateScoreboard', () => {
  test('awards participation points', () => {
    const games: GameResult[] = [{
      participants: ['alice'],
      firstPlace: ['alice'],
      secondPlace: [],
      thirdPlace: [],
      organizers: [],
      spectators: [],
    }]
    const board = calculateScoreboard(games, defaultRules)
    // alice gets participation (3) + firstPlace (3) = 6
    expect(board.find(e => e.playerId === 'alice')?.points).toBe(6)
  })

  test('organizer without participation gets organizedWithoutParticipation points', () => {
    const games: GameResult[] = [{
      participants: ['alice'],
      firstPlace: ['alice'],
      secondPlace: [],
      thirdPlace: [],
      organizers: ['bob'],
      spectators: [],
    }]
    const board = calculateScoreboard(games, defaultRules)
    expect(board.find(e => e.playerId === 'bob')?.points).toBe(3)
  })

  test('organizer with participation gets organizedWithParticipation points', () => {
    const games: GameResult[] = [{
      participants: ['alice'],
      firstPlace: ['alice'],
      secondPlace: [],
      thirdPlace: [],
      organizers: ['alice'],
      spectators: [],
    }]
    const board = calculateScoreboard(games, defaultRules)
    // alice: participation(3) + firstPlace(3) + organizedWithParticipation(1) = 7
    expect(board.find(e => e.playerId === 'alice')?.points).toBe(7)
  })

  test('sorts by points descending', () => {
    const games: GameResult[] = [{
      participants: ['alice', 'bob'],
      firstPlace: ['alice'],
      secondPlace: ['bob'],
      thirdPlace: [],
      organizers: [],
      spectators: [],
    }]
    const board = calculateScoreboard(games, defaultRules)
    expect(board[0].playerId).toBe('alice')
    expect(board[1].playerId).toBe('bob')
  })

  test('handles empty games array', () => {
    expect(calculateScoreboard([], defaultRules)).toEqual([])
  })
})
```

- [ ] **Step 3: Run test to verify it fails**

```bash
cd apps/web
bun test src/lib/scoreboard.test.ts
```

Expected: FAIL — `Cannot find module './scoreboard'`

- [ ] **Step 4: Implement calculateScoreboard**

```typescript
// apps/web/src/lib/scoreboard.ts
export type PointRules = {
  participation: number
  firstPlace: number
  secondPlace: number
  thirdPlace: number
  organizedWithParticipation: number
  organizedWithoutParticipation: number
  spectator: number
}

export type GameResult = {
  participants: string[]
  firstPlace: string[]
  secondPlace: string[]
  thirdPlace: string[]
  organizers: string[]
  spectators: string[]
}

export type ScoreboardEntry = {
  playerId: string
  points: number
  gamesPlayed: number
  wins: number
  secondPlaces: number
  thirdPlaces: number
  gamesOrganized: number
}

export function calculateScoreboard(
  games: GameResult[],
  rules: PointRules,
): ScoreboardEntry[] {
  const map = new Map<string, ScoreboardEntry>()

  const get = (id: string): ScoreboardEntry => {
    if (!map.has(id)) {
      map.set(id, { playerId: id, points: 0, gamesPlayed: 0, wins: 0, secondPlaces: 0, thirdPlaces: 0, gamesOrganized: 0 })
    }
    return map.get(id)!
  }

  for (const game of games) {
    const didParticipate = new Set(game.participants)

    for (const id of game.participants) {
      const e = get(id)
      e.points += rules.participation
      e.gamesPlayed += 1
    }
    for (const id of game.firstPlace) {
      const e = get(id)
      e.points += rules.firstPlace
      e.wins += 1
    }
    for (const id of game.secondPlace) {
      const e = get(id)
      e.points += rules.secondPlace
      e.secondPlaces += 1
    }
    for (const id of game.thirdPlace) {
      const e = get(id)
      e.points += rules.thirdPlace
      e.thirdPlaces += 1
    }
    for (const id of game.organizers) {
      const e = get(id)
      e.gamesOrganized += 1
      if (didParticipate.has(id)) {
        e.points += rules.organizedWithParticipation
      } else {
        e.points += rules.organizedWithoutParticipation
      }
    }
    for (const id of game.spectators) {
      const e = get(id)
      e.points += rules.spectator
    }
  }

  return Array.from(map.values()).sort((a, b) => b.points - a.points)
}
```

- [ ] **Step 5: Run tests and verify pass**

```bash
bun test src/lib/scoreboard.test.ts
```

Expected: All 5 tests pass.

- [ ] **Step 6: Commit**

```bash
git add apps/web/src/lib/
git commit -m "feat: add scoreboard calculation utility with tests"
```

---

## Task 8: Nidaros v4 design tokens

**Files:**
- Create: `apps/web/src/lib/theme.ts`
- Modify: `apps/web/src/app/(frontend)/globals.css`
- Modify: `apps/web/tailwind.config.ts`

- [ ] **Step 1: Create theme.ts with token types and makeTheme**

```typescript
// apps/web/src/lib/theme.ts
export type AccentId = 'neon' | 'signal' | 'forest' | 'red' | 'blue'
export type ThemeMode = 'light' | 'dark'

type AccentPalette = { base: string; alt: string; ink: string }
type AccentDef = { id: AccentId; name: string; light: AccentPalette; dark: AccentPalette }

export const V4_ACCENTS: Record<AccentId, AccentDef> = {
  neon:   { id: 'neon',   name: 'Neon-grøn',      light: { base: '#058a4a', alt: '#44f291', ink: '#ffffff' }, dark: { base: '#44f291', alt: '#44f291', ink: '#00231a' } },
  signal: { id: 'signal', name: 'Signal-grøn',    light: { base: '#0a7a3c', alt: '#1fa85c', ink: '#ffffff' }, dark: { base: '#4cc97c', alt: '#6fd894', ink: '#002418' } },
  forest: { id: 'forest', name: 'Skog-grøn',      light: { base: '#2c5a3a', alt: '#3d7a50', ink: '#ffffff' }, dark: { base: '#6aa87c', alt: '#7db890', ink: '#0c2418' } },
  red:    { id: 'red',    name: 'Rosenborg-raud',  light: { base: '#c00020', alt: '#e01830', ink: '#ffffff' }, dark: { base: '#ff5668', alt: '#ff7080', ink: '#2a0008' } },
  blue:   { id: 'blue',  name: 'Nidaros-blå',     light: { base: '#1a52b0', alt: '#2f6fd4', ink: '#ffffff' }, dark: { base: '#6fa6f5', alt: '#88b8f8', ink: '#02142a' } },
}

export type Theme = {
  mode: ThemeMode
  bg: string; surface: string; surfaceAlt: string
  ink: string; inkDim: string; inkMuted: string
  line: string; lineSoft: string
  accent: string; accentAlt: string; accentInk: string
  warn: string; gold: string; silver: string; bronze: string
}

export function makeTheme(mode: ThemeMode, accentId: AccentId = 'neon'): Theme {
  const a = V4_ACCENTS[accentId]
  const acc = mode === 'light' ? a.light : a.dark
  return mode === 'light' ? {
    mode,
    bg: '#f4f4f2', surface: '#ffffff', surfaceAlt: '#e8e8e2',
    ink: '#0a0a08', inkDim: '#3a3a34', inkMuted: '#666660',
    line: '#cecec6', lineSoft: '#e0e0da',
    accent: acc.base, accentAlt: acc.alt, accentInk: acc.ink,
    warn: '#b02818', gold: '#a67820', silver: '#6a6a62', bronze: '#8a5828',
  } : {
    mode,
    bg: '#0a0a08', surface: '#141412', surfaceAlt: '#1e1e1a',
    ink: '#f4f4f0', inkDim: '#c0c0b6', inkMuted: '#8a8a80',
    line: '#2e2e28', lineSoft: '#1e1e1a',
    accent: acc.base, accentAlt: acc.alt, accentInk: acc.ink,
    warn: '#f06850', gold: '#e8b840', silver: '#c0c0b8', bronze: '#d8944a',
  }
}
```

- [ ] **Step 2: Set up globals.css with CSS custom properties**

```css
/* apps/web/src/app/(frontend)/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@import url('https://fonts.googleapis.com/css2?family=Archivo+Black&family=Archivo:wght@400;600&family=DM+Serif+Display:ital@0;1&family=IBM+Plex+Mono:wght@400;600&display=swap');

:root {
  --bg: #f4f4f2;
  --surface: #ffffff;
  --surface-alt: #e8e8e2;
  --ink: #0a0a08;
  --ink-dim: #3a3a34;
  --ink-muted: #666660;
  --line: #cecec6;
  --line-soft: #e0e0da;
  --accent: #058a4a;
  --accent-alt: #44f291;
  --accent-ink: #ffffff;
  --warn: #b02818;
  --gold: #a67820;
  --silver: #6a6a62;
  --bronze: #8a5828;
}

.dark {
  --bg: #0a0a08;
  --surface: #141412;
  --surface-alt: #1e1e1a;
  --ink: #f4f4f0;
  --ink-dim: #c0c0b6;
  --ink-muted: #8a8a80;
  --line: #2e2e28;
  --line-soft: #1e1e1a;
  --accent: #44f291;
  --accent-alt: #44f291;
  --accent-ink: #00231a;
  --warn: #f06850;
  --gold: #e8b840;
  --silver: #c0c0b8;
  --bronze: #d8944a;
}

* { box-sizing: border-box; }
body { background: var(--bg); color: var(--ink); font-family: 'Archivo', sans-serif; }

.font-display  { font-family: 'Archivo Black', sans-serif; letter-spacing: -0.01em; }
.font-mono     { font-family: 'IBM Plex Mono', monospace; text-transform: uppercase; letter-spacing: 0.12em; }
.font-serif    { font-family: 'DM Serif Display', serif; }
.font-num      { font-feature-settings: "tnum"; font-variant-numeric: tabular-nums; }
```

- [ ] **Step 3: Configure Tailwind with Nidaros tokens**

```typescript
// apps/web/tailwind.config.ts
import type { Config } from 'tailwindcss'

export default {
  content: ['./src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg:         'var(--bg)',
        surface:    'var(--surface)',
        'surface-alt': 'var(--surface-alt)',
        ink:        'var(--ink)',
        'ink-dim':  'var(--ink-dim)',
        'ink-muted':'var(--ink-muted)',
        line:       'var(--line)',
        'line-soft':'var(--line-soft)',
        accent:     'var(--accent)',
        'accent-alt': 'var(--accent-alt)',
        'accent-ink': 'var(--accent-ink)',
        warn:       'var(--warn)',
        gold:       'var(--gold)',
        silver:     'var(--silver)',
        bronze:     'var(--bronze)',
      },
      fontFamily: {
        display: ['"Archivo Black"', 'sans-serif'],
        sans: ['Archivo', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
        serif: ['"DM Serif Display"', 'serif'],
      },
      borderRadius: { DEFAULT: '0px' },
    },
  },
  plugins: [],
} satisfies Config
```

- [ ] **Step 4: Verify build**

```bash
bun dev
```

Visit `http://localhost:3000`. Expected: page uses Archivo font, dark/light CSS variables present in DevTools.

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/lib/theme.ts apps/web/src/app/\(frontend\)/globals.css apps/web/tailwind.config.ts
git commit -m "feat: add Nidaros v4 design tokens, CSS custom properties, Tailwind config"
```

---

## Task 9: Core UI components

**Files:**
- Create: `apps/web/src/components/ui/Avatar.tsx`
- Create: `apps/web/src/components/ui/Chip.tsx`
- Create: `apps/web/src/components/ui/Button.tsx`
- Create: `apps/web/src/components/ui/Icon.tsx`
- Create: `apps/web/src/components/ui/JerseyNumber.tsx`
- Create: `apps/web/src/components/ui/FormCell.tsx`
- Create: `apps/web/src/components/ui/SectionBar.tsx`

- [ ] **Step 1: Avatar**

```tsx
// apps/web/src/components/ui/Avatar.tsx
type AvatarProps = {
  initials: string
  size?: number
  tone?: number
  rank?: 1 | 2 | 3
  accentBorder?: boolean
}

const TONES_DARK  = ['#2a2a26','#2e2a24','#26302a','#2a2832','#302a28','#282e30']
const TONES_LIGHT = ['#d8d8d0','#ddd8ce','#cad8d0','#d2cedc','#dcd0cc','#d0d8dc']

export function Avatar({ initials, size = 40, tone = 0, rank, accentBorder }: AvatarProps) {
  const badgeSize = Math.max(18, size * 0.5)
  const badgeColors = ['var(--gold)', 'var(--silver)', 'var(--bronze)']
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <div style={{
        width: size, height: size, borderRadius: '50%',
        background: TONES_DARK[tone % TONES_DARK.length],
        border: `2px solid ${accentBorder ? 'var(--accent)' : 'var(--line)'}`,
        display: 'grid', placeItems: 'center',
        fontFamily: '"Archivo Black", sans-serif',
        fontSize: Math.max(11, size * 0.38),
        color: 'var(--ink)',
      }}>
        {initials}
      </div>
      {rank && (
        <div style={{
          position: 'absolute', bottom: -4, right: -4,
          width: badgeSize, height: badgeSize, borderRadius: '50%',
          background: badgeColors[rank - 1],
          color: '#fff',
          border: '2px solid var(--bg)',
          display: 'grid', placeItems: 'center',
          fontFamily: '"Archivo Black", sans-serif',
          fontSize: Math.max(11, badgeSize * 0.5),
        }}>
          {rank}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Chip**

```tsx
// apps/web/src/components/ui/Chip.tsx
import type { ReactNode } from 'react'

type ChipTone = 'default' | 'accent' | 'outline' | 'ink' | 'ghost'

type ChipProps = {
  children: ReactNode
  tone?: ChipTone
  className?: string
}

const STYLES: Record<ChipTone, string> = {
  default: 'bg-surface-alt text-ink border-line',
  accent:  'bg-accent text-accent-ink border-accent',
  outline: 'bg-transparent text-accent border-accent',
  ink:     'bg-ink text-bg border-ink',
  ghost:   'bg-transparent text-ink-dim border-line',
}

export function Chip({ children, tone = 'default', className = '' }: ChipProps) {
  return (
    <span className={`
      inline-flex items-center gap-1.5 px-3 py-1.5 border
      font-mono text-[13px] font-semibold
      ${STYLES[tone]} ${className}
    `}>
      {children}
    </span>
  )
}
```

- [ ] **Step 3: Button**

```tsx
// apps/web/src/components/ui/Button.tsx
import type { ReactNode } from 'react'

type ButtonTone = 'accent' | 'ink' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg'

type ButtonProps = {
  children: ReactNode
  tone?: ButtonTone
  size?: ButtonSize
  onClick?: () => void
  type?: 'button' | 'submit'
  className?: string
}

const TONE_STYLES: Record<ButtonTone, string> = {
  accent: 'bg-accent text-accent-ink border-accent hover:opacity-90',
  ink:    'bg-ink text-bg border-ink hover:opacity-90',
  ghost:  'bg-transparent text-ink border-line hover:border-ink',
}

const SIZE_STYLES: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-[13px]',
  md: 'px-5 py-3 text-[14px]',
  lg: 'px-6 py-3.5 text-[16px]',
}

export function Button({ children, tone = 'accent', size = 'md', onClick, type = 'button', className = '' }: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`
        inline-flex items-center gap-2 border border-1.5
        font-display tracking-wider uppercase
        transition-all duration-150 cursor-pointer
        ${TONE_STYLES[tone]} ${SIZE_STYLES[size]} ${className}
      `}
    >
      {children}
    </button>
  )
}
```

- [ ] **Step 4: Icon**

```tsx
// apps/web/src/components/ui/Icon.tsx
type IconName =
  | 'trophy' | 'medal' | 'target' | 'crown' | 'flame' | 'bolt' | 'star'
  | 'flag' | 'arrowUp' | 'arrowDown' | 'check' | 'dice' | 'sparkle'

type IconProps = {
  name: IconName
  size?: number
  stroke?: string
  strokeWidth?: number
  className?: string
}

const PATHS: Record<IconName, string> = {
  trophy:    'M7 4h10v4a5 5 0 0 1-10 0V4zM7 6H4v2a3 3 0 0 0 3 3M17 6h3v2a3 3 0 0 1-3 3M9 13h6l-1 4h-4l-1-4zM8 21h8',
  medal:     'M8 3l2 6m4-6l2 6m-10 0h12M12 15m-6 0a6 6 0 1 0 12 0a6 6 0 0 0-12 0',
  target:    'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0zM17 12a5 5 0 1 1-10 0 5 5 0 0 1 10 0',
  crown:     'M3 17h18l-2-10-4 4-3-6-3 6-4-4-2 10zM3 20h18',
  flame:     'M12 3s4 4 4 8a4 4 0 0 1-8 0c0-1 .5-2 1-2.5C9 10 10 11 10 12c0-3 2-5 2-9z',
  bolt:      'M13 2L4 14h7l-1 8 9-12h-7l1-8z',
  star:      'M12 2l3 7 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1 3-7z',
  flag:      'M4 21V4h12l-2 4 2 4H4M4 21v-8',
  arrowUp:   'M12 20V5M5 11l7-7 7 7',
  arrowDown: 'M12 4v15M5 13l7 7 7-7',
  check:     'M5 12l5 5 9-11',
  dice:      'M5 5m-1 0a1 1 0 1 0 2 0a1 1 0 0 0-2 0M5 19m-1 0a1 1 0 1 0 2 0a1 1 0 0 0-2 0M19 5m-1 0a1 1 0 1 0 2 0a1 1 0 0 0-2 0M19 19m-1 0a1 1 0 1 0 2 0a1 1 0 0 0-2 0M4 4h16v16H4z',
  sparkle:   'M12 3v6M12 15v6M3 12h6M15 12h6M6 6l3 3M15 15l3 3M6 18l3-3M15 9l3-3',
}

export function Icon({ name, size = 24, stroke = 'currentColor', strokeWidth = 2, className = '' }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`inline-block align-middle ${className}`}
    >
      <path d={PATHS[name] ?? PATHS.sparkle} />
    </svg>
  )
}
```

- [ ] **Step 5: JerseyNumber**

```tsx
// apps/web/src/components/ui/JerseyNumber.tsx
type JerseyNumberProps = {
  n: number | string
  size?: number
  highlight?: boolean
}

export function JerseyNumber({ n, size = 40, highlight }: JerseyNumberProps) {
  return (
    <div
      style={{ minWidth: size, height: size, padding: '0 8px', fontSize: Math.max(13, size * 0.5) }}
      className={`
        grid place-items-center border-2 font-display font-num
        ${highlight
          ? 'bg-accent text-accent-ink border-accent'
          : 'bg-transparent text-ink border-line'
        }
      `}
    >
      {n}
    </div>
  )
}
```

- [ ] **Step 6: FormCell**

```tsx
// apps/web/src/components/ui/FormCell.tsx
type FormCellProps = {
  placement?: number | null
  size?: number
}

export function FormCell({ placement, size = 22 }: FormCellProps) {
  if (!placement || placement > 3) {
    return (
      <div
        style={{ width: size, height: size * 1.4 }}
        className="border border-line bg-transparent"
      />
    )
  }
  const bg = placement === 1 ? 'var(--gold)' : placement === 2 ? 'var(--silver)' : 'var(--bronze)'
  return (
    <div
      style={{ width: size, height: size * 1.4, background: bg, fontSize: Math.max(11, size * 0.55) }}
      className="grid place-items-center text-white font-display border border-line"
    >
      {placement}
    </div>
  )
}
```

- [ ] **Step 7: SectionBar**

```tsx
// apps/web/src/components/ui/SectionBar.tsx
import type { ReactNode } from 'react'

type SectionBarProps = {
  num?: number | string
  title: string
  subtitle?: string
  action?: ReactNode
}

export function SectionBar({ num, title, subtitle, action }: SectionBarProps) {
  return (
    <div className="flex items-center gap-4 px-5 py-4 bg-ink text-bg border-b-2 border-accent">
      {num != null && (
        <div className="min-w-8 h-8 px-2.5 bg-accent text-accent-ink grid place-items-center font-display text-base">
          {num}
        </div>
      )}
      <div className="flex-1">
        {subtitle && <div className="font-mono text-[13px] text-accent">{subtitle}</div>}
        <div className="font-display text-xl mt-0.5">{title}</div>
      </div>
      {action}
    </div>
  )
}
```

- [ ] **Step 8: Commit**

```bash
git add apps/web/src/components/
git commit -m "feat: add Nidaros v4 UI components (Avatar, Chip, Button, Icon, JerseyNumber, FormCell, SectionBar)"
```

---

## Task 10: Frontend layout — Nav and providers

**Files:**
- Create: `apps/web/src/components/layout/Nav.tsx`
- Create: `apps/web/src/app/(frontend)/layout.tsx`

- [ ] **Step 1: Create Nav**

```tsx
// apps/web/src/components/layout/Nav.tsx
import Link from 'next/link'

export function Nav() {
  return (
    <nav className="flex items-center justify-between px-8 py-3 border-b border-line bg-bg">
      <Link href="/" className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-full bg-accent border-2 border-ink" />
        <span className="font-display text-[17px] tracking-tight">
          TRØNDER<span className="text-accent">·</span>LEIKAN
        </span>
      </Link>
      <div className="flex gap-5 font-mono text-[11px] text-ink-muted">
        <Link href="/"           className="hover:text-ink transition-colors text-ink">Turneringa</Link>
        <Link href="/players"    className="hover:text-ink transition-colors">Spellaran</Link>
      </div>
    </nav>
  )
}
```

- [ ] **Step 2: Create frontend layout**

```tsx
// apps/web/src/app/(frontend)/layout.tsx
import './globals.css'
import type { ReactNode } from 'react'
import { Nav } from '@/components/layout/Nav'

export const metadata = {
  title: 'Trønder Leikan',
  description: 'Internt turneringssystem for Inmeta Trondheim',
}

export default function FrontendLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="nb" className="dark">
      <body>
        <Nav />
        <main>{children}</main>
      </body>
    </html>
  )
}
```

- [ ] **Step 3: Verify nav renders**

```bash
bun dev
```

Visit `http://localhost:3000`. Expected: black background, nav with "TRØNDER·LEIKAN" and links.

- [ ] **Step 4: Commit**

```bash
git add apps/web/src/components/layout/ apps/web/src/app/\(frontend\)/layout.tsx
git commit -m "feat: add frontend layout with Nav"
```

---

## Task 11: Home page

**Files:**
- Create: `apps/web/src/app/(frontend)/page.tsx`

- [ ] **Step 1: Create home page with Payload data**

```tsx
// apps/web/src/app/(frontend)/page.tsx
import { getPayload } from '@/lib/payload'
import { Avatar } from '@/components/ui/Avatar'
import { Chip } from '@/components/ui/Chip'
import { JerseyNumber } from '@/components/ui/JerseyNumber'
import { SectionBar } from '@/components/ui/SectionBar'
import { calculateScoreboard } from '@/lib/scoreboard'
import type { Game, Player, Tournament } from '@/payload-types'

export const revalidate = 60

export default async function HomePage() {
  const payload = await getPayload()

  const [tournamentsRes, gamesRes] = await Promise.all([
    payload.find({ collection: 'tournaments', where: { status: { equals: 'active' } }, limit: 1, depth: 1 }),
    payload.find({ collection: 'games', sort: '-date', limit: 4, depth: 2 }),
  ])

  const activeTournament = tournamentsRes.docs[0] as Tournament | undefined
  const recentGames = gamesRes.docs as Game[]

  // Build scoreboard from all games in active tournament
  let scoreboard: Awaited<ReturnType<typeof calculateScoreboard>> = []
  if (activeTournament) {
    const allGames = await payload.find({
      collection: 'games',
      where: { tournament: { equals: activeTournament.id } },
      limit: 100,
      depth: 2,
    })
    const rules = activeTournament.pointRules ?? {
      participation: 3, firstPlace: 3, secondPlace: 2, thirdPlace: 1,
      organizedWithParticipation: 1, organizedWithoutParticipation: 3, spectator: 1,
    }
    const gameResults = allGames.docs.map((g: Game) => ({
      participants: (g.participants as Player[] | undefined)?.map(p => String(p.id)) ?? [],
      firstPlace:   (g.firstPlace  as Player[] | undefined)?.map(p => String(p.id)) ?? [],
      secondPlace:  (g.secondPlace as Player[] | undefined)?.map(p => String(p.id)) ?? [],
      thirdPlace:   (g.thirdPlace  as Player[] | undefined)?.map(p => String(p.id)) ?? [],
      organizers:   (g.organizers  as Player[] | undefined)?.map(p => String(p.id)) ?? [],
      spectators:   (g.spectators  as Player[] | undefined)?.map(p => String(p.id)) ?? [],
    }))
    scoreboard = calculateScoreboard(gameResults, rules)
  }

  return (
    <div className="max-w-6xl mx-auto px-8 py-8">
      {/* Hero */}
      <div className="bg-ink text-bg p-8 mb-6 relative overflow-hidden">
        <div className="relative">
          <div className="font-mono text-[13px] text-accent mb-2">
            {activeTournament ? `◉ AKTIV · ${activeTournament.name}` : 'INGEN AKTIV TURNERING'}
          </div>
          <h1 className="font-display text-6xl leading-none">
            Trønder<br />
            <span className="text-accent">Leikan</span>
          </h1>
          {activeTournament && scoreboard[0] && (
            <div className="mt-6 flex items-baseline gap-3">
              <span className="font-mono text-[13px] text-ink-dim">LEIAR NO</span>
              <span className="font-display text-2xl">{scoreboard[0].playerId}</span>
              <span className="font-display text-4xl text-accent font-num">{scoreboard[0].points}p</span>
            </div>
          )}
        </div>
      </div>

      {/* Top 3 */}
      {scoreboard.length > 0 && (
        <div className="mb-6">
          <SectionBar title="Topp 3" subtitle="SCOREBOARD" />
          <div className="grid grid-cols-3 gap-3 p-4 bg-surface border border-line">
            {scoreboard.slice(0, 3).map((entry, i) => (
              <div
                key={entry.playerId}
                className={`p-5 ${i === 0 ? 'bg-accent text-accent-ink' : 'bg-surface border border-line'}`}
              >
                <div className="font-display text-9xl leading-none opacity-10 absolute">{i + 1}</div>
                <JerseyNumber n={i + 1} size={36} highlight={i === 0} />
                <div className="font-display text-xl mt-3">{entry.playerId}</div>
                <div className="font-display text-4xl font-num mt-2">{entry.points}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent games */}
      {recentGames.length > 0 && (
        <div>
          <SectionBar title="Siste spill" subtitle="KRONOLOGISK" />
          <div className="grid grid-cols-4 gap-3 p-4 bg-surface border border-line border-t-0">
            {recentGames.map((game) => {
              const winner = (game.firstPlace as Player[] | undefined)?.[0]
              return (
                <a
                  key={game.id}
                  href={`/games/${game.id}`}
                  className="bg-bg border border-line p-4 hover:border-accent transition-colors block"
                >
                  <div className="font-mono text-[11px] text-accent mb-2">
                    {game.date ? new Date(game.date).toLocaleDateString('nb-NO', { day: 'numeric', month: 'short' }) : '—'}
                  </div>
                  <div className="font-display text-xl mb-3">{game.name}</div>
                  {winner && (
                    <div className="flex items-center gap-2">
                      <Avatar initials={`${winner.firstName[0]}${winner.lastName[0]}`} size={26} />
                      <span className="font-sans text-sm font-semibold">{winner.firstName} {winner.lastName[0]}.</span>
                    </div>
                  )}
                </a>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Verify page loads with empty state**

```bash
bun dev
```

Visit `http://localhost:3000`. Expected: hero renders, "ingen aktiv turnering" or scoreboard if data exists.

- [ ] **Step 3: Commit**

```bash
git add apps/web/src/app/\(frontend\)/page.tsx
git commit -m "feat: home page with live scoreboard and recent games"
```

---

## Task 12: Tournament page

**Files:**
- Create: `apps/web/src/app/(frontend)/tournaments/[slug]/page.tsx`

- [ ] **Step 1: Create tournament page**

```tsx
// apps/web/src/app/(frontend)/tournaments/[slug]/page.tsx
import { notFound } from 'next/navigation'
import { getPayload } from '@/lib/payload'
import { Avatar } from '@/components/ui/Avatar'
import { Chip } from '@/components/ui/Chip'
import { JerseyNumber } from '@/components/ui/JerseyNumber'
import { FormCell } from '@/components/ui/FormCell'
import { SectionBar } from '@/components/ui/SectionBar'
import { calculateScoreboard } from '@/lib/scoreboard'
import type { Game, Player, Tournament } from '@/payload-types'

export const revalidate = 60

type Props = { params: Promise<{ slug: string }> }

export default async function TournamentPage({ params }: Props) {
  const { slug } = await params
  const payload = await getPayload()

  const res = await payload.find({
    collection: 'tournaments',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 1,
  })
  const tournament = res.docs[0] as Tournament | undefined
  if (!tournament) notFound()

  const gamesRes = await payload.find({
    collection: 'games',
    where: { tournament: { equals: tournament.id } },
    sort: 'date',
    limit: 100,
    depth: 2,
  })
  const games = gamesRes.docs as Game[]

  const rules = tournament.pointRules ?? {
    participation: 3, firstPlace: 3, secondPlace: 2, thirdPlace: 1,
    organizedWithParticipation: 1, organizedWithoutParticipation: 3, spectator: 1,
  }

  // Build player → last 5 form map
  const playerGames = new Map<string, (number | null)[]>()
  for (const game of games) {
    const allParticipants = [
      ...(game.participants as Player[] ?? []),
      ...(game.organizers as Player[] ?? []),
    ]
    for (const p of allParticipants) {
      const id = String(p.id)
      const first = (game.firstPlace as Player[] ?? []).some(x => String(x.id) === id)
      const second = (game.secondPlace as Player[] ?? []).some(x => String(x.id) === id)
      const third = (game.thirdPlace as Player[] ?? []).some(x => String(x.id) === id)
      const placement = first ? 1 : second ? 2 : third ? 3 : 99
      if (!playerGames.has(id)) playerGames.set(id, [])
      playerGames.get(id)!.push(placement)
    }
  }

  const gameResults = games.map((g: Game) => ({
    participants: (g.participants as Player[] ?? []).map(p => String(p.id)),
    firstPlace:   (g.firstPlace  as Player[] ?? []).map(p => String(p.id)),
    secondPlace:  (g.secondPlace as Player[] ?? []).map(p => String(p.id)),
    thirdPlace:   (g.thirdPlace  as Player[] ?? []).map(p => String(p.id)),
    organizers:   (g.organizers  as Player[] ?? []).map(p => String(p.id)),
    spectators:   (g.spectators  as Player[] ?? []).map(p => String(p.id)),
  }))
  const scoreboard = calculateScoreboard(gameResults, rules)

  // Fetch player details for display
  const playerIds = scoreboard.map(e => e.playerId)
  const playersRes = playerIds.length > 0
    ? await payload.find({ collection: 'players', where: { id: { in: playerIds } }, limit: 50, depth: 1 })
    : { docs: [] }
  const playersMap = new Map((playersRes.docs as Player[]).map(p => [String(p.id), p]))

  const statusLabel: Record<string, string> = { planned: 'PLANLAGT', active: 'AKTIV', finished: 'FERDIG' }

  return (
    <div className="max-w-6xl mx-auto px-8 py-8">
      {/* Header */}
      <div className="mb-2 font-mono text-[11px] text-ink-muted">← Alle turneringa</div>
      <div className="flex items-baseline gap-4 mb-2">
        <h1 className="font-display text-5xl leading-none">{tournament.name}</h1>
        <Chip tone="outline">{statusLabel[tournament.status ?? 'planned']}</Chip>
      </div>
      <div className="font-mono text-[13px] text-ink-muted mb-8">
        {games.length} spill spelt
        {tournament.startDate && ` · startet ${new Date(tournament.startDate).toLocaleDateString('nb-NO', { day: 'numeric', month: 'long', year: 'numeric' })}`}
      </div>

      {/* Scoreboard */}
      <SectionBar title="Scoreboard" subtitle={`SESONG ${tournament.year ?? ''}`} />
      <div className="border border-line border-t-0">
        <table className="w-full border-collapse font-sans text-base">
          <thead>
            <tr className="font-mono text-[11px] text-ink-muted border-b border-line">
              <th className="text-left p-3 w-12">#</th>
              <th className="text-left p-3">SPELLAR</th>
              <th className="text-center p-2 w-12">DEL</th>
              <th className="text-center p-2 w-12">🥇</th>
              <th className="text-center p-2 w-12">🥈</th>
              <th className="text-center p-2 w-12">🥉</th>
              <th className="text-left p-3 w-32">FORM</th>
              <th className="text-right p-3 w-24">POENG</th>
            </tr>
          </thead>
          <tbody>
            {scoreboard.map((entry, i) => {
              const player = playersMap.get(entry.playerId)
              const form = (playerGames.get(entry.playerId) ?? []).filter(p => p != null).slice(-5)
              return (
                <tr key={entry.playerId} className="border-t border-line-soft hover:bg-surface transition-colors">
                  <td className="p-3">
                    <JerseyNumber n={i + 1} size={36} highlight={i < 3} />
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <Avatar
                        initials={player ? `${player.firstName[0]}${player.lastName[0]}` : '??'}
                        size={40}
                        tone={i}
                      />
                      <div>
                        <div className="font-semibold">{player ? `${player.firstName} ${player.lastName}` : entry.playerId}</div>
                        {player?.nickname && (
                          <div className="font-mono text-[11px] text-ink-muted">«{player.nickname.toUpperCase()}»</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="p-2 text-center font-num text-ink-dim">{entry.gamesPlayed}</td>
                  <td className="p-2 text-center font-num text-gold font-bold">{entry.wins || '—'}</td>
                  <td className="p-2 text-center font-num text-silver font-bold">{entry.secondPlaces || '—'}</td>
                  <td className="p-2 text-center font-num text-bronze font-bold">{entry.thirdPlaces || '—'}</td>
                  <td className="p-3">
                    <div className="flex gap-1">
                      {form.map((p, j) => <FormCell key={j} placement={p ?? undefined} size={18} />)}
                    </div>
                  </td>
                  <td className="p-3 text-right">
                    <span className={`font-display text-2xl font-num ${i < 3 ? 'text-accent' : ''}`}>
                      {entry.points}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Games grid */}
      <div className="mt-8">
        <SectionBar title={`${games.length} spill spelt`} />
        <div className="grid grid-cols-4 gap-3 p-4 border border-line border-t-0 bg-surface">
          {games.map((game, i) => {
            const winner = (game.firstPlace as Player[] | undefined)?.[0]
            return (
              <a key={game.id} href={`/games/${game.id}`}
                className="bg-bg border border-line p-4 hover:border-accent transition-colors block"
              >
                <div className="flex justify-between items-baseline mb-3">
                  <JerseyNumber n={i + 1} size={28} />
                  <span className="font-mono text-[11px] text-ink-muted">
                    {game.date ? new Date(game.date).toLocaleDateString('nb-NO', { day: 'numeric', month: 'short' }).toUpperCase() : '—'}
                  </span>
                </div>
                <div className="font-display text-lg mb-1">{game.name}</div>
                <div className="font-mono text-[11px] text-ink-muted mb-3">{game.location?.toUpperCase() ?? ''}</div>
                {winner && (
                  <div className="flex items-center gap-2 pt-3 border-t border-line-soft">
                    <Avatar initials={`${winner.firstName[0]}${winner.lastName[0]}`} size={26} />
                    <span className="text-sm font-semibold">{winner.firstName} {winner.lastName[0]}.</span>
                  </div>
                )}
              </a>
            )
          })}
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify with real data**

Seed a tournament in `/admin` with a few games, then visit `/tournaments/<slug>`. Expected: scoreboard table renders, form cells appear for players with results.

- [ ] **Step 3: Commit**

```bash
git add apps/web/src/app/\(frontend\)/tournaments/
git commit -m "feat: tournament page with scoreboard table and form cells"
```

---

## Task 13: Game detail page

**Files:**
- Create: `apps/web/src/app/(frontend)/games/[id]/page.tsx`

- [ ] **Step 1: Create game detail page**

```tsx
// apps/web/src/app/(frontend)/games/[id]/page.tsx
import { notFound } from 'next/navigation'
import { getPayload } from '@/lib/payload'
import { Avatar } from '@/components/ui/Avatar'
import { Chip } from '@/components/ui/Chip'
import { JerseyNumber } from '@/components/ui/JerseyNumber'
import type { Game, Media, Player, Tournament } from '@/payload-types'

export const revalidate = 60

type Props = { params: Promise<{ id: string }> }

export default async function GamePage({ params }: Props) {
  const { id } = await params
  const payload = await getPayload()

  const game = await payload.findByID({ collection: 'games', id, depth: 2 }) as Game
  if (!game) notFound()

  const tournament = game.tournament as Tournament | undefined

  const allResults = [
    ...((game.firstPlace  as Player[] ?? []).map(p => ({ player: p, place: 1 }))),
    ...((game.secondPlace as Player[] ?? []).map(p => ({ player: p, place: 2 }))),
    ...((game.thirdPlace  as Player[] ?? []).map(p => ({ player: p, place: 3 }))),
    ...((game.participants as Player[] ?? [])
      .filter(p => {
        const id = String(p.id)
        const inTop3 = [game.firstPlace, game.secondPlace, game.thirdPlace]
          .flatMap(arr => (arr as Player[] ?? []))
          .some(x => String(x.id) === id)
        return !inTop3
      })
      .map((p, i) => ({ player: p, place: 4 + i }))
    ),
  ]

  const facts = [
    ['Dato',      game.date ? new Date(game.date).toLocaleDateString('nb-NO', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'],
    ['Stad',      game.location ?? '—'],
    ['Format',    game.format ?? 'placement'],
    ['Deltakarar', String((game.participants as Player[] ?? []).length)],
    ...(game.duration ? [['Varigheit', `${Math.floor(game.duration / 60)}t ${game.duration % 60}min`]] : []),
    ...(game.gallery ? [['Foto', String((game.gallery as unknown[]).length)]] : []),
  ]

  return (
    <div className="max-w-5xl mx-auto px-8 py-8">
      {/* Hero */}
      <div className="mb-2 font-mono text-[11px] text-ink-muted">
        {tournament ? (
          <a href={`/tournaments/${(tournament as Tournament).slug}`} className="hover:text-ink">
            ← {(tournament as Tournament).name}
          </a>
        ) : '← Tilbake'}
      </div>

      {game.format && game.format !== 'placement' && (
        <Chip tone="outline" className="mb-3">
          {game.format === 'time' ? '⏱ TID' : game.format === 'bracket' ? '⚔ CUP' : game.format.toUpperCase()}
        </Chip>
      )}

      <h1 className="font-display text-5xl leading-none mb-3">{game.name}</h1>
      <div className="font-sans text-base text-ink-dim mb-8">
        {game.date ? new Date(game.date).toLocaleDateString('nb-NO', { day: 'numeric', month: 'long' }) : ''}
        {game.location && ` · ${game.location}`}
        {(game.organizers as Player[] ?? []).length > 0 && ` · Arr. ${(game.organizers as Player[]).map(p => p.firstName).join(', ')}`}
      </div>

      <div className="grid grid-cols-[2fr_1fr] gap-8">
        {/* Left: results */}
        <div>
          {game.story && (
            <div className="mb-6">
              <div className="font-mono text-[13px] text-accent mb-3">KORT HISTORIE</div>
              {/* story is lexical richtext — render as prose for now */}
              <div className="font-serif text-xl italic text-ink leading-relaxed">
                {/* Payload lexical content — implement full renderer in polish pass */}
                Historikk tilgjengeleg i admin.
              </div>
            </div>
          )}

          <div className="font-mono text-[13px] text-ink-muted font-semibold mb-3">PLASSERINGAR</div>
          <div className="border border-line">
            {allResults.map((r, i) => (
              <div key={String(r.player.id)} className={`
                flex items-center gap-4 px-4 py-3 border-b border-line-soft last:border-b-0
                ${r.place === 1 ? 'bg-accent text-accent-ink' : i % 2 === 0 ? 'bg-surface' : ''}
              `}>
                <JerseyNumber
                  n={r.place}
                  size={32}
                  highlight={false}
                />
                <Avatar
                  initials={`${r.player.firstName[0]}${r.player.lastName[0]}`}
                  size={32}
                  tone={i}
                />
                <div className="flex-1 font-semibold text-base">
                  {r.player.firstName} {r.player.lastName}
                </div>
                {r.place === 1 && <Chip tone="ink">🏆 +3P</Chip>}
                {r.place === 2 && <span className="font-mono text-[13px] text-silver font-bold">+2P</span>}
                {r.place === 3 && <span className="font-mono text-[13px] text-bronze font-bold">+1P</span>}
              </div>
            ))}
          </div>

          {/* Spectators */}
          {(game.spectators as Player[] ?? []).length > 0 && (
            <div className="mt-4 font-mono text-[11px] text-ink-muted">
              TILSKODARAR: {(game.spectators as Player[]).map(p => p.firstName).join(', ')}
            </div>
          )}
        </div>

        {/* Right: facts */}
        <aside>
          <div className="bg-surface border border-line p-5">
            <div className="font-mono text-[11px] text-ink-muted mb-4">FAKTA</div>
            {facts.map(([k, v], i) => (
              <div key={k} className={`flex justify-between py-3 ${i < facts.length - 1 ? 'border-b border-line-soft' : ''}`}>
                <span className="font-mono text-[11px] text-ink-muted">{k.toUpperCase()}</span>
                <span className="font-sans text-base font-medium">{v}</span>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify**

With a game in admin (including results), visit `/games/<id>`. Expected: placement table renders, facts sidebar shows.

- [ ] **Step 3: Commit**

```bash
git add apps/web/src/app/\(frontend\)/games/
git commit -m "feat: game detail page with placement table and facts sidebar"
```

---

## Task 14: Players list and profile pages

**Files:**
- Create: `apps/web/src/app/(frontend)/players/page.tsx`
- Create: `apps/web/src/app/(frontend)/players/[id]/page.tsx`

- [ ] **Step 1: Create players list**

```tsx
// apps/web/src/app/(frontend)/players/page.tsx
import { getPayload } from '@/lib/payload'
import { Avatar } from '@/components/ui/Avatar'
import { SectionBar } from '@/components/ui/SectionBar'
import type { Player } from '@/payload-types'

export const revalidate = 60

export default async function PlayersPage() {
  const payload = await getPayload()
  const res = await payload.find({ collection: 'players', sort: 'firstName', limit: 100, depth: 1 })
  const players = res.docs as Player[]

  return (
    <div className="max-w-5xl mx-auto px-8 py-8">
      <SectionBar title={`${players.length} i gjengen`} />
      <div className="grid grid-cols-3 gap-4 p-4 border border-line border-t-0 bg-surface">
        {players.map((p, i) => (
          <a key={p.id} href={`/players/${p.id}`}
            className="bg-bg border border-line p-5 hover:border-accent transition-colors relative overflow-hidden block"
          >
            <div className="absolute top-[-8px] right-[-6px] font-display text-8xl leading-none text-line-soft font-num opacity-60">{i + 1}</div>
            <div className="relative flex items-center gap-4">
              <Avatar initials={`${p.firstName[0]}${p.lastName[0]}`} size={52} tone={i} />
              <div>
                <div className="font-display text-lg leading-tight">{p.firstName}</div>
                <div className="font-display text-lg leading-tight text-ink-dim">{p.lastName.split(' ').pop()}</div>
              </div>
            </div>
            {p.nickname && (
              <div className="font-mono text-[13px] text-accent mt-3 font-semibold">
                «{p.nickname.toUpperCase()}»
              </div>
            )}
            {(p.homeBase || p.signatureGame) && (
              <div className="font-sans text-sm text-ink-dim mt-1">
                {[p.homeBase, typeof p.signatureGame === 'object' ? (p.signatureGame as {name:string})?.name : null].filter(Boolean).join(' · ')}
              </div>
            )}
          </a>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create player profile**

```tsx
// apps/web/src/app/(frontend)/players/[id]/page.tsx
import { notFound } from 'next/navigation'
import { getPayload } from '@/lib/payload'
import { Avatar } from '@/components/ui/Avatar'
import { Chip } from '@/components/ui/Chip'
import { FormCell } from '@/components/ui/FormCell'
import { SectionBar } from '@/components/ui/SectionBar'
import { calculateScoreboard } from '@/lib/scoreboard'
import type { Game, GameType, Player } from '@/payload-types'

export const revalidate = 60

type Props = { params: Promise<{ id: string }> }

export default async function PlayerProfilePage({ params }: Props) {
  const { id } = await params
  const payload = await getPayload()

  const player = await payload.findByID({ collection: 'players', id, depth: 2 }) as Player
  if (!player) notFound()

  // All games this player participated in
  const gamesRes = await payload.find({
    collection: 'games',
    where: { participants: { contains: id } },
    sort: 'date',
    limit: 100,
    depth: 2,
  })
  const games = gamesRes.docs as Game[]

  // Build form (last 5 placements)
  const form = games.slice(-7).map(g => {
    const first  = (g.firstPlace  as Player[] ?? []).some(p => String(p.id) === id)
    const second = (g.secondPlace as Player[] ?? []).some(p => String(p.id) === id)
    const third  = (g.thirdPlace  as Player[] ?? []).some(p => String(p.id) === id)
    return first ? 1 : second ? 2 : third ? 3 : 99
  }).filter(p => p !== null).slice(-5)

  // Total points across all games (using default rules for now)
  const defaultRules = { participation: 3, firstPlace: 3, secondPlace: 2, thirdPlace: 1, organizedWithParticipation: 1, organizedWithoutParticipation: 3, spectator: 1 }
  const gameResults = games.map(g => ({
    participants: (g.participants as Player[] ?? []).map(p => String(p.id)),
    firstPlace:   (g.firstPlace  as Player[] ?? []).map(p => String(p.id)),
    secondPlace:  (g.secondPlace as Player[] ?? []).map(p => String(p.id)),
    thirdPlace:   (g.thirdPlace  as Player[] ?? []).map(p => String(p.id)),
    organizers:   (g.organizers  as Player[] ?? []).map(p => String(p.id)),
    spectators:   (g.spectators  as Player[] ?? []).map(p => String(p.id)),
  }))
  const board = calculateScoreboard(gameResults, defaultRules)
  const myEntry = board.find(e => e.playerId === id)
  const sigGame = player.signatureGame && typeof player.signatureGame === 'object' ? player.signatureGame as GameType : null

  return (
    <div className="max-w-5xl mx-auto px-8 py-8">
      {/* Hero */}
      <div className="bg-ink text-bg p-8 mb-6 relative overflow-hidden">
        <div className="relative flex gap-6 items-center">
          <Avatar initials={`${player.firstName[0]}${player.lastName[0]}`} size={120} tone={0} accentBorder />
          <div>
            <div className="font-mono text-[13px] text-accent font-semibold mb-2">
              {[player.homeBase, player.nickname ? `«${player.nickname}»` : null].filter(Boolean).join(' · ')}
            </div>
            <h1 className="font-display text-5xl leading-none">{player.firstName}</h1>
            <div className="font-display text-5xl text-accent leading-none">{player.lastName}</div>
            {sigGame && (
              <div className="font-serif italic text-xl text-ink-dim mt-3">{sigGame.icon} {sigGame.name}-spesialist</div>
            )}
          </div>
        </div>
      </div>

      {/* Stats row */}
      {myEntry && (
        <div className="grid grid-cols-4 gap-3 mb-6">
          {[
            ['POENG', myEntry.points],
            ['SPELT', myEntry.gamesPlayed],
            ['SIGRAR', myEntry.wins],
            ['2. PLASS', myEntry.secondPlaces],
          ].map(([label, val]) => (
            <div key={label} className="bg-surface border border-line p-4">
              <div className="font-mono text-[11px] text-ink-muted">{label}</div>
              <div className="font-display text-3xl font-num mt-1 text-accent">{val}</div>
            </div>
          ))}
        </div>
      )}

      {/* Form */}
      {form.length > 0 && (
        <div className="mb-6">
          <div className="font-mono text-[13px] text-ink-muted mb-3">FORM (SISTE {form.length} SPILL)</div>
          <div className="flex gap-2">
            {form.map((p, i) => <FormCell key={i} placement={p} size={32} />)}
          </div>
        </div>
      )}

      {/* Game history */}
      <SectionBar title="Spill-historikk" subtitle={`${games.length} SPILL`} />
      <div className="border border-line border-t-0">
        {games.slice().reverse().map((game, i) => {
          const first  = (game.firstPlace  as Player[] ?? []).some(p => String(p.id) === id)
          const second = (game.secondPlace as Player[] ?? []).some(p => String(p.id) === id)
          const third  = (game.thirdPlace  as Player[] ?? []).some(p => String(p.id) === id)
          const place  = first ? 1 : second ? 2 : third ? 3 : null
          return (
            <a key={game.id} href={`/games/${game.id}`}
              className={`flex items-center gap-4 px-4 py-3 border-b border-line-soft last:border-b-0 hover:bg-surface transition-colors ${i % 2 === 0 ? 'bg-surface' : ''}`}
            >
              <div className="font-mono text-[11px] text-ink-muted w-16">
                {game.date ? new Date(game.date).toLocaleDateString('nb-NO', { day: 'numeric', month: 'short' }).toUpperCase() : '—'}
              </div>
              <div className="flex-1 font-semibold">{game.name}</div>
              <div className="font-mono text-[11px] text-ink-muted">{game.location ?? ''}</div>
              {place ? (
                <Chip tone={place === 1 ? 'accent' : 'outline'}>
                  {place}. plass
                </Chip>
              ) : (
                <span className="font-mono text-[11px] text-ink-muted">Deltok</span>
              )}
            </a>
          )
        })}
      </div>

      {/* Fun fact */}
      {player.funFact && (
        <div className="mt-6 p-5 bg-surface border border-line">
          <div className="font-mono text-[11px] text-accent mb-2">VISSTE DU?</div>
          <div className="font-sans text-base">{player.funFact}</div>
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 3: Verify**

Create a player with games in admin, visit `/players` and `/players/<id>`. Expected: grid, profile hero, stats, form cells, game history.

- [ ] **Step 4: Commit**

```bash
git add apps/web/src/app/\(frontend\)/players/
git commit -m "feat: players list and profile pages"
```

---

## Task 15: Railway deploy

**Files:**
- Create: `apps/web/railway.toml`
- Create: `apps/web/.env.production.example`

- [ ] **Step 1: Create railway.toml**

```toml
# apps/web/railway.toml
[build]
builder = "nixpacks"
buildCommand = "bun run build"

[deploy]
startCommand = "bun run start"
healthcheckPath = "/api/health"
healthcheckTimeout = 30
restartPolicyType = "on-failure"
```

- [ ] **Step 2: Create health endpoint**

```typescript
// apps/web/src/app/(payload)/api/health/route.ts
export async function GET() {
  return Response.json({ ok: true })
}
```

- [ ] **Step 3: Create .env.production.example**

```bash
# apps/web/.env.production.example
# Copy to Railway environment variables:
DATABASE_URL=postgresql://user:pass@host:5432/leikan
PAYLOAD_SECRET=<32-char-random-string>
S3_BUCKET=leikan-media
S3_ACCESS_KEY_ID=<railway-storage-access-key>
S3_SECRET_ACCESS_KEY=<railway-storage-secret>
S3_REGION=auto
S3_ENDPOINT=<railway-storage-endpoint>
NEXT_PUBLIC_SERVER_URL=https://<your-railway-url>
```

- [ ] **Step 4: Add build script to package.json**

In `apps/web/package.json` verify these scripts exist:
```json
{
  "scripts": {
    "dev":   "next dev",
    "build": "next build",
    "start": "next start"
  }
}
```

- [ ] **Step 5: Test production build locally**

```bash
cd apps/web
bun run build
```

Expected: build completes without errors. Fix any TypeScript errors before proceeding.

- [ ] **Step 6: Deploy to Railway**

1. Go to railway.com, create a new project
2. Add a Postgres database service
3. Add a Storage Bucket service
4. Deploy `apps/web` as an app service:
   - Connect GitHub repo
   - Set root directory to `apps/web`
   - Add all env vars from `.env.production.example`
   - Set `DATABASE_URL` from Postgres service's connection string
   - Set `S3_*` vars from Storage Bucket service details

- [ ] **Step 7: Run Payload migrations on Railway**

After first deploy, run via Railway CLI or shell:
```bash
bun run payload migrate
```

Expected: database tables created, can access `/admin` on the Railway URL.

- [ ] **Step 8: Commit**

```bash
git add apps/web/railway.toml apps/web/.env.production.example apps/web/src/app/\(payload\)/api/health/
git commit -m "feat: add Railway deploy config and health endpoint"
```

---

## Self-Review

### Spec coverage check

| Spec requirement | Covered by task |
|---|---|
| `apps/web` in monorepo | Task 1 |
| Next.js latest via bun | Task 1 |
| Payload v3 embedded | Task 2 |
| Railway Postgres | Tasks 2, 15 |
| Railway Storage Buckets | Tasks 2, 15 |
| Users collection + roles | Task 3 |
| Players collection | Task 4 |
| GameTypes collection | Task 4 |
| Media collection | Task 4 |
| Tournaments collection | Task 5 |
| Games collection | Task 5 |
| SiteSettings global + feature flags | Task 6 |
| getPayload singleton | Task 7 |
| calculateScoreboard (TDD) | Task 7 |
| Nidaros v4 CSS tokens | Task 8 |
| Tailwind with token vars | Task 8 |
| Avatar, Chip, Button, Icon | Task 9 |
| JerseyNumber, FormCell, SectionBar | Task 9 |
| Nav + frontend layout | Task 10 |
| Home page | Task 11 |
| Tournament page with scoreboard | Task 12 |
| Game detail page | Task 13 |
| Players list | Task 14 |
| Player profile | Task 14 |
| Railway deploy | Task 15 |
| Health endpoint | Task 15 |
| Form column (last 5 participations) | Task 12 |
| `revalidate = 60` ISR | Tasks 11-14 |

**Not covered (P2, out of scope):**
- Badge/achievement system
- Bracket format UI
- Time registration UI
- Auto-derived stats
- OG images
- PWA manifest / sitemap
