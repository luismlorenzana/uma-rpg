# H48 — The Rift's run rules and Ascend

**uma-rpg · Claude · L · Needs: H45 (a playable Tier 2), H46 (save v24), H47 (the generator) · Unblocks: H50 (the page), H51 (Echo pacing)**

## Why

The generator (H47) builds Rift fights; this packet makes them a game over the save
([the Rift](../../design/rift.md) §4–§8, [tiers](../../design/tiers.md) §5):
- a world's Rift **opens** at five Lv 50 Umas; twenty Lv 50 Umas **sign up** as a run's roster;
- the roster fights the four **fronts** stage by stage, free retries, HP and MP full every fight; stage 12 **seals** a
  front;
- the **Convergence**: four parties assigned up front, four fights in a row, a loss ends the attempt; the fourth win
  **wins the run**;
- **Echoes** for any party of Lv 50 Umas pay 2× Class and gear rank EXP; **Sweeps** clear won Echoes;
- every won Rift fight records its **defeated faces** and asks H49's hook for **achievements**;
- **Ascend** moves the twenty to Tier t+1 at Lv 1, in one save transaction, with tiers.md §5 in full.

Pure functions over the save that return a new save or throw `SaveRuleError`, like every rule file. No screen (H50).

## Context (read first)

- `CLAUDE.md`, `AGENTS.md`. Then [rift.md](../../design/rift.md) §4–§8 and §12 (R2, R4, R6, R7, R9), [tiers.md](../../design/tiers.md)
  §3–§5 (T3, T4, T5), and H44's umbrella D-row (points 2 and 6), H46's and H47's D-rows.
- The manual: [loops.md](../../game/loops.md) § Ranks, § Laurels and EXP, § Springs, replays and Sweeps.
- **H46's shape** (`rift/state.ts`): `RiftRun` (`convergence: { attempts, open }`, `traces`), `RiftAttempt`,
  `RiftFightRef`, `riftRefKey`, `RiftBattle`, `RiftState.battle` and `battles`, `riftBattleId`, `RIFT_TIERS`,
  `RIFT_TRACES`, `CONVERGENCE_FIGHTS`, `sealId`, `conqueredId`; `Account.defeated`; **`rift/achievements.ts`**:
  `RiftWin`, `AchievementGrant`, `achievementsEarned(win, held)` (H49 fills it; call it as it is).
- **H47's generator** (`@rpg/domain/rift`): `RiftContext`, `riftFight`, `riftBattleInput`, `riftSeed`,
  `defeatedBefore`, `RIFT_FRONT_SPECS`.
- **`packages/domain/src/save/battle.ts`** (lines on `527f33a`):
  - `startFight` (276–300) builds each member at 287–294 (`umaProfile`, `umaLoadout`, `umaPoints`, `equippedMight`,
    `equippedAccessories`, `heroFields`);
  - `usedWeapons` (332–347), `Entrant` (329), `MemberGain` and `RankGain` (320–327);
  - `payEntrants` (393–437): `fill` (405–414) grants a track and banks overflow as Marks (`MARKS_SHARE`); class 2E,
    weapons `weaponExpShares` (5E, a used one double), armor E each, accessories E each; then Bonds, Shards, Laurels.
- **`packages/domain/src/rpg/campaign/run.ts`:** `rpgBeginRunBattle` (56–83) builds allies inline at 66–77 (carried MP
  through `rpgCarriedMp`); `REFUSED` (91–95) maps engine errors to words; `rpgActInRun` (98–107).
- **`rpg/campaign/rewards.ts`:** `rpgBattleExp(kind, foeLevel, memberLevel)` (41): a share of **her** level, less below
  her (−10% a lifetime level), never more above (D102); `rpgMemberLevel` in `run.ts` (41).
- **`save/exchange.ts`:** `MAX_PURCHASE` 99 (15), `mergeGains` (68–85, private), `sweepMany` (88–108).
- **`save/rules.ts`:** `SaveRuleError`, `TIER_ONE`, `tierKey`, `worldOf`, `TIERS`. **`save/status.ts`:** `workOf` (a
  slot held). **`save/heroes.ts`:** `setHero(…, null)` empties a seat and sends its Learners away (90–101).
  **`save/forge.ts`:** `ownGear(uma)` (17), every piece bound to her.
- **`save/save.ts`:** `newTierWorld`, `newOwnedUma`, `startingArmorKinds`, `MAX_UMA_LEVEL`, `PARTY_SIZE`; an Uma at Lv 50
  banks her EXP in `exp`.

