# Game loops

What the player does, what it pays and what it costs, as the game runs on engine v18 and save v31. Numbers come from the
code: generated tables between `live` markers, the rest checked against `packages/domain/src/economy/`, `items/`,
`work/`, `save/`, `rpg/campaign/rewards.ts` and `rift/`. A tier's next world opens when the Rift below it ascends twenty
Umas ([the Rift](#the-rift); the page is in [sections](sections.md#the-rift)).

## The loop

```
 Uma Tickets ─► unlock Umas ─► build parties ─► fight ─► Uma EXP · Class EXP · Laurels · Uma Shards
      ▲                                                     │           │          │          │
      └──────────────── five Uma Shards (Tier 1) ◄──────────┼───────────┼──────────┼──────────┘
                                                            │           │          ▼
           Uma Level: stats, skill slots, gear gates ◄──────┘           │    the Exchange: raw materials,
           Class Rank: deeper skills, Skill Ranks ◄─────────────────────┘    Speed and Sweep Tickets
           past Rank 50: Class Marks ─► Class Manuals                              │
                                                 ┌─────────────────────────────────┘
                                                 ▼
           the Wilds, a row a line:  gather ─► process ─► make (Arms Gems, Tome Ink, Armor Fittings,
                                                           │    Accessory Settings, Planet and Moon Jewels)
                                                           ▼
                           grades raised, Extra Stats nodes opened ─► a stronger party fights higher levels
```

Fights are active play. Everything else is jobs that run in real time, offline included, and pay when collected. Each
tier's world keeps its own Umas, wallet, Warehouse and work.

## Collection and parties

- **Start:** Tier 1's world starts with 20 Uma Tickets and no Umas. One Ticket unlocks one outfit, for good; an outfit
  lives in one world at a time (`unlockUma`).
- **Uma Shards (Tier 1 only):** an Uma earns one at Lv 10, 20, 30, 40 and 50, from fights and Sweeps alike. Five Uma
  Shards make a Ticket automatically, so every Uma who reaches Lv 50 pays back one Ticket. A Tier 2 world starts with no
  Tickets and pays no Shards: its Umas are the ones who ascend into it.
- **Parties:** 20 parties of 5. An Uma belongs to at most one party; adding her to another moves her.
- **Active party:** the one that fights, sweeps and drinks at Springs. You can switch any time no fight is open. A fight
  needs all five slots filled; Umas at work fight too (D119).
- **Classes:** switching is free. A new Uma starts in her **calling**, and her armor's half is her class's, magical for a
  Mage, Cleric or Summoner ([classes](classes.md#her-calling-and-her-template)). A Pace or Late Uma picks once between
  her two callings, and her first win confirms it; the pick waits while she works ("Finish her work first"), because it
  moves her trade ([Craft Level](#craft-level)). A party fights with one healer, a Paladin or a Cleric, at most.

## Leveling

<!-- live:levels -->
| Level | Uma EXP to next | Craft EXP to next |
|---|---|---|
| 1 | 136 | 1440 |
| 8 | 248 | 1545 |
| 15 | 360 | 1650 |
| 22 | 472 | 1755 |
| 29 | 584 | 1860 |
| 36 | 696 | 1965 |
| 43 | 808 | 2070 |

Uma EXP to next level: 120 + 16 × level, up to Lv 50. A stage pays its weight × her own EXP to next level, −10% per level she's above the foes (down to 10%), never more than 100%. Uma Shards at Lv 10, 20, 30, 40, 50. Craft EXP to next: 1,425 + 15 × level; jobs pay 2 EXP per base minute of work, so a level takes 12 base hours at Lv1 and 18 at Lv49.
<!-- /live -->

- Level cap 50. At Lv 50 EXP keeps banking; when she ascends, every 10 banked EXP becomes a Class Mark in the new world,
  2,000 at most ([the Rift](#the-rift)).
- Every entrant is paid, knocked out or not.
- **Uma EXP is never sped up (D102):** a stage pays a share of **her own** level, so a Lv 1 Uma in a Lv 40 fight still
  gains about a third of a level. Fighting below her level pays less; above it, no more.
- A regular stage at her level pays about a third of a level: about three fights a level-up. A region's twelve first
  clears carry a party across its five levels, a little short of the next region's first level (D97). A capital's Finals
  pay half their EXP ([maps](maps.md)).
- **Her Uma Level** sets her stats, her skill slots (3 → 7), the grades her gear can reach (Lv 5g − 4) and the Extra
  Stats nodes she can open. Skills open with **Class Rank** ([ranks](#ranks)).

## Ranks

One bar a class (D102; [classes](classes.md#ranks-and-levels) for what it opens). Weapon, Armor and Accessory Ranks and
Gear Marks retired with R2 (WP3, D218):

<!-- live:ranks -->
| Bar | Ranks | Per win worth E Uma EXP | Opens |
|---|---|---|---|
| Class Rank, per class | 1–50 | 2E to the class she fought as | Its trees' depths at 1, 10, 20, 30, 40; ranks every skill she holds, a Skill Rank every 2 Class Ranks up to 5 |

| Class Rank | EXP to next |
|---|---|
| 1 | 136 |
| 10 | 280 |
| 20 | 440 |
| 30 | 600 |
| 40 | 760 |
| 49 | 904 |

Past the max rank, EXP banks at 50% as Class Marks. A Class Manual costs 1,000 Class Marks and gives 1,000 EXP to one class of one Uma. Gear has no ranks: a slot's grade is what she wears ([materials](materials.md#gear)).
<!-- /live -->

- **What a win pays,** for `E` Uma EXP: 2E to the class she fought as. A Sweep pays the same, an Echo twice
  ([the Rift](#the-rift)).
- **A campaign** (about 120 first clears) takes one Uma to Lv 50 and two classes to Rank 50.
- **Class Marks:** past Rank 50, a class's EXP banks at half rate in the world's wallet. **Class Manuals** at the
  Exchange turn 1,000 Class Marks into 1,000 EXP on one class of one Uma. Uma EXP is never for sale.

## Laurels and EXP

<!-- live:laurels -->
| Stage kind | Laurels per win | First clear | Replay or Sweep | Lv 41–50 first clear | EXP weight |
|---|---|---|---|---|---|
| Fight | 10 | 30 | 8 | 120 | 0.36 |
| Sub-boss | 25 | 75 | 19 | 300 | 0.43 |
| Vanguard | 30 | 90 | 23 | 360 | 0.43 |
| Boss | 50 | 150 | 38 | 600 | 0.43 |

A stage in waves pays ×1.5 EXP and Laurels. Replays and Sweeps pay 25% of the first clear's EXP and Laurels.
<!-- /live -->

- **First clear** of a stage pays its Laurels ×3. **Later wins** pay a quarter of the first clear: every kind of EXP
  and Laurels. Sweeps count as wins.
- **Lv 41–50** stages pay their Laurels ×4 (D82).
- **Laurels × tier:** the table is Tier 1's; a stage pays its tier's multiple, so Tier 2's regions and capitals pay
  twice. A region's tier is its continent's: `w6`–`w10` are Tier 2 (D170).
- A capital's Finals pay Laurels at these rates and half their EXP ([maps](maps.md)).
- A loss, or giving up, pays nothing and costs nothing (MP is as it was before the fight).

## Currencies

Each world has its own wallet (`TierWorld.wallet`).

| Currency | Earned | Spent |
|---|---|---|
| Laurels | Fights and Sweeps; selling stock; 1,000 an Uma who ascends into the world | The Exchange |
| Speed Tickets | The Exchange; 5 an Uma who ascends into the world; the Tier rework's grant ([below](#the-tier-reworks-grant)) | 30 minutes off a running job ("Finish": one per 30 minutes left; "Finish all" on a place) |
| Sweep Tickets | The Exchange | One Sweep of a cleared regular stage or a won Echo |
| Uma Tickets | 20 at the start (Tier 1); 5 Uma Shards each | Unlocking an outfit |
| Uma Shards | Lv 10, 20, 30, 40, 50, Tier 1 only | Turned into Uma Tickets automatically |
| Class Marks | Class EXP past Rank 50, at half rate; EXP banked past Lv 50, on Ascend | Class Manuals |

### The Exchange

<!-- live:prices -->
| Raw materials | Stocked | Price (Laurels), × the world's tier |
|---|---|---|
| G1–G5, every line | after the tier's first win | 30 |
| G6–G10, every line | after a win on continent 3 | 80 |

| Thing | Price (Laurels) |
|---|---|
| Speed Ticket | 10 |
| Sweep Ticket | 15 |

A Speed Ticket takes 30 minutes off a running job. Selling, × the world's tier: a raw G1–G5 item 6, a G6–G10 one 16; refined twice that; a made item 6 + 6 × its grade. A Class Manual costs 1,000 Class Marks, not Laurels.
<!-- /live -->

The Exchange (`save/exchange.ts`) sells raw materials only: each line's ten grades in every world, G1–G5 once the world
has a win and G6–G10 once it has a win on its continent 3. It sells up to 99 at a time, and Speed and Sweep Tickets
beside them; its Manuals spend Class Marks. Refined and made items come only from the Wilds.

### The Warehouse

Each world's Warehouse (`TierWorld.items`) holds its materials and made items, free to use: a job takes its inputs from
it when the job starts, and its outputs arrive when they're collected. A grade raise or a jewel takes its made item from
it. Anything in it sells for a few Laurels (the prices above); its shelves are in [sections](sections.md#warehouse).

## The Tier rework's updates

Four save steps rebuilt the economy: v28 and v29 (the grant), v30 (the farm by line) and v31 (the trios). Each ran
once per world, the first time the save opened after it ([architecture](architecture.md) has the save history).

### The Tier rework's grant

R2's update (H82, save v28, D218) rebuilt the economy: every Uma's Craft Level went back to 1; crafted gear and lockers
went, and her gear became grades at G0 with one accessory slot and no family; Star Gems went, and her Extra Stats map
started empty; only Class Ranks stayed, and Gear Marks joined Class Marks; facility upgrades came back as Laurels. The
time the Umas worked came back as **Speed Tickets** (PP20, PP24): one per 30 minutes of the work their Craft EXP records,
⌈(EXP her Craft Level took + her bank) ÷ 60⌉ an Uma, and never less in a world than its deleted pieces and Star Gems took
to make at Craft Lv 25. It was paid once into each world's wallet and recorded in `TierWorld.grant`.

**Tickets only** (save v29, D221): the tickets already paid for gathering the stock, so every material left the
Warehouse of a world that was paid. Made items, Laurels, tickets and Craft Levels stayed. A world made after R2 has no
grant.

The first time each world with a grant opens, the sheet **"The Wilds are rebuilt"** shows it: the grant ("+63,800 Speed
Tickets"), the hours it stands for, what went (gear pieces, Star Gems, facility upgrades), what came back (the upgrades'
Laurels), what stays (Uma Levels, classes and Class Ranks, Laurels, every ticket you had), and each Uma's line ("Craft Lv
50 → 1 · 1,470"). Both of its buttons, To the Wilds and Later, close it for good; the Account's row "The Tier rework's
grant" reopens it.

### The farm by line (save v30)

The farm by line (H112, D224, D228) gave every trade all three steps of its own line, on ten grades. The first time a
save opened after it, running jobs finished into the Warehouse with their Craft EXP and queued jobs dropped. R2's types
moved to their line's grade that opens at the same Craft Level: a low type of any tier to its line's G1, a high type to
its G6 (Iron Ore became Gold Ore, Cabbage Bell Pepper, Sardine Fillet Sea Bream Fillet, Citrine Sapphire). Made items
(a Weapon Gem reads Arms Gem), grades, jewels, Craft Levels, Laurels and tickets stayed.

### The Wilds' trios (save v31)

The trios (H114, D230, D232) gave each line's processing its own workbench and renamed three making places (the Forge
became the Weapon Forge, the Workbench the Tome Forge, the Charm Shop the Charm Forge): fifteen places, each with one kind
of job. Save v31 settled v30's running work into the Warehouse with its Craft EXP and dropped queues; nothing else
changed.

## Craft Level

Each Uma has one profession level, **Craft Level** (save key `craft`, D144), raised by every job in the Wilds' fifteen
places (`economy/professions.ts`, `economy/places-v4.ts`, `work/env-v4.ts`; the pages are in [sections](sections.md)).

- **Her trade** (PP2, FL25–FL27): her calling names one line, and its three places are hers, in the Wilds' row order:

| Her calling | Line | Gather | Process | Make |
|---|---|---|---|---|
| Brawler | Metal | Mine (Mining) | Mine Workbench (Smelting) | Weapon Forge (Arms Crafting): Arms Gems |
| Paladin, Cleric | Vegetables | Fields (Farming) | Fields Workbench (Prepping) | Tome Forge (Tome Crafting): Tome Ink |
| Spell Blade | Wood | Forest (Wood Chopping) | Forest Workbench (Sawing) | Armorer (Armor Crafting): Armor Fittings |
| Summoner | Fish | Fishery (Fishing) | Fishery Workbench (Filleting) | Charm Forge (Accessory Crafting): Accessory Settings |
| Mage | Stone | Monster Den (Hunting) | Den Workbench (Stonecutting) | Lapidary (Jewel Crafting): Planet and Moon Jewels |

- **Her calling sets her trade,** never her active class: a class switch moves no job. A trade works three places,
  twelve slots. Another trade's places refuse her ("Another trade"), unless the world has no Uma of that trade: then
  the place is an **open shop** and takes everyone until one arrives.
- **One kind a place:** a gathering place gathers its line's raw items, a workbench processes them one for one, a making
  place makes its item from refined ones ([materials](materials.md)).
- **Grades** (FL6): every line has ten, G1–G10; grade g opens at Craft Lv 5g − 4 (1, 6, 11 … 46) to gather, to process
  and to make, and a made item of grade g takes its line's refined items of grade g.
- **Speed (FL28):** set by her Craft Level alone, the same for every item and grade. One step takes 36 minutes at Lv 1,
  falling evenly to 24 at Lv 50, before the place's ×1.25. Gathering one raw item is one step; processing it is one step;
  making is one step per refined item in its recipe.
- **Pace (D96):** a level takes 12 hours of work at Lv 1, rising to 18 at Lv 49 (88,200 EXP to Lv 50). Craft EXP is 2 a
  minute of the job at her level, before the place's speed, whatever it makes, so every job levels at the same rate an
  hour and batch size doesn't change it.
- **A job:**
  - An Uma makes its outputs one after another. Her work is her own row (SC3): she holds one slot from the moment a job
    starts until Collect frees her or she's recalled, so she works in one place at most. Starting a job on an Uma whose
    work is finished collects it first.
  - Every job runs in the shared work engine, `@luismlorenzana/uma-work`, the same code as uma-racer's; this game
    supplies its kinds (gather, process, make), its fifteen places and its Craft Level.
  - **Sizes (D233):** every step takes the same time, so sizes are brackets of steps: ×1, ×2, ×3, ×5, ×10, ×15 or ×20
    to gather or process, about half an hour, 1, 1½, 2, 4, 6 and 8 hours at mid Craft Level. A make offers the sizes up
    to about 20 steps: Armor Fittings (2 steps) to ×10, a Moon Jewel (4) to ×5, an Arms Gem or Tome Ink (7) to ×3, an
    Accessory Setting or a Planet Jewel (10) to ×2. Each size shows its time.
  - Inputs leave the Warehouse when the job starts. Outputs go to the Warehouse when collected.
- **Queues:** up to three more jobs wait behind the current one, for the same Uma at the same place. Each starts the
  moment the one before ends and takes its inputs then, so a chain catches up however late it's collected. If the
  Warehouse can't cover the next one, the queue **stops**: it waits on the place's page to be restarted (its first job
  starts now) or dismissed (SC3).
- **Offline:** everything runs from start times, so jobs finish while the app is closed. Push notifications say when
  ([sections](sections.md#global-ui)).
- **Recall:** pays what's finished and returns the inputs of everything unfinished, the item in progress included. The
  queue drops and Repeat forgets her last job. Only the time is lost.
- **Repeat (SC3):** starts her last job again where she did it, or in another free slot there if hers is taken; on an
  Uma whose work is finished it collects first.
- **Speed Tickets:** each takes 30 minutes off her running job, and never more are spent than finish it: asking for more
  spends only what's needed. **Finish** spends ⌈remaining ÷ 30 minutes⌉. **Finish all** on a place with two or more jobs
  running finishes them all at once, after a confirm naming the total ("Finish 3 jobs for 14 Speed Tickets?"); short of
  tickets it says "Needs 14 Speed Tickets". A finished job's queue starts at once.
- **Targets:** mark up to ten Umas a world on their profiles (`save/targets.ts`). Every place then lists what maxing
  them still takes from it:
  - **The making places:** each made item still needed to raise her active class's three weapons, her five armor slots
    and her accessory slot to G10, or to open an Extra Stats node.
  - **The workbenches:** the refined items of their line those still need.
  - **The gathering places:** the raw items of their line those still need.
  - **Each line** shows the total need, what's in the Warehouse and what's coming. It stays until the Warehouse holds
    enough, then goes.
  - **Cascade:** only what's still short (not in stock, not being made) reaches the materials, so when a line is
    covered every line below it for that need goes too.
  - **Stock held by queued jobs** isn't counted as free, and a queued job counts as coming only if its inputs are in
    the Warehouse.
  - **Leaving the list:** a grade she raises or a node she opens drops off. Several targets add up.
- **Places have no levels** (PP4): every place has its four slots at ×1.25 from day one.

<!-- live:jobs -->
| Setting | Value |
|---|---|
| One step | gather one raw or process one raw into one refined: 36 min at Craft Lv1, falling evenly to 24 min at Lv50 (ten in 6 h and 4 h) |
| Make one item | one step for each refined item in it: an Arms Gem or Tome Ink 7, Armor Fittings 2, an Accessory Setting 10, a Planet Jewel 10, a Moon Jewel 4 (an Arms Gem 4.2 h at Lv1, 2.8 h at Lv50) |
| Opens | grade g at Craft Lv 5g − 4, to gather, to process and to make |
| Craft EXP | 2 per minute of the job at her level, before the place's speed |
| Sizes | ×1, ×2, ×3, ×5, ×10, ×15, ×20 to gather or process; a make up to about 20 steps (8 h at Craft Lv25): Armor Fittings ×10, a Moon Jewel ×5, an Arms Gem or Tome Ink ×3, an Accessory Setting or a Planet Jewel ×2 |
| Jobs queued after it | 3 |
| Places | 4 Uma slots each, speed ×1.25, from day one; no upgrades |
| Extra Stats and armor points | +1 to its stat per point (+5 HP); Speed 0.6% evasion; Limit +0.4 starting charge |
<!-- /live -->

## Extra Stats and gear

### Extra Stats

The Observatory's map (EP1–EP8; `economy/planet.ts`, `save/observatory.ts`):
- Each Uma has a map of a **Planet** and three moons, **Prowess**, **Vigor** and **Guard**, five nodes each (20, the same
  for every class), and beside them **her moon**, two nodes read from her template ★.
- **A jewel opens a node,** in order: Planet n needs a Planet Jewel n, a moon's node n a Moon Jewel n (the moon picked
  when it's set), her moon's I and II Moon Jewels II and IV. A node opens at Uma Lv 5g − 4 for its grade (Planet n is
  grade 2n − 1, a moon's n grade 2n, her moon's I and II grades 4 and 8), once the node below it on its body is open.
  The jewel is used up.
- **Every open node counts:** nothing to switch on.
- **What a node gives** (Tier 1, × 1.8 in Tier 2 and × 2.6 in Tier 3):

<!-- live:star-map -->
| Body | Nodes | Opens at Lv | Points (Tier 1) | To |
|---|---|---|---|---|
| Planet | I–V | 1, 11, 21, 31, 41 | 1, 2, 4, 6, 8 | all six core stats (HP 5 a point) |
| Prowess | I–V | 6, 16, 26, 36, 46 | 2, 4, 6, 8, 10 | ATK and M.ATK by her active class: Brawler 100/0, Mage 0/100, Spell Blade 70/30, Cleric 20/80, Summoner 30/70, Paladin 80/20 |
| Vigor | I–V | 6, 16, 26, 36, 46 | 2, 4, 6, 8, 10 | HP and MP |
| Guard | I–V | 6, 16, 26, 36, 46 | 2, 4, 6, 8, 10 | DEF and M.DEF |
| ★ Her moon | I, II | 16, 36 | 4, 8 | I: her knack's stat; II: her calling's channel's defense |
<!-- /live -->

- **What a point does (D104, flat):** ATK, M.ATK, DEF, M.DEF or MP +1; HP +5; Speed 0.6% evasion (up to 50%); Limit a
  0.4 head start on the Limit Break gauge. Speed and Limit come only from her moon (a Fleet or Gritty knack, 4 points in
  every tier); a fight's gauge is whole, so a Gritty moon's 1.6 starts it at 1.
- **Prowess** splits by the class she fights as when the fight starts.
- Ascending to a new tier starts her map empty.

### Gear

Every made item and value is in [materials](materials.md#gear); `economy/grades.ts`, `economy/accessories.ts` and
`save/forge.ts` hold the rules.
- **Slots:** a grade on each of the ten weapons (she fights with her class's three), five armor slots (head, body, legs,
  arms, feet) and one accessory slot, each G0 to G10. Grade g opens at Uma Lv 5g − 4.
- **Raising a grade:** a made item of the next grade from the Warehouse (an Arms Gem for an Arms weapon, Tome Ink for a
  Tome, Armor Fittings, an Accessory Setting) raises the slot one grade; a sheet can climb several grades at once when
  the Warehouse holds each one. The Gear tab's Upgrade view marks a slot she can raise now.
- **What it does:** a weapon's Might on its hits; armor its slot's stat and ATK or M.ATK by her class's half; her
  accessory's family in its base form; her signature while she wears her knack's family ([combat](combat.md#damage)).
- **The accessory slot:** its family (Pendant, Orb, Bell, Insignia), and an Orb's or a Bell's kind (one of her three
  weapons' kinds), change freely on the Gear tab's Equip view; the grade is the slot's and stays, raised on its Upgrade
  view.
- **Standard preset (D164):** "Use the standard preset", at the top of the Gear tab, puts on her active class's preset
  ([classes](classes.md#weapons)): the class's three default weapons and her accessory slot's family (her signature's ★
  family when she has one, else the class's form). Grades don't move.

## Springs, replays and Sweeps

- **Springs** (5 per continent): refill the active party's MP, then recharge for 2 hours. Not during a fight.
- **HP** is full every stage. **MP** carries after a win.
- **Replays:** any cleared stage, for a quarter of its first-clear rewards.
- **Sweeps:** a cleared regular stage, paid like a replay, for one Sweep Ticket, 1–99 at a time. Each needs the active
  party full, and no open fight. MP isn't touched. A capital's Finals can't be swept.
- **Working and fighting (D119)** never block each other: an Uma at a job fights, and one in the open fight takes jobs.
- **One open fight** on the whole world map. While it's open, its Umas can't change parties, and the active
  party, Springs and Sweeps are locked. The fight is stored as its input plus every action ([combat](combat.md)). The
  Rift has its own open fight ([below](#the-rift)).

## The Rift

The end-of-tier event ([the Rift](../design/rift.md), D161, D168; its run rules and Ascend in H48, D174). Its foes are
in [combat](combat.md#the-rifts-foes); the rules are `save/rift.ts`, behind `@rpg/domain/rift`.
- **Opening:** a world's Rift opens once it has five Lv 50 Umas, in Tiers 1 and 2 (Tier 3's waits for its fifth
  scenario). Echoes and sign-up need it open.
- **Sign-up and the roster:** twenty different Lv 50 Umas of this world sign up as a run's roster. A world runs one
  Rift at a time, until its run ascends. An untouched run (no stage cleared, no Convergence attempt, no Rift fight open)
  can be cancelled.
- **The roster lock:** front and Convergence fights take only the twenty. Between fights, arrange them into any of the
  world's parties, and change their classes, skills and gear freely.
- **The guidance** (the guided builds, engine v16, CP7): each front suggests a build of five classes with every
  member's three weapons, and the page suggests the party that fits a front best and one for each of the Convergence's
  slots, never one with two healers; "Use the guided weapons" sets its members' weapons in one tap
  ([combat](combat.md#the-rifts-foes) has every build). A front, Echo or Convergence fight takes one healer at most, as
  the world map does.
- **Fronts and seals:** Iron, Arcane, Duel and Horde, twelve stages each. The fronts go in any order, a front's stages
  in order: only its next stage can be fought, and a cleared stage isn't replayed. A front fight takes one of the
  world's twenty parties, full, all five on the roster. Its 12th stage seals the front.
- **Retries:** free and unlimited. Every Rift fight starts with HP and MP full (the world map's carried MP stays
  there), and a retry draws a fresh seed against the same foes.
- **One open Rift fight** a world, beside the world map's; neither blocks the other. Leaving it pays nothing.
- **The Convergence:** with every front sealed, assign four different full parties, Iron's, Arcane's, Duel's and
  Horde's, that are exactly the twenty. The attempt freezes them and counts. Its four fights go in order; a loss, or
  leaving a fight, ends the attempt, and the next one starts from the first fight. An attempt can also be ended between
  fights. The fourth win wins the run.
- **What they pay:** front and Convergence fights pay [achievements](#achievements) only: no EXP, Laurels, Marks or
  Bonds. Every won Rift fight records the boss and sub-boss faces it defeated, with the time of the first defeat.
- **Echoes:** each front at Lv 45, 50 and 55, for any full party of Lv 50 Umas while the Rift is open, with or without
  a run. A win fills each Uma's Class Rank for the class she fought as at twice a stage's rule, E being a regular stage's
  EXP at the Echo's level for her: Lv 45 pays half, Lv 55 the same as Lv 50 (fighting above her never pays more). Past
  Rank 50 it banks as Class Marks. No Uma EXP, Laurels, Shards or Bonds.
  - **The pace** (H51, D176): a fresh class reaches Rank 30 in about 9 Echo wins at Lv 50 or 55 and 17 at Lv 45, and
    Rank 50 in 20 (40 at Lv 45).
  - **How hard:** a party with one Uma at Class Rank 1 wins the Lv 45 Echoes, and an on-curve party the Lv 50 ones.
    Lv 55 is the hard step, hardest on the Horde.
- **Sweeps:** a won Echo, by a full party of Lv 50 Umas, one Sweep Ticket each, 1–99 at a time. Each pays an Echo win.
  They record no faces and earn no achievements.
- **Ascend:** once the run is won, its twenty move up a tier together, in one step: no Rift or world-map fight open,
  and none of them at work ("Recall or collect").
  - **They leave** the old world's Stable, parties, targets, carried MP, Hall seats and work. A Hero's seat empties and
    its Learners leave it. The made items her grades used go back to the old world's Warehouse (a G5 Arms weapon returns
    Arms Gems G1–G5, a G5 Tome Tome Ink G1–G5); the jewels she set are gone.
  - **They arrive** at Lv 1 with Class Rank 1 everywhere, her classes' weapons, lines and equipped skills back to their
    defaults, every grade G0, an empty Extra Stats map, Craft Lv 1 and no Bonds. Each keeps her class, her calling and
    her accessory slot's family and kind.
  - **The new world** gets the purse, 1,000 Laurels and 5 Speed Tickets an Uma, and their banked EXP as Class Marks. A
    party whose five all ascend moves, with its name, into its first empty party; the rest fill the next empty parties,
    five at a time.
  - Each Uma's history records the climb. The tier's next twenty Lv 50 Umas can run its Rift again.

<!-- live:rift-rules -->
| Rule | Value |
|---|---|
| The Rift opens | 5 Lv 50 Umas in the tier's world (Tiers 1 and 2) |
| A run | 20 Lv 50 Umas; 4 fronts of 12 stages, then the Convergence's 4 fights |
| Echoes | Each front at Lv 45, 50, 55 |
| Echo pay | ×2 a stage's Class, Weapon, Armor and Accessory Rank EXP; no Uma EXP, Laurels, Shards or Bonds |
| Class EXP an Echo win, Lv 50 Uma | Lv 45: 652 · Lv 50: 1,300 · Lv 55: 1,300 |
| Ascension purse, per Uma | 1,000 Laurels and 5 Speed Tickets (20,000 and 100 a run) |
| Banked EXP on Ascend, per Uma | 1 Class Mark per 10 EXP, 2,000 at most |
<!-- /live -->

## Achievements

The Rift pays achievements instead of EXP ([the Rift](../design/rift.md) §7, D172). They're the account's, not a
world's: each is earned once, in any tier, and the Account lists them with the date and the run they came from.
- **Required:** each tier's four front seals and Rift Conquered, the ones that gate Ascend (R8). A front's champion
  (stage 12) seals it; the Convergence's last fight conquers the Rift.
- **Titles:** the other nine, earned once per account in any tier, each with its run. The Bestiary counts the boss and
  sub-boss faces defeated in Rift fights across every run and tier, so it names no run.
- **How a fight earns them** (`achievementsEarned`, `rift/achievements.ts`): every won Rift fight earns each one whose
  rule holds and the account lacks, in catalog order. Iron Will, Arcane Purity and Untouched read what the front's won
  fights in the run showed (magic dealt, physical damage dealt, an Uma knocked out); Swift Convergence the attempt's
  four fights; Crossover one party of five different classes winning a champion fight (a front's stage 12 or any
  Convergence fight). The run rules ask on every won Rift fight, Echoes included; Sweeps earn none.
- **The cut-in:** each new one plays over the fight's result, one at a time, until Continue.

<!-- live:achievements -->
| Name | How | Kind |
|---|---|---|
| Iron Seal · Tier 1 | Win the Iron front’s champion | Required |
| Arcane Seal · Tier 1 | Win the Arcane front’s champion | Required |
| Duel Seal · Tier 1 | Win the Duel front’s champion | Required |
| Horde Seal · Tier 1 | Win the Horde front’s champion | Required |
| Rift Conquered · Tier 1 | Win the Convergence | Required; unlocks Ascend |
| Iron Seal · Tier 2 | Win the Iron front’s champion | Required |
| Arcane Seal · Tier 2 | Win the Arcane front’s champion | Required |
| Duel Seal · Tier 2 | Win the Duel front’s champion | Required |
| Horde Seal · Tier 2 | Win the Horde front’s champion | Required |
| Rift Conquered · Tier 2 | Win the Convergence | Required; unlocks Ascend |
| Iron Will | Seal Iron with no magic dealt | Title |
| Arcane Purity | Seal Arcane with no physical damage | Title |
| Untouched · Iron | Seal Iron with no Uma knocked out | Title |
| Untouched · Arcane | Seal Arcane with no Uma knocked out | Title |
| Untouched · Duel | Seal Duel with no Uma knocked out | Title |
| Untouched · Horde | Seal Horde with no Uma knocked out | Title |
| Swift Convergence | Win the Convergence, every fight under 8 rounds | Title |
| Bestiary | Defeat every boss and sub-boss | Title |
| Crossover | Win a champion with five classes in one party | Title |
<!-- /live -->
