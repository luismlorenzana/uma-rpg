# H160 — Capital runs: the rules and save v37, dark

**uma-rpg · ChatGPT or Claude · L · Needs: H159 · Unblocks: H161, H162**

## Why

Capitals v2 (D293, [the design](../../design/capitals/capitals.md)) turns each capital into runs of four full parties.
H159 wrote the fourth route and the run's foes. This packet writes everything a run does:
- starting it and keeping its twenty;
- each lane's three generals, in order;
- the Final's four bosses;
- the pay, full on an Uma's first run of a continent;
- the window's World step, which now lights on a won run;
- abandoning a run;
- save v37's fields.

It's built **dark**, like the collections were (H152, `collectionsLive`). Every new rule reads `capitalRunsLive()`, which
stays false until H162 sets `SAVE_SCHEMA_VERSION` to 37. Live play doesn't change.

## Context (read first)

- `CLAUDE.md`, `AGENTS.md`, [the manual](../../game/README.md): [loops](../../game/loops.md) (Windows, Drills, the Rift),
  [maps](../../game/maps.md) (Capitals).
- **The design:** [capitals.md](../../design/capitals/capitals.md), all of it. §2 and §5–§7 are this packet's rules,
  and §12 holds the decisions CA1–CA15.
- **H159:** `world/capital-run-id.ts` (ids and `capitalRunNodeOf`) and `capitalRunChapter` in `world/capital.ts`.
- **The dark pattern to copy:**
  - `save/collections.ts`: `collectionsLive(version = SAVE_SCHEMA_VERSION) => version >= 35`.
  - The v35 fields' parse in `save/save.ts`: `parseDrills`, `parseWindows`, and the account step in `parseSaveChecked`.
  - `migrations.ts`: `toV35`, chained only when live.
  - `save/windows.test.ts`: its old header mocked `./version` to test a live version early.
- **The model for a run fight on the map's open fight:** Drills, `save/drills.ts`.
  - `startDrill` uses the active party at full HP and MP and leaves the world's carried MP as it was.
  - `settleFight` in `save/battle.ts` dispatches a Drill chapter to `settleDrill`.
- **Pay:** `save/battle.ts`.
  - `payEntrants(world, entrants, kind, foeLevel, laurels, tier, share)` currently takes one `share` for every entrant.
  - `stageLaurels`, `REPLAY_SHARE`, `stagePay` and `stageExpPay` (in `world/world.ts`).
  - `rpgRewardKind`, and the weights in `rpg/campaign/rewards.ts`.
- **The window:** `save/windows.ts`.
  - `windowMet`'s World line reads `championsWon(champions, n)`.
  - `recordChampion` is called from `settleFight`.
  - Use `recordRiftWin` as the model for a "lit on a won run" hook.
  - Also `windowNext`, the `credit` function and `latchOne`.
  - The record is in `save/window-record.ts`: `champions`, `championBit`, `championsWon`.
  - The catalog's rule text is `rpg/windows.ts` `rule()`.
- **Ascend:** `ascendUmasBlock` in `save/rift.ts`.
- **The save's bounds (D292):** `WINS_MAX` and `MP_MAX` in `save/save.ts`. `world.run.wins` holds one entry per map
  stage and must not grow with runs.

## Decisions made

1. **The switch:** `export const CAPITAL_RUNS_SAVE = 37` and `capitalRunsLive(version = SAVE_SCHEMA_VERSION) => version >= 37`
   in `save/collections.ts`.
2. **Save v37, each world** (absent before v37, and parsed only when live):
   - `capitalRuns: CapitalRun[]`: the open runs, at most 5.
     - `CapitalRun { id, continent, startedAt, lanes: [CapitalLane × 4] }`.
     - `CapitalLane { party: number, umas: string[5], generals: 0 | 1 | 2 | 3, finalAt: string | null }`.
     - `party` is the Party Hall index the lane was signed from, kept for display only.
     - The lane order is the routes' order.
   - `capitals: Record<continentId, { started: number; won: number; recent: CapitalWin[] }>`. `started` numbers the
     runs (`capitalRunId(c, started + 1)`), so an abandoned run's id is never reused. `recent` holds the last six won
     runs, newest first: `CapitalWin { id, wonAt, lanes: string[5][] }`. The capital page and the honeycomb map's
     capital panel and its six run seats show it (docs/design/world-map/honeycomb.md, HM8, HM12).
   - **Parse:** each id is well formed and its continent is in this world's tier. Each lane has five different Umas, all
     owned in this world, and no Uma appears in two lanes or two runs. `finalAt` may be set only once every lane in the
     run has beaten all three generals. Counters are whole numbers.
3. **Save v37, the account** (only when live): each window record loses `champions`, so a v36 record is read without
   it. In the types, `champions` becomes optional until H162 removes it. A World step already lit stays lit.
4. **Migrations:** add `toV37(world)`, which gives a world empty `capitalRuns` and `capitals`, chained only when live, the
   way `toV35` is. The account step goes in `parseSaveChecked`.
