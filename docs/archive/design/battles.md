# Battles, world stages and leveling

> **Status: built through W3, D86 and D93, 2026-10-12.** Chapters and per-party runs retired in D72.
> [Combat](../../game/combat.md), [classes](../../game/classes.md) and [maps](../../game/maps.md) are the current rule reference.
> Code: `rpg/battle/`, `world/world.ts`, `save/battle.ts`.

## The loop

Unlock Umas → fill a five-Uma party → pick a world stage → fight → EXP, Laurels and tokens → stronger parties.
Tier 1 milestones pay Shards; five become an Unlock Ticket automatically (D47, D51).
Every entrant receives win EXP, knocked out or not. Replays and Sweeps pay a quarter of a first clear (D79).

## One world run

Progress belongs to the world, not a party. One active party fights; switching is free when no fight is open (D72).
Stages open in order inside a region; continents and regions are open from the start.
Full HP returns at each stage, while MP carries per Uma after wins.
Five Springs per continent refill the active party and recharge for two hours (D72).
Capital Finals are not built; region bosses are not the scenario Finals.

An open fight stores frozen input and every action, and the parser replays it on load (D52).
The lineup cannot change or take jobs mid-fight. Back to the map preserves the fight; Give up closes it without
reward and leaves MP as it was before. Losses do the same.
The final action and its rewards land in one save, not separate updates.

## Waves and foes

Engine v7 supports 1–8 foes per wave, dual elements, twice-acting elites and up to three waves (D91).
Clearing a wave ends the round; the next keeps party HP, MP, statuses, Limit charge and summons.
Each wave has its own round cap. v6 fights replay unchanged.
Look up foes with `battleFoe(state, id)`; `state.input.enemies` holds only the first wave.

Formations, signatures and wave budgets are generated in [the map manual](../../game/maps.md#formations-and-waves).
The field-effect layer is deferred. Private franchise faces follow biome mappings; they do not define battle rules
(D83, D85, D88). Missing art uses a plain fallback.

## Rewards

Regular, elite and boss stages have different weights. First clears triple Laurels; replays use 25% of those
first-clear rewards; Lv41–50 multiplies Laurels by four (D79, D82).
Waves multiply EXP and Laurels by 1.5, and add a token per extra wave (D91, D93).
The generated [reward table](../../game/loops.md#laurels-exp-and-tokens) and
[token catalog](../../game/materials.md#tokens) replace the retired chapter payout tables.

EXP scales ±10% per level gap, clamped to 10%–200%; Uma EXP to the next level is 120 + 16 × level (D48).
The four-hour Lv1→50 fight budget is a target, not a chapter-clear guarantee (D71).
The game and balance simulation share the weakness-aware Auto policy (D89); the owner still validates difficulty
in play.

## Presentation

Phaser plays engine cues; DOM owns lasting numbers, controls and accessible names (D33, D53).
Six to eight foes use two rows. Wave chips and transitions show progress; portraits fit their own aspect ratio (D91).
Auto and 1×/2×/4× are remembered per device (D89).
Reduced motion currently skips playback; code-drawn hit/familiar art is separate queued work, not shipped behavior.
Player-facing labels are short and help lives behind a help button (D95).
