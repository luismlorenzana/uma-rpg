#!/usr/bin/env bash
# Uploads the enemy release (D135) from content/enemies-release to the private content bucket: the hash-named images
# first, then enemies.json, so a reader never sees a list that points at missing files. Never changes the gcloud
# account.
#
#   pnpm enemies:publish
set -euo pipefail
cd "$(dirname "$0")/../.."
export CLOUDSDK_ACTIVE_CONFIG_NAME="${CLOUDSDK_ACTIVE_CONFIG_NAME:-default}" CLOUDSDK_CORE_PROJECT="${CLOUDSDK_CORE_PROJECT:-uma-rpg}"
BUCKET="${CONTENT_BUCKET:-uma-rpg-content}"
DIR="content/enemies-release"
test -f "$DIR/enemies.json" || { echo "Build the release first: pnpm enemies:release" >&2; exit 1; }
gcloud storage rsync "$DIR/enemies" "gs://${BUCKET}/enemies" --checksums-only \
  --cache-control="private, max-age=31536000, immutable" --content-type="image/webp"
gcloud storage cp "$DIR/enemies.json" "gs://${BUCKET}/enemies.json" --cache-control="private, no-cache" --content-type=application/json
echo "Published $(ls "$DIR/enemies" | wc -l | tr -d ' ') images and enemies.json to gs://${BUCKET}"
