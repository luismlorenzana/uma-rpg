# Local portrait reviewer

A small local browser app. It reads the portraits you already have and saves your votes separately.
**It does not change the game, cast manifests or images, and uploads nothing.** We author the game cast later from
your results.

## Open it

```sh
pnpm cast:review
```

Open http://127.0.0.1:5194. No login or added dependencies. The reviewer itself never downloads external images.

For a macOS double-click launcher:

```sh
pnpm cast:install
```

Double-click `content/Portrait Review.command` in Finder. It starts the reviewer and opens your browser; if already
running, it just opens it. Keep that Terminal window running. Bookmark the URL for quick access.
The small installed copy lives in `content/tools/cast-review/`, not another git checkout. No login item/background
service. Reinstall after pulling updates.

## Assign a tier

After the completed quality pass, the active catalogue contains only retained units. Rare and Excluded units are
absent from every count, filter, image endpoint and export; their originals and votes remain in earlier private
datasets/rounds, not the app. Existing +1 votes become Regular and +2 votes become KeyEnemy. Boss tiers start empty.

| Key/button | Tier |
|---|---|
| 1 | Regular |
| 2 | KeyEnemy |
| 3 | MiniBoss |
| 4 | FinalBoss |

Choose any tier to promote or demote the current unit. Assignments autosave and advance. **Show** filters by tier;
**All** starts with the full retained roster. Grid, search, Previous/Skip and Z/Undo still work. The current tier is
highlighted. No tier selects in-game enemies automatically.

Stop the reviewer before creating a survivor-only tier round from a **completed** ranking pass:

```sh
node scripts/cast/authoring-tiers.mjs /absolute/path/to/uma-rpg/content retained-YYYYMMDD tiers-YYYYMMDD
pnpm cast:install
```

This copies only surviving source images, verifying their original hashes, into a new immutable dataset. It archives
the old votes exactly, leaves all old datasets/rounds intact, and activates the new round only after validation.
Tier exports use schema 2 (`mode: "tiers"`, ratings 1–4); old ranking files use schema 1 and cannot be imported into a
tier round. Unknown/removed IDs and negative values are rejected. Back up `content/authoring/` as before.

## Crop review

After the owner declares tiers final, stop the reviewer, then prepare a calibration from **existing local sources only**:

```sh
node scripts/cast/crop-authoring.mjs /absolute/path/to/uma-rpg/content calibration-YYYYMMDD /absolute/path/to/private-seeds.json
pnpm cast:install
```

The optional seed file maps `franchise/id/vertical` or `franchise/id/splash` to source-pixel rectangles (`rect`) or
normalized center/coverage suggestions (`cx`, `cy`, `coverage`). Real IDs/coordinates belong in gitignored content.
The default selects ten units per franchise across four tiers. No downloads or image transformation occurs.

For a full manual pass over **every retained unit**, stop the reviewer and use a new session ID with `--full`:

```sh
node scripts/cast/crop-authoring.mjs /absolute/path/to/uma-rpg/content full-YYYYMMDD --full
pnpm cast:install
```

This carries the active crop session's saved rectangles, approvals and flags forward unchanged. The preceding
session and its history remain recoverable. New units start pending with centered suggestions; every format still
needs manual review. The owner chose this full pass directly rather than waiting for calibration feedback (D132).

Open **http://127.0.0.1:5194/crop**, or **Crops →** in the existing reviewer. Drag the rectangle, resize its corner,
use Zoom/Fit or X/Y/Width fields, then **Approve & Next**. Changing an approved crop makes it pending again;
**Needs adjustment** records framing feedback. Changes autosave with history; Undo is session-local. Both franchises
share 2:3 vertical and 16:9 splash frames; all non-Regular tiers need splash. Existing faces are reused.

The preceding classification is frozen exactly and becomes read-only. Crops save separately under
`content/authoring/crops/<session>/`. Export downloads recipes + approval state, not image files; output dimensions
are capped to native resolution. Back up the whole authoring folder. Final image files are generated only after the
whole crop-review pass is complete, not as each unit is approved. Do not seek new sources, change the game or upload.

