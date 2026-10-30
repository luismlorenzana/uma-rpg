# Classes and weapons

Thirteen classes in a tree and ten weapons, as engine v19 and save v32 play them (Classes v3, D240). Every Uma starts as
her calling's **Tier 0**, an introductory class, and at Class Rank 10 promotes into one of its **Tier 1** classes. She
has one **active class** at a time and switches freely among the classes she holds; each keeps its own three weapons,
her line on each of its trees and her equipped skills. A fight already open keeps the setup it started with. Fights from
engine v18 and before replay with six classes (Brawler, Mage, Spell Blade, Summoner, Paladin, Cleric), their hands,
trees and twins and the 24 Limit Breaks ([combat](combat.md)).

Classes and weapons are set on her profile's **Skills** tab (the Stable → an Uma, [sections](sections.md#stable)): its
class button opens the **Classes** sheet, the class tree (or the promotion sheet while one waits), and its three tree
buttons hold her weapons. Each class has a pixel emblem, shown on its tile, on her profile and on the party bars.

Code: `packages/domain/src/rpg/class-tree.ts` (the tree: roots, parents and children, Tier 0's ladder, skill and
suggestion, the names, the gates), `rpg/kinds.ts` (the classes by generation, weapons, kinds, twins, the healers),
`rpg/rules.ts` (slots, defaults, hands, leans, held skills, Skill Ranks, the auto loadout), `rpg/node-identity.ts`
(lines), `rpg/catalog.ts` (the trees, see [skill trees](skill-trees.md)), `roster/template.ts` (her calling and
template), `save/class.ts` (her starting and active class, the classes she holds, one healer a party),
`save/class-tiles.ts` (the tree's tiles), `save/battle.ts` (switching, promotion, weapons, lines and the fight's setup),
`save/presets.ts` (standard presets), `save/forge.ts` (accessory forms), `economy/grades.ts`, `economy/accessories.ts` and
`economy/planet.ts` (gear, the signature, her moon). Design intent: [Classes v3](../design/classes-v3/classes-v3.md),
[class progression](../design/tier-rework/class-progression.md), [Uma templates](../design/tier-rework/uma-templates.md),
[weapon progression](../design/tier-rework/weapon-progression.md).

## The class tree

Three **roots**, left to right, physical to magical: **Warrior**, **All-Rounder** and **Mage**. A root is a label, never
a class she fights as. Five **Tier 0** classes sit under them and eight **Tier 1** classes below. A Tier 1 class opens by
promotion from a parent at Class Rank 10; a hybrid has two parents, its All-Rounder Tier 0 and its channel's root class.

```
             WARRIOR    │                 ALL-ROUNDER                   │     MAGE
────────────────────────┼───────────────────────────────────────────────┼──────────────
 Tier 0      Warrior    │  Spellblade          Healer       Summoner        │   Mage
────────────────────────┼───────────────────────────────────────────────┼──────────────
 Tier 1      Brawler    │  Arms Spellblade  Paladin       Arms Summoner │   Sorcerer
             ◄ Warrior  │  ◄ Warrior        ◄ Healer     ◄ Warrior     │   ◄ Mage
                        │  ◄ Spellblade                      ◄ Summoner      │
                        │  Tome Spellblade  Cleric        Tome Summoner │
                        │  ◄ Spellblade        ◄ Healer     ◄ Summoner      │
                        │  ◄ Mage                     ◄ Mage    │
```

