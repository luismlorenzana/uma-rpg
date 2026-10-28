# Pacing model

> **Status: current through D237, 2026-10-28 (engine v18, save v31).** Timers, curves, prices and payouts outside the
> battle engine. The numbers live in `packages/domain/src/economy/pacing.ts`, the Exchange's in `save/exchange.ts`;
> tests pin what they mean in play time. Exact lists are generated in [the loop manual](../game/loops.md) and
> [materials](../game/materials.md) (D92). Change the numbers in the code, and update this page with the reason.

## Targets

- **Craft Level is a long loop (D96).** An Uma working without a break gains about two and a half levels a day early
  on, under two late, and reaches Lv 50 in about 25 days (735 hours of work at the places' ×1.25). Her level is the only
  speed (D139): grades open with it, and aptitude doesn't matter.
- **Every step is equal (FL28, D230).** Gathering a raw item, processing it, and each refined item in a made item take
  one step, so a trade's three places are equally busy, and a refined item costs 108 minutes of work at Craft Lv 1, 72
  at Lv 50.
- **The trades get the same work (FL9, D230).** Over a roster's classes each line carries about 100–110 refined items a
  maxed Uma (Stone the most, 118 with her moon), so no trade's Umas level slower than another's.
- **Jobs come in broad sizes (D233):** from about half an hour to about 8 hours, so the longest spans a night.
- **The roster works in parallel.** One party of five fights while dozens of Umas work at once (fifteen places of four
  slots, twelve a trade), so the roster's best Craft Levels run ahead of the fights even though each Uma levels slowly.
- **Fights are the main Laurel source;** selling stock pays a little (D62). Laurels buy shortcuts: a Speed Ticket is 10
  Laurels for 30 minutes, so an hour of any job costs 20 Laurels, two and a half Sweeps of a Tier 1 regular stage below
  Lv 41 (8 Laurels each).
- **Extra Stats and gear each add a real share of power** (SB1): foes are budgeted for a party built on curve
  ([stat balance](tier-rework/stat-balance.md)).

## Craft Level (D96, D144, FL28, D233)

| Rule | Value |
|---|---|
| The profession | Craft Level, per Uma, Lv 1–50: every job in the Wilds' fifteen places (D144) |
| EXP to the next level | `1,425 + 15 × level`: 12 hours of work at Lv 1, 18 at Lv 49 (Lv 46: 79,650 EXP in all; Lv 50: 88,200, 735 hours) (D96) |
| Grade gate | Grade g opens at Lv `5g − 4` (1, 6, 11 … 46), to gather, to process and to make |
| EXP | **2 per minute** of the job at her level, before the place's speed, whatever it makes |
| One step (`stepMinutes`) | 36 minutes at Lv 1, falling evenly to 24 at Lv 50: gather one raw item, process one, or one refined item of a make |
| Make one item | one step per refined item in it: an Arms Gem or Tome Ink 7, Armor Fittings 2, an Accessory Setting or a Planet Jewel 10, a Moon Jewel 4 |
| One job (`JOB_SIZES`, `jobSizes`) | ×1, ×2, ×3, ×5, ×10, ×15 or ×20 to gather or process; a make the sizes up to about 20 steps (Armor Fittings ×10, a Moon Jewel ×5, an Arms Gem or Tome Ink ×3, an Accessory Setting or a Planet Jewel ×2) |
| Places | fifteen, each four slots at ×1.25 from day one; no upgrades (PP4) |

Working nonstop, an Uma opens G10 (Craft Lv 46) on day 22.1 and reaches Lv 50 on day 24.5.

## Laurels and the Exchange

| Earn | Laurels (× tier) |
|---|---|
| Regular fight | 10 |
| Sub-boss | 25 |
| Vanguard (a capital Finals' sub-boss) | 30 |
| Boss | 50 |
| An Uma ascending into the world | 1,000 |

First clears multiply a stage's Laurels by three. Replays and Sweeps pay a rounded quarter of that; Lv 41–50 adds ×4, and
stages in waves ×1.5 (D79, D82, D91). These are base payouts, not the amount shown for a first clear.

| Buy | Laurels |
|---|---|
| Raw item, G1–G5, after the tier's first win | 30 × tier |
| Raw item, G6–G10, after a win on the tier's continent 3 | 80 × tier |
| Speed Ticket: 30 minutes off a running job (D74) | 10 |
| Sweep Ticket: one Sweep of a cleared regular stage or a won Echo (D79) | 15 |

| Sell at the Warehouse (D62, FL13) | Laurels each, × tier |
|---|---|
| Raw item, G1–G5 · G6–G10 | 6 · 16 |
| Refined item | twice its raw item |
| Made item of grade g (a jewel's grade is its node's) | `6 + 6g` |

- Finishing a job takes one Speed Ticket per started 30 minutes left (D74).
- A Class Manual costs 1,000 Class Marks, not Laurels, and gives 1,000 Class EXP.
- An Uma ascending into a world also brings 5 Speed Tickets.

## Extra Stats and gear

- **One point** is +1 to its stat (+5 HP), 0.6% evasion for Speed, or a 0.4 head start on the Limit Break gauge (12 to
  fill). Only her moon gives Speed or Limit.
- **A node** gives the Planet's 1, 2, 4, 6, 8 points to all six core stats, a moon's 2 … 10 to its pair, her moon's 4 and
  8; × 1, 1.8 and 2.6 in Tiers 1, 2 and 3. Every open node counts.
- **Gear** by grade: a weapon's Might, armor's stat and offense, the accessory families' base forms, all × the tier
  (Feet Speed and the Bell's and Insignia's shares don't scale). The tables are in
  [materials](../game/materials.md#gear).

## Recipes (FL7, FL9)

| Output | Inputs |
|---|---|
| Refined item | 1 raw item of its line and grade |
| Arms Gem or Tome Ink, grade g | 7 refined items of its line (Ingots or vegetable cuts), grade g |
| Armor Fittings, grade g | 2 Planks, grade g |
| Accessory Setting, grade g | 10 Fillets, grade g |
| Planet Jewel n | 10 cut stones, grade 2n − 1 |
| Moon Jewel n | 4 cut stones, grade 2n |

No recipe takes Laurels. Complete recipes are generated in [materials](../game/materials.md).

## The profession ledger

`economy/professions-v4.sim.ts` (H109, updated by H114; FL11, FL30): one maxed Uma at Craft Lv 25's step, before the
places' ×1.25. Her weapons are 1.5 Arms and 1.5 Tomes a grade (49% of the outfits' weapon slots are Arms on D220's
defaults); a day is 24 hours of every slot at ×1.25.

| Measure | Value |
|---|---|
| One maxed Uma | 110 made items, 520 refined (528 with her moon), 783.2 hours (795.2) |
| By line | Metal 105, Vegetables 105, Wood 100, Fish 100, Stone 110 refined items |
| Each trade | Metal and Vegetables 158.1 hours (20.2%), Wood and Fish 150.6 (19.2%), Stone 165.7 (21.2%) |
| Each place, maxed Umas a day | Wood's and Fish's 2.39, Metal's and Vegetables' 2.28, Stone's 2.17 |
| Forty Umas (9 · 8 · 9 · 7 · 7: Metal, Wood, Vegetables, Fish, Stone) | 1.27 maxed a day (Stone's seven bind): a party in 3.9 days, a run of twenty in 15.8 |
| Twenty Umas (5 · 4 · 5 · 3 · 3) | 0.54 maxed a day (Stone's three bind): a party in 9.2 days, a run of twenty in 36.8 |

A trade of more than eight Umas puts up to twelve to work (its three places' slots), so a large roster gears up faster
than one bound by its trades' head counts.

| Grade | Opens (Craft Lv 5g − 4), day | The fighting party holds it (forty Umas) | A run of twenty holds it |
|---|---|---|---|
| G1 | 0.0 | 0.4 | 1.6 |
| G2 | 2.0 | 2.4 | 3.6 |
| G3 | 4.2 | 4.6 | 5.8 |
| G4 | 6.4 | 6.8 | 8.0 |
| G5 | 8.8 | 9.2 | 10.4 |
| G6 | 11.3 | 11.6 | 12.8 |
| G7 | 13.8 | 14.2 | 15.4 |
| G8 | 16.5 | 16.9 | 18.1 |
| G9 | 19.3 | 19.6 | 20.8 |
| G10 | 22.1 | 22.5 | 23.7 |

Run `SIM=1 pnpm --filter @rpg/domain exec vitest run src/economy/professions-v4.sim.test.ts` to print it; its tests pin
these numbers.

## The fights' pace

H14's deterministic victory ledger (`economy/pacing.sim.ts`): five fresh Umas, one complete region whose level range
contains the party's level, then replays of its last regular stage until the next range opens. Unused regions stay
fresh for other parties. It stops at Lv 50, even mid-region. Fight durations are the packet's assumptions (40 seconds a
regular fight, 70 an elite, 100 a boss), not measured play. Uma EXP and Class EXP are per Uma, Laurels and Class Marks
the party's.

| Band | Wins (first/replay) | Fight min | Uma EXP | Class EXP | Laurels | Class Marks |
|---|---|---|---|---|---|---|
| 1–10 | 25 (24/1) | 19.7 | 2100 | 4200 | 1268 | 0 |
| 11–20 | 24 (24/0) | 19.0 | 3702 | 7404 | 1260 | 0 |
| 21–30 | 24 (24/0) | 19.0 | 5311 | 10622 | 1260 | 0 |
| 31–40 | 24 (24/0) | 19.0 | 6925 | 13850 | 1260 | 26490 |
| 41–50 | 22 (22/0) | 16.2 | 7545 | 15090 | 3840 | 37725 |

Total: **119 wins** (118 first, 1 replay), **92.8 fight minutes**, five Lv 50 Umas, each class at Rank 50; 8,888 Laurels
and 64,215 Class Marks banked, no Manuals bought. D71's four-hour target (180–300 minutes) is **missed, under**: the test
keeps it as an explicit expected failure until tuning brings it in range. No game number was retuned for it.

The ledger runs with the engine switch at 16 and the save chain to v27 (`pacing.sim.test.ts` mocks both), so its rank and
gear sums are the old economy's; the columns above follow rules R2 didn't change. Run
`SIM=1 pnpm --filter @rpg/domain exec vitest run src/economy/pacing.sim.test.ts` to print it.

It assumes victory, not that untrained Umas win every fight: combat win rates live in `world/balance-v18.test.ts`. It
models no MP spending, collection waits or job waits; classes stay fixed. Springs and recharge waits are tested
separately with dry-MP input.
