# Materials by grade: ten grades a line, a family a tier (H108)

> **For the owner's review, 2026-10-26. Nothing here is built.** The owner's review of the live R2 (D219) asked for
> materials with G1–G10 ranks again, tier-specific families, and a compensation paid in Speed Tickets only. This doc
> designs it. Calls are **MG1–MG16** (§11). Once approved, it supersedes [profession-progression](profession-progression.md)
> §3's two types a line a tier and the ladder (PP7–PP9) and §14.4's kept stock; every other profession call stands.
> Its build is two ChatGPT packets (§10).

**Pages:** [the catalog, the recipes and the conversion](previews/materials-grades.html) (a desktop page drawn with
uma-art's own icons).

## The owner's points

| The owner's point (2026-10-26) | Answered in |
|---|---|
| "I saw the -30m tickets being granted … but I also see a lot of materials granted, does that mean that we did a double refund?" | It was the approved design (§14.4 kept the stock). **Changed:** every material becomes Speed Tickets, §7 (MG11) |
| "I want to have only tickets for everything … I will spam all tickets to re-farm all the needed mats … Umas will go back to their exact profession level" | §7: the stock converts at the grant's own rate; you re-farm it by spending tickets, and the Craft EXP comes back with the work |
| "I thought we had kept the G1–G10 item ranks? … we only have like 2 types of items, but then the craftables do have the 10 ranks" | §2, §3 (MG1–MG9): ten grades a line; a grade-g item takes grade-g materials |
| Tier-specific families (his pick over one catalog for every tier) | §2 (MG2–MG5): a family a line a tier, fifteen in all |
| A made item takes only its tier's family (his pick) | §3 (MG2, MG8) |
| The stock converts with the graded materials, in one save step (his pick) | §7 (MG11) |
| New art for Wood Chopping's Tier 2; Tier 3's art at R5, Tier 2's families until then (his picks) | §2.4 (MG5, MG6): both rested on a count of ten old families; uma-art holds **sixteen**, so only Fishing needs new art. His answers stay as the fallback |
| The Warehouse filtered by G1–G10 again | [H106](../../handoff/tasks/H106-warehouse-grid.md) (the grid and chips, ChatGPT) and §6 here (materials get grades, so the chips filter them) |

## 0. At a glance

| | Live today (R2) | Proposed |
|---|---|---|
| **Types a gathering line** | 2 a tier: a low type (G1–G5) and a high type (G6–G10) | **10 a tier: one family, G1–G10** |
| **Item ids, raw and refined** | 20 · 40 · 60 by tier | **20 a family**: 100 for Tier 1 and 2's ten families, 150 with Tier 3's |
| **Which material a grade takes** | Its band's type; later tiers move G5 and G10 (then G4 and G9) onto their own pair (the ladder) | **Its own grade, from the world's own families** |
| **A Tier 2 world gathers** | Tier 1's pairs, and Tier 2's for G5 and G10 | **Tier 2's five families only** |
| **Gate to gather or refine** | Low type Craft Lv 1, high type Lv 26 | **Grade g at Craft Lv 5g − 4**, as made items already are (G1 1, G2 6 … G10 46) |
| **Recipes and amounts** | PP10 | **Unchanged**: same lines, same amounts; only the grade picks the type |
| **Job times** | By Craft Level only | **Unchanged** |
| **One Uma maxed** | 485 refined, 110 pieces, 822 h | **Unchanged** (485 · 110 · 822 h) |
| **The Exchange** | Raw types by pair, 30 or 80 × tier | **Raw by grade**, the same band prices and the same openings |
| **Old stock** | Kept, converted (§14.4) | **Speed Tickets**, once (save v29) |
| **New art** | — | **Fishing only:** Tier 2's Shellfish now (20 icons), Tier 3's at R5 |
| **Versions** | R3 v18 · v29, R4 v19 · v30, R5 v20 · v31 | **Save v29 is this; R3–R5's saves move one up** (v30–v32); engines unchanged |

## 1. The rule in one paragraph

**Each gathering profession gathers one family of ten grades in each tier, and every made item of grade g takes that
grade's materials from its own world's families.** Tier 1's Mining gathers ores from Copper (G1) to Orichalcum (G10);
Tier 2's Mining gathers stones from Limestone to Meteorite. The Workbench refines each one for one. A Weapon Gem G3 in
Tier 1 is 2 Iron Ingot and 2 Cedar Plank; in Tier 2, 2 Slate Block and 2 Dried Oyster Mushroom. Grade g opens at Craft Lv
5g − 4 for gathering, refining and making alike. Amounts, times and places don't move, so R2's measured pacing holds.

## 2. The fifteen families (MG2–MG6)

### 2.1 Tier 1: the lines' own families, in full (MG3)

R2's Tier 1 already drew from these families (two grades each); now it takes all ten.

| Profession (place) | Family | G1 → G10, raw | Refined |
|---|---|---|---|
| **Mining** (Mine) | **Ores** | Copper, Tin, Iron, Silver, Cobalt, Gold, Platinum, Titanium, Mythril, Orichalcum Ore | … Ingot |
| **Wood Chopping** (Forest) | **Woods** | Pine, Birch, Cedar, Maple, Oak, Cherry, Mahogany, Ebony, Elderwood Log, Yggdrasil Branch | … Plank |
| **Farming** (Fields) | **Vegetables** | Carrot, Potato, Cabbage, Onion, Tomato, Bell Pepper, Eggplant, Asparagus, Golden Carrot, Emperor Pumpkin | Chopped Carrot, Diced Potato, Shredded Cabbage, Diced Onion, Tomato Purée, Sliced Bell Pepper, Sliced Eggplant, Trimmed Asparagus, Golden Carrot Purée, Pumpkin Purée |
| **Fishing** (Fishery) | **Fish** | Carp, Trout, Sardine, Mackerel, Salmon, Sea Bream, Eel, Tuna, Silverfin, Rainbow Koi | … Fillet |
| **Hunting** (Monster Den) | **Crystals** | Quartz, Amethyst, Citrine, Garnet, Emerald, Sapphire, Ruby, Diamond, Starstone, Philosopher's Stone | Cut … |

### 2.2 Tier 2 (MG4)

| Profession | Family | G1 → G10, raw | Refined | Fit |
|---|---|---|---|---|
| **Mining** | **Stones** | Limestone, Sandstone, Slate, Granite, Basalt, Marble, Obsidian, Jade, Runestone, Meteorite | … Block | v1's Quarry: quarrying is mining |
| **Wood Chopping** | **Mushrooms** | Button Mushroom, Shiitake, Oyster Mushroom, Enoki, Chanterelle, Porcini, Morel, Truffle, Glowcap, King Reishi | Dried …; Shaved Truffle, Glowcap Powder, Reishi Powder | The forest floor; shiitake and oyster mushrooms grow on logs |
| **Farming** | **Grains** | Wheat, Oats, Barley, Rice, Corn, Rye, Buckwheat, Wild Rice, Moonrice, Sunwheat | Wheat Flour, Rolled Oats, Pearl Barley, Polished Rice, Cornmeal, Rye Flour, Buckwheat Flour, Hulled Wild Rice, Moonrice Flour, Sunwheat Flour | Field crops |
| **Fishing** | **Shellfish** (**new art**, MG6) | Shrimp, Clam, Mussel, Crab, Oyster, Scallop, Squid, Lobster, King Crab, Pearl Oyster | Peeled Shrimp, Shucked Clam, Shucked Mussel, Crab Meat, Shucked Oyster, Trimmed Scallop, Squid Rings, Lobster Tail, King Crab Leg, Pearl | No old family lives in water |
| **Hunting** | **Hides & Scales** | Puffbun Pelt, Boarling Hide, Wolfkin Pelt, Rock Lizard Scale, Ironback Hide, Basilisk Scale, Manticore Hide, Behemoth Hide, Wyvern Scale, Dragon Scale | … Leather, Dragonhide | v1's Monster Den |

### 2.3 Tier 3 (MG5)

| Profession | Family | G1 → G10, raw | Refined | Fit |
|---|---|---|---|---|
| **Mining** | **Fossils** (v1's Bones & Horns) | Seashell, Ammonite, Trilobite, Fossil Bone, Mammoth Tusk, Saber Fang, Raptor Claw, Tyrant Tooth, Titan Bone, Unicorn Horn | … Carving | v1's Fossil Dig: digging |
| **Wood Chopping** | **Nuts** | Peanut, Sunflower Seed, Sesame, Walnut, Chestnut, Almond, Pistachio, Macadamia, Thundernut, Worldseed | Peanut Butter, Sunflower Oil, Sesame Paste, … Paste, Macadamia Butter, Thundernut Oil, Worldseed Oil | Tree nuts; the Worldseed crowns Tier 1's Yggdrasil |
| **Farming** | **Fruits** | Apple, Pear, Peach, Plum, Orange, Grape, Mango, Pomegranate, Starpeach, Golden Apple | … Preserve, Orange Marmalade, Grape Jelly, Mango Pulp, Pomegranate Molasses, Starpeach Nectar | The orchard |
| **Fishing** | **The deep sea** (**new art at R5**) | Named in R5's art packet | — | Until then, Tier 2's Shellfish |
| **Hunting** | **Essences** | Mist, Dew, Breeze, Ember, Tide, Spark, Glimmer, Shadow Essence, Aether, Prismatic Essence | … Infusion | Drawn from the monsters' magic |

### 2.4 The art (MG6)

- **uma-art holds sixteen families of ten grades**, raw and refined (320 icons): v1's eight sites and the old farm's
  eight. The D219 question counted ten, and the owner's two art answers followed from it: new art for Wood Chopping's
  Tier 2, and Tier 3's families drawn at R5. **With sixteen, every line but Fishing has a family a tier that fits.**
- **New art: Fishing only.**
  - Tier 2's **Shellfish**: 10 raw and 10 refined icons, a ChatGPT art packet in uma-platform's uma-art (H110), released
    before the build.
  - Tier 3's **deep sea**: the same, in R5. Until then a Tier 3 world's Fishing gathers Tier 2's Shellfish.
- **A Tier 3 world uses its own four families now** (Fossils, Nuts, Fruits, Essences), since their art exists. The
  owner's answer, Tier 2's families until R5, stays the fallback.
- **Spare, unused:** Herbs & Spices, Sweets and Fibers. Any can replace a family above in review; the owner's answer for
  Wood's Tier 2 (new art) is the fallback if Mushrooms doesn't read right.
- **Tint:** the making places tint grade chips by the world's tier (Tier 2 amber, Tier 3 violet), H36's tints; R2's
  per-grade tint by the ladder retires.

## 3. Grades: gates, recipes, times (MG7–MG9)

### 3.1 Gates (MG7)

A grade opens at the same Craft Level for every job: gathering it, refining it, making an item of it.

| Grade | G1 | G2 | G3 | G4 | G5 | G6 | G7 | G8 | G9 | G10 |
|---|---|---|---|---|---|---|---|---|---|---|
| Craft Lv | 1 | 6 | 11 | 16 | 21 | 26 | 31 | 36 | 41 | 46 |

- Today a material opens by band (Lv 1 and Lv 26), and made items by grade. Now both read `gradeUnlockLevel`.
- **Her trade is one Uma's two professions** (PP2): she gathers and makes at one Craft Level, so the grade she can make is
  the grade she can gather. The Workbench's healers refine by the same table.

### 3.2 Recipes (MG8)

The lines and amounts are PP10's, unchanged. Only the type changes: **the grade's own type, from the world's families.**

| Made item | Takes (refined) | Tier 1, G3 | Tier 2, G3 |
|---|---|---|---|
| **Weapon Gem** (Forge) | 2 Mining, 2 Wood Chopping | 2 Iron Ingot, 2 Cedar Plank | 2 Slate Block, 2 Dried Oyster Mushroom |
| **Armor Fittings** G1–G5 (Armorer) | 1 Farming, 1 Fishing | Shredded Cabbage, Sardine Fillet | Pearl Barley, Shucked Mussel |
| **Armor Fittings** G6–G10 | 1 Mining, 1 Wood Chopping, 1 Hunting | (G8) Titanium Ingot, Ebony Plank, Cut Diamond | (G8) Jade Block, Shaved Truffle, Behemoth Leather |
| **Accessory Setting** (Charm Shop) | 12 split over the tier's slots, half Farming, half Fishing | 6 Shredded Cabbage, 6 Sardine Fillet | 6 Pearl Barley, 6 Shucked Mussel (3 and 3 once R3's second slot lands) |
| **Planet Jewel** n (Lapidary) | 3 each of Hunting, Wood Chopping, Farming, Fishing, at grade 2n − 1 | (II, G3) 3 Cut Citrine, 3 Cedar Plank, 3 Shredded Cabbage, 3 Sardine Fillet | 3 Wolfkin Leather, 3 Dried Oyster Mushroom, 3 Pearl Barley, 3 Shucked Mussel |
| **Moon Jewel** n | 3 Hunting, 1 Mining, at grade 2n | (I, G2) 3 Cut Amethyst, 1 Tin Ingot | 3 Boarling Leather, 1 Sandstone Block |
| **Branch Gem** (R3) | Its world's G5 Weapon Gem | — | 2 Basalt Block, 2 Dried Chanterelle |

### 3.3 Times (MG9)

Unchanged: a gather is 54 minutes at Craft Lv 1 down to 36 at Lv 50, a refine a quarter of it, a make one gather a refined
item; ×1.25 in every place. Times never read the grade, so a grade costs what a band cost.

### 3.4 One Uma's demand by grade

A maxed Uma in Tier 1 (one accessory slot), refined items by grade and line: still **485**, now spread over the ten
grades.

| Grade | Mining | Wood Chopping | Farming | Fishing | Hunting | Total |
|---|---|---|---|---|---|---|
| G1, G3, G5 | 6 | 9 | 14 | 14 | 3 | 46 |
| G2, G4 | 9 | 6 | 11 | 11 | 9 | 46 |
| G6, G8, G10 | 14 | 11 | 6 | 6 | 14 | 51 |
| G7, G9 | 11 | 14 | 9 | 9 | 8 | 51 |
| **All ten** | **100** | **100** | **100** | **100** | **85** | **485** |

(Her own moon adds a Moon Jewel II and IV: 3 Hunting and 1 Mining each, at G4 and G8.)

## 4. Who works where

- **Unchanged:** ten places, four slots, ×1.25, the trades by calling (PP2), the open shop.
- **A gathering place** offers its world's family, ten grades, locked ones saying "From Craft Lv 31".
- **R3's secondary** (PP14, the owner's "another profession's base items"): **another line's work up to G5**, in her
  world's families. Her main trade keeps G6–G10. H86 is re-read against this before it starts.

