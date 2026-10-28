# Infrastructure

Production for uma-rpg. Adapted from uma-racer's setup (itself from uma-planner).

| Thing | Value |
|---|---|
| GCP project | `uma-rpg` (number 727687479415), billing account `0101E5-D99B49-A8B713`, $5 budget alert |
| Site | https://uma-rpg.web.app (Firebase Hosting, classic). `/api/**` is rewritten to Cloud Run, so the app is same-origin |
| API | Cloud Run `rpg-api`, `us-central1`, min 0 / max 1 instances, 512 MiB and 1 CPU, runtime service account `rpg-api-runtime@uma-rpg.iam.gserviceaccount.com` |
| Saves | Firestore (Native, `us-central1`), `saves/{uid}` = `{ revision, save, updatedAt }` |
| Master data | Read-only from `gs://uma-platform-master-data` (project `uma-platform-lm`); the runtime service account has `roles/storage.objectViewer` on that bucket |
| Private content | `gs://uma-rpg-content` (`us-central1`, uniform access, public access prevented): the enemy release (D135), `enemies.json` and `enemies/<unit>-<face\|art\|splash>.<hash>.webp`, about 105 MB. The runtime service account reads it; `pnpm enemies:publish` writes it with the owner's gcloud login |
| Images | Artifact Registry `us-central1-docker.pkg.dev/uma-rpg/rpg`, keeps the last 3 |
| Auth | Firebase Auth, Google sign-in; the API allows only `ALLOWED_EMAIL` |
| Push (D63) | Secret Manager `rpg-vapid` (VAPID keys, read by the runtime service account as `VAPID_KEYS`); Firestore `push/{uid}`; Cloud Scheduler `rpg-push-tick` (`us-central1`, every 5 minutes) POSTs `/api/push/tick` with an OIDC token for `rpg-push-scheduler@uma-rpg.iam.gserviceaccount.com`, audience the Cloud Run URL (repository variable `PUSH_AUDIENCE`). Set up by `infra/push/setup.sh` (2026-10-10). All in free tiers |
| Deploy | `.github/workflows/deploy.yml`, keyless Workload Identity Federation (`github-actions` pool, provider `uma-rpg`, main branch of `luismlorenzana/uma-rpg` only) |

## gcloud rule

**Local gcloud has two accounts, and the active one is the owner's work account. Never change it.** Scope every command
with environment variables:

```bash
CLOUDSDK_ACTIVE_CONFIG_NAME=default CLOUDSDK_CORE_PROJECT=uma-rpg gcloud run services describe rpg-api --region=us-central1
```

Never run `gcloud config set …`.

## One-time setup (done 2026-10-10)

1. `gcloud projects create uma-rpg`, link billing, add Firebase (REST `projects/uma-rpg:addFirebase`), register the web
   app; its public config is in `apps/web/.env.production`.
2. `CLOUDSDK_ACTIVE_CONFIG_NAME=default bash infra/github-actions/bootstrap.sh`: services, Firestore, Artifact Registry,
   service accounts and roles, the master bucket grant, WIF, the budget.
3. Repository variables: `GCP_PROJECT_ID`, `WIF_PROVIDER`, `ALLOWED_EMAIL`, `MASTER_BUCKET`, `CONTENT_BUCKET`
   (added 2026-10-10 with the bucket, S3), `DEPLOY_ENABLED`.
4. **Owner steps** (console only, done 2026-10-10):
   - Firebase console → Authentication → Get started → Sign-in method → **Google** → Enable.
   - GitHub → `uma-data` package (uma-platform) → Package settings → **Manage Actions access** → add `uma-rpg` with
     the **Read** role, so CI's `GITHUB_TOKEN` can install it.
   - Cloud console → APIs & Services → Credentials → "Web client (auto created by Google Service)"
     (`727687479415-3dvep7lngmifib6i8msr9lphkq9bu3nc`) → **Authorized redirect URIs** → add
     `https://uma-rpg.web.app/__/auth/handler` (keep the `firebaseapp.com` one), and `https://uma-rpg.web.app` under
     JavaScript origins. The app's `authDomain` is the Hosting domain so redirect sign-in stays same-origin inside the
     iOS Home Screen app; without this entry Google answers `redirect_uri_mismatch` (uma-racer's gcp-setup-guide step 7).

5. **Push** (2026-10-10): `CLOUDSDK_ACTIVE_CONFIG_NAME=default bash infra/push/setup.sh`, then the repository
   variable `PUSH_AUDIENCE` it prints. To rotate the VAPID keys, add a new secret version; every device must turn
   notifications off and on again.

## Release

Every push to `main` (outside `docs/` and Markdown files) runs lint, test and build; pull requests run only those.
On `main`, with `DEPLOY_ENABLED=true`, the workflow then builds the API image (the npm token passes as a BuildKit secret), deploys
Cloud Run, builds the web app and deploys Hosting. It verifies Cloud Run (`/api/health` answers; `/api/save`,
`/api/content/enemies.json` and `POST /api/push/tick` answer 401) and then Hosting (the shell served `no-cache`,
`/api/health` through the rewrite, `/api/save` 401).

The enemy release is published separately, by hand: `pnpm enemies:release && pnpm enemies:publish` (D135). The app
picks a new release up on its next load.

Watch a deploy: `gh run watch <id> -R luismlorenzana/uma-rpg --exit-status`.

The installed PWA shows **Update ready · Restart** for a new build. The Account shows the build id and the master data
release version.
