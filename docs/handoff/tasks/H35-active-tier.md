# H35 — Tier switching: every screen on the active tier's world

**uma-rpg · Claude · M · Needs: nothing · Unblocks: H36 (the Tier shifter), the Rift**

## Why

D159 made each tier its own world: its own Stable, Wilds, wallet and world map. The save already keeps one world per
tier (`Save.tierWorlds`), and every domain mutation already takes a `tier`. But the app reads Tier 1 everywhere:
- `useWorld()` returns `tierWorlds['1']`;
- no store action passes a tier;
- the top bar, the Account, the world map and the push tick are all fixed on Tier 1.

This packet adds an **active tier** and puts every screen on its world ([tiers](../../design/tiers.md) §4, §8 item 1).
Switching tiers remounts the whole app.

The Tier shifter on the top bar's crest is H36. Until the Rift promotes Umas, only Tier 1 exists, so **the game must
behave exactly as today**. Tests prove both halves:
- a Tier-1-only save gives the same saves and screens as before;
- a synthetic two-tier save shows each world's Umas, wallet and continents.

## Context (read first)

- `CLAUDE.md`, `AGENTS.md`, [change-protocol.md](../../change-protocol.md). The AccountBar's crest is kit-drawn, but
  its `tier?: number` prop already exists, so nothing here changes the kit.
