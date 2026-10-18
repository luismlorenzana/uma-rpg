# SB4 — uma-rpg on the kit album: the Stable, every picker, faces wherever an Uma is small

**uma-rpg · Either · L · Needs: SB3 released (SB1 for real faces; until then faces fall back to icons) · Part of
sibling Phase B (uma-platform `docs/handoff/README.md`).**

## Why

Phase B gives both games one Uma list and one picker (`uma-kit/album`, `uma-kit/roster`). uma-rpg moves its Stable and
six pickers onto them. It shows the outfit's face wherever an Uma is small (the owner, 2026-10-16), and gains saved
views and the New badge.

## Context (read first)

- uma-platform: `docs/sibling/phases.md` § Phase B, `docs/change-protocol.md`, and SB2's and SB3's READMEs in
  `packages/kit/README.md` (the `/roster` and `/album` sections).
- This repo's `CLAUDE.md`, `AGENTS.md`, `docs/game/sections.md` (Stable, Party Hall, Observatory, Exchange, the Halls),
  and D146 (the level rule).
- **The code to move:**
  - **the Stable:** `apps/web/src/places/stable/StablePage.tsx`, `FiltersSheet.tsx`, `stable-prefs.ts` (+ test),
    `StablePeek.tsx`;
  - **the domain query:** `packages/domain/src/roster/query.ts` (`runRosterQuery`, `byUmaLevel`, `RosterQuery`) and
    `query.test.ts`;
  - **the pickers** (six, plus the plaza's):
    1. the party slot: `places/party-hall/UmaPicker.tsx`, used by `PartyHallPage.tsx`;
    2. the facility job's "who" step: `places/work/FacilityPage.tsx`;
    3. the Observatory's Uma tabs: `places/observatory/ObservatoryPage.tsx`;
    4. the Halls' seat and Learner pickers: `places/halls/HallPage.tsx`;
    5. the Manuals' Uma: `places/exchange/ExchangePage.tsx`;
    6. the active party: `places/scenario-gate/ActiveParty.tsx`;
    7. and the plaza's "Feature another" grid: `hub/Featured.tsx`.
  - **Faces where an Uma is small:**
    - the Hub's pips: `hub/HubScreen.tsx` `pipsOf` sets `PipModel.face`;
    - facility rows (`FacilityPage.tsx`);
    - party rows (`PartyHallPage.tsx`, `PartyHallPeek.tsx`);
    - the Halls' seats (`HallPage.tsx`);
    - the Observatory's tabs.
  - **Art:** `apps/web/src/master/art.tsx` (`useArtUrl`, `imagePath`, `AtlasSprite`), and `master/master.ts` (the
    families in the art index: `outfit-icons`, `outfit-busts`, `outfit-chibis`, and `outfit-faces` after SB1).

## Decisions made

- **One album.**
  - The Stable runs on `AlbumChrome` and `AlbumGrid`: icons view of **faces at 5 columns** by default; cards (busts, 3
    columns); list (1 column).
  - The tabs are All, Owned and Locked. The counter in the header stays.
- **One picker:** every Uma choice above opens `UmaPicker`.
  - **Work pickers** (the facility job) use `workOrder`: free first, then Craft Level, highest first.
  - **Every other picker** uses `byLevel`.
  - An Uma that can't be picked shows why, through `disabled`: busy at work, already in this party, already seated,
    locked.
- **uma-rpg's album:**
  - **Facets:** rarity, aptitudes (surface, distance, strategy), sex, New, Free, class.
  - **Sorts:** level (the default), release, name, rarity, stat total, Craft Level, Class Rank.
  - **Badges:** a class mark (top left), working (top right), the target crosshair (bottom left).
- **Preferences:** the kit's (`useAlbumPrefs('stable', schema)`): saved views (up to 20), the seen set behind New, the
  last view and sort. `stable-prefs.ts` retires.
  - The old key is read once: its view and sort carry over, and the old key is then deleted.
- **Art:** `AlbumArtProvider` in `main.tsx`.
  - `useUrl` maps `face` to `outfit-faces` (or to the icon until SB1 lands), `bust` to `outfit-busts`, `chibi` to
    `outfit-chibis`, and `icon` to `outfit-icons`.
  - `Fallback` draws the `AtlasSprite` icon.
- **The plaza** keeps its chibis (D150), through `UmaChibi`.
- **Retired:** `roster/query.ts`'s query and `byUmaLevel`, moved to the kit; their tests already live in the kit
  (SB2). Keep in the domain only what's this game's: `statTotal`, aptitude labels.
- **Out of scope:** battle art (SB5); work screens (SC4).

## Do

1. **Pin the kit version** that has `/roster` and `/album`: `NODE_AUTH_TOKEN=$(gh auth token) pnpm --filter @rpg/web
   add -E @luismlorenzana/uma-kit@<version>`.
2. **Art:** add `AlbumArtProvider` in `main.tsx` beside `KitArtProvider`.
3. **The Stable:** rebuild `StablePage.tsx` on the kit, with a schema for the facets and sorts above. Keep its routes
   (`/town/stable`, `outfit/:id`). Port the old preference key once.
4. **The pickers:** replace each of the six pickers and the "Feature another" grid with `UmaPicker` (or `AlbumGrid`
   inside the plaza sheet), each with its context sort and `disabled` reasons. Delete
   `places/party-hall/UmaPicker.tsx`.
5. **Faces:** draw the faces where an Uma is small: pips, facility rows, party rows, Hall seats, Observatory tabs.
   Use `FaceTile` (`round` in pips and slots).
6. **Domain:** remove `runRosterQuery`, `byUmaLevel` and their test from `packages/domain/src/roster/`, and move any
   caller to the kit.
7. **Docs:**
   - `docs/game/sections.md`: the Stable's views, facets, sorts, saved views and New; each picker's order and reasons.
   - `docs/game/architecture.md`: the album comes from the kit.
   - Run `pnpm docs:update`.
   - Log a D-decision (fetch `main` first for the number).
8. **Check it** locally, in the game's dev server (a desktop browser at phone width; no iOS Simulator, P60):
   - the Stable at 5 columns;
   - search, filters, sorts, saved views, New;
   - each of the six pickers opens with the right order and reasons;
   - faces in pips, rows and seats.

## Done when

- [ ] `pnpm lint && pnpm test && pnpm build` pass, and the main JS stays under the 230 KB budget (the build prints it).
- [ ] No Uma list or picker in `apps/web/src` is hand-built. Grep for the old components: they're gone.
- [ ] The local check in step 8 was done and described.
- [ ] The docs and D-decision are in. Deployed: `gh run watch` is green and `/api/health` reports the commit.

## Deliver

- Claude: commit to `main`, `feat(web): one Uma album and picker on uma-kit (SB4)`.
- ChatGPT: branch `sib/sb4-rpg-album`, a pull request with the same title; merge after green CI.
- **Flag it done:**
  - delete this file;
  - add a Done row to `docs/handoff/README.md`;
  - set SB4's State in uma-platform's `docs/handoff/README.md` to Done with the commit.
