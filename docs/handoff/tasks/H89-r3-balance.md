# H89 — Release 3's balance (dark): Pure against Dual, coverage and shields, Full against Split, every branch someone's best, Tier 2's term for these tools, the Rift's Tier 2 fronts

**uma-rpg · Claude · L · Needs: H83, H84, H85, H86 · Unblocks: H90**

> **H116 re-plan (D237):** measure with weaknesses v2's live WK8 three-kind world lists and WK9 Rift lists. Ignore
> every one-kind/twin or “narrowing in R4” assumption below; report and pin the measured live-list coverage instead of
> forcing the retired `2.0 answers` target. Do not tune weakness generation.

## Why

"Balance is measured, not guessed" ([implementation.md](../../design/tier-rework/implementation.md) §2). Release 3's
tools are big: the stat balancing's model ([stat-balance.md](../../design/tier-rework/stat-balance.md) §3.4) has Tier
2's weapon branches at ×1.05 an act, the second slot and its branches at ×1.13 and the weapon moon at ×1.14 by Tier 2's
Lv 50. Unpriced, a Tier 2 party would fell foes about a third faster than Tier 1's at the same tier level, against the
owner's "the rate of progression is fine as it is". This packet plays Release 3 on engine v19 with the game's own rules,
measures README §9.5's Tier 2 items on **R3's shape** (Tier 2's weapons on weaknesses v2, no focus), tunes only
the knobs the docs name, in their order, and sets **this release's share of Tier 2's term**. Every number is v19-only,
so the live game (v18) doesn't move until H90.

## Context (read first)

Code pointers are by file and function: Releases 1 and 2 move the lines. Re-read the code before starting.

- `CLAUDE.md`, `AGENTS.md`; [implementation.md](../../design/tier-rework/implementation.md) (D198: "Between releases",
  "Balance is measured"); **H83's first D-row** (Release 3's build decisions: point 2, Tier 3 worlds on Tier 2's shape;
  **point 3, weaknesses stay twins until R4; point 4, the term's split**) and the D-rows of H84, H85, H86.
- The targets: README §9.5 ("For Tier 2's toolbox"); stat-balance **§3 (the stack, the toolboxes, the terms, the
  fallback knobs), §4.2 (every form someone's best), §5 (the mirrors), §10 (shields against answers), §12 (what the
  simulation must confirm)**, SB3, SB6, SB7, SB8, SB10, SB12, SB13; weapon-progression §3.6 (WP12), **§3.7 (Pure or Dual
  ±10%, its fallbacks)**, **§5.7 (viability, the Tier 2 table)**, §5.8; extra-stats-progression **§4.2 (Full or Split at
  0.7)**, §10 (EP16); class-progression §4.3 (CP7, the guided builds), §4.4 (CP8); profession-progression **§8.5 (a run of
  twenty)**; [rift.md](../../design/rift.md) §11 (the bands).
- How the last balance packets measured: H60 (`git show 5dd9f08:docs/handoff/tasks/H60-classes-v2-balance.md`), D186,
  D187; **R1's H71 and R2's H81** (their packets, Done rows and D-rows: the re-baseline harness, the on-curve party
  with presets, maps and the base MP regen, Tier 2 and 3 worlds on their shapes, the profession pacing simulation).
- **The harness** (as Release 2 left it): `world/balance-party.ts` (`BalanceOptions` with `engine`, `balanceMember`,
  `balanceParty`, `balanceStage`, the kits by generation), `world/balance-play.ts` (`play`), `world/balance.test.ts`
  (`simulate`, `run`; `SIM=1`, `SIM_ENGINE`), `rift/balance-sim.ts`, `rift/balance*.test.ts` (guided parties, the
  stage and champion tables, the Convergence, Echoes, the guard rail), `rift/fronts.ts` (`riftTuning`,
  `riftFrontSpecs`, the guided builds H66 wrote), `rift/generate.ts` (`riftBattleInput`), `rpg/campaign/enemies.ts`
  (`RPG_FOE_TUNING`, `rpgFoe`, `rpgFoeTierBudget`, H66's `rpgFoeShields(engine)`: Tier 1's sub-bosses 5 and bosses 6,
  which every tier's world plays after R1), `world/world.ts` (the formations' shields, the weakness rule by tier),
  `world/capital.ts`, `rpg/campaign/chapters.ts`, the pacing simulation in `economy/` (H81's), H83's
  `world/coverage-v19.test.ts`.
- **What R4 builds on this** (its packets are written): H93 adds v20's rows to the two functions this packet creates,
  `rpgTierShield` and `rpgTierTerm` (SB3, SB5, SB6 whole, and the narrowing), and builds Z9's added Rift tests; H96
  re-measures. Keep both functions keyed by engine so v19's rows stay what you set.

## Decisions made

- **Measure with explicit v19 inputs, never the switch.** `balanceMember` builds **a Tier 2 Uma on curve with Release
  3's kit** when `engine: 19` and her world's tier ≥ 2:
  - **branches** from G5 (Lv 21) on WP §3.8's branch 1 picks: Brawler Pure Greatsword, Pure Axe, **Dual Lance +
    Katana**; Mage **Dual Fire + Dark**, Pure Ice, Pure Lightning; Spell Blade **Dual Katana + Axe**, Pure Lance, Pure
    Lightning; Summoner Pure Dark, Pure Light, **Dual Bow + Greatsword** (in a Paladin party **Dual Dark + Ice**);
    Paladin Pure Greatsword, Pure Axe, **Dual Light + Fire**; Cleric **Dual Light + Fire**, Pure Ice, Pure Bow;
  - **accessories:** H84's Tier 2 presets, base forms below a slot's G5;
  - **the weapon moon:** H85's preset on curve nodes (Lv 6–46);
  - everything else as Release 2's on-curve member (maps, armor, the base MP regen, Skill Ranks on the real pace);
  - **Tier 3 worlds** the same kit at Tier 3's values (H83's point 2); Tier 1 is Release 2's, untouched.
  Every table H71 and H81 printed prints the same with the defaults.
- **What each target means here** (on Auto, first try, on curve unless said; `SIM_SEEDS` ≥ 32 for the tables):

  | # | Target | Measured as | Expected (the model) |
  |---|---|---|---|
  | 1 | **Pure against Dual within ±10%** (WP §3.7) | For each member, her §3.8 Dual against the same weapon Pure, one at a time: the party's damage a round over whole fights with Breaks counted (the rounds a Broken foe loses), over the campaign (Tier 2 Lv 30 and 50, every region) and the Rift's Tier 2 fronts together | Within ±10% (the Brawler's Lance: Pure +1.6% of her damage, Dual +3.1% plus chips, on one-kind regulars; on R3's twins the Dual's gain is smaller) |
  | 2 | **Coverage and Breaks** (WP12, CP8) | H83's `world/coverage-v19.test.ts` (2.0 answers a Tier 2 regular on the design's narrowing; R3's interim printed) and, in fights, **rounds to the first Break** for regulars, sub-bosses and bosses in Tier 2 and 3 worlds against Tier 1's at the same tier level | Within ±0.5 of Tier 1's for every rank |
  | 3 | **Full against Split at 0.7** (EP25) | Each class's preset moon as Full on her lead kind and as Split, campaign and tuned (a front where 75% of her choosable acts are one kind) | Split best in the campaign for every class (by 1–4 points), Full on a tuned front for the pure classes and the healers (by 3.5–4), a hybrid's Split on her pair |
  | 4 | **Every branch someone's best** (WP §5.7, SB8) | Each form alone in a member's slot at its best setting, G10 and Lv 50, WP §5.7's four contexts (campaign, tuned, long fight, waves), 24 class-and-context cells | Great Orb 6, Twin Orb 5, Great Pendant 4, Great Insignia 3, Channel Pendant 2, Onslaught 2, Great Bell 1, Toll Bell 1; none over half |
  | 5 | **The stack on one weak hit** (WP31, SB7) | The largest factor on one weak hit on R3's shape, and the tuned peak (her strongest act, tuned to her best kind, on a foe weak to it, first act of a wave) against her on-curve campaign act | ×1.875 (Pure ×1.5 × Onslaught ×1.25), ×1.8 with a Great Insignia on a boss; the peak a little under the model's 1.60, which includes R4's focus: the measured value is what target 9 prices |
  | 6 | **The pace with R3's term** (SB3's check, this half) | Acts (and rounds) to fell regulars, elites and bosses, Tier 2 at tier Lv 10, 20, 30, 40, 50 against Tier 1 at the same tier level; Tier 3 worlds the same | Within ±10% at every level and rank |
  | 7 | **Defense** (SB13) | A regular's 100% hit on an on-curve Brawler at Tier 2's Lv 50 | About 18.3% (no offense term in R3) |
  | 8 | **The mirrors on R3's shape** (SB10, SB12) | Spell Blade against Summoner, damage a turn and each one's split, Tier 2 Lv 30 and 50; Paladin against Cleric, healing and Barrier absorbed a fight | ±5% and 70/30 ± 5 each way; ±10% |
  | 9 | **The Rift's Tier 2 fronts** (CP7, SB7, rift.md §11) | H51's tables at the Tier 2 Rift with Tier 2 guided builds (below): stages, champions, wrong parties, the Convergence, the guard rail | Right parties ≥ 80% a stage and 60–70% a champion; wrong ≤ 30% and ≤ 10%; the Convergence about 50%; no single act Breaks a Duel boss |
  | 10 | **A run of twenty with the secondary** (PP14, profession-progression §8.5) | H81's pacing simulation on a Tier 2 world, Release 3's demand (Branch Gems, the weapon moon's jewels, two slots' Settings) and H86's gate, four run splits | 28.5 days for 5·4·5·3·3, 4·4·4·4·4, 5·5·5·3·2 and 6·5·5·3·1 (without a secondary 40.2 · 30.1 · 60.2 · 120.5) |
  | 11 | **MP** (a check) | The Springs test in one Tier 2 region with Release 3's kit | 10–12 of 12, the last four stages' pace within ±10% of Tier 1's (nothing in R3 costs MP) |

- **R3's term** (H83's point 4): **`rpgTierTerm(tier, curveLevel, rank, engine)`** (new, `rpg/campaign/enemies.ts`, read
  by `rpgFoe` after the build budget; the generators pass their engine, default live; foes are frozen into a fight's
  input, so older fights replay), a **toolbox term on the foes' HP and DEF only** from v19 in tier 2+ worlds:
  `× (1 + a (ℓ − 1) ÷ 49)`, ℓ the tier level; **no offense part and no boss factor** (SB3's +10% offense prices R4's
  healers' focus; SB5's ×1.1 the narrowing R4 brings). **Start from a = 0.24** (the model: R3's tools are ×1.35 of an
  act at Lv 50, about nine tenths of the gain SB3's +27% prices before R4's focus ×1.12 and narrowing ×0.94 net ×1.05),
  then set it by target 6. **Tier 3 worlds take Tier 2's formula at their tier level** (as R4's H93 does until R5);
  only if target 6 misses ±10% in Tier 3 worlds does their row gain a start factor (SB4's shape, `b + a (ℓ − 1) ÷ 49`,
  b about 1.05: a Tier 3 Uma arrives with her branches). H93 writes v20's row (SB3 and SB5 whole) and H96 measures it;
  R5 replaces Tier 3's with SB4's.
