# H47 — The Rift generator: fronts, chains, champions, the Convergence, Echoes and faces

**uma-rpg · Claude · L · Needs: H44 (engine v14), H46 (save v24's `RiftFightRef`) · Unblocks: H48 (run rules), H50 (the page), H51 (balance)**

## Why

[The Rift](../../design/rift.md) (D161) is four fronts of twelve stages, a four-fight Convergence and twelve Echoes, all
of them generated, none on the world map. This packet writes the pure generator in `packages/domain/src/rift/`: given a
tier, a run and the enemy roster, it builds any Rift fight as the `BattleEnemy` waves the engine already accepts, with
H44's three foe traits where the front calls for them. Its faces come from all three packs, Azur Lane and NIKKE leading,
preferring faces this account hadn't defeated when the run started.

No rule writes a save here (H48), and nothing shows on screen (H50). The numbers are starting points that H51 tunes to
§11's targets, so they all live in one `RIFT_TUNING` table.

## Context (read first)

- `CLAUDE.md`, `AGENTS.md`. Then [rift.md](../../design/rift.md) §4–§9 and §11, H44's umbrella D-row (party guidance,
  point 2), and [enemy-roster.md](../../design/enemy-roster.md) (the packs and tiers; never write a name or real id in
  code or tests).
- The manual: [combat.md](../../game/combat.md) § Foes, [maps.md](../../game/maps.md) § Faces and § Formations and waves.
- **How the world builds a stage** (`packages/domain/src/world/world.ts`, lines on `527f33a`): `stageWaves` (193–255):
  `foe()` calls `rpgFoe`, then multiplies HP by a share and `tough` (the regular-foe HP step for regulars, 1 for elites,
  `WORLD_TUNING.bossHp` 0.5 for a region boss) and offense by `formationOffense(share)`; ids run `foe1`, `foe2` … across
  every wave; `ELITE_ASSISTANTS` (183), `TWIN_BOSS_HP` 0.55 (185), `WORLD_FORMATIONS` (86–93), `WORLD_ESCORT` (99).
- **`rpg/campaign/enemies.ts`:** `rpgFoe(input)` (99–124): roles, ranks (`sub-boss` ×3.5 and `boss` ×5.5 HP, times
  `reach`), the build budget, `RPG_FOE_TUNING.subBossShield` 6 and `bossShield` 8. H45 makes the budget read the tier
  level; in Tier 1 nothing changes, so this packet doesn't depend on it.
- **`rpg/campaign/chapters.ts`:** `rpgTierLevel` (65), `rpgChapterReach` (119).
- **`world/roster.ts`:** `Franchise`, `EnemyTier` (`regular | key | subboss | boss`), `RosterMember`, `EnemyRoster`,
  `stageFaces` (50–75: sorted by id, hashed by slot, never repeating within a stage, borrowing when a tier is empty).
  The packs: Azur Lane 53 bosses and 52 sub-bosses, NIKKE 50 and 50, PriConne 32 and 34.
- **The engine's limits** (`rpg/battle/engine.ts` `validateInput`, `validEnemy`): 1–8 foes a wave, at most two waves
  after the first, shields 1–20, ids and cast ids matching `^[A-Za-z0-9][A-Za-z0-9:_.-]{0,127}$`, unique unit ids.
- **H44's foe fields:** `ward?: BattleChannel`, `thrice?: boolean`, `mixedLocks?: boolean`; `BATTLE_ENGINE_VERSION`
  is 14.
- **H46's types** in `rift/state.ts`: `RiftFightRef`, `riftRefKey`, `RIFT_FRONTS`, `RIFT_STAGES`, `ECHO_LEVELS`,
  `CONVERGENCE_FIGHTS`, and `account.defeated` (cast id → first defeated).
- **The package's subpaths** (`packages/domain/package.json` `exports`): `./battle`, `./work` … each with a `require`
  (CJS `dist/cjs/…`) and a `default` (TS source) entry. The web lazy-imports them (`apps/web/src/save/game.ts`).

## Decisions made

**Files** (all new): `rift/fronts.ts` (specs, shapes, `RIFT_TUNING`), `rift/picker.ts` (faces), `rift/generate.ts`
(plans and inputs), and `rift/index.ts`, a barrel exporting those three and H46's `achievements.ts`. A new subpath
**`@rpg/domain/rift` → `src/rift/index.ts`** (CJS `dist/cjs/rift/index.js`); H48 adds its run rules to the barrel. Don't
export the generator from `src/index.ts`: the main bundle never loads it.

