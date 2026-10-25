# Tier 2's world and its Rift

> **Proposal, 2026-10-21, for the owner to decide; not built.**
> - **Z3 and Z8 built in H45 (D170),** decided by the main session for the owner so Ascend lands in a playable Tier 2;
>   the other calls wait (Q16). §2's "today" and §5's "today" rows describe the code before it.
> - One of five Tier 2 docs that follow [tiers](tiers.md) Option A (D159): [advanced classes](tier2-classes.md) (H39),
>   [weapon arts and armor sets](weapon-arts.md) (H40), [the outer ring](extra-stats-tier2.md) (H41),
>   [the second profession](second-profession.md) (H42) and this one (H43).
> - It decides Tier 2's continents, foes and their scaling, faces, rewards, the first week after Ascend, and Tier 2's
>   [Rift](rift.md). **It owns the Tier 2 foe budget.**
> - **Owner calls** are marked **Z1**, **Z2** and so on, each with a recommendation. [§16](#16-owner-calls) lists them
>   all.
> - Numbers are drafts for the simulation. The measured ones come from a scratch run of the balance simulation
>   (`world/balance.test.ts`'s party and Auto, engine v13), with Tier 2 members built at lifetime levels. Nothing of it
>   was committed.
> - Continents are named by id only (`w6`–`w10`), never by scenario.

## 1. What the owner asked for

- **A marked separation** (tiers §1): each tier is "a completely different app instance", with its own Stable, Wilds
  and every other place.
- **Depth that grows by tier, not a different battle system** (tiers §1, §6, T6).
- **The world map shows the active tier's five continents,** `w6`–`w10` for Tier 2 (tiers §4).
- **Tier 2's Rift has "harder fronts that test weapon arts and the outer ring"** (tiers §6, Option A's Rift row).
- **The Ascension purse** (T5): each promoted Uma pays the new world 1,000 Laurels and 5 Speed Tickets, so a run of
  twenty pays 20,000 and 100.

Nothing else. This doc decides how those continents, foes, faces, rewards and fronts work.

## 2. Today

**What already works for `w6`–`w10`:**

| Piece | Today | Source |
|---|---|---|
| Ids | `worldContinent` names a continent `w<order>`, so scenario orders 6–10 are `w6`–`w10`. Regions are `w6-1-1` …, stages `w6-1-1-s1` … | `world/world.ts` |
| Levels | `levelStart = 10 × (order − 1) + 1`: `w6` starts at lifetime 51, Tier 2 Lv 1 | `world/world.ts` |
| Layouts | Seeded by id (`w6:layout`), so Tier 2's maps differ from Tier 1's | `world/world.ts` |
| Capitals | Authored Finals exist for orders 1–14. A capital's chapter tier is ⌈order ÷ 5⌉, so it pays Tier 2 Laurels | `rpg/campaign/finals.ts`, `world/capital.ts` |
| Skill reach | `rpgChapterReach` reads the tier level: a `w6` boss is sized for depth 1, as a `w1` boss is | `rpg/campaign/chapters.ts` |
| Uma EXP | `rpgBattleBaseExp` pays a share of her own tier level | `rpg/campaign/rewards.ts` |
| Late Laurels | ×4 from tier Lv 41 | `save/battle.ts` `stageLaurels` |
| The Exchange | Continent n of a tier stocks grades 2n − 1 and 2n, so a `w6` win stocks grades 1–2 | `save/exchange.ts` `stockedGrades` |
| Springs | Five a continent, ids by continent | `world/world.ts` |

**What is still Tier-1-bound:**
- **Leans:** `CONTINENT_LEAN` has five entries, read by (order − 1) mod 5. So `w6`–`w10` repeat Tier 1's leans: Forest,
  Coast, Desert, Tundra, Haunted Moor.
- **Faces:** `bandFranchise` gives orders 6–10 Azur Lane in rows 1–5 and NIKKE in rows 6–10: 100 and 100 regions, and
  no PriConne. `capitalFranchise` gives even orders Azur Lane and odd ones NIKKE: three and two, no PriConne.
- **Region Laurels:** `regionChapter(region, roster, tier = 1)` defaults to Tier 1, and its one caller
  (`apps/web/src/battle/campaign.tsx`) passes no tier. A `w6` region would pay Tier 1's Laurels.
- **Screens:** the web builds continents from `tier === 1` chapters only. A region's title shows `region.level`, a
  lifetime number ("Lv 51–55").
- **MP:** `battleSkillFor` multiplies skill MP by the skill's tier, so a Tier 2 skill costs twice the MP.
- **The simulation:** `balance-party.ts` builds `tier: 1` members only.
- **The foe formulas run on lifetime level:**

| Formula | Where | Lifetime 50 (Tier 1 Lv 50) | 51 (Tier 2 Lv 1) | 100 (Tier 2 Lv 50) |
|---|---|---|---|---|
| `rpgFoeBudget(L, 0.035)`: foe HP and defense | `rpg/campaign/enemies.ts` | 2.72 | 2.79 | 8.00 |
| `rpgFoeBudget(L, 0.01)`: foe offense | `enemies.ts` | 1.49 | 1.51 | 3.00 |
| Regular-foe HP step, `1 + 0.035 × (L − 1)` | `world.ts` `WORLD_TUNING` | 2.72 | 2.75 | 4.47 |
| `rpgReferenceStat(L) = 22 + 1.59 × (L − 1)` | `enemies.ts` | 99.9 | 101.5 | 179.4 |
| Hit share, 0.20 at Lv 1 rising to 0.28 from Lv 10 | `enemies.ts` `rpgFoeHitShare` | 0.28 | 0.28 | 0.28 |
| Elites' leaders and lone bosses act twice from Lv 10 | `world.ts` `WORLD_BOSS_TWICE_FROM` | Yes | Yes | Yes |

So a regular striker has 3,388 HP and DEF 217 at lifetime 50, 3,573 HP and DEF 226 at lifetime 51, and 28,347 HP and
DEF 1,148 at lifetime 100. Tier 2's last regular foe would have 8.4 times Tier 1's HP.

## 3. Five continents (Z1)

**The shape stays D72's and D97's.**
- Forty regions in ten rows of four. Rows 1–5 climb the continent's first five levels, rows 6–10 its last five.
- Twelve stages a region, five Springs a continent, a capital with its three authored Finals routes.
- Every biome twice, the Meadow and the lean a third time. The first region is a Meadow.
- A run's four parties take one region a half each. Later runs fill the regions the first run leaves: five runs of
  twenty use a continent's regions once each.

| Continent | Scenario order | Tier levels | Lifetime | Lean (draft) | The lean's foes |
|---|---|---|---|---|---|
| `w6` | 6 | Lv 1–10 | 51–60 | **Jungle** | Fire+lightning and lightning; swarms and squads |
| `w7` | 7 | Lv 11–20 | 61–70 | **Sky Isles** | Light pairs; trios and pairs of casters |
| `w8` | 8 | Lv 21–30 | 71–80 | **Glacier** | Ice+light and ice; lone elites and pairs of guards |
| `w9` | 9 | Lv 31–40 | 81–90 | **Volcano** | Fire pairs; lone elites and pairs |
| `w10` | 10 | Lv 41–50 | 91–100 | **Underworld** | Every dark pair; swarms and squads |

**Why these five, in this order:**
- None was a Tier 1 lean (Forest, Coast, Desert, Tundra, Haunted Moor), and none is the Twilight Rift (Z10).
- All five lead with a two-element signature (Tier 1's leans: two of five). Tier 2 feels a step on.
- **They meet the toolbox as it opens.**
  - `w6`'s swarms meet the area cores that open at depth 1: the Brawler's Axe, the Mage's Blizzard, and the Summoner's
    farewell strikes.
  - `w8`'s lone elites come after the weapon-art cores open at Weapon Rank 4 (about Tier 2 Lv 16,
    [weapon arts](weapon-arts.md)).
  - `w9`'s lone elites come as the Break forks open at Weapon Rank 8 (about Lv 36).
  - `w10`'s dark pairs and crowds close the tier, as the Haunted Moor closes Tier 1.

**The code:** `CONTINENT_LEAN` gets a row per tier, read by the tier and the order within it. Tier 1's row doesn't change,
so Tier 1's ids and layouts don't move. No save holds a Tier 2 win yet, so `w6`–`w10`'s layouts can change now. They
freeze once Tier 2 ships. Tier 3 (`w11`–`w14`) picks its leans in its own doc and keeps Tier 1's until then, as today.

**Z1, Tier 2's continent leans?** Recommendation: **Jungle, Sky Isles, Glacier, Volcano, Underworld,** in that order.
Five biomes that weren't Tier 1 leans, not the Twilight Rift. The first region stays a Meadow, and the shape doesn't
change.

## 4. Biomes and foes (Z2)

**What stays:** the nineteen biomes, the fifteen signatures, the formations and roles, and one battle system (T6).
Weakness counts stay too: regular foes two weapons plus their elements, elites two, bosses one; light+dark foes answer
to weapons only.

**One tuning change for all of Tier 2: every foe's shield +1.**

| Foe | Tier 1 | Tier 2 |
|---|---|---|
| Lone elite (`solo`) | 6 | 7 |
| Pair · Trio · Squad · Swarm | 4 · 3 · 2 · 1 | 5 · 4 · 3 · 2 |
| Escort captain and guards | 5 and 2 | 6 and 3 |
| Region elite and her two assistants | 6 and 2 | 7 and 3 |
| Region boss and her guards | 8 and 2 | 9 and 3 |
| Capital vanguard and champion | 6 and 8 | 7 and 9 |

**Why:**
- Tier 2 chips more: the Break arts ("Break +1 shield", [weapon arts](weapon-arts.md)), the Spell Blade's three chips an
  act (classes v2 §3.1) and ten skill slots.
- A foe at Tier 1's shields would Break a round sooner, and a Broken foe takes twice the damage. One more point keeps
  Break timing as Tier 1's, and gives the Break arts a job.
- **Measured** on §5's option A, with no Tier 2 tool on: fights take 2–5% longer. A freshly ascended party still clears
  `w6`'s opening stages faster than a fresh Tier 1 party clears `w1`'s (4.9 rounds against 6.8).

**Not here:** new biomes, field effects (H13, archived) or new battle rules.

**Z2, how do Tier 2's foes differ?** Recommendation: **the same biomes and signatures, with every foe's shield +1.**

## 5. Starting difficulty (Z3)

**Who arrives** (tiers §5):
- Tier 2 Lv 1, with lifetime 51's stats;
- Training weapons and armor, no accessories;
- an empty Extra Stats map;
- Class Rank 1, so depth-1 skills only;
- no Bonds, so no inherited Limit Break;
- and 0–2,000 Class Marks from banked EXP (T3): two Manuals take one class from Rank 1 to Rank 10, which opens depth 2.

**What she deals today.** Take a Brawler and a regular striker:

| | Her offense | The foe's DEF and HP | A 100% hit | Share of the foe's HP |
|---|---|---|---|---|
| Fresh Tier 2 Brawler, `w6`'s first stage (lifetime 51) | 116 (Training gear) | 226 · 3,573 | 39 | 1.1% |
| Built Tier 1 Lv 50 Brawler, Tier 1's last stage | 258 (G10, full map) | 217 · 3,388 | 140 | 4.1% |

- **At equal skill power she deals about a quarter** (27%) of what a built Tier 1 Lv 50 Uma deals to her own foes.
- **Her deepest skill is depth 1** (power 1.6, against 4.6 at depth 5). So per cast it's about a tenth.
- **Over whole fights on Auto,** a fresh Tier 2 party removes 1.2% of a stage's foe HP a round at `w6`'s first
  stages. A built Tier 1 Lv 50 party removes 24% of Tier 1's last regular stages. A twentieth.
- **Foes hit harder too:** an offense budget of 1.51 makes a 100% hit take about 42% of a bare Uma's HP. A Tier 1
  Lv 1 hit takes 20%.
- **Measured:** the fresh party wins **none of `w6`'s 40 opening stages** (it falls after about 25 rounds). A fresh
  Tier 1 party wins all 40 of `w1`'s.

**It isn't only the start.** Today's formulas beat an on-curve Tier 2 party at every tier level, because the budget
prices a lifetime-100 build that no gear can reach:

| Tier 2 level, on curve | Regular | Elite | Boss |
|---|---|---|---|
| Lv 5 · 10 · 20 | 0% | 0% | 0% |
| Lv 30 | 5% | 0% | 0% |
| Lv 40 | 28% | 0% | 0% |
| Lv 50 | 10% | 0% | 0% |

### Three options

**A. The budget restarts its build curve at the tier's Lv 1 (recommended).** Her stats keep growing with lifetime level;
the build the foes expect starts over, as hers does.
- `rpgFoeBudget` (both rates) and the regular-foe HP step read her **tier level** ℓ.
- `rpgReferenceStat` stays on lifetime level, because her stats do.
- The hit-share ramp runs over each tier's first ten levels.
- **Elites' leaders and lone bosses act twice from tier Lv 10,** not lifetime 10. Measured: with the lifetime rule,
  `w6`'s Lv 5 elites and bosses leave a Training-gear party with 61–66% of its HP, and an on-curve party taking a
  Lv 1–5 region's twelve stages in a row (MP carried) stops at the elite or the boss. By tier level they leave 86–90%,
  and every such region clears.
- **The build part of the budget scales to her lifetime stats.** Might, armor and Extra Stats points are flat; her
  stats are not. The same G10 kit is 56% of a Tier 1 Lv 50 Brawler's offense and 42% of a Tier 2 Lv 50 Brawler's.
  So: `budget(ℓ, L) = 1 + (rpgFoeBudget(ℓ) − 1) × rpgReferenceStat(ℓ) ÷ rpgReferenceStat(L)`. In Tier 1, ℓ = L, the
  factor is 1 and nothing changes.
  - Without it, an on-curve Tier 2 Lv 50 party takes 54% longer on elites (10.8 rounds against 7.0) and 38% longer on
    bosses (13.7 against 9.9) than a Tier 1 Lv 50 party, before any Tier 2 tool.
  - With it, every matched tier level plays within 10% of Tier 1's rounds (below).
  - The other way would be gear that grows by tier (Might and points ×2 in Tier 2). It keeps gear's share as Tier 1's,
    but it's a gear change outside this doc, and Tier 2's first weeks would wait on Craft Level again.

| | Tier 2 Lv 1 | Lv 10 | Lv 25 | Lv 40 | Lv 50 |
|---|---|---|---|---|---|
| HP and defense budget, today (lifetime) | 2.79 | 3.49 | 4.91 | 6.66 | 8.00 |
| … restarted, Tier 1's curve | 1.00 | 1.06 | 1.41 | 2.09 | 2.72 |
| … restarted and scaled (option A) | 1.00 | 1.02 | 1.18 | 1.56 | 1.96 |
| Offense budget, today | 1.51 | 1.71 | 2.12 | 2.62 | 3.00 |
| … option A | 1.00 | 1.01 | 1.05 | 1.16 | 1.27 |
| Regular-foe HP step, today · option A | 2.75 · 1.00 | 3.07 · 1.32 | 3.59 · 1.84 | 4.12 · 2.37 | 4.47 · 2.72 |
| Hit share, today · option A | 0.28 · 0.20 | 0.28 · 0.28 | 0.28 · 0.28 | 0.28 · 0.28 | 0.28 · 0.28 |

**Measured with option A** (rounds a fight on Auto; every party wins every stage):

| | Regular | Elite | Boss |
|---|---|---|---|
| Fresh Tier 1 party, `w1`'s opening stages | 6.8 | — | — |
| **Fresh Tier 2 party, `w6`'s opening stages** | **4.7** (all 40 won, 100% HP left) | — | — |
| Tier 1 on curve, Lv 10 · 25 · 40 · 50 | 4.8 · 4.5 · 4.0 · 5.0 | 5.5 · 5.2 · 4.5 · 7.0 | 8.8 · 8.6 · 7.8 · 9.9 |
| Tier 2 on curve, Lv 10 · 25 · 40 · 50 | 5.0 · 4.4 · 3.6 · 4.7 | 5.5 · 5.5 · 4.1 · 7.0 | 8.9 · 8.8 · 7.6 · 9.5 |

**B. An onboarding ramp on `w6` only.** For example, `w6`'s budget climbs from 1.0 at its Lv 1 to today's 3.49 at its
Lv 10. It moves the cliff to `w7`: `w7`'s first foes would still stand on a lifetime-61 budget (3.57) against G2–G3 gear,
and the table above shows on-curve parties losing at every later level.

**C. A larger Ascension purse.** It can't buy a build.
- The Exchange stocks only after wins: `w6` stocks grades 1–2.
- Grades open with Craft Level from Lv 1: G10 at Craft Lv 46, about three and a half weeks of an Uma's nonstop work
  (§11).
- Even a full G10 kit loses today: the Lv 50 row above.
- Draft numbers, for the record: 100,000 Laurels a run would buy raw items, not grades.

**Z3, how does Tier 2's budget meet a freshly ascended party?** Recommendation: **option A.** The budget restarts its
build curve at the tier's Lv 1 (tier level), with its build part scaled to her lifetime stats, the hit-share ramp per
tier and bosses acting twice from tier Lv 10. Stats stay on lifetime level. Not a `w6` ramp, and not a bigger purse:
T5 stays as approved.

## 6. Scaling through Tier 2 (Z4)

**The build this doc prices.** An on-curve Tier 2 Lv 50 Uma has G10 gear, the full inner map (30 active nodes), one
full ring specialty, weapon arts and a set bonus at their top, and an advanced class. Her lifetime stats are already in
the foes' reference stat, and option A prices her gear and map. The Tier 2 tools are new power, so they get one term.

**The draft term,** on option A's restarted curve:
- HP and defense: `budget₂(ℓ) = budget(ℓ, L) × (1 + 0.15 × (ℓ − 1) ÷ 49)`;
- offense, likewise with its own rate: `× (1 + 0.10 × (ℓ − 1) ÷ 49)`. The offense part prices sustain: set bonuses and
  the healers' passives.

**What each tool is worth,** from the sibling docs or their packets' targets:

| Tool | Source | Worth at Tier 2 Lv 50 | Opens |
|---|---|---|---|
| One ring specialty (the Halo) | [Extra Stats in Tier 2](extra-stats-tier2.md) | Flat, recommended: +15% on her kind's hits, +5–9% over a whole fight. Percent: +20%, +6–12% | Grade-5 gem at Craft Lv 21, grade 10 at 46 |
| Weapon arts | [weapon arts](weapon-arts.md) | About +6–10% of a party's damage an act (a core +5–10% of its weapon's value); a B side one more shield point an act | Weapon Rank 4 (about Lv 16) and 8 (about Lv 36), with a Lore Scroll a node |
| Armor set bonuses | weapon arts (E8) | Sustain: max HP +4/7/10% (physical suit), skill MP −5/10/15% (magical) | The suit's lowest grade 4, 7, 10, with a Lore Seal a step |
| Advanced class passive | [advanced classes](tier2-classes.md) | +8–15% of her class's value where it applies (the Warlord hits a Broken boss 20% harder, the Templar's party Barriers are 25% larger), at most +5% elsewhere | Tier 2 Lv 1 |
| Hero LB+ | advanced classes (A7) | +15–25% of a Limit Break | Bond 10, about Lv 23 |
| Side forks and ten skill slots | tiers §6 | Choice more than power | Class Rank 5 … 45 |

