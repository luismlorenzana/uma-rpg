# Tasks — S3 to S7

Everything else open: [handoff/](../handoff/README.md).

Slice tasks and the [build plan](../plan.md) are history. Releases are checked with the
[current phone script](../testing/phone-check.md). **A task file is deleted in the commit that finishes it** (D35).

T015–T019 are done: the engine and campaign port with ten-level chapters, save v3 with class builds and runs, the
private PriConne cast pipeline, the chapter map, the Phaser fight and result, and the skills page (now in the code,
[battles.md](../design/battles.md), [architecture.md](../technical/architecture.md) and D48–D53).

## Conventions every task follows

- Mobile first at 390×844 (check 375×667): 44 pt targets, safe areas, `h-dvh`. Main JS ≤ 230 KB gzip (D56); place pages
  and Phaser are lazy chunks.
- Rules live in `@rpg/domain` with Vitest tests; the web app only calls them. No network in tests; fixtures are
  invented (no original-game or PriConne content in tests or git).
- Every screen is a place (D31, D43). Conventional Commits; work on a branch and open a pull request.
