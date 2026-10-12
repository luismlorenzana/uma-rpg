# Pacing model

> **Status: current through D96, 2026-10-12.** Timers, curves, prices and payouts outside the battle engine. Exact
> lists are generated in [the loop manual](../game/loops.md) (D92). The numbers
> live in `packages/domain/src/economy/pacing.ts`; tests pin what they mean in play time. Change them there, and update
> this page with the reason.

## Targets

- **Items are few and slow (D65).** A grade-1 item takes an hour, a grade-10
  one most of a night; a day of single items keeps you progressing, with one collect per job instead of a stream of them.
- **Professions are a long loop (D96).** An Uma working without a break gains about 4 levels a day at A aptitude (5 in a
  level-3 facility), 3 at C and 2 at G, a little fewer as levels climb. Lv50 takes about 15 days at A and a month at
  G; grade 10 (Lv46) a day or two sooner. Aptitude decides who's worth specializing. (D54's curve took 69 hours of
  work at G: an Uma reached Lv27 in two batches.)
- **The roster works in parallel.** One party of five fights while dozens of Umas work the facilities at once (up to
  three per facility), so the roster's best Farm and Craft Levels run ahead of the fights even though each Uma levels
  slowly. Pace professions per Uma; gear and dish grades won't trail the battles.
- Fights are the main Laurel source; selling stock also pays Laurels (D62). Laurels buy shortcuts: an hour of base work costs about
  two fights, whether bought as an item or as Time Tickets.
- Extra Stats and gear each add about the same share of power (§7.3), small per point.

## Professions (design §4, §8.5)

| Rule | Value |
|---|---|
| Verticals | Farm Level, Craft Level, per Uma, Lv1–50 each, one shared curve |
| EXP to the next level | `1,425 + 15 × level`: 12 base hours of work at Lv1, 18 at Lv49 (Lv46: 79,650 EXP in all; Lv50: 88,200, 735 base hours) (D96) |
| Grade gate | Grade k opens at Lv `5k − 4` (1, 6, 11 … 46) |
| EXP | **2 per base minute** of the job, whatever it makes (parity) |
| Gather one item | `30 + 30 × grade` base minutes (1 hour at grade 1, 5½ at grade 10) |
| Refine one item | a quarter of that: 15 minutes at grade 1, 82½ at grade 10 (D101) |
| Cook or craft one output (S6, S7) | two items' worth: `2 × (30 + 30 × grade)` |
| Aptitude | Real time = base × share: A (and S) 50%, B 58%, C 67%, D 75%, E 83%, F 92%, G 100%. Turf sets Farm Level, Dirt sets Craft Level (§4.1) |
| One job | 1–10 items (saves from before D65 may hold up to 50) |

## Facilities (§9)

| Level | Slots | Speed | Upgrade cost |
|---|---|---|---|
| 1 | 2 | ×1 | — |
| 2 | 3 | ×1 | 150 Laurels + 1 refined grade-2 item of each of its two families |
| 3 | 3 | ×1.25 | 500 Laurels + 2 refined grade-5 items of each of its two families |

A site's two families are its own and its mirror on the other side (Fields: Grains and Hides & Scales). Buildings (the
Pantry, Workbench, Kitchen, Forge, class halls and armories) take Stones and Woods: blocks and planks.

## Laurels and the Exchange (§11)

| Earn | Laurels (× tier) |
|---|---|
| Regular fight | 10 |
| Region elite (`sub-boss`) | 25 |
| Vanguard (campaign helper, capital Finals not yet built) | 30 |
| Region boss | 50 |

First clears multiply these by three. Replays and Sweeps pay a rounded quarter of that; Lv41–50 adds ×4, and
stages in waves add ×1.5 (D79, D82, D91). These are base payouts, not the amount shown for a first clear.

| Buy | Laurels |
|---|---|
| Raw item of grade g | `10 + 10g` (20 at grade 1, 110 at grade 10) |
| Time Ticket: 30 minutes off any running job or training (D74) | 10 |
| Sweep Ticket: replays a beaten regular stage (a quarter of its first clear, D79) | 15 |

| Sell at the Warehouse (D62) | Laurels each |
|---|---|
| Raw item of grade g | `2 + 2g` |
| Refined item of grade g | `4 + 4g` |
| Dish or unbound gear of grade g | `6 + 6g` |

- Finishing a job or training takes one Time Ticket per started 30 minutes left (D74).
- A continent with at least one won stage stocks its grade pair: continent n of a tier, grades `2n − 1` and `2n` (D72).

## Learning District (S5)

| Track | Base hours to the next rank (D68) | From the first rank to the top, at G |
|---|---|---|
| Class rank, 1–5 | 6 each, plus one Promotion Token per step (D77) | 24 h (12 h at A) |
| Weapon Level per class, Armor Level, Accessory Level, 1–10 | 3 each, plus one Mastery Token per step (D94) | 27 h (13½ h at A) |

Running style sets a class hall's speed (rank and Weapon Level); her best distance sets the Armory's, her best
running style the Jeweler's; the same shares as professions.

