# The world map

> **Status: design, owner's answers of 2026-10-11 folded in (D66).** If built, it replaces chapters and runs
> ([battles.md](../battles.md), D48 and D52). Not built yet. Companion pages: [research.md](research.md) (how other
> games do it), [regions.md](regions.md) (biomes and continents), [encounters.md](encounters.md) (what makes the fights
> differ) and [themes.md](themes.md) (elements or franchises). The token loop it feeds is in [../loop.md](../loop.md).

## What you asked for

- Chapters tie progress to a party; the next party replays the same fights. Instead: **level many Umas, mix and match
  freely, bring high-level Umas with low-level ones.**
- **Five continents**, one per scenario of the tier, each covering its ten levels (1–10, 11–20 …), each a big map of
  regions (swamps, ice, mountains, deserts …). **Fixed levels, and a ton of them**, balanced for about 20 parties (D71).
- **Variety**: solo fire+dark and fire+light foes on volcanoes; dark plus one element in the underworld; light plus
  one element on sky islands; fights with 8 foes and fights with 2.
- **One active party**, swappable any time on any map. **Full HP every stage; MP carries, with restore points.**
- Simple on a phone: a grid you tap to zoom in, plain art first.

## The shape

| Layer | How many | What it is |
|---|---|---|
| **World** | 1 per tier | Five continents on one screen |
| **Continent** | 5 (one per scenario) | Ten levels; a map of 40 regions, four at each level, plus a capital and five Springs |
| **Region** | 40 per continent | One biome at **one fixed level** (Volcano Lv8, Swamp Lv3 …) |
| **Stage** | 12 per region | One battle of 1–3 waves; the 11th an elite, the 12th the region boss |
| **Wave** | 1–3 per stage | 1–8 foes; HP and MP carry between waves of one stage |

**48 stages at every level, 480 a continent, 2,400 a tier** (D71). Stages are generated from authored region data (no
hand-placed fights), so a rebalance never needs new content.

## Levels: fixed, and a ton of them

- Every region has one level; every level has four regions (four biomes), so **48 stages per level**.
- **About 4 hours of fighting takes a fresh party from Lv1 to Lv50** (D71): about 120 stages, at about 0.4 of a level
  per regular stage (more for elites and bosses). About 20 parties make the 100-hour mark. Low Umas next to high ones get there faster: the catch-up rule pays
  ±10% EXP per level of gap, from 10% to 200%.
- So a fresh party needs two or three stages per level, and **a level's 48 stages are fresh first clears for about 20
  parties**. Replays pay in full.
- **First clears** pay a bonus (triple Laurels). Sweep Tickets work on any cleared stage.

## One active party, MP that carries

- You have **one active party**: any of your 20 saved parties, or edit one on the spot. Swap it from the world,
  continent or region map at any time except mid-fight.
- **Every stage starts at full HP. MP stays with each Uma** from stage to stage (and between waves).
- **Springs** refill MP: **five per continent** (one every two levels, 25 a tier). A Spring refills the active party's
  MP, then **recharges for 2 hours**. In a session that's 25 refills per two hours, so a party running dry is a nudge
  to swap to a fresh one; after a break, every Spring is ready again.
- **Progress belongs to your world, not to a party.** A cleared stage is cleared for everyone.
- **One fight open at a time**, saved and replayed exactly as today (D52's frozen input plus actions).

## Exploring

- **Everything is open from the start**: all five continents and all their regions. The levels tell you where to go.
- Inside a region, stages open in order; any cleared stage can be replayed.
- Each continent's **capital** (Lv 10 of its band) holds the scenario's authored Finals (uma-racer's fourteen, D48),
  so each scenario keeps its identity.

## Variety

Each region is a biome, and each biome sets an **element mix**, a **formation lean** and later a **field effect**:
15 element signatures (five single elements, ten pairs), eight formation templates from a solo elite to an eight-foe
swarm, four foe roles, 1–3 waves. A region's twelve stages never repeat a combination. Full lists in
[regions.md](regions.md) and [encounters.md](encounters.md). Foes wear the PriConne cast's faces (D50); themed regions
come later ([themes.md](themes.md)).

## On the phone

| Screen | Shows | Taps |
|---|---|---|
| **World** | Five continents on one screen, each with its band and % cleared | A continent zooms in |
| **Continent** | Ten rows, one per level (low at the bottom), four region cells each, colored and iconed by biome; Springs between rows; the capital on top | A region zooms in; a Spring refills MP |
| **Region** | Its twelve stages on one short path, the boss at the end | A stage opens its sheet: level, foes and waves, elements and weaknesses once seen, rewards, **Fight** |

- The **active party chip** sits at the top of all three screens, with each Uma's MP; tapping it swaps parties.
- **Art, lean first**: flat biome-colored cells with a code-drawn icon per biome, like the Hub's markers before P38.
  Biome tiles come in a later uma-platform round.

## What changes in the game

| Area | Change |
|---|---|
| Domain | A `world` module: continent and region data (authored), a seeded stage generator (versioned, so stage ids never move) |
| Save | `progress` (first clear and wins per stage), `activeParty`, each Uma's **MP**, and each Spring's last use replace `runs`. A migration drops chapter runs; Uma levels, skills, items, tokens and gear stay; an open chapter fight closes with no loss |
| Battle engine | Up to **8 foes**, **dual-element foes**, **waves**; field effects later |
| Battle stage | A two-row layout for 6–8 foes; a wave transition |
| Rewards | EXP per stage kind (regular ≈ 0.4 of a level), Laurels with a first-clear bonus, **tokens of the band** ([../loop.md](../loop.md)) |
| Tier Finale (S8, parked) | Fits as each capital's last fight or a sixth "continent" |

## Build order

| Step | What | Playable result |
|---|---|---|
| W1 | The world generator in the domain, with tests (counts, levels, no repeated combination in a region) | — |
| W2 | World, continent and region screens with flat art; active party; carried MP and Springs; stages on today's engine (≤5 foes, one element each); save migration | The new loop end to end |
| W3 | Engine and stage: 6–8 foes, dual elements, waves | The variety you described |
| W4 | Field effects and home ground; a campaign sim to tune EXP, budgets and token drops | Biomes that play differently |
| W5 | Art: biome tiles; themed regions if wanted | The map looks like a world |

## Decided (owner, 2026-10-11)

1. **Fixed levels**, with a ton of stages per level (48, D71).
2. **Full HP every stage; MP carries**, refilled at Springs that recharge every 2 hours.
3. **Everything open** from the start.
4. **Lv1 → 50 in about 4 hours of fighting** for a fresh party, so about 20 parties make the 100-hour mark (owner,
   D71); the loop's passive steps pace it in practice.
5. **The PriConne cast everywhere**; themed worlds or regions later.
