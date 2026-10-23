# The Tier rework: the brief

> **Cross-referenced, 2026-10-22. Nothing here is built.** The owner paused feature work after classes v2 (H53–H63) to
> rework how every system grows across the tiers: Tier 1 is too complex, and the later tiers were getting far more
> complex still. This folder holds one doc and its HTML previews per category, now cross-referenced into one design
> (§7), to be reviewed **one category at a time** with the owner (§10), decided with no open questions, and shipped as
> implementation packets (§9).

## 1. What the owner asked for

**Overall:**
- Simplify Tier 1; let each later tier add depth organically. **The rate of progression is fine as it is**: keep it.
- For every category, show it: small **HTML previews** of the Uma's detail page at every tier, and how every category
  grows across all tiers.
- Fan out, cross-reference every definition together, then review one category at a time. No open-ended questions.
- Things already crafted that the rework deletes get refunded later (probably every raw material back, the owner
  recrafting by hand). That's for implementation; each doc only lists what would be deleted or converted.

**By category** (the owner's points; the docs answer each one):

| Category | The owner's points |
|---|---|
| **Classes** | Simplify Tier 1's baseline class facts. Maybe every class starts with **3 weapon slots**, with proposed defaults that keep every party balanced for every battle. Maybe rework Tier 1 foes' weaknesses. Show every class's trees and the class composition. Show the **class template sheet** per tier: how many weapons, armors, accessories. What other dimensions class selection affects |
| **Weapons (gear)** | The trigger for the rework: weapons and armor sets were getting complicated. If weapons stay **3 per class permanently**, multi-type weapons later make sense. Keep class identity: Brawler physical only, Mage magical only, everything between. Maybe drop crafting weapons: each class has its **base weapons at G0**, and crafting makes **weapon improvement gems** consumed to raise weapon ranks. Show a full weapon progression tree per tier with every branch (Tier 1 probably none). Decide whether weapons carry element or physical properties, or whether that's the skill trees' job |
| **Skill trees** | Incremental by tier. Today the profile doesn't look like a tree: no real options. Show the trees at different tiers. The owner dislikes today's side nodes, which cost skill points while unlocking the next depth's skill costs nothing |
| **Extra Stats** | Heavy Tier 1 simplification: maybe **one planet that raises every stat**, and moons with a few stat nodes each; more as the tiers progress. Preview it |
| **Professions** | The tricky one: the farm was removed once for being too complex; now add a little complexity and simplify too. **Five gathering professions** tied to the five fight types at Tier 1: Farming, Fishing, Mining, Wood Chopping, Fighting for gems. **Five crafting professions**, one per class: Material Processing, Extra Stat Jewel Crafting, Weapon Crafting, Armor Crafting, Accessory Crafting. Later tiers: maybe a secondary profession (another profession's base items, while the main one reaches its higher tiers). Each profession has **4 small buildings** on today's Wilds map, more buildings each tier; **Tier 1 starts with 2 material types per profession**. A real rebalance: if an Uma needs 3 weapons, 5 armors and 1 accessory, everything they need adds up. A visual page with the buildings and amounts |
| **Uma Variance** | Maybe in this rework. Each Uma made a little unique through **Uma Templates** (not class templates): authored bonuses, assigned from her original racing profile, with many templates so even two front-running long-distance Umas differ. E.g. a front runner might get Brawler bonuses or physical-only Extra Stat nodes: she can still be a Mage, without the benefit. Template-only nodes may appear in skill trees and Extra Stats |

## 2. The shared frame every doc starts from

**Reconciled** by the cross-reference pass (§7): every doc now agrees with these numbers and words. The fan-out's
drafts are in git history.

### 2.1 The frame

- **Tiers:** 1–3, 50 levels each; one Uma lives in one tier (D159, tiers.md §3); promotion through the Rift stays.
- **Classes:** the six of classes v2 (D160, live since H61): Brawler, Mage, Spell Blade, Summoner, Paladin, Cleric, in
  every tier. Their identities stay: Brawler all physical, Mage all magical, the hybrids 70/30 each way as a mirror,
  one healer a party. Tier 2 adds a **specialization** (one of two a class), Tier 3 a **mastery** (CL11, CL12).
- **Five fight types:** **physical** (Brawler), **magical** (Mage), **physical hybrid** (Spell Blade), **magical
  hybrid** (Summoner), **healer** (Paladin or Cleric).
- **The calling** (variance U4): each Uma's fight type by one rule from master data (eight rows, by stable id). It sets
  her **starting class** (CL13), her **trade** (PR1) and where her template works. Today's 270 outfits: physical 22.6%,
  physical hybrid 20.7%, magical 17.0%, magical hybrid 17.0%, healer 22.6%.
- **Weapon kinds:** five Arms (Greatsword, Axe, Lance, Bow, Katana) and five Tomes (Fire, Blizzard, Thunder, Light,
  Dark Tome, dealing Fire, Ice, Lightning, Light, Dark). **Weapons carry kinds; trees carry shape** (GE4, SK5).
- **The strikes** (CL1, CL2, CL15): every kind belongs to one. **Heavy**: Greatsword, Katana, Fire, Dark. **Flurry**:
  Lance, Bow, Thunder, Light. **Area**: Axe, Blizzard. A class's three weapon slots are one of each, within its Arms
  count: Brawler 3, Spell Blade and Paladin 2, Summoner and Cleric 1, Mage 0.
- **The class template** (CL6): **3 weapons, 5 armor pieces, accessories 1 · 2 · 3** (Support; + Damage, an Orb; + a
  second Support). Weapons stay at 3 for good; depth comes from forms, trees and Extra Stats.
- **Grades, one rule for every piece** (GE1, GE2): she owns every weapon kind, five armor slots and her accessory
  slots at **G0**; a crafted item raises one a grade, up to **G10**. Grade g is **made** at Craft Lv 5g − 4 and **worn**
  at Uma Lv 5g − 4. No gear ranks. A class switch costs only the weapons she hasn't raised.
- **Skill trees** (SK1–SK4): one tree per weapon slot, three a class, under a class root. **No skill points at any
  tier.** Class Rank opens depths at 1, 10, 20, 30, 40 (and 50 in Tier 3); a fork's branches are free and exclusive,
  branch A the default.
- **Extra Stats** (ES1–ES5): one planet and four moons (Strength, Sorcery, Vigor, Guard), five nodes each; **every open
  node counts**; a node opens with its jewel, in order, at Uma Lv 5g − 4. The core is rebuilt the same each tier.
- **Professions** (PR1–PR4, PR7): ten professions, five **gathering** (Farming, Fishing, Mining, Wood Chopping,
  **Hunting**) and five **making** (Material Processing, Weapon Crafting, Armor Crafting, Accessory Crafting, Jewel
  Crafting). An Uma works one **trade**, her calling's gathering and making pair, on one Craft Level. Each profession
  is **one place** on the Wilds, an uma-art building that exists today, with **four work slots**: ten places and 40
  slots in every tier. Each gathering profession adds one material **pair** a tier (a low and a high type), every
  type an existing item icon: no new art (PR4–PR7, after the owner's review).
- **Uma Templates** (U2–U4): ours, assigned **by rule** from master data (running style, distance, growth rates, read
  by stable id), never a hand-written list of real Umas. 90 templates; each gives a **Flourish** (her calling's root
  node), a **signature tip** from Tier 2 and **her moon** (two nodes).
- **Pacing:** the time to level, the EXP and rewards per fight, and the time to gear an Uma on curve keep today's order
  ([pacing.md](../pacing.md)). One Uma maxed costs 485 refined items against today's 472 (§2.3).
- **Versions** (§9): **engine v16 and save v26 are the Tier 1 rework**, every category, live together. Tier 2's toolbox
  is v17 and v27; Tier 3's is designed with Tier 3.

### 2.2 Every tier at a glance

Drawn in [progression.html](previews/progression.html); one Uma's page in [character-tiers.html](previews/character-tiers.html).

| | Today (every tier) | Tier 1 | Tier 2 | Tier 3 |
|---|---|---|---|---|
| **Class choice** | 6 classes | 6 classes | + a specialization, one of two | + a mastery |
| **Weapon slots** | 5 | 3, one per strike | 3 | 3 |
| **Foes weak to** | 2–5 kinds, half at random | 1 strike | 2 kinds of it | 1 kind of it |
| **Weapon forms** | — | Base: 1 kind | G5 fork: Dual or Pure | G5 fork: Prism, Tempered or Keen |
| **Armor** | 5, a half per piece | 5, her class's half | 5, per piece for the four between | The same |
| **Accessories** | 2: Damage, Support | 1: Support | 2: + Damage (Orb) | 3: + Support |
| **Gear gate** | 24 rank bars | Uma Lv 5g − 4 | The same | The same |
| **Trees she uses** | 5 | 3 | 3 | 3 |
| **Nodes a tree** | 15 | 8 | 14 | 17 |
| **Picks a class** | 25 forks and a 50-point budget | 3 | 6 | 9 |
| **Skills held · equipped** | Up to 50 · 3 → 10 | 15 · 3 → 7 | 15 · 3 → 10 | 30 · 10 and a master slot |
| **Extra Stats nodes** | 100, 5 → 30 active | 25, all count | 29: + Halo (1 kind), Valor | 33: + Halo's 2nd kind, Swiftness |
| **Her moon** | — | 2 nodes | 2 | 2 |
| **Jewel kinds · items** | 3 · 100 Star Gems | 2 · 10 | 3 · 12 | 3 · 12 |
| **Template** | — | Calling, Flourish, moon | + signature tip | Tip at both forks |
| **Work places · slots** | 11 facilities · 33–55 slots | 10 places, existing buildings · 40 (4 a place) | 10 · 40 | 10 · 40 |
| **Pairs a gathering profession** | 8 families × 10 grades | 1 (2 types) | 2 | 3 |
| **Where an Uma works** | Any of 11 | Her trade's 2 places | + a secondary's gathering | Secondary reaches its Tier 2 pair |
| **One Uma maxed, refined** | 472 | 485 (493 with her moon) | 510 (518) | 520 (528) |
| **Hours, Craft Lv 25 speed** | 776 | 822 (835) | 864 (878) | 881 (895) |

### 2.3 One Uma's demand

[Professions](professions.md) owns materials, recipes and amounts (PR8); [gear](gear.md) and
[Extra Stats](extra-stats.md) own the items and how many she needs.

| Item | Made at | Refined a piece | Tier 1 | Tier 2 | Tier 3 |
|---|---|---|---|---|---|
| Weapon Gem (G1–G10) | Forge | 4 | 30 · 120 | 27 · 108 | 27 · 108 |
| Fork gem (G5): Dual, Pure; then Prism, Tempered, Keen | Forge | 4 + one of each tier pair (5) | — | 3 · 27 | 3 · 27 |
| Armor Fittings | Armorer | 2 (grades 1–5), 3 (6–10) | 50 · 125 | 50 · 125 | 50 · 125 |
| Accessory Setting | Charm Shop | 12 · 6 · 4 by slot count | 10 · 120 | 20 · 120 | 30 · 120 |
| Planet and Moon Jewels (shared) | Lapidary | Planet 8, Moon 4, resized from Tier 2 | 25 · 120 | 27 · 120 | 29 · 120 |
| Halo Jewel I–II | Lapidary | Moon recipe + one of each pair of the kind's tier (Tier 3's second kind: Tier 3's pairs) | — | 2 · 10 more | 4 · 20 more |
| **Shared total** | | | **115 · 485** | **129 · 510** | **143 · 520** |
| Her moon: Moon Jewels II and IV | Lapidary | 4 | 2 · 8 | 2 · 8 | 2 · 8 |

Cells are pieces · refined items. Today: 220 pieces, 472 refined (240 gear, 232 Star Gems). A party is five times one
Uma. A second class adds only the weapons she hasn't raised: up to 30 Weapon Gems.

### 2.4 Glossary

One word, one meaning, in every doc and preview.

| Word | Means | Never means |
|---|---|---|
| **Kind** | One of the ten weapon kinds; a Tome's kind is named by its element in kind lists (Fire, Ice, Lightning, Light, Dark) | A strike or a channel |
| **Channel** | Arms (physical, ATK) or Tomes (magical, M.ATK) | — |
| **Strike** | **Heavy**, **Flurry** or **Area**: a set of kinds by shape; a weapon slot's type; a Tier 1 foe's weakness | A skill or branch name (SK14 renamed the two side lines that used them) |
| **Fight type** | Physical, magical, physical hybrid, magical hybrid, healer | — |
| **Calling** | Her fight type and class by U4's rule; with **stride** and **knack**, her template's three readings | Her active class |
| **Uma Template** | "{knack word} {type}", e.g. "Tireless Ironhide" | A class template |
| **Class template** | A class's slots per tier: 3 weapons, 5 armor, 1 · 2 · 3 accessories | — |
| **Grade** | G0–G10 on a weapon, an armor slot or an accessory slot | "Weapon Rank" (retired) |
| **Form** | A weapon's shape of kinds and weak multiplier: Base, Dual, Pure (Tier 2), Prism, Tempered, Keen (Tier 3) | — |
| **Gem** | Only the Forge's weapon items: **Weapon Gem** and the five fork gems (Dual, Pure, Prism, Tempered, Keen Gem) | Anything gathered; anything for Extra Stats. Today's Star Gems retire |
| **Armor Fittings**, **Accessory Setting** | The Armorer's and the Charm Shop's grade items | — |
| **Jewel** | Only the Lapidary's Extra Stats items: **Planet**, **Moon** and **Halo Jewels** | A gem |
| **Stone** | What Hunting gathers: Quartz, Garnet (Tier 1), Sapphire, Diamond (Tier 2), Starstone, Philosopher's Stone (Tier 3); refined, **Cut Quartz** and so on | A gem or a jewel |
| **Raw · refined item** | Gathered · processed one for one at the Workbench (the job is "process") | "Processed item" |
| **Profession · trade** | One of the ten · her calling's gathering and making pair | — |
| **Place · slot** | A profession's one building on the Wilds · one Uma's work in it, shown as a pip | A facility with levels; a hut or a yard (retired with the owner's review) |
| **Pair** | A gathering profession's low (grades 1–5) and high (6–10) type for one tier | — |
| **Secondary** | From Tier 2, one other gathering profession's base pair | Today's "second profession" (Lore) |
| **Trunk · fork · branch · tip · capstone · root** | Depths 1–2 · the depth-3 choice · A, B, C · depth 5 · depth 6 · her class plate | Side nodes, side points (retired) |
| **Specialization · mastery** | A class's Tier 2 passive (one of two) · its Tier 3 mechanic | An advanced class |
| **Flourish · signature tip · her moon** | Her template's root node · its Tier 2+ tip option · her own two-node moon | — |
| **Planet · moons · Halo · Valor · Swiftness** | Extra Stats bodies: every core stat · Strength, Sorcery, Vigor, Guard · one damage kind · Limit start · evasion | — |
| **Orb · Support** | The Damage slot (Tier 2+) · the Talisman or Amulet slot | — |

### 2.5 The stat budget (SB1, working rule, 2026-10-23)

The owner's worry: stat growth across tiers mustn't drift out of balance. [stats-by-tier](previews/stats-by-tier.html)
shows the drafts' problem: gear and Extra Stats give the **same values in every tier** while her level keeps growing, so
the build's share of a stat falls (a Summoner's offense 57% → 43%, HP 28% → 14%, MP 20% → 9% from Tier 1 to Tier 3).

**The rule every standalone doc writes to:** the build keeps **the same share of every stat at each tier's Lv 50**.
Every flat build value (weapon Might, armor, the Orb, the Halo, Extra Stats nodes, template nodes) is written as its
**Tier 1 value × the tier's multiplier**, the growth of an average Uma's base stats: **Tier 1 ×1, Tier 2 ×1.8, Tier 3
×2.6** (base core stat 104.5 → 187 → 269.5 at lifetime Lv 50, 100, 150). The foes' build budget (H45's
`rpgFoeTierBudget`, which today scales the build *down* at higher lifetime levels because it assumes flat values) moves
to the same multiplier.
- **Why:** balance is then one curve, set once in Tier 1 and carried by one number per tier; a source's share is the
  same at every tier, so nothing drifts.
- **The alternative,** flat values (the drafts): the build matters less each tier and every tier needs its own tuning.
- **Docs write values as "T1 value × tier"** so either choice is a one-line change. The overall stat balancing pass
  (§5, after the standalone docs) sets the final numbers by simulation.

## 3. Who owns what

| Doc | Owns | Main interfaces |
|---|---|---|
| [classes.md](classes.md) | Class templates per tier (slots, armor, accessories), default weapon picks, Tier 1 foe weaknesses, the class composition, what class selection affects | Gear (weapon counts), Skill trees (trees per class), Professions (fight type ↔ profession), Variance |
| [gear.md](gear.md) | Weapons (3 a class), their progression per tier and branches, improvement gems, whether weapons carry kinds; armor and accessories progression; armor sets simplified | Classes (slots), Professions (what crafting makes and consumes), Skill trees (where kinds live) |
| [skill-trees.md](skill-trees.md) | The tree shape per tier, what a node costs (the side-node asymmetry fixed), how the profile shows it as a real tree | Classes, Gear, Variance (template-only nodes) |
| [extra-stats.md](extra-stats.md) | Tier 1's single planet and moons, growth per tier, jewels | Professions (Jewel Crafting), Variance (template-only nodes) |
| [professions.md](professions.md) | The ten professions, buildings and materials per tier, the secondary profession, the demand math (what one Uma's gear and Extra Stats need), recipes and amounts, the Wilds map | Gear, Extra Stats, Classes (fight type), pacing |
| [variance.md](variance.md) | Uma Templates: the catalog, the assignment rules (the calling), their bonuses, template-only nodes | Classes, Skill trees, Extra Stats |

Every doc: what exists today (short, with links), the proposal **per tier**, a "Provides" and an "Assumes" section,
what existing save data it deletes or converts (for the refund), how pacing holds, and a closing **Decisions** table
where every call has a recommendation. No open questions. The cross-reference decided every conflict by this table:
the owning doc wins unless that breaks an owner point (§7).

## 4. The previews

- In [`previews/`](previews/), one self-contained HTML file per view, no external scripts, fonts or images; each copies
  the style block from [`previews/_template.html`](previews/_template.html) (the game's own colours, light and dark).
- **Full desktop pages** (the owner, 2026-10-22): roadmaps, charts, diagrams and drawn trees over walls of tables, with a
  "Show the numbers" table under each chart and hover detail. The style reference is
  [progression.html](previews/progression.html) (copy its style block); [stats-by-tier](previews/stats-by-tier.html)
  is the second example. The first round's phone-width previews are superseded by the standalone docs' pages.
- **Nothing from the original games:** no real Uma names, skill names or art. Invented names ("Uma A", "a front
  runner, long distance") and our own words.

| View | Previews |
|---|---|
| **Every category** | [The Uma's detail page at Tier 1, 2 and 3](previews/character-tiers.html) · [every category × every tier](previews/progression.html) |
| Classes | [composition](previews/classes-composition.html) · [strikes](previews/classes-strikes.html) · [template sheets](previews/classes-template-sheets.html) · [trees](previews/classes-trees.html) |
| Gear | [weapon tree](previews/gear-weapon-tree.html) · [the Gear tab by tier](previews/gear-loadout.html) · [crafting by tier](previews/gear-crafting.html) |
| Skill trees | [trees by tier](previews/skills-trees-by-tier.html) · [every class at Tier 1](previews/skills-all-classes-t1.html) · [the Skills tab](previews/skills-profile.html) |
| Extra Stats | [the map by tier](previews/extra-stats-maps.html) · [what it gives](previews/extra-stats-budget.html) |
| Professions | [the Wilds map](previews/professions-map.html) · [the flow](previews/professions-flow.html) · [demand against supply](previews/professions-demand.html) |
| Variance | [the catalog](previews/variance-templates.html) · [two front runners](previews/variance-two-umas.html) · [her profile by tier](previews/variance-profile.html) |

## 5. Cross-reference, then review

1. **Fan-out:** the six docs and their previews, written in parallel from §2's drafts. *Done.*
2. **Cross-reference:** one pass reconciled every doc's "Assumes" against the others' "Provides", fixed the shared
   numbers in §2, and built the two views that need every category. *Done: §7–§9.*
3. **Standalone docs, detailed, one at a time** (the owner, 2026-10-23), each authored, then reviewed by the owner, its
   decisions logged as D-rows. They absorb the first-round docs, which stay as history:
   1. [class-progression.md](class-progression.md): the six classes, class templates per tier, equippable weapons,
      the class trees (skill trees) per tier, Class Rank, specializations and masteries, foe weaknesses, the calling
      pick. Absorbs classes.md and skill-trees.md.
   2. **weapon-progression.md:** weapons per tier, weapon trees (forms), armor and accessories, material requirements.
      Absorbs gear.md.
   3. **extra-stats-progression.md:** the planet, moons and later bodies drawn, everything each grants per tier, jewels.
      Absorbs extra-stats.md.
   4. **profession-progression.md:** the professions, places, material types, recipes and amounts. Absorbs
      professions.md.
4. **Then:** the overall stat balancing (by simulation, on §2.5's rule); Uma Templates folded into the standalone docs
   (variance.md); then implementation packets behind engine v16's switch, with the refund (§9).

## 6. Status

| Doc | State |
|---|---|
| classes.md | Cross-referenced: CL5, CL13, CL14 changed |
| gear.md | Cross-referenced: §8's amounts are professions'; no GE call changed |
| skill-trees.md | Cross-referenced: no SK call changed |
| extra-stats.md | Cross-referenced: ES12 changed |
| professions.md | Cross-referenced: PR1 changed; Tier 3's numbers corrected. **Revised after the owner's first review (2026-10-22):** PR3–PR7, PR10, PR14 changed (PR-R1) |
| variance.md | Cross-referenced: no U call changed |
| Cross-reference | **Done, 2026-10-22.** Next: the owner's review (§10) |

## 7. Cross-reference log

Each conflict, the call and why. **XR** rows are the pass's own calls, presented with the frame (§10). Every changed
row in a category doc says "Changed in cross-reference".

| # | Conflict | The call | Why |
|---|---|---|---|
| **XR1** | **Gear vs Professions on amounts.** gear.md §8 drafted rotating pairs and triples, about 220 refined for gear; professions.md drafted fixed recipes, gear 365 and jewels 120 | **Professions' recipes and counts:** Weapon Gem 4 refined, Armor Fittings 2 / 3, Accessory Setting 12 · 6 · 4, a fork gem the G5 recipe plus one of each tier pair. Gear keeps its products, kinds, forms and counts (30 gems, 50 fittings, 10 · 20 · 30 settings) | §3: professions owns amounts. Fixed sets keep each trade near a fifth of the work (19.7–20.6%), and the Uma's total, 485, stays at today's 472; gear's 220 would idle the gear trades and cut an Uma by a quarter |
| **XR2** | **Naming.** Gear's "gems", Extra Stats' "jewels", variance's "Moon Gem", professions' "Gem Hunting", gear's "processed items" | **One vocabulary (§2.4):** gem = the Forge's weapon items only; jewel = the Lapidary's Extra Stats items; stone = what the hunt gathers; the profession is **Hunting**; refined items, as today | No item word means two things. The owner's "weapon improvement gems" and "Extra Stat Jewel Crafting" are kept as written; "fighting for gems" is what Hunting is |
| **XR3** | **Extra Stats vs Variance on her moon.** ES12 grew lead and knack tracks 2 · 4 · 6 (Tier 1 lead +6 at Lv 26) and split a Mighty knack half and half; variance drew two nodes every tier (knack +4 at Lv 16, lead +8 at Lv 36) and needed evasion or Limit on node I although ES6 keeps them off the shared map | **Variance's two nodes in every tier:** I knack +4 (Lv 16, Moon Jewel II, every class; Mighty +4 DEF and +4 M.DEF, as Guard), II lead +8 (Lv 36, Moon Jewel IV, her calling's channel). **Extra Stats' map rules:** ×1 a node of its grade, Lv 5g − 4, every open node counts, ids `template:1–2`. ES6 already names her knack as Tier 1's home for evasion and Limit | §3 gives template-only nodes to variance. A growing moon would push Tier 3 past professions' tenth-more work budget (PR10: 35 + 16 > 48) and to the edge of variance's +5% (U12); the template's later depth is the signature tip |
| **XR4** | **Classes vs Variance on the starting class.** CL13 adopted only "a Pace chaser with Power over Wit starts as a Spell Blade"; variance's calling has eight rows | **CL13 adopts U4's eight rows** (Pace sprinters with Power → Brawler, Wit-led closers → Summoner too) | Every class has starters, the start and the calling never disagree, and each fight type lands at 17–23%, which professions' PR1 relies on |
| **XR5** | **The hybrid mirror.** Full maps give the Summoner ATK for her Arms half (+10–15% damage a turn by hand) and the Spell Blade M.DEF; nobody owned the re-check | **classes.md owns it (CL5):** a simulation item for the Tier 1 packet, on the full template; target H63's mirror, equal damage a turn ±5% and 70/30 ± 5 each way; the knob is the hands (the Summoner's Arms hand first), never the map | Classes owns the hands; the map stays class-free (ES1) |
| **XR6** | **Weapons owned per kind.** gear.md gives each Uma ten weapons at G0, shared by every class; professions counted 30 Weapon Gems; nobody said what a class switch costs | **Kept, and stated** (gear §3.1, classes §6, professions §5.5): professions' 30 = one class's 3 weapons × 10 grades. A class switch costs only the weapons she hasn't raised, 0–30 Weapon Gems from the defaults; armor and accessory grades sit on the slot. Promotion resets every grade, so re-picking is free then | Switching stays cheap, as the owner's free switching wants; demand math counts what one class uses |
| **XR7** | **Strike words.** Heavy, Flurry, Area as strikes; skill lines named "… Flurry" and "Heavy …"; a Dual's second kind | **Strike words are strikes only:** SK14's renames stand ("Rapid …", "Potent …"); a core named for its own weapon's strike keeps its name (Heavy Slash, Thrust Flurry); a Dual keeps its first kind's slot and strike (gear §4.1, added); "Sweep", SK9's branch C, stays (a branch in the Skills tab, not a strike badge beside the Sweep Ticket, CL15's worry) | One meaning on every badge. The previews were fixed: the Gear tab's Spell Blade held two Heavy weapons; the weapon tree gained a strike column; the classes' tree preview now dims what Tier 1 drops |
| **XR8** | **Two calling rules.** professions.md §4 drafted its own fallback trade rule (no Cleric callings, a different split) | **One rule:** U4's, a pure function that ships with Professions if Professions ships first (PR1) | One Uma, one fight type |
| **XR9** | **Armor in classes' save rows** kept every piece; gear.md deletes and refunds them | **Gear's GE15:** every crafted piece goes, refunded; the slot holds the grade | Gear owns pieces |
| **XR10** | **Engine and save versions.** Gear put Tier 2's forms in "v16"; classes put Tier 1's rules in "v16 if it's next"; skill trees put Tier 2's nodes in "their tier's engine" | **v16 and v26 are the Tier 1 rework,** all six categories, built as packets behind one switch and live together (as classes v2 did, H53–H61). **v17 and v27 are Tier 2's toolbox.** Tier 3's comes with its design. Until v17, Tier 2 worlds play Tier 1's shape | Tier 1's pieces only balance together (three weapons need the strike rule; the on-curve build changes once). One migration computes the refund once, against one conversion table. Tier 2's term (Z4) needs its own simulation pass |
| **XR11** | **Tier 3's new pieces.** professions.md counted about 25 tier-pair items; Tier 3 has 3 fork gems and 4 Halo Jewels (two kinds) | **35 items:** Tier 3 maxed is 520 refined, 881 h, inside PR10's 48 | Arithmetic |
| **XR12** | **Her moon's jewels** were outside every total | **Counted beside the shared demand:** 2 Moon Jewels a tier, 8 refined, about 14 h (493 · 518 · 528 refined) | Every Uma has one; it stays outside the foe budget and the trades' shares |
| **XR13** | **The Lapidary's numbers.** extra-stats.md assumed 30 jewels at 4–5 refined | **Professions' final:** Planet Jewel 8, Moon Jewel 4: 120 per Uma in Tier 1; 130 and 140 with the Halo Jewels' tier pairs | Professions owns amounts |
| **XR14** | **"Tier 2 classes"** in variance.md and its preview | **Specializations:** the same six classes; her Flourish works in either specialization of her calling | CL11 |
| **XR15** | **Tier 2's toolbox term** (Z4) was priced on advanced classes, weapon arts, sets and the outer ring | **One term, as Z4 says, with the rework's tools:** the specializations, forms, the Orb's return, branch C and the Break tips, the Halo, Valor; Tier 2's simulation prices it (v17) | Keeps D170's restart-and-scale; only the tools change |
| **XR16** | **Gear Marks, Manuals, the Rift's gear EXP** | **Gear Marks become Class Marks one for one (GE15); gear Manuals go; the Rift's echoes pay Class EXP only** (gear §11) | Nothing earned is lost; nothing feeds a retired bar |
| **PR-R1** | **The owner's review of Professions (2026-10-22):** "way too much for how many structures to keep track of" (10 yards of 4 · 6 · 8 one-Uma huts: 40 · 60 · 80), and "fully reuse" the farm's and the Wilds' art | **One existing building per profession, four work slots inside** (professions §0, option A of three): 10 places and 40 slots in every tier; each place an uma-art building (`mine`, `forest`, `fields`, `fishery`, `monster-den`, `workbench`, `forge`, `lancers-barracks` for the Armorer, `arcane-armory` for the Charm Shop, `lapidary`), each material an item icon that exists (Fishing's high type is Ammonite, not a new Pearl). Tiers add a material pair, never a building or slot. No kit change, no new art. The demand doesn't move (485 · 510 · 520 refined, 493 · 518 · 528 with her moon); Tier 3's second Halo kind takes the Tier 3 pairs, which had no use. **Corrected:** today's roster is Forge-bound (a run of twenty, 24 days), the rework's about 17 | Ten structures instead of 40–80, one job a page, one row of pips; five lodges (B) save five places but put two jobs on a page. With the huts gone, the twenty materials are most of what's left to track, the same in every option |

**Checked, no conflict:** the six classes' default weapons in every doc and preview (CL4); the revives on the
Paladin's Lance and the Cleric's Light (SK6 needs CL4 to keep them, and it does); accessories 1 · 2 · 3 in classes,
gear, the template sheets and the Gear tab; Class Rank gates (SK4) against gear's level gates (they never wait on each
other); the Halo and Orb bound (+68, ES8 and gear); feet armor keeping evasion (gear §3.2, ES6); one Craft Level per
Uma; free class switching everywhere.

## 8. What the rework supersedes

Old docs stay as they are, for history; the D-rows of each review record these.

| Old decision or doc | It said | The rework | Where |
|---|---|---|---|
| **tiers.md T6** (D159), Option A's table | A growing toolbox: advanced classes, weapon arts, sets, the outer ring, class constellations, a second vertical | **The principle stays** (same battle rules, a growing toolbox); every row of its table is replaced by this folder's | [progression.html](previews/progression.html) |
| **tiers.md T7** (D159) | Tier 1 cores only; existing sides kept until promotion | **Replaced:** one free fork a tree (SK6); learned sides convert to picks (SK13) | skill-trees §3.1, §9 |
| **tiers.md T8** (D159) | Twelve advanced classes | **Replaced** by specializations: the six classes stay, each picks one of two passives (the twelve, CL11) | classes §3.3 |
| **tiers.md §6**, Tier 3 | Awakening at G10; class constellations; a master class per advanced class | Awakening → Tier 3's G5 fork (GE8); constellations dropped (ES10); a mastery per class, six (CL12) | gear §5, extra-stats Tier 3, classes §4 |
| **tier2-classes.md** (H39, Q14) | A1 free switching among twelve; A2 leans ±0.1; A3 today's side rules; A4 names; A5 the twelve passives; A6 the Ascend pick; A7 Hero LB+; A8 LB power; A9 no Tier 1 skills carry; A10 skill MP ×1.7 | A1, A2 **dropped** (six classes, no lean change); A3 **replaced** by SK7 (branch C, tip fork, no points); A4, A5 **kept** as the specializations; A6 **kept** as the default pick's rule, no Ascend sheet; A7, A8, A10 **untouched**; A9 **kept** (SK13) | classes CL11, skill-trees SK7 |
| **weapon-arts.md** (H40, Q15) | E1 a core and an A/B fork per weapon; E2 Weapon Rank gates; E3 per weapon; E4 Lore Scrolls; E5 what an art touches; E6 the Break cap; E7 thirty nodes; E8 armor sets; E9 Lore Seals | E1's A/B fork **moves into the class tree** as Tier 2's Power or Break tip (SK7); E6 **kept** for the Break tip; E7 **replaced** by forms (GE6, GE8); E2–E5, E8, E9 **dropped** (GE10) | gear §4–§6, skill-trees §3.2 |
| **extra-stats-tier2.md** (H41, Q12) | X1 the Halo; X2 a pair per kind, grades 5 and 10; X3 flat; X4 one specialty slot; X5 twenty ring gems from a second-profession item; X6 an outer orbit; X7 Orb + ring ≤ a G10 weapon's Might; X8 the inner map unchanged | X1, X3, X6, X7 **kept**; X2 **kept** for one kind (Tier 2) and a second (Tier 3); X4 → a free kind setting (ES8); X5 → Halo Jewels I–II from the Moon recipe and Tier 2 pairs (PR10); X8 **replaced** (the inner map is the planet and moons) | extra-stats Tier 2–3 |
| **second-profession.md** (H42, Q13) | Lore Level, Relics and Glyphs, three Tier 2 sites, Scrolls and Seals | **Replaced:** a secondary gathering profession (PR11), one more pair a tier (PR10); no Lore (PR12) | professions §6–§7 |
| **tier2-world.md** (H43, Q16) Z2 | The same biomes and signatures, every foe's shield +1 | **Weakness counts reworked:** a Tier 2 foe is weak to two kinds of its strike (CL10); the shield +1 stays Z2's | classes §3.1 |
| **tier2-world.md** Z4 | One Tier 2 term (+15% HP and defense, +10% offense by Lv 50) from H39–H41's tools | **One term kept;** its tools re-listed (XR15), priced with v17 | extra-stats Assumes |
| **tier2-world.md** Z9 | Fronts that test weapon arts and the outer ring | Fronts test forms, Break tips and the Halo instead | gear §11, skill-trees §10 |
| **Q9** (keep the Limit stat) | Keep it | **Answered:** off Tier 1's shared map (her knack keeps it), back as Tier 2's Valor moon (ES6, ES9) | extra-stats |
| **Q10** (variance sketch) | Distance as a hard limit; her unique skill as a passive; gold skills | **Replaced** by Uma Templates: nothing from the original's skills (U2, U7) | variance |
| **Q17** (hybrid crossovers) | A Spell Blade sweep side, a Summoner focus side | **Answered:** Tier 2's branch C, Sweep and Hunt, on the leading half's trees (SK9) | skill-trees §3.2 |
| **Today's rules the rework retires** | Two typed accessory slots (C10, D124); rotating recipe pairs (D139); facilities and upgrades (D144); side points and their dot (D166); side gates (D102's); weapon, armor and accessory ranks and Gear Marks; Star Gems and active slots; the start by style alone (D162, D180) | GE11; PR8; PR4–PR6; SK2, SK10; SK4; GE2, GE15; ES5, ES7; CL13 (D180's split kept inside the calling) | Each doc's §1 "Today" |

## 9. Engine, save and refund

**The version plan (XR10).** Engine **v16** and save **v26** carry the Tier 1 rework, every category, in every world:
the packets land behind one switch (`caps.ts`) and go live together. Engine **v17** and save **v27** carry Tier 2's
toolbox. Tier 3's version comes with its design. v6–v15 fights replay on their own engine; stored fights keep their
frozen inputs.

### 9.1 Engine v16: Tier 1

| Change | From | Kind |
|---|---|---|
| Input checks per tier: three weapons, one per strike, within the class's Arms count; Tier 1's one accessory, a Support | CL1, CL7, GE11 | Validation |
| Locks in Tier 1: each Uma whose act lands a weak hit breaks one; the Duel alternates a weak Arms act and a weak Tome act | CL8 | Rule |
| The Flourish's three MP twists: Opening (her first skill each fight free), Even pace (skills −25% MP), Second wind (3% max MP a round from round 3), on as her calling | U9 | Rule |
| No engine change: strike weaknesses (a strike is its kinds), shields by strike, the Tier 1 trees (every node exists today), Extra Stats and her moon (points frozen at a fight's start), Might and armor by grade | CL2, CL9, SK6, ES, GE3 | Generator, data |

### 9.2 Engine v17: Tier 2's toolbox

| Change | From |
|---|---|
| Weapon forms: a hit's extra kinds count for weaknesses and locks (Dual; Prism and Tempered later); a weak multiplier per weapon (Pure, Tempered ×1.5; Keen ×1.7) in place of `BATTLE_WEAK` | GE6, GE8 |
| The Damage slot (an Orb) returns from Tier 2; the second Support in Tier 3 | GE11 |
| The Halo: flat offense on one kind's hits (two kinds in Tier 3), with the Orb at most +68 | ES8, ES10 |
| Branch C nodes (Sweep, Hunt, Mighty, Wide; the Brawler's and Mage's third lines exist) and the Break tips (one more shield point on a weak hit, once an act, under E6's cap) | SK7, SK9 |
| The twelve specializations' passives | CL11 |
| The signature tips: Breakaway, Spread, Long haul | U16 |
| Tier 2 foes weak to two kinds of their strike | CL10 (generator only) |
| **Tier 3, later:** depth 6 capstones, two branches held, the masteries | SK8, CL12 |

### 9.3 Save v26: one migration, every world

| Data | Change | From |
|---|---|---|
| `classes[id].weapons` | 5 → 3, by strike: she keeps the kind she had in each strike and channel, else the default | CL save |
| `uma.gear` (`locker`, `equipped`, `kinds`) | Replaced by grades: one per weapon kind (10), per armor slot (5) with its half, per accessory slot with its type; all G0 | GE1, GE9, GE11 |
| `world.gear`, Forge jobs | Deleted, refunded; jobs collected or recalled | GE15 |
| `uma.ranks.weapons`, `armors`, `accessories` | Deleted | GE2 |
| `wallet.gearMarks` | Class Marks, one for one | GE15 |
| The Warehouse | New shelves: Weapon Gems, Armor Fittings, Accessory Settings (G1–G10), Planet and Moon Jewels (I–V) | GE12, ES7 |
| `classes[id].tree`, `loadout`, `legacy` | Learned sides → picks (B if any B-line node, else A); other sides deleted; loadout pruned; `legacy` retired | SK13 |
| `stars.unlocked`, `stars.active` | → `stars: { open, halo: [] }`, fresh ids (`planet:`, `strength:` … `template:1–2`) | ES save |
| `gems` (Star Gems), Lapidary cuts | Deleted, refunded; cuts collected or recalled | ES14 |
| `items` (160 ids) | Converted one for one to the 20 Tier 1 types by family and grade band | PR14 |
| `buildings`, `work`, place ids | Levels dropped (upgrades refunded); work settled; ids kept, removed or new | PR14 |
| `OwnedUma.craft` | Kept | PR14 |
| The template | Nothing stored; new unlocks start in their calling | U13, U8 |

**Save v27 (Tier 2):** weapon forms and a Dual's kind per weapon; Tier 2's accessory slots; `stars.halo`;
`OwnedUma.secondary`; a specialization per class; branch C and tip picks (Power, Break, signature).

### 9.4 The refund

The owner's lean (GE15, ES14, PR14): every raw item back, recrafted by hand. Computed from the save alone.

| Deleted | Comes back as |
|---|---|
| Crafted gear in stock and bound to any Uma, every Orb and support, in every world | Each piece's 2 refined items as their 2 raw items (today's ids), then converted by professions' table |
| Forge jobs | Finished outputs collected, then refunded as pieces; unfinished inputs returned, then converted |
| Star Gems in stock and set on nodes | Each gem's refined inputs as raw items, then converted |
| Lapidary cuts | As Forge jobs |
| Facility upgrades (up to 22 a world) | Their Laurels, and their refined items converted |
| Weapon, Armor and Accessory Ranks | Nothing: Uma Level is the new gate |
| Gear Marks | Class Marks, one for one |
| Side skills learned | Nothing to refund: points were never stored |
| Items in stock, work in progress | Converted one for one, not refunded; only time in progress is lost |

**Volume:** a fully built Lv 50 Uma returns about 472 raw items (240 from gear, 232 from Star Gems) against the 485 the
reworked Tier 1 asks (493 with her moon).

### 9.5 Simulation items for the Tier 1 packet

1. **Re-baseline:** an on-curve party (three weapons, branch A, one Support, the full map, no Orb, no template) wins
   every Tier 1 stage within 3 points of today's table; the Orb's offense (−4% at Lv 1 to −16% at Lv 50) is put back
   through the foe budget (CL §10, GE §13, SK §10, ES13).
2. **The mirror on full maps:** Spell Blade and Summoner damage a turn within ±5%, each 70/30 ± 5; Paladin vs Cleric
   ±10% (XR5, CL5).
3. **Strikes:** shields to the first Break within ±0.5 rounds (CL9); Auto cancels charged moves as today ±5 points
   (CL8); the fronts inside rift.md §11's bands; no single Uma Breaks a Duel boss in one act.
4. **Branches:** a B branch +10–20% in its context; any mix within ±5 points of all-A (SK §10).
5. **Extra Stats:** MP +21 in the Springs test (ES13).
6. **Templates:** five matched Umas within 3 points; the mirror with both matched; the Springs with the MP twists (U12).

## 10. Review order

One category at a time; each ends with its D-rows. The cross-reference changed the rows marked ✱.

**0. The frame** (§2, §7, §9), 4 calls: **XR2** the vocabulary (§2.4) · **XR6** weapons owned per kind, a class switch
costs only unraised weapons · **XR10** v16 / v26 is the Tier 1 rework, v17 / v27 Tier 2's · **the refund** (§9.4: every
raw item back, recrafted by hand). The other XR rows land inside the categories below.

**1. Classes**: 15 calls, CL1–CL15. [classes.md](classes.md), previews: composition, strikes, template sheets, trees.

| Call | One line |
|---|---|
| CL1 | Three weapon slots in every tier, one per strike; the class sets the Arms count |
| CL2 | A Tier 1 foe is weak to one strike, by the element ring read one level up |
| CL3 | "Balanced" is three tests a script checks before any fight |
| CL4 | Default weapons: the hybrids' Heavy in their minor channel, the healers' Area in theirs |
| CL5 ✱ | Hands unchanged; the mirror re-checked on full Extra Stats maps, the hands the knob |
| CL6 | Template per tier: weapons 3 · 3 · 3, armor 5 · 5 · 5, accessories 1 · 2 · 3 |
| CL7 | Tier 1's one accessory is the Support slot; the Orb returns in Tier 2 |
| CL8 | A Tier 1 lock breaks to a weak act |
| CL9 | Shields by strike: Flurry-weak ×1.5, an Area-weak crowd +1 (drafts) |
| CL10 | After Tier 1 the strike stays and the kinds narrow: two in Tier 2, one in Tier 3 |
| CL11 | Tier 2's advanced classes become specializations of the six |
| CL12 | Tier 3: a mastery per class, six, designed with Tier 3 |
| CL13 ✱ | New Umas start in their calling, all eight rows |
| CL14 ✱ | A class switch moves no job; her trade follows her calling |
| CL15 | The strikes are called Heavy, Flurry and Area |

**2. Gear**: 16 calls, GE1–GE16. [gear.md](gear.md), previews: weapon tree, Gear tab, crafting.

| Call | One line |
|---|---|
| GE1 | She owns her gear at G0; one crafted item raises one slot one grade |
| GE2 | Uma Lv 5g − 4 gates grade g; gear ranks, Gear Marks and gear Manuals retire |
| GE3 | A weapon's power is its grade's Might, today's table, in every tier |
| GE4 | Weapons carry kinds; trees carry shape and effects |
| GE5 | Tier 1 weapons are a straight line, no choice |
| GE6 | Tier 2's G5 fork: Dual (a second kind) or Pure (weak hits ×1.5) |
| GE7 | An extra kind counts only in a class that wields its channel; it never splits a hit |
| GE8 | Tier 3's G5 fork: Prism, Tempered or Keen |
| GE9 | Armor: the slot holds the grade; her class's half in Tier 1, per piece from Tier 2 for the four between |
| GE10 | Armor sets dropped |
| GE11 | Accessories 1 · 2 · 3: Support, + Damage (an Orb), + a second Support |
| GE12 | Crafting makes Weapon Gems, Armor Fittings, Accessory Settings and fork gems (amounts are professions') |
| GE13 | Another fork gem changes a form; the grade stays |
| GE14 | Promotion: forms carry, grades reset, used items return to the old world |
| GE15 | Delete crafted gear and ranks, refund the raw items, Gear Marks become Class Marks |
| GE16 | One word, "grade", G0–G10 |

**3. Skill trees**: 14 calls, SK1–SK14. [skill-trees.md](skill-trees.md), previews: trees by tier, every class at
Tier 1, the Skills tab.

| Call | One line |
|---|---|
| SK1 | One tree per weapon slot, three a class, drawn under a class root |
| SK2 | No skill points at any tier; branches are free, exclusive and swappable |
| SK3 | A fork changes reach, hits, support or Breaks, never a few percent alone |
| SK4 | Class Rank gates only: depths at 1, 10, 20, 30, 40 (50 in Tier 3) |
| SK5 | Trees never add a damage kind |
| SK6 | Tier 1: a trunk and one fork at depth 3 into A or B; 8 nodes, all in today's catalog |
| SK7 | Tier 2: branch C and a Power or Break tip fork; the root shows the specialization |
| SK8 | Tier 3: depth 6 capstones, two branches held, the mastery at the root |
| SK9 | Q17's crossovers are Tier 2's branch C: Sweep and Hunt |
| SK10 | The Skills tab draws a real tree; the points UI retires |
| SK11 | Template-only nodes: the root's slot every tier, a third tip option from Tier 2 |
| SK12 | Equipped slots: 3 → 7, 3 → 10, 10 and a master slot |
| SK13 | Learned sides become picks; the rest are deleted; nothing to refund |
| SK14 | The "… Flurry" lines become "Rapid …", the "Heavy …" lines "Potent …" |

**4. Extra Stats**: 16 calls, ES1–ES16. [extra-stats.md](extra-stats.md), previews: the map, the budget.

| Call | One line |
|---|---|
| ES1 | Tier 1: one planet and four moons (Strength, Sorcery, Vigor, Guard), five nodes each |
| ES2 | The planet gives +1, +2, +4, +6, +8 to all six core stats |
| ES3 | A moon node is worth its grade; Guard gives both defenses |
| ES4 | A node opens with its jewel, in order, at Uma Lv 5g − 4 |
| ES5 | Every open node counts; no active slots |
| ES6 | Speed and Limit leave Tier 1's shared map; her knack keeps them |
| ES7 | Two jewel kinds in Tier 1: Planet Jewel I–V, Moon Jewel I–V |
| ES8 | Tier 2's Halo: one damage kind, flat +10 then +34 |
| ES9 | Tier 2's Valor moon: Limit start +4 |
| ES10 | Tier 3: the Halo's second kind and the Swiftness moon; no class constellations |
| ES11 | The same core, rebuilt each tier |
| ES12 ✱ | Her moon: variance's two nodes in every tier |
| ES13 | The foe budget is unchanged; on curve is every node her level opens |
| ES14 | Old maps and Star Gems deleted, raw items refunded |
| ES15 | Names: the Planet, the moons, Planet, Moon and Halo Jewels; today's icons |
| ES16 | Targets plan her class's bodies; "can upgrade" counts jewels she can set now |

**5. Professions**: 15 calls, PR1–PR15. [professions.md](professions.md), previews: the Wilds map and the options,
the flow, demand. Revised after the owner's first review (PR-R1): the rows marked ◆ changed.

| Call | One line |
|---|---|
| PR1 ✱ | Her trade follows her calling's fight type; one rule (U4) |
| PR2 | One trade an Uma: a gathering and a making profession, one Craft Level |
| PR3 ◆ | Mine · Forge, Forest · Armorer, Fields · Workbench, Fishery · Charm Shop, Monster Den · Lapidary |
| PR4 ◆ | A profession is one existing building with four work slots: 40 in every tier, no upgrades, ×1.25 (option A of three) |
| PR5 ◆ | Ten places in today's ten side spots, one row a trade, one row of pips |
| PR6 ◆ | Reuse only: ten existing building frames, sixty existing item icons; no kit change, no new art |
| PR7 ◆ | Two material types a gathering profession, low for grades 1–5, high for 6–10, all today's ids (Fishing's high: Ammonite) |
| PR8 | One fixed recipe an item; each trade about a fifth of the work (gear adopts it) |
| PR9 | Make time: one gather's time a refined item in the piece |
| PR10 ◆ | Each tier: one more pair and new pieces within a tenth more work; places and slots stay |
| PR11 | A secondary gathering profession from Tier 2 |
| PR12 | Today's second-profession proposal (Q13) replaced |
| PR13 | The Exchange sells every type, by pair |
| PR14 ◆ | Old saves: stock converted, work collected, upgrades refunded, Craft Level kept; six place ids kept, five removed, four new |
| PR15 | A Trade filter in the Stable |

**6. Variance**: 16 calls, U1–U16. [variance.md](variance.md), previews: the catalog, two front runners, her profile.

| Call | One line |
|---|---|
| U1 | In the rework, as its own packets, the display first |
| U2 | A template is three readings filling a Flourish, a signature tip and a moon |
| U3 | 90 templates: 18 types × 5 knacks |
| U4 | The calling's eight rows |
| U5 | Stride: the longest distance at her best grade |
| U6 | Knack: her top growth rate |
| U7 | Not read: surface, her skills, her name or id |
| U8 | New unlocks start in their calling |
| U9 | The Flourish: an MP twist by stride, on as her calling |
| U10 | Her moon: a knack node in every class, a lead node in her channel |
| U11 | Professions: only the trade link |
| U12 | About +5% at most when matched; never negative |
| U13 | Derived each time, never stored |
| U14 | Named "{knack word} {type}" |
| U15 | No party synergy |
| U16 | A signature tip from Tier 2 |

**In all: 92 category calls** (Classes 15, Gear 16, Skill trees 14, Extra Stats 16, Professions 15, Variance 16), and
the frame's 4. Nothing is left for the owner to settle outside these reviews.
