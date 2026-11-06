# Progression: a Tier 2 run end to end, promotion, the windows, and how the tiers relate

> **Status: round 3, the owner's class feedback, 2026-11-05. Nothing here is built.** The overview of the Tier 2 and
> Tier 3 set ([the brief](README.md)): how one Uma climbs Tier 1 → 2 → 3, **how she is promoted on the Ascend sheet into
> Tier 2 and, from round 3, into Tier 3** (R2-5, R2-6, R3-1), **what her stained-glass window asks in each tier** (R2-10),
> what the Tier 2 and Tier 3 worlds hold, and when each system's additions land in a run. It starts from Tier 1 as built
> (engine v21, save v36; capitals v2 and the honeycomb live since save v38, H166) and reads [classes](classes.md)' round 3
> (T2C65–T2C101). Calls are **T2W1–T2W15** (round 1), **T2W16–T2W32** (round 2) and **T2W33–T2W46** (round 3), each with
> a recommendation, its alternatives and its status ([§10](#10-decisions)); no open questions.
>
> **Round 2 in one paragraph.** Promotion into Tier 2 happens on the Gallery's Ascend sheet: each ready Uma arrives as a
> **Tier 2 class she picks there**, a child of a Tier 1 class she brought to Class Rank 50, with **her three weapons and
> their Tier 2 types** set on the same page; everything is pre-filled, so a party of five still ascends in one tap. Her
> window keeps **one board of 36 steps in every tier**, the same seven tracks and the Rift and the same record: Class
> reads the tier's own classes, Craft reads **her three professions' Craft Levels together**, Stars reads the tier's whole
> map, and Gear and Weapons read grades whatever form or type she wears. **A step reads progress, never a choice**, and
> the art needs nothing: a pane map lights any step count and never knows which step lit.
>
> **Round 3 in one paragraph.** **Tier 3 is a promotion too** (R3-1): the Tier 3 Ascend is the same sheet, and her page
> lists **the Tier 3 children of every Tier 2 class she brought to Class Rank 50 (3 to 22)**, pre-filled with the child of
> the class she fights as (a Spellfist's or a Battlemage's kept child), her new class's preset and Suggested Tier 3 types,
> and "As in Tier 2" one tap away. **Tier 2's open set grows to 6–20** (two or three children a Tier 1 class, R3-4).
> **Class IV reads "two classes of one Tier 1 line at Class Rank 50" in both later tiers** (a class and her sibling in
> Tier 2; two of a line's Tier 3 classes in Tier 3), and **Class III in Tier 3 lights with her first crown**. Umas already
> in a Tier 3 world at its switch become their keeper's Tier 3 child. **Nothing moves in days.**
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
> [**the Ascend sheet**: promotion screen by screen into Tier 2 and Tier 3, a party of five, the class and weapons pages](previews/progression-ascend.html) ·
> [**the windows**: the boards by tier, the Class track on the new trees, how a window is drawn and latched, pacing by track](previews/progression-windows.html) ·
> [**the worlds**: Tier 2's and Tier 3's continents, the honeycomb, foes, pay, the Rift](previews/progression-world.html) ·
> [**the run**: a Tier 2 run day by day with round 2's systems, the Wilds calculator, 24 parties](previews/progression-run.html).
>
> **Numbers** come from the live code (`packages/domain/src`: `world/`, `rpg/campaign/`, `rpg/windows.ts`,
> `save/windows.ts`, `save/window-record.ts`, `save/rift.ts`, `save/drills.ts`, `save/exchange.ts`,
> `economy/pacing.ts`, `economy/ranks.ts`; the web's `places/gallery/`), read by throwaway tests that were deleted.
> Where a number is an assumption (fight seconds, the owner's Rift pace, another doc's round-2 shape), it says so.
>
> **Names checked:** every label this doc and its pages add ("Keeper", "Sibling", "Pair at R50", "Crafts", "Her Tier 2
> class", "Her Tier 3 class", "Suggested for all", "Opens 8 of 20", "Opens 4 of 22", "As in Tier 2" and the rest, listed
> in [§9](#9-previews-carried-and-retired)) was matched, case-insensitive and exact, against every string of uma-platform's
> `content/release/data/*.json` (10 files) and the game's own string literals: no match. The forty-two classes' names are
> [classes.md](classes.md)'s (T2C69, T2C88, checked there).

## What this doc answers

| The brief asks | Answered in |
|---|---|
| **R2-5, R2-6:** Tier 2 promotion on the Ascend sheet: who's ready, her Tier 2 class, her weapons and their types, what she keeps and restarts, the purse, a party together | [§4.4](#44-promotion-the-ascend-sheet) (T2W16–T2W23, T2W33–T2W36), the [Ascend page](previews/progression-ascend.html) |
| **R3-1, §10.2:** the Tier 3 promotion on the Ascend sheet, screen by screen, pre-filled, a party in one tap; the Tier 2 open set 6–20 and the Tier 3 one 3–22; both doors; Suggested; Umas already in a Tier 3 world | [§5.5](#55-the-tier-3-promotion-t2w37t2w41) (T2W37–T2W41), [§4.4.2](#442-her-tier-2-class) (T2W33–T2W36) |
| **R2-10, §10.2:** the windows: the live board in depth, Tier 2's and Tier 3's boards on the new systems, **the Class track by tier with the new trees**, the record and the art, whether a step can read a choice | [§2.5](#25-windows-in-depth), [§4.6](#46-her-window-in-tier-2) (T2W24–T2W28, T2W42), [§5.4](#54-her-window-t2w43) (T2W43), the [windows page](previews/progression-windows.html) |
| The timeline of a Tier 2 run with round 2's systems, and its pacing | [§4.7](#47-the-toolbox-arrives), [§4.8](#48-a-tier-2-run-end-to-end), [§8](#8-pacing) (T2W32), the [run page](previews/progression-run.html) |
| Ascend as built, and whether the drafts' tier rules still fit | [§2.6](#26-ascend), [§3.1](#31-tiersmd-t1t9-archived) |
| The Tier 2 world: continents 6–10, lifetime foe levels, capitals v2 and the honeycomb | [§4.1](#41-the-world-continents-610), [§4.2](#42-foes-lifetime-levels-a-restarted-build) (T2W1–T2W3) |
| The Rift in Tiers 2 and 3; does Tier 3 get one | [§4.5](#45-content-the-campaign-capital-runs-drills-trials-the-rift), [§5.2](#52-its-rift-t2w4) (T2W4, T2W5, T2W30): **yes** |
| Trials and Drills, Laurels, Speed Tickets and Class Marks by tier | [§4.3](#43-pay-laurels-tickets-class-marks-and-logs), [§4.5](#45-content-the-campaign-capital-runs-drills-trials-the-rift) (T2W6, T2W10) |

## 1. At a glance

**One Uma lives in one tier; a full window ascends her, and each Ascend is her promotion (into Tier 2, and from round 3
into Tier 3); each tier is its own world, the same shape, restarted.** Tier 2 and Tier 3 run Tier 1's rules × tier today.
Rounds 2 and 3's systems (the six docs) fill each later tier; this doc fixes the frame they land on.

| | Tier 1 · Apprentice · day | Tier 2 · Adept · dusk | Tier 3 · Master · night |
|---|---|---|---|
| **Continents** | `w1`–`w5`, lifetime Lv 1–50 | `w6`–`w10`, lifetime Lv 51–100, shown "T2 Lv 1–50" | `w11`–`w15`, lifetime 101–150 |
| **A continent** (honeycomb, live) | 48 regions, 576 stages, a capital, 6 Springs | The same | The same |
| **Parties · capital runs a continent** | 24 · six of four parties (16 fights each) | The same | The same |
| **Leans** (T2W2) | Forest, Coast, Desert, Tundra, Haunted Moor (live) | Jungle, Sky Isles, Glacier, Volcano, Underworld | Swamp, Highlands, Geyser Basin, Storm Peaks, Ancient Ruins |
| **Foes** | The build curve from Lv 1 | The curve **restarts** at T2 Lv 1, × 1.8 build (live: Z3, EP16) | Restarts again, × 2.6 |
| **Her classes** | Five Tier 0s promote at Class Rank 10 into eight Tier 1 classes, in the world | **Twenty** (two or three children a Tier 1 class: keeper, cross or support, pure; [T2C66](classes.md)); **picked on the Ascend sheet** from the children of her Tier 1 classes at R50, **6 to 20** open to her (T2W33) | **Twenty-two** (one child a Tier 2 class, the Spellfist and the Battlemage two; T2C65); **picked on the Tier 3 Ascend sheet** from the Tier 3 children of her Tier 2 classes at R50, **3 to 22** open (T2W37, T2W38) |
| **Her weapons** | Three a class, by preset; one kind each | Three a class, **each with a Tier 2 type set on the Ascend sheet** (T2G), swapped later | **Re-picked on the sheet:** her Tier 3 class's preset and Suggested Tier 3 types, "As in Tier 2" one tap away (T2W39); the Gladiator and the Thaumaturge two two-kind weapons (Arsenal) |
| **Build values** (gear, stars, signature) | × 1 | × 1.8 | × 2.6 |
| **Laurels a win · region first clear** (Lv 1–40) | 10 · 630 | 20 · 1,260 | 30 · 1,890 |
| **Speed · Sweep Ticket** (T2W10) | 10 · 15 Laurels | **20 · 30** (live: 10 · 15) | **30 · 45** (live: 10 · 15) |
| **Arrives with** | 20 Uma Tickets (the start) | Her purse: **2,000 Laurels** (T2W10; live 1,000) and 5 Speed Tickets; banked EXP as up to 2,000 Class Marks | **3,000 Laurels** and 5 Speed Tickets; Class Marks |
| **Drills · Trials** | Lv 10–50 · Lv 45, 50, 55 | The same, T2 levels | The same, T3 levels; **Trials open** with its Rift (T2W4) |
| **The Rift** | Live | Live; one added test a front, re-aimed at round 2's tools (T2W5, T2W30) | **New (T2W4):** the same shape; it lights her Rift step, nobody ascends from it |
| **Her window** | 36 steps | **36:** Class IV two classes of one Tier 1 line at R50 (a class and her sibling), Craft her three professions together (T2W24–T2W26, T2W42) | **36** (live 35; T2W4): Class III her first crown, IV two Tier 3 classes of one Tier 1 line (T2W43) |
| **Ascend** | To Tier 2 on the Gallery's sheet, **her promotion** (T2W16) | To Tier 3, the same sheet, **her Tier 3 promotion** (T2W37) | None while Tier 3 is the top tier (T2W14) |
| **What the toolbox adds** | — (Tier 1 as built) | Twenty classes (T2C), weapon types and the accessory tree (T2G), a stat pick on every open node (T2E), two materials a line and three professions an Uma (T2P), party value bands (T2B), the ★ signature tip (T2U) | Twenty-two classes, each her Tier 2 parent + one rule from Class Rank 1, the crown at R50 and two lines held (T2C); Keen, Tempered, Evolved and Arsenal (T2G); the tree's third ring; Prowess's Trio (T2E); Tier 3's term (T2B) |
| **A run's clock** (T2W12, T2W32) | Her own Craft Level: 24.5 days nonstop, 30.6 at 80% | **Her three Craft Levels to 60 together: 24.9–27.8 days** nonstop, 31.2–34.8 at 80% | The same |

**A Tier 2 run in one line:** a party of five fights to Lv 50 in about 130 wins (2 to 4½ hours of fights), but its
windows take **about 33 days** of the Wilds' work and the Rift (38 at 80%), because every Uma's Craft Levels restart at 1
and the first cohort's forges reach G10 on day 22.1. The fights are short; the Wilds are the clock, in every tier.

**Promotion in one line, both tiers:** the Gallery's Ascend sheet lists the ready Umas by party, each pre-filled with
her Suggested class (into Tier 2 the keeper of the class she fights as; into Tier 3 that class's Tier 3 child) and her
class's three weapons and types; a tap on one opens her page to pick another, and **Ascend 5** sends them up.

## 2. Tier 1 as built

The baseline every later tier copies. All of it is live (engine v21, save v36) and owned by the manual pages linked.

### 2.1 The world

- **Five continents a tier, ten levels each** ([maps](../../game/maps.md)): continent n spans lifetime Lv 10(n − 1) + 1 to
  10n; the tier is ⌈n ÷ 5⌉ (`chapterFor`). Tier 2's are `w6`–`w10`, Tier 3's `w11`–`w15`. D280 gave Tier 3 its fifth
  (the newest scenario), so every tier has five.
- **A continent today** (the honeycomb, D295, live since save v38): 48 regions, 24 on the shore at its first five
  levels and 24 inside at its last five; 12 stages a region (576 a continent); six Springs; a capital of capital runs at
  the band's Lv 10 (capitals v2, D293, save v37).
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
   every world, so Tier 2's twenty and Tier 3's twenty-two need the read by tier.
3. **Gear reads her active class's three weapons:** a cross's other-channel slot is worn and counts; three accessory
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

### 2.7 Live since round 2: capitals v2 and the honeycomb

| Piece | What it changes for every tier | State |
|---|---|---|
| **Capitals v2** (D293, save v37) | A capital is runs of four full parties: four lanes of three generals, then four final bosses; 16 fights; her first run of a continent pays full (about 1.3 levels), later a quarter; **World n lights on a won run**, and the champions mask leaves the record (CA12) | Live (H162, D302) |
| **The honeycomb** (D295, save v38) | 48 regions a continent (24 on the shore at Lv 1–5, 24 inside at Lv 6–10), **24 parties**, six Springs, six run seats, the faces of who claimed and cleared each hex | Live (H166, D307) |

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
| T6 | Option A: a growing toolbox, one battle system | **Kept, changed** | The toolbox is rounds 2 and 3's (R2-1–R2-12, R3-1–R3-9): twenty Tier 2 and twenty-two Tier 3 classes, weapon types, the accessory tree, stat picks, three professions, on Classes v3 (D240) |
| T7 | Simplify Tier 1 now, side skills kept until promotion | **Superseded** | Tier 1 was rebuilt (R1, R2), then Classes v3 (D240) reset every class |
| T8 | Twelve advanced classes | **Superseded** | Classes v3 (D240), then round 3's twenty Tier 2 and twenty-two Tier 3 classes (R3-6), [T2C](classes.md)'s |
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
| CO12 | Class V: three Tier 1 classes at R50 | **Kept, changed** | From Tier 2, three of the tier's classes at R50; Class IV two classes of one Tier 1 line (T2W42) |
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

Round 2 moved three rows from Kept to Kept, changed: CO12 (the Class track on the later tiers' classes), CO15 (Craft on
three professions) and pacing.md's Craft loop. Round 3 moves none; it re-reads CO12's Class IV (T2W42).

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
  Tier 1's 6.8). T2B re-measures on engine v21, with the twenty classes.
- **Live already:** three weaknesses at every rank in Tiers 2 and 3, a regular's by her role (weaknesses v2, D235,
  `rpgWeakCounts`). **Not built yet** (T2B): the toolbox term (SB3–SB5), bosses' shields 9 in Tiers 2 and 3, sub-bosses 7, from Lv 1 (T2B7, gear T2G27; SB6's 10 retired, XR19; 8 in every tier
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
picks what she becomes. **Round 3 makes the Tier 3 Ascend a promotion on the same sheet** (R3-1, [§5.5](#55-the-tier-3-promotion-t2w37t2w41)).

**T2W16: one sheet, two pages, every pick pre-filled.** The Gallery's Ascend sheet keeps its live shape (the ready
Umas ticked, the lines, Ascend n) and gains, per Uma, a summary row of her picks and a second page to change them. The
defaults are complete, so a party of five, or a Rift's twenty, still ascends in one tap; nothing opens over the sheet
(G4): her page replaces the list inside the same sheet, with Back, as the Logs sheet picks an Uma and then an amount.

| # | Screen | What it shows | Taps with the defaults |
|---|---|---|---|
| 0 | **The Gallery** · Ready | Her full window with its ring and the green dot; "Ready to ascend · Opens 8" on her tile; **Ascend 5** in the head | 1 |
| 1 | **Ascend to Tier 2** · who goes | The ready Umas **grouped by party**, each ticked; a row per Uma: her name, her picked Tier 2 class with "Suggested", her three weapons and types in one line, "Opens 8 of 20"; one who can't go says why ("At work · recall first"); a check line per whole party; the lines (where she lands, what restarts, the purse, Class Marks, "3 of 5 to fight in Tier 2"); **Ascend 5** | 0 |
| 2 | **Her Tier 2** · her class | The classes open to her, **two or three per Tier 1 class she has at R50**, grouped by that class (the keeper first, then the cross or the support, then the pure variant): each with its slots, its rule in a few words, a Healer chip; Suggested marked; the locked Tier 1 classes greyed, "Rank to 50 in Tier 1"; a collapsed "Opens later" row for what her door adds (T2W34, T2W35) | 1 to change |
| 3 | **Her Tier 2** · her weapons | Her picked class's three slots, each a weapon kind and its Tier 2 type (gear's names), Suggested pre-set; the kinds she covers; "Swap any time on Gear" | 0–3 |
| 4 | **Her Tier 2** · her sub-profession | Her line's two professions (fixed by her calling) and the four other lines for her third, Suggested marked | 0–1 |
| 5 | Back on who goes · **Ascend 5** | The tier veil, then Tier 2's Town Hall, as live | 1 |

Pages 2–4 are one scrolling page per Uma ("Her Tier 2"), class first because her slots follow it. The
[Ascend page](previews/progression-ascend.html) mocks each screen at 390 × 844 and plays a party of five through it, into
Tier 2 and into Tier 3.

#### 4.4.1 Which Umas are ready

The live rule, unchanged: her window here is full, Rift step included, so she was on a won run's roster; no Rift or
world-map fight open; not at work. The sheet adds two things the promotion needs:

- **Grouped by party** (T2W22): a party whose five are all ready shows as one group with its name ("Party 2 · all five
  ready"), since it moves into Tier 2 whole and keeps its name (live). Others list after it, one row each.
- **"Opens 8 of 20"** (T2W33): how many Tier 2 classes she'd open, two or three for each Tier 1 class she has at R50.
  On her tile in the Gallery and her row on the sheet, so a player who wants more choice ranks one more Tier 1 class
  before she goes. This line arrives with Tier 2's switch; no Tier 1 rule changes (R2-1).

#### 4.4.2 Her Tier 2 class

**T2W33: what opens.** **Every child of every Tier 1 class she has at Class Rank 50 when she ascends** ([classes](classes.md)
T2C76): two for the Brawler, the Sorcerer and the two healers, three for each hybrid. Class V's three at R50 open **6
to 9**; all eight open **all twenty**. The sheet reads her ranks in the Tier 1 world before she leaves (she arrives at
Class Rank 1 everywhere), and the move writes **her open set** into the new world (`open`, T2C95), so a later reset of
her ranks can never shut a class. The set is **fixed for the tier but for the door** (T2C48): no Tier 1 class fights in
a Tier 2 world, so there is no parent left to rank there. She **switches freely** among her open classes on her Class
tab, each on its own Class Rank, as Tier 1's held classes work (R2-5); with XR1's shared ladder her Ranks 1–10 rise in
all of them at once.

| Her Tier 1 class at R50 | Opens (classes T2C66; the line's role in a few words) | Cards | Healer |
|---|---|---|---|
| Brawler | **Berserker** (pure physical, Momentum) · **Spellfist** (single big hits, her Tome on ATK) | 2 | — |
| Sorcerer | **Archmage** (pure magic, Momentum) · **Battlemage** (single big hits, her Arm on M.ATK) | 2 | — |
| Arms Spellblade | **Blademaster** (familiar on both halves) · **Sentinel** (support, a ward) · **Bladedancer** (pure physical) | 3 | — |
| Tome Spellblade | **Runeblade** · **Enchanter** (support) · **Spellweaver** (pure elemental) | 3 | — |
| Arms Summoner | **Warlord** (both summons linger) · **Druid** (support, a mend) · **Marshal** (pure physical area) | 3 | — |
| Tome Summoner | **Invoker** · **Shaman** (support) · **Animist** (pure elemental area) | 3 | — |
| Paladin | **Guardian** (a stack more) · **Templar** (battle healer) | 2 | **Both** |
| Cleric | **Bishop** · **Exorcist** | 2 | **Both** |

| Tier 1 classes at R50 | Tier 2 classes open | Who |
|---|---|---|
| 3 (Class V's minimum) | **6 to 9**: 6 with the Brawler, the Sorcerer and a healer, 9 with three hybrids | Most Umas |
| 4 | 8 to 12 | One more ranked before she goes: "Opens 8 of 20" |
| 8 | **20** | Every Tier 1 class at R50, about 190,000 Class EXP: a goal, never a step |

**T2W34: the class page.** Grouped by Tier 1 class, its two or three cards in one order (the keeper, then the cross or
the support, then the pure variant), each card her slots as three channel dots (a cross's other-channel dot ringed),
her rule in four words or fewer ("Momentum", "Single big hits", "Support · a ward", "Pure physical", "Battle healer"),
a Healer or Support chip; Suggested marked. A made-up Pace Uma who brought the Arms Spellblade, the Tome Spellblade and
the Paladin to R50 sees eight cards in three groups (3 + 3 + 2); she fought as the Arms Spellblade, so the
Blademaster is Suggested.

**T2W35: the doors, shown, never picked.** Under the open cards a collapsed **"Opens later"** row counts what her door
would add (classes T2C48: a held Tier 2 class at Class Rank 20 opens every child of her parent's reclass neighbours,
itself included); a tap lists them by door ("A Brawler child at R20: Blademaster, Sentinel, Bladedancer, Warlord,
Druid, Marshal"). Never selectable on the sheet; the Class tab keeps the same row until each door opens. Tier 3's door
(T2C90) shows the same way on the Tier 3 page.

**T2W36: what's Suggested, in both later tiers.** **The child of the class she fights as**, when that class is at R50
and of her family: into Tier 2 its **keeper**; into Tier 3 its **Tier 3 child** (the Spellfist's and the Battlemage's
**kept child**, the Spellhammer and the Spellknight). Else the same child of **her family's first R50 class** in the
class tree's order; else of her first R50 class in that order (a kin class is Suggested only when nothing of her family
stands at R50). Her family is classes' T2C91 (Warrior and Mage 8 in Tier 2 and 9 in Tier 3, Spellblade and Summoner 6,
Healer 4). The other cards are one tap away. One healer a party is checked where a party fights (live `healerBlock`),
never here; the sheet warns (T2W22).

#### 4.4.3 Her weapons and their types

**T2W19: her class's preset, each weapon's type Suggested, set on the sheet.** The moment she picks a class, the
weapons part fills with that class's three slots as its preset (classes T2C77) and each weapon's **Tier 2 type** as
[gear](gear.md)'s Suggested (Pure or Dual and its partner, T2G51). A slot offers the kinds its channel allows: a cross's
other-channel slot says so ("Tome · on ATK", "Arm · on M.ATK"), a pure variant's three slots are one channel ("Arm ·
second half" on her third). A type is a chip row under its weapon. The line under the slots counts what she covers
("Greatsword, Katana, Fire + Axe: 4 kinds"). Later she swaps kinds and types on her Gear tab, free (T2G22); the sheet's
pick is a start, never a lock. Round 1's "a weapon's G5 picks its branch" is superseded (R2-6): the type is hers from G0.

#### 4.4.4 Her sub-profession

**T2W20: shown on the sheet, pre-picked.** Her calling names her line, and from Tier 2 that line is **two professions**
(R2-9); her **third** is a sub-profession from another line, and she works from her first minute in Tier 2. So her page
shows her line's two as fixed and the four other lines as chips, the Suggested one marked (professions.md's rule; round
1's was the line with the fewest hands for its work). She may change it there or later as [professions.md](professions.md)
rules it.

#### 4.4.5 What she keeps, picks and restarts

**T2W21: picks are settings, set or confirmed on the sheet; progress restarts.** This replaces round 1's T2W8
("settings carry"), which had no picks to make. It reconciles the cross-reference's **XR5** (branches and forms carry):
going up from Tier 1 there is nothing of Tier 2's to carry, so the sheet sets them; going up from Tier 2, her forms and
picks carry as settings, and her class and weapons are picked again for her Tier 3 class.

| Piece | Tier 1 → 2 | Tier 2 → 3 | Why |
|---|---|---|---|
| Her calling, her line, her template | Kept | Kept | Her racing profile's (live) |
| Her lower tiers' full windows, her history | Kept | Kept | The account's (CO1) |
| **Her class** | **Picked:** a Tier 2 class, Suggested the keeper of the class she fights as (T2W36) | **Picked:** a Tier 3 class, Suggested the Tier 3 child of the class she fights as (T2W36, T2W37) | R2-5, R3-1 |
| **The classes open to her** | Every child of every Tier 1 class at R50: 6–20, written to the new world (T2W33) | The Tier 3 children of every Tier 2 class at R50: 3–22, written to the new world (T2W38) | T2C76, T2C89 |
| **Her weapons' kinds and types** | **Picked:** her class's preset, gear's Suggested Tier 2 types | **Picked:** her Tier 3 class's preset and Suggested Tier 3 types; "As in Tier 2" maps hers (T2W39) | R2-6, T2G57 |
| Her accessory slots' families and kinds | Kept (live) | Kept | Live |
| Her accessory forms (the tree, R2-7) | None yet: a Tier 1 slot has no tree | **Kept as settings:** each waits until its slot's grade reopens it | A form is a setting; its grade is progress |
| Her Extra Stats picks (R2-8) | None yet | **Kept as settings:** a node's pick applies when its jewel reopens it | The same |
| **Her sub-profession** | **Picked**, Suggested | Kept, changeable on the sheet | R2-9 |
| Class Rank | 1 in every open class; Ranks 1–10 one shared ladder (XR1) | The same | Progress |
| Level, grades, nodes, all three Craft Levels, Bonds, Hall seats | Restart: Lv 1, G0, an empty map, Craft Lv 1 in each, none | The same | Live rule |
| Tree picks (lines, tips, her ★ tip), equipped skills | Defaults | Defaults (two lines held: A and B, T2C80) | They follow Class Rank |
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
  · heal 1". Two healer picks show the live words "One healer a party" in the warning colour; **a warning, never a
  block**, since the game checks one healer where a party fights, and she may mean to split the party in Tier 2.
- **"Suggested for all"** resets every pick of the group to its Suggested (each keeper, each preset), one tap.

**T2W44: the check line's roles on the forty-two.** **Damage:** the keepers, the crosses and the pure variants, and every
Tier 3 class of those lines; **support:** the Sentinel, Enchanter, Druid and Shaman and their Tier 3 children (Herald,
Oracle, Archdruid, Soulcaller); **heal:** the four healer classes of each tier. Kinds count her three slots and every
two-kind weapon's partner (the Gladiator's and the Thaumaturge's two), so "10 of 10 kinds" reads what the party answers
with.

The owner's comps (R2-12, R3-7) start here: Tier 1's look comes free (all keepers); **his two swaps** are two taps a
member: a Brawler with a Spellblade (the Brawler to her Spellfist, the Arms Spellblade to her Bladedancer: C3), a
Spellblade with the Paladin (the Arms Spellblade to her Sentinel, the Paladin to her Templar: C4); the check line shows
the party's breadth before it goes.

#### 4.4.8 Umas already in a Tier 2 world

**T2W23: at Tier 2's switch, each Uma already there becomes the keeper of her class.** Before round 2 is built, an Uma
who ascends arrives as her Tier 1 class (live) and plays Tier 1's eight × tier. When the Tier 2 toolbox switches on:
- She **opens every child of the class she fights as and of every Tier 1 class she has at R50 in that world** (two or
  three each; her Tier 1 ranks are gone, the Tier 2 world's are the only record).
- She **becomes her class's keeper at that class's Class Rank** (identity kept, nothing lost); every other open class
  stands at Rank 1, or at the shared ladder's rank.
- Her weapons keep their kinds with gear's Suggested types; her sub-profession is Suggested.
- Her Gallery tile and Window sheet show "New: Tier 2 classes" until her Class tab is opened; no sheet is forced.
- Her window keeps every step it lit (CO2).

#### 4.4.9 What the sheet writes

Per Uma, into the new world, in the save that ships Tier 2's toolbox (T2W15): her open set and her class (T2C's
fields), her class's three weapons and their types (T2G's), her sub-profession (T2P's). Into Tier 3 the same fields,
read on Tier 3's classes. The sheet's own state is never stored: Suggested is derived each time. Windows add nothing
(T2W28).

### 4.5 Content: the Campaign, capital runs, Drills, Trials, the Rift

| Content | Tier 2 | Opens |
|---|---|---|
| **The Campaign** | 240 regions, 24 a band a continent, each party its own | From arrival |
| **Capital runs** | Six a continent, 16 fights each, at T2 Lv 10 · 20 … 50; a first run pays about 1.3 levels to each of its twenty and triple Laurels × 2 | Any four full parties |
| **Drills** (T2W6) | T2 Lv 10 · 20 · 30 · 40 · 50 on `w6`–`w10`; 2–6 Logs a win; ten runs a day, banked to thirty; the Logs are the world's | The tier's first map win |
| **Trials** (T2W6) | Each front at T2 Lv 45 · 50 · 55 (lifetime 95 · 100 · 100 at ×1.22); Class EXP 652 · 1,300 · 1,300 a win | With the Rift: five T2 Lv 50 Umas |
| **The Rift** (T2W5, T2W30) | Four fronts at T2 Lv 50 on the tier's budget, the Convergence; Tier 2's own seals and Rift Conquered · Tier 2 (live ids); **one added test a front** | Five T2 Lv 50 Umas; twenty sign up |

**T2W5 and T2W30: the fronts' added tests, aimed at the later tiers' tools.** Z9's tests stand; what each asks of the
toolbox is now the twenty classes' (twenty-two in Tier 3), the weapon types', the stat picks' and the accessory tree's. Each tier's numbers are T2B's,
against rift.md §11's targets (the right party ≥ 80% a stage and 60–70% a champion, the wrong one ≤ 30% and ≤ 10%, the
Convergence about 50%).

| Front (guided by family, CV23) | Its added test in Tier 2 | What it asks of round 2's toolbox |
|---|---|---|
| **Iron** (the Warrior side) | Shields 2 over Tier 1's; foes weak to one or two Arms | Pure types' weak hits (T2G), Break tips (T2C), Momentum; in Tier 3 the Gladiator's Arsenal |
| **Arcane** (the Mage side) | One element a foe: a stage's leaders weak to one, its guards to another | A Dual type's partner (T2G), a kind row on Prowess (T2E), the Battlemage's Katana on M.ATK; in Tier 3 the Thaumaturge's Arsenal |
| **Duel** (the Spellblades) | Her boss acts three times from stage 9 | Single-target burst: the Spellfist's and Battlemage's Pinpoint, the familiar's Pierce, Pure types, single-target picks (T2E) |
| **Horde** (the Summoners) | Five to seven foes a wave | Area and multi-hit picks (T2E, R2-8), sweeps and volleys, the Marshal's and Animist's area, the supports' wider debuffs |

- **The guidance names the Tier 1 class, and any of its line fits** (T2W30, T2W45): Iron still suggests two Brawlers,
  an Arms Spellblade, an Arms Summoner and a Paladin, now read as "a Brawler's child" (in Tier 3 "of the Brawler's
  line") and so on; a member fits a guided class if she holds any of its Tier 2 children, or in Tier 3 any of its Tier 3
  descendants, the Suggested one (T2W36) in **Use the guided weapons**. So a run's twenty need no particular child, and
  any of the owner's comps can fit a front.
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
| **Class** | A Tier 2 class at R10 | One at R30 | One at R50 | **Two Tier 2 classes of one Tier 1 line at R50** (a class and her sibling) | **Three Tier 2 classes at R50** | The twenty; IV the owner's swap (T2W25, T2W42) |
| **Craft** | **Her three Craft Levels add up to 12** | 24 | 36 | 48 | **60** | Three professions (T2W26) |
| **Gear** | All eleven worn slots at G2 | G4 | G6 | G8 | G10 | The accessory tree's forms open with these grades |
| **Weapons** | Five weapons at G2 | G4 | G6 | G8 | G10 | Any of her classes', any type |
| **Stars** | Every node to I | to II | to III | to IV | The whole map | The tier's map, whatever T2E gives it; picks not read |
| **World** | Continent 6: a won capital run | 7 | 8 | 9 | 10 | Capital runs (CA12) |
| **Rift** | On a won Tier 2 Rift run | | | | | — |

**Stars' counts** follow [extra-stats.md](extra-stats.md)'s Tier 2 map by the live rule (every body's nodes numbered n
or less, her moon's I from II and II from IV, then the whole map): **4 · 9 · 13 · 18 · 22**: round 1's weapon moon
became Prowess's kind rows on the existing bodies ([extra stats](extra-stats.md) T2E27), so the map stays 22 nodes and the
track counts open nodes only, never which stat a node holds (T2E43).

#### 4.6.2 Each new system, and where the board reads it

| System (round 2) | Its progress | Its choices | On the board |
|---|---|---|---|
| **Twenty classes** (R2-2–R2-5, R3-4) | Class Rank on each class she holds | Which she fights as; keeper, cross, support or pure | **Class I–V** read her ranks over every Tier 2 class she holds; **IV asks for two of one Tier 1 line** |
| **Weapon types** (R2-6) | Each weapon kind's grade | Pure or Dual, the partner | **Weapons I–V** (five kinds, any type) and **Gear I–V** (her active class's three) |
| **The accessory tree** (R2-7) | Each slot's grade; forms open as it rises | Which form she wears | **Gear I–V** (every slot's grade); every tree is whole by a slot's G5 (gear T2G30), so Gear III on means every tree open |
| **Extra Stats picks** (R2-8) | Nodes opened by jewels | The stat each node takes | **Stars I–V** (open nodes) |
| **Three professions** (R2-9) | Three Craft Levels | Her sub-profession; where she works | **Craft I–V** (their sum) |
| **Capital runs** (D293) | A won run a continent | Which lane | **World I–V** |
| **The Rift** | A won run | — | **Rift** |

#### 4.6.3 Class: two classes of one Tier 1 line

**T2W25, as T2W42 reads it: Class I–III read her best Tier 2 class at R10 · R30 · R50; IV asks for two Tier 2 classes of
one Tier 1 line at R50 (a class and her sibling: two children of one Tier 1 class); V three Tier 2 classes at R50, any.**
The owner's "for balance I will swap back and forth between each one" becomes the one step that names the pair, and it
names no particular pair: any two of an open Tier 1 class's two or three children will do (a Brawler's Berserker and
Spellfist, an Arms Spellblade's Blademaster and Bladedancer, a Paladin's Guardian and Templar).

| Her Tier 1 line | Its Tier 2 classes | Pairs that light IV |
|---|---|---|
| Brawler · Sorcerer · Paladin · Cleric | Two each | One (the keeper and the cross, or the two healers) |
| Arms Spellblade · Tome Spellblade · Arms Summoner · Tome Summoner | Three each | Three (keeper and support, keeper and pure, support and pure) |

- **The pace is Tier 1's:** her campaign's Class EXP (about 51,000) covers one class from Rank 1 (3,600 + 23,680) and a
  second from Rank 10 (23,680, the shared ladder having raised it), so IV lights near T2 Lv 50 as Tier 1's two-at-R50
  does; V takes 20 Trial wins at Lv 50 (40 at Lv 45), or 24 Manuals.
- **It forces no build for long:** an Uma who never wants her sibling in a fight can rank her with Manuals or a
  half-campaign, and R2-11's party-value band keeps every Tier 2 class a fair party member (T2B). The alternative (IV
  "two Tier 2 classes at R50, any") is the seam if the owner would rather the board not nudge the swap.
- **Why "one Tier 1 line" and not "a sibling"** (T2W42): it says the same thing in Tier 2 and keeps saying it in Tier 3,
  where a Tier 3 class has a sibling only on the Spellfist's and the Battlemage's lines (§5.4).
- **Labels:** the tile "Pair at R50", next "Pair R41/50" (the lower rank of her best pair); the rule line "Two classes of
  one Tier 1 line at Class Rank 50".

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
| A specific class ("the Spellfist at R50") | Forces one class on every Brawler-family Uma | No |
| Breadth any option meets ("two of one line", "three classes", "five weapons", "her three Crafts to 60") | Rewards the system's width with no build named | **Yes** |

The window's art knows only the count, so reading a choice would gain nothing on the glass either. If the owner wants
a choice celebrated (her first fight as a cross, every type tried), that is CO30's medal phase: a ring on the window that
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

**Ready about day 33.5** (the Rift; 37.6 at 80%) **only where the Wilds keep up.** The tracks above are one Uma's own
pace on Tier 1's amounts. Round 2's farm (professions T2P40–T2P41) doubles what a full window takes (1,900 refined, every
grade taking both of its line's items), so the Gear, Weapons and Stars tracks wait on the Wilds: **a first cohort of
twenty working for itself fills its windows in about 63.6 days** (with sub-professions; 111.6 without), and forty at work
make twenty full windows in 31.8, where the Rift binds again at 33.5. The fighting party itself holds G10 on day 23.4
(Tier 1 23.0). This is the cross-reference's reading of T2P41 (XR15).

#### 4.6.7 The record and the art

**T2W28: no new position, no rebake; the rules read by tier.**

| | What changes | What doesn't |
|---|---|---|
| **The record** | Nothing. Tier 2's and 3's steps keep the live ids (`class-4`, `craft-1` …) and positions; each id's rule is the tier's | 36 codes × 3 characters in every tier; no widening, no migration. Steps lit in a Tier 2 world before its toolbox (Tier 1's rules × tier) stay lit (CO2) |
| **The champions mask** | Leaves with capitals v2 (v37, CA12) | — |
| **The rules** (`rpg/windows.ts`, `save/windows.ts`) | From Tier 2's switch: Class reads the tier's own classes (the twenty, then the twenty-two, not `tier1Ranks`), IV pairs by each class's Tier 1 ancestor (T2C95's `parent` chain), Craft the sum of T2P's three Craft Levels, Stars every body's `body:n`; `windowNext` gains "Pair R41/50" and "Crafts 29/36" | One pure rule, after every change and at load (CO10); latching; the toast |
| **The art** | Nothing | 36 steps: 7.14 of the map's 250 values a step, the face with the 36th; the tier frames exist; **the pane map never knows which step lit** |
| **The copy** | Tiles "Pair at R50", "Crafts 36"; toasts "Window +1 · Crafts 36" | Six words at most a string (CO34) |

### 4.7 The toolbox arrives

**T2W11: no new gates.** Every Tier 2 addition opens on a gate its system already has (the Ascend sheet, Class Rank, a
grade's Uma and Craft Level, a node's jewel and level), so nothing waits on a day, a quest or an unlock of its own. The
days are a first cohort's, nonstop, the fighting party served first ([§4.8](#48-a-tier-2-run-end-to-end)); the shapes are
round 2's, as [§6](#6-provides-and-assumes) assumes them.

| Addition | Doc | Gate | First cohort, day (80%) | Her level then |
|---|---|---|---|---|
| **Her Tier 2 class**, her open set (6–20), switching | T2C | **The Ascend sheet** (T2W16, T2W33–T2W36) | 0 | Lv 1 |
| **Her weapons' types** | T2G | **The Ascend sheet** (T2W19); swaps on her Gear tab | 0 | Lv 1 |
| **Her line's two professions and her sub-profession** | T2P | **The Ascend sheet** (T2W20); Craft Lv 1 in each | 0 | — |
| Three weaknesses at every rank (live, D235); the toolbox term rising to Lv 50; party value (R2-11) | T2B | Tier 2's foes | 0 | Lv 1 |
| Skill MP ×1.7; the healing scale ÷ 540 | T2C, T2B | Every Tier 2 skill | 0 | Lv 1 |
| Ranks 1–10, one shared ladder (XR1): every open class at R10 together | T2C | Class EXP 3,600 | 0–1 | Lv ~10 |
| Her class's own rule and kit by depth (Momentum, the cross and Pinpoint, the pure pair, the keepers' twists, support, battle healing) | T2C | Class Rank 1 · 10 · 20 · 30 · 40 (XR1: Uma Lv 1 · 10 · 16 · 22 · 29) | 0 → 1.9 | Lv 1 → 29 |
| ★ Signature tip on her lead weapon's tree | T2U | Its tip fork, depth 5 (CR 40) | 1.9 | Lv 29 |
| **Accessory forms** | T2G | A slot's grade: the first ring with her first Tier 2 grade, the second at G5 (gear T2G30) | 2.0 → 8.8 (2.6 → 11.0) | Lv 6 → 21 |
| **A stat pick on each node** | T2E | Each node as its jewel opens it | 2.5 → 22.6 | Lv 6 → 46 |
| A second class of her Tier 1 line at R50 (Class IV) | T2C | Class EXP past her first R50 | 8.8 | Lv 50 |
| LB+ at Bond 10 | T2C | Bond 10 in a hall | With Bonds, not days | — |
| Ten equipped skills | T2C | Uma Level (one more at Lv 10, 15 … 40, T2C16) | 6.4 | Lv 40 |

### 4.8 A Tier 2 run end to end

**A model, not a measurement.** A first cohort of twenty arrives together (four parties of the release's mix, all
keepers by default); the Wilds work nonstop; the fighting party is served first; its fights climb two bands a day while
gear allows and its Lv 41–50 bosses wait for G5 (tier2-world §11's measurement on engine v13: G3 won 15% of T2 Lv 50
bosses, G5 90%; T2B re-measures on the twenty); the Rift's fronts start when G8 opens and take 2–3 weeks of the
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
| **9** | Lv 50 (`w10`), capital run 5; a second class of her line at R50; five Lv 50 Umas: the Rift and Trials open | G5 (8.8 [11.0]); Crafts 24 (8.7–9.3 [10.8–11.6]) | Level V, World V, Class IV, Craft II: **22** |
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
- **The promotion takes a minute:** a party's five on the sheet with defaults is one tap; picking another child and its
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

Tier 3's additions, round 3's shapes ([classes](classes.md) §6, [gear](gear.md) §5, [extra stats](extra-stats.md) T2E44);
each opens on its system's own gate (T2W11). Days are a first cohort's, nonstop, on Tier 2's run model (§4.8): Tier 3
restarts every gate at Lv 1, so its toolbox lands on the same days.

| Addition | Doc | Gate | First cohort, day (80%) | Her level then |
|---|---|---|---|---|
| **Her Tier 3 class**, her open set (3–22), switching | T2C | **The Ascend sheet** (T2W37, T2W38) | 0 | Lv 1 |
| **Her class's Tier 3 rule** (Juggernaut, Resonance, Pinpoint doubled, Arsenal, Spellbind, Menagerie, the supports' twists, Momentum, Overflow, power ×0.7) | T2C | **From Class Rank 1** (T2C78): felt in her first fight | 0 | Lv 1 |
| **Her weapons' Tier 3 types** (Keen, Tempered, Evolved; Arsenal's two two-kind weapons) | T2G | **The Ascend sheet** (T2W39, gear T2G57); swaps on her Gear tab | 0 | Lv 1 |
| Tier 3's term (T2B36), skill MP ×2.4, shields 7 · 9 (XR19) | T2B, T2C | Tier 3's foes and skills | 0 | Lv 1 |
| Ranks 1–10, one shared ladder (XR1) | T2C | Class EXP 3,600 | 0–1 | Lv ~10 |
| **The Tier 3 door** (T2C90) and **two lines held** (T2C80) | T2C | Class Rank 20 (the fork) | 1 | Lv 16 |
| The ★ tip on both held lines of her lead tree (T2U13) | T2U | Depth 5, Class Rank 40 | 1.9 | Lv 29 |
| **The crown** (every held capstone 5.6, +4 MP, a stack more; MP back's sixth step) | T2C | **Class Rank 50** (T2C79) | 5.0 | Lv 36 |
| The accessory tree's step on every rider | T2G | A slot's first Tier 3 grade | 2.0 (2.6) | Lv 6 |
| The tree's third ring (Vow, Limit Orb, Apex) | T2G | A slot's G5 | 8.8 (11.0) | Lv 21 |
| Prowess's Trio and the stat lists' Tier 3 entries | T2E | Each node as its jewel opens it | 2.5 → 22.6 | Lv 6 → 46 |
| A second Tier 3 class of her line at R50 (Class IV) | T2C | Class EXP past her first R50 | 8.8 | Lv 50 |
| Three professions, as Tier 2's | T2P | Nothing new | — | — |

### 5.4 Her window (T2W43)

**T2W43: Tier 2's board at Tier 3's numbers, 36 with its Rift; the Class track on Tier 3's twenty-two.** Craft her
three Craft Levels to 12 · 24 · 36 · 48 · 60; Gear and Weapons G2 … G10; Stars the Tier 3 map by the same rule (22
nodes, T2E27); World continents 11–15, a won capital run each; the Rift step on a won Tier 3 run (T2W4). No new
position, no rebake (T2W28).

**The Class track by tier** (T2W42, T2W43; the live Tier 1 board for comparison):

| Step | Tier 1 (live) | Tier 2 | Tier 3 |
|---|---|---|---|
| **Class I** | A Tier 0 class at R10 | A Tier 2 class at R10 | A Tier 3 class at R10 |
| **Class II** | A Tier 1 class at R30 | A Tier 2 class at R30 | A Tier 3 class at R30 |
| **Class III** | A Tier 1 class at R50 | A Tier 2 class at R50 | A Tier 3 class at R50: **her first crown** (T2C79) |
| **Class IV** | Two Tier 1 classes at R50 | **Two Tier 2 classes of one Tier 1 line** at R50: a class and her sibling | **Two Tier 3 classes of one Tier 1 line** at R50 |
| **Class V** | Three Tier 1 classes at R50 | Three Tier 2 classes at R50 | Three Tier 3 classes at R50 |
| Read over | `tier1Ranks` (the eight) | Her Tier 2 classes, best first | Her Tier 3 classes, best first |

- **Class IV's "sibling" in Tier 3 reads as a class of the same Tier 1 line** (classes §6.6): a Tier 3 class has a true
  sibling only on the Spellfist's and the Battlemage's lines, so IV asks for two of one line's Tier 3 classes: three a
  line for the Brawler, the Sorcerer and each hybrid (the Ravager, the Spellhammer and the Gladiator; the Bladelord, the
  Herald and the Dervish), two for each healer (the Bastion and the Inquisitor).
- **IV is reachable from her first day in Tier 3:** Tier 2's Class IV left two classes of one Tier 1 line at R50, so their
  Tier 3 children are both open on arrival (T2W38), and both are of that line. Her door at Class Rank 20 opens the rest
  of the line.
- **Class III is her first crown,** as T2W29 assumed "if classes keeps it there" (it does, T2C79): the tile reads "R50",
  the rule line "A Tier 3 class at Class Rank 50 · crowned".
- **The pace is Tier 2's:** the same Class EXP, the same shared ladder; IV near T3 Lv 50, V on 20 Trial wins (Tier 3's
  Trials open with its Rift, T2W4) or 24 Manuals.

### 5.5 The Tier 3 promotion (T2W37–T2W41)

**R3-1: "there always should be an actual class promotion and a new name."** The Tier 3 Ascend becomes a promotion on
the same sheet as Tier 2's (T2W16), with Tier 3's options; it replaces round 2's T2W31, which assumed her open set would
simply carry.

**T2W37: the Tier 2 sheet's two pages, with Tier 3's options; every pick pre-filled, a party in one tap.**

| # | Screen | What it shows | Taps with the defaults |
|---|---|---|---|
| 0 | **The Gallery** · Ready | Her full Tier 2 window in its amber frame, the green dot; "Ready to ascend · Opens 4" on her tile; **Ascend 5** | 1 |
| 1 | **Ascend to Tier 3** · who goes | The ready Umas by party, ticked; per Uma her picked **Tier 3 class** with "Suggested", her weapons and Tier 3 types in one line, "Opens 4 of 22"; a check line per whole party (T2W44); the lines ("Lv 1 in Tier 3", "Ranks, grades, stars and Crafts restart", "+15,000 Laurels · +25 Speed Tickets", Class Marks) | 0 |
| 2 | **Her Tier 3** · her class | The Tier 3 classes open to her, **grouped by the Tier 2 class at R50 they promote from** ("From the Spellfist · R50"), one card each and two for the Spellfist and the Battlemage: her rule in four words ("Juggernaut", "Pinpoint doubled", "Arsenal", "Overflow"), her slots, a Healer chip; Suggested marked; locked Tier 2 classes greyed, "Rank to 50 in Tier 2"; "Opens later" for the Tier 3 door (T2W35) | 1 to change |
| 3 | **Her Tier 3** · her weapons | Her Tier 3 class's preset, each weapon's **Tier 3 type** (Keen, Tempered + its partner, Evolved + its partner) gear's Suggested; the Gladiator's and the Thaumaturge's two two-kind rows ("Arsenal · two two-kind weapons"); an **"As in Tier 2"** chip (T2W39) | 0–3 |
| 4 | **Her Tier 3** · her professions | Her line's two and her sub-profession as she had them; the sub changeable | 0 |
| 5 | **Ascend 5** | The tier veil, then Tier 3's Town Hall | 1 |

**T2W38: what opens.** **The Tier 3 children of every Tier 2 class she holds at Class Rank 50 when she ascends**
([classes](classes.md) T2C89): one each, two for the Spellfist and the Battlemage. The sheet reads her Tier 2 world's
Class Ranks before she leaves and writes the set into Tier 3's world (`open`), fixed for the tier but for the Tier 3
door (T2C90: a held Tier 3 class at Class Rank 20 opens every Tier 3 class of her Tier 1 line and of its reclass
neighbours' lines).

| Her Tier 2 class at R50 | Opens in Tier 3 | Her Tier 2 class at R50 | Opens in Tier 3 |
|---|---|---|---|
| Berserker | Ravager | Spellfist | **Spellhammer** (kept) · Gladiator |
| Archmage | Astromancer | Battlemage | **Spellknight** (kept) · Thaumaturge |
| Blademaster · Sentinel · Bladedancer | Bladelord · Herald · Dervish | Runeblade · Enchanter · Spellweaver | Runelord · Oracle · Starweaver |
| Warlord · Druid · Marshal | Overlord · Archdruid · Imperator | Invoker · Shaman · Animist | Hierarch · Soulcaller · Mythlord |
| Guardian · Templar | Bastion · Inquisitor | Bishop · Exorcist | Cardinal · Hierophant |

| Tier 2 classes at R50 | Tier 3 classes open | Who |
|---|---|---|
| 3 (Tier 2's Class V) | **3 to 5**: 4 with a Spellfist or a Battlemage among them, 5 with both | Most Umas |
| 4 | 4 to 6 | One more ranked before she goes |
| 20 | **22** | Every Tier 2 class at R50: a goal, never a step |

A made-up Front Uma who brought the Berserker, the Spellfist and the Bladedancer to R50 in Tier 2 (Class IV her
Berserker and Spellfist) sees four cards: the Ravager; the Spellhammer and the Gladiator; the Dervish. She fought as the
Spellfist, so the **Spellhammer** is Suggested (T2W36); the Gladiator is one tap beside it.

**Suggested** is T2W36's rule: the Tier 3 child of the class she fights as (the Spellfist's and the Battlemage's kept
child), else of her family's first R50 class in the tree's order.

**T2W39: her weapons into Tier 3.** The page pre-fills **her Tier 3 class's preset and [gear](gear.md)'s Suggested Tier 3
types** (T2G56, T2G57), as the Tier 2 sheet pre-fills the Tier 2 class's: the coverage bound holds on the Suggested
types (gear T2G52), so the default must be them. **"As in Tier 2"** copies her Tier 2 parent's kinds as she left them and
maps her types (Pure → Keen, Dual → Tempered with the same partner), one tap, offered where her slots match her parent's
(every Tier 3 class but the Gladiator and the Thaumaturge, whose third slot changes channel). Round 2's "pre-filled with
hers" (T2W19, T2W31) is amended: a new class takes its own preset; her last kit is the chip.

**Her professions, forms and picks** carry as T2W21 says: her sub-profession as she had it (changeable on the sheet), her
accessory forms and Extra Stats picks kept as settings, waiting for their grades and jewels. The purse: 3,000 Laurels
and 5 Speed Tickets an Uma (T2W10).

**A party into Tier 3** (T2W22, T2W44): grouped by party, the check line, "Suggested for all". The owner's swaps one tier
down are two taps a member: a Brawler with a Spellblade (the Spellhammer and the Dervish, classes' T3), a Spellblade with
the Paladin (the Herald and the Inquisitor, T4); the Gladiator's way (T3g) one tap on the Spellfist's group.

**T2W40: Umas already in a Tier 3 world at its switch.** Before Tier 3's toolbox an Uma there plays Tier 1's eight × 2.6
(live). At the switch (classes §6.6):
- She **becomes her Tier 1 class's keeper's Tier 3 child** at that class's Class Rank (a Brawler the Ravager, a Paladin
  the Bastion, an Arms Spellblade the Bladelord): identity kept, nothing lost.
- She opens **the Tier 3 children of the keepers of every Tier 1 class she has at R50 there**, at least her own; the
  Tier 3 door opens the rest of her lines from Class Rank 20.
- Her weapons keep their kinds with gear's Suggested Tier 3 types; her sub-profession stays.
- "New: Tier 3 classes" on her Gallery tile and Window sheet until her Class tab opens; no forced sheet; her lit steps
  stay (CO2).

**T2W41: ascending into Tier 3 before its toolbox.** Tier 2's toolbox ships first (T2W15: v22 · v39, then v23 · v40), so
an Uma can fill a Tier 2 window before Tier 3's classes exist. From Tier 2's switch the Tier 3 Ascend **writes her Tier
3 open set (T2W38) and the Tier 2 class she ascended as** into the new world; she fights there as that class's Tier 1
ancestor (Tier 3 plays Tier 1's eight until its switch), and the sheet's class page reads "Tier 3 classes arrive with
Tier 3's update". At the switch she **becomes the Tier 3 child of the class she ascended as** (T2W36's Suggested) at the
ancestor's Class Rank, with that open set: nothing she earned in Tier 2 is lost, and T2W40's keeper rule covers only the
Umas who reached Tier 3 before Tier 2's switch.

### 5.6 The end of the climb (T2W14)

**Tier 4 stays closed.** A sixteenth scenario shows "Tier 4 locked" (D280) and joins no world until the owner opens Tier
4; until then nobody ascends from Tier 3 and its Rift step only completes her window. When Tier 4 opens, its world takes
this doc's Tier 2 shape, and Tier 3's full windows (Rift step lit) are ready to ascend into it at once.

## 6. Provides and assumes

**What this doc provides** (other docs read these from it):

| To | What | Call |
|---|---|---|
| All six | The run's timeline: when each addition lands by day and level, in Tier 2 and Tier 3; no new gates | T2W11, T2W32, T2W46, §4.7, §5.3 |
| All six | Promotion: the Ascend sheet's pages into Tier 2 and Tier 3, and what she keeps, picks and restarts | T2W16–T2W21, T2W37–T2W39 |
| All six | The windows: what each track reads in each tier, and that a step reads progress, never a choice | T2W24–T2W28, T2W42, T2W43 |
| All six | Tier 3 has a Rift and Trials; Tier 4 stays closed | T2W4, T2W14 |
| **T2C** (classes) | The class pages: the Tier 2 open set (every child of every Tier 1 class at R50, 6–20) and the Tier 3 one (the Tier 3 children of every Tier 2 class at R50, 3–22), each written to the new world and fixed but for the doors; Suggested by one rule in both tiers (the child of the class she fights as, the crosses' kept child, her family first); the doors shown as "Opens later", never picked; Class IV two classes of one Tier 1 line, Class III in Tier 3 her first crown, Class V three; the Rift's guidance by Tier 1 line; Umas already in Tier 2 or Tier 3 at each switch; an Uma ascending into Tier 3 before its toolbox | T2W33–T2W43, T2W45 |
| **T2G** (gear) | The weapons pages: Tier 2 her class's preset with gear's Suggested Tier 2 types; **Tier 3 her Tier 3 class's preset with gear's Suggested Tier 3 types, "As in Tier 2" a chip** (her types mapped Pure → Keen, Dual → Tempered), not on the Gladiator or the Thaumaturge; Gear and Weapons read grades whatever the type or form; her forms carry as settings | T2W19, T2W21, T2W24, T2W39 |
| **T2E** (extra stats) | Stars counts open nodes of every body (`body:n`), never picks; her picks carry as settings; the counts by the tier's map | T2W21, T2W24, T2W27 |
| **T2P** (professions) | Craft reads her three Craft Levels' sum (12 · 24 · 36 · 48 · 60), so each profession keeps Tier 1's curve or the thresholds move; her sub-profession shown pre-picked on the sheet into Tier 2, kept into Tier 3; the full window's demand target (950 refined an Uma, Metal and Vegetables 250) and the run target (a party's windows in about 32 days) | T2W12, T2W20, T2W26 |
| **T2B** (balance) | The party check line's roles (damage, support, heal) on the forty-two; the fronts' re-aimed tests per tier | T2W22, T2W30, T2W44, T2W45 |
| **T2U** (templates) | She arrives as the class she picks (Tier 2 and Tier 3); Suggested never a kin class while one of her family stands at R50; her ★ tip at CR 40, at both forks in Tier 3 | T2W36, T2W21 |

**What this doc assumes** (round 3's shapes; the cross-reference pass checks them):

| From | Assumed | Used in | If not |
|---|---|---|---|
| **T2C** (classes) | **Twenty Tier 2 and twenty-two Tier 3 classes** (T2C65, T2C66), each with her `parent` (T2C95); **only the tier's own classes fight in its world**; each class its own Class Rank 1–50 with XR1's shared ladder for 1–10; switching free among those she holds; one healer a party, every healer class a healer; three slots a class (a cross's other-channel slot, a pure variant's one channel); presets (T2C77, a Tier 3 class her parent's but the Gladiator's and the Thaumaturge's); the Tier 2 and Tier 3 promotions (T2C76, T2C89) and doors (T2C48, T2C90); the crown at Class Rank 50 on every Tier 3 class (T2C79); her family (T2C91); Umas already in a later world (§6.6, T2C95) | §4.4, §4.6, §4.7, §5 | If a Tier 3 class gains a second child somewhere, Class IV's "one Tier 1 line" still reads it; if the crown moves off Class Rank 50, Class III in Tier 3 is a plain R50 |
| **T2G** (gear) | **Each weapon's type set on the sheet**, swapped freely later (T2G22); grades per weapon kind as live; **Suggested types by class in both tiers, holding the coverage bound** (T2G50–T2G56); **the Tier 3 sheet pre-fills Suggested, "As in Tier 2" a chip** (T2G57); Arsenal's two two-kind weapons; the accessory tree whole by a slot's G5 (T2G30); three slots | §4.4.3, §4.6, §4.7, §5.5 | If a type cost an item to set, the sheet would show the cost and Suggested would pick the free one |
| **T2E** (extra stats) | Jewels open the Planet's and moons' nodes as today; **every open node takes a stat she picks** from its body's list, swappable, with a default; the map 22 in every tier (T2E27, T2E43) | §4.6.1, §4.7, §5.3 | If a node can be open and unpicked: Stars still counts open nodes |
| **T2P** (professions) | **Two professions a line plus one sub-profession: three Craft Levels**, each 1–50 on Tier 1's curve (88,200 EXP); a job raises the profession it belongs to; Craft restarts at 1 in all three on Ascend; the sub-profession picked free (shown on the sheet) | §4.4.4, §4.6.4, §8 | If a profession's curve differs: the Craft thresholds follow its EXP (the dial, §4.6.4) |
| **T2B** (balance) | Party value bands for every class of both tiers (R2-11, R3-8), so no class on the sheet is a trap; Z3's restart; the toolbox terms (T2B36); three weaknesses at every rank (live); shields 7 · 9 in Tiers 2 and 3 (T2B7, XR19); the fronts' numbers per tier | §4.2, §4.5, §5.2, §5.3 | — |
| **T2U** (templates) | Her family on the forty-two (the descendants of her calling's own Tier 1 classes); the ★ tip on her lead weapon's tree at CR 40, at both forks in Tier 3; the signature and her moon × tier (live) | §4.7, §5.3 | — |

## 7. Save and engine

Roughly, not packets. **T2W15: the world goes first on today's engine, then the toolbox as one release a tier.**

| Step | What changes | Engine · save |
|---|---|---|
| 0. Before | Capitals v2 and the honeycomb live (H162, H166: done) | — · v37, v38 |
| 1. The Tier 2 and 3 worlds | Leans and packs by tier (T2W2, T2W3, generator data under its guard); the fifteenth Finals (T2W13, data); Twilight Vale (Z10, a label); tickets and the purse × tier (T2W10, Exchange and Ascend rules); the Ascend sheet's five line (T2W9, a screen) | None: fights replay from their frozen inputs and these are generators and rules, as D293 reasoned |
| 2. Tier 3's Rift | `RIFT_TIERS` gains 3; Tier 3's five achievements; `tierHasRift` splits into "has a Rift" (every tier) and "has a tier above" (Ascend's block); Trials open in Tier 3; the board 36 everywhere (T2W4) | None, or a small save step if the parse needs the new achievement ids |
| 3. Tier 2's toolbox | T2C, T2G, T2E, T2P, T2B, T2U; **the Ascend sheet's pages** (T2W16–T2W22, T2W33–T2W36) writing T2C's, T2G's and T2P's fields; **the Tier 2 board's rules** (T2W24–T2W28, T2W42, no record change); the switch's migration for Umas already in Tier 2 (T2W23); **the Tier 3 Ascend's open set and her Tier 2 class written from here** (T2W41); dark behind one Tier 2 switch, as Classes v3 shipped | **engine v22, save v39** (D198's R3–R4 numbers are taken) |
| 4. Tier 3's toolbox | The same, Tier 3's pieces; **the Tier 3 promotion's pages** (T2W37–T2W39); the Tier 3 board's Class rules (T2W43); the switch's migration for Umas already in Tier 3 (T2W40) and for those who ascended before it (T2W41) | engine v23, save v40 |

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
| Class IV | Two Tier 1 classes at R50: her campaign's Class EXP (about 51,000) | Two classes of one Tier 1 line at R50: the same EXP |
| Class V (a third) | 20 Trial wins at Lv 50 (40 at Lv 45), or 24 Manuals | The same |
| Her own Craft V | Craft Lv 50: 588 hours of her slot, **24.5 days nonstop**, 30.6 at 80% | Her three to 60: **24.9–27.8 days nonstop**, 31.2–34.8 at 80% |
| Her full window's work | 950 refined, 763 hours of slot time, done by the roster | Professions' Tier 2 demand (T2P, assumed close) |
| Her promotion | — | One sheet, one tap with the defaults, into Tier 2 and into Tier 3 |

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

- **Round 2 doubles these** (professions T2P40–T2P41, XR15): a full window is 1,900 refined, so the pooled run of twenty
  takes **63.6 days** (111.6 unpooled); forty at work bring twenty windows back to 31.8.
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

### 8.6 Round 3 in days (T2W46)

**Round 3 moves no day.** Every gate it touches already had its place on the clock:

| Round 3's piece | When | Why the clock doesn't move |
|---|---|---|
| Her Tier 2 open set grows to 6–20 | Tier 2's day 0, on the sheet | More cards, the same tap; Class EXP pace unchanged (XR1) |
| The Tier 3 promotion and her Tier 3 rule | Tier 3's day 0; the rule from her first fight (T2C78) | The sheet's tap is Tier 2's; the rule needs no rank |
| The Tier 3 door | Class Rank 20 on any Tier 3 class she holds, Lv 16, about day 1 | The Tier 2 door's gate, one tier down |
| The crown | Class Rank 50 on her active class, Lv 36, about day 5 | Round 2 had it there (T2C20) |
| Class IV in either later tier | A second class of her line at R50, about day 8.8 (Lv 50) | The same Class EXP as two classes at R50; the shared ladder raises her sibling to R10 with her |
| Arsenal's second two-kind weapon | The sheet | A type costs nothing (gear T2G39) |

## 9. Previews: carried and retired

| Page | What it holds | Carries |
|---|---|---|
| [progression-tiers.html](previews/progression-tiers.html) | Tier 1 → 2 → 3 side by side; what each tier adds, by doc (round 3's shapes: 13 → 20 → 22 classes); what she keeps, picks and restarts at each Ascend; one made-up Uma across three tiers; her board per tier; how the counts grow; the old calls' status | [character-tiers.html](../tier-rework/previews/character-tiers.html)'s one-Uma board (its per-cell stat values move to the system docs' pages); [progression.html](../tier-rework/previews/progression.html)'s tier columns and "how the counts grow" |
| [progression-ascend.html](previews/progression-ascend.html) | **Round 3:** the Ascend sheet at 390 × 844, screen by screen, **into Tier 2 and into Tier 3**: the Gallery's ready tiles, who goes by party with the check line, her page (the twenty's or the twenty-two's cards grouped by parent, weapons and types with "As in Tier 2" and Arsenal's two rows, professions), a party of five played through the owner's swaps in both tiers, the open sets and Suggested, Umas already in a later world | — (round 2's, rewritten) |
| [progression-windows.html](previews/progression-windows.html) | The boards by tier with **the Class track on the new trees** (IV two classes of one Tier 1 line, III in Tier 3 her crown) and a line picker; how a window is drawn (a placeholder window and its pane map lit by the live rule at any step count); latching against a free pick; what each new system lights; pacing by track; the record | [board.html](../collections/previews/board.html)'s board by tier (collections' pages stay where they are) |
| [progression-world.html](previews/progression-world.html) | Tier 2's and Tier 3's continents; the honeycomb by band; foes by tier level; pay by tier; the Rift's fronts re-aimed at the later tiers' tools, Trials and Drills by tier | — (round 1's) |
| [progression-run.html](previews/progression-run.html) | A Tier 2 run day by day; the window lighting; the toolbox arriving in Tier 2 and Tier 3; the Wilds calculator (cohort, uptime, demand, sub-professions); 24 parties | [progression.html](../tier-rework/previews/progression.html)'s roadmap ("what unlocks when") and "pace holds" |

**Retired:** progression.html's "how it ships: five live releases" (D198's R3–R5 numbers are taken, §3.7), "choices a
player owns" and "Tier 1: today vs approved" (Tier 1 is built; the system docs count their own choices).
character-tiers.html's stat cells (every system doc draws its own Tier 1 → 3 page).

**Words this doc and its pages add, checked** (case-insensitive exact match against every distinct string of the
master-data release's ten files and the game's own string literals in `packages/domain/src` and `apps/web/src`; none
matches): Keeper, Keepers, Sibling, Pair at R50, Pair R41/50, Crafts, Crafts 36, Sub-profession, Her Tier 2, Her Tier 3,
Her Tier 2 class, Her Tier 3 class, Her weapons, Her sub-profession, Suggested for all, Opens 8 of 20, Opens 4 of 22,
Opens later, Who goes, Party check, Swap any time on Gear, Rank to 50 in Tier 1, Rank to 50 in Tier 2, New: Tier 2
classes, New: Tier 3 classes, As in Tier 2, Battle healer, Self-buff, Ready to ascend · Opens 8, Her professions, Kept as
settings, Her three Crafts, Wilds jobs · all three, Single big hits, Pure physical, Pure elemental, Two classes of one
Tier 1 line at Class Rank 50, Tier 3 classes arrive with Tier 3's update, and templates.md's "★ Tip · on a strike
line". "Support" as a role word matches an old accessory-slot label in the code (before D264), not a name. Round 2's
"Expander" and "Opens 6 of 16" leave the pages. The forty-two classes' names, Momentum, Pinpoint and Arsenal are
classes.md's (checked there, §11).

## 10. Decisions

Every call, with its recommended answer, the alternatives, and its status. **Stands** is a round-1 call later rounds
leave whole; **Superseded (Rn-m)** names the requirement that replaced it and the call that does its job now; **Kept,
changed (R3-n)** a round-2 call round 3 re-reads.

### 10.1 Round 3 (T2W33–T2W46)

| Id | Call | Recommended | Alternatives | Status |
|---|---|---|---|---|
| **T2W33** | The Tier 2 open set on the twenty | **Every child of every Tier 1 class she has at Class Rank 50 when she ascends (two or three each): 6 to 20,** read before she leaves, written to the new world, fixed but for the door (T2C48); "Opens 8 of 20" on her Gallery tile and sheet row | The keeper and the cross or support only, the pure variant by the door; all twenty for everyone | **New (R3-4)**; re-counts T2W17 |
| **T2W34** | The Tier 2 class page | **Grouped by Tier 1 class, two or three cards each in one order** (the keeper, the cross or the support, the pure variant): slots as channel dots, her rule in four words or fewer, a Healer or Support chip, Suggested marked; locked Tier 1 classes "Rank to 50 in Tier 1" | A flat list of the twenty; cards by role (damage, support, heal) across parents | **New (R3-4)** |
| **T2W35** | The doors on the sheet | **Shown, never picked:** a collapsed "Opens later" row counts what each door would add (T2C48 in Tier 2, T2C90 in Tier 3), a tap lists them by door; the Class tab keeps the same row until each opens | Hide the doors (a surprise at Class Rank 20); let the sheet pick a door's class (breaks "open at R50") | **New (R3-4)** |
| **T2W36** | Suggested in both later tiers | **The child of the class she fights as when that class is at R50 and of her family** (into Tier 2 its keeper; into Tier 3 its Tier 3 child, the Spellfist's and Battlemage's kept child); **else the same child of her family's first R50 class in the tree's order; else of her first R50 class** (kin only when none of her family stands at R50) | Round 2's "her highest R50 class" (every R50 class ties at Rank 50); the Gladiator or the Thaumaturge for a cross (changes her kit unasked) | **New (R3-1, T2C89, T2C91)**; amends T2W18 |
| **T2W37** | The Tier 3 promotion on the Ascend sheet | **The Tier 2 sheet's two pages with Tier 3's options:** who goes (by party, Suggested Tier 3 class, weapons, "Opens 4 of 22", the check line), her page (class grouped by Tier 2 parent, weapons with Tier 3 types and "As in Tier 2", professions), one tap with the defaults; 3,000 Laurels | A promotion sheet after arrival; a forced pick with no default; round 2's T2W31 (her open set carrying, no new class) | **New (R3-1)**; supersedes T2W31 |
| **T2W38** | The Tier 3 open set | **The Tier 3 children of every Tier 2 class she holds at Class Rank 50 when she ascends: 3 to 22** (one each, two for the Spellfist and the Battlemage), read in the Tier 2 world before she leaves, written to the new one, fixed but for the Tier 3 door (T2C90) | Every Tier 3 class of her Tier 1 lines; the children of every Tier 2 class she held, whatever its rank (both: classes' T2C89 alternatives) | **New (R3-1)** |
| **T2W39** | Her weapons into Tier 3 | **Pre-filled with her Tier 3 class's preset and gear's Suggested Tier 3 types** (T2G57), so the coverage bound holds by default; **"As in Tier 2"** copies her parent's kinds and maps her types (Pure → Keen, Dual → Tempered), offered where her slots match (not the Gladiator, the Thaumaturge); Arsenal's two two-kind rows | Round 2's "pre-filled with hers" (default kits over the bound with Arsenal, gear §5.3); Suggested with no chip | **New (R3-1)**; amends T2W19 for Tier 3 |
| **T2W40** | Umas already in a Tier 3 world at its switch | **Each becomes her Tier 1 class's keeper's Tier 3 child at that class's Class Rank** (classes §6.6); opens the Tier 3 children of the keepers of every Tier 1 class she has at R50 there, at least her own; Suggested types; "New: Tier 3 classes"; no forced sheet; lit steps stay | Open all twenty-two to them; a forced promotion sheet on the first load | **New (R3-1)** |
| **T2W41** | Ascending into Tier 3 before its toolbox | **From Tier 2's switch the Tier 3 Ascend writes her Tier 3 open set and the Tier 2 class she ascended as;** she fights as its Tier 1 ancestor until Tier 3's switch, then becomes the Tier 3 child of that class at the ancestor's Class Rank | Hold the Tier 3 Ascend until Tier 3's toolbox (a gate T2W11 refuses); treat her by T2W40 (her Tier 2 record lost) | **New (R3-1)** |
| **T2W42** | Class IV in both later tiers | **Two classes of one Tier 1 line at Class Rank 50:** in Tier 2 a class and her sibling (one or two siblings a class), in Tier 3 two of the line's two or three Tier 3 classes; reachable from Tier 3's first day (Tier 2's IV leaves a pair of one line at R50); "Pair at R50" | Tier 3's IV "two Tier 3 classes at R50, any" (a sibling exists only on the crosses' lines); a true sibling only (eighteen of the twenty-two have none) | **New (R3-1, R3-4)**; amends T2W25 |
| **T2W43** | The Tier 3 board | **Tier 2's board at Tier 3's numbers, 36 with its Rift:** Class I–II at R10 · R30, **III a Tier 3 class at R50, her first crown**, IV T2W42, V three Tier 3 classes at R50; Crafts to 60, the Tier 3 map, continents 11–15 | A track for the crown or the Tier 3 rule; 35 without a Rift | **New (R3-1)**; supersedes T2W29 |
| **T2W44** | The party check line on the forty-two | **Roles: damage** (keepers, crosses, pure variants and their Tier 3 lines), **support** (the four supports and their Tier 3 children), **heal** (every healer class); kinds counted with every partner, Arsenal's two | Roles by measured party value per comp (a number that moves) | **New (R3-6)**; amends T2W22 |
| **T2W45** | The Rift's guidance on the forty-two | **The guidance names the Tier 1 class; any of its Tier 2 children, and in Tier 3 any of its Tier 3 descendants, fits;** the Suggested one in Use the guided weapons | Name exact Tier 2 or Tier 3 classes a front | **New (R3-4)**; amends T2W30 |
| **T2W46** | Round 3's pacing | **No day moves:** the open sets grow on the same tap; the Tier 3 rule works from Class Rank 1; the doors at Class Rank 20 (Lv 16), the crown at 50 (Lv 36); Class IV's EXP unchanged; Arsenal's second two-kind weapon free | — | **New (R3-1)** |

### 10.2 Rounds 1 and 2 (T2W1–T2W32)

| Id | Call | Recommended | Alternatives | Status |
|---|---|---|---|---|
| **T2W1** | The Tier 2 world's shape | **Tier 1's on continents 6–10, with capitals v2 and the honeycomb live first:** 48 regions, 24 parties, six Springs, six capital runs a continent; no Tier 2 world packet before H162 and H166 | Build Tier 2 on the old map first; a smaller Tier 2 world | Stands (H162 and H166 are live) |
| **T2W2** | Continent leans by tier | **Tier 2 Jungle, Sky Isles, Glacier, Volcano, Underworld (Z1); Tier 3 Swamp, Highlands, Geyser Basin, Storm Peaks, Ancient Ruins**; a tier's leans change only while no world of it holds a won stage | Repeat Tier 1's leans (live); random leans a world | Stands |
| **T2W3** | Face packs by tier | **Tier 1's totals, arranged anew each tier:** Tier 2 Z7's (the middle pack opens it, the small returns twice, the large closes it); Tier 3 a third (the small holds `w13` whole) | Repeat Tier 1's arrangement (live); new packs a tier | Stands |
| **T2W4** | Does Tier 3 get a Rift | **Yes:** the same shape at T3 Lv 50, its own seals and Rift Conquered · Tier 3, the Rift step (every board 36), Trials with it; nobody ascends from it while Tier 3 is the top tier: a full Tier 3 window is the end of her collection, in its violet frame | No Tier 3 Rift until a Tier 4 exists (no Trials there, a 35-step board) | Stands |
| **T2W5** | The Rift's fronts in Tiers 2 and 3 | **Z9's one added test a front, re-aimed at the later tiers' toolbox** (Iron shields +2 and one or two Arms; Arcane one element a foe, leaders and guards apart; the Duel's boss three acts from stage 9; the Horde five to seven a wave); Tier 3 keeps them; T2B sets each tier's numbers | Tier 1's fronts × tier, no added test; new fronts | Stands; its guidance clause re-cut by T2W30, T2W45 |
| **T2W6** | Trials and Drills by tier | **Unchanged in every tier:** Trials at the tier's Lv 45, 50, 55, opening with its Rift; Drills at its Lv 10–50, 2–6 Logs, ten runs a day banked to thirty, opening with its first map win; Logs and Marks stay in their world | More Logs or higher levels a tier; Logs that cross worlds | Stands |
| **T2W7** | Windows by tier | One board, 36 steps in every tier; Class I a Tier 1 class at R10 from Tier 2; World n a won capital run; the Stars steps count the tier's whole map, weapon moons included; no new track | — | **Superseded (R2-10)** by T2W24–T2W29 |
| **T2W8** | Ascend with a toolbox | Settings carry, progress restarts: her class and its class branch, her accessory families, kinds and forms, her weapon branches and her weapon moon's setting carry | — | **Superseded (R2-5, R2-6)** by T2W21 |
| **T2W9** | Ascending into an empty world | **The Ascend sheet says when the new world would hold fewer than five** ("3 of 5 to fight in Tier 2"); no rule change | Block an Ascend that leaves fewer than five; no line | Stands (a line on the sheet's first page, both tiers) |
| **T2W10** | Prices by tier | **Speed and Sweep Tickets × tier** (20 · 30 in Tier 2, 30 · 45 in Tier 3) **and the purse's Laurels × the tier she arrives in** (2,000, 3,000), so a Laurel buys the same time in every tier; Marks, Manuals and Logs untiered | Keep the tickets flat (the first knob if Tier 2 plays slow); a flat 1,000 purse | Stands |
| **T2W11** | When the toolbox opens | **No new gates:** every Tier 2 and 3 addition opens on its system's gate (the Ascend sheet, Class Rank, a grade's levels, a node's jewel and level) | Gates of their own (quests, a day, a building) | Stands, re-cut on rounds 2 and 3's systems (§4.7, §5.3) |
| **T2W12** | A run's pacing target | **Tier 1's time for the fighting party (G10 by day 23.4) and for a world of forty at work (twenty windows in 31.8); a first cohort of twenty working for itself takes about twice that (63.6 days), round 2's deeper farm (XR15);** fights about 130 wins a party | A faster later tier (tickets flat); Tier 1's time for every cohort (a half step, T2P41's alternative) | Kept, changed (R2-9, XR15) |
| **T2W13** | The fifteenth scenario's capital | **Its own four authored Finals routes** (original names, checked against the release), with Tier 3's world packets | Keep reusing continent 1's Finals | Stands |
| **T2W14** | A sixteenth scenario | **Tier 4 stays closed:** it shows "Tier 4 locked" and joins no world until the owner opens Tier 4; Tier 3's Rift step completes her window only | Open Tier 4 now; let Tier 3 ascend into a placeholder | Stands |
| **T2W15** | The version plan | **The worlds first on today's engine** (leans, packs, prices, Tier 3's Rift), **then the toolbox as one release a tier:** Tier 2 at engine v22 and save v39 (the Ascend sheet's pages and the board's rules with it), Tier 3 at v23 and v40, each dark behind its switch | Everything at once; one release a system | Stands; T2W41 covers the gap between the two |
| **T2W16** | Where promotion happens | **On the Gallery's Ascend sheet, two pages, every pick pre-filled:** who goes (by party, a summary row per Uma), then her page (class, weapons and types, sub-profession); one tap ascends with the defaults; nothing opens over the sheet | A promotion sheet after arrival; a required pick with no default; a Promote place of its own | **Kept** (R3-1: the Tier 3 promotion uses it, T2W37) |
| **T2W17** | The classes open to her | Both children of every Tier 1 class she has at Class Rank 50 when she ascends: 6 to 16, read before she leaves and written to the new world; widened only by classes' door (XR16); "Opens 6 of 16" | Only the class she fights as's two; all sixteen for everyone | **Kept, changed (R3-4)**: every child, 6 to 20 (T2W33) |
| **T2W18** | Her Suggested Tier 2 class | The keeper of the class she fights as when it is at R50, else of her highest R50 class (ties: her family's, then the tree's order) | No Suggested; the expander; by her calling | **Kept, changed (R3-1, T2C91)**: one rule for both tiers, her family first (T2W36) |
| **T2W19** | Her weapons at promotion | **Her picked class's preset, each weapon's type gear's Suggested, set on the sheet;** a slot offers its channel's kinds, a cross's other-channel slot included; swaps later as gear rules; no G5 gate | Defaults with no type until a weapon's G5 (round 1); a weapons visit after arrival | **Kept, changed (R3-1)**: into Tier 3 her new class's preset and Suggested, "As in Tier 2" a chip (T2W39) |
| **T2W20** | Her sub-profession at promotion | **On her page, pre-picked** with professions' Suggested, her line's two shown fixed; changeable there or later | Picked only after arrival; none until a Craft Level | Kept |
| **T2W21** | What she keeps, picks and restarts | **Picks are settings, set or confirmed on the sheet; progress restarts:** kept her calling, line, template, windows, history, accessory families and kinds; picked her class, weapons and types, sub-profession; from Tier 2 her forms and stat picks kept as settings; restarted level, Class Rank, grades, nodes, all three Craft Levels, Bonds, seats, tree picks (reconciles XR5) | Round 1's T2W8; everything restarts, forms and picks too | **Kept, changed (R3-1)**: the Tier 2 → 3 column picks a Tier 3 class from a re-read open set (§4.4.5) |
| **T2W22** | A party ascending together | **Grouped by party, moves with its name; a check line** from the picks ("One healer · 10 of 10 kinds · damage 3 · support 1 · heal 1"), two healers a warning, never a block; **"Suggested for all"** resets the group | A flat list; block two healers; a comp builder on the sheet | Kept; its roles on the forty-two in T2W44 |
| **T2W23** | Umas already in a Tier 2 world at its switch | **Each opens every child of the class she fights as and of every Tier 1 class she has at R50 there, and becomes her class's keeper at its Class Rank;** others at Rank 1; Suggested types and sub-profession; "New: Tier 2 classes"; no forced sheet; her lit steps stay | Open all twenty to them; a forced promotion sheet on the first load | **Kept, changed (R3-4)**: every child, not both |
| **T2W24** | The Tier 2 board | **One board, 36 steps, the same seven tracks and the Rift and the same record positions;** Class, Craft and Stars re-read the new systems; Gear and Weapons read grades whatever form or type; World a won capital run; no track added | Add tracks for forms, types or picks (41–46 steps); a different count a tier; a medal layer now (CO30) | Kept |
| **T2W25** | The Class track from Tier 2 | R10 · R30 · R50 on her best Tier 2 class; IV a Tier 2 class and its sibling at R50; V three Tier 2 classes at R50, any; Tier 1's pace; "Pair at R50" | IV "two Tier 2 classes at R50, any"; V a keeper and an expander of two parents | **Kept, changed (R3-1, R3-4)**: IV read as two classes of one Tier 1 line, the same in Tier 3 (T2W42) |
| **T2W26** | The Craft track from Tier 2 | **Her three Craft Levels add up to 12 · 24 · 36 · 48 · 60:** any split; Craft V 24.9 (even) to 27.8 days (a specialist) against Tier 1's 24.5; "Crafts 36"; the dial 56 | Her best profession at 10 … 50; her Craft EXP in all three; each profession its own steps | Kept |
| **T2W27** | Progress, never a choice | **A step reads progress only; a choice counts only as breadth any option meets equally** (two of one line, three classes, five weapons, three Crafts); no step names a class, type, form, stat or profession; a choice celebrated is CO30's medal | Steps for picks ("wear a Dual"); steps for a named class | Kept |
| **T2W28** | The record and the art | **No new position, no rebake:** every tier keeps the 36 ids and positions; each id's rule is the tier's (read by tier from Tier 2's switch); `windowNext` and the tiles gain "Pair R41/50" and "Crafts 29/36"; the pane map lights 36 as now | A record per tier; a rebake for a new count | Kept (IV pairs by Tier 1 ancestor, T2W42) |
| **T2W29** | The Tier 3 board | Tier 2's board at Tier 3's numbers, 36 with its Rift: Class on Tier 3's classes (R50 also her crown, if classes keeps it there), Crafts to 60, the Tier 3 map, continents 11–15 | A track for the crown or mastery; 35 without a Rift | **Superseded (R3-1)** by T2W43 |
| **T2W30** | The Rift's guidance and tests on the later tiers | **The guidance names the Tier 1 class and any of its line fits;** the fronts' tests ask for the later tiers' tools (Pure types and Momentum on Iron, a Dual's partner and kind rows on Arcane, single-target burst on the Duel, area, multi-hit and wider debuffs on the Horde) | Name the keeper only; name exact classes a front | **Kept, changed (R3-4)**: by Tier 1 line in both tiers (T2W45) |
| **T2W31** | Ascend into Tier 3 | The same sheet, pre-filled with her Tier 2 picks: her class (her open set carrying, assumed; Tier 3's options if classes gives one), weapons and types, sub-profession; forms and picks kept as settings; 3,000 Laurels | No picks into Tier 3; a Tier 3 promotion of its own | **Superseded (R3-1)** by T2W37–T2W39 |
| **T2W32** | A Tier 2 run with round 2 | **A first cohort of twenty working for itself: full windows in about 63.6 days (sub-professions pooled; 111.6 without); forty at work: 31.8, the Rift binding at 33.5 (37.6 at 80%); the fighting party at G10 on day 23.4;** Crafts 60 by 24.9–27.8; the promotion one tap a party (reconciled, XR15) | Tier 1's time with a half step in Tier 2 (T2P41's alternative); tickets flat | Kept |

**Counts:** round 3 adds 14 calls (T2W33–T2W46); it supersedes 2 round-2 calls (T2W29, T2W31) and re-reads 8 (T2W16,
T2W17, T2W18, T2W19, T2W21, T2W23, T2W25, T2W30). Current calls: 13 of round 1 (two superseded by round 2), 15 of round 2,
14 of round 3: **42**.

### 10.3 Where the owner may want to look first

| Call | Why it's worth his eye |
|---|---|
| **T2W37, T2W39** The Tier 3 promotion and its weapons page | The same sheet, his new class pre-filled; but the weapons are the new class's Suggested, not her Tier 2 kit, because gear's coverage fix lives in the Suggested types (gear T2G55); his old kit is the "As in Tier 2" chip |
| **T2W42** Class IV reads "two classes of one Tier 1 line" | In Tier 3 a class has a sibling only on the crosses' lines, so the step names a line; in Tier 2 it reads exactly as round 2's "a class and her sibling" |
| **T2W36** Suggested with her family first | A kin class is Suggested only when nothing of her family stands at R50; round 2's "highest R50 class" tied at Rank 50 |
| **T2W41** Ascending into Tier 3 before its toolbox | Tier 2's release writes her Tier 3 set early, so an Uma who fills a Tier 2 window between the two releases loses nothing; the alternative is a gate |
| **T2W33, T2W38** The open sets 6–20 and 3–22 | Ranking a fourth Tier 1 class before ascending buys two or three Tier 2 classes; into Tier 3 a cross at R50 is worth two cards |
