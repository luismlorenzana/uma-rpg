# H71 — R1's balance, dark: the re-baseline on today's gear, the mirror, weaknesses and shields, branches and Pierce, MP with the regen, the Rift's Tier 1 fronts

**uma-rpg · Claude · L · Needs: H65, H66, H68 · Unblocks: H72; R2's H81**

## Why

The stat balancing (D196) is an analytic model; "the fight simulation tunes the final numbers at implementation"
([README](../../design/tier-rework/README.md) §9.5, [stat-balance.md](../../design/tier-rework/stat-balance.md) §12).
R1 changes how every Tier 1 fight plays (three weapons, twin weaknesses, lower shields, trees with ranks and Pierce, the
base MP regen) while the gear stays today's, so it gets its own re-baseline before it goes live. This packet measures R1
with the game's own rules on explicit engine v16 inputs, tunes **only the v16 knobs the docs name, in their order**, and
writes the measured numbers into the docs. Everything it changes is v16-only, so the live game (v15) doesn't move until
H72. R2's balance packet (H81) re-measures on R2's gear.

## Context (read first)

- `CLAUDE.md`, `AGENTS.md`. [README](../../design/tier-rework/README.md) §9.5 (items 1–5 are R1's; 6–8 are R2's);
  [stat-balance.md](../../design/tier-rework/stat-balance.md) §3.7, §5.1, §7.2, §9, §10, §11, §12 and SB6, SB11, SB14, SB16,
  SB18; [class-progression.md](../../design/tier-rework/class-progression.md) §2.2 (CP9), §4.4 (CP8), §4.5, §6.2 (Pierce),
  §15 (pacing); [rift.md](../../design/rift.md) §5 and **§11** (the bands, H51's and classes v2's measured tables, "How it
  was measured"); D176, D186, D187 (how H51, H60 and H63 measured and tuned); the D-rows of H64–H68.
- `git show 5dd9f08:docs/handoff/tasks/H60-classes-v2-balance.md` and `git show 8ee82fd:docs/handoff/tasks/H63-hybrid-mirror.md`:
  the balance packets this one follows.
- **The harness** (lines on `421eacd`; H65 taught `balanceMember` a v16 Uma):
  - `world/balance-party.ts`: 21 `BALANCE_PARTY`; 29–37 `KIT`, 45–52 `BALANCE_KIT_V2` (an Orb on her spread's first kind and
    her support); 56–63 `onCurveStars`; 70–72 `BalanceOptions`; 76–115 `balanceMember` (Class Rank = her level at 82);
    117–122 `balanceParty`, `balanceStage`.
  - `world/balance-play.ts` 14–39 `play` (won, rounds, HP left, lowest, KOs, MP).
  - `world/balance.test.ts`: 29–37 `regionsAt`, `simulate`; 56 `run` (a region back to back, MP carried); 151 and 174–180
    `SIM_ENGINE`, `SIM_SEEDS`; `SIM=1 SIM_ENGINE=15 npx vitest run src/world/balance.test.ts`.
  - `rift/balance-sim.ts`: 29–36 `guided`, `partyOf`, `withDefaultLoadout`; 40 `WRONG`; 59 `frontStages`; 143–263 the guard
    rail (`guardRailV2` 216); 265 `duelShields`. `rift/balance.test.ts` and `rift/balance-v15.test.ts` (H60's and H63's
    always-on checks, 159–220).
- **The v16 knobs** (every one v16-only, so tuning never moves a v15 fight or the live game):
  - H64: `rpgHand(…, 16)`, the Summoner's Arms hand (0.48);
  - H65: the B lines' `skill16` power (Pierce ×1.15; any other B line gains a `skill16` only if it is tuned);
  - H66: `rpgFoeShields(16)` (sub-boss 5, boss 6), `RIFT_TUNING_V16`;
  - H68: `RPG_BASE_MP_REGEN` (0.008 a depth);
  - new here if needed: a v16 factor on the foes' build budget (`rpgFoeTuning(engine)`), the re-baseline's last resort.

## Decisions made

- **Measure with explicit v16 inputs, never the switch.** `SIM_ENGINE=16` on both balance files; the defaults keep
  printing v15's (today's) tables, byte for byte. "Today's" below means the same measurement on v15.
