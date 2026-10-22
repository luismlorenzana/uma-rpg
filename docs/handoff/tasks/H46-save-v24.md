# H46 — Save v24: defeated faces, the open Rift fight, and what a run tracks

**uma-rpg · Claude · M · Needs: nothing · Unblocks: H47 (the generator), H48 (run rules), H49 (achievements)**

## Why

Save v23 (H37, D163) gave the Rift its slot: runs, Echo wins, account achievements and tier history. The run rules and
achievements need five things it lacks:
- **the account's defeated faces**, for the Bestiary and for the picker that prefers faces not yet defeated
  ([the Rift](../../design/rift.md) §7, §9);
- **the open Rift fight**, replayed on parse like the world map's, so a Rift fight survives a reload (D52);
- **a fight counter per world**, so every retry draws a fresh seed (§4);
- **the Convergence's open attempt**: the four parties frozen when it starts, and the rounds of each fight won, for
  Swift Convergence (§6, §7);
- **each front's traces in a run**: whether its won fights dealt physical or magical damage or lost an Uma, for Iron
  Will, Arcane Purity and Untouched (§7).

This packet adds them as save v24, empty for every existing save, strictly parsed. It also fixes the achievement
catalog's ids, narrows the parser to them, and ships the achievement hook's contract (a stub) so H48 and H49 can be
built in parallel against it. Nothing writes the new fields yet.

## Context (read first)

- `CLAUDE.md`, `AGENTS.md`. Then [rift.md](../../design/rift.md) §4–§9, [tiers.md](../../design/tiers.md) §3–§5, D161,
  D163 and H44's umbrella D-row (points 4 and 6) in [decisions.md](../../decisions.md).
- The manual: [architecture.md](../../game/architecture.md) § The save (lines 42, 44, 120, 155–184: the schema, the
  migration list and the shape block); `docs/technical/architecture.md` (3, 24, 50, 52).
- **`packages/domain/src/rift/state.ts`** (36 lines): `RIFT_FRONTS`, `RIFT_STAGES`, `RIFT_ROSTER`, `ECHO_LEVELS`,
  `RiftRun`, `RiftState`, `newRiftState`, `riftRunId`. Exported from `src/index.ts`, so it's in the main bundle: keep
  it types and small constants.
- **`packages/domain/src/save/save.ts`** (lines on `527f33a`):
  - `SAVE_SCHEMA_VERSION = 23` (38); `Account` (152–160); `newSave` (232–238);
  - helpers: `object` (strict keys, 256), `count`, `timestamp`, `list` (314), `ids` (447), `OUTFIT_ID` (273),
    `NODE_ID` (641);
  - `ACTION_KEYS` (656–661), `checkReplay` (665–670) and `parseBattle` (672–686): reuse them for the Rift fight;
  - `parseTierWorld` (734–749) calls `parseRift(w.rift, …, tier, umas)` (747);
  - the Rift block (757–833): `RUN_ID`, `before`, `parseRiftRun` (769–796), `parseEchoes` (798–806), `parseRift`
    (810–822);
  - `parseAchievements` (836–850), `checkAccountRefs` (889–905);
  - `parseSave`'s comment (912–914) and `parseSave` (915), `parseSaveAsync` (921–931: every `check` call is queued and replayed after the
    lazy engine import, so the Rift fight gets that for free), `parseSaveChecked` (933–959, the account step 939–943).
- **`packages/domain/src/save/migrations.ts`:** `migrateWorld` (203–214) ends with `toV23` (223–225), a literal that
  overwrites. This file never imports `save.ts`.
- **Fixtures and tests:** `save/rift.fixture.ts` (D163's populated save; it uses the id `rift-conquered`, which the
  catalog renames), `save/save.test.ts`, `save/save-async.test.ts` (the old-version loop 68–103), `work.test.ts:317`
  style pins of the current version, `apps/api/src/save/local-save.repository.test.ts`.
- **The battle caps** `rpg/battle/caps.ts`: `BATTLE_MAX_ROUNDS` is safe to import here (no engine).

## Decisions made

**The shape, in `rift/state.ts`:**

