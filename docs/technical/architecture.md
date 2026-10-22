# Architecture

> **Status: current, 2026-10-21; save v24, engine v14.** The full running-system reference is
> [the architecture manual](../game/architecture.md) (D92). This page records the boundaries and decisions;
> production values stay in [infrastructure.md](infrastructure.md).
> Cross-game rules live in uma-platform `docs/architecture.md`.

## Layout

| Path | Boundary |
|---|---|
| `packages/domain` | Pure rules: save/parsers/migrations, combat, world generation, economy, catalogs, places and master-data adapters |
| `apps/web` | React UI and Zustand state; Vite consumes domain source. Phaser draws Hub/battles; DOM owns lasting labels and controls |
| `apps/api` | NestJS auth, revisioned saves, master/private content proxies and Web Push. Consumes the domain's CommonJS build |
| `scripts/enemies/` | Locked franchise packs to the private phone-sized enemy release; output stays gitignored |

Tooling and exact dependency versions are generated in [dependencies](../game/dependencies.md), not copied here.

## Save and sync

One account has one revisioned snapshot and one local Dexie row (D32). Strict domain parsers validate both device
and API input. An open fight is frozen input plus actions; replay proves its state (D52).

**Schema v24** (`save/save.ts`), not the old v7/v8 snapshot:
- `account`: trainer name, timestamps, achievements, each Uma's tier history and the boss and sub-boss faces defeated
  in Rift fights, shared by every tier (D159, D171).
- `tierWorlds`: each world's wallet, Umas, twenty parties, world progress, items, Star Gems, unbound gear, building
  levels, per-Uma work rows (SC3), targets, Hall of Heroes seats and its Rift: runs (with each front's traces and the
  open Convergence attempt), Echo wins, the open Rift fight (replayed like the world map's) and its fight count (D161,
  D171).
- An Uma keeps `classId` and per-class `classes` (five weapons, learned sides, loadout), her Craft Level, ranks,
  Extra Stats, bound gear and Bonds. There are no active `build`/`builds` keys (D86).
- `world` holds the active party, one run (stage wins, MP per Uma, an open battle) and Spring uses. Per-party chapter
  runs retired in v11 (D72).
- Wallet shortcuts are `timeTickets` and `sweepTickets` (D74); tokens live in item stock.
- `targets`: up to five owned Umas the facilities plan for (D100, `save/targets.ts`).

| Migration | Decision |
|---|---|
| v10 progress reset, keeping unlocks and parties | D69 |
| v11 world progress replaces chapter runs | D72 |
| v12 Rush converts to Speed Tickets | D74 |
| v13 ranks cap at 5 | D77 |
| v14 per-class loadouts, renamed/refunded gear | D86 |
| v15 Crafting converts to Mastery Tokens; Forge inputs release reserved tokens | D94 |
| v16 profession EXP moves to the longer curve without losing earned work | D96 |
| v17 targets, none to start | D100 |
| v18 ranks earned by fighting, five armor slots, Marks, no tokens, a progress reset | D102–D105 |
| v19 the Halls of Heroes and Bonds | D106 |
| v20 armor without accents, a feet slot, two accessory slots | D124 |
| v21 one profession (the higher level), Star Gems, only known items and facilities, more slots | D144 |
| v22 work on `@luismlorenzana/uma-work` per-Uma rows; running jobs finish into stock, queues drop | SC3, D152 |
| v23 empty account achievements and tier history, and an empty Rift in each world | D163 |
| v24 no defeated faces, no open Rift fight (count 0), and each run without traces or an open Convergence attempt | D171 |

