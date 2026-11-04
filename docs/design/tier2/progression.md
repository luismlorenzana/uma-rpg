# Progression: a Tier 2 run end to end, and how the tiers relate

> **Status: drafting, 2026-11-04. Nothing here is built.** The overview of the Tier 2 and Tier 3 set
> ([the brief](README.md)): how one Uma climbs Tier 1 → 2 → 3, what the Tier 2 and Tier 3 worlds hold, and when each
> system doc's additions land in a run. It starts from Tier 1 as built (engine v21, save v36) and assumes capitals v2
> (save v37, D293) and the honeycomb (save v38, D295) are live before any Tier 2 packet: both are built dark or queued
> today (H159 done; H160–H166 open). Calls are **T2W1–T2W15** ([§10](#10-decisions)), each with a recommendation.
>
> **Absorbs:** [tiers.md](../../archive/design/tiers.md) (T1–T9, archived), [tier2-world.md](../../archive/design/tier2-world.md)
> (Z1–Z10, archived), [the Rift](../rift.md) (R1–R9), [collections](../collections/collections.md) (CO1–CO37),
> [capitals v2](../capitals/capitals.md) (CA1–CA15), [the honeycomb](../world-map/honeycomb.md) (HM1–HM12), the Tier
> rework's tier and pacing frame ([README](../tier-rework/README.md) §2, §9) and [pacing](../pacing.md). Every old call
> has a row in [§3](#3-the-approved-drafts-call-by-call).
>
> **Pages** (desktop, light and dark; every Uma on them is made up):
> [**the tiers**: Tier 1 → 2 → 3, what each adds, Ascend, one Uma across three tiers](previews/progression-tiers.html) ·
> [**the worlds**: Tier 2's and Tier 3's continents, the honeycomb, foes, pay, the Rift](previews/progression-world.html) ·
> [**the run**: a Tier 2 run day by day, her window lighting, the Wilds calculator, 24 parties](previews/progression-run.html).
>
> **Numbers** come from the live code (`packages/domain/src`: `world/`, `rpg/campaign/`, `rpg/windows.ts`,
> `save/rift.ts`, `save/drills.ts`, `save/exchange.ts`, `economy/pacing.ts`), read by a throwaway test that was deleted.
> Where a number is an assumption (fight seconds, the owner's Rift pace), it says so.

## What this doc answers

| The brief asks | Answered in |
|---|---|
| Ascend as it is, and whether the drafts' tier rules still fit | [§2.6](#26-ascend), [§4.4](#44-ascend-into-tier-2) (T2W8, T2W9), [§3.1](#31-tiersmd-t1t9-archived) |
| The Tier 2 world: continents 6–10, lifetime foe levels, regions and capitals by band, with capitals v2 and the honeycomb | [§4.1](#41-the-world-continents-610), [§4.2](#42-foes-lifetime-levels-a-restarted-build) (T2W1–T2W3) |
| The Rift in Tiers 2 and 3; does Tier 3 get one | [§4.5](#45-content-the-campaign-capital-runs-drills-trials-the-rift), [§5.2](#52-its-rift-t2w4) (T2W4, T2W5): **yes** |
| Trials and Drills, windows, Laurels, Speed Tickets and Class Marks by tier | [§4.3](#43-pay-laurels-tickets-class-marks-and-logs), [§4.5](#45-content-the-campaign-capital-runs-drills-trials-the-rift), [§4.6](#46-her-window-in-tier-2) (T2W6, T2W7, T2W10) |
| A Tier 2 run end to end, with pacing: hours to Lv 50, the parallel workforce, 24 parties, ready to Ascend | [§4.8](#48-a-tier-2-run-end-to-end), [§4.9](#49-ready-to-ascend), [§8](#8-pacing) (T2W12) |
| How the six system docs' Tier 2 additions arrive on that timeline | [§4.7](#47-the-toolbox-arrives), [§6](#6-provides-and-assumes) (T2W11) |

## 1. At a glance

**One Uma lives in one tier; a full window ascends her; each tier is its own world, the same shape, restarted.** Tier 2
and Tier 3 run Tier 1's rules × tier today. This set adds a toolbox to each (the six system docs); this doc fixes the
frame they land on.

| | Tier 1 · Apprentice · day | Tier 2 · Adept · dusk | Tier 3 · Master · night |
|---|---|---|---|
| **Continents** | `w1`–`w5`, lifetime Lv 1–50 | `w6`–`w10`, lifetime Lv 51–100, shown "T2 Lv 1–50" | `w11`–`w15`, lifetime 101–150 |
| **A continent** (honeycomb, assumed live) | 48 regions, 576 stages, a capital, 6 Springs | The same | The same |
| **Parties · capital runs a continent** | 24 · six of four parties (16 fights each) | The same | The same |
| **Leans** (T2W2) | Forest, Coast, Desert, Tundra, Haunted Moor (live) | Jungle, Sky Isles, Glacier, Volcano, Underworld | Swamp, Highlands, Geyser Basin, Storm Peaks, Ancient Ruins |
| **Foes** | The build curve from Lv 1 | The curve **restarts** at T2 Lv 1, × 1.8 build (live: Z3, EP16) | Restarts again, × 2.6 |
| **Build values** (gear, stars, signature) | × 1 | × 1.8 | × 2.6 |
| **Laurels a win · region first clear** (Lv 1–40) | 10 · 630 | 20 · 1,260 | 30 · 1,890 |
| **Speed · Sweep Ticket** (T2W10) | 10 · 15 Laurels | **20 · 30** (live: 10 · 15) | **30 · 45** (live: 10 · 15) |
| **Arrives with** | 20 Uma Tickets (the start) | Her purse: **2,000 Laurels** (T2W10; live 1,000) and 5 Speed Tickets; banked EXP as up to 2,000 Class Marks | **3,000 Laurels** and 5 Speed Tickets; Class Marks |
| **Drills · Trials** | Lv 10–50 · Lv 45, 50, 55 | The same, T2 levels | The same, T3 levels; **Trials open** with its Rift (T2W4) |
| **The Rift** | Live | Live; one added test a front (T2W5) | **New (T2W4):** the same shape; it lights her Rift step, nobody ascends from it |
| **Her window** | 36 steps | 36 | **36** (live 35; T2W4) |
| **Ascend** | To Tier 2, one Uma at a time, full window | To Tier 3 | None while Tier 3 is the top tier (T2W14) |
| **What the toolbox adds** | — (Tier 1 as built) | Class branches (T2C), weapon and accessory branches (T2G), a weapon moon (T2E), the secondary profession (T2P), the toolbox term and bosses' shields 9 (T2B), the signature tip (T2U) | Capstones and masteries, Keen · Tempered · Evolved, a second weapon moon, the secondary's Tier 2 work, the tip at both forks, Tier 3's term |
| **A run's clock** (T2W12) | Her own Craft Level: 24.5 days nonstop, 30.6 at 80% | The same | The same |

**A Tier 2 run in one line:** a party of five fights to Lv 50 in about 130 wins (2 to 4½ hours of fights), but its
windows take **about 32 days of the Wilds' work** (40 at 80%), because every Uma's own Craft Level restarts at 1 and
the first cohort's forges reach G10 on day 22.1. The fights are short; the Wilds are the clock, in every tier.

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

### 2.2 Leveling, ranks and pay

| Rule | Value, every tier (EXP is a share of her own tier level, D102) |
|---|---|
| Uma EXP Lv 1 → 50 | 25,480 (120 + 16 × level to next) |
| Class Rank 1 → 50 · 10 → 50 | 25,480 · 23,680, the same curve |
| A win | E Uma EXP, 2E Class EXP to the class she fought as |
| Past the cap | Class EXP banks at half as Class Marks; a Class Manual is 1,000 Marks for 1,000 EXP |
| Laurels a win (regular · sub-boss · vanguard · boss) | 10 · 25 · 30 · 50 × tier; ×3 a first clear, ×4 at tier Lv 41–50, ×1.5 in waves; replays a quarter |
| The Exchange | Raw G1–G5 20, G6–G10 53 Laurels × tier (D264); Speed Ticket 10, Sweep Ticket 15, **flat** |
| Training Log | A third of her next level (Lv 1: 46 · 10: 94 · 30: 200 · 49: 302 EXP), twice that to her class; 147 from Lv 1 to 50 |

### 2.3 The Wilds' clock

| Rule | Value (`economy/pacing.ts`, [loops](../../game/loops.md#craft-level)) |
|---|---|
| Craft Level 1 → 50 | 88,200 Craft EXP, 2 a base minute: 735 base hours, **588 hours of slot time** at the places' ×1.25: **24.5 days nonstop, 30.6 at 80%** |
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

### 2.5 Windows

Every Uma's window a tier ([loops](../../game/loops.md#windows), D283, D289): seven tracks of five steps (Level, Class,
Craft, Gear, Weapons, Stars, World) and the Rift. **36 steps in Tiers 1 and 2, 35 in Tier 3**, because a tier's Rift
step exists only while a tier above exists (`tierHasRift`). Steps latch for good; a full window latches the Rift's
place too, so a full Tier 3 window stays full if a Rift arrives (D284 call 5). Class I reads a Tier 0 at R10 in Tier 1,
a Tier 1 class at R10 later; World n is continent 5(t − 1) + n.

### 2.6 Ascend

One Uma at a time, from the Gallery, once her window is full ([loops](../../game/loops.md#ascend), D283, D288):

| | What happens |
|---|---|
| **She leaves** | The old world's Stable, parties, targets, carried MP, Hall seats and work; a Hero's seat empties. Her grades' made items go back to the old Warehouse; her set jewels are gone |
| **She keeps** | Her class, her accessory slots' families and kinds, her calling; her lower tiers' full windows; her history |
| **She restarts** | Lv 1 (lifetime 51 in Tier 2), Class Rank 1 in every class, weapons, lines and equipped skills at defaults, every grade G0, an empty map, Craft Lv 1, no Bonds |
| **A Tier 0** | Arrives as her suggested promotion (the Warrior a Brawler, the Mage a Sorcerer, the rest by Power and Wit): a later tier has no Tier 0 |
| **The new world gets** | 1,000 Laurels and 5 Speed Tickets an Uma; her EXP banked past Lv 50 as Class Marks, one per 10, at most 2,000 (two Manuals: about Class Rank 10) |
| **Parties** | Five who ascend together move with their party's name; each other Uma takes the first free slot |

### 2.7 Built dark, assumed live before Tier 2

| Piece | What it changes for every tier | State |
|---|---|---|
| **Capitals v2** (D293, save v37) | A capital is runs of four full parties: four lanes of three generals, then four final bosses; 16 fights; her first run of a continent pays full (about 1.3 levels), later a quarter; **World n lights on a won run** | H159 done; H160–H162 open |
| **The honeycomb** (D295, save v38) | 48 regions a continent (24 on the shore at Lv 1–5, 24 inside at Lv 6–10), **24 parties**, six Springs, six run seats, the faces of who claimed and cleared each hex | H163–H166 open |

## 3. The approved drafts, call by call

**Kept** stands as written · **Kept, changed** stands with a change Tier 1's iterations force · **Superseded** a Tier
1 decision replaced it · **Broken** written for a Tier 1 that no longer exists; a new call fixes it. Calls owned by
another doc in the set say which.

### 3.1 tiers.md (T1–T9, archived)

| Call | As approved (D159) | Status | Why |
|---|---|---|---|
| T1 | Nothing else carries across tiers: the account, achievements, her history | **Kept** | The window records (D283) are her history on the account |
| T2 | A tint per tier: day, dusk, night | **Kept** | Built (H36); the window frames use the same colours |
| T3 | Banked EXP past Lv 50 → Class Marks, 1 per 10, at most 2,000 | **Kept** | Built (`bankedMarks`) |
| T4 | Bonds reset; her old seat empties | **Kept** | Built |
| T5 | A purse: 1,000 Laurels and 5 Speed Tickets an Uma | **Kept, changed** | Paid per Uma since Ascend went one at a time (D283); T2W10 makes its Laurels × the tier she arrives in |
| T6 | Option A: a growing toolbox, one battle system | **Kept, changed** | The toolbox's pieces are the system docs' (T2C–T2U) on Classes v3 (D240), three accessory slots and three jewels a rank (D264) |
| T7 | Simplify Tier 1 now, side skills kept until promotion | **Superseded** | Tier 1 was rebuilt (R1, R2), then Classes v3 (D240) reset every class |
| T8 | Twelve advanced classes | **Superseded** | Classes v3 (D240): eight Tier 1 classes in every later tier; the class branches are T2C's |
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
| Z9 | One added test a Rift front: Iron shields +2, Arcane one element a foe, the Duel's boss three acts from stage 9, the Horde 5–7 a wave | **Kept, changed** | The tools they tested (weapon arts, the outer ring) never shipped; **T2W5** re-aims them at today's Tier 2 toolbox |
| Z10 | The Twilight Rift biome shows as Twilight Vale | **Kept** | Never built; it already reads "in every tier", and Tier 1 has shown both names since H50. Ships with the first Tier 2 world packet (checked: no master-data match) |

### 3.3 rift.md (R1–R9)

| Call | As approved (D161) | Status | Why |
|---|---|---|---|
| R1 | The name: the Rift; promoting is Ascend | **Kept** | |
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
| CO2 | Steps latch, through resets, switches and ascensions | **Kept** | |
| CO3 | Dark glass, lead always drawn | **Kept** | |
| CO4 | Outside in, face last | **Kept** | |
| CO5 | The pane map from the bake | **Kept** | |
| CO6 | Tier frames, the Gallery shows her best | **Kept** | Amber in Tier 2, violet in Tier 3 |
| CO7 | The Gallery replaces the Observatory | **Kept** | |
| CO8 | "Weapon Ranks" read as grades | **Kept** | |
| CO9 | Locked outfits shown unlit | **Kept** | |
| CO10 | One pure rule over her state | **Kept** | |
| CO11 | The board: six tracks × five and the Rift, 31 | **Kept, changed** | D289: Weapons is a seventh track, 36 |
| CO12 | Class V: three Tier 1 classes at R50 | **Kept** | Every tier |
| CO13 | Gear: all eleven worn slots | **Kept** | Three accessory slots in every tier (D264), so eleven in every tier |
| CO14 | World n: her party won the capital's three champions | **Superseded** | CA12 (D293): World n lights on a won capital run |
| CO15 | Craft V at Lv 50 | **Kept** | Her own Craft is every tier's clock (T2W12) |
| CO16 | Ascend one Uma at a time, full window | **Kept** | |
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
| CO28 | A full window's reward: Ascend and its frame | **Kept** | In Tier 3, its frame (T2W4) |
| CO29 | No account-wide bonuses | **Kept** | |
| CO30 | Medals later | **Kept** | |
| CO31 | Three buildings for ChatGPT | **Kept** | Published (H156) |
| CO32 | Save v35, one record an Uma a tier | **Kept, changed** | v36 appended Weapons (D289); v37 drops the champions mask (CA12) |
| CO33 | Tier 3: 30 steps until its Rift exists | **Broken** | Written for a 31-step board and a Rift waiting on Tier 3's fifth scenario; D280 shipped the fifth, D289 made it 35, and the code ties the Rift to a tier above: **T2W4** |
| CO34 | Copy through the copy test | **Kept** | |
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
| CA7 | No level gate; one healer a party | **Kept** | |
| CA8 | HP and MP full; the map's fight; no Sweeps | **Kept** | |
| CA9 | Faces fresh each run | **Kept** | From its continent's capital pack (T2W3) |
| CA10 | About 1.3 levels a first run | **Kept** | Tier-relative EXP: the same in every tier |
| CA11 | Her first run of a continent pays full | **Kept** | Laurels × tier, as every map fight |
| CA12 | World n lights on a won run | **Kept** | Every tier (T2W7) |
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
| §2.1 Tiers | 1–3, 50 levels each; one Uma one tier; promotion through the Rift | **Kept** | Through a full window now (D283) |
| §2.1 Pacing | 822 · 856 · 890 hours an Uma; a Tier 1 run of twenty in 15.8 days, Tier 2's in 28.5 | **Broken** | Measured on the ten-place farm before D264 and D289; today a full window is 954 hours and a run's clock is Craft V: **T2W12** |
| §2.2 "A run of twenty" | 24 · 15.8 · 28.5 · 29.7 days | **Broken** | The same: **T2W12** |
| §9 Versions (XC11, D198) | R3 Tier 2's weapons v18 · v29, R4 Tier 2's classes v19 · v30, R5 Tier 3 v20 · v31 | **Broken** | Those numbers went to Tier 1's iterations (engine v21, save v36 live; v37 and v38 taken): **T2W15** |

### 3.8 pacing.md's targets

| Target | Status | Why |
|---|---|---|
| Craft Level is a long loop, about 25 days to Lv 50 (D96) | **Kept** | 24.5 days nonstop in every tier |
| Every step is equal (FL28) | **Kept, changed** | D264: 24 → 16 minutes (the page's 36 → 24 is stale; the manual is right) |
| The trades get the same work (FL9) | **Kept, changed** | D264 makes every line 150 refined an Uma; D289's Weapons track tilts a full window to Metal and Vegetables (250 each): T2P balances it ([§6](#6-provides-and-assumes)) |
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
| collections.md | 37 | 33 | 2 | 1 | 1 (CO33) |
| capitals.md | 15 | 14 | 1 | 0 | 0 |
| honeycomb.md | 12 | 12 | 0 | 0 | 0 |
| The rework's frame | 4 | 1 | 0 | 0 | 3 (§2.1 pacing, §2.2, §9) |
| pacing.md | 7 | 4 | 3 | 0 | 0 |
| **All** | **103** | **77** | **15** | **6** | **5** |

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
term, weaknesses, shields).

| Tier level | Tier 1: HP · DEF · ATK | Tier 2 | Tier 3 | Build budget, HP and DEF (every tier) | Offense budget |
|---|---|---|---|---|---|
| Lv 1 | 132 · 18 · 67 | 466 · 81 · 233 | 800 · 145 · 398 | 1.00 | 1.00 |
| Lv 10 | 268 · 31 · 129 | 715 · 96 · 344 | 1,162 · 161 · 559 | 1.06 · 1.03 · 1.03 | 1.02 · 1.01 · 1.01 |
| Lv 25 | 760 · 68 · 210 | 1,520 · 147 · 435 | 2,287 · 227 · 660 | 1.41 · 1.32 · 1.29 | 1.12 · 1.09 · 1.08 |
| Lv 40 | 1,939 · 140 · 319 | 3,446 · 262 · 576 | 4,957 · 384 · 833 | 2.09 · 2.00 · 1.98 | 1.31 · 1.29 · 1.28 |
| Lv 50 | 3,388 · 217 · 414 | 5,859 · 390 · 709 | 8,327 · 564 · 1,005 | **2.72** in all three | **1.49** |

- **A fresh party meets a fresh build:** a Tier 2 Lv 1 foe has about 3.5 times Tier 1 Lv 1's HP, against her lifetime-51
  stats, G0 gear and an empty map, as tier2-world §5 measured (engine v13: all 40 opening stages won, 4.7 rounds against
  Tier 1's 6.8). T2B re-measures on engine v21.
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

- **Why × tier:** raw items and sales are × tier so a Laurel buys the same work (PP17; the secondary has no fee, T2P14); the tickets
  were left flat, so today a Tier 2 fight buys twice the job time a Tier 1 fight does, and Tier 3 three times. Making
  them × tier keeps the owner's "the rate of progression is fine as it is" in every tier. **The alternative** (keep
  them flat) eases the Wilds' clock in later tiers through Laurels; it's the first knob if Tier 2 plays slow.
- **Laurels never run short:** the purse and the first wins cover the first raw items (a party's G1 kit is about 375
  raw items if bought, 15,000 Laurels in Tier 2; gathered, it's the Wilds' first day).

### 4.4 Ascend into Tier 2

Ascend as built fits the drafts: one Uma at a time, a full window, the same arrival. **T2W8 adds one rule for the
toolbox: settings carry, progress restarts.**

| Piece (assumed shape, by doc) | On Ascend | Why |
|---|---|---|
| Her class (live) | Carries | Live rule |
| **Her class branch** (T2C: focus, default or reverse set) | **Carries**, per class | A free setting, like her accessory families; nothing to re-earn |
| Class skills, branch C, tips, the ★ signature tip (T2C, T2U) | Back to defaults with her trees | Tree picks restart with Class Rank 1 |
| Weapon branches, Pure · Dual (T2G) | **Carry** with the weapon kind; its grade resets to G0, and at G1–G4 the branch works at its Tier 2 rate (T2G17) | The owner's WP11 and WP34: branches carry, grades reset |
| Accessory families and kinds (live) · forms past the base (T2G) | Carry · **carry** (T2G17) | Live rule; a form is a setting of the slot (T2G9) |
| The weapon moon's setting, Full or Split and its kinds (T2E) | **Carries**; its nodes restart with the map | A setting; nodes are jewels |
| The secondary profession (T2P) | Cleared, free to pick in the new tier | PP14 |
| Craft Level, Bonds, Hall seats, grades, nodes (live) | Restart | Live rule |

**T2W9: the first five.** A world fights only with five. Ascend's sheet says so when the ticked Umas would leave the new
world under five ("3 of 5 to fight in Tier 2"), so a first ascent tends to go a party at a time, and the party keeps its
name. No rule changes: one Uma may still go alone, and she works the Wilds from her first minute (every trade with no Uma
there is an open shop).

### 4.5 Content: the Campaign, capital runs, Drills, Trials, the Rift

| Content | Tier 2 | Opens |
|---|---|---|
| **The Campaign** | 240 regions, 24 a band a continent, each party its own | From arrival |
| **Capital runs** | Six a continent, 16 fights each, at T2 Lv 10 · 20 … 50; a first run pays about 1.3 levels to each of its twenty and triple Laurels × 2 | Any four full parties |
| **Drills** (T2W6) | T2 Lv 10 · 20 · 30 · 40 · 50 on `w6`–`w10`; 2–6 Logs a win; ten runs a day, banked to thirty; the Logs are the world's | The tier's first map win |
| **Trials** (T2W6) | Each front at T2 Lv 45 · 50 · 55 (lifetime 95 · 100 · 100 at ×1.22); Class EXP 652 · 1,300 · 1,300 a win | With the Rift: five T2 Lv 50 Umas |
| **The Rift** (T2W5) | Four fronts at T2 Lv 50 on the tier's budget, the Convergence; Tier 2's own seals and Rift Conquered · Tier 2 (live ids); **one added test a front** | Five T2 Lv 50 Umas; twenty sign up |

**T2W5: the fronts' added tests,** Z9's, aimed at the toolbox Tier 2 now has. Each tier's numbers are T2B's, against
rift.md §11's targets (the right party ≥ 80% a stage and 60–70% a champion, the wrong one ≤ 30% and ≤ 10%, the
Convergence about 50%).

| Front (guided by family, CV23) | Its added test in Tier 2 | What it asks of the Tier 2 toolbox |
|---|---|---|
| **Iron** (the Warrior side) | Shields 2 over Tier 1's; foes weak to one or two Arms | Pure's ×1.5 on a weak hit (T2G), Break tips (T2C), the Ring focus on Arms (T2C) |
| **Arcane** (the Mage side) | One element a foe: a stage's leaders weak to one, its guards to another | A Dual's partner and a Split weapon moon (T2G, T2E): two answers on one slot |
| **Duel** (the Spellblades) | Her boss acts three times from stage 9 | Single-target burst: Pure, a Full weapon moon, the focus |
| **Horde** (the Summoners) | Five to seven foes a wave | Areas: branch C's Wide and Sweep (T2C), the Light/Dark focus's many-hit kinds |

- **The guidance stays by family** and names each member's class branch when T2C's branches ship (a guided Brawler on Iron
  is a Ring Brawler).
- **The faces:** the cross-pack picker prefers faces the account hasn't defeated; the Bestiary counts every tier.

### 4.6 Her window in Tier 2

**T2W7: one board, 36 steps in every tier, read at the tier's numbers.** No new track for the toolbox: its pieces fill
the tracks that exist.

| Track | Tier 2's steps | Note |
|---|---|---|
| Level | T2 Lv 10 · 20 · 30 · 40 · 50 | |
| Class | A Tier 1 class at R10 · R30 · R50 · two at R50 · three at R50 | No Tier 0 above Tier 1 (CV10). With 2,000 Marks banked (20,000 EXP past Lv 50), her two Manuals light Class I on her first day |
| Craft | Craft Lv 10 · 20 · 30 · 40 · 50 | The clock (T2W12) |
| Gear | All eleven worn slots at G2 · G4 · G6 · G8 · G10 | Three accessory slots in every tier (D264) |
| Weapons | Five weapon kinds at G2 … G10 | |
| Stars | **Every node to I · II · III · IV, then the whole map: 5 · 11 · 16 · 22 · 27** | The weapon moon (T2E) is a body like the others: it counts. Live: 4 · 9 · 13 · 18 · 22 |
| World | Continent 6 · 7 · 8 · 9 · 10: **a won capital run** (CA12) | |
| Rift | On a won Tier 2 Rift run | |

### 4.7 The toolbox arrives

**T2W11: no new gates.** Every Tier 2 addition opens on a gate its system already has (Class Rank, a grade's Uma and
Craft Level, a node's jewel and level), so nothing waits on a day, a quest or an unlock of its own. The days are a first
cohort's, nonstop, the fighting party served first ([§4.8](#48-a-tier-2-run-end-to-end)); the shapes are the drafts', as
§6 assumes.

| Addition | Doc | Gate | First cohort, day (80%) | Her level then |
|---|---|---|---|---|
| Class branch: a focus (+15% on its group's kinds), default or reverse set | T2C | Tier 2, any Class Rank | 0 | Lv 1 |
| Three weaknesses at every rank (live, D235); the toolbox term rising to Lv 50 | T2B | Tier 2's foes | 0 | Lv 1 |
| Skill MP ×1.7 | T2C, T2B | Every Tier 2 skill | 0 | Lv 1 |
| The secondary profession | T2P | Tier 2 | 0 | — |
| Three class skills | T2C | Class Rank 20 · 30 · 40 | 1 · 1 · 2 | Lv ~13 · 20 · 27 |
| Branch C; the Power or Break tip fork | T2C | Depth 3 (CR 20) · depth 5 (CR 40) | 1 · 2 | Lv ~13 · 27 |
| ★ Signature tip on her lead weapon's tree | T2U | Its tip fork, depth 5 (CR 40) | 2 | Lv ~27 |
| Weapon moon I → V | T2E | One Planet Jewel each, on the Planet's ranks (the Planet takes one fewer, T2E2), set at Uma Lv 1 · 11 · 21 · 31 · 41 | No extra Stone (T2P7) | Lv 1 → 41 |
| Weapon branch, Pure or Dual | T2G | A weapon's G5: Craft 21, Uma Lv 21; its own G5 Arms Gem or Tome Ink sets the branch, no Branch Gem (T2G4, T2P5) | 8.8 (11.0) | Lv 21 |
| Accessory branches | T2G | A slot's G5 | 8.8 (11.0) | Lv 21 |
| The secondary profession | T2P | From Tier 2: one other line's three places, G1–G8 (G9–G10 stay its trade's, T2P12–T2P13); the same fifty material pairs in every tier (T2P3) | From Lv 1 | — |
| LB+ at Bond 10 | T2C | Bond 10 in a hall | With Bonds, not days | — |
| Ten equipped skills | T2C | Uma Level (+1 a five levels, tiers.md's draft) | about 5 | Lv 35 |

### 4.8 A Tier 2 run end to end

**A model, not a measurement.** A first cohort of twenty arrives together (four parties of the release's mix); the
Wilds work nonstop; the fighting party is served first; its fights climb two bands a day while gear allows and its
Lv 41–50 bosses wait for G5 (tier2-world §11's measurement on engine v13: G3 won 15% of T2 Lv 50 bosses, G5 90%; T2B
re-measures); the Rift's fronts start when G8 opens and take 2–3 weeks of the owner's play (rift.md §11). The model's
rule for her window: Level IV and V wait for G4 and G5; a Stars step lands half a day after its grade opens, a Gear step
a day (the party's kit is 5 hours of the slots a grade), a Weapons step after its Gear step, Weapons V three days after
G10. The [run page](previews/progression-run.html) draws the same model, with an 80% toggle. Days are nonstop; the
Wilds' days at 80% are in brackets.

| Day | The fighting party | The Wilds (the first cohort's Craft) | Her window (of 36) |
|---|---|---|---|
| **0** | Arrive: 40,000 Laurels and 100 Speed Tickets for twenty (T2W10); class branches set; `w6`'s shore; the Exchange stocks G1–G5 after the first win; Drills open; capital run 1 | Craft 1, G1 only; secondaries picked (T2P) | Level I, Class I, World I: **3** |
| **1** | Lv 20 (`w7`), capital run 2; class skills open | | Level II, Class II, World II: **6** |
| **2** | Lv 30 (`w8`), capital run 3 | G2 opens (2.0 [2.6]); weapon moon I | Level III, World III: **8** |
| **3** | Class Rank 50 on her first class | Stars I, Gear I for the party | Class III, Stars I, Gear I: **11** |
| **4** | | Craft I (3.8 [4.7]) | Weapons I, Craft I: **13** |
| **7** | Lv 40 (`w9`), capital run 4 | G4 opens (6.4 [8.0]) | Level IV, World IV, Stars II: **16** |
| **8** | | Craft II (8.3 [10.4]) | Gear II, Weapons II, Craft II: **19** |
| **9** | Lv 50 (`w10`), capital run 5; five Lv 50 Umas: the Rift and Trials open | G5 (8.8 [11.0]): weapon and accessory branches, Tier 2's pair | Level V, Class IV, World V: **22** |
| **11** | Twenty Trial wins at T2 Lv 50: her third class to R50 | | Class V: **23** |
| **12** | Four parties at Lv 50: twenty sign up for the Rift | G6 (11.3 [14.1]) | Stars III: **24** |
| **14** | | Craft III (13.3 [16.6]) | Gear III, Weapons III, Craft III: **27** |
| **17** | The Rift's fronts start on curve | G8 (16.5 [20.6]) | Stars IV: **28** |
| **19** | | Craft IV (18.7 [23.4]) | Gear IV, Weapons IV, Craft IV: **31** |
| **24** | | G10 (22.1 [27.7]) | Stars V, Gear V: **33** |
| **25** | | Her Craft V (24.5 [30.6]); the party's two extra weapons at G10 | Craft V, Weapons V: **35** |
| **31–37** | The Rift won | The twenty's last full windows (31.8 [39.8]) | Rift: **36, ready to ascend** |

- **The fights take hours, the run takes weeks.** The party's climb is about 130 wins; the Rift about 58 fights; its
  third class 20 Trials. Everything else is the Wilds.
- **Later cohorts go faster:** they arrive in a world whose crafters already make G10, so their gear waits on the slots,
  not on Craft; their own Craft V (24.5 days) stays the floor.

### 4.9 Ready to ascend

The last steps, in the order they usually fall:

| Last steps | Typical day (nonstop · 80%) | What moves it |
|---|---|---|
| Gear V, Stars V | 23 · 28 | The makers' Craft 46 (G10); then the slots |
| Craft V | 24.5 · 30.6 | Her own work only; Speed Tickets fast-forward her jobs (CO15) |
| Weapons V | 25 (the party) to 32 (the twenty) · 31 to 40 | Metal and Vegetables: two extra weapons an Uma (D289) |
| The Rift | 31–37 | The owner's play: a run of twenty, about 58 fights |

So **a Tier 2 Uma is ready about five weeks after she arrives**, as in Tier 1. She can't be earlier than her Craft V
(day 24.5) and the Rift's win.

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
Tier 2's four added tests (T2W5) at T2B's Tier 3 numbers.

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

Tier 3's additions, assumed from the drafts; each opens on its system's own gate (T2W11).

| Addition | Doc | Gate |
|---|---|---|
| The crown (every held capstone at 5.6, T2C20) and the family's mastery (T2C22) | T2C | Class Rank 50 |
| Keen, Tempered or Evolved | T2G | A weapon's G5 in Tier 3 |
| Accessory branches a step deeper | T2G | A slot's G5 |
| A second weapon moon (Full + Split serve her three weapons) | T2E | Planet Jewels on the Planet's ranks, as Tier 2's (T2E2) |
| The secondary, as Tier 2's (T2P23) | T2P | Nothing new |
| The ★ tip on both held lines of her lead tree (T2U13) | T2U | Depth 5, Class Rank 40 |
| Tier 3's term (HP and DEF ×1.08 → ×1.48, offense +10%, bosses ×1.1); bosses' shields 10; skill MP ×2.4 | T2B, T2C | Tier 3's foes and skills |

### 5.4 Her window

36 steps (T2W4, T2W7). **Stars: every node to I · II · III · IV, then the whole map: 6 · 13 · 19 · 26 · 32**, two
weapon moons counted. World I–V: continents 11–15, a won capital run each.

### 5.5 The end of the climb (T2W14)

**Tier 4 stays closed.** A sixteenth scenario shows "Tier 4 locked" (D280) and joins no world until the owner opens Tier
4; until then nobody ascends from Tier 3 and its Rift step only completes her window. When Tier 4 opens, its world takes
this doc's Tier 2 shape, and Tier 3's full windows (Rift step lit) are ready to ascend into it at once.

## 6. Provides and assumes

**What this doc provides** (other docs read these from it):

| To | What | Call |
|---|---|---|
| All six | The run's timeline: when each addition lands by day and level; no new gates | T2W11, §4.7 |
| All six | Ascend: settings carry, progress restarts; the first five | T2W8, T2W9 |
| All six | Tier 3 has a Rift and Trials; Tier 4 stays closed | T2W4, T2W14 |
| T2P | **The demand a full window makes:** 950 refined items an Uma (Metal and Vegetables 250 each on average, Wood, Fish and Stone 150), 954 hours at Craft Lv 25; and **the target:** a party's windows in about 32 days nonstop, a first run of twenty in about 32, a 24-party world's in about 64 ([§8](#8-pacing)) | T2W12 |
| T2P | Tickets × tier, so the Exchange reads one rule (T2P19 follows) | T2W10 |
| T2E | The Stars track counts every body, the weapon moons included: 27 nodes in Tier 2, 32 in Tier 3 | T2W7 |
| T2B | The fronts' added tests per tier; Tier 3's Rift to tune; the leans and packs a tier's generator reads | T2W2–T2W5 |
| T2C | The Rift's guidance names each member's class branch; her class branch carries on Ascend | T2W5, T2W8 |
| T2U | Her signature tip resets with her trees on Ascend | T2W8 |

**What this doc assumes** (the drafts' shapes, written now in parallel; the cross-reference pass checks them):

| From | Assumed | Used in |
|---|---|---|
| **T2C** (classes) | Class branches from Tier 2: one of two a class, a focus (+15% on its weapon group's kinds) with a default or reverse set, swapped freely; three class skills at Class Rank 20, 30, 40; branch C and a Power or Break tip fork; ten equipped skills; LB+ at Bond 10; skill MP ×1.7 (Tier 3 ×2.4); Tier 3's capstone at depth 6 (CR 50) and a mastery (CP19, CP20, CP26, CP27) | §4.4, §4.7, §5.3 |
| **T2G** (gear) | Weapon branches at a weapon's G5 in Tier 2 (Pure or Dual, a fixed partner), Tier 3's step at G5 (Keen, Tempered, Evolved); accessory forms at a slot's G5; three slots every tier; no Branch Gem, the G5 item sets the branch (T2G4); branches and forms carry on Ascend (T2G17) (WP6–WP9, WP34, D264) | §4.4, §4.7, §5.3 |
| **T2E** (extra stats) | A weapon moon in Tier 2, five nodes on one Planet Jewel each at the Planet's ranks (T2E2), Full or Split, a setting; a second in Tier 3; her moon still opens with the three shared moons' II and IV (EP24–EP26) | §4.6, §4.7, §5.4 |
| **T2P** (professions) | Craft Level restarts at 1; amounts don't scale (PP11); the secondary from Tier 2, one other line's three places at G1–G8, cleared on Ascend, free to change (T2P12–T2P14); no tier pairs, the same fifty in every tier (T2P3) | §4.4, §4.7, §8 |
| **T2B** (balance) | Z3's restart kept; the toolbox terms SB3–SB5; three weaknesses at every rank in Tiers 2 and 3 kept as live (WK8, D235); bosses' shields 9 and 10 (SB6); the fronts' numbers per tier | §4.2, §4.5, §5.2 |
| **T2U** (templates) | The ★ signature tip on her lead weapon's tree from Tier 2 (its tip fork), at both forks in Tier 3 (UT9); the signature and her moon × tier (live) | §4.7, §5.3 |

## 7. Save and engine

Roughly, not packets. **T2W15: the world goes first on today's engine, then the toolbox as one release a tier.**

| Step | What changes | Engine · save |
|---|---|---|
| 0. Before | Capitals v2 and the honeycomb live (H162, H166) | — · v37, v38 |
| 1. The Tier 2 and 3 worlds | Leans and packs by tier (T2W2, T2W3, generator data under its guard); the fifteenth Finals (T2W13, data); Twilight Vale (Z10, a label); tickets and the purse × tier (T2W10, Exchange and Ascend rules); the Ascend sheet's five line (T2W9, a screen) | None: fights replay from their frozen inputs and these are generators and rules, as D293 reasoned |
| 2. Tier 3's Rift | `RIFT_TIERS` gains 3; Tier 3's five achievements; `tierHasRift` splits into "has a Rift" (every tier) and "has a tier above" (Ascend's block); Trials open in Tier 3; the board 36 everywhere (T2W4) | None, or a small save step if the parse needs the new achievement ids |
| 3. The Stars track by tier | The rule counts the tier's whole map (T2W7); lands with the weapon moon | With T2E |
| 4. Tier 2's toolbox | T2C, T2G, T2E, T2P, T2B, T2U, dark behind one Tier 2 switch, as Classes v3 shipped | **engine v22, save v39** (D198's R3–R4 numbers are taken) |
| 5. Tier 3's toolbox | The same, Tier 3's pieces | engine v23, save v40 |

The record of a window keeps its 36 positions in every tier, the Rift's included, so step 2 moves nothing in it.

## 8. Pacing

Every number below is nonstop work at Craft Lv 25's step (20.1 minutes) and the places' ×1.25, from the live code; ×1.25
for a player who keeps the slots 80% busy. **T2W12: a Tier 2 or 3 run takes Tier 1's time, and her own Craft Level is
its clock.**

### 8.1 One Uma

| Measure | Value, every tier |
|---|---|
| Uma Lv 1 → 50 | About 130 wins with her party (25,480 EXP), or 147 Training Logs (2½ days of Drill V's runs) |
| Class IV (two classes at R50) | Her campaign's Class EXP (about 51,000): two classes, switching at R50 |
| Class V (a third) | 20 Trial wins at Lv 50 (40 at Lv 45), or 26 Manuals |
| Her own Craft V | 588 hours of her slot: **24.5 days nonstop, 30.6 at 80%** |
| Her full window's work | 950 refined, 763 hours of slot time, done by the roster |

### 8.2 A party of five

| Measure | Value |
|---|---|
| Fights to Lv 50 | **132 wins**: Lv 50 comes at win 132 of its 140-fight path (ten regions' first clears and five capital lanes) with one replay; **1.9 hours** at the ledger's seconds (40 a regular, 70 an elite or a general, 100 a boss), **4.4 hours** at two minutes a fight |
| One grade of the party's kit | 375 refined items: 5 hours of all 60 slots, 25 of one trade's 12 |
| Full windows, one Uma of each trade, today's rules | **41.8 days**: Metal and Vegetables carry 250 an Uma for Weapons V; the other three lines 25.1 |
| The same with the secondary pooling the lines (T2P) | **31.8 days** nonstop, **39.8** at 80%; the floor is Craft V's 24.5 |

### 8.3 A run of twenty

The release's mix: Metal 4, Wood 5, Stone 5, Fish 3, Vegetables 3.

| Demand | Each trade alone (Metal · Vegetables · Wood · Fish · Stone) | Bound | Pooled (the secondary) |
|---|---|---|---|
| Eleven slots and the map | 25.1 · 33.5 · 20.1 · 33.5 · 20.1 days | Vegetables and Fish, 33.5 | 25.1 |
| The full window (Weapons V) | 41.8 · **55.8** · 20.1 · 33.5 · 20.1 | Vegetables, 55.8 | **31.8** |

- **Without the secondary a thin trade binds** (three Healers make every Tome's ink for twenty); with it, a run is bound
  only by its own hours. Speed Tickets close what's left: Vegetables' gap to 31.8 days is about 1,730 hours, 3,460
  tickets, 69,000 Laurels at T2W10's price: most of the four parties' campaign Laurels (83,100).

### 8.4 Twenty-four parties at tier scale

The honeycomb's full world: 120 Umas, 60 slots (the release's mix, every trade over twelve).

| Measure | Value |
|---|---|
| Fights | 24 × about 140 (each party its regions and capital lanes): **3,360**, about 45 hours at the ledger's seconds, 110 at two minutes |
| Capital runs | Six a continent, 30 a tier (480 fights): every Uma's World I–V |
| Rift runs | Six (about 350 fights): every Uma on a won run |
| Trials | 20 wins a party, 480 (sweepable) |
| The Wilds: every window, pooled | **63.6 days** nonstop, 79.5 at 80% |
| The Wilds: today's rules, no secondary | 83.7 days (Metal and Vegetables bind at twelve slots each) |
| Each Uma's own Craft V | 49 days: 120 Umas share 60 slots |

**The parallel workforce:** one party fights at a time, an hour or two a day, while sixty Umas work around the clock. The
fights are a few percent of a tier's time; the Wilds are the rest. That is the owner's play pattern, and why the clock
is Craft, not levels: the roster's forges gear a party a grade in five hours once its makers' Craft allows it.

### 8.5 Across three tiers

| One Uma | Tier 1 | Tier 2 | Tier 3 | In all |
|---|---|---|---|---|
| Window full, first cohort (nonstop · 80%) | ~32–37 · ~40 days | ~32–37 · ~40 | ~32–37 · ~40 | **About 3 to 4 months** |
| Bound by | Craft V, Weapons V, the Rift | The same | The same (its Rift, T2W4) | |

## 9. Previews: carried and retired

| Page | What it holds | Carries |
|---|---|---|
| [progression-tiers.html](previews/progression-tiers.html) | Tier 1 → 2 → 3 side by side; what each tier adds, by doc; Ascend's carry and restart; one made-up Uma across three tiers; how the counts grow; the old calls' status | [character-tiers.html](../tier-rework/previews/character-tiers.html)'s one-Uma board (its per-cell stat values move to the system docs' pages); [progression.html](../tier-rework/previews/progression.html)'s tier columns and "how the counts grow" |
| [progression-world.html](previews/progression-world.html) | Tier 2's and Tier 3's continents; the honeycomb by band; foes by tier level; pay by tier; the Rift, Trials and Drills by tier | — (new) |
| [progression-run.html](previews/progression-run.html) | A Tier 2 run day by day; the window lighting; the Wilds calculator (cohort, uptime, demand, the secondary); 24 parties | [progression.html](../tier-rework/previews/progression.html)'s roadmap ("what unlocks when") and "pace holds" |

**Retired:** progression.html's "how it ships: five live releases" (D198's R3–R5 numbers are taken, §3.7), "choices a
player owns" and "Tier 1: today vs approved" (Tier 1 is built; the system docs count their own choices).
character-tiers.html's stat cells (every system doc draws its own Tier 1 → 3 page).

## 10. Decisions

Every new call, with its recommended answer.

| Id | Call | Recommended |
|---|---|---|
| **T2W1** | The Tier 2 world's shape | **Tier 1's on continents 6–10, with capitals v2 and the honeycomb live first:** 48 regions, 24 parties, six Springs, six capital runs a continent; no Tier 2 world packet before H162 and H166 |
| **T2W2** | Continent leans by tier | **Tier 2 Jungle, Sky Isles, Glacier, Volcano, Underworld (Z1); Tier 3 Swamp, Highlands, Geyser Basin, Storm Peaks, Ancient Ruins**; a tier's leans change only while no world of it holds a won stage |
| **T2W3** | Face packs by tier | **Tier 1's totals, arranged anew each tier:** Tier 2 Z7's (the middle pack opens it, the small returns twice, the large closes it); Tier 3 a third (the small holds `w13` whole) |
| **T2W4** | Does Tier 3 get a Rift | **Yes:** the same shape at T3 Lv 50, its own seals and Rift Conquered · Tier 3, the Rift step (every board 36), Trials with it; nobody ascends from it while Tier 3 is the top tier: a full Tier 3 window is the end of her collection, in its violet frame |
| **T2W5** | The Rift's fronts in Tiers 2 and 3 | **Z9's one added test a front, re-aimed at today's toolbox** (Iron shields +2 and one or two Arms; Arcane one element a foe, leaders and guards apart; the Duel's boss three acts from stage 9; the Horde five to seven a wave); Tier 3 keeps them; T2B sets each tier's numbers; the guidance names each member's class branch |
| **T2W6** | Trials and Drills by tier | **Unchanged in every tier:** Trials at the tier's Lv 45, 50, 55, opening with its Rift; Drills at its Lv 10–50, 2–6 Logs, ten runs a day banked to thirty, opening with its first map win; Logs and Marks stay in their world |
| **T2W7** | Windows by tier | **One board, 36 steps in every tier**; Class I a Tier 1 class at R10 from Tier 2; World n a won capital run; **the Stars steps count the tier's whole map, weapon moons included** (Tier 2: 5 · 11 · 16 · 22 · 27; Tier 3: 6 · 13 · 19 · 26 · 32); no new track |
| **T2W8** | Ascend with a toolbox | **Settings carry, progress restarts:** her class and its class branch, her accessory families, kinds and forms, her weapon branches (with T2G17: at G1–G4 a carried branch works at its Tier 2 rate) and her weapon moon's setting carry; grades, nodes and tree picks restart; the secondary is cleared (reconciled with T2G17) |
| **T2W9** | Ascending into an empty world | **The Ascend sheet says when the new world would hold fewer than five** ("3 of 5 to fight in Tier 2"); no rule change |
| **T2W10** | Prices by tier | **Speed and Sweep Tickets × tier** (20 · 30 in Tier 2, 30 · 45 in Tier 3) **and the purse's Laurels × the tier she arrives in** (2,000, 3,000), so a Laurel buys the same time in every tier; Marks, Manuals and Logs untiered |
| **T2W11** | When the toolbox opens | **No new gates:** every Tier 2 and 3 addition opens on its system's gate (Class Rank, a grade's levels, a node's jewel and level) |
| **T2W12** | A run's pacing target | **Tier 1's time, her Craft the clock:** a party's windows in about 32 days nonstop (40 at 80%), a first run of twenty in about 32 with the secondary, a 24-party world's Wilds in about 64; fights about 130 wins a party; T2P meets the full window's 950 refined items |
| **T2W13** | The fifteenth scenario's capital | **Its own four authored Finals routes** (original names, checked against the release), with Tier 3's world packets |
| **T2W14** | A sixteenth scenario | **Tier 4 stays closed:** it shows "Tier 4 locked" and joins no world until the owner opens Tier 4; Tier 3's Rift step completes her window only |
| **T2W15** | The version plan | **The worlds first on today's engine** (leans, packs, prices, Tier 3's Rift), **then the toolbox as one release a tier:** Tier 2 at engine v22 and save v39, Tier 3 at v23 and v40, each dark behind its switch |