```ts
/** The tiers whose Rift can run (T9: Tier 3's waits for its fifth scenario). */
export const RIFT_TIERS = [1, 2] as const
/** What a front's won fights showed in a run: damage of a channel dealt by the party, an Uma knocked out. */
export const RIFT_TRACES = ['physical', 'magical', 'ko'] as const
export type RiftTrace = (typeof RIFT_TRACES)[number]
/** The Convergence's fights, one per front in `RIFT_FRONTS` order (§6). */
export const CONVERGENCE_FIGHTS = 4

/** An attempt at the Convergence: four parties frozen at its start, and the rounds of each fight won so far. */
export interface RiftAttempt { parties: string[][]; rounds: number[] }
export interface RiftRun {
  id: string; roster: string[]; startedAt: string; fronts: Record<RiftFront, number>
  convergence: { attempts: number; open: RiftAttempt | null }
  /** By front, what its won fights in this run showed, in `RIFT_TRACES` order; absent: nothing yet. */
  traces: Partial<Record<RiftFront, RiftTrace[]>>
  wonAt: string | null; ascendedAt: string | null
}
/** Which Rift fight: a front's stage (1–12), a Convergence fight (0–3), or an Echo. */
export type RiftFightRef =
  | { kind: 'front'; front: RiftFront; stage: number }
  | { kind: 'convergence'; fight: number }
  | { kind: 'echo'; front: RiftFront; level: EchoLevel }
/** The open Rift fight, replayed from its input and actions (D52). */
export interface RiftBattle { battleId: string; ref: RiftFightRef; startedAt: string; input: BattleInput; actions: BattleAction[] }
export interface RiftState {
  runs: RiftRun[]
  echoes: Partial<Record<RiftFront, Partial<Record<EchoLevel, string>>>>
  /** One open Rift fight a world at most. */
  battle: RiftBattle | null
  /** Rift fights started in this world; the next fight's id and seed come from it. */
  battles: number
}
export const newRiftState = (): RiftState => ({ runs: [], echoes: {}, battle: null, battles: 0 })
/** `rift:t<tier>:<n>`, n counting this world's Rift fights from 1. */
export const riftBattleId = (tier: number, n: number): string => `rift:t${tier}:${n}`
/** A fight's stable key, for seeds and screens: `iron:5`, `convergence:2`, `echo:iron:55`. */
export function riftRefKey(ref: RiftFightRef): string

/** The achievement catalog's ids (D161 §7). The four seals and "Rift conquered" carry their tier (a run's seals belong
 * to it, R9; tier2-world §12); the titles are earned once per account, in any tier. */
export const RIFT_TITLES = ['iron-will', 'arcane-purity', 'untouched-iron', 'untouched-arcane', 'untouched-duel',
  'untouched-horde', 'swift-convergence', 'bestiary', 'crossover'] as const
export const sealId = (tier: number, front: RiftFront): string => `t${tier}-seal-${front}`
export const conqueredId = (tier: number): string => `t${tier}-rift-conquered`
export const ACHIEVEMENT_IDS: readonly string[] =
  [...RIFT_TIERS.flatMap((t) => [...RIFT_FRONTS.map((f) => sealId(t, f)), conqueredId(t)]), ...RIFT_TITLES]
export type AchievementId = string
export const isAchievementId = (id: string): boolean => ACHIEVEMENT_IDS.includes(id)
```

`BattleInput` and `BattleAction` are type-only imports from `../rpg/battle/types`.

