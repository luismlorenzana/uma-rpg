# Gear: weapons, armor and accessories

> **Superseded by [weapon-progression.md](weapon-progression.md) (2026-10-24); kept as history.**

> **Tier rework, cross-referenced draft, 2026-10-22. Nothing here is built.** One of six category docs
> ([the brief](README.md)); the owner reviews it second, after Classes. Every number is a draft for the balance
> simulation (`SIM=1`). Calls are **GE1**, **GE2** …, each with a recommendation ([§14](#14-decisions)). The
> cross-reference pass ([README §7](README.md#7-cross-reference-log)) replaced §8's draft amounts with
> [professions.md](professions.md)'s recipes (it owns amounts), named the vocabulary (gems, jewels, stones), stated what a
> class switch costs, and moved Tier 2's engine changes to Tier 2's own version (v17). No GE call changed.
>
> Previews: [the weapon tree](previews/gear-weapon-tree.html) · [the Gear tab at Tier 1, 2 and 3](previews/gear-loadout.html)
> · [crafting by tier](previews/gear-crafting.html).

## The owner's points

| The owner's point | Answered in |
|---|---|
| Weapons and armor sets got complicated: start simple, or add limits so increments come organically | [§2](#2-the-model-one-rule-for-every-piece) the model, [§3.4](#34-what-a-tier-1-player-handles) the count, [§4](#4-tier-2)–[§5](#5-tier-3) one step a tier, GE10 sets dropped |
| With 3 weapons a class for good, multi-type weapons later make sense | [§4.1](#41-weapons-the-first-fork) Dual (Tier 2), [§5.1](#51-weapons-the-second-fork) Prism and Tempered (Tier 3) |
| Class identity: Brawler physical only, Mage magical only, everything between | [§7](#7-kinds-and-class-identity) |
| Base weapons at G0; crafting makes improvement gems, consumed to raise weapon ranks | [§2](#2-the-model-one-rule-for-every-piece), [§3.1](#31-weapons), [§8](#8-crafting-what-is-made-and-what-it-takes) |
| A full weapon progression tree per tier, every branch; Tier 1 probably none | [§6](#6-the-full-weapon-tree), [the weapon tree preview](previews/gear-weapon-tree.html) |
| Do weapons carry element or physical properties, or do the skill trees? | [§7](#7-kinds-and-class-identity): weapons carry kinds; trees carry shape and effects |

## 1. Today

| Piece | Today | Where |
|---|---|---|
| **Weapons** | Five slots a class. Ten kinds: five Arms, five Tomes. A grade-0 Training weapon of each. Crafted pieces G1–G10 add **Might** to their own hits: 1, 4, 8, 12, 19, 26, 35, 45, 57, 68 | [classes](../../game/classes.md#weapons), [materials](../../game/materials.md#gear) |
| **Weapon Rank** | 1–10 per weapon, from wins: 5E over her five weapons, double for the ones she used. Grade g is worn at rank g, about Lv 5g − 4 | [loops](../../game/loops.md#ranks) |
| **Armor** | Five slots, each its physical or magical piece: ten kinds, G1–G10. ATK or M.ATK +⌈g ÷ 2⌉, the slot's stat +2g. Armor Rank per kind | [materials](../../game/materials.md#gear) |
| **Accessories** | Two typed slots (C10): **Damage**, an Orb (half a weapon's Might on one kind's hits); **Support**, one of five Talismans or five Amulets. Accessory Rank per kind (four) | [classes v2](../classes-v2.md) §6 |
| **Crafting** | The Forge: 40 types × 10 grades. Two refined items a piece, the pair rotating with the grade (D139). Craft Lv 5g − 4 | [loops](../../game/loops.md#craft-level) |
| **Wearing** | Binding from stock is for good. Grades are bound in order (D119). Rank EXP past rank 10 banks as Gear Marks, which buy Manuals | [loops](../../game/loops.md#extra-stats-and-gear) |
| **Proposed, not built** | Weapon arts: a three-node shape tree per weapon in Tier 2, learned with Lore Scrolls. Armor set bonuses: sustain steps, with Lore Seals. Awakening in Tier 3 (Q15) | [weapon arts](../weapon-arts.md), [tiers](../tiers.md) §6 |

Weapon arts and set bonuses are what made gear "really complicated": a second tree per weapon, set steps by a suit's
lowest grade, and two new item lines from a second profession, on top of two axes (grade and rank) that already ran
side by side. This doc replaces them.

## 2. The model: one rule for every piece

- **She owns her gear at G0.** Every Uma owns one weapon of each of the ten kinds, five armor slots and her accessory
  slots, all at grade 0 with no stats. Nothing is crafted as a piece, bound, kept in a locker or sold.
- **A crafted upgrade raises one grade.** A **Weapon Gem** raises a weapon, **Armor Fittings** an armor slot, an
  **Accessory Setting** an accessory slot: G0 → G1 → … → G10, one item a grade, used up.
- **Her Uma Level gates the grade:** grade g needs Lv 5g − 4 in her tier (G1 at Lv 1, G5 at Lv 21, G10 at Lv 46).
  That's today's pace for a weapon used every fight, and the Craft Level gate's numbers. Weapon, Armor and Accessory
  Ranks retire, with Gear Marks and the gear Manuals (GE2).
- **A weapon's power** is its grade's Might on its own hits, today's table, in every tier (D170 already prices Tier
  2's build with flat Might), plus its **form** from Tier 2 (§4.1).
- **One word, grade** (GE16). The owner's "weapon rank" is the weapon's grade: "base weapons at G0", raised by gems.

So today's two weapon axes merge into one: the crafted grade stays and becomes the weapon's own number, and the use
EXP that gated it is replaced by her Uma Level, which moves at the same pace.

| | Tier 1 | Tier 2 | Tier 3 |
|---|---|---|---|
| **Weapons** (3 a class, for good) | A line, G0–G10, one kind each | At G5 a fork: **Dual** (a second kind) or **Pure** (weak hits ×1.5) | At G5 a fork from her Tier 2 form: **Prism**, **Tempered** or **Keen** |
| **Armor** (5) | A line, G0–G10, in her class's half | The same; Spell Blade, Summoner, Paladin and Cleric may mix halves per piece | The same |
| **Accessories** | 1: **Support** | 2: + **Damage** (an Orb) | 3: + a second **Support** |
| **Crafting** | Weapon Gems, Armor Fittings, Accessory Settings, G1–G10 | + Dual Gem, Pure Gem | + Prism, Tempered and Keen Gems |

## 3. Tier 1

### 3.1 Weapons

- **Three slots a class, one per strike** ([classes.md](classes.md) CL1: Heavy, Flurry, Area, within the class's Arms
  count; CL4 the defaults). Each slot holds one of her ten weapons of the slot's strike. A weapon's grade is hers in every
  class that holds it, as Weapon Rank is today.
- **What a class switch costs:** only the weapons she hasn't raised. Armor and accessory grades sit on the slot (§3.2,
  §3.3), so they follow her. From the defaults a second class shares 0–2 of her three weapons: 10 to 30 Weapon Gems to
  bring it level with her first (a Brawler turning Paladin raises one Blizzard Tome; a Brawler turning Mage, three
  Tomes). A pick inside the new class's strikes can reuse a raised weapon. [Professions](professions.md)' demand counts
  one class's three; a second class's weapons are extra, as a second class's pieces are today.
- **G0 is today's Training weapon:** it opens its tree and adds no Might.
- **Upgrading** is on the weapon's sheet: "G4 → G5 · 1 Weapon Gem G5", once the Warehouse has the gem and she is
  Lv 21. One tap spends it. "Up to G7" climbs several grades at once and lists the gems first.
- **No choices** beyond which weapon sits in a slot. A Tier 1 weapon is one kind, its tree and its Might.

| Grade | G0 | G1 | G2 | G3 | G4 | G5 | G6 | G7 | G8 | G9 | G10 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Uma Level | — | 1 | 6 | 11 | 16 | 21 | 26 | 31 | 36 | 41 | 46 |
| Might | 0 | 1 | 4 | 8 | 12 | 19 | 26 | 35 | 45 | 57 | 68 |

### 3.2 Armor

- **Five slots:** head, body, legs, arms, feet. **The slot holds the grade.** The half (physical or magical) says which
  piece she shows and which offense it adds, so changing half never loses a grade.
- **Tier 1: the half is her class's.** Brawler, Spell Blade and Paladin wear physical; Mage, Summoner and Cleric
  magical ([classes.md](classes.md)'s starting armor). Switching class switches the half; the grades stay.
- **At grade g, today's numbers:** ATK (physical) or M.ATK (magical) +⌈g ÷ 2⌉, and the slot's stat +2g: head DEF, body
  HP (+5 HP a point), legs MP, arms M.DEF, feet Speed.
- **One Armor Fittings item of grade g** raises any slot from g − 1 to g.
- **No set bonuses** in any tier (GE10).

### 3.3 The accessory

- **One slot: Support.** It holds one of today's ten: five Talismans, five Amulets, with today's effects per grade
  ([combat](../../game/combat.md#damage)).
- **The slot holds the grade; the type swaps freely.** A Vampire Talisman at G6 becomes a Thorn Talisman at G6 for
  nothing.
- **One Accessory Setting of grade g** raises it.
- **No Orb in Tier 1** (GE11). Weapons carry Tier 1's damage; an Orb would add a second number on the same kind. A
  support gives each Uma a role instead (the Paladin's Thorn, the Mage's Siphon). The Orb arrives in Tier 2, with the
  forms, as the specialization tier's tool.

### 3.4 What a Tier 1 player handles

Per Uma, in Tier 1:

| | Today | Proposed |
|---|---|---|
| Gear slots in a class | 12: 5 weapons, 5 armor, 2 accessories | **9:** 3, 5, 1 |
| Gear rank bars | 24: 10 Weapon, 10 Armor and 4 Accessory Ranks | **0:** her Uma Level gates every grade |
| Gear currencies | Gear Marks, Weapon and Armor Manuals | **None** |
| Item types the crafting stations make | 400: 40 types × 10 grades | **30:** 3 lines × 10 grades |
| Items to max her loadout | 120 pieces, each bound in order, for good | **90 upgrades:** 30 gems, 50 fittings, 10 settings |
| Refined items they take | 240 | **365** ([professions.md](professions.md) §5.5; with jewels 485, against today's 472) |
| Choices a class asks | A weapon per slot (four classes), an armor half × 5, an Orb's kind (10), a support (10) | A weapon per slot ([classes.md](classes.md)), a support (10) |
| Rules to learn | Binding for good, in-order binding, rank gates, Training pieces, typed accessory slots, locker vs stock | **One:** an item raises a slot one grade, up to Lv 5g − 4 |

## 4. Tier 2

### 4.1 Weapons: the first fork

- **Promotion carries her weapons' forms and resets their grades** to G0 in the new world (§9).
- **At G5 the weapon evolves.** The G5 step takes a **fork gem** instead of a Weapon Gem, and the gem picks the form:

  | Form | What it adds | Takes |
  |---|---|---|
  | **Dual** | **A second kind**, picked when it evolves. Its hits carry both kinds for weaknesses and charged-move locks | 1 Dual Gem |
  | **Pure** | **A harder weakness:** its weak hits deal ×1.5 instead of ×1.3 | 1 Pure Gem |

- **A second kind is coverage, not a second channel.** The hit keeps the weapon's channel, offense and Might: a
  Greatsword + Fire hit is a physical hit that counts as Fire against a Fire-weak foe. A weak hit still removes one
  point and breaks one lock, whichever of its kinds matched. An Orb adds to a hit that carries its kind.
- **A Dual keeps its slot's strike** ([classes.md](classes.md) CL1): it stays in its first kind's slot, with that tree's
  shape. Its second kind may sit in any strike: a Greatsword + Ice is a Heavy weapon that also answers an Ice-weak
  (Area) foe in Tier 2 and 3, where foes are weak to kinds of their strike (CL10).
- **The extra kind counts only in a class that wields its channel** (§7): a Brawler's weapons take Arms kinds, a Mage's
  elements, the four between either. The sheet lists the kinds that count for her active class first.
- **Breaks stay the trees' job.** No form removes an extra shield point: Pure changes how hard a weak hit lands, not
  how many points it takes. Break +1 is a skill pick ([skill-trees.md](skill-trees.md)'s Tier 2 tip fork), so it has
  one home and one cap.
- **G6–G10 continue in its form,** with Tier 1's Might table.
- **Re-forging:** another fork gem of the tier changes the form, or a Dual's kind. The grade stays (GE13).
- **Why G5:** Tier 2 Lv 21, the middle of the tier. She plays half the tier with the form, and the Tier 2 Rift at Lv 50
  tests it. **Why these two:** breadth against depth on weaknesses, the weapon's own lever. Dual reaches more foes'
  weaknesses (and chips their shields); Pure hits harder on the ones it already reaches.

### 4.2 Armor

- **A line again,** G0–G10 in the new world, with Tier 1's numbers.
- **New: the four classes between may mix halves** per piece, so a Spell Blade can wear four physical pieces and a
  magical Robe for her Tome half. Brawler stays physical and Mage magical (§7).
- Nothing else. Armor's job is defense and a little offense; depth comes from weapons, trees and Extra Stats.

### 4.3 Accessories: the Damage slot

- **A second slot, Damage,** holds one Orb (ten kinds): half a weapon's Might at its grade on hits of its kind, today's
  values (C4).
- **Its kind swaps freely,** so an Uma specializes per front. Its grade is the slot's, raised by Settings.
- **The Support slot** stays as in Tier 1.

## 5. Tier 3

### 5.1 Weapons: the second fork

- **Forms carry again; grades reset.** At Tier 3 G5, each weapon takes the next step from the form it arrived with:

  | Arrives as | Fork gem | Becomes | What it is |
  |---|---|---|---|
  | Dual | Prism Gem | **Prism** | A third kind: three kinds, weak hits ×1.3 |
  | Dual | Tempered Gem | **Tempered** | Its two kinds, and weak hits ×1.5 |
  | Pure | Tempered Gem | **Tempered** | A second kind, picked now, and its ×1.5 |
  | Pure | Keen Gem | **Keen** | One kind, its weak hits ×1.7 |
  | Base (never evolved) | Dual or Pure Gem | **Dual** or **Pure** | The Tier 2 step, a tier late |

- **One step a tier.** A weapon she never raised to G5 in Tier 2 takes the first fork in Tier 3.
- **The three leaves sit on one line,** breadth to depth: Prism (three kinds at ×1.3), Tempered (two at ×1.5), Keen
  (one at ×1.7). Tempered is reachable from either side.
- **Same rules as Tier 2:** extra kinds count only in classes that wield their channel; no form touches Breaks; the
  grade stays when re-forged.

### 5.2 Armor

Unchanged from Tier 2: a line, G0–G10, mixed halves for the four classes between.

### 5.3 Accessories: a second Support

- **A third slot,** a second Support, holding a different Talisman or Amulet from the first (C5 planned a third slot for
  Tier 3). A tank wears Iron and Thorn; a caster Spring and Veil.
- Grades and free type swaps as before.

## 6. The full weapon tree

Every weapon kind follows the same tree; the [preview](previews/gear-weapon-tree.html) draws it per tier with each
branch and an example per class.

```text
Tier 1   Base ── G1 ── G2 ── … ── G10                         one kind, Might
                                                               (form carries, grades reset)
Tier 2   Base ── G1 … G4 ── G5 fork ─┬─ Dual  ── G6 … G10      + a second kind
                                     └─ Pure  ── G6 … G10      weak hits ×1.5
                                                               (form carries, grades reset)
Tier 3   Dual ── G1 … G4 ── G5 fork ─┬─ Prism    ── … G10      three kinds
                                     └─ Tempered ── … G10      two kinds, weak ×1.5
         Pure ── G1 … G4 ── G5 fork ─┬─ Tempered ── … G10      two kinds, weak ×1.5
                                     └─ Keen     ── … G10      one kind, weak ×1.7
         Base ── G1 … G4 ── G5 fork ─┬─ Dual / Pure            the Tier 2 step, late
```

| Form | Tier | Kinds | A weak hit | Example (a Spell Blade) |
|---|---|---|---|---|
| Base | 1+ | 1 | ×1.3 | Greatsword |
| Dual | 2+ | 2 | ×1.3 | Greatsword + Ice |
| Pure | 2+ | 1 | ×1.5 | Pure Lance |
| Prism | 3 | 3 | ×1.3 | Fire Tome + Katana + Axe |
| Tempered | 3 | 2 | ×1.5 | Tempered Greatsword + Ice |
| Keen | 3 | 1 | ×1.7 | Keen Lance |

**Limits that keep it organic:** three weapons for good; one fork a tier, at G5; each form strictly adds to its
parent; a weapon's kinds are all different; a weak hit at most ×1.7; no form touches Breaks.

## 7. Kinds and class identity

**Weapons carry kinds; skill trees carry shape and effects** (GE4).
- A weapon's kind opens its tree, and every hit of that tree carries the weapon's kinds. That's today's model, and
  classes v2 made weapons the only source of weakness coverage (an Orb no longer adds its kind).
- Skill trees decide targets, hits, power, statuses and support. **No tree node adds or changes a kind.** A Dual's
  extra kind opens no second tree.
- Multi-type weapons need the kind to live on the weapon. If trees carried kinds, a weapon would be a power number and
  the owner's Greatsword + Fire would be a skill, not a weapon.

**The channel rule** keeps "Brawler physical only, Mage magical only, everything between":

| Class | Weapons it slots | An extra kind (Dual, Prism, Tempered) that counts | Armor half |
|---|---|---|---|
| Brawler | Arms only | Arms kinds only | Physical, always |
| Mage | Tomes only | Elements only | Magical, always |
| Spell Blade, Paladin | Arms-led | Any of the ten | Physical in Tier 1; per piece from Tier 2 |
| Summoner, Cleric | Tome-led | Any of the ten | Magical in Tier 1; per piece from Tier 2 |

- A weapon is shared by every class that slots it, so the rule reads at the class: **an extra kind counts only in a
  class that wields its channel.** A Greatsword + Fire held by a Brawler hits as a plain Greatsword; its sheet says
  "Fire: not as a Brawler".
- **No split channels** (GE7). A hybrid's Greatsword + Fire stays a physical hit. Half-physical, half-magical hits would
  count her ATK and M.ATK twice and undo the hybrids' 70/30 tuning (H63).

## 8. Crafting: what is made and what it takes

This is the interface for [professions.md](professions.md), which owns materials, families, buildings, recipes and
amounts. Gear owns the products: what each is, what it raises and how many one Uma needs.

| Product | Made by | Grades | Raises | Per Uma per tier |
|---|---|---|---|---|
| **Weapon Gem** | Weapon Crafting (the Forge) | G1–G10 (no G5 from Tier 2) | One weapon one grade | 30 (Tier 1); 27 in Tiers 2–3 |
| **Dual Gem**, **Pure Gem** | Weapon Crafting | G5, from Tier 2 | A weapon's G5 step, and its form | 3 in Tier 2 (one a weapon) |
| **Prism Gem**, **Tempered Gem**, **Keen Gem** | Weapon Crafting | G5, Tier 3 | The same, Tier 3's forms (Dual and Pure Gems too, for a weapon arriving as Base) | 3 in Tier 3 |
| **Armor Fittings** | Armor Crafting (the Armorer) | G1–G10 | One armor slot one grade, either half | 50 |
| **Accessory Setting** | Accessory Crafting (the Charm Shop) | G1–G10 | One accessory slot one grade, any type | 10 · 20 · 30 (one a slot a grade) |

**Recipes ([professions.md](professions.md) §5.3, PR8):** one fixed set an item; grades 1–5 take each line's low type,
6–10 its high type.

| Product | Refined items a piece | Grades 1–5 | Grades 6–10 |
|---|---|---|---|
| Weapon Gem | 4 | 2 Copper Ingot, 2 Pine Plank | 2 Iron Ingot, 2 Oak Plank |
| Fork gem | 4 + 5 | The Weapon Gem G5 recipe, plus one refined item of each of its tier's five pairs | — |
| Armor Fittings | 2 low, 3 high | 1 Linen, 1 Shell Carving | 1 Iron Ingot, 1 Oak Plank, 1 Cut Garnet |
| Accessory Setting | 12 · 6 · 4 (by the tier's slot count) | 6 Linen, 6 Shell Carving (Tier 1) | 6 Cotton Cloth, 6 Ammonite Carving (Tier 1) |

- **One Tier 1 Uma:** 120 + 125 + 120 = **365 refined items** for gear (Tiers 2 and 3: 380, of which 15 are the tier's
  pairs), against **240** today. With Extra Stats' jewels (120) she is **485**, against today's **472**: gear grows,
  jewels shrink, the Uma's total holds. *Changed in cross-reference: this doc drafted rotating pairs and triples at about
  220 for gear; professions' fixed sets keep each making trade at a fifth of the work.*
- **Gates:** the crafter's Craft Level opens grade g (Lv 5g − 4, today's rule); the wearer's Uma Level opens its use
  (Lv 5g − 4).
- **Every tier makes its own,** from its own world's materials. The item ids may be shared, since each world has its
  own Warehouse.
- **Names (GE12):** "gem" is the owner's word for the weapon line, and **only** the weapon line uses it: Weapon Gems and
  the five fork gems. The hunt gathers **stones** (Quartz, Garnet …), Extra Stats' items are **jewels**, today's Star
  Gems retire. So "Weapon Gem" is never short for anything else ([README §2](README.md#2-the-shared-frame-every-doc-starts-from)'s
  glossary).

## 9. Promotion

- **Forms carry; grades reset.** She arrives in the new tier with her ten weapons in their forms at G0, her armor and
  accessory slots at G0, and the new tier's slot counts (accessories 2, then 3).
- **Re-picking is free at promotion:** every grade starts again, so a new tier is the cheapest moment to change which
  three kinds she slots (her Tier 2 signature tip, [variance.md](variance.md), may ask for one).
- **What she used up stays in the old world:** each upgrade item she consumed goes back to the old world's Warehouse,
  as her bound pieces go back to its stock today (D15). The Umas still in that tier can use them.
- **A Tier 3 weapon's next fork depends on where it ended Tier 2** (§5.1).

## 10. Provides

| To | What |
|---|---|
| **Classes** | Slot counts: 3 weapons in every tier; 5 armor; accessories 1 · 2 · 3. One gate for every grade: Lv 5g − 4. Weapons owned per kind and shared by every class; a class switch costs only the kinds she hasn't raised (§3.1). The channel rule (§7). A Dual keeps its slot's strike. Armor halves: by class in Tier 1, mixed per piece for the four between from Tier 2. The standard preset sets her class's three weapons, armor half and support, and climbs grades with stock items after asking |
| **Skill trees** | Weapons carry kinds; a weapon's kind opens its tree; an extra kind opens none. A weapon's weak multiplier (×1.3, ×1.5, ×1.7 by form) is gear's; Break +1 and every other shield chip stay the trees'. Shape stays in the trees: if the trees want weapon arts' shape effects (one more hit, a wider share), they can take them as nodes |
| **Professions** | §8: the five products, grades, counts per Uma per tier, the gates. Fork gems take one of each of the tier's pairs in Tiers 2 and 3. One Uma's gear demand: 90 items in Tier 1, 100 in Tier 2, 110 in Tier 3 (365, 380, 380 refined on professions' recipes) |
| **Extra Stats** | No gear item adds a stat node or a kind outside weapons. The Orb returns in Tier 2: if Extra Stats adds a kind specialty there, Orb and specialty together stay within a G10 weapon's Might (X7's bound) |
| **Variance** | Gear has no template-only pieces or hooks; templates act through trees and Extra Stats |
| **The engine** | Tier 1 needs no new damage rule: three weapons and one accessory are loadout facts, which engine v16's input checks accept (with [classes.md](classes.md)' lock rule; [README §9](README.md#9-engine-save-and-refund)). Tier 2's forms need **Tier 2's engine version (v17)**: a hit's extra kinds for weaknesses and locks (the v1 Orb path, scoped to the weapon), and a weak multiplier per weapon in place of the one constant (`BATTLE_WEAK`). *Changed in cross-reference: forms were "v16"; v16 is Tier 1's* |
| **Screens** | The Gear tab: three weapons, five armor slots, 1–3 accessories, each with its grade and an Upgrade pill ([preview](previews/gear-loadout.html)). The targets planner lists every grade above her current one on her class's three weapons, five slots and accessory slots; an unchosen fork plans nothing, as an empty accessory slot does today |

## 11. Assumes

| From | What this doc assumes |
|---|---|
| **The brief, §2** | Add to the class template: **accessories 1 · 2 · 3 by tier**, and **no gear ranks: Uma Level gates every grade**. Weapons stay 3 and kinds stay as they are, as §2 says |
| **Classes** | Weapon splits drawn here: Brawler 3 Arms, Mage 3 Tomes, Spell Blade and Paladin 2 Arms + 1 Tome, Summoner and Cleric 2 Tomes + 1 Arms; classes.md picks the kinds and defaults. Today's starting armor halves. Tier 1's foe weaknesses are reworked so three-weapon parties cover them (coverage comes from weapons only) |
| **Skill trees** | Trees stay per class × weapon kind. No node adds a kind. Break +1 lives only in the trees (the Tier 2 tip fork), under its one cap. Weapon Rank retires: "the grade she can wear" is her Uma Level's gate (GE2) |
| **Professions** | Weapon, Armor and Accessory Crafting make §8's lines; Material Processing makes the refined items; Tiers 2 and 3 add pairs the fork gems take. *Reconciled:* professions' recipes set gear at 365 refined per Tier 1 Uma (today's gear 240), so the Uma's total with jewels, 485, stays near today's 472 |
| **Extra Stats** | Its items are not called "gems" ("jewels" fits Jewel Crafting), and the hunt's items are stones, so the Warehouse never shows two kinds of gem. *Reconciled* (README §2's glossary) |
| **Pacing and balance** | Flat Might in every tier (D170, Z3). The balance simulation re-prices Tier 1's foe budget for an on-curve build without an Orb, and Tier 2's term (Z4) for forms and the Orb in place of weapon arts and sets |
| **The Rift** | Echoes pay Class EXP at 2× and no gear EXP (R6 loses its gear half). Its fronts are re-measured with three weapons and Tier 1's one accessory |
| **Art** | Three ten-grade icon rows (gems, fittings, settings) and five fork gems, drawn in uma-platform. Slots keep today's gear art: a Greatsword at G7 shows the Greatsword's grade-7 icon |

## 12. Save impact

What the rework deletes or converts, for the later refund. The owner leans to refunding every raw material and
recrafting by hand (GE15).

| Save data | Today | After | Refund |
|---|---|---|---|
| `world.gear` (crafted pieces in stock) | Ids `<type>-g<grade>` | Deleted | Each piece's recipe: 2 refined items, returned as their 2 raw items in today's ids, then converted by [professions.md](professions.md)' table (§10) |
| `uma.gear.locker` and `equipped` (bound pieces) | Her pieces | Deleted; every weapon, armor and accessory slot at G0 | The same, per piece |
| Forge jobs (`craft` rows, running or queued) | Gear outputs | Recalled: unfinished inputs back, as Recall does; finished outputs refunded as above | — |
| `uma.ranks.weapons`, `armors`, `accessories` | 24 tracks | Deleted | None: the new gate is her Uma Level |
| `wallet.gearMarks` | Banked gear EXP | Converted to Class Marks, one for one | — |
| `uma.gear.kinds` (armor kind per slot) | Ten kinds | Becomes each class's armor halves (used from Tier 2) | — |
| Exchange Manuals for weapons and armor | Spend Gear Marks | Removed; Class Manuals stay | — |
| Accessories | Orb and support | Deleted with the rest; Tier 1's one slot starts at G0 | As pieces |
| Targets | Umas | Kept; the planner re-derives its lines | — |
| Tier 2 or 3 worlds, if any | The same data | The same treatment | The same |
| Stored fights | Frozen inputs | Unchanged: they replay as they were | — |

**Volume:** a fully geared Lv 50 Uma holds 120 pieces, so 240 raw items come back against the 365 her new gear takes.
With her Star Gems' refund ([extra-stats.md](extra-stats.md) ES14, about 232 raw items for a full map) she gets back
about 472, against the 485 (493 with her own moon) the reworked Tier 1 asks: the refund rebuilds her, by hand.

## 13. Pacing

The rate of progression holds (the brief, §2):

| | Today | After | How it holds |
|---|---|---|---|
| **Time to level** | 120 + 16 × level EXP, about three fights a level | Unchanged | Nothing in gear touches Uma EXP |
| **EXP per win** | Uma E, Class 2E, weapons 5E, armor E a kind, accessories E a kind | Uma E, Class 2E | Gear EXP fed only gear ranks and Gear Marks, both gone |
| **When a grade is worn** | Rank g, at about Lv 5g − 4 for a weapon used every fight | Lv 5g − 4 | Same gate, by level |
| **Crafting to gear one Uma on curve** | 120 pieces, 240 refined items (472 with Star Gems) | 90 items, 365 refined (485 with jewels) | Professions sets the amounts (§8); the Uma's total holds within 3% |
| **Weapon and armor power on curve** | Might and armor by grade | The same tables | — |
| **Accessories on curve** | Orb + support | Tier 1 support; Tier 2 + Orb; Tier 3 + support | Tier 1's foe budget loses the Orb's term in the simulation: a −16% hit on her Orb's kind at Lv 50, −4% at Lv 1 ([combat](../../game/combat.md#where-damage-comes-from)) |
| **A newly slotted weapon** | Needs its rank: fights, or Manuals | Any grade her level allows, if the stock has the gems | Class switching gets cheaper; the Rift's fronts ask for it |
| **A fresh Uma joining** | Ranks from 1, or Manuals | Her Uma Level, which catches up fast (a stage pays a share of her own level) | No Manuals needed |
| **Tier 2's forms** | Weapon arts (+6–10% of party damage) and sets, priced by Z4's draft term | Forms and the Orb | The simulation targets forms at the same worth, so that term holds |

## 14. Decisions

| Call | Recommendation | Alternatives | Why |
|---|---|---|---|
| **GE1** One model for every piece | Every Uma owns her gear at G0; a crafted upgrade item raises one slot one grade | Gems for weapons only, crafted pieces for armor and accessories | One rule. No binding, locker, piece stock or in-order binding; class switching keeps every grade |
| **GE2** The gate | Grade g needs her Uma Level 5g − 4 in her tier. Weapon, Armor and Accessory Ranks retire, with Gear Marks and gear Manuals | Keep Weapon Rank EXP and need EXP and a gem for each rank; gems alone, no gate | Same pace as today's ranks for an Uma who fights, 24 fewer bars. Without a gate, a mature stock puts G10 on a Lv 1 Uma |
| **GE3** A weapon's power | Might by grade, today's table, in every tier, plus its form from Tier 2 | Might × tier | D170 prices Tier 2's build with flat Might already |
| **GE4** Where kinds live | Weapons carry kinds; trees carry shape and effects; no node adds a kind | Kindless weapons, kinds in trees | Classes v2's coverage comes from weapons, and multi-type weapons need it there |
| **GE5** Tier 1 weapons | A straight line G0–G10, one kind, no choice | Weapon arts' core in Tier 1 | The owner's: Tier 1 has no branches |
| **GE6** Tier 2's fork | At G5: Dual (a second kind) or Pure (its weak hits ×1.5 instead of ×1.3) | Pure as Break +1 (weapon arts' B side), which the trees' Tier 2 tip already gives; weapon arts' three-node tree (E1); the fork at G10 | One choice a weapon; breadth against depth on weaknesses, the weapon's own lever; Breaks keep one home; G5 leaves half the tier to use it |
| **GE7** The channel rule | An extra kind counts only in a class that wields its channel. It is coverage: the hit keeps the weapon's channel and Might | Split-channel hits; extra kinds of the weapon's own channel only | Brawler physical, Mage magical, the four between either; split channels break the hybrids' 70/30 |
| **GE8** Tier 3's fork | At G5, from the Tier 2 form: Dual → Prism (three kinds) or Tempered (two kinds, ×1.5); Pure → Tempered or Keen (one kind, ×1.7); a base weapon takes Dual or Pure. Forms carry, grades reset | Awakening at G10; a second independent fork | One step a tier, three distinct leaves on one breadth–depth line |
| **GE9** Armor | Five slots, a line G0–G10 in every tier. The slot holds the grade. Tier 1 in her class's half; from Tier 2 the four between mix per piece; Brawler always physical, Mage always magical | Today's ten kinds, per-kind pieces and ranks | Simplest; switching class or half never loses a grade |
| **GE10** Armor sets | Dropped | Weapon arts' E8 and E9 | The rework's trigger; sustain is the Support slot's job |
| **GE11** Accessories | Tier 1: one Support slot. Tier 2: + Damage (an Orb). Tier 3: + a second Support. The slot holds the grade; type and kind swap freely | Tier 1's one is the Orb; one free slot for either | Weapons carry Tier 1's damage; a support gives a role; the Orb joins Tier 2's specialization |
| **GE12** What crafting makes | Weapon Gems, Armor Fittings, Accessory Settings, G1–G10 a tier, one for any weapon, slot or type; fork gems at G5: Dual and Pure (Tier 2), Prism, Tempered and Keen (Tier 3) | Items per half or per kind | 30 recipes a tier instead of 400 |
| **GE13** Changing a form | Another fork gem of the tier; the grade stays | Locked for the tier; free | A wrong pick costs one gem, not a tier |
| **GE14** Promotion | Forms carry, grades reset; items she consumed return to the old world's Warehouse | Nothing returns | D15: what she used stays in the old world, as her pieces do today |
| **GE15** The save | Delete all crafted gear and gear ranks; refund each piece's raw materials; recall Forge jobs; Gear Marks become Class Marks one for one | Convert her best grade on each track to the new grade, no refund | The owner's lean: every raw item back, recrafted by hand |
| **GE16** Names | "Grade", G0–G10, for every piece; "Weapon Rank" retires | Keep "rank" for weapons | One word on every slot; the owner's "base weapons at G0" |
