# The continent map as a honeycomb

**Status:** a draft for the owner's review, 2026-11-03. Nothing is built. The preview is
[previews/honeycomb.html](previews/honeycomb.html): Continent 1's real 40 regions, 5 Springs and capital, with made-up
progress. Tap any hex.

## The owner's points

- The continent map is so poorly drawn that the List gets used instead: overhaul it, for every continent.
- More modern: a **honeycomb** of maps, each hex showing what it is.
- A claimed or completed map shows **the five Umas of the team that cleared it first**, so it's plain which are done.
- **Low levels on the outer rings, high levels in the inner ones, the capital in the middle.** Tapping the capital shows
  the latest parties that cleared it fully, and the rest, in the side panel.
- The MP **Springs** as hexes too, in set places.

## 1. The layout

A continent is 40 regions in 10 rows (rows 1–5 Lv 1–5, rows 6–10 Lv 6–10), five Springs (one every two rows) and the
capital (Lv 10). On a honeycomb they spiral in from the edge:

| From the centre | Hexes | What sits there |
|---|---|---|
| Centre | 1 | The **capital** |
| Ring 1 | 6 | Row 10 (its bosses come in twos, the hardest regions) and half of row 9 |
| Ring 2 | 12 | The rest of row 9, the Spring of rows 9–10, rows 8 and 7, the Spring of rows 7–8 |
| Ring 3 | 18 | Rows 6, 5, 4 and 3, with the Springs of rows 5–6 and 3–4 |
| Ring 4 (an arc at the bottom) | 9 | Rows 2 and 1 and the first Spring: where the continent starts |

So a ring is about two rows: Lv 6–10 fills the inner rings and the inside of ring 3, Lv 1–5 the outside, and each row
is one unbroken arc. Each Spring sits on the path between the two rows it serves. The partial outer ring gives the island
its coastline, with the way in at the bottom, as today's map has it.

## 2. A hex

- **What it is:** the biome's colour and a simple glyph, the region's name ("Meadow II") and its levels ("Lv 1–5"); row
  10's hexes carry ♛♛ for their double bosses.
- **Untouched:** muted, its progress empty.
- **Claimed** (a stage won, not its boss): its progress as an arc around the hex ("7/12"), and the **five who won its first
  stage**, small, on its top edge.
- **Completed** (its boss won): a gold rim and ✓, and the **five who first won its boss**, larger, on its top edge.
- **Completed before the record began:** a ✓ and no faces; the game never noted who it was.
- **A Spring:** water blue with a drop, "Spring", and "Ready" or its recharge ("1h 20m").
- **The capital:** gold, a castle, "Capital · Lv 10" and its runs ("2 runs won", or "Open run").

## 3. Tapping

The **side panel** (the quick look every Hub place has) shows the hex:
- **A region:** its levels and progress, its claim and its first clear with their faces and dates, its next stage, and
  **Enter**.
- **A Spring:** its charge, the rows it serves, and **Refill** for the active party.
- **The capital:** its open runs (each "Run 3 · 7/16" with its four parties), then **the last three won runs**, each with
  its date and its four parties' twenty faces, then **Open capital**.

## 4. Moving around

The map opens **fitted to the screen**, centred on the frontier (the lowest region not yet completed). Pinch or the
**− ⊙ +** buttons zoom; at the fitted size a hex is about 48 pt, the five faces dots; zoomed in, they're faces.
**Map / List** stays.

## 5. What it needs

- **A record of who claimed and cleared each region,** in each world: `regionTeams[regionId] = { claim: [five ids, the
  day], clear?: [five ids, the day] }`, written on a region's first stage win and its first boss win. One entry a region,
  200 a tier at most, so it can't grow the way the wins did (D292). A save bump (the next after capital runs').
- **Capital runs keep their last three wins** (`capitals[c].recent`), for the capital's panel: added to H160 now, so the
  honeycomb needs no second change to it.
- **The map is SVG**, not the pixel canvas: crisp at any zoom, every hex a real button with its label, the kit's tokens in
  light and dark. The biome colours exist already; the glyphs are simple vector marks. No art packet.
- **Unchanged:** the world view (five continents) and a region's own map of twelve stages.

## 6. Decisions to take

| Id | Call | Recommended |
|---|---|---|
| HM1 | The continent map becomes an SVG honeycomb; the List stays | Yes |
| HM2 | The capital at the centre; rows spiral in two to a ring, Lv 6–10 inside, Lv 1–5 outside, the way in at the bottom | Yes |
| HM3 | The five Springs as hexes, each between the two rows it serves | Yes |
| HM4 | Each hex: biome colour and glyph, name, levels, progress arc; ♛♛ on row 10 | Yes |
| HM5 | Claimed: the five who won its first stage, small; completed: the five who first won its boss, larger, gold rim and ✓ | Yes |
| HM6 | Regions completed before the record show ✓ with no faces | Yes |
| HM7 | `regionTeams` in each world, one entry a region | Yes |
| HM8 | Tapping opens the side panel: a region's teams and Enter, a Spring's Refill, the capital's open and last three won runs | Yes |
| HM9 | Opens fitted, centred on the frontier; pinch and − ⊙ + zoom | Yes |
| HM10 | The world view and the region view stay for now | Yes |
