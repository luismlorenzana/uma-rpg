# H126 — Classes v3 in the domain: the class tree, Tier 0 and promotion, the calling by style, engine v19 (dark)

**uma-rpg · Claude · L · Needs: H136 · Unblocks: H128, H129, H130, H131, H120 (amended), H123 (amended); through them H132, H133, H134**

## Why

Classes v3 (D240, [classes-v3.md](../../design/classes-v3/classes-v3.md)) turns six free classes into **one tree of
thirteen**: five Tier 0 classes that every Uma starts in and that promote at Class Rank 10 into eight Tier 1 classes, two
of them new. It rides **engine v19 and save v32**, built dark and turned on by one switch packet (H134), with Halls v2
(D241) on the same versions. Every later packet needs things that don't exist yet:

- the **`classes` stage** at engine v19, with v6–v18 fights proven to replay exactly whatever the switch says;
- **the 13 class ids** and the tree: parents, children, roots, families, the suggested promotion;
- **Tier 0**: its ladder (Class Rank 1–10 at twice today's curve), its one skill on any of three weapons of any kind, its
  power by Class Rank, no lean, its offense by its slots, the EXP that waits past Rank 10;
- **the promotion and reclass rules** (CV8, CV9) over today's save shape;
- **the two new hybrids**, the Tome Spellblade and the Arms Summoner: slots, hands with a *data* lead half, leans,
  defaults, presets and trees;
- **the calling by running style** (CV19), **one trade a Tier 0** (CV20), **templates 5 × 3** (CV21);
- **the Rift's builds by family** (CV23) and **one healer a party** with Tier 0 as no healer (CV22).

This packet builds them and nothing a player sees. It also logs Classes v3's build decisions, which H127–H134 follow,
and fixes the names and shapes the other packets build on ([Names other packets read](#names-other-packets-read)).

## Context (read first)

- `CLAUDE.md`, `AGENTS.md`, [change-protocol.md](../../change-protocol.md); D238–D241 in [decisions.md](../../decisions.md).
- **The design, in full:** [classes-v3.md](../../design/classes-v3/classes-v3.md) §0 (the thirteen and their ids), §1 (CV1),
  §2.1–§2.6 (CV3, CV5–CV8, CV10, CV11), §3 and §3.1–§3.8 (CV4, CV15–CV18), §5 (CV19), §6 (CV20), §7 (CV9), §9 (CV21),
  §10 (CV23), §11 (CV22), §13, §15, §16, §17; the previews [class-tree.html](../../design/classes-v3/previews/class-tree.html)
  and [promotion.html](../../design/classes-v3/previews/promotion.html). From [halls-v2.md](../../design/classes-v3/halls-v2.md):
  §3.1 (a Tier 0's open depth is her skill's power at her Class Rank) and §8.
- **The manual of the live game:** `docs/game/classes.md`, `skill-trees.md`, `combat.md`, `loops.md` (Class Rank, Manuals),
  `materials.md` (trades), `heroes.md`, `architecture.md` (the save).
- **How a generation was added before:** the Paladin as classes v2's sixth class (D179; `git show
  5dd9f08:docs/handoff/tasks/H53-engine-v15-foundation.md`), R1's foundation and its replay fixture (H64, H69 and H72's
  Done rows in [docs/archive/handoff-history.md](../../archive/handoff-history.md)), and H83's layout (`git show
  4f0a1bf:docs/handoff/tasks/H83-engine-v19-weapon-branches.md`; R3's v19 was removed by D238, so v19 is free).
- **The code** (line numbers on `main` at `b9ce7c5`):
  - `rpg/battle/caps.ts`: `BATTLE_ENGINE_VERSION` 18 (:33), `RPG_REWORK_ENGINE` (:40, with stale `t2Weapons: 19`,
    `t2Classes: 20`, `t3: 21`), `rpgRework` (:45), the one-switch header (:12–:30); `caps-at.fixture.ts` (`capsAt`).
  - `rpg/kinds.ts`: `RPG_ALL_CLASSES` (:24), `rpgClasses` (:28), `RPG_CLASSES` (:32), `RPG_HEALERS`/`rpgIsHealer` (:34–:36),
    `RpgTreeId` (:38).
  - `rpg/rules.ts`: `byGeneration`/`byRework` (:84–:89), slots (:93–:121), `RPG_CLASS_ARMOR` (:126), `rpgPicksWeapons`
    (:136), defaults (:138–:162), `validRpgWeapons` (:166), `rpgDefaultClass` (:178), leans (:183–:204), `RpgHand` and the
    hands (:216–:247), `rpgOpenDepth` (:363), `rpgBaseMpRegen` (:367), `rpgSkillRankFactor` (:405), `rpgHeldSkills`
    (:465), `rpgAutoLoadout` (:500).
  - `rpg/node-identity.ts`: `rpgClassWeapons` (:10), `RPG_BRANCH_B` (:37), `RPG_BRANCH_B_NAME` (:46), `rpgBranchNode`
    (:58), `rpgNodeLine` (:67), `validRpgLines` (:74), `rpgNodeIdentity` (:81, the grammar).
  - `rpg/catalog.ts` (a lazy chunk): `RpgNode` (:86), `addTree` (:170), the Summoner's `SUMMONS` and `summon` (:297–:357),
    the Spell Blade's `BLADE_HITS`, `BLADE_NOUN`, `bladeCapstone`, `RPG_PIERCE_SCALE` (:361–:388), `RPG_ALL_NODES` and
    `RPG_NODES` (:473–:476), `rpgNodeSkill` (:482), `rpgRankedSkill` (:487).
  - `rpg/tree-view.ts`: `rpgTreeView` (:41), `rpgSkillRankUps` (:64).
  - `rpg/battle/engine.ts`: `VERSIONS` (:49), `validAlly` (:133), `MAX_FOES` (:217), `validateInput` and its healer
    backstop (:218, :234), the MP regen call (:838), `resolveHalf`'s extra hit and stay (:1059, :1064), the pair's order
    (:1149); `battle/skills.ts` `battleNodeDef` (:63); `battle/limit.ts` the open depth's power (:51); `battle/auto.ts`
    `tomeLeads` (:121); `battle/types.ts` the version unions (:160, :206).
  - `rpg/heroes.ts` `POWER_V1`/`POWER_V2` (:17–:18); `rpg/hero-id.ts` `HERO_HALLS` (:31).
  - `economy/ranks.ts`: `classExpToNext` (:95), `grantTrack` (:108), `MANUAL_EXP` (:154).
  - `economy/planet.ts`: `PROWESS_SPLIT` (:76), `prowessSplit` (:87), `MoonTemplate`/`moonTemplate` (:95–:100), `mapPoints`
    (:109); `economy/grades.ts`: `gradePoints` (:79), `armorHalf` (:90); `economy/professions.ts`: `CALLING_TRADE` (:70),
    `umaTrade` (:88), `tradeResolver` (:95).
  - `roster/template.ts`: `UMA_TYPE_NAMES` (:50), `UMA_ROW_CALLING`/`UMA_ROW_PICK` (:86–:92), `umaCallingRow` (:108),
    `umaCallingPick` (:143), `umaCalling` (:149), `umaTemplate` (:168), `umaFlourishActive` (:175),
    `umaCallingPickBlock` (:185); `roster/template-release.test.ts` (the local-only, counts-only release test).
  - `save/class.ts`: `startingClass` (:32), `activeClass` (:41), `classOf` (:47), `healerBlock` (:63).
  - `save/battle.ts`: `umaProfile` (:64), `chooseClass` (:90), `pickCalling`/`confirmCalling`/`callingConfirmed`
    (:178–:206), `umaPointParts` (:220), `umaFlourish` (:284), `partyMembers` (:295), `fillRanks` (:429).
  - `save/exchange.ts`: `manualBlock` (:198), `readManuals` (:209); `save/presets.ts`: `CLASS_PRESET_ACCESSORY_V3` (:66),
    `classPresetV3` (:78), `presetKind` (:85); `save/rift.ts`: `ascend`'s arrivals (:598); `save/sheet.ts` `CLASS_NAME` (:22)
    and its MP regen (:82).
  - `rift/fronts.ts`: `PARTY_V1`/`PARTY_V2`/`riftParty` (:25–:42), `BUILDS_V16`/`riftGuidedBuild` (:47–:61).
  - `world/balance-party.ts` kits (:36, :52, :66); `docs/render.ts` `CLASS_NAME` (:83), `RETIRED_LIMIT_OF` (:96).
  - The web's `Record<RpgClass, …>` tables: `apps/web/src/battle/labels.tsx` (:17–:51), `places/observatory/ObservatoryPage.tsx`
    (:182), `save/trade.ts` (:22); the 32 `activeClass(` call sites, 22 in the web (`grep -rn "activeClass(" apps/web/src packages/domain/src`).
  - The replay fixtures and tests: `rpg/battle/v14-replays*` to `v17-replays*` (the v17 pair is the model for v18's).
  - The Branch Gem's two gates read the stale stage: `items/stock-id.ts:11`, `work/kinds-v4/make.ts:20`.

## Decisions made

### Classes v3's build decisions (H126–H134 follow them; logged as one D-row before this packet's)

1. **One stage, one switch.** Classes v3 and Halls v2 are engine v19 and save v32 under the stage **`classes`**
   (`RPG_REWORK_ENGINE.classes = 19`). Every rule of either reads `rpgRework('classes', engine)`: the engine with the
   fight's version; rules outside it with `engine = BATTLE_ENGINE_VERSION`; the save's parse and new saves follow the live
   stage (R2's pattern, H78). **H134 alone** moves `BATTLE_ENGINE_VERSION` 18 → 19 and `SAVE_SCHEMA_VERSION` 31 → 32 and
   chains `toV32`, in one commit. v6–v18 fights replay exactly (this packet's v18 fixture).
2. **The stale stages go.** `RPG_REWORK_ENGINE` becomes `{ fight: 16, economy: 17, weak: 18, classes: 19, t2Weapons:
   Infinity }`: `t2Classes` and `t3` are removed (nothing reads them); `t2Weapons` stays, at `Infinity`, because the
   Branch Gem's two gates read it and must stay shut at v19; the Tier 2 re-plan gives it an engine. Why: D238 removed
   R3–R5, and their 19–21 would otherwise switch on with this release.
3. **A class is a generation row.** The seven new ids join `RPG_ALL_CLASSES` last, as the Paladin did (D179), so no
   list's order moves; `rpgClasses(engine)` gives each generation's (five to v14, six v15–v18, thirteen from v19); the
   live `RPG_CLASSES` stays six until H134. A row for a new class in an older table holds its v19 values: the type needs
   it, and no older fight or save has her.
4. **Tier 0 exists only in Tier 1's world** (CV10). In a Tier 2 or 3 world every Tier 1 class is open from Class Rank 1
   and no Tier 0 class appears anywhere (rules, parse, engine).
5. **The manual describes the deployed game:** dark packets leave its rules alone and `pnpm docs:update` gives no diff (a
   code fact the architecture page states, like `caps.ts`'s stages, follows the code);
   each packet adds a "Built in H1xx (D…), live from H134." line to the design section it builds. H134 rewrites the manual.
6. **Screens stay inert until H134.** A screen packet previews with a local switch never committed (`caps.ts` 19,
   `version.ts` 32, `migrateWorld` chaining `toV32`). Player-facing class names come from one domain table,
   `rpgClassName(classId, engine)`; no screen shows a v3 name before H134.
7. **Waves:** H126 ∥ H127 → H128 → H129 → H130 ∥ H131 → H132 ∥ H133 → H134; H120 and H123 any time after H126 (with
   profile v2's H119 and H127's emblems). H129 needs H128's volley constants; H130 needs H129's seat ids; H131 measures
   H126, H128 and H129 together; H132 reads H130's record; H133 needs H129's halls and H130's merge.

### The design's calls this packet builds, with their values

**The thirteen (CV1–CV4).** Ids are one lowercase word (the node grammar). Display names from v19:

| Id | v19 name | Tier | Root | Parents | Children, in the promotion sheet's order |
|---|---|---|---|---|---|
| `recruit` | Recruit | 0 | Warrior | — | `brawler`, `spellblade`, `armsummoner` |
| `duelist` | Duelist | 0 | All-Rounder | — | `spellblade`, `tomeblade` |
| `acolyte` | Acolyte | 0 | All-Rounder | — | `paladin`, `cleric` |
| `caller` | Caller | 0 | All-Rounder | — | `armsummoner`, `summoner` |
| `apprentice` | Apprentice | 0 | Mage | — | `mage`, `tomeblade`, `summoner` |
| `brawler` | Brawler | 1 | — | `recruit` | — |
| `spellblade` | Arms Spellblade | 1 | — | `recruit`, `duelist` | — |
| `armsummoner` | Arms Summoner | 1 | — | `recruit`, `caller` | — |
| `paladin` | Paladin | 1 | — | `acolyte` | — |
| `cleric` | Cleric | 1 | — | `acolyte` | — |
| `summoner` | Tome Summoner | 1 | — | `caller`, `apprentice` | — |
| `tomeblade` | Tome Spellblade | 1 | — | `duelist`, `apprentice` | — |
| `mage` | Sorcerer | 1 | — | `apprentice` | — |

Roots are labels with no id, rank or rules: `'warrior' | 'all-rounder' | 'mage'`, shown "Warrior", "All-Rounder",
"Mage" (CV2). The parents' order above is the gate text's ("Opens with Recruit R10 or Caller R10").

**Tier 0 (CV5–CV7).**

| Rule | Value |
|---|---|
| Class Rank | 1–10. EXP to next **2 × (120 + 16 × rank)**: 272, 304, 336, 368, 400, 432, 464, 496, 528; **3,600** to Rank 10 |
| Past Rank 10 | The EXP **waits** on her Tier 0 track, up to **23,680** (what Ranks 10–50 take); beyond it, Class Marks at half rate |
| Her skill | One per class, the same numbers for all five: **Recruit Drill Strike, Apprentice Primer, Duelist Feint, Caller Beckon, Acolyte Vigil**. One foe, one hit of her weapon's kind, **10 MP** at every rank, no rider, special, status or support |
| Its power by Class Rank 1–10 | **1.52, 1.60, 1.67, 1.75, 1.82, 1.90, 1.97, 2.05, 2.12, 2.20** (no Skill Rank on top) |
| Trees | One node per weapon: `recruit-greatsword.1` … `acolyte-tome-dark.1` (50 nodes); she holds her three weapons' |
| Slots | Three, **any** of the ten, all different |
| Defaults | Recruit Greatsword, Axe, Lance · Apprentice Fire, Blizzard, Thunder Tomes · Duelist Katana, Lance, Thunder Tome · Caller Dark Tome, Blizzard Tome, Axe · Acolyte Light Tome, Blizzard Tome, Bow |
| Hand | ×1 on both channels, one act a turn, MP ×1, no pair |
| Lean | ×1 on HP, ATK, M.ATK, DEF, M.DEF and MP |
| Prowess and armor's offense | **A third a slot to its channel** (3 Arms all ATK, 2 Arms + 1 Tome two thirds ATK, …) |
| Base MP regen | Depth 1's: 1% of her max MP a round, at every rank |
| Healer | No (CV22): an Acolyte deals damage like the rest |
| Limit Break | Her open depth's power is her skill's at her Class Rank (Halls v2 §3.1); scale 1 (H129) |
| Preset form | Recruit Bell (Greatsword), Apprentice and Duelist Pendant, Caller and Acolyte Orb (Blizzard Tome); her ★ family first, as today |

**The eight Tier 1 classes (CV4, CV15–CV18).** The four kept classes keep today's numbers; the two new ones mirror.

| Class | Slots | Defaults (v19) | Hand: arms · tome · MP · lead · extra hit · linger | Lean HP ATK MATK DEF MDEF MP | Prowess ATK % | Armor half | Preset form |
|---|---|---|---|---|---|---|---|
| `brawler` | Arms ×3 | Greatsword, Axe, Lance | 1 · 1 · 1 · — | 1.15 1.1 0.9 1.1 0.9 0.8 | 100 | physical | Bell (Greatsword) |
| `spellblade` | Arms, Arms, Tome | Katana, Lance, Thunder | 0.72 · 0.44 · 0.5 · **arms** · yes | 1 1.1 0.95 1 1 1 | 70 | physical | Pendant |
| `armsummoner` | Arms, Arms, Tome | **Bow, Axe, Dark** | **0.62 · 0.50 · 0.5 · arms** · no · 0.3 | **1 1.1 0.95 1 1 1** | **70** | **physical** | **Orb (Bow)** |
| `paladin` | Arms, Arms, Tome | Greatsword, Axe, Light | 0.5 · 0.5 · 0.6 · — | 1 1 0.8 1.15 1 1.3 | 80 | physical | Pendant |
| `cleric` | Tome, Tome, Arms | Light, Blizzard, Bow | 0.5 · 0.5 · 0.6 · — | 1 0.8 1 1 1.15 1.3 | 20 | magical | Orb (Ice) |
| `summoner` | Tome, Tome, Arms | **Dark, Blizzard, Axe** | 0.50 · 0.62 · 0.5 · tome · no · 0.3 | 1 0.95 1.1 1 1 1 | 30 | magical | **Orb (Ice)** |
| `tomeblade` | Tome, Tome, Arms | **Light, Thunder, Katana** | **0.44 · 0.72 · 0.5 · tome · yes** | **1 0.95 1.1 1 1 1** | **30** | **magical** | **Pendant** |
| `mage` | Tome ×3 | Fire, Blizzard, Thunder | 1 · 1 · 1 · — | 0.9 0.9 1.15 0.9 1.1 1.3 | 0 | magical | Pendant |

New in bold. The Tome Summoner's defaults (were Dark, Light, Bow) and preset Orb (was Light) change at v19 only.

**The new trees (CV17).** Eight nodes a tree, the lines only (no unused side node: these classes have no older
generation): depths 1–2 the trunk's cores, 3–5 line A's cores and line B's.
- **Tome Spellblade**, ten trees, the Spell Blade's rule (`BLADE_HITS`, `bladeCapstone`: Burn, Enfeeble, Shock, Armor
  Break 1 at depth 5; Katana and Light ×1.3 on a Broken foe; Dark ×1.3 below half HP). Names: depth words **Edged · Honed ·
  Whetted · Gleaming · Sovereign**, kind words **Pyre, Frost, Volt, Lumen, Umbra** on her Tome trees and the Spell Blade's
  **Cleave, Hew, Thrust, Shot, Draw** on her Arms trees ("Edged Volt" … "Sovereign Volt"). Line B is **Pierce** on every
  tree, ids `.3b`–`.5b`, named "Piercing Whetted Volt" …, with the Spell Blade's v16 Pierce def (one hit at
  `RPG_PIERCE_SCALE` × the depth's power, +2 MP, `special: 'pierce'`).
- **Arms Summoner**, ten trees, the Summoner's `summon()` on every kind with the Summoner's names (`SUMMONS`) and depth
  riders. Lines mirrored: **Bonded on her Arms trees** (side `b`: linger 0.4, +2 MP; "Bonded Axe Ogre" at depth 3),
  **Pack on her Tome trees** (side `a`: one more hit at ×0.95; "Vampire Knight Pack" at depth 3).
- **Shapes:** both are built here on today's per-kind shapes; H128 moves every class's Bow, Katana, Light and Dark to v19's
  (doubles and volleys), and since these two classes have no older generation H128 changes their `skill` in place.

**The calling (CV19)**, from her best running styles alone (every style at her top grade), the first row that fits; no
Power, Wit or distance; **no pick** from v19:

| Row | Her best styles | Calling |
|---|---|---|
| 1 | Front among them | `recruit` |
| 2 | Pace alone | `duelist` |
| 3 | Pace with Late or End | `apprentice` |
| 4 | End among them (Late + End, or End) | `caller` |
| 5 | Late alone | `acolyte` |

On today's release: **Recruit 47 · Duelist 72 · Apprentice 72 · Caller 33 · Acolyte 46** of 270 (re-checked
2026-10-29, counts only).

**Trades (CV20):** Recruit `physical` (Metal), Duelist `physical-hybrid` (Wood), Acolyte `healer` (Vegetables), Caller
`magical-hybrid` (Fish), Apprentice `magical` (Stone). The `TradeId`s keep their names. A class switch or a promotion never
moves a trade.

**Templates (CV21):** five callings × three strides, 75 templates. Types: Recruit Charger · Bruiser · Ironhide; Duelist
Flashblade · Spellfencer · Longblade; Apprentice Flarecaster · Spellwright · Starkeeper; Caller Beckoner · Binder ·
Shepherd; **Acolyte Lamplighter · Mender · Pilgrim**. The **★ Flourish works as any class of her Tier 0's family** (her Tier
0 and its children). **Her moon's node II by her calling's root:** Recruit DEF +8 × tier; Apprentice M.DEF +8 × tier;
Duelist, Caller and Acolyte DEF +4 × tier and M.DEF +4 × tier. Node I and the signature are unchanged.

**Promotion (CV8) and reclassing (CV9):**

| Rule | |
|---|---|
| Ready | A Tier 1 class she doesn't hold whose parent Tier 0 she has at Class Rank 10 |
| Promote | Free. The child **opens at Class Rank 10** (a track `{ rank: 10, exp: 0 }`), then the parent's **waiting EXP** flows in (it may rank her past 10; past 50 it banks as Marks); the parent keeps Rank 10 with 0 waiting; **she fights as the child**; its weapons, lines and equipped skills are its defaults |
| Siblings | Promoting into another child later is free at any time; it opens at 10 with whatever waits then |
| Held | In Tier 1's world a Tier 1 class she holds is one with a Class Rank track (always Rank 10 or more); promotions are hers for good |
| Switch | Free between the classes she holds and every Tier 0, outside fights (today's `chooseClass`) |
| Closed | "Opens with Recruit R10 or Caller R10" (her parents' names in the table's order) |
| Never | Closes a class, costs anything, or moves her calling, trade or template |
| Suggested (CV11) | Recruit → Brawler; Apprentice → Sorcerer; Duelist → Arms Spellblade if base Power > Wit, else Tome Spellblade; Caller → Arms Summoner if Power > Wit, else Tome Summoner; Acolyte → Paladin if Power > Wit, else Cleric |
| Later tiers (CV10) | Every Tier 1 class open from Class Rank 1; a Tier 0 Uma ascends as her suggested promotion |

**The Rift (CV23)**, guided builds by family, in slot order ("defaults" = her v19 defaults):

| Front | Party | Re-specced member |
|---|---|---|
| Iron | `brawler`, `brawler`, `spellblade`, `armsummoner`, `paladin` | the second Brawler: Bow, Katana, Axe |
| Arcane | `mage`, `mage`, `tomeblade`, `summoner`, `cleric` | the second Sorcerer: Light, Dark, Fire Tomes |
| Duel | `spellblade`, `spellblade`, `tomeblade`, `tomeblade`, `paladin` | the second Arms Spellblade: Bow, Greatsword, Fire Tome; the second Tome Spellblade: Dark Tome, Blizzard Tome, Axe |
| Horde | `armsummoner`, `armsummoner`, `summoner`, `summoner`, `cleric` | the second Arms Summoner: Lance, Greatsword, Thunder Tome; the second Tome Summoner: Fire Tome, Thunder Tome, Katana |

A run's twenty: Brawler 2, Sorcerer 2, Arms Spellblade 3, Tome Spellblade 3, Arms Summoner 3, Tome Summoner 3, Paladin
2, Cleric 2. Iron holds Greatsword 2, Axe 4, Lance 2, Bow 2, Katana 2; Arcane Fire 2, Ice 3, Lightning 2, Light 3, Dark 2.
The guidance that picks roster Umas by held class is H134's; this packet gives it `umaHeldClasses`.

**One healer a party (CV22):** `RPG_HEALERS` stays `paladin`, `cleric`; a Tier 0 is no healer.

### This packet's decisions

- **Engine v19 accepted, dark.** `VERSIONS`, `MAX_FOES` (8) and the version unions gain 19; the engine's header gains
  "v19 classes v3 (D240, D241), dark until H134: thirteen classes, Tier 0, hands' lead half from data; H128's shapes and
  twins, H129's Limit Breaks".
- **The hand's lead half is data** (§13): `RpgHand` gains `lead: 'arms' | 'tome' | null` and `extra: boolean` (her lead
  half lands one extra hit). Set for every generation from v15 as the code behaves today (the Spell Blade `arms` + extra,
  the v15+ Summoner `tome`), so the engine reads them from v15 with no change to any v15–v18 fight: the extra hit on the
  lead half instead of `classId === 'spellblade'` (engine.ts:1059), the lead half's summon stays instead of the Tome
  half's (:1064), the lead half resolves first instead of `hand.tome > hand.arms` (:1149); Auto's `tomeLeads` and
  `presetKind` read `lead` too. The v18 fixture proves it.
- **A class's open depth is class-aware.** New `rpgOpenDepthOf({ classId, classRank }, engine)`: a Tier 0 opens depth 1
  only, whatever her rank; anyone else `rpgOpenDepth(classRank)`. New `rpgOpenPower({ classId, classRank }, engine)`: a
  Tier 0's skill power at her rank (the table above), else `RPG_SKILL_POWER[openDepth − 1]`. `rpgHeldSkills`,
  `rpgBaseMpRegen`, the tree view and `battleLimitPlan`'s `level` (limit.ts:51, from v19) read them. `rpgBaseMpRegen`'s
  second argument becomes `{ classId, classRank }` (its two callers: engine.ts:838, sheet.ts:82).
- **Tier 0's power rides the ranked-skill path.** A Tier 0 node's def has one hit of power **1** and 10 MP; new
  `rpgSkillFactor(node, classRank, engine)` returns a Tier 0 node's power at her rank (`RPG_TIER0_POWER[min(rank, 10) − 1]`)
  and anyone else's `rpgSkillRankFactor(depth, classRank, engine)`; `battleNodeDef` (skills.ts:63) calls it. No Skill Rank
  stacks on top.
- **Tier 0 node names** are the class's skill name alone ("Drill Strike"); a screen adds the weapon ("Drill Strike ·
  Greatsword") from the node's `weapon`. Why: one skill a class (CV6), and cues already carry the weapon.
- **Slots of kind `'any'` pass by position** in `validRpgWeapons` (any of the ten, three different); Tier 0 `lines` are
  always `{}` (`validRpgLines` refuses a key: no fork).
- **The node grammar by class shape:** the six classes of v1–v2 keep 15 nodes a tree (core, a, b at five depths); the two
  new hybrids accept only their eight line nodes (`tomeblade-tome-light.3a` and `armsummoner-bow.3a` are not nodes);
  Tier 0 only `.1`. `RPG_ALL_NODES` becomes 960 (750 + 160 + 50); the live `RPG_NODES` stays 750.
- **Class tracks by tier of class.** New `grantClassTrack(track, classId, amount, engine)` in `economy/ranks.ts`: a Tier 0
  ranks on its ladder to 10, then banks up to `RPG_TIER0_BANK` (23,680) in `exp`, and returns the rest as `overflow`
  (Marks at half, as today); anyone else `grantTrack(track, 'class', amount)`. `fillRanks`, `readManuals` and the
  promotion use it; `rpgClassMaxRank(classId, engine)` (10 or 50) and `rpgClassExpToNext(classId, rank, engine)` beside it.
- **Prowess and armor's offense for a Tier 0** split by thirds of her slots in whole points, half up to ATK:
  `atk = ⌊(2 × points × armsSlots + 3) ÷ 6⌋`, the rest to M.ATK. Prowess per node (`prowessSplit(points, classId,
  weapons, engine)`); armor's offense on the five pieces' total (`gradePoints(grades, half, tier, armsThirds?)`).
  `PROWESS_SPLIT` is typed over the Tier 1 classes. `RPG_CLASS_ARMOR` gives a Tier 0 the piece half of the child whose
  defaults she takes (Recruit and Duelist physical; Apprentice, Caller and Acolyte magical): the piece shown, not her offense.
- **`RPG_TIER0_MODEL`**, the child whose defaults and preset form a Tier 0 takes: Recruit `brawler`, Apprentice `mage`,
  Duelist `spellblade`, Caller `summoner`, Acolyte `cleric`. `presetKind` and the balance kits read it for a Tier 0.
- **Her class when none is chosen depends on the world.** `activeClass(outfit, uma, tier = TIER_ONE, engine)` and
  `startingClass(outfit, engine, tier = TIER_ONE)`: from v19 a null `classId` is her calling's Tier 0 in Tier 1's world and
  its suggested promotion in later worlds; before v19 unchanged. Every caller passes its world's tier: the domain's
  (`umaProfile`, `umaLoadout`, `partyMembers`, `healerBlock`, the Rift's entrants, the sheet) and the web's 22 call sites
  (mechanical: each screen has its world's tier). Why: H130 leaves a reset Uma's class null in Tier 1's world, and Ascend
  from v19 sends a Tier 0 Uma up with a null class (below), so null must read per world.
- **Ascend from v19** (`save/rift.ts:598`): a Tier 0 `classId` arrives as `null` (her suggested promotion there); a Tier 1
  class arrives as it is; no Tier 0 track or loadout goes up.
- **The calling pick retires from v19.** `umaCallingPick` returns null, `umaCallingPickBlock` "No pick for her",
  `pickCalling` refuses with it, `confirmCalling` and `callingConfirmed` change nothing; `umaCalling(outfit, pick, engine)`
  ignores the pick. The stored field stays until H130's v32 drops it.
- **The template's tables are typed over the classes a calling can name** (`UmaCallingClass`: the six of v16–v18 and the
  five Tier 0s), so `UMA_TYPE_NAMES` and `CALLING_TRADE` have no rows for the two new hybrids. From v19 `UmaTemplate.row` is
  the v3 row (1–5, `UMA_ROW_CALLING_V3`).
- **`MoonTemplate.channel` gains `'both'`:** `mapPoints` puts ⌊value ÷ 2⌋ on DEF and the rest on M.DEF.
- **The class tree as data for the screens** (H120 builds on it): `umaClassTree(uma, outfit, tier, engine)` in
  `save/class.ts` returns one tile per class of her world (Tier 1's: all thirteen; later: the eight) with its state in
  profile v2's language (UP23): `'on'` her active class; `'available'` a held Tier 1 class or a Tier 0 she has started (a
  track or a saved setup); `'ready'` a child she can promote into now; `'open'` a Tier 0 not started; `'closed'` with its
  gate. And `promotionPlan(uma, from, to, tier, engine)` for the sheet's before → after line.
- **The display names** live in the domain (`rpgClassName`, `RPG_ROOT_NAME`) and every `Record<RpgClass, …>` label table
  (the domain's and the web's) gains the seven rows with their v3 names, unreachable until H134. The web's emblems map the
  seven to their model's emblem until H127's art lands (`ClassEmblem`'s fallback).
- **Balance kits** (`world/balance-party.ts`) gain the seven rows from their mirror (Tome Spellblade the Tome Summoner's
  magical kit, Arms Summoner the Arms Spellblade's physical one, each Tier 0 its model's). H131 measures them.
- **Hall power rows:** `POWER_V1`/`POWER_V2` (heroes.ts) gain the interim values (the hybrids 2.2, the Tier 0s 2), never
  read by an older fight and replaced at v19 by H129's per-Limit-Break power. `HERO_HALLS` gains the seven, each its family
  hall's place: `recruit` `brawler-dojo`, `apprentice` `mage-tower`, `duelist` and `tomeblade` `spell-blade-salle`,
  `caller` and `armsummoner` `summoner-circle`, `acolyte` `paladin-bastion` (H129 moves the halls to hall ids); appended,
  so `hallClass` still finds the six first.
- **v18 replays pinned:** `rpg/battle/v18-replays.fixture.json`, regenerated only with `UPDATE_V18=1`, every input
  `version: 18`, generated on `main`'s engine **before** any change here (v17's pattern): one world stage per Tier 1
  continent with R2's balance party on curve on graded gear (a Paladin in two, a Cleric in three; a Bell and an Insignia);
  a Rift Duel champion (a third act, mixed locks) and a Rift Iron stage (the ward); and enough to pin what H128 and H129
  change: a Spell Blade's extra hit, a Summoner's farewell, a Bow, a Katana, a Light and a Dark skill, a splash (the
  Brawler's Bow on line B), and Limit Breaks from a `paladin-*` and a `cleric-*` seat, by a Hero and by a Learner. Auto
  plays them; a stage that doesn't reach one of these on Auto plays a short scripted opening instead.
- **No save change.** `OwnedUma`, `TierWorld` and the parse are untouched (H130); every save rule here works on today's
  shape with the new class keys, which the live parse refuses until H134 (it reads `RPG_CLASSES`).
- **Main JS:** the tree, the names, the Tier 0 table and the template and trade rows sit in the main bundle; the trees in
  the lazy catalog chunk. Expect about +1.5 KB gzip (about 216 of 230 after H136); over +2.5 KB, move the names to the catalog chunk.

## Names other packets read

| Name | Where | Shape |
|---|---|---|
| `'classes'` | `caps.ts` | `RPG_REWORK_ENGINE.classes = 19`; `rpgRework('classes', engine)` |
| `RPG_TIER0_CLASSES`, `RpgTier0Class`, `RpgTier1Class` | `rpg/kinds.ts` | `['recruit', 'duelist', 'acolyte', 'caller', 'apprentice']` (tree order); `RpgTier1Class = Exclude<RpgClass, RpgTier0Class>` |
| `rpgClasses(19)` | `rpg/kinds.ts` | `recruit, duelist, acolyte, caller, apprentice, brawler, spellblade, armsummoner, paladin, cleric, summoner, tomeblade, mage` |
| `rpgIsTier0(classId)` | `rpg/kinds.ts` | boolean |
| `RpgClassRoot`, `RPG_ROOT_NAME`, `RPG_TIER0_ROOT` | `rpg/class-tree.ts` (new, main) | `'warrior' \| 'all-rounder' \| 'mage'` |
| `RPG_CLASS_PARENTS`, `RPG_CLASS_CHILDREN` | `rpg/class-tree.ts` | `Record<RpgTier1Class, readonly RpgTier0Class[]>`, `Record<RpgTier0Class, readonly RpgTier1Class[]>` in the tables' order |
| `rpgClassFamily(tier0)` | `rpg/class-tree.ts` | `[tier0, ...children]` |
| `rpgSuggestedPromotion(tier0, { power, wit })` | `rpg/class-tree.ts` | `RpgTier1Class` |
| `RPG_TIER0_MODEL`, `RPG_TIER0_SKILL` | `rpg/class-tree.ts` | `Record<RpgTier0Class, RpgTier1Class>`, `Record<RpgTier0Class, string>` |
| `RPG_TIER0_POWER`, `RPG_TIER0_MP`, `RPG_TIER0_MAX_RANK`, `RPG_TIER0_BANK` | `rpg/class-tree.ts` | the ten powers; 10; 10; 23,680 |
| `rpgClassName(classId, engine)` | `rpg/class-tree.ts` | "Arms Spellblade" from v19, "Spell Blade" before |
| `RpgHand.lead`, `RpgHand.extra` | `rpg/rules.ts` | `'arms' \| 'tome' \| null`, boolean |
| `rpgOpenDepthOf(p, engine)`, `rpgOpenPower(p, engine)`, `rpgSkillFactor(node, classRank, engine)` | `rpg/rules.ts` | `p: { classId, classRank }` |
| `rpgClassMaxRank`, `rpgClassExpToNext`, `grantClassTrack` | `rpg/rules.ts`, `economy/ranks.ts` | `grantClassTrack(track, classId, amount, engine): { track, ranksUp, overflow }` |
| `rpgClassGate(ranks, classId, tier, engine)`, `rpgClassOpen(…)` | `rpg/class-tree.ts` | gate text or null; boolean |
| `umaHeldClasses(uma, tier, engine)` | `save/class.ts` | the classes she may fight as now |
| `umaClassTree(uma, outfit, tier, engine)` | `save/class.ts` | `RpgClassTile[]`: `{ classId, tier: 0 \| 1, state: 'on' \| 'available' \| 'ready' \| 'open' \| 'closed', rank, waiting, gate, suggested }` |
| `promoteUma(save, outfitId, from, to, now, tier)`, `promotionPlan(uma, from, to, tier, engine)` | `save/battle.ts` | plan: `{ from, to, opens: 10, waiting, after: { rank, exp }, depths, skills, block }` (depths and skills at `after.rank`) |
| `activeClass(outfit, uma, tier, engine)`, `startingClass(outfit, engine, tier)` | `save/class.ts` | as above |
| `UmaCallingClass`, `umaCallingRowV3`, `UMA_ROW_CALLING_V3` | `roster/template.ts` | rows 1–5 |
| `umaCalling(outfit, pick, engine)`, `umaTemplate(outfit, pick, engine)`, `umaFlourishActive(t, classId, engine)` | `roster/template.ts` | by generation |
| `moonTemplate(outfit, pick, engine)` | `economy/planet.ts` | `channel: 'physical' \| 'magical' \| 'both'` |
| `umaTrade(outfit, pick, engine)`, `tradeResolver(world, outfitOf, engine)` | `economy/professions.ts` | by generation |
| `classPresetAccessory(classId, engine)` | `save/presets.ts` | the form by generation (v19 rows above) |

## Do

1. **The fixture first:** on `main` as it is (engine v18 live), write `rpg/battle/v18-replays.fixture.ts` (v17's pattern:
   spec, regeneration, `replayV18 = replayV14`) and generate `v18-replays.fixture.json` with `UPDATE_V18=1`. Keep it for
   step 12.
2. **`caps.ts`:** the `classes` stage and `t2Weapons: Infinity` (decision 2); the header's paragraph on Classes v3. Fix
   `rules-v16.test.ts:43` to the new object.
3. **`rpg/kinds.ts` and `rpg/class-tree.ts`:** the seven ids appended to `RPG_ALL_CLASSES`; `rpgClasses` by three
   generations; `RPG_TIER0_CLASSES` and the types; the new module with the tree, roots, families, model, suggestion, Tier 0
   tables, names and `rpgClassGate`/`rpgClassOpen`; re-exported from `rpg/rules.ts`.
4. **`rpg/rules.ts`:** a v19 row on slots, defaults, leans, hands (`lead`, `extra` on every generation as decided),
   `RPG_CLASS_ARMOR`; `validRpgWeapons` with `'any'`; `rpgOpenDepthOf`, `rpgOpenPower`, `rpgSkillFactor`,
   `rpgClassMaxRank`, `rpgClassExpToNext`; `rpgBaseMpRegen`, `rpgHeldSkills`, `rpgAutoLoadout` through them.
5. **`rpg/node-identity.ts` and `rpg/catalog.ts`:** the branch tables' rows (Tome Spellblade every `b` "Pierce"; Arms
   Summoner Arms `b` "Bonded", Tomes `a` "Pack"; Tier 0 none); the grammar by class shape; `rpgBranchNode` for a Tier 0's
   depth 1; the 160 hybrid nodes (`addLineTree`) and the 50 Tier 0 nodes (`addTier0Tree`). `rpg/tree-view.ts`: a Tier 0's
   trees of one node (`root.tier: 0 | 1`; its node's `rank` her Class Rank, `nextRankAt` the next up to 10, `bName` '');
   `rpgSkillRankUps` reports a Tier 0's three nodes at each new Class Rank.
6. **The engine:** v19 accepted; `validAlly` from v19: her class of the generation; a Tier 0 only with `tier` 1 and
   `classRank` 1–10; a Tier 1 class with `tier` 1 only at `classRank` ≥ 10; Tier 0 `lines` absent or empty. The lead half
   from data (three lines, every version from v15); the MP regen and the Limit Break's `level` through `rpgOpenDepthOf`
   and `rpgOpenPower` from v19; `battleNodeDef` through `rpgSkillFactor`; Auto's `tomeLeads`. Every rules call inside
   `rpg/battle/` passes the fight's version.
7. **The calling, templates, trades and moon:** `roster/template.ts`, `economy/professions.ts`, `economy/planet.ts` as
   decided, each by `engine` (default live); `economy/grades.ts` `gradePoints` with `armsThirds`.
8. **The save rules** (today's shape, by the live stage): `save/class.ts` (`activeClass`, `startingClass`,
   `umaHeldClasses`, `umaClassTree`, `healerBlock` with the tier); `save/battle.ts` (`chooseClass` refuses a closed class
   with its gate as `SaveRuleError('bad-class', …)`; `promoteUma` refuses "Tier 0 is Tier 1's" outside Tier 1's world,
   "Not one of her Tier 0's children", "Needs Recruit R10", "Already hers"; `promotionPlan`; `fillRanks` through
   `grantClassTrack`; `umaPointParts` with her slots for a Tier 0; `umaFlourish` by family; `partyMembers` with the tier;
   the calling pick's retirement); `save/exchange.ts` (`manualBlock`: a closed class refused with its gate; a Tier 0 at
   Rank 10 open until its bank is full, then "Already at the top rank"; `readManuals` through `grantClassTrack`);
   `save/presets.ts` (`classPresetAccessory` by generation, `presetKind` through `hand.lead` and a Tier 0's model);
   `save/rift.ts` Ascend from v19.
9. **The Rift:** `PARTY_V19` and `BUILDS_V19` in `rift/fronts.ts`, read from v19 by `riftParty` and `riftGuidedBuild`.
10. **Label tables and kits:** every `Record<RpgClass, …>` the typecheck names (domain and web) gains the seven rows;
    `world/balance-party.ts` kits; `heroes.ts` interim powers; `hero-id.ts` `HERO_HALLS`; the web's 22 `activeClass(`
    call sites pass their world's tier.
11. **Existing tests that meant "the six":** each `RPG_ALL_CLASSES` in a replay, balance or hall test of engine 14–18
    reads `rpgClasses(<that engine>)` (v14–v17 replay tests, `rift/balance-v15`–`v17`, `halls-v15`, `hands-v15`,
    `engine.test.ts:378`, `professions.test.ts:58`, `template.test.ts:245`, the web's `labels.test.ts`); the node counts
    (`rules-v2.test.ts:148–149` to 960 and the live 750). Nothing else in them changes.
12. **Tests:**
    - `rpg/class-tree.test.ts`: §1's parent matrix exactly; children in order; families; roots; the suggestion for each
      Tier 0 on Power > Wit, Power = Wit and Power < Wit; the ladder (272 … 528; 3,600; the bank 23,680; a campaign's
      50,960 = 3,600 + 2 × 23,680); the power table; `rpgClassName` at 18 and 19; the gate texts.
    - `rpg/classes-v19.test.ts` (engine passed explicitly): `rpgClasses(18)` six and `(19)` thirteen in order; every
      table above per class at 19 and the v18 rows unchanged (the Summoner's v18 defaults Dark, Light, Bow); hands' `lead`
      and `extra` at 15–19; `validRpgWeapons` for a Tier 0 (any three different; two of one kind refused) and the new
      hybrids' channels; §3.8's coverage (Brawler, Sorcerer, Arms Spellblade, Tome Summoner, Cleric hold all ten kinds;
      with a Paladin instead only the Bow is missing; Brawler, Sorcerer, Tome Spellblade, Arms Summoner, Paladin hold all
      ten; the five Tier 0s hold all ten); a Tier 0's open depth, power, base regen (1%) and held skills (her three `.1`s).
    - `rpg/trees-v19.test.ts`: 960 nodes, 750 live; the two hybrids' 80 nodes each, their ids, line letters, names
      ("Edged Volt", "Piercing Sovereign Volt", "Bonded Axe Ogre", "Vampire Knight Pack") and Pierce defs; the 50 Tier 0
      nodes (one hit of power 1, 10 MP); the grammar refusing `tomeblade-tome-light.3a`, `armsummoner-bow.3a`,
      `recruit-greatsword.2`, `recruit-greatsword.1a`; a Tier 0 tree view.
    - `rpg/battle/engine-v19-classes.test.ts` (inputs `version: 19`): a v18 input refuses a Tier 0 ally; a Tier 0 at rank
      11, a Tier 0 in tier 2, a Brawler at rank 9 in tier 1 refused (the same Brawler in tier 2 accepted); a Recruit's
      Drill Strike deals her Attack's damage × 1.52 at rank 1 and × 2.20 at rank 10 on one fixed state (as the engine
      rounds); a Tome Spellblade's Tome half resolves first and lands one hit more; an Arms Summoner's Arms summon stays
      and bids farewell at her next pair; an Acolyte with a Cleric is a valid party, a Paladin with a Cleric isn't; a
      Tier 0's MP regen is 1% at rank 10; a Tier 0 Hero's Limit Break total uses `rpgOpenPower`.
    - `roster/template-v19.test.ts`: every row of §5.1 and every combination of §5.2 on made-up outfits; the pick ignored;
      the fifteen types; the Flourish as each family member and off as another family's; moon node II for each root
      (`'both'` splits +8 as +4 and +4 at Tier 1). `roster/template-release.test.ts` gains a v19 block (local only, counts
      only): 47 · 72 · 72 · 33 · 46, §5.2's combinations, §9's types by stride, and none of the fifteen type words, five
      Tier 0 names, five skill names or the Tome Spellblade's 25 names equals a master-data string.
    - `economy/professions-v19.test.ts` and `economy/planet-v19.test.ts`: trades by Tier 0; Prowess and armor's offense by
      thirds (3 Arms 100%, 2 + 1 and 1 + 2 with the half-up rule, 0 Arms 0%), the Tier 1 percentages unchanged.
    - `save/classes-v19.test.ts` (the switch mocked to 19 with `capsAt`): any Tier 0 chosen at Rank 1; a closed Tier 1
      class refused with "Opens with Recruit R10 or Caller R10"; Recruit at Rank 10 with 400 waiting promotes to Brawler
      → Brawler R11 (120 on the bar), Recruit R10 with 0, she fights as Brawler; then Arms Summoner from Recruit at R10
      with nothing waiting; the worked example A's rebuild (16 Manuals on Recruit, promote → Brawler R35) and E's (28 on
      Caller: the bank caps at 23,680, 720 EXP → 360 Class Marks; promote → Tome Summoner R50); `fillRanks` past 10;
      `manualBlock`'s texts; `umaClassTree` states and the Suggested badge; `promotionPlan` (Recruit R10 with 400 waiting →
      Brawler opens at 10, after R11 with 120, depths 2, skills 6); `activeClass` with a null class in Tier 1 and Tier 2
      worlds; the calling pick refused; Ascend of a Recruit → null, her suggested promotion read in Tier 2. Unmocked, the
      same calls behave as today.
    - `rift/fronts-v19.test.ts`: the four builds, the kinds each holds, the twenty.
    - `rpg/battle/v18-replays.test.ts` (live: `rpgRework('classes')` false; every input `version: 18`; byte for byte; it
      pins every one of the six classes, a Learner, a `paladin-*` and a `cleric-*` seat, the ward, a third act, mixed locks,
      a splash and a win) and `v18-replays-live19.test.ts` (the switch mocked to 19: asserts `rpgRework('classes')`, then
      replays the v18 fixture **and every earlier one** byte for byte).
    - Every existing test passes, the step-11 edits aside.
13. **No rules call inside `rpg/battle/` relies on a default `engine`** (grep the calls you added).
14. **Docs:** two D-rows (fetch `main` first; the next free numbers): Classes v3's build decisions above, then this
    packet's. classes-v3.md §1, §2, §3, §5, §6, §7, §9 and §10 each gain "Built in H126 (D…), live from H134."
    `docs/game/architecture.md`'s `caps.ts` row (:55, "R3–R5 reserved at 19–21") reads `classes` 19, dark until H134,
    and `t2Weapons` unset until the Tier 2 re-plan: the only manual line this packet changes. `pnpm docs:update`: no diff.
15. **Check it locally** in a desktop browser at 390×844 on a scratch save from the CJS build: a Tier 1 world stage on Auto
    plays as before, the open fight in `apps/api/.data/save.json` reads `"version": 18`, and the Stable, the profile and the
    Party Hall look as before.

## Done when

- [ ] `pnpm lint && pnpm test && pnpm build` pass. Say the main JS number (gzip, of 230 KB) and this packet's change.
- [ ] Step 12's tests pass, the v18 replay tests and every earlier replay test live and at 19 included.
- [ ] No rules call inside `rpg/battle/` relies on a default `engine`.
- [ ] `docs/game/` is unchanged but `architecture.md`'s `caps.ts` row, and `pnpm docs:update` leaves no diff; both D-rows
  are logged; the design lines are in.
- [ ] Step 15's local check was done at 390×844 and described. Nothing from the original games in git (`git status`;
  the release test prints counts only).
- [ ] Deployed green (`gh run watch <id> -R luismlorenzana/uma-rpg --exit-status`), and https://uma-rpg.web.app/api/health
  shows the commit in `build`.

## Deliver

- **Claude:** a branch `feat/h126-classes-v3-domain` and one pull request, commit `feat(domain): classes v3 in the domain,
  engine v19 dark (H126)`; the body says why (one stage, dark, v18 replays pinned) and gives the main JS number. Fetch
  `main` before you push so the D-numbers are free (D240 and D241 are the approvals). After CI passes, Claude merges it and
  watches the deploy. Nothing on screen changes.
- **Flag it done:** a `docs(handoff): H126 done (D…)` commit deletes this file, adds H126's Done row to
  `docs/handoff/README.md` with the commit, and sets H128 Ready (H129, H130, H131, H120 and H123 when their other needs are
  done).
