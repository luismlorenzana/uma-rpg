# Professions in Tiers 2 and 3: the five lines, the fifteen places and the secondary

> **Status: drafting, 2026-11-04. Nothing here is built.** One of the seven Tier 2 and Tier 3 docs
> ([the brief](README.md)): the farm's approved drafts, [profession-progression.md](../tier-rework/profession-progression.md)
> (PP1–PP25, D195) and [farm-by-line.md](../tier-rework/farm-by-line.md) (FL1–FL34, D224–D233), carried onto **Tier 1 as
> it is built and live** (engine v21, save v36): five lines, each a trio of places, fifteen places, every line equal
> (D264). Calls are **T2P1–T2P26**, each with a recommendation. No open questions. The manual
> ([materials](../../game/materials.md), [loops](../../game/loops.md#craft-level), [sections](../../game/sections.md#wilds))
> is the game as it plays.
>
> **Numbers come from the code:** `packages/domain/src/economy/pacing.ts` (steps, sizes, Craft Level),
> `items/made-v4.ts` (recipes), `economy/professions-v4.sim.ts` (the ledger), `save/exchange.ts` (prices), read through a
> throwaway table test that was deleted before commit. **Names:** this doc coins no place or material. Every label it uses
> on a page or mock ("Secondary", "Her trade", "Main trade only", "Another trade", "Suggested", "Open shop" and the rest)
> was checked against every string of the master-data release (`uma-platform/content/release/data`, case-insensitive
> exact match): none matches. Umas are shown by role only.
>
> **Pages** (desktop, light and dark): [the farm, Tier 1 → 2 → 3](previews/professions-tiers.html) ·
> [every step, item and rank, timed](previews/professions-times.html) ·
> [demand against supply](previews/professions-demand.html) · [the secondary line](previews/professions-secondary.html).

**Words used here.** *A line* is one material and its trio of places (Metal, Vegetables, Wood, Fish, Stone). *Her
trade* is the line her calling names. *A rank* is one grade of everything on D264's yardstick: two Umas, one on three
Arms and one on three Tomes. *Slot time* is what a job takes in a slot, the places' ×1.25 applied (what the job sheet
shows). *Job-hours* are the ledger's unit, before the ×1.25: one slot hour is 1.25 job-hours.

## 1. At a glance

**Tiers 2 and 3 keep Tier 1's farm whole and add one thing: a secondary line.** The same fifty material pairs, the same
recipes, steps and sizes, the same fifteen places, every line equal. From Tier 2 an Uma may also work one other line's
three places at G1–G8; G9 and G10 stay her trade's. A tier's new gear and map pieces (T2G, T2E) are priced so every line
still carries the same work: the **five-line rule** (T2P1).

| | Tier 1 (live) | Tier 2 | Tier 3 |
|---|---|---|---|
| **Lines · places · slots** | 5 · 15 · 60 (four a place, ×1.25, no upgrades) | The same | The same |
| **Materials** | 50 pairs, G1–G10 a line (100 ids), the same in every world (FL8) | The same 100 | The same 100 |
| **Made items** | Arms Gem, Tome Ink, Armor Fittings, Accessory Setting G1–G10; Planet and Moon Jewels I–V | The same; weapon and accessory branches take no item (T2P5, T2P6) | The same |
| **Recipes** (refined of the item's grade) | Arms Gem 10 · Tome Ink 10 · Fittings 3 · Setting 5 · each jewel 5 | The same | The same |
| **One step** (slot time) | 19m at Craft Lv 1 → 16m at Lv 25 → 13m at Lv 50 | The same | The same |
| **Every forge's longest job** (30 steps) | 9h 36m · 8h 02m · 6h 24m at Craft Lv 1 · 25 · 50 (D273) | The same | The same |
| **Craft Level** | Lv 1–50, 88,200 EXP, 24.5 days nonstop; grade g at Lv 5g − 4 | **Restarts at Lv 1** on Ascend | Restarts at Lv 1 |
| **Where an Uma works** | Her trade's three places | **+ a secondary line's three places, G1–G8** | The same |
| **A rank** | 30 refined a line · **8h 02m a place** at Craft Lv 25 | The same | The same |
| **A maxed Uma** (eleven worn slots, the whole map) | 140 items · 750 refined · 753 job-hours (602 slot-hours) | The same | The same |
| **A full window** (+ the Weapons track's two more weapons) | 160 items · 950 refined · 954 job-hours (763 slot-hours) | The same | The same |
| **Exchange, raw G1–G5 · G6–G10** | 20 · 53 Laurels | 40 · 106 | 60 · 159 |
| **Twenty Umas' full windows** (today's callings' split) | 55.8 days (no secondary) | **31.8 days** with secondaries | 31.8 days |
| **Forty Umas, full windows a day** | 0.84 (Metal and Vegetables bind) | **1.26** with secondaries | 1.26 |
| **New art** | — | None | None |

## 2. Tier 1 as built

The baseline. Every number is live (engine v21, save v36) and owned by the manual page linked; nothing here is
redesigned.

### 2.1 Five lines, fifteen places

Each line is worked at three places in a row: its **gathering place** gathers raw items, its **workbench** processes them
one for one, and its **making place** makes the line's item from refined ones (D230, FL25). No place touches another
line. The Wilds draw them in five rows of three, gathering on the left, the workbench on the trunk road, making on the
right ([sections](../../game/sections.md#wilds)).

| Line | Her trade (calling) | Outfits of 272 | Gather | Process | Make | Its item raises |
|---|---|---|---|---|---|---|
| Metal | Warrior | 48 | Mine (Mining) | Mine Workbench (Smelting) | Weapon Forge (Arms Crafting) | An Arms weapon: Arms Gem |
| Vegetables | Healer | 46 | Fields (Farming) | Fields Workbench (Prepping) | Tome Forge (Tome Crafting) | A Tome: Tome Ink |
| Wood | Spellblade | 72 | Forest (Wood Chopping) | Forest Workbench (Sawing) | Armorer (Armor Crafting) | An armor slot: Armor Fittings |
| Fish | Summoner | 34 | Fishery (Fishing) | Fishery Workbench (Filleting) | Charm Forge (Accessory Crafting) | An accessory slot: Accessory Setting |
| Stone | Mage | 72 | Monster Den (Hunting) | Den Workbench (Stonecutting) | Lapidary (Jewel Crafting) | An Extra Stats node: Planet or Moon Jewel |

- **Her calling names her trade** (CV19, CV20): her Tier 0 by running style, never her active class, so a class switch or a
  promotion moves no job. Head counts are the release's callings ([reclass](../reclass/reclass.md) §1).
- **The open shop** (PP16, FL27): a line whose trade has no Uma in the world takes everyone at its three places until one
  arrives.
- **Places have no levels:** four slots at ×1.25 from day one (PP4).

### 2.2 Materials, recipes and steps

- **Ten grades a line** (FL5), raw and refined, from one uma-art family each: ores → ingots, vegetables → cuts, logs →
  planks, fish → fillets, stones → cut stones ([materials](../../game/materials.md#items-by-line)). Grade g opens at
  **Craft Lv 5g − 4** to gather, to process and to make (FL6), and is worn at Uma Lv 5g − 4.
- **A grade-g item takes grade-g refined items only** (FL7); a jewel's grade is its node's (Planet n is 2n − 1, a moon's
  node n is 2n).
- **Every step is equal** (FL28, D264): a gather, a process, and each refined item in a make, 24 minutes at Craft Lv 1
  falling evenly to 16 at Lv 50, before the place's ×1.25.

| Made item | Recipe | Make (steps) | The whole chain (steps) | Chain, slot time at Craft Lv 1 · 25 · 50 |
|---|---|---|---|---|
| Arms Gem G1–G10 | 10 Ingots | 10 | 30 | 9h 36m · 8h 02m · 6h 24m |
| Tome Ink G1–G10 | 10 vegetable cuts | 10 | 30 | 9h 36m · 8h 02m · 6h 24m |
| Armor Fittings G1–G10 | 3 Planks | 3 | 9 | 2h 53m · 2h 25m · 1h 55m |
| Accessory Setting G1–G10 | 5 Fillets | 5 | 15 | 4h 48m · 4h 01m · 3h 12m |
| Planet Jewel I–V | 5 cut stones | 5 | 15 | 4h 48m · 4h 01m · 3h 12m |
| Moon Jewel I–V | 5 cut stones | 5 | 15 | 4h 48m · 4h 01m · 3h 12m |
| *One refined item* | 1 raw | — | 3 | 58m · 48m · 38m |
| *One step* | — | — | 1 | 19m · 16m · 13m |

The chain spans three places: a third of it at each, the same at every grade.

### 2.3 Jobs, sizes and Craft Level

| Rule | Live value |
|---|---|
| **Sizes** (D233, D264, D273) | Gather or process ×1, ×2, ×3, ×5, ×10, ×15, ×20, ×30; a make the sizes up to 30 steps: Armor Fittings to ×10, a Setting or a jewel ×6, an Arms Gem or Tome Ink ×3 |
| **Every forge's longest job** | 30 steps: 9h 36m at Craft Lv 1, **8h 02m at Lv 25**, 6h 24m at Lv 50 |
| **Queue** | Up to three jobs behind the running one, same Uma, same place |
| **Craft EXP** | 2 a minute of the job at her level, before the ×1.25 |
| **Craft Level** | 1,425 + 15L EXP a level; 88,200 to Lv 50 (735 job-hours, **24.5 days nonstop** at ×1.25); G10 opens at Lv 46 on day 22.1 |
| **Speed Ticket** | 30 minutes off a running job; 10 Laurels; 5 with every Uma who ascends into a world |
| **Her window** (D283, D289) | Craft I–V at Craft Lv 10 · 20 · 30 · 40 · 50 in every tier; Craft V stays at Lv 50 |

Sizes, each with its slot time at Craft Lv 25 (the sheet shows the time of the Uma picked):

| Steps an item | Sizes and slot time at Craft Lv 25 |
|---|---|
| 1 (gather, process) | ×1 16m · ×2 32m · ×3 48m · ×5 1h 20m · ×10 2h 41m · ×15 4h 01m · ×20 5h 21m · ×30 **8h 02m** |
| 3 (Armor Fittings) | ×1 48m · ×2 1h 36m · ×3 2h 25m · ×5 4h 01m · ×10 **8h 02m** |
| 5 (Setting, jewel) | ×1 1h 20m · ×2 2h 41m · ×3 4h 01m · ×5 6h 42m · ×6 **8h 02m** |
| 10 (Arms Gem, Tome Ink) | ×1 2h 41m · ×2 5h 21m · ×3 **8h 02m** |

### 2.4 Every line equal (D264)

**One rank of everything on two Umas, one on three Arms and one on three Tomes, is 30 refined items on each of the five
lines**, so every place spends the same hours:

| Line | Uma on 3 Arms | Uma on 3 Tomes | Both | A place, slot time at Craft Lv 1 · 25 · 50 |
|---|---|---|---|---|
| Metal: 3 Arms Gems × 10 | 30 | 0 | 30 | 9h 36m · 8h 02m · 6h 24m |
| Vegetables: 3 Tome Ink × 10 | 0 | 30 | 30 | the same |
| Wood: 5 Armor Fittings × 3 | 15 | 15 | 30 | the same |
| Fish: 3 Accessory Settings × 5 | 15 | 15 | 30 | the same |
| Stone: 3 jewels × 5 | 15 | 15 | 30 | the same |

A rank at the Craft Level that opens its grade, slot time a place (every place equal):

| Grade (Craft Lv) | G1 (1) | G2 (6) | G3 (11) | G4 (16) | G5 (21) | G6 (26) | G7 (31) | G8 (36) | G9 (41) | G10 (46) |
|---|---|---|---|---|---|---|---|---|---|---|
| A rank, a place | 9h 36m | 9h 16m | 8h 57m | 8h 37m | 8h 18m | 7h 58m | 7h 38m | 7h 19m | 6h 59m | 6h 40m |

**A maxed Uma** (her active class's three weapons, five armor slots and three accessory slots at G10, and the whole
map): 140 made items, 750 refined, **753.1 job-hours** (602 slot-hours), 150 refined and 50.2 job-hours at every one of the
fifteen places; each place's four slots make **2.39 maxed Umas a day** (the ledger).

| Her need | Items | Each item's chain (slot time, Lv 25) | Refined | Slot-hours |
|---|---|---|---|---|
| Three weapons, G1–G10 | 30 | 8h 02m | 300 (Metal or Vegetables, by channel) | 241.0 |
| Five armor slots | 50 | 2h 25m | 150 (Wood) | 120.5 |
| Three accessory slots | 30 | 4h 01m | 150 (Fish) | 120.5 |
| Planet I–V, three jewels a node | 15 | 4h 01m | 75 (Stone) | 60.2 |
| Three moons I–V, a jewel a node | 15 | 4h 01m | 75 (Stone) | 60.2 |
| **In all** | **140** | | **750** | **602.4** (753.1 job-hours) |

### 2.5 What Tier 1's numbers leave out

Two facts the live ledger doesn't show. Neither is redesigned here; both shape Tiers 2 and 3.

1. **A full window asks two more weapons.** Ascend needs a full window (D283), and its Weapons track asks **five weapon
   kinds at G10** (D289), two more than her three. That is 20 more made items and 200 more refined on the weapon lines:
   **950 refined, 954 job-hours** an Uma. Over a roster split evenly between Arms and Tomes, **Metal and Vegetables carry
   250 an Uma, the other three lines 150**: the weapon lines' places are 5/3 as busy (83.7 job-hours a place against
   50.2; 1.43 full windows a day a place against 2.39).
2. **The ledger's roster is D220's.** `professions-v4.sim.ts` models forty Umas as 9 · 8 · 9 · 7 · 7 by the old callings.
   Classes v3 moved 101 outfits (D240): today's callings put forty at **7 · 7 · 11 · 5 · 10** (Metal · Vegetables · Wood ·
   Fish · Stone) and twenty at 4 · 3 · 5 · 3 · 5.

| Tier 1 roster (no secondary) | Maxed Umas a day | Binds | Full windows a day | Binds |
|---|---|---|---|---|
| Forty, the ledger's split (9 · 9 · 8 · 7 · 7) | 1.39 | Fish's 7 | 1.08 | Metal's 9 |
| **Forty, today's callings (7 · 7 · 11 · 5 · 10)** | **1.00** | Fish's 5 | **0.84** | Metal's and Vegetables' 7 |
| Twenty, today's callings (4 · 3 · 5 · 3 · 5) | 0.60 | Vegetables' and Fish's 3 | 0.36 | Vegetables' 3 |

So Tier 1's equal lines hold for the maxed Uma and for every place, and Tier 1's thin trades (Fish by head count, Metal
and Vegetables by the full window's weapons) set a roster's pace. Tiers 2 and 3 answer both with the secondary (§4.4).

## 3. The approved drafts, call by call

Every call of the two drafts, one row each. *Kept* stands as written on today's Tier 1; *Kept, changed* stands with a
change Tier 1 forced; *Superseded* was replaced by a Tier 1 decision; *Broken* was written for a Tier 1 that no longer
exists and a new call here fixes it. The archived [second-profession.md](../../archive/design/second-profession.md)
(V1–V8, Lore Level) was already replaced by PP18 (D195); nothing of it carries.

### 3.1 profession-progression.md (PP1–PP25)

| Call | What it said | Status | Why, and where it lands |
|---|---|---|---|
| PP1 | Three kinds of work: five gathering, one processing, four making professions | **Superseded** | D224, D230: fifteen professions, five of each kind, one place each (FL25, FL26) |
| PP2 | Her trade is her calling's pair, one Craft Level; the calling pick sets it | **Kept, changed** | D230, D240: her calling's trio, one Craft Level; the calling by running style, no pick (CV19, CV20) |
| PP3 | The pairings (Physical Mine · Forge … Magical Monster Den · Lapidary) | **Superseded** | D230, D240: Warrior Metal, Healer Vegetables, Spellblade Wood, Summoner Fish, Mage Stone |
| PP4 | One building a profession, four slots, ×1.25, no upgrades, in every tier | **Kept, changed** | D230: fifteen places, sixty slots; still in every tier (T2P11) |
| PP5 | The same map in every tier, the tier's look; a tier adds type icons | **Kept, changed** | D230, D233: five rows of three; with no tier pairs a tier adds no icons (T2P11) |
| PP6 | Reuse only: ten frames, sixty icons | **Kept, changed** | D230: fifteen frames since uma-art 2.14.0 (H113); Tiers 2 and 3 draw nothing new (T2P11) |
| PP7 | Five lines, a pair a tier: 2 · 4 · 6 types a gathering profession | **Superseded** | D224: ten grades a line (FL5), the same fifty pairs in every world (FL8; T2P3) |
| PP8 | One rule for every line's pairs (grades 1, 3 · 6, 8 · 9, 10) | **Superseded** | D224 (FL5): every line uses all ten grades |
| PP9 | The ladder: Tier 2's pair at G5 and G10, Tier 3's at G5, G10 and G4, G9 | **Superseded** | D224 (FL7, FL8): a grade is the same item in every world (T2P3) |
| PP10 | Recipes: Weapon Gem 4, Fittings 2 · 3, Setting 12 · 6 · 4, Planet 12, Moon 4, Branch Gem 4 | **Superseded** | D224 (FL9), then D264: 10 · 10 · 3 · 5 · 5 · 5 in every tier (T2P4); the branch item, T2P5 |
| PP11 | Amounts don't scale with the tier; stat values do | **Kept, changed** | D264's numbers: 750 refined, 753 job-hours in every tier (T2P2) |
| PP12 | Make time: one gather a refined item | **Kept, changed** | D230 (FL28), D264: one step a refined item, 24 → 16 minutes (T2P8) |
| PP13 | Low type at Craft Lv 1, high at 26; grade g at 5g − 4; Craft Level restarts each tier | **Kept, changed** | D224 (FL6): every grade g at Craft Lv 5g − 4; the restart stands (T2P9) |
| PP14 | The secondary: from Tier 2, one of the other eight professions, its base work; Tier 3 its Tier 2 work; a change 1,000 Laurels × tier | **Broken** | "Base work" was the base material pair, and the eight were two of ten professions a trade; neither exists. Fixed by T2P12–T2P15, T2P23 |
| PP15 | The tier's own pair stays her main trade's, a fifth of the work | **Broken** | No tier pair exists. Fixed by T2P13: G9 and G10 stay her trade's, the same fifth |
| PP16 | The open shop | **Kept** | Live per place (FL27); in Tiers 2 and 3 with the secondary, T2P17 |
| PP17 | The Exchange by pair, 30 · 80 × tier; newer pairs after continents 2 and 4 | **Kept, changed** | D224 (FL12) by grade, D264's 20 · 53; × tier kept; the newer pairs' rows go with PP7 (T2P18) |
| PP18 | The old second profession (Lore) replaced | **Kept** | Nothing of it returns |
| PP19 | Old saves: work settled, Craft Levels to 1, stock converted | **Kept** | Built as save v28 (D218, D221); done, nothing in Tiers 2 and 3 |
| PP20 | Speed Tickets for the time | **Kept** | Built (D218); done |
| PP21 | The Stable's Trade filter | **Kept** | Live; Tier 2 adds a Secondary facet (T2P16) |
| PP22 | Pages, pickers, targets; grade chips coloured by their material's tier | **Kept, changed** | D227, D232: one page for fifteen places; no tier colours (no pairs); pickers list the secondary (T2P16) |
| PP23 | Promotion: materials stay in the old world; she arrives at Craft Lv 1, no secondary | **Kept, changed** | D283: Ascend one Uma at a time; the made items her grades used go back to the old world's Warehouse (T2P9, T2P24) |
| PP24 | The grant's rate | **Kept** | Built; done |
| PP25 | The first launch sheet | **Kept** | Built; done |

### 3.2 farm-by-line.md (FL1–FL34)

| Call | What it said | Status | Why, and where it lands |
|---|---|---|---|
| FL1 | Trades don't move; ten places | **Superseded** | D230 (fifteen places), D240 (trades by Tier 0; 101 outfits moved) |
| FL2 | A making place processes and makes | **Superseded** | D230: each line's workbench processes, the making place only makes |
| FL3 | One item a making place | **Kept** | — |
| FL4 | Weapons split by channel: Arms Gem for Arms, Tome Ink for Tomes | **Kept** | Also in Tiers 2 and 3 (T2P5) |
| FL5 | Every line one uma-art family of ten grades | **Kept** | — |
| FL6 | Grade g at Craft Lv 5g − 4 to gather, process, make; Uma Lv 5g − 4 to use | **Kept** | In every tier (T2P9) |
| FL7 | A grade-g item takes grade-g refined only | **Kept** | — |
| FL8 | Every world uses these fifty types until a later release gives them their own | **Kept** | T2P3: no later release needed; a seam (§8) |
| FL9 | Recipes 7 · 7 · 2 · 10 · 10 · 4 | **Superseded** | D264 |
| FL10 | Making at ¾ of a gather a refined item | **Superseded** | D230 (FL28), D264 |
| FL11 | The pace holds (783 h, places 75–83 h) | **Superseded** | D230, D264: 753 job-hours, every place 50.2 |
| FL12 | Buying raw G1–G5 30, G6–G10 80, × tier | **Kept, changed** | D264: 20 · 53 (T2P18) |
| FL13 | Selling raw 6 · 16, refined twice, made 6 + 6g, × tier | **Kept, changed** | D264: raw 4 · 11; made unchanged (T2P18) |
| FL14 | Names: Arms Gem keeps the Weapon Gem ids; Tome Ink | **Kept** | — |
| FL15 | No new art; Tome Ink borrows the infusion bottles | **Kept** | — |
| FL16 | Words for the farm by line | **Kept, changed** | D230: the trios' (i) and blurbs replaced the making places' processing lines |
| FL17–FL20 | Save v30: work settled, R2's types converted, the rest stays, the server | **Kept** | Built (D226, D228); done |
| FL21 | R3–R5 take saves v31–v33 | **Superseded** | D238: R3–R5 removed; Tier 2's save is re-planned (T2P25) |
| FL22 | A making place's What step in two groups, Process and Make | **Superseded** | D230: one kind a place |
| FL23 | Warehouse grades, Exchange tabs, the Gear tab's words, Ascend's give-back by channel | **Kept, changed** | D283: Ascend per Uma gives back Arms Gems or Tome Ink to the old world's Warehouse |
| FL24 | Not changed: the trade by calling, ten places | **Superseded** | D230, D240 |
| FL25 | A trio a line | **Kept** | In every tier (T2P11) |
| FL26 | Ids | **Kept** | — |
| FL27 | Her trade works its three places; trade gate and open shop per place | **Kept** | The secondary widens the gate from Tier 2 (T2P12) |
| FL28 | Equal steps, 36 → 24 minutes | **Kept, changed** | D264: 24 → 16 (T2P8) |
| FL29 | The amounts stay (FL9) | **Superseded** | D264 |
| FL30 | The pace: 783 h, places 2.17–2.39 | **Kept, changed** | D264: 753 job-hours, every place 2.39 (T2P2) |
| FL31 | Save v31; R3–R5 take v32–v34 | **Kept, changed** | v31 built; D238 removed R3–R5 |
| FL32 | The map's five rows | **Kept, changed** | D233: rows at y 0.155 … 0.795 |
| FL33 | Art: five workbenches, three restyled forges | **Kept** | — |
| FL34 | Sizes in steps up to about 20 | **Kept, changed** | D264 (×30), D273 (every forge to 30 steps, 8h 02m at Lv 25; T2P10) |

### 3.3 The count

| Draft | Kept | Kept, changed | Superseded | Broken | In all |
|---|---|---|---|---|---|
| PP1–PP25 | 7 | 10 | 6 | 2 (PP14, PP15) | 25 |
| FL1–FL34 | 16 | 9 | 9 | 0 | 34 |
| **Both** | **23** | **19** | **15** | **2** | **59** |

### 3.4 The old previews

| Old page (`tier-rework/previews/`) | Now |
|---|---|
| `prof-map.html` (the Wilds at each tier) | **Carried** into [the farm by tier](previews/professions-tiers.html): fifteen places, five rows, the tier's tint |
| `prof-materials.html` (every material type, the ladder) | **Carried** into [the farm by tier](previews/professions-tiers.html) (ten grades a line); the pairs and the ladder retire with PP7–PP9 |
| `prof-flow.html` (gathering → making → what she wears) | **Carried** into [times](previews/professions-times.html): each item's chain, recipe and slot time |
| `prof-demand.html` (demand against supply) | **Carried** into [demand and supply](previews/professions-demand.html) |
| `gear-crafting.html` (first round: gear crafting by tier) | **Carried** in part into [times](previews/professions-times.html) (the recipes); its 1 · 2 · 3 accessory slots and rotating pairs retire (D224, D264) |
| `prof-grant.html` (the first launch: Craft Levels reset, Speed Tickets) | **Retired:** built in R2 (PP19–PP25, D218) and done; nothing in Tiers 2 and 3 |
| `professions-map.html`, `professions-flow.html`, `professions-demand.html` (the first round) | **Retired:** already history behind the prof-*.html pages (tier-rework README §4) |

New: [the secondary line](previews/professions-secondary.html), for T2P12–T2P17.

## 4. Tier 2 in full and Tier 3 in full

### 4.1 What Tier 2 adds, and what it keeps

| Piece | Tier 2 | Call |
|---|---|---|
| **The five-line rule** | One rank on two Umas is 30 refined on every line; any new piece keeps it | T2P1 |
| **Amounts** | Tier 1's: recipes, counts, steps and sizes don't scale; only what an item raises does (×1.8) | T2P2 |
| **Materials** | The same fifty pairs, G1–G10; no tier pairs, no ladder | T2P3 |
| **Recipes** | Arms Gem and Tome Ink 10, Fittings 3, Setting 5, jewels 5 | T2P4 |
| **Weapon branches** | The G5 Arms Gem or Tome Ink takes the branch; no Branch Gem | T2P5 |
| **Accessory branches** | No item: Settings as Tier 1's | T2P6 |
| **Weapon moon** | The farm asks it costs no extra Stone (opened with the core moons, as her moon is) | T2P7 |
| **Steps · sizes** | 24 → 16 minutes; every forge to 30 steps | T2P8, T2P10 |
| **Craft Level** | Restarts at Lv 1 on Ascend; the same curve and gates; Craft V at Lv 50 | T2P9 |
| **Places · slots** | Fifteen, four slots each, ×1.25, the same map with Tier 2's dusk tint | T2P11 |
| **The secondary** | **New:** one other line, all three of its places, G1–G8 | T2P12–T2P17 |
| **The Exchange** | Raw only, × 2: 40 · 106 Laurels | T2P18 |
| **Tickets** | Speed 10, Sweep 15, unchanged | T2P19 |
| **Drills** | No Craft EXP | T2P20 |

**What the world starts with.** A Tier 2 world fills as Umas ascend, one at a time once each window is full (D283),
usually a won run's twenty. Each arrives at **Craft Lv 1** with her purse, 1,000 Laurels and 5 Speed Tickets; the
Warehouse is empty, and the Exchange stocks G1–G5 after the tier's first win (continent 6) and G6–G10 after a win on its
continent 3 (continent 8).

### 4.2 Materials and recipes (T2P3–T2P7)

**Grade g is the same item in every world.** A Tier 2 Arms Gem G6 is 10 Gold Ingots, as in Tier 1; it raises an Arms
weapon one grade, and the grade's Might is × 1.8 (T2G's). The world's dusk tint, not its materials, says which tier it is.

| Line | G1 → G10, raw (refined) in every world |
|---|---|
| Metal | Copper, Tin, Iron, Silver, Cobalt, Gold, Platinum, Titanium, Mythril, Orichalcum Ore (Ingot) |
| Vegetables | Carrot, Potato, Cabbage, Onion, Tomato, Bell Pepper, Eggplant, Asparagus, Golden Carrot, Emperor Pumpkin (their cuts) |
| Wood | Pine, Birch, Cedar, Maple, Oak, Cherry, Mahogany, Ebony, Elderwood Log, Yggdrasil Branch (Plank) |
| Fish | Carp, Trout, Sardine, Mackerel, Salmon, Sea Bream, Eel, Tuna, Silverfin, Rainbow Koi (Fillet) |
| Stone | Quartz, Amethyst, Citrine, Garnet, Emerald, Sapphire, Ruby, Diamond, Starstone, Philosopher's Stone (Cut) |

**Why no tier materials** (T2P3): each world has its own Warehouse, and Ascend gives a weapon's made items back to the old
world, so a Tier 2 world never holds a Tier 1 item. A tier's own names would add a hundred ids, shelves and Exchange
rows a tier and change no decision. The old ladder made a tier's pair "a fifth of the work" for the main trade; T2P13
keeps that fifth by grade instead.

**The tier's new pieces cost nothing new on the farm:**

| Piece (owner) | What the farm does | Lines' work a rank |
|---|---|---|
| **Weapon branches at G5** (T2G: Pure or Dual) | The G5 raise, with the weapon's ordinary G5 Arms Gem or Tome Ink, picks the branch. A re-forge takes one more G5 item of its line (outside the demand). The code's `branch-gem` placeholder (7 Ingots G5) retires (T2P5) | Unchanged: 30 |
| **Accessory branches from a slot's G5** (T2G, WP34) | No item; a form is a setting (T2P6) | Unchanged: 30 |
| **A weapon moon** (T2E, EP24) | The farm asks its nodes open with the core moons' (her moon's pattern, D264 call 6), so a rank still sets three jewels (T2P7) | Unchanged: 30 |
| **Three accessory slots** (D264) | Already in Tier 1 | Unchanged: 30 |

If T2G or T2E chooses a piece that costs items, it must keep T2P1: fit inside its line's 30 a rank, or add the same to all
five lines. What breaks otherwise:

| If a tier adds, on one line only | That line a maxed Uma | Its places, maxed Umas a day | Its trade's share |
|---|---|---|---|
| Nothing (T2P1) | 150 | 2.39 | 20% |
| A weapon moon at a Moon Jewel a node (+5 jewels) | Stone 175 | 2.05 | 22.6% |
| Two weapon moons so (Tier 3, +10 jewels) | Stone 200 | 1.79 | 25.0% |
| A Branch Gem of 7 Ingots at every weapon's G5 (the code's placeholder) | Metal 156, Vegetables 135 | 2.30 · 2.66 | 21.1% · 18.2%: a Tome's G5 costs Metal |

### 4.3 Steps, sizes and Craft Level (T2P8–T2P10)

**Everything a job takes is Tier 1's, in every tier.** Craft Level restarts at Lv 1 when she ascends, so each tier's
grades open again on their own clock: G1 at once, G10 on day 22.1 of nonstop work, Craft Lv 50 (Craft V) on day 24.5.

| Craft Lv | 1 | 6 | 11 | 16 | 21 | 26 | 31 | 36 | 41 | 46 | 50 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Opens | G1 | G2 | G3 | G4 | G5 | G6 | G7 | G8 | G9 | G10 | — |
| Day reached, nonstop | 0 | 2.0 | 4.2 | 6.4 | 8.8 | 11.3 | 13.8 | 16.5 | 19.3 | 22.1 | 24.5 |
| One step, slot time | 19m 12s | 18m 33s | 17m 54s | 17m 14s | 16m 35s | 15m 56s | 15m 17s | 14m 38s | 13m 59s | 13m 19s | 12m 48s |

Her window's Craft steps (Craft Lv 10 · 20 · 30 · 40 · 50) come on days 3.8 · 8.3 · 13.3 · 18.7 · 24.5 of nonstop work in
every tier. Her own full window is 31.8 slot-days of work (§4.5), so an Uma who works for herself reaches Craft V first.

### 4.4 The secondary line (T2P12–T2P17)

The owner's words (PP's brief): a secondary is "another profession's base items, while the main one reaches its higher
tiers". On trios that reads: **one other line's work below the top two grades.**

| Rule | Value |
|---|---|
| **Opens** | In Tier 2 and Tier 3 worlds. Tier 1 has none |
| **What she holds** | One line other than her trade's: Metal, Vegetables, Wood, Fish or Stone |
| **Where she works** | Its three places: gather, process and make |
| **Which grades** | **G1–G8** (each at its usual Craft Level gate, G8 at Lv 36). **G9 and G10 stay her trade's** |
| **Her speed and EXP** | Her one Craft Level: the same step and 2 EXP a job-minute, whichever line |
| **Slots** | She holds one slot at a time, as today |
| **Changing it** | Free, any time she isn't working at one of its places ("At work · recall first") |
| **Ascend** | Cleared: she arrives in the new world with none |
| **The open shop** | A line with no Uma of its trade in the world takes everyone at every grade, as today |

**Why a line, not a place:** a thin trade needs all three of its places; a one-place secondary would need three Umas to
cover one line, and twelve choices instead of four. **Why G9 and G10:** the top two grades are a fifth of a line's work
at every rank count, the share PP15 reserved for "her higher tiers", and they open last (Craft Lv 41 and 46), so the
trade keeps the work that reads as mastery. **Why free changes:** ascending one Uma at a time moves a world's head counts
every few days; a fee (PP14's 1,000 × tier) would only tax keeping them balanced, and the reserve already keeps each
trade's top work its own.

**On screen** (the [secondary page](previews/professions-secondary.html) draws each):

| Where | What |
|---|---|
| **Her Template tab**, the calling-and-trade row | "Calling · Spellblade · fixed", "Forest · Armorer", then **"Secondary · Vegetables"**, or **"Secondary · Pick"** while she has none. A tap opens her secondary sheet (Tier 2 and 3 only) |
| **Her secondary sheet** | Four rows, one a line: its name, "4 Umas · 2 secondaries" in this world, **Suggested** on one. A tap sets it at once, the profile's free grammar (UP's "free on tap"); "None" clears it. Refused while she works at one of its places: "At work · recall first" |
| **Suggested** | The line with the fewest hands for its work: its trade's Umas plus its secondaries, over what a full window takes from it (250 refined on Metal and Vegetables, 150 on the rest); a tie goes to the Wilds' order. In the run below it names Vegetables first (3 hands for 250), then Metal (4), as the shortages are |
| **A place's Who step** | Her trade's Umas first ("Her trade"), then this line's secondaries ("Secondary"), then the rest greyed "Another trade". On a G9 or G10 job a secondary is greyed "Main trade only" |
| **The targets strip** | A tap on a short item offers her trade's first free Uma, else a secondary's (G1–G8) |
| **The Stable** | The Trade filter gains a Secondary facet with each line's count |

**A Tier 2 run of twenty, set up.** Twenty at today's callings, 4 · 3 · 5 · 3 · 5 (Metal · Vegetables · Wood · Fish ·
Stone), working for their own full windows. Without secondaries the Vegetables trade's three bind at 0.36 full windows a
day: 55.8 days. With them the roster is bound only by its own hours, **0.63 a day: 31.8 days**.

| Line | Own Umas | Need a day at 0.63 (job-hours) | Own trade gives | Short or spare | Secondaries pointed at it |
|---|---|---|---|---|---|
| Metal | 4 | 158 | 120 | 38 short | 2 (from Wood and Stone) |
| Vegetables | 3 | 158 | 90 | 68 short | 3 (from Wood and Stone) |
| Wood | 5 | 95 | 150 | 55 spare | — |
| Fish | 3 | 95 | 90 | 5 short | 1 (from Stone) |
| Stone | 5 | 95 | 150 | 55 spare | — |

Six of the ten Wood and Stone Umas take secondaries: two work theirs all day, four split their days. Each line's G9–G10
(a fifth: 32 job-hours a day on Vegetables) stays inside its own trade's 90–150.

### 4.5 Demand against supply (T2P1, T2P2, T2P21, T2P22)

**Assumed from the other docs (§5): the five-line rule holds in Tiers 2 and 3.** T2G's and T2E's new pieces take no
extra items (T2P5–T2P7), so every number below is Tier 1's, in every tier.

**One Uma, by tier:**

| | Tier 1 | Tier 2 | Tier 3 | Each item (chain, slot time at Craft Lv 25) |
|---|---|---|---|---|
| Three worn weapons (30 items) | 300 refined | 300 | 300 | 8h 02m |
| Two more weapons for the full window (20) | 200 | 200 | 200 | 8h 02m |
| Five armor slots (50) | 150 | 150 | 150 | 2h 25m |
| Three accessory slots (30) | 150 | 150 | 150 | 4h 01m |
| The map: 15 Planet, 15 Moon Jewels (30) | 150 | 150 | 150 | 4h 01m |
| **A maxed Uma** (140 items) | **750 · 753 job-h · 602 slot-h** | the same | the same | |
| **A full window** (160 items) | **950 · 954 job-h · 763 slot-h** | the same | the same | |
| Her values (T2G, T2E, T2B) | ×1 | ×1.8 | ×2.6 | |

**By line, one Uma** (refined; a full window's five weapons split 2.5 Arms and 2.5 Tomes on a roster's average):

| | Metal | Vegetables | Wood | Fish | Stone |
|---|---|---|---|---|---|
| A maxed Uma | 150 | 150 | 150 | 150 | 150 |
| A full window | 250 | 250 | 150 | 150 | 150 |
| Job-hours at a place, full window | 83.7 | 83.7 | 50.2 | 50.2 | 50.2 |
| A place's four slots a day | 1.43 | 1.43 | 2.39 | 2.39 | 2.39 |

**A rank, by tier** (two Umas, slot time a place at Craft Lv 25):

| | Tier 1 | Tier 2 | Tier 3 |
|---|---|---|---|
| Maxed yardstick (3 Arms + 3 Tomes): 30 a line | 8h 02m every place | 8h 02m | 8h 02m |
| Full-window yardstick (5 Arms + 5 Tomes): Metal and Vegetables 50, the rest 30 | 13h 23m · 8h 02m | the same | the same |

**Rosters.** Supply is a slot's day (24 slot-hours, 30 job-hours) a working Uma, at most twelve a line and four a place.
Without a secondary a line's work waits on its own trade's Umas; with one, on the roster's hours, each line's G9–G10 on
its own trade and its twelve slots.

| Roster | Tier | Maxed: a day · a party · twenty | Binds | Full windows: a day · a party · twenty | Binds |
|---|---|---|---|---|---|
| Forty, today's callings (7 · 7 · 11 · 5 · 10) | 1 (no secondary) | 1.00 · 5.0 d · 20.1 d | Fish's 5 | 0.84 · 6.0 d · 23.9 d | Metal's, Vegetables' 7 |
| The same | **2, 3** | **1.59 · 3.1 d · 12.6 d** | its hours | **1.26 · 4.0 d · 15.9 d** | its hours |
| Twenty, today's callings (4 · 3 · 5 · 3 · 5) | 1 (no secondary) | 0.60 · 8.4 d · 33.5 d | Vegetables', Fish's 3 | 0.36 · 13.9 d · 55.8 d | Vegetables' 3 |
| The same | **2, 3** | **0.80 · 6.3 d · 25.1 d** | its hours | **0.63 · 7.9 d · 31.8 d** | its hours |
| Twenty, even (4 · 4 · 4 · 4 · 4) | 2, 3 without · with | 0.80 · 0.80 | Metal · its hours | 0.48 · 0.63 | Metal · its hours |
| Twenty, thin (3 · 3 · 6 · 2 · 6) | 2, 3 without · with | 0.40 · 0.80 | Fish · its hours | 0.36 · 0.63 | Metal · its hours |
| Twenty, one Summoner (4 · 4 · 5 · 1 · 6) | 2, 3 without · with | 0.20 · 0.80 | Fish · its hours | 0.20 · 0.63 | Fish · its hours |
| Twenty, no Summoner (4 · 4 · 6 · 0 · 6) | 2, 3 without · with | 0.80 · 0.80 (Fish an open shop) | Metal · its hours | 0.48 · 0.63 | Metal · its hours |

With secondaries **every split of twenty runs at its hours**: 25.1 days for twenty maxed Umas, 31.8 for twenty full
windows, whatever the callings. No line's twelve slots bind below about 46 Umas (the weapon lines' places at 1.43 full
windows a day).

