# H51 — The Rift's balance: fronts by composition, the Duel guard rail, the Convergence and Echo pacing

**uma-rpg · Claude · M–L · Needs: H47 (generator), H48 (run rules and Echo pay) · Unblocks: the owner's first run, on tuned numbers**

## Why

H47 built the Rift's fights on starting numbers that mirror the world map. [The Rift](../../design/rift.md) §11 sets
what they must do: the right party wins, the wrong one mostly doesn't, the Convergence is a coin flip, and Echoes raise
a new class quickly. This packet measures all of it with the balance simulation (the game's own rules, the shared Auto
policy, engine v14), tunes `RIFT_TUNING` until the targets hold, checks classes v2's **Duel guard rail** for today's
five classes, and writes the measured numbers into the docs.

It changes numbers in `rift/fronts.ts` only. The ward's ×0.5 (R5), R6's 2× Echo pay and the shape table's structure are
owner calls and stay.

## Context (read first)

- `CLAUDE.md`, `AGENTS.md`. Then [rift.md](../../design/rift.md) §5, §6, §8, **§11**, [classes-v2.md](../../design/classes-v2.md)
  §3.1 (the guard rail: "no single Uma should Break a Duel boss in one act … if one reaches the shield, the Duel shield
  rises, not the class's identity"), [combat-balance.md](../../design/combat-balance.md) §6.0 (how the simulation
  works), and the D-rows of H44, H47 and H48.
- **The simulation today:** `packages/domain/src/world/balance-party.ts` (`balanceMember(classId, i, level, options)`
  with `gear`, `stars`, `heroes`, `classRank`; `onCurveGrade`; ids `${100 + i}`) and `world/balance.test.ts` (`play`
  20–43: Auto until the end, HP left, lowest, knockouts; the `SIM=1` table 147–163; `SIM_LEVELS`).
- **H47:** `RIFT_FRONT_SPECS` (each front's `party` guidance), `RIFT_TUNING`, `riftShape`, `riftChain`,
  `riftConvergence`, `riftFight`, `riftBattleInput`, `riftSeed`, `RiftContext`.
- **H48:** `ECHO_RANK_PAY`, the rank-filling helper behind Echo pay, `riftTraces`.
- **Rank curves** (`economy/ranks.ts`): `classExpToNext(r) = 120 + 16r` (Rank 1 → 30 is 10,440 EXP), `gearExpToNext`,
  `CLASS_EXP_SHARE` 2. A Lv 50 Uma's regular-stage EXP is `rpgBattleExp('fight', …)` (`rpg/campaign/rewards.ts`): about
  325 at Echo Lv 50, half at Lv 45. So R6's 2× pays about 1,300 Class EXP a win: **Rank 30 in about 8 Echo wins, not
  §11's "about 40"** (the weapon side does match tier2-world §12's "Weapon Rank 8 in about 15 Echo wins").
- **The engine's caps:** shields 1–20, eight foes a wave, two extra waves.

## Decisions made

- **What's measured** (`SIM=1`), on-curve Lv 50 parties (`gear`, `stars`, `heroes`), several seeds and three run ids per
  fight so weaknesses and faces vary, first try on Auto:
  1. **Fronts by composition:** each front's guided party (`RIFT_FRONT_SPECS[front].party`) against stages 1–4, 5–8,
     9–11 and the champion: win rate, rounds, HP left, knockouts. The **wrong party** for Iron is Arcane's party
     (all-magic) and for Arcane, Iron's (all-physical); Duel and Horde swap with each other, for the record.
  2. **The Convergence:** the four guided parties through the four fights; an attempt's win rate (all four won).
  3. **The Duel guard rail:** for each class at Lv 50 on curve, the most shield points one act removes: every legal
     Attack, skill, Spell Blade pair and (with a full gauge) Limit Break, against a fresh Duel boss weak to every kind
     (the worst case), with no buffs from others. Breaker charges from a Cleric are another Uma's act and don't count.
  4. **Echo pacing:** Echo wins to raise a fresh class from Rank 1 to 30 at Lv 45 and 50 (the pay rule, no fights); and
     the win rate at each Echo level for a guided party with one member re-specced (`classRank: 1`, same gear).
  5. **The Bestiary:** with a pack-sized synthetic roster (Azur Lane 53 bosses and 52 sub-bosses, NIKKE 50/50,
     PriConne 32/34, keys 40 each), runs until every boss and sub-boss has been defeated, every fight of each run won
     once, each run's `defeated` taken at its start.
  6. **A run's length:** expected fights including retries, from the measured first-try rates.
