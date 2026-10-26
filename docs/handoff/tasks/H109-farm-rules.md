# H109 — The farm by line: the rules (dark)

**uma-rpg · ChatGPT · L · Needs: H82 (live) · Unblocks: H110, H111**

## Why

The owner wants every trade to gather, process and make its own line, on G1–G10 materials, with one item a making place
and times that match across the three steps (D224). The design is
[farm-by-line.md](../../design/tier-rework/farm-by-line.md); this packet cites its calls as FL1…FL24.

This packet builds **the domain rules only, dark**: new modules beside R2's, chosen by one switch that stays off until
H112. The live game doesn't change when it merges.

## Scope

- **In:** the switch; the fifty-type catalog; Tome Ink's ids; the recipes; the places' two jobs; the work rules and times;
  the gear item by channel; targets; the Exchange; the place blurbs; the pacing ledger. All under `packages/domain/src/`.
- **Out:**
  - save v30's migration and parse (H110);
  - every screen (H111);
  - turning it on, deleting R2's farm, the manual (H112).
- **Don't touch** R2's modules' behaviour: with the switch off, every rule answers exactly as today and every existing
  test passes unchanged.

## Context (read first)

- `CLAUDE.md`, `AGENTS.md`; [farm-by-line.md](../../design/tier-rework/farm-by-line.md) §1–§6, §8, §10 (the contract you
  build); D224; D208–D215 (how R2 was built dark beside v1, the pattern to follow).
- **R2's modules you sit beside:**
  - `items/materials-id.ts`, `items/materials.ts`, `items/made-id.ts`, `items/made.ts`, `items/stock-id.ts`;
  - `economy/professions.ts`, `economy/pacing.ts`, `economy/grades.ts`;
  - `work/kinds-v3/` (material, make, trade, setup), `work/env-v3.ts`;
  - `save/targets.ts`, `save/exchange.ts`, `hub/places.ts`, `economy/professions.sim.ts` and its test.
- **The switch's model:** `rpg/battle/caps.ts`' `rpgRework(stage, engine)`, and `caps-at.fixture.ts`, which tests use to
  mock it.

## Do

1. **The switch** (FL contract, §10):
   - New `save/version.ts` with no imports: move `SAVE_SCHEMA_VERSION` (29) here; `save.ts` re-exports it, so no caller
     changes.
   - Add `FARM_BY_LINE_SAVE = 30` and `farmByLine(save: number = SAVE_SCHEMA_VERSION): boolean => save >= FARM_BY_LINE_SAVE`.
   - Every rule below that differs takes the switch from this function. Rules that already take an `engine` argument
     keep it; add an optional `save` argument only where a test needs to force the switch, or mock `save/version.ts` in
     tests (a `version-at.fixture.ts` like `caps-at.fixture.ts`).
2. **The catalog** (FL5, FL14, FL15), new `items/lines.ts`:
   - `LineItem { id, line, grade, refined, pair, name, art: { family, grade } }`.
   - `LINE_ITEMS`: the hundred ids of FL5's table, line by line (Metal, Wood, Vegetables, Fish, Stone), raw G1–G10 then
     refined G1–G10. `art.family` is the line's uma-art family (`ores`, `woods`, `vegetables`, `fish`, `crystals`),
     `art.grade` its grade.
   - Names from the id, as `materials.ts`' `nameOf` does (share it rather than copy it): "Tomato Purée", "Cut
     Philosopher's Stone", "Yggdrasil Branch".
   - `lineItem(id)`, `isLineItemId(id)`, `lineItemId(line, grade, refined)`.
