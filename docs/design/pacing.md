# Pacing model

> **Status: current (2026-10-10, D54; items rebalanced by D65).** Every timer, curve, price and payout outside the battle engine. The numbers
> live in `packages/domain/src/economy/pacing.ts`; tests pin what they mean in play time. Change them there, and update
> this page with the reason.

## Targets

- **Items are few and slow, and every recipe needs about one of each (D65).** A grade-1 item takes an hour, a grade-10
  one most of a night; a day of single items keeps you progressing, with one collect per job instead of a stream of them.
- One Uma reaches **grade 10 in a profession after about 59 hours of work at G aptitude, 30 at A** (Lv46), and the
  profession cap (Lv50) after 69 hours at G. With a few check-ins a day and jobs running overnight, a dedicated Uma gets
  there in one to two weeks; aptitude decides who's worth specializing.
- Battles stay the only Laurel source, and Laurels buy shortcuts, never the whole game: an hour of work costs about
  two fights, whether bought as an item or as a Rush.
- Extra Stats and gear each add about the same share of power (§7.3), small per point.

## Professions (design §4, §8.5)

| Rule | Value |
|---|---|
| Verticals | Farm Level, Craft Level, per Uma, Lv1–50 each, one shared curve |
| EXP to the next level | `20 + 6 × level` (Lv46: 7,110 EXP in all; Lv50: 8,330) |
| Grade gate | Grade k opens at Lv `5k − 4` (1, 6, 11 … 46) |
| EXP | **2 per base minute** of the job, whatever it makes (parity) |
| Gather or refine one item | `30 + 30 × grade` base minutes (1 hour at grade 1, 5½ at grade 10) |
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
| Stage sub-boss | 25 |
| Finals vanguard | 30 |
| Finals champion | 50 |

| Buy | Laurels |
|---|---|
| Raw item of grade g | `10 + 10g` (20 at grade 1, 110 at grade 10) |
| Rush Ticket: finishes up to an hour of a running farm job | 20 |
| Sweep Ticket: completes a beaten regular fight (EXP and Shards, no Laurels) | 15 |

| Sell at the Warehouse (D62) | Laurels each |
|---|---|
| Raw item of grade g | `2 + 2g` |
| Refined item of grade g | `4 + 4g` |
| Dish or unbound gear of grade g | `6 + 6g` |

- A job's Rush costs one ticket per started hour left. Training (S5) can't be rushed.
- A chapter with at least one won fight stocks its grade pair: chapter n of a tier, grades `2n − 1` and `2n`.

## Learning District (S5)

| Track | Base hours to the next rank (D68) | From the first rank to the top, at G |
|---|---|---|
| Class proficiency, ranks 1–6 | 6 each, plus a Class Promotion Token of the band (D67) | 30 h (15 h at A) |
| Gear mastery, ranks 1–10 | 3 each | 27 h (13½ h at A) |

Running style sets class speed and distance sets mastery speed, with the same shares as professions.

## Extra Stats and gear (S6, S7)

- **One point** is 1.5% of its stat (HP, MP, ATK, M.ATK, DEF, M.DEF), 0.6% evasion for Speed, or a 0.4-charge head
  start on the Limit Break gauge (12 to fill).
- **Active Extra Stats nodes:** `5 + ⌊Uma level / 2⌋` (5 at Lv1, 30 at Lv50).

## Recipes (D65)

| Output | Inputs |
|---|---|
| Refined item | 1 raw item of its pair |
| Planet dish of grade g | 1 refined star ingredient, plus a grade-⌈g/2⌉ side from grade 4 and a second from grade 8 |
| Duo dish (grades 3, 7) | 1 refined item of each of its two families, plus a side at grade 7 |
| Feast (grades 4, 6, 8, 10) | 1 refined item of each farming family |
| Gear of grade g | 1 refined main material and 1 refined accent material, plus an extra from grade 4 and a second from grade 8 |

## Tokens (D67)

Fights drop them; promotions, crafting and cooking spend them. Kinds, drops, odds and swaps are in
[loop.md](loop.md).
