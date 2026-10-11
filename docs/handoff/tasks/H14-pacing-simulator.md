# H14 — A pacing and economy simulator, Lv1 to 50

**Priority P3 · ChatGPT · uma-rpg · M.**

## Why

The economy is a first pass, pinned by tests but barely played. Its parts:

- EXP per stage;
- Laurels, with first clears ×3 (D27), replays at 25% (D79) and late Laurels ×4 from Lv41 (D82);
- token drops by band (D82's budget);
- token trading (D80);
- Time and Sweep Tickets (D74);
- job and training times;
- material throughput against D86's recipes.

The owner's balance questions are all about time: how long to Lv50, how many ranks, how much Laurels to spare. A
simulator that plays the loop on paper answers them before hours of real play, and backs Claude's retunes.

## Context

- **Rules in code** (`packages/domain/src/economy/`):
  - `pacing.ts`: `REPLAY_SHARE`, `FIRST_CLEAR_LAURELS`, `LATE_LAURELS`, EXP curves;
  - `tokens.ts`: `TOKEN_DROPS`, `rollTokens`, `tokenSellPrice`, `tokenBuyPrice`, `PROMOTION_BANDS`;
  - `training.ts`: ranks, `CLASS_MAX_RANK` 5, `depthsOpen`;
  - `gear.ts`: recipes;
  - `dishes.ts`;
  - `work.ts` and facility files: job sizes and times.
- **Elsewhere:** `save/battle.ts` (`stageLaurels`), `save/exchange.ts` (prices, sweeps) and `world/world.ts` (stages per
  level, stage kinds).
- **Existing tests to learn from:** `economy/tokens.test.ts` (the D82 budget: an Uma's tokens Lv1→50), `world/balance.test.ts`
  (battle win rates, `SIM=1`) and `economy/materials.test.ts` (family symmetry).
- **Design targets:**
  - `docs/design/pacing.md` and `docs/design/loop.md`;
  - D71: Lv1→50 in about 4 hours of fighting, about 20 parties to 100 hours;
  - D82: one Uma alone earns two full class masteries, two full weapon ranks and two full extra skill ranks over Lv1→50,
    and Lv41–50 Laurels fund about a third class.

## Do

1. **`packages/domain/src/economy/pacing.sim.test.ts`**, skipped unless `SIM=1`, like balance.test. It plays one party
   of five fresh Umas from Lv1 to 50 with a simple policy:
   - first clears in level order until the frontier;
   - replays at the frontier when short of EXP;
   - Springs as needed;
   - every token and Laurel banked.

   Use the game's own functions, not copies of the numbers.
2. **Print a table per level band** (1–10, …, 41–50):
   - stages fought, first clears and replays, and fight minutes at an assumed 40 s a regular stage, 70 s an elite and
     100 s a boss;
   - EXP;
   - Laurels earned and the ranks they'd buy at Exchange prices;
   - tokens by band, and the class, weapon and skill ranks they fund;
   - materials needed for one full set of gear at the band's grade, against what one Farm and one Wilds slot produce in
     the same wall-clock time.
3. **Always-on assertions** for the design targets that are numbers:
   - Lv1→50 fight time within ±25% of 4 hours;
   - D82's token budget, already tested, asserted again here through the full loop.
4. **A short `docs/design/pacing.md` section**, "Simulated", with the table and a note per target: met, over, or under.
   It proposes nothing; Claude and the owner retune from it.

## Done when

- `pnpm --filter @rpg/domain test` passes, and `SIM=1 npx vitest run src/economy/pacing.sim.test.ts` prints the table
  in under a minute.
- The assertions hold on today's numbers. If one doesn't, say so in the pull request rather than changing a rule.

## Deliver

A pull request on `feat/pacing-sim`, titled `test(economy): Lv1–50 pacing simulator (H14)`, with the table in the
body.
