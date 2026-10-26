# H91 — Engine v19 foundation and the class branches: the focus, the groups, the sets and the class skills (dark)

**uma-rpg · Claude · L · Needs: H90 · Unblocks: H92, H93 (and through them H94–H97)**

> **Versions re-planned by D221 (2026-10-26):** save v29 is taken (the owner's "grant is tickets only" step, live). Read
> this packet's save v29 as **v30**, v30 as **v31** and v31 as **v32**; engines unchanged.

## Why

Release 4 of the Tier rework ([implementation.md](../../design/tier-rework/implementation.md), D198) is **Tier 2's
classes**: engine v19 and save v30, built dark and turned on by H97. Its centre is the owner's second pass on class
progression: "I still don't like the class specializations in later tiers, feels like almost nothing changes." The
answer he approved (D192, CP26, CP34, CP38–CP41) is a **class branch** a class from Tier 2: a **weapon-group focus**
(+15% on the hits of one group's kinds), a **default or reverse weapon set**, and **three class skills** cast through a
focus weapon.

Every later R4 packet needs four things that don't exist yet:
- engine v19, accepted dark, with v18's fights pinned so they replay byte for byte;
- the owner's weapon groups (**Heavy, Lite, Elemental, Arcane**) and the twelve branches as data every rule reads;
- the focus as a factor in the damage stack's step 4, and in a healer's mend and Barrier shares;
- the 36 class skills and the new engine rules they need (Frenzy, guards as skills, a damage cut, the Sage's new
  element, areas whose weak foes take it at full, a farewell that strikes twice, a Barrier on herself).

This packet builds them, nothing a player sees, and logs R4's build decisions, which H92–H97 follow.

## Context (read first)

Code pointers are by file and function: Releases 1–3 move the lines. Re-read the code before starting.

- `CLAUDE.md`, `AGENTS.md`, [change-protocol.md](../../change-protocol.md), [handoff/README.md](../README.md) ("How a
  packet reads").
- **The plan:** [implementation.md](../../design/tier-rework/implementation.md) §1–§4 (R4's row, the conventions, the
  calls by packet: CP26, CP34, CP38–CP40 here); D192–D198 in [decisions.md](../../decisions.md).
- **The design**, in this precedence: [uma-templates.md](../../design/tier-rework/uma-templates.md) >
  [stat-balance.md](../../design/tier-rework/stat-balance.md) > the four standalone docs > the tier-rework README >
  history docs.
  - [class-progression.md](../../design/tier-rework/class-progression.md) **§7.2 in full** (the groups CP38, the focus
    CP39, the sets CP40, the pairings CP41, "The rules every branch shares", the twelve branch tables), §6.1 (CP14's
    "equipped skills follow"), §6.6's "Class skill" row and "Skill MP by tier", §3.2's "By weapon group", §5.2's Tier 2
    preset table (CP11), §8.2 (who the class skills reach), §16's CP26, CP34, CP38–CP41.
  - [weapon-progression.md](../../design/tier-rework/weapon-progression.md) §2.4 (WP31, the damage stack: the focus is
    a factor in step 4), §3.9 (WP13: every bonus reads a hit's own kind), §5.8 (WP25's branch 2 presets).
  - [extra-stats-progression.md](../../design/tier-rework/extra-stats-progression.md) EP29 (the weapon moons' presets
    for both sets).
  - [stat-balance.md](../../design/tier-rework/stat-balance.md) §3.1 (the ceilings), §3.5 (the fallback knobs: the
    focus +10% first), §5.1–§5.2 (the Tier 2 mirrors, SB12's healer pairs).
  - [tier2-classes.md](../../design/tier2-classes.md) §3 (the rules every class skill obeys), A4 (the names), A10
    (skill MP ×1.7 in Tier 2). Its §8 build plan (twelve class ids, passives) is **superseded**: no new class ids
    (CP26), the passives fold into the focus (CP39).
  - README §9.2, the rows marked R4.
- **The format:** H53's packet (`git show 5dd9f08:docs/handoff/tasks/H53-engine-v15-foundation.md`), which did this for
  classes v2.
- **What Releases 1–3 built** (read their packets' Done rows in `docs/handoff/README.md`, and their D-rows):
  - H64: `rpgRework(stage, engine)` in `rpg/battle/caps.ts`, `RPG_REWORK_ENGINE = { fight: 16, economy: 17,
    t2Weapons: 18, t2Classes: 19, t3: 20 }`; the three weapon slots by channel and the owner's defaults
    (`rpgDefaultWeapons`).
  - H64: `rpg/battle/caps-at.fixture.ts`'s `capsAt(version, caps)`, the shared mock every dark test uses, and the
    replay-fixture pattern (`v15-replays.fixture.ts`: the spec, `cueDigest`, the replay helper).
  - H65: trees with no points: a trunk and one A/B line a tree (`RpgProfile.lines` and `BattleAlly.lines`,
    `RpgBranch = 'A' | 'B'`, "R4 widens it to 'C'"), `rpgBranchNode`, `rpgHeldSkills(profile, engine)`,
    `battleNodeDef(ally, node, version)` (the ranked def: hits, `focus`, `splash`, `other` and the support shares × her
    Skill Rank), `rpgNodeSkill(node, version)`, Skill Ranks read from the input's `classRank`, `rpgTreeView`, the
    halls' two kinds.
  - H67/H68: `umaTemplate`, the calling, the Flourish, the base MP regen (SB18).
  - H74/H75: grades, the damage stack's order in `battleDamage` with the Insignia's factor in step 4, the presets
    (`classPreset`).
  - H83–H85: the per-weapon weak multiplier (step 3, `rpgWeakMultiplier`) in place of `BATTLE_WEAK`, `battleWeakFor`,
    `HitOptions.limit` on Limit Break hits, a Dual's partner for weaknesses and locks only, the second accessory slot and
    its branch forms, the weapon moon, Tier 2's presets for the default set. **H83's weapon branches are
    `BattleAlly.branches`**; H65's tree lines are `BattleAlly.lines` (the main session's naming, 2026-10-25). Use the names
    the code has after H90.
  - H90: engine v18 and save v29 live.
- **The code:**
  - `rpg/battle/caps.ts`: `BATTLE_ENGINE_VERSION`, `rpgRework`, the shared constants the profile reads.
  - `rpg/battle/engine.ts`: `VERSIONS`, `MAX_FOES`, `validAlly`, `validateInput`, `battleDamage` (the stack), `strike`,
    `chip`, `cast`, `resolveHalf`, `linger`, `support`, `addBarrier`, `heal`, `cover`, `guardOf`, `harm` (where a foe's
    hit lands on a guard), `applyBattleAction`, the round-end step.
  - `rpg/battle/skills.ts`: `battleSkillFor` (power by half, MP by hand and tier: today `× ref.tier`).
  - `rpg/battle/auto.ts`: how Auto picks a skill, a target and a support.
  - `rpg/battle/types.ts`: `BattleAlly`, `BattleAction`, `BattleUnit`, `BattleState`, the version unions.
  - `rpg/kinds.ts` (`RPG_KIND_PAIRS`, the kinds), `rpg/rules.ts` (`rpgHand`, `RpgProfile`, `rpgHeldSkills`,
    `rpgActiveSlots`), `rpg/node-identity.ts` (how a node id names its class and tree), `rpg/catalog.ts` (`RpgSkillDef`:
    note its existing `focus` field is Reap's extra hits on the tapped foe; don't reuse that key).
  - `save/presets.ts` (`classPreset`), `save/sheet.ts` (`umaBattleSheet`), `world/balance-party.ts` (`balanceMember`).
  - Every `Record<RpgStatusKind, …>` (tsc names them once the union grows): `STATUS_LABEL` in the web's
    `battle/labels.tsx`, `docs/render.ts`.

## Decisions made

**R4's build decisions** (the main session, 2026-10-25, for the owner, who prefers no open questions). Log them as one
D-row before this packet's own (step 10):
1. **One switch.** R4 is engine v19 and save v30, built dark: every R4 rule reads `rpgRework('t2Classes', engine)`, and
   the deployed game stays on v18 and v29 until H97 flips `BATTLE_ENGINE_VERSION`, `SAVE_SCHEMA_VERSION` and chains
   `toV30` in one commit. v6–v18 fights replay exactly, pinned by `v18-replays`.
2. **Tier 2 and later only.** Every R4 piece (class branches, class skills, branch C, the tips, ten slots, LB+, Tier 2's
   weakness lists, shields and term) applies in worlds of tier 2 or more. Tier 1 plays exactly as after R3. Until R5,
   a Tier 3 world plays Tier 2's class shape, lists and shields, × tier (SB1 between releases), and keeps R3's interim
   term with R4's offense and boss parts (H93).
3. **The owner's group names, in code and on screen** (D192's note, CP38): Arms **Heavy** (Greatsword, Axe, Lance) and
   **Lite** (Bow, Katana); Tomes **Elemental** (Fire, Ice, Lightning) and **Arcane** (Light, Dark). The design docs'
   "Ring" is Heavy + Elemental and "Light/Dark" is Lite + Arcane; neither word appears in code or on screen.
   - **The "Arcane" clash** (the Rift's Arcane front): both keep the word, always with their noun: "Arcane Tomes",
     "Arcane focus", "the Arcane front". The front keeps its id, its seals and the Arcane Purity title; the group is a
     different type (`RpgWeaponGroup`), so no lookup can confuse them.
   - **The "Heavy" clash** (Heavy Slash, the healers' Heavy B line): skill names stay (CP21). Where a group stands alone
     on screen it reads "Heavy Arms"; the tree mark reads "Heavy Arms · +15%".
4. **The twelve branches** (A4, CP40), ids and order, branch 1 first:

   | Class | Branch 1 (default, preselected) | Branch 2 (reverse) |
   |---|---|---|
   | Brawler | `berserker` Berserker · Heavy + Elemental | `warlord` Warlord · Lite + Arcane |
   | Mage | `sage` Sage · Heavy + Elemental | `sorcerer` Sorcerer · Lite + Arcane |
   | Spell Blade | `runeknight` Rune Knight · Heavy + Elemental | `blademaster` Blademaster · Lite + Arcane |
   | Summoner | `warlock` Warlock · Lite + Arcane | `conjurer` Conjurer · Heavy + Elemental |
   | Paladin | `guardian` Guardian · Heavy + Elemental | `templar` Templar · Lite + Arcane |
   | Cleric | `bishop` Bishop · Lite + Arcane | `oracle` Oracle · Heavy + Elemental |

5. **Branch 1 is preselected** (CP26): a class with no stored branch fights as branch 1, Ascend starts every class at
   branch 1, and A6's stat rule retires.
6. **Scope the plan's table didn't name, placed here:** **LB+ at Bond 10** (CP28's Tier 2 part, tier2-classes A7) in
   H92; **skill MP ×1.7 in Tier 2** (A10) in this packet, if no earlier release made it so; **the party screen's
   pairing hint** (CP41, class-progression §12's "party screen" row) in H95, from H93's helper (so H95 also needs H93).
7. **Names in code** (so "branch" keeps one meaning per object): the class branch is `classBranch: 1 | 2` (on
   `BattleAlly`, the profile and, in H94, `ClassLoadout`) and its ids are `RpgClassBranchId`; the tree's A/B/C line
   stays H65's (`RpgBranch`, widened to `'C'` by H92); the weapon's Pure or Dual stays R3's; a tip pick is `tips`; a
   class skill's weapon is the action's `via`.
8. **Docs:** dark packets leave `docs/game/` and `pnpm docs:update` unchanged and add "Built in H… (D…), live from H97"
   lines to the design docs they implement; H97 rewrites the manual.
9. **The work, in waves:** 1) H91 → 2) H92 trees, tips and LB+; H93 weaknesses, shields and the term → 3) H94 save v30;
   H96 balance → 4) H95 screens → 5) H97 the switch.

**This packet's decisions:**
- **Engine v19 is accepted, dark.** `BattleInput.version` and `BattleState.engineVersion` gain 19; `VERSIONS` and
  `MAX_FOES` gain 19 (8 foes: the Tier 2 Horde's 5–7 a wave fits). The engine's header comment gains "v19 Tier 2's
  classes (D…), dark until H97: class branches and the focus, class skills, branch C and the tips, LB+".
- **v18 replays are pinned** by a frozen fixture, `rpg/battle/v18-replays.fixture.json` with its helpers in
  `v18-replays.fixture.ts` (H64's pattern), generated on the engine **before** this packet's change: six v18 fights with their inputs, action logs, final `battleStateHash` and a cue digest (each cue's kind, actor, target,
  amount, channel, element and weak flag, in order; never labels). The six: a Tier 1 world stage (R1's trees, Skill
  Ranks, the Flourish, the base regen, R2's gear and one accessory), two Tier 2 world stages (Pure and Dual weapons, a
  Split weapon moon, two accessory slots with a Toll Bell and an Onslaught Insignia), a Tier 2 capital Final, a Rift Duel
  stage and a Tier 2 Rift Horde stage, all on Auto with inherited Limit Breaks. Two tests replay it: under the live
  engine, and in a file that mocks `caps.ts` to 19 with H64's `capsAt`. It regenerates only with `UPDATE_V18=1`, and
  a third case asserts every input says `version: 18`. R1–R3's replay fixtures stay green.
- **The groups** (`rpg/kinds.ts`): `RPG_WEAPON_GROUPS = ['heavy', 'lite', 'elemental', 'arcane']`, `RpgWeaponGroup`,
  `rpgWeaponGroup(kind)`; `RpgFocus = 'heavy-elemental' | 'lite-arcane'` and `rpgFocusKinds(focus)` (six kinds or
  four, **both channels**). Every twin pair of `RPG_KIND_PAIRS` sits in one focus. Labels (web, H95): `Heavy`, `Lite`,
  `Elemental`, `Arcane`.
- **The branches** (`rpg/branches.ts`, new, main-bundle data): `RpgClassBranchId`, `RPG_CLASS_BRANCHES:
  Record<RpgClass, readonly [RpgClassBranchId, RpgClassBranchId]>` with the ids above, `rpgBranchOf(classId, n)`, `rpgBranchFocus(classId, n)`, and `rpgBranchSet(classId,
  n)`:
  - branch 1: R1's defaults (`rpgDefaultWeapons`), unchanged (CP40: "no default changed");
  - branch 2 (CP40), lead channel first: Brawler Bow, Katana, Axe · Mage Light, Dark, Blizzard · Spell Blade Katana,
    Bow, Dark · Summoner Fire, Thunder, Greatsword · Paladin Bow, Katana, Light · Cleric Light, Fire, Greatsword.
  - Their first slots are UT9's lead weapons (Greatsword, Fire, Katana, Dark, Greatsword, Light; Bow, Light, Katana,
    Fire, Bow, Light): a test pins them, since H92's signature tip reads the first slot.
- **The focus in the damage stack** (WP31 step 4, CP39): `BATTLE_FOCUS_BONUS = 0.15` in `caps.ts` (the profile and the
  Battle tab read it without the engine; H96 may take it to 0.10, CP39's fallback). In `battleDamage`, from v19, an ally
  hit whose **own kind** (the `kind` argument: a weapon's first kind, never a Dual's partner) is in her branch's focus
  is ×1.15, after the weak multiplier, beside the Insignia's factor. It reaches every hit she makes: skills, Attacks,
  summons and farewells, splashes, a Bell's follow-up, class skills through their `via` weapon, and Limit Breaks (a hit
  of its own kinds: a Berserker's inherited Fire hit takes it, since one focus spans both channels). **The affinity
  never ships** (UT11): the focus is the only class factor in step 4.
- **A healer's focus** (CP39, SB12): from v19 a Paladin's or Cleric's mend and Barrier shares are ×1.15 when the skill's
  kind (its weapon's; a class skill's `via`) is in her focus, and **always for her class skills** (a utility class skill
  has no weapon to read; it is her branch's own). So the Guardian's Light Tome mends stay unboosted (SB12: Guardian ÷
  Bishop 0.935, inside ±10%).
- **The class branch in the input:** `BattleAlly.classBranch?: 1 | 2` (absent means 1). From v19 only, and only for an
  ally of tier 2 or more: anything else throws `Invalid battle ally`. The focus is derived from it, never frozen apart.
  `RpgProfile` gains `classBranch` (default 1).
- **Class skills are nodes** of a class tree a branch: ids `<class>-<branch>.<depth>`, depths 3, 4, 5 at Class Rank 20,
  30, 40 (`brawler-berserker.3` … `cleric-oracle.5`; R5 adds `.6`). `node-identity.ts` and `RPG_ALL_NODES` know them, so
  the save and the engine validate them as they do weapon-tree nodes. `rpgHeldSkills` (H65) holds her branch's class
  skills at open depths from tier 2 at v19, and `battleNodeDef` ranks them. They rank like any skill (CP32) and are equipped like any skill;
  18 held in Tier 2.
- **The data is class-progression §7.2's twelve tables, exactly**, their Class Rank 20, 30 and 40 rows (the Tier 3 · CR
  50 rows are R5's capstones): power in single-target units before her hand, MP full-turn before her hand. The packet
  adds how each resolves:
  - **A class skill has no weapon of its own.** The action names one, `via: RpgWeapon`: it must be a weapon she holds
    of the skill's channel, and a **focus weapon** of that channel when she holds one (CP17; any weapon of the channel
    when she holds none). It takes that weapon's first kind, channel, Might, weapon moons, weak multiplier and partner;
    the skill gives shape, power and effects. A utility skill (a stance, a guard, a party buff) takes no `via`.
  - **By class:** a pure class's skill strikes through one weapon; a **hybrid's is her pair** (the Spell Blade's Arms
    half through `via` and her Tome half through her Tome; the Summoner's Tome summon through `via` and her Arms summon
    through her Arm), each half at its hand (0.72 + 0.44; 0.58 + 0.48), the Spell Blade's Arms half landing its extra
    hit as every pair does (Blade Dance included: its "no extra ones" retired the old added hits); a **healer's** is a
    blow (an Arm) or a spell (a Tome) at her half hand, or a utility.
  - **Hits:** where the row names no count, a half or a strike lands the hits its `via` weapon's core lands at that depth
    (her kind's shape); "every foe" is the area share (0.55) and "random foes" the random bonus (1.05), as the trees.
  - **Effects are the row's only:** a healer's class blow doesn't also Barrier the most threatened, and no class skill
    carries its weapon tree's rider.
  - **MP:** the row's full-turn MP × her hand's MP (×0.6 a healer, ×1 the pure classes); a hybrid's pair class skill
    costs the row's MP once (two halves at ×0.5). Then × the tier factor below.
- **New rules** (CP34's "a few rules", v19 only, each where the rows use it):

  | Rule | Skills | Resolves as |
  |---|---|---|
  | **Frenzy** | Frenzied Swing | A self status, 2 rounds: Brave 2 on her, and the damage she takes ×1.2 |
  | **A guard as a skill** | Vigil | She guards the Uma most threatened (the shown moves) for this round and the next, as the Guard action does for a round (`guardingFor`, a lapse round) |
  | **A damage cut until her next act** | Rune Guard | The damage she takes ×0.7 until she next acts (a unit field set from v19 only) |
  | **A Barrier on herself** | Vigil (36%) | `support.shield: 'self'`, the share × her scaling (H92's Long guard reuses it at a flat 10%) |
  | **A stance** | Honed Edge | A self status, 2 rounds: her Arms half's hits on a foe with a standing shield ×1.2 |
  | **A self status** | Attune (Faith 2), Frenzy (Brave 2) | On her, 2 rounds |
  | **Aegis on the Barriered** | Unbroken Guard (Aegis 2) | On the Uma her Barrier reaches, as her Greatsword blows' Aegis does today |
  | **A new element** | Shifting Spell | +15% when her last Tome act's element differs from its own; casting it sets her last element to a marker no element equals, so two in a row both earn it. No last spell (her first act) earns nothing |
  | **Weak foes at full** | Convergence | Every foe at the area share; a foe weak to its kind takes the full power |
  | **The tapped foe at full** | Ravager's Wheel | Every foe at the area share; her tapped foe takes the full power |
  | **A spread on a Broken foe** | Conqueror's Strike | When her target is Broken, every other foe also takes a hit at the area share |
  | **A weak splash** | Rune Burst | Her Tome half also strikes every other foe weak to its element, at 0.3 of its power |
  | **Per-half reach** | Runic Storm | Her Arms half on one foe, her Tome half on every foe at the area share |
  | **×1.3 on a cursed foe** | Dread Pact | `special: 'vs-cursed'`: a foe with Mind Break |
  | **A linger override** | Lingering Call | Her Tome summon lingers at 0.5, not 0.3 |
  | **Both summons on every foe** | Gathering | Each summon at the area share on every foe |
  | **A farewell twice** | Echoing Farewell | Her Tome summon's farewell strikes every foe twice |
  | **A full-share Barrier** | Unbroken Guard | The most threatened Uma's Barrier at the depth's full share (44%), not ×0.4 |

  Everything else is today's vocabulary (Brave, Faith, Aegis, Breaker, Mind Break, Enfeeble, Hex, mends, Regen, a
  cleanse, pierce, ×1.3 on a Broken foe). tier2-classes §3 binds them all: no extra act, no Limit refund, no longer
  Break, no new damage kind, no party support from a Summoner. Name new status kinds `frenzy` and `honed` (the type
  forces label rows).
- **Skill MP by tier** (A10, class-progression §6.6): from v19 a skill's MP is × 1 · 1.7 · 2.4 by tier, in place of
  today's × tier. If an earlier release already made it so (read `battleSkillFor`), there is nothing to do here; say so
  in the delivery.
- **Auto** (`auto.ts`, from v19): a damaging class skill competes with her other skills on expected damage through its
  best `via` (the focus weapon that lands weak on the target, else her first focus weapon of the channel); a utility one
  is cast when its effect isn't already on the party (a buff, a stance) or when a shown move threatens an Uma for over a
  third of her HP (a guard, a Barrier, a damage cut), as Auto's support rule does today.
- **The presets follow the branch** (CP11, WP25, EP29): `classPreset(classId, …, branch)` gains the branch (default 1;
  branch 1 is H84's and H85's Tier 2 rows, unchanged). R3 left branch 2 to this release (H84: "Branch 2's presets come
  with R4's class branches"; H85 the same for the moon), so add them here, Tier 2 (weapon-progression §5.8,
  extra-stats-progression §5.3):

  | Class (branch 2: its set) | Accessory slots 1 · 2 | Weapon moon |
  |---|---|---|
  | Brawler (Warlord: Bow, Katana, Axe) | Great Bell · Bow (her Dual) · Channel Pendant · Bow + Axe | Split Bow + Katana |
  | Mage (Sorcerer: Light, Dark, Blizzard) | Channel Pendant · Light + Ice · Onslaught Insignia | Split Light + Dark |
  | Spell Blade (Blademaster: Katana, Bow, Dark) | Twin Orb · the Dark twins (Katana, Dark) · Onslaught Insignia | Split Katana + Bow |
  | Summoner (Conjurer: Fire, Thunder, Greatsword) | Great Orb · Fire · Onslaught Insignia | Split Fire + Lightning |
  | Paladin (Templar: Bow, Katana, Light) | Channel Pendant · Bow + Katana · Onslaught Insignia | Split Bow + Katana |
  | Cleric (Oracle: Light, Fire, Greatsword) | Great Pendant · Twin Orb · the Fire twins | Split Greatsword + Light |

  A matched Uma's preset still wears her signature family (UT8, H84's rule). Tier 1 is unchanged; Tier 3's rows are
  R5's. H94 stores the branch and H95 offers the one tap.
- **No save change, nothing on screen.** `pnpm docs:update` leaves no diff. The new data (`branches.ts`, the group
  table) is small and in the main bundle; the class skills' defs live with the catalog in the engine's lazy chunk (H62).
  Say the main JS number.

## Do

1. **`rpg/battle/caps.ts`:** `BATTLE_FOCUS_BONUS`, with a one-line comment; nothing else moves (`rpgRework` and
   `RPG_REWORK_ENGINE` are H64's).
2. **`rpg/kinds.ts`, `rpg/branches.ts`:** the groups, the focus, the branches and sets as decided.
3. **`rpg/rules.ts`, `rpg/node-identity.ts`:** `RpgProfile.classBranch`; class-tree node ids; `rpgHeldSkills` with
   class skills (tier 2 on, v19).
4. **`rpg/catalog.ts`** (or a `class-skills.ts` beside it): the 36 class skills from §7.2's tables, with summaries.
5. **The engine** (`engine.ts`, `skills.ts`, `types.ts`): v19 accepted; `classBranch` and `via` validated; the focus
   factor and the healers' shares; the new rules of the table; the tier factor on skill MP. Every rules call passes the
   fight's version.
6. **`auto.ts`:** class skills as decided.
7. **`save/presets.ts`, `world/balance-party.ts`:** the branch argument (H96 builds balance parties by branch).
8. **Tests:**
   - `rpg/battle/v18-replays.test.ts`, `v18-replays-live19.test.ts` on the fixture; the `version: 18` case.
   - `rpg/branches.test.ts`: every kind in one group and one focus; each twin pair in one focus; the twelve branches and
     their focuses as the table; both sets of every class are legal at engine 19 (`validRpgWeapons`) and lead with
     their channel; the twelve first slots equal UT9's list; every set keeps a legal Dual (R3's partner rule: a partner
     she doesn't already slot); `classPreset(…, 2)` dresses the reverse set at tier 2 and equals today's at tier 1.
   - `rpg/battle/focus-v19.test.ts`: the same Sage Fire hit on a weak foe deals ×1.15 at v19 against v18; a Warlord's
     Greatsword hit is unboosted; a Warlord's Dual Bow + Greatsword hit is boosted on its Bow (its own kind) and a
     Berserker's Dual Lance + Katana is boosted on its Lance, never through the partner; an inherited Limit Break's Fire
     hit is boosted for a Berserker; a Guardian's Greatsword Barrier is ×1.15 and her Light Tome mend isn't; a Bishop's
     Healing Circle is ×1.15; `classBranch` on a tier 1 ally at v19, or on any ally at v18, throws `Invalid battle ally`.
   - `rpg/battle/class-skills-v19.test.ts`: table-driven over the 36: at Class Rank 40 in a tier 2 input each casts, its
     power units, hits, targets and MP (× hand × 1.7) as §7.2; `via` refused when it isn't hers, isn't of the channel, or
     isn't a focus weapon while she holds one; any weapon accepted when she holds no focus weapon of the channel; each
     new rule of the table on a fixed seed (Frenzy's Brave 2 and ×1.2 taken for 2 rounds; Vigil's guard over two rounds;
     Rune Guard's cut lifted at her next act; Shifting Spell twice in a row both +15%; Convergence's weak foe at full;
     Ravager's Wheel's tapped foe at full; Echoing Farewell twice; Lingering Call at 0.5; Unbroken Guard at 44%); no
     class skill refills the gauge or grants an act.
   - `rpg/battle/auto-v19.test.ts`: Auto casts a Sage's Convergence through her Tome that lands weak; casts Rallying
     Roar once, not again while Brave holds; Vigil when a shown move threatens over a third of an Uma's HP.
   - `rpg/rules-v19.test.ts` (or R1's rules test): `rpgHeldSkills` holds her branch's class skills from tier 2 at
     Class Rank 20, 30, 40, none in tier 1 and none at v18; skill MP × 1.7 in tier 2 at v19.
   - Every existing test passes unchanged; R1–R3's replay fixtures stay green.
9. **Grep:** no rules call inside `rpg/battle/` relies on a default `engine`.
10. **Docs:**
    - Log two D-rows (fetch `main` first; the next free numbers): R4's build decisions above, then this packet's.
    - [class-progression.md](../../design/tier-rework/class-progression.md) §7.2: "Built in H91 (D…): the groups with
      the owner's names, the twelve branches, the focus in the stack, the sets and the class skills on engine v19, dark
      until H97."
    - [architecture.md](../../game/architecture.md): the `battle/` line names v19 "built behind the switch, H97".
    - `pnpm docs:update`: no diff.
11. **Check it locally** in a desktop browser at 390×844 (never the iOS Simulator; your own ports, per the master
    prompt), on a scratch save: a Tier 1 and a Tier 2 world-map stage on Auto play as before, and the open fight in
    `apps/api/.data/save.json` reads `"version": 18`.

## Done when

- [ ] `pnpm lint && pnpm test && pnpm build` pass. Say the main JS number (gzip, of 230 KB).
- [ ] The tests in step 8 pass, both v18 replay tests included; every existing test and R1–R3's replay tests pass
  unchanged.
- [ ] No rules call inside `rpg/battle/` relies on a default `engine`.
- [ ] `docs/game/` is unchanged apart from architecture.md's line, `pnpm docs:update` leaves no diff, both D-rows are
  logged and class-progression §7.2 has its line.
- [ ] The local check in step 11 was done and described. Nothing from the original games in git (`git status`).
- [ ] Deployed green (`gh run watch <id> -R luismlorenzana/uma-rpg --exit-status`), and
  https://uma-rpg.web.app/api/health shows the commit in `build`.

## Deliver

- **Claude, as a delegated worker:** a pull request from `feat/h91-engine-v19-foundation` with one commit,
  `feat(domain): engine v19 foundation and the class branches, dark (H91)`; the body says why (dark, one switch,
  replays pinned) and lists the build decisions. Fetch `main` before you push so the D-numbers are free. The main
  session reviews and merges it, then watches the deploy. Nothing on screen changes; nothing at the screen's edges.
- **Flag it done:** after the merge, a `docs(handoff): H91 done (D…)` commit deletes this file, sets H91 to Done in
  `docs/handoff/README.md` with the commit, adds a Done row, and sets H92 and H93 to Ready.
