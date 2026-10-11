# H16 — Split the domain out of the main JS chunk

**Priority P3 · ChatGPT · uma-rpg · S.**

## Why

The main chunk is about 194 KB gzip, against D56's 230 KB budget. It grows with every rule (D86 added the class
trees), and on a phone it's parsed at every cold start. D56 called splitting "a later optimization": the battle
engine, the skill trees and the world generator aren't needed to draw the Hub.

## Context

- **D56** in `docs/decisions.md`: the save parser validates fights, items and jobs at boot, so the domain ships in the
  main chunk.
- **Build:** `apps/web/vite.config.ts` and `apps/web/dist/assets/` after `pnpm --filter @rpg/web build`. Phaser is
  already its own chunk.
- **The heavy domain parts:**
  - `packages/domain/src/rpg/catalog.ts` (40 trees);
  - `rpg/battle/*`;
  - `world/world.ts` (the generator);
  - `items/catalog.ts`.

## Do

1. **Measure first.** Run `npx vite-bundle-visualizer` or `rollup-plugin-visualizer` in a throwaway config, and put the
   top ten modules of the main chunk with their gzip sizes in the pull request.
2. **Keep what boot needs** (the save parser, the Hub) in the main chunk. Move the rest behind dynamic imports at
   their screens, which are already lazy routes: fight engine, skill trees, world generator, forge recipes. Where the
   save parser needs a catalog only to validate ids, give it a light id list instead of the full catalog.
3. **Target:** the main chunk at or under 160 KB gzip, with no visible delay opening a screen on a phone (the PWA
   caches every chunk).
4. **A CI-visible size check:**
   - a small script `scripts/check-size.mjs` fails the build above 230 KB gzip and prints the size;
   - run it from `apps/web`'s `build` script;
   - leave `.github/workflows/` as it is: the build runs there already.

## Done when

- `pnpm lint && pnpm test && pnpm build` pass, and the size script prints the new main chunk size.
- Every screen opens in the browser, cold, with the network throttled to "Fast 4G".
- The pull request shows the before and after sizes.

## Deliver

A pull request on `perf/main-chunk`, titled `perf(web): split the domain out of the main chunk (H16)`.
