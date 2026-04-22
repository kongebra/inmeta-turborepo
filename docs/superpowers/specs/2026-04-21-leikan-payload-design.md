# Leikan — Payload CMS redesign spec
_2026-04-21_

## Context

Trønder Leikan (tidl. Inmeta Games) er et internt turnerings-tracker-system for Inmeta-kontoret i Trondheim. Eksisterende app (`apps/inmeta-games-web`) kjører på Sanity + Vercel og berøres ikke. Ny app bygges parallelt i `apps/web` med Payload CMS v3 + Postgres, basert på Nidaros v4-designet fra Claude Design-sesjonen.

## Beslutninger

| Valg | Beslutning |
|---|---|
| CMS | Payload v3 (embedded i Next.js) |
| Database | Postgres (Railway nå, Azure Flex Server seinere) |
| Storage | Railway Storage Buckets (S3-kompatibelt) |
| Auth | Payload innebygd (email/password + roller) |
| Deploy | Railway |
| Package manager | bun |
| Next.js | Siste via `bun create next-app` (≥16) |
| Video | Ikke dag 1 |
| Live-timing | Ikke dag 1 — etterregistrering istedet |
| Eksisterende app | Røres ikke, er source of truth til migrering |
| App-navn prefix | Ingen — heter `web` i monorepo |

---

## Arkitektur

```
apps/
  inmeta-games-web/     ← eksisterende Sanity-app, uendret
  web/                  ← ny Payload + Next.js-app
    src/
      app/
        (frontend)/     ← alle offentlige sider (Nidaros v4 design)
        (payload)/
          admin/        ← Payload admin panel
          api/          ← Payload REST + Local API
    payload.config.ts
    payload-types.ts    ← auto-generert av Payload
packages/
  ui/                   ← delte Nidaros-komponenter (fremtidig)
```

Payload v3 kjører som Next.js route handlers — én app, én Railway-tjeneste, én Postgres-database. Ingen separat backend-container.

---

## Payload Collections

### `players`
Representerer en person i gjengen.

```typescript
fields:
  firstName       string  required
  lastName        string  required
  image           upload → media  optional
  nickname        string  optional   // «Grandmester», «Dartkongen»
  homeBase        string  optional   // Trondheim-bydel: Byåsen, Lade, …
  signatureGame   ref → gameTypes  optional
  funFact         string  optional
```

### `gameTypes`
Kategori for spill på tvers av turneringer. Gjør "Spill-kongar"-stat mulig.

```typescript
fields:
  name   string  required   // Dart, Sjakk, Discgolf, …
  slug   slug    required
  icon   string  optional   // emoji: 🎯 🏓 ⛳
```

### `tournaments`

```typescript
fields:
  name        string  required
  slug        slug    required
  status      enum: planned | active | finished   default: planned
  startDate   date    optional
  year        number  optional
  coverImage  upload → media  optional
  posterImage upload → media  optional
  pointRules  group:
    participation              number  default: 3
    firstPlace                 number  default: 3
    secondPlace                number  default: 2
    thirdPlace                 number  default: 1
    organizedWithParticipation number  default: 1
    organizedWithoutParticipation number  default: 3
    spectator                  number  default: 1
  games       hasMany → games  (relation)
```

### `games`

```typescript
fields:
  name         string  required
  tournament   ref → tournaments  required
  gameType     ref → gameTypes    optional
  date         date    optional
  status       enum: planned | scheduled | live | done | cancelled   default: planned
  location     string  optional   // «Kontoret», «Lade Discgolfpark», …
  duration     number  optional   // minutter

  // Deltakelse
  organizers   many2many → players
  participants many2many → players
  spectators   many2many → players

  // Resultat (standard placement-format)
  firstPlace   many2many → players
  secondPlace  many2many → players
  thirdPlace   many2many → players

  // Spill-type (påvirker hvilke resultat-felt som brukes)
  format       enum: placement | score | time | bracket   default: placement

  // Tid-basert (Race Sim, orientering)
  timeResults  array:
    player   ref → players
    round    number    // omgang-nummer
    lapTime  string    // «1:23.418»

  // Bracket
  bracketType  enum: single_elimination | double_elimination | round_robin  optional
  bracketData  json  optional  // bracket-struktur lagres som JSON

  // Innhold
  gallery      array → upload (media)
  heroPhoto    upload → media  optional
  story        richText  optional  // «Slik gikk det»-seksjon
  highlights   array:
    quote   string
    player  ref → players

  isDone       boolean  default: false  // legacy-kompatibilitet
```

### `badges`
Merker som spillere kan låse opp.