3. **Tome Ink's ids** (FL14), `items/made-id.ts`:
   - Append `'tome-ink'` to `MADE_LINES` and its ten ids (`tome-ink-g1`…`g10`, grades 1–10) after the existing ones; no
     existing order moves.
   - `gradeItem` accepts `'tome-ink'`.
   - `items/stock-id.ts`: `isStockItemId` takes a `tome-ink-g*` id only when `farmByLine()`, and every `LINE_ITEMS` id
     when `farmByLine()` (they include R2's sixty).
4. **The recipes** (FL7, FL9, FL14), new `items/made-v4.ts`:
   - `RECIPE_V4`: `weapon-gem` 7 metal, `tome-ink` 7 vegetables, `armor-fittings` 2 wood, `accessory-setting` 10 fish,
     `jewel-planet` 10 stone, `jewel-moon` 4 stone, `branch-gem` 7 metal at G5 (a placeholder; R3 replaces it).
   - `madeRecipeV4(id)`: the refined id of the item's grade in its line (a jewel's grade is its node's) → the amount.
     `weapon-gem-g3` → `{ 'iron-ingot': 7 }`; `jewel-planet-3` → `{ 'cut-emerald': 10 }`; `jewel-moon-5` →
     `{ 'cut-philosophers-stone': 4 }`. It throws for an id that isn't a made item.
   - `madeRefinedV4(id)` (the amount), `madePlaceV4(line)` (`tome-ink` → `workbench`, the rest as `madePlace`).
   - `madeNameV4(id)`: "Arms Gem G3" for `weapon-gem`, "Tome Ink G3" for `tome-ink`, the rest as `madeName`.
5. **The places** (FL1–FL3, FL14), new `economy/places-v4.ts`:
   - `PlaceSpecV4 { id: PlaceIdV3; profession: ProfessionId; line: MaterialLine; kinds: readonly JobKind[]; made: readonly MadeLine[] }`.
   - `PLACES_V4`, in the Wilds' order:

     | Place | Profession (id stays) | Line | Kinds | Made |
     |---|---|---|---|---|
     | mine | mining | metal | gather | — |
     | forge | weapon-crafting | metal | refine, craft | weapon-gem, branch-gem |
     | forest | wood-chopping | wood | gather | — |
     | armorer | armor-crafting | wood | refine, craft | armor-fittings |
     | fields | farming | vegetables | gather | — |
     | workbench | processing | vegetables | refine, craft | tome-ink |
     | fishery | fishing | fish | gather | — |
     | charm-shop | accessory-crafting | fish | refine, craft | accessory-setting |
     | monster-den | hunting | stone | gather | — |
     | lapidary | jewel-crafting | stone | refine, cut | jewel-planet, jewel-moon |

   - `placeSpecV4(id)`, and `PROFESSION_NAMES_V4`: R2's names with `weapon-crafting` "Arms Crafting" and `processing`
     "Tome Crafting".
   - The trades, the trade gate (`work/kinds-v3/trade.ts`) and the open shop don't change: every place keeps its
     profession.
6. **Times** (FL10), `economy/pacing.ts`: `MAKE_SHARE_V4 = 0.75` beside `REFINE_SHARE`, and `makeMinutesV4(level,
   refined) = itemMinutes(level) × 0.75 × refined`. Gathering and processing keep `itemMinutes` and `refineMinutes`.
7. **The work rules** (FL2, FL6, FL10), new `work/kinds-v4/material.ts` and `make.ts`, and `work/env-v4.ts`:
   - **Gather:** at a place whose `kinds` include `gather`, a raw `LineItem` of the place's line; open when
     `env.exp.gradeOpen(…, grade)` holds (Craft Lv 5g − 4), else `workRefusal('grade', { level })`; `itemMinutes`;
     1–10.
   - **Process** (`refine`): at a place whose `kinds` include `refine`, a refined `LineItem` of the place's line, its
     input one of its raw pair; the same gate; `refineMinutes`; `REFINE_BATCHES` (×1 … ×40).
   - **Make** (`craft`, `cut`): at a place whose `kinds` include the request's kind, a made line in the place's `made`
     and live (`madeLive`); gate by the item's grade; minutes `makeMinutesV4(level, madeRefinedV4(id))`; inputs from
     `madeRecipeV4`; 1–10.
   - Anything else at a place: `workRefusal('not-here')`. The trade gate runs as in v3. Craft EXP: `jobExp(minutes)`.
   - `rpgWorkEnvV4(tier, context)`; `liveWorkEnv` returns it when `farmByLine()`, else what it returns today.
8. **Gear** (FL4, FL16), `economy/grades.ts`:
   - When `farmByLine()`, `gradeItemId` gives a weapon whose kind is an element (`isRpgElement(rpgWeaponKind(weapon))`)
     `tome-ink-g{n}`, and any other weapon `weapon-gem-g{n}`.
   - `raiseBlock`'s words follow the item: "Needs 1 Arms Gem G2", "Needs 1 Tome Ink G2", "Needs Arms Gems G2 and G3",
     "Needs Tome Ink G2 and G3".
   - `save/forge.ts`' raise, `save/upgrades.ts`' "Can upgrade" and `save/rift.ts`' climb back on Ascend all read
     `gradeItemId`, so they follow; check each with a test.
9. **Targets** (FL22), `save/targets.ts`, when `farmByLine()`:
   - `targetDemand`'s weapons go through `gradeItemId`, so an Arms weapon asks for Arms Gems and a Tome for Tome Ink;
   - `recipeOf` reads `madeRecipeV4` for a made item and `lineItem`'s pair for a refined one;
   - `facilityTargets`: a gathering place lists its line's raw items; a making place its made lines, then its line's
     refined items;
   - a line's `grade` is the item's grade.
10. **The Exchange** (FL12, FL13), `save/exchange.ts`, when `farmByLine()`:
    - stocked: every raw `LineItem` of grade 1–5 once `continentReached(world) >= 1`, of grade 6–10 once it is `>= 3`, in
      every tier's world;
    - `rawPriceV4(id, tier)`: 30 (G1–G5) or 80 (G6–G10) × the world's tier;
    - buying takes a raw `LineItem` only;
    - selling: raw 6 (G1–G5) or 16 (G6–G10), refined twice that, a made item 6 + 6 × its grade, × the tier.
11. **Place blurbs** (FL16), `hub/places.ts`: the FL16 blurbs when `farmByLine()`.
12. **The ledger** (FL11), new `economy/professions-v4.sim.ts` and its test:
    - the yardstick Uma holds a grade's 1.5 Arms Gems and 1.5 Tome Ink, 5 Armor Fittings, 1 Accessory Setting, and the
      jewels as R2's ledger (with `moon`, her moon's two);
    - each refined item costs one gather at its line's gathering place and a quarter gather at its making place; each
      made item ¾ gather a refined item at its making place;
    - reuse R2's `rosterRate`, `placeSupply`, `gradeDays` shapes (pass the hours in rather than copying them);
    - assert FL11's column within the R2 test's tolerances: 110 pieces, 520 refined (528), 783 h (795) ±1; every place
      75.3–82.8 h; trades Metal and Vegetables 158.1 h (20.2%), Wood and Fish 150.6 h (19.2%), Stone 165.7 h (21.2%);
      supply Stone 1.45, Metal and Vegetables 1.52, Wood and Fish 1.59; FORTY 1.27 a day (binds the magical trade),
      15.8 days a run; TWENTY 0.54; G10's party day 22.5.

