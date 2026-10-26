# H110 — The farm by line: save v30 (dark)

**uma-rpg · ChatGPT · M · Needs: H109 · Unblocks: H112 · Runs beside H111 (different files)**

## Why

The farm by line changes what a material id means and what a place takes (D224;
[farm-by-line.md](../../design/tier-rework/farm-by-line.md) FL17–FL21). A save needs version 30 to carry it:
- a v30 save can hold work a v29 app can't read (processing at the Forge) and ids it doesn't know (`tome-ink-g3`);
- the server refuses a v29 app once v30 is stored and backs up the v29 save on the first v30 write (D45, D69).

This packet **writes the migration and the v30 parse, dark**. `toV30` is exported and tested but not chained;
`SAVE_SCHEMA_VERSION` stays 29. H112 chains it and turns it on, as H78 and H82 did for v28.

## Scope

- **In:**
  - `toV30` and its shared settle step;
  - the v30 parse rules, chosen by `farmByLine()`;
  - a full-shaped v29 fixture;
  - the tests.
  All in `packages/domain/src/save/`.
- **Out:**
  - chaining `toV30`, the version bump and the API test (H112);
  - screens (H111).

## Context (read first)

- [farm-by-line.md](../../design/tier-rework/farm-by-line.md) §7 (FL17–FL21) and §10 (the switch); D224; D214 and D221 (how
  `toV28` and `toV29` were written and tested); D69, D45 (the server's backup and refusal).
- `save/migrations.ts`:
  - `migrateWorld` (the chain);
  - `toV28` (its step 1, "Settle work", is the step to extract);
  - `toV29` and `V28_MATERIALS` (a literals-only step, the style to follow).
- `save/save.ts`:
  - `parseSave`, `parseWork` and its `WorkRules`;
  - `parseSlotV28`, `madeAtV28`, `parseRequestV28`, `v28Work`;
  - `parseStock`.
- `save/v28.fixture.ts` (a full-shaped v28 world), `save/migrations-v29.test.ts`, `save/save-v28.test.ts`.
- H109's `items/lines.ts`, `items/made-v4.ts`, `economy/places-v4.ts`, `save/version.ts` (`farmByLine`).

## Do

1. **The settle step:** move `toV28`'s step 1 into one exported helper, `settleWork(world)`:
   - every started entry's outputs from `collected` on go into `items` (a gather's or refine's item; R2's craft and cut
     outputs are made items, also into `items`) and pay their `exp[i]` into her `craft`;
   - queued requests drop; `work` becomes `{}`.
   - `toV28` calls it with its own handling of craft and cut (they counted as deleted in v28); keep `toV28`'s behaviour
     and tests exactly as they are.
2. **`toV30(world)`** (FL17–FL19), literals only:
   - **a.** `settleWork`.
   - **b.** Convert R2's sixty material ids with one literal table, `V30_TYPES` (old id → new id), built from FL18:
     - a low type of any tier becomes its line's G1 id;
     - a high type becomes its G6 id;
     - raw to raw, refined to refined;
     - build the new `items` from the old in one pass and sum collisions (Copper Ore + Gold Ore + Mythril Ore → Copper
       Ore), so no id converts twice.
   - **c.** Every other key of `items` (made items, unknown ids) stays as it is. Gear, stars, Craft Levels (after a's
     EXP), the wallet, targets, parties, `grant` and the Rift stay.
   - It runs once, gated by the stored version in `migrateWorld`. Like `toV28`, it is not idempotent by shape (Gold Ore
     means different things before and after), so the docblock says so.
   - **Don't chain it:** `migrateWorld` is unchanged until H112.
3. **The v30 parse** (FL2, FL5), in `save/save.ts`, used when `farmByLine()`:
   - **`madeAtV30(placeId, kind, item)`:**
     - `gather` at a gathering place: a raw `LineItem` of its line;
     - `refine` at a making place: a refined `LineItem` of its line;
     - `craft` or `cut`, of the place's kinds: a made line it makes (the Branch Gem from R3's weapons only).
   - **`parseRequestV30`:** the request's kind must be one of the place's `kinds`, its item made there, and its count
     1–`maxJobCount(kind)`.
   - **`v30Work(tier)`:** `WorkRules` with `parseSlotV28`'s slot, `parseRequestV30` and `isStockItemId` (which H109 made
     switch-aware).
   - **`parseStock`** accepts what `isStockItemId` accepts under the switch.
   - With the switch off, the parse is exactly today's.
4. **The fixture**, new `save/v29.fixture.ts`. A full-shaped v29 Tier 1 world, plus a Tier 2 world with a little stock:
   - an Uma of every trade, with Craft Levels 1, 12, 26 and 30, and graded gear (a Fire Tome at G2, a Katana at G3);
   - **work:**
     - a Paladin processing `iron-ingot` ×8 at the Workbench, 2 collected;
     - a Brawler making `weapon-gem-g2` ×3 at the Forge, none collected;
     - a Summoner gathering `sardine` ×5 at the Fishery, with one queued request behind it;
   - **stock:**
     - each of R2's sixty material ids at a distinct count (1, 2, 3 … 60, so sums can be read);
     - `weapon-gem-g1` ×2, `armor-fittings-g1` ×1, `jewel-planet-1` ×1;
   - a `grant` record.

## Tests, `save/migrations-v30.test.ts`

- **Settle:**
  - the Workbench job's six uncollected Iron Ingots arrive (then convert to Gold Ingot);
  - the Forge job's three Weapon Gems G2 arrive, the Fishery's five Sardines (then Sea Bream);
  - each pays its EXP into her Craft (her level moves if it crosses);
  - the queue is gone; `work` is `{}`.
- **Convert, every id:**
  - all sixty old ids to FL18's ids, with the sums: Copper Ore = copper-ore + gold-ore + mythril-ore's counts, Gold Ore =
    iron-ore + titanium-ore + orichalcum-ore's;
  - every line, raw and refined;
  - no old high-type id is left under its old meaning;
  - the Tier 2 world converts by the same table.
- **Stays:** made items (the Weapon Gems, Fittings, Jewel), gear grades, set jewels, the wallet, targets, `grant`,
  parties.
- **Parse under v30** (switch on):
  - the migrated world parses;
  - a v30 world with a `refine` entry for `copper-ingot` at the Forge parses;
  - one for `pine-plank` at the Forge is refused;
  - a `craft` at a gathering place is refused;
  - `tome-ink-g3` in stock parses, and is refused with the switch off.
- **Settle helper:** `toV28`'s tests unchanged and green.

## Done when

- [ ] `pnpm lint && pnpm test && pnpm build` pass.
- [ ] `toV30` and `settleWork` are exported; `migrateWorld` and `SAVE_SCHEMA_VERSION` are unchanged (29); nothing live
      moves.
- [ ] The tests above pass. A D-row logs the build (fetch `main` first). Nothing from the original games in git.
- [ ] Deployed green, and https://uma-rpg.web.app/api/health shows the commit.

## Deliver

- A pull request from `feat/h110-save-v30`, one commit: `feat(save): v30 written dark, the farm by line's migration and
  parse (H110)`.
- H111 runs at the same time and touches only `apps/web`; fetch `main` before you push.
- **ChatGPT merges it itself** once CI is green, then watches the deploy:
  `gh run watch <id> -R luismlorenzana/uma-rpg --exit-status`.
- **Flag it done:** a `docs(handoff): H110 done (D…)` commit deletes this file and adds a Done row to
  `docs/handoff/README.md`.
