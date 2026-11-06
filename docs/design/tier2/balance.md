# Balance in Tiers 2 and 3

> **Status: round 3, the owner's class feedback (R3-8), 2026-11-05. Nothing here is built.** One doc of the [Tier 2 and
> Tier 3 set](README.md), calls **T2B1–T2B19** from round 1, **T2B20–T2B40** from round 2 and **T2B41–T2B66** from round
> 3, each with a recommendation; no open questions. It carries [stat-balance.md](../tier-rework/stat-balance.md)
> (SB1–SB18), [weaknesses-v2.md](../tier-rework/weaknesses-v2.md) (WK1–WK13) and the combat pass (D282) onto **Tier 1 as
> built** (engine v21, save v36), and in round 3 **measures every class of [classes](classes.md)' round 3 on the harness**:
> the twenty Tier 2 classes against their Tier 1 parents, the twenty-two Tier 3 classes against their Tier 2 parents, the
> comps (the owner's swaps first), the stress check, the knobs and Tier 3's term. The manual ([combat](../../game/combat.md))
> is the game as it plays.
>
> **The owner, round 3:** "I would normally swap both classes at the same time the Brawler with a spellblade, or the
> spellblade with the paladin, that way I'll make my parties balanced." And, from round 2: healers, buffers or hybrid
> damage "become useless overall". **R3-8:** the guardrail holds for every Tier 2 and Tier 3 class, measured; Tier 3's
> promotions take over the crown's measured budget.
>
> **Pages** (desktop, light and dark): [balance by tier](previews/balance-tiers.html) ·
> [Tier 2: the twenty](previews/balance-sim.html) · [Tier 3: the twenty-two](previews/balance-tier3.html) (new) ·
> [the comps](previews/balance-comps.html) · [the stress check](previews/balance-stress.html) ·
> [every call](previews/balance-calls.html).
>
> **How the numbers were made:** round 2's fork was deleted, so it was **rebuilt** (scratch files, not committed) and
> checked against the live engine first: on Tier 1's rules it plays every fight exactly as engine v21 does (Party 1 at Lv
> 50, 192 fights, 5.094 rounds a fight on both). Every rule of classes' round 3 is on it (Pinpoint, the pure pair, Arsenal,
> the twenty-two Tier 3 rules, the crown), with gear's types and forms and Extra Stats' Prowess presets, every Uma built by
> the live harness (`world/balance-party.ts`). **Every stage of the level** (the honeycomb's: 48 fights, 24 sub-bosses, 24
> bosses), **16 seeds**: 1,536 fights a party and level, about 1,900 party-level runs in all. A second set of 16 seeds
> reads every gain within 1.4 points of the first (0.5 typical). [§4.1](#41-how-the-forty-two-were-measured-t2b41)
> lists what is emulated and what is left out.

## 1. At a glance

**The answer to R3-8, in five lines:**

1. **At classes.md's values the forty-two are close, not level.** Measured, **36 of 48** Tier 2 cells and **44 of 54**
   Tier 3 cells sit in the band (each class within ±5 points of the mean gain at Lv 10, 30 and 50). The misses are the
   new kits classes set analytically (the Spellfist −8% and the Battlemage +11% at Lv 50; the pure variants −7 to −9% at Lv
   10; the Astromancer 0% below depth 5 and +17–20% from it; the Thaumaturge −6 to −11%) and three kept classes the
   re-measure moved (the Sentinel +18% at Lv 50, the Druid −9%, the Warlord +9% at Lv 10).
2. **The knobs bring 48 of 48 and 52 of 54 inside.** In classes' order (T2C99): the pure variants' second hands, the
   crosses' hands (**Spellfist ×1.25, Battlemage ×1.1**), Arsenal's hands, the supports' Tier 3 twist without its +0.03,
   **Resonance at 10% on her deepest depth**; then the kept Sentinel, Druid, Warlord and Invoker. One new knob does most of
   it: **the trunk hand**, a class's hand on depths 1–2 apart from her lines' (T2B45). The two cells left are the
   Gladiator's, 0.3 and 0.8 points past the edge, inside the measure's noise. Gear's and Extra Stats' round 3 kits, merged
   mid-round, were re-read: they hold the band if three pure or support classes keep their keeper's Dual (T2B66).
3. **The owner's swaps keep the party in the band, in both tiers.** A Brawler with a Spellblade (C3: Spellfist +
   Bladedancer) runs +3.3 · +3.0 · +5.7% over Party 1, level with the keepers' C1 (+3.7 · +2.6 · +5.8%); a Spellblade with
   the Paladin (C4: Sentinel + Templar) +3.6 · +2.2 · +5.1%. In Tier 3 their lines (T3, T4) sit +2.1 to +6.3% over their
   Tier 2 comps, with the keepers' T1 at +2.0 to +4.7%.
4. **No class is useless.** Every class sits inside its band at the proposed knobs (none worth less to a party than her
   siblings on curve), and almost every one is the better pick somewhere measured: the crosses and the pure variants on
   the Rift's warded fronts (+10 to +21% where their parents lose a channel), the supports and the keeper healers under
   attrition, the battle healers on curve. One rule measured as worth nothing is replaced: **Overflow**, the keeper
   healers' Tier 3 rule (their mends rarely overheal), by **mends and Barriers ×1.3**. The Tier 2 keepers' **stack more**
   works only below depth 5; kept, since the keeper still out-survives her battle healer.
5. **Tier 3's budget holds:** the keepers' lines at Tier 3 Lv 50 are **+17.0% and +18.8%** over the same parties
   uncrowned (the crown alone +11.8% and +14.9%), round 2's +17%; below the crown the rules alone add +2 to +6%.

| | Tier 1 (live) | Tier 2 | Tier 3 | Call |
|---|---|---|---|---|
| **A class against her parent** (party damage a round, her seat swapped) | — | mean **+3.3 · +2.5 · +4.7%** at Lv 10 · 30 · 50; **48 of 48** cells within ±5 | against her Tier 2 parent: mean **+4.7 · +2.9 · +3.9%**; **52 of 54** | T2B43, T2B51 |
| **The comps** | the reference | C1–C10 **+1.0 to +5.8%** over their Tier 1 party | T1–T8 **−0.4 to +9.3%** over their Tier 2 comps; **+9.1 to +17.9%** over Tier 1's parties | T2B58 |
| **The owner's swaps** | — | C3 · C4 level with C1 within 0.7 points; C3b · C4b with C2 within 3.8 | T3 · T4 level with T1 within 2.1 · 3.6 | T2B59 |
| **The stress check** (fights won at ×5, Tier 2; ×6, Tier 3) | Party 1 · 2 at Tier 2 Lv 50: 72 · 65% | keeper healers ahead of battle healers from ×3.2; supports' parties safest | keepers ×1.3 ahead from ×6; supports safest | T2B60 |
| Tier 3's budget at Lv 50 | — | — | **+17.0 · +18.8%** over uncrowned (crown +11.8 · +14.9%) | T2B56 |
| Foes' HP and DEF term (measured) | — | 1.06 → 1.10 (kept) | **1.13 to Lv 40, 1.19 by Lv 50** | T2B36, T2B57 |
| Flat build values | ×1 | ×1.8 | ×2.6 | T2B1 |
| Shields: sub-bosses · bosses | 6 · 8 | 7 · 9 from Lv 1 | 7 · 9 | T2B7 |
| Skill MP · healing divisor | ×1 · ÷ 300 | ×1.7 · ÷ 540 | ×2.4 · ÷ 780 | T2B10, T2C18 |
| The Duel's shields | 13 | at least 14 | **at least 16** | T2B38, T2B62 |

## 2. Tier 1 as built

The baseline every later tier extends. Owned by the manual ([combat](../../game/combat.md), [classes](../../game/classes.md));
every number from the code.

### 2.1 The damage stack