**All together:** about +20–30% damage by Tier 2 Lv 50, and about +10% sustain. They open across the tier, so a
straight line in ℓ is a fair draft.

**Measured:** emulating +25% damage by Tier 2 Lv 50, the +15% and +10% term brings Tier 2's rounds back to Tier 1's:

| On curve, rounds a fight | Regular | Elite | Boss |
|---|---|---|---|
| Tier 1 Lv 25 · Lv 50 | 4.5 · 5.0 | 5.2 · 7.0 | 8.6 · 9.9 |
| Tier 2 Lv 25 · Lv 50, tools emulated, with the term | 4.3 · 4.5 | 5.2 · 6.8 | 8.8 · 9.3 |

**The values:**

| | Tier 2 Lv 1 | Lv 25 | Lv 50 | Tier 1 at the same level |
|---|---|---|---|---|
| The term (HP and defense · offense) | 1.00 · 1.00 | 1.07 · 1.05 | 1.15 · 1.10 | — |
| `budget₂`, HP and defense | 1.00 | 1.26 | 2.25 | 1.00 · 1.41 · 2.72 |
| `budget₂`, offense | 1.00 | 1.10 | 1.40 | 1.00 · 1.12 · 1.49 |
| A regular striker's HP · DEF | 466 · 81 | 1,457 · 141 | 4,844 · 323 | Lv 50: 3,388 · 217 |
| Today, for comparison | 3,573 · 226 | 11,048 · 549 | 28,347 · 1,148 | — |