- [tiers.md](../../design/tiers.md): §3 (one Uma, one tier), §4 (how it's built), §8 (building order). D5 (unlocks are
  Tier 1's only) and D159 in [decisions.md](../../decisions.md).
- The manual: [architecture.md](../../game/architecture.md) § Web app and § API; [sections.md](../../game/sections.md)
  § Scenario Gate, § Account and § Global UI.
- [H36](H36-tier-shifter.md) calls this packet's `useActiveTier()` and `setActiveTier(tier)`. Keep those names.

**Every hard-coded Tier 1 spot** (verified on `edbc8e0`). Grep `'1'`, `TIER_ONE`, `tierWorlds[`, `tier === 1`, and
`, 1,` in calls to `umaProfile` / `umaLoadout` across `apps/` and `packages/` before you finish. Nothing new should turn up.

| File | Line | What |
|---|---|---|
| `apps/web/src/save/game.ts` | 233–236 | `useWorld()` reads `s.save?.tierWorlds['1']` |
| `apps/web/src/save/game.ts` | 199 | `collectEverything` compares `r.save.tierWorlds['1'] !== save.tierWorlds['1']` |
| `apps/web/src/save/game.ts` | 86–231 | No action passes a tier. That covers `unlock`, `setSlot` and `nameParty`, every `edit(...)` action, and `fightAction`, `setStarGem`, `collect`, `collectEverything`, `collectWorker` and `sweep` |
| `apps/web/src/hub/Bars.tsx` | 16, 31, 32 | The wallet from `tierWorlds['1']`, `tier={1}`, and the label "…, Tier 1". The Uma Tickets chip is shown in every tier |
| `apps/web/src/places/account/AccountPage.tsx` | 20, 25, 34, 36 | The wallet, "Tier 1 wallet", "Tier world: Tier 1", and "Umas unlocked" from `tierWorlds['1']` |
| `apps/web/src/battle/campaign.tsx` | 27, 31, 40, 50 | The cache has no tier key. It filters `c.tier === 1` for the continents and the colour, and calls `regionChapter(info!, roster)` (default `tier = 1`) |
| `apps/web/src/places/scenario-gate/ScenarioGatePeek.tsx` | 8 | `view.chapters.filter((c) => c.tier === 1)` |
| `apps/web/src/places/scenario-gate/ScenarioGatePage.tsx` | 78, 89, 96, 99 | `later` is every tier above 1. It matches chapters by `ch.tier === 1`, and has the heading "Tier 1 · five continents" |
| `apps/web/src/places/scenario-gate/ScenarioGatePage.tsx` | 91, 93, 107, 144, 157, 205 | Raw `Lv ${levelStart}–${levelStart + 9}` and `Lv ${levelStart + 9}`. These are lifetime levels: Tier 2 would read "Lv 51–60" |
| `apps/web/src/places/stable/SkillsPage.tsx` | 28, 32 | `umaProfile(outfit, uma, 1, classId)` and `umaLoadout(…, 1, …)` |
| `apps/web/src/places/stable/OutfitProfile.tsx` | 116, 209, 212, 278 | `UnlockBox` in every tier; `umaProfile` and `umaLoadout` with `1`; `{ tier: 1, id }` |
| `apps/web/src/places/scenario-gate/ActiveParty.tsx` | 45, 49 | `umaProfile(…, 1, …)` and `{ tier: 1, id: n }` |
| `apps/web/src/places/stable/TicketCounter.tsx`, `StablePeek.tsx` | 6; 27 | Uma Tickets shown in every tier |
| `apps/web/src/album/rows.ts` | 46–51 | `albumRows` lists the whole roster with `world.umas[id] ?? null`. A tier above 1, and Tier 1 after a promotion, would list Umas who live in another world |
| `apps/web/src/hub/Featured.tsx` | 15 | One `rpg.featured` key for every tier |
| `packages/domain/src/save/battle.ts` | 202 | `umaBattleSheet` calls `umaProfile(outfit, uma, 1, classId)` |
| `packages/domain/src/save/notify.ts` | 26, 43, 55–66 | `finishesBetween` and `readySlots` default to `TIER_ONE`. `finishNotice` links without a tier |
| `packages/domain/src/save/rules.ts` | 32–41 | `unlockUma` checks only its own world, so an Uma promoted out of Tier 1 could be unlocked there again |
| `packages/domain/src/world/world.ts` | 158 | `regionChapter(region, roster, tier = 1)`. Callers must pass the tier |
| `apps/api/src/push/push.service.ts` | 51, 54 | `finishesBetween(save, from, now)` and `readySlots(save, …)`: Tier 1 only |

**Correct as they are; keep them:**
- `save.ts:779` (Tier 1 is required);
- `battle.ts:398` (Uma Shards only in Tier 1, D5);
- `app/Root.tsx:27` (a first launch is always Tier 1);
- `world/balance-party.ts` (the simulation is Tier 1 by design);
- every domain mutation's `tier = TIER_ONE` default. Tests and the simulation use it, and the web passes the tier
  explicitly from now on.

**What already works:**
- `worldContinent({ name, order })` gives lifetime levels: order 6 starts at Lv 51 with ids `w6-…`.
- `capitalChapter` takes its tier from the order.
- `stockedGrades` folds the bands per tier.
- `formatLevel`/`formatLevels` (`battle/labels.tsx`) print "T2 Lv 1–10" for lifetime levels.
- The kit's `HubCanvas` destroys its Phaser game on unmount.
- `push-sw.js`'s `notificationclick` does a full navigation (`WindowClient.navigate`), so a push link always boots the
  app.

**Other code you'll touch:**
- The router's layout routes are in `app/router.tsx`.
- `Root.tsx`'s `bootFor` calls `boot(uid)`.
- The kit's `BootGates` applies `startPath` only when the app opens at `/`.
- `hub/start.ts` is the pattern for a device key (`rpg.lastPage`).

## Decisions made

**The active tier (web store):**
- `GameState.activeTier: number`, default 1. `useActiveTier()` returns it.
- `setActiveTier(tier: number): boolean` switches the tier and remembers it. It returns false, and changes nothing,
  when the save has no world for that tier. It never navigates: H36's sheet does that.
- **The device key is `rpg.tier`.** It's written on every change, boot included.
- **The start tier at boot:**
  - first, a valid `?tier=` from the URL;
  - else the remembered tier, if the save has its world;
  - else the highest tier whose world has an Uma;
  - else 1.

  `createAccount` starts on 1.
- **A sync** that adopts a save without the active tier's world falls back to the start rule. This can't happen today.
- **Domain keys stay strings.** Add `tierKey(tier: number): string` and `savedTiers(save): number[]` (ascending) to
  `packages/domain/src/save/rules.ts`. The store turns the number into a key at the domain call.

**A different app instance:**
- A new `hub/TierShell.tsx` replaces `<Shell />` in `app/router.tsx`. It renders `<Shell key={activeTier} />`.
- Switching tiers unmounts and remounts the bars, every place, the Hub's Phaser scene and every component cache.
- **Module caches keyed by world get the tier in their key.** `battle/campaign.tsx`'s cache becomes
  `WeakMap<MasterView, WeakMap<Cast, Map<number, Campaign>>>`.

**Actions:**
- `edit(...)` **captures the active tier when the action is called**, then reads the save after the lazy import, as
  today. An action started on Tier 1's screen never lands on Tier 2 because of a switch mid-import.
- Every action passes `tierKey(tier)` as the domain's `tier` argument, the direct ones included.
- `renameAccount` is account-wide and takes no tier.
- `collectEverything` compares the active world.

**Screens:**
- `useWorld()` returns the active tier's world.
- The tier-aware rules calls use the active tier: `umaProfile`, `umaLoadout`, `umaBattleSheet` (it gains a
  `tier: number = 1` parameter), and the `{ tier, id }` refs.
- **The world map** (`buildCampaign(view, cast, tier = 1)`) shows the active tier's continents (ids `w6`–`w10` in
  Tier 2), and passes the tier to `regionChapter`. Every continent level label uses `formatLevels` / `formatLevel`, so
  Tier 1 still reads "Lv 1–10".
