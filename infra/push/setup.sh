#!/usr/bin/env bash
set -euo pipefail

# One-time push notification setup (D63). Run from the repo root with the owner's gcloud login, never changing the
# active configuration:
#
#   CLOUDSDK_ACTIVE_CONFIG_NAME=default bash infra/push/setup.sh
#
# Creates the VAPID key pair straight into Secret Manager (never printed or written to disk), a service account for
# Cloud Scheduler, and a job that POSTs /api/push/tick every five minutes with an OIDC token. Safe to re-run.
# Cost: inside the free tiers (one Scheduler job of the billing account's three free ones).

PROJECT_ID="${PROJECT_ID:-uma-rpg}"
REGION="us-central1"
SERVICE="rpg-api"
SECRET="rpg-vapid"
JOB="rpg-push-tick"
RUNTIME_SA="rpg-api-runtime@${PROJECT_ID}.iam.gserviceaccount.com"
SCHEDULER_SA_ID="rpg-push-scheduler"
SCHEDULER_SA="${SCHEDULER_SA_ID}@${PROJECT_ID}.iam.gserviceaccount.com"
export CLOUDSDK_CORE_PROJECT="${PROJECT_ID}"

gcloud services enable secretmanager.googleapis.com cloudscheduler.googleapis.com

if ! gcloud secrets describe "${SECRET}" >/dev/null 2>&1; then
  gcloud secrets create "${SECRET}" --replication-policy=automatic --labels=app=uma-rpg >/dev/null
  # {"publicKey","privateKey"}, piped into the secret; the API reads it as VAPID_KEYS.
  pnpm --silent --filter @rpg/api exec web-push generate-vapid-keys --json | gcloud secrets versions add "${SECRET}" --data-file=- >/dev/null
fi
gcloud secrets add-iam-policy-binding "${SECRET}" --member="serviceAccount:${RUNTIME_SA}" \
  --role="roles/secretmanager.secretAccessor" --condition=None >/dev/null

if ! gcloud iam service-accounts describe "${SCHEDULER_SA}" >/dev/null 2>&1; then
  gcloud iam service-accounts create "${SCHEDULER_SA_ID}" --display-name="Uma RPG push tick (Cloud Scheduler)"
fi

API_URL="$(gcloud run services describe "${SERVICE}" --region="${REGION}" --format='value(status.url)')"
ARGS=(--location="${REGION}" --schedule='*/5 * * * *' --time-zone=Etc/UTC --uri="${API_URL}/api/push/tick" --http-method=POST
  --oidc-service-account-email="${SCHEDULER_SA}" --oidc-token-audience="${API_URL}" --attempt-deadline=60s)
if gcloud scheduler jobs describe "${JOB}" --location="${REGION}" >/dev/null 2>&1; then
  gcloud scheduler jobs update http "${JOB}" "${ARGS[@]}" >/dev/null
else
  gcloud scheduler jobs create http "${JOB}" "${ARGS[@]}" >/dev/null
fi

echo "Push is set up. Repository variable for the deploy: PUSH_AUDIENCE=${API_URL}"
