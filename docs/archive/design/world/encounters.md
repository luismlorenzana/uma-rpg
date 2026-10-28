# Encounters: making 1,000 fights differ

> **Status: built as W3 (D91, 2026-10-11)**, except the Ambush template and field effects (W4). Part of the [world
> map design](README.md). Engine v7 fights up to 8 foes a wave, dual-element foes and 1–3 waves; v6 fights still
> replay. Exact counts/budgets are generated in [the map manual](../../../game/maps.md#formations-and-waves).
> Below “As built”, the original formation tables and examples record design targets, not additional live rules.

## As built (W3, D91)

| Piece | How it works |
|---|---|
| **Formations** | Squad 4–5 and swarm 6–8 foes (the count seeded by the stage), escort a captain and 2–4 guards. Each template shares about four regular foes' HP, so more foes means smaller ones |
| **Dual elements** | A pair signature makes every foe carry both elements (`element2`). Her second elemental move uses the second element, and her weaknesses follow the pair rule below |
| **Acts twice** | Solo elites and each region's elite (stage 11) take two moves a round, the second after every foe's first |
| **Waves** | Stages 8 and 9 come in two waves at 0.75 HP each; the boss in three, two waves of the biome's other signatures at 0.3 HP, then the champion and her guards. A cleared wave ends the round: the next wave steps in at the start of a fresh one, and the party keeps its HP, MP, statuses, Limit charge and lingering summons |
| **Pay** | A stage in waves pays 1.5× EXP and Laurels, Sweeps included (D91), and one additional token per extra wave (D93) |
| **Stage** | Six to eight foes stand in two rows; a wave banner and a "W2/3" chip in the header. The region sheet lists foes by wave |
| **Balance** | `SIM=1` on time: regular stages and elites 100%, bosses 100% with gear except the Lv15 Ruins boss (light+dark, weapons only), which a party with more Arms clears. That's the rotation the pairs are for |


## The building blocks

A stage is generated from its region's biome ([regions.md](regions.md)) by picking one of each:

| Block | Choices | Source |
|---|---|---|
| **Signature** | 15: five single elements, ten pairs | The biome's list |
| **Formation** | 8 templates (below) | The biome's lean, plus a spread |
| **Roles** | Striker, caster, guard, skirmisher; captain or champion for bosses | The biome's lean |
| **Waves** | 1–3 | The stage's place in the region |
| **Weapon weaknesses** | A seeded subset of the five Arms; light+dark foes have three | Built by `stageWaves`; exact signature/formation rules are in the manual |
| **Field effect** (later) | One per biome | The biome |

## Formations

Every template spends about the same **budget**: roughly four of today's regular foes. So a solo elite and an
eight-foe swarm are equally hard, and they ask for different parties.

| Template | Foes | HP each (× a regular foe) | Shield each | Plays like |
|---|---|---|---|---|
| **Solo elite** | 1 | 3.5 | 6 | Acts **twice a round**; often dual-element. Single-target damage and breaks win |
| **Duo** | 2 | 1.8 | 4 | Two elites covering each other's weaknesses |
| **Trio** | 3 | 1.2 | 3 | The classic three-foe fight |
| **Squad** | 4–5 | 1.0 | 2 (3 late) | Today's regular fight |
| **Swarm** | 6–8 | 0.5 | 1 | Many small foes. All-target skills shine, and breaks come fast but matter less |
| **Escort** | Captain + 2–4 guards | 2.5 / 0.8 | 5 / 2 | Guards cover the captain; break the guards or burst the captain |
| **Ambush** | 3–5 | 1.0 | 2 | Foes act first in round 1 |
| **Waves** | 2–3 waves of the above | Per wave | Per wave | HP and MP carry between waves. Pays 1.5× |

## Dual-element foes

A dual foe carries two elements. Its elemental moves split between them, and **its weaknesses are the elements that
beat either of its elements, minus its own**. Fire beats ice, ice beats lightning, lightning beats fire, and light and
dark beat each other, so every pair gets its own answer:

| Pair | Weak to | Lives in |
|---|---|---|
| fire+dark | lightning, light | Volcano, Underworld |
| fire+light | lightning, dark | Desert, Volcano, Sky Isles |
| ice+dark | fire, light | Tundra, Underworld, Haunted Moor |
| ice+light | fire, dark | Glacier, Sky Isles, Crystal Caverns |
| lightning+dark | ice, light | Swamp, Underworld |
| lightning+light | ice, dark | Highlands, Sky Isles |
| fire+ice | lightning only | Geyser Basin |
| fire+lightning | ice only | Jungle, Canyon |
| ice+lightning | fire only | Coast, Storm Peaks |
| **light+dark** | **no element**: weapons only | Ancient Ruins, **Twilight Rift** |

So a Volcano full of fire+dark and fire+light foes wants lightning plus both light and dark: one party can't cover
every Volcano stage. That's the push to rotate parties you asked for.

## A region's twelve stages

| Stage | What | Notes |
|---|---|---|
| 1–2 | A duo or squad with one single-element signature | Teaches the region |
| 3–6 | The biome's formation lean across its signatures | No repeats |
| 7 | Ambush or swarm | |
| 8–9 | Two waves | |
| 10 | The biome's signature formation (the Volcano's solo, the Underworld's swarm) | |
| 11 | **Elite**: a solo or duo carrying the biome's rarest signature | Pays like a sub-boss |
| 12 | **Boss**: an escort and three waves, captain or champion with the biome's main pair | Drops a Promotion Token every time |

**As built:** the generator consumes the biome's formation/signature combinations, preferring a different formation
from the previous stage. It restarts the cycle when that pool runs out; fixed teaching, crowd and boss stages can
repeat a combination. It does not promise twelve unique combinations in a one-signature biome (`stagePlan`).

## Your examples, as stages

| You said | Stage |
|---|---|
| Solo fire+dark on a volcano | Volcano 10: **solo elite**, fire+dark, champion kit, acts twice, shield 6. Weak to lightning and light, axe |
| Fire+light on a volcano | Volcano 11: **duo**, fire+light striker + fire+dark caster. Lightning hits both; light and dark each hit only one, so the party needs both to break them together |
| Dark + one element in the underworld | Underworld 7: **swarm of 8**, mixed fire+dark, ice+dark and lightning+dark, shield 1 each |
| Light + one element on sky islands | Sky Isles 4: **trio of casters**, ice+light, lightning+light and fire+light, each weak to dark plus one |
| 8 foes vs 2 foes | Haunted Moor swarms (6–8) vs Desert and Highlands duos |

## How many different fights is that?

- 15 signatures × 8 formations × role mixes × 1–3 waves gives thousands of combinations. Each region draws its twelve
  from its biome's slice, so a region feels coherent, and its neighbors feel different.
- Across a continent the 40 regions cover every biome at least twice; across the tier, each continent arranges them in a new
  order and band.
- What repeats is the **biome**, five or more times a tier (at least once per continent), with new stages each time.
  You said that's fine.

## Faces

Six private packs now follow the biome; Forest draws five seeded members from each pack (D83, D85, D88).
[The manual](../../../game/maps.md#faces) lists the built mapping. The earlier original-monster/Rift options in
[themes.md](themes.md) remain proposal history, not current content rules.

## What the engine and stage need

| Change | Why | Size |
|---|---|---|
| **Up to 8 foes** (today 1–5) | Swarms | Small in the engine (targeting already picks among foes); a two-row layout on the stage |
| **Two elements per foe** | Signatures | `element` becomes a list; moves carry their own element; weaknesses from the rule above |
| **Two actions a round** for solo elites | Solos stay threatening | A flag on the foe; the engine already orders turns by initiative |
| **Waves** | Attrition inside a stage | The stage holds 1–3 waves; the next wave starts when one falls, with HP, MP and statuses kept |
| **Field effects** (later) | Biome identity | One modifier per fight, applied by the engine's existing damage and turn-order hooks |
| **Budget per template** | Equal difficulty | Replaces chapter-node HP tuning; the campaign sim checks win rates per template |
