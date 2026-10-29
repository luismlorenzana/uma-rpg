# H131 — Classes v3's and Halls v2's balance on engine v19 (dark): Tier 0, the ladder, the mirrors, the volley, the Limit Breaks, the Rift

**uma-rpg · Claude · M–L · Needs: H126 (Classes v3 in the domain), H128 (the weapon shapes), H129 (the twenty Limit
Breaks) · Unblocks: H134 (the switch)**

## Why

Classes v3 (D240) and Halls v2 (D241) change what a fight is made of: five Tier 0 classes and a new Class Rank pace,
two mirrored hybrids, the volley and the double, re-paired twins, twenty Limit Breaks with their own power and a class
scale, and four new Rift builds. H126, H128 and H129 build them dark on engine v19 with the designs' draft numbers. This
packet **measures them with the game's own rules on the simulation the earlier balance packets used** (H60, H71, H81,
H115), **against engine v18**, tunes **only the knobs the designs name, in their order**, each a v19 value so no v18 fight
moves, and writes the measured numbers into both designs. Nothing becomes visible: H134 switches it on.

## Context (read first)

- `CLAUDE.md`, `AGENTS.md`; the D-rows of **H126, H128 and H129** (their build decisions: the names this packet uses for
  the Tier 0 curve and power, the hands with a lead half, the volley's constants, the Limit Breaks by generation, the
  class scale, `rpgRework('classes')`). **Where this packet names a function or constant H126–H129 created, the name in
  their packets wins.**
