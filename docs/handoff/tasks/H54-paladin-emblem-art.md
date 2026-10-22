# H54 — Art: the Paladin's class emblem (uma-art 2.12.0)

**Claude · uma-platform · S · Needs: nothing · Unblocks: H59 (the screens pin the release and point the Bastion at its
frame)**

## Why

Classes v2 (D160) adds a sixth class, the **Paladin**, and a sixth Hall of Heroes, the **Paladin Bastion** (C2). The game
shows a 24 px class emblem beside every class name (the Stable's picker, the profile chip, the party bar: H11), and a
48 px building for every hall on the Learning page. uma-art has five emblems and no Paladin.

The owner wants lean assets: the cheapest art that looks fine. So this packet draws **one emblem** and **no building**:
uma-art already has an unused keep, `knights-bastion`, drawn with the halls (D36's old armory, which left the Hub). The
Bastion draws it through `Place.frame`, as the Rift draws `rift` (H50).

## Context

- **The design:** uma-rpg [classes-v2.md](../../design/classes-v2.md) §3.3 (the Paladin: Barriers and guarding, heals from
  ATK, physical armor, 3 Arms and 2 Tomes) and §5 (the Paladin Bastion).
- **uma-platform's house style:** `scripts/pixel-art/README.md` § "UI emblems and status badges" (H11) and § "The Rift
  (H38)"; `packages/art/README.md` lines 25–31 (the `ui` atlas: five class emblems, 24×24, `class/<class>`).
- **The emblems:** `scripts/pixel-art/src/ui/`:
  - `spec.ts`: `CLASSES` (line 2, five), the `FrameSpec` union and `FRAME_SPECS` (23–31);
  - `classes.ts` 7–48: `classEmblem`, one branch per class on a shared steel, gold and wood kit, 24×24 with a contact
    shadow. Brawler: an axe and a greatsword crossed. Mage: an open book with a gold star. Spell Blade: a rune ring
    behind a diagonal sword. Cleric: a small teal heater shield with a gold cross under a halo. Summoner: a spirit over a
    rune circle;
  - `atlas.ts` 44–60: `packUi` puts a class at `CLASSES.indexOf(key) × 24`, y 0. **The class row is full** (5 × 24 =
    120, the sheet's width, which H31's guard fixes), so a sixth class in `CLASSES` would land off the sheet;
  - `ui.test.ts`, `src/testing/atlas.ts` (`savedAtlas`, `hash`), `ui/legacy-2.6.0.json` and H38's
    `src/testing/legacy-h38-2.10.0.json` with `src/rift.test.ts`: the model for a new guard.
- **The keep:** `scripts/pixel-art/src/buildings/learning.ts` 421–466, `knights-bastion`: a square stone keep with
  battlements and arrow slits, low curtain walls, a gate, a blue banner (`#3858b8`) with a gold star (`#e6b640`) and a
  roof pennant. It's in the published buildings atlas; neither game draws it today (grep uma-rpg and uma-racer).
- **How uma-rpg draws these:** `apps/web/src/battle/pixel-icons.tsx` 22–24 (`ClassEmblem` draws `class/<classId>` at its
  native 24 CSS px, or a whole-number scale), and `apps/web/src/hub/HubScreen.tsx` 115 (`frame: place.frame ?? place.id`).
- **Versions:** uma-art 2.11.0 on uma-platform's `main` (H38); uma-rpg pins 2.11.0.
- **Releasing:** uma-platform's [handoff README](https://github.com/luismlorenzana/uma-platform/blob/main/docs/handoff/README.md)
  § "Releases while packets run in parallel", and how H38 shipped (`git -C ../uma-platform log --oneline | grep -i H38`:
  `e3da022` the art, `4125858` the release).

## Decisions made

- **One frame, `class/paladin`, 24×24, at (24, 116):** the free cell beside `achievement/crossover` on the sheet's last
  row. The sheet stays **120×140**; published frames never move. `CLASSES` keeps its five (they place the y 0 row by
  index); the `Class` type gains `'paladin'`, and her spec appends to `FRAME_SPECS` after the achievements.
- **The motif:** a tall **tower shield**, face on (taller than wide, flat top, rounded foot), with a **deep blue field**
  and a **gold star boss**, a gold rim, and a **sword's gold crossguard and grip rising behind its top edge**. Colours are
  the keep's banner (`#3858b8`, `#e6b640`) on the emblems' steel (`#cadde8`), so the emblem and the Bastion read as one.
  - It's told apart **by silhouette**: a tall upright shield with a cross on top. The Cleric's is a small heater shield
    under a halo, the Brawler's and the Spell Blade's are diagonal blades.
  - Same kit as the five: light from the top left, a 1 px outline where the others have one, the contact shadow
    `{ cx: 12, cy: 22, rx: 8, ry: 1, alpha: 62 }`, the four corner pixels transparent. It reads at 1× on a white chip and
    on a `#17202b` chip.
- **No building.** uma-rpg's Bastion uses `frame: 'knights-bastion'` (H59). It was drawn with the Learning halls in their
  palette and scale, so it matches them; drawing a new keep would duplicate it.
- **Release:** a **minor**, uma-art **2.12.0** (or the next minor if another packet took it).
- **Append only, with a guard:** a new `src/testing/legacy-h54-2.11.0.json`, taken from the 2.11.0 files on `main` before
  your change, freezes every `ui` frame's metadata, the whole 2.11.0 `ui` sheet's RGBA with the empty cell at (24, 116)
  zeroed, and the `knights-bastion` frame's metadata and pixels.
- **Not in scope unless the main session amends this packet before dispatch:** a new `paladin-bastion` building
  (it would be place 42 at (0, 336), growing the buildings sheet to 288×384, a stone keep told apart from
  `knights-bastion` by a shield wall instead of a banner).

## Do

1. **`ui/spec.ts`:** `Class` gains `'paladin'` (keep `CLASSES` as the five); append
   `{ id: 'class/paladin', group: 'class', key: 'paladin', w: 24, h: 24 }` to `FRAME_SPECS`, last.
2. **`ui/classes.ts`:** the `paladin` branch of `classEmblem` as decided.
3. **`ui/atlas.ts`:** `packUi` places `class/paladin` at (24, 116); the comment says why. The sheet stays 120×140.
4. **Guards:**
   - `legacy-h54-2.11.0.json` as decided, and `src/paladin.test.ts`: the old frames and pixels against it; the new frame
     at its id, place, size and group; the painter draws the same pixels every time and matches the saved atlas; its
     corners are transparent; its opaque silhouette differs from each of the five emblems' in at least a quarter of their
     combined pixels.
   - `ui.test.ts`: frames 37 → 38, 24×24 frames 16 → 17, the id list grows, and its y-by-group check allows the one
     class frame at y 116. Never loosen a check on an old frame's place, metadata or pixels.
5. **Previews** (`pnpm art:draw`; original art, safe in git):
   - `paladin-emblems-1x.png`, `-2x`, `-4x`: the six class emblems in game order (Brawler, Mage, Spell Blade, Cleric,
     Summoner, Paladin) on a white chip row and a `#17202b` chip row, laid out like `rift-marks-*`;
   - `paladin-bastion-2x.png`: `knights-bastion` between the Spell Blade Salle and the Cleric Chapel on Learning ground,
     with the Paladin emblem at 2× beside it, so the pair can be judged together;
   - `ui.html` gains the Paladin's label. Every other existing preview stays byte-identical.
6. **Docs:** `packages/art/README.md`: "six class emblems", the Paladin in the class list, and a short section "The
   Paladin (H54, 2.12.0)" (the id, its place, and that uma-rpg's Bastion uses `knights-bastion`);
   `scripts/pixel-art/README.md`: a short H54 section; the P-row in uma-platform's `docs/decisions.md`.

## Done when

- [ ] `pnpm art:draw` runs twice with byte-identical output, and `git status` is clean after the second run.
- [ ] The edge check, the old guards (`ui.test.ts`'s 2.6.0 guard, `rift.test.ts`, `racer.test.ts`, `lapidary.test.ts`,
  `battle.test.ts`) and the new `paladin.test.ts` pass; so do `pnpm lint && pnpm test && pnpm build`.
- [ ] Every 2.11.0 `ui` frame and `knights-bastion` are unchanged in place, metadata and pixels.
- [ ] The pull request shows `paladin-emblems-2x.png` with `-1x` beside it, and `paladin-bastion-2x.png`, inline.
- [ ] **No original-game content:** no emblem, crest, shield design or character copied from any game or franchise;
  nothing from the three enemy packs.
- [ ] uma-art 2.12.0 (or the next minor) is published: `gh api /user/packages/npm/uma-art/versions --jq '.[].name'`.

## Deliver

- **uma-platform:** a pull request on `feat/paladin-emblem`, titled `feat(art): the Paladin's class emblem (H54)`, with a
  **minor** changeset for `@luismlorenzana/uma-art`. Before merging: fetch `main`, rebase, `pnpm version-packages`. It
  merges after green CI and the push to `main` publishes the release (P42). Log the next free P-number (P69 if `main`
  still ends at P68), and add an H54 row under "Art authoring" in uma-platform's `docs/handoff/README.md`, Done with the
  merge commit and the version, as H38's row is.
- **uma-rpg:** a `docs(handoff): H54 done (uma-art 2.12.0)` commit (or pull request) that deletes this file and adds a
  Done row with the uma-platform merge commit and the published version. H59 pins the release.
- **Reply** with the PR link, the version and the 2× previews.