## Decisions made

**Where it lives:** `packages/domain/src/save/rift.ts`, exported from H47's barrel (`rift/index.ts`:
`export * from '../save/rift'`), so the web lazy-imports one module, `@rpg/domain/rift`. Three selectors the main
bundle needs go in `rift/state.ts` instead (H50's Hub, Tier sheet and quick look read them):

```ts
export const RIFT_OPEN_AT = 5                                          // Lv 50 Umas a world needs (§4)
export function riftLevel50s(world: { umas: Record<string, { level: number }> }): number
export function riftOpen(world: { umas: Record<string, { level: number }> }, tier: number): boolean   // RIFT_TIERS and ≥ 5
export function openRiftRun(rift: RiftState): RiftRun | null           // the last run, if not ascended
```

**The interface** (`save/rift.ts`; H50 calls exactly these, every `tier` a world key defaulting to `TIER_ONE`):

```ts
export const ECHO_RANK_PAY = 2                                         // R6
export const ASCEND_PURSE = { laurels: 1000, speedTickets: 5 } as const // per Uma (T5)
export const BANKED_EXP_PER_MARK = 10, BANKED_MARKS_CAP = 2000         // T3, per Uma

export function signUpBlock(save: Save, roster: readonly string[], tier?: string): string | null
export function signUpRift(save: Save, roster: readonly string[], now: string, tier?: string): Save
export function cancelRiftRun(save: Save, now: string, tier?: string): Save
export function riftContextFor(save: Save, ref: RiftFightRef, roster: EnemyRoster, tier?: string): RiftContext
export function riftFightBlock(save: Save, ref: RiftFightRef, party: number | null, tier?: string): string | null
export function startRiftFight(save: Save, ref: RiftFightRef, party: number | null, outfits: ReadonlyMap<string, BattleOutfit>,
  roster: EnemyRoster, now: string, tier?: string): Save
export function convergenceBlock(save: Save, parties: readonly number[], tier?: string): string | null
export function beginConvergence(save: Save, parties: readonly number[], now: string, tier?: string): Save
export function abandonConvergence(save: Save, now: string, tier?: string): Save
export function riftBattleStep(world: TierWorld): BattleStep | null
export function actInRiftFight(save: Save, action: BattleAction, roster: EnemyRoster, now: string, tier?: string):
  { save: Save; step: BattleStep; result: RiftFightResult | null }
export function leaveRiftFight(save: Save, now: string, tier?: string): Save
export function riftTraces(input: BattleInput, actions: readonly BattleAction[]): RiftTrace[]
export function sweepEchoBlock(save: Save, front: RiftFront, level: EchoLevel, party: number, tier?: string): string | null
export function sweepEcho(save: Save, front: RiftFront, level: EchoLevel, party: number, times: number, now: string, tier?: string):
  { save: Save; result: RiftFightResult; swept: number }
export function ascendBlock(save: Save, tier?: string): string | null
export function ascend(save: Save, now: string, tier?: string): { save: Save; summary: AscendSummary }

export interface RiftFightResult {
  outcome: 'victory' | 'loss'
  ref: RiftFightRef
  /** 0 for a Sweep. */
  rounds: number
  /** Echoes: each member's rank bars (`exp` 0, level unchanged, no Bonds); empty for front and Convergence fights. */
  members: MemberGain[]
  gearMarks: number
  classMarks: number
  /** A front fight won: that front's stages cleared now (12 sealed it); else null. */
  cleared: number | null
  /** A Convergence fight won: its attempt's wins now (4 won the run); null after a loss or for other fights. */
  attempt: number | null
  runWon: boolean
  /** In `ACHIEVEMENT_IDS` order. */
  earned: AchievementGrant[]
  /** Sweeps only. */
  swept?: number
}
export interface AscendSummary { from: number; to: number; umas: string[]; laurels: number; speedTickets: number; classMarks: number }
```

**The run:**
- **The Rift is open** in a world of a `RIFT_TIERS` tier with five Lv 50 Umas. Echoes need it open; so does signing up.
- **Sign-up:** exactly 20 distinct Umas, each owned here and Lv 50; no open run (the last ascended, or none). The run is
  `{ id: riftRunId(tier, n), roster, startedAt: now, fronts: all 0, convergence: { attempts: 0, open: null }, traces:
  {}, wonAt: null, ascendedAt: null }`.
- **Cancel** removes an untouched open run (every front at 0, no attempt, no open Rift fight). Not in rift.md; it saves
  a mis-tapped roster from weeks of lock, and touches nothing else.
- **The roster lock:** front and Convergence fights take only roster Umas. Between fights the owner arranges the world's
  parties as they like, and changes classes, skills and gear freely (R2).
- **Parties:** a front fight or an Echo is fought by one of the world's twenty parties (`party` 0–19), which must be
  full. Front fights need all five on the roster; Echoes need all five at Lv 50. A Convergence fight ignores `party`:
  its five are the attempt's frozen `parties[fight]`.
- **One open Rift fight a world**, beside and independent of the world map's open fight (neither blocks the other).
- **Front fights** take the next stage only: `stage === fronts[front] + 1`; 12 seals it. No replays of cleared stages.
- **The Convergence:** with every front sealed and no open attempt, `beginConvergence` takes four distinct full parties
  (front order) whose twenty are exactly the roster, freezes their ids, and counts an attempt. Fight i is
  `{ kind: 'convergence', fight: i }`, i = wins so far. A loss, or leaving the fight, ends the attempt;
  `abandonConvergence` ends one between fights. The fourth win sets `wonAt` and closes the attempt.
- **Every fight:** built with `riftFight(riftContextFor(...), ref)`, the members as `startFight` builds them, **MP
  full**, `rift.battles + 1`, id `riftBattleId`, seed `riftSeed(id)` (a fresh seed every retry, the same foes).
  `riftContextFor` gives a front or Convergence fight `{ tier, runId: run.id, roster, defeated:
  defeatedBefore(account.defeated, run.startedAt) }`, and an Echo `{ tier, runId: null, roster, defeated: new Set() }`.
- **A win** clears `rift.battle`, then by kind:
  - **front:** `fronts[front] = stage`; `traces[front]` takes the union with `riftTraces(input, actions)`, in
    `RIFT_TRACES` order;
  - **Convergence:** `rounds` gains `state.round`; the fourth sets `wonAt` and `open: null`;
  - **Echo:** the pay below, and `echoes[front][level] ??= now`;
  - **every win:** `account.defeated` gains each foe's cast id (every wave) whose roster tier is `boss` or `subboss`, at
    `now`, if absent; then `achievementsEarned({ tier, ref, run, attemptRounds, state, defeated, roster },
    account.achievements)` and each grant is stored as `{ at: now, run: grant.run }`.
- **A loss or leaving** pays and records nothing; for a Convergence fight it also ends the attempt.
- **`riftTraces`** replays the fight action by action and reads its cues: `physical` or `magical` when an Uma's hit on a
  foe (an attack, skill, summon or Limit Break; not Thorns, Mirror or Burn, which return or tick) deals damage in that
  channel; `ko` when an Uma is knocked out.
- **Front and Convergence fights pay nothing else:** no EXP, Laurels, Marks or Bonds (H44's D-row, point 6).

**Echo pay (R6):** for each of the five still owned here, E = `rpgBattleExp('fight', foeLevel, memberLevel)` with
`foeLevel` the input's first foe's level: a regular stage's EXP at the Echo's level for her. So Lv 45 pays half (D102's
gap), and Lv 55 pays as Lv 50 (fighting above her never pays more). Then `ECHO_RANK_PAY` × what a stage fills: class
2E, weapons `weaponExpShares` (used ones double), armor E a kind, accessories E a type; overflow past a max rank banks
as Marks at `MARKS_SHARE`. **No Uma EXP, levels, Shards, Laurels or Bonds.** Extract the track-filling part of
`payEntrants` into an exported helper (e.g. `fillRanks(uma, entrant, exp, scale)`) that both use; `payEntrants`'
results must not change.
- **A Sweep** of a won Echo: a full party of Lv 50 Umas, a Sweep Ticket each, up to `MAX_PURCHASE`, pays exactly an
  Echo win with her five weapons sharing evenly (nothing "used"), as a stage Sweep does. Results merge with
  `mergeGains` (export it from `exchange.ts`). Sweeps record no faces and earn no achievements.

**Ascend (tiers.md §5), one transaction:**
- **Blocks:** a won, unascended run in this tier; no open Rift fight and no open world-map fight in this world; each of
  the twenty owned here and holding no work slot (`workOf`; "Recall or collect: <names>"); the next tier is in `TIERS`.
- **The old world:** each leaves `umas`, every party slot, `targets`, `world.run.mp` and her `work` row; a seat she's
  the Hero of empties as `setHero(seat, null)` does (its Learners leave; T4), and she leaves every seat she learns in;
  **every piece she owns (`ownGear`) returns to the gear stock**, +1 each (worn and locker alike: "items and gear stay in
  the old world", D15). Her Star Gem nodes are gone (§5: gems already set aren't returned).
- **The new world** (`tierWorlds[t+1]`, created with `newTierWorld(now, 0)` if absent, no Uma Tickets, D5): each arrives
  as `newOwnedUma(uma.unlockedAt)` with her `classId` and her armor halves (`gear.kinds`) kept, so: Lv 1, Class Rank 1
  everywhere, no skills, Training gear, an empty map, Craft Lv 1 (tier2-world §11's first week assumes it), no Bonds.
- **The wallet:** `ASCEND_PURSE` × 20 (20,000 Laurels, 100 Speed Tickets = `timeTickets`), plus each Uma's
  `min(BANKED_MARKS_CAP, floor(exp ÷ BANKED_EXP_PER_MARK))` Class Marks from her banked EXP.
- **Parties:** each old party whose five all ascend moves, with its name, into the new world's first fully empty party,
  in order; the rest of the twenty fill the next fully empty parties in roster order; the active party is unchanged.
- **The record:** the run's `ascendedAt = now`; each Uma's `account.history` gains `{ tier: t+1, at: now, run: run.id }`.
  The run's achievements already name it, so her shared achievements need no copy.
- The parser must accept the result as it is (one Uma, one world; history to an ascended run with her on it).

## Do

1. **Selectors** in `rift/state.ts` (above), with tests in `rift/state.test.ts`.
2. **Refactors, no behaviour change:** `partyMembers(world, ids, outfits, tier)` exported from `save/battle.ts` and used by
   `startFight`; `rpgPartyAllies(party, mpOf)` exported from `run.ts` and used by `rpgBeginRunBattle`; `RPG_REFUSED`
   exported from `run.ts`; the rank-filling helper from `payEntrants`; `mergeGains` exported. Every existing battle,
   heroes, ranks and Sweep test passes unchanged.
3. **`save/rift.ts`:** everything in the interface, and the barrel line in `rift/index.ts`.
4. **Tests** (`save/rift.test.ts`; synthetic rosters and outfits only). To win a generated fight quickly in a test, swap
   the open battle's `input.enemies` for one weak `rpgFoe` (the input is data; the parser only needs it to replay), then
   play it with `autoAction` through `actInRiftFight`.
   - **opening and sign-up:** the Rift opens at five Lv 50 Umas, not four; not in Tier 3; sign-up refuses 19, a
     duplicate, a Lv 49, an Uma of another world, and a second open run; cancel works only untouched;
   - **fronts:** only the next stage starts; a party with an Uma off the roster is refused; HP and MP start full (an Uma
     with carried world-map MP still starts full); a loss changes nothing but the open fight and `battles`; a retry
     gets a new battle id and seed and the same foes; a win advances the front, merges traces, and records only boss and
     sub-boss faces with the time of first defeat; stage 12 reports `cleared: 12`;
   - **the Convergence:** refused with a front unsealed, with three parties, with a party that leaves a roster Uma out;
     an attempt freezes the twenty, counts an attempt, and fights in order; a loss or a retreat ends it and the next
     attempt starts at fight 0; four wins set `wonAt`, report `runWon`, and pass `attemptRounds` of four;
   - **the hook:** `achievementsEarned` is called with a `RiftWin` whose `run`, `defeated` and `attemptRounds` already
     include this win (mock the module with `vi.mock('../rift/achievements', …)` returning a fixed grant, in a test
     file of its own), and whatever it returns is stored with `{ at, run }`;
   - **Echoes:** open only with the Rift open; a party with a Lv 49 Uma is refused; a win pays exactly `ECHO_RANK_PAY`
     × the stage rule to class, weapons, armor and accessories, no Uma EXP, Shards, Laurels or Bonds, Marks past the
     caps; Lv 45 pays half of Lv 50's, and Lv 55 the same as Lv 50; the first win records `echoes[front][level]`;
   - **Sweeps:** refused before a win and without tickets; `times: 3` spends three tickets and pays three Echo wins with
     weapons even;
   - **`riftTraces`:** a physical-only fight gives `['physical']`; a Thorns return doesn't add `physical`; a knocked-out
     Uma adds `ko`;
   - **Ascend:** blocked before the win, with an open Rift fight, with an open world-map fight, with an Uma working; on a
     run of twenty with a Hero, a Learner, a target, worn and locker gear, Bonds, Star Gem nodes and banked EXP
     (12,345 → 1,234 Marks; 30,000 → 2,000), every rule above holds: the old world loses them and gains their gear in
     stock; the new world has them at Lv 1 with their class and armor halves, 20,000 Laurels, 100 Speed Tickets and the
     Marks, their parties moved; the history and `ascendedAt` are set; a second Ascend from the same run is refused;
   - **the strict parser accepts everything the rules write:** after sign-up, a won front stage, an open Convergence
     attempt, an Echo win and an Ascend, `parseSave(JSON.parse(JSON.stringify(save)))` equals the save, and so does
     `parseSavePut` in a test beside `apps/api/src/save/local-save.repository.test.ts` (the API path; no API code
     change).
5. **Docs:**
   - **`loops.md`:** a `## The Rift` section: opening, sign-up and the roster, fronts and seals, free retries and full
     HP and MP, the Convergence and its attempts, Echoes and their pay, Sweeps, and Ascend (what moves, resets and
     stays). A live block `rift-rules` rendered in `docs/render.ts` from `RIFT_OPEN_AT`, `RIFT_ROSTER`, `RIFT_STAGES`,
     `ECHO_LEVELS`, `ECHO_RANK_PAY`, `ASCEND_PURSE` and the banked-EXP constants.
   - **`architecture.md`** domain map: `save/rift.ts` (the Rift's run rules and Ascend).
   - **`tiers.md`:** under the banner, "§5 built in H48 (D…)". **`rift.md`:** under §4 and §8, "Built in H48 (D…)".
   - Run `pnpm docs:update`. Log the D-decision (fetch `main` first; the next free number) with its own calls: world
     parties fight Rift fights; one open Rift fight a world, independent of the map's; retreating spends a Convergence
     attempt; untouched runs can be cancelled; Echo pay as above; Sweeps pay as wins; Ascend returns every bound piece,
     resets Craft, keeps her class and armor halves, empties Hero seats as `setHero(null)`, and moves whole parties.
6. **Check it locally** (`.claude/launch.json`: `rpg-api` :8081, `rpg-web` :5174), 390×844, never the iOS Simulator.
   Nothing on screen calls these rules yet, so check the API and the tier screens take an ascended save:
   - copy `apps/api/.data/save.json` aside and stop the API;
   - a scratch script outside the repo, on the domain's CJS build (`pnpm --filter @rpg/domain build`;
     `@rpg/domain/rift` resolves to `dist/cjs/rift/index.js`), raises twenty Tier 1 Umas to Lv 50 with some banked EXP,
     signs them up, sets every front to 12 and `wonAt` by hand (a won run), calls `ascend`, and writes the save with the
     row's `revision` + 1;
   - restart the API (it parses the save; no error in its log), clear the site data, reload: the Tier sheet shows Tier
     2 with 20 Umas; Tier 2's top bar shows 20,000 Laurels and 100 Speed Tickets; its Stable lists the twenty at Lv 1;
     Tier 1's Stable no longer lists them, and their gear is in Tier 1's Warehouse.
   - Put the saved copy back.

## Done when

- [ ] `pnpm lint && pnpm test && pnpm build` pass; the main JS grows only by the three selectors (say the number; 230 KB
  budget).
- [ ] The tests in step 4 pass, and every existing test passes unchanged after the refactors.
- [ ] The local check in step 6 was done and described.
- [ ] `docs/game/` is in step, `pnpm docs:update` leaves no diff, and the D-decision is logged.
- [ ] Deployed green (`gh run watch <id> -R luismlorenzana/uma-rpg --exit-status`), and
  https://uma-rpg.web.app/api/health shows the commit in `build`.

## Deliver

- **Claude:** commit to `main` as `feat(domain): the Rift's run rules and Ascend (H48)`, push, and watch the deploy.
  Nothing on screen changes yet.
- **With H49:** if H49 landed first, add one integration test in `save/rift.test.ts`: sealing Iron through
  `actInRiftFight` earns `t1-seal-iron`. If H48 lands first, H49 adds it.
- **Flag it done:** delete this file, set H48's State to Done in `docs/handoff/README.md`, and add a Done row with the
  commit.
