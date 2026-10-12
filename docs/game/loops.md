# Game loops

What the player does, what it pays and what it costs. Numbers come from the code: generated tables between `live`
markers, the rest checked against `packages/domain/src/economy/`, `save/` and `rpg/`. Only Tier 1 exists today. There
is no promotion yet, and the Tier Finale is a locked place.

## The loop

```
 Unlock Umas ─► build parties ─► fight on the world map ─► Uma EXP, Class, Weapon and Armor EXP, Laurels, Shards
       ▲                                                          │
       │            ┌────── ranks (deeper skills, higher grades) ◄┤── Marks past a max rank ─► Manuals
       │            ▼                                             ▼
   Shards ─► Tickets                                      Exchange: raw items, tickets, Manuals
                                                                  │
                                                                  ▼
                                            gather ─► refine ─► cook (dishes ─► Extra Stats)
                                                              └─► craft (weapons, armor, Orbs)
                                    └────────► a stronger party fights higher levels
```

Fights are active play. Everything else is jobs that run in real time, offline included, and pay when collected.

## Collection and parties

- **Start:** 20 Unlock Tickets and no Umas. One Ticket unlocks one outfit, for good.
- **Shards:** an Uma earns one at Lv 10, 20, 30, 40 and 50 (Tier 1), from fights and Sweeps alike. Five Shards make a
  Ticket automatically, so every Uma who reaches Lv 50 pays back one Ticket. Tickets have no other source or use.
- **Parties:** 20 parties of 5. An Uma belongs to at most one party; adding her to another moves her.
- **Active party:** the one that fights, sweeps and drinks at Springs. You can switch any time no fight is open. A fight
  needs all five slots filled and nobody working.
- **Classes:** switching is free. A new Uma starts in her running style's class ([classes](classes.md)).

## Leveling

<!-- live:levels -->
| Level | Uma EXP to next | Profession EXP to next |
|---|---|---|
| 1 | 136 | 1440 |
| 8 | 248 | 1545 |
| 15 | 360 | 1650 |
| 22 | 472 | 1755 |
| 29 | 584 | 1860 |
| 36 | 696 | 1965 |
| 43 | 808 | 2070 |

Uma EXP to next level: 120 + 16 × level, up to Lv 50. A stage pays its weight × her own EXP to next level, −10% per level she's above the foes (down to 10%), never more than 100%. Shards at Lv 10, 20, 30, 40, 50. Profession EXP to next: 1,425 + 15 × level; jobs pay 2 EXP per base minute of work, so a level takes 12 base hours at Lv1 and 18 at Lv49.
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

Past a max rank, EXP banks at 50% as Marks: Gear Marks from weapons and armor, Class Marks from classes. A Manual costs 1,000 Marks and gives 1,000 EXP to one bar of one Uma. Armor kinds by slot: Head Helm or Circlet; Body Cuirass or Robe; Legs Greaves or Leggings; Arms Gauntlets or Bracers; Accessory Arms Orb or Elemental Orb. 10 kinds in all.
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
- A loss, or giving up, pays nothing and costs nothing (MP is as it was before the fight).
- There are no tokens (D105).

## Currencies

| Currency | Earned | Spent |
|---|---|---|
| Laurels | Fights and Sweeps; selling stock | The Exchange; facility upgrades |
| Time Tickets | The Exchange | 30 minutes off a running job (or "Finish": one per 30 minutes left) |
| Sweep Tickets | The Exchange | One Sweep of a cleared regular stage |
| Unlock Tickets | 20 at the start; 5 Shards each | Unlocking an outfit |
| Shards | Lv 10, 20, 30, 40, 50 | Turned into Tickets automatically |
| Gear Marks | Weapon and Armor EXP past Rank 10, at half rate | Weapon and Armor Manuals |
| Class Marks | Class EXP past Rank 50, at half rate | Class Manuals |

<!-- live:prices -->
| Thing | Price (Laurels) |
|---|---|
| Raw item, grade 1 | 20 |
| Raw item, grade 4 | 50 |
| Raw item, grade 7 | 80 |
| Raw item, grade 10 | 110 |
| Time Ticket | 10 |
| Sweep Ticket | 15 |

A Time Ticket takes 30 minutes off a running job. A Manual costs 1,000 Marks, not Laurels.
<!-- /live -->

Selling pays 2 + 2g for a raw item, 4 + 4g refined, and 6 + 6g for a dish or unbound gear. Bound
gear can't be sold. The Exchange stocks raw grades 2n−1 and 2n once a stage on continent n has been won, up to 99 per
purchase.

## Professions

