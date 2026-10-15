# Combat

How a fight works today: engine v13 (D142: Might as fixed values by grade again; D141, [combat balance](../design/combat-balance.md): a ratio damage formula,
Might as a share, Cleric and Summoner support, Rally, charged foe moves with locks, Steel after a Break, a breather
between waves; D124: two accessories; D112: Limit Breaks only from the Halls of Heroes; D106: Heroes and inherited Limit
Breaks; D104: Class Ranks; v6–v12 fights still replay as they were). Every number below comes from the code. The tables between `live` markers are
generated (see [README](README.md#how-these-docs-stay-true)); the rest is written by hand and checked against the
engine.

Code: `packages/domain/src/rpg/battle/` (`engine.ts`, `skills.ts`, `limit.ts`, `auto.ts`, `types.ts`), foes in
`rpg/campaign/enemies.ts`, stages in `world/world.ts`, the screen in `apps/web/src/places/scenario-gate/FightScreen.tsx`.

## A fight at a glance

- **Five Umas against 1–8 foes**, in **1–3 waves**. The five are the active party ([sections](sections.md#scenario-gate)).
- **Every stage starts at full HP. MP carries** from stage to stage and refills at Springs ([maps](maps.md)).
- **Rounds.** Each round:
  1. The foes' intents are shown: each foe's move and target, and for a damaging move about what it will deal to
     its target (the most it deals to anyone, for a move on everyone), before Barriers and guards (D140).
  2. Each living Uma acts **once**, in any order the player picks.
  3. When all have acted, the foes act in initiative order. A foe that **acts twice** takes her second move after every
     foe's first.
  4. The round ends: Burn ticks, statuses count down, Breaks expire, skill Barriers lapse (v12), and a lingering summon
     that mends mends again.
- **Win:** every foe of the last wave falls. **Lose:** every Uma falls, or the fight passes 40 rounds per wave.
- **Deterministic.** A fight is its frozen input plus the actions taken (D52), so it replays identically. Random targets
  are seeded by the fight, the round, the actor and the hit. Every action is saved, so a fight survives a reload and
  resumes on another device.
- **Waves.** When a wave falls and another waits, the round ends at once. The next wave steps in at the start of a
  fresh round, so everyone acts again. The party keeps its HP, MP, statuses, Limit charge and lingering summons; from
  v12 every Uma standing recovers 10% of her max HP (a breather).
- **Auto and speed.** Auto plays each Uma's turn with the same policy the balance simulation uses (`autoAction`):
  - a ready Limit Break first;
  - otherwise the best affordable skill or Attack, weighing weaknesses and how many foes it reaches;
  - from v12 a skill's support counts too: a mend for the hurt, a Barrier for the threatened, a revive for the fallen
    (a support that uses its whole share is worth 1.5 casts of its depth's damage).

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
- **Cleric:** her Arms skills put a debuff on the foe they hit and a **Barrier** on the Uma the shown moves threaten
  most; her Tome skills put a buff on every Uma, **mend** the most hurt and **cleanse** one foe status from each. At
  depth 5 the Barrier and the mend reach every Uma. See [Support](#support-v12).

## Damage

For each part of each hit:

1. **Base:** `offense² ÷ (offense + defense) × power` (D141). Offense is ATK for Arms kinds and MATK for elements;
   defense the target's DEF or MDEF. The same ratio gives the same share at every level, and it is never zero.
   **Might**: the weapon a hit is made with adds its grade's Might to offense (D142, engine v13): 1, 4, 7, 12, 18, 26,
   34, 45, 55, 68 for grades 1–10, about 6% × g at the level its grade opens. (v12 fights took Might as +6% a grade on
   the hit; before v12, `max(offense × 0.2, offense − defense × 0.5)`, with Might +4 a grade added to offense.)
2. **Weak hit:** ×1.3 when the hit's kind is on the foe's weakness lists, or it's Light or Dark against a Hexed foe. An
   Uma's **Orb** adds its kind to every hit for this check, without extra damage.
3. **Statuses** (table below) raise or cut it.
4. **Specials:** `vs-broken` ×1.3 on a broken foe, `vs-wounded` ×1.3 below half HP. `pierce` ignores the unbroken
   halving.
5. **Unbroken foes take ×0.5.** Breaking them is how damage lands.
6. An Uma's **evasion** (Speed Extra Stats, up to 50%) cuts what she takes.
7. A guard intercepting a hit takes half of it. Damage is at least 1.
8. **A skill's Barrier** (v12) absorbs any damage first. It lasts until the end of the round it was raised in.
9. **Her accessories (D124, D141: shares of her own numbers, so they keep their worth at every level):**
   - **Shields:** a Bulwark Talisman's shield absorbs physical damage, a Veil Amulet's magical damage, from the start of
     the fight (2% of her max HP a grade each).
   - **Damage cuts:** an Iron Talisman cuts the physical damage she takes, a Ward Amulet the magical (1.5% a grade).
   - **Returned damage:** a Thorn Talisman returns physical damage she takes to its attacker, a Mirror Amulet magical
     damage (3% a grade).
   - **Drain:** a Vampire Talisman heals her by the physical damage she deals (2% a grade); a Siphon Amulet restores
     MP from the magical damage she deals (0.5% a grade).
   - **Each round's end:** a Vital Talisman heals 0.5% of her max HP a grade, a Spring Amulet restores 1 MP a grade.
   - **Older fights:** before v12 the effects were a fifth to a third of these and Regen and shields were flat; before
     v11 a Barrier from physical armor took any damage, and magical armor gave Regen (D104).

Where the stats come from (`projectRpgStats` in `rpg/rules.ts`):

| Stat | From the outfit's projected stats (base ÷ 5 + 1.5 × (1 + growth) per level) | Then |
|---|---|---|
| HP | 100 + 5 × Stamina + 2 × Power | × class lean, + Extra Stats and armor |
| MP | 20 + 1.5 × Wit | × class lean, … |
| ATK / MATK | Speed | × class lean, … |
| DEF | Power | × class lean, … |
| MDEF | (Power + Wit) ÷ 2 | × class lean, … |
| Initiative | Stamina | Foes act by initiative; Umas act in the order you choose |
| Heal (v12) | Guts | × class heal lean (Cleric 1.3, Summoner 1.2). Raises her mends and Barriers ×(1 + Heal ÷ 300) |

Each Extra Stats or armor point adds a flat +1 to its stat (+5 HP). An Extra Stats node is worth its grade (D141): moon
7 gives 7 points. Speed points give 0.6% evasion each, and Limit points a head start on the gauge
([loops](loops.md#extra-stats-and-gear)). An average Uma's ATK is about 22 at Lv 1 and 111 at Lv 50, before gear and
Extra Stats; HP about 276 and 928.

### Where damage comes from

Measured on the balance simulation's on-curve Brawler at each level (D142). Offense adds up; a hit doesn't, since it is
offense² ÷ (offense + defense), so each source is shown alone on top of her level stat, and all together. Skill depth,
opened by Class Rank, multiplies whatever offense she has.

<!-- live:damage-sources -->
| Level | Gear grade, skill depth | Uma stats (level) | Extra Stats | Weapon Might | Armor | Offense | Hit: + Extra Stats | Hit: + weapon | Hit: + armor | Hit: all three | Skill depth vs depth 1 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Lv 1 | G1, 1 | 24 (92%) | 1 (4%) | 1 (4%) | 0 (0%) | 26 | ×1.06 | ×1.06 | ×1.00 | ×1.12 | ×1.00 |
| Lv 10 | G2, 2 | 41 (77%) | 3 (6%) | 4 (8%) | 5 (9%) | 53 | ×1.11 | ×1.14 | ×1.18 | ×1.43 | ×1.38 |
| Lv 25 | G5, 3 | 68 (61%) | 15 (14%) | 18 (16%) | 10 (9%) | 111 | ×1.34 | ×1.41 | ×1.23 | ×2.02 | ×1.81 |
| Lv 40 | G8, 5 | 95 (49%) | 35 (18%) | 45 (23%) | 20 (10%) | 195 | ×1.63 | ×1.82 | ×1.35 | ×2.96 | ×2.87 |
| Lv 50 | G10, 5 | 113 (44%) | 52 (20%) | 68 (26%) | 25 (10%) | 258 | ×1.84 | ×2.13 | ×1.39 | ×3.62 | ×2.87 |

A regular foe's 100% physical hit, as a share of her HP:

| Level | Uma stats only | + Extra Stats (HP, DEF) | + armor (HP, DEF) | + Iron Talisman | All (on curve) |
|---|---|---|---|---|---|
| Lv 1 | 17% | 16% | 16% | 17% | 15% |
| Lv 10 | 24% | 22% | 22% | 23% | 20% |
| Lv 25 | 26% | 22% | 23% | 24% | 18% |
| Lv 40 | 30% | 23% | 27% | 27% | 18% |
| Lv 50 | 34% | 25% | 30% | 29% | 19% |

The Brawler leans ATK ×1.1 and DEF ×1.1; her on-curve nodes go to ATK, HP, DEF and M.DEF in turn, and she wears a Vampire and an Iron Talisman.
<!-- /live -->

## Weaknesses, shields and Breaks

- Every foe has **weakness lists**: one to three Arms kinds and up to two elements (from her signature, see
  [maps](maps.md#element-signatures)).
- Every foe has a **shield** (1–8 points). **Each weak hit removes one point.** A Cleric's Breaker charge makes a weak hit
  remove two, and Shatter removes points directly.
- At zero the foe **Breaks**. She loses this round's and the next round's action, and takes full damage (×2 compared to
  unbroken). At the end of the second enemy phase she stands back up with her shield full.
- **v12 (D141):** a Break also strips her buffs (Power-up, Ward), cancels a charged move and gives back the party's
  Rally from her. Back up, she is **Steeled**: her shield can't be chipped until she has made a move, so a party can't
  hold a foe down Break after Break. Her shield badge shows it.
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

Battle badges show the published status glyph and its stack count, with the full name in the accessible label.
Statuses without glyphs (including Burn and foes' Power-up) keep text badges. Skill descriptions keep full names
beside decorative glyphs; Shatter and Clarity act immediately, so they do not create lingering badges.

## Support (v12)

Engine v12 gives the party a defensive half without a new class (D141). Brawler, Mage and Spell Blade stay pure
offense; Cleric and Summoner are half offense, half healer and shielder. Every support comes after the skill's hits.

| Support | Who | What it does |
|---|---|---|
| **Mend** | Cleric Tome skills (the most hurt Uma; every Uma at depth 5); Summoner Light summons (every Uma) | Heals a share of the target's max HP by depth: 14%, 16%, 18%, 20%, 22%; on every Uma ×0.4 (summons ×0.5 of that) |
| **Barrier** | Cleric Arms skills (the Uma the shown moves threaten most; every Uma at depth 5); Summoner Ice summons (every Uma, ×0.35) | Absorbs any damage first, the same shares, until the end of the round. Cap 40% of max HP |
| **Cleanse** | Cleric Tome skills | Removes one foe-made status (Burn, Mark, Weaken, Slow) from each Uma |
| **Revive** | Cleric's Rebirth (Light tree, depth-3 side B); Summoner Valkyries (Lance, depth 4–5) | Raises the first fallen Uma at 25% of her HP, once per Uma per fight |
| **Drain** | Summoner Dark summons | 30% of the damage its hits deal heals the most hurt Uma |
| **Aegis** | Summoner Greatsword knights | Aegis 1 on every Uma (2 at depth 5) |
| **Enfeeble** | Summoner Axe brutes | Enfeeble 1 on every foe hit (2 at depth 5) |

- **Heal** (from Guts) raises every mend, Barrier and revive ×(1 + Heal ÷ 300); her profile shows it.
- **Lingering summons:** a Light summon that lingers mends again at each round's end, at its linger share (×0.3, or
  ×0.4 for Bonded); its farewell strike mends at that share too. Other supports don't repeat.
- **Rally:** 30% of the last foe hit an Uma took (after Barriers) shows grey on her HP bar. If the party Breaks or
  defeats that foe before the foe moves again, the Uma wins it back.

## Charged moves (v12)

Sub-bosses and Bosses carry a charged move (D141): the captain's Execution (on the weakest) and Cataclysm (everyone,
below half HP), the champion's Cataclysm and Apocalypse (below half HP).

- **Announced a round early:** her intent reads "Charging: …" and her panel shows its **locks**, two to four kinds
  drawn from her weaknesses. The splash cuts in as she gathers.
- **Locks:** every hit of a lock's kind breaks one (an Orb's kind counts, as for weaknesses). The move lands the next
  round at its power × the locks left ÷ all of them.
- **Cancelled** when every lock breaks or when she is Broken; the splash cuts in again with "Cancelled!".
- She doesn't charge two rounds running, and a foe that acts twice charges only with her first move.

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
| Captain | Flame smash (damage, 150%, front); Rally: power up (buff, self); Flame sweep (all) (damage, 55%, all); Flame execution (damage, 260%, lowest-hp, charged, 2 locks) | Flame storm (all) (damage, 75%, all); Crush the weakest (damage, 190%, lowest-hp); Flame cataclysm (all) (damage, 130%, all, charged, 3 locks) |
| Champion | Flame smash (damage, 160%, front); Flame sweep (all) (damage, 60%, all); Ward: guard up (buff, self); Flame cataclysm (all) (damage, 130%, all, charged, 3 locks) | Flame storm (all) (damage, 85%, all); Crush the weakest (damage, 210%, lowest-hp); Flame lance (damage, 170%, front); Flame apocalypse (all) (damage, 170%, all, charged, 4 locks) |

Shown with Fire; a foe uses her own element, and a dual-element foe her second element for her second elemental move.
<!-- /live -->

Captains and champions change tactics below 50% HP (their phase-two moves); a charged move she is gathering or landing
carries over. From Lv 10 a lone region boss and an elite's sub-boss act twice (D141). Foe faces come from the region's
franchise and each slot's tier, from a private file; see [maps](maps.md#faces).

### Splash cut-ins

Key enemies, Sub-bosses and Bosses have a 16:9 splash (D135). It cuts in across the rivals' half of the stage:
- on her first move of each round;
- when she's broken, after the BREAK;
- when she changes tactics at half HP;
- when she's defeated, fading to grey.

Each cut-in shows her art sweeping in from the right, a stripe in her tier's colour (Key enemies teal, Sub-bosses
violet, Bosses red) and a caption: her move, BREAK!, Changes tactics! or DEFEATED. It holds for about 0.7 s.
- **Skipping:** tapping the stage skips it, like any playback, and the speed setting shortens it.
- **Reduced motion:** with reduced motion on, cut-ins don't play.
- **Regulars:** Regular foes have no splash.

The engine announces each foe move with a `move` cue. Cues are presentation only and never saved, so fights replay
unchanged.

<!-- live:foe-scaling -->
| Setting | Value |
|---|---|
| HP | (40 + 4.2 × reference stat) × role × rank |
| Offense | Set so a 100% hit takes a share of an average Uma's HP at her level (20% at Lv 1, 28% from Lv 10), × the offense budget, × role |
| Sub-boss and boss HP | ×3.5 and ×5.5, times the party's reachable skill depth |
| Build budget | What a built party's gear and Extra Stats call for: HP and defense ×(1 + 0.035 × (L − 1)² ÷ 49), ××2.72 at Lv 50; offense ××1.49 at Lv 50 |
| World: regular foes | +3.5% HP per level |
| World: elites | +0% HP per level |
| World: region bosses | ×0.5 a champion's HP |
| Acting twice | From Lv 10: a lone region boss and an elite's sub-boss; a lone elite always |
| Formations | A foe's offense is the square root of her HP share against a pair's foe, at most a full foe's |
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
| `BATTLE_DEFENSE_SHARE` | 0.5 | Before v12: share of defense subtracted from offense |
| `BATTLE_MIN_OFFENSE_SHARE` | 0.2 | Before v12: a hit keeps at least this share of offense |
| `BATTLE_GUARD_FACTOR` | 0.5 | Damage a guarding ally takes for the one she covers |
| `BATTLE_BREAK_ROUNDS` | 2 | Rounds a Break lasts (the foe loses its actions) |
| `BATTLE_MAX_ROUNDS` | 40 | Round cap per wave; past it the fight is lost |
| `BATTLE_STATUS_TURNS` | 2 | Default rounds a status lasts |
| `BATTLE_STATUS_STACK_CAP` | 3 | Stacks a status can reach |
| `BATTLE_STATUS_STEP` | 0.1 | Per stack: Cleric statuses, Mark, Shock |
| `BATTLE_FOE_STATUS_STEP` | 0.15 | Per stack: foes' Weaken, Slow, Power-up, Ward |
| `BATTLE_BURN_PERCENT` | 0.04 | Max HP lost per Burn stack at the end of a round |
| `BATTLE_CLARITY_PERCENT` | 0.04 | Max MP restored per Clarity stack |
| `BATTLE_BARRIER_PERCENT` | 0.08 | Barrier per stack of a summon's rider, as a share of max HP |
| `BATTLE_BARRIER_CAP` | 0.3 | Before v12: Barrier cap, as a share of max HP |
| `BATTLE_COVER_CAP` | 0.4 | v12: a skill Barrier's cap, as a share of max HP; it lasts the round |
| `RPG_SUPPORT_SHARE` | 0.14, 0.16, 0.18, 0.2, 0.22 | v12: a mend's or Barrier's share of the target's max HP, by depth |
| `RPG_SUPPORT_ALL` | 0.4 | v12: that share on every Uma, at depth 5 and for summons |
| `BATTLE_HEAL_SCALE` | 300 | v12: her Heal raises mends and Barriers ×(1 + Heal ÷ this) |
| `BATTLE_REVIVE_SHARE` | 0.25 | v12: a revive's share of max HP, before her Heal |
| `BATTLE_RALLY_SHARE` | 0.3 | v12: share of a foe hit she can Rally back |
| `BATTLE_BREATHER` | 0.1 | v12: share of max HP every Uma recovers when a new wave enters |
| `BATTLE_LIMIT_MAX` | 12 | Limit Break gauge |
<!-- /live -->
