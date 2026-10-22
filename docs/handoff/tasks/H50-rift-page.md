# H50 — The Rift page: fronts, Convergence, Echoes, sign-up, Ascend, and its building

**uma-rpg · Either · L · Needs: H47 (generator), H48 (run rules), H49 (badges, cut-in, uma-art 2.11.0) · Unblocks: the owner's first run**

## Why

Everything under the Rift exists after H44–H49 except a way to play it. This packet turns the Battle page's locked
**Tier Finale** into **the Rift** ([the Rift](../../design/rift.md) §4–§8, H44's umbrella D-row point 5): its own
building, unlocked when the tier's world has five Lv 50 Umas, and a place page where the owner signs up twenty, plays
the four fronts' stage chains, assigns the Convergence's parties, farms the Echoes, and ascends. Fights run in the
existing fight screen with a Rift source, and the result shows the achievement cut-in. The Tier sheet's Rift line goes
live.

## Context (read first)

- `CLAUDE.md`, `AGENTS.md` (mobile first at 390×844, check 375×667, 44 pt targets, short player-facing text, D95),
  [change-protocol.md](../../change-protocol.md) (the Hub map, sheets and the place header are the kit's; this packet only
  fills them). Then [rift.md](../../design/rift.md) §4–§8, [tiers.md](../../design/tiers.md) §4–§5, the D-rows of
  H44–H49, D165 (active tier) and D167 (Tier sheet) in [decisions.md](../../decisions.md).
- The manual: [sections.md](../../game/sections.md) § Battle (the `places` live block), § Tier Finale, § Tiers.
- **The place** (`packages/domain/src/hub/places.ts`, lines on `527f33a`): `Place` (32–50), `tier-finale` (184–188,
  `opensIn: 'S8'`, `at: { x: 0.5, y: 0.72 }`), `isOpen` (214–216), `CURRENT_SLICE = 'S7'` (219); `places.test.ts`.
- **The Hub:** `apps/web/src/hub/HubScreen.tsx` (`frame: place.id` at 113, `open` at 108, `enterable` at 123, `pipsOf`
  at 56), `places/PlacePage.tsx:13`, `places/PlacePreview.tsx:10`, `hub/MenuSheet.tsx:21` all lock by `isOpen(place,
  CURRENT_SLICE)`. `places/registry.tsx` maps a place id to lazy `Peek`/`Page`/`Counter`.
- **The Tier sheet:** `apps/web/src/hub/TierSheet.tsx` `riftLine(_world)` (19–22) returns "The Rift isn’t open yet";
  `tierCards` and `TierSheet.test.tsx`. `hub/TierVeil.tsx` `useSwitchTier()` (47) switches tiers with the veil.
- **The fight screen:** `places/scenario-gate/FightScreen.tsx` is tied to the world map: `campaign` + `chapter` props
  (103–108), the open fight from `openFightOf(world)` and `rpgRunBattleStep` (110–111), `nodeId` and `node` (113–114),
  the biome from `campaign.regionInfo(chapter.id)` (74), `fightAction(chapter, action)` (192), `chapter.title` (275),
  `leaveFight()` (545), and a foe's label "acts twice" (in the enemy button's `aria-label`). `FightResult.tsx` is the
  world map's result. `ScenarioGatePage.tsx` `FightRoute` (213–247) wires them.
- **Shared bits:** `battle/campaign.tsx` (`CampaignGate`, `Campaign`: `view`, `cast`, `outfits`, `name`), `battle/labels.tsx`
  (`CLASS_LABEL`, `WeaknessIcons`, `formatLevel`, `Bar`), `RegionMap.tsx`'s private `CastFace` (25–44),
  `album/PickerStep.tsx` and `album/party-rows.ts` (`activePartyRows`), the kit's `UmaPicker` (`max`, `disabled`),
  `ui/RankBars.tsx`, `ui/BottomSheet.tsx`, kit `Sheet`.
- **The store** (`apps/web/src/save/game.ts`): `edit(import(...), change)` (142–149) captures the tier before the lazy
  import; `fightAction` (165–173) and `sweep` show the shape of an action that returns a result.
