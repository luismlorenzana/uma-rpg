# H73 — Art: the made items' icons (Weapon Gem, Armor Fittings, Accessory Setting G1–G10, the Branch Gem)

**ChatGPT · uma-platform · M · Needs: nothing · Unblocks: H79, H80 (the first of them pins the release and draws the
icons), H82 (checks the pin)**

## Why

uma-rpg's Tier rework (its D193, D195, D198) replaces crafted gear with **grades**: an Uma owns every weapon, armor slot
and accessory slot at G0, and one **made item** raises one of them a grade. Four places make them:
- the **Forge** makes **Weapon Gems** G1–G10 (and, from uma-rpg's third release, the **Branch Gem**, a weapon's G5 step);
- the **Armorer** makes **Armor Fittings** G1–G10;
- the **Charm Shop** makes **Accessory Settings** G1–G10;
- the **Lapidary** makes Planet and Moon Jewels, which reuse the existing gem icons (no art here).

They sit in the Warehouse beside the materials, on the Forge's, Armorer's and Charm Shop's pages, on every Gear-tab
upgrade line ("G4 → G5 · 1 Weapon Gem G5") and in the targets planner. uma-art has no icon for any of them. The design
asks for exactly this set and nothing else (uma-rpg `weapon-progression.md` WP29: "the item icons are gear.md's request
with one Branch Gem icon"): **three ten-grade rows and one Branch Gem**, 31 frames. Everything else in the rework
reuses existing art (accessories draw the gear sheet's Charm, Ring, Orb, Talisman and Amulet rows; jewels the gem sheet;
places existing building frames).

The Branch Gem replaces the first draft's five fork gems with one icon (WP10). uma-rpg only uses it from its third
release, but it ships now so one art release covers the whole economy.

## Context

- **The design (read only these):** uma-rpg `docs/design/tier-rework/weapon-progression.md` §2.2 (one rule for every
  piece), §6.1 (what is made), §8 (screens: the Gear tab rows and the planner), WP10, WP26, WP29;
  `docs/design/tier-rework/profession-progression.md` §3.5 (what the making places make), §6.1–§6.2 (what each is made
  of: Weapon Gems of ingots and planks; Armor Fittings of a prepared vegetable and a fillet in grades 1–5, an ingot, a
  plank and a cut stone in grades 6–10; Accessory Settings of prepared vegetables and fillets). The recipes are game
  rules and stay in uma-rpg; they only suggest what each icon is made of.
- **uma-platform's house style:** `scripts/pixel-art/README.md` (the shared rules: light from the top left, a 1 px
  selective outline, a soft drop shadow, legendary glints at grades 9–10; § "Racer tonics (A04)" is the model for an
  appended ten-grade row); `packages/art/README.md` lines 7–11 (the `items` atlas and its JSON) and § "Racer tonic items
  (A04, 2.10.0)".
- **The items atlas and its builder:** `scripts/pixel-art/src/build.ts`:
  - 21–28: 32 px cells, ten across; `atlasRows = FAMILIES.length * 2 + 2` (34 rows today: 32 material rows, the ticket
    row, the tonic row); the `ItemFrame` union (material, `kind: 'ticket'`, `kind: 'tonic'`);
  - 62–70: the Speed Ticket at (0, 1024), "Non-graded utility icons append after all 320 material frames; never invent a
    material family or grade for them";
  - 72–85: the tonic row at y = 1056 ("A04 gets a new complete row, including retaining the old utility row's empty
    cells verbatim"): the exact pattern to follow, one complete row per line;
  - 87–90: the atlas and its JSON are written; 92–110: previews (`racer-tonics-*`, `items.png`, `items.html`).
- **The painters to learn from:** `src/items/tonics.ts` (an appended graded set: structure that changes at grades 4 and
  7, metal from 7, glints at 9–10 through `drawIcon`); `src/items/types.ts` (`ItemIcon`); `src/icon.ts` (`drawIcon`,
  `GLINTS`); `src/shape.ts` (`Mask`, `shadeDome`, `cutStone`, `shadeFacets`); `src/gear/materials.ts` (`METALS`,
  `WOODS`, `CLOTHS` … the grade ladders gear is drawn with) and `src/gear/fittings.ts` (`gemOf(g)`, `jewel`,
  `legendaryHalo`): use these ladders so a G7 made item reads as a G7 piece of gear does.
- **Icons these must not look like** (they appear next to them in the game):
  - `src/gems/paint.ts`: the Star Gems' eight planet silhouettes and the four gold **Sun prisms** (uma-rpg draws its
    Planet Jewels with the Sun prisms and its Moon Jewels with the `limit` crescent row, `gem-limit-2/4/6/8/10`);
  - `src/gear/jewelry.ts`: the **Ring** (a band with a set gem) and the **Charm** (a carving on a cord) rows, which
    uma-rpg now draws for its Insignias and Pendants;
  - the gear sheet's Orb, Talisman and Amulet rows (`src/gear/element-orb.ts`, `d124.ts`), which draw its Orbs and Bells.
