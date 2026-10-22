# Professions: five trades, ten yards, four huts each

> **Cross-referenced draft, 2026-10-22. Nothing here is built.** One of the six Tier rework docs
> ([the brief](README.md)). It answers the owner's Professions points, starts from the brief's §2 frame, and lists what
> it needs from the other docs under [Assumes](#9-assumes). It makes the items [gear.md](gear.md) (GE12) and
> [extra-stats.md](extra-stats.md) (ES7) drafted, and takes each Uma's fight type from [variance.md](variance.md)'s
> Calling. Calls are numbered **PR1**, **PR2** … with a recommendation each ([Decisions](#12-decisions)). The
> cross-reference pass ([README §7](README.md#7-cross-reference-log)) kept every amount here (gear.md adopted them),
> renamed Gem Hunting to **Hunting** (its items are stones; "gem" is the weapon line's word), dropped the second
> fallback trade rule for variance's calling rule, added her own moon's two jewels, and corrected Tier 3's new pieces
> (35 items, not 25).
>
> **Previews:** [the Wilds map at Tier 1, 2 and 3](previews/professions-map.html) ·
> [gathering → processing → making → what she wears](previews/professions-flow.html) ·
> [demand against supply](previews/professions-demand.html).

## 1. The owner's points

| The owner's point | Answered in |
|---|---|
| The farm went for being too complex; add a little complexity and simplify too | [§5.6](#56-tier-1-today-and-proposed): what's added (trades, a low and a high material) and what goes (140 item types, every upgrade, nine of eleven choices of where to work) |
| Five gathering professions, each tied to a fight type at Tier 1 | [§4](#4-trades-who-works-where), PR1–PR3 |
| Five crafting professions, one per class (fight type) | [§4](#4-trades-who-works-where), PR2–PR3 |
| A secondary profession in later tiers: another profession's base items, while the main one reaches its higher tiers | [§6](#6-tier-2), [§7](#7-tier-3), PR11 |
| Four smaller buildings per profession on today's Wilds map; maybe more each tier | [§5.1](#51-the-wilds-map), PR4–PR6 |
| Tier 1 starts with two material types per profession | [§5.2](#52-materials), PR7 |
| A real rebalance: 3 weapons, 5 armors and 1 accessory, and everything they need adds up | [§5.3](#53-what-the-making-yards-make)–[§5.5](#55-the-demand-math), PR8–PR9 |
| A visual page with the buildings and the amounts | The three previews above |

## 2. Today

[Materials](../../game/materials.md), [loops](../../game/loops.md#craft-level) and
[sections](../../game/sections.md#facilities) are the manual; [after the farm](../after-the-farm.md) (D144) is why it
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

The Tier 2 proposal [second profession](../second-profession.md) (Q13) adds Lore Level, two sites and a station on the
Battle page. This doc replaces it (PR12).

## 3. The proposal in one table

| | Tier 1 | Tier 2 | Tier 3 |
|---|---|---|---|
| **Who works where** | Her **trade**: the gathering and the making profession of her fight type | + a **secondary**: one other gathering profession's base pair | + the secondary reaches its Tier 2 pair |
| **Yards on the Wilds** | 10, one per profession | 10 | 10 |
| **Huts** (one Uma each) | 4 a yard: **40** | 6 a yard: **60** | 8 a yard: **80** |
| **Material pairs a gathering profession** | 1 (the base pair): **2 types** | 2: 4 types | 3: 6 types |
| **Item types gathered and refined** | 10 raw, 10 refined | 20, 20 | 30, 30 |
| **One Uma maxed** | 485 refined, 822 h (493, 835 h with her own moon) | 510, 864 h (518, 878 h) | 520, 881 h (528, 895 h) |
| **Level** | Craft Level, one per Uma, today's curve | The same | The same |

Hours are work at Craft Lv 25's speed before a building's speed, as today's 776 is.

## 4. Trades: who works where

An Uma's fight type gives her a **trade**: one gathering profession and one making profession. She works only her
trade's two yards (in Tier 1). She picks which one by what's short. One **Craft Level** covers both, as today.

| Fight type | Class | Gathers at | Makes at | Her yards' huts |
|---|---|---|---|---|
| **Physical** | Brawler | **Mine**: Mining | **Forge**: Weapon Crafting | 4 shafts · 4 anvils |
| **Physical hybrid** | Spell Blade | **Lumber Camp**: Wood Chopping | **Armorer**: Armor Crafting | 4 saw sheds · 4 benches |
| **Healer** | Paladin, Cleric | **Fields**: Farming | **Workbench**: Material Processing | 4 plots · 4 mills |
| **Magical hybrid** | Summoner | **Fishery**: Fishing | **Charm Shop**: Accessory Crafting | 4 jetties · 4 tables |
| **Magical** | Mage | **Hunting Grounds**: Hunting | **Lapidary**: Jewel Crafting | 4 lodges · 4 wheels |

Hunting is the owner's "fighting for gems": she fights wild beasts for the **stones** they carry (Quartz, Garnet …),
cut at the Workbench and set as jewels at the Lapidary. *Changed in cross-reference: "Gem Hunting". "Gem" is only the
weapon line's word (gear GE12), so the hunt's items are stones and the profession is plain Hunting, like its four
neighbours.*

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

**Ten yards, one per profession, in today's ten side spots** ([map preview](previews/professions-map.html)). Each row
is one trade: gathering on the left, making on the right, so an Uma's two yards sit side by side. The trunk road runs
down the middle; the Lapidary's middle spot is freed.

| Row | y | Left (x) | Right (x) | Trade |
|---|---|---|---|---|
| 1 | 0.10 | Mine (0.24) | Forge (0.74) | Physical |
| 2 | 0.30 | Lumber Camp (0.20) | Armorer (0.76) | Physical hybrid |
| 3 | 0.51 | Fields (0.22) | Workbench (0.78) | Healer |
| 4 | 0.71 | Fishery (0.22) | Charm Shop (0.78) | Magical hybrid |
| 5 | 0.90 | Hunting Grounds (0.26) | Lapidary (0.74) | Magical |

- **A yard is one place,** with today's name pill, pips and quick look. Its building is a cluster of **huts**: small
  one-tile buildings, one Uma each. Four in Tier 1, drawn 2 × 2 in the footprint one building takes today.
- **One pip a hut.** Four pips is one row, so a yard is 112 px tall, as today's facilities are below level 3.
- **It fits.** Five yards a column need 592 px; the map has 675 at 390 × 844. It's today's measured layout
  ([second profession](../second-profession.md) §7), with one row of pips at every tier. At 375 × 667 it's as tight as
  today's Wilds.
- **No upgrades.** A yard's huts are its tier's. Every hut works at today's level-3 speed, ×1.25.
- **Drawing huts** is a kit change: a place drawn as n one-tile buildings (2 × 2, 3 × 2, 4 × 2) in its footprint. It
  goes to uma-platform as a "Both apps:" request ([change protocol](../../change-protocol.md)); uma-art adds ten hut
  tiles. Until it ships, a yard draws today's frame (Mine, Forge, Workbench, Lapidary) or the kit's marker, and the
  pips show the huts.

### 5.2 Materials

**Two types per gathering profession: a low one and a high one.** The low type opens at Craft Lv 1 and goes into
grades 1–5 of everything; the high type opens at Lv 26 and goes into grades 6–10. Processing turns one raw item into
one refined, as today. **Twenty item types** in all, 18 of them today's ids.

| Profession | Low: grades 1–5, Craft Lv 1 | High: grades 6–10, Craft Lv 26 | A maxed Uma uses |
|---|---|---|---|
| Mining | Copper Ore → Copper Ingot | Iron Ore → Iron Ingot | 105 |
| Wood Chopping | Pine Log → Pine Plank | Oak Log → Oak Plank | 95 |
| Farming | Flax → Linen | Cotton → Cotton Cloth | 95 |
| Fishing | Seashell → Shell Carving | **Pearl → Polished Pearl** (new ids) | 95 |
| Hunting | Quartz → Cut Quartz | Garnet → Cut Garnet | 95 |

Ten grades stay where they matter: on the items an Uma uses (gear.md's grades, extra-stats.md's jewels), gated at
Craft Lv 5g − 4 to make.

### 5.3 What the making yards make

The items are gear.md's and extra-stats.md's; their recipes and sizes are this doc's. **Each making yard uses about a
quarter of the refined items**, and each recipe is one fixed set: grades 1–5 take the low types, 6–10 the high.

| Item | Yard | Refined a piece | Grades 1–5 | Grades 6–10 |
|---|---|---|---|---|
| **Weapon Gem** (raises any weapon a grade) | Forge | 4 | 2 Copper Ingot, 2 Pine Plank | 2 Iron Ingot, 2 Oak Plank |
| **Armor Fittings** (any slot, either half) | Armorer | 2 low, 3 high | 1 Linen, 1 Shell Carving | 1 Iron Ingot, 1 Oak Plank, 1 Cut Garnet |
| **Accessory Setting** (any type) | Charm Shop | 12 | 6 Linen, 6 Shell Carving | 6 Cotton Cloth, 6 Polished Pearl |
| **Moon Jewel** I–V (grades 2, 4, 6, 8, 10) | Lapidary | 4 | 3 Cut Quartz, 1 Copper Ingot | 3 Cut Garnet, 1 Iron Ingot |
| **Planet Jewel** I–V (grades 1, 3, 5, 7, 9) | Lapidary | 8 | 2 each: Cut Quartz, Pine Plank, Linen, Shell Carving | 2 each: Cut Garnet, Oak Plank, Cotton Cloth, Polished Pearl |
| Refine | Workbench | 1 raw | Every low type | Every high type |

- **Easy to say:** weapons take ingots and planks; light armor cloth and shells, heavy armor iron, oak and a garnet;
  accessories cloth and pearls; jewels cut stones on a metal mount, the planet a bit of everything.
- **Every class needs the same items** (gear.md: a Weapon Gem raises any weapon, a fitting any slot of either half, a
  setting any type), so every Uma needs the same materials, and a party is five times one Uma. No class leans on a yard.
- **The accessory is the big piece.** Tier 1 has one accessory and five armor slots. For the Charm Shop's trade to be as
  busy as the Armorer's, a setting costs what a grade of the whole suit does (PR8). It shrinks as slots grow: 6 with two
  accessories (Tier 2), 4 with three (Tier 3).
- **The making yards' two types** are the low and the high recipe of each line.

### 5.4 Time, gates and batches

| Job | Time (Craft Lv 1 → 50), before ×1.25 | Batch | Gate |
|---|---|---|---|
| Gather one item | 54 → 36 min, any type (today) | 1–10 | Low Lv 1, high Lv 26 |
| Process one item | A quarter: 13.5 → 9 min (today) | ×1, 4, 8, 20, 40 | Its type's |
| Make one piece | **One gather's time per refined item in it**: a Weapon Gem or Moon Jewel 4 gathers, a fitting 2 or 3, a setting 12, a Planet Jewel 8 | 1–10 | Grade g at Lv 5g − 4 (today) |

- Today's makes take two refined items and two gathers' time, so the rule is today's, extended.
- Craft EXP is 2 a minute of the job at her level, before the hut's speed (today). Queues, Repeat, Recall, Speed
  Tickets and stopped queues don't change: they're uma-work's.
- **The trade gate** lives in the job kinds' `plan` (it knows the slot's building): another trade's Uma is refused, and
  the kit's picker shows her with "Another trade". No engine change.

### 5.5 The demand math

The counts come from the other drafts; where they move, the sizes move and the balance holds ([Assumes](#9-assumes)).
Numbers are in the [demand preview](previews/professions-demand.html).

**One Uma, maxed, Tier 1** (any class):

| Her need | Pieces | At | Refined each | Refined |
|---|---|---|---|---|
| 3 weapons, grade 0 → 10: a Weapon Gem a step (gear.md) | 30 | Forge | 4 | 120 |
| 5 armor slots, grades 1–10: Armor Fittings (gear.md) | 50 | Armorer | 2 or 3 | 125 |
| 1 accessory slot, grades 1–10: a Setting a step (gear.md) | 10 | Charm Shop | 12 | 120 |
| Extra Stats: Planet Jewel I–V, Moon Jewel I–V on four moons (extra-stats.md) | 25 | Lapidary | 8 or 4 | 120 |
| **Total** | **115 pieces** | | | **485**, from 485 raw and 485 refines |
| + her own moon (variance.md, ES12): Moon Jewels II and IV | 2 | Lapidary | 4 | 8: **493**, about 835 h |

- **Her moon** sits outside the shared demand, as it sits outside the foe budget: every Uma has one, and its two jewels
  add 6 Hunting and 2 Mining gathers and 8 Lapidary refined items. With it the trades span 19.4–20.6% of the work.
- **A second class** adds only the weapons she hasn't raised (gear.md §3.1): up to 30 more Weapon Gems, 120 refined.
  Armor and the accessory follow her slots, so they cost nothing again.

**What each trade carries** (hours at Lv 25's speed):

| Trade | Gathers | Makes or processes | Hours | Share |
|---|---|---|---|---|
| Physical: Mine · Forge | 105 | 120 refined | 169 | 20.6% |
| Physical hybrid: Lumber Camp · Armorer | 95 | 125 refined | 166 | 20.2% |
| Healer: Fields · Workbench | 95 | 485 refines | 163 | 19.8% |
| Magical hybrid: Fishery · Charm Shop | 95 | 120 refined | 162 | 19.7% |
| Magical: Hunting Grounds · Lapidary | 95 | 120 refined | 162 | 19.7% |
| **One Uma** | 485 | | **822** | |

**A party** is five times that: 525 Mine, 475 from each other gathering yard. **A Rift run's twenty:** 2,100 and 1,900.

**Supply: one Uma in one hut** (×1.25):

| Her Craft Lv | Gathers a day | Processes a day | A Weapon Gem or Moon Jewel | A fitting | A setting | A Planet Jewel |
|---|---|---|---|---|---|---|
| 1 | 33 | 133 | 2.9 h | 1.4 or 2.2 h | 8.6 h | 5.8 h |
| 25 | 40 | 159 | 2.4 h | 1.2 or 1.8 h | 7.2 h | 4.8 h |
| 50 | 50 | 200 | 1.9 h | 1.0 or 1.4 h | 5.8 h | 3.8 h |

**A roster at the owner's pace** (one party fights, dozens work): 40 Umas, 8 a trade, fill the 40 huts.
- One Uma maxed is 657 hours of hut time. The roster makes about **1.3 maxed Umas a day**; each trade's four making huts
  set the pace (the Armorer's 125 the most).
- **A party's next grade** (a tenth of five Umas) takes the roster about **9 hours**. A whole party, about 4 days.
- **What gates gear is Craft Level, as today:** grade 6 opens at Craft Lv 26, day 11 for an Uma working nonstop; grade
  10 at Lv 46, day 22. Volume is never the wall for the fighting party.
- **The trade split doesn't stall it:** a trade's 8 huts need 8 of its Umas only when the whole roster gears at once.
  At the Calling's 17–23% a trade, a 40-Uma roster has 7 to 9 of each. A short trade buys raw items at the Exchange.

### 5.6 Tier 1, today and proposed

| | Today | Proposed |
|---|---|---|
| Places on the Wilds | 11 facilities | 10 yards |
| Buildings, slots | 11 buildings, 33 slots (55 at level 3) | 40 huts, 40 slots |
| Upgrades | 22, each Laurels and two families' refined items | **None** |
| Gathered items | 80 | **10** |
| Refined items | 80 | **10** |
| Things to make | 400 gear pieces, 100 Star Gems | **40**: Weapon Gem, Armor Fittings and Accessory Setting × 10 grades; Planet and Moon Jewels I–V |
| Recipe rule | Four family pairs rotating by type and grade; Star Gems with side items | **One fixed set an item**; low types for grades 1–5, high for 6–10 |
| Job kinds | 4 (gather, refine, craft, cut) | 4 in the engine; the player sees gather, process, make |
| Where an Uma can work | Any of 11 | **Her 2 yards** |
| Choices when gathering | 10 grades | 2 (1 before Craft Lv 26) |
| Choices when refining | 80 | 10 |
| Per Uma, maxed | 472 raw, 472 refined, 220 pieces, 776 h | 485, 485, 115, 822 h (493 and 835 h with her moon's 2 jewels) |
| **Added** | — | Trades; the low/high choice |

### 5.7 Around the yards

| Area | Tier 1 |
|---|---|
| **The Exchange** | Sells every type it stocks: the low types after the tier's first win, the high types after a win on its third continent. Low 30 Laurels, high 80. Selling: raw 6 / 16, refined 12 / 32, made items as today (6 + 6g) |
| **The Warehouse** | Materials: twenty icons, raw then refined, by profession. The other shelves are gear.md's and extra-stats.md's |
| **Targets** (D126) | Unchanged: up to ten Umas, the same MRP pass. Each yard's strip lists what targets need from it; "Start" offers only its trade's free Umas |
| **The profile** | Work tab: her trade's two yards and Craft Level. The header chip stays "Craft Lv 23" |
| **The Stable** | A **Trade** filter, on locked outfits too, so a new unlock can fill a short trade |
| **The yard page** | Today's facility page: header (no Upgrade), one row per hut, the target strip, the job sheet (Who → How many → What). Its picker lists the trade's Umas first; others greyed with "Another trade" |
| **Notifications, Collect all** | Unchanged |

## 6. Tier 2

**Depth grows from the trade outward; Tier 1's knowledge carries over unchanged.**

| Piece | Tier 2 |
|---|---|
| **Huts** | Two more a yard: **6** (60). The new two are drawn in the tier's colour. Pips: three faces and "+3" |
| **Materials** | Each gathering profession adds the **Tier 2 pair**: Silver Ore / Mythril Ore, Cedar Log / Elderwood Log, Wool / Silk Cocoon, Coral / Black Pearl, Sapphire / Diamond, each with its refined form. Low from Craft Lv 1, high from Lv 26, as in Tier 1 |
| **Base items** | Tier 1's recipes, unchanged. Sizes follow the counts: two accessory slots make a setting 6; jewels resize so the Lapidary stays near 120 per Uma |
| **New pieces** | gear.md's fork gems (Dual, Pure: one a weapon at G5) and extra-stats.md's Halo Jewels I–II. Each takes its line's base recipe at its grade **plus one refined item of each Tier 2 pair**: 5 new pieces, 25 items per Uma. Budget: up to 48 (a tenth more work) for whatever the other docs add |
| **Main profession** | Only her own trade's gathering yard gives her the Tier 2 pair: her main profession "reaches its higher tier" |
| **Secondary profession** | One other gathering profession, picked on her profile's Work tab, once per tier, free. She gathers its **base pair**, at her Craft Level's speed and gates. Changing it costs 1,000 Laurels. Gathering only: making stays her trade's |
| **The Exchange** | The base pair as in Tier 1; the Tier 2 pair's low type after a win on continent 2, high after continent 4. Same prices |
| **One Uma maxed** | 510 refined, **864 h** (518, 878 h with her moon) |

The secondary is where Tier 2 softens the trade split: base items are about 95% of the gathering, and any Uma can
help one more profession with them. A run of twenty arrives with about four Umas a trade; each picks a secondary where
her world is short.

## 7. Tier 3

| Piece | Tier 3 |
|---|---|
| **Huts** | Two more a yard: **8** (80), drawn 4 × 2: four 24 px tiles, inside a yard's 112 px. Pips: three faces and "+5" |
| **Materials** | The **Tier 3 pair**: Titanium Ore / Orichalcum Ore, Ebony Log / Yggdrasil Branch, Moonsilk Cocoon / Cloudfleece, Leviathan Scale / Abyss Pearl, Starstone / Philosopher's Stone |
| **New pieces** | gear.md's Tier 3 fork gems (Prism, Tempered, Keen, and Dual or Pure for a weapon arriving as Base: 3 an Uma) take one of each Tier 3 pair; the Halo Jewels (I–II for each of her two kinds: 4) keep the Tier 2 pairs. **35 items per Uma**, inside the 48 budget. Settings 4 (three slots). *Changed in cross-reference: "about 25" counted one Halo kind* |
| **Secondary** | Reaches one tier behind her main: its base pair **and its Tier 2 pair** |
| **One Uma maxed** | 520 refined, **881 h** (528, 895 h with her moon) |

The rule for every later tier: one more pair per gathering profession, two more huts per yard, the tier's new pieces
from that tier's pairs within a tenth more work, and the secondary trailing the main profession by one tier.

## 8. Provides

| To | What |
|---|---|
| classes.md, variance.md | The five trades by fight type (§4); the fallback trade rule |
| gear.md | Recipes and sizes for Weapon Gems (4), Armor Fittings (2 / 3) and Accessory Settings (12 · 6 · 4 by slot count) (§5.3); fork gems = the Weapon Gem's G5 recipe + one of each tier pair; the make-time rule; the low/high grade bands |
| extra-stats.md | Jewel recipes (Moon 4, Planet 8 at 25 jewels per Uma); Halo Jewels = the Moon Jewel's recipe + one of each Tier 2 pair; the Lapidary's budget: about 120 refined per Uma, its jewels resized to fit |
| Everyone | The material catalog per tier (§5.2, §6, §7); the budget for a tier's new pieces (a tenth more work, from that tier's pairs) |
| The cross-reference pass | The Wilds map (§5.1) and the per-tier demand table for `progression.html` |
| The refund | The conversion table from today's 160 items (§10) |
| Pacing | Per Uma: 822 / 864 / 881 hours (835 / 878 / 895 with her moon); the roster and run figures (§11) |

## 9. Assumes

| From | What this doc assumes | If it differs |
|---|---|---|
| **gear.md** (GE12) | Per Uma per tier: 30 Weapon Gems (27 + 3 fork gems from Tier 2), 50 Armor Fittings, Accessory Settings 10 · 20 · 30. One item of a line fits any weapon, slot or type | Sizes rescale so the Forge, the Armorer and the Charm Shop each stay near **120 refined per Uma** |
| **gear.md** (§8) | **Reconciled:** gear.md drafted rotating pairs and triples at about 220 refined for gear; it now takes these recipes. Gear takes 365 and jewels 120: each making yard at a quarter. The Uma's total, 485, is today's 472 | — |
| **classes.md** (CL14, §5) | 3 weapons, 5 armor slots, accessories 1 · 2 · 3; a class switch moves no job | — |
| **extra-stats.md** (ES7, ES12) | Tier 1: 5 Planet and 20 Moon Jewels per Uma (four moons). Tier 2 adds Halo Jewels I–II (one kind), Tier 3 a second kind (I–II again). Her template moon's 2 (Moon Jewels II and IV, every tier; *reconciled*) add 8 refined | Jewel sizes rescale to keep the Lapidary near 120 per Uma |
| **variance.md** (U4) | Her Calling names one fight type; today's split is 17.0–22.6% per fight type | U4's rule ships with this packet alone (§4); no second rule |
| **Tier 2 and 3 additions** (all docs) | A tier's new pieces cost at most a tenth more work per Uma (48 refined), from that tier's pairs | Their recipes shrink to fit: the rate holds |
| **The kit** (uma-platform) | A "Both apps:" option to draw a place as n one-tile huts; uma-art's ten hut tiles; icons for Pearl and Polished Pearl (and the Fishing pairs of Tiers 2 and 3) | Interim frames and badges, as D144 did |
| **The brief's §2** | One addition: "an Uma works one **trade**, the gathering and the making profession of her fight type, on one Craft Level" | — |

## 10. Save impact

Save **v26**, the Tier 1 rework's single migration ([README §9](README.md#9-engine-save-and-refund)): the gear and Star
Gem refunds come back as today's ids, so this conversion must run in the same step. Every world gets the same
migration. `OwnedUma.secondary` (Tier 2+) joins with Tier 2's toolbox, v27.

| Today in the save | After | For the refund |
|---|---|---|
| `items`: 80 raw, 80 refined | **Converted one for one** by family and grade band (table below): raw to raw, refined to refined | Nothing lost |
| `buildings`: 11 facilities' levels | Dropped: yards have no levels | Each paid upgrade back: its Laurels, and its refined items converted |
| `work`: rows, queues, Repeat | Settled, collected and recalled: finished items paid with their Craft EXP, unfinished inputs returned, then converted. Queues and Repeat drop | Only time in progress is lost |
| `gems` (Star Gems) and `gear` in stock, bound gear, set Star Gems | Deleted by gear.md (GE15) and extra-stats.md (ES14) | Their raw items come back as today's ids, then convert by the table |
| `OwnedUma.craft` | **Kept** | — |
| `OwnedUma.secondary` | New, Tier 2+ worlds only, empty until picked | — |
| `targets` | Kept; their lines recompute from the new recipes | — |
| Place ids | Kept: `mine`, `forge`, `workbench`, `lapidary`. Removed: `monster-den`, `ley-spring`, `crystal-cavern`, `quarry`, `meadow`, `forest`, `fossil-dig`. New: `lumber-camp`, `fields`, `fishery`, `hunting-grounds`, `armorer`, `charm-shop` | A link or remembered page to a removed id opens the Wilds page |

**The conversion table:**

| Today's family (site) | Becomes | Grades 1–5 → | Grades 6–10 → |
|---|---|---|---|
| Ores (Mine), Stones (Quarry) | Mining | Copper Ore / Copper Ingot | Iron Ore / Iron Ingot |
| Woods (Forest) | Wood Chopping | Pine Log / Pine Plank | Oak Log / Oak Plank |
| Fibers (Meadow) | Farming | Flax / Linen | Cotton / Cotton Cloth |
| Essences (Ley Spring), Bones & Horns (Fossil Dig) | Fishing | Seashell / Shell Carving | Pearl / Polished Pearl |
| Crystals (Crystal Cavern), Hides & Scales (Monster Den) | Hunting | Quartz / Cut Quartz | Garnet / Cut Garnet |

Of today's 160 ids, 18 stay as Tier 1's pairs and 32 come back as Tier 2's and 3's (Silver Ore, Cedar Log, Wool,
Sapphire …). The other 110 leave the code; old-save fixtures keep them, as D144's did. Stock is converted by this
table in every world, so a Tier 2 world's old Silver Ore becomes Copper Ore like any other, and its Tier 2 pairs start
empty.

## 11. Pacing

**Unchanged:** Craft Level's curve (D96), 2 EXP a minute, the gate 5g − 4, gather minutes, refining at a quarter.

**Per Uma:** 822 hours at Lv 25's speed against today's 776 (+6%), or 657 hut hours at ×1.25 against today's 621 at
level 3. Her own moon's two jewels make it 835 hours (+8%).

**Craft Level comes about two days sooner.** Today's facilities work ×1 until level 3, which needs grade-5 refined
items: about day 11. Huts work ×1.25 from day 1:

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
| Workers, huts | 40, 40 | 20 (one run), 60 | 20, 80 |
| One Uma maxed (hut hours) | 657 | 691 | 705 |
| A party maxed | About 4 days | 7.2 days | 7.3 days |
| A run of twenty maxed | About 16 days of all 40 huts | 28.8 days | 29.4 days |
| Today | 40 workers: 12.9 days | About four weeks ([Tier 2's world](../tier2-world.md) §11) | — |

- **Tier 1:** the fighting party's next grade waits on Craft Level, not on volume, as today. Forty huts work about
  18% less than forty workers in today's 55 slots at full occupancy; it shows only when the whole roster gears at once.
- **Tiers 2 and 3:** within a day of today's four weeks, held by the tenth-more budget.
- **Laurels:** no upgrade costs (at most 7,150 a world today); Exchange prices sit between today's grade 2 and 7.
- **What would move it:** a category adding more than a tenth a tier. Its recipes shrink instead.

## 12. Decisions

| Call | Recommendation | Alternatives | Why |
|---|---|---|---|
| **PR1** What ties a profession to a fight type | Her **Calling's** fight type (variance.md U4), fixed in her world; never her class. If Professions ships first, U4's rule ships with it. *Changed in cross-reference: the separate fallback rule dropped* | Her current class; her starting class | Class switches are free, so following them means nothing. Starting classes split 17 / 53 / 24 / 5% and starve two trades |
| **PR2** One profession or two per Uma | One **trade**: her fight type's gathering and making professions, on **one Craft Level** | One of ten per Uma; two levels | Ten buckets skew worse and idle yards. One level is today's, with nothing new to track |
| **PR3** The pairings | Physical: Mine · Forge. Physical hybrid: Lumber Camp · Armorer. Healer: Fields · Workbench. Magical hybrid: Fishery · Charm Shop. Magical: Hunting Grounds · Lapidary | Any other matching | Each reads as one craft; the rows mirror the Learning page, physical at the top |
| **PR4** What a building is | A **hut for one Uma**: 4 a profession in Tier 1 (40), 6 in Tier 2, 8 in Tier 3. No upgrades; every hut works ×1.25 | Two Umas a hut (80 slots; two rows of pips break the map); keep facility levels | The owner's four buildings, one pip each, and 22 upgrade decisions gone. ×1.25 keeps today's level-3 rate |
| **PR5** The map | Ten yards in today's ten side spots, **one row a trade**, gathering left, making right | Forty places (fifteen fit at 390 px); a fifth Hub page (the bar is full, D147) | It's today's measured layout, and an Uma's two yards sit side by side |
| **PR6** Drawing huts | A "Both apps:" kit option: a place drawn as n one-tile huts; **ten hut tiles** in uma-art | Thirty yard frames (ten yards × three tiers) | Lean art; one option serves uma-racer's plots too |
| **PR7** Materials | **Two types a gathering profession**: low (grades 1–5, Lv 1) and high (6–10, Lv 26); refining one for one | Ten grades each (today's 160 items); one type each | The owner's two types; grades still matter on the items |
| **PR8** Recipes | **One fixed set an item** (§5.3), sized so each making yard uses about a quarter of the refined and each gathering yard about a fifth: every trade 19.7–20.6% of the work | gear.md's rotating pairs and triples (about 220 refined of gear; gear.md now adopts these) | Rotation balances, but no one can say what an item takes. At 240 the three gear trades idle a fifth of the time, and an Uma costs a quarter less than today |
| **PR9** Make time | **One gather's time per refined item** in the piece | Today's flat two gathers | It's today's rule for today's two-item recipes; bigger pieces take longer, so trades stay even |
| **PR10** How tiers grow | **One more pair a gathering profession and two more huts a yard** each tier; a tier's new pieces take their base recipe plus one of each of its pairs, within a tenth more work; base recipes never change | Re-split the ten grades over more types each tier | Tier 1's recipes stay true forever, depth arrives with the tier, and the rate holds |
| **PR11** Secondary profession | From Tier 2: one other **gathering** profession's base pair, picked once a tier, free; changing costs 1,000 Laurels. In Tier 3 it reaches that profession's Tier 2 pair | Set by rule; free changes; a making secondary | It's the owner's idea, and it lets the player fix a short trade. Free changes would undo the trades |
| **PR12** The second profession (Q13) | **Replaced:** no Lore Level, Relics, Glyphs, Battlefield, Shrine or Scriptorium. Tier 2's new pieces take the Tier 2 pairs | Keep Lore as an eleventh profession | The trades already grow a tier at a time, with no second level and no work on the Battle page |
| **PR13** The Exchange | Every type, by pair: base low after the tier's first win, base high after continent 3, a tier's own pair after continents 2 and 4; low 30, high 80 Laurels | Today's two grades a continent | Twenty types don't need a grade ladder; prices sit inside today's range |
| **PR14** Old saves | Convert stock one for one by family and grade band; collect and recall all work; refund upgrades; keep Craft Level | Wipe the Wilds | The owner leans to refunding raw materials; nothing earned is lost |
| **PR15** The Stable | A **Trade** filter, on locked outfits too | None | New unlocks can fill a short trade |
