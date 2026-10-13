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

**Owner update (D125):** reset the votes from scratch and inspect the latest local downloads now. `--fresh` creates
an empty round with no inherited votes or previous-vote hints, while archiving the preceding votes unchanged.
An explicit `--allow-missing-splashes` may activate a complete face roster before all splashes arrive; pending
members show their source face and a clear label. This is not a completed splash import. Defaults still refuse
incomplete activation and keep same-ID carryover; neither exception is automatic.

The active app reads original image bytes from that round's immutable dataset, not the small game-release art.
Pixel dimensions and **Original** let the owner inspect source resolution directly. Sources vary in quality:
the tool does not resize, recompress or invent resolution. Final vertical/face crops remain a later pass.

## Phase 1b: retained-unit role tiers (D126)

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
If waiting for missing JP splashes, the original first pass remains active at `content/cast-ratings.json`; its new
history snapshots still live inside `content/authoring/legacy-history/`. The newly imported dataset is not activated
automatically. Other franchises and AL Normal/Rare are hidden even in the original first-pass view.

Each successful vote first persists history snapshots, then atomically replaces the current file and fsyncs it and
its directory. The app acknowledges only after those writes succeed. Invalid/corrupt files cause an error, never a
silent reset. Recovery: stop the app, preserve the corrupt current file, validate a history snapshot's `sha256`
against `SHA256(JSON.stringify(data))`, then restore its `data` to `ratings.json`. Keep the same round/dataset IDs.
History from an interrupted write may be one revision ahead of the current file; review it before recovery.

## Phase 2: crop authoring, after ranking

Build a separate local crop pass over the ranked source originals. A regular enemy needs **vertical full-body +
small face**. An elite, sub-boss or final boss needs those plus a **wide splash** for attacks. Give each role an
output size and a movable crop rectangle with zoom; pre-authored rectangles can be reviewed before export.
Persist source SHA-256, pixel-coordinate crop rectangles, output dimensions and review state per role. Never
overwrite originals, ranking results or role tiers. Role tiers are candidate designations, not automatic in-game
assignments; the detailed game treatment of KeyEnemy remains a later owner-approved decision.

## Phase 3: final list and upload

Only after crop review, author the final enemy list and local output images. A later owner-approved task uploads
those authored images and separately reworks game enemies. No game/bucket writes belong to the current phase.
