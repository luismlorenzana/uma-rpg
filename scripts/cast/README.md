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

## Vote

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

Back up the whole `content/authoring/` folder for sources + all rounds. App Export covers only active votes.

For a worktree or test fixture:

```sh
CAST_CONTENT_DIR=/absolute/path/to/uma-rpg/content/release pnpm cast:review
```

`CAST_RATINGS_FILE` overrides the output file (legacy/fixture mode); `CAST_PROJECT_FILE` selects a private authoring
project; `CAST_REVIEW_PORT` overrides 5194. Bind is always 127.0.0.1.
