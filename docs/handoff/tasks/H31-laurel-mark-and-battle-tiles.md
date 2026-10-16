# H31 — Art for the sibling apps' Phase A: a Laurel mark and a Battle tile page

**Priority: now · ChatGPT · uma-platform · S–M.** Ready. Claude publishes the release and wires it.

## Why

Phase A of the [sibling apps plan](https://github.com/luismlorenzana/uma-platform/blob/main/docs/sibling/hub-rework.md#a5-art)
(platform P48) gives both games one top bar and five Hub tabs.
- **The top bar** shows three currency chips with uma-art marks. uma-racer has its three (A02, P46): `prize-money`,
  `speed-ticket` and `uma-ticket`. uma-rpg's main currency, **Laurels**, has no mark yet.
- **uma-rpg gets a Battle page**, the raised centre tab: Scenario Gate and Tier Finale. It needs ground of its own.

## Context

- uma-art's `ui` atlas and A02's marks: `scripts/pixel-art/src/ticket.ts` and the `currency/*` frames (16 px). The
  marks are drawn so that a HUD mark and an item share a painter.
- The tiles atlas: `tiles/atlas.{png,json}`, 16 px. Each page has `<page>/ground-0..3`, `<page>/path-<0..15>` (N E S W
  bit masks) and props. Pages today: farmlands, wilds, learning, town, racing (A01 added `racing`).
- How the Hub lays tiles out: uma-rpg `apps/web/src/hub/scene/terrain.ts`, with props as `{ id, tall }`.
- Laurel's colour in uma-rpg's theme: `--color-laurel` `#8fd18a`. The SVG today is `apps/web/src/ui/icons.tsx`
  `LaurelIcon`, a laurel wreath.

## Do

1. **`currency/laurel`:** a 16 px mark in the `ui` atlas, a green laurel wreath. Make it read beside
   `currency/prize-money` at 1× on a light chip and on a dark one, the same way A02's marks do.
2. **A `battle` tile page** in the tiles atlas:
   - `ground-0..3`: packed earth and trampled grass, drill-ground colours that work under uma-rpg's dark and light
     themes.
   - `path-0..15`: a flagstone road, in the same mask scheme as the other pages.
   - Props: `banner` (tall), `weapon-rack`, `training-dummy` (tall), `torch` (tall), `crate`, `shield-stand`.
3. **Append only:**
   - Every published frame keeps its place; the legacy pixel guards pass.
   - A **minor** changeset, uma-art 2.9.0.

## Done when

- `pnpm art:draw` reproduces every PNG byte for byte, and `pnpm lint && pnpm test && pnpm build` pass.
- The PR has a 2× preview sheet: the new mark beside the three racer marks on a light and a dark chip, and a sample
  Battle page laid out with the props.
- No original-game content.

## Deliver

- **uma-platform:** a pull request on `feat/laurel-mark-and-battle-tiles`, titled
  `feat(art): a Laurel mark and the Battle tile page (H31)`, with a minor changeset. It merges itself after green CI,
  logs the next free P-number (fetch `main` first) and publishes per P42.
- **uma-rpg:** nothing to wire. Claude pins 2.9.0 as part of Phase A. Delete this packet and update the handoff README
  in uma-rpg once the release is out.
