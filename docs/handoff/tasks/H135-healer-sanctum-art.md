# H135 — Art (optional): the Healer Sanctum's building in uma-art

**uma-platform · ChatGPT · S · Needs: nothing · Optional (Halls v2's HV-F) · Unblocks: nothing: until it lands, the
Healer Sanctum wears the `knights-bastion` keep**

> **Where this lives:** the work and its pull request are in **uma-platform**; the packet sits in uma-rpg's
> `docs/handoff/tasks/` because uma-rpg asks for the art, as H38 and H73 did.

## Why

Halls v2 (D241) folds the Paladin Bastion and the Cleric Chapel into one hall, the **Healer Sanctum** (place
`healer-sanctum`, HV1, HV21), whose power comes from **a followed deity, called down once to strike**: Paladins answer to
the Archangel and the Archdemon, Clerics to the Seraph and the Thunder Fiend, one of each side for each order (§2.1). The
Learning page draws a 48 px building for every hall. Until the Sanctum has its own, it wears the `knights-bastion` keep
the Paladin Bastion wears today (HV21), which reads as a fort, not a temple. This packet draws **one building** and
nothing else (lean assets). It is optional: nothing waits for it.

## Context (read first)

- **The design** (uma-rpg, `docs/design/classes-v3/halls-v2.md`): §2.1 (the five halls, their lore and ids; the Sanctum
  in the middle of the Learning page, the Observatory under it), §4.5 (the four deities and their sides: angels bless,
  demons curse), HV21. The [halls page](../../design/classes-v3/previews/halls.html) draws the five halls' lore.
- **uma-platform's house style** (on `main`, `89e99e1`): `scripts/pixel-art/README.md` (the shared rules; § "The Rift
  (H38)" and § "Wilds trios (H113)", the last buildings appended); `packages/art/README.md` (the `buildings` atlas line,
  and § "Wilds trios (H113, 2.14.0)": read sizes from the JSON).
- **Buildings** (`scripts/pixel-art/src/buildings/`):
  - `kit.ts`: `SIZE` 48, `GROUND` 44 (the `anchorY`), `BASE`, `M`, `col`, `fill`, `wall`, `dome`, `slab`, `glow` (a
    painted halo; nothing but `smoke` animates);
  - `places.ts` 13: `PLACES`, append-only; `build.ts` 70–96: drawn six across in `PLACES` order, and **fails if any pixel
    touches the frame edge**; 195–212: H54's `paladin-bastion-2x.png` (three buildings at 2× on Learning ground), the
    model for this packet's preview;
  - `learning.ts`, the halls and their neighbours: `brawler-dojo` (56), `mage-tower` (99), `spell-blade-salle` (145),
    `cleric-chapel` (181–215: a small white chapel under a blue slate gable, a belfry with a gold bell, a rose window),
    `summoner-circle` (217: a rune ring on a round dais), `knights-bastion` (422–466: a square stone keep `#b4b0a6`,
    battlements, a blue banner `#3858b8` with a gold star `#e6b640`);
  - the model for one appended building and its guard: `rift.ts` with `src/rift.test.ts` (H38); the newest baseline,
    `legacy-h113-2.13.0.json` with `trios.test.ts`.
- **The sheet:** 50 frames, **288×432**. The 51st place lands at **(96, 384)**, the cell after `charm-forge`, so the
  sheet keeps its size. Guards that count buildings: `trios.test.ts` 42–45 (50 frames, 288×432, the trios last),
  `lapidary.test.ts` 13, `rift.test.ts` 35 and 55–57, `paladin.test.ts` 23–31.
- **How uma-rpg draws it:** uma-kit's Hub draws a building at 1.5 CSS px per art pixel; uma-rpg's `HubScreen.tsx` 126
  draws `place.frame ?? place.id`; `packages/domain/src/hub/places.ts` 183–205 (`learningPlaces`: today the Paladin
  Bastion carries `frame: 'knights-bastion'`; Halls v2's Learning page packet, H133, gives `healer-sanctum` the same
  frame until this lands).
- **Versions:** uma-art 2.15.0 on `main` (H127 takes 2.16.0 if it lands first); the last decision P75 (fetch first).

## Decisions made

- **One frame, `healer-sanctum`** (the place id uma-rpg uses, so no `frame` override is needed once it lands), name
  "Healer Sanctum", `page: 'learning'`, appended last in `PLACES` (after whatever the queue appended first): if it is
  place 51 it sits at **(96, 384)**, 48×48, `anchorY` 44, and the sheet stays 288×432. Its `at` on the art's own
  Learning mock is `{ x: 0.5, y: 0.3 }`, the free lot between the Spell Blade Salle and the Cleric Chapel (uma-rpg places
  it for real).
