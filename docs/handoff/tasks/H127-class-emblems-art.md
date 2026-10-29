# H127 — Art: seven class emblems for Classes v3 (uma-art 2.16.0)

**uma-platform · ChatGPT draws, Claude publishes and pins · S · Needs: nothing · Unblocks: H120 (the Class tab's tree draws
the emblems), H134 (checks the pin)**

> **Where this lives:** the work and its pull request are in **uma-platform**; the packet sits in uma-rpg's
> `docs/handoff/tasks/` because uma-rpg asks for the art, as H54 and H73 did.

## Why

Classes v3 (D240) turns six classes into thirteen: **five Tier 0 classes** (Recruit, Duelist, Acolyte, Caller,
Apprentice) and **eight Tier 1 classes**, two of them new (**Tome Spellblade**, **Arms Summoner**). The game draws a 24 px
emblem beside every class name (the Stable, the profile's class tile and its new class tree, the party bar, the Rift's
slots). uma-art has six emblems; uma-rpg's `PixelIcon` draws nothing for a missing frame, so the seven new classes would
show no emblem. The design asks for exactly seven emblems and nothing else (CV33). Lean assets: the cheapest emblems that
read, on the existing kit.

The three renamed classes keep their frames, since their ids stay (CV4): the Sorcerer draws `class/mage`, the Arms
Spellblade `class/spellblade`, the Tome Summoner `class/summoner`.

## Context (read first)

- **The design** (uma-rpg, `docs/design/classes-v3/classes-v3.md`): §0 (the thirteen, by root, with their ids), §1 (the
  tree: three columns, Warrior · All-Rounder · Mage, Tier 0 above Tier 1), §2.1 (the Tier 0 names), §14.5's "Class
  emblems" row and **CV33** ("the Tier 0s as plain, outlined forms of their family's shape; the two new hybrids as their
  mirror's emblem in the other channel's colour"). The [class tree page](../../design/classes-v3/previews/class-tree.html)
  shows where each emblem sits.
- **uma-platform's house style** (on `main`, `89e99e1`): `scripts/pixel-art/README.md` § "UI emblems and status badges"
  (205–210) and § "The Paladin (H54)" (131–140); `packages/art/README.md` 23–31 (the `ui` atlas line) and § "The Paladin
  (H54, 2.12.0)" (215–230).
- **The emblems** (`scripts/pixel-art/src/ui/`):
  - `spec.ts`: `CLASSES` (2, the five that place the y = 0 row by index), `Class` (5, the five plus `'paladin'`), the
    `FrameSpec` union (19–24), `FRAME_SPECS` (25–34, `class/paladin` last at 33);
  - `classes.ts` 7–64, `classEmblem`: one branch a class on a shared kit (steel `#cadde8`, gold `#d9b96b`, wood
    `#8c674c`; the dome shading; light from the top left; the contact shadow `{ cx: 12, cy: 22, rx: 8, ry: 1, alpha: 62 }`).
    Spell Blade (27–33): a violet rune ring (`#a28ac8`) with four marks behind a diagonal steel sword, gold guard, wood
    grip, a violet halo (`#c4b1ef`). Summoner (the last branch): a pale spirit (`#b6d2ea`, eyes `#58628b`) over a teal rune
    ellipse (`#70b6b5`) with three marks and a pale halo (`#c7e7f3`). The Brawler's crossed axe and greatsword, the Mage's
    open book with a gold star, the Cleric's small heater shield under a halo, the Paladin's tall tower shield (H54);
  - `atlas.ts` 46–64, `packUi`: the sheet is **120×140**; the Paladin sits off the class row at **(24, 116)**, beside
    `achievement/crossover` (0, 116); **(48, 116), (72, 116) and (96, 116) are empty**;
  - `ui/build.ts` 68–77 (`paladin-emblems-{1x,2x,4x}.png`, the six on white and `#17202b` chips) and 94 (`ui.html`);
  - the guards: `ui/ui.test.ts` (17–26 the counts, 37–43 the 38 distinct icons and their corners, 53–72 the sheet's
    120×140, the y-by-group check and the saved JSON), `src/paladin.test.ts` (H54's: the 2.11.0 sheet against its
    baseline, `FRAME_SPECS.at(-1)`, 38 frames, the silhouette check), `src/rift.test.ts` 89–90 (the `ui` sheet 120×140 and
    38 frames), `src/testing/atlas.ts` (`savedAtlas`, `hash`) and `src/testing/legacy-h54-2.11.0.json` (the model for a
    new baseline).
