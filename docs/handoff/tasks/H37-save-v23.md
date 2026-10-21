# H37 — Save v23: achievements, tier history and the Rift's slot

**uma-rpg · Claude · S · Needs: nothing · Unblocks: the Rift's run rules, achievements**

## Why

The Rift (D161) and promotion (D159) need three places in the save that don't exist yet:
- **`account.achievements`**, shared by every tier: an id, the date it was earned, and the run it came from;
- **`account.history`**: each Uma's climb, one `{ tier, at, run }` entry per promotion;
- **each tier world's `rift`**: its runs and its Echo wins.

This packet adds them as save v23, empty for every existing save ([tiers](../../design/tiers.md) §4 "The save",
[the Rift](../../design/rift.md) §8). Nothing reads them yet beyond parsing. The run rules, the Rift page and the
achievements list come in later packets.

[Classes v2](../../design/classes-v2.md) §8 already plans its save step as v24, after this one.

## Context (read first)

- `CLAUDE.md`, `AGENTS.md`. Then [tiers.md](../../design/tiers.md) §3–§5 and [rift.md](../../design/rift.md) §4–§8 and
  §12, with D159 and D161 in [decisions.md](../../decisions.md).
- The manual: [architecture.md](../../game/architecture.md) § The save (the schema, the migration list, the shape block)
  and § API (storage, backups).
- **`packages/domain/src/save/save.ts`** (lines on `edbc8e0`):
  - its header comment (1–11) and `SAVE_SCHEMA_VERSION = 22` (38);
  - `TierWorld` (117–141), `Account` (143–148), `newTierWorld` (208–210) and `newSave` (212–218);
  - the private parse helpers: `object` (strict keys), `count`, `timestamp`, `list` and `ids`, and `OUTFIT_ID` (252);
  - `resetTierWorld` (696–711). Saves before v10 build their world with `newTierWorld`, so they gain the new field
    with no extra step;
  - `parseTierWorld` (713–727): its key list at 717;
  - `parseSave`'s doc comment (741–743);
  - `parseSaveAsync` (750–760). It lazy-loads `migrations.ts` when `10 ≤ version < SAVE_SCHEMA_VERSION`, so a v22 save
    loads it once;
  - `parseSaveChecked` (762–781): the account is parsed at 768–771 with three keys.
- **`packages/domain/src/save/migrations.ts`:**
  - `migrateWorld` (203–213) chains the world steps and ends at `toV22` (224);
  - each step overwrites what it adds, as in `toV19`'s `heroes: {}` and `toV22`'s `buildings`/`work`. Tests rely on
    that: they relabel a current save as an older version.
  - `migrations.ts` doesn't import `save.ts`, which imports it. Keep it that way.
- **The tests that build older saves:**
  - `save-async.test.ts` 67–103: one save per version from 1 to 21, built from a current save by deleting what each
    version lacked;
  - `work.test.ts` 283–318: the v21 fixture. Line 317 asserts `toBe(22)`;
  - saves relabelled from current ones in `heroes.test.ts:135` (v18), `ranks.test.ts:92` (v17),
    `battle.test.ts:233` (v13), `forge.test.ts:239` (v19), `observatory.test.ts:136` (v20) and `work.test.ts:194,350`;
  - `rules.test.ts:93` and `battle.test.ts:254` (v1 and v2 literals), and `apps/web/src/save/game.test.ts:113–126` (a
    v1 device save at boot).
- **The API path** (`apps/api/src/save/`):
  - the repositories parse every stored save on load with `parseSave` (`local-save.repository.ts:39,47`,
    `firestore-save.repository.ts:17`);
  - a PUT goes through `parseSavePut` (`save.controller.ts:20`, 400 on a `SaveParseError`);
  - the first v23 write backs the stored v22 save up to `saveBackups/{uid}-v22` (`firestore-save.repository.ts:31–34`);
  - an older client's write gets a 409 (D45). The PWA's "Update ready" prompt covers it, as at every bump;
  - `local-save.repository.test.ts` uses `SAVE_SCHEMA_VERSION`;
  - the push tick loads through the same repository, so it migrates on read. **No API code changes.**
- **Docs that name the schema:**
  - `docs/game/architecture.md` lines 42, 102, 134, 136–152 and the shape block (154–167);
  - `docs/technical/architecture.md`: its status line (3) and "Schema v21" block (24–48) are still at v21.

## Decisions made

**The shape.** Types and constants for the Rift live in a new `packages/domain/src/rift/state.ts`, where the Rift's
generator will follow (rift.md §10). Export it from `src/index.ts`.

