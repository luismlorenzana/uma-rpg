# Classes v3: the class tree, Tier 0 and the promotion

> **Built and live (H126–H134, D257).** Approved by the owner on 2026-10-29 (D240) and live from H134 on engine v19 and
> save v32; the game as it plays is the [manual](../../game/README.md)'s, which wins where this doc differs: the Mage
> root's Tier 0 reads **Initiate** on screen (its id stays `apprentice`, since "Apprentice" is Tier 1's world name), the
> class tree and promotion sheet sit on today's Skills tab (H137, D252, D253), and H131's measured numbers (D249) replace
> the drafts where §12 and §3 say so.
>
> The owner's request of 2026-10-29: after the Paladin and
> Cleric split, split more classes, as **a class tree** with three roots, **Tier 0** introductory classes that promote
> into the Tier 1 classes, a **promotion screen**, the two hybrids' **inverse classes**, the Light and Dark Tomes
> reshaped, and a **reset** of every Uma paid back in Class Manuals. It builds on the live game (engine v18, save v31;
> the [manual](../../game/README.md)), the approved [class progression](../tier-rework/class-progression.md) (D192),
> [Uma Templates](../tier-rework/uma-templates.md) (D197) and the approved [Uma profile v2](../uma-profile-v2/proposal.md)
> (D239), whose Class and Template tabs this fits into. Calls are **CV1–CV36**, each with a recommendation
> ([§16](#16-decisions)). No open questions. A second doc, **Halls v2** (the Limit Break rework), is written beside this
> one from the same class list ([halls-v2.md](halls-v2.md), HV1–HV25); [§15](#15-halls-v2-what-this-doc-hands-it) here and
> [its §8](halls-v2.md#8-what-classes-v3-must-provide) are the seam. Both ride engine v19 and save v32.
>
> **What it proposes, in ten lines:**
> 1. **One class tree, three roots: Warrior · All-Rounder · Mage** (the owner's Fighter root shows as Warrior: "Fighter"
>    is a master-data skill name, CV2). **Five Tier 0 classes, eight Tier 1 classes**, the four hybrids each with two
>    parents ([§1](#1-the-class-tree)).
> 2. **Tier 0: Recruit, Apprentice, Duelist, Caller, Acolyte** (the owner's Fighter, Mage, Spell Blade, Summoner,
>    Healer). Class Rank 1–10 on a curve that lands Rank 10 with Uma Lv 10, the end of the first continent; one skill,
>    one foe, one hit, rising with every Class Rank; three slots that take any weapon ([§2](#2-tier-0)).
> 3. **Promotion at Rank 10:** each child class opens, free, **at Class Rank 10**, so Tier 0 is the old Ranks 1–10 and a
>    Tier 1 class runs 10–50. The world's foes still meet every depth on time ([§2.6](#26-promotion)).
> 4. **Eight Tier 1 classes:** Brawler, Sorcerer (today's Mage), Arms Spellblade (today's Spell Blade), **Tome
>    Spellblade (new)**, **Arms Summoner (new)**, Tome Summoner (today's Summoner), Paladin, Cleric ([§3](#3-the-eight-tier-1-classes)).
> 5. **Five weapon shapes, two pairs re-paired:** Katana and Light **double** (two hits), Bow and Dark a **volley** (the
>    target, and a nick on every other foe), so the Spellblades hold multi-hit kinds and the Summoners area kinds
>    ([§4](#4-the-weapon-shapes)).
> 6. **The calling by running style only,** four rows: Front a Recruit, pure Pace a Duelist, Pace with a closer an
>    Apprentice, End a Caller, pure Late an Acolyte. **47 · 72 · 72 · 33 · 46** of 270 outfits; no calling pick
>    ([§5](#5-the-calling)). Trades follow, one each ([§6](#6-trades)).
> 7. **Reclassing:** switching between the classes she holds stays free; every Tier 0 is open to every Uma; another
>    family's Tier 1 class takes its Tier 0 to Rank 10 first, about 4 Manuals ([§7](#7-reclassing)).
> 8. **The reset:** every Uma to her Tier 0 at Rank 1; each class's EXP comes back, **its first 1,800 twice** (the Tier 0
>    ladder costs twice the old Ranks 1–10), in whole Manuals rounded up, **paid as Class Marks**, which is what the
>    Exchange reads Manuals with. **There is no Weapon Rank to reset:** weapon grades stay ([§8](#8-the-reset)).
> 9. **The Rift's four fronts map to the tree's four families:** Iron the Warrior side, Arcane the Mage side, Duel the
>    Spellblades, Horde the Summoners; a run's twenty hold all eight classes ([§10](#10-the-rift)).
> 10. **The screens:** profile v2's Class sheet becomes the **class tree** (the reclass view) and gains the **promotion
>     sheet**; Template loses the calling pick; a one-time sheet, **"The classes are rebuilt"**, explains the reset
>     ([§14](#14-the-screens)).
>
> **Pages** (full desktop, light and dark; every Uma on them is made up):
> [**the class tree**: tap a class for its sheet](previews/class-tree.html) ·
> [**promotion and reclass** in profile v2's Class tab, at 390×844](previews/promotion.html) ·
> [**the weapon shapes**: ten kinds before and after, the new twins](previews/weapon-shapes.html) ·
> [**the reset**: the one-time sheet and five worked examples](previews/reset.html).
>
> **The owner's message was cut off** ("Also, there may be …"). Assumed: more places the reset touches. Every place an
> Uma's class is read is covered in [§8.5](#85-everything-else-the-reset-touches) (parties and the healer rule, Hall seats
> and Bonds, an open Rift run, open fights, work and trades, targets, presets, Tier 2 and 3 worlds). If the sentence
> meant something else, it lands as a follow-up against this doc (CV35).

## The owner's points

| The owner's point (2026-10-29) | Answered in |
|---|---|
| "Author a Class Tree to present to me" | [§1](#1-the-class-tree); [the class tree page](previews/class-tree.html) |
| "… and then plan for this to be visible in Game, whenever I want to 'reclass'" | [§7](#7-reclassing) (the rules), [§14.1](#141-the-class-tab-what-h120-now-builds) (the Classes sheet: the tree, in her profile); [promotion page](previews/promotion.html) |
| "3 starting Roots, from left to right, Fighter, All-Rounder, Mage" | [§1](#1-the-class-tree), drawn left to right; the Fighter root reads **Warrior** on screen (CV2) |
| "Tier 0 Classes … introductory … up to max class Rank 10 … then you have to promote" | [§2](#2-tier-0), [§2.6](#26-promotion) |
| "Maybe class rank exp is also edited so that these baseline classes are maxed at the end of the first scenario in Tier 1" | **Yes** ([§2.3](#23-class-rank-110-and-its-curve)): twice today's curve, so Rank 10 lands with Uma Lv 10, the first continent's capital |
| "A super basic skill tree where all skills do single target damage, 1 hit and same multiplier, maybe a single skill that maxes at Rank 10" | [§2.2](#22-the-skill): one skill a class, one foe, one hit, the same numbers for all five, ranking with Class Rank to 10 |
| "Tier 0 classes can equip every weapon, … no locked weapons until promoting" | [§2.4](#24-weapons-and-stats): three slots, any of the ten |
| "The 5 Tier 0 classes … (please think of better names)" | [§2.1](#21-five-classes-and-their-names): **Recruit, Apprentice, Duelist, Caller, Acolyte**, with the alternatives |
| "Fighter (Pure Fronts and Front+Pace) · Mage (Pace+Lates) · Spell Blade (Pure Paces) · Summoner (Late+End) · Healer (Pure Lates)" | [§5](#5-the-calling): the full rule for every style combination, with the counts |
| "These 5 classes should also match the already existing profession mechanic" | [§6](#6-trades): one trade each, 1:1 |
| "A class promotion screen … Fighter: Brawler, Arms Spellblade, Arms Summoner; Mage: Sorcerer, Tome Spellblade, Tome Summoner; Healer: Paladin, Cleric" | [§2.6](#26-promotion), [§14.2](#142-the-promotion-sheet); [promotion page](previews/promotion.html) |
| "Sorcerer (pretty much today's Mage, this may be a class rename angle)" | **Renamed** (CV4); its id stays, so nothing else moves |
| Spellblade: multi-hit, 2/1; Arms Spellblade "pretty much current"; Tome Spellblade "2 Tomes (Lightning + Light) and 1 Arms (Katana), fill in the gaps" | [§3.3](#33-arms-spellblade), [§3.4](#34-tome-spellblade): the mirror, every gap filled (hand, lean, trees and lines, preset) |
| Summoner: AoE, 2/1; Arms Summoner "2 Arms (Axe, Bow) and 1 Tome (Dark), fill in the gaps"; Tome Summoner "2 Tomes (Dark, Blizzard) and 1 Arms (Axe), pretty much current" | [§3.5](#35-arms-summoner), [§3.6](#36-tome-summoner) |
| "A small rework for Light Tome to mirror Katana with double hits, and Dark Tome to mirror Bow with AoE hits" | [§4](#4-the-weapon-shapes): Bow becomes area too, and the twins re-pair to Katana–Light and Bow–Dark; every ripple listed |
| "Reset every single Uma I have unlocked to their Class Tier 0 at Rank 1, and then grant the equivalent Exp in Class Rank Exp Tomes" | [§8](#8-the-reset): the refund rule, why it is paid as Class Marks, five worked examples |
| "Same for Weapon Rank, let's just reset and grant Tomes" | [§8.3](#83-weapon-rank-there-is-none-to-reset): **there is no Weapon Rank since R2;** a weapon has a grade, which every class uses, so weapons stay as they are |
| "Guarantee I'll have a proper UI to use this without major reworks" | [§8.6](#86-the-sheet-the-classes-are-rebuilt), [§14.3](#143-the-exchanges-manual-sheet): the one-time sheet, the Exchange's Manual sheet with her share and "to Rank 10", a door from her profile; no new screen type |
| "Also, there may be …" (cut off) | Noted above; assumption in [§8.5](#85-everything-else-the-reset-touches) (CV35) |

## 0. At a glance

| | Today (engine v18) | Classes v3 (engine v19, save v32) |
|---|---|---|
| **Classes** | 6, all open, switched freely | **13 in a tree:** 5 Tier 0 and 8 Tier 1 under three roots, Warrior · All-Rounder · Mage |
| **Where she starts** | Her calling's class at Class Rank 1 | Her calling's **Tier 0** at Class Rank 1 |
| **Class Rank** | 1–50 in each class | **Tier 0 1–10, then a Tier 1 class 10–50:** one ladder, the class changes at 10 |
| **Tier 0** | — | One skill (one foe, one hit, 1.52 → 2.20 by Class Rank), three slots of any kind, no lean, no support; Rank 10 at Uma Lv 10 |
| **Promotion** | — | At a Tier 0's Rank 10: each child opens at Rank 10, free; the EXP past 10 goes with her |
| **Switching** | Free between six | Free between the classes she holds; any Tier 0 open to all; another family's Tier 1 through its Tier 0 |
| **Hybrids** | Spell Blade (Arms-led), Summoner (Tome-led) | **Two each, mirrored:** Arms and Tome Spellblade (multi-hit), Arms and Tome Summoner (area) |
| **Weapon shapes** | Five pairs; Bow–Light "many hits", Katana–Dark "twice" | Five pairs: **Katana–Light double, Bow–Dark volley**; Greatsword–Fire, Axe–Ice, Lance–Lightning unchanged |
| **Calling** | 8 rows, Power and Wit read, a one-time pick for 176 | **4 rows, styles only, no pick:** Recruit 47 · Duelist 72 · Apprentice 72 · Caller 33 · Acolyte 46 |
| **Templates** | 6 callings × 3 strides = 18 types, 90 templates | **5 × 3 = 15 types, 75 templates** (60 in use) |
| **Trades** | By calling, the two healers sharing one | By Tier 0, one each |
| **Trees** | 50 (750 nodes in the catalog, 400 on Tier 1's lines) | **120:** 70 Tier 1 trees of eight nodes, 50 Tier 0 trees of one |
| **The Rift's builds** | Brawler/Spell Blade, Mage/Summoner, Brawler/Mage, Spell Blade/Summoner | **Iron the Warrior side, Arcane the Mage side, Duel the Spellblades, Horde the Summoners:** a run's twenty hold all eight |
| **Profile** | Class sheet: six tiles | **Classes sheet: the tree;** a promotion sheet; Template's calling is fixed |
| **The move to it** | — | Every Uma to her Tier 0 at Rank 1; her Class EXP back as Class Marks for Manuals; weapon grades, gear, Extra Stats, Levels stay |

**The thirteen, by root** (ids in code font; display names are this doc's recommendation):

| Root | Tier 0 (`id`) | Its calling | Promotes to |
|---|---|---|---|
| **Warrior** | **Recruit** (`recruit`) | Front among her best styles | Brawler · Arms Spellblade · Arms Summoner |
| **All-Rounder** | **Duelist** (`duelist`) | Pace alone | Arms Spellblade · Tome Spellblade |
| **All-Rounder** | **Acolyte** (`acolyte`) | Late alone | Paladin · Cleric |
| **All-Rounder** | **Caller** (`caller`) | End among her best (Late + End, or End) | Arms Summoner · Tome Summoner |
| **Mage** | **Apprentice** (`apprentice`) | Pace with Late or End | Sorcerer · Tome Spellblade · Tome Summoner |

| Tier 1 class (`id`) | Parents | Slots and defaults | Hand | Was |
|---|---|---|---|---|
| **Brawler** (`brawler`) | Recruit | 3 Arms: Greatsword, Axe, Lance | ×1 | Brawler |
| **Arms Spellblade** (`spellblade`) | Recruit, Duelist | Katana, Lance · Thunder Tome | Arms 0.72 + Tome 0.44, the Arms half one hit more | Spell Blade |
| **Arms Summoner** (`armsummoner`) | Recruit, Caller | Bow, Axe · Dark Tome | Arms 0.62 + Tome 0.50, the Arms summon lingers | **New** |
| **Paladin** (`paladin`) | Acolyte | Greatsword, Axe · Light Tome | ×0.5 (heals from ATK) | Paladin |
| **Cleric** (`cleric`) | Acolyte | Light Tome, Blizzard Tome · Bow | ×0.5 (heals from M.ATK) | Cleric |
| **Tome Summoner** (`summoner`) | Apprentice, Caller | Dark Tome, Blizzard Tome · Axe | Tome 0.62 + Arms 0.50, the Tome summon lingers | Summoner (new defaults) |
| **Tome Spellblade** (`tomeblade`) | Apprentice, Duelist | Light Tome, Thunder Tome · Katana | Tome 0.72 + Arms 0.44, the Tome half one hit more | **New** |
| **Sorcerer** (`mage`) | Apprentice | 3 Tomes: Fire, Blizzard, Thunder | ×1 | Mage |

## 1. The class tree

Built in H126 (D245), live from H134.

The owner's three roots are **columns**, left to right: the physical classes, the classes between, the magical ones.
Tier 0 sits on top, Tier 1 below. A hybrid Tier 1 class has **two parents**: its own Tier 0 (in the middle column) and its
channel's root class (Recruit for an Arms hybrid, Apprentice for a Tome hybrid). In the middle column each Tier 0's
children sit under it, the Arms class with the Tome class (on the page, Arms on the Warrior side and Tome on the Mage
side), so the whole tree runs physical to magical, left to right.

```
                 WARRIOR      │                 ALL-ROUNDER                    │        MAGE
──────────────────────────────┼────────────────────────────────────────────────┼──────────────────────
 TIER 0          Recruit      │     Duelist         Acolyte        Caller      │      Apprentice
                 Front · 47   │     Pace · 72       Late · 46      End · 33    │  Pace + a closer · 72
──────────────────────────────┼────────────────────────────────────────────────┼──────────────────────
 TIER 1          Brawler      │  Arms Spellblade    Paladin     Arms Summoner  │       Sorcerer
                 ◄ Recruit    │  ◄ Recruit          ◄ Acolyte   ◄ Recruit      │       ◄ Apprentice
                              │  ◄ Duelist                      ◄ Caller       │
                              │  Tome Spellblade    Cleric      Tome Summoner  │
                              │  ◄ Duelist          ◄ Acolyte   ◄ Caller       │
                              │  ◄ Apprentice                   ◄ Apprentice   │
──────────────────────────────┴────────────────────────────────────────────────┴──────────────────────
                 physical ◄──────────────────────────────────────────────────────────────► magical
```

| Tier 1 ↓ · its parents → | Recruit | Duelist | Acolyte | Caller | Apprentice |
|---|---|---|---|---|---|
| Brawler | ● | | | | |
| Arms Spellblade | ● | ● | | | |
| Arms Summoner | ● | | | ● | |
| Paladin | | | ● | | |
| Cleric | | | ● | | |
| Tome Summoner | | | | ● | ● |
| Tome Spellblade | | ● | | | ● |
| Sorcerer | | | | | ● |

The [class tree page](previews/class-tree.html) draws it properly: tap a class for its sheet; hover an edge for the
promotion it is. Read it as:

| Edge | Meaning |
|---|---|
| Recruit → Brawler, Apprentice → Sorcerer, Acolyte → Paladin and Cleric | A pure promotion: one parent |
| Recruit → Arms Spellblade and Arms Summoner | The Warrior's way into the Arms hybrids |
| Apprentice → Tome Spellblade and Tome Summoner | The Mage's way into the Tome hybrids |
| Duelist → Arms Spellblade and Tome Spellblade; Caller → Arms Summoner and Tome Summoner | The All-Rounder's way into both halves of its hybrid |

**Why this shape (CV1):** it is the owner's list, drawn so that every promotion he named is an edge, the owner's
promotion screens fall out of it (Recruit's three, Apprentice's three, Acolyte's two, and Duelist's and Caller's two
each), and a hybrid is reached from either side: a front runner can become an Arms Summoner without passing through the
Caller, and a pure Pace Uma can become either Spellblade without the Warrior or Mage roots.

## 2. Tier 0

Built in H126 (D245), live from H134.

### 2.1 Five classes, and their names

The owner asked for better names than Fighter, Mage, Spell Blade, Summoner and Healer. The Tier 0 names must not repeat
the roots (Mage would be a root, a Tier 0 and a former Tier 1 name at once), must read as **beginners** of what they
promote into, and must not match a master-data name (checked against every string in the release, exact and inside a
longer name; CV3):

| Owner's name | **Recommended** | Why | Alternatives |
|---|---|---|---|
| Fighter | **Recruit** | A soldier in her first weeks; promotes to the Warrior column's classes | Fighter (an exact master-data skill name), Cadet |
| Mage | **Apprentice** | The magic word for a beginner; frees "Mage" for the root alone | Novice, Initiate |
| Spell Blade | **Duelist** | One foe at a time, steel and spark: the Spellblades' single-target multi-hit start | Spellsword, Fencer |
| Summoner | **Caller** | She calls, not yet summons; promotes to the Summoners | Evoker, Beckoner (a template type) |
| Healer | **Acolyte** | Serves the rites before she heals: an Acolyte's skill deals damage, so the name doesn't promise a mend | Novice, Initiate |

The **roots** keep the owner's All-Rounder and Mage. **Fighter** is an exact master-data skill name, so the Warrior
column shows **"Warrior"** (as the Uma Templates pass renamed two names for the same reason, UT16; CV2). A root is a
label, never a class she fights as: it has no id, no rank and no rules.

### 2.2 The skill

**One skill a Tier 0 class, the same numbers for all five, cast with any of her three weapons** (CV6):

| Class | Skill | What it does |
|---|---|---|
| Recruit | **Drill Strike** | One foe · 1 hit · power by her Class Rank · 10 MP |
| Apprentice | **Primer** | The same |
| Duelist | **Feint** | The same |
| Caller | **Beckon** | The same |
| Acolyte | **Vigil** | The same (no mend, no Barrier: Tier 0 has no support) |

- **Its kind is the weapon's.** Each of her three weapons' trees holds the skill as its one node, so she holds it
  three times, once in each kind and channel ("Drill Strike · Greatsword", "Drill Strike · Fire Tome"): an Arm's hits
  with ATK and Might on DEF, a Tome's with M.ATK on M.DEF, each weak where its kind is. Three equipped slots at Lv 1, so
  her three are always equipped; the fourth slot (Lv 10) waits for the promotion.
- **Its rank is her Class Rank.** No Skill Ranks: the skill's power climbs every Class Rank, from depth 1's first rank
  to depth 2's middle, so nothing stands still between the 10s (the owner's first-review ask, CP32):

<!-- the numbers are rank 3 single-target units, as the skill trees page prints them -->
| Class Rank | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 |
|---|---|---|---|---|---|---|---|---|---|---|
| **Power** | 1.52 | 1.60 | 1.67 | 1.75 | 1.82 | 1.90 | 1.97 | 2.05 | 2.12 | 2.20 |
| Today at the same Uma Lv (her best skill: depth 1, then depth 2 from Lv 7) | 1.52 | 1.52 | 1.56 | 1.60 | 1.64 | 1.68 | 2.09 | 2.15 | 2.20 | 2.20 |

- **Measured by H131 (D249):** ×1.05 on every rank (§12's S1, `RPG_TIER0_POWER_FACTOR`): 1.60 · 1.68 · 1.75 · 1.84 · 1.91 ·
  2.00 · 2.07 · 2.15 · 2.23 · 2.31.
- **MP 10 at every rank**, before her hand (×1): depth 1's full-turn cost. Her base MP regen is depth 1's, 1% of her max
  MP a round.
- **What a row leaves out: nothing.** No rider, no special, no line, no fork. An Attack stays an Attack (1.0, one of her
  weapons' kinds).

### 2.3 Class Rank 1–10, and its curve

**Tier 0's EXP to next rank is twice today's: 2 × (120 + 16 × rank)** (CV5). A win pays the class she fought as 2E for E
Uma EXP, and Uma Lv r → r + 1 takes 120 + 16r, so **an Uma who fights as her Tier 0 from Lv 1 reaches Class Rank r
exactly when she reaches Uma Lv r**: Rank 10 with Lv 10, the first continent's capital, "the end of the first scenario".

| Class Rank | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 |
|---|---|---|---|---|---|---|---|---|---|---|
| EXP to next | 272 | 304 | 336 | 368 | 400 | 432 | 464 | 496 | 528 | max |
| EXP from Rank 1 | 0 | 272 | 576 | 912 | 1,280 | 1,680 | 2,112 | 2,576 | 3,072 | **3,600** |
| Uma Lv when she gets there (fighting as it from Lv 1) | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | **10** |

- **Past Rank 10 the EXP waits** on the Tier 0 (up to 23,680, what Ranks 10–50 take) and **her next promotion takes
  it** ([§2.6](#26-promotion)). Past that, Class Marks at half rate, as any maxed class.
- Today's Ranks 1–10 took 1,800 and landed at Uma Lv 7. Tier 0 costs 1,800 more, which is what the reset adds back
  ([§8.2](#82-the-refund)).

### 2.4 Weapons and stats

| | Tier 0 | Why (CV7) |
|---|---|---|
| **Slots** | **Three, each any of the ten weapons;** three different kinds | The owner: "can equip every weapon … no locked weapons until promoting" |
| **Defaults** | Each takes a child's set: Recruit the Brawler's (Greatsword, Axe, Lance), Apprentice the Sorcerer's (Fire, Blizzard, Thunder), Duelist the Arms Spellblade's (Katana, Lance, Thunder), Caller the Tome Summoner's (Dark, Blizzard, Axe), Acolyte the Cleric's (Light, Blizzard, Bow) | A preview of the class she becomes; a party of the five holds all ten kinds |
| **Preset** | That child's accessory form: Recruit Bell (Greatsword), Apprentice and Duelist Pendant, Caller and Acolyte Orb (Blizzard Tome), her ★ family first as today | One rule with Tier 1's |
| **Hand** | ×1 on both channels, one act a turn, MP ×1 | Simple; the pairs, the halves and the half-hand healer start at Tier 1 |
| **Stat lean** | **None** (×1 on all six) | Introductory; her racing profile alone sets her stats |
| **Armor's offense and Prowess** | **Follow her slots: a third a slot to its channel** (3 Arms all ATK, 2 + 1 two thirds, …) | She can hold any mix; today these follow the class's channel, and a Tier 0 has none |
| **Support** | **None:** the Acolyte deals damage like the rest | The owner's "all skills do single target damage"; healing starts at Paladin or Cleric |
| **One healer a party** | Doesn't count Tier 0: only a Paladin or a Cleric is a healer | An Acolyte doesn't heal |
| **Limit Break scale** | **1**, as every class but the healers ([Halls v2](halls-v2.md) HV5: a Limit Break carries its own power, × her class's scale × her open depth) | [§15](#15-halls-v2-what-this-doc-hands-it) |

### 2.5 Where Tier 0 exists

**Tier 1's world only** (CV10). A Tier 2 or Tier 3 world has no Tier 0: an Uma who ascends arrives in a Tier 1 class, and
every Tier 1 class is open there from Class Rank 1, as Ascend works today (a draft until the Tier 2 re-plan: its class
branches will add their own layer). An Uma who ascends while fighting as a Tier 0 arrives as **her suggested promotion**
([§2.6](#26-promotion)).

### 2.6 Promotion

**At a Tier 0's Class Rank 10, each of its children opens to her** (CV8):

| Rule | |
|---|---|
| **When** | Her Tier 0 reaches Class Rank 10 (by fights, Sweeps, Echoes or Manuals) |
| **What it opens** | Each child: Recruit's three, Apprentice's three, Duelist's, Caller's and Acolyte's two |
| **Promoting** | Free, from the promotion sheet. **The child opens at Class Rank 10** with its depths 1 and 2 open (six skills on her three weapons), its default weapons and lines, and **she fights as it from then** |
| **The waiting EXP** | Everything her Tier 0 earned past Rank 10 flows into the new class's bar, in one go |
| **More children** | Promoting again into a sibling is free at any time: her Tier 0 stays at Rank 10. Each opens at Rank 10 (the waiting EXP goes to whichever promotion comes next) |
| **Never** | Closes a class, costs anything, or moves her calling, trade or template |
| **Suggested** | One child carries a "Suggested" badge: Recruit the Brawler, Apprentice the Sorcerer; Duelist and Caller the Arms child with Power over Wit, the Tome child otherwise; Acolyte the Paladin with Power over Wit, the Cleric otherwise (today's calling pick's reading, kept as a hint; CV11) |

**Why open at Rank 10, not Rank 1** (CV8): the world's foes are built for the skill depth a level can reach (a region's
sub-bosses and bosses grow with the depth its first level opens, `rpgChapterReach`): depth 2 from Lv 10, 3 from 20, 4
from 30, 5 from 40. A Tier 1 class opened at Rank 1 would hold depth 1 until about Lv 13, short of continent 2's first
bosses. Opened at Rank 10, Tier 0 **is** the old Ranks 1–10, and every depth still comes before its foes:

| Depth (Class Rank) | Today, Uma Lv | **v3**, Uma Lv (Tier 0 from Lv 1, promoted at 10) | Foes expect it from |
|---|---|---|---|
| 2 (10) | 7 | **10** (at the promotion) | Lv 10 |
| 3 (20) | 13 | **16** | Lv 20 |
| 4 (30) | 20 | **22** | Lv 30 |
| 5 (40) | 27 | **29** | Lv 40 |
| Rank 50 | 34 | **36** | — |

A campaign (Lv 1–50, 50,960 Class EXP) takes one Tier 0 to Rank 10 and **exactly two Tier 1 classes of its family to
Rank 50** (3,600 + 2 × 23,680), as today's took two classes to Rank 50.

## 3. The eight Tier 1 classes

Built in H126 (D245), live from H134.

One table, then a sheet each. Hands, leans and splits for the four kept classes are today's; the two new ones mirror
their pair (CV15). "What changes" lists what an owner of today's class would notice.

| Class | Fight type | Slots | Damage split | Hand: an act, MP | Lean: HP ATK MATK DEF MDEF MP | Prowess ATK/MATK | Armor's offense | Trees | Line B |
|---|---|---|---|---|---|---|---|---|---|
| Brawler | Physical | 3 Arms | 100/0 | ×1, MP ×1 | 1.15 1.1 0.9 1.1 0.9 0.8 | 100/0 | ATK | 5 | Combo, Reap, Impale, **Barrage**, Draw |
| Arms Spellblade | Physical hybrid | 2 Arms + 1 Tome | 70/30 | Arms 0.72 + Tome 0.44; MP ×0.5 a half | 1 1.1 0.95 1 1 1 | 70/30 | ATK | 10 | Pierce |
| Arms Summoner | Physical hybrid | 2 Arms + 1 Tome | 70/30 | Arms 0.62 + Tome 0.50; MP ×0.5 a half | 1 1.1 0.95 1 1 1 | 70/30 | ATK | 10 | Bonded (Arms), Pack (Tomes) |
| Paladin | Healer | 2 Arms + 1 Tome | half hand | ×0.5, MP ×0.6 | 1 1 0.8 1.15 1 1.3 | 80/20 | ATK | 10 | Heavy |
| Cleric | Healer | 2 Tomes + 1 Arm | half hand | ×0.5, MP ×0.6 | 1 0.8 1 1 1.15 1.3 | 20/80 | M.ATK | 10 | Heavy |
| Tome Summoner | Magical hybrid | 2 Tomes + 1 Arm | 30/70 | Tome 0.62 + Arms 0.50; MP ×0.5 a half | 1 0.95 1.1 1 1 1 | 30/70 | M.ATK | 10 | Bonded (Tomes), Pack (Arms) |
| Tome Spellblade | Magical hybrid | 2 Tomes + 1 Arm | 30/70 | Tome 0.72 + Arms 0.44; MP ×0.5 a half | 1 0.95 1.1 1 1 1 | 30/70 | M.ATK | 10 | Pierce |
| Sorcerer | Magical | 3 Tomes | 0/100 | ×1, MP ×1 | 0.9 0.9 1.15 0.9 1.1 1.3 | 0/100 | M.ATK | 5 | Wave, Spike, Bolt, **Pierce**, **Barrage** |

**Measured by H131 (D249)** (§12's S3–S5; engine v19 only): the Tome Spellblade's hand is Tome 0.72 + Arms **0.48**, the
Arms Summoner's Arms **0.57** + Tome **0.46**, the Tome Summoner's Tome **0.57** + Arms 0.50; and Halls v2's Limit Break scale
is **0.95** for the six Tier 1 damage classes and **0.8** for the Paladin and the Cleric (H1; the sheets below give the drafts).

**The two pairs' identities** (the owner: "remains with their multi-hit identity" and "their AoE identity"):
- **Spellblades are multi-hit.** Every act is a pair; her **lead half lands one extra hit** (the same total); every skill
  strikes one foe; her line B is Pierce. Defaults on the multi-hit kinds: Lance and Lightning (scatter), Katana and
  Light (double).
- **Summoners are area.** Every act is a pair; her **lead summon lingers** and strikes every foe once in farewell when
  her next pair comes; her summons take their kind's shape. Defaults on the area kinds: Axe and Ice (sweep), Bow and
  Dark (volley).
- **Each hybrid holds one twin set in both halves** (both halves land weak on a foe weak to it): Arms Spellblade the
  Lightning set (Lance + Thunder), Tome Spellblade the Light set (Light + Katana), Arms Summoner the Dark set (Bow +
  Dark), Tome Summoner the Ice set (Blizzard + Axe). Four hybrids, four different sets.
- **Each hybrid holds three of its identity's four kinds,** and its mirror the other three: the Spellblades between them
  Lance, Lightning, Katana and Light; the Summoners Axe, Ice, Bow and Dark.

### 3.1 Brawler

| | |
|---|---|
| **Identity** | Pure physical. One full act a turn: one foe hard (Greatsword), every foe (Axe), random foes (Lance), the target and the rest (Bow), a double cut (Katana) |
| **Parents** | Recruit |
| **Slots and defaults** | 3 Arms: Greatsword, Axe, Lance (the ring's Arms) |
| **Hand and split** | ×1, MP ×1; 100% physical |
| **Trees and lines** | Her five Arms. B: Combo (Greatsword), Reap (Axe), Impale (Lance), **Barrage** (Bow, new: one foe, 4 · 4 · 6 hits, the old Bow line A), Draw (Katana, Pierce) |
| **Preset** | Greatsword, Axe, Lance · Bell (Greatsword), or her ★ family |
| **Limit Break scale** | 1 (HV5; today a class power of 2×) |
| **What changes** | Her Bow tree's line A is a volley ([§4](#4-the-weapon-shapes)) and its line B is Barrage; she opens at Class Rank 10 |

### 3.2 Sorcerer

| | |
|---|---|
| **Identity** | Pure magic, the element ring: a nuke (Fire), every foe (Blizzard), random bolts (Thunder), the target and the rest (Dark), a double cast (Light) |
| **Parents** | Apprentice |
| **Slots and defaults** | 3 Tomes: Fire, Blizzard, Thunder |
| **Hand and split** | ×1, MP ×1; 100% magical |
| **Trees and lines** | Her five Tomes. B: Wave (Fire), Spike (Blizzard), Bolt (Thunder), **Pierce** (Light, was Cascade: one hit that cuts through the shield), **Barrage** (Dark, was Pierce: one foe, 4 · 4 · 6 hits) |
| **Preset** | Fire, Blizzard, Thunder · Pendant, or her ★ family |
| **Limit Break scale** | 1 (HV5; today a class power of 2.4×) |
| **What changes** | **Today's Mage, renamed** (the owner's "class rename angle"; the id stays `mage`, so trees, saves and fights keep theirs). Light becomes double, Dark a volley; Light B and Dark B swap roles so the twins mirror the Brawler's (Katana B and Light B both Pierce; Bow B and Dark B both Barrage). The Mage Tower and the Mage root keep their word |

### 3.3 Arms Spellblade

| | |
|---|---|
| **Identity** | Physical-led multi-hit: every act an Arms half and a Tome half, the Arms half first and one hit more. The shield chipper |
| **Parents** | Recruit, Duelist |
| **Slots and defaults** | Katana, Lance · Thunder Tome (the owner's "Lance + Katana and 1 Tome (Lightning)", today's) |
| **Hand and split** | Arms 0.72 + Tome 0.44 (1.16 a turn), MP ×0.5 a half; 70/30 |
| **Trees and lines** | All ten, every skill on one foe, hits by kind: Greatsword, Fire 1 → 2; Axe, Ice 1 → 2; Lance, Thunder 2 → 3; **Bow, Dark 2 → 4; Katana, Light 2**. B: Pierce on every tree |
| **Preset** | Katana, Lance, Thunder Tome · Pendant; an Orb or a Bell on her Lance (the twin of her lone Thunder) |
| **What changes** | **Today's Spell Blade, renamed**; her Light trees land 2 hits (were 2 → 4), her Dark trees 2 → 4 (were 2) |

### 3.4 Tome Spellblade

The owner's "2 Tomes (Lightning + Light) and 1 Arms (Katana) … fill in the gaps". Every gap is the Arms Spellblade's
mirror (CV15, CV17):

| | |
|---|---|
| **Identity** | Magic-led multi-hit: every act a Tome half and an Arms half, **the Tome half first and one hit more**. The shield chipper on the magical side |
| **Parents** | Apprentice, Duelist |
| **Slots and defaults** | Light Tome, Thunder Tome · Katana. Slot 1 Light, so her lead kind twins her lone Katana |
| **Hand and split** | **Tome 0.72 + Arms 0.44** (1.16 a turn), MP ×0.5 a half; 30/70 |
| **Lean** | The mirror: HP ×1, ATK ×0.95, M.ATK ×1.1, DEF ×1, M.DEF ×1, MP ×1 |
| **Trees and lines** | All ten, built by the Spell Blade's rule (one foe, hits by kind as §3.3, the same depth riders: Burn, Enfeeble, Shock, Armor Break 1; Katana and Light ×1.3 on a Broken foe, Dark ×1.3 below half HP) with **her own names**: a blade word for each depth and a spell word for each kind (below). B: **Pierce** on every tree, on her Tome trees with her extra hit |
| **Preset** | Light Tome, Thunder Tome, Katana · Pendant; an Orb or a Bell on her Light (the twin of her Katana) |
| **Prowess and armor** | 30/70; armor's offense to M.ATK |
| **Limit Break scale** | 1 (HV5; today a class power of 2.2×) |

Her names: depth words **Edged · Honed · Whetted · Gleaming · Sovereign** (depths 1–5); kind words **Pyre** (Fire),
**Frost** (Ice), **Volt** (Lightning), **Lumen** (Light), **Umbra** (Dark) on her Tome trees, and the Spellblade's
Cleave, Hew, Thrust, Shot, Draw on her Arms trees. So her Thunder tree reads Edged Volt, Honed Volt, Whetted Volt,
Gleaming Volt, Sovereign Volt, and B Piercing Whetted Volt … Piercing Sovereign Volt. None matches a master-data string.

### 3.5 Arms Summoner

The owner's "2 Arms (Axe, Bow) and 1 Tome (Dark) … fill in the gaps". Every gap is the Tome Summoner's mirror:

| | |
|---|---|
| **Identity** | Physical-led area: every act an Arms summon and a Tome summon, **the Arms summon first; it lingers** and, when her next pair comes, strikes every foe once in farewell (its kind, 0.3 × its hits' power × 0.1), then leaves. The Tome summon strikes and goes. No support |
| **Parents** | Recruit, Caller |
| **Slots and defaults** | Bow, Axe · Dark Tome. Slot 1 Bow, the twin of her lone Dark |
| **Hand and split** | **Arms 0.62 + Tome 0.50**, MP ×0.5 a half, the farewell on top; 70/30 |
| **Lean** | The mirror: HP ×1, ATK ×1.1, M.ATK ×0.95, DEF ×1, M.DEF ×1, MP ×1 |
| **Trees and lines** | All ten, **the Summoner's summons** on each kind's tree (Brigand to Jotun King on the Axe, Slinger to Sagittarius on the Bow, Leech Imp to Abyssal Overlord on the Dark Tome …), in their kind's shape, with the Summoner's depth riders. Lines mirrored: **Bonded on her Arms trees** (the lingering summon at 0.4), **Pack on her Tome trees** (one more hit, ×0.95) |
| **Preset** | Bow, Axe, Dark Tome · Orb (Bow), or her ★ family |
| **Prowess and armor** | 70/30; armor's offense to ATK |
| **Limit Break scale** | 1 (HV5; today a class power of 2.2×) |

**Why the same summons, where the Tome Spellblade has new names:** a Spellblade's skills are techniques, named by her
class (Rune Cleave is a Spellblade's cut); a Summoner's are creatures, named by their kind, and either Summoner calls the
same Brigand. Fifteen new words give the Tome Spellblade her own voice; eighty new creatures would be content for its own
sake (the lean-assets rule). CV17 lists the alternative.

### 3.6 Tome Summoner

| | |
|---|---|
| **Identity** | Magic-led area: the Tome summon first, lingering, its farewell on every foe. No support |
| **Parents** | Apprentice, Caller |
| **Slots and defaults** | **Dark Tome, Blizzard Tome · Axe** (the owner's; were Dark, Light, Bow) |
| **Hand and split** | Tome 0.62 + Arms 0.50, MP ×0.5 a half (engine v18's); 30/70 |
| **Trees and lines** | All ten; B Bonded (Tome trees), Pack (Arms trees) |
| **Preset** | Dark Tome, Blizzard Tome, Axe · Orb (Blizzard Tome, the twin of her Axe), or her ★ family |
| **Limit Break scale** | 1 (HV5; today a class power of 2.2×) |
| **What changes** | **Today's Summoner, renamed** (id `summoner`); new defaults; her Bow and Dark summons are volleys, her Light summons double |

### 3.7 Paladin and Cleric

**As today** (CV4): the Acolyte's two children. Their trees strike one foe once at half hand, so no shape change touches
them; their kits, revives, Regen, drain and Aegis stay; one healer a party. Paladin: Greatsword, Axe · Light Tome,
Pendant. Cleric: Light Tome, Blizzard Tome · Bow, Orb (Blizzard Tome). **Limit Break scale 0.75** for both (HV5; today a
class power of 1.5×). What changes: they open at Class Rank 10, from an Acolyte; their two halls become
[Halls v2](halls-v2.md)'s Healer Sanctum.

### 3.8 Presets and the default party

| Class | Weapons (slot order) | Accessory form | Twin set in both halves |
|---|---|---|---|
| Recruit (T0) | Greatsword, Axe, Lance | Bell (Greatsword) | — |
| Apprentice (T0) | Fire, Blizzard, Thunder | Pendant | — |
| Duelist (T0) | Katana, Lance, Thunder | Pendant | — |
| Caller (T0) | Dark, Blizzard, Axe | Orb (Blizzard) | — |
| Acolyte (T0) | Light, Blizzard, Bow | Orb (Blizzard) | — |
| Brawler | Greatsword, Axe, Lance | Bell (Greatsword) | — |
| Arms Spellblade | Katana, Lance, Thunder | Pendant | Lightning |
| Arms Summoner | Bow, Axe, Dark | Orb (Bow) | Dark |
| Paladin | Greatsword, Axe, Light | Pendant | — |
| Cleric | Light, Blizzard, Bow | Orb (Blizzard) | — |
| Tome Summoner | Dark, Blizzard, Axe | Orb (Blizzard) | Ice |
| Tome Spellblade | Light, Thunder, Katana | Pendant | Light |
| Sorcerer | Fire, Blizzard, Thunder | Pendant | — |

The rule is today's (WP25, SB10, UT8): her ★ family when it differs, an Orb or a Bell on her lead half's kind that twins
her lone weapon. **Coverage on defaults** (weaknesses v2: a Tier 1 regular weak to 2 Arms + 2 elements, a sub-boss or a
boss to 3): the balance party (Brawler, Sorcerer, Arms Spellblade, Tome Summoner, Cleric) holds **all ten kinds**; with a
Paladin in the Cleric's place it lacks the Bow, so every regular is still answered in both channels and a boss in at
least one; **Brawler, Sorcerer, Tome Spellblade, Arms Summoner, Paladin** holds all ten. A party of the five Tier 0s on
defaults holds all ten.

## 4. The weapon shapes

### 4.1 Five shapes, ten kinds

Built in H128 (D246), live from H134.

The owner: "Light Tome to mirror Katana with double hits, and Dark Tome to mirror Bow with AoE hits." So the Bow is an
area kind too, the twins re-pair to **Katana–Light** and **Bow–Dark**, and each of the five pairs gets a shape no other
pair has (CV12):

| Pair | Shape | One act, line A (Brawler and Sorcerer) | MP | Depth 5 | Today |
|---|---|---|---|---|---|
| **Greatsword · Fire** | **Heavy** | One foe; Greatsword 1 · 1 · 2 · 2 · 3 hits, Fire 1 hit | base | Armor Break 2 · Burn 2 | Same |
| **Axe · Ice** | **Sweep** | Every foe evenly, ×0.55 a foe; Axe 1 → 3 hits, Ice 1 → 2 | +4 | Armor Break 1 · Enfeeble 1, on each | Same |
| **Lance · Lightning** | **Scatter** | Random foes, many hits (Lance 2 → 6, Lightning 2 → 4), ×1.05 | base | Armor Break 1 · Shock 1 a hit | Same |
| **Katana · Light** | **Double** | One foe, **two hits at every depth** | base | ×1.3 on a Broken foe | Katana same; **Light was one foe, 2 → 6 hits** |
| **Bow · Dark** | **Volley** | **The tapped foe takes 0.8 of the depth's power** (1 · 1 · 2 · 2 · 3 hits), **then one splash hit on every other foe at 0.35** | +2 | On the tapped foe: Armor Break 2 (Bow) · ×1.3 below half HP (Dark) | **Bow was one foe, 2 → 6 hits; Dark one foe, 2 hits** |

**Why the volley, not a second sweep** (Axe and Ice already hit every foe evenly): a volley **favours the foe she aims
at** and nicks the rest, so it has its own best case. What an act is worth, in single-target units at its depth, by how
many foes stand:

| Foes standing | Heavy | Double | Scatter | Sweep | **Volley** |
|---|---|---|---|---|---|
| 1 | 1.00 | 1.00 | 1.05 | 0.55 | **0.80** |
| 2 | 1.00 | 1.00 | 1.05 | 1.10 | **1.15** |
| 3 | 1.00 | 1.00 | 1.05 | 1.65 | **1.50** |
| 4 | 1.00 | 1.00 | 1.05 | 2.20 | **1.85** |
| 5 | 1.00 | 1.00 | 1.05 | 2.75 | **2.20** |
| 6 | 1.00 | 1.00 | 1.05 | 3.30 | **2.55** |

The volley is the best act on two foes, second to the sweep on a crowd and better than it on one, and the only area
shape that pushes the tapped foe toward her Break: three weak hits on her and one on each other weak foe at depth 5. The
[weapon shapes page](previews/weapon-shapes.html) draws each shape and this table as a chart.

### 4.2 What it does to every class's trees

Built in H128 (D246), live from H134.

| Class | Bow | Katana | Light | Dark |
|---|---|---|---|---|
| Brawler | A: **volley** (Twin Arrows … **Starfall Volley**, renamed from Starfall Barrage); B: **Barrage** (Quiver Barrage, Storm Barrage, Starfall Barrage: one foe 4 · 4 · 6 hits, the old line A; was Rain) | Same | — | — |
| Sorcerer | — | — | A: **double** (Lux … Holy, 2 hits each); B: **Pierce** (Luxaga Pierce, Luxaja Pierce, Holy Pierce; was Cascade) | A: **volley** (Nox … Black Hole); B: **Barrage** (Noxaga Barrage, Noxaja Barrage, Void Barrage; was Pierce) |
| Arms and Tome Spellblade (one foe always) | Same (2 → 4 hits) | Same (2) | **2 hits** (were 2 → 4) | **2 → 4 hits** (were 2) |
| Arms and Tome Summoner | Summons are **volleys** (Slinger … Sagittarius); D5 Armor Break 2 on the tapped foe | Same | Summons **double** (Cherub … Heaven's Legion, 2 hits) | Summons are **volleys** (Leech Imp … Abyssal Overlord); D5 Enfeeble 2 on the tapped foe |
| Paladin, Cleric | Same (one foe once; her Bow's Shatter, Katana's Hex, Light's Faith, Dark's Clarity stay) | Same | Same | Same |

- **Riders and specials land on the tapped foe; the splash is plain.** A volley's farewell (a lingering volley summon) is
  the farewell: one hit on every foe, as any summon's.
- **The Pierce list** (CP42) becomes both Spellblades' line B on every tree, the Brawler's Katana B and the Sorcerer's
  **Light** B: 66 nodes (today 36: the Spell Blade's 30, the Brawler's Katana 3, the Mage's Dark 3).
- **Node ids stay** (`brawler-bow.3b` is Barrage's first node, as it was Rain's); names and shapes are engine v19 data, and
  fights before v19 replay with theirs.

### 4.3 The twins, re-paired

Built in H128 (D246), live from H134.

| | Today | v3 (engine v19) |
|---|---|---|
| Greatsword's twin | Fire | Fire |
| Axe's | Ice | Ice |
| Lance's | Lightning | Lightning |
| Bow's | **Light** | **Dark** |
| Katana's | **Dark** | **Light** |
| Twilight (a Light + Dark foe's Arms) | Bow and Katana | Bow and Katana (unchanged: the same two Arms) |

**Every ripple of the re-pair** (CV13), by where twins are read:

| Reader | What changes | What doesn't |
|---|---|---|
| **The Rift's draws** (`rift/generate.ts`: the Duel's sets and the Horde's) | The Light set is Katana + Light, the Dark set Bow + Dark | The fronts' counts, wards, shields; Iron and Arcane (one channel each) |
| **A Hall's seat label** ("Answers Fire · Light", `hall-view.ts`) | Reads the new sets from the Limit Break's kinds; [Halls v2](halls-v2.md) owns the kinds (its §5.2 reads these sets) | — |
| **Presets** (`presetKind`, `rpgTwinKind`) | The hybrids' Orb or Bell: the Arms Summoner's on her Bow, the Tome Summoner's on her Blizzard, the Tome Spellblade's on her Light | The Arms Spellblade's on her Lance |
| **Weaknesses v2** (`rpg/campaign/weaknesses.ts`) | **Nothing.** Its elements lead with the ring's answer, element to element (Light ⇄ Dark), and its Arms come from a deck; no twin is read | — |
| **Engines v16–v17's twins** (`rpgTwinsOf`, world and chapters) | Nothing: kept by engine for their replays | — |
| **The defaults' rationale** (CP3; intake F33) | Rewritten: defaults now follow **identity** (multi-hit or area kinds) and **each hybrid holds one twin set in both halves**, which the Rift's Duel and Horde reward | — |
| **The manual's shape table** (`classes.md`, the `weapons` block; F19) | Five shapes as above; "Twice: the foe and one other" goes | — |

## 5. The calling

Built in H126 (D245), live from H134.

### 5.1 The rule

**Her calling is her Tier 0, read from her best running styles** (every style at her top grade) **alone**: no Power,
no Wit, no distance, no pick (CV19). The first row that fits:

| # | Her best styles | Tier 0 | The owner's words |
|---|---|---|---|
| 1 | **Front** among them | **Recruit** | "Pure Fronts and Front+Pace"; Front also wins any other tie, as today |
| 2 | **Pace alone** | **Duelist** | "Pure Paces" |
| 3 | **Pace with Late or End** | **Apprentice** | "Pace+Lates"; Pace with End is a closer's Pace too |
| 4 | **End** among them (Late + End, or End alone) | **Caller** | "Late+End"; End alone is today's Summoner signal |
| 5 | **Late alone** | **Acolyte** | "Pure Lates" |

### 5.2 Every combination, counted

On the local master-data release (270 outfits; counts only, no names read or written):

| Best styles | Tier 0 | Outfits |
|---|---|---|
| Front | Recruit | 27 |
| Front + Pace | Recruit | 19 |
| Front + Late | Recruit | 1 |
| Front + End; Front + Pace + Late; Front + Pace + End; Front + Late + End; all four | Recruit | 0 |
| Pace | Duelist | 72 |
| Pace + Late | Apprentice | 68 |
| Pace + Late + End | Apprentice | 3 |
| Pace + End | Apprentice | 1 |
| Late + End | Caller | 20 |
| End | Caller | 13 |
| Late | Acolyte | 46 |
| **Recruit 47 · Duelist 72 · Apprentice 72 · Caller 33 · Acolyte 46** | | **270** |

As a share: 17.4 · 26.7 · 26.7 · 12.2 · 17.0%. **Against today's rule** (each row's default, before any pick): the 61
Brawler callings become 47 Recruits, 11 Duelists (pure Pace sprinters) and 3 Apprentices; the 74 Mages become 28
Apprentices and 46 Duelists; the 56 Spell Blades 41 Apprentices and 15 Duelists; the 33 Summoners stay Callers; the 33
Paladins and 13 Cleric callings are the 46 Acolytes. **101 outfits change trade** (Wood ↔ Stone for Pace Umas, Metal →
Wood or Stone for Pace sprinters), and 134 change template type (those, and the healers' three names, [§9](#9-uma-templates)).

### 5.3 No calling pick

Today 176 Pace and Late Umas pick once between two classes (CP29). **In v3 the promotion is the pick** (CV19): a pure
Late Uma chooses Paladin or Cleric on her promotion sheet, a Pace Uma her Spellblade or her Apprentice's three, and she
can take the other later. What the old pick also moved (her trade, her template's type, her moon's node II) now follows
her style alone. Save v32 drops the stored picks ([§13](#13-engine-v19-and-save-v32)); `save/calling-repair.ts` retires.

## 6. Trades

Built in H126 (D245), live from H134.

**One trade a Tier 0, 1:1** (CV20); her calling names it, as today:

| Tier 0 | Line | Gather · Process · Make | Outfits | Today (row defaults) |
|---|---|---|---|---|
| Recruit | Metal | Mine · Mine Workbench · Weapon Forge (Arms Gems) | 47 | 61 (Brawler) |
| Duelist | Wood | Forest · Forest Workbench · Armorer (Armor Fittings) | 72 | 56 (Spell Blade) |
| Acolyte | Vegetables | Fields · Fields Workbench · Tome Forge (Tome Ink) | 46 | 46 (Paladin, Cleric) |
| Caller | Fish | Fishery · Fishery Workbench · Charm Forge (Accessory Settings) | 33 | 33 (Summoner) |
| Apprentice | Stone | Monster Den · Den Workbench · Lapidary (Planet and Moon Jewels) | 72 | 74 (Mage) |

The lines were sized by fight type (PR1), physical, physical hybrid, healer, magical hybrid and magical; the Tier 0
classes keep those slots in the same order. Metal loses 14 outfits to Wood: Arms Gems feed every class's Arms, so the
open-shop rule (a trade with no Uma in the world takes everyone) still covers an empty Mine. A class switch or a promotion
never moves a trade.

## 7. Reclassing

Built in H126 (D245), live from H134.

**The owner: "visible in game, whenever I want to reclass."** The class tree is the reclass map, in her profile's
Classes sheet ([§14.1](#141-the-class-tab-what-h120-now-builds)). The rules (CV9):

| Rule | |
|---|---|
| **R1. The classes she holds switch freely** | Every Tier 0 she has opened and every Tier 1 class she has promoted into, outside fights, as today; each keeps its own Class Rank, weapons, lines and equipped skills |
| **R2. Every Tier 0 is open to every Uma** | Free, at any time, at Class Rank 1. Her calling's is where she starts, not a lock |
| **R3. A Tier 1 class opens by promotion** | From either parent at Class Rank 10 ([§2.6](#26-promotion)) |
| **R4. A closed Tier 1 class says how** | "Opens with Recruit R10 or Caller R10" |
| **R5. Promotions are hers for good** | Saved on her Class Ranks: a Tier 1 class she holds is one with a rank |
| **R6. Tiers 2 and 3** | No Tier 0; every Tier 1 class open from Class Rank 1 ([§2.5](#25-where-tier-0-exists)) |

**What a reclass costs:**

| From | To | Cost |
|---|---|---|
| Brawler | Arms Spellblade or Arms Summoner | **Nothing:** her Recruit is at Rank 10, so its other children are one tap |
| Brawler | Tome Spellblade | Duelist or Apprentice to Rank 10: 3,600 Class EXP (**4 Class Manuals**, or the first continent's worth of fights) |
| Brawler | Cleric | Acolyte to Rank 10: the same 3,600 |
| Any | Back to a class she holds | Nothing |
| Any | Gear | Only the weapons of the new class she hasn't raised: grades belong to the weapon kind and serve every class |

**Why a gate at all, and why this one:** a reclass that costs nothing makes the tree a picture; a reclass that locks an
Uma to her calling's family would fix the roster's healers (46 Acolytes) and every Rift build to the racing data. The
Tier 0 gate is the tree doing its job: **her family is free, another family costs one Tier 0 at Rank 10**, a small,
visible price paid with fights or Manuals, never a lock. The alternative (every Tier 1 class open after her first
promotion) is in CV9.

## 8. The reset

Built in H130 (D247), live from H134.

### 8.1 What happens

The first time a save opens on save v32, in **every world, to every Uma** (CV25):

| | Tier 1's world | Tier 2's and Tier 3's |
|---|---|---|
| **Her class** | **Her calling's Tier 0, at Class Rank 1** | Her class's v3 Tier 1 class at Class Rank 1 (Brawler → Brawler, Mage → Sorcerer, Spell Blade → Arms Spellblade, Summoner → Tome Summoner, Paladin, Cleric) |
| **Every class's Class Rank** | Back to 1, every class she had | The same |
| **Every class's weapons, lines and equipped skills** | Back to their defaults (line A, auto) | The same |
| **Her calling pick** | Dropped; her calling is the new rule's | The same |
| **The refund** | Class Marks for her Manuals ([§8.2](#82-the-refund)) | Her Class EXP 1:1, in Manuals rounded up (no Tier 0 there) |

### 8.2 The refund

**Each class's EXP comes back, its first 1,800 twice,** rounded up to whole Manuals class by class (CV26):

> **Her Manuals = Σ over her classes of ⌈ ( EXP + min(EXP, 1,800) ) ÷ 1,000 ⌉**, where a class's EXP is what its Class
> Rank took on today's curve plus its bar. A class with no EXP gives none.

- **Why the first 1,800 twice:** the Tier 0 ladder to Rank 10 costs 3,600 where the old Ranks 1–10 cost 1,800. A class
  she had at Rank r ≥ 10 rebuilds as its Tier 0 to 10 and its Tier 1 class from 10 to r: her EXP + 1,800. A class
  below Rank 10 rebuilds as a Tier 0 at that rank, exactly twice. So **every class she had can be rebuilt to the rank it
  had, each from its own Tier 0**: the owner's "equivalent EXP" in the new ladder. Classes that share a Tier 0 family
  rebuild for less, and the difference is hers to spend.
- **Rounding:** up, **class by class**, so each class she had rebuilds with whole Manuals (a Manual is read onto one
  class, 1,000 at a time); at most 999 EXP over per class.
- **Paid as Class Marks, 1,000 a Manual, into her world's wallet.** **A Class Manual isn't an item you hold:** the
  Exchange reads Manuals for 1,000 Class Marks each, at once, onto one class of one Uma (`readManuals`). Paying Marks pays
  exactly those Manuals, and the Exchange's sheet already spends them, so nothing new has to exist to use them. The
  world's wallet pools them: put them on the Umas who fight first.
- **Each Uma's share is recorded** (`TierWorld.classesV3`), so the sheet lists it and the Exchange's sheet offers "Her
  share" as a count ([§14.3](#143-the-exchanges-manual-sheet)). A hint, not a reservation.
- **Marks already banked** (from Class Ranks past 50, or Ascend) stay where they are.

### 8.3 Weapon Rank: there is none to reset

**Weapon Ranks were retired in R2 (save v28, D218, WP3).** Since then a weapon has a **grade**, G0–G10, raised with
Arms Gems or Tome Ink; the grade belongs to the **weapon kind** and serves **every class that slots it** (a G6 Axe is G6
for a Brawler, a Tome Summoner and an Arms Summoner). There is no weapon progress tied to a class, so **weapon grades stay
exactly as they are** and there is nothing to refund (CV27). The same holds for armor and accessory grades and her
accessory family.

### 8.4 Work and trades

**101 outfits' trades move** with the new rule. An Uma whose trade moves has her **running job finished into the
Warehouse with its Craft EXP, and her queue dropped**, as saves v30 and v31 settled theirs (CV28); an Uma whose trade
stays keeps working untouched. Her Craft Level never moves. A place whose trade loses its last Uma becomes an open shop.

### 8.5 Everything else the reset touches

The owner's message stopped at "Also, there may be …". Read as "more places the reset touches", every place an Uma's
class is read (CV29, CV35):

| Place | At save v32 |
|---|---|
| **Uma Levels, EXP and Shards** | Stay |
| **Weapon, armor and accessory grades; her accessory family and kind** | Stay. An Orb or a Bell on a kind her Tier 0 defaults don't slot stays set, and its card says so (today's rule) |
| **Extra Stats map, her moon's jewels** | Stay; node II re-reads her calling's root ([§9](#9-uma-templates)) |
| **Craft Levels** | Stay |
| **Parties** | Stay. One healer a party reads Paladins and Clerics, and every Uma is a Tier 0, so no party is blocked |
| **Hall seats and Bonds** | **This reset leaves them alone** (a hall's class is a theme, not a rule). [Halls v2](halls-v2.md#7-the-migration-hv18hv21-hv24)'s own migration at the same save merges the healer seats (HV18–HV19: Paladin 1 + 4 → Healer 1, Paladin 2 + 3 → Healer 2, Cleric 1 + 3 → Healer 3, Cleric 2 + 4 → Healer 4, each Uma's higher Bond kept); the sheet names those Umas |
| **An open fight** (world map or Rift) | Plays out on engine v18 with the class it started with, as every engine bump does; the reset applies to its result |
| **A Rift run** | Stays: sealed fronts, the roster, an attempt's state. Its Umas are Tier 0 until rebuilt; the guidance reads held classes ([§10](#10-the-rift)) |
| **Targets** | Stay; they read her active class's three weapons, so they follow her Tier 0, then her promotion |
| **Laurels, tickets, items, Class Marks** | Stay; the refund adds Marks |
| **Achievements** | Stay |

### 8.6 The sheet: "The classes are rebuilt"

Built in H132 (D250), live from H134.

A one-time sheet the first time each world with the reset opens, like "The Wilds are rebuilt" (CV30):

```
The classes are rebuilt                                         ✕
+78 Class Manuals                       78,000 Class Marks · Exchange
Every Uma starts her class tree at Rank 1 of her Tier 0.
[ the tree, small: Warrior · All-Rounder · Mage ]
HOW TO REBUILD AN UMA
 1  Exchange → Read a Class Manual → her Tier 0 → Her share
 2  Her profile → Class → Promote (Rank 10)
    EXP past Rank 10 goes with her into the new class
RESET   Class Ranks · weapons per class · lines · equipped skills · callings
STAYS   Uma Levels · weapon, armor and accessory grades · Extra Stats · Craft Levels · Bonds · Hall seats · Laurels · items
WEAPONS No Weapon Rank since R2: grades stay
TRADES  2 Umas moved trade · their running work finished into the Warehouse
HALLS   Healer seats merged (Halls v2): Uma C · she keeps her higher Bond
EACH UMA (by Manuals)
 Uma E  Summoner R50 · Mage R15          → Caller R1      34
 Uma A  Brawler R34 · Paladin R12        → Recruit R1     21
 …
[ To the Exchange ]                                  [ Later ]
```

- Both buttons close it for good; the Account's row **"The classes are rebuilt"** reopens it.
- Each Uma's line names her old classes and ranks, her Tier 0, and her share; a moved trade adds "· trade Wood → Stone".
- **The Halls line** is [Halls v2](halls-v2.md#72-the-merge-rule-for-the-healer-sanctum-hv19)'s: the Umas whose Paladin
  or Cleric seats merged into the Healer Sanctum's (HV18–HV19), each keeping her higher Bond. This reset itself moves no
  seat and no Bond.
- The [reset page](previews/reset.html) draws it at 390×844 with the worked examples below.

### 8.7 Worked examples

Five made-up Umas in Tier 1's world (numbers on today's curve; the page computes them live):

| Uma | Her racing profile | Before | Class EXP | Refund (EXP + its first 1,800 again) → Manuals | **Manuals** | After the reset | A rebuild |
|---|---|---|---|---|---|---|---|
| **A** | Front A | Brawler R34 (bar 300), Paladin R12 (bar 100) | 13,236 · 2,476 | 15,036 → 16 · 4,276 → 5 | **21** | Recruit R1; trade Metal (stays) | 16 on Recruit, promote Brawler → **R35**; 5 on Acolyte, promote Paladin → **R14** |
| **B** | Pace A, Late A, Power 96 > Wit 88 | Spell Blade R26 (picked), Mage R8 (bar 50) | 8,200 · 1,338 | 10,000 → 10 · 2,676 → 3 | **13** | **Apprentice** R1; trade **Wood → Stone** (her Forest job finished into the Warehouse); template Clever Spellfencer → **Clever Spellwright** | 10 on Duelist, promote Arms Spellblade → **R26**; 3 on Apprentice → **R8** (Tier 0) |
| **C** | Late A | Cleric R24 (bar 200) | 7,376 | 9,176 → 10 | **10** | Acolyte R1; trade Vegetables (stays) | 10 on Acolyte, promote Cleric → **R26** (the rounding's 824 is two more ranks) |
| **D** | Pace A, unlocked yesterday | Lv 1, no Class EXP (a Mage calling) | 0 | — | **0** | **Duelist** R1; trade Stone → Wood (no work running) | — |
| **E** | Late A, End A | Summoner R50, Mage R15 | 25,480 · 3,360 | 27,280 → 28 · 5,160 → 6 | **34** | Caller R1 | 28 on Caller, promote Tome Summoner → **R50** (720 past it banks as Marks); 6 on Apprentice, promote Sorcerer → **R17** |

**The world gets 78 Manuals (78,000 Class Marks).** Each class comes back at least to its rank; rounding up adds a little.
Pooled, the owner can also spend them where he fights first: A's 21 all on Recruit make a Brawler R42.

## 9. Uma Templates

Built in H126 (D245), live from H134.

| Piece | Today | v3 (CV21) |
|---|---|---|
| **Callings** | 6 (one per class) | **5, one per Tier 0** |
| **Types** "{knack word} {type}" | 6 × 3 = 18; 90 templates | **5 × 3 = 15; 75 templates**, 60 in use (largest 13 Umas, 8 of one) |
| **The type names** | — | Recruit: Charger · Bruiser · Ironhide. Duelist: Flashblade · Spellfencer · Longblade. Apprentice: Flarecaster · Spellwright · Starkeeper. Caller: Beckoner · Binder · Shepherd. **Acolyte: Lamplighter · Mender · Pilgrim** (Shieldrunner, Warden, Stalwart retire: an Acolyte becomes either healer, and the Cleric's three are the healing words) |
| **★ Flourish** "as her calling" | Only as her calling's class | **As any class of her Tier 0 family:** her Tier 0 and its children ("Works as Recruit, Brawler, Arms Spellblade, Arms Summoner"). A Spellblade or a Summoner belongs to two families, so a Duelist and a Recruit both keep it as an Arms Spellblade |
| **★ Her moon, node II** (her calling's channel's defense, +8 × tier) | DEF for a physical calling, M.DEF for a magical one | **By her calling's root:** Recruit **DEF +8**; Apprentice **M.DEF +8**; Duelist, Caller and Acolyte (All-Rounder) **DEF +4 and M.DEF +4**. Same budget, the root's channel |
| **★ Her moon, node I** | Her knack's stat | Unchanged |
| **★ Signature** (her knack's accessory family, +0.2 a level × tier) | Any class | **Unchanged** |
| **★ Signature tip** (Tier 2, drafted) | Her lead weapon's tree, as her calling | Her lead weapon's tree, as any class of her family |
| **Stride, knack** | — | Unchanged |

Types by stride, on today's release: Recruit 12 · 20 · 15; Duelist 17 · 31 · 24; Apprentice 8 · 38 · 26; Caller 3 · 10 ·
20; Acolyte 8 · 19 · 19 (every type in use, the Lamplighter now too).

## 10. The Rift

Built in H126 (D245), live from H134.

### 10.1 The fronts map to the families

The owner's tree has four families of Tier 1 classes besides the healers: the Warrior side, the Mage side, the
Spellblades and the Summoners. The Rift has four fronts. **Each front's guided build is a family** (CV23):

| Front | What it asks | Guided build (re-specced members in bold) | Holds |
|---|---|---|---|
| **Iron** (one Arm a foe; wards elements) | Physical | Brawler; **Brawler: Bow, Katana, Axe**; Arms Spellblade; Arms Summoner; Paladin | Greatsword 2, Axe 4, Lance 2, Bow 2, Katana 2 |
| **Arcane** (elements only; wards Arms) | Magical | Sorcerer; **Sorcerer: Light, Dark, Fire**; Tome Spellblade; Tome Summoner; Cleric | Fire 2, Ice 3, Lightning 2, Light 3, Dark 2 |
| **Duel** (one boss, twin sets in both channels, mixed locks) | Every act in both channels | Arms Spellblade; **Arms Spellblade: Bow, Greatsword, Fire Tome**; Tome Spellblade; **Tome Spellblade: Dark, Blizzard, Axe**; Paladin | Every twin set 2–3 times; four sets held in both halves by one member |
| **Horde** (waves of 4–6, one twin set each) | Crowds | Arms Summoner; **Arms Summoner: Lance, Greatsword, Thunder Tome**; Tome Summoner; **Tome Summoner: Fire, Thunder, Katana**; Cleric | Every twin set 2–3 times; all ten kinds (Tier 2's keys) |

- **A run's twenty hold all eight classes**: Brawler 2, Sorcerer 2, Arms Spellblade 3, Tome Spellblade 3, Arms
  Summoner 3, Tome Summoner 3, Paladin 2, Cleric 2, and the Convergence's four parties are exactly the twenty.
- **The Duel suits the Spellblades:** a mixed lock set alternates an Arm and an element, and every Spellblade act lands
  one of each. **The Horde suits the Summoners:** every act leaves a farewell on every foe.
- **The guidance reads held classes:** the suggested party picks roster Umas who hold the front's classes; a slot no one
  fits says what's missing ("Needs an Arms Summoner"), and the Umas who could promote into it are listed first.
- **The Duel's guard rail** (no single act Breaks a Duel boss, her shields from 13) is re-measured with the Tome
  Spellblade: her best own act lands 9 weak hits (a Dark half of 4 + her extra hit, and a Bow half of 4), the Arms
  Spellblade's the same mirrored, both under the rail's 10 ([§12](#12-balance-targets-and-the-simulation)).

### 10.2 What else

- **Crossover** (five classes in one champion party) and the other titles read as they do.
- **Echoes** pay the class she fought as; a Tier 0 at Rank 10 banks it for her promotion.
- **Ascend:** a Tier 0 Uma arrives as her suggested promotion; her held classes come along (and every Tier 1 class is
  open in Tier 2's world).

## 11. Coverage and the healers

- **One healer a party** (C8): a Paladin or a Cleric, unchanged; Tier 0 counts as no healer (CV22).
- **The balance party** for the simulation is today's five on their v3 names: Brawler, Sorcerer, Arms Spellblade, Tome
  Summoner, Cleric (all ten kinds). The mirrors are measured by swapping in Tome Spellblade and Arms Summoner.
- **The default party with a Paladin** takes the Arms Summoner (her Bow) to hold all ten: Brawler, Sorcerer, Tome
  Spellblade, Arms Summoner, Paladin.

## 12. Balance targets and the simulation

Built in H131 (D249), live from H134.

What the balance packet (CV-C) measures on engine v19 with the existing sims (`world/balance-*.test.ts`,
`rift/balance-*.test.ts`), and the knob for each (CV34). **Measured (H131)** is engine v19 against v18 on the same seeds,
32 a stage, on curve, first try on Auto (`world/balance-v19.test.ts`, `rift/balance-v19.test.ts`, `SIM=1`); every knob moved
is a v19 value, so no v18 fight changed.

| # | Check | Target | Knob, in order | Measured (H131) |
|---|---|---|---|---|
| S1 | **Tier 0 through continent 1:** a party of the five Tier 0s on defaults, at Tier 0 Rank = Uma Lv, over every region of continent 1 and its capital's Finals | Win rates and rounds within ±5 points and ±1 round of today's party at the same levels | Tier 0 power (1.52 → 2.20), then continent 1's regular-foe HP | **Met** with Tier 0 power ×1.05 (`RPG_TIER0_POWER_FACTOR`: 1.60 → 2.31); foe HP unchanged. Every win 100% on both; rounds +0.57 on fights, −0.05 on sub-bosses, +0.83 on bosses, +0.38 on the Finals' three routes (at ×1 the bosses +1.07) |
| S2 | **The ladder:** `balanceClassRank` reads v3's pace (Tier 0, promoted at 10) | Depths 2–5 at Lv 10 · 16 · 22 · 29, never after the foes' reach | The Tier 0 curve | **Met** on the curve as drafted (2 × (120 + 16 × rank)): depths 2–5 at Lv 10 · 16 · 22 · 29, Rank 50 at 36, each by its foes' reach. The curve didn't move, so the reset's refund stays "the first 1,800 again" |
| S3 | **The Spellblade mirror:** Arms against Tome Spellblade a turn, Lv 10–50, world stages | Within ±5%; splits 70/30 ± 5 each way | The Tome Spellblade's hands, Arms half first | Tome ÷ Arms **102–103%** at Lv 10–50 (regular stages); the Tome Spellblade 68–74% magical, with her Arms hand 0.44 → **0.48** (75–76% at Lv 10–20 before). **Missed:** the Arms Spellblade 74% physical to Lv 20 and 79–80% from Lv 30 (v18 72–75%): her Shrike Pact is all Arms where v18's seat was half Fire, and her hands aren't this knob |
| S4 | **The Summoner mirror:** Arms against Tome Summoner | Within ±5%; splits 70/30 ± 5 | The Arms Summoner's Tome hand | **Met:** 96–103%, with her Tome hand 0.50 → **0.46** (107% at Lv 40 before); the Arms Summoner 68–73% physical, the Tome Summoner 66–72% magical |
| S5 | **The pairs:** Spellblades against Summoners | 90–110% (engine v18: 88–110%) | The Summoners' lead hand | Lead hand 0.62 → **0.57**, both (106–117% before): Tome Summoner ÷ Arms Spellblade 102–104% and Arms Summoner ÷ Tome Spellblade 98–106% at Lv 10–50, **but** the Tome Summoner's 114% at Lv 10 (v18's 110%; 0.55 would take her split under 65% at Lv 30) |
| S6 | **The volley:** Bow and Dark trees' share of a holder's damage on 1-, 3- and 5-foe stages; the Brawler's and Sorcerer's party damage against v18 | Brawler and Sorcerer within ±5% of v18 on regular stages; the volley the best act on 2-foe stages | Splash 0.35 (0.30–0.40), then target 0.8. **Shared:** Halls v2's two volley seats read the same constants | Splash and target **unchanged** (0.35, 0.8). Every shape's act within 0.01 of §4.1's table on 1–6 foes; the volley the best at 2 (1.15). The Brawler and the Sorcerer a turn without Limit Breaks 101–102% and 99–102% of v18 at Lv 10, 40 and 50, 95% and 100% at Lv 30; **missed at Lv 20** (90%, 90%): S2's pace (depth 3 there, v18's 4), which no volley knob reaches. At Lv 50 on 1 · 3 · 5 foes the Bow tree deals 38 · 68 · 70% of a Brawler's damage (Greatsword, Axe, Bow; v18 80 · 62 · 20%) and Dark 31 · 66 · 69% of a Sorcerer's (Fire, Ice, Dark; v18 32 · 30 · 23%). **The lines (CV14):** the Dark Barrage met (her a turn B ÷ A 1.03 · 1.05 on the sub-bosses and bosses at Lv 30 · 50, 0.98 · 0.95 elsewhere); the Light Pierce 0.9 → **0.85** ties A (0.96 · 0.99 on shielded sub-bosses, 1.02 · 1.02 elsewhere; at 0.875–0.9 Auto casts it three times as often and it leads everywhere, 1.09–1.17 and 1.10); the Bow Barrage, kept at 1, ties its volley on the bosses (1.03 · 0.98) and leads elsewhere (1.06 · 1.05): both **missed**, the closest the band allows |
| S7 | **Paladin against Cleric** sustain | ±10% (unchanged) | — | **Missed** (no knob): the Paladin's mends and absorbed Barriers a fight 89% of the Cleric's at Lv 10, 147% at Lv 30, 121% at Lv 50, 105% on the Lv 50 bosses; 117% in all (R1 and R2 111–112%) |
| S8 | **The Rift's four builds** at tier Lv 50, on curve | Each front's win rate within ±5 points of engine v18's; the Duel's guard rail (best single act ≤ 10 chips; shields 13+) | `riftTuning` per front, as H71 and H81 did | **Met but one** with `RIFT_TUNING_V19` (Iron ×0.88 HP; the Duel ×1.3 HP; champions Iron ×1.13 HP ×1.08 offense, Arcane ×1.01 ×0.94, Duel ×1, Horde ×1.25), points off v18 by stages 1–4 · 5–8 · 9–11 · champion: Iron +3.9 · −1.3 · **+16.0** · +2.1, Arcane −2.1 · −1.8 · 0 · −2.1, Duel −0.5 · 0 · +4.5 · −4.2, Horde +0.5 · −2.1 · −1.0 · −4.2 ([rift.md §11](../rift.md#11-balance-targets)). The rail: every class's best own act 1–10 chips (the Summoners 10, the Spellblades 9), the best Limit Break 10 (Firefly Pact), at most 10 hits on one foe; shields 13–15 unchanged |
| S9 | **Echoes** with a fresh class (now Rank 10) | The Lv 45 Echo still won with one fresh Uma | — | **Met:** 100% on every front with one Uma fresh at Class Rank 10 |
| S10 | **Shield chips** on world stages with the volley's splash | Rounds to the Break within ±0.5 of v18 | The splash (plain hits already chip; a cap if needed) | **Met:** the worst 0.45 rounds (the Lv 50 boss, sooner); no splash rule added |

Halls v2's two (HV-D), measured with these: **H1** each class's Limit Break against halls-v2 §3.5's change, and **H2** party
win rates within ±3 points of v18's ([halls-v2 §3.2 and §3.5](halls-v2.md#35-against-today)): H2 0 points everywhere; H1
met by the Brawler only, the class scales at their bands' edges (0.95, the healers 0.8).

## 13. Engine v19 and save v32

**Both ship together, behind one flag (`rpgRework('classes')`), switched on in one packet** (CV31). Fights from engine
v18 and older replay on their own rules; every class rule below is a new generation row, as v15, v16 and v18 did.

| Engine v19 | |
|---|---|
| Classes | 13 ids: `recruit`, `apprentice`, `duelist`, `caller`, `acolyte`; `brawler`, `mage` (Sorcerer), `spellblade` (Arms Spellblade), `tomeblade`, `armsummoner`, `summoner` (Tome Summoner), `paladin`, `cleric`. One lowercase word each (the node-id grammar, `^([a-z]+)-…`) |
| Tier 0 | One act ×1, three slots of any kind, no lean, armor's offense and Prowess by her slots, no support; a one-node tree per weapon (50), power by Class Rank (§2.2) |
| The pairs | A hand's **lead half** read from data, not the class: the extra hit (Spellblades), the linger (Summoners), the resolve order. Tome Spellblade Tome 0.72 + Arms 0.44; Arms Summoner Arms 0.62 + Tome 0.50 |
| Trees | 70 Tier 1 trees (Tome Spellblade's 80 nodes with her names, Arms Summoner's 80 with the summons, lines mirrored) and 50 Tier 0 trees: 610 nodes |
| Shapes | Bow and Dark volley, Light double; the Brawler's Bow B, the Sorcerer's Light B and Dark B; the Spellblades' and Summoners' hits (§4.2) |
| Twins | `RPG_KIND_PAIRS` by engine: Katana–Light, Bow–Dark from v19 |
| Rift | The four builds (§10); fronts' foes tuned by S8 |
| Halls | **[Halls v2](halls-v2.md) rides v19 and save v32** (HV24): five halls, twenty Limit Breaks with their own power, the class scale (1; healers 0.75), the healer seats' merge |

Save v32 built in H130 (D247), live from H134.

| Save v32 | |
|---|---|
| `OwnedUma.classId` | Her calling's Tier 0 (Tier 1's world) or her mapped Tier 1 class (later tiers) |
| `OwnedUma.classes` | Emptied: every class back to its defaults |
| `OwnedUma.ranks.classes` | Emptied. From v32 a Tier 1 class she holds is one with a track (opened at rank 10); a Tier 0's track may hold EXP waiting past 10 |
| `OwnedUma.calling` | **Dropped** (no picks) |
| `TierWorld.wallet.classMarks` | + her Manuals × 1,000, every Uma |
| `TierWorld.classesV3` | New, once: the grant, each Uma's line (old classes and ranks, Manuals, a moved trade) for the sheet; absent in a world made after v32 |
| Work | A moved trade's running job settled into the Warehouse with its Craft EXP, its queue dropped |
| Parsers | 13 class ids; Tier 0 slots any kind; a Tier 1 class's rank ≥ 10 in Tier 1's world |

## 14. The screens

§14.1's class tree, Tier 0 tree and dot and §14.2's promotion sheet: built in H137 (D253), on today's Skills tab; H120
moves them into the Class tab. Live from H134.

### 14.1 The Class tab: what H120 now builds

Profile v2's Class tab ([§4.1](../uma-profile-v2/proposal.md#41-class), UP10) keeps its layout; four pieces change
(CV32):

| Piece | Profile v2 as approved | **With classes v3** |
|---|---|---|
| **Class tile** | Emblem, name, "R34", a thin bar | The same; a Tier 0 reads "Recruit · R7/10"; at 10 a Ready dot and "Promote" |
| **Class sheet** | "Six class tiles in two rows", her hand, the healer warning; tap a class to fight as it; footer: Standard preset | **"Classes": the class tree.** Three columns, Tier 0 above Tier 1, each class a tile with its emblem and rank, in the state language (UP23): **On** her active class; **Available** a class she holds; **Ready** (green dot) a child she can promote into now; **Open** a Tier 0 she hasn't started ("R1 · free"); **Closed** faded with its gate ("Recruit R10 or Caller R10"). Tap a tile: Selected ring and one line under the tree (its slots, defaults and role). **Footer, by the selection:** her active class → **Standard preset**; a held class → **Fight as Arms Summoner**; a Ready class → **Promote to …** (opens §14.2); an open Tier 0 → **Start Caller · R1**; a closed class → disabled with its gate. A row **"Class Manuals ›"** is a door to the Exchange's sheet with her picked (Back returns here; UP30's no-spending-in-the-profile holds) |
| **The tree below** | The selected weapon's tree (trunk, line squares A/B, depths) | Tier 1: the same. **Tier 0: one node** ("Drill Strike · Greatsword", rank badge = Class Rank, "one foe · 1 hit · 1.97 · 10 MP") and a line "Promotion at R10 · 3 to go"; no line squares |
| **Dots** (UP18: "Class: never in Tier 1") | Never | **A promotion waits:** while she fights as a Tier 0 at Rank 10. Once she fights as a Tier 1 class, siblings are a choice, not a dot |

### 14.2 The promotion sheet

The owner's "class promotion screen". Opened from the Ready class tile, the Ready dot, or a Ready tile in the Classes
sheet. One sheet, one action:

```
Promote · Recruit R10                                           ✕
Choose her class. Free; the others stay open.
┌───────────────┐ ┌───────────────┐ ┌───────────────┐
│ ⚔ Brawler     │ │ ⚔ Arms        │ │ ⚔ Arms        │
│ Suggested     │ │  Spellblade   │ │  Summoner     │
│ 3 Arms        │ │ 2 Arms+1 Tome │ │ 2 Arms+1 Tome │
│ GS Ax Ln      │ │ Kt Ln · Th    │ │ Bw Ax · Dk    │
│ One act ×1    │ │ Multi-hit     │ │ Area, lingers │
└───────────────┘ └───────────────┘ └───────────────┘
Brawler R10   ·  depths 1–2  ·  6 skills  ·  + 400 EXP waiting
[ Promote to Brawler ]
```

- **Tiles show what differs** (profile v2's rule, TC:76–77): slots, the three defaults, the one-line role; a held child
  reads "Held" and its tile switches to it instead.
- **Before → after** in one line: the class and its rank, the depths, the skills, the waiting EXP.
- **No confirm:** promotion is free and closes nothing (UP6: free on tap); the sheet itself is the deliberate step.
- After: she fights as it; the tab redraws on its first weapon's tree.

### 14.3 The Exchange's Manual sheet

Built in H132 (D250): its shape (a bar selected, a count, one footer) live; the v19 rows from H134.

UP30 keeps Manuals at the Exchange. Its sheet (pick an Uma, a class, a count) changes in three small ways (CV30):

| | Today | With classes v3 |
|---|---|---|
| Her bars | Her six classes | **The classes she holds and the five Tier 0s;** a closed Tier 1 class isn't listed |
| Counts | 1 · 5 · 10 · as many as her Marks buy | + **"To Rank 10"** on a Tier 0 (4 from Rank 1) and **"Her share"** (her reset Manuals, while the record lasts) |
| Past the top rank | "Already at the top rank" | On a Tier 0 at Rank 10: **"Waits for her promotion"** and the count still reads (up to Rank 50's worth) |

### 14.4 H123 (the Template tab): what changes

| Piece | Profile v2 as approved | **With classes v3** |
|---|---|---|
| Calling row | Fixed, picked, or the open pick with its tiles and confirm sheet | **Always fixed:** "Calling Recruit · fixed · Trade Metal". The pick tiles, the confirm sheet and the "pick open" dot go (H123 gets smaller) |
| Locked Uma | "Pick on unlock · A or B" | "Calling on unlock · Duelist" |
| ★ Flourish row | "Works as Brawler" / "Off · as Mage" | "Works as Recruit, Brawler, Arms Spellblade, Arms Summoner" / "Off · as Sorcerer"; its action **Fight as …** lists the family's held classes |
| ★ Moon II | "DEF +8" or "M.DEF +8" | Also "DEF +4 · M.DEF +4" for an All-Rounder calling |
| Calling reading's source | "from Pace A · Power 96 > Wit 88" | "from Pace A" (styles only) |
| Types | 18 | 15 |

### 14.5 Elsewhere

| Screen | Change |
|---|---|
| **Class emblems** | Seven new pixel emblems in uma-art's `ui` atlas (`class/recruit` … `class/acolyte`, `class/tomeblade`, `class/armsummoner`): the Tier 0s as plain, outlined forms of their family's shape; the two new hybrids as their mirror's emblem in the other channel's colour (CV33) |
| **Party Hall, world bars, the Rift's slots** | Read 13 classes; the healer warning unchanged |
| **Stable filters** | Calling: five; Class: thirteen (Tier 0 and Tier 1 groups) |
| **Halls of Heroes** | [Halls v2](halls-v2.md)'s (five halls; its own page) |
| **The one-time sheet and the Account row** | §8.6 |
| **The manual** | `classes.md`, `skill-trees.md`, `combat.md` (shapes, statuses' riders), `loops.md` (Class Rank, the reset's section beside the Tier rework's updates), `sections.md` (Stable, Exchange); `pnpm docs:update` |

## 15. Halls v2: what this doc hands it

[Halls v2](halls-v2.md) (the Limit Break rework, HV1–HV25) is written beside this doc, from the same class list, and
rides the same engine v19 and save v32 (HV24). It brings **five halls, one per Tier 0 family** (the Warrior Dojo, the
Mage Tower, the Spell Blade Salle, the Summoner Circle and the Healer Sanctum), **no Tier 0 hall** (a Tier 0 Uma sits in
any seat), and **power on each Limit Break**, × her class's scale × her open depth. Its [§8](halls-v2.md#8-what-classes-v3-must-provide)
is the other half of this seam.

| This doc gives Halls v2 | Halls v2 gives this doc |
|---|---|
| The class list: 5 Tier 0 and 8 Tier 1 classes, their ids and display names (§0); the Warrior root's name (CV2) | The halls and seats: one hall per Tier 0 family, four seats each, twenty Limit Breaks; no Tier 0 hall |
| The healers: the Paladin and the Cleric; a Tier 0 is no healer (CV22) | **The Limit Break scale:** 1 for every class (the five Tier 0s and the six damage classes), **0.75 for the Paladin and the Cleric** (HV5). Every sheet here shows it in place of today's class power |
| The new twins (Katana–Light, Bow–Dark) and Twilight, for its Limit Breaks' kinds, sets and seat labels | — |
| **The volley's constants** (the tapped foe 0.8, every other 0.35, §4.1) | Its two volley seats (the Warrior Dojo's Bow, the Mage Tower's Dark) read the same constants: if S6 tunes the splash, they follow |
| The renames (Mage → Sorcerer, Spell Blade → Arms Spellblade, Summoner → Tome Summoner) | Hall names by family; the Mage Tower keeps its word |
| Engine v19 and save v32 behind `rpgRework('classes')` | **v19, with it** (HV24): one migration, one sheet |
| The reset leaves seats and Bonds alone | Its healer merge (HV18–HV19) at the same save; **"The classes are rebuilt" takes one line** naming the Umas whose healer seats merged (§8.6) |

**One collision to know:** "Sorcerer" is also the name class progression's Tier 2 draft gave the Mage's second branch
(CP34). That draft is re-planned after hardening and renames its branch then; nothing built uses it.

## 16. Decisions

| Call | Recommendation | Alternatives, briefly | Why |
|---|---|---|---|
| **CV1** The tree | **Three root columns, left to right Warrior · All-Rounder · Mage; five Tier 0 classes on top, eight Tier 1 below; a hybrid has two parents** (its Tier 0 and its channel's root class) | A tree per root with no shared children; hybrids under one parent | Every promotion the owner named is an edge; his promotion screens fall out of it; a hybrid is reachable from either side |
| **CV2** The Fighter root's label | **"Warrior"** on screen | Keep "Fighter" | "Fighter" is an exact master-data skill name; UT16 renamed names for the same reason. A root is only a label |
| **CV3** Tier 0 names | **Recruit, Apprentice, Duelist, Caller, Acolyte** | The owner's Fighter, Mage, Spell Blade, Summoner, Healer; Cadet, Novice, Spellsword, Evoker, Initiate | Beginners of what they become; none repeats a root or a Tier 1 name; none matches master data; "Acolyte" doesn't promise a mend it lacks |
| **CV4** Tier 1 names and ids | **The owner's eight; Mage renamed Sorcerer; ids kept** (`mage`, `spellblade`, `summoner` for Sorcerer, Arms Spellblade, Tome Summoner); new `tomeblade`, `armsummoner`; Tier 0 ids from their names | New ids for renamed classes | Kept ids keep 30 trees, saves and replays; ids are one lowercase word for the node grammar |
| **CV5** Tier 0's ladder | **Class Rank 1–10 at 2 × (120 + 16 × rank): 3,600 to Rank 10;** Rank equals Uma Lv when fought as it from Lv 1 | Today's curve (Rank 10 at Lv 7); a flat cost per rank | The owner's "maxed at the end of the first scenario": Lv 10 is the first continent's capital |
| **CV6** The Tier 0 skill | **One a class (Drill Strike, Primer, Feint, Beckon, Vigil), identical numbers: one foe, one hit, 1.52 → 2.20 by Class Rank, 10 MP; cast through any of her three weapons** (a one-node tree per weapon) | A skill per weapon with its own name; Skill Ranks every 2 Class Ranks; depth 1's flat 1.6 | The owner's literal spec; the rank climbing each Class Rank keeps the 10 ranks alive; the kind still answers weaknesses |
| **CV7** Tier 0's slots and stats | **Three slots, any of the ten, three different; one act ×1; no lean; armor's offense and Prowess by her slots; no support; defaults and preset form from one child** (Brawler's, Sorcerer's, Arms Spellblade's, Tome Summoner's, Cleric's) | Her family's lean; a 50/50 split; a healer rider on the Acolyte | The owner's "every weapon"; simplest; the five defaults hold all ten kinds; no support keeps "single target damage" literal |
| **CV8** Promotion | **At Rank 10 each child opens, free, at Class Rank 10, and she fights as it; the EXP past 10 waits on the Tier 0 (up to 23,680) and the next promotion takes it; siblings open later at no cost** | Open at Rank 1; one promotion only; EXP past 10 to Marks | Rank 10 keeps every depth before the world's foes expect it (§2.6); nothing earned is lost; nothing closes |
| **CV9** Reclassing | **Free switching between held classes; every Tier 0 open to all at Rank 1; another family's Tier 1 class through its Tier 0 at Rank 10 (3,600, about 4 Manuals)** | Everything open after her first promotion; locked to her calling's family | The tree gates something small and visible; no Uma is locked out of a healer or a Rift build |
| **CV10** Later tiers | **Tier 0 is Tier 1's only; in Tiers 2 and 3 every Tier 1 class is open from Rank 1; a Tier 0 Uma ascends as her suggested promotion** | Tier 0 in every tier; promotions only in Tier 1 for good | The introduction is an introduction; the Tier 2 re-plan adds its own layer |
| **CV11** The suggestion | **One child marked Suggested: Brawler, Sorcerer; for two-way choices Power over Wit the Arms child (or Paladin), else the Tome child (or Cleric)** | No suggestion | Today's calling pick's reading, kept as a hint where the pick used to be |
| **CV12** Weapon shapes | **Five shapes: Heavy, Sweep, Scatter, Double (Katana, Light: two hits), Volley (Bow, Dark: the tapped foe 0.8 of the power, one splash hit at 0.35 on every other, +2 MP; riders on the target)** | Bow and Dark every foe evenly; Light many hits | The owner's double and AoE; the volley is not a second sweep: best at two foes, the only area shape that aims |
| **CV13** Twins | **Re-paired by engine: Katana–Light, Bow–Dark** (Twilight unchanged); every reader listed in §4.3; weaknesses v2 untouched | Keep Bow–Light and Katana–Dark | The shapes define the pairs (D86); the Rift's sets, presets and hall labels follow; v16–v17 replays keep theirs |
| **CV14** B lines | **Brawler Bow B Barrage (the old Bow A, one foe 4 · 4 · 6); Sorcerer Light B Pierce (was Cascade); Sorcerer Dark B Barrage (was Pierce)**; the Pierce list 66 nodes | Keep Rain, Cascade, Dark's Pierce | Rain duplicated the volley; the twins' B lines mirror (Katana and Light Pierce, Bow and Dark Barrage); the old Bow shape survives as a line |
| **CV15** The new hybrids | **Mirrors: Tome Spellblade Tome 0.72 + Arms 0.44, her Tome half first with the extra hit, lean ×0.95 ATK ×1.1 M.ATK; Arms Summoner Arms 0.62 + Tome 0.50, her Arms summon first and lingering, lean ×1.1 ATK ×0.95 M.ATK; splits 30/70 and 70/30** | New hands from scratch | The owner's "inverse class"; the mirrors are measured (S3, S4) on numbers already balanced |
| **CV16** Defaults and presets | **The owner's sets:** Arms Spellblade Katana, Lance · Thunder; Tome Spellblade Light, Thunder · Katana; Arms Summoner Bow, Axe · Dark; Tome Summoner Dark, Blizzard · Axe; the rest as today; forms by today's rule | Today's Summoner set (Dark, Light, Bow) | His sets; each hybrid holds three of its identity's four kinds and one twin set in both halves |
| **CV17** The new trees | **Tome Spellblade: the Spell Blade's rule, her own names (Edged · Honed · Whetted · Gleaming · Sovereign × Pyre, Frost, Volt, Lumen, Umbra; the blade nouns on Arms), B Pierce. Arms Summoner: the Summoner's summons, B Bonded on Arms, Pack on Tomes** | Own names for both (95 new words); the same names for both | A Spellblade's skills are her techniques, a Summoner's are creatures of a kind; cheapest that reads right |
| **CV18** Prowess and armor | **Brawler 100/0, Arms hybrids 70/30, Paladin 80/20, Cleric 20/80, Tome hybrids 30/70, Sorcerer 0/100; Tier 0 by her slots; armor's offense to her class's lead channel** | — | Today's splits on the mirrors |
| **CV19** The calling | **Styles only, four rows: Front a Recruit; Pace alone a Duelist; Pace with Late or End an Apprentice; End a Caller; Late alone an Acolyte. No calling pick: the promotion is the pick** | Keep a pick for Pace + Late; read Power and Wit | The owner's mapping covers every combination; 47 · 72 · 72 · 33 · 46; the choice he cared about moves to the promotion |
| **CV20** Trades | **One trade a Tier 0: Recruit Metal, Duelist Wood, Acolyte Vegetables, Caller Fish, Apprentice Stone** | Trades by Tier 1 class | The owner: "match the existing profession mechanic"; five lines, five Tier 0s |
| **CV21** Templates | **5 callings × 3 strides, 75 templates; Acolyte's types Lamplighter · Mender · Pilgrim; the Flourish as any class of her Tier 0 family; moon II by root (DEF +8, M.DEF +8, or +4 and +4); signature unchanged** | Six callings kept; node II by her active class | One calling per Tier 0; the family gate is the tree's own unit; the split node II is the All-Rounder column on her moon |
| **CV22** Healers | **One healer a party: Paladin and Cleric only; Tier 0 isn't a healer** | Count the Acolyte | An Acolyte doesn't heal |
| **CV23** The Rift | **Iron the Warrior side, Arcane the Mage side, Duel the Spellblades, Horde the Summoners;** the guided builds of §10, each kind or set answered twice; the guidance reads held classes | Today's compositions on new names | Four fronts, four families; a run uses all eight; the Duel's mixed locks fit the pair act |
| **CV24** Limit Break scale | **[Halls v2](halls-v2.md)'s (HV5): each class shows a Limit Break scale, 1 for every class and every Tier 0, 0.75 for the Paladin and the Cleric**; the power is each Limit Break's own; this doc sets no per-class power | An interim per-class power column here (today's 2×, 2.4×, 2.2×, 1.5×) | The Limit Break rework is Halls v2's; one owner per number |
| **CV25** The reset's scope | **Every Uma in every world, once at save v32: Tier 1's world to her Tier 0 at Rank 1; later tiers to her mapped Tier 1 class at Rank 1** | Tier 1's world only | The owner's "every single Uma"; one rule a world can apply |
| **CV26** The refund | **Each class's EXP plus its first 1,800 again, rounded up to whole Manuals class by class; paid as 1,000 Class Marks a Manual into the world's wallet; each Uma's share recorded** (later tiers 1:1) | Literal 1:1; a flat +2 Manuals; a held Manual item | Rebuilds every class she had from its own Tier 0; Manuals are bought with Marks and read at once, so Marks are the Manuals; no new item or screen |
| **CV27** Weapons | **Weapon grades stay; there is no Weapon Rank to reset** | — | Weapon Ranks retired in R2; a grade belongs to the kind and every class uses it |
| **CV28** Work | **A moved trade's running job finishes into the Warehouse with its Craft EXP; its queue drops; other work untouched** | Recall (time lost); leave it running in another trade's place | Saves v30 and v31's precedent; nobody loses time to a rule change |
| **CV29** What else | **Lines, equipped skills and each class's weapons reset; picks drop; parties, Halls, Bonds, grades, Extra Stats, Craft, Laurels, items, Marks stay; open fights finish on v18** | — | Only what the new tree changes resets |
| **CV30** The sheet and the Exchange | **"The classes are rebuilt"** (the grant, how to rebuild, what reset and stayed, each Uma's line; To the Exchange · Later; an Account row); **the Exchange's sheet lists held classes and Tier 0s, adds "To Rank 10" and "Her share", and lets a Tier 0 at 10 bank for her promotion** | A per-Uma "Restore" button; a Manual item and a new screen | The owner's "proper UI without major reworks": two existing sheets, one door |
| **CV31** Versions | **Engine v19 and save v32 together, behind `rpgRework('classes')`, one switch packet; Halls v2 rides both (HV24)** | Separate engine and save releases | The reset and the rules can't exist apart; replays keep v18 |
| **CV32** Profile v2 | **H120: the Classes sheet becomes the tree with contextual footer, the promotion sheet, the Tier 0 tree, the promotion dot, the Manuals door. H123: the calling is always fixed; the Flourish family; moon II's split; 15 types** | A separate class-tree page outside the profile | Profile v2's grammar holds (one sheet, one action); no fifth tab; the owner reclasses where he already changes class |
| **CV33** Emblems | **Seven new pixel emblems in uma-art** (five Tier 0s outlined from their family's shape; the two hybrids as their mirror's in the other channel's colour) | Reuse emblems | Every class has an emblem today; a uma-art release, cheapest that reads |
| **CV34** Balance | **S1–S10 (§12)** with their knobs | — | Each new number has a target and one knob first |
| **CV35** The cut-off sentence | **Read as "more places the reset touches"; §8.5 covers every place her class is read** | Wait for the owner | No open questions; anything else lands as a follow-up |
| **CV36** Build order | **§17:** domain first, then shapes, save, balance; the screens in profile v2's H120 and H123; one switch | One big packet | Each step tested on its own; the switch is the only visible moment |

## 17. Build plan

Packet ids are assigned by the main session (placeholders CV-A …); decisions from the next free D number. Every packet:
the manual's part in step, the tests green; UI packets measured at 390×844 and 375×667, light and dark.

| Id | Packet | Scope | Who | Size | Needs |
|---|---|---|---|---|---|
| **CV-A** | **Classes v3 in the domain** | The 13 class ids and their rules by generation (slots, hands with a data lead half, leans, Prowess, armor's half, defaults, presets); Tier 0 (curve, skill, one-node trees, waiting EXP, promotion and reclass rules, the suggestion); the Tome Spellblade's and Arms Summoner's trees; the calling rule and templates (15 types, the Flourish family, node II by root); trades by Tier 0; behind `rpgRework('classes')` | Claude | L | — |
| **CV-B** | **The weapon shapes** | Volley and double; the B lines (Brawler Bow, Sorcerer Light and Dark); the Spellblades' and Summoners' hits; the twins by engine; the Rift's draws; `presetKind`; the hall labels; the Pierce list | Claude | M | CV-A |
| **CV-C** | **Balance on engine v19** | S1–S10 on the existing sims, `balanceClassRank` on v3's pace, the four Rift builds and `riftTuning`; knobs as §12 orders them; results logged | Claude | M–L | CV-A, CV-B; Halls v2's Limit Breaks (same engine v19, HV24) |
| **CV-D** | **Save v32: the reset** | The migration (§8.1, §8.2, §8.4, §8.5; `TierWorld.classesV3`), parsers, later tiers, fixtures and tests; `calling-repair.ts` retired | Claude | M | CV-A |
| **CV-E** | **The sheet and the Exchange** | "The classes are rebuilt" and its Account row; the Exchange's Manual sheet (held classes and Tier 0s, To Rank 10, Her share, Waits for her promotion) | ChatGPT | S–M | CV-D |
| **CV-F** | **uma-art: seven class emblems** | `class/recruit`, `apprentice`, `duelist`, `caller`, `acolyte`, `tomeblade`, `armsummoner` in the `ui` atlas; a uma-art minor; uma-rpg pins it | Claude, uma-platform session | S | — |
| **H120 (amended)** | **Class tab** | Profile v2's §4.1 plus §14.1–§14.2 here: the Classes sheet as the tree, the promotion sheet, the Tier 0 tree view, the promotion dot, the Manuals door | ChatGPT | M → M+ | H119, CV-A, CV-F |
| **H123 (amended)** | **Template tab** | Profile v2's §5 minus the calling pick, plus §14.4 here | Claude | M → S–M | H120–H122, CV-A |
| **CV-G** | **Switch on** | Engine v19 and save v32 live together; the Rift guidance by held classes; `pnpm docs:update` and the manual's hand-written pages; the phone check | Claude | M | CV-B … CV-E, H120, H123, Halls v2's packets (they switch on together) |

**Order:** CV-A ∥ CV-F → CV-B → CV-D → CV-C → (CV-E ∥ H120 ∥ H123, after profile v2's H119) → CV-G, with [Halls
v2's packets](halls-v2.md#11-build-plan) beside CV-B to CV-D on the same engine. Nothing is visible to the owner before
CV-G: the reset, the tree, the halls and the new rules arrive in one release, with the sheet that explains them.
