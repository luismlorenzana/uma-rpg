# Profession Progression: ten professions from Tier 1 to Tier 3

> **For the owner's review, the fourth and last standalone doc (2026-10-24).** Brought in line with the three approved
> docs (Class D192, Weapon D193, Extra Stats D194) and with **the owner's compensation direction**, designed in full in
> [§14](#14-save-impact): every Craft Level resets to 1 at save v27 and each world is granted **Speed Tickets for every 30
> minutes of work its Umas did** (PP19, PP20 changed; PP24, PP25 new; [the grant's page](previews/prof-grant.html)).
> Calls are **PP1–PP25**. No open questions.

> **Authored 2026-10-24. Nothing here is built.** The fourth standalone doc of the Tier rework
> ([README §5](README.md#5-the-plan), step 3.4). It absorbs [professions.md](professions.md) (the
> first round, as revised after the owner's first review), which stays as history, and supersedes every PR call
> ([§16](#16-decisions) maps each one). Calls are **PP1–PP25**, each with a recommendation. No open questions.
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
> - **SB1: amounts don't scale with the tier** (PP11); stat values do. One Uma maxed is **485 · 505 · 525** refined items
>   (493 · 513 · 533 with her own moon), every tier within a tenth of Tier 1.
> - **The catalog reordered** so each tier's pair sits above the last on today's grade ladder (PP8): Mining's Tier 2 is
>   Silver and Titanium, Tier 3 Mythril and Orichalcum; Wood Chopping's Mahogany and Ebony, then Elderwood and Yggdrasil.
> - **The Exchange by tier** (PP17), **the open shop** (PP16), and **old saves compensated in time, not items** (PP19,
>   PP20, PP24, PP25): Craft Levels back to 1, a Speed Ticket for every 30 minutes of work, the deleted gear and Star
>   Gems folded into the same grant.
>
> **Cross-checked with the other three standalone docs, 2026-10-24** ([README §7](README.md#7-cross-reference-and-cross-check-log),
> XC1–XC16). Nothing here changed: weapon-progression.md adopted this doc's recipes, amounts and refund mix (its §6,
> WP26; the refund mix since replaced by the owner's tickets for time, §14), and the save numbers are **v27** (Tier 1)
> and **v28** (Tier 2) everywhere (§14).
>
> **Follow-up to the weapon review, 2026-10-24** ([README §7.1](README.md#71-the-cross-check-2026-10-24), XC21): wording
> only. weapon-progression.md's revision opens **all four accessory families in every tier** (base forms, then
> branches from a slot's G5, which are forms of the slot and need no item, WP34) and forks Tier 3's Dual line, so the
> Tier 3 Branch Gem reads **"Keen, Tempered or Evolved"** (the owner's points, §0, §3.5, §6.3, §9.1–§9.2, §13). **No amount moves:** Accessory
> Settings 10 · 20 · 30 an Uma, 120 refined a tier; the Branch Gem 3 a tier; one Uma 485 · 503 · 521 (then).
>
> **Follow-up to D194 (Extra Stats), 2026-10-24** (extra-stats-progression.md
> [§18.2](extra-stats-progression.md#182-for-profession-progression)): **two jewel kinds in every tier**, Planet and Moon
> Jewels I–V (the Halo Jewels retire with the Halo, Valor and Swiftness); **every class sets the same 20 · 25 · 30 jewels**
> (Moon 15 · 20 · 25: three moons, + weapon moon 1, + weapon moon 2) plus her moon's two; **the Planet Jewel at 12**
> refined, D194's proposal taken ([§6.5](#65-the-planet-jewel-at-12-pp10)). The Lapidary is **120 · 140 · 160** an Uma
> (+8 her moon), one Uma **485 · 505 · 525** refined (493 · 513 · 533), **822 · 856 · 890 hours** (835 · 869 · 903); the
> trades carry **18.6–23.3%**; a run of twenty **15.8 · 28.5 · 29.7 days**. Everything that showed the old numbers
> (§0, §3.4–§3.5, §4, §5.2, §6, §7–§9, §11–§13, §15 and the four pages) is redone; no other call moves.
>
> **Values** follow SB1 ([README §2.5](README.md#25-the-stat-budget-sb1-working-rule-2026-10-23)) in the docs that own
> them. This doc's numbers are counts of items and hours, which SB1 doesn't touch.
>
> **Pages** (full desktop, light and dark): [the Wilds map at each tier](previews/prof-map.html) ·
> [every material type](previews/prof-materials.html) · [gathering → processing → making → what she wears](previews/prof-flow.html)
> · [demand against supply](previews/prof-demand.html) · [the first launch: Craft Levels reset, Speed Tickets for the
> time](previews/prof-grant.html).
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
| A visual page with the buildings and the amounts | [map](previews/prof-map.html), [materials](previews/prof-materials.html), [flow](previews/prof-flow.html), [demand](previews/prof-demand.html); the update's grant: [the first launch](previews/prof-grant.html) |
| First review (2026-10-22): "it felt really blown up, too many structures to keep track of" | [§4](#4-places-the-wilds-at-each-tier) (PP4): ten places and forty slots, in every tier |
| First review: "all assets still exist, fully reuse them and only author a small set" | [§3.3](#33-the-catalog-every-type-every-tier-pp7-pp8), [§4.1](#41-ten-places-pp4-pp6) (PP6): ten existing building frames, sixty existing item icons, nothing to draw |
| **This doc (2026-10-24): "including mat types and profession types"** | **[§2](#2-profession-types) profession types; [§3](#3-material-types) material types** |
| SB1 (2026-10-23): build values × 1 / 1.8 / 2.6; do recipe amounts scale with the tier too? | [§6.4](#64-sb1-amounts-dont-scale-with-the-tier-pp11) (PP11): **no**; one Uma's work stays within a tenth of Tier 1's in every tier |
| 2026-10-24, decided elsewhere: accessories damage-oriented, slots 1 · 2 · 3; armor carries all defense; weapons Pure or Dual, then Keen, Tempered or Evolved (D193); Extra Stats' Planet and three moons, Prowess by class, a weapon moon a tier, the Halo, Valor and Swiftness retired (D194) | [§3.5](#35-what-the-making-places-make), [§6](#6-the-recipe-book): the Charm Shop's Settings by slot count, the Branch Gem at G5, two jewel kinds, the same jewels for every class; cross-checked in [§13](#13-assumes) |
| D194's interface: "take or adjust the proposed Planet Jewel of 12" (extra-stats §18.2) | [§6.5](#65-the-planet-jewel-at-12-pp10) (PP10): **taken**, with the alternatives measured |
| ~~The refund: the owner leans to refunding every raw material~~ (the first draft) | Replaced by the owner's direction below |
| **The owner, 2026-10-24 (the weapon review):** "I don't think the material refund is going to be our main approach; basically I want to reset all farm/craft levels to 1, and then grant all tickets based on the amount of time it took to get all those levels." | [§14](#14-save-impact) in full (PP19, PP20, PP24, PP25): the rule from the save, gear and Star Gems folded in, stock, upgrades and work in progress, three worked players, the first launch; [the grant's page](previews/prof-grant.html) |

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
| **Things made** | 40 gear types × 10 grades; 100 Star Gems | Weapon Gem, Armor Fittings, Accessory Setting G1–G10; Planet and Moon Jewels I–V | + the G5 **Branch Gem** (its branch, Pure or Dual, picked when used); no new jewel: a weapon moon takes Moon Jewels | The Branch Gem in Tier 3's materials (Keen, Tempered or Evolved) |
| **Jewels an Uma** (every class) | 100 Star Gems | **20:** Planet 5, Moon 15 | **25:** + a weapon moon's 5 | **30:** + the second's 5 |
| **Recipes** | Two refined items, the family pair rotating with type and grade | **One fixed set an item** | The same amounts; the band tops on Tier 2's types | The same amounts |
| **One Uma maxed: refined · pieces · hours** | 472 · 220 · 776 h | **485 · 110 · 822 h** | 505 · 125 · 856 h | 525 · 140 · 890 h |
| **With her own moon** | — | 493, 835 h | 513, 869 h | 533, 903 h |
| **Made from the tier's own materials** | — | — | **20%**, her main trade's alone | **20%** (+ 20% from Tier 2's) |
| **A party's volume** | 6 days (the Forge's 5 slots) | **3.9 days** (40 workers) | 7.1 days (the run's 20) | 7.4 days |
| **A run of twenty** | 24 days | **15.8 days** | **28.5 days** (40.2 without secondaries) | **29.7 days** (46.0) |
| **Grade 10 opens** (Craft Lv 46, nonstop) | Day 24 | **Day 22** | Day 22 | Day 22 |
| **New art** | — | **None** | None | None |
| **Old saves** (save v27, once) | — | **Craft Level back to 1; a Speed Ticket for every 30 minutes of work** (a Craft Lv 50 Uma: 1,470); gear and Star Gems folded in; stock kept, converted | — | — |

Hours are work at Craft Lv 25's speed before a place's ×1.25, as today's 776 is. A party and a run are the roster's
volume with every slot it can fill busy; the fighting party's next grade waits on Craft Level, not on volume
([§7.4](#74-a-party-and-the-roster)).

#### Later tiers at a glance

| Piece | Tier 2 | Tier 3 | Where |
|---|---|---|---|
| **Materials** | Each gathering profession adds its Tier 2 pair: Silver, Titanium · Mahogany, Ebony · Wool, Silk Cocoon · Trilobite, Tide Essence · Sapphire, Diamond | Tier 3's: Mythril, Orichalcum · Elderwood, Yggdrasil Branch · Moonsilk Cocoon, Cloudfleece · Aether, Prismatic Essence · Starstone, Philosopher's Stone | [§3.3](#33-the-catalog-every-type-every-tier-pp7-pp8) |
| **The ladder** | G5 and G10 of every line are made of Tier 2's pair | G4 and G9 of Tier 2's, G5 and G10 of Tier 3's | [§3.4](#34-the-ladder-a-grade-decides-its-material-pp9) |
| **Her work** | Her trade, all of it; a **secondary**'s base work | + the secondary's Tier 2 work | [§2.3](#23-the-secondary-tier-2-on-pp14-pp15) |
| **New pieces** | The G5 **Branch Gem** on each weapon (Pure or Dual, picked when used); **a weapon moon's five Moon Jewels** | The Branch Gem again, in Tier 3's materials (Keen, Tempered or Evolved); **the second weapon moon's five Moon Jewels** | [§6.3](#63-the-tiers-new-pieces) |
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
| **Craft EXP** | 2 a minute of the job at her level, before the place's speed (`EXP_PER_MINUTE`, D96); a level takes 1,425 + 15L, so Lv 50 is 88,200 EXP, **735 hours of work**; past Lv 50 her EXP banks in `craft.exp` |
| **Speed Tickets** | Each takes **30 minutes** off a running job (`TIME_TICKET_SPAN`; uma-work's `SPEED_TICKET_MS`), "Finish" ⌈remaining ÷ 30 min⌉; 10 Laurels at the Exchange; 5 an Uma in the ascension purse; held in each world's wallet (`wallet.timeTickets`) |
| **One Uma maxed** | 472 raw, 472 refined, 220 products, about 776 hours at Lv 25's speed |
| **What binds a roster** | **The Forge:** 120 crafts an Uma at two gathers each is 145 slot-hours; its five slots make 0.83 maxed Umas a day, whatever the roster |
| **Each tier** | The same eleven facilities in its own world; Craft Level starts at 1 for an ascended Uma (`ascend` makes her a fresh `OwnedUma` and removes her from the old world, her gear left in its stock) |

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
| | **Jewel Crafting** | Extra Stat Jewel Crafting | Lapidary | Make | Refined items | Planet and Moon Jewels |

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
| **Tier 3** | All of it, Tier 3's pair and the G5 and G10 pieces included | + its **Tier 2 work:** Tier 2's pair and the G4 and G9 pieces (Planet Jewel V and Moon Jewel II among them) |

- **"The main reaches its higher tiers"** (PP15): the tier's own pair, and every grade made of it, stay her trade's: a
  fifth of the tier's work (20%), the Branch Gems included. A secondary covers the other four fifths.
- **Any profession, making included.** Making is where a thin trade binds: a Tier 2 world starts with one run's twenty,
  three of them Mages if the run follows the callings, and only Mages make at the Lapidary. With a gathering-only
  secondary (the first round's PR11) a run with two Mages takes 40 days; with this one, 28.5 (§8.5).
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
- **No tier adds a jewel kind** (EP17, D194): a weapon moon is a moon and takes Moon Jewels, so every jewel follows the
  ladder like every other item (Moon Jewel V on Tier 2's pair in Tier 2; Moon Jewel II on Tier 2's and V on Tier 3's in
  Tier 3; Planet Jewel III and V the same way). The **Branch Gem** is its world's G5 Weapon Gem, so it follows the
  ladder too: Tier 2's pair in Tier 2, Tier 3's in Tier 3. *Follow-up to D194 (Extra Stats), 2026-10-24: the Halo
  Jewels, which kept the pair of the tier that brought them, retire.*
- **What it does:** the tier's own pair carries **a fifth of the work** (20% in Tier 2; in Tier 3, 20% Tier 3's and 20%
  Tier 2's), so the main trade's higher tier matters, and the base pair still carries most of it, which any secondary
  can gather.

| Share of one Uma's refined items | Base pair (Tier 1's types) | Tier 2's pair | Tier 3's pair |
|---|---|---|---|
| **Tier 1** (485) | 485 · 100% | — | — |
| **Tier 2** (505) | 404 · 80% | 101 · 20% | — |
| **Tier 3** (525) | 315 · 60% | 105 · 20% | 105 · 20% |

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
| **Moon Jewel I–V** | Lapidary | 2, 4, 6, 8, 10 | 15 · 20 · 25 (three moons: Prowess, Vigor, Guard; + weapon moon 1; + weapon moon 2) | A node of any moon, picked when set | EP17, EP24, EP26 |
| ★ Her moon: Moon Jewels II and IV | Lapidary | 4, 8 | 2 · 2 · 2 | Her moon's two nodes | EP14 |
| **Pieces an Uma** (her moon apart) | | | **110 · 125 · 140** (jewels 20 · 25 · 30) | | |

- **One of a line fits any of its slots:** a Weapon Gem raises any weapon, a Fittings any armor slot of either half, a
  Setting any accessory slot, family and form, a Moon Jewel any moon (picked when set). So every Uma needs the same items and a
  party is five times one Uma, whatever the classes.
- **Every class sets the same jewels** (EP23, D194: Prowess is one offense moon split by her class): 20 · 25 · 30 an Uma,
  120 · 140 · 160 refined; a party of any five takes 600 · 700 · 800 refined of jewels (+40 for their moons). *Follow-up
  to D194 (Extra Stats), 2026-10-24: the first draft's "a Brawler or a Mage skips her other offense moon" retires.*
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
| 5 | **Lapidary** (`lapidary`) | Jewel Crafting | `lapidary` | Today's Lapidary, moved from the middle row | 0.74, 0.90 | 4 | Make | Planet I–V, Moon I–V, in every tier |

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
| **A making place's quick look** | Its line, G1–G10 | + the Branch Gem at G5 (Forge); G5 and G10 chips in Tier 2's colour (the Lapidary's Planet III and Moon V) | G4 and G9 in Tier 2's colour, G5 and G10 in Tier 3's |
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
| **The Lapidary** | "Lapidary · Jewel Crafting" | One row a kind: Planet I–V, Moon I–V, the same in every tier; grade chips in their material's tier colour | Mages first, then Jewel Crafting secondaries |

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
| **Make** one item | **One gather's time a refined item in it**: a Weapon Gem 4 gathers, a Fittings 2 or 3, a Setting 12 · 6 · 4, a Planet Jewel 12, a Moon Jewel 4 | 1–10 | Grade g at Craft Lv 5g − 4 (today) |

- **Craft EXP** is 2 a minute of the job at her level, before the place's speed (today); every hour of any job levels
  her alike. Queues, Repeat, Recall, Speed Tickets and stopped queues are uma-work's and don't change.
- **Today's makes** take two refined items and two gathers' time, so the make rule is today's, extended (PR9).

### 5.2 Times at each Craft Level

Real time in a slot (×1.25):

| Craft Lv | A gather | A process | Gathers a day | Processes a day | Weapon Gem, Moon Jewel (4) | Fittings (2 · 3) | Setting (12 · 6 · 4) | Planet Jewel (12) |
|---|---|---|---|---|---|---|---|---|
| 1 | 43.2 min | 10.8 min | 33 | 133 | 2.9 h | 1.4 · 2.2 h | 8.6 · 4.3 · 2.9 h | 8.6 h |
| 25 | 36.1 min | 9.0 min | 40 | 159 | 2.4 h | 1.2 · 1.8 h | 7.2 · 3.6 · 2.4 h | 7.2 h |
| 50 | 28.8 min | 7.2 min | 50 | 200 | 1.9 h | 1.0 · 1.4 h | 5.8 · 2.9 · 1.9 h | 5.8 h |

Through the whole chain (gather, process, make) one refined item takes 81 slot-minutes at Lv 25: **0.74 refined items
an Uma-hour**.

### 5.3 Craft Level in each tier

Craft Level's curve doesn't change (D96: 1,425 + 15L EXP a level, 88,200 to Lv 50). **It restarts at Lv 1 in every new
tier**, as today: an ascended Uma arrives fresh, so a tier's grades open again on its own clock. **At save v27 every
Uma's Craft Level goes back to 1 once** (the owner's direction, §14), so every world opens its grades on this clock too.
Working nonstop at ×1.25 (from day 1, no upgrades):

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
| **Planet Jewel** (I–V: 1, 3, 5, 7, 9) | **12** | 3 each: Cut Quartz, Pine Plank, Linen, Shell Carving | 3 each: Cut Garnet, Oak Plank, Cotton Cloth, Ammonite Carving | Hunting, Wood Chopping, Farming, Fishing |
| **Moon Jewel** (I–V: 2, 4, 6, 8, 10) | **4** | 3 Cut Quartz, 1 Copper Ingot | 3 Cut Garnet, 1 Iron Ingot | Hunting, Mining |
| **Branch Gem** (G5) | **4** | The G5 Weapon Gem: 2 ingots, 2 planks of its tier's low pair | — | Mining, Wood Chopping |
| **Process** (Workbench) | 1 raw | Every type, one for one | | — |

- **Each making place uses about a quarter of an Uma's refined items** in Tier 1 (Forge 120, Armorer 125, Charm Shop
  120, Lapidary 120) and **each gathering profession about a fifth** (Mining, Wood Chopping, Farming and Fishing 100
  each, Hunting 85), so each trade carries 18.8–20.6% of the work ([§7.2](#72-what-each-trade-carries)).
- **The accessory is the big piece.** Tier 1 has one accessory slot and five armor slots; for the Charm Shop to be as
  busy as the Armorer, a Setting costs what a grade of the whole suit does. It shrinks as slots grow, **12 · 6 · 4**, so
  the Charm Shop stays at 120 an Uma in every tier.
- **The Planet Jewel is 12** (D194's proposal, taken; [§6.5](#65-the-planet-jewel-at-12-pp10)): with Prowess every
  class sets 20 jewels in Tier 1, not 25, and a Planet Jewel of 12 puts the Lapidary back on 120. **No Halo Jewel**: the
  Halo retired (EP9); the weapon moons take Moon Jewels (EP17).
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

**Planet Jewel** (12: three each of a cut stone, a plank, a cloth and a carving or infusion; *follow-up to D194, was
8, two of each*).

| Jewel (grade) | Tier 1 | Tier 2 | Tier 3 |
|---|---|---|---|
| I (1), II (3) | 3 each: Cut Quartz, Pine Plank, Linen, Shell Carving | The same | The same |
| III (5) | The same | **3 each: Cut Sapphire, Mahogany Plank, Wool Cloth, Trilobite Carving** | **3 each: Cut Starstone, Elderwood Plank, Moonsilk, Aether Infusion** |
| IV (7) | 3 each: Cut Garnet, Oak Plank, Cotton Cloth, Ammonite Carving | The same | The same |
| V (9) | The same | The same | **3 each: Cut Diamond, Ebony Plank, Silk, Tide Infusion** |

**Moon Jewel** (4: three cut stones on a metal mount). Every moon takes them, picked when set: Prowess, Vigor and Guard,
from Tier 2 a weapon moon (Tier 3 two), and her moon (II and IV).

| Jewel (grade) | Tier 1 | Tier 2 | Tier 3 |
|---|---|---|---|
| I (2) | 3 Cut Quartz, 1 Copper Ingot | The same | The same |
| II (4) | The same | The same | **3 Cut Sapphire, 1 Silver Ingot** |
| III (6), IV (8) | 3 Cut Garnet, 1 Iron Ingot | The same | The same |
| V (10) | The same | **3 Cut Diamond, 1 Titanium Ingot** | **3 Cut Philosopher's Stone, 1 Orichalcum Ingot** |

The [flow page](previews/prof-flow.html) draws every recipe with its icons, by tier and grade.

### 6.3 The tier's new pieces

| Tier | Piece | How many an Uma | Recipe | Made by |
|---|---|---|---|---|
| 2 | **Branch Gem**, a weapon's G5 step; Pure or Dual picked when used | 3 (one a weapon) | 2 Silver Ingot, 2 Mahogany Plank | The Forge's Brawlers (Tier 2's own pair) |
| 2 | **Weapon moon I–V: Moon Jewels I–V** (EP24) | 1 each (5) | The Moon Jewel's, by the ladder: I–IV on base types, **V on Tier 2's** (3 Cut Diamond, 1 Titanium Ingot) | Mages; I–IV also Jewel Crafting secondaries |
| 3 | **Branch Gem**: Pure → Keen or Tempered, Dual → Tempered or Evolved; a weapon arriving as Base takes Pure or Dual | 3 | 2 Mythril Ingot, 2 Elderwood Plank | Brawlers |
| 3 | **The second weapon moon: Moon Jewels I–V** (EP26) | 1 each (5) | The ladder's: I, III, IV on base types, **II on Tier 2's** (3 Cut Sapphire, 1 Silver Ingot), **V on Tier 3's** (3 Cut Philosopher's Stone, 1 Orichalcum Ingot) | Mages (V); Jewel Crafting secondaries the rest (Tier 2's work is theirs in Tier 3) |
| 3 | Weapon moon 1, rebuilt: Moon Jewels I–V | 1 each (5) | The same | As above |
| Any | **Re-forging** (WP11): another Branch Gem of the tier | Outside the demand | The tier's Branch Gem | As above |

*Follow-up to D194 (Extra Stats), 2026-10-24: the first draft's Halo Jewels I–IV and Valor's and Swiftness's Moon Jewels
retire; each tier's new jewels are a weapon moon's five Moon Jewels.*

### 6.4 SB1: amounts don't scale with the tier (PP11)

SB1 scales **build values** (Might, armor, nodes) × 1.8 and × 2.6 so the build keeps its share of her stats. **The
items and their amounts stay the same in every tier**: a Tier 2 Weapon Gem G6 is still four refined items, and its
grade gives × 1.8 the Might.

| Option | One Uma, refined: Tier 2 · Tier 3 | A Tier 2 · 3 run of twenty | Verdict |
|---|---|---|---|
| **Amounts fixed; new pieces and the ladder only** (recommended) | **505 · 525** (+4.1%, +8.2%) | **28.5 · 29.7 days** | Inside a tenth; the run's four weeks are today's Tier 2 ([tier2-world §11](../tier2-world.md#11-a-runs-first-week)) |
| Amounts × 1.8 and × 2.6 | 909 · 1,365 | About 51 · 77 days | Tier 3 takes two and a half months |
| Times × 1.8 and × 2.6 (the same items, slower jobs) | Hours × 1.8 · × 2.6 | The same as above | The same cost, less visible |

- **Why:** SB1 is about a stat's share; the owner's "rate of progression is fine as it is" is about time. Craft Level
  restarts every tier, and Tier 2's long loop is already crafting (tier2-world §11); scaling amounts would double it.
- **Laurels do scale** (fights pay × tier, D170), so the Exchange's prices and the secondary's change fee are × tier
  (PP14, PP17): a Laurel buys the same work in every tier.

### 6.5 The Planet Jewel at 12 (PP10)

**D194 proposed it and left the amount here** (extra-stats §11.2, §18.2): with Prowess every class sets 20 jewels in
Tier 1 (5 Planet, 15 Moon), not the first draft's 25, so at the old recipes the Lapidary would make 100 an Uma. **Taken:
a Planet Jewel is 12 refined, three each of a cut stone, a plank, a cloth and a carving or infusion.** The Moon Jewel
stays 4 (EP18).

| Recipe | Lapidary an Uma: T1 · T2 · T3 | One Uma: T1 · T2 · T3 | Hours (Lv 25) | Gathered an Uma in Tier 1: Mining · Wood · Farming · Fishing · Hunting | The magical trade's share: T1 · T2 · T3 | Every trade, every tier |
|---|---|---|---|---|---|---|
| Planet 8, Moon 4 (the old recipes) | 100 · 120 · 140 | 465 · 485 · 505 | 788 · 822 · 856 | 100 · 95 · 95 · 95 · 80 | 17.2 · 19.7 · 22.0% | 17.2–22.0% |
| **Planet 12, Moon 4** (D194's proposal, **taken**) | **120 · 140 · 160** | **485 · 505 · 525** | **822 · 856 · 890** | **100 · 100 · 100 · 100 · 85** | **18.8 · 21.1 · 23.3%** | **18.6–23.3%** |
| Planet 16, Moon 4 (four of each) | 140 · 160 · 180 | 505 · 525 · 545 | 856 · 890 · 923 | 100 · 105 · 105 · 105 · 90 | 20.2 · 22.4 · 24.5% | 18.3–24.5% |
| Planet 8, Moon 5 | 115 · 140 · 165 | 480 · 505 · 530 | 813 · 856 · 898 | 100 · 95 · 95 · 95 · 95 | 19.4 · 22.4 · 25.2% | 18.0–25.2% |

- **Why 12:** Tier 1 lands back on the numbers the four docs approved: **the Lapidary 120** (each making place 120–125),
  **one Uma 485, 822 hours**. Tier 1's four gathering professions gather **100 each**, Hunting 85 (at 8: Mining 100, the
  others 95, Hunting 80). "Three of each" is as easy to say as two of each. Every trade carries 18.6–23.3% of the work
  in every tier, and Tiers 2 and 3 stay inside PR10's tenth (+4.1%, +8.2%).
- **What it costs:** Tier 2 and 3 grow by 2 and 4 refined an Uma against the first draft (503 · 521), and the magical
  trade carries 23.3% of Tier 3's work. A run doesn't feel it: the secondary keeps every split at the run's own hours
  (§9.4), and the Lapidary binds only a Tier 3 roster above about thirty workers (§9.3). Tier 1's run of twenty moves
  15.7 → 15.8 days: the Fishery's five more an Uma make the magical hybrid trade's seven Umas bind beside the Armorer
  (§7.4).
- **Why not 8:** Tier 1's Uma falls to 465 and the Lapidary to 100, the lightest making place in Tier 1, where a Mage
  has no secondary to fill her day; it only looks better in Tier 3 (22.0%).
- **Why not 16 or a Moon Jewel of 5:** 16 puts Tier 1 past what the docs approved (505, 856 hours); a Moon Jewel of 5
  leaves Tier 1 near it (480) but grows the Lapidary with every weapon moon. Both carry the magical trade to 24.5–25.2%
  of Tier 3.

## 7. Tier 1 in full

### 7.1 One Uma's demand

| Her need | Pieces | At | Refined each | Refined |
|---|---|---|---|---|
| 3 weapons, G0 → G10: a Weapon Gem a step | 30 | Forge | 4 | 120 |
| 5 armor slots, G1–G10: Armor Fittings | 50 | Armorer | 2 or 3 | 125 |
| 1 accessory slot, G1–G10: a Setting a step | 10 | Charm Shop | 12 | 120 |
| Extra Stats: Planet Jewel I–V | 5 | Lapidary | 12 | 60 |
| Extra Stats: Moon Jewel I–V on three moons (Prowess, Vigor, Guard) | 15 | Lapidary | 4 | 60 |
| **Total** | **110** | | | **485**: 485 gathers, 485 processes |
| ★ + her moon: Moon Jewels II and IV | 2 | Lapidary | 4 | 8: **493** |

**By type** (her moon in brackets): Copper 36 (37), Iron 64 (65); Pine 39, Oak 61; Flax 64, Cotton 36; Seashell 64,
Ammonite 36; Quartz 27 (30), Garnet 58 (61). *Follow-up to D194: the same 485, made of 20 jewels for every class instead
of the first draft's 25.*

### 7.2 What each trade carries

Hours at Craft Lv 25's speed, before ×1.25:

| Trade | Gathers | Makes or processes | Hours | Share |
|---|---|---|---|---|
| Physical: Mine · Forge | 100 | 120 refined | 166 | 20.2% |
| Physical hybrid: Forest · Armorer | 100 | 125 refined | 169 | 20.6% |
| Healer: Fields · Workbench | 100 | 485 processes | 167 | 20.3% |
| Magical hybrid: Fishery · Charm Shop | 100 | 120 refined | 166 | 20.2% |
| Magical: Monster Den · Lapidary | 85 | 120 refined | 154 | 18.8% |
| **One Uma** | 485 | | **822** | |

### 7.3 Supply: one place and one slot

| Place | Hours a maxed Uma (Lv 25, before ×1.25) | Its four slots make, maxed Umas a day |
|---|---|---|
| Mine, Forest, Fields, Fishery | 75 each | 1.59 |
| Monster Den | 64 | 1.88 |
| Forge, Charm Shop, Lapidary | 90 each | 1.33 |
| Workbench | 91 | 1.31 |
| **Armorer** | **94** | **1.28**: the place that binds a full Tier 1 Wilds |

### 7.4 A party and the roster

**A roster at the owner's pace** (one party fights, dozens work): forty Umas at the callings' split, 9 physical,
8 physical hybrid, 9 healer, 7 magical hybrid, 7 magical. Each trade has eight slots (its two places), so the thinnest
trades and the Armorer's four slots set the pace together:
- **1.27 maxed Umas a day:** the magical hybrid trade's seven Umas (1.27; Fishery and Charm Shop, 133 slot-hours an
  Uma) and the Armorer's four slots (1.28) bind together. Past forty workers nothing speeds up: forty slots, and the
  Armorer full.
- **A party's next grade** (a tenth of five Umas) is about **9 hours** of the roster's work; a whole party **3.9 days**;
  a run of twenty **15.8 days**.
- **Craft Level is the wall, not volume** (as today): a fresh roster opens grade 10 on day 22.1, and with every slot
  busy the fighting party holds it on day 22.5, the run of twenty on day 23.7. The roster's levels run ahead of the
  fighting party's in play, as the owner plays it.
- **Today** the Forge binds: five slots, 145 slot-hours an Uma, **0.83 maxed Umas a day**: a party in 6 days, a run in 24.
  The four making places spread that work.
- **A young roster** (twenty Umas, 5 · 4 · 5 · 3 · 3) runs at 0.54 a day: the magical hybrid trade's three Umas bind (the
  Mages' three at 0.58). A short trade buys raw items at the Exchange, and the Stable's **Trade filter** (PP21) shows
  which unlocks would fill it.

| Grade | G1 | G2 | G3 | G4 | G5 | G6 | G7 | G8 | G9 | G10 |
|---|---|---|---|---|---|---|---|---|---|---|
| Opens (Craft Lv 5g − 4), day | 0 | 2.0 | 4.2 | 6.4 | 8.8 | 11.2 | 13.8 | 16.5 | 19.2 | 22.1 |
| The party holds it (40 workers), day | 0.4 | 2.4 | 4.6 | 6.8 | 9.2 | 11.6 | 14.2 | 16.9 | 19.6 | 22.5 |
| A run of twenty holds it, day | 1.6 | 3.6 | 5.8 | 8.0 | 10.4 | 12.8 | 15.4 | 18.1 | 20.8 | 23.7 |

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
| Things to make | 400 gear pieces, 100 Star Gems | **40**: Weapon Gem, Armor Fittings, Accessory Setting × 10 grades; Planet and Moon Jewels I–V (two jewel kinds in every tier) |
| Recipe rule | Four family pairs rotating by type and grade; Star Gems with side items | **One fixed set an item;** grades 1–5 the low type, 6–10 the high |
| Where an Uma can work | Any of 11 | **Her 2 places** |
| Choices when gathering · processing | 10 grades · 80 items | 2 types (1 before Craft Lv 26) · 10 |
| Per Uma, maxed | 472 raw, 472 refined, 220 pieces, 776 h | 485, 485, 110, 822 h (493 and 835 h with her moon) |
| Craft Level at the update | — | **Lv 1 for every Uma**, her work paid in Speed Tickets (§14) |
| New art | — | **None** |
| **Added** | — | Trades; the low or high type |

## 8. Tier 2 in full

### 8.1 What Tier 2 adds

- **One more pair** a gathering profession (§3.3), gathered only by her main trade.
- **The ladder's first step:** G5 and G10 of every line are made of Tier 2's pair (§3.4), by her main trade.
- **The secondary** (§2.3): one other profession's base work, so any Uma can help a short trade.
- **New pieces:** three Branch Gems at G5 (Pure or Dual) and a weapon moon's five Moon Jewels (EP24); a second accessory
  slot (Settings shrink to 6).
- **What stays:** the map, ten places, forty slots, every amount, Craft Level's curve.

### 8.2 One Uma's demand

| Her need | Pieces | At | Refined |
|---|---|---|---|
| 3 weapons: Weapon Gems G1–G4, G6–G10 | 27 | Forge | 108 |
| Their G5 Branch Gems (Pure or Dual) | 3 | Forge | 12 |
| 5 armor slots: Armor Fittings | 50 | Armorer | 125 |
| 2 accessory slots: Settings of 6 | 20 | Charm Shop | 120 |
| Planet Jewel I–V | 5 | Lapidary | 60 |
| Moon Jewel I–V on the three moons | 15 | Lapidary | 60 |
| Moon Jewel I–V on her weapon moon | 5 | Lapidary | 20 |
| **Total** | **125** | | **505** (+4.1% on Tier 1) |
| ★ + her moon | 2 | Lapidary | 8: **513** |

**By type** (her moon in brackets): base Copper 32 (33), Iron 52 (53), Pine 30, Oak 50, Flax 50, Cotton 30,
Seashell 50, Ammonite 30, Quartz 30 (33), Garnet 50 (53); **Tier 2's** Silver 6, Titanium 15, Mahogany 9, Ebony 11,
Wool 14, Silk 6, Trilobite 14, Tide Essence 6, Sapphire 3, Diamond 17: **101, 20%**.

### 8.3 What each trade carries

| Trade | Gathers | Makes or processes | Hours | Share | Her main trade's alone (slot-hours) |
|---|---|---|---|---|---|
| Physical: Mine · Forge | 105 | 120 | 169 | 19.8% | 27 |
| Physical hybrid: Forest · Armorer | 100 | 125 | 169 | 19.8% | 27 |
| Healer: Fields · Workbench | 100 | 505 | 170 | 19.9% | 27 |
| Magical hybrid: Fishery · Charm Shop | 100 | 120 | 166 | 19.4% | 26 |
| Magical: Monster Den · Lapidary | 100 | 140 | 181 | 21.1% | 29 |
| **One Uma** | 505 | | **856** | | |

The Lapidary grows most (+20 an Uma): Extra Stats adds a weapon moon a tier (EP24), five nodes, and only jewels open
them. Its four slots make 1.14 maxed Umas a day, so it binds a Tier 2 roster of more than about 32 workers; a world of
one run never gets there.

### 8.4 The secondary at work

- **Who picks what:** the run's split decides. A run that follows the callings (5 · 4 · 5 · 3 · 3) has two thin
  trades; a few physical and healer Umas take Fishing, Hunting, Accessory Crafting or Jewel Crafting as secondaries
  and do those trades' base work.
- **What stays the trade's** (PP15): Tier 2's pair and the G5 and G10 pieces made of it, a fifth of the work: 26–29
  slot-hours a maxed Uma for each trade.
- **The head counts** on the pick and the targets strip's dots say where to point it.

### 8.5 A run of twenty

A Tier 2 world starts with one Rift run's twenty, Craft Lv 1 each, nothing in stock but the purse (T5).

| The run's split (physical · physical hybrid · healer · magical hybrid · magical) | With the secondary (PP14) | A gathering-only secondary (the first round) | No secondary |
|---|---|---|---|
| **The callings' split: 5 · 4 · 5 · 3 · 3** | **28.5 days** | 28.5 | 40.2 |
| Even: 4 · 4 · 4 · 4 · 4 | 28.5 | 28.5 | 30.1 |
| Thin: 5 · 5 · 5 · 3 · 2 | **28.5** | 40.2 | 60.2 |
| One Mage: 6 · 5 · 5 · 3 · 1 | **28.5** | 80.3 | 120.5 |

- **The run is bound by its own hours** (685 slot-hours a maxed Uma, 480 a day for twenty): 28.5 days, within a day of
  today's "about four weeks" (tier2-world §11).
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
- **The secondary reaches its Tier 2 work:** Tier 2's pair and the G4 and G9 pieces (Planet Jewel V and Moon Jewel II
  among them).
- **New pieces:** three Branch Gems (Keen, Tempered or Evolved); the second weapon moon's five Moon Jewels (EP26), the
  first one's rebuilt; a third accessory slot (Settings of 4).

### 9.2 One Uma's demand

| Her need | Pieces | At | Refined |
|---|---|---|---|
| 3 weapons: Weapon Gems G1–G4, G6–G10 | 27 | Forge | 108 |
| Their G5 Branch Gems (Keen, Tempered or Evolved) | 3 | Forge | 12 |
| 5 armor slots: Armor Fittings | 50 | Armorer | 125 |
| 3 accessory slots: Settings of 4 | 30 | Charm Shop | 120 |
| Planet Jewel I–V | 5 | Lapidary | 60 |
| Moon Jewel I–V on the three moons | 15 | Lapidary | 60 |
| Moon Jewel I–V on her two weapon moons | 10 | Lapidary | 40 |
| **Total** | **140** | | **525** (+8.2% on Tier 1) |
| ★ + her moon | 2 | Lapidary | 8: **533** (+8.1% on Tier 1's 493) |

**By type** (her moon in brackets): base Copper 23, Iron 43 (44), Pine 24, Oak 36, Flax 39, Cotton 21, Seashell 39,
Ammonite 21, Quartz 21, Garnet 48 (51); **Tier 2's** Silver 11 (12), Titanium 11, Mahogany 6, Ebony 14, Wool 11, Silk 9,
Trilobite 11, Tide 9, Sapphire 15 (18), Diamond 8: **105, 20%**; **Tier 3's** Mythril 6, Orichalcum 16, Elderwood 9,
Yggdrasil 11, Moonsilk 14, Cloudfleece 6, Aether 14, Prismatic 6, Starstone 3, Philosopher's Stone 20: **105, 20%**.

### 9.3 What each trade carries

| Trade | Gathers | Makes or processes | Hours | Share |
|---|---|---|---|---|
| Physical: Mine · Forge | 110 | 120 | 173 | 19.5% |
| Physical hybrid: Forest · Armorer | 100 | 125 | 169 | 19.0% |
| Healer: Fields · Workbench | 100 | 525 | 174 | 19.6% |
| Magical hybrid: Fishery · Charm Shop | 100 | 120 | 166 | 18.6% |
| Magical: Monster Den · Lapidary | 115 | 160 | 207 | 23.3% |
| **One Uma** | 525 | | **890** | |

The Lapidary's four slots make 1.00 maxed Umas a day, so it binds a Tier 3 roster above about 30 workers. The magical
trade's own reserved work (Tier 3's stones and the jewels made of them, PP15) is 33 slot-hours a maxed Uma, the other
trades' 27–28.

### 9.4 A run of twenty

| The run's split | With the secondary (PP14) | A gathering-only secondary | No secondary |
|---|---|---|---|
| **The callings' split: 5 · 4 · 5 · 3 · 3** | **29.7 days** | 30.6 | 46.0 |
| Even: 4 · 4 · 4 · 4 · 4 | 29.7 | 29.7 | 34.5 |
| Thin: 5 · 5 · 5 · 3 · 2 | **29.7** | 45.9 | 69.0 |
| One Mage: 6 · 5 · 5 · 3 · 1 | **29.7** | 91.9 | 138 |

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
| **Speed and Sweep Tickets** | Today's (10 and 15 Laurels; the update's grant pays Speed Tickets, §14) | Today's | Today's |

- **× tier** because a tier's fights pay × tier (D170): a raw item stays about two fights a base hour of gathering (D65)
  in every tier. Today's prices don't scale, so Tier 2 buys at half today's cost in fights.
- **Twenty types don't need a grade ladder** (PR13 kept): the first round's "a continent opens two grades" goes.

## 11. Demand against supply, every tier

Drawn in the [demand page](previews/prof-demand.html).

| | Tier 1 | Tier 2 | Tier 3 |
|---|---|---|---|
| **One Uma: refined · pieces** | 485 · 110 | 505 · 125 | 525 · 140 |
| With her moon | 493 · 112 | 513 · 127 | 533 · 142 |
| **Jewels an Uma** (every class) · the Lapidary's refined | 20 · 120 | 25 · 140 | 30 · 160 |
| **One Uma: hours** (Lv 25, before ×1.25) · slot-hours | 822 · 657 | 856 · 685 | 890 · 712 |
| With her moon | 835 · 668 | 869 · 695 | 903 · 722 |
| Against Tier 1 | — | +4.1% | +8.2% |
| **A party** (five Umas): refined | 2,425 | 2,525 | 2,625 |
| **A run of twenty:** refined | 9,700 | 10,100 | 10,500 |
| **Workers** · slots | 40 (dozens) · 40 | 20 (one run) · 40 | 20 · 40 |
| **Maxed Umas a day** | 1.27 (the magical hybrid trade and the Armorer) | 0.70 (the run's hours) | 0.67 |
| **A party's volume** | 3.9 days | 7.1 days | 7.4 days |
| **A run of twenty** | 15.8 days | 28.5 days | 29.7 days |
| **The fighting party holds G10** | Day 22.5 | Day 22.8 | Day 22.9 |
| **The trades' shares** | 18.8–20.6% | 19.4–21.1% | 18.6–23.3% |
| **Today** | A party 6 days, a run 24 (the Forge's five slots) | About four weeks (tier2-world §11) | — |

## 12. Provides

| To | What |
|---|---|
| **weapon-progression.md** | **Recipes and sizes** (§6.1–§6.2): Weapon Gem 4 (2 ingots, 2 planks), Armor Fittings 2 low · 3 high, Accessory Setting 12 · 6 · 4 by the tier's slot count, the Branch Gem the G5 Weapon Gem in its tier's metal and wood (4); every grade's types by the ladder (§3.4). Make time one gather a refined item; gates Craft Lv 5g − 4. The Forge, the Armorer and the Charm Shop at about 120 an Uma in every tier |
| **extra-stats-progression.md** | **Planet Jewel 12** (D194's proposal, taken, §6.5), Moon Jewel 4 (EP18); the ladder's types at Planet III and V and Moon II and V (§6.2); two jewel kinds in every tier; **the Lapidary 120 · 140 · 160 an Uma** (+8 her moon), every class; the whole Uma **485 · 505 · 525**, inside a tenth. EP21's compensation is §14 here (PP19, PP20, PP24) |
| **class-progression.md** | The five trades by calling (§2.2); the calling pick moves only Forest · Armorer ↔ Monster Den · Lapidary; a class switch moves no job (CP30 kept) |
| **README §2** | §2.1's Professions bullet: ten professions in three kinds, ten places and forty slots in every tier, the ladder; §2.2's rows "Pairs a gathering profession 1 · 2 · 3", "Where an Uma works 2 · 3 · 3 places"; §2.3's totals **485 · 505 · 525** (493 · 513 · 533), hours **822 · 856 · 890** (835 · 869 · 903), jewels 20 · 120, 25 · 140, 30 · 160; the glossary's **pair, band, the ladder, secondary**, and **Speed Ticket · the grant** |
| **The compensation (README §9.4)** | §14: Craft Levels reset to 1, a Speed Ticket for every 30 minutes of work (EXP ÷ 60, per Uma into her world's wallet), gear and Star Gems folded in with a floor at their making time, stock kept and converted, upgrades' Laurels and items back, work settled with its minutes counted, the first launch's sheet (PP19, PP20, PP24, PP25) |
| **Pacing** | Per Uma 822 · 856 · 890 hours; a Tier 1 roster 1.27 maxed a day, a Tier 2 run 28.5 days, Tier 3 29.7 (§11) |
| **The engine and the save** | No battle engine change. Work: the trade gate in each job kind's `plan`; the ladder in the recipe tables; `OwnedUma.secondary` with Tier 2's toolbox. Save v27: the grant (§14.3), `TierWorld.grant` for the first launch's sheet; a place page's "Finish all" is uma-work's `finish` in a loop (PP25) |

## 13. Assumes

| From | What this doc assumes | If it differs |
|---|---|---|
| **[weapon-progression.md](weapon-progression.md)** (WP10, WP19, WP26, §6) | Its items and counts, adopted as written: Weapon Gem 30 · 27 · 27; **one Branch Gem line** at G5, 3 a tier from Tier 2, its branch picked when used (WP10); Armor Fittings 50, armor carrying all defense; **accessories in four families, all four in every tier** (base forms, then branches; *follow-up to the weapon review, 2026-10-24*), **1 · 2 · 3 untyped slots, one Accessory Setting a slot a grade** (10 · 20 · 30), any family and form; one item of a line fits any weapon, slot or type | **Agrees since the cross-check (2026-10-24):** WP §6 now shows this doc's recipes (the ladder, the Branch Gem at 4 in its tier's pair, PP8's names) and gear 365 in every tier. Before it, WP's draft had the first round's catalog, a Branch Gem of 9 and 365 · 380 · 380. **Re-checked after the owner's weapon review (2026-10-24):** no amount moves (WP §6.4's box): the accessory branches are forms opened by the slot's G5 Setting, no new item; the Branch Gem stays 3 a tier (a Dual's partner is fixed, so the gem carries only the branch); gear 365 holds. **Since D194 (2026-10-24):** WP §0 and §6.3 show the whole Uma 485 · 505 · 525 and jewels 20 · 25 · 30; WP27 and WP §11 point to this doc's compensation (§14) |
| **[extra-stats-progression.md](extra-stats-progression.md#11-jewels)** (approved, D194: EP17, EP18, EP23–EP26, §18.2) | **Two jewel kinds in every tier**, Planet and Moon I–V (any moon, picked when set); **20 · 25 · 30 jewels an Uma, every class** (5 Planet; Moon 15 · 20 · 25: three moons, + weapon moon 1, + weapon moon 2), her moon's 2; Planet 12 proposed (**taken**, §6.5), Moon 4; the Lapidary **120 · 140 · 160** | **Agrees:** §18.2's seven items applied here (2026-10-24): §3.5, §4, §6, §7–§9, §11, the pages. EP §11.3's whole Uma (485 · 505 · 525, 822 · 856 · 890 h) is this doc's. Nothing to reconcile |
| **class-progression.md** (CP29–CP30, CP38–CP41) | The calling and its pick name the trade; the class branch's reverse set is a second set of weapons, not more items an Uma | — |
| **variance.md** (U4) | One rule names her calling; today's split 17.0–22.6% | — |
| **README §9.3** | **Save v27 is the Tier 1 rework, v28 Tier 2's toolbox:** the code reached v26 with D190's party lead (2026-10-22). *The README and the other three docs say so since the cross-check (2026-10-24)* | Only the number moves |
| **The kit and uma-art** | Nothing new: `Place.frame` and eight pips exist; the ten frames and sixty icons exist (§3.3, §4.1) | — |
| **Tier 2's world** (tier2-world §11) | A run of twenty ascends together at Craft Lv 1 with the purse; about four weeks to max | — |
| **The work engine and the wallet** (uma-work `timeline.ts`; `pacing.ts`; `save.ts`) | A Speed Ticket takes 30 minutes off a running entry (`SPEED_TICKET_MS`, `TIME_TICKET_SPAN`); Finish costs ⌈remaining ÷ 30 min⌉; Craft EXP 2 a minute before the place's speed (`EXP_PER_MINUTE`); `wallet.timeTickets` per world | If a ticket's span changes before v27 ships, the grant's rate follows it: one ticket per span of work (EXP ÷ (2 × the span in minutes)) |
| **The save chain** (`migrations.ts`) | Saves from v10 migrate in order before v27: v16 kept every profession level's EXP on the longer curve, v21 (D144) folded two professions into the higher, v22 finished in-flight jobs; so v27 reads one `craft` an Uma | A save older than v21 is granted on the level D144 kept (PP19) |

## 14. Save impact

The Tier 1 rework's one migration, **save v27** ([README §9.3](README.md#93-save-v27-one-migration-every-world); v26 is
taken on main, §13), every tier world alike, computed from the save alone. *Changed for the owner's direction,
2026-10-24 (his weapon review, D193's note): the first draft paid every deleted item's raw items back in Tier 1's demand
mix. The owner: "I don't think the material refund is going to be our main approach; basically I want to reset all
farm/craft levels to 1, and then grant all tickets based on the amount of time it took to get all those levels." This
section designs it (PP19, PP20, PP24, PP25); drawn on [the grant's page](previews/prof-grant.html).*

### 14.1 The design in one paragraph

**Every Uma's Craft Level goes back to 1, and her world is paid one Speed Ticket for every 30 minutes of work she ever
did.** The game pays Craft EXP at 2 a minute of every job (gather, refine, craft, cut), so her lifetime Craft EXP is her
working time to the minute: **tickets = ⌈her Craft EXP ÷ 60⌉**. A Craft Lv 50 Uma gets **1,470**, the manual's 735
hours. The deleted gear and Star Gems are **folded into the same grant** (their making is already in those minutes),
with a floor at their own making time for pieces whose makers have left the world. The Warehouse is **kept and
converted**, upgrades give back **their Laurels and items**, running work **finishes into the Warehouse first**, so its
minutes count. A sheet at each world's first launch shows the grant, Uma by Uma, and what went.

### 14.2 What a Speed Ticket is today

| | Today (code and manual) |
|---|---|
| **What one does** | Takes **30 minutes** off a running job (`TIME_TICKET_SPAN`; uma-work's `SPEED_TICKET_MS`, 1,800,000 ms); "Finish" spends ⌈remaining ÷ 30 min⌉, never more than the job needs |
| **Where it lives** | Each tier world's wallet, `wallet.timeTickets`, the top bar's Speed chip; any slot of that world spends it |
| **Where it comes from** | The Exchange, 10 Laurels each (`TIME_TICKET_PRICE`); 5 an Uma in the ascension purse |
| **What it is worth in work** | 30 real minutes of one slot: at the rework's ×1.25 (every place, from day 1) 37.5 minutes of the manual's job time, **75 Craft EXP** |
| **Craft EXP** | 2 a minute of the job at her level, before the place's speed (`EXP_PER_MINUTE`); a level 1,425 + 15L, **Lv 50 = 88,200 EXP = 735 hours** of work (D96); past Lv 50 it banks in `craft.exp` |

### 14.3 The grant: rule, rate, who gets it (PP20, PP24)

**The rule, per Uma, per world:**

> **tickets = ⌈ (E(L) + exp) ÷ 60 ⌉**, where L and exp are her `craft` after the work is settled (§14.4), and
> E(L) = 1,425 (L − 1) + 7.5 L (L − 1) is the EXP her level took. Her bank past Lv 50 is in `exp` and counts.

- **The rate: one ticket per 30 minutes of the manual's job time** (60 EXP), "the time it took" as the game states it
  (a gather 54 minutes at Lv 1, Lv 50 in 735 hours). In the new places (×1.25) the same EXP takes a fifth less, so the
  grant re-levels her with a quarter to spare: the margin covers the ×1 days before today's facilities reached level 3
  (the save can't say which jobs ran at which speed), Finish's rounding (about half a ticket a job, some 4% of a
  re-level) and inputs bought at the Exchange, which no EXP records (PP24).
- **Computed per Uma, paid into her world's wallet.** Speed Tickets are a world's currency (each world its own wallet,
  D15), and any slot spends them, so the grant pools; the sheet lists each Uma's share. A Tier 2 world's Umas are paid
  in Tier 2's wallet. Each Uma's line rounds up, so the lines add up to the world's sum.
- **Every Uma in the world is counted,** working or not, in any class. An Uma who ascended left her old world's Craft
  Level at her ascension (today's rule, D15): only what the save still holds is counted.
- **A save older than v21** had two professions; the chain's v21 step (D144) kept the higher, and v27 reads that.

**Tickets by Craft Level** (her level reached, no bank):

| Craft Lv | 1 | 6 | 11 | 16 | 21 | 26 | 31 | 36 | 41 | 46 | 50 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Craft EXP | 0 | 7,350 | 15,075 | 23,175 | 31,650 | 40,500 | 49,725 | 59,325 | 69,300 | 79,650 | 88,200 |
| **Speed Tickets** (÷ 60, up) | 0 | **123** | **252** | **387** | **528** | **675** | **829** | **989** | **1,155** | **1,328** | **1,470** |
| Hours of work they stand for | 0 | 61 | 126 | 193 | 264 | 338 | 414 | 494 | 578 | 664 | 735 |
| Tickets to re-earn it in the new places (÷ 75) | 0 | 98 | 201 | 309 | 422 | 540 | 663 | 791 | 924 | 1,062 | 1,176 |

### 14.4 Everything else the migration does (PP19)

| Today in the save | After | In the grant |
|---|---|---|
| `work`: started entries, queues, Repeat | **Settled first, as save v22 did (SC3):** every started entry finishes into the Warehouse now, its outputs on their shelves and its Craft EXP paid; queued entries drop (they had taken nothing); Repeat forgets | The finished work's EXP, so no minute is lost |
| `OwnedUma.craft` (every Uma, every world) | **Reset to Craft Lv 1, 0 EXP** | Its EXP ÷ 60 (§14.3) |
| Crafted gear in stock, bound or in a locker; every Orb and support; Forge jobs' outputs | Deleted (WP27) | **Folded in:** its making is in the EXP; the floor below guards the rest |
| Star Gems in stock and set; the old maps; Lapidary cuts' outputs | Deleted (EP21) | The same |
| `items`: 80 raw, 80 refined | **Kept, converted one for one** by family and grade band (§14.7) | Nothing: the stock stays (its gathering is in the EXP too, deliberately not taken back) |
| `buildings`: up to 22 upgrades a world | Dropped: places have no levels (PP4) | **Their Laurels back** (150 for level 2, 500 more for level 3: up to 7,150 a world) and **their refined items** (up to 66), converted like stock |
| Weapon, Armor and Accessory Ranks; gear Manuals | Deleted (WP3) | Nothing: Uma Level is the new gate |
| `wallet.gearMarks` | Class Marks, one for one (WP27) | — |
| `wallet.timeTickets` | Kept | **+ the grant** |
| `targets` | Kept; their lines recompute from the new recipes | — |
| Place ids | **Kept:** `mine`, `forest`, `monster-den`, `workbench`, `forge`, `lapidary`. **Removed:** `ley-spring`, `crystal-cavern`, `quarry`, `meadow`, `fossil-dig`. **New:** `fields`, `fishery` (the farm's ids, gone since save v21), `armorer`, `charm-shop` | A link or remembered page to a removed id opens the Wilds page |
| `TierWorld.grant` | **New** (a world that had any Craft EXP or deleted piece): `{ tickets, floor, umas: { [outfitId]: { level, exp, tickets } }, deleted: { gear, gems, upgrades }, back: { laurels, items, stock }, seen }` | The first launch's sheet reads it (PP25) |
| `OwnedUma.secondary` | New in Tier 2+ worlds with Tier 2's toolbox (v28): empty until picked | — |

**Gear and Star Gems: folded in, with a floor.** Craft EXP pays every minute of every job, so a world's EXP already
holds the gathering, refining and making of every piece it deleted; a second grant for them would pay their making
twice. Two kinds of piece aren't in the world's EXP: **gear left in the stock by Umas who ascended** (their Craft EXP
left with them, today's rule) and **pieces made of items bought at the Exchange**. So the grant is **never less than
the deleted pieces' own making time**: each world sums every deleted piece at Craft Lv 25's manual times (a gear piece
203 minutes: two gathers, two refines and a craft of two gathers' time; a Star Gem 90 minutes for its cut plus 56 for
each refined item in it, 221 on average); a fully built Uma's 120 pieces and 100 gems are 776 hours, today's number.
If that sum, in tickets, is more than the Umas' grant, the difference is paid as one more line ("Pieces whose makers
have left this world"). In a world whose crafters are home it never binds (§14.5).

### 14.5 Worked examples

Three players at the update, each world worked out; the [grant's page](previews/prof-grant.html) draws them.

| | **A fresh player** (day 3) | **A mid player** (day 20) | **A fully built roster** (Tier 1 world) | (its Tier 2 world) |
|---|---|---|---|---|
| **Umas and Craft Levels** | 5 Umas, each worked nonstop at level-1 places: 8,640 EXP, Craft Lv 6 | 20: 8 at Lv 36 (each mid-job: +50 EXP once settled), 6 at Lv 26, 6 at Lv 11 | 40 at Lv 50; 10 of them kept working, 30,000 EXP banked each | One run's 20, at Lv 31 |
| **Speed Tickets, by Uma** | 144 each | 990 · 675 · 252 | 1,470 (30 Umas) · 1,970 (10) | 829 each |
| **The grant** | **720** (360 h) | **13,482** (6,741 h) | **63,800** (31,900 h) | **16,580** (8,290 h) |
| Deleted | 24 gear pieces (G1–G2), 10 Star Gems | 576 pieces (8 Umas at G6), 320 Star Gems | 25 Umas fully built: 3,000 pieces, 2,500 Star Gems; 2,400 pieces left in stock by an earlier run's twenty | 1,200 pieces (G5), 600 Star Gems |
| Their making time · the floor | 118 h · 237 tickets: doesn't bind | 3,133 h · 6,266: doesn't bind | 27,524 h · 55,049: doesn't bind | 6,281 h · 12,562: doesn't bind |
| Upgrades back | — | 8 at level 2, 4 at level 3: **3,800 Laurels**, 40 refined items | 11 at level 3: **7,150 Laurels**, 66 refined items | 6 at level 2: 900 Laurels, 12 items |
| Stock, converted | 45 items | 600 | 2,000 | 300 |
| **What the grant buys** | Re-levels all five to Lv 6 in 576 tickets; 144 left for other work | Re-levels all twenty in 10,780; 2,702 left (1,351 h) | Re-levels all forty to Lv 50 in **47,040** (588 h each); the jobs on the way make about **17,350 refined items, 36 maxed Umas of the new Tier 1** if the trades are worked evenly; **16,760** left (8,380 h) | Re-levels the twenty in 13,260; 3,320 left |
| At the Exchange's price (10 Laurels) | 7,200 Laurels | 134,820 | 638,000 | 165,800 |

- **The fully built roster comes out ahead in items:** it had 25 maxed Umas (11,800 refined in gear and maps) and
  2,000 items in stock; the grant, spent, re-levels every crafter and makes about 36 Umas' worth of the new Tier 1 on
  the way. Its crafters' minutes also went into stock, sales and upgrades, and the rate counts the manual's minutes
  (PP24): **time is returned whole; what he builds with it is his.**
- **A brand-new account** (or a save with no Craft EXP and nothing crafted) gets no grant and no sheet; new saves start
  at v27.

**The floor at work:** a Tier 1 world two Rift runs on, its forty best Umas ascended: 20 Umas left at Craft Lv 20
(499 tickets each, **9,980**), and the stock holding the ascended forty's gear, **4,800 pieces** (their maps left with
them). The pieces' making is 16,266 hours, **32,533 tickets**, so the world is paid 32,533: its Umas' 9,980 and
**+22,553 for pieces whose makers have left**, with 7,150 Laurels from its upgrades.

### 14.6 The first launch (PP25)

- **When:** the first time each world opens after the update (Tier 1's at launch; a Tier 2 world's when the player
  switches to it), once. It reads the world's `grant`; "Got it" sets `seen`.
- **The sheet "The Wilds are rebuilt"** (the kit's sheet, as the Tier sheet; no kit change), for the fully built
  roster's Tier 1:
  - *Lead:* "Ten professions, each in its own place. Every Uma starts again at Craft Lv 1, and the time they worked
    comes back as Speed Tickets."
  - *The grant, large:* **"+63,800 Speed Tickets"**, under it "31,900 hours of work: every gather, refine, craft and cut
    your Umas did".
  - *What went:* "5,400 gear pieces · 2,500 Star Gems · 22 facility upgrades. Their making is in those hours."
  - *What came back:* "7,150 Laurels · 66 refined items · your Warehouse's 2,000 items, now the new materials (Ores →
    Copper and Iron …)".
  - *What stays:* "Uma Levels, classes and Class Ranks, Laurels, every ticket you had".
  - *By Uma:* her face, name and trade, "Craft Lv 50 → 1 · 1,470", sorted by tickets; a banked Uma "1,970 (30,000 EXP
    past Lv 50)"; the floor's line when it pays.
  - *Footer:* "A ticket takes 30 minutes off a running job: Finish on a job, or Finish all on a place." Buttons
    **To the Wilds** and **Later**.
- **Afterwards:** the Account page keeps a row, "The Tier rework's grant · 63,800 Speed Tickets", that opens the sheet
  again. The top bar's Speed chip shows the new count, formatted as Laurels are (63,800): no kit change.
- **Finish all on a place** (recommended with it): a place page's header shows "Finish all · n Speed Tickets" when two
  or more of its slots are running; one tap finishes each at ⌈remaining ÷ 30 min⌉, queues starting at once, after a
  confirm naming the total. It is uma-work's `finish` in a loop on the game's place page (`FacilityPage.tsx`): no
  engine or kit change. A world-wide "Finish all" on the Wilds map would be the kit's Hub, a "Both apps:" request; not
  proposed.
- **No expiry, no forced spending:** the tickets sit in the wallet like bought ones; jobs also run in real time.

### 14.7 The stock conversion (PR14 kept)

| Today's family (site) | Becomes | Grades 1–5 → | Grades 6–10 → |
|---|---|---|---|
| Ores (Mine), Stones (Quarry) | Mining | Copper Ore · Copper Ingot | Iron Ore · Iron Ingot |
| Woods (Forest) | Wood Chopping | Pine Log · Pine Plank | Oak Log · Oak Plank |
| Fibers (Meadow) | Farming | Flax · Linen | Cotton · Cotton Cloth |
| Essences (Ley Spring), Bones & Horns (Fossil Dig) | Fishing | Seashell · Shell Carving | Ammonite · Ammonite Carving |
| Crystals (Crystal Cavern), Hides & Scales (Monster Den) | Hunting | Quartz · Cut Quartz | Garnet · Cut Garnet |

Of today's 160 ids, 20 stay as Tier 1's types and 40 come back as Tiers 2 and 3's; the other 100 leave the code
(old-save fixtures keep them, as D144's did) and uma-art keeps every icon. A Tier 2 world's old Silver Ore converts to
Copper Ore like any other: its Tier 2 pair starts empty. Raw stays raw and refined stays refined, so nothing is lost.

### 14.8 The approaches weighed

| Approach | A Craft Lv 50 Uma | Why not |
|---|---|---|
| **Craft Levels to 1; a Speed Ticket per 30 minutes of the manual's time (EXP ÷ 60); gear and Star Gems folded in, with a floor at their making time** (recommended) | **1,470 tickets** | — |
| The same at the new places' speed (EXP ÷ 75) | 1,176 | Exact on paper, short in play: Finish's rounding (about 4% of a re-level), the ×1 days before a facility's level 3, bought inputs |
| Tickets for the levels, plus a second grant for deleted gear and Star Gems by their making time | 1,470 + up to 1,552 (a fully built Uma's 776 h) | Pays their making twice: it is already in her EXP. The floor keeps the one case where it isn't |
| Tickets for the levels only, no floor | 1,470 | A world whose crafters ascended loses their gear left in its stock with nothing back |
| Stock converted into tickets too, the Warehouse emptied | 1,470, the stock gone | Takes back items the new recipes use as they are; the overlap is small (a fully built world's 2,000 items are about 6% of its 31,900 hours) |
| Raw items back in Tier 1's demand mix (the first draft) | 472 raw items for a fully built Uma | Set aside by the owner (2026-10-24) |
| Keep Craft Levels | — | Set aside by the owner: every world starts the new trades on one clock |

## 15. Pacing

**Unchanged:** Craft Level's curve (D96), 2 EXP a job-minute, the gate 5g − 4, gather minutes, processing at a
quarter, batches, queues.

- **Per Uma:** 822 hours at Lv 25's speed in Tier 1 against today's 776 (+6%), 856 in Tier 2 (+4.1% on Tier 1), 890 in
  Tier 3 (+8.2%): every tier inside the tenth. Her moon adds 13 hours a tier.
- **Craft Level comes about two days sooner:** every slot works ×1.25 from day 1; today's facilities reach level 3
  about day 11. Grade 6 on day 11.2 (today 13.5), grade 10 on day 22.1 (24.3), Lv 50 on day 24.5 (26.7) (§5.3).
- **Tier 1 rosters gear faster than today:** a run of twenty in 15.8 days of volume against 24, because four making
  places carry what one Forge did. Craft Level still opens grade 10 on day 22, so the fighting party's pace is today's.
- **Tiers 2 and 3:** a run of twenty in 28.5 and 29.7 days, within two days of today's four weeks; the secondary keeps
  any split there (§8.5, §9.4).
- **The update itself** (§14): every Craft Level restarts at 1, so an existing world reopens its grades on the new
  clock (G10 on day 22 of nonstop work), **unless the player spends the grant**: its tickets stand for every minute his
  Umas worked, a quarter more than re-levelling them in the new places takes. A fully built roster re-levels all forty
  at once if it likes (47,040 of its 63,800 tickets), making about 36 maxed Umas' items on the way.
- **Laurels:** no upgrade costs (up to 7,150 a world today, returned at the update); the Exchange × tier; the
  secondary's fee × tier.
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
| **PP10** Recipes | **One fixed set an item, the same amounts in every tier:** Weapon Gem 4; Armor Fittings 2 · 3; Accessory Setting 12 · 6 · 4 by slot count; **Planet Jewel 12** (three each of a cut stone, a plank, a cloth and a carving or infusion; D194's proposal, taken, §6.5); Moon Jewel 4 (EP18); **the Branch Gem the G5 Weapon Gem in its tier's pair (4)**; two jewel kinds in every tier, every jewel by the ladder. Each making place about a quarter of an Uma's refined items, each gathering profession about a fifth (PR8 kept, changed for the Branch Gem). *Changed for D194 (Extra Stats), 2026-10-24: the Planet Jewel was 8 and a Halo Jewel 5; the Halo Jewels retire* | Planet 8 (Tier 1 465, the Lapidary 100, the magical trade 17.2%); Planet 16 (Tier 1 505; 24.5% in Tier 3); a Moon Jewel of 5 (25.2% in Tier 3); the first round's and WP26's Branch Gem (9); rotating pairs (D139) | Tier 1 lands back on the approved 120 · 485 · 822 h; every trade 18.6–23.3% in every tier; anyone can say what an item takes; the branch costs a grade's worth in the tier's materials |
| **PP11** SB1 and amounts | **Counts and amounts don't scale with the tier;** stat values do. One Uma **485 · 505 · 525** refined (+4.1%, +8.2%); a run 28.5 · 29.7 days. *New; numbers refreshed for D194, 2026-10-24 (were 503 · 521, 28.4 · 29.4)* | Amounts × 1.8 and × 2.6 (909 · 1,365 refined; runs of 51 and 77 days); times × tier (the same) | The owner keeps today's rate; SB1 is about a stat's share, not time |
| **PP12** Make time | **One gather's time a refined item in the piece** (PR9 kept) | Today's flat two gathers | Today's rule for two-item recipes; bigger pieces take longer, so trades stay even |
| **PP13** Gates and Craft Level | A low type at Craft Lv 1, a high type at Lv 26, **in every pair and tier**; grade g made at Lv 5g − 4; **Craft Level restarts at Lv 1 in each tier**, as today | Later gates for a tier's pairs; Craft Level carried across tiers | No new gate to learn; the tier's own clock is today's (tier2-world §11) |
| **PP14** The secondary | **From Tier 2, any one of the other eight professions; she does its base work** (base types; grades made of base types). **Tier 3: + its Tier 2 work.** Free the first time a tier; a change costs **1,000 Laurels × the tier**, refused while she works there. *Changed from PR11: gathering only, a flat 1,000* | Gathering only (PR11: a Tier 2 run with two Mages takes 40 days, with one 80); free changes; set by rule; a second full trade | The owner's "another profession's base items"; making is where a thin trade binds: with it every split maxes a run in 28.5 days (Tier 3: 29.7) |
| **PP15** The main trade's tier | **The tier's own pair, and every grade made of it, stay her main trade's** (a fifth of the work); Tier 3's secondary reaches Tier 2's. *New* | No reserve (secondaries do everything); the main reserves every making job | The owner's "the main one reaches its higher tiers"; a fifth keeps it real without letting a thin trade stall |
| **PP16** The open shop | **A world with no Uma of a trade opens that trade's places to every Uma, every job,** until one arrives. *New* | Nothing (a world without Mages never makes a jewel); the Exchange selling made items | A Tier 2 run's split is incidental; the fallback costs nothing when trades are filled |
| **PP17** The Exchange | **Raw types only, by pair:** base low after the tier's first win, base high after continent 3; every newer pair low after continent 2, high after continent 4; **low 30, high 80 Laurels × the tier**; selling × the tier. *Changed from PR13: × tier* | Today's two grades a continent; flat prices | Fights pay × tier (D170): a raw item stays two fights a base hour (D65) in every tier |
| **PP18** Today's second-profession proposal (Q13) | **Replaced:** no Lore Level, Relics, Glyphs or Tier 2 sites (PR12 kept) | Lore as an eleventh profession | The trades grow a tier at a time with no second level |
| **PP19** Old saves (save v27) | **Work settled first, as v22 did:** every started entry finishes into the Warehouse with its Craft EXP, queues drop, Repeat forgets. **Every Uma's Craft Level to 1** (every world; a save older than v21 read as D144 folded it). **Stock kept, converted one for one** by family and grade band (§14.7); **upgrades: their Laurels and refined items back**; ranks and gear Manuals deleted, Gear Marks to Class Marks; six place ids kept, five removed, four new; `TierWorld.grant` recorded. *Changed for the owner's direction, 2026-10-24: Craft Level was kept, work recalled* | Keep Craft Levels (the owner set it aside); recall running work (loses its minutes); empty the Warehouse into tickets (takes back what the new recipes use) | The owner's direction; one clock for every world; nothing in the Warehouse is lost and no minute of work goes unpaid |
| **PP20** The compensation | **Speed Tickets for the time:** each Uma's lifetime Craft EXP (her level's and her bank's) in tickets at PP24's rate, **computed per Uma, paid into her world's wallet**. **Deleted gear and Star Gems are folded in** (their making is in the EXP), with **a floor per world at their own making time** (Craft Lv 25's manual times: a gear piece 203 minutes, a Star Gem 221 on average) for pieces whose makers left or were bought in. No raw items back. *Changed for the owner's direction, 2026-10-24: was every deleted item's raw count back in Tier 1's demand mix* | A second grant for gear and gems by making time (pays it twice); no floor (a world whose crafters ascended loses their gear for nothing); raw items in Tier 1's mix (the first draft); per-Uma tickets spendable only on her jobs (a new currency for no gain) | The owner: "reset all farm/craft levels to 1, and then grant all tickets based on the amount of time it took"; EXP is the save's exact record of that time |
| **PP21** The Stable | A **Trade** filter, on locked outfits too, with each trade's head count; the calling card's counts (CP29) (PR15 kept) | None | New unlocks and Pace picks fill a short trade |
| **PP22** Pages, pickers, targets | Each place is today's facility page; its picker lists her trade first, then secondaries, then the rest greyed with the reason; grade chips coloured by their material's tier; the targets strip lists what targets need from that place | A Wilds-wide crafting screen | One place, one job, one strip, as today |
| **PP23** Promotion | Materials and made items stay in the old world (each world its own Warehouse, D15); she arrives at Craft Lv 1 with no secondary; the new world's places and slots are every tier's | Carry materials; carry the secondary | Each tier restarts on its own clock; the old world's Umas still use what's left |
| **PP24** The grant's rate | **One Speed Ticket for every 30 minutes of the manual's job time: ⌈Craft EXP ÷ 60⌉ an Uma**, rounded up per Uma; a Craft Lv 50 Uma 1,470 (735 h). Read after the work is settled; every Uma the world holds. *New, 2026-10-24* | EXP ÷ 75, the new places' ×1.25 (1,176 at Lv 50: exact on paper, short in play by Finish's rounding, the ×1 days and bought inputs); a flat grant by level band | "The time it took", as the game states it (2 EXP a minute, Lv 50 in 735 hours); a quarter over a re-level, never short |
| **PP25** The first launch | **A sheet once per world, "The Wilds are rebuilt":** the grant large, its hours, what went, what came back, what stays, each Uma's line ("Craft Lv 50 → 1 · 1,470"), the floor's line when it pays; the Account page keeps a row that reopens it; **"Finish all" on a place page** (uma-work's `finish` in a loop). No kit change, no expiry. *New, 2026-10-24* | A notification only; tickets with no explanation; a world-wide Finish all on the Hub (a kit change) | The player sees what the update took and what it gave, once, in plain numbers; a big grant needs a quicker way to spend it |

**The first round's calls, mapped:**

| Old | Now | | Old | Now |
|---|---|---|---|---|
| PR1 the calling ties the trade | PP2 (kept) | | PR9 make time | PP12 (kept) |
| PR2 one trade, one Craft Level | PP2 (kept) | | PR10 a pair a tier, new pieces within a tenth | **PP9, PP11** (the ladder; amounts fixed) |
| PR3 the pairings | PP3 (kept) | | PR11 the secondary | **PP14, PP15** (any profession; the main's tier) |
| PR4 one building, four slots | PP4 (kept) | | PR12 Lore replaced | PP18 (kept) |
| PR5 the map | PP5 (kept) | | PR13 the Exchange | **PP17** (× tier) |
| PR6 reuse only | PP6 (kept) | | PR14 old saves | **PP19, PP20** (Craft Levels to 1, tickets for time), **PP24, PP25** |
| PR7 two types a profession | PP7 (kept), **PP8** (the order) | | PR15 the Trade filter | PP21 (kept) |
| PR8 one fixed recipe an item | **PP10** (the Branch Gem at 4; the Planet Jewel at 12) | | — | **PP1, PP13, PP16, PP22, PP23, PP24, PP25** (new) |

In bold, the calls this doc changed or added. **Changed for D194 (Extra Stats), 2026-10-24:** PP10 (the Planet Jewel at
12, no Halo Jewel), PP11 (numbers). **Changed for the owner's compensation direction, 2026-10-24:** PP19, PP20; **new:**
PP24, PP25.
