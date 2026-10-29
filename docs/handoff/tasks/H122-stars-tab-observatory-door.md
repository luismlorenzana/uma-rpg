# H122 — Uma profile v2: the Stars tab, Set all, and the Observatory as a door

**uma-rpg · ChatGPT · M · Needs: H119 · Unblocks: H125 (with H121 and H124); H123 opens this packet's node sheet**

## Why

Extra Stats are the one system of hers that lives outside the profile: setting her moon's jewel is Gear → Upgrade →
Extra Stats → Set, and the Observatory has no way back to her (+4 taps: Town → Stable → Enter → face; audit §6.3). The
approved v2 (D239, UP15, UP22) brings her map in as the **Stars tab**, with a node sheet that shows what a jewel does
**before → after** and sets it, and **Set all** for every jewel that fits. The Observatory stays on the Learning page as
**a door**: a list of her Umas, those with a jewel ready first, each opening her profile on Stars.

No rule or save change: every jewel is today's `setJewel`, in today's order and gates.

## Context (read first)

- `CLAUDE.md`, `AGENTS.md`; H119's frame as merged (the Stars tab carries `StarsPanel.tsx`, the Observatory's body; the
  nav-state helper `profileDoor` is in `places/stable/profile-tabs.ts`).
- **The proposal** ([proposal.md](../../design/uma-profile-v2/proposal.md), D239):
  - **§4.3 entire** (the drawing, the node sheet, Set all, the Observatory as a door, the edge states, "what changed");
  - §2.4 (the one grammar), §5.3 ("one component, two doors": H123's ★ Moon rows open **this** node sheet), §5.5
    (Stars' dot), §6.2's Observatory row (opens on Stars; Back returns to its list; ‹ › step through that list);
  - §7.2 (Extra Stats count, Node value, A gate, An item and its count, Her moon), §7.4 (states);
  - §9: G1–G5, **B2 (each tab ≤ 1.4 at 390×844; Stars as drawn 1.16), B3, B4**; §10.2–§10.3 (set her moon's jewel: 3
    taps, and no round trip);
  - §14: UP15, **UP22 (Set all's rule)**, UP23. The [tabs page](../../design/uma-profile-v2/previews/tabs.html) draws
    Stars and its node sheet; the [doors page](../../design/uma-profile-v2/previews/doors.html) the Observatory door.
- **The audit:** §1.1 (the Observatory row), §4.12 (its strings, cleaned by H117), §5.1 (her moon), §6.3, §7.
- **The code on `main` at `6a6996f`** (H117 and H119 change it; re-read):
  - H119's `places/observatory/StarsPanel.tsx` (from `ObservatoryPage.tsx :114–226`: the map `StarMapV3`, the Prowess
    line, the six totals, the Set list and its "which node" sheet, `NodeSheet`, `mapNodeTitle`; the node words are
    H117's builders);
  - `places/observatory/ObservatoryPage.tsx :24–109`: the page, its Uma picker, **and the dead v1 map** (`StarMap`, the
    Star Gem toggle and list; F38), with `save/game.ts :295–307` (`setStarGem`, `activate`, `setMapJewel`);
  - `places/observatory/layout-v3.ts`; `album/rows.ts` (`albumRows`), `album/upgrades.ts` (`umaUpgrades`: `jewels`,
    `stars`); `@luismlorenzana/uma-kit/roster`'s `byLevel`;
  - the domain: `save/observatory.ts` (`jewelBlock :89`, `jewelNodes :114`, `setJewel :124`), `economy/planet.ts`
    (`MAP_NODES`, `mapPoints`, `nodePoints`, `mapNodeGate`, `nodeJewel`, `nodeBody`, `nodeNumeral`, `moonTemplate`),
    `save/sheet.ts` (`umaBattleSheet`, for before → after);
  - `hub/HubScreen.tsx :51` (a place opened on another page's path is redirected, which is how `/town/observatory/:id`
    reaches `/learning/observatory/:id`); `places/PlacePage.tsx` (Back pops an entry pushed with `{ back: true }`).
- **The manual:** [sections § Observatory](../../game/sections.md#observatory) and its Stars tab under § Stable,
  [loops](../../game/loops.md) `:283`; [phone-check.md](../../testing/phone-check.md) steps 11 and 16.

## Decisions made

### From the proposal, exact

- **First row:** `Extra Stats · Open 13/22 · 2 ready`, **Set all**, (i). Nothing ready: `Extra Stats · Open 4/22`, no
  button.
- **The map** as the Observatory draws it: the Planet in the middle, Prowess, Vigor and Guard around it (five nodes
  each), ★ her moon's two nodes; then **the six totals** (`HP +125 · MP +25 · ATK +25 · M.ATK +13 · DEF +19 · M.DEF
  +19`) and her moon's ★ line (`★ Evasion +2.4%`).
- **The node sheet** ("Guard III", "★ Bruiser's moon II"): what it gives resolved for her class (`DEF/M.DEF +6`;
  Prowess `ATK +6` as a Brawler); before → after (`DEF 151 → 157`); its jewel (`Moon Jewel III ×1 · 4 held`); its gate.
  The footer **Set**; closed, disabled with the gate (`Lv 41`, or `Guard II first`); open, `Open` and no button. The
  sheet stays open after Set (G5).
- **Set all:** every jewel that fits now, one line each (`Moon Jewel IV → ★ moon II · DEF +8`). **A Planet Jewel can
  only open the Planet; a Moon Jewel goes to her moon first (it takes II and IV), then to the shared moon with the
  fewest open nodes (Prowess, Vigor, Guard on a tie).** The footer **Set 2**.
- **The Observatory becomes a door:** its page lists her owned Umas, **those with a jewel ready first**, each `Open
  13/22 · 2 ready`; a tap opens her profile on **Stars**; Back returns to the list; ‹ › step through it (H124 draws the
  stepper from the list this door passes). **`/learning/observatory/:id` redirects to `/town/stable/outfit/:id/stars`.**
  The place keeps its spot on the Learning page and H117's blurb.
- **Edge states:** under Lv 6 the moons are Closed (`Lv 6`); Planet V at `Lv 41`.
- **Gone:** Gear's Extra Stats button and its total (if H121 hasn't removed them yet), the Observatory's Uma picker.
- **The dot:** Stars' tab dot while a jewel in the Warehouse opens one of her nodes now, her moon included (H119 wired
  it from `upgrades.stars`).
- **Budgets:** B2 Stars ≤ 1.4 at 390×844; B3 the node and Set all sheets without scrolling; B4 her moon's jewel in 3
  taps (Stars → ★ node → Set).

### Build decisions (log them in the D-row)

1. **`setAllPlan(map, stock, level)`** (pure, `places/observatory/stars-view.ts`): repeat until nothing fits: take the
   jewels in stock, Planet Jewels first, then Moon Jewels, each by its numeral; place each by UP22's rule against a
   simulated map and stock (`jewelBlock` decides "fits", so order and gates hold: a node opens only after the one
   before it); record the line. *Why:* the plan is what the sheet lists, so the confirm shows exactly what happens.
2. **One save write:** a node's Set is `setMapJewel(outfitId, nodeJewel(node), node)`; Set all is a new
   `setJewels(outfitId, steps)` in `save/game.ts` reducing `setJewel` inside one `edit` (the `wieldWeapons` pattern). A
   refused step aborts the write with its message.
3. **Today's Set list and its "which node" sheet go:** a jewel is set from its node's sheet, or by Set all. *Why:* G3,
   one sheet a selection; the list repeated the map.
4. **Before → after is computed:** `nodeBeforeAfter(outfit, uma, node, classId, tier)` runs `umaBattleSheet` with and
   without the node open and returns the stats that change (`DEF 151 → 157 · M.DEF 129 → 135`); the first at display
   size. *Why:* the numbers come from the rules, so a balance change shows here.
5. **`NodeSheet` is one exported component** taking the Uma and the node, so H123's ★ Moon rows open the same sheet
   (§5.3).
6. **The Observatory list:** owned Umas of this world, sorted by ready jewels (most first), then as the roster's
   default (`byLevel`); each row a face, her name and `Open 13/22 · 2 ready` (`Open 13/22` with none), 44 pt; a tap is
   `profileDoor(id, { tab: 'stars', list })` with the list's ids in its order. No Uma: "Unlock an Uma first." (an empty
   state).
7. **The redirect** lives in `ObservatoryPage`: a `rest` id renders `<Navigate replace>` to the profile's Stars,
   carrying the incoming nav state, so a pushed entry still pops.
8. **The dead v1 map goes with the page's rewrite** (F38's Observatory part): `StarMap`, the Star Gem toggle and list,
   and `setStarGem` and `activate` in `save/game.ts` when nothing else imports them (`git grep`). The domain's v1 rules
   stay (F37, D218 keeps them for tests).
9. **New wording facts first** in `copy.ts` and the copy test: the first row, the Set all line `{jewel} → {node} ·
   {value}`, `Set {n}`, the totals cells, the list row. Node titles keep today's `Guard III` and `★ Bruiser's moon II`.
10. **No green in the totals:** the ★ moon part is in the accent; green is Ready only (UP23).
11. **Bundle:** the map and sheets are in the lazy chunk H119 shares between the profile and the Observatory; expected
    main JS change: 0.

## Do

1. **`stars-view.ts`** (decisions 1, 4) and **`setJewels`** (decision 2).
2. **The Stars tab** (rework `StarsPanel.tsx`): the first row, the map, the totals and the ★ line, `NodeSheet` with
   before → after and Set, the Set all sheet; the states of §7.4 on the nodes (Open filled, Ready dot when a jewel in the
   Warehouse fits it now, Closed faded with its gate); 44 pt hit areas (the map's nodes already have `r="22"` targets).
3. **The Observatory page** as a list (decisions 6, 7, 8); remove Gear's Extra Stats button if it's still there.
4. **Tests:**
   - `places/observatory/stars-view.test.ts`: `setAllPlan`: a Moon Jewel II at Lv 20 with her moon's I closed → her
     moon I; with it open and Prowess 2 open, Vigor 1, Guard 1 → Vigor (fewest; Vigor before Guard on the tie); a Planet
     Jewel III with Planet II closed → no line; two Moon Jewel II → her moon, then the emptiest shared moon; the plan
     never skips a node's order; the counts for `Set n`. `nodeBeforeAfter`: Guard moves DEF and M.DEF by its points;
     Prowess as a Brawler moves ATK only; the Planet moves all six. The node sheet model: `Lv 41`, `Guard II first`,
     `Open`, the jewel line with its held count.
   - The Observatory: its list order (ready first), each row's words, and a tap's `{ to, state }` (`profileDoor` with
     the list); `/learning/observatory/81001` lands on `/town/stable/outfit/81001/stars` (a `MemoryRouter` test).
   - A component test on `albumFixture`: tap a node, Set → it opens, the jewel count falls, the sheet stays open on
     `Open`; Set all → its lines, then Set N → one save write (spy on the store's commit).
   - H117's copy test passes, with this packet's `.tsx` files in its JSX list.
5. **Measure** at 390×844 and 375×667 with an Uma with jewels ready:
   ```js
   const main = document.querySelector('[data-place-page] main')
   +(main.scrollHeight / main.clientHeight).toFixed(2)          // B2: Stars ≤ 1.4 at 390×844 (1.16 as drawn)
   const body = document.querySelector('[data-kit="sheet"] .overflow-y-auto'); body.scrollHeight <= body.clientHeight   // B3
   ```
   and count B4's taps; then Observatory → her Stars → Back lands on the list.
6. **Docs:** sections.md § Observatory (a list and a door) and the Stars tab under § Stable; loops.md `:283` if it names
   where jewels are set; phone-check.md steps 11 and 16; `pnpm docs:update`.
7. **Check it locally** at 390×844 and 375×667, light and dark, on your own ports (API `AUTH_MODE=disabled PORT=8091
   LOCAL_SAVE_FILE=.data/scratch-h122.json`, web 5184), on a scratch save with Planet and Moon Jewels of several
   numerals and Umas at Lv 5, 20 and 40: set one node, Set all, the gates, the Observatory list and its door, the old
   route. Never the iOS Simulator.
8. **Log the D-row** (fetch `main` first): "H122: the Stars tab, Set all and the Observatory as a door", decisions
   1–11.

## Done when

- [ ] `pnpm lint && pnpm test && pnpm build` pass. Say the main JS number (gzip, of 230 KB) and this packet's change (0
  expected).
- [ ] The tests in step 4 pass; **the copy test passes**; the new facts are in the wording list.
- [ ] **B2 (Stars ≤ 1.4 at 390×844), B3 and B4 measured and met**; the numbers at both sizes in the pull request
  (375×667: 1.56 as drawn, reported).
- [ ] The old route redirects; the Observatory lists her Umas, ready first, and its door's Back returns to the list.
- [ ] `pnpm docs:update` leaves no diff; the manual and the phone check describe the tab and the door.
- [ ] The local check in step 7 was done at both sizes, light and dark, on a scratch save, and described. Nothing from
  the original games in git (`git status`).
- [ ] Deployed green (`gh run watch <id> -R luismlorenzana/uma-rpg --exit-status`) and
  https://uma-rpg.web.app/api/health shows the merge commit.

## Deliver

- **ChatGPT:** a branch `feat/h122-stars-tab` and a pull request, "feat(web): the profile's Stars tab, Set all and the
  Observatory as a door (H122)", the body saying why (D239, UP15, UP22) with the measurements. Fetch `main` before you
  push so the D-number is free. Merge it yourself when the checks and CI are green, and watch the deploy (rerun the web
  job on Vitest's `Timeout calling "onTaskUpdate"`).
- **Flag it done:** delete this file, add a Done row in [README.md](../README.md) with the merge commit, and set H125 to
  Ready when H121 and H124 are done too.
