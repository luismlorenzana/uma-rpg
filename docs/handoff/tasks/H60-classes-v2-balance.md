# H60 — Classes v2 balance: §9's targets, the campaign, the Rift re-measured with v2 parties (dark)

**uma-rpg · Claude · L · Needs: H55, H56, H57 · Unblocks: H61**

## Why

[Classes-v2.md](../../design/classes-v2.md) says "every number is a draft until the simulation sets it" (§9), and the
Rift's balance (H51, D176) was measured with today's five classes and left one miss for classes v2: **Iron's wrong party
still wins Iron's stages** ([rift.md](../../design/rift.md) §11). This packet measures classes v2 with the game's own rules
on engine v15, tunes **class numbers first**, touches `RIFT_TUNING` only where the Rift's §11 targets break, and records
both. All of it is v15-only, so the live game (v14) doesn't move until H61.

## Context (read first)

- `CLAUDE.md`, `AGENTS.md`, classes-v2.md §3.1 (the guard rail), §3.3, §6.3 (the support rule), **§9** (the targets);
  rift.md §5, §6, §8 and **§11** (H51's measured column, "How it was measured", "Iron's wrong party, the one miss");
  **D176** in full (how H51 measured and what it tuned); D168 (the Rift's guidance); the D-rows of H53, H55, H56 and H57.
- **The harness** (lines on `c8d0cea`):
  - `packages/domain/src/world/balance-party.ts`: 20 `BALANCE_PARTY` (one of each of the five), 26–33 `KIT` (armor halves,
    two accessories, Extra Stats picks), 51–85 `balanceMember` (on curve: gear, Extra Stats, an inherited Limit Break
    from the class's first seat), 91–92 `balanceStage` (the live engine version);
  - `world/balance-play.ts` (`play`, `Played`: won, rounds, HP left, lowest, KOs, MP);
  - `world/balance.test.ts` 30–45 `simulate` (every stage at a tier level across a continent), `run` (a region back to
    back); `SIM=1 npx vitest run src/world/balance.test.ts`;
  - `rift/balance.test.ts`: 34–35 `guided` (a front's party from `RIFT_FRONT_SPECS`), 38–41 `withDefaultLoadout`, 43
    `WRONG`, the stage and champion tables, the Convergence, Echoes, the Bestiary, 120–175 `railChips`/`guardRail`
    (each class's own best act and every Limit Break, in chips on one foe), 219–247 the always-on checks;
    `SIM=1 SIM_FRONTS=iron,duel SIM_SEEDS=4 npx vitest run src/rift/balance.test.ts`;
  - `rift/fronts.ts` 11–27 (`RiftFrontSpec.party`, `RIFT_FRONT_SPECS`, today's guidance with a Cleric), 41–100
    `RIFT_TUNING`; `rift/generate.ts` 167–169 `riftBattleInput` (the live engine version).
- **The v15 knobs** (all v15-only, so tuning them never moves a v14 fight):
  - H53, `rpg/rules.ts`: the v2 hands (`arms`/`tome` 0.63/0.27), the v2 leans, the HP formula's Guts term;
    `rpg/battle/caps.ts`: `BATTLE_HEAL_OFFENSE_SCALE` (300);
  - H55, `rpg/battle/skills.ts`: `BATTLE_FAREWELL_FACTOR` (1);
  - H56: `RPG_SUPPORT_SHARE_V15`, `BATTLE_COVER_CAP_V15` (0.6), `BATTLE_REGEN_SHARE` (0.3), the new Limit Breaks' support
    share (0.66), `heroLimitPower(…, 15)`;
  - H57: `charmPerGrade(15)` (Vital 6‰, Siphon 8‰ a grade), the v2 presets.

## Decisions made

- **Measure with explicit v15 inputs, never the switch.** `BalanceOptions` gains `engine` (default live): `balanceMember`
  builds a v2 Uma with it (her v2 spread, leans and HP, the v2 kit, a flat Orb in `might`, no `orbs`, her first seat in
  the v15 table: `paladin-1` is Archangel's Verdict, `cleric-1` Choir of Angels); `balanceStage` and `riftBattleInput`
  take a `version` (default live). Every v14 number H51 printed must print the same with the defaults.
- **The v2 kit** (`KIT` by generation): one Orb and one support, H57's presets (Brawler Greatsword Orb + Vampire
  Talisman; Mage Fire Orb + Siphon Amulet; Spell Blade Greatsword Orb + Vampire Talisman; Summoner Fire Orb + Siphon
  Amulet; Paladin Greatsword Orb + Thorn Talisman; Cleric Light Orb + Spring Amulet). Armor halves by §3's table: Brawler,
  Spell Blade and Paladin physical; Mage, Summoner and Cleric magical. Extra Stats: the Paladin's atk, hp, def, mdef; the
  rest as today. If a measurement changes a class's support, change her preset in the same packet (D164).
- **The Rift's guidance becomes generation-aware** (`RIFT_FRONT_SPECS` live; an explicit `riftParty(front, engine)` for
  the harness): v2 is H53's decision 5 (Iron 2 Brawler, 2 Spell Blade, Paladin; Arcane 2 Mage, 2 Summoner, Cleric; Duel
  2 Brawler, 2 Mage, Paladin; Horde 2 Spell Blade, 2 Summoner, Cleric). Measure the Duel and the Horde with each healer
  and keep the one with the higher champion win rate; record both.
- **What each §9 target means here** (on Auto, first try, on curve unless said):

  | # | Target | Measured as |
  |---|---|---|
  | 1 | Spell Blade 70% physical ± 5 | Her hit cues on foes by channel over whole fights: the world's regular stages at Lv 30 and 50, the balance party |
  | 2 | Summoner 70% magical ± 5 | The same, farewells included |
  | 3 | Paladin vs Cleric, healing + Barrier absorbed per fight, ± 10% | The same party with each healer: HP restored (`heal` cues, Regen and revives included) plus Barrier absorbed (the "Barrier −N" on foe hits), on the world's Lv 50 boss stages and each front's stage 8 and champion |
  | 4 | Spell Blade vs Summoner, damage per turn, ± 5% | Damage per act over whole fights: the four fronts' stages 1–11 and the world's Lv 50 stages |
  | 5 | One healer keeps a party through a front boss, no Uma falling twice | Each guided party's won fights at stages 6, 8 and 12: no Uma with two `ko` cues |
  | 6 | Spell Blade Breaks a sub-boss ≥ 1 round sooner; Brawler ≥ 10% more after the Break | Five of one class against Iron's stage 1–4 captain (weak to an Arm both carry): rounds to the first Break; damage per act from the Break on |
  | 7 | Summoner ≥ Mage over a wave of 3+ foes | Five Summoners vs five Mages on the Horde's waves (4–6 foes): damage per wave |
  | 8 | The campaign within 3 points of v14 (§9 says v13; v14 plays the campaign as v13, H44) | `simulate` at Tier 1 Lv 10, 20, 30, 40, 50 and Tier 2 Lv 10: the balance party on v14 vs v15, the v15 party with a Paladin for the Cleric, and each front's v2 guided party vs its v14 one |
  | 9 | The Rift's §11 targets | H51's tables with the v2 parties: right parties ≥ 80% a stage, 60–70% a champion; wrong parties ≤ 30% a stage, ≤ 10% a champion (**Iron's wrong party is Arcane's v2 party: the recheck**); the Convergence about 50%; Echoes; a run's length |
  | 10 | The guard rail | Every class's own best act (v15 hands, H55's 11 and 11 expected) and every one of the 24 Limit Breaks, in chips on one foe, below the Duel's lowest shield (13) |
  | 11 | No support accessory under 60% of the best | Each of the ten at G10 in every guided member's Support slot in turn, on each front's stage 8 and champion: its win-rate gain over no support, against the best's |

- **Tuning order.** 1) Class numbers (the v15 knobs above), smallest moves first: the hands within ±0.05 of 0.63/0.27,
  then leans, the farewell factor, the heal divisor and shares, Regen, Limit Break shares and powers, support values.
  The Orb table (C4) and the rules' shapes are the owner's: don't change them. 2) `RIFT_TUNING` only where §11 still
  breaks after 1), as a **v15 override** read by the generator through the fight's version (`riftTuning(engine)`), so a
  pre-switch Rift fight keeps today's foes. 3) If the guard rail breaks, the Duel's shields rise in that override (§3.1:
  "the Duel shield rises, not the class's identity"). 4) If the campaign moves more than 3 points, first the healers'
  numbers, then one uniform v2 HP lean factor; **never the world's foes**.
