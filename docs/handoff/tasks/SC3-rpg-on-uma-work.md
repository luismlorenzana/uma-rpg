# SC3 — uma-rpg on `@luismlorenzana/uma-work`: its kinds, save v22 and the API

**uma-rpg · Claude (rules, save and API together) · L · Needs: SC1 released · Unblocks: SC4 · Part of sibling Phase
C.**

## Why

Phase C gives both games one work engine (uma-platform `docs/sibling/phases.md` § Phase C). uma-rpg's jobs move from
facility slots to per-Uma work rows, and its rules become kinds plugged into the shared engine. The player-facing
rules don't change: gather, refine, craft and cut, Craft Level, grade gates, 3/4/5 slots, Speed Tickets. Two engine
behaviours are new here, and the owner wants them:
- Repeat remembers the last job;
- a queue that can't start is kept as "stopped", to restart or dismiss.

## Context (read first)

- uma-platform:
  - `docs/sibling/phases.md` § Phase C (the comparison and the common / per-game table);
  - `packages/work/README.md`, SC1's: the model, `WorkEnv`'s hooks, and how to embed `WorkState` in a save.
- This repo: `CLAUDE.md`, `AGENTS.md`, `docs/game/loops.md` (work, Craft Level, tickets), `docs/game/sections.md`
  (the Wilds' facilities), `docs/game/architecture.md` § The save (the migration list), D55, D62, D74, D139 and D144.
- **The code that moves:**
  - `packages/domain/src/save/work.ts`: `planJob`, `startJob`, `collectJob`, `collectAll`, `queueJob`, `unqueueJob`,
    `recallJob`, `cutJobTime`, `ticketsToFinish`, `upgradeCost`, `upgradeFacility`, `grantProfessionExp`;
  - `economy/jobs.ts` (`Job`, `Facility`, `FACILITIES`, `facilitySpec`, `queueTimeline`, `MAX_QUEUE`) and
    `economy/pacing.ts` (`FACILITY_SLOTS`, `FACILITY_SPEED`, `FACILITY_UPGRADE`, the minutes, EXP and ticket
    constants);
  - `save/facility.ts`, `save/status.ts` (`workOf`), `save/notify.ts` (push text from finish times), `save/targets.ts`
    with `economy/requirements.ts` (`planRequirements`, now in the package), and `save/save.ts` (schema v21, its
    parsers, `toV21`, `FACILITY_SLOTS` padding);
  - the web store's actions in `apps/web/src/save/game.ts`, and `apps/api/src/save/` (strict parsing on the server).

## Decisions made

- **The save is v22:**
  - `TierWorld` gains `work: Record<outfitId, WorkRow>` and `buildings: Record<placeId, { level }>`;
  - `facilities` goes;
  - `items` stays as the free stock;
  - `wallet.timeTickets` stays (its label is Speed Tickets).
- **The migration (`toV22`):**
  - each facility's level moves to `buildings`;
  - each running job finishes into the Warehouse: its remaining items are added to `items`, with their Craft EXP;
  - queued jobs are dropped, with their reserved inputs refunded;
  - every Uma starts Free with no `last`.

  The owner accepts losing in-flight state. Tests cover a save with running, queued and empty slots.
- **Kinds,** in `packages/domain/src/work/kinds/`, one file each: `gather.ts`, `refine.ts`, `craft.ts` (the Forge),
  `cut.ts` (the Lapidary).
  - Each plans from the existing catalogs and minutes (`itemMinutes`, `refineMinutes`, `makeMinutes`), with the
    building's speed, and pays into `items`, or into gear and gems the way `work.ts` does today.
  - Refine allows ×1–×40, as today: one entry of up to 10, each item a batch. If SC1's 1–10 cap conflicts, keep the
    cap and plan a refine item as a batch, noting it under Decisions.
- **`WorkEnv` hooks:**
  - **`buildings`** from `FACILITY_SLOTS`, `FACILITY_SPEED` and `FACILITY_UPGRADE`, the cost in Laurels and items;
  - **`tickets`** read and spend `wallet.timeTickets`;
  - **`exp.grant`** levels `OwnedUma.craft` with `grantProfessionExp`;
  - **`exp.gradeOpen`** uses `gradeUnlockLevel` against Craft Level;
  - no ledger.
- **The domain's API for the web stays as close as it can:**
  - `startJob`, `collectJob`, `collectAll`, `queueJob`, `recallJob`, `cutJobTime` and `upgradeFacility` become thin
    wrappers over the package's operations, taking and returning a `Save`;
  - new: `repeatJob`, `restartStopped` and `dismissStopped`;
  - the store calls them the same way.
- **Push:** `save/notify.ts` reads finish times with the package's `chainTimes` and `endsAt`. The server tick's
  behaviour is unchanged.
- **Out of scope:** the screens (SC4). The old job cards keep working on the new state through a thin adapter until
  SC4 swaps them.

## Do

1. **Pin** `@luismlorenzana/uma-work@<version>` in `packages/domain`. It's a runtime dependency: the API loads the
   domain as CJS, so check the CJS build.
2. **Write the four kinds,** with tests: plan (minutes at the building's speed, inputs, outputs, EXP), the grade gate,
   and pay.
3. **Write the `WorkEnv`** for uma-rpg and the `Save` wrappers. Rewrite `save/work.ts` on them, deleting what the
   package now does (timeline, queues, collect math). `economy/jobs.ts` keeps only the facility catalog
   (`FACILITIES`, `facilitySpec`).
4. **Schema v22:** the parser (strict, unknown keys refused), `toV22`, and the migration tests. Bump the schema version
   everywhere it's checked: web, API, and the docs' live blocks.
5. **The web:** adapt `apps/web/src/save/game.ts`'s actions and `places/work/FacilityPage.tsx` minimally, to read the
   new state, so today's screens keep working until SC4. Add Repeat and the stopped-queue card only if they're trivial
   on the old screens; otherwise SC4 brings them.
6. **The API:** check that `apps/api/src/save/` accepts v22 and migrates older saves on read, and that its tests pass.
7. **Docs:**
   - `docs/game/loops.md` (work: rows per Uma, Repeat, stopped queues);
   - `docs/game/architecture.md` (v22 in the save list, the domain map's `work/kinds/`, the package);
   - `docs/game/sections.md` if any visible rule changed;
   - run `pnpm docs:update`;
   - log a D-decision.
8. **Check it** in the iOS Simulator's Home Screen app, on a save with running jobs:
   - it migrates, with items received;
   - start, queue 3, collect part-way, recall, speed up with tickets, finish, upgrade;
   - Collect all;
   - a stopped queue (start a chain whose inputs run out);
   - the push "work done" count (`/api/push/test` locally) still matches.

## Done when

- [ ] `pnpm lint && pnpm test && pnpm build` pass; the main JS is under budget. The API's CJS build loads the domain
      with the package.
- [ ] The migration tests cover running, queued and empty slots, plus a v21 fixture from before.
- [ ] `save/work.ts` has no timeline or queue math of its own: grep for `msEach` and `queueTimeline`.
- [ ] The Simulator check in step 8 was done and described. The docs and D-decision are in. Deployed and green.

## Deliver

- Claude: commit to `main`, `feat(domain): work runs on @luismlorenzana/uma-work, save v22 (SC3)`, then watch the
  deploy.
- **Flag it done:**
  - delete this file;
  - add a Done row here;
  - set SC3 to Done in uma-platform's queue.
