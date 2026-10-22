# Skill trees: the Tier rework

> **Cross-referenced draft, 2026-10-22. Nothing here is built or decided.** One of the six category docs of
> [the Tier rework](README.md). The cross-reference pass ([README §7](README.md#7-cross-reference-log)) changed no SK
> call: it checked the strike words (SK14), the template slots (SK11, filled by variance.md as reconciled) and the
> engine versions (§9: Tier 1's trees need none of their own; Tier 2's nodes ship in v17).
> - **Previews:** [trees by tier](previews/skills-trees-by-tier.html) (the Brawler at Today, Tier 1, 2 and 3, and the
>   hybrids' crossovers), [every class at Tier 1](previews/skills-all-classes-t1.html),
>   [the profile's Skills tab](previews/skills-profile.html).
> - **Calls** are SK1–SK14, each with a recommendation ([§11](#11-decisions)).

## The owner's points

| The owner's point | Answered in |
|---|---|
| Incremental for later tiers | [§3](#3-the-shape-per-tier): the same trunk at every tier, and one more pick a tree each tier (1, 2, 3) |
| Today the profile doesn't look like a tree: no real options | [§2.3](#23-what-a-fork-must-change-sk3) (a fork changes what she's for), [§3.1](#31-tier-1-two-branches-sk6) (a real either/or on every tree from Tier 1), [§5](#5-the-profile-on-a-phone-sk10) (drawn as a tree) |
| Show the skill trees at different tiers | The three previews; [§3.4](#34-at-a-glance) |
| Side nodes cost points, while the next depth's skill is free | [§2.2](#22-what-a-node-costs-nothing-sk2): no points at all; branches are free and exclusive |

## 1. Today

The rules are in [classes](../../game/classes.md#skills-depths-points-and-slots), every node in
[skill trees](../../game/skill-trees.md), the screen in [sections](../../game/sections.md#stable).

| | Today (engine v15, save v25) |
|---|---|
| Trees | One per class and weapon kind: 50. A Brawler or a Mage sees 5. The others see 10, and the 5 weapons in her slots make 5 usable |
| A tree | Five depths. Each has a **core** and two **sides**, A and B. She may take one side of each depth |
| Gates | Cores at Class Rank 1, 10, 20, 30, 40. Sides at 5, 15, 25, 35, 45 |
| Cost | Cores free. A side costs its depth in side points; one point a Class Rank, per class (50 at most). Filling every fork of 5 trees costs 75 |
| Equipped | 3 at Lv 1, one more at Lv 10, 15 … 40 (10) |
| On screen | One row per depth: a core card, two side cards, "Learn · 3 pts", "Swap out · refund". A 5- or 10-tab weapon strip, "N points for side skills", the Skills tab's green dot and the class chip's "N pts" (D166) |
| Decided, not built | T7 (D159): Tier 1 cores only, no sides, no points. Tier 2 brings sides back with points (tier2-classes A3, Q14). Weapon arts add a second per-weapon fork in Tier 2 (weapon-arts E1, Q15) |

**What's wrong:**
- **The asymmetry.** A new, stronger skill (the next core) is free; a variant of it (a side) costs points.
- **Most sides are numbers.** Focused or Flurry (a hit more or less, ±5–10% power), Lasting or Heavy (a turn or a stack).
  The Brawler's and the Mage's sides do change reach, but there are 25 a class.
- **No tree.** Every depth is a row, the core line never branches, and nothing reads as a path.
- **With three weapons, points never bind.** When a depth's sides open, the open sides of three trees cost no more than
  she has: 3 × (1 + … + d) ≤ 10d − 5 gives 3 ≤ 5, 9 ≤ 15, 18 ≤ 25, 30 ≤ 35, 45 ≤ 45. The budget becomes bookkeeping.
- **T7 alone leaves Tier 1 with no options at all,** the owner's other complaint.

## 2. The rules every tier shares

### 2.1 A tree per weapon, drawn under her class (SK1)

- **One tree per weapon slot: three a class** ([brief](README.md) §2). The catalog stays one tree per class and weapon
  kind, with today's ids; her three slots pick which three she uses.
- **The page draws one class tree:** a **root** (her class) with her three weapon trees under it. The root holds what
  belongs to the class, not a weapon: her Uma Template's node ([§6](#6-slots-for-other-categories)), her
  specialization (Tier 2, [classes](classes.md) CL11) and her mastery (Tier 3, CL12).
- **A weapon tree has three parts:** the **trunk** (depths 1–2, always hers), a **fork** at depth 3 into **branches**,
  and each branch's **tip** (its depth 5).

**Why per weapon:** the weapon carries the kind and the shape ([§2.5](#25-kinds-live-on-weapons-sk5)), its grade is per
weapon, and a hybrid's pair needs an Arms tree and a Tome tree. One tree per class with weapon limbs rebuilds the catalog
for nothing the root doesn't already give. One tree per kind shared by every class loses the classes' own skills: a
Paladin's blow isn't a Brawler's.

### 2.2 What a node costs: nothing (SK2)

- **No skill points, at any tier.** Every node is free.
- **Class Rank opens a depth** ([§2.4](#24-gates-class-rank-only-sk4)), and every node at an open depth on her path is
  hers at once.
- **Choices are exclusive, not bought.** At a fork she holds one branch (two in Tier 3). Every fork has a **default**,
  branch A, so nothing is ever left unspent.
- **Swaps are free** outside a fight, as often as she likes. **Her equipped skills follow:** with Rend equipped, taking
  the Combo branch puts Rending Combo in its slot.
- So every node costs the same thing: time in the class. The free-core, paid-side split is gone.

**Alternatives:** every node costs points, with fewer points than nodes (a real budget, but a second thing to plan
across three trees, and a respec rule); today's points (the asymmetry, and [§1](#1-today)'s math: with three weapons
they never bind).

### 2.3 What a fork must change (SK3)

**A fork changes what she's for. It never trades a few percent of power alone.** Each branch differs from the others in
at least one of:
- **reach:** one foe, random foes, every foe, a splash;
- **hits:** count or weight. More hits chip shields sooner; one heavy hit lands harder after the Break; a pierce ignores
  the shield's halving;
- **support:** a status's weight, who a mend or a Barrier reaches, a revive;
- **Breaks:** one more shield point (Tier 2's Break tips, [§3.2](#32-tier-2-three-branches-and-forked-tips-sk7)).

**Branch A is the anchor:** today's core line, the default, the one the balance simulation plays and a new Uma starts
on. The other branches are **sidegrades:** better in their context (a crowd, a shielded boss), worse elsewhere
([§10](#10-pacing)).

### 2.4 Gates: Class Rank only (SK4)

| Depth | Opens at | Tier 1 | Tier 2 | Tier 3 |
|---|---|---|---|---|
| 1 | Class Rank 1 | Trunk | Trunk | Trunk |
| 2 | Class Rank 10 | Trunk | Trunk | Trunk |
| 3 | Class Rank 20 | **Fork:** branch A or B | **Fork:** A, B or C | **Fork:** two of A, B, C |
| 4 | Class Rank 30 | Branch | Branch | Both branches |
| 5 | Class Rank 40 | Tip | **Tip fork:** Power or Break | Two tip forks |
| 6 | Class Rank 50 | — | — | **Capstone,** one per branch held |

- Today's core gates (D102). The side gates (5, 15 … 45) retire. A fork opens with its depth.
- **Uma Level** keeps setting her equipped slots. A weapon's **grade** is gear's (Weapon Rank retires, [gear](gear.md)
  GE2) and gates no skill, so no skill waits on crafting.
- Fighting as one class (2E a win, D102), Class Rank 20 comes at about Uma Lv 13, 30 at Lv 20, 40 at Lv 27 and 50 at
  Lv 34.
- Locked depths and branches show from day one, with their Class Rank, so she sees what's coming.

### 2.5 Kinds live on weapons (SK5)

- **A weapon carries its kind,** and from Tier 2 the kinds its form adds ([gear](gear.md) GE4, GE6: Dual, then Prism or
  Tempered). A skill hits with its weapon's kinds.
- **A tree gives shape, power, MP and effects, never a kind.** No branch turns a Greatsword's hits to Fire, and none
  moves a weapon to another strike (Tier 1's Heavy, Flurry or Area, [classes](classes.md) CL2).
- So the Brawler stays all physical and the Mage all magical whatever she picks; the hybrids' 70/30 comes from their
  slots and hands; weakness coverage stays a party puzzle (D160 §6.2).
- A weapon with two kinds opens its family's tree: a Greatsword that went Dual with Fire opens the Greatsword tree.

### 2.6 Auto, presets, switching

- **Auto plays whatever she holds.** The auto loadout takes each tree's deepest skills in turn, as today.
- **A new Uma starts on every default.** The standard preset (D164) sets gear and leaves her picks alone.
- **Picks are per class and per tree.** They stay when she switches class, or swaps a weapon out and back.
- **Promotion** starts the new world on the defaults (D159: no skill carries).

## 3. The shape per tier

### 3.1 Tier 1: two branches (SK6)

```
                 Heavy Slash                depth 1 · Class Rank 1
                      |
                   Cleave                   depth 2 · Class Rank 10
             _________|_________            the fork · Class Rank 20 · hold one, free
            |                   |
     A  Sunder           B  Triple Sunder   depth 3
            |                   |
          Rend            Rending Combo     depth 4 · Class Rank 30
            |                   |
     Meteor Strike        Meteor Combo      depth 5 · Class Rank 40
```

- **8 nodes a tree, one pick a tree, three a class.** She holds 5 skills a tree, 15 in all.
- **Every Tier 1 node exists today:** the trunk is cores 1–2, branch A cores 3–5, branch B one side line's depths 3–5.
  No new skill, no engine change, and old fights replay.
- **Why one pick, at depth 3:** depths 1–2 teach the weapon; the pick comes at about Lv 13, once she knows it, and
  decides what her three strongest skills of that weapon do. The alternatives: no pick (T7, no options at all), or one
  at every depth (today's 25 a class).

**B, the lean.** For the Brawler and the Mage it follows the weapon kind, mirrored Arm and element where today's lines
allow:

| Kind | A, the core line (default) | B, the lean | Today's line |
|---|---|---|---|
| Greatsword | One foe, heavy | **Combo:** one more hit, a little less power: Breaks sooner | B |
| Fire | One foe, heavy | **Wave:** every foe | A |
| Axe | Every foe | **Reap:** every foe, then a hit on her target | B |
| Blizzard | Every foe | **Spike:** one foe, heavy | A |
| Lance | Random foes | **Impale:** one foe, fewer and heavier hits | A |
| Thunder | Random foes | **Bolt:** one foe | A |
| Bow | One foe, many hits | **Rain:** and a splash on every other foe | B |
| Light | One foe, many hits | **Cascade:** every foe, two hits | B |
| Katana | The foe and one other | **Draw:** one hit that ignores the shield's halving | A |
| Dark | The foe and one other | **Pierce:** one hit that ignores the shield's halving | A |

For the other four classes it follows the class, on every tree:

| Class | B, the lean | Today's line |
|---|---|---|
| Spell Blade | **Rapid:** one more hit. Her shield breaking, further | B ("… Flurry") |
| Summoner, Tome trees | **Bonded:** her summon lingers at 0.4, not 0.3, so its farewell on every foe hits harder. Her areas, further | B |
| Summoner, Arms trees | **Pack:** one more hit on arrival. Her Arms summon doesn't linger, so Bonded would do nothing there | A |
| Paladin, Cleric | **Potent:** one more stack of her status, for more MP, and the revives where they sit today: the Cleric's **Rebirth** (Light, depth 3), the Paladin's **Valkyrie's Oath** (Lance, depth 4) | B ("Heavy …") |

**Two lines are renamed** (SK14): [classes](classes.md) CL15 gives Tier 1's strikes the words Heavy, Flurry and Area,
so the Spell Blade's "Mystic Cleave Flurry" becomes "Rapid Mystic Cleave" and the healers' "Heavy Rupture" becomes
"Potent Rupture". Ids don't change; names are presentation, as with the Knight Captain (D183). A core named for its
own strike, such as the Brawler's Thrust Flurry on a Flurry weapon, keeps its name.

Every class's three trees, on [classes](classes.md) CL4's default weapons, are drawn in
[the Tier 1 preview](previews/skills-all-classes-t1.html).

### 3.2 Tier 2: three branches and forked tips (SK7)

Tier 2 keeps Tier 1's tree and adds two things to every tree and one to the root:

- **Branch C joins the fork,** by the same rules as A and B:
  - **Brawler, Mage:** the third of today's lines: Greatsword Crush, Axe Tempest, Lance Scatter, Bow Ballista, Katana
    Cross, Fire Chain, Blizzard Shards, Thunder Storm, Light Beam, Dark Cascade;
  - **Spell Blade, on her Arms trees: Sweep** (Q17): her Arms half reaches every foe at the area share (0.55) and gives
    up her extra hit. On her defaults (Bow, Axe) that's Q17's Axe exactly. On her Tome tree, Focused (today's A: one
    hit fewer, harder);
  - **Summoner, on her Tome trees: Hunt** (Q17): her lingering summon's farewell strikes its own target three times
    instead of every foe once. On her Arms tree, Mighty (new: one hit fewer, ×1.1);
  - **Paladin, Cleric: Wide** (new): her mend or Barrier reaches every Uma (×0.4 each) from depth 3; today only depth 5
    does.
- **Each branch's tip forks:** **Power** (Tier 1's tip) or **Break** (the same skill; its first weak hit on a foe
  removes one more shield point, once an act, under the shared chip cap of [weapon arts](../weapon-arts.md) E6). It's
  weapon arts' A/B fork (E1) moved into the class tree. Gear's forms never touch Breaks ([gear](gear.md) GE6), so
  Break +1 has one home and one cap.
- **The root shows her specialization's passive** ([classes](classes.md) CL11: one of two per class, tier2-classes'
  passives, swapped on the Skills page). It's a class pick, not a tree pick.
- **A template may add a third option** at one tip fork, her signature tip ([§6](#6-slots-for-other-categories)).

14 nodes a tree, two picks a tree, six a class. She still holds 5 skills a tree. Equipped slots 3 → 10 (D159).

**Q17's crossovers sit here, not in Tier 1** (SK9):
- Tier 1 keeps the mirror the simulation just tuned (H63: equal damage a turn, 70/30 each way) as its only hybrid shape;
- Tier 2 is where the specializations widen the hybrids' identities;
- a crossover bends the **leading half** only, where classes v2 put each hybrid's identity, and reaches toward the
  mirror's identity, not its level ([§10](#10-pacing)).

### 3.3 Tier 3: a sixth depth, two branches held (SK8)

- **Depth 6 at Class Rank 50:** each branch gains a capstone (tiers §6: "one extra depth, 6, per tree"). Power 5.6 and
  30 MP, the depth tables' next step.
- **She holds two of the three branches** at each fork. Each has its own tip pick and its capstone. Auto picks between
  them each turn: one tree, two answers, a crowd and a boss.
- **The root shows her mastery** ([classes](classes.md) CL12: one signature mechanic per class, designed once Tier 2 is
  played), beside her specialization.
- 17 nodes a tree (Tier 2's 14 and three capstones), three picks a tree (the pair and two tips), nine a class. She holds
  10 skills a tree, 30 in all. Equipped: 10 and a master slot (D159).

**Alternatives:** a fork of two capstones a tree (more picks, the same single answer per tree); depth 6 alone (tiers §6
as written: Tier 3 grows but adds no choice).

### 3.4 At a glance

| | Today (every tier) | Tier 1 | Tier 2 | Tier 3 |
|---|---|---|---|---|
| Trees she uses | 5 | 3 | 3 | 3 |
| Nodes a tree | 15 | 8 | 14 | 17 |
| Picks a tree | 5 forks, and points | 1: A or B | 2: A, B or C; the tip | 3: two of A, B, C; two tips |
| Picks a class | 25, and a 50-point budget | 3 | 6 | 9 |
| Skills she holds | Up to 50 | 15 | 15 | 30 |
| Equipped | 3 → 10 | 3 → 7 | 3 → 10 | 10 and a master slot |
| Points | One a Class Rank | None | None | None |
| The root | — | Class, template slot | + specialization | + mastery |

## 4. Tier 1's complexity: today and proposed

What a player faces in one class in Tier 1:

| | Today (built) | T7 (decided, not built) | Proposed |
|---|---|---|---|
| Trees on the page | 5 (Brawler, Mage) or 10 | 5 or 10 | **3** |
| Nodes on the page | 75 or 150 | 25 or 50 | **24** |
| Gates to learn | 10 | 5 | **5** |
| Picks | 25 forks, each A, B or neither | 0 | **3, each with a default** |
| A currency | Side points: 50 against 75 | None | **None** |
| Skills she can hold | 50 | 25 | **15** |
| Equipped slots | 3 → 10 | 3 → 7 | **3 → 7** |
| Buttons on a node | Learn · n pts, Equip, Swap out · refund | Equip | **Equip; a branch head: Take this branch** |

## 5. The profile on a phone (SK10)

The Skills tab at 390 px ([preview](previews/skills-profile.html)), top to bottom:

1. **Class:** today's six in two rows of three ([classes](classes.md) owns Tier 2's and 3's pickers).
2. **Weapons:** her three slots ([gear](gear.md)), each opening the slot's sheet.
3. **Class Rank** bar: "Depths 1–4 open · depth 5 at Class Rank 40".
4. **Her tree:**
   - **the root plate:** her emblem, class and hand in one line, then one line each for her template node (variance's
     Flourish), her specialization (Tier 2) and her mastery (Tier 3);
   - **three weapon tabs,** each with a small glyph of her path (the branch she holds) and a "New" dot while a newly
     opened fork is unseen (kept on the device, like the Stable's New);
   - **the open tree, drawn as a tree:** nodes joined by lines, depth 1 at the top. Her path is filled in the accent; a
     branch she doesn't hold is outlined and dimmed; a depth not open yet is faded, with its Class Rank;
   - in Tier 2 and 3 the branches she doesn't hold stop at their head node, so her path keeps the width for its tip
     fork;
   - **tap a branch head** for its sheet: the branch's skills in one list, and "Take this branch · free". Tap a node for
     its skill line and Equip.
5. **Equipped:** chips, as today, and "Back to auto".

**Fit at 390 px:** one tree at a time. Tier 1's two branches get about 170 px each; Tier 2's three heads about 110 px,
and her path's tip fork two nodes of about 160 px.

**Retired:** "N points for side skills", "Learn · n pts" and "Swap out · refund"; the class chip's "N pts" pill and
D166's points rule (the Skills tab's dot stays only for a weapon slot that can take a better piece); the 10-tab tree
strip, since she sees her three weapons' trees and a weapon's tree opens once it's in a slot.

## 6. Slots for other categories

**Template-only nodes** (SK11; [variance](variance.md) §7 fills both):
- **The root's template slot,** every tier: one class-wide node, on while her Uma Template's calling is this class.
  Free, no pick. A front runner whose calling is the Brawler has it as a Brawler and not as a Mage, the brief's example.
  Variance calls it her **Flourish**, an MP twist such as "Opening".
- **A template tip,** Tier 2 and later: a third option at the tip fork of one weapon kind's tree, her **signature tip**
  (variance: her calling's tree of her signature kind, at both of that tree's tip forks in Tier 3). Exclusive with Power
  and Break, and free.
- Nothing else in a tree is template-only. The branches are every Uma's.

**Q17's hybrid crossovers:** Tier 2's branch C on the Spell Blade's Arms trees and the Summoner's Tome trees
([§3.2](#32-tier-2-three-branches-and-forked-tips-sk7)).

**The root** carries [classes](classes.md)' specialization (Tier 2, CL11) and mastery (Tier 3, CL12).

## 7. Provides

- **The tree's shape per tier** ([§2.4](#24-gates-class-rank-only-sk4), [§3](#3-the-shape-per-tier)), and for the class
  template sheet: three trees; 15, 15 and 30 skills held; 7, 10 and 10 + 1 equipped.
- **No skill currency.** Nothing in a tree costs points, Laurels or items: no profession demand, no respec item.
- **Trees never add a damage kind** ([§2.5](#25-kinds-live-on-weapons-sk5)).
- **Any three weapons work,** in any Arms and Tome split: the lean follows the weapon kind (Brawler, Mage) or the class
  (the others), and the crossover follows her leading half.
- **Q17's crossovers** in Tier 2 ([§3.2](#32-tier-2-three-branches-and-forked-tips-sk7)).
- **Two slots for template nodes** ([§6](#6-slots-for-other-categories)), and the root for passives and mechanics.
- **The Skills tab's layout** for the cross-reference's `character-tiers.html` ([§5](#5-the-profile-on-a-phone-sk10)).
- **Defaults:** branch A everywhere, today's cores, for the simulation, presets and new Umas.

## 8. Assumes

| From | Assumed | If not |
|---|---|---|
| Brief §2 | Three weapon slots a class, at every tier | Trees follow the slot count; a tree's nodes and picks don't change |
| [classes](classes.md) | CL1 and CL4: three slots typed by strike, Brawler 3 Arms, Mage 3 Tomes, Spell Blade and Paladin 2 Arms + 1 Tome, Summoner and Cleric 1 Arms + 2 Tomes. The previews use CL4's defaults: Brawler Greatsword, Lance, Axe; Mage Fire, Thunder, Blizzard; Spell Blade Dark, Bow, Axe; Summoner Katana, Thunder, Blizzard; Paladin Greatsword, Lance, Blizzard; Cleric Dark, Light, Axe | The rules hold for any three; only the previews' examples change. **The revives sit on the Paladin's Lance and the Cleric's Light:** CL4 keeps both in the defaults, and should if it changes |
| [classes](classes.md) | CL11 and CL12: a specialization (Tier 2) and a mastery (Tier 3) per class, shown at the root, picked as a class, not as tree picks. CL15's strike words, so two lines are renamed (SK14) | If a specialization brings its own branch, it becomes a fourth option at the depth-3 fork |
| [gear](gear.md) | GE4: weapons carry the kinds, trees shape. GE6: forms add kinds, never Break +1. GE2: grade replaces Weapon Rank and gates no skill. A weapon with two kinds opens its family's tree | Kinds in the trees would need per-class bans to keep the Brawler physical; this doc recommends against |
| [gear](gear.md) | GE5, GE6, GE10: weapon arts and set bonuses drop, so their A/B fork lives on as Tier 2's tip fork here, with E6's chip cap | — |
| [variance](variance.md) | §7: the Flourish fills the root's template slot, the signature tip the template tip slot | A template branch would cost three nodes in every tree it touches |
| Pacing | The simulation re-baselines Tier 1 on branch A with three weapons ([§10](#10-pacing)) | — |
| Decided items | Superseded for skill trees, to log at review: **T7** (D159; Tier 1 gets one fork a tree, not none), **tier2-classes A3** (Q14; Tier 2's forks are free branches, not points), **weapon-arts E1–E4** (Q15; the fork moves into the tree) | — |

## 9. Save impact

Today `OwnedUma.classes[classId]` is `{ weapons, tree, loadout }`: `tree` lists the side ids she learned. Points aren't
stored; they're her Class Rank less what her sides cost.

| Data | What happens |
|---|---|
| `tree` | **Converted** to picks. On each tree she holds branch B if she learned any node of that tree's B line ([§3.1](#31-tier-1-two-branches-sk6)), else A. `tree` then lists only the forks moved off the default |
| Sides off the B lines | **Deleted:** every depth-1 and depth-2 side, and the third line. They have no place in Tier 1; the third lines return as Tier 2's branch C, not as her picks |
| Side points | Nothing stored, nothing to refund |
| `loadout` | Equipped skills she no longer holds are removed; a loadout left empty goes back to auto (`null`) |
| Trees of weapons that leave her slots | Their picks are kept, as today's ten trees keep theirs |
| `legacy` refs | Retired (tier2-classes A9); always empty |
| Items and gear | Nothing crafted is consumed or deleted by the trees: no material refund |

For example, a Brawler who learned Triple Sunder (`brawler-greatsword.3b`) holds Greatsword's Combo branch. One who
learned only Cataclysm (`brawler-greatsword.4a`) holds the core line, and Cataclysm goes; it's Tier 2's Crush.

- **Every world converts,** Tier 2's included (Umas who ascended through the Rift, H48). A world uses its tier's shape
  once that tier's content ships, and Tier 1's until then.
- **Retired nodes stay in the catalog's full list** (`RPG_ALL_NODES`) so old fights replay; they leave every tree.
  Tier 1's trees need no engine change of their own (they ride engine v16, the Tier 1 rework's, with the classes' lock
  rule and the Flourish). Tier 2's new nodes (Sweep, Hunt, Mighty, Wide, the Break tips, the signature tips) ship in
  **v17** with Tier 2's toolbox, and Tier 3's capstones with Tier 3's ([README §9](README.md#9-engine-save-and-refund)).
- **One save version** carries the conversion: **v26**, the Tier 1 rework's single migration. The API is unchanged.
- **Code that retires:** the side points (`RPG_SIDE_POINTS_PER_LEVEL`, `rpgTreePointsEarned`, `rpgTreePointsSpent`),
  the side gates (`rpgSideNodeLevel`) and D166's points count.

## 10. Pacing

- **New skills come at today's pace.** Depths open at the same Class Ranks, and Class Rank fills as today (2E a win,
  D102). No points to save up; a pick is instant.
- **Tier 1's power is re-baselined, not raised.** Today's balance member learns side A at every depth it can afford and
  equips each weapon's core and side at depth 5, so Auto chooses between two shapes a turn
  (`world/balance-party.ts`). Tier 1's member holds branch A on three weapons (the classes and gear change), one shape a
  tree. The simulation reruns on that member, and the foe budget moves so on-curve win rates stay at
  [combat balance](../combat-balance.md) §0's table. The rate of progression holds; the fights match the new kit.
- **Branches are sidegrades.** Targets for the simulation:
  - a B or C branch beats A by 10–20% of her damage, or her sustain, in its context: three foes or more for a spread, a
    shielded sub-boss or boss for hits or Break;
  - over the world's stages on Auto, a party on any mix of branches lands within ±5 points of win rate of the all-A
    party;
  - the mirror holds on all-A: Spell Blade and Summoner damage a turn within ±5% (H63). A Sweep Spell Blade or a Hunt
    Summoner gains her mirror's context, within ±15% of the mirror there, and never pulls ahead over the world;
  - the guard rail stands: no single Uma Breaks a Duel boss in one act (classes v2 §3.1); the simulation checks each
    class's best branch and tip.
- **Tier 2** adds sidegrades (branch C, the tips) and the Break tip's chip under E6's cap. Tier 2's foe budget
  ([tier2-world](../tier2-world.md)) prices them, as it priced weapon arts.
- **Tier 3:** depth 6 is the depth tables' next step (single-target power 5.6, full-turn MP 30), and two branches give
  Auto a choice a turn again. Tier 3's foe budget prices both.
- **Skill MP** in Tiers 2 and 3 follows tier2-classes A10 (the MP bar's growth).

## 11. Decisions

| Call | Recommendation | Alternatives, briefly | Why |
|---|---|---|---|
| **SK1** What a tree is | One per weapon slot, three a class. The catalog stays class × weapon kind with today's ids. Drawn as one class tree: a root and three weapon trees | One tree per class with weapon limbs; one per kind, shared by every class | The weapon carries kind, shape and grade; ids and replays stay; the root still makes one tree on screen |
| **SK2** What a node costs | Nothing: no skill points at any tier. Branches are exclusive, every fork defaults to A, swaps are free outside fights, and the loadout follows | Every node costs points against a smaller budget; today's points | Removes the asymmetry instead of balancing it; with three weapons today's budget never binds |
| **SK3** What a fork changes | Reach, hits, support or Breaks, never a few percent of power alone. A is today's core line, the anchor | Free-form variants, as today's sides | "No real options" is the complaint; A keeps the simulation's anchor |
| **SK4** Gates | Class Rank only: depths at 1, 10, 20, 30, 40, and 50 in Tier 3. A fork opens with its depth; side gates retire | The weapon's grade per tree; Uma Level | Today's pace (D102), one bar; skills never wait on crafting |
| **SK5** Damage kinds | On weapons. Trees never add a kind | Element branches in the trees | Keeps the Brawler physical, the Mage magical, the 70/30s and the party's weakness puzzle |
| **SK6** Tier 1 | Trunk at depths 1–2; one fork at depth 3 into A (default) and B, the lean by kind or class (§3.1). 8 nodes a tree, all from today's catalog | No fork (T7); a fork at every depth (today) | One real option per weapon, three a class, no new content, no engine change |
| **SK7** Tier 2 | Branch C at the fork; a Power or Break tip fork on every branch (E1's fork moved here); the root shows her specialization | Sides bought with points (A3); weapon arts as their own tree | One more pick a tree, and one place that shapes a skill and sells Break +1 |
| **SK8** Tier 3 | Depth 6 at Class Rank 50, a capstone per branch; she holds two of the three branches; the root shows her mastery | A capstone fork; depth 6 alone | More branches and a master's versatility, with one more pick a tree |
| **SK9** Q17's crossovers | Tier 2's branch C on the leading half's trees: the Spell Blade's Sweep on her Arms, the Summoner's Hunt on her Tomes | A Tier 1 branch; weapon arts | Tier 1 keeps H63's mirror; a crossover is per class, not per weapon; the simulation caps it |
| **SK10** The profile | Root plate, three weapon tabs with a path glyph and a "New" dot, the open tree drawn as nodes and lines, a branch sheet. The points UI retires | Today's rows per depth | Reads as a tree at 390 px, one tree at a time |
| **SK11** Template-only nodes | The root's template slot at every tier; from Tier 2, a third option at one tip fork | A template branch per tree; Extra Stats only | Two small, fixed places, and no content in every tree |
| **SK12** Equipped slots | D159's: 3 → 7 in Tier 1, 3 → 10 in Tier 2, 10 and a master slot in Tier 3 | Two a tree | Fits 15, 15 and 30 skills held; already decided |
| **SK13** The save | Learned sides become picks (B when any node of the tree's B line is learned, else A); the rest is deleted; nothing to refund | Every pick back to A | Keeps the owner's choices where they still mean something |
| **SK14** Names | Today's "… Flurry" line becomes "Rapid …" and the healers' "Heavy …" line "Potent …"; ids stay | Keep the names; new names for the strikes instead | The strikes own Heavy, Flurry and Area in Tier 1 (classes CL15); a branch word shouldn't read as a strike |
