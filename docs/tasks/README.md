# Tasks — S2 Collection and parties

Implementable tasks for the active slice ([S2 spec](../slices/S2-collection.md), [build plan](../plan.md)). **A task
file is deleted in the commit that finishes it** (D35). S1's last task, the owner's phone check (T009), passed on
2026-10-10: signed in on the iPhone and browsing the roster.

T010–T013 are done: place pages, save v2 and its rules, the Stable page and the Party Hall (now in the code,
[architecture.md](../technical/architecture.md) and the design docs).

| Task | What | Status |
|---|---|---|
| [T014](T014-s2-release.md) | Hub summaries, Account count, deploy and phone check | Built; deploying, then the owner's check |

## Conventions every task follows

- Mobile first at 390×844 (check 375×667): 44 pt targets, safe areas, `h-dvh`. Main JS ≤ 180 KB gzip; place pages
  are lazy chunks.
- Rules live in `@rpg/domain` with Vitest tests; the web app only calls them. No network in tests; fixtures from
  `@luismlorenzana/uma-data/testing`.
- Every screen is a place (D31, D43). Conventional Commits; Claude commits and pushes to `main`.
