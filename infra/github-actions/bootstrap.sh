#!/usr/bin/env bash
set -euo pipefail

# One-time GCP setup for uma-rpg, adapted from uma-racer's bootstrap (which came from uma-planner's).
# Needs the owner's gcloud credentials; run it with the owner's personal configuration and never change the active one:
#
#   CLOUDSDK_ACTIVE_CONFIG_NAME=default bash infra/github-actions/bootstrap.sh
#
# Creates no long-lived keys and needs no GitHub secrets. Safe to re-run.

PROJECT_ID="${PROJECT_ID:-uma-rpg}"
REGION="us-central1"
REPOSITORY="luismlorenzana/uma-rpg"
AR_REPO="rpg"
MASTER_BUCKET="${MASTER_BUCKET:-uma-platform-master-data}"
MASTER_PROJECT="${MASTER_PROJECT:-uma-platform-lm}"
POOL_ID="github-actions"
PROVIDER_ID="uma-rpg"
DEPLOY_SA_ID="github-deployer"
RUNTIME_SA_ID="rpg-api-runtime"
DEPLOY_SA="${DEPLOY_SA_ID}@${PROJECT_ID}.iam.gserviceaccount.com"
RUNTIME_SA="${RUNTIME_SA_ID}@${PROJECT_ID}.iam.gserviceaccount.com"

# Scope every gcloud call to this project without rewriting the caller's saved gcloud configuration.
export CLOUDSDK_CORE_PROJECT="${PROJECT_ID}"
PROJECT_NUMBER="$(gcloud projects describe "${PROJECT_ID}" --format='value(projectNumber)')"
POOL_NAME="projects/${PROJECT_NUMBER}/locations/global/workloadIdentityPools/${POOL_ID}"
PROVIDER_NAME="${POOL_NAME}/providers/${PROVIDER_ID}"

gcloud services enable \
  artifactregistry.googleapis.com \
  billingbudgets.googleapis.com \
  cloudresourcemanager.googleapis.com \
  firebase.googleapis.com \
  firebasehosting.googleapis.com \
  firestore.googleapis.com \
  iam.googleapis.com \
  iamcredentials.googleapis.com \
  identitytoolkit.googleapis.com \
  run.googleapis.com \
  storage.googleapis.com \
  sts.googleapis.com

# --- Firestore (saves) -------------------------------------------------------------------------------------------
if ! gcloud firestore databases describe --database='(default)' >/dev/null 2>&1; then
  gcloud firestore databases create --location="${REGION}" --type=firestore-native
fi

# --- Artifact Registry with a cleanup policy (stay inside the 0.5 GB free tier) ------------------------------------
if ! gcloud artifacts repositories describe "${AR_REPO}" --location="${REGION}" >/dev/null 2>&1; then
  gcloud artifacts repositories create "${AR_REPO}" --location="${REGION}" --repository-format=docker \
    --description="Uma RPG API images"
fi
POLICY_FILE="$(mktemp)"
cat > "${POLICY_FILE}" <<'JSON'
[
  { "name": "keep-last-3", "action": { "type": "Keep" }, "mostRecentVersions": { "keepCount": 3 } },
  { "name": "delete-older", "action": { "type": "Delete" }, "condition": { "olderThan": "86400s" } }
]
JSON
gcloud artifacts repositories set-cleanup-policies "${AR_REPO}" --location="${REGION}" --policy="${POLICY_FILE}" --no-dry-run

# --- Service accounts --------------------------------------------------------------------------------------------
for sa in "${DEPLOY_SA_ID}:GitHub Actions production deployer" "${RUNTIME_SA_ID}:Uma RPG API runtime"; do
  id="${sa%%:*}"
  name="${sa#*:}"
  if ! gcloud iam service-accounts describe "${id}@${PROJECT_ID}.iam.gserviceaccount.com" >/dev/null 2>&1; then
    gcloud iam service-accounts create "${id}" --display-name="${name}"
  fi
done

