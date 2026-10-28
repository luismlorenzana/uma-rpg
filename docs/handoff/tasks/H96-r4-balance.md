# H96 — R4's balance, dark: each class's two branches, the stack on one weak hit, the Tier 2 mirrors, the pace with the term

**uma-rpg · Claude · L · Needs: H92, H93 (and through them H91) · Unblocks: H97**

> **H116 plan correction (D237): read [weaknesses-v2.md §7, WK8–WK10](../../design/tier-rework/weaknesses-v2.md#7-later-tiers-and-the-rift-wk8wk10) before measuring.**
> Run every campaign balance and coverage table against the live three-kind WK8 world lists; do not reconstruct the
> retired one-kind/twin model. The Rift remains on WK9. The `coverage 2.0` target below is obsolete: report and pin the
> measured WK8 baseline instead, then tune only the packet's existing non-weakness knobs.

## Why

The stat balancing (D196) is an analytic model: "the final tuning by simulation happens at implementation" (SB2). R3's
balance (H89) measured Tier 2's weapon tools and priced their share of the term. This packet measures **Tier 2's whole
toolbox** with the game's own rules on engine v20: the class branches and their focus, the class skills, branch C, the
Break and signature tips, LB+, weaknesses v2's three-kind lists, boss shields 9 and the full term. It tunes **R4's own
knobs first**, in the order the docs name, touches the Rift's tuning only where its bands break, and writes the measured
numbers into the docs. All of it is v20-only, so the live game (v19) doesn't move until H97.

## Context (read first)

Code pointers are by file and function: Releases 1–3 move the lines. Re-read the code before starting.

- `CLAUDE.md`, `AGENTS.md`; H60's packet (`git show 5dd9f08:docs/handoff/tasks/H60-classes-v2-balance.md`, the model
  for this one), D176 and D186 (how H51 and H60 measured and tuned); the D-rows of H71, H81 and **H89** (R1–R3's balance:
  their harness options, numbers and what they left for this packet), H91, H92 and H93.
- **The expected results:**
  - [stat-balance.md](../../design/tier-rework/stat-balance.md) **§12** (what the simulation must confirm, with the
    model's numbers), §3.1–§3.6 (ceilings, the tuned peak, the toolbox, the knobs, the terms), §5.1 (the Tier 2
    mirrors, before and after SB10–SB11), §5.2 (SB12's healer pairs), §7.2 (SB18 and the Springs test), §10 (shields
    against answers), §11 (the tunings), §14.
  - [class-progression.md](../../design/tier-rework/class-progression.md) **§15** (the branches' and the focus's
    targets, Tier 2's term), §7.2 (the three drawn parties and the regions each suits; "Priced like a branch": a class
    skill +10–20% in its context), §6.1 (CP15), §4.4.
  - The tier-rework README **§9.5's Tier 2 paragraph** (the full list for Tier 2's toolbox).
  - [uma-templates.md](../../design/tier-rework/uma-templates.md) §3.5 (the tips are sidegrades, priced in Tier 2's
    simulation), §4 (UT13: five matched Umas within 3 points).
  - [tier2-classes.md](../../design/tier2-classes.md) §7.2 (each LB+ +15–25%).
  - [rift.md](../../design/rift.md) §11 (the bands and how they were measured), §5.
- **The harness** (by role; H71, H81 and H89 grew it):
  - `world/balance-party.ts`: `BALANCE_PARTY`, `KIT`, `balanceMember` (on curve: gear by grade, Extra Stats, an
    inherited Limit Break, R3's weapon branches and moon, the presets), `balanceStage`; `BalanceOptions` (its `engine`,
    tier and the options R1–R3 added).
  - `world/balance-play.ts` (`play`, `Played`), `world/balance.test.ts` (`simulate`, `run`; `SIM=1`).
  - `rift/balance.test.ts`, `rift/balance-v15.test.ts` and R3's (`guided`, the guard rail, the always-on checks);
    `rift/fronts.ts` (`riftGuidedBuild`, `riftTuning(engine, tier)`), `rift/generate.ts` (`riftBattleInput`).
- **The knobs** (all v20-only, so tuning them never moves a v19 fight): H91's class-skill data and `BATTLE_FOCUS_BONUS`
  (0.15); H92's C lines, tips and LB+ data; H93's term rows (v20: Tier 2 0.27, 0.10, ×1.1; Tier 3 worlds H89's b₃ and
  a₃ with the offense part and the boss tenth), the v20 shield row (`rpgFoeShields`: bosses 9, sub-bosses 7, regulars
  Tier 1's + 1), and a `riftTuning(20, 2)` override.

## Decisions made

- **Measure with explicit v20 inputs, never the switch.** `BalanceOptions` gains each member's **class branch** and her
  tips; `balanceMember` builds a tier 2 Uma on curve with R3's best picks (weapon-progression §3.8, or her reverse set's
  §3.8 picks), her preset by branch (WP25, EP29), **her three class skills equipped** among her ten, tips at Power unless a
  check says otherwise, and her first seat's LB+ when the check is about LB+. `balanceStage` and `riftBattleInput` take
  version 20. Every number H89 printed must print the same with the defaults.
