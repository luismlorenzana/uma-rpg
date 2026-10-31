# H142 — The star chart

**uma-rpg · Claude or ChatGPT · M · Needs: H141 (uma-art 2.19.0) · Unblocks: H143**

## Why

The owner on the Stars tab: "overall just pretty poor", with an "inexcusable" loop "not even well positioned". They're right, and the code says why: the big loop is three
arcs of one radius forced through three points at different distances from the Planet; the Planet's ring has radius 34 and its nodes 38; Prowess's label is 10 px off its nodes;
★ Longblade overflows its ring. And twenty-two identical circles say nothing about order, value or what's next.

This packet replaces the map with a real star chart. Same nodes, same rules, same sheet: only the drawing changes.

## Context (read first)

- `CLAUDE.md`, `AGENTS.md`.
- **The design:** [proposal.md](../../design/profile-polish/proposal.md) §0, §3 and PP16–PP25, PP31. **Build to the
  [star chart page](../../design/profile-polish/previews/star-chart.html):** tap its stars, flip its presets, and read its script, whose `BODIES` table and `body()` are this packet's
  drawing. Its "geometry, checked" tables are this packet's tests.
- **The profile v2 contract:** [uma-profile-v2/proposal.md](../../design/uma-profile-v2/proposal.md) §4.3 (Stars), §7.4 (states), §9 (B2, B3), §10.4 (how to measure).
- **The code on `main` at `c885053`:**
  - `apps/web/src/places/observatory/StarsPanel.tsx:103–126`, `StarMapV3`, the map this replaces, and `:47` where it's called;
  - `apps/web/src/places/observatory/layout-v3.ts` and `layout-v3.test.ts`;
  - `apps/web/src/places/observatory/stars-view.ts`: `mapNodeTitle`, `nodeReady`; `StarsPanel.test.tsx:64`, which taps `[data-map-node="guard:3"]`: keep that hook;
  - `apps/web/src/battle/pixel-icons.tsx:11–18`, `PixelIcon`, private today;
  - `packages/domain/src/economy/planet.ts`: `MAP_NODES`, `nodeBody`, `nodeNumeral`, `mapNodeGate`, `withHerMoon`;
  - `apps/web/package.json:15`, the uma-art pin, and `pixel-icons.test.tsx` for how frames are guarded.
- **The manual:** [sections.md:301](../../game/sections.md) (Stars tab); [phone-check.md](../../testing/phone-check.md) step 12.

## Decisions made

### The geometry, exact (a viewBox of 360 × 350)

The Planet at **(180, 208)**; the orbit a true circle of radius **132** around it; the moons on it at −90°, 150° and 30°. Star radius **13**, tap target radius **22**.

| Body | Centre | I | II | III | IV | V | Colour |
|---|---|---|---|---|---|---|---|
| Planet | 180, 208 | 180, 164 | 221.8, 194.4 | 205.9, 243.6 | 154.1, 243.6 | 138.2, 194.4 | `#ffd84d` |
| Prowess (spearhead) | 180, 76 | 180, 18 | 215, 64 | 205, 110 | 155, 110 | 145, 64 | `#ff9a6b` |
| Vigor (pentagon) | 65.7, 274 | 65.7, 230 | 107.5, 260.4 | 91.5, 309.6 | 39.8, 309.6 | 23.8, 260.4 | `#ff8fb6` |
| Guard (shield) | 294.3, 274 | 254.3, 240 | 334.3, 240 | 340.3, 286 | 294.3, 326 | 248.3, 286 | `#8fd3ff` |
| ★ Her moon (pair) | 304, 62 | 272, 62 | 336, 62 | | | | `#f0b8ff` |

The table is the one in the page's "geometry, checked". The Planet's and Vigor's are regular pentagons of radius 44 from −90°, clockwise; write them as offsets
from each centre, as the page does, so a body moves as one.

**Labels,** 12 units, bold, in the body's colour, the count in `#a8b6c6`: Planet at (180, 276), Prowess (86, 60), Vigor (66, 208), Guard (294, 216), all centred; ★ her moon at (352, 96),
**anchored to its end**, so any template name fits.

### The drawing

- **The sky:** `--color-stage` in both themes, a soft radial lift at the Planet, 64 fixed pale dots from a seeded list. Corners `rounded-md`.
- **The orbit:** three arcs of the true circle, cut 27° either side of each moon, 1 px, dotted, white at 13%.
- **The Planet's links** are arcs of its own ring; every other link is a straight line, stopped at the stars' edges.
- **Links:** lit between two open stars, 2.5 px in the body's colour; otherwise 1.25 px, dashed, white at 26%. The closing line, V to I, is a faint dotted line until the body is
  full, then lit. Her moon has one link and no closing line.
- **The four states** (PP21), each star a 13-radius disc with its roman numeral, 12 units, weight 800:

  | State | Rule | Disc | Ring | Numeral | Extra |
  |---|---|---|---|---|---|
  | **Open** | In `map.open` | Body colour | Body colour | `#101a24` | A soft glow, radius 17 |
  | **Ready** | Next on its body and `nodeReady` | `#16222e` | Body colour, 2 | `#f2f6fa` | A green dot at +10, −10, and a pulse |
  | **Next** | Next on its body, not ready | `#16222e` | Body colour, 1.5 | `#f2f6fa` | |
  | **Later** | Anything else | `#16222e` | `#5b6b7e`, 1.5 | `#93a3b5` | |

  Her moon's stars are never Ready: they open with the moons (D264).
