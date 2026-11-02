# H154 — Drills and Training Logs (dark)

**uma-rpg · Claude · L · Needs: H152 (save v35's fields) · Unblocks: H157**

## Why

The owner asked for a repeatable farm on a daily limit, and approved items over EXP (D283, CO21–CO24): **Drills**, five
fights at the tier's Lv 10–50, ten runs a day banked to thirty, pay **Training Logs**, which level whichever Uma reads
them. One party farms; the Umas it leaves on the bench level. Built **dark** behind H152's `collectionsLive`, on save
v35's fields H152 wrote; H157 switches it on.

## Context (read first)

- `CLAUDE.md`, `AGENTS.md`, [the manual](../../game/README.md): [loops](../../game/loops.md) (Leveling, Ranks, Springs,
  replays and Sweeps), [combat](../../game/combat.md).
- **The design:** [collections.md](../../design/collections/collections.md) §6.4 and §7.5; the
  [content page](../../design/collections/previews/content.html) (the calculator), the
  [screens page](../../design/collections/previews/screens.html), phones 5 and 6.
- **H152:** `collectionsLive`, `toV35` (`world.drills = { day, runs, won }`, `wallet.trainingLogs`).
- **What a win pays:** `save/battle.ts` `payEntrants`: `grantRpgExp`, `rpgShardsBetween` (Tier 1's Shards), `fillRanks`
  (twice her EXP to the class she fights as; a Tier 0 at Rank 10 keeps it waiting; past Rank 50, Class Marks at half);
  `rpgExpToNext`, `RPG_TIER_MAX_LEVEL`.
- **Fights:** `startFight`, `actInFight`, `settleFight`, `retreat` (the world map's one open fight); `world/world.ts`
  `stageWaves`, `world/biomes.ts`, `rpg/campaign/enemies.ts`; `rift/generate.ts` for how a fight outside the map is
  built and frozen into its input. Balance harness: `world/balance-v21.test.ts` (`SIM=1`).
- **Screens to copy:** the Exchange's Class Manual sheet (`manual-view.ts`, its counts), the Echo sheet (Fight, Sweep ×1,
  ×5), the shared fight screen.
- **The Battle page layout:** H153's decision 2 puts Drills at (0.8, 0.52).

## Decisions made

1. **Five Drills a tier,** `drill-1 … drill-5`, at the tier's Lv 10, 20, 30, 40 and 50 (in a later tier its lifetime
   level, as an Echo's is), paying **2 · 3 · 4 · 5 · 6 Logs** a win.
2. **The foes:** each Drill is one fixed stage: a squad of regular-rank foes in one wave, on a fixed seed
   (`drill-t<tier>-<n>`), built by the stage generator, its elements cycling Fire, Ice, Lightning, Light, Dark by Drill so
   the five ask for different weapons. Frozen into the fight's input, as every fight is. **Target:** an on-curve party
   at the Drill's level wins it on Auto in about 4–8 rounds; measure it with the balance harness and record the numbers.
3. **A run** is a fight won or one Sweep. The first win of each Drill is a real fight; after it, **Sweep ×1** and **×5**
   need no Sweep Ticket and spend runs. A loss or a retreat spends nothing. A Drill fight is the world map's one open
   fight, like any stage; no MP is carried out of it, no Spring is needed.
4. **Runs a day:** 10 a day, banked up to 30 (CO23). The day turns at **04:00 on the phone's clock**: the web passes the
   day's key (`YYYY-MM-DD` of local time minus four hours) into the rules, which add 10 for each new day since
   `drills.day`, capped at 30, and set `day`. Pure, so tests pass any day.
5. **What a Drill pays:** Training Logs into the world's wallet. Nothing else: no EXP to the party, no Laurels, no Bonds,
   no Shards.
6. **A Log** (CO22): read onto one Uma below Lv 50. Each pays `E = ⌈rpgExpToNext(level) ÷ 3⌉` Uma EXP at her level then
   (so three a level), through `grantRpgExp`, with Shards by level in Tier 1, and `fillRanks` for the class she fights
   as, exactly as a win pays her. Read one at a time in a loop, so a level-up mid-count reprices the next. Not at Lv 50:
   "Lv 50 · Trials pay ranks". 147 Logs take an Uma from Lv 1 to 50; a test pins it.
7. **The Logs sheet:** pick an Uma (highest level first, Lv 50 greyed with the reason), then **1, 5, 10, To Lv n** (the
   next multiple of ten) and **Max** (all she can take or all you hold), the result in one line ("Lv 23 → 26 · Healer R23
   → R26"), and **Read n**. It stays open after reading (G5).
8. **The place:** `drills`, page `battle`, kind `battle`, name "Drills", at (0.8, 0.52), open from the tier's first win.
   Until H156's art its building is uma-art's unused `gym`. Hidden while dark (not on the map, its route to the Battle
   page). Line: "Five fights a day pay Training Logs."
9. **The page:** "Drills", "Runs 18 · +10 at 4:00" (or "Runs 30 · full"), **Read Logs · 42**, then the five Drills: level,
   "4 Logs a win", **Fight** until won, then **Sweep ×1** and **×5** (greyed with "No runs left" at 0). A Drill's result
   shows "+4 Training Logs".
10. **The wallet chip:** Logs show on the Drills page and the Logs sheet only, not in the top bar.

## Do

1. Domain (`rpg/drills.ts` for the five and their fights, `save/drills.ts` for runs, fights, Sweeps and Logs), all
   behind `collectionsLive`, tested on `toV35` saves: the day's refill and cap, a run spent per win and Sweep, none on a
   loss, Logs paid, a Log's EXP and class share against `payEntrants` for the same E, 147 from Lv 1, Shards, Lv 50
   refused.
2. The balance numbers (decision 2), recorded in the D-row.
3. Web: the place (hidden while dark), the page, the fight's title ("Drill III · Lv 30") and result, the Logs sheet, the
   day key from the phone's clock.
4. Copy into `copy.ts` first; the copy test passes.
5. Look at it in a throwaway worktree with H157's switch applied (its own API and web ports, avoid 8098 and 5198, a
   scratch save): a Drill fought, swept, a day turned (change the day key), Logs read, at 390×844 and 375×667, light and
   dark. Leave the worktree in `/private/tmp` and remove it.
6. Log the D-row (fetch `main` first).

## Done when

- [ ] `pnpm lint && pnpm test:ci && pnpm build` pass. Say the main JS number, of 230 KB.
- [ ] Live play unchanged while dark: no Drills place, no new field written.
- [ ] Nothing from the original games in git (`git status`).
- [ ] Deployed green (`gh run watch <id> -R luismlorenzana/uma-rpg --exit-status`) and https://uma-rpg.web.app/api/health
      shows the commit.

## Deliver

- **Claude:** commit to `main`, "feat: Drills and Training Logs, dark (H154)".
- **Flag it done:** delete this file and add a Done row in [README.md](../README.md) with the commit.
