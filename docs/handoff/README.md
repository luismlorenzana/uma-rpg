# Handoff: every deferred task, reviewed and ranked

> **Status: 2026-10-11, after D86.** Every open or deferred item from [backlog.md](../backlog.md), the earlier session
> notes and a fresh look at the game after the class rework, each with a self-contained packet in [tasks/](tasks/).
> [master-prompt.md](master-prompt.md) starts a fresh ChatGPT session on them. Claude reviews and merges every pull
> request. When a task is done, its packet is deleted and the backlog updated, as with D35's task files.

## Ranked

Priority: **P1** now (it helps the owner's testing or every session), **P2** next (the world map and battle look),
**P3** later, **P4** waits on an owner decision. Size: S under a day of agent work, M a few days, L a week or more.

| # | Task | Who | Repo | Size | Needs |
|---|---|---|---|---|---|
| **P1** | | | | | |
| [H03](tasks/H03-gear-icons-d86.md) | Gear icons for D86: Katana, Lance, five Tomes, ten Orbs | ChatGPT, then Claude wires | uma-platform | M | — |
| [H05](tasks/H05-dead-code-sweep.md) | Sweep code the class rework left behind | ChatGPT | uma-rpg | S | — |
| **P2** | | | | | |
| [H06](tasks/H06-world-atlas.md) | The world atlas: 19 biomes' tiles, props, liquids, roads, markers, icons | ChatGPT | uma-platform | L | — |
| [H07](tasks/H07-world-map-screens.md) | World, continent and region screens in pixel art | ChatGPT | uma-rpg | L | H06 published |
| [H08](tasks/H08-battle-backdrops.md) | Battle backdrops by biome | ChatGPT | both | M | H06 |
| [H10](tasks/H10-battle-effects-and-familiars.md) | Battle hit effects and Summoner familiars | ChatGPT | both | M | — |
| [H11](tasks/H11-ui-icons.md) | Class emblems and status icons | ChatGPT | both | S | — |
| [H12](tasks/H12-design-docs-refresh.md) | Fold settled rules into the design docs | ChatGPT | uma-rpg | M | — |
| **P3** | | | | | |
| [H13](tasks/H13-w4-field-effects.md) | W4: field effects and home ground | Claude | uma-rpg | M | — |
| [H14](tasks/H14-pacing-simulator.md) | A pacing and economy simulator, Lv1 to 50 | ChatGPT | uma-rpg | M | — |
| [H15](tasks/H15-capital-finals.md) | The capitals' Finals | ChatGPT | uma-rpg | M | — |
| [H16](tasks/H16-main-js-split.md) | Split the domain out of the main JS chunk | ChatGPT | uma-rpg | S | — |
| [H17](tasks/H17-device-accessibility-pass.md) | Device and accessibility pass | ChatGPT, then the owner | uma-rpg | M | — |
| [H18](tasks/H18-sound-effects.md) | Synthesized sound effects | ChatGPT | uma-rpg | S | — |
| [H19](tasks/H19-hub-scroll-zoom.md) | Hub pages that scroll and zoom | ChatGPT | uma-rpg | M | — |
| [H20](tasks/H20-key-boss-faces.md) | Key bosses' faces | Claude, then the owner | uma-rpg | S | — |
| [H21](tasks/H21-ci-ubuntu-26.md) | CI after `ubuntu-latest` moves to Ubuntu 26 | Claude | both | XS | 2026-10-19 |
| [H22](tasks/H22-priconne-name-spellings.md) | PriConne name spellings | The owner, then Claude | uma-rpg | XS | — |
| **P4** | | | | | |
| [H23](tasks/H23-tier-finale-and-promotion.md) | S8: Tier Finale and promotion | Owner decides, Claude builds | uma-rpg | L | Q6 |
| [H24](tasks/H24-tier-2-3-design.md) | Tier 2 and 3 design | Owner and Claude | uma-rpg | M | Q7, H23 |
| [H25](tasks/H25-uma-racer-phase-3.md) | uma-racer phase 3 | Owner and Claude | uma-racer | L | A Farm spec |
| [H26](tasks/H26-uma-puzzle-phase-4.md) | uma-puzzle phase 4 | Owner and Claude | uma-puzzle | L | A billing slot |

**For ChatGPT, in order:** H05, H03, then H06 → H07 → H08, H10, H11, H12, H14, H15, H16, H17, H18, H19.

**Done:** H01, the art calibration (passed, D90; its lessons are folded into H03 and H06), and H02, auto-battle and
speed (D89), H09, W3's eight foes, dual elements and waves (D91), and H04, the
[current phone check](../testing/phone-check.md).

## Not relevant anymore

| Item | Where it was | Why it's gone |
|---|---|---|
| Cleric depth 1 and 5 side nodes | Earlier session notes | D86 rewrote the Cleric (statuses on any five weapons) |
| Rush value | Balance 2 | Rush became Time Tickets (D74); what's left is in H14 |
| A campaign simulator for chapters 2–5 | Engineering 2 | Chapters are gone (D72); `world/balance.test.ts` covers battles and H14 covers pacing |
| Scenario flavor | Not built 6 | The world map gives each continent its biomes and leans (D72); the rest is the capitals' Finals (H15) |
| The Tier Finale's difficulty spike | Not built 7 | Part of S8 (H23) |
| Every family in demand | Balance 5 | D86 made it provable: `economy/materials.test.ts` checks gear and dishes use every family alike. Input counts move to H14 |
| Puzzle & Dragons pack | Earlier session | The owner dropped it |
| Echocalypse pack | D84 | Replaced by Girls' Frontline (D85). Its leftover bucket folder (about 5 MB) awaits the owner's OK to delete |
| Girls' Frontline pack | Not built 1 | Done: 418 T-Dolls published (D88) |
| Chibis for newer outfits | Presentation 3 | The source has no chibis for them; the icon is the accepted fallback |
| Rivals as bust portraits | Presentation 2 | Five of six packs ship full-body art (D81, D85); effects and sound are H10 and H18 |
| Warehouse limits | Quality of life 1 | Recommendation: don't build. Unlimited storage costs nothing in a personal game, and a cap would only add chores |
| Pixel-art UI frames | uma-platform roadmap | Recommendation: don't build. The flat UI reads better at phone size; the art goes into maps, icons and battles |
| Balance passes that need real play | Balance 1–4, 6 | Not a task an agent can finish: the owner plays, H14 gives the numbers, Claude retunes |

## How a packet reads

Each packet stands alone: **Why**, **Context** (what to read, what exists), **Do** (the work, with decisions already
made), **Done when** (checks anyone can run) and **Deliver** (branch, pull request, what to attach). Decisions a packet
makes are logged in [decisions.md](../decisions.md) by Claude when the pull request merges.
