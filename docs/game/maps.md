# The world map

Where the fights are: a tier's world of five continents, each a map of 40 biome regions, each region a climb of five
levels in twelve stages (D66, D71, D72, D91, D97). Everything is generated from fixed seeds, so ids and contents never move under
a save. Lists here are generated from `packages/domain/src/world/` (`world.ts`, `biomes.ts`).

The screens are in [sections](sections.md#scenario-gate), the fights in [combat](combat.md), and the pixel-art compositions in `docs/design/world/map-art.md`.

The World, Continent and Region screens default to pixel maps. **Map / List** in the sticky header remembers this
device’s choice. Low levels are at the bottom; continents and regions open at the lowest uncleared frontier.
Stages are compact 2×2-tile buildings: square chess towers, an elite tower and a boss castle. The route snakes across
three columns: 1–2–3, then 6–5–4, 7–8–9, and 12–11–10 at the top. Each stage rises slightly within its row.
Cleared buildings turn completely gray; colored buildings remain to clear, with a ring around the next stage.
Tapping still opens the same rival sheet. The larger 4×4 structures remain in the art package for other uses.
Springs refill MP, and the capital opens its Finals routes. A region shows its continent band's existing Spring at
the start of its road and as **Spring · MP** in the header. It shares that Spring's two-hour recharge, not a new charge.

## Shape

<!-- live:world -->
| Setting | Value |
|---|---|
| Continents | 5 per tier, one per scenario, 10 levels each |
| Regions | 40 per continent in 10 rows of 4, each climbing 5 levels: rows 1–5 the continent's first five, rows 6–10 its last five. Every biome at least twice; the first is a Meadow |
| Stages | 12 per region: 10 regular climbing its levels two at a time, then an elite (11) and the boss (12) at its top level |
| Springs | 5 per continent, one every two rows; recharge 2 h |
| Waves pay | ×1.5 |
<!-- /live -->

- **A region is a climb (D97).** Its ten regular stages rise two at a time through its five levels, about three fights
  a level, and its elite and boss wait at the top. A party that walks in at the first level meets them at the last
  (Lv 5, Lv 10 …) and leaves a little short of the next region's first level; a replay tops it up.
- **Two regions a continent.** Rows 1–5 climb the continent's first five levels and rows 6–10 its last five: 20 regions
  each, so each of the 20 parties can take its own pair.
- **Everything is open from the start.** Inside a region, stages open in order; any cleared stage can be replayed for a
  quarter of its first-clear rewards, or swept with a Sweep Ticket (regular stages only).
- **Progress belongs to the world**, not to a party: one world-wide record of wins per stage, MP per Uma, and one open
  fight at a time.
- **Springs** refill the active party's MP, then recharge for two hours.
- Each continent's **capital** (Lv 10 of its band) holds three authored Finals routes. All vanguards open immediately;
  each champion opens after her own vanguard. Both have two escorts. Vanguards pay as sub-bosses, champions as bosses;
  their EXP is halved so all three routes add about one level. Replays pay a quarter, and neither can be swept.

## Biomes

Nineteen biomes. Each sets the **element signatures** its foes carry, its **formation** lean and its foe **roles**.

<!-- live:biomes -->
| Biome | Id | Signatures (weak to) | Formations | Roles |
|---|---|---|---|---|
| Meadow | `meadow` | fire (Lightning twins); ice (Fire twins); lightning (Ice twins) | squad, duo, trio | striker, caster, skirmisher, guard |
| Forest | `forest` | lightning (Ice twins); light (Dark twins); dark (Light twins) | squad, trio, swarm | skirmisher, striker |
| Coast | `coast` | ice+lightning (Fire twins); ice (Fire twins); lightning (Ice twins) | trio, squad | caster, skirmisher |
| Swamp | `swamp` | lightning+dark (Ice twins or Light twins); dark (Light twins) | squad, trio | caster, skirmisher |
| Jungle | `jungle` | fire+lightning (Ice twins); lightning (Ice twins) | swarm, squad | skirmisher, striker |
| Desert | `desert` | fire+light (Lightning twins or Dark twins); fire (Lightning twins); light (Dark twins) | trio, duo | guard, striker |
| Canyon | `canyon` | fire (Lightning twins); lightning (Ice twins); fire+lightning (Ice twins) | duo, solo, trio | striker |
| Volcano | `volcano` | fire+dark (Lightning twins or Light twins); fire+light (Lightning twins or Dark twins); fire (Lightning twins) | solo, duo | striker, caster |
| Geyser Basin | `geyser` | fire+ice (Lightning twins); ice (Fire twins); fire (Lightning twins) | trio, squad | caster |
| Tundra | `tundra` | ice (Fire twins); ice+dark (Fire twins or Light twins) | squad, trio | guard, striker |
| Glacier | `glacier` | ice+light (Fire twins or Dark twins); ice (Fire twins) | solo, duo | guard |
| Storm Peaks | `peaks` | ice+lightning (Fire twins); lightning (Ice twins) | trio, squad | skirmisher |
| Highlands | `highlands` | lightning+light (Ice twins or Dark twins); light (Dark twins) | duo, trio | caster |
| Sky Isles | `sky` | fire+light (Lightning twins or Dark twins); ice+light (Fire twins or Dark twins); lightning+light (Ice twins or Dark twins) | trio, duo | caster |
| Underworld | `underworld` | fire+dark (Lightning twins or Light twins); ice+dark (Fire twins or Light twins); lightning+dark (Ice twins or Light twins) | swarm, squad | striker, caster, skirmisher |
| Haunted Moor | `moor` | dark (Light twins); ice+dark (Fire twins or Light twins) | swarm, squad | skirmisher, caster |
| Crystal Caverns | `crystal` | ice+light (Fire twins or Dark twins); light (Dark twins) | squad, trio | guard, caster |
| Ancient Ruins | `ruins` | light+dark (Twilight); fire (Lightning twins); ice (Fire twins); lightning (Ice twins) | escort, trio | guard |
| Twilight Rift | `rift` | light+dark (Twilight) | solo | striker, caster |

The twin sets: Fire twins (Greatsword, Fire Tome); Ice twins (Axe, Blizzard Tome); Lightning twins (Lance, Thunder Tome); Light twins (Bow, Light Tome); Dark twins (Katana, Dark Tome); Twilight (Bow, Katana).
<!-- /live -->

### Element signatures

A signature is one element, or a pair that each foe carries both of. Since engine v16 (CP5) a foe is weak to her
**twins**: the element that beats hers on the ring, **Fire > Ice > Lightning > Fire** and **Light ⇄ Dark**, and its twin
Arm ([combat](combat.md#weaknesses-shields-and-breaks)):
- A pair's foes read their lead element first, the lead alternating by slot; when its answer is one of her own, her
  second. So a pair can answer to two twin sets ("Fire twins or Dark twins").
- A **light+dark** foe answers to no element: the Bow and the Katana (**Twilight**).

### Faces

Foes wear the faces of three private franchise packs (D135): PriConne, Azur Lane and NIKKE. The owner sorted every unit
into a tier: Regular, Key enemy, Sub-boss or Boss. A region's franchise goes by level, not biome: PriConne holds the
first continent, and Azur Lane and NIKKE alternate every five levels after it, roughly in proportion to their rosters.

<!-- live:faces -->
| Continent | Rows 1–5 | Rows 6–10 | Capital |
|---|---|---|---|
| w1 | PriConne (Lv 1–5) | PriConne (Lv 6–10) | PriConne |
| w2 | Azur Lane (Lv 11–15) | NIKKE (Lv 16–20) | Azur Lane |
| w3 | Azur Lane (Lv 21–25) | NIKKE (Lv 26–30) | NIKKE |
| w4 | Azur Lane (Lv 31–35) | NIKKE (Lv 36–40) | Azur Lane |
| w5 | Azur Lane (Lv 41–45) | Azur Lane (Lv 46–50) | NIKKE |

| Franchise | Regions |
|---|---|
| PriConne | 40 |
| Azur Lane | 100 |
| NIKKE | 60 |
<!-- /live -->

Within a region, faces go by tier:

| Stage | Faces |
|---|---|
| Regular stages (1–10) | Regular units |
| Elite (11) | A Sub-boss with two Key enemy assistants |
| Boss (12) | Sub-bosses in the two opening waves, then a Boss with two Sub-boss guards. On a continent's top row (row 10), two Bosses and one Sub-boss guard |
| Capital Finals | Vanguard: a Sub-boss with Key enemy minions. Champion: a Boss with Sub-boss minions |

- **Picking:** a stage picks each face by hash from its franchise's units of that tier, sorted by id, and never repeats a
  face within the stage.
- **Empty tiers:** a tier with no units borrows the same tier from another franchise, then any tier of its own.
- **Storage:** the units live only in the gitignored `content/` and the private bucket
  ([architecture](architecture.md#private-content)).

Every unit has three images:
- a square **face** for the round icons on the region screens;
- a 2:3 **vertical**, which is what the battle stage shows;
- for Key enemies, Sub-bosses and Bosses, a 16:9 **splash**. It cuts in during a fight ([combat](combat.md#splash-cut-ins)).

## Formations and waves

<!-- live:formations -->
| Template | Foes | HP shared (regular foes) | Shield each | Notes |
|---|---|---|---|---|
| Lone elite (`solo`) | 1 | 3.5 | 6 | Acts twice a round |
| Pair (`duo`) | 2 | 3.6 | 4 | — |
| Trio (`trio`) | 3 | 3.6 | 3 | — |
| Squad (`squad`) | 4–5 | 4 | 2 | — |
| Swarm (`swarm`) | 6–8 | 3.6 | 1 | Two rows on the stage |
| Escort (`escort`) | 3–5 | captain 2.5, guards 0.8 each | captain 5, guards 2 | — |

| Stage | Waves | HP per wave |
|---|---|---|
| Stage 8 | 2 | ×0.75 |
| Stage 9 | 2 | ×0.75 |
| Boss (stage 12) | 3 | ×0.3, ×0.3, then the champion's wave in full |
<!-- /live -->

A region's twelve stages:
- **Levels:** stages 1–10 climb two at a time (1, 1, 2, 2 … 5, 5 in a Lv 1–5 region); the elite and the boss are at its
  top level.
- **1–2:** teaching pairs.
- **3–10:** the biome's formation × signature combinations, never twice in a row. Stage 7 is a crowd, 8–9 come in two
  waves, and 10 is the biome's own formation.
- **11:** the elite: a captain with two Key enemy guards (0.8 of a regular foe's HP, shield 2 each). She acts once a
  round below tier Lv 10 and twice from tier Lv 10 (D135, D141, D170), and carries a charged move
  ([combat](combat.md#charged-moves-v12)).
- **12:** the boss: three waves ending with a champion and her two guards; from tier Lv 10 a lone champion acts twice
  (D141). On a continent's top row (row 10) it's two champions, each with 55% of one champion's HP, acting once, and
  one guard (D135).

A stage in waves pays 1.5× EXP and Laurels.

### Example region

<!-- live:region-sample -->
Volcano `w1-4-2`, Lv 1–5:

| Stage | Level | Kind | Name | Signature | Foes per wave | Notes |
|---|---|---|---|---|---|---|
| 1 | 1 | fight | Pair | fire + dark | 2 | dual element |
| 2 | 1 | fight | Pair | fire + light | 2 | dual element |
| 3 | 2 | fight | Lone elite | fire | 1 | acts twice |
| 4 | 2 | fight | Pair | fire + light | 2 | dual element |
| 5 | 3 | fight | Lone elite | fire + dark | 1 | acts twice, dual element |
| 6 | 3 | fight | Pair | fire | 2 | — |
| 7 | 4 | fight | Squad | fire + dark | 5 | dual element |
| 8 | 4 | fight | Pair | fire + dark | 2 + 1 | dual element, acts twice |
| 9 | 5 | fight | Lone elite | fire + light | 1 + 2 | acts twice, dual element |
| 10 | 5 | fight | Lone elite | fire + dark | 1 | acts twice, dual element |
| 11 | 5 | sub-boss | Elite | fire | 3 | sub-boss |
| 12 | 5 | boss | Volcano boss | fire + dark | 1 + 3 + 3 | acts twice, dual element, boss |
<!-- /live -->

## Continents

Continents are numbered by release order. In the game each takes its scenario's name from master data; those names
aren't listed here. Each continent leans to one biome, which it holds an extra copy of. Rows read from the top row
down, the way the map climbs.

<!-- live:continents -->
### Continent 1 (`w1`), Lv 1–10, leaning forest

| Row | Levels | Region 1 | Region 2 | Region 3 | Region 4 | Spring on the way in |
|---|---|---|---|---|---|---|
| 10 | Lv 6–10 | Swamp II `w1-10-1` | Coast II `w1-10-2` | Glacier II `w1-10-3` | Tundra II `w1-10-4` |  |
| 9 | Lv 6–10 | Canyon II `w1-9-1` | Haunted Moor II `w1-9-2` | Desert II `w1-9-3` | Jungle II `w1-9-4` | Spring `w1-spring5` |
| 8 | Lv 6–10 | Sky Isles II `w1-8-1` | Volcano II `w1-8-2` | Forest III `w1-8-3` | Underworld II `w1-8-4` |  |
| 7 | Lv 6–10 | Swamp `w1-7-1` | Highlands II `w1-7-2` | Geyser Basin II `w1-7-3` | Coast `w1-7-4` | Spring `w1-spring4` |
| 6 | Lv 6–10 | Glacier `w1-6-1` | Jungle `w1-6-2` | Meadow III `w1-6-3` | Tundra `w1-6-4` |  |
| 5 | Lv 1–5 | Ancient Ruins II `w1-5-1` | Storm Peaks II `w1-5-2` | Desert `w1-5-3` | Twilight Rift II `w1-5-4` | Spring `w1-spring3` |
| 4 | Lv 1–5 | Geyser Basin `w1-4-1` | Volcano `w1-4-2` | Crystal Caverns II `w1-4-3` | Canyon `w1-4-4` |  |
| 3 | Lv 1–5 | Crystal Caverns `w1-3-1` | Meadow II `w1-3-2` | Forest `w1-3-3` | Forest II `w1-3-4` | Spring `w1-spring2` |
| 2 | Lv 1–5 | Highlands `w1-2-1` | Ancient Ruins `w1-2-2` | Twilight Rift `w1-2-3` | Haunted Moor `w1-2-4` |  |
| 1 | Lv 1–5 | Meadow `w1-1-1` | Sky Isles `w1-1-2` | Underworld `w1-1-3` | Storm Peaks `w1-1-4` | Spring `w1-spring1` |

### Continent 2 (`w2`), Lv 11–20, leaning coast

| Row | Levels | Region 1 | Region 2 | Region 3 | Region 4 | Spring on the way in |
|---|---|---|---|---|---|---|
| 10 | Lv 16–20 | Desert II `w2-10-1` | Canyon II `w2-10-2` | Tundra II `w2-10-3` | Glacier II `w2-10-4` |  |
| 9 | Lv 16–20 | Forest II `w2-9-1` | Coast III `w2-9-2` | Volcano II `w2-9-3` | Geyser Basin II `w2-9-4` | Spring `w2-spring5` |
| 8 | Lv 16–20 | Twilight Rift II `w2-8-1` | Ancient Ruins II `w2-8-2` | Swamp II `w2-8-3` | Jungle II `w2-8-4` |  |
| 7 | Lv 16–20 | Underworld II `w2-7-1` | Sky Isles II `w2-7-2` | Crystal Caverns II `w2-7-3` | Haunted Moor II `w2-7-4` | Spring `w2-spring4` |
| 6 | Lv 16–20 | Forest `w2-6-1` | Meadow III `w2-6-2` | Highlands II `w2-6-3` | Storm Peaks II `w2-6-4` |  |
| 5 | Lv 11–15 | Storm Peaks `w2-5-1` | Ancient Ruins `w2-5-2` | Crystal Caverns `w2-5-3` | Coast II `w2-5-4` | Spring `w2-spring3` |
| 4 | Lv 11–15 | Tundra `w2-4-1` | Meadow II `w2-4-2` | Glacier `w2-4-3` | Twilight Rift `w2-4-4` |  |
| 3 | Lv 11–15 | Volcano `w2-3-1` | Sky Isles `w2-3-2` | Geyser Basin `w2-3-3` | Highlands `w2-3-4` | Spring `w2-spring2` |
| 2 | Lv 11–15 | Desert `w2-2-1` | Haunted Moor `w2-2-2` | Canyon `w2-2-3` | Underworld `w2-2-4` |  |
| 1 | Lv 11–15 | Meadow `w2-1-1` | Coast `w2-1-2` | Swamp `w2-1-3` | Jungle `w2-1-4` | Spring `w2-spring1` |

### Continent 3 (`w3`), Lv 21–30, leaning desert

| Row | Levels | Region 1 | Region 2 | Region 3 | Region 4 | Spring on the way in |
|---|---|---|---|---|---|---|
| 10 | Lv 26–30 | Twilight Rift II `w3-10-1` | Meadow III `w3-10-2` | Crystal Caverns II `w3-10-3` | Ancient Ruins II `w3-10-4` |  |
| 9 | Lv 26–30 | Underworld II `w3-9-1` | Haunted Moor II `w3-9-2` | Highlands II `w3-9-3` | Sky Isles II `w3-9-4` | Spring `w3-spring5` |
| 8 | Lv 26–30 | Underworld `w3-8-1` | Desert III `w3-8-2` | Meadow II `w3-8-3` | Forest II `w3-8-4` |  |
| 7 | Lv 26–30 | Twilight Rift `w3-7-1` | Storm Peaks II `w3-7-2` | Highlands `w3-7-3` | Sky Isles `w3-7-4` | Spring `w3-spring4` |
| 6 | Lv 26–30 | Jungle II `w3-6-1` | Haunted Moor `w3-6-2` | Crystal Caverns `w3-6-3` | Ancient Ruins `w3-6-4` |  |
| 5 | Lv 21–25 | Geyser Basin II `w3-5-1` | Swamp II `w3-5-2` | Coast II `w3-5-3` | Desert II `w3-5-4` | Spring `w3-spring3` |
| 4 | Lv 21–25 | Swamp `w3-4-1` | Volcano II `w3-4-2` | Canyon II `w3-4-3` | Tundra II `w3-4-4` |  |
| 3 | Lv 21–25 | Storm Peaks `w3-3-1` | Forest `w3-3-2` | Glacier II `w3-3-3` | Jungle `w3-3-4` | Spring `w3-spring2` |
| 2 | Lv 21–25 | Desert `w3-2-1` | Geyser Basin `w3-2-2` | Volcano `w3-2-3` | Coast `w3-2-4` |  |
| 1 | Lv 21–25 | Meadow `w3-1-1` | Glacier `w3-1-2` | Tundra `w3-1-3` | Canyon `w3-1-4` | Spring `w3-spring1` |

### Continent 4 (`w4`), Lv 31–40, leaning tundra

| Row | Levels | Region 1 | Region 2 | Region 3 | Region 4 | Spring on the way in |
|---|---|---|---|---|---|---|
| 10 | Lv 36–40 | Ancient Ruins II `w4-10-1` | Crystal Caverns II `w4-10-2` | Meadow III `w4-10-3` | Twilight Rift II `w4-10-4` |  |
| 9 | Lv 36–40 | Haunted Moor II `w4-9-1` | Glacier II `w4-9-2` | Underworld II `w4-9-3` | Storm Peaks II `w4-9-4` | Spring `w4-spring5` |
| 8 | Lv 36–40 | Swamp II `w4-8-1` | Meadow II `w4-8-2` | Sky Isles II `w4-8-3` | Highlands II `w4-8-4` |  |
| 7 | Lv 36–40 | Tundra III `w4-7-1` | Desert II `w4-7-2` | Coast II `w4-7-3` | Forest II `w4-7-4` | Spring `w4-spring4` |
| 6 | Lv 36–40 | Crystal Caverns `w4-6-1` | Volcano II `w4-6-2` | Haunted Moor `w4-6-3` | Jungle II `w4-6-4` |  |
| 5 | Lv 31–35 | Twilight Rift `w4-5-1` | Tundra II `w4-5-2` | Ancient Ruins `w4-5-3` | Canyon II `w4-5-4` | Spring `w4-spring3` |
| 4 | Lv 31–35 | Sky Isles `w4-4-1` | Highlands `w4-4-2` | Storm Peaks `w4-4-3` | Geyser Basin II `w4-4-4` |  |
| 3 | Lv 31–35 | Geyser Basin `w4-3-1` | Tundra `w4-3-2` | Glacier `w4-3-3` | Underworld `w4-3-4` | Spring `w4-spring2` |
| 2 | Lv 31–35 | Jungle `w4-2-1` | Desert `w4-2-2` | Canyon `w4-2-3` | Volcano `w4-2-4` |  |
| 1 | Lv 31–35 | Meadow `w4-1-1` | Forest `w4-1-2` | Coast `w4-1-3` | Swamp `w4-1-4` | Spring `w4-spring1` |

### Continent 5 (`w5`), Lv 41–50, leaning moor

| Row | Levels | Region 1 | Region 2 | Region 3 | Region 4 | Spring on the way in |
|---|---|---|---|---|---|---|
| 10 | Lv 46–50 | Sky Isles II `w5-10-1` | Underworld II `w5-10-2` | Storm Peaks II `w5-10-3` | Highlands II `w5-10-4` |  |
| 9 | Lv 46–50 | Haunted Moor III `w5-9-1` | Volcano II `w5-9-2` | Crystal Caverns II `w5-9-3` | Canyon II `w5-9-4` | Spring `w5-spring5` |
| 8 | Lv 46–50 | Ancient Ruins II `w5-8-1` | Tundra II `w5-8-2` | Twilight Rift II `w5-8-3` | Geyser Basin II `w5-8-4` |  |
| 7 | Lv 46–50 | Meadow III `w5-7-1` | Swamp II `w5-7-2` | Forest II `w5-7-3` | Coast II `w5-7-4` | Spring `w5-spring4` |
| 6 | Lv 46–50 | Canyon `w5-6-1` | Desert `w5-6-2` | Desert II `w5-6-3` | Jungle II `w5-6-4` |  |
| 5 | Lv 41–45 | Glacier II `w5-5-1` | Forest `w5-5-2` | Geyser Basin `w5-5-3` | Volcano `w5-5-4` | Spring `w5-spring3` |
| 4 | Lv 41–45 | Jungle `w5-4-1` | Swamp `w5-4-2` | Storm Peaks `w5-4-3` | Coast `w5-4-4` |  |
| 3 | Lv 41–45 | Twilight Rift `w5-3-1` | Meadow II `w5-3-2` | Glacier `w5-3-3` | Tundra `w5-3-4` | Spring `w5-spring2` |
| 2 | Lv 41–45 | Underworld `w5-2-1` | Haunted Moor II `w5-2-2` | Crystal Caverns `w5-2-3` | Ancient Ruins `w5-2-4` |  |
| 1 | Lv 41–45 | Meadow `w5-1-1` | Haunted Moor `w5-1-2` | Highlands `w5-1-3` | Sky Isles `w5-1-4` | Spring `w5-spring1` |
<!-- /live -->
