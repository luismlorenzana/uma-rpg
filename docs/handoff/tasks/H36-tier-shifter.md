# H36 — The Tier shifter and the tints

**uma-rpg (and uma-platform's kit) · Either · S–M · Needs: H35 (the active tier and `setActiveTier`) · Unblocks: nothing**

## Why

D159 approved a Tier shifter on the top bar's tier crest, and a light tint per tier ([tiers](../../design/tiers.md) §4,
T2). H35 gives the app an active tier and remounts the shell when it changes. But nothing on screen switches tiers yet,
and nothing shows which world you're in.

This packet adds both:
- the crest opens a sheet with one card per tier;
- Tier 2 looks like dusk and Tier 3 like night. Tier 1 stays exactly as it is today.

Tiers 2 and 3 stay locked until the Rift promotes Umas. Today the sheet shows Tier 1 and two locks.

## Context (read first)

- **uma-rpg:** `CLAUDE.md`, `AGENTS.md`, [change-protocol.md](../../change-protocol.md). Anything uma-kit draws
  changes in uma-platform's `packages/kit` and ships as a kit release. Behaviour only one game needs becomes a kit option.
- **The design:** [tiers.md](../../design/tiers.md) §4 ("The Tier shifter", T2), §6's tier names, and D159 in
  [decisions.md](../../decisions.md).
- **H35's delivery:** the active tier in the store (`rpg.tier` on the device), `setActiveTier`, the shell under
  `key={activeTier}`, and `useWorld()` on the active world. This packet calls them `useActiveTier()` and
  `setActiveTier(tier)`. Use the names H35 shipped.
- **uma-rpg web** (`apps/web/src/`):
  - `hub/Bars.tsx`: `RpgAccountBar` passes `tier={1}` and the label `Account: {name}, Tier 1`;
  - `hub/Shell.tsx`: `AppFrame`, the global sheets (`?sheet=menu`, `?sheet=featured`) and `closeSheet`;
  - `hub/MenuSheet.tsx`: the pattern for a kit `Sheet`. `hub/Featured.tsx` has `withoutSheet`;
  - `hub/grounds.ts`: each page's `PALETTES` entry. `hub/HubScreen.tsx`: `HubMap`, and `?canvas` for screenshots;
  - `app/Root.tsx`: it sits outside the keyed shell.
- **uma-platform's kit** (`packages/kit/`):
  - `README.md`;
  - `src/shell/AccountBar.tsx`: the crest is a 12 px `tier/n` mark inside the account link's disc;
  - `src/shell/AppFrame.tsx`;
  - `src/shell/BottomBar.tsx`: the menu is a `Link` taking `{ to, label, text, state? }`;
  - `src/shell/nav.ts`: Back closes a sheet that was opened as a link;
  - `src/ui/UiMark.tsx` (`TierCrest`), `src/ui/BottomSheet.tsx` (`Sheet` portals to `document.body`),
    `src/ui/appearance.ts` (`<html data-theme>`), `src/ui/motion.tsx` (`useReducedMotionSetting`, `setReducedMotion`);
  - `theme.css`: the accent tokens, the layered `[data-theme='dark']` rule and the unlayered `prefers-color-scheme` block;
  - `src/hub/HubCanvas.tsx`, `HubMap.tsx`, `palettes.ts` and `scene/HubScene.ts`. The map stamps uma-art's tiles and
    buildings; `ground.palette` only paints the background and the code fallback;
  - the test styles: `src/places/frames.test.tsx` (server render) and `src/work/actions.test.tsx` (jsdom).
- **uma-platform docs:** `docs/handoff/README.md` § "Releases while packets run in parallel", and `docs/decisions.md`
  (P-numbers).
- **uma-racer:** run `git -C ~/workspace/uma-racer fetch -q origin`, then
  `git -C ~/workspace/uma-racer show origin/main:apps/web/src/hub/RacerShell.tsx`. Its `AccountBar` passes no `tier` and
  its `AppFrame` no tint, so both new options stay off there.

