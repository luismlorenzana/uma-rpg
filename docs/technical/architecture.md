# Architecture

> **Status: current, 2026-10-30; save v33, engine v20 (Classes v3 and Halls v2, D240, D241; the halls' trim, D261).** The full running-system
> reference is [the architecture manual](../game/architecture.md) (D92). This page records the boundaries and decisions;
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

**Schema v32** (`save/version.ts`; the shape and parse in `save/save.ts`):
- `account`: trainer name, timestamps, achievements, each Uma's tier history and the boss and sub-boss faces defeated
  in Rift fights, shared by every tier (D159, D171).
- `tierWorlds`: each world's wallet, Umas, twenty parties, world progress, its Warehouse (`items`: the five lines'
  materials and the made items), per-Uma work rows (SC3) on the fifteen places, targets, Hall of Heroes seats, its Rift: runs
  (with each front's traces and the open Convergence attempt), Echo wins, the open Rift fight (replayed like the world
  map's) and its fight count (D161, D171), the Tier rework's `grant` (D214) and Classes v3's reset record `classesV3`
  (D247).
- An Uma keeps `classId` and per-class `classes` (three weapons, her `lines`, loadout) for the thirteen classes (Tier 0s
  in Tier 1's world only), her Craft Level, Class Ranks (a Tier 0's 1–10 with EXP waiting, a held Tier 1 class's from 10),
  her Extra Stats map (`stars`: open nodes), her gear grades (by weapon kind, five armor slots, one accessory slot with
  its family and kind) and Bonds (seats by hall, the Healer Sanctum's `healer-*` from v32). Her calling pick (`calling`,
  D205) went with v32.
  There are no active `build`/`builds` keys (D86).
- `world` holds the active party, one run (stage wins, MP per Uma, an open battle) and Spring uses. Per-party chapter
  runs retired in v11 (D72).
- Wallet shortcuts are `timeTickets` (Speed Tickets) and `sweepTickets` (D74).
- `targets`: up to ten owned Umas the Wilds plan for (D100, `MAX_TARGETS`, `save/targets.ts`).

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
| v25 classes v2: Cleric progress copied to the Paladin, v2's weapon slots, the Chapel's seats 3–4 to the Bastion, typed accessory slots | D180, D188 |
| v26 each party's independent lead | D190 |
| v27 the Tier rework's fight: three default weapons a class, side skills to lines, the loadout pruned, every Uma's calling pick open; open v15 fights replay on v15 | D205, D210 |
| v28 the Tier rework's economy: work settled, Craft Levels to 1 and the Speed Ticket grant, gear and Star Gems to G0 grades and an empty map, upgrades refunded, the Warehouse converted to the five lines; open v15 and v16 fights replay on their engines | D214, D218 |
| v29 the grant tickets only: a granted world's materials leave its Warehouse; made items, Laurels and tickets stay | D221 |
| v30 the farm by line: old material stock converts to the five graded lines and old work settles; each making place processes its own line and makes its item | D224, D228 |
| v31 the Wilds' trios: old work settles; each line moves to separate gathering, processing and making places | D230, D232 |
| v32 Classes v3's reset: every Uma to her Tier 0 at Class Rank 1 (a later tier's to its Tier 1 class), her Class EXP back as Class Marks, the calling pick dropped; Halls v2's Healer Sanctum merge; moved trades settle on the next boot; open v18 fights replay on v18 | D247 |
| v33 the halls' trim: the Warrior Dojo's and the Mage Tower's seats 3–4 fold into seats 1–2, each Uma's higher Bond kept | D261 |

`parseSave` accepts v1–v33 and returns v33; a world older than v10 takes v10's reset (D69), and `migrations.ts` runs the
rest.
The API rejects an older-schema overwrite and backs up a stored save before a schema upgrade (D45, D69).
The device writes locally first, syncs after 1.5 seconds and when foreground/online, and resolves concurrent snapshots
by newer `account.updatedAt` (D32). Exact save shapes, endpoints and local setup are in
[the manual](../game/architecture.md#the-save).

## Domain boundaries

| Module | Owns |
|---|---|
| `save/` | Pure actions over saves, refusals, inputs and reward settlement |
| `rpg/battle/` | Deterministic combat reducer and cues; engine v20 trims the halls to sixteen Limit Breaks (D261); v19 (Classes v3 and Halls v2, D240, D241) plays the thirteen classes, the hands' lead half, the volley and the double, the re-paired twins and the halls' twenty Limit Breaks; v18 is weaknesses v2 (D235–D237: its foes' lists dealt per stage by `rpg/campaign/weaknesses.ts`), v17 R2's economy on v16's fight; every older version replays as it was; `caps.ts` holds the switch and `rpgRework` |
| `rpg/catalog.ts`, `rpg/rules.ts`, `rpg/class-tree.ts`, `rpg/tree-view.ts` | D86 classes, six since classes v2 (D179), thirteen in a tree since Classes v3 (D240): five Tier 0 promoting at Class Rank 10 into eight Tier 1; 70 Tier 1 trees and 50 one-node Tier 0 trees, class rules by generation; from v16 (live since H72) each tree a trunk and one fork into lines A and B, Skill Ranks and the Skills tab's tree model (D201) |
| `world/` | Seeded continents, five-level region climbs, formations and waves (D72, D91, D97); foes by generation, from v18 with each foe's list from the stage dealer (`rpg/campaign/weaknesses.ts`, D235–D237) over Tier 1's shields |
| `economy/`, `items/` | Professions and the fifteen places, times and prices, gear grades, accessories, the Planet, Class Ranks, points; the five lines' hundred items, the made items and their one-line recipes (D224, D230); v1's catalogs for the migrations |
| `work/` | uma-rpg's kinds and env on `@luismlorenzana/uma-work` (SC3): gather, process and make, one kind a place, the trade gate |
| `rift/`, `save/rift.ts` | The Rift's fronts, faces, fights and run rules, behind the lazy `@rpg/domain/rift` (D173, D174) |
| `roster/`, `master/` | The master data adapter and the Uma Template's calling rule (D203, D220) |
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
through domain collect rules (D55, D62). The Learning page holds the six class halls, which are the Halls of Heroes,
and the Observatory (D106, D179). Gear is raised a grade at a time with made items from the Wilds (D209, D224).

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

Main JS ≤ 230 KB gzip (D56). On 2026-10-28 (`4f0a1bf`) the entry is 223.46 KB gzip and the whole initial JS is that
one static chunk. Earlier marks: H16 brought it to 133.15 KB, D147 (uma-kit's shell and Motion's sheets) to about
161 KB, and H62 back to about 201 KB from 227; the Tier rework's releases and the Wilds added the rest.
`scripts/check-size.mjs`, run by the web build, measures the HTML entry and all its static JS dependencies from
Vite's manifest. Both must fit the budget; putting code in an eagerly imported vendor chunk cannot hide it. It also
fails when the initial JS renders a module that must load on demand (H62, below). Dynamic chunks are outside the count,
Dexie's among them, which every boot loads (below).
Phaser (Hub and battle stage), Firebase Auth, Dexie, master data parsing, each place page and the fight engine remain
lazy chunks.

### Boot and lazy domain boundaries (H16)

- The save parser, Hub state readers and small id/gate validators stay in the entry. Item identities are an id-only
  snapshot; `items/identity.test.ts` compares every field to the authored catalog. Update that snapshot when changing
  item ids, families or sites. Skill, Star Gem and gear identities share exact grammar and constants with their catalogs,
  with exhaustive parity tests.
- Device reads use `parseSaveAsync`: the battle engine loads only when a save contains a frozen fight, and every
  pending fight is replayed before the promise returns. There is no unchecked intermediate save. The API keeps the
  synchronous, equally strict `parseSave` contract. `parseSaveAsync` also imports `save/migrations.ts` dynamically for
  an old version, but `save/save.ts` imports it statically (`migrateWorld`, `toV26`), so the whole migration chain
  renders in the entry.
- Gameplay commands dynamically import the domain's `battle`, `rift`, `work`, `exchange`, `observatory`, `forge`,
  `targets` and `heroes` entry points. They read the latest save after loading, so overlapping cold commands cannot
  overwrite one another's changes. Skill definitions, the world generator and full recipes load with their screens, not
  with an idle Hub. `work` and `forge` render in the entry, since the Hub reads them.
- Dexie initializes on the existing asynchronous device-I/O path. Its separate 32.49 KB gzip chunk is required at boot,
  so a cold boot loads about 256 KB of JS with the entry. The database, row format and fallback behavior are unchanged
  since H16. No manual vendor-chunk partition hides startup work.
- The service worker precaches every built JS chunk; a cold, uncached network pass is also required when changing
  these boundaries. The H16 pass used 375×667, synthetic master data and rivals, every open place, four Hub pages,
  five continents, a region, profile tabs and a saved-fight reload under Fast 4G proxy shaping.

### The fight on demand (H62, D184)

By classes v2 the engine had crept back into the entry: the store's `import('@rpg/domain/battle')` resolves to the same
module the root index re-exports, and the Hub read `startingClass`, `activeClass` and `classOf` from it, so every export
of `save/battle.ts`, and through it the engine, rendered in the main chunk. H62 split it out (main JS 227.33 to
201.20 KB gzip on CI).

- **What loads on demand** (gzip on 2026-10-28): the engine (`rpg/battle/engine.ts`, `limit.ts`, `skills.ts`: the
  `engine` chunk, 12.6 KB), Auto (`auto.ts`, in the `FightScreen` chunk, 11.5 KB), the world map's fight rules
  (`save/battle.ts`, `rpg/campaign/run.ts`, `rewards.ts`, `world/world.ts`: the `battle` chunk, 8.9 KB) and the skill
  catalog with the Halls' Limit Break table (`rpg/catalog.ts`, `rpg/heroes.ts`: a shared chunk named after `heroes`,
  6.9 KB). The world map, the Rift, the Stable, the Halls and the Exchange import them statically, so they arrive with
  their page.
- **What stays in the entry:** an Uma's class (`save/class.ts`: `startingClass`, `activeClass`, `classOf`, which
  `save/battle.ts` re-exports), the skill depth tables (`RPG_SKILL_POWER`, `RPG_SKILL_MP` in `rpg/node-identity.ts`,
  which the catalog re-exports), the engine's types and caps, the save parser and its migrations, the Uma Template
  (`roster/template.ts`), the presets, and the work and forge rules (the Hub reads them, so their dynamic imports don't
  split).
- **The subpaths:** `@rpg/domain/engine` (`rpg/battle/index.ts`: the engine, Limit Breaks, Auto, their types; CJS
  `dist/cjs/rpg/battle/index.js`) is the only way to the engine's functions; the root index keeps its types, skill
  numbers and caps. `@rpg/domain/battle` holds the world map's fight rules, which the store's actions (`beginFight`,
  `fightAction`, `leaveFight`, `sweep`, the class, line, calling and Spring actions) load on first use. The API keeps
  the synchronous `parseSave` through the CJS build.
- **Prefetch:** once the Hub has painted, `battle/prefetch.ts` loads `@rpg/domain/battle` and the fight screen while the
  browser is idle (a 500 ms timeout on Safari), so neither the world map nor a fight waits for them. A save with an open
  fight loads the engine at boot through `parseSaveAsync`, as before.
- **The guard:** `vite.config.ts`'s `chunkModules` writes `dist/.vite/chunks.json` (each chunk's rendered modules; never
  deployed or precached), and `scripts/check-size.mjs` fails the build when the initial JS renders any of
  `LAZY_MODULES`: the engine, Auto, Limit Breaks, the catalog, the Limit Break table and `save/battle.ts` (since then
  also old saves' migrations, save v32's reset rules, the v1 names and Classes v3's class tree tiles,
  `save/class-tiles.ts`, which the Stable draws; H137). A screen in
  the entry (the Hub, the bars, `battle/labels.tsx`, the album rows, the store) must not import them; a lazy page may.
