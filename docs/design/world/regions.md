# Regions and continents

> **Status: proposal for owner review, 2026-10-10.** Part of the [world map proposal](README.md). Elements and roles
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

Each continent has all 20: one region of each biome plus its capital.

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

Five continents a tier, one per scenario, in release order. **Every continent has all 20 regions.** What differs is
the band, the layout (which biomes sit near the coast and which at the frontier) and a **climate lean**: the biomes on
its theme get the larger, more central cells.

| Continent (Tier 1) | Band | Lean | Coast (low) | Frontier (high) |
|---|---|---|---|---|
| URA Finale | 1–10 | Temperate | Meadow, Forest, Coast | Volcano, Glacier, Twilight Rift |
| Unity Cup | 11–20 | Archipelago | Coast, Jungle, Highlands | Sky Isles, Storm Peaks, Underworld |
| Trackblazer | 21–30 | Frontier south | Desert, Canyon, Meadow | Volcano, Geyser Basin, Ancient Ruins |
| Our Grand Concert | 31–40 | Far north | Tundra, Coast, Forest | Glacier, Crystal Caverns, Storm Peaks |
| Grand Masters | 41–50 | Shadowlands | Swamp, Haunted Moor, Highlands | Underworld, Twilight Rift, Sky Isles |

Tiers 2 and 3 get their own five continents, with the same 20 biomes laid out differently.

## A continent on the grid

A portrait 6 × 9 grid. Each region takes one to three cells, and the capital sits at the top. Locked regions stay
under fog until a neighbor's boss falls. A sketch of URA Finale, where letters are regions and the coast is at the
bottom:

```
row 9   .  .  [CAPITAL]  .  .
row 8   Ri Ri  Vo  Vo  Gl  .
row 7   Ru Ru  Ca  Gy  Gl  Gl
row 6   Un Un  Ca  Gy  SP  SP
row 5   HM Sk  Sk  De  De  SP
row 4   Sw Sw  Hi  De  Tu  Tu
row 3   Sw Ju  Hi  Cr  Cr  Tu
row 2   Fo Fo  Me  Me  Co  Co
row 1   Fo .   Me  Me  Co  .        ← landing: Meadow and Coast open
```

`Me` Meadow · `Fo` Forest · `Co` Coast · `Sw` Swamp · `Ju` Jungle · `Hi` Highlands · `Cr` Crystal Caverns ·
`Tu` Tundra · `De` Desert · `SP` Storm Peaks · `HM` Haunted Moor · `Sk` Sky Isles · `Un` Underworld · `Ca` Canyon ·
`Gy` Geyser Basin · `Gl` Glacier · `Ru` Ancient Ruins · `Ri` Twilight Rift · `Vo` Volcano

Rows 1–3 are the Coast ring (Lv 1–4), rows 4–6 the Heartland (Lv 3–7), rows 7–8 the Frontier (Lv 6–10).

## A region's data (authored once)

```ts
interface RegionDef {
  id: string              // 'ura-volcano'
  biome: Biome            // 'volcano'
  name: string            // 'Cinder Reach'
  cells: [col, row][]     // where it sits on the continent grid
  window: [min, max]      // level window inside the continent band
  neighbors: string[]     // opened when its boss falls
}
```

Everything else (signatures, formations, roles, field effect) comes from the biome. The ten stages are generated from
the region id with a fixed seed, so they never change under a save. The authored part is about 20 lines per continent.

## Art, lean first

| Step | Look |
|---|---|
| W2 | Flat cells in the biome's color, a code-drawn biome icon, fog as a dark overlay, region names in DOM labels (like the Hub) |
| W5 | uma-platform draws a 16 px tileset per biome: ground variants and two or three props, the same pipeline as the Hub tiles (P38) |
