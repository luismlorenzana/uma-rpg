# T010 — Place pages

**Goal:** tapping a place opens the quick-look panel; a live place's **Enter** opens its full page (D43).

## Build

- **Routes:** `/:page` is the Hub; `?peek=:placeId` on a Hub page opens the quick look (pushed, so back closes it);
  `/:page/:placeId/*` is the place's full page. Unknown ids fall back to the Hub page.
- **Quick look** (`OverlayHost`, unchanged look): each place can register a `Peek` component (live summary). The panel
  adds **Enter** for places open in the current slice.
- **Full page** (`PlacePage`): `h-dvh` column, header with ← (back to `/:page`, popping history when it came from the
  Hub), the place name, and a right-side slot for a counter (the Stable shows tickets). The body is the place's lazy
  `Page` component, which receives the splat (`rest`).
- The registry gains nothing new: which places have a `Peek` or `Page` lives in the web app's place map.
- The Account bar and menu open `/town/account` (a page). The menu opens quick looks for every place.
- Update `docs/technical/architecture.md` (routes) and log D43.

## Done when

- Tests: route parsing (`?peek=` on a page, unknown peek, full page with sub-route).
- Back: from a quick look returns to the Hub; from a full page entered via a quick look returns to the Hub (not the
  quick look).
