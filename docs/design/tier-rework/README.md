# The Tier rework: the brief

> **Standalone docs authored and cross-checked, 2026-10-24. Nothing here is built.** The owner paused feature work after
> classes v2 (H53–H63) to rework how every system grows across the tiers: Tier 1 is too complex, and the later tiers were
> getting far more complex still. The first round (one doc per category, 2026-10-22) was cross-referenced (§7, XR);
> the owner then asked for **four standalone docs, detailed, one at a time** (§5). They are written and
> **cross-checked into one design** (§7, XC1–XC16), to be reviewed **one doc at a time** with the owner (§10), decided
> with no open questions, and shipped as implementation packets (§9). **Class Progression is approved (D192); Weapon
> Progression was revised after the owner's review (2026-10-24)**, its follow-ups carried into the other three docs and
> this brief (§7.1, XC17–XC22).

## 1. What the owner asked for

**Overall:**
- Simplify Tier 1; let each later tier add depth organically. **The rate of progression is fine as it is**: keep it.
- For every category, show it: small **HTML previews** of the Uma's detail page at every tier, and how every category
  grows across all tiers.
- Fan out, cross-reference every definition together, then review one category at a time. No open-ended questions.
- Things already crafted that the rework deletes get refunded later (probably every raw material back, the owner
  recrafting by hand). That's for implementation; each doc only lists what would be deleted or converted.

