# H19 — Hub pages that scroll and zoom

**Priority P3 · ChatGPT · uma-rpg · M.**

## Why

The design calls for each Hub page to be "a Phaser scene you can scroll and zoom, built from original pixel tiles"
(`docs/design/game-design.md`, Hub). S1 shipped each page fitted to one screen, and the pixel terrain (D64) kept that.
As facilities grow, the places get cramped. A page a little larger than the screen, with pan and pinch zoom, gives
them room.

## Context

- **The Hub:**
  - `apps/web/src/hub/HubCanvas.tsx`, `HubScreen.tsx`;
  - `grid.ts` (`hubGrid`, `placeCell`, `placeAnchor`, `artScale`);
  - `scene/HubScene.ts`, `scene/terrain.ts`;
  - `PlaceTargets.tsx` (DOM buttons over the canvas, D33);
  - `swipe.ts` (page swipes).
- **Places' positions:** `at: { x, y }` as fractions of the page (`packages/domain/src/hub/`).
- **D33:** no text in the canvas; names and badges are DOM.

## Do

1. **Page size:** a page is the screen's width × 1.5 its height in tiles. Places keep their fractional `at` positions,
   so they spread out.
2. **Pan and zoom:**
   - Vertical pan by drag (and momentum).
   - Pinch zoom between 1× (fit width) and 2×, at whole-pixel art scales only: snap to the nearest when the pinch ends.
   - The camera moves; the DOM targets follow it through one transform.
   - Horizontal swipes still change pages at 1×. When zoomed in, they pan, and an edge swipe changes the page.
3. Each page **remembers** its scroll and zoom for the session.
4. **Reduced motion:** no momentum.

## Done when

- In the browser, at 390×844 and 375×667, on all four pages:
  - drag, pinch (use the device toolbar's touch emulation) and swipe all work;
  - every place is reachable and tappable at both zooms;
  - art stays crisp.
- `hub/swipe.test.ts` is extended for the zoomed swipe rule.
- `pnpm lint && pnpm test && pnpm build` pass.

## Deliver

A pull request on `feat/hub-pan-zoom`, titled `feat(hub): pages that scroll and zoom (H19)`, with a short recording.
