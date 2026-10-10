# T005 — Master data in the app: release client, roster adapter, art

**Goal:** the web app loads the latest master data release (schema major 1) through the API, caches it, and turns
it into uma-rpg's own roster and chapter shapes. This is the one adapter the architecture asks for (P8).

## Build

**Loading** (`apps/web/src/master/`):
- `createReleaseClient({ source: createFetchSource({ baseUrl: '/api/master/', init: authHeaders }) })`, loaded once
  per session, with its promise memoized.
- A version check against the cached manifest. Offline → use the cached release. No release and offline → show a
  clear "connect once to download game data" state in the Stable and Scenario Gate overlays (the Hub itself still
  works).
- A small `useMaster()` hook: `{ status, roster, chapters, art }`.

**Adapter** (`packages/domain/src/master/`), with pure functions tested against `@luismlorenzana/uma-data/testing`
fixtures:

| uma-rpg type | From | Fields |
|---|---|---|
| `RosterOutfit` | master outfits + characters + skills | `outfitId` (string of the master id), `characterId`, `name`, `outfitName`, `rarity`, `aptitudes` (surface, distance, style: grades A–G), `baseStats`, `growthRates`, `uniqueSkill` (name + description), `releaseOrder` |
| `ChapterInfo` | master scenarios | `scenarioId`, `name`, `order` (release order), `tier` (`ceil(order / 5)`), `levelBand` (`[(order − 1) % 5 × 10 + 1, … + 9]`), `crest` (art ref) |

- Unknown or missing ids never crash: skip them and log in dev.
- Read master fields through the names in uma-platform `docs/master-data.md`. Never hard-code GameTora shapes.

**Art:** resolve outfit icons, busts or portraits and scenario crests from the release's art index (uma-platform P24)
into `/api/master/files/…` URLs. Atlas sprites use a small `<AtlasSprite>` (copy uma-racer's `ui/AtlasSprite.tsx`,
adapting it to the art index).

## Done when

- Adapter tests on synthetic fixtures: field mapping, tier and level band math (order 1 → Tier 1, 1–10; order 7 →
  Tier 2, 11–20), unknown-id tolerance.
- Locally with the real release: 268 outfits and 14 scenarios (Tier 1 = URA Finale … Grand Masters), icons render.
- Offline after the first load: the Stable still lists every outfit with art.
