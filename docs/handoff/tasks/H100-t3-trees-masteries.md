# H100 — Trees, Tier 3, and the masteries: capstones, two lines held, the master slot, the six masteries (dark)

**uma-rpg · Claude · L · Needs: H98 · Unblocks: H102, H104 (and through them H103, H105)**

## Why

Tier 3's class progression ([class-progression.md](../../design/tier-rework/class-progression.md) §6.4, §6.6, §7.3;
CP20, CP22, CP27) is where Tier 3's Class Ranks lead:
- every weapon tree gains **depth 6 capstones** at Class Rank 50, and she **holds two of its three lines**, each with its
  tip and capstone ("one tree, two answers");
- her equipped skills become **ten and a master slot** that holds one capstone;
- her class branch opens its **branch capstone** at Class Rank 50 and, with it, **the class's mastery**, the same for
  both branches: Unstoppable, Resonance, Spellbind, Menagerie, Last Stand, Overflow.

This packet builds them as data and engine v21 rules, dark, for Tier 3 allies only. The masteries' numbers are drafts
H104 tunes to +8–15% where each applies.

## Context (read first)

Code pointers are by file and function: Releases 1–4 move the lines. Re-read the code before starting.

- `CLAUDE.md`, `AGENTS.md`, [change-protocol.md](../../change-protocol.md). H98's packet and D-rows (**Release 5's build
  decisions**).
