# AGENTS.md — guide for AI coding agents

uma-rpg is a personal, never-distributed party RPG inspired by *Umamusume: Pretty Derby*, played on the owner's iPhone
as a Home Screen web app. Read this before changing anything.

## Read first

1. `README.md`: status and the documentation map.
2. `docs/design/` for the system you're touching. **The design docs are the source of truth.** Code follows them.
3. `docs/plan.md` (slices), the active slice spec in `docs/slices/`, and your task in `docs/tasks/`.
4. `docs/decisions.md` (append-only) and `docs/technical/architecture.md`.
5. The cross-game plan: uma-platform `docs/architecture.md`.

## Hard rules

- **Original-game content never goes in git.** Master data comes from uma-platform's private release; test fixtures come
  from `@luismlorenzana/uma-data/testing`. Screenshots showing original art stay local.
- **Every screen is a place** (`/:page/:placeId/*`, D31). Don't add top-level routes.
- **Don't push to `main`.** Work on `feat/…`, `fix/…` or `docs/…` and open a pull request. CI must pass.
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
node scripts/cast/import.mjs   # private PriConne cast → content/release (gitignored; needs content/sources, D50)
bash scripts/cast/publish.sh   # upload it to gs://uma-rpg-content (scoped gcloud, never changes the account)
node scripts/cast/import-azurlane.mjs && bash scripts/cast/publish.sh azurlane   # Azur Lane pack (D76)
node scripts/cast/import-nikke.mjs && bash scripts/cast/publish.sh nikke         # NIKKE pack (D81)
node scripts/cast/import-destinychild.mjs && bash scripts/cast/publish.sh destinychild   # Destiny Child pack (D81)
node scripts/cast/import-lastorigin.mjs && bash scripts/cast/publish.sh lastorigin       # owner only: its wiki asks AI agents not to fetch
node scripts/cast/import-echocalypse.mjs && bash scripts/cast/publish.sh echocalypse     # Echocalypse pack (D84)
```

## Conventions

- TypeScript strict with `noUncheckedIndexedAccess`; Vitest next to the code; no network in tests.
- Mobile first at 390×844 (check 375×667): 44 pt targets, safe areas, `h-dvh`. Main JS ≤ 180 KB gzip; heavy code lazy.
- Conventional Commits; the body explains why.