```ts
export const RIFT_FRONTS = ['iron', 'arcane', 'duel', 'horde'] as const
export type RiftFront = (typeof RIFT_FRONTS)[number]
export const RIFT_STAGES = 12            // a front's stages; clearing 12 seals it
export const RIFT_ROSTER = 20            // Umas a run signs up
export const ECHO_LEVELS = ['45', '50', '55'] as const   // the Echoes' three difficulties, as save keys
export type EchoLevel = (typeof ECHO_LEVELS)[number]

export interface RiftRun {
  id: string                             // `t<tier>-r<n>`: n is its place in this world's runs, from 1
  roster: string[]                       // 20 outfit ids
  startedAt: string
  fronts: Record<RiftFront, number>      // stages cleared, 0–12
  convergence: { attempts: number }
  wonAt: string | null
  ascendedAt: string | null
}
export interface RiftState { runs: RiftRun[]; echoes: Partial<Record<RiftFront, Partial<Record<EchoLevel, string>>>> }
export const newRiftState = (): RiftState => ({ runs: [], echoes: {} })
export const riftRunId = (tier: number, n: number): string => `t${tier}-r${n}`
```

In `save.ts`:
- `TierWorld` gains `rift: RiftState`. `newTierWorld` sets `newRiftState()`.
- `Account` gains:
  - `achievements: Record<string, Achievement>`, with `Achievement { at: string; run: string | null }`;
  - `history: Record<string, TierHistoryEntry[]>`, by outfit id, with
    `TierHistoryEntry { tier: number; at: string; run: string }`.
- `newSave` sets both to `{}`.

**Null, not optional.**
- rift.md §8 sketches `wonAt?` and `ascendedAt?`. The save uses `null` instead, as `run.clearedAt` does.
- Firestore refuses `undefined` values, and a key that is always present parses strictly.
- An achievement's `run` is `null` when it came from no single run, such as the Bestiary.
- `echoes` stores the first win's time; an Echo never won is absent.

**Ids.**
- Achievement ids are kebab-case, `^[a-z0-9]+(-[a-z0-9]+)*$`, 1–48 characters.
- There's no catalog yet. The achievements packet adds one and narrows the parser to its ids. Nothing writes an id
  before then.
- Run ids carry their tier, so the account can point at a run in any world.

**Strict parsing.** Unknown keys are refused everywhere, as today. Each failure names its path.
- **`account`**: exactly `trainerName`, `createdAt`, `updatedAt`, `achievements` and `history`.
- **`achievements`**:
  - at most 200;
  - each id matches the pattern;
  - each value is exactly `{ at, run }`: `at` an ISO timestamp, and `run` null or the id of a run that exists.
- **`history`**:
  - keys match `OUTFIT_ID`;
  - each list has 1–10 entries;
  - each entry is exactly `{ tier, at, run }`:
    - `tier` is an integer ≥ 2, strictly increasing along the list;
    - `at` is an ISO timestamp, never decreasing;
    - `run` names a run of tier `tier − 1` that exists, has `ascendedAt` set, and has her in its roster;
  - her last entry's tier is the world she lives in now.
- **`rift`**: exactly `{ runs, echoes }`.
- **`runs`**:
  - at most 1,000;
  - run i (from 0) has the id `t<this tier>-r<i + 1>`;
  - keys exactly `id`, `roster`, `startedAt`, `fronts`, `convergence`, `wonAt` and `ascendedAt`;
  - `roster` is exactly 20 distinct outfit ids;
  - `fronts` is exactly the four fronts, each 0–12;
  - `convergence` is exactly `{ attempts }`, a non-negative integer;
  - `wonAt` is null or a timestamp, and needs every front at 12, `attempts ≥ 1` and `wonAt ≥ startedAt`;
  - `ascendedAt` is null or a timestamp, and needs `wonAt`, with `ascendedAt ≥ wonAt`.
- **Run invariants:**
  - **only the last run may be open** (`ascendedAt` null): a tier runs one Rift at a time, and a won run waits for
    Ascend (R7, R9);
  - **an open run's roster is owned in this world.** An ascended run's roster isn't, because they moved up.
- **`echoes`**: keys are fronts, inner keys are Echo levels, and values are ISO timestamps.

The cross-references (achievement runs and history) are checked after every world is parsed, in `parseSaveChecked`.

**Migration v22 → v23** (every save before v23):
- **the account:** `{ ...raw, achievements: {}, history: {} }` before the strict parse, inline in `parseSaveChecked`.
  The account has no migration chain, so `migrations.ts` stays world-only;
- **each world:** `toV23` in `migrations.ts` returns `{ ...world, rift: { runs: [], echoes: {} } }`. It's written as a
  literal, because migration steps are frozen history and must not import `save.ts`. `migrateWorld` chains it last.
- Overwriting, not merging, keeps the relabelled-save tests valid.
- Saves before v10 get the empty `rift` from `newTierWorld`.

**Out of scope:**
- any rule that writes these fields;
- any screen;
- the achievement catalog;
- the API, beyond a test.

## Do

1. **`packages/domain/src/rift/state.ts`** (new), with the block above. Export it from `src/index.ts`.
2. **`save/save.ts`:**
   - `SAVE_SCHEMA_VERSION = 23`;
   - the types, `newTierWorld`, `newSave`;
   - the parsers: `parseAchievements`, `parseHistory`, `parseRift` and the run checks;
   - the account step for version < 23, and the cross-checks after the worlds;
   - `rift` in `parseTierWorld`'s key list;
   - the header and doc comments (v1–v23, returns v23).
