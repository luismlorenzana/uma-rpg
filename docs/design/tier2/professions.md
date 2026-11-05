# Professions in Tiers 2 and 3: ten branches, three professions an Uma

> **Status: round 2 (the owner's requirements, R2-9), 2026-11-04. Nothing here is built.** One of the seven Tier 2 and
> Tier 3 docs ([the brief](README.md), §9). Round 1 carried the farm's approved drafts,
> [profession-progression.md](../tier-rework/profession-progression.md) (PP1–PP25, D195) and
> [farm-by-line.md](../tier-rework/farm-by-line.md) (FL1–FL34, D224–D233), onto **Tier 1 as it is built and live**
> (engine v21, save v36). Round 2 builds the owner's requirement on that ground: **two materials a line from Tier 2,
> each its own profession, and three professions an Uma.** Calls: **T2P1–T2P26** (round 1, each with its round-2
> status) and **T2P27–T2P45** (round 2), every one with a recommendation; no open questions. The manual
> ([materials](../../game/materials.md), [loops](../../game/loops.md#craft-level), [sections](../../game/sections.md#wilds))
> is the game as it plays; Tier 1 stays as built (R2-1).
>
> **Numbers come from the code:** `packages/domain/src/economy/pacing.ts` (steps, sizes, Craft Level),
> `economy/professions.sim.ts` and `economy/professions-v4.sim.ts` (the ledger's math), `items/made-v4.ts` (recipes),
> `save/exchange.ts` (prices), read through a throwaway table test that was deleted before commit. Tier 2's second
> branches don't exist in code; their numbers are Tier 1's rules applied to them, by the same test.
>
> **Names checked:** every new name (the five branch names, the fifteen place jobs, the five made items, the
> sub-profession's words) and every uma-art name of the five reused families (50 raw, 50 refined) was matched,
> case-insensitive and exact, against every string of uma-platform's `content/release/data/*.json` (ten files): no match
> except the bare words "Sub" and "Path", so the screens always say **Sub-profession** and **Tier 2 path**. Umas are
> shown by role only.
>
> **Pages** (desktop, light and dark): [the farm, Tier 1 → 2 → 3](previews/professions-tiers.html) ·
> [the ten branches and what they feed](previews/professions-branches.html) ·
> [every step, item and rank, timed](previews/professions-times.html) ·
> [demand against supply](previews/professions-demand.html) ·
> [three professions and the sub-profession](previews/professions-secondary.html).

**Words used here.** *A line* is one trio of places (Metal, Vegetables, Wood, Fish, Stone) and the trade that works it.
*A branch* is one material of a line, gathered, processed and made into its item; from Tier 2 a line has two: its
**first branch** (Tier 1's material) and its **second branch** (new). *A profession* is a branch with its own Craft Level.
*Her trade* is the line her calling names; *her sub-profession* is the one branch of another line she adds. *A path* is
what a piece's Tier 2 choice is (a weapon's type, a slot's accessory form, a node's branch stat), owned by
[gear](gear.md) and [extra stats](extra-stats.md). *A rank* is one grade of everything on D264's yardstick: two Umas, one
on three Arms and one on three Tomes. *Slot time* is what a job takes in a slot (the places' ×1.25 applied, what the job
sheet shows); *job-hours* are the ledger's unit before it (one slot hour is 1.25 job-hours).

## 0. The owner's requirement, point by point

> "Finally professions, this I also want to increase greatly, in Tier 2 to at least every farming type having 2 types
> of materials being farmed and processed and finally crafted, these will feed every dual path we have on the other
> systems. I want Umas to gain Exp differently for each branch, but then I also want an Uma to be able to pick a
> sub-profession from another branch entirely, so each Uma would have the ability to farm and level 3 total professions
> now."

| The owner asked | Where | In short |
|---|---|---|
| "every farming type having 2 types of materials" | §4.2 (T2P27) | Each line gains a second material from an unused uma-art family: Metal · **Rock**, Vegetables · **Herbs**, Wood · **Hides**, Fish · **Fossils**, Stone · **Fungi** |
| "farmed and processed and finally crafted" | §4.2 (T2P28), §4.6 (T2P37) | Each second material is gathered, processed and made at its line's three places into a second item: **Arms Whetstone, Tome Reagent, Armor Lining, Accessory Inlay, Stardust** |
| "these will feed every dual path we have on the other systems" | §4.3 (T2P29, T2P30) | From Tier 2 every grade of every piece takes its line's two items: the first raises its base, the second its Tier 2 path (a weapon's type, Dual or cross-channel; an armor slot's lining; the accessory tree's forms; an Extra Stats node's branch stat). Paths swap freely: no item is tied to one |
| "gain Exp differently for each branch" | §4.4 (T2P31, T2P32) | Ten professions, one a branch, each its own Craft Level on Tier 1's curve. A job pays its EXP to the profession of the material it works, nothing to the others |
| "pick a sub-profession from another branch entirely" | §4.5 (T2P33–T2P36) | One branch of another line, picked on her Template tab, free to change, its level kept; it replaces round 1's secondary line |
| "farm and level 3 total professions" | §4.5 (T2P33) | Her trade's two branches and her sub-profession: three Craft Levels, three sets of grades |
| "increase greatly" | §4.8, §4.9 (T2P40, T2P41) | The farm doubles: an Uma's full window is 1,908 job-hours (Tier 1 954), every branch and place equal, and the places' slots double with it |

## 1. At a glance

**Tier 2 doubles the farm and keeps it equal.** Each line keeps its trio of places and gains a second material, made
into a second item; from Tier 2 every grade of every piece takes one of each, so every one of the ten branches carries
the same 30 refined items a rank (the **ten-branch rule**, T2P39). An Uma levels three professions: her trade's two and
one **sub-profession** from another line. Tier 3 runs Tier 2's farm.

| | Tier 1 (live, unchanged) | Tier 2 | Tier 3 |
|---|---|---|---|
| **Lines · places · branches** | 5 · 15 · 5 (one material a line) | 5 · 15 · **10** (two a line) | The same as Tier 2 |
| **Materials** | 50 pairs, G1–G10 (100 ids) | **100 pairs** (200 ids): + Rock, Herbs, Hides, Fossils, Fungi | The same 100 |
| **Made items** | Arms Gem, Tome Ink, Armor Fittings, Accessory Setting, Planet and Moon Jewels | + **Arms Whetstone, Tome Reagent, Armor Lining, Accessory Inlay, Stardust** | The same |
| **What a grade takes** | One item | **Two:** its line's first item (the base) and second item (the path) | The same; the paths' Tier 3 steps ride the same items |
| **Recipes** (refined of the item's grade) | 10 · 10 · 3 · 5 · 5 · 5 | Second items mirror the first: Whetstone and Reagent 10, Lining 3, Inlay 5, Stardust 5 | The same |
| **Professions an Uma** | One Craft Level, her trade's three places | **Three:** her trade's two branches + one sub-profession, each its own Craft Level | The same |
| **Where a job's EXP goes** | Her Craft Level | **The profession of the material it works** | The same |
| **One step** (slot time) | 19m at Craft Lv 1 → 16m at 25 → 13m at 50 | The same, by the branch's level | The same |
| **Every forge's longest job** (30 steps, D273) | 9h 36m · 8h 02m · 6h 24m at Craft Lv 1 · 25 · 50 | The same, for each item | The same |
| **A rank** | 30 refined a line · 8h 02m a place at Craft Lv 25 | **30 a branch · 8h 02m a branch at each of its places · 16h 04m a place** | The same |
| **Slots** | 4 a place, 60 in all | **8 a place, 120** (either branch) | The same |
| **A maxed Uma** | 140 items · 750 refined · 753 job-hours (25.1 slot-days) | **280 · 1,500 · 1,506 (50.2 slot-days)** | The same |
| **A full window** | 160 items · 950 refined · 954 job-hours (31.8 slot-days) | **320 · 1,900 · 1,908 (63.6 slot-days)** | The same |
| **A profession, Lv 1 → 50** | 24.5 days nonstop | 24.5 days each (two 49.0, three 73.5) | The same |
| **Twenty Umas' full windows** (today's callings) | 55.8 days (Vegetables' three bind) | **63.6 days** with sub-professions (111.6 without) | 63.6 days |
| **Forty make twenty full windows** | 23.9 days | **31.8 days** | 31.8 days |
| **A 24-party world (120 Umas), full windows** | 83.7 days (the weapon lines' slots bind) | **83.7 days** (eight slots a place) | 83.7 days |
| **The fighting party holds G10** (twenty at work) | Day 23.0 | **Day 23.4** | Day 23.4 |
| **Exchange, raw G1–G5 · G6–G10** | 20 · 53 Laurels | 40 · 106, both branches | 60 · 159 |
| **New art** | — | None: the second materials wear uma-art's stones, herbs-spices, hides-scales, bones-horns and mushrooms rows; the second items borrow unused rows | None |

**The design in ten lines:**
1. **Ten branches:** every line keeps its Tier 1 material and gains one from an unused uma-art family (T2P27).
2. **Ten items:** each second material makes a second item at its line's making place, on the first item's recipe size,
   so the two branches of a line cost the same (T2P28).
3. **A grade takes both:** from Tier 2 a weapon, armor slot, accessory slot or Extra Stats node takes its line's first item
   for its base and second item for its Tier 2 path, one tap; a path swaps freely (T2P29, T2P30).
4. **A profession is a branch**, with its own Craft Level 1–50 on Tier 1's curve and gates (T2P31).
5. **A job's EXP goes to its material's profession**, and her speed and gates on it are that profession's (T2P32).
6. **Three professions an Uma:** her trade's two branches, fixed by her calling, and one sub-profession, a branch of
   another line she picks and changes freely, every grade its own level opens (T2P33–T2P36).
7. **Fifteen places hold both branches**, eight slots each from Tier 2; no new place or building (T2P37, T2P38).
8. **Every branch equal:** one rank is 30 refined on each of the ten, 8h 02m a branch at each of its places at Craft Lv
   25, and every forge's longest batch is still 8h 02m (T2P39).
9. **Tier 2 doubles an Uma's farm** (1,908 job-hours a full window). Craft Level stays the fighting party's wall; a run
   of twenty working for itself takes 63.6 days, forty at work make twenty full windows in 31.8, and a full world keeps
   Tier 1's 83.7 with the doubled slots (T2P40, T2P41).
10. **Tier 3 runs Tier 2's farm** (T2P23): no third material, no fourth profession.

## 2. Tier 1 as built

The baseline. Every number is live (engine v21, save v36) and owned by the manual page linked; nothing here is
redesigned (R2-1).

### 2.1 Five lines, fifteen places

Each line is worked at three places in a row: its **gathering place** gathers raw items, its **workbench** processes them
one for one, and its **making place** makes the line's item from refined ones (D230, FL25). No place touches another
line. The Wilds draw them in five rows of three ([sections](../../game/sections.md#wilds)).

| Line | Her trade (calling) | Outfits of 272 | Gather | Process | Make | Its item raises |
|---|---|---|---|---|---|---|
| Metal | Warrior | 48 | Mine (Mining) | Mine Workbench (Smelting) | Weapon Forge (Arms Crafting) | An Arms weapon: Arms Gem |
| Vegetables | Healer | 46 | Fields (Farming) | Fields Workbench (Prepping) | Tome Forge (Tome Crafting) | A Tome: Tome Ink |
| Wood | Spellblade | 72 | Forest (Wood Chopping) | Forest Workbench (Sawing) | Armorer (Armor Crafting) | An armor slot: Armor Fittings |
| Fish | Summoner | 34 | Fishery (Fishing) | Fishery Workbench (Filleting) | Charm Forge (Accessory Crafting) | An accessory slot: Accessory Setting |
| Stone | Mage | 72 | Monster Den (Hunting) | Den Workbench (Stonecutting) | Lapidary (Jewel Crafting) | An Extra Stats node: Planet or Moon Jewel |

- **Her calling names her trade** (CV19, CV20): her Tier 0 by running style, never her active class, so a class switch
  or a promotion moves no job.
- **One Craft Level** (save key `craft`) for all three places; **the open shop** (PP16, FL27): a line whose trade has no
  Uma in the world takes everyone until one arrives; **four slots a place** at ×1.25, no levels (PP4).

### 2.2 Materials, recipes and steps

- **Ten grades a line** (FL5), raw and refined, from one uma-art family each: ores → ingots, vegetables → cuts, logs →
  planks, fish → fillets, crystals → cut stones ([materials](../../game/materials.md#items-by-line)). Grade g opens at
  **Craft Lv 5g − 4** to gather, process and make (FL6), and is worn at Uma Lv 5g − 4.
- **A grade-g item takes grade-g refined items only** (FL7); a jewel's grade is its node's (Planet n 2n − 1, moon n 2n).
- **Every step is equal** (FL28, D264): a gather, a process, and each refined item in a make, 24 minutes at Craft Lv 1
  falling evenly to 16 at Lv 50, before the place's ×1.25.

| Made item | Recipe | Make (steps) | The whole chain (steps) | Chain, slot time at Craft Lv 1 · 25 · 50 |
|---|---|---|---|---|
| Arms Gem G1–G10 | 10 Ingots | 10 | 30 | 9h 36m · 8h 02m · 6h 24m |
| Tome Ink G1–G10 | 10 vegetable cuts | 10 | 30 | 9h 36m · 8h 02m · 6h 24m |
| Armor Fittings G1–G10 | 3 Planks | 3 | 9 | 2h 53m · 2h 25m · 1h 55m |
| Accessory Setting G1–G10 | 5 Fillets | 5 | 15 | 4h 48m · 4h 01m · 3h 12m |
| Planet Jewel I–V · Moon Jewel I–V | 5 cut stones | 5 | 15 | 4h 48m · 4h 01m · 3h 12m |
| *One refined item* | 1 raw | — | 3 | 58m · 48m · 38m |
| *One step* | — | — | 1 | 19m · 16m · 13m |

### 2.3 Jobs, sizes and Craft Level

| Rule | Live value |
|---|---|
| **Sizes** (D233, D264, D273) | Gather or process ×1, ×2, ×3, ×5, ×10, ×15, ×20, ×30; a make to 30 steps: Armor Fittings to ×10, a Setting or a jewel ×6, an Arms Gem or Tome Ink ×3 |
| **Every forge's longest job** | 30 steps: 9h 36m at Craft Lv 1, **8h 02m at Lv 25**, 6h 24m at Lv 50 |
| **Queue** | Up to three jobs behind the running one, same Uma, same place |
| **Craft EXP** | 2 a minute of the job at her level, before the ×1.25 |
| **Craft Level** | 1,425 + 15L EXP a level; 88,200 to Lv 50 (735 job-hours, **24.5 days nonstop**); G10 opens at Lv 46 on day 22.1 |
| **Speed Ticket** | 30 minutes off a running job; 10 Laurels in every world today (XR2 makes it × tier); 5 with every Uma who ascends |
| **Her window** (D283, D289) | Craft I–V at Craft Lv 10 · 20 · 30 · 40 · 50 in every tier |

Sizes, with each one's slot time at Craft Lv 25:

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

**A maxed Uma** (her active class's three weapons, five armor slots and three accessory slots at G10, and the whole
map): 140 made items, 750 refined, **753.1 job-hours** (602 slot-hours), 150 refined and 50.2 job-hours at every one of
the fifteen places; each place's four slots make **2.39 maxed Umas a day** (the ledger).

### 2.5 What Tier 1's numbers leave out (two findings, kept from round 1)

Neither is changed here (R2-1); both shape Tiers 2 and 3.

1. **A full window costs more than a maxed Uma.** Ascend needs a full window (D283), and its Weapons track asks **five
   weapon kinds at G10** (D289), two more than her three: 20 more made items and 200 more refined on the weapon lines,
   **950 refined, 954 job-hours** an Uma. Over a roster split evenly between Arms and Tomes, **Metal and Vegetables
   carry 250 an Uma, the other three lines 150**: the weapon lines' places are 5/3 as busy (83.7 job-hours a place
   against 50.2; 1.43 full windows a day a place against 2.39). Arms Gem and Tome Ink at 6 would even it (5 × 6 = 3 × 10)
   but break the maxed Uma's; Tiers 2 and 3 answer it with the sub-profession instead (T2P22).
2. **The ledger's roster split is stale.** `professions-v4.sim.ts` models forty Umas as 9 · 8 · 9 · 7 · 7 by D220's
   callings. Classes v3 moved 101 outfits (D240): today's callings put forty at **7 · 7 · 11 · 5 · 10** (Metal ·
   Vegetables · Wood · Fish · Stone) and twenty at 4 · 3 · 5 · 3 · 5, which give **1.00 maxed Umas a day, not 1.39**.

| Tier 1 roster | Maxed Umas a day | Binds | Full windows a day | Binds |
|---|---|---|---|---|
| Forty, the ledger's split (9 · 8 · 9 · 7 · 7) | 1.39 | Fish's 7 | 1.08 | Metal's 9 |
| **Forty, today's callings (7 · 7 · 11 · 5 · 10)** | **1.00** | Fish's 5 | **0.84** | Metal's and Vegetables' 7 |
| Twenty, today's callings (4 · 3 · 5 · 3 · 5) | 0.60 | Vegetables' and Fish's 3 | 0.36 | Vegetables' 3 |

## 3. The old calls, call by call

*Kept* stands as written; *Kept, changed* stands with a change (named); *Superseded* was replaced (by a Tier 1 decision
or, now, by a round-2 requirement: **Superseded (R2-n)**); *Broken* was written for a Tier 1 that no longer exists and a
new call fixes it. The archived [second-profession.md](../../archive/design/second-profession.md) (V1–V8, Lore Level)
was replaced by PP18 (D195); nothing of it carries.

### 3.1 profession-progression.md (PP1–PP25)

| Call | What it said | Status | Why, and where it lands |
|---|---|---|---|
| PP1 | Three kinds of work: five gathering, one processing, four making professions | **Superseded** | D224, D230: fifteen place jobs, five of each kind; from Tier 2 a profession is a branch (T2P31) |
| PP2 | Her trade is her calling's pair, one Craft Level; the calling pick sets it | **Kept, changed** | D230, D240: her calling's trio, no pick; from Tier 2 one Craft Level a branch, three an Uma (R2-9, T2P31, T2P33) |
| PP3 | The pairings (Physical Mine · Forge … Magical Monster Den · Lapidary) | **Superseded** | D230, D240: Warrior Metal, Healer Vegetables, Spellblade Wood, Summoner Fish, Mage Stone |
| PP4 | One building a profession, four slots, ×1.25, no upgrades, in every tier | **Kept, changed** | D230: fifteen places; from Tier 2 eight slots a place, either branch (T2P38) |
| PP5 | The same map in every tier, the tier's look; a tier adds type icons | **Kept, changed** | D230, D233: five rows of three; Tier 2's second materials wear uma-art's own rows (T2P43) |
| PP6 | Reuse only: ten frames, sixty icons | **Kept, changed** | Fifteen frames since uma-art 2.14.0 (H113); Tier 2 reuses five more families' rows, draws nothing (T2P43) |
| PP7 | Five lines, a pair a tier: 2 · 4 · 6 types a gathering profession | **Superseded** | D224: ten grades a line (FL5). R2-9 brings back a second material a line, from Tier 2, as its own family and profession (T2P27), not a pair a tier |
| PP8 | One rule for every line's pairs (grades 1, 3 · 6, 8 · 9, 10) | **Superseded** | D224 (FL5): every branch uses all ten grades |
| PP9 | The ladder: Tier 2's pair at G5 and G10, Tier 3's at G5, G10 and G4, G9 | **Superseded** | D224 (FL7, FL8): a grade is the same item in every world; Tier 3 adds no materials (T2P23) |
| PP10 | Recipes: Weapon Gem 4, Fittings 2 · 3, Setting 12 · 6 · 4, Planet 12, Moon 4, Branch Gem 4 | **Superseded** | D264: 10 · 10 · 3 · 5 · 5 · 5 in every tier (T2P4); the second items mirror them (T2P28); no Branch Gem |
| PP11 | Amounts don't scale with the tier; stat values do | **Kept, changed** | The multiplier never scales amounts. Tier 2 adds a second item a grade (R2-9), so its amounts are twice Tier 1's; Tier 3 adds nothing more (T2P40) |
| PP12 | Make time: one gather a refined item | **Kept, changed** | D230 (FL28), D264: one step a refined item, 24 → 16 minutes, by the branch's level (T2P8) |
| PP13 | Low type at Craft Lv 1, high at 26; grade g at 5g − 4; Craft Level restarts each tier | **Kept, changed** | D224 (FL6): grade g at Craft Lv 5g − 4, per profession from Tier 2; every profession restarts on Ascend (T2P9) |
| PP14 | The secondary: from Tier 2, one of the other eight professions, its base work; Tier 3 its Tier 2 work; a change 1,000 Laurels × tier | **Broken** | "Base work" was the base material pair, and the eight were two of ten professions a trade. Round 1 fixed it with a secondary line; round 2's **sub-profession** fixes it (T2P33–T2P35, R2-9) |
| PP15 | The tier's own pair stays her main trade's, a fifth of the work | **Broken** | No tier pair exists. Round 2 keeps no reserve: a sub-profession's own Craft Level gates its grades (T2P34) |
| PP16 | The open shop | **Kept** | Per line, both branches (T2P17) |
| PP17 | The Exchange by pair, 30 · 80 × tier; newer pairs after continents 2 and 4 | **Kept, changed** | D224 (FL12) by grade, D264's 20 · 53; × tier kept; every branch's ten grades (T2P18) |
| PP18 | The old second profession (Lore) replaced | **Kept** | Nothing of it returns |
| PP19 | Old saves: work settled, Craft Levels to 1, stock converted | **Kept** | Built as save v28 (D218, D221); done |
| PP20 | Speed Tickets for the time | **Kept** | Built (D218); × tier (T2P19) |
| PP21 | The Stable's Trade filter | **Kept** | Live; Tier 2 adds a Sub-profession facet (T2P16) |
| PP22 | Pages, pickers, targets; grade chips coloured by their material's tier | **Kept, changed** | D227, D232: one page for fifteen places; no tier colours; pickers list the sub-profession (T2P16) |
| PP23 | Promotion: materials stay in the old world; she arrives at Craft Lv 1, no secondary | **Kept, changed** | D283: Ascend one Uma at a time; she arrives with every profession at Lv 1 and no sub-profession (T2P24) |
| PP24 | The grant's rate | **Kept** | Built; done |
| PP25 | The first launch sheet | **Kept** | Built; done |

### 3.2 farm-by-line.md (FL1–FL34)

| Call | What it said | Status | Why, and where it lands |
|---|---|---|---|
| FL1 | Trades don't move; ten places | **Superseded** | D230 (fifteen places), D240 (trades by Tier 0; 101 outfits moved) |
| FL2 | A making place processes and makes | **Superseded** | D230: each line's workbench processes, the making place only makes |
| FL3 | One item a making place | **Kept, changed** | From Tier 2 two, one a branch (R2-9, T2P28) |
| FL4 | Weapons split by channel: Arms Gem for Arms, Tome Ink for Tomes | **Kept** | So do the second items: Arms Whetstone for Arms, Tome Reagent for Tomes (T2P30) |
| FL5 | Every line one uma-art family of ten grades | **Kept, changed** | From Tier 2 two families a line (R2-9, T2P27) |
| FL6 | Grade g at Craft Lv 5g − 4 to gather, process, make; Uma Lv 5g − 4 to use | **Kept** | The profession's Craft Level from Tier 2 (T2P31) |
| FL7 | A grade-g item takes grade-g refined only | **Kept** | For the second items too |
| FL8 | Every world uses these fifty types until a later release gives them their own | **Kept, changed** | Tier 1 keeps the fifty; Tier 2 and 3 worlds add fifty pairs from five unused families (R2-9, T2P27); no tier has its own beyond that |
| FL9 | Recipes 7 · 7 · 2 · 10 · 10 · 4 | **Superseded** | D264 |
| FL10 | Making at ¾ of a gather a refined item | **Superseded** | D230 (FL28), D264 |
| FL11 | The pace holds (783 h, places 75–83 h) | **Superseded** | D230, D264: 753 job-hours, every place 50.2 |
| FL12 | Buying raw G1–G5 30, G6–G10 80, × tier | **Kept, changed** | D264: 20 · 53 (T2P18) |
| FL13 | Selling raw 6 · 16, refined twice, made 6 + 6g, × tier | **Kept, changed** | D264: raw 4 · 11; made unchanged (T2P18) |
| FL14 | Names: Arms Gem keeps the Weapon Gem ids; Tome Ink | **Kept** | — |
| FL15 | No new art; Tome Ink borrows the infusion bottles | **Kept** | The second items borrow unused rows the same way (T2P43) |
| FL16 | Words for the farm by line | **Kept, changed** | D230: the trios' (i) and blurbs; each place's second job adds its line (T2P37) |
| FL17–FL20 | Save v30: work settled, R2's types converted, the rest stays, the server | **Kept** | Built (D226, D228); done |
| FL21 | R3–R5 take saves v31–v33 | **Superseded** | D238: R3–R5 removed; Tier 2's save is re-planned (T2P45) |
| FL22 | A making place's What step in two groups, Process and Make | **Superseded** | D230: one kind a place (Tier 2's two groups are its two branches, T2P37) |
| FL23 | Warehouse grades, Exchange tabs, the Gear tab's words, Ascend's give-back by channel | **Kept, changed** | D283: Ascend per Uma gives back her grades' first and second items to the old world's Warehouse (T2P24) |
| FL24 | Not changed: the trade by calling, ten places | **Superseded** | D230, D240 |
| FL25 | A trio a line | **Kept** | Each trio holds both branches from Tier 2 (T2P37) |
| FL26 | Ids | **Kept** | — |
| FL27 | Her trade works its three places; trade gate and open shop per place | **Kept, changed** | From Tier 2 the gate reads branches: her trade's two and her sub-profession (R2-9, T2P33) |
| FL28 | Equal steps, 36 → 24 minutes | **Kept, changed** | D264: 24 → 16 (T2P8) |
| FL29 | The amounts stay (FL9) | **Superseded** | D264 |
| FL30 | The pace: 783 h, places 2.17–2.39 | **Kept, changed** | D264: 753 job-hours in Tier 1, every place 2.39; Tier 2 doubles the hours and the slots (T2P38, T2P40) |
| FL31 | Save v31; R3–R5 take v32–v34 | **Kept, changed** | v31 built; D238 removed R3–R5 |
| FL32 | The map's five rows | **Kept, changed** | D233: rows at y 0.155 … 0.795 |
| FL33 | Art: five workbenches, three restyled forges | **Kept** | No new building in Tier 2 (T2P37) |
| FL34 | Sizes in steps up to about 20 | **Kept, changed** | D264 (×30), D273 (every forge to 30 steps, 8h 02m at Lv 25; T2P10) |

### 3.3 Round 1's calls (T2P1–T2P26) in round 2

| Call (round 1) | Round 2 | Why, and where it lands |
|---|---|---|
| T2P1 The five-line rule | **Kept, changed (R2-9)** | Carried to ten branches: 30 a branch a rank (T2P39) |
| T2P2 Amounts by tier (750 refined in every tier) | **Superseded (R2-9)** | Tier 2 and 3 take a second item a grade: 1,500 (T2P40) |
| T2P3 Materials by tier (the same fifty in every world) | **Superseded (R2-9)** | Tier 2 and 3 worlds add fifty pairs (T2P27) |
| T2P4 Recipes by tier | **Kept, changed (R2-9)** | The first items' recipes stand; the second items mirror them (T2P28) |
| T2P5 Weapon branches ride the G5 item | **Superseded (R2-6)** | Weapon types are set at promotion; the second item raises the type at every grade (T2P29, T2P30) |
| T2P6 Accessory branches take no item | **Superseded (R2-7, R2-9)** | The accessory tree's forms take the Inlay at every grade (T2P30) |
| T2P7 The weapon moon's cost | **Kept, changed (R2-8)** | Whatever bodies the Extra Stats doc keeps, a rank sets three jewels and three Stardust (T2P30) |
| T2P8 Steps by tier | **Kept** | By the branch's Craft Level |
| T2P9 Craft Level by tier | **Kept, changed (R2-9)** | Each profession its own curve; all restart on Ascend |
| T2P10 Sizes by tier | **Kept** | D273's rule for every first and second item |
| T2P11 Places and slots | **Kept, changed (R2-9)** | Fifteen places hold both branches (T2P37); eight slots a place (T2P38) |
| T2P12 The secondary line | **Superseded (R2-9)** | The sub-profession: one branch, not a line (T2P33, T2P34) |
| T2P13 G9 and G10 stay her trade's | **Superseded (R2-9)** | No reserve: a sub-profession's own level gates it (T2P34) |
| T2P14 The pick | **Kept, changed (R2-9)** | The sub-profession's pick, same row, free (T2P35) |
| T2P15 Suggested | **Kept, changed (R2-9)** | By branch (T2P36) |
| T2P16 Pickers and words | **Kept, changed (R2-9)** | "Sub-profession" for "Secondary"; no "Main trade only" |
| T2P17 The open shop | **Kept, changed (R2-9)** | Both branches of a line with no Uma of its trade |
| T2P18 The Exchange by tier | **Kept, changed (R2-9)** | Every branch's ten raw grades |
| T2P19 Tickets by tier | **Kept** | × tier (XR2) |
| T2P20 Drills and the farm | **Kept** | No Craft EXP for any profession |
| T2P21 Two yardsticks | **Kept, changed (R2-9)** | The numbers double |
| T2P22 The full window's weapon work | **Kept, changed (R2-9)** | The sub-profession carries it |
| T2P23 Tier 3 | **Kept, changed (R2-9)** | Tier 3 runs Tier 2's ten branches and three professions |
| T2P24 Ascend and the farm | **Kept, changed (R2-9)** | Every profession at Lv 1, no sub-profession |
| T2P25 Save and engine | **Superseded (R2-9)** | T2P45 |
| T2P26 The ledger | **Kept, changed (R2-9)** | Per branch |

### 3.4 The count

| Calls | Kept | Kept, changed | Superseded | Broken | In all |
|---|---|---|---|---|---|
| PP1–PP25 | 7 | 10 | 6 | 2 (PP14, PP15) | 25 |
| FL1–FL34 | 12 | 13 | 9 | 0 | 34 |
| **The approved drafts** | **19** | **23** | **15** | **2** | **59** |
| T2P1–T2P26 (round 1) | 4 | 15 | 7 (all R2) | 0 | 26 |

Round 2 moves four FL rows from Kept to Kept, changed (FL3, FL5, FL8, FL27); the PP statuses stand, with new landings.

### 3.5 The previews

| Page | Now |
|---|---|
| [professions-tiers](previews/professions-tiers.html) | **Rewritten:** the farm Tier 1 → 2 → 3, the Wilds with two branches a row, who may work what |
| [professions-branches](previews/professions-branches.html) | **New:** the ten branches, their twenty grades of items, the ten made items and what each feeds |
| [professions-times](previews/professions-times.html) | **Rewritten:** every step, item and rank timed for both branches, by Craft Level, per item beside totals |
| [professions-demand](previews/professions-demand.html) | **Rewritten:** demand against supply by branch and place, rosters with and without sub-professions, slots, the party's grades, the pace |
| [professions-secondary](previews/professions-secondary.html) | **Rewritten** (the file keeps its name for the README's link): three professions and the sub-profession, the EXP rule, the screens |
| Round 1's old-preview map (`prof-map`, `prof-materials`, `prof-flow`, `prof-demand`, `gear-crafting`; `prof-grant` and the first round retired) | Unchanged: carried into the pages above ([README](README.md) §7.2) |

## 4. Tier 2 in full

### 4.1 What Tier 2 adds, and what it keeps

| Piece | Tier 2 | Call |
|---|---|---|
| **Branches** | **New:** two a line, ten in all; the second from an unused uma-art family | T2P27 |
| **Made items** | **New:** a second item a line, on the first one's recipe size | T2P28 |
| **What a grade takes** | **New:** its line's first item (base) and second item (path), one tap | T2P29, T2P30 |
| **Professions** | **New:** a branch is a profession, its own Craft Level; a job pays its material's profession | T2P31, T2P32 |
| **Professions an Uma** | **New:** three, her trade's two and a sub-profession | T2P33–T2P36 |
| **Places** | Fifteen, each holding both branches; no new building | T2P37 |
| **Slots** | **Eight a place** (either branch), ×1.25, no upgrades | T2P38 |
| **The rule** | Every branch 30 refined a rank; every place 60 | T2P39 |
| **Steps · sizes** | Tier 1's: 24 → 16 minutes, every forge to 30 steps | T2P8, T2P10 |
| **Craft Level** | Tier 1's curve and gates, per profession; all restart on Ascend | T2P9 |
| **The Exchange** | Raw only, both branches, × 2: 40 · 106 Laurels | T2P18 |
| **Tickets** | Speed and Sweep × tier: 20 · 30 in Tier 2 | T2P19 |
| **Drills** | No Craft EXP | T2P20 |

**What the world starts with.** A Tier 2 world fills as Umas ascend, one at a time once each window is full (D283),
usually a won run's twenty. Each arrives with every profession at Lv 1, her trade's two branches open and no
sub-profession, her purse and 5 Speed Tickets; the Warehouse is empty, and the Exchange stocks G1–G5 of every branch
after the tier's first win (continent 6) and G6–G10 after a win on continent 8.

### 4.2 The ten branches (T2P27, T2P28)

**Each line keeps its Tier 1 material as its first branch and gains a second, from one of uma-art's item families the
game doesn't use** (D224's rule: a line is one family of ten grades, ids and icons uma-art's own). Each second family
was picked for its gathering place and for what its making place would make of it:

| Line · trade | Branch | uma-art family | Gather · process · make (the place's job) | Raw G1 → G10 | Refined | Made item (recipe) |
|---|---|---|---|---|---|---|
| **Metal** · Warrior | Metal (1st) | ores | Mining · Smelting · Arms Crafting | Copper … Orichalcum Ore | Ingots | **Arms Gem** (10 Ingots) |
| | **Rock** (2nd) | stones | **Quarrying** · **Masonry** · **Whetstone Crafting** | Limestone, Sandstone, Slate, Granite, Basalt, Marble, Obsidian, Jade, Runestone, Meteorite | Blocks | **Arms Whetstone** (10 Blocks) |
| **Vegetables** · Healer | Vegetables (1st) | vegetables | Farming · Prepping · Tome Crafting | Carrot … Emperor Pumpkin | Cuts | **Tome Ink** (10 cuts) |
| | **Herbs** (2nd) | herbs-spices | **Herb Picking** · **Drying** · **Reagent Crafting** | Basil, Mint, Rosemary, Thyme, Ginger, Peppercorn, Cinnamon, Saffron, Mandrake, Phoenix Pepper | Dried, ground (Dried Basil … Phoenix Spice) | **Tome Reagent** (10 dried herbs) |
| **Wood** · Spellblade | Wood (1st) | woods | Wood Chopping · Sawing · Armor Crafting | Pine Log … Yggdrasil Branch | Planks | **Armor Fittings** (3 Planks) |
| | **Hides** (2nd) | hides-scales | **Trapping** · **Tanning** · **Lining Crafting** | Puffbun Pelt, Boarling Hide, Wolfkin Pelt, Rock Lizard Scale, Ironback Hide, Basilisk Scale, Manticore Hide, Behemoth Hide, Wyvern Scale, Dragon Scale | Leathers (Puffbun Leather … Dragonhide) | **Armor Lining** (3 leathers) |
| **Fish** · Summoner | Fish (1st) | fish | Fishing · Filleting · Accessory Crafting | Carp … Rainbow Koi | Fillets | **Accessory Setting** (5 Fillets) |
| | **Fossils** (2nd) | bones-horns | **Beachcombing** · **Carving** · **Inlay Crafting** | Seashell, Ammonite, Trilobite, Fossil Bone, Mammoth Tusk, Saber Fang, Raptor Claw, Tyrant Tooth, Titan Bone, Unicorn Horn | Carvings (Shell Carving … Unicorn Carving) | **Accessory Inlay** (5 carvings) |
| **Stone** · Mage | Stone (1st) | crystals | Hunting · Stonecutting · Jewel Crafting | Quartz … Philosopher's Stone | Cut stones | **Planet Jewel I–V, Moon Jewel I–V** (5 cut stones) |
| | **Fungi** (2nd) | mushrooms | **Foraging** · **Grinding** · **Stardust Crafting** | Button Mushroom, Shiitake, Oyster Mushroom, Enoki, Chanterelle, Porcini, Morel, Truffle, Glowcap, King Reishi | Dried, powdered (Dried Button Mushroom … Reishi Powder) | **Stardust G1–G10** (5 powders) |

- **Why these five:** a mine quarries rock and a quarry stone makes a whetstone; a field grows herbs and a spell takes
  reagents; a forest is trapped for pelts and armor is lined with leather; the shore gives shells and fossils and a
  charm is inlaid with carvings; a monster den grows cave fungi, ground to a glowing dust for the stars. Rock is named
  apart from the Stone line (gems, not quarry stone).
- **Left unused:** grains, fruits, sweets, nuts-seeds, fibers, and essences (whose refined row is Tome Ink's icon, FL15).
- **The second items mirror the first:** the same recipe size, so a line's two branches cost the same at every grade
  (T2P28). Each takes refined items of its own grade only (FL7). Stardust's grade is its jewel's (Planet n 2n − 1, a
  moon's node n 2n): Planet III takes Stardust G5, a moon's node III Stardust G6.
- **Every grade opens at Craft Lv 5g − 4 of its own profession** (FL6), and is worn at Uma Lv 5g − 4.
- **Ids are uma-art's** (`limestone`, `limestone-block`, `basil`, `dried-basil`, `puffbun-pelt`, `puffbun-leather`,
  `seashell`, `shell-carving`, `button-mushroom`, `dried-button-mushroom` …); stones, hides-scales and bones-horns are
  also the old farm's legacy ids (`identity.ts`), which the economy stage already tells apart (D208, as for ores and
  crystals). Made ids: `whetstone-g1…g10`, `tome-reagent-g1…g10`, `armor-lining-g1…g10`, `accessory-inlay-g1…g10`,
  `stardust-g1…g10`.

The second branches by grade (G2 … G9 in the [branches page](previews/professions-branches.html)):

| Branch | G1 raw → refined | G5 | G10 | Makes, grade 5 |
|---|---|---|---|---|
| Rock | Limestone → Limestone Block | Basalt → Basalt Block | Meteorite → Meteorite Block | Arms Whetstone G5: 10 Basalt Blocks |
| Herbs | Basil → Dried Basil | Ginger → Ground Ginger | Phoenix Pepper → Phoenix Spice | Tome Reagent G5: 10 Ground Ginger |
| Hides | Puffbun Pelt → Puffbun Leather | Ironback Hide → Ironback Leather | Dragon Scale → Dragonhide | Armor Lining G5: 3 Ironback Leathers |
| Fossils | Seashell → Shell Carving | Mammoth Tusk → Tusk Carving | Unicorn Horn → Unicorn Carving | Accessory Inlay G5: 5 Tusk Carvings |
| Fungi | Button Mushroom → Dried Button Mushroom | Chanterelle → Dried Chanterelle | King Reishi → Reishi Powder | Stardust G5 (Planet III): 5 Dried Chanterelles |

### 4.3 What the second items feed (T2P29, T2P30)

**The rule (T2P29): from Tier 2, every grade of every piece takes its line's two items of that grade.** The first item
raises the piece's **base**, Tier 1's value × the tier (a weapon's Might, armor's stat, a slot's base row, a node's
points). The second item raises its **Tier 2 path**, whatever path it has set. One tap on the Gear tab spends both ("Raise
all" too); the Stars tab's Set all sets the jewels and their Stardust. **A path swaps freely:** the second item powers the
grade, not one choice, so changing a weapon's type, a slot's form or a node's branch stat costs nothing on the farm.

| Line | Second item | What it raises from Tier 2 (the dual path it feeds) | Owner | This doc assumes |
|---|---|---|---|---|
| Metal | **Arms Whetstone** | An Arms weapon's **Tier 2 type** at each grade: Pure, Dual with its partner, or an Expander's cross-channel use (an Arm on the Blade Sorcerer's M.ATK) | [gear](gear.md) (R2-6) | A weapon kind's type is set at promotion and swaps freely or cheaply (any re-type cost sits outside a rank); its strength grows with the grade |
| Vegetables | **Tome Reagent** | A Tome's **Tier 2 type**: Pure, Dual, or cross-channel (a Tome on the Wild Magic Brawler's ATK) | gear (R2-6) | The same, for Tomes. By channel, as FL4: a cross-channel Tome still takes Tome Ink and Reagents |
| Wood | **Armor Lining** | An armor slot's **tier step**: from Tier 2 a grade's Lining carries the piece's × tier value, since gear gives armor no Tier 2 path (T2G29; reconciled, XR18) | gear | Hides keeps its full share of Wood's work |
| Fish | **Accessory Inlay** | An accessory slot's **tree** (R2-7): the forms that open as the slot's grade rises (dual ATK and M.ATK, several damage kinds, by shape) | gear (R2-7) | Forms open by the slot's grade and are worn freely; the Inlay raises whichever form she wears |
| Stone | **Stardust** | An Extra Stats node's **branch stat** (R2-8): AoE, multi-hit, a damage kind or channel, a little MP back, a little life steal | [extra stats](extra-stats.md) (R2-8) | Jewels open nodes as in Tier 1 (the Planet's three, a moon's one); **one Stardust a jewel slots the node's branch**, once; the pick then swaps freely. Her moon's two nodes take neither. Any new body keeps three jewels a rank |

This is the owner's "unlocking the moon is one thing but then … slotting the actual extra stat per moon is something
else" on the farm: the jewel unlocks, the Stardust slots. On gear the two items are one raise, since the type is picked at
promotion and the tree's forms open with the grade.

**If a system prices its path otherwise** (a form that costs an item to open, a branch stat that takes two), it comes
back here against T2P39: inside its branch's 30 a rank, or the same on all ten branches. What breaks otherwise:

| If Tier 2 prices a path otherwise | That branch, a maxed Uma | Its line's places, maxed Umas a day (eight slots) | Its trade's share (every line 20% under T2P39) |
|---|---|---|---|
| Nothing (T2P39) | 150 | 2.39 | 20% |
| Whetstones and Reagents only on her one two-kind weapon (T2G3's Dual) | Rock and Herbs 50 | 3.59 (the rest 2.39) | 15.4%: Warriors and Healers short of a third of a line's work |
| Armor with no path and no Lining | Hides 0 | 4.78 | 11.1%: the Spellblades do half a line's work |
| A Stardust a node, not a jewel (the Planet's node one) | Fungi 100 | 2.87 | 17.2% |

### 4.4 A profession a branch, and the EXP rule (T2P31, T2P32)

**Ten professions in a Tier 2 or 3 world, one a branch**, each with its own Craft Level 1–50 on Tier 1's curve
(1,425 + 15L EXP a level, 88,200 to Lv 50) and gates (grade g at its Lv 5g − 4). Tier 1 keeps its one Craft Level.

**The EXP rule (T2P32): a job pays its EXP to the profession of the material it works**, gather, process or make, 2 EXP
a job-minute as today, and **nothing to her other professions**. Her speed on the job (24 → 16 minutes a step) and the
grades she may pick are that profession's. So she levels what she works:

| She works | Job-hours | Her professions reach | Days nonstop |
|---|---|---|---|
| One profession to Lv 50 | 735 | Lv 50 (G10 on day 22.1) | 24.5 |
| Two professions to Lv 50 | 1,470 | Lv 50 · 50 | 49.0 |
| Three professions to Lv 50 | 2,205 | Lv 50 · 50 · 50 | 73.5 |
| Her own maxed Uma's work, split on her trade's two | 753 each | Lv 50 · 50 | 50.2 |
| Her own full window's work, split on her trade's two | 954 each | Lv 50 · 50 | 63.6 |
| Her own full window's work, split on all three | 636 each | Lv 44 · 44 · 44 | 63.6 |
| Tier 1, her full window on one Craft Level | 954 | Lv 50 | 31.8 |

**The work an Uma does for her own window levels her trade's two professions to Lv 50**, as Tier 1's work levels its one:
the doubled farm (T2P40) and the doubled professions keep Tier 1's ratio of work to EXP (954 ÷ 735 = 1,908 ÷ 1,470 =
1.30). Her sub-profession is the extra: what she gives the roster beyond her own line.

**Why separate, not shared:** the owner's "gain Exp differently for each branch". A share to her other professions would
make every Uma level all three on any work and the sub-profession a formality. A different rate by branch would break
the ten-branch rule (T2P39): every hour levels the same, whatever it makes.

### 4.5 Three professions an Uma: the sub-profession (T2P33–T2P36)

| Rule | Value |
|---|---|
| **Her three** (T2P33) | **Her trade's two branches** (her calling's line, fixed, as today) and **one sub-profession**. In Tier 2 and 3 worlds; Tier 1 has none |
| **The sub-profession** (T2P34) | **One branch of another line**: any of the eight branches outside her trade ("from another branch entirely"), at its line's three places |
| **Which grades** | **Every grade its own Craft Level opens** (G10 at its Lv 46). No reserve: her level in it starts at 1, so the trade's Umas reach the top grades first by time |
| **Picking and changing** (T2P35) | On her Template tab's trade row; **free**, any time she isn't working at it ("At work · recall first"). The profession she leaves **keeps its level** for when she returns; she works and levels three at a time |
| **Ascend** | Every profession starts at Lv 1 in the new world; she arrives with no sub-profession |
| **Slots** | She holds one slot at a time, as today |
| **The open shop** | A line with no Uma of its trade in the world takes everyone at both its branches, every grade (T2P17) |
| **Suggested** (T2P36) | Her sheet marks the branch with the fewest hands for its work (below) |

**Why a branch, not a line:** the owner's three professions, literally: her line's two and one more. A whole other line
would be four. **Why no reserve:** each profession has its own Craft Level, so a new sub-profession starts at Lv 1 and
reaches G5 on day 8.8 and G10 on day 22.1 of its own work; the trade's Umas, who arrive working their branches, reach
the top grades first without a rule (round 1's G9–G10 reserve was for one shared Craft Level). **Why free and kept:**
ascending one Uma at a time moves a world's head counts every few days; a fee or a reset would only tax keeping the
lines balanced, and a kept level leaves no exploit, since the work an Uma does is the same hours whichever branch it
levels.

**Suggested (T2P36):** the branch with the fewest hands for its work, where **hands** are its trade's Umas counted half
(each works two branches) plus the Umas whose sub-profession it is, and **work** is a full window's refined from it on a
roster's average (Metal, Rock, Vegetables and Herbs 250; the other six 150). Ties go to the Wilds' order, first branch
first. For twenty at today's callings it names Vegetables, then Herbs, then Metal and Rock, then Fish and Fossils, which
is the order of the shortages below.

**A Tier 2 run of twenty, set up** (today's callings, 4 · 3 · 5 · 3 · 5, working for their own full windows): without
sub-professions the three Healers bind at 0.18 full windows a day (111.6 days); with them the roster is bound only by
its own hours, **0.31 a day: 63.6 days**.

| Line | Its Umas | Need a day at 0.31 (job-hours, both branches) | Its trade gives | Short or spare | Sub-professions on it |
|---|---|---|---|---|---|
| Metal · Rock | 4 | 158 | 120 | 38 short | 2 (from Wood and Stone): one on Metal, one on Rock |
| Vegetables · Herbs | 3 | 158 | 90 | 68 short | 3 (from Wood and Stone): two on Vegetables, one on Herbs, the trade's three leaning to Herbs |
| Wood · Hides | 5 | 95 | 150 | 55 spare | — |
| Fish · Fossils | 3 | 95 | 90 | 5 short | 1 (from Stone), a few hours a day |
| Stone · Fungi | 5 | 95 | 150 | 55 spare | — |

Six of the ten Wood and Stone Umas take sub-professions: three work theirs all day, three a few hours of it (the run is
bound by its hours, so the spare and the shortages match). The trade's Umas spread their own hours over their two
branches as each needs.

**On screen** (the [sub-profession page](previews/professions-secondary.html) draws each):

| Where | What |
|---|---|
| **Her Template tab**, the calling-and-trade row | "Calling · Spellblade · fixed", "Trade · Wood C30 · Hides C22", then **"Sub-profession · Herbs C14"**, or **"Sub-profession · Pick"** while she has none. A tap opens her sheet (Tier 2 and 3 only) |
| **Her sub-profession sheet** | Eight rows, one a branch outside her line, grouped by line: its name, her level in it if she has one ("C14"), "4 Umas · 2 sub-professions" in this world, **Suggested** on one. A tap sets it at once; "None" clears it; refused while she works at it |
| **Her profile's facts row** | "Craft" shows her three: "Wood 30 · Hides 22 · Herbs 14" |
| **A place's Who step** | Her trade's Umas first ("Her trade", both branches), then the branch's sub-professions ("Sub-profession"), then the rest greyed "Another trade". Each face shows her level in the picked branch ("C30") |
| **The targets strip** | A tap on a short item offers her trade's first free Uma, else a sub-profession's |
| **The Stable** | The Trade filter gains a Sub-profession facet with each branch's count |

### 4.6 Places and slots (T2P37, T2P38)

**The fifteen places hold both branches** (T2P37): each line's gathering place gathers both its materials, its
workbench processes both, its making place makes both items. No new place, building or map row: the Wilds keep five rows
of three (D233), and lean assets hold (no building art).

| Place | Its first job (Tier 1) | Its second job (Tier 2 and 3) |
|---|---|---|
| Mine | Mining: ores | **Quarrying:** rock |
| Mine Workbench | Smelting: ore → ingot | **Masonry:** rock → block |
| Weapon Forge | Arms Crafting: Arms Gems | **Whetstone Crafting:** Arms Whetstones |
| Fields | Farming: vegetables | **Herb Picking:** herbs |
| Fields Workbench | Prepping: vegetable → cut | **Drying:** herb → dried or ground |
| Tome Forge | Tome Crafting: Tome Ink | **Reagent Crafting:** Tome Reagents |
| Forest | Wood Chopping: logs | **Trapping:** pelts and scales |
| Forest Workbench | Sawing: log → plank | **Tanning:** hide → leather |
| Armorer | Armor Crafting: Armor Fittings | **Lining Crafting:** Armor Linings |
| Fishery | Fishing: fish | **Beachcombing:** shells and fossils |
| Fishery Workbench | Filleting: fish → fillet | **Carving:** shell or bone → carving |
| Charm Forge | Accessory Crafting: Accessory Settings | **Inlay Crafting:** Accessory Inlays |
| Monster Den | Hunting: crystals | **Foraging:** cave fungi |
| Den Workbench | Stonecutting: crystal → cut stone | **Grinding:** fungus → dried or powdered |
| Lapidary | Jewel Crafting: Planet and Moon Jewels | **Stardust Crafting:** Stardust |

**A place's page in Tier 2:** its header reads "Mine · Mining · Quarrying · 8 slots · ×1.25"; the What step shows its
two branches in two groups (a gathering place's twenty raw items, two rows of ten; a making place's two items' grade
chips), each item card naming its branch ("Rock · G6 · raw · Refines into Marble Block"); the job sheet's Who step
reads the picked branch. Everything else is Tier 1's page.

**Eight slots a place in Tier 2 and 3 worlds (T2P38)**, either branch, ×1.25, no upgrades: 120 slots. Supply is a slot
per working Uma, so slots only matter when a world holds more working Umas than they seat:

| Slots a place | Maxed Umas: slots bind above | Full windows: slots bind above | A 24-party world (120 Umas), full windows |
|---|---|---|---|
| Tier 1: 4 (live) | 60 Umas (every slot) | **46 Umas** (the weapon lines' places) | 83.7 days |
| Tier 2, if 4 | 60 | 46 | **167.3 days** |
| **Tier 2: 8** | **120** | **91** | **83.7 days**, Tier 1's |

Doubling the work without the slots would halve a full world's pace (capitals v2 and the honeycomb seat 24 parties,
D293, D295); doubling both keeps every per-place number Tier 1's: a place's eight slots make **2.39 maxed Umas a day**
on Tier 2's doubled work, as four do on Tier 1's.

### 4.7 Every branch equal: a rank, steps, sizes, Craft Level (T2P39, T2P8–T2P10)

**The ten-branch rule (T2P39): one rank on two Umas (three Arms + three Tomes) is 30 refined on each of the ten
branches,** so each branch spends 8h 02m at each of its three places at Craft Lv 25 and each place 16h 04m for both:

| Line | Branch | Uma on 3 Arms | Uma on 3 Tomes | Both | Per item (chain, slot time at Lv 25) |
|---|---|---|---|---|---|
| Metal | Metal: 3 Arms Gems × 10 | 30 | 0 | 30 | 8h 02m an Arms Gem |
| | Rock: 3 Arms Whetstones × 10 | 30 | 0 | 30 | 8h 02m a Whetstone |
| Vegetables | Vegetables: 3 Tome Ink × 10 | 0 | 30 | 30 | 8h 02m a Tome Ink |
| | Herbs: 3 Tome Reagents × 10 | 0 | 30 | 30 | 8h 02m a Reagent |
| Wood | Wood: 5 Armor Fittings × 3 | 15 | 15 | 30 | 2h 25m a Fittings |
| | Hides: 5 Armor Linings × 3 | 15 | 15 | 30 | 2h 25m a Lining |
| Fish | Fish: 3 Accessory Settings × 5 | 15 | 15 | 30 | 4h 01m a Setting |
| | Fossils: 3 Accessory Inlays × 5 | 15 | 15 | 30 | 4h 01m an Inlay |
| Stone | Stone: 3 jewels × 5 | 15 | 15 | 30 | 4h 01m a jewel |
| | Fungi: 3 Stardust × 5 | 15 | 15 | 30 | 4h 01m a Stardust |

A rank at the Craft Level that opens its grade (slot time; every branch equal, every place equal):

| Grade (Craft Lv) | G1 (1) | G2 (6) | G3 (11) | G4 (16) | G5 (21) | G6 (26) | G7 (31) | G8 (36) | G9 (41) | G10 (46) |
|---|---|---|---|---|---|---|---|---|---|---|
| A branch, at each of its places | 9h 36m | 9h 16m | 8h 57m | 8h 37m | 8h 18m | 7h 58m | 7h 38m | 7h 19m | 6h 59m | 6h 40m |
| A place (both branches) | 19h 12m | 18h 33m | 17h 54m | 17h 14m | 16h 35m | 15h 56m | 15h 17m | 14h 38m | 13h 59m | 13h 19m |

**Steps, sizes and Craft Level are Tier 1's, per profession** (T2P8–T2P10): one step 19m 12s at Lv 1 → 16m 04s at
Lv 25 → 12m 48s at Lv 50 (slot time), by her level in the job's branch; sizes by D273's rule, the second items on their
first item's lists (a Whetstone or Reagent ×1–×3, a Lining ×1–×10, an Inlay or Stardust ×1–×6, a gather or process
×1–×30), so **every forge's longest batch is still 8h 02m at Craft Lv 25**, a place's two branches two batches of it.

| Craft Lv (any profession) | 1 | 6 | 11 | 16 | 21 | 26 | 31 | 36 | 41 | 46 | 50 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Opens | G1 | G2 | G3 | G4 | G5 | G6 | G7 | G8 | G9 | G10 | — |
| Day reached, that profession nonstop | 0 | 2.0 | 4.2 | 6.4 | 8.8 | 11.3 | 13.8 | 16.5 | 19.3 | 22.1 | 24.5 |
| One step, slot time | 19m 12s | 18m 33s | 17m 54s | 17m 14s | 16m 35s | 15m 56s | 15m 17s | 14m 38s | 13m 59s | 13m 19s | 12m 48s |

### 4.8 Demand against supply (T2P40, T2P21, T2P22)

**One Uma, by tier** (every second item on its first one's recipe; per item beside totals):

| Her need | Tier 1 | Tiers 2 and 3 (first + second) | Each item's chain (slot time, Lv 25) | Tier 2 slot-hours |
|---|---|---|---|---|
| Three worn weapons (G1–G10) | 30 items · 300 refined | 60 · 300 + 300 | 8h 02m (Arms Gem, Whetstone, Tome Ink, Reagent) | 482.0 |
| Five armor slots | 50 · 150 | 100 · 150 + 150 | 2h 25m (Fittings, Lining) | 241.0 |
| Three accessory slots | 30 · 150 | 60 · 150 + 150 | 4h 01m (Setting, Inlay) | 241.0 |
| The Planet, I–V (three a node) | 15 · 75 | 30 · 75 + 75 | 4h 01m (jewel, Stardust) | 120.5 |
| Three moons, I–V | 15 · 75 | 30 · 75 + 75 | 4h 01m | 120.5 |
| **A maxed Uma** | **140 · 750 · 753 job-h · 602 slot-h** | **280 · 1,500 · 1,506 job-h · 1,205 slot-h (50.2 slot-days)** | | **1,204.9** |
| Two more weapons for the full window | 20 · 200 | 40 · 400 | 8h 02m | 321.3 |
| **A full window** | **160 · 950 · 954 job-h · 763 slot-h** | **320 · 1,900 · 1,908 job-h · 1,526 slot-h (63.6 slot-days)** | | **1,526.2** |
| Her values (gear, Extra Stats, balance) | × 1 | × 1.8 · × 2.6 | | |

**By branch, one Uma** (refined; a full window's five weapons split 2.5 Arms and 2.5 Tomes on a roster's average):

| | Metal | Rock | Vegetables | Herbs | Wood | Hides | Fish | Fossils | Stone | Fungi |
|---|---|---|---|---|---|---|---|---|---|---|
| A maxed Uma | 150 | 150 | 150 | 150 | 150 | 150 | 150 | 150 | 150 | 150 |
| A full window | 250 | 250 | 250 | 250 | 150 | 150 | 150 | 150 | 150 | 150 |
| A branch's job-hours at each of its places, maxed · full | 50.2 · 83.7 | the same | 50.2 · 83.7 | the same | 50.2 · 50.2 | the same | 50.2 · 50.2 | the same | 50.2 · 50.2 | the same |

A place (both branches): **100.4 job-hours a maxed Uma** (80.3 slot-hours), **167.4 a full window on the weapon lines**
(133.9), 100.4 elsewhere; its eight slots make 2.39 maxed Umas or 1.43 (weapon lines) and 2.39 full windows a day.

**By her class** (refined a branch, a maxed Uma): a Brawler Metal 300 and Rock 300, no Vegetables or Herbs; a two-Arms
hybrid or the Paladin Metal and Rock 200, Vegetables and Herbs 100; a two-Tomes hybrid or the Cleric the reverse; a
Sorcerer Vegetables and Herbs 300; everyone 150 on each of the other six. An Expander's cross-channel weapon counts by
its own channel.

**Rosters** (supply: a slot's day, 24 slot-hours or 30 job-hours, a working Uma; eight slots a place). Without a
sub-profession a line's work waits on its own trade's Umas; with one, on the roster's hours:

| Roster | Tier | Maxed: a day · a party · twenty | Binds | Full windows: a day · a party · twenty | Binds | Sub-professions needed (maxed · full) |
|---|---|---|---|---|---|---|
| Forty, today's callings (7 · 7 · 11 · 5 · 10) | 1 (live) | 1.00 · 5.0 d · 20.1 d | Fish's 5 | 0.84 · 6.0 d · 23.9 d | Metal's, Vegetables' 7 | — |
| The same | 2, no sub-professions | 0.50 · 10.0 d · 40.2 d | Fish's 5 | 0.42 · 12.0 d · 47.8 d | Metal's 7 | — |
| The same | **2, with** | **0.80 · 6.3 d · 25.1 d** | its hours | **0.63 · 7.9 d · 31.8 d** | its hours | 5 · 10 |
| Twenty, today's callings (4 · 3 · 5 · 3 · 5) | 1 (live) | 0.60 · 8.4 d · 33.5 d | Vegetables', Fish's 3 | 0.36 · 13.9 d · 55.8 d | Vegetables' 3 | — |
| The same | 2, no sub-professions | 0.30 · 16.7 d · 66.9 d | Vegetables' 3 | 0.18 · 27.9 d · 111.6 d | Vegetables' 3 | — |
| The same | **2, with** | **0.40 · 12.6 d · 50.2 d** | its hours | **0.31 · 15.9 d · 63.6 d** | its hours | 2 · 6 |
| Twenty, even (4 · 4 · 4 · 4 · 4) | 2 without · with | 0.40 · 0.40 | its hours | 0.24 · 0.31 | Metal · its hours | 0 · 4 |
| Twenty, thin (3 · 3 · 6 · 2 · 6) | 2 without · with | 0.20 · 0.40 | Fish · its hours | 0.18 · 0.31 | Metal · its hours | 4 · 8 |
| Twenty, one Summoner (4 · 4 · 5 · 1 · 6) | 2 without · with | 0.10 · 0.40 | Fish · its hours | 0.10 · 0.31 | Fish · its hours | 3 · 7 |
| Twenty, no Summoner (4 · 4 · 6 · 0 · 6) | 2 without · with | 0.40 · 0.40 (Fish an open shop) | Metal · its hours | 0.24 · 0.31 | Metal · its hours | 0 · 4 (Fish an open shop) |
| Sixty (11 · 10 · 16 · 7 · 16) | 2, with | 1.20 · 4.2 d · 16.7 d | its hours | 0.94 · 5.3 d · 21.2 d | its hours | 8 · 14 |
| Ninety (16 · 15 · 24 · 11 · 24) | 2, with | 1.79 · 2.8 d · 11.2 d | its hours | 1.42 · 3.5 d · 14.1 d | its hours (at the slots' edge) | 12 · 21 |
| 120, a 24-party world (21 · 20 · 32 · 15 · 32) | 2, with | 2.39 · 2.1 d · 8.4 d | every slot | 1.43 · 3.5 d · 13.9 d | the weapon lines' slots | 16 · 7 |

With sub-professions **every split of twenty runs at its hours**: 50.2 days for twenty maxed Umas, 63.6 for twenty full
windows, whatever the callings, and Tier 1's two findings (thin trades, the full window's weapon lines) are carried by
the sub-profession (T2P22).

**The fighting party's grades** (a Tier 2 run of twenty with sub-professions, all at work, the party's needs first; a
grade opens when one Uma has worked its branch from the start, so ten Umas keep one branch each early on):

| Grade | G1 | G2 | G3 | G4 | G5 | G6 | G7 | G8 | G9 | G10 |
|---|---|---|---|---|---|---|---|---|---|---|
| Opens (a profession's Lv 5g − 4), day | 0 | 2.0 | 4.2 | 6.4 | 8.8 | 11.3 | 13.8 | 16.5 | 19.3 | 22.1 |
| The party holds it, Tier 1 (twenty, live) | 0.8 | 2.9 | 5.0 | 7.3 | 9.6 | 12.1 | 14.6 | 17.3 | 20.1 | 23.0 |
| **The party holds it, Tier 2** | **1.3** | **3.3** | **5.4** | **7.7** | **10.0** | **12.5** | **15.1** | **17.7** | **20.5** | **23.4** |
| The run of twenty holds it, Tier 2 (full windows) | 6.4 | 12.7 | 19.1 | 25.4 | 31.8 | 38.2 | 44.5 | 50.9 | 57.2 | 63.6 |
| The run of twenty holds it, Tier 1 (live) | 5.6 | 11.2 | 16.7 | 22.3 | 27.9 | 33.5 | 39.0 | 44.6 | 50.2 | 55.8 |
| The run of twenty, forty at work, Tier 2 | 3.2 | 6.4 | 9.5 | 12.7 | 15.9 | 19.1 | 22.3 | 25.4 | 28.6 | 31.8 |

**Craft Level, not volume, stays the fighting party's wall**: the party holds each grade within a day and a half of its
opening (Tier 1: under a day). The run's whole set of windows is volume-bound, as Tier 1's is with its thin trades.

### 4.9 Tier 2's pace (T2P41) and the Craft track (T2P42)

**Tier 2 doubles an Uma's farm**, and the doubled slots keep a full world at Tier 1's pace. What moves:

| Clock | Tier 1 (live) | Tier 2 | Why |
|---|---|---|---|
| The fighting party holds G10 (twenty at work) | Day 23.0 | **Day 23.4** | Craft Level is the wall; ten Umas on ten branches keep Tier 1's grade days |
| Her own Craft V (one profession at Lv 50, T2P42) | 24.5 days | **24.5** | Unchanged |
| Twenty full windows, twenty at work | 55.8 days (Vegetables' three bind) | **63.6** | Twice the work; the sub-professions lift the thin trades' bind |
| Twenty full windows, forty at work | 23.9 days | **31.8** | |
| A full 24-party world (120 Umas) | 83.7 days | **83.7** | Eight slots a place |
| Her trade's two professions at Lv 50 | — | Inside her own window's work (63.6 days; 49.0 for two at 50) | The ratio of work to EXP is Tier 1's |

**The recommendation is the doubling** (the owner's "increase greatly"; a branch's work that levels its profession; every
per-item time and D273's batch Tier 1's). The run of twenty working only for itself is the clock that moves: 63.6 days
against round 1's 31.8 (with a secondary) and Tier 1's live 55.8. [Progression](progression.md) (T2W12) reads this
number.

**The alternative, Tier 1's time** (if the owner wants a run of twenty at round 1's 31.8 days): halve Tier 2's step (12 →
8 minutes before the ×1.25) and double the sizes (gathers to ×60, an Arms Gem or Whetstone ×6, a Lining ×20, an Inlay or
Stardust ×12), so every forge's longest batch stays 8h 02m and an Uma's hours are Tier 1's (954 job-hours a full window,
four slots a place enough).
The costs: every Tier 2 item takes half Tier 1's time, and the work no longer levels three professions (her full window's
954 job-hours bring her trade's two to Lv 34 each), unless Craft EXP doubles too, and then a branch's G10 opens on day
11, so gear outruns fights.

**The Craft track (T2P42, for progression's R2-10):** **Craft I–V on her best profession at Lv 10 · 20 · 30 · 40 · 50**,
Tier 1's rule read on her three (Craft V on day 24.5 nonstop), so the farm never delays the fighting party's windows.
The alternative that makes the board ask for the three professions: Craft V as **two professions at Lv 50** (49.0 days
nonstop, inside a run's 63.6-day farm but past the party's 24.5); its days by step 7.5 · 16.6 · 26.6 · 37.4 · 49.0 for
two at Lv 10n, 11.3 · 24.9 · 39.9 · 56.1 · 73.5 for three.

### 4.10 The Exchange, Speed Tickets and Drills by branch (T2P18–T2P20)

**Raw only, every branch's ten grades**, up to 99 at a time; refined and made items only from the Wilds. Its five line
tabs each hold two sections, the first branch first ("Metal · Rock").

| | Tier 1 | Tier 2 | Tier 3 |
|---|---|---|---|
| Raw G1–G5, every branch · stocked | 20 · after the tier's first win | 40 · after the first win (continent 6) | 60 · after the first win (continent 11) |
| Raw G6–G10, every branch · stocked | 53 · after a win on continent 3 | 106 · after a win on continent 8 | 159 · after a win on continent 13 |
| A rank's raw, one branch (30) · a line (60) | 600 · 1,590 a line (one branch) | 1,200 · 3,180 a branch; 2,400 · 6,360 a line | 1,800 · 4,770 a branch; 3,600 · 9,540 a line |
| Selling raw G1–G5 · G6–G10 | 4 · 11 | 8 · 22 | 12 · 33 |
| Selling refined | 8 · 22 | 16 · 44 | 24 · 66 |
| Selling a made item of grade g (first or second) | 6 + 6g (12 … 66) | × 2 (24 … 132) | × 3 (36 … 198) |
| Speed Ticket · Sweep Ticket (XR2) | 10 · 15 | **20 · 30** | **30 · 45** |
| A branch's rank at one place by Speed Tickets (8h 02m, 17 tickets) | 170 Laurels | 340 | 510 |
| Class Manual | 1,000 Class Marks | the same | the same |

- **× tier** because a tier's fights pay × tier (D170): a raw item, and 30 minutes of any branch's job, cost the same
  number of fights in every tier.
- **Speed Tickets** take 30 minutes off any job, either branch; "Finish all" on a place counts its eight slots.
- **Drills pay no Craft EXP to any profession** (T2P20); they stay [progression](progression.md)'s (Training Logs).

### 4.11 The Warehouse, icons and names (T2P43, T2P44)

- **The Warehouse** keeps its seven shelves (All, Metal, Wood, Vegetables, Fish, Stone, Made items): each line's shelf
  holds both branches, raw then refined (forty stacks a line in a Tier 2 world); Made items gains the five second items
  after their first ones (Arms Gems, Whetstones, Tome Ink, Reagents, Fittings, Linings, Settings, Inlays, Planet and Moon
  Jewels, Stardust). A stack's sheet: "Rock · G3 · raw · Refines into Slate Block", "Grade 5 · Raises an Arms weapon's
  type one grade", "Slots a node's branch stat · Planet III".
- **Icons, no new art (T2P43):** the second materials wear uma-art's own rows (items atlas: stones rows 24–25,
  herbs-spices 6–7, hides-scales 16–17, bones-horns 30–31, mushrooms 10–11), each item its family's frame at its grade.
  The second items borrow unused rows, as Tome Ink borrows the infusion bottles (FL15): Tome Reagent the items atlas's
  tonic vials (row 33); Arms Whetstone and Stardust two unused gems-atlas rows (the jewels use `gem-sun` and
  `gem-limit`); Armor Lining the gear atlas's retired `leather` row; Accessory Inlay a retired `amulet-*` row. The build
  packet confirms each row is unused; a bespoke icon is a later art packet for ChatGPT, never a blocker.
- **Names (T2P44):** the five branches (Rock, Herbs, Hides, Fossils, Fungi), the fifteen second jobs (§4.6), the five
  items (Arms Whetstone, Tome Reagent, Armor Lining, Accessory Inlay, Stardust), the screens' words (Sub-profession,
  Her trade, Another trade, Suggested) and all hundred uma-art names of the five families: checked, case-insensitive
  and exact, against every string of the master-data release (ten files): **no match**, except the bare words "Sub"
  and "Path", which no screen uses alone ("Sub-profession", "Tier 2 path").

## 5. Tier 3 in full (T2P23)

**Tier 3 runs Tier 2's farm.** The same ten branches, items, recipes, steps, sizes, places and eight slots; the same
three professions an Uma, each restarting at Lv 1 when she ascends; the Exchange × 3 (§4.10). What deepens comes from
the systems the items feed: a weapon's Tier 3 type, the accessory tree's Tier 3 step, Extra Stats' Tier 3 branches,
each raised by the same second item at each grade.

| | Tier 3 | Why |
|---|---|---|
| A third material a line | No | Three items a grade would make a full window 2,862 job-hours (95 slot-days), past any run's pacing |
| A fourth profession | No | Twenty already run at their hours with one sub-profession; one rule to learn |
| Its own materials | No | Its Warehouse is its own; grade g is the same item in every world |
| A run of twenty | 50.2 days maxed, 63.6 full windows; the party holds G10 on day 23.4 | As Tier 2 |
| Values | × 2.6 on what the items raise | [Balance](balance.md) (T2B1) |

## 6. Provides and assumes

### 6.1 What the other docs read here

| Doc | Reads | Calls |
|---|---|---|
| **gear.md (T2G)** | From Tier 2 each grade of a weapon, armor slot and accessory slot takes its line's first and second item of that grade (Arms Gem + Arms Whetstone, Tome Ink + Tome Reagent, Fittings + Lining, Setting + Inlay), one raise; a path swaps freely; any re-type or form cost sits outside a rank or keeps T2P39; recipes; gates Craft Lv 5g − 4, Uma Lv 5g − 4 | T2P28–T2P30, T2P39 |
| **extra-stats.md (T2E)** | Jewels as Tier 1's (5 cut stones of the node's grade, three a rank); one Stardust a jewel slots a node's branch stat, once, then the pick swaps freely; her moon takes neither; any body keeps three jewels a rank | T2P28–T2P30 |
| **progression.md (T2W)** | Every profession restarts at Lv 1 on Ascend; the Craft track's recommendation (her best profession at Lv 10n; or two at Lv 50 for Craft V, 49 days); a run of twenty's farm (50.2 days maxed, 63.6 full windows; 31.8 with forty at work; a 24-party world 83.7); the party holds G10 on day 23.4; the Exchange's stocking; tickets × tier; Drills pay no Craft EXP; she arrives with no sub-profession | T2P9, T2P18–T2P24, T2P40–T2P42 |
| **balance.md (T2B)** | When a grade is held: the fighting party within a day and a half of its opening, so on-curve gear by level is Tier 1's in every tier; nothing here is a stat | T2P41 |
| **templates.md (T2U)** | Her calling still names her trade; her Template tab's calling-and-trade row hosts the sub-profession (T2U20: no Craft bonus) | T2P33, T2P35 |
| **classes.md (T2C)** | A class switch, a Tier 2 promotion or a reclass never moves her trade or her sub-profession; an Expander's cross-channel weapon is raised by its own channel's line | T2P30, T2P33 |

### 6.2 What this doc assumes from them

| From | Assumes | If it differs |
|---|---|---|
| **T2G (R2-6)** | Weapon grades G0–G10 per kind; three slots; a kind's Tier 2 type (Pure, Dual and partner, or an Expander's cross-channel use) set at promotion and swapped freely or cheaply, its strength by grade | A type that costs items comes back against T2P39: inside its branch's 30, or the same on all ten |
| **T2G (armor)** | Five armor slots G0–G10; no Tier 2 path (T2G29): the Lining carries the armor's tier step (§4.3), so Hides keeps its share (reconciled, XR18) | — |
| **T2G (R2-7)** | Three accessory slots G0–G10; the tree's forms open with the slot's grade and are worn freely | A form that takes its own item comes back here |
| **T2E (R2-8)** | Jewels open nodes (three a rank); every open node takes a branch stat she picks and swaps freely; her moon's two nodes as Tier 1's | A Stardust a node, not a jewel, drops Fungi to 100 a maxed Uma (§4.3): T2E keeps a jewel's count or the Planet's node takes three |
| **T2W (R2-10)** | Ascend one Uma at a time with a full window (D283); the Weapons track five kinds at G10; Tier 2's continents 6–10; a world usually starts with a won run's twenty | A smaller Weapons ask moves the full window toward the maxed Uma (1,500); a Craft track of two professions moves her floor to 49 days |
| **T2C (R2-2–R2-5)** | Sixteen Tier 2 classes on Tier 1's three weapon slots, Arms or Tomes; her calling by running style in every tier | A fourth weapon slot would add a weapon's 10 + 10 a grade to its channel's two branches |
| **T2B** | Values × 1.8 and × 2.6 on what the items raise | — |
| **T2U** | The Template tab's calling-and-trade row in every tier | The sub-profession sheet opens from wherever her trade shows |

## 7. Save and engine (T2P45)

Roughly, for the re-plan; not packets. Everything is in Tier 2 and 3 worlds only: a Tier 1 world reads as it does today.

| Area | Change | Version |
|---|---|---|
| **Save: professions** | `OwnedUma.crafts?: Partial<Record<BranchId, { level: number; exp: number }>>` in Tier 2 and 3 worlds (a profession appears the first time she works it); `craft` stays Tier 1's. `OwnedUma.sub?: BranchId`, never a branch of her trade's line. **Migration:** a Tier 2 or 3 world's existing Umas' `craft` becomes `crafts[her trade's first branch]` (they ran Tier 1's farm × tier until now) | Tier 2's toolbox save (progression's plan: v39) |
| **Items** | 100 line items from five uma-art families (`LINE_GRADES` gains a second branch a line: `BranchId` metal, rock, vegetables, herbs, wood, hides, fish, fossils, stone, fungi); 50 made ids (`whetstone`, `tome-reagent`, `armor-lining`, `accessory-inlay`, `stardust`, G1–G10); `RECIPE_V4` gains five lines; `branch-gem` (D225's placeholder) retires | Same release |
| **Places and work** | `PLACES_V4`: each place's two branches; eight slots in a Tier 2+ world (`PLACE_SLOTS_V3` by tier); the trade gate reads branches (her trade's two, her sub-profession; the open shop per line); a job's EXP to its item's branch; its step and gates by that branch's level. uma-work unchanged (slots are a place's config, EXP the game's) | Same release |
| **Raises** | A Tier 2+ raise spends the grade's first and second items (the Gear tab's and the Stars tab's stages, T2G's and T2E's packets); Ascend gives both back to the old world's Warehouse, jewels and Stardust gone | With T2G's and T2E's packets |
| **Screens** | The place page's two groups and eight slot rows (game-side: `PlaceV4`'s What step; a "Both apps" request only if uma-kit's job sheet needs a group header); the Template tab's trade row and the sub-profession sheet; the profile's Craft facts; the Who step's groups; the targets strip; the Stable's facet; the Exchange's two sections a tab; the Warehouse's shelves | Same release |
| **Ledger** | `professions-v4.sim.ts` gains branches, the full window, today's callings (7 · 7 · 11 · 5 · 10; its 9 · 8 · 9 · 7 · 7 is D220's) and sub-profession rosters (T2P26) | Test support only |
| **Battle engine** | None: nothing here reaches a fight; the paths' values are T2G's and T2E's stages | — |

## 8. Pacing

Where the farm takes time in Tiers 2 and 3 (slot time unless marked; per item beside totals):

| Piece | Time | Per item beside it |
|---|---|---|
| One step | 19m (Lv 1) · 16m (Lv 25) · 13m (Lv 50) | — |
| A refined item, its three steps | 58m · 48m · 38m | 1 gather, 1 process, 1 make step |
| An Arms Gem or Whetstone; Tome Ink or Reagent | 9h 36m · 8h 02m · 6h 24m | 10 refined × 48m at Lv 25 |
| Armor Fittings or a Lining | 2h 53m · 2h 25m · 1h 55m | 3 × 48m |
| A Setting or an Inlay; a jewel or a Stardust | 4h 48m · 4h 01m · 3h 12m | 5 × 48m |
| A rank, a branch at each of its places | 9h 36m at G1's Craft Lv 1 → 6h 40m at G10's Lv 46; 8h 02m at Lv 25 | 30 steps |
| A rank, a place (both branches) | 19h 12m → 13h 19m; 16h 04m at Lv 25 | 60 steps, two 8h 02m batches |
| Her own rank (one grade of everything, one Uma) | 120.5 slot-hours (5.0 slot-days; Tier 1 2.5) | 150 refined over her branches |
| A maxed Uma | 1,205 slot-hours (1,506 job-hours), 50.2 slot-days | 280 items; 150 refined a branch |
| A full window | 1,526 slot-hours (1,908 job-hours), 63.6 slot-days | 320 items; the weapon lines' four branches 250 each |
| A profession, Lv 1 → 50 | 588 slot-hours, 24.5 days nonstop; G10 on day 22.1 | 1,425 + 15L EXP a level |
| A new sub-profession to G5 · G8 · G10 | 8.8 · 16.5 · 22.1 days of its work | — |
| A run of twenty, with sub-professions | 50.2 days maxed, 63.6 full windows | 0.40 · 0.31 a day |
| The same without (today's callings) | 66.9 · 111.6 days | 0.30 · 0.18 a day |
| Forty, with sub-professions | 25.1 · 31.8 days for twenty | 0.80 · 0.63 a day |
| A 24-party world, 120 Umas | 50.2 · 83.7 days for all | 2.39 · 1.43 a day (slots) |

- **The owner's pattern** (one party fights while dozens work, raised in step): Craft Level stays the fighting party's
  wall (G10 held on day 23.4 against Tier 1's 23.0); the roster's volume decides when a run is ready, and with dozens at
  work the doubled farm is paid by the extra hands (forty make twenty full windows in 31.8 days, what twenty take on
  Tier 1's work when no trade binds).
- **The sub-profession is the tier's balancer:** it takes a Tier 2 world of twenty from 111.6 to 63.6 days for full
  windows, whatever the callings.
- **What would move it:** a path that costs items on one branch (§4.3); a window that asks more weapons; the alternative
  half step (§4.9); a world with more working Umas than 120 slots.

## 9. Decisions

Every call, with the recommended answer. The owner reviews them all. Round 1's calls carry their round-2 status; a
superseded one names what replaced it.

### 9.1 Round 2's calls (T2P27–T2P45)

| Call | Recommendation | Alternatives, briefly | Why |
|---|---|---|---|
| **T2P27** Ten branches | **From Tier 2 each line has two materials: Metal · Rock (stones), Vegetables · Herbs (herbs-spices), Wood · Hides (hides-scales), Fish · Fossils (bones-horns), Stone · Fungi (mushrooms), the second from an unused uma-art family; Tier 1 keeps one a line** | Fibers for Herbs or Hides; essences for Fungi (its refined row is Tome Ink's icon); a tier's own families | The owner's "2 types of materials" a farming type; each family fits its gathering place and its making place; no new art |
| **T2P28** The second made items | **Arms Whetstone (10 Blocks), Tome Reagent (10 dried herbs), Armor Lining (3 leathers), Accessory Inlay (5 carvings), Stardust (5 powders), G1–G10 each, made at the line's making place; each on its first item's recipe size** | Smaller second recipes (Armor's 3 can't halve); one shared Tier 2 item | "Farmed and processed and finally crafted"; mirrored recipes keep a line's two branches equal |
| **T2P29** A grade takes both | **From Tier 2 every grade of every piece takes its line's two items of that grade: the first raises its base (Tier 1's value × tier), the second its Tier 2 path; one tap spends both; a path swaps freely, no item tied to a path** | The second item only on dual paths (Dual weapons, Twofold forms): its branch idles on every Pure pick; a second grade axis a piece | Feeds "every dual path" whatever she picks, so every branch's demand is equal and swapping stays free |
| **T2P30** What each feeds | **Whetstone and Reagent: a weapon's Tier 2 type by its channel (Pure, Dual and partner, cross-channel); Lining: armor's tier step (gear's T2G29: armor has no Tier 2 path; reconciled, XR18); Inlay: the accessory tree's forms; Stardust: an Extra Stats node's branch stat, one a jewel, slotted once** | Cross-feeding (Fish's item into weapons); Stardust a node (Fungi 100, §4.3) | Each line keeps feeding its own system (FL4); one Stardust a jewel keeps three a rank |
| **T2P31** A profession a branch | **Ten professions in a Tier 2 or 3 world, each its own Craft Level 1–50 on Tier 1's curve (88,200 EXP) and gates (5g − 4); Tier 1 keeps one Craft Level** | One Craft Level a line; a shorter curve a profession | "Gain Exp differently for each branch"; Tier 1's curve keeps Tier 1's grade days |
| **T2P32** The EXP rule | **A job pays 2 EXP a job-minute to the profession of the material it gathers, processes or makes, nothing to her other two; her speed and gates on it are that profession's** | A share to her other professions; a rate by branch | She levels what she works; a share makes the sub-profession a formality, a rate breaks T2P39 |
| **T2P33** Three professions | **Her trade's two branches (her calling's line, fixed) and one sub-profession, in Tier 2 and 3 worlds; none in Tier 1** | Any three branches; four in Tier 3 | "Level 3 total professions"; the calling keeps naming her trade (CV20, T2U20) |
| **T2P34** The sub-profession | **One branch of another line (any of the eight outside her trade), at its three places, every grade her level in it opens; no reserve** | A whole line (four professions); round 1's G9–G10 reserve; a branch of her own line | "From another branch entirely"; a new profession starts at Lv 1, so the trade reaches the top grades first by time |
| **T2P35** Picking and changing it | **On her Template tab's trade row: free, any time she isn't working at it; the profession she leaves keeps its level; cleared on Ascend** | PP14's 1,000 Laurels × tier; a reset to Lv 1 on a change | Ascend one at a time keeps moving head counts; a kept level is no exploit, the hours are the same |
| **T2P36** Suggested | **The branch with the fewest hands for its work: its trade's Umas counted half plus its sub-professions, over a full window's refined from it (the weapon lines' four branches 250, the other six 150); ties by the Wilds' order** | No suggestion; by targets' short hours | Dozens of Umas to set; names the run's real shortages (Vegetables, Herbs, Metal, Rock first) |
| **T2P37** Places hold both branches | **Fifteen places, no new place or building: each gathers, processes or makes both its line's branches; its second job named (Quarrying, Masonry, Whetstone Crafting; Herb Picking, Drying, Reagent Crafting; Trapping, Tanning, Lining Crafting; Beachcombing, Carving, Inlay Crafting; Foraging, Grinding, Stardust Crafting); the What step in two groups** | Five new trios (30 places, new art); a second place a line | Lean assets; the trio already reads gather → process → make |
| **T2P38** Eight slots a place | **Eight a place in Tier 2 and 3 worlds, either branch, ×1.25, no upgrades (120): slots bind above 91 Umas on full windows, 120 on maxed; a 24-party world's full windows in Tier 1's 83.7 days** | Four (a full world 167.3 days; binds above 46); four a branch | Doubled work and doubled seats keep every per-place number Tier 1's |
| **T2P39** The ten-branch rule | **One rank on two Umas (3 Arms + 3 Tomes) is 30 refined on each of the ten branches: 8h 02m a branch at each of its places and 16h 04m a place at Craft Lv 25; any new piece fits inside its branch's 30 or adds the same to all ten** | Let paths land where they fall | D264 ("fully standardize") carried to ten branches; the owner checks that every line and place takes the same hours |
| **T2P40** Amounts in Tiers 2 and 3 | **A maxed Uma 280 items · 1,500 refined · 1,506 job-hours (50.2 slot-days); a full window 320 · 1,900 · 1,908 (63.6); 150 a branch (250 on the weapon lines' four on a full window); Tier 1 as built** | Tier 1's amounts with a half step (§4.9); Tier 3 a third item | The owner's "increase greatly"; each branch's work levels its profession |
| **T2P41** Tier 2's pace | **The doubling: the fighting party holds G10 on day 23.4 (Tier 1 23.0); a run of twenty working for itself 63.6 days for full windows (50.2 maxed); forty make twenty in 31.8; a full world 83.7, Tier 1's. Progression's T2W12 reads these** | Tier 1's time: a half step (12 → 8 minutes) and doubled sizes, every item half Tier 1's time and the professions thin (or EXP ×2 and gear outruns fights) | Keeps every per-item time and D273's batch; Craft stays the party's wall; dozens at work keep Tier 1's run time |
| **T2P42** The Craft track (for T2W, R2-10) | **Progression's T2W26: her three Craft Levels add up to 12 · 24 · 36 · 48 · 60 (Craft V 24.9 days with an even split, 27.8 a specialist, against Tier 1's 24.5), so the track reads all three professions** (reconciled, XR17) | Craft I–V on her best profession at Lv 10 · 20 · 30 · 40 · 50 (the round-2 draft: Craft V on day 24.5, the other two unread); two professions at Lv 50 (49.0 days) | The farm never delays the party's windows; her own work brings her trade's two to Lv 50 and the sum to 60 well before the Rift |
| **T2P43** The Warehouse and icons | **Shelves by line, both branches on each; Made items gains the five second items after their first; the second materials wear uma-art's own rows, the second items borrow unused rows (tonic vials, two gems rows, the retired `leather` and an `amulet-*` row); no new art** | Bespoke icons (a later ChatGPT art packet); a shelf a branch (twelve shelves) | Lean assets (FL15's precedent); a line's two branches sit together |
| **T2P44** Names | **Rock, Herbs, Hides, Fossils, Fungi; the fifteen second jobs; Arms Whetstone, Tome Reagent, Armor Lining, Accessory Inlay, Stardust; "Sub-profession" and "Tier 2 path", never "Sub" or "Path" alone: all checked against every master-data string, no match** | "Quarry" for Rock (a place's name); "Shells" for Fossils (seven of ten are bones) | No original-game content; plain words |
| **T2P45** Save and engine | **`OwnedUma.crafts` by branch and `OwnedUma.sub` in Tier 2 and 3 worlds at Tier 2's toolbox save; a world's existing `craft` migrates to her trade's first branch; 150 ids; places' branches and eight slots by tier; no battle engine change** | A field in every world; no migration (existing Tier 2 Umas back to Lv 1) | Tier 1 untouched; nobody already in Tier 2 loses a level |

### 9.2 Round 1's calls (T2P1–T2P26), with their round-2 status

| Call | Status | Recommendation now | Alternatives, briefly | Why |
|---|---|---|---|---|
| **T2P1** The five-line rule | Kept, changed (R2-9) | **Every line equal, carried to ten branches (T2P39)** | — | D264 |
| **T2P2** Amounts by tier | **Superseded (R2-9)** by T2P40 | — | — | Tier 2 takes a second item a grade |
| **T2P3** Materials by tier | **Superseded (R2-9)** by T2P27 | — | — | Fifty more pairs from Tier 2 |
| **T2P4** Recipes by tier | Kept, changed (R2-9) | **Arms Gem and Tome Ink 10, Fittings 3, Setting 5, jewels 5 in every tier; the second items mirror them (T2P28)** | Smaller later recipes | D264's numbers |
| **T2P5** Weapon branches | **Superseded (R2-6)** by T2P29, T2P30 | — | — | Types are set at promotion; the Whetstone or Reagent raises the type at every grade; no Branch Gem |
| **T2P6** Accessory branches | **Superseded (R2-7, R2-9)** by T2P30 | — | — | The tree's forms take the Inlay at every grade |
| **T2P7** The weapon moon's cost | Kept, changed (R2-8) | **Whatever bodies T2E keeps, a rank sets three jewels and three Stardust** | A jewel a node on a new body (Stone 175) | Keeps Stone and Fungi at 30 a rank |
| **T2P8** Steps by tier | Kept | **24 → 16 minutes by her level in the job's branch, ×1.25, one step a gather, a process or a refined item in a make, in every tier** | Faster later steps (§4.9's alternative) | D264, FL28 |
| **T2P9** Craft Level by tier | Kept, changed (R2-9) | **Every profession restarts at Lv 1 on Ascend, on Tier 1's curve and gates** | Carry levels; a head start | PP13 and D283's note |
| **T2P10** Sizes by tier | Kept | **D273's rule for every first and second item: every forge's longest job 9h 36m · 8h 02m · 6h 24m at Craft Lv 1 · 25 · 50; three queued** | Longer jobs | The owner's 8h 02m mark |
| **T2P11** Places and slots | Kept, changed (R2-9) | **Fifteen places holding both branches (T2P37), eight slots each (T2P38), the tier's tint, no new building art** | More places | Lean assets |
| **T2P12** The secondary | **Superseded (R2-9)** by T2P33, T2P34 | — | — | A sub-profession is one branch |
| **T2P13** The top stays her trade's | **Superseded (R2-9)** by T2P34 | — | — | Each profession's own Craft Level gates it |
| **T2P14** The pick | Kept, changed (R2-9) | **The sub-profession's pick on her Template tab's trade row, free, cleared on Ascend (T2P35)** | A fee; on the place page | — |
| **T2P15** Suggested | Kept, changed (R2-9) | **By branch (T2P36)** | — | — |
| **T2P16** Pickers and words | Kept, changed (R2-9) | **Who lists "Her trade", then "Sub-profession", then the rest greyed "Another trade", each face with her level in the picked branch; targets offer the trade first; the Stable gains a Sub-profession facet; the profile's Craft shows her three** | One flat list | One place, one job, the reason on the row (PP22) |
| **T2P17** The open shop | Kept, changed (R2-9) | **A line with no Uma of its trade opens both its branches to everyone, every grade** | Sub-professions only | PP16: a world without Summoners still makes Settings and Inlays |
| **T2P18** The Exchange by tier | Kept, changed (R2-9) | **Raw only, every branch's ten grades: G1–G5 20 × tier after the tier's first win, G6–G10 53 × tier after a win on its continent 3 (8, 13); selling × tier; two sections a line tab** | Flat prices; refined for sale | A raw item costs the same fights in every tier |
| **T2P19** Tickets by tier | Kept | **Speed and Sweep Tickets × tier (20 · 30, 30 · 45), as T2W10 and XR2; Class Manual 1,000 Class Marks** | Flat | A Laurel buys the same time in every tier |
| **T2P20** Drills and the farm | Kept | **Drills pay no Craft EXP to any profession in any tier** | Craft Logs | D283's note; Speed Tickets are the craft's fast-forward |
| **T2P21** Two yardsticks | Kept, changed (R2-9) | **Report a maxed Uma (1,500 refined, 150 a branch) and a full window (1,900, the weapon lines' four branches 250); the full window is the ascend number** | The maxed Uma alone | Ascend needs a full window (D289) |
| **T2P22** The full window's weapon work | Kept, changed (R2-9) | **In Tiers 2 and 3 the sub-profession carries it; recipes stay; Tier 1 as built** | Arms Gem, Tome Ink, Whetstone and Reagent at 6 | Every split of twenty runs at its hours |
| **T2P23** Tier 3 | Kept, changed (R2-9) | **Tier 3 runs Tier 2's farm: ten branches, three professions, eight slots; no third material, no fourth profession** | A fourth profession; a third material (95 slot-days a full window) | One rule; pacing |
| **T2P24** Ascend and the farm | Kept, changed (R2-9) | **She arrives with every profession at Lv 1 and no sub-profession; her grades' first and second items go back to the old world's Warehouse; jewels and Stardust are gone** | Carry stock or levels | PP23 on D283's per-Uma Ascend |
| **T2P25** Save and engine | **Superseded (R2-9)** by T2P45 | — | — | Per-branch levels and the sub-profession |
| **T2P26** The ledger | Kept, changed (R2-9) | **`professions-v4.sim.ts` gains branches, the full window, today's callings' split and sub-profession rosters when Tier 2 is built** | Keep D220's split | Its 1.39 a day reads forty at the old callings; today's is 1.00 |

### 9.3 Where the owner may want to look first

1. **The pace (T2P40, T2P41).** The recommendation doubles an Uma's farm: a run of twenty working for itself takes
   63.6 days for full windows (Tier 1 live 55.8, round 1 31.8), while the fighting party keeps Tier 1's grade days and
   forty at work keep Tier 1's run time. The alternative halves Tier 2's step instead (Tier 1's time, thin professions).
2. **What the second item raises (T2P29, T2P30).** Every grade takes both items, so a Pure weapon needs a Whetstone too;
   the second item powers the path whatever it is, which keeps every branch equal and every swap free. Feeding only the
   dual choices would idle Warriors and Healers on every Pure pick.
3. **Armor's path (T2P30).** Neither the owner nor R2 names one; the farm assumes a lining (the armor's offense to her
   other half), with the tier step as the fallback, so the Hides branch always has its work.
4. **Stardust a jewel (T2P30).** The owner's "slotting the actual extra stat" becomes a crafted item; slotted once, then
   free. If extra stats keeps slotting free, Stardust still raises the node's branch stat a grade.
5. **The Craft track (T2P42).** Her best profession at Lv 10n keeps the party's 24.5-day floor; two at Lv 50 makes the
   board ask for depth at 49 days.
6. **Eight slots (T2P38).** The one place number that changes; without it a 24-party world's farm doubles.
7. **The branch names (T2P27, T2P44).** Rock (not Quarry), Fossils (not Shells), Fungi; the families can swap (fibers for
   Herbs or Hides) without moving a number.
