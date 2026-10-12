# Kitchen and Extra Stats

> **Status: built, D58, D65 and D67, 2026-10-12.** The generated
> [dish catalog](../game/materials.md#dishes) is the recipe reference.
> Code: `economy/dishes.ts`, `economy/bonus.ts`, `save/kitchen.ts`.

## Dishes

| Kind | Count | Recipe structure (D65, D67) |
|---|---|---|
| Planet | Eight families × ten grades | One refined star; one half-grade side from grade 4 and a second from grade 8; one Cooking Token |
| Duo | Eight bridges × grades 3 and 7 | One refined item and one Cooking Token per paired stat; one half-grade side at grade 7 |
| Feast | Grades 4, 6, 8 and 10 | One refined item and one Cooking Token for each of eight stats |

The star sets the effect and grade; rotating sides preserve equal demand across farming families
(`materials.test.ts`, D86).
Cooking is a Farm Level job at the Kitchen. Grade k needs Lv 5k − 4; each dish takes two items' base time (D65).
Ingredients and tokens are reserved on start. Completed dishes go to their Warehouse shelf (D55).

## The Sun-and-planets map

Each Uma has one 100-node map per tier: eighty moons, sixteen bridge nodes and four Sun nodes (D58).
Eating uses a dish and opens the lowest locked node it reaches; a dish that reaches no new node cannot be eaten.
A newly unlocked node activates while capacity remains.
The active limit is 5 + ⌊Uma Level / 2⌋, with free swaps outside a fight.

A moon gives one point to its effect, a bridge half to each neighboring effect and a Sun node one eighth to all.
The points' values, ring order, node gates and battle bonuses are in
[Extra Stats](../game/loops.md#extra-stats-and-gear).
Profession EXP and times are shared with the Forge, but recipes need not have the same ingredient count (D65, D86).
