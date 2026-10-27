# H113 — Art: the Wilds' trios, five workbenches and three restyled forges

**ChatGPT · uma-platform · M · Needs: nothing · Unblocks: H114 (pins the release and places the buildings)**

## Why

uma-rpg's farm by line (its D224) gives every trade three steps: gather, process, make. The owner wants each step in its
own building: **fifteen places, five rows of three**, connected by roads (uma-rpg D230,
[farm-by-line.md](../../design/tier-rework/farm-by-line.md) §11, FL25–FL33). Each row is one line:

| Row | 1 · Gather (art unchanged) | 2 · Process (**new art**) | 3 · Make |
|---|---|---|---|
| Metal | Mine (`mine`) | **Mine Workbench** (`mine-workbench`) | **Weapon Forge** (`weapon-forge`, **restyled** from `forge`) |
| Vegetables | Fields (`vegetable-garden`) | **Fields Workbench** (`fields-workbench`) | **Tome Forge** (`tome-forge`, **restyled** from `workbench`) |
| Wood | Forest (`forest`) | **Forest Workbench** (`forest-workbench`) | Armorer (`lancers-barracks`, unchanged) |
| Fish | Fishery (`fishery`) | **Fishery Workbench** (`fishery-workbench`) | **Charm Forge** (`charm-forge`, **restyled** from `arcane-armory`) |
| Stone | Monster Den (`monster-den`) | **Den Workbench** (`den-workbench`) | Lapidary (`lapidary`, unchanged) |

So uma-art needs **eight new building frames**: five workbenches and three restyled making places. Everything else on
the map keeps its art. The old `forge`, `workbench` and `arcane-armory` frames stay in the atlas: other pages or games
may draw them, and the atlas is append-only.

## Context

- **The design:** uma-rpg `docs/design/tier-rework/farm-by-line.md` §1 (what each line gathers, processes and makes) and
  §11 (the trios, FL25–FL33). Recipes, times and names are game rules and stay in uma-rpg; they only tell you what each
  building does.
- **uma-platform's house style:** `scripts/pixel-art/README.md` (light from the top left, a 1 px selective outline, a
  soft contact shadow, the Wilds' palette: natural stone and timber, darker and rougher than the Farmlands);
  `packages/art/README.md` (the `buildings` atlas and its JSON).
- **The buildings atlas and its builder:** `scripts/pixel-art/src/buildings/build.ts`:
  - 48×48 sprites, six across (`COLUMNS = 6`), each painter given a `Sprite` with a contact shadow;
  - nothing may touch a frame's edge rows or columns (the builder fails on it);
  - `PaintExtras` such as `smoke` (`{ x, y }`, where uma-kit puffs chimney smoke);
  - one mock page per Hub page in the preview (`assets/previews/buildings.{png,html}`).
- **The painters to learn from:**
  - `src/buildings/lapidary.ts` and `lapidary.test.ts` (H29): **the model for an appended Wilds workshop**, with its
    legacy guard;
  - `src/buildings/wilds.ts`: the Mine (timbered adit, ore cart, lantern), the Forest (pines, cut logs, an axe in a stump),
    the Monster Den, the old `workbench` and `forge` painters, and the shared helpers (`block`, `tuft`, `bone`);
  - `src/buildings/kit.ts` (`SIZE`, `BASE`, `GROUND`);
  - `src/buildings/places.ts`: the `PLACES` list, whose order is the atlas order.
- **The guards:** `src/testing/atlas.ts` (`savedAtlas`, `hash`); `src/buildings/legacy-2.7.0.json` with
  `lapidary.test.ts` (the old frames' metadata and RGBA hashes, the appended frame at an exact place, painter
  determinism, nothing on the edge). Today the atlas is **288×336 with 42 frames** (the Lapidary at (192, 288), the Rift
  at (240, 288)).
- **How uma-rpg reads it:** a place draws the frame named by its id, or by `Place.frame` (uma-rpg
  `packages/domain/src/hub/places.ts`); uma-kit's Hub map anchors every building at its ground line (`anchorY` 44) on a
  16 px tile grid (`packages/kit/src/hub/grid.ts`, `terrain.ts`).
- **Versions:** uma-art **2.13.0** on `main` and pinned in uma-rpg. This packet makes **2.14.0** (or the next minor if
  another packet took it).

## Decisions made

- **Where:** the `buildings` atlas, eight frames appended after the Rift. The sheet grows from **288×336 to 288×432**,
  **42 → 50 frames**:

  | Index | x, y | Frame id | Name |
  |---|---|---|---|
  | 42 | 0, 336 | `mine-workbench` | Mine Workbench |
  | 43 | 48, 336 | `fields-workbench` | Fields Workbench |
  | 44 | 96, 336 | `forest-workbench` | Forest Workbench |
  | 45 | 144, 336 | `fishery-workbench` | Fishery Workbench |
  | 46 | 192, 336 | `den-workbench` | Den Workbench |
  | 47 | 240, 336 | `weapon-forge` | Weapon Forge |
  | 48 | 0, 384 | `tome-forge` | Tome Forge |
  | 49 | 48, 384 | `charm-forge` | Charm Forge |

