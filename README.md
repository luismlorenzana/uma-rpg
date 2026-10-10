# Uma RPG

A personal, never-distributed party RPG inspired by *Umamusume: Pretty Derby* and Octopath Traveler, played on the
owner's iPhone as a Home Screen web app. It has its own Hub, passive farm, per-Uma leveling, chapter maps and turn-based
party battles.

## Status

Phase 1: the design (v0.4) and item catalog are drafted; **S1, the Hub and foundation**, is specified and broken into
tasks ([plan](docs/plan.md)). See the
cross-game [roadmap](https://github.com/luismlorenzana/uma-platform/blob/main/docs/roadmap.md).

## Where things are decided

| Doc | What |
|---|---|
| [docs/design/game-design.md](docs/design/game-design.md) | The game design (draft) |
| [docs/design/items.md](docs/design/items.md) | Item catalog: 160 raw and 160 refined items (draft) |
| uma-platform `scripts/pixel-art` | Draws the original pixel art (`pnpm art:draw` there, into `assets/`) |
| [docs/plan.md](docs/plan.md) | Build plan: slices S1–S8, each playable on the phone |
| [docs/slices/](docs/slices/S2-collection.md) | Slice specs (S1 done; S2: collection and parties) |
| [docs/tasks/](docs/tasks/README.md) | The active slice's implementable tasks |
| [docs/decisions.md](docs/decisions.md) | This game's decisions (append-only) |
| [docs/open-questions.md](docs/open-questions.md) | What waits on the owner |
| uma-platform `docs/architecture.md` | Cross-game architecture: master data, shared packages, stack, art |
