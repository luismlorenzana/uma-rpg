# Regions and continents

> **Status: region generation built (D72, D97); each region climbs five levels. Field effects remain a W4 specification.** The generated
> [map manual](../../game/maps.md) is the current biome and continent list (D92). Part of the [world design](README.md).
> Elements and roles
> are today's engine's: fire, ice, lightning, light, dark (fire beats ice, ice beats lightning, lightning beats fire;
> light and dark beat each other); striker, caster, guard, skirmisher, plus captains and champions for bosses.

## Where a biome's elements come from

Like Minecraft placing biomes by temperature and humidity, each biome sits on three axes, and the axes pick its
elements:

| Axis | Low end | High end |
|---|---|---|
| **Heat** | Ice (glaciers, tundra) | Fire (volcanoes, deserts) |
| **Storm** | Calm (meadows, caves) | Lightning (peaks, coasts, jungles) |
| **Aura** | Dark (underworld, swamps, moors) | Light (sky isles, crystal caves) |

A biome's **signatures** are the single elements and pairs its foes carry. There are 15 in all: the five single
elements and the ten pairs. Every signature has a home; all but one have two or more.

## The 19 biomes and the capital

Each continent has 40 regions (every biome twice, two of them three times) plus its capital.

| # | Biome | Signatures | Formation lean | Roles lean | Field effect (later) | Map color |
|---|---|---|---|---|---|---|
| 1 | **Meadow** | fire, ice, lightning (one per fight) | Duos to squads | Mixed | None: the teaching region | Light green |
| 2 | **Forest** | lightning, light, dark | Squads, ambushes | Skirmishers | Ambush: foes act first in round 1 | Deep green |
| 3 | **Coast** | ice, lightning, ice+lightning | Trios, squads | Casters | Sea spray: ice hits +10% | Sand and teal |
| 4 | **Swamp** | dark, lightning+dark | Squads | Casters (hex), skirmishers (mark) | Miasma: weaken lasts a round longer | Murky olive |
| 5 | **Jungle** | lightning, fire+lightning | Swarms (6–8) | Skirmishers | Overgrowth: the party's slowest acts last | Vivid green |
| 6 | **Desert** | fire, light, fire+light | Trios | Guards (armored) | Heat: fire +10%, ice −10% | Gold |
| 7 | **Canyon** | fire, lightning; fire+lightning bosses | Duos, solos | Strikers | Echo: the first break each wave stuns a round longer | Rust |
| 8 | **Volcano** | fire, fire+dark, fire+light | **Solos and duos** | Strikers, captains | Ashfall: burn on fire hits | Red and black |
| 9 | **Geyser Basin** | fire+ice, ice, fire | Trios | Casters | Steam: every third round, all take light damage | White and orange |
| 10 | **Tundra** | ice, ice+dark | Squads | Guards | Frost: the party's first round is slower | Pale blue |
| 11 | **Glacier** | ice, ice+light | Solos | Guards with big shields | Whiteout: weaknesses hidden until hit | Ice white |
| 12 | **Storm Peaks** | lightning, ice+lightning | Trios | Skirmishers (fast) | Gale: turn order reshuffles each round | Slate |
| 13 | **Highlands** | lightning+light, light | Duos | Casters | Clear sky: light +10% | Heather |
| 14 | **Sky Isles** | **light + one**: fire+light, ice+light, lightning+light | Casters, duos | Casters | Radiance: light +10%, dark −10% | Cloud white and gold |
| 15 | **Underworld** | **dark + one**: fire+dark, ice+dark, lightning+dark | **Swarms** | Mixed | Gloom: dark +10%, light −10% | Violet black |
| 16 | **Haunted Moor** | dark, ice+dark | Swarms (6–8) | Skirmishers | Fog: one random foe hidden each round | Grey violet |
| 17 | **Crystal Caverns** | light, ice+light | Squads | Guards | Refraction: magic hits +10% | Cyan |
| 18 | **Ancient Ruins** | light+dark, plus singles | Escorts (captain + guards) | Guards, captains | Wards: foes start with a shield point more | Stone |
| 19 | **Twilight Rift** | light+dark | **Solo elites only** | Champions | Eclipse: light and dark both +15% | Indigo and gold |
| 20 | **Capital** | The scenario's | Authored Finals routes | Vanguards and champions | — | The scenario's color |

