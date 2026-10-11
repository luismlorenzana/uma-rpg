# Game loops

What the player does, what it pays and what it costs. Numbers come from the code: generated tables between `live`
markers, the rest checked against `packages/domain/src/economy/`, `save/` and `rpg/`. Only Tier 1 exists today. There
is no promotion yet, and the Tier Finale is a locked place.

## The loop

```
 Unlock Umas ─► build parties ─► fight on the world map ─► EXP, Laurels, tokens, Shards
       ▲                                                          │
       │            ┌────────────── tokens ◄──────────────────────┤
       │            ▼                                             ▼
   Shards ─► Tickets      train class ranks (Learning)     Exchange: buy raw items, tickets, tokens
                            │                                     │
                            ▼                                     ▼
                     deeper skills          gather ─► refine ─► cook (dishes ─► Extra Stats)
                                                              └─► craft (gear ─► points, Orbs)
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
| 1 | 136 | 26 |
| 8 | 248 | 68 |
| 15 | 360 | 110 |
| 22 | 472 | 152 |
| 29 | 584 | 194 |
| 36 | 696 | 236 |
| 43 | 808 | 278 |

Uma EXP to next level: 120 + 16 × level, up to Lv 50. A stage pays its weight × the EXP to next level at the foes' level, ±10% per level of gap (from 10% to 200%). Shards at Lv 10, 20, 30, 40, 50. Profession EXP to next: 20 + 6 × level; jobs pay 2 EXP per minute of work.
<!-- /live -->

- Level cap 50. At Lv 50 EXP keeps banking; nothing spends it yet (it's planned for promotion).
- Every entrant is paid, knocked out or not.
- A region's first clear at its level pays about six levels of EXP. Low Umas next to high ones catch up fast: up to 2×
  when the foes are ten or more levels above her.

## Laurels, EXP and tokens

<!-- live:laurels -->
| Stage kind | Laurels per win | First clear | Replay or Sweep | Lv 41–50 first clear | EXP weight |
|---|---|---|---|---|---|
| Fight | 10 | 30 | 8 | 120 | 0.4 |
| Sub-boss | 25 | 75 | 19 | 300 | 0.6 |
| Vanguard | 30 | 90 | 23 | 360 | 0.6 |
| Boss | 50 | 150 | 38 | 600 | 0.8 |

A stage in waves pays ×1.5 EXP and Laurels. Replays and Sweeps pay 25% of the first clear's EXP and Laurels.
<!-- /live -->

- **First clear** of a stage pays its Laurels ×3. **Later wins** pay a quarter of the first clear: EXP, Laurels, and
  each token's chance. Sweeps count as wins.
- **Lv 41–50** stages pay their Laurels ×4 (D82), so endgame fights fund extra classes.
- A loss, or giving up, pays nothing and costs nothing (MP is as it was before the fight).
- Tokens by kind and band: [materials](materials.md#tokens). An elite's or boss's first token is always a Promotion
  Token (band 5 has none, since class ranks stop at 5); every other token is Cooking, Crafting or Promotion by chance.

## Currencies

| Currency | Earned | Spent |
|---|---|---|
| Laurels | Fights and Sweeps; selling stock | The Exchange; facility upgrades |
| Time Tickets | The Exchange | 30 minutes off a running job or training (or "Finish": one per 30 minutes left) |
| Sweep Tickets | The Exchange | One Sweep of a cleared regular stage |
| Unlock Tickets | 20 at the start; 5 Shards each | Unlocking an outfit |
| Shards | Lv 10, 20, 30, 40, 50 | Turned into Tickets automatically |
| Tokens | Fights and Sweeps; the Exchange | Class ranks, dishes, gear; the Exchange |

<!-- live:prices -->
| Thing | Price (Laurels) |
|---|---|
| Raw item, grade 1 | 20 |
| Raw item, grade 4 | 50 |
| Raw item, grade 7 | 80 |
| Raw item, grade 10 | 110 |
| Time Ticket | 10 |
| Sweep Ticket | 15 |
| Token, band 1 (sell / buy) | 20 / 40 |
| Token, band 3 (sell / buy) | 60 / 120 |
| Token, band 5 (sell / buy) | 100 / 200 |

A Time Ticket takes 30 minutes off a running job or training.
<!-- /live -->

Selling pays 2 + 2g for a raw item, 4 + 4g refined, 6 + 6g for a dish or unbound gear, and 20 × band for a token. Bound
gear can't be sold. The Exchange stocks raw grades 2n−1 and 2n once a stage on continent n has been won, up to 99 per
purchase.

## Professions

Two professions with one curve, raised by jobs at the facilities ([sections](sections.md#facilities)):

| Profession | Save key | Facilities | Aptitude that speeds it |
|---|---|---|---|
| **Farm Level** | `farming` | The eight farm sites, the Pantry, the Kitchen | Turf |
| **Craft Level** | `gathering` | The eight Wilds sites, the Workbench, the Forge | Dirt |

- **Grades:** grade k opens at profession Lv 5k − 4 (1, 6, 11 … 46).
- **A job:**
  - An Uma makes 1–10 outputs, one after another, and takes up a slot until it's done or recalled.
  - Inputs are reserved at the start.
  - Real time is the base time × her aptitude share (S/A 0.5 … G 1) ÷ the facility's speed.
  - Profession EXP is 2 per base minute, whatever the speed.
- **Queues:** up to three more jobs wait behind the current one, for the same Uma. If the Warehouse can't cover the
  next one, the queue drops.
- **Offline:** everything runs from start times, so jobs finish while the app is closed. Push notifications say when
  ([sections](sections.md#global-ui)).
- **Recall:** pays what's finished and returns the inputs of everything unfinished. Only the time is lost.
- **Upgrades:**
  - Facilities level 1–3: more slots, then speed.
  - The cost is Laurels plus refined items of the facility's two families. A site's two families are its own and its
    mirror on the other side; buildings take Stones and Woods.

<!-- live:jobs -->
| Setting | Value |
|---|---|
| Gather or refine one item | grade g: 30 + 30 × g minutes (G1 1 h, G10 5 h 30) |
| Cook or craft one | twice that: 60 + 60 × g minutes |
| Outputs per job | up to 10 |
| Jobs queued after it | 3 |
| Facility levels | 1–3: 2, 3, 3 Uma slots; speed ×1, ×1, ×1.25 |
| Upgrade to Lv 2 / 3 | 150 Laurels + 1× grade-2 refined of each of its two families / 500 Laurels + 2× grade-5 refined of each of its two families |
| Class rank | 6 h of training per rank, ranks 1–5 |
| Weapon, Armor and Accessory Levels | 3 h per level, 1–10 |
| Extra Stats | 1.5% to its stat per point; Speed 0.6% evasion; Limit +0.4 starting charge |
<!-- /live -->

## Training

The Learning page's seven halls train ranks ([classes](classes.md#ranks-and-levels)):
- Each class hall trains its class rank (1–5) and that class's Weapon Level (1–10).
- The Armory trains the Armor Level; the Jeweler trains the Accessory Level.

Rules:
- One job trains one rank. The rank is granted on collect, and Time Tickets apply.
- **A class rank-up spends one Promotion Token** of the band of the rank it leaves (rank r → r+1 takes band r). The
  token is taken at the start and refunded on recall. Levels cost time only.
- **Speed:**
  - A class hall goes by its running style (Brawler front, Mage and Spell Blade pace, Cleric late, Summoner end).
  - The Armory goes by her best distance aptitude, the Jeweler by her best running style.
- Training pays no profession EXP.

## Extra Stats and gear

**Extra Stats** (the Observatory):
- Each Uma has a map of 100 nodes: 80 moons, 16 bridges and 4 Sun nodes.
- **Eating a dish** unlocks the lowest node it reaches and uses the dish up:
  - a planet dish of grade n opens moon n of its stat;
  - Duo dishes open bridges;
  - Feasts open Sun nodes.
- **Active nodes:** 5 + ⌊level ÷ 2⌋ at a time (5 at Lv 1, 30 at Lv 50), changed freely.
- **Points:** a moon gives 1 point to its stat, a bridge ½ to each of its two, a Sun node ⅛ to all eight.
- **What a point does:**
  - HP, MP, ATK, MATK, DEF or MDEF: +1.5%.
  - Speed: 0.6% evasion (up to 50%).
  - Limit: a 0.4 head start on the Limit Break gauge.

**Gear** (the Forge, [materials](materials.md#gear)):
- **Slots:** 12, one per weapon type, one armor and one accessory.
- **Wearing a grade:** a piece of grade g needs the matching level ≥ g. For a weapon that's the highest Weapon Level
  among the classes that can wield it.
- **Binding:** equipping a piece from stock binds it to that Uma. She can swap among her own pieces freely.
- **Points:** they add to her stats like Extra Stats.

## Springs, replays and Sweeps

- **Springs** (5 per continent): refill the active party's MP, then recharge for 2 hours. Not during a fight.
- **HP** is full every stage. **MP** carries after a win.
- **Replays:** any cleared stage, for a quarter of its first-clear rewards.
- **Sweeps:** a cleared regular stage (1–10), paid like a replay, for one Sweep Ticket, 1–99 at a time. Each needs the
  active party full and idle, and no open fight. MP isn't touched.
- **One open fight** in the whole world. While it's open, its Umas can't change parties or take jobs, and the active
  party, Springs and Sweeps are locked. The fight is stored as its input plus every action ([combat](combat.md)).
