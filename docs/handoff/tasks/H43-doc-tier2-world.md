# H43 — Doc: Tier 2's world and its Rift

**uma-rpg · Claude · M · Needs: nothing · Unblocks: Tier 2 content (built after the doc is approved)**

## Why

D159 makes each tier its own world: Tier 2 shows its own five continents, ids `w6`–`w10` ([tiers](../../design/tiers.md)
§4), and its Rift has "harder fronts that test weapon arts and the outer ring" (§6). The world generator would already
draw `w6`–`w10`, but with Tier 1's leans, a franchise split that drops PriConne, and foe formulas that run on
lifetime level and so size Tier 2's first fight for a full Tier 1 Lv 50 build. Nobody has decided Tier 2's world:
its continents, foes and scaling, faces, rewards, the first week after Ascend, and its Rift. This packet asks for that
design doc. It doesn't build anything.

## Context (read first)

- **House rules:** `CLAUDE.md`, `AGENTS.md`. Original-game content never goes in git: **name continents by id**
  (`w6`–`w10`, master data's scenarios 6–10), never by a scenario's name.
- **The approved designs:**
  - [tiers.md](../../design/tiers.md): §3 (one Uma, one world), §4 (the world map shows the active tier's continents,
    `w6`–`w10` for Tier 2), §5 (promotion: Lv 1 with lifetime stats, Training gear, an empty Extra Stats map; T3
    banked EXP to Class Marks; T5 the Ascension purse, 1,000 Laurels and 5 Speed Tickets per Uma), §6 (Option A, the
    Rift row), §7 (Tier 3 and Q8, context only).
  - [rift.md](../../design/rift.md): §4 (a run), §5 (the four fronts, ward, stages, levels, locks), §6 (the
    Convergence), §8 (Echoes at Lv 45, 50, 55), §9 (the cross-franchise picker that prefers faces not yet defeated),
    §11 (targets).
  - [classes-v2.md](../../design/classes-v2.md) §3 (the four party shapes the fronts ask for) and §9.
  - D2, D3, D5, D15, D72, D97, D135, D141, D159, D160, D161 in [decisions.md](../../decisions.md).
- **The manual and world design:** [maps.md](../../game/maps.md) (shape, biomes, faces, formations, continents),
  [loops.md](../../game/loops.md) (Laurels, the Exchange, Springs, Sweeps),
  [world/README.md](../../design/world/README.md), [world/regions.md](../../design/world/regions.md),
  [world/encounters.md](../../design/world/encounters.md), [world/themes.md](../../design/world/themes.md),
  [enemy-roster.md](../../design/enemy-roster.md), [pacing.md](../../design/pacing.md),
  [combat-balance.md](../../design/combat-balance.md) §0 (Tier 1's on-curve win rates).
- **The code** (`packages/domain/src/`):
  - `world/world.ts`: `worldContinent` (ids `w<order>`, `levelStart = 10 × (order − 1) + 1`, so `w6` starts at
    lifetime 51; `CONTINENT_LEAN` has five entries read by `(order − 1) % 5`, so `w6`–`w10` repeat Tier 1's leans),
    `WORLD_TUNING.regularHpPerLevel` (`tough = 1 + 0.035 × (level − 1)` on lifetime level), `WORLD_BOSS_TWICE_FROM`,
    `regionChapter` (its title shows `region.level`, a lifetime number), `stageWaves`;
  - `world/roster.ts`: `bandFranchise` (orders 6–10 fall into "Azur Lane rows 1–5, NIKKE rows 6–10": 100 and 100
    regions, **no PriConne**), `capitalFranchise` (even orders Azur Lane, odd NIKKE);
  - `world/capital.ts`; `rpg/campaign/finals.ts` (authored Finals for orders 1–14 exist, so `w6`–`w10` capitals have
    theirs);
  - `rpg/campaign/enemies.ts`: `rpgReferenceStat`, `rpgFoeHitShare`, **`rpgFoeBudget(level, rate) = 1 + rate × (L −
    1)² ÷ 49` on lifetime level**, `rpgFoe`;
  - `rpg/campaign/chapters.ts`: `rpgTierLevel`, `rpgChapterReach` (already per tier level);
  - `rpg/campaign/rewards.ts`: `rpgBattleBaseExp` (per tier level), `rpgBattleLaurels` (× tier);
  - `save/battle.ts` `stageLaurels` (Lv 41–50 ×4 by tier level); `save/exchange.ts` `stockedGrades` (stock comes
    from wins); `economy/pacing.ts` (prices, `chapterGrades`);
  - **`rpg/battle/skills.ts` `battleSkillFor`: skill MP × `ref.tier`, so a Tier 2 skill costs twice the MP;**
    `rpg/catalog.ts` `RPG_SKILL_MP` (10, 14, 18, 22, 26 by depth); `rpg/rules.ts` `projectRpgStats`
    (MP = `20 + 1.5 × Wit`, Wit from lifetime level);
  - `world/balance-party.ts` (`balanceMember` builds `tier: 1` only) and `world/balance.test.ts` (`SIM=1`).
- **The sibling packets,** written for docs in parallel: [H39](H39-doc-tier2-classes.md) (advanced classes,
  `docs/design/tier2-classes.md`; **it owns the Tier 2 MP target**: "an on-curve Tier 2 Lv 50 Uma casts within one
  skill of a Tier 1 Lv 50 Uma", and drafts "the skill MP tier factor"), [H40](H40-doc-weapon-arts.md) (weapon arts and
  armor sets, `docs/design/weapon-arts.md`; its §8 lists what Tier 2's Rift should test, as requirements for this
  doc), [H41](H41-doc-outer-ring.md) (the outer ring) and [H42](H42-doc-second-profession.md) (the second
  profession). H39 and H40 both flag `rpgFoeBudget` and leave it to this doc. If any sibling doc exists when you start,
  read it and use its numbers.

### Fixed across H41, H42 and H43 (don't re-decide)

Link the sibling docs by path. These points hold in all of them:
- **The outer ring is the "% damage by kind" lever,** one specialty per Uma (H41). Arts change shape only; set bonuses
  are sustain (H40).
- **The second profession** gathers a physical and a magical family; ring gems, art nodes and set steps cost its items
  (H41, H42, H40).
- **The Tier 2 workforce is the promoted Umas only:** twenty a Rift run, no unlocks (D5). Craft Level and every rank
  start over (D15, tiers §5).
- **This doc owns the Tier 2 foe budget.** Its on-curve Tier 2 Lv 50 Uma has G10 gear, the full inner map (30 active
  nodes), one full ring specialty, weapon arts and a set bonus at their top, and an advanced class.
- **No doc picks a save version number.**

## The doc to write

**`docs/design/tier2-world.md`**, titled **"Tier 2's world and its Rift"**. House style as
[tiers.md](../../design/tiers.md) and [rift.md](../../design/rift.md): a status line (`> **Proposal, <date>, for the
owner to decide; not built.**`, with bullets linking the sibling docs, "owner calls are marked **Z1**, **Z2**…", and
"numbers are drafts for the simulation"); short sentences; tables; each owner call inline as "**Z1, …?**
Recommendation: …" with its reason; a final owner-calls table.

### Sections, in order

1. **What the owner asked for.** Tiers §1, §4 and §6 (the Rift row), and T5. Invent no new asks.
2. **Today.** What already works for `w6`–`w10` (ids, layouts seeded by id, authored capitals, per-tier skill reach,
   EXP and late Laurels) and what is Tier-1-bound (leans, franchises, the lifetime formulas). One table of every formula
   on lifetime level, with its value at lifetime 50 (Tier 1 Lv 50), 51 (Tier 2 Lv 1) and 100 (Tier 2 Lv 50):
   `rpgFoeBudget` HP and defense (2.72, 2.79, 8.0), its offense (1.49, 1.51, 3.0), the regular-foe HP step (2.72,
   2.75, 4.47), `rpgReferenceStat` (99.9, 101.5, 179.4), the hit share (0.28 throughout), bosses acting twice from
   lifetime 10. Recompute them.
3. **Five continents (Z1).** Ids, scenario orders 6–10 (no names), level bands as tier levels and lifetime. The shape
   stays D72's and D97's: forty regions in ten rows, twelve stages, five Springs, a capital; later runs fill the
   regions a first run's four parties leave. **New leans:** five biomes that weren't Tier 1 leans (for example Jungle,
   Volcano, Sky Isles, Glacier, Underworld), not the Twilight Rift; the first region stays a Meadow.
4. **Biomes and foes (Z2).** The nineteen biomes and fifteen signatures stay: T6 keeps one battle system. At most one
   tuning change for all of Tier 2; draft: **every foe's shield +1**, which H40's Break arts and multi-hit answer.
   Weakness counts unchanged.
5. **Starting difficulty (Z3). Required.** Today Tier 2 Lv 1 foes get about 2.8× HP and defense and 1.5× offense,
   sized for a full Tier 1 Lv 50 build. A promoted Uma arrives with Training gear, an empty map and Class Rank 1
   (tiers §5). Estimate what a fresh Tier 2 party deals to `w6`'s first stage against what a built Tier 1 Lv 50 party
   deals to Tier 1's last (roughly a quarter: compute it). Decide how Tier 2's budget relates to a freshly ascended
   party. Weigh the three options, with draft numbers for each:
   - **the budget restarts its build curve at the tier's Lv 1** (recommended): `rpgFoeBudget` and the regular-foe HP
     step read her **tier level** ℓ; `rpgReferenceStat` stays on lifetime level, because her stats do; the hit-share
     ramp runs over each tier's first ten levels;
   - **an onboarding ramp on `w6`** only: it moves the cliff to `w7`;
   - **a larger Ascension purse:** it can't buy a build. The Exchange stocks only after wins, and grades open with
     Craft Level from Lv 1 (G10 at Craft Lv 46, about three weeks of work an Uma).
6. **Scaling through Tier 2 (Z4).** With the restart, Tier 2's build grows past Tier 1's: lifetime stats, the ring, arts,
   set bonuses, advanced class passives. Price them as one Tier 2 term on the restarted curve. Draft:
   `budget₂(ℓ) = rpgFoeBudget(ℓ) × (1 + 0.15 × (ℓ − 1) ÷ 49)`, the offense budget likewise with its own rate. Take each
   lever's worth from H39–H41 (or their packets' targets), and show the Tier 2 Lv 1, 25 and 50 values.
7. **Skill MP in Tier 2 (Z5). Required.** `battleSkillFor` doubles skill MP in Tier 2. Say whether that stays, given MP
   growth at lifetime 51–100, against H39's target. Draft numbers for an average Uma (base 110, Wit growth 0, MP lean
   1, no gear MP; recompute with on-curve gear): MP 53 at Tier 1 Lv 1, 164 at Tier 1 Lv 50, 166 at Tier 2 Lv 1, about
   277 at Tier 2 Lv 50. Casts of her deepest skill on a full bar: 5.3, 6.3, 8.3 and 5.3 with ×2; 10.6 at Tier 2 Lv 50
   without it. Add what MP carried between stages and Springs mean for a Tier 2 region. If H39's doc is on `main`, use
   its factor; if your numbers disagree, say so, and make it one call for both docs.
8. **Levels on screen (Z6).** Region, stage and capital levels show tier levels (Lv 1–50), as Umas do; foes stay on
   lifetime level inside the rules.
9. **Faces (Z7).** Every pack leads somewhere in Tier 2, with Tier 1's totals (PriConne 40, Azur Lane 100, NIKKE 60
   regions) and its capital counts (one, two, two), arranged unlike Tier 1. Draft:

   | Continent | Rows 1–5 | Rows 6–10 | Capital |
   |---|---|---|---|
   | w6 | NIKKE | NIKKE | Azur Lane |
   | w7 | Azur Lane | PriConne | NIKKE |
   | w8 | Azur Lane | NIKKE | PriConne |
   | w9 | PriConne | Azur Lane | NIKKE |
   | w10 | Azur Lane | Azur Lane | Azur Lane |

   Say how `bandFranchise` and `capitalFranchise` take a tier, with Tier 1's table unchanged.