- **The design:**
  - class-progression **§6.1** (the rules every tier shares; Skill Ranks: capstones open whole), **§6.4** (CP20),
    **§6.5** (every capstone's name: each class table's "Capstones D6, Tier 3: A · B · C" column), **§6.6** (the
    capstone row: its tip one depth on, 5.6, tip MP + 4, its status or rider one stack more; the branch capstone row),
    §6.7 (the root in Tier 3), §6.8 (17 nodes a tree, 34 held, 10 and a master slot), **§7.2** (each branch's "Tier 3 ·
    CR 50" row), **§7.3** (CP27, the masteries), §16's CP20, CP22, CP27 rows.
  - [uma-templates.md](../../design/tier-rework/uma-templates.md) §3.5 (UT9: the signature tip at both tip forks of her
    lead weapon's tree in Tier 3).
  - `docs/design/tier2-classes.md` §3 (every class power: no extra act, no Limit refund, no longer Break, at most one
    extra shield point an act, no new damage kind, no party support from the Summoner).
  - [weapon-progression.md](../../design/tier-rework/weapon-progression.md) §2.4 (the damage stack; where a mastery sits,
    below).
- **Releases 1 and 4's packets and D-rows:** H65 (trees with no points: the trunk, the fork, lines A and B, Pierce, R1's
  per-tree pick, equipped slots, Skill Ranks frozen into a fight's input), **H91** (R4's build decision 7: `classBranch`,
  R1's per-tree pick for the A/B/C line, R3's `branch` for Pure or Dual, `tips`, `via`; branch ids; class skills as nodes
  `<class>-<branch>.<depth>`, "R5 adds `.6`"; skill MP × 1 · 1.7 · 2.4 by tier from v20; the new rules table), **H92**
  (C lines `.Dc`, the tip fork, `BattleAlly.tips` keyed by weapon, E6's chip cap, the signature tip on `weapons[0]`,
  `rpgActiveSlots(tier, level, engine)`, "until R5 tier 3 takes tier 2's"), **H94** (`ClassLoadout.classBranch`, `tips`,
  the setters, the sheet).
- **The code:**
  - `packages/domain/src/rpg/catalog.ts`: the tree builders (`addTree`, the Brawler's and Mage's specs, `summon`, the
    Spell Blade's `TIERS`, `cleric()`, `healerSupport`), H91's class-skill table, `RPG_ALL_NODES`, `RPG_NODES`,
    `rpgNode`; `rpg/node-identity.ts` (`RPG_SKILL_POWER`, `RPG_SKILL_MP`, node ids).
  - `rpg/rules.ts`: the depth gates, `rpgOpenDepth`, `rpgLearnedSkills`, `rpgUsableLoadout`, `rpgAutoLoadout`,
    `rpgActiveSlots`, the Skill Rank multiplier.
  - `rpg/battle/skills.ts` (`battleSkillFor`, `BATTLE_UNBROKEN_FACTOR`, `BATTLE_FAREWELL_FACTOR`, `BATTLE_COVER_CAP_V15`,
    the status constants), `engine.ts` (`battleDamage`, `cast`, `strike`, `chip`, `popLocks`, `heal`, `addBarrier`,
    `harm`, the Summoner's linger and farewell, `battleActorSkill`), `types.ts` (`BattleAlly`, `BattleState`), `auto.ts`,
    `battleSupportValue`.
  - The pick and loadout setters H65, H92 and H94 wrote in `save/`; `save/sheet.ts` (`umaBattleSheet`).

## Decisions made

- **Tier 3 only, behind the stage.** Depth 6, two lines held, the master slot, branch capstones and masteries exist for
  a Tier 3 profile when `rpgRework('t3', engine)`; the engine accepts them from v21 for a Tier 3 ally. A Tier 1 or
  Tier 2 Uma at Class Rank 50 gains nothing new.
- **Depth 6 at Class Rank 50** (CP16, CP20), Tier 3 only. `RPG_SKILL_POWER` gains **5.6** and `RPG_SKILL_MP` **30**
  (the depth table's next step; a core's full-turn MP, its tip's + 4).
- **The 150 capstones** (CP20, §6.5, §6.6): one a line on each of the 50 trees, ids `<tree>.6a`, `.6b`, `.6c` (the
  catalog's `<depth><side>`, H92's `.Dc`), named exactly as §6.5's tables. Each is **its line's tip one depth on**:
  - **power** the tip's × 5.6 ÷ 4.6 (a B line's ×0.92, an area share or a random bonus carries);
  - **MP** the tip's + 4;
  - **hits, reach and shape** the tip's (a hit more would add chips, which E6 and tier2-classes §3 cap);
  - **its status one stack more**, up to the stack cap (3); a tip already at 3 keeps 3 and its status lasts one round
    more. Riders (×1.3 on a Broken foe, below half HP, a pierce) carry unchanged;
  - **a healer's share 0.48** at depth 6 (`RPG_SUPPORT_SHARE_V15`'s next step; §7.2's capstones use 48%), its reach
    the tip's;
  - **the same capstone follows either tip** (Power, Break or a signature tip): the tip's modifier stays on the tip.
  - `RPG_ALL_NODES` holds them always; the live `RPG_NODES` gains them only when `rpgRework('t3')` (as H53 did for the
    Paladin), so nothing lists them before the switch.
- **The 12 branch capstones** (CP27, §7.2's "Tier 3 · CR 50" rows): class skills `<class>-<branch>.6` at Class Rank 50,
  cast through `via` by H91's rules (a hybrid's pair at its hands, a healer's blow or spell at her half hand), power 5.6
  (× the shape's share), MP as listed × her hand's MP × the tier's ×2.4 (H91's). Every effect is v20's vocabulary
  (Frenzy, a guard as a skill, the area share with weak foes at full, the tapped foe at full, a pierce, lingering at 0.5,
  Barriers, mends, Regen, statuses on every Uma); the only new part is "her Arms half ignores the unbroken halving"
  (Eclipse Cut), a pierce on one half:

  | Class | Branch 1 | Branch 2 |
  |---|---|---|
  | Brawler | **Unbound Fury:** every foe, 3 hits, 3.08 each; the tapped foe 5.6; Frenzy 2 rounds. MP 34 | **Warlord's Reckoning:** one foe, 3 hits, 5.6; ×1.3 on a Broken foe; Armor Break 2. MP 30 |
  | Mage | **Total Convergence:** every foe, 2 hits, 3.08 each, weak foes the full 5.6; counts as a new element. MP 34 | **Annihilation:** one foe, 1 hit, 7.0 (×1.25). MP 38 |
  | Spell Blade | **Rune Deluge:** her pair, 5.6: Arms half on one foe, Tome half on every foe at the area share, a foe weak to it at full. MP 34 | **Eclipse Cut:** her pair on one foe, 5.6; her Arms half ignores the unbroken halving; ×1.3 on a Broken foe. MP 30 |
  | Summoner | **Final Pact:** her pair on one foe, 5.6; Mind Break 2; ×1.3 on a cursed foe. MP 30 | **Host of Farewells:** her pair on every foe, 3.08 each; her Tome summon lingers at 0.5. MP 34 |
  | Paladin | **Steadfast Vow:** a blow on one foe, 5.6; Enfeeble 3; she guards the Uma most threatened, 2 rounds. MP 30 | **Dawnshield:** a blow on every foe, 3.08 each; a Barrier on every Uma (48% × 0.4); Faith 2. MP 34 |
  | Cleric | **Mercy Chorus:** a spell on every foe, 3.08 each; a mend on every Uma (48% × 0.4) and Regen. MP 34 | **Revelation:** a spell on one foe, 5.6; Brave 2, Aegis 2 and Breaker 2 on every Uma. MP 30 |

- **Skill Ranks** (CP32): capstones and branch capstones **open whole (×1.00)** and never rank; everything else ranks as
  H65 built it. **Skill MP** in Tier 3 is ×2.4, H91's (from v20); nothing changes here.
- **The base MP regen counts at most five depths** (the main session's ruling, 2026-10-25; SB18, built in H68): 0.8% of
  her max MP a round a depth open, **capped at 4% (Class Rank 40)**. Depth 6 opening at Class Rank 50 doesn't raise it to
  4.8%. Why: SB18 was sized on five depths (the party's late-region pace 0.94–1.05× today's); a sixth step would add MP
  no foe term prices. H68 already counts five at most (`rpgBaseMpRegen`); adding depth 6 must not move it, and a test
  pins it.
- **Two lines held** (CP20's "two branches held"; a tree's A, B or C is a **line** in code and on screen, so "branch"
  keeps one meaning per object, H91's point 7): in Tier 3 each tree holds **two of its three lines**, default **A and B**, swapped freely
  outside fights; her equipped skills follow, depth for depth. She holds 10 skills a tree (the trunk, two lines of four)
  and 4 class skills: 34. Auto picks between them each turn.
  - **Shape:** R1's per-tree pick (`ClassLoadout.lines`) stays her first line; `ClassLoadout.second: Partial<Record<RpgWeapon, 'A' | 'B' | 'C'>>`
    (R1's line type; the second line a tree; absent: the default, A, or B when her first is A) and `ClassLoadout.secondTips` (H94's `tips`
    type, for the second line; absent: Power). Two lines a tree always differ.
  - **The input**, from v21 for a Tier 3 ally: `BattleAlly.second` and `BattleAlly.secondTips` (H92's `tips` type),
    beside R1's pick and H92's `tips`; refused before v21 or below Tier 3.
  - **The signature tip at both forks** (UT9): on her first slot's tree, `tips` and `secondTips` may each hold the
    signature (one each at most, both on `weapons[0]`); H94's "the tip follows her first slot" moves both.
- **Equipped: ten and a master slot** (CP22).
  - `rpgActiveSlots(3, level, engine)` is **10 at every level** from v21. Why: CP22 reads "10 and a master slot", not
    "3 → 10" (she arrives having carried ten from Tier 2's Lv 40); early on the slots simply sit empty. If H104 finds
    Tier 3's first levels run more than 10% fast because of it, H92's ramp returns for Tier 3 (its knob, say so).
  - **The master slot** opens at **Class Rank 50** with the capstones: `ClassLoadout.master: string | null`, a capstone
    she holds (a depth 6 node of a held line, or her branch capstone), never also in her ten; **null means chosen for
    her: her branch capstone.** The input gains `BattleAlly.master?: RpgNodeRef` from v21 (a Tier 3 ally at Class Rank
    50); `battleActorSkill` and Auto treat it as one more equipped skill.
  - `rpgAutoLoadout` in Tier 3 fills ten from both lines, deepest first, round the three trees, then class skills.
- **The masteries** (CP27): `RPG_MASTERY` by class; they **open at Class Rank 50 of Tier 3 with the branch capstone, the
  same for both branches**. `BattleAlly.mastery?` from v21, frozen at the fight's start (a Tier 3 ally at Class Rank 50,
  her class's, else refused). Draft constants in `rpg/battle/skills.ts`, H104's to tune:

  | Class | Mastery | On screen | The rule (v21) | Constant |
  |---|---|---|---|---|
  | Brawler | **Unstoppable** | "Her hits lose less to a standing shield." | An unbroken foe takes ×0.6 from her hits, not ×0.5 | `BATTLE_UNSTOPPABLE_FACTOR` 0.6 |
  | Mage | **Resonance** | "Her deepest spells ring twice." | Her depth 5 and 6 spells and her Class Rank 40 and 50 skills strike again at 30% on the same targets that still stand | `BATTLE_RESONANCE_SHARE` 0.3 |
  | Spell Blade | **Spellbind** | "Both halves weak: +20%." | When both halves of her act are weak on the same foe, her act's hits on that foe deal ×1.2 | `BATTLE_SPELLBIND_FACTOR` 1.2 |
  | Summoner | **Menagerie** | "Her summons stay a pair longer." | Each Tome summon lingers for two of her pairs and strikes in farewell at both | `BATTLE_MENAGERIE_PAIRS` 2 |
  | Paladin | **Last Stand** | "Her Barrier saves a falling Uma once a fight." | Once a fight, an Uma holding a Barrier the Paladin cast who takes a fatal hit stays at 1 HP | `BATTLE_LAST_STAND_USES` 1 |
  | Cleric | **Overflow** | "Mends past full become a Barrier." | A mend's healing past max HP becomes a Barrier, up to 10% of that Uma's max HP | `BATTLE_OVERFLOW_CAP` 0.1 |

  Their exact rules (why, in a line each):
  - **Unstoppable** replaces `BATTLE_UNBROKEN_FACTOR` for her hits only; a pierce still ignores the halving.
  - **Resonance's echo** is the same skill's hit at 30% of its power (its kinds, special, branch multiplier and focus),
    cue label "Resonance"; it **never removes a shield point, never breaks a lock and adds nothing to the Limit gauge**
    (CP27 says no shield point; locks are the same Break economy; tier2-classes §3 forbids a Limit refund).
  - **Spellbind is checked at the act's start** against her tapped foe: both halves' weapons weak on it (either kind, a
    partner included, Hex included). Why: a pair resolves half by half, and a bonus decided after the first half would
    rewrite its cues. A Sweep half's hits on other foes take none. Cue label "Spellbind" on the first hit.
  - **Menagerie** keeps up to two lingering Tome summons a Summoner (the old one's second farewell and the new one's
    first); each farewell is that summon's own (Hunt, Lingering Call, Echoing Farewell as their nodes say). A fallen
    Summoner loses them, as today. The lingering list is absent until used, so older states hash as before.
  - **Last Stand** needs the Barrier's caster: units gain an optional `barrierBy` (absent until a Barrier lands), set by
    the Paladin's skills and her own Limit Breaks. It saves from a foe's hit, never a Burn tick; the Paladin needn't
    still stand (the Barrier is what saves); cue label "Last Stand".
  - **Overflow** counts her skills' mends, Regen ticks and her own Limit Break's mends, never a drain or a revive; its
    Barrier is capped at 10% of the Uma's max HP and still under `BATTLE_COVER_CAP_V15`; cue "+N Barrier · Overflow".
  - **Where they sit in the damage stack:** step 5 (WP31), beside the riders and the unbroken halving, not among step
    4's percentages, so WP31's ceiling on one weak hit (×2.49, SB7) measures what it was set for. H104 reports the
    ceiling with Spellbind too (×1.7 × 1.15 × 1.275 × 1.2 ≈ ×2.99).
  - **Auto** values them: the unbroken factor through `battleDamage`; Resonance's echo in an eligible spell's score
    (×1.3); Spellbind by preferring a pair whose halves are both weak on the foe; Menagerie's summon at its two
    farewells; Overflow's Barrier in `battleSupportValue`; Last Stand needs no choice.
- **The sheet** (`umaBattleSheet`) freezes `second`, `secondTips`, `master` (null resolved to her branch capstone) and
  `mastery` for a v21 input in a Tier 3 world, and none of them otherwise.
- **The save actions** (H65's line setter, H94's `setTip`, a new `setMasterSlot(save, outfitId, classId, node, now,
  tier)`): the second line, its tip, the master slot, in a Tier 3 world while `rpgRework('t3')`; dark, Release 4's one
  line. The save's types widen here; H102 parses them strictly and migrates.
- **Main JS:** the catalog sits in the engine's lazy chunk (H62, D184), so the 162 new nodes land there; the depth table
  and the mastery constants are small. Say the number.
- **No screen, no manual change.** `pnpm docs:update` leaves no diff.

## Do

1. **The catalog:** depth 6, the 150 capstones and 12 branch capstones as decided, `RPG_ALL_NODES` and the live
   `RPG_NODES`.
2. **The rules:** depth 6's gate in Tier 3, two lines in `rpgLearnedSkills` and the tree checks, `second` and
   `secondTips`, the signature tip at both forks, ten slots, the master slot, `rpgAutoLoadout` in Tier 3, capstones at
   ×1.00.
3. **The engine (v21):** `second`, `secondTips`, `master` and `mastery` accepted for a Tier 3 ally at Class Rank 50; the
   six mastery rules; `barrierBy` and Menagerie's list absent until used; Auto as decided; the sheet. Every rules call
   passes the fight's version.
4. **The save actions** as decided, gated.
5. **Tests** (mock with `capsAt(21, …)` where a live default matters):
   - `rpg/trees-t3.test.ts`: 150 capstones and 12 branch capstones in `RPG_ALL_NODES`, none in the live `RPG_NODES`; a
     sample per class by §6.5's names; a capstone's power is its tip's × 5.6 ÷ 4.6, its MP the tip's + 4, its status one
     stack more (a tip at 3 lasts a round longer); a healer capstone's share 0.48; depth 6 opens at Class Rank 50 only for
     a Tier 3 profile from v21; a Tier 2 Uma at Class Rank 50 holds 18 skills, a Tier 3 one 34; two lines held, two equal
     lines refused; the signature tip offered at both forks of the lead tree and nowhere else; ten slots at Tier 3 Lv 1;
     the master slot takes only a capstone she holds, not one in her ten, and only at Class Rank 50; capstones rank ×1.00
     at every Class Rank; a Tier 3 ally at Class Rank 50 regains 4% of her max MP a round, as at Class Rank 40 (not
     4.8%).
   - `rpg/battle/masteries-v21.test.ts`, one small fixed fight each: Unstoppable's hit on an unbroken foe is ×0.6 ÷ ×0.5
     of the same Brawler without it; Resonance's echo deals 30%, chips nothing, breaks no lock, adds no gauge, strikes
     only standing targets; Spellbind ×1.2 when both halves are weak on the tapped foe and not when one is; Menagerie's
     summon strikes two farewells and two can linger; Last Stand leaves an Uma under the Paladin's Barrier at 1 HP once a
     fight, not twice and not without her Barrier; Overflow's Barrier is the overflow, capped at 10%; each mastery is
     refused at Class Rank 49, for a Tier 2 ally and before v21.
   - `rpg/battle/engine-v21.test.ts` (H98's file): a Tier 3 party at Class Rank 50 holding A and B, capstones in their
     loadouts, a master slot and their masteries, plays a full fight on Auto; `second` at v20 throws; a master slot on a
     Tier 2 ally, before v21 or holding a non-capstone throws.
   - The actions: holding A and C, a tip per line, the signature on both lines of the lead tree, setting and clearing the
     master slot; unmocked, a Tier 3 world keeps one line a tree.
   - H98's v20 replay tests and every existing test pass unchanged.
6. **Docs:** class-progression §6.4 and §7.3 gain "Built in H100 (D…), live from H105." Log the D-row (fetch `main`
   first). `pnpm docs:update` leaves no diff.
7. **Check it locally** (your own ports; a desktop browser at 390×844; never the iOS Simulator), on a scratch save from
   the CJS build with a Tier 3 world of Tier 2's shape and an Uma at Class Rank 50: her Skills tab shows one line a tree
   and no depth 6; a Tier 3 world stage on Auto plays and its open fight reads `"version": 19`.

## Done when

- [ ] `pnpm lint && pnpm test && pnpm build` pass; say the main JS number (gzip, of 230 KB).
- [ ] The tests in step 5 pass; both v20 replay tests pass untouched.
- [ ] No rules call inside `rpg/battle/` relies on a default `engine`.
- [ ] `git diff` shows no switch (`BATTLE_ENGINE_VERSION` 20, `SAVE_SCHEMA_VERSION` 30).
- [ ] `docs/game/` is unchanged, `pnpm docs:update` leaves no diff, the D-row is logged, the design docs have their
  lines.
- [ ] The local check in step 7 was done and described. Nothing from the original games in git.
- [ ] Deployed green and https://uma-rpg.web.app/api/health shows the commit.

## Deliver

- **Claude, as a delegated worker:** a pull request from `feat/h100-t3-trees-masteries` with one commit,
  `feat(domain): Tier 3's trees and the six masteries, dark (H100)`. H99 edits `engine.ts`' validation and H98's test
  file at the same time: rebase on whichever lands first. Fetch `main` before you push. The main session reviews and
  merges it, then watches the deploy.
- **Flag it done:** after the merge, a `docs(handoff): H100 done (D…)` commit deletes this file, sets H100 to Done in
  `docs/handoff/README.md` with a Done row, and sets H102 to Ready if H99 is done, and H104 if H99 and H101 are.
