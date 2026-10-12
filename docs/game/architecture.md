# Architecture and technical setup

How uma-rpg is built and run. Values come from the code and `docs/technical/infrastructure.md`, which holds every
production value and is the place to change them.

## The pieces

```
 iPhone (Home Screen PWA)
   └─ apps/web  React 19 + Vite 7 + Tailwind 4 + Zustand + Dexie; Phaser 4 for the Hub and battles
        │  /api/*  (Firebase Hosting rewrites to Cloud Run)
        ▼
   apps/api  NestJS 11 on Cloud Run `rpg-api`
        ├─ saves ──────────► Firestore `saves/{uid}` (local: apps/api/.data/save.json)
        ├─ master data ────► gs://uma-platform-master-data (local: ../uma-platform/content/release)
        ├─ private cast ───► gs://uma-rpg-content (local: content/release, gitignored)
        └─ push ───────────► Web Push (VAPID), ticked by Cloud Scheduler every 5 minutes

   packages/domain  @rpg/domain: every rule, pure TypeScript, shared by web and API
```

**The rule of the codebase:**
- **The domain decides everything.** The web app runs the rules locally for instant play and the API runs the same
  code to accept or refuse a save.
- **Saves are parsed strictly** on both sides: unknown keys are refused, and an open fight is replayed to prove it.

| Package | Path | Role | Build |
|---|---|---|---|
| `@rpg/domain` | `packages/domain` | Save schema and parsers, battle engine, classes and skills, world generator, economy, items, place registry, master data adapter | `tsc` → `dist/cjs` (CommonJS for the API); Vite and Vitest read the TypeScript source |
| `@rpg/web` | `apps/web` | The game | `tsc --noEmit && vite build` → `apps/web/dist` |
| `@rpg/api` | `apps/api` | Save, master data and content proxy, push | `nest build` → `dist/main.js`, shipped as a Docker image |
| cast scripts | `scripts/cast/` | Import and publish the private franchise face packs | `content/release/` (gitignored) |

pnpm workspace with Turbo. TypeScript is strict with `noUncheckedIndexedAccess`, and tests are Vitest. Commands are in
`AGENTS.md`.

## Domain map

| Folder | What |
|---|---|
| `save/` | The save (`save.ts`: schema v19, parsing, migrations) and its rules: `battle.ts` (classes, fights, rewards, Springs), `work.ts` (jobs), `kitchen.ts`, `forge.ts`, `targets.ts` (farming targets), `heroes.ts` (Halls of Heroes, Learners, Bonds), `exchange.ts`, `rules.ts` (unlocks, parties), `notify.ts` (push text) |
| `rpg/` | `kinds.ts` (weapons, elements, statuses), `rules.ts` (classes, stats, levels, learning), `catalog.ts` (every skill tree), `heroes.ts` and `hero-id.ts` (the twenty hero Limit Breaks, Bonds), `battle/` (engine v9, limits, auto), `campaign/` (foes, rewards, the chapter machinery regions reuse) |
| `world/` | `biomes.ts`, `world.ts` (continents, regions, stage generator), `balance.test.ts` (the `SIM=1` win-rate simulation) |
| `economy/` | `pacing.ts` (times, prices, Laurels), `ranks.ts` (Class, Weapon and Armor Ranks, Marks), `jobs.ts` (facilities), `dishes.ts`, `gear.ts`, `bonus.ts` (Extra Stats points), `stock.ts` |
| `items/` | The 16 families and 320 items |
| `hub/places.ts` | Every place on the four Hub pages |
| `master/`, `roster/` | Master data to the game's roster: outfits, aptitudes, filters |
| `docs/` | The renderer for these docs' live blocks (test-only, not built) |

## Web app

- **Routing** (`app/router.tsx`):
  - `/` goes to the last page.
  - `/:page` is the Hub, and `?peek=:id` adds a quick look.
  - `/:page/:placeId/*` is a place's full page.