- **The guards:** `src/testing/atlas.ts` (`savedAtlas`, `hash`, `decodePng`); `src/items/legacy-2.9.0.json` with
  `src/items/tonics.test.ts` (the model: the old frames' metadata hash, the old sheet's RGBA hash, the appended frames at
  exact places, painter determinism, standalone PNGs, transparent borders, structural variants independent of colour,
  glint clearance) and `src/items/tickets.test.ts`. Both currently pin the sheet at **320×1088 and 331 frames**.
- **How uma-rpg reads the sheet:** `apps/web/src/items/frames.ts` 5–12 (`SHEET_SIZE.items` 320×1088) and 27–47
  (positions computed from the catalog's order; a web test checks them against the published JSON). uma-rpg will add the
  new rows by id. Its item ids are the frame ids below, character for character.
- **Versions:** uma-art **2.12.0** on uma-platform's `main` (H54) and pinned in uma-rpg. This packet makes **2.13.0**
  (or the next minor if another packet took it).

## Decisions made

- **Where:** the `items` atlas, appended. These are Warehouse items, consumed one at a time, like the materials and the
  tonics; the gear sheet's rows are pieces worn by slot. Four new complete rows, never reusing the empty cells of the
  ticket or tonic rows (A04's rule). The sheet grows from **320×1088 to 320×1216**, **331 → 362 frames**.

  | y | x = 0 … 288 (grades 1 → 10) | Frame ids |
  |---|---|---|
  | 1088 | Weapon Gem G1–G10 | `weapon-gem-g1` … `weapon-gem-g10` |
  | 1120 | Armor Fittings G1–G10 | `armor-fittings-g1` … `armor-fittings-g10` |
  | 1152 | Accessory Setting G1–G10 | `accessory-setting-g1` … `accessory-setting-g10` |
  | 1184 | Branch Gem at x = 0; the rest of the row empty | `branch-gem` |

- **Metadata:** `{ x, y, w: 32, h: 32, name, kind: 'made', line, grade }`: `line` is `'weapon-gem'`, `'armor-fittings'`,
  `'accessory-setting'` or `'branch-gem'`; names "Weapon Gem G1" … "Weapon Gem G10", "Armor Fittings G1" …, "Accessory
  Setting G1" …, and "Branch Gem" with `grade: 5` (it is a grade-5 item). Add the shape to `ItemFrame`. Art identity only:
  no recipes, costs or unlocks in the package.
- **What each one is** (original, code-drawn, 32×32, the shared kit):
  - **Weapon Gem:** a **cut gem made to be set into a weapon**: a narrow faceted stone, **point down**, clasped across its
    upper third by a short **metal bar with two rivets** (a crossguard-like clasp), a stub of tang below the clasp.
    - The gem's colour follows `gemOf(g)` and the clasp `METALS` by grade (copper at 1, iron by 3, silver at 7–8, gold and
      the legendary metals at 9–10).
    - Its construction changes like the tonics': **G1–3 rough** (an uncut nugget, plain clasp), **G4–6 faceted** (cut
      facets, a wider clasp), **G7–8 mounted** (side prongs grip the stone, a set pip on the bar), **G9–10** gilded with a
      small halo and the shared glints.
    - **Not a Star Gem or a Sun prism:** no planet silhouette, no rays, and always the clasp and tang; not a sword: no
      blade, no grip.
  - **Armor Fittings:** **a buckle on a strap with a riveted plate**: a short belt strap with a square buckle, a small
    curved plate riveted over it.
    - **G1–5**, light fittings: cloth-and-leather strap (`CLOTHS`), a copper buckle, a thin plate.
    - **G6–10**, heavy fittings: the plate grows and is metal (`METALS` by grade), and **a small cut stone is set in the
      plate** (the high band's recipe adds a cut stone), silver trim at 7–8, gold and glints at 9–10.
    - Told apart from the gear sheet's Helm, Gauntlets and Boots by being **a part, not a worn piece**: no head, hand or
      foot shape.
  - **Accessory Setting:** **an empty jewelry setting**: a round bezel cup on a short loop, **its prongs open and no stone
    in it** (the slot's form is chosen later; the setting holds the grade).
    - **G1–3** a wire bezel wrapped with cord; **G4–6** a cast bezel with four prongs; **G7–8** silver filigree around
      it; **G9–10** gold with a tiny halo and the glints. Metal by `METALS` grade.
    - Told apart from the Ring (a band with a stone) and the Charm (a carving on a cord) by **the empty cup and its open
      prongs**, seen face on.
  - **Branch Gem:** **one stone that forks**: two faceted crystal points growing apart from one base in a **Y**, clasped
    at the fork by the Weapon Gem's metal bar (so it reads as a weapon item) in gold, the two points in **two different
    gem colours** (a teal one and a violet one), a soft glow at the fork. One frame, no grades.
    - Not the Rift's Arcane crest (a four-pointed star), not a Sun prism: a two-pointed **Y**.
- **Readable small:** each frame reads at 1× on a white chip and on a `#17202b` chip (uma-rpg's shelves and chips are
  32 px and its upgrade lines 20–28 px): the light tones carry the shape where the outline disappears.
- **Every new frame keeps its four corner pixels and its 1 px border transparent**, and the full bottom-right 9×9 clear
  (the gear sheet's rule: a game may draw a grade badge there).
- **Append only, with a guard:**
  - a new `src/items/legacy-h73-2.12.0.json`, taken from the 2.12.0 files on `main` **before** your change: the metadata
    hash of all 331 frames, the whole old sheet's RGBA (0, 0, 320, 1088), its size and frame count;
  - `tonics.test.ts` and `tickets.test.ts` move their sheet-size and frame-count assertions to 320×1216 and 362 (never
    loosen a check on an old frame's place, metadata or pixels).
- **Release:** a **minor**, uma-art **2.13.0** (or the next minor). Per uma-rpg's CLAUDE.md, ChatGPT may merge its own
  pull request, and **Claude versions and publishes the uma-art release** from `main`; uma-rpg's first screens packet
  (H79 or H80) pins it.

## Do

1. **`src/items/made.ts`** (new): four painter sets on the `ItemIcon` shape, `WEAPON_GEMS`, `ARMOR_FITTINGS`,
   `ACCESSORY_SETTINGS` (ten each, ids and names as above, `grade` 1–10) and `BRANCH_GEM`, each module comment saying what
   it draws and that it is art identity only. Share helpers (the clasp, the prong cup) in the file; reuse
   `gear/materials.ts` ladders and `gear/fittings.ts` helpers rather than new colours.
2. **`src/build.ts`:** `atlasRows` grows by four; append the three rows at rows 34, 35, 36 (y 1088, 1120, 1152) and the
   Branch Gem at row 37 (0, 1184), each frame `{ x, y, w: 32, h: 32, name, kind: 'made', line, grade }`; write the
   standalone PNGs to `assets/items/made/<id>.png`; add a "Made items" section to `items.html` (labels and grades, as
   the tonics have).
3. **Guards:**
   - `src/items/legacy-h73-2.12.0.json` as decided;
   - **`src/items/made.test.ts`** (new), following `tonics.test.ts`:
     - the 331 old frames' metadata and the old 320×1088 RGBA match the baseline; the sheet is 320×1216 with 362 frames;
     - the 31 new frames sit at their exact `{ x, y, w, h, name, kind, line, grade }`, in id order after `tonic-10`;
     - each painter draws the same pixels twice, matches the saved atlas cut-out and its standalone PNG;
     - every new frame's border pixels and bottom-right 9×9 are transparent;
     - **within each row, ten structurally different grades** independent of colour (hash the sprite's material and
       tone grids, as `tonics.test.ts` does);
     - **between rows**, the opaque silhouettes of each row's G5 differ pairwise in at least a quarter of their combined
       pixels, and each differs the same way from the gear sheet's `ring-g5` and `charm-g5`, the gem sheet's
       `gem-sun-6` and `gem-limit-6`, and from `tonic-5`; the Branch Gem differs from `weapon-gem-g5` the same way;
     - G9–10 glints are clear of the object (`GLINTS`, as `tonics.test.ts` checks).
   - Move `tonics.test.ts`' and `tickets.test.ts`' size and count assertions as decided. Every other existing test
     (`racer.test.ts`, `lapidary.test.ts`, `battle.test.ts`, `rift.test.ts`, `paladin.test.ts`, the `ui` and gear guards,
     the edge check) passes unchanged.
4. **Previews** (`pnpm art:draw`; original art, safe in git):
   - `made-items-1x.png`, `-2x.png`, `-4x.png`: the three rows and the Branch Gem, then a comparison strip (a G5
     Greatsword, a G5 Helm, `charm-g5`, `ring-g5`, `gem-sun-6`, `gem-limit-6`, Copper Ingot, Cut Citrine), on a white
     chip row above a `#17202b` chip row, laid out like `racer-tonics-*`;
   - `made-items.html` labelling every frame; `items.png` and `items.html` gain the new rows. Every other existing preview
     stays byte-identical.
5. **Docs:** `packages/art/README.md`: the `items` line gains "then the made items (H73)" and the new size; a short
   section **"Made items (H73, 2.13.0)"** with the four rows' ids, positions and the metadata shape. `scripts/pixel-art/
   README.md`: a short H73 section. uma-platform's `docs/decisions.md`: the next free P-row (fetch `main` first; P72 if it
   still ends at P71). uma-platform's `docs/handoff/README.md`: an H73 row under "Art authoring", Done with the merge
   commit and the version, as H38's and H54's rows are.

## Done when

- [ ] `pnpm art:draw` runs twice with byte-identical output, and `git status` is clean after the second run.
- [ ] `made.test.ts`, the moved `tonics.test.ts` and `tickets.test.ts`, every old guard and the edge check pass; so do
  `pnpm lint && pnpm test && pnpm build`.
- [ ] Every 2.12.0 `items` frame keeps its place, metadata and pixels; the sheet is 320×1216 with 362 frames.
- [ ] The pull request shows `made-items-2x.png` with `made-items-1x.png` beside it, inline, so the 1× reading can be
  judged on white and on dark.
- [ ] **No original-game content:** nothing copied from any game, franchise or the three enemy packs; no logos, no
  item designs from elsewhere.
- [ ] uma-art 2.13.0 (or the next minor) is published: `gh api /user/packages/npm/uma-art/versions --jq '.[].name'`.

## Deliver

- **uma-platform:** a pull request on `feat/h73-made-item-icons`, titled `feat(art): the made items' icons, Weapon Gem,
  Armor Fittings, Accessory Setting and Branch Gem (H73)`, with a **minor** changeset for `@luismlorenzana/uma-art`.
  Before merging: fetch `main` and rebase. It merges after green CI (ChatGPT may merge its own). **Claude then versions
  and publishes the release** (`pnpm version-packages` on `main`, the release workflow publishes, P42) and replies with
  the version.
- **uma-rpg:** a pull request on `docs/h73-done` that deletes this packet and adds a Done row to
  `docs/handoff/README.md` with the uma-platform merge commit and the published version (set H79 and H80 to Ready if
  their other needs are done). It merges after green CI.
- **Reply** with both pull request links, the published version and `made-items-2x.png`. uma-rpg's H79 or H80 pins the
  release (whichever lands first, as H59 pinned 2.12.0) and H82 checks it.
