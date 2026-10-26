# Game loops

What the player does, what it pays and what it costs. Numbers come from the code: generated tables between `live`
markers, the rest checked against `packages/domain/src/economy/`, `save/` and `rpg/`. A tier's next world opens when
the Rift below it ascends twenty Umas ([the Rift](#the-rift); the page is in [sections](sections.md#the-rift)).

## The loop

```
 Unlock Umas ─► build parties ─► fight on the world map ─► Uma EXP, Class EXP, Laurels, Uma Shards
       ▲                                                          │
       │            ┌───── Class Rank (deeper skills, Skill Ranks) ◄┤── Class Marks past Rank 50 ─► Class Manuals
       │            ▼                                             ▼
   Uma Shards ─► Tickets                                      Exchange: raw materials, tickets
                                                                  │
                                                                  ▼
                    gather (her trade's place) ─► process (the Workbench) ─► make (Weapon Gems, Armor Fittings,
                                                                              Accessory Settings, Planet and Moon Jewels)
                                                                                    │
                                    grades raised, nodes opened ◄───────────────────┘
                                    └────────► a stronger party fights higher levels
```

Fights are active play. Everything else is jobs that run in real time, offline included, and pay when collected.

## Collection and parties

- **Start:** 20 Uma Tickets and no Umas. One Ticket unlocks one outfit, for good.
- **Uma Shards:** an Uma earns one at Lv 10, 20, 30, 40 and 50 (Tier 1), from fights and Sweeps alike. Five Uma Shards make a
  Ticket automatically, so every Uma who reaches Lv 50 pays back one Ticket. Tickets have no other source or use.
- **Parties:** 20 parties of 5. An Uma belongs to at most one party; adding her to another moves her.
- **Active party:** the one that fights, sweeps and drinks at Springs. You can switch any time no fight is open. A fight
  needs all five slots filled; Umas at work fight too (D119).
- **Classes:** switching is free. A new Uma starts in her **calling** (engine v16, CP29,
  [classes](classes.md#her-calling-and-her-template)); her armor's half is her class's, magical for a Mage, Cleric or
  Summoner. A Pace or Late Uma picks once between her two callings, and her first win confirms it; the pick waits while
  she works ("Finish her work first"), because it moves her trade. A party fights with one healer, a Paladin or a Cleric,
  at most.

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

- Level cap 50. At Lv 50 EXP keeps banking; nothing spends it yet (it's planned for promotion).
- Every entrant is paid, knocked out or not.
- **Uma EXP is never sped up (D102):** a stage pays a share of **her own** level, so a Lv 1 Uma in a Lv 40 fight still
  gains about a third of a level. Fighting below her level pays less; above it, no more.
- A regular stage at her level pays about a third of a level: about three fights a level-up. A region's twelve first
  clears carry a party across its five levels, a little short of the next region's first level (D97).
- **Her Uma Level** sets her stats, her skill slots (3 → 7), the grades her gear can reach (Lv 5g − 4) and the Extra
  Stats nodes she can open. Skills open with **Class Rank** ([ranks](#ranks)).

## Ranks

One bar a class (D102; R2 retired the gear bars, WP3; [classes](classes.md#ranks-and-levels) for what it opens):

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

- **What a win pays,** for `E` Uma EXP: the class she fought as 2E. A Sweep pays the same.
- **A campaign** (about 120 first clears) takes one Uma to Lv 50 and two classes to Rank 50.
- **Class Marks:** past Rank 50, a class's EXP banks at half rate, world-wide. **Class Manuals** at the Exchange turn
  1,000 Class Marks into 1,000 EXP on one class of one Uma. Uma EXP is never for sale.

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
- A loss, or giving up, pays nothing and costs nothing (MP is as it was before the fight).
- There are no tokens (D105).

## Currencies

| Currency | Earned | Spent |
|---|---|---|
| Laurels | Fights and Sweeps; selling stock | The Exchange |
| Speed Tickets | The Exchange; the Tier rework's grant ([below](#the-tier-reworks-grant)) | 30 minutes off a running job ("Finish": one per 30 minutes left; "Finish all" on a place) |
| Sweep Tickets | The Exchange | One Sweep of a cleared regular stage |
| Uma Tickets | 20 at the start; 5 Uma Shards each | Unlocking an outfit |
| Uma Shards | Lv 10, 20, 30, 40, 50 | Turned into Tickets automatically |
| Class Marks | Class EXP past Rank 50, at half rate | Class Manuals |

<!-- live:prices -->
| World | Raw materials | Stocked | Price (Laurels) |
|---|---|---|---|
| Tier 1 | Tier 1's low types | after the tier's first win | 30 |
| Tier 1 | Tier 1's high types | after a win on continent 3 | 80 |
| Tier 2 | Tier 1's low types | after the tier's first win | 60 |
| Tier 2 | Tier 1's high types | after a win on continent 3 | 160 |
| Tier 2 | Tier 2's low types | after a win on continent 2 | 60 |
| Tier 2 | Tier 2's high types | after a win on continent 4 | 160 |
| Tier 3 | Tier 1's low types | after the tier's first win | 90 |
| Tier 3 | Tier 1's high types | after a win on continent 3 | 240 |
| Tier 3 | Tier 2's low types | after a win on continent 2 | 90 |
| Tier 3 | Tier 2's high types | after a win on continent 4 | 240 |
| Tier 3 | Tier 3's low types | after a win on continent 2 | 90 |
| Tier 3 | Tier 3's high types | after a win on continent 4 | 240 |

| Thing | Price (Laurels) |
|---|---|
| Speed Ticket | 10 |
| Sweep Ticket | 15 |

A Speed Ticket takes 30 minutes off a running job. Selling, × the world's tier: a raw low type 6, a high type 16; refined twice that; a made item 6 + 6 × its grade. A Class Manual costs 1,000 Class Marks, not Laurels.
<!-- /live -->

The Exchange sells raw materials only, every tier's types up to the world's, by pair: a pair's low type once it's needed
and its high type before G10. It sells up to 99 at a time; selling pays a few Laurels for any material or made item.

### The Tier rework's grant

R2's update (H82) rebuilt the Wilds: every Uma's Craft Level went back to 1, crafted gear and Star Gems became grades and
an empty map, and facility upgrades were refunded. The time the Umas worked came back as **Speed Tickets** (PP20, PP24):
one per 30 minutes of the work their Craft EXP records, ⌈(EXP her level took + her bank) ÷ 60⌉ an Uma, never below what
the deleted pieces and gems took to make. It was paid once into each world's wallet when the save became v28.

The first time each world opens after the update, the sheet **"The Wilds are rebuilt"** shows it: the grant ("+63,800
Speed Tickets"), the hours it stands for, what went (gear pieces, Star Gems, facility upgrades), what came back (Laurels,
refined items, the Warehouse converted to the new materials), what stays (Uma Levels, classes and Class Ranks, Laurels,
every ticket you had), and each Uma's line ("Craft Lv 50 → 1 · 1,470"). Both of its buttons, To the Wilds and Later,
close it for good; the Account's row "The Tier rework's grant" reopens it.

## Craft Level

Each Uma has one profession level, **Craft Level** (save key `craft`, D144), raised by every job in the Wilds' ten places
([sections](sections.md#wilds)).

- **Her trade** (PP2): her calling names two professions, a gathering one and a crafting one, and their two places are
  hers. A Brawler mines and makes Weapon Gems; a Spell Blade chops wood and makes Armor Fittings; a Paladin or a Cleric
  farms and processes at the Workbench; a Summoner fishes and makes Accessory Settings; a Mage hunts and cuts jewels. Her
  calling sets it, never her active class: a class switch moves no job. Another trade's places refuse her ("Another
  trade"), unless the world has no Uma of that trade: then the place is an **open shop** and takes everyone until one
  arrives.
- **Types and grades** (PP13): a low type opens at Craft Lv 1 and a high type at Craft Lv 26; a made item of grade g at
  Craft Lv 5g − 4 (1, 6, 11 … 46).
- **Speed (D139):** set by her Craft Level alone, the same for every type and grade. Aptitude doesn't matter.
  - Gathering one raw item takes 54 minutes at Lv1, falling evenly to 36 at Lv50, before the place's ×1.25.
  - Processing takes a quarter of that; making takes a gather's time for each refined item in the made item.
- **Pace (D96):** a level takes 12 hours of work at Lv1, rising to 18 at Lv49 (88,200 EXP to Lv50). Batch size doesn't
  change it: EXP is paid per minute of work.
- **A job:**
  - An Uma makes its outputs one after another. Her work is her own row (SC3): she holds one slot from the moment a job
    starts until Collect frees her or she's recalled, so she works in one place at most. Starting a job on an Uma whose
    work is finished collects it first.
  - Every job runs in the shared work engine, `@luismlorenzana/uma-work`, the same code as uma-racer's; this game
    supplies its kinds (gather, process, make), its ten places and its Craft Level.
  - **Batches (D139):** gathering and making 1–10; processing ×1, ×4, ×8, ×20 or ×40.
  - Inputs are reserved at the start. Made items and materials go to the Warehouse.
  - Craft EXP is 2 per minute of the job at her level, before the place's speed, so every job levels at the same rate
    per hour.
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
- **Speed Tickets** never spend more than finish the job: asking for more spends only what's needed. **Finish all** on a
  place finishes every running job there at once, each at ⌈remaining ÷ 30 minutes⌉, after a confirm naming the total
  ("Finish 3 jobs for 14 Speed Tickets?"); short of tickets it says "Needs 14 Speed Tickets".
- **Targets:** mark up to ten Umas total on their profiles. Every place then lists what maxing them still takes from it:
  - **The making places:** each grade still to raise on her three weapons, her five armor slots and her accessory slot,
    and each jewel for a node she hasn't opened.
  - **The Workbench and the gathering places:** the refined and raw materials those still need.
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
| Gather one raw item | any type, by Craft Level: 54 min at Lv1, falling evenly to 36 min at Lv50 (ten in 9 h and 6 h) |
| Process one item | raw into refined, one for one, a quarter of a gather: 13.5 min at Lv1, 9 min at Lv50 |
| Make one item | a gather's time for each refined item in it: a Weapon Gem 4, Armor Fittings 2 or 3, an Accessory Setting 12, a Planet Jewel 12, a Moon Jewel 4 |
| Opens | a low type at Craft Lv 1 and a high type at Lv 26; a made item of grade g at Craft Lv 5g − 4 |
| Craft EXP | 2 per minute of the job at her level, before the place's speed |
| Outputs per job | gathering and making 1–10; processing ×1, ×4, ×8, ×20, ×40 |
| Jobs queued after it | 3 |
| Places | 4 Uma slots each, speed ×1.25, from day one; no upgrades |
| Extra Stats and armor points | +1 to its stat per point (+5 HP); Speed 0.6% evasion; Limit +0.4 starting charge |
<!-- /live -->

## Extra Stats and gear

**Extra Stats** (the Observatory, EP1–EP8):
- Each Uma has a map of a **Planet** and three moons, **Prowess**, **Vigor** and **Guard**, five nodes each (20, the same
  for every class), and beside them **her moon**, two nodes read from her template ★.
- **A jewel opens a node,** in order: Planet n needs a Planet Jewel n, a moon's node n a Moon Jewel n (picked when it's
  set), her moon's I and II Moon Jewels II and IV. A node opens at Uma Lv 5g − 4 for its grade (Planet n is grade
  2n − 1, a moon's n grade 2n), once the node below it on its body is open. The jewel is used up.
- **Every open node counts:** no active slots, nothing to switch on.
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
  0.4 head start on the Limit Break gauge. Speed and Limit come only from her moon (a Fleet or Gritty knack).
- Ascending to a new tier starts her map empty.

**Gear** ([materials](materials.md#gear)):
- **Slots:** her class's three weapons, five armor slots (head, body, legs, arms, feet) and one accessory slot, each at a
  grade, G0 to G10. Grade g opens at Uma Lv 5g − 4.
- **Raising a grade:** a made item of the next grade (a Weapon Gem, Armor Fittings, an Accessory Setting), from the
  Warehouse, raises the slot one grade; a sheet can climb several grades at once when the Warehouse holds each one. The
  Gear tab marks a slot she can raise now.
- **What it does:** a weapon's Might on its hits; armor its slot's stat and ATK or M.ATK by her class's half; her
  accessory's family in its base form; her signature while she wears her knack's family ([combat](combat.md#damage)).
- **The accessory slot:** its family (Pendant, Orb, Bell, Insignia), and an Orb's or a Bell's kind, change freely outside
  fights; the grade is the slot's and stays.
- **Standard preset (D164):** "Use the standard preset", at the top of the Gear tab, puts on her active class's preset
  ([classes](classes.md#weapons)): the class's three default weapons and her accessory slot's family (her signature's ★
  family when she has one, else the class's form). Grades don't move.

## Springs, replays and Sweeps

- **Springs** (5 per continent): refill the active party's MP, then recharge for 2 hours. Not during a fight.
- **HP** is full every stage. **MP** carries after a win.
- **Replays:** any cleared stage, for a quarter of its first-clear rewards.
- **Sweeps:** a cleared regular stage (1–10), paid like a replay, for one Sweep Ticket, 1–99 at a time. Each needs the
  active party full, and no open fight. MP isn't touched.
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
- **The guidance** (classes v2, D178, H60; the guided builds, engine v16, CP7): Iron 2 Brawler, 2 Spell Blade and a
  Paladin; Arcane 2 Mage, 2 Summoner and a Cleric; Duel 2 Brawler, 2 Mage and a Paladin; Horde 2 Spell Blade, 2 Summoner
  and a Cleric. Each comes with every member's three weapons: on her defaults, or for a front's second copy of a class
  the kinds the first doesn't hold (Iron's second Brawler on the Bow, the Katana and the Axe;
  [combat](combat.md#the-rifts-foes) has every build). The page suggests the party that fits a front best, and one for
  each of the Convergence's slots, never one with two healers; "Use the guided weapons" sets its members' weapons in one
  tap. A front, Echo or Convergence fight takes one healer at most, as the world map does.
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
  a run. A win fills each Uma's [rank bars](#ranks) at twice a stage's rule, E being a regular stage's EXP at the Echo's
  level for her: Lv 45 pays half, Lv 55 the same as Lv 50 (fighting above her never pays more). Past Rank 50 it banks
  as Class Marks. No Uma EXP, Laurels, Shards or Bonds.
  - **The pace** (H51, D176): a fresh class reaches Rank 30 in about 9 Echo wins at Lv 50 or 55 and 17 at Lv 45, and
    Rank 50 in 20 (40 at Lv 45).
  - **How hard:** a party with one Uma at Class Rank 1 wins the Lv 45 Echoes, and an on-curve party the Lv 50 ones.
    Lv 55 is the hard step, hardest on the Horde.
- **Sweeps:** a won Echo, by a full party of Lv 50 Umas, one Sweep Ticket each, 1–99 at a time. Each pays an Echo win.
  They record no faces and earn no achievements.
- **Ascend:** once the run is won, its twenty move up a tier together, in one step: no Rift or world-map fight open,
  and none of them at work ("Recall or collect").
  - **They leave** the old world's Stable, parties, targets, carried MP, Hall seats and work. A Hero's seat empties and
    its Learners leave it. The made items her grades used go back to the old world's Warehouse (a G5 weapon returns Weapon
    Gems G1–G5); the jewels she set are gone.
  - **They arrive** at Lv 1 with Class Rank 1 everywhere, no skills, every grade G0, an empty Extra Stats map, Craft Lv 1
    and no Bonds. Each keeps her class, her calling and her accessory slot's family and kind.
  - **The new world** gets the purse and their banked EXP as Class Marks (below). A party whose five all ascend moves,
    with its name, into its first empty party; the rest fill the next empty parties, five at a time.
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
