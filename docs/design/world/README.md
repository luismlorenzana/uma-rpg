# The world map (proposal)

> **Status: proposal for owner review, 2026-10-10.** If approved, it replaces chapters and runs
> ([battles.md](../battles.md), D48 and D52). Nothing here is built yet. Companion pages:
> [research.md](research.md) (how other games do it), [regions.md](regions.md) (biomes and continents),
> [encounters.md](encounters.md) (what makes 1,000 fights differ) and [themes.md](themes.md) (elements or franchises).
> "Your calls" at the end lists the choices I made for you; each stands unless you change it.

## What you asked for

- Chapters tie progress to a party. Once a chapter is done with one party, the next party replays the same fights, and
  a party built around a favorite (or one leader with weaker Umas) feels locked in.
- Instead: **level many Umas, mix and match freely, bring high-level Umas with low-level ones.**
- **A world of five continents**, one per scenario of the tier, each covering its ten levels (1–10, 11–20 …).
- **Each continent is a big map of regions**: swamps, ice, mountains, deserts and more. Authored once per continent;
  every continent can have every kind of region.
- **Enough stages for many parties**: if ten fights move one party through a scenario, twenty parties' worth means
  **200 stages a continent** or more.
- **Simple on a phone**: a grid you tap to zoom in, plain art first.
- **Variety above all**: solo fire+dark and fire+light foes on volcanoes; dark plus one element in the underworld;
  light plus one element on sky islands; fights with 8 foes and fights with 2.
- **No chapters**: one active party, swappable any time on the world, continent or region map.

## The shape

| Layer | How many | What it is |
|---|---|---|
| **World** | 1 per tier | Five continents on one screen |
| **Continent** | 5 (one per scenario) | A ten-level band; a grid map of 20 regions around a capital |
| **Region** | 20 per continent (a 21st, the franchise Rift, later) | One biome (Volcano, Swamp, Sky Isles …): its element mix, its formations, its look |
| **Stage** | 10 per region | One battle of 1–3 waves; the 9th is an elite, the 10th the region boss |
| **Wave** | 1–3 per stage | 1–8 foes; HP and MP carry between waves of one stage |

**200 stages a continent, 1,000 a tier**, generated from authored region data (no hand-placed fights), so a rebalance
never needs new content.

## One active party, no chapters

- You have **one active party**: any of your 20 saved parties, or edit one on the spot. Swap it from the world,
  continent or region map at any time except mid-fight.
- **Stages are independent**: every stage starts at full HP and MP. Inside a multi-wave stage, HP and MP carry between
  waves; that's where attrition lives now (it replaces chapter camps and carried MP).
- **Progress belongs to your world, not to a party.** A cleared stage is cleared for everyone; any party can replay
  it.
