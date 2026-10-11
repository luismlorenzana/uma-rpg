# Backlog: everything open or deferred

> **Status: 2026-10-11, after D86.** Every open item now has a packet in [handoff/](handoff/README.md), ranked, with
> the items that no longer apply listed there and why. When one is done, delete its packet and its line here, and record
> what changed in the docs or [decisions.md](decisions.md). New slices still get a spec and tasks first (D35).

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

Many of these steps predate D72–D86; [H04](handoff/tasks/H04-phone-test-script.md) replaces them with one current script.

## Game

| Packet | What |
|---|---|
| [H09](handoff/tasks/H09-w3-foes-elements-waves.md) | W3: up to eight foes, dual-element foes, waves |
| [H13](handoff/tasks/H13-w4-field-effects.md) | W4: field effects and home ground |
| [H15](handoff/tasks/H15-capital-finals.md) | The capitals' Finals |
| [H20](handoff/tasks/H20-key-boss-faces.md) | Key bosses' faces (the owner picks; packs are private) |
| [H23](handoff/tasks/H23-tier-finale-and-promotion.md) | S8: Tier Finale and promotion (parked; needs Q6) |
| [H24](handoff/tasks/H24-tier-2-3-design.md) | Tier 2 and 3 design (parked; needs Q7) |

## Art and presentation

| Packet | What |
|---|---|
| [H03](handoff/tasks/H03-gear-icons-d86.md) | Gear icons for D86's types (today they borrow older art with a kind badge) |
| [H06](handoff/tasks/H06-world-atlas.md), [H07](handoff/tasks/H07-world-map-screens.md) | The world map in pixel art (W5, [map-art.md](design/world/map-art.md)) |
| [H08](handoff/tasks/H08-battle-backdrops.md) | Battle backdrops by biome |
| [H10](handoff/tasks/H10-battle-effects-and-familiars.md) | Battle hit effects and Summoner familiars |
| [H11](handoff/tasks/H11-ui-icons.md) | Class emblems and status icons |
| [H18](handoff/tasks/H18-sound-effects.md) | Synthesized sound effects |
| [H19](handoff/tasks/H19-hub-scroll-zoom.md) | Hub pages that scroll and zoom |
| [H22](handoff/tasks/H22-priconne-name-spellings.md) | PriConne name spellings (private content) |

## Balance: needs real play

The numbers are a first pass from the pacing model (D54), pinned by tests but not yet played for long: professions and
job times, the Laurel economy (replays D79, token trading D80, late Laurels D82, Time Tickets D74), battle difficulty
with real rosters and gear, gear and food parity, recipe input counts, and the collection pace (all 268 outfits take
248 Umas at Lv50, D40). The owner plays; [H14](handoff/tasks/H14-pacing-simulator.md) gives the numbers; Claude retunes.

## Engineering and docs

| Packet | What |
|---|---|
| [H04](handoff/tasks/H04-phone-test-script.md) | One current phone test script |
| [H05](handoff/tasks/H05-dead-code-sweep.md) | Code the class rework left behind |
| [H12](handoff/tasks/H12-design-docs-refresh.md) | Fold settled rules into the design docs (game-design.md is still "draft v0.4") |
| [H14](handoff/tasks/H14-pacing-simulator.md) | A pacing and economy simulator |
| [H16](handoff/tasks/H16-main-js-split.md) | Main JS is about 194 KB of D56's 230 KB budget: split the domain out |
| [H17](handoff/tasks/H17-device-accessibility-pass.md) | Device and accessibility pass |
| [H21](handoff/tasks/H21-ci-ubuntu-26.md) | CI: `ubuntu-latest` moves to Ubuntu 26 on 2026-10-19; watch the next deploy |

## Other repos (the cross-game roadmap)

| Packet | What |
|---|---|
| [H25](handoff/tasks/H25-uma-racer-phase-3.md) | uma-racer phase 3: a Farm rework spec with the owner first |
| [H26](handoff/tasks/H26-uma-puzzle-phase-4.md) | uma-puzzle phase 4: needs a free GCP project slot (5 of 5 used) |

uma-platform's art round (tiles, maps, effects) is H03, H06, H08, H10 and H11; shared packages wait until a second game
needs them (its P11).
