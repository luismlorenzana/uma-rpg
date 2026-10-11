# Kitchen and Extra Stats

> **Status: current (S6, 2026-10-10; D58).** Numbers in [pacing.md](pacing.md). Code:
> `packages/domain/src/economy/dishes.ts` (catalog, map), `economy/bonus.ts` (points in battle), `save/kitchen.ts`.

## Dishes

Every dish is generated from the item catalog, farming side only:

| Kind | Count | Recipe | Feeds |
|---|---|---|---|
| Planet dish | 80: one per farming family per grade ("Apple Tart", "Wheat Bread") | 2 of the family's refined item of that grade, plus 1–3 sides (grade ⌈g/2⌉ refined items of other families, rotating so every family is used) | Its family's planet |
| Duo dish | 16: one per bridge, at grades 3 and 7 ("Grain & Garden Platter") | 2 + 2 refined items of both families, plus 1 side | Its bridge |
| Feast | 4: grades 4, 6, 8, 10 | one refined item of every farming family | The Sun |

Cooking is a Kitchen job: Farm Level, three items' time per dish, the recipe reserved at the start, grade k at
Lv `5k − 4`. Dishes go on their own shelf in the Warehouse.

## The Sun-and-planets map (design §10)

- 100 nodes per Uma per tier: 8 planets × 10 moons, 8 bridges × 2, the Sun × 4. The ring runs HP – DEF – M.DEF – MP –
  M.ATK – ATK – Speed – Limit Break charge.
- **Eating a dish unlocks the lowest locked node it can reach**: moon k needs a grade-k planet dish, bridge nodes need
  grade-3 and grade-7 Duo dishes, the Sun's four need Feasts of grade 4, 6, 8 and 10. A dish with nothing new for her
  can't be eaten (feed it to someone else).
- **Active nodes**: `5 + ⌊level / 2⌋` at once, toggled freely outside fights on the Observatory's map. A new node
  switches on by itself while a slot is free.
- **Points**: a moon gives 1 to its effect, a bridge ½ to each of its pair, a Sun node ⅛ to all eight. A point is
  1.5% of HP, MP, ATK, M.ATK, DEF or M.DEF; 0.6% evasion for Speed; a 0.4-charge Limit Break head start.

## In battle

A fight starts with each Uma's stats raised by her points; Speed becomes **evasion** (a share of every hit avoided, at
most half) and Limit Break charge fills her gauge before the first turn. Both are optional engine inputs, so older
fights still replay.
