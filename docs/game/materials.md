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

| Grade | Raw | Refined | Unlocks at profession Lv |
|---|---|---|---|
| 1 | Wheat (`wheat`) | Wheat Flour (`wheat-flour`) | 1 |
| 2 | Oats (`oats`) | Rolled Oats (`rolled-oats`) | 6 |
| 3 | Barley (`barley`) | Pearl Barley (`pearl-barley`) | 11 |
| 4 | Rice (`rice`) | Polished Rice (`polished-rice`) | 16 |
| 5 | Corn (`corn`) | Cornmeal (`cornmeal`) | 21 |
| 6 | Rye (`rye`) | Rye Flour (`rye-flour`) | 26 |
| 7 | Buckwheat (`buckwheat`) | Buckwheat Flour (`buckwheat-flour`) | 31 |
| 8 | Wild Rice (`wild-rice`) | Hulled Wild Rice (`hulled-wild-rice`) | 36 |
| 9 | Moonrice (`moonrice`) | Moonrice Flour (`moonrice-flour`) | 41 |
| 10 | Sunwheat (`sunwheat`) | Sunwheat Flour (`sunwheat-flour`) | 46 |

### Fruits (`fruits`, MP, Orchard)

| Grade | Raw | Refined | Unlocks at profession Lv |
|---|---|---|---|
| 1 | Apple (`apple`) | Apple Preserve (`apple-preserve`) | 1 |
| 2 | Pear (`pear`) | Pear Preserve (`pear-preserve`) | 6 |
| 3 | Peach (`peach`) | Peach Preserve (`peach-preserve`) | 11 |
| 4 | Plum (`plum`) | Plum Preserve (`plum-preserve`) | 16 |
| 5 | Orange (`orange`) | Orange Marmalade (`orange-marmalade`) | 21 |
| 6 | Grape (`grape`) | Grape Jelly (`grape-jelly`) | 26 |
| 7 | Mango (`mango`) | Mango Pulp (`mango-pulp`) | 31 |
| 8 | Pomegranate (`pomegranate`) | Pomegranate Molasses (`pomegranate-molasses`) | 36 |
| 9 | Starpeach (`starpeach`) | Starpeach Nectar (`starpeach-nectar`) | 41 |
| 10 | Golden Apple (`golden-apple`) | Golden Apple Preserve (`golden-apple-preserve`) | 46 |

### Fish (`fish`, ATK, Fishery)

| Grade | Raw | Refined | Unlocks at profession Lv |
|---|---|---|---|
| 1 | Carp (`carp`) | Carp Fillet (`carp-fillet`) | 1 |
| 2 | Trout (`trout`) | Trout Fillet (`trout-fillet`) | 6 |
| 3 | Sardine (`sardine`) | Sardine Fillet (`sardine-fillet`) | 11 |
| 4 | Mackerel (`mackerel`) | Mackerel Fillet (`mackerel-fillet`) | 16 |
| 5 | Salmon (`salmon`) | Salmon Fillet (`salmon-fillet`) | 21 |
| 6 | Sea Bream (`sea-bream`) | Sea Bream Fillet (`sea-bream-fillet`) | 26 |
| 7 | Eel (`eel`) | Eel Fillet (`eel-fillet`) | 31 |
| 8 | Tuna (`tuna`) | Tuna Fillet (`tuna-fillet`) | 36 |
| 9 | Silverfin (`silverfin`) | Silverfin Fillet (`silverfin-fillet`) | 41 |
| 10 | Rainbow Koi (`rainbow-koi`) | Rainbow Koi Fillet (`rainbow-koi-fillet`) | 46 |

### Herbs & Spices (`herbs-spices`, M.ATK, Herb Garden)

