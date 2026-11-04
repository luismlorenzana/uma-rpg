# Balance in Tiers 2 and 3

> **Status: drafting, 2026-11-04. Nothing here is built.** One doc of the [Tier 2 and Tier 3 set](README.md) (ids
> **T2B**): every source's share by tier, the damage stack, the foe budget, weaknesses and shields by tier, statuses, MP,
> Limit Breaks, the mirrors and the healers, and what the fight simulation must confirm. It carries
> [stat-balance.md](../tier-rework/stat-balance.md) (SB1–SB18), [weaknesses-v2.md](../tier-rework/weaknesses-v2.md)
> (WK1–WK13) and the combat pass (D282) onto Tier 1 as it is live (engine v21, save v36). The manual
> ([combat](../../game/combat.md)) is the game as it plays; every Tier 1 number below is from the code.
>
> **Pages** (desktop, light and dark): [Tier 1 → 2 → 3, every system](previews/balance-tiers.html) ·
> [the fight simulation: the reference row, today's Tiers 2–3, the mirrors and healers](previews/balance-sim.html) ·
> [every call, old and new, for the review](previews/balance-calls.html).
>
> **How the numbers were made:** a throwaway test on the live harness (`world/balance-party.ts`, `balance-measure.ts`,
> `balance-play.ts`; engine v21; the owner's two parties at their presets and three accessory slots, D263, D266; on
> curve; Auto; 8 seeds a stage), plus `balance-v21.test.ts` as committed. Not committed. Where a Tier 2 piece isn't
> built, its worth is the approved draft's, marked **provisional**.

## 1. At a glance

**What Tiers 2 and 3 add to balance:** one multiplier on every flat value (kept), a foe term that prices whatever
toolbox the set keeps (re-sized), shields that follow the answers (on today's 6 and 8), weakness lists that narrow
when her weapons widen (one gate for both), skill MP that grows with her bar (a fix the code needs), and a later
tier's Class Rank on Tier 1's pace (a fix the foes need). Statuses, the MP regen and Limit Breaks stay tier-free.

| | Tier 1 (live) | Tier 2 | Tier 3 | Call |
|---|---|---|---|---|
| Flat build values (gear, Extra Stats, ★ signature) | ×1 | ×1.8 | ×2.6 | T2B1 |
| Build share of her lead offense, Lv 50 (code) | 61–63% | 61–63% | 61–63% | T2B1 |
| Foes' HP and DEF term, Lv 1 → 50 (**provisional**) | — | 1.08 → 1.28 | 1.12 → 1.42 | T2B4, T2B5 |
| Foes' offense term, by Lv 50 | — | +10% | +10% | T2B4, T2B5 |
| Bosses | — | the term × 1.1 | the term × 1.1 | T2B6 |
| Shields: regulars · sub-bosses · bosses | by formation 1–6 · 6 · 8 | 1–6 · **7 · 9** from the breadth gate | 1–6 · **7 · 10** | T2B7 |
| Weak kinds: regulars · sub-bosses · bosses | 4 · 3 · 3 | 4 until the breadth gate, then 3 by role · 3 · 3 | the same | T2B8 |
| Members answering a regular (owner's parties) | 4.33 | 4.31 (with a two-kind weapon) | 4.57 (with two) | T2B8 |
| Skill MP | ×1 | **×1.7** (code today ×2) | **×2.4** (code today ×3) | T2B10 |
| MP back a round | 1% of her bar a depth, 5% at most | the same | the same | T2B11 |
| Statuses | +10% a stack, cap 3, 2 rounds | the same | the same | T2B12 |
| Limit Breaks | power × class scale × depth power, ≤ 10 hits a foe | the same | the same | T2B13 |
| Class Rank pace (depths 2–5 at Uma Lv) | 10 · 16 · 22 · 29 | **the same** (code today 7 · 13 · 20 · 27) | the same | T2B3 |
| A regular's 100% hit, on-curve Brawler, Lv 50 | 19.0% | 18.4% (≈21% with the term) | 18.2% (≈21%) | T2B15 |
| Rounds a fight ÷ Tier 1's, today (Tier 1's rules × tier) | 1 | 0.93–1.08 | 0.94–1.06 | §4.9 |

**The breadth gate** (this doc's word): the tier level from which her Tier 2 two-kind weapon can open (T2G: grade G5,
tier Lv 21; Tier 3 from Lv 1 if her branch carries). The lists narrow and the shields grow there, together.

## 2. Tier 1 as built

### 2.1 The damage stack

Every hit takes [the manual's ten steps](../../game/combat.md#damage) (WP31, `battleDamage`): offense (ATK or M.ATK +
the weapon's Might + an Orb's flat on her kind + her ★ signature) → `offense² ÷ (offense + defense) × power` (her
share × hand × Skill Rank) → weak ×1.3 → her Insignias ×(1 + 1% a grade, slots added) on sub-bosses and bosses →
statuses (each ±10%, foes' ±15%) → specials (×1.3) → unbroken ×0.5 (Pierce skips) → the Rift's ward ×0.5 → evasion
(0.6% a Speed point, 50% at most) → rounded, at least 1.

**Its ceiling on one weak hit** (steps 3–4, before statuses): **×1.69** on a boss (×1.3 × three G10 Insignias ×1.30;
the drafts had ×1.495 on one slot). A healer's Brave 3 and Armor Break 3 add ×1.69 more, a special ×1.3, a Break ×2.

### 2.2 Where every point comes from (SB1 on today's sources)

Her lead offense at Lv 50, on curve, by source (code; the owner's presets; a class's first preset weapon):

| Class | Tier | Her level's stat | Armor | Extra Stats | Pendants or Charms | Orb | Might | **Offense** | Build share | ★ (worn) |
|---|---|---|---|---|---|---|---|---|---|---|
| Brawler (Greatsword) | 1 · 2 · 3 | 113 · 204 · 295 | 25 · 45 · 65 | 51 · 92 · 133 | 20 · 36 · 52 | 20 · 36 · 52 | 68 · 122 · 177 | **297 · 535 · 774** | 62.0 · 61.9 · 61.9% | +5 · +9 · +13 |
| Sorcerer (Fire) | 1 · 2 · 3 | 118 · 213 · 308 | 25 · 45 · 65 | 51 · 92 · 133 | 20 · 36 · 52 | 20 · 36 · 52 | 68 · 122 · 177 | **302 · 544 · 787** | 60.9 · 60.8 · 60.9% | the same |
| Arms Spellblade (Katana) | 1 · 2 · 3 | 113 · 204 · 295 | 25 · 45 · 65 | 42 · 77 · 110 | 20 · 36 · 52 | 20 · 36 · 52 | 68 · 122 · 177 | **288 · 520 · 751** | 60.8 · 60.8 · 60.7% | the same |
| Paladin (Lance) | 1 · 2 · 3 | 103 · 185 · 268 | 25 · 45 · 65 | 45 · 81 · 118 | 20 · 36 · 52 | 20 · 36 · 52 | 68 · 122 · 177 | **281 · 505 · 732** | 63.3 · 63.4 · 63.4% | the same |

The other hybrids read as the Arms Spellblade (their leans and Prowess splits mirror); the Cleric as the Paladin.
**Each stat's build share at Lv 50, Tier 1 → 3,** worst drift: the Brawler's MP 38.2 → 40.4% (+2.2), HP up to +1.6
(a Spellblade's 30.6 → 32.2%); ATK, M.ATK, DEF and M.DEF within 0.4 points for every class. It is SB1's finding on today's three slots, three
jewels a rank and the armor half: HP's and MP's level parts carry constants that don't scale. **Mid-tier the build is a
smaller share** (a Brawler's lead offense at Lv 10: 32.8 · 22.5 · 19.3%), because her level restarts high while her
grades restart at G0; the foes' build budget follows the same curve (EP16). **Her ★ is 1.6–1.8% of her lead offense at
Lv 50 in every tier** (D266's 0.1 a level × tier).

### 2.3 The foes

[The manual's rule](../../game/combat.md#foes) (`rpgFoe`, `rpgFoeTierBudget`): HP (40 + 4.2 × the reference stat at
her lifetime level) × role × rank × the build budget; offense set so a 100% hit takes 20% → 28% of an average Uma's HP
(tier Lv 1 → 10), × the offense budget. **The budget restarts each tier and its build part is × tier**, so every tier's
Lv 50 lands on Tier 1's curve: **×2.72 HP and DEF, ×1.49 offense** in all three. Sub-bosses ×3.5, bosses ×5.5, both ×
the skill depth the continent's first level opens. **There is no Tier 2 or 3 term today** (Z4 and SB3–SB5 were never
built): a Tier 2 world is Tier 1's × tier.

A regular striker against the on-curve Brawler (code; her Greatsword Attack at power 1, before weak and the unbroken
halving):

| Tier · Lv | Striker HP · DEF · ATK | Brawler HP · DEF | A regular's 100% hit, share of her HP | Her Attack on the striker | Attacks to fell |
|---|---|---|---|---|---|
| Tier 1 · 10 | 204 · 31 · 129 | 499 · 52 | 18.4% | 40 | 5.04 |
| Tier 1 · 30 | 522 · 87 · 242 | 939 · 120 | 17.2% | 105 | 4.99 |
| Tier 1 · 50 | 1,248 · 217 · 414 | 1,460 · 204 | **19.0%** | 172 | 7.27 |
| Tier 2 · 10 | 544 · 96 · 344 | 1,285 · 151 | 18.6% | 108 | 5.05 |
| Tier 2 · 30 | 989 · 177 · 475 | 1,838 · 245 | 17.0% | 204 | 4.84 |
| Tier 2 · 50 | 2,158 · 390 · 709 | 2,531 · 368 | **18.4%** | 309 | 6.97 |
| Tier 3 · 10 | 884 · 161 · 559 | 2,073 · 251 | 18.6% | 173 | 5.10 |
| Tier 3 · 30 | 1,459 · 267 · 708 | 2,734 · 370 | 17.0% | 308 | 4.74 |
| Tier 3 · 50 | 3,067 · 564 · 1,005 | 3,610 · 532 | **18.2%** | 448 | 6.85 |

A later tier's foe is 3–6% softer for her level at Lv 30–50 (the HP's constant 40 doesn't scale): SB's structural S,
which Z3 accepted and no term prices.

### 2.4 Shields and weaknesses

- **Shields** ([combat](../../game/combat.md#weaknesses-shields-and-breaks)): by formation 1–6 (an escort's captain 5),
  an elite's Keys and a boss's guards 2, a capital's escorts 3, **sub-bosses 6, bosses 8** (R1's measure, D207; WK5).
  The same in every tier today. A Break: two rounds, ×2, then Steeled.
- **Weaknesses v2** (`rpgWeakCounts`, `rpgStageWeaknesses`): Tier 1 regulars 2 Arms + 2 elements, sub-bosses and
  bosses 3 (split by seed); **Tiers 2 and 3 every rank 3, a regular by role** (strikers and guards 1 + 2, casters and
  skirmishers 2 + 1). Built and live in the generator for every tier (D236).
- **Members answering** (the owner's two parties at their presets, every region stage of a tier, 2,400 a tier):

| | Regular | Sub-boss | Boss | Stages leaving a member nothing |
|---|---|---|---|---|
| Tier 1 (4 · 3 · 3 kinds) | 4.32 · 4.35 | 3.75 · 3.71 | 3.77 · 3.77 | 77 · 111 (3–5%) |
| Tier 2, today's weapons (3 · 3 · 3) | 3.64 · 3.69 | 3.62 · 3.71 | 3.70 · 3.74 | **391 · 421 (16–18%)** |
| Tier 2, one two-kind weapon a member (WP32's partner) | 4.33 · 4.30 | 4.47 · 4.33 | 4.29 · 4.35 | 193 · 210 (8–9%) |
| Tier 3, today's weapons | 3.63 · 3.67 | 3.69 · 3.71 | 3.73 · 3.76 | 394 · 410 (16–17%) |
| Tier 3, two two-kind weapons (the Brawler and the Sorcerer one) | 4.59 · 4.56 | 4.67 · 4.56 | 4.65 · 4.65 | 142 · 134 (6%) |

Party 1 · Party 2. WK8's three kinds were sized for the drafts' Tier 2 weapon breadth; without it Tiers 2 and 3 bring
back the owner's "weak to my least used weapons" on one stage in six. **The cross-reference keeps one two-kind weapon in
Tier 3 too** ([gear](gear.md) T2G3): two lift Tier 3's answers to 4.59–4.67, above Tier 1's, so Tier 3 reads as Tier 2's
one-weapon row (T2G2 measured 4.32 · 4.29 on the suggested branches), inside check 4's 10% idle bound.

### 2.5 Statuses, MP and Limit Breaks (after the combat pass)

- **Statuses** (D282): three levels of access: none on Brawlers and Sorcerers; a path (line A of a secondary weapon from
  depth 3, 1 · 1 · 2 stacks) on Spellblades and Summoners; every Greatsword, Lance and Fire skill on Paladins and
  Clerics (1 · 1 · 2 · 2 · 3, line B +1). +10% a stack, cap 3, two rounds; foes' Weaken, Power-up and Ward 15%. Aegis,
  Breaker, Clarity, Hex and Shatter retired. Percentages: nothing scales by tier.
- **MP:** skill MP × her MP hand, rounded, **× the skill's tier** (`battleSkillFor`: `× ref.tier`, so ×2 and ×3).
  **The base regen** 1% of her bar a depth her Class Rank opens, five at most (`RPG_BASE_MP_REGEN_V17`, D215; SB18's
  0.8% became R1's 0.9% and R2's 1.0%). Springs refill between fights; no MP accessory.
- **Limit Breaks** (Halls v2, D241, D249, D261): her seat's power (×1.9–×2.9) × her class's scale (1 a Tier 0, 0.95 the
  damage classes, 0.8 the healers) × her open depth's single-target power, at most 10 hits on one foe, gauge 12.
  Nothing reads the tier: the offense it multiplies already carries it.

| Lv 50, code | Bar | Back a round | Deep act MP | Deep casts a bar | Refund a round |
|---|---|---|---|---|---|
| Brawler, Tier 1 · 2 · 3 | 212 · 367 · 522 | 11 · 18 · 26 | 30 · 60 · 90 | 7.1 · **6.1 · 5.8** | 37 · **30 · 29%** |
| Sorcerer | 294 · 505 · 717 | 15 · 25 · 36 | 30 · 60 · 90 | 9.8 · 8.4 · 8.0 | 50 · 42 · 40% |
| Spellblades (a pair) | 245 · 423 · 600 | 12 · 21 · 30 | 26 · 52 · 78 | 9.4 · 8.1 · 7.7 | 46 · 40 · 38% |
| Summoners (a pair) | 245 · 423 · 600 | 12 · 21 · 30 | 29 · 58 · 87 | 8.4 · 7.3 · 6.9 | 41 · 36 · 34% |
| Paladin, Cleric | 294 · 505 · 717 | 15 · 25 · 36 | 16 · 32 · 48 | 18.4 · 15.8 · 14.9 | 94 · **78 · 75%** |

Her bar grows ×1.73 and ×2.46 by tier; the code's skill MP grows ×2 and ×3, so a Tier 2 bar holds 13–14% fewer deep
casts and a Tier 3 bar 18–19% fewer. The drafts' factor was ×1.7 and ×2.4 (class-progression §6.6, tier2-classes
A10), and SB18 called the regen "tier-free" on it.

### 2.6 What was measured, and where it stood

| Decision | Engine | What it measured | Where it stood |
|---|---|---|---|
| D236 (H115) | v18 | Weaknesses v2 on 32 seeds | Rounds within 0.32 of v15's lists, wins 100%; **Tiers 2 and 3 within 0.91–1.06 of Tier 1's rounds**; the Summoner's Tome 0.58 → 0.62 |
| D249 (H131) | v19 | Classes v3 and Halls v2 | Tome ÷ Arms Spellblade 102–103%; Arms ÷ Tome Summoner 96–103%; Spellblades against Summoners 98–106% but **the Tome Summoner ÷ Arms Spellblade 114% at Lv 10**; the Arms Spellblade 74–80% physical (missed); **Paladin ÷ Cleric 89% · 147% · 121% at Lv 10 · 30 · 50** (missed, no knob); the Duel's rail 10 chips against shields 13–15; S6 missed at Lv 20 (the pace) |
| D263 | v20 | The owner's two comps' presets, 80 stages × 8 seeds | Party 1 4.83 rounds, Party 2 4.87; Party 2's damage taken +12% against the defaults (no Aegis then) |
| D266 | v20 | Three slots, linear rows, 1,280 fights a build | Accessories +14% a turn at Lv 50; no mix best in over half the cases; **"Tier 2 and Tier 3 scale these rows unmeasured"** |
| D282 | v21 | The combat pass, Lv 20–50 | 100% wins; rounds within 0.4 of v20; the Cleric's party within ~7% a class, the Paladin's ~12%, her own hits ~15% lower |
| **This doc** | v21 | Tiers 1–3 on today's rules, Lv 10 · 20 · 30 · 50 | **Tier 2 0.93–1.08 and Tier 3 0.94–1.06 of Tier 1's rounds**; Paladin ÷ Cleric 99–106% in every tier; the mirrors below (§4.8) |

**The Tier 1 reference row** (v21 today, both parties, on curve, Auto, 8 seeds; rounds a fight · rounds to her first
Break; wins 100% everywhere):

| Lv | Party 1: regular | sub-boss | boss | Party 2: regular | sub-boss | boss |
|---|---|---|---|---|---|---|
| 10 | 4.0 · 1.3 | 4.2 · 3.0 | 7.4 · 3.1 | 4.0 · 1.4 | 4.2 · 2.9 | 7.5 · 2.9 |
| 20 | 3.4 · 1.3 | 3.9 · 2.7 | 6.0 · 2.5 | 3.3 · 1.3 | 3.8 · 2.3 | 6.0 · 2.5 |
| 30 | 2.9 · 1.2 | 3.1 · 2.0 | 5.1 · 2.2 | 2.9 · 1.2 | 3.1 · 2.1 | 5.0 · 2.3 |
| 40 (`balance-v21.test.ts`) | 3.3 | 4.0 | 6.0 | 3.3 | 3.8 | 5.9 |
| 50 | 4.0 · 1.3 | 4.9 · 2.7 | 7.8 · 2.7 | 3.9 · 1.4 | 4.8 · 2.4 | 7.3 · 2.6 |

## 3. The approved drafts, call by call

**42 calls carried:** 22 kept, 10 kept and changed, 7 superseded, **3 broken** (SB3, SB4, SB8).

### 3.1 Stat balance (SB1–SB18, D196)

| Call | What it said | Status | Why | Now |
|---|---|---|---|---|
| **SB1** The stat budget | Flat values × 1 · 1.8 · 2.6; percentages stay | **Kept** | Measured on today's sources: shares within 2.2 points (§2.2) | T2B1 |
| **SB2** The model | An analytic model is the pre-simulation yardstick | **Superseded** (D249, D266, D282) | Every Tier 1 number since R1 is measured on the engine's harness | T2B2 |
| **SB3** Tier 2's term | HP and DEF × (1 + 0.27 (ℓ − 1) ÷ 49), offense +10% | **Broken** | Sized on a toolbox that held the second accessory slot (D264 moved all three into Tier 1) and on CP6's narrowing (WK8 replaced it) | T2B4 |
| **SB4** Tier 3's term | × (1.08 + 0.40 (ℓ − 1) ÷ 49) | **Broken** | The same: the third slot is Tier 1's, the narrowing gone | T2B5 |
| **SB5** Bosses | The term × 1.1 | **Kept, changed** (D235) | Its reason was "bosses keep their twins"; WK8's is that a regular loses a kind and a boss doesn't, so two-kind weapons lift a boss's answers 14–23% over Tier 1's | T2B6 |
| **SB6** Boss shields | 6 · 9 · 10 | **Kept, changed** (D207, WK5) | Tier 1's boss is 8 and sub-boss 6 (H71's measure); the +1 a tier stands on 8 | T2B7 |
| **SB7** The stack and the Rift | Ceilings ×1.50 · ×2.16 · ×2.49; the Rift prices the tuned peak 1.6 · 1.8× | **Kept, changed** (D264, D266) | Three Insignias make Tier 1's ceiling ×1.69; the Rift rule stands | T2B9, T2B14 |
| **SB8** Accessory viability | The Toll Bell +0.05, the Great Pendant 0.55 | **Broken** | The Bell retired and the Pendant became +ATK (D264); the branch forms are T2G's. The rule "every form someone's best, none over half" stands | T2B19 |
| **SB9** Channel parity | Families within 0.4 points; the Bell at an equal Attack share | **Kept, changed** (D264) | The Pendant (+ATK) and the Charm (+M.ATK) mirror by construction; the Bell row goes | T2B19 |
| **SB10** The hybrids' presets | Single-kind forms and the Full moon on her lead half | **Kept, changed** (D263, D266) | Built: her stat twice and an Orb on her lead half's twin; the moon is T2E's | T2E |
| **SB11** The Summoner's Arms hand | 0.56 → 0.48 | **Superseded** (D249) | Hands since: Arms Summoner 0.57 + 0.46, Tome Summoner 0.57 + 0.5 | T2B16 |
| **SB12** Paladin and Cleric | Equal in Tier 1; branch pairs within ±10% | **Superseded** (D282) | One kit, every number shared (H3); the ±10% band carries | T2B17 |
| **SB13** Defense | A regular's hit 18.7 · 18.3 · 18.1%, armor kept | **Kept** | The code: 19.0 · 18.4 · 18.2% | T2B15 |
| **SB14** MP knobs | No pool change; the regen's share, then Vigor, then legs | **Kept** | Still the order; T2B10 is a separate Tier 2–3 fix | T2B11 |
| **SB15** The template | The signature +0.2 a level × tier | **Superseded** (D266) | 0.1 a level × tier: 1.6–1.8% of her lead offense | T2U |
| **SB16** Skill Ranks | ×0.95–×1.05; the balance party on the real pace | **Kept, changed** (D249) | Tier 1's pace now banks the Tier 0's Ranks (depths at Lv 10 · 16 · 22 · 29) | T2B3 |
| **SB17** The follow-ups | §13's edits as logged follow-ups | **Superseded** (D238) | Done; the drafts move to the archive after this set's review | — |
| **SB18** A base MP regen | 0.8% a depth, tier-free | **Kept, changed** (D215) | 1.0% a depth, 5% at most; "tier-free" holds only with T2B10's skill MP | T2B10, T2B11 |

### 3.2 Weaknesses v2 (WK1–WK13, D235–D237)

| Call | What it said | Status | Why | Now |
|---|---|---|---|---|
| **WK1** Lists by rank | Regulars 2 + 2, sub-bosses and bosses 3 | **Kept** | Tier 1's rule, and Tiers 2–3's before the breadth gate | T2B8 |
| **WK2** The ring leads | The ring's answer first; Light + Dark from the trio | **Kept** | Every tier | — |
| **WK3** Arms from the stage's deck | Dealt in slot order, no neighbour's set | **Kept** | Every tier | — |
| **WK4** Fixed per stage | Seeded by the stage and slot | **Kept** | Every tier | — |
| **WK5** Shields stay | Regulars 2–3, sub-bosses 6, bosses 8 | **Kept** | Tier 1's; Tiers 2–3 step from it | T2B7 |
| **WK6** Locks stay | 2–4 locks from her list | **Kept** | Every tier | — |
| **WK7** Icons on the foe card | Up to four, no "Weak:" | **Kept** | Three or four in every tier | — |
| **WK8** Tiers 2 and 3 | Every rank 3, a regular by role; shields by R4/R5's packets | **Kept, changed** (D238) | R4 and R5 were deferred, so its shields are T2B7's; three kinds hold only with T2G's two-kind weapons (§2.4) | T2B7, T2B8 |
| **WK9** The Rift unchanged | Draws by front | **Kept, changed** (D240, D249) | The twins re-paired (Katana–Light, Bow–Dark), `RIFT_TUNING_V19` | T2B9 |
| **WK10** One helper | Regions, capitals, chapters | **Kept** | `rpgStageWeaknesses`, every tier | — |
| **WK11** Engine v18; R3–R5 on v19–v21 | Versions | **Superseded** (D238, D257, D261, D282) | v19–v21 went to Classes v3, the halls' trim and the combat pass | §6 |
| **WK12** The checks | Both channels, no shared list, 75% a member, the sim | **Kept, changed** (D263) | On the owner's two parties, run in every tier | T2B8, T2B18 |
| **WK13** The Summoner's Tome 0.62 | The mirror's knob | **Superseded** (D249) | The lead hand is 0.57 | T2B16 |

### 3.3 The combat pass (D282), carried into Tiers 2 and 3

| Call | What it said | Status | In Tiers 2–3 |
|---|---|---|---|
| **B1** | Foes don't guard; covering pinned for special boss fights | **Kept** | Every tier; a Tier 2–3 special boss is T2W's |
| **I1** | One symbol per kind | **Kept** | — |
| **H1** | Depth 5 heals the most hurt whole, the rest ×0.4 | **Kept** | T2B17 |
| **H2** | A mend lifts the most hurt to 60% | **Kept** | A share: tier-free |
| **H3** | The Paladin and the Cleric share every number | **Kept** | T2B17; T2C's branches keep it |
| **S1** | Summoners keep no legacy debuff | **Kept** | T2B12 |
| **F1** | A Spellblade's extra hit is her familiar's | **Kept** | The rail counts it (T2B9) |
| **D1** | Buffs and debuffs on Greatsword, Lance and Fire for the healers | **Kept** | T2B12 |
| **D2** | Three levels of access | **Kept** | T2B12; widening is T2C's |
| **D3** | Aegis, Breaker, Clarity, Hex and Shatter retire | **Kept** | T2B12 |
| **D4** | The Healer Sanctum's stacks stay | **Kept** | T2B13 |

## 4. Tier 2 and Tier 3 in full

### 4.1 Every source keeps its share (T2B1, T2B2)

Every flat value is its Tier 1 value × 1.8 in Tier 2 and × 2.6 in Tier 3: armor, Might, the Pendant's, the Charm's and
the Orb's rows, every Extra Stats node, her ★ signature, and **every new Tier 2–3 flat source** (T2E's weapon moons,
T2G's branch forms). Every percentage stays: weak, the Insignia, statuses, the focus, hands, leans, Limit Break scales,
mend and Barrier shares, the Flourish, the regen. §2.2's table is the check: each stat's build share within 2.2 points
at every tier's Lv 50. **A new source joins the table before it ships.**

**The yardstick is the engine** (T2B2): Tiers 2–3 are measured on the harness with a Tier 2–3 balance file
(`world/balance-t2.test.ts`) that prints §4.9's rows; the harness builds a later-tier member at that tier's own Class
Rank pace (T2B3). An analytic estimate sizes a knob before code, as this doc's terms do, never a delivery.

### 4.2 A later tier's Class Rank pace (T2B3)

| Uma Lv | 1 | 5 | 7 | 10 | 13 | 16 | 20 | 22 | 27 | 29 | 34 | 36 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Tier 1 (Tier 0 to Rank 10, then 2E − 1,800) | 10 | 10 | 10 | 10 | 15 | **20** | 27 | **30** | 37 | **40** | 48 | 50 |
| A later tier today (Rank 1, 2E) | 1 | 7 | **11** | 15 | **20** | 24 | **30** | 33 | **40** | 43 | 50 | 50 |

Measured (Tier 2 and 3 at Lv 20, both parties): from Rank 1 the fights run **0.83–0.95** of Tier 1's rounds
(sub-bosses 0.83–0.88), against 0.96–1.02 at Tier 1's pace; at Lv 10, 30 and 50 the two paces are within 0.05.
**Recommended:** in a later world, Ranks 1–10 are one shared ladder of the Tier 0's Class EXP (3,600), raising every
Tier 1 class she holds to Rank 10 together, then each class climbs on its own, so depths 2–5 open at Lv 10 · 16 · 22 · 29
in every tier and the foes need nothing new. The foes' reach can't fix it (a continent's reach reads its first level:
depth 2 at Lv 11 on either pace). It lives in [classes](classes.md#41-arriving-and-class-rank-t2c1t2c3) T2C3 (the
cross-reference made the ladder shared, so a campaign still takes two classes to Rank 50).

### 4.3 The damage stack by tier (T2B14)

The steps stay WP31's. What Tiers 2–3 add lands in steps 3–4 (assumed from T2G and T2C):

| On one weak hit, steps 3–4 | Tier 1 | Tier 2 | Tier 3 |
|---|---|---|---|
| Weak | ×1.3 | Pure ×1.5 (T2G) | Keen ×1.7 (T2G) |
| Her focus group (T2C) | — | ×1.15 | ×1.15 |
| Three G10 Insignias, a boss | ×1.30 | ×1.30 | ×1.30 |
| **Ceiling** | **×1.69** | **×2.24** | **×2.54** |
| Flat on one kind: Might + three Orbs (+ a Full moon, T2E) | 68 + 60 = 128 | 122 + 108 (+ 90) = 230 (320) | 177 + 156 (+ 130) = 333 (463) |

Statuses multiply on top (Brave 3 and Armor Break 3: ×1.69 in every tier). No cap: the terms price the on-curve act
and the Rift the tuned one (T2B9).

### 4.4 The foe budget: the toolbox term (T2B4, T2B5, T2B6)

**Shape (SB3–SB5's, kept):** the foes' HP and DEF × a term linear in the tier level ℓ, offense × (1 + 0.10 (ℓ − 1) ÷ 49)
(the healers' focus is the sustain it prices), bosses' HP and DEF × 1.1 on top. It rides `rpgFoeTierBudget`, after the
build budget, keyed by engine.

**Size (re-derived, provisional):** the term prices the toolbox K the set keeps, measured as an act's damage at the
same tier level against Tier 1's. Each piece, from the drafts, less what Tier 1 already holds:

| Piece (owner) | Arrives | Tier 2 at Lv 10 · 30 · 50 | Tier 3 at Lv 10 · 30 · 50 |
|---|---|---|---|
| The focus, +15% on her group (T2C, CP39) | Lv 1 | ×1.12 | ×1.12 |
| Weapon branches, Pure and Dual (T2G, WP6–WP9) | G5 (Lv 21); Tier 3 carried | 1.00 · 1.05 · 1.05 | 1.05 · 1.10 · 1.10 |
| Accessory branch forms (T2G; the slots are Tier 1's since D264) | G5 | 1.00 · 1.03 · 1.04 | 1.01 · 1.05 · 1.08 |
| Weapon moons (T2E, EP24–EP26) | Their nodes | 1.03 · 1.10 · 1.14 | 1.05 · 1.15 · 1.23 |
| The lists (WK8 at the breadth gate) | — | 1.00 (the lists narrow as the weapons widen) | 1.00 |
| **K, the toolbox** | | **1.15 · 1.33 · 1.39** | **1.25 · 1.49 · 1.64** |
| **The HP and DEF factor that prices K** | | 1.11 · 1.23 · 1.26 | 1.17 · 1.33 · 1.40 |

Solved from a hit's own formula: HP and DEF × T cut her acts by T × (1 + T r) ÷ (1 + r), r her foe's defense ÷ her
offense (0.56–0.73 in the code). Rule of thumb: **each 1% the toolbox adds to an act at Lv 50 takes 0.7% on the term.**

| | Lv 1 | 10 | 20 | 30 | 40 | 50 |
|---|---|---|---|---|---|---|
| **Tier 2** × (1.08 + 0.20 (ℓ − 1) ÷ 49) | 1.08 | 1.12 | 1.16 | 1.20 | 1.24 | **1.28** |
| **Tier 3** × (1.12 + 0.30 (ℓ − 1) ÷ 49) | 1.12 | 1.18 | 1.24 | 1.30 | 1.36 | **1.42** |
| Bosses (T2B6) | the tier's × 1.1 | | | | | 1.41 · 1.56 |
| Was (SB3 · SB4) | 1.00 · 1.08 | 1.05 · 1.15 | 1.10 · 1.24 | 1.16 · 1.32 | 1.22 · 1.40 | 1.27 · 1.48 |

- **Why Tier 2 now starts at 1.08:** the drafts' narrowing (×0.94 on regulars) cancelled the focus at Lv 1; with the
  lists Tier 1's until the breadth gate, nothing does. Tier 3 ends lower (1.42, was 1.48): the third accessory slot
  isn't new any more.
- **Bosses × 1.1** (T2B6): with WK8 a regular loses a kind (4 → 3) and a boss doesn't (3 → 3), so the two-kind
  weapons lift a boss's answers to 4.29–4.35 (Tier 2) and 4.65 (Tier 3) against Tier 1's 3.77, while a regular's
  return to Tier 1's (4.31, 4.57 against 4.33).
- **If a piece is dropped,** its factor leaves K and the term shrinks by 0.7 of it; with every piece dropped the term
  is 1, as today (measured: Tier 2 0.93–1.08 and Tier 3 0.94–1.06 of Tier 1's rounds).
- **Defense** (T2B15): the offense part takes a regular's 100% hit from 18.4% to about 21% of the on-curve Brawler's
  HP at Tier 2's Lv 50 (18.2% → 21% in Tier 3); armor's HP a grade stays the knob.

### 4.5 Shields and weaknesses by tier (T2B7, T2B8)

**One gate, two rules.** Before the breadth gate a Tier 2–3 stage plays Tier 1's lists and shields; from it the lists
narrow to WK8's three and the shields grow by the answers:

| | Tier 1 | Tier 2, Lv 1–20 | Tier 2, Lv 21–50 | Tier 3 (her branch carried) |
|---|---|---|---|---|
| Regulars: kinds | 2 Arms + 2 elements | 2 + 2 | 3: strikers and guards 1 + 2, casters and skirmishers 2 + 1 | 3 by role |
| Sub-bosses, bosses: kinds | 3 (2 + 1 or 1 + 2) | 3 | 3 | 3 |
| Shields: regulars (by formation) | 1–6 | 1–6 | 1–6 | 1–6 |
| Shields: sub-bosses · bosses | 6 · 8 | 6 · 8 | **7 · 9** | **7 · 10** |
| Members answering a regular · a boss | 4.33 · 3.77 | ≈ 4.3 · 3.7 | 4.31 · 4.32 | 4.57 · 4.65 |
| Stages leaving a member nothing | 3–5% | ≈ 3–5% | 8–9% | 6% |

- **The shield rule** (CP8's, on today's numbers): a rank's shield is Tier 1's × its answers ÷ Tier 1's answers,
  rounded: sub-bosses 6 × 4.40 ÷ 3.73 = 7.1 → **7** and 6 × 4.62 ÷ 3.73 = 7.4 → **7**; bosses 8 × 4.32 ÷ 3.77 = 9.2 →
  **9** and 8 × 4.65 ÷ 3.77 = 9.9 → **10** (SB6's 6 · 9 · 10, on today's 8); regulars × 1.00 and × 1.06 round to
  their formation's. An elite's Keys, a boss's guards and a capital's escorts keep Tier 1's.
- **Why the gate:** WK8's three kinds were sized for the drafts' weapon breadth; without it one stage in six leaves a
  member nothing weak (16–18%), the owner's original complaint. Tying the narrowing to the level her weapons widen
  keeps the floor and makes Tier 2 read as CP's own story: breadth grows as weaknesses narrow.
- **If T2G drops the two-kind weapon,** there is no gate: regulars stay 2 + 2 and every shield Tier 1's in every tier.
- **The checks** (WK12 in every tier, T2B8): every foe answers to both channels and two members or more; no stage of
  two foes gives every foe the same list; every member answers 75% of her tier's foes or more; **no more than 10% of
  stages leave a member nothing, at every level.**

### 4.6 The Rift by tier (T2B9)

- **Draws stay by front** (WK9): Iron one Arm a foe warding elements, Arcane elements only warding Arms, the Duel twin
  sets (Katana–Light, Bow–Dark since v19), the Horde one twin set a foe. A two-kind weapon's partner is of its own
  channel (WP32), so it adds answers on Iron and Arcane and none across a Duel's mixed locks.
- **Strength:** a Tier 2 front's foes take the world's term (T2B4–T2B6) and `RIFT_TUNING_V19`'s scales unchanged; the
  tuned peak (SB7: a tuned party about 1.6 and 1.8 times the campaign's act) is what the fronts' bands measure (the
  right party 91–100% a stage, champions 60–68%, D249).
- **The Duel's rail:** a hit chips one point whatever its kinds, so the rail moves only with hits: the Duel's shields
  are the best own act's and the best Limit Break's chips + 3, at least 13 (today 10 + 3), re-counted on T2C's Tier
  2–3 trees.
- **Tier 3's Rift** (none yet): if T2W opens it, the same rule at Tier 3's term.

### 4.7 Statuses, MP and Limit Breaks by tier (T2B10–T2B13)

**Skill MP × 1.7 in Tier 2 and × 2.4 in Tier 3** (T2B10), the drafts' factor, where the code multiplies by the tier
itself. Her bar grows ×1.73 and ×2.46; the regen is a share of it:

| Lv 50 | Deep casts a bar, Tier 1 · 2 · 3: today → **×1.7 · ×2.4** | Refund a round: today → **×1.7 · ×2.4** |
|---|---|---|
| Brawler | 7.1 · 6.1 · 5.8 → **7.1 · 7.2 · 7.3** | 37 · 30 · 29% → **37 · 35 · 36%** |
| Sorcerer | 9.8 · 8.4 · 8.0 → **9.8 · 9.9 · 10.0** | 50 · 42 · 40% → **50 · 49 · 50%** |
| Spellblades | 9.4 · 8.1 · 7.7 → **9.4 · 9.6 · 9.7** | 46 · 40 · 38% → **46 · 48 · 48%** |
| Summoners | 8.4 · 7.3 · 6.9 → **8.4 · 8.5 · 8.6** | 41 · 36 · 34% → **41 · 42 · 43%** |
| Paladin, Cleric | 18.4 · 15.8 · 14.9 → **18.4 · 18.7 · 18.9** | 94 · 78 · 75% → **94 · 93 · 95%** |

Every class within 2 points of Tier 1's, and no deep act refunded by a round (the most a healer's 95%). A skill's MP is
round(round(its MP × her hand) × the factor), at least 1; a skill carried from an earlier tier pays its own tier's.

- **The regen** (T2B11): 1% of her bar a depth, five at most in Tiers 1 and 2. Tier 3 has no depth 6: its **crown**
  (Class Rank 50, every held capstone at 5.6 with +4 MP, [classes](classes.md) T2C20) adds a sixth step, 6% a round
  (T2C21), which pays for the crown's MP (reconciled; the simulation's MP checks confirm it).
- **Statuses** (T2B12): +10% a stack (foes' 15%), cap 3, two rounds, Burn 4% a round, in every tier. Any status T2C
  adds keeps the step and the cap; D282's three levels carry unless T2C widens them.
- **Limit Breaks** (T2B13): tier-free; the scales 1 · 0.95 · 0.8 and the 10-hit cap carry. Bonds restart at Ascend
  (T2W), so a Learner's cast climbs from 50% again; the harness's Bond ramp (Bond 10 by Lv 23) prices it in every tier.

### 4.8 The mirrors and the healers (T2B16, T2B17)

Data, where each stood when measured (regular stages, damage a turn; this doc's run: v21, 8 seeds, Lv 10 · 20 · 30 · 50):

| Measure (Classes v3's target) | D236 (v18) | D249 (v19) | Today, Tier 1 | Today, Tier 2 | Today, Tier 3 |
|---|---|---|---|---|---|
| **S5** Tome Summoner ÷ Arms Spellblade (Party 1), 90–110% | Summoner ÷ Spell Blade 110 · 88 · 90% (Lv 10 · 30 · 50) | 102–104%; **114% at Lv 10** | **117** · 103 · 102 · 99% | 103 · 110 · 95 · 96% | 111 · 97 · 94 · **89%** |
| **S5** Arms Summoner ÷ Tome Spellblade (Party 2), 90–110% | — | 98–106% | 107 · 106 · 99 · 99% | 104 · 106 · 94 · 98% | 107 · 103 · 99 · 95% |
| **S3** Tome ÷ Arms Spellblade (across the parties), ±5% | — | 102–103% | 101 · 103 · **106** · 101% | — | — |
| **S4** Arms ÷ Tome Summoner (across the parties), ±5% | — | 96–103% | **92** · **106** · 102 · 101% | — | — |
| Splits, 70/30 ± 5: Arms Spellblade physical · Tome Spellblade magical | — | 74–80% (missed) · 68–74% | 77 · 75 · 74 · 77% · 77 · 74 · 78 · **81%** | — | — |
| Splits, 70/30 ± 5: Arms Summoner physical · Tome Summoner magical | Summoner 71 · 66 · 71% | 68–73% · 66–72% | 72 · 73 · 74 · 75% · 72 · 70 · 71 · 74% | — | — |
| Paladin ÷ Cleric, mends + absorbed Barriers a fight (Party 1's seat), ±10% | R1 111%, R2 112% | 89 · 147 · 121% (Lv 10 · 30 · 50) | 101 · 104 · 106% (Lv 10 · 30 · 50) | 99 · 106 · 104% | 102 · 101 · 106% |

- **The bands** (Classes v3's S3–S5, CP9's identity): Arms against Tome of one family within ±5%, Spellblades against
  Summoners 90–110%, each 70/30 ± 5 her way. **Outside today:** the Tome Summoner at Lv 10 (117%, D249's known miss),
  the Tome Spellblade's split at Lv 50 (81%) and the Arms Spellblade's at Lv 10 and 50 (77%), the cross-party S3 and S4
  by 1–2 points at Lv 10–30 (two parties' contexts, not one), and Tier 3's Lv 50 Tome Summoner (89%). Tier 3's dip is
  MP's: her pair costs 87 of a 600 bar at × 3; T2B10 gives her 70.
- **The knob order** (T2B16): the hands first (D249's), then T2C's class skills; **no hand moves for Tiers 2–3** until
  the toolbox is built and measured, since a hand moves Tier 1 too.
- **The healers** (T2B17): within ±10% in every tier since the shared kit (D282's H3). T2C's healer branches must keep
  that band: one healer's focus is the other's.

### 4.9 What the fight simulation must confirm (T2B18)

At the engine stage that carries this doc (§6), on `balance-t2.test.ts`, the owner's two parties, on curve, Auto, 32
seeds for a delivery, Tiers 2 and 3 at Lv 10 · 20 · 30 · 40 · 50 against the Tier 1 reference row (§2.6):

| # | Check | Band | Tier 1 reference (v21) | Today in Tiers 2–3 | Knob, in order |
|---|---|---|---|---|---|
| 1 | Wins on curve | 100% | 100% | 100% | — |
| 2 | **Rounds a fight**, regulars · sub-bosses · bosses | ±10% of Tier 1's at the same tier level | 2.9–4.0 · 3.1–4.9 · 5.0–7.8 | 0.93–1.08 (Tier 1's pace), 0.83–0.95 at Lv 20 (from Rank 1) | The term's two numbers; bosses' × 1.1 |
| 3 | Rounds to her first Break | ±0.5 of Tier 1's | 1.2–1.4 · 2.0–3.0 · 2.2–3.1 | within ±0.6 | Shields (T2B7) |
| 4 | Idle stages | ≤ 10% at every level | 3–5% | 16–18% (no two-kind weapon) | The breadth gate (T2B8) |
| 5 | MP over a region (12 stages, one Spring) | 10–12 of 12 cleared; late pace ±10% of Tier 1's | 12 of 12 (D236) | not measured | T2B10's factor, then the regen's share |
| 6 | Deep casts a bar, refund | ±10% of Tier 1's; no deep act refunded | 7.1–18.4; 37–94% | 13–19% fewer; 29–78% | T2B10 |
| 7 | The mirrors (S3–S5) | Arms ÷ Tome ±5%; Spellblades ÷ Summoners 90–110%; 70/30 ± 5 | 92–106%; 99–117%; 72–81% | 89–111% | The hands, then T2C's class skills |
| 8 | The healers | ±10% | 101–106% | 99–106% | T2C's healer focus |
| 9 | Accessories | No mix best in over half; every family someone's best (D266) | met at Lv 50 | not measured | T2G's branch forms' rows |
| 10 | Defense | A regular's 100% hit ≈ 21% of the on-curve Brawler's HP at Lv 50 | 19.0% | 18.4 · 18.2% (no term) | Armor's HP a grade |
| 11 | The Rift's fronts | The right party 91–100% a stage, champions 60–68% | D249's | not measured | `riftTuning`'s scales |
| 12 | The Duel's rail | No act Breaks a Duel boss | best 10 chips, shields 13 | the same | The Duel's shields (T2B9) |
| 13 | SB1 | Each stat's build share within 2.2 points of Tier 1's | §2.2 | met | — |

## 5. Provides and assumes

| Doc | This doc provides | This doc assumes |
|---|---|---|
| **T2C** classes | T2B3 (a later tier's Class Rank pace), T2B10 (skill MP × 1.7 · 2.4), T2B12 (the status step and cap), T2B13 (Limit Breaks tier-free), T2B16–T2B17 (the mirror and healer bands), T2B9 (the rail counts T2C's hits) | The focus +15% on her group (CP39), worth ×1.12 an act; a healer's focus on her mends; Tier 3's depth 6 at Class Rank 50 (CP20) if kept; the hands and the Halls' scales unchanged by tier; T2C3 implements T2B3 (a shared Ranks 1–10 ladder); T2C18's healing divisor × tier (300 · 540 · 780) keeps an on-curve Lv 50 healer's scale ×1.64 in every tier, which the simulation's healer checks (T2B17, T2B18) confirm with T2B10's skill MP |
| **T2G** gear | T2B1 (every new flat value × tier), T2B7–T2B8 (the breadth gate reads T2G's two-kind weapon), T2B14 (the ceilings), T2B19 (the viability rule for branch forms) | One two-kind weapon in Tiers 2 and 3 at G5 (Dual, WP32's partner re-derived on v19's twins, T2G1; one in Tier 3 too, T2G3), her Tier 2 branch carried into Tier 3 (T2G17); Pure ×1.5, Keen ×1.7; three slots in every tier, branch forms worth about ×1.04 (Tier 2) and ×1.08 (Tier 3) at Lv 50 |
| **T2E** extra stats | T2B1, T2B4–T2B5 (the moons' share priced in the term) | Weapon moons (EP24–EP26) worth ×1.14 and ×1.23 at Lv 50, × tier values; the lead-half rule for a hybrid's Full moon (SB10) |
| **T2P** professions | No balance change moves an item, a recipe or a count | — |
| **T2U** templates | The ★ at 1.6–1.8% of her lead offense in every tier; the Flourish's 4% tier-free | The signature 0.1 a level × tier (D266); the Flourish as UT6 |
| **T2W** progression | T2B3, T2B9 (the Rift by tier, Tier 3's rule), the term and shields in foe generation | Ascend resets Class Rank to 1, grades to G0 and Bonds to 0; foe levels lifetime; Tier 3 gets a Rift (T2W4), drawn by T2B9's rule |

## 6. Save and engine

- **One engine stage** (the next free engine, `rpgRework` key `tiers`): skill MP × 1.7 · 2.4 (`battleSkillFor`); the
  term and bosses × 1.1 in foe generation (`rpgFoeTierBudget`); shields by tier and the breadth gate
  (`rpgFoeShields`, `rpgWeakCounts` reading the stage's tier level); the Duel's shields from the rail. A fight open
  on an older engine replays on its own rules; pin a few Tier 2 fights before the switch, as `v20-replays` did.
- **No save change from this doc.** T2B3's Class Rank curve is a rule of Class EXP; an Uma already in a later world
  keeps her ranks (T2C or T2W decides whether hers re-read).
- **The harness:** `balanceClassRank(level, engine, tier)` with the later-tier pace; `balance-t2.test.ts` for §4.9;
  `coverage-v18.test.ts`'s checks run in every tier with the two-kind weapons.

## 7. Pacing

- **Rounds a fight stay Tier 1's** at every tier level: regulars 2.9–4.0, sub-bosses 3.1–4.9, bosses 5.0–7.8
  (§2.6). The build budget restarts each tier, so a tier's first levels are as gentle as Tier 1's.
- **Where a tier takes longer:** none by design. The breadth gate (Lv 21) is where Tier 2's fights change texture
  (three kinds, +1 shield); the term ramps through it linearly.
- **MP over a region:** with T2B10 a region plays at Tier 1's MP pace; without it a Tier 2–3 party casts deep 13–19%
  less per bar and Attacks more late in a region.
- **The simulation's cost:** both parties, three tiers, four levels, 8 seeds: about 3 minutes on a laptop; 32 seeds
  for a delivery about 12.

## 8. Decisions

| Call | Recommendation | Alternatives, briefly | Why |
|---|---|---|---|
| **T2B1** Every source keeps its share | Every flat value (armor, Might, Pendant, Charm, Orb, Extra Stats, ★ and every new Tier 2–3 flat source) is Tier 1's × 1.8 and × 2.6; percentages stay; a new source joins §2.2's table before it ships | Per-stat multipliers for HP and MP's +2 points | Measured on the code: within 2.2 points at every tier's Lv 50 |
| **T2B2** The yardstick is the engine | Every Tier 2–3 number is measured on the harness (`balance-t2.test.ts`); an analytic estimate only sizes a knob | SB2's analytic model | Every Tier 1 number since R1 came from the engine |
| **T2B3** A later tier's Class Rank pace | Ranks 1–10 in a later world are one shared ladder of the Tier 0's Class EXP (3,600) raising every class she holds, so depths open at Lv 10 · 16 · 22 · 29 in every tier (T2C3, reconciled) | Accept the faster pace (fights 5–17% short at Lv 13–29); the foes' reach reads it (can't reach Lv 20) | One curve for every tier; the foes stay tuned; implemented by T2C or T2W |
| **T2B4** Tier 2's term | Foes' HP and DEF × (1.08 + 0.20 (ℓ − 1) ÷ 49), offense × (1 + 0.10 (ℓ − 1) ÷ 49); provisional until §4.9 sets it | SB3's 1.00 → 1.27; no term (only if every Tier 2 piece is dropped) | Prices the kept toolbox (K 1.15 → 1.39) with no narrowing to cancel the focus |
| **T2B5** Tier 3's term | × (1.12 + 0.30 (ℓ − 1) ÷ 49), offense +10% by Lv 50; provisional | SB4's 1.08 → 1.48 | K 1.25 → 1.64; the third slot is Tier 1's now |
| **T2B6** Bosses | The term × 1.1 on bosses' HP and DEF in Tiers 2–3 | No boss factor | Two-kind weapons lift a boss's answers 14–23% over Tier 1's; a regular's return to Tier 1's |
| **T2B7** Shields by answers | Regulars by formation in every tier; sub-bosses 6 · 7 · 7 and bosses 8 · 9 · 10, the steps from the breadth gate; Keys, guards and escorts as Tier 1's; Tier 1's in every tier if there is no two-kind weapon | Today's 6 and 8 in every tier; SB6's 6 · 9 · 10 | CP8's rule (Tier 1's shield × answers ÷ Tier 1's) on today's 6 and 8 |
| **T2B8** Weaknesses in Tiers 2–3 | WK8's three kinds by role **from the breadth gate**, Tier 1's 2 + 2 before it (Tier 2 Lv 1–20); without T2G's two-kind weapon, 2 + 2 in every tier; WK12's checks in every tier plus ≤ 10% idle stages at every level | WK8 from Lv 1 (16–18% idle before G5); four kinds by role (3 + 1) in every tier | The lists narrow when her weapons widen; the floor holds; CP's "breadth grows as weaknesses narrow" |
| **T2B9** The Rift by tier | Draws by front in every tier; a Tier 2 front takes the world's term and `RIFT_TUNING_V19`'s scales; the Duel's shields are the best act's or Limit Break's chips + 3, at least 13, re-counted on T2C's trees; Tier 3's Rift, if T2W opens it, the same rule | New Tier 2 draws; fixed shields 13–15 | The Rift is where specialized parties come in (WK9); a hit chips one point whatever its kinds |
| **T2B10** Skill MP by tier | × 1.7 in Tier 2 and × 2.4 in Tier 3 (round(round(MP × hand) × factor), at least 1), at the engine stage; the code's × tier goes | Keep × 2 · × 3 (13–19% fewer deep casts, a healer's refund 94 → 75%); × 1.8 · × 2.6 (SB1's multiplier: 4–6% fewer) | Her bar grows × 1.73 and × 2.46; every class back within 2 points of Tier 1's |
| **T2B11** The base regen | 1% of her bar a depth, five at most in Tiers 1 and 2; Tier 3's crown adds a sixth step, 6% (T2C21, reconciled) | A per-tier share | Tier-free once T2B10 lands; the crown's +4 MP is paid for |
| **T2B12** Statuses | Tier-free: +10% a stack (foes' 15%), cap 3, two rounds, Burn 4%; any new status keeps the step and the cap; D282's three levels carry unless T2C widens them | A step by tier | Percentages hold their share under SB1 |
| **T2B13** Limit Breaks | Tier-free: power × scale × open depth's power, at most 10 hits on one foe, gauge 12; the Bond restart priced by the harness's ramp | A Limit Break power by tier | The offense it multiplies already carries the tier |
| **T2B14** The damage stack | WP31's steps; Tier 2–3 multipliers land in steps 3–4; ceilings on one weak hit ×1.69 · ×2.24 · ×2.54 before statuses; no cap | Cap the product; SB7's fallbacks | The terms price the on-curve act, the Rift the tuned one |
| **T2B15** Defense | Armor as it is: a regular's 100% hit 19.0 · 18.4 · 18.2% at Lv 50, about 21% with the terms' offense; armor's HP a grade the knob | Armor's HP a grade up for Tiers 2–3 | Inside SB13's target; the offense part is the healers' sustain |
| **T2B16** The mirrors | Classes v3's bands carry into every tier (Arms ÷ Tome ±5%, Spellblades ÷ Summoners 90–110%, 70/30 ± 5); the hands first, then T2C's class skills; no hand moves for Tiers 2–3 before the toolbox is measured | Tune Tier 3's Tome Summoner now (89% at Lv 50) | A hand moves Tier 1 too; T2B10 is expected to close Tier 3's MP dip |
| **T2B17** The healers | Paladin ÷ Cleric within ±10% in every tier (today 99–106%); T2C's healer branches keep one shared kit | Per-branch healer numbers | D282's H3 closed D249's miss |
| **T2B18** The simulation's checklist | §4.9's thirteen checks, bands and knobs, against the Tier 1 reference row | — | One list for the packet that builds Tiers 2–3 |
| **T2B19** Accessory viability by tier | D266's rule for every Tier 2–3 form: no mix best in over half the cases, every family someone's best, re-run at Tier 2 and 3 Lv 50; parity holds by construction (Pendant and Charm mirror) | SB8's Toll Bell and Great Pendant values | The Bell retired and the Pendant changed (D264); T2G owns the forms |

**Old previews** ([tier-rework/previews/](../tier-rework/previews/)), carried or retired:

| Page | Status | Why |
|---|---|---|
| balance-summary.html | **Carried** into [balance-tiers.html](previews/balance-tiers.html) | Its three problems re-cast on today's Tier 1: the term (re-sized), the mirror (data), MP (the skill MP factor) |
| balance-sheets.html | **Carried** into [balance-tiers.html](previews/balance-tiers.html) § Sources | The sheets by source, now from the code |
| stats-by-tier.html | **Carried** into [balance-tiers.html](previews/balance-tiers.html) § Sources | Max stats by tier and their sources |
| balance-damage.html | **Carried** into [balance-sim.html](previews/balance-sim.html); its viability section **retired** | Damage and the checks are the simulation's; the forms it ranked are gone (D264, D266) |
| class-weaknesses.html | **Retired**; its by-tier rows carried into [balance-tiers.html](previews/balance-tiers.html) § Weaknesses | Its twins and CP6's narrowing are superseded (D235); the Rift's fronts row carried; its Limit Break coverage is T2C's |
| weaknesses-v2.html | **Retired** | Built and in the manual (D236, D237); its Tiers 2–3 row carried into balance-tiers.html |
