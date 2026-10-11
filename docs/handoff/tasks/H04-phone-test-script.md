# H04 — One current phone test script; retire the stale release tasks

**Priority P1 · ChatGPT · uma-rpg · S.**

## Why

The owner tests on the iPhone, but the checks are spread over seven slice specs (S2–S7) and three leftover task files.
Most were written before the world map (D72), the Time Tickets (D74), replays (D79), token trading (D80) and the class
rework (D86), so many steps no longer match the game. One short, current script is what the owner needs now.

## Context

- **The old checks:** each `docs/slices/S*-*.md` has an "Exit check" section. The leftovers are
  `docs/tasks/T014-s2-release.md`, `T020-s3-release.md` and `T021-s4-release.md`. The QoL push check is in
  `docs/backlog.md` ("Your checks").
- **What's true today:**
  - `docs/decisions.md` D72–D86;
  - `docs/design/world/README.md`, `docs/design/loop.md` and `docs/design/class-rework.md`;
  - the screens under `apps/web/src/places/` (Stable → an Uma → Skills; Scenario Gate → world, continent, region and
    fight; the Forge and other facilities; the Exchange).
- The app runs locally with auth off (`AGENTS.md`, Commands); the production site is https://uma-rpg.web.app.

## Do

1. Write **`docs/testing/phone-check.md`**: one numbered script of about 30–40 steps in play order:
   - install and sign-in;
   - unlock and party;
   - class, weapons and skills (D86);
   - a fight per class, including a Spell Blade pair and a Summoner linger;
   - replay and sweep (D79);
   - Springs;
   - farm, train, cook and forge (D86 recipes, Orbs);
   - Exchange and token trading (D80);
   - Time Tickets (D74);
   - push notifications.

   Each step says what to tap and what you should see. Mark the steps that check a recent decision with its number.
2. In `docs/backlog.md`, replace the "Your checks" table with a link to it.
3. **Delete** `docs/tasks/T014-s2-release.md`, `T020-s3-release.md` and `T021-s4-release.md`. In
   `docs/tasks/README.md`, drop their rows and say releases are checked with the phone script. Keep the slice specs
   as history, but point their exit checks to the new script with one line each.

## Done when

- Every step was walked in the local app at 390×844 (`pnpm --filter @rpg/api dev`, `pnpm --filter @rpg/web dev`) and
  matches what's on screen.
- Steps that need a phone or production (install, push) are marked "phone only".
- Every link in the changed files resolves.

## Deliver

A pull request on `docs/phone-check`, titled `docs: one current phone test script (H04)`.