The field effects are a later layer (step W4 in the build order). The table fixes them now so each biome has an
identity from the start.

## Coverage

| Signature | Biomes |
|---|---|
| fire | Meadow, Desert, Canyon, Volcano, Geyser Basin |
| ice | Meadow, Coast, Geyser Basin, Tundra, Glacier |
| lightning | Meadow, Forest, Coast, Jungle, Canyon, Storm Peaks |
| light | Forest, Desert, Highlands, Crystal Caverns |
| dark | Forest, Swamp, Haunted Moor |
| fire+ice | Geyser Basin |
| fire+lightning | Jungle, Canyon (bosses) |
| fire+light | Desert, Volcano, Sky Isles |
| fire+dark | Volcano, Underworld |
| ice+lightning | Coast, Storm Peaks |
| ice+light | Glacier, Sky Isles, Crystal Caverns |
| ice+dark | Tundra, Underworld, Haunted Moor |
| lightning+light | Highlands, Sky Isles |
| lightning+dark | Swamp, Underworld |
| light+dark | Ancient Ruins, Twilight Rift |

Fire+ice is the thinnest, living only in the Geyser Basin. That suits it: steam is a rare sight. If it feels too rare,
the Volcano's boss can take it as a third signature.

## Continents

Five continents a tier, one per scenario, in release order. **Every continent has every biome.** What differs is the
band, the order (which biomes sit at the low levels and which at the high ones) and a **climate lean**: the biome on
its theme appears an extra time.

| Continent (Tier 1) | Band | Lean | Low levels | High levels |
|---|---|---|---|---|
| URA Finale | 1–10 | Temperate | Meadow, Forest, Coast | Volcano, Glacier, Twilight Rift |
| Unity Cup | 11–20 | Archipelago | Coast, Jungle, Highlands | Sky Isles, Storm Peaks, Underworld |
| Trackblazer | 21–30 | Frontier south | Desert, Canyon, Meadow | Volcano, Geyser Basin, Ancient Ruins |
| Our Grand Concert | 31–40 | Far north | Tundra, Coast, Forest | Glacier, Crystal Caverns, Storm Peaks |
| Grand Masters | 41–50 | Shadowlands | Swamp, Haunted Moor, Highlands | Underworld, Twilight Rift, Sky Isles |

Tiers 2 and 3 are not built. Their five-continent layout remains planned; there are nineteen region biomes plus
the capital, not twenty region biomes.

## A continent on the map

Ten rows, low at the bottom, four regions per row; a Spring every two rows; the capital on top.
Rows 1–5 hold twenty regions climbing the first five levels; rows 6–10 hold twenty climbing the last five (D97).
Every biome appears twice per continent, the Meadow and the continent's lean biome three times (19 × 2 + 2 = 40).
One party takes one region from each half; the other choices serve the rest of the roster.

```
            [ CAPITAL · Lv10 Finals, not yet built ]
Rows 6–10   [ 20 regions, each Lv6–10 ]
Rows 1–5    [ 20 regions, each Lv1–5  ]
```

The generated [continent tables](../../game/maps.md#continents) give the actual row order and ranges.

## A region's data (generated)

```ts
interface WorldRegion {
  id: string              // 'w1-1-1': continent, row, column (1-based in the id)
  continentId: string     // 'w1'
  biome: Biome            // 'meadow'
  name: string            // generated biome name, with a suffix for repeated copies
  level: number           // first level of its five-level climb
  levelTop: number        // last level, where the elite and boss wait
  row: number             // 0-based layout row, not a single level
  col: number             // 0-based region column
}
```

Signatures, formations and roles come from the biome. Field effects are not engine inputs yet. The region layout
and its twelve stages are generated from fixed ids/seeds, not forty hand-authored region rows (D72).
Ten regular stages rise two per level; the elite and boss sit at `levelTop` (D97).

## Art, lean first

| Step | Look |
|---|---|
| W2 | Flat cells in the biome's color, a code-drawn biome icon, region names in DOM labels (like the Hub) |
| W5 | uma-platform draws a 16 px tileset per biome: ground variants and two or three props, the same pipeline as the Hub tiles (P38) |
