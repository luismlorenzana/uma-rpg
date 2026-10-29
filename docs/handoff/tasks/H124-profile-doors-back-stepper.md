# H124 — Uma profile v2: every door opens a tab, Back returns to it, and ‹ n/N › steps through the door's list

**uma-rpg · Claude · S–M · Needs: H119 (and H118's `onFace` in uma-kit 0.16.0) · Unblocks: H125 (with H121 and H122)**

## Why

Today every link out of the profile is one-way, three doors in return to the wrong place, three places have no door at
all, and the profile had two Back controls (audit §1.2, P2). Going back to her after her party or her place is four taps
(Town → Stable → Enter → face), and the next Uma is three (Back → find her → face). The approved v2 (D239, UP2, UP20,
UP21) keeps **one profile with many doors**: each door opens the tab it implies and pushes with the kit's `back: true`,
so the place header's Back returns to it; every link out comes back the same way; and **‹ 3/26 ›** in the place header
steps through the list the door came from without leaving the tab.

No rule or save change; nothing in uma-kit beyond H118's opt-in `onFace`.

## Context (read first)

- `CLAUDE.md`, `AGENTS.md`; H119's frame as merged (routes `outfit/:id/:tab`, tab taps replace the URL and keep its
  state, `places/stable/profile-tabs.ts` with `profileDoor(outfitId, { tab?, list? })` and `firstDotTab`).
