# Gear symmetry and the targets planner

> **Status: built 2026-10-14 (D124–D126).** Replaces D103's accented armor and single accessory slot, and D100/D119's
> targets arithmetic. The game manual (`docs/game/`) carries the result; this page keeps the reasoning.

**Art (H28):** uma-art 2.5.0 supplies dedicated ten-grade rows for Boots, Slippers and all ten defensive accessories.
The game no longer borrows Greaves, Leggings, Charm or Ring art for them. No gear/save/balance rule changes.

## 1. Gear: 10 weapons, 10 armor pieces, 20 accessories

The owner's rule is symmetry: every list is five physical and five magical.

### 1.1 Armor (D124)

Five armor slots, each holding its physical or its magical piece. **No accent:** a piece's stats are fixed, so each
grade has one piece instead of eight.

| Slot | Physical | Magical | Defensive stat, +1 a grade |
|---|---|---|---|
| Head | Helm | Circlet | DEF |
| Body | Cuirass | Robe | HP (+5 HP a point) |
| Legs | Greaves | Leggings | MP |
| Arms | Gauntlets | Bracers | M.DEF |
| Feet | **Boots** (new) | **Slippers** (new) | Speed (evasion, 0.6% a point) |

- **Offense:** every physical piece adds **ATK**, every magical piece **M.ATK**, +1 every two grades (⌈g/2⌉, 5 at G10).
  That's what an ATK accent added before, so full armor keeps D104's share of offense. Five pieces at G10 add +25.
- **Barrier and Regen leave armor;** they become accessories (§1.2).
- **Armor Rank** stays per armor kind, ten kinds. On the save change, Boots start at her Greaves rank and Slippers at
  her Leggings rank, so the new slot doesn't start from nothing.

### 1.2 Accessories (D124)

Accessories are their own category, not an armor slot. **An Uma wears two, of different types.** Each is one of 20 types
in four kinds:

| Kind | Focus | The five types and what each does at grade g |
|---|---|---|
| **Arms Orb** | Offense, physical | Greatsword, Axe, Lance, Bow, Katana: adds its kind to every hit, for weaknesses only (as before) |
| **Elemental Orb** | Offense, magical | Fire, Ice, Lightning, Light, Dark: the same, for elements |
| **Talisman** | Defense, physical | **Vital:** heals g HP each round. **Vampire:** heals 0.5% × g of the physical damage she deals. **Bulwark:** a 5 × g shield against physical damage at the start of each fight. **Iron:** takes 0.5% × g less physical damage. **Thorn:** returns 1% × g of the physical damage she takes |
| **Amulet** | Defense, magical | **Spring:** restores ⌈g/2⌉ MP each round. **Siphon:** restores MP equal to 0.2% × g of the magical damage she deals. **Veil:** a 5 × g shield against magical damage. **Ward:** takes 0.5% × g less magical damage. **Mirror:** returns 1% × g of the magical damage she takes |

- Every value is small: at G10 an accessory is worth about one armor piece's defensive stat.
- New mechanics: MP Regen, Lifesteal, MP Steal, magical shields, damage cuts and reflection.
- **Accessory Rank** is per kind (four tracks) and gates the grade worn, as Armor Rank does. Each won fight gives E to
  the kind of each accessory she wears. Her old Arms Orb and Elemental Orb ranks carry over.
- Each accessory **type** is its own track for binding grades in order (D119), as each Orb was.
- Engine v11 carries the two Orbs' kinds and the eight new effects; older fights replay unchanged.

### 1.3 Recipes and material balance (D125)

Maxing one Uma must cost about as much in base materials for gear as for her Extra Stats:
- **Extra Stats:** the 100 nodes take 232 refined items, so 232 raw (dishes then, Star Gems since D144).
- **Gear, before:** 12 tracks (5 weapons, 5 armor, 2 accessories) × 10 grades × 4 refined each = 480 raw. Twice as
  much.
- **Gear, now:** a piece takes **2 refined items** of its grade from its half: 120 pieces × 2 = **240 raw**, level with
  Extra Stats.

Which two families each group takes, so every family is used at every grade:

