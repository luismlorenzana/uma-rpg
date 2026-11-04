# Classes in Tiers 2 and 3

> **Status: drafting, 2026-11-04. Nothing here is built.** One doc of the [Tier 2 and Tier 3 set](README.md) (ids
> **T2C1–T2C30**). It carries the approved class drafts ([class-progression.md](../tier-rework/class-progression.md),
> CP1–CP43, D192) onto **Tier 1 as it is live** (engine v21, save v36): five Tier 0s, eight Tier 1 classes with mirrored
> hybrids and two healers who share every number, the combat pass's three levels of buffs and debuffs (D282), sixteen
> Hall seats (D261), the owner's two party comps as presets (D263), the reclass (D290, D291) and one naming grammar
> (D298). Every Tier 1 number below comes from the manual or the code (`packages/domain/src`), never from the old drafts.
>
> **Pages** (desktop, light and dark): [classes by tier](previews/classes-tiers.html) ·
> [branches, sets and parties](previews/classes-branches.html) · [trees by tier](previews/classes-trees.html).
>
> **What it absorbs:** class-progression.md (CP), Classes v3's later-tier calls (CV), Halls v2 (HV) with D261's trim, the
> reclass (RC), skill names (SN), and the archived [Tier 2 classes](../../archive/design/tier2-classes.md) (A1–A10), which
> class-progression had already folded in. [§3](#3-the-approved-drafts-call-by-call) gives every old call a status.

## 1. At a glance

Tiers 2 and 3 keep the eight classes and add **a class branch**, **one more line on every tree**, then **a second line
held and a crown**. The branch is the owner's "Elemental Mage and a regular Summoner" idea: each class picks the Ring or the
Light/Dark side, +15% on its kinds, with a weapon set and a class line of its own.

| | **Tier 1** (live) | **Tier 2** | **Tier 3** |
|---|---|---|---|
| **Classes** | 5 Tier 0 → 8 Tier 1 at Class Rank 10 | The eight, open from Class Rank 1; no Tier 0 | The same |
| **Class branch** | — | One of her family's two: **Ring** or **Light/Dark**, +15% on its kinds, her preset or her reverse set, **a class line** at Class Rank 20 · 30 · 40 | + the line's **crown** and her family's **mastery** at Class Rank 50 |
| **A weapon tree** | Trunk, then line A or B: 8 nodes | + **line C**; each line's tip **Power or Break**; ★ signature tip (T2U): 14 nodes | **Two lines held**; every capstone she holds **crowned** at Class Rank 50; a **master slot** |
| **Skills held · equipped** | 15 · 3 → 7 | 18 · 3 → 10 | 27 · 10 + the master slot |
| **Picks a class** | 3 | 7 | 10 |
| **Class Rank 20 · 30 · 40 · 50 at Uma Lv** | 16 · 22 · 29 · 36 | 13 · 20 · 27 · 34 | 13 · 20 · 27 · 34 |
| **Buffs and debuffs** | Three levels (D282): none, a path, widely | The same three; the Light/Dark class lines ride the path, the Guardian's spreads | + one stack on a crowned capstone (cap 3) |
| **Halls** | 16 seats; ×0.95 · ×0.8 | The same 16 + **LB+**: +20% at Bond 10 | + her crowned depth (5.6) |
| **Skill MP** | ×1 | **×1.7** (today ×2) | **×2.4** (today ×3) |
| **Healing scale, on-curve Lv 50** | ×1.64 | **×1.64** (today ×2.16) | **×1.64** (today ×2.68) |
| **Lv 50 offense on her lead kind** (Brawler) | 297 | 535 (×1.80) | 774 (×2.61) |

Lv 50 numbers are the balance harness's on-curve Uma (`balanceMember`: base 110, gear G10 × tier, every Extra Stats node
× tier, her preset's three accessories), printed by a throwaway test against the live code.

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
| **Summoner** (Circle) | Arms Summoner · Tome Summoner | 2 + 1 | 0.57 + 0.46 · 0.57 + 0.5; her lead summon lingers, farewell 0.3 on every foe | 1 1.1 0.95 1 1 1 · mirrored | ×0.95 |
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
  Volley (Bow, Dark). **Twins** (v19): Greatsword–Fire, Axe–Ice, Lance–Lightning, **Katana–Light**, **Bow–Dark**;
  Twilight the Bow and the Katana. Weaknesses v2 reads no twin (D235): the world deals each foe her own list.

### 2.3 Buffs and debuffs: three levels (D282)

| Class | Access | Stacks |
|---|---|---|
| Brawler, Sorcerer | **None.** Pure damage | — |
| Spellblades, Summoners | **A path:** line A of a **secondary weapon** (Katana Armor Break, Bow Enfeeble, Dark Mind Break, Light Brave and Faith) from depth 3 | 1 · 1 · 2; the debuff on the tapped foe |
| Paladin, Cleric | **Widely:** every skill of the Greatsword (Armor Break), the Lance (Mind Break) and Fire (Brave and Faith), and the same path | 1 · 1 · 2 · 2 · 3 by depth, every foe at depth 5; the path 2 · 2 · 3 |

Five statuses (Armor Break, Mind Break, Enfeeble, Brave, Faith), +10% or −10% a stack, three stacks at most, two rounds.
Aegis, Breaker, Clarity, Hex and Shatter are retired. **The secondary weapons are exactly the owner's "secondary Arms"
and "Light/Dark Tomes":** the Katana, the Bow, Light and Dark ([§4.2](#42-the-two-weapon-groups-t2c4-t2c5)).

### 2.4 Presets: the owner's two comps (D263, D266)

| Class | Standard preset (lead first) | Its kinds' group |
|---|---|---|
| Brawler | Greatsword, Axe, Lance | Ring 3 |
| Sorcerer | Fire, Blizzard, Thunder | Ring 3 |
| Arms Spellblade | Katana, Axe, Thunder | Ring 2 (Axe, Thunder) + Katana |
| Tome Spellblade | Thunder, Blizzard, Katana | Ring 2 (Thunder, Blizzard) + Katana |
| Arms Summoner | Bow, Axe, Dark | Light/Dark 2 (Bow, Dark) + Axe |
| Tome Summoner | Dark, Blizzard, Bow | Light/Dark 2 (Dark, Bow) + Blizzard |
| Paladin | Lance, Greatsword, Light | Ring 2 (Lance, Greatsword) + Light |
| Cleric | Light, Fire, Lance | Ring 2 (Fire, Lance) + Light |

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

## 3. The approved drafts, call by call

Status vocabulary (the brief, §4): **Kept** stands as written; **Kept, changed** stands with a change a Tier 1 decision
forces; **Superseded** a Tier 1 decision replaced it; **Broken** written for a Tier 1 that no longer exists, fixed here.

### 3.1 Class progression (CP1–CP43)

| Call | What it said | Status | Why, and where it lands |
|---|---|---|---|
| CP1 | Six classes in every tier | **Superseded** | D240: 13 classes; the eight Tier 1 classes in every later tier (T2C1) |
| CP2 | Three slots, typed by channel | **Kept** | Live; the eight classes' counts follow it |
| CP3 | The owner's six default sets | **Superseded** | D240 (CV16) and D263's presets; branch 1's set is the preset (T2C8) |
| CP4 | The campaign balanced on defaults | **Kept, changed** | D263: the owner's two comps are the check (both hold all ten) |
| CP5 | Tier 1 foes weak to twins | **Superseded** | D235 (weaknesses v2); T2B owns weaknesses |
| CP6 | Later tiers narrow by rank | **Superseded** | D235's WK8: every rank 3 kinds; T2B |
| CP7 | The Rift's fronts and guided builds | **Kept, changed** | D240's CV23 rebuilt the builds by family; the later tiers' Rift is T2W's |
| CP8 | Locks and shields by tier | **Kept, changed** | Tier 1 shields 6 and 8 (H71); Tiers 2–3's are T2B's |
| CP9 | Hybrids and healers on 2 + 1 | **Kept, changed** | Hands re-tuned (D249), the healers share every number (D282 H3); the mirrors share branches (T2C6) |
| CP10 | Template per tier (accessories 1 · 2 · 3) | **Kept, changed** | D264: three accessory slots in every tier; armor by tier is T2G's |
| CP11 | Presets per tier and branch | **Kept, changed** | D263, D266: two presets a class from Tier 2 (T2C25) |
| CP12 | Equippable kinds; a Dual's kind of its own channel | **Kept** | Slots live; the Dual is T2G's (WP) |
| CP13 | One tree per slot, under a class root | **Kept, changed** | D240: 70 trees, not 50 |
| CP14 | Nothing costs points | **Kept** | Live |
| CP15 | A fork changes reach, hits, support or Breaks | **Kept** | Binds line C (T2C14) |
| CP16 | Gates 1, 10, 20, 30, 40, 50 | **Kept, changed** | 50 is the crown in Tier 3, not a new depth node (T2C20) |
| CP17 | Trees never add a kind | **Kept** | — |
| CP18 | Tier 1: trunk and one fork | **Kept, changed** | Built; B lines by D246 (CV14), D282, D298 |
| CP19 | Tier 2: branch C and a Power or Break tip | **Kept, changed** | Line C by family on eight classes, five shapes and D298 names (T2C14, T2C15) |
| CP20 | Tier 3: depth-6 capstones, two branches held, master slot | **Kept, changed** | Depth 6 is a crown on the capstone, no new names (D298; T2C19, T2C20) |
| CP21 | Today's names; new ones by rule | **Superseded** | D298 (SN1–SN15); new names in T2C27 |
| CP22 | Equipped 3 → 7, 3 → 10, 10 + master | **Kept** | T2C16 sets Tier 2's gates |
| CP23 | The Skills tab as a real tree | **Kept, changed** | D267 built it as the Class tab; Tier 2 adds the class line's tile (T2C11) |
| CP24 | ★ Flourish at the root, ★ signature tip from Tier 2 | **Kept** | The tip's content is T2U's |
| CP25 | Class Rank per class, reset at promotion | **Kept, changed** | Tier 0's ladder (CV5) in Tier 1; Rank 1 at Ascend (CV10, D283) (T2C3) |
| CP26 | The class branch: a weapon-group focus | **Kept, changed** | By family on eight classes; branch 1 by preset (T2C6–T2C8) |
| CP27 | Branch capstone and mastery at Class Rank 50 | **Kept, changed** | Five masteries by family; Last Stand retires (D282 H3) (T2C22) |
| CP28 | Six halls, 24 Limit Breaks, LB+ | **Superseded** | D241, D261: five halls, sixteen seats; LB+ by HV23 (T2C23) |
| CP29 | The calling pick | **Superseded** | D240 CV19: the promotion is the pick |
| CP30 | What the pick sets | **Superseded** | CV19, CV20 |
| CP31 | Saves v27 and v28 | **Superseded** | Tier 1's rows built (R1); Tier 2's save is T2C28 |
| CP32 | Skill Ranks every 2 Class Ranks | **Kept** | Live; the class line ranks too |
| CP33 | What grows on her weapons | **Kept** | The weapon branch is T2G's; trees and focus here |
| CP34 | Three class skills a branch, 36 in all | **Broken** | They give the Brawler and the Sorcerer statuses (D282 D2), ride Aegis, Breaker, Hex and Shatter (D282 D3), and were written for six classes; one class line a branch instead (T2C11–T2C13) |
| CP35 | Two Limit Breaks' kinds | **Superseded** | D241, D261 |
| CP36 | Template affinity | **Superseded** | D197 (UT11): the signature accessory |
| CP37 | The Paladin's revive on her Light tree | **Kept, changed** | D282, D298: both healers' Grand Grace Surge |
| CP38 | Two weapon groups, Ring and Light/Dark | **Kept, changed** | Re-derived on v19's twins and D282's secondary weapons; names settled (T2C4, T2C5) |
| CP39 | +15% on the focus group's kinds | **Kept** | T2C10 |
| CP40 | Six default and reverse sets | **Broken** | Written for six classes, CP3's defaults and the old twins; eight presets and eight reverse sets (T2C8, T2C9) |
| CP41 | Party pairings by region | **Broken** | Written on CP3's defaults and CP5's twin regions (both gone); re-run on the two comps (T2C9, T2C26) |
| CP42 | The Spell Blade's B: Pierce | **Kept, changed** | CV14: both Spellblades, the Brawler's Katana B, the Sorcerer's Light B |
| CP43 | Every tree viable | **Kept, changed** | 70 trees; line C keeps every one full (T2C14) |

### 3.2 Classes v3, Halls v2, the reclass, skill names

| Call | What it said | Status | Why |
|---|---|---|---|
| CV10 | Tier 0 only in Tier 1; later tiers open every Tier 1 class at Rank 1 | **Kept** | T2C1, T2C2 |
| CV11 | One child Suggested | **Kept** | Ascend's arrival as a Tier 0 reads it |
| CV13 | Twins re-paired: Katana–Light, Bow–Dark | **Kept** | Moves no kind between groups (T2C4) |
| CV15 | The new hybrids mirror their pair | **Kept, changed** | D249's hands; mirrors share their branch (T2C6) |
| CV16 | Defaults by the owner's sets | **Superseded** | D263's presets |
| CV17 | The new trees' own names | **Superseded** | D298 |
| CV21 | ★ signature tip as any class of her family | **Kept** | T2U fills it |
| CV22 | One healer a party; a Tier 0 is none | **Kept** | Every tier |
| CV23 | The Rift's builds by family | **Kept, changed** | Later tiers' Rift is T2W's; reverse sets feed its guided builds |
| CV24 | Limit Break scale 1 · 0.75 | **Superseded** | D249: ×0.95 and ×0.8 |
| CV25 | The reset in later worlds to the mapped Tier 1 class | **Kept** | History: done at save v32 |
| CV26 | Later tiers refunded 1:1 | **Kept** | History |
| HV2 | Four seats a hall, twenty | **Superseded** | D261: sixteen |
| HV4 | Any Uma in any seat | **Kept** | — |
| HV5 | Power: own × scale × open depth | **Kept, changed** | D249's scales; Tier 3's crowned depth (T2C20) |
| HV6 | The ladder 2.9 · 2.5 · 2.2 · 1.9 · 2.0 | **Kept** | — |
| HV15 | At most 10 hits on one foe | **Kept** | — |
| HV17 | Every kind in two halls; two Heroes close a class's gaps | **Kept, changed** | D261 (28–45 of 120 pairs); the reverse sets checked too ([§4.10](#410-the-halls-in-tier-2-t2c23)) |
| HV22 | Bonds and Learners unchanged | **Kept** | — |
| HV23 | LB+: +20% at Bond 10, Tier 2 on | **Kept** | T2C23 |
| RC1, RC2, RC4, RC5 | Three children each; pure roots; kin; the Healer's four | **Kept** | Tier 1 only: no Tier 0 later |
| RC3 | Healers only from the Healer | **Superseded** | D291 |
| RC6 | A kin class is never Suggested nor her Flourish's family | **Kept** | Holds in every tier (T2C2) |
| RC7 | No save or engine bump | **Kept** | — |
| SN1–SN15 | One grammar; ladder; capstone; B = A + word; mirrors share; two renames; no clashes; no hit counts; original words; themes; healers by what they give; the revive; 3 words, 21 characters; Tier 0 and Limit Breaks keep theirs; display only | **Kept** (15) | Every new name here follows them (T2C27) |

### 3.3 The archived Tier 2 classes (A1–A10)

| Call | Status | Why |
|---|---|---|
| A1 Free switching | **Kept, changed** | Every Tier 1 class open from Rank 1 (CV10) |
| A2 Leans ±0.1 | **Superseded** | CP26: no lean change |
| A3 Side forks with points | **Superseded** | CP14, CP19 |
| A4 Twelve names | **Kept, changed** | Ten by family (T2C7) |
| A5 Twelve passives | **Superseded** | CP39: the focus |
| A6 The Ascend pick by stat | **Superseded** | CP26: branch 1 preselected (T2C8) |
| A7 LB+ for Bond 10 | **Kept** | HV23 |
| A8 Limit Break power by base class | **Superseded** | HV5 |
| A9 No Tier 1 skill carries | **Kept** | — |
| A10 Skill MP ×1.7 · ×2.4 | **Kept** | Measured again (T2C17) |

**Counts (95 calls):** Kept 46 · Kept, changed 25 · Superseded 21 · **Broken 3: CP34, CP40, CP41.**

## 4. Tier 2 in full

### 4.1 Arriving, and Class Rank (T2C1–T2C3)

- **The eight Tier 1 classes, nothing new.** No class id, lean or hand changes (CP26). Every one is open from Class Rank 1;
  there is no Tier 0 and no promotion (CV10).
- **She arrives as her class** at Class Rank 1 in every class, line A, auto loadout, her class's **branch 1**
  ([§4.3](#43-class-branches-by-family-t2c6t2c8)). A Tier 0 arrives as her suggested promotion (CV11).
- **Her calling still names her family.** Her Tier 0 is gone, but her calling (her running styles) still says which
  family her ★ Flourish works as (its own Tier 1 classes, never kin, RC6), her trade and her template.
- **Class Rank 1–50, the same gates** (1, 10, 20, 30, 40) and 2E a win. With no Tier 0 to climb first she opens each
  depth sooner than in Tier 1:

| Class Rank | Opens | Tier 1, Uma Lv (Tier 0, promoted at 10) | **Tiers 2 and 3, Uma Lv** |
|---|---|---|---|
| 1 | Depth 1 | 1 (as her Tier 0) | **1** |
| 10 | Depth 2 | 10 (the promotion) | **7** |
| 20 | Depth 3, the fork, **the class line** | 16 | **13** |
| 30 | Depth 4, the line's second skill | 22 | **20** |
| 40 | Depth 5, the capstones | 29 | **27** |
| 50 | Tier 3: **the crowns, the mastery, the master slot** | 36 | **34** |

A campaign (Lv 1–50) is 50,960 Class EXP: **exactly two classes from Rank 1 to 50** (25,480 each), as in Tier 1 after its
Tier 0.

### 4.2 The two weapon groups (T2C4, T2C5)

| Group | Arms | Tomes | Shapes | Twin sets inside it | In Tier 1 it is |
|---|---|---|---|---|---|
| **Ring** | Greatsword, Axe, Lance | Fire, Blizzard, Thunder | Heavy, Sweep, Scatter | Fire, Ice, Lightning | The pure classes' presets; the healers' every-skill statuses (Greatsword, Lance, Fire) |
| **Light/Dark** | Katana, Bow | Light, Dark | Double, Volley | Light (Katana + Light), Dark (Bow + Dark), Twilight (Bow + Katana) | D282's **secondary weapons**: every path status |

- **The v19 re-pairing moved no kind between groups.** Katana–Light and Bow–Dark are both inside Light/Dark, as
  Bow–Light and Katana–Dark were; each Ring Arm is still its Ring element's twin. CP38 stands on today's twins.
- **Since v19 the groups are also shapes:** the Ring group is the heavy, sweep and scatter kinds, Light/Dark the doubles
  and the volleys. And since D282 they are statuses: Light/Dark is the path, so **for a Spellblade or a Summoner the
  Ring side is damage and the Light/Dark side utility**; for a healer the Ring side carries a status on every skill, the
  Light/Dark side the path, Regen, drain and the revive.
- **Since v19 Light/Dark has its own reach:** the Bow's and Dark's volleys splash every other foe. CP43's "reach weapon"
  for a pure class's Light/Dark set is no longer needed; its third slot takes the heavy kind instead
  ([§4.4](#44-the-sets-preset-and-reverse-t2c9)).
- **Names (T2C5):** one word a group, both channels, as CP38 wanted: **Ring** and **Light/Dark**. The owner's four channel
  names (2026-10-24: Heavy, Lite, Elemental, Arcane) retire: "Heavy" is now the Greatsword's and Fire's shape (D246) and
  was dropped as a line name for that clash (D298 SN6); "Arcane" is the Rift's Arcane front; a hybrid's group spans both
  channels, so two words a group would print twice. On screen: "Ring +15%", "a Light/Dark Sorcerer". "Ring" is already
  the manual's word for these sets ("the Brawler and the Sorcerer keep the ring").

### 4.3 Class branches by family (T2C6–T2C8)

**A family's two classes share its two branches** (the mirrors as SN5 and D282 H3 already share names and numbers): ten
branches, not sixteen. Each class casts her branch's line with her own hand, lead half first.

| Family | Its classes | Ring branch | Light/Dark branch | Branch 1 (her preset's group) |
|---|---|---|---|---|
| Warrior | Brawler | **Berserker** | **Warlord** | Berserker |
| Mage | Sorcerer | **Sage** | **Augur** | Sage |
| Spellblade | Arms and Tome Spellblade | **Rune Knight** | **Blademaster** | Rune Knight, both |
| Summoner | Arms and Tome Summoner | **Invoker** | **Warlock** | Warlock, both |
| Healer | Paladin, Cleric | **Guardian** | **Templar** | Guardian, both |

- **Branch 1 is her standard preset's group,** the group holding two of its three kinds (T2C8): Ring for six classes, Light/Dark
  for both Summoners. Ascend preselects it, so the owner's two comps arrive in Tier 2 as they leave Tier 1.
- **One branch at a time,** swapped free outside fights on her class tile; each of her classes keeps its own.
- **Three "branches" in the designs:** D263's (a Tier 0's child, gone in later tiers), the weapon branch (T2G's Pure or
  Dual) and this class branch. On screen a class branch shows only its name and group ("Warlock · Light/Dark +15%").
- **Names (T2C7):** class-progression's twelve, by family. Two change: the Mage's Light/Dark branch was **Sorcerer**, now
  the Tier 1 class's name (D240), so it is **Augur**; the Summoner's Ring branch was **Conjurer**, an exact master-data
  skill name, so it is **Invoker**. The healers keep the Paladin's two (Guardian, Templar); Bishop and Oracle retire with
  the Cleric's own pair.

### 4.4 The sets: preset and reverse (T2C9)

**Branch 1's set is her standard preset, unchanged. Branch 2's is her reverse set:** the other group in every slot it
can, keeping her identity (each hybrid one twin set in both halves, her multi-hit or area kinds; each healer her Light
Tome and its revive), and among the sets left, the one that keeps the most party mixes at all ten kinds (a script over
every combination, both comps, 64 mixes).

| Class | Branch 1 · focus · set | Boosted | Branch 2 · focus · reverse set | Boosted | What flips |
|---|---|---|---|---|---|
| Brawler | Berserker · Ring · Greatsword, Axe, Lance | 3 | Warlord · Light/Dark · **Bow, Katana**, Greatsword | 2 | Weight and reach → the volley, the double and the Break |
| Sorcerer | Sage · Ring · Fire, Blizzard, Thunder | 3 | Augur · Light/Dark · **Light, Dark**, Fire | 2 | The ring's three → Light's double, Dark's volley, Fire's nuke |
| Arms Spellblade | Rune Knight · Ring · Katana, **Axe, Thunder** | 2 | Blademaster · Light/Dark · **Katana, Bow, Dark** | 3 | Damage → the path (Armor Break, Enfeeble, Mind Break); Bow + Dark in both halves |
| Tome Spellblade | Rune Knight · Ring · **Thunder, Blizzard**, Katana | 2 | Blademaster · Light/Dark · **Light, Dark, Katana** | 3 | Damage → the path; Light + Katana in both halves |
| Arms Summoner | Warlock · Light/Dark · **Bow**, Axe, **Dark** | 2 | Invoker · Ring · **Axe, Lance, Blizzard** | 3 | The path → damage; Axe + Ice in both halves, all area |
| Tome Summoner | Warlock · Light/Dark · **Dark**, Blizzard, **Bow** | 2 | Invoker · Ring · **Blizzard, Thunder, Axe** | 3 | The path → damage; Ice + Axe in both halves |
| Paladin | Guardian · Ring · **Lance, Greatsword**, Light | 2 | Templar · Light/Dark · **Katana, Bow, Light** | 3 | Every-skill Armor and Mind Break → the path, Regen and the revive |
| Cleric | Guardian · Ring · Light, **Fire, Lance** | 2 | Templar · Light/Dark · **Light, Dark, Bow** | 3 | Brave and Faith on every skill → the path, drain and the revive |

**The two comps, member by member** (P her preset, R her reverse set; order Brawler, Sorcerer, Spellblade, Summoner,
healer). **33 of the 64 mixes hold all ten kinds**, against 16 with CP43's reach weapon (Axe, Blizzard) in the pure classes'
third slot:

| Mix | Party 1 (Arms Spellblade, Tome Summoner, Paladin) | Party 2 (Tome Spellblade, Arms Summoner, Cleric) |
|---|---|---|
| **All branch 1** (P P P P P) | **10** | **10** |
| The owner's swap: Sorcerer and Summoner flipped (P R P R P) | 9 (no Bow) | 9 (no Bow) |
| … and the Spellblade too (P R R R P) | **10** | 8 (no Bow, Lightning) |
| … and the healer too (P R P R R) | **10** | **10** |
| The Light/Dark side for every pure class (R R P P P) | **10** | **10** |
| Every member flipped (R R R R R) | 9 (no Lance) | 9 (no Lightning) |
| Mixes at ten, of 32 | **16** | **17** |

- **The rule of thumb on the party screen (T2C26):** when the magic pair swaps, flip the healer too (both comps), or the
  Arms Spellblade (Party 1). A mix that drops a kind names the member whose other set brings it back: "No Bow: the
  Paladin's Light/Dark set holds one".
- Every count is on one kind a weapon, so it holds whatever weapon branch she takes (a Dual's second kind, T2G).

### 4.5 The focus (T2C10)

**+15% damage on hits of her branch's group's kinds**, read on a hit's own kind (its weapon's first kind); a healer's
mends and Barriers from those skills +15% too. On from Class Rank 1; never ranks; a percentage, so the same in every tier
(SB1). It sits in the damage stack beside the weak multiplier (T2B prices the stack, WP31). Her focus trees carry the
mark "Ring +15%" on the Class tab. The plain word "focus" equals a master-data skill string, so it stays a word in
sentences, never a label (as D298 kept Cleave and Breach).

### 4.6 The class line (T2C11–T2C13)

**One line a branch, her fourth tree:** it opens at **Class Rank 20, 30 and 40** (depths 3–5) and is cast **through one
of her focus weapons** (any weapon if she slots none): its kind, channel, Might and accessory flat on that kind, and the
focus's +15%. Auto casts it through the focus weapon that lands weak; on her bar she picks. A hybrid's line is **her
pair**: her Arms half through one of her Arms, her Tome half through her Tome. A healer's is a blow or a spell.

- **Names by D298:** the branch has one word; depth 3 "Grand {word}", depth 4 "Supreme {word}", depth 5 its capstone.
- **Power and MP from the depth table** (2.9 · 3.7 · 4.6 at Skill Rank 3; MP 18 · 22 · 26 + its shape's), her hand on
  top; **Skill Ranks** every 2 Class Ranks like any skill.
- **Priced like a line** (CP15, CP34's rule): 10–20% over the same depth's line A in its context, behind it elsewhere.
- **Statuses follow D282's three levels (T2C13):** a Brawler's or a Sorcerer's line never carries one; a Spellblade's or a
  Summoner's only through a Light/Dark weapon, at the path's 1 · 1 · 2; a healer's at her 2 · 2 · 3.

| Branch | Its line (CR 20 · 30 · 40) | What it does | Status | MP (full turn) |
|---|---|---|---|---|
| **Berserker** | Grand Rampage · Supreme Rampage · **Skybreaker** | The tapped foe takes the full power, every other foe 0.3 of it (1.0 on one foe, 1.6 on three, 2.2 on five) | None | depth + 4 |
| **Warlord** | Grand Conquest · Supreme Conquest · **Sundown** | One foe at the full power; on a Broken foe every other foe also takes 0.55 | None | depth + 2 |
| **Sage** | Grand Nebula · Supreme Nebula · **Starburst** | Every foe at the area share (0.55); a foe weak to its kind takes the full power | None | depth + 4 |
| **Augur** | Grand Quasar · Supreme Quasar · **Event Horizon** | One foe, one hit at ×1.25 the power | None | depth × 1.5 |
| **Rune Knight** | Grand Sigil · Supreme Sigil · **Rune Edge** | Her pair: her lead half on one foe (her familiar's extra hit), her other half on every foe at 0.55 | None | depth + 2 |
| **Blademaster** | Grand Bane · Supreme Bane · **Penumbra Edge** | Her pair on one foe; through a Light/Dark weapon, its path status (Armor Break, Enfeeble, Mind Break; Brave and Faith on every Uma) | 1 · 1 · 2 | depth |
| **Invoker** | Grand Griffin · Supreme Griffin · **Kraken** | Her pair on one foe; her lead summon lingers at 0.5, not 0.3, so its farewell strikes every foe harder | None | depth + 2 |
| **Warlock** | Grand Wraith · Supreme Wraith · **Banshee** | Her pair, her lead summon on every foe at 0.55; through a Light/Dark weapon, its path status on the tapped foe (a buff on every Uma) | 1 · 1 · 2 | depth + 4 |
| **Guardian** | Grand Edict · Supreme Edict · **Covenant** | A blow or a spell on one foe. Through the Greatsword, the Lance or Fire its status reaches every foe or every Uma from depth 3; through the Axe, Blizzard or Thunder its Barrier or mend reaches every Uma (the most threatened or hurt whole, the rest ×0.4) | 2 · 2 · 3 | depth + 4 |
| **Templar** | Grand Solace · Supreme Solace · **Absolution** | A blow or a spell on one foe, then a mend on the most hurt **and** a Barrier on the most threatened, both whole; Light's Regen, Dark's drain, a Katana's or Bow's path status ride it | Path 2 · 2 · 3 | depth + 4 |

**On the Class tab** (CP23, built by D267): a fourth tile under her class tile, her branch ("Rune Knight · Ring +15%"),
opens the line's three skills with rank pips; a tap on the other branch swaps it and offers its set ("Use the
Light/Dark set: Katana, Bow, Dark"), never forced.

### 4.7 The weapon trees in Tier 2 (T2C14, T2C15)

**Line C joins the fork at depth 3**, by the same rules as A and B (free, exclusive, swappable), and **every line's
capstone forks Power or Break**. 14 nodes a tree (8 + C's 3 + three Break tips), and the ★ signature tip as a third tip
option on her lead weapon's tree (T2U).

**Line C, by family** (D298: the line's word after line A's name; the C word follows each class's own half, as Oath and
Pack do):

| Family | C on | Word | What C does against A | MP against A |
|---|---|---|---|---|
| Brawler | Greatsword | **Rout** | Random foes, A's hits ×1.05, instead of one foe | Same |
| Brawler | Axe | **Havoc** | Random foes, one hit more ×1.05, instead of every foe | −4 |
| Brawler | Lance | **Tremor** | Every foe at the area share, instead of random foes | +4 |
| Brawler | Bow | **Hail** | Every foe evenly at the area share, instead of the volley | +2 |
| Brawler | Katana | **Fork** | Her foe and one other, two hits each, the other at 0.6 | +2 |
| Sorcerer | Fire | **Kindle** | Random foes, 2 · 3 · 3 hits ×1.05 | Same |
| Sorcerer | Blizzard | **Sleet** | Random foes, 2 · 2 · 3 hits ×1.05, instead of every foe | −4 |
| Sorcerer | Thunder | **Peal** | Every foe at the area share | +4 |
| Sorcerer | Light | **Beam** | Her foe and one other, two hits each, the other at 0.6 | +2 |
| Sorcerer | Dark | **Gloom** | Every foe evenly at the area share, instead of the volley | +2 |
| Spellblades | Her lead half's trees | **Swath** | Her lead half on every foe at the area share, her familiar's hit given up (Q17's crossover toward the Summoners) | +2 a half |
| Spellblades | Her other half's trees | **Strafe** | Her other half at random foes, her kind's hits ×1.05 | Same |
| Summoners | Her lead half's trees | **Hunt** | Her lead summon's farewell strikes its own target three times instead of every foe once (crossover toward the Spellblades) | +1 |
| Summoners | Her other half's trees | **Maul** | One hit fewer (at least one), ×1.1 | Same |
| Healers | Every tree | **Psalm** | Her mend or Barrier reaches every Uma from depth 3 (whole on the most hurt or threatened, ×0.4 the rest); a Greatsword's, Lance's or Fire's status stays | +2 |

- **Examples:** Grand Cleave Rout · Supreme Cleave Rout · Meteor Strike Rout; Grand Lunge Swath (an Arms Spellblade's
  Lance) and Grand Lunge Strafe (a Tome Spellblade's Lance); Supreme Knight Hunt; Benediction Psalm.
- **On a secondary weapon** a hybrid's line A stays her path, B and C her two damage lines; a healer's line A carries the
  path, B Surge, C Psalm.
- **The Break tip (T2C15):** each line's capstone, "· Break": its first weak hit on each foe removes one more shield point,
  once an act (the cap of one extra point a foe an act). With Breaker and Shatter retired (D282), it is the game's only
  extra chip. Same name, power and MP.
- **Every tree stays viable (CP43):** 70 trees × three lines, real content at every depth; C exists for every class's
  every kind by these rules.

### 4.8 Equipped slots, Skill Ranks and MP (T2C16–T2C18)

- **Equipped (T2C16):** 3 at Lv 1, one more at Lv **10, 15, 20, 25, 30, 35, 40**: 10 at Lv 40, of 18 held (15 on her trees,
  3 on her class line). Tier 1's gates plus 15, 25 and 35.
- **Skill Ranks** (CP32): every skill she holds, class line included, Rank 1 at its gate, one more every 2 Class Ranks.
- **Skill MP ×1.7 in Tier 2, ×2.4 in Tier 3 (T2C17),** in place of today's ×tier: an on-curve bar grows ×1.72 and ×2.45
  (base MP has a flat part), so ×2 and ×3 cost her 13–19% of her casts. MP back a round is a share of her bar and needs
  nothing.

| A depth-5 act on a full bar at Lv 50 | MP · casts, Tier 1 | Tier 2 today (×2) | **Tier 2, ×1.7** | Tier 3 today (×3) | **Tier 3, ×2.4** |
|---|---|---|---|---|---|
| Brawler | 26 · 8.2 | 52 · 7.1 | **44 · 8.3** | 78 · 6.7 | **62 · 8.4** |
| Sorcerer | 26 · 11.3 | 52 · 9.7 | **44 · 11.5** | 78 · 9.2 | **62 · 11.6** |
| A Spellblade or a Summoner (two halves of 13) | 26 · 9.4 | 52 · 8.1 | **44 · 9.6** | 78 · 7.7 | **62 · 9.7** |
| Paladin, Cleric (×0.6) | 16 · 18.4 | 32 · 15.8 | **27 · 18.7** | 48 · 14.9 | **37 · 19.4** |

- **The healing scale (T2C18):** ×(1 + offense ÷ (300 × the tier's multiplier)): ÷ 300 · 540 · 780. An on-curve healer's
  offense grows ×1.80 and ×2.61, so today's ÷ 300 lifts her mends from ×1.64 to ×2.16 and ×2.68 while the shares they
  scale (of max HP) already grow with HP. With the divisor × tier she is **×1.64 at every tier's Lv 50**.

### 4.9 Buffs and debuffs in Tier 2 (T2C24)

| Class | Tier 1 | Tier 2 adds | Never |
|---|---|---|---|
| Brawler, Sorcerer | None | None: both branches pure damage | Any status, in any tier (D282 D2) |
| Spellblades, Summoners | A path: line A of a secondary weapon, 1 · 1 · 2 | The Light/Dark branch's line rides the path (Blademaster, Warlock); the Spellblades' reverse sets hold three secondary weapons, the Summoners' presets two | A status through a Ring weapon |
| Paladin, Cleric | Widely (Greatsword, Lance, Fire), and the path | The Guardian's line spreads her Ring statuses from depth 3; the Templar's set holds three path weapons | — |

The five statuses, +10% a stack, cap 3, two rounds, in every tier: a percentage keeps its share under SB1. No retired
status returns (D282 D3).

### 4.10 The Halls in Tier 2 (T2C23)

| | Tier 1 | Tier 2 | Tier 3 |
|---|---|---|---|
| Seats | 16 | The same 16 in the new world's halls, **no new seat** (the owner trimmed to 16, D261) | The same |
| Who sits, Learners, Bonds | Any Uma; 10 Learners a Hero, 2 Heroes a Learner; Bond 0–10 | The same; she arrives with no seat and no Bond | The same |
| Power at 100% | Own × class scale × her open depth | The same; **LB+: +20% at Bond 10** (a Hero with her own seat, a Learner with her Hero's: 100% → 120%) | The same; her open depth reaches the crown's **5.6** at Class Rank 50 |
| Class scale | ×1 Tier 0, ×0.95 damage classes, ×0.8 healers | ×0.95, ×0.8 (no Tier 0) | The same |
| Hits | At most 10 on one foe | The same | The same |

**Coverage, both sets** (the seats whose kinds include one her three weapons miss): **13 to 16 of the 16 seats** add a kind
to every one of the sixteen sets, and her two best Heroes add **4 to 6** kinds. So a Learner's two Heroes remain her
coverage pick on either branch; the Learner picker already reads her active weapons.

### 4.11 Presets (T2C25)

- **Two a class:** branch 1's (her standard preset, D263) and branch 2's (her reverse set). A Tier 0's list of its
  children's presets has no Tier 2 meaning.
- **A preset sets her three accessory slots by D266's rule** on its own weapons (her armor half's stat twice, an Orb on her
  first weapon's kind, her ★ family first where it can work); what the forms are per tier is T2G's.
- **A branch swap offers its preset, never forces it;** a preset never moves a grade.

### 4.12 Class stats at Lv 50 (SB1)

The on-curve Uma at each tier's Lv 50 (her preset, G10 × tier, every Extra Stats node × tier, no template), from the live
code. Mirrors share a row. Offense is her lead weapon's: her ATK or M.ATK, its Might and her accessories' flat on it.

| Class (lead weapon) | Tier | HP | MP | ATK | M.ATK | DEF | M.DEF | Lead offense | Regen a round (CR 50) |
|---|---|---|---|---|---|---|---|---|---|
| **Brawler** (Greatsword) | 1 | 1,460 | 212 | 209 | 114 | 204 | 181 | 297 | 11 |
| | 2 | 2,531 | 367 | 377 | 205 | 368 | 324 | 535 | 18 |
| | 3 | 3,610 | 522 | 545 | 296 | 532 | 468 | 774 | 26 |
| **Sorcerer** (Fire) | 1 | 1,230 | 294 | 114 | 214 | 184 | 200 | 302 | 15 |
| | 2 | 2,139 | 505 | 205 | 386 | 331 | 360 | 544 | 25 |
| | 3 | 3,055 | 717 | 296 | 558 | 478 | 520 | 787 | 36 |
| **Arms Spellblade** (Katana), **Arms Summoner** (Bow) | 1 | 1,322 | 245 | 200 | 128 | 194 | 191 | 288 | 12 |
| | 2 | 2,296 | 423 | 362 | 229 | 349 | 342 | 520 | 21 |
| | 3 | 3,277 | 600 | 522 | 333 | 505 | 494 | 751 | 30 |
| **Tome Spellblade** (Thunder), **Tome Summoner** (Dark) | 1 | 1,322 | 245 | 128 | 200 | 194 | 191 | 288 | 12 |
| | 2 | 2,296 | 423 | 229 | 362 | 349 | 342 | 520 | 21 |
| | 3 | 3,277 | 600 | 333 | 522 | 505 | 494 | 751 | 30 |
| **Paladin** (Lance) | 1 | 1,322 | 294 | 193 | 109 | 209 | 191 | 281 | 15 |
| | 2 | 2,296 | 505 | 347 | 197 | 377 | 342 | 505 | 25 |
| | 3 | 3,277 | 717 | 503 | 284 | 545 | 494 | 732 | 36 |
| **Cleric** (Light) | 1 | 1,322 | 294 | 109 | 193 | 194 | 205 | 281 | 15 |
| | 2 | 2,296 | 505 | 197 | 347 | 349 | 369 | 505 | 25 |
| | 3 | 3,277 | 717 | 284 | 503 | 505 | 533 | 732 | 36 |

- **Offense holds SB1 exactly** (×1.80, ×2.61); HP grows ×1.73 and ×2.47 and MP ×1.72 and ×2.45 (their flat base), which is why skill MP
  wants ×1.7 and ×2.4 (T2C17), and the healers' scale needs its divisor (T2C18): 1.64 · 2.16 · 2.68 today, 1.64 in all
  three with it.
- **The identities hold:** the leans multiply, so the Brawler keeps the most HP, the Sorcerer and the healers the most MP, the mirrors
  their mirror.
- The focus, the Insignia and the status percentages are damage factors, not stats, so they sit outside this sheet.

## 5. Tier 3 in full

### 5.1 Two lines held (T2C19)

**She holds two of a tree's three lines** (default A and B), each with its own tip pick, and equips from both; Auto picks
between them each turn (CP20). 8 skills a tree (the trunk and two lines), 24 on her trees and 3 on her class line: **27
held, 10 equipped and the master slot.** Picks a class: per tree which two lines and two tips (3), × 3, + her branch: 10.

### 5.2 The crown (T2C20)

**At Class Rank 50 in Tier 3 every capstone she holds is crowned:** each held line's depth 5, and her class line's.

| | A capstone (depth 5) | **Crowned** (depth 6, Class Rank 50) |
|---|---|---|
| Power | 4.6 at Rank 3 (4.37 → 4.83) | **5.6**, whole (no Skill Rank): its own power × 5.6 ÷ 4.6 |
| Full-turn MP | 26 + its shape's | + 4 (30 for a single-target core), × her hand and ×2.4 |
| Status | Its stacks | One more, to the cap of 3 (a path's 2 → 3) |
| Name | The tree's capstone | **The same name, crowned** (a crown mark beside it) |

- **Why a crown, not a depth-6 node:** D298 makes the capstone the reward at the bottom of a tree, and a sixth name would
  break SN13 (a depth-6 B would run to four words). The old drafts' depth 6 was its tip one depth on, which a crown is,
  with nothing new to learn or name.
- **What reads it:** her Limit Break's open depth (5.6), her MP back a round (a sixth step, T2C21), the Class tab ("Meteor
  Strike · crowned").

### 5.3 The master slot and the mastery (T2C22)

- **The master slot** (CP22): one crowned capstone, a tree's or her class line's, outside her ten equipped. It opens with
  the crowns.
- **The mastery** (CP27): her family's, the same for both branches, at Class Rank 50 with her class line's crown. Five, not
  six: the healers share one kit (D282 H3), so Last Stand retires and both keep Overflow.

| Family | Mastery | On screen | Effect (a draft; T2B sets it) |
|---|---|---|---|
| Warrior | **Juggernaut** | "Her hits lose less to a standing shield." | An unbroken foe takes ×0.6 from her hits, not ×0.5 |
| Mage | **Resonance** | "Her deepest spells ring twice." | Her capstones and her class capstone strike again at 30% on the same targets; the echo removes no shield point |
| Spellblade | **Spellbind** | "Both halves weak: +20%." | When both halves of her act land weak on one foe, the act deals +20% |
| Summoner | **Menagerie** | "Her summons stay a pair longer." | Her lead summon lingers for two of her pairs and strikes in farewell at both |
| Healer | **Overflow** | "Mends past full become a Barrier." | A mend's healing past max HP becomes a Barrier, up to 10% of her max HP |

None adds a status, an act, a kind or a refund (tier2-classes §3's limits, D282's levels). "Unstoppable" (CP27's Brawler
mastery) is an exact master-data skill name, so the Warrior's is **Juggernaut**.

### 5.4 MP, statuses and the Halls in Tier 3 (T2C21)

- **Skill MP ×2.4** (T2C17). **MP back a round gains a sixth step** with the crown: 6% of her max MP from Class Rank 50 in
  Tier 3 (a crowned capstone costs four more), five in Tiers 1 and 2.
- **Statuses:** the same three levels; a crowned capstone one stack more, to the cap of 3.
- **Halls:** the same sixteen; LB+ kept; the crown's 5.6 is her open depth at Class Rank 50.

### 5.5 Counts by tier

| | Tier 1 | Tier 2 | Tier 3 |
|---|---|---|---|
| Trees she uses | 3 | 3 + her class line | 3 + her class line |
| Nodes a weapon tree | 8 | 14 (+ ★ tip on her lead tree) | 14; crowns are a state |
| Lines held a tree | 1 | 1 | 2 |
| Skills held | 15 | 18 | 27 |
| Equipped | 3 → 7 | 3 → 10 | 10 + master |
| Picks a class | 3 | 7 | 10 |
| Nodes across the catalog | 560 | 560 + 210 (C) + 210 (Break tips) + 48 class-line nodes (8 classes × 2 branches × 3) = 1,028 | The same |
| New names | — | 15 line words, 180 line names, 10 branch words with their 30 skills, 2 renamed branches | 5 masteries; no skill name |

## 6. Provides and assumes

| Doc | This doc provides | This doc assumes |
|---|---|---|
| **gear.md (T2G)** | Three slots by channel in every tier (CP2); the sixteen sets a Tier 2 Uma raises (T2C9); a class line carries its cast-through weapon's Might and flat (T2C11); presets by branch (T2C25); the focus reads a hit's own kind (T2C10) | Grades per weapon kind, G0–G10 × tier; any weapon branch (Pure, Dual) keeps a Dual's second kind coverage only, so it earns no focus; the accessory forms per tier, three slots (D264); armor by tier |
| **extra-stats.md (T2E)** | The classes' halves and Prowess splits (CV18), the groups and sets her weapon moons would serve | Any weapon moon reads a hit's own kind; Extra Stats × 1.8, × 2.6 as §4.12 measured |
| **professions.md (T2P)** | Weapon demand by set: Ring-first classes' reverse sets pull Bow, Katana, Light and Dark; the Summoners' pull the Ring kinds; a class's two sets share exactly one kind (the Brawler's Greatsword, the Sorcerer's Fire, the Spellblades' Katana, the Summoners' Axe or Blizzard, the healers' Light Tome) | Trades by calling (CV20) unchanged; Ascend resets grades, so day one of a set costs the same either way |
| **balance.md (T2B)** | Every number to simulate: the focus +15%, the ten class lines, line C, the Break tip, the crown 5.6, five masteries, LB+ +20%, skill MP ×1.7 · ×2.4, the healing divisor, MP's sixth step | It prices the stack (WP31) and the branch rule (10–20% in context); weaknesses by tier (WK8: every rank 3) and shields by tier; statuses ±10% a stack in every tier; its first fallback for the focus +10% |
| **templates.md (T2U)** | The ★ signature tip slot: a third tip option on her lead weapon's tree (Tier 2), at both held lines' tips (Tier 3); her Flourish's family in a world with no Tier 0 (her calling's own Tier 1 classes, never kin) | It fills the tip's content and keeps the Flourish 4% of her max HP a fight |
| **progression.md (T2W)** | Arrival (her class, a Tier 0's suggested promotion, Rank 1, branch 1, every class open); Class Rank pace by tier (§4.1); two classes to Rank 50 a campaign; the halls empty on arrival | Ascend one Uma at a time (D283); windows' Class steps by tier; the Rift's guided builds by tier read the reverse sets; Tier 3 has no Rift yet |

## 7. Save and engine

Rough, not packets. A later save version (after the dark v37 and v38) and one engine stage.

| Data | Stored | Derived |
|---|---|---|
| Her class branch | `classes[id].branch: 1 \| 2` (absent = 1) | Its focus, its set (a preset), its line |
| Line C | `lines[weapon] = 'C'` beside today's B | — |
| A tip | `tips[weapon]: 'break' \| 'signature'` (absent = Power) | — |
| Tier 3: two lines held | `held[weapon]: [line, line]` (absent = A and B) | — |
| The master slot | `master: nodeId` | — |
| The class line's skills, Skill Ranks, crowns, mastery | — | Her branch, Class Rank and tier |

- **Node ids:** line C `<tree>.<depth>c` (new, so the catalog's old side nodes keep their replays); the class line
  `<class>-branch-<1|2>.<depth>`; a Break tip is a flag on its capstone in the fight's input, a crown a multiplier, as
  Skill Ranks are.
- **Engine:** one stage (`t2Classes`, the next free engine): the focus factor, class lines cast through a named focus
  weapon, line C, the Break tip, crowns, the masteries, LB+, skill MP ×1.7 · ×2.4 and the healing divisor × tier. Fights
  on older engines keep ×tier MP and ÷ 300. `t2Weapons` stays T2G's.
- **Migration:** none for Tier 1's world; a later world's Umas get branch 1 and nothing else.

## 8. Pacing

- **Class Rank** keeps Tier 1's curve and 2E a win; with no Tier 0 her depths come 3 levels sooner (Lv 13 · 20 · 27 · 34
  for Class Rank 20 · 30 · 40 · 50), and her class line with depths 3–5.
- **A campaign takes two classes to Rank 50** (50,960 Class EXP), so a Tier 2 Uma holds her branch's line on two classes
  by Lv 50, and in Tier 3 two crowns and her mastery from Lv 34.
- **A branch swap is free;** its set costs only the grades she hasn't raised, and Ascend resets every grade, so on arrival
  her reverse set costs exactly her preset.
- **Nothing new is bought or crafted** here: the class line, line C and the crowns open by Class Rank alone; the weapons,
  their grades and materials are T2G's and T2P's.

## 9. The previews

**New pages:**

| Page | What it shows |
|---|---|
| [classes-tiers.html](previews/classes-tiers.html) | Tier 1 → 2 → 3 for the eight classes: what each tier adds, Class Rank pace by tier, Lv 50 sheets, MP and healing by tier, statuses and Halls by tier, the counts |
| [classes-branches.html](previews/classes-branches.html) | The ten branches and their class lines; every class's two sets; the two comps' party builder (flip any member, see the kinds held and the hint); Hall coverage of both sets |
| [classes-trees.html](previews/classes-trees.html) | A tree viewer by tier: any class and kind, trunk, A, B, C, the tips, two lines held and the crowns, every name generated by the D298 grammar |

**The old pages** (`tier-rework/previews/`), carried or retired:

| Old page | Fate | Why |
|---|---|---|
| class-overview.html | **Carried** into classes-tiers.html | Its overview and composition; its calling-pick card retired (CV19) |
| class-templates.html | **Carried** into classes-tiers.html (sheets, stats) and classes-branches.html (focus, sets, pairings) | Its affinity tab retired (UT11); its equippable matrix is the manual's |
| class-trees.html | **Carried** into classes-trees.html | The tree viewer, on 70 trees and D298's names |
| class-weaknesses.html | **Retired** | Weaknesses v2 (D235) replaced its rule (T2B owns weaknesses); its coverage part lives in classes-branches.html |
| classes-composition.html, classes-strikes.html, classes-template-sheets.html, classes-trees.html | **Retired** | The first round's (strikes dropped 2026-10-23), already superseded by the four pages above |
| skills-all-classes-t1.html, skills-profile.html, skills-trees-by-tier.html | **Retired** | The first round's skill trees; Tier 1's trees are live (manual, skill-names preview); the by-tier view is classes-trees.html |

## 10. Decisions

Every new call, with the recommended answer.

| Call | Decision | Recommended | Alternatives, briefly |
|---|---|---|---|
| **T2C1** | The classes in Tiers 2 and 3 | **The eight Tier 1 classes, no new class, lean or hand; every one open from Class Rank 1; no Tier 0** (CV10) | Advanced classes (A1–A2); Tier 0 in every tier |
| **T2C2** | What a Tier 0 means later | **None exists. A Tier 0 ascends as her suggested promotion; her calling still names her Flourish's family (its own Tier 1 classes, never kin), her trade and her template** | Keep her Tier 0 as a class in Tier 2 |
| **T2C3** | Class Rank by tier | **1–50 from Rank 1, gates 1 · 10 · 20 · 30 · 40, 50 the crown in Tier 3; 2E a win; Class Rank 20 · 30 · 40 · 50 at Lv 13 · 20 · 27 · 34; two classes to Rank 50 a campaign** | A Tier 0-like opening ladder; later gates |
| **T2C4** | The weapon groups on today's twins | **Ring (Greatsword, Axe, Lance · Fire, Ice, Lightning) and Light/Dark (Katana, Bow · Light, Dark), unchanged by v19: each twin set stays inside its group; Light/Dark is D282's secondary weapons and the doubles and volleys** | Groups by shape; three groups |
| **T2C5** | The groups' names | **One word a group, both channels: "Ring" and "Light/Dark"**; the owner's Heavy · Lite · Elemental · Arcane retire (Heavy is a shape, D246, D298 SN6; Arcane a Rift front) | The owner's four with Heavy → Main and Arcane → Shade; Main and Secondary |
| **T2C6** | Branches for eight classes | **By family: ten branches, two a family; mirrored classes share theirs (names, line, crown, mastery), each with her own hand** | Sixteen, two a class (48 class skills); one branch a class |
| **T2C7** | Branch names | **Berserker · Warlord; Sage · Augur; Rune Knight · Blademaster; Invoker · Warlock; Guardian · Templar.** Augur for the Mage's old "Sorcerer" (now a class, D240); Invoker for "Conjurer" (a master-data skill name); Bishop and Oracle retire | Keep the Cleric's pair for the healers; Seer for the Mage |
| **T2C8** | Branch 1 | **Her standard preset's group (two of its three kinds): Ring for six classes, Light/Dark for both Summoners; Ascend preselects it** | A stat rule (A6); always Ring |
| **T2C9** | The reverse sets | **Brawler Bow, Katana, Greatsword; Sorcerer Light, Dark, Fire; Arms Spellblade Katana, Bow, Dark; Tome Spellblade Light, Dark, Katana; Arms Summoner Axe, Lance, Blizzard; Tome Summoner Blizzard, Thunder, Axe; Paladin Katana, Bow, Light; Cleric Light, Dark, Bow.** 33 of the comps' 64 mixes hold all ten kinds | CP43's reach weapon in the pure classes' third slot (16 of 64); reverse sets without the healers' Light |
| **T2C10** | The focus | **+15% on hits of her group's kinds, a hit's own kind; healers' mends and Barriers from them +15%; on from Class Rank 1; labelled "Ring +15%"** (CP39) | +10% (T2B's fallback); +12% Ring, +18% Light/Dark |
| **T2C11** | The class line | **One line a branch, her fourth tree, at Class Rank 20 · 30 · 40, cast through a focus weapon (her pair for a hybrid), the depth table's power and MP, Skill Ranks, named "Grand {word}", "Supreme {word}", its capstone; a tile on the Class tab** | CP34's three different skills a branch; a class line from Class Rank 1 |
| **T2C12** | The ten lines | **The table in §4.6:** Rampage · Skybreaker, Conquest · Sundown, Nebula · Starburst, Quasar · Event Horizon, Sigil · Rune Edge, Bane · Penumbra Edge, Griffin · Kraken, Wraith · Banshee, Edict · Covenant, Solace · Absolution | CP34's 36 skills re-themed |
| **T2C13** | Statuses on the class lines | **D282's levels: none for the Brawler and the Sorcerer; the path's 1 · 1 · 2 through a Light/Dark weapon for the hybrids; 2 · 2 · 3 for the healers** | Any branch a status (breaks D282 D2) |
| **T2C14** | Line C | **Joins the fork at depth 3 by family: the Brawler and the Sorcerer by tree (Rout, Havoc, Tremor, Hail, Fork; Kindle, Sleet, Peal, Beam, Gloom); the Spellblades Swath and Strafe, the Summoners Hunt and Maul, by her half; the healers Psalm** | No line C (Tier 2's trees stay Tier 1's); CP19's Sweep, Mighty, Wide words (a shape, a knack word) |
| **T2C15** | The tip fork | **Every line's capstone forks Power or Break: the first weak hit on each foe removes one more shield point, once an act; the only extra chip since Breaker and Shatter retired** | A Break tip on line A alone; no tip fork |
| **T2C16** | Equipped slots | **Tier 2: one more at Lv 10, 15, 20, 25, 30, 35, 40 (10 at Lv 40); Tier 3: 10 and the master slot at Class Rank 50** | Two a tree; 3 → 10 every 5 levels from Lv 5 |
| **T2C17** | Skill MP by tier | **×1.7 and ×2.4 in place of ×tier** (A10, measured: the bar grows ×1.72 and ×2.45; casts within 0.3 of Tier 1's for the damage classes, within 1 for the healers) | ×tier (−13–19% casts); SB1's ×1.8 · ×2.6 |
| **T2C18** | The healing scale by tier | **×(1 + offense ÷ (300 × the tier's multiplier)): 300 · 540 · 780, so an on-curve healer is ×1.64 at every tier's Lv 50** (today 1.64 · 2.16 · 2.68) | Leave it (heals grow ×1.32 and ×1.63 in share); lower the shares |
| **T2C19** | Two lines held | **Tier 3: two of a tree's three lines held (default A and B), each with its tip; Auto picks between them** (CP20) | One line; all three |
| **T2C20** | Depth 6 | **A crown, not a node: at Class Rank 50 in Tier 3 every capstone she holds (her held lines' and her class line's) plays 5.6 whole, +4 MP, one more stack to the cap; its name kept, crowned; her Limit Break reads 5.6** | 50 new depth-6 names (four-word B names, SN13); no depth 6 |
| **T2C21** | MP back a round | **A sixth step with the crown: 6% from Class Rank 50 in Tier 3** | Five at most in every tier |
| **T2C22** | Masteries | **Five, by family, at Class Rank 50 with the class line's crown: Juggernaut, Resonance, Spellbind, Menagerie, Overflow; Last Stand retires (one healer kit)**; "Unstoppable" is a master-data skill name | Six as CP27; on from Class Rank 1 |
| **T2C23** | The Halls by tier | **The same sixteen seats in every world, no new seat; seats and Bonds per world; LB+ +20% at Bond 10 from Tier 2; scales ×0.95 and ×0.8** | New seats for the branches; LB+ effects per seat |
| **T2C24** | Buffs and debuffs by tier | **D282's three levels hold in every tier; five statuses, +10% a stack, cap 3; no retired status returns; a crown adds one stack** | A Tier 2 status for the pure classes |
| **T2C25** | Presets by tier | **Two a class (branch 1's and branch 2's), each setting her three accessory slots by D266's rule on its weapons; a swap offers, never forces** | One preset; presets that follow the branch automatically |
| **T2C26** | The party screen's hint | **When a mix drops a kind, name the member whose other set holds it ("No Bow: the Paladin's Light/Dark set holds one"); flip the healer with the magic pair** | Require every mix to hold all ten; no hint |
| **T2C27** | New names | **D298's grammar; every one of the 252 new names checked against every master-data string (all ten release files, case-insensitive, exact): no match; none over three words or 21 characters (the longest, Supreme Crescent Fork, 21); none equals a status, a line, a shape, a place, a Limit Break or a Finals route.** Replaced on the way: Conjurer, Unstoppable, Singularity and Prism (master-data strings); Seal (the Rift's Seals), Supernova and Eclipse (Finals routes), Quake and Worldbreaker (older generations' skill names); Sweep (a shape) and Mighty (a knack word) from CP19 | Names at build time |
| **T2C28** | The save | **Store her branch per class, line C, the tip, Tier 3's two held lines and the master slot; derive the rest** (§7) | Store the focus and set |
| **T2C29** | The engine | **One stage, `t2Classes`, at the next free engine; older fights keep ×tier MP and ÷ 300** | A stage each for Tier 2 and Tier 3 |
| **T2C30** | The old previews | **Three pages carry class-overview, class-templates and class-trees; class-weaknesses and the first round's seven retire** (§9) | Keep the old pages beside the new |

*Names checked 2026-11-04 against uma-platform `content/release/data` (art, characters, courses, objectives, outfits,
races, scenarios, skills, support cards, tracks: 20,500 distinct strings) and against the game's own strings
(`packages/domain/src`, `apps/web/src`).*
