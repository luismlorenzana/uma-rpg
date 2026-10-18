# SE3 — uma-rpg on `uma-kit/content` and `uma-server/content`

**uma-rpg · Either · S · Needs: SE2 released · Part of sibling Phase E.**

## Why

Both games load master data and art the same way. SE2 shared the web runtime and the API's proxy. uma-rpg swaps its
own copies for them.

## Context (read first)

- uma-platform: `docs/sibling/phases.md` § Phase E; `packages/kit/README.md` § `/content`; and
  `packages/server/README.md` § `/content`.
- **This repo:**
  - web: `apps/web/src/master/master.ts` (the release client, the `MasterView` adapter) and `master/art.tsx`
    (`useArtUrl`, `imagePath`, `AtlasSprite`), plus every caller (grep `master/art`);
  - API: `apps/api/src/master/` and `apps/api/src/content/`, with their tests, and the env vars `MASTER_BUCKET`,
    `MASTER_DIR`, `CONTENT_BUCKET`, `CONTENT_DIR` (`docs/game/architecture.md` § API);
  - the service worker's runtime caching in `vite.config.ts`.

## Decisions made

- **Web:** `ContentProvider` from `uma-kit/content` in `main.tsx`.
  - `master.ts` keeps only uma-rpg's adapter: from the release to its `MasterView`.
  - `art.tsx` becomes re-exports, or goes, with callers importing from the kit.
- **API:**
  - `ReleaseProxyModule.forRoot({ route: 'master', bucket: MASTER_BUCKET, dir: MASTER_DIR })`;
  - `PrivatePackModule.forRoot({ route: 'content', bucket: CONTENT_BUCKET, dir: CONTENT_DIR, allow: <the enemy
    packs' allowlist> })`;
  - routes and env vars unchanged.
- **Unchanged:** the enemy packs' content and the PWA's caching rules.

## Do

1. Pin the versions; swap the web and API pieces; delete the replaced code and keep the tests that still apply.
2. Run the API's tests, plus local requests to `/api/master/...` and `/api/content/...`, including a non-allowlisted
   path (404).
3. **Docs:**
   - `docs/game/architecture.md` (Master data, Original art, API);
   - run `pnpm docs:update`;
   - log a D-decision.
4. **Check it** locally, in the game's dev server (a desktop browser at phone width; no iOS Simulator, P60):
   - the Stable's faces and icons;
   - a battle's enemy art;
   - art comes back after a restart while offline (Cache Storage).

## Done when

- [ ] `pnpm lint && pnpm test && pnpm build` pass; the main JS is under budget.
- [ ] `apps/api/src/master/` and `apps/api/src/content/` hold no proxy code of their own.
- [ ] The local check was done. The docs and D-decision are in. Deployed and green.

## Deliver

- Claude: commit to `main`, `refactor: master data and art through the shared content packages (SE3)`.
- ChatGPT: branch `sib/se3-rpg-content`, a pull request with the same title.
- **Flag it done:**
  - delete this file;
  - add a Done row here;
  - set SE3 to Done in uma-platform's queue.
