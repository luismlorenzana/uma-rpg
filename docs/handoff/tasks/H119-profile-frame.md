# H119 — Uma profile v2: the new frame (four tabs, the compact header and facts row, Details, routes, locked)

**uma-rpg · Claude · M · Needs: H117 (the words), H118 (uma-kit 0.16.0) · Unblocks: H120, H121, H122, H124; H123 through
them**

## Why

The approved Uma profile v2 (D239) replaces today's five tabs under a 284 px header with **four fixed tabs, Class · Gear
· Stars · Template, under a 144 px header**: display-only numbers move to a **Details** sheet, her work and party to a
**facts row**, and Extra Stats come in from the Observatory. Every later profile packet builds inside this frame, so it
ships first, as a **skeleton**: the frame, the header, the facts row, Details, the routes and the locked state are
final; each tab carries today's content until its own packet rebuilds it (H120 Class and H123 Template wait for the
Classes v3 design; H121 Gear and H122 Stars follow this one).

No rule, save or engine change. The only stored change is the device's tab key.

## Context (read first)

- `CLAUDE.md`, `AGENTS.md`, [change-protocol.md](../../change-protocol.md) (the header is uma-kit's; H118 made the
  option, so nothing here forks it).
- **The proposal** ([proposal.md](../../design/uma-profile-v2/proposal.md), D239):
  - §0 (at a glance), §2.1 (three layers), §2.2 (the diagram), §2.3 (four tabs, fixed), §2.4 (one grammar);
  - **§3 entire:** the header (§3.1), the facts row (§3.2), **the Details sheet (§3.3)**, locked and elsewhere (§3.4);
  - §6.2's first paragraph (the routes and the remembered tab), §6.3 (links out: the Party and Work cells);
  - §7.2 (the wording list; H117 made it `places/stable/copy.ts`), §7.3 (type scale), §7.4 (state language);
  - §9 (the contract: S1–S3, G4, V1–V3, **B1 and B3**), §10.1–§10.2 (the header and scroll numbers), **§12 (what moves
    where: every surface and datum)**, §13 (save, bundle, manual);
  - §14: UP2–UP5, UP7–UP9, UP19, UP29, UP31; §15 (this packet's row).
  - The [tabs page](../../design/uma-profile-v2/previews/tabs.html) draws the header, the facts row and the Details sheet
    at 390×844, light and dark; the [doors page](../../design/uma-profile-v2/previews/doors.html) the routes.
- **The audit** ([audit.md](../../design/uma-profile-v2/audit.md)): §1.1 (every surface), §6.1–§6.2 (how scroll and the
  header were measured), **§7 (what a redesign must keep: every action, datum and behaviour)**.
- **The code on `main` at `6a6996f`** (H117 changes its strings, not its shape; re-read the files after it lands). Paths
  under `apps/web/src/`:
  - `places/stable/StablePage.tsx :21–39`: the route split (`outfit/:id`, `outfit/:id/skills` → `SkillsRoute`);
  - `places/stable/OutfitProfile.tsx`: the tabs, labels, dot and tab key (`:46–63`, `rpg.profile.tab.v2`), the frame
    (`:86–154`, "All outfits" `:117–121`), `TargetToggle :157`, `Summary :172–209`, `ElsewhereNote`/`UnlockBox
    :213–235`, `BattleTab :239–309`, `SkillsTab :313–339` with `InheritanceCard :342`, `GearTab :401–422` (Equip/Upgrade
    tabs and the session key `rpg.profile.gearView`), `WorkTab :426–463`, `RacingTab :467–528`;
  - `places/stable/TemplateCard.tsx` (the chip's sheet `:28–46`, the calling card `:52–88`), `template-view.ts`;
  - `places/stable/GearCardV3.tsx` (`EquipView`, `UpgradeView`), `SkillsPage.tsx`;
  - `places/observatory/ObservatoryPage.tsx :114–180` (`ObservatoryV3`: the map, Prowess, the totals, Set, the node
    sheet) and `:210–226` (`StarMapV3`);
  - `album/upgrades.ts` (`umaUpgrades`) over the domain's `save/upgrades.ts :78–106` (`upgradesFor`: `gear` counts ready
    raises, `stars` ready jewels);
  - `places/PlacePage.tsx` (the place header; Back is the kit's `useLeave`: it pops an entry pushed with `{ back: true }`,
    else replaces with the place); `hub/navigation.ts`.
  - The domain: `save/sheet.ts` (`umaBattleSheet`, every row 0 included), `projectRpgStats`, `umaTrade`, `tradePlaces`
    (a trade's first place is its gathering place), `slotJobOf`, `partyOf`, `isInFight`.
- **uma-kit 0.16.0** (H118): `ProfileFrame`'s `size: 'compact'` and `progress`; its `summary` slot, `tabs` with `dot`
  and `dotLabel`; the `Sheet` behind `ui/BottomSheet.tsx` (`footer`, scrolls under its header, `max-h-[92dvh]`).
- **The manual:** [sections § Stable](../../game/sections.md#stable) and the pages that name the old tabs
  (`git grep -n "Skills tab\|Battle tab\|Racing tab\|Work tab" -- docs/game`: classes.md, heroes.md, combat.md,
  skill-trees.md); [phone-check.md](../../testing/phone-check.md) steps 7–12.

## Decisions made

### From the proposal, exact

- **Four tabs, fixed** (UP3, UP4): `class` "Class", `gear` "Gear", `stars` "Stars", `template` "Template", in that
  order, never by state or tier. A locked Uma has no tab bar (UP29).
- **The header** (UP7, §3.1), through `ProfileFrame size="compact"`: the 64 px bust (her icon while it loads); her name;
  her outfit title with her rarity stars after it on one line; `level` "Lv 40" with `progress` `{ value: exp, max: next,
  label: "1,200/2,400" }`, at max full with "Max · 301 EXP" (H117's builders); the Target (44 pt, ten at most, its
  error under it) in `corner`. **The template chip and its sheet, the calling card, the class cell and "‹ All outfits"
  leave the header.** The place header's Back is the only Back.
- **The facts row** (UP8, §3.2) in `summary`: three 44 pt cells, a label over a value:
  - **Party:** "Party 1" · "Fighting" (accent) · "No party"; a tap opens her party's editor (`/town/party-hall/{n}`), or
    the party list with none;
  - **Work:** "Mine · 1h 20m" · "Mine · Done" · "Idle"; a tap opens her job's place, or when idle her trade's first
    place (`tradePlaces(umaTrade(…))[0]`);
  - **Details:** opens the Details sheet.
  Both links push with `{ back: true }`, so Back returns to her profile on the same tab (§6.3).
- **The Details sheet** (UP9, §3.3): one read-only sheet, about one screen at 390×844 (B3), every row a label and a
  number with its parts after it:
  - **Offense:** ATK and M.ATK (base · gear · Stars, ★ her moon's part), Might for each weapon, the accessory, ★ Signature
    (Worn or Not worn, always listed); **Defense:** DEF, M.DEF, Evasion with its parts; **Sustain:** HP, MP with its
    regen, a Paladin's or a Cleric's Mends, ★ Flourish; **Other:** Limit start;
  - **Core:** Speed, Stamina, Power, Guts, Wit, each with its racing base and growth on a second line ("98 · +20%");
  - **Work:** Craft Level and its EXP, the open grade and the next gate, her trade;
  - **Since:** "Unlocked 12 Oct 2026";
  - **every row of `umaBattleSheet` stays, 0 included**; at the end, **"How stats add up"** as an inline expander (no (i)
    inside a sheet: a second sheet), one source a line (H117's Battle (i) lines move here);
  - **gone:** "Fights as …", "10 gathered" (H117 already), "Total with armor".
- **Locked and elsewhere** (UP29, §3.4): the portrait dimmed with the lock, no level; the facts row becomes **Unlock · 1
  Ticket** (the kit's `UnlockConfirm`), "In Tier 2", or "Unlock in Tier 1"; the ticket count stays in the top bar only;
  below, the Template tab's content and no tab bar. A locked Pace or Late Uma's calling reads **"Pick on unlock · Spell
  Blade or Mage"** (H117's `unlock` builder; closes U5).
- **Routes** (§6.2): `/town/stable/outfit/:id/:tab` with `class`, `gear`, `stars`, `template`; `outfit/:id` opens the
  remembered tab; **a route naming a tab wins**. The tab memory is **`rpg.profile.tab.v3`**, per device; on first read it
  takes v2's value: skills, battle and work → class; gear → gear; racing → template (§12).
- **Budgets:** **B1**, the tab bar starts at ≤ 150 px at 390×844 (144 as drawn); **B3**, the Details sheet doesn't scroll
  at 390×844.

### Build decisions (log them in the D-row)

1. **The skeleton's tabs** (each rebuilt later):

   | Tab | Carries now | Rebuilt by |
   |---|---|---|
   | Class | Today's Skills content: `SkillsPage`, the Inheritance card, the Class Ranks grid | H120 (after Classes v3) |
   | Gear | Today's Equip view, then the Upgrade view, stacked; the Equip/Upgrade tabs and their session key go | H121 |
   | Stars | Her Observatory body (the map, Prowess, the six totals, the Set list, the node sheet), without the Uma picker | H122 |
   | Template | The template sheet's content inline (her name, the three readings, her trade, ★ Flourish, ★ Signature, ★ Moon I and II), the calling card while her pick is open, then her aptitudes (the Racing tab's chips) and her racing skill (name and text, loaded as today) | H123 (after Classes v3) |

   *Why:* nothing in §12's "what moves where" may disappear while H120 and H123 wait, and the calling card must land
   somewhere when it leaves the header.
2. **One source for the Stars body:** move `ObservatoryV3`'s body (everything under the Uma picker) and `StarMapV3` into
   `places/observatory/StarsPanel.tsx`, taking `outfitId`; the Observatory page renders its picker over it (until H122
   turns the page into a list), the profile's Stars tab renders it alone. Both are lazy chunks.
3. **Tab taps replace the URL** (`navigate(…/outfit/:id/:tab, { replace: true, state: location.state })`): the URL
   always names the tab, Back never steps through tabs, and a door's `{ back: true }` survives a tab change. `outfit/:id`
   with no tab replaces itself with its remembered tab's URL, keeping the state. An unknown segment opens the remembered
   tab. **`outfit/:id/skills` keeps today's Skills-alone route** until H124 redirects it.
4. **`places/stable/profile-tabs.ts`** (pure, tested), the one home for the frame's rules: `PROFILE_TABS` and labels,
   `tabFromRoute(segment)`, `storedTab()` and `rememberTab(tab)` (with v2's migration, removing the v2 key after reading
   it), `tabDots(upgrades, callingOpen)`, `firstDotTab(dots)` (Gear, then Stars, then Template; for H124's Can upgrade
   door), and **`profileDoor(outfitId, { tab?, list? })`** returning `{ to, state: { back: true, list? } }`: every door
   into the profile uses it (H122, H124), so the nav state has one shape.
5. **The tab dots, until their tab's packet:** Gear while a raise is ready (`upgrades.gear > 0`), Stars while a jewel is
   (`upgrades.stars > 0`), Template while her calling pick is open (the chip's dot moves to the tab), Class never.
   `dotLabel` "{Tab}, ready" (C7's word). *Why:* §5.5's rule, as far as today's data reaches; H123 adds the signature.
6. **New facts go into the wording list first** (`copy.ts` and the copy test): the stat parts `base {b} · gear {g} ·
   Stars {s}` (a zero part left out; her moon's part `★ {m}`), the core source `{base} · +{growth}%` (`{base}` at no
   growth), `Idle`, `Fighting`, `No party`, and the cell labels. **No green in Details:** parts are words in the faint
   ink (green means Ready only, UP23); ★ in the accent.
7. **Details' Flourish and Signature rows use the list's wordings** (H117's), not the §3.3 mock's shorthand ("★
   Flourish 4% · On"). *Why:* C3, one wording per fact.
8. **Details' layout:** two columns at 390 and 375 (Offense, Defense, Sustain and Other on the left; Core, Work and
   Since on the right), 14 px rows with the parts on an 11 px second line (§7.3). If it doesn't fit 390×844 without
   scrolling, tighten the gaps before cutting anything, and never drop a row.
9. **Removed:** `BattleTab`, `WorkTab`, `RacingTab`, `Summary`, `TemplateChip` and its sheet, the "All outfits" row,
   `GearTab`'s inner tabs and `rpg.profile.gearView`. Their data lives on in Details, the facts row and the Template
   tab (decision 1).
10. **The JSX check** (H117's copy test) lists every new `.tsx` file this packet adds (`DetailsSheet.tsx`,
    `FactsRow.tsx`, `TemplateTab.tsx` or whatever you name them).
11. **Bundle:** the frame, Details and the Stars body load in the Stable's lazy chunks (the Stars body in a chunk shared
    with the Observatory). Expected main JS change: under +0.2 KB (the kit's compact branch, if `uma-kit/places` is in
    the entry at all).

## Do

1. **`profile-tabs.ts`** (decision 4) and its tests.
2. **Routes:** `StablePage.tsx` reads `outfit/:id/:tab`; `OutfitProfile` takes the tab from the route (decision 3).
3. **The frame:** `ProfileFrame size="compact"` with `progress`, the facts row in `summary`, the four tabs with their
   dots (decision 5), the skeleton bodies (decision 1); "All outfits" goes.
4. **The facts row** and **the Details sheet** (decisions 6–8), reading `umaBattleSheet`, `projectRpgStats`, the
   outfit's racing base stats and growth, and her Craft numbers; the inline "How stats add up".
5. **`StarsPanel.tsx`** (decision 2); the Observatory page renders it under its picker.
6. **The Template skeleton** and **the locked and elsewhere states** (§3.4).
7. **Delete** what decision 9 lists.
8. **Tests:**
   - `places/stable/profile-tabs.test.ts`: the four keys and labels in order; v2 → v3 for each of the five old values,
     the v2 key removed; an unknown or missing value → `class`; `tabFromRoute('gear')` → gear, `('skills')` → null;
     `tabDots` for each case in decision 5; `firstDotTab`; `profileDoor('81001', { tab: 'stars', list: [...] })` →
     `/town/stable/outfit/81001/stars` with `{ back: true, list }`.
   - `places/stable/OutfitProfile.test.tsx` (rewrite on `albumFixture`, `MemoryRouter` with `initialEntries`): four
     tabs in order; the route's tab is selected; `outfit/:id` with a stored v2 "racing" opens Template; a tab tap
     replaces the location (history length unchanged) and keeps `state.back`; the header shows "Lv n" and the EXP label;
     no "All outfits", no template chip; the facts row's Party ("Party 1", "No party", "Fighting") and Work ("Mine ·
     1h 20m", "Idle") cells and where each navigates with `{ back: true }`; Details opens and lists every `umaBattleSheet`
     row (0 included, a Paladin's Mends), the five core stats with base and growth, Work and Since, and the expander's
     lines; no "Fights as", no "Total with armor"; a locked outfit has no tablist, shows Unlock · 1 Ticket and the
     Template content with "Pick on unlock · …" on a Pace outfit; "In Tier 2" for one owned elsewhere; the Gear tab
     draws Equip and Upgrade at once.
   - H117's copy test passes with the new files listed.
9. **Measure** at 390×844 and 375×667 (decision: B1 and B3 gate; the tabs are reported, since their budgets are their
   packets'). In the browser console, a profile tab open:
   ```js
   const main = document.querySelector('[data-place-page] main')
   const bar = document.querySelector('[data-kit="profile"] [role="tablist"]').parentElement
   ;({ tabBarTop: Math.round(bar.getBoundingClientRect().top - main.getBoundingClientRect().top + main.scrollTop),
      screens: +(main.scrollHeight / main.clientHeight).toFixed(2) })
   // a sheet open: does its body fit without scrolling?
   const body = document.querySelector('[data-kit="sheet"] .overflow-y-auto'); body.scrollHeight <= body.clientHeight
   ```
   Record in the pull request: the tab bar's top at both sizes (B1 ≤ 150 at 390×844; 144 expected at both), Details at
   both sizes (B3: no scroll at 390×844), and each tab's screens at both sizes with an Uma like §4's Uma A (Lv 40, an
   open calling and a fixed one).
10. **Docs:** sections.md § Stable rewritten for the frame (routes, header, facts row, Details, the four tabs as they
    stand, locked); the other manual pages say "Class tab", "Gear tab", "Details" where they said Skills, Battle, Work or
    Racing; phone-check.md steps 7–12 for the frame (H125 rewrites them whole at the end); `pnpm docs:update`.
11. **Check it locally** at 390×844 and 375×667, light and dark, on your own ports (API `AUTH_MODE=disabled PORT=8091
    LOCAL_SAVE_FILE=.data/scratch-h119.json`, web 5184), on a scratch save (several Umas: a working one, one in a party,
    one with an open Pace pick, one at Lv 50, a Paladin, a locked Pace outfit, and one owned in Tier 2 if you can set it
    up): every tab, the facts row's links and Back from them to the same tab, Details, the locked page. Never the iOS
    Simulator.
12. **Log the D-row** (fetch `main` first): "H119: the profile v2 frame", decisions 1–11.

## Done when

- [ ] `pnpm lint && pnpm test && pnpm build` pass. Say the main JS number (gzip, of 230 KB; 223.46 before H117) and this
  packet's change; the profile, Details and the Stars body are in lazy chunks.
- [ ] The tests in step 8 pass; **the copy test passes**, and every new fact is in the wording list.
- [ ] **B1 and B3 measured and met** at 390×844 (the numbers in the pull request, with 375×667's beside them); the tabs'
  screens reported.
- [ ] Nothing from audit §7 is lost: every action, datum and behaviour is on a tab, in Details, in the facts row or in
  the Template skeleton (tick §12's table in the pull request).
- [ ] `pnpm docs:update` leaves no diff; the manual and the phone check describe the frame.
- [ ] The local check in step 11 was done at both sizes, light and dark, on a scratch save, and described. Nothing from
  the original games in git (`git status`).
- [ ] Deployed green (`gh run watch <id> -R luismlorenzana/uma-rpg --exit-status`) and
  https://uma-rpg.web.app/api/health shows the merge commit. The header sits under the place header, away from the
  screen's edges; say so in the delivery so the owner checks it on the phone.

## Deliver

- **Claude:** a branch `feat/h119-profile-frame` and a pull request, "feat(web): the Uma profile v2 frame, four tabs,
  the compact header, the facts row and Details (H119)", the body saying why (D239) and listing the measurements. Fetch
  `main` before you push so the D-number is free. Merge it yourself when green and watch the deploy.
- **Flag it done:** delete this file, add a Done row in [README.md](../README.md) with the merge commit, and set H121,
  H122 and H124 to Ready (H120 and H123 stay waiting for the Classes v3 design).
