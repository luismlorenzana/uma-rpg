# H65 — Trees v16: no points, a trunk and one fork, Skill Ranks, Pierce, the halls' two kinds and the Paladin's revive (dark)

**uma-rpg · Claude · L · Needs: H64 · Unblocks: H69 (with H67), H71 (with H66, H68), H70**

## Why

Today a class's trees are five or ten lines of five depths, each with a core and two side skills bought with points
(D102). [Class Progression](../../design/tier-rework/class-progression.md) (D192) replaces that in Tier 1 with **three
trees a class, one per weapon slot, each a trunk and one free fork into branch A or B, no points at any tier**, and a
**Skill Rank** on every skill that rises by itself every 2 Class Ranks (CP13–CP18, CP32). With it come four data changes:
the Spell Blade's branch B becomes **Pierce** (CP42), the Paladin's revive moves to her Light tree (CP37), two Limit
Breaks change kind (CP35), and two Summoner summons get their own names (CP21).

This packet builds all of it in the domain and the engine, behind `rpgRework('fight', engine)` (H64), so the deployed
game is unchanged until H72. The save's branch picks (save v27) are H69's; the Skills tab is H70's, on the tree model
this packet exports.

## Context (read first)

- `CLAUDE.md`, `AGENTS.md`. Then [class-progression.md](../../design/tier-rework/class-progression.md): §6.1 (the shared
  rules, Skill Ranks and their table), §6.2 (Tier 1, Pierce), §6.5 (every class's trees: the B line of each), §6.6 (MP back
  a round: H68's), §6.8 (counts), §6.10 (the audit, CP43), §8.1–§8.3 (the halls, CP35), §14 (save), §16 (CP13–CP18, CP21,
  CP22, CP23, CP28, CP32, CP35, CP37, CP42, CP43). [stat-balance.md](../../design/tier-rework/stat-balance.md) §9 (SB16).