| Grade | Raw | Refined | Unlocks at profession Lv |
|---|---|---|---|
| 1 | Basil (`basil`) | Dried Basil (`dried-basil`) | 1 |
| 2 | Mint (`mint`) | Dried Mint (`dried-mint`) | 6 |
| 3 | Rosemary (`rosemary`) | Dried Rosemary (`dried-rosemary`) | 11 |
| 4 | Thyme (`thyme`) | Dried Thyme (`dried-thyme`) | 16 |
| 5 | Ginger (`ginger`) | Ground Ginger (`ground-ginger`) | 21 |
| 6 | Peppercorn (`peppercorn`) | Ground Pepper (`ground-pepper`) | 26 |
| 7 | Cinnamon (`cinnamon`) | Ground Cinnamon (`ground-cinnamon`) | 31 |
| 8 | Saffron (`saffron`) | Saffron Threads (`saffron-threads`) | 36 |
| 9 | Mandrake (`mandrake`) | Mandrake Powder (`mandrake-powder`) | 41 |
| 10 | Phoenix Pepper (`phoenix-pepper`) | Phoenix Spice (`phoenix-spice`) | 46 |

### Vegetables (`vegetables`, DEF, Vegetable Garden)

| Grade | Raw | Refined | Unlocks at profession Lv |
|---|---|---|---|
| 1 | Carrot (`carrot`) | Chopped Carrot (`chopped-carrot`) | 1 |
| 2 | Potato (`potato`) | Diced Potato (`diced-potato`) | 6 |
| 3 | Cabbage (`cabbage`) | Shredded Cabbage (`shredded-cabbage`) | 11 |
| 4 | Onion (`onion`) | Diced Onion (`diced-onion`) | 16 |
| 5 | Tomato (`tomato`) | Tomato Purée (`tomato-puree`) | 21 |
| 6 | Bell Pepper (`bell-pepper`) | Sliced Bell Pepper (`sliced-bell-pepper`) | 26 |
| 7 | Eggplant (`eggplant`) | Sliced Eggplant (`sliced-eggplant`) | 31 |
| 8 | Asparagus (`asparagus`) | Trimmed Asparagus (`trimmed-asparagus`) | 36 |
| 9 | Golden Carrot (`golden-carrot`) | Golden Carrot Purée (`golden-carrot-puree`) | 41 |
| 10 | Emperor Pumpkin (`emperor-pumpkin`) | Pumpkin Purée (`pumpkin-puree`) | 46 |

### Mushrooms (`mushrooms`, M.DEF, Mushroom Cave)

| Grade | Raw | Refined | Unlocks at profession Lv |
|---|---|---|---|
| 1 | Button Mushroom (`button-mushroom`) | Dried Button Mushroom (`dried-button-mushroom`) | 1 |
| 2 | Shiitake (`shiitake`) | Dried Shiitake (`dried-shiitake`) | 6 |
| 3 | Oyster Mushroom (`oyster-mushroom`) | Dried Oyster Mushroom (`dried-oyster-mushroom`) | 11 |
| 4 | Enoki (`enoki`) | Dried Enoki (`dried-enoki`) | 16 |
| 5 | Chanterelle (`chanterelle`) | Dried Chanterelle (`dried-chanterelle`) | 21 |
| 6 | Porcini (`porcini`) | Dried Porcini (`dried-porcini`) | 26 |
| 7 | Morel (`morel`) | Dried Morel (`dried-morel`) | 31 |
| 8 | Truffle (`truffle`) | Shaved Truffle (`shaved-truffle`) | 36 |
| 9 | Glowcap (`glowcap`) | Glowcap Powder (`glowcap-powder`) | 41 |
| 10 | King Reishi (`king-reishi`) | Reishi Powder (`reishi-powder`) | 46 |

### Sweets (`sweets`, Speed, Sugar Grove)

