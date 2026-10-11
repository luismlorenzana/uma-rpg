# Elements or franchises?

> **Status: proposal for owner review, 2026-10-10.** Part of the [world map proposal](README.md). You asked to explore
> regions themed by franchise (a Persona region, a Final Fantasy region, a PriConne region) as well as by element.
> Two separate questions sit inside that: **what gives a region its identity**, and **what the foes look like**.

## Part 1: what gives a region its identity

| Option | How it works | For | Against |
|---|---|---|---|
| **A. Biomes and elements** | The 19 biomes of [regions.md](regions.md); foes' elements and formations come from the biome | All in code, no content to source; reads at a glance; drives party rotation through weaknesses | Generic on its own: a Volcano in one game looks like one in another |
| **B. Franchise regions** | Each region is a franchise: its own roster, look and boss | Very flavorful; recognizable foes and bosses | Each region needs a roster captured and kept private (like the PriConne cast, D50). Art styles clash across regions. Hard to reach 100 regions a tier this way |
| **C. Hybrid (recommended)** | Biomes stay the backbone (20 regions a continent); each continent adds **one Rift**, a 21st region that is a franchise realm | Most of the flavor of B for a fraction of the content; Rifts become each continent's showpiece | Rifts wait on content capture; the first ones are later |
| **D. Franchise continents** | Each continent is a franchise | Strong identity | Breaks "a continent is a scenario", and five franchises per tier is a lot of capture |

**Why C works mechanically:** the five elements line up with what these franchises already use. Persona's core
affinities include fire, ice, electricity, light and darkness. Classic Final Fantasy has fire, ice, thunder, holy and
dark. So a Rift can lean on its franchise's own element habits through the same signatures, with no new battle rules.
Both also have a "hits everything" element, which matches our Ultima (never a weakness, ×1.2).

## Part 2: what the foes look like

| Option | Look | Cost | Fits |
|---|---|---|---|
| **1. The PriConne cast everywhere** (today) | Bust portraits of 109 characters, as rival teams | None: already private content (D50) | Rival adventurers in every biome. Fine to start, a little odd in a swamp |
| **2. Original monster families** | About 12 small pixel monsters drawn in uma-platform, each recolored per element | One art round, drawn from code like the item icons; recolors are free | Regular foes in biomes; any style we like; can go in the public art package |
| **3. Franchise rosters** | Each franchise's own enemies (names and images) | A capture script and a mapping table per franchise; private only | Rifts |

**Decided for now (D66): 1 everywhere.** Later, the recommended mix: start with **1** everywhere (no new work). Then **2** for regular foes, with PriConne rivals as
elites and bosses ("rival adventurers" exploring the same lands). Then **3** only in Rifts.

### Monster families (for option 2)

| Family | Role it plays | Notes |
|---|---|---|
| Slime | Swarm filler | The classic recolor |
| Wisp | Caster | Floating flame, frost or spark |
| Bat | Skirmisher | Fast, marks targets |
| Wolf | Striker | Pack swarms |
| Beetle | Guard | Armored, weak to axe and spear |
| Golem | Guard, elite | Stone, ice or crystal by biome |
| Sprite | Caster | Light and dark aligned |
| Mushroom | Caster (hexes) | Swamp and grotto |
| Serpent | Skirmisher | Coasts and jungles |
| Knight | Guard, captain | Ruins and capitals |
| Drake | Striker, elite | Volcano and peaks |
| Wraith | Caster | Moors and underworld |

Twelve shapes × five element palettes gives 60 looks. Dual-element foes take their first element's palette with an
accent glow in the second.

## How franchise content stays private

Same as the PriConne cast (D50), whatever the franchise:

- A capture script turns a source list into names, an image per foe and our mapping (element signature, role,
  boss or not). It writes only to the gitignored `content/` folder.
- Publishing goes to the private bucket `gs://uma-rpg-content`, served at `/api/content/` to the signed-in owner only.
- **Never in git**, never in the public art package, never in screenshots that leave the machine.
- Effort per franchise is about what the PriConne import took: a script, a mapping table, a boss list.

## Which Rifts first

| Order | Rift | Why |
|---|---|---|
| 1 | **PriConne** | The cast is already captured and private; it only needs a mapping table and boss picks |
| 2–5 | Your picks: Persona, Final Fantasy, others | One per continent; each needs a capture |

Rifts are build step W5 or later. Nothing in the first steps depends on them.
