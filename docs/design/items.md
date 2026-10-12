# Item catalog (v1.0, 2026-10-12)

> **Status: built, through D96.** The [materials manual](../game/materials.md) generates every family, item, dish,
> gear recipe and token from code (D92). This page explains the catalog's structure and symmetry, without copying
> its 320 item rows.

## Rules

- Eight effects, two sides: each farming family mirrors a gathering family, with one Hub site per family (D18–D20).
- Ten grades each. Grade k opens at profession Lv 5k − 4; both sides share the ladder (D54).
- One raw item refines into one same-grade partner, at Pantry or Workbench (D19).
- Totals: 80 raw ingredients, 80 raw materials, and 160 refined items.
- Grades 9–10 are legendary and carry glints (D24).
- Ids are explicit stable keys in `items/families.ts`, not ids inferred at runtime from a display name.
- All item icons are drawn from code in uma-platform and bundled in `@luismlorenzana/uma-art` (D26, D64).
- Farm and Craft Levels now take weeks per Uma; many workers progress in parallel (D96).

The live [family/site table](../game/materials.md#families) and
[item rows](../game/materials.md#items-by-family) are the catalog. The grade ladder and timers are generated there,
so the design has no second list to drift.

## Family links

These headings retain the original catalog's link targets. Names, ids, effects, sites and all raw/refined grades
are in the linked generated rows.

### Grains

[Grains](../game/materials.md#grains-grains-hp-fields): Farm, HP.

### Fruits

[Fruits](../game/materials.md#fruits-fruits-mp-orchard): Farm, MP.

### Fish

[Fish](../game/materials.md#fish-fish-atk-fishery): Farm, ATK.

### Herbs & Spices

[Herbs & Spices](../game/materials.md#herbs--spices-herbs-spices-matk-herb-garden): Farm, M.ATK.

### Vegetables

[Vegetables](../game/materials.md#vegetables-vegetables-def-vegetable-garden): Farm, DEF.

### Mushrooms

[Mushrooms](../game/materials.md#mushrooms-mushrooms-mdef-mushroom-cave): Farm, M.DEF.

### Sweets

[Sweets](../game/materials.md#sweets-sweets-speed-sugar-grove): Farm, Speed.

### Nuts & Seeds

[Nuts & Seeds](../game/materials.md#nuts--seeds-nuts-seeds-limit-break-charge-nut-grove): Farm, Limit.

### Hides & Scales

[Hides & Scales](../game/materials.md#hides--scales-hides-scales-hp-monster-den): Craft, HP; monsters, not hunted animals.

### Essences

[Essences](../game/materials.md#essences-essences-mp-ley-spring): Craft, MP.

### Ores

[Ores](../game/materials.md#ores-ores-atk-mine): Craft, ATK.

### Crystals

[Crystals](../game/materials.md#crystals-crystals-matk-crystal-cavern): Craft, M.ATK.

### Stones

[Stones](../game/materials.md#stones-stones-def-quarry): Craft, DEF.

### Fibers

[Fibers](../game/materials.md#fibers-fibers-mdef-meadow): Craft, M.DEF.

### Woods

[Woods](../game/materials.md#woods-woods-speed-forest): Craft, Speed.

### Bones & Horns

[Bones & Horns](../game/materials.md#bones--horns-bones-horns-limit-break-charge-fossil-dig): Craft, Limit; fossils, not hunted animals.

## Gear recipes

Every piece takes **four refined items of its own grade**, one per prescribed gathering family (D86).
**No token is spent at the Forge**: D94 supersedes the H12 packet's earlier Crafting Token requirement.
The accent chooses a stat, not a fifth material. Craft Level gates grade; Mastery Tokens raise the levels needed
to wear it. The exact type/family table is generated in [gear](../game/materials.md#gear).

| Half | Families | Makes |
|---|---|---|
| Arms | Ores, Stones, Woods, Hides & Scales | Five Arms and five Arms Orbs |
| Arcana | Crystals, Fibers, Essences, Bones & Horns | Five Tomes and five Elemental Orbs |

Armor and stat accessories take two families from each half. Every family appears in two armor recipes and one
Ring/Charm recipe. Across the ten weapons and ten Orbs, each appears ten times; across all 26 types, thirteen times.
`economy/materials.test.ts` proves this for the current catalog.

## Dishes and symmetry

D65 dishes keep one star ingredient, rotating lower-grade sides, two-family Duos and eight-family Feasts.
Cooking also spends the corresponding Cooking Tokens (D67). Full recipes are in
[the dish catalog](../game/materials.md#dishes) and the [Kitchen design](kitchen.md).

Each site's output rate depends on grade, not family. Both sides use the same gather/refine/make times and
profession EXP (D65, D96). Farming families are consumed equally across the whole dish catalog; gathering
families equally across the gear catalog (D86). Gear and dishes no longer have identical input counts, and a
particular party can favor one recipe half. Symmetry means catalog coverage, not equal demand in every player's
inventory.