- The ring doc's worked example assumed DEF 448 at Tier 2 Lv 50 (the restart without option A's scaling). At DEF 323
  its flat pair is still worth +15% on her kind's hits (181 → 208).
- The simulation sets both rates once H39–H42's numbers are approved and built.

**Z4, how is Tier 2's bigger toolbox priced?** Recommendation: **one Tier 2 term on the restarted curve,** +15% HP and
defense and +10% offense by Tier 2 Lv 50 (drafts), from H39–H41's numbers.

> *Superseded by [stat-balance](tier-rework/stat-balance.md#36-the-proposed-terms) SB3/SB4 (D196, 2026-10-25): Tier 2's
> term on HP and defense +27% by Lv 50 (offense +10% kept), a Tier 3 term ×1.08 → ×1.48, bosses' term × 1.1 (SB5).*

## 7. Skill MP in Tier 2 (Z5)

**Today:** `battleSkillFor` multiplies a skill's MP by its tier, ×2 in Tier 2. Her MP is `(20 + 1.5 × Wit) × her
class's MP lean`, and Wit grows with lifetime level. Leg armor adds 2 MP a grade.

**An average Uma** (base 110, Wit growth 0, MP lean 1, a hand of ×1), her deepest skill on a full bar:

| | MP, bare · on curve | Deepest skill | Its cost at ×2 | Casts at ×2 | At ×1.7 (A10) | At ×1 |
|---|---|---|---|---|---|---|
| Tier 1 Lv 1 | 53 · 55 | Depth 1 | 10 (×1) | 5.3 · 5.5 | — | — |
| Tier 1 Lv 25 | 107 · 117 | Depth 3 | 18 (×1) | 5.9 · 6.5 | — | — |
| Tier 1 Lv 40 | 142 · 158 | Depth 5 | 26 (×1) | 5.5 · 6.1 | — | — |
| **Tier 1 Lv 50** | **164 · 184** | Depth 5 | 26 (×1) | **6.3 · 7.1** | — | — |
| Tier 2 Lv 1 | 166 · 168 | Depth 1 | 20 | 8.3 · 8.4 | 9.8 · 9.9 | 16.6 · 16.8 |
| Tier 2 Lv 25 | 220 · 230 | Depth 3 | 36 | 6.1 · 6.4 | 7.1 · 7.4 | 12.2 · 12.8 |
| Tier 2 Lv 40 | 254 · 270 | Depth 5 | 52 | 4.9 · 5.2 | 5.8 · 6.1 | 9.8 · 10.4 |
| **Tier 2 Lv 50** | **277 · 297** | Depth 5 | 52 | **5.3 · 5.7** | **6.3 · 6.8** | 10.7 · 11.4 |

- **Without a factor (×1),** Tier 2 Lv 50 casts 10.7–11.4 deep skills a bar, against Tier 1's 6.3–7.1: MP stops
  mattering.
- **At ×2,** bare she casts one fewer than Tier 1 Lv 50 (5.3 against 6.3). **On curve, 1.4 fewer** (5.7 against 7.1):
  outside the [advanced classes](tier2-classes.md) target, "within one skill". On the bare bar ×2 just passes; with
  on-curve gear it fails.
- **Why it drifts:** her MP grows 1.7 times across Tier 2 (166 → 277), while her deepest skill's cost grows 2.6 times
  (depth 1 to 5). In Tier 1 her MP grows 3.1 times. Any flat factor leaves early Tier 2 rich in MP and late Tier 2
  tighter.
- **At ×1.7,** [advanced classes](tier2-classes.md)' A10 (`1 + 0.7 × (tier − 1)`, the bar's own growth): Tier 2
  Lv 50 casts 6.3 bare and 6.8 on curve, against Tier 1's 6.3 and 7.1. Lv 40 is level with Tier 1 (6.1 on curve);
  Lv 25 casts about one more. Costs round to whole MP: 17, 24, 31, 37, 44 by depth. **This doc's numbers agree with
  A10's.**