3. **`save/migrations.ts`:** `toV23`, chained last in `migrateWorld`.
4. **Fix the tests that pin v22:**
   - `work.test.ts:317` becomes `toBe(SAVE_SCHEMA_VERSION)`;
   - in `save-async.test.ts`'s loop, for `version < 23`, delete `w.rift`, `account.achievements` and
     `account.history`, so each old save looks as it was stored.
5. **New tests:**
   - **`save.test.ts`:**
     - `newSave` has empty achievements, history and Rift, and round-trips.
     - **A populated fixture round-trips** through `parseSave` and JSON:
       - Tier 1 holds run `t1-r1`, won and ascended. Its twenty Umas live in a Tier 2 world;
       - Tier 1 also holds run `t1-r2`, open, with twenty Tier 1 Umas and fronts `{ iron: 12, arcane: 3, duel: 0,
         horde: 0 }`;
       - Tier 1's `echoes` is `{ iron: { '50': … } }`;
       - the achievements are `rift-conquered` with run `t1-r1`, and `bestiary` with run `null`;
       - each of the twenty has the history `[{ tier: 2, at, run: 't1-r1' }]`.
     - **Each refusal,** one case per rule above. For example:
       - an unknown key in the account, `rift`, a run or `convergence`;
       - a run id out of place; 19 or duplicate roster ids; a front at 13;
       - `wonAt` with a front below 12; `ascendedAt` without `wonAt`;
       - two open runs; an open run's Uma not owned;
       - an Echo front `fire` or level `60`;
       - an achievement id `Rift Conquered`, or one whose run doesn't exist;
       - a history entry at tier 1, one naming an open run, or one whose run lacks her; her last tier not where she
         lives.
   - **The migration:**
     - a v22 save as stored (no `rift`, a three-key account) parses as v23 with all three empty and round-trips;
     - a v23 save missing `rift`, or an account missing `history`, is refused.
   - **`save-async.test.ts`:** the populated fixture gives the same result from `parseSaveAsync` as from `parseSave`.
   - **`apps/api/src/save/local-save.repository.test.ts`:** a raw v22 row written to the file loads as v23, with the
     empty fields.
6. **Docs:**
   - **`docs/game/architecture.md`:**
     - the domain map: `save/` is schema v23, and a `rift/` row says "`state.ts`: the Rift's save shape and constants;
       its rules come with the Rift";
     - § Web app: "save v22" becomes "save v23";
     - § The save: "Schema v23", and a **v23** bullet: "account achievements and each Uma's tier history, and each
       world's Rift state, all empty (D…)";
     - the shape block:
       - `account { trainerName, createdAt, updatedAt, achievements { <id>: { at, run | null } }, history { <outfitId>: [{ tier, at, run }] } }`;
       - `TierWorld { …, rift { runs [RiftRun], echoes { <front>: { <level>: at } } } }`;
       - `RiftRun { id, roster[20], startedAt, fronts { iron, arcane, duel, horde }, convergence { attempts }, wonAt | null, ascendedAt | null }`.
   - **`docs/technical/architecture.md`:**
     - the status line and "Schema v21" become v23;
     - the migration table gains the v22 row (SC3, D152) and the v23 row;
     - "accepts v1–v21 and returns v21" becomes v23.
   - **`docs/design/rift.md`** §8: one line under the block: "Built in v23 (H37) with `null` for unset times and run
     ids `t<tier>-r<n>`."
   - Run `pnpm docs:update`.
   - Log the D-decision: fetch `main` first and take the next free number (D162, or D163 if H35 landed first).
7. **Check it locally** (`.claude/launch.json`: `rpg-api` on :8081 and `rpg-web` on :5174), at 390×844 in a desktop
   browser. Never the iOS Simulator.
   - Use the local save as it is (v22).
   - The app boots, and Town Hall (`?canvas`), the Stable, the world map and the Account are unchanged.
   - After a sync, `apps/api/.data/save.json` stores `"schemaVersion": 23`, an account with `"achievements": {}` and
     `"history": {}`, and `"rift": { "runs": [], "echoes": {} }` in Tier 1.

## Done when

- [ ] `pnpm lint && pnpm test && pnpm build` pass. The build prints the main JS under 230 KB gzip (D56).
- [ ] The new tests in step 5 pass: the populated fixture, every refusal, the v22 migration, the async match and the
  API's v22 row.
- [ ] No test pins `22` as the current schema: grep `toBe(22)` and `schemaVersion: 22`, outside v22 fixtures.
- [ ] The local check in step 7 was done and described.
- [ ] The manual, the technical page and `rift.md` are in step. `pnpm docs:update` leaves no diff, and the D-decision is
  logged.
- [ ] Deployed green (`gh run watch <id> -R luismlorenzana/uma-rpg --exit-status`), and
  https://uma-rpg.web.app/api/health shows the commit in `build`.

## Deliver

- **Claude:** commit to `main` as `feat(domain): save v23 with achievements, tier history and the Rift's slot (H37)`.
  Push, and watch the deploy.
  - In the delivery, say that the owner's save upgrades on its next sync, and that a `saveBackups/{uid}-v22` copy is
    kept.
- **Flag it done:**
  - delete this file;
  - add a Done row to `docs/handoff/README.md` with the commit.
