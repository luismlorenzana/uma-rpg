# H45 — Tier 2 is playable from Lv 1 (H43's Z3 and Z8)

**uma-rpg · Claude · M · Needs: nothing · Unblocks: H48 (Ascend lands twenty Umas in Tier 2)**

## Why

Ascend (H48) moves twenty Umas to Tier 2 at Lv 1 with Training gear, an empty Extra Stats map and Class Rank 1
([tiers](../../design/tiers.md) §5). Today they can't win anything there. [Tier 2's world](../../design/tier2-world.md)
§5 measured it on the balance simulation: **a freshly ascended party wins none of `w6`'s 40 opening stages**, and an
on-curve Tier 2 party loses at every later level, because the foe formulas price a lifetime-100 build that no gear
reaches.

H43 proposed the fix as **Z3** (option A): the foe budget restarts its build curve at the tier's Lv 1, its build part
scaled to her lifetime stats. **Z8** fixes the regions' Laurels: a region's tier comes from its continent. The owner's
calls Q16 are still open, but Ascend needs a playable Tier 2, so the main session decided Z3 and Z8 on the owner's
behalf (H44's umbrella D-row, point 3). Nothing else of Tier 2 is in this build: no leans, faces, shields +1, Z4 term,
MP factor, advanced classes, arts, Halo or Lore.

**Tier 1 must not move by one HP point.** In Tier 1 the tier level equals the lifetime level, so every new factor is 1.
A pinned digest of every Tier 1 foe proves it.

## Context (read first)

- `CLAUDE.md`, `AGENTS.md`. Then [tier2-world.md](../../design/tier2-world.md) §2 (today), **§5 (Z3, the measured
  tables)**, §10 (Z8) and §16; [tiers.md](../../design/tiers.md) §5; Q16 in [open-questions.md](../../open-questions.md).
- The manual: [combat.md](../../game/combat.md) § Foes and its `foe-scaling` live block (rendered by `foeScaling()` in
  `packages/domain/src/docs/render.ts:247–261`).
- **`packages/domain/src/rpg/campaign/enemies.ts`** (lines on `527f33a`):
  - `rpgReferenceStat(L)` (6) stays on lifetime level: her stats do;
  - `RPG_FOE_TUNING` (10–25): `budgetPerLevel` 0.035, `offenseBudgetPerLevel` 0.01, `hitShareStart` 0.2 → `hitShare`
    0.28 at `hitShareFull` 10;
  - `rpgFoeHitShare(level)` (78–82), `rpgFoeBudget(level, rate)` (85–88), `rpgFoeOffense(level, share)` (92–96);
  - `rpgFoe(input)` (99–124): `budget` (109) and `offense` (110) read the lifetime level today.
  - `chapters.ts` imports this file, so don't import `rpgTierLevel` from `chapters.ts` here: compute the tier level
    inline (`((L − 1) % RPG_TIER_MAX_LEVEL) + 1`, `RPG_TIER_MAX_LEVEL` from `../rules`).
- **`packages/domain/src/world/world.ts`:**
  - `WORLD_TUNING.regularHpPerLevel` (76) and `WORLD_BOSS_TWICE_FROM` (79);
  - `regionChapter(region, roster, tier = 1)` (158–180): the default tier is the bug Z8 fixes;
  - `stageWaves` (193–255): `above = level − 1` (206) drives the regular-foe HP step (215); the elite's sub-boss (236)
    and the lone boss (243) act twice from `level >= WORLD_BOSS_TWICE_FROM`, a lifetime level today.
- **`packages/domain/src/master/roster.ts`:** `chapterFor(order).tier` (78–82) is ⌈order ÷ 5⌉. It imports only types,
  so `world.ts` may use it.
- **Callers of `regionChapter`:** `apps/web/src/battle/campaign.tsx:44` (passes `tier`, H35),
  `economy/pacing.sim.ts:80`, `economy/pacing.sim.test.ts:41`, `world/balance.test.ts` (55, 73, 96, 110, 142). The
  capitals (`world/capital.ts`) and Finals use `rpgFoe` through `rpg/campaign/chapters.ts`, so Z3 reaches them too.
- **The simulation:** `world/balance-party.ts` builds `tier: 1` members only (`balanceMember`, 49–82); `world/balance.test.ts`
  (`simulate` 51–62, `regionsAt` 48, the `SIM=1` table 147–163).

## Decisions made

**Z3, exactly as tier2-world §5 option A measured it.** With L her lifetime level and ℓ = the tier level of L:
- **HP and defense budget:** `budget(ℓ, L) = 1 + (rpgFoeBudget(ℓ, 0.035) − 1) × rpgReferenceStat(ℓ) ÷ rpgReferenceStat(L)`.
- **Offense budget:** the same with rate 0.01.
- **Hit share:** `rpgFoeHitShare(ℓ)`, so the 0.20 → 0.28 ramp runs over each tier's first ten levels.
- **Regular-foe HP step:** `1 + 0.035 × (ℓ − 1)`.
- **Acting twice:** an elite's sub-boss and a lone region boss act twice from **tier** Lv 10.
- `rpgReferenceStat` stays on L, and so do every `BattleEnemy.level`, the frozen fight input and the EXP level gap.

The values this must reproduce (tier2-world §5's table, to two decimals):

| | Tier 2 Lv 1 | Lv 10 | Lv 25 | Lv 40 | Lv 50 |
|---|---|---|---|---|---|
| HP and defense budget | 1.00 | 1.02 | 1.18 | 1.56 | 1.96 |
| Offense budget | 1.00 | 1.01 | 1.05 | 1.16 | 1.27 |
| Regular-foe HP step | 1.00 | 1.32 | 1.84 | 2.37 | 2.72 |
| Hit share | 0.20 | 0.28 | 0.28 | 0.28 | 0.28 |

A Tier 2 Lv 1 regular striker from `rpgFoe` alone has **466 HP and DEF 81** (§6's table).

**One helper, used everywhere a foe reads its curve:** `export function rpgFoeCurveLevel(lifetime: number): number`
(the tier level) and `export function rpgFoeTierBudget(lifetime: number, rate: number): number` in `enemies.ts`.
`rpgFoeBudget(level, rate)` keeps its meaning (the curve at a level) for the docs and tests that call it.

**Z8:** `regionChapter(region, roster)` loses its `tier` parameter and takes its tier from the continent's order:
`chapterFor(Number(region.continentId.slice(1))).tier`. A `w6` region pays Tier 2's Laurels (×2) wherever it's built.

**Out of scope:** Tier 2's leans (Z1), faces (Z7), shields +1 (Z2), the Z4 term, the MP factor (Z5), on-screen tier
levels beyond H35's labels (Z6), the Tier 2 Rift's added tests (Z9) and the biome rename (Z10).

## Do

1. **Pin Tier 1 first.** Before changing any code, add `world/tier1-foes.test.ts`: build every region chapter of
   `worldContinent({ name: 'T', order })` for orders 1–5 and every `capitalChapter` with a fixed synthetic cast
   (`world/balance.test.ts`'s cast shape), `JSON.stringify` their nodes, hash them (FNV-1a like `world.ts`'s `hash`),
   and pin the digest. Run it on `main` to get the number, then keep it unchanged through the rest of the packet.
2. **`rpg/campaign/enemies.ts`:** `rpgFoeCurveLevel`, `rpgFoeTierBudget`, and `rpgFoe` reading them (budget, offense
   budget, hit share). Doc comments cite Z3 and the D-number.
3. **`world/world.ts`:**
   - `stageWaves`: `above = rpgTierLevel(level).level − 1` (it may import `rpgTierLevel` from `chapters.ts`, which
     doesn't import `world.ts`), and both "acts twice" checks on the tier level;
   - `regionChapter(region, roster)`: Z8, and its doc comment.
   - Update the `WORLD_TUNING` and `WORLD_BOSS_TWICE_FROM` comments ("tier level").
4. **Callers:** `apps/web/src/battle/campaign.tsx` stops passing `tier`; the sims keep working unchanged.
5. **The simulation:**
   - `balance-party.ts`: `BalanceOptions.tier?: number` (default 1). The member's profile and `BattleAlly` get that
     tier; `level` stays her tier level, so `onCurveGrade`, `onCurveStars`, her slots and her Bond read it as today.
   - `balance.test.ts`: `regionsAt(level, tier)` picks continent `5 × (tier − 1) + ⌈level ÷ 10⌉`, and `simulate` matches
     stages by lifetime level. The `SIM=1` table gains Tier 2 rows: **fresh** (tier 2, Lv 1, `classRank: 1`, no gear, no
     Extra Stats, no Heroes) against every stage at lifetime 51 (that's `w6`'s 40 opening stages: rows 1–5, stages
     1–2), and **on curve** at tier Lv 10, 25, 40 and 50 beside Tier 1's at the same levels.
6. **Tests:**
   - `tier1-foes.test.ts` (step 1) passes with the same digest;
   - `enemies` tests: `rpgFoeTierBudget` equals `rpgFoeBudget` for every L in 1–50 (both rates); the table above to two
     decimals at L 51, 60, 75, 90, 100; `rpgFoeHitShare(rpgFoeCurveLevel(51))` is 0.20; the Tier 2 Lv 1 striker has 466
     HP and DEF 81;
   - `world.test.ts`: a `w6` region's chapter has `tier: 2`, and its first stage's first clear pays twice a `w1`
     region's (`stageLaurels(kind, chapter.tier, true, node.level)`); a `w6` elite at tier Lv 5 doesn't act twice and one
     at tier Lv 10 does;
   - `balance.test.ts` (always on, beside "lets a fresh Lv1 party win the opening pairs"): **a fresh Tier 2 party wins
     `w6`'s Meadow's two opening pairs** on Auto.
7. **Run the table** (`SIM=1 SIM_LEVELS=1,10,25,40,50 npx vitest run src/world/balance.test.ts` in
   `packages/domain`). Expect tier2-world §5's "Measured with option A": the fresh party wins all 40 opening stages
   (about 4.7 rounds), and Tier 2 on-curve rounds within 10% of Tier 1's at the same tier levels. Paste the table in
   the delivery. If a number lands far from §5's, say which and why in the D-row; don't retune anything here.
8. **Docs:**
   - `docs/render.ts` `foeScaling()`: the build budget line names the tier level and the scaling ("restarts at each
     tier's Lv 1; its build part scales by her stats' growth: ×1.96 HP and defense, ×1.27 offense at Tier 2 Lv 50"), and
     "Acting twice: from tier Lv 10". Run `pnpm docs:update`.
   - `combat.md` § Foes: "From tier Lv 10 …" and one sentence on the restart.
   - `tier2-world.md`: a banner line, "Z3 and Z8 built in H45 (D…), decided by the main session for the owner so Ascend
     lands in a playable Tier 2; the other calls wait (Q16)".
   - `open-questions.md` Q16: Z3 and Z8 move out of the open list with "(decided, D…)".
   - Log the D-decision (fetch `main` first; the next free number).
9. **Check it locally** (`.claude/launch.json`: `rpg-api` :8081, `rpg-web` :5174), at 390×844 in a desktop browser,
   never the iOS Simulator:
   - copy `apps/api/.data/save.json` aside and stop the API;
   - with the domain's CJS build (`pnpm --filter @rpg/domain build`) and a scratch script outside the repo, add
     `tierWorlds["2"]` as H35 did (`newTierWorld(now, 0)`) with five outfits Tier 1 doesn't own, fresh (`newOwnedUma`),
     in party 1, and raise the row's `revision` by 1;
   - restart the API, clear the site data, open `/battle/scenario-gate?tier=2`: `w6`'s first region, stage 1, on Auto.
     **It's won.** (Before this packet the same party loses.) Tier 1's world map and a Tier 1 stage play as before.
   - Put the saved copy back.

## Done when

- [ ] `pnpm lint && pnpm test && pnpm build` pass; the main JS stays under 230 KB gzip (say the number).
- [ ] The Tier 1 digest is unchanged, and the tests in step 6 pass.
- [ ] The `SIM=1` table from step 7 is in the delivery, beside tier2-world §5's measured numbers.
- [ ] `docs/game/` is in step, `pnpm docs:update` leaves no diff, Q16 and tier2-world are updated, and the D-decision
  is logged.
- [ ] The local check in step 9 was done and described.
- [ ] Deployed green (`gh run watch <id> -R luismlorenzana/uma-rpg --exit-status`), and
  https://uma-rpg.web.app/api/health shows the commit in `build`.

## Deliver

- **Claude:** commit to `main` as `feat(domain): Tier 2 foes restart their build curve at Lv 1 (H45)`, push, and watch
  the deploy. Tier 1 doesn't change; nothing at the screen's edges.
- **Flag it done:** delete this file, set H45's State to Done in `docs/handoff/README.md`, and add a Done row with the
  commit.
