# Architecture

> **Status: current, 2026-10-12; save v16, engine v7.** The full running-system reference is
> [the architecture manual](../game/architecture.md) (D92). This page records the boundaries and decisions;
> production values stay in [infrastructure.md](infrastructure.md).
> Cross-game rules live in uma-platform `docs/architecture.md`.

## Layout

| Path | Boundary |
|---|---|
| `packages/domain` | Pure rules: save/parsers/migrations, combat, world generation, economy, catalogs, places and master-data adapters |
| `apps/web` | React UI and Zustand state; Vite consumes domain source. Phaser draws Hub/battles; DOM owns lasting labels and controls |
| `apps/api` | NestJS auth, revisioned saves, master/private content proxies and Web Push. Consumes the domain's CommonJS build |
| `scripts/cast/` | Private face-pack import/publish pipeline; output stays gitignored |

Tooling and exact dependency versions are generated in [dependencies](../game/dependencies.md), not copied here.

## Save and sync

One account has one revisioned snapshot and one local Dexie row (D32). Strict domain parsers validate both device
and API input. An open fight is frozen input plus actions; replay proves its state (D52).

**Schema v16** (`save/save.ts`), not the old v7/v8 snapshot:
- `account`: trainer name and timestamps.
- `tierWorlds`: each world's wallet, Umas, twenty parties, world progress, items, dishes, unbound gear and facilities.
- An Uma keeps `classId` and per-class `classes` (five weapons, learned sides, loadout), professions, ranks, Extra
  Stats and bound gear. There are no active `build`/`builds` keys (D86).
- `world` holds the active party, one run (stage wins, MP per Uma, an open battle) and Spring uses. Per-party chapter
  runs retired in v11 (D72).
- Wallet shortcuts are `timeTickets` and `sweepTickets` (D74); tokens live in item stock.

| Migration | Decision |
|---|---|
| v10 progress reset, keeping unlocks and parties | D69 |
| v11 world progress replaces chapter runs | D72 |
| v12 Rush converts to Time Tickets | D74 |
| v13 ranks cap at 5 | D77 |
| v14 per-class loadouts, renamed/refunded gear | D86 |
| v15 Crafting converts to Mastery Tokens; Forge inputs release reserved tokens | D94 |
| v16 profession EXP moves to the longer curve without losing earned work | D96 |

`parseSave` accepts v1–v16 and returns v16; the earlier reset remains part of the migration chain.
The API rejects an older-schema overwrite and backs up a stored save before a schema upgrade (D45, D69).
The device writes locally first, syncs after 1.5 seconds and when foreground/online, and resolves concurrent snapshots
by newer `account.updatedAt` (D32). Exact save shapes, endpoints and local setup are in
[the manual](../game/architecture.md#the-save).

## Domain boundaries

| Module | Owns |
|---|---|
| `save/` | Pure actions over saves, refusals, inputs and reward settlement |
| `rpg/battle/` | Deterministic combat reducer and cues; engine v7, with v6 replay compatibility (D91) |
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
The Hub stamps code-drawn art from uma-art; DOM anchors share its grid (D64). Opening an overlay pauses its scene,
not the game loop (D39). Screen labels stay short, with explanations behind `HelpButton` (D95).

Jobs derive progress from timestamps, not interval counters. Queues start at the previous job's finish and pay only
through domain collect rules (D55, D62). Seven Learning halls replace the four distance armories (D70).
Gear uses material-only recipes; Mastery Tokens belong to gear-level training (D94).

## Content and deploy

Master data comes through the authenticated API from uma-platform's content-addressed releases; game rules stay in
this repo (platform P5, P7). Neutral release ids are adapted once for the roster and scenario/continent order.
Six private cast packs supply foe faces by biome; none of their data or screenshots go in git (D83, D85, D88).
Original code-drawn atlases are bundled from `@luismlorenzana/uma-art` (D26, D64).
Bucket paths, endpoints, caching, local directories and deploy stages are in
[the architecture manual](../game/architecture.md#private-content) and [infrastructure](infrastructure.md).

## Budgets

Main JS ≤230 KB gzip (D56). Heavy engines, Firebase and place screens load lazily.
The save parser and its domain dependencies currently load at boot; splitting that domain boundary is deferred.
No infrastructure changes are part of this documentation refresh.