- **Flat MP sources buy fewer casts** when skills cost more: leg armor's +2 a grade and the Spring Amulet's +1 MP a
  round a grade. The magical suit's set bonus (−15% skill MP at its top step) gives some back, for magical suits only.

**MP carried and Springs.** A region's twelve stages carry MP, and its road starts at its band's Spring (five a
continent, two hours to recharge). Measured on Auto, four regions at each level, no Spring:
- Through Lv 35, Tier 2 parties end a region with 3–7% of their MP at any factor from ×1.5 to ×2. Tier 1's end with
  4–10%.
- At Lv 40, Tier 2 keeps 7–9% against Tier 1's 26%: the flat MP above, worth less.
- At Lv 45–50, both keep 26–31%.
- Auto spends greedily, so the factor changes how many deep casts a bar holds, not whether a region clears: stages
  cleared in a row matched within noise (10–12 of 12) at every factor from ×1.5 to ×2.
- **So a Tier 2 party uses its Spring about once a region, as a Tier 1 party does.** Springs stay as they are.

**Z5, skill MP × tier?** Recommendation: **replace ×2 with A10's ×1.7** ([advanced classes](tier2-classes.md) §6.3).
On curve it keeps Tier 2 Lv 50 within one deep skill of Tier 1 Lv 50 (6.8 against 7.1), which ×2 misses (5.7). Z5 and
A10 are one call: deciding either decides both.