- **One fight open at a time**, saved and replayed exactly as today (D52's frozen input plus actions).

## Levels that follow you

The core trick: **regions have level windows, and stages meet your party inside the window.**

- Each continent covers its band (Continent 1: Lv1–10). Regions near the landing coast have low windows, the far side
  high ones, and the capital sits at the top (details in [regions.md](regions.md)).

  | Ring | Regions | Window (Continent 1) |
  |---|---|---|
  | Coast (landing) | 6 | Lv 1–4 |
  | Heartland | 7 | Lv 3–7 |
  | Frontier | 6 | Lv 6–10 |
  | Capital | 1 | Lv 10 |

- **A stage's foe level is your party's average level, clamped to its region's window.** A fresh party of Lv1s and a
  Lv4 party both meet a Coast region at their own level. So every stage you haven't cleared is fresh for whichever
  party you bring: twenty parties can each find new stages at their level, instead of replaying the same ten.
- **Mixing levels works**: one Lv10 with four Lv2s averages 3.6, so the foes are Lv4. The Lv2s earn the catch-up bonus
  (today's rule: ±10% EXP per level of gap, from 10% to 200%), and the Lv10 earns little but carries the fight.
- **EXP per stage** stays at today's scale (about 0.4 of a level for a regular stage, more for elites and bosses), so
  about **20–25 stages take a fresh party through a continent's ten levels**. 200 stages is 8–10 parties' worth of
  fresh stages before any catch-up, and well past 20 once low Umas ride with high ones.
- **First clears** pay a bonus (triple Laurels); replays pay in full as today; Sweep Tickets work on any cleared stage.

## Exploring

- **All five continents are open from the start**, as chapters are today; their bands tell you where to go.
- Inside a continent, you land on the coast with **two regions open**. **Beating a region's boss opens its neighbors**
  on the grid, so the map fills in like fog of war.
- Inside a region, stages open in order; any cleared stage can be replayed.
- The **capital** opens once any three Frontier regions are beaten. It holds the scenario's authored Finals (uma-racer's
  fourteen, D48): the scenario's identity lives there.

## Variety

Each region is a biome, and each biome sets an **element mix**, a **formation lean** and later a **field effect**.
There are **15 element signatures** (five single elements and ten pairs), **eight formation templates** (from a solo
elite to an eight-foe swarm, plus escorts, ambushes and wave fights) and four foe roles. A stage generator picks from
its region's lists without repeating a combination inside the region. Full lists in [regions.md](regions.md) and
[encounters.md](encounters.md).

Two later levers:
- **Field effects**: the Volcano feeds fire, the Glacier slows the party's first turn, and so on.
- **Home ground**: an Uma's own aptitudes give a small edge in matching biomes. Dirt runners do well in deserts and
  canyons, Turf runners in meadows and forests.

Both make *which* party you send matter, not just its level.

## On the phone

| Screen | Shows | Taps |
|---|---|---|
| **World** | Five continents on one screen, each with its band and % explored | A continent zooms in |
| **Continent** | A 6 × 9 grid of region cells, colored and iconed by biome, locked ones under fog, the capital at the top | A region zooms in |
| **Region** | Its ten stages on one short path (today's chapter map, one screen tall), the boss at the end | A stage opens its sheet: level, foe count and waves, elements and weaknesses once seen, rewards, **Fight** |

- The **active party chip** sits at the top of all three screens; tapping it swaps parties.
- **Art, lean first**: flat biome-colored cells with a code-drawn icon per biome, using the Hub's tile approach. A
  later uma-platform round draws biome tiles and a small set of monster families (see [themes.md](themes.md)).

## What changes in the game

| Area | Change |
|---|---|
| Domain | A `world` module: continent and region data (authored), a seeded stage generator (versioned, so stage ids never move), level clamping |
| Save | `progress` (first clear and wins per stage) and `activeParty` replace `runs`. A migration drops chapter runs; Uma levels, skills, items and gear stay. An open chapter fight closes with no reward and no loss |
| Battle engine | Up to **8 foes**, **dual-element foes**, **waves** (in that order of need); field effects later |
| Battle stage | A two-row layout for 6–8 foes; a wave transition |
| Rewards | Per stage kind (regular, elite, boss), first-clear bonus; Shards stay on Uma levels |
| Tier Finale (S8, parked) | Fits as a sixth "continent" or as each capital's last fight |

## Build order

| Step | What | Playable result |
|---|---|---|
| W1 | Spec and the world generator in the domain, with tests (counts, windows, no repeated combination in a region) | — |
| W2 | World, continent and region screens with flat art; active party; stages on today's engine (≤5 foes, one element each); save migration | The new loop end to end |
| W3 | Engine and stage: 6–8 foes, dual elements, waves | The variety you described |
| W4 | Field effects and home ground; a campaign sim to tune EXP and budgets | Biomes that play differently |
| W5 | Art: biome tiles, monster families; franchise realms if wanted | The map looks like a world |

## Your calls (my defaults)

1. **Stages scale to your party's average level inside the region's window.** The alternative is fixed levels, which
   brings back replaying the same fights.
2. **Full HP and MP every stage**, with attrition inside multi-wave stages. The alternative is MP carried across a
   region, like chapters.
3. **All continents open from the start.** The alternative is opening them in order.
4. **20 regions × 10 stages a continent.** Easy to grow later: new regions slot into the grid.
5. **Foe faces: the PriConne cast everywhere at first**, original monster families later for regular foes, franchise
   realms as optional extras ([themes.md](themes.md)).
