# H30 — Sibling apps, Phase 0 (uma-rpg): fill the iPhone screen; Uma lists open on Uma Level

**Priority: now · ChatGPT · uma-rpg · S.** Ready. uma-racer's half is a separate packet in uma-racer's own handoff.

## Why

The owner approved the [sibling apps plan](https://github.com/luismlorenzana/uma-platform/blob/main/docs/sibling/hub-rework.md#phase-0)
(platform P48). Its Phase 0 is two small fixes each game makes on its own, before Phase A rebuilds the shell on the
shared `uma-kit`. Keep this change small; Phase A replaces the files it touches.

1. **The empty band under the bottom bar.** On the owner's iPhone 15 (393 × 852 pt), in the Home Screen app, the app
   ends 59 pt above the bottom of the screen. 59 pt is the top safe-area inset. With `black-translucent` the page draws
   under the status bar, and `h-dvh` comes out short by that much, so the darker `body` shows as a band under the tabs.
2. **Uma lists open in the wrong order.** The owner's rule: every Uma list and picker opens on **Uma Level, highest
   first**; work pickers on **free first, then Craft Level**. Several uma-rpg lists use release or name order.

## Context

- `apps/web/index.html`: `viewport-fit=cover`, `apple-mobile-web-app-status-bar-style` `black-translucent` (keep both).
- `apps/web/src/index.css`: `html, body, #root { height: 100% }`, `body` background `--color-page`, `.pt-safe` and
  `.pb-safe`.
- **Full-screen roots on `h-dvh`:**
  - `hub/HubScreen.tsx:100`
  - `places/PlacePage.tsx:16`
  - `app/Root.tsx:13, 21, 38, 83`
  - the fight screen, if it has its own root
- **Lists:**
  - `packages/domain/src/roster/query.ts`: `DEFAULT_ROSTER_QUERY` (`release`, desc) and `compare`. Its "owned before
    locked whatever the direction" comment isn't enforced: ascending puts locked Umas first.
  - `places/stable/stable-prefs.ts`: `KEY = 'rpg.stable.v1'`, which remembers the old default on the owner's phone.
  - `places/party-hall/UmaPicker.tsx:12`: sorted by name.
  - `places/observatory/ObservatoryPage.tsx:22–26`: roster order (oldest release first); opens on the first.
  - `places/exchange/ExchangePage.tsx:100`: the Manuals picker, in roster order.
  - `places/work/FacilityPage.tsx` (free, then Craft Level) and `places/halls/HallPage.tsx` (Uma Level) already follow
    the rule.

## Do

1. **The frame:**
   - Every full-screen root above becomes a fixed full-screen frame: `fixed inset-0` instead of `h-dvh`, keeping its
     flex layout and inner scroll areas.
   - Give `html` the page background too, so nothing below the app can ever show.
   - The bottom tab bar keeps its row and its `pb-safe`. Once the frame reaches the screen's bottom, the inset sits under
     the home indicator as on a native tab bar.
2. **The level rule, in the domain:**
   - Add a comparator `byUmaLevel(a, b)` in `roster/query.ts`: Uma Level desc, then release desc, then name. Owned Umas
     always come before locked ones, whatever the direction.
   - `DEFAULT_ROSTER_QUERY` sorts by `level`, desc.
   - Fix `compare` so owned Umas come before locked ones in both directions.
3. **The level rule, on screen:**
   - **Stable:** opens on Uma Level. Bump the preference key to `rpg.stable.v2`, so the new default applies once on the
     owner's phone.
   - **Party Hall's slot picker:** sorts with `byUmaLevel`. Search still filters.
   - **Observatory:** its Uma tabs sort with `byUmaLevel`. It opens on the Uma in the route if there is one, else the
     highest.
   - **Exchange → Manuals:** its Uma list sorts with `byUmaLevel`.
4. **Tests:** the comparator, the default query, and owned before locked in both directions (`roster/query.test.ts`).

## Done when

- `pnpm lint && pnpm test && pnpm build` pass.
- In the preview at 393 × 852 every screen still fills the viewport and scrolls inside. The owner checks the band on
  the phone after deploy.
- The Stable, Party Hall picker, Observatory and Manuals open on the highest Uma Level.

## Deliver

- A pull request on `fix/phase-0`, titled `fix(web): fill the iPhone screen; Uma lists open on Uma Level (H30)`.
- It merges itself after green CI (D120), logs a decision with the next free D-number (fetch `main` first), deletes
  this packet and updates the handoff README.