10. **Rewards, Springs and Sweeps (Z8).** As coded: Laurels × tier (×2), first clears ×3, Lv 41–50 ×4 by tier level,
    replays and Sweeps a quarter; EXP shares per tier level, so a Tier 2 campaign is again about 120 first clears.
    Exchange prices stay, so a Tier 2 Laurel buys twice as much: a twenty-Uma workforce buys what it can't gather.
    Springs (five a continent, two hours) and Sweeps unchanged. No Uma Shards (D5).
11. **A run's first week.** A ledger for twenty Umas just ascended: the purse (20,000 Laurels and 100 Speed Tickets,
    T5), Class Marks from banked EXP (T3), an Exchange empty until the first `w6` win, Craft Lv 1 for all, fourteen
    facilities at level 1 (the Wilds' eleven and H42's three) with 42 slots for twenty workers, so upgrades buy level
    3's speed, not slots. Day by day: party levels, gear grades, Laurels. Feed it into Z3; change T5's numbers only if
    the ledger fails.
12. **The Tier 2 Rift (Z9).** Its fronts keep rift.md's shape (four fronts of twelve stages, the ward, the Convergence,
    Echoes at tier Lv 45, 50 and 55) at Tier 2 Lv 50 on Z4's budget. One added test per front, each aimed at a Tier 2
    tool; take H40's §8 requirements if its doc exists. Draft:

    | Front | Tier 2's added test | It tests |
    |---|---|---|
    | Iron | Shields +2, weak to 1–2 Arms kinds (Tier 1: 1–3) | Break arts, an Arms specialty |
    | Arcane | Weak to one element per stage | An element specialty (ring and Orb), area arts against the guards |
    | Duel | The boss acts three times from stage 9 (Tier 1: at the champion) | Single-target burst, advanced class passives |
    | Horde | 5–7 foes a wave (Tier 1: 4–6) | Area cores, the Summoner line's areas |

    The party shapes with H39's advanced classes. The faces picker across tiers (the Bestiary counts every tier).
    Ascending from Tier 2 lands in a partial Tier 3 (T9, Q8): context, one paragraph.
