# Weapon arts and armor sets

> **Proposal, 2026-10-21, for the owner to decide; not built.**
> - Tier 2 content under [tiers](tiers.md) Option A (D159, T6), the doc its §8 item 5 asks for. Its siblings:
>   [Tier 2's advanced classes](tier2-classes.md) (H39), [the outer ring](extra-stats-tier2.md) (H41),
>   [the second profession](second-profession.md) (H42) and [Tier 2's world](tier2-world.md) (H43).
> - It builds on [classes v2](classes-v2.md) (D160, engine v14) and [the Rift](rift.md) (D161). Neither is built yet.
> - **Engine v15**, shared with [H39](tier2-classes.md), with H39's shared cap on extra shield points (§4.6). Arts and
>   set steps spend H42's Scrolls and Seals (§10.4).
> - **Owner calls** are marked **E1**, **E2** and so on, each with a recommendation. [§13](#13-owner-calls) lists them.
> - **Every number is a draft** for the balance simulation (`SIM=1`).

## 1. What the owner asked for

- **Depth that grows by tier, not a new battle system per tier** ([tiers](tiers.md) §1). Of weapons: "weapons are
  streamlined first and gain trees later".
- **Option A's table** (T6) spells it out:

  | Row | Tier 1 | Tier 2 | Tier 3 |
  |---|---|---|---|
  | Weapons | A weapon is its tree and its Might, nothing else | **Weapon arts:** each weapon kind gets a small three-node tree, opened by Weapon Rank, that changes its shape (one more hit, a wider area share, Break +1 shield) | **Awakening:** a grade-10 weapon takes one awakened effect |
  | Armor | Physical or magical per slot | The same, plus **set bonuses** for a full physical or full magical suit | Unchanged |
  | Professions | Craft Level | A second vertical (Q7), its families **feeding the weapon arts and set bonuses** | Its own doc |
  | The Rift | Tier 1's | **Harder fronts that test weapon arts** and the outer ring | Tier 3's |

- **The Persona lesson.** uma-racer tried weakness → One More → All-Out loops (its D261) and removed them a day later
  (D265): the loops were boring and boss shields had no strategy. Octopath's shields and Breaks have held since. An art
  changes a weapon's shape inside those rules. It never adds an act, a "one more" or a loop.

## 2. Today

### 2.1 The ten weapons and their shapes

Each Arm and its element share a shape (D86, `RPG_KIND_PAIRS`). Hits are the core skill's at depths 1–5. Classes v2's
columns are approved, not built.

| Weapon (kind) | Shape | Brawler (Arms) or Mage (Tomes) | Spell Blade (v14) | Summoner (v14), on arrival | Paladin, Cleric (v14) |
|---|---|---|---|---|---|
| Greatsword | One foe, heavy | One foe, 1·1·2·2·3 hits | One foe, 1·1·1·2·2 | One foe, 1·1·2·2·3 | One foe, 1 hit |
| Axe | Every foe | Every foe at 0.55, 1·1·2·2·3 | One foe, 1·1·2·2·2 | Every foe, 1·1·2·2·3 | One foe, 1 hit |
| Lance | Random foes | Random, 2·2·4·4·6 at ×1.05 | One foe, 2·2·2·3·3 | Random, 2·2·3·3·4 | One foe, 1 hit |
| Bow | One foe, many hits | One foe, 2·2·4·4·6 | One foe, 2·2·3·3·4 | One foe, 2·2·3·3·4 | One foe, 1 hit |
| Katana | Twice | One foe, 2 (side B: 2, then 2 on another) | One foe, 2 | One foe, 2 | One foe, 1 hit |
| Fire Tome | One foe, heavy | One foe, 1 | One foe, 1·1·1·2·2 | One foe, 1·1·2·2·3 | One foe, 1 hit |
| Blizzard Tome | Every foe | Every foe at 0.55, 1·1·1·1·2 | One foe, 1·1·2·2·2 | Every foe, 1·2·2·3·3 | One foe, 1 hit |
| Thunder Tome | Random foes | Random, 2·2·3·3·4 | One foe, 2·2·2·3·3 | Random, 2·2·3·3·4 | One foe, 1 hit |
| Light Tome | One foe, many hits | One foe, 2·2·4·4·6 | One foe, 2·2·3·3·4 | One foe, 2·2·3·3·4 | One foe, 1 hit |
| Dark Tome | Twice | One foe, 2 | One foe, 2 | One foe, 2 | One foe, 1 hit |

- **Hands (v14):**
  - Brawler and Mage ×1.
  - Spell Blade: an Arms half ×0.63 that gains one extra hit, its power split evenly (an Attack lands as two, a skill
    of n hits as n + 1; classes v2 §3.1), and a Tome half ×0.27. The table gives her skills' own hits, before that one.
  - Summoner: a Tome summon ×0.63, whose farewell strike reaches every foe at ×0.3, and an Arms summon ×0.27.
  - Paladin and Cleric: ×0.5, plus support.
- **Side skills reshape some of these.** A Mage's Fire Wave reaches every foe. Her Spike and Bolt sides hit one foe.
- **The Attack** is one hit on one foe, at power 1.0 × her hand, with any of her weapons.
- **Shape constants** live in `catalog.ts`:
  - `RPG_AOE_SHARE` 0.55 is baked into every-foe powers;
  - `RPG_RANDOM_BONUS` 1.05 into random-foe powers.

### 2.2 Might, Weapon Rank, armor, accessories

**Might** (D142, D143) adds to the offense of the weapon's own hits:

| Grade | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 |
|---|---|---|---|---|---|---|---|---|---|---|
| Might | 1 | 4 | 8 | 12 | 19 | 26 | 35 | 45 | 57 | 68 |
| Orb, v14 (half of Might) | 1 | 2 | 4 | 6 | 10 | 13 | 18 | 23 | 29 | 34 |

**Weapon Rank** (D102):
- 1–10, per weapon, shared by every class.
- A win worth E pays 5E over her five slotted weapons, double for each one she used.
- Rank k → k + 1 takes what Uma Lv 5k − 4 to 5k + 1 takes. A weapon used every fight reaches rank k at Lv 5k − 4:
  **rank 4 at about Lv 16, rank 8 at about Lv 36**, rank 10 at Lv 46.
- The Rift's Echoes pay gear ranks at 2× (R6).
- Ranks reset to 1 at promotion (D159 §5).

**Armor** (D124, D143):
- Five slots: head, body, legs, arms and feet. Each holds its physical or its magical piece.
- Each piece gives ATK (physical) or M.ATK (magical) +⌈g ÷ 2⌉, and its slot's stat +2 a grade: head DEF, body HP,
  legs MP, arms M.DEF, feet Speed.
- Armor Rank is per kind: E a win to each of her five kinds, so a suit reaches grade 4 near Lv 16, 7 near Lv 31 and
  10 near Lv 46.
- Classes v2 §7 starts Mage, Summoner and Cleric in magical armor, the rest in physical.

**Accessories after classes v2** (§6):
- One damage slot holds an Orb: flat offense to one kind's hits, half a weapon's Might.
- One support slot holds a Talisman or an Amulet: one defensive effect.
- An Orb no longer adds its kind for weaknesses or locks.

**The outer ring, as approved** (T6): a Tier 2 Extra Stats ring with one node pair per damage kind, +% damage of that
kind, opened with Tier 2 Star Gems. [H41](extra-stats-tier2.md) designs it as **the Halo**, and its X3 recommends flat
values instead: half a weapon's Might at the node's grade, as an Orb gives.

### 2.3 Built and approved

| | State |
|---|---|
| **Engine v13** (built) | Five classes. Might by grade. Armor offense from grade 1. Two accessory slots, any types. Orbs add their kind for weaknesses |
| **Engine v14** (approved, D160) | Six classes. The Spell Blade's extra Arms hit and the Summoner's mirrored pair with farewell areas. Healers' ATK and M.ATK scaling. Flat Orbs in a typed slot. Guts into HP. The Rift's ward |
| **Engine v15** (this doc and H39) | Weapon arts and set bonuses. Advanced class passives and skill MP ×1.7 in Tier 2 (H39, A10) |

## 3. One job per lever

Tier 2 stacks several new levers on Tier 1's. Each has one job, so no two do the same thing.

| Lever | Its job | Grows with | Never | Where |
|---|---|---|---|---|
| **Might** | Flat offense on the weapon's own hits | Weapon grade | Shape, kinds | Built (D142, D143) |
| **Orbs** | Flat offense on one kind's hits | Orb grade | % damage, kinds | [Classes v2](classes-v2.md) §6.2 |
| **The outer ring, the Halo** | One kind's damage, from Extra Stats: flat offense by H41's X3 (or % damage, as T6 drafted) | Tier 2 Star Gems | Kinds | [H41](extra-stats-tier2.md) |
| **Weapon arts** | **Shape**: hits, targets, area share, chips, splash | Weapon Rank and one Scroll a node | % damage, flat offense, kinds, acts | This doc (§4–§5) |
| **Set bonuses** | **Sustain**: max HP or skill MP | The suit's lowest grade and one Seal a step | Damage | This doc (§7, E8) |
| **Support accessories** | One defensive effect each | Grade | Damage | [Classes v2](classes-v2.md) §6.3 |
| **Advanced class passives** | The class's identity | Her class | An act, a refund, a longer Break | [H39](tier2-classes.md) |

## 4. The art tree

**Settled before this doc** (D159 and the packet). Not reopened here:
- **Where:** arts and set bonuses exist in Tier 2 and later worlds only. A Tier 1 weapon stays its tree and its Might.
- **Per weapon, not per class:** Weapon Rank is shared by every class, so an art works in every class that wields its
  weapon.
- **What an art changes:** shape only: hits, targets, area share, shield chips and splash. It never adds:
  - a % damage bonus (T6 drafted it as the outer ring's job);
  - flat offense (Might's, the Orbs' and, by H41's X3, the ring's);
  - a damage kind (weakness coverage stays a party puzzle, D160 §6.2);
  - an act.
- **Ranks:** Weapon Ranks stay 1–10 and reset at promotion (D159 §5).
- **Tier 3's awakening** is named only (§9).

### 4.1 Shape (E1)

Three nodes a weapon, like one depth of a skill tree:

| Node | Opens at | What it is |
|---|---|---|
| **Core** | Weapon Rank 4 | Always on once learned. It sharpens the weapon's own shape |
| **A, damage** | Weapon Rank 8 | More damage, through reach or through the Break window |
| **B, Breaks** | Weapon Rank 8 | Break +1: one more shield point an act, aimed by the shape. No damage |

**The grammar:**
- **A core** is worth about +7% of what its shape does. It adds no hit on the tapped foe's standing shield, so it never
  competes with B for that foe's cap (§4.6).
- **An A side** adds damage:
  - by reach: a splash, or a cross hit on another foe;
  - or in the Break window: a follow-up, a wider share or random hits drawn to Broken foes.
- **A B side** is always Break +1. Only its aim changes with the shape.

So on a lone foe, B Breaks her sooner and A hits harder once she's Broken. On a crowd, A spreads damage and B finishes
one Break.

| Option | For | Against |
|---|---|---|
| **A core and an A/B fork** (recommended) | One choice a weapon, read in a line. The grammar a skill depth already teaches | — |
| A chain of three that all stack | No choice to get wrong | Three nodes always on: more power and no decision, so a re-spec between Rift fronts changes nothing |
| Three nodes, one active | The most choice | No shared core, so a wrong pick gains nothing. Three times the Auto cases |

**E1, the tree's shape?** Recommendation: **a free core and an A/B fork.** "Free" means no pick: the core is always on.
It still costs its item (E4).

### 4.2 Gates (E2)

- **The core opens at Weapon Rank 4, the fork at Weapon Rank 8.** Used every fight, that's about Lv 16 and Lv 36 in her
  Tier 2 world, since ranks restart at promotion.
- **Both come well before the Rift at Lv 50.** Rank 10 stays what it is: the grade-10 gate.
- **Weapons she slots but rarely uses lag:** they take one part of 5E, not two. An Uma who switches class for a Rift
  front catches up in the Echoes at 2×. A fresh weapon reaches rank 8 in about 15 Echo wins (draft).

**E2, the gates?** Recommendation: **the core at Weapon Rank 4, the fork at Weapon Rank 8.** The alternative, 5 and 10,
leaves the fork for the tier's last levels.

### 4.3 Choosing and swapping (E3)

- **One setting per weapon, shared by every class she plays.** Her Axe's fork side is the same as a Brawler and as a
  Spell Blade.
- **The side swaps freely outside a fight,** from the weapon's sheet, as side skills do. Between Rift fights that's
  part of the "different skill allocations" the owner asked for.
- **Per-class sides would be more flexible,** but the art belongs to the weapon, as its rank does, and one setting a
  weapon reads at a glance.

**E3, choosing and swapping?** Recommendation: **per weapon, shared by every class; the fork side swaps freely
outside a fight.**

### 4.4 What a node costs (E4)

- **Weapon Rank opens a node. She learns it once,** with one Scroll from Lore, the second profession
  ([H42](second-profession.md) §6), spent from the world's Scrolls & Seals shelf:

  | Node | Arms weapon | Tome | Lore grade |
  |---|---|---|---|
  | Core (Weapon Rank 4) | Arms Scroll I | Spell Scroll I | 1 |
  | Each fork side (Weapon Rank 8) | Arms Scroll II | Spell Scroll II | 3 |

- **The fork needs the core.** She can learn both sides, one Scroll II each, and swaps between learned sides for free.
- **Learned nodes stay hers in that world.** A new world starts empty, because ranks and economy restart.
- **An art belongs to her and the weapon kind, not the piece:** it works with her Training weapon too. Awakening
  (Tier 3) is the one that's per piece.

That is how the second vertical feeds the arts, as tiers.md says. §10.4 has the demand table.

**E4, what learning a node costs?** Recommendation: **Weapon Rank opens it. Each node is learned once per Uma for one
Lore Scroll of its half: Scroll I for a core, Scroll II for a fork side. Swapping is free.**

### 4.5 What an art touches (E5)

| Touches | Doesn't touch |
|---|---|
| Her **Attacks** with that weapon | A Summoner's **farewell strike**: her class's area, not her weapon's (§6) |
| Her **skills** of that weapon's tree, cores and sides, in any class | **Limit Breaks**: her hall's, not her weapon's |
| A Spell Blade's half and a Summoner's summon **on arrival** | **Orbs**: an Axe Orb brings Axe offense, not the Axe's art |
| | **Riders, statuses and support:** a hit an art adds is a plain hit of its kind |

**E5, what an art touches?** Recommendation: **Attacks and skills made with that weapon, in any class, and a summon's
arrival. Not farewell strikes, Limit Breaks or Orbs.**

### 4.6 The chip cap (E6)

**H39's rule, shared:** one extra shield point from a foe in an act, whatever the source ([H39](tier2-classes.md) §3).
- **It covers arts and passives together:**
  - B's +1, and a passive's +1 such as the Blademaster's;
  - any point removed by a hit an art or a passive adds or moves: a splash, a cross hit, Ricochet, the Rune Knight's
    strike.
- **It's counted per foe.** A splash or a cross hit that reaches several foes may take one from each.
- **It's counted per act,** across both halves of a Spell Blade's or a Summoner's pair.
- **Past the cap on a foe,** a hit still deals damage and breaks a lock. It removes no extra point there.
- **B lands on her first weak hit that removes a point,** so B, when picked, takes the tapped foe's one first.
- **Outside the cap,** as H39 says: today's Breaker charge and Shatter.
- **Steel is unchanged.** No art chips a Steeled foe, and a Broken foe has nothing to chip.
- **No art lengthens a Break, skips Steel, refunds the Limit gauge or grants an act.**

**Why per foe, not per Uma, as first drafted:** it's the same on a lone foe, where the Duel is decided. On a crowd it
lets a splash or a cross hit do its job, and each foe still loses at most one extra point an act, which is what the
Horde target needs.

**E6, the cap on Break arts?** Recommendation: **H39's shared cap: arts and passives together remove at most one extra
shield point from a foe in an act. Steel is unchanged.**

## 5. The thirty nodes (E7)

### 5.1 The effects

The thirty nodes use eight effects. Each is one rule in the engine.

| Effect | Rule |
|---|---|
| **Added hit** | A hit an art adds. A plain hit of the weapon's kind, at the stated share of the skill's power (before her hand; per foe for an every-foe skill). It takes her Might and a matching Orb's offense. It can be weak (×1.3), takes the unbroken halving, breaks a lock of its kind and chips under the cap. It carries no rider, status or support |
| **Follow-up** | An added hit on the foe her last hit struck, only if that foe is Broken. So it never chips |
| **Splash** | An added hit on every living foe her hits missed in that cast |
| **Cross hit** | An added hit on one other living foe, picked by the fight's seed, as a Katana's Cross Cut picks today |
| **Wider share** | A raise to the every-foe share of single-target power: × new share ÷ 0.55 |
| **Random bonus** | A raise to the random-foe bonus: × new bonus ÷ 1.05 |
| **Ricochet** | When her foe falls mid-skill, the hits left go on to the living foe with the least HP. Today they stop |
| **Break +1** | Her first weak hit that removes a point removes two. Once an act. It's that foe's one extra point |

In the tables below:
- **P** is the skill's power before her hand, per foe for an every-foe skill.
- **MP:** no node changes MP (recommended): a shape change shouldn't cost a turn's budget.
- **Names** come in pairs, the Arm's · the element's. Each Arm and its element share every number, as they share a
  shape (D86). That keeps the Spell Blade and the Summoner, and the Iron and Arcane fronts, mirrors.

### 5.2 Greatsword · Fire Tome: one foe, heavy

| Node | Names | Effect | Hits | Total power | Share | Chips | Splash | MP |
|---|---|---|---|---|---|---|---|---|
| Core | Follow-through · Afterburn | A follow-up at 20% of its power | +1, on a Broken foe | +0.2 P on a Broken foe | — | None | — | 0 |
| A | Shockwave · Wildfire | A splash at 8% of its power | +1 on each foe it missed | +0.08 P a missed foe | — | Can chip, under the cap | 8% | 0 |
| B | Shieldsplitter · Meltdown | Break +1 on the tapped foe | 0 | 0 | — | +1 | — | 0 |

- **Worth:** the core is about +7–9% (the share of heavy damage that lands in Break windows, draft 35–45%).
- **A** gives nothing on a lone foe, +16% on a boss with two guards and +32% on a wave of five.

### 5.3 Axe · Blizzard Tome: every foe

| Node | Names | Effect | Hits | Total power | Share | Chips | Splash | MP |
|---|---|---|---|---|---|---|---|---|
| Core | Long Haft · Deep Frost | Wider share: +0.05, to 0.6 | 0 | ×1.09 on every-foe hits | 0.6 | None | — | 0 |
| A | Reaver · Permafrost | Wider share on Broken foes: +0.3 more, to 0.9 | 0 | ×1.5 on Broken foes | 0.9 on a Broken foe | None | — | 0 |
| B | Fault Line · Frost Crack | Break +1, on the foe with the fewest points left among those it finds weak | 0 | 0 | — | +1 | — | 0 |

- **Worth:** the core is +9%. A is about +12–17% on a crowd that's being Broken.
- **On one foe:** a Spell Blade's, a healer's or an Attack's Axe and Blizzard hits hit one foe, so only B serves them.
  It's the one they want.

### 5.4 Lance · Thunder Tome: random foes

| Node | Names | Effect | Hits | Total power | Share | Chips | Splash | MP |
|---|---|---|---|---|---|---|---|---|
| Core | Long Reach · Static Field | Random bonus: +0.07, to 1.12 | 0 | ×1.067 on random hits | — | None | — | 0 |
| A | Predator · Storm Seeker | While a foe is Broken, half her random hits (rounded up) land on Broken foes | 0, moved | About +30% while a Broken foe stands among others (×1, not ×0.5) | — | Fewer: Broken foes take none | — | 0 |
| B | Spearpoint · Overload | Break +1 on her first weak hit | 0 | 0 | — | +1 | — | 0 |

- **Worth:** the core is +6.7%. A gives nothing on a lone foe and about +8–12% over a wave.
- **One-foe users** take B, as with the Axe.

### 5.5 Bow · Light Tome: one foe, many hits

| Node | Names | Effect | Hits | Total power | Share | Chips | Splash | MP |
|---|---|---|---|---|---|---|---|---|
| Core | Ricochet · Refraction | Ricochet | 0, moved | Keeps the hits a kill would waste | — | Can chip the new foe, under the cap | — | 0 |
| A | Second Nock · Afterglow | A follow-up at 20% of its power | +1, on a Broken foe | +0.2 P on a Broken foe | — | None | — | 0 |
| B | Pinning Arrow · Searing Point | Break +1 on the tapped foe | 0 | 0 | — | +1 | — | 0 |

- **Worth:** the core is about +3–8% in formations, where foes fall mid-volley. It gives nothing on a lone foe.
- **A** is the heavy core's follow-up, about +7–9%.
- **Healers' one-hit blows** have no hits left to ricochet, so A and B serve them.

### 5.6 Katana · Dark Tome: twice, the foe and one other

| Node | Names | Effect | Hits | Total power | Share | Chips | Splash | MP |
|---|---|---|---|---|---|---|---|---|
| Core | Return Edge · Shadow Fork | A cross hit at 10% of its power | +1 on another foe | +0.1 P, with two or more foes | — | Can chip the other foe, under the cap | — | 0 |
| A | Swallow Cut · Nightfall | The cross hit rises to 20%, and goes to a Broken foe when one stands | (the core's) | +0.2 P instead of +0.1 P, at ×1 on a Broken foe | — | None on a Broken foe | — | 0 |
| B | Notch · Hollow | Break +1 on the tapped foe | 0 | 0 | — | +1 | — | 0 |

- **Worth:** the core is +10% with two or more foes, and nothing on a lone foe. A is about +10–20% more.

### 5.7 Who each weapon serves

Every weapon has at least one node that matters for each class that wields it:

| Weapon pair | Brawler · Mage | Spell Blade | Summoner (arrival) | Paladin · Cleric | Attack |
|---|---|---|---|---|---|
| Greatsword · Fire | Core, A, B | Core, A, B | Core, A, B | Core, A, B | Core, A, B |
| Axe · Blizzard | Core, A on every-foe skills; B | B | Core, A, B | B | B |
| Lance · Thunder | Core, A on random skills; B | B | Core, A, B | B | B |
| Bow · Light | Core, A, B | Core, A, B | Core, A, B | A, B | A, B |
| Katana · Dark | Core, A, B | Core, A, B | Core, A, B | Core, A, B | Core, A, B |

- **Checked against:**
  - the Spell Blade's single-target halves (D160 keeps them) get the heavy, many-hit and twice arts in full, and B on
    the rest;
  - the Summoner's pairs get every node on arrival;
  - the Paladin's and Cleric's one-hit blows get every follow-up, cross hit, splash and B.
- **The rule of thumb:** an every-foe or random art does nothing for single-target skills. Those users get B, the
  shield breaker's tool.

**E7, the thirty nodes?** Recommendation: **this set, approved as one call.** The names, numbers and aims are drafts for
the simulation. The eight effects and the mirrored pairs are the shape to approve.

## 6. Interactions

**The Spell Blade's extra Arms hit** (classes v2 §3.1, clarified):
- **Her Arms half gains one extra hit,** for the half as a whole, with its power split evenly. An Attack lands as two
  hits, a skill of n hits as n + 1.
- **An art's added hit comes on top, once.** It isn't her extra hit and never adds another, and B's +1 is one point.
- **Her chips an act** with each Arms art, on a lone foe, every hit weak, her depth-5 core:

  | Arms weapon | Core hits | With her extra hit (v14) | With the core | With A | With B |
  |---|---|---|---|---|---|
  | Greatsword | 2 | 3 | 3 | 3 | 4 |
  | Axe | 2 | 3 | 3 | 3 | 4 |
  | Lance | 3 | 4 | 4 | 4 | 5 |
  | Bow | 4 | 5 | 5 | 5 | 6 |
  | Katana | 2 | 3 | 3 | 3 | 4 |

  Her Tome half adds its own 2–4. With two foes or more, Return Edge, Shockwave or Ricochet can also take one point from
  each other foe they reach, under that foe's cap.

**The Summoner's farewell strike:**
- **Arts touch only the arrival.** The lingering summon's farewell is cast with no art.
- **Classes v2's Blizzard target still holds.** Against three foes at depth 5, with an Ice summon and an Axe summon:
  - before arts, she deals about 1.20× a Mage's Blizzard per foe;
  - with both cores on, she deals about 1.17×.

  Both gain the wider share on arrival or cast. Her farewell stays the class's own edge.
- **The cap counts her whole pair:** the Tome summon and the Arms summon.

**The healers' blows:**
- A Paladin's or Cleric's blow is one hit at ×0.5 with its support.
- Arts add hits and points, never support. A follow-up doesn't repeat Armor Break or the Barrier. Her mends and Barriers
  scale from offense without Might (D160 §3.3), so arts never touch them.
- A drain that reads the damage her hits dealt counts an added hit, as it counts any hit.

**Flat Orbs:** an added hit is a hit of its kind, so a matching Orb adds its offense. No special rule.

**Might:** an added hit is made with the weapon, so its Might adds to its offense. No special rule.

**Limit Breaks:** no arts.

**Breaker, Shatter and Steel:**
- **A Cleric's Breaker charge** is hers, not an art. It stays outside the cap, as H39 says, and stacks with B: one weak
  hit can remove three points.
- **Shatter** removes points as a status. It's unchanged and uncounted.
- **Steel** is unchanged: arts never chip a Steeled foe.

**Charged-move locks:**
- An added hit of a lock's kind breaks a lock, as any hit does.
- B's extra point is a shield point, not a lock.

**H39's passives** ([Tier 2's advanced classes](tier2-classes.md) §3, §5):
- **One cap, per foe** (E6). The **Blademaster**'s +1 and an Arms B both reach the tapped foe, so only one counts. She
  picks A on her Arms: a build choice, not a loss.
- **The Rune Knight's** strike on other foes and a splash or cross hit each take at most one point from a foe.
- **Raises to the same number add,** as H39 says. The **Berserker**'s tapped foe at full power and Long Haft's +0.05
  add, and so does Reaver's +0.3 on a Broken foe. **Recommended clamp:** an every-foe hit never lands above 1.0, a
  one-foe hit's power. Without it, a Berserker's Axe would hit a Broken target harder than a Greatsword.
- **Percent passives apply to added hits** as to any of her hits: the Warlord's +20% on a Broken boss raises her
  follow-ups too.
- **Arts don't touch farewells,** so the Conjurer's stronger farewells and arts never meet.
- A hit a passive adds is a hit, as here.

**Flags for v14 and H43:**
1. **The Duel can fall to one act before any art.** On a lone foe, depth 5, every hit weak, the best single acts
   already chip:

   | Class | Best act | Points | With arts and passives (the shared cap) |
   |---|---|---|---|
   | Brawler | Thousand Spears: 8 random hits | 8 | 9 |
   | Mage | Holy: 6 hits | 6 | 7 |
   | Spell Blade (v14) | Bow Flurry (5 hits, and her extra hit: 6) and Light Flurry (5) | 11 | 12 |
   | Summoner (v14) | Light Pack and Bow Pack (5 each), plus a Light Pack's farewell (5) | 15 | 16 |
   | Paladin, Cleric | A Bow blow: 1 hit and Shatter 3–4 | 4–5 | 5–6 |

   - **The worst single act is the Summoner's: 15 points, 16 with B.** It assumes v14's farewell recasts every hit of
     the summon, as today's linger does. If her farewell is one strike, her act is 11, 12 with B.
   - **The Spell Blade's, under the clarified extra hit, is 11, 12 with B or the Blademaster's +1.** It no longer
     reaches 16, but it still meets a shield of 10–12.
   - **Arts add one at most** (E6), so they don't decide it. A Cleric's Breaker charge, outside the cap, can add more.
   - **Classes v2's guard rail** (§3.1) already has v14's simulation check the Spell Blade's best act against the Duel
     shield, and raise the shield if it's reached. **Recommendation:** the same check runs on every class, the
     Summoner's first, with E6's one counted. H43's Tier 2 Duel takes the same number.
2. **The Horde depends on its weakness spread.** An every-foe skill chips each weak foe once a hit: a depth-5 Axe
   Breaks every Axe-weak shield-3 foe alone. Arts and passives add at most one point a foe. The "no one Uma Breaks a
   whole wave" target rests on each foe's own Arms and element pair (rift.md §5), not on arts.

## 7. Armor set bonuses (E8, E9)

**What counts as a set:**
- **A full suit** is five crafted pieces of one half: all physical or all magical. Training pieces don't count.
- **Steps go by the suit's lowest grade:** step 1 at grade 4, step 2 at grade 7, step 3 at grade 10.
- **A mixed suit gets no bonus.**

**The two effects: sustain, not damage.**

| Suit | Step 1 (lowest grade 4) | Step 2 (7) | Step 3 (10) | Worn by default |
|---|---|---|---|---|
| **Physical** | Max HP +4% | +7% | +10% | Brawler, Spell Blade, Paladin |
| **Magical** | Skill MP −5% | −10% | −15% | Mage, Summoner, Cleric |

- **Max HP** is her final max HP, after armor and Extra Stats. Mends and Barriers are shares of it, so they grow too.
- **The MP cut** applies to each skill's MP after her hand and tier, rounded, never under 1. It applies to both halves of
  a pair.
- **They mirror the halves:** physical suits stand in front and take the big hits; magical suits spend MP.
- **Why sustain:** damage already has four levers (§3). Sustain keeps sets out of the damage stack, and gives a full
  suit a reason beyond its offense stat.
- **The MP cut's worth depends on Tier 2's skill MP.** `battleSkillFor` doubles it in Tier 2 today. H39's A10
  recommends ×1.7 instead:
  - at ×1.7, a Mage's depth-5 cast costs 44 MP, and −15% saves about 7: two thirds of a G10 Spring Amulet's 10 a
    round, inside the target band (§12);
  - if Tier 2 dropped the factor altogether, the magical steps should rise to −10/20/30%.

**Where it shows:**
- **The Gear tab** ends its armor block with a Set line:
  - "Physical set, step 2 · max HP +7%";
  - or "Physical suit, lowest grade 6: step 2 at grade 7";
  - or "Mixed suit: no set bonus".

  An "Activate step n · 1 Plate Seal n" (or Mantle Seal) button shows when she qualifies.
- **The Battle tab's** HP includes the bonus and lists "Skill MP −10%".

**E8, set bonuses?** Recommendation: **one per half, in three steps by the suit's lowest grade (4, 7, 10). Sustain:
a physical suit gives max HP +4/7/10%, a magical suit cuts skill MP by 5/10/15%.**

**Activating a step (E9):**
- **She activates each step once,** for one Lore Seal of its half ([H42](second-profession.md) §6):

  | Step | Physical suit | Magical suit | Lore grade |
  |---|---|---|---|
  | 1 (lowest grade 4) | Plate Seal I | Mantle Seal I | 2 |
  | 2 (lowest grade 7) | Plate Seal II | Mantle Seal II | 4 |
  | 3 (grade 10) | Plate Seal III | Mantle Seal III | 5 |

- **Steps go in order,** and only while she wears a qualifying suit.
- **An activated step stays hers in that world.** It's on whenever she wears a full suit of that half at its grade,
  and off in a mixed suit.
- **Each half's steps are activated separately.**

**E9, what a set step costs?** Recommendation: **each step is activated once per Uma, for one Lore Seal: Plate Seals
for the physical suit, Mantle Seals for the magical.**

## 8. The Rift

**Tier 1's Rift has no arts.** Tier 2's Rift is where they're tested:

| Front | What it asks (rift.md §5) | Arts that serve it | Fork lean |
|---|---|---|---|
| **Iron** | Arms weaknesses only. Formations of sub-bosses and bosses. Elements warded | **B on Arms**: Brawlers', Spell Blades' and the Paladin's weak Arms. Arms cores. Shockwave and Reaver against escorts | B on boss stages, A where escorts crowd |
| **Arcane** | Elements only. Arms warded | **B on Tomes.** Deep Frost and Static Field against the guards. Afterburn and Afterglow in Break windows | The mirror of Iron |
| **Duel** | One boss, shield 10–12, acting twice or three times | **Single-target Break and burst:** B on every weapon, then Follow-through, Afterburn, Second Nock and Afterglow while she's Broken | B |
| **Horde** | 4–6 foes a wave, shields 3–4, three waves | **Area cores:** Long Haft, Deep Frost, Long Reach, Static Field. A sides: Reaver, Predator, Shockwave, Swallow Cut. Fault Line and Frost Crack to finish the nearest Break | A, with Fault Line |

**What Tier 2's Rift should test.** These are requirements only; H43's [Tier 2's world](tier2-world.md) designs the
fronts:
1. **The fork pick matters stage by stage.** Each front has stages where its party's B side wins and stages where A
   wins: a boss alone against a boss with escorts.
2. **Duel shields** sit above the best single-Uma act plus E6's one (§6, flag 1).
3. **Horde weaknesses spread**, so no Uma's five kinds plus an art Break a whole wave.
4. **Charged moves keep locks** from the front's weakness kinds, so added hits of the right kind matter.
5. **Wards stay.** No art changes a hit's channel.
6. **Echoes pay Weapon Rank at 2×,** so an Uma re-specced for a front reaches rank 8 on her new weapons.

## 9. Tier 3: awakening

- Tier 3 keeps the arts, learned again in its own world, and adds **awakening**: a grade-10 weapon takes one awakened
  effect, crafted at the Forge (tiers.md §6).
- It's per piece, where arts are per Uma and kind.
- It must not repeat the arts' shape job, or any lever in §3.
- Nothing is designed here. It gets its own doc when Tier 2 has been played.

## 10. The build

### 10.1 Engine v15

**What freezes into `BattleAlly`:**
- `arts?: Partial<Record<RpgWeapon, { fork?: 'a' | 'b' }>>`. A key means her core is learned; `fork` is the active
  side.
- `set?: { half: 'physical' | 'magical'; step: 1 | 2 | 3 }`. The fight builder folds the max HP into `stats.hp`, so the
  engine reads `set` only for the MP cut.

**Where each applies:**

| What | Where |
|---|---|
| Wider share and random bonus | `battleSkillFor`: it returns the def with every-foe hits × share ÷ 0.55 (the share is baked into catalog powers through `RPG_AOE_SHARE`) and random hits × bonus ÷ 1.05. The set's MP cut goes here too |
| Follow-ups, splash, cross hits, Reaver's Broken share, Predator's draw, Ricochet | `cast`, which gets the act's art. `resolveHalf` sends the Attack through the same path |
| Off for farewells and Limit Breaks | `linger` and the Limit Break path call `cast` with no art |
| B's +1 and the cap | `strike` and `chip`. One counter per foe for the act, shared with H39's passives and reset once an act in `applyBattleAction`, so a pair shares it. An added or moved hit chips a foe only while that foe's counter is free |

v6–v14 fights replay unchanged: arts are off below v15.

### 10.2 Auto

- **The def carries the static shape**, so `score` reads it as it is.
- **Draft weights** for the rest:

  | Art | Added to the score |
  |---|---|
  | Follow-up | 0.2 × total power, when the foe is Broken |
  | Splash | 0.08 × total power × the foes it would miss |
  | Cross hit | 0.1 (A: 0.2) × total power, when another foe stands; A doubles it when that foe is Broken |
  | Reaver's share | Every-foe terms count a Broken foe at 0.9 ÷ 0.6 |
  | Predator's draw | 0.3 × random power, while a Broken foe stands among two or more |
  | Ricochet | Nothing |
  | Break +1 | 0.4 × her depth's single-target power, when the hit is weak on a standing, un-Steeled shield and that foe's cap is free. Doubled when that point Breaks the foe. Once an act |

- **Auto never picks a fork side.** Sides are set outside fights. The balance party takes B on lone-foe stages and the
  Duel, A on formations, and the simulation measures both.

### 10.3 Save

- **The first save version after v24,** shared with H39's and the other Tier 2 docs when Tier 2 content is built. The
  build packet picks the number; Tier 2's docs pick none.
- **On `OwnedUma`, per Uma per world:**
  - `arts?: Partial<Record<RpgWeapon, { learned: ('core' | 'a' | 'b')[]; side: 'a' | 'b' | null }>>`;
  - `sets?: { physical?: 1 | 2 | 3; magical?: 1 | 2 | 3 }`: the steps activated.
- **Rules,** in a new `save/arts.ts`:
  - `learnArt` checks Weapon Rank and the core, and spends one Scroll from stock;
  - `pickArtSide` takes a learned side;
  - `activateSetStep` checks her suit and spends one Seal.
- **Parsing refuses:**
  - a node above her rank;
  - a side without the core;
  - an unlearned active side;
  - any art in a Tier 1 world.
- **Older saves** migrate with both empty.

### 10.4 The second vertical's hook

**The demand table.** One Lore product a node and one a step, by half. H42's
[second profession](second-profession.md) §6 makes them and §9 sizes its output against these counts, which match its
own.

| What | Per Uma | Product (Arms or physical · Tome or magical) | Lore grade |
|---|---|---|---|
| Cores, her class's five weapons | 5 | Arms Scroll I · Spell Scroll I | 1 |
| Fork sides, both, five weapons | 10 | Arms Scroll II · Spell Scroll II | 3 |
| Set steps, one suit | 3 | Plate Seal I–III · Mantle Seal I–III | 2, 4, 5 |
| **Her class, in full** | **18** | | |
| One side a weapon only | 13 | | |
| Every weapon and both suits (a full re-specer) | 36 | | |

**A twenty-Uma run**, with H42's roster:
- the roster: four of each damage line, two of each healer line;
- each Uma: her class's five weapons, both sides, one suit.

That's 50 Arms slots and 50 Tome slots, and 10 physical and 10 magical suits.

| Lore grade | Physical | Magical | Products, in each half |
|---|---|---|---|
| 1 | 50 | 50 | Scroll I: cores |
| 2 | 10 | 10 | Seal I |
| 3 | 100 | 100 | Scroll II: fork sides |
| 4 | 10 | 10 | Seal II |
| 5 | 10 | 10 | Seal III |
| **All** | **180** | **180** | **360 a run.** Up to 720 if every Uma re-specs to all ten weapons and both suits |

**Timing,** on H42's mapping: Lore grades open at Lore Lv 1, 11, 21, 31 and 41, each before its consumer needs it.
Weapon Rank 4 comes near Uma Lv 16 and rank 8 near Lv 36, and suits reach grades 4, 7 and 10 near Lv 16, 31 and 46.
Each product needs two raw items of its grade (Relics or Glyphs), so raw demand is double these counts, before the
ring's.

### 10.5 Screens

- **`WeaponSheet.tsx` gains an Art row** under the slot's weapon:
  - the core: on, "Weapon Rank 4", or "Learn · 1 Arms Scroll I" (or Spell Scroll I);
  - the fork: A and B as two chips, the active one filled, each with its one-line effect and a Learn button.

  The same sheet opens from the Skills page and the Gear tab (D98).
- **The Gear tab** shows the Set line (§7).
- **The "can upgrade" badge** (classes v2 §7) counts a node or a step she can learn now.
- **Targets plan** the Scrolls and Seals a target still needs: H42 §10 lists them at the Scriptorium.
- **Fights** show added hits with today's hit cues. B shows as two points off the shield badge, labelled
  "Break +1".
- **No kit change.** Sheets, chips and buttons are kit pieces the game fills. Anything uma-kit draws would go through
  [change-protocol.md](../change-protocol.md).

### 10.6 Art

None. Text and the existing weapon icons carry it.

### 10.7 Docs, when built

- `classes.md`: the weapons section, with a generated `live:arts` table.
- `combat.md`: added hits, the cap, Auto and the constants.
- `loops.md`: Weapon Rank opens arts, and set bonuses under Extra Stats and gear.
- `materials.md` § Gear: set steps, with a generated `live:sets` table.
- `sections.md`: the weapon sheet's Art row and the Gear tab's Set line.
- The README's topics row.

## 11. Content size

| Piece | Where | Size |
|---|---|---|
| Thirty nodes and two set bonuses, as data and one-line text | `rpg/arts.ts` (new) | S |
| Engine v15: shape scaling, follow-ups, splash, cross, Broken share, the draw, Ricochet, B and the cap, the MP cut, farewells and Limit Breaks off | `rpg/battle/` | M |
| Freezing `arts` and `set`, and set HP into stats | `save/battle.ts`, `world/balance-party.ts` | S |
| Save: learned nodes, sides, steps; learn, pick and activate rules; parsing | `save/save.ts`, `save/arts.ts` | S–M |
| Auto's art weights | `battle/auto.ts` | S |
| The weapon sheet's Art row and learn flow | `places/stable/WeaponSheet.tsx` | M |
| The Gear tab's Set line | `places/stable/GearCard.tsx`, `OutfitProfile.tsx` | S |
| Each node's Scroll and each step's Seal, wired to H42's products | `rpg/arts.ts` | S |
| The balance simulation: arts on curve, a fork per front, the targets | `world/balance` | M |
| Manual pages and live blocks | `docs/game/` | S |

## 12. Balance targets

**Targets for the simulation (`SIM=1`), drafts:**

| Target | Value |
|---|---|
| A core, in its weapon's own shape | +5–10% of that weapon's value: damage per act, or chips per act |
| Fork sides | Each side of every fork is the better pick on at least one Rift front, on Auto |
| Duel boss (shield 10–12) | An on-curve Tier 2 party with every Break art still needs at least two rounds to Break her. No single Uma Breaks her in one act |
| Horde wave (4–6 foes, shields 3–4) | No single on-curve Uma Breaks every foe of a wave in one act |
| Classes v2's targets, with arts on | Spell Blade 70/30 ± 5. Spell Blade vs Summoner damage per turn within ±5%. Summoner ≥ the Mage's Blizzard against three or more foes |
| Set bonuses | Each worth 60–100% of a G10 support accessory's effect on a front's win rate, on Auto |
| Tier 2 campaign | On-curve win rates within 3 points of Tier 1's at matched levels. Arts and set bonuses are priced into Tier 2's build budget, alongside H39 and the outer ring |

**What these targets assume:**
- **An on-curve Tier 2 Uma** at her tier level:
  - the gear grade her level opens, and the inner map;
  - the core from Lv 16 and the fork from Lv 36;
  - set steps by her suit's lowest grade.
- **For the build budget:** arts are worth about +6–10% of a party's damage an act at Tier 2 Lv 50. B adds one point an
  act for each Uma who picks it. Sets add +10% max HP or −15% skill MP.
- **Flag: the foe budget.** `rpgFoeBudget` runs on lifetime level. Tier 2 foes therefore assume more than a full Tier 1
  Lv 50 build from Tier 2 Lv 1, while a promoted Uma arrives with Training gear, an empty map and no arts (D159 §5).
  This doc doesn't solve that. H43 owns it (Z3, Z4), and these targets compare at matched tier levels on its curve.
  H43's draft "every foe's shield +1" in Tier 2 is what B forks and multi-hit answer.

**Watch in the simulation:**
- **The mirror.** The Summoner gains the area and random cores on arrival, and the Spell Blade's single-target halves
  don't. If she pulls ahead of ±5%, trim the area and random cores before touching v14's hands.
- **The Duel's shield** (§6, flag 1).
- **The MP cut** against H39's A10 factor for Tier 2's skill MP (§7).

## 13. Owner calls

| Call | Question | Recommendation |
|---|---|---|
| **E1** | The art tree's shape | A free core and an A/B fork, like one depth of a skill tree. The core sharpens the weapon's shape; A adds damage; B is Break +1 |
| **E2** | Gates | The core at Weapon Rank 4, the fork at Weapon Rank 8 |
| **E3** | Choosing and swapping | Per weapon, shared by every class. The fork side swaps freely outside a fight, as side skills do |
| **E4** | What learning a node costs | Weapon Rank opens it. Each node is learned once per Uma for one Lore Scroll of its half (H42): Arms or Spell Scroll I for a core, Scroll II for a fork side. Swapping is free |
| **E5** | What an art touches | Attacks and skills made with that weapon, in any class, and a summon's arrival. Not farewell strikes, Limit Breaks or Orbs |
| **E6** | The cap on Break arts | H39's shared cap: arts and passives together remove at most one extra shield point from a foe in an act, whatever the source. Steel is unchanged |
| **E7** | The thirty nodes | The set in §5: eight effects, mirrored Arm and element pairs, approved as one call. Raises add with H39's passives, and an every-foe hit never lands above a one-foe hit's power |
| **E8** | Set bonuses | One per half, in three steps by the suit's lowest grade (4, 7, 10). Sustain: a physical suit gives max HP +4/7/10%, a magical suit cuts skill MP by 5/10/15% |
| **E9** | What a set step costs | Each step is activated once per Uma, for one Lore Seal (H42): Plate Seal I–III for the physical suit, Mantle Seal I–III for the magical |