- **When a target can't be met** without breaking another, keep the closest and write why, as H51 did for Iron's wrong
  party; the owner prefers that to an open question.
- **Echo pay** (`ECHO_RANK_PAY` 2) and everything H51 tuned for v14 stay as they are.
- **Iron Will and Arcane Purity** (no magic on Iron, no physical on Arcane): a Spell Blade's and a Summoner's pair always
  deal the other channel in v2, so these titles now need a party without hybrids. Keep them as harder titles; record it.
- **Always-on checks (v15, fixed seeds, fast):** Iron's v2 guided party wins Iron's stage 1; Arcane's v2 party loses Iron's
  champion; the guard rail for all six classes at v15; the Spell Blade's split within ±5 on one fixed fight. H51's v14
  checks stay as they are.
- **Docs:** classes-v2 §9 gains a "Measured (H60, D…)" column; rift.md §11 gains the v2 results beside H51's and a
  paragraph on Iron's wrong party with classes v2; classes-v2 §3.1's guard-rail note gains v15's numbers. The manual is
  unchanged (H61 carries the numbers into it; `pnpm docs:update` leaves no diff now).

## Do

1. **The harness:** `BalanceOptions.engine`, the v2 kit, `balanceStage`'s and `riftBattleInput`'s `version`,
   `riftParty(front, engine)` and the generation-aware `RIFT_FRONT_SPECS`; `riftTuning(engine)` (identity until you need
   an override). Check that every H51 table prints the same numbers with the defaults.