- H64's D-rows (the R1 build decisions: one switch, on today's gear) and its `caps-at.fixture.ts` (the mocked switch).
- **The code** (lines on `421eacd`; H64 moves some by a few lines):
  - `rpg/rules.ts`: 17–31 the tree constants (`RPG_SIDE_POINTS_PER_LEVEL` 19, `RPG_DEPTH_GATES` 21, the equipped slots
    23–25, `RPG_MAX_LEGACY_SLOTS` 27, `RPG_MAX_TREE_NODES` 29); 33–51 `RpgNodeRef`, `RpgProfile` (`tree` 47, `legacy` 48,
    `classRank` 50); 158–160 `rpgClassTrees`, `rpgProfileTrees`; 268–281 side points; 273–276 `rpgActiveSlots`; 285–298
    `rpgDepthBlock`, `rpgOpenDepth`, `rpgOpenCores`; 300–341 learning (`rpgLearnBlock`, `learnRpgNode`, `forgetRpgVariant`,
    `validRpgTree`); 343–374 `rpgLearnedSkills`, `rpgUsableLoadout`, `rpgAutoLoadout`.
  - `rpg/node-identity.ts` 4–29: node ids (`<class>-<weapon>.<depth>[a|b]`), `RPG_SKILL_POWER`, `RPG_SKILL_MP`,
    `rpgSideNodeLevel`. The save parser reads this light module, never the catalog.
  - `rpg/catalog.ts`: 28–55 `RpgSkillDef` (`special: 'pierce'` 45, `support15` 54); 81–94 `RpgNode`; 109–132 `describe`
    (reads the live generation's support); 145–156 `addTree`; 163–210 the Brawler; 215–258 the Mage; 262–323 the Summoner
    (`SUMMONS` 265–278: the Axe line at 274, the Knight Captain's live rename at 273, the precedent); 327–350 the Spell
    Blade (her B side, "… Flurry", 346–349); 355–414 the Cleric (`RPG_REBIRTH_NODE` 407); 416–427 the Paladin
    (`RPG_VALKYRIE_OATH_NODE` 420, her B names 423, the revive on `lance` depth 4 at 426); 429–435 `RPG_ALL_NODES`,
    `RPG_NODES`, `rpgNode`, `rpgTreeNodes`.
  - `rpg/heroes.ts`: 45–94 `LIMITS` (`cleric-1` Choir of Angels 74–75), 96–117 v15's `NEW` (`paladin-3` Rampart Charge
    113–114), 119–129 `BY_V2`, `LIVE`, `heroLimitFor`, `heroLimitPower`, 133–137 `heroLimitKinds`.
  - `rpg/battle/skills.ts` 49–70: `BattleSkill`, `battleClassRank`, `battleSkillFor` (it checks `rpgLearnedSkills` and
    the loadout, then returns `node.skill`).
  - `rpg/battle/engine.ts`: 117–135 `validAlly` (130 the loadout's length by `rpgActiveSlots(a.level)`, 131
    `validRpgTree`); 338 the pierce rule (`special !== 'pierce'` skips the unbroken halving); 442–452 a revive;
    783–787 v12–v14's summon support (`rpgNode`); 819–823 `battleActorSkill`; 919–924 `halfOf`; 935–941
    `battleExtraHit`; 949–965 `linger` (953 `rpgNode(summon.ref.id)`, 958 `node.skill`).
  - `rpg/battle/limit.ts` 34–39 `heroPlan` (Limit Breaks: never ranked), 48–104 `battleLimitPlan`.
  - `rpg/battle/auto.ts` 54–65 `classLimitChoice` (`rpgNode` at 59, 62–63), 80–96 `bestHalf` (`battleActorSkill`).
  - `save/upgrades.ts` 69–79 `canLearnSide`, 114–118 the side points behind the Skills tab's dot.
  - `world/balance-party.ts` 76–115 `balanceMember` (83 learns the A side at every depth; 86–91 its loadout).
  - `docs/render.ts` 149–174 `depths`, `nodeRow`, `skillTrees`; 653 `'active-slots'`: they read the live lists.

## Decisions made

**The approved calls this packet builds:**
- **CP13, CP14, CP16, CP18 — a Tier 1 tree.** One tree per weapon slot, three a class; the catalog stays one tree per class
  and kind (50 trees, 750 nodes, today's ids, for replays). A v16 tree is **8 nodes**: the trunk (depths 1–2, the cores
  `.1`, `.2`), **branch A** (depths 3–5, the cores `.3`–`.5`: today's core line, the anchor) and **branch B** (depths 3–5, one
  catalog side line, below). Depths open at Class Rank 1, 10, 20, 30, 40, and every node of an open depth on her path is
  hers at once. **No points**: a branch is free, exclusive and swappable outside fights; **A is the default**. The other
  side line and every depth 1–2 side are in no Tier 1 tree (replays keep them; R4's branch C reuses most).
- **The B line, by class and kind** (§6.5; the catalog's side letter is not the branch's letter):

  | Class | Tier 1 branch B: the catalog side, its name |
  |---|---|
  | Brawler | Greatsword `b` (Combo), Axe `b` (Reap), Lance `a` (Impale), Bow `b` (Rain), Katana `a` (Draw) |
  | Mage | Fire `a` (Wave), Blizzard `a` (Spike), Thunder `a` (Bolt), Light `b` (Cascade), Dark `a` (Pierce) |
  | Spell Blade | every tree `b` (Pierce; v15's "… Flurry") |
  | Summoner | Tome trees `b` (Bonded), Arms trees `a` (Pack) |
  | Paladin, Cleric | every tree `b` (Heavy; the Light tree's depth 3 is Rebirth or Valkyrie's Oath) |

  Spot checks, §6.5's names: Brawler Greatsword B d5 Meteor Combo, Lance B d5 Gungnir; Mage Light B d5 Holy Cascade;
  Summoner Fire B d5 Bonded Phoenix, Bow B d5 Sagittarius Pack.
- **CP22 (Tier 1):** equipped skills **3 → 7**: three at Uma Lv 1, one more at Lv 10, 20, 30, 40.
- **CP32 — Skill Ranks.** Every held skill has a rank 1–5: Rank 1 when its depth opens, one more every 2 Class Ranks
  after (`1 + ⌊(Class Rank − gate) ÷ 2⌋`, at most 5): depth 1 is Rank 5 at Class Rank 9; depth 3 Rank 2 at 22 and 5 at 28.
  A rank multiplies the skill's power **×0.95, ×0.975, ×1.00, ×1.025, ×1.05**, and a healer's mend and Barrier shares the
  same; MP, hits, targets and statuses never change. **Limit Breaks don't rank** (CP28), nor template pieces. Nothing is
  stored: a rank reads her Class Rank.
- **CP42 — Pierce, approved** (D192 took CP42 as written; the main session's ruling, 2026-10-25: build it, never mark it
  "proposed", whatever older class-progression wording says). The Spell Blade's `spellblade-<kind>.3b`, `.4b`, `.5b` (today's Flurry, one more hit ×0.95) become
  **one hit at ×1.15 of the depth's power that ignores the unbroken halving** (`special: 'pierce'`, the engine's own rule),
  +2 MP (as today's side): 3.335, 4.255 and 5.29 single-target units at depths 3–5. On an Arms tree her extra hit
  (`battleExtraHit`) still lands, the total unchanged, and both hits pierce (the skill's `special`, as the Brawler's Katana
  B). Names: "Piercing {Mystic · Astral · Celestial} {noun}" (Piercing Mystic Cleave …).
- **CP37 — the Paladin's revive.** From v16 `paladin-tome-light.3b` is **Valkyrie's Oath**: her Heavy Devotion with the
  revive in its `support15`; `paladin-lance.4b` is **Heavy Transfix**, the revive gone. Ids stay.
- **CP35 — two Limit Breaks' kinds.** From v16: `paladin-3` **Rampart Charge** is one **Axe** charge on one foe, then a
  Barrier on every ally ("One Axe charge on one foe, then a Barrier on every ally"); `cleric-1` **Choir of Angels** is
  Light on every foe, **then Lightning** on every foe, then Aegis 2 on every ally (hits `light` 0.5 and `lightning` 0.5,
  target every foe; "Light on every foe, then Lightning on every foe, then Aegis 2 on every ally"). Shapes, power and
  support unchanged.
- **CP21 — names.** The Summoner's Axe summons "Berserker" (d2) and "Jotun Warlord" (d5) become **Marauder** and **Jotun
  King**, ids unchanged, and their sides follow (Marauder Pack, Bonded Jotun King …). SK14's renames were never built:
  nothing to revert.
- **CP43 — every tree viable.** Every one of the 50 trees has a full v16 tree (8 nodes, real content at every depth). A
  test asserts it.
- **CP23's rules** (the screen is H70's): branches swap freely outside fights and **her equipped skills follow**: with
  Rend equipped, taking B puts Rending Combo in its slot (same depth, the other line).
- **SB16:** the band stays; the balance harness reads Class Rank on the real pace (H71). Here `balanceMember` only learns
  to build a v16 Uma.

**This packet's decisions:**
- **Where the branch lives.** `RpgProfile.lines?: Partial<Record<RpgWeapon, 'B'>>` (absent, or a tree not listed: A).
  `RpgBranch = 'A' | 'B'` (R4 widens it to `'C'`). From v16 a profile's `tree` and `legacy` are empty (H64).
  `BattleAlly.lines?` the same, v16 only: its keys are among her three weapons, its values `'B'`; refused before v16.
- **The B table** is data in `rpg/node-identity.ts` (`RPG_BRANCH_B`, the side letter by class and kind, and
  `RPG_BRANCH_B_NAME`, the line's name for H70's sheet), so the save parser (H69) reads it without the catalog.
  `rpgBranchNode(classId, weapon, depth, branch)` gives a node id: depths 1–2 the trunk, 3–5 the core (A) or
  `.${depth}${RPG_BRANCH_B[…]}` (B).
- **Held skills.** `rpgHeldSkills(profile, engine)` (v16): her three weapons' trees, every open depth, her branch's node.
  `rpgLearnedSkills`, `rpgUsableLoadout` and `rpgAutoLoadout` take `engine` and read held skills from v16 (no legacy,
  no sides); to v15 they are today's. The auto loadout from v16: each weapon's deepest held skill in turn (a hybrid's
  halves alternating, her larger half first, as today), up to her slots.
- **Equipped slots:** `rpgActiveSlots(level, engine)`; `RPG_ACTIVE_SLOT_GATES` and `RPG_MAX_ACTIVE_SLOTS` the live
  generation's (today's 10 until H72).