Gear-level training from Level L takes Mastery band `⌈L/2⌉`, so a whole track uses nine tokens. The Forge takes none
(D94). Class steps use the band of the rank they leave. Training grants no profession EXP.

## Extra Stats and gear (S6, S7)

- **One point** is 1.5% of its stat (HP, MP, ATK, M.ATK, DEF, M.DEF), 0.6% evasion for Speed, or a 0.4-charge head
  start on the Limit Break gauge (12 to fill).
- **Active Extra Stats nodes:** `5 + ⌊Uma level / 2⌋` (5 at Lv1, 30 at Lv50).

## Recipes (D65, D86, D94)

| Output | Inputs |
|---|---|
| Refined item | 1 raw item of its pair |
| Planet dish of grade g | 1 refined star ingredient, plus a grade-⌈g/2⌉ side from grade 4 and a second from grade 8 |
| Duo dish (grades 3, 7) | 1 refined item of each of its two families, plus a side at grade 7 |
| Feast (grades 4, 6, 8, 10) | 1 refined item of each farming family |
| Gear of grade g | 4 same-grade refined items, one per prescribed family; no token |

Planet dishes take one Cooking Token, Duos two (one per paired stat), and Feasts eight, all of the grade's band
(D67). Ingredient counts and complete recipes are generated in [materials](../game/materials.md).

## Tokens (D67, D93, D94)

Fights and Sweeps drop them; class/gear-level training and cooking spend them. Kinds, wave drops, odds and Laurel trading are in
[loop.md](loop.md).

## Simulated

H14’s deterministic victory ledger follows the current rules (D97, D101–D105): five fresh Umas, one complete region
whose level range contains the party’s level, then replays of its last regular stage until the next range opens.
Unused regions remain fresh for other parties. It stops immediately at Lv50, even mid-region. Fight durations are
packet assumptions: 40 seconds regular, 70 elite, 100 boss, not measured play times.

<!-- live:pacing-sim -->
| Band | Wins (first/replay) | Fight min | Uma EXP | Class EXP | Weapon EXP | Armor EXP | Laurels | Gear / Class Marks |
|---|---|---|---|---|---|---|---|---|
| 1–10 | 25 (24/1) | 19.7 | 2100 | 4200 | 10500 | 10500 | 1268 | 0 / 0 |
| 11–20 | 24 (24/0) | 19.0 | 3702 | 7404 | 18510 | 18510 | 1260 | 0 / 0 |
| 21–30 | 24 (24/0) | 19.0 | 5311 | 10622 | 26555 | 26555 | 1260 | 0 / 0 |
| 31–40 | 24 (24/0) | 19.0 | 6925 | 13850 | 34625 | 34625 | 1260 | 0 / 26490 |
| 41–50 | 22 (22/0) | 16.2 | 7545 | 15090 | 37725 | 37725 | 3840 | 90550 / 37725 |

EXP is per Uma; Weapon/Armor EXP sums her five bars. Currency and Marks are the whole party’s stock.

| Grade | Refined / ten-piece set | Raw capacity Farm / Wilds* | Fresh G1 output Farm / Wilds |
|---|---|---|---|
| 2 | 40 | 0.44 / 0.44 | 0 / 0 |
| 4 | 40 | 0.25 / 0.25 | 1 / 1 |
| 6 | 40 | 0.18 / 0.18 | 0 / 0 |
| 8 | 40 | 0.14 / 0.14 | 1 / 1 |
| 10 | 40 | 0.10 / 0.10 | 1 / 1 |

Total: **119 wins** (118 first, 1 replay), **92.8 fight minutes**, five Lv50 Umas.
Representative Brawler: Class Rank 50; five Weapon Ranks 10/10/10/10/10; five Armor Ranks 10/10/10/10/10.
Banked: 8888 Laurels, 90550 Gear Marks and 64215 Class Marks. No Manuals bought, no class switching, no tokens.
Four-hour target (180–300 min): **under**. No game number retuned.
*One slot at A, facility Lv1, conditional on the worker already meeting the grade gate; partial output is unfinished. Fresh A workers finish 3/3 grade-1 raw items and end at Farm/Craft Lv1. Refining and crafting need additional time.
<!-- /live -->

Run `SIM=1 pnpm --filter @rpg/domain exec vitest run src/economy/pacing.sim.test.ts` to print the same ledger.
`pnpm docs:update` renders every exact total above; CI rejects a stale block. D82’s token budget is retired by D105.
The four-hour target remains an explicit expected-failure assertion until tuning brings it within the target range.

This assumes victory, not that untrained Umas win every fight. Combat win rates live in `world/balance.test.ts`.
It models no MP expenditure, collection waits or job waits. Classes stay fixed and weapon EXP is shared evenly, as a
Sweep; excess rank EXP banks as Marks. It buys no Manuals and silently trains nothing. Springs and recharge waits
are tested separately with dry-MP input. Material capacity is one slot, not a developed roster’s parallel throughput.
