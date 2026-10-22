# The Tier rework: the brief

> **Definition, 2026-10-22. Nothing here is built.** The owner paused feature work after classes v2 (H53–H63) to rework
> how every system grows across the tiers: Tier 1 is too complex, and the later tiers were getting far more complex
> still. This folder holds one doc and its HTML previews per category, cross-referenced, then reviewed **one category at
> a time** with the owner, decided with no open questions, and shipped as implementation packets.

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

These are **drafts** so the docs can be written in parallel. The cross-reference pass (§5) may change them; a doc that
needs one changed says so in its "Assumes" section instead of silently diverging.

- **Tiers:** 1–3, 50 levels each; one Uma lives in one tier (D159, tiers.md §3); promotion through the Rift stays.
- **Classes:** the six of classes v2 (D160, live since H61): Brawler, Mage, Spell Blade, Summoner, Paladin, Cleric. Their
  identities stay: Brawler all physical, Mage all magical, the hybrids 70/30 each way as a mirror, one healer a party.
- **Five fight types** (for professions and party shapes): **physical** (Brawler), **magical** (Mage), **physical
  hybrid** (Spell Blade), **magical hybrid** (Summoner), **healer** (Paladin or Cleric).
- **The Tier 1 class template** (the owner's numbers): **3 weapons, 5 armor pieces, 1 accessory.** Later tiers add what
  the docs propose. Weapons stay at 3 for good; depth comes from elsewhere.
- **Weapon kinds** stay: five Arms (Greatsword, Axe, Lance, Bow, Katana) and five Tomes (Fire, Ice, Lightning, Light,
  Dark). Armor stays physical or magical per piece.
- **Professions:** five gathering (Farming, Fishing, Mining, Wood Chopping, Gem Hunting) and five crafting (Material
  Processing, Jewel Crafting, Weapon Crafting, Armor Crafting, Accessory Crafting); 4 buildings each on the Wilds map in
  Tier 1 with 2 material types each.
- **Uma Templates** are ours: authored bonuses assigned **by rule** from master data (running style, distance and surface
  aptitudes, read by stable id), never a hand-written list of real Umas.
- **Pacing:** the time to level, the EXP and rewards per fight, and the time to gear an Uma on curve keep today's order
  ([pacing.md](../pacing.md)). A doc that moves one says how it's put back.

## 3. Who owns what

| Doc | Owns | Main interfaces |
|---|---|---|
| [classes.md](classes.md) | Class templates per tier (slots, armor, accessories), default weapon picks, Tier 1 foe weaknesses, the class composition, what class selection affects | Gear (weapon counts), Skill trees (trees per class), Professions (fight type ↔ profession), Variance |
| [gear.md](gear.md) | Weapons (3 a class), their progression per tier and branches, improvement gems, whether weapons carry kinds; armor and accessories progression; armor sets simplified | Classes (slots), Professions (what crafting makes and consumes), Skill trees (where kinds live) |
| [skill-trees.md](skill-trees.md) | The tree shape per tier, what a node costs (the side-node asymmetry fixed), how the profile shows it as a real tree | Classes, Gear, Variance (template-only nodes) |
| [extra-stats.md](extra-stats.md) | Tier 1's single planet and moons, growth per tier, gems | Professions (Jewel Crafting), Variance (template-only nodes) |
| [professions.md](professions.md) | The ten professions, buildings and materials per tier, the secondary profession, the demand math (what one Uma's gear and Extra Stats need), the Wilds map | Gear, Extra Stats, Classes (fight type), pacing |
| [variance.md](variance.md) | Uma Templates: the catalog, the assignment rules, their bonuses, template-only nodes | Classes, Skill trees, Extra Stats |

Every doc: what exists today (short, with links), the proposal **per tier**, a "Provides" and an "Assumes" section,
what existing save data it deletes or converts (for the refund), how pacing holds, and a closing **Decisions** table
where every call has a recommendation. No open questions.

## 4. The previews

- In [`previews/`](previews/), one self-contained HTML file per view, no external scripts, fonts or images; copy the
  style block from [`previews/_template.html`](previews/_template.html) (the game's own colours, light and dark).
- Phone width first (390 px); wide tables scroll inside their own box, never the page.
- **Nothing from the original games:** no real Uma names, skill names or art. Use invented names ("Uma A", "a front
  runner, long distance") and our own words.
- Each category's doc links its previews.

## 5. Cross-reference, then review

1. **Fan-out:** the six docs and their previews, written in parallel from §2.
2. **Cross-reference:** one pass reconciles every doc's "Assumes" against the others' "Provides", fixes the shared
   numbers in §2, and builds the two views that need every category:
   - [`previews/character-tiers.html`](previews/character-tiers.html): the Uma's detail page at Tier 1, 2 and 3;
   - [`previews/progression.html`](previews/progression.html): every category × every tier on one page.
3. **Review, one category at a time** with the owner, in this order: Classes → Gear → Skill trees → Extra Stats →
   Professions → Variance. Each review ends with its decisions logged as D-rows.
4. **Implementation packets** per decided category, with the refund for anything deleted.

## 6. Status

| Doc | State |
|---|---|
| classes.md | Fan-out |
| gear.md | Fan-out |
| skill-trees.md | Fan-out |
| extra-stats.md | Fan-out |
| professions.md | Fan-out |
| variance.md | Fan-out |
| Cross-reference | Waiting |
