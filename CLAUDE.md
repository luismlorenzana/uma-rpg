# uma-rpg — working notes for Claude

- Before working here, read the cross-game plan in the sibling repo: `../uma-platform/docs/architecture.md`,
  `roadmap.md` and `decisions.md` (also on GitHub at `luismlorenzana/uma-platform`).
- This game stands alone: its own save, rules, economy and Firebase/GCP project. It reads master data from uma-platform
  by stable IDs only, and never imports from uma-racer or uma-puzzle at runtime.
- The RPG rules being ported live in uma-racer on `origin/main`: `packages/domain/src/rpg/`, `apps/web/src/screens/rpg/`,
  `apps/web/src/ui/rpg/`, `apps/api/src/save/rpg-*`. The local uma-racer checkout may sit on an old branch.
- Shared changes (master data schema, shared packages, original art) happen in a uma-platform session.
- **Original-game content never goes in git.**
- The owner prefers **no open questions**: decide with a recommendation when a sensible default exists, and log it.
- **Claude commits and pushes to `main`** in Conventional Commits style (owner, 2026-10-10). Delegated agents use a branch and a pull request. Check `git status` before every commit: no original-game content.