5. **Starting a run,** `startCapitalRun(save, continentId, parties: [number, number, number, number], now, tier)`. Its
   block is `capitalRunBlock`, returning short reasons:
   - dark: "Capital runs come with save v37";
   - the continent isn't this world's;
   - four different parties;
   - each party full ("Party 3 isn't full");
   - no Uma already in an open run ("Kitasan Black is in Run 2" by outfit name, the way `ascendUmasBlock` names Umas).

   It creates the run with `party[i]` on lane `i + 1`, copies the parties' members, and adds 1 to `capitals[c].started`.
   There is no level gate (CA7).
6. **Abandoning,** `abandonCapitalRun(save, runId, now, tier)`: the run is removed and nothing is paid. It's blocked
   while one of its fights is the open fight ("Finish the open fight first").
7. **A run fight,** `capitalFightBlock(save, runId, lane, kind: 'general' | 'final', outfits, tier)` and
   `startCapitalFight(save, chapter, runId, lane, kind, outfits, now, tier)`:
   - A general is the lane's next one (`generals + 1`, at most 3).
   - A final needs every lane's `generals === 3`, and this lane's `finalAt === null`.
   - No other fight may be open: it is the world map's open fight (`openFightOf`), as a Drill is.
   - The lane's party is its five as signed up. `healerBlock` applies: one healer a party (CA7).
   - HP and MP are full, and the world's carried MP stays as it was (CA8, `startDrill`'s way).
   - There are no Sweeps.
8. **Settling,** `settleFight` dispatches `isCapitalRunChapter(chapter)` to `settleCapitalFight`. On a win:
   - **Pay, per entrant** (CA10, CA11): her share is 1 while her `world-n` step for this continent is dark, and
     `REPLAY_SHARE` once it's lit.
     - For this, `payEntrants`'s `share` may be a number or `(outfitId) => number`.
     - Generals pay as `sub-boss` with EXP ×0.5. A final pays as `boss` with the two-wave ×1.5 that `stagePay` already
       gives.
     - Laurels are a first clear's (triple) when any entrant's `world-n` is dark, and a replay's otherwise.
     - Class EXP, Shards and Bonds follow `payEntrants` as for any fight.
   - **The lane advances:** `generals + 1`, or `finalAt = now`.
   - **The run is won** when all four lanes have `finalAt`. `recordCapitalWin` lights `world-n` on all twenty records,
     dated now. Then `capitals[c].won` gains 1, the run goes to the front of `recent` (six kept), and it's removed
     from `capitalRuns`.
   - **A run fight's win is never written to `world.run.wins`** (D292): drop the node from the closed run's wins.
   - `FightResult` gains `capital?: { runId, lane, general?: 1 | 2 | 3, final?: number, won: boolean }`. Here `final` is
     the count of finals now won, out of 4.

   A loss or a retreat changes nothing.
9. **The window, when live:**
   - World n's rule reads "Continent n: a won capital run".
   - `windowMet` no longer reads `champions`.
   - `recordChampion` does nothing.
   - `windowNext` for `world` returns `{ track: 'world', numeral, have: finals won in her open run of that continent (0
     if none), need: 4, run?: runId }`.
   - The v35 credit is left as it is, since it ran once and only on saves before v35.
10. **Ascend, when live:** an Uma in an open run can't ascend: "In a capital run".
11. **Lazy:** the rules go in `save/capital.ts`, behind `@rpg/domain/capital` (a `package.json` subpath as `./drills`
    has). `capitalRunsLive`, the types and the ids stay in the main bundle.
12. **No engine bump** (D293).

## Do

1. The switch, the types, the parse, `toV37` and the account step.
   - Tests mock `./version` at 37 for the live paths, and check that a v36 save parses unchanged while dark.
2. `save/capital.ts`: start, block, abandon, fight block and start, and settle.
   - Use H159's chapter, from `capitalRunChapter`.
   - `rift-rules.fixture.ts` is a model for a world with four full parties.
3. The window and Ascend changes, and per-entrant `share`.
4. Tests:
   - A full run, start to win: twelve generals in order, the Final locked until all twelve fall, four finals in any
     order, and World I lit for all twenty with today's date.
   - Pay: a first run at full; a second run by the same Umas at a quarter; a mixed party, each Uma paid by her own step.
   - Laurels.
   - Abandon.
   - One run per Uma.
   - Four different, full parties.
   - The healer rule.
   - An open fight blocks.
   - `world.run.wins` unchanged after a run fight.
   - Five runs at once with 20 parties.
   - The parse refusals.
   - The v37 round trip.
   - Everything unchanged while dark.
5. Log the D-row (fetch `main` first).

## Done when

- [ ] `pnpm lint && pnpm test:ci && pnpm build` pass. Main JS stays under 230 KB, with the rules in the lazy chunk.
- [ ] Live play is unchanged while dark: today's capitals, the World step and its champions.
- [ ] Nothing from the original games in git (`git status`).
- [ ] Deployed green (`gh run watch <id> -R luismlorenzana/uma-rpg --exit-status`) and https://uma-rpg.web.app/api/health
      shows the commit.

## Deliver

- **Claude:** commit to `main`: "feat(domain): capital runs, the rules and save v37, dark (H160)".
- **ChatGPT:** a branch and a pull request with that title. Merge it yourself when the checks and CI are green. Fetch
  `main` before you push so the D-number is free.
- **Flag it done:** delete this file and add a Done row in [README.md](../README.md) with the commit.