- **The targets** (rift.md §11 and the guard rail):

  | Target | Value |
  |---|---|
  | Right party, a front stage (each group) | ≥ 80% first try |
  | Right party, a champion | 60–70% |
  | Wrong party on Iron and Arcane | ≤ 30% a stage, ≤ 10% a champion |
  | The Convergence | About 50% an attempt (45–55%) |
  | Duel guard rail | Every class's best act < the Duel's lowest shield |
  | Bestiary | Two or three runs |
  | Echoes (drafts set here) | Lv 45 ≥ 80% with one re-specced member; Lv 50 ≥ 80% and Lv 55 about 50% on curve |

- **What may move:** every number in `RIFT_TUNING` (HP shares, offense, shields, acts, wave counts, `climb`,
  `convergence`, `echo55`, `echoStage`) and which face tier a shape's slots draw (to reach the Bestiary target).
  **What doesn't:** the ward factor, Echo pay (R6), rift.md §5's ranks per stage, and anything outside `rift/`. If the
  guard rail fails, **the Duel's shields rise** (up to 20), never a class.
- **Echo pace:** R6 (2× a stage) is the owner's call and stays. §11's "about 40 wins to Rank 30" was a draft that R6's
  own numbers don't meet; record the measured pace in §11 and the D-row, and flag it in the delivery as the one number
  the owner may want to change (a smaller multiplier, or the stage it's 2× of).
- **Stop rule:** tune until every target holds. If one can't be reached with these knobs, keep the closest, say which and
  why in the D-row and the delivery; don't widen the packet.

## Do

1. **Share the player:** move `play` (and its `Played` type) from `world/balance.test.ts` into `world/balance-play.ts`
   (test support, like `balance-party.ts`), used by both simulations. The world map's table prints exactly as before.
2. **`rift/balance.test.ts`:**
   - helpers: a guided party (`RIFT_FRONT_SPECS[front].party.map((c, i) => balanceMember(c, i, 50, ON_CURVE))`), a
     synthetic pack-sized roster, and a context per run id;
   - the `SIM=1` tables for measurements 1–6 (`SIM_FRONTS=iron,duel` and `SIM_SEEDS=…` narrow them while tuning);
   - **always-on checks** (fast, fixed seeds): Iron's guided party wins Iron's stage 1; Arcane's guided party loses
     Iron's champion; the guard rail holds for all five classes; the Echo pay to Rank 30 is the documented number.
3. **Tune `rift/fronts.ts`'s `RIFT_TUNING`** until the targets hold. Re-run H47's tests (every fight still legal).
4. **Docs:**
   - **`rift.md`** §11: a "Measured (H51)" column beside each target, and the Echo pace with the R6 note; §5: the Duel's
     shields if they rose;
   - **`combat.md`** § The Rift's foes: the `rift-fronts` block regenerates; add one line on the guard rail;
   - **`loops.md`** § The Rift: the Echo pace line ("a fresh class reaches Rank 30 in about N Echo wins");
   - **`classes-v2.md`** §3.1: "Checked for today's five classes in H51 (D…): best act N against shield M"; classes v2
     (engine v15) checks again with its own hands.
   - Run `pnpm docs:update`. Log the D-decision (fetch `main` first; the next free number) with the tuned numbers and the
     measured table.
5. **Check it locally** (`.claude/launch.json`), 390×844, never the iOS Simulator: if H50 is on `main`, sign up a scratch
   roster of on-curve Lv 50 Umas (H50's step 8 script) and play Iron stages 1 and 12 on Auto with Iron's guided party:
   the first wins, the champion is close. If H50 isn't there yet, say so and check the app boots and a world stage plays
   as before.

## Done when

- [ ] `pnpm lint && pnpm test && pnpm build` pass; the main JS is unchanged (say the number).
- [ ] The always-on checks in step 2 pass, and so do H47's and H48's tests.
- [ ] The `SIM=1` tables (before and after tuning) are in the delivery, with every target met or the gap explained.
- [ ] `docs/game/`, `rift.md` and `classes-v2.md` are in step, `pnpm docs:update` leaves no diff, and the D-decision is
  logged.
- [ ] Deployed green (`gh run watch <id> -R luismlorenzana/uma-rpg --exit-status`), and
  https://uma-rpg.web.app/api/health shows the commit in `build`.

## Deliver

- **Claude:** commit to `main` as `feat(domain): tune the Rift's fronts, Convergence and Echoes (H51)`, push, and watch
  the deploy. In the delivery: the measured table, the Duel shields, and the Echo pace for the owner.
- **Flag it done:** delete this file, set H51's State to Done in `docs/handoff/README.md`, and add a Done row with the
  commit.