## 5. The Exchange and selling (MG10)

- **Raw materials by grade**, the world's own families only.
- **Openings as R2's by band:** G1–G5 after the tier's first win, G6–G10 after a win on continent 3.
- **Prices as R2's by band:** 30 Laurels for G1–G5, 80 for G6–G10, × the world's tier.
- **Selling as R2's:** by band, refined twice raw, × tier.
- The alternative weighed: v1's rule, a continent's grade pair (G1–G2 after continent 1 … G9–G10 after 5) at 10 + 10g. It
  reads more naturally by grade, but it moves R2's measured openings; kept as a later option.

## 6. The screens (MG13)

| Screen | Change |
|---|---|
| **Gathering places** (What step) | Ten grade tiles of the world's family, by grade; a locked tile shows its Craft Level |
| **The Workbench** | Pick the line (five tabs, the world's family names), then the grade (ten tiles); batches as today |
| **The making places** | Grade chips as today; a chip's recipe card shows the grade's own types; chips tinted by the world's tier |
| **The Warehouse** (H106 as the base) | Shelves named by the world's families (Tier 1: Ores, Woods, Vegetables, Fish, Crystals), and the grade chips filter materials too |
| **The Exchange** | Rows by line and grade; locked rows by band as today |
| **Targets** | The planner reads the new recipes (no screen change) |
| **"Materials by grade"** | A one-time sheet at each world's first launch after v29 (§7.3), and an Account row |
| **The manual** | `materials.md`, `loops.md`, `sections.md` rewritten for grades; `render.ts`' families, items and prices blocks |

## 7. Save v29: only tickets (MG11)

### 7.1 The step

1. **Work settles first**, as v28 did: every started entry finishes into the Warehouse with its Craft EXP; queued entries
   drop; Repeat forgets.
2. **Every material in every world becomes Speed Tickets**: every raw and refined item of R2's catalog (the 20, 40 or 60
   ids), whatever it came from (the R2 conversion, the upgrades' refund, work since).
   - **The rate is the grant's own** (§14.4's floor): Craft Lv 25's manual times, a ticket for each 30 minutes.
   - A raw item is one gather, **45.18 minutes (1.51 tickets)**; a refined item a gather and a refine, **56.48 minutes (1.88 tickets)**.
   - **tickets = ⌈(raw × 45.18 + refined × 56.48) ÷ 30⌉**, once a world.
