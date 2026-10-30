# Architecture and technical setup

How uma-rpg is built and run: engine v19, save v32. Values come from the code and `docs/technical/infrastructure.md`,
which holds every production value and is the place to change them.

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
| `@rpg/domain` | `packages/domain` | Save schema, parsers and migrations, battle engine, classes and skills, world and Rift generators, the Wilds' work rules, economy, items, place registry, master data adapter | `tsc` → `dist/cjs` (CommonJS for the API); Vite and Vitest read the TypeScript source |
| `@rpg/web` | `apps/web` | The game | `tsc --noEmit && vite build`, then `scripts/check-size.mjs` → `apps/web/dist` |
| `@rpg/api` | `apps/api` | Save, shared master-data and content routes, push | `nest build` → `dist/main.js`, shipped as a Docker image (`apps/api/Dockerfile`) |
| enemy scripts | `scripts/enemies/` | Build and publish the three locked franchise packs | `content/enemies-release/` (gitignored) |

pnpm workspace with Turbo. TypeScript is strict with `noUncheckedIndexedAccess`, and tests are Vitest. Commands are in
`AGENTS.md`.

The domain's package exports a root index and lazy subpaths. The store's commands import a subpath with `import()` and
lazy pages import it directly, so its rules load with the first command or page that needs them:

| Subpath | Module | What |
|---|---|---|
| `@rpg/domain` | `src/index.ts` | The save and its parser, the Hub's readers, ids, gates, caps and types |
| `/engine` | `rpg/battle/index.ts` | The fight engine, Limit Breaks and Auto (H62) |
| `/battle` | `save/battle.ts` | The world map's fights, classes, promotion and lines; save v32's trade step (`save/classes-v3.ts`) |
| `/rift` | `rift/index.ts` | The Rift's generator, run rules and Ascend |
| `/work`, `/forge`, `/exchange`, `/observatory`, `/targets`, `/heroes` | `save/<name>.ts` | Each place's rules |

## Domain map