- **From H46–H49:** `rift/state.ts` (`RIFT_FRONTS`, `ECHO_LEVELS`, `RIFT_ROSTER`, `RiftFightRef`, `riftRefKey`,
  `openRiftRun`, `riftOpen`, `riftLevel50s`, `RIFT_OPEN_AT`, `RIFT_TIERS`, `CONVERGENCE_FIGHTS`); `@rpg/domain/rift`
  (`RIFT_FRONT_SPECS`, `riftChain`, `riftConvergence`, `riftFight`, `riftContextFor`, `signUpRift`, `cancelRiftRun`,
  `startRiftFight`, `riftFightBlock`, `beginConvergence`, `convergenceBlock`, `abandonConvergence`, `actInRiftFight`,
  `leaveRiftFight`, `riftBattleStep`, `sweepEcho`, `sweepEchoBlock`, `ascend`, `ascendBlock`, `signUpBlock`,
  `RiftFightResult`, `AscendSummary`, `ASCEND_PURSE`, `BANKED_EXP_PER_MARK`, `BANKED_MARKS_CAP`, `achievementDef`);
  `battle/pixel-icons.tsx` (`FrontCrest`, `AchievementBadge`); `achievements/AchievementCutIn.tsx`; uma-art 2.11.0
  pinned (the `rift` building frame, `page: battle`).

## Decisions made

