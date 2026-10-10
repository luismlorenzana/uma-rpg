# T007 — Phaser Hub scene: four placeholder page maps

**Goal:** the map under the hit targets: one Phaser scene that draws the current page's ground and places from the
registry, with gentle ambient motion. This sets up the canvas architecture the Hub keeps for its art, Uma chibis and
effects later.

## Build

- Install Phaser 4 (exact current 4.x) in `apps/web` and load it **lazily** (dynamic import), never in the main chunk.
- **Host** `apps/web/src/hub/HubCanvas.tsx`, using uma-racer's scene pattern (`screens/puzzles/PuzzleBattleStage.tsx`
  + `scenes/puzzles/load.ts`):
  - Create the `Phaser.Game` into a `<div>` on mount and destroy it on unmount.
  - React passes `{ page, places, reducedMotion }`, and `setPage()` swaps pages without recreating the game.
  - Pause on `document.hidden` and while an overlay is open.
  - Resize with the container (`Scale.RESIZE`), at DPR up to 2.
- **Drawing** `apps/web/src/hub/scene/`, everything generated in code (placeholder art, no image files):
  - Ground: a tile grid in the page palette, with a little seeded variation. Farmlands are grass with crop rows,
    Wilds are rocky ground with a stream, the Learning District is stone paving, Town is warm cobbles with a plaza.
  - A **place marker** per place, drawn by kind: plot or field patch (farm site), rock, mine mouth or tree cluster
    (gather site), small house (station), tower or hall (class hall), shed with weapon rack (armory), building (Town).
    Drawn at the registry's `at`, scaled to the viewport.
  - Ambient: water shimmer, a slight crop sway, drifting clouds. Delta-time only; off with reduced motion.
- **No text in the canvas.** Names, pips and badges are the DOM hit targets from T006, so text stays crisp and
  accessible.
- A **page change** cross-fades the scene in about 200 ms (instant with reduced motion).
- A dev-only `window.__hub` (`{ page, setPage }`) for previews, as uma-racer exposes `__raceScene`.

## Done when

- The Hub's main chunk stays ≤ 180 KB gzip, with Phaser in its own chunk.
- All four pages draw with every place marker under its hit target at 390×844 and 375×667.
- 60 fps on the iPhone with ambient motion on (Safari Web Inspector timeline). The scene stops when the app is
  backgrounded.
- Leaving and re-entering the Hub doesn't leak (one canvas, steady memory in the timeline after ten page switches).