| Folder | What |
|---|---|
| `save/` | The save: `version.ts` (`SAVE_SCHEMA_VERSION` 32, in a module with no imports), `save.ts` (the shape and its strict parse: `parseSave` for the API, `parseSaveAsync` for the device) and `migrations.ts` (every step to v32, `toV32` the last; loaded on demand: `parseSaveAsync` imports it only for an old save, and only the API's `parseSave` imports it statically, H136). Its rules, pure functions that return a new save or throw `SaveRuleError`: `class.ts` (an Uma's starting and active class, the classes she holds, her setup per class, one healer a party; main bundle), `class-tiles.ts` (the class tree's tiles; the Stable's chunk), `battle.ts` (switching class, promotion, weapons, lines, the world map's fights, rewards, Springs; through `@rpg/domain/battle`, H62), `classes-v3.ts` (save v32's trade step, `settleClassesV3Trades`; lazy), `sheet.ts` (her battle sheet; the Stable's chunk), `status.ts` (where an Uma is: in a fight or at work), `work.ts` (jobs on the shared engine, Finish all, the slot view the screens read), `forge.ts` (raising grades with made items, the accessory's family and kind), `observatory.ts` (setting jewels), `presets.ts` (each class's standard preset), `targets.ts` (targets), `upgrades.ts` ("Can upgrade"), `heroes.ts` (Halls of Heroes, Learners, Bonds), `exchange.ts` (raw items and tickets for Laurels, selling, Class Manuals), `rules.ts` (unlocks, parties, the grant and the classes' reset seen), `notify.ts` (push text), `rift.ts` (the Rift's run rules and Ascend: sign-up, fronts, the Convergence, Echoes and Sweeps, promotion; through `@rpg/domain/rift`) |
| `rpg/` | `kinds.ts` (the classes by generation, weapons, damage kinds, twins, statuses), `class-tree.ts` (Classes v3's tree: roots, parents and children, Tier 0's ladder and skill, the suggestion, names by generation, the gates), `rules.ts` (classes, stats, levels, hands, lines, Skill Ranks, the base MP regen, each by generation), `node-identity.ts` (node ids, lines and the skill depth tables, light enough for the parse), `catalog.ts` (every skill tree of every generation), `tree-view.ts` (the Skills tab's tree model), `heroes.ts` and `hero-id.ts` (the five halls' twenty Limit Breaks, and the six halls' 24 for older fights; Bonds) |
| `rpg/battle/` | The fight: `engine.ts` (the deterministic reducer, engine v19), `limit.ts` (Limit Breaks), `skills.ts`, `auto.ts` (Auto's policy), `types.ts`. `caps.ts` holds the switch: `BATTLE_ENGINE_VERSION` 19 and `rpgRework(stage, engine)` over `RPG_REWORK_ENGINE` (`fight` 16, `economy` 17, `weak` 18, `classes` 19: Classes v3 and Halls v2, live since H134; `t2Weapons` at no engine until the Tier 2 re-plan). A rule outside the engine takes `engine`, defaulting to the live one; the engine passes the fight's own version, so v6–v18 fights replay as they were, pinned by the frozen `v14`- to `v18-replays` fixtures. The engine's functions load through `@rpg/domain/engine`; the main index keeps its types, caps and skill numbers (H62) |
| `rpg/campaign/` | Foes and their scaling (`enemies.ts`), rewards, Finals and the chapter machinery regions reuse; `weaknesses.ts` deals each stage's foes their own Arms and element lists from v18 (D236) |
| `rift/` | `state.ts`: the Rift's save shape, constants, achievement ids and selectors (`riftOpen`, `riftLevel50s`, `openRiftRun`; main index); `achievements.ts`: the achievement hook; `fronts.ts`, `picker.ts`, `generate.ts`: the Rift's fronts, faces and fights (`@rpg/domain/rift`, a lazy subpath, through `index.ts`, which also exports `save/rift.ts`); `balance-sim.ts`: test support |
| `work/` | uma-rpg's side of `@luismlorenzana/uma-work` (SC3): `env-v4.ts` (the fifteen Wilds places as buildings, four slots at ×1.25), `kinds-v4/` (gather and process `material.ts`, make `make.ts`), `kinds-v3/trade.ts` (the trade gate and open shop), `env-v3.ts` (`liveWorkEnv`, the env every work rule builds), `env.ts` (Speed Tickets, Craft EXP, Laurels, who may work), `request.ts`. `kinds/` and `env.ts`' facilities are v1's, kept for old work rows and the v1 tests |
| `economy/` | `pacing.ts` (times, steps, job sizes, prices, Laurels), `professions.ts` (fifteen professions, five trades, one a Tier 0 calling), `places-v4.ts` (each place's line and its one kind of job: `PLACES_V4`, `workPlace`, `jobKindV4`), `grades.ts` (gear by grade: the gate, tier scaling, Might, armor), `accessories.ts` (the four families, the signature), `planet.ts` (the Planet, three moons and her moon), `ranks.ts` (Class Ranks and Marks), `bonus.ts` (points), `stock.ts` (Warehouse names: line and made items). v1's `jobs.ts`, `stars.ts`, `gems.ts`, `gear.ts` and `gear-id.ts` serve the migrations and old saves (ids and recipes; their names are `items/names-v1.ts`'); `*.sim.ts` are the pacing ledgers (test support) |
| `items/` | `lines.ts` (five lines of ten grades: the hundred line items), `made-id.ts` (the made items' ids), `made.ts` (their names and places), `made-v4.ts` (one-line recipes), `stock-id.ts` (what a Warehouse may hold). v1's 160 items serve the migrations: `catalog.ts` (ids, families, grades and pairs, built from `identity.ts`) and `kinds.ts`; `names-v1.ts` holds the v1 names (items, families, gear and Star Gems: `itemNameV1` … `stockNameV1`) and is the only reader of `families.ts`; both load on demand (H136) |
| `world/` | `world.ts` (continents, regions, the stage generator), `biomes.ts`, `capital.ts` (each continent's Finals routes), `roster.ts` (enemy faces by franchise and tier); balance support (`balance-party.ts`, `balance-play.ts`, `balance-measure.ts`) and the `SIM=1` simulations (`balance*.test.ts`) |
| `hub/places.ts` | Every place on the four Hub pages (Town Hall 5, Learning 7, Battle 2, the Wilds 15), and Town Hall's plaza |
| `master/`, `roster/` | `master/roster.ts`: master data to the game's roster, by stable id; `roster/template.ts`: the Uma Template and the calling (D203; by running style from v19, D240); `aptitudes.ts` and `stats.ts`. Album queries and order live in uma-kit |
| `docs/` | The renderer for these docs' live blocks (test-only, not built) |

## Web app

| Folder | What |
|---|---|
| `app/` | `Root.tsx` (the kit's boot gates), `router.tsx`, the Firebase config, the build id |
| `hub/` | The shell (`Shell.tsx`, `TierShell.tsx`), the bars, the menu, the Tier sheet and veil, the featured Uma, the Hub screen |
| `places/` | Every place's page and quick look (`work/` for the fifteen Wilds places, `halls/` for the five halls); `registry.tsx` maps them |
| `battle/` | The fight's stage (`scene/`, Phaser), the fight source, labels and icons, the prefetch |
| `save/` | The store (`game.ts`), the device copy (`db.ts`), sync (`reconcile.ts`), the active tier (`tier.ts`), her trade (`trade.ts`) |
| `master/`, `content/` | Master data and the private enemy pack through uma-kit's content client |
| `album/` | The Stable's rows, facets, picker steps and device preferences |
| `grant/` | "The Wilds are rebuilt", the Tier rework's grant sheet (lazy) |
| `items/`, `ui/`, `achievements/`, `push/`, `api/` | Item icons and words, small shared UI, achievement cut-ins, Web Push, the API client |

- **Routing** (`app/router.tsx`):
  - `/` goes to the last page.
  - `/:page` is the Hub. `?peek=:id` adds a quick look; `?sheet=menu` opens the menu, `?sheet=featured` the featured
    Uma's sheet, `?sheet=tier` the Tier sheet and `?sheet=grant` the grant sheet.
  - `/:page/:placeId/*` is a place's full page.
  - Every route renders inside `hub/TierShell.tsx`, which keys the shell by the active tier (H35).
  - `?tier=n` on any route (a push notification's link) opens that tier when the save has its world, then the shell
    drops the param with a replace, keeping the entry's state. An invalid tier or one without a world is ignored. Routes
    are the same in every tier.
- **Loading:**
  - The place screens are lazy chunks (`places/registry.tsx`). Phaser, Firebase Auth and Dexie are chunks of their own,
    loaded when needed (Dexie at boot, for the device copy). The save's migration chain is a chunk too, fetched only
    when the device copy is older than the current version (H136).
  - The store's commands import the domain's subpaths on first use. Once the Hub has painted, `battle/prefetch.ts`
    loads `@rpg/domain/battle` and the fight screen while the browser is idle (500 ms on Safari).
  - The web build fails when the initial JS passes 230 KB gzip or renders a module that must load on demand: the
    fight engine and its tables (H62), the save's migrations and the v1 economy's names (H136) (`scripts/check-size.mjs`,
    D56). Main JS is 214.42 KB gzip (2026-10-29).
- **Store** (`save/game.ts`):
  - One Zustand store holds the save.
  - Each action runs a pure domain function, writes the device copy to IndexedDB (Dexie `uma-rpg`, row `main`) and
    schedules a sync 1.5 s later.
  - A sync also runs when the app becomes visible or comes back online.
  - **Sync:** GET the server's save, then reconcile: adopt it, push ours, or neither. A stale push gets a 409 and
    retries up to 3 times. When both sides changed, the save with the newer `account.updatedAt` wins whole.
  - **Boot:** use the device copy at once and sync behind it; with no device copy, fetch the server's or start first
    launch. The device copy is read with `parseSaveAsync`.
  - **The classes' trade step** (save v32, CV28): once the save and master data have both loaded,
    `settleClassResetTrades` runs `settleClassesV3Trades` for a world whose reset record hasn't traded yet (its module
    loads only then): an Uma whose calling's trade moved has her work settled. A second boot changes nothing. (D220's
    calling repair retired with the calling pick at save v32.)
  - **Her trade** (`save/trade.ts`): built from the master roster once per world and passed to every work action.
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
- **Original art:** `@luismlorenzana/uma-art` atlases (items, gear, gems, buildings, tiles, world, battle effects, UI)
  are bundled by Vite. Private outfit art from uma-data and the enemy pack's faces, verticals and splashes load through
  that same authenticated content client, with blob URLs in memory and hash-checked Cache Storage copies where
  applicable.
- **The work engine** (`@luismlorenzana/uma-work`, uma-platform P53, SC3) runs every job: slots, reserving, the clock,
  queues, collect, recall and Speed Tickets. It's pure TypeScript in ESM and CommonJS, so the API runs the same rules
  when it accepts a save.
- **The shared app** (`@luismlorenzana/uma-kit`, uma-platform P48, D147) is the same package as uma-racer's:
  - the theme, light and dark under one set of names;
  - the primitives (icons, marks, sheets, tabs, buttons);
  - the shell (frame, top and bottom bars, menu, side panel, place header), with the crest's tier shifter and the tier
    tints (H36);
  - the Hub map (terrain, scene, place buttons, pips, swipe); the Wilds draw each building's Umas as faces in an arch
    over it (`pipsAt: 'arch'`, D233);
  - getting in (`/auth`), the content client (`/content`) and the frames of the Account, the Warehouse, the Exchange
    and the profile (`/places`), each filled with this game's content and words;
  - the album engine and device preferences (`/roster`), plus art tiles, album chrome, virtual grid and Uma picker
    (`/album`), and the shared Wilds work screens (`/work`). The Stable, the picker contexts, plaza chooser and work
    screens use these components, not local copies.

  uma-rpg gives it its places, currencies, words and art. `main.tsx` wires the uma-art atlases (`KitArtProvider`),
  the appearance and Motion, the shared `ContentProvider`, `AlbumArtProvider` and `WorkArtProvider` (item icons for the
  work screens). Faces use uma-data's `outfit-faces`, with the icon atlas as fallback; busts and plaza chibis use their
  own families. Rules, vocabulary, routes and save v32 stay game-owned.
- **The battle stage** is Phaser (`battle/scene/`). Every number and control is a DOM element laid over the canvas (D33).
  Each damage kind has one color (`KIND_COLOR` in `battle/labels.tsx`, over `index.css`'s `--kind-*` tokens, D234).

## API

`apps/api/src/main.ts`: prefix `/api`, CORS for the site, 1 MB JSON limit.

| Endpoint | Guard | What |
|---|---|---|
| `GET /api/health` | none (`@Public()`) | `{ ok, build, uptime }` |
| `GET /api/save` · `PUT /api/save` | auth | The save envelope `{ revision, save }`. A GET parses the stored save, migrating an older one without writing it. A PUT carries `baseRevision`: 400 on a parse error, 409 with the current save when stale or older than the stored schema |
| `GET /api/master/*` | auth | Master data release files, manifests and channels, from the bucket |
| `GET /api/content/*` | auth | `enemies.json` and its allowlisted, hash-named `enemies/*.webp` images |
| `GET /api/push/key` · `PUT`/`DELETE /api/push/subscription` · `POST /api/push/test` | auth | Web Push |
| `POST /api/push/tick` | Cloud Scheduler OIDC (`@Public()` to the shared guard) | Sends "work done" pushes since the last tick, one per tier world with news (H35) |

- **Push tick** (`push/push.service.ts`): it reads every tier world of each save (`tierNotices`). Each world with news
  sends one notification, linking with `?tier=n` and titled with its tier when the save has several worlds. Each carries
  the badge of every world's ready slots (`readyEverywhere`), and `sent` counts notifications.
- **Auth** (SD3): the shared guard from `@luismlorenzana/uma-server/auth` (uma-platform P54) guards every route
  (`app.module.ts`). Firebase Admin verifies the token (401 without one or with a bad one), and the email must equal
  `ALLOWED_EMAIL`, a one-player allowlist (403 for anyone else). `AUTH_MODE=disabled` (local) acts as `local-dev`.
- **Content routes** (SE3): `ReleaseProxyModule` and `PrivatePackModule` from
  `@luismlorenzana/uma-server/content` serve the same `/api/master/*` and `/api/content/*` routes from the same env
  vars. The game's private allowlist remains `enemies.json` plus hash-named WebP face, art and splash files; the shared
  modules own traversal checks, content types, cache headers, local-folder sources and bucket reads.
- **Storage:**
  - Production uses Firestore: `saves/{uid}` is written in a transaction, with the save as JSON text (D260: Firestore
    refuses a list inside a list), and a schema bump first backs the old save up to `saveBackups/{uid}-v{n}` (D69). An
    upload the server refuses is kept in `saveRescues/{uid}`, newest only. `push/{uid}` holds push subscriptions.
  - The device keeps a **safety copy** (`SAFETY_COPIES`, five an account) before anything replaces changes the server never
    got, before a restore, and of a save it can't read. If it can't keep the copy it doesn't replace the save.
  - Local uses a JSON file (`LOCAL_SAVE_FILE`, default `apps/api/.data/save.json`) and in-memory push.
- **Env vars:** `PORT`, `AUTH_MODE`, `ALLOWED_ORIGIN`, `ALLOWED_EMAIL`, `PERSISTENCE`, `LOCAL_SAVE_FILE`, `MASTER_BUCKET`,
  `MASTER_DIR`, `CONTENT_BUCKET`, `CONTENT_DIR`, `BUILD_ID`, `VAPID_KEYS`, `PUSH_SCHEDULER_EMAIL`, `PUSH_AUDIENCE`.

## The save

- **Schema v32** (`save/version.ts`, re-exported by `save/save.ts`).
- One save per player; worlds are kept per tier (`tierWorlds["1"]`).
- Older saves migrate on parse: `migrations.ts`' `migrateWorld` runs each world's steps in order, and `save.ts` adds the
  account's own. A world older than v10 is reset, keeping its Umas and parties (D69).
- New fights start on engine v19. An open fight of an older engine replays and settles on its own engine.

### Save history

Recent steps:
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
  still had, each facility with its level's new slots; opened nodes kept (D144).
- **v22:** work moves to per-Uma rows on `@luismlorenzana/uma-work`; each facility keeps its level; every running job
  finishes into its shelf with its Craft EXP, queued jobs drop, and every Uma starts free (SC3).
- **v23:** account achievements and each Uma's tier history, and each world's Rift state, all empty (D163).
- **v24:** the account's defeated Rift faces, each world's open Rift fight and fight count, and each run's traces and
  open Convergence attempt, all empty (D171).
- **v25:** classes v2's Paladin (D180, D188). Every Uma with Cleric progress gets the same Class Rank, tree (renamed
  `cleric-` → `paladin-`) and loadout as a Paladin; the Cleric's "any five" weapons become 3 Tomes + 2 Arms and the
  Paladin's 3 Arms + 2 Tomes, keeping hers where they fit; the Chapel's seats 3–4 move to the Bastion's 1–2 with their
  Heroes, Learners and Bonds; accessory 1 holds an Orb and accessory 2 a Talisman or an Amulet, a second piece of one
  group staying in her locker. Classes, parties, open fights (their v14 inputs replay on v14) and runs don't move.
- **v26:** each party gains `lead`. The migration names its first occupied slot, preserving the face used by v25,
  while later lead changes leave all five slots in place (D190).
- **v27:** the Tier rework's fight (D205, D210). Every class an Uma has set up gets its three default weapons (her
  crafted pieces stay equipped on their kinds), her side skills become **lines** (B on a tree where she learned any
  node of its B line, at any depth; `tree` goes), and her loadout keeps, in her order, what she still holds within
  v16's slots at her level (none left: back to auto). Every Uma gains `calling: { pick: null, confirmed: false }`: her
  pre-selection, unconfirmed. Class Ranks, seats, Bonds, Marks, gear, parties and the open fights don't move (their
  v15 inputs replay and settle on v15).
- **v28:** the Tier rework's economy and the Speed Ticket grant (D214, D218), per world: every started job is settled
  (its items made, its Craft EXP paid), queues drop and `work` empties; each Uma's tickets are ⌈(EXP her Craft Level
  took + her bank) ÷ 60⌉, and the world is paid their sum, or the floor (the deleted pieces' and Star Gems' own making
  time at Craft Lv 25) when higher; facility upgrades give their Laurels and refined items back; the Warehouse converts
  one for one by family and band into R2's sixty types; every Uma goes to Craft Lv 1, every grade G0 with one accessory
  slot and no family, an empty map and Class Ranks only; Gear Marks join Class Marks; the gear and gem shelves and
  `buildings` go; `grant` records it all (null when there was nothing to pay). Levels, classes, calling, Bonds,
  parties, targets, seats, the Rift and the open fights don't move (their v15 or v16 inputs replay and settle on their
  engine).
- **v29:** the grant is tickets only (D221, the owner's review): in a world that took the grant every material leaves
  the Warehouse (its gathering was already in the tickets), and the grant's sheet stops listing the stock and the
  upgrades' refined items; made items, Laurels, tickets and Craft Levels stay, and a world without a grant keeps its
  materials.
- **v30:** the farm by line (D224, D228): every started job settles into the Warehouse with its Craft EXP and queued
  requests drop; R2's sixty types move to the line's grade that opens at the same Craft Level, a low type of any tier to
  its G1 and a high type to its G6, summed in one pass (`toV30`, `V30_TYPES`); made items (a Weapon Gem reads Arms Gem),
  grades, jewels, Craft Levels, Laurels and tickets stay.
- **v31:** the Wilds' trios (D230, D232): every v30 started job settles into the Warehouse with its Craft EXP and
  queues drop, then `work` is empty (`toV31`). Each line now has one gathering place, one workbench and one making
  place, and the parse accepts only each place's one kind of job among the fifteen place ids. Stock, gear, maps,
  levels, parties, targets, battles, Laurels and tickets stay.
- **v32:** Classes v3's reset and Halls v2's merge (D247; live from H134), once per world (`toV32(world, tier)`; a world
  with `classesV3` is left as it is). Each Uma's class goes to null in Tier 1's world (she fights as her calling's Tier
  0) or to her class's Tier 1 class in a later one; every class's Class Rank, weapons, lines and loadout are emptied and
  `calling` drops. Each class's EXP E on v31's curve comes back as Class Manuals, ⌈(E + min(E, 1,800)) ÷ 1,000⌉ in Tier
  1's world and ⌈E ÷ 1,000⌉ later, paid as 1,000 Class Marks each into `wallet.classMarks`. The Paladin Bastion's and the
  Cleric Chapel's seats merge into `healer-1` … `healer-4` (each Uma's higher Bond; the less-bonded of two Heroes keeps
  the seat, the other its first Learner; ten Learners by Bond, the rest unseated with their Bond). The record
  `classesV3` (the grant, each Uma's old classes, share and moved trade, the merge's lines, `traded`, `seen`) feeds "The
  classes are rebuilt". The moved trades settle after the parse, on the first boot with the roster
  (`settleClassesV3Trades`: her running job into the Warehouse with its Craft EXP, her queue dropped). Grades, maps,
  levels, Craft Levels, parties, targets, the other seats, the Rift and the open fights stay (their v18 inputs replay and
  settle on v18, a class she no longer holds paying its family's Tier 0).

At every schema bump the API's GET migrates the stored save without writing it; in Firestore the first write of the
new version copies the stored document to `saveBackups/{uid}-v{n}` (D69), and an older app's write is refused once
the newer version is stored (D45).

### The shape

```
Save { schemaVersion: 32, account, tierWorlds: { "1": TierWorld, … } }
account { trainerName, createdAt, updatedAt, achievements { <id>: { at, run | null } },
  history { <outfitId>: [{ tier, at, run }] }, defeated { <castId>: at } }
TierWorld { createdAt, wallet { unlockTickets, shards, laurels, timeTickets, sweepTickets, classMarks },
  umas: { <outfitId>: OwnedUma }, parties: [20 × { name, slots[5], lead | null }],
  world { activeParty, run { wins, mp, battle | null, battles, … }, springs },
  items { <line item or made item id>: count }, buildings: {}, work: { <outfitId>: WorkRow }, targets [≤10],
  heroes: { <seat>: { hero, learners[≤10] } },
  rift { runs [RiftRun], echoes { <front>: { <level>: at } }, battle: RiftBattle | null, battles },
  grant: TierGrant | null, classesV3?: ClassesV3Record }
TierGrant { tickets, floor, umas { <outfitId>: { level, exp, tickets } }, deleted { gear, gems, upgrades },
  back { laurels, items, stock }, seen }
ClassesV3Record { manuals, marks, umas { <outfitId>: { classId, ranks, pick, manuals, left, trade? { from, to } } },
  halls [{ outfitId, from, to, was: hero | learner, now: learner | unseated, bond }], traded, seen }
  (save v32's reset, once; absent in a world made after it)
RiftRun { id, roster[20], startedAt, fronts { iron, arcane, duel, horde },
  convergence { attempts, open: { parties[4][5], rounds[] } | null }, traces { <front>: [trace] }, wonAt | null,
  ascendedAt | null }
RiftBattle { battleId, ref, startedAt, input, actions }
  (battleId rift:t<tier>:<n>; ref { kind: front, front, stage } | { kind: convergence, fight } | { kind: echo, front, level };
   trace physical | magical | ko)
WorkRow { outfitId, slot { building, slot } | null, entries [Entry], queue [≤3 requests], last { slot, request } | null,
  dropped { at, slot, requests, short, refused } | null }
Entry { request { kind: gather | refine | craft | cut, item, count }, seconds[], inputs[], outputs[], exp[], startedAt,
  acceleratedMs, collected, speed, fromQueue }   (times in milliseconds)
OwnedUma { unlockedAt, level, exp, classId | null, classes { <class>: { weapons[3], lines { <weapon>: B }, loadout } },
  (thirteen classes: a Tier 0 only in Tier 1's world, with any three weapons, no lines and its one-node skills)
  craft { level, exp }, ranks { classes: { <class>: { rank, exp } } },
  (a Tier 0's track 1–10, up to 23,680 waiting at 10; a Tier 1 class held in Tier 1's world from rank 10)
  stars { open [node ids], moons [] }, gear { weapons { <weapon>: { grade } }, armor { <slot>: { grade } },
  accessories [{ grade, family | null, form: base, kind? }] }, bonds { <seat>: { level, exp } } }
  (seats `${hall}-${1..4}`: brawler, mage, spellblade, summoner, healer; no `calling` since v32)
```

An open fight is stored as `{ input, actions }`: the frozen fight and every action, replayed on load (D52).

## Private content

Franchise art isn't original content, so it never goes in git (CLAUDE.md, AGENTS.md); the private-content guard
(`scripts/check-private-content.test.mjs`, run by `pnpm test`) fails when anything under `content/` is tracked. The
enemy release (D135) is built from locked franchise packs in `content/authoring/exports/`: PriConne and Azur Lane
(D133) and NIKKE (D134).
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
- Runs on every push to `main` (changes only under `docs/` or to Markdown files skip it), on pull requests and by hand.
- **verify:** `pnpm install --frozen-lockfile`, `pnpm lint`, `pnpm test` (the size check's, the private-content guard's
  and the enemy scripts' Node tests, then every package's Vitest, the docs' live blocks included), `pnpm build` (the
  web build runs the size check).
- **deploy** (`main` only, with the repository variable `DEPLOY_ENABLED` true):
  1. Build the API image (the package token passes as a BuildKit secret) and push it to Artifact Registry.
  2. Deploy Cloud Run `rpg-api` (us-central1, scales 0–1, 512 MiB, 1 CPU; `VAPID_KEYS` from Secret Manager).
  3. Smoke-test it: `/api/health` answers; `/api/save`, `/api/content/enemies.json` and the push tick answer 401.
  4. Build the web app and deploy Firebase Hosting `uma-rpg`.
  5. Check the hosted site: the shell served `no-cache`, `/api/health` through Hosting, `/api/save` 401.

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
- Balance: `SIM=1 npx vitest run src/world/balance.test.ts` in `packages/domain` (`SIM_ENGINE` picks the engine);
  each release's tables are `world/balance-v16.test.ts` to `balance-v19.test.ts` and `rift/balance-v15.test.ts` to
  `balance-v19.test.ts`, with `SIM_SEEDS`, `SIM_LEVELS` and `SIM_TARGETS`.

## uma-platform

The shared foundation, in the sibling repo (`../uma-platform`, `luismlorenzana/uma-platform`). Exact versions are in
[dependencies](dependencies.md).

| Package | What |
|---|---|
| `@luismlorenzana/uma-data` | Master data types and constants; `/testing` fixtures |
| `@luismlorenzana/uma-art` | Original pixel-art atlases, drawn from code by `scripts/pixel-art` (`pnpm art:draw`) |
| `@luismlorenzana/uma-kit` | The shared app: theme, primitives, shell, Hub map, sign-in, content client, place frames, album, work screens |
| `@luismlorenzana/uma-work` | The work engine: timed jobs per Uma, queues, collect, recall, Speed Tickets |
| `@luismlorenzana/uma-server` | The API's shared NestJS pieces: the auth guard and allowlist, the release proxy and private packs |

Master data releases are content-addressed (`files/`, `manifests/v1/`, `channels/v1/latest.json`) and published by
the owner's pipeline. Shared changes (schema, art, kit) happen in a uma-platform session.