```typescript
fields:
  name        string  required   // «170-finish», «Grandmester»
  slug        slug    required
  description string  optional
  icon        string  optional   // emoji eller SVG-navn
  rarity      enum: common | uncommon | rare | legendary   default: common
  criteria    richText  optional  // forklaring til admin
```

Kobling til spiller via `playerBadges` collection (se under).

### `playerBadges`
Koblingstabellen mellom spiller og badge (med metadata om når og hvorfor).

```typescript
fields:
  player     ref → players   required
  badge      ref → badges    required
  game       ref → games     optional   // spillet merket ble låst opp i
  unlockedAt date  required
  note       string  optional           // redaksjonell kommentar
```

### `media`
Payload sin innebygde upload collection (konfigurert mot Railway Storage).

```typescript
config:
  storage: s3 (Railway Storage Buckets, S3-kompatibelt)
  imageSizes:
    thumbnail: 300×300
    medium: 800×800
    large: 1600×1600
  mimeTypes: image/*
```

---

## Globals (singletons)

### `siteSettings`
Feature-flags og tema-konfigurasjon. Én forekomst, editors kan endre uten deploy.

```typescript
fields:
  // Tema
  accentColor  enum: neon | signal | forest | red | blue   default: neon
  themeMode    enum: light | dark | system                  default: system

  // Feature flags — auto-utleda stats
  showTettasteDuell          boolean  default: true
  showLengstePodiumStripe    boolean  default: true
  showComebackOfTheYear      boolean  default: true
  showDebutantensSjokk       boolean  default: true
  showMestAktivArrangor      boolean  default: true
  showSpellKongar            boolean  default: true
  showBydelskamp             boolean  default: false   // krever homeBase på spillere
  showNemesis                boolean  default: false   // potensielt negativt
  showActivityFeed           boolean  default: true
  // Activity feed = beregnet fra siste game-resultater + badge-unlock, ingen egen collection
```

---

## Tilgang / roller

Payload innebygd auth med email/password. Flat brukermodell dag 1:

| Rolle | Tilgang |
|---|---|
| **admin** | Alt — brukeradmin, schema, alle collections |
| **user** | Create/edit/publish alle collections + siteSettings |

Alle i gjengen får `user`-konto. Ingen granulering dag 1 — eskalering til `admin` gjøres ad-hoc ved behov (f.eks. spillansvarlig for en sesong). Onboarding: admin oppretter konto, person setter passord.

---

## Design system: Nidaros v4

Basert på Claude Design-sesjonen (v4-core.jsx + v4-screens-a/b/c/d.jsx).

### Tema-system

```typescript
// 2 modes × 5 accent-farger = 10 tema-kombinasjoner
modes: light | dark
accents: neon (#44f291) | signal (#4cc97c) | forest (#6aa87c)
       | red (#ff5668) | blue (#6fa6f5)

// Token-sett (CSS custom properties)
--bg, --surface, --surface-alt
--ink, --ink-dim, --ink-muted
--line, --line-soft
--accent, --accent-alt, --accent-ink
--warn, --gold, --silver, --bronze
```

### Typografi

| Rolle | Font | Min størrelse |
|---|---|---|
| Display | Archivo Black | 18px |
| Eyebrow / meta (mono) | IBM Plex Mono, uppercase | 13px |
| Body | Archivo | 16px |
| Tall (tabular) | Archivo + `tnum` feature | 13px |
| Serif / sitat | DM Serif Display | 18px |

### Komponenter (mappes til React-komponenter)

| Wireframe-navn | Komponent | Brukt i |
|---|---|---|
| V4Avatar | `<Avatar>` | Alle sider |
| V4JerseyNum | `<JerseyNumber>` | Scoreboard, spill, race sim |
| V4Chip | `<Chip>` | Alle sider |
| V4Button | `<Button>` | Alle sider |
| V4SectionBar | `<SectionBar>` | Hjem, turnering, profil |
| V4ScreenLabel | Intern layout-komponent | — |
| V4FormCell | `<FormCell>` | Scoreboard, profil |
| V4Icon | `<Icon>` | Alle sider |
| Badge hex | `<BadgeHex>` | Profil, achievements, spill |
| BracketMatch | `<BracketMatch>` | Bracket-spill |

### Form-kolonne (scoreboard)

Viser siste 5 spill personen **var med i** (ikke-deltakelse utelates). Fargekoder:
- Gull/sølv/bronse-boks med tall for topp 3
- Tom outline-boks for plasseringer 4+

---

## Sider (frontend)

