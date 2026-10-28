# The Uma RPG manual

What the game **is**, today: the reference for any session, Claude's or another agent's. Everything here describes the
code as it runs on https://uma-rpg.web.app. Specs, plans and history live elsewhere (see the end).

## Topics

| Page | Find there |
|---|---|
| [Architecture](architecture.md) | Repos, packages, the web app, the API, the save and its history, private content, deploy, local setup |
| [Dependencies](dependencies.md) | Tooling, every package and version, cloud services, uma-platform packages |
| [Game loops](loops.md) | Collection and parties, leveling, Class Rank and Marks, Laurels and currencies, Speed Tickets, the Exchange and the Warehouse, the Tier rework's updates, Craft Level and trades, Extra Stats and gear, Springs and Sweeps, the Rift, achievements |
| [Game sections](sections.md) | Every Hub page and place, every screen, the global UI |
| [Combat](combat.md) | Rounds, actions, the damage stack, her accessory and signature, weaknesses, shields and Breaks, statuses, support, MP and the Flourish, Limit Breaks, foes, the Rift's foes, constants |
| [Classes and weapons](classes.md) | The six classes, her calling and template, ten weapons in three slots, armor and the accessory, presets, skill depths, lines and Skill Ranks, the four bars |
| [Skill trees](skill-trees.md) | Every tree and node with its line, MP and effect; the lines at a glance; Pierce; equipped skills |
| [Halls of Heroes](heroes.md) | Six halls: Heroes, Learners, Bonds and the 24 unique Limit Breaks |
| [Materials](materials.md) | The lines and their G1–G10 materials, the fifteen Wilds places, the made items and their recipes, gear by grade |
| [The world map](maps.md) | Biomes, signatures, a stage's foes, formations and waves, capitals, continents and regions |

Looking for one thing? Search this folder first (`rg -n "Spring" docs/game`). Each page names the code it describes.

## How these docs stay true

- **Lists are generated from the code.** Each table between `<!-- live:<key> -->` and `<!-- /live -->` is rendered from
  the rules by `packages/domain/src/docs/render.ts`.
- **CI catches a stale page.** `packages/domain/src/docs/docs.test.ts` fails when a page no longer matches the code, so a
  rule change can't ship with a stale doc.
- **After a rule change, run `pnpm docs:update`.** It rewrites every live block. Commit the result with the change.
- **Hand-written parts are edited by hand.** Keep them in the same commit as the code they describe. A new list that
  can be generated gets a key in `render.ts` rather than a hand-typed table.
- **Original-game content stays out.** That means no outfit, character or scenario names from master data, and no
  franchise cast. Continents appear by number.

## Elsewhere

| Where | What it is |
|---|---|
| `docs/handoff/` | The current phase (Tier 1 hardening, from 2026-10-28) and its packets |
| `docs/decisions.md` | The decision log from D238 on (D1–D237 are in the archive) |
| `docs/design/` | The Tier rework's approved designs (Tier 1 as designed, and the Tier 2 and 3 drafts the coming rework starts from), and the live specs of the Rift, the Uma profile, pacing and the enemy roster. Where they differ from this manual, the manual and the code win |
| `docs/technical/`, `docs/testing/` | Infrastructure values, older architecture notes, the phone check |
| `docs/archive/` | History: decisions D1–D237, finished plans and packets, superseded specs, the slices. Never current rules |
| `AGENTS.md`, `CLAUDE.md` | How to work in this repo |