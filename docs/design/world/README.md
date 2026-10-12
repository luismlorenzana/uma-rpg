# The world map

> **Status: W1–W3 built, refreshed through D97 (2026-10-12).** Each region climbs five levels: rows 1–5 a continent's
> first five, rows 6–10 its last five. A party crosses a continent in two regions; the manual's
> [maps](../../game/maps.md) page generates the current lists. The world map replaces
> chapters and runs ([battles.md](../battles.md), D48 and D52). Next: W4 (field effects and home ground) and W5 (the
> pixel-art maps, [map-art.md](map-art.md)). Companion pages: [research.md](research.md) (how other
> games do it), [regions.md](regions.md) (biomes and continents), [encounters.md](encounters.md) (what makes the fights
> differ) and [themes.md](themes.md) (elements or franchises). The token loop it feeds is in [../loop.md](../loop.md).

## What you asked for

- Chapters tie progress to a party; the next party replays the same fights. Instead: **level many Umas, mix and match
  freely, bring high-level Umas with low-level ones.**
- **Five continents**, one per scenario of the tier, each covering its ten levels (1–10, 11–20 …), each a big map of
  regions (swamps, ice, mountains, deserts …). **Many choices in each five-level half**, balanced for about twenty
  parties (D71, D97).
- **Variety**: solo fire+dark and fire+light foes on volcanoes; dark plus one element in the underworld; light plus
  one element on sky islands; fights with 8 foes and fights with 2.
- **One active party**, swappable any time on any map. **Full HP every stage; MP carries, with restore points.**
- Simple on a phone: a grid you tap to zoom in, plain art first.

## The shape

| Layer | How many | What it is |
|---|---|---|
| **World** | 1 per tier | Five continents on one screen |
| **Continent** | 5 (one per scenario) | Ten levels; forty regions in ten rows of four, plus a capital and five Springs |
| **Region** | 40 per continent | One biome climbing **five levels**: the continent's first or last five (D97) |
| **Stage** | 12 per region | One battle of 1–3 waves; the 11th an elite, the 12th the region boss |
| **Wave** | 1–3 per stage | 1–8 foes; HP and MP carry between waves of one stage |

**480 region stages a continent, 2,400 a tier** (D71). Regions and stages are generated from fixed ids/seeds;
the D97 level change preserves wins because stage ids do not move.

## Levels: five-level climbs

- Twenty regions climb each half-continent (D97). A region's ten regular stages rise two per level; its elite and
  boss wait at the top. A party clears roughly two regions per continent, ten per tier, with frontier replays if
  it leaves slightly short of the next region's first level.
- D71's **four hours for a fresh party** and roughly twenty parties around a hundred hours remain pacing targets,
  not measured guarantees. D97's regular EXP weight is 0.32, elite/boss 0.4, with ×1.5 for waves.
- Catch-up EXP scales ±10% per level gap, from 10% to 200%. Replays never run out but pay a quarter of first-clear
  EXP/Laurels and token drop chances (D79).
- **First clears** pay a bonus (triple Laurels). Sweep Tickets replay any cleared regular stage and pay as a replay.

## One active party, MP that carries

- You have **one active party**: any of your 20 saved parties, or edit one on the spot. Swap it from the world,
  continent or region map at any time except mid-fight.
- **Every stage starts at full HP. MP stays with each Uma** from stage to stage (and between waves).
- **Springs** refill MP: **five per continent** (one every two rows, 25 a tier). A Spring refills the active party's
  MP, then **recharges for 2 hours**. In a session that's 25 refills per two hours, so a party running dry is a nudge
  to swap to a fresh one; after a break, every Spring is ready again.