| Grade | Raw | Refined | Unlocks at profession Lv |
|---|---|---|---|
| 1 | Honeycomb (`honeycomb`) | Honey (`honey`) | 1 |
| 2 | Sugarcane (`sugarcane`) | Cane Sugar (`cane-sugar`) | 6 |
| 3 | Sugar Beet (`sugar-beet`) | Beet Sugar (`beet-sugar`) | 11 |
| 4 | Maple Sap (`maple-sap`) | Maple Syrup (`maple-syrup`) | 16 |
| 5 | Cacao Pod (`cacao-pod`) | Chocolate (`chocolate`) | 21 |
| 6 | Vanilla Pod (`vanilla-pod`) | Vanilla Extract (`vanilla-extract`) | 26 |
| 7 | Agave Heart (`agave-heart`) | Agave Syrup (`agave-syrup`) | 31 |
| 8 | Palm Sap (`palm-sap`) | Palm Sugar (`palm-sugar`) | 36 |
| 9 | Fairy Honeycomb (`fairy-honeycomb`) | Fairy Honey (`fairy-honey`) | 41 |
| 10 | Ambrosia Blossom (`ambrosia-blossom`) | Ambrosia (`ambrosia`) | 46 |

### Nuts & Seeds (`nuts-seeds`, Limit Break charge, Nut Grove)

| Grade | Raw | Refined | Unlocks at profession Lv |
|---|---|---|---|
| 1 | Peanut (`peanut`) | Peanut Butter (`peanut-butter`) | 1 |
| 2 | Sunflower Seed (`sunflower-seed`) | Sunflower Oil (`sunflower-oil`) | 6 |
| 3 | Sesame (`sesame`) | Sesame Paste (`sesame-paste`) | 11 |
| 4 | Walnut (`walnut`) | Walnut Paste (`walnut-paste`) | 16 |
| 5 | Chestnut (`chestnut`) | Chestnut Paste (`chestnut-paste`) | 21 |
| 6 | Almond (`almond`) | Almond Paste (`almond-paste`) | 26 |
| 7 | Pistachio (`pistachio`) | Pistachio Paste (`pistachio-paste`) | 31 |
| 8 | Macadamia (`macadamia`) | Macadamia Butter (`macadamia-butter`) | 36 |
| 9 | Thundernut (`thundernut`) | Thundernut Oil (`thundernut-oil`) | 41 |
| 10 | Worldseed (`worldseed`) | Worldseed Oil (`worldseed-oil`) | 46 |

### Hides & Scales (`hides-scales`, HP, Monster Den)

| Grade | Raw | Refined | Unlocks at profession Lv |
|---|---|---|---|
| 1 | Puffbun Pelt (`puffbun-pelt`) | Puffbun Leather (`puffbun-leather`) | 1 |
| 2 | Boarling Hide (`boarling-hide`) | Boarling Leather (`boarling-leather`) | 6 |
| 3 | Wolfkin Pelt (`wolfkin-pelt`) | Wolfkin Leather (`wolfkin-leather`) | 11 |
| 4 | Rock Lizard Scale (`rock-lizard-scale`) | Lizard Leather (`lizard-leather`) | 16 |
| 5 | Ironback Hide (`ironback-hide`) | Ironback Leather (`ironback-leather`) | 21 |
| 6 | Basilisk Scale (`basilisk-scale`) | Basilisk Leather (`basilisk-leather`) | 26 |
| 7 | Manticore Hide (`manticore-hide`) | Manticore Leather (`manticore-leather`) | 31 |
| 8 | Behemoth Hide (`behemoth-hide`) | Behemoth Leather (`behemoth-leather`) | 36 |
| 9 | Wyvern Scale (`wyvern-scale`) | Wyvern Leather (`wyvern-leather`) | 41 |
| 10 | Dragon Scale (`dragon-scale`) | Dragonhide (`dragonhide`) | 46 |

### Essences (`essences`, MP, Ley Spring)

| Grade | Raw | Refined | Unlocks at profession Lv |
|---|---|---|---|
| 1 | Mist Essence (`mist-essence`) | Mist Infusion (`mist-infusion`) | 1 |
| 2 | Dew Essence (`dew-essence`) | Dew Infusion (`dew-infusion`) | 6 |
| 3 | Breeze Essence (`breeze-essence`) | Breeze Infusion (`breeze-infusion`) | 11 |
| 4 | Ember Essence (`ember-essence`) | Ember Infusion (`ember-infusion`) | 16 |
| 5 | Tide Essence (`tide-essence`) | Tide Infusion (`tide-infusion`) | 21 |
| 6 | Spark Essence (`spark-essence`) | Spark Infusion (`spark-infusion`) | 26 |
| 7 | Glimmer Essence (`glimmer-essence`) | Glimmer Infusion (`glimmer-infusion`) | 31 |
| 8 | Shadow Essence (`shadow-essence`) | Shadow Infusion (`shadow-infusion`) | 36 |
| 9 | Aether (`aether`) | Aether Infusion (`aether-infusion`) | 41 |
| 10 | Prismatic Essence (`prismatic-essence`) | Prismatic Infusion (`prismatic-infusion`) | 46 |