**The account** gains `defeated: Record<string, string>`: a cast id (an enemy unit's stable id from the private roster)
→ when this account first defeated her. **Only Rift fights count** (fronts, the Convergence and Echoes), and only faces
of the roster's `boss` and `subboss` tiers (H48 records them):
- the picker prefers faces "this account hasn't defeated yet" so the Bestiary "fills over two or three runs" (§9). The
  world map already shows most bosses and sub-bosses in Tier 1, so counting campaign fights would leave the Rift's
  preference with nothing to do and fill the Bestiary before the first run;
- the Bestiary is a Rift title, "counted across every run and tier" (§7), and the save stays small (at most 271 faces).
- The time lets a run read the faces defeated **before it started** (`at < run.startedAt`), so its stage chains don't
  shift under it as it's played (H47).

**The achievement hook** (`rift/achievements.ts`, new): H46 ships the contract with a stub; H48 calls it when it
settles a won fight; H49 writes its body and the catalog's words. Keep the names exactly:

```ts
import type { BattleState } from '../rpg/battle/types'
import type { EnemyRoster } from '../world/roster'
import type { AchievementId, RiftFightRef, RiftRun } from './state'

/** A won Rift fight once the run rules have recorded it (H48's `settleRiftFight`). */
export interface RiftWin {
  tier: number
  ref: RiftFightRef
  /** The run after this win (front and Convergence fights); null for an Echo. */
  run: RiftRun | null
  /** A Convergence fight: the attempt's rounds including this one (the attempt closes on its last win); else null. */
  attemptRounds: number[] | null
  /** The finished fight: the party is `state.input.allies`, the rounds `state.round`. */
  state: BattleState
  /** The account's defeated faces after this win. */
  defeated: Readonly<Record<string, string>>
  roster: EnemyRoster
}
/** An achievement a win earns, with the run it came from (null for the Bestiary). */
export interface AchievementGrant { id: AchievementId; run: string | null }
/** What this win earns that `held` (the account's achievements) lacks, in `ACHIEVEMENT_IDS` order. */
export function achievementsEarned(win: RiftWin, held: Readonly<Record<string, unknown>>): AchievementGrant[] {
  return [] // H49
}
```

**Strict parsing** (unknown keys refused everywhere; each failure names its path):
- **`account`**: exactly `trainerName`, `createdAt`, `updatedAt`, `achievements`, `history` and `defeated`.
- **`defeated`**: at most 2,000 entries; keys match the engine's id shape `^[A-Za-z0-9][A-Za-z0-9:_.-]{0,127}$`;
  values ISO timestamps.
- **`achievements`**: as v23, and each id must be in `ACHIEVEMENT_IDS`.
- **A run**: v23's keys plus `traces`. `convergence` is exactly `{ attempts, open }`:
  - `open` is null or exactly `{ parties, rounds }`: `parties` is 4 lists of 5 outfit ids, all 20 distinct and exactly
    the run's roster; `rounds` has 0–3 entries, each 1–`BATTLE_MAX_ROUNDS`;
  - an open attempt needs every front at 12, `attempts ≥ 1` and `wonAt` null.
- **`traces`**: keys are fronts; each a list of distinct traces in `RIFT_TRACES` order; a front with traces has at least
  one stage cleared.
- **`rift`**: exactly `{ runs, echoes, battle, battles }`; `battles` a count.
- **`rift.battle`**: null, or exactly `{ battleId, ref, startedAt, input, actions }`:
  - `battleId` is `rift:t<this tier>:<n>` with 1 ≤ n ≤ `battles`;
  - `ref` is exactly one of the three shapes: `{ kind, front, stage }` (stage 1–12), `{ kind, fight }` (0–3) or
    `{ kind, front, level }` (an `ECHO_LEVELS` key);
  - `actions` as `parseBattle` checks them, and the fight must replay cleanly (the same `check`);
  - **cross-checks:** every ally is owned in this world. A front fight needs an open run (the last, `wonAt` null) with
    `fronts[front] === stage − 1` and every ally on its roster. A Convergence fight needs that run's open attempt with
    `rounds.length === fight` and its allies exactly `parties[fight]`.

**Migration v23 → v24** (every older save):
- **the account:** `defeated: {}`, inline in `parseSaveChecked` beside v23's step (for version < 23 the step adds all
  three);
- **each world:** `toV24` in `migrations.ts`, a literal that overwrites: `rift` gains `battle: null` and `battles: 0`,
  and each run gains `traces: {}` and `convergence: { attempts: <its attempts>, open: null }`. Anything malformed is
  left for the strict parse. Saves before v10 get the full shape from `newTierWorld`.
- **The fixture** (`save/rift.fixture.ts`) moves to v24's shape and the catalog's ids (`rift-conquered` →
  `t1-rift-conquered`). No stored save holds an achievement, so narrowing the ids needs no migration.

**The API:** no code change. A v23 row upgrades on its next sync, and the first v24 write keeps
`saveBackups/{uid}-v23` (the Firestore repository does this for every bump).

## Do

1. **`rift/state.ts`:** the block above (and `riftRefKey`). **`rift/achievements.ts`:** the contract and the stub.
   Don't export `achievements.ts` from `src/index.ts` (H47 adds the `@rpg/domain/rift` subpath that exports it).
2. **`save/save.ts`:** `SAVE_SCHEMA_VERSION = 24`; `Account.defeated` and `newSave`; `parseDefeated`; the catalog check
   in `parseAchievements`; `traces` and the attempt in `parseRiftRun`; `parseRiftBattle` (sharing `parseBattle`'s
   action checks and `check`) and the cross-checks in `parseRift`, which now takes `check`; the account step for
   version < 24; the header and `parseSave` comments (v1–v24, returns v24).
3. **`save/migrations.ts`:** `toV24`, chained last in `migrateWorld`, with a comment like `toV23`'s.
4. **Fix what pins v23:** the fixture; `save-async.test.ts`'s loop deletes `account.defeated`, `rift.battle`,
   `rift.battles` and each run's `traces` and `convergence.open` for version < 24; any `toBe(23)` outside v23
   fixtures becomes `SAVE_SCHEMA_VERSION`.
