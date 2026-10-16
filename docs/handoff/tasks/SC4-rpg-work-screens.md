# SC4 — uma-rpg on `uma-kit/work`'s screens

**uma-rpg · Either · M · Needs: SC2 released and SC3 merged · Part of sibling Phase C.**

## Why

With the engine shared (SC3), uma-rpg's facility screens move to the kit's work screens (SC2): uma-racer's compact
rows, queue chips, speed-up, recall with a preview, the facility header, and the who → what → how many job sheet.
Both games then show a job the same way, with the same words.

## Context (read first)

- uma-platform: `docs/sibling/phases.md` § Phase C, and `packages/kit/README.md` § `/work` (SC2's props:
  `SlotRow`, `JobSheet`, `FacilityHeader`, `TargetsStrip`, `WorkArtProvider`).
- **This repo:**
  - `apps/web/src/places/work/FacilityPage.tsx` (with the Forge and Lapidary icon pickers inside it), `QueueList.tsx`,
    `TimeCut.tsx`;
  - the quick look in `hub/HubScreen.tsx` (`QuickLook`, `PlacePreview.tsx`);
  - `ui/` and `master/art.tsx` (how items, gear and gems draw today);
  - `docs/game/sections.md` § Facilities, and D144 (the icons-only Forge picker).
- uma-racer's live screens, to see the target: its `docs/game/07-farm.md` §10 and `11-hub-and-places.md` §2.6.

## Decisions made

- **The facility page:** `FacilityHeader` (level, slots, speed, upgrade), then one `SlotRow` per slot (free slots
  invite "assign an Uma"), then `TargetsStrip` ("For your targets").
- **The quick look:** the same rows, small, so collect, restart or start takes two or three taps.
- **The job sheet:**
  - **Who:** `UmaPicker` with `workOrder` (free first, then Craft Level).
  - **What:**
    - the gather sites' grade list;
    - the Workbench's refine list;
    - the Forge's and the Lapidary's **icon grids** (D144, kept);
    - grades above her Craft Level locked, items without materials dimmed.
  - **How many:** by count, 1–10, or ×1–×40 when refining.
- **Items:** a `WorkArtProvider` whose `Item` draws gear, gems and materials as `master/art.tsx` does today.
- **Words:** the kit's defaults (Collect, Repeat, Speed up, Recall, Queue next, Finish · N, −30m). uma-rpg passes
  "Craft Level" where the kit asks for the work level's name.
- **Retired:** the job cards, `QueueList.tsx` and `TimeCut.tsx`, and SC3's thin adapter.

## Do

1. Pin the kit version with `/work`, and add `WorkArtProvider` in `main.tsx`.
2. Rebuild `FacilityPage.tsx` from the kit's pieces, passing the uma-rpg state, `now`, the `WorkEnv` (SC3) and the
   store's actions. Move the Forge and Lapidary pickers into the job sheet's "what" step.
3. Rebuild the quick look's facility body from the small rows.
4. Delete what retired. Keep the stopped-queue card and Repeat, which SC3 enabled.
5. **Docs:**
   - `docs/game/sections.md` § Facilities and the Hub's quick look;
   - run `pnpm docs:update`;
   - log a D-decision.
6. **Check it** in the iOS Simulator's Home Screen app, light and dark, at every Wilds place:
   - assign an Uma (the order, the reasons);
   - pick what and how many;
   - queue 3, collect, repeat, speed up, finish, recall (the preview);
   - upgrade;
   - a stopped queue;
   - the Forge and Lapidary grids;
   - the quick look's two-tap collect.

## Done when

- [ ] `pnpm lint && pnpm test && pnpm build` pass; the main JS is under budget.
- [ ] `QueueList.tsx`, `TimeCut.tsx` and the job cards are gone.
- [ ] The Simulator check in step 6 was done and described. The docs and D-decision are in. Deployed and green.

## Deliver

- Claude: commit to `main`, `feat(web): the Wilds on uma-kit's work screens (SC4)`.
- ChatGPT: branch `sib/sc4-rpg-work-screens`, a pull request with the same title.
- **Flag it done:**
  - delete this file;
  - add a Done row here;
  - set SC4 to Done in uma-platform's queue.
