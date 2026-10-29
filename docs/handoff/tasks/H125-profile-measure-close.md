# H125 — Uma profile v2: measure the built screens against the budgets, the phone check, and close the old contract

**uma-rpg · Claude · S · Needs: H117, H118, H119, H121, H122, H124 · Unblocks: nothing (re-run after H120 and H123)**

## Why

The approved v2 (D239) made "compact" a number instead of a feeling: budgets B1–B4 (UP28) for the header, each tab, each
sheet and the common tasks, measured in each packet. Five packets built the profile piecemeal; this one **measures the
whole as built** at 390×844 and 375×667, writes the numbers beside the proposal's, rewrites the **phone check** for the
new profile, puts the **superseded banner** on the old guideline (`profile-ux.md`, D229; UP1), and **reads the manual's §
Stable through** as one page.

The Class and Template tabs are skeletons until H120 and H123 (both wait for the Classes v3 design), so their rows are
reported now and gated when those land: this packet leaves the method in the proposal so the re-run needs no packet.

## Context (read first)

- `CLAUDE.md`, `AGENTS.md`; the D-rows of H117–H124 in [decisions.md](../../decisions.md) (what each built and
  decided).
- **The proposal** ([proposal.md](../../design/uma-profile-v2/proposal.md), D239): **§9** (the contract: S1–S3, G1–G5,
  C1–C10, V1–V3, **B1–B4**, and its phone checks), **§10** (the numbers as drawn: §10.1 header, §10.2 scroll per tab and
  "everything about her", §10.3 taps), §13 (the manual), §14 **UP1** (this doc replaces profile-ux.md) and **UP28**.
- **The audit** ([audit.md](../../design/uma-profile-v2/audit.md)) §6.1–§6.3: how today's numbers were measured (screens
  = the scroll height ÷ the visible height, 683 px at 390×844 and 506 at 375×667, the header and the frame's 96 px of
  bottom padding included), so before and after compare.
