# Backlog: everything open or deferred

> **Status: 2026-10-10, after S7.** Every known open item, by kind. When one is done, delete it here and record what
> changed in the docs or [decisions.md](decisions.md). New slices still get a spec and tasks first (D35).

## Your checks

| Slice | Phone check |
|---|---|
| S2 | [Collection and parties](slices/S2-collection.md#exit-check) |
| S3 | [Battles and leveling](slices/S3-battles.md#exit-check) |
| S4 | [Farmlands and Wilds](slices/S4-farm.md#exit-check) |
| S5 | [Learning District](slices/S5-learning.md#exit-check) |
| S6 | [Kitchen and Extra Stats](slices/S6-kitchen.md#exit-check) |
| S7 | [Forge and equipment](slices/S7-forge.md#exit-check) |
| QoL | On the phone (Home Screen app): Account → Notifications on → Send a test; start a short job, close the app, get the push |

## Not built yet

1. **The world map** (D66): five continents of 20 regions at fixed levels and 240 stages each, one active party,
   carried MP and Springs, no chapters. Design in [design/world/](design/world/README.md); build steps W1–W5.
2. **S8: the Tier Finale and promotion** (parked by the owner). Needs Q6 (Gauntlet, Raid or Siege), then promotion at
   Lv50, the Tier 2 world, legacy skills, and what the banked EXP at Lv50 is for.
3. **Tier 2 and 3 design**: each tier's own mechanic (design §2.2), Tier 3's four chapters, Q7 (a third profession).
4. **Scenario flavor** (design §12): chapters differ only by their authored Finals (the world map proposal answers
   this with biomes and continent leans).
5. **The Tier Finale's difficulty spike** (design §12), with S8.

## Balance: needs real play

The numbers are a first pass from the pacing model (D54), pinned by tests but not yet played for long.

1. Profession speed, job sizes, training times and facility upgrade costs (items rebalanced to slow single items, D65,
   after the owner's first play).
2. The Laurel economy: payouts against Exchange prices, Rush and Sweep value.
3. Battle difficulty past the first fights, with real rosters, gear and Extra Stats; the foe budget (+0.35% per level
   past Lv10, D59).
4. Extra Stats and gear point values (1.5% a point) and the gear-versus-food parity (§7.3).
5. Dish and gear recipes: input counts, and whether every family really stays in demand.
6. The collection pace: all 268 outfits take 248 Umas at Lv50 (D40).

## Presentation and art (lean on purpose, owner 2026-10-10)

1. **The Hub**: pixel-art terrain and buildings shipped 2026-10-10 (D64); the design's scrolling and zooming pages are
   still to come (each page fits one screen).
2. **Battles**: rivals are bust portraits; effects are procedural; no sound, no battle speed or auto-battle option.
3. **Chibis**: newer outfits without one in the master data show their icon.
4. **PriConne names**: English names come from the site's slugs plus a few fixes; some may need proper spellings.
   Costume variants are out of scope.

## Quality of life

1. **Warehouse limits**: storage is unlimited; there's no cap to manage yet. (Job queues, Sweep ×N, filters, selling
   and push notifications shipped 2026-10-10: D62, D63.)

## Engineering

1. **Main JS** is 191 KB of a 230 KB budget (D56): split the domain rules out of the main chunk.
2. **A campaign simulator** for chapters 2–5 with gear and Extra Stats, like uma-racer's, to back the balance pass.
3. **Device pass**: performance and accessibility on the iPhone; only phone layouts exist.
4. **CI**: GitHub's `ubuntu-latest` moves to Ubuntu 26 on 2026-10-19; watch the next deploy after that.
5. **Docs**: game-design.md is still "draft v0.4" with `[Proposed]` tags on settled rules; items.md and §14 are out of
   date. Fold them in when the owner reviews.

## Other repos (the cross-game roadmap)

1. **uma-platform**: original art for tiles, maps, UI frames, effects and farm props; extract shared packages once a
   second game needs them (its P11).
2. **uma-racer (phase 3)**: a Farm rework spec with the owner, tag `pre-split`, switch to platform master data, strip
   the RPG and puzzles. Untouched until then.
3. **uma-puzzle (phase 4)**: design spec, scaffold from the shared kit, port the puzzle core. Its GCP project needs a
   free slot on the billing account (5 of 5 used).
