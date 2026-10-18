# Architecture and technical setup

How uma-rpg is built and run. Values come from the code and `docs/technical/infrastructure.md`, which holds every
production value and is the place to change them.

## The pieces

```
 iPhone (Home Screen PWA)
   └─ apps/web  React 19 + Vite 7 + Tailwind 4 + Zustand + Dexie; Phaser 4 for the Hub and battles;
                uma-kit for the theme, shell and Hub map
        │  /api/*  (Firebase Hosting rewrites to Cloud Run)
        ▼
   apps/api  NestJS 11 on Cloud Run `rpg-api`
        ├─ saves ──────────► Firestore `saves/{uid}` (local: apps/api/.data/save.json)
        ├─ master data ────► gs://uma-platform-master-data (local: ../uma-platform/content/release)
        ├─ private enemies ► gs://uma-rpg-content (local: content/enemies-release, gitignored)
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
| enemy scripts | `scripts/enemies/` | Build and publish the three locked franchise packs | `content/enemies-release/` (gitignored) |

pnpm workspace with Turbo. TypeScript is strict with `noUncheckedIndexedAccess`, and tests are Vitest. Commands are in
`AGENTS.md`.

## Domain map

| Folder | What |
|---|---|
| `save/` | The save (`save.ts`: schema v22, parsing, migrations) and its rules: `battle.ts` (classes, fights, rewards, Springs), `work.ts` (jobs on the shared engine, and the slot view the screens read), `observatory.ts` (setting Star Gems, active nodes), `forge.ts`, `targets.ts` (targets), `heroes.ts` (Halls of Heroes, Learners, Bonds), `exchange.ts`, `rules.ts` (unlocks, parties), `notify.ts` (push text) |
| `rpg/` | `kinds.ts` (weapons, elements, statuses), `rules.ts` (classes, stats, levels, learning), `catalog.ts` (every skill tree), `heroes.ts` and `hero-id.ts` (the twenty hero Limit Breaks, Bonds), `battle/` (engine v13, limits, auto), `campaign/` (foes, rewards, the chapter machinery regions reuse) |
| `work/` | uma-rpg's side of `@luismlorenzana/uma-work` (SC3): `request.ts` (a job's request), `kinds/` (`gather.ts`, `refine.ts`, `craft.ts`, `cut.ts`: plan and pay), `env.ts` (facilities as buildings, Speed Tickets, Craft Level, Laurels) |
| `world/` | `biomes.ts`, `world.ts` (continents, regions, stage generator), `balance.test.ts` (the `SIM=1` win-rate simulation) |
| `economy/` | `pacing.ts` (times, prices, Laurels), `ranks.ts` (Class, Weapon and Armor Ranks, Marks), `jobs.ts` (facilities), `stars.ts` (the Extra Stats map and gem ids), `gems.ts` (Star Gem recipes), `gear.ts`, `bonus.ts` (Extra Stats points), `stock.ts` |
| `items/` | The 8 families and 160 items |
| `hub/places.ts` | Every place on the four Hub pages, and Town Hall's plaza |
| `master/`, `roster/` | Master data to the game's roster, RPG aptitude labels and stat totals. Album queries/order live in uma-kit |
| `docs/` | The renderer for these docs' live blocks (test-only, not built) |

## Web app

- **Routing** (`app/router.tsx`):
  - `/` goes to the last page.
  - `/:page` is the Hub. `?peek=:id` adds a quick look, `?sheet=menu` the menu and `?sheet=featured` the featured
    Uma's sheet.
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
  - The service worker precaches the app, Phaser included, and caches master data and enemy art by URL hash.
  - `push-sw.js` shows notifications and sets the app badge.
- **Getting in** (SD3): `uma-kit/auth`'s `AuthProvider` (Firebase Google sign-in with a redirect, loaded on demand,
  with this game's config from `app/firebase-config.ts`) and `uma-kit/places`' `BootGates` and `UpdateNotice`. The ID
  token goes to the API as `Authorization: Bearer`.
- **Master data** (`master/master.ts`):
  - `@luismlorenzana/uma-data`'s release client reads through the API proxy (`/api/master/`).
  - It loads characters, outfits, scenarios and the art index once a session; skills load only when needed.
- **Original art:** `@luismlorenzana/uma-art` atlases (items, gear, buildings, tiles) are bundled by Vite.
- **The work engine** (`@luismlorenzana/uma-work`, uma-platform P53, SC3) runs every job: slots, reserving, the clock,
  queues, collect, recall, Speed Tickets and upgrades. It's pure TypeScript in ESM and CommonJS, so the API runs the same
  rules when it accepts a save.
- **The shared app** (`@luismlorenzana/uma-kit`, uma-platform P48, D147) is the same package as uma-racer's:
  - the theme, light and dark under one set of names;
  - the primitives (icons, marks, sheets, tabs, buttons);
  - the shell (frame, top and bottom bars, menu, side panel, place header);
  - the Hub map (terrain, scene, place buttons, pips, swipe);
  - since SD3, getting in (`/auth`) and the frames of the Account, the Warehouse, the Exchange and the profile
    (`/places`), each filled with this game's content and words;
  - the album engine and device preferences (`/roster`), plus art tiles, album chrome, virtual grid and Uma picker
    (`/album`, 0.7.1). The Stable, six picker contexts and plaza chooser use these components, not local copies.

  uma-rpg gives it its places, currencies, words and art. `main.tsx` wires the uma-art atlases (`KitArtProvider`),
  the appearance and Motion, and `AlbumArtProvider` over this game's authenticated content loader. Faces use
  uma-data 1.1.0's `outfit-faces`, with the icon atlas as fallback; busts and plaza chibis use their own families.
  `album/` holds RPG row values, schema, eligibility and the one-time old preference migration. `hub/` holds this
  game's bars, plaza and Hub screen. Rules, vocabulary, routes and save v22 stay game-owned.
- **The battle stage** is Phaser (`battle/scene/`). Every number and control is a DOM element laid over the canvas (D33).

## API

`apps/api/src/main.ts`: prefix `/api`, CORS for the site, 1 MB JSON limit.

| Endpoint | Guard | What |
|---|---|---|
| `GET /api/health` | none (`@Public()`) | `{ ok, build, uptime }` |
| `GET /api/save` · `PUT /api/save` | auth | The save envelope `{ revision, save }`. A PUT carries `baseRevision`: 400 on a parse error, 409 with the current save when stale |
| `GET /api/master/*` | auth | Master data release files, manifests and channels, from the bucket |
| `GET /api/content/*` | auth | `enemies.json` and its allowlisted, hash-named `enemies/*.webp` images |
| `GET /api/push/key` · `PUT`/`DELETE /api/push/subscription` · `POST /api/push/test` | auth | Web Push |
| `POST /api/push/tick` | Cloud Scheduler OIDC (`@Public()` to the shared guard) | Sends "work done" pushes since the last tick |

- **Auth** (SD3): the shared guard from `@luismlorenzana/uma-server/auth` (uma-platform P54) guards every route.
  Firebase Admin verifies the token (401 without one or with a bad one), and the email must equal `ALLOWED_EMAIL`, a
  one-player allowlist (403 for anyone else). `AUTH_MODE=disabled` (local) acts as `local-dev`.
- **Storage:**
  - Production uses Firestore: `saves/{uid}` is written in a transaction, and a schema bump first backs the old save up
    to `saveBackups/{uid}-v{n}`. `push/{uid}` holds push subscriptions.
  - Local uses a JSON file (`LOCAL_SAVE_FILE`, default `apps/api/.data/save.json`) and in-memory push.
- **Env vars:** `PORT`, `AUTH_MODE`, `ALLOWED_ORIGIN`, `ALLOWED_EMAIL`, `PERSISTENCE`, `LOCAL_SAVE_FILE`, `MASTER_BUCKET`,
  `MASTER_DIR`, `CONTENT_BUCKET`, `CONTENT_DIR`, `BUILD_ID`, `VAPID_KEYS`, `PUSH_SCHEDULER_EMAIL`, `PUSH_AUDIENCE`.

## The save

- **Schema v22** (`save/save.ts`).
- One save per player; worlds are kept per tier (`tierWorlds["1"]`).
- Older saves migrate on parse. Recent steps:
  - **v10:** a progress reset that kept Umas and parties.
  - **v11:** the world map.
  - **v12:** Speed Tickets.
  - **v13:** class ranks capped at 5.
  - **v14:** the class rework (weapons renamed and refunded, open fight closed).
  - **v15:** Crafting Tokens become Mastery Tokens (D94).
  - **v16:** profession levels move to the longer curve, keeping the EXP earned (D96).
  - **v17:** targets, none to start (D100).
  - **v18:** ranks earned by fighting, five armor slots, Marks, no tokens; every older save starts its progress over
    (D102–D105).
  - **v19:** the Halls of Heroes' seats and each Uma's Bonds, both empty; 5 Uma Tickets (D106).
  - **v20:** armor without accents (one of each piece kept), a feet slot, two accessory slots, Accessory Ranks (D124).
  - **v21:** one profession, Craft Level, at the higher of her two levels; Star Gems; only items and facilities the game
    still has, each facility with its level's new slots; opened nodes kept (D144).
  - **v22:** work moves to per-Uma rows on `@luismlorenzana/uma-work`; each facility keeps its level; every running job
    finishes into its shelf with its Craft EXP, queued jobs drop, and every Uma starts free (SC3).

```
Save { schemaVersion, account { trainerName, createdAt, updatedAt }, tierWorlds: { "1": TierWorld } }
TierWorld { createdAt, wallet { unlockTickets, shards, laurels, timeTickets, sweepTickets, gearMarks, classMarks },
  umas: { <outfitId>: OwnedUma }, parties: [20 × { name, slots[5] }],
  world { activeParty, run { wins, mp, battle | null, battles, … }, springs },
  items, buildings: { <placeId>: { level } }, work: { <outfitId>: WorkRow }, gems, gear, targets,
  heroes: { <seat>: { hero, learners[≤10] } } }
WorkRow { outfitId, slot { building, slot } | null, entries [Entry], queue [≤3 requests], last { slot, request } | null,
  dropped { at, slot, requests, short, refused } | null }
Entry { request { kind, item, count }, seconds[], inputs[], outputs[], exp[], startedAt, acceleratedMs, collected, speed,
  fromQueue }   (times in milliseconds)
OwnedUma { unlockedAt, level, exp, classId, classes { <class>: { weapons, tree, loadout } },
  craft { level, exp }, ranks { classes, weapons, armors, accessories: { <id>: { rank, exp } } },
  stars { unlocked, active }, gear { locker, equipped, kinds }, bonds { <seat>: { level, exp } } }
```

An open fight is stored as `{ input, actions }`: the frozen fight and every action, replayed on load (D52).

## Private content

Franchise art isn't original content, so it never goes in git (CLAUDE.md, AGENTS.md). The enemy release (D135) is
built from locked franchise packs in `content/authoring/exports/`: PriConne and Azur Lane (D133) and NIKKE (D134).
- `pnpm enemies:release` re-encodes every unit for the phone into the gitignored `content/enemies-release/`:
  - a 128 px square face, a vertical of up to 480×720 and, above Regular, a splash of up to 1280×720, all WebP;
  - `enemies.json`, the list: each unit's id, franchise, tier, name and images.
- `pnpm enemies:publish` uploads it to `gs://uma-rpg-content` (images, then the list), with gcloud scoped to `uma-rpg`.
- The app fetches `enemies.json` and the images through `/api/content/` with the player's token, and serves only those
  paths. Local dev reads `content/enemies-release/`.

The authoring tools are retired (D136, D137), and their images are off this machine: only `enemies.json` and the
authoring records stay local, so local dev has no enemy images. Rebuilding needs the locked packs back
([enemy roster](../design/enemy-roster.md#on-this-machine-d137)).

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
| `@luismlorenzana/uma-art` | 2.1.0 | Original pixel-art atlases, drawn from code by `scripts/pixel-art` (`pnpm art:draw`) |

Master data releases are content-addressed (`files/`, `manifests/v1/`, `channels/v1/latest.json`) and published by
the owner's pipeline. Shared changes (schema, art) happen in a uma-platform session.
