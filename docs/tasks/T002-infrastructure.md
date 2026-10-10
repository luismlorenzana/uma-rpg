# T002 — Cloud project, deploy pipeline and master data access

**Goal:** a push to `main` deploys the API to Cloud Run and the web app to Firebase Hosting, and the API can read
uma-platform's master data bucket.

Owner-approved (2026-10-10): create the project and link billing. **Never change the active gcloud account.** Scope every
command with `CLOUDSDK_ACTIVE_CONFIG_NAME=default CLOUDSDK_CORE_PROJECT=<id>`.

## Build

1. **Project.** Try `uma-rpg`. If the ID is taken, use `uma-rpg-lm` (matching `uma-platform-lm`). Name it "Uma RPG".
   Link billing account `0101E5-D99B49-A8B713`. It's the 5th of 5 default links, so uma-puzzle will need a slot freed
   later.
2. **Services:** Cloud Run, Artifact Registry, Firestore (Native mode, `us-central1`), IAM Credentials, Firebase.
   Add Firebase to the project, create the Hosting site, enable **Google** sign-in in Firebase Auth, and register a web
   app. Its config goes in `apps/web/.env.production` (public by design, as in uma-racer).
3. **Runtime service account** `rpg-api@…`: `roles/datastore.user` on the project, plus
   **`roles/storage.objectViewer` on `gs://uma-platform-master-data` only** (a command run in project
   `uma-platform-lm`, per uma-platform `infra/README.md`).
4. **Keyless deploy:** copy uma-racer's `infra/github-actions/bootstrap.sh` and `.github/workflows/deploy.yml`, and
   rename racer → rpg. Use Workload Identity Federation for `luismlorenzana/uma-rpg`, a deploy service account, and
   repo variables `GCP_PROJECT_ID`, `WIF_PROVIDER`, `ALLOWED_EMAIL`, `MASTER_BUCKET=uma-platform-master-data`,
   `DEPLOY_ENABLED`. The workflow runs lint/test/build, builds the API image, deploys Cloud Run `rpg-api`
   (`us-central1`, min instances 0) with env `ALLOWED_EMAIL`, `MASTER_BUCKET`, `AUTH_MODE=firebase`, then deploys
   Hosting with `/api/**` rewritten to `rpg-api`.
5. **`firebase.json`:** SPA fallback, the `/api/**` → Cloud Run rewrite, `no-cache` on `index.html` and `sw.js`, and
   immutable caching on hashed assets (copy uma-racer's).
6. **Runbook** `docs/technical/infrastructure.md`: every value above, how to deploy, how to verify, and the gcloud
   scoping rule. Add a short Production section to `CLAUDE.md`.

## Done when

- A push to `main` goes green and deploys both parts.
- `https://<site>/api/health` returns 200, and `GET /api/save` without a token returns 401.
- From Cloud Run, the API reads `channels/v1/latest.json` from the platform bucket (checked in T003's master route).
- `gcloud config list` still shows the owner's work account as active (unchanged).
