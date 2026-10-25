# H81 — R2's balance (dark): the full Tier 1 re-baseline, accessories, MP, defense, matched templates, Tier 2 and 3 worlds × tier, the profession pacing simulation

**uma-rpg · Claude · L · Needs: R1's H71, H75, H76, H77 · Unblocks: H82**

## Why

The docs say every number is the analytic model's until the fight simulation sets it
([stat-balance.md](../../design/tier-rework/stat-balance.md) SB2, §12; [README](../../design/tier-rework/README.md) §9.5).
R1's balance packet (H71) re-baselined Tier 1's fight on today's gear. R2 changes everything a fight is built from:
grades and armor's values, the four accessory families and the signature, the Planet and three moons with Prowess's
split, no MP accessory, the foes' budget × tier. This packet measures R2's shape with the game's own rules on engine v17,
tunes **only the knobs the docs name, in their order**, all v17-only so no v16 fight moves, and writes the measured
numbers into the docs. It also runs **the profession pacing simulation** (one Uma 485 refined, a run of twenty about 15.8
days), which no packet has measured yet.

## Context (read first)

- `CLAUDE.md`, `AGENTS.md`, **R2's build decisions** (H74's first D-row: point 6 between releases, point 14 explicit v17
  inputs), the D-rows of H74–H77, and **R1's H71** (its packet, D-row and harness changes: explicit v16 inputs,
  `SIM_ENGINE=16`, the Class Rank pace, the Summoner's Arms hand) and H60's (`git show 5dd9f08:docs/handoff/tasks/H60-classes-v2-balance.md`,
  D186: how a generation is measured without the switch).
