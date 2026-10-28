# H92 — Trees, Tier 2: branch C, the Power or Break tip, the signature tip, ten slots and LB+ (dark)

**uma-rpg · Claude · L · Needs: H91 · Unblocks: H94, H96 (and through them H95, H97)**

## Why

R1 gave every weapon tree a trunk and one free fork, A or B (CP18). Tier 2 deepens each tree the way the owner approved
(D192, CP19, CP22; D197, UT9):
- **branch C** joins the fork: the Brawler's and the Mage's third lines, and Q17's crossovers on the hybrids' leading
  halves (**Sweep**, **Hunt**), with **Focused**, **Mighty** and the healers' **Wide**;
- **every tip forks Power or Break**: Break is the same skill whose first weak hit on a foe removes one more shield
  point, under weapon arts' shared chip cap (E6). Breaks keep this one home;
- **her signature tip**: a third option at the tip fork of her lead weapon's tree, as her calling (**Quickstep**,
  **Spillover**, **Long guard** by her stride);
- **ten equipped slots** (3 → 10) for her 18 skills.

It also carries **LB+ at Bond 10** (CP28's Tier 2 part, tier2-classes A7), which R4's build decisions placed here (H91's
D-row). All of it is engine v20, dark until H97.

## Context (read first)

Code pointers are by file and function: Releases 1–3 move the lines. Re-read the code before starting.

- `CLAUDE.md`, `AGENTS.md`, H91's two D-rows (R4's build decisions and its own), and H91's packet in git history for
  the names it introduced (`classBranch`, `RpgFocus`, `rpg/branches.ts`, class-tree node ids, the self Barrier).
