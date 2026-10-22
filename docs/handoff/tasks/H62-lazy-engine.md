# H62 — The fight engine leaves the main bundle

**uma-rpg · Claude · M · Needs: nothing · Unblocks: H59 (room in the 230 KB budget)**

## Why

Main JS is **227.31 KB gzip on CI** (budget 230) after H56, and classes v2's screens (H59) and the switch (H61) still
have to fit. H56 found why it's so full: the fight engine, the Halls' Limit Break table and much of the catalog are in the
main chunk. The web already parses saves with `parseSaveAsync` (which imports the engine lazily), but the main chunk still
reaches the engine through other imports. Taking the engine out is worth far more than any trim, and it keeps room for
everything after classes v2 (the Tier 1 simplification, Tier 2).

## Context (read first)

- `CLAUDE.md`, `AGENTS.md`, D168–D181 in `docs/decisions.md`, and how H47 made the Rift lazy (`@rpg/domain/rift`, D173:
  a subpath the main bundle never loads; `packages/domain/package.json` `exports`).
- **The domain's entry points:** `packages/domain/src/index.ts` (re-exports `save/battle` and much more),
  `packages/domain/package.json` `exports` (`./battle` → `save/battle.ts`, `./work`, `./exchange`, `./rift` …, each with a
  CJS `require` for the API).
- **Who pulls the engine in today** (find every path; these are the known ones):
  - `save/save.ts` 30 imports `replayBattle` for the synchronous `parseSave` (1072); the browser uses `parseSaveAsync`
    (1078), which imports the engine lazily. The API uses `parseSave` through the CJS build: keep it.
  - `save/battle.ts` (`startFight`, `actInFight`, the sheet …), re-exported from the root index, which the web's store
    (`apps/web/src/save/`) calls for the world map's fights.
  - `apps/web/src/places/scenario-gate/FightScreen.tsx` 7 imports `replayBattle`, `autoAction` and other engine helpers.
  - `battle/labels.tsx`, the Halls page, the profile's skill lists and the Stable may read the catalog or the hero table.
- **Measure first:** build the web with a bundle view (`vite build` plus `rollup-plugin-visualizer` or
  `source-map-explorer` on the built `index-*.js` with sourcemaps, as a local, uncommitted tool) and list the main chunk's
  biggest domain modules before you change anything.

## Decisions made

- **The goal:** the engine (`rpg/battle/engine.ts`, `auto.ts`, `limit.ts`), the hero Limit Break table and the store's
  fight actions load on demand, like the Rift. The catalog's skill definitions follow if they can without hurting the
  screens that list skills; say what you moved and what stayed and why.
- **No player-visible change:** first paint and the Hub are unchanged; a fight never waits visibly for its chunk. Prefetch
  the fight chunk once the Hub has rendered (idle callback or `import()` after first paint), and keep the PWA's offline
  play: the service worker must precache the new chunks (check the PWA plugin's `globPatterns` cover them), so a fight
  starts offline after one online visit.
- **The API is unchanged:** it keeps the synchronous `parseSave` and the CJS build. Don't break any `require` path in
  `package.json` `exports`; add a subpath if you need one (e.g. `./engine`), with its CJS `require` like the others.
- **Store actions that need the engine become async where they aren't already**, loading the subpath on first use; keep
  their names and results so the screens change little. A fight action called before the chunk loads waits for it.
- **The budget guard:** if the build has a size check, keep it at 230; if it only prints, leave it.

## Do

1. Measure and list the main chunk's domain modules (step "Measure first").
2. Move the engine and its readers behind on-demand imports (domain subpath and web store), with prefetch.
3. Tests: every existing test passes; add a test that the web's main entry doesn't import the engine module (for example
   a Vite build manifest check in a script test, or a Vitest test that asserts the store's module graph through
   `import.meta.glob`/a static import scan, whichever fits the repo's tooling), so it doesn't creep back.
4. **Check it locally** (your own ports), at 390×844 in a desktop browser, never the iOS Simulator: a cold load (cleared
   site data) reaches the Hub; the world map's fight starts with no visible wait and plays on Auto to a result; the Rift
   page opens; the profile, Stable, Halls and Exchange screens work; then offline (DevTools → Network → Offline) after a
   reload, a fight still starts.
5. Docs: `docs/technical/architecture.md` (the bundle and its lazy chunks), `docs/game/architecture.md` if it names
   them. Log the D-decision (fetch `main` first; the next free number).

## Done when

- [ ] `pnpm lint && pnpm test && pnpm build` pass. Say the main JS number before and after, locally and on CI, and the new
  chunks' sizes.
- [ ] The guard test in step 3 exists and passes.
- [ ] The local check in step 4 was done and described, offline included.
- [ ] Docs in step, `pnpm docs:update` leaves no diff, the D-decision is logged.
- [ ] Deployed green and https://uma-rpg.web.app/api/health shows the commit.

## Deliver

- **Claude:** commit to `main` as `perf(web): the fight engine loads on demand (H62)`, push, watch the deploy.
- **Flag it done:** delete this file, set H62's State to Done in `docs/handoff/README.md` with a Done row, and note on
  H59's row that H62 landed.
