# Balance in Tiers 2 and 3

> **Status: round 2, the owner's requirements (R2-11, R2-12), 2026-11-05. Nothing here is built.** One doc of the [Tier 2
> and Tier 3 set](README.md), calls **T2B1–T2B19** from round 1 and **T2B20–T2B40** from round 2, each with a
> recommendation; no open questions. It carries [stat-balance.md](../tier-rework/stat-balance.md) (SB1–SB18),
> [weaknesses-v2.md](../tier-rework/weaknesses-v2.md) (WK1–WK13) and the combat pass (D282) onto **Tier 1 as built**
> (engine v21, save v36), and in round 2 **measures the sixteen Tier 2 classes on the harness**: party value (R2-11), the
> band, the stress check, the knobs, the comps (R2-12). The manual ([combat](../../game/combat.md)) is the game as it plays.
>
> **The owner, round 2:** "I'm really scared of doing too extreme variants that may become hard to balance which is
> something very common in other games that add things like healers or buffers or hybrid dps and they become useless
> overall." And: "I consider Tier 1 in it's current state in a 'nice', 'balanced-enough' state." **This doc is where that
> fear is answered with measurements**, and nothing in it moves Tier 1.
>
> **Pages** (desktop, light and dark): [balance by tier](previews/balance-tiers.html) ·
> [the guardrail: the sixteen against their parents](previews/balance-sim.html) ·
> [the comps, measured](previews/balance-comps.html) · [the stress check](previews/balance-stress.html) ·
> [every call](previews/balance-calls.html).
>
> **How the numbers were made:** the sixteen's rules on a **scratch fork of engine v21 and its Auto**, every Uma built by
> the live harness (`world/balance-party.ts`: gear, Extra Stats, a Learner's Limit Break, Class Rank on Tier 1's pace),
> with Tier 2's skill MP (×1.7) and healing divisor (÷ 540), [gear](gear.md)'s Suggested types and forms (T2G26, T2G36)
> and [extra stats](extra-stats.md)' Prowess presets (T2E37); the owner's two parties; every stage of the level, **16
> seeds** (1,280 fights a party and level); not committed. [§4.1](#41-how-the-sixteen-were-measured-t2b20) lists what is
> emulated exactly and what is approximated. Round 1's Tier 1 rows are the live code's.

## 1. At a glance

**The answer to the owner's fear, in three lines:**

1. **At classes.md's values, the sixteen are not level.** Measured, the Spellblades' supports are worth **+18 to +50%**
   over their parents (their lone Light or Katana slot casts Brave and Faith or Armor Break every act, so the statuses sit
   at three stacks the whole fight), the Battlemage **−2 to −11%**, the hybrid keepers' twists **about 0%**. Only **14 of
   36** class-and-level cells sit in the band.
2. **Six knob moves bring 34 of 36 inside it** (every class within ±5 points of the twelve's mean gain at Tier 2 Lv 10,
   30 and 50; the two misses are the Sentinel at Lv 10 and 30, −9.4 and +7.0 points, her value swinging with the healer's
   own Armor Break). The biggest is a new rule for the support level: **a support's status is topped up, never built
   up, at one or two stacks, and her Brave and Faith land on the Uma she wards.**
3. **No variant is useless.** On the stress check (a region's elite, its boss's first wave and its boss as one fight,
   foes' offense ×2 to ×4) **every healer and support is the better pick of her pair somewhere**: the battle healers on
   curve, the keeper healers from ×3.2; the supports under attrition (with the healer down their parties lose a fifth to
   two fifths fewer Umas), the keepers on curve.

| | Tier 1 (live) | Tier 2 | Tier 3 | Call |
|---|---|---|---|---|
| **A class against her parent** (party damage a round, her seat swapped) | — | **+3 to +7% on average**; every class within ±5 points (34 of 36 cells) | the same classes, crowned | T2B21, T2B22 |
| **The comps** (C1–C8 against their Tier 1 party) | the reference | **+1.7 to +9.3%** at Lv 10 · 30 · 50 | C8 +25% at Lv 50, crowns and masteries in | T2B34, T2B37 |
| **The stress check** (Lv 50, ×2.6: fights won, healer on · off) | Tier 1's parties at Tier 2 Lv 50: Party 1 99 · 60%, Party 2 98 · 48% | every comp 98–100%; supports' parties 70–85% with the healer off | 100% | T2B23 |
| Flat build values (gear, Extra Stats, ★, every form) | ×1 | ×1.8 | ×2.6 | T2B1 |
| Foes' HP and DEF term (**re-sized, measured**) | — | 1.06 → 1.10 | 1.10 → 1.26 (the crowns) | T2B4, T2B5, T2B36 |
| Shields: sub-bosses · bosses | 6 · 8 | **7 · 9 from Lv 1** | 7 · 9 | T2B7 |
| Weak kinds: regulars · sub-bosses · bosses | 4 · 3 · 3 | 3 by role · 3 · 3 from Lv 1 (live) | the same | T2B8 |
| Skill MP · healing divisor | ×1 · ÷ 300 | ×1.7 · ÷ 540 | ×2.4 · ÷ 780 | T2B10, T2C18 |
| Statuses | +10% a stack, cap 3, three levels | four levels; the support level topped up | the same, a crowned capstone a stack more | T2B12, T2B24 |
| The Duel's shields | 13 | at least 14 | at least 14 | T2B38 |

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

The fork plays Tier 1 exactly as the live engine. **Tier 1 Lv 50**, 16 seeds; V = D + S in BT a round (§4.2):

| | Brawler | Sorcerer | Hybrid | Summoner | Healer | Party (Σ D) | Rounds: fights · sub-bosses · bosses | Taken a fight |
|---|---|---|---|---|---|---|---|---|
| **Party 1** | 1.00 | 1.02 | Arms Spellblade 0.81 + 0.03 | Tome Summoner 0.72 + 0.03 | Paladin 0.37 + 0.33 | 3.91 | 3.98 · 4.90 · 7.83 | 35 · 298 · 465 |
| **Party 2** | 1.06 | 1.10 | Tome Spellblade 0.83 + 0.11 | Arms Summoner 0.72 + 0.09 | Cleric 0.35 + 0.42 | 4.05 | 3.90 · 4.82 · 7.32 | 109 · 409 · 426 |

Every fight won. classes.md's analytic anchors (§2.7 there) had the Paladin's statuses at 0.37 BT and a path beside the
healer's same status at 0.03; measured 0.33 and 0.03, and a path no one else carries (the Tome Spellblade's Armor Break)
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
| T2B14 | The damage stack | **Kept, changed (R2-2, R2-6–R2-8)** | No focus; types by grade; step 4b; Momentum (§4.10) |
| T2B15 | Defense | **Kept** | — |
| T2B16 | The mirrors | **Kept, changed (R2-2)** | Mirrored Tier 2 classes (§4.9) |
| T2B17 | The healers | **Kept, changed (R2-3)** | Four healer classes; keeper against battle healer on the stress check |
| T2B18 | The checklist | **Kept, changed** | The guardrail's rows added |
| T2B19 | Accessory viability | **Kept** | Gear holds it (T2G35) |

**Counts (19):** Kept 8 · Kept, changed 10 · Superseded 1 (T2B8, by R2-6) · Broken 0.

## 4. Tier 2 in full

### 4.1 How the sixteen were measured (T2B20)

A Tier 2 world plays Tier 1's rules × tier today, and none of the sixteen is built. So their rules ran on a **scratch fork
of `battle/engine.ts` and `battle/auto.ts`** (not committed), each Uma built by the live harness and frozen as the game
would, every rule switched per Uma:

| Rule (call) | On the fork |
|---|---|
| **Momentum** (T2C34) | Exact: a factor beside the statuses (step 5), a stack after each act (skill, Attack or Limit Break), three at most, lost on a knockout |
| **The cross** (T2C35) | Exact: every hit on her stat, Limit Breaks too; defense, weakness and statuses by the kind's channel; her other channel's weapon plays the other pure class's tree (the Spellfist's Thunder the Sorcerer's), its Might on her stat; her hand |
| **Both halves** (T2C37) | Exact: the familiar's extra hit on both halves of her pair |
| **Both summons** (T2C38) | Exact: a summon of either half lingers; two farewells at her next pair |
| **The support level** (T2C39–T2C41) | Exact: every skill of her Katana, Bow, Light and Dark trees carries its status at the ladder and reach given; her Barrier after each skill act on the most threatened Uma (a third of the healers' share at her deepest half's depth × her healing scale); her farewell's mend on every Uma (a tenth of the share at the summon's depth) |
| **The healer keepers** (T2C43) | Exact: every status she lands one stack more, to 3; Surge's ×1.15 where her line B's status stands at 3 |
| **The battle healers** (T2C44) | Exact: hand ×0.6, MP ×0.7; her mends, Barriers, Regen and drain ×0.7; the revive and the rescue floor kept |
| **Tier 2's frame** | Skill MP ×1.7 (×2.4 in Tier 3) and the healing divisor 300 × 1.8 (× 2.6); Class Rank on Tier 1's pace (T2B3) |
| **Gear round 2** | Exact: Suggested types (Pure ×1.30 + 0.02 a grade; a Dual's partner ×1.10 + 0.02, its kind both weakness and locks; Tier 3's Keen, Tempered and Evolved); forms by T2G36 (Great, Twofold, a support's Kindred from a slot's G5 as every Uma's hits-only bonus) |
| **Extra Stats round 2** | Exact: Prowess by T2E37 (Offense; Multi-hit for the Spellblades' children, Area for the Summoners', their points off her stat) at step 4b by the hit's cast |
| **Tier 3** | Crowned capstones (5.6, +4 MP, a stack more, the sixth MP step) and the five masteries as drafted (T2C58) |
| **Left out** | Class lines, line C, Break tips and Tier 2's ten equipped slots (every class gets them; the build re-measures); two lines held in Tier 3; the Vow forms; Tier 3's rider step (Tier 2's rates × 2.6) |

Every Tier 1 class plays on the fork exactly as live (§2.6). **The reference** for a Tier 2 class is her parent in the same
seat with the same Tier 2 frame and toolbox (her keeper's gear and Extra Stats presets), so a gain is her class's rule and
nothing else.

### 4.2 Party value on the harness (T2B21; amends T2C56)

R2-11: "her own damage plus the damage her buffs and debuffs add to others plus the damage her mends and wards save".
Measured:

| Term | On the harness | T2C56 (classes, analytic) |
|---|---|---|
| **D**, her damage | Her damage **a round of the fight** (so a knockout costs her turns, and her kills are hers), in **BT**: an on-curve Brawler's damage a round at the same tier, level and kind of fight | A turn, her parent's measured damage × her rule's factor |
| **S**, what her statuses add | What the **other four lose** when her statuses, wards, mends and keeper twist are switched off (the counterfactual run): overlap, the cap of 3 and the build-up are in it | Σ value × strength × part, two carriers a quarter |
| **H**, her sustain | **On the stress check** (T2B23): wins, knockouts, HP left and party damage a round under attrition | ε × the HP saved |
| **A class's gain** | The party's damage a round with her in her parent's seat, minus with her parent, over her parent's V | V against her parent's V |
| **Weights** | Regular fights 2, sub-bosses 1, bosses 1 (D266) | Lv 50, by damage |

**Why a round, not a turn:** a party's damage a round over a fixed set of stages is the inverse of its rounds, the speed the
owner plays; it charges a knockout, and it doesn't credit a member for kills she takes from another. **Why a counterfactual,
not a formula:** a status re-cast every act builds to the cap whatever its stacks, which no analytic strength caught (§4.4).

### 4.3 The band (T2B22; amends T2C64)

**On curve, at Tier 2 Lv 10, 30 and 50: each of the twelve damage and support classes' gain within ±5 points of the
twelve's mean gain at that level.** The four healers are read on the stress check (their on-curve gain is damage alone and
would drag the mean). The mean is the class step Tier 2 adds; measured at the proposed knobs, **+7.0 · +3.9 · +3.2%** (the
toolbox's term prices it, T2B36).

### 4.4 The sixteen at classes.md's values

Each class in her parent's seat of the owner's party (Party 1 or Party 2; the pure classes in both, averaged), Tier 2:

| Class (parent) | Lv 10 | Lv 30 | Lv 50 | What it says |
|---|---|---|---|---|
| Berserker (Brawler) | +4.5% | +1.8% | +4.5% | Momentum's +5% a stack is short of the mean |
| Spellfist (Brawler) | +10.4% | +6.7% | +3.0% | In the band |
| Archmage (Sorcerer) | +4.9% | +2.7% | +4.1% | As the Berserker |
| **Battlemage** (Sorcerer) | **−2.5%** | **−4.7%** | **−11.4%** | Her Arms meet the physical defenses Tier 2's strikers and guards raise, and her preset drops the Blizzard's sweep |
| Blademaster (Arms Spellblade) | +0.5% | −0.1% | −0.1% | **Her twist is worth nothing:** the same damage in more hits |
| **Sentinel** (Arms Spellblade) | **+33.9%** | **+46.0%** | **+49.8%** | Her lone Tome is Light: Brave and Faith on every Uma every act, built to 3 |
| Runeblade (Tome Spellblade) | −0.6% | +0.6% | −0.7% | As the Blademaster |
| **Enchanter** (Tome Spellblade) | **+32.6%** | **+19.5%** | **+18.4%** | Her lone Arm is the Katana: Armor Break every act, every foe at depth 5 |
| Warlord (Arms Summoner) | +4.1% | −0.2% | +1.8% | The second farewell is worth 1–3% |
| Druid (Arms Summoner) | +12.4% | +10.2% | −1.9% | Mind Break every act; the Greatsword costs her the Axe's sweep |
| Invoker (Tome Summoner) | +4.0% | +1.1% | +1.3% | As the Warlord |
| Shaman (Tome Summoner) | −1.5% | 0.0% | −2.3% | Her every-act status is Enfeeble: sustain, nothing on curve |
| Guardian (Paladin) | +5.5% | 0.0% | +1.1% | One stack more is near nothing: re-cast statuses reach 3 anyway |
| Templar (Paladin) | +12.1% | +9.7% | +5.7% | ×0.6 power, as designed |
| Bishop (Cleric) | +15.5% | 0.0% | +0.1% | As the Guardian (Lv 10: depths 1–2, single stacks) |
| Exorcist (Cleric) | +15.9% | +6.9% | +7.3% | As the Templar |
| **Mean of the twelve** | +8.6% | +7.0% | +5.5% | **14 of 36 cells within ±5** |

**The finding the analytic model missed:** a pair class casts **one of each channel every act**, so whatever status rides
her lone other-channel weapon is re-cast every round and, built up, **sits at three stacks the whole fight**. On every Uma,
Brave and Faith at 3 is +30% on every hit of the party: 0.4–0.5 BT, more than the Sentinel's own damage cut.

### 4.5 The knobs, in order (T2B33), and the values (T2B24–T2B31)

One at a time, re-measured at Lv 10, 30 and 50 on 16 seeds; the order runs from the largest error to the smallest:

| # | Knob | classes.md | **Proposed** | Amends | Measured effect |
|---|---|---|---|---|---|
| 1 | **The support level's rule** (T2B24) | The healers' ladder 1 · 1 · 2 · 2 · 3, built up; Brave and Faith on every Uma | **1 · 1 · 1 · 2 · 2, topped up to its stacks, never built past them; Brave and Faith on the Uma she wards** | T2C39, T2C45 | The Sentinel +50 → +3%, the Enchanter +18 → +7% (Lv 50) |
| 2 | **The supports' hands** (T2B25) | ×0.85 (Spellblades'), ×0.9 (Summoners'); the Druid on the Greatsword | **Sentinel ×0.95, Enchanter ×0.8, Druid ×0.95 on her parent's Axe, Shaman ×1** | T2C39, T2C54 | Each support near the mean on curve |
| 3 | **Momentum** (T2B26) | +5% a stack | **+6% a stack** (three: +18%) | T2C34 | The pure keepers +5% at Lv 50 |
| 4 | **The cross** (T2B27) | ×1.05 both; the Heavy twins | **Spellfist ×1.05, Battlemage ×1.3; the Scatter twins** | T2C35, T2C54 | The Battlemage −11 → −2% at Lv 50 |
| 5 | **Spellblade keepers** (T2B28) | The familiar on both halves | **… and her familiar's hit pierces; hands +0.03 a half** | T2C37 | +0 → +2 to +9% |
| 6 | **Summoner keepers** (T2B29) | Both summons linger | **… hands +0.03 a half** | T2C38 | +2 to +9% |
| 7 | **Battle healers** (T2B31) | ×0.6 power, MP ×0.7, shares ×0.7 | **Kept** | — | +6 to +16% on curve, behind the keeper from ×3.2 |
| 8 | **Healer keepers** (T2B30) | One stack more | **Kept**; one round longer tried and refused | — | The keeper the attrition pick |

- **Why the support rule, not a deeper cut:** with the build-up any ladder sits at 3 by the third round, so no cut short
  of halving her damage brings the Sentinel down; and on every Uma, even one stack of Brave and Faith was 0.3 BT. Topped
  up, her stacks are her ladder's; on her ward, Brave and Faith are a support's piece of the kit, as R2-3 asks ("a little
  of the healers' kit").
- **Why each support her own cut:** each one's every-act status is different: the Sentinel's lone Tome carries Brave and
  Faith (her ward only now), the Enchanter's lone Arm Armor Break (every foe at depth 5), the Druid's lone Tome Mind Break
  on every foe, the Shaman's lone Arm Enfeeble on every foe (sustain, nothing on curve, so no cut).
- **Why the Battlemage ×1.3 and the Spellfist ×1.05:** the cross is not symmetric on the harness, for the two reasons the
  runs point at: the Spellfist's Tome meets M.DEF, which strikers and guards hold at 0.8 of their DEF, where the
  Battlemage's Arm meets DEF; and a hand never reaches her Limit Break (a quarter of a Sorcerer's damage at Lv 50), so her
  Lv 50 stays the lowest cell (−1.8%) even at ×1.3. Tested: ×1.35 on the Heavy twins moved Lv 50 less than a point
  (−3.7%) and Lv 10 three; giving her Limit Break her best weapon's Might on kinds she doesn't hold moved Lv 50 one point.
- **Why the familiar pierces:** Pierce is the Spellblades' own line B (CP42), so the keeper's twist reads as hers; alone
  it gives +1 to +7%, the hands carry the rest.
- **Why not a round longer for the healer keepers:** it lifted the Guardian and the Bishop to +10 to +12% at Lv 50 on
  curve, past their battle healers, and left the Templar and the Exorcist the better pick at Lv 30 alone. One stack more
  keeps the trade the owner asked for: the battle healer on curve, the keeper under attrition (§4.8).

### 4.6 The sixteen at the proposed knobs (the guardrail)

| Class | Lv 10 | Lv 30 | Lv 50 | D + S at Lv 50 (her parent's) |
|---|---|---|---|---|
| Berserker | +5.6% | +2.0% | +5.2% | 1.14 + 0 (1.04) |
| Spellfist (Greatsword, Axe, Thunder) | +6.5% | +4.5% | +4.3% | 1.12 + 0 (1.04) |
| Archmage | +5.8% | +3.4% | +5.1% | 1.21 + 0 (1.12) |
| Battlemage (Fire, Blizzard, Lance) | +10.9% | +8.3% | −1.8% | 1.22 + 0 (1.12) |
| Blademaster | +9.0% | +4.5% | +3.6% | 0.89 + 0.01 (0.85 + 0.02) |
| **Sentinel** | **−2.4%** | **+10.9%** | +2.9% | 0.72 + 0.14 (0.85 + 0.02) |
| Runeblade | +6.8% | +2.3% | +2.8% | 0.92 + 0.05 (0.86 + 0.09) |
| Enchanter | +7.0% | +2.5% | +6.6% | 0.69 + 0.23 (0.86 + 0.09) |
| Warlord | +8.6% | +2.0% | +6.8% | 0.78 + 0.10 (0.73 + 0.10) |
| Druid (Bow, Axe, Dark) | +7.1% | +2.3% | −1.5% | 0.65 + 0.11 (0.73 + 0.10) |
| Invoker | +8.6% | +3.6% | +3.0% | 0.77 + 0.01 (0.73 + 0.02) |
| Shaman | +10.4% | +0.8% | +1.2% | 0.70 + 0.03 (0.73 + 0.02) |
| **Mean of the twelve** | **+7.0%** | **+3.9%** | **+3.2%** | **34 of 36 cells within ±5** |
| Guardian *(stress)* | +5.5% | 0.0% | +1.1% | 0.37 + 0.24 (0.37 + 0.24) |
| Templar *(stress)* | +12.1% | +9.7% | +5.7% | 0.42 + 0.23 (0.37 + 0.24) |
| Bishop *(stress)* | +15.5% | 0.0% | +0.1% | 0.35 + 0.36 (0.35 + 0.36) |
| Exorcist *(stress)* | +15.9% | +6.9% | +7.3% | 0.41 + 0.36 (0.35 + 0.36) |

- **The two misses are the Sentinel's**, −9.4 points at Lv 10 and +7.0 at Lv 30: her value is the Armor Break the Paladin
  beside her doesn't yet spread (the Paladin's every-foe Armor Break opens at depth 5), so it swings with the level. Her
  three-level mean (+3.8%) sits on the band's middle; a cut that fixes one level breaks the other. **Recommended: accept,
  and re-read her on the build's run** with the class lines in (her Penumbra Edge carries a status at 2 · 2 · 3).
- **The Battlemage at Lv 50 sits on the band's edge** (−1.8%, 5.0 under the mean).
- **Kindred counts** (T2B32): the supports' presets wear it from a slot's G5, so the others' D carries it (about +3% of the
  party's damage, gear's T2G34).

### 4.7 The comps, measured (R2-12; T2B34, T2B35)

classes.md's C1–C8 on the harness at the proposed knobs, each against its Tier 1 party at the same level (Tier 2's toolbox
on both); classes.md's analytic gain is its V over its Tier 1 V at Lv 50. Party damage a round in BT; every fight won.

| Comp | Members | Analytic, Lv 50 | **Measured Lv 10 · 30 · 50** | Party, Lv 50 (BT) | Support (share) | Rounds, Lv 50: fights · sub · boss | Taken a fight, Lv 50 |
|---|---|---|---|---|---|---|---|
| **Tier 1** Party 1 · Party 2 | — | — | 3.87 · 3.56 · 4.04 and 3.77 · 3.63 · 4.18 BT | 4.04 · 4.18 | 0.28 · 0.55 | 3.70 · 4.47 · 7.05 | 28 · 487 · 467 |
| **C1** Party 1's keepers | Berserker, Archmage, Blademaster, Invoker, Guardian | +9.1% | **+5.5 · +3.9 · +4.4%** | 4.21 | 0.25 (6%) | 3.66 · 4.25 · 6.53 | 14 · 281 · 279 |
| **C2** Party 2's keepers | Berserker, Archmage, Runeblade, Warlord, Bishop | +9.1% | **+7.7 · +1.7 · +5.4%** | 4.40 | 0.54 (12%) | 3.50 · 4.11 · 6.35 | 123 · 160 · 470 |
| **C3** Both pures expanded | Spellfist, Battlemage, Blademaster, Invoker, Guardian | +7.9% | **+9.3 · +8.0 · +5.2%** | 4.25 | 0.23 (5%) | 3.60 · 4.35 · 6.35 | 25 · 293 · 292 |
| **C4** Templar + Sentinel | Berserker, Archmage, Sentinel, Invoker, Templar | +7.5% | **+4.3 · +5.3 · +5.7%** | 4.27 | 0.35 (8%) | 3.68 · 4.09 · 6.54 | 6 · 93 · 274 |
| **C4b** Exorcist + Enchanter | Berserker, Archmage, Enchanter, Warlord, Exorcist | +7.3% | **+7.4 · +5.6 · +6.7%** | 4.46 | 0.68 (15%) | 3.48 · 4.07 · 6.27 | 21 · 140 · 237 |
| **C5** A Summoner to support | Berserker, Archmage, Runeblade, Druid, Bishop | +5.9% | **+7.9 · +2.3 · +4.0%** | 4.35 | 0.51 (12%) | 3.61 · 4.12 · 6.39 | 116 · 268 · 434 |
| **C6** Both hybrids to support | Berserker, Archmage, Sentinel, Shaman, Guardian | +3.5% | **+5.1 · +3.1 · +3.7%** | 4.19 | 0.34 (8%) | 3.69 · 4.20 · 6.77 | 11 · 230 · 284 |
| **C7** Every member an expander | Spellfist, Battlemage, Sentinel, Shaman, Templar | +3.0% | **+7.4 · +8.5 · +5.7%** | 4.27 | 0.39 (9%) | 3.56 · 4.26 · 6.62 | 7 · 208 · 198 |
| **C8** Tier 3, a mixed five | Berserker, Battlemage, Blademaster, Shaman, Bishop | +13% (Tier 3's own) | **Tier 3: +9.9 · +6.9 · +24.6%** | 4.98 | 0.47 (9%) | 2.89 · 3.26 · 5.28 | 4 · 68 · 70 |

- **Every Tier 2 comp sits +1.7 to +9.3% over its Tier 1 party** at every level, the twelve's mean step. The analytic
  model spread them +3.0 to +9.1% with the keepers first and the support-heavy comps last; measured, the spread is
  narrower and the order mixed (C7 +5.7% at Lv 50, C1 +4.4%): it priced the supports' statuses below what they did and
  the keepers' twists above.
- **The support-heavy comps are the safest, not the slowest:** C6 and C7 take 9–28% less than C1 on curve and 16–27% less
  at ×2.6, and C6 wins the hardest attrition most often (98.8% at ×3.2, 85.6% at ×4, §4.8).
- **C3 both ways** (T2B35, gear's T2G25): on the Scatter twins C3 is 4.23 · 3.85 · 4.25 BT, on classes.md's Heavy twins
  4.15 · 3.73 · 4.29 (Battlemage ×1.3 in both): **+1.9, +3.2 and −0.9%**; C7 +0.2 to +1.2%. The Scatter twins keep every
  kind in two hands in C3 (gear: 4.19 a regular); the cost is **Thunder missing from 8 of the 64 keeper and expander
  mixes** (4 a party; the cross-reference's recount, classes T2C54) (the Berserker with the Battlemage and a Spellblade's support), where the Heavy twins hold all ten in all 64.
  **Recommended: the Scatter twins**, the party hint naming the missing Thunder (T2C63); the alternative is classes.md's
  Heavy twins with the Battlemage 2.7 points lower at Lv 50.

### 4.8 The stress check: the attrition check (T2B23)

**Why a check of its own:** on curve a party takes 1–2% of its HP a fight, so a mend is insurance the harness can't price
(T2C64 defers it here). **The design:** each region's elite, its boss's first wave and its boss **as one fight** (three
waves, HP and MP carried, the 10% breather between), the foes' offense ×2, ×2.6, ×3.2 and ×4, at Tier 2 Lv 30 and 50
and Tier 3 Lv 50, 16 seeds (320 fights a cell), at the proposed knobs. **Read:** fights won, knockouts a fight, HP left,
damage taken, the party's damage a round (a knocked-out Uma deals nothing), and each healer and support again with her
sustain switched off.

**Where sustain starts to matter** (Tier 2 Lv 50; won · KOs a fight):

| | ×2 | ×2.6 | ×3.2 | ×4 |
|---|---|---|---|---|
| Party 1, the Paladin on · her sustain off | 100% · 0.05 / 91% · 1.23 | 99% · 0.40 / 60% · 2.71 | 92% · 1.05 | 68% · 2.37 |
| Party 2, the Cleric on · her sustain off | 100% · 0.07 / 78% · 1.80 | 98% · 0.45 / 48% · 3.07 | 86% · 1.25 | 57% · 2.64 |

At Lv 30 sustain barely matters even at ×2.6 (97% won with the healer off): the fights are short. **Lv 50 at ×2.6 is
where a healer starts to matter, ×4 where she decides.**

**The healers** (each in her parent's seat; on-curve gain, then won · KOs at each multiplier; party damage a round at ×2.6):

| Healer | On curve, Lv 10 · 30 · 50 | ×2 | ×2.6 | ×3.2 | ×4 | Damage a round, ×2.6 |
|---|---|---|---|---|---|---|
| Paladin | — | 100% · 0.05 | 99.1% · 0.40 | 91.9% · 1.05 | 67.8% · 2.37 | 7,190 |
| **Guardian** | +5.5 · 0 · +1.1% | 100% · 0.06 | 99.1% · 0.40 | **91.9% · 1.04** | **67.5% · 2.36** | 7,236 |
| **Templar** | **+12.1 · +9.7 · +5.7%** | 100% · 0.07 | 99.4% · 0.41 | 89.7% · 1.21 | 63.4% · 2.53 | 7,331 |
| Cleric | — | 100% · 0.07 | 97.8% · 0.45 | 85.6% · 1.25 | 57.2% · 2.64 | 7,494 |
| **Bishop** | +15.5 · 0 · +0.1% | 100% · 0.07 | **97.8% · 0.45** | **85.0% · 1.27** | **56.9% · 2.65** | 7,511 |
| **Exorcist** | **+15.9 · +6.9 · +7.3%** | 100% · 0.10 | 96.6% · 0.54 | 77.5% · 1.67 | 51.9% · 2.89 | 7,563 |

**Each healer is the better pick somewhere** (T2B23's bands met): the battle healer on curve (ahead of the keeper at every
level but the Bishop's Lv 10, by up to 10 points), the keeper under attrition (+2 to +8 points of fights won from ×3.2, a fifth less damage taken at ×2.6); the two
within 1.3% in party damage a round at ×2.6. The keeper plays as her Tier 1 parent under attrition, and the battle healer
gives that up for damage.

**The supports** (×2.6, Tier 2 Lv 50; the last column switches the **healer's** sustain off, so the support's ward, mend
and Enfeeble carry alone):

| In the seat | Won | KOs a fight | Taken a fight | Damage a round | The healer off: won · KOs |
|---|---|---|---|---|---|
| Arms Spellblade (Party 1) | 99.1% | 0.40 | 4,782 | 7,190 | 59.7% · 2.71 |
| Blademaster | 99.1% | 0.40 | 4,751 | 7,296 | 65.9% · 2.49 |
| **Sentinel** | **99.4%** | **0.32** | **4,262** | 7,360 | **82.2% · 1.48** |
| Tome Spellblade (Party 2) | 97.8% | 0.45 | 5,184 | 7,494 | 47.5% · 3.07 |
| Runeblade | 98.4% | 0.38 | 4,799 | 7,679 | 51.2% · 2.88 |
| **Enchanter** | **99.4%** | **0.35** | **4,645** | 7,586 | **74.7% · 1.77** |
| Arms Summoner (Party 2) | 97.8% | 0.45 | 5,184 | 7,494 | 47.5% · 3.07 |
| Warlord | 97.8% | 0.44 | 5,039 | 7,588 | 53.4% · 2.80 |
| **Druid** | **99.7%** | **0.20** | **3,760** | 7,663 | **69.7% · 2.18** |
| Tome Summoner (Party 1) | 99.1% | 0.40 | 4,782 | 7,190 | 59.7% · 2.71 |
| Invoker | 99.4% | 0.38 | 4,779 | 7,274 | 66.2% · 2.42 |
| **Shaman** | **99.7%** | **0.27** | **3,853** | 7,365 | **85.3% · 1.47** |

**Every support's party is safer than her keeper's and her parent's**: 3–25% less damage taken than her keeper's and
fewer knockouts, and with the healer down it still wins 70–85% of fights where the keeper's wins 51–66%.

**A party with no healer** (T2B39; one healer a party is a ceiling, not a floor; won · KOs a fight):

| Party (Tier 2 Lv 50) | ×2 | ×2.6 | ×3.2 | ×4 |
|---|---|---|---|---|
| N0: Berserker, Archmage, Blademaster, Invoker, Runeblade (no healer, no support) | 99.4% · 0.50 | 88.4% · 1.42 | 65.6% · 2.42 | 35.9% · 3.58 |
| N1: … the Sentinel and the Shaman for the Blademaster and the Invoker | 100% · 0.03 | 99.4% · 0.30 | 95.3% · 0.82 | 73.1% · 1.96 |
| N2: … the Sentinel alone | 100% · 0.11 | 96.2% · 0.66 | 76.2% · 1.86 | 45.0% · 3.17 |
| N3: … the Shaman alone | 100% · 0.21 | 98.8% · 0.66 | 86.2% · 1.48 | 56.2% · 2.71 |
| N4: … the Druid alone | 99.7% · 0.30 | 93.1% · 1.08 | 71.2% · 2.13 | 40.6% · 3.31 |
| C1 (the Guardian) · C6 (the Guardian with N1's supports) | 100% · 100% | 98.8% · 100% | 94.1% · 98.8% | 78.1% · 85.6% |

Two supports carry a healerless party through ×2.6; **a keeper healer's party stays ahead at ×4** (C1 78% and C6 86%
against N1's 73%). Before T2B24 (the healers' ladder, built up) N1 won 87% at ×4, ahead of C1's 84%: the Shaman's Enfeeble
at 3 on every foe was a healer's worth of sustain. With the support rule it is a support's.

**Is any variant useless? No.** Each of the sixteen is the better pick of her pair somewhere, measured:

| Siblings | Where each is the better pick |
|---|---|
| Berserker · Spellfist | Level on curve (both within the band at every level); the Spellfist adds an element, the Arcane ward's other channel |
| Archmage · Battlemage | The Battlemage at Lv 10 and 30 (+10.9, +8.3%), the Archmage at Lv 50 (+5.1 against −1.8%); the Battlemage answers an Iron ward |
| Blademaster · Sentinel | The Blademaster on curve at Lv 10 and 50; the Sentinel at Lv 30 and under attrition (82% won with the healer down, 66%) |
| Runeblade · Enchanter | Level at Lv 10 and 30; the Enchanter at Lv 50 and under attrition (75% against 51%) |
| Warlord · Druid | The Warlord on curve at Lv 50 (+6.8 against −1.5%); the Druid under attrition (KOs 0.20 against 0.44) |
| Invoker · Shaman | The Shaman at Lv 10 and under attrition (85% against 66%); the Invoker at Lv 30 and 50 |
| Guardian · Templar | The Templar on curve at every level; the Guardian from ×3.2 (92 against 90%, 68 against 63% at ×4) |
| Bishop · Exorcist | The Exorcist on curve at Lv 30 and 50; the Bishop from ×2.6 (85 against 78% at ×3.2, 57 against 52% at ×4) |

The supports are the "buffers" of the owner's fear, and they are the one shape most worth taking where fights get long;
the battle healers the "hybrid healers", worth taking where they don't. **The owner's comps balance as he described:**
"swap Paladin for dps and then spellblade to support so they balance each other" is C4: +4 to +6% on curve, and 99.7% won
at ×2.6, the second-safest comp.

### 4.9 The mirrors and the healers re-checked (T2B16, T2B17)

| Mirrors (gain, Lv 10 · 30 · 50) | Arms-led | Tome-led | Apart, at most |
|---|---|---|---|
| Berserker · Archmage | +5.6 · +2.0 · +5.2% | +5.8 · +3.4 · +5.1% | 1.4 points |
| Spellfist · Battlemage | +6.5 · +4.5 · +4.3% | +10.9 · +8.3 · −1.8% | 6.1 points (Lv 50) |
| Blademaster · Runeblade | +9.0 · +4.5 · +3.6% | +6.8 · +2.3 · +2.8% | 2.2 points |
| Sentinel · Enchanter | −2.4 · +10.9 · +2.9% | +7.0 · +2.5 · +6.6% | 9.4 points (Lv 10) |
| Warlord · Invoker | +8.6 · +2.0 · +6.8% | +8.6 · +3.6 · +3.0% | 3.8 points |
| Druid · Shaman | +7.1 · +2.3 · −1.5% | +10.4 · +0.8 · +1.2% | 3.3 points |

- **T2B16 in round 2:** mirrored classes within 5 points of each other; four of six pairs meet it; the Spellblades'
  supports miss at Lv 10 and 30 and the cross at Lv 50, both the party context (Party 1 against Party 2), not the rule. The
  70/30 splits stand as Tier 1's (no hand of a split moved).
- **T2B17:** the healers' mends and absorbed Barriers, Guardian ÷ Bishop and Templar ÷ Exorcist, within ±10% at every
  level (they share every number, D282's H3); keeper against battle healer is the stress check's.

### 4.10 Every source keeps its share, and the stack (T2B1, T2B14)

- **Flat ×1.8 and ×2.6** for every round-2 flat source: the Great and Twofold forms, Kindred (+4 a slot at Tier 2's G10),
  Extra Stats' kind rows; **percentages unscaled**: a type's weak multiplier by grade, the Insignia riders, Area, Multi-hit,
  Life steal, MP back, Area guard, Momentum, the status levels.
- **The stack in Tier 2:** step 1 offense (a cross reads her one stat on every hit; forms, Kindred and the ★ on hits only;
  kind rows with Might and the Orbs) → step 3 **her type's weak multiplier** (Pure ×1.30 → ×1.50, a Dual's partner ×1.10 →
  ×1.30) → step 4 Insignias with riders in one factor → **step 4b Area and Multi-hit** (by the hit's cast; a Limit Break
  reads neither) → step 5 **statuses and Momentum** (a factor of its own beside them) → the rest as Tier 1.
- **Ceilings on one weak hit before statuses** (gear's T2G37): ×1.69 · ×2.22 · ×2.62; on an area hit × the Area cap (+60%).
  No cap: the terms price the on-curve act.

### 4.11 The foe term, re-sized (T2B4, T2B5, T2B36)

Round 1 priced a toolbox from the drafts (the focus, weapon moons, branch forms: K 1.39 at Tier 2 Lv 50). Two of those are
gone (R2-2, T2E27), so the term is **measured**: rounds a fight (weighted 2 : 1 : 1) of the owner's parties on Tier 2's
frame alone, with gear's and Extra Stats' presets, and with the sixteen's keepers (C1, C2):

| Tier · Lv | Tier 2's frame | + gear and Extra Stats | + the sixteen (C1, C2) | Speed K | The term it needs (≈ 1 + 0.7 (K − 1)) | **Proposed** |
|---|---|---|---|---|---|---|
| Tier 2 · 10 | 4.99 | 4.72 | 4.46 | 1.12 | 1.08 | 1.07 |
| Tier 2 · 30 | 3.51 | 3.36 | 3.29 | 1.07 | 1.05 | 1.08 |
| Tier 2 · 50 | 5.07 | 4.66 | 4.45 | 1.14 | 1.10 | **1.10** |
| Tier 3 · 10 | 4.86 | 4.53 | 4.20 | 1.16 | 1.11 | 1.11 |
| Tier 3 · 30 | 3.56 | 3.28 | 3.15 | 1.13 | 1.09 | 1.12 |
| Tier 3 · 50 | 5.01 | 4.42 | 3.66 (crowned) | 1.37 | 1.26 | **1.26** |

Tier 1 at Lv 50: 5.08 rounds. **Proposed (T2B36):** Tier 2 foes' HP and DEF × **(1.06 + 0.04 (ℓ − 1) ÷ 49)**, 1.06 → 1.10;
Tier 3 × **1.10 → 1.12 by Lv 35, rising to 1.26 by Lv 40** (the crowns at Class Rank 50, Lv 36) and flat after. Offense
+10% by Lv 50 and bosses × 1.1 kept (T2B6). **Provisional** until the build's own run; Lv 30's shorter fights (2.9 rounds)
round off a little of the speed, which the line smooths.

### 4.12 Shields and weaknesses from Lv 1 (T2B7, T2B8)

The **two-kind type comes with the promotion** (R2-6, T2G22), so round 1's breadth gate is gone: WK8's three kinds by role
(live) from Tier 2 Lv 1, and the shields that price the answers with them.

| | Tier 1 | Tier 2 | Tier 3 |
|---|---|---|---|
| Regulars' kinds | 2 Arms + 2 elements | 3 by role | 3 by role |
| Sub-bosses, bosses | 3 | 3 | 3 |
| **Shields: sub-boss · boss** | 6 · 8 | **7 · 9** | **7 · 9** |
| Answering a regular (gear, Suggested) | 4.32 · 4.35 | 4.28 · 4.29 (C1, C2); 4.17–4.32 the expander comps | 4.32 · 4.29 |
| Answering a sub-boss · a boss | 3.73 · 3.77 | 4.08–4.42 · 4.16–4.42 | 4.03–4.48 · 4.09–4.35 |

The rule (CP8's): Tier 1's shield × its rank's answers ÷ Tier 1's: sub-bosses 6 × 4.3 ÷ 3.73 → 7, bosses 8 × 4.3 ÷ 3.77 →
9 in both tiers. **Tier 3's bosses 9, not round 1's 10:** round 1 counted two two-kind weapons in Tier 3; XR6 kept one, and
gear's Tier 3 answers (4.09–4.35) price 9. WK12's checks
in every tier: every member answers 75% of foes or more; no more than 10% of stages leave a member nothing.

### 4.13 The Rift (T2B9, T2B38)

Draws by front; a Tier 2 front takes the world's term and `RIFT_TUNING_V19`'s scales. **The Duel's rail on the sixteen:**
a hit chips one point whatever its kinds, so the keepers' twists add chips: the Warlord's and the Invoker's second
farewell (**11** on a lone champion, was the Summoners' 10), the Blademaster's and the Runeblade's second familiar (10).
**The Duel's shields: at least 14** (the best act's chips + 3), re-counted once the class lines exist.

### 4.14 Statuses, MP and Limit Breaks (T2B10–T2B13, T2B24)

- **Four levels** (classes' T2C45), each status +10% a stack, cap 3, two rounds:

| Level | Classes | Ladder by depth | Stacking | Reach |
|---|---|---|---|---|
| None | Berserker, Spellfist, Archmage, Battlemage | — | — | — |
| A path | Blademaster, Runeblade, Warlord, Invoker | 1 · 1 · 2 (line A, depth 3–5) | Built up (Tier 1's) | The tapped foe |
| **Support** | Sentinel, Enchanter, Druid, Shaman | **1 · 1 · 1 · 2 · 2**, every skill of her Katana, Bow, Light and Dark | **Topped up to its stacks, never built past them** | Debuffs: the tapped foe (every foe at depth 5) for the Spellblades', every foe for the Summoners'; **Brave and Faith on the Uma she wards** |
| Widely | Guardian, Bishop (+1 stack), Templar, Exorcist | 1 · 1 · 2 · 2 · 3; path 2 · 2 · 3 | Built up | The tapped foe, every foe at depth 5; buffs every Uma |

- **"Topped up"** is the engine's own cap argument (`addStatus`, as Hex's): her status lands at its stacks or leaves a
  higher one standing, and a re-cast refreshes its two rounds. **"The Uma she wards"** is her Barrier's target (the most
  threatened); a Summoner support has no Barrier, so hers is the most threatened too.
- **MP and the regen** (T2B10, T2B11): ×1.7 · ×2.4, measured with every class here; no class ran dry on curve. **Limit
  Breaks** (T2B13) tier-free; Momentum multiplies a Limit Break, the cross reads her stat on one, a hand never reaches one.

### 4.15 What the simulation must confirm (T2B18)

At the engine stage that builds the sixteen, on `balance-t2.test.ts`, 16 seeds a stage (32 for a delivery):

| # | Check | Band | Measured here |
|---|---|---|---|
| 1 | Wins on curve | 100% | 100% |
| 2 | Rounds a fight against Tier 1's at the same tier level | ±10% with the term | about 12% short at Lv 50 without it (§4.11) |
| 3 | Rounds to her first Break | ±0.5 of Tier 1's | not re-measured |
| 4 | Idle stages | ≤ 10% at every level | gear: met (T2G27) |
| 5–6 | MP over a region; deep casts a bar | ±10% of Tier 1's | round 1: met with T2B10 |
| 7 | The mirrors | within 5 points of gain | 4 of 6 pairs (§4.9) |
| 8 | The healers | ±10% of mends and Barriers | shared kit |
| 9 | Accessories | D266's rule | gear: met (T2G35) |
| 10 | Defense | a regular's hit ≈ 21% at Lv 50 | 18.4% without the term |
| 11 | The Rift's fronts | the right party 91–100% a stage | not measured |
| 12 | The Duel's rail | no act Breaks a Duel boss | 11 chips against 14 |
| 13 | SB1 | each stat's share within 2.2 points | met |
| **14** | **The guardrail** (T2B22) | the twelve within ±5 points of their mean gain at Lv 10, 30, 50 | **34 of 36** |
| **15** | **The comps** (T2B34) | C1–C8 within ±5 points of each other's gain over Tier 1 | +1.7 to +9.3% |
| **16** | **The stress check** (T2B23) | its four bands | met |

## 5. Tier 3 in full

**C8** (Berserker, Battlemage, Blademaster, Shaman, Bishop) at Tier 3, every class at Class Rank 50 from Lv 36:

| Tier 3 | Lv 10 | Lv 30 | Lv 50 |
|---|---|---|---|
| Tier 1's parties (BT a round) | 3.75 · 3.65 | 3.48 · 3.46 | 3.96 · 4.04 |
| **C8** | 4.06 (+9.9%) | 3.71 (+6.9%) | **4.98 (+24.6%)** |
| C1, crowned | 4.00 | 3.60 | 4.82 |
| C8 without crowns and masteries | 4.06 | 3.71 | 4.27 |
| C8 at ×2.6 attrition, Lv 50 | — | — | 100% won, 0.09 KOs |

- **The crowns and masteries add +17% at Lv 50** (C8 4.98 against 4.27 uncrowned; classes estimated +13%) and lift C1 and
  C8 alike (4.82, 4.98): **Tier 3 deepens every class alike and changes no comp's balance.** Masteries as drafted
  (Juggernaut ×0.6 on unbroken foes, Resonance's 30% echo with no chip, Spellbind +20% when both halves land weak,
  Menagerie two farewells a pair, Overflow 10%); no mastery is the outlier the measure can see.
- **Tier 3's term** prices the crown as a step (T2B36); Tier 3's shields 7 · 9 (T2B7). Tier 3's Rift (T2W4) takes the same rail.

## 6. Provides and assumes

| Doc | This doc provides | This doc assumes |
|---|---|---|
| **[classes](classes.md) (T2C)** | **Amendments for the cross-reference:** T2C34 Momentum +6% a stack (T2B26); T2C35 the Battlemage ×1.3 (T2B27); T2C37 the familiar's hit pierces, hands +0.03 (T2B28); T2C38 hands +0.03 (T2B29); T2C39 and T2C45 the support level's rule and hands (T2B24, T2B25); T2C54 the Scatter twins and the Druid's Axe (T2B25, T2B27); T2C56 party value on the harness (T2B21); T2C64 the band and the stress check (T2B22, T2B23). Confirmed: T2C43, T2C44, T2C55, T2C58. The comps measured (§4.7) | The sixteen's rules as T2C31–T2C64 wrote them; the class lines (T2C52) not measured |
| **[gear](gear.md) (T2G)** | T2B35 answers T2G25 (the Scatter twins); Kindred counted (T2B32); shields 7 · 9 from Lv 1 (T2B7, agreeing with T2G27) | T2G22–T2G28 types, T2G30–T2G36 forms and presets, as measured |
| **[extra stats](extra-stats.md) (T2E)** | The weapon moon's piece dropped from the term (T2B36); the Area and Multi-hit presets measured in every gain | T2E24 rates, T2E29 shapes at step 4b, T2E37 presets |
| **[professions](professions.md) (T2P)** | No balance change moves an item | — |
| **[templates](templates.md) (T2U)** | The ★ tip's check (within 3 points of Power) belongs to the build's run | The template's budget unchanged |
| **[progression](progression.md) (T2W)** | The term in foe generation; the party check line's roles read T2B21's measure; the Rift's rail | Ascend resets; Tier 3's Rift |

## 7. Save and engine

- **No save change from this doc.**
- **One engine stage**, Tier 2's (T2W15's v22): the term and bosses × 1.1 in `rpgFoeTierBudget`; shields 7 · 9 in
  `rpgFoeShields` (both tiers); skill MP × 1.7 · 2.4; and, for classes' stage, **the support level's top-up** (`addStatus`'s cap at the
  skill's stacks for a support's statuses) and **her Brave and Faith on her ward** (`applyStatus` reading her class).
- **The harness:** `balance-t2.test.ts` emulates nothing: it runs the built stage, with this doc's fork as its spec (the
  rules of §4.1, the plan of §4.2–§4.8, the checks of §4.15).

## 8. Pacing

- **Fights in Tier 2 run at Tier 1's pace** with the term (the Tier 2 comps at Lv 50 without it: fights 3.5–3.7, sub-bosses
  4.1–4.4, bosses 6.2–6.8 rounds; Tier 1's 3.9–4.0 · 4.8–4.9 · 7.3–7.8).
- **A support-heavy party is no slower** (C6, C7 within 2 points of C1 on curve) and the safest on long chains: the owner can
  field it without a pacing cost.
- **The simulation's cost:** the whole plan of this round (references, sixteen swaps, nine comps, Tier 3, the stress check
  at four multipliers) is about 900 party-level runs, some 12 minutes on twelve cores at 16 seeds.

## 9. The previews

| Page | What it shows |
|---|---|
| [balance-tiers.html](previews/balance-tiers.html) | Tier 1 → 2 → 3, every system: sources, the re-sized term, weaknesses and shields from Lv 1, MP, the four status levels |
| [balance-sim.html](previews/balance-sim.html) | **The guardrail:** how party value is measured, the sixteen against their parents at classes.md's values and the proposed knobs (Lv 10, 30, 50), the knobs, D and S, Tier 1's anchor |
| [balance-comps.html](previews/balance-comps.html) | **New.** C1–C8 measured next to the analytic ones, every member's value, C3 both ways, Tier 3 |
| [balance-stress.html](previews/balance-stress.html) | **New.** The attrition check: where sustain matters, keeper against battle healer, the supports, a party with no healer, the verdict |
| [balance-calls.html](previews/balance-calls.html) | Every call, round 1's with their round-2 status and round 2's new |

**The old previews** ([tier-rework/previews/](../tier-rework/previews/)): balance-summary, balance-sheets and stats-by-tier
carried into balance-tiers; balance-damage carried into balance-sim (its viability section retired); class-weaknesses and
weaknesses-v2 retired, their by-tier rows in balance-tiers (unchanged from round 1).

## 10. Decisions

Every call, with the recommended answer. Round 1's keep their ids and carry their round-2 status.

| Call | Decision | Status | Recommended | Alternatives, briefly | Why |
|---|---|---|---|---|---|
| **T2B1** | Every source keeps its share | Kept, changed (R2-6–R2-8) | Every flat value ×1.8 and ×2.6, round 2's included (Great, Twofold and Kindred forms, Extra Stats' kind rows); every percentage unscaled, round 2's included (a type's weak multiplier, Insignia riders, Area, Multi-hit, Life steal, MP back, Area guard, Momentum, the status levels); a new source joins §2.2's table before it ships | Per-stat multipliers for HP and MP | Measured within 2.2 points (§2.2); round 2 adds no flat source that escapes ×tier |
| **T2B2** | The yardstick is the engine | Kept | Every Tier 2–3 number on the harness; this round measured the sixteen on a fork of engine v21 (T2B20), the build re-measures on its own stage (`balance-t2.test.ts`) | SB2's analytic model | The analytic comps missed the Sentinel by 30–45 points (§4.4) |
| **T2B3** | A later tier's Class Rank pace | Kept | Ranks 1–10 one shared ladder of 3,600 raising every class she holds; depths at Lv 10 · 16 · 22 · 29 (T2C47) | Each class from Rank 1 | One curve; the harness measured on it |
| **T2B4** | Tier 2's term | Kept, changed (R2-2, R2-6–R2-8) | Re-sized on the measured toolbox (T2B36): foes' HP and DEF × (1.06 + 0.04 (ℓ − 1) ÷ 49), 1.06 → 1.10, offense +10% by Lv 50 | Round 1's 1.08 → 1.28 (priced a focus and a weapon moon that are gone) | The focus left with R2-2 and the weapon moon with T2E27 |
| **T2B5** | Tier 3's term | Kept, changed (R2-2, R2-6–R2-8) | Foes' HP and DEF × 1.10 → 1.12 by Lv 35, rising to 1.26 by Lv 40 (the crowns) and flat after, offense +10% by Lv 50 (T2B36) | Round 1's 1.12 → 1.42 | The same |
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
| **T2B16** | The mirrors | Kept, changed (R2-2) | Mirrored Tier 2 classes within 5 points of gain of each other at every level (§4.9); the Arms and Tome splits 70/30 ± 5 as Tier 1 | Classes v3's ±5% damage bands only | Two contexts (the owner's two parties) move mirrors apart more than a hand does |
| **T2B17** | The healers | Kept, changed (R2-3) | Guardian ÷ Bishop and Templar ÷ Exorcist within ±10% of mends and absorbed Barriers; keeper against battle healer on the stress check (T2B23) | One healer band | Four healer classes now |
| **T2B18** | The simulation's checklist | Kept, changed | Round 1's thirteen checks plus the guardrail's three (T2B22, T2B23, T2B34), §4.15 | — | One list for the build packet |
| **T2B19** | Accessory viability by tier | Kept | D266's rule for every Tier 2–3 form; gear's T2G35 holds it; Kindred counts as party value (T2B32) | SB8's values | Gear owns the forms |
| **T2B20** | How the sixteen were measured | **New** | Their rules on a scratch fork of engine v21 and its Auto, the live harness building every Uma (gear, Extra Stats, Learner, Class Rank pace), Tier 2's MP and healing divisor, gear's Suggested types and forms (T2G26, T2G36) and Extra Stats' Prowess presets (T2E37); 16 seeds, every stage of the level; what's exact and what's approximated in §4.1 | Classes' analytic model; a real engine stage first | Measured now, so the build's packet starts from numbers, not estimates |
| **T2B21** | Party value on the harness (amends T2C56) | **New** | V = D + S: D her damage a round of the fight in BT (an on-curve Brawler's at the same tier, level and kind of fight), S what the other four lose when her statuses, mends, wards and keeper twist are off; a class's **gain** is the party's damage a round with her minus with her parent, over her parent's V; fights weigh 2, sub-bosses and bosses 1; sustain on the stress check (T2B23) | T2C56's formula (a turn, modelled statuses, ε for HP) | A round counts the turns she misses and the kills she takes from others; the counterfactual measures overlap and the cap |
| **T2B22** | The band (amends T2C64) | **New** | On curve at Tier 2 Lv 10, 30 and 50: each of the twelve damage and support classes' gain within ±5 points of the twelve's mean gain at that level; the four healers on the stress check (T2B23) | ±5% of the sixteen's mean (T2C64) | A healer's on-curve gain is damage only and would drag the mean |
| **T2B23** | The stress check: the attrition check | **New** | Each region's elite, its boss's first wave and its boss as one fight (three waves, HP and MP carried, the 10% breather), foes' offense ×2, ×2.6, ×3.2 and ×4, at Tier 2 Lv 30 and 50 and Tier 3 Lv 50, 16 seeds; read wins, KOs, HP left, damage taken and party damage a round, and each healer and support with her sustain off. **Bands:** a keeper healer ahead of her battle healer in wins from ×3.2 and the battle healer ahead on curve; the two within 10% in party damage a round at ×2.6; every support's party safer than her keeper's; a healerless party with supports behind a keeper healer's at ×4 | Under-geared parties; long Rift fights | Attrition is where a mend or a ward pays; the multipliers find where a healer starts to matter (×2.6) and where she decides (×4) |
| **T2B24** | The support level's rule (amends T2C39, T2C45) | **New** | Every skill of her Katana, Bow, Light and Dark trees carries its status at **1 · 1 · 1 · 2 · 2** by depth, **topped up to its stacks, never built past them**; her Brave and Faith land on **the Uma she wards** (her Barrier's target; the Summoners' on the most threatened); her debuffs reach the tapped foe and every foe at depth 5 (the Spellblades'), every foe (the Summoners') | Classes' healers' ladder, built up like any status (the Sentinel +34–50%, §4.4); one stack flat | A pair class casts her lone channel every act, so any build-up pins it at 3; on every Uma, Brave and Faith alone were worth 0.4–0.5 BT |
| **T2B25** | The supports' hands (amends T2C39, T2C54) | **New** | **Sentinel ×0.95, Enchanter ×0.8, Druid ×0.95, Shaman ×1** of her parent's hands; the Druid's preset **Bow, Axe, Dark** (her parent's; the Greatsword cost her the Axe's sweep and the Area branch) | Classes' ×0.85 and ×0.9 with the Greatsword | Each support's every-act status differs (Brave and Faith, Armor Break, Mind Break, Enfeeble), so each takes its own cut |
| **T2B26** | Momentum's step (amends T2C34) | **New** | **6% a stack**, a stack a turn, three at most (+18%) | 5% (+4.3% mean at Lv 50), 7% | Puts both pure keepers at the band's middle at Lv 50 |
| **T2B27** | The cross (amends T2C35, T2C54) | **New** | **Spellfist ×1.05, Battlemage ×1.3**; presets **the Scatter twins** (Spellfist Greatsword, Axe, Thunder; Battlemage Fire, Blizzard, Lance), gear's T2G25 alternative | Both ×1.05 on the Heavy twins (the Battlemage −2 to −11%) | Her Arms meet the higher physical defenses of Tier 2's strikers and guards, and her hand never reaches her Limit Break |
| **T2B28** | The Spellblade keepers (amends T2C37) | **New** | Her familiar's hit on both halves **and it pierces** (skips the unbroken halving); hands **+0.03 a half** (Blademaster 0.75 + 0.47, Runeblade 0.51 + 0.75) | The hands alone (+0.05 for the same value); classes' rule (+0–2%, worth nothing) | Pierce is the Spellblades' own line B, so the twist reads as hers |
| **T2B29** | The Summoner keepers (amends T2C38) | **New** | Both summons linger; hands **+0.03 a half** (Warlord 0.60 + 0.49, Invoker 0.53 + 0.60) | Classes' hands (+0–8%) | The second farewell is worth 1–3% alone |
| **T2B30** | The healer keepers (confirms T2C43) | **New** | One stack more, as classes drafted: worth +0 to +6% on curve (stacks build to 3 anyway), so the keeper is the attrition pick: ahead of her battle healer from ×3.2 (T2B23) | One stack more and a round longer (then the keeper also out-damages her battle healer at Lv 50, +10 to +12%, leaving the battle healer Lv 30 alone) | Each healer must be the better pick somewhere: the battle healer on curve, the keeper under attrition |
| **T2B31** | The battle healers (confirms T2C44) | **New** | ×0.6 power, ×0.7 MP, ×0.7 mends and Barriers: +6 to +16% on curve, behind the keeper from ×3.2 | ×0.75 shares | The trade the owner asked for, measured both ways |
| **T2B32** | Kindred is support value (with T2G34) | **New** | The party measure counts it: the supports' presets wear it from a slot's G5, one Uma's total, the party's largest | Count it apart | It is the supports' slot spent on others |
| **T2B33** | The knob order | **New** | (1) a support's status rule, (2) the supports' hands, (3) Momentum's step, (4) the cross hands, (5) the hybrid keepers' hands, (6) the battle healers' shares then power, (7) the healer keepers' twist; one at a time, re-measured at Lv 10, 30 and 50 | Classes' order (Momentum first) | The supports were the largest error by far |
| **T2B34** | The comps measured (R2-12) | **New** | C1–C8 on the harness at Tier 2 Lv 10, 30, 50 (C8 in Tier 3): every comp +1.7 to +9.3% over its Tier 1 party; table in §4.7 | Classes' analytic comps only | R2-12 asks for them measured |
| **T2B35** | C3's weapons (answers T2G25) | **New** | **The Scatter twins** (T2B27): every kind in two hands in C3, the party as fast or faster (+1.9, +3.2 and −0.9% at Lv 10, 30 and 50); the cost, Thunder missing from 8 of the 64 keeper and expander mixes (the Berserker with the Battlemage and a Spellblade's support), which the party hint names (T2C63) | Classes' Heavy twins (64 of 64 mixes whole; C3 Lance and Blizzard in one hand) | Equal in speed; the Battlemage nearer the band |
| **T2B36** | The toolbox term, re-sized (amends T2B4, T2B5) | **New** | Tier 2: foes' HP and DEF × (1.06 + 0.04 (ℓ − 1) ÷ 49), 1.06 → 1.10; Tier 3: × 1.10 → 1.12 by Lv 35, rising to × 1.26 by Lv 40 (the crowns, Class Rank 50 at Lv 36) and flat after; offense +10% by Lv 50 and bosses × 1.1 kept; provisional until the build's own run | Round 1's provisional terms | Measured: the toolbox speeds fights by Tier 2 ×1.12 · 1.07 · 1.14 at Lv 10 · 30 · 50 (gear and Extra Stats alone ×1.06 · 1.05 · 1.09), Tier 3 ×1.16 · 1.13 · 1.37 |
| **T2B37** | Tier 3 measured | **New** | C8 with the crown and the masteries is 4.98 BT a round at Tier 3 Lv 50, +25% over Tier 1's parties there and +17% over itself uncrowned (C1 crowned 4.82); masteries as classes drafted them (Juggernaut ×0.6, Resonance 30%, Spellbind +20%, Menagerie, Overflow 10%) | Estimates | Tier 3 deepens every class alike |
| **T2B38** | The Duel's rail on the sixteen (amends T2B9) | **New** | The keepers' twists add a chip: the Warlord's and Invoker's second farewell (11 on a lone champion), the Blademaster's and Runeblade's second familiar (10); the Duel's shields at least 14 | Keep 13 | No act may Break a Duel boss |
| **T2B39** | A healerless party (a finding) | **New** | Two supports carry a party with no healer through the attrition check (×2.6 every fight won); with T2B24's ladder a keeper healer's party stays ahead at ×4; the one-healer rule stays a ceiling, not a floor | Forbid a healerless party; supports' sustain off without a healer | The owner's "support a bit" holds where it matters most |
| **T2B40** | The previews | **New** | Five pages: tiers, the guardrail, the comps, the stress check, every call | Three | The review needs the measurements |

### Where the owner may want to look first

| Call | Why it's worth his eye |
|---|---|
| **T2B24** The support level's rule | The biggest finding: as drafted, the Spellblades' supports were worth +18 to +50% (Brave and Faith on every Uma every act, built to three). The fix changes what a support's status is: one or two stacks topped up, Brave and Faith on one Uma. It keeps "a little of the healers' kit" |
| **T2B27, T2B35** The Battlemage ×1.3 and the Scatter twins | Mirrors with different hands, and a preset swap that trades the 64-mix coverage for C3's two hands; both measured, both reversible |
| **T2B23** The stress check | The answer to "become useless": every healer and support is the better pick somewhere, measured; the four bands keep it so |
| **T2B39** A healerless party | Two supports carry a party with no healer through hard attrition; a keeper healer's party stays ahead at the hardest. If he wants healers mandatory, this is the seam |
| **T2B22** The band's two misses | The Sentinel at Lv 10 and 30, recommended to accept and re-read with the class lines |