- **The world map's heading** is "Tier n · five continents". The count is in words: "four" for a partial tier (T9).
- **The world map's locks** show the tiers above the active one that have no world in the save.
- **Uma Tickets are Tier 1's only (D5).** In a tier above 1:
  - the top bar shows two chips, Laurels and Speed Tickets;
  - the Stable's ticket counter and the peek's ticket line are hidden;
  - the Account's wallet shows Laurels, Speed Tickets and Sweep Tickets.
- **The top bar:** `tier={activeTier}`, the label `Account: {name}, Tier n`, and the active world's wallet.
- **The Account** shows the active tier's wallet under "Tier n wallet". "Tier world" reads Tier n. "Umas unlocked"
  counts the Umas of every world.
- **One Uma, one tier (§3):**
  - the domain's `ownerTier(save, outfitId): number | null` says which world she lives in;
  - `unlockUma` refuses an outfit owned in any world (`already-owned`);
  - `parseSave` refuses an outfit owned in two worlds ("lives in one tier world"). No stored save can break this today;
  - **the album:** `albumRows` gains a last parameter, `scope: { tier: number; elsewhere: ReadonlySet<string> }`,
    defaulting to Tier 1 with nobody elsewhere. A row is listed when the world owns her. In Tier 1 only, a row is also
    listed when no world owns her (the catalogue to unlock, D5);
  - a `useAlbumScope()` hook in `save/game.ts` gives the scope. Every `albumRows` caller passes it: the Stable, its
    peek, the Observatory, the Exchange, the Party Hall, the facilities, the Halls and the Featured sheet;
  - **an outfit's profile, for an outfit not in the active world:** "In Tier n" when another world owns her, "Unlocked
    in Tier 1" in a tier above 1, else today's Unlock box.
- **The featured Uma is remembered per tier:** Tier 1 keeps `rpg.featured`, and other tiers use `rpg.featured.t<n>`.
- **The Wilds tab badge** counts the active world. The app's icon badge (push) counts every world.

**Routes and `?tier=`:**
- Routes don't change.
- `bootFor` passes `new URLSearchParams(window.location.search).get('tier')` to `boot(uid, askedTier)`, so the first
  render is already on the right world.
- `TierShell` handles a `tier` param in a layout effect:
  - it calls `setActiveTier(Number(tier))`, ignoring an invalid or missing world;
  - then it navigates to `withParam(location, 'tier', null)` with `replace`, keeping `location.state`.

**Push (domain `save/notify.ts` and the API tick):**
- `finishNotice(all, tier = 1, named = false)`:
  - the link always carries `?tier=n`: `/wilds/mine?tier=1`. A click then always lands on the right world, even
    while another tier is active;
  - when `named`, the title gains `Tier n · `, as in "Tier 2 · Work done";
  - the tag gains `t<n>-` above Tier 1.
- `tierNotices(save, from, to): Notice[]` gives one notice per tier world with news, in tier order. `named` is true
  when the save has more than one world.
- `readyEverywhere(save, now)` sums `readySlots` over every world: the badge.
- `PushService.tick` delivers each notice with that badge. `sent` counts notifications: one tier world sends one, as
  today.
- `test()` is unchanged.

**Out of scope:**
- the Tier shifter and the tints (H36);
- promotion and the Rift;
- any kit change.

## Do

1. **Domain** (`packages/domain/src/`):
   - `save/rules.ts`: `tierKey`, `savedTiers` and `ownerTier`. `unlockUma` refuses an outfit owned in any world;
   - `save/save.ts` `parseSaveChecked`: after the worlds, refuse an outfit owned in two worlds;
   - `save/battle.ts`: `umaBattleSheet(outfit, uma, classId, tier = 1)`;
   - `save/notify.ts`: `finishNotice`'s `tier` and `named`, `tierNotices` and `readyEverywhere`. Export the new
     names from `index.ts`.
