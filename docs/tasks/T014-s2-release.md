# T014 — Hub summaries, release and phone check

**Goal:** S2's exit check on the iPhone.

## Build

- The Stable and Party Hall quick looks (T012, T013); the Account's real "Umas unlocked" count.
- Fold the shipped rules into the design docs (game design §3, §6) and `architecture.md` (save v2, routes); log
  decisions; mark S2 in [plan.md](../plan.md).
- Push → the pipeline deploys. Verify health, guards and caching as in S1, and that the new build id shows in Account.
- The owner runs the [S2 exit check](../slices/S2-collection.md#exit-check) on the phone (tap **Update ready —
  Restart** first).

## Done when

The owner confirms the exit check; the pipeline is green.