## Legacy voting

Legacy/ranking rounds retain their original four-vote scale:

| Key/button | Vote | Intended later use |
|---|---|---|
| 1 · ↓↓ Exclude | -2 | Do not use |
| 2 · ↓ Rare | -1 | Rare filler |
| 3 · ↑ Regular | 1 | Recurring regular enemies |
| 4 · ↑↑ Key | 2 | Bosses, sub-bosses and recurring key enemies |

Voting autosaves and advances. Packs start smallest first; the first pack's Key/Regular counts remain a reference
for later franchises. Previous/Skip, Z/Undo, search, filters, Grid and Face/Full let you revisit anything. Position
resumes in the same browser; Undo covers this session's last 100 votes.

**Export** downloads the active round's ratings; **Import** merges a valid ratings-only JSON file from the same
round and dataset. Votes autosave to disk with complete history snapshots. Legacy installations without an active
project still use `content/cast-ratings.json`; their full six-franchise backups can be restored without making the
hidden franchises or Normal/Rare ships visible. Original content and screenshots stay private.

## Multi-round authoring

The [authoring guide](../../docs/design/portrait-authoring.md) documents all private data locations, backup/recovery,
source provenance, and the later crop/export passes. The current round contains only PriConne and Azur Lane;
other franchises remain preserved. Source shows the original art; Face shows the source list/shipyard icon.
These are not yet the final vertical/face/splash crops.

Prepare a **new** private dataset, then stop the reviewer before starting a new round:

```sh
node scripts/cast/authoring-import.mjs /absolute/path/to/uma-rpg/content jp-al-YYYYMMDD
node scripts/cast/authoring-round.mjs /absolute/path/to/uma-rpg/content jp-al-YYYYMMDD ranking-YYYYMMDD
pnpm cast:install
```

Import fetches the full JP list and each evaluation splash/face, with cached paced requests; Azur Lane reuses the
local original-image cache and excludes Normal/Rare. Rerun an incomplete import with the same ID to resume; a
completed dataset refuses overwrite. Import never activates a partial review, touches game release files or uploads.
New rounds archive prior votes and record immutable catalogue hashes. Same-ID votes carry forward; exact-name JP
base matches appear as Previous hints only. `content/authoring/project.json` selects the active round when reopening.
If a source refuses access, requests to that host stop. `--cached-pages` reconstructs cached splashes and fetches only
face URLs already supplied by the accessible list; it never requests uncached character pages. Missing splashes are
listed in `dataset.json`, with a full `roster.json` retained. Do not activate that incomplete dataset as a full import.
A dataset used by any round is locked against reimport. Another source collection uses a new dataset ID (the
shared cache is reused). The owner chose to retain the current round until every JP splash is available.

For an owner-requested fresh quality-review round (D129), stop the reviewer first, then:

```sh
node scripts/cast/authoring-round.mjs /absolute/path/to/uma-rpg/content jp-al-YYYYMMDD fresh-YYYYMMDD --fresh --allow-missing-splashes
pnpm cast:install
```

`--fresh` archives the preceding votes and starts both franchises unreviewed, with no old-vote hints.
`--allow-missing-splashes` is an explicit exception only when every roster face is available; the app marks missing
splashes and uses those faces. The import remains incomplete. Omit this option to retain the complete-source guard.
The reviewer serves the original local bytes; the dimensions and **Original** link help inspect their quality.

Back up the whole `content/authoring/` folder for sources + all rounds. App Export covers only active votes.

For a worktree or test fixture:

```sh
CAST_CONTENT_DIR=/absolute/path/to/uma-rpg/content/release pnpm cast:review
```

`CAST_RATINGS_FILE` overrides the output file (legacy/fixture mode); `CAST_PROJECT_FILE` selects a private authoring
project; `CAST_REVIEW_PORT` overrides 5194. Bind is always 127.0.0.1.