**The fighting party's grades** (a Tier 2 run of twenty with secondaries, all working; the party is a tenth of five Umas'
work a grade, the run a tenth of twenty's):

| Grade | G1 | G2 | G3 | G4 | G5 | G6 | G7 | G8 | G9 | G10 |
|---|---|---|---|---|---|---|---|---|---|---|
| Opens (Craft Lv 5g − 4), day | 0 | 2.0 | 4.2 | 6.4 | 8.8 | 11.3 | 13.8 | 16.5 | 19.3 | 22.1 |
| The party holds it (maxed, 0.80 a day) | 0.6 | 2.7 | 4.8 | 7.1 | 9.4 | 11.9 | 14.4 | 17.1 | 19.9 | 22.8 |
| The run holds it (full windows, 0.63 a day) | 3.2 | 5.2 | 7.4 | 9.6 | 12.0 | 14.4 | 17.0 | 19.7 | 22.4 | 25.3 |

Craft Level, not volume, is the wall for the fighting party, as in Tier 1: the party holds each grade within a day of its
opening.

### 4.6 The Exchange by tier (T2P18, T2P19)

Raw only, every line's ten grades, up to 99 at a time; refined and made items only from the Wilds.

| | Tier 1 | Tier 2 | Tier 3 |
|---|---|---|---|
| Raw G1–G5 · stocked | 20 · after the tier's first win | 40 · after the first win (continent 6) | 60 · after the first win (continent 11) |
| Raw G6–G10 · stocked | 53 · after a win on continent 3 | 106 · after a win on continent 8 | 159 · after a win on continent 13 |
| A rank's raw, one line (30) | 600 · 1,590 | 1,200 · 3,180 | 1,800 · 4,770 |
| Selling raw G1–G5 · G6–G10 | 4 · 11 | 8 · 22 | 12 · 33 |
| Selling refined | 8 · 22 | 16 · 44 | 24 · 66 |
| Selling a made item of grade g | 6 + 6g (12 … 66) | × 2 (24 … 132) | × 3 (36 … 198) |
| Speed Ticket · Sweep Ticket | 10 · 15 | 10 · 15 | 10 · 15 |
| Class Manual | 1,000 Class Marks | the same | the same |

