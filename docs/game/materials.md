# Materials, Star Gems and gear

Everything an Uma gathers, refines, crafts or cuts. Lists are generated from `packages/domain/src/items/` and
`economy/` (`gems.ts`, `gear.ts`). There are no tokens (D105). How the jobs work is in
[loops](loops.md#craft-level).

## Families

Eight families, all on the Wilds page (D144), feed the Forge and the Lapidary alike. Each feeds one of eight stats, has
one site, and has ten grades. Every raw item refines one-for-one into its refined form at the Workbench, in a quarter of
the time it took to gather (D101).

<!-- live:families -->
| Family | Id | Feeds | Site |
|---|---|---|---|
| Hides & Scales | `hides-scales` | HP | Monster Den |
| Essences | `essences` | MP | Ley Spring |
| Ores | `ores` | ATK | Mine |
| Crystals | `crystals` | M.ATK | Crystal Cavern |
| Stones | `stones` | DEF | Quarry |
| Fibers | `fibers` | M.DEF | Meadow |
| Woods | `woods` | Speed | Forest |
| Bones & Horns | `bones-horns` | Limit Break charge | Fossil Dig |
<!-- /live -->

**Symmetry (D86, D144):** every family is used alike by gear and alike by Star Gems, so no site sits idle and none is a
bottleneck. `economy/materials.test.ts` checks it.

## Items by family

<!-- live:items -->
### Hides & Scales (`hides-scales`, HP, Monster Den)

| Grade | Raw | Refined | Unlocks at Craft Lv |
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

| Grade | Raw | Refined | Unlocks at Craft Lv |
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

| Grade | Raw | Refined | Unlocks at Craft Lv |
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

| Grade | Raw | Refined | Unlocks at Craft Lv |
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

| Grade | Raw | Refined | Unlocks at Craft Lv |
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

| Grade | Raw | Refined | Unlocks at Craft Lv |
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

| Grade | Raw | Refined | Unlocks at Craft Lv |
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

| Grade | Raw | Refined | Unlocks at Craft Lv |
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

## Star Gems

Cut at the Lapidary from refined items (D144). Setting one opens a node on the Uma's Observatory map, her Extra Stats
([loops](loops.md#extra-stats-and-gear)). There are 100, one for each node:

| Kind | What it is |
|---|---|
| **Moon** | Eight stats × ten grades. One refined item of the stat's family at the gem's grade; a half-grade side from another family from grade 4, and a second from grade 8 |
| **Bridge** | A pair of neighbouring stats, at grades 3 and 7: one refined item of each family, plus a side at grade 7 |
| **Sun** | All eight stats, at grades 4, 6, 8 and 10: one refined item of every family |

A gem is named for its grade's stone on the Crystal Cavern's ladder and its stat's virtue: HP Vigor, MP Spirit, ATK
Strength, M.ATK Sorcery, DEF Fortitude, M.DEF Resolve, Speed Swiftness, Limit Valor. So "Garnet of Strength" is ATK's
grade 4. Maxing one Uma's map takes 232 refined items, 29 of each family. Each planet has its own gem silhouette and
colour (uma-art 2.8.0, H29): rough at grades 1–3, faceted at 4–6, mounted at 7–8, with legendary glints at 9–10.
Bridges are two-colour twin crystals; Sun gems are gold prisms with more rays at each grade.

<!-- live:gems -->
| Star Gem | Id | Kind | Grade | Feeds | Materials |
|---|---|---|---|---|---|
| Quartz of Vigor | `gem-hp-1` | Moon | 1 | HP | Puffbun Leather |
| Amethyst of Vigor | `gem-hp-2` | Moon | 2 | HP | Boarling Leather |
| Citrine of Vigor | `gem-hp-3` | Moon | 3 | HP | Wolfkin Leather |
| Garnet of Vigor | `gem-hp-4` | Moon | 4 | HP | Lizard Leather, Dew Infusion |
| Emerald of Vigor | `gem-hp-5` | Moon | 5 | HP | Ironback Leather, Breeze Infusion |
| Sapphire of Vigor | `gem-hp-6` | Moon | 6 | HP | Basilisk Leather, Breeze Infusion |
| Ruby of Vigor | `gem-hp-7` | Moon | 7 | HP | Manticore Leather, Ember Infusion |
| Diamond of Vigor | `gem-hp-8` | Moon | 8 | HP | Behemoth Leather, Ember Infusion, Cut Garnet |
| Starstone of Vigor | `gem-hp-9` | Moon | 9 | HP | Wyvern Leather, Tide Infusion, Cut Emerald |
| Philosopher's Stone of Vigor | `gem-hp-10` | Moon | 10 | HP | Dragonhide, Tide Infusion, Cut Emerald |
| Quartz of Spirit | `gem-mp-1` | Moon | 1 | MP | Mist Infusion |
| Amethyst of Spirit | `gem-mp-2` | Moon | 2 | MP | Dew Infusion |
| Citrine of Spirit | `gem-mp-3` | Moon | 3 | MP | Breeze Infusion |
| Garnet of Spirit | `gem-mp-4` | Moon | 4 | MP | Ember Infusion, Tin Ingot |
| Emerald of Spirit | `gem-mp-5` | Moon | 5 | MP | Tide Infusion, Iron Ingot |
| Sapphire of Spirit | `gem-mp-6` | Moon | 6 | MP | Spark Infusion, Iron Ingot |
| Ruby of Spirit | `gem-mp-7` | Moon | 7 | MP | Glimmer Infusion, Silver Ingot |
| Diamond of Spirit | `gem-mp-8` | Moon | 8 | MP | Shadow Infusion, Silver Ingot, Granite Block |
| Starstone of Spirit | `gem-mp-9` | Moon | 9 | MP | Aether Infusion, Cobalt Ingot, Basalt Block |
| Philosopher's Stone of Spirit | `gem-mp-10` | Moon | 10 | MP | Prismatic Infusion, Cobalt Ingot, Basalt Block |
| Quartz of Strength | `gem-atk-1` | Moon | 1 | ATK | Copper Ingot |
| Amethyst of Strength | `gem-atk-2` | Moon | 2 | ATK | Tin Ingot |
| Citrine of Strength | `gem-atk-3` | Moon | 3 | ATK | Iron Ingot |
| Garnet of Strength | `gem-atk-4` | Moon | 4 | ATK | Silver Ingot, Cut Amethyst |
| Emerald of Strength | `gem-atk-5` | Moon | 5 | ATK | Cobalt Ingot, Cut Citrine |
| Sapphire of Strength | `gem-atk-6` | Moon | 6 | ATK | Gold Ingot, Cut Citrine |
| Ruby of Strength | `gem-atk-7` | Moon | 7 | ATK | Platinum Ingot, Cut Garnet |
| Diamond of Strength | `gem-atk-8` | Moon | 8 | ATK | Titanium Ingot, Cut Garnet, Cotton Cloth |
| Starstone of Strength | `gem-atk-9` | Moon | 9 | ATK | Mythril Ingot, Cut Emerald, Wool Cloth |
| Philosopher's Stone of Strength | `gem-atk-10` | Moon | 10 | ATK | Orichalcum Ingot, Cut Emerald, Wool Cloth |
| Quartz of Sorcery | `gem-matk-1` | Moon | 1 | M.ATK | Cut Quartz |
| Amethyst of Sorcery | `gem-matk-2` | Moon | 2 | M.ATK | Cut Amethyst |
| Citrine of Sorcery | `gem-matk-3` | Moon | 3 | M.ATK | Cut Citrine |
| Garnet of Sorcery | `gem-matk-4` | Moon | 4 | M.ATK | Cut Garnet, Sandstone Block |
| Emerald of Sorcery | `gem-matk-5` | Moon | 5 | M.ATK | Cut Emerald, Slate Block |
| Sapphire of Sorcery | `gem-matk-6` | Moon | 6 | M.ATK | Cut Sapphire, Slate Block |
| Ruby of Sorcery | `gem-matk-7` | Moon | 7 | M.ATK | Cut Ruby, Granite Block |
| Diamond of Sorcery | `gem-matk-8` | Moon | 8 | M.ATK | Cut Diamond, Granite Block, Maple Plank |
| Starstone of Sorcery | `gem-matk-9` | Moon | 9 | M.ATK | Cut Starstone, Basalt Block, Oak Plank |
| Philosopher's Stone of Sorcery | `gem-matk-10` | Moon | 10 | M.ATK | Cut Philosopher's Stone, Basalt Block, Oak Plank |
| Quartz of Fortitude | `gem-def-1` | Moon | 1 | DEF | Limestone Block |
| Amethyst of Fortitude | `gem-def-2` | Moon | 2 | DEF | Sandstone Block |
| Citrine of Fortitude | `gem-def-3` | Moon | 3 | DEF | Slate Block |
| Garnet of Fortitude | `gem-def-4` | Moon | 4 | DEF | Granite Block, Burlap |
| Emerald of Fortitude | `gem-def-5` | Moon | 5 | DEF | Basalt Block, Hemp Cloth |
| Sapphire of Fortitude | `gem-def-6` | Moon | 6 | DEF | Marble Block, Hemp Cloth |
| Ruby of Fortitude | `gem-def-7` | Moon | 7 | DEF | Obsidian Block, Cotton Cloth |
| Diamond of Fortitude | `gem-def-8` | Moon | 8 | DEF | Jade Block, Cotton Cloth, Bone Carving |
| Starstone of Fortitude | `gem-def-9` | Moon | 9 | DEF | Runestone Block, Wool Cloth, Tusk Carving |
| Philosopher's Stone of Fortitude | `gem-def-10` | Moon | 10 | DEF | Meteorite Block, Wool Cloth, Tusk Carving |
| Quartz of Resolve | `gem-mdef-1` | Moon | 1 | M.DEF | Linen |
| Amethyst of Resolve | `gem-mdef-2` | Moon | 2 | M.DEF | Burlap |
| Citrine of Resolve | `gem-mdef-3` | Moon | 3 | M.DEF | Hemp Cloth |
| Garnet of Resolve | `gem-mdef-4` | Moon | 4 | M.DEF | Cotton Cloth, Birch Plank |
| Emerald of Resolve | `gem-mdef-5` | Moon | 5 | M.DEF | Wool Cloth, Cedar Plank |
| Sapphire of Resolve | `gem-mdef-6` | Moon | 6 | M.DEF | Alpaca Cloth, Cedar Plank |
| Ruby of Resolve | `gem-mdef-7` | Moon | 7 | M.DEF | Cashmere Cloth, Maple Plank |
| Diamond of Resolve | `gem-mdef-8` | Moon | 8 | M.DEF | Silk, Maple Plank, Lizard Leather |
| Starstone of Resolve | `gem-mdef-9` | Moon | 9 | M.DEF | Moonsilk, Oak Plank, Ironback Leather |
| Philosopher's Stone of Resolve | `gem-mdef-10` | Moon | 10 | M.DEF | Cloudweave, Oak Plank, Ironback Leather |
| Quartz of Swiftness | `gem-speed-1` | Moon | 1 | Speed | Pine Plank |
| Amethyst of Swiftness | `gem-speed-2` | Moon | 2 | Speed | Birch Plank |
| Citrine of Swiftness | `gem-speed-3` | Moon | 3 | Speed | Cedar Plank |
| Garnet of Swiftness | `gem-speed-4` | Moon | 4 | Speed | Maple Plank, Ammonite Carving |
| Emerald of Swiftness | `gem-speed-5` | Moon | 5 | Speed | Oak Plank, Trilobite Carving |
| Sapphire of Swiftness | `gem-speed-6` | Moon | 6 | Speed | Cherry Plank, Trilobite Carving |
| Ruby of Swiftness | `gem-speed-7` | Moon | 7 | Speed | Mahogany Plank, Bone Carving |
| Diamond of Swiftness | `gem-speed-8` | Moon | 8 | Speed | Ebony Plank, Bone Carving, Ember Infusion |
| Starstone of Swiftness | `gem-speed-9` | Moon | 9 | Speed | Elderwood Plank, Tusk Carving, Tide Infusion |
| Philosopher's Stone of Swiftness | `gem-speed-10` | Moon | 10 | Speed | Yggdrasil Plank, Tusk Carving, Tide Infusion |
| Quartz of Valor | `gem-limit-1` | Moon | 1 | Limit Break charge | Shell Carving |
| Amethyst of Valor | `gem-limit-2` | Moon | 2 | Limit Break charge | Ammonite Carving |
| Citrine of Valor | `gem-limit-3` | Moon | 3 | Limit Break charge | Trilobite Carving |
| Garnet of Valor | `gem-limit-4` | Moon | 4 | Limit Break charge | Bone Carving, Boarling Leather |
| Emerald of Valor | `gem-limit-5` | Moon | 5 | Limit Break charge | Tusk Carving, Wolfkin Leather |
| Sapphire of Valor | `gem-limit-6` | Moon | 6 | Limit Break charge | Fang Carving, Wolfkin Leather |
| Ruby of Valor | `gem-limit-7` | Moon | 7 | Limit Break charge | Claw Carving, Lizard Leather |
| Diamond of Valor | `gem-limit-8` | Moon | 8 | Limit Break charge | Tooth Carving, Lizard Leather, Silver Ingot |
| Starstone of Valor | `gem-limit-9` | Moon | 9 | Limit Break charge | Titan Carving, Ironback Leather, Cobalt Ingot |
| Philosopher's Stone of Valor | `gem-limit-10` | Moon | 10 | Limit Break charge | Unicorn Carving, Ironback Leather, Cobalt Ingot |
| Citrine of Vigor & Fortitude | `gem-hp-def-3` | Bridge | 3 | HP, DEF | Wolfkin Leather, Slate Block |
| Ruby of Vigor & Fortitude | `gem-hp-def-7` | Bridge | 7 | HP, DEF | Manticore Leather, Obsidian Block, Ember Infusion |
| Citrine of Fortitude & Resolve | `gem-def-mdef-3` | Bridge | 3 | DEF, M.DEF | Slate Block, Hemp Cloth |
| Ruby of Fortitude & Resolve | `gem-def-mdef-7` | Bridge | 7 | DEF, M.DEF | Obsidian Block, Cashmere Cloth, Cotton Cloth |
| Citrine of Resolve & Spirit | `gem-mdef-mp-3` | Bridge | 3 | M.DEF, MP | Hemp Cloth, Breeze Infusion |
| Ruby of Resolve & Spirit | `gem-mdef-mp-7` | Bridge | 7 | M.DEF, MP | Cashmere Cloth, Glimmer Infusion, Maple Plank |
| Citrine of Spirit & Sorcery | `gem-mp-matk-3` | Bridge | 3 | MP, M.ATK | Breeze Infusion, Cut Citrine |
| Ruby of Spirit & Sorcery | `gem-mp-matk-7` | Bridge | 7 | MP, M.ATK | Glimmer Infusion, Cut Ruby, Silver Ingot |
| Citrine of Sorcery & Strength | `gem-matk-atk-3` | Bridge | 3 | M.ATK, ATK | Cut Citrine, Iron Ingot |
| Ruby of Sorcery & Strength | `gem-matk-atk-7` | Bridge | 7 | M.ATK, ATK | Cut Ruby, Platinum Ingot, Granite Block |
| Citrine of Strength & Swiftness | `gem-atk-speed-3` | Bridge | 3 | ATK, Speed | Iron Ingot, Cedar Plank |
| Ruby of Strength & Swiftness | `gem-atk-speed-7` | Bridge | 7 | ATK, Speed | Platinum Ingot, Mahogany Plank, Cut Garnet |
| Citrine of Swiftness & Valor | `gem-speed-limit-3` | Bridge | 3 | Speed, Limit Break charge | Cedar Plank, Trilobite Carving |
| Ruby of Swiftness & Valor | `gem-speed-limit-7` | Bridge | 7 | Speed, Limit Break charge | Mahogany Plank, Claw Carving, Bone Carving |
| Citrine of Valor & Vigor | `gem-limit-hp-3` | Bridge | 3 | Limit Break charge, HP | Trilobite Carving, Wolfkin Leather |
| Ruby of Valor & Vigor | `gem-limit-hp-7` | Bridge | 7 | Limit Break charge, HP | Claw Carving, Manticore Leather, Lizard Leather |
| Garnet of the Sun | `gem-sun-4` | Sun | 4 | All eight | Lizard Leather, Ember Infusion, Silver Ingot, Cut Garnet, Granite Block, Cotton Cloth, Maple Plank, Bone Carving |
| Sapphire of the Sun | `gem-sun-6` | Sun | 6 | All eight | Basilisk Leather, Spark Infusion, Gold Ingot, Cut Sapphire, Marble Block, Alpaca Cloth, Cherry Plank, Fang Carving |
| Diamond of the Sun | `gem-sun-8` | Sun | 8 | All eight | Behemoth Leather, Shadow Infusion, Titanium Ingot, Cut Diamond, Jade Block, Silk, Ebony Plank, Tooth Carving |
| Philosopher's Stone of the Sun | `gem-sun-10` | Sun | 10 | All eight | Dragonhide, Prismatic Infusion, Orichalcum Ingot, Cut Philosopher's Stone, Meteorite Block, Cloudweave, Yggdrasil Plank, Unicorn Carving |
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

Maxing one Uma's twelve tracks takes 240 refined items, about what her 100 Star Gems take (232). The Uma's Craft
Level gates the grade made (5g − 4), as for every job. Ids are `<type>-g<grade>`; pieces carry no accent.

**What a piece does (D104, D124):**
- **A weapon's Might:** its grade's value added to the offense of hits made with that weapon (D142, D143).
- **Armor:** ATK (physical) or M.ATK (magical) +⌈grade ÷ 2⌉, and its slot's defensive stat +2 a grade (D141). Head DEF,
  body HP, legs MP, arms MDEF, feet Speed.
- **An Orb:** its kind on every hit, for weaknesses only.
- **A Talisman or an Amulet:** the small effect in the table below ([combat](combat.md#damage)).

**Slots and wearing:**
- **Slots:** five weapon slots (her class's), five armor slots (head, body, legs, arms, feet) and two accessory slots
  (any two different types).
- **Wearing a grade:** grade k needs her Weapon Rank for that weapon, her Armor Rank for that armor kind, or her
  Accessory Rank for the accessory's kind, at k or more ([classes](classes.md#ranks-and-levels)).
- **Training pieces:** every Uma holds a grade-0 Training piece of each weapon and armor kind, with no stats. It fills a
  slot until she binds that kind's grade 1, and isn't offered after (D98, D124). A new Uma's armor slots hold her
  starting class's Training pieces: Circlet, Robe, Leggings, Bracers and Slippers for a Mage, Cleric or Summoner (D162).

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

A weapon's Might adds to the offense of the hits made with it, by grade: 1, 4, 8, 12, 19, 26, 35, 45, 57, 68 (D142). Armor adds ATK (physical) or M.ATK (magical), +1 every two grades from grade 1 (5 at grade 10), and its slot's defensive stat +2 a grade (D141). An Uma wears two accessories of different types.
<!-- /live -->

