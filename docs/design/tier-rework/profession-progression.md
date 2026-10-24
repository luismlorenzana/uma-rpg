# Profession Progression: ten professions from Tier 1 to Tier 3

> **Owner direction (2026-10-24, the weapon review): the raw-material refund is not the main approach.** Every Craft Level (the work levels, and today's farm and craft levels in old saves) **resets to 1**, and the player is **granted tickets for the time it took to reach those levels**; deleted crafted gear and Star Gems are compensated the same way rather than item by item. **This doc's review reworks §14 (PP19, PP20) around it.**

> **Authored 2026-10-24. Nothing here is built.** The fourth standalone doc of the Tier rework
> ([README §5](README.md#5-the-plan), step 3.4). It absorbs [professions.md](professions.md) (the
> first round, as revised after the owner's first review), which stays as history, and supersedes every PR call
> ([§16](#16-decisions) maps each one). Calls are **PP1–PP23**, each with a recommendation. No open questions.
>
> **What it keeps from the first round:** ten professions, one **trade** an Uma by her calling, ten buildings that exist
> today with four slots each in every tier, two material types a gathering profession in Tier 1 (all today's icons), a
> secondary from Tier 2, one fixed recipe an item. **What it adds or changes:**
> - **Profession types** ([§2](#2-profession-types)): three kinds of work, gathering, processing and making, and who
>   works where at each tier.
> - **Material types** ([§3](#3-material-types)): five material lines, a low and a high type each a tier, every one an
>   existing icon; **the ladder** (PP9): an item's grade decides its material, and each later tier moves the top grade of
>   each band onto its own pair. Tier 2's materials become a fifth of the work, not the first round's twentieth.
> - **The secondary takes any other profession's base work** (PP14), making included, so a thin trade never stalls a run.
> - **SB1: amounts don't scale with the tier** (PP11); stat values do. One Uma maxed is **485 · 503 · 521** refined items
>   (493 · 511 · 529 with her own moon), every tier within a tenth of Tier 1.
> - **The catalog reordered** so each tier's pair sits above the last on today's grade ladder (PP8): Mining's Tier 2 is
>   Silver and Titanium, Tier 3 Mythril and Orichalcum; Wood Chopping's Mahogany and Ebony, then Elderwood and Yggdrasil.
> - **The Exchange by tier** (PP17), **the open shop** (PP16), **the refund paid in the new recipes' mix** (PP20).
>
> **Cross-checked with the other three standalone docs, 2026-10-24** ([README §7](README.md#7-cross-reference-and-cross-check-log),
> XC1–XC16). Nothing here changed: weapon-progression.md adopted this doc's recipes, amounts and refund mix (its §6,
> WP26), and the save numbers are **v27** (Tier 1) and **v28** (Tier 2) everywhere (§14).
>
> **Follow-up to the weapon review, 2026-10-24** ([README §7.1](README.md#71-the-cross-check-2026-10-24), XC21): wording
> only. weapon-progression.md's revision opens **all four accessory families in every tier** (base forms, then
> branches from a slot's G5, which are forms of the slot and need no item, WP34) and forks Tier 3's Dual line, so the
> Tier 3 Branch Gem reads **"Keen, Tempered or Evolved"** (the owner's points, §0, §3.5, §6.3, §9.1–§9.2, §13). **No amount moves:** Accessory
> Settings 10 · 20 · 30 an Uma, 120 refined a tier; the Branch Gem 3 a tier; one Uma **485 · 503 · 521**.
>
> **Values** follow SB1 ([README §2.5](README.md#25-the-stat-budget-sb1-working-rule-2026-10-23)) in the docs that own
> them. This doc's numbers are counts of items and hours, which SB1 doesn't touch.
>
> **Pages** (full desktop, light and dark): [the Wilds map at each tier](previews/prof-map.html) ·
> [every material type](previews/prof-materials.html) · [gathering → processing → making → what she wears](previews/prof-flow.html)
> · [demand against supply](previews/prof-demand.html).
>
> **Interfaces, not designed here:** what is crafted and how many an Uma needs belong to [weapon-progression.md](weapon-progression.md#64-the-interface-with-profession-progression-settled) (Weapon
> Gems, the Branch Gem, Armor Fittings, accessories) and [extra-stats-progression.md](extra-stats-progression.md#11-jewels)
> (jewels); the calling and its pick to [class-progression.md](class-progression.md#10-the-calling-pick) (CP29–CP30).
> This doc sets every material, recipe and amount for their items; [§13](#13-assumes) lists where their tables differ.

## The owner's points

| The owner's point | Answered in |
|---|---|
| Five gathering professions tied to the five fight types: Farming, Fishing, Mining, Wood Chopping, "Fighting for gems" | [§2.1](#21-three-kinds-of-work-pp1), [§2.2](#22-the-trade-her-callings-pair-pp2-pp3) (PP1–PP3). "Fighting for gems" is **Hunting**, whose finds are **stones** ("gem" is the weapon line's word, XR2) |
| Five crafting professions, one per fight type: Material Processing, Extra Stat Jewel Crafting, Weapon Crafting, Armor Crafting, Accessory Crafting | [§2.1](#21-three-kinds-of-work-pp1) (PP1): one processing profession and four making professions |
| A secondary profession in later tiers: "another profession's base items, while the main one reaches its higher tiers" | [§2.3](#23-the-secondary-tier-2-on-pp14-pp15) (PP14, PP15): any other profession's base work; the tier's own materials and the grades made of them stay her main trade's |
| Four small buildings per profession on the Wilds, more each tier | **Changed after the owner's first review:** one building that exists today, four slots inside, the same in every tier ([§4](#4-places-the-wilds-at-each-tier), PP4, PP5) |
| Tier 1 starts with two material types per profession; more as the tiers go | [§3](#3-material-types) (PP7, PP8): **2 · 4 · 6** types a gathering profession, every one an existing icon |
| "A real rebalance": if an Uma needs 3 weapons, 5 armors and 1 accessory, everything she needs adds up | [§6](#6-the-recipe-book) every recipe at every grade and tier; [§7](#7-tier-1-in-full)–[§9](#9-tier-3-in-full) one Uma, a party and the roster, per tier (PP10, PP11) |
| A visual page with the buildings and the amounts | [map](previews/prof-map.html), [materials](previews/prof-materials.html), [flow](previews/prof-flow.html), [demand](previews/prof-demand.html) |
| First review (2026-10-22): "it felt really blown up, too many structures to keep track of" | [§4](#4-places-the-wilds-at-each-tier) (PP4): ten places and forty slots, in every tier |
| First review: "all assets still exist, fully reuse them and only author a small set" | [§3.3](#33-the-catalog-every-type-every-tier-pp7-pp8), [§4.1](#41-ten-places-pp4-pp6) (PP6): ten existing building frames, sixty existing item icons, nothing to draw |
| **This doc (2026-10-24): "including mat types and profession types"** | **[§2](#2-profession-types) profession types; [§3](#3-material-types) material types** |
| SB1 (2026-10-23): build values × 1 / 1.8 / 2.6; do recipe amounts scale with the tier too? | [§6.4](#64-sb1-amounts-dont-scale-with-the-tier-pp11) (PP11): **no**; one Uma's work stays within a tenth of Tier 1's in every tier |
| 2026-10-24, decided elsewhere: accessories damage-oriented, slots 1 · 2 · 3; armor carries all defense; weapons Pure or Dual, then Keen, Tempered or Evolved; Extra Stats' Halo, Valor, Swiftness | [§3.5](#35-what-the-making-places-make), [§6](#6-the-recipe-book): the Charm Shop's Settings by slot count, the Branch Gem at G5, the jewels; cross-checked in [§13](#13-assumes) |
| The refund: the owner leans to refunding every raw material | [§14](#14-save-impact) (PP19, PP20) |

## 0. At a glance

| | Today (every tier) | Tier 1 | Tier 2 | Tier 3 |
|---|---|---|---|---|
| **Professions** | One: Craft Level, any job anywhere | **Ten:** five gathering, one processing, four making | The same | The same |
| **Who works where** | Any Uma, any of 11 facilities | **Her trade:** her calling's gathering place and crafting place | + a **secondary**: one other profession's base work (a third place) | The secondary reaches its Tier 2 work |
| **Places on the Wilds** | 11 facilities | **10 places**, one existing building each | 10 | 10 |
| **Work slots** | 33 → 55 with upgrades | **40**, 4 a place, ×1.25 from day 1 | 40 | 40 |
| **Upgrades** | 22, Laurels and refined items | **None** | None | None |
| **Material types a gathering profession** | One family of 10 grades (8 families) | **2:** a low and a high type | **4:** + Tier 2's pair | **6:** + Tier 3's pair |
| **Item ids, raw and refined** | 160 | **20** | 40 | 60 |
| **Which material a grade takes** | Its family's grade; two families a piece, rotating | **Grades 1–5 the low type, 6–10 the high type** | **G5 and G10 from Tier 2's pair** (the ladder) | **G4 and G9 Tier 2's, G5 and G10 Tier 3's** |
| **Things made** | 40 gear types × 10 grades; 100 Star Gems | Weapon Gem, Armor Fittings, Accessory Setting G1–G10; Planet and Moon Jewels I–V | + the G5 **Branch Gem** (its branch, Pure or Dual, picked when used); Halo Jewels I–II | + Halo Jewels III–IV; the Branch Gem in Tier 3's materials (Keen, Tempered or Evolved) |
| **Recipes** | Two refined items, the family pair rotating with type and grade | **One fixed set an item** | The same amounts; the band tops on Tier 2's types | The same amounts |
| **One Uma maxed: refined · pieces · hours** | 472 · 220 · 776 h | **485 · 115 · 822 h** | 503 · 129 · 852 h | 521 · 143 · 883 h |
| **With her own moon** | — | 493, 835 h | 511, 866 h | 529, 896 h |
| **Made from the tier's own materials** | — | — | **21%**, her main trade's alone | **21%** (+ 22% from Tier 2's) |
| **A party's volume** | 6 days (the Forge's 5 slots) | **3.9 days** (40 workers) | 7.1 days (the run's 20) | 7.4 days |
| **A run of twenty** | 24 days | **15.7 days** | **28.4 days** (40.3 without secondaries) | **29.4 days** (44.7) |
| **Grade 10 opens** (Craft Lv 46, nonstop) | Day 24 | **Day 22** | Day 22 | Day 22 |
| **New art** | — | **None** | None | None |

Hours are work at Craft Lv 25's speed before a place's ×1.25, as today's 776 is. A party and a run are the roster's
volume with every slot it can fill busy; the fighting party's next grade waits on Craft Level, not on volume
([§7.4](#74-a-party-and-the-roster)).

#### Later tiers at a glance

| Piece | Tier 2 | Tier 3 | Where |
|---|---|---|---|
| **Materials** | Each gathering profession adds its Tier 2 pair: Silver, Titanium · Mahogany, Ebony · Wool, Silk Cocoon · Trilobite, Tide Essence · Sapphire, Diamond | Tier 3's: Mythril, Orichalcum · Elderwood, Yggdrasil Branch · Moonsilk Cocoon, Cloudfleece · Aether, Prismatic Essence · Starstone, Philosopher's Stone | [§3.3](#33-the-catalog-every-type-every-tier-pp7-pp8) |
| **The ladder** | G5 and G10 of every line are made of Tier 2's pair | G4 and G9 of Tier 2's, G5 and G10 of Tier 3's | [§3.4](#34-the-ladder-a-grade-decides-its-material-pp9) |
| **Her work** | Her trade, all of it; a **secondary**'s base work | + the secondary's Tier 2 work | [§2.3](#23-the-secondary-tier-2-on-pp14-pp15) |
| **New pieces** | The G5 **Branch Gem** on each weapon (Pure or Dual, picked when used); **Halo Jewels I–II**; Valor's two Moon Jewels | The Branch Gem again, in Tier 3's materials (Keen, Tempered or Evolved); **Halo Jewels III–IV**; Swiftness's two Moon Jewels | [§6.3](#63-the-tiers-new-pieces) |
| **Accessories** | Two slots: 20 Settings of 6 refined | Three: 30 of 4 | [§6.1](#61-the-base-recipes-pp10) |
| **The Exchange** | Tier 2's pair after continents 2 and 4; prices × 2 | × 3 | [§10](#10-the-exchange-pp17) |
| **What stays** | Places, slots, the map, every amount, Craft Level's curve and gates | The same | [§4](#4-places-the-wilds-at-each-tier), [§5](#5-jobs-gates-and-times) |

## 1. Today

[Materials](../../game/materials.md), [loops](../../game/loops.md#craft-level) and
[sections](../../game/sections.md#facilities) are the manual; [after the farm](../after-the-farm.md) (D144) is why it
looks this way. Code: `items/families.ts`, `economy/jobs.ts`, `economy/pacing.ts`, `save/work.ts`, `hub/places.ts`.

| Piece | Today |
|---|---|
| **Profession** | One per Uma, **Craft Level** 1–50 (`craft`, D144). Every Uma can work anywhere |
| **Places** | Eleven facilities on the Wilds page: eight gathering sites, the Workbench, the Forge, the Lapidary |
| **Slots** | 3 / 4 / 5 by facility level: 33 at level 1, 55 at level 3; level 3 works ×1.25. 22 upgrades, each Laurels and two families' refined items |
| **Materials** | 8 families × 10 grades: 80 raw, 80 refined. Grade g opens at Craft Lv 5g − 4 |
| **Products** | 40 gear types × 10 grades; 100 Star Gems |
| **Recipes** | Gear: two refined items of its grade, the family pair rotating with type and grade (D139). Star Gems: a stat's family plus side items |
| **Times** | A gather 54 min at Lv 1 to 36 at Lv 50; a refine a quarter of that; a craft or a cut two gathers |
| **One Uma maxed** | 472 raw, 472 refined, 220 products, about 776 hours at Lv 25's speed |
| **What binds a roster** | **The Forge:** 120 crafts an Uma at two gathers each is 145 slot-hours; its five slots make 0.83 maxed Umas a day, whatever the roster |
| **Each tier** | The same eleven facilities in its own world; Craft Level starts at 1 for an ascended Uma (`ascend` makes her a fresh `OwnedUma`) |

The Tier 2 proposal [second profession](../second-profession.md) (Q13) added Lore Level and three Tier 2 sites. This doc
replaces it (PP18), as the first round did.

## 2. Profession types

### 2.1 Three kinds of work (PP1)

The owner's ten split into three kinds by what the work does. **Gathering** brings material into the world,
**processing** turns raw into refined, **making** turns refined into the items an Uma uses. The owner's five "crafting"
professions are the processing one and the four making ones.

| Kind | Profession | The owner's name | Place | Job | In | Out |
|---|---|---|---|---|---|---|
| **Gathering** | **Mining** | Mining | Mine | Gather | — | Ores |
| | **Wood Chopping** | Wood Chopping | Forest | Gather | — | Logs (and a Yggdrasil Branch) |
| | **Farming** | Farming | Fields | Gather | — | Flax, cotton, wool, cocoons, fleece |
| | **Fishing** | Fishing | Fishery | Gather | — | Shells, then tide and sky essences |
| | **Hunting** | Fighting for gems | Monster Den | Gather | — | Stones, carried by the den's beasts |
| **Processing** | **Material Processing** | Material Processing | Workbench | Process | One raw item | One refined item: an ingot, a plank, a cloth, a carving or infusion, a cut stone |
| **Making** | **Weapon Crafting** | Weapon Crafting | Forge | Make | Refined items | Weapon Gems; the G5 Branch Gem |
| | **Armor Crafting** | Armor Crafting | Armorer | Make | Refined items | Armor Fittings |
| | **Accessory Crafting** | Accessory Crafting | Charm Shop | Make | Refined items | Accessory Settings |
| | **Jewel Crafting** | Extra Stat Jewel Crafting | Lapidary | Make | Refined items | Planet, Moon and Halo Jewels |

- **Gathering** is the only work that creates material, and its time is the unit for all work: **one gather**, 54
  minutes at Craft Lv 1 to 36 at Lv 50 (today's). A job brings back 1–10 items.
- **Processing** turns one raw item into its refined form in a quarter of a gather, in batches of ×1, 4, 8, 20 or 40
  (today's Workbench). **Every refined item in the game passes through it**, so Material Processing serves every trade.
- **Making** turns refined items into one made item in **one gather's time a refined item in it** (PP12), 1–10 a job.
  A made item raises one of her slots a grade or opens one node; it is used up.
- **In the engine** the job kinds stay today's four: gather, refine, craft (the Forge, the Armorer, the Charm Shop) and
  cut (the Lapidary). The player sees three words: gather, process, make.

### 2.2 The trade: her calling's pair (PP2, PP3)

Each Uma works one **trade**: the gathering profession and the crafting profession of her **calling**, her fight type by
U4's rule ([class-progression §10](class-progression.md#10-the-calling-pick)). One **Craft Level** covers both, as
today.

| Calling | Class | Umas today (of 270) | Gathers at | Crafts at | Her pair turns |
|---|---|---|---|---|---|
| **Physical** | Brawler | 61 (22.6%) | **Mine**: Mining | **Forge**: Weapon Crafting | Ore into the gems her weapons climb |
| **Physical hybrid** | Spell Blade | 56 (20.7%) | **Forest**: Wood Chopping | **Armorer**: Armor Crafting | Timber into the fittings of a suit |
| **Healer** | Paladin, Cleric | 61 (22.6%) | **Fields**: Farming | **Workbench**: Material Processing | Cloth, and everyone's refining |
| **Magical hybrid** | Summoner | 46 (17.0%) | **Fishery**: Fishing | **Charm Shop**: Accessory Crafting | Shells and essences into charm settings |
| **Magical** | Mage | 46 (17.0%) | **Monster Den**: Hunting | **Lapidary**: Jewel Crafting | Stones into the jewels of her map |

- **Her calling sets it, never her active class** (PR1, CL14, CP30 kept): classes switch freely and a switch moves no
  job. The **calling pick** (CP29) moves a Pace Uma between physical hybrid and magical (Forest · Armorer ↔ Monster Den ·
  Lapidary), so those two trades span 0–37.8% each; the Late pick moves none (healer either way). The pick's card shows
  both trades' head counts in her world, so the owner can fill a short one.
- **Why these pairs** (PR3 kept): each reads as one craft (ore to weapons, timber to armor, stones to jewels); the five
  rows mirror the Learning page, physical on top; the healer, the party's support, carries the one profession every
  trade needs.

### 2.3 The secondary, Tier 2 on (PP14, PP15)

The owner's words: a secondary is "another profession's base items, while the main one reaches its higher tiers".

| | Her main trade | Her secondary |
|---|---|---|
| **Tier 1** | All the work of her two places | — |
| **Tier 2** | **All of it:** the base pair and **Tier 2's pair**; every grade, the G5 and G10 pieces made of Tier 2's types included | **One other profession, any of the eight outside her trade** (four gathering, four crafting), **its base work:** gathering or processing the base pair; making the grades made of base types (G1–G4, G6–G9) |
| **Tier 3** | All of it, Tier 3's pair and the G5 and G10 pieces included | + its **Tier 2 work:** Tier 2's pair, the G4 and G9 pieces, Tier 2's own pieces (Halo Jewels I–II) |

- **"The main reaches its higher tiers"** (PP15): the tier's own pair, and every grade made of it, stay her trade's: a
  fifth of the tier's work (21%), and every tier's new pieces. A secondary covers the other four fifths.
- **Any profession, making included.** Making is where a thin trade binds: a Tier 2 world starts with one run's twenty,
  three of them Mages if the run follows the callings, and only Mages make at the Lapidary. With a gathering-only
  secondary (the first round's PR11) a run with two Mages takes 40 days; with this one, 28 (§8.5).
- **The pick:** on her profile's Work tab, from Tier 2: eight tiles in two rows (gathering, crafting), each with the trade's
  head count in her world and a dot where the targets are short. **Free the first time in each tier; a change costs
  1,000 Laurels × the tier** (2,000 in Tier 2, 3,000 in Tier 3; Laurels pay × tier, D170), refused while she works
  there. Promotion clears it.
- **Craft Level:** her one level, for her secondary too: the same speed and the same gates.

### 2.4 Where an Uma works, tier by tier

| | Tier 1 | Tier 2 | Tier 3 |
|---|---|---|---|
| **Places she may work** | 2: her trade's | 3: + her secondary's | 3 |
| **Types she may gather at her gathering place** | 2 (1 before Craft Lv 26) | 4 | 6 |
| **At her secondary's place** | — | Its base pair (gathering) or base grades (crafting) | + its Tier 2 work |
| **Choices she owns** | None: the calling sets the trade | The secondary | The same pick |
| **What she never does** | Another trade's work, unless its world has none (the open shop, PP16) | Another profession's newest-tier work | The same |

## 3. Material types

### 3.1 The words

| Word | Means | Example | Comes from | Goes to |
|---|---|---|---|---|
| **Raw item** | What a gathering job brings back | Copper Ore | A gathering place | The Workbench |
| **Refined item** | A raw item processed, one for one | Copper Ingot | The Workbench | A making place |
| **Material type** | One raw item and its refined form: one icon pair | Copper (Copper Ore → Copper Ingot) | — | — |
| **Material line** | A gathering profession's types, one kind of material | Metal: ore → ingot | Its gathering place | — |
| **Pair** | A line's two types for one tier: a **low** type and a **high** type | Tier 1's Mining pair: Copper, Iron | — | — |
| **Band** | Grades 1–5 (the low band) or 6–10 (the high band) | G7 is in the high band | — | — |
| **Made item** | Refined items made into one upgrade item, of one grade | Weapon Gem G3 | A making place | Her Gear tab, her Extra Stats map |
| **Grade · node** | What a made item raises or opens | Her Greatsword G2 → G3 | — | Her stats |

### 3.2 Five material lines

| Line | Profession | Raw → refined | Tier 1 feeds | The look by tier |
|---|---|---|---|---|
| **Metal** | Mining | Ore → Ingot | Weapon Gems; high-band Armor Fittings; every Moon Jewel's mount | Copper, iron · silver, titanium · mythril, orichalcum |
| **Wood** | Wood Chopping | Log → Plank | Weapon Gems; high-band Fittings; Planet Jewels | Pine, oak · mahogany, ebony · elderwood, the world tree |
| **Cloth** | Farming | Fiber → Cloth | Low-band Fittings; Accessory Settings; Planet Jewels | Flax, cotton · wool, silk · moonsilk, cloudfleece |
| **Shell and tide** | Fishing | Shell → Carving; essence → Infusion | Low-band Fittings; Accessory Settings; Planet Jewels | Seashell, ammonite · trilobite, tide · aether, prismatic |
| **Stone** | Hunting | Stone → Cut stone | High-band Fittings; Planet and Moon Jewels | Quartz, garnet · sapphire, diamond · starstone, philosopher's stone |

- **Easy to say:** weapons take ingots and planks; light fittings cloth and shells, heavy fittings ingot, plank and a
  cut stone; settings cloth and shells; jewels cut stones on a metal mount, the Planet a bit of everything.
- **Fishing's line** keeps the first round's reuse: the shells are today's Fossil Dig's first two, and its later catches
  are today's Ley Spring essences, which already come from a pool. The farm's fish stay unused: their refined icons
  are food, and nothing here is eaten.

### 3.3 The catalog: every type, every tier (PP7, PP8)

**Two types a gathering profession in Tier 1, four in Tier 2, six in Tier 3.** Every id and icon exists in uma-art's
`items` atlas today; "today" names its current family and grade. A low type opens at **Craft Lv 1**, a high type at
**Craft Lv 26**, in every tier and every pair (PP13).

| Profession | Tier | Low type: raw → refined (ids) | Today | High type: raw → refined (ids) | Today |
|---|---|---|---|---|---|
| **Mining** | 1 | Copper Ore → Copper Ingot (`copper-ore`, `copper-ingot`) | Ores G1 | Iron Ore → Iron Ingot (`iron-ore`, `iron-ingot`) | Ores G3 |
| | 2 | Silver Ore → Silver Ingot (`silver-ore`, `silver-ingot`) | Ores G4 | **Titanium Ore → Titanium Ingot** (`titanium-ore`, `titanium-ingot`) | Ores G8 |
| | 3 | **Mythril Ore → Mythril Ingot** (`mythril-ore`, `mythril-ingot`) | Ores G9 | Orichalcum Ore → Orichalcum Ingot (`orichalcum-ore`, `orichalcum-ingot`) | Ores G10 |
| **Wood Chopping** | 1 | Pine Log → Pine Plank (`pine-log`, `pine-plank`) | Woods G1 | Oak Log → Oak Plank (`oak-log`, `oak-plank`) | Woods G5 |
| | 2 | **Mahogany Log → Mahogany Plank** (`mahogany-log`, `mahogany-plank`) | Woods G7 | **Ebony Log → Ebony Plank** (`ebony-log`, `ebony-plank`) | Woods G8 |
| | 3 | **Elderwood Log → Elderwood Plank** (`elderwood-log`, `elderwood-plank`) | Woods G9 | Yggdrasil Branch → Yggdrasil Plank (`yggdrasil-branch`, `yggdrasil-plank`) | Woods G10 |
| **Farming** | 1 | Flax → Linen (`flax`, `linen`) | Fibers G1 | Cotton → Cotton Cloth (`cotton`, `cotton-cloth`) | Fibers G4 |
| | 2 | Wool → Wool Cloth (`wool`, `wool-cloth`) | Fibers G5 | Silk Cocoon → Silk (`silk-cocoon`, `silk`) | Fibers G8 |
| | 3 | Moonsilk Cocoon → Moonsilk (`moonsilk-cocoon`, `moonsilk`) | Fibers G9 | Cloudfleece → Cloudweave (`cloudfleece`, `cloudweave`) | Fibers G10 |
| **Fishing** | 1 | Seashell → Shell Carving (`seashell`, `shell-carving`) | Bones & Horns G1 | Ammonite → Ammonite Carving (`ammonite`, `ammonite-carving`) | Bones & Horns G2 |
| | 2 | Trilobite → Trilobite Carving (`trilobite`, `trilobite-carving`) | Bones & Horns G3 | Tide Essence → Tide Infusion (`tide-essence`, `tide-infusion`) | Essences G5 |
| | 3 | Aether → Aether Infusion (`aether`, `aether-infusion`) | Essences G9 | Prismatic Essence → Prismatic Infusion (`prismatic-essence`, `prismatic-infusion`) | Essences G10 |
| **Hunting** | 1 | Quartz → Cut Quartz (`quartz`, `cut-quartz`) | Crystals G1 | Garnet → Cut Garnet (`garnet`, `cut-garnet`) | Crystals G4 |
| | 2 | Sapphire → Cut Sapphire (`sapphire`, `cut-sapphire`) | Crystals G6 | Diamond → Cut Diamond (`diamond`, `cut-diamond`) | Crystals G8 |
| | 3 | Starstone → Cut Starstone (`starstone`, `cut-starstone`) | Crystals G9 | Philosopher's Stone → Cut Philosopher's Stone (`philosophers-stone`, `cut-philosophers-stone`) | Crystals G10 |

- **10 · 20 · 30 types, 20 · 40 · 60 ids.** A world holds every tier's types up to its own: a Tier 3 Warehouse shows 60.
- **Each tier's pair sits above the last on today's ladder** (PP8): every later icon is a richer one, so a tier reads
  at a glance. In bold, the five types that differ from the first round (professions.md §0.3): Mining's Tier 2 high
  (Titanium for Mythril) and Tier 3 low (Mythril for Titanium); Wood Chopping's Tier 2 (Mahogany and Ebony for Cedar
  and Elderwood) and Tier 3 low (Elderwood for Ebony). The first round's Mythril came before Titanium, and Cedar (today's
  G3) after Oak (G5). Farming, Fishing and Hunting were already in order.
- **The five lines in one row of icons, per tier,** are drawn on the [materials page](previews/prof-materials.html).

### 3.4 The ladder: a grade decides its material (PP9)

**Every item is made from its grade's material.** Tier 1 is the first round's rule: grades 1–5 take a line's low type,
6–10 its high type. **Each later tier moves the top grade of each band up the ladder**, onto its own pair. The amounts
never change; only which type fills them.

| Grade | G1 | G2 | G3 | G4 | G5 | G6 | G7 | G8 | G9 | G10 |
|---|---|---|---|---|---|---|---|---|---|---|
| **Tier 1** | T1 low | T1 low | T1 low | T1 low | T1 low | T1 high | T1 high | T1 high | T1 high | T1 high |
| **Tier 2** | T1 low | T1 low | T1 low | T1 low | **T2 low** | T1 high | T1 high | T1 high | T1 high | **T2 high** |
| **Tier 3** | T1 low | T1 low | T1 low | *T2 low* | **T3 low** | T1 high | T1 high | T1 high | *T2 high* | **T3 high** |

- **A Weapon Gem in Tier 3**, for example: G1–G3 two Copper Ingots and two Pine Planks; G4 Silver and Mahogany; G5 (her
  Branch Gem) Mythril and Elderwood; G6–G8 Iron and Oak; G9 Titanium and Ebony; G10 Orichalcum and Yggdrasil.
  Her best grades are made of her tier's best metal and wood.
- **A tier's new jewels carry the pair of the tier that brought them** (PP10): Halo Jewels I–II are Tier 2's, III–IV
  Tier 3's, in whatever tier she makes them. The **Branch Gem** is its world's G5 Weapon Gem, so it follows the ladder:
  Tier 2's pair in Tier 2, Tier 3's in Tier 3.
- **What it does:** the tier's own pair carries **a fifth of the work** (21% in Tier 2; in Tier 3, 21% Tier 3's and 22%
  Tier 2's), so the main trade's higher tier matters, and the base pair still carries most of it, which any secondary
  can gather.

| Share of one Uma's refined items | Base pair (Tier 1's types) | Tier 2's pair | Tier 3's pair |
|---|---|---|---|
| **Tier 1** (485) | 485 · 100% | — | — |
| **Tier 2** (503) | 396 · 79% | 107 · 21% | — |
| **Tier 3** (521) | 299 · 57% | 115 · 22% | 107 · 21% |

**Why the ladder, and not the first round's rule.** The first round kept every recipe on the base pair and gave a
tier's pair only to its new pieces: 25 items an Uma in Tier 2, 5%, so each of twenty new item types went into five items an Uma. Swapping every recipe to the tier's pair (the other extreme) makes the base pair useless after promotion,
the secondary pointless and a short trade unfillable. The ladder sits between: one row to learn per tier, the same
amounts, the main profession's new pair a real fifth.

### 3.5 What the making places make

The items are weapon-progression.md's and extra-stats-progression.md's; their recipes and amounts are this doc's.

| Item | Place | Grades | Per Uma: Tier 1 · 2 · 3 | Raises or opens | Owner |
|---|---|---|---|---|---|
| **Weapon Gem** | Forge | G1–G10; from Tier 2 not G5 | 30 · 27 · 27 | One weapon one grade | weapon-progression.md |
| **Branch Gem** | Forge | G5, from Tier 2 | — · 3 · 3 (one a weapon) | A weapon's G5 step; its branch picked when used: Pure or Dual (Tier 2), Keen, Tempered or Evolved (Tier 3: Pure → Keen or Tempered, Dual → Tempered or Evolved; Pure or Dual for a weapon arriving as Base) | weapon-progression WP10, WP26 |
| **Armor Fittings** | Armorer | G1–G10 | 50 · 50 · 50 | One armor slot one grade, either half | weapon-progression.md |
| **Accessory Setting** | Charm Shop | G1–G10 | 10 · 20 · 30 (one a slot a grade) | One accessory slot one grade, any family and form: all four families in every tier (base forms, then branches from the slot's G5; no item for a form) | weapon-progression.md |
| **Planet Jewel I–V** | Lapidary | 1, 3, 5, 7, 9 | 5 · 5 · 5 | Planet I–V | extra-stats-progression EP17 |
| **Moon Jewel I–V** | Lapidary | 2, 4, 6, 8, 10 | 20 · 22 · 24 (four moons; + Valor's II and IV; + Swiftness's) | A node of any moon | EP17 |
| **Halo Jewel I–II** | Lapidary | 5, 10 | — · 2 · 2 | Halo I, II (her first kind) | EP17 |
| **Halo Jewel III–IV** | Lapidary | 5, 10 | — · — · 2 | Halo III, IV (her second kind) | EP17 |
| ★ Her moon: Moon Jewels II and IV | Lapidary | 4, 8 | 2 · 2 · 2 | Her moon's two nodes | EP14 |
| **Pieces an Uma** (her moon apart) | | | **115 · 129 · 143** | | |

- **One of a line fits any of its slots:** a Weapon Gem raises any weapon, a Fittings any armor slot of either half, a
  Setting any accessory slot, family and form, a Moon Jewel any moon (picked when set). So every Uma needs the same items and a
  party is five times one Uma, whatever the classes.
- **A Brawler or a Mage** skips her other offense moon (EP: 20 · 24 · 28 jewels, 100 · 118 · 136 refined). The counts
  here are every moon (the Uma maxed in any class); a default party (a Brawler and a Mage in five) takes 560 refined
  of jewels in Tier 1, not 600 (EP §11.3).
- **A second weapon set** (a class switch, or Tier 2's reverse set, CP38–CP41) adds only the weapons she hasn't
  raised: up to 30 gems a tier (in Tiers 2 and 3, 27 Weapon Gems and 3 Branch Gems), 120 refined. Armor and accessory grades sit on the slot and cost nothing again (XR6).

## 4. Places: the Wilds at each tier

### 4.1 Ten places (PP4, PP6)

**One building a profession, four work slots inside, the same ten in every tier.** Six keep today's id and art, two
farm buildings come back, two unused frames get a job. A place names its uma-art frame when it isn't its id
(`Place.frame`, H50).

| Row | Place (id) | Profession | Frame | Was | At (x, y) | Slots | Job | Its page lists |
|---|---|---|---|---|---|---|---|---|
| 1 | **Mine** (`mine`) | Mining | `mine` | Today's Mine | 0.24, 0.10 | 4 | Gather | The tier's metal types |
| 1 | **Forge** (`forge`) | Weapon Crafting | `forge` | Today's Forge | 0.74, 0.12 | 4 | Make | Weapon Gem G1–G10; the Branch Gem at G5 |
| 2 | **Forest** (`forest`) | Wood Chopping | `forest` | Today's Forest | 0.20, 0.30 | 4 | Gather | The tier's wood types |
| 2 | **Armorer** (`armorer`) | Armor Crafting | `lancers-barracks` | Unused: a slate depot with racks | 0.76, 0.32 | 4 | Make | Armor Fittings G1–G10 |
| 3 | **Fields** (`fields`) | Farming | `fields` | The farm's Fields | 0.22, 0.51 | 4 | Gather | The tier's cloth types |
| 3 | **Workbench** (`workbench`) | Material Processing | `workbench` | Today's Workbench | 0.78, 0.51 | 4 | Process | Every type in stock, one for one |
| 4 | **Fishery** (`fishery`) | Fishing | `fishery` | The farm's Fishery | 0.22, 0.71 | 4 | Gather | The tier's shell and tide types |
| 4 | **Charm Shop** (`charm-shop`) | Accessory Crafting | `arcane-armory` | Unused since the Lapidary got its own (H29): a shop with glowing orbs | 0.78, 0.70 | 4 | Make | Accessory Setting G1–G10 |
| 5 | **Monster Den** (`monster-den`) | Hunting | `monster-den` | Today's Monster Den | 0.26, 0.90 | 4 | Gather | The tier's stones |
| 5 | **Lapidary** (`lapidary`) | Jewel Crafting | `lapidary` | Today's Lapidary, moved from the middle row | 0.74, 0.90 | 4 | Make | Planet I–V, Moon I–V; Halo I–II, III–IV by tier |

- **Ten of uma-art's 42 building frames and sixty of its 331 item icons.** No building, tile, icon or kit option is new
  (the art packet line for Professions in uma-platform: none). The positions are today's `WILDS_LAYOUT`.
- **Kept unused:** the farm's other eight buildings (uma-racer's), the Ley Spring, Crystal Cavern, Quarry, Meadow, Fossil
  Dig, the Rangers' Lodge and the farmlands tiles. The Wilds keep their own ground and props.
- **No upgrades:** every place has its four slots from day one, each at today's level-3 speed, ×1.25 (PP4). One row of
  four pips keeps a place 112 px tall, so a column of five fits the measured Wilds (592 px of 675 at 390 × 844).

### 4.2 The map at each tier (PP5)

**The same map in every tier:** ten places in today's ten side spots, one row a trade, gathering left and making right,
the trunk road down the middle, so an Uma's two places sit side by side ([map page](previews/prof-map.html)).

| | Tier 1 | Tier 2 | Tier 3 |
|---|---|---|---|
| **Places · slots** | 10 · 40 | 10 · 40 | 10 · 40 |
| **The look** | Day (the theme as it is) | Dusk: an amber accent, a warm wash (today's tint) | Night: a violet accent, a deep blue wash |
| **A gathering place's quick look** | Two type icons | Four, Tier 2's marked "Main trade" | Six: Tier 2's "Main or secondary", Tier 3's "Main trade" |
| **A making place's quick look** | Its line, G1–G10 | + the Branch Gem at G5 (Forge), Halo I–II (Lapidary); G5 and G10 chips in Tier 2's colour | + Halo III–IV; G4 and G9 in Tier 2's colour, G5 and G10 in Tier 3's |
| **Her places** | Her trade's two | + her secondary's | The same |
| **What a tier adds to the map** | — | Nothing drawn: two more type icons a gathering place | The same |

### 4.3 Who may take a slot (PP15, PP16)

- **Her trade's Umas:** any job the place has.
- **From Tier 2, Umas whose secondary is this profession:** its base work (Tier 3: and its Tier 2 work). A job on the
  tier's own pair or a grade made of it is refused: "Her main trade's work".
- **Anyone else:** shown greyed in the picker, "Another trade".
- **The open shop** (PP16): if a world holds **no Uma** of a trade, its two places take every Uma for every job, and say
  so in their header ("Open shop: no Brawler in this world"). It closes the moment one arrives. A run of twenty with no
  Mage still makes jewels.
- **The trade gate lives in the job kinds' `plan`** (it knows the slot's place and the Uma), as the first round said; no
  engine change. The kit's picker shows the reason.

### 4.4 The place pages

Each place is today's facility page (`places/work/FacilityPage.tsx`): the header (no Upgrade), one row per slot, the
targets strip, the job sheet (Who → How many → What), stopped queues, Recall, Repeat, Speed Tickets. What changes:

| Page | Header | The What step | Its picker (Who) |
|---|---|---|---|
| **A gathering place** | "Mine · Mining · 4 slots · ×1.25" | Its types as G-badged tiles in tier rows: base low, base high (from Craft Lv 26); Tier 2's row "Main trade"; Tier 3's | Her trade first, then secondaries (Tier 2+), then the rest greyed |
| **The Workbench** | "Workbench · Material Processing" | Five columns, one a line; a row per tier and band; ×1, 4, 8, 20, 40 | Healers first, then Material Processing secondaries |
| **The Forge, Armorer, Charm Shop** | Its line | Ten grade chips coloured by their material's tier (§3.4); the chosen grade's recipe card; at G5 the Branch Gem (one item; the branch is picked on her weapon's sheet) | Her trade first, then secondaries (base grades only) |
| **The Lapidary** | "Lapidary · Jewel Crafting" | One row a kind: Planet I–V, Moon I–V, + Halo I–II (Tier 2), III–IV (Tier 3) | Mages first, then Jewel Crafting secondaries |

- **The targets strip** (D100, D126, PP22) lists what the targets still need from this place: a gathering place the raw
  types, the Workbench the refined, a making place its items. Tapping a short item opens that job in a free slot with
  the first Uma who may do it.
- **The Warehouse:** materials by profession, raw then refined, a tier row each; made items on the owning docs' shelves.

## 5. Jobs, gates and times

### 5.1 The three jobs (PP12, PP13)

| Job | Time a unit (Craft Lv 1 → 50, before ×1.25) | Batch | Gate |
|---|---|---|---|
| **Gather** one raw item | **54 → 36 min**, any type (today) | 1–10 | A low type at Craft Lv 1, a high type at Lv 26, in every pair |
| **Process** one item | A quarter: **13.5 → 9 min** (today) | ×1, 4, 8, 20, 40 | Its type's |
| **Make** one item | **One gather's time a refined item in it**: a Weapon Gem 4 gathers, a Fittings 2 or 3, a Setting 12 · 6 · 4, a Planet Jewel 8, a Moon Jewel 4, a Halo Jewel 5 | 1–10 | Grade g at Craft Lv 5g − 4 (today) |

- **Craft EXP** is 2 a minute of the job at her level, before the place's speed (today); every hour of any job levels
  her alike. Queues, Repeat, Recall, Speed Tickets and stopped queues are uma-work's and don't change.
- **Today's makes** take two refined items and two gathers' time, so the make rule is today's, extended (PR9).

### 5.2 Times at each Craft Level

Real time in a slot (×1.25):

| Craft Lv | A gather | A process | Gathers a day | Processes a day | Weapon Gem, Moon Jewel (4) | Fittings (2 · 3) | Setting (12 · 6 · 4) | Planet Jewel (8) | Halo Jewel (5) |
|---|---|---|---|---|---|---|---|---|---|
| 1 | 43.2 min | 10.8 min | 33 | 133 | 2.9 h | 1.4 · 2.2 h | 8.6 · 4.3 · 2.9 h | 5.8 h | 3.6 h |
| 25 | 36.1 min | 9.0 min | 40 | 159 | 2.4 h | 1.2 · 1.8 h | 7.2 · 3.6 · 2.4 h | 4.8 h | 3.0 h |
| 50 | 28.8 min | 7.2 min | 50 | 200 | 1.9 h | 1.0 · 1.4 h | 5.8 · 2.9 · 1.9 h | 3.8 h | 2.4 h |

Through the whole chain (gather, process, make) one refined item takes 81 slot-minutes at Lv 25: **0.74 refined items
an Uma-hour**.

### 5.3 Craft Level in each tier

Craft Level's curve doesn't change (D96: 1,425 + 15L EXP a level, 88,200 to Lv 50). **It restarts at Lv 1 in every new
tier**, as today: an ascended Uma arrives fresh, so a tier's grades open again on its own clock. Working nonstop at
×1.25 (from day 1, no upgrades):

| Grade opens | G2 | G3 | G4 | G5 | **G6** (high types) | G7 | G8 | G9 | **G10** | Lv 50 |
|---|---|---|---|---|---|---|---|---|---|---|
| Craft Lv | 6 | 11 | 16 | 21 | 26 | 31 | 36 | 41 | 46 | 50 |
| Day | 2.0 | 4.2 | 6.4 | 8.8 | **11.2** | 13.8 | 16.5 | 19.2 | **22.1** | 24.5 |
| Today (level 3 from day 11) | 2.6 | — | — | — | 13.5 | — | — | — | 24.3 | 26.7 |

## 6. The recipe book

### 6.1 The base recipes (PP10)

**One fixed set an item, the same amounts in every tier.** The professions an item takes and how many are fixed; the
ladder (§3.4) says which tier's type fills each one at each grade.

| Item | Refined | Low band (Tier 1: G1–G5) | High band (Tier 1: G6–G10) | Gathering professions |
|---|---|---|---|---|
| **Weapon Gem** | **4** | 2 Copper Ingot, 2 Pine Plank | 2 Iron Ingot, 2 Oak Plank | Mining, Wood Chopping |
| **Armor Fittings** | **2** low, **3** high | 1 Linen, 1 Shell Carving | 1 Iron Ingot, 1 Oak Plank, 1 Cut Garnet | Farming, Fishing; then Mining, Wood Chopping, Hunting |
| **Accessory Setting** | **12 · 6 · 4** (Tier 1 · 2 · 3) | 6 · 3 · 2 Linen and as many Shell Carving | 6 · 3 · 2 Cotton Cloth and as many Ammonite Carving | Farming, Fishing |
| **Planet Jewel** (I–V: 1, 3, 5, 7, 9) | **8** | 2 each: Cut Quartz, Pine Plank, Linen, Shell Carving | 2 each: Cut Garnet, Oak Plank, Cotton Cloth, Ammonite Carving | Hunting, Wood Chopping, Farming, Fishing |
| **Moon Jewel** (I–V: 2, 4, 6, 8, 10) | **4** | 3 Cut Quartz, 1 Copper Ingot | 3 Cut Garnet, 1 Iron Ingot | Hunting, Mining |
| **Halo Jewel** (I, III: 5; II, IV: 10) | **5** | One of each of its tier's low types | One of each of its tier's high types | All five |
| **Branch Gem** (G5) | **4** | The G5 Weapon Gem: 2 ingots, 2 planks of its tier's low pair | — | Mining, Wood Chopping |
| **Process** (Workbench) | 1 raw | Every type, one for one | | — |

- **Each making place uses about a quarter of an Uma's refined items** in Tier 1 (Forge 120, Armorer 125, Charm Shop
  120, Lapidary 120) and **each gathering profession about a fifth** (Mining 105, the others 95), so each trade carries
  19.7–20.6% of the work ([§7.2](#72-what-each-trade-carries)).
- **The accessory is the big piece.** Tier 1 has one accessory slot and five armor slots; for the Charm Shop to be as
  busy as the Armorer, a Setting costs what a grade of the whole suit does. It shrinks as slots grow, **12 · 6 · 4**, so
  the Charm Shop stays at 120 an Uma in every tier.
- **The Halo Jewel** is EP18's recommendation, kept: its tier in one jewel, one item from each profession's pair.
- **The Branch Gem is the G5 Weapon Gem in its tier's metal and wood** (changed from the first round's and
  weapon-progression WP26's "G5 recipe + one of each of the tier's pairs", 9 refined): the ladder already puts G5 on the
  tier's pair, so the branch costs what any grade costs, in the tier's materials, and the Forge stays at 120 an Uma.

### 6.2 Every grade, every tier

**Weapon Gem** (4). From Tier 2 the G5 step is the weapon's Branch Gem (one item; the branch is picked when used).

| Grade | Tier 1 | Tier 2 | Tier 3 |
|---|---|---|---|
| G1–G3 | 2 Copper Ingot, 2 Pine Plank | The same | The same |
| G4 | The same | The same | **2 Silver Ingot, 2 Mahogany Plank** |
| G5 | 2 Copper Ingot, 2 Pine Plank | **Branch Gem:** 2 Silver Ingot, 2 Mahogany Plank | **Branch Gem:** 2 Mythril Ingot, 2 Elderwood Plank |
| G6–G8 | 2 Iron Ingot, 2 Oak Plank | The same | The same |
| G9 | The same | The same | **2 Titanium Ingot, 2 Ebony Plank** |
| G10 | 2 Iron Ingot, 2 Oak Plank | **2 Titanium Ingot, 2 Ebony Plank** | **2 Orichalcum Ingot, 2 Yggdrasil Plank** |

**Armor Fittings** (2 low, 3 high).

| Grade | Tier 1 | Tier 2 | Tier 3 |
|---|---|---|---|
| G1–G3 | 1 Linen, 1 Shell Carving | The same | The same |
| G4 | The same | The same | **1 Wool Cloth, 1 Trilobite Carving** |
| G5 | 1 Linen, 1 Shell Carving | **1 Wool Cloth, 1 Trilobite Carving** | **1 Moonsilk, 1 Aether Infusion** |
| G6–G8 | 1 Iron Ingot, 1 Oak Plank, 1 Cut Garnet | The same | The same |
| G9 | The same | The same | **1 Titanium Ingot, 1 Ebony Plank, 1 Cut Diamond** |
| G10 | 1 Iron Ingot, 1 Oak Plank, 1 Cut Garnet | **1 Titanium Ingot, 1 Ebony Plank, 1 Cut Diamond** | **1 Orichalcum Ingot, 1 Yggdrasil Plank, 1 Cut Philosopher's Stone** |

**Accessory Setting** (12 · 6 · 4: half cloth, half carving or infusion).

| Grade | Tier 1 (12) | Tier 2 (6) | Tier 3 (4) |
|---|---|---|---|
| G1–G3 | 6 Linen, 6 Shell Carving | 3 Linen, 3 Shell Carving | 2 Linen, 2 Shell Carving |
| G4 | 6 Linen, 6 Shell Carving | 3 Linen, 3 Shell Carving | **2 Wool Cloth, 2 Trilobite Carving** |
| G5 | 6 Linen, 6 Shell Carving | **3 Wool Cloth, 3 Trilobite Carving** | **2 Moonsilk, 2 Aether Infusion** |
| G6–G8 | 6 Cotton Cloth, 6 Ammonite Carving | 3 Cotton Cloth, 3 Ammonite Carving | 2 Cotton Cloth, 2 Ammonite Carving |
| G9 | 6 Cotton Cloth, 6 Ammonite Carving | 3 Cotton Cloth, 3 Ammonite Carving | **2 Silk, 2 Tide Infusion** |
| G10 | 6 Cotton Cloth, 6 Ammonite Carving | **3 Silk, 3 Tide Infusion** | **2 Cloudweave, 2 Prismatic Infusion** |

**Planet Jewel** (8: two each of a cut stone, a plank, a cloth and a carving or infusion).

| Jewel (grade) | Tier 1 | Tier 2 | Tier 3 |
|---|---|---|---|
| I (1), II (3) | 2 each: Cut Quartz, Pine Plank, Linen, Shell Carving | The same | The same |
| III (5) | The same | **2 each: Cut Sapphire, Mahogany Plank, Wool Cloth, Trilobite Carving** | **2 each: Cut Starstone, Elderwood Plank, Moonsilk, Aether Infusion** |
| IV (7) | 2 each: Cut Garnet, Oak Plank, Cotton Cloth, Ammonite Carving | The same | The same |
| V (9) | The same | The same | **2 each: Cut Diamond, Ebony Plank, Silk, Tide Infusion** |

**Moon Jewel** (4: three cut stones on a metal mount). Valor's, Swiftness's and her moon's nodes take Moon Jewels II
and IV.

| Jewel (grade) | Tier 1 | Tier 2 | Tier 3 |
|---|---|---|---|
| I (2) | 3 Cut Quartz, 1 Copper Ingot | The same | The same |
| II (4) | The same | The same | **3 Cut Sapphire, 1 Silver Ingot** |
| III (6), IV (8) | 3 Cut Garnet, 1 Iron Ingot | The same | The same |
| V (10) | The same | **3 Cut Diamond, 1 Titanium Ingot** | **3 Cut Philosopher's Stone, 1 Orichalcum Ingot** |

**Halo Jewel** (5: one of each line). It keeps the pair of the tier that brought it.

| Jewel (grade) | Tier 2 | Tier 3 |
|---|---|---|
| I (5) | Silver Ingot, Mahogany Plank, Wool Cloth, Trilobite Carving, Cut Sapphire | The same (Tier 2's) |
| II (10) | Titanium Ingot, Ebony Plank, Silk, Tide Infusion, Cut Diamond | The same |
| III (5) | — | Mythril Ingot, Elderwood Plank, Moonsilk, Aether Infusion, Cut Starstone |
| IV (10) | — | Orichalcum Ingot, Yggdrasil Plank, Cloudweave, Prismatic Infusion, Cut Philosopher's Stone |

The [flow page](previews/prof-flow.html) draws every recipe with its icons, by tier and grade.

### 6.3 The tier's new pieces

| Tier | Piece | How many an Uma | Recipe | Made by |
|---|---|---|---|---|
| 2 | **Branch Gem**, a weapon's G5 step; Pure or Dual picked when used | 3 (one a weapon) | 2 Silver Ingot, 2 Mahogany Plank | The Forge's Brawlers (Tier 2's own pair) |
| 2 | **Halo Jewel I, II** | 1 each | One of each of Tier 2's low, then high types | The Lapidary's Mages |
| 2 | **Valor I, II**: Moon Jewels II and IV | 1 each | The Moon Jewel's, by the ladder (base types in Tier 2) | Mages, or Jewel Crafting secondaries |
| 3 | **Branch Gem**: Pure → Keen or Tempered, Dual → Tempered or Evolved; a weapon arriving as Base takes Pure or Dual | 3 | 2 Mythril Ingot, 2 Elderwood Plank | Brawlers |
| 3 | **Halo Jewel III, IV** | 1 each | One of each of Tier 3's low, then high types | Mages |
| 3 | Halo Jewel I, II (rebuilt) | 1 each | Tier 2's | Mages, or Jewel Crafting secondaries |
| 3 | **Swiftness I, II**: Moon Jewels II and IV; Valor's again | 1 each | The ladder's (Moon Jewel II on Tier 2's pair, IV on the base pair) | Mages, or Jewel Crafting secondaries (Tier 2's work is theirs in Tier 3) |
| Any | **Re-forging** (WP11): another Branch Gem of the tier | Outside the demand | The tier's Branch Gem | As above |

### 6.4 SB1: amounts don't scale with the tier (PP11)

SB1 scales **build values** (Might, armor, nodes) × 1.8 and × 2.6 so the build keeps its share of her stats. **The
items and their amounts stay the same in every tier**: a Tier 2 Weapon Gem G6 is still four refined items, and its
grade gives × 1.8 the Might.

| Option | One Uma, refined: Tier 2 · Tier 3 | A Tier 2 · 3 run of twenty | Verdict |
|---|---|---|---|
| **Amounts fixed; new pieces and the ladder only** (recommended) | **503 · 521** (+3.7%, +7.4%) | **28.4 · 29.4 days** | Inside a tenth; the run's four weeks are today's Tier 2 ([tier2-world §11](../tier2-world.md#11-a-runs-first-week)) |
| Amounts × 1.8 and × 2.6 | 905 · 1,355 | About 51 · 76 days | Tier 3 takes two and a half months |
| Times × 1.8 and × 2.6 (the same items, slower jobs) | Hours × 1.8 · × 2.6 | The same as above | The same cost, less visible |

- **Why:** SB1 is about a stat's share; the owner's "rate of progression is fine as it is" is about time. Craft Level
  restarts every tier, and Tier 2's long loop is already crafting (tier2-world §11); scaling amounts would double it.
- **Laurels do scale** (fights pay × tier, D170), so the Exchange's prices and the secondary's change fee are × tier
  (PP14, PP17): a Laurel buys the same work in every tier.

## 7. Tier 1 in full

### 7.1 One Uma's demand

| Her need | Pieces | At | Refined each | Refined |
|---|---|---|---|---|
| 3 weapons, G0 → G10: a Weapon Gem a step | 30 | Forge | 4 | 120 |
| 5 armor slots, G1–G10: Armor Fittings | 50 | Armorer | 2 or 3 | 125 |
| 1 accessory slot, G1–G10: a Setting a step | 10 | Charm Shop | 12 | 120 |
| Extra Stats: Planet Jewel I–V | 5 | Lapidary | 8 | 40 |
| Extra Stats: Moon Jewel I–V on four moons | 20 | Lapidary | 4 | 80 |
| **Total** | **115** | | | **485**: 485 gathers, 485 processes |
| ★ + her moon: Moon Jewels II and IV | 2 | Lapidary | 4 | 8: **493** |

**By type** (her moon in brackets): Copper 38 (39), Iron 67 (68); Pine 36, Oak 59; Flax 61, Cotton 34; Seashell 61,
Ammonite 34; Quartz 30 (33), Garnet 65 (68).

### 7.2 What each trade carries

Hours at Craft Lv 25's speed, before ×1.25:

| Trade | Gathers | Makes or processes | Hours | Share |
|---|---|---|---|---|
| Physical: Mine · Forge | 105 | 120 refined | 169 | 20.6% |
| Physical hybrid: Forest · Armorer | 95 | 125 refined | 166 | 20.2% |
| Healer: Fields · Workbench | 95 | 485 processes | 163 | 19.8% |
| Magical hybrid: Fishery · Charm Shop | 95 | 120 refined | 162 | 19.7% |
| Magical: Monster Den · Lapidary | 95 | 120 refined | 162 | 19.7% |
| **One Uma** | 485 | | **822** | |

### 7.3 Supply: one place and one slot

| Place | Hours a maxed Uma (Lv 25, before ×1.25) | Its four slots make, maxed Umas a day |
|---|---|---|
| Mine | 79 | 1.52 |
| Forest, Fields, Fishery, Monster Den | 72 each | 1.68 |
| Forge, Charm Shop, Lapidary | 90 each | 1.33 |
| Workbench | 91 | 1.31 |
| **Armorer** | **94** | **1.28**: the place that binds a full Tier 1 Wilds |

### 7.4 A party and the roster

**A roster at the owner's pace** (one party fights, dozens work): forty Umas at the callings' split, 9 physical,
8 physical hybrid, 9 healer, 7 magical hybrid, 7 magical. Each trade has eight slots (its two places), so the thinnest
trades and the Armorer's four slots set the pace together:
- **1.27 maxed Umas a day.** Past forty workers nothing speeds up: forty slots, and the Armorer full.
- **A party's next grade** (a tenth of five Umas) is about **9 hours** of the roster's work; a whole party **3.9 days**;
  a run of twenty **15.7 days**.
- **Craft Level is the wall, not volume** (as today): a fresh roster opens grade 10 on day 22.1, and with every slot
  busy the fighting party holds it on day 22.5, the run of twenty on day 23.7. The roster's levels run ahead of the
  fighting party's in play, as the owner plays it.
- **Today** the Forge binds: five slots, 145 slot-hours an Uma, **0.83 maxed Umas a day**: a party in 6 days, a run in 24.
  The four making places spread that work.
- **A young roster** (twenty Umas, 5 · 4 · 5 · 3 · 3) runs at 0.56 a day: the two magical trades, three Umas each, bind. A short
  trade buys raw items at the Exchange, and the Stable's **Trade filter** (PP21) shows which unlocks would fill it.

| Grade | G1 | G2 | G3 | G4 | G5 | G6 | G7 | G8 | G9 | G10 |
|---|---|---|---|---|---|---|---|---|---|---|
| Opens (Craft Lv 5g − 4), day | 0 | 2.0 | 4.2 | 6.4 | 8.8 | 11.2 | 13.8 | 16.5 | 19.2 | 22.1 |
| The party holds it (40 workers), day | 0.4 | 2.4 | 4.6 | 6.8 | 9.2 | 11.6 | 14.2 | 16.9 | 19.6 | 22.5 |
| A run of twenty holds it, day | 1.6 | 3.6 | 5.8 | 8.0 | 10.4 | 12.8 | 15.4 | 18.0 | 20.8 | 23.7 |

### 7.5 Around the places

| Area | Tier 1 |
|---|---|
| **The Exchange** | Raw items only: the low types after the tier's first win, the high types after a win on continent 3; 30 and 80 Laurels ([§10](#10-the-exchange-pp17)) |
| **The Warehouse** | Materials: twenty icons, by profession, raw then refined. The made items' shelves are the owning docs' |
| **Targets** (D100, D126) | Unchanged: up to ten Umas, the same MRP pass on the new recipes. Each place's strip lists what targets need from it; "Start" offers its trade's free Umas first |
| **The profile** | Work tab: her trade's two places and Craft Level ("Craft Lv 23 · Forest · Armorer"); from Tier 2 her secondary |
| **The Stable** | A **Trade** filter, on locked outfits too, with each trade's head count (PP21) |
| **Notifications, Collect all** | Unchanged |

### 7.6 Tier 1, today and proposed

| | Today | Proposed |
|---|---|---|
| Places on the Wilds | 11 facilities | **10 places**, each an existing building |
| Slots | 33 (55 at level 3) | **40**, 4 a place |
| Upgrades | 22, each Laurels and two families' refined items | **None** |
| Gathered items · refined items | 80 · 80 | **10 · 10** |
| Things to make | 400 gear pieces, 100 Star Gems | **40**: Weapon Gem, Armor Fittings, Accessory Setting × 10 grades; Planet and Moon Jewels I–V |
| Recipe rule | Four family pairs rotating by type and grade; Star Gems with side items | **One fixed set an item;** grades 1–5 the low type, 6–10 the high |
| Where an Uma can work | Any of 11 | **Her 2 places** |
| Choices when gathering · processing | 10 grades · 80 items | 2 types (1 before Craft Lv 26) · 10 |
| Per Uma, maxed | 472 raw, 472 refined, 220 pieces, 776 h | 485, 485, 115, 822 h (493 and 835 h with her moon) |
| New art | — | **None** |
| **Added** | — | Trades; the low or high type |

## 8. Tier 2 in full

### 8.1 What Tier 2 adds

- **One more pair** a gathering profession (§3.3), gathered only by her main trade.
- **The ladder's first step:** G5 and G10 of every line are made of Tier 2's pair (§3.4), by her main trade.
- **The secondary** (§2.3): one other profession's base work, so any Uma can help a short trade.
- **New pieces:** three Branch Gems at G5 (Pure or Dual), Halo Jewels I–II, Valor's two Moon Jewels; a second accessory
  slot (Settings shrink to 6).
- **What stays:** the map, ten places, forty slots, every amount, Craft Level's curve.

### 8.2 One Uma's demand

| Her need | Pieces | At | Refined |
|---|---|---|---|
| 3 weapons: Weapon Gems G1–G4, G6–G10 | 27 | Forge | 108 |
| Their G5 Branch Gems (Pure or Dual) | 3 | Forge | 12 |
| 5 armor slots: Armor Fittings | 50 | Armorer | 125 |
| 2 accessory slots: Settings of 6 | 20 | Charm Shop | 120 |
| Planet Jewel I–V | 5 | Lapidary | 40 |
| Moon Jewel I–V on four moons, + Valor's II and IV | 22 | Lapidary | 88 |
| Halo Jewel I, II | 2 | Lapidary | 10 |
| **Total** | **129** | | **503** (+3.7% on Tier 1) |
| ★ + her moon | 2 | Lapidary | 8: **511** |

**By type** (her moon in brackets): base Copper 33 (34), Iron 53 (54), Pine 28, Oak 48, Flax 48, Cotton 28,
Seashell 48, Ammonite 28, Quartz 31 (34), Garnet 51 (54); **Tier 2's** Silver 7, Titanium 16, Mahogany 9, Ebony 12,
Wool 14, Silk 7, Trilobite 14, Tide Essence 7, Sapphire 3, Diamond 18: **107, 21%**.

### 8.3 What each trade carries

| Trade | Gathers | Makes or processes | Hours | Share | Her main trade's alone (slot-hours) |
|---|---|---|---|---|---|
| Physical: Mine · Forge | 109 | 120 | 173 | 20.2% | 28 |
| Physical hybrid: Forest · Armorer | 97 | 125 | 167 | 19.6% | 28 |
| Healer: Fields · Workbench | 97 | 503 | 168 | 19.7% | 29 |
| Magical hybrid: Fishery · Charm Shop | 97 | 120 | 163 | 19.2% | 27 |
| Magical: Monster Den · Lapidary | 103 | 138 | 182 | 21.3% | 33 |
| **One Uma** | 503 | | **852** | | |

The Lapidary grows most (+18 an Uma): Extra Stats adds four nodes a tier, and only jewels open them. Its four slots
make 1.16 maxed Umas a day, so it binds a Tier 2 roster of more than about 33 workers; a world of one run never gets
there.

### 8.4 The secondary at work

- **Who picks what:** the run's split decides. A run that follows the callings (5 · 4 · 5 · 3 · 3) has two thin
  trades; a few physical and healer Umas take Fishing, Hunting, Accessory Crafting or Jewel Crafting as secondaries
  and do those trades' base work.
- **What stays the trade's** (PP15): Tier 2's pair and the G5 and G10 pieces made of it, a fifth of the work: 27–33
  slot-hours a maxed Uma for each trade.
- **The head counts** on the pick and the targets strip's dots say where to point it.

### 8.5 A run of twenty

A Tier 2 world starts with one Rift run's twenty, Craft Lv 1 each, nothing in stock but the purse (T5).

| The run's split (physical · physical hybrid · healer · magical hybrid · magical) | With the secondary (PP14) | A gathering-only secondary (the first round) | No secondary |
|---|---|---|---|
| **The callings' split: 5 · 4 · 5 · 3 · 3** | **28.4 days** | 28.4 | 40.3 |
| Even: 4 · 4 · 4 · 4 · 4 | 28.4 | 28.4 | 30.2 |
| Thin: 5 · 5 · 5 · 3 · 2 | **28.4** | 39.9 | 60.5 |
| One Mage: 6 · 5 · 5 · 3 · 1 | **28.4** | 79.8 | 121 |

- **The run is bound by its own hours** (682 slot-hours a maxed Uma, 480 a day for twenty): 28.4 days, within two days
  of today's "about four weeks" (tier2-world §11).
- **The fighting party** holds G10 on day 22.8 if the roster serves it first: Craft Level opens G10 on day 22.1, and a
  party's grade is 0.7 days of the run's work. Its schedule: G1 day 0.7, G5 9.5, G6 12.0, G10 22.8.
- **Without any secondary** the two thin trades take 40 days; the first round's gathering-only secondary fixes the
  callings' split but not a run with two Mages (40 days) or one (80), since making stays the trade's.

### 8.6 The Exchange in Tier 2

Base pair as in Tier 1; Tier 2's low type after a win on continent 2, its high type after continent 4; every price × 2
([§10](#10-the-exchange-pp17)). It is the fallback for a trade whose own pair runs short: a world without Mages buys
Sapphire and Diamond (and the open shop lets anyone cut them).

## 9. Tier 3 in full

### 9.1 What Tier 3 adds

- **One more pair** (§3.3) and the ladder's second step: G5 and G10 of every line on Tier 3's pair, **G4 and G9 on
  Tier 2's** (§3.4).
- **The secondary reaches its Tier 2 work:** Tier 2's pair, the G4 and G9 pieces and Tier 2's own pieces (Halo Jewels
  I–II).
- **New pieces:** three Branch Gems (Keen, Tempered or Evolved); Halo Jewels III–IV; Swiftness's two Moon Jewels; a third accessory slot
  (Settings of 4).

### 9.2 One Uma's demand

| Her need | Pieces | At | Refined |
|---|---|---|---|
| 3 weapons: Weapon Gems G1–G4, G6–G10 | 27 | Forge | 108 |
| Their G5 Branch Gems (Keen, Tempered or Evolved) | 3 | Forge | 12 |
| 5 armor slots: Armor Fittings | 50 | Armorer | 125 |
| 3 accessory slots: Settings of 4 | 30 | Charm Shop | 120 |
| Planet Jewel I–V | 5 | Lapidary | 40 |
| Moon Jewel I–V on four moons, + Valor's and Swiftness's II and IV | 24 | Lapidary | 96 |
| Halo Jewel I–II and III–IV | 4 | Lapidary | 20 |
| **Total** | **143** | | **521** (+7.4% on Tier 1) |
| ★ + her moon | 2 | Lapidary | 8: **529** (+7.3% on Tier 1's 493) |

**By type:** base Copper 22, Iron 43 (44), Pine 22, Oak 35, Flax 37, Cotton 20, Seashell 37, Ammonite 20, Quartz 16,
Garnet 47 (50); **Tier 2's** Silver 13 (14), Titanium 12, Mahogany 7, Ebony 14, Wool 12, Silk 9, Trilobite 12, Tide 9,
Sapphire 19 (22), Diamond 8: **115, 22%**; **Tier 3's** Mythril 7, Orichalcum 16, Elderwood 9, Yggdrasil 12, Moonsilk
14, Cloudfleece 7, Aether 14, Prismatic 7, Starstone 3, Philosopher's Stone 18: **107, 21%**.

### 9.3 What each trade carries

| Trade | Gathers | Makes or processes | Hours | Share |
|---|---|---|---|---|
| Physical: Mine · Forge | 113 | 120 | 176 | 19.9% |
| Physical hybrid: Forest · Armorer | 99 | 125 | 169 | 19.1% |
| Healer: Fields · Workbench | 99 | 521 | 173 | 19.6% |
| Magical hybrid: Fishery · Charm Shop | 99 | 120 | 165 | 18.7% |
| Magical: Monster Den · Lapidary | 111 | 156 | 201 | 22.8% |
| **One Uma** | 521 | | **883** | |

The Lapidary's four slots make 1.02 maxed Umas a day, so it binds a Tier 3 roster above about 30 workers.

### 9.4 A run of twenty

| The run's split | With the secondary (PP14) | A gathering-only secondary | No secondary |
|---|---|---|---|
| **The callings' split: 5 · 4 · 5 · 3 · 3** | **29.4 days** | 29.6 | 44.7 |
| Even: 4 · 4 · 4 · 4 · 4 | 29.4 | 29.4 | 33.5 |
| Thin: 5 · 5 · 5 · 3 · 2 | **29.4** | 44.4 | 67.0 |
| One Mage: 6 · 5 · 5 · 3 · 1 | **29.4** | 88.9 | 134 |

The party holds G10 on day 22.9. Tier 3 has no Rift yet (`RIFT_TIERS`), so a Tier 3 world grows only by Tier 2 runs.

## 10. The Exchange (PP17)

**Raw items only, every type the tier holds, by pair:** a pair's low type opens when it is needed and its high type
before G10.

| | Tier 1 | Tier 2 | Tier 3 |
|---|---|---|---|
| **Base pair: low** | After the tier's first win · 30 Laurels | First win · 60 | First win · 90 |
| **Base pair: high** | After a win on continent 3 · 80 | Continent 3 · 160 | Continent 3 · 240 |
| **Tier 2's pair** | — | Low after continent 2 · 60; high after continent 4 · 160 | Low after continent 2 · 90; high after 4 · 240 |
| **Tier 3's pair** | — | — | Low after continent 2 · 90; high after continent 4 · 240 |
| **Selling: raw low · high** | 6 · 16 | 12 · 32 | 18 · 48 |
| **Selling: refined low · high** | 12 · 32 | 24 · 64 | 36 · 96 |
| **Selling: made items** | 6 + 6g | × 2 | × 3 |
| **Speed and Sweep Tickets** | Today's | Today's | Today's |

- **× tier** because a tier's fights pay × tier (D170): a raw item stays about two fights a base hour of gathering (D65)
  in every tier. Today's prices don't scale, so Tier 2 buys at half today's cost in fights.
- **Twenty types don't need a grade ladder** (PR13 kept): the first round's "a continent opens two grades" goes.

## 11. Demand against supply, every tier

Drawn in the [demand page](previews/prof-demand.html).

| | Tier 1 | Tier 2 | Tier 3 |
|---|---|---|---|
| **One Uma: refined · pieces** | 485 · 115 | 503 · 129 | 521 · 143 |
| With her moon | 493 · 117 | 511 · 131 | 529 · 145 |
| **One Uma: hours** (Lv 25, before ×1.25) · slot-hours | 822 · 657 | 852 · 682 | 883 · 706 |
| With her moon | 835 · 668 | 866 · 693 | 896 · 717 |
| Against Tier 1 | — | +3.7% | +7.4% |
| **A party** (five Umas): refined | 2,425 | 2,515 | 2,605 |
| **A run of twenty:** refined | 9,700 | 10,060 | 10,420 |
| **Workers** · slots | 40 (dozens) · 40 | 20 (one run) · 40 | 20 · 40 |
| **Maxed Umas a day** | 1.27 (the Armorer and the trades) | 0.70 (the run's hours) | 0.68 |
| **A party's volume** | 3.9 days | 7.1 days | 7.4 days |
| **A run of twenty** | 15.7 days | 28.4 days | 29.4 days |
| **The fighting party holds G10** | Day 22.5 | Day 22.8 | Day 22.9 |
| **The trades' shares** | 19.7–20.6% | 19.2–21.3% | 18.7–22.8% |
| **Today** | A party 6 days, a run 24 (the Forge's five slots) | About four weeks (tier2-world §11) | — |

## 12. Provides

| To | What |
|---|---|
| **weapon-progression.md** | **Recipes and sizes** (§6.1–§6.2): Weapon Gem 4 (2 ingots, 2 planks), Armor Fittings 2 low · 3 high, Accessory Setting 12 · 6 · 4 by the tier's slot count, the Branch Gem the G5 Weapon Gem in its tier's metal and wood (4); every grade's types by the ladder (§3.4). Make time one gather a refined item; gates Craft Lv 5g − 4. The Forge, the Armorer and the Charm Shop at about 120 an Uma in every tier |
| **extra-stats-progression.md** | Planet Jewel 8, Moon Jewel 4, Halo Jewel 5 (EP18 kept); the ladder's types at Planet III and V and Moon II and V (§6.2); **the Lapidary 120 · 138 · 156 an Uma** (+8 her moon), as EP has it; the whole Uma 485 · 503 · 521, inside a tenth |
| **class-progression.md** | The five trades by calling (§2.2); the calling pick moves only Forest · Armorer ↔ Monster Den · Lapidary; a class switch moves no job (CP30 kept) |
| **README §2** | §2.1's Professions bullet: ten professions in three kinds, ten places and forty slots in every tier, the ladder; §2.2's rows "Pairs a gathering profession 1 · 2 · 3", "Where an Uma works 2 · 3 · 3 places"; §2.3's totals **485 · 503 · 521** (493 · 511 · 529), hours **822 · 852 · 883** (835 · 866 · 896); the glossary's **pair, band, the ladder, secondary** |
| **The refund (README §9.4)** | The stock conversion table (§14); the refund paid in Tier 1's demand mix (PP20); upgrades' Laurels |
| **Pacing** | Per Uma 822 · 852 · 883 hours; a Tier 1 roster 1.27 maxed a day, a Tier 2 run 28.4 days, Tier 3 29.4 (§11) |
| **The engine and the save** | No battle engine change. Work: the trade gate in each job kind's `plan`; the ladder in the recipe tables; `OwnedUma.secondary` with Tier 2's toolbox |

## 13. Assumes

| From | What this doc assumes | If it differs |
|---|---|---|
| **[weapon-progression.md](weapon-progression.md)** (WP10, WP19, WP26, §6) | Its items and counts, adopted as written: Weapon Gem 30 · 27 · 27; **one Branch Gem line** at G5, 3 a tier from Tier 2, its branch picked when used (WP10); Armor Fittings 50, armor carrying all defense; **accessories in four families, all four in every tier** (base forms, then branches; *follow-up to the weapon review, 2026-10-24*), **1 · 2 · 3 untyped slots, one Accessory Setting a slot a grade** (10 · 20 · 30), any family and form; one item of a line fits any weapon, slot or type | **Agrees since the cross-check (2026-10-24):** WP §6 now shows this doc's recipes (the ladder, the Branch Gem at 4 in its tier's pair, PP8's names), gear 365 in every tier and the whole Uma 485 · 503 · 521; WP §11 pays the refund in Tier 1's demand mix (PP20) and numbers the save v27. Before it, WP's draft had the first round's catalog, a Branch Gem of 9 and 365 · 380 · 380. **Re-checked after the owner's weapon review (2026-10-24):** no amount moves (WP §6.4's box): the accessory branches are forms opened by the slot's G5 Setting, no new item; the Branch Gem stays 3 a tier (a Dual's partner is fixed, so the gem carries only the branch); gear 365 and the Uma 485 · 503 · 521 hold |
| **[extra-stats-progression.md](extra-stats-progression.md#11-jewels)** (EP17, EP18; re-checked 2026-10-24, 15:27) | Jewel kinds, grades and counts: 25 · 29 · 33 every moon (20 · 24 · 28 her class's), her moon's 2; Planet 8, Moon 4, **Halo 5** (one of each of its tier's types); the Lapidary **120 · 138 · 156** | **Agrees:** EP §11.2 now follows the ladder (PP9) and the catalog (PP8), and EP §11.3 states the whole Uma at 485 · 503 · 521. Nothing to reconcile |
| **class-progression.md** (CP29–CP30, CP38–CP41) | The calling and its pick name the trade; the class branch's reverse set is a second set of weapons, not more items an Uma | — |
| **variance.md** (U4) | One rule names her calling; today's split 17.0–22.6% | — |
| **README §9.3** | **Save v27 is the Tier 1 rework, v28 Tier 2's toolbox:** the code reached v26 with D190's party lead (2026-10-22). *The README and the other three docs say so since the cross-check (2026-10-24)* | Only the number moves |
| **The kit and uma-art** | Nothing new: `Place.frame` and eight pips exist; the ten frames and sixty icons exist (§3.3, §4.1) | — |
| **Tier 2's world** (tier2-world §11) | A run of twenty ascends together at Craft Lv 1 with the purse; about four weeks to max | — |

## 14. Save impact

The Tier 1 rework's one migration, **save v27** ([README §9.3](README.md#93-save-v27-one-migration-every-world); v26 is
taken on main, §13), every world alike. The deleted gear and Star Gems come back as raw items, so this conversion runs in the same step.

| Today in the save | After | For the refund |
|---|---|---|
| `items`: 80 raw, 80 refined | **Converted one for one** by family and grade band (the table below): raw to raw, refined to refined | Nothing lost |
| `buildings`: 11 facilities' levels | Dropped: places have no levels | Each paid upgrade back: its Laurels (up to 7,150 a world), and its refined items as raw items in the refund mix (up to 66) |
| `work`: rows, queues, Repeat | Settled: finished items collected with their Craft EXP; unfinished inputs returned, then converted; queues and Repeat drop | Only time in progress is lost |
| Crafted gear (stock and bound), Star Gems (stock and set), Forge and Lapidary jobs | Deleted by weapon-progression.md (WP27) and extra-stats-progression.md (EP21) | **Their raw count back, paid in Tier 1's demand mix** (PP20) |
| `OwnedUma.craft` | **Kept** | — |
| `OwnedUma.secondary` | New, Tier 2+ worlds, with Tier 2's toolbox (v28): empty until picked | — |
| `targets` | Kept; their lines recompute from the new recipes | — |
| Place ids | **Kept:** `mine`, `forest`, `monster-den`, `workbench`, `forge`, `lapidary`. **Removed:** `ley-spring`, `crystal-cavern`, `quarry`, `meadow`, `fossil-dig`. **New:** `fields`, `fishery` (the farm's ids, gone since save v21), `armorer`, `charm-shop` | A link or remembered page to a removed id opens the Wilds page |

**The stock conversion** (PR14 kept):

| Today's family (site) | Becomes | Grades 1–5 → | Grades 6–10 → |
|---|---|---|---|
| Ores (Mine), Stones (Quarry) | Mining | Copper Ore · Copper Ingot | Iron Ore · Iron Ingot |
| Woods (Forest) | Wood Chopping | Pine Log · Pine Plank | Oak Log · Oak Plank |
| Fibers (Meadow) | Farming | Flax · Linen | Cotton · Cotton Cloth |
| Essences (Ley Spring), Bones & Horns (Fossil Dig) | Fishing | Seashell · Shell Carving | Ammonite · Ammonite Carving |
| Crystals (Crystal Cavern), Hides & Scales (Monster Den) | Hunting | Quartz · Cut Quartz | Garnet · Cut Garnet |

Of today's 160 ids, 20 stay as Tier 1's types and 40 come back as Tiers 2 and 3's; the other 100 leave the code
(old-save fixtures keep them, as D144's did) and uma-art keeps every icon. A Tier 2 world's old Silver Ore converts to
Copper Ore like any other: its Tier 2 pair starts empty.

**The refund** (PP20): every deleted item names its raw inputs (a gear piece 2, a Star Gem its recipe, an upgrade its
refined items), so the count comes from the save alone. It is **paid in Tier 1's demand mix**, the shares one Uma's
485 take, so what comes back rebuilds what went:

| A fully built Lv 50 Uma today | Count | Paid as (Tier 1's mix) | By family instead (the first round) |
|---|---|---|---|
| Gear: 120 pieces × 2 | 240 | | |
| Star Gems: a full map | 232 | | |
| **In all** | **472 raw** | Copper Ore 37, Iron Ore 65, Pine Log 35, Oak Log 58, Flax 60, Cotton 33, Seashell 59, Ammonite 33, Quartz 29, Garnet 63 | Mining 118, Wood Chopping 59, Farming 59, Fishing 118, Hunting 118 |
| **Against her new 485** (493) | 97% | Every type 1–2 short of her 485 | Wood Chopping and Farming 36 short each; three others 13–23 over |

**Volume:** a world's refund is its Umas' built gear and maps (about 472 each fully built, in proportion below that),
plus its stock converted and its upgrades returned. The owner recrafts by hand; nothing converts into a made item.

## 15. Pacing

**Unchanged:** Craft Level's curve (D96), 2 EXP a job-minute, the gate 5g − 4, gather minutes, processing at a
quarter, batches, queues.

- **Per Uma:** 822 hours at Lv 25's speed in Tier 1 against today's 776 (+6%), 852 in Tier 2 (+3.7% on Tier 1), 883 in
  Tier 3 (+7.4%): every tier inside the tenth. Her moon adds 13 hours a tier.
- **Craft Level comes about two days sooner:** every slot works ×1.25 from day 1; today's facilities reach level 3
  about day 11. Grade 6 on day 11.2 (today 13.5), grade 10 on day 22.1 (24.3), Lv 50 on day 24.5 (26.7) (§5.3).
- **Tier 1 rosters gear faster than today:** a run of twenty in 15.7 days of volume against 24, because four making
  places carry what one Forge did. Craft Level still opens grade 10 on day 22, so the fighting party's pace is today's.
- **Tiers 2 and 3:** a run of twenty in 28.4 and 29.4 days, within two days of today's four weeks; the secondary keeps
  any split there (§8.5, §9.4).
- **Laurels:** no upgrade costs (up to 7,150 a world today); the Exchange × tier; the secondary's fee × tier.
- **What would move it:** a category adding more than a tenth a tier. Its recipes shrink instead (the Setting's
  12 · 6 · 4 is the model).

## 16. Decisions

| Call | Recommendation | Alternatives, briefly | Why |
|---|---|---|---|
| **PP1** Profession types | **Three kinds of work:** five gathering (Mining, Wood Chopping, Farming, Fishing, Hunting), one processing (Material Processing at the Workbench), four making (Weapon, Armor, Accessory and Jewel Crafting). The owner's five crafting professions are processing plus the four making ones. The engine keeps gather, refine, craft and cut; the player sees gather, process, make | Processing folded into each making place (five crafting places that also refine); eleven professions | Every refined item passes one place; each kind has one time rule (a gather, a quarter, a gather an item) |
| **PP2** The trade | **Her calling's gathering and crafting pair, one Craft Level** (PR1, PR2 kept); the calling pick sets it (CP30), never her active class | One of ten per Uma; her current class; two levels | Class switching is free, so a class tie means nothing; one level is today's |
| **PP3** The pairings | Physical: Mine · Forge. Physical hybrid: Forest · Armorer. Healer: Fields · Workbench. Magical hybrid: Fishery · Charm Shop. Magical: Monster Den · Lapidary (PR3 kept) | Any other matching | One craft a row, the Learning page's order |
| **PP4** Places | **One existing building a profession, four slots, ×1.25 from day 1, no upgrades: ten places and forty slots in every tier** (PR4 kept, the owner's first review) | Five trade lodges of eight slots; sites and three stations; a slot a place a tier (40 · 50 · 60) | Ten structures instead of 40–80; a run of twenty never fills forty slots, so more slots only add empty pips |
| **PP5** The map | Today's ten side spots, one row a trade, gathering left, making right; **the same map in every tier**, the tier's look; a tier adds type icons, never a building (PR5 kept) | A fifth Hub page; a building a tier | The measured layout, one row of pips; an Uma's places side by side |
| **PP6** Art | **Reuse only:** ten frames (`mine`, `forest`, `fields`, `fishery`, `monster-den`, `workbench`, `forge`, `lancers-barracks`, `arcane-armory`, `lapidary`), sixty item icons; no kit change, no new art (PR6 kept) | New pearl icons; hut tiles | The owner's ask; the kit draws any frame and eight pips |
| **PP7** Material types | **Five lines, a pair a tier:** a low type (grades 1–5, Craft Lv 1) and a high type (6–10, Lv 26); **2 · 4 · 6 types a gathering profession** (10 · 20 · 30; 20 · 40 · 60 ids); processing one for one (PR7, extended) | Ten grades each (today's 160); one type each; a pair a tier for Tier 1 only | The owner's two types, more each tier; grades still matter on the items |
| **PP8** The catalog's order | **Each tier's pair sits above the last on today's grade ladder:** Mining Copper, Iron · Silver, Titanium · Mythril, Orichalcum; Wood Chopping Pine, Oak · Mahogany, Ebony · Elderwood, Yggdrasil; the other three as the first round. *Changed from professions.md §0.3* | The first round's (Silver, Mythril · Titanium, Orichalcum; Cedar, Elderwood · Ebony, Yggdrasil) | Each tier's icons look richer than the last's; the legendary pair crowns Tier 3 |
| **PP9** The ladder | **A grade decides its material.** Tier 1: G1–G5 low, G6–G10 high. **Tier 2: G5 and G10 take Tier 2's pair. Tier 3: G4 and G9 Tier 2's, G5 and G10 Tier 3's.** Amounts never change. *New: the first round gave a tier's pair only to its new pieces* | The first round's (a tier's pair in its new pieces only: 5% of Tier 2); every recipe on the tier's pair; half-and-half recipes | The main profession's higher tier is a real fifth of the work; one row to learn a tier; the base pair keeps most of the volume, so a secondary can always help |
| **PP10** Recipes | **One fixed set an item, the same amounts in every tier:** Weapon Gem 4; Armor Fittings 2 · 3; Accessory Setting 12 · 6 · 4 by slot count; Planet Jewel 8; Moon Jewel 4; Halo Jewel 5 (EP18); **the Branch Gem the G5 Weapon Gem in its tier's pair (4)**; a tier's new jewels keep the pair of the tier that brought them. Each making place about a quarter of an Uma's refined items, each gathering profession about a fifth (PR8 kept, changed for the Branch Gem) | The first round's and WP26's Branch Gem (G5 recipe + one of each pair, 9); rotating pairs (D139) | Anyone can say what an item takes; each trade carries about a fifth; the branch costs a grade's worth in the tier's materials |
| **PP11** SB1 and amounts | **Counts and amounts don't scale with the tier;** stat values do. One Uma 485 · 503 · 521 refined (+3.7%, +7.4%); a run 28.4 · 29.4 days. *New* | Amounts × 1.8 and × 2.6 (905 · 1,355 refined; runs of 51 and 76 days); times × tier (the same) | The owner keeps today's rate; SB1 is about a stat's share, not time |
| **PP12** Make time | **One gather's time a refined item in the piece** (PR9 kept) | Today's flat two gathers | Today's rule for two-item recipes; bigger pieces take longer, so trades stay even |
| **PP13** Gates and Craft Level | A low type at Craft Lv 1, a high type at Lv 26, **in every pair and tier**; grade g made at Lv 5g − 4; **Craft Level restarts at Lv 1 in each tier**, as today | Later gates for a tier's pairs; Craft Level carried across tiers | No new gate to learn; the tier's own clock is today's (tier2-world §11) |
| **PP14** The secondary | **From Tier 2, any one of the other eight professions; she does its base work** (base types; grades made of base types). **Tier 3: + its Tier 2 work.** Free the first time a tier; a change costs **1,000 Laurels × the tier**, refused while she works there. *Changed from PR11: gathering only, a flat 1,000* | Gathering only (PR11: a Tier 2 run with two Mages takes 40 days, with one 80); free changes; set by rule; a second full trade | The owner's "another profession's base items"; making is where a thin trade binds: with it every split maxes a run in 28.4 days |
| **PP15** The main trade's tier | **The tier's own pair, and every grade made of it, stay her main trade's** (a fifth of the work); Tier 3's secondary reaches Tier 2's. *New* | No reserve (secondaries do everything); the main reserves every making job | The owner's "the main one reaches its higher tiers"; a fifth keeps it real without letting a thin trade stall |
| **PP16** The open shop | **A world with no Uma of a trade opens that trade's places to every Uma, every job,** until one arrives. *New* | Nothing (a world without Mages never makes a jewel); the Exchange selling made items | A Tier 2 run's split is incidental; the fallback costs nothing when trades are filled |
| **PP17** The Exchange | **Raw types only, by pair:** base low after the tier's first win, base high after continent 3; every newer pair low after continent 2, high after continent 4; **low 30, high 80 Laurels × the tier**; selling × the tier. *Changed from PR13: × tier* | Today's two grades a continent; flat prices | Fights pay × tier (D170): a raw item stays two fights a base hour (D65) in every tier |
| **PP18** Today's second-profession proposal (Q13) | **Replaced:** no Lore Level, Relics, Glyphs or Tier 2 sites (PR12 kept) | Lore as an eleventh profession | The trades grow a tier at a time with no second level |
| **PP19** Old saves | Stock converted one for one by family and grade band; all work collected and recalled; upgrades refunded; Craft Level kept; six place ids kept, five removed, four new (PR14 kept) *To rework in this doc's review (owner, 2026-10-24): Craft Levels reset to 1, tickets granted for the time invested.* | Wipe the Wilds | Nothing earned is lost |
| **PP20** The refund | **Every deleted item's raw count back, paid in Tier 1's demand mix** (472 raw for a fully built Uma: every type 1–2 short of her 485). *Changed from PR14's by-family conversion* *To rework in this doc's review (owner, 2026-10-24): Craft Levels reset to 1, tickets granted for the time invested.* | By family (Wood Chopping and Farming 36 short, three others over); converted into made items | The owner's lean: every raw item back, recrafted by hand; the mix makes the refund rebuild her |
| **PP21** The Stable | A **Trade** filter, on locked outfits too, with each trade's head count; the calling card's counts (CP29) (PR15 kept) | None | New unlocks and Pace picks fill a short trade |
| **PP22** Pages, pickers, targets | Each place is today's facility page; its picker lists her trade first, then secondaries, then the rest greyed with the reason; grade chips coloured by their material's tier; the targets strip lists what targets need from that place | A Wilds-wide crafting screen | One place, one job, one strip, as today |
| **PP23** Promotion | Materials and made items stay in the old world (each world its own Warehouse, D15); she arrives at Craft Lv 1 with no secondary; the new world's places and slots are every tier's | Carry materials; carry the secondary | Each tier restarts on its own clock; the old world's Umas still use what's left |

**The first round's calls, mapped:**

| Old | Now | | Old | Now |
|---|---|---|---|---|
| PR1 the calling ties the trade | PP2 (kept) | | PR9 make time | PP12 (kept) |
| PR2 one trade, one Craft Level | PP2 (kept) | | PR10 a pair a tier, new pieces within a tenth | **PP9, PP11** (the ladder; amounts fixed) |
| PR3 the pairings | PP3 (kept) | | PR11 the secondary | **PP14, PP15** (any profession; the main's tier) |
| PR4 one building, four slots | PP4 (kept) | | PR12 Lore replaced | PP18 (kept) |
| PR5 the map | PP5 (kept) | | PR13 the Exchange | **PP17** (× tier) |
| PR6 reuse only | PP6 (kept) | | PR14 old saves | PP19 (kept), **PP20** (the refund's mix) |
| PR7 two types a profession | PP7 (kept), **PP8** (the order) | | PR15 the Trade filter | PP21 (kept) |
| PR8 one fixed recipe an item | **PP10** (the Branch Gem at 4) | | — | **PP1, PP13, PP16, PP22, PP23** (new) |

In bold, the calls this doc changed or added.
