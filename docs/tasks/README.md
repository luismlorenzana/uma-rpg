# Tasks — S1 Hub and foundation

Implementable tasks for the active slice ([S1 spec](../slices/S1-hub.md), [build plan](../plan.md)). Each file says
what to build, which files to touch, the contracts, and how to prove it works. **A task file is deleted in the commit
that finishes it** (D35). The design docs and code carry the result.

T001 and T003–T008 are done (their rules now live in [architecture.md](../technical/architecture.md) and the code).

| Task | What | Status |
|---|---|---|
| [T002](T002-infrastructure.md) | GCP/Firebase project, deploy pipeline, master data read access | Infrastructure created; waiting on two owner clicks (Google sign-in, package access) for the first deploy |
| [T009](T009-release.md) | First deploy and phone proof (the S1 exit check) | Next |

## Conventions every task follows

- **Stack:** uma-platform architecture §4 (React 19, Vite, Tailwind 4, Motion `LazyMotion strict`, Zustand + Dexie,
  React Router 7, NestJS 11, Firebase Hosting + Auth, Cloud Run, Firestore, Phaser 4). Package scope `@rpg/*`.
- **Reuse uma-racer before inventing.** Copy from `../uma-racer` on `origin/main` (the local checkout may sit on an old
  branch: read with `git -C ../uma-racer show origin/main:<path>`). Strip anything RPG-token, puzzle, farm, card or
  race related.
- **Local dev** runs on web :5174 and API :8081, so it can run beside uma-racer (:5173/:8080).
- **Original-game content never goes in git.** Master data comes from uma-platform's private release; test fixtures
  come from `@luismlorenzana/uma-data/testing`.
- TypeScript strict with `noUncheckedIndexedAccess`; Vitest next to the code; no network in tests.
- Mobile first at 390×844 portrait (also check 375×667): 44 pt targets, safe-area padding, `h-dvh`.
- Main JS ≤ 180 KB gzip: Phaser, Firebase and every overlay are lazy chunks.
- Conventional Commits. Claude commits and pushes to `main`. Run `pnpm lint && pnpm test && pnpm build` before
  pushing.