2. **The store** (`apps/web/src/save/game.ts`, and a new `save/tier.ts`):
   - `save/tier.ts`: `rememberedTier()`, `rememberTier()` and the pure `startTier(save, asked, remembered)`. Wrap
     storage in try/catch, as `hub/start.ts` does;
   - `game.ts`: `activeTier`, `boot(uid, askedTier = null)`, `setActiveTier`, `useActiveTier`, `useWorld`,
     `useAlbumScope`;
   - `edit` captures the tier, and every action passes `tierKey(tier)`. The sync's adopt path re-validates the tier.
3. **The shell:**
   - `hub/TierShell.tsx` with the `?tier=` effect;
   - `app/router.tsx` uses it;
   - `app/Root.tsx`'s `bootFor` passes the asked tier.
4. **Screens:**
   - `hub/Bars.tsx` and `places/account/AccountPage.tsx`;
   - `battle/campaign.tsx`, `ScenarioGatePeek.tsx` and `ScenarioGatePage.tsx` (tier, labels, heading, locks);
   - `SkillsPage.tsx`, `OutfitProfile.tsx` and `ActiveParty.tsx`;
   - `TicketCounter.tsx` and `StablePeek.tsx`;
   - `album/rows.ts` and its eight callers;
   - `hub/Featured.tsx`.

   Update the header comments that say "Tier 1".
5. **The API:** `apps/api/src/push/push.service.ts` uses `tierNotices` and `readyEverywhere`.
6. **Tests: Tier 1 exactly as today.** Every existing test passes unchanged, except three:
   - `notify.test.ts`: `url: '/wilds/mine?tier=1'`;
   - `push.service.test.ts`: `url: '/wilds/mine?tier=1'`. Its title, body, badge and `sent` stay as they are;
   - `save-async.test.ts`, "a malformed fight in a second tier". It copies Tier 1's world into Tier 2, so its Umas would
     live in two worlds, and the async parser would fail on that before replaying. Give that case an empty
     `newTierWorld` as Tier 1, so the bad seed stays the only fault.
7. **Tests: two tiers.** Build a synthetic fixture: `newSave` with Tier 1's Umas, plus
   `tierWorlds['2'] = { ...newTierWorld(NOW, 0), umas: { <two other ids>: newOwnedUma(NOW) } }` with its own Laurels.
   - **`packages/domain/src/save/rules.test.ts`:**
     - `ownerTier`;
     - `unlockUma` in Tier 1 refuses an outfit Tier 2 owns;
     - `parseSave` refuses an outfit in two worlds;
     - `savedTiers` is `[1, 2]`.
   - **`notify.test.ts`:**
     - a job finishing in Tier 2 gives a notice linking `?tier=2`, titled "Tier 2 · Work done";
     - finishes in both worlds give two notices, in tier order;
     - `readyEverywhere` sums both;
     - a one-world save has no "Tier" in its title.
   - **`battle.test.ts`:** `umaBattleSheet` at tier 2 projects higher stats than tier 1 for the same Uma Level.
   - **`apps/web/src/save/tier.test.ts`:** `startTier`:
     - asked beats remembered, and remembered beats the highest tier with Umas;
     - an asked or remembered tier with no world is ignored;
     - an empty Tier 2 world loses to Tier 1 with Umas.
   - **`save/game.test.ts`:**
     - boot with no `rpg.tier` opens Tier 2;
     - `boot(uid, '1')` opens Tier 1 and writes `rpg.tier`;
     - `setActiveTier(7)` returns false;
     - after `setActiveTier(2)`:
       - `useWorld`'s selector returns Tier 2's world;
       - `buyTicket('time', 1)` spends Tier 2's Laurels;
       - `pickClass` changes a Tier 2 Uma;
       - `markTarget` marks a Tier 2 Uma;
       - Tier 1's world stays `toEqual` its value before;
     - an action called on Tier 1, then a switch before its import resolves, still writes Tier 1.
   - **`hub/TierShell.test.tsx`** (mock `./Shell` with a mount counter and an `<Outlet />`):
     - `setActiveTier(2)` remounts it;
     - opening `/wilds?tier=2` lands on `/wilds` with Tier 2 active;
     - `?tier=9` is dropped and Tier 1 stays.
   - **`battle/campaign.test.ts`:** extend `syntheticMasterData()`'s scenarios with copies at orders 2–10.
     - Tier 1 gives `w1`–`w5`, the same continents as before;
     - Tier 2 gives `w6`–`w10`, and its region chapters have `tier: 2` and levels from 51;
     - the cache returns a separate campaign per tier.
   - **`album/rows.test.ts`:**
     - the Tier 1 scope with an outfit owned elsewhere drops her;
     - the Tier 2 scope lists only Tier 2's Umas;
     - the default scope gives today's rows.
   - **`push.service.test.ts`:** a two-tier save sends one notice per tier with its `?tier=`, both with the summed
     badge, and `sent: 2`.
