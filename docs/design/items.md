# Item catalog (draft v0.1)

> **Status: draft for owner review, 2026-10-10.** The raw and refined items of Tier 1 (game design §8). Dishes and
> gear get their own catalogs.

## Rules

- **Eight effects, two sides.** Each effect has one farming family and one gathering family, and each family has its
  own Hub site (D18, D20).
- **Ten grades per family.** Grade k unlocks at the matching profession **Lv 5k − 4**. The ladder is the same in every
  family:

  | Grade | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 |
  |---|---|---|---|---|---|---|---|---|---|---|
  | Profession Lv | 1 | 6 | 11 | 16 | 21 | 26 | 31 | 36 | 41 | 46 |

- **Grades 1–8** run from common to rare. **Grades 9–10 are legendary** in every family, and their icons carry glints
  (D24).
- **Refining is 1 → 1** (D19): every raw item has exactly one refined form of the same grade. Farming refines at the
  Pantry, and gathering refines at the Workbench.
- **Totals:** 80 raw ingredients, 80 raw materials, 80 + 80 refined.
- **Ids** are the name in kebab case: lowercase, apostrophes dropped, accents folded, spaces as hyphens (`golden-apple`,
  `tomato-puree`, `cut-philosophers-stone`).
- **Icons** are 32×32 original pixel art, drawn by uma-platform's `scripts/pixel-art` into its
  `assets/items/<family>/<id>.png` (D26).
  Drawn so far: Fruits and Ores.

