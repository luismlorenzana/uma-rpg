# Pacing model

> **Status: current through D144, 2026-10-16.** Timers, curves, prices and payouts outside the battle engine. Exact
> lists are generated in [the loop manual](../game/loops.md) (D92). The numbers
> live in `packages/domain/src/economy/pacing.ts`; tests pin what they mean in play time. Change them there, and update
> this page with the reason.

## Targets

- **Items are few and slow (D65, D139).** Ten items take 9 hours at Lv1 and 6 at Lv50, at any grade: a job a
  morning and one a night, and every Uma of a level finishes together, with one collect per job instead of a stream.
- **Craft Level is a long loop (D96).** An Uma working without a break gains about 2 levels a day early on, a little
  fewer as levels climb, and reaches Lv50 in about a month (24 days at a level-3 facility). Aptitude no longer
  matters (D139); level is the bottleneck, and grades open with it. (D54's curve took 69 hours of work: an Uma
  reached Lv27 in two batches.)
- **The roster works in parallel.** One party of five fights while dozens of Umas work the facilities at once (up to
  five per facility, 55 slots at full upgrade, D144), so the roster's best Craft Levels run ahead of the fights even
  though each Uma levels slowly. Pace Craft Level per Uma; gear and Star Gem grades won't trail the battles.
- Fights are the main Laurel source; selling stock also pays Laurels (D62). Laurels buy shortcuts: an hour of base work costs about
  two fights, whether bought as an item or as Time Tickets.
- Extra Stats and gear each add a real share of power (D141): a node is worth its grade, a weapon's Might about 6% a grade at its tier on its
  hits, and foes are budgeted for a party built on curve ([combat balance](combat-balance.md)).

## Craft Level (design §4, §8.5, D144)

| Rule | Value |
|---|---|
| The profession | Craft Level, per Uma, Lv1–50: every Wilds job (D144) |
| EXP to the next level | `1,425 + 15 × level`: 12 hours of work at Lv1, 18 at Lv49 (Lv46: 79,650 EXP in all; Lv50: 88,200, 735 hours) (D96) |
| Grade gate | Grade k opens at Lv `5k − 4` (1, 6, 11 … 46) |
| EXP | **2 per minute** of the job at her level, before the facility's speed, whatever it makes (parity) |
| Gather one item | Any grade: 54 minutes at Lv1, falling evenly to 36 at Lv50 (ten in 9 hours, then 6) (D139) |
| Refine one item | a quarter of that: 13½ minutes at Lv1, 9 at Lv50 (D101) |
| Craft or cut one output (S7, D144) | two items' worth: 108 minutes at Lv1, 72 at Lv50 |
| One job | 1–10 items; refining ×1, ×4, ×8, ×20 or ×40 (D139; saves from before D65 may hold up to 50) |

## Facilities (§9)

| Level | Slots | Speed | Upgrade cost |
|---|---|---|---|
| 1 | 3 | ×1 | — |
| 2 | 4 | ×1 | 150 Laurels + 1 refined grade-2 item of each of its two families |
| 3 | 5 | ×1.25 | 500 Laurels + 2 refined grade-5 items of each of its two families |

D144 raised the slots from 2 / 3 / 3 when the eleven Wilds facilities took on all the work. A site's two families are
its own and its gear-recipe partner (the Mine: Ores and Crystals). Buildings (the Workbench, Forge, Lapidary, class halls
and armories) take Stones and Woods: blocks and planks.

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
| Star Gem or unbound gear of grade g | `6 + 6g` |

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

- **One point** is +1 to its stat (+5 HP), 0.6% evasion for Speed, or a 0.4-charge head start on the Limit Break
  gauge (12 to fill). A node gives its grade in points (D141).
- **Active Extra Stats nodes:** `5 + ⌊Uma level / 2⌋` (5 at Lv1, 30 at Lv50).

## Recipes (D65, D86, D94)

| Output | Inputs |
|---|---|
| Refined item | 1 raw item of its pair |
| Moon gem of grade g | 1 refined item of its stat's family, plus a grade-⌈g/2⌉ side from grade 4 and a second from grade 8 |
| Bridge gem (grades 3, 7) | 1 refined item of each of its two families, plus a side at grade 7 |
| Sun gem (grades 4, 6, 8, 10) | 1 refined item of every family |
| Gear of grade g | 2 same-grade refined items of its pair for the grade (D125, D139); no token |

No recipe takes a token (D105). Complete recipes are generated in [materials](../game/materials.md).

## Tokens (D67, D93, D94)

Retired by D105. Fights and Sweeps dropped them; class/gear-level training spent them. Kinds, wave drops, odds and Laurel trading are in
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

| Grade | Refined / twelve-piece set | Raw capacity* | Fresh G1 output |
|---|---|---|---|
| 2 | 24 | 0.38 | 0 |
| 4 | 24 | 0.39 | 0 |
| 6 | 24 | 0.42 | 1 |
| 8 | 24 | 0.46 | 0 |
| 10 | 24 | 0.43 | 0 |

Total: **119 wins** (118 first, 1 replay), **92.8 fight minutes**, five Lv50 Umas.
Representative Brawler: Class Rank 50; five Weapon Ranks 10/10/10/10/10; five Armor Ranks 10/10/10/10/10.
Banked: 8888 Laurels, 90550 Gear Marks and 64215 Class Marks. No Manuals bought, no class switching, no tokens.
Four-hour target (180–300 min): **under**. No game number retuned.
*One slot, facility Lv1, a worker at the grade's unlock level (speed is set by level, D139); partial output is unfinished. A fresh worker finishes 1 grade-1 raw items and ends at Craft Lv1. Refining and crafting need additional time.
<!-- /live -->

Run `SIM=1 pnpm --filter @rpg/domain exec vitest run src/economy/pacing.sim.test.ts` to print the same ledger.
`pnpm docs:update` renders every exact total above; CI rejects a stale block. D82’s token budget is retired by D105.
The four-hour target remains an explicit expected-failure assertion until tuning brings it within the target range.

This assumes victory, not that untrained Umas win every fight. Combat win rates live in `world/balance.test.ts`.
It models no MP expenditure, collection waits or job waits. Classes stay fixed and weapon EXP is shared evenly, as a
Sweep; excess rank EXP banks as Marks. It buys no Manuals and silently trains nothing. Springs and recharge waits
are tested separately with dry-MP input. Material capacity is one slot, not a developed roster’s parallel throughput.