- **R1's kit is today's gear and accessories** (the main session's ruling, 2026-10-25). `BALANCE_KIT_V16` is v2's kit with
  the Orb on her **v16 first slot's** kind and today's supports: Brawler Greatsword Orb + Vampire Talisman; Mage Fire Orb +
  Siphon Amulet; Spell Blade **Katana** Orb + Vampire Talisman; Summoner **Dark** Orb + Siphon Amulet; Paladin Greatsword
  Orb + Thorn Talisman; Cleric Light Orb + Spring Amulet; her class's armor half in all five slots; today's Extra Stats
  (`onCurveStars`). It must equal `classPreset(c, 16)` (a test checks, as H60's did). The Orb on her first slot puts a
  hybrid's on her lead half, SB10's rule. **Never take presets or per-kind offense from
  `previews/balance-sheets.html`'s embedded data**: it predates SB10 and SB8. The docs' Tier 1 presets (a Bell, a Pendant
  or an Orb base form: weapon-progression §5.8, WP25 after SB10; class-progression §5.2) are R2's gear and H81's to measure.
- **No template.** The balance party has no Flourish (the foes are priced without templates, UT13); the base MP regen is
  on (a rule).
- **Class Rank on the real pace (SB16, CP32).** From v16 the balance Uma's Class Rank is `balanceClassRank(level)`: the
  highest rank whose total Class EXP (120 + 16 × rank to the next, from Rank 1) fits in twice her total Uma EXP to that
  level (2E a win, the same curve). It reads Class Rank 20 at Lv 13, 30 at 20, 40 at 27, 50 at 34 (CP §7.1; a test pins
  them). `BalanceOptions.classRank` still overrides; v15 keeps Class Rank = level, so H60's tables don't move.
- **Branches in the harness:** `BalanceOptions.lines` (her B trees); default all A (the anchor, CP15).
- **The Rift's v16 parties** are `riftGuidedBuild(front, 16)` (H66): the composition and each member's three weapons;
  `guided(front, 16)` builds them. The wrong party on a front is the other warded front's (Iron ↔ Arcane) as H51's.
- **The targets** (on Auto, first try, on curve unless said; 32 seeds where H60 and H63 used them):

  | # | Target | Measured as | Expected (stat-balance §12, the docs) |
  |---|---|---|---|
  | 1 | **Re-baseline** (item 1): every Tier 1 stage within 3 points of today's | `simulate` at Tier 1 Lv 10, 20, 30, 40, 50: the v16 balance party (Cleric) against the v15 one; the same with a Paladin | Within 3 points. Skill Ranks +5% at Lv 50 on the real pace (×1.014 over the tier); the real mover is the weak share (about half the acts weak, CP §15) |
  | 2 | **The mirror** (item 2, CP9): Spell Blade ÷ Summoner damage a turn ±5%; each 70/30 ± 5; Paladin ÷ Cleric healing and Barriers ±10% | H63's measures on the world's regular stages at Lv 10, 30, 50, and by context (one foe, the Horde, Iron, Arcane: ±15%) | The model's +6% → −3% was on R2's maps; R1's own number is this packet's to find |
  | 3 | **Weaknesses and shields** (item 3, CP8, SB6): rounds to the first Break within ±0.5 of today's; Auto cancels charged moves as today ±5 points; no single act Breaks a Duel boss | Regulars, sub-bosses and bosses at Lv 10, 30, 50: rounds to the first `break` cue; cancels ÷ charged moves; the guard rail (`guardRail(c, 16)`: her best act at Rank 5 with Pierce, and the 24 Limit Breaks) against the Duel's lowest v16 shield | Sub-bosses 5 and bosses 6 hold; regulars hold unchanged |
  | 4 | **Tree branches** (item 4, CP15, CP42): a B branch +10–20% over A in its context; any mix within ±5 points of all-A; Pierce +10–20% on long shields | Each class and kind, B against A: reach lines (Wave, Cascade, Rain, Reap, Bonded) on world waves of 4–6 foes; one-foe and heavy lines (Impale, Draw, Spike, Bolt, Mage Pierce, Heavy) on sub-bosses and bosses; more-hit lines (Combo, Pack) on shielded sub-bosses; the Spell Blade's Pierce on sub-bosses and bosses; mixed parties (one B a member) against all-A | Every B 10–20% in its context, behind A elsewhere |
  | 5 | **MP** (item 5, SB14, SB18): a region on Auto clears 10–12 of 12; the party's pace in a region's last four stages within ±10% of today's; no class's deep cast refunded by a round by the base regen alone | `run` over a region's twelve stages back to back with one Spring, at Lv 10, 30, 50: stages cleared and the rounds a stage in stages 9–12, v16 against v15, **with today's supports worn** (R1); then the same with no MP support worn (R2's preview, reported only); the refund check as a pure table: the base regen against her deepest skill's MP × her hand's MP, every class, Lv 1–50 | With the supports still worn, at or above today's pace; a healer's 76% of a deep cast the most from the regen alone |
  | 6 | **The Rift's Tier 1 fronts** (rift.md §11's bands): right parties ≥ 80% a stage, 60–70% a champion; wrong parties ≤ 30% a stage, ≤ 10% a champion; the Convergence about 50%; Echoes as §11; the guard rail | H51's and H60's tables with the v16 guided builds, three runs, 32 seeds | Inside the bands, or the closest with why (Iron's wrong party has been the one miss since H51) |
  | 7 | **Tier 2 and 3 worlds on R1's shape** (implementation.md "Between releases"): within 3 points of today's | `simulate` at Tier 2 Lv 10, 30, 50 (and Tier 3 Lv 10, 50 where the world builds it) on v16 against v15 | No term in R1 (Tier 2's is R4's); report |

- **Tuning order** (smallest moves first; re-measure after each step; v16 only):
  1. **Shields** (target 3): `rpgFoeShields(16)` sub-boss and boss, ±1 a step. Regulars' formation shields stay unless
     regulars miss by more than 0.5 rounds; then one step, logged.
  2. **The Summoner's Arms hand** (target 2): inside **0.46–0.50** (SB11's band). R1 has no Prowess, the cause SB11
     answered (stat-balance §5.1, cause 1: today's map gives the Summoner's Arms half no ATK, which is why H63 set 0.56),
     so if the mirror can't be met inside that band, widen it **up to 0.56** for v16 and say why; R2's H81 re-measures
     v17 on Prowess, where 0.48 is the target. Leans and the farewell stay. If it moves, update H64's two assertions of
     0.48 (`rules-v16.test.ts`, `v15-replays-live16.test.ts`) in the same commit.
  3. **B lines** (target 4): a B outside 10–20% in its context gets a v16 power factor in its `skill16` (±0.05 a step);
     Pierce's ×1.15 the same. Never a v15 def, never a line's shape.
  4. **MP** (target 5): SB18's share a depth (0.8% ± 0.1% a step: ±0.1% moves late-region pace about ±5%), then legs' MP a
     grade (today's armor); never an MP accessory, never the casters' MP lean.
  5. **The foe budget, last** (target 1, if the campaign is still more than 3 points from today's): one v16 factor on the
     foes' HP and DEF budget, `rpgFoeTuning(16)`; never the world's foes' shapes, roles or offense.
  6. **The Rift** (target 6): `RIFT_TUNING_V16` only, as H60 tuned v15's override (scales, shields, champions, the
     Convergence); the Duel's shields rise if the guard rail breaks ("the Duel shield rises, not the class's identity").
- **When a target can't be met** without breaking another, keep the closest and write why (H51's and H63's precedent);
  the owner prefers that to an open question.
- **Always-on checks** (fast, fixed seeds) in `world/balance-v16.test.ts` and `rift/balance-v16.test.ts`: `BALANCE_KIT_V16`
  equals `classPreset(c, 16)`; `balanceClassRank` at Lv 13, 20, 27, 34; the refund table (no class refunded by the base
  regen alone); Iron's v16 guided party wins Iron's stage 1; Arcane's loses Iron's champion; the guard rail for six classes
  at v16; the Spell Blade's split within ±5 on one fixed fight; every v16 guided build is legal. H51's, H60's and H63's
  checks stay as they are.
- **Docs: the measured numbers go into the docs** (follow-ups logged against their approved D-rows, values only):
  stat-balance.md §12 gains a "Measured, R1 (H71, D…)" note under items 1–5 (and §7.2 the MP stack with the supports);
  class-progression.md §4.4 (the Tier 1 shields as measured) and §2.2 (the Summoner's v16 hand, if it moved), each "Follow-up
  to H71 (D…)"; rift.md §11 a "Tier rework R1 (engine v16, H71, D…)" subsection with the tables beside classes v2's;
  implementation.md §3: "Built: H71 (D…)". The manual is unchanged (H72 carries the numbers); `pnpm docs:update` leaves no
  diff.

## Do

1. **The harness:** `BALANCE_KIT_V16`, `balanceClassRank`, `BalanceOptions.lines`, the v16 guided builds in
   `rift/balance-sim.ts`, `guardRail(c, 16)` (her best act at Rank 5, Pierce included; Limit Breaks unranked),
   `SIM_ENGINE=16` on both balance files. Check that every v15 table prints the same numbers with the defaults.
2. **Measure** targets 1–7 (`SIM=1 SIM_ENGINE=16 SIM_SEEDS=32 …`). Save the raw tables for the delivery (the main
   session's scratchpad or the pull request; never original names).
3. **Tune** in the order decided; re-measure after each step; stop when every target holds or is explained.
4. **Always-on checks** as decided.
5. **Docs** as decided; the D-row (fetch `main` first), listing every number changed with its before and after.
6. **Check it locally** with the local switch (never committed: `caps.ts` 16, `SAVE_SCHEMA_VERSION` 27, `toV27` chained,
   as H70 describes), on a scratch save of real outfits on curve from the CJS build (as H51 did): a v16 world stage on Auto
   at 390×844 in the app; Iron's guided party signs up and wins Iron's stage 1 through `startRiftFight`/`actInRiftFight`.
   Then undo the switch.

## Done when

- [ ] `pnpm lint && pnpm test && pnpm build` pass (the SIM tables are opt-in); main JS unchanged (the harness is test
  support). Say the number.
- [ ] Targets 1–7 are met, or the delivery says which is closest and why; the guard rail holds for six classes; the raw
  tables and a before/after table for every knob are in the delivery.
- [ ] v15's (today's) numbers print unchanged with the defaults; both replay fixtures stay green; no v15 number changed.
- [ ] stat-balance §12, class-progression §4.4 (and §2.2 if moved), rift.md §11 and implementation.md carry the results;
  the D-row is logged; `docs/game/` is unchanged and `pnpm docs:update` leaves no diff.
- [ ] The local check in step 6 was done and described, and the switch undone (`git diff` shows none). Nothing from the
  original games in git.
- [ ] Deployed green and https://uma-rpg.web.app/api/health shows the commit.

## Deliver

- **Claude, as a delegated worker:** a pull request from `feat/h71-r1-balance` with one commit,
  `feat(domain): R1's balance, measured and tuned on engine v16, dark (H71)`; the body lists every number changed and the
  measured tables. H70 edits the web at the same time; you may meet in `rift/fronts.ts` (its guided builds' screen
  helpers) or `save/sheet.ts` (don't touch it): rebase on whichever lands first. Fetch `main` before you push. The main
  session reviews and merges it, then watches the deploy.
- **Flag it done:** after the merge, a `docs(handoff): H71 done (D…)` commit deletes this file, sets H71 to Done with a
  Done row (the measured results in one paragraph, as H60's), and sets H72 to Ready if H69 and H70 are done. R2's H81
  starts from these tables.
