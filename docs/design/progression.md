# Progression: Uma Level, Class Rank, Weapon and Armor Ranks

> **Status: built 2026-10-12 (D102–D105).** The manual ([loops](../game/loops.md#ranks), [classes](../game/classes.md),
> [materials](../game/materials.md#gear)) is current; this page keeps the reasoning. As built: stage EXP weights 0.36 and
> 0.43 (not the D97 0.32/0.4), and 28 Forge types (ten weapons, eight armors, ten Orbs). Written from the owner's notes of
> 2026-10-12; where they left a choice open, the choice is marked **(decided)** with its reason.

## Goals

- **Four bars with one job each,** all filled by fighting, nothing passive, no tokens and no level caps between them.
- **A full campaign** (the world-map stages a party chooses, about 120 first clears, D97) takes one Uma to **Lv 50**,
  **two classes to max rank**, and **five weapons and five armors to max rank**.
- **Uma EXP is the one thing never sped up.** Every Uma walks the whole road to Lv 50.
- **Later campaigns go faster:** progress past a max rank banks as a currency that buys books for any Uma.
- **Small numbers, linear growth:** stats in the tens to low hundreds, hits in the hundreds, nothing in the thousands
  except big boss HP.
- **No tokens anywhere** (second pass): what to push ahead is the player's choice, paid in time, materials and Marks.

## The four bars

| Bar | Range | Earned by | Opens |
|---|---|---|---|
| **Uma Level** | 1–50 | Every win | Her stats (linear, below), her skill slots (3 → 10) and her Extra Stats slots (5 → 30). Nothing else |
| **Class Rank**, one per class | 1–50 | Wins as that class | **Every skill-tree rule:** depth d's core at rank 1, 10, 20, 30, 40; its side skills at rank 5, 15, 25, 35, 45; one side point per rank, per class |
| **Weapon Rank**, one per weapon (10) | 1–10 | Wins with that weapon in her slots | The grade of that weapon she can wear (grade k at rank k). Shared by every class that holds the weapon |
| **Armor Rank**, one per armor type (10) | 1–10 | Wins wearing that armor type | The grade of that armor she can wear (grade k at rank k) |

- **No caps between bars.** A Lv 1 Uma with a Rank 10 Greatsword wears a grade-10 Greatsword; that's the player's call.
- **Per weapon, per armor type, for good.** Greatsword EXP only ever comes from the Greatsword; nothing moves between
  bars except through books, which cost banked currency (below).
- **Class Rank replaces Uma Level in the trees.** Today's depth gates (Lv 1, 10, 20, 30, 40, sides at 5 … 45) and the
  side point per level move onto Class Rank unchanged, so a class's trees open as that class is played.

## EXP per win

Every win already pays each entrant her Uma EXP, `E`. The other bars are set from it:

| Bar | Per win | Curve |
|---|---|---|
| Uma | `E` = stage weight × her own EXP-to-next × level gap (see below) | 120 + 16 × level (today's), 25,480 to Lv 50 |
| Class | `2E` to the class she fought as | The Uma curve: rank r needs what Lv r needs |
| Weapons | `5E` shared by her five slotted weapons: each carried weapon 1 part, each weapon she used that fight 2 parts | Rank k needs what Lv 5k − 4 needs (840 to rank 2 … 21,960 to rank 10) |
| Armors | `E` to each of her five worn armor types | Same as weapons |

**Why these numbers** (the campaign target, checked over the Uma curve):
- Uma: the campaign's EXP takes her to Lv 50, as today (D97).
- Class: twice the Uma's EXP is two full classes. One class played the whole way maxes around Lv 34; the second by 50.
- Weapons: a weapon carried and used every fight gets about `E` a win, so it reaches rank k when she reaches Lv 5k − 4
  and rank 10 at Lv 46. Five used weapons max together. A carried weapon she never uses gets about half.
- Armors: the same, without the use split (armor has nothing to "use").

**Uma EXP can't be sped up** (decided, from "they all have to take the full journey"):
- `E` is a share of **her own** EXP-to-next level, no longer the foes'. A Lv 1 Uma in a Lv 40 fight still gains
  about a third of a level.
- The level-gap factor stops at 100%: fighting above her level no longer pays up to 2×. Fighting below it still pays
  less (−10% a level, down to 10%).
- No book, currency or shortcut gives Uma EXP.

Replays and Sweeps keep paying a quarter (D79), on every bar.

## Banked progress: Marks and books

- **Past a max rank, EXP banks at half rate as a currency** for the whole world, not the Uma:
  - **Gear Marks** from weapons and armors at rank 10 (decided: one shared currency, since weapon and armor ranks
    mirror each other);
  - **Class Marks** from classes at rank 50.
- **Books** at the Exchange turn Marks into EXP for one bar of one Uma, one for one: a **Weapon Manual** (pick a
  weapon), an **Armor Manual** (pick an armor type) or a **Class Manual** (pick a class), each **1,000 EXP for 1,000
  Marks** (decided: one size; about a weapon's first rank, or a class's first six).
- So a first campaign is all fighting; a later one can start a new Uma with books bought from what earlier Umas banked.
  Uma Level is never for sale.

## Equipment: five weapons and five armors

**Weapons stay as built (D86, D98):** five slots, five of the ten weapons, a Training weapon (grade 0) in any slot
without a crafted one.

**Armor mirrors them:** five slots, one per body part, each taking its **Physical** or **Magical** type, so five of ten
armor types:

| Slot | Physical | Magical |
|---|---|---|
| Head | Helm | Circlet |
| Body | Cuirass | Robe |
| Legs | Greaves | Leggings |
| Arms | Gauntlets | Bracers |
| Accessory | Arms Orb (pick its weapon kind) | Elemental Orb (pick its element) |

- Every class wears any mix (decided: armor choice is free; the class's slot rules stay on weapons only).
- Every Uma holds a **Training armor** of all ten types (grade 0, no stats), so each slot earns Armor EXP from day one.
- **Rings and Charms retire;** the accessory slot is the Orb, which keeps its weakness role.
- **Crafting stays symmetric:** Physical armor and Arms Orbs use the Arms families (ores, stones, woods, hides), Magical
  armor and Elemental Orbs the Tome families (crystals, fibers, essences, bones). Four refined items of the grade, as
  today.

**What armor does** (decided: armor doesn't add damage, and defense alone isn't enough in our fights):

| Type | Per grade g |
|---|---|
| Physical armor | +g DEF, and a **Barrier** of 5g at the start of each fight (absorbs damage before HP) |
| Magical armor | +g MDEF, and **Regen** of g HP at the start of each of her turns |
| Either, accent | The piece's accent stat: +⌈g/2⌉ (up to +5 at grade 10). An Orb's accent is its kind instead |

Weapons have no accent: a weapon's grade is its **Might**, +4 per grade added to the offense of hits made with that
weapon (+40 at grade 10). Only the weapon a hit uses counts, so each slot matters for its own skills.

## Crafting and recipes

The Forge makes 28 types in ten grades; Craft Level gates the grade made (5g − 4), the matching rank the grade worn.

| Group | Types | Recipe (per piece) | Choice at the Forge |
|---|---|---|---|
| Arms | Greatsword, Axe, Lance, Bow, Katana | One refined item of the grade from each Arms family: ores, stones, woods, hides | None: grade only |
| Tomes | Fire, Blizzard, Thunder, Light, Dark | One from each Tome family: crystals, fibers, essences, bones | None |
| Physical armor | Helm, Cuirass, Greaves, Gauntlets | Same as Arms | Accent (one of eight stats) |
| Magical armor | Circlet, Robe, Leggings, Bracers | Same as Tomes | Accent |
| Arms Orb | One per weapon kind (5) | Same as Arms | None: the kind is the type |
| Elemental Orb | One per element (5) | Same as Tomes | None |

- Piece ids: `<type>-g<grade>` for weapons and Orbs, `<type>-g<grade>-<accent>` for armor.
- The Forge picker groups the six rows above; weapons and Orbs skip the accent step.
- **Dishes lose their Cooking Token:** a dish is its refined items only (planet dishes 1–3 items, Duo dishes 2–3,
  Feasts 8, as today).
- **Art** (a ChatGPT packet): icons for the eight new armor types in ten grades and Training armor marks; weapon and
  Orb icons exist (H03).

## Stats and damage

**Uma Level keeps today's curve** (second pass): it is already linear and small. An average outfit as a Brawler:

| Stat | Lv 1 | Each level | Lv 50 |
|---|---|---|---|
| ATK / MATK | 22 / 18 | about +1.8 / +1.5 | 111 / 91 |
| DEF / MDEF | 22 / 18 | about +1.8 / +1.4 | 111 / 88 |
| HP | 299 | about +15 | 1,044 today; trimmed to about 950 (6 × Stamina becomes 5 ×) to stay under a thousand |
| MP | 40 | about +1.8 | 129 |

The outfit's base stats and growth rates move these, and the class lean as today (±15%).

**What changes is the bonuses' shape:** gear and Extra Stats stop being percentages (1.5% a point) and become small
flat adds, so every source reads as a number on the stat.
- **Extra Stats:** a moon +1 to its stat (+5 HP), a bridge +½ to each side, a Sun node +⅛ to all. A full map is about
  +12 to each stat.
- **Weapon Might:** +4 per grade on hits made with that weapon (+40 at grade 10).
- **Armor accent:** +⌈g/2⌉ to its stat (+5 at grade 10).

**Where a Lv 50, fully built Uma's damage comes from** (one skill hit):

| Source | Adds to offense | Share |
|---|---|---|
| Uma Level 50 | 111 | about 60% |
| Weapon Rank 10, grade-10 weapon (Might) | +40 | about 20% |
| Armor accents (four grade-10 ATK accents; the Orb's is its kind) | +20 | about 12% |
| Extra Stats (every ATK node) | +12 | about 7% |
| **Offense** | **183** | |

Then **Class Rank multiplies it all** through the skill depth it opens: a depth-1 skill hits at 1.6× offense, depth 5 at
4.6× (2.9 times as hard). A full hit is about 183 × 4.6 ≈ 840 before defense (about 630 against a Lv 50 foe's DEF); a
fresh Lv 1 Uma's is about 22 × 1.6 ≈ 35.

So, from biggest lever down: **Class Rank** (×2.9 on everything), **Uma Level** (about 60% of offense), **weapons**
(about 20%), **armor accents and Extra Stats** (the rest). Armor's main job is staying alive: Barrier and Regen.

**How far from today:** not far. Today a Lv 50 Uma's ATK is about 111 × 1.35 ≈ 150 with gear and Extra Stats; here it
is 183, in the same range, with the weapon's share made visible. Foes keep their curves; what gets re-fitted is the
gear and Extra Stats budget they're given (D59) and the boss Barrier/Regen pressure, by the simulation.

**Damage formula unchanged:** `max(offense × 0.2, offense − defense × 0.5) × power`, then weakness, statuses, Breaks.

**Foes are re-fitted, not rescaled.** Win rates stay where the balance simulation has them today (D72, D86): the foes'
gear budget moves from percentages to the same flat adds, checked with `SIM=1`.

## What goes away

- Training jobs for class ranks and Weapon, Armor and Accessory Levels; the class halls, Armory and Jeweler stop
  training. The Learning page is left for the Inheritance feature.
- Every token kind: Promotion, Mastery and Cooking (second pass). Fights stop dropping tokens; the Exchange stops
  trading them; the Warehouse's Tokens tab goes.
- Uma Level's skill-depth gates and side points (moved to Class Rank).
- The up-to-2× EXP for fighting above her level.
- Rings, Charms, Garb, Leather, Mail and Plate (replaced by the ten armor types), and weapon accents.

## Moving existing saves: a progress reset (second pass)

The owner asked for a clean start to test the new balance (few Umas leveled so far). The new save version:
- **Resets:** every stage win, the open fight and Spring uses; every Uma's Uma Level and EXP (Lv 1), Class Ranks,
  Weapon and Armor Ranks (1, EXP 0), learned side skills and loadouts (back to auto).
- **Keeps:** unlocked Umas, parties, each Uma's chosen class and weapon slots, Farm and Craft Levels, opened Extra
  Stats nodes, items, dishes, facilities and their jobs, Laurels, Time and Sweep Tickets, targets.
- **Converts:** Mail and Plate become Cuirasses, Garb and Leather Robes (same grade, same accent); a weapon keeps its
  grade and loses its accent; Rings and Charms refund their materials; Orbs carry over by kind. Tokens go (they have no
  use left); none are refunded.
- Shards already paid for Lv 10 milestones will be paid again on the way back up (about two Unlock Tickets for ten
  Umas); not worth guarding.
- The API backs up the old save before replacing it (D69), so it can be restored by hand.

## Later (not part of this)

- **Lv 50 content:** rotating daily or weekly dungeons only Lv 50 Umas can enter, to keep earning Marks, materials
  and Laurels after the campaign.
- **Inheritance** (the owner's design, in progress) takes over the Learning page.

## Building it

In order, each shippable on its own:
1. **Bars and EXP:** Class Rank 1–50, Weapon and Armor Ranks, EXP per win, overflow to Marks, Uma EXP at her own
   level, the progress reset. Skill trees read Class Rank. Training and every token kind go; dishes drop the token. Re-check D97's region
   climb under the new EXP rule (no bonus above her level) and retune the stage weights if it lands short.
2. **Gear and crafting:** ten armor types, five slots, Training armor, the new recipes and Forge picker, weapons and
   Orbs without accents, Barrier and Regen in the engine (a new engine version, so saved fights still replay), the
   old gear converted.
3. **Stats:** flat Extra Stats and gear, weapon Might, HP trimmed, then foes re-fitted with the simulation.
4. **Marks and books** at the Exchange.
5. **Bars on screen:** the fight result fills Uma, Class, five Weapon and five Armor bars; the profile shows them all.

Art (a ChatGPT packet): icons for the ten armor types in ten grades, and Training armor marks.

## Decided here (the owner can overturn any)

- One currency for weapons and armors (Gear Marks), one for classes (Class Marks); books 1,000 EXP for 1,000 Marks.
- Class Rank 1–50 on the Uma curve; Weapon and Armor Ranks 1–10 on the Uma curve's every-fifth-level steps.
- Weapon EXP split by use (carried 1, used 2); armor EXP equal.
- Armor gives Barrier (Physical) or Regen (Magical) and a small accent; weapons get Might instead of an accent.
- Armor choice is free for every class; Orbs are the accessory slot; Rings and Charms retire.
- Uma EXP comes from her own level, with no bonus for fighting above it.
