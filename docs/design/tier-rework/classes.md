# Classes: the Tier rework

> **Fan-out draft, 2026-10-22. Nothing here is built.** One of six category docs ([the brief](README.md)), for the
> cross-reference pass and then the owner's review, which starts with this category. Calls are **CL1–CL15**
> ([§11](#11-decisions)); every one has a recommendation.
>
> Previews (390 px first, light and dark):
> [composition](previews/classes-composition.html) · [strikes](previews/classes-strikes.html) ·
> [template sheets](previews/classes-template-sheets.html) · [trees](previews/classes-trees.html)

## The owner's points

| The owner's point | Answered in |
|---|---|
| Simplify Tier 1's baseline class facts | [§2](#2-tier-1), counted in [§2.8](#28-tier-1s-complexity-today-and-proposed) |
| Maybe every class starts with **3 weapon slots** | [§2.1](#21-three-weapon-slots-one-per-strike-cl1) |
| Proposed defaults that keep every party balanced for every battle | [§2.3](#23-balanced-defined-cl3), [§2.4](#24-the-default-weapons-cl4) |
| Maybe rework Tier 1 foes' weaknesses | [§2.2](#22-the-strikes-and-tier-1s-foe-weaknesses-cl2) |
| Show every class's trees | [§2.6](#26-trees), [trees preview](previews/classes-trees.html) |
| Show the class composition | [composition preview](previews/classes-composition.html) |
| The class template sheet per tier: weapons, armors, accessories | [§5](#5-the-class-template-sheet-per-tier), [template sheets preview](previews/classes-template-sheets.html) |
| What other dimensions class selection affects | [§6](#6-what-class-selection-affects) |

## 1. Today

Classes v2 (D160, live since H61, D188). The manual: [classes](../../game/classes.md), [combat](../../game/combat.md),
[maps](../../game/maps.md).

| Piece | Today |
|---|---|
| Classes | Six: Brawler, Mage, Spell Blade, Summoner, Paladin, Cleric. Free switching; one healer a party |
| Weapon slots | **Five a class.** Brawler 5 Arms and Mage 5 Tomes, fixed. Spell Blade and Paladin 3 Arms + 2 Tomes, Summoner and Cleric 3 Tomes + 2 Arms, each slot's weapon picked within its channel |
| Trees | One per class and weapon: Brawler and Mage see 5, the others 10, of which the 5 slotted are usable |
| Foe weaknesses | Ten kinds. Arms: 2 drawn at random for regulars and elites, 1 for bosses, 3 for a light + dark foe. Elements: what beats her signature by the ring (Fire > Ice > Lightning > Fire, Light ⇄ Dark), minus her own; a regular with one answer gets a random second (`world/world.ts`). Capitals: 3 + 2 or 2 + 3 for regulars (`campaign/chapters.ts`) |
| Charged moves | 2–4 locks, each a kind drawn from her weaknesses; every hit of that kind breaks one |
| Armor | Five slots, each physical or magical, chosen per slot; a new Uma starts in her class's half |
| Accessories | Two typed slots: **Damage** (an Orb, 10 kinds) and **Support** (5 Talismans, 5 Amulets) |
| Presets | One per class: five weapons, the armor half, an Orb, a support |
| Hands, leans, Limit Break power | Per class ([classes](../../game/classes.md#the-six-classes)); untouched by this doc |

What makes Tier 1 heavy for classes: five weapons to fill, a weakness list of two to five kinds per foe drawn half at
random, a channel choice on every armor piece, and two accessories with 100 combinations. Today a party covers its
foes because the Brawler holds all five Arms and the Mage all five elements; three slots break that, so the foe rule
has to change with them.

## 2. Tier 1

### 2.1 Three weapon slots, one per strike (CL1)

- **Every class has three weapon slots, in every tier** ([brief](README.md) §2).
- **The slots are typed by strike** (§2.2): one **Heavy**, one **Flurry**, one **Area**.
- **The class sets how many are Arms:**

  | Class | Arms | Tomes |
  |---|---|---|
  | Brawler | 3 | 0 |
  | Mage | 0 | 3 |
  | Spell Blade, Paladin | 2 | 1 |
  | Summoner, Cleric | 1 | 2 |

- A pick swaps a weapon inside its strike (a Greatsword for a Katana), or, for the four between, moves the minor
  channel to another strike. Brawler and Mage get 4 spreads each; the other four 12 each (today: 1 and 100).
- Typing by strike is what makes the balance hold for **any** pick, not only the defaults: no pick can leave a strike
  empty.

### 2.2 The strikes, and Tier 1's foe weaknesses (CL2)

**Each kind belongs to one strike**, by its shape today ([preview](previews/classes-strikes.html#three)):

| Strike | Arms | Tomes | Shape |
|---|---|---|---|
| **Heavy** | Greatsword, Katana | Fire, Dark | Few strong hits: one foe hard, or twice |
| **Flurry** | Lance, Bow | Thunder, Light | Many hits: random foes, or one foe many times |
| **Area** | Axe | Blizzard | Every foe |

The ten kinds stay ([brief](README.md) §2); Tier 1 reads them three at a time. A Spell Blade's, Paladin's and Cleric's
Axe and Blizzard skills strike one foe, as today; the strike still follows the kind.

**A Tier 1 foe is weak to one strike.** Every kind of that strike counts: ×1.3 and a shield chip, as today.
- **The rule:** the strike of the element that beats her signature's first element, the ring read one level up: a Fire
  foe is weak to Flurry (Lightning's), an Ice foe to Heavy (Fire's), a Lightning foe to Area (Ice's), a Light foe to
  Heavy (Dark's), a Dark foe to Flurry (Light's). The Thunder Tome deals Lightning, the Blizzard Tome Ice.
- **Two elements:** if one of her own elements is in that strike, she's weak to the strike none of hers is in (a
  Fire + Lightning foe: Area). The rule always lands on exactly one strike, and never on her own element.
- **Where:** the world's regions and the capitals' Finals; the Rift's fronts draw theirs by seed (below). Across the 19
  biomes' 48 signatures it gives Heavy 15, Flurry 15, Area 18 ([biome table](previews/classes-strikes.html#biomes)).
- **On screen:** one badge, "Weak: Flurry", with its four kinds small beside it; each weapon slot shows its strike.

**The Rift's fronts in Tier 1** keep their shapes and ward; the weak list is a strike, drawn by the run's seed as today
(from the front, never the face):

| Front | Weak to | Ward |
|---|---|---|
| Iron | One strike, its Arms only | Elements ×0.5 |
| Arcane | One strike, its Tomes only | Arms ×0.5 |
| Duel | One strike, both channels | — |
| Horde | Each foe its own strike, both channels; every wave holds all three | — |

A front foe's own element sits outside her strike, as today's sits outside her weaknesses.

**Charged moves (CL8).** A lock names no kind in Tier 1: **each Uma whose act lands a weak hit breaks one.** "Charging ·
3 locks" asks three weak acts. The Duel's mixed sets alternate a weak Arms act and a weak Tome act.

**Shields (CL9).** Flurry chips about twice as fast as Heavy or Area (2–6 hits to 1–3). Drafts the simulation sets: a
Flurry-weak foe's shield ×1.5, rounded up; an Area-weak foe in a squad or swarm +1, since one Area hit chips the whole
wave.

### 2.3 Balanced, defined (CL3)

Three tests, each checkable by a script before any fight:

1. **Every member chips every foe of the world and capitals:** each Uma, of any class, on any legal pick, has a weapon
   weak to every Tier 1 world foe. Five Brawlers or five Mages included. True by CL1 and CL2.
2. **Each Rift front's guided party, on default weapons, has at least three members who chip each of its foes.** Iron (Arms of the strike
   only): Heavy 3, Flurry 5, Area 4. Arcane (Tomes only): Heavy 3, Flurry 5, Area 4. Duel and Horde: 5 on every strike.
3. **The five types, on default weapons, hold all ten kinds** (Brawler, Mage, Spell Blade, Summoner, Cleric), so the default party covers
   every Tier 2 foe as well (§3.1).

Win rates stay the simulation's test ([§10](#10-pacing)).

### 2.4 The default weapons (CL4)

| Class | Heavy | Flurry | Area | Today's five |
|---|---|---|---|---|
| Brawler | Greatsword | Lance | Axe | All five Arms |
| Mage | Fire Tome | Thunder Tome | Blizzard Tome | All five Tomes |
| Spell Blade | **Dark Tome** | Bow | Axe | Greatsword, Lance, Katana, Fire, Thunder |
| Summoner | **Katana** | Thunder Tome | Blizzard Tome | Fire, Blizzard, Thunder, Greatsword, Lance |
| Paladin | Greatsword | Lance | **Blizzard Tome** | Greatsword, Axe, Lance, Blizzard, Fire |
| Cleric | Dark Tome | Light Tome | **Axe** | Light, Dark, Thunder, Katana, Bow |

In bold, each class's minor channel. **The pattern:** the hybrids hold their Heavy weapon in their minor channel, the
healers their Area weapon. That is what makes Iron and Arcane exact mirrors in test 2, and what puts all ten kinds in
the five types (test 3).

Why each:
- **Brawler and Mage:** the ring's three, so a new player meets the weakness ring on her first two classes.
- **Spell Blade:** her multi-hit leads. Bow and Axe take her extra hit (2–6 chips a blade on Flurry and Area foes);
  her Dark half lands two hits on Heavy foes.
- **Summoner:** her areas lead. Both Tome summons reach several foes (Thunder at random, Blizzard on every foe) and
  linger for the farewell; her Katana summon strikes once.
- **Paladin:** Greatsword Aegis, Lance's Valkyrie's Oath and the Blizzard's Barrier on every Uma: three of her four v2
  specials. The fourth, the Axe's Enfeeble on every foe, is one pick away (her Tome to Flurry, the Axe in her Area slot).
- **Cleric:** Light's Regen and Dark's drain, both of her v2 specials; her Axe blow Enfeebles and Barriers.

Standard presets follow (§5): these three weapons, the class's armor half, and the support today's preset names
(Brawler and Spell Blade Vampire Talisman, Mage and Summoner Siphon Amulet, Paladin Thorn Talisman, Cleric Spring
Amulet).

### 2.5 The hybrids and healers on 2 + 1 (CL5)

**The 70/30 pair still works, unchanged.** Every act is still one Arms half and one Tome half; the hands set the split,
not the slot count:
- Spell Blade: Arms ×0.72 (one extra hit) + Tome ×0.44. Summoner: Tome ×0.58 (lingers, farewell on every foe) + Arms
  ×0.56 (H63, D187).
- **What 2 + 1 changes:** her minor half always draws on its one tree; her lead half picks between two. Each half costs
  its own MP, as today. Auto alternates lead, minor, lead.
- **Weak hits:** on her minor weapon's strike only her minor half is weak; on the other two, her lead half. That 2 : 1
  is close to today's 3 : 2 spread, so the split should stay inside 70/30 ± 5. The simulation re-measures it, and the
  mirror (±5%), on the Tier 1 template with [extra-stats.md](extra-stats.md)'s map. **The knob, if either misses, is the
  hands**, as in H63.
- **The healers:** two weapons of their lead channel and one of the other, so the split classes v2 meant gets sharper:
  the Paladin's two Arms give Barriers and debuffs, her one Tome mends; the Cleric's two Tomes mend and buff, her one Arm
  Barriers. Paladin vs Cleric sustain stays within ±10% (classes v2 §9), re-measured.

### 2.6 Trees

Three usable trees a class, one per weapon ([preview](previews/classes-trees.html), drawn with today's catalog names).
The catalog keeps one tree per class and kind (50), so a pick reaches the class's other trees. The tree's shape, its
costs and its gates are [skill-trees.md](skill-trees.md)'s; this doc fixes only which three trees each class uses by
default.

### 2.7 Armor, the accessory, the starting class

- **Armor (CL6, with [gear.md](gear.md)):** five pieces in **her class's half**, no choice in Tier 1: physical for
  Brawler, Spell Blade and Paladin; magical for Mage, Summoner and Cleric. A class switch wears her pieces of the new
  half. Every preset and the simulation already dress this way.
- **One accessory (CL7):** the **Support** slot (10 Talismans and Amulets). It carries a role and the MP economy (the
  Mage's Siphon, the Paladin's Thorn). **No Orb in Tier 1:** the Orb specializes in a kind, and kinds matter from
  Tier 2 (§3.1), where it arrives with them.
- **Starting class (CL13):** today's rule, plus [variance.md](variance.md)'s calling: a Pace chaser whose base Power
  beats her Wit starts as a **Spell Blade**, as a Late surger's does as a Paladin (D180). New unlocks only. Every class
  then has starters.

### 2.8 Tier 1's complexity, today and proposed

What a Tier 1 player must know or pick for one class:

| | Today | Proposed |
|---|---|---|
| Weapons a class holds | 5 | 3 |
| Usable trees | 5 | 3 |
| Weapon spreads to choose from | Brawler, Mage 1; the others 100 | Brawler, Mage 4; the others 12 |
| Rules for what a foe is weak to | 5: random Arms lists, the ring, Light ⇄ Dark, a pair's answers minus her own, light + dark weapons only | 1: one strike a foe |
| Weak marks on a foe's card | 2–5 kinds | 1 strike |
| Finding her weak weapon | Match up to 5 marks against 5 weapons | Her one weapon of that strike |
| Armor | 5 halves to choose, 32 suits | None |
| Accessories | 2 slots: 10 Orbs × 10 supports | 1 slot: 10 supports |
| Loadouts a class can wear (weapons × armor × accessories) | Brawler 3,200; the others 320,000 | Brawler 40; the others 120 |
| Healer statuses she carries | 5 of 10 | 3 |
| Charged-move locks | Kinds to match | Weak acts to count |

**Unchanged:** six classes, their hands and leans, one healer a party, Limit Breaks from the halls, Class Rank.

## 3. Tier 2

### 3.1 Weapons: the same slots, the kinds narrow (CL10)

- Three slots, one per strike, as in Tier 1. Depth comes from the weapons themselves ([gear.md](gear.md): the G5 fork,
  Dual or Pure), not from more slots.
- **Foes are weak to two kinds of their strike:** the ring's element and one Arm of it (a Fire foe: Lightning and Bow).
  An Area foe stays weak to both Axe and Blizzard, each channel's only Area kind. Each Uma still knows which slot to look
  at; Tier 2 asks which kind sits there. A party now covers kinds by its make-up and picks, and a Dual weapon covers a
  second kind.
- This is for [tier2-world.md](../tier2-world.md) to absorb (its weakness counts, Z2): the strike stays the frame in
  every tier.

### 3.2 Armor and accessories

- Armor: the Spell Blade, Summoner, Paladin and Cleric mix halves per piece; the Brawler stays physical and the Mage
  magical ([gear.md](gear.md)).
- Accessories: **two**, the Support slot and the **Damage** slot (an Orb).

### 3.3 Specializations, not twelve classes (CL11)

[Tier2-classes.md](../tier2-classes.md) designs twelve advanced classes: new class ids per world, twelve lean rows,
twelve emblems, a pick of twelve at Ascend. Its passives are the content; this doc keeps them and drops the
machinery:

- **The six classes stay the six in every tier.** In Tier 2 each class gains a **specialization**: one of two, a
  passive and a title. Her chip reads "Spell Blade · Blademaster".
- **The twelve passives are tier2-classes' as written** (A5), with its names (A4: Duelist → Blademaster; the Axe
  summons Berserker → Marauder and Jotun Warlord → Jotun King):

  | Class | First | Second |
  |---|---|---|
  | Brawler | Warlord: a Broken boss takes +20% from her | Berserker: her Axe hits her target at full power |
  | Mage | Sage: a new element each cast, +15% | Sorcerer: +15% on a lone foe |
  | Spell Blade | Blademaster: a weak blade chips one more point | Rune Knight: her spell also strikes every foe weak to it |
  | Summoner | Conjurer: her farewells hit 20% harder | Warlock: Light and Dark summons curse, Mind Break 1 |
  | Paladin | Templar: party Barriers 25% larger | Guardian: her blows guard the Uma most in danger |
  | Cleric | Bishop: party mends 25% larger | Oracle: her buffs last a round longer |

- **Picked per class, swapped freely** on the Skills page. Ascend preselects the first by A6's stat rule, for every
  class. Nothing to agonise over, and no Ascend sheet of choices.
- **No lean change** (A2 dropped): slots, armor, hand, leans and Limit Break power stay the class's. One number fewer to
  read per class.
- **Where it shows:** at the root of her class tree ([skill-trees.md](skill-trees.md) SK1, SK7) and on the class chip.
  Emblems: the class's, with a small mark; no twelve new emblems.
- **The hybrids' crossovers** (open question Q17) are [skill-trees.md](skill-trees.md)'s Tier 2 branches (SK9), not
  specializations.
- Hero LB+ at Bond 10 (A7) and Tier 2's skill MP (A10) are the halls' and the trees'; untouched here.

**What a Tier 2 player adds for classes:** one choice of two per class.

## 4. Tier 3

- **Weapons:** three; foes weak to **one kind** of their strike. Gear's second fork (Prism, Tempered, Keen) answers it.
- **Armor:** five, as Tier 2.
- **Accessories:** three: + a second Support slot ([gear.md](gear.md)).
- **A mastery per class (CL12):** one signature mechanic each, **six, not twelve**, shown at the tree's root. Designed
  with Tier 3, once Tier 2 is played (tier2-classes §4.5). The specialization stays.

## 5. The class template sheet per tier

Drawn in the [template sheets preview](previews/classes-template-sheets.html) for the Spell Blade, with all six.

| | Tier 1 | Tier 2 | Tier 3 | Today |
|---|---|---|---|---|
| **Weapons** | 3, one per strike | 3 | 3 | 5 |
| **Armor pieces** | 5, her class's half | 5, per piece for the four between | 5, as Tier 2 | 5, per piece |
| **Accessories** | 1: Support | 2: + Damage (an Orb) | 3: + a second Support | 2: Damage, Support |
| **Class choice** | — | A specialization, one of two | + a mastery | — |
| **Foes weak to** | A strike | Two kinds of it | One kind of it | 2–5 kinds |

The six at Tier 1:

| Class | Slots | Heavy | Flurry | Area | Armor | Support (preset) |
|---|---|---|---|---|---|---|
| Brawler | 3 Arms | Greatsword | Lance | Axe | Physical | Vampire Talisman |
| Mage | 3 Tomes | Fire | Thunder | Blizzard | Magical | Siphon Amulet |
| Spell Blade | 2 Arms + 1 Tome | Dark | Bow | Axe | Physical | Vampire Talisman |
| Summoner | 2 Tomes + 1 Arm | Katana | Thunder | Blizzard | Magical | Siphon Amulet |
| Paladin | 2 Arms + 1 Tome | Greatsword | Lance | Blizzard | Physical | Thorn Talisman |
| Cleric | 2 Tomes + 1 Arm | Dark | Light | Axe | Magical | Spring Amulet |

## 6. What class selection affects

| Dimension | Today | Tier 1, proposed | Tiers 2–3 |
|---|---|---|---|
| Weapons and channel | 5 slots, 5 + 0 or 3 + 2 | 3 slots, one per strike; 3 + 0, 2 + 1 | The same; the kinds narrow, gear's forms add kinds |
| Usable trees | 5 of 5 or 10 | 3 | 3, deeper ([skill-trees.md](skill-trees.md)) |
| Hand: power, MP, pair, extra hit, farewell, half-hand healer | Per class | Unchanged | Unchanged |
| Stat leans | Per class | Unchanged | Unchanged (no specialization moves them) |
| Healing, and from which stat | Paladin ATK, Cleric M.ATK; one healer a party | Unchanged | Unchanged |
| Armor | Starting half by class, then per piece | Her class's half, no choice | Per piece for the four between |
| Accessories | 2 slots for any class | 1 Support | + Orb, then + Support |
| Standard preset | 5 weapons, armor, Orb, support | 3 weapons, armor, support | + Orb |
| Limit Break power | Brawler 2×, Mage 2.4×, hybrids 2.2×, healers 1.5× | Unchanged | Unchanged; LB+ is the halls' |
| Class Rank | Per class; opens depths | Unchanged | Unchanged |
| Starting class | Running style; Late splits Paladin / Cleric | + Pace splits Spell Blade / Mage (her calling) | Ascend keeps her class |
| Uma Template ([variance.md](variance.md)) | — | Her Flourish works only in her calling; her moon's lead only in classes of its channel | The same |
| Extra Stats ([extra-stats.md](extra-stats.md)) | Which nodes she picks | The map is class-free; her class decides which offense moons count | The same |
| Rift fronts | Guided party by class; ward by channel | The same, on strikes | Each tier's Rift |
| Specialization, mastery | — | — | One of two (Tier 2); a mastery (Tier 3) |
| Gear ranks | Weapon Rank per kind she slots, Armor Rank per half she wears | None: [gear.md](gear.md) gates grades by Uma Level | — |
| Professions ([professions.md](professions.md)) | — | **None** (CL14): the fight types name the gathering professions' themes; her active class moves no job | The same |

## 7. Provides

| To | What |
|---|---|
| Everyone, and [README](README.md) §2 | The **strikes** (Heavy, Flurry, Area) and each kind's strike; three slots one per strike; the class template per tier (§5); the five fight types: physical Brawler, magical Mage, physical hybrid Spell Blade, magical hybrid Summoner, healer Paladin or Cleric |
| [gear.md](gear.md) | Each class's channel counts and default weapons (§2.4); Tier 1 armor halves by class; the preset's three weapons and support. A Dual's second kind may be any kind of the class's channel: the slot keeps its strike from its first kind |
| [skill-trees.md](skill-trees.md) | Which three trees each class uses by default; the twelve specializations for the tree's root (Tier 2) and a mastery per class (Tier 3); Q17 left to SK9 |
| [professions.md](professions.md) | Per Uma, per tier: 3 weapons (kinds by §2.4, any by pick), 5 armor pieces in one half (Tier 1), accessories 1 · 2 · 3. No active-class effect on work |
| [variance.md](variance.md) | Class ids, channels, fight types; the calling as the start (CL13); specializations as Tier 2 keys if a template wants one |
| [extra-stats.md](extra-stats.md) | Each class's channels; the hybrids' hands as the mirror's knob |
| Cross-reference views | The class block of the detail page per tier: class chip (+ specialization), three weapon slots with strike badges, armor half, 1–3 accessory slots |
| The world and the Rift (no category doc) | Tier 1's weakness rule, lock rule and shield drafts (§2.2); the fronts' Tier 1 strikes; Tier 2 and 3's narrowing for [tier2-world.md](../tier2-world.md) |

## 8. Assumes

| From | What this doc assumes |
|---|---|
| [README](README.md) §2, to change | (1) Add **the strikes** to the shared frame: each of the ten kinds is Heavy, Flurry or Area, and a class's three slots hold one each. (2) Tier 2's "advanced classes" read as **specializations** of the six (tiers.md T6 and T8, tier2-classes A1, A2, A6 change with it) |
| [gear.md](gear.md) | Weapons carry kinds and a Tier 1 weapon is one kind (GE4). Accessories 1 · 2 · 3: Support, + Damage, + Support; no Orb in Tier 1. Armor halves by class in Tier 1. No gear ranks. The Orb's Tier 1 offense isn't moved elsewhere (§10 puts it back through the foes) |
| [skill-trees.md](skill-trees.md) | One tree per class and kind; the tree's root holds the specialization and the mastery; Q17's crossovers in its Tier 2 branches; the Tier 1 shape and its gates are its own |
| [professions.md](professions.md) | Fight types map to gathering professions by theme and demand only. Its demand math reads §5's counts |
| [variance.md](variance.md) | A calling per Uma by rule; templates never lock a class or change a lean |
| [extra-stats.md](extra-stats.md) | A class-free map; the mirror's re-check is this doc's, through the hands |
| The engine | Tier 1's lock rule, three-weapon validation and one accessory ship in the rework's engine version (v16 if it's next); the strike rule is the generator's, with no engine change. v6–v15 fights replay as they were |

## 9. Save impact

| Data | What happens |
|---|---|
| Each Uma's weapon slots, per class (5 → 3) | **Converted.** The class's default strike plan; in each strike she keeps the weapon she had slotted of that strike and channel (her highest grade first), else the default. Two of today's five leave her slots. Nothing she owns is deleted here; gear.md converts the pieces |
| Equipped skills, per class | Skills of trees she no longer slots drop out; the auto loadout fills the gaps |
| Learned side skills | Kept as today when a weapon leaves a slot; their fate is [skill-trees.md](skill-trees.md)'s |
| The Damage accessory slot, Tier 1 worlds | **Emptied:** the Orb goes back to stock. A Tier 1 Orb has no use in Tier 1 and can't cross tiers, so **every Tier 1 Orb is listed for the refund** (with gear.md's list) |
| Armor | Each slot wears her class's half; pieces of the other half stay hers. Nothing deleted |
| Presets | Computed, never stored |
| Tier 2 worlds | The same weapon conversion. No specialization is stored until picked: the default is derived by A6's rule |
| Class ids, Class Ranks, Hero seats and Bonds | Unchanged |
| Foes | Generated, never saved. The Tier 1 foe digest (`world/tier1-foes.test.ts`) moves on purpose, in the D-row. An open fight replays on its own engine; an open Rift fight keeps its foes |
| Starting class | New unlocks only |

## 10. Pacing

The time to level, the EXP and rewards per fight and the time to gear an Uma on curve keep today's order
([brief](README.md) §2):

- **Fights pay per stage,** not per weapon: Uma EXP, Class Rank EXP and Laurels are untouched.
- **Damage a turn holds.** An Uma acts once a turn whatever she holds. Today about two of a regular foe's four or five
  marks match her five weapons; proposed, one of her three always matches. The share of weak acts stays near 100% for
  an on-curve party.
- **The Orb's offense goes:** −4% at Lv 1 to −16% at Lv 50 on her leading kind's hits ([combat](../../game/combat.md#where-damage-comes-from)).
  Put back through Tier 1's build budget (its offense part) so an on-curve party's rounds a fight stay within ±10% of
  today's.
- **Shields by strike** (CL9): rounds to a stage's first Break within ±0.5 of today's, by stage kind, at Lv 10, 30, 50.
- **Locks** (CL8): Auto cancels a charged move as often as today, ±5 points.
- **Win rates:** every on-curve party shape (the default party, each front's guided party, five of one class) wins
  every Tier 1 stage, within 3 points of today's table (classes v2 §9).
- **The hybrids and healers:** 70/30 ± 5, the mirror ±5% and Paladin vs Cleric ±10%, re-measured (§2.5); the Rift's
  §11 targets and the Duel's guard rail too. The strikes lower the best single act (the Spell Blade's Bow and Light
  flurries no longer pair by default), so the Duel's shields may come down.
- **Gearing:** 9 pieces in Tier 1, from 12. [professions.md](professions.md)'s demand math sets the materials so the time
  to gear an Uma on curve holds. (If gear ranks stayed, a win's weapon EXP would become E a slot, 3E, keeping each
  weapon's pace; gear.md drops them.)
- **Tier 2:** the specializations' worth (+8–15% where they apply, ≤ 5% elsewhere, tier2-classes §10) and the Orb are
  priced into Tier 2's build budget, as planned.

## 11. Decisions

| Call | Recommendation | Alternatives | Why |
|---|---|---|---|
| **CL1** Weapon slots | **Three in every tier, typed by strike** (one Heavy, one Flurry, one Area); the class sets the Arms count: 3, 0, 2 (Spell Blade, Paladin), 1 (Summoner, Cleric) | Three untyped slots, balanced only on defaults; keep five | Typing makes the balance hold for any pick; three is the owner's number |
| **CL2** Tier 1 foe weaknesses | **One strike a foe**, by the ring read one level up (§2.2); every Tier 1 foe, the Rift's fronts on their channel | By channel (five Brawlers can't touch a magic-weak foe, and weapon choice disappears); a small kind set per continent (re-picks every continent); kinds with coverage forced by the generator (breaks on the first re-pick) | One badge to read, every Uma always has an answer, and the ring survives for Tier 2 |
| **CL3** What "balanced" means | **Three tests:** every member chips every world foe; each front's guided party has ≥ 3 members chipping each of its foes; the five types hold all ten kinds | "At least one member chips" (too weak: one Paladin chipping a boss) | Checkable by script before a fight; win rates stay the simulation's |
| **CL4** Default weapons | **§2.4's table:** the hybrids' Heavy in their minor channel, the healers' Area in theirs | Each class's first three of today's five (Iron and Arcane uneven, Katana and Light lost) | Iron and Arcane become exact mirrors; all ten kinds in the five types; most of each class's v2 specials kept |
| **CL5** The hybrids' pair on 2 + 1 | **Hands unchanged** (0.72 + 0.44, 0.58 + 0.56); the simulation re-checks 70/30 ± 5 and the mirror ±5%, with the hands as the knob | New hands now | One act is one pair whatever the slots; a draft number now would only be guessed |
| **CL6** Template per tier | **Weapons 3 · 3 · 3; armor 5 · 5 · 5; accessories 1 · 2 · 3** (Support; + Damage; + Support, with gear.md). Tier 1 armor in her class's half | A sixth armor piece or a fourth weapon later | Depth comes from gear's forms, the trees and Extra Stats, not from more slots |
| **CL7** Tier 1's one accessory | **The Support slot**; the Orb arrives in Tier 2 | The Damage slot; a free slot | Support carries a role and the MP economy; an Orb specializes in a kind, which matters once kinds do |
| **CL8** Charged moves in Tier 1 | **A lock breaks to a weak act,** one an Uma; the Duel alternates Arms and Tome acts | Kinds drawn from her strike (a lock nobody in the party holds) | Every party can answer; the count stays a read |
| **CL9** Shields by strike | **Drafts: Flurry-weak ×1.5, an Area-weak crowd +1;** the simulation sets them to today's rounds to a Break | One shield for all strikes | Flurry chips about twice as fast; one sweep chips a whole crowd |
| **CL10** Weaknesses after Tier 1 | **The strike stays; the kinds narrow:** two in Tier 2 (the ring's element and an Arm), one in Tier 3; for tier2-world.md | Today's random lists in Tier 2 | The same mental model in every tier; picks and gear's extra kinds get a job |
| **CL11** Tier 2's advanced classes | **Specializations:** the six stay, each gains one of two passives (tier2-classes' twelve, as written), swapped freely, no lean change, no new ids | Twelve classes as tier2-classes writes them; drop them | Keeps the promotion feel and the content without twelve tables, emblems and an Ascend pick |
| **CL12** Tier 3 | **A mastery per class (six)** and a second Support slot; designed with Tier 3 | A master per specialization (twelve) | Later tiers stay simpler than the proposal they replace |
| **CL13** Starting class | **Today's rule plus the calling:** a Pace chaser with Power over Wit starts as a Spell Blade | Today's (no Spell Blade starts) | Every class has starters; variance.md's calling and the start agree |
| **CL14** Class and professions | **No effect:** a class switch moves no job; fight types only name the professions' themes | An active-class job bonus | Switching is free, and work shouldn't change when a party does |
| **CL15** The strikes' names | **Heavy, Flurry, Area** | Impact, Barrage, Sweep ("Sweep" is the Sweep Ticket's word) | Plain words. "Heavy" and "Flurry" also start or end some skill names (the healers' "Heavy …" sides, the Spell Blade's "… Flurry"); skill-trees.md keeps or renames them with the trees |