**The interface** (H48, H50 and H51 call exactly these):

```ts
// rift/fronts.ts
export interface RiftFrontSpec {
  front: RiftFront
  name: 'Iron' | 'Arcane' | 'Duel' | 'Horde'
  /** The channel its foes ward (H44): Iron magical, Arcane physical; null on Duel and Horde. */
  ward: BattleChannel | null
  /** Today's party guidance (H44's D-row, point 2), five classes; retuned with classes v2. */
  party: readonly RpgClass[]
}
export const RIFT_FRONT_SPECS: Readonly<Record<RiftFront, RiftFrontSpec>>
export const RIFT_TUNING: { … }                              // every number below; H51 tunes it
// rift/generate.ts
export interface RiftContext {
  tier: number
  /** The run (front and Convergence fights). Echoes ignore it. */
  runId: string | null
  roster: EnemyRoster
  /** Faces this account had defeated when the run started (`defeatedBefore`). Echoes ignore it. */
  defeated: ReadonlySet<string>
}
export interface RiftFightPlan {
  ref: RiftFightRef
  /** "Stage 5", "Champion", "Convergence · Iron", "Echo · Lv 55". */
  name: string
  /** The level shown, a tier level: 50, or the Echo's 45, 50 or 55. */
  level: number
  /** HP and offense over the same shape at strength 1. */
  strength: number
  enemies: BattleEnemy[]
  waves?: BattleEnemy[][]
}
export function riftFight(ctx: RiftContext, ref: RiftFightRef): RiftFightPlan
export function riftChain(ctx: RiftContext, front: RiftFront): RiftFightPlan[]        // stages 1–12
export function riftConvergence(ctx: RiftContext): RiftFightPlan[]                    // fights 0–3
export function riftStrength(ref: RiftFightRef): number
export function riftBattleInput(plan: RiftFightPlan, allies: readonly BattleAlly[], seed: number): BattleInput
export function riftSeed(battleId: string): number                                    // FNV-1a, as run.ts's seedOf
export function defeatedBefore(defeated: Readonly<Record<string, string>>, at: string): Set<string>  // strictly before
// rift/picker.ts
export const RIFT_FRANCHISE_WEIGHTS: Readonly<Record<Franchise, number>>              // azurlane 40, nikke 37, priconne 23
```

**Levels and strength** (§5):
- Front and Convergence foes stand at the tier's Lv 50: `rpgFoe` at lifetime `50 × (tier − 1) + 50`. The Echoes stand
  at tier Lv 45 and 50 (lifetime `50 × (tier − 1) + 45` or `+ 50`). Lv 55 is past the tier's top, so **the Lv 55 Echo is
  the Lv 50 shape at strength `RIFT_TUNING.echo55` 1.22**: a five-level step on the Tier 1 curve is ×1.23 HP (Lv 45 →
  50), so it reads as Lv 55 without a lifetime level from the next tier.
- **Strength** multiplies HP, ATK and M.ATK (not defense, not shields): front stage n `1 + climb × (n − 1) ÷ 11` (1.00 →
  1.10 at the champion, `climb` 0.1); a Convergence fight `(1 + climb) × (1 + convergence)` = 1.21; Echoes 1, and
  `echo55` at Lv 55.
- Non-regular ranks take `reach: rpgChapterReach(lifetime)` as the world's do. A regular-rank slot's HP also takes the
  regular-foe HP step at the tier level, `1 + WORLD_TUNING.regularHpPerLevel × (ℓ − 1)` (ℓ from `rpgTierLevel`), as
  `stageWaves` does after H45.