- **Skill Ranks** in `rules.ts` (the screens read them): `RPG_SKILL_RANK_FACTOR = [0.95, 0.975, 1, 1.025, 1.05]`,
  `rpgSkillRank(depth, classRank)` (0 while closed), `rpgSkillRankNextAt(depth, classRank)` (the Class Rank of the next
  rank, null at 5) and `rpgSkillRankFactor(depth, classRank, engine)` (1 before v16).
- **"Frozen into a fight's input" (CP32) is the input's `classRank`.** The input already freezes her Class Rank, which
  fixes every rank, so the engine derives each rank from it with the fight's version; no new input field. Why: one source
  of truth (an input can't carry a rank its Class Rank contradicts), and a change to the band is a new engine version
  anyway. Replays stay exact.
- **Node data by generation.** `RpgNode.skill16?: RpgSkillDef`: the def engine v16 plays where it differs (Pierce's 30
  nodes, the Paladin's two), read through `rpgNodeSkill(node, version)` (`version >= 16 && node.skill16 ? node.skill16 :
  node.skill`) by the engine, `limit.ts`, `auto.ts` and `linger`. `node.skill` stays v15's for replays. Names and
  summaries are presentation and follow the live generation at module load, as the Knight Captain does (H55): an old
  fight may show the new name. `RPG_VALKYRIE_OATH_NODE` becomes `rpgValkyrieOathNode(engine)`.
- **The ranked def.** `battleSkillFor(ally, ref, version)` from v16: known means held (her branch, open depth) and
  equipped; its `def` is `rpgNodeSkill(node, version)` with every hit's power (`hits`, `focus`, `splash`, `other`) and
  `support15`'s `share` and `shieldShare` × her rank's factor; MP from the unranked def as today. One helper
  (`battleNodeDef(ally, node, version)`) builds it for `battleSkillFor` and for `linger`'s v16 farewell, which reads her
  summon as she cast it.
- **Limit Breaks by generation.** `heroes.ts` gains `BY_V16` (v15's map with `paladin-3` and `cleric-1` as above);
  `heroLimitFor(id, version)` reads it from v16; `HERO_LIMITS`, `heroLimit` stay the live generation's.
- **The tree model for the screen** (H70 draws it; testing it here keeps the web thin): `rpg/tree-view.ts`,
  `rpgTreeView(profile, loadout, engine)` → `{ root: { classId, hand }, trees: [{ weapon, tree, branch, bName, nodes: [{ id,
  name, depth, line: 'trunk' | 'A' | 'B', held, open, gate, rank, nextRankAt, equipped }] }] }`, one entry per slot.
- **The skill-rank-up for the result sheet:** `rpgSkillRankUps(profile, beforeClassRank, afterClassRank, engine)` → the
  held skills whose rank rose, with the new rank ("Cleave reached Rank 3").
- **Branch swap, pure:** `rpgSwapBranchLoadout(loadout, classId, weapon, to)` maps that tree's depth 3–5 ids to the other
  line's at the same depth, keeping order. H69's `pickBranch` uses it.
- **Side points end at v16.** `umaUpgrades`' `points` is 0 from the live v16 (no side skills), so the Skills tab's dot
  reads only gear. The learning functions stay v15's; H69 refuses `learnSkill`/`forgetSkill` from v16.
- **The balance harness builds a v16 Uma** (`balanceMember(…, { engine: 16 })`): no sides, branch A, held skills, v16
  slots, three default weapons. Class Rank on the real pace, kits and targets are H71's.
- **No save change, nothing on screen.** Every live list (`RPG_NODES`, `HERO_LIMITS`, the slot gates) is today's until
  H72, so `pnpm docs:update` leaves no diff.

## Do

1. **`rpg/node-identity.ts`:** `RPG_BRANCH_B`, `RPG_BRANCH_B_NAME`, `RpgBranch`, `rpgBranchNode`.
2. **`rpg/rules.ts`:** `RpgProfile.lines`; `rpgHeldSkills`; `engine` on `rpgLearnedSkills`, `rpgUsableLoadout`,
   `rpgAutoLoadout`, `rpgActiveSlots`; the Skill Rank functions and factors; `rpgSwapBranchLoadout`; doc comments on the
   side-point functions ("v6–v15").
3. **`rpg/catalog.ts`:** `RpgNode.skill16` and `rpgNodeSkill`; Pierce's 30 `skill16` defs and live names; the Paladin's two
   nodes; the Summoner's Axe names; `rpgValkyrieOathNode`. `describe` summarizes the live generation's def.
4. **`rpg/heroes.ts`:** `BY_V16`, `heroLimitFor` by generation, blurbs as above.
5. **The engine** (`skills.ts`, `engine.ts`, `limit.ts`, `auto.ts`, `types.ts`): `BattleAlly.lines` (v16 only, its keys
   among her weapons); the loadout's length by `rpgActiveSlots(level, version)`; known skills and the ranked def from
   v16; every `rpgNode(id).skill` read in a fight through `rpgNodeSkill(node, version)`.
6. **`rpg/tree-view.ts`:** `rpgTreeView`, `rpgSkillRankUps`.
7. **`save/upgrades.ts`** (points 0 from v16) and **`world/balance-party.ts`** (a v16 Uma).
8. **Tests:**
   - `rpg/trees-v16.test.ts` (switch mocked to 16 with `capsAt` for the live names): the B table matches §6.5 (the spot
     checks above, all 50 trees' B line at d3); every tree has 8 v16 nodes with hits, a status or a support at every
     depth (CP43); `rpgHeldSkills` at Class Rank 1, 10, 25 and 40, with A and with B; the Skill Rank table (d1: Rank 1 at
     1, 5 at 9; d3: 0 at 19, 1 at 20, 2 at 22, 5 at 28) and factors; `rpgActiveSlots` v15 (10 at Lv 40) and v16 (3, 4 at
     Lv 10, 7 at Lv 40); the v16 auto loadout of a Spell Blade alternates Arms and Tome; swapping branch maps Rend to
     Rending Combo and keeps order; `rpgTreeView` of a Class Rank 22 Brawler with Lance on B; names: Piercing Mystic
     Cleave, Valkyrie's Oath on `paladin-tome-light.3b`, Heavy Transfix on `paladin-lance.4b`, Marauder, Jotun King.
   - `rpg/battle/engine-v16-trees.test.ts` (explicit v16 inputs): a B skill equipped without `lines[w] = 'B'` throws
     `Invalid battle ally`, and with it plays; `lines` naming a weapon she doesn't slot throws; eight equipped skills at
     Lv 40 throw; the same skill deals ×1.05 ÷ ×0.95 more at Class Rank 48 than at 40 (compare the hit cues of two fixed
     fights); a healer's mend scales the same; a Pierce hit on an unbroken foe deals about twice an equal-power hit
     without it, and an Arms Pierce lands two hits; in v16 Valkyrie's Oath on `paladin-tome-light.3b` revives and
     `paladin-lance.4b` doesn't, in v15 the reverse; Rampart Charge's hit is `axe` in v16 and `greatsword` in v15; Choir of
     Angels hits `light` then `lightning` in v16; a Hero's Limit Break deals the same at Class Rank 41 and 49.
   - Both replay fixtures pass live and mocked to 16, untouched.
9. **Docs:** implementation.md §3: "Built: H65 (D…)". The D-row (fetch `main` first). `pnpm docs:update` leaves no diff.
10. **Check it locally** (390×844, desktop browser, scratch save): the Skills tab and a world-map fight on Auto as
    before (sides and points still there, `"version": 15`).

## Done when

- [ ] `pnpm lint && pnpm test && pnpm build` pass; say the main JS number.
- [ ] The tests in step 8 pass; both replay fixtures pass live and mocked to 16.
- [ ] Nothing in a fight reads `node.skill` or a live list directly (grep `rpgNode(`, `.skill` and `HERO_LIMITS` in
  `rpg/battle/`).
- [ ] `docs/game/` is unchanged, `pnpm docs:update` leaves no diff, the D-row is logged.
- [ ] The local check in step 10 was done and described. Nothing from the original games in git.
- [ ] Deployed green and https://uma-rpg.web.app/api/health shows the commit.

## Deliver

- **Claude, as a delegated worker:** a pull request from `feat/h65-trees-v16` with one commit,
  `feat(domain): Tier 1's trees on engine v16, Skill Ranks and Pierce, dark (H65)`. H66 (the generators) and H67 (the
  template) run beside it; you share no files but possibly `rpg/kinds.ts` (H66 adds the twins): rebase on whichever lands
  first. Fetch `main` before you push. The main session reviews and merges it, then watches the deploy.
- **Flag it done:** after the merge, a `docs(handoff): H65 done (D…)` commit deletes this file, sets H65 to Done with a
  Done row, and sets H69 to Ready if H67 is done, H71 if H66 and H68 are.