Every hit takes [the manual's ten steps](../../game/combat.md#damage) (WP31, `battleDamage`): offense (ATK or M.ATK + the
weapon's Might + an Orb's flat on her kind + her ★ signature) → `offense² ÷ (offense + defense) × power` (her share × hand
× Skill Rank) → weak ×1.3 → her Insignias ×(1 + 1% a grade, slots added) on sub-bosses and bosses → statuses (each ±10%,
foes' ±15%) → specials (×1.3) → unbroken ×0.5 (Pierce skips) → the Rift's ward ×0.5 → evasion (0.6% a Speed point, 50%
at most) → rounded, at least 1. **Its ceiling on one weak hit** (steps 3–4, before statuses): ×1.69 on a boss.

### 2.2 Where every point comes from (SB1)

Her lead offense at Lv 50, on curve, by source (code; the owner's presets):

| Class | Tier | Her level's stat | Armor | Extra Stats | Pendants or Charms | Orb | Might | **Offense** | Build share | ★ (worn) |
|---|---|---|---|---|---|---|---|---|---|---|
| Brawler (Greatsword) | 1 · 2 · 3 | 113 · 204 · 295 | 25 · 45 · 65 | 51 · 92 · 133 | 20 · 36 · 52 | 20 · 36 · 52 | 68 · 122 · 177 | **297 · 535 · 774** | 62.0 · 61.9 · 61.9% | +5 · +9 · +13 |
| Sorcerer (Fire) | 1 · 2 · 3 | 118 · 213 · 308 | 25 · 45 · 65 | 51 · 92 · 133 | 20 · 36 · 52 | 20 · 36 · 52 | 68 · 122 · 177 | **302 · 544 · 787** | 60.9 · 60.8 · 60.9% | the same |
| Arms Spellblade (Katana) | 1 · 2 · 3 | 113 · 204 · 295 | 25 · 45 · 65 | 42 · 77 · 110 | 20 · 36 · 52 | 20 · 36 · 52 | 68 · 122 · 177 | **288 · 520 · 751** | 60.8 · 60.8 · 60.7% | the same |
| Paladin (Lance) | 1 · 2 · 3 | 103 · 185 · 268 | 25 · 45 · 65 | 45 · 81 · 118 | 20 · 36 · 52 | 20 · 36 · 52 | 68 · 122 · 177 | **281 · 505 · 732** | 63.3 · 63.4 · 63.4% | the same |

Each stat's build share at Lv 50 drifts at most 2.2 points from Tier 1 to Tier 3 (the Brawler's MP 38.2 → 40.4%): HP's and
MP's level parts carry constants that don't scale. Mid-tier the build is a smaller share (a Brawler's lead offense at Lv
10: 32.8 · 22.5 · 19.3%), and the foes' build budget follows the same curve (EP16).

### 2.3 The foes

[The manual's rule](../../game/combat.md#foes) (`rpgFoe`, `rpgFoeTierBudget`): HP (40 + 4.2 × the reference stat at her
lifetime level) × role × rank × the build budget; offense so a 100% hit takes 20% → 28% of an average Uma's HP; **the
budget restarts each tier and its build part is × tier**, so every tier's Lv 50 lands on Tier 1's curve (×2.72 HP and
DEF, ×1.49 offense). Sub-bosses ×3.5, bosses ×5.5. **No Tier 2 or 3 term is built.** A regular's 100% hit on the on-curve
Brawler at Lv 50: 19.0 · 18.4 · 18.2% of her HP by tier.

### 2.4 Shields and weaknesses

Shields by formation 1–6 (an escort's captain 5), Keys and guards 2, a capital's escorts 3, **sub-bosses 6, bosses 8**; a
Break two rounds, ×2, then Steeled. Weaknesses v2 (D236): Tier 1 regulars 2 Arms + 2 elements, sub-bosses and bosses 3;
**Tiers 2 and 3 every rank 3**, a regular by role (strikers and guards 1 + 2, casters and skirmishers 2 + 1), live in the
generator for every tier.

### 2.5 Statuses, MP and Limit Breaks

- **Statuses** (D282): three levels (none on Brawlers and Sorcerers; a path on line A of a secondary weapon from depth 3 at
  1 · 1 · 2 for the Spellblades and Summoners; every Greatsword, Lance and Fire skill for the healers at 1 · 1 · 2 · 2 · 3).
  +10% a stack, **cap 3, and a re-cast adds its stacks to what stands** (`addStatus`), so a status cast every round or two
  sits at 3. Two rounds.
- **MP:** skill MP × her hand × **the tier** in today's code; the base regen 1% of her bar a depth, five at most.
- **Limit Breaks** (D241, D249, D261): her seat's power × her class's scale (0.95 the damage classes, 0.8 the healers) ×
  her open depth's power, at most 10 hits on one foe.

### 2.6 Tier 1, measured on the fork (the anchor)

The fork plays Tier 1 exactly as the live engine. **Tier 1 Lv 50**, 16 seeds; V = D + S in BT a round (T2B21, §4.3):

| | Brawler | Sorcerer | Hybrid | Summoner | Healer | Party (Σ D) | Rounds: fights · sub-bosses · bosses | Taken a fight |
|---|---|---|---|---|---|---|---|---|
| **Party 1** | 1.00 | 1.02 | Arms Spellblade 0.81 + 0.03 | Tome Summoner 0.72 + 0.03 | Paladin 0.37 + 0.33 | 3.91 | 3.98 · 4.90 · 7.83 | 35 · 298 · 465 |
| **Party 2** | 1.06 | 1.10 | Tome Spellblade 0.83 + 0.11 | Arms Summoner 0.72 + 0.09 | Cleric 0.35 + 0.42 | 4.05 | 3.90 · 4.82 · 7.32 | 109 · 409 · 426 |

Every fight won (round 2's fork, its 80 stages; round 3's rebuilt fork plays Tier 1's fights exactly as engine v21,
T2B41). classes.md's analytic anchors (§2.7 there) had the Paladin's statuses at 0.37 BT and a path beside the healer's
same status at 0.03; measured 0.33 and 0.03, and a path no one else carries (the Tome Spellblade's Armor Break)
0.11. **A healer's statuses are worth about a tenth of the party's damage; her mends about nothing on curve** (the party
takes 1–2% of its HP a fight).

## 3. The calls before this round

**Round 1 carried 42 calls** (22 kept, 10 kept and changed, 7 superseded, 3 broken); they stand as round 1 left them and
are listed here unchanged. Round 1's own nineteen calls are re-read against round 2 in [§3.4](#34-round-1s-calls-in-round-2-t2b1t2b19).

### 3.1 Stat balance (SB1–SB18, D196)

| Call | What it said | Status | Why | Now |
|---|---|---|---|---|
| **SB1** The stat budget | Flat values × 1 · 1.8 · 2.6; percentages stay | **Kept** | Shares within 2.2 points (§2.2) | T2B1 |
| **SB2** The model | An analytic model as the yardstick | **Superseded** (D249, D266, D282) | Every Tier 1 number since R1 is measured | T2B2 |
| **SB3** Tier 2's term | × (1 + 0.27 (ℓ − 1) ÷ 49) | **Broken** | Sized on a toolbox that held accessory slots now Tier 1's | T2B4, T2B36 |
| **SB4** Tier 3's term | × (1.08 + 0.40 (ℓ − 1) ÷ 49) | **Broken** | The same | T2B5, T2B36 |
| **SB5** Bosses | The term × 1.1 | **Kept, changed** (D235) | WK8's reason: a regular loses a kind and a boss doesn't | T2B6 |
| **SB6** Boss shields | 6 · 9 · 10 | **Kept, changed** (D207, WK5) | +1 a tier on today's 8 | T2B7 |
| **SB7** The stack and the Rift | Ceilings; the Rift prices the tuned peak | **Kept, changed** (D264, D266) | Three Insignias make Tier 1's ceiling ×1.69 | T2B9, T2B14 |
| **SB8** Accessory viability | The Toll Bell, the Great Pendant | **Broken** | The Bell retired (D264); forms are T2G's | T2B19 |
| **SB9** Channel parity | Families within 0.4 points | **Kept, changed** (D264) | Pendant and Charm mirror | T2B19 |
| **SB10** The hybrids' presets | Single-kind forms on her lead half | **Kept, changed** (D263, D266) | Built | T2G36 |
| **SB11** The Summoner's Arms hand | 0.56 → 0.48 | **Superseded** (D249) | Hands since D249 | T2B16 |
| **SB12** Paladin and Cleric | Branch pairs ±10% | **Superseded** (D282) | One kit (H3) | T2B17 |
| **SB13** Defense | A regular's hit about 18% | **Kept** | 19.0 · 18.4 · 18.2% | T2B15 |
| **SB14** MP knobs | The regen's share, then Vigor | **Kept** | Still the order | T2B11 |
| **SB15** The template | The signature +0.2 a level | **Superseded** (D266) | 0.1 a level × tier | T2U |
| **SB16** Skill Ranks | The balance party on the real pace | **Kept, changed** (D249) | Depths at Lv 10 · 16 · 22 · 29 | T2B3 |
| **SB17** The follow-ups | §13's edits | **Superseded** (D238) | Done | — |
| **SB18** A base MP regen | 0.8% a depth, tier-free | **Kept, changed** (D215) | 1.0%; tier-free with T2B10 | T2B10, T2B11 |

### 3.2 Weaknesses v2 (WK1–WK13, D235–D237)

| Call | What it said | Status | Why | Now |
|---|---|---|---|---|
| **WK1** Lists by rank | Regulars 2 + 2, sub-bosses and bosses 3 | **Kept** | Tier 1's rule | — |
| **WK2–WK4, WK6, WK7, WK10** | The ring leads; Arms from the deck; fixed per stage; locks; icons; one helper | **Kept** | Every tier | — |
| **WK5** Shields stay | Sub-bosses 6, bosses 8 | **Kept** | Tier 1's; Tiers 2–3 step from it | T2B7 |
| **WK8** Tiers 2 and 3 | Every rank 3, a regular by role | **Kept, changed** (D238, R2-6) | Live; the two-kind type comes with the promotion, so no gate | T2B7, T2B8 |
| **WK9** The Rift unchanged | Draws by front | **Kept, changed** (D240, D249) | Re-paired twins, `RIFT_TUNING_V19` | T2B9 |
| **WK11** Engine versions | R3–R5 on v19–v21 | **Superseded** (D238, D257, D261, D282) | Those engines went elsewhere | §7 |
| **WK12** The checks | Both channels, 75% a member, the sim | **Kept, changed** (D263) | On the owner's two parties, every tier | T2B18 |
| **WK13** The Summoner's Tome 0.62 | The mirror's knob | **Superseded** (D249) | 0.57 | T2B16 |

### 3.3 The combat pass (D282)

B1 (foes don't guard), I1, H1 (depth 5 heals the most hurt whole), H2 (the rescue floor), H3 (one healer kit), S1, F1 (the
familiar's hit), D1 (statuses on Greatsword, Lance and Fire), D2 (three levels), D3 (five retired statuses), D4 (the
Sanctum's stacks): **all Kept** in every tier. **D2 is widened, not replaced**, by classes' fourth level (T2C45) with this
doc's rule for it (T2B24).

### 3.4 Round 1's calls in round 2 (T2B1–T2B19)

| Call | Round 1 | Status in round 2 | What changed |
|---|---|---|---|
| T2B1 | Every source keeps its share | **Kept, changed (R2-6–R2-8)** | Round 2's flat sources (Great, Twofold, Kindred, kind rows) × tier; its percentages (types' weak multipliers, Insignia riders, Area, Multi-hit, Life steal, MP back, Area guard, Momentum) unscaled |
| T2B2 | The yardstick is the engine | **Kept** | This round measured the sixteen (T2B20) |
| T2B3 | Class Rank pace | **Kept** | — |
| T2B4, T2B5 | Tier 2's and Tier 3's terms | **Kept, changed (R2-2, R2-6–R2-8)** | The focus (R2-2) and the weapon moon (T2E27) are gone; re-sized on the measured toolbox (T2B36) |
| T2B6 | Bosses × 1.1 | **Kept** | — |
| T2B7 | Shields from the breadth gate | **Kept, changed (R2-6)** | From Tier 2 Lv 1 |
| T2B8 | Weaknesses from the breadth gate | **Superseded (R2-6)** | No gate: types come with the promotion (T2G22) |
| T2B9 | The Rift | **Kept, changed (R2-2)** | The rail re-counted on the sixteen (T2B38) |
| T2B10, T2B11 | Skill MP, the regen | **Kept** | Measured with them |
| T2B12 | Statuses tier-free | **Kept, changed (R2-3)** | Four levels; the support level's rule (T2B24) |
| T2B13 | Limit Breaks | **Kept** | — |
| T2B14 | The damage stack | **Kept, changed (R2-2, R2-6–R2-8)** | No focus; types by grade; step 4b; Momentum (§4.12) |
| T2B15 | Defense | **Kept** | — |
| T2B16 | The mirrors | **Kept, changed (R2-2)** | Mirrored Tier 2 classes (§4.11) |
| T2B17 | The healers | **Kept, changed (R2-3)** | Four healer classes; keeper against battle healer on the stress check |
| T2B18 | The checklist | **Kept, changed** | The guardrail's rows added |
| T2B19 | Accessory viability | **Kept** | Gear holds it (T2G35) |

**Counts (19):** Kept 8 · Kept, changed 10 · Superseded 1 (T2B8, by R2-6) · Broken 0.

### 3.5 Round 2's calls in round 3 (T2B20–T2B40)

| Call | Round 2 | Status in round 3 | What changed |
|---|---|---|---|
| T2B20 | How the sixteen were measured | **Superseded (R3-8)** | The forty-two on a rebuilt fork (T2B41); round 2's read the cross weapon without its Might (T2B42) |
| T2B21 | Party value on the harness | **Kept** | Read as round 2 defined it; T2B41 states the party's damage as HP taken off foes (no overkill) |
| T2B22 | The band | **Kept, changed (R3-4)** | The sixteen damage and support classes in the mean, the four pure variants with the twelve (T2B43) |
| T2B23 | The stress check | **Kept, changed (R3-1, R3-5)** | Tier 3's healers and supports read, multipliers to ×5 (Tier 2) and ×6 (Tier 3) (T2B60) |
| T2B24 | The support level's rule | **Kept, changed** | Its ladder and reach become a class's numbers: the Sentinel one stack, her debuff on the tapped foe (T2B47) |
| T2B25 | The supports' hands | **Kept, changed** | The Sentinel ×0.9, the Druid by depth (T2B47, T2B48); the Enchanter and the Shaman as round 2 |
| T2B26 | Momentum's step | **Kept** | +6% a stack, re-measured in band; also the pure Tier 3 lines' (T2C86) |
| T2B27 | The cross: Spellfist ×1.05, Battlemage ×1.3, the Scatter twins | **Superseded (R3-2, R3-3)** | The reshaped crosses' hands ×1.25 · ×1.1 (T2B44); presets T2C77 |
| T2B28 | The Spellblade keepers | **Kept** | Re-measured in band |
| T2B29 | The Summoner keepers | **Kept, changed** | The Warlord's +0.03 from her lines only, the Invoker's +0.01 (T2B49) |
| T2B30 | The healer keepers | **Kept** (a finding, T2B61) | One stack more works only below depth 5; the keeper still out-survives her battle healer |
| T2B31 | The battle healers | **Kept** | On curve +3 to +12%, behind the keeper from ×3.2 |
| T2B32 | Kindred is support value | **Kept** | In every measured V |
| T2B33 | The knob order | **Kept, changed (R3-8)** | Classes' T2C99 for the new kits, then this order for the kept classes (T2B50) |
| T2B34 | The comps measured (C1–C8) | **Superseded (R3-7)** | C1–C10 and T1–T8 (T2B58) |
| T2B35 | C3's weapons, the Scatter twins | **Superseded (R3-2, R3-3)** | The crosses' one-foe presets (T2C77) |
| T2B36 | The toolbox term | **Kept, changed (R3-1)** | Tier 2's line confirmed; Tier 3's re-sized (T2B57) |
| T2B37 | Tier 3 measured (+17%) | **Superseded (R3-1, R3-8)** | Tier 3's promotions measured against the same budget (T2B56) |
| T2B38 | The Duel's rail | **Kept, changed (R3-1)** | Menagerie's farewells raise Tier 3's to at least 16 (T2B62) |
| T2B39 | A healerless party | **Kept** | Not re-measured: no rule it read moved |
| T2B40 | The previews | **Superseded** | Six pages (T2B65) |

**Counts (21):** Kept 7 · Kept, changed 8 · Superseded 6 (T2B20, T2B27, T2B34, T2B35, T2B37, T2B40).

## 4. Tier 2 in full

### 4.1 How the forty-two were measured (T2B41)

A Tier 2 or 3 world plays Tier 1's rules × tier today, and none of the forty-two is built. Their rules run on a **scratch
fork of `battle/engine.ts` and `battle/auto.ts`** (rebuilt this round; not committed), each Uma built by the live harness
and frozen as the game would, every rule switched per Uma. **Checked first:** on Tier 1's rules the fork plays Party 1 at
Lv 50 exactly as engine v21 (192 fights, 5.094 rounds a fight on both, every Uma's input identical).

| Rule (call) | On the fork |
|---|---|
| **Momentum** (T2C34) | Exact: a factor at step 5, a stack after each act, three at most, lost on a knockout |
| **The cross** (T2C35, T2C71, T2C72) | Exact: every hit on her stat (her other channel's weapon its own Might on her stat), defense, weakness and statuses by the kind's channel; her other channel plays the other pure class's tree; **one act**, her hand on her skills and Attacks, never her Limit Break |
| **Pinpoint** (T2C73) | Exact: an act whose every hit lands on the tapped foe (no splash, no other foe), +2% (+4% Tier 3's crosses) a depth of its skill at step 5, a one-foe Limit Break at her open depth; Auto reads it |
| **The pure pair** (T2C68) | Exact: her lead half from her first two weapons, her second from her third, every hit on her stat; her family's familiar hit or lingering summon; her Light/Dark-side line A as damage at her parent's pure-power factor; no status |
| **The trunk hand** (T2B45) | Exact: a hand on depths 1–2 and Attacks apart from her lines' |
| **Both halves, both summons** (T2C37, T2C38) | Exact, the familiar's hit piercing |
| **The support level** (T2C39–T2C41, T2B24) | Exact: every skill of her Katana, Bow, Light and Dark trees carries its status at her ladder, topped up; Brave and Faith on the Uma she wards; her Barrier after a skill act; her farewell's mend |
| **The healers** (T2C43, T2C44) | Exact: a stack more; ×0.6 power, ×0.7 MP and shares |
| **Tier 3's rules** (T2C82–T2C87) | Exact: Juggernaut (×0.6 unbroken), Resonance (an echo that chips nothing), Spellbind (both halves weak on the tapped foe, +20%), Menagerie (each summon two farewells), the supports' twists, Momentum, Overflow (a mend's overheal a Barrier), ×0.7 power, Arsenal (two two-kind weapons) |
| **The crown** (T2C79) | Exact at Class Rank 50 (Tier 3 Lv 36 on): a capstone's hits ×5.6 ÷ 4.6, +4 MP, a stack more; MP back's sixth 1% |
| **Tier 2's and 3's frame** | Skill MP ×1.7 · ×2.4; the healing divisor 540 · 780; Class Rank on Tier 1's pace (T2B3) |
| **Gear** | Types by grade (Pure ×1.30 + 0.02 a grade, a Dual's partner ×1.10 + 0.02; Keen ×1.50 +, Tempered and Evolved ×1.30 + on both kinds), gear's Suggested types (T2G26, T2G28; the new kits the same rule); forms by T2G36 and its Tier 3 step (Great, Twofold, Great Orb, Kindred from a slot's G5 as every Uma's hits-only bonus, Vow); the six new presets T2C77's |
| **Extra Stats** | Prowess by T2E37 (Offense; Multi-hit for the Spellblades' lines, Area for the Summoners', the pure variants their family's) at step 4b |
| **The measure** (T2B21) | The party's damage **as HP taken off foes** (no overkill), a round, in BT (Party 1's Brawler on the same frame, level and kind of fight); fights 2, sub-bosses 1, bosses 1; S the counterfactual (her statuses, wards, mends, twist and Kindred off) |
| **Left out** | Class lines, line C, Break tips and the extra equipped slots (every class gets them; the build re-measures); two lines held in Tier 3; the Rift but for its wards (T2B63) |

**The stages:** every stage of the level the honeycomb deals (24 regions: 48 fights, 24 sub-bosses, 24 bosses), 16 seeds
each: 1,536 fights a party and level (round 2 had 80 stages). **The noise:** the same parties on a second set of 16
seeds read every gain within 1.4 points (0.5 typical), so a cell within a point of the band's edge is at the edge.

### 4.2 Round 2's crosses re-read (T2B42, a finding)

Round 2 measured the Battlemage at −1.8% at Lv 50 (×1.3 on Fire, Blizzard, Lance) and the Spellfist at +4.3% (×1.05 on
Greatsword, Axe, Thunder). The rebuilt fork reads those kits higher, and reproduces round 2 only when **the cross
weapon's Might is left out**:

| Kit, Tier 2 Lv 50 (her parent's seat, both parties) | With its Might | Without it | Round 2 |
|---|---|---|---|
| Battlemage ×1.3: Fire, Blizzard, Lance on M.ATK | +7.0% | **−1.3%** | −1.8% |
| Spellfist ×1.05: Greatsword, Axe, Thunder on ATK | +1.5% | −0.3% | +4.3% |

So round 2's Battlemage was missing a weapon's Might on a third of her acts, and its knob (×1.3) paid for it. **Every
number this doc carries is re-measured** on the rebuilt fork; round 2's for the kept twelve move by 0 to 4 points but for
three (the Sentinel, the Druid, the Warlord), whose knobs are §4.5's.

### 4.3 The band in round 3 (T2B43; amends T2B22)

**On curve at Tier 2 Lv 10, 30 and 50, each of the sixteen damage and support classes' gain within ±5 points of the
sixteen's mean gain at that level** (round 2's twelve and the four pure variants). The four healers are read on the
stress check. A class's **gain** is the party's damage a round with her in her parent's seat, minus with her parent, over
her parent's V (T2B21); the Brawler's and Sorcerer's children are read in both parties, averaged.

### 4.4 The twenty at classes.md's values

Bold cells sit outside the band.

| Class (parent) | Lv 10 | Lv 30 | Lv 50 | D + S at Lv 50, BT (her parent's V) |
|---|---|---|---|---|
| Berserker (Brawler) | +3.4% | +0.6% | +6.0% | 1.09 (1.00) · 1.22 (1.13) |
| Spellfist (Brawler) | **−4.0%** | −1.2% | **−7.6%** | 1.00 (1.00) · 1.03 (1.13) |
| Archmage (Sorcerer) | +3.8% | +1.5% | +5.8% | 1.10 (1.02) · 1.17 (1.10) |
| Battlemage (Sorcerer) | +5.0% | **+9.1%** | **+10.7%** | 1.22 (1.02) · 1.26 (1.10) |
| Blademaster (Arms Spellblade) | +4.5% | +5.8% | +8.5% | 0.88 + 0.02 (0.83) |
| Sentinel (Arms Spellblade) | +6.4% | **+8.8%** | **+17.8%** | 0.74 + 0.14 (0.83) |
| Bladedancer (Arms Spellblade) | **−8.7%** | −0.2% | +2.7% | 0.83 (0.83) |
| Runeblade (Tome Spellblade) | +3.8% | +0.2% | +4.8% | 0.91 + 0.10 (0.95) |
| Enchanter (Tome Spellblade) | +1.8% | +7.4% | +1.6% | 0.68 + 0.25 (0.95) |
| Spellweaver (Tome Spellblade) | +4.1% | +1.8% | **−1.8%** | 0.94 (0.95) |
| Warlord (Arms Summoner) | **+8.9%** | +2.3% | +6.5% | 0.79 + 0.06 (0.80) |
| Druid (Arms Summoner) | +4.2% | −1.8% | **−8.8%** | 0.65 + 0.12 (0.80) |
| Marshal (Arms Summoner) | **−7.2%** | −1.9% | +3.0% | 0.83 (0.80) |
| Invoker (Tome Summoner) | +5.7% | +7.6% | +6.2% | 0.79 + 0.01 (0.75) |
| Shaman (Tome Summoner) | +5.9% | −0.8% | +4.8% | 0.71 + 0.05 (0.75) |
| Animist (Tome Summoner) | **−8.2%** | +7.7% | +5.5% | 0.78 (0.75) |
| Guardian (Paladin) *(stress)* | +2.1% | +0.0% | +0.0% | 0.37 + 0.14 (0.50) |
| Templar (Paladin) *(stress)* | +8.6% | +7.4% | +12.0% | 0.41 + 0.16 (0.50) |
| Bishop (Cleric) *(stress)* | +12.3% | +0.0% | +0.0% | 0.31 + 0.34 (0.65) |
| Exorcist (Cleric) *(stress)* | +12.1% | +2.8% | +6.7% | 0.34 + 0.32 (0.65) |
| **Mean of the sixteen** | **+1.8%** | **+2.9%** | **+4.1%** | **36 of 48 cells within ±5** |

- **The crosses miss both ways.** The Spellfist (Greatsword, Katana, Fire at ×1) lost her parent's Axe sweep and Lance
  scatter, which Pinpoint's +10% at depth 5 doesn't repay; the Battlemage (Fire, Blizzard, Katana at ×1.25) kept her
  sweep, so ×1.25 is a fifth more on nearly everything she does.
- **The pure variants slope with level**: the Bladedancer, the Marshal and the Animist −7 to −9% at Lv 10 and inside by
  Lv 50, as their one stat's lead over their parent's second half grows (×1.50 a hit at Lv 10 against ×1.69 at Lv 50)
  while an all-one-channel kit Breaks fewer foes early; the Spellweaver the other way (+4.1% → −1.8%), giving up the one
  Armor Break Party 2 has. One hand can't hold both ends (§4.5).
- **The Sentinel +18% at Lv 50:** her Light's Brave and Faith at two stacks on Party 1's Brawler (the Uma she wards is the
  most threatened, the front line) and her Katana's Armor Break on every foe at depth 5; the Paladin beside her carries
  Brave and Faith only on her Light path. Her hand barely moves it (×0.85: +16%): a support's value is in rounds saved,
  not in her own damage.
- **The Druid −9% at Lv 50:** her Mind Break on every foe overlaps the Cleric's, who carries it widely in Party 2.

### 4.5 The knobs, in order (T2B44–T2B50), and the values

Classes' order (T2C99) for the new kits, then round 2's (T2B33) for the kept classes the re-measure moved; each knob
re-measured at Lv 10, 30 and 50 on 16 seeds, the band re-read on the set.

| # | Knob | classes.md | **Proposed** | Amends | Measured effect (Lv 10 · 30 · 50) |
|---|---|---|---|---|---|
| 1 | **The pure variants' second hands** (T2B46), by the trunk hand (T2B45) | 0.32 · 0.41 · 0.40 · 0.37 | **Bladedancer 0.53 trunk, 0.33 lines; Spellweaver 0.44, 0.50; Marshal 0.56, 0.46 (0.40 on gear's merged kits, T2B66); Animist 0.54, 0.33** (lead hands her parent's) | T2C68 | Bladedancer −8.7 · −0.2 · +2.7 → −0.2 · −0.1 · +5.5%; Spellweaver +4.1 · +1.8 · −1.8 → +5.0 · +4.0 · +1.0%; Marshal −7.2 · −1.9 · +3.0 → +0.8 · −1.0 · +4.9%; Animist −8.2 · +7.7 · +5.5 → +2.1 · +3.3 · +3.0% |
| 2 | **Pinpoint's step** (T2C73) | +2% a depth | **Kept**: a bigger step for the Spellfist alone (+3%) moved her as a hand does, and the mirrors share the rule | — | — |
| 3 | **The crosses' hands** (T2B44) | Spellfist ×1, Battlemage ×1.25 | **Spellfist ×1.25, Battlemage ×1.1** | T2C71, T2C72 | Spellfist −4.0 · −1.2 · −7.6 → +3.2 · +1.5 · +3.0%; Battlemage +5.0 · +9.1 · +10.7 → +0.1 · +2.0 · +4.8% |
| 4–8 | Tier 3's (Arsenal, the low rules, Momentum, the battle healers, Overflow) | | §5.2 | | |
| T2B33 (1–2) | **The Sentinel** (T2B47) | ×0.95 (0.68 + 0.42); ladder 1 · 1 · 1 · 2 · 2; debuff every foe at depth 5 | **×0.9 (0.65 + 0.40); ladder one stack at every depth; her Armor Break on the tapped foe only** | T2C39, T2C45 (via T2B24, T2B25) | +6.4 · +8.8 · +17.8 → +4.0 · +1.9 · +9.0% |
| T2B33 (2) | **The Druid** (T2B48) | ×0.95 (0.54 + 0.44) | **0.54 + 0.44 on her trunk, 0.64 + 0.51 (×1.12) on her lines; on gear's merged Bow + Greatsword 0.52 + 0.42 and 0.60 + 0.48 (T2B66)** | T2C39 (via T2B25) | +4.2 · −1.8 · −8.8 → +4.2 · +4.5 · +0.9% |
| T2B33 (5) | **The Summoner keepers** (T2B49) | +0.03 a half | **The Warlord's +0.03 on her lines only (0.57 + 0.46 trunk, 0.60 + 0.49 lines); the Invoker's +0.01 (0.58 + 0.51)** | T2C38 (via T2B29) | Warlord +8.9 · +2.3 · +6.5 → +6.4 · +2.3 · +6.5%; Invoker +5.7 · +7.6 · +6.2 → +3.8 · +7.1 · +4.3% |

- **Why the trunk hand** (T2B45): a class's gain over her parent moves with level for reasons a hand can't follow at both
  ends: a pure variant's stat lead grows, a support's ladder reaches two stacks at depth 4, a keeper's second summon pays
  most in Lv 10's long fights. Splitting her hand at the fork (depth 3, where lines and paths begin) lets each end be set
  on its own. It is one more number on her sheet ("Hand: 0.72 + 0.53 on her trunk, 0.72 + 0.33 on her lines"), and the
  classes it doesn't serve keep one hand. Tested and refused: a hand cut alone (no Lv 50 effect, §4.4); a ladder change
  alone for the Spellblade supports (the Enchanter falls −9% at Lv 50: her Party 2 needs the second stack the Sentinel's
  Party 1 doesn't).
- **Why the crosses' hands, not Pinpoint:** the Spellfist's deficit is her lost sweep and scatter at every depth, and
  Pinpoint grows by depth; a hand fixes all three levels, and the Battlemage, who kept her sweep, comes down by the same
  lever. Her P2 seat stays her weakest (−2.7% at Lv 50: Party 2's Cleric already carries Fire), averaged inside.
- **Why the Sentinel her own ladder:** the Spellblade supports share a rule but not a party. In Party 1 the Sentinel fills
  the Brave-and-Faith gap the Paladin leaves; in Party 2 the Cleric fills it and the Enchanter needs her second stack. So
  the ladder and the reach become **a class's numbers**, as hands are (T2B24 amended).

### 4.6 The twenty at the proposed knobs (the guardrail)

| Class (parent) | Lv 10 | Lv 30 | Lv 50 | D + S at Lv 50, BT (her parent's V) |
|---|---|---|---|---|
| Berserker (Brawler) | +3.4% | +0.6% | +6.0% | 1.09 (1.00) · 1.22 (1.13) |
| Spellfist (Brawler) | +3.2% | +1.5% | +3.0% | 1.17 (1.00) · 1.20 (1.13) |
| Archmage (Sorcerer) | +3.8% | +1.5% | +5.8% | 1.10 (1.02) · 1.17 (1.10) |
| Battlemage (Sorcerer) | +0.1% | +2.0% | +4.8% | 1.12 (1.02) · 1.18 (1.10) |
| Blademaster (Arms Spellblade) | +4.5% | +5.8% | +8.5% | 0.88 + 0.02 (0.83) |
| Sentinel (Arms Spellblade) | +4.0% | +1.9% | +9.0% | 0.71 + 0.09 (0.83) |
| Bladedancer (Arms Spellblade) | −0.2% | −0.1% | +5.5% | 0.84 (0.83) |
| Runeblade (Tome Spellblade) | +3.8% | +0.2% | +4.8% | 0.91 + 0.10 (0.95) |
| Enchanter (Tome Spellblade) | +1.8% | +7.4% | +1.6% | 0.68 + 0.25 (0.95) |
| Spellweaver (Tome Spellblade) | +5.0% | +4.0% | +1.0% | 0.99 (0.95) |
| Warlord (Arms Summoner) | +6.4% | +2.3% | +6.5% | 0.79 + 0.06 (0.80) |
| Druid (Arms Summoner) | +4.2% | +4.5% | +0.9% | 0.74 + 0.10 (0.80) |
| Marshal (Arms Summoner) | +0.8% | −1.0% | +4.9% | 0.86 (0.80) |
| Invoker (Tome Summoner) | +3.8% | +7.1% | +4.3% | 0.77 + 0.01 (0.75) |
| Shaman (Tome Summoner) | +5.9% | −0.8% | +4.8% | 0.71 + 0.05 (0.75) |
| Animist (Tome Summoner) | +2.1% | +3.3% | +3.0% | 0.76 (0.75) |
| Guardian (Paladin) *(stress)* | +2.1% | +0.0% | +0.0% | 0.37 + 0.14 (0.50) |
| Templar (Paladin) *(stress)* | +8.6% | +7.4% | +12.0% | 0.41 + 0.16 (0.50) |
| Bishop (Cleric) *(stress)* | +12.3% | +0.0% | +0.0% | 0.31 + 0.34 (0.65) |
| Exorcist (Cleric) *(stress)* | +12.1% | +2.8% | +6.7% | 0.34 + 0.32 (0.65) |
| **Mean of the sixteen** | **+3.3%** | **+2.5%** | **+4.7%** | **48 of 48 cells within ±5** |

- **Every damage and support class inside, at every level.** The two cells nearest an edge are the Enchanter's and the
  Invoker's at Lv 30 (+4.9 and +4.6 points over the mean), within the measure's noise of it.
- **D and S** (her damage and what the others lose without her statuses, wards and twist, BT): the supports trade D for
  S at about one for one (the Sentinel 0.71 + 0.09 against her parent's 0.83, the Enchanter 0.68 + 0.25 against 0.95);
  the pure variants hold D and lose S (the Bladedancer 0.84 + 0 against 0.83 + 0.01).
- **The healers on curve:** the battle healers +3 to +12%, the keepers +0 to +12% (Lv 10), read on the stress check (§4.9).

### 4.7 The comps, measured (T2B58)

classes.md's C1–C10, each against its Tier 1 party at the same level (Tier 2's toolbox on both); party damage a round in
BT; every fight won.

| Comp | Members | classes.md, Lv 10 · 30 · 50 | **Proposed, Lv 10 · 30 · 50** | Party, Lv 50 (BT) | Rounds, Lv 50: fights · sub · boss | Taken a fight, Lv 50 |
|---|---|---|---|---|---|---|
| **C1** Party 1's keepers | Berserker, Archmage, Blademaster, Invoker, Guardian | +4.2% · +2.8% · +6.3% | **+3.7% · +2.6% · +5.8%** | 4.17 | 3.64 · 4.19 · 6.64 | 6 · 185 · 259 |
| **C2** Party 2's keepers | Berserker, Archmage, Runeblade, Warlord, Bishop | +5.7% · +1.5% · +3.9% | **+4.7% · +1.5% · +3.9%** | 4.29 | 3.54 · 4.14 · 6.35 | 53 · 208 · 325 |
| **C3** a Brawler with a Spellblade | Spellfist, Archmage, Bladedancer, Invoker, Guardian | −0.1% · +2.3% · +2.8% | **+3.3% · +3.0% · +5.7%** | 4.17 | 3.77 · 4.14 · 6.30 | 24 · 146 · 151 |
| **C3b** a Sorcerer with a Tome Spellblade | Berserker, Battlemage, Spellweaver, Warlord, Bishop | +6.7% · +4.4% · +3.2% | **+4.0% · +3.4% · +2.9%** | 4.24 | 3.53 · 4.21 · 6.52 | 68 · 314 · 295 |
| **C4** a Spellblade with the Paladin | Berserker, Archmage, Sentinel, Invoker, Templar | +3.9% · +5.0% · +8.4% | **+3.6% · +2.2% · +5.1%** | 4.15 | 3.69 · 4.17 · 6.67 | 4 · 158 · 140 |
| **C4b** a Tome Spellblade with the Cleric | Berserker, Archmage, Enchanter, Warlord, Exorcist | +4.2% · +5.3% · +3.8% | **+4.2% · +5.3% · +3.8%** | 4.28 | 3.49 · 4.23 · 6.37 | 11 · 292 · 190 |
| **C5** both swaps on one party | Spellfist, Archmage, Bladedancer, Shaman, Templar | +0.1% · +1.6% · +2.5% | **+4.5% · +4.2% · +5.7%** | 4.17 | 3.76 · 4.07 · 6.47 | 24 · 107 · 123 |
| **C6** all pure (Party 1) | Berserker, Archmage, Bladedancer, Animist, Guardian | −0.1% · +2.9% · +4.9% | **+3.4% · +2.1% · +4.7%** | 4.13 | 3.66 · 4.20 · 6.82 | 6 · 220 · 337 |
| **C6b** all pure (Party 2) | Berserker, Archmage, Spellweaver, Marshal, Bishop | +1.9% · +1.3% · +2.2% | **+4.2% · +2.1% · +3.1%** | 4.25 | 3.54 · 4.18 · 6.48 | 54 · 219 · 387 |
| **C7** all hybrid | Spellfist, Battlemage, Blademaster, Invoker, Guardian | +1.6% · +3.8% · +4.6% | **+2.3% · +4.9% · +5.7%** | 4.17 | 3.72 · 4.16 · 6.41 | 43 · 164 · 273 |
| **C8** both hybrids to support | Berserker, Archmage, Sentinel, Shaman, Guardian | +3.9% · +1.9% · +5.8% | **+3.4% · +1.0% · +3.1%** | 4.07 | 3.73 · 4.22 · 6.97 | 7 · 199 · 210 |
| **C9** a Summoner to support | Berserker, Archmage, Runeblade, Druid, Bishop | +5.3% · +0.5% · +1.5% | **+5.3% · +1.5% · +3.5%** | 4.27 | 3.54 · 4.15 · 6.45 | 60 · 209 · 417 |
| **C10** every member an expander | Spellfist, Battlemage, Sentinel, Shaman, Templar | +2.4% · +4.9% · +6.8% | **+5.0% · +2.3% · +4.7%** | 4.13 | 3.77 · 4.11 · 6.62 | 5 · 83 · 90 |

- **Every Tier 2 comp sits +1.0 to +5.8% over its Tier 1 party** at every level, inside ±5 points of the comps' mean
  (+3.7%): Tier 1-like, swapped-pure, swapped-support and all-hybrid alike (R2-11).
- **classes.md's values spread them −0.1 to +8.4%**; the crosses' knobs lift C3 and C5 (+3.4 and +4.4 points at Lv 10)
  and the Sentinel's bring C4, C8 and C10 down (−2 to −3 points at Lv 50).
- **The support-heavy comps take the least** (C10 5 · 83 · 90 a fight at Lv 50, C4 4 · 158 · 140, against C1's 6 · 185 ·
  259 and C6's 6 · 220 · 337): the owner can field them at no pace cost.

### 4.8 The owner's swaps (T2B59; R3-7)

**Does a Brawler with a Spellblade, or a Spellblade with the Paladin, keep the party inside the band? Yes, in Tier 2 and
in Tier 3,** at the proposed knobs:

| Swap | Tier 2 comp: over its Tier 1 party, Lv 10 · 30 · 50 | Against the keepers' comp | Tier 3 comp: over its Tier 2 comp | Against the keepers' line |
|---|---|---|---|---|
| **A Brawler with a Spellblade** (Spellfist + Bladedancer, Party 1) | C3 **+3.3 · +3.0 · +5.7%** | C1 +3.7 · +2.6 · +5.8%: within 0.4 points | T3 +3.1 · +2.1 · +2.6% | T1 +4.1 · +2.0 · +4.7%: within 2.1 |
| Its mirror (Battlemage + Spellweaver, Party 2) | C3b **+4.0 · +3.4 · +2.9%** | C2 +4.7 · +1.5 · +3.9%: within 1.9 | T3b +3.7 · +4.3 · +3.0% | T2 +6.0 · +2.4 · +3.3%: within 2.3 |
| **A Spellblade with the Paladin** (Sentinel + Templar, Party 1) | C4 **+3.6 · +2.2 · +5.1%** | C1: within 0.7 | T4 +6.3 · +5.6 · +4.6% | T1: within 3.6 |
| Its mirror (Enchanter + Exorcist, Party 2) | C4b **+4.2 · +5.3 · +3.8%** | C2: within 3.8 | T4b +9.3 · +5.1 · +4.0% | T2: within 3.3 |
| Both swaps on one party (Spellfist, Bladedancer, Shaman, Templar) | C5 **+4.5 · +4.2 · +5.7%** | C1: within 1.6 | T5 +4.8 · +3.2 · +6.0% | T1: within 1.3 |

And each member of each swap sits inside her own band (§4.6, §5.3). **What the swaps change is the party's shape, not its
speed:** the Brawler-and-Spellblade swap moves an element to the Brawler's seat and the Spellblade's Thunder to an Arm
(C3 takes 24 · 146 · 151 a fight at Lv 50 against C1's 6 · 185 · 259); the Spellblade-and-Paladin swap trades a third of
the healer's healing for the Sentinel's ward and statuses, and the party takes less (4 · 158 · 140).

### 4.9 The stress check (T2B23, T2B60)

**The design** (T2B23, kept): each region's elite, its boss's first wave and its boss **as one fight** (three waves, HP
and MP carried, the breather between), foes' offense multiplied, Tier 2 Lv 50 and Tier 3 Lv 50, 16 seeds (384 fights a
cell); read wins, knockouts, damage taken and the party's damage a round, and each healer and support again with **her
healer's sustain off** (mends, Barriers, revives off; statuses kept). **Round 3 extends the multipliers** to ×4 and ×5 in
Tier 2 and ×5 and ×6 in Tier 3: on the honeycomb's stages a party wins everything to ×3.2, so the old range never reached
where a healer decides.

**Where sustain matters** (Tier 2 Lv 50, the Tier 1 parties in Tier 2's toolbox; won · KOs a fight, healer on / off):

| | ×2.6 | ×3.2 | ×4 | ×5 |
|---|---|---|---|---|
| Party 1 | 100% · 0.14 / 89% · 1.15 | 99% · 0.33 / 73% · 2.05 | 92% · 0.99 / 46% · 3.17 | 72% · 2.09 / 30% · 3.91 |
| Party 2 | 100% · 0.21 / 90% · 1.35 | 100% · 0.37 / 66% · 2.45 | 93% · 1.00 / 40% · 3.51 | 65% · 2.33 / 23% · 4.13 |

**The healers** (each in her parent's seat):

| Healer | On curve, Lv 10 · 30 · 50 | ×3.2 | ×4 | ×5 |
|---|---|---|---|---|
| Guardian (Party 1) | +2.1 · 0 · 0% | 99.2% · 0.33 | **92.2% · 0.99** | **71.9% · 2.09** |
| Templar | **+8.6 · +7.4 · +12.0%** | 98.4% · 0.50 | 88.3% · 1.22 | 65.1% · 2.37 |
| Bishop (Party 2) | +12.3 · 0 · 0% | 99.7% · 0.37 | **93.0% · 1.00** | **65.1% · 2.33** |
| Exorcist | **+12.1 · +2.8 · +6.7%** | 98.7% · 0.56 | 88.8% · 1.27 | 61.7% · 2.48 |

**Each healer is the better pick somewhere:** the battle healer on curve, the keeper from ×3.2 (+1 point of fights won
there, +3 to +7 at ×4 and ×5). **A finding (T2B61):** from depth 5 the keeper plays exactly her parent's fights, on curve and under attrition,
because Auto casts her capstones and a capstone's statuses already stand at three; her stack more works at depths 1–4
(Tier 2 Lv 1–28). The trade holds because the battle healer gives up a third of her healing.

**The hybrids' children** (×4; won · KOs, then the healer's sustain off):

| Seat | Keeper | Support | **Pure** |
|---|---|---|---|
| Arms Spellblade (Party 1; parent 92.2% · 0.99 / 46.4%) | Blademaster 93.8% · 0.89 / 49.5% | **Sentinel 93.8% · 0.87 / 59.4%** | Bladedancer 95.8% · 0.78 / 49.7% |
| Tome Spellblade (Party 2; parent 93.0% · 1.00 / 39.8%) | Runeblade 92.7% · 1.02 / 42.7% | **Enchanter 93.8% · 1.01 / 55.5%** | Spellweaver 94.8% · 0.95 / 43.0% |
| Arms Summoner (Party 2) | Warlord 93.2% · 0.98 / 43.0% | **Druid 94.5% · 0.85 / 64.3%** | **Marshal 78.6% · 1.58 / 28.1%** |
| Tome Summoner (Party 1) | Invoker 92.4% · 0.96 / 49.5% | **Shaman 95.3% · 0.79 / 65.9%** | **Animist 79.7% · 1.60 / 33.3%** |

- **Every support's party is the safest of her three** with the healer down (+10 to +21 points of fights won over her
  keeper's), as R2-3 asks of "a little of the healers' kit".
- **The pure Summoners are the least safe pick in the game** (−13 to −15 points at ×4): they give up their parent's Bow or
  Dark path (Enfeeble or Mind Break on the tapped foe) and their kit has no ward. The pure Spellblades are as safe as their
  keepers. This is the pure variants' price, as the owner's "pure" asks; the party hint (T2C94) can name it ("No
  sustain beside a pure Summoner").

### 4.10 Is any class useless? (T2B64)

**No.** Every class sits inside her band at the proposed knobs, so none is worth less to a party on curve than her
siblings, and almost every one is the better pick somewhere measured. The Rift's wards (T2B63; every foe of Tier 2 Lv 50's
stages warding one channel, her gain over her parent there):

| Siblings | Where each is the better pick (measured) |
|---|---|
| Berserker · **Spellfist** | The Berserker on curve and on Iron fronts (magic warded: +5.4 · +7.3%); **the Spellfist on Arcane fronts** (physical warded: **+10.3 · +11.9%** against +3.4 · +5.5%) |
| Archmage · **Battlemage** | The Archmage on curve at Lv 10 and 50 and on Arcane fronts (+8.0 · +10.0%); **the Battlemage on Iron fronts (+17.8 · +17.1%** against +2.5 · +4.3%) |
| Blademaster · Sentinel · **Bladedancer** | The Blademaster on curve at Lv 10 and 30 and on Arcane fronts; the Sentinel at Lv 50 and under attrition; **the Bladedancer on Iron fronts (+12.3%** against +3.2 and −3.2%) |
| Runeblade · Enchanter · **Spellweaver** | The Runeblade at Lv 50; the Enchanter at Lv 30, under attrition and on Iron fronts (+8.0%); **the Spellweaver on Arcane fronts (+15.6%** against +6.8 and −3.3%) and at Lv 10 |
| Warlord · Druid · **Marshal** | The Warlord at Lv 10 and 50; the Druid at Lv 30, under attrition and on Arcane fronts (+15.1%); **the Marshal on Iron fronts (+21.4%** against +6.2 and +3.4%) |
| Invoker · Shaman · **Animist** | The Invoker at Lv 30; the Shaman at Lv 10 and 50, under attrition and on Arcane fronts; **the Animist ahead of the Shaman at Lv 30 (+3.3 against −0.8%)**, nowhere first: the weakest niche of the forty-two (her Arcane front −2.2%: she gives up the path a long warded fight pays for) |
| Guardian · Templar; Bishop · Exorcist | The battle healer on curve, the keeper from ×3.2 |

The Animist is in the band at every level, so she is no worse than her siblings on curve; she is simply never the
standout. If the owner wants her to have a place of her own, the knob is her trunk hand's line value (0.33 → 0.36 puts
her ahead of the Invoker at Lv 50); recommended to leave it: a pure Summoner's place is the all-elemental party (C6),
which holds every kind and runs +2 to +5%.

### 4.11 The mirrors (T2B16)

| Mirrors (gain, Lv 10 · 30 · 50, proposed) | Arms-led | Tome-led | Apart, at most |
|---|---|---|---|
| Berserker · Archmage | +3.4 · +0.6 · +6.0% | +3.8 · +1.5 · +5.8% | 0.9 points |
| Spellfist · Battlemage | +3.2 · +1.5 · +3.0% | +0.1 · +2.0 · +4.8% | 3.1 |
| Blademaster · Runeblade | +4.5 · +5.8 · +8.5% | +3.8 · +0.2 · +4.8% | 5.6 (Lv 30) |
| Sentinel · Enchanter | +4.0 · +1.9 · +9.0% | +1.8 · +7.4 · +1.6% | 7.4 (Lv 50) |
| Bladedancer · Spellweaver | −0.2 · −0.1 · +5.5% | +5.0 · +4.0 · +1.0% | 5.2 |
| Warlord · Invoker | +6.4 · +2.3 · +6.5% | +3.8 · +7.1 · +4.3% | 4.8 |
| Druid · Shaman | +4.2 · +4.5 · +0.9% | +5.9 · −0.8 · +4.8% | 5.3 |
| Marshal · Animist | +0.8 · −1.0 · +4.9% | +2.1 · +3.3 · +3.0% | 4.3 |

Four of eight pairs within 5 points, three within 0.6 of it, the Spellblade supports 7.4 apart: each mirror sits in a
different party (Party 1 against Party 2), and the band, not the mirror, is the guardrail (T2B16 kept as a secondary check).

### 4.12 Every source keeps its share, and the stack (T2B1, T2B14)

As round 2 (T2B1, T2B14): flat values ×1.8 and ×2.6, percentages unscaled; **Pinpoint** joins step 5 beside the statuses
and Momentum, **the trunk hand** is a hand (power), and a cross reads her one stat on every hit. Ceilings on one weak hit
before statuses ×1.69 · ×2.22 · ×2.62 (gear's T2G37); Pinpoint at depth 5 ×1.1 (Tier 3's crosses ×1.2) on top.

### 4.13 The foe term (T2B4, T2B36)

Re-measured on the rebuilt fork (the speed K: rounds of the Tier 1 parties on a later world's frame alone, over the
keepers' comps with the whole toolbox; the term ≈ 1 + 0.7 (K − 1)):

| Tier · Lv | Frame alone | The keepers' comps | K | The term it needs | **Proposed** |
|---|---|---|---|---|---|
| Tier 2 · 10 | 5.06 | 4.58 (C1, C2) | 1.104 | 1.07 | 1.06 → 1.10 (kept) |
| Tier 2 · 30 | 3.49 | 3.30 | 1.057 | 1.04 | |
| Tier 2 · 50 | 5.09 | 4.46 | 1.142 | 1.10 | **1.10** |
| Tier 3 · 10 | 4.87 | 4.06 (T1, T2) | 1.198 | 1.14 | **1.13** |
| Tier 3 · 20 | 4.15 | 3.47 | 1.197 | 1.14 | 1.13 |
| Tier 3 · 30 | 3.55 | 3.06 | 1.160 | 1.11 | 1.13 |
| Tier 3 · 35 | 3.71 | 3.20 | 1.156 | 1.11 | 1.13 |
| Tier 3 · 40 | 3.67 | 3.16 | 1.163 | 1.11 | 1.13 |
| Tier 3 · 50 | 4.66 | 3.68 | 1.266 | 1.19 | **1.19** |

**Tier 2's line stands** (1.06 → 1.10, offense +10% by Lv 50, bosses × 1.1). **Tier 3's is re-sized (T2B57): × 1.13 from
Lv 1 to 40, rising to × 1.19 by Lv 50** (round 2: 1.10 → 1.12 by Lv 35, rising to 1.26 by Lv 40). The rules now act from
Class Rank 1, so Tier 3's early levels need +0.01 to +0.03 more (classes' T2C92 estimate); the crown at Lv 36 shows less
than round 2 priced (its masteries, the Astromancer's 30% capstone echo above all, are gone), and the step to Lv 50 is the
toolbox's, as in Tier 2. Provisional until the build's own run.

### 4.14 Shields, weaknesses, the Rift (T2B7, T2B8, T2B9, T2B38, T2B62)

- **Shields 7 · 9 from Tier 2 Lv 1, and 7 · 9 in Tier 3** (T2B7, kept): no new class adds a two-kind weapon but the
  Gladiator and the Thaumaturge (Arsenal), whose second Dual raises their own answers, not the party's past gear's 4.1–4.5
  a regular. **Weaknesses** (T2B8) as round 2.
- **The Duel's rail (T2B62):** a hit chips one point whatever its kinds, so a lone champion takes one point a hit. Round 2
  counted the keepers' twists (the Warlord's second farewell 11, the Blademaster's second familiar 10). Round 3 adds
  **Menagerie** (the Overlord's and Hierarch's summons farewell twice: four farewells a pair at steady state, **13**), the
  supports' twists (the Herald's and Oracle's 10, the Archdruid's and Soulcaller's 11) and Momentum (no chip). **The
  Duel's shields: at least 14 in Tier 2, at least 16 in Tier 3** (the best act's chips + 3). Counted from the kits, not
  measured: the build's run on the Rift confirms.
- **The Rift's wards (T2B63):** measured above (§4.10): each cross and pure variant is the pick on one warded front.

### 4.15 Statuses, MP and Limit Breaks (T2B10–T2B13, T2B24)

| Level | Tier 2 classes | Ladder by depth | Stacking | Reach |
|---|---|---|---|---|
| None | Berserker, Spellfist, Archmage, Battlemage, Bladedancer, Spellweaver, Marshal, Animist | — | — | — |
| A path | Blademaster, Runeblade, Warlord, Invoker | 1 · 1 · 2 (line A, depth 3–5) | Built up | The tapped foe |
| **Support** | Enchanter, Druid, Shaman · **Sentinel** | 1 · 1 · 1 · 2 · 2 · **the Sentinel 1 · 1 · 1 · 1 · 1** | Topped up | Spellblades' debuff the tapped foe, every foe at depth 5 (**the Sentinel's the tapped foe only**); Summoners' every foe; Brave and Faith on her ward |
| Widely | Guardian, Bishop (+1 stack), Templar, Exorcist | 1 · 1 · 2 · 2 · 3; path 2 · 2 · 3 | Built up | The tapped foe, every foe at depth 5; buffs every Uma |

MP and the regen (T2B10, T2B11) as round 2: no class ran dry on curve, the crosses' ×1.25 · ×1.1 hands included (a hand
never scales MP). Limit Breaks (T2B13) tier-free; Momentum and Pinpoint multiply a Limit Break, a hand never does.

### 4.16 What the simulation must confirm (T2B18)

At the engine stages that build the forty-two (`t2Classes`, `t3Classes`), on `balance-t2.test.ts`, 16 seeds a stage (32
for a delivery), round 2's sixteen checks with round 3's bands:

| # | Check | Band | Measured here |
|---|---|---|---|
| 1 | Wins on curve | 100% | 100% |
| 2 | Rounds against Tier 1's at the same tier level | ±10% with the term | the term's table (§4.13) |
| 7 | The mirrors | within 5 points | 4 of 8 pairs (§4.11) |
| 12 | The Duel's rail | no act Breaks a Duel boss | 13 chips against 16 (Tier 3) |
| **14** | **The guardrail, Tier 2** (T2B43) | the sixteen within ±5 of their mean at Lv 10, 30, 50 | **48 of 48** |
| **14b** | **The guardrail, Tier 3** (T2B51) | the eighteen within ±5 of their mean against their Tier 2 parents | **52 of 54** (the Gladiator's two at 0.3 and 0.8 past) |
| **15** | **The comps** (T2B58) | within ±5 of the comps' mean | C1–C10 +1.0 to +5.8%; T1–T8 −0.4 to +9.3% over their Tier 2 comps (T4b at Lv 10 0.1 past the edge) |
| **16** | **The stress check** (T2B60) | the keeper ahead of her battle healer from ×3.2 (Tier 2) or ×6 (Tier 3); every support's party safest with the healer down | met |

Round 2's checks 3–6, 8–11 and 13 stand as round 2 listed them.

### 4.17 Gear's and Extra Stats' round 3 kits, re-read (T2B66)

Gear's round 3 and the touch-ups merged while this round ran: **new Suggested types** (gear's T2G51, T2G56), **presets for
the forty-two** (T2G58: the one-foe pure pair's Orb a Twofold Orb on her lead two) and **Offense as every one-stat class's
Prowess** (extra stats' T2E51). §4.4–§4.11 and §5 were measured on the kits §4.1 lists (round 2's type rule on the new
kits: one Dual, the rest Pure; Multi-hit and Area for the pure variants). The classes whose kit differs were re-read on the
merged kits at the proposed hands (16 seeds, Lv 10 · 30 · 50):

| Class | What differs | Gain on the merged kits | Inside? |
|---|---|---|---|
| Spellfist | Dual Katana + Axe (was Greatsword + Bow) | +4.9 · +3.1 · +7.9% | Yes |
| Bladedancer | Pure ×3, Offense, Twofold Orb (Katana + Axe) | −1.6 · +3.1 · +0.5% | Yes (Lv 50 within 0.3) |
| Spellweaver | Offense, Twofold Orb (Thunder + Blizzard) | +5.7 · +6.0 · +1.1% | Yes |
| **Enchanter** | **Pure ×3** (was Dual Katana + Axe) | **−3.9** · +6.2 · +0.9% | **No: −1.8 points past at Lv 10** |
| **Druid** | Dual Bow + Greatsword (was Dark + Fire) | +8.6 · +2.9 · +9.8% | **At the edge** (Lv 10 and 50 within 0.3) |
| **Marshal** | **Pure ×3**, Offense | **−15.7 · −5.3 · −4.1%** | **No, at every level** |
| **Animist** | **Dual Blizzard + Light** (was Dark + Fire), Offense | **−9.3** · +2.0 · **−2.0%** | **No** |
| Dervish · Imperator (Tier 3) | Keen ×3, Offense | +6.0 · +2.7 · +5.3% · +3.8 · +3.4 · +4.0% | Yes |
| Starweaver · Mythlord (Tier 3) | Keen ×3, Offense | −1.5 · −0.2 · −1.3% · −2.7 · +0.9 · +0.4% | Lv 10 within 1.2 and 2.4 points past |

**What it shows:** Offense is the better Prowess for the pure variants (the Marshal on her keeper's Dual: +2.0 · −0.4 ·
+11.8% with Offense, +0.8 · −1.0 · +4.9% with Area), so **T2E51 is confirmed**. But **Pure ×3 on the Marshal and the
Enchanter and the Animist's Blizzard + Light Dual cost them their band** (6 to 17 points at Lv 10): a Summoner's area hits
and a support's every-act statuses reach every foe, so a partner kind's weakness pays on every foe struck, which gear's
coverage search (the fewest kinds in one hand) doesn't price.

**Recommended for the cross-reference (T2B66):** gear's T2G51 for every class but three, who keep **their keeper
sibling's Dual: the Enchanter Katana + Axe, the Marshal Bow + Greatsword, the Animist Dark + Fire** (amends gear's T2G51;
gear's bound to re-check on the three); **Offense for the four pure variants** (T2E51); and on those kits two hands move:
**the Marshal's lines 0.46 → 0.40** (Offense lifts her Lv 50) and **the Druid's on gear's Bow + Greatsword: 0.52 + 0.42 on
her trunk, 0.60 + 0.48 on her lines** (in place of T2B48's 0.54 + 0.44 · 0.64 + 0.51). Measured on the reconciled kits:

| Class | Reconciled kit | Lv 10 · 30 · 50 |
|---|---|---|
| Marshal | Dual Bow + Greatsword, Offense, lines 0.40 | +2.0 · −1.9 · +7.7% |
| Animist | Dual Dark + Fire, Offense | +3.1 · +6.6 · +8.4% |
| Enchanter | Dual Katana + Axe (round 2's) | +1.8 · +7.4 · +1.6% |
| Druid | Dual Bow + Greatsword, 0.52 + 0.42 trunk, 0.60 + 0.48 lines | +2.8 · +2.6 · +2.7% |

With the other merged kits above, **all sixteen sit inside** (means +3.4 · +3.0 · +5.3%; nearest the edge the Marshal at
Lv 30 and the Bladedancer at Lv 50, within 0.2). The comps holding these classes (C3, C5, C6, C6b, C9) move by about a
point; Tier 3's pure lines follow their parents (the Starweaver and the Mythlord re-read on the build's run). The
alternative is gear's T2G51 whole, with the Marshal's hands raised by about a third and the Animist's trunk to 0.66
(estimated, not measured): bigger hands to buy back a partner kind.

## 5. Tier 3 in full

### 5.1 The Tier 3 band (T2B51; confirms T2C92)

**On curve at Tier 3 Lv 10, 30 and 50, each of the eighteen Tier 3 damage and support classes' gain over her Tier 2
parent within ±5 points of the eighteen's mean**, both in Tier 3's frame (×2.6 toolbox, Tier 3 types and forms, skill MP
×2.4, the crown on both from Class Rank 50 at Lv 36); the four healer classes on the stress check. Each child sits in her
parent's seat of the keepers' comp of her Tier 1 line (C1 for Party 1's classes, C2 for Party 2's; the Brawler's and the
Sorcerer's lines in both). The parents wear the proposed Tier 2 knobs (§4.5).

**At classes.md's values** (Tier 2 parents at classes.md's values too):

| Class (parent) | Lv 10 | Lv 30 | Lv 50 | D at Lv 50, BT (her parent's V) |
|---|---|---|---|---|
| Ravager (Berserker) | +7.9% | +2.5% | +5.6% | 1.23 (1.13) · 1.30 (1.20) |
| Spellhammer (Spellfist) | +1.9% | +3.0% | +2.7% | 1.15 (1.08) · 1.18 (1.11) |
| Gladiator (Spellfist) | **+22.3%** | +3.1% | +8.3% | 1.16 (1.08) · 1.24 (1.11) |
| Astromancer (Archmage) | **+0.0%** | **+17.0%** | **+19.6%** | 1.33 (1.03) · 1.40 (1.10) |
| Spellknight (Battlemage) | +1.9% | +4.8% | +4.8% | 1.23 (1.17) · 1.29 (1.24) |
| Thaumaturge (Battlemage) | **−5.6%** | **−11.1%** | **−5.7%** | 1.02 (1.17) · 1.09 (1.24) |
| Bladelord (Blademaster) | +2.6% | +3.9% | +5.7% | 0.94 (0.90) |
| Herald (Sentinel) | +7.9% | +8.4% | +8.6% | 0.78 (0.93) |
| Dervish (Bladedancer) | +3.8% | +3.7% | +2.0% | 0.88 (0.84) |
| Runelord (Runeblade) | +2.9% | +1.5% | +3.1% | 0.96 (1.01) |
| Oracle (Enchanter) | **+11.7%** | **+10.2%** | +4.2% | 0.72 (0.95) |
| Starweaver (Spellweaver) | +2.3% | +1.8% | +2.8% | 0.98 (0.93) |
| Overlord (Warlord) | +1.1% | +0.9% | +1.2% | 0.75 (0.79) |
| Archdruid (Druid) | **+10.8%** | +7.9% | +5.7% | 0.65 (0.74) |
| Imperator (Marshal) | +4.8% | +2.6% | +3.2% | 0.84 (0.81) |
| Hierarch (Invoker) | +2.7% | +0.9% | +2.3% | 0.73 (0.75) |
| Soulcaller (Shaman) | +9.6% | +5.6% | +3.5% | 0.69 (0.73) |
| Mythlord (Animist) | +5.5% | +4.2% | +5.5% | 0.76 (0.73) |
| Bastion (Guardian) *(stress)* | +0.0% | +0.0% | +0.0% | 0.32 (0.47) |
| Inquisitor (Templar) *(stress)* | +8.7% | +13.6% | +11.7% | 0.42 (0.55) |
| Cardinal (Bishop) *(stress)* | −6.5% | +0.0% | −0.2% | 0.29 (0.61) |
| Hierophant (Exorcist) *(stress)* | +15.4% | +7.5% | +13.9% | 0.39 (0.62) |
| **Mean of the eighteen** | **+5.2%** | **+3.9%** | **+4.6%** | **44 of 54 cells within ±5** |

- **The Astromancer's Resonance** echoes capstones only: **nothing below depth 5** (Tier 3 Lv 29) and, from it, a
  capstone again at 30% is a fifth more on her best act (+17 to +20%).
- **The Thaumaturge** loses to a Battlemage at ×1.25 (−6 to −11%): Arsenal's hand ×1.05 was set against it; with the
  Battlemage at ×1.1 she sits inside (§5.3).
- **The supports' Tier 3 twist with +0.03** (the Oracle, the Archdruid; the Soulcaller and the Herald at the edge): the
  twist alone carries them; the hands add a second step.

### 5.2 Tier 3's knobs (T2B52–T2B55), in classes' order (T2C99, items 4–8)

| # | Knob | classes.md | **Proposed** | Amends | Measured effect (Lv 10 · 30 · 50) |
|---|---|---|---|---|---|
| 4 | **Arsenal's hands** (T2B53) | ×1.05 both | **Gladiator ×1.05 on her trunk, ×1.2 on her lines; Thaumaturge ×1.1** | T2C83, T2C84, T2C85 | Gladiator (against the ×1.25 Spellfist) +6.9 · −5.8 · −0.5 → +6.9 · −2.4 · +9.7%; Thaumaturge +1.8 · 0.0 · +1.2 → +4.4 · +1.1 · +4.3% |
| 5 | **The low Tier 3 rules** (T2B54): the supports' twist | Her keeper sibling's twist **and** hands +0.03 a half | **The twist alone** (her Tier 2 hands) | T2C86 | Herald +9.2 · +6.5 · +4.4 → +6.3 · +4.6 · +1.2%; Oracle +9.8 · +10.2 · +4.2 → +7.7 · +6.0 · +3.1%; Archdruid +10.8 · +7.5 · +1.3 → +5.1 · +5.7 · −0.2%; Soulcaller +9.6 · +5.6 · +3.5 → +4.7 · +2.8 · +1.7% |
| 5 | Menagerie's farewell share | Each summon two farewells | **Kept** (the Overlord +1.8 · +0.9 · +1.2%, the Hierarch +3.1 · +0.8 · +4.1%, inside) | — | — |
| 5b | **Resonance** (T2B52; not in T2C99's list: the mastery was carried as round 2 measured it) | Capstones strike again at 30% | **Her deepest open depth's skills strike again at 10%**, the echo chipping nothing | T2C82, T2C84 | Astromancer 0.0 · +16.1 · +20.1 → +7.7 · +2.3 · +6.4%; tested: 15% on her deepest (+10.8 · +5.8 · +9.4), 12% on capstones (0 · +4.3 · +6.8) |
| 6 | Momentum on the pure Tier 3 lines | +6% a stack | **Kept** (Dervish, Starweaver, Imperator, Mythlord +1.8 to +6.9%, inside) | — | — |
| — | Pinpoint doubled (Spellhammer, Spellknight) | +4% a depth | **Kept**: +5% lifted the Spellknight's Lv 30 to +8.5% (out) | — | Spellhammer +1.7 · −0.7 · +3.6%; Spellknight +1.9 · +6.1 · +2.9% |
| 7 | The Tier 3 battle healers' power | ×0.7 | **Kept**: the on-curve pick (+8 to +18%); ×0.65 or shares ×0.6 moved nothing under attrition | — | §5.5 |
| 8 | **Overflow's cap** (T2B55) | A mend past max HP a Barrier, up to 10% of max HP | **Replaced: the Bastion's and Cardinal's mends and Barriers ×1.3**, sustain only | T2C82, T2C87 | Overflow at 0, 10, 20 and 30% plays the same fights (her mends aim at the most hurt, so they rarely overheal); ×1.3: fights won at ×6 87.5 → 93.8% (Bastion) and 88.5 → 93.2% (Cardinal); on curve unchanged |

- **Why the Gladiator's two cells stay out:** her gain over the Spellfist swings with the fight's length. In Lv 30's
  short fights (3 rounds) the Spellfist's one-foe Pinpoint acts end them; in Lv 50's long ones Arsenal's breadth (a weak
  kind on every foe, so more Breaks) and her crowned Sweep and Scatter capstones pay. Her line hand trades one end for
  the other: ×1.15 puts Lv 50 at +8.2% and Lv 30 at −4.3%, ×1.25 Lv 30 at −1.6% and Lv 50 at +11.2%. **×1.2 leaves both
  cells within a point of the edge** (−2.4 against −2.1; +9.7 against +9.0), inside the measure's noise. Recommended: accept
  and re-read on the build's run with the class lines (the Spellfist's Sundown and line C change the short fights).
- **Why Resonance by depth:** a Tier 3 rule must act from Class Rank 1 (T2C78), and an echo on capstones waits for depth 5.
  On her deepest skills at 10% the Astromancer gains at every level, in the band's middle.
- **Why the supports drop the +0.03:** their twist (the familiar on both halves, piercing; both summons lingering and
  mending) is the step; the hands made it two.

### 5.3 The twenty-two at the proposed knobs

| Class (parent) | Lv 10 | Lv 30 | Lv 50 | D at Lv 50, BT (her parent's V) |
|---|---|---|---|---|
| Ravager (Berserker) | +8.2% | +2.5% | +6.2% | 1.23 (1.13) · 1.30 (1.20) |
| Spellhammer (Spellfist) | +1.7% | −0.7% | +3.6% | 1.31 (1.24) · 1.39 (1.29) |
| Gladiator (Spellfist) | +6.9% | **−2.4%** | **+9.7%** | 1.30 (1.24) · 1.38 (1.29) |
| Astromancer (Archmage) | +7.7% | +2.3% | +6.4% | 1.13 (1.03) · 1.20 (1.10) |
| Spellknight (Battlemage) | +1.9% | +6.1% | +2.9% | 1.11 (1.06) · 1.19 (1.15) |
| Thaumaturge (Battlemage) | +4.4% | +1.1% | +4.3% | 1.06 (1.06) · 1.14 (1.15) |
| Bladelord (Blademaster) | +2.2% | +4.2% | +6.9% | 0.94 (0.90) |
| Herald (Sentinel) | +6.3% | +4.6% | +1.2% | 0.71 (0.81) |
| Dervish (Bladedancer) | +3.8% | +2.9% | +3.4% | 0.89 (0.84) |
| Runelord (Runeblade) | +3.7% | +1.5% | +3.1% | 0.96 (1.01) |
| Oracle (Enchanter) | +7.7% | +6.0% | +3.1% | 0.70 (0.95) |
| Starweaver (Spellweaver) | +1.8% | +2.3% | +6.2% | 1.03 (0.98) |
| Overlord (Warlord) | +1.8% | +0.9% | +1.2% | 0.75 (0.79) |
| Archdruid (Druid) | +5.1% | +5.7% | −0.2% | 0.71 (0.83) |
| Imperator (Marshal) | +6.7% | +6.6% | +1.9% | 0.88 (0.84) |
| Hierarch (Invoker) | +3.1% | +0.8% | +4.1% | 0.71 (0.72) |
| Soulcaller (Shaman) | +4.7% | +2.8% | +1.7% | 0.66 (0.73) |
| Mythlord (Animist) | +6.9% | +4.3% | +5.4% | 0.74 (0.71) |
| Bastion (Guardian) *(stress)* | +0.0% | +0.3% | +0.0% | 0.32 (0.45) |
| Inquisitor (Templar) *(stress)* | +8.2% | +11.4% | +13.1% | 0.43 (0.55) |
| Cardinal (Bishop) *(stress)* | −6.2% | +0.0% | −0.2% | 0.29 (0.61) |
| Hierophant (Exorcist) *(stress)* | +18.3% | +7.5% | +13.9% | 0.39 (0.62) |
| **Mean of the eighteen** | **+4.7%** | **+2.9%** | **+3.9%** | **52 of 54 cells within ±5** |

- **52 of 54 cells inside**; the two out are the Gladiator's (§5.2).
- **The healers on curve:** the battle healers +8 to +18% (the Inquisitor and the Hierophant), the keepers +0 (the Bastion
  and the Cardinal play their parents' fights on curve; the Cardinal's −6% at Lv 10 is Overflow's, which ×1.3 replaces).

### 5.4 Tier 3's budget (T2B56; R3-8)

R3-8: Tier 3's promotions take over the crown's measured budget (round 2: +17% at Tier 3 Lv 50). Measured: the keepers'
lines (T1, T2) against the same comps of their Tier 2 parents without the crown, all in Tier 3's frame:

| Tier 3 | Party 1's line: T1 against C1 | Party 2's line: T2 against C2 | What it is |
|---|---|---|---|
| Lv 10 | +4.1% | +6.0% | The rules alone (no crown below Class Rank 50) |
| Lv 30 | +2.0% | +2.4% | The rules alone |
| Lv 50 | **+17.0%** (the crown alone +11.8%) | **+18.8%** (the crown alone +14.9%) | The crown and the rules |
| Lv 50, against Tier 1's parties in Tier 3 | +15.4% | +15.6% | The whole of Tiers 2 and 3's class step |

**The budget holds:** +17 to +19% at Lv 50 against round 2's +17%, the crown about two thirds of it and the promotions'
rules the rest; below the crown the rules add +2 to +6% (classes estimated about +5%).

### 5.5 Tier 3's stress check (T2B60)

Tier 3 Lv 50, the keepers' lines T1 and T2 with one seat swapped; won · KOs a fight, and with the healer's sustain off:

| Seat | ×4 | ×5 | ×6 | The healer off, ×5 |
|---|---|---|---|---|
| **Bastion** (T1), mends ×1.3 | 100% · 0.15 | 99.2% · 0.41 | **93.8% · 0.88** | — |
| Bastion with Overflow (classes.md) | 100% · 0.15 | 99.5% · 0.41 | 87.5% · 1.10 | 75.8% · 1.69 |
| Inquisitor (T1) | 100% · 0.18 | 99.0% · 0.41 | 87.8% · 1.04 | 81.0% · 1.46 |
| **Cardinal** (T2), mends ×1.3 | 100% · 0.16 | 99.2% · 0.42 | **93.2% · 0.89** | — |
| Cardinal with Overflow | 100% · 0.16 | 99.2% · 0.42 | 88.5% · 1.08 | 68.2% · 2.28 |
| Hierophant (T2) | 99.5% · 0.20 | 98.7% · 0.47 | 78.1% · 1.77 | 71.1% · 2.16 |
| Soulcaller (T1, the Hierarch's seat) | 100% · 0.06 | 99.7% · 0.22 | 96.4% · 0.57 | **94.3% · 0.75** |
| Mythlord (T1) | 96.1% · 0.56 | 85.7% · 1.29 | 69.3% · 2.04 | 53.4% · 2.79 |
| Archdruid (T2, the Overlord's seat) | 100% · 0.09 | 99.0% · 0.33 | 93.2% · 0.76 | **88.5% · 1.24** |
| Imperator (T2) | 100% · 0.19 | 97.7% · 0.57 | 86.7% · 1.15 | 63.3% · 2.56 |
| Herald (T1, the Bladelord's seat) | 100% · 0.17 | 96.9% · 0.54 | 86.7% · 1.15 | 79.9% · 1.48 |
| Dervish (T1) | 100% · 0.20 | 98.4% · 0.52 | 86.5% · 1.21 | 73.7% · 1.85 |
| Oracle (T2, the Runelord's seat) | 100% · 0.24 | 96.6% · 0.55 | 85.4% · 1.24 | 68.8% · 2.04 |
| Starweaver (T2) | 99.2% · 0.20 | 94.8% · 0.57 | 84.6% · 1.20 | 68.0% · 2.26 |

- **The keeper healer is the attrition pick again** with ×1.3 (+6 and +15 points of fights won at ×6 over her battle
  healer; knockouts 0.88 against 1.04, 0.89 against 1.77), the battle healer the on-curve pick (+8 to +18%). With Overflow the Paladin's line
  tied (87.5 against 87.8%).
- **The Summoner supports keep a party standing** with the healer down (the Soulcaller 94%, the Archdruid 89% at ×5,
  against the keepers' 76 and 68%): the Archdruid's two mends a pair, which classes asked balance to read, are the
  strongest sustain outside a healer. **The Spellblade supports are a little safer than their keeper** (the Herald +4
  points) or level (the Oracle +0.6): their Tier 3 twist is damage.
- **The pure lines are the least safe**, the Mythlord most (69% at ×6): the price of no status, as in Tier 2.

### 5.6 Tier 3 comps (T2B58)

Each against its Tier 2 comp in Tier 3's frame (the crown on both) and against Tier 1's party there; every fight won.

| Comp | Members | Against its Tier 2 comp, Lv 10 · 30 · 50 | Against Tier 1's party, Lv 10 · 30 · 50 | Party, Lv 50 (BT) | Rounds, Lv 50 |
|---|---|---|---|---|---|
| **T1** the keepers' line (C1's) | Ravager, Astromancer, Bladelord, Hierarch, Bastion | +4.1% · +2.0% · +4.7% | +11.8% · +9.6% · +15.4% | 4.25 | 3.14 · 3.34 · 5.33 |
| **T2** the keepers' line (C2's) | Ravager, Astromancer, Runelord, Overlord, Cardinal | +6.0% · +2.4% · +3.3% | +14.3% · +11.2% · +15.6% | 4.40 | 3.05 · 3.15 · 5.27 |
| **T3** a Brawler with a Spellblade | Spellhammer, Astromancer, Dervish, Hierarch, Bastion | +3.1% · +2.1% · +2.6% | +10.7% · +11.9% · +14.1% | 4.21 | 3.26 · 3.20 · 5.50 |
| **T3g** the Gladiator beside the Bladelord | Gladiator, Astromancer, Bladelord, Hierarch, Bastion | +4.4% · −0.4% · +3.9% | +11.8% · +10.6% · +17.6% | 4.34 | 3.01 · 3.31 · 5.41 |
| **T3b** a Sorcerer with a Tome Spellblade | Ravager, Spellknight, Starweaver, Overlord, Cardinal | +3.7% · +4.3% · +3.0% | +11.2% · +12.9% · +13.8% | 4.33 | 3.11 · 3.17 · 5.38 |
| **T4** a Spellblade with the Paladin | Ravager, Astromancer, Herald, Hierarch, Inquisitor | +6.3% · +5.6% · +4.6% | +14.8% · +12.7% · +16.6% | 4.30 | 3.15 · 3.23 · 5.27 |
| **T4b** a Tome Spellblade with the Cleric | Ravager, Astromancer, Oracle, Overlord, Hierophant | +9.3% · +5.1% · +4.0% | +16.7% · +13.9% · +16.8% | 4.44 | 3.05 · 3.14 · 5.08 |
| **T5** both swaps on one party | Spellhammer, Astromancer, Dervish, Soulcaller, Inquisitor | +4.8% · +3.2% · +6.0% | +13.7% · +13.5% · +17.9% | 4.35 | 3.15 · 3.02 · 5.47 |
| **T6** all pure, every kind | Gladiator, Thaumaturge, Dervish, Mythlord, Bastion | +4.6% · +7.6% · +6.9% | +13.8% · +13.9% · +17.5% | 4.33 | 2.97 · 3.28 · 5.59 |
| **T7** all hybrid | Spellhammer, Spellknight, Bladelord, Hierarch, Bastion | +2.3% · +5.1% · +1.8% | +9.1% · +13.7% · +15.3% | 4.25 | 3.20 · 3.12 · 5.60 |
| **T8** a Tier 3 mix | Ravager, Spellknight, Bladelord, Soulcaller, Cardinal | +4.0% · +3.0% · +4.2% | +15.4% · +11.2% · +13.8% | 4.33 | 3.03 · 3.28 · 5.40 |

- **Every Tier 3 comp sits −0.4 to +9.3% over its Tier 2 comp** (mean +4.2%; T4b at Lv 10 0.1 past the band's edge) and
  **+9.1 to +17.9% over Tier 1's parties** in Tier 3's frame: Tier 3 deepens every comp alike.
- **The owner's swaps one tier down** (T3, T3b, T4, T4b, T5) sit with the keepers' lines (§4.8).
- **T6, all pure** (the Gladiator, the Thaumaturge, the Dervish, the Mythlord) runs +4.6 · +7.6 · +6.9% over C6: Arsenal
  and Momentum together, nine kinds in two hands; the least safe line under attrition (the Mythlord, §5.5).

### 5.7 Tier 3's term (T2B57)

§4.13: **× 1.13 from Lv 1 to 40, rising to × 1.19 by Lv 50**, offense +10% by Lv 50 and bosses × 1.1 kept; shields 7 · 9.

## 6. Provides and assumes

| Doc | This doc provides | This doc assumes |
|---|---|---|
| **[classes](classes.md) (T2C)** | **Amendments for the cross-reference:** **T2C68** the pure variants' second hands by depth (Bladedancer 0.53 · 0.33, Spellweaver 0.44 · 0.50, Marshal 0.56 · 0.46, 0.40 on her lines on the reconciled kit, Animist 0.54 · 0.33; T2B45, T2B46, T2B66); **T2C71** the Spellfist ×1.25 and **T2C72** the Battlemage ×1.1 (T2B44); **T2C39 and T2C45** the Sentinel ×0.9 (0.65 + 0.40), her ladder one stack, her Armor Break on the tapped foe (T2B47), the Druid 0.54 + 0.44 trunk and 0.64 + 0.51 lines, 0.52 + 0.42 and 0.60 + 0.48 on gear's Bow + Greatsword (T2B48, T2B66); **T2C38** the Warlord's +0.03 on her lines only, the Invoker's +0.01 (T2B49); **T2C83–T2C85** the Gladiator ×1.05 trunk and ×1.2 lines, the Thaumaturge ×1.1 (T2B53); **T2C82 and T2C84** Resonance on her deepest depth at 10% (T2B52); **T2C86** the supports' Tier 3 twist without the +0.03 (T2B54); **T2C82 and T2C87** the Bastion's and Cardinal's mends and Barriers ×1.3 in Overflow's place (T2B55); **T2C92** measured (T2B51, T2B56); **T2C93** the comps measured (T2B58); **T2C99** run (T2B50). Confirmed: T2C34, T2C37, T2C43, T2C44, T2C73, T2C79, the crown; T2C83/T2C84's Pinpoint +4%. **A finding for T2C43:** the Guardian's and Bishop's stack more works below depth 5 only (T2B61) | Every kit as T2C65–T2C101 write it, the presets of T2C77; the class lines, line C and two lines held not measured |
| **[gear](gear.md) (T2G)** | **Amends T2G51 (T2B66):** the Enchanter, the Marshal and the Animist keep their keeper sibling's Dual (Katana + Axe, Bow + Greatsword, Dark + Fire); Pure ×3 or Blizzard + Light cost them 6 to 17 points at Lv 10; the coverage bound to re-check on the three. Kindred counted in every V (T2B32); shields 7 · 9 (T2B7); the round's runs read round 2's type rule on the new kits, re-read on T2G51, T2G56 and T2G58 in §4.17 | T2G21–T2G28 types, T2G30–T2G36 forms and presets and their Tier 3 step |
| **[extra stats](extra-stats.md) (T2E)** | **T2E51 confirmed** (T2B66): Offense beats the family's shape for the pure variants (the Marshal +11.8% at Lv 50 against +4.9% with Area); the round's main runs wore Multi-hit and Area on them, re-read in §4.17 | T2E24 rates, T2E29 shapes at step 4b, T2E37 presets (the pure variants their family's shape) |
| **[progression](progression.md) (T2W)** | Tier 3's term (T2B57) in foe generation; the Duel's shields at least 16 in Tier 3 (T2B62) | The Ascend's resets; Tier 3's Rift |
| [professions](professions.md), [templates](templates.md) | No balance change moves an item or a template | — |

## 7. Save and engine

- **No save change from this doc.** The trunk hand, the Sentinel's ladder and the keepers' ×1.3 are class data (classes'
  T2C95 holds hands and rules by class).
- **Engine, Tier 2's stage** (`t2Classes`, v22): round 2's list, plus **a hand by depth** (a skill's hand by her trunk or
  her lines, an Attack her trunk's) and **a class's support ladder and reach** in place of one shared ladder.
- **Engine, Tier 3's stage** (`t3Classes`, v23): Resonance by her open depth; **the keepers' mends and Barriers ×1.3** in
  Overflow's place; Tier 3's term (× 1.13 to Lv 40, rising to 1.19) in `rpgFoeTierBudget`.
- **The harness:** `balance-t2.test.ts` runs the built stages, with this doc's fork as its spec (§4.1) and round 3's plan
  (§4.3–§5.7) as its checklist (§4.16).

## 8. Pacing

- **Fights run at Tier 1's pace with the terms** (Tier 2's comps at Lv 50 without the term 3.5–3.8 · 4.1–4.2 · 6.3–7.0
  rounds; Tier 1's 3.6–3.8 · 4.3–4.5 · 6.8–7.1; Tier 3's lines 3.0–3.3 · 3.0–3.3 · 5.1–5.6).
- **The owner's swaps cost no pace** (C3 and C4 within 0.7 points of C1), and the support-heavy comps take the least.
- **The simulation's cost:** about 1,900 party-level runs (the band in both tiers at classes.md's values and the knobs,
  thirteen and eleven comps, the stress check to ×6, the term, the budget, the wards, the noise check), some 75 minutes on
  thirteen cores at 16 seeds.

## 9. The previews

| Page | What it shows |
|---|---|
| [balance-tiers.html](previews/balance-tiers.html) | Tier 1 → 2 → 3, every system: sources, the terms (Tier 3's re-sized), weaknesses and shields, MP, the status levels |
| [balance-sim.html](previews/balance-sim.html) | **Tier 2: the twenty** against their parents at classes.md's values and the proposed knobs (Lv 10, 30, 50), the knobs, round 2's crosses re-read, the mirrors |
| [balance-tier3.html](previews/balance-tier3.html) | **New. Tier 3: the twenty-two** against their Tier 2 parents, the knobs, the budget, the term |
| [balance-comps.html](previews/balance-comps.html) | The owner's swaps answered; C1–C10 and T1–T8 measured |
| [balance-stress.html](previews/balance-stress.html) | The attrition check in both tiers: where a healer decides, keeper against battle healer, the supports and the pure variants, the warded fronts |
| [balance-calls.html](previews/balance-calls.html) | Every call, round 3's first |

**The old previews** ([tier-rework/previews/](../tier-rework/previews/)): carried or retired as round 2 listed, unchanged.

## 10. Decisions

Every call, with the recommended answer. Round 3's first; rounds 1 and 2 keep their ids and carry their round-3 status
(§3.4, §3.5).

### 10.1 Round 3 (T2B41–T2B66)

| Call | Decision | Recommended | Alternatives, briefly | Why |
|---|---|---|---|---|
| **T2B41** | How the forty-two were measured | **A rebuilt fork of engine v21 and its Auto (round 2's was deleted), checked to play Tier 1 exactly as live; every rule of classes' round 3; the party's damage as HP taken off foes; every honeycomb stage of the level, 16 seeds (1,536 fights a party and level); a second seed set within 1.4 points** (§4.1). Supersedes T2B20 | 8 seeds; round 2's numbers for the kept sixteen | Measured, not estimated; the re-measure found round 2's cross bug (T2B42) |
| **T2B42** | Round 2's crosses re-read (a finding) | **Round 2's fork left the cross weapon's Might out (its Battlemage reproduced: −1.3% without, round 2 −1.8%, +7.0% with); every number here re-measured** | Carry round 2's sixteen | A knob set on a missing Might would ship a Battlemage a fifth too strong |
| **T2B43** | The band in round 3 (amends T2B22) | **The sixteen damage and support classes within ±5 points of their mean gain at Tier 2 Lv 10, 30, 50; the healers on the stress check. Classes' values 36 of 48 cells; proposed 48 of 48 (means +3.3 · +2.5 · +4.7%)** | Round 2's twelve in the mean (the pure variants read against it) | R3-4 adds four damage classes to the same seats |
| **T2B44** | The crosses' hands (amends T2C71, T2C72) | **Spellfist ×1.25, Battlemage ×1.1; Pinpoint +2% a depth kept (confirms T2C73)** | Pinpoint +3% for the Spellfist alone (as a hand, breaks the mirrors' shared rule); classes' ×1 · ×1.25 (−8% and +11% at Lv 50) | The Spellfist lost her parent's sweep and scatter at every depth, the Battlemage kept her sweep |
| **T2B45** | The trunk hand (a new knob) | **A class's hand may differ on her trunk (depths 1–2 and Attacks) and her lines (depths 3–5), shown on her sheet; used where her gain slopes with level: the four pure variants, the Druid, the Warlord, the Gladiator** | One hand a class (the pure variants miss at Lv 10 or 50, whatever the hand); a hand by Uma level (hidden) | Depth is what she plays and sees; the fork is where lines and paths begin |
| **T2B46** | The pure variants' second hands (amends T2C68) | **Trunk · lines: Bladedancer 0.53 · 0.33, Spellweaver 0.44 · 0.50, Marshal 0.56 · 0.46 (0.40 on her reconciled kit, T2B66), Animist 0.54 · 0.33; lead hands her parent's** | Classes' 0.32 · 0.41 · 0.40 · 0.37 (−7 to −9% at Lv 10) | Her stat's lead grows with level, an all-one-channel kit Breaks fewer foes early |
| **T2B47** | The Sentinel (amends T2B24, T2B25; T2C39, T2C45) | **Hands ×0.9 (0.65 + 0.40); her support ladder one stack at every depth; her Armor Break on the tapped foe only.** The support ladder and reach become a class's numbers; the Enchanter, Druid and Shaman keep round 2's | A hand cut alone (×0.85: +16% at Lv 50, no effect); one ladder for both Spellblade supports (the Enchanter −9% at Lv 50) | In Party 1 her Brave and Faith on the Brawler fill the gap the Paladin leaves; in Party 2 the Cleric fills it |
| **T2B48** | The Druid (amends T2B25; T2C39) | **0.54 + 0.44 on her trunk, 0.64 + 0.51 (×1.12) on her lines; on gear's merged Dual Bow + Greatsword 0.52 + 0.42 and 0.60 + 0.48 (T2B66)** | ×1 or ×1.05 flat (Lv 10 or Lv 50 out) | Her Mind Break overlaps the Cleric's widely at depth 5 |
| **T2B49** | The Summoner keepers (amends T2B29; T2C38) | **The Warlord's +0.03 on her lines only (0.57 + 0.46 trunk, 0.60 + 0.49 lines); the Invoker's +0.01 (0.58 + 0.51)** | Round 2's +0.03 both (the Warlord +9% at Lv 10, the Invoker +7.6% at Lv 30) | The second farewell pays most in Lv 10's long fights |
| **T2B50** | The knob order in round 3 (amends T2B33) | **Classes' T2C99 for the new kits (pure hands, Pinpoint, the crosses' hands, Arsenal's hands, the low Tier 3 rules, Momentum, the battle healers, Overflow), then T2B33's for the kept classes the re-measure moved; Resonance added beside item 5** | Re-tune everything at once | One at a time keeps each knob's effect readable |
| **T2B51** | The Tier 3 band (confirms T2C92, measured) | **The eighteen within ±5 points of their mean gain over their Tier 2 parents at Tier 3 Lv 10, 30, 50, both crowned at Lv 50. Classes' values 44 of 54; proposed 52 of 54 (means +4.7 · +2.9 · +3.9%); the Gladiator's two cells within a point past the edge, accepted** | Read Tier 3 against Tier 1 only | Each promotion's step is the guardrail's question |
| **T2B52** | Resonance (amends T2C82, T2C84) | **The Astromancer's deepest open depth's skills strike again at 10%, the echo chipping nothing** | Classes' capstones at 30% (0 below Lv 29, +17–20% from it); capstones at 12% (0 at Lv 10); deepest at 15% (+9.4% at Lv 50) | A Tier 3 rule acts from Class Rank 1 (T2C78) |
| **T2B53** | Arsenal's hands (amends T2C83–T2C85) | **Gladiator ×1.05 on her trunk, ×1.2 on her lines; Thaumaturge ×1.1** | ×1.05 both (the Gladiator −6% at Lv 30 against a ×1.25 Spellfist); the Gladiator ×1.15 or ×1.25 (one end or the other out) | Her parent's hand rose (T2B44); her gain swings with fight length, ×1.2 splits it |
| **T2B54** | The supports' Tier 3 twist (amends T2C86) | **Her keeper sibling's twist alone, her Tier 2 hands kept (the Herald 0.65 + 0.40, the Oracle 0.58 + 0.38, the Archdruid and the Soulcaller their parents')** | Classes' twist and +0.03 (the Oracle and Archdruid +10 to +12% at Lv 10–30) | The twist is the step |
| **T2B55** | The keeper healers' Tier 3 rule (amends T2C82, T2C87) | **Overflow replaced: the Bastion's and the Cardinal's mends and Barriers ×1.3.** The battle healers' ×0.7 power, Juggernaut, Spellbind, Menagerie, Momentum and Pinpoint doubled kept as classes wrote them | Overflow at any cap (0 to 30% play the same fights); ×1.15 (+1.6 points at ×6) | Mends aim at the most hurt and rarely overheal; the keeper must be the attrition pick |
| **T2B56** | Tier 3's budget (supersedes T2B37) | **At Tier 3 Lv 50 the keepers' lines +17.0% and +18.8% over themselves uncrowned (the crown +11.8 and +14.9%), round 2's +17% held; below the crown the rules +2 to +6%** | — | R3-8's ask, measured |
| **T2B57** | Tier 3's term (amends T2B36, T2B5) | **Foes' HP and DEF × 1.13 from Tier 3 Lv 1 to 40, rising to × 1.19 by Lv 50; offense +10% by Lv 50 and bosses × 1.1 kept. Tier 2's 1.06 → 1.10 confirmed** | Round 2's 1.10 → 1.12, rising to 1.26 by Lv 40 | Measured K: 1.20 · 1.20 · 1.16 · 1.16 · 1.16 · 1.27 at Lv 10 · 20 · 30 · 35 · 40 · 50 |
| **T2B58** | The comps measured (supersedes T2B34) | **C1–C10 +1.0 to +5.8% over their Tier 1 party at Tier 2 Lv 10, 30, 50; T1–T8 (and T5, T7) −0.4 to +9.3% over their Tier 2 comps and +9.1 to +17.9% over Tier 1's parties at Tier 3 Lv 10, 30, 50** | Classes' seat model only | R3-7 asks for them measured |
| **T2B59** | The owner's swaps (R3-7) | **Both swaps keep the party in the band in both tiers: C3 within 0.4 points of C1, C4 within 0.7; T3 and T4 within 2.1 and 3.6 of T1; every member inside her own band** | — | The owner's question, answered plainly |
| **T2B60** | The stress check in round 3 (amends T2B23) | **Multipliers to ×4–×5 (Tier 2) and ×5–×6 (Tier 3), where a healer decides on the honeycomb's stages; bands: the keeper ahead of her battle healer from ×3.2 (Tier 2) and at ×6 (Tier 3); every support's party safest with the healer down. Met at the proposed knobs; the pure Summoners the least safe pick** | Round 2's ×2–×4 (every party wins to ×3.2 now) | The check must reach where sustain decides |
| **T2B61** | The keeper healers' Tier 2 rule (a finding; confirms T2B30) | **Kept: one stack more works at depths 1–4 (Tier 2 Lv 1–28); from depth 5 the Guardian and the Bishop play their parent's fights, and the keeper still out-survives her battle healer (+3 to +7 points at ×4–×5)** | Give her Tier 3's ×1.3 in Tier 2 too | Her trade with the battle healer holds; Tier 3 adds the sustain step |
| **T2B62** | The Duel's rail in Tier 3 (amends T2B38) | **Menagerie's farewells (13 chips on a lone champion), the supports' twists (10, 11): the Duel's shields at least 14 in Tier 2, at least 16 in Tier 3** | Keep 14 in Tier 3 | No act may Break a Duel boss; counted, not measured |
| **T2B63** | The Rift's wards (a finding) | **On a warded front each cross and pure variant is the pick: the Spellfist +10–12% and the Spellweaver +16% on Arcane fronts; the Battlemage +17–18%, the Bladedancer +12% and the Marshal +21% on Iron fronts (their keeper siblings +3 to +7% there)** | — | The pure variants' and crosses' niche, measured |
| **T2B64** | Is any class useless (the owner's fear) | **No: every class inside her band; almost every one the better pick somewhere (levels, fronts, attrition); the Animist's niche the weakest (ahead of the Shaman at Lv 30 only), left as is** | Raise the Animist's line hand to 0.36 (ahead of the Invoker at Lv 50) | A pure Summoner's place is the all-elemental party, which runs +2 to +5% |
| **T2B65** | The previews | **Six pages: by tier, Tier 2's twenty, Tier 3's twenty-two (new), the comps, the stress check, every call.** Supersedes T2B40 | Five (Tier 3 inside the twenty's page) | Twenty-two classes need their own chart |
| **T2B66** | Gear's and Extra Stats' round 3 kits, re-read | **Adopt Offense for the pure variants (T2E51, confirmed) and gear's T2G51 but for three, who keep their keeper sibling's Dual: the Enchanter Katana + Axe, the Marshal Bow + Greatsword, the Animist Dark + Fire; on those kits the Marshal's lines 0.40 and the Druid 0.52 + 0.42 trunk, 0.60 + 0.48 lines. All sixteen inside (§4.17)** | Gear's T2G51 whole (the Marshal −16% and the Animist −9% at Lv 10; bigger hands to buy back a partner kind) | A partner kind pays on every foe a Summoner's area or a support's status reaches; gear's search prices kinds in hand, not value |

### Where the owner may want to look first

| Call | Why it's worth his eye |
|---|---|
| **T2B59** The swaps | The answer to his question: both swaps keep the party in the band, in both tiers |
| **T2B44** The crosses' hands | The Spellfist ×1.25 and the Battlemage ×1.1, the reverse of round 2's ×1.05 and ×1.3 (T2B42: round 2's fork dropped the cross weapon's Might) |
| **T2B45** The trunk hand | One new number on six sheets; it is what lets the pure variants be in the band at Lv 10 and Lv 50 |
| **T2B47** The Sentinel | A kept class that re-measured +18% at Lv 50; now one stack and the tapped foe |
| **T2B55** Overflow replaced | A rule that did nothing; the keepers' ×1.3 makes them the attrition pick |
| **T2B51** The Gladiator's two cells | The only class left at the edge; a hand can't follow both short and long fights |
| **T2B64** The Animist | In the band, but the one new class that is never the standout |
| **T2B66** Gear's merged kits | Gear's Pure ×3 on the Marshal and the Enchanter, and the Animist's Blizzard + Light Dual, cost them their band; recommended: their keeper's Dual |

### 10.2 Rounds 1 and 2 (T2B1–T2B40)

| Call | Decision | Status | Recommended | Alternatives, briefly | Why |
|---|---|---|---|---|---|
| **T2B1** | Every source keeps its share | Kept, changed (R2-6–R2-8) | Every flat value ×1.8 and ×2.6, round 2's included (Great, Twofold and Kindred forms, Extra Stats' kind rows); every percentage unscaled, round 2's included (a type's weak multiplier, Insignia riders, Area, Multi-hit, Life steal, MP back, Area guard, Momentum, the status levels); a new source joins §2.2's table before it ships | Per-stat multipliers for HP and MP | Measured within 2.2 points (§2.2); round 2 adds no flat source that escapes ×tier |
| **T2B2** | The yardstick is the engine | Kept | Every Tier 2–3 number on the harness; round 2 measured the sixteen on a fork of engine v21 (T2B20), round 3 the forty-two (T2B41), the build re-measures on its own stage (`balance-t2.test.ts`) | SB2's analytic model | The analytic comps missed the Sentinel by 30–45 points (§4.4) |
| **T2B3** | A later tier's Class Rank pace | Kept | Ranks 1–10 one shared ladder of 3,600 raising every class she holds; depths at Lv 10 · 16 · 22 · 29 (T2C47) | Each class from Rank 1 | One curve; the harness measured on it |
| **T2B4** | Tier 2's term | Kept, changed (R2-2, R2-6–R2-8) | Re-sized on the measured toolbox (T2B36): foes' HP and DEF × (1.06 + 0.04 (ℓ − 1) ÷ 49), 1.06 → 1.10, offense +10% by Lv 50 | Round 1's 1.08 → 1.28 (priced a focus and a weapon moon that are gone) | The focus left with R2-2 and the weapon moon with T2E27 |
| **T2B5** | Tier 3's term | Kept, changed (R2-2, R2-6–R2-8); **amended by T2B57** | Foes' HP and DEF × 1.10 → 1.12 by Lv 35, rising to 1.26 by Lv 40 (the crowns) and flat after, offense +10% by Lv 50 (T2B36) | Round 1's 1.12 → 1.42 | The same |
| **T2B6** | Bosses | Kept | The term × 1.1 on bosses' HP and DEF in Tiers 2–3 | No boss factor | Gear measured bosses' answers +15% (T2G27) |
| **T2B7** | Shields by answers | Kept, changed (R2-6) | Sub-bosses 7 and bosses 9 **from Tier 2 Lv 1**, and 7 and 9 in Tier 3 (round 1's 10 counted two two-kind weapons; XR6 kept one); regulars by formation; Keys, guards and escorts as Tier 1 | From the breadth gate (round 1); Tier 3 bosses 10 | Types come with the promotion (T2G22), so there is no gate; CP8's rule on gear's answers (4.09–4.42) gives 9 in both tiers |
| **T2B8** | Weaknesses in Tiers 2–3 | Superseded (R2-6) | No breadth gate: WK8's three kinds by role from Tier 2 Lv 1, as live (D236); WK12's checks and ≤ 10% idle stages in every tier stand (gear measured 4.17–4.32 a regular, T2G27) | 2 + 2 until Lv 20 | The two-kind type is hers from G0 |
| **T2B9** | The Rift by tier | Kept, changed (R2-2) | Draws by front; the Duel's shields the best act's or Limit Break's chips + 3, re-counted on the sixteen: at least 14 (T2B38) | Fixed shields 13–15 | A hit chips one point whatever its kinds |
| **T2B10** | Skill MP by tier | Kept | ×1.7 in Tier 2, ×2.4 in Tier 3; every Tier 2–3 number here was measured with it | ×tier | Her bar grows ×1.73 and ×2.46 |
| **T2B11** | The base regen | Kept | 1% of her bar a depth, five at most; a sixth step with Tier 3's crown | A per-tier share | Tier-free with T2B10 |
| **T2B12** | Statuses | Kept, changed (R2-3) | +10% a stack (foes' 15%), cap 3, two rounds; four levels of access (T2C45) with the support level's rule (T2B24); Momentum is no status: a factor of its own at step 5 | A step by tier | Percentages hold their share |
| **T2B13** | Limit Breaks | Kept | Tier-free: power × scale × open depth's power, at most 10 hits on one foe, gauge 12 | A power by tier | Its offense carries the tier |
| **T2B14** | The damage stack | Kept, changed (R2-2, R2-6–R2-8) | No focus; step 1 her stat (a cross reads one), forms, Kindred and kind rows; step 3 her type's weak multiplier by grade; step 4 Insignias with riders; step 4b Area and Multi-hit; step 5 statuses and Momentum; ceiling on one weak hit ×1.69 · ×2.22 · ×2.62 before statuses (gear's T2G37) | Cap the product | The terms price the on-curve act |
| **T2B15** | Defense | Kept | Armor as it is; a regular's 100% hit 19.0 · 18.4 · 18.2%, about 21% with the terms' offense | Armor's HP up | Inside SB13 |
| **T2B16** | The mirrors | Kept, changed (R2-2) | Mirrored Tier 2 classes within 5 points of gain of each other at every level (§4.11); the Arms and Tome splits 70/30 ± 5 as Tier 1 | Classes v3's ±5% damage bands only | Two contexts (the owner's two parties) move mirrors apart more than a hand does |
| **T2B17** | The healers | Kept, changed (R2-3) | Guardian ÷ Bishop and Templar ÷ Exorcist within ±10% of mends and absorbed Barriers; keeper against battle healer on the stress check (T2B23) | One healer band | Four healer classes now |
| **T2B18** | The simulation's checklist | Kept, changed | Round 1's thirteen checks plus the guardrail's three (T2B22, T2B23, T2B34), §4.16 | — | One list for the build packet |
| **T2B19** | Accessory viability by tier | Kept | D266's rule for every Tier 2–3 form; gear's T2G35 holds it; Kindred counts as party value (T2B32) | SB8's values | Gear owns the forms |
| **T2B20** | How the sixteen were measured | Round 2; **Superseded (R3-8) → T2B41** | Their rules on a scratch fork of engine v21 and its Auto, the live harness building every Uma (gear, Extra Stats, Learner, Class Rank pace), Tier 2's MP and healing divisor, gear's Suggested types and forms (T2G26, T2G36) and Extra Stats' Prowess presets (T2E37); 16 seeds, every stage of the level; what's exact and what's approximated in §4.1 | Classes' analytic model; a real engine stage first | Measured now, so the build's packet starts from numbers, not estimates |
| **T2B21** | Party value on the harness (amends T2C56) | Round 2; **Kept** | V = D + S: D her damage a round of the fight in BT (an on-curve Brawler's at the same tier, level and kind of fight), S what the other four lose when her statuses, mends, wards and keeper twist are off; a class's **gain** is the party's damage a round with her minus with her parent, over her parent's V; fights weigh 2, sub-bosses and bosses 1; sustain on the stress check (T2B23) | T2C56's formula (a turn, modelled statuses, ε for HP) | A round counts the turns she misses and the kills she takes from others; the counterfactual measures overlap and the cap |
| **T2B22** | The band (amends T2C64) | Round 2; **Kept, changed (R3-4) → T2B43** | On curve at Tier 2 Lv 10, 30 and 50: each of the twelve damage and support classes' gain within ±5 points of the twelve's mean gain at that level; the four healers on the stress check (T2B23) | ±5% of the sixteen's mean (T2C64) | A healer's on-curve gain is damage only and would drag the mean |
| **T2B23** | The stress check: the attrition check | Round 2; **Kept, changed (R3-1, R3-5) → T2B60** | Each region's elite, its boss's first wave and its boss as one fight (three waves, HP and MP carried, the 10% breather), foes' offense ×2, ×2.6, ×3.2 and ×4, at Tier 2 Lv 30 and 50 and Tier 3 Lv 50, 16 seeds; read wins, KOs, HP left, damage taken and party damage a round, and each healer and support with her sustain off. **Bands:** a keeper healer ahead of her battle healer in wins from ×3.2 and the battle healer ahead on curve; the two within 10% in party damage a round at ×2.6; every support's party safer than her keeper's; a healerless party with supports behind a keeper healer's at ×4 | Under-geared parties; long Rift fights | Attrition is where a mend or a ward pays; the multipliers find where a healer starts to matter (×2.6) and where she decides (×4) |
| **T2B24** | The support level's rule (amends T2C39, T2C45) | Round 2; **Kept, changed → T2B47** | Every skill of her Katana, Bow, Light and Dark trees carries its status at **1 · 1 · 1 · 2 · 2** by depth, **topped up to its stacks, never built past them**; her Brave and Faith land on **the Uma she wards** (her Barrier's target; the Summoners' on the most threatened); her debuffs reach the tapped foe and every foe at depth 5 (the Spellblades'), every foe (the Summoners') | Classes' healers' ladder, built up like any status (the Sentinel +34–50%, §4.4); one stack flat | A pair class casts her lone channel every act, so any build-up pins it at 3; on every Uma, Brave and Faith alone were worth 0.4–0.5 BT |
| **T2B25** | The supports' hands (amends T2C39, T2C54) | Round 2; **Kept, changed → T2B47, T2B48** | **Sentinel ×0.95, Enchanter ×0.8, Druid ×0.95, Shaman ×1** of her parent's hands; the Druid's preset **Bow, Axe, Dark** (her parent's; the Greatsword cost her the Axe's sweep and the Area branch) | Classes' ×0.85 and ×0.9 with the Greatsword | Each support's every-act status differs (Brave and Faith, Armor Break, Mind Break, Enfeeble), so each takes its own cut |
| **T2B26** | Momentum's step (amends T2C34) | Round 2; **Kept** | **6% a stack**, a stack a turn, three at most (+18%) | 5% (+4.3% mean at Lv 50), 7% | Puts both pure keepers at the band's middle at Lv 50 |
| **T2B27** | The cross (amends T2C35, T2C54) | Round 2; **Superseded (R3-2, R3-3) → T2B44** | **Spellfist ×1.05, Battlemage ×1.3**; presets **the Scatter twins** (Spellfist Greatsword, Axe, Thunder; Battlemage Fire, Blizzard, Lance), gear's T2G25 alternative | Both ×1.05 on the Heavy twins (the Battlemage −2 to −11%) | Her Arms meet the higher physical defenses of Tier 2's strikers and guards, and her hand never reaches her Limit Break |
| **T2B28** | The Spellblade keepers (amends T2C37) | Round 2; **Kept** | Her familiar's hit on both halves **and it pierces** (skips the unbroken halving); hands **+0.03 a half** (Blademaster 0.75 + 0.47, Runeblade 0.51 + 0.75) | The hands alone (+0.05 for the same value); classes' rule (+0–2%, worth nothing) | Pierce is the Spellblades' own line B, so the twist reads as hers |
| **T2B29** | The Summoner keepers (amends T2C38) | Round 2; **Kept, changed → T2B49** | Both summons linger; hands **+0.03 a half** (Warlord 0.60 + 0.49, Invoker 0.53 + 0.60) | Classes' hands (+0–8%) | The second farewell is worth 1–3% alone |
| **T2B30** | The healer keepers (confirms T2C43) | Round 2; **Kept → T2B61** | One stack more, as classes drafted: worth +0 to +6% on curve (stacks build to 3 anyway), so the keeper is the attrition pick: ahead of her battle healer from ×3.2 (T2B23) | One stack more and a round longer (then the keeper also out-damages her battle healer at Lv 50, +10 to +12%, leaving the battle healer Lv 30 alone) | Each healer must be the better pick somewhere: the battle healer on curve, the keeper under attrition |
| **T2B31** | The battle healers (confirms T2C44) | Round 2; **Kept** | ×0.6 power, ×0.7 MP, ×0.7 mends and Barriers: +6 to +16% on curve, behind the keeper from ×3.2 | ×0.75 shares | The trade the owner asked for, measured both ways |
| **T2B32** | Kindred is support value (with T2G34) | Round 2; **Kept** | The party measure counts it: the supports' presets wear it from a slot's G5, one Uma's total, the party's largest | Count it apart | It is the supports' slot spent on others |
| **T2B33** | The knob order | Round 2; **Kept, changed (R3-8) → T2B50** | (1) a support's status rule, (2) the supports' hands, (3) Momentum's step, (4) the cross hands, (5) the hybrid keepers' hands, (6) the battle healers' shares then power, (7) the healer keepers' twist; one at a time, re-measured at Lv 10, 30 and 50 | Classes' order (Momentum first) | The supports were the largest error by far |
| **T2B34** | The comps measured (R2-12) | Round 2; **Superseded (R3-7) → T2B58** | C1–C8 on the harness at Tier 2 Lv 10, 30, 50 (C8 in Tier 3): every comp +1.7 to +9.3% over its Tier 1 party; table in §4.7 | Classes' analytic comps only | R2-12 asks for them measured |
| **T2B35** | C3's weapons (answers T2G25) | Round 2; **Superseded (R3-2, R3-3) → T2C77** | **The Scatter twins** (T2B27): every kind in two hands in C3, the party as fast or faster (+1.9, +3.2 and −0.9% at Lv 10, 30 and 50); the cost, Thunder missing from 8 of the 64 keeper and expander mixes (the Berserker with the Battlemage and a Spellblade's support), which the party hint names (T2C63) | Classes' Heavy twins (64 of 64 mixes whole; C3 Lance and Blizzard in one hand) | Equal in speed; the Battlemage nearer the band |
| **T2B36** | The toolbox term, re-sized (amends T2B4, T2B5) | Round 2; **Kept, changed (R3-1) → T2B57** | Tier 2: foes' HP and DEF × (1.06 + 0.04 (ℓ − 1) ÷ 49), 1.06 → 1.10; Tier 3: × 1.10 → 1.12 by Lv 35, rising to × 1.26 by Lv 40 (the crowns, Class Rank 50 at Lv 36) and flat after; offense +10% by Lv 50 and bosses × 1.1 kept; provisional until the build's own run | Round 1's provisional terms | Measured: the toolbox speeds fights by Tier 2 ×1.12 · 1.07 · 1.14 at Lv 10 · 30 · 50 (gear and Extra Stats alone ×1.06 · 1.05 · 1.09), Tier 3 ×1.16 · 1.13 · 1.37 |
| **T2B37** | Tier 3 measured | Round 2; **Superseded (R3-1, R3-8) → T2B56** | C8 with the crown and the masteries is 4.98 BT a round at Tier 3 Lv 50, +25% over Tier 1's parties there and +17% over itself uncrowned (C1 crowned 4.82); masteries as classes drafted them (Juggernaut ×0.6, Resonance 30%, Spellbind +20%, Menagerie, Overflow 10%) | Estimates | Tier 3 deepens every class alike |
| **T2B38** | The Duel's rail on the sixteen (amends T2B9) | Round 2; **Kept, changed (R3-1) → T2B62** | The keepers' twists add a chip: the Warlord's and Invoker's second farewell (11 on a lone champion), the Blademaster's and Runeblade's second familiar (10); the Duel's shields at least 14 | Keep 13 | No act may Break a Duel boss |
| **T2B39** | A healerless party (a finding) | Round 2; **Kept** | Two supports carry a party with no healer through the attrition check (×2.6 every fight won); with T2B24's ladder a keeper healer's party stays ahead at ×4; the one-healer rule stays a ceiling, not a floor | Forbid a healerless party; supports' sustain off without a healer | The owner's "support a bit" holds where it matters most |
| **T2B40** | The previews | Round 2; **Superseded → T2B65** | Five pages: tiers, the guardrail, the comps, the stress check, every call | Three | The review needs the measurements |