**Superseded by D139:** the pairs below no longer follow a type's group. A type's grades now walk through four
cross-half pairs (Ores + Crystals, Woods + Essences, Hides & Scales + Bones & Horns, Stones + Fibers), so every Uma's
gear uses all eight Wilds families about equally ([materials](../game/materials.md#gear)).

| Group | Physical (Arms half) | Magical (Arcana half) |
|---|---|---|
| Weapons | Ores + Woods | Crystals + Essences |
| Armor | Hides & Scales + Stones | Bones & Horns + Fibers |
| Accessories | Ores + Stones | Crystals + Fibers |

Queued Forge jobs re-cost to the new recipe. Running ones keep what they already took.

### 1.4 The save change (v20)

- **Armor ids lose their accent** (`helm-g3-atk` → `helm-g3`). An Uma who ends up with two of the same piece keeps
  one; the stock adds duplicates together.
- **Slots:** `accessory` becomes `accessory-1`; there is a new `feet` slot and an empty `accessory-2`.
- **Ranks:** `ranks.armors` loses the two Orb kinds, which move to `ranks.accessories`. Boots and Slippers are seeded
  from her Greaves and Leggings ranks.
- **Forge jobs:** outputs are renamed the same way.

### 1.5 Small fix

**A slot's Training piece (G0) only shows on a track she hasn't bound a G1 on yet.**

## 2. The targets planner (D126)

### 2.1 What the owner expects

Flag an Uma, and:
- **The Forge** lists every piece she still needs on every track she uses, all the way to grade 10:
  - her class's five weapons;
  - her five armor slots' kinds;
  - her two accessories.
- **The Lapidary** lists every Star Gem her Extra Stats still need (D144; the Kitchen's dishes before).
- **Each line shows the total her targets need.** It stays until the Warehouse holds that many, then disappears.
- **The Workbench** lists the refined items those lines still need; **the sites** list the raw items those need.
- **Cascade:** when anything above is covered (in stock, being made, bound or set), everything below it for that
  line drops too.
- **More targets** add up.

### 2.2 What went wrong before

1. **Gear stopped at her current rank** (D100: "the grade she can wear now"), so early lists were short.
2. **Queued jobs' inputs counted as free stock.** A queued job takes its inputs when it starts, so raw or refined items
   earmarked for it still sat in the Warehouse, hid the lines that needed them, and made lists come up short.
3. **A line vanished when a job was running for it**, before the items reached the Warehouse.

### 2.3 How it works now: material requirements planning

The planner is the standard MRP netting pass, split into two layers:
- a **generic engine** (`economy/requirements.ts`) that knows nothing of Umas;
- a **demand layer** (`save/targets.ts`) that turns targets into end products.

```text
targets ─▶ demand (pieces, gems) ─▶ requirements engine ─▶ per item: gross, on hand, coming, net
                                          ▲ recipes (piece/gem → refined, refined → raw)
                                          ▲ supply from jobs: coming outputs, inputs held for queued jobs
```

**For every item, top level first:**
- `gross`: what the targets need. End products come from the demand; lower items from their parents' `net`, times
  the recipe.
- `on hand`: the Warehouse count minus what queued jobs hold for themselves.
- `coming`: what running and queued jobs will still make. A queued job counts only if its inputs are on hand.
- `net = max(0, gross − on hand − coming)`: what still has to be started. This, not `gross`, flows down to the
  materials, which is why everything below a covered line disappears.

**What a facility shows:**
- Every item it makes whose `gross` is above `on hand`, with need, have and coming.
- A line goes away when the Warehouse covers it.
- "Start" fills the shortfall (`net`); a line fully covered by jobs says so and offers nothing to start.

**Demand per target:**
- **Gear:** every grade above the best she has bound on each track, up to 10:
  - her class's five weapons;
  - each armor slot's current kind;
  - each accessory slot's type (an empty accessory slot plans nothing: there's no way to know which she wants).
- **Star Gems:** the gem of every Extra Stats node she hasn't opened (D119 order, D144).

**Cost:** a few hundred map operations per render, pure and memoised per world.