**The place** keeps the id `tier-finale` (saves, links and the menu don't move) and becomes:
- `name: 'The Rift'`, `blurb: 'Twenty Lv 50 Umas seal four fronts, then ascend together.'`, `details: ['Four fronts of
  twelve stages, then the Convergence', 'Echoes: repeatable fights for Class and gear ranks', 'Ascend: all twenty move
  up a tier']`, and a new optional `Place.frame?: string` ("the uma-art building frame, when it isn't the id") set to
  `'rift'`. `HubScreen` draws `frame: place.frame ?? place.id`.
- `CURRENT_SLICE` becomes `'S8'` (S8 is "Tier Finale and promotion"). A place can now also wait on its world:
  `placeOpen(place, world, tier): boolean` and `placeLock(place, world, tier): string | null` in `places.ts`. For
  `tier-finale`, open means `riftOpen(world, tier)`; its lock reads "Opens at five Lv 50 Umas", or "No Rift in this tier
  yet" in Tier 3. Every other place is as `isOpen` says. HubScreen (open, pips, `enterable`, the label "The Rift, opens
  at five Lv 50 Umas"), PlacePage, PlacePreview and MenuSheet use them with `useWorld()` and `useActiveTier()`.

**The fight screen takes a source** (`apps/web/src/battle/fight-source.ts`), so the world map and the Rift share it:

```ts
export interface FightSource<R> {
  /** The open fight, or null. */
  battle: { battleId: string; input: BattleInput; actions: readonly BattleAction[] } | null
  /** The header's small line and title. */
  title: string
  name: string
  /** The stage's backdrop. */
  biome: Biome
  act: (action: BattleAction) => Promise<{ step: BattleStep; result: R | null }>
  leave: () => Promise<void>
}
```

`FightScreen<R>({ campaign, source, onEnd, onMap })` replays `source.battle` with `replayBattle`, plays as today, calls
`source.act`, and `onEnd(result)` when a result comes. The world map builds its source from `openFightOf(world)` and the
region chapter (`campaignFightSource(world, chapter, region)`), so it plays exactly as before. The Rift's source reads
`world.rift.battle`, with biome `'rift'` (the Twilight Rift's backdrop), title its front ("Iron front", "Convergence",
"Echo · Iron") and name from `riftRefLabel(ref)` ("Stage 5", "Champion", "Fight 2 of 4", "Lv 55"). The foe's label
names `thrice` ("acts three times"), and a warded foe's info line gets a chip: "Ward: magic" or "Ward: physical".

**Routes** under `/battle/tier-finale/`, every screen a place sub-route (D31):

| Rest | Screen |
|---|---|
| `` | **The Rift.** A status line; the open fight's "Resume"; then by state: "Sign up twenty" (disabled with "12 of 20 at Lv 50"), or the run: the four fronts as cards (crest at 2×, name, "5/12" or "Sealed", the guidance line from `RIFT_FRONT_SPECS[front].party`, e.g. "2 Brawler · 2 Spell Blade · Cleric"), the Convergence card ("Seal all four fronts" until then; then "Assign four parties", attempts, or the open attempt's "Fight 2 of 4 · Arcane"), "Ascend to Tier 2" once won; then the Echoes: four rows (crest, front) of three level chips, a ✓ on each won; a "Roster" button opens the twenty in a sheet, with "Cancel sign-up" while untouched |
| `front/<front>` | **A front's chain:** its ward chip on Iron and Arcane, the guidance line, twelve rows (stage name, its leaders' faces, cleared ✓, the next one highlighted, the rest locked); the next row opens the **stage sheet**: each foe's face, name, shield and `WeaknessIcons` by wave, a party chooser (the world's parties whose five are on the roster; the others disabled with the reason) and "Fight" |
| `convergence` | **Assign four parties:** four slots (Iron, Arcane, Duel, Horde), each a party chooser; "Begin" when the four cover the twenty (else the missing names); Begin calls `startConvergence` then starts fight 0. With an attempt open: the four parties, the fights won, "Fight" for the next and "End this attempt" |
| `signup` | **Sign up twenty:** "Four parties" (a party picker, max 4, parties of five Lv 50 Umas) or "Twenty Umas" (the kit's `UmaPicker`, `max={20}`, Lv 50 only), then a confirm sheet with the twenty faces: "They fight this Rift together until it ends." · Sign up |
| `fight` | The open Rift fight in `FightScreen`, then **the Rift result** |

The **Echo sheet** (from an Echo chip): the front and level, a party chooser (full parties of Lv 50 Umas), "Fight", and
once won "Sweep ×1" and "Sweep ×5" with the Sweep Ticket count; a Sweep shows the result like a win.

**The Rift result** (`places/rift/RiftResult.tsx`): Victory or Defeated and the rounds; a front: "Stage 5 cleared ·
5/12" or "Iron sealed"; the Convergence: "Fight 2 of 4 won", "The Rift is won!", or after a loss "The attempt is over";
an Echo: each member's rank bars (`RankRow`/`RankCells`) and Marks, no EXP line. Buttons: after a front win "Next stage"
(the same five again when one party still holds them, else the stage sheet) or "Back to the Rift"; a loss "Retry"; a
Convergence win "Next: Arcane"; an Echo "Fight again". When `result.earned` isn't empty, `AchievementCutIn` plays over
the result first.

**The Ascend sheet** (a kit `Sheet`, "Ascend to Tier 2"): "20 Umas move to Tier 2 at Lv 1", "Ranks, skills and Extra
Stats start over", "Their gear returns to Tier 1's stock", "Tier 2 gets 20,000 Laurels, 100 Speed Tickets and 3,450
Class Marks" (computed from `ASCEND_PURSE` and their banked EXP), and `ascendBlock`'s reason when there is one. "Ascend"
runs `ascendRun()`, then `useSwitchTier()(to)`, landing on Tier 2's Town Hall.

**The Tier sheet's line** (`riftLine(world, tier)`, main bundle, `rift/state.ts` selectors only): "No Rift in this tier
yet" (Tier 3), "The Rift opens at five Lv 50 Umas", "The Rift is open", "Rift run · 2 of 4 fronts sealed", "Rift won ·
ready to ascend".

**The store** (`save/game.ts`), lazy-importing `@rpg/domain/rift` (types with `import type`):
`signUpForRift(roster)`, `cancelRiftSignUp()`, `beginRiftFight(ref, party, outfits, roster)`,
`startConvergence(parties)`, `endConvergence()`, `retreatRift()`, `riftFightAction(action, roster): Promise<{ step;
result: RiftFightResult | null }>`, `sweepEchoes(front, level, party, times): Promise<RiftFightResult>`,
`ascendRun(): Promise<AscendSummary>`. `roster` is `campaign.cast.members`.

**Faces on the page:** `riftChain(riftContextFor(save, ref, roster, tier), front)` behind `CampaignGate`, memoized per
run, so the chain shows the faces the fights will have. `CastFace` moves from `RegionMap.tsx` to
`battle/CastFace.tsx` (exported) and both use it.

## Do

1. **Domain:** `Place.frame`, the Rift's words, `CURRENT_SLICE = 'S8'`, `placeOpen`, `placeLock`; tests in
   `places.test.ts` (the name and frame; open only with five Lv 50 Umas, in Tiers 1–2; locked in Tier 3; every other
   place unchanged by the world).
2. **Hub:** HubScreen, PlacePage, PlacePreview and MenuSheet on `placeOpen`/`placeLock`; the `rift` frame.
3. **`battle/fight-source.ts`**, the `FightScreen<R>` refactor, `campaignFightSource`, `CastFace`; the world map's
   `FightRoute` passes its source. The world map's fights must look and play exactly as before.
   **The Rift's foe traits on screen** (engine v14, D169; H44 left these for you):
   - `describeCue` in `battle/battle-view.ts` adds ` · warded` to a hit whose `label` is `'Warded'`, the way it adds
     ` · guarded` for `'Intercepted'`. Test it in `battle-view.test.ts`.
   - The foe button's `aria-label` in `FightScreen.tsx` says "acts three times" for `thrice` (in place of "acts twice")
     and "wards physical" or "wards magical" for `ward`.
   - Wherever a foe list shows the "Acts twice" badge (`RegionMap.tsx`, and `StageSheet.tsx`'s foes), show "Acts three
     times" for `thrice` and a "Wards Arms" or "Wards Tomes" badge for `ward`, in the same style. On the fight screen, a
     warded foe carries a small mark beside her element (the front's `FrontCrest` from H49 is fine), so the player
     learns which channel to bring before the hit cues teach it.
4. **`places/rift/`:** `RiftPage.tsx` (routes, behind `CampaignGate`), `RiftPeek.tsx` (status, the fronts' counts),
   `FrontChain.tsx`, `StageSheet.tsx`, `ConvergenceView.tsx`, `SignUp.tsx`, `EchoSheet.tsx`, `AscendSheet.tsx`,
   `RiftFightRoute.tsx`, `RiftResult.tsx`, and pure helpers in `rift-view.ts` (`riftRefLabel`, the eligible parties for
   a front, an Echo and sign-up, the missing names for the Convergence, the Ascend sheet's numbers). Registry:
   `'tier-finale': { Peek, Page }`, both lazy.
5. **The store actions** and `riftLine` in `TierSheet.tsx`.
6. **Tests:** `rift-view.test.ts` (labels; eligible parties with a Lv 49, an off-roster Uma and a part-empty party;
   Convergence coverage; the Ascend numbers); `TierSheet.test.tsx` (each Rift line); a `RiftPage.test.tsx` rendering the
   overview on a fixture world (four fronts with counts, sign-up disabled under twenty Lv 50 Umas, Ascend after a win);
   `RiftResult.test.tsx` (each outcome's lines and buttons; the cut-in first when something was earned).
7. **Docs:** `sections.md`: § Battle's table (the `places` block), a `### The Rift` section replacing § Tier Finale (each
   screen above, in short bullets), and § Tiers' Rift line; `rift.md` §4: "Built in H50 (D…)". Run `pnpm docs:update`.
   Log the D-decision (fetch `main` first; the next free number) with its own calls: `Place.frame`, `placeOpen`, the
   fight source, the routes, "Next stage" reusing the party, the Tier sheet's lines.
8. **Check it locally** (`.claude/launch.json`: `rpg-api` :8081, `rpg-web` :5174, or your own ports), at 390×844 and
   375×667, light and dark, in a desktop browser, never the iOS Simulator:
   - copy `apps/api/.data/save.json` aside; with a scratch script on the domain's CJS build, raise twenty-five Tier 1
     Umas to Lv 50 and give five parties of them on-curve gear if you can (the balance party's kit is a guide); raise
     `revision`, restart the API, clear site data;
   - `/battle?canvas`: the Rift's building on the Battle page, unlocked; with four Lv 50 Umas (another scratch save) it
     shows locked with "opens at five Lv 50 Umas";
   - sign up by four parties, open the Iron chain, play stage 1 on Auto, see the result, retry; play an Echo at Lv 45,
     then sweep it once;
   - with the script, set every front to 12: assign four parties, begin, play fight 1;
   - with the script, set `wonAt`: open Ascend, check its numbers, ascend, and land on Tier 2's Town Hall with twenty
     Umas; the Tier sheet's lines read right in both tiers;
   - the world map's fights play as before. Put the saved copy back.

## Done when

- [ ] `pnpm lint && pnpm test && pnpm build` pass. The build prints the main JS under 230 KB gzip (about 224 KB before
  H46–H49): the Rift page, the generator and the rules are lazy; only `placeOpen`, `riftLine` and the store's wrappers
  join the main bundle. Say the number, and if it passes 229 KB move whatever pushed it into the lazy chunk.
- [ ] The tests in steps 1 and 6 pass, and every existing test passes.
- [ ] The local check in step 8 was done at both widths and both appearances, and described.
- [ ] `docs/game/` and `rift.md` are in step, `pnpm docs:update` leaves no diff, and the D-decision is logged.
- [ ] Deployed green (`gh run watch <id> -R luismlorenzana/uma-rpg --exit-status`), and
  https://uma-rpg.web.app/api/health shows the commit in `build`.

## Deliver

- **Claude:** commit to `main` as `feat: the Rift's page, its fights and Ascend (H50)`, push, and watch the deploy.
- **ChatGPT:** branch `feat/h50-rift-page`, one pull request; merge it yourself once checks and CI are green (fetch
  `main` first for the D-number).
- Say in the delivery that nothing at the screen's edges changes beyond the existing fight screen, and that the owner's
  Rift opens once a world has five Lv 50 Umas.
- **Flag it done:** delete this file, set H50's State to Done in `docs/handoff/README.md`, and add a Done row with the
  commit.