13. **Names (Z10).** The Twilight Rift biome (id `rift`) shares a word with the Rift event, and Tier 2's world shows
    both. Recommend renaming the biome's display name only.
14. **What it needs.** A build table, as rift §10: world (`worldContinent` leans, `bandFranchise` and
    `capitalFranchise` by tier), foe formulas on tier level, the Tier 2 term, the MP factor, screens showing tier
    levels, the Rift's Tier 2 fronts, `balance-party.ts` building Tier 2 Umas, the simulation. No new map art: the maps
    compose from tiles (map-art.md), and T2 tints them. Sizes S/M/L.
15. **Balance targets.** Drafts for `SIM=1`: a freshly ascended party (Training gear, empty map, rank 1) wins `w6`'s
    first regions about as often as a fresh Tier 1 party wins `w1`'s; on-curve Tier 2 win rates within 3 points of
    Tier 1's at matched tier levels (H39's and H40's target too); Tier 2 Lv 50 MP within one deep skill of Tier 1 Lv
    50's (H39); the Tier 2 Rift's targets as rift §11 for on-curve Tier 2 parties; the first week's ledger reaches
    `w6`'s second half.
16. **Owner calls.** The table.

### Owner calls to raise (ids fixed; each with this recommendation)

| Call | Question | Recommendation |
|---|---|---|
| **Z1** | Tier 2's continent leans | Five biomes that weren't Tier 1 leans, not the Twilight Rift; the first region stays a Meadow; the shape unchanged |
| **Z2** | How Tier 2's foes differ | Same biomes and signatures; every foe's shield +1 |
| **Z3** | Starting difficulty: how Tier 2's budget meets a freshly ascended party | The budget restarts its build curve at the tier's Lv 1 (tier level), with stats still on lifetime level. Not a `w6` ramp, not a bigger purse |
| **Z4** | Pricing Tier 2's bigger toolbox | One Tier 2 term on the restarted curve, +15% by Tier 2 Lv 50 (draft), from H39–H41's numbers |
| **Z5** | Skill MP × tier | Keep ×2: by Tier 2 Lv 50 a full bar casts about one fewer deep skill than at Tier 1 Lv 50, inside H39's target. One call with H39 if the numbers differ |
| **Z6** | Levels on screen | Tier levels, Lv 1–50, as Umas show them |
| **Z7** | Which packs lead each Tier 2 continent | The table above: Tier 1's totals, arranged differently |
| **Z8** | Rewards, Springs and Sweeps | As coded: Laurels ×2, prices unchanged; Springs and Sweeps unchanged |
| **Z9** | The Tier 2 Rift's harder fronts | One added test per front, as the table above |
| **Z10** | The Twilight Rift biome's name | Rename its display name; keep the id `rift` |

