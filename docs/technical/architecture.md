# Architecture

How uma-rpg is built. Cross-game rules are in uma-platform `docs/architecture.md`; production is in
[infrastructure.md](infrastructure.md).

## Layout

| Path | What |
|---|---|
| `packages/domain` (`@rpg/domain`) | Pure rules and contracts: the save and its rules (`save/`, including `save/battle.ts`), the battle engine, class catalog and campaign ported from uma-racer (`rpg/`), the place registry (`hub/`), the master data adapter (`master/`). Builds CommonJS + declarations for the API; Vite and Vitest read its TypeScript source |
| `apps/api` (`@rpg/api`) | NestJS on Cloud Run: auth guard, `/api/save`, `/api/master/*`, `/api/content/*`, `/api/health` |
| `apps/web` (`@rpg/web`) | React 19 + Vite 7 + Tailwind 4 + Zustand + Dexie + React Router 7 + Phaser 4 (lazy) + PWA |
| `infra/github-actions/bootstrap.sh` | One-time GCP setup |
| `scripts/cast/` | The private face packs: `import.mjs` (PriConne, D50) and `import-<pack>.mjs` (Azur Lane, NIKKE, Destiny Child, Last Origin, Girls' Frontline; D76, D81, D85) build `content/release/`, `pack.mjs` holds their shared fetch, trim and write steps, `publish.sh [pack]` uploads one |

## Save and sync (D32, D45, D52)

- One snapshot per account: `{ schemaVersion: 7, account, tierWorlds }`. Each tier world holds `wallet`, `umas` (owned
  outfits by id: unlock time, level, EXP, the class `build` she fights as and her `builds`: tree, equipped skills,
  Familiar, her two `professions`, her class and mastery `ranks`, her `stars` map and her `gear` locker), exactly 20 `parties` of five slots (an Uma in at most one slot, D46), `runs`
  (one per party per chapter: wins, carried MP, and the open fight as its frozen input plus every action), `items`
  (the Warehouse), `dishes`, `gear` (unbound pieces) and `facilities` (level and job slots). The wallet holds Rush and Sweep Tickets too.
  Strict parsers in `@rpg/domain` validate on both sides, replaying any open fight; older saves parse into v8
  (device rows on boot, server rows on read). Rules (`save/rules.ts`: unlock, party slots, renames, Shards → Tickets;
  `save/battle.ts`: builds, skills, fights and their rewards) are pure and return a new save.
- The API refuses (409, with the stored envelope) a `PUT` whose save version is older than the stored one, so an old
  installed app can't overwrite newer data.
- The device holds one Dexie row `{ uid, revision, save, dirty }` and a Zustand store. Every change writes both and
  schedules a sync (1.5 s debounce, plus app foreground and coming online).
- A sync pass reads `GET /api/save`, then `reconcile` decides: **adopt** the server's save, **push** ours on top of the
  revision it was based on, or do nothing. `PUT` with a stale `baseRevision` gets **409** carrying the stored
  envelope; when both sides changed, the save with the newer `account.updatedAt` wins whole.
- Boot never waits on the network once a device save exists. A fresh device adopts the server's save, or shows first
  launch (trainer name; Tier 1 with 20 Unlock Tickets).

## Master data

- The API proxies uma-platform releases at `/api/master/{channels,manifests,files}/…`: the platform bucket in
  production, uma-platform's local `content/release` in dev. Hash-named files are `private, immutable`; pointers are
  `no-cache`.
- The web app uses `@luismlorenzana/uma-data`'s release client (hash-verified) for characters, outfits and scenarios at
  start, and the 2.5 MB skill set only when a profile needs it. `@rpg/domain`'s adapter makes `RosterOutfit` and
  `ChapterInfo` (five chapters per tier, ten levels each).
- Art needs the owner's token, so images are fetched with it and shown from session blob URLs; the service worker caches
  the bytes.

## Work, items and the Exchange (D54–D56)

- `@rpg/domain` holds the item catalog (`items/`, generated from the art index and checked against it by a web
  test), the pacing numbers and the job model (`economy/`), and the rules over the save (`save/work.ts`: start,
  collect, recall, rush, upgrade; `save/exchange.ts`: buy, sweep). Jobs are computed from their start time.
- Item icons come from `@luismlorenzana/uma-art` (uma-platform's P37): one atlas PNG that Vite hashes into the build
  (precached by the service worker), drawn by CSS position (`items/ItemIcon.tsx`). The item's frame is computed from
  the catalog order, so the 57 KB index never ships.
- One page serves all 16 sites and both refining stations (`places/work/FacilityPage.tsx`), and one serves the five
  class halls and four armories (`places/learning/TrainingPage.tsx`, D57: a training job is one rank). The Kitchen
  uses the facility page too; the Observatory draws each Uma's star map as SVG (D58).
- The Forge uses the facility page with a type/grade/accent picker; gear pieces are generated from their id
  (`economy/gear.ts`), never listed. Profiles carry a Gear card (`places/stable/GearCard.tsx`, D59).
- Stat points (Extra Stats and gear) enter a fight through `economy/bonus.ts`: stats scaled per point, plus
  optional `evasion` and `limitStart` on each ally, which the engine reads. The Hub's place buttons
  read the world to draw working Umas' faces, progress rings and Ready tags (`hub/PlaceTargets.tsx`).

## Private content (D50)

- uma-rpg's own private content, the PriConne cast, lives in the gitignored `content/` (sources, a fetch cache and
  `release/`). `scripts/cast/import.mjs` turns the captured official list into `release/cast.json` plus hash-named
  WebP portraits; `scripts/cast/publish.sh` uploads them to `gs://uma-rpg-content` (portraits first, the list last).
- The API serves only `cast.json` (`no-cache`) and `cast/<slug>.<hash8>.webp` (`immutable`) at `/api/content/`, from
  the bucket in production (`CONTENT_BUCKET`) and from `content/release` in dev. The web app loads the list once a
  session and portraits as blob URLs; the service worker caches them.

## Battles (D48–D53)

- `@rpg/domain/rpg` is the battle engine, v7 since W3 (D91: up to eight foes a wave, dual-element foes, foes that act
  twice, waves; v6 fights still replay), a deterministic reducer first ported from uma-racer (`createBattle`,
  `applyBattleAction`, `replayBattle`, `battleFoe` across waves), the class catalog (D86) and the campaign machinery the
  world map reuses (`world/world.ts` builds each region as a small chapter). The web app builds Tier 1's chapters once per master release and cast (`battle/campaign.tsx`).
- Every fight action goes through the store (`fightAction`): the domain applies it to the save, and when it ends the
  fight the rewards land in the same save. The screen then plays the engine's cues.
- The fight screen (`places/scenario-gate/FightScreen.tsx`) is a lazy Phaser stage (`battle/scene/`, DPR-aware like
  the Hub, `window.__battle` in dev) under a DOM layer. Both place things with one function, `battle/stage-layout.ts`.
  The canvas draws art and effects, including effect text; the DOM has every control and lasting number.
  `battle/battle-view.ts` (ported) projects the engine for the UI: legal skills, damage previews, Limit Break options,
  and `followCue`, which moves the DOM bars in step with the effects.

## The Hub (D30, D31, D33)

- Routes (D43): `/:page` is the Hub, `/:page?peek=:placeId` a place's quick look (the side panel), `/:page/:placeId/*` its
  full page. Nothing else is a route. Opening from the Hub pushes history; **Enter** replaces the quick look with the
  page, so back returns to the Hub. Signed-out and first-launch screens render at any URL, so a deep link survives
  sign-in.
- `apps/web/src/places/registry.tsx` maps each place to its lazy `Peek`, `Page` and header `Counter`; places without a
  page show the honest preview and no Enter.
- One place registry drives the map, the DOM place buttons, the menu and the routes.
- The map is a lazy Phaser 4 game (`hub/scene/`): world units are CSS px with the camera zoomed by the device pixel ratio
  (≤ 2). It draws ground, code-drawn markers and ambient motion; it has **no text and no input**. Names, slot pips and
  slice badges are DOM buttons over it. Opening an overlay pauses the scene (the last frame stays); a hidden page gets
  no animation frames.
- Dev only: `?canvas` forces Phaser's Canvas renderer, because the preview pane's screenshots can't capture WebGL, and
  `window.__hub` exposes the scene.

## Budgets

Main JS ≤ 230 KB gzip (D56). H16 reduced the production entry from 195.96 to 133.15 KB gzip (measured when it merged onto main `888aeb2`).
`scripts/check-size.mjs`, run by the web build, measures the HTML entry and all its static JS dependencies from
Vite's manifest. Both must fit the budget; putting code in an eagerly imported vendor chunk cannot hide it.
Phaser (Hub and battle stage), Firebase, master data parsing and each place page remain lazy chunks.

### Boot and lazy domain boundaries (H16)

- The save parser, Hub state readers and small id/gate validators stay in the entry. Item identities are an id-only
  snapshot; `items/identity.test.ts` compares every field to the authored catalog. Update that snapshot when changing
  item ids, families or sites. Skill, dish and gear identities share exact grammar and constants with their catalogs,
  with exhaustive parity tests.
- Device reads use `parseSaveAsync`: migrations load only for old versions, and the battle engine loads only when a
  save contains a frozen fight. Every pending fight is replayed before the promise returns. There is no unchecked
  intermediate save. The API keeps the synchronous, equally strict `parseSave` contract.
- Gameplay commands dynamically import the domain's `battle`, `work`, `exchange`, `kitchen` and `forge` entry points.
  They read the latest save after loading, so overlapping cold commands cannot overwrite one another's changes.
  Skill definitions, the world generator and full recipes load with their screens, not with an idle Hub.
- Dexie initializes on the existing asynchronous device-I/O path. Its separate 32.49 KB gzip chunk is still required
  at boot: entry plus device storage is about 165.6 KB, not 133.15 KB. The database, row format and fallback behavior are
  unchanged. No manual vendor-chunk partition hides startup work.
- The service worker precaches every built JS chunk; a cold, uncached network pass is also required when changing
  these boundaries. The H16 pass used 375×667, synthetic master data and rivals, all 34 open places, four Hub pages,
  five continents, a region, profile tabs and a saved-fight reload under Fast 4G proxy shaping.