8. **Docs:**
   - **`docs/game/architecture.md`:**
     - § Web app, the store: `activeTier`, `rpg.tier`, the start rule and the remount;
     - § Web app, the routing: `?tier=`;
     - § API: the push tick reads every tier world.
   - **`docs/game/sections.md`:**
     - a `## Tiers` section before `## Global UI`: one world on screen at a time, the active tier and how it starts,
       the remount, `?tier=` links, and one Uma in one world. H36 merges into it;
     - § Scenario Gate, the World bullet: "the active tier's continents";
     - § Account: "Tier n wallet", and what a tier above 1 shows;
     - § Global UI: the crest is the active tier's, and the Uma chip is Tier 1 only;
     - § Global UI, Push: one notification per tier world with news, titled with its tier when there are several; the
       badge counts every tier.
   - **`docs/design/tiers.md`:** under the banner, one line: "§8 item 1 built in H35 (D…), except the Tier shifter
     (H36)."
   - Run `pnpm docs:update`.
   - Log the D-decision: fetch `main` first and take the next free number. That's D162 if `main` still ends at D161.
9. **Check it locally** (`.claude/launch.json`: `rpg-api` on :8081 and `rpg-web` on :5174), at 390×844 and 375×667,
   in a desktop browser. Use `?canvas` on Hub pages for screenshots. Never the iOS Simulator.
   - **Tier 1 only (the local save as it is):**
     - Town Hall, the Stable and a profile, the Party Hall, the Scenario Gate's world map and a region, a Wilds facility
       with a running job, the Exchange and the Account all look and work as before;
     - the top bar has the Tier 1 crest and three chips.
   - **A synthetic second tier:**
     - copy `apps/api/.data/save.json` aside, then stop the API;
     - run a scratch script outside the repo (never committed), with the domain's CJS build
       (`pnpm --filter @rpg/domain build`). It adds `tierWorlds["2"]`: `newTierWorld(now, 0)` with two outfits Tier 1
       doesn't own and 5,000 Laurels. It also raises the row's `revision` by 1;
     - restart the API, clear the site's data (IndexedDB `uma-rpg` and `rpg.tier`), and reload.
   - **Expect:**
     - the app opens on Tier 2;
     - the top bar shows the Tier 2 crest, 5,000 Laurels and no Uma chip;
     - the Stable lists the two Umas and no locked catalogue;
     - the world map shows Tier 2's continents as "T2 Lv 1–10" and on;
     - the Account shows "Tier 2 wallet".
   - **Then:**
     - open `/town?tier=1`. It shows Tier 1, and the address bar drops `?tier`;
     - reload: it stays on Tier 1.
   - Put the saved copy back afterwards.

## Done when

- [ ] `pnpm lint && pnpm test && pnpm build` pass. The build prints the main JS under 230 KB gzip (D56).
- [ ] Every existing test passes, with only the three changes in step 6.
- [ ] The new tests in step 7 pass: `tier.test.ts`, `TierShell.test.tsx`, `campaign.test.ts`, and the additions to
  `rules.test.ts`, `notify.test.ts`, `battle.test.ts`, `game.test.ts`, `rows.test.ts` and `push.service.test.ts`.
- [ ] The grep in Context finds no hard-coded Tier 1 left outside the "keep" list.
- [ ] The local check in step 9 was done at both widths, and described in the delivery.
- [ ] `docs/game/` is in step, `pnpm docs:update` leaves no diff, and the D-decision is logged.
- [ ] Deployed green: `gh run watch <id> -R luismlorenzana/uma-rpg --exit-status`, and
  https://uma-rpg.web.app/api/health shows the commit in `build`.

## Deliver

- **Claude:** commit to `main` as `feat: every screen on the active tier's world (H35)`, push, and watch the deploy.
  - Nothing at the screen's edges changes with Tier 1 only. Say so in the delivery.
- **Flag it done:**
  - delete this file;
  - add a Done row to `docs/handoff/README.md` with the commit.
