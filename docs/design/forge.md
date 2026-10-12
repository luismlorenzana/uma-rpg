# Forge and equipment

> **Status: built, D86 and D94, 2026-10-12.** Exact types, recipes and points are generated in
> [the materials manual](../game/materials.md#gear). Code: `economy/gear.ts`, `save/forge.ts`.

## Pieces and recipes

Any type × grade × accent exists; ids are `<type>-g<grade>-<accent>`.
There are ten weapons, four armor types, Ring, Charm and ten Orbs (D86).
The grade's first recipe family names the piece; the accent chooses its extra stat effect.

Each piece takes **four same-grade refined items**, one per recipe family, and **no token** (D94).
Arms and Arms Orbs take Ores, Stones, Woods and Hides & Scales.
Tomes and Elemental Orbs take Crystals, Fibers, Essences and Bones & Horns.
Armor and stat accessories take two families from each half (D86).
[Items](items.md#gear-recipes) explains the catalog-wide symmetry; the manual generates the complete recipe table.

Crafting uses Craft Level and the Forge's slots. Grade k needs Lv 5k − 4.
One output takes two items' base time, not the earlier three (D65).
A job reserves inputs on start; collect grants completed pieces, and recall refunds unmade inputs (D55).
Mastery Tokens never gate a Forge recipe (D94).

## Wearing it

- The class uses five weapons, one armor and one accessory (D86). Stored equipment is keyed by each of ten weapon
  types plus armor/accessory; switching class changes which five weapon pieces contribute.
- Equipping from stock binds the piece to her locker permanently. She may swap her own pieces; bound gear cannot
  move to another Uma or be sold (D28, D59).
- Grade k requires the matching gear level ≥ k, with no Uma-level gate (D29, D70).
  Weapons use the highest Weapon Level among classes that wield that type (`gearLevel`); armor and accessories
  use their own levels. All level-ups spend Mastery Tokens (D94).
- Each class slot holds a weapon, and the weapon opens its tree (D98). A slot holds the grade-0 Training weapon of its
  kind until a crafted piece of that kind is worn; one sheet (`holdWeapon`) sets both the weapon and the piece.

## Points and Orbs

Weapon offense is split over the five active weapon slots: ATK for Arms, M.ATK for Tomes (D86).
Armor trades lighter Speed/evasion for heavier defense or HP. Ring/Charm accents have double an Orb's weight;
an Orb also adds one kind to every hit for weakness checks, never extra damage (D86).
Any class may wear any Orb; its kind can overlap an existing weapon.

Exact point tables are generated in [gear](../game/materials.md#gear) and explained in
[combat](../game/combat.md#damage). There is no distance-by-gear-type mastery system anymore (D70).
