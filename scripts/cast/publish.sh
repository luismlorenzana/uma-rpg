#!/usr/bin/env bash
# Uploads a private face pack (D50, D76) from content/release to the private content bucket: hash-named portraits
# first, then its cast.json, so a reader never sees a list that points at missing files. Never changes the gcloud
# account.
#
#   bash scripts/cast/publish.sh            # PriConne, at the bucket's root
#   bash scripts/cast/publish.sh azurlane   # or pad: under gs://uma-rpg-content/<pack>/
set -euo pipefail
cd "$(dirname "$0")/../.."
export CLOUDSDK_ACTIVE_CONFIG_NAME="${CLOUDSDK_ACTIVE_CONFIG_NAME:-default}" CLOUDSDK_CORE_PROJECT="${CLOUDSDK_CORE_PROJECT:-uma-rpg}"
BUCKET="${CONTENT_BUCKET:-uma-rpg-content}"
case "${1:-priconne}" in
  priconne) DIR="content/release" PREFIX="" TYPE="image/webp" ;;
  azurlane | pad) DIR="content/release/$1" PREFIX="$1/" TYPE="image/png" ;;
  *) echo "Unknown pack $1: priconne, azurlane or pad" >&2; exit 1 ;;
esac
test -f "$DIR/cast.json" || { echo "Run the pack's import first (scripts/cast/import*.mjs)" >&2; exit 1; }
gcloud storage rsync "$DIR/cast" "gs://${BUCKET}/${PREFIX}cast" --checksums-only \
  --cache-control="private, max-age=31536000, immutable" --content-type="$TYPE"
gcloud storage cp "$DIR/cast.json" "gs://${BUCKET}/${PREFIX}cast.json" --cache-control="private, no-cache" --content-type=application/json
echo "Published $(ls "$DIR/cast" | wc -l | tr -d ' ') portraits and ${PREFIX}cast.json to gs://${BUCKET}"