### Out of scope

- The outer ring (H41), the second profession (H42), advanced classes (H39), weapon arts and set bonuses (H40).
- Tier 3 beyond Q8's rule (context only).
- The tier foundation and Tier shifter (tiers §8 items 1–2), field effects (H13, archived), new biomes or battle rules.
- Art production; any code.

## Done when

- [ ] `docs/design/tier2-world.md` exists in the house style, with every section above (Starting difficulty and Skill
  MP included) and calls Z1–Z10, each with a recommendation and a reason.
- [ ] [tiers.md](../../design/tiers.md) §6 links it: one line under the Option A table, beside any line H40, H41 or
  H42 added.
- [ ] [open-questions.md](../../open-questions.md) has a new row for it: the next free Q number after fetching `main`
  (Q11 was the last used; numbers are never reused), listing Z1–Z10, linking the doc.
- [ ] No code changed. `pnpm lint && pnpm test` still pass.

## Deliver

- Fetch `main` first (the sibling docs may land beside you), then commit to `main`:
  `docs(design): Tier 2's world and its Rift (H43)`. Check `git status` first: no original-game content, and no
  scenario names.
- Docs-only pushes run no deploy (`deploy.yml` ignores `docs/**`).
- **Flag it done:** delete this packet and add a Done row to [docs/handoff/README.md](../README.md).
- The owner then decides the calls.
