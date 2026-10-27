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
| `@rpg/api` | `apps/api` | Save, shared master-data and content routes, push | `nest build` → `dist/main.js`, shipped as a Docker image |
| enemy scripts | `scripts/enemies/` | Build and publish the three locked franchise packs | `content/enemies-release/` (gitignored) |

pnpm workspace with Turbo. TypeScript is strict with `noUncheckedIndexedAccess`, and tests are Vitest. Commands are in
`AGENTS.md`.

## Domain map

| Folder | What |
|---|---|
| `save/` | The save (`save.ts`: schema v31, parsing, migrations) and its rules: `class.ts` (an Uma's starting and active class, her setup per class, one healer a party; main bundle), `battle.ts` (classes, fights, rewards, Springs; the world map's fights load on demand through `@rpg/domain/battle`, H62), `work.ts` (jobs on the shared engine, Finish all, and the slot view the screens read), `observatory.ts` (setting jewels; v1's Star Gems), `forge.ts` (raising grades, the accessory's form; v1's pieces), `targets.ts` (targets), `presets.ts` (each class's standard equipment preset), `upgrades.ts` ("Can upgrade"), `heroes.ts` (Halls of Heroes, Learners, Bonds), `exchange.ts`, `rules.ts` (unlocks, parties), `notify.ts` (push text), `rift.ts` (the Rift's run rules and Ascend: sign-up, fronts, the Convergence, Echoes and Sweeps, promotion; lazy, through `@rpg/domain/rift`) |
| `rpg/` | `kinds.ts` (weapons, elements, twins, statuses), `rules.ts` (classes, stats, levels, lines and Skill Ranks), `catalog.ts` (every skill tree), `tree-view.ts` (the Skills tab's tree model), `heroes.ts` and `hero-id.ts` (the six halls' 24 hero Limit Breaks, v14's twenty, Bonds), `battle/` (engine v17, the Tier rework's economy, live since H82, D218, on v16's fight, live since H72, D210, and classes v2's, live since H61; `caps.ts` holds the switch, `BATTLE_ENGINE_VERSION`, and `rpgRework(stage, engine)` opens each release, so every class rule answers by generation and v6–v16 replay; limits, auto; the engine's functions load on demand through `@rpg/domain/engine`, `battle/index.ts`, and the main index keeps its types, caps and skill numbers, H62), `campaign/` (foes, rewards, the chapter machinery regions reuse) |
| `rift/` | `state.ts`: the Rift's save shape, constants, achievement ids and selectors (`riftOpen`, `riftLevel50s`, `openRiftRun`; main index); `achievements.ts`: the achievement hook; `fronts.ts`, `picker.ts`, `generate.ts`: the Rift's fronts, faces and fights (`@rpg/domain/rift`, a lazy subpath, through `index.ts`, which also exports `save/rift.ts`) |
| `work/` | uma-rpg's side of `@luismlorenzana/uma-work` (SC3): `request.ts` (a job's request), `kinds-v4/` (gather and process `material.ts`, make `make.ts`), `kinds-v3/trade.ts` (the trade gate and open shop), `env-v4.ts` (the fifteen places as buildings; `liveWorkEnv`), `env.ts` (Speed Tickets, Craft Level, Laurels; v1's facilities and `kinds/`) |
| `world/` | `biomes.ts`, `world.ts` (continents, regions, stage generator), `balance.test.ts` (the `SIM=1` win-rate simulation) |
| `economy/` | `pacing.ts` (times, prices, Laurels), `professions.ts` (the fifteen professions and five trades), `places-v4.ts` (each place's line and one kind of job, `workPlace`), `grades.ts` (gear by grade: Might, armor values, the gate), `accessories.ts` (the four families' base forms, the signature), `planet.ts` (the Planet, three moons and her moon), `ranks.ts` (Class Rank, Class Marks; v1's gear ranks), `bonus.ts` (points), `stock.ts`; v1's `jobs.ts`, `stars.ts`, `gems.ts`, `gear.ts` for the migrations and old fights |
| `items/` | The five lines of ten grades (`lines.ts`, the farm by line since H112), made items (`made-id.ts`, `made.ts`: names and places; `made-v4.ts`: one-line recipes); v1's 8 families and 160 items (`catalog.ts`) for the migrations |
| `hub/places.ts` | Every place on the four Hub pages, and Town Hall's plaza |
| `master/`, `roster/` | Master data to the game's roster, RPG aptitude labels and stat totals; `template.ts`, the Uma Template rule and the calling (D203): a new unlock starts in her calling (live since H72). Album queries/order live in uma-kit |
| `docs/` | The renderer for these docs' live blocks (test-only, not built) |

## Web app

- **Routing** (`app/router.tsx`):
  - `/` goes to the last page.
  - `/:page` is the Hub. `?peek=:id` adds a quick look, `?sheet=menu` the menu and `?sheet=featured` the featured
    Uma's sheet.
  - `/:page/:placeId/*` is a place's full page.
  - Every route renders inside `hub/TierShell.tsx`, which keys the shell by the active tier (H35).
  - `?tier=n` on any route (a push notification's link) opens that tier when the save has its world, then the shell
    drops the param with a replace, keeping the entry's state. An invalid tier or one without a world is ignored. Routes
    are the same in every tier.
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
  - **The active tier** (H35, `save/tier.ts`): `activeTier` picks the tier world every screen reads (`useWorld()`) and
    every action writes. It's remembered on the device as `rpg.tier`, written on every change, boot included.
    - The boot opens on the `?tier=` the app was opened with, else the remembered tier, else the highest tier whose
      world has an Uma, else Tier 1, always one the save has a world for. A first launch is Tier 1.
    - `setActiveTier(tier)` switches and remembers; it returns false and changes nothing for a tier with no world. It
      never navigates. `useActiveTier()` reads it.
    - An action takes the tier on screen when it's called, so a switch while its rules load never moves its write.
    - A sync that adopts a save without the active tier's world falls back to the start rule.
    - Switching tiers remounts the whole shell (`<Shell key={activeTier} />`): the bars, every place, the Hub's Phaser
      scene and every component cache. Module caches keyed by world carry the tier, such as `battle/campaign.tsx`'s
      campaigns.
    - The album lists the active world's Umas, and in Tier 1 also the outfits no world owns (`useAlbumScope()`).
- **PWA** (`vite.config.ts`, vite-plugin-pwa):
  - Updates are prompted ("Update ready · Restart"), never forced mid-action.
  - The installed iOS app uses the opaque default status bar. `viewport-fit=cover` still exposes the bottom safe area for
    the Home indicator, while keeping game content out of iOS 27's forced translucent top-edge blur. Changing this
    install-time setting requires removing and adding the Home Screen app again.
  - The service worker precaches the app, Phaser included, and keeps its existing URL caches for master data and enemy
    art. `uma-kit/content` also verifies release hashes and keeps release and hash-named enemy bytes in Cache Storage.
  - `push-sw.js` shows notifications and sets the app badge.
- **Getting in** (SD3): `uma-kit/auth`'s `AuthProvider` (Firebase Google sign-in with a redirect, loaded on demand,
  with this game's config from `app/firebase-config.ts`) and `uma-kit/places`' `BootGates` and `UpdateNotice`. The ID
  token goes to the API as `Authorization: Bearer`.
- **Master data** (`master/master.ts`):
  - One `ContentProvider` and content client from `@luismlorenzana/uma-kit/content` read the uma-data release through
    `/api/master/`; `master.ts` only adapts that release to this game's `MasterView`.
  - Characters, outfits, scenarios and the art index load once a session; skills load only when needed.
- **Original art:** `@luismlorenzana/uma-art` atlases (items, gear, buildings, tiles) are bundled by Vite. Private
  outfit art from uma-data and the enemy pack's faces, verticals and splashes load through that same authenticated
  content client, with blob URLs in memory and hash-checked Cache Storage copies where applicable.
- **The work engine** (`@luismlorenzana/uma-work`, uma-platform P53, SC3) runs every job: slots, reserving, the clock,
  queues, collect, recall, Speed Tickets and upgrades. It's pure TypeScript in ESM and CommonJS, so the API runs the same
  rules when it accepts a save.
- **The shared app** (`@luismlorenzana/uma-kit`, uma-platform P48, D147) is the same package as uma-racer's:
  - the theme, light and dark under one set of names;
  - the primitives (icons, marks, sheets, tabs, buttons);
  - the shell (frame, top and bottom bars, menu, side panel, place header), with the crest's tier shifter and the tier
    tints since 0.12.0 (H36);
  - the Hub map (terrain, scene, place buttons, pips, swipe);
  - since SD3, getting in (`/auth`) and the frames of the Account, the Warehouse, the Exchange and the profile
    (`/places`), each filled with this game's content and words;
  - the album engine and device preferences (`/roster`), plus art tiles, album chrome, virtual grid and Uma picker
    (`/album`), and the shared Wilds work screens (`/work`, 0.9.1). The Stable, six picker contexts, plaza chooser and
    facility screens use these components, not local copies.

  uma-rpg gives it its places, currencies, words and art. `main.tsx` wires the uma-art atlases (`KitArtProvider`),
  the appearance and Motion, the shared `ContentProvider`, and `AlbumArtProvider`. Faces use
  uma-data 1.1.0's `outfit-faces`, with the icon atlas as fallback; busts and plaza chibis use their own families.
  `album/` holds RPG row values, schema, eligibility and the one-time old preference migration. `hub/` holds this
  game's bars, plaza and Hub screen. Rules, vocabulary, routes and save v31 stay game-owned.
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
| `POST /api/push/tick` | Cloud Scheduler OIDC (`@Public()` to the shared guard) | Sends "work done" pushes since the last tick, one per tier world with news (H35) |

- **Push tick** (`push/push.service.ts`): it reads every tier world of each save (`tierNotices`). Each world with news
  sends one notification, linking with `?tier=n` and titled with its tier when the save has several worlds. Each carries
  the badge of every world's ready slots (`readyEverywhere`), and `sent` counts notifications.
- **Auth** (SD3): the shared guard from `@luismlorenzana/uma-server/auth` (uma-platform P54) guards every route.
  Firebase Admin verifies the token (401 without one or with a bad one), and the email must equal `ALLOWED_EMAIL`, a
  one-player allowlist (403 for anyone else). `AUTH_MODE=disabled` (local) acts as `local-dev`.
- **Content routes** (SE3): `ReleaseProxyModule` and `PrivatePackModule` from
  `@luismlorenzana/uma-server/content` serve the same `/api/master/*` and `/api/content/*` routes from the same env
  vars. The game's private allowlist remains `enemies.json` plus hash-named WebP face, art and splash files; the shared
  modules own traversal checks, content types, cache headers, local-folder sources and bucket reads.
- **Storage:**
  - Production uses Firestore: `saves/{uid}` is written in a transaction, and a schema bump first backs the old save up
    to `saveBackups/{uid}-v{n}`. `push/{uid}` holds push subscriptions.
  - Local uses a JSON file (`LOCAL_SAVE_FILE`, default `apps/api/.data/save.json`) and in-memory push.
- **Env vars:** `PORT`, `AUTH_MODE`, `ALLOWED_ORIGIN`, `ALLOWED_EMAIL`, `PERSISTENCE`, `LOCAL_SAVE_FILE`, `MASTER_BUCKET`,
  `MASTER_DIR`, `CONTENT_BUCKET`, `CONTENT_DIR`, `BUILD_ID`, `VAPID_KEYS`, `PUSH_SCHEDULER_EMAIL`, `PUSH_AUDIENCE`.

## The save

- **Schema v31** (`save/version.ts`, re-exported by `save/save.ts`).
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
  - **v23:** account achievements and each Uma's tier history, and each world's Rift state, all empty (D163).
  - **v24:** the account's defeated Rift faces, each world's open Rift fight and fight count, and each run's traces and
    open Convergence attempt, all empty (D171).
  - **v25:** classes v2's Paladin (D180, D188). Every Uma with Cleric progress gets the same Class Rank, tree (renamed
    `cleric-` → `paladin-`) and loadout as a Paladin; the Cleric's "any five" weapons become 3 Tomes + 2 Arms and the
    Paladin's 3 Arms + 2 Tomes, keeping hers where they fit; the Chapel's seats 3–4 move to the Bastion's 1–2 with their
    Heroes, Learners and Bonds; accessory 1 holds an Orb and accessory 2 a Talisman or an Amulet, a second piece of one
    group staying in her locker. Classes, parties, open fights (their v14 inputs replay on v14) and runs don't move. The
    API backs the stored v24 save up to `saveBackups/{uid}-v24` on the first v25 write (D69).
  - **v26:** each party gains `lead`. The migration names its first occupied slot, preserving the face used by v25,
    while later lead changes leave all five slots in place (D190).
  - **v27:** the Tier rework's fight (D205, D210). Every class an Uma has set up gets its three default weapons (her
    crafted pieces stay equipped on their kinds), her side skills become **lines** (B on a tree where she learned any
    node of its B line, at any depth; `tree` goes), and her loadout keeps, in her order, what she still holds within
    v16's slots at her level (none left: back to auto). Every Uma gains `calling: { pick: null, confirmed: false }`: her
    pre-selection, unconfirmed. Class Ranks, seats, Bonds, Marks, gear, parties and the open fights don't move (their
    v15 inputs replay and settle on v15). The API backs the stored v26 save up to `saveBackups/{uid}-v26` on the first
    v27 write (D69).
  - **v28:** the Tier rework's economy and the Speed Ticket grant (D214, D218), per world: every started job is settled
    (its items made, its Craft EXP paid), queues drop and `work` empties; each Uma's tickets are ⌈(EXP her Craft Level
    took + her bank) ÷ 60⌉, and the world is paid their sum, or the floor (the deleted pieces' and Star Gems' own making
    time at Craft Lv 25) when higher; facility upgrades give their Laurels and refined items back; the Warehouse converts
    one for one by family and band into the five lines' types; every Uma goes to Craft Lv 1, every grade G0 with one
    accessory slot and no family, an empty map and Class Ranks only; Gear Marks join Class Marks; the gear and gem
    shelves and `buildings` go; `grant` records it all (null when there was nothing to pay). Levels, classes, calling,
    Bonds, parties, targets, seats, the Rift and the open fights don't move (their v15 or v16 inputs replay and settle on
    their engine). The API backs the stored v27 save up to `saveBackups/{uid}-v27` on the first v28 write (D69).
  - **v29:** the grant is tickets only (D221, the owner's review): in a world that took the grant every material leaves
    the Warehouse (its gathering was already in the tickets), and the grant's sheet stops listing the stock and the
    upgrades' refined items; made items, Laurels, tickets and Craft Levels stay, and a world without a grant keeps its
    materials. The API backs the stored v28 save up to `saveBackups/{uid}-v28` on the first v29 write (D69).
  - **v30:** the farm by line (D224, H110, live from H112): every started job settles into the Warehouse with its Craft
    EXP and queued requests drop; R2's sixty types move to the line's grade that opens at the same Craft Level, a low type
    of any tier to its G1 and a high type to its G6, summed in one pass (`toV30`, `V30_TYPES`); made items (a Weapon Gem
    reads Arms Gem), grades, jewels, Craft Levels, Laurels and tickets stay. Its parse reads a making place's two kinds of
    job and the same fifty types in every world. The API backs the stored v29 save up to `saveBackups/{uid}-v29` on the
    first v30 write (D69).
  - **v31:** the Wilds' trios (D230, H114): every v30 started job settles into the Warehouse with its Craft EXP and
    queues drop, then `work` is empty. Each line now has one gathering place, one processing workbench and one making
    place; the current parse accepts only that place's one kind among the fifteen place ids. Stock, gear, maps, levels,
    parties, targets, battles, Laurels and tickets stay. The API backs the stored v30 save up to
    `saveBackups/{uid}-v30` on the first v31 write (D69).

```
Save { schemaVersion, account, tierWorlds: { "1": TierWorld } }
account { trainerName, createdAt, updatedAt, achievements { <id>: { at, run | null } },
  history { <outfitId>: [{ tier, at, run }] }, defeated { <castId>: at } }
TierWorld { createdAt, wallet { unlockTickets, shards, laurels, timeTickets, sweepTickets, classMarks },
  umas: { <outfitId>: OwnedUma }, parties: [20 × { name, slots[5], lead | null }],
  world { activeParty, run { wins, mp, battle | null, battles, … }, springs },
  items (materials and made items), buildings: {}, work: { <outfitId>: WorkRow }, targets,
  heroes: { <seat>: { hero, learners[≤10] } },
  rift { runs [RiftRun], echoes { <front>: { <level>: at } }, battle: RiftBattle | null, battles },
  grant: TierGrant | null }
TierGrant { tickets, floor, umas { <outfitId>: { level, exp, tickets } }, deleted { gear, gems, upgrades },
  back { laurels, items, stock }, seen }
RiftRun { id, roster[20], startedAt, fronts { iron, arcane, duel, horde },
  convergence { attempts, open: { parties[4][5], rounds[] } | null }, traces { <front>: [trace] }, wonAt | null,
  ascendedAt | null }
RiftBattle { battleId, ref, startedAt, input, actions }
  (battleId rift:t<tier>:<n>; ref { kind: front, front, stage } | { kind: convergence, fight } | { kind: echo, front, level };
   trace physical | magical | ko)
WorkRow { outfitId, slot { building, slot } | null, entries [Entry], queue [≤3 requests], last { slot, request } | null,
  dropped { at, slot, requests, short, refused } | null }
Entry { request { kind, item, count }, seconds[], inputs[], outputs[], exp[], startedAt, acceleratedMs, collected, speed,
  fromQueue }   (times in milliseconds)
OwnedUma { unlockedAt, level, exp, classId, classes { <class>: { weapons[3], lines { <weapon>: B }, loadout } },
  (six classes)
  craft { level, exp }, ranks { classes: { <class>: { rank, exp } } },
  stars { open [node ids], moons [] }, gear { weapons { <weapon>: { grade } }, armor { <slot>: { grade } },
  accessories [{ grade, family | null, form: base, kind? }] }, bonds { <seat>: { level, exp } },
  calling { pick: spellblade | mage | paladin | cleric | null, confirmed } }
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