## Decisions made

**Kit: the shifter**
- `AccountBar` keeps `tier?: number`. It gains
  `tierShifter?: { readonly to: string; readonly label: string; readonly state?: unknown }`.
  - It's drawn only when `tier` is set as well.
  - It's a link like the bottom bar's menu (`state` defaults to `{ back: true }`), so Back and the edge swipe close the
    sheet.
  - This replaces the design's sketch, `tier: { value, onOpen }`: `tier` is already a number prop, and a link matches
    the menu.
- **Without `tierShifter`,** the bar's markup is today's. uma-racer passes neither, so it doesn't change.
- **With it,** the crest moves out of the account link into a link of its own:
  - it carries `data-kit="tier-shifter"`, and `aria-label` is the given label;
  - the crest is drawn at exactly today's spot, the disc's bottom-right corner;
  - the hit box is the bar row's height and 44 pt wide, starting at the crest's left edge;
  - it sits above the account link and below the chips. The initial still opens the Account, and a crowded chip row
    keeps its full tap areas;
  - it adds no width: at 375 pt with a sync chip the bar is already full;
  - there's no caret or new mark. The crest is the button.

**Kit: the tint**
- Theme tokens are kit-owned, so the tint is a kit option:
  - `AppFrame` takes `tint?: Tint`, with `type Tint = 'day' | 'dusk' | 'night'`, default `'day'`;
  - `Tint` and `TINTS` are exported from `/shell`.
- AppFrame applies the tint as `<html data-tint>` in a layout effect while it's mounted.
  - `'day'` and unmounting remove it.
  - It goes on `<html>`, not on the frame's div, because sheets portal to `document.body` and must tint too.
