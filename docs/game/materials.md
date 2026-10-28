# Materials, made items and gear

Everything an Uma gathers, processes or makes, and what the made items do. The lists are generated from
`packages/domain/src/items/` (`lines.ts`, `made-id.ts`, `made.ts`, `made-v4.ts`) and `economy/` (`places-v4.ts`,
`professions.ts`, `grades.ts`, `accessories.ts`, `planet.ts`). How a job runs, Craft Level and the trades are in
[loops](loops.md#craft-level); prices in [loops](loops.md#the-exchange); the place pages in [sections](sections.md).
This is the Wilds as they play since save v31 (H114, D230; the design is
[farm-by-line.md](../design/tier-rework/farm-by-line.md)).

## Lines

Five lines, each one trade's (FL25–FL27). A line is worked at three places in a row: its **gathering place** gathers raw
items, its **workbench** processes them, and its **making place** makes the line's item from refined ones. Each place
does one kind of job, and no place touches another line. Each line has **ten grades**, a raw item and its refined form
each, from one uma-art family; every world, Tiers 2 and 3 included, uses the same fifty pairs (FL8). Grade g opens at
**Craft Lv 5g − 4** to gather, to process and to make (FL6).

<!-- live:families -->
| Line | Gathered by | Processed at | Made at | Makes | Raw, G1 → G10 |
|---|---|---|---|---|---|
| Metal | Mining, the Mine | the Mine Workbench (Smelting) | the Weapon Forge (Arms Crafting) | Arms Gems | Copper Ore, Tin Ore, Iron Ore, Silver Ore, Cobalt Ore, Gold Ore, Platinum Ore, Titanium Ore, Mythril Ore, Orichalcum Ore |
| Wood | Wood Chopping, the Forest | the Forest Workbench (Sawing) | the Armorer (Armor Crafting) | Armor Fittings | Pine Log, Birch Log, Cedar Log, Maple Log, Oak Log, Cherry Log, Mahogany Log, Ebony Log, Elderwood Log, Yggdrasil Branch |
| Vegetables | Farming, the Fields | the Fields Workbench (Prepping) | the Tome Forge (Tome Crafting) | Tome Ink | Carrot, Potato, Cabbage, Onion, Tomato, Bell Pepper, Eggplant, Asparagus, Golden Carrot, Emperor Pumpkin |
| Fish | Fishing, the Fishery | the Fishery Workbench (Filleting) | the Charm Forge (Accessory Crafting) | Accessory Settings | Carp, Trout, Sardine, Mackerel, Salmon, Sea Bream, Eel, Tuna, Silverfin, Rainbow Koi |
| Stone | Hunting, the Monster Den | the Den Workbench (Stonecutting) | the Lapidary (Jewel Crafting) | Planet Jewels and Moon Jewels | Quartz, Amethyst, Citrine, Garnet, Emerald, Sapphire, Ruby, Diamond, Starstone, Philosopher's Stone |
<!-- /live -->

- **Processing** turns one raw item into its refined form.
- **A made item of grade g** takes its line's refined items of grade g only (FL7). A jewel's grade is its node's.
- **Every step is equal** (FL28): gathering one raw item, processing one, and each refined item in a recipe all take one
  step, 36 minutes at Craft Lv 1 falling to 24 at Lv 50, before the place's ×1.25. A refined item costs three steps in
  all: 108 minutes of work at Craft Lv 1, 72 at Lv 50.

## Items by line

Ids are uma-art's own (its `items` atlas), each name comes from its id ("Tomato Purée"), and each icon is its family's
frame at its grade. Save v30 moved R2's two types a line a tier onto these grades
([loops](loops.md#the-farm-by-line-save-v30)).

<!-- live:items -->
### Metal (Mining, the Mine; the Mine Workbench (Smelting); the Weapon Forge (Arms Crafting))

| Grade | Raw | Refined | Opens at Craft Lv |
|---|---|---|---|
| G1 | Copper Ore (`copper-ore`) | Copper Ingot (`copper-ingot`) | 1 |
| G2 | Tin Ore (`tin-ore`) | Tin Ingot (`tin-ingot`) | 6 |
| G3 | Iron Ore (`iron-ore`) | Iron Ingot (`iron-ingot`) | 11 |
| G4 | Silver Ore (`silver-ore`) | Silver Ingot (`silver-ingot`) | 16 |
| G5 | Cobalt Ore (`cobalt-ore`) | Cobalt Ingot (`cobalt-ingot`) | 21 |
| G6 | Gold Ore (`gold-ore`) | Gold Ingot (`gold-ingot`) | 26 |
| G7 | Platinum Ore (`platinum-ore`) | Platinum Ingot (`platinum-ingot`) | 31 |
| G8 | Titanium Ore (`titanium-ore`) | Titanium Ingot (`titanium-ingot`) | 36 |
| G9 | Mythril Ore (`mythril-ore`) | Mythril Ingot (`mythril-ingot`) | 41 |
| G10 | Orichalcum Ore (`orichalcum-ore`) | Orichalcum Ingot (`orichalcum-ingot`) | 46 |

### Wood (Wood Chopping, the Forest; the Forest Workbench (Sawing); the Armorer (Armor Crafting))

| Grade | Raw | Refined | Opens at Craft Lv |
|---|---|---|---|
| G1 | Pine Log (`pine-log`) | Pine Plank (`pine-plank`) | 1 |
| G2 | Birch Log (`birch-log`) | Birch Plank (`birch-plank`) | 6 |
| G3 | Cedar Log (`cedar-log`) | Cedar Plank (`cedar-plank`) | 11 |
| G4 | Maple Log (`maple-log`) | Maple Plank (`maple-plank`) | 16 |
| G5 | Oak Log (`oak-log`) | Oak Plank (`oak-plank`) | 21 |
| G6 | Cherry Log (`cherry-log`) | Cherry Plank (`cherry-plank`) | 26 |
| G7 | Mahogany Log (`mahogany-log`) | Mahogany Plank (`mahogany-plank`) | 31 |
| G8 | Ebony Log (`ebony-log`) | Ebony Plank (`ebony-plank`) | 36 |
| G9 | Elderwood Log (`elderwood-log`) | Elderwood Plank (`elderwood-plank`) | 41 |
| G10 | Yggdrasil Branch (`yggdrasil-branch`) | Yggdrasil Plank (`yggdrasil-plank`) | 46 |

### Vegetables (Farming, the Fields; the Fields Workbench (Prepping); the Tome Forge (Tome Crafting))

| Grade | Raw | Refined | Opens at Craft Lv |
|---|---|---|---|
| G1 | Carrot (`carrot`) | Chopped Carrot (`chopped-carrot`) | 1 |
| G2 | Potato (`potato`) | Diced Potato (`diced-potato`) | 6 |
| G3 | Cabbage (`cabbage`) | Shredded Cabbage (`shredded-cabbage`) | 11 |
| G4 | Onion (`onion`) | Diced Onion (`diced-onion`) | 16 |
| G5 | Tomato (`tomato`) | Tomato Purée (`tomato-puree`) | 21 |
| G6 | Bell Pepper (`bell-pepper`) | Sliced Bell Pepper (`sliced-bell-pepper`) | 26 |
| G7 | Eggplant (`eggplant`) | Sliced Eggplant (`sliced-eggplant`) | 31 |
| G8 | Asparagus (`asparagus`) | Trimmed Asparagus (`trimmed-asparagus`) | 36 |
| G9 | Golden Carrot (`golden-carrot`) | Golden Carrot Purée (`golden-carrot-puree`) | 41 |
| G10 | Emperor Pumpkin (`emperor-pumpkin`) | Pumpkin Purée (`pumpkin-puree`) | 46 |

### Fish (Fishing, the Fishery; the Fishery Workbench (Filleting); the Charm Forge (Accessory Crafting))

| Grade | Raw | Refined | Opens at Craft Lv |
|---|---|---|---|
| G1 | Carp (`carp`) | Carp Fillet (`carp-fillet`) | 1 |
| G2 | Trout (`trout`) | Trout Fillet (`trout-fillet`) | 6 |
| G3 | Sardine (`sardine`) | Sardine Fillet (`sardine-fillet`) | 11 |
| G4 | Mackerel (`mackerel`) | Mackerel Fillet (`mackerel-fillet`) | 16 |
| G5 | Salmon (`salmon`) | Salmon Fillet (`salmon-fillet`) | 21 |
| G6 | Sea Bream (`sea-bream`) | Sea Bream Fillet (`sea-bream-fillet`) | 26 |
| G7 | Eel (`eel`) | Eel Fillet (`eel-fillet`) | 31 |
| G8 | Tuna (`tuna`) | Tuna Fillet (`tuna-fillet`) | 36 |
| G9 | Silverfin (`silverfin`) | Silverfin Fillet (`silverfin-fillet`) | 41 |
| G10 | Rainbow Koi (`rainbow-koi`) | Rainbow Koi Fillet (`rainbow-koi-fillet`) | 46 |

### Stone (Hunting, the Monster Den; the Den Workbench (Stonecutting); the Lapidary (Jewel Crafting))

| Grade | Raw | Refined | Opens at Craft Lv |
|---|---|---|---|
| G1 | Quartz (`quartz`) | Cut Quartz (`cut-quartz`) | 1 |
| G2 | Amethyst (`amethyst`) | Cut Amethyst (`cut-amethyst`) | 6 |
| G3 | Citrine (`citrine`) | Cut Citrine (`cut-citrine`) | 11 |
| G4 | Garnet (`garnet`) | Cut Garnet (`cut-garnet`) | 16 |
| G5 | Emerald (`emerald`) | Cut Emerald (`cut-emerald`) | 21 |
| G6 | Sapphire (`sapphire`) | Cut Sapphire (`cut-sapphire`) | 26 |
| G7 | Ruby (`ruby`) | Cut Ruby (`cut-ruby`) | 31 |
| G8 | Diamond (`diamond`) | Cut Diamond (`cut-diamond`) | 36 |
| G9 | Starstone (`starstone`) | Cut Starstone (`cut-starstone`) | 41 |
| G10 | Philosopher's Stone (`philosophers-stone`) | Cut Philosopher's Stone (`cut-philosophers-stone`) | 46 |
<!-- /live -->

## Made items

Each making place makes one thing from its own line (FL3):

| Made item | Ids | Made at | From | Does |
|---|---|---|---|---|
| Arms Gem G1–G10 | `weapon-gem-g1` … `weapon-gem-g10` | Weapon Forge | 7 Ingots | Raises an Arms weapon (Greatsword, Axe, Lance, Bow, Katana) one grade |
| Tome Ink G1–G10 | `tome-ink-g1` … `tome-ink-g10` | Tome Forge | 7 vegetable cuts | Raises a Tome (Fire, Blizzard, Thunder, Light, Dark) one grade |
| Armor Fittings G1–G10 | `armor-fittings-g1` … `armor-fittings-g10` | Armorer | 2 Planks | Raises an armor slot one grade |
| Accessory Setting G1–G10 | `accessory-setting-g1` … `accessory-setting-g10` | Charm Forge | 10 Fillets | Raises her accessory slot one grade |
| Planet Jewel I–V | `jewel-planet-1` … `jewel-planet-5` | Lapidary | 10 cut stones | Opens Planet I–V |
| Moon Jewel I–V | `jewel-moon-1` … `jewel-moon-5` | Lapidary | 4 cut stones | Opens a moon's node I–V; II and IV also her moon's I and II |

- **One recipe an item, the same at every grade and in every world** (FL9, `RECIPE_V4`): the refined items of the item's
  grade. Every recipe is listed under [jewels](#jewels) and [gear](#gear).
- **The Arms Gem keeps R2's Weapon Gem ids:** it raises Arms only, and Tome Ink raises Tomes (FL4).
- **Making one** takes one step for each refined item in it: an Arms Gem or Tome Ink 7, Armor Fittings 2, an Accessory
  Setting or a Planet Jewel 10, a Moon Jewel 4. The job sizes follow from that ([loops](loops.md#craft-level)).
- **Icons:** the gear rows of uma-art's `gear` atlas for a slot's grade, its `items` atlas for made items (Tome Ink
  borrows the essences' infusion bottles, FL15).
- Made items wait in the Warehouse with the materials until a grade is raised or a jewel is set. They sell for 6 + 6 ×
  their grade Laurels, × the world's tier.

### What a maxed Uma takes

G0 to G10 on her three weapons, five armor slots and accessory slot, and the whole Extra Stats map (D230's per-Uma
review; the ledger is `economy/professions-v4.sim.ts`):

| Upgrade | Made items | Refined each | Refined in all | Line |
|---|---|---|---|---|
| Three weapons | 30 | 7 | 210 | Metal for an Arm, Vegetables for a Tome |
| Five armor slots | 50 | 2 | 100 | Wood |
| One accessory slot | 10 | 10 | 100 | Fish |
| The Planet, I–V | 5 | 10 | 50 | Stone |
| Three moons, I–V each, and her moon's two | 17 | 4 | 68 | Stone |

By her class, in refined items a line:

| Her class (her slots) | Metal | Vegetables | Wood | Fish | Stone |
|---|---|---|---|---|---|
| Brawler (3 Arms) | 210 | 0 | 100 | 100 | 118 |
| Spell Blade, Paladin (2 Arms, 1 Tome) | 140 | 70 | 100 | 100 | 118 |
| Summoner, Cleric (1 Arm, 2 Tomes) | 70 | 140 | 100 | 100 | 118 |
| Mage (3 Tomes) | 0 | 210 | 100 | 100 | 118 |

Averaged over a roster's classes, each weapon line carries about 105 refined items an Uma, close to Wood's and Fish's
100, so the five trades get about the same work ([pacing](../design/pacing.md)).

### Jewels

A jewel's grade is its node's: Planet n is grade 2n − 1, a moon's node n grade 2n. A Moon Jewel opens node n of any of
the three moons, picked when it's set; Moon Jewels II and IV can open her own moon's I and II instead. Setting one uses it
up ([loops](loops.md#extra-stats-and-gear)).

<!-- live:gems -->
| Jewel | Id | Opens | Grade | Uma Lv | Recipe |
|---|---|---|---|---|---|
| Planet Jewel I | `jewel-planet-1` | Planet I | 1 | 1 | 10× Cut Quartz |
| Planet Jewel II | `jewel-planet-2` | Planet II | 3 | 11 | 10× Cut Citrine |
| Planet Jewel III | `jewel-planet-3` | Planet III | 5 | 21 | 10× Cut Emerald |
| Planet Jewel IV | `jewel-planet-4` | Planet IV | 7 | 31 | 10× Cut Ruby |
| Planet Jewel V | `jewel-planet-5` | Planet V | 9 | 41 | 10× Cut Starstone |
| Moon Jewel I | `jewel-moon-1` | node I of a moon | 2 | 6 | 4× Cut Amethyst |
| Moon Jewel II | `jewel-moon-2` | node II of a moon; her moon's I | 4 | 16 | 4× Cut Garnet |
| Moon Jewel III | `jewel-moon-3` | node III of a moon | 6 | 26 | 4× Cut Sapphire |
| Moon Jewel IV | `jewel-moon-4` | node IV of a moon; her moon's II | 8 | 36 | 4× Cut Diamond |
| Moon Jewel V | `jewel-moon-5` | node V of a moon | 10 | 46 | 4× Cut Philosopher's Stone |
<!-- /live -->

## Gear

**Grades, not pieces** (WP2, WP3; `economy/grades.ts`, `save/forge.ts`): every Uma holds a grade on each of the ten
weapons, her five armor slots (head, body, legs, arms, feet) and her one accessory slot, from G0 to G10. A made item of
the next grade raises one of them a grade; nothing is crafted, bound or worn out, and gear has no ranks (Weapon, Armor and
Accessory Ranks retired in R2, D218).

- **The gate:** grade g opens at **Uma Lv 5g − 4** (1, 6, 11 … 46).
- **What raises it** (FL4): an Arms weapon takes Arms Gems, a Tome Tome Ink, an armor slot Armor Fittings, the accessory
  slot Accessory Settings, each of the grade it reaches. A climb of several grades at once takes each grade's item, and
  says what's missing ("Needs Lv 26", "Needs 1 Arms Gem G3", "Needs Tome Ink G2 and G3").
- **A weapon's Might:** its grade's value, added to the offense of her hits with that weapon, × the tier
  ([combat](combat.md#damage)). She fights with her class's three weapons; a weapon she doesn't slot keeps its grade.
- **Armor:** each slot adds its stat (head DEF, body HP, legs MP, arms M.DEF, feet Speed) and ATK or M.ATK by her class's
  half: a physical class's armor gives ATK, a magical class's (Mage, Cleric, Summoner) M.ATK. Switching class switches the
  half; the grades stay.
- **The accessory slot:** its grade, and a family she sets freely (WP19, `setAccessoryForm`): the **Pendant** (flat
  offense on her three weapons' kinds), the **Orb** (flat offense on one of them), the **Bell** (a follow-up strike with
  her weapon of its kind when her act includes an Attack) or the **Insignia** (more damage to sub-bosses and bosses). An
  Orb or a Bell takes one of her active class's three kinds (D223); one left on a kind she no longer holds stays set and
  does nothing. G0 does nothing. A fight keeps the form and grades she had when it began.
- **Her signature** (WP33, UT7): her knack names one family ([classes](classes.md#her-calling-and-her-template)). While
  she wears it at G1 or above, her ATK and M.ATK rise 0.2 a level × the tier. The Gear tab puts that family first, marked
  ★, and her standard preset wears it.
- **On Ascend** every grade starts at G0 in the new tier, and the made items her grades used go back to the old world's
  Warehouse ([loops](loops.md#the-rift)).

**Colors by kind** (D234, uma-art 2.15.0): a Tome wears its element's color and an Arm its own, beside its twin
element's: the Greatsword orange (Fire), the Lance green (Lightning), the Axe purple (Ice), the Bow pale jade (Light) and
the Katana deep rose (Dark). The color is the same at every grade; the grade shows in the fittings (a Tome's gem
fittings; an Arm's hilt, guard or tips in the grade's ingot, copper to orichalcum). An Arm's Orb wears its color. The
small kind glyphs on every screen use the same colors: the art's tones in dark mode, deeper ones in light mode.

<!-- live:gear -->
| Grade | Opens at Lv | Weapon Might (Tier 1 · 2 · 3) | Armor: offense a piece | Head DEF | Body HP | Legs MP | Arms M.DEF | Feet Speed |
|---|---|---|---|---|---|---|---|---|
| 1 | 1 | 1 · 2 · 3 | 1 | 4 | 15 | 3 | 4 | 2 |
| 2 | 6 | 4 · 7 · 10 | 1 | 8 | 30 | 6 | 8 | 4 |
| 3 | 11 | 8 · 14 · 21 | 2 | 12 | 45 | 9 | 12 | 6 |
| 4 | 16 | 12 · 22 · 31 | 2 | 16 | 60 | 12 | 16 | 8 |
| 5 | 21 | 19 · 34 · 49 | 3 | 20 | 75 | 15 | 20 | 10 |
| 6 | 26 | 26 · 47 · 68 | 3 | 24 | 90 | 18 | 24 | 12 |
| 7 | 31 | 35 · 63 · 91 | 4 | 28 | 105 | 21 | 28 | 14 |
| 8 | 36 | 45 · 81 · 117 | 4 | 32 | 120 | 24 | 32 | 16 |
| 9 | 41 | 57 · 103 · 148 | 5 | 36 | 135 | 27 | 36 | 18 |
| 10 | 46 | 68 · 122 · 177 | 5 | 40 | 150 | 30 | 40 | 20 |

Each armor piece adds its offense to ATK on a physical Uma and to M.ATK on a magical one (her class's half), and its slot's stat. Armor's values × 1, 1.8, 2.6 in Tiers 1, 2 and 3 (Feet Speed doesn't scale).

What raises a slot one grade, in every world:

| Grade | Arms Gem (an Arms weapon) | Tome Ink (a Tome) | Armor Fittings | Accessory Setting |
|---|---|---|---|---|
| 1 | 7× Copper Ingot | 7× Chopped Carrot | 2× Pine Plank | 10× Carp Fillet |
| 2 | 7× Tin Ingot | 7× Diced Potato | 2× Birch Plank | 10× Trout Fillet |
| 3 | 7× Iron Ingot | 7× Shredded Cabbage | 2× Cedar Plank | 10× Sardine Fillet |
| 4 | 7× Silver Ingot | 7× Diced Onion | 2× Maple Plank | 10× Mackerel Fillet |
| 5 | 7× Cobalt Ingot | 7× Tomato Purée | 2× Oak Plank | 10× Salmon Fillet |
| 6 | 7× Gold Ingot | 7× Sliced Bell Pepper | 2× Cherry Plank | 10× Sea Bream Fillet |
| 7 | 7× Platinum Ingot | 7× Sliced Eggplant | 2× Mahogany Plank | 10× Eel Fillet |
| 8 | 7× Titanium Ingot | 7× Trimmed Asparagus | 2× Ebony Plank | 10× Tuna Fillet |
| 9 | 7× Mythril Ingot | 7× Golden Carrot Purée | 2× Elderwood Plank | 10× Silverfin Fillet |
| 10 | 7× Orichalcum Ingot | 7× Pumpkin Purée | 2× Yggdrasil Plank | 10× Rainbow Koi Fillet |

Accessory families (one slot, its family, form and kind a setting changed freely outside fights; the grade is the slot's):

| Family | Base form | G1 → G10 (Tier 1) |
|---|---|---|
| Pendant | Flat offense on each of her three weapons' kinds | 1, 1, 2, 2, 4, 5, 7, 9, 12, 14 |
| Orb | Flat offense on one kind she sets, one of her three weapons’ kinds | 1, 2, 3, 5, 8, 10, 14, 18, 23, 27 |
| Bell | When her act includes an Attack, her weapon of its kind strikes again at a share of an Attack | 0.1 a grade × her hand (1 at G10), every tier |
| Insignia | Her hits on sub-bosses and bosses hit harder | +1.5% a grade (+15% at G10), every tier |

Her signature: while she wears her knack's family, ATK and M.ATK +2 · +6 · +10 at Lv 10 · 30 · 50 (0.2 a level × the tier).
<!-- /live -->