## 8. Levels on screen (Z6)

- **Region, stage and capital levels show tier levels, Lv 1–50,** as Umas do ("Tier 2 · Lv 12", `rpgTierLevel`).
  A `w6` region reads "Jungle · Lv 1–5", not "Lv 51–55". The continent list reads "Lv 1–10", and a capital's Finals
  "Lv 10".
- **Foes stay on lifetime level inside the rules:** `RpgMapNode.level`, `BattleEnemy.level`, the frozen fight input,
  and the EXP level gap (`rpgLevelExpFactor`, which compares two lifetime levels). Saves and replays don't change.
- Only labels change: `regionChapter`'s title, the capital's camp, the rival sheet's level chip and the continent list.

**Z6, which levels show on screen?** Recommendation: **tier levels, Lv 1–50,** as Umas show them.

## 9. Faces (Z7)

**Every pack leads somewhere in Tier 2,** with Tier 1's totals (PriConne 40, Azur Lane 100, NIKKE 60 regions) and its
capital counts (one, two, two), arranged unlike Tier 1:

| Continent | Rows 1–5 | Rows 6–10 | Capital |
|---|---|---|---|
| `w6` (Lv 1–10) | NIKKE | NIKKE | Azur Lane |
| `w7` (Lv 11–20) | Azur Lane | PriConne | NIKKE |
| `w8` (Lv 21–30) | Azur Lane | NIKKE | PriConne |
| `w9` (Lv 31–40) | PriConne | Azur Lane | NIKKE |
| `w10` (Lv 41–50) | Azur Lane | Azur Lane | Azur Lane |

| Pack | Regions | Capitals |
|---|---|---|
| PriConne | 40 | 1 |
| Azur Lane | 100 | 2 |
| NIKKE | 60 | 2 |

- **NIKKE opens Tier 2,** as PriConne opens Tier 1. PriConne, the smallest pack, comes back mid-tier twice.
- **Azur Lane,** the largest pack, still holds the most regions and closes the tier.

