# H118 — Both apps: a compact `ProfileFrame` header (and a face door on `SlotRow`), uma-kit 0.16.0

**uma-platform · Claude · S · Needs: nothing · Unblocks: H119 (and H124's Wilds door)**

## Why

The Uma profile v2 (uma-rpg D239) halves the profile's header: the tab bar moves from 284 px to 144 px on a 390×844
screen, 532 px with an open calling card. The header is uma-kit's `ProfileFrame`, drawn for both games, so the change is
a "Both apps:" request ([change protocol](../../change-protocol.md)): **one opt-in option**, `size: 'compact'`, with a
`progress` line, and uma-racer's profile unchanged.

H124 also needs the Wilds' worker face to open her profile (proposal §6.2: "Wilds place, a working Uma's face"). That
face is the kit's `SlotRow`, which takes no tap today, so the same release carries **a second opt-in option,
`onFace`**, rather than a second request and release later.

This runs in a uma-platform session (Claude); uma-rpg pins the release with no visible change until H119 uses it.

## Context (read first)

- uma-platform's `CLAUDE.md`, `AGENTS.md`, `docs/change-protocol.md` ("How a 'Both apps' change runs": change and test in
  both games, release, pin), and its [handoff README](https://github.com/luismlorenzana/uma-platform/blob/main/docs/handoff/README.md)
  ("Releases while packets run in parallel": a changeset, then `pnpm version-packages` right before merging).
- **The request**, word for word, is uma-rpg's proposal
  [§11](../../design/uma-profile-v2/proposal.md#11-kit-changes); the header it serves is §3.1 (the drawing and the
  table), and UP7, UP32 in §14. The [tabs page](../../design/uma-profile-v2/previews/tabs.html) draws the compact header
  at 390×844 in light and dark.
- **The kit, uma-platform `main` at `89e99e1`, uma-kit 0.15.0:**
  - `packages/kit/src/places/ProfileFrame.tsx` (81 lines): `ProfileFrameProps` (`:16–37`), the header (`:44–62`: a
    `size-28` portrait with the lock badge, chips and corner on one row, the name `text-xl`, the title `text-[13px]`, the
    level `text-[22px]` extrabold), then `summary`, the sticky tab bar with dots (`:64–77`) and the body;
  - `packages/kit/src/places/frames.test.tsx :42–66` (the profile's tests: `html()` is `renderToStaticMarkup`);
  - `packages/kit/src/work/SlotRow.tsx`: `SlotRowProps` (`:22–28`), `FaceRing` (`:15`), `Row` (`:44`, the face at
    `:67`), the words through `copy()` from `work/words.ts` (`more: 'More'` at `:4`, used as
    `` `${copy('more')}: ${umaName(card.outfitId)}` ``); `work/frames.test.tsx` and `actions.test.tsx`;
  - `packages/kit/README.md :233–235` (ProfileFrame's props) and the work section.
- **Who draws them:** uma-rpg `apps/web/src/places/stable/OutfitProfile.tsx :123–151` (the profile) and
  `places/work/PlaceV3.tsx :96` (`SlotRow`); uma-racer `origin/main` `apps/web/src/places/stable/Profile.tsx` (the
  profile; the local racer checkout sits on an old branch, so use a worktree from `origin/main`).

## Decisions made

**From the proposal (UP7, UP32, §11), exact:**
- `size?: 'regular' | 'compact'`, default `'regular'`: uma-racer and today's uma-rpg draw exactly as now.
- `progress?: { value: number; max: number; label: string }`.
- **Compact:** a 64 px portrait (`size-16`); the name at 17 px; the title at 12.5 px with `chips` after it on the same
  line, the title truncating first; the level at 14 px bold with `progress` drawn on its line as a 4 px bar and its
  label at 11 px; the header block 64 px tall; `corner`, `summary`, the tab bar and its dots as today.
- A minor release (visible): **uma-kit 0.16.0**, or the next minor if another packet took it.

**Build decisions:**
1. **The compact lock badge is the lock icon alone** (14 px, on the portrait's corner) with `lockedLabel` as its
   accessible name. *Why:* the word at the 11 px floor (uma-rpg's type scale, proposal §7.3) would cover most of a 64 px
   portrait.
2. **`progress` draws in both sizes:** in compact on the level line; in regular as a 4 px bar and its label under the
   level. No game passes it in regular today, so nothing moves; a prop is never silently ignored.
3. **The bar is a `role="progressbar"`** with `aria-valuemin={0}`, `aria-valuemax={max}`, `aria-valuenow={value}` and
   `aria-valuetext={label}`; at `value >= max` it draws full.
4. **The name wraps, it never truncates** (`break-words`, at most two lines); the title is the one `truncate` in the
   line, `min-w-0` so it yields to the chips. The compact header keeps the frame's `pt-3` and `space-y-3`, so with a
   44 pt summary row the tab bar starts at 144 px (12 + 64 + 12 + 44 + 12).
5. **`SlotRowProps.onFace?: (outfitId: string) => void`**: when set, the `FaceRing` (44 px; 40 in `PeekRow`) is wrapped
   in a `<button>` with the aria label `` `${copy('profile')}: ${umaName(outfitId)}` ``, a new work word `profile:
   'Profile'` with its English default. Unset, the face is drawn exactly as now. *Why:* the game navigates itself with
   its own nav state (H124 passes the place's workers for next/previous); the kit only reports the tap.
6. **Not in this release:** the place header's `‹ n/N ›` (uma-rpg passes it as `PlaceHeader` children), the facts row
   (`summary`), the four tabs and dots (`tabs`), the sheets' footer (`BottomSheet`'s `footer`): proposal §11's "not kit
   changes".

## Do

1. **A worktree** for uma-platform from `origin/main` (`git -C ~/workspace/uma-platform worktree add
   ~/workspace/uma-platform-h118 -b feat/h118-compact-profile-frame origin/main`), and one for uma-racer from
   `origin/main` to test in.
2. **`ProfileFrame.tsx`:** `size` and `progress` as decided; the regular branch byte-for-byte as today when neither is
   passed. Update its header comment.
3. **`SlotRow.tsx` and `work/words.ts`:** `onFace` and the `profile` word.
4. **Tests** (Vitest, `renderToStaticMarkup` as the file does):
   - `places/frames.test.tsx`: the regular frame's markup is unchanged with neither prop (snapshot the existing case's
     HTML before your change and compare); compact renders the 64 px portrait class, the name, the title and chips in
     one row, the level text, and a progressbar with `aria-valuenow`, `aria-valuemax` and `aria-valuetext`; a 24-character
     name renders with no `truncate` on the name and `truncate` on the title; locked compact draws the icon badge with
     the label as its accessible name; `progress` in regular draws the bar under the level.
   - `work/frames.test.tsx`: without `onFace` the slot row's markup is unchanged; with it, a button labelled "Profile:
     {name}" wraps the face, and a click calls `onFace` with the outfit id (`actions.test.tsx` has the click harness).
5. **Test inside both games** before releasing (change protocol step 1; the master prompt's way to try an unreleased kit:
   build the kit, copy `dist/` and `theme.css` over each game's installed copy, delete `node_modules/.vite`, restart):
   - **uma-racer** (worktree on `origin/main`): `pnpm lint && pnpm test && pnpm build`; its profile at 390×844 looks as
     before.
   - **uma-rpg:** `pnpm lint && pnpm test && pnpm build`; then, **locally only and never committed**, set
     `size="compact"` and a `progress` on `OutfitProfile`'s frame, and give a test Uma a 24-character name in a scratch
     master view if needed: at 375×667 and 390×844, light and dark, nothing is clipped (`el.scrollWidth <=
     el.clientWidth` on the header's name, title and level line) and the tab bar starts at 144 px with a 44 pt summary
     row; a Wilds place with `onFace` wired locally logs the tap. Revert both.
   - Your own ports, never 8081/5174, and never the iOS Simulator.
6. **Docs:** `packages/kit/README.md`'s `ProfileFrame` line gains `size` and `progress` (0.16.0) and the work section
   `onFace`; a changeset (minor) naming both options.
7. **Release:** fetch `main`, rebase, `pnpm version-packages`, merge; wait until `gh api /user/packages/npm/uma-kit/versions
   --jq '.[].name'` lists 0.16.0.
8. **Pin in uma-rpg** (a worktree from its `origin/main`): `apps/web/package.json` `"@luismlorenzana/uma-kit":
   "0.16.0"`, `NODE_AUTH_TOKEN=$(gh auth token) pnpm install`, `pnpm lint && pnpm test && pnpm build` (say the main JS
   number, of 230 KB; 223.46 today; the new code is in `uma-kit/places` and `uma-kit/work`, whose profile and slot rows
   load in lazy chunks), and the Versions line in uma-rpg's [handoff README](../README.md) ("uma-kit 0.16.0"). Nothing
   visible changes, so uma-rpg logs no decision for the pin (H119 logs the visible change).
9. **uma-racer:** no pin needed now (both options are opt-in and nothing it draws changes). Say so in your delivery so its
   session picks 0.16.0 up with its next kit update.

## Done when

- [ ] In uma-platform: `pnpm lint && pnpm test && pnpm build` pass; the tests in step 4 pass; the regular frame's and the
  slot row's markup is unchanged without the new props.
- [ ] uma-kit 0.16.0 is published (listed by `gh api`), with the changeset and the README lines.
- [ ] Both games' checks passed against the built kit before the release (step 5), and the local compact check at
  375×667 and 390×844, light and dark, found nothing clipped and the tab bar at 144 px. Described in the delivery.
- [ ] uma-rpg pins 0.16.0 with `pnpm lint && pnpm test && pnpm build` green and the main JS number stated; deployed green
  (`gh run watch <id> -R luismlorenzana/uma-rpg --exit-status`), https://uma-rpg.web.app/api/health shows the commit.
- [ ] uma-platform's decision logged (fetch `main` for the next free P number; P76 if free): "Compact profile header and
  a face door on slot rows (uma-kit 0.16.0, for uma-rpg D239)", with decisions 1–5. Nothing from the original games in
  git in either repo.

## Deliver

- **uma-platform:** a branch `feat/h118-compact-profile-frame` and a pull request, "feat(kit): a compact ProfileFrame
  header and a face door on SlotRow (0.16.0)", merged by you when green (or, as the main uma-platform session, pushed
  to `main` per its `CLAUDE.md`); the release workflow publishes it. Add a row to uma-platform's queue (its handoff
  README, beside the art briefs the games send) for H118 with this packet's link, Done with the commit.
- **uma-rpg:** a branch `chore/h118-pin-kit-0.16.0` and a pull request, "chore(web): pin uma-kit 0.16.0 (H118)", merged
  by you when green; watch the deploy.
- **Flag it done:** in uma-rpg, delete this file, add a Done row in [README.md](../README.md) with both commits, and set
  H119 to Ready when H117 is also done.
