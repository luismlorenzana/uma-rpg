# Classes in Tiers 2 and 3

> **Status: round 2, the owner's requirements, 2026-11-04. Nothing here is built.** One doc of the [Tier 2 and Tier 3
> set](README.md) (ids **T2C1–T2C30** from round 1, **T2C31–T2C64** from round 2). It builds the owner's sixteen Tier 2
> classes ([README §9](README.md#9-round-2-the-owners-requirements-2026-11-04), R2-2–R2-5, R2-12; R2-11's guardrail
> binds it) on **Tier 1 as it is live** (engine v21, save v36): eight Tier 1 classes with mirrored hybrids and two healers
> who share every number, the combat pass's three levels of buffs and debuffs (D282), sixteen Hall seats (D261), the
> owner's two party comps as presets (D263), the reclass (D290, D291) and one naming grammar (D298). Tier 1 numbers come
> from the manual or the code (`packages/domain/src`); the comps' numbers from a throwaway test on the live balance
> harness and an analytic model on top of it ([§5](#5-party-comps-r2-12)).
>
> **Pages** (desktop, light and dark): [classes by tier](previews/classes-tiers.html) ·
> [the sixteen](previews/classes-branches.html) · [trees by tier](previews/classes-trees.html) ·
> [party comps](previews/classes-comps.html) · [promotion and switching](previews/classes-promotion.html).
>
> **What it absorbs:** class-progression.md (CP), Classes v3's later-tier calls (CV), Halls v2 (HV) with D261's trim, the
> reclass (RC), skill names (SN), the archived [Tier 2 classes](../../archive/design/tier2-classes.md) (A1–A10), and this
> doc's own round 1 (T2C1–T2C30). [§3](#3-the-old-calls-call-by-call) gives every old call a status; the round-1 class
> branches, focus and reverse sets are **Superseded (R2-2)** by the sixteen classes.

## 1. At a glance

**Tier 2 promotes every Tier 1 class into two:** a **Keeper**, who keeps her parent's identity and sharpens it with one
rule, and an **Expander**, who widens it with one rule. She picks one on her Ascend into Tier 2 and switches among the
ones open to her after. **Tier 3 adds no class:** the sixteen deepen (two lines held, the crown, the master slot, her
family's mastery).

| Tier 1 class | **Keeper** · its one rule | **Expander** · its one rule |
|---|---|---|
| Brawler | **Berserker** · Momentum: +5% a stack on her own hits, a stack a turn, three at most | **Spellfist** · two Arms and a Tome, **her Tome hits on ATK** |
| Sorcerer | **Archmage** · Momentum, the same rule | **Battlemage** · two Tomes and an Arm, **her Arm hits on M.ATK** |
| Arms Spellblade | **Blademaster** · her familiar's extra hit on **both** halves | **Sentinel** · support: Armor Break and Brave and Faith on every skill of her Katana and Light, **a Barrier** after each act |
| Tome Spellblade | **Runeblade** · the same | **Enchanter** · the same as the Sentinel, magic-led |
| Arms Summoner | **Warlord** · **both** summons linger and strike in farewell | **Druid** · support: Enfeeble and Mind Break on **every foe**, her farewell **mends** every Uma |
| Tome Summoner | **Invoker** · the same | **Shaman** · the same as the Druid, magic-led |
| Paladin | **Guardian** · every status she lands **one stack more** | **Templar** · a battle healer: **×0.6** power (from ×0.5), mends and Barriers **×0.7** |
| Cleric | **Bishop** · the same | **Exorcist** · the same as the Templar |

| | **Tier 1** (live) | **Tier 2** | **Tier 3** |
|---|---|---|---|
| **Classes** | 5 Tier 0 → 8 Tier 1 at Class Rank 10 | **16**: a Keeper and an Expander a Tier 1 class; the Tier 1 classes don't play there | The same 16; no new class |
| **She gets one** | By promotion at a Tier 0's Rank 10 | **On her Ascend**, among the children of every Tier 1 class she brought to Class Rank 50 (at least 6, with Class V's three) | On her Ascend, among the Tier 2 classes she held |
| **More open** | A Tier 0 at Rank 10 (3,600 Class EXP) | **A held class at Class Rank 20** opens its parent's reclass neighbours' children (3,520) | The same |
| **Buffs and debuffs** | Three levels (D282) | **Four:** none · a path · **support** (the expanders of the hybrids) · widely | The same; a crowned capstone one stack more |
| **A weapon tree** | Trunk, then line A or B: 8 nodes | + line C; each capstone Power or Break: 14 nodes | Two lines held; crowned capstones at Class Rank 50 |
| **Class line** | — | One a class (mirrors share): 10 lines, Class Rank 20 · 30 · 40 | + its crown and her family's mastery |
| **Skills held · equipped** | 15 · 3 → 7 | 18 · 3 → 10 | 27 · 10 + the master slot |
| **Skill MP · healing scale** | ×1 · ÷ 300 | ×1.7 · ÷ 540 | ×2.4 · ÷ 780 |
| **Party value** (R2-11, analytic, Lv 50) | 0.86–1.14 a member | **+5 to +12% on her parent**, the Summoners' supports −2% with their sustain on top ([§5.4](#54-each-class-against-her-parent-the-guardrail)) | Tier 2's × the crown and the mastery |

## 2. Tier 1 as built

The baseline every later tier extends. Owned by the manual: [classes](../../game/classes.md), [skill
trees](../../game/skill-trees.md), [heroes](../../game/heroes.md), [combat](../../game/combat.md).

### 2.1 The classes

Three roots (Warrior · All-Rounder · Mage), five **Tier 0s** (Warrior, Spellblade, Healer, Summoner, Mage) that promote at
Class Rank 10 into eight **Tier 1** classes. A Tier 0 promotes into three or four, kin included (D290, D291).

| Family (hall) | Tier 1 classes | Slots | Hand: power, MP | Lean HP ATK MATK DEF MDEF MP | Limit Break scale |
|---|---|---|---|---|---|
| **Warrior** (Dojo) | Brawler | 3 Arms | ×1, MP ×1 | 1.15 1.1 0.9 1.1 0.9 0.8 | ×0.95 |
| **Mage** (Tower) | Sorcerer (`mage`) | 3 Tomes | ×1, MP ×1 | 0.9 0.9 1.15 0.9 1.1 1.3 | ×0.95 |
| **Spellblade** (Salle) | Arms Spellblade · Tome Spellblade | 2 + 1, lead channel first | 0.72 + 0.44 · 0.72 + 0.48; MP ×0.5 a half; her familiar's extra hit on her lead half | 1 1.1 0.95 1 1 1 · mirrored | ×0.95 |
| **Summoner** (Circle) | Arms Summoner · Tome Summoner | 2 + 1 | 0.57 + 0.46 · 0.57 + 0.5; her lead summon lingers, farewell on every foe | 1 1.1 0.95 1 1 1 · mirrored | ×0.95 |
| **Healer** (Sanctum) | Paladin · Cleric | 2 Arms + 1 Tome · 2 Tomes + 1 Arm | ×0.5, MP ×0.6; heals from ATK · M.ATK | 1 1 0.8 1.15 1 1.3 · 1 0.8 1 1 1.15 1.3 | ×0.8 |

A Tier 0 (one skill, any three weapons, no lean, ×1) exists only in Tier 1's world (CV10). One healer a party; a Tier 0 is
no healer (CV22).

### 2.2 The trees

70 trees (one per class and weapon), 8 nodes each: the **trunk** (depths 1–2), then **line A or line B** at depths 3–5,
free and exclusive. Names follow D298: a word a tree; Greater · Grand · Supreme before it at depths 2–4; the tree's
**capstone** at depth 5; line B is line A's name with its word after (Grand Cleave Combo). Mirrored classes share their
family's words. Live code: `rpg/node-identity.ts`, `rpg/catalog.ts`, `rpg/skill-names.ts`.

| Depth | Opens at Class Rank | Skill Ranks 2–5 at | Single-target power, Rank 1 → 5 (Rank 3) | Full-turn MP |
|---|---|---|---|---|
| 1 | 1 | 3 · 5 · 7 · 9 | 1.52 → 1.68 (1.6) | 10 |
| 2 | 10 | 12 · 14 · 16 · 18 | 2.09 → 2.31 (2.2) | 14 |
| 3 (the fork) | 20 | 22 · 24 · 26 · 28 | 2.76 → 3.05 (2.9) | 18 |
| 4 | 30 | 32 · 34 · 36 · 38 | 3.52 → 3.89 (3.7) | 22 |
| 5 (the capstone) | 40 | 42 · 44 · 46 · 48 | 4.37 → 4.83 (4.6) | 26 |

- **Line B, by family:** the Brawler's and the Sorcerer's by tree (Combo, Reap, Impale, Barrage, Draw; Wave, Spike, Bolt,
  Pierce, Barrage); both Spellblades Pierce; both Summoners Oath on her lead half's trees, Pack on the other's; the healers
  Surge (one more stack on Greatsword, Lance and Fire, a mend or Barrier ×1.15 elsewhere; the Light tree's depth 3 B,
  Grand Grace Surge, also revives).
- **Equipped:** 3 at Uma Lv 1, one more at Lv 10, 20, 30, 40 (`rpgActiveSlots`: 3 · 4 · 5 · 6 · 7).
- **MP back a round:** 1% of her max MP for each depth her Class Rank opens, five at most.
- **Shapes** (D246): Heavy (Greatsword, Fire), Sweep (Axe, Ice), Scatter (Lance, Lightning), Double (Katana, Light),
  Volley (Bow, Dark). **Twins** (v19): Greatsword–Fire, Axe–Ice, Lance–Lightning, **Katana–Light**, **Bow–Dark**.

### 2.3 Buffs and debuffs: three levels (D282)

| Class | Access | Stacks |
|---|---|---|
| Brawler, Sorcerer | **None.** Pure damage | — |
| Spellblades, Summoners | **A path:** line A of a **secondary weapon** (Katana Armor Break, Bow Enfeeble, Dark Mind Break, Light Brave and Faith) from depth 3 | 1 · 1 · 2; the debuff on the tapped foe |
| Paladin, Cleric | **Widely:** every skill of the Greatsword (Armor Break), the Lance (Mind Break) and Fire (Brave and Faith), and the same path | 1 · 1 · 2 · 2 · 3 by depth, every foe at depth 5; the path 2 · 2 · 3 |

Five statuses (Armor Break, Mind Break, Enfeeble, Brave, Faith), +10% or −10% a stack, three stacks at most, two rounds.
Aegis, Breaker, Clarity, Hex and Shatter are retired. **The words "Ring" and "Light/Dark"** name the two sides
(T2C4): the Ring weapons are the Greatsword, Axe, Lance, Fire, Blizzard and Thunder; the Light/Dark weapons, D282's
secondary weapons, are the Katana, Bow, Light and Dark.

### 2.4 Presets: the owner's two comps (D263, D266)

| Class | Standard preset (lead first) |
|---|---|
| Brawler | Greatsword, Axe, Lance |
| Sorcerer | Fire, Blizzard, Thunder |
| Arms Spellblade | Katana, Axe, Thunder |
| Tome Spellblade | Thunder, Blizzard, Katana |
| Arms Summoner | Bow, Axe, Dark |
| Tome Summoner | Dark, Blizzard, Bow |
| Paladin | Lance, Greatsword, Light |
| Cleric | Light, Fire, Lance |

**Party 1:** Brawler, Sorcerer, Arms Spellblade, Tome Summoner, Paladin. **Party 2:** Brawler, Sorcerer, Tome Spellblade,
Arms Summoner, Cleric. Each holds all ten kinds. A preset sets her three accessory slots: her armor half's stat twice and
an Orb on her first weapon's kind, her ★ family first where her weapons can use it.

### 2.5 The Halls

Five halls, **sixteen seats** (D261): Dojo 2, Tower 2, Salle 4, Circle 4, Sanctum 4. A Limit Break at 100% is **its own
power** (×1.9 to ×2.9) × **her class's scale** (×1 a Tier 0, ×0.95 the six damage classes, ×0.8 the healers) × **her open
depth's single-target power**; a Learner casts at 50% + 5% a Bond Level; at most 10 hits on one foe; no support; the
Sanctum's four carry one stack.

### 2.6 What a Tier 2 or 3 world plays today

None of the drafts is built. A later world runs Tier 1's rules × tier:

| Piece | Today in Tiers 2 and 3 | Where |
|---|---|---|
| Classes | The eight Tier 1 classes, every one open from Class Rank 1; no Tier 0; an Uma who ascends as a Tier 0 arrives as her suggested promotion | CV10, `rules.ts`, [loops § Ascend](../../game/loops.md#ascend) |
| Trees, lines, equipped | Tier 1's: 8 nodes, A or B, 3 → 7 | — |
| Gear, Extra Stats, signature | × 1.8, × 2.6 (SB1) | `economy/grades.ts`, `economy/planet.ts` |
| **Skill MP** | **× the tier: ×2, ×3** (`battle/skills.ts`: `mp × hand × ref.tier`) | Never re-planned (A10's ×1.7 was not built) |
| **Healing scale** | **×(1 + offense ÷ 300) in every tier:** ×2.16 and ×2.68 at Lv 50 | `battle/engine.ts` `healOf` |
| Halls | The same sixteen, per world, empty on arrival (Ascend leaves Bonds) | D283 |
| Class EXP | 2E a win; a campaign takes exactly two classes from Rank 1 to 50 (50,960 = 2 × 25,480) | `rules.ts` |

### 2.7 The two comps, measured (the baseline §5 reads)

A throwaway test on the live harness (`balanceMember` on curve: gear, Extra Stats, a Learner's Limit Break; every
regular, sub-boss and boss stage of the level; 6 seeds a stage; engine v21). **Tier 1 at Lv 50:**

| | Party 1 | Party 2 |
|---|---|---|
| Wins | 100% | 100% |
| Rounds: fights · sub-bosses · bosses | 3.98 · 4.84 · 7.83 | 3.89 · 4.84 · 7.33 |
| Damage share: Brawler · Sorcerer · Spellblade · Summoner · healer | 25 · 26 · 21 · 18 · 10% | 26 · 27 · 20 · 18 · 9% |
| Damage a turn | Brawler 963 · Sorcerer 1,090 · Arms Spellblade 939 · Tome Summoner 893 · Paladin 502 | Brawler 1,023 · Sorcerer 1,166 · Tome Spellblade 955 · Arms Summoner 903 · Cleric 487 |
| Party damage taken a fight (party HP 6,656) | 36 · 257 · 453 | 108 · 397 · 487 |
| Barriers absorbed a fight | 221 · 985 · 867 | 188 · 886 · 734 |
| Mended a fight | 24 · 128 · 360 | 69 · 193 · 346 |

**What the statuses are worth today** (the same test, one member's statuses taken off, everyone else unchanged):

| Taken off | Lv 30 | Lv 50 | What it says |
|---|---|---|---|
| The Paladin's (her status-free kit: Axe, Katana B, Light B) | Others' damage +4.2% with them, rounds −4% | **+9.8%**, rounds −8% | A healer's widely is worth about a tenth of the others' damage |
| The Cleric's (Light B, Blizzard, Axe) | +6.9% | **+12.3%**, rounds −9% | The same |
| The Arms Spellblade's path (Katana B) | +0.6% | +0.5%; her own −3% | A path beside the healer's same status is nearly nothing |
| The Tome Spellblade's path (Katana B) | +3.8% | **+4.3%**; her own −7% | A path no one else carries is worth a few points |
| The Tome Summoner's paths (Dark B, Bow B) | +1.1% | +0.9%; **damage taken 228 → 196** | Enfeeble saves HP more than it adds damage |
| The Arms Summoner's paths | +1.7% | +3.2%; **taken 317 → 275** | The same |

Two facts carry into §5: **on curve a Tier 1 party takes about 1% of its HP a round** (bosses 0.9–1.0%), so a healer's
mends are insurance; and **a status is worth most where no one else carries it.**

## 3. The old calls, call by call

Status vocabulary (the brief, §4): **Kept** stands as written; **Kept, changed** stands with a change a decision forces;
**Superseded** a decision or a round-2 requirement replaced it (named: D-number or R2-n); **Broken** written for a Tier 1
that no longer exists, fixed here.

### 3.1 Class progression (CP1–CP43)

| Call | What it said | Status | Why, and where it lands |
|---|---|---|---|
| CP1 | Six classes in every tier | **Superseded** | D240, then R2-2: eight Tier 1 classes, sixteen Tier 2 (T2C31) |
| CP2 | Three slots, typed by channel | **Kept** | Every one of the sixteen keeps three (T2C33) |
| CP3 | The owner's six default sets | **Superseded** | D240 (CV16) and D263; the sixteen's presets (T2C54) |
| CP4 | The campaign balanced on defaults | **Kept, changed** | D263: the owner's two comps; Tier 2's keepers of them are C1 and C2 (§5) |
| CP5 | Tier 1 foes weak to twins | **Superseded** | D235 (weaknesses v2); T2B owns weaknesses |
| CP6 | Later tiers narrow by rank | **Superseded** | D235's WK8: every rank 3 kinds; T2B |
| CP7 | The Rift's fronts and guided builds | **Kept, changed** | D240's CV23 by family; the later tiers' Rift is T2W's; guided builds name Tier 2 classes |
| CP8 | Locks and shields by tier | **Kept, changed** | Tier 1 shields 6 and 8 (H71); Tiers 2–3's are T2B's |
| CP9 | Hybrids and healers on 2 + 1 | **Kept, changed** | D249's hands, D282 H3; the sixteen keep 2 + 1 for every hybrid and healer (T2C33) |
| CP10 | Template per tier (accessories 1 · 2 · 3) | **Kept, changed** | D264: three accessory slots in every tier |
| CP11 | Presets per tier and branch | **Kept, changed** | One preset a Tier 2 class (T2C54) |
| CP12 | Equippable kinds; a Dual's kind of its own channel | **Kept** | Slots live; the Dual is T2G's |
| CP13 | One tree per slot, under a class root | **Kept, changed** | 70 trees; a Tier 2 class plays her parent's (T2C51) |
| CP14 | Nothing costs points | **Kept** | Live |
| CP15 | A fork changes reach, hits, support or Breaks | **Kept** | Binds line C (T2C14) |
| CP16 | Gates 1, 10, 20, 30, 40, 50 | **Kept, changed** | 50 is the crown in Tier 3 (T2C20) |
| CP17 | Trees never add a kind | **Kept** | — |
| CP18 | Tier 1: trunk and one fork | **Kept, changed** | Built; B lines by D246 (CV14), D282, D298 |
| CP19 | Tier 2: branch C and a Power or Break tip | **Kept, changed** | Line C by family (T2C14, T2C53), the tip fork (T2C15) |
| CP20 | Tier 3: depth-6 capstones, two branches held, master slot | **Kept, changed** | Depth 6 is a crown (T2C19, T2C20) |
| CP21 | Today's names; new ones by rule | **Superseded** | D298; new names in T2C27 and T2C59 |
| CP22 | Equipped 3 → 7, 3 → 10, 10 + master | **Kept** | T2C16 |
| CP23 | The Skills tab as a real tree | **Kept, changed** | D267's Class tab; Tier 2 adds the class line's tile |
| CP24 | ★ Flourish at the root, ★ signature tip from Tier 2 | **Kept** | The tip's content is T2U's |
| CP25 | Class Rank per class, reset at promotion | **Kept, changed** | Tier 0's ladder in Tier 1; XR1's shared ladder over her held Tier 2 classes (T2C3, T2C47) |
| CP26 | The class branch: a weapon-group focus | **Superseded (R2-2)** | The sixteen classes replace the branch |
| CP27 | Branch capstone and mastery at Class Rank 50 | **Kept, changed** | Five masteries by family on the sixteen (T2C22, T2C58) |
| CP28 | Six halls, 24 Limit Breaks, LB+ | **Superseded** | D241, D261: five halls, sixteen seats; LB+ by HV23 (T2C23) |
| CP29 | The calling pick | **Superseded** | D240 CV19: the promotion is the pick; in Tier 2 the Ascend is (T2C46) |
| CP30 | What the pick sets | **Superseded** | CV19, CV20 |
| CP31 | Saves v27 and v28 | **Superseded** | Tier 1's rows built; Tier 2's save is T2C60 |
| CP32 | Skill Ranks every 2 Class Ranks | **Kept** | The class line ranks too |
| CP33 | What grows on her weapons | **Kept** | The weapon types are T2G's (R2-6) |
| CP34 | Three class skills a branch, 36 in all | **Broken** | Statuses on the pure classes, retired statuses, six classes; one class line a class instead (T2C11, T2C52) |
| CP35 | Two Limit Breaks' kinds | **Superseded** | D241, D261 |
| CP36 | Template affinity | **Superseded** | D197 (UT11): the signature accessory |
| CP37 | The Paladin's revive on her Light tree | **Kept, changed** | D282, D298: both healers' Grand Grace Surge, all four healer classes |
| CP38 | Two weapon groups, Ring and Light/Dark | **Kept, changed** | Words only now: they name where statuses ride (T2C4, T2C45), no focus |
| CP39 | +15% on the focus group's kinds | **Superseded (R2-2)** | No focus: each class has its own rule |
| CP40 | Six default and reverse sets | **Superseded (R2-2)** | The sixteen presets (T2C54) |
| CP41 | Party pairings by region | **Superseded (R2-2)** | The comps (§5, T2C63) |
| CP42 | The Spell Blade's B: Pierce | **Kept, changed** | CV14: both Spellblades, the Brawler's Katana B, the Sorcerer's Light B; every child of theirs |
| CP43 | Every tree viable | **Kept, changed** | 70 trees; line C keeps every one full |

### 3.2 Classes v3, Halls v2, the reclass, skill names

| Call | What it said | Status | Why |
|---|---|---|---|
| CV10 | Tier 0 only in Tier 1; later tiers open every Tier 1 class at Rank 1 | **Kept, changed** | Tier 0 only in Tier 1 holds; a later world plays the sixteen, not the Tier 1 classes (R2-2, T2C31) |
| CV11 | One child Suggested | **Kept, changed** | The Ascend sheet suggests her class's keeper (T2C46) |
| CV13 | Twins re-paired: Katana–Light, Bow–Dark | **Kept** | — |
| CV15 | The new hybrids mirror their pair | **Kept, changed** | D249's hands; mirrored Tier 2 classes share their rule and class line |
| CV16 | Defaults by the owner's sets | **Superseded** | D263's presets |
| CV17 | The new trees' own names | **Superseded** | D298 |
| CV21 | ★ signature tip as any class of her family | **Kept** | Her family's Tier 2 classes (T2C49) |
| CV22 | One healer a party; a Tier 0 is none | **Kept** | Every tier; the four healer classes count, the supports don't (T2C42) |
| CV23 | The Rift's builds by family | **Kept, changed** | Later tiers' Rift is T2W's |
| CV24 | Limit Break scale 1 · 0.75 | **Superseded** | D249: ×0.95 and ×0.8 |
| CV25, CV26 | The reset and the refund | **Kept** | History |
| HV2 | Four seats a hall, twenty | **Superseded** | D261: sixteen |
| HV4 | Any Uma in any seat | **Kept** | — |
| HV5 | Power: own × scale × open depth | **Kept, changed** | D249's scales; Tier 3's crowned depth |
| HV6 | The ladder 2.9 · 2.5 · 2.2 · 1.9 · 2.0 | **Kept** | — |
| HV15 | At most 10 hits on one foe | **Kept** | — |
| HV17 | Every kind in two halls; two Heroes close a class's gaps | **Kept, changed** | D261; on the sixteen presets 13–16 of the 16 seats add a kind she lacks and her best two Heroes add 4–5 (§4.12) |
| HV22, HV23 | Bonds unchanged; LB+ +20% at Bond 10 | **Kept** | T2C23 |
| RC1, RC2, RC4, RC5 | Three children each; pure roots; kin; the Healer's four | **Kept, changed** | Tier 1's map; in a later tier it is the door's map (T2C48) |
| RC3 | Healers only from the Healer | **Superseded** | D291 |
| RC6 | A kin class is never Suggested nor her Flourish's family | **Kept** | Every tier (T2C49) |
| RC7 | No save or engine bump | **Kept** | Tier 1 |
| SN1–SN15 | One grammar; ladder; capstone; B = A + word; mirrors share; … display only | **Kept** (15) | Every new name follows them (T2C27, T2C59) |

### 3.3 The archived Tier 2 classes (A1–A10)

| Call | Status | Why |
|---|---|---|
| A1 Free switching | **Kept, changed** | Among her open Tier 2 classes (R2-5, T2C47) |
| A2 Leans ±0.1 | **Superseded** | No lean changes: a Tier 2 class wears her parent's (T2C33) |
| A3 Side forks with points | **Superseded** | CP14, CP19 |
| A4 Twelve names | **Superseded (R2-2)** | Sixteen classes (T2C32) |
| A5 Twelve passives | **Superseded (R2-2)** | One rule a class, sixteen (T2C34–T2C44) |
| A6 The Ascend pick by stat | **Superseded (R2-5)** | She picks on the Ascend sheet, her class's keeper suggested (T2C46) |
| A7 LB+ for Bond 10 | **Kept** | HV23 |
| A8 Limit Break power by base class | **Superseded** | HV5 |
| A9 No Tier 1 skill carries | **Kept** | — |
| A10 Skill MP ×1.7 · ×2.4 | **Kept** | T2C17 |

### 3.4 Round 1 (T2C1–T2C30)

| Call | Round 1 | Status | Where it lands |
|---|---|---|---|
| T2C1 | The eight Tier 1 classes in Tiers 2 and 3 | **Superseded (R2-2)** | Sixteen Tier 2 classes (T2C31) |
| T2C2 | What a Tier 0 means later | **Kept, changed** | A Tier 0 at her Ascend arrives as her suggested Tier 2 class (T2C50) |
| T2C3 | Class Rank by tier, XR1's shared ladder | **Kept, changed** | The ladder raises every Tier 2 class she holds (T2C47) |
| T2C4 | The two groups, Ring and Light/Dark | **Kept, changed** | Words for where statuses ride; no focus |
| T2C5 | The groups' names | **Listed for the owner** | His call: "Ring" and "Light/Dark" against his Heavy · Lite · Elemental · Arcane |
| T2C6 | Ten branches, by family | **Superseded (R2-2)** | Sixteen classes |
| T2C7 | Branch names | **Superseded (R2-2)** | Berserker, Warlord, Invoker, Blademaster and Guardian become class names; Sage, Augur, Rune Knight, Warlock, Templar's branch retire (Templar is a class now) |
| T2C8 | Branch 1 | **Superseded (R2-5)** | The Ascend pick (T2C46) |
| T2C9 | The reverse sets | **Superseded (R2-2)** | The expanders' presets (T2C54) |
| T2C10 | The focus +15% | **Superseded (R2-2)** | One rule a class |
| T2C11 | The class line | **Kept, changed** | One a class, mirrors share, cast through any of her weapons (T2C52) |
| T2C12 | The ten lines | **Kept, changed** | Re-homed on the sixteen (T2C52) |
| T2C13 | Statuses on the class lines | **Kept, changed** | By her class's level, four now (T2C45) |
| T2C14 | Line C | **Kept** | By tree; a Tier 2 class plays her parent's trees (T2C53) |
| T2C15 | The tip fork | **Kept** | — |
| T2C16 | Equipped slots | **Kept** | — |
| T2C17 | Skill MP ×1.7 · ×2.4 | **Kept** | — |
| T2C18 | The healing divisor × tier | **Kept** | Also the supports' wards and mends |
| T2C19 | Two lines held | **Kept** | — |
| T2C20 | The crown | **Kept** | — |
| T2C21 | MP's sixth step | **Kept** | — |
| T2C22 | Five masteries | **Kept, changed** | On the sixteen by family (T2C58) |
| T2C23 | The Halls by tier | **Kept, changed** | Home classes are the Tier 1 home class's children; scales by parent (T2C55) |
| T2C24 | Buffs and debuffs by tier | **Superseded (R2-3)** | Four levels (T2C45) |
| T2C25 | Presets by tier | **Kept, changed** | One a class (T2C54); the forms are T2G's |
| T2C26 | The party screen's hint | **Kept, changed** | It names an open class that holds the missing kind (T2C63) |
| T2C27 | New names checked | **Kept, changed** | Re-run on round 2's names (T2C59) |
| T2C28 | The save | **Kept, changed** | T2C60 |
| T2C29 | The engine | **Kept, changed** | T2C61 |
| T2C30 | The old previews | **Kept** | T2C62 adds two pages |

**Counts (125 calls):** CP, CV, HV, RC, SN and A1–A10 (95): Kept 39 · Kept, changed 29 · Superseded 26 · Broken 1 (CP34).
Round 1 (30): Kept 9 · Kept, changed 13 · Superseded 7 · listed for the owner 1 (T2C5).

## 4. Tier 2 in full

### 4.1 The sixteen

| Class | Parent | Kind | Slots (lead first) · each slot's hits read | Hand: power · MP | Lean · LB scale | Statuses | Healer | What she's for in a party |
|---|---|---|---|---|---|---|---|---|
| **Berserker** | Brawler | Keeper | 3 Arms · ATK | ×1 · ×1 | Brawler's · ×0.95 | None | No | The long fight's damage: Momentum peaks on bosses |
| **Spellfist** | Brawler | Expander | 2 Arms + 1 Tome · **all ATK** | ×1.05 · ×1 | Brawler's · ×0.95 | None | No | A physical bruiser who covers an element: the softer side of strikers and guards, the Arcane ward's other channel |
| **Archmage** | Sorcerer | Keeper | 3 Tomes · M.ATK | ×1 · ×1 | Sorcerer's · ×0.95 | None | No | The long fight's magic: Momentum on the party's top damage |
| **Battlemage** | Sorcerer | Expander | 2 Tomes + 1 Arm · **all M.ATK** | ×1.05 · ×1 | Sorcerer's · ×0.95 | None | No | A caster who covers an Arm: casters' and skirmishers' DEF side, the Iron ward's other channel |
| **Blademaster** | Arms Spellblade | Keeper | 2 Arms + 1 Tome · ATK, M.ATK | 0.72 + 0.44 · ×0.5 a half | parent's · ×0.95 | A path | No | The Break engine on one foe: a familiar's hit on both halves |
| **Runeblade** | Tome Spellblade | Keeper | 2 Tomes + 1 Arm · M.ATK, ATK | 0.72 + 0.48 · ×0.5 | parent's · ×0.95 | A path | No | The same, magic-led |
| **Sentinel** | Arms Spellblade | Expander | 2 Arms + 1 Tome · ATK, M.ATK | **0.61 + 0.37** · ×0.5 | parent's · ×0.95 | **Support**, the tapped foe | No | Offense support: Armor Break, Brave and Faith, a Barrier on the threatened |
| **Enchanter** | Tome Spellblade | Expander | 2 Tomes + 1 Arm · M.ATK, ATK | **0.61 + 0.41** · ×0.5 | parent's · ×0.95 | **Support**, the tapped foe | No | The same, magic-led |
| **Warlord** | Arms Summoner | Keeper | 2 Arms + 1 Tome · ATK, M.ATK | 0.57 + 0.46 · ×0.5 | parent's · ×0.95 | A path | No | The Break engine on every foe: both summons' farewells |
| **Invoker** | Tome Summoner | Keeper | 2 Tomes + 1 Arm · M.ATK, ATK | 0.57 + 0.5 · ×0.5 | parent's · ×0.95 | A path | No | The same, magic-led |
| **Druid** | Arms Summoner | Expander | 2 Arms + 1 Tome · ATK, M.ATK | **0.51 + 0.41** · ×0.5 | parent's · ×0.95 | **Support**, every foe | No | Field support: Enfeeble and Mind Break on every foe, a mend for every Uma |
| **Shaman** | Tome Summoner | Expander | 2 Tomes + 1 Arm · M.ATK, ATK | **0.51 + 0.45** · ×0.5 | parent's · ×0.95 | **Support**, every foe | No | The same, magic-led |
| **Guardian** | Paladin | Keeper | 2 Arms + 1 Tome · ATK; heals from ATK | ×0.5 · ×0.6 | Paladin's · ×0.8 | **Widely, one stack more** | **Yes** | The party's one healer, its statuses at the cap from depth 3 |
| **Bishop** | Cleric | Keeper | 2 Tomes + 1 Arm · M.ATK; heals from M.ATK | ×0.5 · ×0.6 | Cleric's · ×0.8 | **Widely, one stack more** | **Yes** | The same, magic-led |
| **Templar** | Paladin | Expander | 2 Arms + 1 Tome · ATK; heals from ATK | **×0.6 · ×0.7** | Paladin's · ×0.8 | Widely | **Yes** | The battle healer: a fifth more damage, mends and Barriers ×0.7 |
| **Exorcist** | Cleric | Expander | 2 Tomes + 1 Arm · M.ATK; heals from M.ATK | **×0.6 · ×0.7** | Cleric's · ×0.8 | Widely | **Yes** | The same, magic-led |

- **One healer a party** (CV22) is unchanged: the four healer classes count; the supports' Barrier and mend don't make a
  healer (T2C42).
- **A Tier 2 world plays only these sixteen.** Her Tier 1 classes stay in Tier 1's world with her record there, as her
  Tier 0 does (T2C31).

### 4.2 Keepers and expanders: what changes, what never does (T2C31, T2C33)

| Never changes from her parent | Changes, by her one rule |
|---|---|
| Three slots, their channels' count (2 + 1 or 3 of one) | A pure expander's slot mix (2 + 1) and the stat her hits read |
| Her lean, her armor half, her Limit Break scale | A support's and a battle healer's hand |
| Her parent's trees (names, shapes, powers, line B) | Who a status reaches and at what stacks (four levels, [§4.8](#48-statuses-four-levels-t2c45)) |
| Her family, her hall, her mastery's family | A familiar's hit or a lingering summon, on one half or both |
| One act a turn; her MP regen; equipped slots | A Barrier or a mend riding a damage class's act |

- **Keepers sharpen what Tier 1 gave:** the pure classes get the **self-buff** the owner asked for; the hybrids get their
  Tier 1 trick on **both** halves (a familiar's hit, a lingering summon); the healers their statuses **one stack more**.
- **Expanders widen with one twist the owner named:** the pures cross into the other channel **on their own stat**; the
  hybrids take **a little of the healers' kit** for less damage; the healers take **more damage for less healing**.
- **Mirrors share their rule** (SN5, D282 H3): the Blademaster and the Runeblade, the Sentinel and the Enchanter, and so
  on; each keeps her parent's hand and lead half. Eight rules in all, sixteen classes.

### 4.3 Momentum: the pure keepers' self-buff (T2C34)

**One rule for the Berserker and the Archmage:**

| | |
|---|---|
| **Gain** | One stack after each of her turns (a skill, an Attack or a Limit Break) |
| **Effect** | **+5% a stack** on every hit she makes, her Limit Breaks' too; a factor of its own beside the statuses (WP31 step 5) |
| **Cap** | **3 stacks: +15%** |
| **Lasts** | The whole fight, waves included; **she loses every stack when she falls** (revived, she starts again at 0) |
| **Never** | A party buff, a status on anyone else, a mend, a Break or a shield chip; it never lifts the cap of any status |
| **Auto** | Nothing to decide: it multiplies every hit alike, so Auto's pick and its Limit Break timing are unchanged |
| **On screen** | A badge on her bar, "Momentum 2", with the glyph; her Details "Momentum: +5% a stack, a stack a turn, up to 3"; the log "+Momentum" once a stack |

**What it's worth** (her acts a fight, read from the harness at Lv 50; a stack lands after her act, so her first act has
none):

| Her turns in the fight | 2 | 3 | 4 | 5 | 6 | 8 | 10 |
|---|---|---|---|---|---|---|---|
| Mean stacks over her turns | 0.50 | 1.00 | 1.50 | 1.80 | 2.00 | 2.25 | 2.40 |
| Her damage | +2.5% | +5% | +7.5% | +9% | +10% | +11.3% | +12% |

| Lv 50 (measured turns a fight) | Fights | Sub-bosses | Bosses | All, by damage |
|---|---|---|---|---|
| Mean stacks | 1.51 | 1.76 | 2.21 | **1.88** |
| Her damage | +7.6% | +8.8% | +11.1% | **+9.4%** |

- **Why +5%, not the statuses' +10%:** at +10% the keepers would lead their expanders by about 13% of their own damage
  (§4.4); +5% puts them within 3 points. The step is the knob (5 → 4%), then the cap.
- **Why a stack a turn:** no condition to track and nothing for Auto to plan; it rewards a long fight, which is the
  keeper's identity against the expander's breadth.
- **Name:** "Momentum" (checked, §11). "Fervor", the first pick, is a master-data string.

### 4.4 Crossing channels: the pure expanders (T2C35, T2C36)

**The Spellfist:** two Arms and a Tome, the Arms first. **Every hit she makes reads her ATK.** **The Battlemage:** two
Tomes and an Arm, the Tomes first. **Every hit she makes reads her M.ATK.**

| A hit of her other channel | Reads | Example: the Spellfist's Fire Tome |
|---|---|---|
| **Offense** | **Her stat**, + that weapon's Might, + her accessories' flat on its kind, + her signature | ATK + the Fire Tome's Might + an Orb on Fire |
| **Defense** | **The kind's channel**: an element against M.DEF, an Arm against DEF | The foe's M.DEF |
| **Weakness, shields, locks** | The kind | Fire |
| **Statuses** | The kind's channel | Faith and Mind Break raise it; Brave and Armor Break don't |
| **The Rift's ward** | The kind's channel | An Iron foe's ward halves it; an Arcane foe's doesn't |
| **Her trees** | The other pure class's tree for that weapon | The Sorcerer's Fire tree (its shapes, names, MP) |

- **Her gear follows her stat:** her armor half is her parent's (physical, magical); **every Pendant counts on every hit
  of the Spellfist**, every Charm on every hit of the Battlemage; Prowess goes all to her stat (extra-stats'
  T2E20 names it); her other channel's weapon grades with its own items (Tome Ink, Arms Gems) as any weapon.
- **Her hand ×1.05** (one act a turn, MP ×1): the cross alone is worth little in a fight with no party around it (below),
  so the hand carries her into the band. It is her knob.
- **A Hero's Limit Break** reads her stat on every hit too (a Learner's already reads her higher stat).

**What crossing is worth on its own** (analytic: her best hit a turn against one regular, every Tier 2 weakness list
equally likely, Tier 2's rule: strikers and guards weak to 1 Arm + 2 elements, casters and skirmishers 2 Arms + 1
element; foe defenses from `rpgFoe` at lifetime Lv 100, offense 535):

| Kit | Her best hit a turn | Against the keeper | A weak kind in reach |
|---|---|---|---|
| Brawler, Berserker: 3 Arms | 387 | — | 75% |
| **Spellfist: 2 Arms + 1 Tome on ATK** | 392 | **+1.2%** | 70% |
| 1 Arm + 2 Tomes on ATK | 391 | +1.0% | 70% |
| 3 Arms + a fourth slot, a Tome (not proposed) | 405 | +4.5% | 84% |
| Sorcerer, Archmage: 3 Tomes | 385 | — | 75% |
| **Battlemage: 2 Tomes + 1 Arm on M.ATK** | 391 | **+1.8%** | 70% |

So **a cross is a breadth pick, not a damage pick:** she gives up a kind of her own channel for one of the other,
gains the softer defense on half the foes (a striker's M.DEF is 0.8 of her DEF, a caster's DEF 0.64 of her M.DEF) and
loses a little reach. Her value is the party's: the comp her breadth frees ([§5](#5-party-comps-r2-12), C3, C7), the
Rift's wards, a Learner seat of the other channel at full offense. A fourth slot would buy +4.5% and break three docs'
slot counts (gear, extra stats, the window's eleven worn slots); the ×1.05 hand buys the same for nothing.

**Her offense on her other channel, on-curve Lv 50** (her parent's sheet, §4.13: her stat, Pendants or Charms inside it,
+ the weapon's G10 Might; her preset's Orb sits on her lead kind): the Spellfist's Fire hit at **277 · 499 · 722**
(Tiers 1 · 2 · 3) against an Arms Spellblade's Thunder at about 196 · 351 · 510; the Battlemage's Greatsword at **282 ·
508 · 735** against a Tome Spellblade's Katana at about 196 · 351 · 510. An Orb moved to her other kind adds 20 · 36 · 52.

### 4.5 The hybrid keepers: both halves (T2C37, T2C38)

| | Tier 1 parent | **Keeper's rule** | What it does in a fight |
|---|---|---|---|
| **Blademaster, Runeblade** | Her bound familiar lands one extra hit on her **lead** half (the same total) | **On both halves** | One more hit on her other half, the same total: a weak other half chips one more shield point. On a Pierce tree the familiar splits the Pierce hit in two, both piercing |
| **Warlord, Invoker** | Her **lead** summon lingers; at her next pair it strikes every foe once in farewell (its linger share × 0.1) | **Both summons linger** | Two farewells at her next pair, one of each kind, on every foe: each weak foe chips one more point a pair. Oath (B, linger 0.4) now matters on either half |

- **What it's worth:** the same damage, more chips. A chip is a party value: a Break doubles everyone's damage on that
  foe for two rounds. The model ([§5.1](#51-the-model-r2-11s-party-value-as-a-formula)) credits +6% of her damage
  (Spellblades, about 0.5 chip a turn) and +7% (Summoners, about 1 chip a turn on three foes) to Breaks; the harness
  measures it (Breaks' timing is in `logFight`).
- **Statuses: her parent's path** (1 · 1 · 2 on a secondary weapon's line A from depth 3).
- **Knob, if the harness finds them short:** the hands (D249's order), +0.02 a half.

### 4.6 The support expanders: a little of the healers' kit (T2C39–T2C42)

| | **Sentinel, Enchanter** (from the Spellblades) | **Druid, Shaman** (from the Summoners) |
|---|---|---|
| **Her hands** | Her parent's **× 0.85**: 0.61 + 0.37 · 0.61 + 0.41; MP ×0.5 a half | Her parent's **× 0.9**: 0.51 + 0.41 · 0.51 + 0.45 |
| **Statuses** | **Every skill** of her Katana, Bow, Light and Dark trees (every line) carries its status at the healers' ladder, **1 · 1 · 2 · 2 · 3** by depth | The same ladder on the same four weapons |
| **Where** | A debuff on **the tapped foe**, on every foe at depth 5; a buff on every Uma | A debuff on **every foe at every depth**; a buff on every Uma |
| **Her Ring trees** | Damage only | Damage only |
| **Her piece of the kit** | **A Barrier** after each of her skill acts on the most threatened Uma: **a third of the healers' Barrier share** at her act's depth (9 · 11 · 12 · 13 · 15% of the target's max HP), × her healing scale | **A mend:** her lingering summon's farewell also mends every Uma **a tenth of the healers' mend share** at the summon's depth (2.8 · 3.2 · 3.6 · 4.0 · 4.4% of each one's max HP), × her healing scale |
| **Kept from her parent** | Her familiar's extra hit on her lead half | Her lead summon lingers |
| **Not hers** | Rescue, cleanse, revive, Regen, drain; she is no healer | The same |
| **Her preset** | Katana, Greatsword, Light · Light, Blizzard, Katana: **Armor Break and Brave and Faith** | Bow, Greatsword, Dark · Dark, Blizzard, Bow: **Enfeeble and Mind Break** |
| **Her role** | **Offense support:** she fills the statuses a healer carries least (a Paladin's Brave and Faith ride only a path; a Cleric has no Armor Break) and wards the threatened | **Field support:** every foe weaker and softer to magic, the party a little mended each pair |

- **Her healing scale** is T2C18's: her higher of ATK and M.ATK ÷ (300 × the tier's multiplier), about ×1.67 on curve at
  any tier's Lv 50. Her Barrier caps at 60% of max HP like any Barrier.
- **Why two cuts, 0.85 and 0.9:** a Spellblade support's Armor Break and Brave and Faith add damage; a Summoner support's
  Enfeeble saves HP instead ([§2.7](#27-the-two-comps-measured-the-baseline-5-reads)), which a fight on curve hardly
  needs, so she gives up less damage for it. Each cut is her knob.
- **Why the healers' ladder on the Light/Dark weapons only:** it is D282's middle level widened, not a second healer.
  The Ring statuses (Greatsword, Lance, Fire on every skill) stay the healers'.
- **Overlap:** a status two members carry adds less, three stacks at most (the cap). The comps count it ([§5](#5-party-comps-r2-12)).

### 4.7 The healers: one stack more, or a battle healer (T2C43, T2C44)

| | **Guardian, Bishop** (keepers) | **Templar, Exorcist** (expanders) |
|---|---|---|
| **Power · MP** | ×0.5 · ×0.6 (Tier 1's) | **×0.6 · ×0.7** |
| **Mends, Barriers, Regen, drain, revive** | Tier 1's shares | **×0.7 the shares** (Rescue's 60% floor and the revive kept) |
| **Statuses** | **One stack more**, to the cap of 3: Greatsword, Lance and Fire **2 · 2 · 3 · 3 · 3**; her path **3 · 3 · 3** | Tier 1's: 1 · 1 · 2 · 2 · 3, the path 2 · 2 · 3 |
| **Line B, Surge** | Where her status already stands at 3, Surge gives the mend or Barrier ×1.15 (the live rule for trees with no status to stack) | Tier 1's |
| **Healing capacity, on-curve Lv 50** | About 20% of the party's max HP a round (Tier 1's) | About 14% |
| **Damage share in her party** | About 10% (Tier 1's) | About 13% |
| **Her role** | The party's support and its safe healer | The healer who hits: a fifth more damage, a third less healing, the same statuses |

- **Still one healer a party.** The Templar and the Exorcist count; the owner can't field a battle healer beside a keeper.
- **Why the keeper's rule is statuses, not more healing:** on curve a party takes about 1% of its HP a round (§2.7), so
  more healing adds almost nothing to a fight's value; one stack more is worth about 9% of her (§5.4) and keeps her ahead
  of the battle healer whenever healing matters (the stress check, [§5.1](#51-the-model-r2-11s-party-value-as-a-formula)).
- **The battle healer pairs with a support:** her lost healing (−6% of the party's HP a round) is about the Sentinel's
  ward (3.7%) or the Druid's mend (5.5%) — the owner's "swap the Paladin for damage and a Spellblade to support so they
  balance each other" (C4).

### 4.8 Statuses: four levels (T2C45)

D282's three levels, with one added between the path and widely for the hybrids' expanders:

| Level | Classes | Weapons | Stacks by depth | Reach |
|---|---|---|---|---|
| **None** | Berserker, Spellfist, Archmage, Battlemage | — | — | — |
| **A path** | Blademaster, Runeblade, Warlord, Invoker | Line A of a Light/Dark weapon, from depth 3 | 1 · 1 · 2 | The tapped foe |
| **Support** (new) | Sentinel, Enchanter · Druid, Shaman | **Every skill** of a Light/Dark weapon | 1 · 1 · 2 · 2 · 3 | Sentinel, Enchanter: the tapped foe, every foe at depth 5 · Druid, Shaman: **every foe** |
| **Widely** | Guardian, Bishop (**+1 stack**: 2 · 2 · 3 · 3 · 3, path 3 · 3 · 3) · Templar, Exorcist (Tier 1's) | Every skill of Greatsword, Lance, Fire; the path on Light/Dark | 1 · 1 · 2 · 2 · 3; path 2 · 2 · 3 | The tapped foe, every foe at depth 5 |

- **A deliberate change to D282's levels,** asked by R2-3 ("wider buffs and debuffs" for the Spellblades' and Summoners'
  expanders). The pure classes stay at none (D282 D2); the keepers stay at their parent's level (+1 stack for the healer
  keepers); no retired status returns (D282 D3); the five statuses keep +10% a stack, three at most, two rounds (T2B12).
- **The class lines' statuses** follow the class's level: a path's 1 · 1 · 2, a support's and a healer's 2 · 2 · 3 at
  Class Rank 20 · 30 · 40, a Guardian's or Bishop's 3 · 3 · 3.
- **The Class tab prints each tree's status and level over it** (D282 call 8), so a support's every-skill Katana reads
  "Armor Break · every skill".

### 4.9 Promotion and switching (T2C46–T2C50)

**The Ascend is the Tier 2 promotion** (R2-5). On the Ascend sheet ([progression](progression.md) owns its flow) she
picks her Tier 2 class.

| Rule | |
|---|---|
| **Open on arrival** | **Both children of every Tier 1 class she holds at Class Rank 50.** A full Tier 1 window asks three at Rank 50 (Class V), so **at least six** of the sixteen; an Uma with four at 50 has eight |
| **Held on arrival** | Every open Tier 2 class is hers at Class Rank 1, with its preset's weapons, line A and the auto loadout. No second promotion step |
| **The pick** | One of them is her **active class**. **Suggested:** the keeper of the Tier 1 class she fights as when she ascends; if that class isn't at Rank 50 (or she fights as a Tier 0), the keeper of her family's own Tier 1 class at Rank 50 with the most Class EXP; ties by the class tree's order (left to right) |
| **Switching** | Free, outside fights, on the Classes sheet, among her held Tier 2 classes, each with its own Class Rank, weapons, lines and equipped skills, as Tier 1's held classes work |
| **Class Rank** | 1–50 a class. **Ranks 1–10 one shared ladder** (XR1, T2B3): her first 3,600 Class EXP raise every Tier 2 class she holds to Rank 10 together; from 10 each climbs alone. Depths open at Lv 10 · 16 · 22 · 29, Rank 50 at Lv 36 on her active class; two classes reach Rank 50 a campaign (50,960) |
| **The door** | **When any Tier 2 class she holds reaches Class Rank 20, the children of her parent's reclass neighbours open** (below). Their first 3,520 Class EXP past the shared ladder: the Tier 1 door's 3,600 |
| **Manuals** | Class Manuals raise a held class, never a closed one (as Tier 1) |
| **Never** | Closes a class, costs anything, moves her calling, trade or template |

**The door's map is the reclass's** (D290, D291): a Tier 1 class's neighbours are the Tier 1 classes its Tier 0 parents
promote into. Lifted one tier:

| A held Tier 2 class at Class Rank 20, whose parent is | Opens the children of |
|---|---|
| Brawler | Arms Spellblade, Arms Summoner (the Warrior's) |
| Sorcerer | Tome Spellblade, Tome Summoner (the Mage's) |
| Arms Spellblade | every Tier 1 class but the Sorcerer (the Warrior's, the Spellblade's, the Healer's) |
| Tome Spellblade | every Tier 1 class but the Brawler (the Spellblade's, the Mage's, the Summoner's) |
| Arms Summoner | every Tier 1 class but the Sorcerer (the Warrior's, the Summoner's, the Spellblade's) |
| Tome Summoner | every Tier 1 class but the Brawler (the Summoner's, the Mage's, the Healer's) |
| Paladin, Cleric | both Spellblades, both Summoners, both healers (the Healer's and her kin Tier 0's) |

- **Why this rule:** R2-5's "children of a Tier 1 class at Rank 50" rewards Tier 1's work and keeps the pick short, but
  alone it would lock an Uma out of a class for her whole Tier 2 life (a Tier 1 class can't be raised in a Tier 2 world).
  The door reuses the reclass's own map and price, so nothing new is learned, and by Lv 16 most of the sixteen are a
  tap away.
- **Kin and her Flourish in Tier 2** (RC6, CV21): her Flourish works while she fights as a Tier 2 child of her calling's
  own Tier 1 classes: a Warrior calling's six (Berserker, Spellfist, Blademaster, Sentinel, Warlord, Druid), a Mage's six
  (Archmage, Battlemage, Runeblade, Enchanter, Invoker, Shaman), a Spellblade's four, a Summoner's four, a Healer's four.
  A child of a kin Tier 1 class is never Suggested and outside her Flourish ("Off · as Templar").
- **A Tier 0 at her Ascend** (T2C50): she still holds three Tier 1 classes at Rank 50 (Class V), so she arrives as the
  Suggested rule's class.
- **The window's Class steps in Tier 2** read Tier 2 classes (R2-10 is progression's).

### 4.10 Trees, the class line, line C (T2C51–T2C53)

- **A Tier 2 class plays her parent's trees:** the same nodes, names, powers and line B; her class's rule applies in the
  fight. The **Spellfist's** Tomes play the **Sorcerer's** five Tome trees, the **Battlemage's** Arms the **Brawler's**
  five. No tree and no skill name is added for the sixteen.
- **Line C** (T2C14, kept) joins each tree's fork at depth 3 by family, so a Tier 2 class gets her parent's: the Brawler's
  trees Rout, Havoc, Tremor, Hail, Fork; the Sorcerer's Kindle, Sleet, Peal, Beam, Gloom; the Spellblades' Swath and
  Strafe; the Summoners' Hunt and Maul; the healers' **Psalm** (her mend or Barrier reaches every Uma from depth 3, whole
  on the most hurt or threatened, ×0.4 the rest). Every line's capstone forks **Power or Break** (T2C15).
- **The class line** (T2C11, re-homed): her fourth tree, at **Class Rank 20 · 30 · 40**, cast through **any of her three
  weapons** (its kind, channel, Might and flat; Auto picks the one that lands weak, on her bar she picks), the depth
  table's power and MP, her hand on top, Skill Ranks every 2 Class Ranks. Round 1's ten lines map onto the sixteen,
  mirrors sharing:

| Class | Its line (CR 20 · 30 · 40) | What it does | Status |
|---|---|---|---|
| **Berserker** | Grand Rampage · Supreme Rampage · **Skybreaker** | The tapped foe takes the full power, every other foe 0.3 of it | None |
| **Spellfist** | Grand Conquest · Supreme Conquest · **Sundown** | One foe at the full power; on a Broken foe every other foe also takes 0.55 | None |
| **Archmage** | Grand Nebula · Supreme Nebula · **Starburst** | Every foe at the area share (0.55); a foe weak to its kind takes the full power | None |
| **Battlemage** | Grand Quasar · Supreme Quasar · **Event Horizon** | One foe, one hit at ×1.25 the power | None |
| **Blademaster, Runeblade** | Grand Sigil · Supreme Sigil · **Rune Edge** | Her pair: her lead half on one foe, her other half on every foe at 0.55; the familiar's hit on both | A path, through a Light/Dark weapon |
| **Sentinel, Enchanter** | Grand Bane · Supreme Bane · **Penumbra Edge** | Her pair on one foe; through a Light/Dark weapon its status, her Barrier after it | 2 · 2 · 3 |
| **Warlord, Invoker** | Grand Griffin · Supreme Griffin · **Kraken** | Her pair on one foe; her lead summon lingers at 0.5, not 0.3 | A path |
| **Druid, Shaman** | Grand Wraith · Supreme Wraith · **Banshee** | Her pair, her lead summon on every foe at 0.55; through a Light/Dark weapon its status on every foe | 2 · 2 · 3 |
| **Guardian, Bishop** | Grand Edict · Supreme Edict · **Covenant** | A blow or a spell on one foe; through the Greatsword, Lance or Fire its status reaches every foe or every Uma; through the Axe, Blizzard or Thunder its Barrier or mend reaches every Uma | 3 · 3 · 3 |
| **Templar, Exorcist** | Grand Solace · Supreme Solace · **Absolution** | A blow or a spell on one foe, then a mend on the most hurt and a Barrier on the most threatened, both whole (× her 0.7) | 2 · 2 · 3 |

- Priced like a line (CP15): 10–20% over the same depth's line A in its context, behind it elsewhere; T2B measures.
- **Equipped** (T2C16): 3 at Lv 1, one more at Lv 10, 15, 20, 25, 30, 35, 40: 10 of 18 held. **Skill Ranks** (CP32) as
  Tier 1.

### 4.11 MP and the healing scale (T2C17, T2C18)

- **Skill MP ×1.7 in Tier 2, ×2.4 in Tier 3,** in place of today's ×tier: an on-curve bar grows ×1.72 and ×2.45, so casts
  stay within 0.3 of Tier 1's for the damage classes and within 1 for the healers.

| A depth-5 act on a full bar at Lv 50 | MP · casts, Tier 1 | Tier 2 today (×2) | **Tier 2, ×1.7** | Tier 3 today (×3) | **Tier 3, ×2.4** |
|---|---|---|---|---|---|
| Berserker, Spellfist | 26 · 8.2 | 52 · 7.1 | **44 · 8.3** | 78 · 6.7 | **62 · 8.4** |
| Archmage, Battlemage | 26 · 11.3 | 52 · 9.7 | **44 · 11.5** | 78 · 9.2 | **62 · 11.6** |
| A Spellblade's or a Summoner's child (two halves of 13) | 26 · 9.4 | 52 · 8.1 | **44 · 9.6** | 78 · 7.7 | **62 · 9.7** |
| Guardian, Bishop (×0.6) | 16 · 18.4 | 32 · 15.8 | **27 · 18.7** | 48 · 14.9 | **37 · 19.4** |
| Templar, Exorcist (×0.7) | — | — | **31 · 16.3** | — | **44 · 16.3** |

- **The healing scale** ×(1 + offense ÷ (300 × the tier's multiplier)): ÷ 300 · 540 · 780, so an on-curve healer is
  **×1.64 at every tier's Lv 50** (today 1.64 · 2.16 · 2.68). The supports' Barrier and mend take the same scale.

### 4.12 The Halls and presets (T2C23, T2C54, T2C55)

| | Tier 2 |
|---|---|
| Seats | The same sixteen in the new world's halls, no new seat (D261); she arrives with no seat and no Bond |
| Home classes | A seat's Tier 1 home class's two children (the Dojo's: the Berserker and the Spellfist; the Sanctum's Paladin seats: the Guardian and the Templar) |
| Class scale | **Her parent's:** ×0.95 the twelve damage and support classes, ×0.8 the four healers |
| LB+ | +20% at Bond 10 (HV23) |
| Hits | At most 10 on one foe |
| Her twist on a cast | Momentum multiplies it; a cross-wielding Hero's hits read her stat |
| Coverage | On the sixteen presets, 13–16 of the 16 seats add a kind she lacks; her best two Heroes add 4–5 (HV17) |

**The sixteen presets** (T2C54; a keeper wears her parent's; lead first):

| Class | Preset | Class | Preset |
|---|---|---|---|
| Berserker | Greatsword, Axe, Lance | **Spellfist** | **Greatsword, Axe, Fire** (the Heavy twins, both on ATK) |
| Archmage | Fire, Blizzard, Thunder | **Battlemage** | **Fire, Thunder, Greatsword** (the Heavy twins, both on M.ATK) |
| Blademaster | Katana, Axe, Thunder | **Sentinel** | **Katana, Greatsword, Light** |
| Runeblade | Thunder, Blizzard, Katana | **Enchanter** | **Light, Blizzard, Katana** |
| Warlord | Bow, Axe, Dark | **Druid** | **Bow, Greatsword, Dark** |
| Invoker | Dark, Blizzard, Bow | **Shaman** | **Dark, Blizzard, Bow** |
| Guardian | Lance, Greatsword, Light | **Templar** | Lance, Greatsword, Light |
| Bishop | Light, Fire, Lance | **Exorcist** | Light, Fire, Lance |

- **Every one of the 64 mixes holds all ten kinds:** the owner's two parties, each member her keeper or her expander (32
  mixes a party), a script over every combination. The expanders' presets were picked for it: each support keeps one
  twin set in both halves (the Light set, the Dark set) and one Ring weapon for damage; each pure expander carries the
  Heavy twins, so the Spellfist and the Battlemage together leave the Lightning set to the party (both comps' hybrid and
  healer hold it).
- **A preset sets her three accessory slots** by D266's rule on its weapons (and from a slot's G5 by gear's forms); a
  Spellfist wears Pendants, a Battlemage Charms.
- **The party screen's hint** (T2C63): a party that drops a kind names an open class of one of its members whose preset
  holds it ("No Bow: the Druid's preset holds one").

### 4.13 Class stats at Lv 50 (SB1)

Leans don't change, so **each Tier 2 class wears her parent's sheet**. The on-curve Uma at each tier's Lv 50 (her
preset, G10 × tier, every Extra Stats node × tier, no template), from the live code:

| Parent (lead weapon) · her children | Tier | HP | MP | ATK | M.ATK | DEF | M.DEF | Lead offense |
|---|---|---|---|---|---|---|---|---|
| **Brawler** (Greatsword) · Berserker, Spellfist | 1 · 2 · 3 | 1,460 · 2,531 · 3,610 | 212 · 367 · 522 | 209 · 377 · 545 | 114 · 205 · 296 | 204 · 368 · 532 | 181 · 324 · 468 | 297 · 535 · 774 |
| **Sorcerer** (Fire) · Archmage, Battlemage | 1 · 2 · 3 | 1,230 · 2,139 · 3,055 | 294 · 505 · 717 | 114 · 205 · 296 | 214 · 386 · 558 | 184 · 331 · 478 | 200 · 360 · 520 | 302 · 544 · 787 |
| **Arms Spellblade, Arms Summoner** · Blademaster, Sentinel, Warlord, Druid | 1 · 2 · 3 | 1,322 · 2,296 · 3,277 | 245 · 423 · 600 | 200 · 362 · 522 | 128 · 229 · 333 | 194 · 349 · 505 | 191 · 342 · 494 | 288 · 520 · 751 |
| **Tome Spellblade, Tome Summoner** · Runeblade, Enchanter, Invoker, Shaman | 1 · 2 · 3 | 1,322 · 2,296 · 3,277 | 245 · 423 · 600 | 128 · 229 · 333 | 200 · 362 · 522 | 194 · 349 · 505 | 191 · 342 · 494 | 288 · 520 · 751 |
| **Paladin** (Lance) · Guardian, Templar | 1 · 2 · 3 | 1,322 · 2,296 · 3,277 | 294 · 505 · 717 | 193 · 347 · 503 | 109 · 197 · 284 | 209 · 377 · 545 | 191 · 342 · 494 | 281 · 505 · 732 |
| **Cleric** (Light) · Bishop, Exorcist | 1 · 2 · 3 | 1,322 · 2,296 · 3,277 | 294 · 505 · 717 | 109 · 197 · 284 | 193 · 347 · 503 | 194 · 349 · 505 | 194 · 369 · 533 | 281 · 505 · 732 |

Offense holds SB1 (×1.80, ×2.61); HP and MP grow ×1.72–1.73 and ×2.45–2.47 (their flat base), which is why skill MP takes
×1.7 and ×2.4 and the healing scale its divisor. The cross-wielders' other channel reads her stat with that weapon's
Might (§4.4).

## 5. Party comps (R2-12)

### 5.1 The model: R2-11's party value as a formula

**Units: BT,** one on-curve Brawler's damage a turn at Lv 50 (993 in Tier 1's harness, §2.7). Every member's numbers are
her parent's measured Tier 1 numbers moved by her class's rule; the balance doc replaces each estimate with the harness.

**Party value of member i:**

> **V_i = D_i + S_i + B_i**, and beside it her healing capacity **H_i**
>
> - **D_i, her own damage** = her parent's Tier 1 damage a turn ÷ 993 × τ_i, her rule's factor: Momentum 1 + 0.05 ×
>   1.88; a cross 1.05 × 1.012 (Spellfist) or × 1.018 (Battlemage); a support 0.85 or 0.9; a battle healer 0.6 ÷ 0.5;
>   a Summoner keeper's second farewell 1.02; every other 1.
> - **S_i, what her statuses add to the other four** = Σ over her statuses of v_s × strength_s × her part × (the other
>   four's D). v_s at full strength: Armor Break 5%, Mind Break 5%, Brave and Faith 6% (calibrated on §2.7: the model
>   gives a healer's statuses 9% against the harness's 9.8 and 12.3%). A status's strength on the tapped foe and on the
>   rest by access: widely 1.0 and 0.5, a healer's path 0.5 and 0.25, a hybrid's path 0.35 and 0, a Spellblade support
>   1.0 and 0.5, a Summoner support 1.0 and 1.0, a Guardian's or Bishop's ×1.2; the tapped foe takes 60% of the party's
>   damage; **two carriers of a status: the stronger whole, the others a quarter, at most full** (the cap of 3, the
>   shared two rounds). Enfeeble saves HP and is shown apart.
> - **B_i, her Breaks** = 0.06 (Spellblade keepers) or 0.07 (Summoner keepers) × D_i: the extra chips' share.
> - **H_i, healing capacity**: the HP a round she can mend or ward, a share of the party's max HP (shares by depth at
>   Lv 50's mix: half depth 5, 35% depth 4, 15% depth 3; healing scale 1.64; 0.8 acts a round, Limit Breaks apart).
>   **On curve a party needs about 1% a round** (§2.7), so H counts in V only as **ε × the HP it saves**, ε = the party's
>   damage a round ÷ its max HP ≈ 0.58, which is near nothing on curve: **healers are levelled on the stress check**
>   (the tier's bosses with their offense ×1.2, or five levels under curve), where H decides.

**R2-11's band, as this doc proposes it for T2B:** every Tier 2 class's V within **±5% of the sixteen's mean gain over
their parents** in her parent's comp, and both healer classes of a parent within ±10% of each other on the stress check.
Every number below is the model's; the balance doc measures C1–C8 on the harness.

### 5.2 The comps

Each comp is five, one healer. Kinds: how many of the five hold each (of ten). Per member: her damage (BT and her share
of the party's), her statuses' and Breaks' value (BT), her healing capacity (% of the party's HP a round), her value V.

**Tier 1 as built, the two reference rows** (the model on §2.7's anchors):

| Party 1 | Weapons | Damage | Support | Healing | V |
|---|---|---|---|---|---|
| Brawler | Greatsword, Axe, Lance | 1.00 · 22% | — | — | 1.00 |
| Sorcerer | Fire, Blizzard, Thunder | 1.14 · 25% | — | — | 1.14 |
| Arms Spellblade | Katana, Axe, Thunder | 0.95 · 21% | 0.03 | — | 0.98 |
| Tome Summoner | Dark, Blizzard, Bow | 0.90 · 20% | 0.03 | — | 0.93 |
| Paladin | Lance, Greatsword, Light | 0.51 · 11% | 0.37 | 20% | 0.88 |
| **Party** | Greatsword 2 · Axe 2 · Lance 2 · Bow 1 · Katana 1 · Fire 1 · Blizzard 2 · Thunder 2 · Light 1 · Dark 1 | **4.49** | **0.43 (9%)** | **20%** | **4.92** |

Party 2 (Tome Spellblade, Arms Summoner, Cleric) reads the same within 0.01: 4.50 + 0.43 = 4.93 BT.

**C1. Tier 1-like: Party 1's keepers**

| Member | Weapons | Damage | Support | Healing | V |
|---|---|---|---|---|---|
| Berserker | Greatsword, Axe, Lance | 1.09 · 23% | — | — | 1.09 |
| Archmage | Fire, Blizzard, Thunder | 1.24 · 26% | — | — | 1.24 |
| Blademaster | Katana, Axe, Thunder | 0.95 · 20% | 0.03 + Breaks 0.06 | — | 1.03 |
| Invoker | Dark, Blizzard, Bow | 0.92 · 20% | 0.03 + Breaks 0.06 | — | 1.01 |
| Guardian | Lance, Greatsword, Light | 0.51 · 11% | 0.48 | 20% | 0.99 |
| **Party** | Greatsword 2 · Axe 2 · Lance 2 · Bow 1 · Katana 1 · Fire 1 · Blizzard 2 · Thunder 2 · Light 1 · Dark 1 | **4.71** | **0.67 (12%)** | **20%** | **5.37** |

Read: Party 1 with every twist on: +9% over Tier 1, a quarter of it the Guardian's extra stack.

**C2. Tier 1-like: Party 2's keepers**

| Member | Weapons | Damage | Support | Healing | V |
|---|---|---|---|---|---|
| Berserker | Greatsword, Axe, Lance | 1.09 · 23% | — | — | 1.09 |
| Archmage | Fire, Blizzard, Thunder | 1.24 · 26% | — | — | 1.24 |
| Runeblade | Thunder, Blizzard, Katana | 0.96 · 20% | 0.04 + Breaks 0.06 | — | 1.06 |
| Warlord | Bow, Axe, Dark | 0.93 · 20% | 0.03 + Breaks 0.06 | — | 1.03 |
| Bishop | Light, Fire, Lance | 0.49 · 10% | 0.47 | 20% | 0.96 |
| **Party** | Greatsword 1 · Axe 2 · Lance 2 · Bow 1 · Katana 1 · Fire 2 · Blizzard 2 · Thunder 2 · Light 1 · Dark 1 | **4.72** | **0.67 (12%)** | **20%** | **5.38** |

Read: the mirror of C1, level with it to 0.01 BT.

**C3. Both pures swapped to their expanders** (Party 1's others)

| Member | Weapons | Damage | Support | Healing | V |
|---|---|---|---|---|---|
| Spellfist | Greatsword, Axe, Fire (all ATK) | 1.06 · 23% | — | — | 1.06 |
| Battlemage | Fire, Thunder, Greatsword (all M.ATK) | 1.21 · 26% | — | — | 1.21 |
| Blademaster | Katana, Axe, Thunder | 0.95 · 20% | 0.09 | — | 1.03 |
| Invoker | Dark, Blizzard, Bow | 0.92 · 20% | 0.09 | — | 1.01 |
| Guardian | Lance, Greatsword, Light | 0.51 · 11% | 0.48 | 20% | 0.98 |
| **Party** | **Greatsword 3** · Axe 2 · Lance 1 · Bow 1 · Katana 1 · **Fire 2** · Blizzard 1 · Thunder 2 · Light 1 · Dark 1 | **4.65** | **0.66 (12%)** | **20%** | **5.31** |

Read: 1% under C1 in a plain fight; both channels in every damage dealer, so a Rift ward or an all-Arms boss never shuts
out a pure. Both carry the Heavy twins: Greatsword and Fire in three and two hands.

**C4. The healer to her battle expander, a Spellblade to support** (the owner's balancing pair, on Party 1)

| Member | Weapons | Damage | Support | Healing | V |
|---|---|---|---|---|---|
| Berserker | Greatsword, Axe, Lance | 1.09 · 24% | — | — | 1.09 |
| Archmage | Fire, Blizzard, Thunder | 1.24 · 27% | — | — | 1.24 |
| **Sentinel** | Katana, Greatsword, Light | 0.80 · 17% | **0.24** | **3.7%** (her Barrier) | 1.04 |
| Invoker | Dark, Blizzard, Bow | 0.92 · 20% | 0.09 | — | 1.01 |
| **Templar** | Lance, Greatsword, Light | **0.61 · 13%** | 0.30 | **14%** | 0.90 |
| **Party** | **Greatsword 3** · Axe 1 · Lance 2 · Bow 1 · Katana 1 · Fire 1 · Blizzard 2 · Thunder 1 · **Light 2** · Dark 1 | **4.66** | **0.63 (12%)** | **18%** | **5.29** |

Read: the pair balances: the Templar's +0.10 BT of damage and −6 points of healing against the Sentinel's −0.15 BT and
+0.21 of statuses (she brings the Paladin's missing Brave and Faith at full) and her ward. 1.5% under C1, 2 points less
healing.

**C4b. The same on Party 2:** Berserker, Archmage, **Enchanter** (Light, Blizzard, Katana), Warlord, **Exorcist**.
Damage 4.67, support 0.62 (12%), healing 18%, V 5.29; the Enchanter brings the Cleric's missing Armor Break (her V 1.09,
the party's best support).

**C5. A Summoner to support** (Party 2's others)

| Member | Weapons | Damage | Support | Healing | V |
|---|---|---|---|---|---|
| Berserker | Greatsword, Axe, Lance | 1.09 · 24% | — | — | 1.09 |
| Archmage | Fire, Blizzard, Thunder | 1.24 · 27% | — | — | 1.24 |
| Runeblade | Thunder, Blizzard, Katana | 0.96 · 21% | 0.10 | — | 1.06 |
| **Druid** | Bow, Greatsword, Dark | 0.82 · 18% | **0.11**; **Enfeeble on every foe** | **5.5%** (her mend) | 0.93 |
| Bishop | Light, Fire, Lance | 0.49 · 11% | 0.41 | 20% | 0.90 |
| **Party** | Greatsword 2 · Axe 1 · Lance 2 · Bow 1 · Katana 1 · Fire 2 · Blizzard 2 · Thunder 2 · Light 1 · Dark 1 | **4.61** | **0.61 (12%)** | **26%** | **5.22** |

Read: 3% under C2 in damage terms, **the most sustain of the Party 2 shapes**: Enfeeble at full on every foe (Tier 1's
path alone cut damage taken by about 13%, §2.7) and 26% healing. Its value shows on the stress check, not on curve.

**C6. Double expander: both hybrids to support** (Party 1's others)

| Member | Weapons | Damage | Support | Healing | V |
|---|---|---|---|---|---|
| Berserker | Greatsword, Axe, Lance | 1.09 · 25% | — | — | 1.09 |
| Archmage | Fire, Blizzard, Thunder | 1.24 · 28% | — | — | 1.24 |
| **Sentinel** | Katana, Greatsword, Light | 0.80 · 18% | 0.22 | 3.7% | 1.02 |
| **Shaman** | Dark, Blizzard, Bow | 0.81 · 18% | 0.10; Enfeeble on every foe | 5.5% | 0.91 |
| Guardian | Lance, Greatsword, Light | 0.51 · 11% | 0.31 | 20% | 0.81 |
| **Party** | **Greatsword 3** · Axe 1 · Lance 2 · Bow 1 · Katana 1 · Fire 1 · Blizzard 2 · Thunder 1 · **Light 2** · Dark 1 | **4.46** | **0.63 (12%)** | **29%** | **5.09** |

Read: the support-heavy party: 5% under C1 on curve, the most healing of any comp (29%) and full Enfeeble. Three status
carriers overlap: the Guardian's value falls from 0.99 to 0.81 because the Sentinel's Armor Break and the Shaman's Mind
Break duplicate hers. **Two supports beside a keeper healer is the one shape where the cap bites.**

**C7. Every member an expander**

| Member | Weapons | Damage | Support | Healing | V |
|---|---|---|---|---|---|
| Spellfist | Greatsword, Axe, Fire | 1.06 · 24% | — | — | 1.06 |
| Battlemage | Fire, Thunder, Greatsword | 1.21 · 27% | — | — | 1.21 |
| Sentinel | Katana, Greatsword, Light | 0.80 · 18% | 0.23 | 3.7% | 1.03 |
| Shaman | Dark, Blizzard, Bow | 0.81 · 18% | 0.10; Enfeeble on every foe | 5.5% | 0.91 |
| Templar | Lance, Greatsword, Light | 0.61 · 14% | 0.25 | 14% | 0.85 |
| **Party** | **Greatsword 4** · Axe 1 · Lance 1 · Bow 1 · Katana 1 · **Fire 2** · Blizzard 1 · Thunder 1 · **Light 2** · Dark 1 | **4.50** | **0.58 (11%)** | **23%** | **5.07** |

Read: still all ten kinds and within 6% of C1: no member is dead weight. The Greatsword in four hands is the cost of
breadth.

**C8. Tier 3: a mixed five** (one of each kind of twist; Tier 3 Lv 50, every class at Class Rank 50: the crown +11% on
her damage, her family's mastery)

| Member | Weapons | Damage | Support | Healing | V |
|---|---|---|---|---|---|
| Berserker (Juggernaut ×1.08) | Greatsword, Axe, Lance | 1.31 · 25% | — | — | 1.31 |
| Battlemage (Resonance ×1.07) | Fire, Thunder, Greatsword | 1.44 · 27% | — | — | 1.44 |
| Blademaster (Spellbind ×1.06) | Katana, Axe, Thunder | 1.11 · 21% | 0.04 + Breaks 0.07 | — | 1.22 |
| Shaman (Menagerie ×1.03) | Dark, Blizzard, Bow | 0.93 · 17% | 0.13; Enfeeble on every foe | 5.5% | 1.05 |
| Bishop (Overflow) | Light, Fire, Lance | 0.54 · 10% | 0.48 | 20% + Overflow's Barriers | 1.02 |
| **Party** | Greatsword 2 · Axe 2 · Lance 2 · Bow 1 · Katana 1 · Fire 2 · Blizzard 1 · Thunder 2 · Light 1 · Dark 1 | **5.34** | **0.71 (12%)** | **26%** | **6.05** |

Read: in Tier 3's own units (before its crown) the same shares as Tier 2, +13% on top: Tier 3 deepens every class alike
and changes no comp's balance. Mastery factors are estimates (§6.4).

### 5.3 The comps side by side

| Comp | Kinds (all ten in every comp) · doubled or more | Damage (BT) | Support (BT, share) | Total V | Healing (% HP a round) | Enfeeble | Read |
|---|---|---|---|---|---|---|---|
| Tier 1 Party 1 · Party 2 | GS, Axe, Lance, Ice, Thunder ×2 · Axe, Lance, Fire, Ice, Thunder ×2 | 4.49 · 4.50 | 0.43 (9%) | 4.92 · 4.93 | 20% | path | The reference |
| **C1** Party 1's keepers | as Party 1 | 4.71 | 0.67 (12%) | **5.37** | 20% | path | Tier 1-like, every twist on |
| **C2** Party 2's keepers | as Party 2 | 4.72 | 0.67 (12%) | **5.38** | 20% | path | Its mirror |
| **C3** Both pures swapped | GS ×3, Axe, Fire, Thunder ×2 | 4.65 | 0.66 (12%) | **5.31** | 20% | path | Breadth for 1%; wards can't shut a pure out |
| **C4** Battle healer + Sentinel | GS ×3, Lance, Ice, Light ×2 | 4.66 | 0.63 (12%) | **5.29** | 18% | path | The owner's balancing pair: level within 1.5% |
| **C4b** Exorcist + Enchanter | Axe, Lance, Fire, Ice, Light ×2 | 4.67 | 0.62 (12%) | **5.29** | 18% | path | The same on Party 2 |
| **C5** Summoner support | GS, Lance, Fire, Ice, Thunder ×2 | 4.61 | 0.61 (12%) | **5.22** | 26% | **full, every foe** | Sustain for 3% |
| **C6** Both hybrids support | GS ×3, Lance, Ice, Light ×2 | 4.46 | 0.63 (12%) | **5.09** | **29%** | **full** | The safest; the cap bites the healer |
| **C7** Every member an expander | GS ×4, Fire, Light ×2 | 4.50 | 0.58 (11%) | **5.07** | 23% | **full** | No dead weight |
| **C8** Tier 3 mixed (Tier 3 units) | GS, Axe, Lance, Fire, Thunder ×2 | 5.34 | 0.71 (12%) | **6.05** | 26% | **full** | Tier 3 deepens all alike |

**Every Tier 2 comp sits within 6% of C1 on curve** (5.07–5.38 BT), and the ones that give up the most damage (C5, C6,
C7) hold the most sustain. That is R2-11's ask: Tier 1-like, swapped-pure and swapped-support parties within one band.

### 5.4 Each class against her parent (the guardrail)

Each Tier 2 class in her parent's Tier 1 party (the other four Tier 1), V against her parent's:

| Class | V · parent | Gain | Class | V · parent | Gain |
|---|---|---|---|---|---|
| Berserker | 1.09 · 1.00 | **+9%** | Spellfist | 1.06 · 1.00 | **+6%** |
| Archmage | 1.24 · 1.14 | **+9%** | Battlemage | 1.21 · 1.14 | **+7%** |
| Blademaster | 1.03 · 0.98 | **+6%** | Sentinel | 1.02 · 0.98 | **+5%**, + a 3.7% Barrier |
| Runeblade | 1.06 · 1.00 | **+6%** | Enchanter | 1.06 · 1.00 | **+7%**, + 3.7% |
| Warlord | 1.02 · 0.94 | **+9%** | Druid | 0.92 · 0.94 | **−2%**, + a 5.5% mend and full Enfeeble |
| Invoker | 1.01 · 0.93 | **+9%** | Shaman | 0.91 · 0.93 | **−2%**, + the same |
| Guardian | 0.96 · 0.88 | **+10%** | Templar | 0.98 · 0.88 | **+12%**, healing 20% → 14% |
| Bishop | 0.94 · 0.86 | **+9%** | Exorcist | 0.96 · 0.86 | **+11%**, the same |

- **Twelve of sixteen within +5 to +10%**, the mean +7%; the battle healers +11–12% on curve, which the stress check
  (their −30% healing) brings back; the Summoners' supports −2% on damage with the most sustain of any class.
- **The knobs, in order** (T2B owns them): Momentum's step; the cross-wielders' hand; the support cuts (0.85, 0.9); the
  battle healers' shares (0.7) then hand (0.6); the hybrid keepers' hands (D249's order); the Guardian's and Bishop's
  stack, last.

## 6. Tier 3 in full

### 6.1 No new class (T2C57)

**Tier 3 plays the same sixteen, with no promotion.** She ascends as her Tier 2 class; **every Tier 2 class she held in Tier 2 is open and
held** in Tier 3 at Class Rank 1 (the shared ladder raises them together), and the door works as in Tier 2. The Ascend
sheet suggests the class she ascends as. **Why no Tier 3 classes:** thirty-two classes would be the "extreme variants" the
owner fears and would double every doc's class tables; Tier 3's depth is in the trees (two lines, crowns, a master slot)
and the mastery, which deepen every class alike (C8).

### 6.2 Two lines held (T2C19)

She holds two of a tree's three lines (default A and B), each with its own tip pick, and equips from both; Auto picks
between them each turn. 8 skills a tree, 24 on her trees and 3 on her class line: **27 held, 10 equipped and the master
slot.**

### 6.3 The crown (T2C20, T2C21)

**At Class Rank 50 in Tier 3 every capstone she holds is crowned:** each held line's depth 5, and her class line's.

| | A capstone (depth 5) | **Crowned** (Class Rank 50) |
|---|---|---|
| Power | 4.6 at Rank 3 (4.37 → 4.83) | **5.6**, whole (no Skill Rank) |
| Full-turn MP | 26 + its shape's | + 4, × her hand and ×2.4 |
| Status | Its stacks | One more, to the cap of 3 |
| Name | The tree's capstone | **The same name, crowned** (a crown mark beside it) |

- Her Limit Break's open depth reads 5.6; MP back a round gains a **sixth step, 6%**. No depth-6 node and no new name.
- **The twists don't crown:** Momentum stays +5% a stack and three stacks, the supports' ladders stay 1 · 1 · 2 · 2 · 3.

### 6.4 The master slot and the masteries (T2C22, T2C58)

- **The master slot:** one crowned capstone, a tree's or her class line's, outside her ten equipped.
- **The mastery** is her **hall family's**, the same for both children of every parent in it, at Class Rank 50 with her
  class line's crown. Five:

| Family | Its classes | Mastery | Effect (a draft; T2B sets it) | Estimate on her damage |
|---|---|---|---|---|
| Warrior | Berserker, Spellfist | **Juggernaut** | An unbroken foe takes ×0.6 from her hits, not ×0.5 | +8% |
| Mage | Archmage, Battlemage | **Resonance** | Her capstones and her class capstone strike again at 30%; the echo chips nothing | +7% |
| Spellblade | Blademaster, Runeblade, Sentinel, Enchanter | **Spellbind** | Both halves of her act weak on one foe: the act +20% | +6% |
| Summoner | Warlord, Invoker, Druid, Shaman | **Menagerie** | Her lingering summons stay for two of her pairs, a farewell at both (a Druid's or a Shaman's mend twice) | +3% and chips |
| Healer | Guardian, Bishop, Templar, Exorcist | **Overflow** | A mend's healing past max HP becomes a Barrier, up to 10% of max HP | Sustain |

None adds a status, an act, a kind or a refund. "Unstoppable" (CP27's) is a master-data skill name, so the Warrior's is
Juggernaut.

### 6.5 Counts by tier

| | Tier 1 | Tier 2 | Tier 3 |
|---|---|---|---|
| Classes in the world | 5 Tier 0 + 8 Tier 1 | 16 | 16 |
| Open to an Uma on arrival | Her calling's Tier 0, every Tier 0 | At least 6 | Every one she held in Tier 2 |
| Class rules | — | 8 (mirrors share) | 8 + 5 masteries |
| Trees she uses | 3 | 3 + her class line | 3 + her class line |
| Nodes a weapon tree | 8 | 14 (+ ★ tip on her lead tree) | 14; crowns are a state |
| Lines held a tree | 1 | 1 | 2 |
| Skills held · equipped | 15 · 3 → 7 | 18 · 3 → 10 | 27 · 10 + master |
| Picks a class | 3 | 7 | 10 |
| Nodes across the catalog | 560 | 560 + 210 (C) + 210 (Break tips) + 48 class-line nodes (16 × 3; 30 names) = 1,028 | The same |
| New names | — | 16 classes, Momentum (and round 1's line words) | 5 masteries |

## 7. Provides and assumes

| Doc | This doc provides | This doc assumes |
|---|---|---|
| **gear.md (T2G)** | **Slots and channels by class** (§4.1): 3 Arms (Berserker), 3 Tomes (Archmage), 2 Arms + 1 Tome (Spellfist, Blademaster, Sentinel, Warlord, Druid, Guardian, Templar), 2 Tomes + 1 Arm (Battlemage, Runeblade, Enchanter, Invoker, Shaman, Bishop, Exorcist); **which stat each slot's hits read** (the cross-wielders read one stat on every hit, §4.4); the sixteen presets (§4.12); a Spellfist wears Pendants and a Battlemage Charms; armor half by parent; the Ascend sets her class (R2-6's weapon types are set on the same sheet) | Weapon types (R2-6) and grades per weapon kind; the accessory tree (R2-7) keeps three slots; an off-channel weapon grades with its own items |
| **extra-stats.md (T2E)** | **Prowess:** a Tier 2 class splits it as her parent does, except **the Spellfist all to ATK and the Battlemage all to M.ATK** (T2E20); **damage kinds and shapes each class leans on** (R2-8's AoE and multi-hit branches): Berserker single-target and heavy (Greatsword, Lance's scatter, the Axe's sweep), Archmage area (Blizzard, Nebula), Spellfist and Battlemage the Heavy twins, Blademaster and Runeblade **multi-hit on one foe**, Warlord and Invoker **area and farewells on every foe**, Sentinel and Enchanter multi-hit with statuses, Druid and Shaman area with statuses, the healers one hit a skill; **MP back and life steal** suit the supports and battle healers (their acts cost the most for their damage) | Extra Stats × tier; any branch reads a hit's own kind; no branch adds a status or a healer |
| **professions.md (T2P)** | **Arms/Tome split by class** (weapon demand): Berserker 3/0, Archmage 0/3, the 2 + 1 classes 2/1, the 1 + 2 classes 1/2; the presets' weapons (§4.12): the expanders pull the Greatsword (Spellfist, Battlemage, Sentinel, Druid) and the Light and Dark Tomes; every class still slots three weapons | Her calling still fixes her trade's line and its two branches (professions' round 2); a class switch or the Ascend's pick never moves them; R2-9's second material feeds the off-channel weapons as any weapon |
| **balance.md (T2B)** | **The kits to measure:** Momentum (+5% a stack, a stack a turn, cap 3); the cross (×1.05, one stat); both halves (familiar, farewells); the supports (×0.85 and ×0.9; the support level; Barrier a third, mend a tenth); the healer keepers (+1 stack); the battle healers (×0.6 power, ×0.7 MP, ×0.7 shares); class lines, line C, the Break tip, the crown, the masteries, LB+, skill MP ×1.7 · ×2.4, the healing divisor; **the comps C1–C8 and the model's numbers** (§5) to replace; the band and the stress check (§5.1); the knob order (§5.4) | It owns R2-11's measurement, the stack (WP31), the foe terms, weaknesses and shields by tier; statuses ±10% a stack, cap 3 |
| **templates.md (T2U)** | **Her Flourish's family in Tier 2** (§4.9: Warrior 6, Mage 6, Spellblade 4, Summoner 4, Healer 4 classes; kin outside); **her lead weapon** is her Tier 2 class's first slot (§4.12: the Spellfist's Greatsword, the Battlemage's Fire, the Sentinel's Katana, the Enchanter's Light, the Druid's Bow, the Shaman's Dark; a keeper's is her parent's) | It owns the ★ tip on that tree, the Flourish's 4% |
| **progression.md (T2W)** | **The Ascend's class pick** (§4.9: who's open, the Suggested rule, held at Class Rank 1), agreeing with its round 2's T2W17 (both children of every Tier 1 class at Rank 50) and T2W18 (her active class's keeper Suggested); **the door at Class Rank 20** (T2C48, this doc's addition); Tier 3's arrival with no promotion (§6.1); the window's Class steps reading Tier 2 classes (R2-10) | Ascend one Uma at a time (D283); its sheet's flow; windows by tier |

## 8. Save and engine

Rough, not packets. A later save version (after the dark v37 and v38) and one engine stage.

| Data | Stored | Derived |
|---|---|---|
| The sixteen | Class ids `berserker`, `spellfist`, `archmage`, `battlemage`, `blademaster`, `runeblade`, `sentinel`, `enchanter`, `warlord`, `invoker`, `druid`, `shaman`, `guardian`, `bishop`, `templar`, `exorcist`, each with its `parent` and kind, generation 2 in `rpg/class-tree.ts` | Their hands, leans (the parent's), rules |
| Open classes | `open: classId[]` on her later-tier profile, written at Ascend (the Rank 50 parents' children) and by a door | — |
| Per held class | Class Rank, weapons, lines, equipped (as Tier 1's), line C `lines[weapon] = 'C'`, tips `tips[weapon]: 'break' \| 'signature'`, Tier 3's `held[weapon]`, the master slot | Skill Ranks, crowns, mastery, the class line's skills |
| Momentum, the supports' Barriers | — (fight state) | — |

- **Trees:** a Tier 2 class reads her parent's tree ids (`brawler-greatsword` for the Berserker's Greatsword; the
  Spellfist's Fire `mage-tome-fire`), so the catalog adds line C, the Break flags and the class lines only
  (`<class>-line.<depth>`, 48 ids, 30 names).
- **Engine:** one stage, `t2Classes`, at the next free engine (after v21; T2W15's v22): the sixteen kits (hands, a hit's
  offense stat, the familiar on both halves, both summons lingering, the support level, the support Barrier and the
  farewell mend, the keeper healers' +1 stack, the battle healers' shares), Momentum, class lines, line C, the Break
  tip, crowns, masteries, LB+, skill MP ×1.7 · ×2.4 and the healing divisor × tier. Fights on older engines replay as
  they were.
- **Migration:** none in Tier 1's world. An Uma already in a later world becomes **her Tier 1 class's keeper** at the same
  Class Rank, with her weapons, lines and equipped skills; her open classes are both children of every Tier 1 class she
  holds there at Class Rank 50, and at least her own class's two.

## 9. Pacing

- **The pick is free and immediate** on the Ascend; at least six classes on day one.
- **Class Rank** keeps Tier 1's curve and 2E a win: the shared ladder ends at Lv 10, depths at Lv 16 · 22 · 29, Rank 50
  at Lv 36 on her active class; **two classes to Rank 50 a campaign** (50,960 Class EXP), as Tier 1 after its Tier 0.
- **The door** at Class Rank 20 comes at about Lv 16 on her active class: from there most of the sixteen are a tap away.
- **Switching** costs only the weapons her new class slots that she hasn't graded; the Ascend resets every grade, so on
  day one any preset costs the same. Nothing is bought or crafted here.

## 10. The previews

| Page | What it shows |
|---|---|
| [classes-tiers.html](previews/classes-tiers.html) | Tier 1 → 2 → 3: what each tier adds, the sixteen by family, Class Rank pace (XR1's shared ladder), Lv 50 sheets, MP and healing by tier, the four status levels, the Halls, the counts |
| [classes-branches.html](previews/classes-branches.html) | **The sixteen:** each Tier 1 class's keeper and expander side by side, their kits, Momentum's ramp by fight length, the cross-wield's hit, both halves, the supports' Barrier and mend, the healers' two ways |
| [classes-trees.html](previews/classes-trees.html) | A tree viewer by tier for the sixteen: whose tree, trunk, A, B, C, the tips, the class line, two lines held and crowns, statuses by level, every name from the D298 grammar |
| [classes-comps.html](previews/classes-comps.html) | **New.** The party comps: C1–C8 as cards, the side-by-side table, and a party builder that applies §5.1's formula to any five (kinds in hand, damage, support, healing, V) |
| [classes-promotion.html](previews/classes-promotion.html) | **New.** The Ascend sheet's class pick (pick the Tier 1 classes at Rank 50, see who's open and Suggested), the Classes sheet's switch, and the door's map |

**The old pages** (`tier-rework/previews/`), carried or retired (T2C30, kept):

| Old page | Fate | Why |
|---|---|---|
| class-overview.html | **Carried** into classes-tiers.html | Its overview and composition; its calling-pick card retired (CV19) |
| class-templates.html | **Carried** into classes-tiers.html (sheets, stats) and classes-branches.html (kits) | Its affinity tab retired (UT11); its focus and reverse sets retire with round 1's branches (R2-2) |
| class-trees.html | **Carried** into classes-trees.html | The tree viewer, on 70 trees, the sixteen and D298's names |
| class-weaknesses.html | **Retired** | Weaknesses v2 (D235); its coverage part lives in classes-comps.html |
| classes-composition.html, classes-strikes.html, classes-template-sheets.html, classes-trees.html | **Retired** | The first round's |
| skills-all-classes-t1.html, skills-profile.html, skills-trees-by-tier.html | **Retired** | The first round's skill trees |

## 11. Names (T2C59)

- **Checked 2026-11-04, case-insensitive exact match, against every string of the master-data release** (uma-platform
  `content/release/data`, all ten files: art, characters, courses, objectives, outfits, races, scenarios, skills, support
  cards, tracks; 18,227 distinct strings) **and the game's own string literals** (`packages/domain/src`, `apps/web/src`;
  12,626): statuses, shapes, places, Limit Breaks, tree words, node names, template types, knack words, Finals routes.
- **Clear:** Berserker, Spellfist, Archmage, Battlemage, Blademaster, Runeblade, Sentinel, Enchanter, Warlord, Invoker,
  Druid, Shaman, Guardian, Bishop, Templar, Exorcist, Momentum; the labels "Tomes on ATK", "Arms on M.ATK", "Keeper",
  "Expander". No name over two words or 11 characters.
- **Two game strings, by design:** "Berserker" and "Warlord" are the pre-v16 summons that CP21 renamed (Marauder, Jotun
  King) so these words could name classes; only replays of fights from engine v15 and before show them. "Sentinel"
  appears inside an older generation's summon, "Snow Sentinel"; not an exact match.
- **Refused on the way:** Crusader and Fervor (master-data strings), Ranger and Archon (summon names on the live trees),
  Mystic (an old tier word), Warden (an old template name in the game's strings, and Ward is a foes' status), Vanguard
  (master data, and a capital run's stage), Champion (the foes' boss role), Conjurer (master data, as round 1 found).
- **The owner's working titles** (True Brawler, Wild Magic Brawler, True Sorcerer, Blade wielding Sorcerer) are clear too,
  and listed as the alternative in T2C32.

## 12. Decisions

Every call, with the recommended answer. Round 1's calls keep their ids; a round-2 requirement that replaces one says so.

| Call | Decision | Recommended | Alternatives, briefly |
|---|---|---|---|
| T2C1 | The classes in Tiers 2 and 3 | **Superseded (R2-2)** by T2C31 | — |
| **T2C2** | What a Tier 0 means later | **None exists in a later world; a Tier 0 at her Ascend arrives as her Suggested Tier 2 class (T2C50); her calling still names her family, trade and template** | Keep her Tier 0 in Tier 2 |
| **T2C3** | Class Rank by tier | **1–50, gates 1 · 10 · 20 · 30 · 40, 50 the crown in Tier 3; Ranks 1–10 one shared ladder of 3,600 raising every class she holds (XR1), then each alone; depths at Lv 10 · 16 · 22 · 29, Rank 50 at Lv 36; two classes to Rank 50 a campaign** | Each class from Rank 1 alone (depths at Lv 7 · 13 · 20 · 27) |
| **T2C4** | The words Ring and Light/Dark | **Kept as words for where statuses ride: the Ring weapons carry the healers' every-skill statuses, the Light/Dark weapons the paths and the supports'; no focus** | Drop the words |
| **T2C5** | The groups' names (the owner's call) | **"Ring" and "Light/Dark"**, against the owner's Heavy · Lite · Elemental · Arcane (Heavy is a shape, Arcane a Rift front); **listed for the owner** | The owner's four with Heavy → Main and Arcane → Shade |
| T2C6–T2C10 | Branches, names, branch 1, reverse sets, focus | **Superseded (R2-2, R2-5)** by T2C31–T2C54 | — |
| **T2C11** | The class line | **One a Tier 2 class, mirrors share; her fourth tree at Class Rank 20 · 30 · 40, cast through any of her weapons (Auto: the weak one), the depth table's power and MP, Skill Ranks** | A line a family (5); none |
| **T2C12** | The ten lines | **Re-homed on the sixteen (T2C52)** | New lines for the sixteen |
| **T2C13** | Statuses on the class lines | **By her class's level: none, a path's 1 · 1 · 2, a support's or healer's 2 · 2 · 3, a Guardian's or Bishop's 3 · 3 · 3** | Every line a status |
| **T2C14** | Line C | **Joins the fork at depth 3 by family, on her parent's trees: Rout, Havoc, Tremor, Hail, Fork; Kindle, Sleet, Peal, Beam, Gloom; Swath, Strafe; Hunt, Maul; Psalm** | No line C |
| **T2C15** | The tip fork | **Every capstone forks Power or Break: the first weak hit on each foe removes one more shield point, once an act** | No tip fork |
| **T2C16** | Equipped slots | **Tier 2: one more at Lv 10, 15, 20, 25, 30, 35, 40 (10 at Lv 40); Tier 3: 10 and the master slot** | Two a tree |
| **T2C17** | Skill MP by tier | **×1.7 and ×2.4 in place of ×tier** | ×tier; ×1.8 · ×2.6 |
| **T2C18** | The healing scale by tier | **×(1 + offense ÷ (300 × the tier's multiplier)): ×1.64 at every tier's Lv 50; the supports' Barrier and mend take it** | Leave ÷ 300 |
| **T2C19** | Two lines held | **Tier 3: two of a tree's three (default A and B), each with its tip; Auto between them** | One; all three |
| **T2C20** | Depth 6 | **A crown: at Class Rank 50 in Tier 3 every held capstone plays 5.6 whole, +4 MP, one more stack; its name kept** | 50 depth-6 names |
| **T2C21** | MP back a round | **A sixth step, 6%, with Tier 3's crown** | Five in every tier |
| **T2C22** | Masteries | **Five, by hall family, at Class Rank 50 in Tier 3: Juggernaut, Resonance, Spellbind, Menagerie, Overflow** (T2C58) | Sixteen, a class each |
| **T2C23** | The Halls by tier | **The same sixteen seats in every world; home classes the Tier 1 home class's children; scales by parent; LB+ +20% at Bond 10** | New seats for the sixteen |
| T2C24 | Buffs and debuffs by tier | **Superseded (R2-3)** by T2C45 | — |
| **T2C25** | Presets by tier | **One a Tier 2 class (T2C54), setting her three accessory slots by D266's rule and gear's forms; a switch offers, never forces** | Two a class |
| **T2C26** | The party screen's hint | **Re-homed: T2C63** | — |
| **T2C27** | Names, round 1 | **Kept: round 1's 252 checked; round 2's in T2C59** | — |
| **T2C28** | The save | **T2C60** | — |
| **T2C29** | The engine | **T2C61** | — |
| **T2C30** | The old previews | **Three pages carry class-overview, class-templates and class-trees; the rest retire (§10)** | Keep the old pages |
| **T2C31** | The classes in Tier 2 | **Sixteen: a Keeper and an Expander from each Tier 1 class (R2-2). A Tier 2 world plays only them; the Tier 1 classes stay in Tier 1's world, as the Tier 0s do** | Keep the Tier 1 classes playable beside them (24) |
| **T2C32** | Their names | **Berserker · Spellfist; Archmage · Battlemage; Blademaster · Sentinel; Runeblade · Enchanter; Warlord · Druid; Invoker · Shaman; Guardian · Templar; Bishop · Exorcist** (checked, §11) | The owner's working titles ("True Brawler", "Wild Magic Brawler", "True Sorcerer", "Blade Sorcerer"), and "Keeper/Expander {parent}" for the rest |
| **T2C33** | What a Tier 2 class keeps | **Her parent's three slots' count, lean, armor half, trees, family, hall, Limit Break scale and one act a turn; one rule changes her** | Leans ±0.1 (A2); a fourth slot |
| **T2C34** | The self-buff | **Momentum, the pure keepers': +5% a stack on her own hits, a stack after each of her turns, 3 at most (+15%), the fight long, lost when she falls; never a party buff; Auto unchanged.** Worth +9.4% at Lv 50 (+7.6% fights, +11.1% bosses) | +10% a stack (13 points over the expanders); a stack a weak hit; cap 2 |
| **T2C35** | The pure expanders | **Spellfist two Arms and a Tome, Battlemage two Tomes and an Arm; every hit reads her stat; a hit keeps its kind's channel for defense, weakness, statuses and the ward; hand ×1.05** | Any three of ten; a fourth slot (+4.5%, three docs' slot counts); ×1 (a cross alone is +1–2%) |
| **T2C36** | Their gear | **Her parent's armor half; her stat's accessory (Pendant, Charm) counts on every hit; Prowess all to her stat; her other channel's weapon grades with its own items** | A split armor half |
| **T2C37** | The Spellblade keepers | **Blademaster and Runeblade: her familiar's extra hit on both halves (the same total)** | Pierce on the familiar's hit; a damage bump |
| **T2C38** | The Summoner keepers | **Warlord and Invoker: both summons linger, two farewells at her next pair** | The lead summon two pairs (Menagerie early) |
| **T2C39** | The support expanders' kit | **Hands × 0.85 (Sentinel, Enchanter) and × 0.9 (Druid, Shaman); every skill of her Katana, Bow, Light and Dark trees carries its status at 1 · 1 · 2 · 2 · 3; the Spellblades' on the tapped foe (every foe at depth 5), the Summoners' on every foe** | One cut for both (0.85: the Summoners −6%); the path widened to every line only |
| **T2C40** | The Spellblade supports' Barrier | **After each skill act, a Barrier on the most threatened: a third of the healers' share at her act's depth (9–15%), × her healing scale** | A Barrier on herself; the familiar's hit becomes the Barrier |
| **T2C41** | The Summoner supports' mend | **Her farewell mends every Uma a tenth of the healers' mend share at its depth (2.8–4.4%), × her healing scale; no Rescue, cleanse or revive** | The most hurt only, a third |
| **T2C42** | Supports and the one-healer rule | **They are no healer: a support beside a healer is legal, two healers still are not** | Count them as healers |
| **T2C43** | The healer keepers | **Guardian and Bishop: every status she lands one stack more, to 3 (2 · 2 · 3 · 3 · 3; path 3 · 3 · 3); Surge gives ×1.15 where her status is at 3** | Every mend reaches every Uma (worth nothing on curve, §5.1) |
| **T2C44** | The battle healers | **Templar and Exorcist: power ×0.6, MP ×0.7, mends and Barriers ×0.7 the shares (Rescue and the revive kept), Tier 1's statuses; still the one healer** | ×0.75 and ×0.6 (+17% on curve); her statuses to a path |
| **T2C45** | Statuses by class | **Four levels: none (the four pures), a path (the hybrid keepers), support (the hybrids' expanders, new), widely (the healers, the keepers +1); five statuses, +10% a stack, cap 3** | D282's three, the supports at a path |
| **T2C46** | The Tier 2 promotion | **On her Ascend she picks among both children of every Tier 1 class she holds at Class Rank 50 (at least 6); Suggested: her ascending class's keeper, else her family's own Rank 50 class's keeper with the most Class EXP** | Every class open (round 1's CV10 rule); only her active class's two |
| **T2C47** | Switching and Class Rank | **Every open class held from arrival at Class Rank 1; switch free outside fights; each its own Class Rank; XR1's shared ladder raises all to 10** | A second promotion step per class |
| **T2C48** | Opening more in Tier 2 | **The door: a held Tier 2 class at Class Rank 20 opens the children of her parent's reclass neighbours (D290, D291's map), about the Tier 1 door's 3,600 Class EXP** | Locked for her Tier 2 life; Class Rank 50; a Class Mark price |
| **T2C49** | Kin and the Flourish in Tier 2 | **Her family is the Tier 2 children of her calling's own Tier 1 classes (Warrior and Mage 6, the others 4); a kin parent's child is never Suggested and outside her Flourish** | Every Tier 2 class her family |
| **T2C50** | A Tier 0 at her Ascend | **Arrives as the Suggested rule's class (Class V guarantees three Tier 1 classes at Rank 50)** | Her suggested promotion's keeper whatever its rank |
| **T2C51** | Whose trees | **A Tier 2 class plays her parent's trees; the Spellfist's Tomes the Sorcerer's, the Battlemage's Arms the Brawler's; no new tree or skill name** | Sixteen sets of new trees |
| **T2C52** | The class lines | **Round 1's ten on the sixteen, mirrors sharing: Rampage (Berserker), Conquest (Spellfist), Nebula (Archmage), Quasar (Battlemage), Sigil (Spellblade keepers), Bane (Spellblade supports), Griffin (Summoner keepers), Wraith (Summoner supports), Edict (healer keepers), Solace (battle healers)** | Sixteen new lines |
| **T2C53** | Line C on the sixteen | **Her parent's tree's C; the healers' Psalm kept (reach every Uma from depth 3)** | Psalm re-cut |
| **T2C54** | Presets | **Keepers wear their parent's; Spellfist Greatsword, Axe, Fire; Battlemage Fire, Thunder, Greatsword; Sentinel Katana, Greatsword, Light; Enchanter Light, Blizzard, Katana; Druid Bow, Greatsword, Dark; Shaman Dark, Blizzard, Bow; the battle healers their parent's. All 64 keeper/expander mixes of the owner's two parties hold all ten kinds** | Three Light/Dark weapons a support (56 of 64) |
| **T2C55** | Limit Break scale | **Her parent's: ×0.95 the twelve damage and support classes, ×0.8 the four healers** | ×0.9 for the supports and battle healers |
| **T2C56** | Party value, as a formula | **V = own damage + what her statuses add to the other four + her Breaks, in Brawler turns, healing capacity beside it; anchors from the harness (§2.7); the band ±5% of the sixteen's mean gain; healers on the stress check (§5.1)** | Damage only; one exchange rate for HP on curve |
| **T2C57** | Tier 3 | **No new class: the sixteen deepen (two lines, crowns, the master slot, the mastery); every Tier 2 class she held is open there; the door as Tier 2's** | A third child a class (24); Tier 3 classes |
| **T2C58** | Masteries on the sixteen | **By hall family, the same for both children of every parent; Menagerie's two pairs carry a support's mend twice; Overflow on all four healer classes** | A mastery a class |
| **T2C59** | Round 2's names | **Checked against every master-data string and the game's own: clear (§11); Crusader, Fervor, Ranger, Archon, Mystic, Warden, Vanguard, Champion refused** | Names at build time |
| **T2C60** | The save | **Sixteen class ids with their parent; `open` on a later-tier profile; per held class Tier 1's record plus line C, tips, Tier 3's held lines and the master slot; Momentum is fight state; an Uma already in a later world becomes her class's keeper** | Store each Tier 1 Rank 50 and derive `open` |
| **T2C61** | The engine | **One stage, `t2Classes`, after v21: the sixteen kits, Momentum, class lines, line C, Break tips, crowns, masteries, LB+, MP ×1.7 · ×2.4, the healing divisor** | A stage each for Tier 2 and 3 |
| **T2C62** | The previews | **Five pages: tiers, the sixteen, trees, comps (new), promotion (new)** | Three |
| **T2C63** | The comps and the party hint | **Eight comps (and Party 2's C4b) for T2B to measure, C1 and C2 the reference; the party screen names an open class of a member whose preset holds a missing kind** | Require every mix to hold all ten |
| **T2C64** | Where the band is read | **On curve for the twelve damage and support classes (V), on the stress check for the healers and the Summoners' supports (sustain), both in T2B** | One reading for all sixteen |

*Names checked 2026-11-04 against uma-platform `content/release/data` (10 files, 18,227 distinct strings) and the game's
own strings (`packages/domain/src`, `apps/web/src`).*
