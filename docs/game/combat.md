# Combat

How a fight works today: engine v15 (D188, [classes v2](../design/classes-v2.md): six classes with the Paladin, the
hybrids' mirrored hands, one healer a party at doubled shares from her ATK or M.ATK, flat Orbs in a Damage slot, Guts in
HP, six halls of Limit Breaks; D169: the Rift's foe traits, the ward, a third act and mixed locks, which no campaign foe
carries; D142: Might as fixed values by grade again; D141, [combat balance](../design/combat-balance.md): a ratio damage
formula, support, Rally, charged foe moves with locks, Steel after a Break, a breather between waves; D124: two
accessories; D112: Limit Breaks only from the Halls of Heroes; D106: Heroes and inherited Limit Breaks; D104: Class
Ranks; v6–v14 fights still replay as they were, an open one included). Every number below comes from the code. The
tables between `live` markers are generated (see [README](README.md#how-these-docs-stay-true)); the rest is written by
hand and checked against the engine.

Code: `packages/domain/src/rpg/battle/` (`engine.ts`, `skills.ts`, `limit.ts`, `auto.ts`, `types.ts`), foes in
`rpg/campaign/enemies.ts`, stages in `world/world.ts`, the Rift's fights in `rift/` (`fronts.ts`, `picker.ts`,
`generate.ts`), the screen in `apps/web/src/places/scenario-gate/FightScreen.tsx`, which the world map and the Rift share
through a fight source (`battle/fight-source.ts`, H50).

## A fight at a glance

- **Five Umas against 1–8 foes**, in **1–3 waves**. The five are the active party ([sections](sections.md#scenario-gate)).
- **Every stage starts at full HP. MP carries** from stage to stage and refills at Springs ([maps](maps.md)).
- **Rounds.** Each round:
  1. The foes' intents are shown: each foe's move and target, and for a damaging move about what it will deal to
     its target (the most it deals to anyone, for a move on everyone), before Barriers and guards (D140).
  2. Each living Uma acts **once**, in any order the player picks.
  3. When all have acted, the foes act in initiative order. A foe that **acts twice** takes her second move after every
     foe's first; a Rift champion that **acts three times** (v14) takes her third after every second.
  4. The round ends: Burn ticks, statuses count down, Breaks expire, skill Barriers lapse (v12), and a Cleric's Regen
     mends (v15; to v14 a lingering summon that mended mended again).
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
    (a support that uses its whole share is worth 1.5 casts of its depth's damage);
  - a Spell Blade or a Summoner picks her best leading half, then her best other half with the MP left.

  Any tap hands control back, and so does a failed action. Speed plays the animations at 1×, 2× or 4×.

## Battle scenery

Each region's fight has its biome's sky, a repeating pixel-art horizon and a tiled ground floor (uma-art 2.2.0).
Capitals use Ancient Ruins. The lower party band and foe info panels stay dark for readable bars and numbers.
The scene stamps the terrain once per size, not per animation frame; if the art is unavailable, the gradient remains.

The party stands below as busts in spaced, bordered cards with solid dark backgrounds, fitted without stretching
and anchored at the bottom. They breathe gently while idle and make one small hop with a brief glow on a win.
Reduced motion turns these animations off; missing busts
use the outfit icon. Chibis stay on the Town Hall plaza, never in fights (SB5).

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
- **Spell Blade:** every act is a pair, one Arms half (an Attack or an Arms skill) and one Tome half. Each half resolves
  at its own hand, the Arms half first, and the MP is the sum of the halves. **Her Arms half lands one extra hit:** its
  power is spread over one more hit, so an Attack lands as two hits at half power and an n-hit skill as n + 1, the total
  unchanged. Each weak hit chips a shield point, so with an Attack she chips three an act.
- **Summoner:** every act is a pair too, a Tome summon and an Arms summon (an Attack can be either half), the Tome half
  first. Her **Tome summon lingers**. When her next pair comes, before either half, it strikes **every living foe** once
  in farewell, at its linger share ([skill trees](skill-trees.md) list it) × its hits' power × `BATTLE_FAREWELL_FACTOR`
  ([constants](#constants)), then leaves. An Arms summon or an Attack leaves nothing. Limit Breaks, Guards and new
  waves keep the lingering summon; if she falls, it leaves with her. Her lines carry no support.
- **Paladin and Cleric:** the healers. Their Arms skills put a debuff on the foe they hit and a **Barrier** on the Uma
  the shown moves threaten most; their Tome skills put a buff on every Uma, **mend** the most hurt and **cleanse** one
  foe status from each. At depth 5 the Barrier and the mend reach every Uma. See [Support](#support).
- **Older fights:** to v14 a Spell Blade's halves were ×0.45 each, a Summoner acted with one summon at a time, her
  lingering one striking again at ×0.3 when she next summoned, and the Cleric's "any five" weapons shared the support with
  the Summoner's lines.

## Damage

For each part of each hit:

1. **Base:** `offense² ÷ (offense + defense) × power` (D141). Offense is ATK for Arms kinds and MATK for elements;
   defense the target's DEF or MDEF. The same ratio gives the same share at every level, and it is never zero.
   **Might**: the weapon a hit is made with adds its grade's Might to offense (D142, engine v13): 1, 4, 8, 12, 19, 26,
   35, 45, 57, 68 for grades 1–10, about 6% × g at the level its grade opens. **Her Orb** (v15, C4) adds half that to
   her hits of its kind (1, 2, 4, 6, 10, 13, 18, 23, 29, 34), a kind she doesn't wield too, for her inherited Limit
   Breaks. (v12 fights took Might as +6% a grade on the hit; before v12, `max(offense × 0.2, offense − defense × 0.5)`,
   with Might +4 a grade added to offense.)
2. **Weak hit:** ×1.3 when the hit's kind is on the foe's weakness lists, or it's Light or Dark against a Hexed foe.
   (To v14 an Uma's Orb added its kind to every hit for this check, without damage of its own.)
3. **Statuses** (table below) raise or cut it.
4. **Specials:** `vs-broken` ×1.3 on a broken foe, `vs-wounded` ×1.3 below half HP. `pierce` ignores the unbroken
   halving.
5. **Unbroken foes take ×0.5.** Breaking them is how damage lands. A Rift foe's **ward** (v14) takes ×0.5 again from
   the channel she wards, Broken or not ([below](#weaknesses-shields-and-breaks)).
6. An Uma's **evasion** (Speed Extra Stats, up to 50%) cuts what she takes.
7. A guard intercepting a hit takes half of it. Damage is at least 1.
8. **A skill's Barrier** (v12) absorbs any damage first. It lasts until the end of the round it was raised in.
9. **Her Support accessory (D124, D141: shares of her own numbers, so they keep their worth at every level):**
   - **Shields:** a Bulwark Talisman's shield absorbs physical damage, a Veil Amulet's magical damage, from the start of
     the fight (2% of her max HP a grade each).
   - **Damage cuts:** an Iron Talisman cuts the physical damage she takes, a Ward Amulet the magical (1.5% a grade).
   - **Returned damage:** a Thorn Talisman returns physical damage she takes to its attacker, a Mirror Amulet magical
     damage (5% a grade). Guarding, she returns her share of the whole hit she intercepts (v15).
   - **Drain:** a Vampire Talisman heals her by the physical damage she deals (2% a grade); a Siphon Amulet restores
     MP from the magical damage she deals (0.8% a grade).
   - **Each round's end:** a Vital Talisman heals 1% of her max HP a grade, a Spring Amulet restores 1 MP a grade.
   - **Older fights:** to v14 Thorn and Mirror were 3% a grade and returned the half she took, Siphon 0.5% and Vital
     0.5%; before v12 the effects were a fifth to a third of those and Regen and shields were flat; before v11 a Barrier
     from physical armor took any damage, and magical armor gave Regen (D104).

Where the stats come from (`projectRpgStats` in `rpg/rules.ts`):

| Stat | From the outfit's projected stats (base ÷ 5 + 1.5 × (1 + growth) per level) | Then |
|---|---|---|
| HP | 100 + 5 × Stamina + 2 × Power + Guts (v15, C1; to v14 without Guts) | × class lean, + Extra Stats and armor |
| MP | 20 + 1.5 × Wit | × class lean, … |
| ATK / MATK | Speed | × class lean, … |
| DEF | Power | × class lean, … |
| MDEF | (Power + Wit) ÷ 2 | × class lean, … |
| Initiative | Stamina | Foes act by initiative; Umas act in the order you choose |
| Healing scale (v15) | A Paladin's ATK, a Cleric's M.ATK; anyone else's higher (base, Extra Stats and armor, not Might) | Her mends, Barriers and revives ×(1 + it ÷ 300). To v14 it was Heal, from Guts × the class's heal lean |

Each Extra Stats or armor point adds a flat +1 to its stat (+5 HP). An Extra Stats node is worth its grade (D141): moon
7 gives 7 points. Speed points give 0.6% evasion each, and Limit points a head start on the gauge
([loops](loops.md#extra-stats-and-gear)). An average Uma's ATK is about 22 at Lv 1 and 111 at Lv 50, before gear and
Extra Stats; HP about 276 and 928.

### Where damage comes from

Measured on the balance simulation's on-curve Brawler at each level (D142, D143), on her Greatsword hits, which her
Orb strengthens. Offense adds up; a hit doesn't, since it is offense² ÷ (offense + defense), so each source is shown as
what her hit loses without it (the others kept), and all four against her level stat alone. Skill depth, opened by
Class Rank, multiplies whatever offense she has.

<!-- live:damage-sources -->
| Level | Gear grade, skill depth | Uma stats (level) | Extra Stats | Weapon Might | Orb | Armor | Offense | Hit without Extra Stats | Hit without the weapon | Hit without the Orb | Hit without armor | All four vs her stats alone | Skill depth vs depth 1 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Lv 1 | G1, 1 | 24 (75%) | 1 (3%) | 1 (3%) | 1 (3%) | 5 (16%) | 32 | −4% | −4% | −4% | −21% | ×1.49 | ×1.00 |
| Lv 10 | G2, 2 | 41 (75%) | 3 (5%) | 4 (7%) | 2 (4%) | 5 (9%) | 55 | −7% | −10% | −5% | −12% | ×1.51 | ×1.38 |
| Lv 25 | G5, 3 | 68 (54%) | 15 (12%) | 19 (15%) | 10 (8%) | 15 (12%) | 127 | −16% | −20% | −11% | −16% | ×2.43 | ×1.81 |
| Lv 40 | G8, 5 | 95 (44%) | 35 (16%) | 45 (21%) | 23 (11%) | 20 (9%) | 218 | −22% | −28% | −14% | −13% | ×3.46 | ×2.87 |
| Lv 50 | G10, 5 | 113 (39%) | 52 (18%) | 68 (23%) | 34 (12%) | 25 (9%) | 292 | −25% | −32% | −16% | −12% | ×4.33 | ×2.87 |

A regular foe's 100% physical hit, as a share of her HP:

| Level | Uma stats only | + Extra Stats (HP, DEF) | + armor (HP, DEF) | All (on curve) | With an Iron Talisman |
|---|---|---|---|---|---|
| Lv 1 | 16% | 15% | 15% | 14% | 14% |
| Lv 10 | 22% | 21% | 20% | 19% | 19% |
| Lv 25 | 23% | 20% | 21% | 18% | 17% |
| Lv 40 | 27% | 21% | 24% | 19% | 17% |
| Lv 50 | 31% | 23% | 27% | 20% | 17% |

The Brawler leans ATK ×1.1 and DEF ×1.1; her on-curve nodes go to ATK, HP, DEF and M.DEF in turn, and she wears her standard preset's Greatsword Orb (its offense on her Greatsword hits) and Vampire Talisman; the last column puts an Iron Talisman in her Support slot.
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
- **The ward (v14, the Rift):** an Iron or Arcane front foe wards one channel, elements on the Iron front and Arms kinds
  on the Arcane ([the Rift](../design/rift.md) §5). An Uma's hit of the warded channel deals ×0.5 again, on top of the
  unbroken halving: a quarter of a Broken hit while her shield stands, and still half once she's Broken. `pierce`
  skips the unbroken halving, not the ward. Foes' hits are never warded. Auto weighs it: a skill or Attack loses half
  the share of its power in the warded channel, so the party reaches for the other channel first. It's a trait of the
  foe, not the Ward status below. On screen (H50): a warded foe carries her front's crest beside her element (Iron's
  for elements, Arcane's for Arms), the hit line reads "· warded", and foe lists show "Wards Tomes" or "Wards Arms".
- Elements beat each other in a ring and a pair: **Fire > Ice > Lightning > Fire**, and **Light ⇄ Dark**. A dual-element
  foe is weak to what beats either element, minus her own; a light+dark foe answers to weapons only.

## Statuses

| Status | Who puts it on | Effect per stack (cap 3, 2 rounds unless stated) |
|---|---|---|
| Armor Break | Paladin and Cleric Greatsword skills, on the foe hit | +10% physical damage taken |
| Mind Break | Paladin and Cleric Lance skills | +10% magical damage taken |
| Enfeeble | Paladin and Cleric Axe skills (a Paladin's on every foe from depth 4) | −10% damage dealt |
| Shatter | Paladin and Cleric Bow skills | Removes shield points at once |
| Hex | Paladin and Cleric Katana skills | Weak to Light and Dark while it lasts (doesn't stack) |
| Brave | Paladin and Cleric Fire Tome skills, on every Uma | +10% physical damage dealt |
| Faith | Paladin and Cleric Light Tome skills | +10% magical damage dealt |
| Aegis | Paladin and Cleric Blizzard Tome skills; a Paladin's Greatsword blows, on each Uma their Barrier reaches | −10% damage taken |
| Breaker | Paladin and Cleric Thunder Tome skills | A charge: her next weak hit removes two shield points |
| Clarity | Paladin and Cleric Dark Tome skills | Restores 4% of max MP |
| Burn | Foes (fire storms) | Loses 4% of max HP at the end of each round |
| Mark | Foes (skirmishers) | +10% damage taken |
| Weaken, Slow | Foes | −15% damage dealt |
| Power-up | Foes (captains) | +15% damage dealt |
| Ward | Foes (champions) | −15% damage taken |

A healer's depth-5 skills put their status on every foe, or on every Uma. Some Brawler and Mage side skills also
add riders (a status on each foe hit) or Barriers; their rows in [skill trees](skill-trees.md) say so.

Battle badges show the published status glyph and its stack count, with the full name in the accessible label.
Statuses without glyphs (including Burn and foes' Power-up) keep text badges. Skill descriptions keep full names
beside decorative glyphs; Shatter and Clarity act immediately, so they do not create lingering badges.

## Support

The party's defensive half is its one healer, a Paladin or a Cleric (v15, classes v2 §3.3, §4; v12's support, D141,
doubled). Brawler, Mage, Spell Blade and Summoner deal damage only. Every support comes after the skill's hits.

| Support | Who | What it does |
|---|---|---|
| **Mend** | Paladin and Cleric Tome skills (the most hurt Uma; every Uma at depth 5) | Heals a share of the target's max HP by depth: 28%, 32%, 36%, 40%, 44%; on every Uma ×0.4 |
| **Barrier** | Paladin and Cleric Arms skills (the Uma the shown moves threaten most; every Uma at depth 5); a Paladin's Blizzard spells (every Uma, at half the share) | Absorbs any damage first, the same shares, until the end of the round. Cap 60% of max HP |
| **Cleanse** | Paladin and Cleric Tome skills | Removes one foe-made status (Burn, Mark, Weaken, Slow) from each Uma |
| **Revive** | The Cleric's Rebirth (Light tree, depth-3 side B); the Paladin's Valkyrie's Oath (Lance tree, depth-4 side B) | Raises the first fallen Uma at 25% of her HP, once per Uma per fight |
| **Regen** | Cleric Light spells | Her spell's mend again at ×0.2, at the end of its round and of the next ("Regen" on screen). Her next Light spell replaces it; it ends if she falls |
| **Drain** | Cleric Dark spells | 30% of the damage its hits deal heals the most hurt Uma |
| **Aegis** | Paladin Greatsword blows | Aegis 1 on each Uma their Barrier reaches |

- **Her healing scale:** every mend, Barrier and revive ×(1 + offense ÷ 300), offense being a Paladin's ATK and a
  Cleric's M.ATK (anyone else's higher, for a Limit Break's). An on-curve Lv 50 healer is about ×1.6. Her battle sheet
  shows it ("Mends ×1.62 (from ATK)").
- **One healer a party:** a party with two Paladins or Clerics, or one of each, can't start a fight
  ([classes](classes.md#the-six-classes)).
- **Older fights:** v12–v14 fights replay with the Cleric and the Summoner sharing the support at half these shares
  (14–22%) under a 40% cap, raised by Heal (Guts × the class's heal lean): the Summoner's Blizzard summons Barriered
  every Uma (×0.35), her Light summons mended every Uma and again each round while one lingered, her Dark summons
  drained, her Greatsword knights gave Aegis, her Axe brutes Enfeebled every foe hit and her Valkyries revived.
- **Rally:** 30% of the last foe hit an Uma took (after Barriers) shows grey on her HP bar. If the party Breaks or
  defeats that foe before the foe moves again, the Uma wins it back.

## Charged moves (v12)

Sub-bosses and Bosses carry a charged move (D141): the captain's Execution (on the weakest) and Cataclysm (everyone,
below half HP), the champion's Cataclysm and Apocalypse (below half HP).

- **Announced a round early:** her intent reads "Charging: …" and her panel shows its **locks**, two to four kinds
  drawn from her weaknesses. The splash cuts in as she gathers.
- **Locks:** every hit of a lock's kind breaks one (to v14 an Orb's kind counted too). The move lands the next round
  at its power × the locks left ÷ all of them.
- **Cancelled** when every lock breaks or when she is Broken; the splash cuts in again with "Cancelled!".
- She doesn't charge two rounds running, and a foe that acts twice (or three times) charges only with her first move.
- **Mixed locks (v14, the Rift's Duel front):** when she is weak to an Arms kind and an element, her locks alternate, an
  Arms kind first (Arms, element, Arms, …), so a set always needs both channels. Weak to one channel only, she draws as
  any foe.

## Limit Breaks

<!-- live:limits -->
**Limit Breaks come only from the Halls of Heroes** (D112, engine v10). A Hero always uses her seat's, at 100%; a Learner uses either of her Heroes', at 50% plus 5% a Bond Level (100% at Bond 10), her inherited hits at the higher of her ATK and M.ATK while their kinds still decide weaknesses and locks (v15, C3). An Uma who is neither has none, and her gauge has nothing to spend. At 100% a Limit Break is worth her class's power below, in single-target casts at her open depth:

| Class | Limit Break power |
|---|---|
| Brawler | 2× |
| Mage | 2.4× |
| Spell Blade | 2.2× |
| Cleric | 1.5× |
| Summoner | 2.2× |
| Paladin | 1.5× |

A Limit Break that mends or raises a Barrier does it at 66% of each Uma's max HP ×0.4, × her healing scale and the cast's strength; its cleanse and its revive land at any strength. The gauge fills to 12: +2 for an Attack, +4 for a skill. A Limit Break costs no MP and takes her turn. Fights from engines v10–v14 replay with five halls' twenty: the Cleric Chapel's seats 3 and 4 Archangel’s Verdict and Archdemon’s Pact, Sunfire Edge in one cleave, Moon Fox on one foe, the Spell Blade at 2× and the Summoner at 1.8×, and a Learner's hits at each kind's own offense. Fights from engines v6–v9 replay with the classes' retired Limit Breaks: Brawler Twin Strike: one equipped skill cast twice at full power, or two Attacks with a weapon; Mage Prismatic Nova: a hit of each of the five elements, 2.4× her open depth's power in all; Spell Blade Twin Arts: an Arms skill and a Tome skill, both at full power (no half); Cleric Divine Patrons: a hit with each of her five weapons (1.5× in all), each status at 3 stacks; Summoner Grand Summon: one summon at twice her strength that lingers at twice its share.
<!-- /live -->

The 24 Limit Breaks themselves, and how Heroes and Learners earn them, are in [Halls of Heroes](heroes.md).

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
carries over. From tier Lv 10 a lone region boss and an elite's sub-boss act twice (D141). The Rift's Duel champion
**acts three times** a round (v14): her second move comes with every foe's second and her third after them all, and
neither starts a charge. A foe's level is lifetime (Tier 2 Lv 1 is 51), and so is the reference stat her HP and defense
grow from, but the build budget, the hit-share ramp and the world's per-level HP step restart at each tier's Lv 1, as a
freshly ascended party's build does (D170). Foe faces come from the region's franchise and each slot's tier, from a
private file; see [maps](maps.md#faces).

### Splash cut-ins

Key enemies, Sub-bosses and Bosses have a 16:9 splash (D135). It cuts in across the rivals' half of the stage:
- on her first move of each round;
- when she's broken, after the BREAK;
- when she changes tactics at half HP;
- when she's defeated, fading to grey.

Each cut-in shows her art sweeping in from the right, a stripe in her tier's colour (Key enemies teal, Sub-bosses
violet, Bosses red) and a caption: her move, BREAK!, Changes tactics! or DEFEATED. It holds for about 1.5 s,
zooming in slowly; 2× and 4× shorten it to about 1.1 s and 0.75 s.
- **Skipping:** tapping the stage skips it, like any playback, and the speed setting shortens it.
- **Reduced motion:** with reduced motion on, cut-ins don't play.
- **Regulars:** Regular foes have no splash.

The engine announces each foe move with a `move` cue. Cues are presentation only and never saved, so fights replay
unchanged.

<!-- live:foe-scaling -->
| Setting | Value |
|---|---|
| HP | (40 + 4.2 × reference stat) × role × rank; the reference stat is an average Uma's at the foe's lifetime level |
| Offense | Set so a 100% hit takes a share of an average Uma's HP at her level (20% at tier Lv 1, 28% from tier Lv 10), × the offense budget, × role |
| Sub-boss and boss HP | ×3.5 and ×5.5, times the party's reachable skill depth |
| Build budget | What a built party's gear and Extra Stats call for, by tier level ℓ: HP and defense ×(1 + 0.035 × (ℓ − 1)² ÷ 49), ×2.72 at Lv 50; offense ×1.49 at Lv 50. It restarts at each tier's Lv 1; its build part scales by her stats' growth: ×1.96 HP and defense, ×1.27 offense at Tier 2 Lv 50 |
| World: regular foes | +3.5% HP per tier level |
| World: elites | +0% HP per tier level |
| World: region bosses | ×0.5 a champion's HP |
| Acting twice | From tier Lv 10: a lone region boss and an elite's sub-boss; a lone elite always |
| Formations | A foe's offense is the square root of her HP share against a pair's foe, at most a full foe's |
| Shields | Regular 2 (by formation), sub-boss 6, boss 8 |
<!-- /live -->

## The Rift's foes

The Rift's fights are generated and none is on the world map ([the Rift](../design/rift.md) §5–§9, D173). A run has
four fronts of twelve stages and the Convergence's four fights; the twelve Echoes stand apart. Each fight is built from
its front, its stage and the run. A retry meets the same foes, weaknesses and faces with a fresh seed.

**The fronts.** Weaknesses come from the front, never the face. A charged move draws its locks from them, so locks are
always the front's kinds.
- **Iron:** weak to Arms only. Its foes **ward** elements: an Uma's magical hits deal ×0.5 again, Broken or not (v14).
- **Arcane:** weak to elements only, warding Arms.
- **Duel:** one boss weak to both. She acts twice, three times at the champion, and her lock sets are mixed (Arms,
  element, Arms…).
- **Horde:** three waves of 4 to 6 foes, each weak to one Arms kind and one element, no two foes of a wave alike.
- Each foe's own element, the one her moves carry, is one she isn't weak to.
- **The Duel's guard rail** ([classes v2](../design/classes-v2.md) §3.1, H51, D176, H60, D186): no single act Breaks a
  Duel boss. Each class's own best act removes 11 shield points (the Spell Blade's Bow flurry with its extra hit and a
  Light flurry; the Summoner's farewell and two summons), and the best Limit Break 12 (Chaos Rain, twelve weak hits,
  one any Uma can learn), so her shields start at 13.
- **Classes v2's guidance and numbers:** each front's guided party and its foes' shields and strength are classes v2's
  since H61 (below; [the Rift](../design/rift.md) §5, §11). A Rift fight left open from before keeps its own foes.
- **On screen she reads as her face** (H50): a boss- or sub-boss-faced foe stands at that size on the stage and is
  tagged Boss or Elite in lists, whatever her rank, so the Horde's regular-rank leaders still look like leaders. A
  champion who acts three times says so ("Acts three times").

<!-- live:rift-fronts -->
| Front | Weak to | Ward | Stages 1–4 | 5–8 | 9–11 | Champion (12) | Party |
|---|---|---|---|---|---|---|---|
| Iron | Arms only: 1 for a key, regular, sub-boss or boss; a champion pair's differ | Elements ×0.5 | A sub-boss (acts 2, shield 16) + a key guard (shield 8) | 5, 7: 2 sub-bosses (shield 16); 6, 8: a boss (acts 2, shield 16) + a sub-boss-faced guard (shield 12) | Waves 1–2: a sub-boss-faced foe (shield 12); wave 3: a boss (acts 2, shield 16) + a sub-boss-faced guard (shield 12) | 2 bosses from two packs (shield 16) | 2 Brawler, 2 Spell Blade, Paladin |
| Arcane | Elements only: 2 for a key, regular or sub-boss, 1 for a boss; a champion pair's differ | Arms ×0.5 | A sub-boss (acts 2, shield 16) + a key guard (shield 8) | 5, 7: 2 sub-bosses (shield 16); 6, 8: a boss (acts 2, shield 16) + a sub-boss-faced guard (shield 12) | Waves 1–2: a sub-boss-faced foe (shield 12); wave 3: a boss (acts 2, shield 16) + a sub-boss-faced guard (shield 12) | 2 bosses from two packs (shield 16) | 2 Mage, 2 Summoner, Cleric |
| Duel | Arms (2 at stages 1–6, 1 at stages 7–12) and elements (2 at stages 1–6, 1 at stages 7–12); locks mixed | — | A boss (acts 2, shield 13) | A boss (acts 2, shield 14) | A boss (acts 2, shield 15) | A boss (acts 3, shield 15) | 2 Brawler, 2 Mage, Paladin |
| Horde | One Arms kind and one element each, no two foes of a wave alike | — | Waves 1–2: a sub-boss-faced leader (shield 6) + 3 key foes (shield 3); wave 3: a boss-faced leader (shield 6) + 3 key foes (shield 3) | Waves 1–2: a sub-boss-faced leader (shield 6) + 4 key foes (shield 3); wave 3: a boss-faced leader (shield 6) + 4 key foes (shield 3) | Waves 1–2: a sub-boss-faced leader (shield 6) + 5 key foes (shield 3); wave 3: a boss-faced leader (shield 6) + 5 key foes (shield 3) | Waves 1–2: a sub-boss-faced leader (shield 6) + 5 key foes (shield 3); wave 3: 2 boss-faced leaders from two packs (shield 6) + 4 key foes (shield 3) | 2 Spell Blade, 2 Summoner, Cleric |

Front and Convergence foes stand at tier Lv 50. Strength multiplies HP, ATK and M.ATK: stage n ×(1 + 0.1 × (n − 1) ÷ 11), ×1.1 at the champion; a Convergence fight is its front's champion at ×0.902. An Echo is its front's stage 8 at tier Lv 45 or 50 (×1); Lv 55 is the Lv 50 one at ×1.22. Sub-bosses and bosses take the party's reachable skill depth, regular foes the world's regular-foe HP step; every Horde foe is regular rank. Rift foes hit harder than the world's: offense ×1.8 at stages 1–4, ×1.6 for stages 5 and 7's sub-bosses, ×1.3 for a boss and her guard, ×1.2 for an opening foe, ×2.2 for a champion, ×2.3 on the Duel (her HP ×1.1) and ×4.4 on the Horde. Arcane's foes have ×1.2 HP and ×1.1 offense over Iron's. Champions, and so the Convergence's fights, scale again by front: Iron ×1.2 HP and offense, Arcane ×0.92 offense, Horde ×1.05 HP and offense. A run's 52 fights hold 46 boss, 64 sub-boss and 165 key face slots.
<!-- /live -->

**Levels.** The level a Rift fight shows is a tier level: 50 for the fronts and the Convergence, and 45, 50 or 55 for an
Echo. Its foes' own levels are lifetime (Tier 2's Lv 50 is 100). A tier stops at Lv 50, so the Lv 55 Echo is the Lv 50
one made stronger.

**The Convergence and the Echoes.** Convergence fight i is front i's champion (Iron, Arcane, Duel, Horde), stronger
again, with its own faces and weaknesses. An Echo is its front's stage 8 at its level; Echoes don't belong to a run.

**Faces** come from all three packs, one allocation per run (`rift/picker.ts`):
- Azur Lane, NIKKE and PriConne take about 40 / 37 / 23 of each face tier's slots, by a smooth round-robin;
- faces the account hadn't defeated when the run started come first (`account.defeated`, Rift fights only, D171);
- no face repeats in a run while unused ones of its tier remain, and never within a fight;
- a champion pair's two bosses come from two packs;
- an Echo's faces are its own and never move as the Bestiary fills.

## Rewards

A win pays every entrant, including those knocked out: EXP, Laurels, rank EXP, and Uma Shards at milestone levels. A loss or
giving up pays nothing and leaves MP as it was before the fight. Numbers are in [loops](loops.md#laurels-exp-and-tokens).

## Constants

<!-- live:battle-constants -->
| Constant | Value | Meaning |
|---|---|---|
| `BATTLE_WEAK` | 1.3 | Damage multiplier of a weak hit |
| `BATTLE_UNBROKEN_FACTOR` | 0.5 | Damage a foe takes while its shield stands |
| `BATTLE_WARD_FACTOR` | 0.5 | v14: damage a Rift foe takes from the channel she wards, on top of the unbroken halving |
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
| `BATTLE_COVER_CAP` | 0.4 | v12–v14: a skill Barrier's cap, as a share of max HP; it lasts the round |
| `BATTLE_COVER_CAP_V15` | 0.6 | v15: the same cap, for one healer's doubled Barriers |
| `RPG_SUPPORT_SHARE` | 0.14, 0.16, 0.18, 0.2, 0.22 | v12–v14: a mend's or Barrier's share of the target's max HP, by depth |
| `RPG_SUPPORT_SHARE_V15` | 0.28, 0.32, 0.36, 0.4, 0.44 | v15: the same shares for the Paladin and the Cleric, doubled (one healer a party) |
| `RPG_SUPPORT_ALL` | 0.4 | v12: that share on every Uma, at depth 5, for summons (to v14) and Limit Breaks (v15) |
| `BATTLE_HEAL_SCALE` | 300 | v12–v14: her Heal raises mends and Barriers ×(1 + Heal ÷ this) |
| `BATTLE_HEAL_OFFENSE_SCALE` | 300 | v15: mends, Barriers and revives ×(1 + offense ÷ this): a Paladin's ATK, a Cleric's M.ATK, anyone else's higher |
| `BATTLE_REVIVE_SHARE` | 0.25 | v12: a revive's share of max HP, before her healing scale |
| `RPG_PALADIN_SHIELD_SHARE` | 0.5 | v15: a Paladin's Blizzard spell also Barriers every Uma at this share of its share (×0.4 on every Uma) |
| `RPG_PALADIN_AEGIS` | 1 | v15: Aegis stacks a Paladin's Greatsword blow gives each Uma her Barrier reaches |
| `BATTLE_REGEN_SHARE` | 0.2 | v15: a Cleric's Regen mends this share of her Light spell's mend |
| `BATTLE_REGEN_ROUNDS` | 2 | v15: the round ends a Regen mends at: the spell's round and the next |
| `BATTLE_FAREWELL_FACTOR` | 0.1 | v15: a lingering Tome summon's farewell strike on each foe, × its linger share × its hits' power |
| `HERO_LIMIT_SUPPORT_SHARE` | 0.66 | v15: a hall Limit Break's mend or Barrier, as a share of max HP, ×0.4 on every Uma |
| `BATTLE_RALLY_SHARE` | 0.3 | v12: share of a foe hit she can Rally back |
| `BATTLE_BREATHER` | 0.1 | v12: share of max HP every Uma recovers when a new wave enters |
| `BATTLE_LIMIT_MAX` | 12 | Limit Break gauge |
<!-- /live -->