**The code:** `bandFranchise(order, row)` and `capitalFranchise(order)` take the tier from the order (⌈order ÷ 5⌉) and
read a table per tier. Tier 1's table is today's rule, so its faces and the manual's faces table don't move. Tier 3 keeps
today's Azur Lane–NIKKE beat until its own doc. `stageFaces` doesn't change: it hashes by stage id, and Tier 2's ids are
new, so its faces differ from Tier 1's.

**Across tiers:** the packs are shared, so faces repeat between tiers. The Rift's picker prefers faces the account
hasn't defeated, and the Bestiary counts every run and tier (rift §7, §9).

**Z7, which packs lead each Tier 2 continent?** Recommendation: **the table above:** Tier 1's totals, arranged
differently.

## 10. Rewards, Springs and Sweeps (Z8)

**As coded:**

| Payout | Tier 1 | Tier 2 |
|---|---|---|
| Laurels a win: regular, elite, vanguard, boss (× tier) | 10, 25, 30, 50 | 20, 50, 60, 100 |
| A stage's first clear | ×3 | ×3 |
| Tier Lv 41–50 stages | ×4 | ×4 |
| Stages in waves | ×1.5 | ×1.5 |
| Replays and Sweeps | A quarter | A quarter |
| Uma EXP | A share of her tier level: about 120 first clears from Lv 1 to 50 | The same |
| Class, weapon and armor EXP | 2E, 5E and E a piece | The same |
| Uma Shards | At Lv 10, 20, 30, 40, 50 | None (D5) |

- **A region's first clear pays 1,260 Laurels** in Tier 2 (630 in Tier 1), and 5,040 at Lv 41–50.
- **A party from Lv 1 to 50 earns about 17,800** (the [pacing ledger](pacing.md#simulated)'s 8,888, doubled). Four
  parties, about 71,000.
- **Exchange prices stay,** so a Tier 2 Laurel buys twice as much. A twenty-Uma workforce buys what it can't gather:
  a Lv 41–50 first clear (240 Laurels) buys two grade-10 raw items. The second profession's raw items follow the same
  rule ([second profession](second-profession.md), V7).
- **Springs** (five a continent, two hours) and **Sweeps** don't change.

**One fix:** `regionChapter` takes its tier from the continent's order. Today a `w6` region would pay Tier 1's Laurels.

**Z8, rewards, Springs and Sweeps?** Recommendation: **as coded:** Laurels ×2 with prices unchanged, Springs and Sweeps
unchanged, no Uma Shards. Plus the one fix.

## 11. A run's first week

**Twenty Umas ascend together** (R7). The new world starts with:
- the purse: 20,000 Laurels and 100 Speed Tickets (T5);
- 0–2,000 Class Marks each, from banked EXP (T3);
- an Exchange that stocks nothing until the first `w6` win;
- Craft Lv 1 and Lore Lv 1 for all twenty ([second profession](second-profession.md));
- fourteen facilities at level 1: the Wilds' eleven and the second profession's three, 42 slots for twenty workers.

**Slots in total don't bind, but the Forge's and the Lapidary's do.** A run's gear is 2,400 pieces (twenty Umas × twelve
tracks × ten grades, each grade bound in order, D119), and its gems 2,040 cuts (the full map and one specialty each).
At about 1½ hours a make, that's about 3,600 Forge hours and 3,100 Lapidary hours:
- 50 and 43 days on three slots;
- 24 and 20 days at level 3 (five slots, ×1.25).

So the first upgrades are the Forge and the Lapidary: level 2 on day 3, when refined grade-2 Stones and Woods open,
and level 3 from day 11 (refined grade 5). Elsewhere, upgrades buy level 3's speed, not slots.

**Assumptions:** every Uma works around the clock (jobs queued morning and night); the owner fights about 40 minutes
a day on Auto, two bands of ten levels (one on day 0); foes on option A (§5). Raw items bought for a party's kit: 120
a grade.

| Day | Craft Lv (all) | Grades open | The Forge makes | Parties at the day's end | Laurels |
|---|---|---|---|---|---|
| 0 | 1 | G1 | G1 for party A (three slots, about 40 pieces a day) | A: `w6` crossed, Lv 10, on Training gear. The Exchange stocks grades 1–2 | +20,000 purse, +2,500 fights, −2,400 raw G1 for A: **20,100** |
| 1 | 2 | G1 | A's G1 done; B's under way | A: Lv 20 (`w7`). B: Lv 10 | +5,000, −2,400 for B: **22,700** |
| 2 | 4 | G1 | B's G1 done; C's under way | B: Lv 20. C: Lv 10 | +5,000, −2,400 for C: **25,300** |
| 3 | 6 | G1–2 | The Forge, Lapidary and Workbench go to level 2 (four slots, about 55 a day) | C: Lv 20. D: Lv 10 | +5,000, −450 upgrades, −2,400 for D: **27,450** |
| 5 | 10 | G1–2 | D's G1 done; A's G2 under way | A, B, C: Lv 30 (`w8`). D: Lv 20 | +10,000, −7,200 raw G2 for A and B: **30,250** |
| 7 | 14 | G1–3 | A's and B's G2 done; C's under way | A, B, C: Lv 40 (`w9`). D: Lv 30 | +10,000, −7,200 for C and D: **33,050** |

**What the week shows:**
- **The ledger reaches `w6`'s second half on day 0,** and all four parties cross `w6` by day 3 and `w7` by day 4.
- **Gear isn't the wall in week one.** With option A, a Tier 2 party on Training gear clears `w6`–`w8` on Auto (95% of
  Lv 30 bosses): its lifetime stats are most of its power there. At Lv 40 Training gear wins 65% of bosses, and G3
  wins all.
- **The wall comes at Lv 41–50.** Measured: on G3 gear, a Tier 2 Lv 50 party wins 15% of its bosses; on G5, 90%. G5
  opens at Craft Lv 21 (day 11), G8 at Lv 36 (about day 19), G10 at Lv 46 (about day 24, with level-3 facilities from
  day 11).
- **So Tier 2's long loop is Craft, the Forge and the toolbox, not Uma levels,** as Tier 1's is the collection. A run
  of twenty is on curve at Lv 50 in about four weeks: the Forge makes about 550 pieces in the first eleven days, and the
  other 1,850 in about eighteen more at level 3.
- **Laurels never run short.** Fights pay twice Tier 1's, and the purse covers the first raw items and upgrades with
  room to spare. **T5's numbers stand.**
- **Class Marks change little:** two Manuals open depth 2 about eleven wins sooner.

## 12. The Tier 2 Rift (Z9)

**Its shape is rift.md's:** four fronts of twelve stages, the ward on Iron and Arcane, the Convergence's four fights,
and Echoes at tier Lv 45, 50 and 55. Its foes stand at Tier 2 Lv 50 on Z4's budget (`budget₂(50)`), then climb by
stage to +10% at the champion, and +10% again in the Convergence (rift §5). Like every Tier 2 foe, they carry shield +1
(Z2).

**One added test per front,** each aimed at a Tier 2 tool:

| Front | Tier 1's | Tier 2's added test | It tests |
|---|---|---|---|
| **Iron** | Weak to 1–3 Arms kinds; elements ×0.5 | **Shields +2 over Tier 1's** (Z2's +1 and one more); weak to 1–2 Arms kinds | Break arts, an Arms specialty |
| **Arcane** | Weak to 1–2 elements; Arms ×0.5 | **One element a foe:** each stage's leaders are weak to one element and its guards to another | An element specialty (the Halo and the Orb) on the leaders, area arts on the guards, the Sage's rotation between the two |
| **Duel** | One boss, acting twice, three times at the champion; shield 10–12 | **She acts three times from stage 9** | Single-target burst, advanced class passives |
| **Horde** | 4–6 foes a wave, three waves | **5–7 foes a wave** | Area cores, the Summoner line's areas |

