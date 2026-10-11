# H15 — The capitals' Finals

**Priority P3 · ChatGPT · uma-rpg · M.** Easier after H09 (escorts fit better with eight-foe stages), but works on
today's engine.

## Why

Each continent's capital is a placeholder line: "the scenario's Finals arrive in a later step". The Finals are what
give each scenario its identity (D48): three authored routes per scenario, each a vanguard and then a champion. The
data already exists, ported from uma-racer and unused since the world map replaced chapters.

## Context

- **Data:** `packages/domain/src/rpg/campaign/finals.ts`. `RPG_FINALS` and `rpgFinals(order)` give a `title` and three
  `routes`. Each route has a `name`, a `line`, a `vanguard` and a `champion`, and each of those has an `element` and two
  escorts with roles and elements. Names and lines are original. The faces come from the private PriConne cast.
- **How chapters built Finals nodes:** `rpg/campaign/chapters.ts` (`rpgFinals`, vanguard and champion nodes, `rpgFoe`
  in `enemies.ts`).
- **The world:**
  - `world/world.ts` has `worldContinent`, `regionChapter` and stage ids `<region>-s<n>`;
  - the capital row in `docs/design/world/regions.md`;
  - the placeholder in `apps/web/src/places/scenario-gate/ScenarioGatePage.tsx` (`ContinentMap`'s last paragraph).
- **Rewards:** `save/battle.ts` `stageLaurels`; tokens via `rollTokens` (vanguard and boss kinds exist in
  `TOKEN_DROPS`); first clears ×3.

## Do

1. **Domain:**
   - A capital per continent is a region-like chapter, `capitalChapter(continent, cast)`: Lv = the band's tenth level.
   - Three routes of two stages: the vanguard as a sub-boss, then the champion as a boss, each with its two escorts.
   - Stage ids `<continent>-capital-r<route>-s<1|2>`, stable.
   - A route's champion opens when its vanguard is cleared. All three routes are open from the start, like the rest of
     the world (D72).
2. **Rewards:** the champion pays as a boss and the vanguard as a sub-boss, with replays at 25% as everywhere.
3. **Screens:**
   - The capital row on the continent opens a capital screen: the title, three route cards with name, line, elements
     and progress, and each card's two stages, opening the usual stage sheet.
   - Reuse `RegionMap`'s parts.
4. **Docs:** update the world README's "Exploring" and `regions.md`'s capital row. Claude logs the decision on merge.

## Done when

- Domain tests:
  - three routes per continent;
  - ids stable;
  - the champion locked until the vanguard is won;
  - rewards as a sub-boss and a boss;
  - a Lv10 on-time party wins the URA Finals' routes with the shared auto policy (H02's `autoAction`, or `balance.test.ts`'s `play` before it lands).
- In the browser: a capital's three routes, a vanguard fight won, its champion opened.
- `pnpm lint && pnpm test && pnpm build` pass.

## Deliver

A pull request on `feat/capital-finals`, titled `feat(world): the capitals' Finals (H15)`.
