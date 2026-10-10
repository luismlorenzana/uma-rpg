# T001 — Monorepo scaffold and CI

**Goal:** an empty but complete pnpm + Turbo monorepo that lints, tests and builds locally and in CI.

## Build

```text
apps/web          @rpg/web     React 19 + Vite + Tailwind 4 + Motion + Zustand + Dexie + React Router 7 + PWA
apps/api          @rpg/api     NestJS 11 (Cloud Run)
packages/domain   @rpg/domain  pure game rules and types (no I/O)
```

- Root: `package.json` (pnpm 10, Node ≥ 22, scripts `dev`, `lint`, `test`, `build`), `pnpm-workspace.yaml`,
  `turbo.json` (`agentGuidance: false`, as in uma-platform P30), `tsconfig.base.json` (copy uma-platform's), `.nvmrc`
  (22).
- `.npmrc` (committed, no secret): `@luismlorenzana:registry=https://npm.pkg.github.com` and
  `//npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}`. Install `@luismlorenzana/uma-data` at an exact version
  (`1.0.0`) in `packages/domain` and `apps/web` (and `apps/api` in T003). Locally:
  `NODE_AUTH_TOKEN=$(gh auth token) pnpm install`.
- `lint` = `tsc --noEmit` per package. `test` = Vitest. `build` = per-app production build.
- `apps/web`: Vite on :5174 with `/api` proxied to :8081; Tailwind 4 with the uma-racer dark tokens (copy its theme
  CSS); a placeholder `App` that renders "Uma RPG".
- `apps/api`: Nest on :8081 with only `GET /api/health → { ok: true }`. Copy uma-racer's `main.ts` and `Dockerfile`,
  then strip them.
- `packages/domain`: `src/index.ts` and one trivial test.
- CI `.github/workflows/ci.yml`: on push and PR, `pnpm install --frozen-lockfile` (with `NODE_AUTH_TOKEN` =
  `GITHUB_TOKEN` and `packages: read`), then lint, test, build. The `uma-data` package must grant this repo read
  access: on GitHub, uma-data → Package settings → Manage Actions access → add `uma-rpg` (an owner step, if Claude can't
  do it through `gh api`).
- Update `AGENTS.md` (new, adapted from uma-racer's) and `CLAUDE.md` with the commands.

## Done when

- `pnpm install && pnpm lint && pnpm test && pnpm build` passes from a fresh clone.
- `pnpm dev` serves the web placeholder on :5174, and `curl localhost:8081/api/health` works.
- CI passes on `main`.