- **Shields on R3's shape** (H83's point 3, CP8's rule: a shield grows with the answers its foe's list gets):
  **`rpgTierShield(rank, tier1Shield, tier, engine)`** (new, `rpg/campaign/enemies.ts`, the one rule every generator
  reads), from v19 in tier 2+ worlds, starting from **CP8's Tier 2 numbers: every regular-rank foe its Tier 1 shield
  + 1, sub-bosses 7, bosses 9** (SB6), each never below its Tier 1 value + 1. Why they fit R3: a twin-weak regular
  with best Duals has about a boss's answers (3.5 against Tier 1's 2.47), which CP8's rule prices at Tier 1's + 1, and
  the sub-boss and boss numbers are CP8's for twin-weak foes, bosses 9 from SB6's chips. Tier 3 worlds use the same
  until R5 (they play Tier 2's shape). Set them by target 2. **This brings SB6's Tier 2 boss 9 forward from R4 to R3**
  (the Duals that raise a boss's answers arrive here); H93 writes v20's row with the same numbers and re-measures with
  the narrowing. The Rift's Tier 2 stage shields stay in `riftTuning`'s override (target 9).
- **Z9's added Rift tests** (tier2-world §12: Iron's +2 shields, the Duel acting three times from stage 9, the Horde's
  5–7 foes, Arcane's split) **are H93's**: they test R4's tools (Break tips, the focus, class skills) as much as R3's.
- **The Rift's Tier 2 fronts** (CP7): the guided builds (H66's compositions and weapons) gain Tier 2's tools in the
  guidance: Pure on a front's own kinds where its foes ask one kind (Iron's Arms, Arcane's elements), each member's
  §3.8 Dual where breadth pays (the Duel, the Horde); accessory forms tuned to the front (a Great Orb on its kind, a
  Twin Orb on a hybrid's pair, Onslaught on the Horde); the moon Full on the front's kind for the pure classes and
  healers, Split on a hybrid's pair. **`riftTuning(engine, tier)`** gains the tier: Tier 1's numbers stay Release 2's;
  Tier 2's (and Tier 3 worlds') override is set by target 9, pricing the tuned party at target 5's measured peak (SB7).
  The Rift's weakness draws stay R1's until R4.
- **Tuning order** (each re-measured before the next): 1) the term's slope `a` (then Tier 3's start factor, only if
  needed) for target 6; 2) the shields within CP8's rule for target 2; 3) a dominating accessory form's per-grade values
  a step down (WP §5.7's knob) for target 4; the branches × 0.8 together stays in reserve (SB7); 4) the Split share by
  ±0.05 only if one mode is never best (target 3); 5) `riftTuning(19, 2)` for target 9 (if one act Breaks a Duel boss,
  the Duel's shields rise, classes-v2 §3.1's guard rail, never the tool). **Never** Pure's ×1.5, the partner table, the
  two-kind cap, the kind cap, the hands, Tier 1's numbers, or the world's foes beyond the term and the shields.
