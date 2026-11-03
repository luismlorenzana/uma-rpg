# The continent map as a honeycomb

**Status:** approved 2026-11-03 (D295), third pass; packets H163–H166. Nothing is built. The preview is
[previews/honeycomb.html](previews/honeycomb.html): Continent 1's real 40 regions and eight made-up new ones, the six
Springs, the capital and its run seats, with made-up progress. Tap any hex.


## The owner's points

- The continent map is so poorly drawn that the List gets used instead: overhaul it, for every continent.
- More modern: a **honeycomb** of maps, each hex showing what it is.
- A claimed or completed map shows **the five Umas of the team that cleared it first**, so it's plain which are done.
- **Low levels on the outer rings, high levels in the inner ones, the capital in the middle.** Tapping the capital shows
  the latest parties that cleared it fully, and the rest, in the side panel.
- The MP **Springs** as hexes too, in set places.

## 1. The layout

Third pass, from the owner's notes (2026-11-03): only Lv 1–5 on the edge and only Lv 6–10 inside; the Springs at
symmetrical points; the faces larger and on the hex; the plain hexes filled with regions; the capital's ring used for the
parties that completed it.

A continent becomes **48 regions** (the 40 of today and eight new) and the capital, for **24 parties**:

| From the centre | Hexes | What sits there |
|---|---|---|
| Centre | 1 | The **capital**: its open runs, New run |
| Ring 1 | 6 | The **six run seats**: the newest won runs, then the open ones, each with its four parties |
| Ring 2 | 12 | Rows 10 (its bosses come in twos), 9 and 8: Lv 6–10 |
| Ring 3 | 18 | The **six Springs** on its corners; rows 7 and 6 and **four new Lv 6–10 regions** on its sides |
| Ring 4, the shore | 24 | Rows 1–5 and **four new Lv 1–5 regions**, from the bottom round: Lv 1–5 only |

- **The bands are clean** and every hex is used: 24 Lv 1–5 on the shore, 24 Lv 6–10 inside.
- **24 parties, everything in sixes:** a fresh region in each band for every party, six capital runs of four parties, six
  run seats, six Springs, each Spring the nearest for exactly eight regions.
- **Six Springs, not five,** on the corners of the ring between the bands. **Each region refills at its nearest.** Twelve
  hexes sit exactly between two Springs: each goes to the one that follows it clockwise, so every Spring serves eight.
- **The run seats:** a won run's seat holds its four parties' leads in a gold rim, an open run's its leads dimmed and its
  progress ("7/16"), the rest "Open seat". With 24 parties, six won runs seat every party, and every Uma has World n.

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
- **A run seat:** see §1; a tap shows the run's four parties, all twenty faces, and its date or progress.

## 3. Tapping

The **side panel** (the quick look every Hub place has) shows the hex:
- **A region:** its levels and progress, its claim and its first clear with their faces and dates, its next stage, and
  **Enter**.
- **A Spring:** its charge, the regions that refill there, and **Refill** for the active party.
- **The capital:** its open runs (each "Run 3 · 7/16" with its four parties), then its won runs, each with its date and its
  four parties' twenty faces, then **Open capital**; a seat shows its own run the same way.

## 4. Moving around

The map opens **fitted to the screen**, centred on the frontier (the lowest region not yet completed). Pinch or the
**− ⊙ +** buttons zoom; at the fitted size a hex is about 48 pt, the five faces dots; zoomed in, they're faces.
**Map / List** stays.

## 5. What it needs

- **A record of who claimed and cleared each region,** in each world: `regionTeams[regionId] = { claim: [five ids, the
  day], clear?: [five ids, the day] }`, written on a region's first stage win and its first boss win. One entry a region,
  240 a tier at most (48 × 5), so it can't grow the way the wins did (D292). A save bump (the next after capital runs').
- **Capital runs keep their last six wins** (`capitals[c].recent`), for the seats: in H160 now, so the honeycomb needs
  no second change to it.
- **Eight new regions a continent,** with ids of their own (`w1-x-1` …) so no region of today moves: 576 stages a continent,
  inside the save's bounds (D292). Four join the Lv 1–5 band and four the Lv 6–10 one, generated as any region is.
- **24 parties, not 20** (`PARTY_COUNT`): a save change that adds four empty parties to every world; the Party Hall and
  the pickers show 24.
- **The map is SVG**, not the pixel canvas: crisp at any zoom, every hex a real button with its label, the kit's tokens in
  light and dark. The biome colours exist already; the glyphs are simple vector marks. No art packet.
- **Six Springs a continent** (today five, one every two rows): `WORLD_SPRINGS` becomes 6, each region's Spring is its
  nearest on the honeycomb, and a world's Spring record gains the sixth; a region's header shows its own.
- **Unchanged:** the world view (five continents) and a region's own map of twelve stages.

## 6. Decisions (approved, D295)

| Id | Call | Recommended |
|---|---|---|
| HM1 | The continent map becomes an SVG honeycomb; the List stays | Yes |
| HM2 | The capital and its city at the centre; Lv 6–10 on rings 2 and 3 only, Lv 1–5 on the shore only, rows 1–5 from the bottom round | Yes |
| HM3 | Six Springs on ring 3's corners; each region refills at its nearest, a tie going clockwise | Yes |
| HM4 | Each hex: biome colour and glyph, name, levels, progress arc; ♛♛ on row 10 | Yes |
| HM5 | Claimed: the five who won its first stage, small, across the hex; completed: the five who first won its boss, large across its middle, gold rim and ✓ | Yes |
| HM6 | Regions completed before the record show ✓ with no faces | Yes |
| HM7 | `regionTeams` in each world, one entry a region | Yes |
| HM8 | Tapping opens the side panel: a region's teams and Enter, a Spring's Refill, the capital's open and last six won runs | Yes |
| HM9 | Opens fitted, centred on the frontier; pinch and − ⊙ + zoom | Yes |
| HM10 | The world view and the region view stay for now | Yes |
| HM11 | 48 regions a continent (eight new, own ids) and 24 parties, so every hex is a region and everything comes in sixes | Yes |
| HM12 | Ring 1 is six run seats: the newest won runs, then the open ones, each with its four parties | Yes |
