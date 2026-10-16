# SD3 — uma-rpg on `uma-server/auth`, `uma-kit/auth` and `uma-kit/places`

**uma-rpg · Either · M · Needs: SD1 and SD2 released · Part of sibling Phase D.**

## Why

Phase D makes the screens around the game kit frames, and the API's guard a shared module:
- getting in;
- the Account;
- the Warehouse;
- the Exchange;
- the profile's frame.

uma-rpg adopts them, with its own content and words.

## Context (read first)

- uma-platform: `docs/sibling/phases.md` § Phase D; `packages/kit/README.md` § `/auth`, `/places`; and
  `packages/server/README.md` § `/auth`.
- **This repo:**
  - getting in: `apps/web/src/app/Root.tsx` (the gates), `UpdateNotice.tsx`, `update-lifecycle.ts`,
    `register-updates.ts`;
  - sign-in: `auth/firebase.ts`, `auth/AuthProvider.tsx`;
  - the places: `places/account/AccountPage.tsx`, `places/warehouse/WarehousePage.tsx`,
    `places/exchange/ExchangePage.tsx`, `places/stable/OutfitProfile.tsx` (header, tabs, the unlock button);
  - the API: `apps/api/src/auth/auth.guard.ts`, `app.module.ts`, `main.ts`, `health.controller.ts`, and the push tick
    (`push/scheduler.guard.ts`, which keeps its own guard);
  - `docs/game/sections.md` § Getting in, § Account, § Warehouse, § Exchange, § Stable (profile).

## Decisions made

- **Web:**
  - **`BootGates`:** splash, sign-in, boot, first launch (the trainer name, then 20 Uma Tickets, as now), and the
    start page (the last page).
  - **`AuthProvider`** from `uma-kit/auth`, with the Firebase config from `import.meta.env`, as `firebase.ts` reads it
    today.
  - **`UpdateNotice`** from the kit.
- **`AccountPage`:** rename; the wallet (Uma Tickets, Uma Shards, Laurels, with their marks); Appearance; the
  notifications slot (uma-rpg's `NotificationsCard`); info rows (cloud save, game data version, app build); sign out.
- **Warehouse:** `ShelfView` with the shelves Materials, Star Gems and Gear, grade chips, and the stock sheet with
  Sell ×1, 10 or All.
- **Exchange:** `ExchangeRows` for raw items, Speed and Sweep Tickets, and Manuals. The Manual's Uma choice is SB4's
  `UmaPicker`, if landed.
- **The profile:** `ProfileFrame`, with the bust (SB3's `UmaBust`, if landed), the name, `formatLevel`, the class
  chip, and the tabs Skills, Battle, Gear, Work, Racing. Each tab's body stays this game's.
- **Unlocking:** `UnlockConfirm` in the profile.
- **API:** `AuthModule.forRoot({ mode: AUTH_MODE, allowedEmail: ALLOWED_EMAIL })`. `@Public()` on `/api/health` and
  the push tick; the tick keeps its OIDC `scheduler.guard.ts`.
- **Retired:**
  - web: `auth/firebase.ts` and `AuthProvider.tsx`, `UpdateNotice.tsx` and `update-lifecycle.ts`, and the gate markup
    in `Root.tsx`;
  - API: `apps/api/src/auth/`.

## Do

1. Pin `@luismlorenzana/uma-kit@<version>` (web) and `@luismlorenzana/uma-server@<version>` (API).
2. Swap the web pieces above, one place at a time.
3. Swap the API's guard; keep the env vars as they are.
4. Run the API's tests, plus local requests with `AUTH_MODE=disabled` and enabled with a bad token (401).
5. **Docs:**
   - `docs/game/sections.md`'s sections above;
   - `docs/game/architecture.md` § Web app and § API (the shared packages);
   - run `pnpm docs:update`;
   - log a D-decision.
6. **Check it** in the iOS Simulator's Home Screen app, light and dark:
   - a fresh local save shows first launch;
   - the Account's sections;
   - the Warehouse's shelves and sell sheet;
   - the Exchange's rows and confirm;
   - the profile's header and tabs;
   - unlocking.
7. **Deploy** and check production sign-in on the owner's phone. You can't type credentials: ask the owner to open the
   app once, and report.

## Done when

- [ ] `pnpm lint && pnpm test && pnpm build` pass; the main JS is under budget.
- [ ] The retired files are gone.
- [ ] The Simulator check was done and described.
- [ ] The docs and D-decision are in. Deployed and green, and the owner confirmed sign-in still works.

## Deliver

- Claude: commit to `main`, `feat: getting in, Account and places on the shared kit and server (SD3)`.
- ChatGPT: branch `sib/sd3-rpg-places`, a pull request with the same title.
- **Flag it done:**
  - delete this file;
  - add a Done row here;
  - set SD3 to Done in uma-platform's queue.