### Ores (`ores`, ATK, Mine)

| Grade | Raw | Refined | Unlocks at profession Lv |
|---|---|---|---|
| 1 | Copper Ore (`copper-ore`) | Copper Ingot (`copper-ingot`) | 1 |
| 2 | Tin Ore (`tin-ore`) | Tin Ingot (`tin-ingot`) | 6 |
| 3 | Iron Ore (`iron-ore`) | Iron Ingot (`iron-ingot`) | 11 |
| 4 | Silver Ore (`silver-ore`) | Silver Ingot (`silver-ingot`) | 16 |
| 5 | Cobalt Ore (`cobalt-ore`) | Cobalt Ingot (`cobalt-ingot`) | 21 |
| 6 | Gold Ore (`gold-ore`) | Gold Ingot (`gold-ingot`) | 26 |
| 7 | Platinum Ore (`platinum-ore`) | Platinum Ingot (`platinum-ingot`) | 31 |
| 8 | Titanium Ore (`titanium-ore`) | Titanium Ingot (`titanium-ingot`) | 36 |
| 9 | Mythril Ore (`mythril-ore`) | Mythril Ingot (`mythril-ingot`) | 41 |
| 10 | Orichalcum Ore (`orichalcum-ore`) | Orichalcum Ingot (`orichalcum-ingot`) | 46 |

### Crystals (`crystals`, M.ATK, Crystal Cavern)

| Grade | Raw | Refined | Unlocks at profession Lv |
|---|---|---|---|
| 1 | Quartz (`quartz`) | Cut Quartz (`cut-quartz`) | 1 |
| 2 | Amethyst (`amethyst`) | Cut Amethyst (`cut-amethyst`) | 6 |
| 3 | Citrine (`citrine`) | Cut Citrine (`cut-citrine`) | 11 |
| 4 | Garnet (`garnet`) | Cut Garnet (`cut-garnet`) | 16 |
| 5 | Emerald (`emerald`) | Cut Emerald (`cut-emerald`) | 21 |
| 6 | Sapphire (`sapphire`) | Cut Sapphire (`cut-sapphire`) | 26 |
| 7 | Ruby (`ruby`) | Cut Ruby (`cut-ruby`) | 31 |
| 8 | Diamond (`diamond`) | Cut Diamond (`cut-diamond`) | 36 |
| 9 | Starstone (`starstone`) | Cut Starstone (`cut-starstone`) | 41 |
| 10 | Philosopher's Stone (`philosophers-stone`) | Cut Philosopher's Stone (`cut-philosophers-stone`) | 46 |

### Stones (`stones`, DEF, Quarry)

| Grade | Raw | Refined | Unlocks at profession Lv |
|---|---|---|---|
| 1 | Limestone (`limestone`) | Limestone Block (`limestone-block`) | 1 |
| 2 | Sandstone (`sandstone`) | Sandstone Block (`sandstone-block`) | 6 |
| 3 | Slate (`slate`) | Slate Block (`slate-block`) | 11 |
| 4 | Granite (`granite`) | Granite Block (`granite-block`) | 16 |
| 5 | Basalt (`basalt`) | Basalt Block (`basalt-block`) | 21 |
| 6 | Marble (`marble`) | Marble Block (`marble-block`) | 26 |
| 7 | Obsidian (`obsidian`) | Obsidian Block (`obsidian-block`) | 31 |
| 8 | Jade (`jade`) | Jade Block (`jade-block`) | 36 |
| 9 | Runestone (`runestone`) | Runestone Block (`runestone-block`) | 41 |
| 10 | Meteorite (`meteorite`) | Meteorite Block (`meteorite-block`) | 46 |

