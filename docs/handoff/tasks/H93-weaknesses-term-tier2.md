# H93 — Tier 2's weakness-v2 coverage, boss shields 9, full term and Rift tuning (dark)

**uma-rpg · Claude · M · Needs: H91 · Unblocks: H96, and H95's party hint (and through them H97)**

> **H116 plan correction (D237): read [weaknesses-v2.md §7, WK8–WK10](../../design/tier-rework/weaknesses-v2.md#7-later-tiers-and-the-rift-wk8wk10) before this packet.**
> Weaknesses v2 is already live on engine v18 and does not narrow in later tiers: every world regular, elite and boss
> keeps three dealt weaknesses, drawn as WK8 specifies. The Rift stays on its own WK9 rules at every tier. This packet
> must not rewrite either generator or introduce one-kind/twin lists. It only builds Tier 2's term, shields, guided
> branches and non-weakness front tuning, and adds regression coverage that the v18 WK8/WK9 lists remain unchanged.
> All one-kind, twin-list, biome-lean and fixed `2.0 answers` instructions below are superseded; measure coverage from
> the live three-kind lists and record the new baseline rather than forcing the retired target.

## Why

Weaknesses v2 is already live before Tier 2: every world foe has three dealt weaknesses under WK8, and later tiers do
not change them. Tier 2's depth comes from its weapon branches, class focus, term and shields—not a narrower list.

The same release prices Tier 2's toolbox in the foes. The stat balancing (D196) found the approved tools compound to
**+51% an act** at Tier 2's Lv 50 (the focus +12%, the weapon branches +5%, the accessories +13%, the weapon moon +14%)
and sized one term: **HP and DEF +27% by Lv 50, offense +10%, bosses × 1.1 on top** (SB3, SB5), with **boss shields 9**
(SB6) because a Dual's partner adds multi-hit answers. R3's balance (H89) priced its tools' share; this packet sets the
term whole, for v20.

And the Rift: its Tier 2 fronts take CP7's Tier 2 column and tier2-world's Z9 tests, rewritten for the tools that exist
now (branches, Break tips, the focus, the weapon moon), with guided builds that carry each member's class branch. CP41's
pairings check closes it. All of it is generator data behind engine v20, dark until H97.

## Context (read first)

Code pointers are by file and function: Releases 1–3 move the lines. Re-read the code before starting.

- `CLAUDE.md`, `AGENTS.md`, H91's D-rows (R4's build decisions: tier 2 and later only; until R5 Tier 3 worlds take
  Tier 2's lists and shields, and R3's interim term with R4's parts; the group names).
- **The design:**
  - [weaknesses-v2.md](../../design/tier-rework/weaknesses-v2.md) **§7, WK8–WK10** (later worlds keep three dealt
    weaknesses; the Rift stays on its own rules), [class-progression.md](../../design/tier-rework/class-progression.md)
    **§4.3** (CP7's Tier 2 column), **§4.4** (CP8's shields per tier), §4.5 (the checks), §2.3 (the
    Rift's guided builds; "from Tier 2 a guided member also takes the focus her build leans to"), **§7.2's pairings
    (CP41)**, the three drawn parties and their boosted answers, §16's CP6–CP8, CP41.
  - [stat-balance.md](../../design/tier-rework/stat-balance.md) **§3.3–§3.6** (the toolbox, the terms, bosses × 1.1),
    **§10** (shields against answers: bosses 6 · 9 · 10), §14's SB3, SB5, SB6, SB7.
  - [tier2-world.md](../../design/tier2-world.md) §4 (Z2: shields +1 a foe in Tier 2), §6 (Z4's shape, superseded in
    size by SB3), **§12 (Z9: one added test a front)**; the tier-rework README's history table rows for Z2, Z4 and Z9
    ("fronts test weapon branches, Break tips, the focus and the weapon moons").
  - [rift.md](../../design/rift.md) §5 (fronts, wards, locks, stages), §11 (the bands).
  - [weapon-progression.md](../../design/tier-rework/weapon-progression.md) §3.6 (WP12: the default party answers a
    Tier 2 regular 2.0 times with best picks).
- **What Releases 1–3 built** (their packets and D-rows; use the names the code has):
  - H66: the twins (`RPG_TWIN_SETS`, `rpgTwinsOf(signature, slot)`, `rpgAnsweredTwinSets` in `rpg/kinds.ts`); the
    generators take an engine (`regionChapter(region, roster, engine)`, `rpgCampaignChapter(…, engine)`,
    `capitalChapter(…, engine)`); the shields' home `rpgFoeShields(engine)` in `rpg/campaign/enemies.ts`; the Rift's
    `riftTuning(16)`, `waveWeaknesses(…, engine)` and the guided builds `riftGuidedBuild(front, engine)` (five `{ classId,
    weapons }`); `world/coverage-v16.test.ts`.
  - H83: **R3's build decisions 3 and 4** (weaknesses stay twins until this packet; R3 ships the term's HP and DEF share
    only, R4 completing it); `battleWeakFor`; `world/coverage-v19.test.ts` (2.00 answers a Tier 2 regular with best
    picks, computed on CP6's lists).
  - H89: the term on HP and DEF by stage and tier (Tier 2 `1 + a₂ (ℓ − 1) ÷ 49`, Tier 3 worlds `b₃ + a₃ (ℓ − 1) ÷ 49`,
    no offense part, no boss factor), **Tier 2's shields brought forward to CP8's numbers** (regulars 3–4, sub-bosses 7,
    bosses 9, by stage `t2Weapons`), the guided builds' Tier 2 tools, `riftTuning(engine, tier)`. Read its D-row for the
    measured a₂, b₃, a₃ and whether Z9's added tests are already in the Rift's Tier 2 shapes.
- **The code:**
  - `world/world.ts`: `stageWaves` (its `weaknesses(signature, slot, rank)` and `role(slot)`; the formations'
    shields, `WORLD_FORMATIONS`, `WORLD_ESCORT`, `ELITE_ASSISTANTS`), `regionChapter`; `world/capital.ts`
    (`capitalChapter`, the Finals); `world/biomes.ts` (each biome's roles); `rpg/campaign/chapters.ts` (its own
    `weaknesses`).
  - `rpg/campaign/enemies.ts`: `RPG_FOE_TUNING` (H89's term rows), `rpgFoeShields`, `rpgFoe` (HP and DEF from the
    budget, offense from the hit share), `rpgFoeTierBudget`, `rpgFoeCurveLevel`, the `ROLE` shapes (DEF against M.DEF).
  - `rift/fronts.ts` (`RIFT_FRONT_SPECS`, `riftFrontSpecs(engine)`, `riftParty(front, engine)`, `riftGuidedBuild`,
    `riftTuning(engine, tier)`, `riftShape`, `wardShape`, `duelShape`, `hordeShape`); `rift/generate.ts`
    (`waveWeaknesses`, `riftFight`, `riftBattleInput`).
  - `world/tier1-foes.test.ts` (the Tier 1 foe digest: it must not move; its pattern is this packet's Tier 2 digest).

## Decisions made

- **Tier 2's lists do not change** (WK8), in worlds of tier 2 or more:

  | Foe | Weak to |
  |---|---|
  | **Regulars and the elites' Keys** | Her three dealt weaknesses from WK8 |
  | **Sub-bosses** (an elite's, a capital's) | Her three dealt weaknesses from WK8 |
  | **Bosses** (a region's, the capitals' Finals) | Her three dealt weaknesses from WK8 |

  Role and rank do not narrow the list. The region ring lead still determines the signature used by WK8; Light/Dark
  remains the dealt ring and does not become an extra weakness.
- **Locks** need nothing new: a charged move's locks are drawn from her WK8 list; the Duel stays on WK9 (CP8).
- **Shields, Tier 2** (CP8, SB6, Z2's floor): **H89 already brought them forward** (regulars 3–4, that is Tier 1's
  + 1; sub-bosses 7; bosses 9, under `t2Weapons`), because R3's Duals raised a twin-weak foe's answers. They stay CP8's
  numbers for the live WK8 lists: v20 reads the same Tier 2 row through `rpgFoeShields` (its engine and tier
  arguments, as H66 and H89 left them). This packet writes no new shield value; if H89's measured row differs from
  regulars Tier 1's + 1, sub-bosses 7, bosses 9, v20 takes CP8's and the delivery says so. H96 re-measures rounds to the
  first Break with the live three-kind lists and may move bosses 9 ± 1 (SB6).
- **Tier 2's term, whole** (SB3, SB5; Z4's shape): H89's term in `RPG_FOE_TUNING` gains a v20 row, read by one
  function (`rpgTierTerm(tier, curveLevel, rank, engine)`; keep H89's name if it gave one), which `rpgFoe` applies, ℓ
  the tier level:
  - **HP and DEF** × (1 + **0.27** (ℓ − 1) ÷ 49): ×1.00 · 1.05 · 1.10 · 1.16 · 1.22 · **1.27** at Lv 1 · 10 · 20 · 30 ·
    40 · 50 (H89's a₂ becomes SB3's 0.27);
  - **offense** × (1 + **0.10** (ℓ − 1) ÷ 49): ×1.10 by Lv 50 (new at v20: it prices the healers' focus);
  - **bosses' HP and DEF × 1.1** on top, rank `boss` (new at v20).
  It multiplies the foe's HP, DEF and M.DEF after the build budget, and her offense after the hit share, so a foe at
  Tier 2 Lv 50 reads `budget₂(50)` with the term, the Rift's foes included. **Keyed by engine:** v19 keeps H89's row,
  so the live game doesn't move before the switch. **Why here, though H83 wrote "H96 completes it":** the plan gives the
  term's data to this packet (the foes' generator) and its measurement to H96, which may move 0.27 by ±0.05 (SB3's knob);
  the offense part and the boss tenth stay.
- **Tier 3 worlds until R5** (R4's build decision 2): they keep H89's interim HP and DEF term (`b₃ + a₃ (ℓ − 1) ÷ 49`)
  and gain v20's offense part and bosses' tenth; H96 re-sets a₃ so their pace stays within ±10% of Tier 1's with R4's
  tools on. R5's H101 replaces the row with SB4's.
- **The Rift's Tier 2 fronts** (CP7's Tier 2 column; Z9 rewritten), for a run in a tier 2 world, from v20:

  | Front | Weak to (Tier 2) | Z9's added test, kept | It now tests |
  |---|---|---|---|
  | **Iron** | One Arm a foe (Tier 1's rule) | Shields **+ 2** over Tier 1's (Z2's +1 and one more) | Break tips, Pierce, the Lite branches' shield cutters (Honed Edge, Severing Cut), Pure Arms |
  | **Arcane** | **One element a foe:** each stage's leaders one element, its guards another | — (the split is the test) | A Split weapon moon against a Full one, the Sage's Shifting Spell, area Tomes on the guards |
  | **Duel** | **One twin set** (Tier 1 drew two at stages 1–6) | She acts **three times from stage 9** | Single-target burst: Pure, the focus, class skills (Overload, Pinpoint Spell, Conqueror's Strike) |
  | **Horde** | **Keys one kind by role; leaders their twins**; a wave repeats none until all are used | **5–7 foes a wave** | Reach: Sweep, Hunt, Gathering, area class skills, Spillover, area Break tips |

  Every other foe of a Tier 2 run carries Z2's +1 shield over Tier 1's. A foe's own element is never her weakness; kinds
  are drawn by the run's seed from the front, never the face (rift §5). Where H89's `riftTuning(19, 2)` already holds
  Z9's shapes and shields, keep them and add only the weakness draws; where it doesn't, build both. The numbers
  (`riftTuning(20, 2)`, a v20 override as H60's `riftTuning(15)` was) are H96's.
- **Tier 2's guided builds** (CP7, §2.3): the compositions and each member's three weapons stay H66's, with H89's Tier 2
  tools. From tier 2 each member of `riftGuidedBuild(front, engine, tier)` also carries `classBranch`: **the branch
  whose focus holds more of her three guided weapons; ties branch 1** (the literal "the focus her build leans to"):

  | Front | Members (branch) |
  |---|---|
  | Iron | Brawler (Berserker); Brawler: Bow, Katana, Axe (Warlord); Spell Blade (Rune Knight); Spell Blade: Bow, Greatsword, Fire Tome (Rune Knight); Paladin (Guardian) |
  | Arcane | Mage (Sage) ×2; Summoner (Warlock) ×2; Cleric (Bishop) |
  | Duel | Brawler (Berserker); Brawler: Bow, Katana, Lance (Warlord); Mage (Sage); Mage: Light, Dark, Thunder (Sorcerer); Paladin (Guardian) |
  | Horde | Spell Blade (Rune Knight); Spell Blade: Greatsword, Axe, Fire Tome (Rune Knight); Summoner (Warlock); Summoner: Blizzard, Fire, Lance (Conjurer); Cleric (Bishop) |

  §7.2's branch leans name other fronts for some branches (the Blademaster's Iron, the Templar's Horde). H96 measures
  each front with the swap §7.2's leans suggest and keeps the one with the higher champion win rate, recording both, as
  H60 did for the healers.
- **CP41's pairings check** (`world/coverage-t2.test.ts`, always on, counts only, one kind a weapon, a Dual's partner
  never counted):
  - the default party on branch 1, with either healer: all ten kinds, and every single kind at least once (CP4 carried);
  - the pairing table: 16 pair states (physical pair × magic pair, each default or reverse) × the four healers,
    **5 of 16 at ten with any healer, 4 more with the right one**, every cell as §7.2's table;
  - the three drawn parties (§7.2's: the defaults, the owner's swap, the Light/Dark lean) hold all ten, with §7.2's boosted
    answers (3 · 3 · 3 · 1 · 1; 3 · 2 · 2 · 2 · 2; 1 · 0 · 1 · 3 · 3);
  - the default party answers a Tier 2 regular **2.0** times on average on the generator's real lists with R3's best
    picks (± 0.1; WP12);
  - every Rift Tier 2 guided build holds every kind its Tier 2 foes can ask at least once (CP7).
  **If a cell disagrees with the doc, the script wins:** correct class-progression §7.2 in the same commit as a
  follow-up logged against D192, and say so.
- **The party screen's helper** (CP41; H95 draws it): `rpgPartyKinds(members)` (the kinds her party's weapons hold) and
  `rpgPartyMissing(members, tier, engine)` (the kinds missing, tier 2 on, at v20; empty otherwise).
- **The Tier 1 foe digest doesn't move** (`world/tier1-foes.test.ts`): every change reads `tier >= 2` and v20.
- **A Tier 2 foe digest** (`world/tier2-foes.test.ts`, new, in `tier1-foes.test.ts`'s pattern): every region and capital
  stage of `w6`–`w10` generated at an explicit v20, hashed. A deliberate rebalance (H96's term or shields) updates it on
  purpose and says so in its D-row; R5's H101 asserts it doesn't move at v21.
- **Nothing on screen, no save change.** The foes' icons already draw whatever list a foe has. `pnpm docs:update` leaves
  no diff (the `foe-scaling`, `foe-roles` and `rift-fronts` blocks read the live engine).

## Do

1. **`rpg/campaign/enemies.ts`:** the term's v20 row and its reader (Tier 2 whole; Tier 3 worlds' offense and boss
   parts); `rpgFoe` takes the engine the generators pass; `rpgFoeShields`' v20 row equal to H89's Tier 2 row.
2. **World weakness regression:** do not change the v18 weakness generator. Pin WK8's three dealt weaknesses across
   regulars, elites, bosses, regions, capitals and Finals at explicit v18 and v20 inputs.
3. **`rift/fronts.ts`, `rift/generate.ts`:** the Tier 2 draws and Z9's shapes as decided; `riftGuidedBuild` carries
   each member's `classBranch` for tier 2.
4. **Tests:**
   - `world/weaknesses-t2.test.ts`: at explicit v18 and v20, every rank keeps the same three dealt weaknesses from
     WK8; Tier 1 and Tier 2 outputs match, and no role or rank narrows the list.
   - `world/shields-t2.test.ts`: at v20 in tier 2 every regular-rank foe's shield is its tier 1 value + 1, sub-bosses
     7, bosses 9, the same as v19's; tier 1 unchanged.
   - `rpg/campaign/term-t2.test.ts`: the term at ℓ 1, 25, 50 is ×1.00, ×1.13, ×1.27 on HP and DEF and ×1.00, ×1.049,
     ×1.10 on offense; a boss's HP and DEF another ×1.1; tier 1 untouched; v19 reads H89's row; a tier 3 world at v20
     keeps H89's HP and DEF slope and gains the offense part and the boss tenth.
   - `world/tier2-foes.test.ts`: the Tier 2 digest at v20.
   - `rift/fronts-t2.test.ts`: a tier 2 run at v20: Iron foes one Arm each with shields Tier 1's + 2; Arcane leaders one
     element and their guards another; the Duel boss one twin set, acting three times from stage 9; Horde Keys one kind
     by role, leaders twins, 5–7 a wave; no foe weak to her own element; a tier 1 run unchanged; the guided parties'
     branches as the table.
   - `world/coverage-t2.test.ts`: the checks above.
   - `world/tier1-foes.test.ts` and every existing test pass unchanged; the replay fixtures stay green.
5. **Docs:** log the D-row (fetch `main` first). "Built in H93 (D…), live from H97" lines in class-progression §4.2–§4.4
   and §7.2 (pairings), stat-balance §3.6 and rift.md §5 (Tier 2's fronts). `pnpm docs:update` leaves no diff.
6. **Check it locally** in a desktop browser at 390×844 (never the iOS Simulator), on a scratch save with a Tier 2
   world: a Tier 2 region's stages show three dealt weakness icons, and a Tier 2 Rift stage sheet
   reads as before.

## Done when

- [ ] `pnpm lint && pnpm test && pnpm build` pass; say the main JS number (of 230 KB).
- [ ] The tests in step 4 pass; the Tier 1 foe digest and every existing test pass unchanged.
- [ ] `docs/game/` is unchanged, `pnpm docs:update` leaves no diff, the D-row is logged and the design docs have their
  lines (and §7.2's table is corrected if the script disagreed).
- [ ] The local check in step 6 was done and described. Nothing from the original games in git.
- [ ] Deployed green (`gh run watch <id> -R luismlorenzana/uma-rpg --exit-status`), and
  https://uma-rpg.web.app/api/health shows the commit in `build`.

## Deliver

- **Claude, as a delegated worker:** a pull request from `feat/h93-weaknesses-term-tier2` with one commit,
  `feat(domain): Tier 2's weaknesses by rank, boss shields 9 and the full term, dark (H93)`; the body names the term's
  rows (v19's and v20's) and the guided branches. H92 edits the catalog and the engine at the same time; you share no
  files but, possibly, `rpg/rules.ts`. Fetch `main` before you push. The main session reviews and merges it, then
  watches the deploy.
- **Flag it done:** after the merge, a `docs(handoff): H93 done (D…)` commit deletes this file, sets H93 to Done with a
  Done row, and sets H96 to Ready if H92 is done.