- **The pulse:** a ring growing from radius 15 to 18 and fading, over 1.8 s, Ready only; none under `prefers-reduced-motion`. Animate `transform` and
  `opacity`, which every phone engine handles, rather than the page's `r`.
- **Hubs:** a Planet disc of radius 24, a moon's of 21, each a soft fill of the body's colour with a thin ring, brighter when the body is full. Her moon has no disc: her crest sits between her stars.
  Prowess's sits 2 units above its centre.

Build decisions (log them in the D-row):

1. **`star-chart.ts` replaces `layout-v3.ts`:** a pure table and the rules: `chartBodies()`, `nodeState(map, id, level, stock)` and `linkState`, with no DOM. `layout-v3.ts` and its test go.
2. **`StarChart.tsx`** is a new component beside `StarsPanel.tsx`, which drops `StarMapV3` and calls it. Props as `StarMapV3`'s, plus `onBody`.
3. **The chart is an SVG with an HTML layer over it** (PP25): stars, links, labels and the sky in the SVG; crests in `position: absolute` buttons, placed in percent of the chart, each `data-map-body`. Pixel art keeps whole
   pixels, since a viewBox scale of 0.95 would blur it. Their `aria-label` is "Guard, 3 of 5 open".
4. **A hub's tap target** opens `{body}:{next}`, or its last star when full.
5. **`PixelIcon` is exported** from `pixel-icons.tsx`, plus `StarCrest({ body })`. Add `StatMark` in H143, when it's used.
6. **Stars keep `role="button"`, `data-map-node`, the `aria-label`** of `mapNodeTitle` and their state, and a focus ring.
7. **Pin `@luismlorenzana/uma-art` 2.19.0** here, the first packet to use it. Install with `NODE_AUTH_TOKEN=$(gh auth token) pnpm install`.
8. **The colors are constants in `star-chart.ts`,** not tokens: the sky is the same in both themes, so they have only one value.

## Do

1. **Pin the art,** and guard the five crests in `pixel-icons.test.tsx`.
2. **`star-chart.ts`** and its tests, then **`StarChart.tsx`**; wire `StarsPanel.tsx`; delete `layout-v3.ts`.
3. **Tests,** `star-chart.test.ts`, the page's checks as code:
   - 22 nodes, each `MAP_NODES` id once;
   - any two stars at least **46.2 units apart**, so 44 pt targets stay separate at 375 wide (`343 / 360` scale);
   - every star at least 4 units inside the chart, tap targets allowed past it;
   - the Planet's stars on radius 44 and the moons on radius 132, each within 0.1;
   - no label's box over a star: use a character-width estimate of 0.62 × 12 units, the longest of `UMA_TYPE_NAMES`, and the widest count;
   - font sizes in the table at least 12, which is 11.4 px at 375;
   - `nodeState`: Open, Ready, Next (a level short; a jewel short), Later; her moon never Ready; `template:1` reads Open once all three moons' II are.
   - `StarsPanel.test.tsx` passes unchanged but for what H122's map drew; a component test: the star counts by state on a fixture, and a tap on a hub.
4. **Measure** at 390×844 and 375×667, on a new Uma, a mid one and a full one, with proposal §10.4's method: Stars ≤ 1.4 (B2; 1.16 today); no scroll in its sheets (B3); nothing under 11 px; every star's and hub's target at least 44 pt.
5. **Docs:** [sections.md:301](../../game/sections.md); [loops](../../game/loops.md#extra-stats) if it describes the drawing; [phone-check.md](../../testing/phone-check.md) step 12; a status line in
   [uma-profile-v2/proposal.md](../../design/uma-profile-v2/proposal.md) §4.3; `pnpm docs:update`.
6. **Check it locally** in light and dark at both sizes, on a scratch save with Umas at Lv 5, 20, 40 and a full map, and with a Spellfencer or a Lamplighter for the long label. Set a node from the chart and from the
   Observatory door. Check motion with reduced motion on. Then on a phone-sized viewport with the app's real art.
7. **Log the D-row** (fetch `main` first): "H142: the star chart", build decisions 1–8, and PP16–PP25, PP31 by reference.

## Done when

- [ ] `pnpm lint && pnpm test:ci && pnpm build` pass. Say the main JS number, of 230 KB, and this packet's change: the atlas JSON grows a little.
- [ ] The tests in step 3 pass, and moving one star 8 units fails them (try it, then undo it).
- [ ] B2 and B3 met at both sizes; targets and type measured. Numbers in the delivery.
- [ ] No curve on the map that isn't a true circle: the old loop, the Planet's offset ring and ★'s ring are gone.
- [ ] `pnpm docs:update` leaves no diff; the manual and the phone check describe the chart.
- [ ] The local check in step 6 was done and described. Nothing from the original games in git (`git status`).
- [ ] Deployed green (`gh run watch <id> -R luismlorenzana/uma-rpg --exit-status`) and https://uma-rpg.web.app/api/health shows the commit.

## Deliver

- **Claude:** commit to `main`, "feat(web): the Stars tab's star chart (H142)".
- **ChatGPT:** a branch `feat/h142-star-chart` and a pull request with that title, the measurements and a screenshot in its body. Merge it yourself when the checks and CI are green, and watch the deploy. Fetch `main` before
  you push so the D-number is free.
- **Flag it done:** delete this file, add a Done row in [README.md](../README.md) with the commit, and set H143 to Ready.