- **× tier** because a tier's fights pay × tier (D170): a raw item costs the same number of fights in every tier.
- **Tickets stay flat** (T2P19): a Speed Ticket buys 30 minutes, about two steps at Craft Lv 25, in every tier. Fights pay
  × tier, so a later world's time is cheaper in fights: a gentle catch-up for a world that restarts at Craft Lv 1.

### 4.7 Tier 3 in full (T2P23)

**Tier 3 runs Tier 2's farm.** The same materials, recipes, steps, sizes, places and Craft Level; the same secondary, G1–G8;
the Exchange × 3 (§4.6). What differs comes from elsewhere: values × 2.6 (T2G, T2E), continents 11–15 (T2W), and no Rift
yet, so its window is 35 steps with the same Weapons, Gear and Stars asks (D289).

| | Tier 3 | Why |
|---|---|---|
| The secondary | Tier 2's, G1–G8 | PP14's Tier 3 step ("its Tier 2 work") was a material pair; on grades the reserved fifth is the same in both tiers, so one rule |
| A second secondary | No | Twenty already run at their hours with one |
| Its own materials | No (T2P3) | Its Warehouse is its own |
| A run of twenty | 25.1 days maxed, 31.8 full windows | As Tier 2 |

## 5. Provides and assumes

### 5.1 What the other docs read here

