# Architecture

## Overview

Inmeta Games is an internal tournament tracker for the Inmeta organization. Employees can view tournaments, game results, scoreboards, and player profiles. Content is managed through an embedded Sanity CMS Studio.

```
┌─────────────────────────────────────────────────┐
│                   Vercel                        │
│  ┌───────────────────────────────────────────┐  │
│  │         Next.js 14 (App Router)           │  │
│  │                                           │  │
│  │  /(web)     Public site (SSR + ISR)       │  │
│  │  /(sanity)  Embedded Sanity Studio        │  │
│  └──────────────────┬────────────────────────┘  │
│                     │ GROQ queries               │
│                     ▼                            │
│            Sanity Content Lake                   │
│         (hosted by sanity.io)                    │
└─────────────────────────────────────────────────┘
```

The app is fully server-rendered (React Server Components). There is no client-side state management, no database beyond Sanity, and no user authentication on the Next.js side.

## Monorepo Layout

```
inmeta-turborepo/
├── apps/
│   └── inmeta-games-web/       # The Next.js application
│       ├── sanity/             # Sanity config, schemas, env validation
│       └── src/
│           ├── app/
│           │   ├── (web)/      # Public routes (tournaments, players)
│           │   └── (sanity)/   # Studio at /studio
│           ├── components/     # Shared UI (heading, theme toggle, shadcn)
│           └── lib/
│               ├── sanity/     # Client, queries, types, image helper
│               └── utils.ts    # cn(), scoreboard calculation
├── packages/
│   ├── ui/                     # @inmeta/ui — shared shadcn component library
│   ├── config-eslint/          # @inmeta/eslint-config
│   └── config-typescript/      # @inmeta/typescript-config
├── turbo.json
└── package.json
```

## Data Models

All content lives in Sanity. There are two document types and two object types.

### Documents

**`person`** — A player/employee.

| Field       | Type    | Description       |
|-------------|---------|-------------------|
| firstName   | string  | First name        |
| lastName    | string  | Last name         |
| image       | image   | Profile photo     |

**`tournament`** — A tournament containing multiple games.

| Field      | Type                   | Description                          |
|------------|------------------------|--------------------------------------|
| name       | string                 | Tournament name                      |
| slug       | slug                   | URL slug (exists but not used in routing — routes use `_id`) |
| games      | array of `game`        | Games in this tournament             |
| pointRules | `tournamentPointRules` | Configurable scoring rules           |

### Objects

**`game`** — An individual game within a tournament.

| Field                       | Type                  | Description                        |
|-----------------------------|-----------------------|------------------------------------|
| name                        | string                | Game name                          |
| description                 | text                  | Game description                   |
| image                       | image                 | Game image                         |
| organiziers                 | reference[] → person  | Game organizers (note: typo is intentional) |
| isOrganizersParticipating   | boolean               | Whether organizers also played     |
| participants                | reference[] → person  | Players who participated           |
| isDone                      | boolean               | Whether results are finalized      |
| firstPlace / secondPlace / thirdPlace | reference[] → person | Podium placements (can be multiple per place) |
| spectators                  | reference[] → person  | People who watched                 |

**`tournamentPointRules`** — Scoring configuration per tournament.

| Field                          | Default | Description                    |
|--------------------------------|---------|--------------------------------|
| participation                  | 3       | Points for participating       |
| firstPlace                     | 3       | Points for 1st place           |
| secondPlace                    | 2       | Points for 2nd place           |
| thirdPlace                     | 1       | Points for 3rd place           |
| organizedWithParticipation     | 1       | Points for organizing + playing|
| organizedWithoutParticipation  | 3       | Points for organizing only     |
| spectator                      | 1       | Points for spectating          |

### Type Resolution

The codebase has two parallel type hierarchies:

- **Unresolved** (`Tournament`, `Game`): References are raw `SanityReference[]` (just `_ref` IDs). Used by list queries.
- **Resolved** (`TournamentDetails`, `GameDetails`): References are dereferenced to full `Person` objects via GROQ `->`. Used by detail pages.

## Data Flow

```
Sanity Content Lake
       │
       │ GROQ queries (src/lib/sanity/queries.ts)
       │ ISR revalidation: 60s per-fetch, 300s page-level
       ▼
 Server Components
       │
       │ calculateScoreboard() in utils.ts
       │ Iterates games, tallies stats per player, applies pointRules
       ▼
  Rendered HTML
```

### Scoreboard Calculation

`calculateScoreboard()` in `src/lib/utils.ts`:
1. Iterates all games where `isDone === true`
2. For each player, tallies: participations, 1st/2nd/3rd places, organized (with/without participation), spectated
3. Multiplies each stat by the tournament's `pointRules` values
4. Sorts players by total score descending; ties share the same rank

### Player Details

`fetchPlayerDetails()` uses a GROQ query that:
1. Finds the person document
2. Reverse-queries all tournaments that reference this person
3. Computes per-game placement (1/2/3/0) using GROQ `select()` inline

## Pages

| Route                                  | Description                    |
|----------------------------------------|--------------------------------|
| `/`                                    | Lists all tournaments          |
| `/tournaments/[tournamentId]`          | Tournament detail: point system, games list, scoreboard |
| `/tournaments/[tournamentId]/games/[gameKey]` | Individual game detail  |
| `/players`                             | Grid of all players with photos|
| `/players/[playerId]`                  | Player profile with tournament history |
| `/studio`                              | Embedded Sanity Studio (separate layout) |

## Potential New Features

### High Value

- **Team support**: Add a `team` document type. Games could be team-based, with team scores aggregating to individual scores. Would require new schemas, updated scoring logic, and team-specific views.
- **Live/real-time updates**: Replace ISR polling with Sanity's real-time listener (`client.listen()`) or webhooks + on-demand revalidation (`revalidateTag`). Currently pages can be up to 5 minutes stale.
- **Season/league system**: Group tournaments into seasons with cumulative leaderboards across tournaments. Add a `season` document type referencing multiple tournaments.
- **Authentication & roles**: Add NextAuth or similar so only authorized users can access the Studio or submit results. Currently the Studio relies solely on Sanity's own auth.

### Medium Value

- **Use slugs for routing**: Tournament URLs currently use Sanity `_id` (e.g., `/tournaments/abc123`). The `slug` field exists but is unused. Switching to slugs would give human-readable URLs.
- **Stats & analytics dashboard**: Player win rates, most-played games, participation trends over time. All data exists — just needs aggregation and visualization (charts via recharts or similar).
- **Game categories/tags**: Add categories (board games, video games, card games, etc.) for filtering and organization.
- **Notifications**: Email or Slack notifications when new tournaments are created or results are posted. Could use Sanity webhooks.
- **Search**: Full-text search across tournaments, games, and players.

### Lower Effort

- **Pagination**: The tournaments list and players grid currently load all records. Add pagination or infinite scroll for scalability.
- **Sorting/filtering on players page**: Filter by tournament, sort by number of wins, etc.
- **Game history on player profile**: Show win/loss record, average placement, favorite games.
- **PWA improvements**: The app has a `manifest.ts` but could add offline support, push notifications, and install prompts.
- **Testing**: No tests exist. Adding Vitest with component tests for scoring logic and integration tests for GROQ queries would be valuable.
- **Consolidate shadcn installs**: The web app has its own `src/components/ui/` while `packages/ui` exists. Unify to avoid drift.