- **Loading:** the place screens are lazy chunks (`places/registry.tsx`). Phaser and Firebase load only when needed.
- **Store** (`save/game.ts`):
  - One Zustand store holds the save.
  - Each action runs a pure domain function, writes the device copy to IndexedDB (Dexie `uma-rpg`, row `main`) and
    schedules a sync 1.5 s later.
  - A sync also runs when the app becomes visible or comes back online.
  - **Sync:** GET the server's save, then reconcile: adopt it, push ours, or neither. A stale push gets a 409 and
    retries up to 3 times. When both sides changed, the save with the newer `account.updatedAt` wins whole.
  - **Boot:** use the device copy at once and sync behind it; with no device copy, fetch the server's or start first
    launch.
- **PWA** (`vite.config.ts`, vite-plugin-pwa):
  - Updates are prompted ("Update ready · Restart"), never forced mid-action.
  - The service worker precaches the app, Phaser included, and caches master data and cast art by URL hash.
  - `push-sw.js` shows notifications and sets the app badge.
- **Auth:** Firebase Google sign-in with a redirect. The ID token goes to the API as `Authorization: Bearer`.
- **Master data** (`master/master.ts`):
  - `@luismlorenzana/uma-data`'s release client reads through the API proxy (`/api/master/`).
  - It loads characters, outfits, scenarios and the art index once a session; skills load only when needed.
- **Original art:** `@luismlorenzana/uma-art` atlases (items, dishes, gear, buildings, tiles) are bundled by Vite.
- **The battle stage** is Phaser (`battle/scene/`). Every number and control is a DOM element laid over the canvas (D33).

## API

`apps/api/src/main.ts`: prefix `/api`, CORS for the site, 1 MB JSON limit.

| Endpoint | Guard | What |
|---|---|---|
| `GET /api/health` | none | `{ ok, build, uptime }` |
| `GET /api/save` · `PUT /api/save` | auth | The save envelope `{ revision, save }`. A PUT carries `baseRevision`: 400 on a parse error, 409 with the current save when stale |
| `GET /api/master/*` | auth | Master data release files, manifests and channels, from the bucket |
| `GET /api/content/*` | auth | The private cast: `[pack/]cast.json` and hash-named portraits |
| `GET /api/push/key` · `PUT`/`DELETE /api/push/subscription` · `POST /api/push/test` | auth | Web Push |
| `POST /api/push/tick` | Cloud Scheduler OIDC | Sends "work done" pushes since the last tick |

- **Auth:** Firebase Admin verifies the token, and the email must equal `ALLOWED_EMAIL`, a one-player allowlist.
  `AUTH_MODE=disabled` (local) acts as `local-dev`.
- **Storage:**
  - Production uses Firestore: `saves/{uid}` is written in a transaction, and a schema bump first backs the old save up
    to `saveBackups/{uid}-v{n}`. `push/{uid}` holds push subscriptions.
  - Local uses a JSON file (`LOCAL_SAVE_FILE`, default `apps/api/.data/save.json`) and in-memory push.
- **Env vars:** `PORT`, `AUTH_MODE`, `ALLOWED_ORIGIN`, `ALLOWED_EMAIL`, `PERSISTENCE`, `LOCAL_SAVE_FILE`, `MASTER_BUCKET`,
  `MASTER_DIR`, `CONTENT_BUCKET`, `CONTENT_DIR`, `BUILD_ID`, `VAPID_KEYS`, `PUSH_SCHEDULER_EMAIL`, `PUSH_AUDIENCE`.

## The save

- **Schema v19** (`save/save.ts`).
- One save per player; worlds are kept per tier (`tierWorlds["1"]`).
- Older saves migrate on parse. Recent steps:
  - **v10:** a progress reset that kept Umas and parties.
  - **v11:** the world map.
  - **v12:** Time Tickets.
  - **v13:** class ranks capped at 5.
  - **v14:** the class rework (weapons renamed and refunded, open fight closed).
  - **v15:** Crafting Tokens become Mastery Tokens (D94).
  - **v16:** Farm and Craft Levels move to the longer curve, keeping the EXP earned (D96).
  - **v17:** farming targets, none to start (D100).
  - **v18:** ranks earned by fighting, five armor slots, Marks, no tokens; every older save starts its progress over
    (D102–D105).
  - **v19:** the Halls of Heroes' seats and each Uma's Bonds, both empty; 5 Unlock Tickets (D106).

