# H05 — Sweep code the class rework left behind

**Priority P1 · ChatGPT · uma-rpg · S.**

## Why

D86 replaced builds with classes. It also retired Ultima, the staves, the Summoner Tome, blessings, regen, erosion and
the familiar, and moved the engine to v6. A few leftovers survived, and dead code misleads the next change.

## Context

- **What D86 changed:** `docs/decisions.md` D86 and `docs/design/class-rework.md`.
- **Known leftovers:**
  - `apps/web/src/battle/labels.tsx` `BRANCH_LABEL` (old tree names: ultima, duel, melee, tempo, grace, malice,
    sanctuary, angels, demons, archons) has no users.
  - `apps/web/src/battle/scene/BattleScene.ts` line ~20 still colors `ultima` and `staff`.
- **Probably more:** old kinds, statuses (`regen`, `erosion`, `sacred`), the `ultima` damage kind, build-era names
  (`build`, `builds`), Short Sword, Spear and staff labels, `BATTLE_ULTIMA` mentions in comments.
- **Leave alone:** save migrations (`packages/domain/src/save/save.ts`, `toV13`, `toV14`, `OLD_BUILD_CLASS`). They
  read old saves on purpose, so their old names stay. The same goes for the old-chapter machinery that the world map
  still reuses (`rpg/campaign/chapters.ts`, `finals.ts`).

## Do

1. Search the workspace for each retired name (`rg -n "ultima|staff|short-sword|spear|summoner-tome|regen|erosion|sacred|blessing|familiar|BRANCH_LABEL|builds?\b"`)
   and for exports with no importers. For a quick list of unused exports, run
   `npx --yes knip --no-config-hints --include exports,files`.
2. Remove what is dead, outside migrations and their tests. Fix comments that describe the old rules.
3. Where a type still allows a retired value only for old saves, keep it and say so in a one-line comment.

## Done when

- `pnpm lint && pnpm test && pnpm build` pass.
- The search above only hits migrations, their tests and comments that explain them.
- The pull request lists each removal in one line.

## Deliver

A pull request on `fix/d86-leftovers`, titled `refactor: remove code the class rework left behind (H05)`.
