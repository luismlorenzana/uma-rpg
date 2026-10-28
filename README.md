# Uma RPG

A personal, never-distributed party RPG inspired by *Umamusume: Pretty Derby* and Octopath Traveler, played on the
owner's iPhone as a Home Screen web app at https://uma-rpg.web.app. It has:

- a three-page Hub of the Wilds, halls and town;
- per-Uma leveling with six classes, three weapons a class and fifty skill trees (a trunk, one fork, Skill Ranks), one
  healer a party, and each Uma's calling and template;
- the farm by line: fifteen Wilds places where each trade gathers, processes and makes its own line's G1–G10 items, which
  raise her gear by grade and open her Extra Stats (the Planet and its moons);
- a world map of five continents and turn-based party battles with weaknesses, Breaks, waves and Limit Breaks;
- the Rift, the end-of-tier event that promotes a roster to the next tier.

## Status

Tier 1 is built and live (engine v18, save v31): the Tier rework's R1 and R2 and the owner's iterations since. **The
current phase is Tier 1 hardening** ([docs/handoff/](docs/handoff/README.md)); Tier 2 and Tier 3 run Tier 1's rules ×
tier until they are re-planned after it. See the cross-game [roadmap](https://github.com/luismlorenzana/uma-platform/blob/main/docs/roadmap.md).

## Documentation

Private enemies: [the roster and its release pipeline](docs/design/enemy-roster.md).

| Doc | What |
|---|---|
| [docs/game/](docs/game/README.md) | **The manual: the game as it is today.** Architecture, dependencies, loops, sections, combat, classes, every skill tree, materials, the world map. Its lists are generated from the code |
| [docs/handoff/](docs/handoff/README.md) | The current phase (Tier 1 hardening) and its packets |
| [docs/decisions.md](docs/decisions.md) | Why things change, from D238 (append-only) |
| [docs/testing/phone-check.md](docs/testing/phone-check.md) | The current release check on the iPhone |
| [docs/design/](docs/design/tier-rework/README.md) | The Tier rework's approved designs (the Tier 2 and 3 drafts included) and a few live specs |
| [docs/technical/infrastructure.md](docs/technical/infrastructure.md) | Every production value |
| [docs/open-questions.md](docs/open-questions.md) | What waits on the owner |
| [docs/archive/](docs/archive/README.md) | History: decisions D1–D237, the build plans and slices, done packets, superseded specs |
| uma-platform `docs/architecture.md` | Cross-game architecture: master data, shared packages, art |
