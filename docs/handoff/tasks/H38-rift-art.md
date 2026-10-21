# H38 — Art for the Rift: its building, four front crests and the achievement badges

**ChatGPT · uma-platform · M · Needs: nothing · Claude pins the release and wires it in uma-rpg later (the Rift page).**

## Why

D161 approved [the Rift](../../design/rift.md), the end-of-tier event. It replaces the Tier Finale on the Battle page.
- **The building.** The Battle page draws the Tier Finale with uma-art's `tier-finale` stadium. uma-racer's Expedition
  Map draws that same frame, so it can't be repainted. The Rift needs a new frame of its own.
- **The fronts.** The Rift page shows four fronts: Iron, Arcane, Duel and Horde (§5). Each needs a small crest.
- **The achievements.** The Rift pays achievements, not EXP (§7). The Account lists them, and a cut-in shows one when
  it's earned. Each needs a badge.

uma-art has none of these yet. §10 of the design lists this packet.

## Context

- **The design:** uma-rpg `docs/design/rift.md`:
  - §4: the Rift takes the Tier Finale's place. uma-rpg keeps the place id `tier-finale` and points it at the new frame.
  - §5: the four fronts;
  - §7: the achievements;
  - §10: this art.
- **uma-platform's house style:** `scripts/pixel-art/README.md`, especially the A01, A02, H29 and H31 sections, and
  `packages/art/README.md`, which has each atlas's schema.
- **Buildings:** `scripts/pixel-art/src/buildings/`.
  - `kit.ts` holds the shared kit: `SIZE` 48, `GROUND` 44 (the `anchorY`), `dome`, `slab`, `crystal`, `boulder`, and
    `glow`, a soft see-through halo.
  - `types.ts` holds `Page`. `places.ts` is the append-only list. `build.ts` packs six across in `PLACES` order and
    fails if any pixel touches the frame edge.
  - **The model to copy:** `lapidary.ts` with `lapidary.test.ts`. That was the last single building appended (H29).
  - **The neighbours:** `scenario-gate` and `tier-finale` in `town.ts`.
  - **Don't look like these:** `summoner-circle` and `mage-tower` in `learning.ts`, and `ley-spring` in `wilds.ts`.
- **The Battle page:**
  - `src/tiles/battle-map.ts` is H31's review page. The Scenario Gate is at lot (6, 4) and the Tier Finale at (6, 15).
  - `tiles/build.ts` writes it as `battle-hub-2x.png`.
  - The ground is `GROUND.battle` (base `#7c7854`, olive earth). The road is flagstone (`#a29d89`).
- **The Rift's colours already exist:** the world atlas's `rift` biome. See `src/world/ground-rest.ts` (`#3d3f8f`
  indigo, `#c49ecd` lilac) and `src/world/backdrops.ts` (glow `#cfb3ef`). Reuse them, so the building and the world
  map read as the same place.
- **The `ui` atlas:** `scripts/pixel-art/src/ui/`.
  - `spec.ts` holds `FRAME_SPECS`. Frame ids are `group/key`.
  - `atlas.ts` holds `drawUi` and `packUi`. The sheet is 120×52 today.
  - Also read `ui.test.ts`, and `build.ts`, which writes the previews.
  - Models to copy:
    - `racer.ts` (`tierCrest`, `currencyMark`);
    - `src/laurel.ts`, which paints directly at the target grid;
    - `statuses.ts`: one shared badge, told apart by a glyph.
- **The guards:**
  - `src/testing/atlas.ts` (`savedAtlas`, `hash`);
  - `testing/legacy-h31-2.8.0.json` with `tiles/battle.test.ts`;
  - `buildings/legacy-2.7.0.json` with `lapidary.test.ts`;
  - `buildings/legacy-2.5.0.json` with `racer.test.ts`;
  - `ui/legacy-2.6.0.json` with `ui.test.ts`.
- **How the games draw these:**
  - uma-kit's Hub draws a building at 1.5 CSS px per art pixel, which is 3 device pixels (`packages/kit/src/hub/grid.ts`).
  - It animates only a frame's `smoke`. Any glow has to be painted into the pixels.
  - uma-rpg draws `ui` frames at their native size in CSS px (`apps/web/src/battle/pixel-icons.tsx`).
- **Versions:** uma-art is 2.10.0 on uma-platform's `main`. It's published, but it has no git tag. uma-rpg pins 2.9.0.

## Do