| Doc | Reads | Calls |
|---|---|---|
| **gear.md (T2G)** | Recipes in every tier (Arms Gem and Tome Ink 10, Fittings 3, Setting 5); grade gates Craft Lv 5g − 4 and Uma Lv 5g − 4; weapon branches ride the G5 item, a re-forge one more G5 item; accessory branches take none; the five-line rule for any new piece; a rank's 30 a line | T2P1, T2P4–T2P6 |
| **extra-stats.md (T2E)** | Planet and Moon Jewels 5 cut stones of the node's grade in every tier; three jewels a rank; the Stone budget (30 a rank); the farm's ask for a weapon moon and what breaks otherwise (§4.2) | T2P1, T2P4, T2P7 |
| **progression.md (T2W)** | Craft Level restarts at Lv 1 on Ascend, the same curve, Craft V at Lv 50 on day 24.5; the Exchange's stocking by the tier's continents; a run of twenty's farm days (25.1 maxed, 31.8 full windows); Drills pay no Craft EXP; the purse is unchanged; she arrives with no secondary | T2P9, T2P18–T2P22, T2P24 |
| **balance.md (T2B)** | When a grade is held: the fighting party within a day of its Craft Level's opening (§4.5), so on-curve gear by level is Tier 1's in every tier | T2P9, T2P22 |
| **templates.md (T2U)** | Her calling still names her trade in Tiers 2 and 3 (no Tier 0 there); her Template tab's calling-and-trade row hosts the secondary | T2P12, T2P14 |
| **classes.md (T2C)** | A class switch, a promotion or a reclass never moves her trade or her secondary | T2P12 |

