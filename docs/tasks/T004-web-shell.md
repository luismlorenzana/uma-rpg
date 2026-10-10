# T004 — Web shell: sign-in, first launch, save and sync, PWA

**Goal:** the app boots from the device, signs the owner in, creates the account once, keeps the save in IndexedDB
and syncs it in the background.

## Build

**Auth.** Copy uma-racer's `apps/web/src/auth/firebase.ts` and `AuthProvider.tsx`: Google sign-in that works in an
installed iOS Home Screen app. The signed-out screen shows the game name and **Sign in with Google**. Firebase loads
lazily.

**Save store.**

- Dexie database `uma-rpg` with one table, `save`, holding a single row: `{ id: 'main', revision, save, dirty }`.
  `save` is the shared type from `@rpg/domain/save`. Device-only preferences (last Hub page) go in `localStorage`
  behind try/catch.
- A Zustand store holds the loaded save, with narrow selectors (`useWallet()`, `useTrainerName()`).
- **Boot:** after auth, read Dexie.
  - A save exists → render at once, then sync in the background.
  - None → `GET /api/save`. Adopt the server save if one exists; otherwise show **first launch**: pick a trainer name
    (default "Trainer"), then create `account` and the Tier 1 world with wallet `{ unlockTickets: 15, shards: 0,
    laurels: 0 }`.
- **Writes:** every change goes store → Dexie (`dirty: true`) in one step, then schedules a sync.
- **Sync** runs on a debounce, on app foreground and on visibility change:
  - `PUT` with `baseRevision`. On 200, store the new revision and clear `dirty`.
  - On **409**, adopt the server save if the local one isn't dirty. If it is, keep the newer `account.updatedAt`, then
    re-`PUT`. With a single owner this is enough (D32); the logic lives in one module so S2+ can replace it.
  - Offline → retry later. Gameplay never waits on sync.

**App shell.** `h-dvh`, safe-area padding, dark theme. React Router 7 is created here with only `/sign-in` and the
catch-all that T006 fills.

**PWA.**
- Copy uma-racer's `vite-plugin-pwa` setup, `register-updates.ts`, `update-lifecycle.ts` and `UpdateNotice.tsx`: the
  **Update ready — Restart** prompt.
- The manifest uses `display: standalone`, name "Uma RPG", and placeholder icons generated as solid tiles.
- Runtime caching: `/api/master/files/**` → CacheFirst; `/api/master/channels/**` → NetworkFirst.

**Build id** shown in Account (T008): copy uma-racer's `app/build.ts`.

## Done when

- Tests: boot paths (local save, server save, first launch); the sync 409 merge; the wallet defaults.
- Local (auth disabled): first launch → name → reload keeps the name. Two browser profiles converge after a rename.
- Lighthouse PWA installable. Main bundle ≤ 180 KB gzip.
