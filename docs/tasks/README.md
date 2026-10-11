# Tasks — S3 to S7

Everything else open or deferred: [backlog.md](../backlog.md).

Implementable tasks for the active slice ([S3 spec](../slices/S3-battles.md), [build plan](../plan.md)). **A task
file is deleted in the commit that finishes it** (D35).

T015–T019 are done: the engine and campaign port with ten-level chapters, save v3 with class builds and runs, the
private PriConne cast pipeline, the chapter map, the Phaser fight and result, and the skills page (now in the code,
[battles.md](../design/battles.md), [architecture.md](../technical/architecture.md) and D48–D53).

| Task | What | Status |
|---|---|---|
| [T014](T014-s2-release.md) | S2's phone check | Live since `2c60abe`; the owner's check is still open |
| [T020](T020-s3-release.md) | S3's phone check | Live since `238b060`; the owner's check is open |
| [T021](T021-s4-release.md) | S4's phone check | Live; the owner's check is open |
| — | S5: the [exit check](../slices/S5-learning.md#exit-check) | Live; the owner's check is open |
| — | S6: the [exit check](../slices/S6-kitchen.md#exit-check) | Live; the owner's check is open |
| — | S7: the [exit check](../slices/S7-forge.md#exit-check) | Live; the owner's check is open |

## Conventions every task follows

- Mobile first at 390×844 (check 375×667): 44 pt targets, safe areas, `h-dvh`. Main JS ≤ 180 KB gzip; place pages
  and Phaser are lazy chunks.
- Rules live in `@rpg/domain` with Vitest tests; the web app only calls them. No network in tests; fixtures are
  invented (no original-game or PriConne content in tests or git).
- Every screen is a place (D31, D43). Conventional Commits; Claude commits and pushes to `main`.
