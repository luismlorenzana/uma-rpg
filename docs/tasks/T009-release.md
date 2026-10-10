# T009 — First deploy and phone proof

**Goal:** S1's exit check, on the real device.

## Build

1. Deploy through the T002 pipeline and watch it with `gh run watch <id> -R luismlorenzana/uma-rpg --exit-status`.
2. Check from the outside: `/api/health` 200; `/api/save` 401 without a token; `index.html` and `sw.js` served
   `no-cache`; `/api/master/channels/v1/latest.json` 401 without a token.
3. Ask the owner to install the Home Screen app and run the [S1 exit check](../slices/S1-hub.md#exit-check). Claude
   never types credentials. Sign-in checks stop at Google's account chooser.
4. Record the results in `docs/research/s1-acceptance.md`: what was verified by Claude (browser, deploy), and what by
   the owner on the device.
5. Fold the shipped rules into the design docs: game design §9 gets the final Hub navigation, and
   `docs/technical/architecture.md` (new) covers the stack, the save and sync contract, the master data path and the
   Hub scene. Delete the S1 task files and mark S1 done in [plan.md](../plan.md).

## Done when

The owner confirms the exit check on the iPhone, and the pipeline is green.
