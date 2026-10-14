# Private portrait authoring

This is an owner-only, local workflow, separate from the game and its private bucket. Ranking does not select,
remove, publish or change any in-game enemy. The current review scope is **PriConne and Azur Lane only**. Earlier
franchises and their votes stay archived, not deleted.

## Phase 1: local sources and ranking

- PriConne: all character variants in the [JP character list](https://gamewith.jp/pricone-re/article/show/92923).
  Keep the Japanese name, stable article ID, list face icon and the evaluation splash from each character page.
- Azur Lane: use the owner's cached original full art and shipyard faces, not the reduced game portraits.
  Exclude Normal and Rare from this review. The wiki currently refuses automated access; do not bypass it.
- Store untouched original bytes and their SHA-256, dimensions and provenance. No automatic crops in this phase.
- Four votes: +2 Key, +1 Regular, -1 Rare filler, -2 Exclude. PriConne base-character votes are previous-pass hints,
  never silently assigned to costume variants. Same stable-ID ships/variants retain their previous votes.
- Start with the franchise having the smallest total roster. Revisit any earlier rating with Show → All.

The import is resumable and rate-limited. Incomplete sources cannot become an active round: the owner chose to keep
the current round until every JP splash is available. A completed dataset, or one already used by a round, is
immutable: use a new dataset ID for another source collection. Each new round has a separate ratings file.

**Owner update (D129):** reset the votes from scratch and inspect the latest local downloads now. `--fresh` creates
an empty round with no inherited votes or previous-vote hints, while archiving the preceding votes unchanged.
An explicit `--allow-missing-splashes` may activate a complete face roster before all splashes arrive; pending
members show their source face and a clear label. This is not a completed splash import. Defaults still refuse
incomplete activation and keep same-ID carryover; neither exception is automatic.

The active app reads original image bytes from that round's immutable dataset, not the small game-release art.
Pixel dimensions and **Original** let the owner inspect source resolution directly. Sources vary in quality:
the tool does not resize, recompress or invent resolution. Final vertical/face crops remain a later pass.

## Phase 1b: retained-unit role tiers (D130)

After the completed quality-ranking pass, create a new **survivor-only** dataset and tier round. Remove every -1
(Rare) and -2 (Excluded) unit from the active manifests, counts, grid, search, upcoming images, export and image
allowlist. Preserve the complete preceding dataset, round/history and exact vote archive outside the active app;
do not delete originals, alter the game release or upload anything. Stable IDs and original image bytes do not change.

Retained +1 units start **Regular** and +2 units **KeyEnemy**. Add **MiniBoss** and **FinalBoss**, initially empty;
the owner assigns them explicitly. Four buttons/keys (1–4), tier filters, Grid, Undo and autosave support another
pass and later revisits. All retained units are visible by default, with only the four tier totals in the app.

Tier ratings are schema 2 with `mode: "tiers"` and values 1–4. Schema 1 keeps its old -2…2 meaning for archival and
earlier ranking rounds; imports cannot cross scales or round/dataset identity. Every active unit must have a tier,
and unknown IDs are rejected. The migration refuses unfinished rankings, missing originals, bad hashes and existing
output folders. It changes the active project pointer only after copies, snapshots and catalogue validation succeed.
Stop the reviewer before migration. Old source/ranking data remains available for a separately requested recovery,
but cannot accidentally reappear through an active-round import. This is local role authoring, not game integration.

## Where the real data lives

All paths are relative to the primary repo's **gitignored `content/` folder**, never a disposable task worktree:

```text
content/authoring/
  project.json                         # active dataset and ranking round
  datasets/<dataset-id>/
    dataset.json                       # source provenance, counts, unresolved report
    cast.json                          # JP variants
    cast/*                             # original splash and face bytes
    azurlane/cast.json                  # eligible ships
    azurlane/cast/*                     # original full art and face bytes
  rounds/<round-id>/
    round.json                         # immutable roster hashes, previous-pass references, next phase
    ratings.json                       # current ranking votes or tiers; scale + identity + revision
    history/<revision>-<sha256>.json    # full before/after snapshots of votes, imports and Undo
  archive/                             # first-pass votes and frozen game-pack copy
  legacy-history/                      # snapshots while the original first pass stays active
  cache/gamewith/                      # resumable private source downloads
```

`content/cast-ratings.json`, the original game packs, and other franchises remain untouched. The initial first-pass
archive also includes a frozen copy of those original portraits. Real names/art/records and screenshots never go
in git; this guide and synthetic tests do. For off-machine safety, copy **all of `content/authoring/`** to your own
backup drive. Export in the app additionally saves the active round's votes, not the source images.
The private-content regression tests check that originals, votes, crops, exports and model renders remain ignored,
and fail if anything under `content/` is tracked, including a forced addition. Only synthetic previews belong in git.
If waiting for missing JP splashes, the original first pass remains active at `content/cast-ratings.json`; its new
history snapshots still live inside `content/authoring/legacy-history/`. The newly imported dataset is not activated
automatically. Other franchises and AL Normal/Rare are hidden even in the original first-pass view.

Each successful vote first persists history snapshots, then atomically replaces the current file and fsyncs it and
its directory. The app acknowledges only after those writes succeed. Invalid/corrupt files cause an error, never a
silent reset. Recovery: stop the app, preserve the corrupt current file, validate a history snapshot's `sha256`
against `SHA256(JSON.stringify(data))`, then restore its `data` to `ratings.json`. Keep the same round/dataset IDs.
History from an interrupted write may be one revision ahead of the current file; review it before recovery.

## Phase 2: crop authoring, after ranking

The owner declares the current classification final. Freeze an exact copy with its hash; the tier view remains
read-only, and API/CLI edits/imports are refused. Crops have separate records and history, never overwrite the
classification or originals, and reuse the existing face image for each stable ID.

**Full body means the vertical format**, not a promise that every limb is visible. Existing PriConne illustrations
and Azur Lane originals are the final source set: do not seek replacements, fetch more art or generate missing
parts. Keep backgrounds/transparency as supplied; this pass authors rectangles, not character extraction.

Both franchises use the **same 2:3 vertical ratio and 16:9 splash ratio**. Every unit needs vertical + existing face;
**KeyEnemy, MiniBoss and FinalBoss also need splash**. Source-pixel rectangles stay inside the source image and
preserve aspect ratio. Suggested export limits are 640×960 / 1280×720, clamped down to native crop resolution;
the current Export saves recipes/approval state, not finished image files. Preview zoom is not export upscaling.

### Reviewing crops (D131, D132)

`/crop` in the existing local reviewer holds the crop queue. Calibration remains available as an optional ten-unit
sample per franchise, but the owner now chose to go directly through **every retained unit** (D132). The full-roster
initializer includes all units and preserves the active session's exact saved rectangles, statuses and timestamps;
the preceding manifest, crops and history stay intact. Its provenance records the prior session, revision and hash.
Unreviewed additions receive centered suggestions, not approvals. Drag to pan, drag the lower-right corner to resize, use Zoom/Fit or
source-pixel fields; the source and cropped preview are shown together. Approve & Next saves each format separately;
Needs adjustment flags framing feedback without excluding the unit or changing its tier. Editing an approved crop
returns it to review. Filters, Previous/Skip, session Undo and round-specific position help revisit work.

Review every required format manually. Save rectangles and approvals as the owner works, but generate final image
files **only after the entire full-roster pass is complete**. Neither approval nor completion automatically renders,
imports or uploads images. Existing faces are reused. Private records live in `content/authoring/crops/<session>/`:

- `manifest.json`: immutable selected IDs, final tiers, source/face references and hashes, policy and baseline identity.
- `crops.json`: current source-pixel rectangles, output dimensions, per-format pending/approved/flagged state and revision.
- `history/<revision>-<sha256>.json`: complete fsynced before/after records, including Undo and approvals.

The tier round holds `classification-final-ratings.json` (exact original bytes), its hash marker in
`classification-final.json`, and `crop-session.json` (active session and catalogue hash). Source/classification
changes, corrupt/missing crop records, bad geometry and stale-tab revisions fail rather than reset data. Restore
only a verified crop history snapshot while the reviewer is stopped, preserving the session and frozen classification.

Stop the reviewer before creating a full-roster session; activate it only after source and carryover validation.
Old tabs cannot save to a different session, even when revisions happen to match. A full-roster manifest must cover
the entire retained catalogue, and has one vertical crop per unit plus splash for every non-Regular tier.

Game enemy behavior, final file export/import and bucket upload remain later owner-approved work.

## Phase 2b: execute approved crops locally (D133)

After every full-roster format is approved, execute the saved rectangles now; no game rework or upload is needed.
The Node canvas executor uses the same nine-argument `drawImage` operation as the preview, preserving fractional
source coordinates rather than rounding the framing. It outputs lossless PNG with transparency/backgrounds intact,
at the existing native-resolution 640×960 / 1280×720 caps. No upscaling, extraction, AI-generated artwork or new sources.
Face images are copied byte-for-byte, in their original format.

Versioned bundles live under **`content/authoring/exports/<session>-r<revision>-<fingerprint>/`**:

```text
export.json                       # pinned encoder/algorithm, input fingerprints, start time
snapshots/manifest.json           # exact source catalogue bytes
snapshots/crops.json              # exact owner-approved recipe bytes
snapshots/classification.json     # exact frozen classification bytes
priconne/<stable-id>/vertical.<hash16>.png, face.<hash16>.<ext>, splash.<hash16>.png
azurlane/<stable-id>/...           # same roles/ratios; Regular has no splash
manifest.json                     # unit IDs/tiers, every output path/hash/dimension, source/recipe provenance
complete.json                     # final manifest checksum; written only after the whole batch
```

The export hashes every original/face before writing, refuses pending/flagged formats, validates every finished
asset and recipe, and fsyncs snapshots/output files. `exports/latest.json` points to the verified completed bundle.
An interrupted run keeps its partial files and can resume from the same frozen inputs; it is not a usable completed
bundle. A completed rerun verifies and reuses output, refusing corrupt files instead of resetting them. Later crop
edits create a sibling export; earlier bundles, source images, live recipes and approval history remain unchanged.

`scripts/cast/install-export.mjs` persists the seven executor modules and a pinned development-tool dependency
inside `content/tools/cast-export/`; install its dependencies once before running it independently of a worktree.
Copy all of `content/authoring/` to a separate backup drive for off-machine safety. These local PNGs are archival
authoring outputs, not a game release: web encoding/packing and enemy rules still wait for the later integration.

## Phase 3: final list and upload

Only after crop review, author the final enemy list and local output images. A later owner-approved task uploads
those authored images and separately reworks game enemies. No game/bucket writes belong to the current phase.
