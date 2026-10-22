# Uma RPG

A personal, never-distributed party RPG inspired by *Umamusume: Pretty Derby* and Octopath Traveler, played on the
owner's iPhone as a Home Screen web app at https://uma-rpg.web.app. It has:

- a three-page Hub of the Wilds, halls and town;
- passive professions;
- per-Uma leveling with six classes and fifty skill trees, one healer a party (classes v2);
- crafting, Star Gems and Extra Stats;
- a world map of five continents and turn-based party battles with Breaks, waves and Limit Breaks.

## Status

Tier 1 is playable end to end: slices S1–S8, the world map (W1–W3, W5 pixel maps) and the class rework (D86). S8 is the
Rift (D161, D175): twenty Lv 50 Umas seal four fronts and the Convergence, then ascend to Tier 2. What's next is ranked
in [docs/handoff/](docs/handoff/README.md). See the cross-game [roadmap](https://github.com/luismlorenzana/uma-platform/blob/main/docs/roadmap.md).

## Documentation

Private enemies: [the roster and its release pipeline](docs/design/enemy-roster.md).

| Doc | What |
|---|---|
| [docs/game/](docs/game/README.md) | **The manual: the game as it is today.** Architecture, dependencies, loops, sections, combat, classes, every skill tree, materials, the world map. Its lists are generated from the code |
| [docs/decisions.md](docs/decisions.md) | Why things are the way they are (append-only) |
| [docs/handoff/](docs/handoff/README.md) | Every open task, ranked, as a self-contained packet; what was dropped and why |
| [docs/testing/phone-check.md](docs/testing/phone-check.md) | The current release check on the iPhone |
| [docs/design/](docs/design/) | Specs and proposals, including some for things not built yet |
| [docs/technical/infrastructure.md](docs/technical/infrastructure.md) | Every production value |
| [docs/open-questions.md](docs/open-questions.md) | What waits on the owner |
| [docs/plan.md](docs/plan.md), [docs/slices/](docs/slices/S2-collection.md) | The build history, slice by slice |
| uma-platform `docs/architecture.md` | Cross-game architecture: master data, shared packages, art |