- **The motif: a small open temple to the gods the healers follow.**
  - **The temple:** white stone (about `#ece6da`, shading to the Bastion's `#b4b0a6`) on **three wide steps**, **four
    columns** under a **flat triangular pediment**, a dark open doorway between the middle columns. Wide and low with
    a triangular top: told apart from the Cleric Chapel's gable and belfry, the Bastion's battlements, the Mage Tower's
    height and the Summoner Circle's round dais.
  - **Its gods, one of each side:** a **gold sun disc** (`#e6b640`) in the pediment; at the foot of the steps **two
    braziers**, the left with a **gold flame** (`#f2c14e`, the Archangel and the Seraph) and the right with a **violet
    flame** (`#9a6ad8`, the Archdemon and the Thunder Fiend), each with a small painted `glow()` of its colour, alpha 70
    at most, kept 2 px or more from every edge.
  - **Static:** it returns no `smoke`. The same kit, light from the top left, 1 px outline, the contact shadow and the
    scale of the other halls.
- **Nothing else changes:** `knights-bastion` and `cleric-chapel` stay byte-identical (the Bastion keeps its frame for
  uma-rpg's older generations and as the fallback).
- **The release:** a **minor** (2.16.0, or the next one free). ChatGPT draws and merges; **Claude versions and publishes**
  (as H73), then adopts it in uma-rpg (below).
- **uma-rpg's adoption (Claude, after the release):** pin it, and point the Sanctum at its own frame: drop the
  `frame: 'knights-bastion'` override from the `healer-sanctum` place (wherever H133 put it), with a test that the place
  resolves to a `healer-sanctum` frame on the pinned buildings sheet. If H133 hasn't landed, leave a note on its row in
  uma-rpg's queue ("draw `healer-sanctum`, no override") and only pin. If engine v19 is already live (H134), the change is
  visible: say so for the owner's phone check.

## Do

1. **`src/buildings/sanctum.ts`** with `HEALER_SANCTUM` (a `Place`), appended to `PLACES` in `places.ts`.
2. **Guards:**
   - a new `src/testing/legacy-h135-<version>.json`, taken from the published files on `main` before your change: every
     `buildings` frame's metadata, the whole sheet's RGBA with the new cell zeroed (RGBA zero, checked when the
     baseline is taken), and per-frame RGBA for `knights-bastion` and `cleric-chapel`;
   - `src/sanctum.test.ts` (new): the old frames against it; the new frame at its id, place, size, page and `anchorY`;
     the painter draws the same pixels every time and matches the saved atlas; it touches no edge and returns no smoke;
     its opaque silhouette differs from each of `cleric-chapel`, `knights-bastion`, `summoner-circle`, `mage-tower`,
     `spell-blade-salle` and `brawler-dojo` in at least a quarter of their combined opaque pixels;
   - move the counting guards to 51 frames (`trios.test.ts`, `lapidary.test.ts`, `rift.test.ts`, `paladin.test.ts`; the
     trios checked by their slice 42–50, not as the sheet's last), never loosening a check on an old frame's place,
     metadata or pixels.
3. **Previews** (`pnpm art:draw`): `healer-sanctum-2x.png`, the Knight's Bastion, the Healer Sanctum and the Cleric Chapel
   side by side at 2× on Learning ground, laid out like `paladin-bastion-2x.png`; `buildings.png`,
   `buildings-contact-3x.png` and `buildings.html` gain the Sanctum. Every other existing preview stays byte-identical.
4. **Docs:** `packages/art/README.md`: 51 places on the `buildings` line and a short section "The Healer Sanctum (H135,
   <version>)" (the id, its place, that uma-rpg's Sanctum draws it and the Bastion keeps its keep);
   `scripts/pixel-art/README.md`: a short H135 section; the P-row in uma-platform's `docs/decisions.md` (the next free
   P; fetch first); an **H135** row under "Art authoring" in uma-platform's `docs/handoff/README.md` (State "Merged;
   Claude publishes").
5. **Claude, after the merge:** version and publish (P42), wait until `gh api /user/packages/npm/uma-art/versions --jq
   '.[].name'` lists it, set the H135 row Done; then uma-rpg's adoption as decided, with `pnpm lint && pnpm test &&
   pnpm build`.

## Done when

- [ ] `pnpm art:draw` runs twice with byte-identical output, and `git status` is clean after the second run.
- [ ] `sanctum.test.ts`, the moved counting guards, every other guard and the edge check pass; so do `pnpm lint && pnpm
  test && pnpm build` in uma-platform.
- [ ] Every published `buildings` frame keeps its place, metadata and pixels; the sheet is 288×432 with 51 frames (or
  its size with what the queue appended first, read from the JSON).
- [ ] The pull request shows `healer-sanctum-2x.png` inline.
- [ ] **No original-game content:** no temple, deity, angel or demon design copied from any game or franchise; nothing
  from the three enemy packs.
- [ ] The release is published; uma-rpg pins it (and, if H133 has landed, draws the Sanctum's own frame) with its checks
  green and deployed (`gh run watch <id> -R luismlorenzana/uma-rpg --exit-status`).

## Deliver

- **uma-platform (ChatGPT):** a pull request on `feat/h135-healer-sanctum`, titled `feat(art): the Healer Sanctum
  (H135)`, with a **minor** changeset for `@luismlorenzana/uma-art`. Before merging, fetch `main` and rebase. Merge it
  after green CI. Reply with the PR link and `healer-sanctum-2x.png`.
- **uma-platform (Claude):** the version commit and the release; the H135 row Done.
- **uma-rpg (Claude):** one commit to `main`, `feat(web): pin uma-art <version>, the Healer Sanctum's own building (H135)`
  (a pull request if a delegated agent does it), that also deletes this packet and adds an H135 Done row to
  `docs/handoff/README.md` with the uma-platform merge commit and the version.

## Publishing (the owner, 2026-10-29: supersedes every "Claude publishes" line above)

Art is ChatGPT's end to end. **ChatGPT draws, merges, versions and publishes** the uma-art release itself (uma-platform's
release workflow, P42), confirms it with `gh api /user/packages/npm/uma-art/versions --jq '.[].name'`, and sets this
packet's row to Done in uma-rpg's `docs/handoff/README.md` with the merge commit and the version. Claude does none of it.
**The uma-rpg pin** moves to the packet that first uses the art: H133 (the Halls pages) pins it and draws the Sanctum's own frame if it is out by then; otherwise the first later uma-rpg packet does, and until then the Sanctum wears the `knights-bastion` frame.