1. **The `rift` building**, in a new `src/buildings/rift.ts`, appended after `LAPIDARY` in `places.ts`.
   - The place is `{ id: 'rift', name: 'The Rift', page: 'battle', at: { x: .5, y: .72 } }`. The `at` is the Tier
     Finale's spot on uma-rpg's Battle page.
   - Add `battle` to the buildings' `Page`, with `GROUND_COLORS` `['#7c7854', '#a29d89']` and a dark olive tint. `tsc`
     names every `Record<Page, …>` to fill.
   - It's place 41, so it lands at **(240, 288)**, 48×48, `anchorY` 44. The sheet stays 288×336.
   - **What it shows:**
     - **The tear:** a tall, jagged, upright tear in the air, like a lens of light. It's near-white lilac at the core,
       violet and then indigo at the edges. It's the biggest and brightest thing in the frame.
     - **The dais:** a cracked dark-stone dais under the tear.
     - **The shards:** two broken obsidian shards lean in on either side of the tear. A few rock chips float beside
       it, drawn towards it.
     - **The fronts:** four small standing stones on the dais's rim, one per front. Each is lit in its front's colour:
       steel, violet, crimson, amber (item 2).
   - **The glow:**
     - Paint it with `glow()` around the tear, in `#cfb3ef`, up to about alpha 90.
     - Keep it at least 2 px from every frame edge. The edge check counts any alpha.
     - It's static: return no `smoke`.
   - **The silhouette:** tall and spiky in the middle. Then it can't be mistaken for the Scenario Gate's flat-topped
     arch, or for the Tier Finale's low oval.
     - No arch, no stadium and no flags.
     - No rune ring on a round dais (the Summoner Circle), and no pool (the Ley Spring).
   - **The palette:** the `rift` biome's colours with dark stone (about `#34303f` and `#6e6878`). Then it stands out on
     the olive ground and next to both pale neighbours.
   - The same kit, light from the top left, 1 px outline, contact shadow and scale as the other places.
2. **Four front crests**, each 16×16, in group `front`. They sit in a new row at y = 52.

   | Id | At | Motif | Colour |
   |---|---|---|---|
   | `front/iron` | (0, 52) | A broadsword, point down, with a broad iron crossguard: a tall cross | Steel blade `#a6b5bd`, iron guard |
   | `front/arcane` | (16, 52) | A four-pointed star with long rays up and down, a near-white core and two small sparks: a diamond star | Violet `#a77be0` |
   | `front/duel` | (32, 52) | One horned foe mask, face on: a rounded mask, two short horns, two dark eye slits | Crimson `#c8443e`, pale bone rim |
   | `front/horde` | (48, 52) | Three smaller horned masks, two below and one above, overlapping: a pyramid of heads | Amber `#d98a3a` |

   - Iron and Arcane say which damage to bring. Duel and Horde show the foes: one, or many.
   - They're told apart **by silhouette**, not only by colour. They must not look like the class emblems' crossed or
     diagonal blades.
   - Style them like the currency marks: 1 px outline and a soft shadow. Each reads at 1× on a white chip and on a
     `#17202b` chip, so the light tones must carry the shape where the outline disappears.
3. **Eleven achievement badges**, each 24×24, in group `achievement`. 24 matches the class emblems in a list row. A
   cut-in scales a badge by a whole number, so it must hold up at 4×.
   - **Decided: one frame per badge, no tints.** The atlas has no tint. uma-rpg draws `ui` frames as CSS backgrounds,
     where a tint needs filters, and a multiply tint flattens the six-tone ramp.
   - **Front seals** (`seal-iron`, `seal-arcane`, `seal-duel`, `seal-horde`):
     - a round seal about 18 px across, with a lumpy rim like pressed wax;
     - in its front's colour, with two short ribbon tails below in a darker shade;
     - the front's crest motif pressed into the centre in the wax's own darker tones, simplified to about 10 px.
     - Like `laurel.ts`, paint it at the target grid. Never resize a bitmap.
   - **`rift-conquered`:** a gold crown whose band holds four small gems in the fronts' colours, over a short lilac
     glow. It's the only crown in the set.
   - **Six titles** (`iron-will`, `arcane-purity`, `untouched`, `swift-convergence`, `bestiary`, `crossover`):
     - **The shared banner:** a swallow-tailed banner hanging from a short gold rod.
       - The cloth is a mid indigo (about `#5a50a8`), so the outline shows on white and the rod and the pictogram show
         on dark.
       - A different silhouette from the round seals and the crown.
     - **The pictograms:** each title has its own, about 12×12, in light ink plus one accent colour. They differ by
       pictogram, the way the status badges differ by glyph:
       - `iron-will`: a clenched steel gauntlet;
       - `arcane-purity`: a single clear teardrop with a sparkle, in a violet accent;
       - `untouched`: a whole heart under a small halo;
       - `swift-convergence`: a winged hourglass;
       - `bestiary`: an open book with three claw marks across it;
       - `crossover`: six pips in a ring, each a different hue (six classes).
   - **Decided:** `untouched` is one badge for all four fronts. The game shows the front's 16 px crest beside it.
   - Keep the four corner pixels of every new frame transparent (`ui.test.ts` checks this).