- **When a target can't be met** without breaking another, keep the closest and write why, as H51 and H60 did. For
  target 1 that includes WP §3.7's fallbacks: they are Tier 3's (one two-kind weapon in Tier 3) or remove a release's
  feature (Dual from Tier 3 only, no branches), so they are **not applied in R3**; the delivery and the D-row log the
  measurement for the owner.
- **Always-on checks** (v19, fixed seeds, fast), in a new `world/balance-v19.test.ts` and `rift/balance-v19.test.ts`:
  a Pure weak hit is ×1.5 ÷ 1.3 of the base one in one fixed fight; the on-curve Tier 2 party wins a `w6` stage and a
  Lv 50 `w10` stage; a G10 Toll Bell reaches 2.0 in a long fight; Iron's Tier 2 guided party wins Iron's stage 1 in
  Tier 2; Tier 1's tables print as before with the defaults.
- **Docs:** weapon-progression §3.7 and §5.7, extra-stats-progression §4.2, stat-balance §12 (items 3, 4, 5, 9: a
  "Measured on R3's shape (H89, D…)" column), rift.md §11 (Tier 2's results) and profession-progression §8.5 carry the
  measured numbers. The manual is unchanged (H90 carries them); `pnpm docs:update` leaves no diff.

## Do

1. **The harness:** `balanceMember`'s Release 3 kit, the Tier 2 guided builds, `riftTuning(engine, tier)` (identity for
   Tier 1), `rpgTierTerm` and `rpgTierShield` and their callers in the generators. Check every H71 and H81 table prints
   the same with the defaults.
