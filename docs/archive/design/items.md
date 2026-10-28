# Item catalog (v2.0, 2026-10-16)

> **Status: built, through D144.** The [materials manual](../../game/materials.md) generates every family, item, Star
> Gem and gear recipe from code (D92). This page explains the catalog's structure and symmetry, without copying its
> 160 item rows. D144 removed the eight farm families; uma-racer owns the farm now.

## Rules

- Eight families, one per effect, each with one Wilds site (D18–D20, D144).
- Ten grades each. Grade k opens at Craft Lv 5k − 4 (D54).
- One raw item refines into one same-grade partner at the Workbench (D19).
- Totals: 80 raw materials and 80 refined items.
- Grades 9–10 are legendary and carry glints (D24).
- Ids are explicit stable keys in `items/families.ts`, not ids inferred at runtime from a display name.
- All item icons are drawn from code in uma-platform and bundled in `@luismlorenzana/uma-art` (D26, D64). The atlas
  keeps sixteen rows of uma-racer's families ahead of these.
- Craft Level takes weeks per Uma; many workers progress in parallel (D96).

The live [family/site table](../../game/materials.md#families) and
[item rows](../../game/materials.md#items-by-family) are the catalog. The grade ladder and timers are generated there,
so the design has no second list to drift.

## Family links

These headings retain the original catalog's link targets. Names, ids, effects, sites and all raw/refined grades
are in the linked generated rows.

### Hides & Scales

[Hides & Scales](../../game/materials.md#hides--scales-hides-scales-hp-monster-den): HP; monsters, not hunted animals.

### Essences

[Essences](../../game/materials.md#essences-essences-mp-ley-spring): MP.

### Ores

[Ores](../../game/materials.md#ores-ores-atk-mine): ATK.

### Crystals

[Crystals](../../game/materials.md#crystals-crystals-matk-crystal-cavern): M.ATK.

### Stones

[Stones](../../game/materials.md#stones-stones-def-quarry): DEF.

### Fibers

[Fibers](../../game/materials.md#fibers-fibers-mdef-meadow): M.DEF.

### Woods

[Woods](../../game/materials.md#woods-woods-speed-forest): Speed.

### Bones & Horns

[Bones & Horns](../../game/materials.md#bones--horns-bones-horns-limit-break-charge-fossil-dig): Limit; fossils, not hunted animals.

## Gear recipes

Every piece takes **two refined items of its own grade**, from one of four family pairs that rotate with the grade
(D125, D139): Ores + Crystals, Woods + Essences, Hides & Scales + Bones & Horns, Stones + Fibers. No token is spent
(D94, D105). Craft Level gates the grade made; the matching rank the grade worn. The exact type/family table is
generated in [gear](../../game/materials.md#gear).

## Star Gems and symmetry

Star Gems (D144) take the recipes the farm's dishes had (D65), on the Wilds family of each stat: one star item of the
gem's grade, rotating half-grade sides from grade 4, two-family bridge gems and eight-family Sun gems. Full recipes are
in [the Star Gem catalog](../../game/materials.md#star-gems).

Each site's output rate depends on grade, not family, and every job pays the same Craft EXP per minute (D65, D96).
Every family is consumed equally across the whole Star Gem catalog (29 refined items each for one Uma's map) and
about equally across any Uma's gear (D86, D139). Symmetry means catalog coverage, not equal demand in every player's
inventory.