| Effect | Farming family | Site | Gathering family | Site |
|---|---|---|---|---|
| HP | [Grains](#grains) | Fields | [Hides & Scales](#hides--scales) | Monster Den |
| MP | [Fruits](#fruits) | Orchard | [Essences](#essences) | Ley Spring |
| ATK | [Fish](#fish) | Fishery | [Ores](#ores) | Mine |
| M.ATK | [Herbs & Spices](#herbs--spices) | Herb Garden | [Crystals](#crystals) | Crystal Cavern |
| DEF | [Vegetables](#vegetables) | Vegetable Garden | [Stones](#stones) | Quarry |
| M.DEF | [Mushrooms](#mushrooms) | Mushroom Cave | [Fibers](#fibers) | Meadow |
| Speed | [Sweets](#sweets) | Sugar Grove | [Woods](#woods) | Forest |
| Limit Break charge | [Nuts & Seeds](#nuts--seeds) | Nut Grove | [Bones & Horns](#bones--horns) | Fossil Dig |

## Farming

### Grains

| Grade | Raw | Refined |
|---|---|---|
| 1 | Wheat | Wheat Flour |
| 2 | Oats | Rolled Oats |
| 3 | Barley | Pearl Barley |
| 4 | Rice | Polished Rice |
| 5 | Corn | Cornmeal |
| 6 | Rye | Rye Flour |
| 7 | Buckwheat | Buckwheat Flour |
| 8 | Wild Rice | Hulled Wild Rice |
| 9 | Moonrice | Moonrice Flour |
| 10 | Sunwheat | Sunwheat Flour |

### Fruits

| Grade | Raw | Refined |
|---|---|---|
| 1 | Apple | Apple Preserve |
| 2 | Pear | Pear Preserve |
| 3 | Peach | Peach Preserve |
| 4 | Plum | Plum Preserve |
| 5 | Orange | Orange Marmalade |
| 6 | Grape | Grape Jelly |
| 7 | Mango | Mango Pulp |
| 8 | Pomegranate | Pomegranate Molasses |
| 9 | Starpeach | Starpeach Nectar |
| 10 | Golden Apple | Golden Apple Preserve |

### Fish

| Grade | Raw | Refined |
|---|---|---|
| 1 | Carp | Carp Fillet |
| 2 | Trout | Trout Fillet |
| 3 | Sardine | Sardine Fillet |
| 4 | Mackerel | Mackerel Fillet |
| 5 | Salmon | Salmon Fillet |
| 6 | Sea Bream | Sea Bream Fillet |
| 7 | Eel | Eel Fillet |
| 8 | Tuna | Tuna Fillet |
| 9 | Silverfin | Silverfin Fillet |
| 10 | Rainbow Koi | Rainbow Koi Fillet |

### Herbs & Spices

| Grade | Raw | Refined |
|---|---|---|
| 1 | Basil | Dried Basil |
| 2 | Mint | Dried Mint |
| 3 | Rosemary | Dried Rosemary |
| 4 | Thyme | Dried Thyme |
| 5 | Ginger | Ground Ginger |
| 6 | Peppercorn | Ground Pepper |
| 7 | Cinnamon | Ground Cinnamon |
| 8 | Saffron | Saffron Threads |
| 9 | Mandrake | Mandrake Powder |
| 10 | Phoenix Pepper | Phoenix Spice |

### Vegetables

| Grade | Raw | Refined |
|---|---|---|
| 1 | Carrot | Chopped Carrot |
| 2 | Potato | Diced Potato |
| 3 | Cabbage | Shredded Cabbage |
| 4 | Onion | Diced Onion |
| 5 | Tomato | Tomato Purée |
| 6 | Bell Pepper | Sliced Bell Pepper |
| 7 | Eggplant | Sliced Eggplant |
| 8 | Asparagus | Trimmed Asparagus |
| 9 | Golden Carrot | Golden Carrot Purée |
| 10 | Emperor Pumpkin | Pumpkin Purée |

### Mushrooms

| Grade | Raw | Refined |
|---|---|---|
| 1 | Button Mushroom | Dried Button Mushroom |
| 2 | Shiitake | Dried Shiitake |
| 3 | Oyster Mushroom | Dried Oyster Mushroom |
| 4 | Enoki | Dried Enoki |
| 5 | Chanterelle | Dried Chanterelle |
| 6 | Porcini | Dried Porcini |
| 7 | Morel | Dried Morel |
| 8 | Truffle | Shaved Truffle |
| 9 | Glowcap | Glowcap Powder |
| 10 | King Reishi | Reishi Powder |

### Sweets

| Grade | Raw | Refined |
|---|---|---|
| 1 | Honeycomb | Honey |
| 2 | Sugarcane | Cane Sugar |
| 3 | Sugar Beet | Beet Sugar |
| 4 | Maple Sap | Maple Syrup |
| 5 | Cacao Pod | Chocolate |
| 6 | Vanilla Pod | Vanilla Extract |
| 7 | Agave Heart | Agave Syrup |
| 8 | Palm Sap | Palm Sugar |
| 9 | Fairy Honeycomb | Fairy Honey |
| 10 | Ambrosia Blossom | Ambrosia |

### Nuts & Seeds

| Grade | Raw | Refined |
|---|---|---|
| 1 | Peanut | Peanut Butter |
| 2 | Sunflower Seed | Sunflower Oil |
| 3 | Sesame | Sesame Paste |
| 4 | Walnut | Walnut Paste |
| 5 | Chestnut | Chestnut Paste |
| 6 | Almond | Almond Paste |
| 7 | Pistachio | Pistachio Paste |
| 8 | Macadamia | Macadamia Butter |
| 9 | Thundernut | Thundernut Oil |
| 10 | Worldseed | Worldseed Oil |

## Gathering

### Hides & Scales

Gathered from the monsters of the Monster Den. No real animals are hunted.

| Grade | Raw | Refined |
|---|---|---|
| 1 | Puffbun Pelt | Puffbun Leather |
| 2 | Boarling Hide | Boarling Leather |
| 3 | Wolfkin Pelt | Wolfkin Leather |
| 4 | Rock Lizard Scale | Lizard Leather |
| 5 | Ironback Hide | Ironback Leather |
| 6 | Basilisk Scale | Basilisk Leather |
| 7 | Manticore Hide | Manticore Leather |
| 8 | Behemoth Hide | Behemoth Leather |
| 9 | Wyvern Scale | Wyvern Leather |
| 10 | Dragon Scale | Dragonhide |

### Essences

| Grade | Raw | Refined |
|---|---|---|
| 1 | Mist Essence | Mist Infusion |
| 2 | Dew Essence | Dew Infusion |
| 3 | Breeze Essence | Breeze Infusion |
| 4 | Ember Essence | Ember Infusion |
| 5 | Tide Essence | Tide Infusion |
| 6 | Spark Essence | Spark Infusion |
| 7 | Glimmer Essence | Glimmer Infusion |
| 8 | Shadow Essence | Shadow Infusion |
| 9 | Aether | Aether Infusion |
| 10 | Prismatic Essence | Prismatic Infusion |

### Ores

| Grade | Raw | Refined |
|---|---|---|
| 1 | Copper Ore | Copper Ingot |
| 2 | Tin Ore | Tin Ingot |
| 3 | Iron Ore | Iron Ingot |
| 4 | Silver Ore | Silver Ingot |
| 5 | Cobalt Ore | Cobalt Ingot |
| 6 | Gold Ore | Gold Ingot |
| 7 | Platinum Ore | Platinum Ingot |
| 8 | Titanium Ore | Titanium Ingot |
| 9 | Mythril Ore | Mythril Ingot |
| 10 | Orichalcum Ore | Orichalcum Ingot |

### Crystals

| Grade | Raw | Refined |
|---|---|---|
| 1 | Quartz | Cut Quartz |
| 2 | Amethyst | Cut Amethyst |
| 3 | Citrine | Cut Citrine |
| 4 | Garnet | Cut Garnet |
| 5 | Emerald | Cut Emerald |
| 6 | Sapphire | Cut Sapphire |
| 7 | Ruby | Cut Ruby |
| 8 | Diamond | Cut Diamond |
| 9 | Starstone | Cut Starstone |
| 10 | Philosopher's Stone | Cut Philosopher's Stone |

### Stones

| Grade | Raw | Refined |
|---|---|---|
| 1 | Limestone | Limestone Block |
| 2 | Sandstone | Sandstone Block |
| 3 | Slate | Slate Block |
| 4 | Granite | Granite Block |
| 5 | Basalt | Basalt Block |
| 6 | Marble | Marble Block |
| 7 | Obsidian | Obsidian Block |
| 8 | Jade | Jade Block |
| 9 | Runestone | Runestone Block |
| 10 | Meteorite | Meteorite Block |

### Fibers

| Grade | Raw | Refined |
|---|---|---|
| 1 | Flax | Linen |
| 2 | Jute | Burlap |
| 3 | Hemp | Hemp Cloth |
| 4 | Cotton | Cotton Cloth |
| 5 | Wool | Wool Cloth |
| 6 | Alpaca Fleece | Alpaca Cloth |
| 7 | Cashmere Fleece | Cashmere Cloth |
| 8 | Silk Cocoon | Silk |
| 9 | Moonsilk Cocoon | Moonsilk |
| 10 | Cloudfleece | Cloudweave |

### Woods

| Grade | Raw | Refined |
|---|---|---|
| 1 | Pine Log | Pine Plank |
| 2 | Birch Log | Birch Plank |
| 3 | Cedar Log | Cedar Plank |
| 4 | Maple Log | Maple Plank |
| 5 | Oak Log | Oak Plank |
| 6 | Cherry Log | Cherry Plank |
| 7 | Mahogany Log | Mahogany Plank |
| 8 | Ebony Log | Ebony Plank |
| 9 | Elderwood Log | Elderwood Plank |
| 10 | Yggdrasil Branch | Yggdrasil Plank |

### Bones & Horns

Dug up as fossils at the Fossil Dig. No animals are hunted.

| Grade | Raw | Refined |
|---|---|---|
| 1 | Seashell | Shell Carving |
| 2 | Ammonite | Ammonite Carving |
| 3 | Trilobite | Trilobite Carving |
| 4 | Fossil Bone | Bone Carving |
| 5 | Mammoth Tusk | Tusk Carving |
| 6 | Saber Fang | Fang Carving |
| 7 | Raptor Claw | Claw Carving |
| 8 | Tyrant Tooth | Tooth Carving |
| 9 | Titan Bone | Titan Carving |
| 10 | Unicorn Horn | Unicorn Carving |