`parseSave` accepts v1–v24 and returns v24; the earlier reset remains part of the migration chain.
The API rejects an older-schema overwrite and backs up a stored save before a schema upgrade (D45, D69).
The device writes locally first, syncs after 1.5 seconds and when foreground/online, and resolves concurrent snapshots
by newer `account.updatedAt` (D32). Exact save shapes, endpoints and local setup are in
[the manual](../game/architecture.md#the-save).

## Domain boundaries

| Module | Owns |
|---|---|
| `save/` | Pure actions over saves, refusals, inputs and reward settlement |
| `rpg/battle/` | Deterministic combat reducer and cues; engine v14 (D141, D142, D169), every older version replaying as it was |
| `rpg/catalog.ts`, `rpg/rules.ts` | D86 classes, forty trees and learning rules |
| `world/` | Seeded continents, five-level region climbs, formations and waves (D72, D91, D97) |
| `economy/`, `items/` | Jobs, ranks, tokens, recipes, points, timers, prices and the item catalog |
| `hub/places.ts` | One place registry shared by routes, map targets and menus (D33) |

Regions reuse campaign battle-building helpers internally; this is not a second player-facing chapter system.
Fight settlement saves the final action and rewards together (D52).
A foe lookup uses `battleFoe(state, id)`; `state.input.enemies` contains only the first wave (D91).

## Web boundaries and routes

Routes are exactly `/`, `/:page` and `/:page/:placeId/*`; `?peek=:placeId` opens a quick look (D31, D43).
Sign-in and first launch render at the requested URL; there is no separate sign-in route (D38).
Every place page is lazy. The generated [section map](../game/sections.md) lists the current screens.

Phaser is presentation only. Canvas effects may draw transient damage/WEAK/BREAK text; DOM carries lasting numbers,
controls and accessible names (D33, D53). Six to eight foes use two rows and new-wave actors are keyed by foe id
(D91). Auto shares its policy with the battle simulator; speed uses playback clocks (D89).
The shell and the Hub map come from `@luismlorenzana/uma-kit`, shared with uma-racer (D147): the Hub stamps
code-drawn art from uma-art, and DOM anchors share its grid (D64). Opening an overlay pauses its scene,
not the game loop (D39). Screen labels stay short, with explanations behind `HelpButton` (D95).

Jobs derive progress from timestamps, not interval counters. Queues start at the previous job's finish and pay only
through domain collect rules (D55, D62). Seven Learning halls replace the four distance armories (D70).
Gear uses material-only recipes; Mastery Tokens belong to gear-level training (D94).

## Content and deploy

Master data comes through the authenticated API from uma-platform's content-addressed releases; game rules stay in
this repo (platform P5, P7). Neutral release ids are adapted once for the roster and scenario/continent order.
Three locked franchise packs supply enemies by region and tier (D135); none of their data or screenshots go in git.
The image authoring tools are retired and their local images removed (D136, D137); the published release in the
private bucket is the game's copy ([enemy roster](../design/enemy-roster.md)).
Original code-drawn atlases are bundled from `@luismlorenzana/uma-art` (D26, D64).
Bucket paths, endpoints, caching, local directories and deploy stages are in
[the architecture manual](../game/architecture.md#private-content) and [infrastructure](infrastructure.md).

## Budgets

Main JS ≤ 230 KB gzip (D56). H16 reduced the production entry from 195.96 to 133.15 KB gzip (measured when it merged onto main `888aeb2`).
D147 (uma-kit's shell and Motion's sheets) raised it to about 161 KB gzip.
`scripts/check-size.mjs`, run by the web build, measures the HTML entry and all its static JS dependencies from
Vite's manifest. Both must fit the budget; putting code in an eagerly imported vendor chunk cannot hide it. It also
fails when the initial JS renders a module that must load on demand (H62, below).
Phaser (Hub and battle stage), Firebase, master data parsing, each place page and the fight engine remain lazy chunks.

### Boot and lazy domain boundaries (H16)

- The save parser, Hub state readers and small id/gate validators stay in the entry. Item identities are an id-only
  snapshot; `items/identity.test.ts` compares every field to the authored catalog. Update that snapshot when changing
  item ids, families or sites. Skill, Star Gem and gear identities share exact grammar and constants with their catalogs,
  with exhaustive parity tests.
- Device reads use `parseSaveAsync`: migrations load only for old versions, and the battle engine loads only when a
  save contains a frozen fight. Every pending fight is replayed before the promise returns. There is no unchecked
  intermediate save. The API keeps the synchronous, equally strict `parseSave` contract.
- Gameplay commands dynamically import the domain's `battle`, `work`, `exchange`, `observatory` and `forge` entry points.
  They read the latest save after loading, so overlapping cold commands cannot overwrite one another's changes.
  Skill definitions, the world generator and full recipes load with their screens, not with an idle Hub.
- Dexie initializes on the existing asynchronous device-I/O path. Its separate 32.49 KB gzip chunk is still required
  at boot: entry plus device storage is about 165.6 KB, not 133.15 KB. The database, row format and fallback behavior are
  unchanged. No manual vendor-chunk partition hides startup work.
- The service worker precaches every built JS chunk; a cold, uncached network pass is also required when changing
  these boundaries. The H16 pass used 375×667, synthetic master data and rivals, all 34 open places, four Hub pages,
  five continents, a region, profile tabs and a saved-fight reload under Fast 4G proxy shaping.

### The fight on demand (H62, D184)

By classes v2 the engine had crept back into the entry: the store's `import('@rpg/domain/battle')` resolves to the same
module the root index re-exports, and the Hub read `startingClass`, `activeClass` and `classOf` from it, so every export
of `save/battle.ts`, and through it the engine, rendered in the main chunk. H62 took main JS from 226.48 to 200.54 KB
gzip locally, and from 227.33 to 201.20 KB on CI.

- **What loads on demand:** the engine (`rpg/battle/engine.ts`, `limit.ts`, `skills.ts`: the `engine` chunk, about
  11.7 KB gzip), Auto (`auto.ts`, in the `FightScreen` chunk, 11 KB), the world map's fight rules (`save/battle.ts`,
  `rpg/campaign/run.ts`, `world/world.ts`: the `battle` chunk, 8 KB) and the skill catalog with the Halls' Limit Break
  table (`rpg/catalog.ts`, `rpg/heroes.ts`: a shared chunk named after `heroes`, 6.3 KB). The world map, the Rift, the
  Stable, the Halls and the Exchange import them statically, so they arrive with their page.
- **What stays in the entry:** an Uma's class (`save/class.ts`: `startingClass`, `activeClass`, `classOf`, which
  `save/battle.ts` re-exports), the skill depth tables (`RPG_SKILL_POWER`, `RPG_SKILL_MP` in `rpg/node-identity.ts`,
  which the catalog re-exports), the engine's types and caps, the save parser, and the work and forge rules (the Hub
  reads them, so their dynamic imports don't split; a later trim, not a fight).
