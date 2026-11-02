# H155 — Windows on screen: her window beside her bust, the Window sheet, the Gallery, Ascend (dark)

**uma-rpg · Claude · L · Needs: H150 (uma-data 1.3.0), H151 (uma-kit 0.17.0), H152 (the rules), H153 (Trials off the Rift
page) · Unblocks: H157**

## Why

The window is each Uma's collection (D283): dark glass that lights pane by pane as she earns her board's steps, her face
last, and only a full window ascends. This packet draws it: beside her bust in her profile (the owner's note, CO35), in
the Window sheet with her board, and in the **Gallery**, which ranks the world's Umas most complete first (CO37), shows
every count as a percentage too (CO36), and takes the Observatory's place. Built **dark** behind H152's
`collectionsLive`; H157 switches it on.

## Context (read first)

- `CLAUDE.md`, `AGENTS.md`, [the manual](../../game/README.md): [sections](../../game/sections.md) (the Hub, Stable and the
  profile, the Observatory, the Rift and Ascend).
- **The design:** [collections.md](../../design/collections/collections.md) §4 (the reveal), §7 (the screens), §5 (Ascend);
  the [screens page](../../design/collections/previews/screens.html) (phones 1–4 and 8) and the
  [window page](../../design/collections/previews/window.html) (the rule, the fade).
- **H150:** `outfit-glass-order` and `litWindow`'s rule (its decision 8), which this packet's canvas must match.
- **H151:** `ProfileFrame`'s `companion`.
- **H152:** `collectionsLive`, `windowOf` (steps, days, lit, percent, each track's share), `latchWindows`,
  `ascendUmas`, `ascendUmasBlock`, `currentRiftRun`.
- **The profile:** `places/stable/OutfitProfile.tsx` (the bust, `ProfileFrame size="compact"`), `copy.ts` and its test,
  `sheet-door.ts` (`?sheet=`), G3–G5 in profile v2's proposal.
- **Art:** `imagePath(view.art, family, id)`, `useArtUrl`, `master/album-art.tsx`.
- **The Observatory:** `places/observatory/ObservatoryPage.tsx` (the page that goes); `StarsPanel.tsx`, `star-marks.tsx`,
  `stars-view.ts` stay, the profile uses them. `hub/places.ts`'s `OBSERVATORY` at (0.5, 0.84).
- **Ascend today:** `places/rift/AscendSheet.tsx`, the tier veil (`hub/TierVeil.tsx`), `RiftPage.tsx`.
- **Commits:** `apps/web/src/save/game.ts` `commit(save)`, every change's one path.

## Decisions made

1. **Pins:** uma-data 1.3.0 and uma-kit 0.17.0 (`NODE_AUTH_TOKEN=$(gh auth token) pnpm install`).
2. **`GlassWindow`** (`places/gallery/GlassWindow.tsx`): props `outfitId`, `lit`, `steps`, `size`. It loads the window and
   its pane map, draws them on one canvas by H150's rule (a pixel lit when its value is 0 or at most
   `250 × lit ÷ (steps − 1)`, the face at `lit = steps`, dark glass otherwise), caches the result by outfit and `lit`,
   and fades newly lit panes up over 600 ms (at once under reduced motion). **Without a map** (an older release), it
   draws the window fully lit at `lit = steps`, else at dark glass whole. A test checks a few known pixels against
   H150's `litWindow` on a tiny synthetic window and map.
3. **Her profile (CO35):** the bust stays the portrait; `companion` holds her window at 64 px, at her current tier's share,
   with "45%" on its corner; a tap opens the Window sheet (`?sheet=window`). Locked: none.
4. **The Window sheet** (one sheet, G3; nothing opens over it, G4):
   - her window, large (up to 240 pt at 390 wide), and "Window · Tier 1 · 14/31 · 45%";
   - the board: six rows (Level, Class, Craft, Gear, Stars, World) of five tiles, each row's share under its name
     ("60%"), then the Rift tile across. A lit tile shows its day ("2 Nov"); the next tile of a row shows what's left
     ("Lv 34/40", "R41/50", "Craft 22/30", "8 of 11 at G6", "10/13", "1 of 3"); the rest are dark. A tap on a tile opens
     its line under the board, inline: the rule and where it comes from ("8 of 11 at G6 · Wilds");
   - full: "Ready to ascend" and a door to the Gallery;
   - earlier tiers' full windows, small, each in its tier's frame.
5. **The Gallery** (CO7, CO9, CO36, CO37): place `gallery`, page `learning`, kind `town`, name "Gallery", at the
   Observatory's (0.5, 0.84); building uma-art's unused `cleric-chapel` until H156. Line: "Every Uma's window, most
   complete first." The Observatory's place and page go; `/learning/observatory` and its old `/:id` route go to
   `/learning/gallery`.
   - Head: "Gallery", "3 full · 2 ready", "Collection 62%" (lit steps over every owned Uma's steps), and **Ascend 2**
     while any Uma is ready.
   - Filters: All · Ready · Owned · Locked.
   - The grid, four a row at 390: owned Umas **ranked** by percent, ties to whoever lit her last step first, then by name;
     each tile her window, "1. Uma name" and "31/31 · 100%"; a ready Uma's line starts with the green dot; a full window
     in its tier's frame (a 3 px ring: Tier 1 `#e8c25a`, Tier 2 `#c07a3a`, Tier 3 `#7a5ad0`). Then every outfit nobody
     owns, unlit, with a lock and "Locked". Then this world's ascended Umas, their full windows framed, "Ascended", from
     the account's history.
   - A tap on an owned Uma opens her Window sheet; on a locked outfit, her Stable profile.
6. **Ascend** (`places/gallery/AscendSheet.tsx`, replacing the Rift's): the ready Umas, each ticked (untick to leave one),
   one who can't go with why ("At work · recall first"), today's lines ("Lv 1 in Tier 2", "Ranks, skills and stars
   restart", "Gear returns to Tier 1's stock", "+2,000 Laurels · +10 Speed Tickets" for the ticked), and **Ascend n**,
   which calls `ascendUmas` and runs behind the tier veil as today.
7. **The Rift page:** its Ascend goes; after a win, "Rift won · 3 ready" and a **Gallery** door; the roster's faces become
   their windows at list size with "n/31".
8. **Latching:** `commit(save)` runs `latchWindows(save, roster, now)` once the roster has loaded, and on boot after it
   loads, while `collectionsLive`. A step lit adds "Window +1 · Lv 30" to that Uma's line on a fight's result, and a
   toast, "Window +1 · Craft 30", after any other change.
9. **Copy:** every string in `copy.ts` first; the copy test passes (≤ 6 words, none of its banned words).

## Do

1. The pins; `GlassWindow` and its test.
2. The profile's companion; the Window sheet and its door.
3. The Gallery place, page and filters; the Observatory's removal and redirects; the Ascend sheet; the Rift page's change.
4. Latching in `commit`; the result line and the toast.
5. Look at it in a throwaway worktree with H157's switch applied (its own ports, avoid 8098 and 5198; a scratch save with
   Umas at several shares, one full, one ready, one Tier 2): the profile, the sheet, the Gallery's order and percentages,
   an Ascend, at 390×844 and 375×667, light and dark. Use the real release locally, never a public host, for windows.
6. The manual's hand-written pages change at H157, with the switch; note here anything they'll need.
7. Log the D-row (fetch `main` first).

## Done when

- [ ] `pnpm lint && pnpm test:ci && pnpm build` pass. Say the main JS number, of 230 KB, and keep the Gallery and
      `GlassWindow` in lazy chunks.
- [ ] Live play unchanged while dark: the Observatory is still there, no companion, no Gallery, no latch.
- [ ] Nothing from the original games in git (`git status`); no window image in a test fixture or a screenshot committed.
- [ ] Deployed green (`gh run watch <id> -R luismlorenzana/uma-rpg --exit-status`) and https://uma-rpg.web.app/api/health
      shows the commit.

## Deliver

- **Claude:** commit to `main`, "feat(web): windows, the Gallery and Ascend one Uma at a time, dark (H155)".
- **Flag it done:** delete this file and add a Done row in [README.md](../README.md) with the commit.