- **The docs to close:** [profile-ux.md](../../design/profile-ux.md) (D229's guideline, "Status: built");
  [phone-check.md](../../testing/phone-check.md) (steps 7–12 are the profile, 16 the Observatory; the list of busy screens
  to repeat at 375×667 in its preamble); [sections.md](../../game/sections.md) § Stable, § Party Hall, § Halls of
  Heroes, § Observatory, and every manual page that names a profile tab (`git grep -n "tab" -- docs/game`).

## Decisions made

### From the proposal, exact

| Budget | Gate at 390×844 | As drawn (§10) |
|---|---|---|
| **B1** the tab bar's top | ≤ 150 px | 144 (375×667 too) |
| **B2** Class | ≤ 1.4 screens | 1.35 (1.82 at 375×667) |
| **B2** Gear | ≤ 1.0 | 0.97 (1.31) |
| **B2** Stars | ≤ 1.4 | 1.16 (1.56) |
| **B2** Template | ≤ 1.4; with an open pick ≤ 1.6 | 1.31, 1.57 (1.77) |
| **B3** every sheet (Details, Gear's four, Stars' two, …) | no scroll | Details 660 px |
| **B4** the tasks of §10.3 | the "Proposed" counts | e.g. next Uma 1, back to her 1, Raise all 3, her moon's jewel 3 |

**The phone checks (§9):** at 390×844 and 375×667, light and dark: target marks readable on every portrait; 44 pt and an
accessible name on every icon; nothing clipped on long names; the four tabs, the class row and the five armor tiles fit
without horizontal scroll; sheets fit above the bar and leave the selection as it was; **the budgets measured; the copy
test passes; no text under 11 px; green only for Ready.**

### Build decisions (log them in the D-row)

1. **Gate what's final, report the skeletons:** Gear, Stars, Details, the header and the doors are gated now; Class and
   Template are measured and reported, and gated by the re-run after H120 and H123.
2. **The test save:** a scratch save (never the owner's) with Umas like §4's: **Uma A** (Lv 40, three raises and two
   jewels ready, her signature not worn), **Uma B** (an open Pace pick), a Lv 50 Uma, a Paladin, a working Uma, a party
   of five, a Hall seat with Learners, and a locked Pace outfit.
3. **A miss** is fixed here when spacing fixes it (gaps, padding, the frame's rows); otherwise its number goes into
   §10 with a new queue row in the handoff README naming the fix (the next free packet id). Nothing is cut to meet a
   number without the owner's word.
4. **The numbers live in the proposal:** §10 gains a "Measured (H125, date)" column in §10.1–§10.3 and a short **"How
   to measure"** subsection with the snippet below, so the re-runs after H120 and H123 follow it as written.
5. **The proposal's status line** becomes "Approved (D239). Built: H117–H119, H121, H122, H124 (measured in H125); H120
   and H123 wait for the Classes v3 design." **profile-ux.md** gets a banner under its title, "Superseded by the Uma
   profile v2 (D239): [the proposal's §9](uma-profile-v2/proposal.md#9-the-contract-that-replaces-d229) is the profile's
   contract.", and its status line "Superseded (D239)"; nothing else in it changes (it is history).
6. **The phone check's profile steps are rewritten whole** (today's 7–12 and 16): the header and the facts row (Party,
   Work, Details), Details, the four tabs as built (Gear's raise sheets and Raise all, Stars' Set and Set all; Class and
   Template as they stand), the doors with Back and ‹ ›, the Observatory as a door; §9's checks go in as the profile's
   "check on the phone" lines, and the local-only ones (the budgets, the copy test) as one line pointing at the
   proposal's "How to measure". The preamble's busy screens at 375×667 name the Class, Gear and Stars tabs and Details.

## Do

1. **Build the test save** (decision 2) on your own ports (API `AUTH_MODE=disabled PORT=8091
   LOCAL_SAVE_FILE=.data/scratch-h125.json`, web 5184).
2. **Measure** at 390×844 and 375×667, light and dark, every tab with Uma A and Uma B, every sheet, the locked page:
   ```js
   const main = document.querySelector('[data-place-page] main')
   const bar = document.querySelector('[data-kit="profile"] [role="tablist"]')?.parentElement
   ;({ tabBarTop: bar && Math.round(bar.getBoundingClientRect().top - main.getBoundingClientRect().top + main.scrollTop),
      screens: +(main.scrollHeight / main.clientHeight).toFixed(2) })
   const body = document.querySelector('[data-kit="sheet"] .overflow-y-auto'); body?.scrollHeight <= body?.clientHeight
   ```
   Then "everything about her" (the sum of the tabs and Details, §10.2's row), and B4's tap counts for every §10.3 row
   that exists today. Check §9's phone-check list in the browser at both sizes (text sizes with `getComputedStyle`; no
   element under 11 px in the profile; green only on Ready dots).
3. **Fix** spacing misses (decision 3); rerun the measures.
4. **Write the results** into the proposal's §10 and "How to measure" (decision 4), its status line, and the banner on
   profile-ux.md (decision 5).
5. **Rewrite the phone check's profile steps** (decision 6).
6. **Read the manual through:** § Stable whole (routes, the roster and its doors, the frame, the facts row, Details,
   the four tabs, locked, the stepper), § Party Hall, § Halls of Heroes, § Observatory, and every page naming a profile
   tab; each sentence true to the built code, nothing left from the old five tabs. `pnpm docs:update`.
7. **Log the D-row** (fetch `main` first): "H125: the profile v2 measured; the phone check; D229 superseded", with the
   headline numbers (tab bar top, each tab's screens, everything about her) and decisions 1–6.

## Done when

- [ ] Every gated budget is met at 390×844, or its miss is written in §10 with a queue row (decision 3); the measured
  numbers at both sizes are in the proposal's §10 and the pull request.
- [ ] §9's phone checks pass in the browser at both sizes, light and dark; the copy test passes.
- [ ] The proposal's status line, its "How to measure", and profile-ux.md's banner are in.
- [ ] The phone check's profile steps describe the built profile; the manual reads true; `pnpm docs:update` leaves no
  diff.
- [ ] `pnpm lint && pnpm test && pnpm build` pass (say the main JS number, of 230 KB, if any code changed). Nothing from
  the original games in git (`git status`; screenshots stay local).
- [ ] Deployed green (`gh run watch <id> -R luismlorenzana/uma-rpg --exit-status`) and
  https://uma-rpg.web.app/api/health shows the merge commit.

## Deliver

- **Claude:** a branch `docs/h125-profile-measure` (`fix/…` if spacing changed code) and a pull request, "docs: the Uma
  profile v2 measured, the phone check, and D229 superseded (H125)". Fetch `main` before you push so the D-number is
  free. Merge it yourself when green and watch the deploy.
- **Flag it done:** delete this file and add a Done row in [README.md](../README.md) with the merge commit. Leave the
  H120 and H123 rows saying they re-run the proposal's "How to measure" when they land.