3. **Made items, Laurels, tickets and Craft Levels stay.** The made items' ids don't change.
4. **New:** `TierWorld.materialsGrant: { items, tickets, seen } | null`, for the sheet. A world with no materials gets null and no sheet.
5. Targets keep their made items; their lines recompute from the new recipes.

The R2 ids leave the code (old-save fixtures keep them, as D144's and R2's did). New saves start at v29.

### 7.2 Worked examples

H82's scratch worlds, after R2's migration, as the owner's own save would be:

| World | Raw | Refined | Speed Tickets |
|---|---|---|---|
| H82's fully built roster, Tier 1 (2,072: Iron Ore 1,000, Iron Ingot 1,000, the settled gather, the upgrades' 66 refined) | 1,006 | 1,066 | **+3,523** |
| Its Tier 2 world (312: Iron Ore 300, the upgrades' 12 refined) | 300 | 12 | **+475** |
| A mid player (600, half and half) | 300 | 300 | +1,017 |

Next to the R2 grant (63,808 and 16,580) these are about 5.5% and 2.9%, close to §14.8's estimate (6%) of what the stock
was worth in hours. **The owner's own numbers** are on his first launch's sheet ("What came back · your Warehouse's N
items"); the main session couldn't read production.

### 7.3 The sheet "Materials by grade"

- **When:** once a world, at its first launch after v29, when `materialsGrant` isn't seen. Its own sheet, not the R2
  one's.
- **Words:**
  - *Lead:* "Every profession gathers ten grades now, a family for each tier. A grade's item takes that grade's
    materials."
  - *Large:* "+3,523 Speed Tickets", and under it "for your 2,072 materials, the time they took".
  - *Footer:* "Re-gather them by spending tickets: Finish on a job, or Finish all on a place."
  - *Buttons:* **To the Wilds** and **Later**, both marking it seen.
- **The Account:** a row "Materials by grade · 3,523 Speed Tickets" that reopens it, under the R2 grant's row.

## 8. Versions, and R3 to R5 (MG12, MG14)

- **Save v29 is this step; the engine stays v17** (no fight rule changes).
- **R3–R5's saves move one up:** R3 engine v18 with save **v30**, R4 v19 · **v31**, R5 v20 · **v32**. On approval the
  main session updates implementation.md §2 and the packets that name them (H87, H94, H102).
- **R3's packets that read materials:**
  - H83's Branch Gem is its world's G5 Weapon Gem (§3.2's last row);
  - H85's Moon Jewels for the weapon moon go by grade;
  - H86's secondary is another line's work up to G5 (§4);
  - H89 re-measures the secondary.
  They stay Waiting on this doc (D219) and are re-read once it is approved.

## 9. Pacing (MG15)

- **Amounts, times and places are R2's**, so one Uma's 485 refined and 822 hours, a party's 3.9 days and a run's 15.8
  days hold for a roster that levels together.
- **What moves is who can feed a grade.** Today a Craft Lv 1 Uma's gathers feed G1–G5; now they feed G1, and her
  trade's higher grades wait on her level. In a roster working nonstop each Uma reaches a grade's gate as her trade
  needs it (she gathers and makes at one level). A newly unlocked Uma's early work feeds the low grades, which a newer
  Uma's gear needs.
- **The build re-runs H81's profession pacing** (`economy/professions.sim`) and reports the run of twenty and the party
  against R2's 15.8 and 3.9 days. A gap over 10% goes back to the owner before the switch.

## 10. The build (MG16)

| Id | Task | Who | Size | Needs |
|---|---|---|---|---|
| **H109** | Materials by grade, live in one step: the fifteen families' ids and names (from uma-art; Shellfish from H110), recipes and gates by grade, the Exchange by grade, the place pages, the Workbench, the Warehouse's labels, save v29 with the conversion and its sheet, the manual, the pacing re-run, a scratch migration of H82's full-shaped save | ChatGPT | L | H106 merged, H110 released, this doc approved |
| **H110** | Fishing's Tier 2 family, Shellfish: 10 raw and 10 refined icons drawn in code in uma-art, in its style and palette; the main session releases uma-art | ChatGPT | S | this doc approved |

Both are written once this doc is approved.

## 11. Decisions

| Call | Decision | Alternatives weighed | Why |
|---|---|---|---|
| **MG1** Graded lines | Five lines, each one family of ten grades a tier; a grade-g made item takes grade-g refined materials | Keep R2's two types a line (D195) | The owner: "I thought we had kept the G1–G10 item ranks" |
| **MG2** A tier's own families only | A world gathers and makes from its tier's five families; no item mixes tiers | Half and half; the ladder's top grades (the owner's other options) | The owner's pick: every grade of every family used, each tier looks new |
| **MG3** Tier 1 | Ores, Woods, Vegetables, Fish, Crystals, in full | — | R2's lines already drew from them |
| **MG4** Tier 2 | Stones, Mushrooms, Grains, Shellfish (new art), Hides & Scales | Wood Chopping ← Essences or new art (the owner's answer, the fallback); Fishing ← Bones & Horns or Essences | Each fits its place; only Fishing has no water family |
| **MG5** Tier 3 | Fossils, Nuts, Fruits, the deep sea (new art at R5; Shellfish until then), Essences; live in Tier 3 worlds with H109 | Tier 2's families until R5 (the owner's answer, the fallback) | Four of five exist; a Tier 3 world can be reached today |
| **MG6** Art | New art for Fishing only (Shellfish now, H110; the deep sea at R5); Herbs & Spices, Sweets, Fibers spare | New art for Wood's Tier 2 and all of Tier 3 (120 icons) | uma-art has sixteen families, not ten |
| **MG7** Gates | Grade g at Craft Lv 5g − 4 for gathering, refining and making | By band (Lv 1 and 26), as R2 | One table for every job; her trade gathers and makes at one level |
| **MG8** Recipes | PP10's lines and amounts; the grade picks the type | New amounts per grade | Keeps the measured pacing and 485 a maxed Uma |
| **MG9** Times | Unchanged (by Craft Level) | By grade | Times never read the material |
| **MG10** The Exchange | Raw by grade; R2's openings and prices by band × tier; selling by band | v1's continent pairs at 10 + 10g | Keeps R2's measured economy |
| **MG11** Save v29 | Work settled; every material in every world → Speed Tickets at Craft Lv 25's manual times (raw 45.18 min, refined 56.48, ÷ 30, rounded up a world); made items, Laurels and tickets stay; `materialsGrant` and its sheet | Only the R2-converted stock (its ids can't be told from later work); the Exchange price in Laurels | The owner: "only tickets for everything"; the grant's own rate; nothing he gathered is lost |
| **MG12** Versions | Save v29 here, engine unchanged; R3–R5's saves v30–v32 | Fold into R3's save | Ships now, apart from R3's build |
| **MG13** Screens | §6's table; H106's Warehouse as the base | — | The place pages already draw grades for made items |
| **MG14** R3 | The Branch Gem on its world's G5; Moon Jewels by grade; the secondary up to G5; H83, H85, H86 re-read on approval | Keep R3's packets as written | They read the pairs and the ladder |
| **MG15** Pacing | Re-run `professions.sim`; a gap over 10% from R2's 15.8 and 3.9 days goes back to the owner | — | Gates by grade change who can feed a grade |
| **MG16** The build | H109 (ChatGPT, L) and H110 (ChatGPT, S, art), written on approval | Split H109 into dark and switch packets | One save step and one catalog change ship together |