- **Why Arcane splits its weakness:** one element for a whole stage would reward the specialty alone and punish the
  Sage, whose passive pays for a new element each cast. Two, split between leaders and guards, asks for both.
- **The Duel's shield** is Tier 1's as v15's simulation sets it, above the best single act
  ([weapon arts](weapon-arts.md) §6, flag 1; classes v2 §3.1's guard rail), plus Z2's one. Rift §5 drafts 10–12, so
  11–13 in Tier 2 until the simulation moves it.

**What weapon arts asks of these fronts** ([weapon arts](weapon-arts.md) §8), and how they meet it:

| Requirement | How Tier 2's fronts meet it |
|---|---|
| The fork pick matters stage by stage | Rift §5's stage mix stays: escorts and guards (stages 1–11) where A sides spread damage, lone bosses and the champion where B Breaks first. The Duel leans B; from stage 9, where she acts three times, A's Break-window damage decides |
| Duel shields above the best single act plus E6's one | The Duel's shield above, set by v15's simulation and carried over with Z2's +1 |
| Horde weaknesses spread | Each foe keeps its own Arms and element pair (rift §5), and no two foes of a wave share one: 25 pairs for at most 7 foes |
| Charged moves keep locks from the front's weakness kinds | Unchanged (rift §5) |
| Wards stay | Unchanged: no art or added test changes a hit's channel |
| Echoes pay Weapon Rank at 2× | Unchanged (rift §8): a re-specced Uma reaches the fork's rank 8 in about 15 Echo wins |

**The party shapes** keep the Rift's four. Each front has an advanced class that serves it best
([advanced classes](tier2-classes.md) §5), and the base's home front stays good for both of a pair:

| Front | Party | Best advanced classes |
|---|---|---|
| Iron | 2 Brawler line, 2 Spell Blade line, a Paladin line | Berserker, Blademaster |
| Arcane | 2 Mage line, 2 Summoner line, a Cleric line | Sage, Warlock |
| Duel | 2 Brawler line, 2 Mage line, a healer | Warlord, Sorcerer, Guardian or Oracle |
| Horde | 2 Spell Blade line, 2 Summoner line, a healer | Rune Knight, Conjurer, Templar or Bishop |

**Also:**
- **Faces:** the same cross-pack picker (rift §9): Azur Lane and NIKKE lead, PriConne supports, and faces this account
  hasn't defeated come first. The Bestiary counts every tier, so a Tier 2 run meets the faces Tier 1's runs missed.
- **Achievements:** Tier 2's four seals and "Rift conquered" are its own (their ids carry the tier), since a run's
  seals belong to it (R9). The optional titles are earned once per account, in any tier.
- **After it:** ascending from Tier 2 lands in a partial Tier 3 (T9, Q8). Tier 3 opens the four continents it has,
  `w11`–`w14`, and its Rift waits for its fifth scenario. Until then, nobody leaves Tier 3. Its purse is T5's.

**Z9, the Tier 2 Rift's harder fronts?** Recommendation: **one added test per front,** as the first table above.

## 13. Names (Z10)

The Twilight Rift biome (id `rift`) shares a word with the Rift event. Tier 2's world shows both: two "Twilight Rift"
regions on every continent's map, and "the Tier 2 Rift" on the Battle page.

| Option | Region names | Feel |
|---|---|---|
| **Twilight Vale** (recommended) | Twilight Vale, Twilight Vale II | Keeps the word the owner knows; fits Tier 2's dusk tint |
| Eclipse Wastes | Eclipse Wastes II | Ties to the biome's planned Eclipse field effect |
| Starfall Hollow | Starfall Hollow II | Its star specks and floating rocks |

- **Only the display name changes,** in every tier. The id `rift`, its colour and its map art stay.
- Region names are generated from the biome, and region ids hold no biome, so no save changes.

**Z10, the Twilight Rift biome's name?** Recommendation: **rename its display name to Twilight Vale; keep the id
`rift`.**

## 14. What it needs

| Piece | Where | Size |
|---|---|---|
| Leans by tier: a Tier 2 row of five; Tier 1's unchanged | `world/world.ts` (`CONTINENT_LEAN`, `worldContinent`) | S |
| Faces by tier: `bandFranchise` and `capitalFranchise` read a table per tier; the manual's faces table per tier | `world/roster.ts`, `docs/render.ts` | S |
| A region's tier from its continent's order, so Laurels ×2 | `world/world.ts` (`regionChapter`), `apps/web/src/battle/campaign.tsx` | S |
| Foe formulas on tier level: both budgets and the regular-foe HP step, the build part scaled to her stats, the hit-share ramp per tier, bosses twice from tier Lv 10 | `rpg/campaign/enemies.ts`, `world/world.ts` | M |
| The Tier 2 term (Z4) | `RPG_FOE_TUNING` | S |
| Shields +1 in Tier 2 worlds | `world/world.ts` (`stageWaves`), `world/capital.ts` | S |
| The MP factor (Z5), in engine v16 with H39's and H40's changes. No Tier 2 fight exists before it, so nothing replays differently | `rpg/battle/skills.ts` (`battleSkillFor`) | S |
| Screens: tier levels on regions, stages, capitals and the continent list; the world map builds the active tier's continents (after H35) | `apps/web/src/battle/` | S–M |
| The Tier 2 Rift: each front's added test, at Tier 2 Lv 50 on Z4's budget | `packages/domain/src/rift/`, with the Rift generator | M |
| Twilight Vale | `world/biomes.ts` | S |
| The simulation: `balanceMember` builds Tier 2 Umas (tier, lifetime stats, Training or on-curve gear, the toolbox once built); tables by matched tier level; the fresh-party check; the first week's reach | `world/balance-party.ts`, `world/balance.test.ts` | M |
| The manual: maps (leans, faces, levels), loops (Laurels × tier), combat (Tier 2 shields and MP); `pnpm docs:update` | `docs/game/` | S |
| Art | None. The maps compose from tiles ([map art](world/map-art.md)), and T2's dusk tint colours them | — |

Foe stats are frozen into each fight's input, so the formula changes never touch a stored fight.

## 15. Balance targets

Drafts for `SIM=1`:

| Target | Value |
|---|---|
| A freshly ascended party (Training gear, empty map, Class Rank 1) | Wins `w6`'s first regions about as often as a fresh Tier 1 party wins `w1`'s. Measured with option A: all 40 opening stages, as Tier 1 |
| On-curve Tier 2 win rates | Within 3 points of Tier 1's at matched tier levels ([advanced classes](tier2-classes.md), [weapon arts](weapon-arts.md)) |
| **Pace**, since Auto wins every on-curve stage | Rounds a fight within ±10% of Tier 1's at matched tier levels, for regular, elite and boss stages. Measured: within 10%, with the tools emulated |
| Tier 2 Lv 50 MP | Within one deep skill of Tier 1 Lv 50's on a full bar ([advanced classes](tier2-classes.md)) |
| The Tier 2 Rift, on-curve Tier 2 parties | Rift §11's: the right party ≥ 80% a stage and 60–70% a champion; the wrong one ≤ 30% and ≤ 10%; the Convergence about 50% |
| The Duel and the Horde | Weapon arts' targets: two rounds at least to Break the Duel's boss; no single Uma Breaks a Horde wave |
| The first week | The ledger reaches `w6`'s second half. Measured: on day 0 |

## 16. Owner calls

| Call | Question | Recommendation |
|---|---|---|
| **Z1** | Tier 2's continent leans | Jungle, Sky Isles, Glacier, Volcano, Underworld for `w6`–`w10`: five biomes that weren't Tier 1 leans, not the Twilight Rift. The first region stays a Meadow; the shape doesn't change |
| **Z2** | How Tier 2's foes differ | The same biomes and signatures; every foe's shield +1 |
| **Z3** | Starting difficulty: how Tier 2's budget meets a freshly ascended party | The budget restarts its build curve at the tier's Lv 1 (tier level), its build part scaled to her lifetime stats; the hit-share ramp per tier; bosses twice from tier Lv 10. Stats stay on lifetime level. Not a `w6` ramp, not a bigger purse |
| **Z4** | Pricing Tier 2's bigger toolbox | One Tier 2 term on the restarted curve: +15% HP and defense, +10% offense by Tier 2 Lv 50 (drafts), from H39–H41's numbers |
| **Z5** | Skill MP × tier | Not ×2: A10's ×1.7 (`1 + 0.7 × (tier − 1)`). On curve, Tier 2 Lv 50 then casts 6.8 deep skills a bar against Tier 1 Lv 50's 7.1; ×2 leaves 5.7. One call with A10 |
| **Z6** | Levels on screen | Tier levels, Lv 1–50, as Umas show them; foes stay on lifetime level inside the rules |
| **Z7** | Which packs lead each Tier 2 continent | The table in §9: Tier 1's totals, arranged differently |
| **Z8** | Rewards, Springs and Sweeps | As coded: Laurels ×2, prices unchanged; Springs and Sweeps unchanged; no Uma Shards. Fix `regionChapter`'s tier |
| **Z9** | The Tier 2 Rift's harder fronts | One added test per front, as §12's first table: Iron shields +2 and 1–2 Arms weaknesses; Arcane one element a foe, leaders and guards apart; the Duel's boss acting three times from stage 9; the Horde 5–7 foes a wave |
| **Z10** | The Twilight Rift biome's name | Rename its display name to Twilight Vale; keep the id `rift` |
