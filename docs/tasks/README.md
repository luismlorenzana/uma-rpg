# Tasks — S2 Collection and parties

Implementable tasks for the active slice ([S2 spec](../slices/S2-collection.md), [build plan](../plan.md)). **A task
file is deleted in the commit that finishes it** (D35). S1's last task, the owner's phone check (T009), passed on
2026-10-10: signed in on the iPhone and browsing the roster.

| Task | What | Depends on |
|---|---|---|
| [T010](T010-place-pages.md) | Place pages: quick look at `?peek=`, full pages at `/:page/:placeId/*` | — |
| [T011](T011-save-v2.md) | Save v2: roster and parties, migration, unlock and party rules, server downgrade guard | — |
| [T012](T012-stable-page.md) | Stable page: ownership, search, filters, sorts, views, unlock flow, owned profile | T010, T011 |
| [T013](T013-party-hall.md) | Party Hall page: 20 parties, edit, picker, moves, busy look | T010, T011 |
| [T014](T014-s2-release.md) | Hub summaries, Account count, deploy and phone check | all |

## Conventions every task follows

- Mobile first at 390×844 (check 375×667): 44 pt targets, safe areas, `h-dvh`. Main JS ≤ 180 KB gzip; place pages
  are lazy chunks.
- Rules live in `@rpg/domain` with Vitest tests; the web app only calls them. No network in tests; fixtures from
  `@luismlorenzana/uma-data/testing`.
- Every screen is a place (D31, D43). Conventional Commits; Claude commits and pushes to `main`.