2. **Measure** targets 1–11 (`SIM=1 SIM_ENGINE=19`; Tier 2 and Tier 3 worlds). Save the raw tables for the delivery.
3. **Tune** in the order decided; re-measure after each step; stop when every target holds or is explained.
4. **Always-on checks** as decided.
5. **Docs** as decided; log the D-decision (fetch `main` first): every number set or changed, and the measured tables
   in one paragraph, as D176 and D186 did.
6. **Check it locally** with the local switch (never committed: `caps.ts` 18, `SAVE_SCHEMA_VERSION` 29, `toV29`
   chained, as H88 describes) on a scratch save of real outfits on curve in a Tier 2 world from the CJS build (as H51
   did): a `w6` stage and Iron's Tier 2 stage 1 on Auto through the game's own fight rules, and a world-map stage in the
   app at 390×844 in a desktop browser (never the iOS Simulator). Then undo the switch.

## Done when

- [ ] `pnpm lint && pnpm test && pnpm build` pass (the SIM tables are opt-in); main JS unchanged (the harness is test
  support, the generators lazy or tiny). Say the number (of 230 KB).
- [ ] Every target in the table is met on R3's shape, or the delivery says which is closest and why; the raw tables are
  in the delivery.
- [ ] Every H71 and H81 number prints unchanged with the defaults; every replay test stays green; no v18 number changed.
- [ ] The design docs carry the measured results; the D-decision is logged; `docs/game/` is unchanged and
  `pnpm docs:update` leaves no diff.
- [ ] The local check in step 6 was done and described, and the switch undone (`git diff` shows none). Nothing from the
  original games in git.
- [ ] Deployed green and https://uma-rpg.web.app/api/health shows the commit.

## Deliver

- **Claude, as a delegated worker:** a pull request from `feat/h89-r3-balance` with one commit,
  `feat(domain): Release 3's balance, measured and tuned on engine v19 (H89)`; the body lists every number set or
  changed and the measured tables. H87 and H88 edit the save and the web at the same time; you may meet H87 in
  `save/battle.ts` (rebase on whichever lands first) and H88 in `save/targets.ts` (don't touch it). Fetch `main` before
  you push. The main session reviews and merges it, then watches the deploy.
- **Flag it done:** after the merge, a `docs(handoff): H89 done (D…)` commit deletes this file, sets H89 to Done with a
  Done row (the measured results in one paragraph, as H51's and H60's), and sets H90 to Ready if H87 and H88 are done.
