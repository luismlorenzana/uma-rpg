# uma-rpg — working notes for Claude

- Before working here, read the cross-game plan in the sibling repo: `../uma-platform/docs/architecture.md`,
  `roadmap.md` and `decisions.md` (also on GitHub at `luismlorenzana/uma-platform`).
- **`docs/game/` is the manual of the game as built.** Read it first for any rule, list or screen. After a rule change,
  run `pnpm docs:update` so its generated lists match, and keep its hand-written pages in step with the code.
- This game stands alone: its own save, rules, economy and Firebase/GCP project. It reads master data from uma-platform
  by stable IDs only, and never imports from uma-racer or uma-puzzle at runtime.
- The RPG rules being ported live in uma-racer on `origin/main`: `packages/domain/src/rpg/`, `apps/web/src/screens/rpg/`,
  `apps/web/src/ui/rpg/`, `apps/api/src/save/rpg-*`. The local uma-racer checkout may sit on an old branch.
- Shared changes (master data schema, shared packages, original art) happen in a uma-platform session.
- **One game or both:** [docs/change-protocol.md](docs/change-protocol.md). Changes to anything uma-kit draws (frame, bars,
  menu, side panel, sheets, Hub map, theme) go through uma-platform as a "Both apps:" request and a kit release, never a
  fork here.
- **Original-game content never goes in git.**
- The owner prefers **no open questions**: decide with a recommendation when a sensible default exists, and log it.
- **Claude commits and pushes to `main`** in Conventional Commits style (owner, 2026-10-10). Delegated agents use a branch and a pull request. Check `git status` before every commit: no original-game content.
- **ChatGPT's pull requests:** ChatGPT may merge its own (owner, 2026-10-13), logging its packet's decisions. Before a
  push, fetch `main` so decision numbers don't collide. When Claude reviews one, send back only must-fixes (a broken
  rule, original-game content, a failing check, a real bug). Claude still versions and publishes uma-art releases in
  uma-platform.

## Building and running

`AGENTS.md` has the commands. Local preview: `.claude/launch.json` starts `rpg-api` (:8081) and `rpg-web` (:5174). The
preview pane can't screenshot WebGL: open the Hub with `?canvas` to check it visually.

## Production

[docs/technical/infrastructure.md](docs/technical/infrastructure.md) has every value. Project `uma-rpg`, site
https://uma-rpg.web.app, Cloud Run `rpg-api`. Every push to `main` verifies and deploys; watch it with
`gh run watch <id> -R luismlorenzana/uma-rpg --exit-status`. **Never change the active gcloud account**: scope commands
with `CLOUDSDK_ACTIVE_CONFIG_NAME=default CLOUDSDK_CORE_PROJECT=uma-rpg`. Never type credentials into sign-in pages.
