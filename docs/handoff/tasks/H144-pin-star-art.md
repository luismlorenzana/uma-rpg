# H144 — Pin uma-art 2.19.0: pixel crests and stat marks

**uma-rpg · Claude or ChatGPT · S · Needs: H141 (uma-art 2.19.0 published) · Unblocks: nothing**

## Why

The star chart and the stat marks shipped with vector stand-ins, so they didn't have to wait on the art (D277). H141 draws the real ones. This packet pins that
release and swaps the stand-ins, and it is the last step of [profile polish](../../design/profile-polish/proposal.md).

## Context (read first)

- `CLAUDE.md`, `AGENTS.md`.
- H141's release, and `apps/web/package.json:15`, the uma-art pin.
- `apps/web/src/places/observatory/star-marks.tsx`: every vector mark. Nothing outside it draws one.
- `apps/web/src/battle/pixel-icons.tsx`: `PixelIcon`, private today, and `pixel-icons.test.tsx` for how frames are guarded.

## Decisions made

1. **Only `star-marks.tsx` changes,** plus the pin and the test: `StarCrest` draws `star/<body>` and `StatMark` draws `stat/<stat>` through `PixelIcon`, which is exported.
   Their props stay, and `color` goes, since the art carries its own.
2. **Crests stay in `StarChart.tsx`'s HTML buttons at native size,** so they keep whole pixels.

## Do

1. Pin `@luismlorenzana/uma-art` 2.19.0: `NODE_AUTH_TOKEN=$(gh auth token) pnpm install`.
2. Swap `star-marks.tsx`; guard all thirteen frames in `pixel-icons.test.tsx`.
3. Check the chart, the totals and Details' tiles at 390×844 and 375×667, light and dark.
4. Log the D-row (fetch `main` first), and mark [the proposal](../../design/profile-polish/proposal.md) finished.

## Done when

- [ ] `pnpm lint && pnpm test:ci && pnpm build` pass. Say the main JS number, of 230 KB.
- [ ] The thirteen draw from the atlas, with no vector left.
- [ ] Nothing from the original games in git (`git status`).
- [ ] Deployed green (`gh run watch <id> -R luismlorenzana/uma-rpg --exit-status`) and https://uma-rpg.web.app/api/health shows the commit.

## Deliver

- **Claude:** commit to `main`, "feat(web): the star chart's pixel crests and stat marks (H144)".
- **ChatGPT:** a branch and a pull request with that title; merge it yourself when the checks and CI are green. Fetch `main` before you push so the D-number is free.
- **Flag it done:** delete this file and add a Done row in [README.md](../README.md) with the commit.
