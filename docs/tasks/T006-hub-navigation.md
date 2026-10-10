# T006 — Place registry, Hub routes, account bar, page tabs, global menu

**Goal:** the Hub's skeleton: one registry of every place, URLs that name pages and places, and the chrome around the
map (account bar, page tabs, global menu, overlay host). T007 draws the map; T008 fills the overlays.

## Build

**Place registry (D33)** in `packages/domain/src/hub/places.ts`. One typed list is the single source for the map,
the hit targets, the menu and the routes:

```ts
type HubPage = 'farmlands' | 'wilds' | 'learning' | 'town'
type PlaceKind = 'farm-site' | 'gather-site' | 'station' | 'class-hall' | 'armory' | 'town'
interface Place {
  id: string            // 'orchard', 'mine', 'brawler-dojo', 'stable' …
  page: HubPage
  kind: PlaceKind
  name: string
  blurb: string         // one or two lines from the design
  slots: number         // Uma slot pips: 2 for sites and halls, 0 for most Town places
  opensIn: 'S1' | 'S2' | 'S3' | 'S4' | 'S5' | 'S6' | 'S7' | 'S8'
  at: { x: number; y: number }   // center on the page, 0–1 of the map area
  mirrorOf?: string     // Wilds site ↔ Farmlands site
}
```

- All 36 places from the S1 spec, with `opensIn` per the build plan.
- Layouts: Farmlands and Wilds share one coordinate set (`mirrorOf`). Every page fits 10 or fewer places on a
  portrait map with ≥ 44 pt between hit targets at 375×667.
- Tests: 36 unique ids; every page's places don't overlap at the smallest screen; mirrors are paired; every `opensIn`
  is valid.

**Routes** (React Router 7):

| URL | Shows |
|---|---|
| `/` | Redirect to the last page (device preference) or `/farmlands` |
| `/:page` | The Hub on that page |
| `/:page/:placeId` | The Hub with that place's overlay open. An unknown id → the page |
| `/:page/:placeId/*` | Sub-views inside a place (for example `/town/stable/outfit/100101`) |
| `/sign-in` | Signed out |

There are **no other top-level routes**: every future screen is a place sub-route (D31). The Account is a place too
(`/town/account`, hidden from the map, reachable from the account bar and the menu).

**Chrome:**

- **Account bar:** trainer name, tier chip, wallet (Unlock Tickets, Shards, Laurels) with simple inline SVG icons.
  Tap → `/town/account`.
- **Page tabs:** four tabs plus ☰. The active tab is underlined. Horizontal swipes on the map area (> 60 px, mostly
  horizontal) change page. Respect `prefers-reduced-motion`.
- **Global menu:** a bottom sheet listing every place grouped by page, each with its `opensIn` badge if not live,
  plus Account and Guide. Selecting one navigates to `/:page/:placeId`.
- **Overlay host:** a right-side panel, 88% wide on phones, with the Hub visible and dimmed behind. Close with ✕,
  swipe right, tap the dimmed Hub, or back. Focus is trapped inside while open. Overlay bodies are lazy chunks, chosen
  by place id (a map from id → lazy component, defaulting to the generic placeholder from T008).
- **Hit targets:** absolutely positioned buttons over the map at each place's `at`, labelled with the place name.
  They're what's tappable and accessible; the Phaser canvas underneath is visual only (T007). Each button shows its
  slot pips and its `opensIn` badge.

## Done when

- Tests: the registry rules above; route parsing (unknown page or place); swipe detection thresholds.
- At 390×844 and 375×667, every place on every page is visible and tappable without scrolling.
- Deep links (`/wilds/mine`) open the right page and overlay after reload. Back closes the overlay before leaving the
  page.