- **The subpaths:** `@rpg/domain/engine` (`rpg/battle/index.ts`: the engine, Limit Breaks, Auto, their types; CJS
  `dist/cjs/rpg/battle/index.js`) is the only way to the engine's functions; the root index keeps its types, skill
  numbers and caps. `@rpg/domain/battle` holds the world map's fight rules, which the store's actions (`beginFight`,
  `fightAction`, `leaveFight`, `sweep`, the class and Spring actions) load on first use. The API keeps the synchronous
  `parseSave` through the CJS build.
- **Prefetch:** once the Hub has painted, `battle/prefetch.ts` loads `@rpg/domain/battle` and the fight screen while the
  browser is idle (a 500 ms timeout on Safari), so neither the world map nor a fight waits for them. A save with an open
  fight loads the engine at boot through `parseSaveAsync`, as before.
- **The guard:** `vite.config.ts`'s `chunkModules` writes `dist/.vite/chunks.json` (each chunk's rendered modules; never
  deployed or precached), and `scripts/check-size.mjs` fails the build when the initial JS renders any of
  `LAZY_MODULES`: the engine, Auto, Limit Breaks, the catalog, the Limit Break table and `save/battle.ts`. A screen in
  the entry (the Hub, the bars, `battle/labels.tsx`, the album rows, the store) must not import them; a lazy page may.
