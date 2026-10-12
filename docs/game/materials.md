# Materials, dishes, gear and tokens

Everything an Uma gathers, refines, cooks or crafts, and the tokens fights drop. Lists are generated from
`packages/domain/src/items/` and `economy/` (`dishes.ts`, `gear.ts`, `tokens.ts`). How the jobs work is in
[loops](loops.md#professions).

## Families

Sixteen families on two sides:
- **Farming** (Farmlands page) feeds the Kitchen.
- **Gathering** (Wilds page) feeds the Forge.

Each family feeds one of eight stats, has one site, and has ten grades. Every raw item refines one-for-one into its
refined form, at the Pantry (farming) or the Workbench (gathering).

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

| Grade | Raw | Refined | Unlocks at profession Lv | Minutes to gather or refine one | Minutes to cook or craft at this grade |
|---|---|---|---|---|---|
| 1 | Wheat (`wheat`) | Wheat Flour (`wheat-flour`) | 1 | 60 | 120 |
| 2 | Oats (`oats`) | Rolled Oats (`rolled-oats`) | 6 | 90 | 180 |
| 3 | Barley (`barley`) | Pearl Barley (`pearl-barley`) | 11 | 120 | 240 |
| 4 | Rice (`rice`) | Polished Rice (`polished-rice`) | 16 | 150 | 300 |
| 5 | Corn (`corn`) | Cornmeal (`cornmeal`) | 21 | 180 | 360 |
| 6 | Rye (`rye`) | Rye Flour (`rye-flour`) | 26 | 210 | 420 |
| 7 | Buckwheat (`buckwheat`) | Buckwheat Flour (`buckwheat-flour`) | 31 | 240 | 480 |
| 8 | Wild Rice (`wild-rice`) | Hulled Wild Rice (`hulled-wild-rice`) | 36 | 270 | 540 |
| 9 | Moonrice (`moonrice`) | Moonrice Flour (`moonrice-flour`) | 41 | 300 | 600 |
| 10 | Sunwheat (`sunwheat`) | Sunwheat Flour (`sunwheat-flour`) | 46 | 330 | 660 |

### Fruits (`fruits`, MP, Orchard)

| Grade | Raw | Refined | Unlocks at profession Lv | Minutes to gather or refine one | Minutes to cook or craft at this grade |
|---|---|---|---|---|---|
| 1 | Apple (`apple`) | Apple Preserve (`apple-preserve`) | 1 | 60 | 120 |
| 2 | Pear (`pear`) | Pear Preserve (`pear-preserve`) | 6 | 90 | 180 |
| 3 | Peach (`peach`) | Peach Preserve (`peach-preserve`) | 11 | 120 | 240 |
| 4 | Plum (`plum`) | Plum Preserve (`plum-preserve`) | 16 | 150 | 300 |
| 5 | Orange (`orange`) | Orange Marmalade (`orange-marmalade`) | 21 | 180 | 360 |
| 6 | Grape (`grape`) | Grape Jelly (`grape-jelly`) | 26 | 210 | 420 |
| 7 | Mango (`mango`) | Mango Pulp (`mango-pulp`) | 31 | 240 | 480 |
| 8 | Pomegranate (`pomegranate`) | Pomegranate Molasses (`pomegranate-molasses`) | 36 | 270 | 540 |
| 9 | Starpeach (`starpeach`) | Starpeach Nectar (`starpeach-nectar`) | 41 | 300 | 600 |
| 10 | Golden Apple (`golden-apple`) | Golden Apple Preserve (`golden-apple-preserve`) | 46 | 330 | 660 |

### Fish (`fish`, ATK, Fishery)

| Grade | Raw | Refined | Unlocks at profession Lv | Minutes to gather or refine one | Minutes to cook or craft at this grade |
|---|---|---|---|---|---|
| 1 | Carp (`carp`) | Carp Fillet (`carp-fillet`) | 1 | 60 | 120 |
| 2 | Trout (`trout`) | Trout Fillet (`trout-fillet`) | 6 | 90 | 180 |
| 3 | Sardine (`sardine`) | Sardine Fillet (`sardine-fillet`) | 11 | 120 | 240 |
| 4 | Mackerel (`mackerel`) | Mackerel Fillet (`mackerel-fillet`) | 16 | 150 | 300 |
| 5 | Salmon (`salmon`) | Salmon Fillet (`salmon-fillet`) | 21 | 180 | 360 |
| 6 | Sea Bream (`sea-bream`) | Sea Bream Fillet (`sea-bream-fillet`) | 26 | 210 | 420 |
| 7 | Eel (`eel`) | Eel Fillet (`eel-fillet`) | 31 | 240 | 480 |
| 8 | Tuna (`tuna`) | Tuna Fillet (`tuna-fillet`) | 36 | 270 | 540 |
| 9 | Silverfin (`silverfin`) | Silverfin Fillet (`silverfin-fillet`) | 41 | 300 | 600 |
| 10 | Rainbow Koi (`rainbow-koi`) | Rainbow Koi Fillet (`rainbow-koi-fillet`) | 46 | 330 | 660 |

### Herbs & Spices (`herbs-spices`, M.ATK, Herb Garden)

| Grade | Raw | Refined | Unlocks at profession Lv | Minutes to gather or refine one | Minutes to cook or craft at this grade |
|---|---|---|---|---|---|
| 1 | Basil (`basil`) | Dried Basil (`dried-basil`) | 1 | 60 | 120 |
| 2 | Mint (`mint`) | Dried Mint (`dried-mint`) | 6 | 90 | 180 |
| 3 | Rosemary (`rosemary`) | Dried Rosemary (`dried-rosemary`) | 11 | 120 | 240 |
| 4 | Thyme (`thyme`) | Dried Thyme (`dried-thyme`) | 16 | 150 | 300 |
| 5 | Ginger (`ginger`) | Ground Ginger (`ground-ginger`) | 21 | 180 | 360 |
| 6 | Peppercorn (`peppercorn`) | Ground Pepper (`ground-pepper`) | 26 | 210 | 420 |
| 7 | Cinnamon (`cinnamon`) | Ground Cinnamon (`ground-cinnamon`) | 31 | 240 | 480 |
| 8 | Saffron (`saffron`) | Saffron Threads (`saffron-threads`) | 36 | 270 | 540 |
| 9 | Mandrake (`mandrake`) | Mandrake Powder (`mandrake-powder`) | 41 | 300 | 600 |
| 10 | Phoenix Pepper (`phoenix-pepper`) | Phoenix Spice (`phoenix-spice`) | 46 | 330 | 660 |

### Vegetables (`vegetables`, DEF, Vegetable Garden)

| Grade | Raw | Refined | Unlocks at profession Lv | Minutes to gather or refine one | Minutes to cook or craft at this grade |
|---|---|---|---|---|---|
| 1 | Carrot (`carrot`) | Chopped Carrot (`chopped-carrot`) | 1 | 60 | 120 |
| 2 | Potato (`potato`) | Diced Potato (`diced-potato`) | 6 | 90 | 180 |
| 3 | Cabbage (`cabbage`) | Shredded Cabbage (`shredded-cabbage`) | 11 | 120 | 240 |
| 4 | Onion (`onion`) | Diced Onion (`diced-onion`) | 16 | 150 | 300 |
| 5 | Tomato (`tomato`) | Tomato Purée (`tomato-puree`) | 21 | 180 | 360 |
| 6 | Bell Pepper (`bell-pepper`) | Sliced Bell Pepper (`sliced-bell-pepper`) | 26 | 210 | 420 |
| 7 | Eggplant (`eggplant`) | Sliced Eggplant (`sliced-eggplant`) | 31 | 240 | 480 |
| 8 | Asparagus (`asparagus`) | Trimmed Asparagus (`trimmed-asparagus`) | 36 | 270 | 540 |
| 9 | Golden Carrot (`golden-carrot`) | Golden Carrot Purée (`golden-carrot-puree`) | 41 | 300 | 600 |
| 10 | Emperor Pumpkin (`emperor-pumpkin`) | Pumpkin Purée (`pumpkin-puree`) | 46 | 330 | 660 |

### Mushrooms (`mushrooms`, M.DEF, Mushroom Cave)

| Grade | Raw | Refined | Unlocks at profession Lv | Minutes to gather or refine one | Minutes to cook or craft at this grade |
|---|---|---|---|---|---|
| 1 | Button Mushroom (`button-mushroom`) | Dried Button Mushroom (`dried-button-mushroom`) | 1 | 60 | 120 |
| 2 | Shiitake (`shiitake`) | Dried Shiitake (`dried-shiitake`) | 6 | 90 | 180 |
| 3 | Oyster Mushroom (`oyster-mushroom`) | Dried Oyster Mushroom (`dried-oyster-mushroom`) | 11 | 120 | 240 |
| 4 | Enoki (`enoki`) | Dried Enoki (`dried-enoki`) | 16 | 150 | 300 |
| 5 | Chanterelle (`chanterelle`) | Dried Chanterelle (`dried-chanterelle`) | 21 | 180 | 360 |
| 6 | Porcini (`porcini`) | Dried Porcini (`dried-porcini`) | 26 | 210 | 420 |
| 7 | Morel (`morel`) | Dried Morel (`dried-morel`) | 31 | 240 | 480 |
| 8 | Truffle (`truffle`) | Shaved Truffle (`shaved-truffle`) | 36 | 270 | 540 |
| 9 | Glowcap (`glowcap`) | Glowcap Powder (`glowcap-powder`) | 41 | 300 | 600 |
| 10 | King Reishi (`king-reishi`) | Reishi Powder (`reishi-powder`) | 46 | 330 | 660 |

### Sweets (`sweets`, Speed, Sugar Grove)

| Grade | Raw | Refined | Unlocks at profession Lv | Minutes to gather or refine one | Minutes to cook or craft at this grade |
|---|---|---|---|---|---|
| 1 | Honeycomb (`honeycomb`) | Honey (`honey`) | 1 | 60 | 120 |
| 2 | Sugarcane (`sugarcane`) | Cane Sugar (`cane-sugar`) | 6 | 90 | 180 |
| 3 | Sugar Beet (`sugar-beet`) | Beet Sugar (`beet-sugar`) | 11 | 120 | 240 |
| 4 | Maple Sap (`maple-sap`) | Maple Syrup (`maple-syrup`) | 16 | 150 | 300 |
| 5 | Cacao Pod (`cacao-pod`) | Chocolate (`chocolate`) | 21 | 180 | 360 |
| 6 | Vanilla Pod (`vanilla-pod`) | Vanilla Extract (`vanilla-extract`) | 26 | 210 | 420 |
| 7 | Agave Heart (`agave-heart`) | Agave Syrup (`agave-syrup`) | 31 | 240 | 480 |
| 8 | Palm Sap (`palm-sap`) | Palm Sugar (`palm-sugar`) | 36 | 270 | 540 |
| 9 | Fairy Honeycomb (`fairy-honeycomb`) | Fairy Honey (`fairy-honey`) | 41 | 300 | 600 |
| 10 | Ambrosia Blossom (`ambrosia-blossom`) | Ambrosia (`ambrosia`) | 46 | 330 | 660 |

### Nuts & Seeds (`nuts-seeds`, Limit Break charge, Nut Grove)

| Grade | Raw | Refined | Unlocks at profession Lv | Minutes to gather or refine one | Minutes to cook or craft at this grade |
|---|---|---|---|---|---|
| 1 | Peanut (`peanut`) | Peanut Butter (`peanut-butter`) | 1 | 60 | 120 |
| 2 | Sunflower Seed (`sunflower-seed`) | Sunflower Oil (`sunflower-oil`) | 6 | 90 | 180 |
| 3 | Sesame (`sesame`) | Sesame Paste (`sesame-paste`) | 11 | 120 | 240 |
| 4 | Walnut (`walnut`) | Walnut Paste (`walnut-paste`) | 16 | 150 | 300 |
| 5 | Chestnut (`chestnut`) | Chestnut Paste (`chestnut-paste`) | 21 | 180 | 360 |
| 6 | Almond (`almond`) | Almond Paste (`almond-paste`) | 26 | 210 | 420 |
| 7 | Pistachio (`pistachio`) | Pistachio Paste (`pistachio-paste`) | 31 | 240 | 480 |
| 8 | Macadamia (`macadamia`) | Macadamia Butter (`macadamia-butter`) | 36 | 270 | 540 |
| 9 | Thundernut (`thundernut`) | Thundernut Oil (`thundernut-oil`) | 41 | 300 | 600 |
| 10 | Worldseed (`worldseed`) | Worldseed Oil (`worldseed-oil`) | 46 | 330 | 660 |

### Hides & Scales (`hides-scales`, HP, Monster Den)

| Grade | Raw | Refined | Unlocks at profession Lv | Minutes to gather or refine one | Minutes to cook or craft at this grade |
|---|---|---|---|---|---|
| 1 | Puffbun Pelt (`puffbun-pelt`) | Puffbun Leather (`puffbun-leather`) | 1 | 60 | 120 |
| 2 | Boarling Hide (`boarling-hide`) | Boarling Leather (`boarling-leather`) | 6 | 90 | 180 |
| 3 | Wolfkin Pelt (`wolfkin-pelt`) | Wolfkin Leather (`wolfkin-leather`) | 11 | 120 | 240 |
| 4 | Rock Lizard Scale (`rock-lizard-scale`) | Lizard Leather (`lizard-leather`) | 16 | 150 | 300 |
| 5 | Ironback Hide (`ironback-hide`) | Ironback Leather (`ironback-leather`) | 21 | 180 | 360 |
| 6 | Basilisk Scale (`basilisk-scale`) | Basilisk Leather (`basilisk-leather`) | 26 | 210 | 420 |
| 7 | Manticore Hide (`manticore-hide`) | Manticore Leather (`manticore-leather`) | 31 | 240 | 480 |
| 8 | Behemoth Hide (`behemoth-hide`) | Behemoth Leather (`behemoth-leather`) | 36 | 270 | 540 |
| 9 | Wyvern Scale (`wyvern-scale`) | Wyvern Leather (`wyvern-leather`) | 41 | 300 | 600 |
| 10 | Dragon Scale (`dragon-scale`) | Dragonhide (`dragonhide`) | 46 | 330 | 660 |

### Essences (`essences`, MP, Ley Spring)

| Grade | Raw | Refined | Unlocks at profession Lv | Minutes to gather or refine one | Minutes to cook or craft at this grade |
|---|---|---|---|---|---|
| 1 | Mist Essence (`mist-essence`) | Mist Infusion (`mist-infusion`) | 1 | 60 | 120 |
| 2 | Dew Essence (`dew-essence`) | Dew Infusion (`dew-infusion`) | 6 | 90 | 180 |
| 3 | Breeze Essence (`breeze-essence`) | Breeze Infusion (`breeze-infusion`) | 11 | 120 | 240 |
| 4 | Ember Essence (`ember-essence`) | Ember Infusion (`ember-infusion`) | 16 | 150 | 300 |
| 5 | Tide Essence (`tide-essence`) | Tide Infusion (`tide-infusion`) | 21 | 180 | 360 |
| 6 | Spark Essence (`spark-essence`) | Spark Infusion (`spark-infusion`) | 26 | 210 | 420 |
| 7 | Glimmer Essence (`glimmer-essence`) | Glimmer Infusion (`glimmer-infusion`) | 31 | 240 | 480 |
| 8 | Shadow Essence (`shadow-essence`) | Shadow Infusion (`shadow-infusion`) | 36 | 270 | 540 |
| 9 | Aether (`aether`) | Aether Infusion (`aether-infusion`) | 41 | 300 | 600 |
| 10 | Prismatic Essence (`prismatic-essence`) | Prismatic Infusion (`prismatic-infusion`) | 46 | 330 | 660 |

### Ores (`ores`, ATK, Mine)

| Grade | Raw | Refined | Unlocks at profession Lv | Minutes to gather or refine one | Minutes to cook or craft at this grade |
|---|---|---|---|---|---|
| 1 | Copper Ore (`copper-ore`) | Copper Ingot (`copper-ingot`) | 1 | 60 | 120 |
| 2 | Tin Ore (`tin-ore`) | Tin Ingot (`tin-ingot`) | 6 | 90 | 180 |
| 3 | Iron Ore (`iron-ore`) | Iron Ingot (`iron-ingot`) | 11 | 120 | 240 |
| 4 | Silver Ore (`silver-ore`) | Silver Ingot (`silver-ingot`) | 16 | 150 | 300 |
| 5 | Cobalt Ore (`cobalt-ore`) | Cobalt Ingot (`cobalt-ingot`) | 21 | 180 | 360 |
| 6 | Gold Ore (`gold-ore`) | Gold Ingot (`gold-ingot`) | 26 | 210 | 420 |
| 7 | Platinum Ore (`platinum-ore`) | Platinum Ingot (`platinum-ingot`) | 31 | 240 | 480 |
| 8 | Titanium Ore (`titanium-ore`) | Titanium Ingot (`titanium-ingot`) | 36 | 270 | 540 |
| 9 | Mythril Ore (`mythril-ore`) | Mythril Ingot (`mythril-ingot`) | 41 | 300 | 600 |
| 10 | Orichalcum Ore (`orichalcum-ore`) | Orichalcum Ingot (`orichalcum-ingot`) | 46 | 330 | 660 |

### Crystals (`crystals`, M.ATK, Crystal Cavern)

| Grade | Raw | Refined | Unlocks at profession Lv | Minutes to gather or refine one | Minutes to cook or craft at this grade |
|---|---|---|---|---|---|
| 1 | Quartz (`quartz`) | Cut Quartz (`cut-quartz`) | 1 | 60 | 120 |
| 2 | Amethyst (`amethyst`) | Cut Amethyst (`cut-amethyst`) | 6 | 90 | 180 |
| 3 | Citrine (`citrine`) | Cut Citrine (`cut-citrine`) | 11 | 120 | 240 |
| 4 | Garnet (`garnet`) | Cut Garnet (`cut-garnet`) | 16 | 150 | 300 |
| 5 | Emerald (`emerald`) | Cut Emerald (`cut-emerald`) | 21 | 180 | 360 |
| 6 | Sapphire (`sapphire`) | Cut Sapphire (`cut-sapphire`) | 26 | 210 | 420 |
| 7 | Ruby (`ruby`) | Cut Ruby (`cut-ruby`) | 31 | 240 | 480 |
| 8 | Diamond (`diamond`) | Cut Diamond (`cut-diamond`) | 36 | 270 | 540 |
| 9 | Starstone (`starstone`) | Cut Starstone (`cut-starstone`) | 41 | 300 | 600 |
| 10 | Philosopher's Stone (`philosophers-stone`) | Cut Philosopher's Stone (`cut-philosophers-stone`) | 46 | 330 | 660 |

### Stones (`stones`, DEF, Quarry)

| Grade | Raw | Refined | Unlocks at profession Lv | Minutes to gather or refine one | Minutes to cook or craft at this grade |
|---|---|---|---|---|---|
| 1 | Limestone (`limestone`) | Limestone Block (`limestone-block`) | 1 | 60 | 120 |
| 2 | Sandstone (`sandstone`) | Sandstone Block (`sandstone-block`) | 6 | 90 | 180 |
| 3 | Slate (`slate`) | Slate Block (`slate-block`) | 11 | 120 | 240 |
| 4 | Granite (`granite`) | Granite Block (`granite-block`) | 16 | 150 | 300 |
| 5 | Basalt (`basalt`) | Basalt Block (`basalt-block`) | 21 | 180 | 360 |
| 6 | Marble (`marble`) | Marble Block (`marble-block`) | 26 | 210 | 420 |
| 7 | Obsidian (`obsidian`) | Obsidian Block (`obsidian-block`) | 31 | 240 | 480 |
| 8 | Jade (`jade`) | Jade Block (`jade-block`) | 36 | 270 | 540 |
| 9 | Runestone (`runestone`) | Runestone Block (`runestone-block`) | 41 | 300 | 600 |
| 10 | Meteorite (`meteorite`) | Meteorite Block (`meteorite-block`) | 46 | 330 | 660 |

### Fibers (`fibers`, M.DEF, Meadow)

| Grade | Raw | Refined | Unlocks at profession Lv | Minutes to gather or refine one | Minutes to cook or craft at this grade |
|---|---|---|---|---|---|
| 1 | Flax (`flax`) | Linen (`linen`) | 1 | 60 | 120 |
| 2 | Jute (`jute`) | Burlap (`burlap`) | 6 | 90 | 180 |
| 3 | Hemp (`hemp`) | Hemp Cloth (`hemp-cloth`) | 11 | 120 | 240 |
| 4 | Cotton (`cotton`) | Cotton Cloth (`cotton-cloth`) | 16 | 150 | 300 |
| 5 | Wool (`wool`) | Wool Cloth (`wool-cloth`) | 21 | 180 | 360 |
| 6 | Alpaca Fleece (`alpaca-fleece`) | Alpaca Cloth (`alpaca-cloth`) | 26 | 210 | 420 |
| 7 | Cashmere Fleece (`cashmere-fleece`) | Cashmere Cloth (`cashmere-cloth`) | 31 | 240 | 480 |
| 8 | Silk Cocoon (`silk-cocoon`) | Silk (`silk`) | 36 | 270 | 540 |
| 9 | Moonsilk Cocoon (`moonsilk-cocoon`) | Moonsilk (`moonsilk`) | 41 | 300 | 600 |
| 10 | Cloudfleece (`cloudfleece`) | Cloudweave (`cloudweave`) | 46 | 330 | 660 |

### Woods (`woods`, Speed, Forest)

| Grade | Raw | Refined | Unlocks at profession Lv | Minutes to gather or refine one | Minutes to cook or craft at this grade |
|---|---|---|---|---|---|
| 1 | Pine Log (`pine-log`) | Pine Plank (`pine-plank`) | 1 | 60 | 120 |
| 2 | Birch Log (`birch-log`) | Birch Plank (`birch-plank`) | 6 | 90 | 180 |
| 3 | Cedar Log (`cedar-log`) | Cedar Plank (`cedar-plank`) | 11 | 120 | 240 |
| 4 | Maple Log (`maple-log`) | Maple Plank (`maple-plank`) | 16 | 150 | 300 |
| 5 | Oak Log (`oak-log`) | Oak Plank (`oak-plank`) | 21 | 180 | 360 |
| 6 | Cherry Log (`cherry-log`) | Cherry Plank (`cherry-plank`) | 26 | 210 | 420 |
| 7 | Mahogany Log (`mahogany-log`) | Mahogany Plank (`mahogany-plank`) | 31 | 240 | 480 |
| 8 | Ebony Log (`ebony-log`) | Ebony Plank (`ebony-plank`) | 36 | 270 | 540 |
| 9 | Elderwood Log (`elderwood-log`) | Elderwood Plank (`elderwood-plank`) | 41 | 300 | 600 |
| 10 | Yggdrasil Branch (`yggdrasil-branch`) | Yggdrasil Plank (`yggdrasil-plank`) | 46 | 330 | 660 |

### Bones & Horns (`bones-horns`, Limit Break charge, Fossil Dig)

| Grade | Raw | Refined | Unlocks at profession Lv | Minutes to gather or refine one | Minutes to cook or craft at this grade |
|---|---|---|---|---|---|
| 1 | Seashell (`seashell`) | Shell Carving (`shell-carving`) | 1 | 60 | 120 |
| 2 | Ammonite (`ammonite`) | Ammonite Carving (`ammonite-carving`) | 6 | 90 | 180 |
| 3 | Trilobite (`trilobite`) | Trilobite Carving (`trilobite-carving`) | 11 | 120 | 240 |
| 4 | Fossil Bone (`fossil-bone`) | Bone Carving (`bone-carving`) | 16 | 150 | 300 |
| 5 | Mammoth Tusk (`mammoth-tusk`) | Tusk Carving (`tusk-carving`) | 21 | 180 | 360 |
| 6 | Saber Fang (`saber-fang`) | Fang Carving (`fang-carving`) | 26 | 210 | 420 |
| 7 | Raptor Claw (`raptor-claw`) | Claw Carving (`claw-carving`) | 31 | 240 | 480 |
| 8 | Tyrant Tooth (`tyrant-tooth`) | Tooth Carving (`tooth-carving`) | 36 | 270 | 540 |
| 9 | Titan Bone (`titan-bone`) | Titan Carving (`titan-carving`) | 41 | 300 | 600 |
| 10 | Unicorn Horn (`unicorn-horn`) | Unicorn Carving (`unicorn-carving`) | 46 | 330 | 660 |
<!-- /live -->

## Dishes

Cooked at the Kitchen from refined farming items plus Cooking Tokens. Eating a dish unlocks nodes on the Uma's
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
| Wheat Bread | `dish-grains-1` | Planet | 1 | HP | Wheat Flour, HP Cooking Token (G1–2) |
| Oats Bread | `dish-grains-2` | Planet | 2 | HP | Rolled Oats, HP Cooking Token (G1–2) |
| Barley Bread | `dish-grains-3` | Planet | 3 | HP | Pearl Barley, HP Cooking Token (G3–4) |
| Rice Bread | `dish-grains-4` | Planet | 4 | HP | Polished Rice, HP Cooking Token (G3–4), Pear Preserve |
| Corn Bread | `dish-grains-5` | Planet | 5 | HP | Cornmeal, HP Cooking Token (G5–6), Peach Preserve |
| Rye Bread | `dish-grains-6` | Planet | 6 | HP | Rye Flour, HP Cooking Token (G5–6), Peach Preserve |
| Buckwheat Bread | `dish-grains-7` | Planet | 7 | HP | Buckwheat Flour, HP Cooking Token (G7–8), Plum Preserve |
| Wild Rice Bread | `dish-grains-8` | Planet | 8 | HP | Hulled Wild Rice, HP Cooking Token (G7–8), Plum Preserve, Dried Thyme |
| Moonrice Bread | `dish-grains-9` | Planet | 9 | HP | Moonrice Flour, HP Cooking Token (G9–10), Orange Marmalade, Ground Ginger |
| Sunwheat Bread | `dish-grains-10` | Planet | 10 | HP | Sunwheat Flour, HP Cooking Token (G9–10), Orange Marmalade, Ground Ginger |
| Apple Tart | `dish-fruits-1` | Planet | 1 | MP | Apple Preserve, MP Cooking Token (G1–2) |
| Pear Tart | `dish-fruits-2` | Planet | 2 | MP | Pear Preserve, MP Cooking Token (G1–2) |
| Peach Tart | `dish-fruits-3` | Planet | 3 | MP | Peach Preserve, MP Cooking Token (G3–4) |
| Plum Tart | `dish-fruits-4` | Planet | 4 | MP | Plum Preserve, MP Cooking Token (G3–4), Trout Fillet |
| Orange Tart | `dish-fruits-5` | Planet | 5 | MP | Orange Marmalade, MP Cooking Token (G5–6), Sardine Fillet |
| Grape Tart | `dish-fruits-6` | Planet | 6 | MP | Grape Jelly, MP Cooking Token (G5–6), Sardine Fillet |
| Mango Tart | `dish-fruits-7` | Planet | 7 | MP | Mango Pulp, MP Cooking Token (G7–8), Mackerel Fillet |
| Pomegranate Tart | `dish-fruits-8` | Planet | 8 | MP | Pomegranate Molasses, MP Cooking Token (G7–8), Mackerel Fillet, Diced Onion |
| Starpeach Tart | `dish-fruits-9` | Planet | 9 | MP | Starpeach Nectar, MP Cooking Token (G9–10), Salmon Fillet, Tomato Purée |
| Golden Apple Tart | `dish-fruits-10` | Planet | 10 | MP | Golden Apple Preserve, MP Cooking Token (G9–10), Salmon Fillet, Tomato Purée |
| Carp Grill | `dish-fish-1` | Planet | 1 | ATK | Carp Fillet, ATK Cooking Token (G1–2) |
| Trout Grill | `dish-fish-2` | Planet | 2 | ATK | Trout Fillet, ATK Cooking Token (G1–2) |
| Sardine Grill | `dish-fish-3` | Planet | 3 | ATK | Sardine Fillet, ATK Cooking Token (G3–4) |
| Mackerel Grill | `dish-fish-4` | Planet | 4 | ATK | Mackerel Fillet, ATK Cooking Token (G3–4), Dried Mint |
| Salmon Grill | `dish-fish-5` | Planet | 5 | ATK | Salmon Fillet, ATK Cooking Token (G5–6), Dried Rosemary |
| Sea Bream Grill | `dish-fish-6` | Planet | 6 | ATK | Sea Bream Fillet, ATK Cooking Token (G5–6), Dried Rosemary |
| Eel Grill | `dish-fish-7` | Planet | 7 | ATK | Eel Fillet, ATK Cooking Token (G7–8), Dried Thyme |
| Tuna Grill | `dish-fish-8` | Planet | 8 | ATK | Tuna Fillet, ATK Cooking Token (G7–8), Dried Thyme, Dried Enoki |
| Silverfin Grill | `dish-fish-9` | Planet | 9 | ATK | Silverfin Fillet, ATK Cooking Token (G9–10), Ground Ginger, Dried Chanterelle |
| Rainbow Koi Grill | `dish-fish-10` | Planet | 10 | ATK | Rainbow Koi Fillet, ATK Cooking Token (G9–10), Ground Ginger, Dried Chanterelle |
| Basil Curry | `dish-herbs-spices-1` | Planet | 1 | M.ATK | Dried Basil, M.ATK Cooking Token (G1–2) |
| Mint Curry | `dish-herbs-spices-2` | Planet | 2 | M.ATK | Dried Mint, M.ATK Cooking Token (G1–2) |
| Rosemary Curry | `dish-herbs-spices-3` | Planet | 3 | M.ATK | Dried Rosemary, M.ATK Cooking Token (G3–4) |
| Thyme Curry | `dish-herbs-spices-4` | Planet | 4 | M.ATK | Dried Thyme, M.ATK Cooking Token (G3–4), Diced Potato |
| Ginger Curry | `dish-herbs-spices-5` | Planet | 5 | M.ATK | Ground Ginger, M.ATK Cooking Token (G5–6), Shredded Cabbage |
| Peppercorn Curry | `dish-herbs-spices-6` | Planet | 6 | M.ATK | Ground Pepper, M.ATK Cooking Token (G5–6), Shredded Cabbage |
| Cinnamon Curry | `dish-herbs-spices-7` | Planet | 7 | M.ATK | Ground Cinnamon, M.ATK Cooking Token (G7–8), Diced Onion |
| Saffron Curry | `dish-herbs-spices-8` | Planet | 8 | M.ATK | Saffron Threads, M.ATK Cooking Token (G7–8), Diced Onion, Maple Syrup |
| Mandrake Curry | `dish-herbs-spices-9` | Planet | 9 | M.ATK | Mandrake Powder, M.ATK Cooking Token (G9–10), Tomato Purée, Chocolate |
| Phoenix Pepper Curry | `dish-herbs-spices-10` | Planet | 10 | M.ATK | Phoenix Spice, M.ATK Cooking Token (G9–10), Tomato Purée, Chocolate |
| Carrot Salad | `dish-vegetables-1` | Planet | 1 | DEF | Chopped Carrot, DEF Cooking Token (G1–2) |
| Potato Salad | `dish-vegetables-2` | Planet | 2 | DEF | Diced Potato, DEF Cooking Token (G1–2) |
| Cabbage Salad | `dish-vegetables-3` | Planet | 3 | DEF | Shredded Cabbage, DEF Cooking Token (G3–4) |
| Onion Salad | `dish-vegetables-4` | Planet | 4 | DEF | Diced Onion, DEF Cooking Token (G3–4), Dried Shiitake |
| Tomato Salad | `dish-vegetables-5` | Planet | 5 | DEF | Tomato Purée, DEF Cooking Token (G5–6), Dried Oyster Mushroom |
| Bell Pepper Salad | `dish-vegetables-6` | Planet | 6 | DEF | Sliced Bell Pepper, DEF Cooking Token (G5–6), Dried Oyster Mushroom |
| Eggplant Salad | `dish-vegetables-7` | Planet | 7 | DEF | Sliced Eggplant, DEF Cooking Token (G7–8), Dried Enoki |
| Asparagus Salad | `dish-vegetables-8` | Planet | 8 | DEF | Trimmed Asparagus, DEF Cooking Token (G7–8), Dried Enoki, Walnut Paste |
| Golden Carrot Salad | `dish-vegetables-9` | Planet | 9 | DEF | Golden Carrot Purée, DEF Cooking Token (G9–10), Dried Chanterelle, Chestnut Paste |
| Emperor Pumpkin Salad | `dish-vegetables-10` | Planet | 10 | DEF | Pumpkin Purée, DEF Cooking Token (G9–10), Dried Chanterelle, Chestnut Paste |
| Button Mushroom Soup | `dish-mushrooms-1` | Planet | 1 | M.DEF | Dried Button Mushroom, M.DEF Cooking Token (G1–2) |
| Shiitake Soup | `dish-mushrooms-2` | Planet | 2 | M.DEF | Dried Shiitake, M.DEF Cooking Token (G1–2) |
| Oyster Mushroom Soup | `dish-mushrooms-3` | Planet | 3 | M.DEF | Dried Oyster Mushroom, M.DEF Cooking Token (G3–4) |
| Enoki Soup | `dish-mushrooms-4` | Planet | 4 | M.DEF | Dried Enoki, M.DEF Cooking Token (G3–4), Cane Sugar |
| Chanterelle Soup | `dish-mushrooms-5` | Planet | 5 | M.DEF | Dried Chanterelle, M.DEF Cooking Token (G5–6), Beet Sugar |
| Porcini Soup | `dish-mushrooms-6` | Planet | 6 | M.DEF | Dried Porcini, M.DEF Cooking Token (G5–6), Beet Sugar |
| Morel Soup | `dish-mushrooms-7` | Planet | 7 | M.DEF | Dried Morel, M.DEF Cooking Token (G7–8), Maple Syrup |
| Truffle Soup | `dish-mushrooms-8` | Planet | 8 | M.DEF | Shaved Truffle, M.DEF Cooking Token (G7–8), Maple Syrup, Polished Rice |
| Glowcap Soup | `dish-mushrooms-9` | Planet | 9 | M.DEF | Glowcap Powder, M.DEF Cooking Token (G9–10), Chocolate, Cornmeal |
| King Reishi Soup | `dish-mushrooms-10` | Planet | 10 | M.DEF | Reishi Powder, M.DEF Cooking Token (G9–10), Chocolate, Cornmeal |
| Honeycomb Cake | `dish-sweets-1` | Planet | 1 | Speed | Honey, Speed Cooking Token (G1–2) |
| Sugarcane Cake | `dish-sweets-2` | Planet | 2 | Speed | Cane Sugar, Speed Cooking Token (G1–2) |
| Sugar Beet Cake | `dish-sweets-3` | Planet | 3 | Speed | Beet Sugar, Speed Cooking Token (G3–4) |
| Maple Sap Cake | `dish-sweets-4` | Planet | 4 | Speed | Maple Syrup, Speed Cooking Token (G3–4), Sunflower Oil |
| Cacao Pod Cake | `dish-sweets-5` | Planet | 5 | Speed | Chocolate, Speed Cooking Token (G5–6), Sesame Paste |
| Vanilla Pod Cake | `dish-sweets-6` | Planet | 6 | Speed | Vanilla Extract, Speed Cooking Token (G5–6), Sesame Paste |
| Agave Heart Cake | `dish-sweets-7` | Planet | 7 | Speed | Agave Syrup, Speed Cooking Token (G7–8), Walnut Paste |
| Palm Sap Cake | `dish-sweets-8` | Planet | 8 | Speed | Palm Sugar, Speed Cooking Token (G7–8), Walnut Paste, Plum Preserve |
| Fairy Honeycomb Cake | `dish-sweets-9` | Planet | 9 | Speed | Fairy Honey, Speed Cooking Token (G9–10), Chestnut Paste, Orange Marmalade |
| Ambrosia Blossom Cake | `dish-sweets-10` | Planet | 10 | Speed | Ambrosia, Speed Cooking Token (G9–10), Chestnut Paste, Orange Marmalade |
| Peanut Cookies | `dish-nuts-seeds-1` | Planet | 1 | Limit Break charge | Peanut Butter, Limit Cooking Token (G1–2) |
| Sunflower Seed Cookies | `dish-nuts-seeds-2` | Planet | 2 | Limit Break charge | Sunflower Oil, Limit Cooking Token (G1–2) |
| Sesame Cookies | `dish-nuts-seeds-3` | Planet | 3 | Limit Break charge | Sesame Paste, Limit Cooking Token (G3–4) |
| Walnut Cookies | `dish-nuts-seeds-4` | Planet | 4 | Limit Break charge | Walnut Paste, Limit Cooking Token (G3–4), Rolled Oats |
| Chestnut Cookies | `dish-nuts-seeds-5` | Planet | 5 | Limit Break charge | Chestnut Paste, Limit Cooking Token (G5–6), Pearl Barley |
| Almond Cookies | `dish-nuts-seeds-6` | Planet | 6 | Limit Break charge | Almond Paste, Limit Cooking Token (G5–6), Pearl Barley |
| Pistachio Cookies | `dish-nuts-seeds-7` | Planet | 7 | Limit Break charge | Pistachio Paste, Limit Cooking Token (G7–8), Polished Rice |
| Macadamia Cookies | `dish-nuts-seeds-8` | Planet | 8 | Limit Break charge | Macadamia Butter, Limit Cooking Token (G7–8), Polished Rice, Mackerel Fillet |
| Thundernut Cookies | `dish-nuts-seeds-9` | Planet | 9 | Limit Break charge | Thundernut Oil, Limit Cooking Token (G9–10), Cornmeal, Salmon Fillet |
| Worldseed Cookies | `dish-nuts-seeds-10` | Planet | 10 | Limit Break charge | Worldseed Oil, Limit Cooking Token (G9–10), Cornmeal, Salmon Fillet |
| Grain & Garden Platter | `duo-hp-def-3` | Duo | 3 | HP, DEF | Pearl Barley, Shredded Cabbage, HP Cooking Token (G3–4), DEF Cooking Token (G3–4) |
| Grain & Garden Platter Deluxe | `duo-hp-def-7` | Duo | 7 | HP, DEF | Buckwheat Flour, Sliced Eggplant, HP Cooking Token (G7–8), DEF Cooking Token (G7–8), Plum Preserve |
| Garden & Mushroom Platter | `duo-def-mdef-3` | Duo | 3 | DEF, M.DEF | Shredded Cabbage, Dried Oyster Mushroom, DEF Cooking Token (G3–4), M.DEF Cooking Token (G3–4) |
| Garden & Mushroom Platter Deluxe | `duo-def-mdef-7` | Duo | 7 | DEF, M.DEF | Sliced Eggplant, Dried Morel, DEF Cooking Token (G7–8), M.DEF Cooking Token (G7–8), Dried Enoki |
| Mushroom & Fruit Platter | `duo-mdef-mp-3` | Duo | 3 | M.DEF, MP | Dried Oyster Mushroom, Peach Preserve, M.DEF Cooking Token (G3–4), MP Cooking Token (G3–4) |
| Mushroom & Fruit Platter Deluxe | `duo-mdef-mp-7` | Duo | 7 | M.DEF, MP | Dried Morel, Mango Pulp, M.DEF Cooking Token (G7–8), MP Cooking Token (G7–8), Maple Syrup |
| Fruit & Herb Platter | `duo-mp-matk-3` | Duo | 3 | MP, M.ATK | Peach Preserve, Dried Rosemary, MP Cooking Token (G3–4), M.ATK Cooking Token (G3–4) |
| Fruit & Herb Platter Deluxe | `duo-mp-matk-7` | Duo | 7 | MP, M.ATK | Mango Pulp, Ground Cinnamon, MP Cooking Token (G7–8), M.ATK Cooking Token (G7–8), Mackerel Fillet |
| Herb & Fish Platter | `duo-matk-atk-3` | Duo | 3 | M.ATK, ATK | Dried Rosemary, Sardine Fillet, M.ATK Cooking Token (G3–4), ATK Cooking Token (G3–4) |
| Herb & Fish Platter Deluxe | `duo-matk-atk-7` | Duo | 7 | M.ATK, ATK | Ground Cinnamon, Eel Fillet, M.ATK Cooking Token (G7–8), ATK Cooking Token (G7–8), Diced Onion |
| Fish & Honey Platter | `duo-atk-speed-3` | Duo | 3 | ATK, Speed | Sardine Fillet, Beet Sugar, ATK Cooking Token (G3–4), Speed Cooking Token (G3–4) |
| Fish & Honey Platter Deluxe | `duo-atk-speed-7` | Duo | 7 | ATK, Speed | Eel Fillet, Agave Syrup, ATK Cooking Token (G7–8), Speed Cooking Token (G7–8), Dried Thyme |
| Honey & Nut Platter | `duo-speed-limit-3` | Duo | 3 | Speed, Limit Break charge | Beet Sugar, Sesame Paste, Speed Cooking Token (G3–4), Limit Cooking Token (G3–4) |
| Honey & Nut Platter Deluxe | `duo-speed-limit-7` | Duo | 7 | Speed, Limit Break charge | Agave Syrup, Pistachio Paste, Speed Cooking Token (G7–8), Limit Cooking Token (G7–8), Walnut Paste |
| Nut & Grain Platter | `duo-limit-hp-3` | Duo | 3 | Limit Break charge, HP | Sesame Paste, Pearl Barley, Limit Cooking Token (G3–4), HP Cooking Token (G3–4) |
| Nut & Grain Platter Deluxe | `duo-limit-hp-7` | Duo | 7 | Limit Break charge, HP | Pistachio Paste, Buckwheat Flour, Limit Cooking Token (G7–8), HP Cooking Token (G7–8), Polished Rice |
| Spring Feast | `feast-4` | Feast | 4 | HP, MP, ATK, M.ATK, DEF, M.DEF, Speed, Limit Break charge | Polished Rice, Plum Preserve, Mackerel Fillet, Dried Thyme, Diced Onion, Dried Enoki, Maple Syrup, Walnut Paste, HP Cooking Token (G3–4), MP Cooking Token (G3–4), ATK Cooking Token (G3–4), M.ATK Cooking Token (G3–4), DEF Cooking Token (G3–4), M.DEF Cooking Token (G3–4), Speed Cooking Token (G3–4), Limit Cooking Token (G3–4) |
| Summer Feast | `feast-6` | Feast | 6 | HP, MP, ATK, M.ATK, DEF, M.DEF, Speed, Limit Break charge | Rye Flour, Grape Jelly, Sea Bream Fillet, Ground Pepper, Sliced Bell Pepper, Dried Porcini, Vanilla Extract, Almond Paste, HP Cooking Token (G5–6), MP Cooking Token (G5–6), ATK Cooking Token (G5–6), M.ATK Cooking Token (G5–6), DEF Cooking Token (G5–6), M.DEF Cooking Token (G5–6), Speed Cooking Token (G5–6), Limit Cooking Token (G5–6) |
| Harvest Feast | `feast-8` | Feast | 8 | HP, MP, ATK, M.ATK, DEF, M.DEF, Speed, Limit Break charge | Hulled Wild Rice, Pomegranate Molasses, Tuna Fillet, Saffron Threads, Trimmed Asparagus, Shaved Truffle, Palm Sugar, Macadamia Butter, HP Cooking Token (G7–8), MP Cooking Token (G7–8), ATK Cooking Token (G7–8), M.ATK Cooking Token (G7–8), DEF Cooking Token (G7–8), M.DEF Cooking Token (G7–8), Speed Cooking Token (G7–8), Limit Cooking Token (G7–8) |
| Grand Feast | `feast-10` | Feast | 10 | HP, MP, ATK, M.ATK, DEF, M.DEF, Speed, Limit Break charge | Sunwheat Flour, Golden Apple Preserve, Rainbow Koi Fillet, Phoenix Spice, Pumpkin Purée, Reishi Powder, Ambrosia, Worldseed Oil, HP Cooking Token (G9–10), MP Cooking Token (G9–10), ATK Cooking Token (G9–10), M.ATK Cooking Token (G9–10), DEF Cooking Token (G9–10), M.DEF Cooking Token (G9–10), Speed Cooking Token (G9–10), Limit Cooking Token (G9–10) |
<!-- /live -->

## Gear

Crafted at the Forge. Any piece is a **type × grade (1–10) × accent** (one of the eight stats), with id
`<type>-g<grade>-<accent>`. The recipe is four refined items of the grade, one from each of the type's four families.
No token: the Uma's Craft Level gates the grade (5g − 4), as for every job (D94).

- **Arms** and **Arms Orbs** use ores, stones, woods and hides-scales.
- **Tomes** and **Elemental Orbs** use crystals, fibers, essences and bones-horns.
- **Armor** and **Rings/Charms** mix the two halves.

**Points:**
- A weapon gives offense, split over the five weapons of her class.
- Armor gives defense.
- A Ring or Charm gives only its accent, at double weight.
- An Orb gives its accent at normal weight; its kind is the rest of its worth ([combat](combat.md#damage)).
- Every accent adds ⌈grade ÷ 2⌉.

**Wearing:** she can wear grade k when her matching level (Weapon, Armor or Accessory Level) is at least k
([classes](classes.md#ranks-and-levels)). Every Uma also holds a grade-0 **Training weapon** of each kind, with no stats,
that fills a weapon slot until she wears a crafted one (D98).

<!-- live:gear -->
| Type | Id | Slot | Recipe families (one refined item each) | Example recipe: grade 3 | Points at grade 10, HP accent |
|---|---|---|---|---|---|
| Greatsword | `greatsword` | Weapon | Ores, Stones, Woods, Hides & Scales | Iron Ingot, Slate Block, Cedar Plank, Wolfkin Leather | HP 5, ATK 2 |
| Axe | `axe` | Weapon | Ores, Stones, Woods, Hides & Scales | Iron Ingot, Slate Block, Cedar Plank, Wolfkin Leather | HP 5, ATK 2 |
| Lance | `lance` | Weapon | Ores, Stones, Woods, Hides & Scales | Iron Ingot, Slate Block, Cedar Plank, Wolfkin Leather | HP 5, ATK 2 |
| Bow | `bow` | Weapon | Ores, Stones, Woods, Hides & Scales | Iron Ingot, Slate Block, Cedar Plank, Wolfkin Leather | HP 5, ATK 2 |
| Katana | `katana` | Weapon | Ores, Stones, Woods, Hides & Scales | Iron Ingot, Slate Block, Cedar Plank, Wolfkin Leather | HP 5, ATK 2 |
| Fire Tome | `tome-fire` | Weapon | Crystals, Fibers, Essences, Bones & Horns | Cut Citrine, Hemp Cloth, Breeze Infusion, Trilobite Carving | HP 5, M.ATK 2 |
| Blizzard Tome | `tome-ice` | Weapon | Crystals, Fibers, Essences, Bones & Horns | Cut Citrine, Hemp Cloth, Breeze Infusion, Trilobite Carving | HP 5, M.ATK 2 |
| Thunder Tome | `tome-lightning` | Weapon | Crystals, Fibers, Essences, Bones & Horns | Cut Citrine, Hemp Cloth, Breeze Infusion, Trilobite Carving | HP 5, M.ATK 2 |
| Light Tome | `tome-light` | Weapon | Crystals, Fibers, Essences, Bones & Horns | Cut Citrine, Hemp Cloth, Breeze Infusion, Trilobite Carving | HP 5, M.ATK 2 |
| Dark Tome | `tome-dark` | Weapon | Crystals, Fibers, Essences, Bones & Horns | Cut Citrine, Hemp Cloth, Breeze Infusion, Trilobite Carving | HP 5, M.ATK 2 |
| Garb | `garb` | Armor | Woods, Stones, Fibers, Crystals | Cedar Plank, Slate Block, Hemp Cloth, Cut Citrine | HP 5, DEF 5, M.DEF 5, Speed 5 |
| Leather | `leather` | Armor | Hides & Scales, Woods, Fibers, Bones & Horns | Wolfkin Leather, Cedar Plank, Hemp Cloth, Trilobite Carving | HP 5, DEF 7.5, M.DEF 5, Speed 2.5 |
| Mail | `mail` | Armor | Ores, Hides & Scales, Crystals, Essences | Iron Ingot, Wolfkin Leather, Cut Citrine, Breeze Infusion | HP 5, DEF 7.5, M.DEF 7.5 |
| Plate | `plate` | Armor | Ores, Stones, Essences, Bones & Horns | Iron Ingot, Slate Block, Breeze Infusion, Trilobite Carving | HP 10, DEF 12.5, M.DEF 5 |
| Ring | `ring` | Accessory | Crystals, Essences, Ores, Stones | Cut Citrine, Breeze Infusion, Iron Ingot, Slate Block | HP 10 |
| Charm | `charm` | Accessory | Bones & Horns, Fibers, Hides & Scales, Woods | Trilobite Carving, Hemp Cloth, Wolfkin Leather, Cedar Plank | HP 10 |
| Greatsword Orb | `orb-greatsword` | Accessory | Ores, Stones, Woods, Hides & Scales | Iron Ingot, Slate Block, Cedar Plank, Wolfkin Leather | HP 5 |
| Axe Orb | `orb-axe` | Accessory | Ores, Stones, Woods, Hides & Scales | Iron Ingot, Slate Block, Cedar Plank, Wolfkin Leather | HP 5 |
| Lance Orb | `orb-lance` | Accessory | Ores, Stones, Woods, Hides & Scales | Iron Ingot, Slate Block, Cedar Plank, Wolfkin Leather | HP 5 |
| Bow Orb | `orb-bow` | Accessory | Ores, Stones, Woods, Hides & Scales | Iron Ingot, Slate Block, Cedar Plank, Wolfkin Leather | HP 5 |
| Katana Orb | `orb-katana` | Accessory | Ores, Stones, Woods, Hides & Scales | Iron Ingot, Slate Block, Cedar Plank, Wolfkin Leather | HP 5 |
| Fire Orb | `orb-fire` | Accessory | Crystals, Fibers, Essences, Bones & Horns | Cut Citrine, Hemp Cloth, Breeze Infusion, Trilobite Carving | HP 5 |
| Ice Orb | `orb-ice` | Accessory | Crystals, Fibers, Essences, Bones & Horns | Cut Citrine, Hemp Cloth, Breeze Infusion, Trilobite Carving | HP 5 |
| Lightning Orb | `orb-lightning` | Accessory | Crystals, Fibers, Essences, Bones & Horns | Cut Citrine, Hemp Cloth, Breeze Infusion, Trilobite Carving | HP 5 |
| Light Orb | `orb-light` | Accessory | Crystals, Fibers, Essences, Bones & Horns | Cut Citrine, Hemp Cloth, Breeze Infusion, Trilobite Carving | HP 5 |
| Dark Orb | `orb-dark` | Accessory | Crystals, Fibers, Essences, Bones & Horns | Cut Citrine, Hemp Cloth, Breeze Infusion, Trilobite Carving | HP 5 |

A weapon's offense is split over the five weapons of her class (shown that way above).
<!-- /live -->

## Tokens

Fights drop tokens of the stage's **band** (its level's tens). Three kinds:
- **Promotion** tokens rank up classes.
- **Mastery** tokens raise any Weapon, Armor or Accessory Level (D94). Before D94 they were Crafting Tokens, spent at
  the Forge.
- **Cooking** tokens go into dishes.

The Exchange buys and sells them, so two tokens of one kind buy one of another (D80).

<!-- live:tokens -->
| Band | Dropped by stages at | Cooking grades | Promotion | Mastery | Token kinds |
|---|---|---|---|---|---|
| 1 | Lv 1–10 | G1–2 | rank 1 → 2 | 1 → 2, 2 → 3 | 14 |
| 2 | Lv 11–20 | G3–4 | rank 2 → 3 | 3 → 4, 4 → 5 | 14 |
| 3 | Lv 21–30 | G5–6 | rank 3 → 4 | 5 → 6, 6 → 7 | 14 |
| 4 | Lv 31–40 | G7–8 | rank 4 → 5 | 7 → 8, 8 → 9 | 14 |
| 5 | Lv 41–50 | G9–10 | — | 9 → 10 | 9 |

| Kind | Id pattern | Per band | Odds per drop | Used for |
|---|---|---|---|---|
| Promotion | `token-class-<class>-<band>` | 5 (bands 1–4) | 15% | Class rank-ups |
| Mastery | `token-mastery-<band>` | 1 | 42.5% | Weapon, Armor and Accessory Level-ups: from Level L, band ⌈L/2⌉ |
| Cooking | `token-cook-<stat>-<band>` | 8 | 42.5% | Every dish (each stat it feeds) |

| Stage kind | Tokens per first clear |
|---|---|
| Fight | 2 |
| Sub-boss | 3 |
| Vanguard | 3 |
| Boss | 5 |

A stage in waves drops one more token per extra wave: 3 on stages 8 and 9, 7 from the boss.

Replays and Sweeps roll each token at 25% of its odds. Exchange: sell for 20 Laurels a band, buy for 40 a band.
<!-- /live -->
