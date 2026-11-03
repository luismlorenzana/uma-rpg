# H161 — Capital runs: the screens, dark

**uma-rpg · ChatGPT or Claude · L · Needs: H160 · Unblocks: H162**

## Why

H160 wrote the runs' rules. This packet draws them on the Scenario Gate:
- the capital page with its open runs and **New run**;
- the New run sheet, a party for each lane;
- a run's page, with four lanes, the Final and Abandon;
- the fight and its result;
- the continent map's capital line;
- the Window sheet's World tile.

It's built **dark** behind `capitalRunsLive()`. Until H162, the capital page is today's `CapitalMap`.

## Context (read first)

- `CLAUDE.md`, `AGENTS.md`, [the manual](../../game/README.md): [sections](../../game/sections.md) (Scenario Gate, the
  Rift's pages as the model), and profile v2's rules G3–G5: one tap opens one sheet, no sheet over a sheet, and a sheet
  stays open after its action.
- **The design:** [capitals.md](../../design/capitals/capitals.md) §8 (the screens) and §2 (sign-up rules). The
  [preview](../../design/capitals/previews/capitals.html) §2 has the three phones; follow their content and order.
- **H160:** `@rpg/domain/capital`:
  - `capitalRunBlock`, `startCapitalRun`, `abandonCapitalRun`, `capitalFightBlock`, `startCapitalFight`;
  - `FightResult.capital`;
  - `windowNext`'s World entry with `run`.
- **The Scenario Gate:** `apps/web/src/places/scenario-gate/`.
  - `ScenarioGatePage.tsx` handles routes. `capital/:continent` draws `CapitalMap` today, and `fight` is the map's open
    fight (`FightRoute`).
  - The continent map's capital spot reads "Capital · n/6" (around line 166).
  - `fight-place.ts`: `fightPlace`, where an open fight resumes.
  - `FightResult.tsx`.
- **Chapters by id:** `apps/web/src/battle/campaign.tsx`. `campaign.region(id)` builds a region's or capital's chapter;
  `fight-source.ts` gives the open fight's title.
- **The model pages:** the Rift's (`places/rift/RiftPage.tsx`, `SignUp.tsx`, `PartyPick.tsx` for picking parties,
  `FrontChain.tsx` for a chain) and Drills (`places/drills/DrillsPage.tsx`: a non-map chapter on the shared fight screen).
- **Words:** `places/stable/copy.ts` and its test.
  - Every surface string is six words or fewer, with none of the banned words (her, this, when, will, you, your,
    bonus, "is a").
  - New files join the test's JSX list.
- **Actions:** `apps/web/src/save/game.ts`, through `edit(import('@rpg/domain/capital'), …)` like the Rift's.

## Decisions made

1. **Routes,** under `/battle/scenario-gate/`:
   - `capital/:continent` is the capital page when live.
   - `capital/:continent/run/:runId` is a run's page.
   - A run's fight is the map's open fight on the existing `fight` route.
   - `campaign.region(id)` builds a run's chapter from its id (`capitalRunNodeOf`, `capitalRunChapter`), so Resume, the
     fight screen and its title work as for any map fight.
2. **The capital page:** "Ura Finale · Capital", "Lv 10" and "Runs won: 2". Then a card for each open run of this
   capital ("Run 3", "Parties 1, 2, 5, 6", "7/16", the lanes' or the Final's pips), each opening its page. Then
   **New run**, and the line "Four full parties. Three generals each, then four finals."
3. **New run** (one sheet):
   - The four lanes, each with its name, line and two elements, and a party picker.
   - The picker shows full parties not in an open run. A party that can't go appears greyed with why: "Not full",
     "In Run 2" or "Two healers".
   - **Start run** is disabled until all four lanes have a party ("Start run · 3 of 4 parties"). It calls
     `startCapitalRun` and opens the run's page.
4. **A run's page:**
   - **Four lane cards:** the lane's name, the party label, its five faces, the generals' pips, and either "General 2 of
     3 · Lv 10" with **Fight** or "Through ✓". Opening a lane shows the next general's foes, the way a front's stage
     sheet does.
   - **The Final card:** locked with "Beat every lane's generals · 7 of 12". Once open, it shows its four bosses, each
     with its lane's party and **Fight**, or "Won ✓".
   - **Abandon run** at the foot opens a confirmation sheet: "Progress is lost" and **Abandon**.
5. **The fight:** the shared fight screen, titled "Sprint Final · General 2" or "Sprint Final · Final".
   - The result adds "General 2 of 3", "Final 3 of 4", or "Capital won · World I for 20".
   - Its buttons are **Next general** (the same party, when the next one is open), **Retry**, and **Back to the run**.
   - A won run's last result goes **Back to the capital**.
6. **The continent map's capital spot:** "Capital · 2 runs won" while there's no open run, else "Capital · open run".
   Its aria label says the same.
7. **The Window sheet** (`places/gallery/glass-view.ts`, `nextLabel`): a World tile with no run reads "Not run", and
   with one "2 of 4 finals". The tile's inline line keeps the rule's text and "Capital runs".
8. **Dark:** with `capitalRunsLive()` false, the capital route draws `CapitalMap` as today, and none of the above shows.

## Do

1. The routes and the chapter lookup.
2. The capital page, New run, the run's page and the Abandon sheet.
3. The result lines and buttons, the continent map's line, and the Window sheet's World tile.
4. The actions in `game.ts`: `startRun`, `abandonRun`, `beginCapitalFight`.
5. Tests:
   - The view helpers' words.
   - A rendered capital page with two runs.
   - New run's disabled states.
   - A run page before and after the Final opens.
   - The result lines.
   - The copy test passing with the new files.
   - Dark: the old `CapitalMap`, unchanged.
6. Look at it with a local scratch save and H162's switch applied in a throwaway worktree (avoid ports 8098 and
   5198), at 390×844 and 375×667, light and dark. Use the real release locally and never a public host.
7. Log the D-row (fetch `main` first).

## Done when

- [ ] `pnpm lint && pnpm test:ci && pnpm build` pass. Main JS stays under 230 KB, with the pages lazy.
- [ ] Live play is unchanged while dark.
- [ ] Nothing from the original games in git (`git status`), and no screenshot committed.
- [ ] Deployed green (`gh run watch <id> -R luismlorenzana/uma-rpg --exit-status`) and https://uma-rpg.web.app/api/health
      shows the commit.

## Deliver

- **Claude:** commit to `main`: "feat(web): capital runs, the screens, dark (H161)".
- **ChatGPT:** a branch and a pull request with that title. Merge it yourself when the checks and CI are green. Fetch
  `main` before you push so the D-number is free.
- **Flag it done:** delete this file and add a Done row in [README.md](../README.md) with the commit.
