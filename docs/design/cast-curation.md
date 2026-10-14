# Local portrait review (D123)

For the current two-franchise scope and multi-round source/ranking/crop workflow, see
[Private portrait authoring](portrait-authoring.md) (D124). This page describes the original first-pass tool.

An owner-only local browser app for reviewing the already-imported franchise portraits. It reads the existing private
packs and saves a separate ratings file. **No game integration, publishing, automatic enemy selection or pack edits.**
Cast authoring happens later, using the owner's results.

## Fast review

Start with the smallest available franchise by runtime unit count. Keep its Key/Regular counts visible as a reference
for reviewing larger franchises, without imposing a quota. Four explicit one-tap buttons, not double-click timing:

| Vote | Value | Intended later use |
|---|---|---|
| Double up | 2 | Key: bosses, sub-bosses and recurring key enemies |
| Up | 1 | Recurring regular enemies |
| Unreviewed | 0/absent | Not decided yet |
| Down | -1 | Rare filler |
| Double down | -2 | Do not use |

Voting saves and advances; keys 1–4 do the same. Previous/Skip, Undo, search, rating filters and a thumbnail grid let
the owner revisit choices. Preload the next portraits. Face/Full uses the existing icon or avatar box, with no import
or image transformation.

## Data and access

- Votes live only in gitignored `content/cast-ratings.json`, by franchise and stable member ID.
- Existing manifests and portrait files are read-only. Reimporting portraits does not erase the separate votes.
- Export/import ratings-only JSON for backup or simple bulk input; invalid values and unknown IDs are refused.
- Bind to loopback, validate Host/Origin and require a per-process write token. Serve only manifest-listed images.
- Provide a macOS double-click launcher in the existing private content folder. A tiny installed copy avoids keeping
  task worktrees around. No login item, service installation, cloud credentials or game-save access.
- Screenshots committed to git use only synthetic test portraits.
