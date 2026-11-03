# H159 — Capital runs: the fourth Finals route and the run's foes

**uma-rpg · ChatGPT or Claude · M · Needs: nothing · Unblocks: H160**

## Why

The owner approved Capitals v2 (D293, [the design](../../design/capitals/capitals.md)): a continent's capital becomes **runs**
of four full parties. Each party walks a **lane** of three **generals**, and the four lanes end on **four final bosses**.
A lane is one of the capital's authored Finals routes, and there are only three today, so every scenario needs a fourth.
This packet authors the fourth routes and writes the pure generator that builds a run's sixteen fights. Nothing is wired
to the save or the screens yet: H160 does the rules, H161 the screens and H162 the switch.

## Context (read first)

- `CLAUDE.md`, `AGENTS.md`, [the manual](../../game/README.md): [maps](../../game/maps.md) (Capitals), [combat](../../game/combat.md).
- **The design:** [capitals.md](../../design/capitals/capitals.md) §3 (lanes and generals), §4 (the Final), §5 (fights),
  §6 (pay); the [preview](../../design/capitals/previews/capitals.html) §1 (a run's shape).
- **The Finals today:** `packages/domain/src/rpg/campaign/finals.ts`. `RpgFinals` holds three `RpgFinalsRoute`s per
  scenario, each with a name, a line, a `vanguard` and a `champion` (`RpgFinalsFoe`: an element and two escorts, each a
  role and an element). There are fourteen scenarios in `SLUG_ORDER`, and `rpgFinals(order)` reads them by release order.
- **How a route becomes foes:** `rpg/campaign/chapters.ts`.
  - `rpgCampaignChapter` lays out the legacy chapter. Its Finals block (around line 105) adds one vanguard (`sub-boss`)
    and one champion (`boss`) per route at the chapter's last level.
  - `foes(chapterId, node, cast, reach, engine, tier)` builds a node's enemies: its lead, two escorts, shields and
    elements.
  - `rpgFinalsNodeIds(route)` gives the legacy node ids.
- **Capitals today:** `world/capital.ts`. `capitalChapter(continent, roster, engine)` copies the legacy chapter's
  vanguard and champion nodes for each route, renames them and refaces them from the capital's franchise
  (`capitalFranchise`, `stageFaces`). `capitalStageIds` gives the ids. Tests are in `world/capital.test.ts`.
- **Waves:** `world/world.ts`. `stagePay` gives ×1.5 for a stage in waves; see how region boss stages carry `waves`
  (`WAVE_STAGES`, `RpgMapNode.waves`).
- **The model for a non-map chapter on the map's open fight:** Drills, `rpg/drills.ts` (`drillChapter`) and
  `rpg/drill-id.ts` (ids, kept in the main bundle).

## Decisions made

1. **A fourth route per scenario,** in `finals.ts`, for all fourteen.
   - `RpgFinals.routes` becomes four, and `RPG_FINALS_ROUTES` stays 3, because today's capitals keep three until H162.
     Add `RPG_FINALS_LANES = 4` for the runs.
   - The legacy `rpgCampaignChapter` and `capitalChapter` read only the first three routes, so nothing on the live map
     changes. Test that.
2. **The fourth route's content:**
   - **Names and lines are original,** in the scenario's own theme like its three. No original-game text.
   - **Ura Finale's is fixed by the design:** "Medium Final", "A duel at middle distance: the dark horse kicks late.",
     vanguard `lightning` with escorts `skirmisher`/`lightning` and `caster`/`dark`, champion `dark` with escorts
     `skirmisher`/`dark` and `striker`/`lightning`.
   - **The other thirteen are yours to write.** In each scenario the four champions have four different elements (so
     each scenario leaves one of the five out), and across the 56 routes every element is a champion's 10 to 12 times.
   - **Escort roles** come from `RpgEscortRole`, with at most two of one role per route.
3. **The run's fights,** `capitalRunChapter(continent: WorldContinent, runId: string, roster: EnemyRoster, engine?)` in
   `world/capital.ts`. It's pure and deterministic for a given run id. Its ids go in a new main-bundle module,
   `world/capital-run-id.ts`:
   - **Ids:** the run is `${continent.id}-run${n}` (for example `w1-run3`) and the chapter id is the run id. Nodes are
     `${runId}-l${lane}-g${k}` (lanes 1–4, generals 1–3) and `${runId}-l${lane}-final`. Add the helpers
     `capitalRunId(continentId, n)`, `capitalRunNodeId(runId, lane, k | 'final')`, `isCapitalRunChapter(chapter)` and
     `capitalRunNodeOf(nodeId)`. The last returns `{ runId, continentId, lane, general: 1–3 | null, final: boolean }` or
     null.
   - **Every fight is at the capital's level** (`continent.levelStart + 9`), with stage 0 and no exits. The chapter's
     `start` camp lists every node. The order (generals in turn, the Final after every lane) is H160's rule, not the
     chapter's.
   - **A general** is a `sub-boss` node: a sub-boss lead (shield 6) and two escorts, shaped as today's vanguard is by
     `foes()`.
     - General I and General III lead with the route's `vanguard.element` and escorts.
     - General II leads with the route's `champion.element` and the champion's escorts.
     - The name is `${route.name} · General ${roman}`.
   - **A final boss** is a `boss` node in **two waves**: first the champion's two escorts and a third regular foe of the
     route's vanguard element, then the boss (shield 8, the champion's element) with two sub-boss escorts. That's the
     champion shape `foes()` builds, plus a lead wave. Its name is `${route.name} · Final`.
   - **Faces** come from the capital's franchise, seeded by the node id, so each run draws its own while its lanes keep
     their elements and roles (CA9).
   - **No original-game content**: faces are ids into the private roster, as today.
4. **Not in this packet:** the save, pay, the World step, the screens, and touching `capitalChapter` beyond reading three
   routes.
5. **Engine:** no bump (D293). The generator is new code, and a fight replays from its frozen input.

## Do

1. Author the fourteen fourth routes and widen `RpgFinals`. Add a `finals.ts` test: four routes everywhere, four
   different champion elements per scenario, each element a champion's 10 to 12 times, Ura Finale's fourth as given.
2. `world/capital-run-id.ts` and its tests: ids, the parser, and round trips.
3. `capitalRunChapter` and its tests:
   - 16 fight nodes: 12 sub-bosses and 4 two-wave bosses, all at the capital's level.
   - Each general's lead element, as decision 3 says.
   - Shields of 6 and 8.
   - The same run id gives the same chapter; two run ids give different faces and the same elements.
   - The map's three-route capital is unchanged (a snapshot of `capitalChapter` for continent 1).
4. Export what H160 needs from the domain index (the ids) and from `world/capital.ts` (the generator).
5. Run `pnpm docs:update` if a live table moves, and log the D-row (fetch `main` first).

## Done when

- [ ] `pnpm lint && pnpm test:ci && pnpm build` pass, and main JS stays under 230 KB.
- [ ] The live map's capitals and every existing test are unchanged.
- [ ] Nothing from the original games in git (`git status`).
- [ ] Deployed green (`gh run watch <id> -R luismlorenzana/uma-rpg --exit-status`) and https://uma-rpg.web.app/api/health
      shows the commit.

## Deliver

- **Claude:** commit to `main`: "feat(domain): capital runs, the fourth Finals route and the run's foes (H159)".
- **ChatGPT:** a branch and a pull request with that title. Merge it yourself when the checks and CI are green. Fetch
  `main` before you push so the D-number is free.
- **Flag it done:** delete this file and add a Done row in [README.md](../README.md) with the commit.
