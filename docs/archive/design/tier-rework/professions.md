# Professions: five trades, ten places, art we already have

Superseded by [profession-progression.md](../../../design/tier-rework/profession-progression.md) (2026-10-24); kept as history.

> **Revised after the owner's first review, 2026-10-22. Nothing here is built.** One of the six Tier rework docs
> ([the brief](../../../design/tier-rework/README.md)). It answers the owner's Professions points, starts from the brief's §2 frame, and lists what
> it needs from the other docs under [Assumes](#9-assumes). It makes the items [gear.md](gear.md) (GE12) and
> [extra-stats.md](extra-stats.md) (ES7) drafted, and takes each Uma's fight type from [variance.md](variance.md)'s
> Calling. Calls are numbered **PR1**, **PR2** … with a recommendation each ([Decisions](#12-decisions)).
>
> **The owner's review** found the draft's 40, 60 and 80 huts too many things to track, and asked to reuse the farm's
> and the Wilds' art. [§0](#0-after-the-owners-review) compares three structures and recommends **one existing building
> per profession, with four work slots inside**: ten places on the Wilds in every tier, 40 slots, every place an
> uma-art building that exists today and every material an item icon that exists today. No kit change, no new art. The
> economy doesn't move: one Uma maxed is 485 refined items (493 with her own moon), 822 hours. Calls the review changed
> say "Changed after owner review (2026-10-22)"; the cross-reference's changes keep their "Changed in cross-reference".
>
> **Previews:** [the Wilds map, the reused art and the options](../../../design/tier-rework/previews/professions-map.html) ·
> [gathering → processing → making → what she wears](../../../design/tier-rework/previews/professions-flow.html) ·
> [demand against supply](../../../design/tier-rework/previews/professions-demand.html).

## 0. After the owner's review

| The owner (2026-10-22) | Answered in |
|---|---|
| "This one feels really blown up, maybe way too much for how many structures to keep track of" | §0.1–§0.2: three structures counted; ten places, four slots each, the same in every tier (PR4, PR5, PR10) |
| "Even if we deleted the farm, all assets still exist … fully reuse them and only author a small set" | §0.3: every place an existing building frame, every material an existing icon; nothing new to draw (PR6, PR7) |

### 0.1 Three structures, counted

All three keep the ten professions, one trade per Uma by her calling, two material types a gathering profession in
Tier 1, the recipes and the demand. They differ only in what stands on the map.

- **A. Ten workshops** (recommended): one existing building per profession, its work slots inside. The owner's "four
  smaller buildings" become **four slots**. A tier adds a material pair, never a building.
- **B. Five trade lodges:** one place per trade, drawn as its gathering site; any of its 8 slots gathers or makes.
- **C. Five sites and today's three stations:** the five gathering places, then the Workbench (processing), the Forge
  (weapon, armor *and* accessory crafting, 12 slots) and the Lapidary (jewels).

| Things to track | Today | The draft (yards and huts) | **A. Ten workshops** | B. Five lodges | C. Sites + 3 stations |
|---|---|---|---|---|---|
| Places on the Wilds | 11 | 10 | **10** | 5 | 8 |
| Buildings drawn, Tier 1 · 2 · 3 | 11 | 40 · 60 · 80 | **10 · 10 · 10** | 5 · 5 · 5 | 8 · 8 · 8 |
| Work slots, Tier 1 · 2 · 3 | 33–55 | 40 · 60 · 80 | **40 · 40 · 40** | 40 · 40 · 40 | 40 · 40 · 40 |
| Slots a place · pip rows | 3–5 · 1–2 | 4 · 6 · 8 · 1 row, "+N" from Tier 2 | **4 · 1 row** | 8 · 2 rows | 4, the Forge 12 · its pips run past the kit's eight |
| Upgrades | 22 | 0 | **0** | 0 | 0 |
| Material types, Tier 1 · 2 · 3 | 160 | 20 · 40 · 60 | **20 · 40 · 60** | 20 · 40 · 60 | 20 · 40 · 60 |
| Job kinds a place offers | 1 | 1 | **1** | 2 (gather or make) | 1 (the Forge: three lines) |
| Places an Uma works, Tier 1 · 2+ | 11 | 2 · 3 | **2 · 3** | 1 · 2 | 2 · 3 |
| Pages to check a session | 11 | 10 (40 hut rows) | **10** | 5 | 8 |
| Professions with a place of their own | — | 10 | **10** | 0 (two a place) | 7 |
| Kit change · new art | — | Hut option · 10 hut tiles, 10 item icons | **None · none** | None · none | None · none |
| **In all, Tier 1 · Tier 3** (buildings + material types + job kinds + upgrades) | 197 | 63 · 143 | **33 · 73** | 28 · 68 | 31 · 71 |

### 0.2 The call: A, ten workshops

- **Forty structures become ten and stay ten.** The map holds what it holds today, minus upgrades. One row of four pips
  a place fits the measured Wilds column (592 px of 675, [second profession](../second-profession.md) §7) in every
  tier, with no "+N".
- **One profession, one place, one job.** Every page is today's facility page: one picker, one kind of job, the targets
  strip. B puts two jobs on one page and leaves half of each trade undrawn; C crowds three professions into the Forge
  (12 slots, past the kit's eight pips) and gives Armor and Accessory Crafting no place.
- **Nothing to build outside the game.** The kit already draws a place from any uma-art building (`Place.frame`, as the
  Paladin Bastion and the Rift do) and up to eight pips. The draft's kit option and ten hut tiles go.
- **B saves five places, and little else.** With the huts gone, what's left to track is mostly the twenty materials,
  the same in all three: A counts 33 things, B 28.
- **Tiers stop adding slots.** A Tier 2 or 3 world starts with one Rift run's twenty Umas: 40 slots seat two runs. A
  tier's depth is its material pair, the secondary profession and its new pieces (§6, §7).

### 0.3 Reuse: the asset map

Every place draws a building in uma-art's `buildings` atlas, and every material an icon in its `items` atlas, by id.
Six of the ten places keep today's id and art; two farm buildings come back; two unused frames get a job.

| Place (id) | Profession | Building frame | Was | Tier 1 · Tier 2 · Tier 3 materials (raw → refined, item ids) |
|---|---|---|---|---|
| **Mine** (`mine`) | Mining | `mine` | Today's Mine | `copper-ore`→`copper-ingot`, `iron-ore`→`iron-ingot` · `silver-ore`→`silver-ingot`, `mythril-ore`→`mythril-ingot` · `titanium-ore`→`titanium-ingot`, `orichalcum-ore`→`orichalcum-ingot` |
| **Forest** (`forest`) | Wood Chopping | `forest` | Today's Forest | `pine-log`→`pine-plank`, `oak-log`→`oak-plank` · `cedar-log`→`cedar-plank`, `elderwood-log`→`elderwood-plank` · `ebony-log`→`ebony-plank`, `yggdrasil-branch`→`yggdrasil-plank` |
| **Fields** (`fields`) | Farming | `fields` | The farm's Fields | `flax`→`linen`, `cotton`→`cotton-cloth` · `wool`→`wool-cloth`, `silk-cocoon`→`silk` · `moonsilk-cocoon`→`moonsilk`, `cloudfleece`→`cloudweave` |
| **Fishery** (`fishery`) | Fishing | `fishery` | The farm's Fishery | `seashell`→`shell-carving`, `ammonite`→`ammonite-carving` · `trilobite`→`trilobite-carving`, `tide-essence`→`tide-infusion` · `aether`→`aether-infusion`, `prismatic-essence`→`prismatic-infusion` |
| **Monster Den** (`monster-den`) | Hunting | `monster-den` | Today's Monster Den | `quartz`→`cut-quartz`, `garnet`→`cut-garnet` · `sapphire`→`cut-sapphire`, `diamond`→`cut-diamond` · `starstone`→`cut-starstone`, `philosophers-stone`→`cut-philosophers-stone` |
| **Workbench** (`workbench`) | Material Processing | `workbench` | Today's | Every refined item above |
| **Forge** (`forge`) | Weapon Crafting | `forge` | Today's | Weapon Gems, fork gems |
| **Armorer** (`armorer`) | Armor Crafting | `lancers-barracks` | Unused: a slate depot with racks | Armor Fittings |
| **Charm Shop** (`charm-shop`) | Accessory Crafting | `arcane-armory` | Unused since the Lapidary got its own (H29): a shop with glowing orbs | Accessory Settings |
| **Lapidary** (`lapidary`) | Jewel Crafting | `lapidary` | Today's | Planet, Moon and Halo Jewels |

- **Ten of uma-art's 42 buildings, 60 of its 331 item icons.** The Fishery's shells are the Fossil Dig's first two
  (a scallop and a spiral shell), and its later catches are the Ley Spring's water essences: today's essences already
  come from a pool. The farm's fish stay uma-racer's: their refined icons are food, and nothing here is eaten.
- **Unused and kept:** the farm's other eight buildings (uma-racer's), the Ley Spring, Crystal Cavern, Quarry, Meadow
  and Fossil Dig, the Rangers' Lodge, and the farmlands tiles. The Wilds page keeps its own ground and props.
- **The product icons** are the owning docs': gear's three ten-grade rows and five fork gems (GE12, gear §11), Extra
  Stats' jewels on today's gem icons (ES15). Professions draws nothing.
- **Art packet line (uma-platform): none.** No building, tile, item icon or kit option for Professions in any tier.

### 0.4 What the review changed

| | The cross-referenced draft | After the review |
|---|---|---|
| On the map | 10 yards: 40 · 60 · 80 one-Uma huts | **10 places, one existing building each**, in every tier |
| Work positions | 40 · 60 · 80 huts | **40 slots** (4 a place) in every tier |
| Words | Yard, hut | **Place, slot**: today's words |
| Names | Lumber Camp, Hunting Grounds | **Forest, Monster Den**: today's places |
| Fishing's high type | Pearl → Polished Pearl (new icons) | **Ammonite → Ammonite Carving** (today's) |
| Fishing, Tiers 2 and 3 | Coral, Black Pearl; Leviathan Scale, Abyss Pearl (new) | **Trilobite, Tide Essence; Aether, Prismatic Essence** (today's) |
| Kit and art | A kit option to draw huts; ten hut tiles; up to ten item icons | **None** |
| Place ids | 4 kept, 7 removed, 6 new | **6 kept, 5 removed, 4 new** |
| One Uma maxed | 485 refined (493 with her moon), 822 h | **The same** |
| Tier 3's second Halo kind | The Tier 2 pairs, so nothing used the Tier 3 high types | **The Tier 3 pairs**, as PR10 says of a tier's new pieces (§7) |
| The roster's pace | "Today a run of twenty: 12.9 days" | **Corrected:** today's Forge (five slots) binds: 24 days. Proposed: about 17 (§5.5) |

## 1. The owner's points

| The owner's point | Answered in |
|---|---|
| The farm went for being too complex; add a little complexity and simplify too | [§5.6](#56-tier-1-today-and-proposed): what's added (trades, a low and a high material) and what goes (140 item types, every upgrade, nine of eleven choices of where to work) |
| Five gathering professions, each tied to a fight type at Tier 1 | [§4](#4-trades-who-works-where), PR1–PR3 |
| Five crafting professions, one per class (fight type) | [§4](#4-trades-who-works-where), PR2–PR3 |
| A secondary profession in later tiers: another profession's base items, while the main one reaches its higher tiers | [§6](#6-tier-2), [§7](#7-tier-3), PR11 |
| Four smaller buildings per profession on today's Wilds map; maybe more each tier | **Changed after owner review:** four **slots** in one existing building ([§0](#0-after-the-owners-review), [§5.1](#51-the-wilds-map)); a tier adds materials, not buildings. PR4–PR6, PR10 |
| Tier 1 starts with two material types per profession | [§5.2](#52-materials), PR7 |
| A real rebalance: 3 weapons, 5 armors and 1 accessory, and everything they need adds up | [§5.3](#53-what-the-making-places-make)–[§5.5](#55-the-demand-math), PR8–PR9 |
| A visual page with the buildings and the amounts | The three previews above |
| (Review) Fewer structures to keep track of; reuse the farm's and the Wilds' art | [§0](#0-after-the-owners-review) |

## 2. Today

[Materials](../../../game/materials.md), [loops](../../../game/loops.md#craft-level) and
[sections](../../../game/sections.md#facilities) are the manual; [after the farm](../after-the-farm.md) (D144) is why it
looks this way.

| Piece | Today |
|---|---|
| Profession | One per Uma, **Craft Level** 1–50. Every Uma can work anywhere |
| Places | Eleven facilities on the Wilds page: eight sites, the Workbench, the Forge, the Lapidary |
| Slots | 3 / 4 / 5 by facility level: 33 at level 1, 55 at level 3. Level 3 works ×1.25. 22 upgrades in all |
| Materials | 8 families × 10 grades: 80 raw, 80 refined. Grade g opens at Craft Lv 5g − 4 |
| Products | 40 gear types × 10 grades; 100 Star Gems |
| Recipes | Gear: two refined items of its grade, the family pair rotating with type and grade (D139). Star Gems: a stat's family plus side items |
| Times | A gather 54 min at Lv 1 to 36 at Lv 50; a refine a quarter; a craft or cut two gathers |
| One Uma maxed | 472 raw, 472 refined, 220 products, about 776 hours of work at Lv 25's speed |
| What binds a roster | **The Forge:** 120 crafts an Uma at two gathers each is 145 slot-hours; its five slots make 0.83 maxed Umas a day, whatever the roster |

The Tier 2 proposal [second profession](../second-profession.md) (Q13) adds Lore Level, two sites and a station on the
Battle page. This doc replaces it (PR12).

## 3. The proposal in one table

| | Tier 1 | Tier 2 | Tier 3 |
|---|---|---|---|
| **Who works where** | Her **trade**: the gathering and the making profession of her fight type | + a **secondary**: one other gathering profession's base pair | + the secondary reaches its Tier 2 pair |
| **Places on the Wilds** | 10, one per profession, each an existing building | 10 | 10 |
| **Work slots** | 4 a place: **40** | 40 | 40 |
| **Material pairs a gathering profession** | 1 (the base pair): **2 types** | 2: 4 types | 3: 6 types |
| **Item types gathered and refined** | 10 raw, 10 refined | 20, 20 | 30, 30 |
| **One Uma maxed** | 485 refined, 822 h (493, 835 h with her own moon) | 510, 864 h (518, 878 h) | 520, 881 h (528, 895 h) |
| **Level** | Craft Level, one per Uma, today's curve | The same | The same |

Hours are work at Craft Lv 25's speed before a place's speed, as today's 776 is.

## 4. Trades: who works where

An Uma's fight type gives her a **trade**: one gathering profession and one making profession. She works only her
trade's two places (in Tier 1). She picks which one by what's short. One **Craft Level** covers both, as today.

| Fight type | Class | Gathers at | Makes at |
|---|---|---|---|
| **Physical** | Brawler | **Mine**: Mining | **Forge**: Weapon Crafting |
| **Physical hybrid** | Spell Blade | **Forest**: Wood Chopping | **Armorer**: Armor Crafting |
| **Healer** | Paladin, Cleric | **Fields**: Farming | **Workbench**: Material Processing |
| **Magical hybrid** | Summoner | **Fishery**: Fishing | **Charm Shop**: Accessory Crafting |
| **Magical** | Mage | **Monster Den**: Hunting | **Lapidary**: Jewel Crafting |

Hunting is the owner's "fighting for gems": she fights the den's beasts for the **stones** they carry (Quartz,
Garnet …), cut at the Workbench and set as jewels at the Lapidary. *Changed in cross-reference: "Gem Hunting". "Gem" is
only the weapon line's word (gear GE12), so the hunt's items are stones and the profession is plain Hunting.*
*Changed after owner review (2026-10-22): the Lumber Camp and the Hunting Grounds are today's Forest and Monster Den,
with their art.*

**What "tied to a fight type" means (PR1).** Her trade comes from her **Calling**, the fight type of her Uma Template
([variance.md](variance.md) §5), set by rule when she's unlocked. It never follows a class switch, and her active class
moves no job ([classes.md](classes.md) CL14).

| Tie the trade to | For | Against |
|---|---|---|
| Her current class | Always matches how she fights | Switching is free, so a switch would move her job: the tie means nothing, and her queue breaks |
| Her starting class (running style) | Simple, already in the code (D162, D180) | Master data's 270 outfits split 17% front, 53% pace, 24% late, 5% end. The Summoner's trade would get one Uma in twenty, and no Uma starts as a Spell Blade |
| **Her Calling** (recommended) | Assigned by rule from master data: 22.6 / 20.7 / 17.0 / 17.0 / 22.6% today (physical, physical hybrid, magical, magical hybrid, healer). She can still be any class | Needs variance.md's rule |

**One rule, wherever it ships.** The calling is variance.md U4's eight rows, one pure function of master data by stable
id (`umaTemplate`). If Professions ships before the rest of Variance, that function ships with it (variance §9) and the
trade reads it; no second rule. *Changed in cross-reference: this section drafted its own fallback rule (no Cleric
callings, a different split), which would have given one Uma two fight types.*

## 5. Tier 1

### 5.1 The Wilds map

**Ten places, one per profession, in today's ten side spots** ([map preview](../../../design/tier-rework/previews/professions-map.html)). Each row
is one trade: gathering on the left, making on the right, so an Uma's two places sit side by side. The trunk road runs
down the middle; the Lapidary's middle spot is freed.

| Row | y | Left (x), its frame | Right (x), its frame | Trade |
|---|---|---|---|---|
| 1 | 0.10 | Mine (0.24), `mine` | Forge (0.74), `forge` | Physical |
| 2 | 0.30 | Forest (0.20), `forest` | Armorer (0.76), `lancers-barracks` | Physical hybrid |
| 3 | 0.51 | Fields (0.22), `fields` | Workbench (0.78), `workbench` | Healer |
| 4 | 0.71 | Fishery (0.22), `fishery` | Charm Shop (0.78), `arcane-armory` | Magical hybrid |
| 5 | 0.90 | Monster Den (0.26), `monster-den` | Lapidary (0.74), `lapidary` | Magical |

- **A place is today's facility:** one building, its name pill, **four pips** (one a slot), its quick look and page.
  One row of pips keeps a place 112 px tall, so five a column need 592 px of the 675 at 390 × 844, in every tier. At
  375 × 667 it's as tight as today's Wilds.
- **No upgrades.** Every place has its four slots from day one, and every slot works at today's level-3 speed, ×1.25.
- **Drawing:** nothing new. A place names its uma-art frame (`Place.frame`, H50) when it isn't its id: the Armorer
  draws `lancers-barracks`, the Charm Shop `arcane-armory`. The Fields and the Fishery draw the farm's own buildings on
  the Wilds' ground. *Changed after owner review (2026-10-22): the draft drew each yard as four to eight one-tile huts, a
  kit option and ten new tiles.*

### 5.2 Materials

**Two types per gathering profession: a low one and a high one.** The low type opens at Craft Lv 1 and goes into
grades 1–5 of everything; the high type opens at Lv 26 and goes into grades 6–10. Processing turns one raw item into
one refined, as today. **Twenty item types, all today's ids and icons.**

| Profession | Low: grades 1–5, Craft Lv 1 | High: grades 6–10, Craft Lv 26 | A maxed Uma uses |
|---|---|---|---|
| Mining | Copper Ore → Copper Ingot | Iron Ore → Iron Ingot | 105 |
| Wood Chopping | Pine Log → Pine Plank | Oak Log → Oak Plank | 95 |
| Farming | Flax → Linen | Cotton → Cotton Cloth | 95 |
| Fishing | Seashell → Shell Carving | Ammonite → Ammonite Carving | 95 |
| Hunting | Quartz → Cut Quartz | Garnet → Cut Garnet | 95 |

*Changed after owner review (2026-10-22): Fishing's high type was Pearl → Polished Pearl, two new ids and icons.*
Ten grades stay where they matter: on the items an Uma uses (gear.md's grades, extra-stats.md's jewels), gated at
Craft Lv 5g − 4 to make.

### 5.3 What the making places make

The items are gear.md's and extra-stats.md's; their recipes and sizes are this doc's. **Each making place uses about a
quarter of the refined items**, and each recipe is one fixed set: grades 1–5 take the low types, 6–10 the high.

| Item | Place | Refined a piece | Grades 1–5 | Grades 6–10 |
|---|---|---|---|---|
| **Weapon Gem** (raises any weapon a grade) | Forge | 4 | 2 Copper Ingot, 2 Pine Plank | 2 Iron Ingot, 2 Oak Plank |
| **Armor Fittings** (any slot, either half) | Armorer | 2 low, 3 high | 1 Linen, 1 Shell Carving | 1 Iron Ingot, 1 Oak Plank, 1 Cut Garnet |
| **Accessory Setting** (any type) | Charm Shop | 12 | 6 Linen, 6 Shell Carving | 6 Cotton Cloth, 6 Ammonite Carving |
| **Moon Jewel** I–V (grades 2, 4, 6, 8, 10) | Lapidary | 4 | 3 Cut Quartz, 1 Copper Ingot | 3 Cut Garnet, 1 Iron Ingot |
| **Planet Jewel** I–V (grades 1, 3, 5, 7, 9) | Lapidary | 8 | 2 each: Cut Quartz, Pine Plank, Linen, Shell Carving | 2 each: Cut Garnet, Oak Plank, Cotton Cloth, Ammonite Carving |
| Refine | Workbench | 1 raw | Every low type | Every high type |

- **Easy to say:** weapons take ingots and planks; light armor cloth and shells, heavy armor iron, oak and a garnet;
  accessories cloth and shells; jewels cut stones on a metal mount, the planet a bit of everything.
- **Every class needs the same items** (gear.md: a Weapon Gem raises any weapon, a fitting any slot of either half, a
  setting any type), so every Uma needs the same materials, and a party is five times one Uma. No class leans on a place.
- **The accessory is the big piece.** Tier 1 has one accessory and five armor slots. For the Charm Shop's trade to be as
  busy as the Armorer's, a setting costs what a grade of the whole suit does (PR8). It shrinks as slots grow: 6 with two
  accessories (Tier 2), 4 with three (Tier 3).

### 5.4 Time, gates and batches

| Job | Time (Craft Lv 1 → 50), before ×1.25 | Batch | Gate |
|---|---|---|---|
| Gather one item | 54 → 36 min, any type (today) | 1–10 | Low Lv 1, high Lv 26 |
| Process one item | A quarter: 13.5 → 9 min (today) | ×1, 4, 8, 20, 40 | Its type's |
| Make one piece | **One gather's time per refined item in it**: a Weapon Gem or Moon Jewel 4 gathers, a fitting 2 or 3, a setting 12, a Planet Jewel 8 | 1–10 | Grade g at Lv 5g − 4 (today) |

- Today's makes take two refined items and two gathers' time, so the rule is today's, extended.
- Craft EXP is 2 a minute of the job at her level, before the place's speed (today). Queues, Repeat, Recall, Speed
  Tickets and stopped queues don't change: they're uma-work's.
- **The trade gate** lives in the job kinds' `plan` (it knows the slot's place): another trade's Uma is refused, and
  the kit's picker shows her with "Another trade". No engine change.

### 5.5 The demand math

The counts come from the other drafts; where they move, the sizes move and the balance holds ([Assumes](#9-assumes)).
Charts are in the [demand preview](../../../design/tier-rework/previews/professions-demand.html).

**One Uma, maxed, Tier 1** (any class):

| Her need | Pieces | At | Refined each | Refined |
|---|---|---|---|---|
| 3 weapons, grade 0 → 10: a Weapon Gem a step (gear.md) | 30 | Forge | 4 | 120 |
| 5 armor slots, grades 1–10: Armor Fittings (gear.md) | 50 | Armorer | 2 or 3 | 125 |
| 1 accessory slot, grades 1–10: a Setting a step (gear.md) | 10 | Charm Shop | 12 | 120 |
| Extra Stats: Planet Jewel I–V, Moon Jewel I–V on four moons (extra-stats.md) | 25 | Lapidary | 8 or 4 | 120 |
| **Total** | **115 pieces** | | | **485**, from 485 raw and 485 refines |
| + her own moon (variance.md, ES12): Moon Jewels II and IV | 2 | Lapidary | 4 | 8: **493**, about 835 h |

By type: Copper 38, Iron 67; Pine 36, Oak 59; Flax 61, Cotton 34; Seashell 61, Ammonite 34; Quartz 30, Garnet 65.

- **Her moon** sits outside the shared demand, as it sits outside the foe budget: every Uma has one, and its two jewels
  add 6 Hunting and 2 Mining gathers and 8 Lapidary refined items. With it the trades span 19.4–20.6% of the work.
- **A second class** adds only the weapons she hasn't raised (gear.md §3.1): up to 30 more Weapon Gems, 120 refined.
  Armor and the accessory follow her slots, so they cost nothing again.

**What each trade carries** (hours at Lv 25's speed):

| Trade | Gathers | Makes or processes | Hours | Share |
|---|---|---|---|---|
| Physical: Mine · Forge | 105 | 120 refined | 169 | 20.6% |
| Physical hybrid: Forest · Armorer | 95 | 125 refined | 166 | 20.2% |
| Healer: Fields · Workbench | 95 | 485 refines | 163 | 19.8% |
| Magical hybrid: Fishery · Charm Shop | 95 | 120 refined | 162 | 19.7% |
| Magical: Monster Den · Lapidary | 95 | 120 refined | 162 | 19.7% |
| **One Uma** | 485 | | **822** | |

**A party** is five times that: 525 Mine, 475 from each other gathering place. **A Rift run's twenty:** 2,100 and 1,900.

**Supply: one Uma in one slot** (×1.25):

| Her Craft Lv | Gathers a day | Processes a day | A Weapon Gem or Moon Jewel | A fitting | A setting | A Planet Jewel |
|---|---|---|---|---|---|---|
| 1 | 33 | 133 | 2.9 h | 1.4 or 2.2 h | 8.6 h | 5.8 h |
| 25 | 40 | 159 | 2.4 h | 1.2 or 1.8 h | 7.2 h | 4.8 h |
| 50 | 50 | 200 | 1.9 h | 1.0 or 1.4 h | 5.8 h | 3.8 h |

Through the whole chain (gather, process, make) one refined item takes 81 slot-minutes at Lv 25: **0.74 refined items an
Uma-hour**, so one Uma maxed is **657 Uma-hours** (668 with her moon).

**A roster at the owner's pace** (one party fights, dozens work). Forty Umas at the calling's split: 9 physical,
8 physical hybrid, 9 healer, 7 magical hybrid, 7 magical; each trade has 8 slots.
- The roster makes about **1.2 maxed Umas a day.** The two thinnest trades (about 7 Umas each) set the pace; past about
  50 Umas the four slots of the Lapidary and the Armorer do (1.24 a day).
- **A party's next grade** (a tenth of five Umas) takes about **10 hours**; a whole party about **4 days**; a run of
  twenty about **17 days**.
- **Today** the Forge binds: five slots, 145 slot-hours an Uma, **0.83 maxed Umas a day** whatever the roster. A party
  takes 6 days, a run of twenty 24. *Corrected after owner review (2026-10-22): the draft's "12.9 days" counted the
  roster's hours and missed the Forge's five slots.* Four making places spread that work.
- **What gates gear is Craft Level, as today:** grade 6 opens at Craft Lv 26, day 11 for an Uma working nonstop; grade
  10 at Lv 46, day 22. A run of twenty's 17 days of volume fit inside them. Volume is never the wall for the fighting
  party.
- **A short trade** buys raw items at the Exchange, and the Stable's Trade filter (PR15) shows which unlocks would fill
  it. From Tier 2 the secondary profession does the rest (§6).

### 5.6 Tier 1, today and proposed

| | Today | Proposed |
|---|---|---|
| Places on the Wilds | 11 facilities | **10 places**, each an existing building |
| Slots | 33 (55 at level 3) | **40**, 4 a place |
| Upgrades | 22, each Laurels and two families' refined items | **None** |
| Gathered items | 80 | **10** |
| Refined items | 80 | **10** |
| Things to make | 400 gear pieces, 100 Star Gems | **40**: Weapon Gem, Armor Fittings and Accessory Setting × 10 grades; Planet and Moon Jewels I–V |
| Recipe rule | Four family pairs rotating by type and grade; Star Gems with side items | **One fixed set an item**; low types for grades 1–5, high for 6–10 |
| Job kinds | 4 (gather, refine, craft, cut) | 4 in the engine; the player sees gather, process, make |
| Where an Uma can work | Any of 11 | **Her 2 places** |
| Choices when gathering | 10 grades | 2 (1 before Craft Lv 26) |
| Choices when refining | 80 | 10 |
| Per Uma, maxed | 472 raw, 472 refined, 220 pieces, 776 h | 485, 485, 115, 822 h (493 and 835 h with her moon's 2 jewels) |
| New art | — | **None** |
| **Added** | — | Trades; the low/high choice |

### 5.7 Around the places

| Area | Tier 1 |
|---|---|
| **The Exchange** | Sells every type it stocks: the low types after the tier's first win, the high types after a win on its third continent. Low 30 Laurels, high 80. Selling: raw 6 / 16, refined 12 / 32, made items as today (6 + 6g) |
| **The Warehouse** | Materials: twenty icons, raw then refined, by profession. The other shelves are gear.md's and extra-stats.md's |
| **Targets** (D126) | Unchanged: up to ten Umas, the same MRP pass. Each place's strip lists what targets need from it; "Start" offers only its trade's free Umas |
| **The profile** | Work tab: her trade's two places and Craft Level. The header chip stays "Craft Lv 23" |
| **The Stable** | A **Trade** filter, on locked outfits too, so a new unlock can fill a short trade |
| **The place page** | Today's facility page: header (no Upgrade), one row per slot, the target strip, the job sheet (Who → How many → What). Its picker lists the trade's Umas first; others greyed with "Another trade" |
| **Notifications, Collect all** | Unchanged |

## 6. Tier 2

**Depth grows from the trade outward; Tier 1's knowledge carries over unchanged.**

| Piece | Tier 2 |
|---|---|
| **Places and slots** | The same ten, four slots each (40). *Changed after owner review (2026-10-22): the draft added two huts a yard (60)* |
| **Materials** | Each gathering profession adds the **Tier 2 pair**, today's ids: Silver Ore / Mythril Ore, Cedar Log / Elderwood Log, Wool / Silk Cocoon, Trilobite / Tide Essence, Sapphire / Diamond, each with its refined form. Low from Craft Lv 1, high from Lv 26, as in Tier 1. *Changed after owner review: Fishing's was Coral / Black Pearl, new art* |
| **Base items** | Tier 1's recipes, and Tier 1's mix: 485 refined, type for type. Sizes follow the counts: two accessory slots make a setting 6; the jewels resize to stay at 120 with Tier 1's mix |
| **New pieces** | gear.md's fork gems (Dual, Pure: one a weapon at G5) and extra-stats.md's Halo Jewels I–II. Each takes its line's base recipe at its grade **plus one refined item of each Tier 2 pair** (the low type at grade 5, the high at grade 10): 5 new pieces, 25 items per Uma, 5 a gathering profession. Budget: up to 48 (a tenth more work) for whatever the other docs add |
| **Main profession** | Only her own trade's gathering place gives her the Tier 2 pair: her main profession "reaches its higher tier" |
| **Secondary profession** | One other gathering profession, picked on her profile's Work tab, once per tier, free. She gathers its **base pair** at its place, at her Craft Level's speed and gates. Changing it costs 1,000 Laurels. Gathering only: making stays her trade's |
| **The Exchange** | The base pair as in Tier 1; the Tier 2 pair's low type after a win on continent 2, high after continent 4. Same prices |
| **One Uma maxed** | 510 refined, **864 h** (518, 878 h with her moon) |

**The secondary is where Tier 2 softens the trade split.** A Tier 2 world starts with one run's twenty Umas: about four
a trade, three or four in the magical two. Without secondaries the magical trade's work takes 36 days; with them, the
other trades' spare Umas gather its stones, and the run is maxed in about **29 days**, the whole roster's hours (§11).
Base items are about 95% of the gathering, so any Uma can carry most of a short trade's.

## 7. Tier 3

| Piece | Tier 3 |
|---|---|
| **Places and slots** | The same ten, four slots each (40). *Changed after owner review (2026-10-22): the draft added two more huts a yard (80)* |
| **Materials** | The **Tier 3 pair**, today's ids: Titanium Ore / Orichalcum Ore, Ebony Log / Yggdrasil Branch, Moonsilk Cocoon / Cloudfleece, Aether / Prismatic Essence, Starstone / Philosopher's Stone. *Changed after owner review: Fishing's was Leviathan Scale / Abyss Pearl, new art* |
| **New pieces** | gear.md's Tier 3 fork gems (Prism, Tempered, Keen, and Dual or Pure for a weapon arriving as Base: 3 an Uma) take one of each Tier 3 pair's low type. The Halo Jewels, I–II for each of her two kinds (4): the first kind keeps the Tier 2 pairs, the second takes the Tier 3 pairs (low at grade 5, high at grade 10). **35 items per Uma**, 7 a gathering profession, inside the 48 budget. Settings 4 (three slots). *Changed in cross-reference: "about 25" counted one Halo kind. Changed after owner review (2026-10-22), found while drawing the flow: both Halo kinds took the Tier 2 pairs, which left the Tier 3 high types with no use* |
| **Secondary** | Reaches one tier behind her main: its base pair **and its Tier 2 pair** |
| **One Uma maxed** | 520 refined, **881 h** (528, 895 h with her moon) |

The rule for every later tier: one more pair per gathering profession, the tier's new pieces from that tier's pairs
within a tenth more work, and the secondary trailing the main profession by one tier. **The map doesn't change.**

## 8. Provides

| To | What |
|---|---|
| classes.md, variance.md | The five trades by fight type (§4) |
| gear.md | Recipes and sizes for Weapon Gems (4), Armor Fittings (2 / 3) and Accessory Settings (12 · 6 · 4 by slot count) (§5.3); fork gems = the Weapon Gem's G5 recipe + one of each tier pair; the make-time rule; the low/high grade bands |
| extra-stats.md | Jewel recipes (Moon 4, Planet 8 at 25 jewels per Uma); Halo Jewels = the Moon Jewel's recipe + one of each pair of the kind's tier (the first kind Tier 2's, the second Tier 3's); the Lapidary's budget: about 120 refined per Uma, its jewels resized to fit with Tier 1's mix |
| Everyone | The material catalog per tier (§0.3, §5.2, §6, §7), every type an existing id and icon; the budget for a tier's new pieces (a tenth more work, from that tier's pairs) |
| The cross-reference | The Wilds map (§5.1) and the per-tier demand table for `progression.html` |
| The refund | The conversion table from today's 160 items (§10) |
| Pacing | Per Uma: 822 / 864 / 881 hours (835 / 878 / 895 with her moon); the roster and run figures (§11) |

## 9. Assumes

| From | What this doc assumes | If it differs |
|---|---|---|
| **gear.md** (GE12) | Per Uma per tier: 30 Weapon Gems (27 + 3 fork gems from Tier 2), 50 Armor Fittings, Accessory Settings 10 · 20 · 30. One item of a line fits any weapon, slot or type | Sizes rescale so the Forge, the Armorer and the Charm Shop each stay near **120 refined per Uma** |
| **gear.md** (§8) | **Reconciled:** gear.md takes these recipes. Gear takes 365 and jewels 120: each making place at a quarter. The Uma's total, 485, is today's 472. Its recipe table names Ammonite Carving for the high setting (*updated with this review*) | — |
| **classes.md** (CL14, §5) | 3 weapons, 5 armor slots, accessories 1 · 2 · 3; a class switch moves no job | — |
| **extra-stats.md** (ES7, ES12) | Tier 1: 5 Planet and 20 Moon Jewels per Uma (four moons). Tier 2 adds Halo Jewels I–II (one kind), Tier 3 a second kind (I–II again). Her template moon's 2 (Moon Jewels II and IV, every tier; *reconciled*) add 8 refined | Jewel sizes rescale to keep the Lapidary near 120 per Uma |
| **variance.md** (U4) | Her Calling names one fight type; today's split is 17.0–22.6% per fight type | U4's rule ships with this packet alone (§4); no second rule |
| **Tier 2 and 3 additions** (all docs) | A tier's new pieces cost at most a tenth more work per Uma (48 refined), from that tier's pairs | Their recipes shrink to fit: the rate holds |
| **The kit and uma-art** (uma-platform) | **Nothing new.** A place draws any uma-art building by name (`Place.frame`), and a place shows up to eight pips: both exist. The ten frames and sixty icons of §0.3 exist. *Changed after owner review (2026-10-22): the draft asked for a hut option, ten hut tiles and Pearl icons* | — |
| **The brief's §2** | "An Uma works one **trade**, the gathering and the making profession of her fight type, on one Craft Level"; each profession one place of four slots | — |

## 10. Save impact

Save **v26** (*now v27, README XC11*), the Tier 1 rework's single migration ([README §9](../../../design/tier-rework/README.md#9-engine-save-and-refund)): the gear and Star
Gem refunds come back as today's ids, so this conversion must run in the same step. Every world gets the same
migration. `OwnedUma.secondary` (Tier 2+) joins with Tier 2's toolbox, v27 (*now v28*).

| Today in the save | After | For the refund |
|---|---|---|
| `items`: 80 raw, 80 refined | **Converted one for one** by family and grade band (table below): raw to raw, refined to refined | Nothing lost |
| `buildings`: 11 facilities' levels | Dropped: places have no levels | Each paid upgrade back: its Laurels, and its refined items converted |
| `work`: rows, queues, Repeat | Settled, collected and recalled: finished items paid with their Craft EXP, unfinished inputs returned, then converted. Queues and Repeat drop | Only time in progress is lost |
| `gems` (Star Gems) and `gear` in stock, bound gear, set Star Gems | Deleted by gear.md (GE15) and extra-stats.md (ES14) | Their raw items come back as today's ids, then convert by the table |
| `OwnedUma.craft` | **Kept** | — |
| `OwnedUma.secondary` | New, Tier 2+ worlds only, empty until picked | — |
| `targets` | Kept; their lines recompute from the new recipes | — |
| Place ids | **Kept:** `mine`, `forest`, `monster-den`, `workbench`, `forge`, `lapidary`. **Removed:** `ley-spring`, `crystal-cavern`, `quarry`, `meadow`, `fossil-dig`. **New:** `fields`, `fishery` (the farm's ids, gone since save v21's migration), `armorer`, `charm-shop`. *Changed after owner review (2026-10-22)* | A link or remembered page to a removed id opens the Wilds page |

**The conversion table:**

| Today's family (site) | Becomes | Grades 1–5 → | Grades 6–10 → |
|---|---|---|---|
| Ores (Mine), Stones (Quarry) | Mining | Copper Ore / Copper Ingot | Iron Ore / Iron Ingot |
| Woods (Forest) | Wood Chopping | Pine Log / Pine Plank | Oak Log / Oak Plank |
| Fibers (Meadow) | Farming | Flax / Linen | Cotton / Cotton Cloth |
| Essences (Ley Spring), Bones & Horns (Fossil Dig) | Fishing | Seashell / Shell Carving | Ammonite / Ammonite Carving |
| Crystals (Crystal Cavern), Hides & Scales (Monster Den) | Hunting | Quartz / Cut Quartz | Garnet / Cut Garnet |

Of today's 160 ids, 20 stay as Tier 1's pairs and 40 come back as Tier 2's and 3's (Silver Ore, Cedar Log, Wool,
Trilobite, Sapphire …). The other 100 leave the code; old-save fixtures keep them, as D144's did, and uma-art keeps
every icon. Stock is converted by this table in every world, so a Tier 2 world's old Silver Ore becomes Copper Ore like
any other, and its Tier 2 pairs start empty. *Changed after owner review: Fishing's high type (20 of 20 Tier 1 types are
today's ids, not 18).*

## 11. Pacing

**Unchanged:** Craft Level's curve (D96), 2 EXP a minute, the gate 5g − 4, gather minutes, refining at a quarter.

**Per Uma:** 822 hours at Lv 25's speed against today's 776 (+6%), or 657 slot-hours at ×1.25 against today's 621 at
level 3. Her own moon's two jewels make it 835 hours (+8%).

**Craft Level comes about two days sooner.** Today's facilities work ×1 until level 3, which needs grade-5 refined
items: about day 11. Every slot works ×1.25 from day 1:

| When | Craft Lv | Day, an Uma working nonstop (×1.25) | Today (level 3 from day 11) |
|---|---|---|---|
| Grade 2 | 6 | 2.0 | 2.6 |
| Grade 6, the high types | 26 | 11.2 | 13.5 |
| Grade 10 | 46 | 22.1 | 24.3 |
| Lv 50 | 50 | 24.5 | 26.7 |

That's inside today's spread (an owner who upgrades late is slower still), and the 6% more work per Uma takes some of
it back.

**Rosters:**

| | Tier 1 | Tier 2 | Tier 3 |
|---|---|---|---|
| Workers · slots | 40 · 40 | 20 (one run) · 40 | 20 · 40 |
| One Uma maxed, slot-hours (with her moon) | 657 (668) | 691 (702) | 705 (716) |
| A party maxed | About 4 days | 7.3 days | 7.5 days |
| A run of twenty maxed | About 17 days (the two thinnest trades) | **29.3 days** with secondaries; 36.0 without | **29.8 days**; 37.8 without |
| Today | A party 6 days, a run 24 (the Forge's five slots) | About four weeks ([Tier 2's world](../tier2-world.md) §11) | — |

- **Tier 1:** the fighting party's next grade waits on Craft Level, not on volume, as today. The four making places
  carry what today's one Forge did, so a whole run gears faster than today (17 days against 24) while Craft Level still
  opens grade 10 on day 22.
- **Tiers 2 and 3:** within two days of today's four weeks, held by the tenth-more budget. Twenty Umas never fill 40
  slots, so slots never bind; the trade split would (36 days) without the secondary.
- **Laurels:** no upgrade costs (at most 7,150 a world today); Exchange prices sit between today's grade 2 and 7.
- **What would move it:** a category adding more than a tenth a tier. Its recipes shrink instead.

## 12. Decisions

| Call | Recommendation | Alternatives | Why |
|---|---|---|---|
| **PR1** What ties a profession to a fight type | Her **Calling's** fight type (variance.md U4), fixed in her world; never her class. If Professions ships first, U4's rule ships with it. *Changed in cross-reference: the separate fallback rule dropped* | Her current class; her starting class | Class switches are free, so following them means nothing. Starting classes split 17 / 53 / 24 / 5% and starve two trades |
| **PR2** One profession or two per Uma | One **trade**: her fight type's gathering and making professions, on **one Craft Level** | One of ten per Uma; two levels | Ten buckets skew worse and idle places. One level is today's, with nothing new to track |
| **PR3** The pairings | Physical: Mine · Forge. Physical hybrid: Forest · Armorer. Healer: Fields · Workbench. Magical hybrid: Fishery · Charm Shop. Magical: Monster Den · Lapidary. *Changed after owner review (2026-10-22): the Lumber Camp and Hunting Grounds are today's Forest and Monster Den* | Any other matching | Each reads as one craft; the rows mirror the Learning page, physical at the top; two of the draft's new places are today's |
| **PR4** What a profession's building is | **One existing building with four work slots** (Option A, §0.1): 40 in every tier. No upgrades; every slot works ×1.25. *Changed after owner review (2026-10-22): from four to eight one-Uma huts a yard (40 · 60 · 80)* | B, five trade lodges of 8 slots; C, five sites and today's three stations (the Forge 12 slots); the draft's huts; 4 · 5 · 6 slots by tier | Ten structures instead of 40–80, one job a page, one row of pips, nothing new to draw. B saves five places but mixes two jobs on a page and hides half of each trade; C crowds three professions into the Forge. A first-run Tier 2 world of twenty never fills 40 slots, so more a tier adds only empty pips and a "+N" |
| **PR5** The map | Ten places in today's ten side spots, **one row a trade**, gathering left, making right. *Changed after owner review: places, not yards* | Five places (B); a fifth Hub page (the bar is full, D147) | It's today's measured layout, with one row of pips in every tier, and an Uma's two places sit side by side |
| **PR6** Art | **Reuse only:** every place draws an existing uma-art building (`mine`, `forest`, `fields`, `fishery`, `monster-den`, `workbench`, `forge`, `lancers-barracks`, `arcane-armory`, `lapidary`), every material an existing item icon. **No kit change, no new art.** *Changed after owner review (2026-10-22): from a kit option to draw huts and ten hut tiles* | The draft's huts; new pearl icons for Fishing | The owner's ask; the kit already draws any frame for a place (H50) and up to eight pips |
| **PR7** Materials | **Two types a gathering profession**: low (grades 1–5, Lv 1) and high (6–10, Lv 26); refining one for one; **all twenty today's ids and icons**, Fishing's high type Ammonite. *Changed after owner review (2026-10-22): from Pearl, two new ids* | Ten grades each (today's 160 items); one type each; new Pearl icons | The owner's two types; grades still matter on the items; no new art |
| **PR8** Recipes | **One fixed set an item** (§5.3), sized so each making place uses about a quarter of the refined and each gathering place about a fifth: every trade 19.7–20.6% of the work | gear.md's rotating pairs and triples (about 220 refined of gear; gear.md now adopts these) | Rotation balances, but no one can say what an item takes. At 240 the three gear trades idle a fifth of the time, and an Uma costs a quarter less than today |
| **PR9** Make time | **One gather's time per refined item** in the piece | Today's flat two gathers | It's today's rule for today's two-item recipes; bigger pieces take longer, so trades stay even |
| **PR10** How tiers grow | **One more pair a gathering profession** each tier (today's ids); a tier's new pieces take their base recipe plus one of each of its pairs, within a tenth more work; base recipes never change; **places and slots stay**. *Changed after owner review (2026-10-22): the draft added two huts a yard a tier* | A slot a place a tier (40 · 50 · 60); re-split the ten grades over more types each tier | Tier 1's recipes stay true forever, depth arrives with the tier, the map stays what the player learned, and the rate holds |
| **PR11** Secondary profession | From Tier 2: one other **gathering** profession's base pair, picked once a tier, free; changing costs 1,000 Laurels. In Tier 3 it reaches that profession's Tier 2 pair | Set by rule; free changes; a making secondary | It's the owner's idea, and it fixes a short trade: a Tier 2 run maxes in 29 days with secondaries, 36 without. Free changes would undo the trades |
| **PR12** The second profession (Q13) | **Replaced:** no Lore Level, Relics, Glyphs, Battlefield, Shrine or Scriptorium. Tier 2's new pieces take the Tier 2 pairs | Keep Lore as an eleventh profession | The trades already grow a tier at a time, with no second level and no work on the Battle page |
| **PR13** The Exchange | Every type, by pair: base low after the tier's first win, base high after continent 3, a tier's own pair after continents 2 and 4; low 30, high 80 Laurels | Today's two grades a continent | Twenty types don't need a grade ladder; prices sit inside today's range |
| **PR14** Old saves | Convert stock one for one by family and grade band; collect and recall all work; refund upgrades; keep Craft Level; keep six place ids, remove five, add four. *Changed after owner review (2026-10-22): Fishing's high type and the place ids (§10)* | Wipe the Wilds | The owner leans to refunding raw materials; nothing earned is lost |
| **PR15** The Stable | A **Trade** filter, on locked outfits too | None | New unlocks can fill a short trade |