- `theme.css` changes only `--color-accent`, `--color-accent-strong` and `--color-accent-wash` under a tint, in light
  and dark.
  - `--color-accent-ink` (#1b1406) stays: it keeps at least 6:1 contrast on every tinted accent.
  - The page, panel and ink tokens don't change. The design says "the theme stays the same".

| Tint | Light: accent · strong · wash | Dark: accent · strong · wash | Hub wash |
|---|---|---|---|
| `day` (Tier 1) | today's | today's | none |
| `dusk` (Tier 2) | `#e08a3c` · `#c06c1f` · `#fcebdc` | `#e89a52` · `#f4b072` · `#2e2013` | `rgb(176 84 24 / 0.16)` |
| `night` (Tier 3) | `#9d86e8` · `#7a62cf` · `#efebfc` | `#a894f0` · `#c1b2ff` · `#231e3a` | `rgb(28 22 92 / 0.32)` |

- **The selectors** are all unlayered, after the existing dark block, so they win over it:
  - light: `:root[data-tint='…']`;
  - dark: `:root[data-theme='dark'][data-tint='…']`;
  - fights' dark subtrees: `:root[data-tint='…'] [data-theme='dark']`;
  - the phone's dark mode: `:root[data-tint='…']:not([data-theme='light'])` inside the `prefers-color-scheme: dark`
    media.
- **The Hub gets one wash over the map, not a new palette.**
  - The map is uma-art's art stamped from the atlas. A per-tier `ground.palette` would only tint the background and the
    fallback, never the art.
  - `HubCanvas` renders a sibling after its host: `<div data-kit="hub-tint" aria-hidden>`, absolute, inset 0, with no
    pointer events.
  - `theme.css` hides it unless `<html>` has a tint. Then it fills it with `var(--kit-hub-tint)`, set in each tint's
    light rule.
  - Normal blending, no `mix-blend-mode`: it's cheaper over WebGL, and the same under the Canvas renderer.
  - It sits under the place buttons, pips and plaza chibis, so names stay crisp.
  - uma-rpg's `grounds.ts` doesn't change.
- **Tier 1 is exactly today:** no attribute, no wash layer, no token change.
- **The colours are starting values.** If a wash reads too strong at phone width, lower its alpha by up to 0.06. Log
  the final values in the P-decision.

**Kit: the release**
- One minor changeset: the next minor after the latest published version (0.11.0 if 0.10.0 is still the latest).
- uma-racer doesn't need to pin it. Nothing changes there.

**uma-rpg: the tier list**
- `TIERS` in the domain, beside H35's tier helpers (else beside `TIER_ONE` in `save/rules.ts`):
  - `{ tier: 1, name: 'Apprentice', look: 'day' }`;
  - `{ tier: 2, name: 'Adept', look: 'dusk' }`;
  - `{ tier: 3, name: 'Master', look: 'night' }`.
- The names are tiers.md §6's (Option A, D159). There are three because master data has tiers 1–3 and uma-art has
  three crests.
- The `look` type is the domain's own string union. It matches the kit's `Tint` structurally, and the domain never
  imports the kit.

**uma-rpg: the bar**
- `tier` is the active tier, and `tierShifter.to` is `?sheet=tier` over the current route, like the menu.
- The account link's label is `Account: {name}`. The shifter's label is `Tier {n}, switch tiers`.

**uma-rpg: the tier sheet**
- `hub/TierSheet.tsx`: a kit `Sheet` titled "Tiers", in the Shell's overlays next to the menu and featured sheets.
- A pure `tierCards(save, active)` builds the cards; the component only draws them.
- There's one card per tier, 1 to 3, in order.
- **A tier with a world** (`save.tierWorlds[n]` exists) is a button. It shows:
  - `TierCrest` at 24 pt;
  - "Tier n · Name";
  - the Uma count: "No Umas yet", "1 Uma" or "12 Umas";
  - the Rift line, from one `riftLine(world)` that returns "The Rift isn't open yet" until the Rift packet replaces it.
- **The active tier's card** has an accent border and `aria-current="true"`. Tapping it just closes the sheet.
- **A tier with no world** isn't a button (`aria-disabled`). It shows:
  - the crest at half opacity;
  - the kit's `LockedIcon`;
  - "Tier n · Name";
  - "Promote Umas through the Tier n−1 Rift".
  It has no count and no Rift line.
- Today that's Tier 1 open, and Tiers 2 and 3 locked.

**uma-rpg: the switch**
- `switchTier(n)` runs when another open tier is picked:
  1. a veil in the page colour (`bg-page`) fades in over 120 ms (`--duration-fast`);
  2. it calls H35's `setActiveTier(n)` and `navigate('/town', { replace: true })`. The shell remounts on Town Hall, and
     the sheet goes with the old shell;
  3. after two animation frames, the veil fades out over 260 ms (`--duration-emphasised`).
- Under reduced motion (`useReducedMotionSetting()`) there's no veil, and the switch is immediate.
- The veil is uma-rpg's: `hub/TierVeil.tsx`, rendered in `Root`, outside the keyed shell, so it survives the remount.
  - It's the game's own transition, not a change to anything the kit draws.
  - The page colour is what a blank frame shows during the remount, so nothing flashes.
  - If H35 shipped a fade for tier switches, use it instead of adding a second one.
- **The tint:** the Shell passes `tint={look of the active tier}` to `AppFrame`. Tier 1 passes `'day'`.
- There's no new route, place or save field.

## Do

### Part 1: uma-platform's kit (it can start before H35 lands)

1. Make a worktree on `origin/main`.
2. `src/shell/AccountBar.tsx`: add `tierShifter` as decided. Without it, keep the markup byte for byte.
3. `src/shell/AppFrame.tsx`: add `tint` with its `<html data-tint>` layout effect. Export `Tint` and `TINTS` from
   `src/shell/index.ts`.
4. `theme.css`: add the tint rules and the `hub-tint` rules.
5. `src/hub/HubCanvas.tsx`: add the wash `div`.
6. **Tests:**
   - `src/shell/bars.test.tsx`: a server render in a `MemoryRouter`, with a `KitArtProvider` whose stub `ui` atlas holds
     `tier/1` to `tier/3`.
     - Without `tierShifter`: no `data-kit="tier-shifter"`, and the crest's `data-mark` is inside the account link.
     - `tier={2}` with `tierShifter`: one link with that label and href, holding `data-mark="tier/2"`, and no crest
       inside the account link.
     - `tierShifter` without `tier`: no shifter.
   - `src/shell/frame.test.tsx` (`@vitest-environment jsdom`):
     - `tint="night"` sets `data-tint="night"` on `<html>`;
     - re-rendering with `"day"` removes it, and so does unmounting;
     - no `tint` never sets it.
   - A Hub test: `HubCanvas` renders the `hub-tint` layer, `aria-hidden`, with no pointer events.
   - A theme test that reads `theme.css`. For `dusk` and `night` it finds:
     - the three accent tokens in the light rule, both dark rules and the media rule;
     - `--kit-hub-tint` in the light rule.
7. **README:** add `AccountBar`'s `tierShifter` and `AppFrame`'s `tint` to the shell section.
8. **The changeset** (minor): "AccountBar: `tierShifter` makes the tier crest a link of its own. AppFrame: `tint`
   (`day`, `dusk`, `night`) shifts the accent and washes the Hub map. Both are off by default."
9. **Check it in both games,** as the change protocol says. Build the kit and copy it over each game's installed copy
   (the master prompt's steps). Never commit the copy.
   - **uma-rpg:** run its dev server, at 390×844 and 375×667, in light and dark.
     - In the console, set `document.documentElement.dataset.tint` to `'dusk'`, then `'night'`.
     - The accent and the Hub's wash change. Open the Hub with `?canvas` to see the map.
     - Remove the attribute, and the app is today's.
   - **uma-racer:** its web tests (`pnpm --filter @racer/web test`) pass. In its dev server on your own port, its top
     bar and Hub look as before at 390 px.
10. Run `pnpm lint && pnpm test && pnpm build` in uma-platform.
11. **The P-decision** in `docs/decisions.md`: fetch `main` first, and take the next free number (P66 if none landed).
    It records the two options, the final tint values, why the tint sits on `<html>`, and why the Hub gets a wash.
12. **Release,** as the queue README says: fetch `main`, rebase, run `pnpm version-packages`, then push or merge.
    Confirm the version with `gh api /user/packages/npm/uma-kit/versions --jq '.[].name'`.

### Part 2: uma-rpg (once H35 is on `main` and the kit version is listed)

1. Make a worktree. Pin `@luismlorenzana/uma-kit` to the exact new version in `apps/web/package.json`. Then run
   `NODE_AUTH_TOKEN=$(gh auth token) pnpm install`.
2. **Domain:**
   - add `TIERS` and its `look` type;
   - add a `tiers` live block to `packages/domain/src/docs/render.ts`: Tier · Name · Look (Day, Dusk, Night).
3. **`hub/Bars.tsx`:**
   - `tier` comes from the active tier (H35 may have done this already);
   - add the shifter link, `withParam(location, 'sheet', 'tier')`;
   - use the two labels.
4. **The sheet and the switch:**
   - `hub/TierSheet.tsx`: `tierCards`, `riftLine` and the sheet;
   - `hub/TierVeil.tsx`: the veil and `switchTier`;
   - Shell: the sheet in the overlays, and `tint` on `AppFrame`;
   - Root: `<TierVeil />`.
5. **Tests** (`hub/TierSheet.test.tsx`):
   - **The cards,** from a synthetic two-tier save. Use `newSave`, plus `tierWorlds['2'] = newTierWorld(now, 0)` holding
     two Umas. There are three cards:
     - Tier 1, with its count, "The Rift isn't open yet" and `aria-current`;
     - Tier 2, open, with "2 Umas";
     - Tier 3, locked, with "Promote Umas through the Tier 2 Rift" and no button.
   - **A one-tier save** locks Tiers 2 and 3.
   - **Picking,** with reduced motion on (`setReducedMotion(true)`):
     - Tier 2 calls the mocked `setActiveTier` with tier 2 and lands on `/town`;
     - the active tier calls nothing and closes the sheet.
   - **The looks:** Tier 1 is `day`, Tier 2 `dusk` and Tier 3 `night`.
   - **The bar:** the crest is a link to `?sheet=tier` named "Tier 1, switch tiers", and the account link is named
     "Account: {name}".
6. **Docs:**
   - `docs/game/sections.md`:
     - the Account bar: the initial opens the Account, and the crest opens the Tier sheet;
     - a new bullet, the **Tier sheet** (`?sheet=tier`);
     - the bottom bar: "gold" becomes "the tier's accent (gold in Tier 1)";
     - a `## Tiers` section before `## Global UI`. Merge it with H35's if H35 added one. It covers one world per tier,
       the active tier, the sheet and its locks, the fade, the looks, and the `tiers` live block;
   - run `pnpm docs:update`. It fills the live block and the kit version in `dependencies.md`;
   - `docs/handoff/README.md`: the kit version in "This game runs on…";
   - the D-decision in `docs/decisions.md`: fetch `main` first, and take the next free number.
7. **Check it locally,** in the dev server at 390×844 and 375×667, in light and dark. Never the iOS Simulator (P60).
   - **Tier 1 looks exactly as before.** Take screenshots of the top bar and the Town Hall map (`?canvas`) before and
     after the change. They match.
   - The crest opens the sheet, and Back and ✕ close it. The initial still opens the Account.
   - **A scratch two-tier save:**
     - stop the web;
     - run a script from your scratch folder, never committed, that adds `tierWorlds['2'] = newTierWorld(now, 0)` to the
       local API save (`apps/api/.data/save.json`);
     - clear the site's data, and reload.
   - Switching to Tier 2 fades and lands on Town Hall. It shows the silver crest, the amber accent and the dusk wash.
     Switching back restores today's look.
   - Undo the scratch save afterwards.
8. Run `pnpm lint && pnpm test && pnpm build`. The main JS stays under 230 KB gzip (D56).

## Done when

- [ ] **uma-platform:** lint, test and build pass, with the four new tests. The new uma-kit version is published, and
  the README and P-decision are in.
- [ ] **uma-racer,** checked with the kit build: its tests pass, and its bar and Hub are unchanged.
- [ ] **uma-rpg:** it pins the exact version. Lint, test and build pass, and `pnpm docs:update` leaves no diff.
- [ ] **Tier 1** matches the before screenshots. The crest opens the sheet, Back closes it, and the initial opens the
  Account.
- [ ] **With the scratch two-tier save:**
  - the switch fades, lands on Town Hall and shows dusk;
  - Tier 3 is locked, with "Promote Umas through the Tier 2 Rift".
- [ ] The manual and the D-decision are in. The deploy is green.

## Deliver

- **Claude:**
  - **uma-platform:** commit to `main`:
    - `feat(kit): a tier shifter on the top bar's crest and a tint per tier (H36)`;
    - then `chore(release): uma-kit 0.11.0`, or whichever version you release.

    Push, and confirm the version is listed.
  - **uma-rpg:** commit to `main`, `feat(web): the Tier shifter and a tint per tier (H36)`. Push, and watch the deploy
    with `gh run watch <id> -R luismlorenzana/uma-rpg --exit-status`.
- **ChatGPT:** a branch `h36-tier-shifter` and a pull request in each repo, with the same titles.
  - Merge uma-platform's first, after green CI. Run `pnpm version-packages` on the branch just before merging.
  - Open uma-rpg's once the version is listed, and merge it after green CI.
- **Tell the owner:** the delivery touches the top bar at the screen's top edge. The owner checks the crest's tap and
  the tints on the phone.
- **Flag it done:**
  - delete this file;
  - add a Done row to `docs/handoff/README.md`, with the commit and the kit version.

  H36 isn't in uma-platform's queue, so there's nothing to set there.
