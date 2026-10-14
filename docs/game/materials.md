# Materials, dishes and gear

Everything an Uma gathers, refines, cooks or crafts. Lists are generated from `packages/domain/src/items/` and
`economy/` (`dishes.ts`, `gear.ts`). There are no tokens (D105). How the jobs work is in
[loops](loops.md#professions).

## Families

Sixteen families on two sides:
- **Farming** (Farmlands page) feeds the Kitchen.
- **Gathering** (Wilds page) feeds the Forge.

Each family feeds one of eight stats, has one site, and has ten grades. Every raw item refines one-for-one into its
refined form, at the Pantry (farming) or the Workbench (gathering), in a quarter of the time it took to gather (D101).

<!-- live:families -->
| Family | Id | Side | Feeds | Site | Refined at |
|---|---|---|---|---|---|
| Grains | `grains` | Farming | HP | Fields | Pantry |
| Fruits | `fruits` | Farming | MP | Orchard | Pantry |
| Fish | `fish` | Farming | ATK | Fishery | Pantry |
| Herbs & Spices | `herbs-spices` | Farming | M.ATK | Herb Garden | Pantry |
| Vegetables | `vegetables` | Farming | DEF | Vegetable Garden | Pantry |
| Mushrooms | `mushrooms` | Farming | M.DEF | Mushroom Cave | Pantry |
| Sweets | `sweets` | Farming | Speed | Sugar Grove | Pantry |
| Nuts & Seeds | `nuts-seeds` | Farming | Limit Break charge | Nut Grove | Pantry |
| Hides & Scales | `hides-scales` | Gathering | HP | Monster Den | Workbench |
| Essences | `essences` | Gathering | MP | Ley Spring | Workbench |
| Ores | `ores` | Gathering | ATK | Mine | Workbench |
| Crystals | `crystals` | Gathering | M.ATK | Crystal Cavern | Workbench |
| Stones | `stones` | Gathering | DEF | Quarry | Workbench |
| Fibers | `fibers` | Gathering | M.DEF | Meadow | Workbench |
| Woods | `woods` | Gathering | Speed | Forest | Workbench |
| Bones & Horns | `bones-horns` | Gathering | Limit Break charge | Fossil Dig | Workbench |
<!-- /live -->

**Symmetry (D86):** every gathering family is used alike by gear, and every farming family alike by dishes, so no site
sits idle and none is a bottleneck. `economy/materials.test.ts` checks it.

## Items by family

<!-- live:items -->
### Grains (`grains`, HP, Fields)

| Grade | Raw | Refined | Unlocks at profession Lv | Minutes to gather one | Minutes to refine one | Minutes to cook or craft at this grade |
|---|---|---|---|---|---|---|
| 1 | Wheat (`wheat`) | Wheat Flour (`wheat-flour`) | 1 | 60 | 15 | 120 |
| 2 | Oats (`oats`) | Rolled Oats (`rolled-oats`) | 6 | 90 | 22.5 | 180 |
| 3 | Barley (`barley`) | Pearl Barley (`pearl-barley`) | 11 | 120 | 30 | 240 |
| 4 | Rice (`rice`) | Polished Rice (`polished-rice`) | 16 | 150 | 37.5 | 300 |
| 5 | Corn (`corn`) | Cornmeal (`cornmeal`) | 21 | 180 | 45 | 360 |
| 6 | Rye (`rye`) | Rye Flour (`rye-flour`) | 26 | 210 | 52.5 | 420 |
| 7 | Buckwheat (`buckwheat`) | Buckwheat Flour (`buckwheat-flour`) | 31 | 240 | 60 | 480 |
| 8 | Wild Rice (`wild-rice`) | Hulled Wild Rice (`hulled-wild-rice`) | 36 | 270 | 67.5 | 540 |
| 9 | Moonrice (`moonrice`) | Moonrice Flour (`moonrice-flour`) | 41 | 300 | 75 | 600 |
| 10 | Sunwheat (`sunwheat`) | Sunwheat Flour (`sunwheat-flour`) | 46 | 330 | 82.5 | 660 |

### Fruits (`fruits`, MP, Orchard)

| Grade | Raw | Refined | Unlocks at profession Lv | Minutes to gather one | Minutes to refine one | Minutes to cook or craft at this grade |
|---|---|---|---|---|---|---|
| 1 | Apple (`apple`) | Apple Preserve (`apple-preserve`) | 1 | 60 | 15 | 120 |
| 2 | Pear (`pear`) | Pear Preserve (`pear-preserve`) | 6 | 90 | 22.5 | 180 |
| 3 | Peach (`peach`) | Peach Preserve (`peach-preserve`) | 11 | 120 | 30 | 240 |
| 4 | Plum (`plum`) | Plum Preserve (`plum-preserve`) | 16 | 150 | 37.5 | 300 |
| 5 | Orange (`orange`) | Orange Marmalade (`orange-marmalade`) | 21 | 180 | 45 | 360 |
| 6 | Grape (`grape`) | Grape Jelly (`grape-jelly`) | 26 | 210 | 52.5 | 420 |
| 7 | Mango (`mango`) | Mango Pulp (`mango-pulp`) | 31 | 240 | 60 | 480 |
| 8 | Pomegranate (`pomegranate`) | Pomegranate Molasses (`pomegranate-molasses`) | 36 | 270 | 67.5 | 540 |
| 9 | Starpeach (`starpeach`) | Starpeach Nectar (`starpeach-nectar`) | 41 | 300 | 75 | 600 |
| 10 | Golden Apple (`golden-apple`) | Golden Apple Preserve (`golden-apple-preserve`) | 46 | 330 | 82.5 | 660 |

### Fish (`fish`, ATK, Fishery)

| Grade | Raw | Refined | Unlocks at profession Lv | Minutes to gather one | Minutes to refine one | Minutes to cook or craft at this grade |
|---|---|---|---|---|---|---|
| 1 | Carp (`carp`) | Carp Fillet (`carp-fillet`) | 1 | 60 | 15 | 120 |
| 2 | Trout (`trout`) | Trout Fillet (`trout-fillet`) | 6 | 90 | 22.5 | 180 |
| 3 | Sardine (`sardine`) | Sardine Fillet (`sardine-fillet`) | 11 | 120 | 30 | 240 |
| 4 | Mackerel (`mackerel`) | Mackerel Fillet (`mackerel-fillet`) | 16 | 150 | 37.5 | 300 |
| 5 | Salmon (`salmon`) | Salmon Fillet (`salmon-fillet`) | 21 | 180 | 45 | 360 |
| 6 | Sea Bream (`sea-bream`) | Sea Bream Fillet (`sea-bream-fillet`) | 26 | 210 | 52.5 | 420 |
| 7 | Eel (`eel`) | Eel Fillet (`eel-fillet`) | 31 | 240 | 60 | 480 |
| 8 | Tuna (`tuna`) | Tuna Fillet (`tuna-fillet`) | 36 | 270 | 67.5 | 540 |
| 9 | Silverfin (`silverfin`) | Silverfin Fillet (`silverfin-fillet`) | 41 | 300 | 75 | 600 |
| 10 | Rainbow Koi (`rainbow-koi`) | Rainbow Koi Fillet (`rainbow-koi-fillet`) | 46 | 330 | 82.5 | 660 |

### Herbs & Spices (`herbs-spices`, M.ATK, Herb Garden)

| Grade | Raw | Refined | Unlocks at profession Lv | Minutes to gather one | Minutes to refine one | Minutes to cook or craft at this grade |
|---|---|---|---|---|---|---|
| 1 | Basil (`basil`) | Dried Basil (`dried-basil`) | 1 | 60 | 15 | 120 |
| 2 | Mint (`mint`) | Dried Mint (`dried-mint`) | 6 | 90 | 22.5 | 180 |
| 3 | Rosemary (`rosemary`) | Dried Rosemary (`dried-rosemary`) | 11 | 120 | 30 | 240 |
| 4 | Thyme (`thyme`) | Dried Thyme (`dried-thyme`) | 16 | 150 | 37.5 | 300 |
| 5 | Ginger (`ginger`) | Ground Ginger (`ground-ginger`) | 21 | 180 | 45 | 360 |
| 6 | Peppercorn (`peppercorn`) | Ground Pepper (`ground-pepper`) | 26 | 210 | 52.5 | 420 |
| 7 | Cinnamon (`cinnamon`) | Ground Cinnamon (`ground-cinnamon`) | 31 | 240 | 60 | 480 |
| 8 | Saffron (`saffron`) | Saffron Threads (`saffron-threads`) | 36 | 270 | 67.5 | 540 |
| 9 | Mandrake (`mandrake`) | Mandrake Powder (`mandrake-powder`) | 41 | 300 | 75 | 600 |
| 10 | Phoenix Pepper (`phoenix-pepper`) | Phoenix Spice (`phoenix-spice`) | 46 | 330 | 82.5 | 660 |

### Vegetables (`vegetables`, DEF, Vegetable Garden)

| Grade | Raw | Refined | Unlocks at profession Lv | Minutes to gather one | Minutes to refine one | Minutes to cook or craft at this grade |
|---|---|---|---|---|---|---|
| 1 | Carrot (`carrot`) | Chopped Carrot (`chopped-carrot`) | 1 | 60 | 15 | 120 |
| 2 | Potato (`potato`) | Diced Potato (`diced-potato`) | 6 | 90 | 22.5 | 180 |
| 3 | Cabbage (`cabbage`) | Shredded Cabbage (`shredded-cabbage`) | 11 | 120 | 30 | 240 |
| 4 | Onion (`onion`) | Diced Onion (`diced-onion`) | 16 | 150 | 37.5 | 300 |
| 5 | Tomato (`tomato`) | Tomato Purée (`tomato-puree`) | 21 | 180 | 45 | 360 |
| 6 | Bell Pepper (`bell-pepper`) | Sliced Bell Pepper (`sliced-bell-pepper`) | 26 | 210 | 52.5 | 420 |
| 7 | Eggplant (`eggplant`) | Sliced Eggplant (`sliced-eggplant`) | 31 | 240 | 60 | 480 |
| 8 | Asparagus (`asparagus`) | Trimmed Asparagus (`trimmed-asparagus`) | 36 | 270 | 67.5 | 540 |
| 9 | Golden Carrot (`golden-carrot`) | Golden Carrot Purée (`golden-carrot-puree`) | 41 | 300 | 75 | 600 |
| 10 | Emperor Pumpkin (`emperor-pumpkin`) | Pumpkin Purée (`pumpkin-puree`) | 46 | 330 | 82.5 | 660 |

### Mushrooms (`mushrooms`, M.DEF, Mushroom Cave)

| Grade | Raw | Refined | Unlocks at profession Lv | Minutes to gather one | Minutes to refine one | Minutes to cook or craft at this grade |
|---|---|---|---|---|---|---|
| 1 | Button Mushroom (`button-mushroom`) | Dried Button Mushroom (`dried-button-mushroom`) | 1 | 60 | 15 | 120 |
| 2 | Shiitake (`shiitake`) | Dried Shiitake (`dried-shiitake`) | 6 | 90 | 22.5 | 180 |
| 3 | Oyster Mushroom (`oyster-mushroom`) | Dried Oyster Mushroom (`dried-oyster-mushroom`) | 11 | 120 | 30 | 240 |
| 4 | Enoki (`enoki`) | Dried Enoki (`dried-enoki`) | 16 | 150 | 37.5 | 300 |
| 5 | Chanterelle (`chanterelle`) | Dried Chanterelle (`dried-chanterelle`) | 21 | 180 | 45 | 360 |
| 6 | Porcini (`porcini`) | Dried Porcini (`dried-porcini`) | 26 | 210 | 52.5 | 420 |
| 7 | Morel (`morel`) | Dried Morel (`dried-morel`) | 31 | 240 | 60 | 480 |
| 8 | Truffle (`truffle`) | Shaved Truffle (`shaved-truffle`) | 36 | 270 | 67.5 | 540 |
| 9 | Glowcap (`glowcap`) | Glowcap Powder (`glowcap-powder`) | 41 | 300 | 75 | 600 |
| 10 | King Reishi (`king-reishi`) | Reishi Powder (`reishi-powder`) | 46 | 330 | 82.5 | 660 |

### Sweets (`sweets`, Speed, Sugar Grove)

| Grade | Raw | Refined | Unlocks at profession Lv | Minutes to gather one | Minutes to refine one | Minutes to cook or craft at this grade |
|---|---|---|---|---|---|---|
| 1 | Honeycomb (`honeycomb`) | Honey (`honey`) | 1 | 60 | 15 | 120 |
| 2 | Sugarcane (`sugarcane`) | Cane Sugar (`cane-sugar`) | 6 | 90 | 22.5 | 180 |
| 3 | Sugar Beet (`sugar-beet`) | Beet Sugar (`beet-sugar`) | 11 | 120 | 30 | 240 |
| 4 | Maple Sap (`maple-sap`) | Maple Syrup (`maple-syrup`) | 16 | 150 | 37.5 | 300 |
| 5 | Cacao Pod (`cacao-pod`) | Chocolate (`chocolate`) | 21 | 180 | 45 | 360 |
| 6 | Vanilla Pod (`vanilla-pod`) | Vanilla Extract (`vanilla-extract`) | 26 | 210 | 52.5 | 420 |
| 7 | Agave Heart (`agave-heart`) | Agave Syrup (`agave-syrup`) | 31 | 240 | 60 | 480 |
| 8 | Palm Sap (`palm-sap`) | Palm Sugar (`palm-sugar`) | 36 | 270 | 67.5 | 540 |
| 9 | Fairy Honeycomb (`fairy-honeycomb`) | Fairy Honey (`fairy-honey`) | 41 | 300 | 75 | 600 |
| 10 | Ambrosia Blossom (`ambrosia-blossom`) | Ambrosia (`ambrosia`) | 46 | 330 | 82.5 | 660 |

### Nuts & Seeds (`nuts-seeds`, Limit Break charge, Nut Grove)

| Grade | Raw | Refined | Unlocks at profession Lv | Minutes to gather one | Minutes to refine one | Minutes to cook or craft at this grade |
|---|---|---|---|---|---|---|
| 1 | Peanut (`peanut`) | Peanut Butter (`peanut-butter`) | 1 | 60 | 15 | 120 |
| 2 | Sunflower Seed (`sunflower-seed`) | Sunflower Oil (`sunflower-oil`) | 6 | 90 | 22.5 | 180 |
| 3 | Sesame (`sesame`) | Sesame Paste (`sesame-paste`) | 11 | 120 | 30 | 240 |
| 4 | Walnut (`walnut`) | Walnut Paste (`walnut-paste`) | 16 | 150 | 37.5 | 300 |
| 5 | Chestnut (`chestnut`) | Chestnut Paste (`chestnut-paste`) | 21 | 180 | 45 | 360 |
| 6 | Almond (`almond`) | Almond Paste (`almond-paste`) | 26 | 210 | 52.5 | 420 |
| 7 | Pistachio (`pistachio`) | Pistachio Paste (`pistachio-paste`) | 31 | 240 | 60 | 480 |
| 8 | Macadamia (`macadamia`) | Macadamia Butter (`macadamia-butter`) | 36 | 270 | 67.5 | 540 |
| 9 | Thundernut (`thundernut`) | Thundernut Oil (`thundernut-oil`) | 41 | 300 | 75 | 600 |
| 10 | Worldseed (`worldseed`) | Worldseed Oil (`worldseed-oil`) | 46 | 330 | 82.5 | 660 |

### Hides & Scales (`hides-scales`, HP, Monster Den)

| Grade | Raw | Refined | Unlocks at profession Lv | Minutes to gather one | Minutes to refine one | Minutes to cook or craft at this grade |
|---|---|---|---|---|---|---|
| 1 | Puffbun Pelt (`puffbun-pelt`) | Puffbun Leather (`puffbun-leather`) | 1 | 60 | 15 | 120 |
| 2 | Boarling Hide (`boarling-hide`) | Boarling Leather (`boarling-leather`) | 6 | 90 | 22.5 | 180 |
| 3 | Wolfkin Pelt (`wolfkin-pelt`) | Wolfkin Leather (`wolfkin-leather`) | 11 | 120 | 30 | 240 |
| 4 | Rock Lizard Scale (`rock-lizard-scale`) | Lizard Leather (`lizard-leather`) | 16 | 150 | 37.5 | 300 |
| 5 | Ironback Hide (`ironback-hide`) | Ironback Leather (`ironback-leather`) | 21 | 180 | 45 | 360 |
| 6 | Basilisk Scale (`basilisk-scale`) | Basilisk Leather (`basilisk-leather`) | 26 | 210 | 52.5 | 420 |
| 7 | Manticore Hide (`manticore-hide`) | Manticore Leather (`manticore-leather`) | 31 | 240 | 60 | 480 |
| 8 | Behemoth Hide (`behemoth-hide`) | Behemoth Leather (`behemoth-leather`) | 36 | 270 | 67.5 | 540 |
| 9 | Wyvern Scale (`wyvern-scale`) | Wyvern Leather (`wyvern-leather`) | 41 | 300 | 75 | 600 |
| 10 | Dragon Scale (`dragon-scale`) | Dragonhide (`dragonhide`) | 46 | 330 | 82.5 | 660 |

### Essences (`essences`, MP, Ley Spring)

| Grade | Raw | Refined | Unlocks at profession Lv | Minutes to gather one | Minutes to refine one | Minutes to cook or craft at this grade |
|---|---|---|---|---|---|---|
| 1 | Mist Essence (`mist-essence`) | Mist Infusion (`mist-infusion`) | 1 | 60 | 15 | 120 |
| 2 | Dew Essence (`dew-essence`) | Dew Infusion (`dew-infusion`) | 6 | 90 | 22.5 | 180 |
| 3 | Breeze Essence (`breeze-essence`) | Breeze Infusion (`breeze-infusion`) | 11 | 120 | 30 | 240 |
| 4 | Ember Essence (`ember-essence`) | Ember Infusion (`ember-infusion`) | 16 | 150 | 37.5 | 300 |
| 5 | Tide Essence (`tide-essence`) | Tide Infusion (`tide-infusion`) | 21 | 180 | 45 | 360 |
| 6 | Spark Essence (`spark-essence`) | Spark Infusion (`spark-infusion`) | 26 | 210 | 52.5 | 420 |
| 7 | Glimmer Essence (`glimmer-essence`) | Glimmer Infusion (`glimmer-infusion`) | 31 | 240 | 60 | 480 |
| 8 | Shadow Essence (`shadow-essence`) | Shadow Infusion (`shadow-infusion`) | 36 | 270 | 67.5 | 540 |
| 9 | Aether (`aether`) | Aether Infusion (`aether-infusion`) | 41 | 300 | 75 | 600 |
| 10 | Prismatic Essence (`prismatic-essence`) | Prismatic Infusion (`prismatic-infusion`) | 46 | 330 | 82.5 | 660 |

### Ores (`ores`, ATK, Mine)

| Grade | Raw | Refined | Unlocks at profession Lv | Minutes to gather one | Minutes to refine one | Minutes to cook or craft at this grade |
|---|---|---|---|---|---|---|
| 1 | Copper Ore (`copper-ore`) | Copper Ingot (`copper-ingot`) | 1 | 60 | 15 | 120 |
| 2 | Tin Ore (`tin-ore`) | Tin Ingot (`tin-ingot`) | 6 | 90 | 22.5 | 180 |
| 3 | Iron Ore (`iron-ore`) | Iron Ingot (`iron-ingot`) | 11 | 120 | 30 | 240 |
| 4 | Silver Ore (`silver-ore`) | Silver Ingot (`silver-ingot`) | 16 | 150 | 37.5 | 300 |
| 5 | Cobalt Ore (`cobalt-ore`) | Cobalt Ingot (`cobalt-ingot`) | 21 | 180 | 45 | 360 |
| 6 | Gold Ore (`gold-ore`) | Gold Ingot (`gold-ingot`) | 26 | 210 | 52.5 | 420 |
| 7 | Platinum Ore (`platinum-ore`) | Platinum Ingot (`platinum-ingot`) | 31 | 240 | 60 | 480 |
| 8 | Titanium Ore (`titanium-ore`) | Titanium Ingot (`titanium-ingot`) | 36 | 270 | 67.5 | 540 |
| 9 | Mythril Ore (`mythril-ore`) | Mythril Ingot (`mythril-ingot`) | 41 | 300 | 75 | 600 |
| 10 | Orichalcum Ore (`orichalcum-ore`) | Orichalcum Ingot (`orichalcum-ingot`) | 46 | 330 | 82.5 | 660 |

### Crystals (`crystals`, M.ATK, Crystal Cavern)

| Grade | Raw | Refined | Unlocks at profession Lv | Minutes to gather one | Minutes to refine one | Minutes to cook or craft at this grade |
|---|---|---|---|---|---|---|
| 1 | Quartz (`quartz`) | Cut Quartz (`cut-quartz`) | 1 | 60 | 15 | 120 |
| 2 | Amethyst (`amethyst`) | Cut Amethyst (`cut-amethyst`) | 6 | 90 | 22.5 | 180 |
| 3 | Citrine (`citrine`) | Cut Citrine (`cut-citrine`) | 11 | 120 | 30 | 240 |
| 4 | Garnet (`garnet`) | Cut Garnet (`cut-garnet`) | 16 | 150 | 37.5 | 300 |
| 5 | Emerald (`emerald`) | Cut Emerald (`cut-emerald`) | 21 | 180 | 45 | 360 |
| 6 | Sapphire (`sapphire`) | Cut Sapphire (`cut-sapphire`) | 26 | 210 | 52.5 | 420 |
| 7 | Ruby (`ruby`) | Cut Ruby (`cut-ruby`) | 31 | 240 | 60 | 480 |
| 8 | Diamond (`diamond`) | Cut Diamond (`cut-diamond`) | 36 | 270 | 67.5 | 540 |
| 9 | Starstone (`starstone`) | Cut Starstone (`cut-starstone`) | 41 | 300 | 75 | 600 |
| 10 | Philosopher's Stone (`philosophers-stone`) | Cut Philosopher's Stone (`cut-philosophers-stone`) | 46 | 330 | 82.5 | 660 |

### Stones (`stones`, DEF, Quarry)

| Grade | Raw | Refined | Unlocks at profession Lv | Minutes to gather one | Minutes to refine one | Minutes to cook or craft at this grade |
|---|---|---|---|---|---|---|
| 1 | Limestone (`limestone`) | Limestone Block (`limestone-block`) | 1 | 60 | 15 | 120 |
| 2 | Sandstone (`sandstone`) | Sandstone Block (`sandstone-block`) | 6 | 90 | 22.5 | 180 |
| 3 | Slate (`slate`) | Slate Block (`slate-block`) | 11 | 120 | 30 | 240 |
| 4 | Granite (`granite`) | Granite Block (`granite-block`) | 16 | 150 | 37.5 | 300 |
| 5 | Basalt (`basalt`) | Basalt Block (`basalt-block`) | 21 | 180 | 45 | 360 |
| 6 | Marble (`marble`) | Marble Block (`marble-block`) | 26 | 210 | 52.5 | 420 |
| 7 | Obsidian (`obsidian`) | Obsidian Block (`obsidian-block`) | 31 | 240 | 60 | 480 |
| 8 | Jade (`jade`) | Jade Block (`jade-block`) | 36 | 270 | 67.5 | 540 |
| 9 | Runestone (`runestone`) | Runestone Block (`runestone-block`) | 41 | 300 | 75 | 600 |
| 10 | Meteorite (`meteorite`) | Meteorite Block (`meteorite-block`) | 46 | 330 | 82.5 | 660 |

### Fibers (`fibers`, M.DEF, Meadow)

| Grade | Raw | Refined | Unlocks at profession Lv | Minutes to gather one | Minutes to refine one | Minutes to cook or craft at this grade |
|---|---|---|---|---|---|---|
| 1 | Flax (`flax`) | Linen (`linen`) | 1 | 60 | 15 | 120 |
| 2 | Jute (`jute`) | Burlap (`burlap`) | 6 | 90 | 22.5 | 180 |
| 3 | Hemp (`hemp`) | Hemp Cloth (`hemp-cloth`) | 11 | 120 | 30 | 240 |
| 4 | Cotton (`cotton`) | Cotton Cloth (`cotton-cloth`) | 16 | 150 | 37.5 | 300 |
| 5 | Wool (`wool`) | Wool Cloth (`wool-cloth`) | 21 | 180 | 45 | 360 |
| 6 | Alpaca Fleece (`alpaca-fleece`) | Alpaca Cloth (`alpaca-cloth`) | 26 | 210 | 52.5 | 420 |
| 7 | Cashmere Fleece (`cashmere-fleece`) | Cashmere Cloth (`cashmere-cloth`) | 31 | 240 | 60 | 480 |
| 8 | Silk Cocoon (`silk-cocoon`) | Silk (`silk`) | 36 | 270 | 67.5 | 540 |
| 9 | Moonsilk Cocoon (`moonsilk-cocoon`) | Moonsilk (`moonsilk`) | 41 | 300 | 75 | 600 |
| 10 | Cloudfleece (`cloudfleece`) | Cloudweave (`cloudweave`) | 46 | 330 | 82.5 | 660 |

### Woods (`woods`, Speed, Forest)

| Grade | Raw | Refined | Unlocks at profession Lv | Minutes to gather one | Minutes to refine one | Minutes to cook or craft at this grade |
|---|---|---|---|---|---|---|
| 1 | Pine Log (`pine-log`) | Pine Plank (`pine-plank`) | 1 | 60 | 15 | 120 |
| 2 | Birch Log (`birch-log`) | Birch Plank (`birch-plank`) | 6 | 90 | 22.5 | 180 |
| 3 | Cedar Log (`cedar-log`) | Cedar Plank (`cedar-plank`) | 11 | 120 | 30 | 240 |
| 4 | Maple Log (`maple-log`) | Maple Plank (`maple-plank`) | 16 | 150 | 37.5 | 300 |
| 5 | Oak Log (`oak-log`) | Oak Plank (`oak-plank`) | 21 | 180 | 45 | 360 |
| 6 | Cherry Log (`cherry-log`) | Cherry Plank (`cherry-plank`) | 26 | 210 | 52.5 | 420 |
| 7 | Mahogany Log (`mahogany-log`) | Mahogany Plank (`mahogany-plank`) | 31 | 240 | 60 | 480 |
| 8 | Ebony Log (`ebony-log`) | Ebony Plank (`ebony-plank`) | 36 | 270 | 67.5 | 540 |
| 9 | Elderwood Log (`elderwood-log`) | Elderwood Plank (`elderwood-plank`) | 41 | 300 | 75 | 600 |
| 10 | Yggdrasil Branch (`yggdrasil-branch`) | Yggdrasil Plank (`yggdrasil-plank`) | 46 | 330 | 82.5 | 660 |

### Bones & Horns (`bones-horns`, Limit Break charge, Fossil Dig)

| Grade | Raw | Refined | Unlocks at profession Lv | Minutes to gather one | Minutes to refine one | Minutes to cook or craft at this grade |
|---|---|---|---|---|---|---|
| 1 | Seashell (`seashell`) | Shell Carving (`shell-carving`) | 1 | 60 | 15 | 120 |
| 2 | Ammonite (`ammonite`) | Ammonite Carving (`ammonite-carving`) | 6 | 90 | 22.5 | 180 |
| 3 | Trilobite (`trilobite`) | Trilobite Carving (`trilobite-carving`) | 11 | 120 | 30 | 240 |
| 4 | Fossil Bone (`fossil-bone`) | Bone Carving (`bone-carving`) | 16 | 150 | 37.5 | 300 |
| 5 | Mammoth Tusk (`mammoth-tusk`) | Tusk Carving (`tusk-carving`) | 21 | 180 | 45 | 360 |
| 6 | Saber Fang (`saber-fang`) | Fang Carving (`fang-carving`) | 26 | 210 | 52.5 | 420 |
| 7 | Raptor Claw (`raptor-claw`) | Claw Carving (`claw-carving`) | 31 | 240 | 60 | 480 |
| 8 | Tyrant Tooth (`tyrant-tooth`) | Tooth Carving (`tooth-carving`) | 36 | 270 | 67.5 | 540 |
| 9 | Titan Bone (`titan-bone`) | Titan Carving (`titan-carving`) | 41 | 300 | 75 | 600 |
| 10 | Unicorn Horn (`unicorn-horn`) | Unicorn Carving (`unicorn-carving`) | 46 | 330 | 82.5 | 660 |
<!-- /live -->

## Dishes

Cooked at the Kitchen from refined farming items only (no token since D105). Eating a dish unlocks nodes on the Uma's
Observatory map, her Extra Stats ([loops](loops.md#extra-stats-and-gear)).

| Kind | What it is |
|---|---|
| **Planet** | One family's dish per grade. It feeds that family's stat |
| **Duo** | A pair of neighboring stats, at grades 3 and 7 |
| **Feast** | All eight stats, at grades 4, 6, 8 and 10 |

From grade 4 on, dishes add side ingredients from other families, so every family stays in demand.

<!-- live:dishes -->
| Dish | Id | Kind | Grade | Feeds | Ingredients |
|---|---|---|---|---|---|
| Wheat Bread | `dish-grains-1` | Planet | 1 | HP | Wheat Flour |
| Oats Bread | `dish-grains-2` | Planet | 2 | HP | Rolled Oats |
| Barley Bread | `dish-grains-3` | Planet | 3 | HP | Pearl Barley |
| Rice Bread | `dish-grains-4` | Planet | 4 | HP | Polished Rice, Pear Preserve |
| Corn Bread | `dish-grains-5` | Planet | 5 | HP | Cornmeal, Peach Preserve |
| Rye Bread | `dish-grains-6` | Planet | 6 | HP | Rye Flour, Peach Preserve |
| Buckwheat Bread | `dish-grains-7` | Planet | 7 | HP | Buckwheat Flour, Plum Preserve |
| Wild Rice Bread | `dish-grains-8` | Planet | 8 | HP | Hulled Wild Rice, Plum Preserve, Dried Thyme |
| Moonrice Bread | `dish-grains-9` | Planet | 9 | HP | Moonrice Flour, Orange Marmalade, Ground Ginger |
| Sunwheat Bread | `dish-grains-10` | Planet | 10 | HP | Sunwheat Flour, Orange Marmalade, Ground Ginger |
| Apple Tart | `dish-fruits-1` | Planet | 1 | MP | Apple Preserve |
| Pear Tart | `dish-fruits-2` | Planet | 2 | MP | Pear Preserve |
| Peach Tart | `dish-fruits-3` | Planet | 3 | MP | Peach Preserve |
| Plum Tart | `dish-fruits-4` | Planet | 4 | MP | Plum Preserve, Trout Fillet |
| Orange Tart | `dish-fruits-5` | Planet | 5 | MP | Orange Marmalade, Sardine Fillet |
| Grape Tart | `dish-fruits-6` | Planet | 6 | MP | Grape Jelly, Sardine Fillet |
| Mango Tart | `dish-fruits-7` | Planet | 7 | MP | Mango Pulp, Mackerel Fillet |
| Pomegranate Tart | `dish-fruits-8` | Planet | 8 | MP | Pomegranate Molasses, Mackerel Fillet, Diced Onion |
| Starpeach Tart | `dish-fruits-9` | Planet | 9 | MP | Starpeach Nectar, Salmon Fillet, Tomato Purée |
| Golden Apple Tart | `dish-fruits-10` | Planet | 10 | MP | Golden Apple Preserve, Salmon Fillet, Tomato Purée |
| Carp Grill | `dish-fish-1` | Planet | 1 | ATK | Carp Fillet |
| Trout Grill | `dish-fish-2` | Planet | 2 | ATK | Trout Fillet |
| Sardine Grill | `dish-fish-3` | Planet | 3 | ATK | Sardine Fillet |
| Mackerel Grill | `dish-fish-4` | Planet | 4 | ATK | Mackerel Fillet, Dried Mint |
| Salmon Grill | `dish-fish-5` | Planet | 5 | ATK | Salmon Fillet, Dried Rosemary |
| Sea Bream Grill | `dish-fish-6` | Planet | 6 | ATK | Sea Bream Fillet, Dried Rosemary |
| Eel Grill | `dish-fish-7` | Planet | 7 | ATK | Eel Fillet, Dried Thyme |
| Tuna Grill | `dish-fish-8` | Planet | 8 | ATK | Tuna Fillet, Dried Thyme, Dried Enoki |
| Silverfin Grill | `dish-fish-9` | Planet | 9 | ATK | Silverfin Fillet, Ground Ginger, Dried Chanterelle |
| Rainbow Koi Grill | `dish-fish-10` | Planet | 10 | ATK | Rainbow Koi Fillet, Ground Ginger, Dried Chanterelle |
| Basil Curry | `dish-herbs-spices-1` | Planet | 1 | M.ATK | Dried Basil |
| Mint Curry | `dish-herbs-spices-2` | Planet | 2 | M.ATK | Dried Mint |
| Rosemary Curry | `dish-herbs-spices-3` | Planet | 3 | M.ATK | Dried Rosemary |
| Thyme Curry | `dish-herbs-spices-4` | Planet | 4 | M.ATK | Dried Thyme, Diced Potato |
| Ginger Curry | `dish-herbs-spices-5` | Planet | 5 | M.ATK | Ground Ginger, Shredded Cabbage |
| Peppercorn Curry | `dish-herbs-spices-6` | Planet | 6 | M.ATK | Ground Pepper, Shredded Cabbage |
| Cinnamon Curry | `dish-herbs-spices-7` | Planet | 7 | M.ATK | Ground Cinnamon, Diced Onion |
| Saffron Curry | `dish-herbs-spices-8` | Planet | 8 | M.ATK | Saffron Threads, Diced Onion, Maple Syrup |
| Mandrake Curry | `dish-herbs-spices-9` | Planet | 9 | M.ATK | Mandrake Powder, Tomato Purée, Chocolate |
| Phoenix Pepper Curry | `dish-herbs-spices-10` | Planet | 10 | M.ATK | Phoenix Spice, Tomato Purée, Chocolate |
| Carrot Salad | `dish-vegetables-1` | Planet | 1 | DEF | Chopped Carrot |
| Potato Salad | `dish-vegetables-2` | Planet | 2 | DEF | Diced Potato |
| Cabbage Salad | `dish-vegetables-3` | Planet | 3 | DEF | Shredded Cabbage |
| Onion Salad | `dish-vegetables-4` | Planet | 4 | DEF | Diced Onion, Dried Shiitake |
| Tomato Salad | `dish-vegetables-5` | Planet | 5 | DEF | Tomato Purée, Dried Oyster Mushroom |
| Bell Pepper Salad | `dish-vegetables-6` | Planet | 6 | DEF | Sliced Bell Pepper, Dried Oyster Mushroom |
| Eggplant Salad | `dish-vegetables-7` | Planet | 7 | DEF | Sliced Eggplant, Dried Enoki |
| Asparagus Salad | `dish-vegetables-8` | Planet | 8 | DEF | Trimmed Asparagus, Dried Enoki, Walnut Paste |
| Golden Carrot Salad | `dish-vegetables-9` | Planet | 9 | DEF | Golden Carrot Purée, Dried Chanterelle, Chestnut Paste |
| Emperor Pumpkin Salad | `dish-vegetables-10` | Planet | 10 | DEF | Pumpkin Purée, Dried Chanterelle, Chestnut Paste |
| Button Mushroom Soup | `dish-mushrooms-1` | Planet | 1 | M.DEF | Dried Button Mushroom |
| Shiitake Soup | `dish-mushrooms-2` | Planet | 2 | M.DEF | Dried Shiitake |
| Oyster Mushroom Soup | `dish-mushrooms-3` | Planet | 3 | M.DEF | Dried Oyster Mushroom |
| Enoki Soup | `dish-mushrooms-4` | Planet | 4 | M.DEF | Dried Enoki, Cane Sugar |
| Chanterelle Soup | `dish-mushrooms-5` | Planet | 5 | M.DEF | Dried Chanterelle, Beet Sugar |
| Porcini Soup | `dish-mushrooms-6` | Planet | 6 | M.DEF | Dried Porcini, Beet Sugar |
| Morel Soup | `dish-mushrooms-7` | Planet | 7 | M.DEF | Dried Morel, Maple Syrup |
| Truffle Soup | `dish-mushrooms-8` | Planet | 8 | M.DEF | Shaved Truffle, Maple Syrup, Polished Rice |
| Glowcap Soup | `dish-mushrooms-9` | Planet | 9 | M.DEF | Glowcap Powder, Chocolate, Cornmeal |
| King Reishi Soup | `dish-mushrooms-10` | Planet | 10 | M.DEF | Reishi Powder, Chocolate, Cornmeal |
| Honeycomb Cake | `dish-sweets-1` | Planet | 1 | Speed | Honey |
| Sugarcane Cake | `dish-sweets-2` | Planet | 2 | Speed | Cane Sugar |
| Sugar Beet Cake | `dish-sweets-3` | Planet | 3 | Speed | Beet Sugar |
| Maple Sap Cake | `dish-sweets-4` | Planet | 4 | Speed | Maple Syrup, Sunflower Oil |
| Cacao Pod Cake | `dish-sweets-5` | Planet | 5 | Speed | Chocolate, Sesame Paste |
| Vanilla Pod Cake | `dish-sweets-6` | Planet | 6 | Speed | Vanilla Extract, Sesame Paste |
| Agave Heart Cake | `dish-sweets-7` | Planet | 7 | Speed | Agave Syrup, Walnut Paste |
| Palm Sap Cake | `dish-sweets-8` | Planet | 8 | Speed | Palm Sugar, Walnut Paste, Plum Preserve |
| Fairy Honeycomb Cake | `dish-sweets-9` | Planet | 9 | Speed | Fairy Honey, Chestnut Paste, Orange Marmalade |
| Ambrosia Blossom Cake | `dish-sweets-10` | Planet | 10 | Speed | Ambrosia, Chestnut Paste, Orange Marmalade |
| Peanut Cookies | `dish-nuts-seeds-1` | Planet | 1 | Limit Break charge | Peanut Butter |
| Sunflower Seed Cookies | `dish-nuts-seeds-2` | Planet | 2 | Limit Break charge | Sunflower Oil |
| Sesame Cookies | `dish-nuts-seeds-3` | Planet | 3 | Limit Break charge | Sesame Paste |
| Walnut Cookies | `dish-nuts-seeds-4` | Planet | 4 | Limit Break charge | Walnut Paste, Rolled Oats |
| Chestnut Cookies | `dish-nuts-seeds-5` | Planet | 5 | Limit Break charge | Chestnut Paste, Pearl Barley |
| Almond Cookies | `dish-nuts-seeds-6` | Planet | 6 | Limit Break charge | Almond Paste, Pearl Barley |
| Pistachio Cookies | `dish-nuts-seeds-7` | Planet | 7 | Limit Break charge | Pistachio Paste, Polished Rice |
| Macadamia Cookies | `dish-nuts-seeds-8` | Planet | 8 | Limit Break charge | Macadamia Butter, Polished Rice, Mackerel Fillet |
| Thundernut Cookies | `dish-nuts-seeds-9` | Planet | 9 | Limit Break charge | Thundernut Oil, Cornmeal, Salmon Fillet |
| Worldseed Cookies | `dish-nuts-seeds-10` | Planet | 10 | Limit Break charge | Worldseed Oil, Cornmeal, Salmon Fillet |
| Grain & Garden Platter | `duo-hp-def-3` | Duo | 3 | HP, DEF | Pearl Barley, Shredded Cabbage |
| Grain & Garden Platter Deluxe | `duo-hp-def-7` | Duo | 7 | HP, DEF | Buckwheat Flour, Sliced Eggplant, Plum Preserve |
| Garden & Mushroom Platter | `duo-def-mdef-3` | Duo | 3 | DEF, M.DEF | Shredded Cabbage, Dried Oyster Mushroom |
| Garden & Mushroom Platter Deluxe | `duo-def-mdef-7` | Duo | 7 | DEF, M.DEF | Sliced Eggplant, Dried Morel, Dried Enoki |
| Mushroom & Fruit Platter | `duo-mdef-mp-3` | Duo | 3 | M.DEF, MP | Dried Oyster Mushroom, Peach Preserve |
| Mushroom & Fruit Platter Deluxe | `duo-mdef-mp-7` | Duo | 7 | M.DEF, MP | Dried Morel, Mango Pulp, Maple Syrup |
| Fruit & Herb Platter | `duo-mp-matk-3` | Duo | 3 | MP, M.ATK | Peach Preserve, Dried Rosemary |
| Fruit & Herb Platter Deluxe | `duo-mp-matk-7` | Duo | 7 | MP, M.ATK | Mango Pulp, Ground Cinnamon, Mackerel Fillet |
| Herb & Fish Platter | `duo-matk-atk-3` | Duo | 3 | M.ATK, ATK | Dried Rosemary, Sardine Fillet |
| Herb & Fish Platter Deluxe | `duo-matk-atk-7` | Duo | 7 | M.ATK, ATK | Ground Cinnamon, Eel Fillet, Diced Onion |
| Fish & Honey Platter | `duo-atk-speed-3` | Duo | 3 | ATK, Speed | Sardine Fillet, Beet Sugar |
| Fish & Honey Platter Deluxe | `duo-atk-speed-7` | Duo | 7 | ATK, Speed | Eel Fillet, Agave Syrup, Dried Thyme |
| Honey & Nut Platter | `duo-speed-limit-3` | Duo | 3 | Speed, Limit Break charge | Beet Sugar, Sesame Paste |
| Honey & Nut Platter Deluxe | `duo-speed-limit-7` | Duo | 7 | Speed, Limit Break charge | Agave Syrup, Pistachio Paste, Walnut Paste |
| Nut & Grain Platter | `duo-limit-hp-3` | Duo | 3 | Limit Break charge, HP | Sesame Paste, Pearl Barley |
| Nut & Grain Platter Deluxe | `duo-limit-hp-7` | Duo | 7 | Limit Break charge, HP | Pistachio Paste, Buckwheat Flour, Polished Rice |
| Spring Feast | `feast-4` | Feast | 4 | HP, MP, ATK, M.ATK, DEF, M.DEF, Speed, Limit Break charge | Polished Rice, Plum Preserve, Mackerel Fillet, Dried Thyme, Diced Onion, Dried Enoki, Maple Syrup, Walnut Paste |
| Summer Feast | `feast-6` | Feast | 6 | HP, MP, ATK, M.ATK, DEF, M.DEF, Speed, Limit Break charge | Rye Flour, Grape Jelly, Sea Bream Fillet, Ground Pepper, Sliced Bell Pepper, Dried Porcini, Vanilla Extract, Almond Paste |
| Harvest Feast | `feast-8` | Feast | 8 | HP, MP, ATK, M.ATK, DEF, M.DEF, Speed, Limit Break charge | Hulled Wild Rice, Pomegranate Molasses, Tuna Fillet, Saffron Threads, Trimmed Asparagus, Shaved Truffle, Palm Sugar, Macadamia Butter |
| Grand Feast | `feast-10` | Feast | 10 | HP, MP, ATK, M.ATK, DEF, M.DEF, Speed, Limit Break charge | Sunwheat Flour, Golden Apple Preserve, Rainbow Koi Fillet, Phoenix Spice, Pumpkin Purée, Reishi Powder, Ambrosia, Worldseed Oil |
<!-- /live -->

## Gear

Crafted at the Forge (D124, D125): 40 types in ten grades, five physical and five magical in every row:
- ten weapons;
- ten armor pieces;
- twenty accessories (Arms Orbs, Elemental Orbs, Talismans, Amulets).

**Recipes:** two refined items of the grade, from its group's pair of families, so every family is used at every
grade:

| Group | Physical (Arms half) | Magical (Arcana half) |
|---|---|---|
| Weapons | Ores + Woods | Crystals + Essences |
| Armor | Hides & Scales + Stones | Bones & Horns + Fibers |
| Accessories | Ores + Stones | Crystals + Fibers |

Maxing one Uma's twelve tracks takes 240 refined items, about what her 100 Extra Stats dishes take (232). The Uma's Craft
Level gates the grade made (5g − 4), as for every job. Ids are `<type>-g<grade>`; pieces carry no accent.

**What a piece does (D104, D124):**
- **A weapon's Might:** +4 a grade to the offense of hits made with that weapon.
- **Armor:** ATK (physical) or M.ATK (magical) +⌈grade ÷ 2⌉, and its slot's defensive stat +grade. Head DEF, body HP,
  legs MP, arms MDEF, feet Speed.
- **An Orb:** its kind on every hit, for weaknesses only.
- **A Talisman or an Amulet:** the small effect in the table below ([combat](combat.md#damage)).

**Slots and wearing:**
- **Slots:** five weapon slots (her class's), five armor slots (head, body, legs, arms, feet) and two accessory slots
  (any two different types).
- **Wearing a grade:** grade k needs her Weapon Rank for that weapon, her Armor Rank for that armor kind, or her
  Accessory Rank for the accessory's kind, at k or more ([classes](classes.md#ranks-and-levels)).
- **Training pieces:** every Uma holds a grade-0 Training piece of each weapon and armor kind, with no stats. It fills a
  slot until she binds that kind's grade 1, and isn't offered after (D98, D124).

<!-- live:gear -->
| Type | Id | Slot | Half | Recipe families (one refined item each) | Example recipe: grade 3 | At grade 10 |
|---|---|---|---|---|---|---|
| Greatsword | `greatsword-g<grade>` | Weapon | Physical | Ores, Woods | Iron Ingot, Cedar Plank | Might +40 on its hits |
| Axe | `axe-g<grade>` | Weapon | Physical | Ores, Woods | Iron Ingot, Cedar Plank | Might +40 on its hits |
| Lance | `lance-g<grade>` | Weapon | Physical | Ores, Woods | Iron Ingot, Cedar Plank | Might +40 on its hits |
| Bow | `bow-g<grade>` | Weapon | Physical | Ores, Woods | Iron Ingot, Cedar Plank | Might +40 on its hits |
| Katana | `katana-g<grade>` | Weapon | Physical | Ores, Woods | Iron Ingot, Cedar Plank | Might +40 on its hits |
| Fire Tome | `tome-fire-g<grade>` | Weapon | Magical | Crystals, Essences | Cut Citrine, Breeze Infusion | Might +40 on its hits |
| Blizzard Tome | `tome-ice-g<grade>` | Weapon | Magical | Crystals, Essences | Cut Citrine, Breeze Infusion | Might +40 on its hits |
| Thunder Tome | `tome-lightning-g<grade>` | Weapon | Magical | Crystals, Essences | Cut Citrine, Breeze Infusion | Might +40 on its hits |
| Light Tome | `tome-light-g<grade>` | Weapon | Magical | Crystals, Essences | Cut Citrine, Breeze Infusion | Might +40 on its hits |
| Dark Tome | `tome-dark-g<grade>` | Weapon | Magical | Crystals, Essences | Cut Citrine, Breeze Infusion | Might +40 on its hits |
| Helm | `helm-g<grade>` | Head | Physical | Hides & Scales, Stones | Wolfkin Leather, Slate Block | ATK +5, DEF +10 |
| Cuirass | `cuirass-g<grade>` | Body | Physical | Hides & Scales, Stones | Wolfkin Leather, Slate Block | HP +10, ATK +5 |
| Greaves | `greaves-g<grade>` | Legs | Physical | Hides & Scales, Stones | Wolfkin Leather, Slate Block | MP +10, ATK +5 |
| Gauntlets | `gauntlets-g<grade>` | Arms | Physical | Hides & Scales, Stones | Wolfkin Leather, Slate Block | ATK +5, M.DEF +10 |
| Boots | `boots-g<grade>` | Feet | Physical | Hides & Scales, Stones | Wolfkin Leather, Slate Block | ATK +5, Speed +10 |
| Circlet | `circlet-g<grade>` | Head | Magical | Bones & Horns, Fibers | Trilobite Carving, Hemp Cloth | M.ATK +5, DEF +10 |
| Robe | `robe-g<grade>` | Body | Magical | Bones & Horns, Fibers | Trilobite Carving, Hemp Cloth | HP +10, M.ATK +5 |
| Leggings | `leggings-g<grade>` | Legs | Magical | Bones & Horns, Fibers | Trilobite Carving, Hemp Cloth | MP +10, M.ATK +5 |
| Bracers | `bracers-g<grade>` | Arms | Magical | Bones & Horns, Fibers | Trilobite Carving, Hemp Cloth | M.ATK +5, M.DEF +10 |
| Slippers | `slippers-g<grade>` | Feet | Magical | Bones & Horns, Fibers | Trilobite Carving, Hemp Cloth | M.ATK +5, Speed +10 |
| Greatsword Orb | `orb-greatsword-g<grade>` | Accessory (Arms Orb) | Physical | Ores, Stones | Iron Ingot, Slate Block | Its kind on every hit, for weaknesses |
| Axe Orb | `orb-axe-g<grade>` | Accessory (Arms Orb) | Physical | Ores, Stones | Iron Ingot, Slate Block | Its kind on every hit, for weaknesses |
| Lance Orb | `orb-lance-g<grade>` | Accessory (Arms Orb) | Physical | Ores, Stones | Iron Ingot, Slate Block | Its kind on every hit, for weaknesses |
| Bow Orb | `orb-bow-g<grade>` | Accessory (Arms Orb) | Physical | Ores, Stones | Iron Ingot, Slate Block | Its kind on every hit, for weaknesses |
| Katana Orb | `orb-katana-g<grade>` | Accessory (Arms Orb) | Physical | Ores, Stones | Iron Ingot, Slate Block | Its kind on every hit, for weaknesses |
| Fire Orb | `orb-fire-g<grade>` | Accessory (Elemental Orb) | Magical | Crystals, Fibers | Cut Citrine, Hemp Cloth | Its kind on every hit, for weaknesses |
| Ice Orb | `orb-ice-g<grade>` | Accessory (Elemental Orb) | Magical | Crystals, Fibers | Cut Citrine, Hemp Cloth | Its kind on every hit, for weaknesses |
| Lightning Orb | `orb-lightning-g<grade>` | Accessory (Elemental Orb) | Magical | Crystals, Fibers | Cut Citrine, Hemp Cloth | Its kind on every hit, for weaknesses |
| Light Orb | `orb-light-g<grade>` | Accessory (Elemental Orb) | Magical | Crystals, Fibers | Cut Citrine, Hemp Cloth | Its kind on every hit, for weaknesses |
| Dark Orb | `orb-dark-g<grade>` | Accessory (Elemental Orb) | Magical | Crystals, Fibers | Cut Citrine, Hemp Cloth | Its kind on every hit, for weaknesses |
| Vital Talisman | `talisman-vital-g<grade>` | Accessory (Talisman) | Physical | Ores, Stones | Iron Ingot, Slate Block | heals 10 HP a round |
| Vampire Talisman | `talisman-vampire-g<grade>` | Accessory (Talisman) | Physical | Ores, Stones | Iron Ingot, Slate Block | heals 5% of physical damage dealt |
| Bulwark Talisman | `talisman-bulwark-g<grade>` | Accessory (Talisman) | Physical | Ores, Stones | Iron Ingot, Slate Block | a 50 shield against physical damage |
| Iron Talisman | `talisman-iron-g<grade>` | Accessory (Talisman) | Physical | Ores, Stones | Iron Ingot, Slate Block | 5% less physical damage taken |
| Thorn Talisman | `talisman-thorn-g<grade>` | Accessory (Talisman) | Physical | Ores, Stones | Iron Ingot, Slate Block | returns 10% of physical damage taken |
| Spring Amulet | `amulet-spring-g<grade>` | Accessory (Amulet) | Magical | Crystals, Fibers | Cut Citrine, Hemp Cloth | restores 5 MP a round |
| Siphon Amulet | `amulet-siphon-g<grade>` | Accessory (Amulet) | Magical | Crystals, Fibers | Cut Citrine, Hemp Cloth | restores MP as 2% of magical damage dealt |
| Veil Amulet | `amulet-veil-g<grade>` | Accessory (Amulet) | Magical | Crystals, Fibers | Cut Citrine, Hemp Cloth | a 50 shield against magical damage |
| Ward Amulet | `amulet-ward-g<grade>` | Accessory (Amulet) | Magical | Crystals, Fibers | Cut Citrine, Hemp Cloth | 5% less magical damage taken |
| Mirror Amulet | `amulet-mirror-g<grade>` | Accessory (Amulet) | Magical | Crystals, Fibers | Cut Citrine, Hemp Cloth | returns 10% of magical damage taken |

Armor adds ATK (physical) or M.ATK (magical), +1 every two grades (5 at grade 10), and its slot's defensive stat +1 a grade. An Uma wears two accessories of different types.
<!-- /live -->

