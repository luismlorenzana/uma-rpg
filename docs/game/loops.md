# Game loops

What the player does, what it pays and what it costs. Numbers come from the code: generated tables between `live`
markers, the rest checked against `packages/domain/src/economy/`, `save/` and `rpg/`. A tier's next world opens when
the Rift below it ascends twenty Umas ([the Rift](#the-rift); the page is in [sections](sections.md#the-rift)).

## The loop

```
 Unlock Umas ─► build parties ─► fight on the world map ─► Uma EXP, Class, Weapon and Armor EXP, Laurels, Uma Shards
       ▲                                                          │
       │            ┌────── ranks (deeper skills, higher grades) ◄┤── Marks past a max rank ─► Manuals
       │            ▼                                             ▼
   Uma Shards ─► Tickets                                      Exchange: raw items, tickets, Manuals
                                                                  │
                                                                  ▼
                                            gather ─► refine ─► cut (Star Gems ─► Extra Stats)
                                                              └─► craft (weapons, armor, accessories)
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
- **Classes:** switching is free. A new Uma starts in her running style's class and in its armor, magical for a Mage,
  Cleric or Summoner (D162, [classes](classes.md)).

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
- **Her Uma Level** sets her stats, her skill slots (3 → 10) and her Extra Stats slots. Skills open with **Class Rank**
  ([ranks](#ranks)).

## Ranks

Each win fills more bars than her Uma Level (D102; [classes](classes.md#ranks-and-levels) for what each opens):

<!-- live:ranks -->
| Bar | Ranks | Per win worth E Uma EXP | Opens |
|---|---|---|---|
| Class Rank, per class | 1–50 | 2E to the class she fought as | Its trees: cores at 1, 10, 20, 30, 40; side skills at 5 … 45; a side point a rank |
| Weapon Rank, per weapon | 1–10 | 5E over her five weapons, double for each she used | Wears that weapon up to its rank's grade |
| Armor Rank, per armor kind | 1–10 | 1E to each of her five armor kinds | Wears that kind up to its rank's grade |
| Accessory Rank, per accessory kind | 1–10 | 1E to the kind of each accessory she wears | Wears accessories of that kind up to its rank's grade |

| Class Rank | EXP to next |
|---|---|
| 1 | 136 |
| 10 | 280 |
| 20 | 440 |
| 30 | 600 |
| 40 | 760 |
| 49 | 904 |

| Weapon or Armor Rank | EXP to next | Next rank, used every fight, by |
|---|---|---|
| 1 | 840 | Lv 6 |
| 2 | 1,240 | Lv 11 |
| 3 | 1,640 | Lv 16 |
| 5 | 2,440 | Lv 26 |
| 7 | 3,240 | Lv 36 |
| 9 | 4,040 | Lv 46 |

Past a max rank, EXP banks at 50% as Marks: Gear Marks from weapons and armor, Class Marks from classes. A Manual costs 1,000 Marks and gives 1,000 EXP to one bar of one Uma. Armor kinds by slot: Head Helm or Circlet; Body Cuirass or Robe; Legs Greaves or Leggings; Arms Gauntlets or Bracers; Feet Boots or Slippers. 10 kinds in all. Accessory kinds: Arms Orb, Elemental Orb, Talisman, Amulet.
<!-- /live -->

- **What a win pays,** for `E` Uma EXP: her class 2E; her five slotted weapons share 5E, two parts for each weapon she
  used that fight (an attack, a skill, a Spell Blade half, a Limit Break), one part for the rest; each of her five armor
  slots' kinds E. A Sweep shares weapon EXP evenly.
- **No caps between bars:** a Lv 1 Uma can wear a grade-10 weapon if its rank allows.
- **A campaign** (about 120 first clears) takes one Uma to Lv 50, two classes to Rank 50, and five weapons and five
  armor kinds to Rank 10.
- **Marks:** past a max rank, a bar's EXP banks at half rate, world-wide: Gear Marks from weapons and armor, Class Marks
  from classes. **Manuals** at the Exchange turn 1,000 Marks into 1,000 EXP on one bar of one Uma. Uma EXP is never for
  sale.

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
| Laurels | Fights and Sweeps; selling stock | The Exchange; facility upgrades |
| Speed Tickets | The Exchange | 30 minutes off a running job (or "Finish": one per 30 minutes left) |
| Sweep Tickets | The Exchange | One Sweep of a cleared regular stage |
| Uma Tickets | 20 at the start; 5 Uma Shards each | Unlocking an outfit |
| Uma Shards | Lv 10, 20, 30, 40, 50 | Turned into Tickets automatically |
| Gear Marks | Weapon and Armor EXP past Rank 10, at half rate | Weapon and Armor Manuals |
| Class Marks | Class EXP past Rank 50, at half rate | Class Manuals |

<!-- live:prices -->
| Thing | Price (Laurels) |
|---|---|
| Raw item, grade 1 | 20 |
| Raw item, grade 4 | 50 |
| Raw item, grade 7 | 80 |
| Raw item, grade 10 | 110 |
| Speed Ticket | 10 |
| Sweep Ticket | 15 |

A Speed Ticket takes 30 minutes off a running job. A Manual costs 1,000 Marks, not Laurels.
<!-- /live -->

Selling pays 2 + 2g for a raw item, 4 + 4g refined, and 6 + 6g for a Star Gem or unbound gear. Bound
gear can't be sold. The Exchange stocks raw grades 2n−1 and 2n once a stage on continent n has been won, up to 99 per
purchase.

## Craft Level

Each Uma has one profession, **Craft Level** (save key `craft`, D144), raised by every job at the Wilds: the eight
sites, the Workbench, the Forge and the Lapidary ([sections](sections.md#facilities)).

- **Grades:** grade k opens at Craft Lv 5k − 4 (1, 6, 11 … 46), for gathering, refining, crafting and cutting alike.
- **Speed (D139):** set by her Craft Level alone, the same for every grade and every Uma. Aptitude doesn't matter.
  - Gathering one item takes 54 minutes at Lv1, falling evenly to 36 at Lv50, so ten take 9 hours at Lv1 and 6 at Lv50.
    Umas of the same level finish together.
  - A new grade comes at the speed its level gives: G10 (Lv46) is already near the floor.
  - Refining takes a quarter of that (D101); crafting and cutting take twice that.
  - A level-3 facility works a quarter faster.
- **Pace (D96):** a level takes 12 hours of work at Lv1, rising to 18 at Lv49 (88,200 EXP to Lv50). Working without a
  break, an Uma gains about 2 levels a day early on and reaches Lv50 in about a month (24 days at a level-3 facility).
  Batch size doesn't change it: EXP is paid per minute of work.
- **A job:**
  - An Uma makes its outputs one after another. Her work is her own row (SC3): she holds one slot from the moment a job
    starts until Collect frees her or she's recalled, so she works in one place at most. Starting a job on an Uma whose
    work is finished collects it first.
  - Every job runs in the shared work engine, `@luismlorenzana/uma-work`, the same code as uma-racer's; this game
    supplies its kinds (gather, refine, craft, cut), its facilities and its Craft Level.
  - **Batches (D139):** gathering, crafting and cutting make 1–10; refining makes ×1, ×4, ×8, ×20 or ×40, so a ×40
    refine takes as long as a 10-item gather.
  - Inputs are reserved at the start.
  - Craft EXP is 2 per minute of the job at her level, before the facility's speed, so every job levels at the
    same rate per hour.
- **Queues:** up to three more jobs wait behind the current one, for the same Uma at the same place. Each starts the
  moment the one before ends and takes its inputs then, so a chain catches up however late it's collected. If the
  Warehouse can't cover the next one, the queue **stops**: it waits on the facility's page to be restarted (its first
  job starts now) or dismissed (SC3).
- **Offline:** everything runs from start times, so jobs finish while the app is closed. Push notifications say when
  ([sections](sections.md#global-ui)).
- **Recall:** pays what's finished and returns the inputs of everything unfinished, the item in progress included. The
  queue drops and Repeat forgets her last job. Only the time is lost.
- **Repeat (SC3):** starts her last job again where she did it, or in another free slot there if hers is taken; on an
  Uma whose work is finished it collects first.
- **Speed Tickets** never spend more than finish the job: asking for more spends only what's needed.
- **Targets:** mark up to ten Umas total on their profiles. Every facility then lists what maxing them still
  takes from it:
  - **The Forge:** every grade above the best she has bound, up to 10, on her class's five weapons, her five armor
    slots' kinds and the type in each accessory slot (an empty one plans nothing).
  - **The Lapidary:** a Star Gem for each Extra Stats node she hasn't opened.
  - **The Workbench and sites:** the refined and raw items those still need.
  - **Each line** shows the total need, what's in the Warehouse and what's coming. It stays until the Warehouse holds
    enough, then goes.
  - **Cascade:** only what's still short (not in stock, not being made) reaches the materials, so when a line is
    covered every line below it for that need goes too.
  - **Stock held by queued jobs** isn't counted as free, and a queued job counts as coming only if its inputs are in
    the Warehouse.
  - **Leaving the list:** a piece she binds or a gem she sets drops off. Several targets add up.
  ([design](../design/gear-and-targets.md))
- **Upgrades:**
  - Facilities level 1–3: 3, 4, then 5 slots, and speed at level 3 (D144).
  - The cost is Laurels plus refined items of the facility's two families. A site's two families are its own and its
    gear-recipe partner (Ores and Crystals, Woods and Essences, Hides & Scales and Bones & Horns, Stones and Fibers);
    buildings take Stones and Woods.

<!-- live:jobs -->
| Setting | Value |
|---|---|
| Gather one item | any grade, by Craft Level: 54 min at Lv1, falling evenly to 36 min at Lv50 (ten in 9 h and 6 h) |
| Refine one item | a quarter of that: 13.5 min at Lv1, 9 min at Lv50 |
| Craft or cut one | twice a gather: 108 min at Lv1, 72 min at Lv50 |
| Craft EXP | 2 per minute of the job at her level, before the facility's speed |
| Outputs per job | gathering, crafting and cutting 1–10; refining ×1, ×4, ×8, ×20, ×40 |
| Jobs queued after it | 3 |
| Facility levels | 1–3: 3, 4, 5 Uma slots; speed ×1, ×1, ×1.25 |
| Upgrade to Lv 2 / 3 | 150 Laurels + 1× grade-2 refined of each of its two families / 500 Laurels + 2× grade-5 refined of each of its two families |
| Extra Stats and armor points | +1 to its stat per point (+5 HP); Speed 0.6% evasion; Limit +0.4 starting charge |
<!-- /live -->

## Extra Stats and gear

**Extra Stats** (the Observatory):
- Each Uma has a map of 100 nodes: 80 moons, 16 bridges and 4 Sun nodes.
- **Setting a Star Gem** (D144) opens the node of its own grade and uses the gem up. The Lapidary cuts them
  ([materials](materials.md#star-gems)). Nodes open in order (D119): a gem waits until every lower node of its track
  is open, and a grade she has set is spent, so the Observatory lists only the gems she can set now:
  - a moon gem of grade n opens moon n of its stat;
  - bridge gems (grades 3 and 7) open bridges;
  - Sun gems (grades 4, 6, 8 and 10) open Sun nodes.
- **Active nodes:** 5 + ⌊level ÷ 2⌋ at a time (5 at Lv 1, 30 at Lv 50), changed freely.
- **Points, worth the node's grade (D141):** a moon of grade g gives g points to its stat (moon 7: 7), a bridge g ÷ 2 to
  each of its two, a Sun node g ÷ 8 to all eight. A full track of ten moons is 55 points; since D139 every grade takes the
  same time to cut, so a higher grade pays in what it gives.
- **What a point does (D104, flat):**
  - ATK, MATK, DEF, MDEF or MP: +1. HP: +5.
  - Speed: 0.6% evasion (up to 50%).
  - Limit: a 0.4 head start on the Limit Break gauge.

**Gear** (the Forge, [materials](materials.md#gear)):
- **Slots (D124):**
  - her class's five weapon slots;
  - five armor slots (head, body, legs, arms, feet), each holding its physical or its magical piece;
  - two accessory slots, holding two accessories of different types.

  An empty weapon or armor slot holds the Training piece of its kind (grade 0, no stats); an empty accessory slot holds
  nothing.
- **What it does (D104, D124):**
  - A weapon's **Might** adds to the offense of the hits made with that weapon (D142, D143): 1, 4, 8, 12, 19, 26, 35, 45, 57, 68
    for grades 1–10. Each is set so that at the level its grade opens (Lv 5g − 4) the weapon adds about 6% × g to an
    on-curve Uma's hits; worn ahead of its level it is worth more, kept long after less.
  - Armor: ATK (physical) or M.ATK (magical) +⌈g ÷ 2⌉ (D143), and its slot's defensive stat +2g (D141). Head DEF, body HP, legs MP,
    arms MDEF, feet Speed.
  - An Orb adds its kind to every hit, for weaknesses. A Talisman or an Amulet gives one defensive effect, a share of
    her own numbers so it keeps its worth at every level ([combat](combat.md#damage), D141).
- **Wearing a grade:** grade g needs her Weapon Rank (for a weapon), Armor Rank (for its kind) or Accessory Rank (for
  the accessory's kind) ≥ g.
- **Binding:** equipping a piece from stock binds it to that Uma. She can swap among her own pieces freely.
- **In order (D119):** each weapon, each armor kind and each accessory type is a track she climbs one grade at a time.
  From the stock she can bind only the grade above the best she has on that track (her Training piece is grade 0), so
  grade 1 comes first and a grade she has bound is spent. A slot's sheet shows her best piece (and the one she wears)
  and the stock above it.
- **Standard preset (D164):** "Use the standard preset", at the top of the Gear tab, puts on her active class's preset
  ([classes](classes.md#weapons)): the class's five default weapons, its armor half in all five slots, its Orb in
  accessory 1 and its support in accessory 2.
  - **What it wears:** on each of those types, her best own piece her rank allows. Then **the climb**: from her best
    grade, it binds each next grade while the stock has it and her rank allows it, and wears the top, as tapping a sheet
    grade by grade does. With nothing, a weapon or armor slot holds its Training piece; an accessory slot keeps what it
    holds, unless the other slot now takes that type, and then it empties.
  - **What it never binds:** a grade above her rank, armor of the other half, other accessory types or weapons outside
    the spread. Pieces on her other weapons stay on (they serve her other classes); armor of the other half goes back to
    her locker. Her learned and equipped skills stay; one outside the new trees isn't used.
  - **Binding asks first:** when it would bind from the stock, a sheet lists those pieces ("Binds to her for good").
    With nothing to change, the button reads "Standard preset on".

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
  level for her: Lv 45 pays half, Lv 55 the same as Lv 50 (fighting above her never pays more). Past a max rank it
  banks as Marks. No Uma EXP, Laurels, Shards or Bonds.
- **Sweeps:** a won Echo, by a full party of Lv 50 Umas, one Sweep Ticket each, 1–99 at a time. Each pays an Echo win,
  her five weapons sharing evenly. They record no faces and earn no achievements.
- **Ascend:** once the run is won, its twenty move up a tier together, in one step: no Rift or world-map fight open,
  and none of them at work ("Recall or collect").
  - **They leave** the old world's Stable, parties, targets, carried MP, Hall seats and work. A Hero's seat empties and
    its Learners leave it. Every piece of gear they owned goes back to the old world's stock; Star Gems set on their
    maps are gone.
  - **They arrive** at Lv 1 with Class Rank 1 everywhere, no skills, Training gear, an empty Extra Stats map, Craft Lv 1
    and no Bonds. Each keeps her class and her armor halves.
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