**Shapes**, per rift.md §5's table. A slot is `{ face: 'boss' | 'subboss' | 'key'; rank; role; hp; offense; shield;
acts: 1 | 2 | 3; pair?: true }`; `hp` is the share of `rpgFoe`'s own HP (times the step for regulars). Starting values,
mirroring the world's nearest fight:

| Front · stages | Waves | Mirrors |
|---|---|---|
| Iron and Arcane · 1–4 | A sub-boss (`captain`, acts 2, hp 1, shield 6) with two keys (`guard`, hp 0.8, shield 3) | A region elite |
| · 5 and 7 | Two sub-bosses (acts 1, hp 1, shield 6) | — |
| · 6 and 8 | A boss (`champion`, acts 2, hp 0.5, shield 8) with two sub-boss-faced guards (regular, hp 0.8, shield 3) | A region boss's last wave |
| · 9–11 | Three waves: two trios of sub-boss-faced regulars (role by seed, hp 0.3 × 3.6 ÷ 3 each, shield 3), then the boss with two guards | A region boss |
| · 12, the champion | Two bosses (`champion`, acts 1, hp 0.55, shield 8, a `pair` from two packs) | A twin-boss row |
| Duel · 1–11 | One boss (`champion`, acts 2, hp 1, shield 10 at 1–4, 11 at 5–8, 12 at 9–12), `mixedLocks` | — |
| · 12 | The same, acting three times | — |
| Horde · every stage | Three waves of 4 (stages 1–4), 5 (5–8) or 6 (9–12): a leader and the rest keys (role by seed; each wave 3.6 regular foes' HP shared out, the leader 1.5 shares; offense `formationOffense(share)`; shields 3 at stages 1–6 and 4 at 7–12, the leader 6). The leader is a sub-boss, a boss in wave 3 of stages 9–11, and two `pair` bosses in wave 3 of stage 12 | A swarm and a squad |

- **The Convergence's fight i** is front `RIFT_FRONTS[i]`'s stage-12 shape at Convergence strength, with its own faces.
- **An Echo** is its front's stage-8 shape (`RIFT_TUNING.echoStage`) at its level and strength.
- Every count, share, shield and act above is a `RIFT_TUNING` entry; the shape table's structure (which ranks a stage
  holds) is rift.md §5's and stays.

**Weaknesses come from the front, never the face**, seeded by `${tier}:${runId ?? 'echo'}:${riftRefKey(ref)}:${slot}`:
- **Iron:** Arms kinds only, 3 for a key or regular, 2 for a sub-boss, 1 for a boss; a champion pair's two differ.
  `ward: 'magical'`.
- **Arcane:** elements only, 2 for a key, regular or sub-boss, 1 for a boss; a pair's two differ. `ward: 'physical'`.
- **Duel:** 2 Arms kinds and 2 elements at stages 1–6, 1 and 1 at 7–12; `mixedLocks: true`.
- **Horde:** each foe one Arms kind and one element, no two foes of a wave sharing a pair (deal from the 25 pairs).
- Each foe's own `element` (her moves) is a seeded element she isn't weak to; no `element2`.
- Charged moves draw locks from these lists, so they're the front's kinds (§5, Locks).

**Faces: one allocation per run** (`picker.ts`), so a run uses as many different faces as it can:
1. List every slot of the run's 52 fights in a fixed order (fronts in `RIFT_FRONTS` order, stages 1–12, then the
   Convergence 0–3), each with its face tier and `pair` group.
2. For each face tier, rank the roster's members of that tier: those not in `ctx.defeated` first, then by
   `hash(tier:runId:id)`; split by franchise.
3. Give each slot a franchise by smooth weighted round-robin over `RIFT_FRANCHISE_WEIGHTS` (per face tier), and take
   that franchise's first face not yet used in the run. A franchise out of unused faces lends to the next in weight
   order; a tier out of unused faces starts over, never repeating a face within one fight. A tier with no members
   borrows from the nearest one (key → sub-boss → boss).
4. A `pair`'s second boss takes the next franchise in the sequence that differs from the first's.
5. **An Echo** allocates its one fight alone, keyed `echo:<front>:<level>`, with no preference (an empty defeated set):
   Echo faces don't move as the Bestiary fills.
- Memoize the allocation per roster array (a `WeakMap`) and `tier | runId | defeated` key. An empty roster throws a
  `RangeError`: the page waits for the cast before it calls the generator.
- Faces only change presentation and the Bestiary; a retry rebuilds the same foes, weaknesses and faces (§4), and only
  its seed is new (`riftSeed(battleId)`, H48 numbers the battles).

**The input:** `riftBattleInput` returns `{ version: BATTLE_ENGINE_VERSION, seed, allies: [...allies], enemies,
...(waves ? { waves } : {}) }`. Allies come in built (H48 builds them with full MP; H51 with the balance party).

## Do

1. **`rift/fronts.ts`:** `RIFT_FRONT_SPECS`, `RIFT_TUNING` and `riftShape(front, stage): RiftSlot[][]` (exported for
   H51 and the docs). Comments cite rift.md §5 and the D-number.
2. **`rift/picker.ts`:** `RIFT_FRANCHISE_WEIGHTS` and the allocation (`riftRunFaces`, internal or exported for tests).
3. **`rift/generate.ts`:** everything in the interface. Validate `ref` (stage 1–12, fight 0–3, a known Echo level, and a
   `runId` for front and Convergence fights) with `RangeError`s.
4. **`rift/index.ts`** and the **`./rift` subpath** in `packages/domain/package.json`; check the CJS build emits
   `dist/cjs/rift/index.js` and the web resolves `@rpg/domain/rift` (a type-only import in a test is enough).
5. **Tests** (`rift/generate.test.ts`, `rift/picker.test.ts`), with synthetic rosters only (ids like `al-boss-1`):
   - **every fight is legal:** for Tier 1 and Tier 2, all 48 front fights, the 4 Convergence fights and the 12 Echoes
     build an input `createBattle` accepts, with the balance party (`balanceParty(50, { gear: true, stars: true, heroes:
     true })` from `world/balance-party.ts`); `version` is 14;
   - **each front's rules:** Iron foes have only Arms weaknesses (counts as above) and `ward: 'magical'`; Arcane only
     elements and `ward: 'physical'`; Duel one foe, `mixedLocks`, `twice` at 1–11 and `thrice` at 12 and in the
     Convergence's Duel fight, shields 10/11/12 by band; Horde three waves of 4/5/6, distinct pairs within each wave,
     shields 3/4 and leaders 6; every champion pair from two franchises;
   - **levels and strength:** front foes at lifetime 50 in Tier 1 and 100 in Tier 2; Echo Lv 45 at 45 and 95;
     `riftStrength` is 1, 1.1, 1.21 and 1.22 for stage 1, stage 12, a Convergence fight and Echo 55; Iron stages 6 and 8
     (the same shape) differ in HP and ATK by exactly their strengths' ratio, to within rounding;
   - **determinism:** the same context and ref give `toEqual` plans; a reversed roster gives the same plans; another
     run id changes some face or weakness; a ref out of range throws;
   - **faces** (a pack-sized synthetic roster: Azur Lane 53/52, NIKKE 50/50, PriConne 32/34 bosses/sub-bosses, plus 40
     keys each): within one run no boss or sub-boss face repeats while unused ones of its tier remain; boss and sub-boss
     slots split by franchise within ±5 points of 40/37/23; with half the bosses defeated, every undefeated boss is used
     before a defeated one; no face repeats within a fight; an Echo's faces don't depend on `defeated`; an empty roster
     throws;
   - **`defeatedBefore`:** a face defeated at the run's start time is not before it.
6. **Docs:**
   - **`combat.md`:** a `## The Rift's foes` section after § Foes: the fronts (weak to, ward, what each stage holds),
     levels and strength, the Convergence and the Echoes, and how faces are chosen. Its table is a live block,
     `rift-fronts`, rendered in `docs/render.ts` from `RIFT_FRONT_SPECS`, `riftShape` and `RIFT_TUNING` (Front · Weak
     to · Ward · Stages 1–4 · 5–8 · 9–11 · Champion · Party).
   - **`architecture.md`** domain map, `rift/`: "`fronts.ts`, `picker.ts`, `generate.ts`: the Rift's fronts, faces and
     fights (`@rpg/domain/rift`)".
   - **`rift.md`:** under §5, "Built in H47 (D…): shapes and numbers in `rift/fronts.ts`'s `RIFT_TUNING`, tuned in H51";
     under §9, the allocation in one sentence.
   - Run `pnpm docs:update`. Log the D-decision (fetch `main` first; the next free number), with the Lv 55 Echo, the
     per-run allocation and the shape table as its own calls.
7. **Check it locally** (`.claude/launch.json`), 390×844, never the iOS Simulator: nothing on screen uses the generator
   yet, so check the app boots and a world stage plays as before.

## Done when

- [ ] `pnpm lint && pnpm test && pnpm build` pass; the main JS is unchanged (the generator is only in the lazy
  `@rpg/domain/rift` subpath). Say the number.
- [ ] The tests in step 5 pass in well under a few seconds (memoized allocation).
- [ ] `pnpm --filter @rpg/domain build` emits `dist/cjs/rift/index.js`.
- [ ] `docs/game/` is in step, `pnpm docs:update` leaves no diff, and the D-decision is logged.
- [ ] Deployed green (`gh run watch <id> -R luismlorenzana/uma-rpg --exit-status`), and
  https://uma-rpg.web.app/api/health shows the commit in `build`.

## Deliver

- **Claude:** commit to `main` as `feat(domain): the Rift generator, its fronts, faces and fights (H47)`, push, and watch
  the deploy. Nothing on screen changes.
- **Flag it done:** delete this file, set H47's State to Done in `docs/handoff/README.md`, and add a Done row with the
  commit.
