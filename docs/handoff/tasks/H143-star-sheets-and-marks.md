# H143 — A body's sheet, its strip and the stat marks

**uma-rpg · Claude or ChatGPT · S · Needs: H140, H142 · Unblocks: nothing**

## Why

The chart says where she stands; this packet makes it answer "what's in it for me?". The owner asked for "visual indicators with numbers and clickable things". A body's values
live only one node at a time today, so comparing Guard III with Guard V means two taps and a memory test. This adds a strip of the body's nodes to the node sheet, and puts uma-art's
stat marks on the totals and on Details' tiles, so one icon set runs through the profile.

No new sheet kind, no rule change.

## Context (read first)

- `CLAUDE.md`, `AGENTS.md`.
- **The design:** [proposal.md](../../design/profile-polish/proposal.md) §3 and PP26–PP29. **The [star chart page](../../design/profile-polish/previews/star-chart.html)** draws it: tap a star or a body's middle, then tap the strip.
- **The profile v2 contract:** [uma-profile-v2/proposal.md](../../design/uma-profile-v2/proposal.md) §5.3 (one node sheet, two doors), §9 (G3, G4, G5, B3).
- **The code after H140 and H142** (re-read):
  - `apps/web/src/places/observatory/StarsPanel.tsx`: `NodeSheet`, the totals at `:48–52`;
  - `apps/web/src/places/observatory/stars-view.ts`: `nodeSheet`, `NodeView`, `mapNodeValue`;
  - `apps/web/src/places/observatory/StarChart.tsx`, `star-chart.ts` (`nodeState`), and its hub buttons;
  - `apps/web/src/places/stable/TemplateTab.tsx`: its ★ Moon rows open `NodeSheet`, so they gain the strip too;
  - `apps/web/src/places/stable/DetailsSheet.tsx`, the Stats tiles;
  - `apps/web/src/battle/pixel-icons.tsx`: `PixelIcon`, `StarCrest`.

## Decisions made

- **A hub's tap opens the sheet on the body's next node,** or its last when full (PP26). H142 wired that; this packet's strip is what makes it useful.
- **The strip** sits at the top of the node sheet: one cell per node of the body, 5 or 2. Each cell holds a 30 px dot with the numeral, drawn in the same four states as the chart, then the node's value at 11 px. A
  line joins the dots, lit between open ones. The selected cell has a ring and a bold value. Each cell is at least 44 pt tall.
- **A cell's value is the first number of `mapNodeValue`** (PP27): Planet `+4`, Prowess `+6`, Vigor `+30`, Guard `+6`, her moon `+2.4%`. The big line under it gives the node's whole value.
- **A tap on a cell moves the sheet to that node:** the title, the value, before → after, the jewel and the footer follow. The sheet doesn't close or stack (G4).
- **After Set the sheet stays** on that node, now Open (G5), and the strip shows it.
- **Stat marks** (PP28, PP29): 16 px, before the label, in the six totals and Details' tiles. Her moon's ★ line wears `stat/evasion` or `stat/limit` when it reads that stat, if the line stays on one row at 375.
- **Colors:** the strip sits on the panel, not the sky. Its open dots use each body's color from `star-chart.ts`, with a darker variant in light mode where one falls under 3:1.

Build decisions (log them in the D-row):

1. **`NodeView` gains `steps: { id, numeral, value, state }[]`,** built in `nodeSheet` from `nodeState`, so the strip and the chart can't disagree.
2. **`NodeSheet` holds the selected node in its own state,** starting from its `node` prop, so a door doesn't change. `Template`'s ★ rows get it for free.
3. **`StatMark({ stat })`** joins `pixel-icons.tsx`: `stat/<id>`, decorative, the label beside it.
4. **A `nodeStepValue(value)` helper** in `stars-view.ts` takes the first number of `mapNodeValue` with its sign and any `%`.

## Do

1. **`nodeStepValue`, `NodeView.steps` and the strip** in `NodeSheet`.
2. **`StatMark`,** then the totals and the tiles.
3. **Tests:**
   - `stars-view.test.ts`: `nodeStepValue` for every body and all five knacks; `steps` matches `nodeState`, in order.
   - `StarsPanel.test.tsx`: a tap on a hub opens the sheet on its next node, and on its last when full; a strip cell moves the sheet without closing it; Set on a moved-to node
     writes that node; after Set the strip shows it Open.
   - `TemplateTab.test.tsx`: a ★ row opens the sheet on that node, with two cells.
   - `pixel-icons.test.tsx`: all eight marks are in the pinned atlas.
   - The copy test passes.
4. **Measure** at 390×844 and 375×667: every node sheet fits without scrolling (B3), Vigor's and Prowess's on a hybrid included; Stars stays ≤ 1.4 (B2); nothing under 11 px; a strip cell is 44 pt.
5. **Docs:** [sections.md:301](../../game/sections.md); [phone-check.md](../../testing/phone-check.md) step 12; `pnpm docs:update`.
6. **Check it locally** in light and dark at both sizes, on a scratch save: a hub, the strip, Set, and a ★ Moon row from Template.
7. **Log the D-row** (fetch `main` first): "H143: a body's sheet, its strip and the stat marks", build decisions 1–4, and PP26–PP29 by reference. **Mark the proposal built:** its status line in
   [proposal.md](../../design/profile-polish/proposal.md), once H140 and H142 are done too.

## Done when

- [ ] `pnpm lint && pnpm test:ci && pnpm build` pass. Say the main JS number, of 230 KB, and this packet's change.
- [ ] The tests in step 3 pass; the copy test passes.
- [ ] B2 and B3 met at both sizes. Numbers in the delivery.
- [ ] `pnpm docs:update` leaves no diff; the manual and the phone check describe the strip.
- [ ] The local check in step 6 was done and described. Nothing from the original games in git (`git status`).
- [ ] Deployed green (`gh run watch <id> -R luismlorenzana/uma-rpg --exit-status`) and https://uma-rpg.web.app/api/health shows the commit.

## Deliver

- **Claude:** commit to `main`, "feat(web): a body's values in its sheet, and stat marks (H143)".
- **ChatGPT:** a branch `feat/h143-star-sheets` and a pull request with that title, the measurements in its body. Merge it yourself when the checks and CI are green, and watch the deploy. Fetch `main` before you push so the
  D-number is free.
- **Flag it done:** delete this file and add a Done row in [README.md](../README.md) with the commit.
