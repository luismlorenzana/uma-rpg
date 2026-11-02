# H152 — Windows, the rules: the board, latching, save v35 (dark), per-Uma Ascend

**uma-rpg · Claude · L · Needs: nothing · Unblocks: H154, H155, H157**

## Why

Every Uma gets a stained-glass window a tier, lit by a 31-step board, and only a full window ascends
([collections.md](../../design/collections/collections.md), approved D283). This packet is the rules behind it, written
**dark**: the save stays v34 in play, `toV35` is exported but not chained, and H157 switches it on. No fight rule
changes: the engine stays v21.

## Context (read first)

- `CLAUDE.md`, `AGENTS.md`, [the manual](../../game/README.md): [loops](../../game/loops.md) (Leveling, Ranks, Craft Level,
  Extra Stats and gear, the Rift), [maps](../../game/maps.md#capitals).
- **The design:** collections.md §3 (the board), §3.4 (latching), §5 (Ascend and the run), §8 (the save), §9 (the
  switch); the [board page](../../design/collections/previews/board.html) has every step of every tier.
- **The save:** `save/save.ts` (`OwnedUma`, `TierWorld`, `Account`, `parseSaveChecked`: the account has no migration
  chain, so its new fields are added there), `save/migrations.ts` (`migrateWorld`, `toV34`'s pattern), `save/version.ts`.
  The dark pattern is H78's: `toV28` exported and tested, not chained, until H82 switched it.
- **What she has:** `uma.level`, `uma.craft.level`, `uma.ranks` (Class Ranks by class), `save/class.ts` `activeClass`,
  `gradesOf` (weapons, armor, accessory slots), `starMapOf` and `economy/planet.ts` (`planet:1` … `template:2`).
- **Fights:** `save/battle.ts` `settleFight` (where a world win pays), `world/capital.ts` (`capitalId`,
  `capitalStageIds(continentId, route)`); `save/rift.ts` (the Convergence's win sets `wonAt` near line 327; `signUpBlock`,
  `ascendBlock`, `ascend`), `rift/state.ts` (`RiftRun`, `openRiftRun`).
- **Where every change passes:** the web's `commit(save)` in `apps/web/src/save/game.ts`. H155 calls this packet's
  `latchWindows` there; this packet only provides it.

## Decisions made

1. **One switch:** `collectionsLive(version = SAVE_SCHEMA_VERSION) => version >= 35` in `save/version.ts`'s module family
   (no imports, no cycles). Everything new reads it; H157 bumps the version and it turns on.
2. **The catalog** (`rpg/windows.ts`, pure, no save imports): step ids in a fixed order, which is also the record's
   order: `level-1 … level-5`, `class-1 … class-5`, `craft-1 … craft-5`, `gear-1 … gear-5`, `stars-1 … stars-5`,
   `world-1 … world-5`, `rift`. `windowBoard(tier)` lists a tier's steps (Tier 3 has no `rift`, so 30), each with its
   track, numeral and rule. `WINDOW_STEPS_MAX = 31`.
3. **The rules** (`windowMet(uma, outfit, tier, record)`, collections.md §3.2):
   - Level n: `uma.level ≥ 10n`. Craft n: `uma.craft.level ≥ 10n` (CO15: Craft V stays at Lv 50).
   - Class 1: in Tier 1, any Tier 0 class at Class Rank 10; above Tier 1, any Tier 1 class at 10. Class 2: her best Tier 1
     class at 30. Class 3: her best at 50. Class 4: her second best at 50. Class 5: her third best at 50. Read from her
     ranks, never from the class she fights as.
   - Gear n: the **lowest** grade of her eleven worn slots ≥ 2n: the three weapons of the class she fights as
     (`activeClass`), her five armor slots, her three accessory slots.
   - Stars n: every Planet and moon node numbered ≤ n open, and her moon's `template:1` from n = 2, `template:2` from
     n = 4 (4 · 9 · 13 · 18 · 22 nodes).
   - World n: all three champions of the tier's continent `5 × (tier − 1) + n` in her record (decision 5).
   - Rift: in her record (decision 6).
4. **The record** (account-level, so it survives her ascending): `account.windows[outfitId][tierKey] = { steps, champions }`.
   `steps` is a 93-character string, three base-36 characters a step in the catalog's order, the step's day as days
   since 2026-01-01 (UTC), `---` while dark. `champions` is a 15-bit mask, bit `3 × (n − 1) + (route − 1)` for the
   tier's continent n. Parse it strictly (length, alphabet, known outfit ids, tier keys of existing worlds). Budget: 270
   Umas in one tier under 35 KB of JSON; a test holds it. `account.windowsStart: string | null`: null until the first
   latch has run the switch's credit (decision 9).
5. **The World record:** when `settleFight` settles a won capital champion stage, each entrant gets its bit, while
   `collectionsLive`. Replays count; a loss doesn't.
6. **The Rift step:** when a run is won (the Convergence's last win), its twenty get `rift` that day, while
   `collectionsLive`.
7. **Latching** (`save/windows.ts`): `latchWindows(save, outfits, now): Save` sets the day of every step each Uma's state
   meets in her own world and tier, and never clears one (CO2); it returns the **same object** when nothing changed, so
   `commit` can skip a write. A window, once full, stays full (Tier 3's included, if a Rift arrives later). Helpers for
   the screens: `windowOf(save, outfitId, tier)` → the steps lit with their days, `lit`, `steps`, `percent`
   (`Math.round(100 × lit ÷ steps)`, CO36), and each track's share.
8. **Save v35** (`toV35`, exported, **not chained**; `parseSave` accepts v35 shapes only when `collectionsLive(version)`):
   - account: `windows: {}`, `windowsStart: null`;
   - each world: `drills: { day: null, runs: 10, won: {} }` and `wallet.trainingLogs: 0` (H154's rules use them; written
     here so there is one bump);
   - nothing else moves: no Uma, item, rank or level changes.
9. **The switch's credit** (on the first latch, while `windowsStart` is null; then set it to `now`; collections.md §9):
   - every step her state meets, dated that day;
   - World, retroactive (CO25): continent n for every Uma at least Lv `10n` (her tier's levels) in a world whose record
     has all three of its champions won (`world.world.run`'s wins);
   - `rift` for every Uma on the roster of a run already won;
   - an Uma who ascended before windows: every step of each tier below her history's last entry, dated that entry's day.
   A world made after the switch starts with `windowsStart` set, so none of this runs.
10. **Per-Uma Ascend** (`save/rift.ts`): `ascendUmasBlock(save, outfitIds, tier, name)` and
    `ascendUmas(save, outfitIds, now, tier) → { save, summary }`: each Uma's window full in this tier; no Rift or
    world-map fight open (today's rule); none at work (`Recall or collect: …`); a tier above. Each moves exactly as
    `ascend` moves the twenty today: leaves the old world's Stable, parties, targets, MP, Hall seats and work; her grades'
    made items back to the old Warehouse, jewels gone; arrives at Lv 1, Class Rank 1, G0, an empty map, Craft Lv 1, no
    Bonds, her class and accessory slots' forms, as her suggested promotion if she was a Tier 0; the new world's wallet
    gets her purse and her banked EXP as Class Marks. **Parties:** a party whose five all ascend in one call moves with
    its name; the rest fill the new world's first free slots. **History:** `{ tier, at, run }`, the run whose win gave her
    `rift` (the latest such run). Share the core with `ascend`; `ascend` and its screen stay until H157 removes them.
11. **Runs** (CO18): while `collectionsLive`, a run is done at its win: `signUpBlock` no longer says "Ascend the won run
    first", and the open run is the last one with `wonAt === null`. Add `currentRiftRun(rift)` with that rule and move
    every caller of `openRiftRun` (domain, `RiftPeek.tsx`, `use-rift.ts`, `TierSheet.tsx`) to it; old runs keep their
    `ascendedAt`. An Uma who already has `rift` may sign up again.

## Do

1. `rpg/windows.ts` and its tests: every step of every tier met and not met, at the edges (Lv 49/50, R49/50, one slot at
   G9, `template:2` missing), Class read from her best classes, Tier 3 at 30 steps.
2. The record's codes, parse and budget test; `save/windows.ts` (`latchWindows`, `windowOf`) and tests: latching keeps
   old days, the same object back when nothing changed, a full window stays full.
3. The World and Rift hooks, gated by `collectionsLive`, with tests built on `toV35` saves.
4. `toV35` and its tests on a full-shaped v34 save (use the newest fixtures): fields added, nothing else changed; the
   switch's credit on the same save (World credit, past runs, an ascended Uma's Tier 1).
5. `ascendUmas`, `ascendUmasBlock`, `currentRiftRun`, `signUpBlock`'s change, all behind `collectionsLive`, with tests
   that mirror `ascend`'s (`ascend-v3.test.ts`).
6. Export what the web needs through the package's entry points, lazily loaded like `@rpg/domain/rift`.
7. Log the D-row (fetch `main` first).

## Done when

- [ ] `pnpm lint && pnpm test:ci && pnpm build` pass.
- [ ] `SAVE_SCHEMA_VERSION` is still 34 and the live game behaves exactly as before: every existing test passes
      unchanged, and nothing writes `account.windows` while dark.
- [ ] The 35 KB budget test passes.
- [ ] Nothing from the original games in git (`git status`).
- [ ] Deployed green (`gh run watch <id> -R luismlorenzana/uma-rpg --exit-status`) and https://uma-rpg.web.app/api/health
      shows the commit.

## Deliver

- **Claude:** commit to `main`, "feat(domain): windows, the board and latching, dark (H152)".
- **Flag it done:** delete this file and add a Done row in [README.md](../README.md) with the commit.
