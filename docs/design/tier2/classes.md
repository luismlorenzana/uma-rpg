# Classes in Tiers 2 and 3

> **Status: round 3, the owner's feedback on classes, 2026-11-05. Nothing here is built.** One doc of the [Tier 2 and
> Tier 3 set](README.md) (ids **T2C1–T2C30** from round 1, **T2C31–T2C64** from round 2, **T2C65–T2C101** from round 3).
> It builds the owner's round-3 class tree ([README §10](README.md#10-round-3-the-owners-feedback-on-classes-2026-11-05),
> R3-1–R3-7 and R3-9; R3-8's guardrail binds it) on round 2's sixteen and on **Tier 1 as it is live** (engine v21, save
> v36): eight Tier 1 classes with mirrored hybrids and two healers who share every number, the combat pass's three levels
> of buffs and debuffs (D282), sixteen Hall seats (D261), the owner's two party comps as presets (D263), the reclass
> (D290, D291) and one naming grammar (D298).
>
> **What round 3 changes.** **Twenty Tier 2 classes** (round 2's sixteen and four **pure variants** of the hybrids:
> Bladedancer, Spellweaver, Marshal, Animist); the **Spellfist and the Battlemage reshaped** to single big hits
> (Pinpoint); and **Tier 3 is a promotion**: **twenty-two Tier 3 classes**, every one a new name, each her Tier 2
> parent's kit plus one rule. Round 2's Tier 3 features are re-homed: **the crown and two lines held** on every Tier 3
> class, **the five masteries** as the rules of the lines that had them, **the master slot** retired
> ([§6.2](#62-what-every-tier-3-class-keeps-and-adds-t2c78t2c82)). Round-2 calls round 3 replaces are marked
> **Superseded (R3-n)** ([§3.5](#35-round-2-t2c31t2c64-in-round-3)); the doc reads as one design.
>
> **Numbers:** Tier 1 from the manual and the code (`packages/domain/src`); the sixteen kept classes' measured values
> from [balance](balance.md)'s round 2 (T2B20–T2B40); the new kits **analytic**, set with round 2's knob values as the
> reference and code numbers (offenses, Might, foe defenses at Tier 2 and 3 Lv 50; a live-engine run of single-target
> kits), each marked for balance to confirm ([§7](#7-provides-and-assumes)). Throwaway tests printed them; none is
> committed.
>
> **Pages** (desktop, light and dark): [the class tree, Tier 1 → 2 → 3](previews/classes-tree.html) (new) ·
> [classes by tier](previews/classes-tiers.html) · [the twenty](previews/classes-branches.html) ·
> [the twenty-two](previews/classes-tier3.html) (new) · [trees by tier](previews/classes-trees.html) ·
> [party comps](previews/classes-comps.html) · [promotion and switching](previews/classes-promotion.html).
>
> **What it absorbs:** class-progression.md (CP), Classes v3's later-tier calls (CV), Halls v2 (HV) with D261's trim, the
> reclass (RC), skill names (SN), the archived [Tier 2 classes](../../archive/design/tier2-classes.md) (A1–A10), and this
> doc's rounds 1 and 2. [§3](#3-the-old-calls-call-by-call) gives every old call a status.

## 1. At a glance

**Tier 2 promotes every Tier 1 class into two or three; Tier 3 promotes every Tier 2 class into one or two.** A Tier 2
class keeps her parent's kit and changes it by one rule; a Tier 3 class keeps her Tier 2 parent's kit and rule and adds
one more. She picks her class on each Ascend among the children of the classes she brought to Class Rank 50, and
switches among the ones open to her after.

```
 TIER 1             TIER 2 (20)                                       TIER 3 (22)
 Brawler ─────────┬ Berserker    keeper   3 Arms · Momentum ─────────── Ravager      + Juggernaut
                  └ Spellfist    expander 2 Arms + Tome, on ATK ──────┬ Spellhammer  Pinpoint ×1.2
                                          · Pinpoint +2%/depth        └ Gladiator    3 Arms · Arsenal
 Sorcerer ────────┬ Archmage     keeper   3 Tomes · Momentum ────────── Astromancer  + Resonance
                  └ Battlemage   expander 2 Tomes + Arm, on M.ATK ────┬ Spellknight  Pinpoint ×1.2
                                          · Pinpoint +2%/depth        └ Thaumaturge  3 Tomes · Arsenal
 Arms Spellblade ─┬ Blademaster  keeper   familiar both halves ─────── Bladelord    + Spellbind
                  ├ Sentinel     support  ward, statuses topped up ─── Herald       + the keeper's twist
                  └ Bladedancer  pure     3 Arms, the pure pair ────── Dervish      + Momentum
 Tome Spellblade ─┬ Runeblade    keeper ─────────────────────────────── Runelord     + Spellbind
                  ├ Enchanter    support ────────────────────────────── Oracle       + the keeper's twist
                  └ Spellweaver  pure     3 Tomes, the pure pair ────── Starweaver   + Momentum
 Arms Summoner ───┬ Warlord      keeper   both summons linger ──────── Overlord     + Menagerie
                  ├ Druid        support  field statuses, a mend ───── Archdruid    + the keeper's twist
                  └ Marshal      pure     3 Arms, the pure pair ────── Imperator    + Momentum
 Tome Summoner ───┬ Invoker      keeper ─────────────────────────────── Hierarch     + Menagerie
                  ├ Shaman       support ────────────────────────────── Soulcaller   + the keeper's twist
                  └ Animist      pure     3 Tomes, the pure pair ────── Mythlord     + Momentum
 Paladin ─────────┬ Guardian     keeper   healer, a stack more ──────── Bastion      + Overflow
                  └ Templar      battle   healer ×0.6 power ─────────── Inquisitor   power ×0.7
 Cleric ──────────┬ Bishop       keeper ─────────────────────────────── Cardinal     + Overflow
                  └ Exorcist     battle ─────────────────────────────── Hierophant   power ×0.7
```

| Tier 1 class | Tier 2: **keeper** · expander, support or pure | Tier 3: one child each (the Spellfist and the Battlemage two) |
|---|---|---|
| Brawler | **Berserker** · **Spellfist** (single big hits, her Tome on ATK) | Ravager · **Spellhammer** (the Spellfist, higher) and **Gladiator** (pure physical, every Arm) |
| Sorcerer | **Archmage** · **Battlemage** (single big hits, her Arm on M.ATK) | Astromancer · **Spellknight** and **Thaumaturge** (pure magic, every element) |
| Arms Spellblade | **Blademaster** · Sentinel · **Bladedancer** (new: pure physical) | Bladelord · Herald · Dervish |
| Tome Spellblade | **Runeblade** · Enchanter · **Spellweaver** (new: pure elemental) | Runelord · Oracle · Starweaver |
| Arms Summoner | **Warlord** · Druid · **Marshal** (new: pure physical) | Overlord · Archdruid · Imperator |
| Tome Summoner | **Invoker** · Shaman · **Animist** (new: pure elemental) | Hierarch · Soulcaller · Mythlord |
| Paladin | **Guardian** · Templar | Bastion · Inquisitor |
| Cleric | **Bishop** · Exorcist | Cardinal · Hierophant |

| | **Tier 1** (live) | **Tier 2** | **Tier 3** |
|---|---|---|---|
| **Classes** | 5 Tier 0 → 8 Tier 1 at Class Rank 10 | **20**: the Brawler and the Sorcerer two each, the four hybrids three each, the healers two each | **22**: the Spellfist and the Battlemage two each, every other Tier 2 class one |
| **She gets one** | By promotion at a Tier 0's Rank 10 | **On her Ascend**, among every child of every Tier 1 class she brought to Class Rank 50 (6–20) | **On her Ascend**, among every child of every Tier 2 class she brought to Class Rank 50 (3–22) |
| **More open** | A Tier 0 at Rank 10 | **The door:** a held class at Class Rank 20 opens her parent's reclass neighbours' children | **The door:** her Tier 1 line's and its reclass neighbours' lines' Tier 3 classes |
| **A class's rule** | Her class's kit | Her parent's kit **+ one rule** (10 rules, mirrors share) | Her Tier 2 parent's kit and rule **+ one rule**, from Class Rank 1; **the crown** at Class Rank 50 |
| **Buffs and debuffs** | Three levels (D282) | **Four:** none (the Brawler's and the Sorcerer's children, the four pure variants) · a path · support · widely | The same; a crowned capstone a stack more |
| **A weapon tree** | Trunk, then line A or B: 8 nodes | + line C, Power or Break tips: 14 nodes | **Two lines held**; crowned capstones |
| **Skills held · equipped** | 15 · 3 → 7 | 18 · 3 → 10 | 27 · 10 (**the master slot retired**) |
| **Skill MP · healing divisor** | ×1 · ÷ 300 | ×1.7 · ÷ 540 | ×2.4 · ÷ 780 |
| **Each class against her parent** (R2-11) | — | The sixteen measured: **+7.0 · +3.9 · +3.2%** mean at Lv 10 · 30 · 50, 34 of 36 cells in the band; **the four pure variants and the two reshaped crosses analytic**, set inside the band | **+3.2 to +8.2%** over her Tier 2 parent (analytic, mean +5.3%), on top of the crown every class shares |
| **Tier 3's budget** | — | — | **About +17% at Lv 50** (the crown + one rule in each mastery's place; the keepers' line is round 2's measured crowned C1 exactly) |
| **The owner's swaps** | — | **A Brawler with a Spellblade** (C3: Spellfist + Bladedancer) and **a Spellblade with the Paladin** (C4: Sentinel + Templar) each level with Party 1's keepers (C1) within 0.6%, analytic; their mirrors within 1.8% of Party 2's (C2) | The same swaps one tier down, +3.1 to +4.8% over their Tier 2 comps |

**Round 3 in seven lines:**
1. **Every Tier 2 class promotes in Tier 3, and each promotion has a new name** (R3-1): 22 Tier 3 classes (T2C65).
2. **The Spellfist and the Battlemage hit once and hard** (R3-2, R3-3): one act a turn, the cross on her stat, presets of
   Heavy and Double kinds, and **Pinpoint**: her acts that strike one foe +2% a depth, ×1.1 at depth 5 (T2C71–T2C73).
3. **Four pure variants at Tier 2** (R3-4): the hybrids' third child, all one channel, her family's pair and twist
   kept, no statuses (**the pure pair**, T2C67, T2C68). The owner's "swap a Brawler with a Spellblade" works from Tier 2.
4. **The Spellfist and the Battlemage split in Tier 3** (R3-2, R3-3): Spellhammer and Spellknight keep the kit with
   Pinpoint doubled (+4% a depth); Gladiator and Thaumaturge go pure with **Arsenal**, two two-kind weapons, every kind of her channel in
   reach (T2C83–T2C85).
5. **Every other line promotes into one** (R3-4, R3-5): keepers take their family's mastery, supports their keeper
   sibling's twist, pures Momentum, keeper healers Overflow, battle healers more power (T2C86, T2C87).
6. **Round 2's Tier 3 features find a home** (R3-1): the crown and two lines held on every Tier 3 class, the masteries as
   the rules above, the master slot retired; Tier 3's budget stays about +17% at Lv 50 (T2C78–T2C82, T2C92).
7. **The comps follow the owner's swaps** (R3-7): every Tier 2 comp +1.4 to +6.1% over its Tier 1 party, analytic,
   the swaps level with C1 or C2; every Tier 3 comp +3.1 to +4.8% over its Tier 2 comp (T2C93).

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

Balance re-measured both comps on its fork at 16 seeds, in party value a round (D + S in BT,
[balance §2.6](balance.md#26-tier-1-measured-on-the-fork-the-anchor)): Party 1 Brawler 1.00, Sorcerer 1.02, Arms
Spellblade 0.81 + 0.03, Tome Summoner 0.72 + 0.03, Paladin 0.37 + 0.33; Party 2 Brawler 1.06, Sorcerer 1.10, Tome
Spellblade 0.83 + 0.11, Arms Summoner 0.72 + 0.09, Cleric 0.35 + 0.42. The healer's statuses about a tenth of the party's
damage, a path no one else carries 0.11 BT: the same two facts.

## 3. The old calls, call by call

Status vocabulary (the brief, §4): **Kept** stands as written; **Kept, changed** stands with a change a decision forces;
**Superseded** a decision or a round-2 requirement replaced it (named: D-number or R2-n); **Broken** written for a Tier 1
that no longer exists, fixed here.

### 3.1 Class progression (CP1–CP43)

| Call | What it said | Status | Why, and where it lands |
|---|---|---|---|
| CP1 | Six classes in every tier | **Superseded** | D240, R2-2 and R3-6: eight Tier 1 classes, twenty Tier 2, twenty-two Tier 3 (T2C66, T2C65) |
| CP2 | Three slots, typed by channel | **Kept** | Every Tier 2 and Tier 3 class keeps three (T2C33) |
| CP3 | The owner's six default sets | **Superseded** | D240 (CV16) and D263; the twenty presets (T2C77) |
| CP4 | The campaign balanced on defaults | **Kept, changed** | D263: the owner's two comps; Tier 2's keepers of them are C1 and C2 (§5) |
| CP5 | Tier 1 foes weak to twins | **Superseded** | D235 (weaknesses v2); T2B owns weaknesses |
| CP6 | Later tiers narrow by rank | **Superseded** | D235's WK8: every rank 3 kinds; T2B |
| CP7 | The Rift's fronts and guided builds | **Kept, changed** | D240's CV23 by family; the later tiers' Rift is T2W's; guided builds name Tier 2 classes |
| CP8 | Locks and shields by tier | **Kept, changed** | Tier 1 shields 6 and 8 (H71); Tiers 2–3's are T2B's |
| CP9 | Hybrids and healers on 2 + 1 | **Kept, changed** | D249's hands, D282 H3; a hybrid's keeper and support and every healer keep 2 + 1; a pure variant's turn one channel (T2C33, T2C68) |
| CP10 | Template per tier (accessories 1 · 2 · 3) | **Kept, changed** | D264: three accessory slots in every tier |
| CP11 | Presets per tier and branch | **Kept, changed** | One preset a Tier 2 class (T2C77) |
| CP12 | Equippable kinds; a Dual's kind of its own channel | **Kept** | Slots live; the Dual is T2G's |
| CP13 | One tree per slot, under a class root | **Kept, changed** | 70 trees; a Tier 2 class plays her parent's (T2C51) |
| CP14 | Nothing costs points | **Kept** | Live |
| CP15 | A fork changes reach, hits, support or Breaks | **Kept** | Binds line C (T2C14) |
| CP16 | Gates 1, 10, 20, 30, 40, 50 | **Kept, changed** | 50 is the crown in Tier 3 (T2C20) |
| CP17 | Trees never add a kind | **Kept** | — |
| CP18 | Tier 1: trunk and one fork | **Kept, changed** | Built; B lines by D246 (CV14), D282, D298 |
| CP19 | Tier 2: branch C and a Power or Break tip | **Kept, changed** | Line C by family (T2C14, T2C53), the tip fork (T2C15) |
| CP20 | Tier 3: depth-6 capstones, two branches held, master slot | **Kept, changed** | Depth 6 is a crown and two lines are held on every Tier 3 class (T2C79, T2C80); the master slot retired (R3-1, T2C81) |
| CP21 | Today's names; new ones by rule | **Superseded** | D298; new names in T2C27 and T2C59 |
| CP22 | Equipped 3 → 7, 3 → 10, 10 + master | **Kept, changed** | The master slot retired (R3-1, T2C81): 3 → 7, 3 → 10, 10 |
| CP23 | The Skills tab as a real tree | **Kept, changed** | D267's Class tab; Tier 2 adds the class line's tile |
| CP24 | ★ Flourish at the root, ★ signature tip from Tier 2 | **Kept** | The tip's content is T2U's |
| CP25 | Class Rank per class, reset at promotion | **Kept, changed** | Tier 0's ladder in Tier 1; XR1's shared ladder over her held Tier 2 classes (T2C3, T2C47) |
| CP26 | The class branch: a weapon-group focus | **Superseded (R2-2)** | The Tier 2 classes replace the branch |
| CP27 | Branch capstone and mastery at Class Rank 50 | **Kept, changed** | Round 2's five masteries re-homed as Tier 3 classes' rules (R3-1, T2C82) |
| CP28 | Six halls, 24 Limit Breaks, LB+ | **Superseded** | D241, D261: five halls, sixteen seats; LB+ by HV23 (T2C23) |
| CP29 | The calling pick | **Superseded** | D240 CV19: the promotion is the pick; in Tiers 2 and 3 the Ascend is (T2C76, T2C89) |
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
| CP40 | Six default and reverse sets | **Superseded (R2-2)** | The twenty presets (T2C77) |
| CP41 | Party pairings by region | **Superseded (R2-2)** | The comps (§5, T2C93) |
| CP42 | The Spell Blade's B: Pierce | **Kept, changed** | CV14: both Spellblades, the Brawler's Katana B, the Sorcerer's Light B; every child of theirs |
| CP43 | Every tree viable | **Kept, changed** | 70 trees; line C keeps every one full |

### 3.2 Classes v3, Halls v2, the reclass, skill names

| Call | What it said | Status | Why |
|---|---|---|---|
| CV10 | Tier 0 only in Tier 1; later tiers open every Tier 1 class at Rank 1 | **Kept, changed** | Tier 0 only in Tier 1 holds; a later world plays its tier's classes, not the Tier 1 classes (T2C66, T2C65) |
| CV11 | One child Suggested | **Kept, changed** | Each Ascend sheet suggests one (T2C76, T2C89) |
| CV13 | Twins re-paired: Katana–Light, Bow–Dark | **Kept** | — |
| CV15 | The new hybrids mirror their pair | **Kept, changed** | D249's hands; mirrored Tier 2 classes share their rule and class line |
| CV16 | Defaults by the owner's sets | **Superseded** | D263's presets |
| CV17 | The new trees' own names | **Superseded** | D298 |
| CV21 | ★ signature tip as any class of her family | **Kept** | Her family's later classes (T2C91) |
| CV22 | One healer a party; a Tier 0 is none | **Kept** | Every tier; the four healer classes count, the supports don't (T2C42) |
| CV23 | The Rift's builds by family | **Kept, changed** | Later tiers' Rift is T2W's |
| CV24 | Limit Break scale 1 · 0.75 | **Superseded** | D249: ×0.95 and ×0.8 |
| CV25, CV26 | The reset and the refund | **Kept** | History |
| HV2 | Four seats a hall, twenty | **Superseded** | D261: sixteen |
| HV4 | Any Uma in any seat | **Kept** | — |
| HV5 | Power: own × scale × open depth | **Kept, changed** | D249's scales; Tier 3's crowned depth |
| HV6 | The ladder 2.9 · 2.5 · 2.2 · 1.9 · 2.0 | **Kept** | — |
| HV15 | At most 10 hits on one foe | **Kept** | — |
| HV17 | Every kind in two halls; two Heroes close a class's gaps | **Kept, changed** | D261; on round 2's sixteen presets 13–16 of the 16 seats add a kind she lacks and her best two Heroes add 4–5 (§4.12) |
| HV22, HV23 | Bonds unchanged; LB+ +20% at Bond 10 | **Kept** | T2C23 |
| RC1, RC2, RC4, RC5 | Three children each; pure roots; kin; the Healer's four | **Kept, changed** | Tier 1's map; in a later tier it is the doors' map (T2C48, T2C90) |
| RC3 | Healers only from the Healer | **Superseded** | D291 |
| RC6 | A kin class is never Suggested nor her Flourish's family | **Kept** | Every tier (T2C91) |
| RC7 | No save or engine bump | **Kept** | Tier 1 |
| SN1–SN15 | One grammar; ladder; capstone; B = A + word; mirrors share; … display only | **Kept** (15) | Every new name follows them (T2C27, T2C59, T2C97) |

### 3.3 The archived Tier 2 classes (A1–A10)

| Call | Status | Why |
|---|---|---|
| A1 Free switching | **Kept, changed** | Among her open Tier 2 classes (R2-5, T2C47) |
| A2 Leans ±0.1 | **Superseded** | No lean changes: a Tier 2 class wears her parent's (T2C33) |
| A3 Side forks with points | **Superseded** | CP14, CP19 |
| A4 Twelve names | **Superseded (R2-2)** | Twenty Tier 2 classes (T2C32, T2C66) |
| A5 Twelve passives | **Superseded (R2-2)** | One rule a class (T2C34–T2C44, T2C68, T2C71) |
| A6 The Ascend pick by stat | **Superseded (R2-5)** | She picks on the Ascend sheet, her class's keeper suggested (T2C76) |
| A7 LB+ for Bond 10 | **Kept** | HV23 |
| A8 Limit Break power by base class | **Superseded** | HV5 |
| A9 No Tier 1 skill carries | **Kept** | — |
| A10 Skill MP ×1.7 · ×2.4 | **Kept** | T2C17 |

### 3.4 Round 1 (T2C1–T2C30)

| Call | Round 1 | Status | Where it lands |
|---|---|---|---|
| T2C1 | The eight Tier 1 classes in Tiers 2 and 3 | **Superseded (R2-2)** | Twenty Tier 2 classes (T2C66) |
| T2C2 | What a Tier 0 means later | **Kept, changed** | A Tier 0 at her Ascend arrives as her suggested Tier 2 class (T2C50) |
| T2C3 | Class Rank by tier, XR1's shared ladder | **Kept, changed** | The ladder raises every Tier 2 class she holds (T2C47) |
| T2C4 | The two groups, Ring and Light/Dark | **Kept, changed** | Words for where statuses ride; no focus |
| T2C5 | The groups' names | **Listed for the owner** | His call: "Ring" and "Light/Dark" against his Heavy · Lite · Elemental · Arcane |
| T2C6 | Ten branches, by family | **Superseded (R2-2)** | The Tier 2 classes |
| T2C7 | Branch names | **Superseded (R2-2)** | Berserker, Warlord, Invoker, Blademaster and Guardian become class names; Sage, Augur, Rune Knight, Warlock, Templar's branch retire (Templar is a class now) |
| T2C8 | Branch 1 | **Superseded (R2-5)** | The Ascend pick (T2C46) |
| T2C9 | The reverse sets | **Superseded (R2-2)** | The expanders' presets (T2C54) |
| T2C10 | The focus +15% | **Superseded (R2-2)** | One rule a class |
| T2C11 | The class line | **Kept, changed** | One a class, mirrors share, cast through any of her weapons (T2C52) |
| T2C12 | The ten lines | **Kept, changed** | Re-homed on the Tier 2 classes (T2C52, T2C74) |
| T2C13 | Statuses on the class lines | **Kept, changed** | By her class's level, four now (T2C45) |
| T2C14 | Line C | **Kept** | By tree; a Tier 2 class plays her parent's trees (T2C53) |
| T2C15 | The tip fork | **Kept** | — |
| T2C16 | Equipped slots | **Kept, changed (R3-1)** | Tier 3's master slot retired (T2C81) |
| T2C17 | Skill MP ×1.7 · ×2.4 | **Kept** | — |
| T2C18 | The healing divisor × tier | **Kept** | Also the supports' wards and mends |
| T2C19 | Two lines held | **Kept** | On every Tier 3 class (T2C80) |
| T2C20 | The crown | **Kept** | On every Tier 3 class (T2C79) |
| T2C21 | MP's sixth step | **Kept** | With the crown (T2C79) |
| T2C22 | Five masteries | **Superseded (R3-1)** | Re-homed as Tier 3 classes' rules (T2C82) |
| T2C23 | The Halls by tier | **Kept, changed** | Home classes are the Tier 1 home class's descendants; scales by family (T2C100, T2C101) |
| T2C24 | Buffs and debuffs by tier | **Superseded (R2-3)** | Four levels (T2C45) |
| T2C25 | Presets by tier | **Kept, changed** | One a class (T2C77); the forms are T2G's |
| T2C26 | The party screen's hint | **Kept, changed** | It names an open class that holds the missing kind (T2C94) |
| T2C27 | New names checked | **Kept, changed** | Re-run on rounds 2 and 3's names (T2C59, T2C97) |
| T2C28 | The save | **Kept, changed** | T2C95 |
| T2C29 | The engine | **Kept, changed** | T2C96 |
| T2C30 | The old previews | **Kept** | T2C98 adds four pages |

### 3.5 Round 2 (T2C31–T2C64) in round 3

| Call | Round 2 | Status | Where it lands |
|---|---|---|---|
| T2C31 | Sixteen Tier 2 classes | **Superseded (R3-6)** | Twenty (T2C66): round 2's sixteen and four pure variants |
| T2C32 | Their names | **Kept** | The four new names in T2C69 |
| T2C33 | What a Tier 2 class keeps | **Kept, changed (R3-4)** | A pure variant turns her slots one channel (T2C67, T2C68) |
| T2C34 | Momentum | **Kept** | Also the pure variants' Tier 3 rule (T2C86) |
| T2C35 | The pure expanders: the cross, hands ×1.05 · ×1.3 | **Kept, changed (R3-2, R3-3)** | The cross stands; one act a turn, Pinpoint, single-target presets, and hands ×1 · ×1.25 for Pinpoint's share (T2C71–T2C73) |
| T2C36 | Their gear | **Kept** | Also the pure variants' (T2C70) |
| T2C37, T2C38 | The hybrid keepers | **Kept** | Their twist is also their support siblings' Tier 3 rule (T2C86) |
| T2C39–T2C42 | The supports | **Kept** | — |
| T2C43, T2C44 | The healer keepers, the battle healers | **Kept** | — |
| T2C45 | Statuses by class, four levels | **Kept, changed (R3-4)** | The pure variants at none (T2C75) |
| T2C46 | The Tier 2 promotion: both children | **Superseded (R3-4)** | Every child, two or three a Tier 1 class (T2C76) |
| T2C47 | Switching and Class Rank | **Kept** | Also Tier 3's (T2C89) |
| T2C48 | The door | **Kept** | Tier 3's door is T2C90 |
| T2C49 | Kin and the Flourish in Tier 2 | **Superseded (R3-4)** | The counts with the pure variants, and Tier 3's (T2C91) |
| T2C50 | A Tier 0 at her Ascend | **Kept** | — |
| T2C51 | Whose trees | **Kept, changed (R3-4)** | A pure variant plays her parent's five trees of her channel; the Gladiator the Brawler's, the Thaumaturge the Sorcerer's (§4.11, §6.3) |
| T2C52 | The class lines | **Kept, changed (R3-4)** | Two more: Squall and Legion for the pure variants (T2C74) |
| T2C53 | Line C | **Kept** | — |
| T2C54 | The sixteen presets | **Superseded (R3-2–R3-4)** | The twenty presets (T2C77) |
| T2C55 | Limit Break scale | **Kept, changed (R3-6)** | On the twenty and the twenty-two (T2C101) |
| T2C56 | Party value | **Kept** | — |
| T2C57 | Tier 3: no new class | **Superseded (R3-1)** | Tier 3 is a promotion (T2C65) |
| T2C58 | Masteries on the sixteen | **Superseded (R3-1)** | Re-homed as Tier 3 classes' rules (T2C82) |
| T2C59 | Round 2's names | **Kept** | Round 3's in T2C97 |
| T2C60, T2C61 | The save, the engine | **Superseded (R3-1, R3-6)** | T2C95, T2C96 |
| T2C62 | The previews | **Superseded** | Seven pages (T2C98) |
| T2C63 | The comps and the party hint | **Superseded (R3-7)** | The owner's swaps as the spine (T2C93); the hint kept (T2C94) |
| T2C64 | Where the band is read | **Kept** | Tier 2's band; Tier 3's is T2C92 |

**Counts (159 calls):** CP, CV, HV, RC, SN and A1–A10 (95): Kept 38 · Kept, changed 30 · Superseded 26 · Broken 1 (CP34).
Round 1 (30): Kept 8 · Kept, changed 13 · Superseded 8 · listed for the owner 1 (T2C5). Round 2 (34): Kept 18 · Kept,
changed 6 · Superseded 10.

## 4. Tier 2 in full

### 4.1 The twenty

Every Tier 2 class, lead slot first. **Bold** marks what round 3 adds or reshapes. Hands are lead half first (her
parent's order); MP is the hand's MP; the lean and the armor half are her parent's ([§2.1](#21-the-classes)).

| Class | Parent | Line | Slots · each slot's hits read | Act · hand · MP | Her rule | Statuses | Healer | LB scale | What she's for |
|---|---|---|---|---|---|---|---|---|---|
| **Berserker** | Brawler | Keeper | 3 Arms · ATK | One act · ×1 · ×1 | **Momentum** (§4.3) | None | No | ×0.95 | Pure physical, a self-buff: the long fight's damage |
| **Spellfist** | Brawler | Expander | 2 Arms + 1 Tome · **ATK on every hit** | One act · **×1** · ×1 | **The cross, and Pinpoint** (+2% a depth, §4.4) | None | No | ×0.95 | **Single big hits** with an element in reach: the boss and sub-boss striker |
| **Archmage** | Sorcerer | Keeper | 3 Tomes · M.ATK | One act · ×1 · ×1 | Momentum | None | No | ×0.95 | Pure magic, a self-buff: the party's top damage |
| **Battlemage** | Sorcerer | Expander | 2 Tomes + 1 Arm · **M.ATK on every hit** | One act · **×1.25** · ×1 | **The cross, and Pinpoint** | None | No | ×0.95 | **Single big hits** with an Arm in reach: the boss caster |
| **Blademaster** | Arms Spellblade | Keeper | 2 Arms + 1 Tome · ATK, M.ATK | Pair · 0.75 + 0.47 · ×0.5 a half | Her familiar's hit on both halves, piercing (§4.6) | A path | No | ×0.95 | The Break engine on one foe |
| **Sentinel** | Arms Spellblade | Support | 2 Arms + 1 Tome · ATK, M.ATK | Pair · 0.68 + 0.42 · ×0.5 a half | Support: statuses topped up, a Barrier (§4.7) | Support, the tapped foe | No | ×0.95 | Offense support with a ward |
| **Bladedancer** | Arms Spellblade | **Pure** | **3 Arms (2 + 1) · ATK on every hit** | Pair · **0.72 + 0.32** · ×0.5 a half | **The pure pair** (§4.5) | **None** | No | ×0.95 | **Pure physical multi-hit on one foe** |
| **Runeblade** | Tome Spellblade | Keeper | 2 Tomes + 1 Arm · M.ATK, ATK | Pair · 0.75 + 0.51 · ×0.5 a half | The Blademaster's | A path | No | ×0.95 | The Break engine on one foe, magic-led |
| **Enchanter** | Tome Spellblade | Support | 2 Tomes + 1 Arm · M.ATK, ATK | Pair · 0.58 + 0.38 · ×0.5 a half | The Sentinel's | Support, the tapped foe | No | ×0.95 | Offense support with a ward, magic-led |
| **Spellweaver** | Tome Spellblade | **Pure** | **3 Tomes (2 + 1) · M.ATK on every hit** | Pair · **0.72 + 0.41** · ×0.5 a half | **The pure pair** | **None** | No | ×0.95 | **Pure elemental multi-hit on one foe** |
| **Warlord** | Arms Summoner | Keeper | 2 Arms + 1 Tome · ATK, M.ATK | Pair · 0.60 + 0.49 · ×0.5 a half | Both summons linger (§4.6) | A path | No | ×0.95 | The Break engine on every foe |
| **Druid** | Arms Summoner | Support | 2 Arms + 1 Tome · ATK, M.ATK | Pair · 0.54 + 0.44 · ×0.5 a half | Support: statuses on every foe, a mend | Support, every foe | No | ×0.95 | Field support with a mend |
| **Marshal** | Arms Summoner | **Pure** | **3 Arms (2 + 1) · ATK on every hit** | Pair · **0.57 + 0.40** · ×0.5 a half | **The pure pair** | **None** | No | ×0.95 | **Pure physical area, a summon that lingers** |
| **Invoker** | Tome Summoner | Keeper | 2 Tomes + 1 Arm · M.ATK, ATK | Pair · 0.60 + 0.53 · ×0.5 a half | The Warlord's | A path | No | ×0.95 | The Break engine on every foe, magic-led |
| **Shaman** | Tome Summoner | Support | 2 Tomes + 1 Arm · M.ATK, ATK | Pair · 0.57 + 0.5 · ×0.5 a half | The Druid's | Support, every foe | No | ×0.95 | Field support with a mend, magic-led |
| **Animist** | Tome Summoner | **Pure** | **3 Tomes (2 + 1) · M.ATK on every hit** | Pair · **0.57 + 0.37** · ×0.5 a half | **The pure pair** | **None** | No | ×0.95 | **Pure elemental area, a summon that lingers** |
| **Guardian** | Paladin | Keeper | 2 Arms + 1 Tome · ATK; heals from ATK | One act · ×0.5 · ×0.6 | Every status one stack more (§4.8) | Widely, +1 | **Yes** | ×0.8 | The one healer, the attrition pick |
| **Templar** | Paladin | Expander | 2 Arms + 1 Tome · ATK; heals from ATK | One act · ×0.6 · ×0.7 | A battle healer | Widely | **Yes** | ×0.8 | The healer who hits, the on-curve pick |
| **Bishop** | Cleric | Keeper | 2 Tomes + 1 Arm · M.ATK; heals from M.ATK | One act · ×0.5 · ×0.6 | The Guardian's | Widely, +1 | **Yes** | ×0.8 | The one healer, magic-led |
| **Exorcist** | Cleric | Expander | 2 Tomes + 1 Arm · M.ATK; heals from M.ATK | One act · ×0.6 · ×0.7 | The Templar's | Widely | **Yes** | ×0.8 | The healer who hits, magic-led |

- **Twenty: the counts R3-6 sets** (T2C66): the Brawler and the Sorcerer two children each, the four hybrids three each
  (a keeper, a support, a pure variant), the healers two each. Mirrors share their rule (ten rules, twenty classes).
- **"Pure"** names a class whose three weapons and every hit are one channel: the Berserker and the Archmage, the
  four pure variants, and in Tier 3 the Gladiator and the Thaumaturge. A pure class carries no status (D282's level
  "none").
- **Hands:** the fourteen classes round 3 leaves as they were wear balance's measured knobs (T2B25–T2B29); the
  Spellfist's and the Battlemage's are round 3's, ×1 and ×1.25 beside Pinpoint (§4.4); the four pure variants' second
  half is analytic (§4.5), for balance to confirm.
- **One healer a party** (CV22) is a ceiling, not a floor (T2B39); the four healer classes count, the supports don't.
- **A Tier 2 world plays only these twenty.** Her Tier 1 classes stay in Tier 1's world with her record there.

**Leans and armor halves, by Tier 1 ancestor** (live, `rules.ts`; a Tier 2 and a Tier 3 class never change them):

| Ancestor | Lean: HP ATK MATK DEF MDEF MP | Armor half | Tier 2 classes | Tier 3 classes |
|---|---|---|---|---|
| Brawler | 1.15 1.1 0.9 1.1 0.9 0.8 | Physical | Berserker, Spellfist | Ravager, Spellhammer, Gladiator |
| Sorcerer | 0.9 0.9 1.15 0.9 1.1 1.3 | Magical | Archmage, Battlemage | Astromancer, Spellknight, Thaumaturge |
| Arms Spellblade, Arms Summoner | 1 1.1 0.95 1 1 1 | Physical | Blademaster, Sentinel, Bladedancer, Warlord, Druid, Marshal | Bladelord, Herald, Dervish, Overlord, Archdruid, Imperator |
| Tome Spellblade, Tome Summoner | 1 0.95 1.1 1 1 1 | Magical | Runeblade, Enchanter, Spellweaver, Invoker, Shaman, Animist | Runelord, Oracle, Starweaver, Hierarch, Soulcaller, Mythlord |
| Paladin | 1 1 0.8 1.15 1 1.3 | Physical | Guardian, Templar | Bastion, Inquisitor |
| Cleric | 1 0.8 1 1 1.15 1.3 | Magical | Bishop, Exorcist | Cardinal, Hierophant |

### 4.2 What a Tier 2 class keeps, and the one rule that changes her (T2C33, T2C67)

| Never changes from her parent | Changes, by her one rule |
|---|---|
| Her lean, her armor half, her Limit Break scale, her family, her hall | The stat her hits read (a cross, a pure variant) |
| Her slots' **count and order** (2 + 1, or 3); a keeper's, a support's and a healer's channels too | **A pure variant's channels:** her parent's 2 + 1 turned all her lead channel; her third slot still gives her pair's second half |
| Her parent's trees of each weapon's channel (names, shapes, powers, lines B and C) | Her hand (a cross, a keeper +0.03 a half, a support's cut, a battle healer's, a pure variant's second half) |
| Her act's shape: one act (the pures, the crosses, the healers) or a pair (the hybrids' children) | Who a status reaches and at what stacks (four levels, §4.9); a pure variant carries none |
| Her MP regen; equipped slots; Skill Ranks | A familiar's hit or a lingering summon on both halves; a Barrier or a mend; Momentum; Pinpoint |

**The lines of each family, by what they do with her parent:**

| Parent | **Keeper** sharpens | **Expander / support** widens | **Pure** (round 3) narrows to one channel |
|---|---|---|---|
| Brawler, Sorcerer | Momentum: a self-buff on her own hits | The cross on her stat, **single big hits** (Pinpoint) | — (the keeper is pure already) |
| The four hybrids | Her familiar or her summon on both halves | A little of the healers' kit, less damage | **Her pair all one channel, on her stat**, no status; her family's familiar or lingering summon kept |
| Paladin, Cleric | One stack more on every status | A battle healer: more damage, less healing | — |

### 4.3 Momentum: the pure keepers' self-buff (T2C34)

**One rule for the Berserker and the Archmage:**

| | |
|---|---|
| **Gain** | One stack after each of her turns (a skill, an Attack or a Limit Break) |
| **Effect** | **+6% a stack** (T2B26; drafted +5%) on every hit she makes, her Limit Breaks' too; a factor of its own beside the statuses (WP31 step 5) |
| **Cap** | **3 stacks: +18%** |
| **Lasts** | The whole fight, waves included; **she loses every stack when she falls** (revived, she starts again at 0) |
| **Never** | A party buff, a status on anyone else, a mend, a Break or a shield chip; it never lifts the cap of any status |
| **Auto** | Nothing to decide: it multiplies every hit alike, so Auto's pick and its Limit Break timing are unchanged |
| **On screen** | A badge on her bar, "Momentum 2", with the glyph; her Details "Momentum: +6% a stack, a stack a turn, up to 3"; the log "+Momentum" once a stack |

**What it's worth** (her acts a fight, read from the harness at Lv 50; a stack lands after her act, so her first act has
none):

| Her turns in the fight | 2 | 3 | 4 | 5 | 6 | 8 | 10 |
|---|---|---|---|---|---|---|---|
| Mean stacks over her turns | 0.50 | 1.00 | 1.50 | 1.80 | 2.00 | 2.25 | 2.40 |
| Her damage | +3% | +6% | +9% | +10.8% | +12% | +13.5% | +14.4% |

| Lv 50 (measured turns a fight) | Fights | Sub-bosses | Bosses | All, by damage |
|---|---|---|---|---|
| Mean stacks | 1.51 | 1.76 | 2.21 | **1.88** |
| Her damage | +9.1% | +10.6% | +13.3% | **+11.3%** |

**Measured** (balance §4.4–§4.6, her parent's seat in the owner's two parties): her damage a round at Lv 50 is the
Berserker's 1.14 BT against the Brawler's 1.04 and the Archmage's 1.21 against the Sorcerer's 1.12; her seat's gain
**+5.6 · +2.0 · +5.2%** (Berserker) and **+5.8 · +3.4 · +5.1%** (Archmage) at Lv 10 · 30 · 50, inside the band at every
level. At +5% they were +4.5 · +1.8 · +4.5% and +4.9 · +2.7 · +4.1%, a point short of the twelve's mean at Lv 50.

- **Why +6%, not the drafted +5% or the statuses' +10%** (T2B26): +5% left both pure keepers short of the band's middle at
  Lv 50; +6% puts them on it; at +10% the keepers would lead their expanders by about 13% of their own damage (§4.4). The
  step is the knob (5 or 7% its neighbours), then the cap.
- **Why a stack a turn:** no condition to track and nothing for Auto to plan; it rewards a long fight, which is the
  keeper's identity against the expander's breadth.
- **Name:** "Momentum" (checked, §11). "Fervor", the first pick, is a master-data string.

### 4.4 The Spellfist and the Battlemage: single big hits (T2C71–T2C73)

**The owner** (round 3): the Brawler's second line "looks slightly like an arms spellblade in terms of damage
distribution, but more focused on single hit damage and minor multi-hits and with the capability of their tome weapon do
phys based damage"; the Sorcerer's "looks slightly like a tome summoner in terms of weapon equipment but more focused on
single hit damage and with the capability of their phys weapon do magic based damage".

| | **Spellfist** | **Battlemage** |
|---|---|---|
| **Slots** | 2 Arms + 1 Tome, the Arms first: the Arms Spellblade's mix | 2 Tomes + 1 Arm, the Tomes first: the Tome Summoner's mix |
| **Act** | **One act a turn** (her parent's), one weapon's skill | The same |
| **Every hit reads** | **ATK**, her Tome's too (the cross, kept) | **M.ATK**, her Arm's too |
| **Hand · MP** | **×1** (round 2 ×1.05) · ×1 | **×1.25** (round 2 ×1.3) · ×1 |
| **Pinpoint** (new) | **An act that strikes only the tapped foe: +2% a depth** (×1.02 at depth 1 … **×1.1 at depth 5**) | The same |
| **Preset** (lead first) | **Greatsword, Katana, Fire Tome**: two Heavy single hits and the Katana's double, her minor multi-hit; Fire on ATK | **Fire Tome, Blizzard Tome, Katana**: Fire's single hit, the Katana's double on M.ATK, and one sweep |
| **Her trees** | The Brawler's Arms trees and the Sorcerer's Tome trees | The Sorcerer's Tome trees and the Brawler's Arms trees |
| **Statuses** | None | None |
| **What she's for** | The boss and sub-boss striker: every act one foe, an element in reach | The boss caster: single hits, an Arm in reach, one sweep for crowds |

**Pinpoint, the rule** (T2C73):

| | |
|---|---|
| **Which acts** | An act whose every hit lands on the tapped foe: a Heavy or Double skill (Greatsword, Fire, Katana, Light), every line or class-line skill that strikes one foe (Combo, Impale, Barrage, Draw, Spike, Bolt, Pierce, Conquest on an unbroken foe, Quasar), an Attack, and a Limit Break cast that strikes only the tapped foe |
| **How much** | **+2% for each depth of the skill** (an Attack 0; a Limit Break her open depth): ×1.02 · 1.04 · 1.06 · 1.08 · **1.10** |
| **Where in the stack** | A factor of its own at step 5, beside the statuses and Momentum (WP31); it reaches her Limit Break, which a hand never does |
| **Never** | A Sweep, a Scatter, a Volley's splash, a farewell; a heal; a status or a Break |
| **Auto** | Unchanged: it reads each act's damage, Pinpoint in it, so it leans to her one-foe acts by itself |
| **On screen** | Her Details "Pinpoint: +2% a depth on one-foe acts"; a skill's sheet shows "Pinpoint ×1.08" |

**The cross** (kept from round 2, T2C35): a hit of her other channel reads her stat and that weapon's Might, but keeps its
kind's channel for everything else.

| A hit of her other channel | Reads | Example: the Spellfist's Fire Tome |
|---|---|---|
| **Offense** | **Her stat** + that weapon's Might + her accessories' flat on its kind + her signature | ATK + the Fire Tome's Might |
| **Defense** | The kind's channel: an element against M.DEF, an Arm against DEF | The foe's M.DEF |
| **Weakness, shields, locks** | The kind | Fire |
| **Statuses** | The kind's channel | Faith and Mind Break raise it |
| **The Rift's ward** | The kind's channel | An Iron foe's ward (on elements) halves it; an Arcane foe's doesn't |
| **Her tree** | The other pure class's tree for that weapon | The Sorcerer's Fire tree |

**What crossing is worth on its own** (round 2's analytic, kept: her best hit a turn against one regular, every Tier 2
weakness list equally likely, foe defenses from `rpgFoe` at lifetime Lv 100, offense 535):

| Kit | Her best hit a turn | Against the keeper | A weak kind in reach |
|---|---|---|---|
| Brawler, Berserker: 3 Arms | 387 | — | 75% |
| 2 Arms + 1 Tome on ATK (the Spellfist's mix) | 392 | +1.2% | 70% |
| 3 Arms + a fourth slot, a Tome (not proposed) | 405 | +4.5% | 84% |
| Sorcerer, Archmage: 3 Tomes | 385 | — | 75% |
| 2 Tomes + 1 Arm on M.ATK (the Battlemage's mix) | 391 | +1.8% | 70% |

So **a cross is a breadth pick, not a damage pick**: her value is the element (or the Arm) her party gains, the Rift's
wards and a Learner seat of the other channel at full offense. Her damage step is Pinpoint's and her hand's.

**Why one act, not a Spellblade's pair** (the owner's "damage distribution"): the Spellfist takes the Arms Spellblade's
slot mix (two Arms and a Tome, the Arms leading), so her damage is spread as an Arms Spellblade's is, two thirds
physical; but a pair splits every turn into two smaller halves and the familiar's hit into more, the opposite of "single
hit damage". One full act keeps each hit big. The pair is the alternative (T2C71), and it would make her a second
Spellblade beside the Bladedancer (§4.5), blurring the owner's swap.

**Why Pinpoint, and why by depth** (measured on the live engine, a throwaway run, Tier 2 frame, 6 seeds): a Brawler's
seat on one-foe kinds only (Greatsword, Katana, Bow on Barrage) moves her party's damage a round **+0.8 to +1.2% at Lv
10, −0.3 to +0.8% at Lv 30 and −1.5 to −1.7% at Lv 50**; a Sorcerer's on Fire, Light and Dark on Barrage +0.4%, −1.6 to
−2.9% and **−2.9 to −5.4%**; a Sorcerer's on Fire, Light, Blizzard (keeping the sweep) −1.4 to +0.2% at Lv 50. A
single-target kit costs nothing early and up to a twentieth of the party late, when fights hold more foes and her
area skills have grown. A flat factor would overshoot Lv 10 and fall short at Lv 50; **+2% a depth** grows with the cost.
The Battlemage keeps one sweep, since a Sorcerer's seat with none lost twice the Brawler's.

**What they're worth** (analytic, her parent's seat; round 2 measured the cross at +6.5 · +4.5 · +4.3% and +10.9 · +8.3 ·
−1.8%, at ×1.05 and ×1.3 on the Scatter twins):

| | Round 2 (measured) | The one-foe kit | The hand | Pinpoint | **Round 3, Lv 10 · 30 · 50 (analytic)** | The band at Lv 10 · 30 · 50 |
|---|---|---|---|---|---|---|
| **Spellfist** | +6.5 · +4.5 · +4.3% | +3 · 0 · −6.5 points | ×1.05 → ×1: −2.6 | +2.3 · +4.6 · +5.8 | **about +9 · +6.5 · +1%** | +2 to +12 · −1.1 to +8.9 · −1.8 to +8.2 |
| **Battlemage** | +10.9 · +8.3 · −1.8% | about −1 (the Katana for the Lance) | ×1.3 → ×1.25: −2 | +1.5 · +3 · +4 (two of her three) | **about +9.5 · +8 · −1%** | the same |

Points are of her parent's value; a point of her own damage is worth about 0.55 of a point of the seat's gain for a pure
seat (round 2: the Berserker's damage +9.6%, her seat +5.2%). **The Battlemage at Lv 50 stays the cell nearest the edge,
as in round 2**; her knobs, in order: Pinpoint's step (+2% → +3% a depth for her), then her hand.

**Their gear** (T2C36, kept): her parent's armor half; every Pendant counts on every hit of the Spellfist, every Charm on
every hit of the Battlemage; Prowess all to her stat; her other channel's weapon grades with its own items (D289). **Her
offense on her other channel, on curve at Lv 50** (code): the Spellfist's Fire hit **277 · 499 · 722** (Tiers 1 · 2 · 3),
the Battlemage's Katana **282 · 508 · 735**, against an Arms Spellblade's Tome half at about 196 · 351 · 510.

### 4.5 The pure variants: the pure pair (T2C67–T2C70)

**R3-4:** the Arms Spellblade and the Arms Summoner gain a **pure physical** child, the Tome Spellblade and the Tome
Summoner a **pure elemental** one, each keeping her family's feel. Her keeper and her support stay: three children each.

| | **Bladedancer** | **Spellweaver** | **Marshal** | **Animist** |
|---|---|---|---|---|
| **Parent** | Arms Spellblade | Tome Spellblade | Arms Summoner | Tome Summoner |
| **Slots** | **3 Arms**: two lead, one pair | **3 Tomes** | **3 Arms** | **3 Tomes** |
| **Her act** | **A pair:** her lead half from her first two weapons, her second half from her third, every act | The same | The same, as summons | The same, as summons |
| **Every hit reads** | **ATK** | **M.ATK** | **ATK** | **M.ATK** |
| **Hands** (lead + second) · MP | 0.72 + **0.32** · ×0.5 a half | 0.72 + **0.41** | 0.57 + **0.40** | 0.57 + **0.37** |
| **Her family's feel, kept** | Her familiar's extra hit on her lead half; one foe; Pierce on line B | The same | Her lead summon lingers and strikes every foe in farewell; area | The same |
| **Statuses** | **None** | None | None | None |
| **Her trees** | The Arms Spellblade's five Arms trees | The Tome Spellblade's five Tome trees | The Arms Summoner's five Arms trees | The Tome Summoner's five Tome trees |
| **Preset** | **Katana, Axe, Bow** | **Thunder, Blizzard, Dark** | **Bow, Axe, Katana** | **Dark, Blizzard, Thunder** |
| **Gear** | Pendants on every hit; Prowess all to ATK; armor physical | Charms; Prowess all to M.ATK; magical | Pendants; ATK; physical | Charms; M.ATK; magical |
| **What she's for** | Pure physical multi-hit on one foe | Pure elemental multi-hit on one foe | Pure physical area, a summon that lingers | Pure elemental area |

- **The pure pair** is her parent's pair with both halves in one channel: the engine's "one Arms half and one Tome half"
  becomes "one half from her lead two, one from her third". Auto picks both, as today.
- **Her lines A on the Light/Dark side** (the Katana and Bow, or Light and Dark) carry no status: they play as her other
  trees, the depth-5 skill at her parent's pure-power factor (`RPG_PURE_POWER_V21`: ×1.26, ×1.15, ×1.08, ×1.16). Line B
  stays Pierce, Oath or Pack; line C her family's.
- **Why no status:** "pure" in the owner's words is the Brawler's and the Sorcerer's kind of class, and D282 gives those
  none. A pure variant is the hybrid line's damage-only pick, as the support is its utility pick.
- **Why her third slot gives her second half:** it mirrors her parent exactly (her lone weapon was always her second
  half), so her preset and her trees read the same and nothing new is learned.

**Her second half's hand** (analytic, code numbers at Tier 2 Lv 50: her parent's offenses from the live harness,
regular foes' defenses from `rpgFoe` at lifetime Lv 100, damage = offense² ÷ (offense + defense), the four roles alike):

| | Her parent's second half | Hers | One hit, ×1 power: parent → hers | Lead half | Her parent's D + S (lost S) | **Second hand** |
|---|---|---|---|---|---|---|
| Bladedancer | Thunder on M.ATK, 351 | An Arm on ATK, 500 | 169 → 287 (×1.69) | 520 → 536 (×1.04) | 0.85 + 0.02 | 0.44 → **0.32** |
| Spellweaver | Katana on ATK, 351 | A Tome on M.ATK, 500 | 171 → 285 (×1.67) | ×1.04 | 0.86 + 0.09 | 0.48 → **0.41** |
| Marshal | Dark on M.ATK, 351 | An Arm on ATK, 500 | 169 → 287 | ×1.04 | 0.73 + 0.10 | 0.46 → **0.40** |
| Animist | Bow on ATK, 351 | A Tome on M.ATK, 500 | 171 → 285 | ×1.04 | 0.73 + 0.02 | 0.50 → **0.37** |

Her second half reads her higher stat (her lean, her armor's offense, her Pendants or Charms and all her Prowess), so at
her parent's hand it would deal about two thirds more. **The hand is set so her seat lands at the band's middle** at
Lv 10 and 50: her damage up enough to replace the status her parent carried (its S), at a hybrid seat's measured
pass-through (0.85, round 2's keepers). Analytic gains, Lv 10 · 50: **Bladedancer +3.6 · +5.3%, Spellweaver +8.3 · +2.0%,
Marshal +10.1 · +1.2%, Animist +4.4 · +6.3%** (at Lv 10 no path is open, so her parent's S is near 0, and her stat's lead
is smaller: ×1.50 a hit, against ×1.69 at Lv 50). Mirrors differ for the reason round 2's crosses do: the Tome
Spellblade's and the Arms Summoner's lost statuses are the ones no one else in Party 2 carries.

**Why at Tier 2, not at Tier 3** (R3-4's alternative, T2C67): at Tier 3 the pure line would split from the keeper,
so the owner's first swap (**a Brawler with a Spellblade**: the Brawler to her Spellfist, the Spellblade to pure
physical) could only start a tier after the Spellfist does. At Tier 2 the two sides of the swap arrive together, and each
hybrid line has its three ways (sharpen, support, purify) for both tiers.

### 4.6 The hybrid keepers: both halves (T2C37, T2C38)

| | Tier 1 parent | **Keeper's rule** | What it does in a fight |
|---|---|---|---|
| **Blademaster, Runeblade** | Her bound familiar lands one extra hit on her **lead** half (the same total) | **On both halves, and it pierces** (T2B28) | One more hit on her other half, the same total: a weak other half chips one more shield point. **The familiar's hit pierces** (skips the unbroken halving) on every tree, Pierce being the Spellblades' own line B |
| **Warlord, Invoker** | Her **lead** summon lingers; at her next pair it strikes every foe once in farewell (its linger share × 0.1) | **Both summons linger** | Two farewells at her next pair, one of each kind, on every foe: each weak foe chips one more point a pair. Oath (B, linger 0.4) now matters on either half |

- **Her hands +0.03 a half** (T2B28, T2B29): the Blademaster 0.75 + 0.47, the Runeblade 0.75 + 0.51, the Warlord 0.60 +
  0.49, the Invoker 0.60 + 0.53 (lead first; MP ×0.5 a half kept).
- **What it's worth, measured** (balance §4.4–§4.6): the drafted rules alone were worth about nothing on curve (the
  Blademaster +0.5 · −0.1 · −0.1%, the Runeblade −0.6 · +0.6 · −0.7%: the same damage in more hits; the second farewell
  1–3%). With the familiar's Pierce (+1 to +7% alone) and the hands: **the Blademaster +9.0 · +4.5 · +3.6%, the Runeblade
  +6.8 · +2.3 · +2.8%, the Warlord +8.6 · +2.0 · +6.8%, the Invoker +8.6 · +3.6 · +3.0%** at Lv 10 · 30 · 50. A chip is
  still a party value (a Break doubles everyone's damage on that foe for two rounds): the second familiar and farewell
  add one to the Duel's rail (T2B38). The model (round 2's analytic model) credited
  +6% and +7% of her damage to Breaks.
- **Statuses: her parent's path** (1 · 1 · 2 on a secondary weapon's line A from depth 3).
- **The knob, applied:** the hands (D249's order), +0.03 a half; the alternative +0.05 with no Pierce for the Spellblades.

### 4.7 The support expanders: a little of the healers' kit (T2C39–T2C42)

| | **Sentinel, Enchanter** (from the Spellblades) | **Druid, Shaman** (from the Summoners) |
|---|---|---|
| **Her hands** (T2B25) | The Sentinel her parent's **× 0.95**: 0.68 + 0.42; the Enchanter **× 0.8**: 0.58 + 0.38; MP ×0.5 a half | The Druid her parent's **× 0.95**: 0.54 + 0.44; the Shaman **× 1**: 0.57 + 0.5 |
| **Statuses** (T2B24) | **Every skill** of her Katana, Bow, Light and Dark trees (every line) carries its status at the support ladder, **1 · 1 · 1 · 2 · 2** by depth, **topped up to its stacks, never built past them** | The same ladder, the same rule, on the same four weapons |
| **Where** | A debuff on **the tapped foe**, on every foe at depth 5; Brave and Faith on **the Uma she wards** (her Barrier's target) | A debuff on **every foe at every depth**; Brave and Faith on the most threatened Uma |
| **Her Ring trees** | Damage only | Damage only |
| **Her piece of the kit** | **A Barrier** after each of her skill acts on the most threatened Uma: **a third of the healers' Barrier share** at her act's depth (9 · 11 · 12 · 13 · 15% of the target's max HP), × her healing scale | **A mend:** her lingering summon's farewell also mends every Uma **a tenth of the healers' mend share** at the summon's depth (2.8 · 3.2 · 3.6 · 4.0 · 4.4% of each one's max HP), × her healing scale |
| **Kept from her parent** | Her familiar's extra hit on her lead half | Her lead summon lingers |
| **Not hers** | Rescue, cleanse, revive, Regen, drain; she is no healer | The same |
| **Her preset** | Katana, Greatsword, Light · Light, Blizzard, Katana: **Armor Break and Brave and Faith** | **Bow, Axe, Dark** (her parent's, T2B25) · Dark, Blizzard, Bow: **Enfeeble and Mind Break** |
| **Her role** | **Offense support:** she fills the status a healer carries least (a Cleric has no Armor Break), and her ward gets Brave and Faith and a Barrier | **Field support:** every foe weaker and softer to magic, the party a little mended each pair |

- **Her healing scale** is T2C18's: her higher of ATK and M.ATK ÷ (300 × the tier's multiplier), about ×1.67 on curve at
  any tier's Lv 50. Her Barrier caps at 60% of max HP like any Barrier.
- **Why the support rule** (T2B24): a pair class casts **one of each channel every act**, so whatever status rides her
  lone other-channel weapon is re-cast every round. Built up like any status, the drafted ladder (the healers' 1 · 1 · 2
  · 2 · 3, Brave and Faith on every Uma) sat at three stacks the whole fight: measured, **the Sentinel +34 · +46 · +50%
  and the Enchanter +33 · +20 · +18%** over their parents, and no cut short of halving her damage brought them down.
  Topped up, her stacks are her ladder's ("topped up" is the engine's own cap argument, as Hex's: her status lands at
  its stacks or leaves a higher one standing, and a re-cast refreshes its two rounds); on her ward, Brave and Faith are a
  support's piece of the kit, R2-3's "a little of the healers' kit". The Ring statuses (Greatsword, Lance, Fire on every
  skill) stay the healers'.
- **Why four cuts** (T2B25): each support's every-act status is a different one: the Sentinel's lone Tome carries Brave
  and Faith (on her ward now), the Enchanter's lone Arm Armor Break (every foe at depth 5), the Druid's lone Tome Mind
  Break on every foe, the Shaman's lone Arm Enfeeble on every foe (sustain, nothing on curve, so no cut). The Druid
  wears her parent's Axe: the drafted Greatsword cost her the Axe's sweep.
- **Measured** (balance §4.6, §4.8): **the Sentinel −2.4 · +10.9 · +2.9%, the Enchanter +7.0 · +2.5 · +6.6%, the Druid
  +7.1 · +2.3 · −1.5%, the Shaman +10.4 · +0.8 · +1.2%** at Lv 10 · 30 · 50; and under attrition every support's party is
  safer than her keeper's: with the healer down it wins 70–85% of fights at ×2.6 where the keeper's wins 51–66%.
- **Overlap:** a status two members carry adds less, three stacks at most (the cap). The harness counts it (S is what the
  other four lose, T2B21).

### 4.8 The healers: one stack more, or a battle healer (T2C43, T2C44)

| | **Guardian, Bishop** (keepers) | **Templar, Exorcist** (expanders) |
|---|---|---|
| **Power · MP** | ×0.5 · ×0.6 (Tier 1's) | **×0.6 · ×0.7** |
| **Mends, Barriers, Regen, drain, revive** | Tier 1's shares | **×0.7 the shares** (Rescue's 60% floor and the revive kept) |
| **Statuses** | **One stack more**, to the cap of 3: Greatsword, Lance and Fire **2 · 2 · 3 · 3 · 3**; her path **3 · 3 · 3** | Tier 1's: 1 · 1 · 2 · 2 · 3, the path 2 · 2 · 3 |
| **Line B, Surge** | Where her status already stands at 3, Surge gives the mend or Barrier ×1.15 (the live rule for trees with no status to stack) | Tier 1's |
| **Healing capacity, on-curve Lv 50** | About 20% of the party's max HP a round (Tier 1's) | About 14% |
| **Damage share in her party** (measured, Lv 50) | About 9% (Tier 1's) | About 10% |
| **Measured on curve** (her parent's seat, Lv 10 · 30 · 50) | Guardian +5.5 · 0 · +1.1%; Bishop +15.5 · 0 · +0.1% | **Templar +12.1 · +9.7 · +5.7%; Exorcist +15.9 · +6.9 · +7.3%** |
| **Measured under attrition** (Lv 50, fights won at ×3.2 · ×4) | **Guardian 91.9 · 67.5%; Bishop 85.0 · 56.9%** | Templar 89.7 · 63.4%; Exorcist 77.5 · 51.9% |
| **Her role** | The party's support and its safe healer: the attrition pick | The healer who hits: a fifth more damage, a third less healing, the same statuses: the on-curve pick |

- **Both stand as written** (T2B30, T2B31). Each is the better pick somewhere: the battle healer on curve (ahead of her
  keeper by up to 10 points at every level but Lv 10's Bishop, level with her), the keeper under attrition (+2 to +8
  points of fights won from ×3.2, a fifth less damage taken at ×2.6); the two within 1.3% in party damage a round at
  ×2.6. A round longer on the keepers' statuses was tried and refused: it put them past their battle healers on curve too.
- **Still one healer a party.** The Templar and the Exorcist count; the owner can't field a battle healer beside a keeper.
- **Why the keeper's rule is statuses, not more healing:** on curve a party takes about 1% of its HP a round (§2.7), so
  more healing adds almost nothing to a fight's value; one stack more is worth +0 to +6% on curve (re-cast statuses
  reach 3 anyway) and keeps her ahead of the battle healer whenever healing matters (the stress check, T2B23).
- **The battle healer pairs with a support:** her lost healing (−6% of the party's HP a round) is about the Sentinel's
  ward (3.7%) or the Druid's mend (5.5%) — the owner's "swap the Paladin for damage and a Spellblade to support so they
  balance each other" (C4: measured +4.3 · +5.3 · +5.7% over Party 1, and 99.7% of fights won at ×2.6, the second-safest
  comp).

### 4.9 Statuses: four levels on twenty (T2C45, T2C75)

D282's three levels, round 2's support level between the path and widely, and balance's rule for it (T2B24):

| Level | Tier 2 classes | Tier 3 classes | Weapons | Stacks by depth | Stacking | Reach |
|---|---|---|---|---|---|---|
| **None** | Berserker, Spellfist, Archmage, Battlemage, **Bladedancer, Spellweaver, Marshal, Animist** | Ravager, Spellhammer, Gladiator, Astromancer, Spellknight, Thaumaturge, Dervish, Starweaver, Imperator, Mythlord | — | — | — | — |
| **A path** | Blademaster, Runeblade, Warlord, Invoker | Bladelord, Runelord, Overlord, Hierarch | Line A of a Light/Dark weapon, from depth 3 | 1 · 1 · 2 | Built up (Tier 1's) | The tapped foe |
| **Support** | Sentinel, Enchanter · Druid, Shaman | Herald, Oracle · Archdruid, Soulcaller | **Every skill** of a Light/Dark weapon | **1 · 1 · 1 · 2 · 2** | **Topped up to its stacks, never built past them** | Debuffs: the Spellblades' the tapped foe, every foe at depth 5; the Summoners' **every foe**; **Brave and Faith on the Uma she wards** (a Summoner's: the most threatened) |
| **Widely** | Guardian, Bishop (**+1 stack**: 2 · 2 · 3 · 3 · 3, path 3 · 3 · 3) · Templar, Exorcist | Bastion, Cardinal (+1) · Inquisitor, Hierophant | Every skill of Greatsword, Lance, Fire; the path on Light/Dark | 1 · 1 · 2 · 2 · 3; path 2 · 2 · 3 | Built up | The tapped foe, every foe at depth 5; buffs every Uma |

- **The pure variants join "none"** (T2C75): their Katana and Bow (or Light and Dark) line A plays as damage (§4.5).
  Ten of the forty-two later-tier classes are status-free at Tier 3, as the owner's pure lines ask.
- **A Tier 3 class keeps her Tier 2 parent's level;** the crown adds a stack to a crowned capstone (to the cap of 3, a
  support's still topped up), as round 2 measured it (T2B37).
- The five statuses keep +10% a stack, three at most, two rounds (T2B12); no retired status returns (D282 D3). The Class
  tab prints each tree's status and level over it (D282 call 8).

### 4.10 Promotion and switching (T2C46–T2C50, T2C76, T2C91)

**The Ascend is the Tier 2 promotion** (R2-5). On the Ascend sheet ([progression](progression.md) owns its flow) she
picks her Tier 2 class.

| Rule | |
|---|---|
| **Open on arrival** | **Every child of every Tier 1 class she holds at Class Rank 50**: two for the Brawler, the Sorcerer and the healers, three for each hybrid (T2C76). A full Tier 1 window asks three at Rank 50 (Class V), so **6 to 9** of the twenty at least; an Uma with all eight at 50 opens all twenty |
| **Held on arrival** | Every open Tier 2 class is hers at Class Rank 1, with its preset's weapons, line A and the auto loadout. No second promotion step |
| **The pick** | One of them is her **active class**. **Suggested:** the keeper of the Tier 1 class she fights as when she ascends; if that class isn't at Rank 50 (or she fights as a Tier 0), the keeper of her family's own Tier 1 class at Rank 50 with the most Class EXP; ties by the class tree's order |
| **Switching** | Free, outside fights, on the Classes sheet, among her held Tier 2 classes, each with its own Class Rank, weapons, lines and equipped skills |
| **Class Rank** | 1–50 a class. **Ranks 1–10 one shared ladder** (XR1): her first 3,600 Class EXP raise every Tier 2 class she holds to Rank 10 together; from 10 each climbs alone. Depths at Lv 10 · 16 · 22 · 29, Rank 50 at Lv 36 on her active class; two classes to Rank 50 a campaign |
| **The door** | **When any Tier 2 class she holds reaches Class Rank 20, every child of her parent's reclass neighbours opens** (D290, D291's map, below), about the Tier 1 door's 3,600 Class EXP |
| **Never** | Closes a class, costs anything, moves her calling, trade or template |

| A held Tier 2 class at Class Rank 20, whose parent is | Opens every child of (her parent's reclass neighbours, itself included) |
|---|---|
| Brawler | the Brawler, Arms Spellblade, Arms Summoner (the Warrior's): 8 classes |
| Sorcerer | the Sorcerer, Tome Spellblade, Tome Summoner (the Mage's): 8 |
| Arms Spellblade | every Tier 1 class but the Sorcerer: 18 |
| Tome Spellblade | every Tier 1 class but the Brawler: 18 |
| Arms Summoner | every Tier 1 class but the Sorcerer: 18 |
| Tome Summoner | every Tier 1 class but the Brawler: 18 |
| Paladin, Cleric | both Spellblades, both Summoners, both healers: 16 |

A parent's own children count among her neighbours' (the reclass map's own rule: a Tier 0 promotes into her own
children), so a class she opened through a door opens her siblings at Class Rank 20 (round 2 left the Brawler and the
Sorcerer out of their own rows; it matters now that a hybrid has three children).

**Kin and her Flourish** (T2C91; RC6, CV21): her Flourish works while she fights as a Tier 2 or Tier 3 descendant of her
calling's own Tier 1 classes; a kin parent's child is never Suggested and outside her Flourish ("Off · as Templar").

| Her calling | Her own Tier 1 classes | Her family in Tier 2 | In Tier 3 |
|---|---|---|---|
| Warrior | Brawler, Arms Spellblade, Arms Summoner | 8 | 9 |
| Mage | Sorcerer, Tome Spellblade, Tome Summoner | 8 | 9 |
| Spellblade | Arms Spellblade, Tome Spellblade | 6 | 6 |
| Summoner | Arms Summoner, Tome Summoner | 6 | 6 |
| Healer | Paladin, Cleric | 4 | 4 |

- **A Tier 0 at her Ascend** (T2C50) holds three Tier 1 classes at Rank 50 (Class V), so she arrives as the Suggested
  rule's class.
- **The window's Class steps in Tier 2** read Tier 2 classes (R2-10 is progression's); a class's **sibling** is another
  child of the same Tier 1 class (one or two of them).

### 4.11 Trees, the class line, line C (T2C51–T2C53, T2C74)

- **A Tier 2 class plays her parent's trees** of each slot's channel: the same nodes, names, powers and line B; her
  class's rule applies in the fight. The **Spellfist's** Tome plays the **Sorcerer's** Tome tree, the **Battlemage's** Arm
  the **Brawler's**. A **pure variant** plays her parent's five trees of her channel (the Bladedancer the Arms
  Spellblade's Arms trees: Sever, Hew, Lunge, Arc, Iai). No weapon tree and no skill name is added.
- **Line C** (T2C14) joins each tree's fork at depth 3 by family: the Brawler's trees Rout, Havoc, Tremor, Hail, Fork; the
  Sorcerer's Kindle, Sleet, Peal, Beam, Gloom; the Spellblades' Swath and Strafe; the Summoners' Hunt and Maul; the
  healers' **Psalm**. Every capstone forks **Power or Break** (T2C15).
- **The class line** (T2C11): her fourth tree, at **Class Rank 20 · 30 · 40**, cast through any of her three weapons (its
  kind, channel, Might and flat; Auto the one that lands weak), the depth table's power and MP, her hand on top. Twelve
  lines on the twenty, mirrors sharing; **two new for the pure variants** (T2C74):

| Class | Its line (CR 20 · 30 · 40) | What it does | Status |
|---|---|---|---|
| **Berserker** | Grand Rampage · Supreme Rampage · **Skybreaker** | The tapped foe takes the full power, every other foe 0.3 of it | None |
| **Spellfist** | Grand Conquest · Supreme Conquest · **Sundown** | One foe at the full power; on a Broken foe every other foe also takes 0.55 (Pinpoint on an unbroken foe) | None |
| **Archmage** | Grand Nebula · Supreme Nebula · **Starburst** | Every foe at the area share (0.55); a foe weak to its kind takes the full power | None |
| **Battlemage** | Grand Quasar · Supreme Quasar · **Event Horizon** | One foe, one hit at ×1.25 the power (Pinpoint) | None |
| **Blademaster, Runeblade** | Grand Sigil · Supreme Sigil · **Rune Edge** | Her pair: her lead half on one foe, her other half on every foe at 0.55; the familiar on both | A path |
| **Sentinel, Enchanter** | Grand Bane · Supreme Bane · **Penumbra Edge** | Her pair on one foe; through a Light/Dark weapon its status, her Barrier after it | 2 · 2 · 3, topped up |
| **Bladedancer, Spellweaver** (new) | **Grand Squall · Supreme Squall · Thousand Cuts** | Her pair on one foe, each half one hit more (the same total) | None |
| **Warlord, Invoker** | Grand Griffin · Supreme Griffin · **Kraken** | Her pair on one foe; her lead summon lingers at 0.5, not 0.3 | A path |
| **Druid, Shaman** | Grand Wraith · Supreme Wraith · **Banshee** | Her pair, her lead summon on every foe at 0.55; through a Light/Dark weapon its status on every foe | 2 · 2 · 3, topped up |
| **Marshal, Animist** (new) | **Grand Legion · Supreme Legion · Onslaught** | Her pair, both summons on every foe at 0.55 | None |
| **Guardian, Bishop** | Grand Edict · Supreme Edict · **Covenant** | A blow or a spell on one foe; through the Greatsword, Lance or Fire its status reaches every foe or every Uma; through the Axe, Blizzard or Thunder its Barrier or mend reaches every Uma | 3 · 3 · 3 |
| **Templar, Exorcist** | Grand Solace · Supreme Solace · **Absolution** | A blow or a spell on one foe, then a mend on the most hurt and a Barrier on the most threatened, both whole (× her 0.7) | 2 · 2 · 3 |

- Priced like a line (CP15): 10–20% over the same depth's line A in its context, behind it elsewhere; balance measures
  them on the build's run (round 2 left the class lines out, T2B20).
- **Equipped** (T2C16): 3 at Lv 1, one more at Lv 10, 15, 20, 25, 30, 35, 40: 10 of 18 held. **Skill Ranks** as Tier 1.
- **A Tier 3 class plays her Tier 2 parent's trees and class line** (the Gladiator the Brawler's Arms, the Thaumaturge
  the Sorcerer's Tomes, with the Spellfist's and Battlemage's class lines), crowned at Class Rank 50 (§6.2).

### 4.12 MP and the healing scale (T2C17, T2C18)

- **Skill MP ×1.7 in Tier 2, ×2.4 in Tier 3,** in place of today's ×tier: an on-curve bar grows ×1.72 and ×2.45, so casts
  stay within 0.3 of Tier 1's for the damage classes and within 1 for the healers.

| A depth-5 act on a full bar at Lv 50 | MP · casts, Tier 1 | Tier 2 today (×2) | **Tier 2, ×1.7** | Tier 3 today (×3) | **Tier 3, ×2.4** |
|---|---|---|---|---|---|
| Berserker, Spellfist | 26 · 8.2 | 52 · 7.1 | **44 · 8.3** | 78 · 6.7 | **62 · 8.4** |
| Archmage, Battlemage | 26 · 11.3 | 52 · 9.7 | **44 · 11.5** | 78 · 9.2 | **62 · 11.6** |
| A Spellblade's or a Summoner's child, the pure variants too (two halves of 13) | 26 · 9.4 | 52 · 8.1 | **44 · 9.6** | 78 · 7.7 | **62 · 9.7** |
| Guardian, Bishop (×0.6) | 16 · 18.4 | 32 · 15.8 | **27 · 18.7** | 48 · 14.9 | **37 · 19.4** |
| Templar, Exorcist (×0.7) | — | — | **31 · 16.3** | — | **44 · 16.3** |

- **The healing scale** ×(1 + offense ÷ (300 × the tier's multiplier)): ÷ 300 · 540 · 780, so an on-curve healer is
  **×1.64 at every tier's Lv 50** (today 1.64 · 2.16 · 2.68). The supports' Barrier and mend take the same scale.

### 4.13 The Halls and presets (T2C23, T2C77, T2C100, T2C101)

| | Tier 2 and Tier 3 |
|---|---|
| Seats | The same sixteen in each world's halls, no new seat (D261); she arrives with no seat and no Bond |
| Home classes | A seat's Tier 1 home class's descendants: the Dojo's the Berserker and the Spellfist, then the Ravager, Spellhammer and Gladiator; the Salle's Arms seats the Blademaster, Sentinel and Bladedancer, then the Bladelord, Herald and Dervish (T2C100) |
| Class scale | **×0.95 every damage and support class, ×0.8 every healer class**, in both tiers (T2C101) |
| LB+ | +20% at Bond 10 (HV23) |
| Hits | At most 10 on one foe |
| Her twist on a cast | Momentum multiplies it; Pinpoint when it strikes only the tapped foe; a cross-wielding or pure Hero's hits read her stat |

**The twenty presets** (T2C77; lead first; a keeper, a support and a battle healer wear round 2's):

| Class | Preset | Class | Preset | Class | Preset |
|---|---|---|---|---|---|
| Berserker | Greatsword, Axe, Lance | **Spellfist** | **Greatsword, Katana, Fire** | — | — |
| Archmage | Fire, Blizzard, Thunder | **Battlemage** | **Fire, Blizzard, Katana** | — | — |
| Blademaster | Katana, Axe, Thunder | Sentinel | Katana, Greatsword, Light | **Bladedancer** | **Katana, Axe, Bow** |
| Runeblade | Thunder, Blizzard, Katana | Enchanter | Light, Blizzard, Katana | **Spellweaver** | **Thunder, Blizzard, Dark** |
| Warlord | Bow, Axe, Dark | Druid | Bow, Axe, Dark | **Marshal** | **Bow, Axe, Katana** |
| Invoker | Dark, Blizzard, Bow | Shaman | Dark, Blizzard, Bow | **Animist** | **Dark, Blizzard, Thunder** |
| Guardian | Lance, Greatsword, Light | Templar | Lance, Greatsword, Light | — | — |
| Bishop | Light, Fire, Lance | Exorcist | Light, Fire, Lance | — | — |

- **The rule for the six new presets:** a cross-wielder takes one-foe kinds (Heavy and Double) for her single hits, the
  Battlemage one sweep beside them (§4.4); a pure variant keeps her parent's two lead weapons and takes, in her third
  slot, the kind of her channel that keeps the owner's comps whole. Searched over every legal kit of the six (324
  sets): this one holds the most mixes whole, and every one of the owner's swap comps holds all ten kinds (§5.7).
- **The cost of single big hits:** with round 2's Spellfist (Greatsword, Axe, Thunder) 92 of the 144 keeper, expander,
  support and pure mixes of the owner's two parties hold all ten; with the one-foe Spellfist, 80. Thunder, Bow, Axe,
  Dark and Katana are the kinds a mix can drop; the party hint names them (T2C94), and gear's two-kind weapons add
  their partners.
- **A preset sets her three accessory slots** by D266's rule on its weapons and gear's forms (T2G36): a pure variant
  wears her stat's family twice and an Orb, as a pure class does.

### 4.14 Class stats at Lv 50 (SB1)

Leans don't change, so **each Tier 2 class wears her parent's sheet and each Tier 3 class her Tier 1 ancestor's**. The on-curve Uma at each tier's Lv 50 (her
preset, G10 × tier, every Extra Stats node × tier, no template), from the live code:

| Parent (lead weapon) · her children | Tier | HP | MP | ATK | M.ATK | DEF | M.DEF | Lead offense |
|---|---|---|---|---|---|---|---|---|
| **Brawler** (Greatsword) · Berserker, Spellfist | 1 · 2 · 3 | 1,460 · 2,531 · 3,610 | 212 · 367 · 522 | 209 · 377 · 545 | 114 · 205 · 296 | 204 · 368 · 532 | 181 · 324 · 468 | 297 · 535 · 774 |
| **Sorcerer** (Fire) · Archmage, Battlemage | 1 · 2 · 3 | 1,230 · 2,139 · 3,055 | 294 · 505 · 717 | 114 · 205 · 296 | 214 · 386 · 558 | 184 · 331 · 478 | 200 · 360 · 520 | 302 · 544 · 787 |
| **Arms Spellblade, Arms Summoner** · Blademaster, Sentinel, Bladedancer, Warlord, Druid, Marshal | 1 · 2 · 3 | 1,322 · 2,296 · 3,277 | 245 · 423 · 600 | 200 · 362 · 522 | 128 · 229 · 333 | 194 · 349 · 505 | 191 · 342 · 494 | 288 · 520 · 751 |
| **Tome Spellblade, Tome Summoner** · Runeblade, Enchanter, Spellweaver, Invoker, Shaman, Animist | 1 · 2 · 3 | 1,322 · 2,296 · 3,277 | 245 · 423 · 600 | 128 · 229 · 333 | 200 · 362 · 522 | 194 · 349 · 505 | 191 · 342 · 494 | 288 · 520 · 751 |
| **Paladin** (Lance) · Guardian, Templar | 1 · 2 · 3 | 1,322 · 2,296 · 3,277 | 294 · 505 · 717 | 193 · 347 · 503 | 109 · 197 · 284 | 209 · 377 · 545 | 191 · 342 · 494 | 281 · 505 · 732 |
| **Cleric** (Light) · Bishop, Exorcist | 1 · 2 · 3 | 1,322 · 2,296 · 3,277 | 294 · 505 · 717 | 109 · 197 · 284 | 193 · 347 · 503 | 194 · 349 · 505 | 194 · 369 · 533 | 281 · 505 · 732 |

Offense holds SB1 (×1.80, ×2.61); HP and MP grow ×1.72–1.73 and ×2.45–2.47 (their flat base), which is why skill MP takes
×1.7 and ×2.4 and the healing scale its divisor. The cross-wielders' other channel reads her stat with that weapon's
Might (§4.4).

## 5. Party comps (R3-7)

**The owner** (round 3): "I would normally swap both classes at the same time the Brawler with a spellblade, or the
spellblade with the paladin, that way I'll make my parties balanced." His two swaps are this section's spine, in Tier 2
here and in Tier 3 in [§6.8](#68-tier-3-comps-t2c93); Tier 1-like, all-pure, all-hybrid and support-heavy comps sit beside
them. **Measured** numbers are balance's round 2 (T2B34); **analytic** ones are this doc's, for balance to re-measure.

### 5.1 Party value: measured (T2B21) and the seat model (T2C56, T2C93)

| Term | On the harness (T2B21) |
|---|---|
| **Units: BT** | An on-curve Brawler's damage **a round** at the same tier, level and kind of fight |
| **D**, her damage | Her damage a round of the fight |
| **S**, what her statuses add | What the **other four lose** when her statuses, wards, mends and keeper twist are switched off |
| **H**, her sustain | On the stress check ([§5.6](#56-the-stress-check-t2b23)) |
| **A class's gain** | The party's damage a round with her in her parent's seat, minus with her parent, over her parent's V |
| **Weights** | Regular fights 2, sub-bosses 1, bosses 1 (D266) |

**The seat model** (this round's analytic party value): **a comp's value is the sum of its members' seat values, each
her Tier 1 parent's measured D + S × (1 + her gain at Lv 50)**; a Tier 3 member her Tier 2 parent's seat value × (1 +
her Tier 3 gain). Gains are balance's measured ones for the sixteen kept classes and this doc's analytic ones for the
four pure variants and the two reshaped crosses (§4.4, §4.5) and the twenty-two Tier 3 classes (§6). **Why this model,
not round 2's sum of D + S:** it reads a member through what her seat does to the party, so a pure seat's overkill (her
damage +9.6%, her seat +5.2%: the Berserker's) is in it. **Checked against the measured comps:** C1 +3.9% (measured
+4.4%), C2 +4.2% (+5.4%), C4 +4.4% (+5.7%), C4b +6.1% (+6.7%), C8 +3.5% (+3.7%), C9 +2.7% (+4.0%): about a point under,
in the same order.

**R2-11's band, as balance reads it** (T2B22): on curve at Tier 2 Lv 10, 30 and 50, each damage and support class's gain
within ±5 points of their mean gain at that level (round 2's twelve: +7.0 · +3.9 · +3.2%); the healers on the stress
check. Round 3 adds the four pure variants to the reading (sixteen damage and support classes) and Tier 3's own band
(T2C92).

### 5.2 The owner's swaps

**C3. A Brawler with a Spellblade** (Party 1): the Brawler to her **Spellfist**, the Arms Spellblade to her
**Bladedancer**. The Spellblade's Tome moves to the Brawler's line; the party's channel mix stays.
| Member | Weapons | Damage (BT · share) | Support (BT) | Healing (% HP a round) | Seat value |
|---|---|---|---|---|---|
| **Spellfist** | Greatsword, Katana, Fire | 1.07 · 25% | — | — | 1.05 |
| Archmage | Fire, Blizzard, Thunder | 1.21 · 28% | — | — | 1.18 |
| **Bladedancer** | Katana, Axe, Bow | 0.93 · 21% | — | — | 0.92 |
| Invoker | Dark, Blizzard, Bow | 0.77 · 18% | 0.01 | — | 0.77 |
| Guardian | Lance, Greatsword, Light | 0.37 · 9% | 0.24 | 20% | 0.62 |
| **Party** | **GS 2** · Axe 1 · Lance 1 · **Bow 2** · **Katana 2** · **Fire 2** · **Ice 2** · Thunder 1 · Light 1 · Dark 1 | **4.35** | **0.25 (5%)** | **20%** | **4.53** |

Read: **+3.3% over Party 1, level with C1 (−0.6%)**: the swap balances as the owner described. The Bladedancer is C1's
Blademaster without her Thunder; the Spellfist carries a Fire to every boss on ATK. All ten kinds held; the Lance,
Thunder, Light and Dark in one hand each.

**C3b. Its mirror: a Sorcerer with a Tome Spellblade** (Party 2): the Sorcerer to her **Battlemage**, the Tome
Spellblade to her **Spellweaver**.

| Member | Weapons | Damage (BT · share) | Support (BT) | Healing | Seat value |
|---|---|---|---|---|---|
| Berserker | Greatsword, Axe, Lance | 1.14 · 25% | — | — | 1.09 |
| **Battlemage** | Fire, Blizzard, Katana | 1.23 · 27% | — | — | 1.11 |
| **Spellweaver** | Thunder, Blizzard, Dark | 0.99 · 22% | — | — | 0.97 |
| Warlord | Bow, Axe, Dark | 0.78 · 17% | 0.10 | — | 0.89 |
| Bishop | Light, Fire, Lance | 0.35 · 8% | 0.36 | 20% | 0.71 |
| **Party** | GS 1 · **Axe 2** · **Lance 2** · Bow 1 · Katana 1 · **Fire 2** · **Ice 2** · Thunder 1 · Light 1 · **Dark 2** | **4.49** | **0.46 (9%)** | **20%** | **4.77** |

Read: **+2.6% over Party 2, 1.6% under C2**: the Tome Spellblade's Armor Break leaves with her (no one else in Party 2
carries it), which the Spellweaver's hand only partly replaces; the Battlemage's Katana brings the Katana the Spellweaver
drops.

**C4. A Spellblade with the Paladin** (Party 1, measured in round 2): the Arms Spellblade to her **Sentinel**, the
Paladin to her **Templar**.

| Member | Weapons | Damage (BT · share) | Support (BT) | Healing | Seat value |
|---|---|---|---|---|---|
| Berserker | Greatsword, Axe, Lance | 1.14 · 27% | — | — | 1.09 |
| Archmage | Fire, Blizzard, Thunder | 1.21 · 28% | — | — | 1.18 |
| **Sentinel** | Katana, Greatsword, Light | 0.72 · 17% | 0.14 | 3.7% | 0.90 |
| Invoker | Dark, Blizzard, Bow | 0.77 · 18% | 0.01 | — | 0.77 |
| **Templar** | Lance, Greatsword, Light | 0.42 · 10% | 0.23 | 14% | 0.64 |
| **Party** | **GS 3** · Axe 1 · **Lance 2** · Bow 1 · Katana 1 · Fire 1 · **Ice 2** · Thunder 1 · **Light 2** · Dark 1 | **4.26** | **0.38 (8%)** | **17.7%** | **4.58** |

Read: **measured +4.3 · +5.3 · +5.7% over Party 1** (analytic +4.4%), and 99.7% of fights won at ×2.6, the second-safest
comp: the battle healer's lost healing is about the Sentinel's ward.

**C4b. Its mirror on Party 2** (measured): Berserker, Archmage, **Enchanter** (Light, Blizzard, Katana), Warlord,
**Exorcist**. **Measured +7.4 · +5.6 · +6.7%** (analytic +6.1%); support 0.69 BT (14%), the most of any comp; healing
17.7% of the party's HP a round.

**C5. Both swaps on one party** (Party 1): the Brawler to her Spellfist and the Arms Spellblade to her Bladedancer, the
Tome Summoner to her **Shaman** and the Paladin to her **Templar** (the support beside the battle healer, the Summoner's
way).

| Member | Weapons | Damage (BT · share) | Support (BT) | Healing | Seat value |
|---|---|---|---|---|---|
| **Spellfist** | Greatsword, Katana, Fire | 1.07 · 25% | — | — | 1.05 |
| Archmage | Fire, Blizzard, Thunder | 1.21 · 28% | — | — | 1.18 |
| **Bladedancer** | Katana, Axe, Bow | 0.93 · 21% | — | — | 0.92 |
| **Shaman** | Dark, Blizzard, Bow | 0.70 · 16% | 0.03; Enfeeble on every foe | 5.5% | 0.76 |
| **Templar** | Lance, Greatsword, Light | 0.42 · 10% | 0.23 | 14% | 0.64 |
| **Party** | **GS 2** · Axe 1 · Lance 1 · **Bow 2** · **Katana 2** · **Fire 2** · **Ice 2** · Thunder 1 · Light 1 · Dark 1 | **4.33** | **0.26 (6%)** | **19.5%** | **4.55** |

Read: **+3.6% over Party 1, level with C1**: four of five changed, the party's value where it was. The Shaman's mend and
Enfeeble cover the Templar's lost healing.

### 5.3 Tier 1-like, all-pure, all-hybrid and support-heavy

**C1 and C2, Tier 1-like** (every member her parent's keeper, measured): C1 Berserker, Archmage, Blademaster, Invoker,
Guardian **+5.5 · +3.9 · +4.4%** over Party 1; C2 Berserker, Archmage, Runeblade, Warlord, Bishop **+7.7 · +1.7 · +5.4%**
over Party 2. Each holds its Tier 1 party's ten kinds, five in two hands.

**C6. All pure** (Party 1): every damage member one channel.

| Member | Weapons | Damage (BT · share) | Support (BT) | Healing | Seat value |
|---|---|---|---|---|---|
| Berserker | Greatsword, Axe, Lance | 1.14 · 26% | — | — | 1.09 |
| Archmage | Fire, Blizzard, Thunder | 1.21 · 27% | — | — | 1.18 |
| **Bladedancer** | Katana, Axe, Bow | 0.93 · 21% | — | — | 0.92 |
| **Animist** | Dark, Blizzard, Thunder | 0.81 · 18% | — | — | 0.80 |
| Guardian | Lance, Greatsword, Light | 0.37 · 8% | 0.24 | 20% | 0.62 |
| **Party** | **GS 2** · **Axe 2** · **Lance 2** · Bow 1 · Katana 1 · Fire 1 · **Ice 2** · **Thunder 2** · Light 1 · Dark 1 | **4.46** | **0.24 (5%)** | **20%** | **4.60** |

Read: **+4.8% over Party 1**, the most damage of the Party 1 comps and the least support (5%, the Guardian's alone). Two
channels split cleanly: three Arms classes and two Tome classes; a Rift ward shuts out two of five, as in Tier 1.
**C6b on Party 2** (Berserker, Archmage, **Spellweaver**, **Marshal**, Bishop): +3.0% over Party 2, every kind held.

**C7. All hybrid** (round 2's C3, the crosses reshaped): Spellfist, Battlemage, Blademaster, Invoker, Guardian.
Analytic **+1.4% over Party 1**, the lowest at Lv 50 because both crosses' Lv 50 cells are their lowest (+1% and −1%);
round 2 measured it +9.3 · +8.0 · +5.2% on the Scatter-twin presets. Every kind held, the Katana in three hands.

**The support-heavy comps** (measured in round 2, unchanged by round 3): **C8** Berserker, Archmage, Sentinel, Shaman,
Guardian (round 2's C6) **+5.1 · +3.1 · +3.7%**, the safest; **C9** Berserker, Archmage, Runeblade, Druid, Bishop (round
2's C5) **+7.9 · +2.3 · +4.0%**; **C10** every member an expander, Spellfist, Battlemage, Sentinel, Shaman, Templar
(round 2's C7, measured +7.4 · +8.5 · +5.7% on the old presets): analytic +1.5%, and **the one comp that drops kinds**
(the Axe and Thunder) with the one-foe crosses: the party hint names them.

### 5.4 The comps side by side

| Comp | Members | Kinds in two hands · missing | Damage · support (share) | Healing | **Analytic, Lv 50: against its Tier 1 party · against C1 or C2** | Measured, Lv 10 · 30 · 50 (round 2) |
|---|---|---|---|---|---|---|
| **Tier 1 Party 1** | Brawler, Sorcerer, Arms Spellblade, Tome Summoner, Paladin | 5 · — | 4.11 · 0.28 (6%) | 20% | 4.39 (the reference) | the reference |
| **Tier 1 Party 2** | Brawler, Sorcerer, Tome Spellblade, Arms Summoner, Cleric | 5 · — | 4.10 · 0.55 (12%) | 20% | 4.65 (the reference) | the reference |
| **C1** Party 1's keepers | Berserker, Archmage, Blademaster, Invoker, Guardian | 5 · — | 4.38 · 0.26 (6%) | 20% | **+3.9%** | **+5.5 · +3.9 · +4.4%** |
| **C2** Party 2's keepers | Berserker, Archmage, Runeblade, Warlord, Bishop | 5 · — | 4.40 · 0.51 (10%) | 20% | **+4.2%** | **+7.7 · +1.7 · +5.4%** |
| **C3** A Brawler with a Spellblade | Spellfist, Archmage, Bladedancer, Invoker, Guardian | 5 · — | 4.35 · 0.25 (5%) | 20% | **+3.3%** · −0.6% vs C1 | — |
| **C3b** A Sorcerer with a Tome Spellblade | Berserker, Battlemage, Spellweaver, Warlord, Bishop | 5 · — | 4.49 · 0.46 (9%) | 20% | **+2.6%** · −1.6% vs C2 | — |
| **C4** A Spellblade with the Paladin | Berserker, Archmage, Sentinel, Invoker, Templar | 4 · — | 4.26 · 0.38 (8%) | 17.7% | **+4.4%** · +0.5% vs C1 | **+4.3 · +5.3 · +5.7%** |
| **C4b** A Tome Spellblade with the Cleric | Berserker, Archmage, Enchanter, Warlord, Exorcist | 5 · — | 4.23 · 0.69 (14%) | 17.7% | **+6.1%** · +1.8% vs C2 | **+7.4 · +5.6 · +6.7%** |
| **C5** Both swaps on one party | Spellfist, Archmage, Bladedancer, Shaman, Templar | 5 · — | 4.33 · 0.26 (6%) | 19.5% | **+3.6%** · −0.3% vs C1 | — |
| **C6** All pure (Party 1) | Berserker, Archmage, Bladedancer, Animist, Guardian | 5 · — | 4.46 · 0.24 (5%) | 20% | **+4.8%** · +0.9% vs C1 | — |
| **C6b** All pure (Party 2) | Berserker, Archmage, Spellweaver, Marshal, Bishop | 5 · — | 4.55 · 0.36 (7%) | 20% | **+3.0%** · −1.1% vs C2 | — |
| **C7** All hybrid | Spellfist, Battlemage, Blademaster, Invoker, Guardian | 4 · — | 4.33 · 0.26 (6%) | 20% | **+1.4%** · −2.5% vs C1 | +9.3 · +8.0 · +5.2% (round 2's presets) |
| **C8** Both hybrids to support | Berserker, Archmage, Sentinel, Shaman, Guardian | 4 · — | 4.14 · 0.41 (9%) | 29.2% | **+3.5%** · −0.4% vs C1 | **+5.1 · +3.1 · +3.7%** |
| **C9** A Summoner to support | Berserker, Archmage, Runeblade, Druid, Bishop | 5 · — | 4.27 · 0.52 (11%) | 25.5% | **+2.7%** · −1.4% vs C2 | **+7.9 · +2.3 · +4.0%** |
| **C10** Every member an expander | Spellfist, Battlemage, Sentinel, Shaman, Templar | 5 · Axe, Thunder | 4.14 · 0.40 (9%) | 23.2% | **+1.5%** · −2.3% vs C1 | +7.4 · +8.5 · +5.7% (round 2's presets) |

- **Every Tier 2 comp sits +1.4 to +6.1% over its Tier 1 party at Lv 50** (analytic; the model reads about a point under
  the harness), **within ±5 points of the comps' mean (+3.5%)**: R2-11's ask, the owner's swaps included.
- **The owner's swaps are level with the comps they come from:** C3 and C5 within 0.6% of C1, C4 +0.5%; C3b 1.6% under
  C2 and C4b 1.8% over. Balancing pairs, as he said.
- **The comps that pair both crosses** (C7, C10) are the lowest at Lv 50, by the crosses' Lv 50 cells; they are the first
  reading balance re-measures.
- **Healing:** a keeper healer 20% of the party's HP a round, a battle healer 14%, a Spellblade support's Barrier 3.7%, a
  Summoner support's mend 5.5% (§4.7, §4.8): the support-heavy comps hold 23–29%.

### 5.5 Each class against her parent (the guardrail)

| Class (parent) | Gain, Lv 10 · 30 · 50 | Source | D + S at Lv 50 (her parent's) | Her knob |
|---|---|---|---|---|
| Berserker (Brawler) | +5.6 · +2.0 · +5.2% | Measured (T2B26) | 1.14 + 0 (1.04) | Momentum +6% |
| **Spellfist** (Brawler) | **about +9 · +6.5 · +1%** | **Analytic** (round 2: +6.5 · +4.5 · +4.3) | 1.07 + 0 | **Pinpoint's step**, then her hand |
| Archmage (Sorcerer) | +5.8 · +3.4 · +5.1% | Measured | 1.21 + 0 (1.12) | Momentum |
| **Battlemage** (Sorcerer) | **about +9.5 · +8 · −1%** | **Analytic** (round 2: +10.9 · +8.3 · −1.8) | 1.23 + 0 | **Pinpoint's step**, then her hand |
| Blademaster (Arms Spellblade) | +9.0 · +4.5 · +3.6% | Measured (T2B28) | 0.89 + 0.01 (0.85 + 0.02) | Pierce, hands +0.03 |
| Sentinel (Arms Spellblade) | −2.4 · +10.9 · +2.9% | Measured (T2B24, T2B25) | 0.72 + 0.14 | Topped up; ×0.95 |
| **Bladedancer** (Arms Spellblade) | **about +3.6 · — · +5.3%** | **Analytic** | 0.93 + 0 | **Her second hand 0.32** |
| Runeblade (Tome Spellblade) | +6.8 · +2.3 · +2.8% | Measured | 0.92 + 0.05 (0.86 + 0.09) | Pierce, hands +0.03 |
| Enchanter (Tome Spellblade) | +7.0 · +2.5 · +6.6% | Measured | 0.69 + 0.23 | Topped up; ×0.8 |
| **Spellweaver** (Tome Spellblade) | **about +8.3 · — · +2.0%** | **Analytic** | 0.99 + 0 | **Her second hand 0.41** |
| Warlord (Arms Summoner) | +8.6 · +2.0 · +6.8% | Measured (T2B29) | 0.78 + 0.10 (0.73 + 0.10) | Hands +0.03 |
| Druid (Arms Summoner) | +7.1 · +2.3 · −1.5% | Measured | 0.65 + 0.11 | Topped up; ×0.95 |
| **Marshal** (Arms Summoner) | **about +10.1 · — · +1.2%** | **Analytic** | 0.86 + 0 | **Her second hand 0.40** |
| Invoker (Tome Summoner) | +8.6 · +3.6 · +3.0% | Measured | 0.77 + 0.01 (0.73 + 0.02) | Hands +0.03 |
| Shaman (Tome Summoner) | +10.4 · +0.8 · +1.2% | Measured | 0.70 + 0.03 | Topped up; ×1 |
| **Animist** (Tome Summoner) | **about +4.4 · — · +6.3%** | **Analytic** | 0.81 + 0 | **Her second hand 0.37** |
| **The band** (round 2's twelve) | **+7.0 · +3.9 · +3.2% ± 5** | | | |
| Guardian · Templar (Paladin) | +5.5 · 0 · +1.1% · +12.1 · +9.7 · +5.7% | Measured; read on the stress check | 0.37 + 0.24 · 0.42 + 0.23 | Kept (T2B30, T2B31) |
| Bishop · Exorcist (Cleric) | +15.5 · 0 · +0.1% · +15.9 · +6.9 · +7.3% | The same | 0.35 + 0.36 · 0.41 + 0.36 | Kept |

- **Every analytic cell sits inside round 2's band** at the levels it reads (Lv 30 for the pure variants lies between
  their Lv 10 and Lv 50). **The cells nearest an edge:** the Battlemage at Lv 50 (−1%, the edge −1.8%), the Spellfist at
  Lv 10 (+9, the edge +12) and the Marshal at Lv 10 (+10.1). Balance re-reads the sixteen with the four new classes in
  the mean.
- **Round 2's two misses stand** (the Sentinel at Lv 10 and 30, T2B22), to re-read with the class lines.
- **Mirrors:** the Spellweaver and the Marshal lead their mirrors at Lv 10 and trail at Lv 50, for the reason round 2's
  crosses did (each replaces a status no one else in Party 2 carries); T2B16 reads them.

### 5.6 The stress check (T2B23)

Balance's attrition check stands as measured in round 2 (balance §4.8): each region's elite, its boss's first wave and
its boss **as one fight**, the foes' offense ×2 to ×4, Tier 2 Lv 30 and 50 and Tier 3 Lv 50.

| What it found (Tier 2 Lv 50) | |
|---|---|
| Where a healer matters | At ×2.6 she starts to matter, at ×4 she decides (Party 1 99% won with the Paladin, 60% with her sustain off) |
| The healers | **The battle healer on curve, the keeper from ×3.2:** Guardian 91.9 · 67.5% of fights won at ×3.2 · ×4, Templar 89.7 · 63.4%; Bishop 85.0 · 56.9%, Exorcist 77.5 · 51.9% |
| The supports | Every support's party safer than her keeper's: with the healer down 70–85% won where the keeper's wins 51–66% |
| A party with no healer | Two supports carry it through ×2.6; a keeper healer's party stays ahead at ×4 (T2B39) |

**Round 3 adds to the check** (balance's to run): **the four pure variants carry no sustain**, so a party that swaps a
support for a pure variant (C3 for C8) is the less safe one, as a keeper's is; **the Tier 3 healers** (Bastion and
Cardinal with Overflow against Inquisitor and Hierophant at ×0.7 power) and **the Archdruid's and Soulcaller's two mends
a pair** (§6.4) are read at Tier 3 Lv 50.

**Is any variant useless? No**, measured for the sixteen (balance §4.8); for the four new classes, analytic:

| Siblings | Where each is the better pick |
|---|---|
| Berserker · Spellfist | The Berserker on long fights and crowds (Momentum, her Axe); the Spellfist on bosses and sub-bosses (Pinpoint, every act one foe), and she adds an element |
| Archmage · Battlemage | The Battlemage at Lv 10 and 30; the Archmage at Lv 50; the Battlemage answers an Iron ward |
| Blademaster · Sentinel · **Bladedancer** | The Blademaster on curve at Lv 10 and 50; the Sentinel at Lv 30 and under attrition; **the Bladedancer where her party already carries Armor Break** (a Paladin, a Guardian) and beside a Brave-and-Faith ward: every hit of hers is physical |
| Runeblade · Enchanter · **Spellweaver** | Level at Lv 10 and 30; the Enchanter at Lv 50 and under attrition; **the Spellweaver beside a Mind Break carrier** (the Cleric's Lance) and at Lv 10 |
| Warlord · Druid · **Marshal** | The Warlord on curve at Lv 50; the Druid under attrition; **the Marshal at Lv 10 and on the Iron front** (Iron wards elements; every hit of hers is physical) |
| Invoker · Shaman · **Animist** | The Shaman at Lv 10 and under attrition; the Invoker at Lv 30; **the Animist at Lv 50** (+6.3%) |
| Guardian · Templar; Bishop · Exorcist | The battle healer on curve, the keeper from ×3.2 |

### 5.7 Kinds: the 144 mixes (T2C94)

The owner's two parties, each member any child of her Tier 1 class (Party 1: 2 × 2 × 3 × 3 × 2 = 72 mixes; Party 2 the
same), counted on the presets (§4.13):

| | Mixes holding all ten | The kinds a mix can drop (mixes) |
|---|---|---|
| Party 1 | **36 of 72** | Bow 16 (the Animist without the Bladedancer), Thunder 16 (the Battlemage with neither the Blademaster nor the Animist), Axe 12 (the Spellfist with the Sentinel) |
| Party 2 | **44 of 72** | Dark 16 (the Marshal without the Spellweaver), Thunder 12 (the Battlemage with the Enchanter), Katana 4 (the Spellweaver beside the Berserker and the Archmage, no Marshal) |
| Round 2 (sixteen, 64 mixes) | 56 of 64 | Thunder 8 |
| Tier 3 (every Tier 3 descendant, 162 mixes a party) | **94 and 98 of 162** in hand; **106 and 118** with Arsenal's partner kinds | The same kinds |

- **Every comp the owner names holds all ten** (C1–C9); C10 drops the Axe and Thunder.
- **The party hint** (T2C94): a party that drops a kind names an open class of a member whose preset holds it ("No Bow:
  the Invoker's preset holds one"); gear's two-kind weapons add their partners on top (gear's coverage, T2G27).

## 6. Tier 3 in full

### 6.1 Tier 3 is a promotion: the twenty-two (T2C65, T2C83–T2C88)

**The owner:** "there always should be an actual class promotion and a new name." Every Tier 2 class promotes into one
Tier 3 class; the Spellfist and the Battlemage into two. A Tier 3 class keeps her Tier 2 parent's whole kit (slots,
hands, lean, act, trees, class line, statuses, her parent's rule) and adds **one rule, from Class Rank 1**; at Class Rank
50 she is **crowned** (§6.2).

| Class | Parent | Line | Slots · reads | Act · hand · MP | **Her Tier 3 rule** (on top of her parent's) | Statuses | Healer | LB scale | What she's for |
|---|---|---|---|---|---|---|---|---|---|
| **Ravager** | Berserker | Pure physical | 3 Arms · ATK | One act · ×1 · ×1 | **Juggernaut:** an unbroken foe takes ×0.6 from her hits, not ×0.5 (round 2's Warrior mastery) | None | No | ×0.95 | Momentum and Juggernaut: nothing slows her |
| **Spellhammer** | Spellfist | Kept | 2 Arms + 1 Tome · ATK | One act · ×1 · ×1 | **Pinpoint doubled:** +4% a depth (×1.2 at depth 5) | None | No | ×0.95 | The Spellfist with a higher ceiling |
| **Gladiator** | Spellfist | Pure, varied | **3 Arms** · ATK | One act · **×1.05** · ×1 | **Arsenal:** two two-kind weapons in her slots, every Arm in reach (§6.3) | None | No | ×0.95 | Pure physical, all five physical kinds: weak hits and Breaks on every foe |
| **Astromancer** | Archmage | Pure magic | 3 Tomes · M.ATK | One act · ×1 · ×1 | **Resonance:** her capstones and her class capstone strike again at 30%; the echo chips nothing (round 2's Mage mastery) | None | No | ×0.95 | Momentum and an echo: the party's top damage |
| **Spellknight** | Battlemage | Kept | 2 Tomes + 1 Arm · M.ATK | One act · ×1.25 · ×1 | **Pinpoint doubled** | None | No | ×0.95 | The Battlemage with a higher ceiling |
| **Thaumaturge** | Battlemage | Pure, varied | **3 Tomes** · M.ATK | One act · **×1.05** · ×1 | **Arsenal:** every element in reach | None | No | ×0.95 | Pure magic, all five elements |
| **Bladelord** | Blademaster | Keeper | 2 Arms + 1 Tome · ATK, M.ATK | Pair · 0.75 + 0.47 · ×0.5 a half | **Spellbind:** both halves weak on one foe, the act +20% (round 2's Spellblade mastery) | A path | No | ×0.95 | The Break engine, both channels at once |
| **Herald** | Sentinel | Support | 2 Arms + 1 Tome · ATK, M.ATK | Pair · **0.71 + 0.45** · ×0.5 a half | **Her keeper sibling's twist:** her familiar on both halves, piercing; hands +0.03 a half | Support | No | ×0.95 | Offense support who hits harder |
| **Dervish** | Bladedancer | Pure physical | 3 Arms (2 + 1) · ATK | Pair · 0.72 + 0.32 · ×0.5 a half | **Momentum** | None | No | ×0.95 | Pure physical multi-hit with a self-buff |
| **Runelord** | Runeblade | Keeper | 2 Tomes + 1 Arm · M.ATK, ATK | Pair · 0.75 + 0.51 · ×0.5 a half | **Spellbind** | A path | No | ×0.95 | The Bladelord, magic-led |
| **Oracle** | Enchanter | Support | 2 Tomes + 1 Arm · M.ATK, ATK | Pair · **0.61 + 0.41** · ×0.5 a half | **The Herald's** | Support | No | ×0.95 | The Herald, magic-led |
| **Starweaver** | Spellweaver | Pure magic | 3 Tomes (2 + 1) · M.ATK | Pair · 0.72 + 0.41 · ×0.5 a half | **Momentum** | None | No | ×0.95 | Pure elemental multi-hit with a self-buff |
| **Overlord** | Warlord | Keeper | 2 Arms + 1 Tome · ATK, M.ATK | Pair · 0.60 + 0.49 · ×0.5 a half | **Menagerie:** her lingering summons stay two pairs, a farewell at each (round 2's Summoner mastery) | A path | No | ×0.95 | Farewells on every foe, twice as long |
| **Archdruid** | Druid | Support | 2 Arms + 1 Tome · ATK, M.ATK | Pair · **0.57 + 0.47** · ×0.5 a half | **Her keeper sibling's twist:** both summons linger, **both farewells mend**; hands +0.03 a half | Support | No | ×0.95 | Field support, two mends a pair |
| **Imperator** | Marshal | Pure physical | 3 Arms (2 + 1) · ATK | Pair · 0.57 + 0.40 · ×0.5 a half | **Momentum** | None | No | ×0.95 | Pure physical area with a self-buff |
| **Hierarch** | Invoker | Keeper | 2 Tomes + 1 Arm · M.ATK, ATK | Pair · 0.60 + 0.53 · ×0.5 a half | **Menagerie** | A path | No | ×0.95 | The Overlord, magic-led |
| **Soulcaller** | Shaman | Support | 2 Tomes + 1 Arm · M.ATK, ATK | Pair · **0.60 + 0.53** · ×0.5 a half | **The Archdruid's** | Support | No | ×0.95 | The Archdruid, magic-led |
| **Mythlord** | Animist | Pure magic | 3 Tomes (2 + 1) · M.ATK | Pair · 0.57 + 0.37 · ×0.5 a half | **Momentum** | None | No | ×0.95 | Pure elemental area with a self-buff |
| **Bastion** | Guardian | Keeper | 2 Arms + 1 Tome · ATK; heals from ATK | One act · ×0.5 · ×0.6 | **Overflow:** a mend's healing past max HP becomes a Barrier, up to 10% of max HP (round 2's Healer mastery) | Widely, +1 | **Yes** | ×0.8 | The safest healer |
| **Inquisitor** | Templar | Battle | 2 Arms + 1 Tome · ATK; heals from ATK | One act · **×0.7** · ×0.7 | **A deeper battle healer:** power ×0.7 (from ×0.6); mends and Barriers ×0.7 kept | Widely | **Yes** | ×0.8 | The healer who hits hardest |
| **Cardinal** | Bishop | Keeper | 2 Tomes + 1 Arm · M.ATK; heals from M.ATK | One act · ×0.5 · ×0.6 | **Overflow** | Widely, +1 | **Yes** | ×0.8 | The Bastion, magic-led |
| **Hierophant** | Exorcist | Battle | 2 Tomes + 1 Arm · M.ATK; heals from M.ATK | One act · **×0.7** · ×0.7 | **The Inquisitor's** | Widely | **Yes** | ×0.8 | The Inquisitor, magic-led |

- **Twenty-two: R3-6's count** (T2C65): the Brawler's and the Sorcerer's lines three each, the hybrids' three each (one
  from each Tier 2 child), the healers' two each. **Lean, armor half, family, hall and Limit Break scale** are her Tier 1
  ancestor's, as in Tier 2.
- **Mirrors share their rule** as in Tier 2 (the Bladelord and the Runelord, the Herald and the Oracle…), except the
  Ravager and the Astromancer, who take their own family's mastery as round 2 drafted them.
- **One healer a party** is unchanged: the Bastion, the Inquisitor, the Cardinal and the Hierophant count.

### 6.2 What every Tier 3 class keeps and adds (T2C78–T2C82)

Round 2's Tier 3 had no promotion and four tier-wide features. Round 3 gives each a home or retires it:

| Round 2's Tier 3 feature | Round 3 | Why |
|---|---|---|
| **The crown** (T2C20, T2C21): at Class Rank 50 every held capstone plays 5.6 whole, +4 MP, one more stack; MP back's sixth step (6%) | **Kept on every Tier 3 class** (T2C79): her ceiling at Class Rank 50 | It is most of Tier 3's measured +17% and reads the same on every class; a promotion that crowned only some classes would need twenty-two prices |
| **Two lines held** (T2C19): two of a tree's three lines, each with its tip; Auto between them | **Kept on every Tier 3 class** (T2C80) | Tier 3's tree depth; balance never priced it (T2B20 left it out), so it moves no measured number |
| **The master slot** (T2C16): one crowned capstone outside her ten equipped | **Retired** (T2C81) | The crown already makes every held capstone 5.6; an eleventh slot re-equips one and adds a screen; the promotion is Tier 3's new piece |
| **The five masteries** (T2C22, T2C58): by hall family at Class Rank 50 | **Re-homed** (T2C82) as the Tier 3 rules of the lines that had them, from Class Rank 1 | Each was drafted and measured as a family's sharpening; on a keeper's line it is that line's promotion |

| Round 2's mastery (family) | Round 3: the Tier 3 rule of | Round 2's other carriers, now |
|---|---|---|
| **Juggernaut** (Warrior) | **Ravager** | The Spellfist's line: Pinpoint doubled (Spellhammer), Arsenal (Gladiator) |
| **Resonance** (Mage) | **Astromancer** | The Battlemage's line: the same as the Spellfist's |
| **Spellbind** (Spellblade) | **Bladelord, Runelord** | The supports: their keeper's twist (Herald, Oracle); the pures: Momentum (Dervish, Starweaver) |
| **Menagerie** (Summoner) | **Overlord, Hierarch** | The supports: their keeper's twist (Archdruid, Soulcaller); the pures: Momentum (Imperator, Mythlord) |
| **Overflow** (Healer) | **Bastion, Cardinal** | The battle healers: power ×0.7 (Inquisitor, Hierophant) |

**What a Tier 3 class is, in one line:** her Tier 2 parent + one rule (from Class Rank 1) + the crown (Class Rank 50) +
two lines held. **What never changes:** her slots' count and channels (but the Gladiator's and the Thaumaturge's), her
lean, her armor half, her trees, her hall, her Limit Break scale.

### 6.3 The Brawler's and the Sorcerer's lines (T2C83–T2C85)

**The owner:** "1 line remains for the pure physical … an actual class promotion and a new name … then, an additional
branch for the spellblade like variant where 1 remains as the one you authored in Tier 2 but with higher ceiling or
buffs, and then another one that pure phys dps weapons but more varied phys weapons"; the Sorcerer "same as Brawler".

| Tier 2 | Tier 3 | Her rule | What changes from her parent |
|---|---|---|---|
| Berserker | **Ravager** | Momentum + **Juggernaut** | Her hits on an unbroken foe ×0.6, not ×0.5: +20% on what she deals before a Break |
| Spellfist | **Spellhammer** | The cross + **Pinpoint +4% a depth** | The same kit and preset; her one-foe acts ×1.2 at depth 5 (×1.1 in Tier 2): "higher ceiling" |
| Spellfist | **Gladiator** | **Arsenal** | **Three Arms** (her Tome slot an Arm, so no cross), **two two-kind weapons**, hand ×1.05, no Pinpoint; the Brawler's Arms trees |
| Archmage | **Astromancer** | Momentum + **Resonance** | Her capstones echo at 30% |
| Battlemage | **Spellknight** | The cross + **Pinpoint +4% a depth** | The same kit and preset |
| Battlemage | **Thaumaturge** | **Arsenal** | **Three Tomes**, two two-kind weapons, hand ×1.05, no Pinpoint; the Sorcerer's Tome trees |

**"More varied physical weapons": Arsenal** (T2C85). Gear allows one two-kind weapon in a class's slots (T2G3); **the
Gladiator and the Thaumaturge may wear two**, so with three weapons she carries **all five kinds of her channel**:

| | Weapon 1 | Weapon 2 | Weapon 3 | Kinds | Shapes |
|---|---|---|---|---|---|
| **Gladiator** (preset) | Greatsword, **Evolved + Katana** | Axe, **Tempered + Bow** | Lance, Keen | **All five Arms** | Heavy, Sweep, Scatter |
| **Thaumaturge** (preset) | Fire, **Evolved + Light** | Blizzard, **Evolved + Dark** | Thunder, Keen | **All five elements** | Heavy, Sweep, Scatter |

- **What it is worth:** every Tier 2–3 foe is weak to at least one Arm and one element (the live dealer, `rpgWeakCounts`:
  regulars 1 + 2 or 2 + 1, sub-bosses and bosses 3), so **every foe has a weak kind in her hands**, against about 90% for
  a three-weapon class with one Dual. Her two-kind weapons hit weak at the Tempered or Evolved ×1.5 at G10, not the Keen
  ×1.7, so she trades a little on her best kinds for reach: about +3% of her damage on weak hits, and **every foe she
  touches chips**, so her party Breaks sooner. Her hand ×1.05 (the Spellfist's ×1 and +5%, the Battlemage's ×1.25 back
  to a pure class's) carries the rest: analytic gain over her parent **+5.4% (Gladiator) and +5.2% (Thaumaturge)** at
  Tier 3 Lv 50, before the crown.
- **Why this, not the alternatives** the owner's words allow: **a fourth slot** (+4.5% on her best hit, round 2's
  analytic, §4.4) would break three docs' slot counts (gear, Extra Stats' kind rows, the window's worn slots) for
  two classes; **a rule that rewards mixing shapes** (a stack for each act with a different weapon from her last) would
  add a third self-buff mechanic beside Momentum and Pinpoint and make Auto plan a rotation. Arsenal is one number in
  gear's cap, reads on her weapon tiles (two type chips), and is literally more physical weapons.
- **Her Suggested types** are gear's call (T2G28); the preset above is the one that reaches all five with Keen on the
  third.

### 6.4 The hybrids' lines (T2C86)

Each hybrid's three Tier 2 children promote one each, by one pattern:

| Tier 2 line | Tier 3 | Her rule | Analytic gain over her parent, Tier 3 Lv 50 |
|---|---|---|---|
| **Keeper** (Blademaster, Runeblade) | Bladelord, Runelord | **Spellbind** (round 2's): both halves weak on one foe, the act +20% | +5.1% |
| **Keeper** (Warlord, Invoker) | Overlord, Hierarch | **Menagerie** (round 2's): her lingering summons stay two pairs, a farewell at each | +3.4% |
| **Support** (Sentinel, Enchanter) | Herald, Oracle | **Her keeper sibling's twist:** the familiar on both halves, piercing; hands +0.03 a half | +3.2% |
| **Support** (Druid, Shaman) | Archdruid, Soulcaller | **Her keeper sibling's twist:** both summons linger, and **both farewells mend**; hands +0.03 a half | +4.9% (and twice the mend: 11% of the party's HP a round) |
| **Pure** (Bladedancer, Spellweaver) | Dervish, Starweaver | **Momentum** (the pure keepers'): +6% a stack, a stack a turn, three at most | +8.2% |
| **Pure** (Marshal, Animist) | Imperator, Mythlord | **Momentum** | +8.2% |

- **Why these:** a keeper's line sharpens again with its family's mastery, as drafted and measured (T2B37); a support
  borrows the trick her keeper sibling already has, so she deals more without carrying more status (the support level was
  round 2's largest error, T2B24, and stays as measured); a pure line takes the pure classes' self-buff, so **every pure
  line in the game has Momentum by Tier 3** except the Brawler's and Sorcerer's crosses, whose identity is Pinpoint and
  Arsenal.
- **No new mechanic:** every rule here is round 2's (Spellbind, Menagerie, the keepers' twists, Momentum).
- **Gains** are analytic (her damage step × the seat's pass-through: 0.55 a pure seat, 0.85 a hybrid's, round 2's
  measured ratios); the Herald's and Archdruid's from round 2's measured keepers' gains over their parents.

### 6.5 The healers' lines (T2C87)

| Tier 2 | Tier 3 | Her rule | On curve | Under attrition |
|---|---|---|---|---|
| Guardian, Bishop (one stack more) | **Bastion, Cardinal** | **Overflow** (round 2's): a mend past max HP becomes a Barrier, up to 10% of max HP | Her parent's (+0) | **Safer:** the overheal a keeper wastes becomes a ward |
| Templar, Exorcist (battle healers) | **Inquisitor, Hierophant** | **Power ×0.7** (from ×0.6); mends and Barriers ×0.7 kept, Rescue and the revive kept | **+10.8%, +8.9%** of her parent's value | Her parent's healing |

- **The trade widens both ways, as the owner asked of healers:** the keeper's line gains only sustain, the battle
  healer's only damage. Read on the stress check at Tier 3 Lv 50 (T2B23's bands: the keeper ahead in wins from ×3.2, the
  battle healer on curve).
- **Still one healer a party.**

### 6.6 Promotion and switching in Tier 3 (T2C89–T2C91)

**The Tier 3 Ascend is the Tier 3 promotion**, on the same sheet as Tier 2's (progression's T2W31, which assumed this
case): her page lists her Tier 3 options.

| Rule | |
|---|---|
| **Open on arrival** | **The Tier 3 children of every Tier 2 class she holds at Class Rank 50** (T2C89): one each, two for the Spellfist and the Battlemage. A full Tier 2 window asks three at Rank 50 (Class V), so **3 to 5** of the twenty-two at least (4 or 5 with a Spellfist or a Battlemage among them); an Uma with all twenty at 50 opens all twenty-two |
| **Held on arrival** | Every open Tier 3 class at Class Rank 1, with her parent's preset (the Gladiator's and the Thaumaturge's their own), line A and two lines held's defaults (A and B) |
| **Suggested** | The child of the Tier 2 class she fights as when she ascends; **for the Spellfist and the Battlemage the kept child** (Spellhammer, Spellknight); if that class isn't at Rank 50, the child of her family's own Rank 50 class with the most Class EXP; ties by the tree's order |
| **Switching, Class Rank** | As Tier 2's (T2C47): free outside fights, each class her own Class Rank, Ranks 1–10 one shared ladder; depths at Lv 10 · 16 · 22 · 29, Rank 50 and **the crown at Lv 36** |
| **The door** (T2C90) | **When any Tier 3 class she holds reaches Class Rank 20, every Tier 3 class of her Tier 1 line and of its reclass neighbours' lines opens** (the Tier 2 door lifted one tier: a Ravager at 20 opens the Brawler's, the Arms Spellblade's and the Arms Summoner's nine) |
| **Never** | Closes a class, costs anything, moves her calling, trade or template |

- **Assumed of progression** (it matches): the Tier 3 Ascend reads her Tier 2 world's Class Ranks before she leaves and
  writes her open set into the new world, fixed for the tier but for the door; Class V in Tier 2 still asks three Tier 2
  classes at Rank 50.
- **Kin and her Flourish:** her family in Tier 3 is the Tier 3 classes of her calling's own Tier 1 lines (Warrior and
  Mage 9, Spellblade and Summoner 6, Healer 4, §4.10).
- **The window's Class steps in Tier 3:** a Tier 3 class has a sibling only on the Spellfist's and the Battlemage's
  lines, so **Class IV reads two Tier 3 classes of one Tier 1 line** (three a line: the Ravager and the Gladiator, the
  Bladelord and the Herald); progression owns the step.
- **An Uma already in a Tier 3 world** when the Tier 3 classes ship becomes **her Tier 1 class's keeper's Tier 3 child**
  (a Brawler the Ravager, a Paladin the Bastion) at the same Class Rank; her open set is the Tier 3 children of the keepers
  of every Tier 1 class she holds there at Rank 50, and at least her own.

### 6.7 Tier 3's budget and band (T2C92)

**Round 2 measured the crowns and masteries at +17% at Tier 3 Lv 50** (T2B37: C8 4.98 BT a round against 4.27
uncrowned; C1 crowned 4.82). Round 3 keeps that budget:

| Piece | Round 2 | Round 3 |
|---|---|---|
| The crown at Class Rank 50 | Every class | **Every class** (unchanged) |
| A family's mastery at Class Rank 50 | Every class (five) | **One rule a class from Class Rank 1**: five lines take their mastery unchanged; the other seventeen rules sit in the masteries' range |
| Tier 3 at Lv 50 against the same comp in Tier 2's frame | +17% (measured) | **About +17%**: **T1, the keepers' line, is round 2's crowned C1 exactly** (each member the class whose mastery round 2 measured), 4.82 BT; the other comps project 4.78–5.26 (§6.8) |
| Tier 3 below Class Rank 50 | The sixteen as in Tier 2 | **Her parent + her rule:** about +5% of her value from Lv 1 to 35 |

- **The Tier 3 band** (T2C92): on curve at Tier 3 Lv 10, 30 and 50, **each Tier 3 damage and support class's gain over
  her Tier 2 parent** (both crowned at Lv 50) **within ±5 points of the eighteen's mean**; the four healer classes on the
  stress check. Analytic at Lv 50: **mean +5.3%, every one of the eighteen between +3.2 and +8.2%** (the pure lines'
  Momentum highest, the supports' twist and Menagerie lowest).
- **Balance re-sizes Tier 3's term** (T2B36) below Lv 40 by about +0.03 (the rules now work before the crown); its
  1.26 from Lv 40 stands.

### 6.8 Tier 3 comps (T2C93)

The owner's swaps one tier down (Tier 3 Lv 50, every class crowned; analytic seat model on top of the crown every class
shares; party damage projected from T1's measured 4.82 BT a round):

| Comp | Members | Kinds in two hands · missing | Damage · support (share) | Healing | **Against its Tier 2 comp · against T1** | Projected BT a round |
|---|---|---|---|---|---|---|
| **T1** The keepers' line (C1's): round 2's crowned C1 | Ravager, Astromancer, Bladelord, Hierarch, Bastion | 5 · — | 4.63 · 0.26 (5%) | 20% | **+3.6%** · — | **4.82 (measured)** |
| **T2** The keepers' line (C2's) | Ravager, Astromancer, Runelord, Overlord, Cardinal | 5 · — | 4.66 · 0.51 (10%) | 20% | **+3.6%** · +6.2% | 5.12 |
| **T3** A Brawler with a Spellblade (C3's) | Spellhammer, Astromancer, Dervish, Hierarch, Bastion | 5 · — | 4.66 · 0.25 (5%) | 20% | **+4.5%** · +0.2% | 4.83 |
| **T3g** The Gladiator beside the Bladelord | Gladiator, Astromancer, Bladelord, Hierarch, Bastion | 7 · — | 4.55 · 0.26 (5%) | 20% | **+3.5%** · −0.7% | 4.78 |
| **T3b** A Sorcerer with a Tome Spellblade (C3b's) | Ravager, Spellknight, Starweaver, Overlord, Cardinal | 5 · — | 4.80 · 0.46 (9%) | 20% | **+4.3%** · +5.2% | 5.07 |
| **T4** A Spellblade with the Paladin (C4's) | Ravager, Astromancer, Herald, Hierarch, Inquisitor | 4 · — | 4.56 · 0.38 (8%) | 17.7% | **+4.8%** · +1.6% | 4.90 |
| **T4b** A Tome Spellblade with the Cleric (C4b's) | Ravager, Astromancer, Oracle, Overlord, Hierophant | 5 · — | 4.55 · 0.69 (13%) | 17.7% | **+4.6%** · +9.1% | 5.26 |
| **T6** All pure, every kind | Gladiator, Thaumaturge, Dervish, Mythlord, Bastion | 9 · — | 4.64 · 0.24 (5%) | 20% | **+3.1%** (from C6) · +0.3% | 4.84 |
| **T8** A Tier 3 mix (round 2's C8's line) | Ravager, Spellknight, Bladelord, Soulcaller, Cardinal | 5 · — | 4.58 · 0.40 (8%) | 31% | — · +0.5% | 4.84 (round 2's C8 measured 4.98) |

- **Every Tier 3 comp sits +3.1 to +4.8% over its Tier 2 comp** (on top of the crown), so **the owner's swaps balance in
  Tier 3 as in Tier 2**: T3 and T3g within 0.7% of T1, T4 +1.6%.
- **The Gladiator's way** (T3g): when the Brawler's line goes pure physical, her Spellblade stays the keeper (both
  channels), the swap read the other way round; **T6, all pure**, holds **nine kinds in two hands** with Arsenal's
  partners.
- **T8** (round 2's measured C8, crowned, 4.98) changes two rules: the Spellknight's Pinpoint for the Battlemage's
  Resonance and the Soulcaller's twist for the Shaman's Menagerie; analytic, it reads 3% under C8's measure.

**T6. All pure, every kind** (Tier 3 Lv 50):

| Member | Weapons | Damage (BT · share) | Support | Healing | Seat value |
|---|---|---|---|---|---|
| **Gladiator** | Greatsword, Axe, Lance (+ Katana, Bow) | 1.15 · 25% | — | — | 1.11 |
| **Thaumaturge** | Fire, Blizzard, Thunder (+ Light, Dark) | 1.21 · 26% | — | — | 1.17 |
| **Dervish** | Katana, Axe, Bow | 1.02 · 22% | — | — | 0.99 |
| **Mythlord** | Dark, Blizzard, Thunder | 0.89 · 19% | — | — | 0.86 |
| Bastion | Lance, Greatsword, Light | 0.37 · 8% | 0.24 | 20% | 0.62 |
| **Party** | **GS 2** · **Axe 2** · **Lance 2** · **Bow 2** · **Katana 2** · Fire 1 · **Ice 2** · **Thunder 2** · **Light 2** · **Dark 2** | **4.64** | **0.24 (5%)** | **20%** | **4.74** |

### 6.9 Counts by tier

| | Tier 1 | Tier 2 | Tier 3 |
|---|---|---|---|
| Classes in the world | 5 Tier 0 + 8 Tier 1 | **20** | **22** |
| Open to an Uma on arrival | Every Tier 0 | **6–20** (Class V: at least 6) | **3–22** (Class V: at least 3) |
| Rules (mirrors share) | — | 10 | 10 Tier 2 rules carried + **11 Tier 3 rules** (Juggernaut, Resonance, Pinpoint doubled, Arsenal, Spellbind, Menagerie, the two keeper twists, Momentum, Overflow, power ×0.7) |
| New mechanics | — | Momentum, the cross, the keepers' twists, the support level, the battle healer, **Pinpoint, the pure pair** | **Arsenal** (the rest are round 2's) |
| Status-free classes | Brawler, Sorcerer | 8 | 10 |
| Trees she uses | 3 | 3 + her class line | 3 + her class line |
| Nodes a weapon tree | 8 | 14 (+ ★ tip on her lead tree) | 14; crowns are a state |
| Lines held a tree | 1 | 1 | 2 |
| Skills held · equipped | 15 · 3 → 7 | 18 · 3 → 10 | 27 · 10 |
| Class lines | — | **12** (36 names; 60 nodes) | Her Tier 2 parent's, crowned |
| Nodes across the catalog | 560 | 560 + 210 (C) + 210 (Break tips) + 60 class-line nodes = **1,040** | The same |
| New names | — | 20 classes, Momentum, Pinpoint, Squall, Legion, Thousand Cuts, Onslaught (and round 1's line words) | **22 classes, Arsenal** |

## 7. Provides and assumes

| Doc | This doc provides (round 3) | This doc assumes |
|---|---|---|
| **balance.md (T2B)** | **What to measure next** (R3-8), on the harness fork at Tier 2 Lv 10 · 30 · 50 and Tier 3 Lv 10 · 30 · 50, 16 seeds: (1) **the four pure variants** (the pure pair: lead from her first two weapons, second from her third, every hit on her stat; hands 0.72 + 0.32, 0.72 + 0.41, 0.57 + 0.40, 0.57 + 0.37; no status, her Light/Dark-side line A as damage at her parent's pure-power factor; presets §4.13), in her parent's seat; (2) **the Spellfist and the Battlemage reshaped** (one act, Pinpoint +2% a depth at step 5 on acts that strike only the tapped foe, Limit Breaks included; hands ×1 and ×1.25; presets Greatsword, Katana, Fire and Fire, Blizzard, Katana); (3) **the band on sixteen damage and support classes** (T2B22 with the four new in the mean); (4) **the twenty-two against their Tier 2 parents** (T2C92's Tier 3 band; Juggernaut, Resonance, Spellbind, Menagerie, Overflow as round 2 measured; Pinpoint doubled; Arsenal with two two-kind weapons; the support twists with hands +0.03; Momentum on the four pure lines; the battle healers ×0.7); (5) **the comps** C3, C3b, C5, C6, C6b, C7, C10 and T1–T8 (§5.4, §6.8); (6) **the stress check** on the Tier 3 healers and the Archdruid's two mends. **The knob order:** (1) the pure variants' second hands, (2) Pinpoint's step (Tier 2 +2%, Tier 3 +4% a depth; the Battlemage's first), (3) the crosses' hands, (4) the Gladiator's and the Thaumaturge's hands (×1.05), (5) the low Tier 3 rules (Menagerie's farewell share, the supports' twist hands), (6) Momentum's step on the pure Tier 3 lines (6% → 5% if they lead), (7) the Tier 3 battle healers' power, (8) Overflow's cap. **Tier 3's term** (T2B36) below Lv 40 about +0.03 | It owns R2-11's measurement (T2B21), the band (T2B22), the stress check (T2B23), the term, statuses ±10% a stack, cap 3; the sixteen kept classes' values as measured (T2B24–T2B31) |
| **gear.md (T2G)** | **Slots and channels of the forty-two** (§4.1, §6.1): 3 Arms (Berserker, Bladedancer, Marshal, Ravager, Gladiator, Dervish, Imperator), 3 Tomes (Archmage, Spellweaver, Animist, Astromancer, Thaumaturge, Starweaver, Mythlord), 2 Arms + 1 Tome (Spellfist, Blademaster, Sentinel, Warlord, Druid, Guardian, Templar and their Tier 3 children), 2 Tomes + 1 Arm (Battlemage, Runeblade, Enchanter, Invoker, Shaman, Bishop, Exorcist and theirs); **which stat each slot reads** (the crosses and the pure classes one stat on every hit); **a pure variant's third slot gives her pair's second half**; **Arsenal: the Gladiator and the Thaumaturge may wear two two-kind weapons** (an exception to T2G3's one), preset Greatsword Evolved + Katana, Axe Tempered + Bow, Lance Keen and Fire Evolved + Light, Blizzard Evolved + Dark, Thunder Keen; **the twenty presets** (§4.13; a Tier 3 class wears her parent's but the Gladiator and the Thaumaturge); the crosses' other-channel weapons now the Spellfist's **Fire** (was Thunder) and the Battlemage's **Katana** (was Lance); Pendants for the Arms-only and Spellfist lines, Charms for the Tome-only and Battlemage lines | Weapon types (T2G21–T2G28), one two-kind weapon a class (T2G3); the accessory tree's three slots; Suggested types for the six new or reshaped kits are gear's |
| **progression.md (T2W)** | **The Tier 2 open set**: every child of every Tier 1 class at R50 (two or three a class), **6–20** ("Opens 8 of 20"); **the Tier 3 promotion** (§6.6): the Tier 3 children of every Tier 2 class at R50, **3–22**, Suggested the child of the class she fights as (the Spellfist's and the Battlemage's kept child), the Tier 3 door; **a sibling** in Tier 2 is another child of the same Tier 1 class (one or two), **in Tier 3 a class of the same Tier 1 line** (Class IV); Umas already in a Tier 3 world become their Tier 1 class's keeper's Tier 3 child | The Ascend sheet's pages (T2W16), its open-set writing (T2W17), Class V's three; T2W31's Tier 3 sheet lists the Tier 3 options on the same page |
| **extra-stats.md (T2E)** | **Prowess splits:** all to her stat for the Spellfist, Battlemage and every pure class (the four pure variants, the Gladiator, the Thaumaturge and the pure Tier 3 lines); the rest their parent's; **the shapes each class leans on** for the Area and Multi-hit presets: the Bladedancer, Spellweaver, Dervish, Starweaver multi-hit on one foe; the Marshal, Animist, Imperator, Mythlord area; the Spellfist, Battlemage, Spellhammer, Spellknight single hits (Offense); the Gladiator and Thaumaturge varied (Offense); the rest as round 2 | Extra Stats × tier; no branch adds a status |
| **professions.md (T2P)** | **Arms/Tome split by class** (weapon demand): 3/0 Berserker, Bladedancer, Marshal and the Ravager, Gladiator, Dervish, Imperator; 0/3 Archmage, Spellweaver, Animist and the Astromancer, Thaumaturge, Starweaver, Mythlord; 2/1 and 1/2 the rest; **the presets pull more Katanas** (the Spellfist, Battlemage, Bladedancer and Marshal hold one) and fewer Thunder Tomes | Her calling fixes her trade; a class switch moves nothing |
| **templates.md (T2U)** | **Her Flourish's family** (§4.10: Warrior and Mage 8 in Tier 2 and 9 in Tier 3, Spellblade and Summoner 6, Healer 4); **her lead weapon** by class (the Spellfist's Greatsword, the Battlemage's Fire, the Bladedancer's Katana, the Spellweaver's Thunder, the Marshal's Bow, the Animist's Dark; a Tier 3 class her parent's, the Gladiator's Greatsword, the Thaumaturge's Fire) | It owns the ★ tip and the Flourish's 4% |

## 8. Save and engine

Rough, not packets. Tier 2's classes ship with Tier 2's toolbox (progression's engine v22), Tier 3's with Tier 3's (v23).

| Data | Stored | Derived |
|---|---|---|
| The twenty | Class ids `berserker`, `spellfist`, `archmage`, `battlemage`, `blademaster`, `sentinel`, `bladedancer`, `runeblade`, `enchanter`, `spellweaver`, `warlord`, `druid`, `marshal`, `invoker`, `shaman`, `animist`, `guardian`, `templar`, `bishop`, `exorcist`, each with its `parent` and line, generation 2 in `rpg/class-tree.ts` | Hands, leans (the ancestor's), rules |
| The twenty-two | `ravager`, `spellhammer`, `gladiator`, `astromancer`, `spellknight`, `thaumaturge`, `bladelord`, `herald`, `dervish`, `runelord`, `oracle`, `starweaver`, `overlord`, `archdruid`, `imperator`, `hierarch`, `soulcaller`, `mythlord`, `bastion`, `inquisitor`, `cardinal`, `hierophant`, generation 3 | The same |
| Open classes | `open: classId[]` on her later-tier profile, written at each Ascend and by a door | — |
| Per held class | Class Rank, weapons, lines, equipped (Tier 1's record), line C, tips, Tier 3's `held[weapon]` (two lines) | Skill Ranks, crowns, the class line's skills |
| Momentum, Pinpoint, the supports' Barriers | — (fight state) | — |

- **Trees:** a later class reads her ancestors' tree ids (the Bladedancer's Katana `spellblade-katana`, the Gladiator's
  Lance `brawler-lance`); the catalog adds line C, the Break flags and the class lines only (`<class>-line.<depth>`, 60
  ids, 36 names).
- **Engine, Tier 2's stage** (`t2Classes`, v22): the twenty kits (hands; a hit's offense stat; **the pure pair**: a pair
  class's second half from her third slot, both halves one channel; the familiar on both halves and its Pierce; both
  summons lingering; the support level's top-up and her ward's Brave and Faith; the support Barrier and the farewell
  mend; the keeper healers' +1 stack; the battle healers' shares), **Pinpoint** (step 5, by the act's targets and depth),
  Momentum, class lines, line C, the Break tip, skill MP ×1.7 and the healing divisor; a status-free class's Light/Dark
  line A as damage.
- **Engine, Tier 3's stage** (`t3Classes`, v23): the twenty-two rules (Juggernaut, Resonance, Spellbind, Menagerie,
  Overflow, Pinpoint +4% a depth, the supports' twists, Momentum on the pure lines, ×0.7 power), **Arsenal** (gear's
  two-kind cap read by class), the crown, two lines held, skill MP ×2.4. Fights on older engines replay as they were.
- **Migration:** none in Tier 1's world. An Uma already in a Tier 2 world becomes her Tier 1 class's keeper (T2W23); one
  already in a Tier 3 world her keeper's Tier 3 child (§6.6).

## 9. Pacing

- **The pick is free and immediate** on each Ascend: at least six classes on Tier 2's first day, at least three on Tier
  3's.
- **Class Rank** keeps Tier 1's curve and 2E a win: the shared ladder ends at Lv 10, depths at Lv 16 · 22 · 29, Rank 50 at
  Lv 36 on her active class (**the crown in Tier 3**); two classes to Rank 50 a campaign.
- **The doors** at Class Rank 20 come at about Lv 16 on her active class: from there most of a tier's classes are a tap
  away.
- **Switching** costs only the weapons her new class slots that she hasn't graded; the Gladiator's and the
  Thaumaturge's second two-kind weapon costs nothing (a type is free, T2G39).
- **A Tier 3 class plays her rule from her first fight**, not only at the crown: the promotion is felt on day one.

## 10. The previews

| Page | What it shows |
|---|---|
| [classes-tree.html](previews/classes-tree.html) | **New.** The whole class tree, Tier 1 → 2 → 3, forty-two classes as cards: pick one to read her kit (parent, slots and reads, act, hand, MP, rule, statuses, healer, Limit Break scale, what she's for); filter by line (keeper, expander, support, pure, healer) |
| [classes-tiers.html](previews/classes-tiers.html) | Tier 1 → 2 → 3 at a glance: what each tier adds, the counts (13 → 20 → 22), the rules, Class Rank pace, Lv 50 sheets, MP and healing, the four status levels on forty-two classes, the Halls, round 2's Tier 3 features re-homed |
| [classes-branches.html](previews/classes-branches.html) | **The twenty:** each Tier 1 class's two or three children side by side; Momentum's ramp; the crosses with Pinpoint by depth and the one-foe kit's cost; the pure pair and its hands; the keepers, the supports, the healers |
| [classes-tier3.html](previews/classes-tier3.html) | **New. The twenty-two:** each Tier 2 class's promotion, her rule and its gain; Arsenal's five kinds; the masteries re-homed; Tier 3's budget and band |
| [classes-trees.html](previews/classes-trees.html) | A tree viewer by tier for the forty-two: whose trees, trunk, A, B, C, the tips, the class line (Squall and Legion new), two lines held and crowns, statuses by level |
| [classes-comps.html](previews/classes-comps.html) | **The comps:** the owner's swaps in Tier 2 and Tier 3, Tier 1-like, all-pure, all-hybrid, support-heavy; measured beside analytic; the guardrail; the 144 mixes; a party builder for any five of either tier |
| [classes-promotion.html](previews/classes-promotion.html) | The Ascend sheet's class page in Tier 2 and Tier 3 (pick the classes at Rank 50, see who opens and who's Suggested), switching, both doors' maps |

**The old pages** (`tier-rework/previews/`): carried or retired as round 2 listed (T2C30), unchanged.

## 11. Names (T2C59, T2C69, T2C88, T2C97)

- **Checked 2026-11-05, case-insensitive exact match, against every string of the master-data release** (uma-platform
  `content/release/data`, all ten files: art, characters, courses, objectives, outfits, races, scenarios, skills,
  support cards, tracks; **20,500 distinct strings, keys included**) **and the game's own string literals**
  (`packages/domain/src`, `apps/web/src`; 14,701): statuses, shapes, places, Limit Breaks, tree words, node names,
  summons, template types, knack words, Finals routes, old generations' skills.
- **Clear, round 3:** the Tier 2 classes **Bladedancer, Spellweaver, Marshal, Animist**; the Tier 3 classes **Ravager,
  Spellhammer, Gladiator, Astromancer, Spellknight, Thaumaturge, Bladelord, Herald, Dervish, Runelord, Oracle,
  Starweaver, Overlord, Archdruid, Imperator, Hierarch, Soulcaller, Mythlord, Bastion, Inquisitor, Cardinal,
  Hierophant**; the rules **Pinpoint, Arsenal**; the class lines **Squall** (Grand Squall, Supreme Squall, **Thousand
  Cuts**) and **Legion** (Grand Legion, Supreme Legion, **Onslaught**), in D298's grammar. Round 2's names re-checked:
  clear, but "Berserker" and "Warlord", the pre-v16 summons CP21 renamed so these words could name classes (only
  replays from engine v15 and before show them). No class name over one word or 11 characters.
- **Refused on the way:** **Focus** (a master-data string and an old skill), Illusionist (master data), Kensei,
  Bulwark, Cyclone, Tempest and Sovereign (old skills in the catalog), Horde (a Rift front), Flurry (the Brawler's Lance
  tree), Warlock (one letter from the Warlord), Swordsaint (beside the Summoners' Sword Saint capstone), Elementalist
  (12 characters), Primarch (another game's word).
- **One game string by design:** "Overflow" (round 2's) appears in the code only as a word in a comment.
- **The owner's working titles** ("True Brawler", "Wild Magic Brawler", "True Sorcerer", "Blade wielding Sorcerer")
  stay the alternative in T2C32.

## 12. Decisions

Every call, with the recommended answer. Round 3's first; rounds 1 and 2 keep their ids, and a call a round-3 reading
replaces says **Superseded (R3-n)**.

### 12.1 Round 3 (T2C65–T2C101)

| Call | Decision | Recommended | Alternatives, briefly |
|---|---|---|---|
| **T2C65** | Tier 3 is a promotion (R3-1) | **Twenty-two Tier 3 classes: every Tier 2 class promotes into one, the Spellfist and the Battlemage into two, each a new name; she keeps her Tier 2 parent's kit and rule and adds one rule.** Supersedes T2C57 | Round 2's "no new class" (R3-1 rules it out); two children for every Tier 2 class (40, the "extreme variants" the owner fears) |
| **T2C66** | The classes in Tier 2 (R3-6) | **Twenty: the Brawler and the Sorcerer two children each, the four hybrids three (keeper, support, pure), the healers two.** Supersedes T2C31 | Sixteen, pure variants at Tier 3 (T2C67's alternative) |
| **T2C67** | Where the pure variants arrive (R3-4) | **Tier 2, as each hybrid's third child**, so the owner's swap of a Brawler with a Spellblade works as soon as the Spellfist does | At Tier 3, splitting from the keeper: the swap would start a tier late, and Tier 2's hybrid lines would have no damage-only pick |
| **T2C68** | The pure variants' rule: the pure pair | **Her parent's three slots turned all her lead channel (2 + 1): her lead half from her first two weapons, her second from her third, every act; every hit on her stat; her family's familiar's hit or lingering summon kept; no status (her Light/Dark-side line A as damage at her parent's pure-power factor); hands 0.72 + 0.32 (Bladedancer), 0.72 + 0.41 (Spellweaver), 0.57 + 0.40 (Marshal), 0.57 + 0.37 (Animist), analytic, set to the band's middle in her parent's seat** | One full act at ×1 on her parent's trees (simpler, but loses the pair, her family's feel); keep her parent's path (a status on a damage-only pick); her parent's hands (two thirds more on her second half) |
| **T2C69** | Their names | **Bladedancer, Spellweaver, Marshal, Animist** (checked, §11) | Working titles ("Pure Arms Spellblade"); Warlock (one letter from the Warlord), Elementalist (12 characters) |
| **T2C70** | Their gear | **Her parent's armor half; her stat's accessory family on every hit; Prowess all to her stat; three weapons of one channel** | Prowess split as her parent's |
| **T2C71** | The Spellfist reshaped (R3-2) | **Two Arms and a Tome, the Arms first (the Arms Spellblade's mix); one act a turn; every hit on ATK (the cross); hand ×1 (from ×1.05); Pinpoint; preset Greatsword, Katana, Fire Tome: single big hits and a minor multi-hit.** Analytic +9 · +6.5 · +1% at Lv 10 · 30 · 50 | A Spellblade's pair (an Arms half and a Tome half, both on ATK): splits every hit smaller, and blurs her with the Bladedancer; round 2's kit (Greatsword, Axe, Thunder at ×1.05) |
| **T2C72** | The Battlemage reshaped (R3-3) | **Two Tomes and an Arm (the Tome Summoner's mix); one act; every hit on M.ATK; hand ×1.25 (from ×1.3); Pinpoint; preset Fire Tome, Blizzard Tome, Katana: single hits and one sweep.** Analytic +9.5 · +8 · −1%, her Lv 50 the cell nearest the band's edge, as in round 2 | All one-foe (Fire, Light, Katana: −3 to −5% of her party at Lv 50, measured on the live engine); ×1.3 (Lv 30 past the band) |
| **T2C73** | Pinpoint | **An act whose every hit lands on the tapped foe (a Heavy or Double skill, a one-foe line or class-line skill, an Attack, a one-foe Limit Break) +2% a depth of its skill (×1.1 at depth 5); a factor at step 5 beside the statuses and Momentum; Auto unchanged** | Flat ×1.1 (overshoots Lv 10–30: a one-foe kit costs nothing early); a hand split by shape (×1.1 one foe, ×0.9 many); presets only, no rule |
| **T2C74** | The pure variants' class lines | **Two new, mirrors sharing: Grand Squall · Supreme Squall · Thousand Cuts (Bladedancer, Spellweaver: her pair on one foe, each half one hit more); Grand Legion · Supreme Legion · Onslaught (Marshal, Animist: her pair, both summons on every foe at 0.55)** | Share their keepers' lines (Sigil, Griffin), whose statuses a pure class can't carry |
| **T2C75** | Statuses on twenty | **Four levels as round 2; the pure variants at none**: eight status-free Tier 2 classes, ten in Tier 3 | The pure variants on their parent's path |
| **T2C76** | The Tier 2 promotion | **On her Ascend she picks among every child of every Tier 1 class she holds at Class Rank 50 (two or three a class: 6–20); Suggested her ascending class's keeper, else her family's Rank 50 class's keeper with the most Class EXP.** Supersedes T2C46 | The keeper and the expander only, the pure variant by the door |
| **T2C77** | The twenty presets | **Keepers, supports and battle healers round 2's; the Spellfist Greatsword, Katana, Fire; the Battlemage Fire, Blizzard, Katana; the Bladedancer Katana, Axe, Bow; the Spellweaver Thunder, Blizzard, Dark; the Marshal Bow, Axe, Katana; the Animist Dark, Blizzard, Thunder** (the most whole mixes of 324 kits). Supersedes T2C54 | Round 2's Scatter-twin Spellfist and Battlemage (92 of 144 mixes whole against 80, at the cost of single hits) |
| **T2C78** | What a Tier 3 class is | **Her Tier 2 parent's kit and rule + one rule from Class Rank 1 + the crown at Class Rank 50 + two lines held** | The rule at Class Rank 50 with the crown, as round 2's masteries (the promotion felt only from Lv 36) |
| **T2C79** | The crown | **Kept on every Tier 3 class**, with MP back's sixth step: every held capstone 5.6 whole at Class Rank 50, +4 MP, a stack more (T2C20, T2C21) | Fold it into each class's rule (twenty-two prices for one ceiling) |
| **T2C80** | Two lines held | **Kept on every Tier 3 class** (T2C19) | Retire it (simpler trees; it was never measured into the budget) |
| **T2C81** | The master slot | **Retired:** ten equipped in Tier 3 | Keep it (an eleventh slot for a capstone the crown already deepens) |
| **T2C82** | Round 2's masteries | **Re-homed as Tier 3 rules: Juggernaut the Ravager's, Resonance the Astromancer's, Spellbind the Bladelord's and Runelord's, Menagerie the Overlord's and Hierarch's, Overflow the Bastion's and Cardinal's**, as round 2 drafted and measured them. Supersedes T2C22, T2C58 | Masteries by family on top of every Tier 3 rule (about +5% over Tier 3's budget) |
| **T2C83** | The Brawler's Tier 3 (R3-2) | **Ravager** (the Berserker: Momentum + Juggernaut); **Spellhammer** (the Spellfist, Pinpoint +4% a depth); **Gladiator** (from the Spellfist: three Arms, Arsenal, hand ×1.05, no cross, no Pinpoint) | The Ravager with Momentum to five stacks (+2% alone); the Gladiator keeping Pinpoint (single-target, against "varied") |
| **T2C84** | The Sorcerer's Tier 3 (R3-3) | **Astromancer** (Momentum + Resonance); **Spellknight** (the Battlemage, Pinpoint +4% a depth); **Thaumaturge** (three Tomes, Arsenal, hand ×1.05) | Mirror the Ravager's Juggernaut (round 2 gave each family its own mastery) |
| **T2C85** | "More varied physical weapons" | **Arsenal: two two-kind weapons in her slots (gear's T2G3 allows one), so she carries all five kinds of her channel**; every foe has a weak kind in her hands | A fourth slot (breaks three docs' slot counts); a rule that rewards mixing shapes (a third self-buff, and Auto plans a rotation) |
| **T2C86** | The hybrids' Tier 3 (R3-4) | **Keepers take their family's mastery (Bladelord, Runelord: Spellbind; Overlord, Hierarch: Menagerie); supports their keeper sibling's twist, hands +0.03 a half (Herald, Oracle: the familiar on both halves, piercing; Archdruid, Soulcaller: both summons linger, both farewells mend); pures Momentum (Dervish, Starweaver, Imperator, Mythlord).** No new mechanic | Supports one stack more (statuses were round 2's largest error); pures Spellbind or Menagerie |
| **T2C87** | The healers' Tier 3 (R3-5) | **Bastion, Cardinal: Overflow; Inquisitor, Hierophant: power ×0.7, shares ×0.7 kept.** The keeper's line gains sustain, the battle healer's damage | The battle healers' shares to ×0.6 as well (a third less healing again) |
| **T2C88** | Tier 3's names (R3-9) | **Ravager, Spellhammer, Gladiator; Astromancer, Spellknight, Thaumaturge; Bladelord, Herald, Dervish; Runelord, Oracle, Starweaver; Overlord, Archdruid, Imperator; Hierarch, Soulcaller, Mythlord; Bastion, Inquisitor; Cardinal, Hierophant** (checked, §11) | "{Tier 2 name} II"; the masteries as class names |
| **T2C89** | The Tier 3 promotion | **On her Tier 3 Ascend she picks among the Tier 3 children of every Tier 2 class she holds at Class Rank 50 (3–22); Suggested the child of the class she fights as (the Spellfist's and the Battlemage's kept child), else her family's Rank 50 class's child with the most Class EXP; switching and Class Rank as Tier 2's** | Every Tier 3 class of her Tier 1 lines; the Tier 3 children of every Tier 2 class she held, whatever its rank |
| **T2C90** | The Tier 3 door | **A held Tier 3 class at Class Rank 20 opens every Tier 3 class of her Tier 1 line and of its reclass neighbours' lines** (the Tier 2 door one tier down) | No door in Tier 3; only her Tier 2 parent's siblings' children |
| **T2C91** | Kin and the Flourish in Tiers 2 and 3 | **Her family is the descendants of her calling's own Tier 1 classes: Warrior and Mage 8 in Tier 2 and 9 in Tier 3, Spellblade and Summoner 6, Healer 4; a kin parent's descendant never Suggested and outside her Flourish.** Supersedes T2C49 | Every later class her family |
| **T2C92** | Tier 3's budget and band | **About +17% at Tier 3 Lv 50 (the crown + one rule in each mastery's place; T1 is round 2's crowned C1); each Tier 3 damage and support class's gain over her Tier 2 parent within ±5 points of the eighteen's mean at Tier 3 Lv 10, 30, 50 (analytic at Lv 50: mean +5.3%, all +3.2 to +8.2%); the healers on the stress check; Tier 3's term below Lv 40 about +0.03** | Read Tier 3 against Tier 1's parents only (hides each promotion's step) |
| **T2C93** | The comps (R3-7) | **The owner's swaps as the spine (C3, C3b, C4, C4b, C5 in Tier 2; T3, T3g, T3b, T4, T4b in Tier 3) beside Tier 1-like, all-pure, all-hybrid and support-heavy comps; read by the seat model (each member her parent's measured D + S × (1 + her gain)); every Tier 2 comp +1.4 to +6.1% over its Tier 1 party, every Tier 3 comp +3.1 to +4.8% over its Tier 2 comp.** Supersedes T2C63 | Round 2's sum of D + S (over-reads a pure seat's damage by about half) |
| **T2C94** | Kinds and the party hint | **80 of the 144 Tier 2 mixes hold all ten kinds (round 2: 56 of 64); every comp the owner names but C10; the party hint names a missing kind and an open class whose preset holds it** | Round 2's Spellfist kit (92 of 144) at the cost of single hits |
| **T2C95** | The save | **Twenty ids (generation 2) and twenty-two (generation 3), each with its parent; `open` per later-tier profile, written at each Ascend and by a door; Tier 3's held lines; Momentum and Pinpoint are fight state; an Uma already in Tier 2 becomes her class's keeper, in Tier 3 her keeper's Tier 3 child.** Supersedes T2C60 | Store each tier's Rank 50 classes and derive `open` |
| **T2C96** | The engine | **Two stages: `t2Classes` (v22, the twenty, the pure pair, Pinpoint) and `t3Classes` (v23, the twenty-two rules, Arsenal's cap, the crown, two lines held).** Supersedes T2C61 | One stage for both tiers (ships Tier 3's rules a tier early) |
| **T2C97** | Round 3's names | **Checked 2026-11-05 against 20,500 master-data strings and 14,701 game strings: clear; Focus, Illusionist, Kensei, Bulwark, Cyclone, Tempest, Sovereign, Horde, Flurry refused** | Names at build time |
| **T2C98** | The previews | **Seven pages: the class tree (new), tiers, the twenty, the twenty-two (new), trees, comps, promotion.** Supersedes T2C62 | Five, the Tier 3 classes inside the twenty's page |
| **T2C99** | What balance measures next | **The six new or reshaped Tier 2 kits, the twenty-two Tier 3 rules, the comps and the stress check, with the knob order of §7: pure hands, Pinpoint, the crosses' hands, Arsenal's hands, the low Tier 3 rules, Momentum on the pure Tier 3 lines, the Tier 3 battle healers, Overflow** | Measure only the comps |
| **T2C100** | The Halls by tier | **The same sixteen seats in every world; a seat's home classes are its Tier 1 home class's Tier 2 and Tier 3 descendants.** Amends T2C23 | New seats for the new classes |
| **T2C101** | Limit Break scale | **×0.95 every damage and support class of Tiers 2 and 3, ×0.8 every healer class.** Amends T2C55 | ×0.9 for the supports and battle healers |

### 12.2 Where the owner may want to look first

| Call | Why it's worth his eye |
|---|---|
| **T2C65, T2C82** Tier 3 is a promotion, and the masteries become its rules | Round 2's Tier 3 is rebuilt: twenty-two classes, the crown and two lines held kept on all, the master slot gone, each mastery the promotion of the line that had it |
| **T2C71, T2C73** The Spellfist acts once, and Pinpoint grows with depth | His "damage distribution like an Arms Spellblade" read as her slot mix, not the pair; a single-target kit costs nothing early and a twentieth of the party late, so the rule grows by depth |
| **T2C85** Arsenal | "More varied physical weapons" as two two-kind weapons: every kind of her channel in hand; a fourth slot and a variety stack are the alternatives |
| **T2C67, T2C68** The pure variants at Tier 2, with no status | Their hands are analytic; mirrors differ because their parents' lost statuses differ (Party 2's Armor Break and Mind Break) |
| **T2C86** One pattern for the hybrids' Tier 3 | Keeper + mastery, support + keeper's twist, pure + Momentum: no new mechanic, but two Tier 3 classes share a rule they already met elsewhere |
| **T2C94** The kinds the single hits cost | 80 of 144 mixes whole, from round 2's 56 of 64; C10 drops two kinds |
| **T2C89** Suggested for a cross is her kept child | The Spellfist arrives in Tier 3 as the Spellhammer unless he picks the Gladiator |

### 12.3 Rounds 1 and 2 (T2C1–T2C64)

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
| **T2C13** | Statuses on the class lines | **By her class's level: none, a path's 1 · 1 · 2, a support's or healer's 2 · 2 · 3, a Guardian's or Bishop's 3 · 3 · 3; a support's topped up and her Brave and Faith on her ward, as her trees' (follows T2B24, cross-reference)** | Every line a status; a support's line built up |
| **T2C14** | Line C | **Joins the fork at depth 3 by family, on her parent's trees: Rout, Havoc, Tremor, Hail, Fork; Kindle, Sleet, Peal, Beam, Gloom; Swath, Strafe; Hunt, Maul; Psalm** | No line C |
| **T2C15** | The tip fork | **Every capstone forks Power or Break: the first weak hit on each foe removes one more shield point, once an act** | No tip fork |
| **T2C16** | Equipped slots | **Tier 2: one more at Lv 10, 15, 20, 25, 30, 35, 40 (10 at Lv 40); Tier 3: 10 and the master slot** (the master slot **Superseded (R3-1)** by T2C81: Tier 3 equips 10) | Two a tree |
| **T2C17** | Skill MP by tier | **×1.7 and ×2.4 in place of ×tier** | ×tier; ×1.8 · ×2.6 |
| **T2C18** | The healing scale by tier | **×(1 + offense ÷ (300 × the tier's multiplier)): ×1.64 at every tier's Lv 50; the supports' Barrier and mend take it** | Leave ÷ 300 |
| **T2C19** | Two lines held | **Tier 3: two of a tree's three (default A and B), each with its tip; Auto between them** **On every Tier 3 class (T2C80)** | One; all three |
| **T2C20** | Depth 6 | **A crown: at Class Rank 50 in Tier 3 every held capstone plays 5.6 whole, +4 MP, one more stack; its name kept** **On every Tier 3 class (T2C79)** | 50 depth-6 names |
| **T2C21** | MP back a round | **A sixth step, 6%, with Tier 3's crown** **Kept with the crown (T2C79)** | Five in every tier |
| T2C22 | Masteries | **Superseded (R3-1)** by T2C82 | — |
| **T2C23** | The Halls by tier | **The same sixteen seats in every world; home classes the Tier 1 home class's children; scales by parent; LB+ +20% at Bond 10** **Amended by T2C100:** home classes the descendants | New seats for the sixteen |
| T2C24 | Buffs and debuffs by tier | **Superseded (R2-3)** by T2C45 | — |
| **T2C25** | Presets by tier | **One a Tier 2 class (T2C54), setting her three accessory slots by D266's rule and gear's forms; a switch offers, never forces** **One a class now T2C77** | Two a class |
| **T2C26** | The party screen's hint | **Re-homed: T2C63** **Now T2C94** | — |
| **T2C27** | Names, round 1 | **Kept: round 1's 252 checked; round 2's in T2C59** **Round 3's in T2C97** | — |
| **T2C28** | The save | **T2C60** **Now T2C95** | — |
| **T2C29** | The engine | **T2C61** **Now T2C96** | — |
| **T2C30** | The old previews | **Three pages carry class-overview, class-templates and class-trees; the rest retire (§10)** | Keep the old pages |
| T2C31 | The classes in Tier 2 | **Superseded (R3-6)** by T2C66 | — |
| **T2C32** | Their names | **Berserker · Spellfist; Archmage · Battlemage; Blademaster · Sentinel; Runeblade · Enchanter; Warlord · Druid; Invoker · Shaman; Guardian · Templar; Bishop · Exorcist** (checked, §11) | The owner's working titles ("True Brawler", "Wild Magic Brawler", "True Sorcerer", "Blade Sorcerer"), and "Keeper/Expander {parent}" for the rest |
| **T2C33** | What a Tier 2 class keeps | **Her parent's three slots' count, lean, armor half, trees, family, hall, Limit Break scale and one act a turn; one rule changes her** **Kept, changed (R3-4) by T2C68:** a pure variant's channels | Leans ±0.1 (A2); a fourth slot |
| **T2C34** | The self-buff | **Momentum, the pure keepers': +6% a stack on her own hits, a stack after each of her turns, 3 at most (+18%), the fight long, lost when she falls; never a party buff; Auto unchanged.** Worth +11.3% of her damage at Lv 50 (+9.1% fights, +13.3% bosses); her seat measured +5.6 · +2.0 · +5.2% (Berserker), +5.8 · +3.4 · +5.1% (Archmage). **Amended by T2B26 (cross-reference)** | +5% a stack (as drafted: the keepers +4.5% and +4.1% at Lv 50, short of the band's middle); 7%; +10% a stack (13 points over the expanders); a stack a weak hit; cap 2 |
| **T2C35** | The pure expanders | **Spellfist two Arms and a Tome, Battlemage two Tomes and an Arm; every hit reads her stat; a hit keeps its kind's channel for defense, weakness, statuses and the ward; hands the Spellfist ×1.05, the Battlemage ×1.3** (measured +6.5 · +4.5 · +4.3% and +10.9 · +8.3 · −1.8%). **Amended by T2B27 (cross-reference)** **Kept, changed (R3-2, R3-3) by T2C71–T2C73:** one act, Pinpoint, single-target presets, hands ×1 and ×1.25 | ×1.05 both (as drafted: the Battlemage −2.5 · −4.7 · −11.4% on the Heavy twins); ×1.35 on the Heavy twins; any three of ten; a fourth slot (+4.5%, three docs' slot counts); ×1 (a cross alone is +1–2%) |
| **T2C36** | Their gear | **Her parent's armor half; her stat's accessory (Pendant, Charm) counts on every hit; Prowess all to her stat; her other channel's weapon grades with its own items** | A split armor half |
| **T2C37** | The Spellblade keepers | **Blademaster and Runeblade: her familiar's extra hit on both halves (the same total), and it pierces; hands +0.03 a half: 0.75 + 0.47 and 0.75 + 0.51 (lead first)** (measured +9.0 · +4.5 · +3.6% and +6.8 · +2.3 · +2.8%). **Amended by T2B28 (cross-reference)** | Both halves alone (as drafted: worth about 0%); the hands alone (+0.05 a half); a damage bump |
| **T2C38** | The Summoner keepers | **Warlord and Invoker: both summons linger, two farewells at her next pair; hands +0.03 a half: 0.60 + 0.49 and 0.60 + 0.53 (lead first)** (measured +8.6 · +2.0 · +6.8% and +8.6 · +3.6 · +3.0%). **Amended by T2B29 (cross-reference)** | Both summons alone (as drafted: −0.2 to +4.1%, the second farewell 1–3%); the lead summon two pairs (Menagerie early) |
| **T2C39** | The support expanders' kit | **Hands of her parent's: the Sentinel ×0.95 (0.68 + 0.42), the Enchanter ×0.8 (0.58 + 0.38), the Druid ×0.95 (0.54 + 0.44), the Shaman ×1 (0.57 + 0.5); every skill of her Katana, Bow, Light and Dark trees carries its status at 1 · 1 · 1 · 2 · 2 by depth, topped up to its stacks, never built past them; her debuffs on the tapped foe (every foe at depth 5) for the Spellblades', every foe for the Summoners'; her Brave and Faith on the Uma she wards (the Summoners': the most threatened)** (measured −2.4 · +10.9 · +2.9%, +7.0 · +2.5 · +6.6%, +7.1 · +2.3 · −1.5%, +10.4 · +0.8 · +1.2%). **Amended by T2B24 and T2B25 (cross-reference)** | As drafted: ×0.85 and ×0.9, the healers' ladder 1 · 1 · 2 · 2 · 3 built up, Brave and Faith on every Uma (measured the Sentinel +34 to +50%, the Enchanter +18 to +33%); one stack flat; one cut for both; the path widened to every line only |
| **T2C40** | The Spellblade supports' Barrier | **After each skill act, a Barrier on the most threatened: a third of the healers' share at her act's depth (9–15%), × her healing scale** | A Barrier on herself; the familiar's hit becomes the Barrier |
| **T2C41** | The Summoner supports' mend | **Her farewell mends every Uma a tenth of the healers' mend share at its depth (2.8–4.4%), × her healing scale; no Rescue, cleanse or revive** | The most hurt only, a third |
| **T2C42** | Supports and the one-healer rule | **They are no healer: a support beside a healer is legal, two healers still are not; a party with no healer is legal too: one healer a party is a ceiling, not a floor (T2B39, cross-reference)** | Count them as healers; forbid a healerless party |
| **T2C43** | The healer keepers | **Guardian and Bishop: every status she lands one stack more, to 3 (2 · 2 · 3 · 3 · 3; path 3 · 3 · 3); Surge gives ×1.15 where her status is at 3.** Worth +0 to +6% on curve; the attrition pick, ahead of her battle healer in fights won from ×3.2. **Confirmed by T2B30 (cross-reference)** | One stack more and a round longer (tried: past the battle healers on curve too); every mend reaches every Uma (worth nothing on curve, §5.1) |
| **T2C44** | The battle healers | **Templar and Exorcist: power ×0.6, MP ×0.7, mends and Barriers ×0.7 the shares (Rescue and the revive kept), Tier 1's statuses; still the one healer.** Measured +12.1 · +9.7 · +5.7% and +15.9 · +6.9 · +7.3% on curve, behind the keeper from ×3.2. **Confirmed by T2B31 (cross-reference)** | ×0.75 and ×0.6 (+17% on curve); her statuses to a path |
| **T2C45** | Statuses by class | **Four levels: none (the four pures), a path (the hybrid keepers), support (the hybrids' expanders, new: 1 · 1 · 1 · 2 · 2, topped up to its stacks, Brave and Faith on her ward), widely (the healers, the keepers +1); five statuses, +10% a stack, cap 3. Amended by T2B24 (cross-reference)** | The support level at the healers' ladder, built up (as drafted); D282's three, the supports at a path |
| T2C46 | The Tier 2 promotion | **Superseded (R3-4)** by T2C76 | — |
| **T2C47** | Switching and Class Rank | **Every open class held from arrival at Class Rank 1; switch free outside fights; each its own Class Rank; XR1's shared ladder raises all to 10** | A second promotion step per class |
| **T2C48** | Opening more in Tier 2 | **The door: a held Tier 2 class at Class Rank 20 opens the children of her parent's reclass neighbours (D290, D291's map), about the Tier 1 door's 3,600 Class EXP** | Locked for her Tier 2 life; Class Rank 50; a Class Mark price |
| T2C49 | Kin and the Flourish in Tier 2 | **Superseded (R3-4)** by T2C91 | — |
| **T2C50** | A Tier 0 at her Ascend | **Arrives as the Suggested rule's class (Class V guarantees three Tier 1 classes at Rank 50)** | Her suggested promotion's keeper whatever its rank |
| **T2C51** | Whose trees | **A Tier 2 class plays her parent's trees; the Spellfist's Tomes the Sorcerer's, the Battlemage's Arms the Brawler's; no new tree or skill name** **Kept, changed (R3-4):** a pure variant plays her parent's five trees of her channel (§4.11) | Sixteen sets of new trees |
| **T2C52** | The class lines | **Round 1's ten on the sixteen, mirrors sharing: Rampage (Berserker), Conquest (Spellfist), Nebula (Archmage), Quasar (Battlemage), Sigil (Spellblade keepers), Bane (Spellblade supports), Griffin (Summoner keepers), Wraith (Summoner supports), Edict (healer keepers), Solace (battle healers)** **Kept, changed:** two more lines (T2C74) | Sixteen new lines |
| **T2C53** | Line C on the sixteen | **Her parent's tree's C; the healers' Psalm kept (reach every Uma from depth 3)** | Psalm re-cut |
| T2C54 | Presets | **Superseded (R3-2–R3-4)** by T2C77 | — |
| **T2C55** | Limit Break scale | **Her parent's: ×0.95 the twelve damage and support classes, ×0.8 the four healers.** Confirmed by balance (cross-reference) **Amended by T2C101** (forty-two classes) | ×0.9 for the supports and battle healers |
| **T2C56** | Party value | **Measured on the harness (T2B21): V = D + S in BT a round; D her damage a round of the fight, S what the other four lose when her statuses, mends, wards and keeper twist are off; a class's gain the party's damage a round with her in her parent's seat minus with her parent, over her parent's V; fights weigh 2, sub-bosses and bosses 1; sustain on the stress check (T2B23). The formula (V = D + S + B a turn, H beside it) stays as the analytic reading (§5.1). Amended by T2B21 (cross-reference)** | The formula as the yardstick (as drafted: it missed the Sentinel by 30–45 points); damage only; one exchange rate for HP on curve |
| T2C57 | Tier 3 | **Superseded (R3-1)** by T2C65 | — |
| T2C58 | Masteries on the sixteen | **Superseded (R3-1)** by T2C82 | — |
| **T2C59** | Round 2's names | **Checked against every master-data string and the game's own: clear (§11); Crusader, Fervor, Ranger, Archon, Mystic, Warden, Vanguard, Champion refused** | Names at build time |
| T2C60 | The save | **Superseded (R3-1, R3-6)** by T2C95 | — |
| T2C61 | The engine | **Superseded (R3-1, R3-6)** by T2C96 | — |
| T2C62 | The previews | **Superseded** by T2C98 | — |
| T2C63 | The comps and the party hint | **Superseded (R3-7)** by T2C93, T2C94 | — |
| **T2C64** | Where the band is read | **On curve at Tier 2 Lv 10, 30 and 50: each of the twelve damage and support classes' gain within ±5 points of the twelve's mean gain at that level (measured at the knobs +7.0 · +3.9 · +3.2%; 34 of 36 cells in; the Sentinel's Lv 10 and 30 out, accepted until the class lines exist); the four healers on the stress check (T2B23), each the better pick of her pair somewhere. Amended by T2B22 and T2B23 (cross-reference)** | As drafted: ±5% of the sixteen's mean gain at Lv 50, the healers and the Summoners' supports on the stress check; one reading for all sixteen |

*Names checked 2026-11-05 against uma-platform `content/release/data` (10 files, 20,500 distinct strings, keys included)
and the game's own strings (`packages/domain/src`, `apps/web/src`; 14,701).*
