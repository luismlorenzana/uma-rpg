# H141 — Art: five star crests and eight stat marks (uma-art 2.19.0)

**uma-platform · ChatGPT draws and publishes · S · Needs: nothing · Unblocks: H144 (pins it)**

> **Where this lives:** the work and its pull request are in **uma-platform**; the packet sits in uma-rpg's `docs/handoff/tasks/` because uma-rpg asks
> for the art, as H127 and H138 did.

## Why

The Stars tab's Extra Stats map is now a star chart ([the design](../../design/profile-polish/proposal.md)). The owner asked for "proper iconography": each of the five
bodies has a crest at its centre, and the six totals, the Details tiles and her moon's line have a mark per stat. They're vector stand-ins in the game today
(`apps/web/src/places/observatory/star-marks.tsx`); this packet draws the real ones. Lean assets: thirteen small icons on the existing kit, nothing else.

## Context (read first)

- **The design:** [proposal.md](../../design/profile-polish/proposal.md) §3 and PP30. **The [star chart page](../../design/profile-polish/previews/star-chart.html)** has a
  draft of all thirteen under "Iconography" and shows each one in place. The drafts fix the silhouettes; the pixel art is yours.
- **uma-platform's house style** (on `main`, `28e2edd`): `scripts/pixel-art/README.md` § "UI emblems and status badges", § "Classes v3 (H127)", § "Base class families (H138,
  2.18.0)"; `packages/art/README.md`, its `ui` atlas line.
- **The emblems** (`scripts/pixel-art/src/ui/`):
  - `spec.ts`: `FrameSpec`, `FRAME_SPECS`; the groups are `class`, `status`, `currency`, `tier`, `front`, `achievement`;
  - `atlas.ts` `packUi`: the sheet is **120×164**; published frames never move; the width stays 120 (H31's guard);
  - `ui/build.ts`, the preview cards; `ui/ui.test.ts`, the counts at 23–26, the 45 distinct icons at 38, the sheet's size at 55 and 69.
- **How uma-rpg draws them:** `apps/web/src/battle/pixel-icons.tsx`, `PixelIcon`: a frame at native size or a whole-number scale, null when missing.
- **Versions:** uma-art **2.18.0** on `main`; uma-platform's last decision is **P79**. H138's art commit `9dc40f3` is the model to follow.

## Decisions made

### The frames and where they go

**Two new groups, appended after the last of `FRAME_SPECS`. The sheet grows from 120×164 to 120×220.**

| Frames | Group, size | At |
|---|---|---|
| `star/planet`, `star/prowess`, `star/vigor`, `star/guard`, `star/template` | `star`, 24×24 | y = 164, x = 0, 24, 48, 72, 96 |
| `stat/hp`, `stat/mp`, `stat/atk`, `stat/matk`, `stat/def`, `stat/mdef`, `stat/evasion` | `stat`, 16×16 | y = 188, x = 0, 16 … 96 |
| `stat/limit` | `stat`, 16×16 | y = 204, x = 0 |

### The crests

Each on the night sky (`#101a24`), in its body's colour. They need to read at 24 px at a glance:

| Frame | Body | Motif | Colour |
|---|---|---|---|
| `star/planet` | Planet | A ringed planet, the ring tilted | Gold `#ffd84d` |
| `star/prowess` | Prowess, offense | An upright blade with a small spark at its upper right | Ember `#ff9a6b` |
| `star/vigor` | Vigor, HP and MP | A heart | Rose `#ff8fb6` |
| `star/guard` | Guard, DEF and M.DEF | A heater shield | Sky `#8fd3ff` |
| `star/template` | ★ Her moon | A crescent holding a small star | Orchid `#f0b8ff` |

### The stat marks

Each must read on **white and on `#17202b`**, at 16 px, with the house's 1 px outline, so they work on both panels and on the night sky.

| Frame | Stat | Motif | Colour |
|---|---|---|---|
| `stat/hp` | HP | A heart | Rose |
| `stat/mp` | MP | A drop | Blue |
| `stat/atk` | ATK | A diagonal sword | Ember |
| `stat/matk` | M.ATK | A four-point spark | Blue-violet |
| `stat/def` | DEF | A shield | Steel |
| `stat/mdef` | M.DEF | The same shield with a spark cut in it | Steel with a blue-violet spark |
| `stat/evasion` | Evasion | A wing | Sky |
| `stat/limit` | Limit start | A burst | Gold |

**No green** in any frame: the game keeps green for Ready.

## Do

1. **`spec.ts`:** add `STAR_BODIES`, `STAT_MARKS`, the two groups to `FrameSpec`, and the frames to `FRAME_SPECS`.
2. **Draw them** in a new `scripts/pixel-art/src/ui/stars.ts`, on the shared kit: the house's light from the top left and contact shadows where they fit.
3. **`atlas.ts`:** place the new groups; the sheet becomes 120×220. Nothing already published moves.
4. **The preview:** add `star-crests-{1x,2x,4x}.png`, the thirteen on white and `#17202b` chips, and the crests on `#101a24`.
5. **Guards:** update `ui.test.ts`'s counts (frames, distinct icons, 120×220) and add one proving every published frame's pixels are unchanged against a 2.18.0 baseline, as
   `paladin.test.ts` does.
6. **Docs:** `scripts/pixel-art/README.md` a section "Star crests and stat marks (H141, 2.19.0)"; `packages/art/README.md` the `ui` line.
7. **Version and publish** uma-art **2.19.0**; log the decision P80 in uma-platform.

## Done when

- [ ] uma-platform's checks pass; every published frame is byte-identical; the sheet is 120×220.
- [ ] The thirteen read at native size on white, on `#17202b` and, for the crests, on `#101a24`. Attach the preview.
- [ ] uma-art 2.19.0 is published. Confirm the release run.
- [ ] Nothing from the original games in git.

## Deliver

- **ChatGPT:** a branch and a pull request in uma-platform, "feat(art): star crests and stat marks (H141)". Merge it yourself, publish uma-art, and confirm the release.
- **Flag it done:** in uma-rpg, delete this file, add a Done row in [README.md](../README.md) with the art commit and the release, and set H144 to Ready. **H144 pins 2.19.0;** don't pin it here.
