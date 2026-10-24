# Extra Stats Progression: the Planet and its moons from Tier 1 to Tier 3

> **Authored 2026-10-24. Nothing here is built.** The third standalone doc of the Tier rework
> ([README §5](README.md#5-cross-reference-then-review), step 3.3). It absorbs [extra-stats.md](extra-stats.md), which
> stays as history, and supersedes every ES call ([§17](#17-decisions) maps each one). Calls are **EP1–EP22**, each with
> a recommendation. No open questions.
>
> **What changed from the first round:** every value is written **Tier 1 value × tier** under SB1
> ([README §2.5](README.md#25-the-stat-budget-sb1-working-rule-2026-10-23)): × 1, × 1.8, × 2.6 (EP7). **Vigor gives both
> pools, HP and MP** (EP4), because accessories turn damage-oriented and the Spring Amulet's MP regen goes (§9). The
> Halo's second kind gets its own jewels, **Halo Jewels III–IV**, so a jewel's numeral is always the node it opens
> (EP17). Jewel recipes are **one fixed amount a jewel in every tier** (Moon 4, Planet 8, Halo 5), the types by
> profession-progression.md's ladder, with exact totals per Uma (EP18). Everything else
> of the first round's shape stands: one Planet, four moons, five nodes each, every open node counting.
>
> **The owner's context, 2026-10-24, decided elsewhere and kept here:** accessories become damage-oriented (defensive
> and MP-regen ones go; defense lives in armor; weapon-progression.md); weapons grow by Pure or Dual branches
> ([weapon-research.md](weapon-research.md)), and Extra Stats never adds a kind; class specializations become
> weapon-group focus (this doc only says how the Halo serves a group, EP10); Uma uniqueness stays minimal, so her moon
> is a marked two-node slot (EP14, with [class-progression CP36](class-progression.md#69-her-template-on-the-trees-affinity-cp36)'s note).
>
> **Pages** (full desktop, light and dark): [the map at every tier, every node](previews/stars-maps.html) ·
> [everything it grants, and the build share by tier](previews/stars-grants.html) ·
> [the jewels, recipes and per-Uma totals](previews/stars-jewels.html).
>
> **Interfaces, not designed here:** accessories, armor, the Orb and weapon branches (weapon-progression.md); material
> amounts and the Lapidary's place (profession-progression.md, which reads [§11](#11-jewels)); her moon's content
> (the Uma Templates pass); class specializations (class-progression.md).

## The owner's points

| The owner's point | Answered in |
|---|---|
| "Extra Stats needs heavy Tier 1 simplification" | [§3](#3-tier-1-the-planet-and-four-moons): 25 nodes instead of 100, two node kinds, two jewel kinds and ten items, no active slots; the count in [§3.5](#35-tier-1s-complexity-today-and-proposed) |
| "Maybe one single planet that increases all stats" | [§3.1](#31-the-bodies): **the Planet**, five nodes, +21 points to each of the six core stats in Tier 1 (× tier after) |
| "Individual moons with few stat nodes" | [§3.1](#31-the-bodies): four moons, five nodes each, each a single job: Strength (ATK), Sorcery (M.ATK), Vigor (HP and MP), Guard (DEF and M.DEF) |
| "And more as tiers progress" | [§4](#4-tier-2-the-halo-and-valor), [§5](#5-tier-3-the-halos-second-kind-and-swiftness): Tier 2 adds the Halo and Valor (29 nodes), Tier 3 the Halo's second kind and Swiftness (33); every value grows × 1.8 and × 2.6 ([§2](#2-the-rules-every-tier-shares)) |
| "Some previsualization would be great" | [the map at every tier](previews/stars-maps.html), with a tier switcher, a class picker and a level slider; every node hoverable and clickable |
| **2026-10-24:** "including visuals for suns and moons and everything the Extra Stats would grant" | The Planet sits where today's Sun sits, drawn as the system's centre ([maps](previews/stars-maps.html)); every grant at every tier, per class, by level and at Lv 50, in [§8](#8-what-it-grants-at-lv-50-by-class) and [the grants page](previews/stars-grants.html); the jewels in [§11](#11-jewels) and [the jewels page](previews/stars-jewels.html) |
| Stat growth mustn't drift across tiers (SB1, 2026-10-23) | [§8.3](#83-the-builds-share-holds-sb1): Extra Stats' share of every stat moves at most 1.5 points from Tier 1 to Tier 3 (flat values: up to 18.7) |
| **2026-10-24:** accessories become damage-oriented; defense lives in armor | [§9](#9-defense-and-sustain-now-that-accessories-deal-damage): the Planet, Vigor and Guard carry the defensive build the foe budget prices; Vigor's MP replaces the Spring Amulet (EP4, EP15) |
| **2026-10-24:** the Halo adds flat offense on a kind she picks, never a kind for weaknesses; Orb + Halo on one kind scales with SB1 | [§4.1](#41-the-halo-ep9): +10 × tier, then +34 × tier; Orb, Pendants and Halo on one kind ≤ 68 × tier (122 in Tier 2, 177 in Tier 3; weapon-progression's kind cap, WP24) |
| **2026-10-24:** specializations become weapon-group focus; if the Halo or a moon should serve a group, propose it | [§4.1](#41-the-halo-ep9), EP10: the Halo serves kinds, never a group; a group-focused branch points its two Tier 3 kinds inside its group; no group moon |
| **2026-10-24:** Uma uniqueness minimal ("let's not overcomplicate") | [§6](#6-her-moon-the-marked-slot): her moon stays a marked two-node slot, CP36's note recorded |

## 0. At a glance

| | Today (every tier) | Tier 1 | Tier 2 | Tier 3 |
|---|---|---|---|---|
| **Bodies** | A Sun, 8 planets | **The Planet and four moons** | + **the Halo** (a ring round the Planet) + **Valor** | + the Halo's **second kind** + **Swiftness** |
| **Shared nodes** | 100: 80 moons, 16 bridges, 4 Sun | **25** | 29 | 33 |
| **Her moon** | — | 2 nodes, a marked slot | 2 | 2 |
| **Stats on the map** | 8 | The six core stats: HP, MP, ATK, M.ATK, DEF, M.DEF | + offense on one kind; Limit start | + a second kind; evasion |
| **What counts** | 5 → 30 active slots, chosen by hand | **Every open node** | The same | The same |
| **What opens a node** | Its Star Gem, in order | **Its jewel, in order, at Uma Lv 5g − 4** | The same | The same |
| **Values** | Flat | **Tier 1's** | **× 1.8** | **× 2.6** |
| **A stat with its moon, Lv 50** | About +50 (four stats a class) | **+51** (HP +255) | **+92** (HP +460) | **+133** (HP +665) |
| **The Halo, Lv 50** | — | — | +61 on one kind | +88 on each of two kinds |
| **Limit start · evasion** | Limit and Speed planets | Her knack only (feet armor keeps 12% evasion) | Valor: Limit start +4 | + Swiftness: +6% evasion |
| **Jewel kinds · items** | 3 · 100 Star Gems | **2 · 10**: Planet I–V, Moon I–V | 3 · 12: + Halo I–II | 3 · 14: + Halo III–IV |
| **Jewels an Uma** (every moon · her class's) | 100 | **25 · 20** (+2 her moon) | 29 · 24 (+2) | 33 · 28 (+2) |
| **Lapidary, refined an Uma** | 232 | **120** (+8) | 138 (+8) | 156 (+8) |
| **Choices** | Which of 100 gems; which 30 nodes count | Which moon takes the next Moon Jewel; whether to open her other offense moon | + the Halo's kind (free, outside fights) | + its second kind |

#### Later tiers at a glance

| Piece | Tier 2 | Tier 3 | Where |
|---|---|---|---|
| **The core** | The same Planet and moons, rebuilt empty in the new world, values × 1.8 | × 2.6 | [§2](#2-the-rules-every-tier-shares), [§3.2](#32-every-node) |
| **The Halo** | One kind she picks: +18 at Lv 21, +61 at Lv 46 | A second kind: the same again, Halo III–IV | [§4.1](#41-the-halo-ep9), [§5](#5-tier-3-the-halos-second-kind-and-swiftness) |
| **Valor** | Limit start +2 at Lv 16, +4 at Lv 36 | Kept | [§4.2](#42-valor-ep11) |
| **Swiftness** | — | Evasion +3% at Lv 16, +6% at Lv 36 | [§5](#5-tier-3-the-halos-second-kind-and-swiftness) |
| **Her moon** | Rebuilt, × 1.8 | × 2.6 | [§6](#6-her-moon-the-marked-slot) |
| **Jewels** | + Halo Jewels I–II, from Tier 2's pairs | + Halo Jewels III–IV, from Tier 3's pairs | [§11](#11-jewels) |

## 1. Today

The Observatory, as built ([loops](../../game/loops.md#extra-stats-and-gear), [materials](../../game/materials.md#star-gems),
[sections](../../game/sections.md#observatory); code: `economy/stars.ts`, `economy/bonus.ts`, `economy/pacing.ts`,
`places/observatory/ObservatoryPage.tsx`, `world/balance-party.ts`).

| Piece | Today |
|---|---|
| **The map** | A Sun and eight planets on a ring (HP, DEF, M.DEF, MP, M.ATK, ATK, Speed, Limit), each with ten moons; two bridge nodes between neighbours; four Sun nodes: **100 nodes** |
| **A node's worth** | Its grade (D141): moon 7 gives 7 points; a bridge g ÷ 2 to each side; a Sun node g ÷ 8 to all eight. A point is +1 to its stat, +5 HP (`POINT_HP`), 0.6% evasion (`POINT_EVASION`) or 0.4 of the Limit gauge's 12 (`POINT_LIMIT`, D104) |
| **Opening** | One Star Gem a node, 100 gem kinds, set in order on each track (D119), cut at the Lapidary |
| **What counts** | 5 + ⌊level ÷ 2⌋ active nodes (5 at Lv 1, 30 at Lv 50), switched on and off by hand (`activeNodeSlots`) |
| **On curve** (`onCurveStars`) | The best moons her level's grade allows across four stats her class picks; about +1, +3, +6, +10, +14, +20, +26, +34, +41, +51 to each at Lv 5, 10 … 50. No MP in any class's four |
| **The screen** | Uma picker; "Active 12/30 · 40/100 open"; the map in code (360 × 360); eight stat totals; the Set list of Star Gems |
| **Each tier** | The same map, rebuilt from empty (D15); the Halo was proposed for Tier 2 (H41, Q12), not decided |
| **The foe budget** | `rpgFoeTierBudget`: gear and Extra Stats raise foe HP and defense ×2.715 and offense ×1.49 by a tier's Lv 50 (`budgetPerLevel` 0.035, `offenseBudgetPerLevel` 0.01); from Tier 2 the build part is scaled *down* by `rpgReferenceStat(ℓ) ÷ rpgReferenceStat(L)`, because the values are flat |

## 2. The rules every tier shares

- **Every open node counts, always** (EP6). No active slots, no switching, no toggles. A moon her active class doesn't
  use still counts, and does nothing for her (a Brawler's Sorcery adds M.ATK she never hits with).
- **A node opens with its jewel, in order, at her level** (EP5): node II after node I on each body; grade g at
  **Uma Lv 5g − 4** of her tier, the gear cadence. A jewel in stock above her level waits ("Opens at Lv 36").
- **Something opens every five levels:** the Planet on Lv 1, 11, 21, 31, 41 (odd grades), the moons on Lv 6, 16, 26,
  36, 46 (even grades); from Tier 2 the Halo on Lv 21 and 46, Valor (and Swiftness) on Lv 16 and 36.
- **Values are Tier 1's × the tier** (EP7, SB1): **× 1, × 1.8, × 2.6**. Each node's points are rounded to the nearest
  whole point (half up), so a body's total lands within one point of the exact product: the Planet's +21 a stat becomes
  +38 and +55, a moon's +30 becomes +54 and +78. HP is 5 a point after rounding.
- **Two units don't scale:** Limit start (a share of a gauge of 12 in every tier) and evasion (a share of every hit,
  capped at 50%) are already shares, as the affinity's +6% is (CP36). Valor and Swiftness give the same in Tiers 2 and 3.
- **The map is class-free** (EP12): the same bodies for every class; her class decides only which offense moon helps her.
  The Brawler uses Strength, the Mage Sorcery, the other four both (the Paladin's Light Tome hits from M.ATK, the
  Cleric's Bow from ATK). No class constellations, in any tier.
- **The core is rebuilt at every promotion** (EP13): the new world's Uma starts with an empty map, as today (D15); the
  same bodies come back with the tier's values. Tiers add bodies, never more nodes on the core.
- **Extra Stats never adds a kind** ([weapon-research §2](weapon-research.md#2-who-owns-what)): the Halo is flat offense
  on hits of a kind she already holds; weaknesses, locks and shields read only her weapons.

## 3. Tier 1: the Planet and four moons

### 3.1 The bodies

| Body | Gives | Nodes | Grades · opens at | Jewel | In all, Tier 1 | Who uses it |
|---|---|---|---|---|---|---|
| **The Planet** | **Every core stat:** HP, MP, ATK, M.ATK, DEF, M.DEF | 5 | 1, 3, 5, 7, 9 · Lv 1, 11, 21, 31, 41 | Planet Jewel I–V | **+21 each** (HP +105) | Every class |
| **Strength** | ATK | 5 | 2, 4, 6, 8, 10 · Lv 6, 16, 26, 36, 46 | Moon Jewel I–V | +30 ATK | Every class but the Mage |
| **Sorcery** | M.ATK | 5 | The same | Moon Jewel I–V | +30 M.ATK | Every class but the Brawler |
| **Vigor** | **Both pools:** HP (+5 a point) and MP | 5 | The same | Moon Jewel I–V | **+150 HP, +30 MP** | Every class |
| **Guard** | **Both defenses:** DEF and M.DEF | 5 | The same | Moon Jewel I–V | +30 DEF, +30 M.DEF | Every class |
| ★ **Her moon** ([§6](#6-her-moon-the-marked-slot)) | I her knack, II her lead | 2 | 4, 8 · Lv 16, 36 | Moon Jewels II, IV | +4, +8 | Hers |

- **The Planet** gives less a stat than a moon because it gives to all six; it sits on the odd grades, the moons on the
  even, so the two alternate every five levels. "Every stat" is the profile's six core stats; Speed and Limit stay off
  Tier 1's shared map (EP8).
- **A moon node is worth its grade** (D141, kept): +2, +4, +6, +8, +10.
- **Two moons with one stat, two with two:** Strength and Sorcery are the two channels' offense; Guard is both defenses;
  **Vigor is both pools** (EP4, new): the Spring Amulet's MP regen goes with the accessories change, and the pool takes
  its place ([§9](#9-defense-and-sustain-now-that-accessories-deal-damage)).

### 3.2 Every node

Grants are points; HP is 5 a point. Tier 2 and 3 are Tier 1 × 1.8 and × 2.6, rounded per node (EP7).

| Node | Grade | Opens at | Jewel | Tier 1 | Tier 2 (× 1.8) | Tier 3 (× 2.6) |
|---|---|---|---|---|---|---|
| **Planet I** | 1 | Lv 1 | Planet Jewel I | +1 to each of six (HP +5) | +2 (HP +10) | +3 (HP +15) |
| **Planet II** | 3 | Lv 11 | Planet Jewel II | +2 (HP +10) | +4 (HP +20) | +5 (HP +25) |
| **Planet III** | 5 | Lv 21 | Planet Jewel III | +4 (HP +20) | +7 (HP +35) | +10 (HP +50) |
| **Planet IV** | 7 | Lv 31 | Planet Jewel IV | +6 (HP +30) | +11 (HP +55) | +16 (HP +80) |
| **Planet V** | 9 | Lv 41 | Planet Jewel V | +8 (HP +40) | +14 (HP +70) | +21 (HP +105) |
| *The Planet in all* | | | 5 jewels | **+21 each (HP +105)** | **+38 (HP +190)** | **+55 (HP +275)** |
| **Moon I** (any of the four) | 2 | Lv 6 | Moon Jewel I | +2 | +4 | +5 |
| **Moon II** | 4 | Lv 16 | Moon Jewel II | +4 | +7 | +10 |
| **Moon III** | 6 | Lv 26 | Moon Jewel III | +6 | +11 | +16 |
| **Moon IV** | 8 | Lv 36 | Moon Jewel IV | +8 | +14 | +21 |
| **Moon V** | 10 | Lv 46 | Moon Jewel V | +10 | +18 | +26 |
| *A moon in all* | | | 5 jewels | **+30** | **+54** | **+78** |

What each moon's nodes give, read from the moon rows:

| Moon | I | II | III | IV | V | In all: Tier 1 · 2 · 3 |
|---|---|---|---|---|---|---|
| **Strength** | ATK +2 | +4 | +6 | +8 | +10 | ATK +30 · +54 · +78 |
| **Sorcery** | M.ATK +2 | +4 | +6 | +8 | +10 | M.ATK +30 · +54 · +78 |
| **Vigor** | HP +10, MP +2 | HP +20, MP +4 | HP +30, MP +6 | HP +40, MP +8 | HP +50, MP +10 | HP +150 · +270 · +390; MP +30 · +54 · +78 |
| **Guard** | DEF and M.DEF +2 | +4 | +6 | +8 | +10 | Each +30 · +54 · +78 |

(Tier 2's and 3's per-node values are the Moon rows above: Vigor II in Tier 3 is HP +50 and MP +10.)

### 3.3 What she has, level by level

A stat with its moon, on curve (every node her level opens), and a stat with the Planet alone (MP before Vigor,
her other offense):

| Uma Lv | 1 | 6 | 11 | 16 | 21 | 26 | 31 | 36 | 41 | 46 |
|---|---|---|---|---|---|---|---|---|---|---|
| Opens | Planet I | Moons I | Planet II | Moons II, her moon I | Planet III | Moons III | Planet IV | Moons IV, her moon II | Planet V | Moons V |
| **Tier 1**, a stat with its moon | +1 | +3 | +5 | +9 | +13 | +19 | +25 | +33 | +41 | **+51** |
| Tier 1, the Planet alone | +1 | +1 | +3 | +3 | +7 | +7 | +13 | +13 | +21 | +21 |
| **Tier 2** (× 1.8) | +2 | +6 | +10 | +17 | +24 | +35 | +46 | +60 | +74 | **+92** |
| **Tier 3** (× 2.6) | +3 | +8 | +13 | +23 | +33 | +49 | +65 | +86 | +107 | **+133** |

From Tier 2, Valor and her moon open with the moons' II and IV, the Halo with the Planet's III and at Lv 46.

### 3.4 Her choices

- **Which moon takes the next Moon Jewel.** A Moon Jewel is picked for a moon when set, never when made, so the crafter
  only decides how many. The Set list suggests her class's offense moon first, then Vigor, then Guard.
- **Whether to open her other offense moon.** A Brawler or a Mage skips it (20 jewels, not 25); the four classes
  between open all four. Classes switch freely, so the moon stays available, drawn dimmer with "Her class doesn't use
  M.ATK".
- **The Planet needs no thought:** one Planet Jewel a grade.

### 3.5 Tier 1's complexity, today and proposed

| What a Tier 1 player handles for one Uma | Today | Proposed |
|---|---|---|
| Bodies | A Sun and 8 planets | **The Planet and 4 moons** (+ her moon) |
| Nodes | 100: 80 moons, 16 bridges, 4 Sun | **25:** 5 Planet, 20 moon (+ 2 hers) |
| Node kinds | 3 (moon, bridge, Sun) | **2** (Planet, moon) |
| Stats on the shared map | 8 | **6**, the profile's core stats |
| Item kinds · items | 3 · 100 Star Gems | **2 · 10** jewels |
| Items to finish her | 100 | **20** (one offense moon) or **25** (both), + 2 hers |
| Active slots | 5 → 30, re-chosen every 2 levels | **None** |
| What gates a node | Its gem, in order | Its jewel, in order, and her level |
| Decisions | Which of 100 gems; which 30 of up to 100 open nodes count | Which moon gets the next Moon Jewel; open the other offense moon or not |
| The Lapidary's picker | 3 tabs: Moons (80), Bridges (16), Sun (4) | One row: Planet I–V, Moon I–V |
| Refined items an Uma | 232 | 120 (+ 8 hers) |

## 4. Tier 2: the Halo and Valor

The core again, rebuilt empty in the Tier 2 world with values × 1.8, plus two small bodies: **29 shared nodes**.

### 4.1 The Halo (EP9)

A ring round the Planet, tuned to **one damage kind** she picks. H41's idea (X1, X3, X7 kept) at a tenth of its nodes.

| Node | Grade | Opens at | Jewel | Gives (Tier 1 value × tier) | Tier 2 | Tier 3 |
|---|---|---|---|---|---|---|
| **Halo I** | 5 | Lv 21 | Halo Jewel I | +10 offense on her hits of that kind | **+18** | +26 |
| **Halo II** | 10 | Lv 46 | Halo Jewel II | +24 more (+34) | **+43 more: +61** | +62 more: +88 |

- **Flat, as an Orb is:** half a weapon's Might at the grade (Might 19 at G5, 68 at G10). It joins that kind's Might
  before the damage formula, on **every hit of that kind**: Attacks, skills, class skills cast through that weapon, both
  hybrid halves (each half its own kind), summons and Limit Breaks of that kind. **Never a heal:** mends and Barriers
  read ATK or M.ATK without it.
- **Never a kind, and it reads a hit's own kind.** It counts on hits whose own kind (the weapon's first) is hers, as
  the Orb, the Pendants and the affinity do ([weapon-progression §3.9](weapon-progression.md#39-weapon-groups-and-everything-that-reads-a-kind-wp13)):
  a Dual's second kind decides weaknesses and locks only, so no branch doubles a bonus. Weaknesses, locks and shields
  never read the Halo.
- **The kind is a setting, free to change outside fights,** and may be empty. Two nodes, two jewels; matching a
  front's weakness is a tap. **The preset** is the Orb preset's kind, her first slot (CP11): Brawler Greatsword, Mage
  Fire, Spell Blade Katana, Summoner Dark, Paladin Greatsword, Cleric Light.
- **The bound with the Orb (X7, with SB1):** on one kind, Orb + Halo ≤ a G10 weapon's Might × tier: **122 in Tier 2**
  (Orb 61 + Halo 61), **177 in Tier 3** (88 + 88). weapon-progression.md extends it to its Pendants as the **kind cap**
  (WP24): every flat offense on one kind together, so a Pendant on a capped kind adds nothing ("Greatsword: +122,
  capped") and she points one of them elsewhere. The Orb's and Pendants' values are that doc's; the cap is both docs'.
- **Weapon groups (EP10):** class specializations become weapon-group focus (main Arms: Greatsword, Axe, Lance;
  secondary: Bow, Katana; elemental Tomes: Fire, Ice, Lightning; arcane: Light, Dark; weapon-progression §3.9). **The
  Halo serves kinds, never a group:** a group Halo would put +61 on two or three kinds at
  once, past X7, and Strength and Sorcery already serve whole channels. A group-focused branch is served by where she
  points the Halo, and from Tier 3 by its two kinds, both inside her group. **Its picker lists her three slotted kinds
  first,** then the rest by group as her class branch names them. No group moon.
- **On screen:** "Halo · Katana +61" beside "Orb · Katana +61" in the Battle tab's Offense group.

### 4.2 Valor (EP11)

A small moon for **Limit start**, where Limit Breaks matter more (LB+ at Bond 10, CP28). It answers Q9 (keep the Limit
stat) without a Limit planet in Tier 1.

| Node | Grade | Opens at | Jewel | Gives (Tiers 2 and 3) |
|---|---|---|---|---|
| **Valor I** | 4 | Lv 16 | Moon Jewel II | Limit start **+2** of the gauge's 12 (5 Limit points) |
| **Valor II** | 8 | Lv 36 | Moon Jewel IV | **+2 more: +4** (10 points) |

Limit start is a share of a fixed gauge, so it doesn't scale (§2). With a Gritty knack (her moon, +1.6) she starts a
fight at 5 of 12.

### 4.3 Tier 2's map

| Body | Nodes | Lv 50 grant, Tier 2 |
|---|---|---|
| The Planet | 5 | +38 to each core stat (HP +190) |
| Strength · Sorcery · Vigor · Guard | 20 | +54 each (Vigor HP +270 and MP +54; Guard +54 to each defense) |
| **The Halo** | 2 | +61 on one kind's hits |
| **Valor** | 2 | Limit start +4 |
| ★ Her moon | 2 | Knack +7, lead +14 |
| **Shared** | **29** | |

## 5. Tier 3: the Halo's second kind and Swiftness

The core and Tier 2's bodies again, × 2.6, plus two more: **33 shared nodes.**

| Node | Grade | Opens at | Jewel | Gives (Tier 3) |
|---|---|---|---|---|
| Halo I · II (first kind) | 5 · 10 | Lv 21 · 46 | Halo Jewels I, II | +26, then +62 more: **+88** |
| **Halo III** (second kind) | 5 | Lv 21 | **Halo Jewel III** | **+26** on a second kind |
| **Halo IV** (second kind) | 10 | Lv 46 | **Halo Jewel IV** | **+62 more: +88** |
| Valor I · II | 4 · 8 | Lv 16 · 36 | Moon Jewels II, IV | Limit start +2, +4 |
| **Swiftness I** | 4 | Lv 16 | Moon Jewel II | **+3% evasion** (5 Speed points) |
| **Swiftness II** | 8 | Lv 36 | Moon Jewel IV | **+3% more: +6%** |

- **The Halo's two kinds are two different kinds,** each a setting. A hybrid can tune both halves of her pair; a pure
  class two of her three weapons; a group-focused branch two kinds of its group (EP10). Orb + Halo on any one kind still
  stops at 68 × 2.6 = 177.
- **Swiftness is Tier 3's defensive body.** Evasion stays on feet armor (12% at G10); Swiftness adds 6% (18% in all, 20.4%
  with a Fleet knack, under the 50% cap). With defensive accessories gone (§9), it is the defense Tier 3 adds where its
  second Support slot used to.
- **Class constellations** (tiers §6) stay dropped (EP12): the map stays class-free in Tier 3 too.

| Body | Nodes | Lv 50 grant, Tier 3 |
|---|---|---|
| The Planet | 5 | +55 to each core stat (HP +275) |
| The four moons | 20 | +78 each (Vigor HP +390 and MP +78) |
| **The Halo** | 4 | +88 on each of two kinds |
| Valor | 2 | Limit start +4 |
| **Swiftness** | 2 | Evasion +6% |
| ★ Her moon | 2 | Knack +10, lead +21 |
| **Shared** | **33** | |

## 6. Her moon: the marked slot

The owner (2026-10-24): Uma uniqueness stays minimal, "let's not overcomplicate". **Her moon stays a marked two-node
slot** on its own small orbit, starred and named for her template ("Ironhide's moon"). The Uma Templates pass fills it
([variance §8](variance.md#8-extra-stats-her-moon)); this doc keeps its place and the map's rules for it (EP14).

| Node | Grade · opens | Jewel | Drafted content (variance U10) | Tier 1 | Tier 2 | Tier 3 | Counts |
|---|---|---|---|---|---|---|---|
| **I, knack** | 4 · Lv 16 | Moon Jewel II | Her top growth rate's stat: HP (Tireless), MP (Clever), DEF and M.DEF each (Mighty), Speed as evasion (Fleet), Limit (Gritty) | +4 points (HP +20) | +7 (HP +35) | +10 (HP +50) | In every class |
| **II, lead** | 8 · Lv 36 | Moon Jewel IV | +8 to her calling channel's offense, ATK or M.ATK. **CP36's note:** moved to her calling channel's **defense** (DEF or M.DEF), so it never adds to the affinity's +6% | +8 | +14 | +21 | In the classes of that channel |

- **Worth a moon node of its grade, × tier** (EP7). A Fleet knack (+2.4% evasion) and a Gritty one (+1.6 Limit start)
  don't scale, like Swiftness and Valor.
- **Outside the foe budget,** as today's off-curve nodes are: the balance party's average Uma has no template (XR12).
- **A node her class can't use stays open** and reads "No effect as Mage".
- **Jewels:** a Moon Jewel II and a Moon Jewel IV in every tier, 8 refined, counted beside the shared demand.
- **Ids** `template:1`, `template:2`. **Why it doesn't grow:** a growing moon pushed Tier 3 past the work budget and
  to the edge of variance's +5% (XR3); the template's later depth is the signature tip on her affinity tree.

## 7. Counts

| | Today | Tier 1 | Tier 2 | Tier 3 |
|---|---|---|---|---|
| Bodies (shared) | 9 | 5 | 7 | 8 (the Halo holds both kinds) |
| Shared nodes | 100 | 25 | 29 | 33 |
| Her moon | — | 2 | 2 | 2 |
| Nodes a Brawler or Mage uses | 30 active | 20 | 24 | 28 |
| Stats on the map | 8 | 6 | 6 + a kind + Limit | 6 + two kinds + Limit + evasion |
| Settings | 30 toggles | 0 | 1 (the Halo's kind) | 2 |
| Jewel kinds · items | 3 · 100 | 2 · 10 | 3 · 12 | 3 · 14 |

## 8. What it grants at Lv 50, by class

### 8.1 The grants

Extra Stats alone, at each tier's Lv 50, every node her class uses (her moon apart, §6):

| Class | Tier | HP | MP | ATK | M.ATK | DEF | M.DEF | The Halo | Limit start | Evasion |
|---|---|---|---|---|---|---|---|---|---|---|
| **Brawler** (no Sorcery) | 1 | +255 | +51 | +51 | +21 | +51 | +51 | — | — | — |
| | 2 | +460 | +92 | +92 | +38 | +92 | +92 | +61, one kind | +4 | — |
| | 3 | +665 | +133 | +133 | +55 | +133 | +133 | +88, two kinds | +4 | +6% |
| **Mage** (no Strength) | 1 | +255 | +51 | +21 | +51 | +51 | +51 | — | — | — |
| | 2 | +460 | +92 | +38 | +92 | +92 | +92 | +61 | +4 | — |
| | 3 | +665 | +133 | +55 | +133 | +133 | +133 | +88 × 2 | +4 | +6% |
| **Spell Blade, Summoner, Paladin, Cleric** (all four moons) | 1 | +255 | +51 | +51 | +51 | +51 | +51 | — | — | — |
| | 2 | +460 | +92 | +92 | +92 | +92 | +92 | +61 | +4 | — |
| | 3 | +665 | +133 | +133 | +133 | +133 | +133 | +88 × 2 | +4 | +6% |

### 8.2 The sheets

Her full sheet at each tier's Lv 50 (the balance simulation's average outfit, base 110, +10% growth in Speed, Stamina,
Power, from [stats-by-tier](previews/stats-by-tier.html)), fully built: armor G10 at weapon-progression.md's values
(WP15: HP +150, DEF and M.DEF +40, MP +30, +25 offense on her half), every Extra Stats node her class uses, **without
her moon**, every flat build value × tier. Offense is her lead kind: her ATK or M.ATK
plus Might (68 · 122 · 177), and from Tier 2 the Orb (61 · 88) and the Halo (61 · 88). In brackets, Extra Stats' part.

| Class | Tier | HP | MP | ATK | M.ATK | DEF | M.DEF | Offense, lead kind |
|---|---|---|---|---|---|---|---|---|
| **Brawler** | 1 | 1,477 (255) | 213 (51) | 192 (51) | 116 (21) | 207 (51) | 182 (51) | 260 (51) |
| | 2 | 2,548 (460) | 368 (92) | 343 (92) | 206 (38) | 370 (92) | 326 (92) | 587 (153) |
| | 3 | 3,628 (665) | 523 (133) | 495 (133) | 298 (55) | 534 (133) | 470 (133) | 848 (221) |
| **Mage** | 1 | 1,244 (255) | 296 (51) | 116 (21) | 197 (51) | 186 (51) | 202 (51) | 265 (51) |
| | 2 | 2,153 (460) | 507 (92) | 206 (38) | 352 (92) | 332 (92) | 361 (92) | 596 (153) |
| | 3 | 3,068 (665) | 719 (133) | 298 (55) | 509 (133) | 480 (133) | 521 (133) | 862 (221) |
| **Spell Blade** | 1 | 1,337 (255) | 247 (51) | 192 (51) | 151 (51) | 196 (51) | 192 (51) | 260 (51) |
| | 2 | 2,311 (460) | 424 (92) | 343 (92) | 270 (92) | 351 (92) | 344 (92) | 587 (153) |
| | 3 | 3,292 (665) | 602 (133) | 495 (133) | 390 (133) | 507 (133) | 496 (133) | 848 (221) |
| **Summoner** | 1 | 1,337 (255) | 247 (51) | 151 (51) | 192 (51) | 196 (51) | 192 (51) | 260 (51) |
| | 2 | 2,311 (460) | 424 (92) | 270 (92) | 343 (92) | 351 (92) | 344 (92) | 587 (153) |
| | 3 | 3,292 (665) | 602 (133) | 390 (133) | 495 (133) | 507 (133) | 496 (133) | 848 (221) |
| **Paladin** | 1 | 1,337 (255) | 296 (51) | 181 (51) | 135 (51) | 212 (51) | 192 (51) | 249 (51) |
| | 2 | 2,311 (460) | 507 (92) | 324 (92) | 242 (92) | 379 (92) | 344 (92) | 568 (153) |
| | 3 | 3,292 (665) | 719 (133) | 468 (133) | 349 (133) | 548 (133) | 496 (133) | 821 (221) |
| **Cleric** | 1 | 1,337 (255) | 296 (51) | 135 (51) | 181 (51) | 196 (51) | 207 (51) | 249 (51) |
| | 2 | 2,311 (460) | 507 (92) | 242 (92) | 324 (92) | 351 (92) | 370 (92) | 568 (153) |
| | 3 | 3,292 (665) | 719 (133) | 349 (133) | 468 (133) | 507 (133) | 534 (133) | 821 (221) |

- **Against [weapon-progression §4.4](weapon-progression.md)** (its sheets with the new armor): HP, DEF and M.DEF the
  same (within a point of rounding); **MP is 30 × tier higher**, Vigor's MP (EP4): a Brawler 213 · 368 · 523 against
  183 · 314 · 445. **Against [class-progression §9](class-progression.md#9-class-stats-at-lv-50-under-sb1)** (the old
  armor): armor's support's worth and Vigor's MP; **offense is 8 × tier lower** because §9 counts her moon's lead node
  (+8), which this doc keeps outside (her moon, §6; CP36 moves it to defense).
- **Where it shows:** a Brawler's ATK is 27% Extra Stats, her HP 17%, her MP 24%; a Mage's DEF 27%.

### 8.3 The build's share holds (SB1)

**Extra Stats' share of each stat at each tier's Lv 50.** Under SB1 the share holds; with the first round's flat values
it halves by Tier 3 (the flat column). Selected rows; every class and stat is on [the grants page](previews/stars-grants.html#share).

| Class · stat | Tier 1 | Tier 2 | Tier 3 | Flat values: Tier 1 → Tier 3 |
|---|---|---|---|---|
| Brawler HP | 17% | 18% | 18% | 17% → 9% |
| Brawler MP | 24% | 25% | 25% | 24% → 13% |
| Brawler ATK | 27% | 27% | 27% | 27% → 14% |
| Brawler DEF | 25% | 25% | 25% | 25% → 13% |
| Brawler M.DEF | 28% | 28% | 28% | 28% → 16% |
| Mage HP | 20% | 21% | 22% | 20% → 11% |
| Mage M.ATK | 26% | 26% | 26% | 26% → 13% |
| Spell Blade M.ATK | 34% | 34% | 34% | 34% → 17% |
| Cleric MP | 17% | 18% | 18% | 17% → 9% |
| **Offense, lead kind** (with the Halo) | 20% | **26%** | 26% | 20% → 17% |

- **Every class, every core stat:** Extra Stats' share moves **at most 1.5 points** from Tier 1 to Tier 3 (Brawler 1.5;
  Spell Blade, Summoner 1.4; Mage, Paladin, Cleric 1.3). With flat values it falls by **12.7 to 18.7 points**.
- **Why not exactly flat:** her HP grows a little slower than her other stats (her HP level part × 1.70 and × 2.40,
  her core stats' × 1.78 and × 2.57), so the build's share of HP edges up a point. The overall balancing pass sets the
  final multipliers (README §2.5); a single number per tier moves every node together.
- **Offense rises once, in Tier 2,** because the Halo arrives (20% → 26%); then holds. The whole build's share of her
  lead offense: 55% → 65% → 65% (a Brawler), the same step class-progression §9 shows for the Orb and the Halo.

## 9. Defense and sustain, now that accessories deal damage

**The change (owner, 2026-10-24, weapon-progression.md):** accessories become damage-oriented. All ten Supports go
(WP17): the defensive ones (Iron, Ward, Bulwark, Veil, Vital), the MP ones (Spring, Siphon) and the rest; defense lives
in armor. The question for this doc:
how much of the defensive and sustain budget does Extra Stats carry, and does the foe budget move?

**Defense: Extra Stats is the defensive build the foe budget prices** (EP15).
- **The foe budget's formula prices points, never accessories.** A foe's offense is set so a 100% hit takes 28% of an
  on-curve Uma's HP, through `offenseBudgetPerLevel` (×1.49 at Lv 50): the HP, DEF and M.DEF that armor and Extra Stats
  add. A Support showed only in the simulation's win rates (the balance party wore Vampire, Siphon, Spring or Thorn),
  and weapon-progression.md moves **one support's worth into armor** (WP15) to keep them. **No foe moves.**
- **Extra Stats alone meets that budget.** The share of her HP one 100% striker hit takes, Tier 1, a reference Uma
  (`rpgReferenceStat`), against the budget's target:

  | Uma Lv | 10 | 20 | 30 | 40 | 50 |
  |---|---|---|---|---|---|
  | The budget's target (`rpgFoeHitShare`) | 28.0% | 28.0% | 28.0% | 28.0% | 28.0% |
  | Bare (no build) | 28.5% | 30.1% | 32.8% | 36.7% | 41.7% |
  | **Extra Stats only** (Planet, Vigor, Guard) | **26.8%** | **26.4%** | **26.5%** | **27.4%** | **28.8%** |
  | Armor only (WP15's new values) | 25.0% | 24.9% | 26.3% | 28.9% | 32.6% |
  | Both (on curve) | 23.7% | 22.1% | 21.8% | 22.3% | 23.5% |

  From Lv 10 to Lv 50 Extra Stats by itself holds her within 1.6 points of the target; armor, with the support's worth
  it took in, is the margin. At each tier's Lv 50 under SB1: 28.8%, 28.3%, 28.0% (Extra Stats only); 23.5%, 22.9%,
  22.7% (both).
- **Its share of the defensive build at Lv 50:** HP 255 of 405 (63%), MP 51 of 81 (63%), DEF and M.DEF 51 of 91 each
  (56%); armor the rest. With no defensive accessory those two are the whole defensive build, and Extra Stats carries
  **three fifths** of it, in every tier (SB1 scales both).
- **No new values.** Raising Guard or Vigor would only raise the foes' offense with them (the formula prices points), so
  the party gains nothing on the curve. The support's margin lives in armor (WP15), Extra Stats keeps the budget's
  core, and the two never count the same support twice.
- **Tier 3** gets its defensive body, **Swiftness** (+6% evasion), where its second Support used to be a defensive one.

**Sustain: MP moves from regen to the pool** (EP4).
- **What goes:** all ten Supports (weapon-progression WP17), the MP ones with them: the Spring Amulet, +1 MP a round a
  grade (10 at G10), the balance Cleric's Support and its 17-point gain on Iron's champion (classes-v2 §6.3), and the
  Siphon (MP from magical damage), the Mage's and the Summoner's. A region's twelve stages carry MP from its Spring, so
  regen mattered.
- **What replaces it:** Vigor gives MP as well as HP, a point for a point: **+30 MP** in Tier 1, with the Planet's +21
  **+51 MP an Uma** at Lv 46 (× 1.8, × 2.6 after). Every Uma has it, not only the one who wore a Spring: **+255 MP a
  party**, 25 rounds of a G10 Spring's regen. Extra Stats is 17–24% of her MP at Lv 50 (armor's legs add 30 more).
- **Why the pool and not a regen node:** a regen node brings a mechanic and a unit to a map that shows six stats, and a
  regen that comes back every round is what the change removes. The Flourish's MP twists (U9) stay the template's.
- **Under the foe budget:** MP isn't in it, so nothing moves. **The Springs test** (README §9.5 item 5) checks a region
  on Auto still clears 10–12 of 12 stages: with **+51 MP** from the map (no longer +21) and armor's legs at +30
  (weapon-progression §5.9). **Its knobs, in order:** legs' MP a grade (weapon-progression's), then **Vigor's MP rate**
  (1.5 MP a point), then the Flourish's twists; never the foes, never an MP accessory.
- **Lifesteal and MP steal** leave with the Supports; Extra Stats doesn't copy them. The Bell (a follow-up on her
  Attack, weapon-progression §5.5) makes a free Attack worth taking when the bar runs low.

## 10. The foe budget

**The rates stay; the tier scaling moves to SB1** (EP16).
- **`rpgFoeBudget`** keeps its rates: HP and defense ×(1 + 0.035 (L − 1)² ÷ 49), ×2.715 at Lv 50; offense ×1.49.
- **`rpgFoeTierBudget`** keeps its restart at each tier's Lv 1 and **multiplies its build part by the tier**:
  `1 + (rpgFoeBudget(ℓ) − 1) × m × rpgReferenceStat(ℓ) ÷ rpgReferenceStat(L)`, ℓ her tier level, L her lifetime level,
  m = 1, 1.8, 2.6. At each tier's Lv 50 it lands on the Tier 1 curve (×2.715 and ×1.49 in Tier 1; ×2.719 and ×1.491 in
  Tier 2; ×2.721 and ×1.492 in Tier 3), where the flat drafts' scaling gave ×1.96 and ×1.27 in Tier 2.
- **`onCurveStars`** becomes every node her level opens on **her class's bodies** (the Planet, Vigor, Guard and her
  channel's offense moon or moons), at her tier's values. The average Uma has no template moon. The Halo, Valor and
  Swiftness are not in the build curve: they are the tier's tools, priced in its toolbox term (Z4, XR15).
- **The core matches today's on-curve stars,** stat by stat, within 1.25 points at every five levels:

  | Lv | 5 | 10 | 15 | 20 | 25 | 30 | 35 | 40 | 45 | 50 |
  |---|---|---|---|---|---|---|---|---|---|---|
  | Today's on curve (four stats' average) | 1 | 3 | 6 | 9.75 | 14.25 | 20 | 26 | 33.5 | 41.25 | 50.5 |
  | **A stat with its moon** | 1 | 3 | 5 | 9 | 13 | 19 | 25 | 33 | 41 | 51 |
  | The Planet alone (MP before Vigor, her other offense) | 1 | 1 | 3 | 3 | 7 | 7 | 13 | 13 | 21 | 21 |

- **What moves, at Tier 1 Lv 50** (the shapes' difference, which the re-baseline measures, README §9.5 item 1): the
  pure classes gain MP +51 (today 0); the hybrids gain the stat their four-stat kit left out (the Spell Blade M.DEF,
  the Summoner ATK on her Arms half, +51) and MP. The Summoner's damage moves; the classes doc's mirror check re-tunes the
  hands, never the map (CP9, XR5).
- **The simulation may move** node values (Moon V's +10 first) and Vigor's MP rate. **It may not move** the shape: one
  Planet, four moons, five nodes each, every open node counting.

## 11. Jewels

"Gem" is the weapon line's word; Extra Stats' items are **jewels**, made by Jewel Crafting at the Lapidary
(glossary, [README §2.4](README.md#24-glossary)).

### 11.1 Kinds and grades (EP17)

| Jewel | Grade | Made from Craft Lv | Opens | From |
|---|---|---|---|---|
| **Planet Jewel I · II · III · IV · V** | 1 · 3 · 5 · 7 · 9 | 1 · 11 · 21 · 31 · 41 | Planet I–V | Tier 1 |
| **Moon Jewel I · II · III · IV · V** | 2 · 4 · 6 · 8 · 10 | 6 · 16 · 26 · 36 · 46 | Node I–V of **any** moon, picked when set. Moon Jewel II also opens Valor I, Swiftness I and her moon's I; Moon Jewel IV their II | Tier 1 |
| **Halo Jewel I · II** | 5 · 10 | 21 · 46 | Halo I, II (her first kind) | Tier 2 |
| **Halo Jewel III · IV** | 5 · 10 | 21 · 46 | Halo III, IV (her second kind) | Tier 3 |

- **A jewel's numeral is the node it opens,** on every body: Planet Jewel III opens Planet III, Halo Jewel IV opens
  Halo IV. (The first round reused Halo Jewels I–II for the second kind, with a different recipe under the same name.)
- **Grade g is made at Craft Lv 5g − 4 and set at Uma Lv 5g − 4,** the gear rule: a jewel is craftable when the node
  it opens is reachable.
- **Items:** 10 in Tier 1, 12 in Tier 2, 14 in Tier 3. Today: 100.
- **Names and icons (EP22):** "Planet Jewel III", "Moon Jewel II", "Halo Jewel I". Today's gem sheet supplies the icons
  (the Sun gems' gold prisms for Planet Jewels, one planet's moon-gem row for Moon Jewels, another row for Halo Jewels).
  No new art.

### 11.2 Recipes: the interface for profession-progression.md (EP18)

**One fixed amount a jewel, the same in every tier:** a Moon Jewel 4 refined (3 cut stones on 1 ingot), a Planet Jewel
8 (2 each of a cut stone, a plank, a cloth and a carving), a **Halo Jewel 5** (one refined item of each gathering
profession). Which tier's type fills each one at each grade is [profession-progression.md](profession-progression.md)'s
ladder (PP9) and catalog (PP8), which this doc follows: in Tier 2 grades 5 and 10 take Tier 2's pair; in Tier 3 grades 4
and 9 take Tier 2's and grades 5 and 10 Tier 3's. A Halo Jewel keeps the pair of the tier that brought it.

| Jewel (grade) | Refined | Tier 1 | Tier 2 | Tier 3 |
|---|---|---|---|---|
| **Moon Jewel I** (2) | 4 | 3 Cut Quartz, 1 Copper Ingot | The same | The same |
| **Moon Jewel II** (4) | 4 | 3 Cut Quartz, 1 Copper Ingot | The same | **3 Cut Sapphire, 1 Silver Ingot** |
| **Moon Jewel III, IV** (6, 8) | 4 | 3 Cut Garnet, 1 Iron Ingot | The same | The same |
| **Moon Jewel V** (10) | 4 | 3 Cut Garnet, 1 Iron Ingot | **3 Cut Diamond, 1 Titanium Ingot** | **3 Cut Philosopher's Stone, 1 Orichalcum Ingot** |
| **Planet Jewel I, II** (1, 3) | 8 | 2 each: Cut Quartz, Pine Plank, Linen, Shell Carving | The same | The same |
| **Planet Jewel III** (5) | 8 | The same | **2 each: Cut Sapphire, Mahogany Plank, Wool Cloth, Trilobite Carving** | **2 each: Cut Starstone, Elderwood Plank, Moonsilk, Aether Infusion** |
| **Planet Jewel IV** (7) | 8 | 2 each: Cut Garnet, Oak Plank, Cotton Cloth, Ammonite Carving | The same | The same |
| **Planet Jewel V** (9) | 8 | The same | The same | **2 each: Cut Diamond, Ebony Plank, Silk, Tide Infusion** |
| **Halo Jewel I** (5) | 5 | — | Silver Ingot, Mahogany Plank, Wool Cloth, Trilobite Carving, Cut Sapphire | The same (Tier 2's) |
| **Halo Jewel II** (10) | 5 | — | Titanium Ingot, Ebony Plank, Silk, Tide Infusion, Cut Diamond | The same |
| **Halo Jewel III** (5) | 5 | — | — | Mythril Ingot, Elderwood Plank, Moonsilk, Aether Infusion, Cut Starstone |
| **Halo Jewel IV** (10) | 5 | — | — | Orichalcum Ingot, Yggdrasil Plank, Cloudweave, Prismatic Infusion, Cut Philosopher's Stone |

- **Easy to say:** a moon is cut stones on a metal mount; the Planet a bit of everything; **a Halo Jewel is its tier in
  one jewel,** one refined item from each gathering profession's new pair.
- **Every type exists today** (professions §0.3, profession-progression PP8): no new item, no new icon.
- **Make time** (PR9): one gather's time a refined item. At Craft Lv 25 (×1.25): a Moon Jewel 2.4 h, a Halo Jewel 3.0
  h, a Planet Jewel 4.8 h.
- **Her moon's Moon Jewels II and IV follow the same ladder** (in Tier 3, her Moon Jewel II is Cut Sapphire on Silver).

### 11.3 Per Uma, per tier

**Jewels an Uma** (a hybrid or healer opens every moon; a Brawler or a Mage skips one):

| Jewel | Tier 1 | Tier 2 | Tier 3 |
|---|---|---|---|
| Planet Jewel I–V | 1 each (5) | 5 | 5 |
| Moon Jewel I, III, V | 4 each (12) | 12 | 12 |
| Moon Jewel II, IV | 4 each (8) | 5 each (10): + Valor | 6 each (12): + Swiftness |
| Halo Jewel I–II | — | 1 each (2) | 2 |
| Halo Jewel III–IV | — | — | 1 each (2) |
| **Shared, every moon** | **25 · 120 refined** | **29 · 138** | **33 · 156** |
| Shared, her class's moons (Brawler, Mage) | 20 · 100 | 24 · 118 | 28 · 136 |
| ★ Her moon: Moon Jewels II and IV | 2 · 8 | 2 · 8 | 2 · 8 |

**Refined items an Uma, by gathering profession** (every moon, her moon apart; every type in
[the jewels page](previews/stars-jewels.html#materials)):

| Profession (what it gives) | Tier 1 | Tier 2 | Tier 3 |
|---|---|---|---|
| Hunting (cut stones) | 70 | 78 | 86 |
| Mining (ingots) | 20 | 24 | 28 |
| Wood Chopping (planks) | 10 | 12 | 14 |
| Farming (cloth) | 10 | 12 | 14 |
| Fishing (carvings, infusions) | 10 | 12 | 14 |
| **Lapidary, an Uma** | **120** | **138** | **156** |
| Of it, Tier 1's types · Tier 2's · Tier 3's | 120 · — · — | 104 · 34 · — | 80 · 42 · 34 |
| ★ Her moon | +8 | +8 | +8 |

- **Hunting carries the Lapidary,** as professions planned: 70 of Tier 1's 120 (58%), every other profession 10 to 20.
- **A party** on the defaults (two of five skip a moon): 560 · 650 · 740 refined (+40 for their moons); a Rift run of
  twenty, four times that.
- **Against [README §2.3](README.md#23-one-umas-demand):** Tier 1 is unchanged (25 · 120). Tiers 2 and 3 drop the
  first round's "resized from Tier 2" (27 Planet and Moon Jewels at 120, then 29 at 120): no single amount fits both
  counts, and an amount that changes per tier is one more thing to learn. Valor's and Swiftness's Moon Jewels cost what
  every Moon Jewel costs: **138 and 156** an Uma, where §2.3 said 130 and 140.
- **The whole Uma** (profession-progression.md's lines, the branch gem a G5 Weapon Gem): **485 · 503 · 521 refined**
  (493 · 511 · 529 with her moon), about **822 · 852 · 883 hours** at Craft Lv 25's speed (835 · 866 · 896): every tier
  inside PR10's tenth (+3.7%, +7.4%). Profession-progression.md owns the final amounts.

## 12. The Observatory, tier by tier

One page, the same in every tier, growing with the map (EP19). Drawn in [the maps page](previews/stars-maps.html#screen).

| Part | Tier 1 | Tier 2 | Tier 3 |
|---|---|---|---|
| **Header** | Her face (tap to choose an Uma) · "Open 11 of 25 · ★ 1 of 2" | "Open 21 of 29 · ★ 2 of 2" | "Open 28 of 33" |
| **The map** (drawn in code, 360 × 360) | The Planet at the centre, its five nodes round it; Strength (top), Sorcery (right), Vigor (bottom), Guard (left) on one orbit, five nodes each; ★ her moon on a small orbit | + the Halo, a ring round the Planet with two nodes, and Valor on the outer orbit | + the Halo's second arc (III, IV) and Swiftness |
| **A node, tapped** | A sheet: "Strength III · ATK +6 · Moon Jewel III · open"; locked: "Strength IV · ATK +8 · needs a Moon Jewel IV · opens at Lv 36" | Values × 1.8 ("Strength III · ATK +11") | × 2.6 |
| **A moon her class doesn't use** | Drawn dimmer; "Her class doesn't use M.ATK" on its sheet; still openable | The same | The same |
| **Totals under the map** | HP, MP, ATK, M.ATK, DEF, M.DEF: what's open | + "Halo · Katana +18", "Limit start +4" | + "Halo · Lance +26", "Evasion +6%" |
| **The Halo's kind** | — | A chip under the map: "Halo · Katana ▾"; the picker lists her three slotted kinds first, then the rest by group; Empty allowed; free outside fights | Two chips, two different kinds |
| **Set** | Jewels in stock she can set now: "Planet Jewel III ×2 · Opens Planet III · +4 to every stat · Set". A Moon Jewel's Set asks which moon: her class's offense moon, Vigor and Guard first, the other moon dimmed | + Halo Jewels; a Moon Jewel II or IV also offers Valor | + Swiftness |
| **Gone** | Active slots, the on/off toggle, "Active 12/30" | | |

- **Can upgrade** (H34, EP20): a jewel in stock she can set now. "A free active node" goes.
- **Targets** (D100, EP20): plan the Planet, her active class's moons, her moon, and the tier's Halo and small moons;
  a Brawler's target never asks for Sorcery jewels.
- **The Lapidary's picker:** one row a kind, Planet I–V, Moon I–V (+ Halo I–IV by tier).
- **The Battle tab:** unchanged, the green Extra Stats share on each core stat; from Tier 2 the Halo's line in the
  Offense group, Limit start and evasion in Sustain.
- **Promotion** empties the map in the new world; the old world's stays as it was.

## 13. Provides

| To | What |
|---|---|
| **README §2** | Tier 1 "the Planet and four moons, 25 nodes, every open node counts"; Tier 2 "+ the Halo (one kind), + Valor: 29"; Tier 3 "+ the Halo's second kind, + Swiftness: 33"; her moon 2 in every tier; values × 1 / 1.8 / 2.6. Jewel kinds · items 2 · 10, 3 · 12, **3 · 14**; §2.3's jewel rows **25 · 120, 29 · 138, 33 · 156** (every moon), her moon 2 · 8; §9.5 item 5 "MP **+51** in the Springs test" |
| **weapon-progression.md** | **The Halo** is flat offense on one kind's hits (two from Tier 3), never a kind and never a heal: Tier 1 values +10 and +34, × 1.8 and × 2.6 (+18 · +61 in Tier 2, +26 · +88 in Tier 3). **The bound** Orb + Halo ≤ 68 × tier on one kind (122, 177), so the Orb at G10 is at most 34 × tier. **Defense:** Extra Stats keeps Guard (+30 × tier to each defense), Vigor (+150 HP × tier) and the Planet (+21 × tier): alone they hold an on-curve Uma at the budget's 28% a hit (Lv 10–50); armor's support's worth (WP15) is the margin over it, and no value is raised on both sides. Sheets with WP15's armor: §8.2. **Sustain:** Vigor's MP (+30 × tier) and the Planet's (+21 × tier) replace the Spring and Siphon Amulets' MP; the Springs test's knobs in order: legs' MP, Vigor's MP rate, the Flourish's twists. **Evasion:** feet armor keeps 12% at G10; Swiftness adds 6% in Tier 3 (cap 50%). **The Halo's preset** is the Orb preset's kind (her first slot); Tier 3's second, her second slot. **The Halo reads a hit's own kind** (its §3.9 rule) and sits under the kind cap (WP24: Orbs, Pendants and the Halo ≤ 68 × tier on one kind). **Pure's and Keen's multipliers** apply after the flat offense (the kind-focus stack is the weapon doc's, weapon-research risk 3) |
| **profession-progression.md** | **Jewel kinds and grades** (§11.1): Planet I–V (1, 3, 5, 7, 9), Moon I–V (2, 4, 6, 8, 10), Halo I–II (5, 10, Tier 2), Halo III–IV (5, 10, Tier 3); grade g made at Craft Lv 5g − 4. **Counts an Uma** (§11.3): 25 · 29 · 33 every moon, 20 · 24 · 28 her class's, + her moon's Moon Jewels II and IV every tier. **Recipes** (§11.2): Moon 4 (3 Hunting stones + 1 Mining ingot), Planet 8 (2 each of Hunting, Wood Chopping, Farming, Fishing), Halo 5 (one of each of its tier's five pairs, low for I and III, high for II and IV, kept by the tier that brought it), the same amounts in every tier; **the types by grade are its ladder (PP9) and catalog (PP8)**, which §11.2 follows. **Lapidary an Uma: 120 · 138 · 156 refined** (+8); by profession in §11.3. The whole Uma 485 · 503 · 521 (its numbers), every tier inside PR10's tenth |
| **class-progression.md** (its final pass) | A class-free map: her class decides which offense moon counts (the Brawler and the Mage skip one). **§9's MP column + 30 × tier** (Vigor); §9's offense without her moon's lead (−8 × tier) if CP36's note is taken. The Halo's picker groups kinds as her class branch names them (EP10). The hybrids' mirror on full maps is the hands' (CP9) |
| **Uma Templates pass** | Her moon's slot (§6): two nodes, Lv 16 and 36, Moon Jewels II and IV, × tier, outside the budget, ids `template:1–2`; knack units (Speed, Limit) don't scale; CP36's note recorded (node II to her calling channel's defense) |
| **The balance simulation** | `onCurveStars` → every node her level opens on her class's bodies, at her tier's values; `rpgFoeTierBudget`'s build part × tier (§10); the Springs test at +51 MP; Vigor's MP rate as its second knob, after legs' MP |
| **The engine** | v16: nothing new (points freeze at a fight's start; Vigor's MP is a point). v17: the Halo, flat offense joined to her Might of its kind (as the Orb is), its kinds frozen into the fight's input; Valor's Limit start and Swiftness's evasion are points |

## 14. Assumes

| From | Assumes | If not |
|---|---|---|
| README §2, tiers §5 (D15) | Tiers 1–3 of 50 levels; the map empties at promotion and is rebuilt in the new world | A carried map breaks the budget's restart (D170) |
| SB1 (README §2.5) | Every flat build value × 1, 1.8, 2.6; the foes' build budget moves to the same multiplier | Flat values: Extra Stats' share falls by up to 18.7 points by Tier 3 (§8.3); every value here is "Tier 1 value × tier", a one-line change |
| weapon-progression.md | Accessories damage-oriented: no defensive Support and no MP regen in any tier (as its draft has it); **armor takes one support's worth** (WP15: HP +15, DEF +4, M.DEF +4, MP +3 a grade, × tier) and keeps feet evasion (12% at G10); the Orb flat, half a weapon's Might, back in Tier 2, × tier; the kind cap (WP24) is X7 extended; a hit reads its own kind | If a defensive Support stays, it stays outside the budget, as today; if the Spring stays, Vigor's MP is still the pool (the Springs test re-runs); if armor keeps today's values, §8.2's HP, DEF, M.DEF and MP drop by that support's worth and Extra Stats still meets the budget alone. If feet evasion goes, Tier 1's only evasion is a Fleet knack: acceptable |
| profession-progression.md | Jewel Crafting at the Lapidary on the 5g − 4 gate; the material catalog of professions §0.3 (every type above exists); a tier's pairs low from Craft Lv 1, high from Lv 26 | It owns the amounts (PR8): if it resizes, the counts and kinds here stand |
| class-progression.md | Six classes, their channels and leans (§2.2); the presets (CP11) name the Halo's; class branches become weapon-group focus, named there | — |
| Uma Templates pass | Fills her moon's two nodes (variance U10 as drafted, CP36's note) | The slot stays empty; nothing else moves |
| Combat (D104) | A point is +1, +5 HP; 0.6% evasion; 0.4 of a 12 gauge; fights freeze points at their start | — |
| Tier 2's world (Z4, XR15) | The Halo, Valor and Swiftness sit in each tier's toolbox term, priced by its simulation; her moon outside every budget | — |

## 15. Save impact

**Deleted** (for the refund, [README §9.4](README.md#94-the-refund)):
- Every Uma's `stars.unlocked` and `stars.active`, in every tier world: today's `moon:`, `bridge:` and `sun:` ids.
- Every Star Gem in each world's `gems`: today's 100 ids (`gem-<stat>-<g>`, `gem-<a>-<b>-<g>`, `gem-sun-<g>`), in
  stock and set on nodes.
- Lapidary cuts: running and queued ones recalled (inputs back), finished uncollected ones collected first, then counted
  as stock.

**Converted:** nothing. The refund returns raw items (EP21): each open node names its gem (`nodeGem`), each gem its
refined inputs (`gems.ts`), each refined item its raw one, one for one; then professions' conversion table (PR14) turns
them into the Tier 1 types. A fully built Uma returns about 232 raw items from Star Gems; the reworked Tier 1 map asks
120 (+8).

**New, save v26** (the Tier 1 rework's migration):
- `OwnedUma.stars: { open: string[], halo: RpgDamageKind[] }`: no `active`; `halo` empty until v27.
- **Node ids,** fresh so none reads as today's: `planet:1–5`; `strength:1–5`, `sorcery:1–5`, `vigor:1–5`, `guard:1–5`;
  her moon `template:1` (knack), `template:2` (lead).
- **Jewel ids:** `jewel-planet-1–5`, `jewel-moon-1–5` in the world's stock of made items (the record the weapon line's
  Weapon Gems use, weapon-progression.md's); `gems` retires with the refund. No id collides with a gem.
- **Strict parsing:** a body the world's tier doesn't have (a Halo node in Tier 1) is refused.

**Save v27** (Tier 2's toolbox): `valor:1–2`, `halo:1–2`, `stars.halo` holding one kind; `jewel-halo-1–2`.
**Tier 3's save:** `swiftness:1–2`, `halo:3–4`, `stars.halo` holding two different kinds; `jewel-halo-3–4`.

**Promotion** empties `stars.open` and `stars.halo` in the new world (the old world keeps its own). Old fights replay
unchanged: their allies' stats are frozen in the input.

## 16. Pacing

- **Uma progression doesn't move:** fights, EXP and rewards are untouched, and the core gives what today's on-curve map
  gives within 1.25 points at every five levels ([§10](#10-the-foe-budget)). The level gate means a roster that crafts
  ahead can't push an Uma past her curve.
- **Something opens every five levels,** in every tier, alternating Planet and moons, as gear grades do.
- **The foes:** rates unchanged; tier scaling on SB1. **The defensive budget** is Extra Stats' alone at Lv 10–50
  ([§9](#9-defense-and-sustain-now-that-accessories-deal-damage)); the accessories change moves no foe.
- **MP:** +51 an Uma at Lv 46 (+21 before Vigor's), tested in the Springs; Vigor's MP rate is its second knob, after
  armor legs' MP.
- **Crafting:** 25 · 29 · 33 jewels an Uma (+2 hers) against 100 Star Gems; the Lapidary 120 · 138 · 156 refined
  (+8), 72 · 83 · 94 hours of making at Craft Lv 25; the whole Uma 485 · 503 · 521 refined, 822 · 852 · 883 hours
  (835 · 866 · 896 with her moon), every tier inside PR10's tenth (§11.3).
- **Tiers 2 and 3:** the core gives the same share at each tier's Lv 50 (§8.3), so D170's restart-and-scale holds on
  SB1. The Halo, Valor and Swiftness are the tier's tools, priced in its toolbox term (Z4), not in the build curve.
- **Simulation items** (README §9.5): the re-baseline with full maps (item 1); the mirror on full maps (item 2); the
  Springs at **+51 MP** (item 5); Tier 2: the Orb + Halo stack on one kind at 122, with Pure's ×1.5 (weapon-research
  risk 3); her moon with the affinity under U12's +5% (item 6).

## 17. Decisions

| Call | Recommendation | Alternatives, briefly | Why |
|---|---|---|---|
| **EP1** Tier 1's shape | The Planet (5 nodes) and four moons (5 each): Strength, Sorcery, Vigor, Guard; 25 nodes; her moon's 2 beside | Three nodes a moon (steps of ten levels, up to 7 points off today's curve at Lv 30); five moons (DEF and M.DEF apart) | One node every five levels, as gear; the curve within 1.25 points; "a few stat nodes" each |
| **EP2** The Planet | +1, +2, +4, +6, +8 points to all six core stats (+21 each) × tier, at Lv 1, 11, 21, 31, 41 | Worth its grade (+25: 9–13% over today late); no MP | "Every stat" is the profile's six; fits today's curve |
| **EP3** A moon node | Its grade, +2 … +10 (+30) × tier; Guard gives both defenses | Guard split per stat | D141 kept; every class needs both defenses |
| **EP4** Vigor, both pools | **New, after the accessories change (owner, 2026-10-24).** Each Vigor node gives its points to HP (×5) and to MP: +150 HP and +30 MP in Tier 1, × tier | A regen node (a new unit and mechanic); MP on the Planet at ×2 (breaks "+N to every stat"); nothing (the Spring's sustain lost) | The Spring Amulet goes; the pool replaces regen for every Uma; "both pools" mirrors Guard's "both defenses" |
| **EP5** What opens a node | Its jewel, in order, at Uma Lv 5g − 4 | Jewels only (crafting pushes a low Uma past her curve); level only (no Jewel Crafting) | The budget stays exact; the gate matches gear's; the jewel keeps the profession |
| **EP6** What counts | Every open node; no active slots | Three lit moons (toggles and class-switch chores back) | The biggest single simplification |
| **EP7** Values across tiers | **Every stat grant is its Tier 1 points × 1, × 1.8, × 2.6, rounded per node** (half up); Limit start and evasion don't scale | Flat values (the first round: Extra Stats' share halves by Tier 3); a core that adds nodes per tier | SB1: one curve, one number a tier; shares are shares already |
| **EP8** Speed and Limit | Off Tier 1's shared map; Limit returns as Tier 2's Valor, evasion as Tier 3's Swiftness; her knack and feet armor keep them meanwhile | Both moons in Tier 1 (10 more nodes, two units to explain) | The shared map shows the six stats the profile shows |
| **EP9** The Halo | Tier 2: one kind, a free setting (preset: her first slot), Halo I (+10 × tier, Lv 21) and II (+24 × tier more, Lv 46); flat on hits whose own kind is hers, never a kind, never a heal; Orb, Pendants and Halo ≤ 68 × tier on one kind (WP24) | H41's twenty nodes; a percent (+8%, +12%); a group Halo | X1, X3, X7 kept, with SB1; a tenth of the nodes |
| **EP10** The Halo and weapon groups | **New, owner context 2026-10-24.** The Halo serves kinds, never a group; a group-focused class branch points it inside its group (two kinds from Tier 3); the picker lists her slotted kinds first, then by group. No group moon | A group Halo (+61 on two or three kinds, past X7); a group moon per specialization | Strength and Sorcery already serve channels; the two kinds reach a group without a new body |
| **EP11** Valor | Tier 2: Limit start +2 (Lv 16), +2 more (Lv 36), Moon Jewels II and IV; the same in Tier 3 | No Limit on the shared map | Q9's keep, small, where Limit Breaks grow |
| **EP12** Tier 3 | The Halo's second kind (Halo III–IV, the same values, a different kind) and Swiftness (+3%, +3% evasion at Lv 16, 36); no class constellations | Class constellations (6 × 3 nodes tied to class) | The map stays class-free; Swiftness is the defense Tier 3 adds now that its second Support deals damage |
| **EP13** The core across tiers | **Changed: ES11 + SB1.** The same bodies, rebuilt empty at promotion, values × tier | The same values every tier (ES11 as written) | SB1: the build's share holds within 1.5 points (§8.3) |
| **EP14** Her moon | A marked two-node slot: I knack (Lv 16, Moon Jewel II, every class), II lead (Lv 36, Moon Jewel IV, her channel's classes); × tier; outside the budget; **CP36's note recorded** (II to her calling channel's defense) for the Uma Templates pass | A moon that grows each tier; nodes on the shared bodies; ×1.5 | The owner: minimal uniqueness for now; small, personal, easy to leave out |
| **EP15** Defense and sustain | **New, owner context 2026-10-24.** No new values: the Planet, Vigor and Guard are the defensive build the foe budget prices (alone 26–29% a hit, against its 28%, from Lv 10 to 50; armor the margin); the removed Supports were never priced, so no foe moves. MP moves from regen to the pool (EP4); the Springs test checks +51; Vigor's MP rate is its second knob, after legs' MP. Tier 3's Swiftness is its defensive body | Raise Guard and Vigor (the foes' offense rises with them); a regen node | The budget prices points; the party loses nothing on curve; the map keeps six stats |
| **EP16** The foe budget | Rates unchanged; `rpgFoeTierBudget`'s build part × tier (SB1); `onCurveStars` = every node her level opens on her class's bodies; Halo, Valor and Swiftness in the tier's toolbox term | Re-fit the rates to the new map | The core matches today's curve within 1.25 points; at each tier's Lv 50 the budget lands on Tier 1's |
| **EP17** Jewel kinds | Planet Jewel I–V, Moon Jewel I–V (any moon, picked when set), Halo Jewel I–II (Tier 2), **Halo Jewel III–IV** (Tier 3): 10 · 12 · 14 items; a numeral is the node it opens | One jewel a moon (25 items); one kind for all; the first round's Halo I–II reused for the second kind | The moon is chosen on the map, not at the bench; one name, one recipe |
| **EP18** Recipes | **One fixed amount a jewel in every tier:** Moon 4, Planet 8 (professions' Tier 1), **Halo 5** (one of each of its tier's five pairs); the type at each grade follows profession-progression's ladder (PP9). Lapidary an Uma 120 · 138 · 156 (+8); the whole Uma 485 · 503 · 521. Profession-progression.md owns the final amounts | Resize the shared jewels per tier to stay at 120 (no integer amount fits 27 and 29 jewels); a Halo Jewel at 9 (a Moon recipe plus the pairs: 146 and 172) | PR10's "base recipes never change"; the tier's pairs get a clear use; every tier inside the tenth (+3.7%, +7.4%) |
| **EP19** The Observatory | One page in every tier: the map in code, "Open n of 25 · 29 · 33", totals, the Halo's kind chips from Tier 2, the Set list with a moon picker; no toggles | Today's page with toggles; a page per tier | It grows with the map and teaches once |
| **EP20** Targets and "can upgrade" | Targets plan the Planet, her active class's moons, her moon and the tier's Halo and small moons; "can upgrade" counts a jewel she can set now | Plan every moon | A Brawler's target shouldn't ask for Sorcery jewels |
| **EP21** Old maps and Star Gems | Delete every node and Star Gem; refund raw items; no conversion | Convert old moons to new by grade | Different shapes; a clean rebuild confuses less |
| **EP22** Names and art | The Planet; Strength, Sorcery, Vigor, Guard; the Halo; Valor; Swiftness; her moon by her template. "Planet Jewel III", "Moon Jewel II", "Halo Jewel IV". Today's gem icons | "Gems" (the weapon line's word); "the Sun" for the centre (today's 100-node map) | Numerals match the nodes; no new art; "Planet" is the owner's word |

**The first round's calls, mapped:**

| Old | Now | | Old | Now |
|---|---|---|---|---|
| ES1 Tier 1's shape | EP1 (kept) | | ES9 Valor | EP11 (kept) |
| ES2 the planet's values | EP2 (kept, × tier) | | ES10 Tier 3 | EP12 (kept) |
| ES3 a moon node | EP3, **EP4** (Vigor gains MP) | | ES11 the core across tiers | **EP13** (× tier) |
| ES4 what opens a node | EP5 (kept) | | ES12 her moon | EP14 (a marked slot, CP36's note) |
| ES5 every open node counts | EP6 (kept) | | ES13 the foe budget | **EP16** (SB1 scaling), EP15 |
| ES6 Speed and Limit | EP8 (kept) | | ES14 old maps and gems | EP21 (kept) |
| ES7 two jewel kinds | **EP17** (Halo III–IV) | | ES15 names and art | EP22 (kept) |
| ES8 the Halo | EP9 (× tier), EP10 | | ES16 targets | EP20 (kept) |

In bold, the calls the SB1 rule and the owner's 2026-10-24 context changed. New: EP7 (values × tier), EP15 (defense
and sustain), EP18 (fixed recipes), EP19 (the screen per tier).
