# H104 — Release 5's balance, dark: the masteries, Keen against Tempered against Evolved, the stack's ceiling, the pace with Tier 3's term

**uma-rpg · Claude · L · Needs: H99, H100, H101 (and through them H98) · Unblocks: H105**

> **H116 plan correction (D237): read [weaknesses-v2.md §7, WK8–WK10](../../design/tier-rework/weaknesses-v2.md#7-later-tiers-and-the-rift-wk8wk10) before measuring.**
> Run all Tier 3 campaign and coverage tables against WK8's live three-kind world lists. Do not reconstruct the retired
> one-kind/twin model, and do not change the Rift. Target 13's fixed answer counts are obsolete: report and pin the
> measured WK8 baseline, then tune only the existing Tier 3 non-weakness knobs.

## Why

Tier 3's numbers are drafts until fights set them ([stat-balance](../../design/tier-rework/stat-balance.md) §12, "final
tuning by fight simulation during implementation", D196; README §9.5's Tier 3 items). The analytic model priced
Tier 3's toolbox at **+88% an act** at Lv 50 and sized **Tier 3's term** (×1.08 → ×1.48 on HP and DEF, offense +10%,
bosses × 1.1) to bring a party's pace back within ±10% of Tier 1's, the model's edge **Tier 3 Lv 30 at 1.11**. The six
masteries are CP27's shapes with draft numbers, "+8–15% where it applies". This packet measures all of it with the
game's own rules on engine v21, tunes **Tier 3's knobs only**, in the order named below, and writes the results into the
docs. All of it is v21-only and Tier 3-only, so the live game and Tiers 1–2 don't move.

## Context (read first)

Code pointers are by file and function: Releases 1–4 move the lines. Re-read the code before starting.

- `CLAUDE.md`, `AGENTS.md`. **How a balance packet ran:** `git show 5dd9f08:docs/handoff/tasks/H60-classes-v2-balance.md`
  and D186; **H89's and H96's packets and D-rows** (Release 3's and 4's balance: the harness options they added, the
  interim Tier 3 term a₃ and b₃, why WP §3.7's structural fallbacks weren't applied, their always-on files
  `world/balance-v19.test.ts` and `world/balance-v20.test.ts`, the measured tables).
- H98's packet and D-rows (**Release 5's build decisions**), and H99, H100, H101's (every knob below is theirs).
- **The design:**
  - stat-balance **§3** (the ceilings, the tuned peak, the toolboxes against the foes, where the gain comes from, the
    fallback knobs, the terms), **§4.1** (the accessories' share, Tier 3 column), §5.1 (the mirrors' Tier 3 rows), §5.2,
    §6, **§7.2** (SB18), **§10** (shields), §11, **§12** (what the simulation must confirm), §14's SB4–SB8 and SB18 rows.
  - [weapon-progression](../../design/tier-rework/weapon-progression.md) §2.4 (WP31's ceilings and fallbacks), §3.6
    (WP12), **§3.7** (what each branch buys; the pair within ±10%; its fallbacks), §3.8 (Tier 3's picks, both sets), §4.3,
    **§5.7's Tier 3 table**, §5.8's Tier 3 presets, §13.
  - [extra-stats-progression](../../design/tier-rework/extra-stats-progression.md) §4.2 (Full against Split, Tier 3's
    column), §5.2, §8.4, §10.
  - [class-progression](../../design/tier-rework/class-progression.md) **§7.3** (the masteries and where each pays), §6.4,
    §2.2 and CP9 (the mirror, Paladin against Cleric), §15.
  - README §9.5 (the Tier 1 items and Tier 2's toolbox paragraph, which names Tier 3's pace and the moons' quarter).
- **The harness** (as Releases 1–4 left it): `packages/domain/src/world/balance-party.ts` (`BalanceOptions` with
  `engine`, tier, class branch and tips; `balanceMember`, `balanceParty`, `balanceStage`), `world/balance-play.ts`
  (`play`, `Played`), `world/balance.test.ts` (`simulate`, `run`; `SIM=1`, `SIM_ENGINE`, `SIM_LEVELS`),
  `rift/balance-sim.ts`, the coverage script.
- **The knobs** (all v21, Tier 3):
  - H100: `BATTLE_UNSTOPPABLE_FACTOR` 0.6, `BATTLE_RESONANCE_SHARE` 0.3, `BATTLE_SPELLBIND_FACTOR` 1.2,
    `BATTLE_MENAGERIE_PAIRS` 2 (and the lingering summon's farewell share), `BATTLE_LAST_STAND_USES` 1,
    `BATTLE_OVERFLOW_CAP` 0.1; the twelve branch capstones' power and MP; Tier 3's ten slots;
  - H101: Tier 3's row of `rpgTierTerm` (1.08, 0.40, the offense's 0.10, the boss tenth) and of `rpgTierShield`;
  - H98: Keen's ×1.7 in `rpgWeakMultiplier`;
  - H99: the Tier 3 step's shares (0.575, 0.85, 1.3, 0.85, 0.15, 0.25, 2.25%, 2.75%).

## Decisions made

- **Measure with explicit v21 inputs, never the switch.** `balanceMember` builds a **Tier 3** Uma on curve (lifetime
  level 100 + ℓ) at engine 21: §3.8's Tier 3 picks (branch 1's set; branch 2's from §3.8's second table), H99's Tier 3
  preset (three accessories at the on-curve grade, both weapon moons Full + Split, opened by level), the full map × 2.6,
  her class branch (1 unless a check says otherwise) with its focus and class skills, both lines A and B held with Power
  tips, ten equipped skills, and at Class Rank 50 (the real pace: Class Rank 50 at Lv 34, SB16) her capstones, her
  branch capstone in the master slot and her mastery. `balanceStage` takes version 21. **Every table H89 and H96 printed
  prints the same with the defaults**, and the v20 replay fixture stays green.
- **What each target means here** (on Auto, first try, on curve, Tier 3 at Lv 30 and 50 unless said):

  | # | Target | Measured as |
  |---|---|---|
  | 1 | **Each mastery +8–15% where it applies** (CP27) | Her contribution with and without her mastery, at Lv 40 and 50, in its context: **Unstoppable** the Brawler's damage a turn on Tier 3 sub-boss and boss stages (long shields); **Resonance** the Mage's damage a turn on boss stages (long fights); **Spellbind** the Spell Blade's damage a turn on boss stages with her twin pair (the Rune Knight's Lance and Thunder, the Blademaster's Katana and Dark); **Menagerie** the Summoner's damage a turn on waves of 3+ (squads, swarms); **Last Stand** the Paladin's support a fight (healing + Barrier absorbed + the hit it cancels, at the HP it would have taken) on boss stages, and KOs a fight; **Overflow** the Cleric's support a fight (her Overflow Barriers included) on waves and area-hitting bosses. Each also reported across the whole campaign |
  | 2 | **Keen against Tempered against Evolved** (WP9, WP §3.7) | Each weapon's three Tier 3 doors (Keen and Tempered on a Pure line, Tempered and Evolved on a Dual line), one member swapped at a time on the default party: damage per act and Breaks over Tier 3's four continents. **Each door within ±10% of the other door of its line across the campaign, and each best somewhere** (Keen on her kind's regions and bosses, Tempered on mixed regions, Evolved where the other partner's twins lean) |
  | 3 | **The stack's ceiling** (WP31, SB7): ×2.49 on one weak hit (steps 3–4); the tuned peak about **1.8×** the campaign's act | An exact factor check (below), with Spellbind reported beside it (×2.99, H100: a step 5 rule); then the tuned party (best picks, a tuned front's preset, Onslaught's first act) against the on-curve campaign act (the model: 1.84 for the party, SB §3.2). No Tier 3 Rift exists (T9): record the number for its doc |
  | 4 | **The pace with Tier 3's term** (SB4, SB5): rounds a fight within ±10% of Tier 1's at Lv 10–50 for regulars, elites and bosses; fully built within 10% too | `simulate` at Tier 3 Lv 10, 20, 30, 40, 50 against Tier 1 at the same tier level. The model: regulars 1.03 · 1.02 · 1.11 · 1.10 · 1.05, bosses 0.99 · 0.98 · 1.09 · 1.06 · 1.00; **its edge Lv 30 at 1.11** |
  | 5 | **The weapon moons a quarter of the toolbox the term prices** (EP16, SB §3.4) | The toolbox K by piece at Tier 3's Lv 50 (focus · weapon branches · accessories · weapon moons; the model 1.12 · 1.10 · 1.25 · **1.23**), each piece removed in turn; the moons' share of K about a quarter |
  | 6 | **Shields** (CP8, SB6): rounds to the first Break within ±0.5 of Tier 1's with bosses 10, sub-bosses 6 | By rank, Tier 3 against Tier 1 at the same tier level (the model: bosses −0.39, sub-bosses +0.11) |
  | 7 | **Accessories in Tier 3** (WP §5.7, README §9.5 item 7): every branch someone's best with the step, none the best in more than half of Tier 3's 24 class-and-context cells | §5.7's Tier 3 table re-run in fights (the model: the Great Orb and the Twin Orb 6 each, Onslaught 4, the Great Insignia 3, the Channel Pendant 2, the Great Pendant, Great Bell and Toll Bell 1 each) |
  | 8 | **Full + Split against Full + Full** (EP26, EP §4.2) | Each class's campaign act with both settings (the model: Full + Split ahead by 2.1–5.0 points for every class) |
  | 9 | **The Tier 3 mirrors** (CP9, SB §5.1): each hybrid 70/30 ± 5; Blademaster ↔ Warlock within ±5%; Rune Knight ↔ Conjurer reported | Damage per act and split on Tier 3's stages. The model: 71–73% physical and 67–68% magical; Light/Dark 0.95–1.04; the Ring mirror 0.87–0.97, R4's off-focus Katana (H96's) |
  | 10 | **Paladin against Cleric** (CP9, SB12) within ±10%, masteries on | Support a fight, Guardian ÷ Bishop and Templar ÷ Oracle, at Lv 50 with Last Stand and Overflow |
  | 11 | **Defense** (SB13): a regular's hit about 18.1% of an on-curve Brawler's HP at Tier 3's Lv 50 without the term's offense, about 20% with it | The foe's 100% hit against her HP |
  | 12 | **MP** (SB18, SB14): the Springs test in Tier 3 (skill MP ×2.4, class skills on): a region clears 10–12 of 12 and its last four stages within ±10% of today's pace; **the base regen is 4% of max MP a round at Class Rank 40 and stays 4% at Class Rank 50** (at most five depths: the main session's ruling, H100); Tier 3's Lv 10 MP lead about 1.20× Tier 1's | README §9.5 item 5's test at Tier 3's Lv 30 and 50 |
  | 13 | **Coverage** (WP12): 2.30 answers a regular with either healer; bosses 3.67 · 3.90 | H98's coverage script, re-run on the measured picks |

- **Tuning order** (smallest moves first; re-measure after each step):
  1. **The masteries' numbers, inside their shapes** (target 1): each constant H100 named, toward the middle of +8–15%.
     Shapes never change (CP27): Unstoppable stays a lighter halving, Resonance a weaker echo that never chips, and so on.
  2. **Tier 3's term** (target 4): the HP-and-DEF slope 0.40 within ±0.08 and the start 1.08 within ±0.04 (SB4's two
     constants); the offense's 0.10 and the boss tenth stay unless target 4's bosses alone miss, then the tenth within
     1.05–1.15. **Lv 30 may land at 1.11** (the model's edge) when moving the slope would push another level out; record
     it. A move updates H101's Tier 3 numbers on purpose, said in the D-row.
  3. **Keen ×1.7 → ×1.6** (WP31's third fallback, SB §3.5) only if Keen leads its line past ±10% (target 2).
  4. **The Tier 3 step's shares a step down** (WP §5.7's rule: "its per-grade values step down first") only for a form
     best in more than 12 of 24 cells (target 7).
  5. **Ten slots from Lv 1** (H100): if Tier 3's Lv 10–20 pace runs more than 10% fast because of them, Tier 3 takes
     H92's ramp (3 → 10 by Lv 40) instead.
  6. **Boss shields 10 ± 1** if target 6 misses (SB6).
  **Never:** Tier 1's or Tier 2's numbers (the focus's +15%, the Tier 2 shares, Tier 2's term, the hands and leans), the
  weapon moons' values (EP7's × tier), the partners, the caps, the owner's shapes, or Tier 1–2 foes. **WP §3.7's
  structural fallbacks** (one two-kind weapon for everyone in Tier 3; Dual from Tier 3 only; no branches) are the
  owner's approved rules, not knobs: not applied here, as H89 decided for Release 3; if target 2 misses after step 3,
  the delivery says which door leads and by how much.
- **When a target can't be met** without breaking another, keep the closest and write why, as H51 did for Iron's wrong
  party; the owner prefers that to an open question.
- **UT20** (the signature's dial) is not touched: it waits for the owner to ask after playing.
- **Always-on checks** (v21, fixed seeds, fast), in a new `world/balance-v21.test.ts`:
  - **the stack's factor:** one hit by a Tier 3 ally with a Keen weapon, her focus and an Onslaught Insignia at G10 with
    Tier 3's step on her wave's first act deals **×2.493** (± 0.5%) of the same hit with a base weapon, no focus and no
    Insignia on a foe not weak to it, the halving and statuses equal; with Spellbind on a Spell Blade's both-weak pair,
    ×1.2 more;
  - the default party on branch 1 wins a Tier 3 Lv 30 regular stage and a Tier 3 Lv 50 boss stage on Auto;
  - each mastery fires in a fixed fight built to trigger it (the cue appears, once for Last Stand);
  - the base regen at Class Rank 50 equals Class Rank 40's;
  - the guard rail at v21: no class's best act (capstones and branch capstones included) Breaks a lone Tier 3 boss
    (shield 10) in one act.
  Releases 1–4's always-on checks stay as they are.
- **Docs:** class-progression §7.3 gains a "Measured (H104, D…)" column for the masteries (the tuned numbers), §15 a
  Tier 3 line; weapon-progression §3.7 gains the Tier 3 doors' measured worth and §5.7's Tier 3 table a measured note;
  extra-stats-progression §5.2 the moons' measured share; stat-balance §12 the measured beside each expected number;
  README §9.5's Tier 2 paragraph "Tier 3 measured in H104 (D…)". The manual is unchanged (H105 carries the numbers into
  it; `pnpm docs:update` leaves no diff now).

## Do

1. **The harness:** the Tier 3 member and party at engine 21 as decided; check that every H89 and H96 table prints the
   same with the defaults.
2. **Measure** targets 1–13 (`SIM=1 SIM_ENGINE=21`, `SIM_LEVELS` while tuning). Save the raw tables in your delivery.
3. **Tune** in the order decided; re-measure after each step; stop when every target holds or is explained.
4. **Always-on checks** as decided, in `world/balance-v21.test.ts`.
5. **Docs** as decided; log the D-row (fetch `main` first). `pnpm docs:update` leaves no diff.
6. **Check it locally** with the local switch (never committed: `caps.ts` 20, `SAVE_SCHEMA_VERSION` 31, `toV31(world,
   tier)` chained, as H103 describes), on a scratch save from the CJS build with a Tier 3 world of real outfits on curve
   (as H51 and H60 did): a Tier 3 Lv 30 stage and a Tier 3 boss stage on Auto in the app at 390×844 (a desktop browser,
   never the iOS Simulator), a mastery's cue seen. Then undo the switch.

## Done when

- [ ] `pnpm lint && pnpm test && pnpm build` pass (the SIM tables are opt-in); main JS unchanged (the harness is test
  support). Say the number (gzip, of 230 KB).
- [ ] Every target is met, or the delivery says which is closest and why; every knob changed is listed with its before
  and after; the raw tables are in the delivery.
- [ ] H89's and H96's tables print unchanged with the defaults; Tier 1's and Tier 2's foe digests and the v20 replay
  tests stay green; no Tier 1 or Tier 2 number changed.
- [ ] The docs carry the measured results; the D-row is logged; `docs/game/` is unchanged and `pnpm docs:update` leaves
  no diff.
- [ ] The local check in step 6 was done and described, and the switch undone (`git diff` shows none). Nothing from the
  original games in git.
- [ ] Deployed green and https://uma-rpg.web.app/api/health shows the commit.

## Deliver

- **Claude, as a delegated worker:** a pull request from `feat/h104-t3-balance` with one commit,
  `feat(domain): Release 5's balance, measured and tuned on engine v21 (H104)`; the body lists every number changed and
  the measured tables. H102 edits the save at the same time; you share no files. Fetch `main` before you push. The main
  session reviews and merges it, then watches the deploy.
- **Flag it done:** after the merge, a `docs(handoff): H104 done (D…)` commit deletes this file, sets H104 to Done in
  `docs/handoff/README.md` with a Done row (the measured results in one paragraph, as H51's), and sets H105 to Ready if
  H102 and H103 are done.
