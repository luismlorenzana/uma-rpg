# T012 — Stable page

**Goal:** the roster as a full page, in the spirit of uma-racer's Stable (filters, sorts, views), plus unlocking.

## Build

- `apps/web/src/places/stable/`: `StablePeek` (owned / total, tickets, last three unlocked, Enter), `StablePage`
  (grid/list + controls), `OutfitProfile` (moved from S1, extended), and an `UnlockSheet` confirmation.
- **Query model** in `@rpg/domain` (`roster/query.ts`, pure and tested): ownership (`all | owned | locked`), search,
  facets (rarity 1–3; surface, distance and style "A or better" per key; sex; new in the last 24 h), sort (`release`,
  `name`, `rarity`, `statTotal`, `level`, each with a direction), returning entries with an `owned` view.
- Controls: a segmented ownership switch with counts, a search field, a **Filters** sheet (chips, a clear-all), a sort
  menu, and a grid/list toggle. Active filters show as removable chips under the bar. Preferences persist in
  `localStorage` (try/catch).
- Grid tiles: icon, name, `Lv 1` when owned; dim + lock when locked; "NEW" for 24 h. List rows: bust or icon, name,
  title, best aptitude line (`Turf A · Medium A · Pace A`), level or "Locked".
- Profile: an **Unlock** button with the cost and tickets left → a confirmation sheet → `unlock`. Owned: level, EXP,
  unlock date, party (link to `/town/party-hall/:n`). An "Aptitudes at work" note: best style → class, best distance →
  gear family, best surface → profession (design §4.1).

## Done when

Query tests (each facet, sorts, counts); a component test for the unlock flow (cost, confirm, tickets −1, owned); the
page at 390×844 and 375×667 with no horizontal scroll.