- **The design:**
  - [uma-templates.md](../../design/tier-rework/uma-templates.md) **§3.5 (UT9)**: the anchor (her lead weapon's tree,
    her first slot), the three tips by stride and their numbers; §3.8 (UT12: as her calling only); §10 (UT18: the tips
    are v17's data and a Barrier's self-target, now v20). It overrides class-progression's older "affinity kind's
    tree" wording wherever that still shows.
  - [class-progression.md](../../design/tier-rework/class-progression.md) §6.1 (CP14–CP17, CP21–CP23), **§6.3** (CP19),
    **§6.5** (every class's C line and its shape table), **§6.6** (the new nodes' power, MP and names), §6.8 (counts),
    §6.10 (which side lines stay unused), §8 and §8.4 (the halls; LB+ at Bond 10), §16's CP19, CP22.
  - [weapon-arts.md](../../design/weapon-arts.md) §4.6 (**E6, the chip cap**: one extra shield point a foe an act,
    whatever the source; the Breaker charge and Shatter outside it).
  - [tier2-classes.md](../../design/tier2-classes.md) §7 (A7: who gets LB+; **§7.2's 24 effects**, the data), A8.
  - [stat-balance.md](../../design/tier-rework/stat-balance.md) §10 (with Break tips every Break comes 0.3–0.7 rounds
    sooner: the tip's purpose).
- **What Releases 1–3 built** (use the names the code has):
  - H65: the tree line `RpgBranch = 'A' | 'B'` ("R4 widens it to 'C'") on `RpgProfile.lines` and
    `BattleAlly.lines`; the B table `RPG_BRANCH_B` (the catalog side letter by class and kind) and
    `RPG_BRANCH_B_NAME` in `rpg/node-identity.ts`; `rpgBranchNode(classId, weapon, depth, branch)`;
    `rpgHeldSkills(profile, engine)`; `battleNodeDef(ally, node, version)` (the ranked def the engine casts);
    `rpgSwapBranchLoadout`; `rpgActiveSlots(level, engine)` with Tier 1's 3 → 7 (not by tier yet); `rpgTreeView`;
    `heroLimitFor(id, version)` with `BY_V16`.
  - H67's `umaTemplate` (calling, stride); R3's per-weapon weak multiplier, `battleWeakFor` and the Dual's partner. H83's
    weapon branches are `BattleAlly.branches`, the tree lines `BattleAlly.lines`: use the names the code has after H90.
- **The code:**
  - `rpg/catalog.ts`: `addTree`, the `TreeSpec` side lines (`sideA`, `sideB`), `RpgSkillDef` (`splash`, `other`,
    `summon.linger`, `support15`), `describe`; `rpg/node-identity.ts` (node ids by depth and variant).
  - `rpg/battle/engine.ts`: `strike` (a weak hit chips one point, two with a Breaker charge), `chip`, `cast`,
    `resolveHalf`, `linger` (the farewell), `support`, `addBarrier`, `validAlly`, `applyBattleAction` (an act's scope).
  - `rpg/battle/limit.ts` and `rpg/heroes.ts`: `HeroLimit`, `heroLimitFor(id, version)`, `heroLimitSkills`, the 24
    seats; `rpg/hero-id.ts` (Bond Levels).
  - `rpg/rules.ts`: `rpgActiveSlots`, `rpgHeldSkills`, the tree checks; `rpg/battle/types.ts` (`BattleAlly`,
    `BattleInherit`, `BattleState`).

## Decisions made

- **Branch C, by class** (CP19, §6.5), from tier 2 at v20; a tree holds one of A, B or C (picked at depth 3, free,
  swapped outside fights; her equipped skills follow, depth for depth):

  | Class | C on Arms trees | C on Tome trees | Its nodes |
  |---|---|---|---|
  | Brawler, Mage | The catalog side line that isn't her B in `RPG_BRANCH_B` (Crush, Tempest, Scatter, Ballista, Cross; Chain, Shards, Storm, Beam, Cascade) | The same rule | Existing ids, `.Da` or `.Db` |
  | Spell Blade | **Sweep** (new) | **Focused** (the catalog's `a` line) | Sweep `.Dc`; Focused `.Da` |
  | Summoner | **Mighty** (new) | **Hunt** (new) | `.Dc` |
  | Paladin, Cleric | **Wide** (new) | **Wide** (new) | `.Dc` |

  The new lines' shapes are §6.6's, at depths 3–5, power on the depth table:
  - **Sweep:** every foe at the area share (×0.55 each), the core's hits, **her extra hit given up**; MP the core's + 4.
  - **Hunt:** the core summon; its farewell strikes its own target three times instead of every foe once; MP + 2.
  - **Mighty:** one hit fewer (at least one), ×1.1; MP + 2.
  - **Wide:** the core, its mend or Barrier on every Uma (×0.4) from depth 3; MP + 4.

  `RpgBranch` gains `'C'`; `RPG_BRANCH_C` (the side letter, or `c` for a new line) and `RPG_BRANCH_C_NAME` sit beside
  H65's B table, and `rpgBranchNode(…, 'C')` gives its ids; `BattleAlly.lines` takes `'C'` from v20 for a tier 2 ally.
  Names are §6.5's ("Sweeping Mystic Cleave", "Fire Drake Hunt", "Mighty Knight Captain", "Wide Rupture" …): 105 new nodes
  (Sweep 15, Hunt 15, Mighty 15, Wide 60). The lines §6.10 leaves unused (the Spell Blade's Focused on her Arms trees,
  the Summoner's Pack on Tome trees and Bonded on Arms trees, the healers' Lasting line) stay in the catalog for
  replays, unpickable. **Why a rule for Brawler and Mage C, not ids:** R1 decided which catalog line is each kind's B;
  C is the other one, so this packet never contradicts it.
- **The tip fork** (CP19), at depth 5 (Class Rank 40) of the line she holds, tier 2 on:
  - **Power:** the tip as it is (Tier 1's), the default.
  - **Break:** "{tip} · Break", the same skill. **On each foe, its first weak hit that removes a shield point removes
    one more**, once an act per foe, under E6.
  - **★ The signature tip** (below), on one tree only.
- **Tips are a modifier, not new nodes.** The loadout keeps the depth 5 node's id; the input freezes the tip per tree,
  `BattleAlly.tips?: Partial<Record<RpgWeapon, 'break' | 'quickstep' | 'spillover' | 'long-guard'>>` (absent: Power),
  from v20 and tier 2 only. **Why:** swapping a tip never touches a loadout, replays keep their ids, and one rule gives
  150 Break tips and the signature tips without 150 data rows. The save stores `'break' | 'signature'` (H94); the sheet
  resolves "signature" to her stride's tip when it applies (H94).
- **E6, the shared chip cap** (weapon-arts §4.6), new in v20: one extra shield point **a foe an act**, whatever the
  source. An act-scoped count per foe (never left on the state after the act, so it never enters a hash) is spent by:
  the Break tip's +1; Quickstep's two added hits; LB+'s added hits on a foe it already strikes (Arsenal Rush's sixth
  blow, Iaido's third draw, the extra cleaves, throws, dives, volleys, rends and spells of tier2-classes §7.2). Past the cap a hit
  still deals damage and breaks a lock. **Outside it, as E6 says:** the Breaker charge and Shatter. Splashes and spreads
  onto other foes (Spillover, a Bow B, Rune Burst) are each foe's own single hit and chip as any hit. Both halves of a
  pair share the act's count.
- **The signature tip** (UT9, UT12), tier 2 on, at v20:
  - **On her lead weapon's tree:** the weapon in her first slot (`weapons[0]`; a hybrid's first slot is her lead half).
    The engine accepts a signature kind only on `weapons[0]`, and one at most.
  - **As her calling only:** the sheet offers it, and freezes it, only when she fights as her calling's class (H94); the
    engine trusts the input.
  - **By stride** (her template's, H67): Dash **Quickstep**, Middle **Spillover**, Stayer **Long guard**.

  | Tip | Resolves as | MP |
  |---|---|---|
  | **Quickstep** | The tip's n hits become n + 2 hits of the same total power (each half's, for a pair; each summon's, for a Summoner). The two added hits' chips spend E6 | The tip's |
  | **Spillover** | After the tip, one hit on every other living foe at ×0.3 of the tip's power (the `splash` rule, the Bow B's). **On a tip that already strikes every foe**, one more hit on her target at ×0.3 instead: UT9 is silent there, and a pick that adds nothing would be a dead option | + 4 |
  | **Long guard** | After the tip, a Barrier on herself of **10% of her max HP**, flat (no healer scaling, no Skill Rank, no focus), until the round's end: H91's self Barrier at a fixed share, under the skill Barrier's cap | + 2 |

  In Tier 3 it sits at both tip forks of that tree: R5's (CP20, UT9).
- **Skill Ranks** (CP32): C nodes rank by their depth; a Break tip and Quickstep rank as their tip; Spillover's splash
  is ×0.3 of the ranked tip; Long guard's 10% and LB+ don't rank (a template piece; Limit Breaks).
- **Ten equipped slots** (CP22): `rpgActiveSlots` gains the world's tier; in tier 2 at v20 it is 3 at Lv 1 and one more at
  Lv 10, 15, 20, 25, 30, 35 and 40: **10 by Lv 40**. Tier 1 keeps R1's 3 → 7. **Why today's gates:** they already reach
  10 at Lv 40, the pace the owner plays now; Tier 2 holds 18 skills. Until R5, tier 3 takes tier 2's.
- **Tier 1 at v20 is R1's tree:** a C node or a tip on a tier 1 ally throws `Invalid battle ally`; so does any of them
  at v19.
- **LB+ at Bond 10** (A7, A8; CP28's Tier 2 part), v20, tier 2 on:
  - **Who:** a Hero with her own seat at Bond 10, or a Learner with that Hero's seat at Bond 10 (`inherits[].bond`).
    The input gains `BattleAlly.heroBond?: number`, the Hero's Bond with her own seat (0–10); the sheet freezes it (H94).
  - **What:** each `HeroLimit` gains its `plus` effect, **tier2-classes §7.2's 24 drafts as written**, including the two
    seats CP35 changed: Rampart Charge (now an Axe charge) keeps "Armor Break 2 on the foe it charges", Choir of Angels
    (now Light, then Lightning) keeps "Aegis 3, from 2". Each pattern is an existing rule: one more hit of a kind it
    deals, an Armor or Mind Break rider, a wider area share, a drain, a Regen repeat, a larger Barrier (to the 60% cap),
    a status a stack higher.
  - **Rules:** never refunds the gauge, adds no kind, its added hits on one foe spend E6; power stays her class's (A8).
    Its name is "{Limit Break}+" (H95 shows it).
  - **Why here:** LB+ is a Tier 2 class piece the plan's table didn't place; R1 is Tier 1's fight. If R1 shipped it
    anyway (look for `plus` on `HeroLimit`), this step is a check that it matches the above, gated as above.
- **Auto:** plays a tip as its skill. Spillover's splash and Quickstep's chips count in its expected damage and chips
  the way Auto values hits today; a Break tip's extra point is valued as one more chip. No new Auto rule otherwise.
- **Nothing in the save, nothing on screen** (H94 stores the picks; H95 draws them). `pnpm docs:update` leaves no diff.

## Do

1. **`rpg/catalog.ts`, `rpg/node-identity.ts`:** the four new C lines on their trees (`.Dc`), with §6.5's names and
   summaries; `RPG_BRANCH_C`, `RPG_BRANCH_C_NAME`, `rpgBranchNode`'s C.
2. **`rpg/rules.ts`:** `RpgBranch` with `'C'`; `rpgHeldSkills`, `rpgSwapBranchLoadout` and the tree checks know C from
   tier 2 at v20; `rpgActiveSlots` by tier and engine.
3. **The engine:** C's shapes (Sweep's reach without the extra hit, Hunt's farewell, Mighty, Wide's reach); `tips`
   validated and applied to the depth 5 node of their tree in `battleNodeDef` (so the ranked def carries them); the E6
   count; the three signature tips; LB+ (`heroBond`, `plus`, gated). Every rules call passes the fight's version.
4. **`rpg/heroes.ts`, `rpg/battle/limit.ts`:** the 24 `plus` effects and the plus step in `heroLimitSkills`.
5. **Tests:**
   - `rpg/trees-v20.test.ts`: all 50 trees have a C line at depths 3–5 with §6.6's shape and §6.5's names; `.Dc` ids
     exist only for Sweep, Hunt, Mighty and Wide (105 nodes); Brawler and Mage C is never their B; the Spell Blade's
     Tome C is `.Da`; `rpgHeldSkills` holds a C line in tier 2 at v20 and no C in tier 1 or at v19.
   - `rpg/battle/tree-c-v20.test.ts`: a Sweep Spell Blade's Arms half hits every foe at 0.55 with no extra hit; a Hunt
     Summoner's farewell strikes its own target three times and no other foe; a Mighty summon lands one hit fewer at
     ×1.1; a Wide Cleric's depth 3 mend reaches every Uma at ×0.4.
   - `rpg/battle/tips-v20.test.ts`: a Break tip's first weak hit on a lone foe's standing shield removes 2, later weak
     hits 1 each; an Axe Break tip removes 2 from each of three weak foes; a Spell Blade pair with a Break Arms tip and a
     Quickstep Tome tip on one foe removes one extra point in all; a Breaker charge still adds its point past the cap;
     Quickstep lands n + 2 hits of the same total; Spillover splashes every other foe at 0.3 for +4 MP, and on an Axe
     tip lands one more hit on her target at 0.3; Long guard puts a Barrier of 10% of her max HP on her for +2 MP, gone
     at the round's end; a signature kind on `weapons[1]`, two signature kinds, any tip on a tier 1 ally, or `tips` at
     v19 throw `Invalid battle ally`.
   - `rpg/battle/lb-plus-v20.test.ts`: table-driven over the 24 seats: each `plus` at Bond 10 in a tier 2 v20 fight
     (Arsenal Rush's sixth blow with the first Arm the foe is weak to; Choir of Angels' Aegis 3; Rampart Charge's Armor
     Break 2; Legion of Demons' drain …); none at Bond 9, in tier 1 or at v19; never refills the gauge; a Learner's at
     her `inherits[].bond` 10.
   - `rpg/rules-v20.test.ts`: `rpgActiveSlots` in tier 2 at v20 is 3, 4 and 10 at Lv 1, 10 and 40; tier 1 at Lv 40 is
     7; tier 2 at v19 is R1's.
   - Every existing test passes unchanged; the v19 replay tests and R1–R3's stay green.
6. **Docs:** log the D-row (fetch `main` first). Add "Built in H92 (D…), live from H97" lines to class-progression §6.3
   and §6.6, uma-templates §3.5 and tier2-classes §7 (LB+). `pnpm docs:update` leaves no diff.
7. **Check it locally** in a desktop browser at 390×844 (never the iOS Simulator), on a scratch save: a Tier 1 and a
   Tier 2 world-map stage on Auto play as before; a Hall's seat page and a Learner's Limit Break are unchanged.

## Done when

- [ ] `pnpm lint && pnpm test && pnpm build` pass; say the main JS number (of 230 KB).
- [ ] The tests in step 5 pass; the v19 replay tests and every existing test pass unchanged.
- [ ] No rules call inside `rpg/battle/` relies on a default `engine`.
- [ ] `docs/game/` is unchanged, `pnpm docs:update` leaves no diff, the D-row is logged and the four design docs have
  their lines.
- [ ] The local check in step 7 was done and described. Nothing from the original games in git.
- [ ] Deployed green (`gh run watch <id> -R luismlorenzana/uma-rpg --exit-status`), and
  https://uma-rpg.web.app/api/health shows the commit in `build`.

## Deliver

- **Claude, as a delegated worker:** a pull request from `feat/h92-trees-tier2` with one commit,
  `feat(domain): Tier 2's trees, branch C, the tips and LB+ on engine v20, dark (H92)`. H93 edits the world generator,
  the foe tuning and the Rift at the same time; you share no files but, possibly, `rpg/rules.ts` (rebase on whichever
  lands first). Fetch `main` before you push. The main session reviews and merges it, then watches the deploy.
- **Flag it done:** after the merge, a `docs(handoff): H92 done (D…)` commit deletes this file, sets H92 to Done with a
  Done row, and sets H94 to Ready, and H96 too if H93 is done.