- **How uma-rpg draws them:** `apps/web/src/battle/pixel-icons.tsx` 11–24 (`PixelIcon` reads the atlas JSON, draws at
  native size or a whole-number scale, returns null for a missing frame; `ClassEmblem` draws `class/<classId>`), and
  `pixel-icons.test.tsx` 15–30 and 61–73 (the six on the pinned sheet).
- **Versions:** uma-art **2.15.0** on uma-platform's `main` (P75); uma-rpg pins 2.15.0 (`apps/web/package.json` 15).
  uma-platform's last decision is **P75**. How H54 shipped: `git -C ../uma-platform show --stat 6fb19db` (the art) and
  `8c5c359` (the merge).

## Decisions made

### The frames and where they go

**Seven 24×24 frames in the `class` group, appended after `class/paladin` in `FRAME_SPECS`, in this order:**

| Frame (uma-rpg's id) | Class | At |
|---|---|---|
| `class/tomeblade` | Tome Spellblade | (48, 116) |
| `class/armsummoner` | Arms Summoner | (72, 116) |
| `class/recruit` | Recruit | (0, 140) |
| `class/duelist` | Duelist | (24, 140) |
| `class/acolyte` | Acolyte | (48, 140) |
| `class/caller` | Caller | (72, 140) |
| `class/apprentice` | Apprentice | (96, 140) |

- **The sheet grows from 120×140 to 120×164.** The width stays 120 (H31's guard); published frames never move. The two
  hybrids fill the free cells beside the Paladin (the Tier 1 classes stay together); the five Tier 0s take a new row at
  y = 140 **in the tree's left-to-right order** (Warrior's Recruit; the All-Rounder's Duelist, Acolyte, Caller; the Mage's
  Apprentice), so the row reads like the tree's top. (96, 116) stays empty.
- **`spec.ts`:** `CLASSES` keeps its five (they place the y = 0 row). Add `TIER0 = ['recruit', 'duelist', 'acolyte',
  'caller', 'apprentice'] as const` (it places the y = 140 row by index) and `HYBRIDS = ['tomeblade', 'armsummoner'] as
  const`; `Class` becomes the five, `'paladin'`, the two hybrids and the five Tier 0s.

### The motifs (CV33, read as below)

**The two new hybrids: their mirror's emblem, flipped left to right, in the other channel's colours.** The mirror is the
class with the same two halves led the other way. The flip gives each its own lean; the colours say which channel leads.

| Frame | Its mirror's emblem | Flipped | Recoloured |
|---|---|---|---|
| `class/tomeblade` | The Spell Blade's (`spellblade` branch) | The sword runs from the bottom right to the top left through the ring | **The blade in the ring's violet** (`#a28ac8`, her lift and drop); **the ring and its four marks in the blade's steel** (`#cadde8`). Guard gold and grip wood as hers; her violet halo kept (a magic-led class) |
| `class/armsummoner` | The Summoner's (`summoner` branch) | The spirit leans the other way | **The spirit in the emblems' steel** (`#cadde8`), its eyes dark wood (`#5b4334`); **the rune ellipse and its three marks in gold** (`#d9b96b`); a warm halo (`#ead9a6`) in place of the pale one |

**The five Tier 0s: plain, outlined forms of their family's shape.** Each is **one element of its family's emblem**,
alone and simplified. *Plain:* the beginner's tones only, unpolished iron (`#9aa3a8`, lift 0.35), the kit's wood
(`#8c674c`) and parchment (`#e5ddc5`): **no gold, no glow, no halo, no rune marks**. *Outlined:* the house's 1 px outline
all round, and the inside of any face larger than 5×5 px **left hollow** (transparent), so a Tier 0 reads as a sketch of
the class it becomes.

| Frame | Family emblem it comes from | The motif |
|---|---|---|
| `class/recruit` | The Brawler's (crossed axe and greatsword) | **The axe alone, upright:** a wood haft from the foot to the top, an iron head on its upper left, the head's face hollow |
| `class/duelist` | The Spell Blade's (sword in a rune ring) | **The sword alone, upright and slim:** a thin vertical iron blade, point up, a small round iron guard, a wood grip. No ring |
| `class/acolyte` | The Cleric's (heater shield under a halo) | **The heater shield alone:** an iron rim, the face hollow, a wood boss. No cross, no halo; smaller and plainer than the Paladin's tower shield |
| `class/caller` | The Summoner's (spirit over a rune ellipse) | **The ellipse alone,** an iron ring, hollow, with one small parchment wisp (about 3×4 px) rising from its centre. No spirit, no marks |
| `class/apprentice` | The Mage's (open book, gold star) | **The book closed and standing:** a wood cover, its panel hollow inside a 2 px border, a parchment page edge on the right, an iron clasp. No star |

- Same kit as the six: light from the top left, the outline, the contact shadow above, the four corner pixels
  transparent. Each reads at 1× on a white chip and on a `#17202b` chip.
- **Told apart:** every Tier 0 by silhouette from all twelve other emblems; each hybrid by colour from its mirror (its
  silhouette is the mirror's flipped) and by silhouette from the rest.

### Guards, release and adoption

- **Append only:** a new `src/testing/legacy-h127-2.15.0.json`, taken from the 2.15.0 files on `main` before your change,
  freezes every `ui` frame's metadata and the whole 2.15.0 `ui` sheet's RGBA (0, 0, 120, 140; the two cells the hybrids
  take were RGBA zero, checked when the baseline is taken).
- **Who:** the design's build plan named a Claude uma-platform session (CV-F); **ChatGPT draws and merges, Claude
  versions and publishes**, as H73 did (the owner's split: ChatGPT authors art, Claude publishes uma-art releases).
- **The release:** a **minor**, uma-art **2.16.0** (or the next minor if another packet took it).
- **uma-rpg pins it in this packet** (Claude, after the release is listed): the pin carries no behaviour, since a frame
  the game doesn't ask for is never drawn and the seven classes stay dark until H134, so it can land before or after
  H126 (which runs beside this packet and draws the seven as their model's emblem until the art exists). H120 and H134
  then find the emblems already pinned. If another packet has pinned 2.16.0 or later first, skip the pin and keep the
  test.

## Do

1. **`ui/spec.ts`:** `TIER0`, `HYBRIDS` and the wider `Class` as decided; append the seven specs to `FRAME_SPECS` after
   `class/paladin`, in the table's order.
2. **`ui/classes.ts`:** the seven branches as decided. Share helpers with the branches they come from (a flipped Spell
   Blade, a flipped Summoner) rather than copying them; the Spell Blade's, the Summoner's and every other existing
   branch must draw the same pixels as before.
3. **`ui/atlas.ts`:** `packUi` places the hybrids at (48, 116) and (72, 116) and the Tier 0s at `TIER0.indexOf(key) ×
   24`, y 140; the sheet is 120×164; the comment says why.
4. **Guards:**
   - `src/classes-v3.test.ts` (new): every 2.15.0 frame against the baseline (its metadata, and the 120×140 crop's RGBA
     with the hybrids' two cells zeroed); the seven at their id, place, size and group; the painter draws the same
     pixels every time and they match the saved atlas; transparent corners; **each Tier 0's opaque silhouette differs
     from each of the twelve other class emblems' in at least a quarter of their combined opaque pixels**; **each
     hybrid's** differs so from every emblem but its mirror, its silhouette matches its mirror's flipped left to right
     in at least 90% of their combined opaque pixels, and at least 60% of its opaque pixels differ from the flipped
     mirror's by a summed |ΔRGB| of 60 or more.
   - Move the old guards to the new totals, never loosening a check on an old frame's place, metadata or pixels:
     `ui.test.ts` (the sheet 120×164, frames 38 → 45, 24×24 frames 17 → 24, distinct icons 38 → 45, the id list, the
     y-by-group check allowing the class frames at y 116 and 140); `paladin.test.ts` (compare the 2.11.0 region by its
     crop rather than the whole sheet's size; find `class/paladin` by id rather than `at(-1)`; 45 frames); `rift.test.ts`
     89–90 (120×164, 45 frames, its 2.10.0 region by crop as it already does).
5. **Previews** (`pnpm art:draw`; original art, safe in git):
   - `classes-v3-emblems-1x.png`, `-2x`, `-4x`: the thirteen in the tree's order, the Tier 0 row (Recruit, Duelist,
     Acolyte, Caller, Apprentice) over the Tier 1 row (Brawler; Arms Spellblade, Tome Spellblade, Paladin, Cleric, Arms
     Summoner, Tome Summoner; Sorcerer as `class/mage`), on a white chip row and a `#17202b` chip row, laid out like
     `paladin-emblems-*`;
   - `ui.html` gains a "Classes v3" section with a label for each new key (the display names above). Every other
     existing preview stays byte-identical.
6. **Docs:** `packages/art/README.md`: "thirteen class emblems" on the `ui` line, the new keys in its class list, and a
   short section "Classes v3 (H127, 2.16.0)": the ids, their places, the sheet's new height, and that uma-rpg's Sorcerer,
   Arms Spellblade and Tome Summoner keep `class/mage`, `class/spellblade` and `class/summoner`;
   `scripts/pixel-art/README.md`: a short H127 section; the P-row in uma-platform's `docs/decisions.md` (P76 if `main`
   still ends at P75; fetch first); an **H127** row under "Art authoring" in uma-platform's `docs/handoff/README.md`
   (State "Merged; Claude publishes", as H73's was).
7. **Claude, after the merge:** `pnpm version-packages` on uma-platform's `main` (2.16.0 or the next minor), let the
   release workflow publish (P42), wait until `gh api /user/packages/npm/uma-art/versions --jq '.[].name'` lists it, set
   the H127 row there to Done with the merge commit and the version. Then in **uma-rpg:**
   - `apps/web/package.json`: `@luismlorenzana/uma-art` 2.16.0, with the lockfile (`NODE_AUTH_TOKEN=$(gh auth token)
     pnpm install`);
   - `apps/web/src/battle/pixel-icons.tsx`: if H126 has landed, remove its `ClassEmblem` fallback (the seven drawn as
     their model's emblem until this art exists); each now draws its own frame;
   - `apps/web/src/battle/pixel-icons.test.tsx`: a test that the seven `class/<id>` frames are on the pinned sheet at
     24×24 and `ClassEmblem` draws each at its own JSON position (before H126 the ids aren't `RpgClass` yet: cast in the
     test);
   - `pnpm lint && pnpm test && pnpm build`.

## Done when

- [ ] `pnpm art:draw` runs twice with byte-identical output, and `git status` is clean after the second run.
- [ ] `classes-v3.test.ts`, the moved `ui.test.ts`, `paladin.test.ts` and `rift.test.ts`, every other guard and the edge
  check pass; so do `pnpm lint && pnpm test && pnpm build` in uma-platform.
- [ ] Every 2.15.0 `ui` frame keeps its place, metadata and pixels; the sheet is 120×164 with 45 frames.
- [ ] The pull request shows `classes-v3-emblems-2x.png` with `classes-v3-emblems-1x.png` beside it, inline, so the 1×
  reading can be judged on white and on dark.
- [ ] **No original-game content:** no emblem, crest, weapon or character design copied from any game or franchise;
  nothing from the three enemy packs.
- [ ] uma-art 2.16.0 (or the next minor) is published; uma-rpg pins it with its test green and `pnpm lint && pnpm test
  && pnpm build` passing (main JS unchanged: the art is a CSS background).

## Deliver

- **uma-platform (ChatGPT):** a pull request on `feat/h127-class-emblems`, titled `feat(art): seven class emblems for
  Classes v3 (H127)`, with a **minor** changeset for `@luismlorenzana/uma-art`. Before merging, fetch `main` and rebase.
  Merge it after green CI (ChatGPT merges its own). Reply with the PR link and `classes-v3-emblems-2x.png`.
- **uma-platform (Claude):** the version commit and the release, as Do 7; the H127 row Done there.
- **uma-rpg (Claude):** one commit to `main`, `feat(web): pin uma-art 2.16.0, the seven class emblems (H127)` (a pull
  request if a delegated agent does it), that also deletes this packet and adds an H127 Done row to
  `docs/handoff/README.md` with the uma-platform merge commit and the published version; set H120 Ready there if its
  other needs are done. Watch the deploy (`gh run watch <id> -R luismlorenzana/uma-rpg --exit-status`).