- **What each target means here** (on Auto, first try, on curve unless said; Tier 2 at Lv 30 and 50 unless said):

  | # | Target | Measured as |
  |---|---|---|
  | 1 | **Each class's two branches** within ±5% of each other across the regions, each ahead by 10–20% in its own (CP §15) | The default party with one member swapped to branch 2 and back, damage per act over whole fights: all 19 biomes; then the ring's regions (two-thirds or more Heavy and Elemental signatures) for a Heavy and Elemental branch, the Light and Dark regions (a third or less) for a Lite and Arcane one |
  | 2 | **The three drawn parties** (CP41, §7.2) within 3 points of the defaults' win rate in their regions, or better | Win rates by region: the defaults on the ring's regions, the owner's swap on the even ones, the Light/Dark lean on its six |
  | 3 | **Class skills priced like a branch** (CP34): +10–20% over the same depth's A-line skill in context, behind elsewhere | Each of the 36 against her A-line skill of that depth, in its lean's context (§7.2's "Lean · front") and in the campaign |
  | 4 | **Branch C and the tips** (CP §15): a C line +10–20% over A in its context; any mix of lines within ±5 points of all-A; Sweep and Hunt within ±15% of the mirror in their context; Break tips bring Breaks 0.3–0.7 rounds sooner (SB §10) | As H71 measured B, with C and with each tip |
  | 5 | **The stack on one weak hit** (WP31, SB7): ×1.50 · **×2.16**; the tuned peak about **1.6×** the campaign's act (SB §3.2) | An exact factor check (below), then the tuned party (guided build, best picks, Onslaught's first act) against the on-curve campaign act |
  | 6 | **The Tier 2 mirrors** (CP9, SB §5.1): Rune Knight ↔ Conjurer and Blademaster ↔ Warlock within ±5%, each 70/30 ± 5 | Damage per act and split, as H60's targets 1, 2 and 4, on Tier 2's stages and the Horde. The model: the Ring mirror −7% to −13% at Lv 30–50 before tuning, the Light/Dark one 0.95–1.03 |
  | 7 | **Paladin vs Cleric** (SB12) within ±10%, class skills on | Healing plus Barrier absorbed per fight, Guardian ÷ Bishop and Templar ÷ Oracle (the model: 0.935 and 1.07) |
  | 8 | **Shields** (CP8, SB6): rounds to the first Break within ±0.5 of Tier 1's with bosses 9; regulars and sub-bosses hold | Rounds to the first Break by rank, Tier 2 against Tier 1 at the same tier level (the model: −0.41 for bosses) |
  | 9 | **The pace with the full term** (SB3, SB5): rounds a fight within ±10% of Tier 1's at Lv 10–50, regulars, elites and bosses; fully built within 10% too | `simulate` at Tier 2 Lv 10–50 against Tier 1 at the same level (the model: regulars 1.03–1.10, bosses 0.96–1.05) |
  | 10 | **The signature tips** (UT9, CP15): sidegrades, each within ±5% of Power on her lead tree across the campaign and ahead in its context; five matched Umas within 3 points (UT13) | Quickstep on shields, Spillover on crowds, Long guard on heavy hitters; the template check re-run in Tier 2 |
  | 11 | **LB+**: each +15–25% of its Limit Break | Its damage or support with and without the plus, one fight a seat |
  | 12 | **The Rift's Tier 2 fronts** (rift §11, SB7): right parties ≥ 80% a stage and 60–70% a champion; wrong parties ≤ 30% and ≤ 10%; the Convergence about 50%; a tuned party about 1.6× the campaign's act; no single Uma Breaks a Duel boss in one act | H51's tables on a Tier 2 run with H93's guided parties and their branches; then each front with the swap §7.2's leans suggest (the Blademaster on Iron, the Templar on the Horde …), keeping the one with the higher champion win rate and recording both |
  | 13 | **MP** (SB18): the Springs test in Tier 2, skill MP ×1.7 and class skills on: a region's last four stages within ±10% of today's pace; no deep cast refunded by a round | README §9.5 item 5's test at Tier 2's Lv 30 and 50 |
  | 14 | **R3's items with R4's tools on**: Pure against Dual within ±10%, coverage 2.0, Full against Split, every accessory branch someone's best | H89's tables re-run on v20: report the drift; tune only R4's knobs |
  | 15 | **Tier 3 worlds on R4's shape** (between releases): rounds a fight within ±10% of Tier 1's, as H89 held them | `simulate` at Tier 3 Lv 10–50 with R4's tools on; the knob is the interim term's a₃ (then b₃). R5's H101 replaces it with SB4's |

