# Dependencies

What uma-rpg runs on. The package lists are generated from each `package.json`; services and the platform packages
are listed by hand below.

## Runtime and tooling

| Tool | Version |
|---|---|
| Node | 22 or later (`.nvmrc` 22) |
| pnpm | 10 (`packageManager` in `package.json`) |
| TypeScript | 5.9, strict, `noUncheckedIndexedAccess` |
| Turbo | 2 |

`@luismlorenzana/*` packages come from GitHub Packages and need a token to install:
`NODE_AUTH_TOKEN=$(gh auth token) pnpm install`.

## Packages

<!-- live:dependencies -->
**uma-rpg** (`package.json`)

- Runtime: —
- Dev: `turbo` ^2.10.13

**@rpg/web** (`apps/web/package.json`)

- Runtime: `@luismlorenzana/uma-art` 2.2.0, `@luismlorenzana/uma-data` 1.0.0, `@rpg/domain` workspace:*, `dexie` ^4.4.6, `firebase` ^12.19.0, `phaser` 4.2.1, `react` ^19.3.0, `react-dom` ^19.3.0, `react-router` ^7.18.3, `workbox-window` ^7.4.0, `zustand` ^5.0.15
- Dev: `@fontsource-variable/inter` ^5.3.0, `@fontsource-variable/outfit` ^5.3.0, `@tailwindcss/vite` ^4.3.3, `@testing-library/react` ^16.3.3, `@types/node` ^22.20.2, `@types/react` ^19.3.0, `@types/react-dom` ^19.3.0, `@vitejs/plugin-react` ^5.2.0, `fake-indexeddb` ^6.2.5, `jsdom` ^26.1.0, `tailwindcss` ^4.3.3, `typescript` ~5.9.3, `vite` ^7.3.6, `vite-plugin-pwa` ^1.3.0, `vitest` ^3.2.7

**@rpg/api** (`apps/api/package.json`)

- Runtime: `@google-cloud/storage` ^7.22.0, `@luismlorenzana/uma-data` 1.0.0, `@nestjs/common` ^11.2.4, `@nestjs/config` ^4.0.4, `@nestjs/core` ^11.2.4, `@nestjs/platform-express` ^11.2.4, `@rpg/domain` workspace:*, `firebase-admin` ^13.10.0, `google-auth-library` ^11.2.0, `reflect-metadata` ^0.2.2, `rxjs` ^7.8.2, `web-push` ^3.6.7
- Dev: `@nestjs/cli` ^11.0.24, `@types/express` ^5.0.6, `@types/node` ^22.20.2, `@types/web-push` ^3.6.4, `typescript` ~5.9.3, `vitest` ^3.2.7

**@rpg/domain** (`packages/domain/package.json`)

- Runtime: `@luismlorenzana/uma-data` 1.0.0
- Dev: `typescript` ~5.9.3, `vitest` ^3.2.7
<!-- /live -->

## Services

| Service | Used for | Where configured |
|---|---|---|
| Firebase Hosting (`uma-rpg`) | The web app, and `/api/**` rewritten to Cloud Run | `firebase.json`, `.firebaserc` |
| Firebase Auth | Google sign-in; the API verifies ID tokens | `apps/web/.env.production`, `apps/api/src/auth/` |
| Cloud Run (`rpg-api`) | The API | `.github/workflows/deploy.yml` |
| Firestore | Saves, save backups, push subscriptions | `apps/api/src/save/`, `apps/api/src/push/` |
| Cloud Storage | Master data (`uma-platform-master-data`), private cast (`uma-rpg-content`) | Repository variables |
| Artifact Registry | API images | `deploy.yml` |
| Cloud Scheduler | The push tick | `infra/push/setup.sh` |
| Secret Manager | VAPID keys (`rpg-vapid`) | `infra/push/setup.sh` |
| GitHub Actions + Packages | CI and deploy (WIF); the `@luismlorenzana` packages | `.github/workflows/`, `.npmrc` |

All values are in `docs/technical/infrastructure.md`. The budget alert is $5 a month.

## From uma-platform

| Package | Version | What uma-rpg takes from it |
|---|---|---|
| `@luismlorenzana/uma-data` | 1.0.0 | Master data types and the release client (web), test fixtures (domain) |
| `@luismlorenzana/uma-art` | 2.1.0 | Item, dish, gear (D86 and D103 rows), building, tile, world, battle-effect and UI atlases |