```
Save { schemaVersion, account { trainerName, createdAt, updatedAt }, tierWorlds: { "1": TierWorld } }
TierWorld { createdAt, wallet { unlockTickets, shards, laurels, timeTickets, sweepTickets, gearMarks, classMarks },
  umas: { <outfitId>: OwnedUma }, parties: [20 × { name, slots[5] }],
  world { activeParty, run { wins, mp, battle | null, battles, … }, springs },
  items, facilities, dishes, gear, targets, heroes: { <seat>: { hero, learners[≤10] } } }
OwnedUma { unlockedAt, level, exp, classId, classes { <class>: { weapons, tree, loadout } },
  professions { farming, gathering }, ranks { classes, weapons, armors: { <id>: { rank, exp } } },
  stars { unlocked, active }, gear { locker, equipped, kinds }, bonds { <seat>: { level, exp } } }
```

An open fight is stored as `{ input, actions }`: the frozen fight and every action, replayed on load (D52).

## Private content

Franchise faces aren't original content, so they never go in git (CLAUDE.md, AGENTS.md):
- `scripts/cast/import*.mjs` build each pack into `content/release/[<pack>/]` from the owner's sources. Last Origin's
  import is run by the owner, because its wiki asks AI agents not to fetch.
- `bash scripts/cast/publish.sh [pack]` uploads to `gs://uma-rpg-content`, with gcloud scoped to `uma-rpg`.
- The app fetches them through `/api/content/` with the player's token.

The packs: PriConne at the root, plus `azurlane/`, `lastorigin/`, `destinychild/`, `nikke/` and `girlsfrontline/`.

## Build and deploy

`.github/workflows/deploy.yml`:
- Runs on every push to `main` (docs-only changes skip it) and on pull requests.
- **verify:** install, `pnpm lint`, `pnpm test`, `pnpm build`.
- **deploy** (`main` only):
  1. Build the API image and push it to Artifact Registry.
  2. Deploy Cloud Run `rpg-api` (us-central1, scales 0–1).
  3. Smoke-test it.
  4. Build the web app and deploy Firebase Hosting `uma-rpg`.
  5. Check the hosted site.

| Thing | Value |
|---|---|
| GCP project | `uma-rpg` |
| Site | https://uma-rpg.web.app |
| API | Cloud Run `rpg-api`, us-central1 |
| Saves | Firestore Native |
| Master data | `gs://uma-platform-master-data` (project `uma-platform-lm`) |
| Private content | `gs://uma-rpg-content` |
| Push tick | Cloud Scheduler `rpg-push-tick`, every 5 minutes |

**Operating rules:**
- Scope gcloud with `CLOUDSDK_ACTIVE_CONFIG_NAME=default CLOUDSDK_CORE_PROJECT=uma-rpg`, and never switch the active
  account.
- Claude pushes to `main`; delegated agents use branches and pull requests.

## Local development

```bash
NODE_AUTH_TOKEN=$(gh auth token) pnpm install
pnpm --filter @rpg/api dev   # :8081, auth off, local save, master data from ../uma-platform/content/release
pnpm --filter @rpg/web dev   # :5174, proxies /api to :8081 (API_PROXY_TARGET to change it)
pnpm lint && pnpm test && pnpm build
pnpm docs:update             # rewrite these docs' live blocks after a rule change
```

- `.claude/launch.json` runs the same two servers for Claude's preview.
- Add `?canvas` to a Hub URL to force Phaser's canvas renderer for screenshots.
- Balance: `SIM=1 npx vitest run src/world/balance.test.ts` in `packages/domain`.

## uma-platform

The shared foundation, in the sibling repo (`../uma-platform`, `luismlorenzana/uma-platform`):

| Package | Version used | What |
|---|---|---|
| `@luismlorenzana/uma-data` | 1.0.0 | Master data types, parsers, the release client; `/testing` fixtures |
| `@luismlorenzana/uma-art` | 2.0.0 | Original pixel-art atlases, drawn from code by `scripts/pixel-art` (`pnpm art:draw`) |

Master data releases are content-addressed (`files/`, `manifests/v1/`, `channels/v1/latest.json`) and published by
the owner's pipeline. Shared changes (schema, art) happen in a uma-platform session.