- **Tuning order** (smallest moves first; re-measure after each step):
  1. **R4's content numbers, inside their shapes:** the class skills' power and MP (for the Ring mirror, **the Rune
     Knight's three first**, as SB §5.1 and README §9.5 item 2 name: never the hands); C lines' shares (the area share,
     Mighty's ×1.1, Hunt's three strikes, Wide's ×0.4); the tips' riders (Spillover's ×0.3, Long guard's 10%); LB+'s 24
     inside +15–25%.
  2. **The focus +15% → +10%** (CP39's fallback, SB §3.5) only if the stack runs hot: the ceilings miss SB7, or target
     9 would need the term beyond its band.
  3. **The term's HP and DEF rate 0.27** within ±0.05 (SB3's knob); the offense +10% and the bosses' ×1.1 stay. Tier 3
     worlds' a₃ (then b₃) for target 15. A move updates H93's Tier 2 foe digest on purpose, said in the D-row.
  4. **Boss shields 9 ± 1** if target 8 misses (SB6).
  5. **`riftTuning(20, 2)`** only where §11 still breaks after 1–4, as a v20 override read through the fight's version, so a
     pre-switch Rift fight keeps its foes.
  **Never:** the hands and leans (Tier 1's balance), R3's weapon branches and partners, the accessories' and Insignias'
  values, the weapon moons, Tier 1's foes, or the owner's shapes (a focus on a group, the sets, the tips' kinds).
- **When a target can't be met** without breaking another, keep the closest and write why, as H51 did for Iron's wrong
  party; the owner prefers that to an open question.
- **Always-on checks** (v20, fixed seeds, fast), in `world/balance-v20.test.ts` and `rift/balance-v20.test.ts`:
  - **the stack's factor:** one hit on a weak foe by a tier 2 ally with a Pure weapon, her focus and an Onslaught
    Insignia on her wave's first act deals **×2.156** (± 0.5%) of the same hit with a base weapon, no focus and no
    Insignia on a foe not weak to it, the unbroken halving and statuses equal; Tier 1's ×1.495 alongside (a base
    weapon's ×1.3 and a base Insignia's ×1.15, on a boss);
  - the default party on branch 1 wins a Tier 2 Lv 30 regular stage on Auto; Iron's Tier 2 guided party wins Iron's
    Tier 2 stage 1;
  - **the guard rail at v20:** every class's best act (class skills, Break tips and LB+ included) removes fewer shield
    points from a lone foe than the Tier 2 Duel's lowest shield;
  - the Rune Knight ↔ Conjurer ratio within ±5% on one fixed fight.
  R1–R3's always-on checks stay as they are.
- **Docs:** class-progression §15 gains a "Measured (H96, D…)" line for Tier 2's targets; stat-balance §12 gains the
  measured beside each expected number; rift.md §11 gains Tier 2's results beside Tier 1's; README §9.5's Tier 2
  paragraph gains "Measured in H96 (D…)". The manual is unchanged (H97 carries the numbers into it; `pnpm docs:update`
  leaves no diff now).

## Do

1. **The harness:** the branch, tips, class skills and LB+ in `balanceMember`; v20 inputs; a `SIM_ENGINE=20` switch on
   the balance files (or v20 tables beside the v19 ones). Check that every H89 table prints the same with the defaults.
2. **Measure** targets 1–15 (`SIM=1`). Save the raw tables in your delivery.
3. **Tune** in the order decided; re-measure after each step; stop when every target holds or is explained.
4. **Always-on checks** as decided.
5. **Docs** as decided; log the D-row (fetch `main` first). `pnpm docs:update` leaves no diff.
6. **Check it locally** with the local switch (never committed: `caps.ts` 19, `SAVE_SCHEMA_VERSION` 30, `toV30`
   chained, as H95 describes), on a scratch save with a Tier 2 world on curve: a Tier 2 region on Auto at 390×844 in a
   desktop browser (never the iOS Simulator), and a Tier 2 Rift front's stage 1 through `startRiftFight`/`actInRiftFight`
   with the guided party. Then undo the switch.

## Done when

- [ ] `pnpm lint && pnpm test && pnpm build` pass (the SIM tables are opt-in); main JS unchanged (the harness is test
  support, the generator lazy). Say the number (gzip, of 230 KB).
- [ ] Every target is met or the delivery says which is closest and why; the always-on checks pass; the raw tables are
  in the delivery.
- [ ] H89's numbers print unchanged with the defaults; the replay fixture tests stay green; no v19 number changed.
- [ ] class-progression §15, stat-balance §12, rift.md §11 and README §9.5 carry the measured results; the D-row is
  logged; `docs/game/` is unchanged and `pnpm docs:update` leaves no diff.
- [ ] The local check in step 6 was done and described, and the switch undone (`git diff` shows none). Nothing from the
  original games in git.
- [ ] Deployed green (`gh run watch <id> -R luismlorenzana/uma-rpg --exit-status`), and
  https://uma-rpg.web.app/api/health shows the commit in `build`.

## Deliver

- **Claude, as a delegated worker:** a pull request from `feat/h96-r4-balance` with one commit,
  `feat(domain): R4's balance, measured and tuned on engine v20 (H96)`; the body lists every number changed and the
  measured tables. H94 edits the save at the same time; you may both touch `save/presets.ts` (rebase on whichever lands
  first). Fetch `main` before you push. The main session reviews and merges it, then watches the deploy.
- **Flag it done:** after the merge, a `docs(handoff): H96 done (D…)` commit deletes this file, sets H96 to Done with a
  Done row (the measured results in one paragraph, as H60's), and sets H97 to Ready if H94 and H95 are done.