- **Metadata:** as the Lapidary's, `{ x, y, w: 48, h: 48, page: 'wilds', anchorY: GROUND }`, plus `smoke` where a building
  has a chimney (the Mine Workbench, the Weapon Forge, the Tome Forge, the Charm Forge).
- **The five workbenches read as one family** (the middle column of the map, all processing), each told apart by its
  line's props and an awning colour:
  - **The shared silhouette:** an open-fronted timber work shed under a pitched shingle roof, a sturdy plank bench across
    its front, a small hanging sign over the opening. Slightly smaller and lower than the making places, so the eye reads
    left to right: site, shed, workshop.
  - **Mine Workbench** (smelting ore into ingots): a squat stone smelter beside the shed with a glowing orange mouth and a
    chimney, a crucible on the bench, a stack of bright ingots, soot-grey awning.
  - **Fields Workbench** (prepping vegetables): a chopping board with a cleaver, baskets of carrots and cabbage, a pot on
    a small fire, bunches hanging from the eaves, leaf-green awning.
  - **Forest Workbench** (sawing logs into planks): a sawhorse with a log half cut and a saw in it, a neat stack of planks,
    a drift of sawdust, tan awning.
  - **Fishery Workbench** (filleting fish): a cleaning table with a knife and a fish, fillets drying on a rack, a salt
    barrel and a coiled net, sea-blue awning.
  - **Den Workbench** (cutting stones): a grindstone wheel on a wooden frame, a crate of rough stones and a few cut ones
    glinting on the bench, violet awning.
- **The three restyled making places** (they only make now, and each is named for what it makes):
  - **Weapon Forge** (Arms Gems): a larger smithy than the old Forge, a stone hearth with a red-orange glow and a tall
    chimney, an anvil out front and **a weapon rack** with a sword, an axe and a lance, so it can't be mistaken for the
    old Forge.
  - **Tome Forge** (Tome Ink): an arcane workshop, a stone building with a peaked slate roof, a violet-glowing kiln, a
    lectern with an open book under the window, ink bottles on the sill, a few floating rune sparks.
  - **Charm Forge** (Accessory Settings): a small jeweller's kiln of brick with a warm gold glow, charms and amulets
    hanging on a rail across the front, a little anvil. Not the Lapidary (gems on a cutting wheel) and not the old Charm
    Shop.
- **Readable small:** each frame reads at the map's size (1.5 CSS px an art pixel) on the Wilds' ground; the workbenches
  must read as related at a glance and each of the eight as different from its row's neighbours.
- **Append only, with a guard:** a new `src/buildings/legacy-h113-2.13.0.json` taken from the 2.13.0 files on `main`
  **before** your change (all 42 frames' metadata and RGBA hashes, the sheet's size); a new `trios.test.ts` in the
  model of `lapidary.test.ts` (the old frames untouched, the eight at their exact places and metadata, painter
  determinism, nothing on the edge, each new frame different from `workbench`, `forge` and `arcane-armory`).
  `lapidary.test.ts`' frame count moves to 50 (never loosen a check on an old frame).
- **The preview's Wilds mock page** shows the fifteen buildings in five rows of three, in the order above, so the owner
  can review the map before H114 builds it.
- **Release:** a minor, uma-art **2.14.0**. Per uma-rpg's CLAUDE.md, ChatGPT may merge its own pull request, and **Claude
  versions and publishes the uma-art release** from `main`. Say in the pull request that the release is due.

## Do

1. Read the context; take the legacy JSON from `main`'s 2.13.0 files first.
2. Paint the eight buildings (`src/buildings/trios.ts`), append them to `PLACES` in the order above, and add `smoke`
   where listed.
3. Write `trios.test.ts` and move `lapidary.test.ts`' count.
4. Build the atlas and the previews (`pnpm --filter @uma-platform/pixel-art exec tsx src/buildings/build.ts`), and
   update the art README's buildings section.
5. Look at the preview's 3× contact sheet and the Wilds mock page; attach both to the pull request.

## Done when

- [ ] The atlas is 288×432 with 50 frames; the 42 old frames are byte-identical (the guard passes).
- [ ] The repo's checks pass (`pnpm test`, and `pnpm lint` where it applies).
- [ ] The pull request shows the contact sheet and the 15-building Wilds mock page.
- [ ] Nothing from the original games in git.

## Deliver

- A pull request in **uma-platform** from `art/h113-wilds-trios`, one commit:
  `feat(art): the Wilds' trios, five workbenches and three restyled forges (H113)`.
- **ChatGPT merges it itself** once its checks pass; **Claude versions and publishes uma-art 2.14.0**, then H114 pins it.
- **Flag it done in uma-rpg:** a `docs(handoff): H113 done (D…)` commit deletes this file and adds a Done row to
  `docs/handoff/README.md`; fetch uma-rpg's `main` first so the D-number doesn't collide.