| Nr | Rute | Beskrivelse |
|---|---|---|
| 01 | `/` | Hjem — hero scoreboard-marquee, topp 3, siste/neste spill, aktivitetsfeed |
| 02 | `/tournaments/[slug]` | Turnering — header, scoreboard-tabell, spill-grid |
| 03 | `/games/[id]` | Spill-detalj — fotohero, story, plasseringstabell, faktaboks, merke-unlock |
| 04 | `/players` | Spillerliste — 3-kolonne grid med stats-kort |
| 05 | `/players/[id]` | Spillerprofil — hero, statistikk, form-historikk, merker, turneringshistorikk |
| 06 | `/games/[id]/register-time` | Etterregistrering av tider (Race Sim m.fl.) — faner per omgang, input-tabell |
| 07 | `/games/[id]/bracket` | Bracket-visning — single/double elim, round-robin |
| 08 | `/achievements` | Merke-galleri — alle badges, hvem har hva, sjeldenhetsfilter |

**Admin (Payload):**
- `/admin` — Payload admin panel (alle collections, globals, media)

---

## Auto-utleda stats

Alle beregnes client-side fra Payload-data. Ingen ekstra lagring.

| Stat | Beregning | Krever nye felt |
|---|---|---|
| Tettaste duell | Head-to-head: plasseringssammenligning i felles spill | Nei |
| Lengste podium-stripe | Maks sammenhengende topp-3-plasseringer | Nei |
| Comeback of the year | Størst rang-hopp opp etter ett spill | Nei |
| Debutantens sjokk | Ny spiller som tok podium første gang | `game.date` |
| Mest aktiv arrangør | Flest spill arrangert | Nei |
| Spill-kongar | Flest 1.-plasser per gameType | `gameType` collection |
| Bydelskamp | Summerte poeng per homeBase | `player.homeBase` |
| Nemesis | Hvem du har tapt mest mot (head-to-head) | Nei |

---

## Bilde-opplasting

- **Provider:** Railway Storage Buckets (S3-kompatibelt API)
- **Payload plugin:** `@payloadcms/storage-s3`
- **Auto-resize:** thumbnail (300px), medium (800px), large (1600px)
- **Formats:** JPEG, PNG, WebP, AVIF
- **Video:** Utelatt dag 1 — legges til med Mux seinere uten schema-endringer

---

## Migrering fra Sanity (fremtidig, ikke dag 1)

1. `sanity export` → JSON
2. `scripts/migrate-sanity-to-payload.ts` via Payload Local API (direkte DB, ingen HTTP)
3. Mapping: `Person → players`, `Tournament → tournaments`, `Game → games`
4. `game.date` fallback = `_createdAt` fra Sanity-eksport
5. `inmeta-games-web` avvikles når migrering er verifisert

---

## OG image / PWA / SEO

- `next/og` for dynamiske OG-bilder per turnering og spill
- `manifest.ts` for PWA (legg til på homescreen)
- `sitemap.ts` og `robots.ts` (kopieres/oppdateres fra eksisterende app)
- Polling: `router.refresh()` hvert 30s på aktive turneringssider

---

## Prioritert rekkefølge (P1 → P3)

### P1 — Kjernen, dag 1
- `apps/web` bootstrappes med `bun create next-app`
- Payload v3 installeres + konfigureres mot Railway Postgres
- Collections: `players`, `tournaments`, `games`, `gameTypes`, `media`
- Global: `siteSettings` med feature-flags + tema
- Nidaros v4 design system (tokens, komponenter)
- Sider: hjem, turnering, spill-detalj, spillerliste, spillerprofil
- Railway Storage Buckets for bilde-opplasting
- Payload admin med editor-roller

### P2 — Neste runde
- Badge-system (`badges`, `playerBadges` collections + achievements-side)
- Bracket-format (V4Bracket-skjerm + `bracketData` i games)
- Etterregistrering av tider (V4RaceSimLive-skjerm + `timeResults` i games)
- Auto-utleda stats (alle 8 beregninger + feature-flag-styring)
- OG image, PWA manifest, sitemap

### P3 — Fremtid
- Video-støtte (Mux + `@payloadcms/plugin-cloud-storage`)
- Mobilvennlig resultat-innlegg (alternativ til `/admin`)
- Viewer-rolle for read-only tilgang
- Tema-varianter per turnering
- Azure-migrering (fra Railway til Azure Container Apps + Azure Flex Server)

---

## Besluttede åpne spørsmål

| Spørsmål | Svar |
|---|---|
| Domene dag 1 | Railway auto-generert URL — ingen eget domene |
| `inmeta-games-web` | Kjører på Vercel/Sanity til ny app er ferdig, da avvikles den |
| Bruker-roller | Alle får én konto (flat tilgang) — admin-eskalering ad-hoc ved behov |
