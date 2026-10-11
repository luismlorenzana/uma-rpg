# Forge and equipment

> **Status: current (S7, 2026-10-10; D59).** Numbers in [pacing.md](pacing.md). Code: `packages/domain/src/economy/gear.ts`,
> `src/save/forge.ts`.

## Pieces

Any **type × grade × accent** exists; nothing is stored as a list. A piece's id is `<type>-g<grade>-<accent>`
(`greatsword-g3-atk`), its name the accent's word, its main material and its type ("Fierce Copper Greatsword").

| Main material (sets the type and grade) | Types |
|---|---|
| Ingots (Ores) | Greatsword, Spear, Axe, Short Sword, Mail, Plate |
| Planks (Woods) | Bow, Mage Staff, Arcane Staff, Cleric Staff |
| Cloth (Fibers) | Garb, Summoner Tome |
| Leather (Hides & Scales) | Leather Armor |
| Cut gems (Crystals) | Ring |
| Carvings (Bones & Horns) | Charm |

A recipe is 2 of the main material and 1 of the accent family's refined material, both of the piece's grade, plus 0–2
extras (grade ⌈g/2⌉, rotating through the other gathering families) as grades climb, so a piece uses as many inputs as
a dish of its grade. Crafting is a Forge job: Gathering & Crafting, three items' time, grade k at Lv `5k − 4`.

## Wearing it

- Slots: **one piece per weapon type**, **an armor**, **an accessory**. Her active build uses the pieces for the
  weapons it wields, so switching builds needs no re-equipping.
- **Binding**: equipping a piece from the stock binds it to her for good; it stays in her locker and never moves to
  another Uma. She swaps freely among her own pieces (taking one off keeps it).
- **Mastery**: grade k needs mastery rank k in its type (S5's armories). Accessories need none.

## Points (§7.3)

| Piece | Points |
|---|---|
| Weapon, grade g | ATK g (staves and tomes: M.ATK; the Short Sword half each), split across her build's weapons |
| Garb / Leather / Mail / Plate | DEF, M.DEF and Speed or HP by weight: lighter is faster, heavier sturdier |
| Accessory | its accent only, g points |
| Any accent | ⌈g/2⌉ points of its effect (accessories: g) |

Points join her Extra Stats in every fight. Foes past the first chapter carry the expected gear and Extra Stats too:
+0.35% to every stat per lifetime level above 10 (about +14% at Lv50), so a party that keeps up with both feels like
the tuned curve.