- The design: [README.md](../../design/tier-rework/README.md) **§9.5** (items 1–8, and its D198 note: H81 runs item 1 in
  full and 5–8); [stat-balance.md](../../design/tier-rework/stat-balance.md) §1 (the model), §2 (SB1), §3.7 (the build
  part), **§4** (accessories: share, viability, parity), §5 (the mirrors), **§6** (defense), **§7** (MP, SB18), **§8** (the
  template budget), §9 (Skill Ranks), §11 (the tunings), **§12** (what the simulation must confirm);
  [weapon-progression.md](../../design/tier-rework/weapon-progression.md) §4.3–§4.4 (WP15's budget, the sheets), **§5.7**
  (viability), **§5.8** (WP25 after SB10), §5.9 (MP's knobs); [extra-stats-progression.md](../../design/tier-rework/extra-stats-progression.md)
  **§8.2** (the sheets), §9 (defense and sustain, the Springs test), §10 (EP16);
  [uma-templates.md](../../design/tier-rework/uma-templates.md) §3.4 (the Tier 1 nudge table, UT8), §4 (UT13), UT20;
  [profession-progression.md](../../design/tier-rework/profession-progression.md) **§5.3, §7** (Tier 1 in full: demand,
  trades, supply, a roster, the days), **§8.5, §9.4** (runs of twenty with and without the secondary), §11, §15.
- **The harness** (lines on `421eacd`; R1's H71 moved some):
  - `world/balance-party.ts`: 21 `BALANCE_PARTY`, 25 `onCurveGrade`, 27–53 the kits, 55–63 `onCurveStars` (H76's v17
    branch), 70–72 `BalanceOptions` (`engine`, `tier`, `classRank`), 76–115 `balanceMember`, 121–122 `balanceStage`;
    `world/balance-play.ts` (`play`); `world/balance.test.ts` (`simulate`, `SIM=1`, `SIM_ENGINE`).
  - `rift/balance-sim.ts` (`guided`, `ON_CURVE`, the guard rail), `rift/balance.test.ts`, `rift/balance-v15.test.ts` and
    H71's v16 file; `rift/fronts.ts` 63–120 (`RIFT_TUNING`, `riftTuning(engine)`).
  - `rpg/campaign/enemies.ts` 11–24 (`RPG_FOE_TUNING`: `budgetPerLevel`, `offenseBudgetPerLevel`), 96–111 (H76's v17
    budget).
  - `economy/pacing.sim.ts` and its test (H14's deterministic ledger and its `SIM=1` report: the model for the profession
    simulation); `economy/pacing.ts` 9–73 (Craft Level, `itemMinutes`, refine and make times).
  - R2's values: H74's `economy/grades.ts`, H75's `economy/accessories.ts` and `classPresetV3`/`presetAccessory`, H76's
    `economy/planet.ts`, H77's `items/made.ts` (`madeRecipe`), `economy/professions.ts` (trades).

## Decisions made

- **Measure with explicit v17 inputs, never the switch** (H60, H71): `BalanceOptions.engine: 17`, `SIM_ENGINE=17` on the
  world's and the Rift's tables, `balanceStage(…, 17)`, `riftBattleInput(…, 17)`. Every v15 and v16 table prints as before
  with their defaults.
- **The v17 member** (`balanceMember`'s v17 branch): her class's three default weapons (R1), and at her level's grade
  (`onCurveGrade`) every weapon, armor slot and the accessory slot, values × tier; her class's armor half; **WP25's Tier 1
  form** (Brawler Bell · Greatsword, Mage Pendant, Spell Blade Pendant, Summoner Orb · Light, Paladin Pendant, Cleric Orb ·
  Ice), so `classPresetV3(c, 17)` and the harness agree (assert it, as `balance-v15.test.ts` did for v2); the full core map
  her level opens (`onCurveStars(…, 17)`, `mapPoints`, Prowess at her split, **no** template moon); Class Rank on R1's real
  pace (SB16, as H71 set it); R1's base MP regen and no MP accessory; inherited Limit Breaks as today. **The balance party
  has no template** (XR12).
- **Presets and per-kind offense come from the docs, never from `previews/balance-sheets.html`'s embedded data** (the
  main session's ruling, 2026-10-25): that page predates SB10 and SB8. Use WP25 and weapon-progression §5.8 after SB10,
  and extra-stats §8.2's sheets.
- **A matched member** for item 8 (`BalanceOptions.template: { knack, calling }`, invented): her signature family **put on
  by UT8's swap** (the main session's ruling: the preset form that adds least for her class is replaced by her family's
  best form; in Tier 1's one slot, her family's base form on SB10's kind for a hybrid, else her lead kind:
  `presetAccessory`, H75), the signature's bonus, her moon's two nodes, her Flourish (R1). **Expect UT13's budget, +4.3–6.1%
  damage at Lv 50, net of the form she swapped out.** stat-balance's "fully built" stage added the signature to the
  unchanged class preset; it predates UT8, so its figures read as an upper bound.
- **What each item means here** (on Auto, first try, on curve unless said; the expected results are stat-balance §12's):

  | # | Target | Measured as | Knobs, in order (v17-only) |
  |---|---|---|---|
  | 1 | **Re-baseline:** every Tier 1 stage within 3 points of today's table; Tier 1's build within 2% of today's for five classes; the Summoner's +16% gone (presets on her lead half, her Arms hand 0.48); Skill Ranks +5% at Lv 50 | `simulate` at Tier 1 Lv 10, 20, 30, 40, 50: the v17 party against v15's table (today's, H60–H63) and v16's (R1's, H71) printed beside it | **The foe budget:** a v17 override of `RPG_FOE_TUNING`'s `budgetPerLevel` and `offenseBudgetPerLevel` (`rpgFoeTuning(engine)`), so what the accessories and Skill Ranks add goes back through it (CP §15, WP §13, EP16) |
  | 2 | **The mirror on full maps** (a guard: Prowess and the presets are R2's): Spell Blade and Summoner damage a turn within ±5%, each 70/30 ± 5; Paladin vs Cleric ±10% | H60's measures with v17 parties; expected +6% at Lv 10 to −3% at Lv 50, splits 71/29 and 68/32 | The Summoner's Arms hand inside 0.46–0.50 (a v17 value if it must move from R1's 0.48); the presets' kinds are the docs', not a knob |
  | 5 | **MP:** the Springs test with no MP accessory, the map's +51 MP, legs' +30 and **SB18's regen, which counts at most five depths (4% of max MP a round)** (R1's H68; the main session's note): a region on Auto clears 10–12 of 12; the party's pace in a region's last four stages within ±10% of today's (the model 0.94–1.05×); no class's deep cast refunded by a round (a healer's 76–77% the most); Tier 2 and 3's first levels' MP lead 1.14× and 1.20× | `run` (a region back to back) at Lv 10–50 | The regen's share a depth (a v17 value), then Vigor's MP rate (H76's table, v17), then legs' MP a grade (H74's, v17). Never an MP accessory, never the Flourish (UT6) |
  | 6 | **Defense:** a regular's 100% hit 18.7% · 18.3% · 18.1% of an on-curve Brawler's HP at each tier's Lv 50 (no toolbox term in R2) | The foe's 100% striker hit on the v17 Brawler, Tiers 1–3 | Armor's HP a grade (+15; WP15, SB13) |
  | 7 | **Accessories:** every base form the best somewhere in Tier 1's 24 class-and-context cells, none in more than half; expected the Orb in 13 of 24 by near-ties; channel parity within 1 point at an equal Attack share (SB9) | WP §5.7's four contexts (campaign, tuned, long fights, waves), each class with each form alone at G10, Lv 50 | The form's per-grade values a step down, only for a form confirmed over half (the Orb) |
  | 8 | **Templates:** five matched Umas within 3 points of the template-less party's win rate; the mirror with both hybrids matched; the signature +4.3–6.1% at Lv 50 net of the swap; the Flourish's 4% a fight | The matched members above, one calling at a time and all five | The signature's rate a level (UT20's dial), only if it runs hot; never the foes |

- **Tier 2 and 3 worlds on Tier 1's shape × tier** (D198's between releases; SB1): rounds a fight within ±10% of Tier 1's
  at Lv 10–50 for regulars, sub-bosses and bosses; each source's share of a stat within 2.3 points of Tier 1's at Lv 50.
  **No knob in R2:** the toolbox terms are R3's and R4's (H89, H96); report the numbers for them.
- **The Rift** (a check, as R2 changes its parties): each front's guided party on v17 inside rift.md §11's bands (right
  parties ≥ 80% a stage and 60–70% a champion; wrong ≤ 30% and ≤ 10%, Iron's logged miss as it stands); no single act
  Breaks a Duel boss. Knob: a v17 `riftTuning(17)` override only where §11 breaks.
- **The profession pacing simulation** (`economy/professions.sim.ts`, a deterministic ledger like `pacing.sim.ts`: no
  fights, the game's own catalog, recipes and times):
  - **Tier 1, one Uma:** 110 pieces, **485 refined** (493 with her moon), **822 hours** at Craft Lv 25's speed before
    ×1.25 (835); each trade's hours and share (Mine · Forge 166 h, 20.2%; Forest · Armorer 169 h, 20.6%; Fields ·
    Workbench 167 h, 20.3%; Fishery · Charm Shop 166 h, 20.2%; Monster Den · Lapidary 154 h, 18.8%).
  - **Supply:** each place's hours a maxed Uma and maxed Umas a day (Mine, Forest, Fields, Fishery 1.59; Monster Den 1.88;
    Forge, Charm Shop, Lapidary 1.33; Workbench 1.31; **Armorer 1.28**).
  - **A roster:** forty at the callings' split (9 · 8 · 9 · 7 · 7): **1.27 maxed Umas a day**, a party in 3.9 days, **a
    run of twenty in 15.8 days**; twenty (5 · 4 · 5 · 3 · 3): 0.54 a day.
  - **Craft Level** nonstop at ×1.25: G2 day 2.0, G6 **11.2**, G10 **22.1**, Lv 50 **24.5**; the party holds G10 on day
    22.5, a run of twenty on day 23.7.
  - **R2's Tier 2 and 3 worlds** (one slot, no weapon moon, no Branch Gem, **no secondary** until R3): one Uma's demand on
    R2's shape (485 refined, its share on the tier's own pairs by the ladder) and a run of twenty at the callings' split
    without a secondary (profession-progression §8.5 and §9.4's "No secondary" columns, 40.2 and 46.0 days at the docs'
    505 and 525; R2's lands a little under). Report them: the expected cost of R2 shipping before R3's secondary (H86).
    No knob: amounts are the docs' (PP11).
  - The `SIM=1` report prints the tables; an always-on test asserts Tier 1's numbers.
- **Tuning rules:** only the knobs above, in their order, each a v17 value read by the fight's version or the generator's
  engine, so a v16 fight never moves. Never the shapes (the map's bodies and nodes, the families and forms, the gate),
  never the foes for a template, never an amount. When a target can't be met without breaking another, keep the closest
  and write why, as H51 and H60 did.
- **The docs get the measured numbers:** stat-balance §12 a "Measured (H81)" column; weapon-progression §4.3 and §5.7,
  extra-stats §9's Springs test, uma-templates §4, profession-progression §7 and §8.5: one line each, "Measured by H81
  (D…): …". No manual change (H82).

## Do

1. **The harness:** `balanceMember`'s v17 branch and the matched option; `BalanceOptions.template`; the world's and the
   Rift's `SIM_ENGINE=17`; `rpgFoeTuning(engine)` (v17 override, default today's) if item 1 needs it.
2. **`economy/professions.sim.ts`** and its test, as decided.
3. **Run, tune, run again,** in the knobs' order; keep each knob's before and after.
4. **Tests:**
   - `world/balance-v17.test.ts`: always on: the v17 member at Tier 1 Lv 50 matches extra-stats §8.2's and
     weapon-progression §4.4's sheets within one point a stat (SB2: the code's lifetime level is one lower), the Paladin's
     and the four between's offense included; `classPresetV3(c, 17)` equals the harness's form for all six; a Tier 1 Lv 30
     stage is winnable on Auto. With `SIM=1`: items 1, 2, 5, 6, 7, 8 and the Tier 2 and 3 tables print; at `SIM_SEEDS=32`
     the bands you met are asserted once printed (H63's practice).
   - `rift/balance-v17.test.ts`: the fronts' tables on v17 and the guard rail; the always-on checks as
     `balance-v15.test.ts` has them.
   - `economy/professions.sim.test.ts`: 485, 110, 822 h (± 1), the five shares (± 0.1 point), the places' maxed Umas a day
     (± 0.01), 1.27 a day, 15.8 days (± 0.1), G6 day 11.2 and G10 day 22.1 (± 0.1).
   - Every existing test passes unchanged; v15's and v16's tables print as before.
5. **Docs:** the measured lines as decided; implementation.md §3: "Built: H81 (D…)". `pnpm docs:update`: no diff.
6. **Check it locally** on a switched scratch copy (the local switch, never committed): a world stage on Auto with a v28
   party and a Rift front's stage 1 at 390×844; describe what you saw.
7. **D-row:** fetch `main` first; log the measured results and every knob moved with its before and after.

## Done when

- [ ] `pnpm lint && pnpm test && pnpm build` pass; say the main JS number.
- [ ] The tests in step 4 pass; v15's and v16's tables print as before; the replay tests stay green.
- [ ] Every item's measured result is in the D-row and its doc, met or missed with why; every knob moved is v17-only.
- [ ] `docs/game/` is unchanged and `pnpm docs:update` leaves no diff.
- [ ] The local check in step 6 was done and described. Nothing from the original games in git.
- [ ] Deployed green and https://uma-rpg.web.app/api/health shows the commit.

## Deliver

- **Claude, as a delegated worker:** a pull request from `feat/h81-balance-economy` with one commit,
  `feat(domain): R2's balance on engine v17, and the profession pacing ledger, dark (H81)`; the body tables each item's
  target, measured result and knob. Fetch `main` before you push. The main session reviews and merges it, then watches
  the deploy.
- **Flag it done:** after the merge, a `docs(handoff): H81 done (D…)` commit deletes this file, sets H81 to Done with a
  Done row (its numbers for H82's manual and for R3's H89), and sets H82 to Ready if its other needs are done.

## Notes from the build (main session, 2026-10-25)

- **From H76 (D213):** her Gritty moon's +1.6 Limit start (4 Limit points) reaches a fight as a start of **1**: the
  engine takes a whole-number `limitStart` and `applyPoints` rounds down, as today's Limit points do. Decide whether that
  stands or the rounding changes, and record it. `balanceMember` at engine 17 reads stars through `mapPoints` but still
  v1 gear (`equippedPoints`): swap in grades before measuring. `rpgFoeTierBudget(lifetime, rate, 17)` scales the build
  part × tier (Lv 50 of each tier ×2.715 · ×2.719 · ×2.721 HP and defense, ×1.49 · ×1.491 · ×1.492 offense).
- **From H77 (D211):** recipes and counts through `madeRecipe`, `madeRefined`, `ladderTier`, `PLACE_SLOTS_V3` (4),
  `PLACE_SPEED_V3` (1.25), `TRADES`, `tradePlaces`; make time `itemMinutes(level)` × the refined count. One Uma's Tier 1
  demand measures 110 pieces and 485 refined (493 with her moon).
- **From H71 (D207):** with the supports gone, today's gear gives a late-region pace of 0.87 · 0.80 · 0.66: re-tune the
  regen's share against R2's MP (Vigor, legs). The Summoner's Arms hand is 0.50 from v16 with no v17 row; SB11's 0.48 is
  on Prowess, so add a v17 row if the measure says so. `RPG_LINE_B_POWER_V16` and `RIFT_TUNING_V16` also apply from v17.

