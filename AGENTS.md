# AGENTS.md — guide for AI coding agents

uma-rpg is a personal, never-distributed party RPG inspired by *Umamusume: Pretty Derby*, played on the owner's iPhone
as a Home Screen web app. Read this before changing anything.

## Read first

1. `docs/game/`: **the manual of the game as it is.** Look up any rule, list or screen there first. Its lists are
   generated from the code; after changing a rule, run `pnpm docs:update` and commit the result (CI fails on a stale page).
2. `README.md`: status and the documentation map.
3. Your task: a packet in `docs/handoff/tasks/`. The current phase (Tier 1 hardening) and its queue are in
   `docs/handoff/README.md`.
4. `docs/design/` for the system you're changing: specs and intent. When a design changes a rule, update the manual in
   the same change. `docs/archive/` is history (old decisions, finished plans, superseded specs): never current rules.
5. `docs/decisions.md` (append-only, from D238; D1–D237 are in `docs/archive/`), and the cross-game plan in uma-platform
   `docs/architecture.md`.

## Hard rules

- **Original-game content never goes in git.** Master data comes from uma-platform's private release; test fixtures come
  from `@luismlorenzana/uma-data/testing`. Screenshots showing original art stay local.
- **Every screen is a place** (`/:page/:placeId/*`, D31). Don't add top-level routes.
- **Don't push to `main`.** Work on `feat/…`, `fix/…` or `docs/…` and open a pull request. CI must pass.
- **Owner-authorized agent delivery (2026-10-13):** use `gh` only for GitHub. After the required checks and CI pass,
  merge the pull request and publish any needed uma-art release; no further owner approval is needed. Never bypass
  repository protection. Use worktrees outside `~/workspace`, and remove them after merging, preserving unfinished work.
- **Don't touch production infrastructure** (`.github/workflows/`, `infra/`, `firebase.json`, `.env.production`,
  `apps/api/Dockerfile`) unless your task says so.
- Append decision rows; never edit old ones. A finished task's spec is deleted in the commit that finishes it (D35).

## Commands

Node 22+, pnpm 10. `@luismlorenzana/*` packages come from GitHub Packages:

```bash
NODE_AUTH_TOKEN=$(gh auth token) pnpm install
pnpm lint && pnpm test && pnpm build
pnpm --filter @rpg/api dev     # API on :8081, auth off, local save, master data from ../uma-platform/content/release
pnpm --filter @rpg/web dev     # web on :5174, /api proxied to :8081
pnpm enemies:release           # locked packs in content/authoring/exports → content/enemies-release (D135, D137)
pnpm enemies:publish           # upload it to gs://uma-rpg-content (scoped gcloud, never changes the account)
```

## Conventions

- TypeScript strict with `noUncheckedIndexedAccess`; Vitest next to the code; no network in tests.
- Mobile first at 390×844 (check 375×667): 44 pt targets, safe areas, `h-dvh`. Main JS ≤ 230 KB gzip (D56); heavy code lazy.
- **Player-facing text is short.** Labels, counts, buttons and plain empty states ("No gear yet"). No placeholders,
  slice or build jargon ("Opens in S6"), and no paragraphs explaining a rule or formula on a screen. Put an
  explanation behind a help button (`apps/web/src/ui/HelpButton.tsx`, an (i) that opens a sheet) only where it helps
  (D95).
- Conventional Commits; the body explains why.
