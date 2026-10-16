# H29 — Art for D144: Star Gems and the Lapidary

**Priority: now · ChatGPT · uma-platform, then uma-rpg · M.** Ready: D144 is built and live with borrowed art.

## Why

D144 removed the farm. Extra Stats nodes now open with **Star Gems**, cut at a new Wilds station, the **Lapidary**.
Neither has art of its own yet. uma-rpg borrows:
- **Gems** draw as their grade's cut crystal from the items atlas (`cut-quartz` … `cut-philosophers-stone`), with a
  small badge in the planet's colour (`apps/web/src/items/frames.ts`, `iconFrame`; `items/planets.ts`, `planetFill`).
  So all ten moon gems of a grade look alike, and a gem looks like the Crystal Cavern's own refined item.
- **The Lapidary** draws as the Arcane Armory's building (`apps/web/src/hub/grid.ts`, `BUILDING_ART`).

## Context

- **What a gem is:** `uma-rpg/packages/domain/src/economy/stars.ts` (`GEM_IDENTITIES`: ids, kinds, grades, effects)
  and `economy/gems.ts` (names: "Garnet of Strength"). The manual's [Star Gems](../../game/materials.md#star-gems)
  section lists all 100.
- **The planets' colours** (keep the gems readable against them on the Observatory map), from `items/planets.ts`: HP
  `#e8706a`, MP `#6aa8ff`, ATK `#ff9a4d`, M.ATK `#c48bff`, DEF `#9fb4cc`, M.DEF `#5fd3c0`, Speed `#ffd84d`, Limit
  `#f0b8ff`; the Sun `#f5c542`.
- **The closest existing atlas:** the retired dishes atlas, `uma-platform/scripts/pixel-art/src/dishes/build.ts`: 320×320
  on a 32 px grid with a JSON index. Its layout is the one to copy. The dishes themselves now belong to uma-racer; leave
  them as they are.
- **Buildings:** `scripts/pixel-art/src/buildings/wilds.ts` and `places.ts` (48×48 frames, ground line at 44, keyed by
  place id).
- **Versions:** uma-art is 2.7.0 on uma-platform's `main`; uma-rpg pins 2.5.0. Fetch `main` in both repos first.

## Do

1. **uma-platform, a new `gems` atlas** (`packages/art/gems/atlas.{png,json}`), drawn from code like the others:
   - **Layout:** 320×320, 32 px grid, ids exactly as `GEM_IDENTITIES` orders them.
     - Rows 0–7 hold the moon gems `gem-<effect>-<g>`, one row per effect in this order: hp, mp, atk, matk, def, mdef,
       speed, limit. Grades 1–10 run left to right.
     - Row 8 holds the first ten bridge gems `gem-<a>-<b>-<g>`.
     - Row 9 holds the last six bridge gems, then the four Sun gems `gem-sun-4`, `-6`, `-8` and `-10`.
   - **Moon gems:** one stone shape per planet, in that planet's colour, so the eight rows read apart at a glance.
     - Grades read apart at 1× as in H03 and H27: rough stones at 1–3, faceted cuts at 4–6, and set in a metal mount
       at 7–8.
     - Grades 9–10 add the legendary glint (`GLINTS`).
   - **Bridge gems:** a twinned crystal in its pair's two colours. Grade 7 is larger and set in metal.
   - **Sun gems:** a gold radiant prism, with more rays at each of the grades 4, 6, 8 and 10.
   - **The corner:** keep the bottom-right 9×9 clear (`gear/build.ts` enforces this for gear; do the same here).
2. **uma-platform, a `lapidary` building frame** in the buildings atlas: a gem cutter's workshop.
   - Stone walls, a grinding wheel by the door, cut crystals on a bench.
   - Its own roof colour, distinct from the Arcane Armory's violet and the Forge's dark slate.
   - It stands between the Workbench and the Forge on the Wilds map, so match their scale and palette.
   - Append only, so every published frame keeps its place: a **minor** changeset.
3. **Release and pin:** Claude publishes the minor uma-art release (`CLAUDE.md`). Bump uma-rpg to it.
4. **uma-rpg:**
   - Point `iconFrame` at the `gems` sheet for every gem. Remove the borrowed cut-crystal frame and the planet badge
     (`planets` on `IconFrame`, the badge in `ItemIcon.tsx`).
   - Remove `lapidary` from `BUILDING_ART`.
   - `frames.test.ts`:
     - checks every gem against the published index;
     - still checks every item and gear piece, so a moved items row in 2.6–2.7 shows up there;
     - asserts the new sheet's size.

## Done when

- `pnpm art:draw` reproduces every PNG byte for byte, and `pnpm lint && pnpm test && pnpm build` pass in both repos.
- A 2× preview sheet of the gems atlas and the new building is in the uma-platform PR.
- The Wilds map, with `?canvas`, shows the Lapidary's own building. The Lapidary's picker, the Warehouse's Star Gems
  shelf and the Observatory's Set list show the new icons.
- No original-game content.

## Deliver

- **uma-platform:** a pull request on `feat/star-gem-art`, titled `feat(art): Star Gems and the Lapidary (H29)`, with a
  minor changeset.
- **uma-rpg:** a pull request on `feat/star-gem-art` that bumps uma-art and wires the gems sheet and the building.

Each merges itself after green CI (D120) and logs its decision with the next free number (fetch `main` first).