- **The proposal** ([proposal.md](../../design/uma-profile-v2/proposal.md), D239): **§6 entire** (§6.1 one profile, §6.2
  every door, §6.3 links out, §6.4 next and previous), §2.2 (the diagram), §3.4 (the ticket count stays in the top bar),
  §10.3 (the next Uma: 1 tap; back to her after her party or place: 1; five Umas' raises from the Stable: ≈ 15), §14
  UP2, UP20, UP21. The [doors page](../../design/uma-profile-v2/previews/doors.html) draws every door, link out and Back
  path.
- **The audit:** §1.2 (each entry point and where Back goes today).
- **The code on `main` at `6a6996f`** (H119 changes the profile; re-read). Paths under `apps/web/src/`:
  - `hub/navigation.ts` (`NavState`: `fromHub`, `back`, `fromPlace`; `sub` pushes `{ fromPlace: true }`); uma-kit's
    `shell/nav.ts` (`useLeave`: pops when `state.back === true`, else replaces with the fallback);
  - `places/PlacePage.tsx :11–43` (the place header: Back is `useLeave(up)`; the place's `Counter` sits in its trailing
    slot); `places/registry.tsx :23–27` (the Stable's `Counter` is `TicketCounter`);
  - `places/stable/StablePage.tsx` (the roster's `onOpen` `:74` with `nav.sub`, the Can upgrade facet in
    `prefs.query.filters.upgrade`, `SkillsRoute :31–39`); `album/rows.ts` (`stableResult`, the roster's order);
  - the doors: `places/party-hall/PartyHallPage.tsx :191` (View profile, `{ fromHub: true }`),
    `places/scenario-gate/ActiveParty.tsx :54` (the world map's party bar → `outfit/:id/skills`), `hub/Featured.tsx
    :111` (the plaza's Profile, a `Link` with `replace`), `places/halls/HallPage.tsx` (a face opens the Hero sheet
    `:139–163` or the Learner sheet `:166–184`, no door), `places/work/PlaceV3.tsx :96` (`SlotRow`; uma-kit 0.16.0's
    `onFace`), H122's Observatory list;
  - the links out: H119's facts row (Party, Work), `OutfitProfile.tsx :347` (the Inheritance rows → her hall, `{ fromHub:
    true }`).
- **The manual:** [sections](../../game/sections.md) § Stable (routes), § Party Hall, § Halls of Heroes, § Observatory,
  the Wilds' place page and the Hub's plaza; [phone-check.md](../../testing/phone-check.md) steps 4, 7, 13, 15 and 17.

## Decisions made

### From the proposal, exact (§6.2, §6.3, §6.4)

| Door | Opens on | Back to | ‹ › steps through |
|---|---|---|---|
| Stable roster, a face | The remembered tab | The roster, same scroll and filter | The roster's sort and filter (owned) |
| Stable, Can upgrade filter on | The first tab with a dot (Gear, Stars, Template) | The roster | The filtered roster |
| Party Hall, View profile | Class | The party editor | The party, in slot order |
| World map party bar, a face | Class | The map | The active party |
| Plaza (Hub), Profile | The remembered tab | The plaza | — |
| Observatory, a row (H122) | Stars | The Observatory's list | That list (jewels ready first) |
| Hall of Heroes, a Hero or a Learner | Class | The hall | That seat's Hero and Learners |
| Wilds place, a working Uma's face | The remembered tab | The place | That place's workers |
| A shared link | Its tab | The roster (replace) | The roster |

- **A door that names a tab wins; otherwise the remembered tab.** **Every door and every link out pushes with `back:
  true`**, so the place header's Back returns to it (the kit's `useLeave` already pops). Links out: the Party and Work
  cells (H119), the Limit sheet's hall (H120, after Classes v3; today's Inheritance rows until then).
- **The Skills-alone route retires:** `outfit/:id/skills` redirects to `outfit/:id/class`.
- **‹ n/N ›** in the place header's trailing slot: 44 pt arrows, the label says where she is in the list; **the list is
  the door's**, passed in the navigation state (a shared link uses the roster); a step **keeps the tab and closes any
  sheet**, and **replaces the history entry** (‹ › never stack Backs); arrows only, no swipe; **hidden when the list has
  one Uma, and on a locked profile**.
- **B4:** the next Uma on the same tab is 1 tap; back to her after her party or her place is 1 tap.

### Build decisions (log them in the D-row)

1. **The stepper is the Stable's header counter on a profile route.** The Stable's `Counter` renders the stepper on
   `outfit/:id…` and today's ticket count elsewhere (the roster); `PlacePage` doesn't change. *Why:* the trailing slot
   already holds the counter, and on the profile the ticket count lives in the top bar only (§3.4).
2. **Every door builds its target with H119's `profileDoor`**, so the state is always `{ back: true, list? }`.
3. **The list falls back to the roster:** without `state.list` (a shared link), the roster's current sort and filter,
   owned Umas only; locked ids are never in a list. A profile whose id isn't in its list shows no stepper.
4. **The ends wrap:** › on the last Uma goes to the first, ‹ on the first to the last. *Why:* a party of five steps like a
   ring and no arrow is ever dead.
5. **A step** is `navigate(…/outfit/:next/:tab, { replace: true, state })`, keeping `back` and `list`; the profile's
   body is keyed by the outfit id, so an open sheet closes and the scroll returns to the top. The label is `3/26`, its
   accessible name "Uma 3 of 26"; the arrows "Previous Uma" and "Next Uma".
6. **The roster keeps its place:** opening a face saves the page's scroll (`main.scrollTop`) in `sessionStorage`
   (`rpg.stable.scroll`), and the roster restores it on mount (filter and sort are already device preferences). The
   roster passes the ids it shows, owned, in its order; with the Can upgrade filter on, the tab is `firstDotTab` of
   that Uma.
7. **The Halls' door is a Profile button in the Hero and Learner sheets** (44 pt), with that seat's Hero and Learners as
   the list. *Why:* a face already opens its sheet with the seat's actions (Change Hero, Empty seat, Leave); a door in the
   sheet keeps them, one tap more than a bare face.
8. **The Wilds' door is the worker's face** through `SlotRow`'s `onFace` (uma-kit 0.16.0, H118), with that place's
   workers in slot order as the list.
9. **The plaza pushes instead of replacing**, with no list; the world map's party bar opens `class` with the active
   party as the list; the Party Hall's View profile opens `class` with the party's filled slots in order.
10. **`SkillsRoute` is deleted** and `outfit/:id/skills` renders `<Navigate replace>` to `outfit/:id/class` with the
    incoming state, so the party bar's old links and any bookmark land on the Class tab.
11. **Today's Inheritance rows push with `{ back: true }`** until H120 replaces them with the Limit line and sheet.
12. **`NavState.fromPlace` and `subBack` stay** for the other places that use them; the profile no longer does.
13. **Bundle:** the stepper is in the Stable's lazy chunk; the door changes are a few bytes in their pages (the plaza's
    `Featured.tsx` and the party bar may be in the main bundle). Expected main JS change: under +0.1 KB.

## Do

1. **`places/stable/profile-nav.ts`** (pure): the stepper model (`stepper(list, id)`: index, label, previous and next
   with wrap, hidden for one Uma or an id outside the list) and the roster list (owned, in the view's order).
2. **The stepper** in the Stable's counter (decisions 1, 5) and the keyed profile body.
3. **The doors** (decisions 6–10), each through `profileDoor`; the redirect; the links out (decision 11, and check
   H119's facts row).
4. **Tests:**
   - `places/stable/profile-nav.test.ts`: the stepper's label and accessible name, wrap at both ends, hidden for one
     Uma, locked ids left out; the roster list owned and in order.
   - Component tests (a `MemoryRouter` with a history, on `albumFixture`): a roster face pushes the profile with `{ back:
     true, list }` and the place header's Back pops to the roster at its saved scroll; with the Can upgrade filter on,
     the profile opens on the first tab with a dot; View profile in the Party Hall lands on `…/outfit/:id/class` with
     the party's list; the party bar does the same with the active party; the plaza's Profile pushes; a Hero sheet's
     Profile opens Class with the seat's list; a Wilds worker's face opens her profile; `…/skills` lands on `…/class`;
     › replaces the entry (history length unchanged), keeps the tab, closes an open sheet, and wraps; no stepper on a
     locked profile or a one-Uma list.
   - H117's copy test passes, with this packet's `.tsx` files in its JSX list.
5. **Measure B4** in the browser at 390×844: the next Uma (1 tap), back to her from her party and from her place (1
   tap each), and the five-Umas-raises path from the Stable once H121 is in (≈ 15; else leave it to H125).
6. **Docs:** sections.md (the Stable's routes and doors; the Party Hall's View profile; the Halls' Profile; the Wilds'
   face; the plaza; the party bar), phone-check.md steps 4, 7, 13, 15 and 17 where they open a profile; `pnpm
   docs:update`.
7. **Check it locally** at 390×844 and 375×667, light and dark, on your own ports (API `AUTH_MODE=disabled PORT=8091
   LOCAL_SAVE_FILE=.data/scratch-h124.json`, web 5184), on a scratch save with a full party, a Hall with a Hero and two
   Learners, two Umas working in one place: walk every door and every Back, step through each list, reload a profile
   and step again. Never the iOS Simulator. The stepper sits in the place header near the notch: say so in the delivery
   so the owner checks it on the phone.
8. **Log the D-row** (fetch `main` first): "H124: the profile's doors, Back and ‹ n/N ›", decisions 1–13.

## Done when

- [ ] `pnpm lint && pnpm test && pnpm build` pass. Say the main JS number (gzip, of 230 KB) and this packet's change.
- [ ] The tests in step 4 pass; **the copy test passes**.
- [ ] Every door of the table opens its tab and Back returns to it; every link out comes back to her on the same tab;
  B4's door counts measured and met (in the pull request).
- [ ] `pnpm docs:update` leaves no diff; the manual and the phone check describe the doors and the stepper.
- [ ] The local check in step 7 was done at both sizes, light and dark, on a scratch save, and described. Nothing from
  the original games in git (`git status`).
- [ ] Deployed green (`gh run watch <id> -R luismlorenzana/uma-rpg --exit-status`) and
  https://uma-rpg.web.app/api/health shows the merge commit.

## Deliver

- **Claude:** a branch `feat/h124-profile-doors` and a pull request, "feat(web): the profile's doors, Back to the door
  and next/previous Uma (H124)", the body saying why (D239, UP20, UP21). Fetch `main` before you push so the D-number is
  free. Merge it yourself when green and watch the deploy.
- **Flag it done:** delete this file, add a Done row in [README.md](../README.md) with the merge commit, and set H125 to
  Ready when H121 and H122 are done too.
