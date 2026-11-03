# H165 — The honeycomb screen: the continent map as SVG hexes, dark

**uma-rpg · ChatGPT or Claude · L · Needs: H161 (capital run screens), H163, H164 · Unblocks: H166**

## Why

The owner found the continent map so poorly drawn that the List gets used instead (D295,
[the design](../../design/world-map/honeycomb.md)). This packet draws the continent map as an SVG honeycomb:
- the capital at the centre, ringed by its six run seats;
- the 48 regions, Lv 6–10 inside and Lv 1–5 on the shore;
- the six Springs;
- every hex showing what it is, its progress, and the five who claimed or cleared it;
- a tap opening its quick look.

It's built **dark**: the continent screen shows it only when `honeycombLive()`. Until H166 the pixel map stays.

## Context (read first)

- `CLAUDE.md`, `AGENTS.md` (the copy rules), [the manual](../../game/README.md):
  - [maps](../../game/maps.md);
  - [sections](../../game/sections.md) (the Scenario Gate).
- **The design:** [honeycomb.md](../../design/world-map/honeycomb.md), all of it.
- **The preview is the look to build:** [previews/honeycomb.html](../../design/world-map/previews/honeycomb.html).
  Open it with `.claude/launch.json`'s `design-docs` server at http://localhost:8771/world-map/previews/honeycomb.html.
  Its script holds:
  - the hex shapes (`hexPts`);
  - the glyphs (`GLYPH`, `SHAPES`);
  - the faces (`faces()`: small while claimed, large in gold rings once completed);
  - the seats;
  - the capital and Spring hexes;
  - the progress arc (a dashed hex);
  - the side panel's contents.

  Its data is made up. This packet reads the save.
- **The layout and the reads:**
  - H163's `continentHoneycomb(continent)`, `honeycombXY` and `nearestSpring`;
  - H164's `honeycombState(world, continent)` and `regionTeamsOf`;
  - H160's `capitals[c].recent` (six won runs, newest first) and `capitalRuns` (the open ones).
- **Today's continent screen:** `apps/web/src/places/scenario-gate/ScenarioGatePage.tsx`, `ContinentMap`:
  - the map draws through `MapCanvas` with `continentLayout` (`map/layout.ts`);
  - its `onSpot` handles a tap: a region opens `r/<id>`, the capital opens `capital/<id>`, a Spring calls
    `drinkAtSpring`;
  - `MapViewSwitch` / `useMapView` give Map / List;
  - the List groups regions by row and puts a Spring on its row.
- **A region's header Spring:** `RegionMap.tsx` reads `springForRegion` (`map/layout.ts`), the Spring of its two-row band.
- **Faces:** the kit's album art.
  - `FaceTile` (`@luismlorenzana/uma-kit/album`) draws a face in HTML.
  - Inside SVG, read the same image with `useAlbumArt().useUrl('face', outfitId)`. Draw it as an `<image>` clipped to a
    circle, with a plain circle when there's no art.
  - `PartyPortrait` in `PartyHallPage.tsx` is the HTML pattern.