### Fibers (`fibers`, M.DEF, Meadow)

| Grade | Raw | Refined | Unlocks at profession Lv |
|---|---|---|---|
| 1 | Flax (`flax`) | Linen (`linen`) | 1 |
| 2 | Jute (`jute`) | Burlap (`burlap`) | 6 |
| 3 | Hemp (`hemp`) | Hemp Cloth (`hemp-cloth`) | 11 |
| 4 | Cotton (`cotton`) | Cotton Cloth (`cotton-cloth`) | 16 |
| 5 | Wool (`wool`) | Wool Cloth (`wool-cloth`) | 21 |
| 6 | Alpaca Fleece (`alpaca-fleece`) | Alpaca Cloth (`alpaca-cloth`) | 26 |
| 7 | Cashmere Fleece (`cashmere-fleece`) | Cashmere Cloth (`cashmere-cloth`) | 31 |
| 8 | Silk Cocoon (`silk-cocoon`) | Silk (`silk`) | 36 |
| 9 | Moonsilk Cocoon (`moonsilk-cocoon`) | Moonsilk (`moonsilk`) | 41 |
| 10 | Cloudfleece (`cloudfleece`) | Cloudweave (`cloudweave`) | 46 |

### Woods (`woods`, Speed, Forest)

| Grade | Raw | Refined | Unlocks at profession Lv |
|---|---|---|---|
| 1 | Pine Log (`pine-log`) | Pine Plank (`pine-plank`) | 1 |
| 2 | Birch Log (`birch-log`) | Birch Plank (`birch-plank`) | 6 |
| 3 | Cedar Log (`cedar-log`) | Cedar Plank (`cedar-plank`) | 11 |
| 4 | Maple Log (`maple-log`) | Maple Plank (`maple-plank`) | 16 |
| 5 | Oak Log (`oak-log`) | Oak Plank (`oak-plank`) | 21 |
| 6 | Cherry Log (`cherry-log`) | Cherry Plank (`cherry-plank`) | 26 |
| 7 | Mahogany Log (`mahogany-log`) | Mahogany Plank (`mahogany-plank`) | 31 |
| 8 | Ebony Log (`ebony-log`) | Ebony Plank (`ebony-plank`) | 36 |
| 9 | Elderwood Log (`elderwood-log`) | Elderwood Plank (`elderwood-plank`) | 41 |
| 10 | Yggdrasil Branch (`yggdrasil-branch`) | Yggdrasil Plank (`yggdrasil-plank`) | 46 |

### Bones & Horns (`bones-horns`, Limit Break charge, Fossil Dig)

| Grade | Raw | Refined | Unlocks at profession Lv |
|---|---|---|---|
| 1 | Seashell (`seashell`) | Shell Carving (`shell-carving`) | 1 |
| 2 | Ammonite (`ammonite`) | Ammonite Carving (`ammonite-carving`) | 6 |
| 3 | Trilobite (`trilobite`) | Trilobite Carving (`trilobite-carving`) | 11 |
| 4 | Fossil Bone (`fossil-bone`) | Bone Carving (`bone-carving`) | 16 |
| 5 | Mammoth Tusk (`mammoth-tusk`) | Tusk Carving (`tusk-carving`) | 21 |
| 6 | Saber Fang (`saber-fang`) | Fang Carving (`fang-carving`) | 26 |
| 7 | Raptor Claw (`raptor-claw`) | Claw Carving (`claw-carving`) | 31 |
| 8 | Tyrant Tooth (`tyrant-tooth`) | Tooth Carving (`tooth-carving`) | 36 |
| 9 | Titan Bone (`titan-bone`) | Titan Carving (`titan-carving`) | 41 |
| 10 | Unicorn Horn (`unicorn-horn`) | Unicorn Carving (`unicorn-carving`) | 46 |
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

Every gear type has its own ten-grade icon row (uma-art 2.5.0, H28), including Boots, Slippers and each Talisman and
Amulet. Physical and magical feet share a silhouette with different materials; accessories have distinct shapes.

