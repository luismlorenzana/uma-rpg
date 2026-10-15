# Completed portrait authoring: retention and recovery (D136)

The owner completed PriConne/Azur Lane ranking, tiers and every crop (D123, D128–D133). Claude locked NIKKE (D134)
and deployed all three franchises (D135). **The old portrait reviewer/crop app on port 5194, its launcher, installed
executors and legacy cast importers are retired.** Their code and synthetic previews remain in Git history.

## What stays local

All real images, names, records and receipts stay under the primary repo's **gitignored `content/`**, never a task
worktree or Git. `scripts/check-private-content.test.mjs` guards that boundary, including forced additions.

| Path under `content/` | Keep because |
|---|---|
| `authoring/exports/` | Canonical PNG packs, exact source/recipe/classification snapshots, hashes and completion markers; all versions stay |
| `authoring/exports/latest.json`, `latest-nikke.json` | Point to the two locked bundles used by `pnpm enemies:release` |
| `enemies-release/` | Current list and phone-sized WebPs used by local game/API and publishing |
| `authoring/rounds/`, `authoring/crops/`, archives and history JSON | Votes, final tiers, source-pixel rectangles, approvals, provenance and recovery history |
| `l2d/` metadata | NIKKE roster, votes, render/lock records and download provenance |
| `authoring/maintenance/` | Cleanup plans, SHA-256 records, move journals and completion receipts |

The release builder needs **only the locked bundles**, not old downloads or the retired app. Keep the lossless PNG
masters even though the game uses WebP, and keep the WebPs for local play. Copy retained content to your own backup
drive for off-machine safety; Git does not back it up. NIKKE's separate scripts remain available.

The final tier round uses schema 2 (1 Regular, 2 Key enemy, 3 Sub-boss, 4 Boss); schema 1 votes (-2…2) are archival,
not interchangeable. Frozen classification bytes and crop recipes retain stable unit IDs. History snapshots carry
a SHA-256 for their `data`. Never silently reset or overwrite a corrupt current record.

## Local cleanup

Use the **explicit primary content path**, while the retired reviewer is stopped:

```bash
pnpm enemies:cleanup /absolute/path/to/uma-rpg/content          # audit only
pnpm enemies:cleanup /absolute/path/to/uma-rpg/content --apply  # recoverable moves
```

The command verifies both locked bundles and every current WebP against hashes, completion markers and matching
release identities/tiers. Missing or changed required files stop it before any move. It then scans only
`authoring/`, `.cache/`, `release/`, `l2d/` and `sources/` for redundant image bytes, skipping **all**
`authoring/exports/`. It never scans `enemies-release/` for removal, follows symlinks, or removes metadata.

Source images, legacy packs, screenshots, raw model textures and unlocked renders move to a fresh
`~/.Trash/uma-rpg-retired-portraits-*` folder, along with exactly `Portrait Review.command`, `tools/cast-review/`
and `tools/cast-export/`. A fsynced journal records source/destination paths and image hashes; all kept assets are
verified again before writing `authoring/maintenance/latest-cleanup.json`. No permanent-delete or cloud operation.

Non-image model files and every authoring record remain. Re-authoring old datasets or re-rendering Spine models
requires recovering their raw images from Trash (or an owner-approved re-download); rebuilding the **current locked
release** does not. Empty source directories are intentionally left in place. Do not stop unrelated preview servers.

## Recovery

Do **not** empty Trash until satisfied with the retained release/masters. Each cleanup folder has `RECOVERY.json`;
the same plan and `moves.jsonl` live under `content/authoring/maintenance/<cleanup-id>/`. Move an image from
`files/<relative-path>` back under the original `content/`; `app/<relative-path>` holds installed tools/launcher.
Never overwrite a newer file. An interrupted run's intent/moved journal and actual Trash files identify what moved,
even without a completion marker. Retrieve the retired source code from Git before D136 if needed.

See [the active enemy pipeline](enemy-roster.md). No bucket or game/save change belongs to local retirement. H20's
old biome-specific face-picking packet is superseded by D135's full tiered roster.
