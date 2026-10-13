# Local portrait reviewer

A small local browser app. It reads the portraits you already have and saves your votes separately.
**It does not change the game, cast manifests or images, and uploads nothing.** We author the game cast later from
your results.

## Open it

```sh
pnpm cast:review
```

Open http://127.0.0.1:5194. No login, added dependencies or new image downloads.

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

**Export** downloads `cast-ratings.json`; **Import** merges a valid ratings-only JSON file. Votes already autosave to
the gitignored `content/cast-ratings.json`, independently of the game save and imported packs. Original content and
screenshots stay private. Commit only synthetic previews.

For a worktree or test fixture:

```sh
CAST_CONTENT_DIR=/absolute/path/to/uma-rpg/content/release pnpm cast:review
```

`CAST_RATINGS_FILE` overrides the output file; `CAST_REVIEW_PORT` overrides 5194. Bind is always 127.0.0.1.