- **The quick look:** `ui/BottomSheet.tsx` (the kit's `Sheet`, a side panel on a wide screen). `WindowSheet.tsx` in the
  Gallery is a recent example.
- **Parties:** `PartyHallPage.tsx`, `PartyHallPeek.tsx` and `PartyCounter.tsx` read `PARTY_COUNT`, which is 24 when live
  (H164).

## Decisions made

1. **The switch:** `ContinentMap` draws `<HoneycombMap>` (new, `places/scenario-gate/map/HoneycombMap.tsx`) when
   `honeycombLive()`, and today's `MapCanvas` otherwise. The world view and a region's map stay `MapCanvas` (HM10).
2. **SVG, one button a hex** (61 in all: the capital, six seats, six Springs, 48 regions).
   - Each hex is a `<g role="button" tabindex="0">` with an `aria-label`, and answers Enter and Space.
   - Colours come from the kit's tokens in light and dark. The biome colour is `biomeById(biome).color`, and glyphs are
     the preview's `SHAPES`.
   - **No art packet:** no new images.
3. **A region hex** (HM4–HM6), as the preview draws it:
   - **Always:** the biome colour, the glyph, its name, its levels (`formatLevels`), and ♛♛ on the twin-boss row.
   - **Untouched:** muted, at half opacity.
   - **Claimed:** the progress arc (`won/12`), and the claim's faces small across the hex.
   - **Completed:** a gold rim and ✓, and the clear's faces large in gold rings across its middle. The glyph moves up and
     the name down.
   - **Completed with no `clear`** (before v38): ✓ and no faces.
   - **The aria-label:** "Meadow II, Lv 1–5, 7 of 12" or "Meadow II, Lv 1–5, completed".
4. **A Spring hex:** water blue, a drop, "Spring", and "Ready" or its recharge (`springReadyAt`, as `formatDuration`).
5. **The capital hex:** gold, a castle, "Capital", and "n runs won", "Open run" or "No runs yet". It reads
   `capitals[c]` and `capitalRuns` (H160).
6. **The six run seats** (HM12), numbered clockwise from the top:
   - **Order:** the newest won runs first (`recent`), then the open runs. When there are more than six, the open runs
     keep their seats and the oldest won runs drop off. The capital's quick look still lists all six won.
   - **A won run's seat:** its four lanes' first Umas in gold rims, and "Run 7 · ✓".
   - **An open run's seat:** its four dimmed, with a progress arc and "Run 9 · 7/16". The 16 is 12 generals and 4 finals:
     each lane's `generals` plus its `finalAt`.
   - **An empty seat:** "Open seat".
7. **Tapping a hex opens its quick look** (HM8), a `BottomSheet`:
   - **A region:**
     - its levels and `won/12`;
     - "Claimed" with its five faces and date;
     - "Cleared" with its five faces and date, or "Cleared ✓" with no faces before v38;
     - its next stage's name and level;
     - **Enter**, which opens `r/<id>`.
   - **A Spring:**
     - its state;
     - its eight regions by name;
     - **Refill**, which calls `drinkAtSpring` for the active party. It's disabled while recharging or while a fight is
       open, as today.
   - **The capital:** the open runs ("Run 9 · 7/16", each with its four parties' leads), then the won runs (each with its
     date and its twenty faces), then **Open capital**, which opens `capital/<id>`.
   - **A seat:** its own run, the same way. An empty seat shows the capital's.
   - **The selected hex** gets an outline.
8. **Moving around** (HM9):
   - The map opens fitted to the screen and centred on the frontier: the lowest-level region not completed, first in the
     layout's order.
   - **Zoom:** pinch, and **− ⊙ +** buttons (⊙ refits), from the fitted size to 3×. Drag pans.
   - **Faces:** at the fitted size they draw as coloured dots (the preview's look). From 1.6× they're faces.
   - Keep the transform in the component. Don't reflow the page.
9. **Map / List stays.** When live, the List shows the six Springs as one row at its top ("Spring 3 · Ready", each a
   Refill button), then the regions by band and row as today. The new ones go in their band's first row (Lv 1–5's row
   1, Lv 6–10's row 6).
10. **A region's Spring:** `RegionMap.tsx`'s header Spring reads `nearestSpring` when live.
11. **24 parties on screen:**
    - The Party Hall, its peek and counter, the Rift sign-up and New run's pickers show 24.
    - Nothing is cut off at 375 wide.
    - Copy that says "20 parties" changes.
12. **Copy:** every string follows the copy rules (≤ 6 words a surface, none of the banned words).
13. **Weight:** the map lives in the Scenario Gate's lazy chunk. Main JS stays under 230 KB.

## Do

1. `HoneycombMap.tsx` (the SVG, the hexes, zoom and pan), its quick-look sheets, and the `ContinentMap` switch.
2. The List's Springs row, the header Spring, and the 24-party screens.
3. Tests, with `./version` mocked at 38:
   - **The count:** 61 hexes, each a button with its label.
   - **Each region state:** untouched, claimed with five small faces, completed with five large, and completed before
     v38 with ✓ and no faces.
   - **A Spring:** its state, and its sheet's Refill calls `drinkAtSpring`.
   - **The capital and seats:**
     - no runs;
     - two won and one open: the order, "Run n · ✓" and "7/16";
     - more than six.
   - **Tapping** opens each quick look, and Enter navigates.
   - **The fitted view** centres on the frontier.
   - **The List** shows six Springs and 48 regions.
   - **Dark:** the pixel map shows unchanged.
4. Look at it on the local preview (`.claude/launch.json`'s `rpg-api` and `rpg-web`) with the version raised to 38 on
   a scratch branch, never pushed.
   - Check a fresh world, a world with claims and clears, and the owner-like world where regions were completed before
     v38.
   - Check 390×844 and 375×667, light and dark, fitted and zoomed.
   - Send the screenshots in the hand-off. They stay local and out of git, since faces are the owner's art.
5. Log the D-row (fetch `main` first).

## Done when

- [ ] `pnpm lint && pnpm test:ci && pnpm build` pass. Give the main JS figure against the 230 KB budget.
- [ ] Live play is unchanged while dark: today's pixel map and List, and 20 parties.
- [ ] Nothing from the original games in git (`git status`): no screenshots with faces.
- [ ] Deployed green (`gh run watch <id> -R luismlorenzana/uma-rpg --exit-status`) and https://uma-rpg.web.app/api/health
      shows the commit.

## Deliver

- **Claude:** commit to `main`: "feat(web): the honeycomb continent map, dark (H165)".
- **ChatGPT:** a branch and a pull request with that title. Merge it yourself when the checks and CI are green. Fetch
  `main` before you push so the D-number is free.
- **Flag it done:** delete this file and add a Done row in [README.md](../README.md) with the commit.
