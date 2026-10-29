# H136 — The entry's budget: the migration chain loads on demand, and the v1 economy's names leave the main bundle

**uma-rpg · Claude · S–M · Needs: — · Unblocks: H126 (lands first; then H128–H134 and the profile screens have room)**

## Why

Main JS is **223.46 KB of 230** (D56; intake finding F36), and Classes v3 adds about 3.5 KB to the entry before the
profile v2 screens (H120, H123, H132) add theirs. Two things sit in the entry that a current save never needs:

- **The whole migration chain** (`save/migrations.ts`, every step v10 → v31). H16 made it lazy: `parseSaveAsync` loads it
  with `import('./migrations')` only for an old save. A later change made `save/save.ts` import `toV26` statically for the
  pre-v10 reset, which pulls the module and its tables back into the entry and turns the lazy import into a no-op.
- **The v1 economy's names** (`items/families.ts`: every v1 raw and refined item's name, and the v1 gear and Star Gem
  names derived from it). No v28+ world holds a v1 id (the parse refuses one, `isStockItemId`), so nothing live shows
  them; only the v1 code paths kept for engine-16 tests (D218, F37) and the v1 screens (F38) read them.

This packet moves both out of the entry, measured, and adds the guard so neither can creep back. It changes no rule and
nothing a player sees. Classes v3's packets then build on about 214.7 KB.

## Context (read first)

- `CLAUDE.md`, `AGENTS.md`; D56 and H16, H62 in [docs/archive/handoff-history.md](../../archive/handoff-history.md) (H62's
  Done row: how the engine left the entry and the guard it added); [intake-findings.md](../intake-findings.md) F36, F37, F38.