Two professions with one curve, raised by jobs at the facilities ([sections](sections.md#facilities)):

| Profession | Save key | Facilities | Aptitude that speeds it |
|---|---|---|---|
| **Farm Level** | `farming` | The eight farm sites, the Pantry, the Kitchen | Turf |
| **Craft Level** | `gathering` | The eight Wilds sites, the Workbench, the Forge | Dirt |

- **Grades:** grade k opens at profession Lv 5k − 4 (1, 6, 11 … 46).
- **Pace (D96):** a level takes 12 base hours of work at Lv1, rising to 18 at Lv49 (88,200 EXP to Lv50). Working
  without a break, that's about 4 levels a day at A aptitude, 3 at C and 2 at G early on, and Lv50 in about 15 days at A
  (12 with a level-3 facility) or a month at G. Batch size doesn't change it: EXP is paid per minute of work.
- **A job:**
  - An Uma makes 1–10 outputs, one after another, and takes up a slot until it's done or recalled.
  - Inputs are reserved at the start.
  - Real time is the base time × her aptitude share (S/A 0.5 … G 1) ÷ the facility's speed.
  - Refining takes a quarter of gathering's base time (D101); cooking and crafting take two items' worth.
  - Profession EXP is 2 per base minute of the job itself, whatever the speed, so every job levels at the same rate per
    hour: refining pays a quarter of gathering's EXP per item.
- **Queues:** up to three more jobs wait behind the current one, for the same Uma. If the Warehouse can't cover the
  next one, the queue drops.
- **Offline:** everything runs from start times, so jobs finish while the app is closed. Push notifications say when
  ([sections](sections.md#global-ui)).
- **Recall:** pays what's finished and returns the inputs of everything unfinished. Only the time is lost.
- **Targets (D100):** mark up to five Umas on their profile. Every facility then lists what maxing them still takes
  from it: a dish for each Extra Stats node they haven't opened, and the best piece their ranks let them wear in each
  of their ten gear slots (their class's five weapons, their five armor slots' kinds). Needs cascade: the pieces and
  dishes still short need refined items, and those still short need raw ones. The Warehouse and running or queued jobs
  count first.
- **Upgrades:**
  - Facilities level 1–3: more slots, then speed.
  - The cost is Laurels plus refined items of the facility's two families. A site's two families are its own and its
    mirror on the other side; buildings take Stones and Woods.

<!-- live:jobs -->
| Setting | Value |
|---|---|
| Gather one item | grade g: 30 + 30 × g minutes (G1 60 min, G10 330 min) |
| Refine one item | a quarter of that (G1 15 min, G10 82.5 min) |
| Cook or craft one | twice that: 60 + 60 × g minutes |
| Outputs per job | up to 10 |
| Jobs queued after it | 3 |
| Facility levels | 1–3: 2, 3, 3 Uma slots; speed ×1, ×1, ×1.25 |
| Upgrade to Lv 2 / 3 | 150 Laurels + 1× grade-2 refined of each of its two families / 500 Laurels + 2× grade-5 refined of each of its two families |
| Extra Stats and armor points | +1 to its stat per point (+5 HP); Speed 0.6% evasion; Limit +0.4 starting charge |
<!-- /live -->

## Extra Stats and gear

**Extra Stats** (the Observatory):
- Each Uma has a map of 100 nodes: 80 moons, 16 bridges and 4 Sun nodes.
- **Eating a dish** unlocks the lowest node it reaches and uses the dish up:
  - a planet dish of grade n opens moon n of its stat;
  - Duo dishes open bridges;
  - Feasts open Sun nodes.
- **Active nodes:** 5 + ⌊level ÷ 2⌋ at a time (5 at Lv 1, 30 at Lv 50), changed freely.
- **Points:** a moon gives 1 point to its stat, a bridge ½ to each of its two, a Sun node ⅛ to all eight.
- **What a point does (D104, flat):**
  - ATK, MATK, DEF, MDEF or MP: +1. HP: +5.
  - Speed: 0.6% evasion (up to 50%).
  - Limit: a 0.4 head start on the Limit Break gauge.

**Gear** (the Forge, [materials](materials.md#gear)):
- **Slots (D103):** her class's five weapon slots and five armor slots (head, body, legs, arms, accessory), each armor
  slot holding its physical or its magical kind. An empty slot holds the Training piece of its kind: grade 0, no stats.
- **What it does (D104):**
  - A weapon's **Might**, +4 a grade, adds to the offense of hits made with that weapon.
  - Physical armor: +1 DEF a grade and a **Barrier** of 5 a grade at the start of each fight.
  - Magical armor: +1 MDEF a grade and **Regen** of 1 HP a grade at the end of each round.
  - An armor piece's accent: +⌈g ÷ 2⌉ points to its stat. An Orb adds its kind to every hit, for weaknesses.
- **Wearing a grade:** grade g needs her Weapon Rank (for a weapon) or Armor Rank (for its kind) ≥ g.
- **Binding:** equipping a piece from stock binds it to that Uma. She can swap among her own pieces freely.

## Springs, replays and Sweeps

- **Springs** (5 per continent): refill the active party's MP, then recharge for 2 hours. Not during a fight.
- **HP** is full every stage. **MP** carries after a win.
- **Replays:** any cleared stage, for a quarter of its first-clear rewards.
- **Sweeps:** a cleared regular stage (1–10), paid like a replay, for one Sweep Ticket, 1–99 at a time. Each needs the
  active party full and idle, and no open fight. MP isn't touched.
- **One open fight** in the whole world. While it's open, its Umas can't change parties or take jobs, and the active
  party, Springs and Sweeps are locked. The fight is stored as its input plus every action ([combat](combat.md)).
