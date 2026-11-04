# Progression: a Tier 2 run end to end, promotion, the windows, and how the tiers relate

> **Status: round 2, the owner's requirements, 2026-11-04. Nothing here is built.** The overview of the Tier 2 and Tier
> 3 set ([the brief](README.md)): how one Uma climbs Tier 1 → 2 → 3, **how she is promoted into Tier 2 on the Ascend
> sheet** (R2-5, R2-6), **what her stained-glass window asks in each tier** (R2-10), what the Tier 2 and Tier 3 worlds
> hold, and when each system's additions land in a run. It starts from Tier 1 as built (engine v21, save v36) and assumes
> capitals v2 (save v37, D293) and the honeycomb (save v38, D295) are live before any Tier 2 packet: both are built dark
> or queued today (H159 done; H160–H166 open). Calls are **T2W1–T2W15** (round 1) and **T2W16–T2W32** (round 2),
> each with a recommendation, its alternatives and its status ([§10](#10-decisions)); no open questions.
>
> **Round 2 in one paragraph.** Promotion into Tier 2 happens on the Gallery's Ascend sheet: each ready Uma arrives as a
> **Tier 2 class she picks there**, one of the two children (a keeper and an expander, R2-2) of a Tier 1 class she
> brought to Class Rank 50, with **her three weapons and their Tier 2 types** set on the same page; everything is
> pre-filled, so a party of five still ascends in one tap. Her window keeps **one board of 36 steps in every tier**, the
> same seven tracks and the Rift and the same record: Class reads the sixteen classes and asks for a class and its
> **sibling** at Rank 50, Craft reads **her three professions' Craft Levels together**, Stars reads the tier's whole
> map, and Gear and Weapons read grades whatever form or type she wears. **A step reads progress, never a choice**, and
> the art needs nothing: a pane map lights any step count and never knows which step lit.
>
> **Absorbs:** [tiers.md](../../archive/design/tiers.md) (T1–T9, archived), [tier2-world.md](../../archive/design/tier2-world.md)
> (Z1–Z10, archived), [the Rift](../rift.md) (R1–R9), [collections](../collections/collections.md) (CO1–CO37),
> [capitals v2](../capitals/capitals.md) (CA1–CA15), [the honeycomb](../world-map/honeycomb.md) (HM1–HM12), the Tier
> rework's tier and pacing frame ([README](../tier-rework/README.md) §2, §9) and [pacing](../pacing.md). Every old call
> has a row in [§3](#3-the-approved-drafts-call-by-call).
>
> **Pages** (desktop, light and dark; every Uma and window on them is made up, and the windows are placeholder panes, no
> original art):
> [**the tiers**: Tier 1 → 2 → 3, what each adds, what she keeps, picks and restarts, one Uma across three tiers](previews/progression-tiers.html) ·
> [**the Ascend sheet**: promotion screen by screen, a party of five, the class and weapons pages, Tier 2 → 3](previews/progression-ascend.html) ·
> [**the windows**: the boards by tier, how a window is drawn and latched, what each system lights, pacing by track](previews/progression-windows.html) ·
> [**the worlds**: Tier 2's and Tier 3's continents, the honeycomb, foes, pay, the Rift](previews/progression-world.html) ·
> [**the run**: a Tier 2 run day by day with round 2's systems, the Wilds calculator, 24 parties](previews/progression-run.html).
>
> **Numbers** come from the live code (`packages/domain/src`: `world/`, `rpg/campaign/`, `rpg/windows.ts`,
> `save/windows.ts`, `save/window-record.ts`, `save/rift.ts`, `save/drills.ts`, `save/exchange.ts`,
> `economy/pacing.ts`, `economy/ranks.ts`; the web's `places/gallery/`), read by throwaway tests that were deleted.
> Where a number is an assumption (fight seconds, the owner's Rift pace, another doc's round-2 shape), it says so.
>
> **Names checked:** every label this doc and its pages add ("Keeper", "Expander", "Sibling", "Pair at R50", "Crafts",
> "Her Tier 2 class", "Suggested for all", "Opens 6 of 16" and the rest, listed in [§9](#9-previews-carried-and-retired))
> was matched, case-insensitive and exact, against every string of uma-platform's `content/release/data/*.json` (10
> files, 18,227 distinct strings) and the game's own names: no match. "Keeper" and "Expander" are the brief's role words
> (R2-2); the sixteen classes' names are [classes.md](classes.md)'s.

## What this doc answers

| The brief asks | Answered in |
|---|---|
| **R2-5, R2-6:** Tier 2 promotion on the Ascend sheet: who's ready, her Tier 2 class, her weapons and their types, what she keeps and restarts, the purse, a party together | [§4.4](#44-promotion-the-ascend-sheet) (T2W16–T2W23), the [Ascend page](previews/progression-ascend.html) |
| **R2-10:** the windows with Tier 2: the live board in depth, Tier 2's and Tier 3's boards on the new systems, the record and the art, whether a step can read a choice | [§2.5](#25-windows-in-depth), [§4.6](#46-her-window-in-tier-2) (T2W24–T2W28), [§5.4](#54-her-window-t2w29) (T2W29), the [windows page](previews/progression-windows.html) |
| The timeline of a Tier 2 run with round 2's systems, and its pacing | [§4.7](#47-the-toolbox-arrives), [§4.8](#48-a-tier-2-run-end-to-end), [§8](#8-pacing) (T2W32), the [run page](previews/progression-run.html) |
| Ascend as built, and whether the drafts' tier rules still fit | [§2.6](#26-ascend), [§3.1](#31-tiersmd-t1t9-archived) |
| The Tier 2 world: continents 6–10, lifetime foe levels, capitals v2 and the honeycomb | [§4.1](#41-the-world-continents-610), [§4.2](#42-foes-lifetime-levels-a-restarted-build) (T2W1–T2W3) |
| The Rift in Tiers 2 and 3; does Tier 3 get one | [§4.5](#45-content-the-campaign-capital-runs-drills-trials-the-rift), [§5.2](#52-its-rift-t2w4) (T2W4, T2W5, T2W30): **yes** |
| Trials and Drills, Laurels, Speed Tickets and Class Marks by tier | [§4.3](#43-pay-laurels-tickets-class-marks-and-logs), [§4.5](#45-content-the-campaign-capital-runs-drills-trials-the-rift) (T2W6, T2W10) |

## 1. At a glance

**One Uma lives in one tier; a full window ascends her, and from Tier 2 the Ascend is her promotion; each tier is its
own world, the same shape, restarted.** Tier 2 and Tier 3 run Tier 1's rules × tier today. Round 2's systems (the six
docs) fill each later tier; this doc fixes the frame they land on.

| | Tier 1 · Apprentice · day | Tier 2 · Adept · dusk | Tier 3 · Master · night |
|---|---|---|---|
| **Continents** | `w1`–`w5`, lifetime Lv 1–50 | `w6`–`w10`, lifetime Lv 51–100, shown "T2 Lv 1–50" | `w11`–`w15`, lifetime 101–150 |
| **A continent** (honeycomb, assumed live) | 48 regions, 576 stages, a capital, 6 Springs | The same | The same |
| **Parties · capital runs a continent** | 24 · six of four parties (16 fights each) | The same | The same |
| **Leans** (T2W2) | Forest, Coast, Desert, Tundra, Haunted Moor (live) | Jungle, Sky Isles, Glacier, Volcano, Underworld | Swamp, Highlands, Geyser Basin, Storm Peaks, Ancient Ruins |
| **Foes** | The build curve from Lv 1 | The curve **restarts** at T2 Lv 1, × 1.8 build (live: Z3, EP16) | Restarts again, × 2.6 |
| **Her classes** | Five Tier 0s promote at Class Rank 10 into eight Tier 1 classes, in the world | **Sixteen** (a keeper and an expander per Tier 1 class, [T2C](classes.md)); **picked on the Ascend sheet** from the children of her Tier 1 classes at R50, 6 to 16 open to her (T2W17) | Assumed: the sixteen, deepened (two lines held, the crown and mastery at R50); her open set carries (T2W31) |
| **Her weapons** | Three a class, by preset; one kind each | Three a class, **each with a Tier 2 type set on the Ascend sheet** (T2G), swapped later | The same, pre-filled from Tier 2 |
| **Build values** (gear, stars, signature) | × 1 | × 1.8 | × 2.6 |
| **Laurels a win · region first clear** (Lv 1–40) | 10 · 630 | 20 · 1,260 | 30 · 1,890 |
| **Speed · Sweep Ticket** (T2W10) | 10 · 15 Laurels | **20 · 30** (live: 10 · 15) | **30 · 45** (live: 10 · 15) |
| **Arrives with** | 20 Uma Tickets (the start) | Her purse: **2,000 Laurels** (T2W10; live 1,000) and 5 Speed Tickets; banked EXP as up to 2,000 Class Marks | **3,000 Laurels** and 5 Speed Tickets; Class Marks |
| **Drills · Trials** | Lv 10–50 · Lv 45, 50, 55 | The same, T2 levels | The same, T3 levels; **Trials open** with its Rift (T2W4) |
| **The Rift** | Live | Live; one added test a front, re-aimed at round 2's tools (T2W5, T2W30) | **New (T2W4):** the same shape; it lights her Rift step, nobody ascends from it |
| **Her window** | 36 steps | **36:** Class IV a class and its sibling at R50, Craft her three professions together (T2W24–T2W26) | **36** (live 35; T2W4, T2W29) |
| **Ascend** | To Tier 2 on the Gallery's sheet, **her promotion** (T2W16) | To Tier 3, the same sheet pre-filled (T2W31) | None while Tier 3 is the top tier (T2W14) |
| **What the toolbox adds** | — (Tier 1 as built) | Sixteen classes (T2C), weapon types and the accessory tree (T2G), a stat pick on every open node (T2E), two materials a line and three professions an Uma (T2P), party value bands (T2B), the ★ signature tip (T2U) | Assumed: each system's Tier 3 step (two lines held, the crown and mastery; the tree's and lists' deeper entries), Tier 3's term |
| **A run's clock** (T2W12, T2W32) | Her own Craft Level: 24.5 days nonstop, 30.6 at 80% | **Her three Craft Levels to 60 together: 24.9–27.8 days** nonstop, 31.2–34.8 at 80% | The same |

**A Tier 2 run in one line:** a party of five fights to Lv 50 in about 130 wins (2 to 4½ hours of fights), but its
windows take **about 33 days** of the Wilds' work and the Rift (38 at 80%), because every Uma's Craft Levels restart at 1
and the first cohort's forges reach G10 on day 22.1. The fights are short; the Wilds are the clock, in every tier.

**Promotion in one line:** the Gallery's Ascend sheet lists the ready Umas by party, each pre-filled with her
Suggested Tier 2 class (the keeper of the class she fights as) and her class's three weapons and types; a tap on one
opens her page to pick another, and **Ascend 5** sends them up.

## 2. Tier 1 as built

The baseline every later tier copies. All of it is live (engine v21, save v36) and owned by the manual pages linked.

### 2.1 The world

- **Five continents a tier, ten levels each** ([maps](../../game/maps.md)): continent n spans lifetime Lv 10(n − 1) + 1 to
  10n; the tier is ⌈n ÷ 5⌉ (`chapterFor`). Tier 2's are `w6`–`w10`, Tier 3's `w11`–`w15`. D280 gave Tier 3 its fifth
  (the newest scenario), so every tier has five.
- **A continent today:** 40 regions in ten rows of four, rows 1–5 its first five levels and rows 6–10 its last five;
  12 stages a region (480 a continent); five Springs; a capital with three Finals routes at the band's Lv 10.
- **Leans repeat:** `CONTINENT_LEAN` has five entries read by (order − 1) mod 5, so `w6` and `w11` lean Forest as `w1`
  does. **Faces:** continents past 5 take the large pack on rows 1–5 and the middle pack on rows 6–10; the small pack
  appears only on continent 1.
- **Labels** read the tier: "T2 Lv 1–5" (H35, D170). **Laurels** pay the region's tier: a `w6` stage pays twice.
- **The fifteenth scenario's capital** reuses continent 1's Finals (`rpgFinals` cycles the fourteen authored).
- **Who lives in a later world:** a Tier 2 world starts with no Uma Tickets and pays no Shards; **its Umas are the
  ones who ascend into it** ([loops § Collection](../../game/loops.md#collection-and-parties)). So every Tier 2 Uma
  arrives with a full Tier 1 window, Class V lit: three Tier 1 classes at Class Rank 50 at least. Round 2's promotion
  rests on that.

### 2.2 Leveling, ranks and pay

| Rule | Value, every tier (EXP is a share of her own tier level, D102) |
|---|---|
| Uma EXP Lv 1 → 50 | 25,480 (120 + 16 × level to next) |
| Class Rank 1 → 10 (a Tier 0) · 10 → 50 (a Tier 1 class) | 3,600 · 23,680 (`rpgTier0ExpToNext`, `classExpToNext`) |
| A win | E Uma EXP, 2E Class EXP to the class she fought as |
| Past the cap | Class EXP banks at half as Class Marks; a Class Manual is 1,000 Marks for 1,000 EXP |
| Laurels a win (regular · sub-boss · vanguard · boss) | 10 · 25 · 30 · 50 × tier; ×3 a first clear, ×4 at tier Lv 41–50, ×1.5 in waves; replays a quarter |
| The Exchange | Raw G1–G5 20, G6–G10 53 Laurels × tier (D264); Speed Ticket 10, Sweep Ticket 15, **flat** |
| Training Log | A third of her next level (Lv 1: 46 · 10: 94 · 30: 200 · 49: 302 EXP), twice that to her class; 147 from Lv 1 to 50 |

### 2.3 The Wilds' clock

| Rule | Value (`economy/pacing.ts`, [loops](../../game/loops.md#craft-level)) |
|---|---|
| Craft EXP to the next level | 1,425 + 15 × level (1,440 at Lv 1, 2,160 at Lv 49): nearly flat, so time is close to linear in levels |
| Craft Level 1 → 10 · 20 · 30 · 40 · 50 | 13,500 · 29,925 · 47,850 · 67,275 · **88,200** Craft EXP, 2 a base minute; at the places' ×1.25, **3.75 · 8.31 · 13.29 · 18.69 · 24.5 days nonstop** (30.6 at 80%) |
| Grades open (Craft Lv 5g − 4), nonstop | G2 day 2.0 · G4 6.4 · G5 8.8 · G6 11.3 · G8 16.5 · G10 **22.1** |
| One step | 24 minutes at Craft Lv 1 to 16 at Lv 50 (20.1 at Lv 25) |
| Places | 15, four slots each: 60 slots, 12 a trade; an Uma works only her trade's three (an open shop if her world has none of it) |
| One maxed Uma (11 worn slots and the map) | 750 refined items, 2,250 steps, **753 hours** at Craft Lv 25 (602 of slot time); every line 150 |
| A full window (+ two more weapons for Weapons V, D289) | **950 refined, 954 hours** (763 of slot time): Metal and Vegetables 250 each on a roster's average, Wood, Fish and Stone 150 |

**The release's trades are uneven** (classes, counts only): Warrior (Metal) 48, Spellblade (Wood) 72, Mage (Stone) 72,
Summoner (Fish) 34, Healer (Vegetables) 46 of 272 outfits. Every line carries the same work an Uma (D264), so in a
world without enough Umas of a trade, that trade binds ([§8.3](#83-a-run-of-twenty)).

### 2.4 Content

| Content | Rule as built | Pays |
|---|---|---|
| **The Campaign** | The world map, any party | Uma EXP, Class EXP, Laurels, Shards (Tier 1) |
| **Capitals** | Three routes, a vanguard and a champion each, shared by the world; Finals EXP halved; no Sweeps | As sub-bosses and bosses |
| **Drills** (D286) | Five, at the tier's Lv 10–50, each its continent's top row's first region's stage 10; ten runs a day, banked to thirty; open with the tier's first map win; swept free once won | 2 · 3 · 4 · 5 · 6 Training Logs |
| **Trials** (D285) | The Rift's Echoes: each front at the tier's Lv 45, 50, 55, for Lv 50 parties; open with the Rift | Class EXP 4E (652 · 1,300 · 1,300 a win); Rank 1 → 50 in 20 Lv 50 wins |
| **The Rift** (D161, D283) | Opens at five Lv 50 Umas, **Tiers 1 and 2 only** (`RIFT_TIERS`); twenty sign up; four fronts of 12, then the Convergence's four; one run at a time, a new one once the last is won | Achievements; the Rift step on its twenty's windows |

### 2.5 Windows, in depth

The owner: "If you haven't looked at the Uma Stained glass achievement mechanics, now would be a good time for it."
This is the system as built (D283–D289; [loops § Windows](../../game/loops.md#windows),
[sections § Gallery](../../game/sections.md#gallery); code `rpg/windows.ts`, `save/windows.ts`,
`save/window-record.ts`, the web's `places/gallery/`, uma-platform's bake P81–P84), and what each part means for round 2.

**The board.** Every Uma has one window a tier: seven tracks of five steps (Level, Class, Craft, Gear, Weapons, Stars,
World) and the Rift. **36 steps in Tiers 1 and 2, 35 in Tier 3**, because a tier's Rift step exists only while a tier
above exists (`tierHasRift`).

| Track | I · II · III · IV · V (Tier 1) | What it reads in the code | Later tiers today |
|---|---|---|---|
| **Level** | Uma Lv 10 · 20 · 30 · 40 · 50 | `uma.level` | The tier's levels |
| **Class** | A Tier 0 at R10 · a Tier 1 class at R30 · at R50 · two at R50 · three at R50 | Her ranks in the **eight Tier 1 classes**, best first, any she holds (`tier1Ranks`), not only the one she fights as | I is a Tier 1 class at R10 (no Tier 0) |
| **Craft** | Craft Lv 10 · 20 · 30 · 40 · 50 | `uma.craft.level`: **one** profession | The same |
| **Gear** | All eleven worn slots at G2 · G4 · G6 · G8 · G10 | The lowest grade of her **active class's** three weapons, five armor slots and three accessory slots (`wornFloor`) | The same |
| **Weapons** | Five weapon kinds at G2 … G10 | How many weapon kinds stand at the grade, **any class's** (grades are per kind, D289) | The same |
| **Stars** | Every node to I · II · III · IV (4 · 9 · 13 · 18), then the whole map (22) | Node ids `planet:n`, `prowess:n`, `vigor:n`, `guard:n` for n ≤ the step, her moon's `template:1` from II and `template:2` from IV (`starsMet`) | The same 22 |
| **World** | Continent 1 … 5: its capital's three champions | A 15-bit champions mask in the record; **capitals v2 (v37, CA12) replaces it with "a won capital run"** | Continents 6–10, 11–15 |
| **Rift** | On a won Rift run | Never read from state: only `recordRiftWin` lights it | Tier 2's; Tier 3 none yet |

**Latching** (CO2, CO10). One pure rule over her state (`windowMet`) runs after every change on the device (the store's
commit) and once at load; any step it meets is lit **for good**, dated that day. A class switch, a lower grade, Classes
v3's kind of reset and an ascension never darken one. A latch doesn't move `updatedAt`: any device works out the same
steps from the same state. **So a step that read a free choice would light the first time she tapped it and never go
dark**: the board can only mean something where her state moves one way (levels, ranks, grades, nodes, wins).

**The record** (`account.windows[outfit][tier]`). `steps` is **36 three-character day codes in a fixed order** (base 36,
days since 2026-01-01, `---` while dark): save v35's 31 (six tracks I–V and the Rift), then v36's five Weapons steps
appended. **The record is positional: never reorder, only append** (D289 widened 31 → 36 by appending, lighting the new
five on a full window's last day). About 150 bytes an Uma a tier, 45 KB for 270 Umas; the same 36 positions in every
tier, the Rift's included.

**The reveal** (P84, CO3–CO5). The release holds each outfit's window (`outfit-glass`, 512 px) and its **pane map**
(`outfit-glass-order`): one grey value a pane, **0 the lead, 255 the face, 1–250 the rest**, ranked outside in (the
frame's bars and corners farthest from her head first, then the sunburst from its rim inward, then her figure from the
bottom up) and spread evenly, `ceil(250 × (rank + 1) ÷ panes)`. The game draws a pixel as it is when its value is the
lead or **at most 250 × lit ÷ (steps − 1)**, the face only when every step is lit, and any other as dark glass
(`(0.3 c + 0.7 y) × 0.16 + (9, 11, 18)`), on a canvas, cached by outfit, count and size (`GlassWindow`, `litRgba`).

| What the art knows | Consequence for round 2 |
|---|---|
| **Only how many steps are lit, and how many there are** | A board can change which steps it holds in any tier with no rebake; a step that reads a choice gains nothing on the glass |
| Any count: at 36 a step lights 7.14 of the 250 values (2.86% of the panes before the face); 41 would light 6.25 | The count can grow or shrink (D289: "the pane maps light any step count") |
| **The face lights only with the last step** | A step most Umas never reach would leave every window faceless: each step must be reachable on a normal run |
| Frames by tier on a full window (gold, amber, violet: `TIER_FRAME`) | Tier 2's and 3's full windows already have their rings |

**The screens.** Her window stands beside her bust in her profile (64 px, her share on its corner, CO35); a tap opens
the **Window sheet**: her window at 232 px, "Tier 2 · 14/36 · 39%", the board as seven rows of five tiles and the Rift
tile, each row's share beside its name (CO36). A lit tile shows its day; each track's next tile shows what's left
(`windowNext`: "Lv 34/40", "R41/50", "Craft 22/30", "8 of 11 at G6", "3 of 5 at G6", "10/13", "1 of 3"); a tap opens
its rule and source under the board, inline (G4). The **Gallery** ranks every window most complete first (CO37), with
"Collection 23%" and the **Ascend** button while anyone is ready. A step lit shows a toast, "Window +1 · Craft 30" (copy
test: six words at most).

**What other docs should know about the windows** (round 2):
1. **A step must read progress:** a rank, a level, a grade, an open node, a won fight. A pick that swaps freely latches
   on one tap; a pick that must stay forces a build.
2. **Class reads every class she holds,** best first; the code reads only the eight Tier 1 classes (`tier1Ranks`) in
   every world, so Tier 2's sixteen need the read by tier.
3. **Gear reads her active class's three weapons:** an expander's cross-channel slot is worn and counts; three accessory
   slots stay the "eleven". **Weapons reads any five kinds' grades,** whatever their type; a Dual's partner kind is not
   a second weapon.
4. **Stars reads `body:n` ids:** a new body counts if its ids follow that pattern, and the whole-map count moves.
5. **Craft reads one Craft Level:** three professions need a rule over three (T2W26).
6. **The record is positional:** a new step appends, never reorders; every tier shares the 36 positions.
7. **Ascend reads her full window and her won run;** promotion must read her Tier 1 ranks before she leaves, since she
   arrives at Class Rank 1 (T2W17).
8. **uma-platform's review sheet** still shows each window at 0, 15 and 30 of 31 ([new-umas.md](https://github.com/luismlorenzana/uma-platform/blob/main/docs/new-umas.md)); since D289 the board is 36 (0, 18, 35 of 36 would match). A platform note, not this set's to change.

### 2.6 Ascend

One Uma at a time, from the Gallery, once her window is full ([loops](../../game/loops.md#ascend), D283, D288;
`ascendUmas`, `moveUp` in `save/rift.ts`; the web's `AscendSheet.tsx`):

| | What happens |
|---|---|
| **The sheet** | "Ascend to Tier 2": the ready Umas, each ticked (untick to leave one); one who can't go says why ("At work · recall first"); the lines "Lv 1 in Tier 2", "Ranks, skills and stars restart", "Gear returns to Tier 1's stock", the purse, the Class Marks; **Ascend n** runs behind the tier veil and lands on the new tier's Town Hall |
| **She leaves** | The old world's Stable, parties, targets, carried MP, Hall seats and work; a Hero's seat empties. Her grades' made items go back to the old Warehouse; her set jewels are gone |
| **She keeps** | Her class, her accessory slots' families and kinds, her calling; her lower tiers' full windows; her history |
| **She restarts** | Lv 1 (lifetime 51 in Tier 2), Class Rank 1 in every class, weapons, lines and equipped skills at defaults, every grade G0, an empty map, Craft Lv 1, no Bonds |
| **A Tier 0** | Arrives as her suggested promotion (the Warrior a Brawler, the Mage a Sorcerer, the rest by Power and Wit): a later tier has no Tier 0 |
| **The new world gets** | 1,000 Laurels and 5 Speed Tickets an Uma (`ASCEND_PURSE`); her EXP banked past Lv 50 as Class Marks, one per 10, at most 2,000 (two Manuals) |
| **Parties** | Five who ascend together move with their party's name; each other Uma takes the first free slot |

### 2.7 Built dark, assumed live before Tier 2

| Piece | What it changes for every tier | State |
|---|---|---|
| **Capitals v2** (D293, save v37) | A capital is runs of four full parties: four lanes of three generals, then four final bosses; 16 fights; her first run of a continent pays full (about 1.3 levels), later a quarter; **World n lights on a won run**, and the champions mask leaves the record (CA12) | H159 done; H160–H162 open |
| **The honeycomb** (D295, save v38) | 48 regions a continent (24 on the shore at Lv 1–5, 24 inside at Lv 6–10), **24 parties**, six Springs, six run seats, the faces of who claimed and cleared each hex | H163–H166 open |

## 3. The approved drafts, call by call

**Kept** stands as written · **Kept, changed** stands with a change Tier 1's iterations or round 2 force ·
**Superseded** a Tier 1 decision replaced it · **Broken** written for a Tier 1 that no longer exists; a new call fixes
it. Calls owned by another doc in the set say which. This doc's own round-1 calls (T2W1–T2W15) have their status in
[§10](#10-decisions).

### 3.1 tiers.md (T1–T9, archived)

| Call | As approved (D159) | Status | Why |
|---|---|---|---|
| T1 | Nothing else carries across tiers: the account, achievements, her history | **Kept** | The window records (D283) are her history on the account |
| T2 | A tint per tier: day, dusk, night | **Kept** | Built (H36); the window frames use the same colours |
| T3 | Banked EXP past Lv 50 → Class Marks, 1 per 10, at most 2,000 | **Kept** | Built (`bankedMarks`) |
| T4 | Bonds reset; her old seat empties | **Kept** | Built |
| T5 | A purse: 1,000 Laurels and 5 Speed Tickets an Uma | **Kept, changed** | Paid per Uma since Ascend went one at a time (D283); T2W10 makes its Laurels × the tier she arrives in |
| T6 | Option A: a growing toolbox, one battle system | **Kept, changed** | The toolbox is round 2's (R2-1–R2-12): sixteen classes, weapon types, the accessory tree, stat picks, three professions, on Classes v3 (D240) |
| T7 | Simplify Tier 1 now, side skills kept until promotion | **Superseded** | Tier 1 was rebuilt (R1, R2), then Classes v3 (D240) reset every class |
| T8 | Twelve advanced classes | **Superseded** | Classes v3 (D240), then round 2's sixteen Tier 2 classes (R2-2), [T2C](classes.md)'s |
| T9 | A partial Tier 3 opens four continents; its Rift waits for the fifth scenario | **Broken** | D280 gave Tier 3 its fifth continent, and the code ties a Rift to a tier above (`tierHasRift`, D284), not to five continents: **T2W4** |

### 3.2 tier2-world.md (Z1–Z10, archived)

| Call | As drafted | Status | Why |
|---|---|---|---|
| Z1 | Tier 2's leans: Jungle, Sky Isles, Glacier, Volcano, Underworld | **Kept** | Never built (`CONTINENT_LEAN` repeats); **T2W2** builds it, adds Tier 3's and a guard |
| Z2 | Every Tier 2 foe's shield +1 | **Superseded** | Weaknesses v2 (D235): shields by formation, every rank three answers in Tiers 2 and 3; the boss shields are T2B's (SB6) |
| Z3 | The build budget restarts at each tier's Lv 1, scaled to her stats | **Kept** | Built (D170); × the tier's build since EP16 (D213): each tier's Lv 50 lands on ×2.72 |
| Z4 | A Tier 2 term: +15% HP and defense, +10% offense by Lv 50 | **Superseded** | SB3–SB5 (D196): +27% in Tier 2, ×1.08 → ×1.48 in Tier 3; T2B's |
| Z5 | Skill MP ×1.7 in Tier 2, not ×2 | **Kept, changed** | Not built (MP × tier today); Classes v3's hands (D240) and the combat pass (D282) move its base; T2C and T2B re-measure |
| Z6 | Levels on screen are tier levels | **Kept, changed** | Built as "T2 Lv 1–5" (H35), the tier named, not bare "Lv 1–5" |
| Z7 | Which face pack leads each Tier 2 continent: Tier 1's totals, arranged differently | **Kept** | Never built; **T2W3** builds it and gives Tier 3 a third arrangement |
| Z8 | Laurels ×2, prices unchanged, Springs and Sweeps unchanged, no Shards | **Kept, changed** | Built (D170), but raw prices are × tier since FL12, at 20 and 53 since D264; T2W10 puts the tickets × tier too |
| Z9 | One added test a Rift front: Iron shields +2, Arcane one element a foe, the Duel's boss three acts from stage 9, the Horde 5–7 a wave | **Kept, changed** | The tools they tested (weapon arts, the outer ring) never shipped; **T2W5** re-aims them, **T2W30** at round 2's tools |
| Z10 | The Twilight Rift biome shows as Twilight Vale | **Kept** | Never built; it already reads "in every tier", and Tier 1 has shown both names since H50. Ships with the first Tier 2 world packet (checked: no master-data match) |

### 3.3 rift.md (R1–R9)

| Call | As approved (D161) | Status | Why |
|---|---|---|---|
| R1 | The name: the Rift; promoting is Ascend | **Kept** | Round 2 makes the Ascend the Tier 2 promotion too (R2-5) |
| R2 | Twenty Lv 50 Umas sign up as a roster | **Kept** | |
| R3 | Four fronts of 12, the Convergence's 4: 52 fights | **Kept** | |
| R4 | Full HP and MP every fight | **Kept** | |
| R5 | A soft ward on Iron and Arcane | **Kept** | |
| R6 | Echoes on all four fronts, three difficulties, 2× class and gear rank EXP | **Kept, changed** | Gear ranks retired (R2); the Echoes are Trials in their own place (D285) |
| R7 | All twenty of a won run ascend together | **Superseded** | D283 (CO16): one Uma at a time, once her window is full |
| R8 | Only the seals and Rift Conquered gate Ascend | **Kept, changed** | D283: they win the run and light the Rift step; a full window ascends |
| R9 | A tier's next twenty can run its Rift again | **Kept, changed** | D283 (CO18): a new run once the last is won |

### 3.4 collections.md (CO1–CO37)

| Call | As approved (D283) | Status | Why |
|---|---|---|---|
| CO1 | One window an Uma a tier | **Kept** | |
| CO2 | Steps latch, through resets, switches and ascensions | **Kept** | The reason a step reads progress, never a choice (T2W27) |
| CO3 | Dark glass, lead always drawn | **Kept** | |
| CO4 | Outside in, face last | **Kept** | |
| CO5 | The pane map from the bake | **Kept** | Lights any count; no rebake for round 2 (T2W28) |
| CO6 | Tier frames, the Gallery shows her best | **Kept** | Amber in Tier 2, violet in Tier 3 |
| CO7 | The Gallery replaces the Observatory | **Kept** | |
| CO8 | "Weapon Ranks" read as grades | **Kept** | |
| CO9 | Locked outfits shown unlit | **Kept** | |
| CO10 | One pure rule over her state | **Kept** | Read by tier from Tier 2 (T2W28) |
| CO11 | The board: six tracks × five and the Rift, 31 | **Kept, changed** | D289: Weapons is a seventh track, 36; round 2 keeps 36 and re-reads Class, Craft and Stars (T2W24) |
| CO12 | Class V: three Tier 1 classes at R50 | **Kept, changed** | From Tier 2, three Tier 2 classes at R50; Class IV a class and its sibling (T2W25) |
| CO13 | Gear: all eleven worn slots | **Kept** | Three accessory slots in every tier (D264), so eleven in every tier |
| CO14 | World n: her party won the capital's three champions | **Superseded** | CA12 (D293): World n lights on a won capital run |
| CO15 | Craft V at Lv 50 | **Kept, changed** | From Tier 2 her three Craft Levels together, 60 (T2W26); still her own work, the run's clock |
| CO16 | Ascend one Uma at a time, full window | **Kept** | The sheet gains her promotion's picks (T2W16) |
| CO17 | Rift sign-up at twenty Lv 50, not on the window | **Kept** | |
| CO18 | A new run once the last is won | **Kept** | |
| CO19 | Four kinds of content | **Kept** | |
| CO20 | Trials: the Echoes' own place | **Kept** | Built (D285) |
| CO21 | Drills pay items | **Kept** | |
| CO22 | A Training Log: a third of her next level | **Kept** | Tier-relative, so the same in every tier |
| CO23 | Ten runs a day, banked to thirty | **Kept** | |
| CO24 | Five Drills at the tier's Lv 10–50 | **Kept** | |
| CO25 | World credit at the switch | **Kept** | Tier 1's switch only; history |
| CO26 | Bonds not on the board | **Kept** | |
| CO27 | No weekday rotation | **Kept** | |
| CO28 | A full window's reward: Ascend and its frame | **Kept** | From Tier 1, Ascend is also her promotion; in Tier 3, its frame (T2W4) |
| CO29 | No account-wide bonuses | **Kept** | |
| CO30 | Medals later | **Kept** | The place a choice could be celebrated without gating (T2W27) |
| CO31 | Three buildings for ChatGPT | **Kept** | Published (H156) |
| CO32 | Save v35, one record an Uma a tier | **Kept, changed** | v36 appended Weapons (D289); v37 drops the champions mask (CA12); round 2 adds no position (T2W28) |
| CO33 | Tier 3: 30 steps until its Rift exists | **Broken** | Written for a 31-step board and a Rift waiting on Tier 3's fifth scenario; D280 shipped the fifth, D289 made it 35, and the code ties the Rift to a tier above: **T2W4** |
| CO34 | Copy through the copy test | **Kept** | The new tile labels fit it (T2W28) |
| CO35 | Her window beside her bust | **Kept** | |
| CO36 | Percentages on every count | **Kept** | |
| CO37 | The Gallery ranked | **Kept** | |

### 3.5 capitals.md (CA1–CA15)

| Call | As approved (D293) | Status | Why |
|---|---|---|---|
| CA1 | A capital is runs of four full parties | **Kept** | Every tier's capitals (T2W1) |
| CA2 | Four lanes, a fourth route a scenario | **Kept** | The fifteenth scenario's is **T2W13** |
| CA3 | Three generals a lane | **Kept** | |
| CA4 | The Final: four bosses, any order, free retries | **Kept** | |
| CA5 | The run keeps its twenty | **Kept** | |
| CA6 | One open run an Uma; any number at once (five with 20 parties) | **Kept, changed** | D295: 24 parties, so six at once |
| CA7 | No level gate; one healer a party | **Kept** | Both healer children are healers (R2-3) |
| CA8 | HP and MP full; the map's fight; no Sweeps | **Kept** | |
| CA9 | Faces fresh each run | **Kept** | From its continent's capital pack (T2W3) |
| CA10 | About 1.3 levels a first run | **Kept** | Tier-relative EXP: the same in every tier |
| CA11 | Her first run of a continent pays full | **Kept** | Laurels × tier, as every map fight |
| CA12 | World n lights on a won run | **Kept** | Every tier (T2W24) |
| CA13 | Abandon any time | **Kept** | |
| CA14 | Save v37, no engine bump | **Kept** | |
| CA15 | "Run" on screen | **Kept** | |

### 3.6 honeycomb.md (HM1–HM12)

| Call | As approved (D295) | Status | Why |
|---|---|---|---|
| HM1 | The continent map is an SVG honeycomb | **Kept** | Every tier's continents |
| HM2 | Capital at the centre, Lv 6–10 inside, Lv 1–5 on the shore | **Kept** | |
| HM3 | Six Springs on ring 3's corners | **Kept** | |
| HM4 | A hex's biome, name, levels, progress | **Kept** | |
| HM5 | Claim and clear faces | **Kept** | |
| HM6 | Old clears show ✓ with no faces | **Kept** | |
| HM7 | `regionTeams` in each world | **Kept** | Every tier's world, 240 entries at most |
| HM8 | The side panel | **Kept** | |
| HM9 | Opens fitted on the frontier | **Kept** | |
| HM10 | The world and region views stay | **Kept** | |
| HM11 | 48 regions and 24 parties | **Kept** | Every tier's world holds 24 parties (T2W1) |
| HM12 | Ring 1's six run seats | **Kept** | |

### 3.7 The Tier rework's frame (README §2, §9)

| Row | As written (2026-10-25) | Status | Why |
|---|---|---|---|
| §2.1 Tiers | 1–3, 50 levels each; one Uma one tier; promotion through the Rift | **Kept** | Through a full window now (D283), the Ascend sheet her promotion (T2W16) |
| §2.1 Pacing | 822 · 856 · 890 hours an Uma; a Tier 1 run of twenty in 15.8 days, Tier 2's in 28.5 | **Broken** | Measured on the ten-place farm before D264 and D289; today a full window is 954 hours and a run's clock is Craft V: **T2W12**, **T2W32** |
| §2.2 "A run of twenty" | 24 · 15.8 · 28.5 · 29.7 days | **Broken** | The same: **T2W12** |
| §9 Versions (XC11, D198) | R3 Tier 2's weapons v18 · v29, R4 Tier 2's classes v19 · v30, R5 Tier 3 v20 · v31 | **Broken** | Those numbers went to Tier 1's iterations (engine v21, save v36 live; v37 and v38 taken): **T2W15** |

### 3.8 pacing.md's targets

| Target | Status | Why |
|---|---|---|
| Craft Level is a long loop, about 25 days to Lv 50 (D96) | **Kept, changed** | 24.5 days nonstop in Tier 1; from Tier 2 her three Craft Levels to 60 together, 24.9–27.8 (T2W26) |
| Every step is equal (FL28) | **Kept, changed** | D264: 24 → 16 minutes (the page's 36 → 24 is stale; the manual is right) |
| The trades get the same work (FL9) | **Kept, changed** | D264 makes every line 150 refined an Uma; D289's Weapons track tilts a full window to Metal and Vegetables (250 each): T2P balances it with the sub-profession ([§6](#6-provides-and-assumes)) |
| Jobs in broad sizes (D233) | **Kept, changed** | D273: every forge's longest batch about 8 hours |
| The roster works in parallel | **Kept** | Sixty slots a world; the honeycomb's 120 Umas fill them twice over |
| Fights are the main Laurel source (D62) | **Kept** | |
| Extra Stats and gear keep their share (SB1) | **Kept** | |

### 3.9 The count

| Source | Calls | Kept | Kept, changed | Superseded | Broken |
|---|---|---|---|---|---|
| tiers.md | 9 | 4 | 2 | 2 | 1 (T9) |
| tier2-world.md | 10 | 4 | 4 | 2 | 0 |
| rift.md | 9 | 5 | 3 | 1 | 0 |
| collections.md | 37 | 31 | 4 | 1 | 1 (CO33) |
| capitals.md | 15 | 14 | 1 | 0 | 0 |
| honeycomb.md | 12 | 12 | 0 | 0 | 0 |
| The rework's frame | 4 | 1 | 0 | 0 | 3 (§2.1 pacing, §2.2, §9) |
| pacing.md | 7 | 3 | 4 | 0 | 0 |
| **All** | **103** | **74** | **18** | **6** | **5** |

Round 2 moved three rows from Kept to Kept, changed: CO12 (the Class track on the sixteen), CO15 (Craft on three
professions) and pacing.md's Craft loop.

## 4. Tier 2 in full

### 4.1 The world: continents 6–10

**T2W1: Tier 1's shape, with capitals v2 and the honeycomb live first.** No Tier 2 world packet ships before H162 and
H166, so Tier 2 is never built on the old capital or the pixel map.

| Continent | Tier levels · lifetime | Shore (Lv 1–5) · inside (Lv 6–10) | Capital (runs at) | Lean (T2W2) | Packs: shore · inside · capital (T2W3) | Drill | World step |
|---|---|---|---|---|---|---|---|
| `w6` | T2 Lv 1–10 · 51–60 | 24 · 24 regions | T2 Lv 10 · 60 | **Jungle** | middle · middle · large | Drill I (T2 Lv 10) | World I |
| `w7` | T2 Lv 11–20 · 61–70 | 24 · 24 | T2 Lv 20 · 70 | **Sky Isles** | large · small · middle | Drill II | World II |
| `w8` | T2 Lv 21–30 · 71–80 | 24 · 24 | T2 Lv 30 · 80 | **Glacier** | large · middle · small | Drill III | World III |
| `w9` | T2 Lv 31–40 · 81–90 | 24 · 24 | T2 Lv 40 · 90 | **Volcano** | small · large · middle | Drill IV | World IV |
| `w10` | T2 Lv 41–50 · 91–100 | 24 · 24 | T2 Lv 50 · 100 | **Underworld** | large · large · large | Drill V (T2 Lv 50) | World V |

- **A continent:** 48 regions (576 stages), a capital run of 16 fights for four parties, six Springs, six run seats.
  **A tier:** 240 regions, 2,880 stages, 30 capital runs (six a continent seat all 24 parties).
- **Every party has its own road:** a fresh shore region and a fresh inner region a continent, and a lane in one of its
  six capital runs, so 24 parties climb side by side without sharing a first clear.
- **The leans** (T2W2, Z1): five biomes Tier 1 never leaned on, none the Twilight Rift, each leading with a two-element
  signature, so Tier 2's continents feel a step on. The first region stays a Meadow; the shape doesn't change. **The
  guard:** a tier's leans change only while no world of that tier holds a won stage; otherwise that tier keeps Tier 1's,
  since a region's biome sits under its wins.
- **The packs** (T2W3, Z7): the large pack (100 regions' worth a tier in Tier 1), the middle (60) and the small (40)
  keep Tier 1's totals, arranged differently: the middle opens Tier 2 as the small opens Tier 1, the small returns
  mid-tier twice, the large closes it. With the honeycomb a half is 24 regions, so the totals are 120 · 72 · 48.

### 4.2 Foes: lifetime levels, a restarted build

Foes stand at **lifetime** levels (`w6`'s first is 51) and their stats grow with it, as hers do; the **build they expect**
(gear, stars) restarts at each tier's Lv 1 and is Tier 1's × the tier (Z3, D170; EP16, D213). The numbers below are a
regular striker's, today, from `rpgFoe` with the world's regular-foe HP step; T2B owns what changes them (the toolbox
term, weaknesses, shields, party value).

| Tier level | Tier 1: HP · DEF · ATK | Tier 2 | Tier 3 | Build budget, HP and DEF (every tier) | Offense budget |
|---|---|---|---|---|---|
| Lv 1 | 132 · 18 · 67 | 466 · 81 · 233 | 800 · 145 · 398 | 1.00 | 1.00 |
| Lv 10 | 268 · 31 · 129 | 715 · 96 · 344 | 1,162 · 161 · 559 | 1.06 · 1.03 · 1.03 | 1.02 · 1.01 · 1.01 |
| Lv 25 | 760 · 68 · 210 | 1,520 · 147 · 435 | 2,287 · 227 · 660 | 1.41 · 1.32 · 1.29 | 1.12 · 1.09 · 1.08 |
| Lv 40 | 1,939 · 140 · 319 | 3,446 · 262 · 576 | 4,957 · 384 · 833 | 2.09 · 2.00 · 1.98 | 1.31 · 1.29 · 1.28 |
| Lv 50 | 3,388 · 217 · 414 | 5,859 · 390 · 709 | 8,327 · 564 · 1,005 | **2.72** in all three | **1.49** |

- **A fresh party meets a fresh build:** a Tier 2 Lv 1 foe has about 3.5 times Tier 1 Lv 1's HP, against her lifetime-51
  stats, G0 gear and an empty map, as tier2-world §5 measured (engine v13: all 40 opening stages won, 4.7 rounds against
  Tier 1's 6.8). T2B re-measures on engine v21, with the sixteen classes.
- **Live already:** three weaknesses at every rank in Tiers 2 and 3, a regular's by her role (weaknesses v2, D235,
  `rpgWeakCounts`). **Not built yet** (T2B): the toolbox term (SB3–SB5), bosses' shields 9 and 10 (SB6; 8 in every tier
  today), skill MP ×1.7 (Z5; MP × tier today).

### 4.3 Pay: Laurels, tickets, Class Marks and Logs

**T2W10: a Laurel buys the same work in every tier** (PP17's rule, applied to the tickets the Exchange left flat).

| | Tier 1 | Tier 2 | Tier 3 | Rule |
|---|---|---|---|---|
| A region's first clear, Lv 1–40 · Lv 41–50 | 630 · 2,520 | 1,260 · 5,040 | 1,890 · 7,560 | Fights × tier (live) |
| A party's climb to Lv 50 (its regions and capital lanes) | 10,388 | 20,775 | 31,163 | Fights × tier (live) |
| Raw item G1–G5 · G6–G10 | 20 · 53 | 40 · 106 | 60 · 159 | × tier (live, D264) |
| Speed Ticket · Sweep Ticket | 10 · 15 | **20 · 30** | **30 · 45** | × tier (**T2W10**; live 10 · 15 everywhere) |
| A party's climb in job time (its Laurels as Speed Tickets) | 519 hours | 519 (live: 1,039) | 519 (live: 1,558) | T2W10 keeps it equal |
| The purse's Laurels | — | **2,000** | **3,000** | × the tier she arrives in (**T2W10**; live 1,000) |
| The purse's Speed Tickets | — | 5 | 5 | Tickets are time: equal |
| Class Marks, Class Manuals | Half of EXP past a cap; 1,000 for 1,000 | The same | The same | EXP is tier-relative |
| Training Logs | A third of her next level | The same | The same | Tier-relative |

- **Why × tier:** raw items and sales are × tier so a Laurel buys the same work (PP17); the tickets were left flat, so
  today a Tier 2 fight buys twice the job time a Tier 1 fight does, and Tier 3 three times. Making them × tier keeps the
  owner's "the rate of progression is fine as it is" in every tier. **The alternative** (keep them flat) eases the
  Wilds' clock in later tiers through Laurels; it's the first knob if Tier 2 plays slow.
- **Laurels never run short:** the purse and the first wins cover the first raw items (a party's G1 kit is about 375
  raw items if bought, 15,000 Laurels in Tier 2; gathered, it's the Wilds' first day).

### 4.4 Promotion: the Ascend sheet

**R2-5 and R2-6, built on the live sheet.** The owner: "I want the new class to be selected on Tier 2 promotion" and
"weapons … selected to their new weapon types on Tier 2 promotion". There is no Tier 0 above Tier 1 and no class can
promote inside a Tier 2 world, so **the Ascend is the promotion** (R2-5): the sheet that sends her up is where she
picks what she becomes.

**T2W16: one sheet, two pages, every pick pre-filled.** The Gallery's Ascend sheet keeps its live shape (the ready
Umas ticked, the lines, Ascend n) and gains, per Uma, a summary row of her picks and a second page to change them. The
defaults are complete, so a party of five, or a Rift's twenty, still ascends in one tap; nothing opens over the sheet
(G4): her page replaces the list inside the same sheet, with Back, as the Logs sheet picks an Uma and then an amount.

| # | Screen | What it shows | Taps with the defaults |
|---|---|---|---|
| 0 | **The Gallery** · Ready | Her full window with its ring and the green dot; "Ready to ascend · Opens 6" on her tile; **Ascend 5** in the head | 1 |
| 1 | **Ascend to Tier 2** · who goes | The ready Umas **grouped by party**, each ticked; a row per Uma: her name, her picked Tier 2 class with "Suggested", her three weapons and types in one line, "Opens 6 of 16"; one who can't go says why ("At work · recall first"); a check line per whole party; the lines (where she lands, what restarts, the purse, Class Marks, "3 of 5 to fight in Tier 2"); **Ascend 5** | 0 |
| 2 | **Her Tier 2** · her class | The classes open to her, two per Tier 1 class she has at R50, grouped by that class: each with its slots, its role in a few words (damage, a self-buff; damage on both channels; damage and support; a battle healer), a Healer chip; Suggested marked; the locked ones greyed, "Rank to 50 in Tier 1" | 1 to change |
| 3 | **Her Tier 2** · her weapons | Her picked class's three slots, each a weapon kind and its Tier 2 type (gear's names), Suggested pre-set; the kinds she covers; "Swap any time on Gear" | 0–3 |
| 4 | **Her Tier 2** · her sub-profession | Her line's two professions (fixed by her calling) and the four other lines for her third, Suggested marked | 0–1 |
| 5 | Back on who goes · **Ascend 5** | The tier veil, then Tier 2's Town Hall, as live | 1 |

Pages 2–4 are one scrolling page per Uma ("Her Tier 2"), class first because her slots follow it. The
[Ascend page](previews/progression-ascend.html) mocks each screen at 390 × 844 and plays a party of five through it.

#### 4.4.1 Which Umas are ready

The live rule, unchanged: her window here is full, Rift step included, so she was on a won run's roster; no Rift or
world-map fight open; not at work. The sheet adds two things the promotion needs:

- **Grouped by party** (T2W22): a party whose five are all ready shows as one group with its name ("Party 2 · all five
  ready"), since it moves into Tier 2 whole and keeps its name (live). Others list after it, one row each.
- **"Opens 6 of 16"** (T2W17): how many Tier 2 classes she'd open, two for each Tier 1 class she has at R50. Class V
  guarantees three (6 open); an Uma with all eight at R50 opens all sixteen. On her tile in the Gallery and her row on
  the sheet, so a player who wants more choice ranks one more Tier 1 class before she goes. This line arrives with
  Tier 2's switch; no Tier 1 rule changes (R2-1).

#### 4.4.2 Her Tier 2 class

**T2W17: what opens.** **Both children of every Tier 1 class she has at Class Rank 50 when she ascends:** 6 at least
(Class V's three), up to 16. The sheet reads her ranks in the Tier 1 world before she leaves (she arrives at Class Rank 1
everywhere), and the move writes **her open set** into the new world (T2C's field, assumed her Tier 1 parents, at most
eight ids), so a later reset of her ranks can never shut a class. The set is **fixed for the tier:** no Tier 1 class
fights in a Tier 2 world (assumed, as no Tier 0 fights in a later one, CV10), so there is no parent left to rank there.
She **switches freely** among her open classes on her Class tab, each on its own Class Rank, as Tier 1's held classes
work (R2-5); with XR1's shared ladder her Ranks 1–10 rise in all of them at once.

**T2W18: what's Suggested.** **The keeper of the class she fights as** when it is at R50 (her party looks like its Tier
1 self, the owner's first comp), else the keeper of her highest-ranked R50 class (ties: her family's, then the class
tree's order). The expander is one tap away beside it. One healer a party is checked where a party fights (live
`healerBlock`), never here; the sheet warns (T2W22).

| Her Tier 1 class at R50 | Opens (classes.md names them; R2-3, R2-4's shape) | Healer |
|---|---|---|
| Brawler | Its keeper (pure physical, a self-buff) · its expander (Arms and Tomes, the Tomes on ATK) | — |
| Sorcerer | Its keeper (pure magical, a self-buff) · its expander (Tomes and Arms, the Arms on M.ATK) | — |
| Arms Spellblade · Tome Spellblade | Each its keeper (sharper damage) · its expander (damage and a little support) | — |
| Arms Summoner · Tome Summoner | Each its keeper · its expander (support: wider buffs and debuffs, a ward or a small mend) | — |
| Paladin · Cleric | Each its keeper (the healer, sharpened) · its expander (a battle healer: more damage, less healing) | **Both** |

A made-up Pace Uma who brought Arms Spellblade, Tome Spellblade and Paladin to R50 sees six cards in three pairs; she
fought as the Arms Spellblade, so its keeper is Suggested.

#### 4.4.3 Her weapons and their types

**T2W19: her class's preset, each weapon's type Suggested, set on the sheet.** The moment she picks a class, the
weapons part fills with that class's three slots as its preset (D263's rule on the sixteen, T2C's presets) and each
weapon's **Tier 2 type** as gear's Suggested (round 1's Pure or Dual and its partner, or what [gear.md](gear.md) makes of
them, R2-6). A slot offers the kinds its channel allows, an expander's cross-channel slot included ("Tome · on ATK"); a
type is a chip row under its weapon. The line under the slots counts what she covers ("Greatsword, Axe, Lance + Bow:
4 kinds"). Later she swaps kinds and types on her Gear tab, freely or cheaply as gear sets ("weapons it's easier to
swap around"); the sheet's pick is a start, never a lock. Round 1's "a weapon's G5 picks its branch" is superseded
(R2-6): the type is hers from G0.

#### 4.4.4 Her sub-profession

**T2W20: shown on the sheet, pre-picked.** Her calling names her line, and from Tier 2 that line is **two professions**
(R2-9); her **third** is a sub-profession from another line, and she works from her first minute in Tier 2. So her page
shows her line's two as fixed and the four other lines as chips, the Suggested one marked (professions.md's rule; round
1's was the line with the fewest hands for its work). She may change it there or later as [professions.md](professions.md)
rules it.

#### 4.4.5 What she keeps, picks and restarts

**T2W21: picks are settings, set or confirmed on the sheet; progress restarts.** This replaces round 1's T2W8
("settings carry"), which had no picks to make. It reconciles the cross-reference's **XR5** (branches and forms carry):
going up from Tier 1 there is nothing of Tier 2's to carry, so the sheet sets them; going up from Tier 2, what she had
**pre-fills** the same pages.

| Piece | Tier 1 → 2 | Tier 2 → 3 | Why |
|---|---|---|---|
| Her calling, her line, her template | Kept | Kept | Her racing profile's (live) |
| Her lower tiers' full windows, her history | Kept | Kept | The account's (CO1) |
| **Her class** | **Picked:** a Tier 2 class, Suggested the keeper of the class she fights as | **Picked:** her class in Tier 3, Suggested the one she fights as (T2W31) | R2-5 |
| **The classes open to her** | Both children of every Tier 1 class at R50: 6–16, written to the new world | Her open set carries (assumed, T2W31) | T2W17 |
| **Her weapons' kinds and types** | **Picked:** her class's preset, gear's Suggested types | **Picked**, pre-filled with hers | R2-6 |
| Her accessory slots' families and kinds | Kept (live) | Kept | Live |
| Her accessory forms (the tree, R2-7) | None yet: a Tier 1 slot has no tree | **Kept as settings:** each waits until its slot's grade reopens it | A form is a setting; its grade is progress |
| Her Extra Stats picks (R2-8) | None yet | **Kept as settings:** a node's pick applies when its jewel reopens it | The same |
| **Her sub-profession** | **Picked**, Suggested | Kept, changeable on the sheet | R2-9 |
| Class Rank | 1 in every open class; Ranks 1–10 one shared ladder (XR1) | The same | Progress |
| Level, grades, nodes, all three Craft Levels, Bonds, Hall seats | Restart: Lv 1, G0, an empty map, Craft Lv 1 in each, none | The same | Live rule |
| Tree picks (lines, tips, her ★ tip), equipped skills | Defaults | Defaults | They follow Class Rank |
| Her grades' made items · her set jewels | Back to the old Warehouse · gone | The same | Live rule |

#### 4.4.6 The purse

Per Uma, into the new world: **2,000 Laurels** (T2W10; 3,000 into Tier 3) and **5 Speed Tickets**; her EXP banked past
Lv 50 as Class Marks, one per 10, at most 2,000. A party of five brings 10,000 Laurels, 25 Speed Tickets and up to
10,000 Class Marks; a Rift's twenty 40,000, 100 and 40,000. The sheet's lines say it in today's words ("+10,000 Laurels
· +25 Speed Tickets", "+6,400 Class Marks").

#### 4.4.7 A party ascending together

**T2W22: grouped by party, a check line, a reset.** A party whose five all go:
- **Moves with its name** into Tier 2's first empty party (live), so its comp arrives as picked.
- **Shows its check line** from the picks, refreshed as they change: "One healer · 10 of 10 kinds · damage 3 · support 1
  · heal 1" (roles by T2B's party-value classes; kinds counted over the five's slots, types' partners included). Two
  healer picks show the live words "One healer a party" in the warning colour; **a warning, never a block**, since the
  game checks one healer where a party fights, and she may mean to split the party in Tier 2.
- **"Suggested for all"** resets every pick of the group to its Suggested (each keeper, each preset), one tap.

The owner's comps (R2-12) start here: Tier 1's look comes free (all keepers); swapping the Brawler and the Sorcerer for
their expanders, or the Paladin for its battle healer with a Spellblade's expander to support, is two taps a member,
and the check line shows the party's breadth before it goes.

#### 4.4.8 Umas already in a Tier 2 world

**T2W23: at Tier 2's switch, each Uma already there becomes the keeper of her class.** Before round 2 is built, an Uma
who ascends arrives as her Tier 1 class (live) and plays Tier 1's eight × tier. When the Tier 2 toolbox switches on:
- She **opens both children of the class she fights as and of every Tier 1 class she has at R50 in that world** (her
  Tier 1 ranks are gone; the Tier 2 world's are the only record).
- She **becomes her class's keeper at that class's Class Rank** (identity kept, nothing lost); every other open class
  stands at Rank 1, or at the shared ladder's rank.
- Her weapons keep their kinds with gear's Suggested types; her sub-profession is Suggested.
- Her Gallery tile and Window sheet show "New: Tier 2 classes" until her Class tab is opened; no sheet is forced.
- Her window keeps every step it lit (CO2).

#### 4.4.9 What the sheet writes

Per Uma, into the new world, in the save that ships Tier 2's toolbox (T2W15): her open set and her class (T2C's
fields), her class's three weapons and their types (T2G's), her sub-profession (T2P's). The sheet's own state is never
stored: Suggested is derived each time. Windows add nothing (T2W28).

### 4.5 Content: the Campaign, capital runs, Drills, Trials, the Rift

| Content | Tier 2 | Opens |
|---|---|---|
| **The Campaign** | 240 regions, 24 a band a continent, each party its own | From arrival |
| **Capital runs** | Six a continent, 16 fights each, at T2 Lv 10 · 20 … 50; a first run pays about 1.3 levels to each of its twenty and triple Laurels × 2 | Any four full parties |
| **Drills** (T2W6) | T2 Lv 10 · 20 · 30 · 40 · 50 on `w6`–`w10`; 2–6 Logs a win; ten runs a day, banked to thirty; the Logs are the world's | The tier's first map win |
| **Trials** (T2W6) | Each front at T2 Lv 45 · 50 · 55 (lifetime 95 · 100 · 100 at ×1.22); Class EXP 652 · 1,300 · 1,300 a win | With the Rift: five T2 Lv 50 Umas |
| **The Rift** (T2W5, T2W30) | Four fronts at T2 Lv 50 on the tier's budget, the Convergence; Tier 2's own seals and Rift Conquered · Tier 2 (live ids); **one added test a front** | Five T2 Lv 50 Umas; twenty sign up |

**T2W5 and T2W30: the fronts' added tests, aimed at round 2's tools.** Z9's tests stand; what each asks of the toolbox
is now the sixteen classes', the weapon types', the stat picks' and the accessory tree's. Each tier's numbers are T2B's,
against rift.md §11's targets (the right party ≥ 80% a stage and 60–70% a champion, the wrong one ≤ 30% and ≤ 10%, the
Convergence about 50%).

| Front (guided by family, CV23) | Its added test in Tier 2 | What it asks of round 2's toolbox |
|---|---|---|
| **Iron** (the Warrior side) | Shields 2 over Tier 1's; foes weak to one or two Arms | Pure types' weak hits (T2G), Break tips (T2C), the Brawler keeper's self-buff |
| **Arcane** (the Mage side) | One element a foe: a stage's leaders weak to one, its guards to another | A Dual type's partner (T2G), a damage-kind pick on a moon (T2E), the Sorcerer's expander's Arms on M.ATK |
| **Duel** (the Spellblades) | Her boss acts three times from stage 9 | Single-target burst: keepers, Pure types, single-target picks (T2E) |
| **Horde** (the Summoners) | Five to seven foes a wave | Area and multi-hit picks (T2E, R2-8), sweeps and volleys, the support expanders' wider debuffs |

- **The guidance names the Tier 1 class, and either child fits** (T2W30): Iron still suggests two Brawlers, an Arms
  Spellblade, an Arms Summoner and a Paladin, now read as "a Brawler's child" and so on; a member fits a guided class if
  she holds either of its children, the keeper Suggested in **Use the guided weapons**. So a run's twenty need no
  particular expander, and any of the owner's comps can fit a front.
- **The faces:** the cross-pack picker prefers faces the account hasn't defeated; the Bestiary counts every tier.

### 4.6 Her window in Tier 2

**R2-10:** "the board's tracks read the new systems (Tier 2 classes, weapon types, the accessory tree, Extra Stats
branches, three professions), its step count and pacing kept close to Tier 1's 36."

**T2W24: one board, 36 steps, the same seven tracks and the Rift, the same record positions; three tracks re-read.**
No track is added, none removed, so the window lights at Tier 1's pace and the record and the art stay as they are. Each
new system lands where its progress already lives.

#### 4.6.1 The board

| Track | I | II | III | IV | V | Round 2 |
|---|---|---|---|---|---|---|
| **Level** | T2 Lv 10 | 20 | 30 | 40 | 50 | — |
| **Class** | A Tier 2 class at R10 | One at R30 | One at R50 | **A Tier 2 class and its sibling at R50** | **Three Tier 2 classes at R50** | The sixteen; IV the owner's swap (T2W25) |
| **Craft** | **Her three Craft Levels add up to 12** | 24 | 36 | 48 | **60** | Three professions (T2W26) |
| **Gear** | All eleven worn slots at G2 | G4 | G6 | G8 | G10 | The accessory tree's forms open with these grades |
| **Weapons** | Five weapons at G2 | G4 | G6 | G8 | G10 | Any of her classes', any type |
| **Stars** | Every node to I | to II | to III | to IV | The whole map | The tier's map, whatever T2E gives it; picks not read |
| **World** | Continent 6: a won capital run | 7 | 8 | 9 | 10 | Capital runs (CA12) |
| **Rift** | On a won Tier 2 Rift run | | | | | — |

**Stars' counts** follow [extra-stats.md](extra-stats.md)'s Tier 2 map by the live rule (every body's nodes numbered n
or less, her moon's I from II and II from IV, then the whole map): **4 · 9 · 13 · 18 · 22** if round 1's weapon moon
becomes a pick on the existing bodies (assumed, R2-8's first option), **5 · 11 · 16 · 22 · 27** if it stays a body.

#### 4.6.2 Each new system, and where the board reads it

| System (round 2) | Its progress | Its choices | On the board |
|---|---|---|---|
| **Sixteen classes** (R2-2–R2-5) | Class Rank on each class she holds | Which she fights as; keeper or expander | **Class I–V** read her ranks over every Tier 2 class she holds; **IV asks for a class and its sibling** |
| **Weapon types** (R2-6) | Each weapon kind's grade | Pure or Dual, the partner | **Weapons I–V** (five kinds, any type) and **Gear I–V** (her active class's three) |
| **The accessory tree** (R2-7) | Each slot's grade; forms open as it rises | Which form she wears | **Gear I–V** (every slot's grade); Gear V means every tree open, if gear finishes its tree by G10 (assumed) |
| **Extra Stats picks** (R2-8) | Nodes opened by jewels | The stat each node takes | **Stars I–V** (open nodes) |
| **Three professions** (R2-9) | Three Craft Levels | Her sub-profession; where she works | **Craft I–V** (their sum) |
| **Capital runs** (D293) | A won run a continent | Which lane | **World I–V** |
| **The Rift** | A won run | — | **Rift** |

#### 4.6.3 Class: a class and its sibling

**T2W25: Class I–III read her best Tier 2 class at R10 · R30 · R50; IV asks for a Tier 2 class and its sibling at R50
(both children of one Tier 1 class); V three Tier 2 classes at R50, any.** The owner's "for balance I will swap back
and forth between each one" becomes the one step that names the pair, and it names no particular pair: any of her open
parents' keeper and expander will do.

- **The pace is Tier 1's:** her campaign's Class EXP (about 51,000) covers one class from Rank 1 (3,600 + 23,680) and a
  second from Rank 10 (23,680, the shared ladder having raised it), so IV lights near T2 Lv 50 as Tier 1's two-at-R50
  does; V takes 20 Trial wins at Lv 50 (40 at Lv 45), or 24 Manuals.
- **It forces no build for long:** an Uma who never wants her expander in a fight can rank it with Manuals or a
  half-campaign, and R2-11's party-value band keeps every expander a fair party member (T2B). The alternative (IV "two
  Tier 2 classes at R50, any") is the seam if the owner would rather the board not nudge the swap.
- **Labels:** the tile "Pair at R50", next "Pair R41/50" (the lower rank of her best pair); the rule line "A Tier 2 class
  and its sibling at Class Rank 50".

#### 4.6.4 Craft: three professions together

**T2W26: Craft I–V ask her three Craft Levels to add up to 12 · 24 · 36 · 48 · 60.** One Craft Level was the board's
clock in Tier 1 (24.5 days of her own work, CO15); three on the same steps would triple it, and her best alone would
leave the other two unread. The sum reads all three, takes any split, and keeps her own work close to Tier 1's:

| Craft n (her three add up to) | 12 | 24 | 36 | 48 | 60 |
|---|---|---|---|---|---|
| Tier 1: Craft Lv 10n, days nonstop | 3.75 | 8.31 | 13.29 | 18.69 | **24.50** |
| Even (4n each) | 3.64 | 8.66 | 13.89 | 19.31 | **24.94** (×1.02) |
| Her line's two (her first one level ahead) | 3.67 | 8.82 | 14.27 | 20.02 | **26.07** (×1.06) |
| Main first (two thirds, a third, the sub at 1) | 3.69 | 8.90 | 14.44 | 20.32 | **26.53** (×1.08) |
| A specialist (one to 50, then the rest) | 3.75 | 9.28 | 15.40 | 22.13 | **27.82** (×1.14) |

Days of her own slot time nonstop (Craft EXP 1,425 + 15 × level a level, 2 a base minute, the places' ×1.25); ×1.25 at
80% busy. Because EXP a level is nearly flat (1,440 → 2,160), spreading costs no more than Tier 1; specialising costs at
most 14%, since her last ten levels must come from a second profession (a specialist reaches 50 + 9 + 1). That is the
one nudge: **use at least one other profession a little**, which is the owner's point of having three.

- **Labels:** the tile "Crafts 36", next "Crafts 29/36", the rule line "Her three Craft Levels add up to 36"; the
  Window sheet's source line "Wilds jobs · all three".
- **The dial:** Craft V at 56 instead of 60 brings a specialist to 26.1 days (×1.07) and an even split to 22.4; the
  thresholds move only if [professions.md](professions.md) changes a profession's curve.

#### 4.6.5 Progress, never a choice

**T2W27: a step reads progress only; a choice is read only as breadth any option meets equally.** The code could read a
pick (it is state), but:

| A step that would read… | What happens | Verdict |
|---|---|---|
| A free pick ("wear a Dual", "set a life-steal stat") | Latches on one tap, then she swaps back: a tutorial, not an achievement (CO2) | No |
| A held pick ("five Dual weapons at G10", "every node on AoE") | Forces a build for weeks, the owner's fear ("too extreme variants") | No |
| A specific class ("the Brawler's expander at R50") | Forces one class on every Brawler-family Uma | No |
| Breadth any option meets ("a class and its sibling", "three classes", "five weapons", "her three Crafts to 60") | Rewards the system's width with no build named | **Yes** |

The window's art knows only the count, so reading a choice would gain nothing on the glass either. If the owner wants
a choice celebrated (her first expander fight, every type tried), that is CO30's medal phase: a ring on the window that
gates nothing.

#### 4.6.6 Pacing by track

A first cohort's fighting-party Uma, nonstop (×1.25 for the Wilds at 80%), on the run model of [§4.8](#48-a-tier-2-run-end-to-end):

| Track | I | II | III | IV | V | Against Tier 1 |
|---|---|---|---|---|---|---|
| Level | 0–1 | 1 | 2 | 6.4 | 8.8 | The same |
| Class | 0–1 | 1.2 (Lv 22) | 5.0 (Lv 36) | 8.8 | 10.8 | The same |
| Craft | 3.6–3.8 | 8.7–9.3 | 13.9–15.4 | 19.3–22.1 | **24.9–27.8** | Tier 1 3.8 · 8.3 · 13.3 · 18.7 · 24.5 |
| Gear | 3.0 | 7.4 | 12.3 | 17.5 | 23.1 | The same |
| Weapons | 3.3 | 7.7 | 12.6 | 17.8 | 25.0 | The same |
| Stars | 2.5 | 6.9 | 11.8 | 17.0 | 22.6 | The same |
| World | 0–1 | 1 | 2 | 6.4 | 8.8 | The same |
| Rift | 33.5 (fronts from G8, about 17 days of the owner's play) | | | | | The same |

**Ready about day 33.5** (the Rift; 37.6 at 80%), as in Tier 1's model: the new systems change no track's pace but
Craft's, and Craft V still lands before the Rift.

#### 4.6.7 The record and the art

**T2W28: no new position, no rebake; the rules read by tier.**

| | What changes | What doesn't |
|---|---|---|
| **The record** | Nothing. Tier 2's and 3's steps keep the live ids (`class-4`, `craft-1` …) and positions; each id's rule is the tier's | 36 codes × 3 characters in every tier; no widening, no migration. Steps lit in a Tier 2 world before its toolbox (Tier 1's rules × tier) stay lit (CO2) |
| **The champions mask** | Leaves with capitals v2 (v37, CA12) | — |
| **The rules** (`rpg/windows.ts`, `save/windows.ts`) | From Tier 2's switch: Class reads the tier's own classes (the sixteen, not `tier1Ranks`), IV pairs by T2C's sibling map, Craft the sum of T2P's three Craft Levels, Stars every body's `body:n`; `windowNext` gains "Pair R41/50" and "Crafts 29/36" | One pure rule, after every change and at load (CO10); latching; the toast |
| **The art** | Nothing | 36 steps: 7.14 of the map's 250 values a step, the face with the 36th; the tier frames exist; **the pane map never knows which step lit** |
| **The copy** | Tiles "Pair at R50", "Crafts 36"; toasts "Window +1 · Crafts 36" | Six words at most a string (CO34) |

### 4.7 The toolbox arrives

**T2W11: no new gates.** Every Tier 2 addition opens on a gate its system already has (the Ascend sheet, Class Rank, a
grade's Uma and Craft Level, a node's jewel and level), so nothing waits on a day, a quest or an unlock of its own. The
days are a first cohort's, nonstop, the fighting party served first ([§4.8](#48-a-tier-2-run-end-to-end)); the shapes are
round 2's, as [§6](#6-provides-and-assumes) assumes them.

| Addition | Doc | Gate | First cohort, day (80%) | Her level then |
|---|---|---|---|---|
| **Her Tier 2 class**, her open set (6–16), switching | T2C | **The Ascend sheet** (T2W16–T2W18) | 0 | Lv 1 |
| **Her weapons' types** | T2G | **The Ascend sheet** (T2W19); swaps on her Gear tab | 0 | Lv 1 |
| **Her line's two professions and her sub-profession** | T2P | **The Ascend sheet** (T2W20); Craft Lv 1 in each | 0 | — |
| Three weaknesses at every rank (live, D235); the toolbox term rising to Lv 50; party value (R2-11) | T2B | Tier 2's foes | 0 | Lv 1 |
| Skill MP ×1.7; the healing scale ÷ 540 | T2C, T2B | Every Tier 2 skill | 0 | Lv 1 |
| Ranks 1–10, one shared ladder (XR1): every open class at R10 together | T2C | Class EXP 3,600 | 0–1 | Lv ~10 |
| Her class's own kit by depth (the keeper's self-buff, the expander's cross channel, support or battle healing) | T2C | Class Rank 1 · 10 · 20 · 30 · 40 (XR1: Uma Lv 1 · 10 · 16 · 22 · 29) | 0 → 1.9 | Lv 1 → 29 |
| ★ Signature tip on her lead weapon's tree | T2U | Its tip fork, depth 5 (CR 40) | 1.9 | Lv 29 |
| **Accessory forms** | T2G | A slot's grade as it rises (assumed: the tree complete by G10) | 2.0 → 22.1 (2.6 → 27.7) | Lv 6 → 46 |
| **A stat pick on each node** | T2E | Each node as its jewel opens it | 2.5 → 22.6 | Lv 6 → 46 |
| Her second class at R50 (Class IV's sibling) | T2C | Class EXP past her first R50 | 8.8 | Lv 50 |
| LB+ at Bond 10 | T2C | Bond 10 in a hall | With Bonds, not days | — |
| Ten equipped skills | T2C | Uma Level (one more at Lv 10, 15 … 40, T2C16) | 6.4 | Lv 40 |

### 4.8 A Tier 2 run end to end

**A model, not a measurement.** A first cohort of twenty arrives together (four parties of the release's mix, all
keepers by default); the Wilds work nonstop; the fighting party is served first; its fights climb two bands a day while
gear allows and its Lv 41–50 bosses wait for G5 (tier2-world §11's measurement on engine v13: G3 won 15% of T2 Lv 50
bosses, G5 90%; T2B re-measures on the sixteen); the Rift's fronts start when G8 opens and take 2–3 weeks of the
owner's play (rift.md §11). Her window: Level IV and V wait for G4 and G5; a Stars step lands half a day after its grade
opens, a Gear step a day (the party's kit is 5 hours of the slots a grade), a Weapons step after its Gear step, Weapons
V three days after G10; Craft by T2W26's sum, shown as the even split and a specialist. The
[run page](previews/progression-run.html) draws the same model, with an 80% toggle. Days are nonstop; the Wilds' days at
80% are in brackets.

| Day | The fighting party | The Wilds | Her window (of 36) |
|---|---|---|---|
| **0** | **Ascend:** each Uma's Tier 2 class, weapons and types and sub-profession set on the sheet (defaults: all keepers, presets, Suggested); arrive with 40,000 Laurels and 100 Speed Tickets for twenty (T2W10); `w6`'s shore; the Exchange stocks G1–G5 after the first win; Drills open; capital run 1 | Craft 1 in all three professions; G1 only | Level I, Class I, World I: **3** |
| **1** | Lv 20 (`w7`), capital run 2; Class Rank 20 (depth 3, Lv 16); Class Rank 30 at Lv 22 (day 1.2) | | Level II, Class II, World II: **6** |
| **2** | Lv 30 (`w8`), capital run 3; depth 5 at CR 40 (Lv 29): her ★ tip | G2 opens (2.0 [2.6]): first accessory forms; first stat picks | Level III, World III: **8** |
| **3** | | Stars I, Gear I, Weapons I | **11** |
| **3.7** | | Crafts 12 (3.6–3.8 [4.6–4.7]) | Craft I: **12** |
| **5** | Class Rank 50 on her first class (Lv 36) | | Class III: **13** |
| **6.4** | Lv 40 (`w9`), capital run 4 | G4 opens (6.4 [8.0]) | Level IV, World IV: **15** |
| **7.5** | | Stars II, Gear II, Weapons II | **18** |
| **9** | Lv 50 (`w10`), capital run 5; her class's sibling at R50; five Lv 50 Umas: the Rift and Trials open | G5 (8.8 [11.0]); Crafts 24 (8.7–9.3 [10.8–11.6]) | Level V, World V, Class IV, Craft II: **22** |
| **10.8** | Twenty Trial wins at T2 Lv 50: a third class to R50 | | Class V: **23** |
| **12** | Four parties at Lv 50: twenty sign up for the Rift | G6 (11.3 [14.1]): Stars III, Gear III, Weapons III | **26** |
| **14.5** | | Crafts 36 (13.9–15.4 [17.4–19.3]) | Craft III: **27** |
| **16.5** | The Rift's fronts start on curve | G8 (16.5 [20.6]) | |
| **17.5** | | Stars IV, Gear IV, Weapons IV | **30** |
| **20.5** | | Crafts 48 (19.3–22.1 [24.1–27.7]) | Craft IV: **31** |
| **23** | | G10 (22.1 [27.7]): Stars V, Gear V | **33** |
| **25** | | The party's two extra weapons at G10 | Weapons V: **34** |
| **26** | | Crafts 60 (24.9–27.8 [31.2–34.8]) | Craft V: **35** |
| **33.5** | The Rift won | The twenty's last full windows (about 32) | Rift: **36, ready to ascend** |

- **The fights take hours, the run takes weeks.** The party's climb is about 130 wins; the Rift about 58 fights; its
  third class 20 Trials. Everything else is the Wilds.
- **Later cohorts go faster:** they arrive in a world whose crafters already make G10, so their gear waits on the slots,
  not on Craft; their own Crafts 60 (24.9–27.8 days) stay the floor.
- **The promotion takes a minute:** a party's five on the sheet with defaults is one tap; picking an expander and its
  types is three or four.

### 4.9 Ready to ascend

The last steps, in the order they usually fall:

| Last steps | Typical day (nonstop · 80%) | What moves it |
|---|---|---|
| Stars V, Gear V | 22.6–23.1 · 28.2–28.8 | The makers' Craft 46 (G10); then the slots |
| Weapons V | 25 (the party) to 32 (the twenty) · 31 to 40 | Metal and Vegetables: two extra weapons an Uma (D289) |
| Craft V (her three to 60) | 24.9–27.8 · 31.2–34.8 | Her own work only; Speed Tickets fast-forward her jobs (CO15) |
| The Rift | 33.5 · 37.6 | The owner's play: a run of twenty, about 58 fights |

So **a Tier 2 Uma is ready about five weeks after she arrives**, as in Tier 1. She can't be earlier than her Crafts 60
and the Rift's win.

## 5. Tier 3 in full

### 5.1 The world: continents 11–15

The same as Tier 2's (T2W1), at lifetime 101–150 ("T3 Lv 1–50"), build × 2.6.

| Continent | Tier levels · lifetime | Capital | Lean (T2W2) | Packs: shore · inside · capital (T2W3) | Drill |
|---|---|---|---|---|---|
| `w11` | T3 Lv 1–10 · 101–110 | T3 Lv 10 | **Swamp** | large · middle · large | Drill I |
| `w12` | T3 Lv 11–20 · 111–120 | T3 Lv 20 | **Highlands** | middle · large · middle | Drill II |
| `w13` | T3 Lv 21–30 · 121–130 | T3 Lv 30 | **Geyser Basin** | small · small · small | Drill III |
| `w14` | T3 Lv 31–40 · 131–140 | T3 Lv 40 | **Storm Peaks** | large · middle · large | Drill IV |
| `w15` | T3 Lv 41–50 · 141–150 | T3 Lv 50 | **Ancient Ruins** | large · large · middle | Drill V |

- **The leans:** five of the seven biomes no tier leans on yet (Crystal Caverns and Canyon stay without), each leading
  with a two-element signature; the Ancient Ruins' light+dark escorts close the game as the Haunted Moor closes Tier 1
  and the Underworld Tier 2.
- **The packs:** Tier 1's totals a third way: the small pack holds the whole middle continent once.
- **T2W13: the fifteenth scenario's own Finals.** `w15`'s capital reuses continent 1's routes today. It gets four
  authored routes of its own (original names and lines, checked against the release), with Tier 3's world packets.

### 5.2 Its Rift (T2W4)

**Tier 3 gets a Rift.** The same shape and rules as Tiers 1 and 2, at T3 Lv 50 (lifetime 150), on Tier 3's budget, with
Tier 2's four added tests (T2W5, T2W30) at T2B's Tier 3 numbers.

| | Tier 3's Rift |
|---|---|
| Opens | Five T3 Lv 50 Umas; twenty sign up |
| Pays | Achievements: Iron, Arcane, Duel and Horde Seals · Tier 3, and Rift Conquered · Tier 3 (the live pattern); the titles stay once an account |
| Lights | **The Rift step: Tier 3's board is 36**, as every tier's |
| Trials | Open with it: each front at T3 Lv 45 · 50 · 55, so Tier 3's Lv 50 Umas get their rank content (today "No Trials in this tier yet") |
| Ascend | **None** while Tier 3 is the top tier: a full Tier 3 window is the end of her collection, in Tier 3's violet frame |

- **Why:** Tier 3 has five continents since D280 and every other piece of a tier; without a Rift it has no rank content
  (Trials open with the Rift), its Lv 50 Umas no end event and its window one step less. The generator already takes any
  tier (`rift/generate.ts`); the gate is `RIFT_TIERS = [1, 2]`.
- **Windows already full stay full:** a full Tier 3 window latched the Rift's place (D284 call 5).
- **The alternative** (no Tier 3 Rift until a Tier 4 exists) leaves Tier 3 without Trials, so its Class V comes only
  from Manuals and fights.

### 5.3 The toolbox

Tier 3's additions, assumed from round 2's direction ("Tier 3 deepens what Tier 2 opens", R2-1); each opens on its
system's own gate (T2W11).

| Addition (assumed) | Doc | Gate |
|---|---|---|
| The sixteen classes deepened: two lines held a tree, the crown (every held capstone at 5.6) and her family's mastery at Class Rank 50; no new promotion | T2C | Class Rank 50 |
| Weapon types' Tier 3 step, if gear gives one | T2G | Gear's |
| The accessory tree's deeper forms | T2G | A slot's grade |
| The stat lists' Tier 3 entries | T2E | A node's jewel |
| Three professions, as Tier 2's | T2P | Nothing new |
| The ★ tip on both held lines of her lead tree (T2U13) | T2U | Depth 5, Class Rank 40 |
| Tier 3's term (HP and DEF ×1.08 → ×1.48, offense +10%, bosses ×1.1); bosses' shields 10; skill MP ×2.4 | T2B, T2C | Tier 3's foes and skills |

### 5.4 Her window (T2W29)

**T2W29: Tier 2's board at Tier 3's numbers, 36 with its Rift.** Class I–V on Tier 3's classes (the sixteen, assumed):
R10 · R30 · R50 (in Tier 3 also her crown and mastery, if classes keeps them at R50) · a class and its sibling at R50 ·
three at R50. Craft her three Craft Levels to 12 · 24 · 36 · 48 · 60. Gear and Weapons G2 … G10. Stars the Tier 3 map
by the same rule (22 if no body is added; 27 or 32 with round 1's weapon moons). World continents 11–15, a won capital
run each. The Rift step on a won Tier 3 run (T2W4). No new position, no rebake (T2W28).

### 5.5 Ascend into Tier 3 (T2W31)

**T2W31: the same sheet, pre-filled with her Tier 2 picks.** From a full Tier 2 window: who goes (by party, the check
line), then her page: her class in Tier 3 (assumed: her Tier 2 open set carries, the class she fights as Suggested; if
classes.md gives Tier 3 a promotion of its own, the same page lists its options), her weapons and types as she had them,
her sub-profession as she had it; the purse 3,000 Laurels and 5 Speed Tickets; her forms and stat picks kept as settings
(T2W21). One tap with the defaults.

### 5.6 The end of the climb (T2W14)

**Tier 4 stays closed.** A sixteenth scenario shows "Tier 4 locked" (D280) and joins no world until the owner opens Tier
4; until then nobody ascends from Tier 3 and its Rift step only completes her window. When Tier 4 opens, its world takes
this doc's Tier 2 shape, and Tier 3's full windows (Rift step lit) are ready to ascend into it at once.

## 6. Provides and assumes

**What this doc provides** (other docs read these from it):

| To | What | Call |
|---|---|---|
| All six | The run's timeline: when each addition lands by day and level; no new gates | T2W11, T2W32, §4.7 |
| All six | Promotion: the Ascend sheet's pages and what she keeps, picks and restarts | T2W16–T2W21 |
| All six | The windows: what each track reads, and that a step reads progress, never a choice | T2W24–T2W29 |
| All six | Tier 3 has a Rift and Trials; Tier 4 stays closed | T2W4, T2W14 |
| **T2C** (classes) | The class page: her open set is both children of every Tier 1 class at R50 when she ascends (6–16), written to the new world and fixed for the tier; Suggested the keeper of the class she fights as; Class IV reads a class and its sibling, Class V three; the Rift's guidance names the Tier 1 class and either child fits; Umas already in Tier 2 become their class's keeper at its rank | T2W17, T2W18, T2W23, T2W25, T2W30 |
| **T2G** (gear) | The weapons page: her class's preset with gear's Suggested types, set on the sheet (Tier 2 → 3 pre-filled); Gear and Weapons read grades whatever the type or form; Gear V reads as "every tree open" if the tree completes by G10; her forms carry as settings | T2W19, T2W21, T2W24 |
| **T2E** (extra stats) | Stars counts open nodes of every body (`body:n`), never picks; her picks carry as settings; the counts by the tier's map | T2W21, T2W24, T2W27 |
| **T2P** (professions) | Craft reads her three Craft Levels' sum (12 · 24 · 36 · 48 · 60), so each profession keeps Tier 1's curve or the thresholds move; her sub-profession shown pre-picked on the sheet; the full window's demand target (950 refined an Uma, Metal and Vegetables 250) and the run target (a party's windows in about 32 days) | T2W12, T2W20, T2W26 |
| **T2B** (balance) | The party check line's roles (damage, support, heal) read T2B's classes; the fronts' re-aimed tests per tier | T2W22, T2W30 |
| **T2U** (templates) | She arrives as the Tier 2 class she picks; her family on the sixteen and her ★ tip at CR 40 are templates' | T2W18, T2W21 |

**What this doc assumes** (round 2's shapes, being written now in parallel; the cross-reference pass checks them):

| From | Assumed | Used in | If not |
|---|---|---|---|
| **T2C** (classes) | **Sixteen Tier 2 classes**, a keeper and an expander per Tier 1 class (R2-2–R2-4), named by classes.md; **only the sixteen fight in a Tier 2 world** (no Tier 1 class there, as CV10 has no Tier 0 in a later world); each its own Class Rank 1–50 with XR1's shared ladder for 1–10; switching free among those she holds; one healer a party, both healer children healers; three slots a class, the expanders' cross-channel slots among them; presets on the sixteen (D263's rule); Tier 3 keeps the sixteen, deepened (two lines held, the crown and mastery at R50), no new promotion | §4.4, §4.6, §4.7, §5 | If Tier 1 classes also fight in Tier 2: Suggested could be "stay as she is", and the Class track reads the Tier 2 classes only. If Tier 3 promotes again: the Tier 3 sheet's class page lists Tier 3's options, the same page |
| **T2G** (gear) | **Each weapon's Tier 2 type set on the sheet**, swapped freely or cheaply later; grades per weapon kind as live; **the accessory tree**: a family's forms per slot opening as its grade rises, complete by G10; three slots; a type's or a form's Tier 3 step, if any, gear's | §4.4.3, §4.6, §4.7 | If a type costs an item to set: the sheet shows the cost, and Suggested picks the free one. If the tree ends past G10: Gear V reads grades only |
| **T2E** (extra stats) | Jewels open the Planet's and moons' nodes as today; **every open node takes a stat she picks** from its body's list, swappable, with a default so an open node always gives something; round 1's weapon moon a list entry (map 22) or a body (27) | §4.6.1, §4.7 | If a node can be open and unpicked: Stars still counts open nodes |
| **T2P** (professions) | **Two professions a line plus one sub-profession: three Craft Levels**, each 1–50 on Tier 1's curve (88,200 EXP), each with its own EXP; a job raises the profession it belongs to; Craft restarts at 1 in all three on Ascend; amounts don't scale; the sub-profession picked free (shown on the sheet) | §4.4.4, §4.6.4, §8 | If a profession's curve differs: the Craft thresholds follow its EXP (the dial, §4.6.4) |
| **T2B** (balance) | Party value bands for every class (R2-11), so no Tier 2 class is a trap on the sheet; Z3's restart; the toolbox terms SB3–SB5; three weaknesses at every rank (live); bosses' shields 9 and 10 (SB6); the fronts' numbers per tier | §4.2, §4.5, §5.2 | — |
| **T2U** (templates) | Her family on the sixteen (both children of her family's Tier 1 classes); the ★ tip on her lead weapon's tree at CR 40, at both forks in Tier 3; the signature and her moon × tier (live) | §4.7, §5.3 | — |

## 7. Save and engine

Roughly, not packets. **T2W15: the world goes first on today's engine, then the toolbox as one release a tier.**

| Step | What changes | Engine · save |
|---|---|---|
| 0. Before | Capitals v2 and the honeycomb live (H162, H166) | — · v37, v38 |
| 1. The Tier 2 and 3 worlds | Leans and packs by tier (T2W2, T2W3, generator data under its guard); the fifteenth Finals (T2W13, data); Twilight Vale (Z10, a label); tickets and the purse × tier (T2W10, Exchange and Ascend rules); the Ascend sheet's five line (T2W9, a screen) | None: fights replay from their frozen inputs and these are generators and rules, as D293 reasoned |
| 2. Tier 3's Rift | `RIFT_TIERS` gains 3; Tier 3's five achievements; `tierHasRift` splits into "has a Rift" (every tier) and "has a tier above" (Ascend's block); Trials open in Tier 3; the board 36 everywhere (T2W4) | None, or a small save step if the parse needs the new achievement ids |
| 3. Tier 2's toolbox | T2C, T2G, T2E, T2P, T2B, T2U; **the Ascend sheet's pages** (T2W16–T2W22) writing T2C's, T2G's and T2P's fields; **the Tier 2 board's rules** (T2W24–T2W28, no record change); the switch's migration for Umas already in Tier 2 (T2W23); dark behind one Tier 2 switch, as Classes v3 shipped | **engine v22, save v39** (D198's R3–R4 numbers are taken) |
| 4. Tier 3's toolbox | The same, Tier 3's pieces; the sheet into Tier 3 (T2W31) | engine v23, save v40 |

The record of a window keeps its 36 positions in every tier, the Rift's included, so neither step 2 nor 3 moves
anything in it.

## 8. Pacing

Every number below is nonstop work at Craft Lv 25's step (20.1 minutes) and the places' ×1.25, from the live code; ×1.25
for a player who keeps the slots 80% busy. **T2W12: a Tier 2 or 3 run takes Tier 1's time, and her own Craft is its
clock; T2W32 measures it with round 2's systems.**

### 8.1 One Uma

| Measure | Tier 1 | Tier 2 and 3 |
|---|---|---|
| Uma Lv 1 → 50 | About 130 wins with her party (25,480 EXP), or 147 Training Logs | The same |
| Class IV | Two Tier 1 classes at R50: her campaign's Class EXP (about 51,000) | A Tier 2 class and its sibling at R50: the same EXP |
| Class V (a third) | 20 Trial wins at Lv 50 (40 at Lv 45), or 24 Manuals | The same |
| Her own Craft V | Craft Lv 50: 588 hours of her slot, **24.5 days nonstop**, 30.6 at 80% | Her three to 60: **24.9–27.8 days nonstop**, 31.2–34.8 at 80% |
| Her full window's work | 950 refined, 763 hours of slot time, done by the roster | Professions' Tier 2 demand (T2P, assumed close) |
| Her promotion | — | One sheet, one tap with the defaults |

### 8.2 A party of five

| Measure | Value |
|---|---|
| Fights to Lv 50 | **132 wins**: Lv 50 comes at win 132 of its 140-fight path (ten regions' first clears and five capital lanes) with one replay; **1.9 hours** at the ledger's seconds (40 a regular, 70 an elite or a general, 100 a boss), **4.4 hours** at two minutes a fight |
| One grade of the party's kit | 375 refined items: 5 hours of all 60 slots, 25 of one trade's 12 |
| Full windows, one Uma of each trade, today's rules | **41.8 days**: Metal and Vegetables carry 250 an Uma for Weapons V; the other three lines 25.1 |
| The same with sub-professions pooling the lines (T2P) | **31.8 days** nonstop, **39.8** at 80%; the floor is her Crafts 60's 24.9–27.8 |

### 8.3 A run of twenty

The release's mix: Metal 4, Wood 5, Stone 5, Fish 3, Vegetables 3.

| Demand | Each trade alone (Metal · Vegetables · Wood · Fish · Stone) | Bound | Pooled (sub-professions) |
|---|---|---|---|
| Eleven slots and the map | 25.1 · 33.5 · 20.1 · 33.5 · 20.1 days | Vegetables and Fish, 33.5 | 25.1 |
| The full window (Weapons V) | 41.8 · **55.8** · 20.1 · 33.5 · 20.1 | Vegetables, 55.8 | **31.8** |

- **Without the sub-profession a thin trade binds** (three Healers make every Tome's ink for twenty); with it, a run is
  bound only by its own hours. Speed Tickets close what's left: Vegetables' gap to 31.8 days is about 1,730 hours, 3,460
  tickets, 69,000 Laurels at T2W10's price: most of the four parties' campaign Laurels (83,100).
- **Round 2's second material a line** (R2-9) is professions.md's to price; this table holds if a rank's work stays
  equal across the lines (T2P1's rule).

### 8.4 Twenty-four parties at tier scale

The honeycomb's full world: 120 Umas, 60 slots (the release's mix, every trade over twelve).

| Measure | Value |
|---|---|
| Fights | 24 × about 140 (each party its regions and capital lanes): **3,360**, about 45 hours at the ledger's seconds, 110 at two minutes |
| Capital runs | Six a continent, 30 a tier (480 fights): every Uma's World I–V |
| Rift runs | Six (about 350 fights): every Uma on a won run |
| Trials | 20 wins a party, 480 (sweepable) |
| Promotions | 120 Umas through the sheet: 24 taps with the defaults, a party at a time |
| The Wilds: every window, pooled | **63.6 days** nonstop, 79.5 at 80% |
| The Wilds: today's rules, no sub-profession | 83.7 days (Metal and Vegetables bind at twelve slots each) |
| Each Uma's own Crafts 60 | About 50–56 days: 120 Umas share 60 slots |

**The parallel workforce:** one party fights at a time, an hour or two a day, while sixty Umas work around the clock. The
fights are a few percent of a tier's time; the Wilds are the rest. That is the owner's play pattern, and why the clock
is Craft, not levels: the roster's forges gear a party a grade in five hours once its makers' Craft allows it.

### 8.5 Across three tiers

| One Uma | Tier 1 | Tier 2 | Tier 3 | In all |
|---|---|---|---|---|
| Window full, first cohort (nonstop · 80%) | ~32–37 · ~40 days | ~33.5–37 · ~38–40 | ~33.5–37 · ~38–40 | **About 3 to 4 months** |
| Bound by | Craft V, Weapons V, the Rift | The Rift, then Crafts 60 and Weapons V | The same (its Rift, T2W4) | |

## 9. Previews: carried and retired

| Page | What it holds | Carries |
|---|---|---|
| [progression-tiers.html](previews/progression-tiers.html) | Tier 1 → 2 → 3 side by side; what each tier adds, by doc (round 2's shapes); what she keeps, picks and restarts; one made-up Uma across three tiers; her board per tier; how the counts grow; the old calls' status | [character-tiers.html](../tier-rework/previews/character-tiers.html)'s one-Uma board (its per-cell stat values move to the system docs' pages); [progression.html](../tier-rework/previews/progression.html)'s tier columns and "how the counts grow" |
| [progression-ascend.html](previews/progression-ascend.html) | **New (round 2):** the Ascend sheet at 390 × 844, screen by screen: the Gallery's ready tiles, who goes by party with the check line, her Tier 2 page (class, weapons and types, sub-profession), a party of five played through with defaults and with expanders, Tier 2 → 3 pre-filled, an Uma already in Tier 2 | — (new) |
| [progression-windows.html](previews/progression-windows.html) | **New (round 2):** the boards by tier; how a window is drawn (a placeholder window and its pane map lit by the live rule at any step count); latching against a free pick; what each new system lights; pacing by track; the record; the Window sheet's tiles in Tier 2 | [board.html](../collections/previews/board.html)'s board by tier (collections' pages stay where they are) |
| [progression-world.html](previews/progression-world.html) | Tier 2's and Tier 3's continents; the honeycomb by band; foes by tier level; pay by tier; the Rift's fronts re-aimed at round 2's tools, Trials and Drills by tier | — (round 1's) |
| [progression-run.html](previews/progression-run.html) | A Tier 2 run day by day with round 2's systems; the window lighting; the Wilds calculator (cohort, uptime, demand, sub-professions); 24 parties | [progression.html](../tier-rework/previews/progression.html)'s roadmap ("what unlocks when") and "pace holds" |

**Retired:** progression.html's "how it ships: five live releases" (D198's R3–R5 numbers are taken, §3.7), "choices a
player owns" and "Tier 1: today vs approved" (Tier 1 is built; the system docs count their own choices).
character-tiers.html's stat cells (every system doc draws its own Tier 1 → 3 page).

**Words this doc and its pages add, checked** (case-insensitive exact match against all 18,227 distinct master-data
strings and the game's own names; none matches): Keeper, Expander, Keepers, Expanders, Sibling, Pair at R50, Pair
R41/50, Crafts, Crafts 36, Sub-profession, Her Tier 2, Her Tier 2 class, Her Tier 3 class, Her weapons, Her
sub-profession, Suggested for all, Opens 6 of 16, Opens later, Who goes, Party check, Swap any time on Gear, Rank to 50
in Tier 1, New: Tier 2 classes, Battle healer, Support hybrid, Self-buff, Ready to ascend · Opens 6, Her professions, Kept
as settings, Her class's kit, Her three Crafts, Wilds jobs · all three, and templates.md's "★ Tip · on a strike line" (55
labels in all). "Support" as a role word matches an old accessory-slot label in the code (before D264), not a name.

## 10. Decisions

Every call, with its recommended answer, the alternatives, and its status after round 2. **Stands** is a round-1 call
round 2 leaves whole; **Superseded (R2-n)** names the requirement that replaced it and the call that does its job now.

| Id | Call | Recommended | Alternatives | Status |
|---|---|---|---|---|
| **T2W1** | The Tier 2 world's shape | **Tier 1's on continents 6–10, with capitals v2 and the honeycomb live first:** 48 regions, 24 parties, six Springs, six capital runs a continent; no Tier 2 world packet before H162 and H166 | Build Tier 2 on today's map (40 regions, three shared routes) first; a smaller Tier 2 world | Stands |
| **T2W2** | Continent leans by tier | **Tier 2 Jungle, Sky Isles, Glacier, Volcano, Underworld (Z1); Tier 3 Swamp, Highlands, Geyser Basin, Storm Peaks, Ancient Ruins**; a tier's leans change only while no world of it holds a won stage | Repeat Tier 1's leans (live); random leans a world | Stands |
| **T2W3** | Face packs by tier | **Tier 1's totals, arranged anew each tier:** Tier 2 Z7's (the middle pack opens it, the small returns twice, the large closes it); Tier 3 a third (the small holds `w13` whole) | Repeat Tier 1's arrangement (live); new packs a tier | Stands |
| **T2W4** | Does Tier 3 get a Rift | **Yes:** the same shape at T3 Lv 50, its own seals and Rift Conquered · Tier 3, the Rift step (every board 36), Trials with it; nobody ascends from it while Tier 3 is the top tier: a full Tier 3 window is the end of her collection, in its violet frame | No Tier 3 Rift until a Tier 4 exists (no Trials there, a 35-step board) | Stands |
| **T2W5** | The Rift's fronts in Tiers 2 and 3 | **Z9's one added test a front, re-aimed at the later tiers' toolbox** (Iron shields +2 and one or two Arms; Arcane one element a foe, leaders and guards apart; the Duel's boss three acts from stage 9; the Horde five to seven a wave); Tier 3 keeps them; T2B sets each tier's numbers | Tier 1's fronts × tier, no added test; new fronts | Stands; its "the guidance names each member's class branch" Superseded (R2-2) by T2W30 |
| **T2W6** | Trials and Drills by tier | **Unchanged in every tier:** Trials at the tier's Lv 45, 50, 55, opening with its Rift; Drills at its Lv 10–50, 2–6 Logs, ten runs a day banked to thirty, opening with its first map win; Logs and Marks stay in their world | More Logs or higher levels a tier; Logs that cross worlds | Stands |
| **T2W7** | Windows by tier | One board, 36 steps in every tier; Class I a Tier 1 class at R10 from Tier 2; World n a won capital run; the Stars steps count the tier's whole map, weapon moons included; no new track | — | **Superseded (R2-10)** by T2W24–T2W29 |
| **T2W8** | Ascend with a toolbox | Settings carry, progress restarts: her class and its class branch, her accessory families, kinds and forms, her weapon branches and her weapon moon's setting carry | — | **Superseded (R2-5, R2-6)** by T2W21 |
| **T2W9** | Ascending into an empty world | **The Ascend sheet says when the new world would hold fewer than five** ("3 of 5 to fight in Tier 2"); no rule change | Block an Ascend that leaves fewer than five; no line | Stands (a line on the sheet's first page) |
| **T2W10** | Prices by tier | **Speed and Sweep Tickets × tier** (20 · 30 in Tier 2, 30 · 45 in Tier 3) **and the purse's Laurels × the tier she arrives in** (2,000, 3,000), so a Laurel buys the same time in every tier; Marks, Manuals and Logs untiered | Keep the tickets flat (the first knob if Tier 2 plays slow); a flat 1,000 purse | Stands |
| **T2W11** | When the toolbox opens | **No new gates:** every Tier 2 and 3 addition opens on its system's gate (the Ascend sheet, Class Rank, a grade's levels, a node's jewel and level) | Gates of their own (quests, a day, a building) | Stands, re-cut on round 2's systems (§4.7) |
| **T2W12** | A run's pacing target | **Tier 1's time, her Craft the clock:** a party's windows in about 32 days nonstop (40 at 80%), a first run of twenty in about 32 with sub-professions, a 24-party world's Wilds in about 64; fights about 130 wins a party; T2P meets the full window's 950 refined items | A faster later tier (tickets flat); a slower one (more steps) | Stands; measured with round 2 by T2W32 |
| **T2W13** | The fifteenth scenario's capital | **Its own four authored Finals routes** (original names, checked against the release), with Tier 3's world packets | Keep reusing continent 1's Finals | Stands |
| **T2W14** | A sixteenth scenario | **Tier 4 stays closed:** it shows "Tier 4 locked" and joins no world until the owner opens Tier 4; Tier 3's Rift step completes her window only | Open Tier 4 now; let Tier 3 ascend into a placeholder | Stands |
| **T2W15** | The version plan | **The worlds first on today's engine** (leans, packs, prices, Tier 3's Rift), **then the toolbox as one release a tier:** Tier 2 at engine v22 and save v39 (the Ascend sheet's pages and the board's rules with it), Tier 3 at v23 and v40, each dark behind its switch | Everything at once; one release a system | Stands |
| **T2W16** | Where promotion happens | **On the Gallery's Ascend sheet, two pages, every pick pre-filled:** who goes (by party, a summary row per Uma), then her page (class, weapons and types, sub-profession); one tap ascends with the defaults; nothing opens over the sheet | A promotion sheet after arrival (her profile's first open in Tier 2); a required pick with no default; a Promote place of its own | **New (R2-5, R2-6)** |
| **T2W17** | The classes open to her | **Both children of every Tier 1 class she has at Class Rank 50 when she ascends: 6 to 16**, read before she leaves and written to the new world; fixed for the tier; she switches freely among them, each on its own Class Rank; "Opens 6 of 16" on her Gallery tile and sheet row | Only the class she fights as's two; all sixteen for everyone; more opened by Tier 2 content | **New (R2-5)** |
| **T2W18** | Her Suggested Tier 2 class | **The keeper of the class she fights as** when it is at R50, else of her highest R50 class (ties: her family's, then the tree's order); the expander one tap beside it | No Suggested (a pick required); the expander; by her calling | **New (R2-5)** |
| **T2W19** | Her weapons at promotion | **Her picked class's preset, each weapon's Tier 2 type gear's Suggested, set on the sheet;** a slot offers its channel's kinds, an expander's cross slot included; swaps later as gear rules; Tier 2 → 3 pre-filled with hers; no G5 gate | Defaults with no type until a weapon's G5 (round 1); a weapons visit after arrival | **New (R2-6)** |
| **T2W20** | Her sub-profession at promotion | **On her page, pre-picked** with professions' Suggested, her line's two shown fixed; changeable there or later | Picked only after arrival on her Template tab (round 1's secondary); none until a Craft Level | **New (R2-9)** |
| **T2W21** | What she keeps, picks and restarts | **Picks are settings, set or confirmed on the sheet; progress restarts:** kept her calling, line, template, windows, history, accessory families and kinds; picked her class, weapons and types, sub-profession; from Tier 2 her forms and stat picks kept as settings, waiting for their grades and jewels; restarted level, Class Rank (1, the shared ladder), grades, nodes, all three Craft Levels, Bonds, seats, tree picks (reconciles XR5) | Round 1's T2W8 (settings carry, nothing picked); everything restarts, forms and picks too | **New (R2-5, R2-6)**; replaces T2W8 |
| **T2W22** | A party ascending together | **Grouped by party, moves with its name; a check line** from the picks ("One healer · 10 of 10 kinds · damage 3 · support 1 · heal 1"), two healers a warning, never a block; **"Suggested for all"** resets the group | A flat list; block two healers; a comp builder on the sheet | **New (R2-5, R2-12)** |
| **T2W23** | Umas already in a Tier 2 world at its switch | **Each opens both children of the class she fights as and of every Tier 1 class she has at R50 there, and becomes her class's keeper at its Class Rank;** others at Rank 1; Suggested types and sub-profession; a "New: Tier 2 classes" line until her Class tab opens; no forced sheet; her lit steps stay | Open all sixteen to them; a forced promotion sheet on the first load | **New (R2-5)** |
| **T2W24** | The Tier 2 board | **One board, 36 steps, the same seven tracks and the Rift and the same record positions;** Class, Craft and Stars re-read the new systems; Gear and Weapons read grades whatever form or type; World a won capital run; no track added | Add tracks for forms, types or picks (41–46 steps); a different count a tier; a medal layer now (CO30) | **New (R2-10)**; replaces T2W7 |
| **T2W25** | The Class track from Tier 2 | **R10 · R30 · R50 on her best Tier 2 class; IV a Tier 2 class and its sibling at R50; V three Tier 2 classes at R50, any;** Tier 1's pace; "Pair at R50" | IV "two Tier 2 classes at R50, any" (no nudge to swap); V a keeper and an expander of two parents | **New (R2-10)** |
| **T2W26** | The Craft track from Tier 2 | **Her three Craft Levels add up to 12 · 24 · 36 · 48 · 60:** any split; Craft V 24.9 (even) to 27.8 days (a specialist) against Tier 1's 24.5; "Crafts 36"; the dial 56 | Her best profession at 10 … 50 (the other two unread); her Craft EXP in all three against Tier 1's EXP (exact pace, an opaque number); each profession its own steps (three times the clock) | **New (R2-10)** |
| **T2W27** | Progress, never a choice | **A step reads progress only; a choice counts only as breadth any option meets equally** (a sibling pair, three classes, five weapons, three Crafts); no step names a class, type, form, stat or profession; a choice celebrated is CO30's medal | Steps for picks ("wear a Dual"); steps for a named class | **New (R2-10)** |
| **T2W28** | The record and the art | **No new position, no rebake:** every tier keeps the 36 ids and positions; each id's rule is the tier's (read by tier from Tier 2's switch); `windowNext` and the tiles gain "Pair R41/50" and "Crafts 29/36"; the pane map lights 36 as now | A record per tier; a rebake for a new count | **New (R2-10)** |
| **T2W29** | The Tier 3 board | **Tier 2's board at Tier 3's numbers, 36 with its Rift:** Class on Tier 3's classes (R50 also her crown, if classes keeps it there), Crafts to 60, the Tier 3 map, continents 11–15 | A track for the crown or mastery; 35 without a Rift | **New (R2-10)** |
| **T2W30** | The Rift's guidance and tests on the sixteen | **The guidance names the Tier 1 class and either child fits** (the keeper Suggested in Use the guided weapons); the fronts' tests ask for round 2's tools (Pure types and self-buffs on Iron, a Dual's partner and kind picks on Arcane, single-target picks on the Duel, area and multi-hit picks and wider debuffs on the Horde) | Name the keeper only; name exact Tier 2 classes a front | **New (R2-2)**; re-cuts T2W5's last clause |
| **T2W31** | Ascend into Tier 3 | **The same sheet, pre-filled with her Tier 2 picks:** her class (her open set carrying, assumed; Tier 3's options if classes gives one), weapons and types, sub-profession; forms and picks kept as settings; 3,000 Laurels | No picks into Tier 3 (she keeps everything); a Tier 3 promotion of its own | **New (R2-5)** |
| **T2W32** | A Tier 2 run with round 2 | **Ready about day 33.5 nonstop (37.6 at 80%), the Rift binding as in Tier 1;** Crafts 60 by 24.9–27.8; every other track at Tier 1's pace; the promotion one tap a party | Speed later tiers (tickets flat); a Craft V at 56 | **New (R2-10)**; measures T2W12 |

**Calls the owner may want to see first:** T2W25 (Class IV names the sibling: the board nudges the swap he asked for;
the alternative is any two), T2W26 (Craft as a sum, a specialist 14% slower than Tier 1), T2W17 (the open set fixed at
Ascend by her Tier 1 classes at R50, so ranking a fourth Tier 1 class before ascending buys two more Tier 2 classes) and
T2W18 (keepers by default, so a promotion changes nothing he didn't pick).