- **Progress belongs to your world, not to a party.** A cleared stage is cleared for everyone.
- **One fight open at a time**, saved and replayed exactly as today (D52's frozen input plus actions).

## Exploring

- **Everything is open from the start**: all five continents and all their regions. The levels tell you where to go.
- Inside a region, stages open in order; any cleared stage can be replayed.
- Each continent's **capital** is planned to hold the scenario's authored Finals (uma-racer's fourteen, D48),
  so each scenario keeps its identity. Capital Finals are not built yet; region bosses are separate.

## Variety

Each region is a biome, and each biome sets an **element mix**, a **formation lean** and later a **field effect**:
15 element signatures (five single elements, ten pairs), eight formation templates from a solo elite to an eight-foe
swarm, four foe roles, 1–3 waves. The generator cycles formation/signature combinations and avoids adjacent repeats
where its biome allows; a small signature pool can run out. The six built formations are generated in
[the manual](../../game/maps.md#formations-and-waves); Ambush and field effects remain W4 work. Design lists are in
[regions.md](regions.md) and [encounters.md](encounters.md). Foes' faces follow the biome (D76, D81): three biomes a franchise (D83): PriConne the Sky Isles, Highlands and Meadow; Azur Lane the Underworld, Coast and Glacier; Last Origin the Ancient Ruins, Canyon and Volcano; NIKKE the Desert, Tundra and Storm Peaks; Destiny Child the Haunted Moor, Swamp and Twilight Rift; Girls' Frontline the Jungle, Geyser Basin and Crystal Caverns (D85); Forest alone draws from a mixed pool of five faces per pack. A biome whose pack isn't published yet draws from the pool
([themes.md](themes.md)).

## On the phone

| Screen | Shows | Taps |
|---|---|---|
| **World** | Five continents on one screen, each with its band and % cleared | A continent zooms in |
| **Continent** | Ten rows of four biome regions, each labeled with its five-level range; Springs between rows; the capital on top | A region zooms in; a Spring refills MP |
| **Region** | Its twelve stages on one short path, the boss at the end | A stage opens its sheet: level, foes and waves, elements and weaknesses once seen, rewards, **Fight** |

- The **active party chip** sits at the top of all three screens, with each Uma's MP; tapping it swaps parties.
- **Art, lean first**: flat biome-colored cells today. The pixel-art maps are specified in [map-art.md](map-art.md)
  (D87): low levels at the bottom, the capital on top, each map opening at the frontier.

## What changes in the game

| Area | Change |
|---|---|
| Domain | A `world` module: continent and region data (authored), a seeded stage generator (versioned, so stage ids never move) |
| Save | `progress` (first clear and wins per stage), `activeParty`, each Uma's **MP**, and each Spring's last use replace `runs`. A migration drops chapter runs; Uma levels, skills, items, tokens and gear stay; an open chapter fight closes with no loss |
| Battle engine | Up to **8 foes**, **dual-element foes**, **waves**; field effects later |
| Battle stage | A two-row layout for 6–8 foes; a wave transition |
| Rewards | D97's EXP weights (regular 0.32, elite/boss 0.4), first-clear Laurels, tokens of the band ([../loop.md](../loop.md)) |
| Tier Finale (S8, parked) | Fits as each capital's last fight or a sixth "continent" |

## Build order

| Step | What | Playable result |
|---|---|---|
| W1 | The world generator in the domain, with tests (counts, levels, no repeated combination in a region) | — |
| W2 | World, continent and region screens with flat art; active party; carried MP and Springs; stages on today's engine (≤5 foes, one element each); save migration | The new loop end to end |
| W3 | Engine and stage: 6–8 foes, dual elements, waves (done, D91; [encounters.md](encounters.md)) | The variety you described |
| W4 | Field effects and home ground; a campaign sim to tune EXP, budgets and token drops | Biomes that play differently |
| W5 | Art: biome tiles, composed maps, battle backdrops ([map-art.md](map-art.md), D87) | The map looks like a world |

## Decided (owner, 2026-10-11)

1. **Many regions**, now five-level climbs (D97), with twenty choices per half-continent for the roster.
2. **Full HP every stage; MP carries**, refilled at Springs that recharge every 2 hours.
3. **Everything open** from the start.
4. **Lv1 → 50 in about 4 hours of fighting** for a fresh party, so about 20 parties make the 100-hour mark (owner,
   D71); the loop's passive steps pace it in practice.
5. **Faces by franchise** (D83, D85, D88, superseding "PriConne everywhere"): six packs by biome, with Forest's
   mixed pool; key bosses authored later.
