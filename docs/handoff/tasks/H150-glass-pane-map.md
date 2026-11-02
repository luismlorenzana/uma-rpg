# H150 — The window's pane map: `outfit-glass-order` (uma-data 1.3.0)

**uma-platform · Claude · M · Needs: nothing · Unblocks: H155 (draws the reveal)**

> **Where this lives:** the work and its commit are in **uma-platform**; the packet sits in uma-rpg's `docs/handoff/tasks/`
> because uma-rpg asks for it, as H141 does.

## Why

Every Uma's stained-glass window lights pane by pane as she earns her board's steps, her face last
([collections.md](../../design/collections/collections.md) §4, D283). The bake already cuts each window into panes and
knows the frame, the glass behind her, her figure and her face sheet. This packet writes that knowledge down as one more
image a window, so the game never cuts glass: a grayscale map, each pixel its pane's place in the reveal order.

## Context (read first)

- uma-platform `CLAUDE.md`, `AGENTS.md`, `docs/new-umas.md` (the runbook), `docs/master-data.md`.
- **The design:** collections.md §4.2 (the order), §4.3 (how it's drawn). The [window page](../../design/collections/previews/window.html)
  plays the order on a made-up window.
- **The bake:** `scripts/assets/glass/glass.py`, `render()`. Before its last lines it holds:
  - `labels`: every pane's id; figure panes are `1 … offset`, the background's (sunburst wedges, border bars, corner
    squares) are `offset + 1 …`;
  - `face`: the face sheet's mask; `fig`: her figure's mask; `border`: the frame's mask; `lead`: the lead lines' mask;
  - `cx`, `cy`: the sunburst's centre (behind her head), at the working size `SIZE` (1024).
  `render()` returns the window and `{pieces, face_share}`. `bake.py` crops, renders, resizes to 512 with LANCZOS and
  writes WebP; it prints one JSON line a job.
- `scripts/assets/src/glass.ts`: `GLASS`, `glassRecipe` (hashes `glass.py`, `bake.py`, `requirements.txt`), `glassKey`,
  the cache `.cache/outfit-glass/<id>.<key16>.webp` + `.json`, `GlassResult`.
- `scripts/assets/src/import.ts` (families), `new-umas.ts` `artGaps` (required families), `uma.ts` `reviewSheet`.
- `packages/data/src/art.ts` `IMAGE_FAMILIES`, `packages/data/src/master.test.ts`; `.changeset/`.
- `scripts/data/src/publish-cli.ts`: `pnpm release:publish -- --dry-run | --channel candidate | --rollback <version>`.
- Versions: uma-data **1.2.0**; uma-platform's last decision is **P83** (P80 stays reserved for H141).

## Decisions made

1. **The family:** `outfit-glass-order`, keyed by outfit id like `outfit-glass`, 512 × 512, **lossless WebP**, the value in
   all three channels. About 8 KB a window (measured on one real window before lead was drawn in).
2. **The values:** `0` the lead (the bake's `lead` mask, the outer border's outline included); `255` the face: every pane
   more than half inside `face`; `1–250` every other pane by its rank `r` of `P` in the order:
   `value = ceil(250 × (r + 1) / P)`.
3. **The order, outside in** (CO4): group 0, the frame: background panes touching `border`, by the distance of the pane's
   centroid from (`cx`, `cy`), farthest first; group 1, the glass behind her: every other background pane, the same way;
   group 2, her figure: panes `1 … offset`, by centroid `y`, lowest on the window first. Ties by pane id. The face is
   never ranked.
4. **The size:** computed at `SIZE` and resized to 512 with `NEAREST`, so every pane keeps one value; the lead hides the
   seams the window's LANCZOS resize makes.
5. **The window doesn't change.** Only a second output is added. `glass.py` changes, so the recipe hash changes and every
   window rebakes, and the bake is deterministic, so **every `outfit-glass` file must come out byte for byte the same**.
   Prove it against the published release's hashes.
6. **Cached beside the window:** `<id>.<key16>.order.webp`. A window whose map is missing rebakes.
7. **Required:** `artGaps` lists a missing map as required, like a missing window.
8. **The game's rule, in one place for the review sheet:** a window with `lit` of `steps` steps draws a pixel as it is
   when its value is `0` or at most `250 × lit ÷ (steps − 1)`, the face (`255`) only at `lit = steps`; any other pixel as
   dark glass: each channel `(0.3 × c + 0.7 × y) × 0.16 + (9, 11, 18)`, with `y` the pixel's luma. Export it from
   `glass.ts` as `litWindow(window, order, lit, steps)` so H155's copy in the game can be checked against it.
9. **The review sheet** (`content/review/new-umas.png`) adds the window at 0, 15, 30 and 31 of 31 for each new outfit.
10. **uma-data 1.3.0,** a minor: one family more. Games on 1.2.0 drop it when they parse.

## Do

1. `glass.py`: compute the map in `render()` and return it beside the window; `bake.py`: write it next to the window
   (temporary file, then rename, as the window).
2. `glass.ts`: the cache file, the result, the family's files; `litWindow`; tests for the value rule, the order's three
   groups and the face, on a small synthetic label grid.
3. `IMAGE_FAMILIES`, `import.ts`, `artGaps`, the review sheet; their tests.
4. Docs: `docs/new-umas.md` (What a new outfit gets: the map, required, with the window), `docs/master-data.md`, the
   assets README. Log P84.
5. A changeset for uma-data 1.3.0.
6. Locally: `pnpm uma:import` (every window rebakes, about 3.5 minutes), `pnpm uma:report` (0 required missing), compare
   the `outfit-glass` hashes with the published release's (identical), look at the review sheet.
7. `pnpm release:publish -- --dry-run`, then `pnpm release:publish -- --channel candidate`. **Never move `latest`:** the
   owner runs `pnpm release:publish` (undo: `pnpm release:publish -- --rollback <the previous version>`). Give the owner
   both commands with the versions filled in.

## Done when

- [ ] uma-platform's checks pass (`pnpm lint && pnpm test && pnpm build`, or what `AGENTS.md` names).
- [ ] 272 maps (or every outfit the release has), none missing; their total size reported.
- [ ] Every `outfit-glass` file identical to the published release's.
- [ ] The review sheet looked at: the frame lights first, the face last.
- [ ] uma-data 1.3.0 published; the candidate release uploaded and verified; the owner has the two commands.
- [ ] Nothing derived from original art in git (`git status`); the images stay in `content/` and the private bucket (P6).

## Deliver

- **Claude:** commit to uma-platform `main`, "feat(assets): the window's pane map, outfit-glass-order (H150)", and the
  release commit the changeset makes.
- **Flag it done:** delete this file and add a Done row in uma-rpg's [README.md](../README.md) with both commits.
