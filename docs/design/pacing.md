# Pacing model

> **Status: current (2026-10-10, D54).** Every timer, curve, price and payout outside the battle engine. The numbers
> live in `packages/domain/src/economy/pacing.ts`; tests pin what they mean in play time. Change them there, and update
> this page with the reason.

## Targets

- A grade-1 job is a few minutes; a grade-10 batch is an overnight job.
- One Uma reaches **grade 10 in a profession after about 59 hours of work at G aptitude, 30 at A** (Lv46), and the
  profession cap (Lv50) after 69 hours at G. With a few check-ins a day and jobs running overnight, a dedicated Uma gets
  there in one to two weeks; aptitude decides who's worth specializing.
- Battles stay the only Laurel source, and Laurels buy shortcuts, never the whole game: a raw item costs about a
  fight's Laurels, and an hour of work costs two fights.
- Extra Stats and gear each add about the same share of power (§7.3), small per point.

## Professions (design §4, §8.5)

| Rule | Value |
|---|---|
| Verticals | Farming & Cooking, Gathering & Crafting, per Uma, Lv1–50 each, one shared curve |
| EXP to the next level | `20 + 6 × level` (Lv46: 7,110 EXP in all; Lv50: 8,330) |
| Grade gate | Grade k opens at Lv `5k − 4` (1, 6, 11 … 46) |
| EXP | **2 per base minute** of the job, whatever it makes (parity) |
| Gather or refine one item | `2 + 2 × grade` base minutes (4 at grade 1, 22 at grade 10) |
| Cook or craft one output (S6, S7) | three items' worth: `3 × (2 + 2 × grade)` |
| Aptitude | Real time = base × share: A (and S) 50%, B 58%, C 67%, D 75%, E 83%, F 92%, G 100%. Turf sets Farming & Cooking, Dirt sets Gathering & Crafting (§4.1) |
| One job | 1–50 items |

## Facilities (§9)

| Level | Slots | Speed | Upgrade cost |
|---|---|---|---|
| 1 | 2 | ×1 | — |
| 2 | 3 | ×1 | 150 Laurels + 5 refined grade-2 items of each of its two families |
| 3 | 3 | ×1.25 | 500 Laurels + 5 refined grade-5 items of each of its two families |

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
| Raw item of grade g | `5 + 5g` (10 at grade 1, 55 at grade 10) |
| Rush Ticket: finishes up to an hour of a running farm job | 20 |
| Sweep Ticket: completes a beaten regular fight (EXP and Shards, no Laurels) | 15 |

- A job's Rush costs one ticket per started hour left. Training (S5) can't be rushed.
- A chapter with at least one won fight stocks its grade pair: chapter n of a tier, grades `2n − 1` and `2n`.

## Learning District (S5)

| Track | Base hours to the next rank | From the first rank to the top, at G |
|---|---|---|
| Class proficiency, ranks 1–6 | 0.5, 2, 6, 12, 24 | 44.5 h (22 h at A) |
| Gear mastery, ranks 1–10 | `rank × (rank + 1) / 4`: 0.5, 1.5, 3 … 22.5 | 82.5 h (41 h at A) |

Running style sets class speed and distance sets mastery speed, with the same shares as professions.

## Extra Stats and gear (S6, S7)

- **One point** is 1.5% of its stat (HP, MP, ATK, M.ATK, DEF, M.DEF), 0.6% evasion for Speed, or a 0.4-charge head
  start on the Limit Break gauge (12 to fill).
- **Active Extra Stats nodes:** `5 + ⌊Uma level / 2⌋` (5 at Lv1, 30 at Lv50).