| Class | Plays like |
|---|---|
| **A Tier 0** (Warrior, Spellblade, Healer, Summoner, Mage) | An introduction: one skill on any three weapons, one foe and one hit, its power rising with every Class Rank to 10. No lean, no support ([below](#tier-0-and-promotion)) |
| **Brawler** | Pure physical. Three Arms, one full act a turn |
| **Sorcerer** | Pure magic. Three Tomes, one full cast a turn. Engine v18's Mage, renamed (her id stays `mage`) |
| **Arms Spellblade** | Two Arms and a Tome, physical-led multi-hit. Every act is an Arms half and a Tome half, the Arms half the larger and first; it lands one extra hit (the same total), so she chips shields fast. All her skills strike one foe; her line B, Pierce, cuts through a standing shield. Engine v18's Spell Blade, renamed |
| **Tome Spellblade** | Her mirror, magic-led: two Tomes and an Arm, the Tome half the larger and first, with the extra hit. Her skills carry her own names; line B Pierce on every tree |
| **Arms Summoner** | Two Arms and a Tome, physical-led area. Every act is an Arms summon and a Tome summon, the Arms summon first. The Arms summon stays; when her next pair comes it strikes every foe once in farewell and leaves. The Tome summon strikes and goes. No support |
| **Tome Summoner** | Her mirror, magic-led: the Tome summon first, and it lingers. Engine v18's Summoner, renamed, with new defaults |
| **Paladin** | Two Arms and a Tome. A healer whose mends and Barriers grow with her ATK. Her blows weaken the foe they hit and Barrier the Uma in most danger; her spells bless the party, mend the most hurt and cleanse. Her Blizzard spells also Barrier every Uma, her Greatsword blows give Aegis to whoever they Barrier, her Axe weakens every foe from depth 4, and Valkyrie's Oath, her Light tree's depth-3 B, raises the fallen |
| **Cleric** | Two Tomes and an Arm. A healer whose mends and Barriers grow with her M.ATK, with the Paladin's kit. Her Light spells leave Regen, a mend that repeats; her Dark spells drain; Rebirth, her Light tree's depth-3 B, raises the fallen |

Every class but the Paladin and the Cleric deals damage only. The two healers act at half power and carry the party's
support ([combat](combat.md#support)).

**One healer a party** (C8, D178): a party fights with one Paladin or Cleric at most. A Tier 0 is no healer, the Healer
included. A party with two shows "One healer a party" in the Party Hall, on the world map's party bar and in the Rift's
party slots, and can't start a fight until one of them changes class; the engine refuses such a party too. Party edits
and class switches are never refused, and Sweeps don't fight, so they don't check.

<!-- live:classes -->
| Class | Tier | Root or parents | Slots | Trees | Hand: power, MP | Special | Stat lean (HP, ATK, MATK, DEF, MDEF, MP) | Limit Break scale | Her calling (starts as) | Starting armor |
|---|---|---|---|---|---|---|---|---|---|---|
| Warrior | 0 | Warrior root | Any 3 | Any | ×1, MP ×1 | Tier 0: one skill, Drill Strike, on any of her three weapons; promotes at Class Rank 10. No healer | ×1 ×1 ×1 ×1 ×1 ×1 | ×1 | 1. Front among her best styles | Physical |
| Spellblade | 0 | All-Rounder root | Any 3 | Any | ×1, MP ×1 | Tier 0: one skill, Feint, on any of her three weapons; promotes at Class Rank 10. No healer | ×1 ×1 ×1 ×1 ×1 ×1 | ×1 | 2. Pace alone | Physical |
| Healer | 0 | All-Rounder root | Any 3 | Any | ×1, MP ×1 | Tier 0: one skill, Vigil, on any of her three weapons; promotes at Class Rank 10. No healer | ×1 ×1 ×1 ×1 ×1 ×1 | ×1 | 5. Late alone | Magical |
| Summoner | 0 | All-Rounder root | Any 3 | Any | ×1, MP ×1 | Tier 0: one skill, Beckon, on any of her three weapons; promotes at Class Rank 10. No healer | ×1 ×1 ×1 ×1 ×1 ×1 | ×1 | 4. End among them (Late + End, or End alone) | Magical |
| Mage | 0 | Mage root | Any 3 | Any | ×1, MP ×1 | Tier 0: one skill, Primer, on any of her three weapons; promotes at Class Rank 10. No healer | ×1 ×1 ×1 ×1 ×1 ×1 | ×1 | 3. Pace with Late or End | Magical |
| Brawler | 1 | Promotes from Warrior | 3 Arms | 5 | ×1, MP ×1 | — | ×1.15 ×1.1 ×0.9 ×1.1 ×0.9 ×0.8 | ×0.95 | — | Physical |
| Arms Spellblade | 1 | Promotes from Warrior or Spellblade | 2 Arms + 1 Tome | 10 | ×0.72 Arms, ×0.44 Tome; MP ×0.5 a half | Every act is an Arms half and a Tome half, the Arms half first; it lands one extra hit | ×1 ×1.1 ×0.95 ×1 ×1 ×1 | ×0.95 | — | Physical |
| Arms Summoner | 1 | Promotes from Warrior or Summoner | 2 Arms + 1 Tome | 10 | ×0.57 Arms, ×0.46 Tome; MP ×0.5 a half | Every act is an Arms summon and a Tome summon, the Arms half first. The Arms summon lingers; when her next pair comes, it strikes every foe at 0.3 × 0.1. No support | ×1 ×1.1 ×0.95 ×1 ×1 ×1 | ×0.95 | — | Physical |
| Paladin | 1 | Promotes from Healer | 2 Arms + 1 Tome | 10 | ×0.5, MP ×0.6 | Healer, from ATK. Blows debuff the foe and Barrier the threatened Uma; spells bless, mend and cleanse. Blizzard spells Barrier every Uma, Greatsword blows give Aegis | ×1 ×1 ×0.8 ×1.15 ×1 ×1.3 | ×0.8 | — | Physical |
| Cleric | 1 | Promotes from Healer | 2 Tomes + 1 Arm | 10 | ×0.5, MP ×0.6 | Healer, from M.ATK. Blows debuff the foe and Barrier the threatened Uma; spells bless, mend and cleanse. Light spells leave Regen, Dark spells drain | ×1 ×0.8 ×1 ×1 ×1.15 ×1.3 | ×0.8 | — | Magical |
| Tome Summoner | 1 | Promotes from Summoner or Mage | 2 Tomes + 1 Arm | 10 | ×0.5 Arms, ×0.57 Tome; MP ×0.5 a half | Every act is a Tome summon and an Arms summon, the Tome half first. The Tome summon lingers; when her next pair comes, it strikes every foe at 0.3 × 0.1. No support | ×1 ×0.95 ×1.1 ×1 ×1 ×1 | ×0.95 | — | Magical |
| Tome Spellblade | 1 | Promotes from Spellblade or Mage | 2 Tomes + 1 Arm | 10 | ×0.48 Arms, ×0.72 Tome; MP ×0.5 a half | Every act is a Tome half and an Arms half, the Tome half first; it lands one extra hit | ×1 ×0.95 ×1.1 ×1 ×1 ×1 | ×0.95 | — | Magical |
| Sorcerer | 1 | Promotes from Mage | 3 Tomes | 5 | ×1, MP ×1 | — | ×0.9 ×0.9 ×1.15 ×0.9 ×1.1 ×1.3 | ×0.95 | — | Magical |
<!-- /live -->

- **Tier, Root or parents:** a Tier 0's root column; a Tier 1 class's parents, the Tier 0s she promotes from.
- **Slots:** her three weapon slots by channel, the lead channel first ([weapons](#weapons)). A Tier 0's take any weapon.
- **Trees:** the trees her slots can open: the Brawler's five Arms, the Sorcerer's five Tomes, all ten for the others. A
  Tier 0 holds a one-node tree on each of her three weapons.
- **Hand:** the share of full power and full MP her acts use; a Brawler's Attack is 1.0. A pair's lead half is the larger
  and resolves first: the Arms Spellblade's Arms 0.72 with a Tome 0.44, the Tome Spellblade's Tome 0.72 with an Arm 0.48,
  the Arms Summoner's Arms 0.57 with a Tome 0.46, the Tome Summoner's Tome 0.57 with an Arm 0.5 (H131's balance, D249).
  Each half costs its own MP. A Spellblade's halves add up to a little more than one full turn; a Summoner's farewell
  comes on top of hers, so the two pairs deal about the same a turn (the Summoners 98–106% of the Spellblades at Lv
  10–50, the Tome Summoner 114% at Lv 10). The healers act at half power for 0.6 of the MP; a Tier 0 at full.
- **Stat lean:** multiplies her projected HP, ATK, M.ATK, DEF, M.DEF and MP while she fights as the class
  ([combat](combat.md#damage)). A Tier 0 has none.
- **Limit Break scale:** what a Limit Break she casts as this class is worth, × its own power ([Limit
  Breaks](#limit-breaks)).
- **Her calling (starts as):** the running styles that make a Tier 0 her calling ([below](#her-calling-and-her-template)).
  A Tier 1 class is reached by promotion.
- **Starting armor** is the class's armor half: her armor's offense goes to ATK or M.ATK by the class she fights as
  ([armor](#armor-and-the-accessory)). A Tier 0's goes by her slots instead, a third a slot; the column names the piece
  she wears. There is no armor kind to choose or start in.

## Tier 0 and promotion

Each Tier 0 carries its family's name, the word in its hall's name (D259): the **Warrior**, the **Spellblade**, the **Healer**,
the **Summoner** and the **Mage**. Their ids stay `recruit`, `duelist`, `acolyte`, `caller` and `apprentice`, and the id
`mage` is the Sorcerer. The name says the family, not what she does yet: a Tier 0 Healer strikes and a Tier 0 Summoner
calls nothing until she promotes.

Five introductory classes, one per Tier 1 family (CV5–CV11). Every Uma starts as one, her calling's, and **every Tier 0
is open to every Uma** at Class Rank 1, free.

- **One skill** (CV6): Drill Strike, Feint, Vigil, Beckon or Primer, the same numbers for all five. Each of her three
  weapons' trees holds it as its one node, so she holds it three times, once in each weapon's kind and channel ("Drill
  Strike · Greatsword", "Drill Strike · Fire Tome"): one hit on one foe, an Arm's with ATK on DEF, a Tome's with M.ATK on
  M.DEF, weak where its kind is. **Its power is her Class Rank's**, 1.60 at Rank 1 to 2.31 at Rank 10 (H131's ×1.05 on
  the design's 1.52 → 2.20, D249), with no Skill Rank on top, and it costs 10 MP. No rider, special, status or support;
  the Healer's deals damage like the rest. Her three equipped slots at Lv 1 hold all three; the fourth (Lv 10) waits for
  her promotion.
- **Three slots, any of the ten weapons,** three different kinds. Each Tier 0 starts on the defaults of the child it
  models (the Warrior the Brawler's, the Spellblade the Arms Spellblade's, the Healer the Cleric's, the Summoner the Tome
  Summoner's, the Mage the Sorcerer's), and a party of the five on defaults holds all ten kinds. Its standard presets are
  its children's, one each, so she can start on the weapons she'll keep ([below](#standard-presets)).
- **Her hand is ×1** on both channels, one act a turn, MP ×1. **No stat lean.** Her armor's offense and her Prowess go a
  third a slot to its channel (three Arms all ATK, two Arms and a Tome two thirds ATK).
- **Her base MP regen** is depth 1's, 1% of her max MP a round; her Limit Break's power reads her skill's power at her
  Class Rank, at a scale of 1.
- **Her ladder** (CV5): twice the Tier 1 curve, 2 × (120 + 16 × rank), 3,600 EXP from Rank 1 to Rank 10. A win pays the
  class she fought as 2E for E Uma EXP, so an Uma who fights as her Tier 0 from Lv 1 reaches Class Rank r with Uma Lv r:
  Rank 10 with Lv 10, the first continent's capital.

<!-- live:tier0 -->
| Tier 0 | Root | Her skill | Defaults and form of | Promotes into | Suggested | Her Flourish works as |
|---|---|---|---|---|---|---|
| Warrior | Warrior | Drill Strike | Brawler | Brawler, Arms Spellblade, Arms Summoner | Brawler | Warrior, Brawler, Arms Spellblade, Arms Summoner |
| Spellblade | All-Rounder | Feint | Arms Spellblade | Arms Spellblade, Tome Spellblade | Arms Spellblade (Power over Wit), Tome Spellblade (Wit at or over Power) | Spellblade, Arms Spellblade, Tome Spellblade |
| Healer | All-Rounder | Vigil | Cleric | Paladin, Cleric | Paladin (Power over Wit), Cleric (Wit at or over Power) | Healer, Paladin, Cleric |
| Summoner | All-Rounder | Beckon | Tome Summoner | Arms Summoner, Tome Summoner | Arms Summoner (Power over Wit), Tome Summoner (Wit at or over Power) | Summoner, Arms Summoner, Tome Summoner |
| Mage | Mage | Primer | Sorcerer | Sorcerer, Tome Spellblade, Tome Summoner | Sorcerer | Mage, Sorcerer, Tome Spellblade, Tome Summoner |

| Class Rank | EXP to next | EXP from Rank 1 | Her skill's power |
|---|---|---|---|
| 1 | 272 | 0 | 1.6 |
| 2 | 304 | 272 | 1.68 |
| 3 | 336 | 576 | 1.75 |
| 4 | 368 | 912 | 1.84 |
| 5 | 400 | 1,280 | 1.91 |
| 6 | 432 | 1,680 | 2 |
| 7 | 464 | 2,112 | 2.07 |
| 8 | 496 | 2,576 | 2.15 |
| 9 | 528 | 3,072 | 2.23 |
| 10 | — | 3,600 | 2.31 |

At Rank 10 her EXP waits for her promotion, up to 23,680; past that it banks as Class Marks at half.
<!-- /live -->

**Promotion** (CV8, CV11; `promoteUma`): at her Tier 0's Class Rank 10 each of its children opens to her.

| Rule | |
|---|---|
| **When** | Her Tier 0 reaches Class Rank 10, by fights, Sweeps, Echoes or Class Manuals |
| **What it opens** | Each child: the Warrior's three, the Mage's three, the Spellblade's, the Summoner's and the Healer's two. A child she can promote into now is **Ready**; she can't switch to it or read Manuals onto it before she promotes |
| **Promoting** | Free and final, from the promotion sheet. The child opens **at Class Rank 10** with depths 1 and 2 open (six skills on her three weapons), on its [weapon preset](#standard-presets) with every line on A, and she fights as it from then |
| **The waiting EXP** | Everything her Tier 0 earned past Rank 10 flows into the new class's bar at once (past Rank 50 it banks as Class Marks at half). Her Tier 0 stays at Rank 10 with nothing waiting |
| **More children** | Promoting into a sibling later is free too: it opens at Rank 10 with whatever waits then |
| **Never** | Closes a class, costs anything, or moves her calling, trade or template |
| **Suggested** | One child carries a "Suggested" badge: the Warrior's Brawler, the Mage's Sorcerer; for the Spellblade, the Summoner and the Healer the Arms child (or the Paladin) when her base Power beats her base Wit, else the Tome child (or the Cleric) |

**Why Rank 10, not Rank 1:** the world's sub-bosses and bosses are built for the depth a level can reach (depth 2 from Lv
10, 3 from 20, 4 from 30, 5 from 40). Opened at Rank 10, a Tier 1 class carries on the same ladder, so an Uma who fights
as her Tier 0 from Lv 1 and promotes at 10 opens depths 2–5 at Uma Lv 10 · 16 · 22 · 29 and Rank 50 at 36 (H131, D249),
each before its foes. A campaign (Lv 1–50) takes one Tier 0 to Rank 10 and two Tier 1 classes of her family to Rank 50.

**Tier 0 exists only in Tier 1's world** (CV10). A Tier 2 or 3 world has none: every Tier 1 class is open there from
Class Rank 1. An Uma who ascends while fighting as a Tier 0 arrives as her suggested promotion, at Class Rank 1
([loops](loops.md#the-rift)).

### Reclassing

The class tree is the reclass map, on the Classes sheet ([sections](sections.md#stable)). The rules (CV9):

- **The classes she holds switch freely,** outside fights: the five Tier 0s and every Tier 1 class she has promoted
  into, each with its own Class Rank, weapons, lines and equipped skills.
- **Every Tier 0 is open to every Uma,** at Class Rank 1, free ("Start Summoner · R1"). Her calling's is where she starts,
  not a lock.
- **A Tier 1 class opens by promotion** from either parent at Class Rank 10, and is hers for good: a Tier 1 class she
  holds in Tier 1's world is one with a Class Rank, always 10 or more. A closed one says how it opens ("Opens with
  Warrior R10 or Summoner R10").

| From | To | What it takes |
|---|---|---|
| Brawler | Arms Spellblade or Arms Summoner | Nothing: her Warrior is at Rank 10, so its other children are one tap |
| Brawler | Tome Spellblade | A Spellblade or a Mage to Rank 10: 3,600 Class EXP, 4 Class Manuals or the first continent's fights |
| Brawler | Cleric | A Healer to Rank 10: the same 3,600 |
| Any | A class she holds | Nothing |
| Any | Gear | Only the new class's weapons she hasn't raised: a grade belongs to the weapon and serves every class |

Her own family is free; another family costs one Tier 0 at Rank 10, paid with fights or Manuals.

## Her calling and her template

**Her calling** (CV19) is her Tier 0, read from her best running styles (every style at her top grade) alone: no Power,
Wit or distance, and no pick. The first row that fits:

| # | Her best styles | Her calling | Outfits on the release |
|---|---|---|---|
| 1 | **Front** among them | **Warrior** | 47 |
| 2 | **Pace** alone | **Spellblade** | 72 |
| 3 | **Pace with Late or End** | **Mage** | 72 |
| 4 | **End** among them (Late + End, or End alone) | **Summoner** | 33 |
| 5 | **Late** alone | **Healer** | 46 |

The counts are the 270 outfits of the master-data release the design read (counts only).

- **She starts in it.** A new Uma is written as her calling's Tier 0 in Tier 1's world, as its suggested promotion in a
  later one. An Uma with no class written fights as the same: in Tier 1's world save v32's reset left every Uma so.
- **No calling pick:** the promotion is the pick. A pure Late Uma chooses the Paladin or the Cleric on her promotion
  sheet, a Pace Uma her Spellblade or her Mage's three, and she can take the other later. Save v32 dropped the stored
  picks ([loops](loops.md#the-classes-are-rebuilt-save-v32)).

**Her template** (UT2–UT6, D203, D204; CV21): three readings of her racing profile name her "{knack word} {type}", one of
75, the same in every tier: her **calling**, her **stride** (the longest distance at her best distance grade) and her
**knack** (her top growth rate; ties go to the higher base stat, then Speed, Stamina, Power, Guts, Wit). Her calling and
stride give her type, her knack its word: "Clever Spellwright". Five callings × three strides make fifteen types.

<!-- live:templates -->
| Calling | Dash | Middle | Stayer | Moon II |
|---|---|---|---|---|
| Warrior | Charger | Bruiser | Ironhide | DEF |
| Spellblade | Flashblade | Spellfencer | Longblade | DEF and M.DEF, half each |
| Mage | Flarecaster | Spellwright | Starkeeper | M.DEF |
| Summoner | Beckoner | Binder | Shepherd | DEF and M.DEF, half each |
| Healer | Lamplighter | Mender | Pilgrim | DEF and M.DEF, half each |

| Knack: her top growth rate | Word |
|---|---|
| Speed | Fleet |
| Power | Mighty |
| Stamina | Tireless |
| Guts | Gritty |
| Wit | Clever |

| Stride: her longest distance at her best grade | Flourish | As her calling's family |
|---|---|---|
| Dash (Sprint or Mile) | Clean break | a Barrier of 4% of her max HP at the start |
| Middle (Medium) | Even pace | 1% of her max HP at each round's end, up to 4% |
| Stayer (Long) | Late reserve | 2% of her max HP at each round's end from round 3, up to 4% |
<!-- /live -->

Its four pieces all work in Tier 1:

- **★ Her Flourish** works while she fights as any class of her calling's family: her Tier 0 and its children ("No
  effect as Sorcerer" otherwise). A Spellblade or a Summoner belongs to two families, so a Warrior-calling Uma and a
  Spellblade-calling Uma both keep it as an Arms Spellblade. It gives 4% of her max HP a fight, in her stride's shape. Clean
  break's Barrier lapses at round 1's end. Not a heal skill: no healing scale, it never overheals, and a fallen Uma gets
  none. Once a fight, not each wave ([combat](combat.md#sustain-mp-and-the-flourish)).
- **★ Her signature** (UT7, D212): her knack names an accessory family: Fleet the Charm, Mighty the Orb, Tireless the
  Pendant, Gritty and Clever the Insignia. While one of her accessory slots wears that family at G1 or more, her ATK and M.ATK
  rise 0.2 a level × the tier (Tier 1: +2, +6, +10 at Lv 10, 30, 50), whatever class she fights as. Her standard preset
  wears it, and the Gear tab lists her family first with a ★ ([materials](materials.md#gear)).
- **★ Her moon** (UT10, D213): two nodes beside her Extra Stats map, opened by a Moon Jewel II (Lv 16) and IV (Lv 36).
  Node I gives +4 × the tier to her knack's stat: Tireless HP, Clever MP, Mighty DEF and M.DEF, Fleet 4 Speed points
  (2.4% evasion) and Gritty 4 Limit points (a starting charge of 1), those two in every tier. Node II gives +8 × the tier
  to her calling's root's defense: DEF +8 for a Warrior, M.DEF +8 for a Mage, DEF +4 and M.DEF +4
  for a Spellblade, a Summoner or a Healer (All-Rounder). Both count whatever class she fights as
  ([loops](loops.md#extra-stats-and-gear)).
- **Her trade** (PP2, CV20): her calling names her trade, one material line's three Wilds places: the Warrior Metal, the
  Spellblade Wood, the Healer Vegetables, the Summoner Fish, the Mage Stone ([loops](loops.md#craft-level)). A class
  switch or a promotion never moves it.
- **Nothing else moves:** a template adds no damage kind, lean, hand or rule, and never takes anything away.

The template's chip and card are on the Uma sheet ([sections](sections.md#stable)); the Stable filters by calling,
stride, knack, signature and trade.

## Weapons

Ten weapons: five **Arms**, each its own physical kind, and five **Tomes**, each dealing its element. Each pair of an Arm
and its twin element has one **shape** (CV12), on the Brawler's and the Sorcerer's trunks and A lines and on both
Summoners' summons:

| Kinds | Shape | One act |
|---|---|---|
| Greatsword, Fire | **Heavy** | One foe: the Greatsword 1 · 1 · 2 · 2 · 3 hits by depth, Fire one |
| Axe, Ice | **Sweep** | Every foe, ×0.55 a foe; +4 MP |
| Lance, Lightning | **Scatter** | Random foes, many hits, ×1.05 |
| Katana, Light | **Double** | One foe, two hits at every depth |
| Bow, Dark | **Volley** | The tapped foe takes 0.8 of the depth's power in 1 · 1 · 2 · 2 · 3 hits, then one splash hit of 0.35 on every other foe; +2 MP |

**The volley** (D246): its depth-5 rider or special lands on the tapped foe, and its splash is plain: no special, and no
rider on a foe only the splash struck, though a weak splash still chips a shield and breaks a lock. What an act is worth
in single-target units, by the foes standing (H131 measured every shape within 0.01 of it):

| Foes standing | Heavy | Double | Scatter | Sweep | Volley |
|---|---|---|---|---|---|
| 1 | 1.00 | 1.00 | 1.05 | 0.55 | 0.80 |
| 2 | 1.00 | 1.00 | 1.05 | 1.10 | 1.15 |
| 3 | 1.00 | 1.00 | 1.05 | 1.65 | 1.50 |
| 5 | 1.00 | 1.00 | 1.05 | 2.75 | 2.20 |

So the volley is the best act on two foes, second to the sweep on a crowd and better than it on one. Both Spellblades'
skills strike one foe, their kinds differing only in their hits; the healers' skills each strike one foe once; a Tier 0's
skill and an Attack are one hit on one foe. A line B can change the shape ([skill
trees](skill-trees.md#the-lines-at-a-glance)). A Paladin's or a Cleric's skills with a weapon carry its healer status:
her blows on the foe they hit, her spells on every Uma.

**Twins** (CV13): each Arm has a twin element: Greatsword and Fire, Axe and Ice, Lance and Lightning, **Katana and Light**
(the doubles) and **Bow and Dark** (the volleys); the Bow and the Katana together are **Twilight**, a Light and Dark foe's
Arms. The twin sets are what the Rift's fronts draw, what a Hall's seat reads ([heroes](heroes.md#learners)) and how a
hybrid's preset places an Orb; the world's stages deal each foe her own list
([combat](combat.md#weaknesses-shields-and-breaks)). Engine v18 and before paired the Bow with Light and the Katana with
Dark, and their fights replay so.

**Colors** (D234): every kind has its own color on screen, each Arm beside its twin: Fire red, Ice blue, Lightning
yellow, Light pale gold, Dark violet; Greatsword orange, Axe purple, Lance green, Katana jade, Bow rose. With the twins
re-paired the Bow and the Katana swapped their tones, so each still sits beside its twin.

<!-- live:weapons -->
| Weapon | Id | Kind | Channel | Shape | Healer status | Classes |
|---|---|---|---|---|---|---|
| Greatsword | `greatsword` | Greatsword | Physical | One foe, heavy | Armor Break | Every Tier 0, Brawler, Arms Spellblade, Arms Summoner, Paladin, Cleric, Tome Summoner, Tome Spellblade |
| Axe | `axe` | Axe | Physical | Every foe | Enfeeble | Every Tier 0, Brawler, Arms Spellblade, Arms Summoner, Paladin, Cleric, Tome Summoner, Tome Spellblade |
| Lance | `lance` | Lance | Physical | Random foes | Mind Break | Every Tier 0, Brawler, Arms Spellblade, Arms Summoner, Paladin, Cleric, Tome Summoner, Tome Spellblade |
| Bow | `bow` | Bow | Physical | A volley: one foe at 0.8, a splash of 0.35 on every other | Shatter | Every Tier 0, Brawler, Arms Spellblade, Arms Summoner, Paladin, Cleric, Tome Summoner, Tome Spellblade |
| Katana | `katana` | Katana | Physical | A double: one foe, two hits | Hex | Every Tier 0, Brawler, Arms Spellblade, Arms Summoner, Paladin, Cleric, Tome Summoner, Tome Spellblade |
| Fire Tome | `tome-fire` | Fire | Magical | One foe, heavy | Brave | Every Tier 0, Arms Spellblade, Arms Summoner, Paladin, Cleric, Tome Summoner, Tome Spellblade, Sorcerer |
| Blizzard Tome | `tome-ice` | Ice | Magical | Every foe | Aegis | Every Tier 0, Arms Spellblade, Arms Summoner, Paladin, Cleric, Tome Summoner, Tome Spellblade, Sorcerer |
| Thunder Tome | `tome-lightning` | Lightning | Magical | Random foes | Breaker | Every Tier 0, Arms Spellblade, Arms Summoner, Paladin, Cleric, Tome Summoner, Tome Spellblade, Sorcerer |
| Light Tome | `tome-light` | Light | Magical | A double: one foe, two hits | Faith | Every Tier 0, Arms Spellblade, Arms Summoner, Paladin, Cleric, Tome Summoner, Tome Spellblade, Sorcerer |
| Dark Tome | `tome-dark` | Dark | Magical | A volley: one foe at 0.8, a splash of 0.35 on every other | Clarity | Every Tier 0, Arms Spellblade, Arms Summoner, Paladin, Cleric, Tome Summoner, Tome Spellblade, Sorcerer |
<!-- /live -->

The table's **Shape** is the kind's shape above.

**Three weapon slots, by channel (CP2).** A class has three slots, each an **Arms** or a **Tome** slot, the lead channel
first: a Brawler three Arms, a Sorcerer three Tomes; an Arms Spellblade, an Arms Summoner and a Paladin two Arms and a
Tome; a Tome Spellblade, a Tome Summoner and a Cleric two Tomes and an Arm. A Tier 0's three slots take any weapon. Every
class picks: any kind of a slot's channel fits it, three different kinds, and swaps within a channel are free. The weapon
in each slot opens its tree. A class she hasn't set up holds its three defaults ([below](#standard-presets)). When she stops
slotting a kind, her equipped skills of its tree leave her loadout (a loadout left empty goes back to auto); her line on
that tree stays.

**Each weapon has a grade** (WP2, FL4), G0 to G10, raised with Arms Gems for an Arm and Tome Ink for a Tome; grade g
opens at Uma Lv 5g − 4. G0 opens the tree with no Might, and each grade's Might joins her offense on the hits made with
that weapon ([materials](materials.md#gear)). The grade belongs to the weapon, so it serves every class that slots it.

### Armor and the accessory

**Armor:** five slots, head, body, legs, arms and feet, each at a grade raised with Armor Fittings and each adding its
stat (DEF, HP, MP, M.DEF, Speed). Every piece also adds offense to her class's half: ATK for a Brawler, an Arms
Spellblade, an Arms Summoner or a Paladin, M.ATK for a Sorcerer, a Tome Spellblade, a Tome Summoner or a Cleric, a third a
slot to each slot's channel for a Tier 0. So switching class switches it.

**Three accessory slots, in every tier** (D264; was 1 · 2 · 3 by tier, WP19): each has its own grade, raised with Accessory
Settings, and its own family, a setting changed freely outside fights. The same family can fill more than one. G0 does
nothing. The four families:

- **Pendant:** +ATK.
- **Charm:** +M.ATK. Its id is `bell`, and it wears the Bell's icon.
- **Orb:** flat offense on one kind, one of her three weapons' kinds.
- **Insignia:** her hits on sub-bosses and bosses hit harder.

Values are in [materials](materials.md#gear) and how they reach a hit in [combat](combat.md#damage). The slots are hers, not
her class's: after a class or weapon switch, an Orb left on a kind she no longer slots stays set, and its card says so. She
sets them on the Gear tab's Equip view: one section a slot, four cards of one shape, her ★ signature family first.

### Standard presets

**Each Tier 1 class has one, and a Tier 0 picks among its children's (D263, D164, WP25).** The Gear tab's Equip view lists
them: a Tier 1 class's "Standard preset", or one row for each class a Tier 0 promotes into, so she starts on the weapons she
means to keep: three rows for the Warrior and the Mage, two for the Spellblade, the Summoner and the Healer.

A tap puts her active class on those three weapons and sets all three accessory slots: the class's set below, with her ★
signature family first, in the place of one of its own or else of slot 1. An Orb sits on her first weapon's kind (a hybrid's
on the kind of her lead half that twins her lone weapon when she holds it, else her lead half's first: the Arms Summoner's
Bow, the Tome Summoner's Dark). Grades don't move and nothing is spent. Her lines stay; her equipped skills of a tree the
preset takes out of her slots leave her loadout. Nothing else is stored: a row reads **On** while she wears that preset.

**A promotion lands on the child's preset,** whatever her Tier 0 held. **The defaults** are what a class holds until she
picks: no Uma's weapons move until she taps a row, so an Uma promoted before D263 keeps the weapons she has. A grade belongs
to the weapon, so it follows her from a Tier 0 into a class whose preset slots that weapon.

<!-- live:presets -->
| Class | Offered by | Weapons | Armor | Accessory |
|---|---|---|---|---|
| Brawler | Warrior | Greatsword, Axe, Lance | Physical | Pendant, Pendant, Orb (Greatsword) |
| Arms Spellblade | Warrior, Spellblade | Katana, Axe, Thunder Tome | Physical | Pendant, Charm, Orb (Katana) |
| Arms Summoner | Warrior, Summoner | Bow, Axe, Dark Tome | Physical | Pendant, Charm, Orb (Bow) |
| Paladin | Healer | Lance, Greatsword, Light Tome | Physical | Pendant, Pendant, Orb (Lance) |
| Cleric | Healer | Light Tome, Fire Tome, Lance | Magical | Charm, Charm, Orb (Light Tome) |
| Tome Summoner | Summoner, Mage | Dark Tome, Blizzard Tome, Bow | Magical | Charm, Pendant, Orb (Dark Tome) |
| Tome Spellblade | Spellblade, Mage | Thunder Tome, Blizzard Tome, Katana | Magical | Charm, Pendant, Orb (Thunder Tome) |
| Sorcerer | Mage | Fire Tome, Blizzard Tome, Thunder Tome | Magical | Charm, Charm, Orb (Fire Tome) |

| Class | Holds until she picks |
|---|---|
| Warrior | Greatsword, Axe, Lance |
| Spellblade | Katana, Lance, Thunder Tome |
| Healer | Light Tome, Blizzard Tome, Bow |
| Summoner | Dark Tome, Blizzard Tome, Axe |
| Mage | Fire Tome, Blizzard Tome, Thunder Tome |
| Brawler | Greatsword, Axe, Lance |
| Arms Spellblade | Katana, Lance, Thunder Tome |
| Arms Summoner | Bow, Axe, Dark Tome |
| Paladin | Greatsword, Axe, Light Tome |
| Cleric | Light Tome, Blizzard Tome, Bow |
| Tome Summoner | Dark Tome, Blizzard Tome, Axe |
| Tome Spellblade | Light Tome, Thunder Tome, Katana |
| Sorcerer | Fire Tome, Blizzard Tome, Thunder Tome |
<!-- /live -->

The presets are the owner's two parties, **Brawler, Sorcerer, Arms Spellblade, Tome Summoner, Paladin** and **Brawler,
Sorcerer, Tome Spellblade, Arms Summoner, Cleric**. The Brawler and the Sorcerer keep the ring. The Paladin and the Cleric
hold the Lance and Light, both Spellblades the Katana and Thunder, both Summoners Dark and the Bow, and the middle slot
flexes: the Spellblades' is the kind that reaches two hits soonest (Axe, Blizzard), the Summoners' their area kind (Blizzard,
Axe), the Paladin's the Greatsword (her Aegis) and the Cleric's Fire (Brave), which are also the Arm and the element of their
second Hall seats. Each party holds all ten kinds:

| Party | Greatsword | Axe | Lance | Bow | Katana | Fire | Blizzard | Thunder | Light | Dark |
|---|---|---|---|---|---|---|---|---|---|---|
| Arms Spellblade, Tome Summoner, Paladin | 2 | 2 | 2 | 1 | 1 | 1 | 2 | 2 | 1 | 1 |
| Tome Spellblade, Arms Summoner, Cleric | 1 | 2 | 2 | 1 | 1 | 2 | 2 | 2 | 1 | 1 |

The second party has no Aegis: only the Cleric's and the Paladin's Blizzard and the Paladin's Greatsword give it, and the
Cleric's preset holds Fire instead.

The defaults follow each class's identity: the Brawler's and the Sorcerer's are the ring (Fire, Ice and Lightning's twins,
one channel each); the Spellblades hold multi-hit kinds and the Summoners area kinds, and each hybrid holds one twin set in
both halves, so both halves land weak on a foe weak to it (the Arms Spellblade the Lightning set, the Tome Spellblade the Light
set, the Arms Summoner the Dark set, the Tome Summoner the Ice set); the Paladin keeps her Barriers, Aegis and Enfeeble on the
Greatsword and the Axe and her revive on the Light Tome. The balance simulation wears them, with R2's one accessory slot
until the combat balance pass after D264. The balance party (Brawler, Sorcerer, Arms Spellblade, Tome Summoner, Cleric) holds all ten kinds; so do the
Brawler, the Sorcerer, the Tome Spellblade, the Arms Summoner and a Paladin, and the five Tier 0s. The Rift's fronts suggest
guided weapons on top of them ([loops](loops.md#the-rift)).

## Skills: depths, lines and ranks

A Tier 0's trees are one node each ([above](#tier-0-and-promotion)). A Tier 1 class's:

- **Five depths a tree, eight nodes** (CP13, CP18). Depths 1 and 2 are the **trunk**, always hers. At depth 3 the tree
  **forks** into **line A** and **line B** (the Skills tab calls them branches), and her line runs on through depths 4
  and 5. In Tier 1's world a Tier 1 class opens at Class Rank 10, so its trunk is whole from the start.
- **Nothing is learned and nothing costs points** (CP14). A depth opens when her **Class Rank** in that class reaches
  its gate (D102, CP16), and every node there on her path is hers at once.
- **Line A is the default; line B is a sidegrade with its own name** (Combo, Impale, Pierce, Barrage, Heavy…; every
  tree's is in [skill trees](skill-trees.md#the-lines-at-a-glance)). She takes B, or A again, free at any time; her
  equipped skills follow in place (with Rend equipped, taking Combo puts Rending Combo in its slot). A line sits on any
  kind of her class's trees, slotted or not.
- **Skill Ranks** (CP32): every skill she holds is Rank 1 when its depth opens and gains a rank every 2 Class Ranks, up
  to Rank 5, on its own. A rank scales its power, and a healer's mend and Barrier shares, ×0.95 to ×1.05; MP, hits,
  targets and statuses never change. A line swap keeps the ranks: they read her Class Rank.
- **Pierce** (CP42, CV14): both Spellblades' line B on every tree, the Brawler's Katana B and the Sorcerer's Light B land
  one hit that ignores the halving a standing shield gives ([skill trees](skill-trees.md#pierce)).
- **Barrage** (CV14): the Brawler's Bow B and the Sorcerer's Dark B strike one foe 4 · 4 · 6 times at the depth's power
  instead of the volley, so the twins' B lines mirror: Katana and Light both Pierce, Bow and Dark both Barrage.
- **The two new hybrids' trees** (CV17): the Tome Spellblade's follow the Arms Spellblade's rule (one foe, hits by kind,
  the same depth-5 riders) under her own names, Edged, Honed, Whetted, Gleaming and Sovereign, then Pyre, Frost, Volt,
  Lumen and Umbra on her Tomes and the blade's Cleave, Hew, Thrust, Shot and Draw on her Arms; the Arms Summoner's are the
  Summoner's summons in their kind's shape, with Bonded on her Arms trees and Pack on her Tomes, the Tome Summoner's
  mirrored.

<!-- live:depths -->
| Depth | Line | Opens at | Ranks 2–5 at Class Rank | Single-target power, Rank 1 → 5 | Full-turn MP |
|---|---|---|---|---|---|
| 1 | Trunk | Class Rank 1 | 3, 5, 7, 9 | 1.52 → 1.68 (1.6 at Rank 3) | 10 |
| 2 | Trunk | Class Rank 10 | 12, 14, 16, 18 | 2.09 → 2.31 (2.2 at Rank 3) | 14 |
| 3 | The fork: A or B | Class Rank 20 | 22, 24, 26, 28 | 2.76 → 3.05 (2.9 at Rank 3) | 18 |
| 4 | Her line, A or B | Class Rank 30 | 32, 34, 36, 38 | 3.52 → 3.89 (3.7 at Rank 3) | 22 |
| 5 | Her line, A or B | Class Rank 40 | 42, 44, 46, 48 | 4.37 → 4.83 (4.6 at Rank 3) | 26 |
<!-- /live -->

**Equipped skills:**

<!-- live:active-slots -->
3 equipped skills at Lv 1, one more at Lv 10, 20, 30, 40 (7 at most). No points and no side skills: every skill on her path is hers at its depth's Class Rank, and ranks up every 2 Class Ranks (×0.95 at Rank 1 to ×1.05 at Rank 5).
<!-- /live -->

She equips skills she holds on the trees of her three slotted weapons; her Uma Level sets how many. A Tier 0 holds three,
always equipped. Until you pick, the auto loadout takes each slotted tree's deepest held skill in turn, then the next
deepest (a hybrid's Arms and Tomes alternating, the channel with two slots first). "Back to auto" returns to it. Every
skill is listed in [skill trees](skill-trees.md).

## Limit Breaks

A class has no Limit Break of its own: she has one only as a **Hero** (her seat's) or a **Learner** (either of her
Heroes'), from the Halls of Heroes ([heroes](heroes.md)). At 100% a Limit Break is worth **its own power** (×1.9 to
×2.9, each seat's) × **the scale of the class she fights as** (the table's: 1 for a Tier 0, 0.95 for the six Tier 1
damage classes, 0.8 for the Paladin and the Cleric; H131, D249) × **her open depth's single-target power** (the deepest
depth her Class Rank opens; a Tier 0's skill power at her Class Rank), never her Skill Ranks. So a Paladin or a Cleric on
a Healer Sanctum seat lands 1.6×. A cast lands at most 10 hits on one foe. The gauge is in
[combat](combat.md#limit-breaks).

## Ranks and levels

Four bars grow an Uma (D102). Nothing is trained and no token is spent, and gear has no ranks: a slot's grade is what she
wears ([materials](materials.md#gear)).

| Bar | Range | Rises with | Opens |
|---|---|---|---|
| **Uma Level** | 1–50 | Every won fight | Her stats, equipped skills (3 → 7), the grades her gear can reach (G g at Lv 5g − 4) and the Extra Stats nodes she can open |
| **Class Rank**, per class | A Tier 0 1–10; a Tier 1 class 10–50 in Tier 1's world, 1–50 in a later tier | Won fights as that class (2E for her E Uma EXP) | A Tier 0's skill power, rank by rank, and her promotion at 10. A Tier 1 class's depths at Rank 1, 10, 20, 30, 40; a Skill Rank every 2 Class Ranks; her Limit Break's depth; her base MP regen, a step a depth |
| **Craft Level** | 1–50 | Her work in the Wilds | The grades she can gather, process and make ([loops](loops.md#craft-level)) |
| **Bond**, per Hall seat | 0–10 | Won world fights as a Learner, or a Hero of that seat | A Learner's Limit Break strength, 50% to 100% ([heroes](heroes.md#bonds)) |

Curves, EXP per win, Class Marks and Class Manuals are in [loops](loops.md#ranks). A Tier 0's EXP past Rank 10 waits for
her promotion; a Manual read there waits too. A Lv 1 Uma can reach any Class Rank: there are no caps between bars.
