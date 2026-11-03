# H164 — The honeycomb's save v38: who claimed and cleared each region, 24 parties, dark

**uma-rpg · ChatGPT or Claude · L · Needs: H160 (save v37, dark), H163 · Unblocks: H165, H166**

## Why

The honeycomb map (D295, [the design](../../design/world-map/honeycomb.md)) shows on each region the five Umas who first
claimed it and the five who first cleared it, and it brings a continent to 48 regions for **24 parties**. This packet
writes save v38 to do both:
- a record of each region's claim and clear, written as fights are won;
- four more parties in every world;
- a sixth capital run open at once, so 24 parties can all be in runs.

It's built **dark** behind `honeycombLive()` (H163), the way capital runs are behind `capitalRunsLive()`. Live play
doesn't change until H166.

## Context (read first)

- `CLAUDE.md`, `AGENTS.md`, [the manual](../../game/README.md): [loops](../../game/loops.md) (Parties),
  [maps](../../game/maps.md), [architecture](../../game/architecture.md) (the save's history and shape).
- **The design:** [honeycomb.md](../../design/world-map/honeycomb.md) §1, §2 and §5; HM5–HM7, HM11.
- **H163:** `honeycombLive()`, `HONEYCOMB_SAVE = 38` and the eight new region ids (`w1-x-1` … `w1-x-8`).
- **H160's dark save, the model to follow:** `CAPITAL_RUNS_SAVE = 37`, `toV37`, the world fields' parse, and its tests
  that mock `./version`. This packet's `toV38` chains after `toV37`.
- **Where a fight is won:** `settleFight` in `save/battle.ts`:
  - `firstClear` is `(run.wins[node.id] ?? 0) === 0`;
  - entrants are `battle.input.allies`;
  - a Drill (`isDrillChapter`) and a capital run fight (`isCapitalRunChapter`, H160) return early and are never region
    wins.
- **A stage's region:** `stageRegionId` in `world/world.ts` (`w1-3-2-s5` → `w1-3-2`, and `w1-x-3-s5` → `w1-x-3`).
- **Parties:** `PARTY_COUNT = 20` in `save/save.ts`, `newParties`, `parseParties` ("expected 20 parties"), and the
  `activeParty` and Rift party bounds. In `save/rules.ts`, `setPartySlot` checks `party >= PARTY_COUNT`.
- **The save's bounds (D292):** `WINS_MAX` and `counts()`. Every new map must have a bound.
- **The Springs:** the world's `springs` record already takes any `w<n>-spring<k>` (`SPRING_ID`), so the sixth Spring
  needs no save change.

## Decisions made

1. **Save v38, each world** (absent before v38, parsed only when live): `regionTeams: Record<regionId, RegionTeams>`.
   - `RegionTeams = { claim?: RegionTeam; clear?: RegionTeam }`, and `RegionTeam = { umas: string[]; at: string }`.
     `umas` holds the fight's entrants in their party order, one to five different outfit ids. `at` is the win's time
     (ISO), shown as a date.
   - **The bound:** one entry a region, 48 × 5 = 240 a world at most.
   - **The parse:**
     - each key is a region id of this world's tier (`w<n>-<row>-<col>` with row 1–10 and col 1–4, or `w<n>-x-<k>` with
       k 1–8, for n in the tier);
     - each team has one to five different well-formed outfit ids and a timestamp, and at least one team is set.
   - An Uma in a team needn't still be in this world. An Uma who ascends keeps her face on the map she won.
2. **The claim** is written when a fight wins a stage of a region and **no stage of that region had a win before it**
   (every `run.wins` entry of the region at 0 or absent, before this win).
   - A region won before v38 never gains a claim, because the game never noted who won it (HM6).
   - **The clear** is written when a fight wins a region's **boss** (`node.kind === 'boss'`) on its first clear
     (`firstClear`), and the region has no `clear`. A boss already won before v38 never gains one.
   - Neither team is ever overwritten.
   - Sweeps, Drills, capital run fights and the Rift write nothing.
   - The capital's old stages (`w<n>-capital`) are not regions and write nothing.
3. **24 parties:** `PARTY_COUNT` is 24 when `honeycombLive()`, and 20 before.
   - `toV38` appends four empty parties, "Party 21" to "Party 24", to every world. Their slots are empty and their lead
     is null.
   - Everything that reads `PARTY_COUNT` or `world.parties.length` follows. The Party Hall, Rift sign-up and capital run
     pickers list 24 with no other change (the screens are H165's).
4. **Capital runs:** at most **6** open at once when `honeycombLive()`, and 5 before. With 24 parties, six runs of four
   seat everyone (HM11). Change H160's open-run bound in the parse and in `capitalRunBlock` ("Six runs are open").
5. **The migration:** `toV38(world)` adds `regionTeams: {}` and the four parties, chained after `toV37` only when live.
   The account doesn't change.
6. **Reads for the screen:** `regionTeamsOf(world, regionId): RegionTeams | undefined`, and `honeycombState(world,
   continent)`. The latter returns, for each region, `{ won: number /* stages won, 0–12 */, claim?, clear?, completed:
   boolean }`, where `completed` means its boss is won, with or without a `clear`. Both are pure and in the main bundle.
7. **No engine bump**, and no change to pay or progress.

## Do

1. The types, the parse with its bound and refusals, `toV38` and the 24-party switch, all gated by `honeycombLive()`.
   - Tests mock `./version` at 38 for the live paths.
   - Check that a v37 save parses unchanged while dark (20 parties, no `regionTeams`).
2. The claim and clear writes in `settleFight` (behind `honeycombLive()`), and the capital run bound.
3. `regionTeamsOf` and `honeycombState`, exported from the domain index.
4. Tests:
   - A fresh region: the first stage win writes the claim with the five in party order. A later stage win changes
     nothing. The boss's first win writes the clear, and a boss replay changes nothing.
   - A region with wins before v38 gains no claim, and its boss, if already won, gains no clear.
   - A region claimed before v38 but whose boss is first won after gains a clear only.
   - A fight of fewer than five writes its entrants.
   - A new region's (`w1-x-2`) claim and clear.
   - A Sweep, a Drill and a capital run fight write nothing.
   - The parse: the 240 bound, an unknown region, six Umas, the same Uma twice, an empty entry, a bad timestamp.
   - 24 parties: the migration appends four, and a v38 save with 20 parties is refused.
   - Six capital runs open at once, and a seventh blocked.
   - The v38 round trip.
   - Everything unchanged while dark.
5. Log the D-row (fetch `main` first).

## Done when

- [ ] `pnpm lint && pnpm test:ci && pnpm build` pass, and main JS stays under 230 KB.
- [ ] Live play is unchanged while dark: 20 parties, five open runs at most, no `regionTeams`.
- [ ] Nothing from the original games in git (`git status`).
- [ ] Deployed green (`gh run watch <id> -R luismlorenzana/uma-rpg --exit-status`) and https://uma-rpg.web.app/api/health
      shows the commit.

## Deliver

- **Claude:** commit to `main`: "feat(domain): the honeycomb's save v38, region teams and 24 parties, dark (H164)".
- **ChatGPT:** a branch and a pull request with that title. Merge it yourself when the checks and CI are green. Fetch
  `main` before you push so the D-number is free.
- **Flag it done:** delete this file and add a Done row in [README.md](../README.md) with the commit.
