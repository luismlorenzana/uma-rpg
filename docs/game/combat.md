# Combat

How a fight works today: engine v10 (D112: Limit Breaks only from the Halls of Heroes; D106: Heroes and inherited Limit
Breaks; D104: Class Ranks, Might, Barrier and Regen; v6–v9 fights still replay as they were). Every number below comes from the code. The tables between `live` markers are
generated (see [README](README.md#how-these-docs-stay-true)); the rest is written by hand and checked against the
engine.

Code: `packages/domain/src/rpg/battle/` (`engine.ts`, `skills.ts`, `limit.ts`, `auto.ts`, `types.ts`), foes in
`rpg/campaign/enemies.ts`, stages in `world/world.ts`, the screen in `apps/web/src/places/scenario-gate/FightScreen.tsx`.

## A fight at a glance

- **Five Umas against 1–8 foes**, in **1–3 waves**. The five are the active party ([sections](sections.md#scenario-gate)).
- **Every stage starts at full HP. MP carries** from stage to stage and refills at Springs ([maps](maps.md)).
- **Rounds.** Each round:
  1. The foes' intents are shown: each foe's move and target.
  2. Each living Uma acts **once**, in any order the player picks.
  3. When all have acted, the foes act in initiative order. A foe that **acts twice** takes her second move after every
     foe's first.
  4. The round ends: Burn ticks, statuses count down, Breaks expire.
- **Win:** every foe of the last wave falls. **Lose:** every Uma falls, or the fight passes 40 rounds per wave.
- **Deterministic.** A fight is its frozen input plus the actions taken (D52), so it replays identically. Random targets
  are seeded by the fight, the round, the actor and the hit. Every action is saved, so a fight survives a reload and
  resumes on another device.
- **Waves.** When a wave falls and another waits, the round ends at once. The next wave steps in at the start of a
  fresh round, so everyone acts again. The party keeps its HP, MP, statuses, Limit charge and lingering summons.
- **Auto and speed.** Auto plays each Uma's turn with the same policy the balance simulation uses (`autoAction`):
  - a ready Limit Break first;
  - otherwise the best affordable skill or Attack, weighing weaknesses and how many foes it reaches.

  Any tap hands control back, and so does a failed action. Speed plays the animations at 1×, 2× or 4×.

## Battle scenery

Each region's fight has its biome's sky, a repeating pixel-art horizon and a tiled ground floor (uma-art 2.2.0).
Capitals use Ancient Ruins. The lower party band and foe info panels stay dark for readable bars and numbers.
The scene stamps the terrain once per size, not per animation frame; if the art is unavailable, the gradient remains.

Hits use a four-pose pixel impact for their damage kind. Lingering summons have small, two-pose familiars beside
their owner, replaced by the next summon and removed when she falls. Effects follow the scene clock at 1×, 2× or 4×,
including later waves. Reduced motion shows a still final impact and no familiar idle; missing art uses the procedural fallback.

## The actions

| Action | What it does |
|---|---|
| **Attack** | A hit of one weapon's kind at power 1.0 (× her hand) on the tapped foe. Free; fills the Limit gauge by 2 |
| **Skill** | An equipped skill: its MP, its hits, its shape. Fills the gauge by 4 |
| **Guard** | Covers another Uma until the end of the round. Hits aimed at her land on the guard at half damage |
| **Limit Break** | With a full gauge (12), for a Hero or a Learner only: her seat's or one of her Heroes', at no MP, as her act ([Halls of Heroes](heroes.md)) |

Class rules change the act ([classes](classes.md)):
- **Spell Blade:** every act is a pair, one Arms half (an Attack or an Arms skill) and one Tome half. Both resolve at
  her hand (×0.45), and the MP is the sum of the halves.
- **Summoner:** a summon **lingers**. When she next summons, the lingering one strikes again at its linger share
  (×0.3), then leaves.
- **Cleric:** her Arms skills put a debuff on the foe they hit; her Tome skills put a buff on every Uma.

## Damage

For each part of each hit:

1. **Base:** `max(offense × 0.2, offense − defense × 0.5) × power`. Offense is ATK for Arms kinds and MATK for elements,
   plus the **Might** of the weapon the hit is made with (+4 a grade, D104). Defense is the target's DEF or MDEF.
2. **Weak hit:** ×1.3 when the hit's kind is on the foe's weakness lists, or it's Light or Dark against a Hexed foe. An
   Uma's **Orb** adds its kind to every hit for this check, without extra damage.
3. **Statuses** (table below) raise or cut it.
4. **Specials:** `vs-broken` ×1.3 on a broken foe, `vs-wounded` ×1.3 below half HP. `pierce` ignores the unbroken
   halving.
5. **Unbroken foes take ×0.5.** Breaking them is how damage lands.
6. An Uma's **evasion** (Speed Extra Stats, up to 50%) cuts what she takes.
7. A guard intercepting a hit takes half of it, and a Barrier absorbs foe damage before HP. Physical armor starts her
   each fight with a Barrier (5 a grade), and magical armor heals Regen (1 HP a grade) at the end of each round (D104).
   Damage is at least 1.

Where the stats come from (`projectRpgStats` in `rpg/rules.ts`):

| Stat | From the outfit's projected stats (base ÷ 5 + 1.5 × (1 + growth) per level) | Then |
|---|---|---|
| HP | 100 + 5 × Stamina + 2 × Power | × class lean, + Extra Stats and armor |
| MP | 20 + 1.5 × Wit | × class lean, … |
| ATK / MATK | Speed | × class lean, … |
| DEF | Power | × class lean, … |
| MDEF | (Power + Wit) ÷ 2 | × class lean, … |
| Initiative | Stamina | Foes act by initiative; Umas act in the order you choose |

Each Extra Stats or armor point adds a flat +1 to its stat (+5 HP). Speed points give 0.6% evasion each, and Limit
points a head start on the gauge ([loops](loops.md#extra-stats-and-gear)). An average Uma's ATK is about 22 at Lv 1 and
111 at Lv 50; HP about 276 and 928.

## Weaknesses, shields and Breaks

- Every foe has **weakness lists**: one to three Arms kinds and up to two elements (from her signature, see
  [maps](maps.md#element-signatures)).
- Every foe has a **shield** (1–8 points). **Each weak hit removes one point.** A Cleric's Breaker charge makes a weak hit
  remove two, and Shatter removes points directly.
- At zero the foe **Breaks**. She loses this round's and the next round's action, and takes full damage (×2 compared to
  unbroken). At the end of the second enemy phase she stands back up with her shield full.
- Elements beat each other in a ring and a pair: **Fire > Ice > Lightning > Fire**, and **Light ⇄ Dark**. A dual-element
  foe is weak to what beats either element, minus her own; a light+dark foe answers to weapons only.

## Statuses

| Status | Who puts it on | Effect per stack (cap 3, 2 rounds unless stated) |
|---|---|---|
| Armor Break | Cleric Greatsword skills, on the foe hit | +10% physical damage taken |
| Mind Break | Cleric Lance skills | +10% magical damage taken |
| Enfeeble | Cleric Axe skills | −10% damage dealt |
| Shatter | Cleric Bow skills | Removes shield points at once |
| Hex | Cleric Katana skills | Weak to Light and Dark while it lasts (doesn't stack) |
| Brave | Cleric Fire Tome skills, on every Uma | +10% physical damage dealt |
| Faith | Cleric Light Tome skills | +10% magical damage dealt |
| Aegis | Cleric Blizzard Tome skills | −10% damage taken |
| Breaker | Cleric Thunder Tome skills | A charge: her next weak hit removes two shield points |
| Clarity | Cleric Dark Tome skills | Restores 4% of max MP |
| Burn | Foes (fire storms) | Loses 4% of max HP at the end of each round |
| Mark | Foes (skirmishers) | +10% damage taken |
| Weaken, Slow | Foes | −15% damage dealt |
| Power-up | Foes (captains) | +15% damage dealt |
| Ward | Foes (champions) | −15% damage taken |

A Cleric's depth-5 skills put their status on every foe, or on every Uma. Some Brawler and Mage side skills also
add riders (a status on each foe hit) or Barriers; their rows in [skill trees](skill-trees.md) say so.

## Limit Breaks

<!-- live:limits -->
**Limit Breaks come only from the Halls of Heroes** (D112, engine v10). A Hero always uses her seat's, at 100%; a Learner uses either of her Heroes', at 50% plus 5% a Bond Level (100% at Bond 10). An Uma who is neither has none, and her gauge has nothing to spend. At 100% a Limit Break is worth her class's power below, in single-target casts at her open depth:

| Class | Limit Break power |
|---|---|
| Brawler | 2× |
| Mage | 2.4× |
| Spell Blade | 2× |
| Cleric | 1.5× |
| Summoner | 1.8× |

The gauge fills to 12: +2 for an Attack, +4 for a skill. A Limit Break costs no MP and takes her turn. Fights from engines v6–v9 replay with the classes' retired Limit Breaks: Brawler Twin Strike: one equipped skill cast twice at full power, or two Attacks with a weapon; Mage Prismatic Nova: a hit of each of the five elements, 2.4× her open depth's power in all; Spell Blade Twin Arts: an Arms skill and a Tome skill, both at full power (no half); Cleric Divine Patrons: a hit with each of her five weapons (1.5× in all), each status at 3 stacks; Summoner Grand Summon: one summon at twice her strength that lingers at twice its share.
<!-- /live -->

The twenty Limit Breaks themselves, and how Heroes and Learners earn them, are in [Halls of Heroes](heroes.md).

## Foes

Foes come from the stage generator ([maps](maps.md)). Each has a role, a rank (regular, elite or boss), one or two
elements, weaknesses and a shield.

<!-- live:foe-roles -->
| Role | Moves | Below 50% HP |
|---|---|---|
| Striker | Strike the front (damage, 100%, front); Flame blow (damage, 130%, seeded) | — |
| Caster | Flame bolt at the weakest (damage, 110%, lowest-hp); Hex: weaken (debuff, seeded) | — |
| Guard | Shield bash (damage, 80%, front); Guard an ally (guard, ally) | — |
| Skirmisher | Flame cut + mark (damage, 90%, seeded); Strike the front (damage, 100%, front) | — |
| Captain | Flame smash (damage, 150%, front); Rally: power up (buff, self); Flame sweep (all) (damage, 55%, all) | Flame storm (all) (damage, 75%, all); Crush the weakest (damage, 190%, lowest-hp) |
| Champion | Flame smash (damage, 160%, front); Flame sweep (all) (damage, 60%, all); Ward: guard up (buff, self) | Flame storm (all) (damage, 85%, all); Crush the weakest (damage, 210%, lowest-hp); Flame lance (damage, 170%, front) |

Shown with Fire; a foe uses her own element, and a dual-element foe her second element for her second elemental move.
<!-- /live -->

Captains and champions change tactics below 50% HP (their phase-two moves). Foe faces come from the biome's franchise
pack, a private file; see [maps](maps.md#faces).

<!-- live:foe-scaling -->
| Setting | Value |
|---|---|
| HP | (40 + 4.2 × reference stat) × role × rank |
| Sub-boss and boss HP | ×4.5 and ×6.5, times the party's reachable skill depth |
| Gear budget | +0.4% to every stat per level past Lv 10 |
| World: regular foes | +3.5% HP and +2% offense per level |
| World: elites | +1% HP and +0.5% offense per level |
| World: region bosses | ×0.5 a champion's HP, +0.5% offense per level |
| Shields | Regular 2 (by formation), sub-boss 6, boss 8 |
<!-- /live -->

## Rewards

A win pays every entrant, including those knocked out: EXP, Laurels, tokens, and Shards at milestone levels. A loss or
giving up pays nothing and leaves MP as it was before the fight. Numbers are in [loops](loops.md#laurels-exp-and-tokens).

## Constants

<!-- live:battle-constants -->
| Constant | Value | Meaning |
|---|---|---|
| `BATTLE_WEAK` | 1.3 | Damage multiplier of a weak hit |
| `BATTLE_UNBROKEN_FACTOR` | 0.5 | Damage a foe takes while its shield stands |
| `BATTLE_DEFENSE_SHARE` | 0.5 | Share of defense subtracted from offense |
| `BATTLE_MIN_OFFENSE_SHARE` | 0.2 | Floor: a hit keeps at least this share of offense |
| `BATTLE_GUARD_FACTOR` | 0.5 | Damage a guarding ally takes for the one she covers |
| `BATTLE_BREAK_ROUNDS` | 2 | Rounds a Break lasts (the foe loses its actions) |
| `BATTLE_MAX_ROUNDS` | 40 | Round cap per wave; past it the fight is lost |
| `BATTLE_STATUS_TURNS` | 2 | Default rounds a status lasts |
| `BATTLE_STATUS_STACK_CAP` | 3 | Stacks a status can reach |
| `BATTLE_STATUS_STEP` | 0.1 | Per stack: Cleric statuses, Mark, Shock |
| `BATTLE_FOE_STATUS_STEP` | 0.15 | Per stack: foes' Weaken, Slow, Power-up, Ward |
| `BATTLE_BURN_PERCENT` | 0.04 | Max HP lost per Burn stack at the end of a round |
| `BATTLE_CLARITY_PERCENT` | 0.04 | Max MP restored per Clarity stack |
| `BATTLE_BARRIER_PERCENT` | 0.08 | Barrier per stack, as a share of max HP |
| `BATTLE_BARRIER_CAP` | 0.3 | Barrier cap, as a share of max HP |
| `BATTLE_LIMIT_MAX` | 12 | Limit Break gauge |
<!-- /live -->