4. **The `ui` sheet**, appended:
   - It grows from 120×52 to **120×140**. The width stays 120, because H31's guard checks it.
   - In `spec.ts`:
     - add `FRONTS = ['iron', 'arcane', 'duel', 'horde']`;
     - add `ACHIEVEMENTS` in the order below;
     - add both groups to the `FrameSpec` union;
     - append their specs to `FRAME_SPECS`, after `currency/laurel`.

   | y | x = 0 | 24 | 48 | 72 | 96 |
   |---|---|---|---|---|---|
   | 68 | `achievement/seal-iron` | `achievement/seal-arcane` | `achievement/seal-duel` | `achievement/seal-horde` | `achievement/rift-conquered` |
   | 92 | `achievement/iron-will` | `achievement/arcane-purity` | `achievement/untouched` | `achievement/swift-convergence` | `achievement/bestiary` |
   | 116 | `achievement/crossover` | | | | |

5. **Append only, with guards:**
   - **A new baseline:** add `src/testing/legacy-h38-2.10.0.json`, taken from the 2.10.0 files on `main` before your
     change. It freezes:
     - every `ui` and `buildings` frame's metadata;
     - the whole old `ui` sheet's RGBA (0, 0, 120, 52);
     - the `buildings` sheet's RGBA, with the empty cell at (240, 288) zeroed (H31 did the same for its Laurel slot);
     - per-frame RGBA for `tier-finale` and `scenario-gate`.
   - **A new `src/rift.test.ts`** checks:
     - the old frames against that baseline;
     - every new frame at its id, place and size;
     - the painters draw the same pixels every time, and match the saved atlases;
     - the Rift touches no edge, returns no smoke and differs from `tier-finale`;
     - each pair of the four crests' opaque silhouettes differs in at least a quarter of their combined pixels;
     - the six title pictograms are all different.
   - **Existing tests:** where one counts frames or names the last place, move it to the new totals:
     - `lapidary.test.ts`: 41 frames becomes 42, and the Lapidary is checked at index 40, not `PLACES.at(-1)`;
     - `ui.test.ts`: the sheet becomes 120×140, its 22 icons become 37, its five 24×24 frames become 16, its id list
       grows, and its y-by-group check gains the new rows.
   - Never loosen a check on an old frame's place, metadata or pixels.
   - **Existing preview PNGs stay byte-identical**, except `buildings.png`, which gains the Rift and a Battle mock page.
     `buildings.html` and `ui.html` gain the new cards and labels.
6. **Previews**, written by `pnpm art:draw`. They're original art, so they're safe in git.
   - `rift-2x.png`: the Scenario Gate, the Tier Finale and the Rift side by side at 2×, on Battle ground.
   - `rift-battle-hub-2x.png`: H31's review Battle page with the Rift in the Tier Finale's lot (6, 15). Give
     `battleHubMap` an optional list of lots for this. Its default keeps `battle-hub-2x.png` exactly as it is.
   - `rift-marks-1x.png`, `-2x` and `-4x`: the four crests, then the eleven badges, on a white chip row and a `#17202b`
     chip row, laid out like `laurel-marks-*`.
   - `ui.html`: add "Rift fronts" and "Achievements" sections, with a label for every new key.
7. **Docs:**
   - `packages/art/README.md`: add `front/<front>` and `achievement/<key>` to the `ui` line, and a short section,
     "The Rift (H38, 2.11.0)", with the ids and positions.
   - `scripts/pixel-art/README.md`: a short H38 section.
   - The P-row in uma-platform's `docs/decisions.md`.

## Done when

- `pnpm art:draw` runs twice with byte-identical output, and `git status` is clean after the second run.
- The edge check, the old guards (`racer.test.ts`, `lapidary.test.ts`, `battle.test.ts`, `ui.test.ts`'s 2.6.0 guard)
  and the new `rift.test.ts` pass. So do `pnpm lint && pnpm test && pnpm build`.
- `tier-finale`'s place, metadata and pixels are unchanged.
- The pull request shows these previews inline:
  - `rift-2x.png`;
  - `rift-battle-hub-2x.png`;
  - `rift-marks-2x.png`, with `rift-marks-1x.png` beside it, so the 1× reading can be judged.
- **No original-game content:**
  - no logos, emblems, characters or portal designs copied from any game;
  - no franchise marks on Crossover or Bestiary;
  - nothing taken from the three enemy packs.

## Deliver

- **uma-platform:**
  - **The pull request:** on `feat/rift-art`, titled `feat(art): the Rift building, front crests and achievement
    badges (H38)`, with a **minor** changeset for `@luismlorenzana/uma-art`.
  - **Before merging:** fetch `main`, rebase, and run `pnpm version-packages`. That makes 2.11.0, or the next minor if
    another packet took that version.
  - **Merging:** it merges itself after green CI, and the push to `main` publishes the release (P42).
  - **The decision:** log it with the next free P-number. That's P66 today, but fetch `main` first.
  - **The queue:** in `docs/handoff/README.md`, add an H38 row under "Art authoring", Done with the merge commit and
    the version, as A04's row is.
- **uma-rpg:** a pull request on `docs/h38-done` that deletes this packet and adds a Done row to
  `docs/handoff/README.md`, with the uma-platform merge commit and the published version. It merges itself after green
  CI.
- **Reply** with both PR links, the published version and the three 2× previews. Claude pins the release in uma-rpg and
  builds the Rift page on it.