- **The manual:** `docs/game/architecture.md` (:53 the `save/` row; :95 the main JS figure, "223.46 KB gzip (2026-10-28)").
- **The code** (line numbers on `main` at `b9ce7c5`):
  - `packages/domain/src/save/save.ts`: the static `import { migrateWorld, toV26, type TierGrant } from './migrations'`
    (:56) and the type re-export (:59); the engine's static `replayBattle` import (:42); `resetTierWorld` (:942), whose
    party leads call `toV26` (:954); `parseTierWorld` (:1000, `migrate` passed in); `parseSave` (:1328–:1330, sync, with
    `migrateWorld` and `replayBattle`); `parseSaveAsync` (:1334–:1344, its lazy `import('./migrations')` at :1337 and the
    engine's at :1340); `parseSavePut` (:1378).
  - `packages/domain/src/save/migrations.ts`: its header (:1, "needed only for old saves … (H16)"), `migrateWorld` (:205),
    `toV26` (:618, a party's lead from its first occupied slot).
  - Who parses: the web only through `parseSaveAsync` (`apps/web/src/save/db.ts:42`); the API through the sync `parseSave`
    and `parseSavePut` on the CJS build (`apps/api/src/save/local-save.repository.ts:39, :47`,
    `firestore-save.repository.ts:17`, `save.controller.ts:20`), which no bundler measures.
  - The names: `items/families.ts` (`FAMILY_SPECS` :18, ids and names); `items/catalog.ts` (:1–:46: `export *` from
    families, `ITEM_FAMILIES`, `ITEMS`, `itemById`, `familyById` built from the names, and the light `ITEM_GRADES`,
    `gradeUnlockLevel`, `highestGrade`, `EFFECT_LABEL`); `items/identity.ts` (the id-only snapshot `ITEM_IDENTITIES` and
    `isItemId`, already in the entry for the parse; `identity.test.ts` keeps it equal to the families);
    `economy/gear.ts` (:8 the import, :34 `familyOf`, :45–:47 `gradeWord` from the raw names, :49 `gearById`);
    `economy/gems.ts` (:8, :14 `stoneOf`, :15 `VIRTUE`, :45–:57 the names and the eager `GEMS` table);
    `economy/stock.ts:10–:11` (`stockName`'s v1 fallbacks); `save/work.ts` (:20, :56 `outputName`, :130, :149);
    `save/forge.ts`, `save/targets.ts`, `work/env.ts:21`, `work/kinds/gather.ts:13`, `refine.ts:13`, `craft.ts:5`,
    `cut.ts:5` (the v1 paths, which read ids, grades and recipes, not names); the web's `items/frames.ts` (:4, :40 the
    row map built from `ITEM_FAMILIES`, :95 `itemById`, :100 `gearById`: positions only) and the lazy screens that print a
    v1 name (`places/work/FacilityPage.tsx`, `places/stable/WeaponSheet.tsx`, `places/exchange/ExchangePage.tsx`,
    `items/outputs.ts`); `docs/render.ts:87` (`stockName` for live recipes only).
  - The guard: `scripts/check-size.mjs` (`MAIN_JS_BUDGET` :7, `LAZY_MODULES` :11–:18, `lazyInInitial` :36),
    `scripts/check-size.test.mjs` (:54, H62's test); `apps/web/vite.config.ts` (`chunkModules` :13 writes
    `dist/.vite/chunks.json`).

## Decisions made

### What was measured while this packet was written (2026-10-29, `b9ce7c5`, `vite build` in a scratch worktree, `check-size.mjs`)

| Build | Main JS gzip | Change |
|---|---|---|
| `main` | **223.46 KB** (one static chunk) | — |
| `resetTierWorld` without `toV26` (step 1) | **216.00 KB**; `save/migrations.ts` renders only in its own lazy chunk | **−7.46 KB** |
| and the item catalog built from `ITEM_IDENTITIES` with no names (an approximation of step 2) | **214.59 KB**; `items/families.ts` out of the entry | **−1.41 KB** more |

A sourcemap attribution of today's entry agrees: `save/migrations.ts` renders 24.3 KB raw (about 7.5 KB of the gzip),
`items/families.ts` 5.5 KB raw (about 1.4 KB), `economy/gear.ts` and `economy/gems.ts` 2.7 KB raw together. **Expected:
about −8.8 KB, the entry at about 214.7 KB** (step 2's real split keeps a few hundred bytes of id-level code).

### This packet's decisions

- **The split, step 1: the sync parse keeps its static import, and nothing live calls a migration step.** `parseSave`
  and `parseSavePut` stay synchronous in `save/save.ts` with `migrateWorld` imported statically: the API (CJS, unbundled)
  and the tests use them, and the web never does, so the bundler drops them and their imports exactly as it drops
  `replayBattle` today (the same file imports the engine statically, :42; H62). The one live reference was `toV26` in
  `resetTierWorld`: it becomes a local literal in `save.ts`, `withLeads(parties)` (a row with no `lead` and a slot list
  takes its first occupied slot, else null; malformed rows pass to the strict parse), the same rule as `toV26`, which
  stays in the chain for v25 saves. `parseSaveAsync` keeps its lazy `import('./migrations')`, which now loads a chunk of
  its own. `TierGrant` stays a type re-export (erased). Why not a server-only module for the sync parse: it would move
  the API's imports and the package exports for nothing the bundler doesn't already drop, and the guard below makes a
  regression a build failure.
- **Step 2: ids stay in the entry, names leave it.** The v1 economy's logic stays where it is (F37's keep-or-remove is the
  owner's, not this packet's); only its display names move:
  - `items/catalog.ts` builds `ITEM_FAMILIES`, `ITEMS`, `itemById` and `familyById` from `ITEM_IDENTITIES` (ids, family,
    effect, grade, refined, pair) and stops re-exporting `families.ts`; **`ItemDef` and `ItemFamily` lose `name`**.
    `ITEM_GRADES`, `gradeUnlockLevel`, `highestGrade` and `EFFECT_LABEL` stay.
  - `economy/gear.ts`: recipes read the id snapshot; **`GearPiece` loses `name`** (`gradeWord` moves out).
    `economy/gems.ts`: recipes and the `GEMS` table read the id snapshot; **`Gem` loses `name`** (`stoneOf`, `VIRTUE`
    move out).
  - **New `items/names-v1.ts`**, the only importer of `items/families.ts`: `itemNameV1(id)`, `familyNameV1(id)`,
    `gearNameV1(id)` ("Copper Greatsword", from `gradeWord` and `EQUIP_LABEL`), `gemNameV1(id)` ("Garnet of Strength"),
    and `stockNameV1(id)`, today's full chain (line item, made item, v1 item, gem, piece, else the id). Re-exported from
    the domain index for the lazy screens and the tests.
  - **`stockName`** (in the entry) reads a line item's name, then a made item's, else the id; **`outputName`**
    (`save/work.ts:56`) is `stockName`. A v1 id can't be in a v28+ world, so nothing on screen changes.
  - The web's `items/frames.ts` places icons from `ITEM_IDENTITIES` and `gearIdentity` (positions only); every lazy screen
    or test that prints or asserts a v1 name calls the `…NameV1` function. The typecheck lists each `.name` site.
- **The guard** (`scripts/check-size.mjs`): `LAZY_MODULES` gains `packages/domain/src/save/migrations.ts`,
  `packages/domain/src/items/families.ts` and `packages/domain/src/items/names-v1.ts`, its comment says why (H136: old
  saves and the v1 economy's names load on demand), and the failure message names H136 beside H62. A node test in
  `check-size.test.mjs` refuses an entry that renders `migrations.ts` and accepts it in a lazy chunk (H62's pattern).
- **The budget stays 230 KB** (D56); the freed room is Classes v3's and the profile screens'.
- **Offline:** the service worker precaches every built chunk, the migrations chunk included, so an old save still opens
  offline (checked in step 6).
- **No rule, save or engine change:** `SAVE_SCHEMA_VERSION` 31, engine 18, every replay and every migration test as before.
  `pnpm docs:update` gives no diff (the manual prints live recipes through `stockName`, line and made items only);
  `architecture.md`'s hand-written figure (:95) and `save/` row (:53, "`migrations.ts` … loaded on demand") follow.

## Do

1. **Measure first:** `pnpm --filter @rpg/web build`, note `check-size.mjs`'s main JS (expect 223.46 KB) and that
   `dist/.vite/chunks.json` lists `save/migrations.ts` and `items/families.ts` in the entry.
2. **Step 1:** `withLeads` in `save/save.ts`, the import at :56 without `toV26`; a test in `save/save.test.ts` that a pre-v10
   save's parties come out of `resetTierWorld` with the same leads `toV26` gives (an empty party, a lead already set, a
   malformed row). Build: the entry no longer renders `migrations.ts`; it has a chunk of its own.
3. **Step 2:** the id-level catalog, gear and gems; `items/names-v1.ts`; `stockName` and `outputName`; `items/frames.ts`;
   every `.name` site the typecheck lists, to the `…NameV1` functions. `identity.test.ts` still pins `ITEM_IDENTITIES` to
   `FAMILY_SPECS`; `frames.test.ts` still pins every icon position. Tests that asserted a v1 name through a domain
   function now assert it through `names-v1` (no expected string changes).
4. **The guard:** the three modules in `LAZY_MODULES`, the comment, the message; the node test.
5. **Measure again** and put both numbers, and each step's, in the PR body and the D-row.
6. **Check it locally** (desktop browser, 390×844, local mode, your own ports): a scratch **v30** save from
   `save/v30.fixture.ts` written to `apps/api/.data/save.json` loads through the API (the sync parse migrates it) and on the
   device from IndexedDB (the network panel shows the migrations chunk fetched once, then the Hub); a current v31 save
   boots without fetching it; the Warehouse, a Wilds place and the Exchange read as before (names of line and made
   items); after one online visit, with the servers stopped and the network offline, the app reopens on the old save.
7. **Docs:** a D-row (fetch `main` first; the next free number) with the measurements; `architecture.md` :53 and :95; F36
   in `intake-findings.md` marked done with this packet's id. `pnpm docs:update`: no diff.

## Done when

- [ ] `pnpm lint && pnpm test && pnpm build` pass; `check-size.mjs` reports about **214.7 KB** (at most 216.5 KB); the
  entry renders neither `save/migrations.ts` nor `items/families.ts` (`chunks.json`). Say the before and after numbers.
- [ ] The new tests pass, with every migration test, replay test and the API's save tests unchanged.
- [ ] `pnpm docs:update` leaves no diff; `architecture.md` and F36 updated; the D-row is logged.
- [ ] Step 6's local check was done and described. Nothing from the original games in git (`git status`).
- [ ] Deployed green (`gh run watch <id> -R luismlorenzana/uma-rpg --exit-status`), and https://uma-rpg.web.app/api/health
  shows the commit in `build`.

## Deliver

- **Claude:** a branch `fix/h136-entry-budget` and one pull request, commit `perf(domain): old saves' migrations and the v1
  economy's names leave the main bundle (H136)`; the body gives the numbers. Fetch `main` before you push so the D-number
  is free. After CI passes, Claude merges it and watches the deploy. Nothing on screen changes.
- **Flag it done:** a `docs(handoff): H136 done (D…)` commit deletes this file, adds H136's Done row to
  `docs/handoff/README.md` with the commit and the new main JS figure, and sets H126 Ready.