## Tests (with the switch on, by argument or by mocking `save/version.ts`)

- **The catalog:** a hundred ids, each line's ten raw and ten refined in grade order, each `pair` the other form; every
  name and icon against uma-art's `items` atlas (as `items/materials.test.ts` checks R2's); R2's sixty ids are all line
  items.
- **Stock ids:** `tome-ink-g3` is a stock id only with the switch on; `trout` likewise.
- **Recipes:** every made item at every grade (`madeRecipeV4`), and the three examples in step 4.
- **Work:**
  - the Mine gathers Tin Ore at Craft Lv 6 and refuses it at Lv 5 (`grade`, level 6); it refuses Pine Log (`not-here`);
  - the Forge processes Copper Ore into Copper Ingot ×40, and refuses Pine Log (`not-here`) and a gather;
  - the Workbench processes only vegetables and makes Tome Ink G1 from 7 Chopped Carrot;
  - an Arms Gem G1 takes 7 × ¾ × 54 minutes at Craft Lv 1 (283.5) and pays `jobExp(283.5)`;
  - the Lapidary makes Planet Jewel III from 10 Cut Emerald at Craft Lv 21;
  - a Brawler at the Workbench is refused "Another trade" unless it's an open shop.
- **Gear:** a Katana raised with an Arms Gem, a Fire Tome with Tome Ink, each refused with the other's item and the FL16
  words; "Can upgrade" counts a Tome with Tome Ink in stock; Ascend gives back Tome Ink for a Tome's grades.
- **Targets:** a Mage target's three Tomes need Tome Ink, cascading to vegetable cuts at the Workbench and vegetables at
  the Fields; the Forge's list holds Arms Gems then Ingots.
- **The Exchange:** stocked grades by continent; prices × tier 2; selling a Tome Ink G3.
- **With the switch off:** every R2 test unchanged and green (don't edit them).

## Done when

- [ ] `pnpm lint && pnpm test && pnpm build` pass; the main JS number (budget 230 KB; the new modules stay out of the
      main bundle where R2's equivalents do).
- [ ] `farmByLine()` is false in the build; nothing live changes (no save, screen or rule moves).
- [ ] The tests above pass, and the ledger test asserts FL11.
- [ ] A D-row logs the build (fetch `main` first). Nothing from the original games in git.
- [ ] Deployed green, and https://uma-rpg.web.app/api/health shows the commit.

## Deliver

- A pull request from `feat/h109-farm-rules`, one commit: `feat(domain): the farm by line's rules, dark (H109)`.
- **ChatGPT merges it itself** once CI is green (the owner, 2026-10-26), then watches the deploy:
  `gh run watch <id> -R luismlorenzana/uma-rpg --exit-status`. Rerun a failed job once if it's the web suite's known
  flake (`Timeout calling "onTaskUpdate"`).
- **Flag it done:** a `docs(handoff): H109 done (D…)` commit deletes this file and adds a Done row to
  `docs/handoff/README.md`. H110 and H111 can then start, in parallel.