**By category** (the owner's points; the docs answer each one):

| Category | The owner's points |
|---|---|
| **Classes** | Simplify Tier 1's baseline class facts. Maybe every class starts with **3 weapon slots**, with proposed defaults that keep every party balanced for every battle. Maybe rework Tier 1 foes' weaknesses. Show every class's trees and the class composition. Show the **class template sheet** per tier: how many weapons, armors, accessories. What other dimensions class selection affects |
| **Weapons (gear)** | The trigger for the rework: weapons and armor sets were getting complicated. If weapons stay **3 per class permanently**, multi-type weapons later make sense. Keep class identity: Brawler physical only, Mage magical only, everything between. Maybe drop crafting weapons: each class has its **base weapons at G0**, and crafting makes **weapon improvement gems** consumed to raise weapon ranks. Show a full weapon progression tree per tier with every branch (Tier 1 probably none). Decide whether weapons carry element or physical properties, or whether that's the skill trees' job |
| **Skill trees** | Incremental by tier. Today the profile doesn't look like a tree: no real options. Show the trees at different tiers. The owner dislikes today's side nodes, which cost skill points while unlocking the next depth's skill costs nothing |
| **Extra Stats** | Heavy Tier 1 simplification: maybe **one planet that raises every stat**, and moons with a few stat nodes each; more as the tiers progress. Preview it |
| **Professions** | The tricky one: the farm was removed once for being too complex; now add a little complexity and simplify too. **Five gathering professions** tied to the five fight types at Tier 1: Farming, Fishing, Mining, Wood Chopping, Fighting for gems. **Five crafting professions**, one per class: Material Processing, Extra Stat Jewel Crafting, Weapon Crafting, Armor Crafting, Accessory Crafting. Later tiers: maybe a secondary profession (another profession's base items, while the main one reaches its higher tiers). Each profession has **4 small buildings** on today's Wilds map, more buildings each tier; **Tier 1 starts with 2 material types per profession**. A real rebalance: if an Uma needs 3 weapons, 5 armors and 1 accessory, everything they need adds up. A visual page with the buildings and amounts |
| **Uma Variance** | Maybe in this rework. Each Uma made a little unique through **Uma Templates** (not class templates): authored bonuses, assigned from her original racing profile, with many templates so even two front-running long-distance Umas differ. E.g. a front runner might get Brawler bonuses or physical-only Extra Stat nodes: she can still be a Mage, without the benefit. Template-only nodes may appear in skill trees and Extra Stats |

## 2. The shared frame every doc starts from

**Cross-checked, 2026-10-24** (§7, XC rows): the four standalone docs agree with these numbers and words. Each line
names the doc and call that own it; the first round's drafts and the cross-reference (XR) are in git history and §7.

### 2.1 The frame

- **Tiers:** 1–3, 50 levels each; one Uma lives in one tier (D159, tiers.md §3); promotion through the Rift stays.
- **Classes** ([class-progression.md](class-progression.md) CP1): the six of classes v2 (D160, live since H61):
  Brawler, Mage, Spell Blade, Summoner, Paladin, Cleric, in every tier. Their identities stay: Brawler all physical,
  Mage all magical, the hybrids 70/30 each way as a mirror, one healer a party.
- **Five fight types:** **physical** (Brawler), **magical** (Mage), **physical hybrid** (Spell Blade), **magical
  hybrid** (Summoner), **healer** (Paladin or Cleric).
- **The calling** (variance U4; CP29–CP30): each Uma's fight type by one rule from master data (eight rows, by stable
  id). It sets her **starting class**, her **trade** (PP2) and where her template works. A **one-time pick** on the Uma
  sheet lets a Pace Uma choose Spell Blade or Mage and a Late Uma Paladin or Cleric. Today's 270 outfits: physical
  22.6%, physical hybrid 20.7%, magical 17.0%, magical hybrid 17.0%, healer 22.6%.
- **Weapon kinds:** five Arms (Greatsword, Axe, Lance, Bow, Katana) and five Tomes (Fire, Blizzard, Thunder, Light,
  Dark Tome, dealing Fire, Ice, Lightning, Light, Dark). **Weapons carry kinds; trees carry shape** (WP1, CP17).
- **No strikes** (owner, 2026-10-23; CP2, CP5): the ten kinds are the damage and weakness types; each weapon's own shape
  (a Bow's many hits, an Axe's reach) is the small variety. **Three weapon slots in every tier, typed by channel:**
  Arms slots Brawler 3, Spell Blade and Paladin 2, Summoner and Cleric 1, Mage 0. **The owner's defaults** (CP3):
  Brawler Greatsword, Axe, Lance; Mage Fire, Blizzard, Thunder; Spell Blade Katana, Lance, Thunder; Summoner Dark,
  Light, Bow; Paladin Greatsword, Axe, Light; Cleric Light, Blizzard, Bow. The campaign is balanced parties; the Rift's
  paths are specialized, with guided builds (CP4, CP7).
- **Foe weaknesses** (CP5, CP6): a Tier 1 foe is weak to **her twins**, the element that beats hers on the ring and its
  twin Arm; from Tier 2 regulars narrow to one kind of it, from Tier 3 sub-bosses too; **bosses keep their twins**.
  Shields grow with the answers a foe's list gets (CP8).
- **Weapon groups and the class branch** (CP26, CP38–CP41): the **Ring** group (Greatsword, Axe, Lance · Fire, Ice,
  Lightning) and the **Light/Dark** group (Bow, Katana · Light, Dark), one split for both channels through the twins.
  From Tier 2 each class takes **one of two class branches**: a **focus** (+15% on the hits of its group's kinds), her
  **default or reverse weapon set**, and three class skills; Tier 3 adds the branch's capstone and the class's
  **mastery** (CP27). *The owner's names for the groups (Heavy, Lite · Elemental, Arcane) are in the glossary (§2.4) and
  land at implementation.*
- **Weapons** ([weapon-progression.md](weapon-progression.md) WP5–WP12, WP32): she owns all ten kinds at **G0**; Tier 1
  is a straight line (weak ×1.3); at Tier 2's G5 each weapon takes a **weapon branch**, **Pure** (weak ×1.5) or **Dual**
  (its **fixed partner**: of its own channel and always of the other weapon group, coverage only); Tier 3 **forks both
  lines**, Pure → **Keen** (×1.7) or **Tempered** (+ its partner, both ×1.5), Dual → Tempered or **Evolved** (+ its Tier 3
  partner, both ×1.5). **The partner table** (WP32): the owner's Greatsword, Axe → Bow; Lance → Katana; Fire → Dark; Ice,
  Lightning → Light, Tier 3 the other sub weapon; authored Bow → Greatsword, Katana → Axe, Light → Fire, Dark → Ice, Tier 3
  Bow, Katana → Lance and Light, Dark → Lightning. **Caps:** two kinds a weapon at most; two-kind weapons in her slots
  **0 · 1 · 2**, the Brawler and the Mage **1** for good. **Coverage** stays at or under Tier 1's: the default party
  answers a regular **2.47 · 2.0 · 2.30** times (WP12). Prism dropped (owner, 2026-10-24). Might at G10 68 · 122 · 177.
- **Armor carries all defense** (WP14–WP16): five slots, the slot holds the grade, the half sets only the piece shown
  and its offense; per grade DEF and M.DEF +4, HP +15, MP +3, evasion 1.2%, × tier. Her class's half in Tier 1, per
  piece for the four between from Tier 2. No sets.
- **Accessories deal damage only** (WP17–WP25, WP34): the ten defensive and MP supports retire; **untyped slots
  1 · 2 · 3**, one of each family; **all four families in every tier**: **Pendants** (flat offense spread over her kinds),
  **Orbs** (flat offense on one kind), **Bells** (her weapon of its kind strikes once more after her Attack) and
  **Insignias** (a percentage on sub-bosses and bosses, or by timing). Tier 1's one slot holds one of four **base forms**;
  from a slot's G5 in Tier 2 each family opens **two branches**, a **Great** one (the same reach, deeper) and the
  **Channel Pendant**, **Twin Orb**, **Toll Bell** or **Onslaught Insignia**; Tier 3's G5 takes each **a step deeper**. A
  form is a setting of the slot, nothing crafted. Flat offense on one kind stops at **the kind cap**, +68 × tier.
- **The damage stack** (WP31, new in the cross-check): one order on every hit, her ATK or M.ATK (with her signature's
  bonus while she wears it) and flat offense on its own kind (capped), then the weak multiplier, then each percentage
  (focus, affinity, Insignia) as its own factor.
- **Grades, one rule for every piece** (WP2, WP3): a crafted item raises one a grade, up to **G10**. Grade g is **made**
  at Craft Lv 5g − 4 and **worn** at Uma Lv 5g − 4. No gear ranks. A class switch costs only the weapons she hasn't
  raised.
- **Class trees** (CP13–CP24): one tree per weapon slot, three a class, under a class root (from Tier 2 her class tree).
  **No skill points at any tier.** Class Rank opens depths at 1, 10, 20, 30, 40 (and 50 in Tier 3); a fork's branches
  are free and exclusive, branch A the default. **Skill Ranks** (CP32): every skill ranks 1–5 by itself, one rank every
  2 Class Ranks, balance-neutral.
- **Extra Stats** ([extra-stats-progression.md](extra-stats-progression.md) EP1–EP14): **the Planet** (+21 to all six
  core stats) and four moons, Strength, Sorcery, **Vigor (HP and MP)** and Guard, five nodes each: 25 nodes, **every
  open node counts**; a node opens with its jewel, in order, at Uma Lv 5g − 4. Tier 2 adds **the Halo** (flat offense on
  one kind) and **Valor** (Limit start), Tier 3 the Halo's second kind and **Swiftness** (evasion). The core is rebuilt
  the same each tier, × tier.
- **Professions** ([profession-progression.md](profession-progression.md) PP1–PP23): ten professions in three kinds:
  five **gathering** (Mining, Wood Chopping, Farming, Fishing, **Hunting**), one **processing** (Material Processing)
  and four **making** (Weapon, Armor, Accessory and Jewel Crafting). An Uma works one **trade**, her calling's gathering
  and crafting pair, on one Craft Level; from Tier 2 a **secondary** (any other profession's base work). Each
  profession is **one existing uma-art building** with **four work slots**: ten places and 40 slots in every tier, no
  upgrades, no new art. Each gathering profession adds a material **pair** a tier (2 · 4 · 6 types); **the ladder**: a
  grade decides its material, each later tier moving the top grade of each band onto its own pair.
- **Uma Templates** (variance U2–U4; CP36; EP14): ours, assigned **by rule** from master data, never a hand-written list
  of real Umas. Each gives a **Flourish** (her root node), a **signature tip** from Tier 2 (on her affinity kind's tree),
  **her moon** (two nodes) and an **affinity**: +6% damage with one twin set's two kinds, every tier, any class. The Uma
  Templates pass fills them later. **Proposed** (the owner's weapon review, WP33): a **signature accessory**, one family
  her template names, ATK and M.ATK +0.2 a level × tier while she wears it (about +5% at Lv 50), **in the affinity's
  place**; noted at CP36, decided in the Uma Templates pass.
- **Values (SB1, §2.5):** every flat build value is its Tier 1 value × 1, × 1.8, × 2.6; shares and percentages stay.
  **Amounts don't scale** (PP11): one Uma maxed is **485 · 503 · 521** refined items, every tier within a tenth.
- **Pacing:** the time to level, the EXP and rewards per fight, and the time to gear an Uma on curve keep today's order
  ([pacing.md](../pacing.md)): 822 · 852 · 883 hours an Uma against today's 776; a Tier 1 run of twenty in 15.7 days of
  volume, Tier 2's in 28.4.
- **Versions** (§9): **engine v16 and save v27 are the Tier 1 rework**, every category, live together (save v26 is
  taken on main by D190). **Tier 2's toolbox is engine v17 and save v28**; Tier 3's is designed with Tier 3.

### 2.2 Every tier at a glance

The standalone docs' pages draw each category ([§4](#4-the-previews)); the first round's overview pages
([progression](previews/progression.html), [her page by tier](previews/character-tiers.html)) are refreshed after the
docs are decided.

| | Today (every tier) | Tier 1 | Tier 2 | Tier 3 |
|---|---|---|---|---|
| **Class choice** | 6 classes | 6 classes | + a **class branch**, one of two: a **focus** (Ring or Light/Dark, +15% on its kinds), her default or reverse set, three class skills | + the branch's capstone and the class's mastery |
| **Weapon slots** | 5 | 3, by her class's Arms count | 3 | 3 |
| **Default weapons** | Five | The owner's three (CP3) | Branch 1 the defaults, branch 2 the reverse set (CP40) | The same |
| **Foes weak to** | 2–5 kinds, half at random | 2: her twins (an Arm and its element) | Regulars 1; sub-bosses and bosses 2 | Regulars and sub-bosses 1; bosses 2 |
| **Shields (drafts)** | Regular 2–3, sub-boss 6, boss 8 | 2–3 · 5 · 6 | 3–4 · 7 · 8 | 3–4 · 6 · 9 |
| **Weapon branch** | — | Base: one kind, weak ×1.3 | G5: Pure (×1.5) or Dual (+ its fixed partner, the other group) | Pure → Keen (×1.7) or Tempered; Dual → Tempered or Evolved |
| **Two-kind weapons in her slots** | — | 0 | 1 | 2 (Brawler, Mage 1) |
| **Answers a regular** (default party) | Nearly all | 2.47 | 2.0 | 2.30 |
| **Might at G10** | 68 | 68 | 122 | 177 |
| **Armor** | 5, a half per piece; Armor Ranks | 5 slots, her class's half; **all defense**: HP +150, DEF and M.DEF +40, MP +30 at G10 | × 1.8; per piece for the four between | × 2.6 |
| **Accessories** | 2 typed: Damage (Orb), Support | 1: one of four base forms (Pendant, Orb, Bell, Insignia) | 2: all four families; two branches each from a slot's G5 | 3: each branch a step deeper |
| **Kind cap** (flat offense on one kind) | +68 (Orb and ring, X7) | +68 | +122 | +177 |
| **Gear gate** | 24 rank bars | Uma Lv 5g − 4 | The same | The same |
| **Trees she uses · nodes a weapon tree** | 5 · 15 | 3 · 8 | 3 + her class tree · 14 | 3 + her class tree · 17 |
| **Picks a class** | 25 forks and a 50-point budget | 3 | 7 (6 and her class branch) | 10 (9 and her class branch) |
| **Skills held · equipped** | Up to 50 · 3 → 10 | 15 · 3 → 7 | 18 · 3 → 10 | 34 · 10 and a master slot |
| **Skill Ranks** | — | 1–5 on every skill, +1 every 2 Class Ranks | The same, class skills too | The same; capstones open whole |
| **Extra Stats nodes** | 100, 5 → 30 active | 25, all count | 29: + Halo (1 kind), Valor | 33: + Halo's 2nd kind, Swiftness |
| **A stat with its moon, Lv 50** | About +50 | +51 | +92 | +133 |
| **Her moon** | — | 2 nodes | 2 | 2 |
| **Jewel kinds · items** | 3 · 100 Star Gems | 2 · 10 | 3 · 12 | 3 · 14 |
| **Template** | — | Calling, Flourish, moon, affinity +6% | + signature tip | Tip at both forks |
| **Signature accessory** (proposed in the affinity's place, WP33) | — | Her template's family, worn: ATK and M.ATK +0.2 a level (+10 at Lv 50) | × 1.8 (+18) | × 2.6 (+26) |
| **Work places · slots** | 11 facilities · 33–55 slots | 10 places, existing buildings · 40 | 10 · 40 | 10 · 40 |
| **Material types a gathering profession** | 8 families × 10 grades | 2 (a pair) | 4 | 6 |
| **Which material a grade takes** | Two families, rotating | G1–G5 low, G6–G10 high | G5 and G10 on Tier 2's pair | G4 and G9 Tier 2's; G5 and G10 Tier 3's |
| **Where an Uma works** | Any of 11 | Her trade's 2 places | + a secondary's base work | The secondary reaches its Tier 2 work |
| **One Uma maxed, refined** | 472 | 485 (493 with her moon) | 503 (511) | 521 (529) |
| **Hours, Craft Lv 25 speed** | 776 | 822 (835) | 852 (866) | 883 (896) |
| **A run of twenty** | 24 days | 15.7 days | 28.4 days | 29.4 days |
| **Build values** | Flat | × 1 | × 1.8 | × 2.6 |

### 2.3 One Uma's demand

[profession-progression.md](profession-progression.md) owns materials, recipes and amounts (PP8–PP11);
[weapon-progression.md](weapon-progression.md) and [extra-stats-progression.md](extra-stats-progression.md) own the
items and how many she needs. Cells are pieces · refined items.

| Item | Made at | Refined a piece | Tier 1 | Tier 2 | Tier 3 |
|---|---|---|---|---|---|
| Weapon Gem (G1–G10; not G5 from Tier 2) | Forge | 4 | 30 · 120 | 27 · 108 | 27 · 108 |
| Branch Gem (G5): the G5 Weapon Gem in its tier's pair | Forge | 4 | — | 3 · 12 | 3 · 12 |
| Armor Fittings | Armorer | 2 (G1–G5), 3 (G6–G10) | 50 · 125 | 50 · 125 | 50 · 125 |
| Accessory Setting | Charm Shop | 12 · 6 · 4 by slot count | 10 · 120 | 20 · 120 | 30 · 120 |
| **Gear** | | | **90 · 365** | **100 · 365** | **110 · 365** |
| Planet Jewel I–V | Lapidary | 8 | 5 · 40 | 5 · 40 | 5 · 40 |
| Moon Jewel I–V (four moons; + Valor's, + Swiftness's II and IV) | Lapidary | 4 | 20 · 80 | 22 · 88 | 24 · 96 |
| Halo Jewel I–II, III–IV | Lapidary | 5 | — | 2 · 10 | 4 · 20 |
| **Jewels** | | | **25 · 120** | **29 · 138** | **33 · 156** |
| **One Uma** | | | **115 · 485** | **129 · 503** | **143 · 521** |
| Her moon: Moon Jewels II and IV | Lapidary | 4 | 2 · 8 → 493 | 2 · 8 → 511 | 2 · 8 → 529 |
| Hours at Craft Lv 25's speed (with her moon) | | | 822 (835) | 852 (866) | 883 (896) |
| Made from the tier's own pair | | | — | 21% | 21% (+ 22% Tier 2's) |

Today: 220 pieces, 472 refined (240 gear, 232 Star Gems), 776 hours. A party is five times one Uma (a Brawler or a Mage
skips one moon: 20 · 24 · 28 jewels). A second class, or Tier 2's reverse set, adds only the weapons she hasn't raised:
up to 30 gems a tier, 120 refined. Each trade carries about a fifth of the work in every tier (18.7–22.8%).

### 2.4 Glossary

One word, one meaning, in every doc and preview. *Cross-checked 2026-10-24: "Strike", "Orb · Support", "Specialized …
or a third" and the fork gems are retired (last rows). After the weapon review (2026-10-24): partner, Evolved, the
accessory forms and the signature accessory added; Slayer and the named Pendants retired.*

| Word | Means | Never means |
|---|---|---|
| **Kind** | One of the ten weapon kinds; a Tome's kind is named by its element in kind lists (Fire, Ice, Lightning, Light, Dark) | A strike or a channel |
| **Channel** | Arms (physical, ATK) or Tomes (magical, M.ATK) | — |
| **Twins · twin set** | An Arm and the element that share a shape: Greatsword and Fire, Axe and Ice, Lance and Lightning, Bow and Light, Katana and Dark; a set is named by its element ("the Lightning twins"); **Twilight** is the Bow and the Katana (a Light + Dark foe's weakness) | — |
| **The ring** | The element weakness rule: Fire > Ice > Lightning > Fire; Light ⇄ Dark | A weapon group (that is **Ring**, capitalized) |
| **Weapon group: Ring · Light/Dark** | CP38's two groups across both channels: **Ring** = Greatsword, Axe, Lance and Fire, Ice, Lightning; **Light/Dark** = Bow, Katana and Light, Dark. One split for both channels: each main Arm is an elemental Tome's twin | A kind |
| **The owner's group names** (2026-10-24) | Arms: **Heavy** (Greatsword, Axe, Lance) and **Lite** (Bow, Katana). Tomes: **Elemental** (Fire, Ice, Lightning) and **Arcane** (Light, Dark). The docs' Ring group is Heavy + Elemental, their Light/Dark group Lite + Arcane; the names land everywhere at implementation. Two clashes to settle then: "Arcane" is also the Rift's Arcane front, and "Heavy" begins some skill names (Heavy Slash) | — |
| **Focus** | A Tier 2 class branch's +15% on the hits of its group's kinds, read on a hit's own kind; a healer's also on those skills' mends and Barriers (CP39) | A kind; a stat |
| **Class branch · class skill · mastery** | From Tier 2, one of two a class: a focus, a default or reverse set and three class skills (cast through a focus weapon) · Tier 3: its capstone and the class's mastery mechanic | An advanced class; a tree's branch |
| **Default set · reverse set** | A class branch's weapons: branch 1 the owner's defaults, branch 2 the other group's (CP40) | — |
| **Fight type** | Physical, magical, physical hybrid, magical hybrid, healer | — |
| **Calling** | Her fight type and class by U4's rule (or her one-time pick); with **stride** and **knack**, her template's three readings | Her active class |
| **Uma Template** | "{knack word} {type}", e.g. "Tireless Ironhide" | A class template |
| **Class template** | A class's slots per tier: 3 weapons, 5 armor, accessory slots 1 · 2 · 3 | — |
| **Grade** | G0–G10 on a weapon, an armor slot or an accessory slot | "Weapon Rank" (retired) |
| **Weapon branch: Pure · Dual · Keen · Tempered · Evolved** | A weapon's growth from Tier 2's G5: **Pure** (weak ×1.5) or **Dual** (its Tier 2 partner, coverage only); Tier 3 forks both lines: Pure → **Keen** (×1.7) or **Tempered** (+ its Tier 2 partner, both ×1.5), Dual → Tempered or **Evolved** (its partner turns to its Tier 3 partner, both ×1.5; the owner's "Evolution"). Two kinds a weapon at most | "Specialized", an accessory's form, a tree's branch |
| **Partner (fixed partner)** | A weapon's second kind, fixed for life (WP32): its **Tier 2 partner** (a Dual's and a Tempered's) and its **Tier 3 partner** (an Evolved's), both of its own channel and of the other weapon group. Coverage only: a hit reads its own, first kind for every bonus | A kind picked at the step; a party member |
| **Gem** | Only the Forge's weapon items: **Weapon Gem** and **Branch Gem** | Anything gathered; anything for Extra Stats |
| **Branch Gem** | One item a tier (Tiers 2 and 3), a weapon's G5 step; the branch is picked when it is used (the partner is fixed); the G5 Weapon Gem in its tier's pair, 4 refined | A gem per branch; anything for accessories |
| **Armor Fittings, Accessory Setting** | The Armorer's and the Charm Shop's grade items | — |
| **Pendant** | An accessory family (every tier): flat offense spread over her kinds. Base **Pendant** her three slotted kinds; branches **Great Pendant** (the same, more) and **Channel Pendant** (two kinds of one channel) | A defensive item; a group's or twin set's fixed Pendant (retired) |
| **Orb** | An accessory family (every tier): flat offense on one kind, half a weapon's Might × tier. Branches **Great Orb** (one kind, more) and **Twin Orb** (one twin set's two kinds) | "The Damage slot" (retired) |
| **Bell** | An accessory family (every tier): when she Attacks, her weapon of its kind strikes once more (base 0.1 a grade × her hand); its kind must be one she holds. Branches **Great Bell** (a harder hit) and **Toll Bell** (louder each time it rings in a fight) | A new kind |
| **Insignia** | An accessory family (every tier): base **Insignia** her hits on sub-bosses and bosses +15%; branches **Great Insignia** (the same, more) and **Onslaught Insignia** (her first act each wave) | — |
| **Base form · accessory branch · Great branch** | An accessory family's Tier 1 form; from a slot's G5 in Tier 2 its two branches, the **Great** one (the same reach, deeper) and the one that changes the reach (Channel Pendant, Twin Orb, Toll Bell, Onslaught); Tier 3's G5 takes each **a step deeper**. A form is a setting of the slot, nothing crafted (WP34) | A weapon branch; an item |
| **Signature accessory** | Her template's accessory family (WP33): while she wears any form of it, ATK and M.ATK +0.2 a level × tier (+10 · +18 · +26 at Lv 50); the normal item on anyone else. Proposed in the affinity's place (CP36), decided in the Uma Templates pass | A unique item; a weapon bonus |
| **Kind cap** | Flat offense on one kind from accessories and the Halo stops at a G10 weapon's Might × tier: +68 · +122 · +177 (WP24) | A cap on percentages |
| **Damage stack** | WP31's order on every hit: flat offense (her own kind's, capped) → the hit (× hand, Skill Rank) → the weak multiplier → the focus, affinity, Insignia → today's statuses and halving | — |
| **Jewel** | Only the Lapidary's Extra Stats items: **Planet**, **Moon** and **Halo Jewels** (a numeral is the node it opens) | A gem |
| **Stone** | What Hunting gathers (Quartz, Garnet; Sapphire, Diamond; Starstone, Philosopher's Stone); refined, **Cut Quartz** and so on | A gem or a jewel |
| **Raw · refined item** | Gathered · processed one for one at the Workbench (the job is "process") | "Processed item" |
| **Pair · band · the ladder** | A gathering profession's low and high type for one tier · grades 1–5 or 6–10 · PP9: a grade decides its material (Tier 2: G5 and G10 on Tier 2's pair; Tier 3: G4 and G9 Tier 2's, G5 and G10 Tier 3's) | — |
| **Profession · trade · secondary** | One of the ten · her calling's gathering and crafting pair · from Tier 2, any other profession's base work (PP14) | Today's "second profession" (Lore) |
| **Place · slot** | A profession's one building on the Wilds · one Uma's work in it, shown as a pip | A facility with levels; a hut or a yard |
| **Trunk · fork · branch · tip · capstone · root** | Depths 1–2 · the depth-3 choice · A, B, C · depth 5 · depth 6 · her class plate | Side nodes, side points (retired). "Branch" alone is a tree's; the others are a **class branch**, a **weapon branch** and an **accessory branch** |
| **Skill Rank** | A held skill's rank, 1–5, one every 2 Class Ranks (×0.95 → ×1.05) | Class Rank |
| **Affinity** | Her template's twin set: +6% damage with its two kinds (the signature accessory proposed in its place, WP33) | A damage kind |
| **Guided build** | A Rift path's composition and every member's three weapons | The campaign's defaults |
| **Flourish · signature tip · her moon** | Her template's root node · its Tier 2+ tip option · her own two-node moon | — |
| **Planet · moons · Halo · Valor · Swiftness** | Extra Stats bodies: every core stat · Strength, Sorcery, Vigor (HP and MP), Guard · one damage kind's flat offense · Limit start · evasion | — |
| ~~**Strike**~~ | Retired (owner, 2026-10-23): the ten kinds are the damage and weakness types | — |
| ~~**Orb · Support** (slots)~~ | Retired with the supports (WP17, WP19): slots are untyped; the Orb is a family | — |
| ~~**Specialized … or a third**~~ | Retired: Pure or Dual, no third branch (WP6) | — |
| ~~**Fork gems**~~ (Dual, Pure, Prism, Tempered, Keen Gem) | Retired: one Branch Gem (WP10); Prism dropped | — |
| ~~**Slayer**~~ (Insignia) | Retired (the owner's weapon review, 2026-10-24): it is the base Insignia (WP23, WP28) | — |
| ~~**Named Pendants**~~ (Main Arms, Secondary Arms, Elemental, Arcane; the five Twin Pendants) | Retired into forms that read her slots: the Pendant and Great Pendant her three kinds, the Channel Pendant two of one channel, the Twin Orb a twin set (WP13, WP20) | — |

### 2.5 The stat budget (SB1, working rule, 2026-10-23)

The owner's worry: stat growth across tiers mustn't drift out of balance. [stats-by-tier](previews/stats-by-tier.html)
shows the first drafts' problem: gear and Extra Stats gave the **same values in every tier** while her level keeps
growing, so the build's share of a stat fell (a Summoner's offense 57% → 43%, HP 28% → 14%, MP 20% → 9% from Tier 1 to
Tier 3).

**The rule every standalone doc writes to:** the build keeps **the same share of every stat at each tier's Lv 50**.
Every flat build value (weapon Might, armor, Pendants and Orbs, the kind cap, the Halo, Extra Stats nodes, template
nodes) is written as its **Tier 1 value × the tier's multiplier**, the growth of an average Uma's base stats: **Tier 1
×1, Tier 2 ×1.8, Tier 3 ×2.6** (base core stat 104.5 → 187 → 269.5 at lifetime Lv 50, 100, 150). Shares and
percentages (weak multipliers, the focus, the affinity, Insignias, a Bell's power, evasion, Limit start) stay the same
in every tier. The foes' build budget (`rpgFoeTierBudget`) moves to the same multiplier (EP16). Item **amounts** don't
scale (PP11).
- **Why:** balance is then one curve, set once in Tier 1 and carried by one number per tier; a source's share is the
  same at every tier, so nothing drifts. Under it a Brawler's HP is 27% build at Tier 1 and 29% at Tier 3, her lead
  offense 55% → 61% → 61% (CP §9).
- **The alternative,** flat values: the build matters less each tier and every tier needs its own tuning.
- **Docs write values as "T1 value × tier"** so either choice is a one-line change. The overall stat balancing pass
  (§5, after the owner's reviews) sets the final numbers by simulation.

## 3. Who owns what

**Who wins a conflict:** the owning doc below. A call changed to resolve one says "Changed in cross-check (2026-10-24)".

| Doc | Owns | Main interfaces | Absorbs (history) |
|---|---|---|---|
| [class-progression.md](class-progression.md) (CP1–CP43) | The six classes, slots by channel, the defaults; class templates and presets per tier (which set; the accessories named by weapon-progression); class trees, Class Rank, Skill Ranks; **class branches**: the weapon groups, the focus, default and reverse sets, class skills; masteries; foe weaknesses and **shields**; the Rift's guided builds; the calling pick; the halls' Limit Break kinds | Weapons (slots, sets), Extra Stats (channels, leans), Professions (the calling's trade), Uma Templates (two slots, the affinity) | [classes.md](classes.md), [skill-trees.md](skill-trees.md) |
| [weapon-progression.md](weapon-progression.md) (WP1–WP34) | **Weapons** (branches, **the partner table**, the two-kind cap, Might × tier, coverage), **armor** (all defense), **accessories** (families, base forms and branches, slots, the **kind cap**, presets' forms, **the signature accessory**), **the damage stack**; the crafted products and pieces per Uma | Classes (slots, sets, focus), Extra Stats (the Halo under the cap), Professions (what is made) | [gear.md](gear.md); decides [weapon-research.md](weapon-research.md) |
| [extra-stats-progression.md](extra-stats-progression.md) (EP1–EP22) | **Extra Stats bodies, nodes and grants** per tier (the Planet, four moons, the Halo, Valor, Swiftness), her moon's slot, **jewels** (kinds, grades, counts), the foe budget's tier scaling | Weapons (the kind cap, armor beside it), Professions (jewel recipes), Uma Templates (her moon) | [extra-stats.md](extra-stats.md) |
| [profession-progression.md](profession-progression.md) (PP1–PP23) | The ten professions and their kinds, places and slots, **materials** (catalog, the ladder), **recipes and amounts**, supply and demand, the secondary, the Exchange, **the refund's mix** | Weapons and Extra Stats (what is made, how many), Classes (the calling) | [professions.md](professions.md) |
| [variance.md](variance.md) (U1–U16) | Uma Templates: the catalog, the calling's rule (U4), template-only pieces | Classes (CP24, CP36), Extra Stats (EP14), Weapons (WP33, the signature family) | Folded into the standalone docs by the Uma Templates pass |

Every standalone doc has: the owner's points, at a glance, today, the proposal per tier, Provides and Assumes, save
impact, pacing and a closing **Decisions** table where every call has a recommendation. No open questions.

## 4. The previews

- In [`previews/`](previews/), one self-contained HTML file per view, no external scripts, fonts or images; each copies
  the style block from [`previews/_template.html`](previews/_template.html) (the game's own colours, light and dark).
- **Full desktop pages** (the owner, 2026-10-22): charts, diagrams and drawn trees over walls of tables, with a "Show the
  numbers" table under each chart and hover detail.
- **Nothing from the original games:** no real Uma names, skill names or art. Invented names and our own words.

| View | Pages |
|---|---|
| **Class Progression** | [overview, composition, the calling pick](previews/class-overview.html) · [templates, focus and pairings, what grows, Lv 50 stats](previews/class-templates.html) · [the tree viewer](previews/class-trees.html) · [foe weaknesses and coverage](previews/class-weaknesses.html) |
| **Weapon Progression** | [the weapon tree viewer and coverage](previews/weapon-trees.html) · [armor and the defensive budget](previews/weapon-armor.html) · [the accessory catalog and viability](previews/weapon-accessories.html) · [every recipe and one Uma's totals](previews/weapon-materials.html) |
| **Extra Stats Progression** | [the map at every tier](previews/stars-maps.html) · [what it grants, the build share](previews/stars-grants.html) · [the jewels and per-Uma totals](previews/stars-jewels.html) |
| **Profession Progression** | [the Wilds map at each tier](previews/prof-map.html) · [every material type](previews/prof-materials.html) · [gathering → processing → making](previews/prof-flow.html) · [demand against supply](previews/prof-demand.html) |
| Every category (first round, 2026-10-22/23; refreshed after the standalone docs are decided) | [every category × every tier](previews/progression.html) · [her detail page at Tier 1, 2 and 3](previews/character-tiers.html) · [max stats by tier](previews/stats-by-tier.html) |
| Uma Templates (first round; input to the Uma Templates pass) | [the catalog](previews/variance-templates.html) · [two front runners](previews/variance-two-umas.html) · [her profile by tier](previews/variance-profile.html) |
| First round, history | Classes: [composition](previews/classes-composition.html) · [strikes](previews/classes-strikes.html) · [template sheets](previews/classes-template-sheets.html) · [trees](previews/classes-trees.html). Skill trees: [by tier](previews/skills-trees-by-tier.html) · [every class at Tier 1](previews/skills-all-classes-t1.html) · [the Skills tab](previews/skills-profile.html). Gear: [weapon tree](previews/gear-weapon-tree.html) · [the Gear tab](previews/gear-loadout.html) · [crafting](previews/gear-crafting.html). Extra Stats: [the map](previews/extra-stats-maps.html) · [the budget](previews/extra-stats-budget.html). Professions: [the Wilds map](previews/professions-map.html) · [the flow](previews/professions-flow.html) · [demand](previews/professions-demand.html) |

## 5. The plan

1. **Fan-out** (2026-10-22): six first-round docs and their previews, written in parallel. *Done; history.*
2. **Cross-reference** (2026-10-22): one pass reconciled the six, fixed the shared numbers and built the two views that
   need every category (§7, XR rows). *Done; history.*
3. **Standalone docs, detailed, one per category** (the owner, 2026-10-23). *Authored, and cross-checked (2026-10-24).*
   1. [class-progression.md](class-progression.md): authored 2026-10-23, revised after the owner's review and his
      second pass (2026-10-24). Absorbs classes.md and skill-trees.md.
   2. [weapon-progression.md](weapon-progression.md): authored 2026-10-24 on the research note
      ([weapon-research.md](weapon-research.md)); revised after the owner's review the same day (WP32–WP34 new).
      Absorbs gear.md.
   3. [extra-stats-progression.md](extra-stats-progression.md): authored 2026-10-24. Absorbs extra-stats.md.
   4. [profession-progression.md](profession-progression.md): authored 2026-10-24. Absorbs professions.md.
   5. **Cross-check** (2026-10-24): the four made to agree, this brief brought up to date (§7, XC1–XC16).
4. **Next: the owner's reviews, one doc at a time, in order:** Class (approved, D192) → Weapon (revised after his
   review; its second review next) → Extra Stats → Profession (§10), each ending with its D-rows in
   [decisions.md](../../decisions.md).
5. **Then:** the overall **stat balancing** by simulation (SB1, §9.5); the **Uma Templates** pass (variance.md, folded
   into the standalone docs; CP36's and EP14's notes); then **implementation** packets behind engine v16's switch, save
   v27, with the refund (§9).

## 6. Status

| Doc | State |
|---|---|
| **class-progression.md** | **Approved by the owner, 2026-10-24 (D192):** CP1–CP43 as written, CP42's Pierce included. Cross-checked the same day. **Follow-ups to the weapon review** logged against D192, no decision changed (XC17, XC18, XC20) |
| **weapon-progression.md** | Authored 2026-10-24 (WP1–WP30). **Cross-checked:** WP12, WP13, WP25, WP26, WP27 changed, WP7 worded with CP12, **WP31 new** (the damage stack). **Revised after the owner's review 2026-10-24; for review (second).** WP32–WP34 new (the partner table, the signature accessory, accessory forms); WP1, WP6, WP7, WP9, WP11–WP13, WP18–WP23, WP25, WP27–WP31 changed; WP8, WP24, WP26 re-checked; armor kept (WP14–WP16) |
| **extra-stats-progression.md** | Authored 2026-10-24 (EP1–EP22). **Cross-checked:** no call changed; its sheet, groups, Halo preset and save numbers aligned. **Follow-ups to the weapon review:** the Halo's preset wording and the offense column (XC19, XC20), no call changed. **For review, third** |
| **profession-progression.md** | Authored 2026-10-24 (PP1–PP23). **Cross-checked:** no call changed; weapon-progression adopted its recipes, amounts and refund. **Follow-up to the weapon review:** wording only, no amount moved (XC21). **For review, fourth** |
| weapon-research.md | Input (WR1–WR6), decided as WP1–WP12 |
| variance.md | First round, cross-referenced; the Uma Templates pass's input |
| classes.md, skill-trees.md, gear.md, extra-stats.md, professions.md | History: superseded by the standalone docs |
| Overview pages (progression, character-tiers, stats-by-tier) | First round; bannered; refreshed after the standalone docs are decided |
| Cross-reference (XR) | Done, 2026-10-22 |
| Cross-check (XC) | **Done, 2026-10-24** (XC1–XC16); the weapon review's follow-ups the same day (XC17–XC22). Next: the owner's second review of weapon-progression.md |

## 7. Cross-reference and cross-check log

Two passes. **The cross-reference (XR, 2026-10-22)** reconciled the six first-round docs; its rows are history, kept
for the calls the standalone docs still carry (XR2, XR6, XR12). **The cross-check (XC, 2026-10-24)** made the four
standalone docs agree; each changed call says "Changed in cross-check (2026-10-24)" in its doc. **XC17–XC22** carry the
owner's weapon review (2026-10-24) into the other docs: wording and numbers only, no design change; each spot says
"Follow-up to the weapon review, 2026-10-24".

### 7.1 The cross-check (2026-10-24)

| # | Conflict | The call | Owner (README §3) |
|---|---|---|---|
| **XC1** | **Recipes and totals.** weapon-progression §6 kept its draft: professions.md's catalog (Cedar for Tier 2), a tier's pair only in the Branch Gem, a Branch Gem of 9 refined, gear 365 · 380 · 380, the Uma 485 · 510 · 520 and 822 · 864 · 881 hours | **profession-progression's:** the ladder (PP9), PP8's names, every recipe (PP10), the Branch Gem the G5 Weapon Gem in its tier's pair (4 refined); gear **365 in every tier**; one Uma **485 · 503 · 521** (493 · 511 · 529 with her moon), **822 · 852 · 883 h** (835 · 866 · 896). weapon-progression keeps its pieces and its one Branch Gem item (WP10). Changed: **WP26**; WP §0, §3.10, §6, §9, §13 | profession-progression (amounts) |
| **XC2** | **The refund.** weapon-progression §11 converted each piece's raw items by family (PR14); profession-progression pays the raw count in Tier 1's demand mix (PP20) | **PP20:** every deleted item's raw count back, paid in Tier 1's demand mix (every type 1–2 short of her 485, against the by-family mix's 36 short on two lines). Changed: **WP27**, WP §11 | profession-progression (refund mix) |
| **XC3** | **The damage stack.** The focus (+15%, CP39), Pure and Keen (WP6, WP9), the kind cap (WP24), the affinity (+6%, CP36), Skill Ranks (CP32), Insignias (WP23) and the Halo (EP9) all sit on one kind's hits with no stated order (weapon-research risk 3) | **WP31, new:** one order on every hit, stated once in weapon-progression §2.4: (1) ATK or M.ATK + Might + flat offense on the hit's own kind under the kind cap; (2) offense² ÷ (offense + defense) × power × hand × Skill Rank; (3) × the weapon's weak multiplier (either kind); (4) × focus 1.15 × affinity 1.06 × Insignia, each its own factor on the hit's own kind; (5) today's statuses, riders, halving, ward, evasion. Ceiling on one weak hit ×1.38 · ×1.83 · ×2.49; fallbacks: focus +10%, then Insignias, then Keen ×1.6. class-progression (§3.5, §7.2, §15) and extra-stats-progression (§13, §16) point to it | weapon-progression (the stack) |
| **XC4** | **Presets against class branches.** WP25 dressed only the default sets: a Warlord (Bow, Katana, Axe) would keep a Greatsword Bell that does nothing; CP11 said "an accessory for her first slot's kind", which the Spell Blade's Lightning Twin Pendant isn't | **WP25 gains branch 2's presets** (Bow Bell; Arcane, Dark Twin, Fire Twin, Secondary Arms, Fire Twin Pendants; the Orb and the Halo on the reverse set's first slot; Tier 3 the Secondary Arms Pendant for the Warlord, else Onslaught); **CP11** names WP25's presets for both sets; CP §5.2 shows them. Changed: **WP25, CP11** | weapon-progression (members); class-progression (which set) |
| **XC5** | **Weapon groups.** weapon-progression (§3.9, WP13) and extra-stats-progression (EP10) named four per-channel groups (main, secondary, elemental, arcane); class-progression's CP38 has two groups across both channels (Ring, Light/Dark) | **CP38's two groups;** the four group Pendants (Main Arms, Elemental; Secondary Arms, Arcane) are the groups' channel halves, their names kept. The owner's group names (Heavy, Lite; Elemental, Arcane) are noted at CP38 and in §2.4 and land at implementation; no rename now (owner, 2026-10-24). Changed: **WP13**; WP §3.9, EP §4.1 restated | class-progression (groups) |
| **XC6** | **Class stat sheets.** class-progression §9 had the old armor, no Vigor MP, her moon's lead node counted and the first round's Orb as a placeholder; weapon-progression §4.4 had the new armor but no Vigor MP; extra-stats-progression §8.2 had both but no Tier 1 accessory | **One sheet in all three:** WP15's armor (per grade DEF and M.DEF +4, HP +15, MP +3, evasion 1.2%, × tier), extra-stats' values rounded per node (Vigor MP +30 × tier, the Planet, × tier), WP25's presets' flat offense under the kind cap, her template apart. Brawler at Lv 50: HP 1,477 · 2,548 · 3,628, MP 213 · 368 · 523, lead offense 260 · 587 · 849. Changed: CP §9, WP §4.4, EP §8.2's offense column | weapon-progression (armor, accessories); extra-stats-progression (Extra Stats) |
| **XC7** | **Boss shields.** CP8 drafted Tier 1 shields (sub-boss 5, boss 6) and Z2's +1; WP12 drafted boss shields 6 → 8 → 9 growing with their answers | **CP8, per tier, by WP12's measure:** a shield grows with the answers its foe's list gets, never below Tier 1's + 1 (Z2): bosses **6 · 8 · 9**, sub-bosses **5 · 7 · 6**, regulars 2–3 · 3–4 · 3–4. Changed: **CP8**; WP12 points to it | class-progression (shields) |
| **XC8** | **Duals.** WP7 and CP12/CP33 said the same in different words (CP12 didn't say a Dual earns no bonus, nor "one chip a hit") | **One wording in both:** a Dual's second kind is of its own channel and coverage only: its hits carry both kinds for weaknesses and locks in every class that slots it, one shield point and one lock a hit; the slot, channel, offense, Might and tree stay the first kind's; every bonus reads the hit's own, first kind. No decision changed | weapon-progression (weapons); class-progression (slots) |
| **XC9** | **Accessories in class-progression.** CP §0, §3.5, §5.1, §5.3, §11 and CP10 still read "damage-oriented, being redesigned in weapon-progression.md" | **WP17–WP24's families named** wherever class-progression draws a slot: a Pendant or a Bell in Tier 1, + an Orb, + an Insignia; untyped, one of each family; Tier 1's choices 19 (loadouts 190 and 950). Changed: **CP10** | weapon-progression (accessories) |
| **XC10** | **MP after the supports.** weapon-progression §5.9 listed legs, the template's twists and the Bell, with knobs legs then the Flourish; extra-stats-progression gives Vigor MP +30 × tier (EP4) and the knobs legs, Vigor's rate, the Flourish (EP15) | **Vigor's MP counted, extra-stats' order of knobs:** legs' MP a grade, then Vigor's MP rate, then the Flourish's twists; never an MP accessory. WP §5.9, §13 | extra-stats-progression (Vigor) |
| **XC11** | **Versions.** Every doc and README §9 said save v26 for the Tier 1 rework; v26 is taken on main (D190, the UI clarity pass, 2026-10-22) | **Save v27 is the Tier 1 rework, v28 Tier 2's toolbox;** the engine stays **v16** (Tier 1) and **v17** (Tier 2), the live engine being v15. Changed: **CP31, WP27**; EP §15, PP §13–§14, §9 here | The frame (profession-progression found it) |
| **XC12** | **Stale values and links in class-progression.** The Halo drawn at "+10 → +34" in Tier 2 (Tier 1's values), links to the first-round extra-stats.md and gear.md | **+18 → +61 in Tier 2, +88 in Tier 3** (EP9 × tier); links to the standalone docs | extra-stats-progression (the Halo) |
| **XC13** | **The Halo's preset with a reverse set.** EP §4.1's preset is the Orb's kind, her first slot; from Tier 2 the first slot may be branch 2's | **Her set's first slot:** Warlord Bow, Sorcerer Light, Blademaster Katana, Conjurer Fire, Templar Bow, Oracle Light. EP §4.1 | extra-stats-progression (the Halo); class-progression (sets) |
| **XC14** | **What grows, drawn.** class-progression's templates page drew each class's Tier 2 and 3 branch picks differently from weapon-progression §3.8's recommended picks (the Mage's Dual on her Fire, not her Blizzard; the Spell Blade's Katana + Bow, not + Greatsword …) | **weapon-progression §3.8's picks** (the ones its coverage numbers, 2.0 and 2.34, are measured on) drawn on the templates page | weapon-progression (weapons) |
| **XC15** | **The previews.** weapon-materials.html and weapon-trees.html showed the old recipes (Branch Gem 9, 365 · 380 · 380); class-templates.html the placeholder accessory and the old sheet; class-overview.html "save v26"; stars-jewels.html "§2.3" for the first round's totals; the three overview pages the first round | **Brought to the docs' numbers;** the overview pages (progression, character-tiers, stats-by-tier) carry a banner: "Reflects the first round (2026-10-22/23); refreshed after the standalone docs are decided" | Each page's doc |
| **XC16** | **This brief** said the first round's frame (strikes retired but forms, "Orb · Support", fork gems, 510 · 520, v26) | **Rewritten to the current state:** §2 frame, tiers at a glance, demand and glossary; §3 ownership; §4 pages; §5–§6 plan and status; §9 versions; §10 the review order by standalone doc | — |
| **XC17** | **Duals after the weapon review.** class-progression (§0, §3.3, §3.5, §4.2, §4.4, §11–§13, CP12, CP33), its templates page and this brief said a Dual's second kind is any kind of its channel picked at the step, Tier 3's Dual → Tempered only, coverage 2.34; §3.5's Brawler held a Dual Axe + Katana | **weapon-progression's revision (WP7, WP9, WP12, WP32):** a Dual's second kind is the weapon's **fixed partner**, of its own channel and always of the other weapon group; Tier 3 forks both lines (Dual → Tempered or **Evolved**); a partner she already slots is no Dual; coverage **2.47 · 2.0 · 2.30**, bosses 3.53 · 3.67 (CP8's shields hold). §3.5's Brawler redrawn on WP §3.8's picks (Dual Lance + Katana; her Warlord set's Dual Bow + Greatsword); the templates page's tree and matrix draw the partners. Logged against D192, no decision changed | weapon-progression (weapons) |
| **XC18** | **Accessories and presets after the weapon review.** class-progression (§0, §3.5, §5.1–§5.3, §11, CP10, CP11) and its templates page had Pendants and Bells in Tier 1, Orbs from Tier 2, Insignias in Tier 3, the first draft's named Pendants and Orbs in the presets, Tier 1's "one of 19" | **WP18–WP25, WP34:** all four families in every tier; Tier 1's one slot one of four base forms (15 settings; loadouts 40 and 200 by family); a slot's G5 opens two branches each in Tier 2, their step in Tier 3; **WP25's new presets** for both class branches' sets (Tier 1 a Bell, a Pendant or an Orb; the Halo on her set's first slot; single-kind forms on her Dual). Logged against D192 | weapon-progression (accessories, presets' forms); class-progression (which set) |
| **XC19** | **The Halo's preset.** extra-stats §4.1 and §13 said "the Orb preset's kind (her first slot)", and §14 the Orb "back in Tier 2"; the new presets put a Great Orb, a Twin Orb or a Great Bell on her Dual or her other kinds | **"Her first slot"** whatever the Orb's (EP9 unchanged); Tier 3's second kind her second slot; the Orb there from Tier 1 | extra-stats-progression (the Halo) |
| **XC20** | **Lv 50 offense.** class-progression §9, extra-stats §8.2–§8.3, class-templates.html and stars-grants.html showed the first draft's Orb filling the kind cap on her lead kind (a Brawler 260 · 587 · 849); stars-grants.html had also missed the cross-check's Tier 1 Pendants | **One offense column on WP25's new presets** (her lead kind: the Halo, and a Pendant form for most): Brawler 260 · 526 · 760, Mage 279 · 584 · 849, Spell Blade 274 · 526 · 809, Summoner 260 · 526 · 809, Paladin 263 · 538 · 782, Cleric 249 · 556 · 808, the flat drafts beside them; a Brawler's lead offense 55% → 61% → 61% build (Extra Stats 20% → 29% → 29%). HP, MP, ATK, M.ATK, DEF and M.DEF don't move | weapon-progression (presets); extra-stats-progression (Extra Stats) |
| **XC21** | **Profession wording.** profession-progression named the families by tier (Pendants, Bells; + Orbs; + Insignias), a Setting "any type", and the Tier 3 Branch Gem "Keen or Tempered" | **Wording only** (WP §6.4's box): all four families in every tier, base forms then branches, a Setting any family and form; the Tier 3 Branch Gem "Keen, Tempered or Evolved". **No amount moves:** Settings 10 · 20 · 30 an Uma, 120 refined a tier; the Branch Gem 3 a tier; gear 365; one Uma **485 · 503 · 521** in all four docs and §2.3 | profession-progression (amounts) |
| **XC22** | **This brief after the weapon review** | §2 frame and tiers at a glance (fixed partners, Evolved, every accessory family in every tier, the signature accessory proposed in the affinity's place, coverage 2.30); §2.4 glossary (partner, Evolved, base form, Great branch, Channel Pendant, Twin Orb, Toll Bell, Onslaught Insignia, signature accessory; Slayer and the named Pendants retired); §2.5, §3, §5, §6; §8–§9's weapon and accessory rows (WP27, WP30); §10's Weapon list, WP1–WP34 | — |

**Checked, no conflict:** slots by channel and the owner's defaults in every doc and page; the calling and its pick
moving only Forest · Armorer ↔ Monster Den · Lapidary (CP30, PP2); accessories 1 · 2 · 3 and Settings 12 · 6 · 4
(WP19, PP10); the Moon Jewel counts 20 · 22 · 24 and the Lapidary 120 · 138 · 156 (EP §11.3, PP §3.5); the kind cap
(WP24, EP9: Orb 61 + Halo 61 = 122 in Tier 2); evasion on feet armor 12% and Swiftness +6% (WP §4.2, EP12); the
coverage numbers 2.47 · 2.0 · 2.34 (WP12, CP §3.5, WR6); one Craft Level and free class switching everywhere;
"a hit's own kind" for the affinity, the focus and every flat bonus (CP36, CP39, WP13, EP9). **Left for the owner:**
nothing outside the reviews; CP42 (Pierce) is a recommendation like every call. **After the weapon review (XC17–XC22):**
the coverage numbers read 2.47 · 2.0 · 2.30 (WP12, CP §3.5 and §4.4, here); the accessory slots stay 1 · 2 · 3 and
Settings 12 · 6 · 4; the kind cap is unchanged (the Great Orb the one form it binds beside the Halo).

### 7.2 The cross-reference (2026-10-22, history)

Each conflict, the call and why. Every changed row in a first-round doc says "Changed in cross-reference". These are
history: the standalone docs' calls replace them where they differ (XR1's recipes by PP10 and XC1, XR7's strike words
by CP2 and CP21, XR10's numbers by XC11, XR13's Lapidary by EP18).

| # | Conflict | The call | Why |
|---|---|---|---|
| **XR1** | **Gear vs Professions on amounts.** gear.md §8 drafted rotating pairs and triples, about 220 refined for gear; professions.md drafted fixed recipes, gear 365 and jewels 120 | **Professions' recipes and counts:** Weapon Gem 4 refined, Armor Fittings 2 / 3, Accessory Setting 12 · 6 · 4, a fork gem the G5 recipe plus one of each tier pair. Gear keeps its products, kinds, forms and counts (30 gems, 50 fittings, 10 · 20 · 30 settings) | §3: professions owns amounts. Fixed sets keep each trade near a fifth of the work (19.7–20.6%), and the Uma's total, 485, stays at today's 472; gear's 220 would idle the gear trades and cut an Uma by a quarter |
| **XR2** | **Naming.** Gear's "gems", Extra Stats' "jewels", variance's "Moon Gem", professions' "Gem Hunting", gear's "processed items" | **One vocabulary (§2.4):** gem = the Forge's weapon items only; jewel = the Lapidary's Extra Stats items; stone = what the hunt gathers; the profession is **Hunting**; refined items, as today | No item word means two things. The owner's "weapon improvement gems" and "Extra Stat Jewel Crafting" are kept as written; "fighting for gems" is what Hunting is |
| **XR3** | **Extra Stats vs Variance on her moon.** ES12 grew lead and knack tracks 2 · 4 · 6 (Tier 1 lead +6 at Lv 26) and split a Mighty knack half and half; variance drew two nodes every tier (knack +4 at Lv 16, lead +8 at Lv 36) and needed evasion or Limit on node I although ES6 keeps them off the shared map | **Variance's two nodes in every tier:** I knack +4 (Lv 16, Moon Jewel II, every class; Mighty +4 DEF and +4 M.DEF, as Guard), II lead +8 (Lv 36, Moon Jewel IV, her calling's channel). **Extra Stats' map rules:** ×1 a node of its grade, Lv 5g − 4, every open node counts, ids `template:1–2`. ES6 already names her knack as Tier 1's home for evasion and Limit | §3 gives template-only nodes to variance. A growing moon would push Tier 3 past professions' tenth-more work budget (PR10: 35 + 16 > 48) and to the edge of variance's +5% (U12); the template's later depth is the signature tip |
| **XR4** | **Classes vs Variance on the starting class.** CL13 adopted only "a Pace chaser with Power over Wit starts as a Spell Blade"; variance's calling has eight rows | **CL13 adopts U4's eight rows** (Pace sprinters with Power → Brawler, Wit-led closers → Summoner too) | Every class has starters, the start and the calling never disagree, and each fight type lands at 17–23%, which professions' PR1 relies on |
| **XR5** | **The hybrid mirror.** Full maps give the Summoner ATK for her Arms half (+10–15% damage a turn by hand) and the Spell Blade M.DEF; nobody owned the re-check | **classes.md owns it (CL5):** a simulation item for the Tier 1 packet, on the full template; target H63's mirror, equal damage a turn ±5% and 70/30 ± 5 each way; the knob is the hands (the Summoner's Arms hand first), never the map | Classes owns the hands; the map stays class-free (ES1) |
| **XR6** | **Weapons owned per kind.** gear.md gives each Uma ten weapons at G0, shared by every class; professions counted 30 Weapon Gems; nobody said what a class switch costs | **Kept, and stated** (gear §3.1, classes §6, professions §5.5): professions' 30 = one class's 3 weapons × 10 grades. A class switch costs only the weapons she hasn't raised, 0–30 Weapon Gems from the defaults; armor and accessory grades sit on the slot. Promotion resets every grade, so re-picking is free then | Switching stays cheap, as the owner's free switching wants; demand math counts what one class uses |
| **XR7** | **Strike words.** Heavy, Flurry, Area as strikes; skill lines named "… Flurry" and "Heavy …"; a Dual's second kind | **Strike words are strikes only:** SK14's renames stand ("Rapid …", "Potent …"); a core named for its own weapon's strike keeps its name (Heavy Slash, Thrust Flurry); a Dual keeps its first kind's slot and strike (gear §4.1, added); "Sweep", SK9's branch C, stays (a branch in the Skills tab, not a strike badge beside the Sweep Ticket, CL15's worry) | One meaning on every badge. The previews were fixed: the Gear tab's Spell Blade held two Heavy weapons; the weapon tree gained a strike column; the classes' tree preview now dims what Tier 1 drops |
| **XR8** | **Two calling rules.** professions.md §4 drafted its own fallback trade rule (no Cleric callings, a different split) | **One rule:** U4's, a pure function that ships with Professions if Professions ships first (PR1) | One Uma, one fight type |
| **XR9** | **Armor in classes' save rows** kept every piece; gear.md deletes and refunds them | **Gear's GE15:** every crafted piece goes, refunded; the slot holds the grade | Gear owns pieces |
| **XR10** | **Engine and save versions.** Gear put Tier 2's forms in "v16"; classes put Tier 1's rules in "v16 if it's next"; skill trees put Tier 2's nodes in "their tier's engine" | **v16 and v26 are the Tier 1 rework,** all six categories, built as packets behind one switch and live together (as classes v2 did, H53–H61). **v17 and v27 are Tier 2's toolbox.** Tier 3's comes with its design. Until v17, Tier 2 worlds play Tier 1's shape | Tier 1's pieces only balance together (three weapons need the strike rule; the on-curve build changes once). One migration computes the refund once, against one conversion table. Tier 2's term (Z4) needs its own simulation pass |
| **XR11** | **Tier 3's new pieces.** professions.md counted about 25 tier-pair items; Tier 3 has 3 fork gems and 4 Halo Jewels (two kinds) | **35 items:** Tier 3 maxed is 520 refined, 881 h, inside PR10's 48 | Arithmetic |
| **XR12** | **Her moon's jewels** were outside every total | **Counted beside the shared demand:** 2 Moon Jewels a tier, 8 refined, about 14 h (493 · 518 · 528 refined) | Every Uma has one; it stays outside the foe budget and the trades' shares |
| **XR13** | **The Lapidary's numbers.** extra-stats.md assumed 30 jewels at 4–5 refined | **Professions' final:** Planet Jewel 8, Moon Jewel 4: 120 per Uma in Tier 1; 130 and 140 with the Halo Jewels' tier pairs | Professions owns amounts |
| **XR14** | **"Tier 2 classes"** in variance.md and its preview | **Specializations:** the same six classes; her Flourish works in either specialization of her calling | CL11 |
| **XR15** | **Tier 2's toolbox term** (Z4) was priced on advanced classes, weapon arts, sets and the outer ring | **One term, as Z4 says, with the rework's tools:** the specializations, forms, the Orb's return, branch C and the Break tips, the Halo, Valor; Tier 2's simulation prices it (v17) | Keeps D170's restart-and-scale; only the tools change |
| **XR16** | **Gear Marks, Manuals, the Rift's gear EXP** | **Gear Marks become Class Marks one for one (GE15); gear Manuals go; the Rift's echoes pay Class EXP only** (gear §11) | Nothing earned is lost; nothing feeds a retired bar |
| **PR-R1** | **The owner's review of Professions (2026-10-22):** "way too much for how many structures to keep track of" (10 yards of 4 · 6 · 8 one-Uma huts: 40 · 60 · 80), and "fully reuse" the farm's and the Wilds' art | **One existing building per profession, four work slots inside** (professions §0, option A of three): 10 places and 40 slots in every tier; each place an uma-art building (`mine`, `forest`, `fields`, `fishery`, `monster-den`, `workbench`, `forge`, `lancers-barracks` for the Armorer, `arcane-armory` for the Charm Shop, `lapidary`), each material an item icon that exists (Fishing's high type is Ammonite, not a new Pearl). Tiers add a material pair, never a building or slot. No kit change, no new art. The demand doesn't move (485 · 510 · 520 refined, 493 · 518 · 528 with her moon); Tier 3's second Halo kind takes the Tier 3 pairs, which had no use. **Corrected:** today's roster is Forge-bound (a run of twenty, 24 days), the rework's about 17 | Ten structures instead of 40–80, one job a page, one row of pips; five lodges (B) save five places but put two jobs on a page. With the huts gone, the twenty materials are most of what's left to track, the same in every option |

**Checked, no conflict:** the six classes' default weapons in every doc and preview (CL4); the revives on the
Paladin's Lance and the Cleric's Light (SK6 needs CL4 to keep them, and it does); accessories 1 · 2 · 3 in classes,
gear, the template sheets and the Gear tab; Class Rank gates (SK4) against gear's level gates (they never wait on each
other); the Halo and Orb bound (+68, ES8 and gear); feet armor keeping evasion (gear §3.2, ES6); one Craft Level per
Uma; free class switching everywhere.

## 8. What the rework supersedes

Old docs stay as they are, for history; the D-rows of each review record these.

| Old decision or doc | It said | The rework | Where |
|---|---|---|---|
| **tiers.md T6** (D159), Option A's table | A growing toolbox: advanced classes, weapon arts, sets, the outer ring, class constellations, a second vertical | **The principle stays** (same battle rules, a growing toolbox); every row of its table is replaced by the four standalone docs' | §2.2 |
| **tiers.md T7** (D159) | Tier 1 cores only; existing sides kept until promotion | **Replaced:** one free fork a tree (CP18); learned sides convert to picks (CP31) | class-progression §6.2, §14 |
| **tiers.md T8** (D159) | Twelve advanced classes | **Replaced** by class branches: the six classes stay, each takes one of two weapon-group focus branches (CP26, CP38–CP41) | class-progression §7.2 |
| **tiers.md §6**, Tier 3 | Awakening at G10; class constellations; a master class per advanced class | Awakening → Tier 3's G5 step, Keen, Tempered or Evolved (WP9); constellations dropped (EP12); a mastery per class, opening with the branch capstone (CP27) | weapon-progression §3.3, extra-stats-progression §5, class-progression §7.3 |
| **tier2-classes.md** (H39, Q14) | A1 free switching among twelve; A2 leans ±0.1; A3 today's side rules; A4 names; A5 the twelve passives; A6 the Ascend pick; A7 Hero LB+; A8 LB power; A9 no Tier 1 skills carry; A10 skill MP ×1.7 | A1, A2 **dropped**; A3 **replaced** by branch C and the tip fork (CP19); A4 **kept** as the branch names; A5 **folded into the focus** (CP39); A6 **replaced** by branch 1 preselected (CP26); A7, A8, A10 **kept**; A9 **kept** (CP31) | class-progression §7.2, §8 |
| **weapon-arts.md** (H40, Q15) | E1 a core and an A/B fork per weapon; E2 Weapon Rank gates; E3 per weapon; E4 Lore Scrolls; E5 what an art touches; E6 the Break cap; E7 thirty nodes; E8 armor sets; E9 Lore Seals | E1's A/B fork **moves into the trees** as the Power or Break tip (CP19); E6 **kept** for the Break tip; E7 **replaced** by weapon branches (WP6–WP9); E2–E5, E8, E9 **dropped** (WP3, WP16) | weapon-progression §3, class-progression §6.3 |
| **extra-stats-tier2.md** (H41, Q12) | X1 the Halo; X2 a pair per kind, grades 5 and 10; X3 flat; X4 one specialty slot; X5 twenty ring gems from a second-profession item; X6 an outer orbit; X7 Orb + ring ≤ a G10 weapon's Might; X8 the inner map unchanged | X1, X3, X6 **kept**; X7 **extended** to the kind cap, × tier (WP24); X2 **kept** for one kind (Tier 2) and a second (Tier 3, Halo Jewels III–IV, EP17); X4 → a free kind setting (EP9); X5 → Halo Jewels from the tier's pairs (EP18); X8 **replaced** (the Planet and moons) | extra-stats-progression §4–§5 |
| **second-profession.md** (H42, Q13) | Lore Level, Relics and Glyphs, three Tier 2 sites, Scrolls and Seals | **Replaced:** a secondary of any other profession's base work (PP14), the ladder (PP9); no Lore (PP18) | profession-progression §2.3, §3.4 |
| **tier2-world.md** (H43, Q16) Z2 | The same biomes and signatures, every foe's shield +1 | **Weaknesses narrow by rank** (CP6); shields grow with answers, Z2's +1 the floor (CP8) | class-progression §4.2, §4.4 |
| **tier2-world.md** Z4 | One Tier 2 term (+15% HP and defense, +10% offense by Lv 50) from H39–H41's tools | **One term kept;** its tools re-listed: class branches and the focus, weapon branches, the second accessory slot and the accessory branches, branch C and Break tips, the Halo, Valor; priced with v17 | class-progression §15, weapon-progression §13, extra-stats-progression §10 |
| **tier2-world.md** Z9 | Fronts that test weapon arts and the outer ring | Fronts test weapon branches, Break tips, the focus and the Halo | class-progression §4.3 |
| **Q9** (keep the Limit stat) | Keep it | **Answered:** off Tier 1's shared map (her knack keeps it), back as Tier 2's Valor moon (EP8, EP11) | extra-stats-progression §4.2 |
| **Q10** (variance sketch) | Distance as a hard limit; her unique skill as a passive; gold skills | **Replaced** by Uma Templates: nothing from the original's skills (U2, U7) | variance |
| **Q17** (hybrid crossovers) | A Spell Blade sweep side, a Summoner focus side | **Answered:** Tier 2's branch C, Sweep and Hunt, on the leading half's trees (CP19) | class-progression §6.3 |
| **Today's rules the rework retires** | Two typed accessory slots (C10, D124) and the ten supports; rotating recipe pairs (D139); facilities and upgrades (D144); side points and their dot (D166); side gates (D102's); weapon, armor and accessory ranks and Gear Marks; Star Gems and active slots; the start by style alone (D162, D180) | WP17, WP19; PP10; PP4; CP14; CP16; WP3; EP6, EP17; CP29 (D180's split kept inside the calling) | Each doc's §1 "Today" |

## 9. Engine, save and refund

**The version plan** (XC11; XR10's principle kept). **Engine v16 and save v27 carry the Tier 1 rework,** every
category, in every world: the packets land behind one switch (`caps.ts`) and go live together, as classes v2 did
(H53–H61). Save v26 is taken on main (D190, the party lead), the live engine is v15. **Engine v17 and save v28 carry
Tier 2's toolbox.** Tier 3's versions come with its design. Until v17, Tier 2 worlds play Tier 1's shape. v6–v15 fights
replay on their own engine; stored fights keep their frozen inputs.

### 9.1 Engine v16: Tier 1

| Change | From | Kind |
|---|---|---|
| Input checks per tier: three weapons within the class's Arms count; Tier 1's one accessory, one of the four base forms; the ten supports refused | CP2, WP17, WP19 | Validation |
| **Skill Ranks:** each skill's rank multiplier (×0.95 → ×1.05) frozen into a fight's input | CP32 | Rule (input) |
| **Bells:** after an Attack, one hit of her weapon of its kind at 0.1 a grade × her hand; counts for weaknesses and locks; no gauge | WP21 | Rule |
| **Pendant and Orb** base forms: flat offense on her three kinds or one, on the Orb path (`orbMight`) | WP20, WP22 | Data |
| **Insignia** base form: a percentage on her hits on sub-boss and boss rank (a factor in the damage stack's step 4) | WP23 | Rule |
| Armor's values per slot (DEF, M.DEF +4 a grade; HP +15; MP +3); Might, armor offense and accessory values × tier; the foes' build budget × tier | WP4, WP15, EP16 | Data |
| The Paladin's revive on her Light D3 B; two Limit Breaks' kinds (Rampart Charge Axe, Choir of Angels Lightning) | CP37, CP35 | Data |
| The Flourish's three MP twists (Opening, Even pace, Second wind), on as her calling | U9 | Rule |
| No engine change: weaknesses by kind (the generator's twins), locks as today, the Tier 1 trees (every node exists today), Extra Stats and her moon (points frozen at a fight's start; Vigor's MP is a point) | CP5, CP8, CP18, EP | Generator, data |

### 9.2 Engine v17: Tier 2's toolbox

| Change | From |
|---|---|
| Weapon branches: a weak multiplier per weapon (Pure ×1.5) in place of `BATTLE_WEAK`; a Dual's partner, from the partner table, for weaknesses and locks | WP6, WP7, WP32 |
| The two-kind cap; one accessory of each family; the second slot; the accessory branches (the Great forms, the Channel Pendant and the Twin Orb on the Orb path; the Toll Bell's and Onslaught's rules) | WP8, WP19, WP34 |
| The kind cap: flat offense on one kind from Orbs, Pendants and the Halo at most a G10 Might × tier | WP24 |
| The damage stack's percentages: the focus (+15% on a hit's own kind of her group; healers' shares) and the affinity (+6%), each a factor after the weak multiplier | WP31, CP39, CP36 |
| The class branches: the focus, class skills cast through a named focus weapon slot, Frenzy, guards as skills and the other new rules of CP34 | CP26, CP34 |
| Branch C nodes (Sweep, Hunt, Mighty, Wide) and the Break tips (one more shield point on a weak hit, once an act, under E6's cap) | CP19 |
| The Halo (flat offense joined to her Might of its kind; its kind frozen into the input); Valor's Limit start is a point | EP9, EP11 |
| The signature tips | U16 |
| Weakness counts by rank and shields by answers (generator only) | CP6, CP8 |
| **Tier 3, later:** Keen, Tempered, Evolved, the accessory branches' step, the third slot; depth 6 capstones, two branches held, the master slot, branch capstones and masteries; the Halo's second kind and Swiftness | WP9, WP34, CP20, CP27, EP12 |
| **With the Uma Templates pass:** the signature accessory (ATK and M.ATK + her level × 0.2 × tier while worn, frozen into the input) | WP33 |

### 9.3 Save v27: one migration, every world

| Data | Change | From |
|---|---|---|
| `classes[id].weapons` | 5 → 3: the class's new defaults; her per-tree picks stay | CP3, CP31 |
| `classes[id].tree`, `loadout`, `legacy` | Learned sides → picks (B if any B-line node, else A); other sides deleted; loadout pruned; `legacy` retired. Skill Ranks derived from Class Rank, nothing stored | CP31, CP32 |
| `OwnedUma.calling` | New: `{ pick, confirmed }` for the 163 pick-eligible outfits; owned Umas get the pre-selection, unconfirmed | CP29 |
| `uma.gear` (`locker`, `equipped`, `kinds`) | Replaced by grades: one per weapon kind (10), per armor slot (5) with its half, one accessory slot `{ grade: 0, family, form: 'base', kind? }` with her Tier 1 preset; all G0 | WP2, WP27 |
| `world.gear`, Forge jobs | Deleted, refunded; jobs collected or recalled | WP27 |
| `uma.ranks.weapons`, `armors`, `accessories`; the Exchange's gear Manuals | Deleted | WP3 |
| `wallet.gearMarks` | Class Marks, one for one | WP27, CP25 |
| `stars.unlocked`, `stars.active` | → `stars: { open, halo: [] }`, fresh ids (`planet:1–5`, `strength:` … `guard:1–5`, `template:1–2`) | EP §15 |
| `gems` (Star Gems), Lapidary cuts | Deleted, refunded; cuts collected or recalled | EP21 |
| The Warehouse | New shelves: Weapon Gems, Armor Fittings, Accessory Settings G1–G10; Planet and Moon Jewels I–V (`jewel-planet-1–5`, `jewel-moon-1–5`) | WP26, EP17 |
| `items` (160 ids) | Converted one for one to the 20 Tier 1 types by family and grade band | PP19 |
| `buildings`, `work`, place ids | Levels dropped (upgrades refunded); work settled; six ids kept, five removed, four new (`fields`, `fishery`, `armorer`, `charm-shop`) | PP19 |
| `OwnedUma.craft` | Kept | PP19 |
| The template | Nothing stored (U13); new unlocks start in their calling or pick | U13, CP29 |

**Save v28 (Tier 2):** a class branch per class (default branch 1; the focus and set derived), branch C and tip picks
(Power, Break, signature) (CP31); per weapon kind `{ grade, branch?: 'pure' | 'dual' }` (no stored partner: the
partner table fixes it, WP32), a second accessory slot, an accessory's `form` gaining `'great' | 'channel' | 'twin' |
'toll' | 'onslaught'`, the Branch Gem shelf (WP27); `valor:1–2`, `halo:1–2`, `stars.halo` with one kind,
`jewel-halo-1–2` (EP §15); `OwnedUma.secondary` (PP §14). **Tier 3's save** with its version: two held branches a tree
and the master slot; `branch: 'keen' | 'tempered' | 'evolved'`, a third slot (the accessory step derived from the slot's
grade); `swiftness:1–2`, `halo:3–4`.

### 9.4 The refund

> **Owner direction (2026-10-24, the weapon review): the raw-material refund is not the main approach.** Every Craft Level (the work levels, and today's farm and craft levels in old saves) **resets to 1**, and the player is **granted tickets for the time it took to reach those levels**; deleted crafted gear and Star Gems are compensated the same way rather than item by item. Worked out fully in the Profession review; the table below is the first draft it replaces.

The owner's lean (WP27, EP21, PP20): every raw item back, recrafted by hand. Computed from the save alone: every deleted
item names its raw inputs, and **the count is paid in Tier 1's demand mix** (the shares one Uma's 485 take), so what
comes back rebuilds what went.

| Deleted | Comes back as |
|---|---|
| Crafted gear in stock and bound to any Uma, every Orb and support, in every world | Each piece's 2 raw items, counted, paid in Tier 1's mix |
| Forge jobs | Finished outputs collected, then refunded as pieces; unfinished inputs returned, then converted |
| Star Gems in stock and set on nodes | Each gem's raw inputs, counted, paid in Tier 1's mix |
| Lapidary cuts | As Forge jobs |
| Facility upgrades (up to 22 a world) | Their Laurels (up to 7,150 a world), and their refined items as raw items in the mix (up to 66) |
| Weapon, Armor and Accessory Ranks | Nothing: Uma Level is the new gate |
| Gear Marks | Class Marks, one for one |
| Side skills learned | Nothing to refund: points were never stored |
| Items in stock, work in progress | Converted one for one, not refunded; only time in progress is lost |

**Volume:** a fully built Lv 50 Uma returns 472 raw items (240 from gear, 232 from Star Gems), paid as Copper Ore 37,
Iron Ore 65, Pine Log 35, Oak Log 58, Flax 60, Cotton 33, Seashell 59, Ammonite 33, Quartz 29, Garnet 63: every type
1–2 short of the 485 the reworked Tier 1 asks (493 with her moon).

### 9.5 Simulation items

**For the Tier 1 packet (v16):**
1. **Re-baseline:** an on-curve party (three default weapons, branch A, Tier 1's presets (WP25), the new armor, the full
   map with Vigor's MP, Skill Ranks, no template) wins every Tier 1 stage within 3 points of today's table; what the
   accessories and Skill Ranks add goes back through the foe budget (CP §15, WP §13, EP16).
2. **The mirror on full maps:** Spell Blade and Summoner damage a turn within ±5%, each 70/30 ± 5; Paladin vs Cleric
   ±10% (CP9).
3. **Weaknesses and shields:** rounds to the first Break within ±0.5 of today's on the shield drafts (CP8); Auto cancels
   charged moves as today ±5 points; the fronts inside rift.md §11's bands; no single Uma Breaks a Duel boss in one act.
4. **Tree branches:** a B or C branch +10–20% in its context; any mix within ±5 points of all-A; Pierce (CP42) the same
   on long shields.
5. **MP:** the Springs test with no MP accessory and +51 MP from the map: a region on Auto clears 10–12 of 12; knobs in
   order: legs' MP, Vigor's MP rate, the Flourish's twists (WP §5.9, EP15).
6. **Defense:** a regular's 100% hit about 18.7% of an on-curve Brawler's HP (WP15); the knob is armor's HP a grade.
7. **Accessories:** every base form the best somewhere in Tier 1 and every branch in Tiers 2 and 3, and no form the
   best in more than half of its tier's class-and-context cells; if one is, its per-grade values step down first (WP §5.7).
8. **Templates:** five matched Umas within 3 points; the mirror with both matched; the affinity and her moon under
   U12's +5% (CP36, EP14).

**For Tier 2's toolbox (v17):** Pure against Dual within ±10% (WP §3.7); **the damage stack** on one weak hit (WP31;
fallbacks: focus +10%, Insignias, Keen ×1.6); each class's two branches within ±5% across the regions and +10–20% in
their own (CP §15); the coverage script at 2.0 and 2.30 answers (WP12, CP4, CP41); boss shields 8 and 9 (CP8); Duals
and the Duel boss (weapon-research risk 2).

## 10. Review order

One standalone doc at a time, in this order; each ends with its D-rows. ✱ marks the calls the cross-check changed or
added (§7.1); † the calls the owner's weapon review changed or added (2026-10-24).

**0. The frame** (§2, §7, §9): **XR2** the vocabulary (§2.4) · **XR6** weapons owned per kind, a class switch costs
only unraised weapons · **XC11** engine v16 and save v27 are the Tier 1 rework, v17 and v28 Tier 2's · **the refund**
(§9.4: every raw item back, paid in Tier 1's demand mix, recrafted by hand) · **SB1** (§2.5). The other XC rows land
inside the docs below.

**1. Class Progression**: 43 calls, CP1–CP43. [class-progression.md](class-progression.md); pages: overview,
templates, tree viewer, weaknesses.

| Call | One line |
|---|---|
| CP1 | The six classes of classes v2 in every tier, identities and hands kept; one healer a party |
| CP2 | Three weapon slots in every tier, typed by channel only: Arms 3 · 0 · 2 · 1 · 2 · 1 |
| CP3 | The owner's defaults; the Spell Blade's Thunder and the Summoner's Bow resolved by the twins |
| CP4 | The campaign is balanced parties: four coverage checks on the defaults |
| CP5 | A Tier 1 foe is weak to her twins: the ring's answer element and its Arm |
| CP6 | Later tiers narrow by rank; bosses keep their twins |
| CP7 | The Rift is where specialized parties come in: a guided build per path |
| CP8 ✱ | Locks as today; shields per tier by their answers: bosses 6 · 8 · 9, sub-bosses 5 · 7 · 6 |
| CP9 | Hands unchanged; the mirror re-checked on full maps |
| CP10 ✱ | The template: 3 weapons, 5 armor, accessories 1 · 2 · 3 (all four families every tier: base forms, then branches; follow-up, XC18) |
| CP11 ✱ | Presets: the defaults in Tier 1, her branch's set from Tier 2, weapon-progression's accessories (WP25) |
| CP12 ✱ | Every kind of a slot's channel fits; a Dual's second kind is own-channel coverage, worded as WP7 |
| CP13 | One tree per weapon slot, three a class, under a class root |
| CP14 | No skill points at any tier; branches free, exclusive, A the default |
| CP15 | A fork changes reach, hits, support or Breaks, never a few percent alone |
| CP16 | Class Rank gates only: 1, 10, 20, 30, 40 (50 in Tier 3) |
| CP17 | Trees never add a damage kind |
| CP18 | Tier 1: a trunk and one fork into A or B; 8 nodes, all in today's catalog |
| CP19 | Tier 2: branch C (Sweep, Hunt, Mighty, Wide) and a Power or Break tip |
| CP20 | Tier 3: depth 6 capstones, two branches held, the master slot |
| CP21 | Today's catalog names; the strikes' renames reverted |
| CP22 | Equipped slots 3 → 7, 3 → 10, 10 and a master slot |
| CP23 | The Skills tab draws a real tree with rank pips and the class tree |
| CP24 | Template-only slots: the Flourish at the root, the signature tip on her affinity kind's tree |
| CP25 | Class Rank as today: 2E a win, Marks and Manuals, per class per world |
| CP26 | Class branches are a weapon-group focus; Ascend preselects branch 1 |
| CP27 | Tier 3: the branch capstone and the class's mastery open together at Class Rank 50 |
| CP28 | Six halls, 24 Limit Breaks, LB+ at Bond 10; Limit Breaks don't rank |
| CP29 | The calling pick: Pace Spell Blade or Mage, Late Paladin or Cleric, once |
| CP30 | The pick sets calling, start, trade and template; never locks a class |
| CP31 ✱ | The save: v27 (defaults, sides to picks, the calling pick), v28 (class branches) |
| CP32 | Skill Ranks 1–5, one every 2 Class Ranks, balance-neutral |
| CP33 | On the weapon: Pure or Dual (its fixed partner) at Tier 2's G5; in Tier 3 Keen or Tempered, a Dual Tempered or Evolved; two kinds at most (follow-up, XC17) |
| CP34 | A class branch is its focus and three class skills; the 36 skills re-paired to the focus |
| CP35 | Two Limit Breaks' kinds change: Rampart Charge to the Axe, Choir of Angels adds Lightning |
| CP36 | The template's affinity: +6% with one twin set's kinds, every tier, any class (the signature accessory, WP33, proposed in its place) |
| CP37 | The Paladin's revive moves to her Light D3 B |
| CP38 ✱ | The weapon groups, Ring and Light/Dark; the owner's names (Heavy, Lite; Elemental, Arcane) noted for implementation |
| CP39 | The focus: +15% on the group's kinds, a hit's own kind; healers' shares too |
| CP40 | Default and reverse sets, no default changed |
| CP41 | Party pairings: 5 of 16 states hold all ten kinds with any healer, 4 more with the right one |
| CP42 | The Spell Blade's branch B becomes Pierce (recommended, for the owner's word) |
| CP43 | Every tree viable: the audit found no gap |

**2. Weapon Progression**: 34 calls, WP1–WP34; revised after the owner's review (2026-10-24), for its second review.
[weapon-progression.md](weapon-progression.md); pages: tree viewer, armor, accessories, materials.

| Call | One line |
|---|---|
| WP1 † | Weapons own kinds and the weak multiplier; trees shape; armor defense; accessories damage; no Uma uniqueness on a weapon |
| WP2 | She owns every piece at G0; one crafted item raises one a grade |
| WP3 | Grade g at Uma Lv 5g − 4; gear ranks, Gear Marks and gear Manuals retire |
| WP4 | SB1: flat values × tier (the signature's per-level bonus too), shares unchanged |
| WP5 | Tier 1: a straight line, one kind, weak ×1.3 |
| WP6 † | Tier 2's G5: Pure (×1.5) or Dual (its fixed partner), no third branch |
| WP7 ✱ † | A Dual's second kind: its fixed partner, own channel and the other group, coverage only, the same in every class |
| WP8 | Two-kind weapons in her slots 0 · 1 · 2; the Brawler and the Mage 1 (re-checked: holds) |
| WP9 † | Tier 3 forks both lines: Pure → Keen or Tempered, Dual → Tempered or Evolved |
| WP10 | One Branch Gem item a tier, the branch picked when used |
| WP11 † | Re-forging within a line, a class switch and promotion; no second kind to re-pick |
| WP12 ✱ † | The coverage check: 2.47 · 2.0 · 2.30 answers a regular; boss shields as CP8 |
| WP13 ✱ † | Every bonus reads a hit's own kind; every two-kind weapon bridges CP38's two groups |
| WP14 | Armor: the slot holds the grade, the half sets only the piece and its offense (kept) |
| WP15 | Armor's values: one support's worth moves in (a regular's hit 20% → 18.7%; kept) |
| WP16 | Armor sets stay dropped |
| WP17 | All ten Talismans and Amulets retire |
| WP18 † | Four families, Pendant, Orb, Bell, Insignia, every one in every tier: a base form, then two branches |
| WP19 † | Slots 1 · 2 · 3, untyped, one of each family; branches from a slot's G5 |
| WP20 † | Pendants: base her three kinds; Great Pendant; Channel Pendant (two of one channel) |
| WP21 † | Bells: her weapon of its kind strikes once more after her Attack; Great Bell; Toll Bell |
| WP22 † | Orbs from Tier 1, half a weapon's Might × tier; Great Orb; Twin Orb (a twin set) |
| WP23 † | Insignias from Tier 1: sub-bosses and bosses +15%; Great Insignia; Onslaught (Slayer retired) |
| WP24 | The kind cap: flat offense on one kind ≤ +68 × tier (re-checked: the Great Orb the form it binds) |
| WP25 ✱ † | Presets per class and tier for both class branches' sets: the Halo on her first slot, single-kind forms on her Dual |
| WP26 ✱ | Four products; recipes and amounts profession-progression's: 365 refined in every tier (re-checked) |
| WP27 ✱ † | The save: v27 deletes and refunds (Tier 1's mix), families and forms in the slot; v28 branches, no stored partner |
| WP28 † | Names: grade, Pure, Dual, Keen, Tempered, Evolved, partner, Branch Gem, the four families and their forms, signature accessory |
| WP29 † | No new art: a branch shows its family's icon |
| WP30 † | Engine: Tier 1's pieces (the four base forms) in v16, Tier 2's in v17, Evolved and the steps with Tier 3 |
| WP31 ✱ † | The damage stack, one order on every hit; the signature a stat in step 1 |
| WP32 † | New: the partner table, a fixed Tier 2 and Tier 3 partner for each weapon, always the other group |
| WP33 † | New: the signature accessory, ATK and M.ATK +0.2 a level × tier while worn; proposed in CP36's place |
| WP34 † | New: accessory branches are forms, set freely once a slot's G5 opens them; no item |

**3. Extra Stats Progression**: 22 calls, EP1–EP22. [extra-stats-progression.md](extra-stats-progression.md); pages:
maps, grants, jewels.

| Call | One line |
|---|---|
| EP1 | Tier 1: the Planet and four moons, five nodes each; 25 nodes |
| EP2 | The Planet: +21 to all six core stats |
| EP3 | A moon node is worth its grade; Guard gives both defenses |
| EP4 | Vigor gives both pools, HP and MP |
| EP5 | A node opens with its jewel, in order, at Uma Lv 5g − 4 |
| EP6 | Every open node counts; no active slots |
| EP7 | Values × tier, rounded per node; Limit start and evasion don't scale |
| EP8 | Speed and Limit leave Tier 1's shared map |
| EP9 | The Halo: one kind, +10 → +34 × tier, under the kind cap |
| EP10 | The Halo serves kinds, never a group |
| EP11 | Valor: Limit start +4 from Tier 2 |
| EP12 | Tier 3: the Halo's second kind and Swiftness; no class constellations |
| EP13 | The same core rebuilt each tier, × tier |
| EP14 | Her moon: a marked two-node slot for the Uma Templates pass |
| EP15 | Defense and sustain: no new values; MP from regen to the pool |
| EP16 | The foe budget's build part × tier |
| EP17 | Jewels: Planet I–V, Moon I–V, Halo I–II and III–IV |
| EP18 | Recipes: Moon 4, Planet 8, Halo 5; the Lapidary 120 · 138 · 156 an Uma |
| EP19 | The Observatory: one page in every tier |
| EP20 | Targets and "can upgrade" |
| EP21 | Old maps and Star Gems deleted, raw items refunded |
| EP22 | Names and art: today's gem icons |

**4. Profession Progression**: 23 calls, PP1–PP23. [profession-progression.md](profession-progression.md); pages:
map, materials, flow, demand.

| Call | One line |
|---|---|
| PP1 | Three kinds of work: five gathering, one processing, four making |
| PP2 | The trade: her calling's gathering and crafting pair, one Craft Level |
| PP3 | The pairings: Mine · Forge, Forest · Armorer, Fields · Workbench, Fishery · Charm Shop, Monster Den · Lapidary |
| PP4 | One existing building a profession, four slots, ×1.25, no upgrades |
| PP5 | The same map in every tier |
| PP6 | Reuse only: ten frames, sixty icons, no new art |
| PP7 | Five material lines, a low and a high type a tier: 2 · 4 · 6 a profession |
| PP8 | The catalog's order: each tier's pair above the last |
| PP9 | The ladder: a grade decides its material |
| PP10 | One fixed recipe an item; the Branch Gem the G5 Weapon Gem (4) |
| PP11 | Amounts don't scale with the tier: 485 · 503 · 521 |
| PP12 | Make time: one gather a refined item |
| PP13 | Gates at Craft Lv 1 and 26 in every pair; Craft Level restarts each tier |
| PP14 | The secondary from Tier 2: any other profession's base work |
| PP15 | The tier's own pair stays the main trade's |
| PP16 | The open shop: a trade with no Uma opens to all |
| PP17 | The Exchange by pair, prices × tier |
| PP18 | Today's second-profession proposal replaced |
| PP19 | Old saves: stock converted, work collected, Craft Level kept |
| PP20 | The refund paid in Tier 1's demand mix |
| PP21 | The Stable's Trade filter |
| PP22 | Pages, pickers and targets per place |
| PP23 | Promotion: materials stay in the old world; Craft Level 1 |

**In all: 122 calls** (Class 43, Weapon 34, Extra Stats 22, Profession 23), and the frame's. The Uma Templates pass
(variance.md's U1–U16) follows the balancing. Nothing is left for the owner to settle outside these reviews.
