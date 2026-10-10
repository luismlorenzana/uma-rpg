# Architecture

How uma-rpg is built. Cross-game rules are in uma-platform `docs/architecture.md`; production is in
[infrastructure.md](infrastructure.md).

## Layout

| Path | What |
|---|---|
| `packages/domain` (`@rpg/domain`) | Pure rules and contracts: the save (`save/`), the place registry (`hub/`), the master data adapter (`master/`). Builds CommonJS + declarations for the API; Vite and Vitest read its TypeScript source |
| `apps/api` (`@rpg/api`) | NestJS on Cloud Run: auth guard, `/api/save`, `/api/master/*`, `/api/health` |
| `apps/web` (`@rpg/web`) | React 19 + Vite 7 + Tailwind 4 + Zustand + Dexie + React Router 7 + Phaser 4 (lazy) + PWA |
| `infra/github-actions/bootstrap.sh` | One-time GCP setup |

## Save and sync (D32, D45)

- One snapshot per account: `{ schemaVersion: 2, account, tierWorlds }`. Each tier world holds `wallet`, `umas` (owned
  outfits by id: unlock time, level, EXP) and exactly 20 `parties` of five slots, an Uma in at most one slot (D46).
  Strict parsers in `@rpg/domain` validate on both sides; a v1 save parses into v2 (device rows on boot, server rows on
  read). Rules (`save/rules.ts`: unlock, party slots, renames, Shards → Tickets) are pure and return a new save.
- The API refuses (409, with the stored envelope) a `PUT` whose save version is older than the stored one, so an old
  installed app can't overwrite newer data.
- The device holds one Dexie row `{ uid, revision, save, dirty }` and a Zustand store. Every change writes both and
  schedules a sync (1.5 s debounce, plus app foreground and coming online).
- A sync pass reads `GET /api/save`, then `reconcile` decides: **adopt** the server's save, **push** ours on top of the
  revision it was based on, or do nothing. `PUT` with a stale `baseRevision` gets **409** carrying the stored
  envelope; when both sides changed, the save with the newer `account.updatedAt` wins whole.
- Boot never waits on the network once a device save exists. A fresh device adopts the server's save, or shows first
  launch (trainer name; Tier 1 with 20 Unlock Tickets).

## Master data

- The API proxies uma-platform releases at `/api/master/{channels,manifests,files}/…`: the platform bucket in
  production, uma-platform's local `content/release` in dev. Hash-named files are `private, immutable`; pointers are
  `no-cache`.
- The web app uses `@luismlorenzana/uma-data`'s release client (hash-verified) for characters, outfits and scenarios at
  start, and the 2.5 MB skill set only when a profile needs it. `@rpg/domain`'s adapter makes `RosterOutfit` and
  `ChapterInfo` (five chapters per tier, ten levels each).
- Art needs the owner's token, so images are fetched with it and shown from session blob URLs; the service worker caches
  the bytes.

## The Hub (D30, D31, D33)

- Routes (D43): `/:page` is the Hub, `/:page?peek=:placeId` a place's quick look (the side panel), `/:page/:placeId/*` its
  full page. Nothing else is a route. Opening from the Hub pushes history; **Enter** replaces the quick look with the
  page, so back returns to the Hub. Signed-out and first-launch screens render at any URL, so a deep link survives
  sign-in.
- `apps/web/src/places/registry.tsx` maps each place to its lazy `Peek`, `Page` and header `Counter`; places without a
  page show the honest preview and no Enter.
- One place registry drives the map, the DOM place buttons, the menu and the routes.
- The map is a lazy Phaser 4 game (`hub/scene/`): world units are CSS px with the camera zoomed by the device pixel ratio
  (≤ 2). It draws ground, code-drawn markers and ambient motion; it has **no text and no input**. Names, slot pips and
  slice badges are DOM buttons over it. Opening an overlay pauses the scene (the last frame stays); a hidden page gets
  no animation frames.
- Dev only: `?canvas` forces Phaser's Canvas renderer, because the preview pane's screenshots can't capture WebGL, and
  `window.__hub` exposes the scene.

## Budgets

Main JS ≤ 180 KB gzip (146 KB at S1). Phaser, Firebase, master data parsing and each place overlay are lazy chunks.
