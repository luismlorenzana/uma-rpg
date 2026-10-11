# T020 — S3 release and phone check

**Goal:** S3's exit check on the iPhone.

## Build

- The private cast is published (`bash scripts/cast/publish.sh` → `gs://uma-rpg-content`) and the runtime service
  account reads it; `CONTENT_BUCKET` is a repository variable and a Cloud Run env var (done 2026-10-10).
- Push → the pipeline deploys. It verifies health, the save and content guards (401 without a token) and the
  no-cache shell; check that the new build id shows in Account.
- The owner runs the [S3 exit check](../slices/S3-battles.md#exit-check) on the phone.

## Done when

The owner confirms the exit check; the pipeline is green.
