# The Uma RPG manual

What the game **is**, today: the reference for any session, Claude's or another agent's. Everything here describes the
code as it runs on https://uma-rpg.web.app. Specs, plans and history live elsewhere (see the end).

## Topics

| Page | Find there |
|---|---|
| [Architecture](architecture.md) | Repos, packages, the web app, the API, the save, private content, deploy, local setup |
| [Dependencies](dependencies.md) | Tooling, every package and version, cloud services, uma-platform packages |
| [Game loops](loops.md) | Collection, leveling, ranks (Class, Weapon, Armor) and Marks, Laurels, currencies, Craft Level, Extra Stats and gear, Springs and Sweeps |
| [Game sections](sections.md) | Every Hub page and place, every screen, the global UI |
| [Combat](combat.md) | Rounds, actions, the damage formula, weaknesses and Breaks, statuses, Limit Breaks, foes, constants |
| [Classes and weapons](classes.md) | The six classes, one healer a party, her calling and template, ten weapons, three weapon slots and armor slots, skill depths, lines and Skill Ranks, the four bars |
| [Skill trees](skill-trees.md) | All 50 trees, every node with its line, MP and effect |
| [Halls of Heroes](heroes.md) | Six halls: Heroes, Learners, Bonds and the 24 unique Limit Breaks |
| [Materials](materials.md) | The 8 families and 160 items, the 100 Star Gems, the 40 gear types and their recipes |
| [The world map](maps.md) | Biomes, signatures, formations and waves, continents and regions, faces |

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
| `docs/decisions.md` | The decision log (D-numbers): why things are the way they are |
| `docs/design/` | Design specs and proposals; some describe plans or older rules |
| `docs/handoff/` | Ranked open tasks as self-contained packets, for Claude or a delegated agent |
| `docs/technical/` | Infrastructure values and older architecture notes |
| `docs/slices/`, `docs/tasks/`, `docs/plan.md` | The build history, slice by slice |
| `AGENTS.md`, `CLAUDE.md` | How to work in this repo |