5. **Tests:**
   - **`save.test.ts`:**
     - `newSave` has `defeated: {}`, `battle: null`, `battles: 0`, and round-trips;
     - **a populated v24 save round-trips** through `parseSave` and JSON: the fixture's open run `t1-r2` with
       `traces: { iron: ['physical'], arcane: ['magical', 'ko'] }`; an open front fight `{ kind: 'front', front: 'arcane',
       stage: 4 }` whose five allies are on the roster (build them with `balanceMember` from `world/balance-party.ts`:
       ids `101`–`105` match `TIER1_ROSTER`) against an `rpgFoe` foe, with two legal actions; `battles: 3`;
       `defeated: { 'boss-a': …, 'subboss-b': … }`;
     - **a Convergence case:** a run with every front at 12, `attempts: 1`, an open attempt of the twenty in four parties
       with `rounds: [6]`, and an open `{ kind: 'convergence', fight: 1 }` fight with `parties[1]` as its allies;
     - **each refusal, one case per rule above:** e.g. an unknown key in the account or `rift`; a `defeated` key with a
       space or a value that isn't a time; `seal-fire` and `rift-conquered` as achievement ids; `traces` with `fire`,
       a duplicate, or on a front with 0 cleared; an attempt of three parties, of 19 Umas, with an Uma off the roster,
       on a run with a front at 11, or on a won run; `rounds` of four entries or a 0; a battle id `rift:t2:1` in Tier 1
       or `rift:t1:4` when `battles` is 3; a front fight for stage 3 when 3 are cleared; a Convergence fight 2 when one
       round is recorded, or with other allies; an Echo at level `60`; an ally not owned; an action the engine refuses.
   - **The migration:** a v23 save as stored (D163's shape) parses as v24 with the empty fields and round-trips; a v24
     save missing `rift.battle`, a run's `traces` or `account.defeated` is refused.
   - **`save-async.test.ts`:** the populated v24 fixture gives the same result from `parseSaveAsync` as `parseSave`,
     with the open Rift fight replayed after the lazy engine import.
   - **`apps/api/src/save/local-save.repository.test.ts`:** a raw v23 row loads as v24 with the empty fields.
6. **Docs:**
   - **`docs/game/architecture.md`:** the domain map (`save/` schema v24; `rift/`: "`state.ts`: the Rift's save shape,
     constants and achievement ids; `achievements.ts`: the achievement hook"), § Web app "save v24", "Schema v24", a
     **v24** bullet ("the account's defeated Rift faces, each world's open Rift fight and fight count, and each run's
     traces and open Convergence attempt, all empty (D…)"), and the shape block:
     - `account { …, defeated { <castId>: at } }`;
     - `rift { runs [RiftRun], echoes { … }, battle | null, battles }`;
     - `RiftRun { …, convergence { attempts, open: { parties[4][5], rounds[] } | null }, traces { <front>: [trace] } }`;
     - `RiftBattle { battleId, ref, startedAt, input, actions }`.
   - **`docs/technical/architecture.md`:** v24 in the status line, the schema block, the migration table (a v24 row) and
     "accepts v1–v24 and returns v24".
   - **`rift.md`** §8: "v24 (H46) adds the open Rift fight, the fight count, each run's traces and open attempt, and the
     account's defeated faces."
   - Run `pnpm docs:update`. Log the D-decision (fetch `main` first; the next free number).
7. **Check it locally** (`.claude/launch.json`: `rpg-api` :8081, `rpg-web` :5174), 390×844 in a desktop browser, never
   the iOS Simulator. With the local save as it is (v23): the app boots; Town Hall (`?canvas`), the Stable, the world
   map and the Account are unchanged; after a sync `apps/api/.data/save.json` stores `"schemaVersion": 24`,
   `"defeated": {}` and `"rift": { "runs": [], "echoes": {}, "battle": null, "battles": 0 }` in Tier 1.

## Done when

- [ ] `pnpm lint && pnpm test && pnpm build` pass. The parser is in the main bundle: say the main JS number (230 KB
  budget, about 224 KB now; this should add well under 1 KB).
- [ ] The tests in step 5 pass, including every refusal and the v23 migration.
- [ ] No test pins 23 as the current schema.
- [ ] The local check in step 7 was done and described.
- [ ] The manual, the technical page and `rift.md` are in step, `pnpm docs:update` leaves no diff, and the D-decision is
  logged.
- [ ] Deployed green (`gh run watch <id> -R luismlorenzana/uma-rpg --exit-status`), and
  https://uma-rpg.web.app/api/health shows the commit in `build`.

## Deliver

- **Claude:** commit to `main` as `feat(domain): save v24, the Rift's open fight, traces and defeated faces (H46)`, push,
  and watch the deploy. Say that the owner's save upgrades on its next sync and `saveBackups/{uid}-v23` is kept.
- **Flag it done:** delete this file, set H46's State to Done in `docs/handoff/README.md`, and add a Done row with the
  commit.