# Runtime: Firestore read/write in this project + read-only on the platform's master data bucket. Nothing else.
gcloud projects add-iam-policy-binding "${PROJECT_ID}" --member="serviceAccount:${RUNTIME_SA}" \
  --role="roles/datastore.user" --condition=None >/dev/null
CLOUDSDK_CORE_PROJECT="${MASTER_PROJECT}" gcloud storage buckets add-iam-policy-binding "gs://${MASTER_BUCKET}" \
  --member="serviceAccount:${RUNTIME_SA}" --role="roles/storage.objectViewer" >/dev/null

# Deployer: same roles as uma-racer's deployer.
for role in \
  roles/artifactregistry.writer \
  roles/firebasehosting.admin \
  roles/run.admin \
  roles/serviceusage.apiKeysViewer \
  roles/serviceusage.serviceUsageConsumer
do
  gcloud projects add-iam-policy-binding "${PROJECT_ID}" --member="serviceAccount:${DEPLOY_SA}" --role="${role}" \
    --condition=None >/dev/null
done
gcloud iam service-accounts add-iam-policy-binding "${RUNTIME_SA}" --member="serviceAccount:${DEPLOY_SA}" \
  --role="roles/iam.serviceAccountUser" >/dev/null

# --- Workload Identity Federation restricted to this repo's main branch -------------------------------------------
if ! gcloud iam workload-identity-pools describe "${POOL_ID}" --location=global >/dev/null 2>&1; then
  gcloud iam workload-identity-pools create "${POOL_ID}" --location=global --display-name="GitHub Actions"
fi
PROVIDER_FLAGS=(
  --location=global
  --workload-identity-pool="${POOL_ID}"
  --display-name="uma-rpg main branch"
  --issuer-uri="https://token.actions.githubusercontent.com"
  --attribute-mapping="google.subject=assertion.sub,attribute.repository=assertion.repository,attribute.ref=assertion.ref"
  --attribute-condition="assertion.repository == '${REPOSITORY}' && assertion.ref == 'refs/heads/main'"
)
if gcloud iam workload-identity-pools providers describe "${PROVIDER_ID}" --location=global --workload-identity-pool="${POOL_ID}" >/dev/null 2>&1; then
  gcloud iam workload-identity-pools providers update-oidc "${PROVIDER_ID}" "${PROVIDER_FLAGS[@]}"
else
  gcloud iam workload-identity-pools providers create-oidc "${PROVIDER_ID}" "${PROVIDER_FLAGS[@]}"
fi
gcloud iam service-accounts add-iam-policy-binding "${DEPLOY_SA}" --role="roles/iam.workloadIdentityUser" \
  --member="principalSet://iam.googleapis.com/${POOL_NAME}/attribute.repository/${REPOSITORY}" >/dev/null

# --- Budget alert: $5 budget, emails at $1 and $5 ------------------------------------------------------------------
BILLING_ACCOUNT="$(gcloud billing projects describe "${PROJECT_ID}" --format='value(billingAccountName)' | sed 's#billingAccounts/##')"
if [[ -n "${BILLING_ACCOUNT}" ]]; then
  if gcloud billing budgets list --billing-account="${BILLING_ACCOUNT}" --format='value(displayName)' 2>/dev/null | grep -qx "${PROJECT_ID}"; then
    echo "Budget ${PROJECT_ID} already exists."
  else
    gcloud billing budgets create --billing-account="${BILLING_ACCOUNT}" --display-name="${PROJECT_ID}" \
      --budget-amount=5USD --threshold-rule=percent=0.2 --threshold-rule=percent=1.0 \
      --filter-projects="projects/${PROJECT_ID}" \
      || echo "Could not create the budget (needs Billing Account Administrator). Create it in the console instead."
  fi
fi

echo
echo "GCP_PROJECT_ID = ${PROJECT_ID}"
echo "PROJECT_NUMBER = ${PROJECT_NUMBER}"
echo "WIF_PROVIDER   = ${PROVIDER_NAME}"
echo "MASTER_BUCKET  = ${MASTER_BUCKET}"