2. **Measure** targets 1–11 (`SIM=1`; add a `SIM_ENGINE=15` switch to the two balance files, or v15 tables beside the v14
   ones). Save the raw tables in your delivery.
3. **Tune** in the order decided; re-measure after each step; stop when every target holds or is explained.
4. **Always-on checks** as decided, in `rift/balance.test.ts` and `world/balance.test.ts` (or a new
   `rift/balance-v15.test.ts`, which keeps H51's file readable).
5. **Docs:** classes-v2 §3.1 and §9, rift.md §11 as decided; log the D-decision (fetch `main` first). `pnpm docs:update`
   leaves no diff.
6. **Check it locally** with the local switch (never committed: `caps.ts` 15, `SAVE_SCHEMA_VERSION` 25, `toV25`
   chained, as H59 describes), on a scratch save of real outfits on curve from the CJS build (as H51 did): the v2 Iron
   party signs up, wins Iron's stage 1 and plays Iron's champion through `startRiftFight`/`actInRiftFight`; a world-map
   stage on Auto at 390×844 in the app. Then undo the switch.

## Done when

- [ ] `pnpm lint && pnpm test && pnpm build` pass (the SIM tables are opt-in); main JS unchanged (the harness is test
  support, the generator lazy). Say the number.
- [ ] Every §9 target and every §11 target is met with v2 parties, or the delivery says which is closest and why; the
  guard rail holds for six classes; the raw tables are in the delivery.
- [ ] H51's v14 numbers print unchanged with the defaults; the v14 replay fixture tests stay green; no v1 number changed.
- [ ] classes-v2 §3.1 and §9 and rift.md §11 carry the measured results; the D-decision is logged; `docs/game/` is
  unchanged and `pnpm docs:update` leaves no diff.
- [ ] The local check in step 6 was done and described, and the switch undone (`git diff` shows none). Nothing from the
  original games in git.
- [ ] Deployed green and https://uma-rpg.web.app/api/health shows the commit.

## Deliver

- **Claude, as a delegated worker:** a pull request from `feat/h60-classes-v2-balance` with one commit,
  `feat(domain): classes v2 balance, measured and tuned on engine v15 (H60)`; the body lists every number changed and the
  measured table. H59 edits the web at the same time; you share no files except, possibly, `hub/places.ts` (don't
  touch it). Fetch `main` before you push. The main session reviews and merges it, then watches the deploy.
- **Flag it done:** after the merge, a `docs(handoff): H60 done (D…)` commit deletes this file, sets H60 to Done with a
  Done row (the measured results in one paragraph, as H51's), and sets H61 to Ready if H59 is done.
