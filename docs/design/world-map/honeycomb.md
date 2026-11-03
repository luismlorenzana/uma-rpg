# The continent map as a honeycomb

**Status:** a draft for the owner's review, second pass 2026-11-03. Nothing is built. The preview is
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

Second pass, from the owner's notes on the first (2026-11-03): only Lv 1–5 on the edge, only Lv 6–10 inside, the Springs
at symmetrical points, the faces larger and on the hex.

A continent is 40 regions in 10 rows (rows 1–5 Lv 1–5, rows 6–10 Lv 6–10) and the capital (Lv 10). On a honeycomb of four
rings round the centre:

| From the centre | Hexes | What sits there |
|---|---|---|
| Centre and ring 1 | 7 | The **capital and its city**: one tap target, the capital drawn large |
| Ring 2 | 12 | Rows 10 (its bosses come in twos), 9 and 8: Lv 6–10 |
| Ring 3 | 18 | The **six Springs** on its six corners; rows 7 and 6 on its four slanted sides (Lv 6–10); open ground on its top and bottom sides |
| Ring 4, the shore | 24 | Rows 1–5 (Lv 1–5), from the bottom round; open ground on its four diagonal corners |

- **The bands are clean:** no Lv 6–10 region touches the shore and no Lv 1–5 region sits inside it.
- **Six Springs, not five,** one on each corner of the ring between the bands: the honeycomb's six symmetrical points, each
  a step from the shore and a step from the core. **Each region refills at its nearest Spring**, so each serves the six or
  seven regions round it.
- **Open ground** (eight plain hexes) fills what 40 regions leave, two-fold symmetric, so both bands stay whole and the
  honeycomb stays a hexagon.

## 2. A hex

- **What it is:** the biome's colour and a simple glyph, the region's name ("Meadow II") and its levels ("Lv 1–5"); row
  10's hexes carry ♛♛ for their double bosses.
- **Untouched:** muted, its progress empty.
- **Claimed** (a stage won, not its boss): its progress as an arc around the hex ("7/12"), and the **five who won its first
  stage**, small, across the hex.
- **Completed** (its boss won): a gold rim and ✓, and the **five who first won its boss**, large across the middle of the
  hex, each in a gold ring; the glyph moves up and the name down to make room.
- **Completed before the record began:** a ✓ and no faces; the game never noted who it was.
- **A Spring:** water blue with a drop, "Spring", and "Ready" or its recharge ("1h 20m").
- **The capital:** gold, a castle, "Capital · Lv 10" and its runs ("2 runs won", or "Open run").

## 3. Tapping

The **side panel** (the quick look every Hub place has) shows the hex:
- **A region:** its levels and progress, its claim and its first clear with their faces and dates, its next stage, and
  **Enter**.
- **A Spring:** its charge, the regions that refill there, and **Refill** for the active party.
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
- **Six Springs a continent** (today five, one every two rows): `WORLD_SPRINGS` becomes 6, each region's Spring is its
  nearest on the honeycomb, and a world's Spring record gains the sixth; a region's header shows its own.
- **Unchanged:** the world view (five continents) and a region's own map of twelve stages.

## 6. Decisions to take

| Id | Call | Recommended |
|---|---|---|
| HM1 | The continent map becomes an SVG honeycomb; the List stays | Yes |
| HM2 | The capital and its city at the centre; Lv 6–10 on rings 2 and 3 only, Lv 1–5 on the shore only, rows 1–5 from the bottom round | Yes |
| HM3 | Six Springs on ring 3's corners; each region refills at its nearest | Yes |
| HM4 | Each hex: biome colour and glyph, name, levels, progress arc; ♛♛ on row 10 | Yes |
| HM5 | Claimed: the five who won its first stage, small, across the hex; completed: the five who first won its boss, large across its middle, gold rim and ✓ | Yes |
| HM6 | Regions completed before the record show ✓ with no faces | Yes |
| HM7 | `regionTeams` in each world, one entry a region | Yes |
| HM8 | Tapping opens the side panel: a region's teams and Enter, a Spring's Refill, the capital's open and last three won runs | Yes |
| HM9 | Opens fitted, centred on the frontier; pinch and − ⊙ + zoom | Yes |
| HM10 | The world view and the region view stay for now | Yes |
| HM11 | Eight hexes of open ground keep the bands whole and the honeycomb a symmetric hexagon | Yes |
