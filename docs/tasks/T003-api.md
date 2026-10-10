# T003 — API: auth guard, save and master data proxy

**Goal:** the API the web app needs in S1: who's signed in, one save document per account, and master data served
from the private bucket.

## Build

**Auth.** Copy uma-racer's `apps/api/src/auth/auth.guard.ts`: it verifies the Firebase ID token and allows only
`ALLOWED_EMAIL`. Keep `AUTH_MODE=disabled` for local dev (a fixed local uid). Every route except `/api/health` is
guarded.

**Save: one snapshot document per account (D32).**

| Route | Does |
|---|---|
| `GET /api/save` | `{ revision, save }` or `{ revision: 0, save: null }` |
| `PUT /api/save` | Body `{ baseRevision, save }`. Stores it as `revision = baseRevision + 1` if the stored revision equals `baseRevision`; otherwise **409** with the stored `{ revision, save }` |

- `save` is validated with explicit parsers (uma-racer's `save.types.ts` style): `schemaVersion: 1`, `account`
  (`trainerName` 1–24 chars, `createdAt`), `tierWorlds` (`"1"` → `{ createdAt, wallet: { unlockTickets, shards,
  laurels } }`, non-negative integers). Reject unknown top-level keys, so a future schema can't be half-written by an
  old client.
- Repository interface with two implementations, as in uma-racer: a **local JSON file** (`apps/api/.data/save.json`,
  gitignored) and **Firestore** (`saves/{uid}`, revision checked in a transaction).
- The parser and save types live in `packages/domain/src/save/`, so the web app and the API share one contract.

**Master data proxy.**

- `GET /api/master/*path`: reads `path` from the release source and streams it. Use uma-data's
  `ReleaseSource`/`createReleaseClient`.
  - Production: `@google-cloud/storage` on `MASTER_BUCKET`.
  - Local: the folder `../uma-platform/content/release` (env `MASTER_DIR`), so dev never needs cloud credentials.
- Caching: `files/**` → `Cache-Control: private, max-age=31536000, immutable`; `channels/**` and `manifests/**` →
  `private, no-cache`. Only `files/`, `manifests/` and `channels/` paths are allowed (no traversal).

**Health.** `GET /api/health → { ok, build }` (the build id comes from an env var set by deploy).

## Done when

- Unit tests: parser accepts and rejects; the revision conflict path; master path allow-list; cache headers.
- Local: `curl localhost:8081/api/master/channels/v1/latest.json` returns the platform's latest pointer, and a
  `PUT` then `GET` round-trips a save.
- Deployed (with T002): health 200; `/api/save` without a token returns 401; the master route works from the phone
  through Hosting.