### 5.2 What this doc assumes from them

| From | Assumes | If it differs |
|---|---|---|
| **T2G** | Weapon grades G0–G10 per kind, raised by Arms Gems (Arms) and Tome Ink (Tomes); Pure or Dual at G5 in Tier 2, a deeper step in Tier 3, with **no new crafted item** (or one costing exactly its G5 item); accessory branches with no item; three accessory slots, five armor slots in every tier | A piece that costs items comes back here against T2P1: priced inside its line, or the same on every line |
| **T2E** | The Planet and three moons rebuilt each tier, three jewels a rank; **a weapon moon (and Tier 3's second) adds no jewel** (T2P7); her moon as Tier 1's | §4.2's table: Stone 175 (200), its places 2.05 (1.79) a day, its trade 22.6% (25.0%) |
| **T2W** | Ascend one Uma at a time with a full window (D283); the window keeps Craft I–V at Lv 10–50 and Weapons V (five kinds at G10) in Tiers 2 and 3; Tier 2's continents 6–10, Tier 3's 11–15; the purse 1,000 Laurels and 5 Speed Tickets; a Tier 2 world usually starts with a won run's twenty | A smaller Weapons ask moves §4.5's full window toward the maxed Uma (750); a different world start moves only the roster rows |
| **T2C** | The eight Tier 1 classes in Tiers 2 and 3, three weapon slots each; her calling by running style in every tier | — |
| **T2B** | Values × 1.8 and × 2.6 on what the items raise; nothing here is a stat | — |
| **T2U** | The Template tab's calling-and-trade row in every tier | The secondary sheet opens from wherever her trade shows |

## 6. Save and engine

Roughly, for the re-plan; not packets.

| Area | Change | Version |
|---|---|---|
| **Save** | `OwnedUma.secondary?: MaterialLine`, in Tier 2 and 3 worlds only; never her trade's line; refused in Tier 1; dropped on Ascend. No migration: a world without it has no secondaries | A later save (Tier 2's toolbox) |
| **Work rules** | The trade gate in each job kind's `plan` (FL27) admits a secondary at grade ≤ 8; its refusal reads "Main trade only"; the open shop unchanged. uma-work unchanged | Same release |
| **Recipes** | `RECIPE_V4['branch-gem']` (7 Ingots G5, D225's placeholder) and the `t2Weapons` stage's Branch Gem gates (D244) retire with T2P5, or follow T2G | With T2G's packet |
| **Screens** | The Template tab's trade row and the secondary sheet; a place's Who groups; the targets strip's pick; the Stable's Secondary facet | Same release |
| **Ledger** | `professions-v4.sim.ts` gains the full window and today's callings' split (7 · 7 · 11 · 5 · 10; its 9 · 8 · 9 · 7 · 7 is D220's), and a secondary roster (T2P26) | Test support only |
| **Battle engine** | None: nothing here reaches a fight | — |

## 7. Pacing

Where the farm takes time, in every tier alike (slot time unless marked):

| Piece | Time | Per item beside it |
|---|---|---|
| One step | 19m (Lv 1) · 16m (Lv 25) · 13m (Lv 50) | — |
| A refined item, its three steps | 58m · 48m · 38m | 1 raw, 1 process, 1 make step |
| An Arms Gem or Tome Ink | 9h 36m · 8h 02m · 6h 24m | 10 refined × 48m at Lv 25 |
| Armor Fittings | 2h 53m · 2h 25m · 1h 55m | 3 × 48m |
| A Setting or a jewel | 4h 48m · 4h 01m · 3h 12m | 5 × 48m |
| A rank, every place | 9h 36m at G1's Craft Lv 1 → 6h 40m at G10's Lv 46; 8h 02m at Lv 25 | 30 steps a place |
| A maxed Uma | 602 slot-hours (753 job-hours), 25.1 slot-days | 140 items |
| A full window | 763 slot-hours (954 job-hours), 31.8 slot-days | 160 items |
| Craft Level 1 → 50 | 588 slot-hours, 24.5 days nonstop; G10 on day 22.1 | 1,425 + 15L EXP a level |
| A Tier 2 or 3 run of twenty, with secondaries | 25.1 days maxed, 31.8 full windows | 0.80 · 0.63 a day |
| The same without secondaries (today's callings) | 33.5 · 55.8 days | 0.60 · 0.36 a day |
| Forty, with secondaries | 12.6 · 15.9 days for twenty | 1.59 · 1.26 a day |

- **The owner's pattern** (one party fights while dozens work, raised in step, as D294's grants show): Craft Level is the
  fighting party's wall, not volume; the roster's volume decides when a run of twenty is ready.
- **The secondary is the tier's speed-up:** it takes a Tier 2 world of twenty from 55.8 to 31.8 days for full windows,
  whatever the callings.
- **What would move it:** a tier piece that costs items on one line (§4.2); a window that asks more weapons; a later tier
  with more Umas than sixty slots.

## 8. Decisions

Every new call, with the recommended answer. The owner reviews them all.

| Call | Recommendation | Alternatives, briefly | Why |
|---|---|---|---|
| **T2P1** The five-line rule | **One rank on two Umas (3 Arms + 3 Tomes) is 30 refined on each line in Tiers 2 and 3, as D264 made Tier 1; any tier's new piece fits inside its line's 30 or adds the same to all five** | Let new pieces land where they fall (PP's 18.6–23.3% trades) | The owner asked to "fully standardize" the lines (D264); a tier shouldn't undo it |
| **T2P2** Amounts by tier | **Recipes, counts, steps and sizes don't scale:** a maxed Uma 140 items, 750 refined, 753 job-hours in every tier; only what an item raises scales (×1.8, ×2.6) | Amounts × tier (a Tier 3 run of twenty in 65 to 83 days) | PP11 kept: SB1 is a stat's share, not time |
| **T2P3** Materials by tier | **The same fifty pairs, G1–G10, in every world (FL8); no tier pairs, no ladder** | A tier family a line from uma-art's unused 130 types (a re-skin, 100 ids a tier); the old ladder | Each world's Warehouse is its own, so a tier's items never meet another's; new names add shelves, not decisions |
| **T2P4** Recipes by tier | **Arms Gem and Tome Ink 10, Armor Fittings 3, Accessory Setting 5, Planet and Moon Jewels 5, each of its own grade, in every tier** | Smaller recipes in later tiers | D264's numbers; the rank stays 30 a line |
| **T2P5** Weapon branches | **No Branch Gem: the weapon's G5 Arms Gem or Tome Ink picks its branch when used; a re-forge takes one more G5 item of its line; `branch-gem` retires.** If T2G keeps an item, it costs exactly its G5 item at its weapon's forge | WP10's one Branch Gem (Metal for every weapon, so Tomes would cost Metal); a Branch Gem and a Branch Ink | Keeps the lines paired by channel (FL4), no new item or art |
| **T2P6** Accessory branches | **No item** (WP34): Settings stay 5 Fillets a grade | A branch Setting | A form is a setting; Fish stays at 30 |
| **T2P7** The weapon moon's cost | **The farm asks T2E to open a weapon moon's nodes with the core moons' nodes, as her moon's open (D264 call 6), so a rank still sets three jewels** | A Moon Jewel a node (Stone 175, its places 2.05 a day; Tier 3 200 and 1.79); the Planet at two jewels a node (even ranks jump) | Keeps Stone at 30 a rank; D264 removed a fourth jewel for the same reason |
| **T2P8** Steps by tier | **24 → 16 minutes by Craft Level, ×1.25 at every place, one step a gather, a process or a refined item in a make, in every tier** | Faster steps in later tiers | D264, FL28 |
| **T2P9** Craft Level by tier | **Restarts at Lv 1 on Ascend; the same curve (88,200 EXP to Lv 50, 24.5 days nonstop) and gates (5g − 4); Craft V at Lv 50 in each tier's window** | Carry Craft Level; a head start at Lv 10; a shorter curve | PP13 and D283's note kept; each tier opens on its own clock, and her own full window's work reaches Craft V first |
| **T2P10** Sizes by tier | **D273's rule in every tier:** gather or process ×1–×30, makes to 30 steps, every forge's longest job 9h 36m · 8h 02m · 6h 24m at Craft Lv 1 · 25 · 50; three queued | Longer jobs in later tiers | The owner's 8h 02m mark at every forge |
| **T2P11** Places and slots | **Fifteen places, four slots each, ×1.25, no upgrades, the same map with the tier's tint; no new building art** | More slots a tier; a tier's own buildings | Twenty to forty Umas never fill sixty slots; lean assets |
| **T2P12** The secondary | **From Tier 2, each Uma may hold one secondary line, all three of its places** | One place (PP14's literal, twelve choices); every line open (no pick); two secondaries | A thin trade needs a whole trio; four choices; the owner's "a secondary profession" |
| **T2P13** The top stays her trade's | **G9 and G10 of every line are her trade's alone; a secondary works G1–G8, in Tiers 2 and 3** | No reserve; the making step reserved; G6–G10 | PP15's fifth, by grade; the last grades to open read as the trade's mastery |
| **T2P14** The pick | **On her Template tab's calling-and-trade row, a sheet of four lines; free, any time she isn't working at one of its places; none in Tier 1; cleared on Ascend** | PP14's 1,000 Laurels × tier a change; on the place page | Ascend one at a time keeps moving head counts; the reserve keeps the trade's top work its own |
| **T2P15** Suggested | **The sheet marks the line with the fewest hands for its work: trade Umas plus secondaries, over a full window's refined from it (Metal and Vegetables 250, the rest 150); ties by the Wilds' order** | No suggestion; the fewest hands alone (would name Fish where Vegetables is shortest); by targets' short hours | Dozens of Umas to set; the weapon lines carry the full window's extra weapons |
| **T2P16** Pickers and words | **Who lists "Her trade", then "Secondary", then the rest greyed "Another trade"; a G9 or G10 job greys secondaries "Main trade only"; targets offer the trade first; the Stable gains a Secondary facet** | One flat list | One place, one job, the reason on the row (PP22) |
| **T2P17** The open shop with secondaries | **A line with no Uma of its trade opens every grade to everyone; once one arrives, G9 and G10 are hers** | Secondaries only, no open shop | PP16 kept: a world without Summoners still makes Settings |
| **T2P18** The Exchange by tier | **Raw only; G1–G5 20 × tier after the tier's first win, G6–G10 53 × tier after a win on its continent 3 (continents 8 and 13); selling × tier** | Flat prices; refined or made items for sale | PP17 and D264; a raw item costs the same fights in every tier |
| **T2P19** Tickets by tier | **Speed Ticket 10, Sweep Ticket 15, Class Manual 1,000 Class Marks in every tier** | × tier | Today's; a later world's time is cheaper in fights, a catch-up for a world at Craft Lv 1 |
| **T2P20** Drills and the farm | **Drills pay no Craft EXP in any tier** (T2W owns Drills) | Craft Logs | D283's note: Craft V stays at Lv 50 and Speed Tickets are the craft's fast-forward |
| **T2P21** Two yardsticks | **Report a maxed Uma (750 refined, every line 150) and a full window (950, the weapon lines 250 on a roster's average); the full window is the ascend number** | The maxed Uma alone | Ascend needs a full window, and its Weapons track asks five weapons at G10 (D289) |
| **T2P22** The full window's weapon work | **In Tiers 2 and 3 the secondary carries it; recipes stay. Tier 1 stays as built** (forty at today's callings: 0.84 full windows a day, Metal and Vegetables binding; a seam, below) | Arms Gem and Tome Ink 6 in every tier (5 × 6 = 3 × 10: the full window equal, the maxed Uma not); a secondary in Tier 1 too | Keeps the tiers' recipes one set; every split of twenty runs at its hours |
| **T2P23** Tier 3 | **Tier 3 runs Tier 2's farm: the same secondary (G1–G8), no second secondary, no materials of its own** | PP14's Tier 3 step (G1–G9); a second secondary | One rule to learn; twenty already run at their hours |
| **T2P24** Ascend and the farm | **She arrives at Craft Lv 1 with no secondary; the made items her grades used go back to the old world's Warehouse, her jewels are gone (as live)** | Carry stock or the secondary | PP23 kept, on D283's per-Uma Ascend |
| **T2P25** Save and engine | **One optional field, `OwnedUma.secondary`, in Tier 2 and 3 worlds at Tier 2's toolbox save; the work gate reads it; no battle engine change, no migration** | A field in every world | Nothing exists to migrate; Tier 1 has none |
| **T2P26** The ledger | **`professions-v4.sim.ts` gains the full window, today's callings' split and a secondary roster when Tier 2 is built** | Keep D220's split | Its 1.39 a day reads forty at the old callings; today's is 1.00 |

**Seams where the owner's requirements most likely land:**

1. **Tier 1's full window** (T2P21, T2P22): Metal and Vegetables carry 250 an Uma against 150. Arms Gem and Tome Ink at 6
   would make five weapons cost what three cost today (5 × 6 = 3 × 10) and even the full window on every line; or the
   secondary could open in Tier 1.
2. **The weapon moon's jewels** (T2P7): if T2E or the owner wants it farmed, Stone needs the same on the other four lines.
3. **Tier materials** (T2P3): a tier family a line from uma-art's unused types is a re-skin; grades and recipes stay.
4. **The secondary's scope** (T2P12–T2P14): a place instead of a line, the reserve at another grade, a fee.
5. **Craft Level across tiers** (T2P9): a carry-over or a head start changes every grade day above.
6. **Slots** (T2P11): a world past about 46 Umas fills the weapon lines' twelve slots on full windows.