Crafted at the Forge (D124, D125): 40 types in ten grades, five physical and five magical in every row:
- ten weapons;
- ten armor pieces;
- twenty accessories (Arms Orbs, Elemental Orbs, Talismans, Amulets).

**Recipes (D125, D139):** two refined items of the grade, one from each half of the Wilds, as one of four pairs:
Ores + Crystals, Woods + Essences, Hides & Scales + Bones & Horns, Stones + Fibers. A type's grades walk through the
pairs in turn, starting at its own place among the types (the table below lists each type's first four). So every
Uma's gear uses all eight Wilds families about equally, whatever her class, armor half or accessories: 24–26 refined
items of each, or 28–32 with two accessories. Spread a roster's Wilds workers evenly and nothing piles up.

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
| Type | Id | Slot | Half | Recipe families, grades 1–4 (then again from grade 5) | Example recipe: grade 3 | At grade 10 |
|---|---|---|---|---|---|---|
| Greatsword | `greatsword-g<grade>` | Weapon | Physical | Woods + Essences → Hides & Scales + Bones & Horns → Stones + Fibers → Ores + Crystals | Slate Block, Hemp Cloth | Might +68 on its hits |
| Axe | `axe-g<grade>` | Weapon | Physical | Hides & Scales + Bones & Horns → Stones + Fibers → Ores + Crystals → Woods + Essences | Iron Ingot, Cut Citrine | Might +68 on its hits |
| Lance | `lance-g<grade>` | Weapon | Physical | Stones + Fibers → Ores + Crystals → Woods + Essences → Hides & Scales + Bones & Horns | Cedar Plank, Breeze Infusion | Might +68 on its hits |
| Bow | `bow-g<grade>` | Weapon | Physical | Ores + Crystals → Woods + Essences → Hides & Scales + Bones & Horns → Stones + Fibers | Wolfkin Leather, Trilobite Carving | Might +68 on its hits |
| Katana | `katana-g<grade>` | Weapon | Physical | Woods + Essences → Hides & Scales + Bones & Horns → Stones + Fibers → Ores + Crystals | Slate Block, Hemp Cloth | Might +68 on its hits |
| Fire Tome | `tome-fire-g<grade>` | Weapon | Magical | Hides & Scales + Bones & Horns → Stones + Fibers → Ores + Crystals → Woods + Essences | Iron Ingot, Cut Citrine | Might +68 on its hits |
| Blizzard Tome | `tome-ice-g<grade>` | Weapon | Magical | Stones + Fibers → Ores + Crystals → Woods + Essences → Hides & Scales + Bones & Horns | Cedar Plank, Breeze Infusion | Might +68 on its hits |
| Thunder Tome | `tome-lightning-g<grade>` | Weapon | Magical | Ores + Crystals → Woods + Essences → Hides & Scales + Bones & Horns → Stones + Fibers | Wolfkin Leather, Trilobite Carving | Might +68 on its hits |
| Light Tome | `tome-light-g<grade>` | Weapon | Magical | Woods + Essences → Hides & Scales + Bones & Horns → Stones + Fibers → Ores + Crystals | Slate Block, Hemp Cloth | Might +68 on its hits |
| Dark Tome | `tome-dark-g<grade>` | Weapon | Magical | Hides & Scales + Bones & Horns → Stones + Fibers → Ores + Crystals → Woods + Essences | Iron Ingot, Cut Citrine | Might +68 on its hits |
| Helm | `helm-g<grade>` | Head | Physical | Stones + Fibers → Ores + Crystals → Woods + Essences → Hides & Scales + Bones & Horns | Cedar Plank, Breeze Infusion | ATK +5, DEF +20 |
| Cuirass | `cuirass-g<grade>` | Body | Physical | Ores + Crystals → Woods + Essences → Hides & Scales + Bones & Horns → Stones + Fibers | Wolfkin Leather, Trilobite Carving | HP +20, ATK +5 |
| Greaves | `greaves-g<grade>` | Legs | Physical | Woods + Essences → Hides & Scales + Bones & Horns → Stones + Fibers → Ores + Crystals | Slate Block, Hemp Cloth | MP +20, ATK +5 |
| Gauntlets | `gauntlets-g<grade>` | Arms | Physical | Hides & Scales + Bones & Horns → Stones + Fibers → Ores + Crystals → Woods + Essences | Iron Ingot, Cut Citrine | ATK +5, M.DEF +20 |
| Boots | `boots-g<grade>` | Feet | Physical | Stones + Fibers → Ores + Crystals → Woods + Essences → Hides & Scales + Bones & Horns | Cedar Plank, Breeze Infusion | ATK +5, Speed +20 |
| Circlet | `circlet-g<grade>` | Head | Magical | Ores + Crystals → Woods + Essences → Hides & Scales + Bones & Horns → Stones + Fibers | Wolfkin Leather, Trilobite Carving | M.ATK +5, DEF +20 |
| Robe | `robe-g<grade>` | Body | Magical | Woods + Essences → Hides & Scales + Bones & Horns → Stones + Fibers → Ores + Crystals | Slate Block, Hemp Cloth | HP +20, M.ATK +5 |
| Leggings | `leggings-g<grade>` | Legs | Magical | Hides & Scales + Bones & Horns → Stones + Fibers → Ores + Crystals → Woods + Essences | Iron Ingot, Cut Citrine | MP +20, M.ATK +5 |
| Bracers | `bracers-g<grade>` | Arms | Magical | Stones + Fibers → Ores + Crystals → Woods + Essences → Hides & Scales + Bones & Horns | Cedar Plank, Breeze Infusion | M.ATK +5, M.DEF +20 |
| Slippers | `slippers-g<grade>` | Feet | Magical | Ores + Crystals → Woods + Essences → Hides & Scales + Bones & Horns → Stones + Fibers | Wolfkin Leather, Trilobite Carving | M.ATK +5, Speed +20 |
| Greatsword Orb | `orb-greatsword-g<grade>` | Accessory (Arms Orb) | Physical | Woods + Essences → Hides & Scales + Bones & Horns → Stones + Fibers → Ores + Crystals | Slate Block, Hemp Cloth | Its kind on every hit, for weaknesses |
| Axe Orb | `orb-axe-g<grade>` | Accessory (Arms Orb) | Physical | Hides & Scales + Bones & Horns → Stones + Fibers → Ores + Crystals → Woods + Essences | Iron Ingot, Cut Citrine | Its kind on every hit, for weaknesses |
| Lance Orb | `orb-lance-g<grade>` | Accessory (Arms Orb) | Physical | Stones + Fibers → Ores + Crystals → Woods + Essences → Hides & Scales + Bones & Horns | Cedar Plank, Breeze Infusion | Its kind on every hit, for weaknesses |
| Bow Orb | `orb-bow-g<grade>` | Accessory (Arms Orb) | Physical | Ores + Crystals → Woods + Essences → Hides & Scales + Bones & Horns → Stones + Fibers | Wolfkin Leather, Trilobite Carving | Its kind on every hit, for weaknesses |
| Katana Orb | `orb-katana-g<grade>` | Accessory (Arms Orb) | Physical | Woods + Essences → Hides & Scales + Bones & Horns → Stones + Fibers → Ores + Crystals | Slate Block, Hemp Cloth | Its kind on every hit, for weaknesses |
| Fire Orb | `orb-fire-g<grade>` | Accessory (Elemental Orb) | Magical | Hides & Scales + Bones & Horns → Stones + Fibers → Ores + Crystals → Woods + Essences | Iron Ingot, Cut Citrine | Its kind on every hit, for weaknesses |
| Ice Orb | `orb-ice-g<grade>` | Accessory (Elemental Orb) | Magical | Stones + Fibers → Ores + Crystals → Woods + Essences → Hides & Scales + Bones & Horns | Cedar Plank, Breeze Infusion | Its kind on every hit, for weaknesses |
| Lightning Orb | `orb-lightning-g<grade>` | Accessory (Elemental Orb) | Magical | Ores + Crystals → Woods + Essences → Hides & Scales + Bones & Horns → Stones + Fibers | Wolfkin Leather, Trilobite Carving | Its kind on every hit, for weaknesses |
| Light Orb | `orb-light-g<grade>` | Accessory (Elemental Orb) | Magical | Woods + Essences → Hides & Scales + Bones & Horns → Stones + Fibers → Ores + Crystals | Slate Block, Hemp Cloth | Its kind on every hit, for weaknesses |
| Dark Orb | `orb-dark-g<grade>` | Accessory (Elemental Orb) | Magical | Hides & Scales + Bones & Horns → Stones + Fibers → Ores + Crystals → Woods + Essences | Iron Ingot, Cut Citrine | Its kind on every hit, for weaknesses |
| Vital Talisman | `talisman-vital-g<grade>` | Accessory (Talisman) | Physical | Stones + Fibers → Ores + Crystals → Woods + Essences → Hides & Scales + Bones & Horns | Cedar Plank, Breeze Infusion | heals 5% of her HP a round |
| Vampire Talisman | `talisman-vampire-g<grade>` | Accessory (Talisman) | Physical | Ores + Crystals → Woods + Essences → Hides & Scales + Bones & Horns → Stones + Fibers | Wolfkin Leather, Trilobite Carving | heals 20% of physical damage dealt |
| Bulwark Talisman | `talisman-bulwark-g<grade>` | Accessory (Talisman) | Physical | Woods + Essences → Hides & Scales + Bones & Horns → Stones + Fibers → Ores + Crystals | Slate Block, Hemp Cloth | a shield of 20% of her HP against physical damage |
| Iron Talisman | `talisman-iron-g<grade>` | Accessory (Talisman) | Physical | Hides & Scales + Bones & Horns → Stones + Fibers → Ores + Crystals → Woods + Essences | Iron Ingot, Cut Citrine | 15% less physical damage taken |
| Thorn Talisman | `talisman-thorn-g<grade>` | Accessory (Talisman) | Physical | Stones + Fibers → Ores + Crystals → Woods + Essences → Hides & Scales + Bones & Horns | Cedar Plank, Breeze Infusion | returns 30% of physical damage taken |
| Spring Amulet | `amulet-spring-g<grade>` | Accessory (Amulet) | Magical | Ores + Crystals → Woods + Essences → Hides & Scales + Bones & Horns → Stones + Fibers | Wolfkin Leather, Trilobite Carving | restores 10 MP a round |
| Siphon Amulet | `amulet-siphon-g<grade>` | Accessory (Amulet) | Magical | Woods + Essences → Hides & Scales + Bones & Horns → Stones + Fibers → Ores + Crystals | Slate Block, Hemp Cloth | restores MP as 5% of magical damage dealt |
| Veil Amulet | `amulet-veil-g<grade>` | Accessory (Amulet) | Magical | Hides & Scales + Bones & Horns → Stones + Fibers → Ores + Crystals → Woods + Essences | Iron Ingot, Cut Citrine | a shield of 20% of her HP against magical damage |
| Ward Amulet | `amulet-ward-g<grade>` | Accessory (Amulet) | Magical | Stones + Fibers → Ores + Crystals → Woods + Essences → Hides & Scales + Bones & Horns | Cedar Plank, Breeze Infusion | 15% less magical damage taken |
| Mirror Amulet | `amulet-mirror-g<grade>` | Accessory (Amulet) | Magical | Ores + Crystals → Woods + Essences → Hides & Scales + Bones & Horns → Stones + Fibers | Wolfkin Leather, Trilobite Carving | returns 30% of magical damage taken |

A weapon's Might adds to the offense of the hits made with it, by grade: 1, 4, 7, 12, 18, 26, 34, 45, 55, 68 (D142). Armor adds ATK (physical) or M.ATK (magical), +1 every two grades from grade 2 (5 at grade 10, D142), and its slot's defensive stat +2 a grade (D141). An Uma wears two accessories of different types.
<!-- /live -->