- **The designs:** [classes-v3.md](../../design/classes-v3/classes-v3.md) **§12 (S1–S10, CV34)**, §2.2–§2.3 (Tier 0's
  power and curve), §2.6 (promotion at Rank 10; the depths table), §3 (the eight classes' hands, leans and splits), §4.1
  (the five shapes and the act-worth table), §10.1 (the Rift's four builds and the Duel's rail), §11 (the balance
  party and the mirrors); [halls-v2.md](../../design/classes-v3/halls-v2.md) **§3 (the formula, the ladder, §3.4's order
  and §3.5's change)**, §2.3 (HV3: each class's home seats), §5.3, **§11's HV-D**, HV5, HV15.
- **How a dark generation is measured** (explicit engines, never the switch): H81's packet (`git show
  a0165ac~1:docs/handoff/tasks/H81-balance-economy.md`), H71's and H81's Done rows in
  [handoff-history.md](../../archive/handoff-history.md), and H115's file, `world/balance-v18.test.ts`.
- **The harness** (lines on `main`, `b9ce7c5`; H126–H129 may move them):
  - `world/balance-party.ts`: 28 `BALANCE_PARTY`; 83–92 `balanceClassRank` (today's pace: Rank 10 at Lv 7); 113–125
    `BalanceOptions`; 139–165 `v17Member` (graded, `classPresetV3(c, engine)`, `armorHalf(classId)`, `mapPoints`);
    171–227 `balanceMember`, **198 her Learner seat `${classId}-1`** (no v19 seat for seven of the thirteen classes);
    229 `balanceStage`.
  - `world/balance-measure.ts`: `logFight` (101: a Limit Break's damage into `limitPhysical`/`limitMagical`), `perTurn`,
    `byClass`, `physicalShare`, `castsOf`; `world/balance-play.ts` (`play`).
  - `world/balance-v18.test.ts` (H115: `stagesAt`, `partyAt`, `playInto`, `firstBreak`, `regionRun`; the v15/v17/v18
    tables) and `world/balance.test.ts` (`simulate`, `SIM_ENGINE`).
  - `rift/balance-sim.ts`: 32 `guided` (36: a respec at Class Rank 1), 38 `partyOf`, 115 `railFight`, 150 `guardRail`,
    206 `limitRail`, 288 `guardRailV16` (**318: the lingering farewell keyed on `classId === 'summoner'`**, and the
    pair's credit by Arms and Tome half), 338 `duelShields`; `rift/balance.test.ts` (H51's tables, `SIM_ENGINE`; the
    Echoes) and `rift/balance-v17.test.ts` (the healers' `sustain`, `playWorldBosses`, `withHealer`).
  - `rift/fronts.ts`: 33 `PARTY_V2`, 41 `riftParty`, 47 `BUILDS_V16`, 58 `riftGuidedBuild`, 86–139 `RIFT_TUNING`, 191
    `RIFT_TUNING_V17` (v17 and v18), 199 `riftTuning`; **H126 adds `PARTY_V19` and `BUILDS_V19`** (CV §10.1's four
    builds, read from v19 by `riftParty` and `riftGuidedBuild`).
  - **H126's names this packet reads** (its "Names other packets read"): `RPG_TIER0_CLASSES` (`['recruit', 'duelist',
    'acolyte', 'caller', 'apprentice']`), `rpgIsTier0`, `rpgClasses(19)`, `RPG_TIER0_POWER` and `RPG_TIER0_MODEL`
    (`rpg/class-tree.ts`), `rpgClassExpToNext(classId, rank, engine)` (Tier 0's 2 × (120 + 16 × rank)), `RpgHand.lead`
    and `.extra`, `rpgOpenPower`, `classPresetAccessory(classId, engine)`, and its seven new rows in
    `world/balance-party.ts`' kits.
  - **H128's and H129's names:** `RPG_VOLLEY` (`{ target: 0.8, splash: 0.35 }`) and `RPG_LINE_B_POWER_V19` in
    `rpg/catalog.ts` (H128 hands the B lines' factors to this packet); the splash chips a weak foe's shield from v19
    (H128); `heroLimitIds(engine)`, `heroSeatHome(id, engine)`, `heroHalls(engine)` (`rpg/hero-id.ts`),
    `heroLimitScale(classId, engine)`, `HERO_LIMIT_SCALE`, `HERO_LIMIT_MAX_HITS` (10) and `heroLimitSkills` (`rpg/heroes.ts`);
    H129 already points `limitRail`'s callers at `heroLimitIds(engine)`.
  - The knobs' homes: `rpg/rules.ts` 241 `handsOf` (H126's v19 rows); `RPG_TIER0_POWER` and the Tier 0 curve (H126);
    `RPG_VOLLEY` and `RPG_LINE_B_POWER_V19` (H128); `HERO_LIMIT_SCALE` (H129); `rpg/campaign/enemies.ts` 13–26 `RPG_FOE_TUNING` and
    `rpgFoeTierBudget`; `rpg/campaign/chapters.ts` 121 `rpgChapterReach`; `world/capital.ts` 20 `capitalChapter` (the
    capital's Finals).

## Decisions made

### The targets, exact (CV34 and HV-D)

All on Auto, first try, on curve (`gear`, `stars`, `heroes`), Tier 1, **v19 against v18 on the same seeds**.

| # | Check | Target | Measured as | Knobs, in order (v19-only) |
|---|---|---|---|---|
| **S1** | Tier 0 through continent 1 | Win rate within ±5 points and rounds within ±1 of v18's balance party, each stage kind | The five Tier 0s on defaults (Recruit, Duelist, Acolyte, Caller, Apprentice) at Class Rank = Uma Lv, every continent 1 stage at Lv 1–10 and the capital's Finals (both routes); v18's party at the same levels | 1. Tier 0's power row (`RPG_TIER0_POWER`): one factor on 1.52 → 2.20, inside ×0.9–1.1. 2. A v19 HP scale on continent 1's regular foes (lifetime Lv 1–10), inside 0.85–1.15 |
| **S2** | The ladder | Depths 2–5 at Lv **10 · 16 · 22 · 29**, Rank 50 at 36; never after `rpgChapterReach` (2 from Lv 10, 3 from 20, 4 from 30, 5 from 40) | `balanceClassRank(level, 19)`, always on | The Tier 0 curve, 2 × (120 + 16 × rank). **If it moves, the reset's refund moves with it** (CV26's "first 1,800 twice" is the new ladder's 3,600 less the old 1,800): name the new number in the Done row for H130 and H134 |
| **S3** | The Spellblade mirror | Tome ÷ Arms Spellblade damage a turn within ±5% at Lv 10–50; each split 70/30 ± 5 her way | The balance party, then the Tome Spellblade in the Arms Spellblade's place; `perTurn`, `physicalShare`; world stages | The Tome Spellblade's Arms hand (0.44), then her Tome hand (0.72) |
| **S4** | The Summoner mirror | Arms ÷ Tome Summoner within ±5%; each 70/30 ± 5 | The Arms Summoner in the Tome Summoner's place | The Arms Summoner's Tome hand (0.50) |
| **S5** | The pairs | Summoner ÷ Spellblade 90–110% (v18: 88–110%) | Tome Summoner ÷ Arms Spellblade, and Arms Summoner ÷ Tome Spellblade in the mirror party (CV §11) | The Summoners' lead hand (0.62, both) |
| **S6** | The volley | The Brawler's and the Sorcerer's damage a turn **without Limit Breaks** within ±5% of v18 on regular stages; the volley the best line A act on two foes; the Bow's and Dark's trees' share of a holder's damage on 1-, 3- and 5-foe stages printed | The balance party's regular stages; the act-worth check (decision 8); stages with their first wave cut or padded to n foes (decision 9) | The splash (0.35, inside 0.30–0.40), then the tapped foe's share (0.8). **Shared:** Halls v2's two volley seats read the same constants |
| **S6 lines** | The moved B lines (CV14) | The Brawler's Bow Barrage and the Sorcerer's Dark Barrage beat their line A on sub-bosses and bosses, and the Sorcerer's Light Pierce on shielded sub-bosses; each stays at or below A elsewhere (CP15; H71's Target 4) | H71's line measure (`world/balance-v16.test.ts`, Target 4) at 19, each line alone on B | `RPG_LINE_B_POWER_V19` for those three only, inside 0.85–1.15 (H128 hands them over; the other B lines keep v16's factors) |
| **S7** | Paladin ÷ Cleric sustain | ±10% | H81's `sustain` (the healer's mends and the Barrier absorbed a fight) with either healer: the balance party on world stages at Lv 10, 30, 50 and the Lv 50 bosses | None: a miss is recorded |
| **S8** | The Rift's four builds | Each front's guided build within ±5 points of v18's win rate, by stage group (1–4, 5–8, 9–11, 12) | `guided(front, 19)` on H126's builds (decision 5), Lv 50 on curve, three runs; v18's `guided(front, 18)` | `RIFT_TUNING_V19`, by front: `scale` (Iron, Arcane), `duel` and `horde` hp and offense, then `champions`, as H71 and H81 tuned |
| **S8 / HV-D rail** | The Duel's guard rail | Every class's best single act and best Limit Break **≤ 10 chips**; the Duel's shields stay 13–15 | `guardRail(c, 19)` (decision 6) for all thirteen classes, the twenty Limit Breaks at full strength | Shields move only if an act passes 12 (none should: HV15 caps a Limit Break at 10 hits on one foe) |
| **S9** | Echoes | The Lv 45 Echo still won with one fresh Uma in each front's build | `guided(front, 19, 0)`, the respec at **Class Rank 10** (a fresh Tier 1 class opens there) | None |
| **S10** | Shield chips | Rounds to each rank's first Break within ±0.5 of v18 | `firstBreak` (H115's), world stages Lv 10–50 | The splash first (S6's band); since a share moves damage, not chips, a chip miss goes to: a v19 rule that **a splash hit chips no shield** |
| **H1** | Limit Breaks by class | Each class's Limit Break damage a fight, v19 ÷ v18, **within ±5% of §3.5's change** | Decision 10; the two new classes against their mirrors' v18 | Her class's scale: 1 inside 0.95–1.05; the healers' 0.75 inside 0.70–0.80 |
| **H2** | Party win rates | Within **±3 points** of v18's, each stage kind, Lv 10–50, with the Cleric and with the Paladin | The balance party v19 against v18, then both with the Paladin in the Cleric's place (H115's swap) | The class scales, read last (decision 11) |

### Build decisions (log them in the D-row)

1. **Explicit engines, never the switch:** `BalanceOptions.engine: 19`, `balanceStage(…, 19)`, `riftBattleInput(…, 19)`,
   `SIM_ENGINE=19` on `world/balance.test.ts` and `rift/balance.test.ts`. v15–v18's tables print as before. *Why:* H60's
   rule; the live game stays v18 until H134.
2. **The v19 member** (`balanceMember` at 19): her class's defaults (H126's `rpgDefaultWeapons(c, 19)`, the Tier 0s'
   included); graded on curve by the v17 path (`v17Member`), her form from `classPresetV3(c, 19)` (H126's
   `classPresetAccessory`; a Tier 0 her `RPG_TIER0_MODEL`'s), armor's half and Prowess from H126's rules (a Tier 0's by
   thirds of her slots); **her Learner seat her class's first home seat**: the first of `heroLimitIds(19)` whose
   `heroSeatHome(id, 19)` is her class (Brawler `brawler-1`, Sorcerer `mage-1`, Arms Spellblade `spellblade-1`, Tome
   Spellblade `spellblade-3`, Arms Summoner `summoner-1`, Tome Summoner `summoner-3`, Paladin `healer-1`, Cleric
   `healer-3`); a Tier 0, who has no home seat, her family hall's seat 1 (Recruit `brawler-1`, Duelist `spellblade-1`,
   Acolyte `healer-1`, Caller `summoner-1`, Apprentice `mage-1`); her Bond by level as today (197). To v18
   `${classId}-1`, unchanged. *Why:* HV3's seat order
   makes seat 1 of a class's two her own; one fixed rule keeps v18 and v19 comparable seat for seat (§3.5's pairs).
3. **The parties:** the balance party is `BALANCE_PARTY` on its v3 names (Brawler, Sorcerer, Arms Spellblade, Cleric,
   Tome Summoner; CV §11); the **mirror party** swaps in `tomeblade` and `armsummoner`; the **Paladin party** is CV
   §11's Brawler, Sorcerer, Tome Spellblade, Arms Summoner, Paladin (printed beside); the **Tier 0 party** is
   `RPG_TIER0_CLASSES` (Recruit, Duelist, Acolyte, Caller, Apprentice).
4. **`balanceClassRank(level, engine = BATTLE_ENGINE_VERSION)`:** to v18 as today. From v19 a **Tier 0 is at Rank =
   min(Lv, 10)**; a **Tier 1 class** is at Rank 10 at Lv 10, then on today's curve with what she earns past it: the
   highest rank whose total from Rank 1 fits in 2 × her Uma EXP − 1,800 (the Tier 0 took 3,600 of it, where the old
   Ranks 1–10 took 1,800). Below Lv 10 a Tier 1 member is never built (S1 uses the Tier 0 party). *Why:* CV5 and §2.6's
   table, and S2 asserts it.
5. **The Rift's v19 builds are H126's** (`PARTY_V19`, `BUILDS_V19`: CV §10.1's table, the twenty holding Brawler 2,
   Sorcerer 2, Arms Spellblade 3, Tome Spellblade 3, Arms Summoner 3, Tome Summoner 3, Paladin 2, Cleric 2). This packet
   plays them through `guided(front, 19)` and tunes only `RIFT_TUNING_V19`; **a build is not a knob** (it is the
   owner-approved composition, CV23). *Why:* CV-C's "the four Rift builds" are measured here; H126 already wrote them.
6. **The guard rail on v19** (`guardRailV19` in `rift/balance-sim.ts`): v16's rail at Class Rank 50, with **a pair's
   credit by H126's lead half** (`rpgHand(…, 19).lead` and `.extra`: the extra hit on the lead, whichever channel leads);
   **the lingering farewell from either Summoner's lead half** (the `classId === 'summoner'` branches read the hand's
   `linger`, not the id); a **Tier 0** (`rpgIsTier0`) **as a one-half class**, her one skill on each of her three weapons
   at Rank 10; the Limit Breaks over **v19's twenty** (`heroLimitIds(19)`) at her class's scale; `railOthers` from v19
   (Brawler, Sorcerer, Arms Spellblade, Tome Summoner); the table also checks every Limit Break against
   `HERO_LIMIT_MAX_HITS`.
7. **The measures** (`world/balance-measure.ts`): each Uma's Limit Break casts and the foes standing at each (for H1);
   damage by tree, from `casts`' node ids (S6's shares).
8. **The act-worth check (S6, always on):** a member without gear (`gear: false`, so every kind hits from the same
   offense) casts one line A skill at depth 3 of each shape (the Brawler's Greatsword, Axe, Lance, Katana and Bow; the
   Sorcerer's five) on n = 1–6 identical unweak foes with HP no act can take; its total damage ÷ the Greatsword's (Fire's)
   on one foe matches §4.1's table within ±0.03 (the scatter averaged over 16 seeds), and the volley is the best of the
   five at n = 2. *Why:* the table is the design's promise; the engine proves it without a fight's noise.
9. **1-, 3- and 5-foe stages** (S6's printed shares): each Lv 30 and Lv 50 regular stage with its first wave cut to its
   first n foes or padded with copies of its last, other waves dropped.
10. **H1's "§3.5's change", from the data:** the measured ratio (her Limit Break damage a fight, v19 ÷ v18) against the
    analytic one, the same ratio of her casts' **worth**: a cast's power × her class's scale (v18: her class's power) ×
    the sum of its parts' shares × their shape at the foes standing when she cast (one foe 1, random foes 1.05, every
    foe 0.55 × n, a volley `RPG_VOLLEY.target` + `RPG_VOLLEY.splash` × (n − 1)), read from each generation's
    `heroLimitSkills`. Within ±5%; the gap
    between the two is what weaknesses, Breaks, offense and overkill do. The Tome Spellblade against the Spell Blade's
    v18, the Arms Summoner against the Summoner's. *Why:* §3.5 compares seat with seat; the Summoner Circle's sweeps
    change with the foe count, which a fixed ratio can't say.
11. **The run order** (inner rules first, since each feeds the next): S2 (the pace every member reads) → S6, S6's lines
    and S10 (the shapes) → H1 (the Limit Breaks) → S3, S4, S5 (the hands) → S1 (Tier 0) → S7 → S8 and the rail → S9 → **H2 last**:
    if H2 misses, the scale of the class whose H1 ratio departs most moves first, inside its band; a miss no scale
    explains is recorded with its numbers (it belongs to a shape or a hand). A knob moved late re-runs the items before
    it that read it. The delivery's numbers are one final run at `SIM_SEEDS=32`.
12. **Tuning rules:** only the knobs above, in their order, each a v19 value read by the fight's version or the
    generator's engine, so a v18 fight never moves. **Never** a Limit Break's own power (§3.4's ladder is the owner's
    order), a shape, Tier 0's slots or skill rule, an amount or a cost. A target that can't be met without breaking
    another keeps the closest, with why, as H51, H60 and H81 did. **The volley stays one:** the halls' `brawler-4` and
    `mage-4` read `RPG_VOLLEY` (H128, H129), so tuning the splash moves both.
13. **Not measured:** Tier 2 and 3 worlds (re-planned after hardening, D238) and templates (unchanged rules; the
    balance party has none, XR12).
14. **The docs get the numbers:** classes-v3.md §12 gains a "Measured (H131)" column and the line "Built in H131 (D…),
    live from H134." (H126's convention); halls-v2.md §3.2 and §3.5 one line each, "Measured by H131 (D…): …"; each moved
    constant's comment says its before, after and why (the style of `rpg/rules.ts` 225–244). **No manual change** (H134
    writes it); `pnpm docs:update` leaves no diff.

## Do

1. **The harness:** decisions 2–4 and 6–9 (`world/balance-party.ts`, `world/balance-measure.ts`,
   `rift/balance-sim.ts`); `RIFT_TUNING_V19` in `rift/fronts.ts` only if S8 moves it.
2. **Run, tune, run again** in decision 11's order; keep each knob's before and after.
3. **Tests:**
   - `world/balance-v19.test.ts` (new). Always on: `balanceClassRank(L, 19)` (Tier 0 Rank = Lv to 10; depths 2–5 at Lv
     10, 16, 22, 29 and Rank 50 at 36; each depth at or before `rpgChapterReach`'s level) and `balanceClassRank(L, 18)`
     unchanged; the act-worth check (decision 8); `brawler-4`'s and `mage-4`'s splash and tapped-foe shares equal the
     weapon volley's constants; `classPresetV3(c, 19)` is the v19 member's form for all thirteen; every v19 member's
     Learner seat is a v19 seat; a Tier 0 party wins a continent 1 Lv 5 stage and the v19 balance party a Tier 1 Lv 30
     stage on Auto. With `SIM=1`: S1–S7, S10, H1 and H2 print beside v18; at `SIM_SEEDS=32` the bands met are asserted
     once printed (H63's practice).
   - `rift/balance-v19.test.ts` (new). Always on: every v19 guided party the harness builds is legal (three weapons by
     her slots, one healer, the engine accepts the fight) with H126's builds' weapons; every class's rail (all thirteen)
     is ≤ 10 chips, below the lowest v19 Duel shield; Iron's build wins Iron's stage 1. With `SIM=1`: S8, the rail table,
     S9.
   - Every existing test passes unchanged; the v14–v18 replay tests stay green (H126's v18 fixture); v15–v18 tables
     print as before.
4. **Docs:** decision 14.
5. **Check it locally** with the switch flipped on a scratch copy, never committed (H134's three lines): a continent 1
   stage on Auto with the Tier 0 party, a Lv 50 stage with a Brawler's Bow volley and a Sorcerer's Light double, a Duel
   stage with the v19 build, at 390×844; describe what you saw (screens H120–H133 may still be dark: the fight screen is
   what matters here).
6. **D-row:** fetch `main` first; every target's result, met or missed with numbers, and every knob moved with its
   before and after.

## Done when

- [ ] `pnpm lint && pnpm test && pnpm build` pass; the main JS is under 230 KB gzip (about 223.5 before H126; say the
  number).
- [ ] The tests in step 3 pass; v15–v18's tables print as before; every replay test stays green.
- [ ] Every target (S1–S10, H1, H2, the rail) has its measured result in the D-row and in its design doc, met or missed
  with why; every knob moved is v19-only and within its band.
- [ ] `docs/game/` is unchanged and `pnpm docs:update` leaves no diff.
- [ ] The local check in step 5 was done and described. Nothing from the original games in git.
- [ ] Deployed green and https://uma-rpg.web.app/api/health shows the commit.

## Deliver

- **Claude, as a delegated worker:** a pull request from `feat/h131-classes-v3-balance` with one commit,
  `feat(domain): Classes v3's and Halls v2's balance on engine v19, dark (H131)`; the body tables each target, its
  measured result and its knob. Fetch `main` before you push. Merge it yourself after green CI (the main session doesn't
  wait for the owner), then watch the deploy (`gh run watch <id> -R luismlorenzana/uma-rpg --exit-status`) and check
  health.
- **Flag it done:** a `docs(handoff): H131 done (D…)` commit deletes this file, adds a Done row with **the numbers H134's
  manual needs** (the hands, the splash and tapped share, the class scales, Tier 0's power, any v19 foe HP scale, the
  Rift's v19 tuning, the rail's best act and Limit Break), and sets H134 Ready if its other needs are done.
