# Extra Stats Progression: the Planet and its moons from Tier 1 to Tier 3

> **Approved by the owner, 2026-10-24 (D194): every call EP1–EP29 as written.** Changes from here are follow-ups logged against it.

> **R2 live from H82, 2026-10-26 (D218)** (a follow-up, no decision changed): Tier 1's part of this doc plays in the
> game on engine v17 and save v28: the Planet and three moons, Prowess by class, Vigor and Guard, her moon, the jewels
> that open them, and Star Gems retired. The manual ([loops](../../game/loops.md), [materials](../../game/materials.md))
> describes them as played.

> **Follow-up to D196 (stat balancing), 2026-10-25** (logged against D194; values only, as
> [stat-balance §13](stat-balance.md#13-if-approved-the-follow-ups-by-doc) lists them): **EP29, a hybrid's weapon moons
> on her lead half** (SB10: the Spell Blade's Split Lance + Katana in Tier 2, Full Lance in Tier 3; the Summoner's Split
> Light + Dark, Full Light; the Blademaster's and the Conjurer's the same way; §5.3, §8.1–§8.2, whose lead-kind columns
> move only by the Great Pendant's 0.55, SB8); **EP4 and EP15, MP: the pool and a base regen for every Uma** (SB18:
> 0.8% of her max MP a round for each skill depth open) and the knobs re-ranked, SB18's share a depth first, then Vigor's
> MP rate, then legs (§9, §16); **EP16, the weapon moons priced in the new toolbox terms**, about a quarter of Tier 2's
> toolbox (×1.14) and Tier 3's (×1.23), in Tier 2's +27% and Tier 3's ×1.08 → ×1.48 (SB3, SB4; §10). Each edited spot
> says "Follow-up to D196 (stat balancing), 2026-10-25".

> **Follow-up to D197 (Uma Templates), 2026-10-25** (logged against D194; wording and values only, as
> [uma-templates §12](uma-templates.md#12-if-approved-the-follow-ups-by-doc) lists them): **EP14 decided (UT10): her
> moon's values as written, node II on her calling channel's defense** (§6.1, §6.3, §6.8); **the Flourish is 4% of her
> max HP a fight**, Clean break, Even pace or Late reserve by stride (UT6, UT16; §6.5, §6.7); **the affinity retires**
> (UT11; §6.6), and since the Flourish leaves MP no template piece moves pace; **the MP knobs no longer list the
> Flourish** (EP15; §9, §16). [uma-templates.md](uma-templates.md) owns every template piece; this doc keeps her moon's
> slot. Each edited spot says "Follow-up to D197 (Uma Templates), 2026-10-25".

> **Authored 2026-10-24; revised after the owner's review the same day. Nothing here is built.** The third standalone
> doc of the Tier rework ([README §5](README.md#5-the-plan), step 3.3). It absorbs [extra-stats.md](../../archive/design/tier-rework/extra-stats.md),
> which stays as history, and supersedes every ES call ([§17](#17-decisions) maps each one). Calls are **EP1–EP29**,
> each with a recommendation. No open questions.
>
> **The owner's review, 2026-10-24** (five points, [the table](#the-owners-points)):
> - **"Tier 2 and Tier 3 feel too low impact … I get like 3% evasion, which does nothing."** Tier 1 stays the general
>   stats; **Tier 2 adds a weapon moon** (five nodes of flat offense on her hits of one kind, +50 × tier; or **split** on
>   two kinds at 0.7 each, the Pure-or-Dual choice of the moons), **Tier 3 a second one**, so a Full and a Split moon
>   serve all three of her weapons ([§4](#4-tier-2-a-weapon-moon), [§5](#5-tier-3-the-second-weapon-moon); EP24–EP26).
>   Measured: Tier 2's moon adds **+12–16% to her act** (+17–23% to the hits of its kinds), Tier 3's two **+21–23%**,
>   where the Halo added 5–8% and 9–12% ([§8.4](#84-each-tiers-impact-on-her-damage)).
> - **The Halo, Valor and Swiftness retire** ([§5.4](#54-what-retired-the-halo-valor-and-swiftness-ep9-ep11-ep28)): the
>   Halo folds into the weapon moons; Limit start and evasion stay her knack's and feet armor's.
> - **Class symmetry:** Strength and Sorcery merge into **Prowess**, one offense moon whose points follow her class's
>   damage split (Brawler 100/0, Mage 0/100, Spell Blade 70/30, Summoner 30/70, Paladin 80/20, Cleric 20/80). **Every
>   class opens the same 20 · 25 · 30 nodes and needs the same jewels** ([§3.3](#33-prowess-one-offense-moon-split-by-her-class-ep23); EP23).
> - **Her moon, fleshed out** ([§6](#6-her-moon-the-template-slot-in-full)): every knack and its value by tier, the lead
>   node on her calling channel's defense (CP36's note, with the signature accessory WP33), six invented Umas, how it
>   shows, and the template's budget against U12's +5% at every tier ([the her-moon page](previews/stars-uma.html)).
> - **Everything after it redone:** the sheets and the build-share proof under SB1, the foe budget, the jewels (two
>   kinds in every tier; a proposed Planet Jewel of 12, so the Lapidary stays at 120 in Tier 1), the Observatory,
>   presets, save impact. Calls the review changed say "Changed after owner review, 2026-10-24" in §17;
>   [§18](#18-interface-changes) holds the interface changes for weapon-progression and profession-progression.
>
> **Earlier the same day** (history): the cross-check with the other three standalone docs (README §7, XC1–XC16) and
> the weapon review's follow-ups (XC19–XC20) aligned the sheet, the groups and the Halo's preset; this revision
> replaces the bodies they described.
>
> **Pages** (full desktop, light and dark): [the map at every tier, every node, every class](previews/stars-maps.html) ·
> [each tier's impact, the sheets and the build share](previews/stars-grants.html) ·
> [the jewels, equal for every class, and the recipes](previews/stars-jewels.html) ·
> [her moon: knacks, lead, six Umas, the budget](previews/stars-uma.html).
>
> **Interfaces, not designed here:** accessories, armor, weapon branches, the kind cap and the damage stack
> (weapon-progression.md; changes asked in [§18.1](#181-for-weapon-progression-follow-up-to-d193)); material amounts and
> the Lapidary's place (profession-progression.md; [§18.2](#182-for-profession-progression)); her moon's content and
> the signature's family (the Uma Templates pass, *since D197 [uma-templates.md](uma-templates.md)*); class hands and the
> mirror (class-progression.md).

## The owner's points

| The owner's point | Answered in |
|---|---|
| "Extra Stats needs heavy Tier 1 simplification" | [§3](#3-tier-1-the-planet-and-three-moons): 20 nodes instead of 100, two node kinds, two jewel kinds and ten items, no active slots; the count in [§3.6](#36-tier-1s-complexity-today-and-proposed) |
| "Maybe one single planet that increases all stats" | [§3.1](#31-the-bodies): **the Planet**, five nodes, +21 points to each of the six core stats in Tier 1 (× tier after) |
| "Individual moons with few stat nodes" | [§3.1](#31-the-bodies): three moons, five nodes each: **Prowess** (offense, by her class), **Vigor** (HP and MP), **Guard** (DEF and M.DEF) |
| "And more as tiers progress" | [§4](#4-tier-2-a-weapon-moon), [§5](#5-tier-3-the-second-weapon-moon): a weapon moon in Tier 2 (25 nodes), a second in Tier 3 (30); every value × 1.8 and × 2.6 |
| "Some previsualization would be great"; "visuals for suns and moons and everything the Extra Stats would grant" (2026-10-24) | [The map](previews/stars-maps.html) (tier, class, level, weapon-moon settings; every node hoverable), [the grants](previews/stars-grants.html), [the jewels](previews/stars-jewels.html), [her moon](previews/stars-uma.html) |
| Stat growth mustn't drift across tiers (SB1, 2026-10-23) | [§8.3](#83-the-builds-share-holds-sb1): every core stat's Extra Stats share moves at most 1.5 points from Tier 1 to Tier 3 (flat values: it falls 8.6–13.2) |
| 2026-10-24: accessories damage-oriented; defense lives in armor | [§9](#9-defense-and-sustain-now-that-accessories-deal-damage): the Planet, Vigor and Guard carry the defensive build the foe budget prices; Vigor's MP replaces the Spring (EP4, EP15) |
| 2026-10-24: specializations become weapon-group focus | EP10: weapon moons serve kinds, never a group; a focused branch points them inside its group |
| 2026-10-24: Uma uniqueness minimal | [§6](#6-her-moon-the-template-slot-in-full): her moon stays two nodes; the review asked for clarity, not more nodes |
| **Review, 2026-10-24:** "Tier 2 and Tier 3 feel too low impact … I get all the way to Tier 3 and I get like 3% evasion, which does nothing." Tier 1 "general stats, that's fine" | **Tier 1 kept** (the Planet, Vigor, Guard and their values; only the offense moon merges, below). **Tier 2 and 3 rebuilt around weapon moons** ([§4](#4-tier-2-a-weapon-moon), [§5](#5-tier-3-the-second-weapon-moon)); each tier's impact measured ([§8.4](#84-each-tiers-impact-on-her-damage)): Extra Stats is **21–27% of her damage in Tier 1, 31–34% in Tier 2, 34–38% in Tier 3** (the first draft: 25–29%, 29–33%, 31–34%) |
| **Review:** "Tier 2: a single moon with multiple levels that increases a single weapon type's stats; if it's a Dual weapon vs Pure maybe we reflect that here" | **A weapon moon** (EP24): five nodes, Moon Jewels I–V, Lv 6–46, **Full** on one kind (+90 in Tier 2) or **Split** on two (+63 each), "two weapon moons at less effectiveness", drawn as two moonlets on one track ([§4.2](#42-full-or-split-ep25), EP25); the split's 0.7 makes each the best somewhere |
| **Review:** "Tier 3: one or two extra weapon moons for specific damage types, so we can improve all three weapon types for a single Uma" | **A second weapon moon** (EP26): one more Full (one extra moon) or Split (two extra), every kind different; **Full + Split serves all three weapons** ([§5](#5-tier-3-the-second-weapon-moon)) |
| **Review:** what becomes of the Halo, Valor (Limit start) and Swiftness (evasion) | **All three retire** (EP9, EP11, EP28; [§5.4](#54-what-retired-the-halo-valor-and-swiftness-ep9-ep11-ep28)): the Halo is the weapon moons' first draft; Limit start and evasion stay on her knack and feet armor |
| **Review:** "Mages and Brawlers requiring fewer jewels makes no sense … 70% of extra stats on the physical moon and 30% on the magic moon; make it symmetric to class identity; maybe cap totals so every class has a max amount of unlocks" | **Prowess** (EP23, [§3.3](#33-prowess-one-offense-moon-split-by-her-class-ep23)): one offense moon, its points split by her class (100/0, 0/100, 70/30, 30/70, 80/20, 20/80); every class **20 · 25 · 30 nodes and jewels**; capped node counts per moon weighed and set aside (uneven steps, a Spell Blade's fifth offense node at Lv 6) |
| **Review:** "more clarity on the Uma variance for stats, maybe flesh it out more" | [§6](#6-her-moon-the-template-slot-in-full) and [the her-moon page](previews/stars-uma.html): five knacks with values by tier, the lead node and its scope, gates and jewels, six invented Umas, the Observatory and her profile, the template budget per tier against U12 |
| **Review:** redo what follows | Sheets and shares (§8), the foe budget (§10), jewels (§11), the Observatory (§12), presets ([§5.3](#53-presets-for-every-class-and-both-branches-ep29)), save (§15), pacing (§16), the calls (§17), interface changes (§18) |

## 0. At a glance

| | Today (every tier) | Tier 1 | Tier 2 | Tier 3 |
|---|---|---|---|---|
| **Bodies** | A Sun, 8 planets | **The Planet and three moons:** Prowess, Vigor, Guard | + **a weapon moon** | + **a second weapon moon** |
| **Shared nodes** (every class) | 100: 80 moons, 16 bridges, 4 Sun | **20** | **25** | **30** |
| **Her moon** | — | 2 nodes | 2 | 2 |
| **Stats on the map** | 8 | The six core stats | + flat offense on one kind (Full) or two (Split) | + one or two more: **all three of her weapons** |
| **Offense moon** | Planets by stat; four stats a class | **Prowess:** her class's split of +30 (Brawler all ATK; Spell Blade 21 ATK, 9 M.ATK …) | × 1.8 | × 2.6 |
| **What counts** | 5 → 30 active slots, by hand | **Every open node** | The same | The same |
| **What opens a node** | Its Star Gem, in order | **Its jewel, in order, at Uma Lv 5g − 4** | The same | The same |
| **Values** | Flat | **Tier 1's** | **× 1.8** | **× 2.6** |
| **A stat with its moon, Lv 50** | About +50 | **+51** (HP +255) | **+92** (HP +460) | **+133** (HP +665) |
| **Weapon moons, Lv 50** | — | — | **Full +90** on one kind, or **Split +63** on two | + **Full +130** and **Split +91** on two (both at Tier 3's values) |
| **What the tier's new bodies add to her act** | — | The map: **+27–37%** | **+12–16%** (+17–23% on its kinds' hits) | **+21–23%** (+17–31% on every kind she slots) |
| **Extra Stats' share of her damage** | — | 21–27% | **31–34%** | **34–38%** |
| **Limit start · evasion** | Limit and Speed planets | Her knack (Gritty, Fleet); feet armor 12% | The same | The same |
| **Jewel kinds · items** | 3 · 100 Star Gems | **2 · 10:** Planet I–V, Moon I–V | 2 · 10 | 2 · 10 |
| **Jewels an Uma** (every class) | 100 | **20** (+2 her moon) | **25** (+2) | **30** (+2) |
| **Lapidary, refined an Uma** (proposed Planet Jewel 12) | 232 | **120** (+8) | **140** (+8) | **160** (+8) |
| **Choices** | Which of 100 gems; which 30 nodes count | Which moon takes the next Moon Jewel | + her weapon moon: Full or Split, and its kinds (free outside fights) | + the second's |

#### Later tiers at a glance

| Piece | Tier 2 | Tier 3 | Where |
|---|---|---|---|
| **The core** | The same Planet and three moons, rebuilt empty in the new world, × 1.8 | × 2.6 | [§2](#2-the-rules-every-tier-shares), [§3.2](#32-every-node) |
| **Weapon moon 1** | Five nodes at Lv 6, 16, 26, 36, 46: **Full** +7 → +90 on one kind, or **Split** +5 → +63 on each of two | Rebuilt, × 2.6: Full +130, Split +91 | [§4](#4-tier-2-a-weapon-moon) |
| **Weapon moon 2** | — | Five nodes more, Full or Split; every kind different; **Full + Split serves her three weapons** | [§5](#5-tier-3-the-second-weapon-moon) |
| **Presets** | Split on her two most-used kinds (a hybrid's two lead-half kinds: *follow-up to D196*) | Full on the most-used, Split on the other two (a hybrid's Full on her lead half) | [§5.3](#53-presets-for-every-class-and-both-branches-ep29) |
| **Her moon** | Rebuilt, × 1.8 | × 2.6 | [§6](#6-her-moon-the-template-slot-in-full) |
| **Jewels** | Five more Moon Jewels (I–V); no new kind | Five more | [§11](#11-jewels) |
| **Retired** | The Halo, Valor | The Halo's second kind, Swiftness | [§5.4](#54-what-retired-the-halo-valor-and-swiftness-ep9-ep11-ep28) |

## 1. Today

The Observatory, as built ([loops](../../game/loops.md#extra-stats-and-gear), [materials](../../game/materials.md#jewels),
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

- **Every open node counts, always** (EP6). No active slots, no switching, no toggles.
- **Every class opens the same nodes** (EP23, *changed after owner review, 2026-10-24*): 20 in Tier 1, 25 in Tier 2,
  30 in Tier 3, and needs the same jewels. Her class decides only **how Prowess splits** (ATK against M.ATK); every
  moon helps every class, so nothing on the map is ever dim for her.
- **A node opens with its jewel, in order, at her level** (EP5): node II after node I on each body; grade g at
  **Uma Lv 5g − 4** of her tier, the gear cadence. A jewel in stock above her level waits ("Opens at Lv 36").
- **Something opens every five levels:** the Planet on Lv 1, 11, 21, 31, 41 (odd grades); every moon, the weapon moons
  included, on Lv 6, 16, 26, 36, 46 (even grades).
- **Values are Tier 1's × the tier** (EP7, SB1): **× 1, × 1.8, × 2.6**, each node rounded to the nearest point (half
  up), so a body lands within one point of the exact product: the Planet's +21 a stat becomes +38 and +55, a moon's +30
  becomes +54 and +78, a Full weapon moon's +50 becomes +90 and +130. HP is 5 a point after rounding. **Prowess's
  split** rounds each node's larger share half up and gives the rest to the smaller, so the node's total holds.
- **Limit start and evasion are off the shared map in every tier** (EP8, EP28): they are shares already, and the review
  found Valor's +4 and Swiftness's +6% too small to feel. Her knack (Gritty, Fleet) and feet armor (12% at G10) keep them.
- **The core is rebuilt at every promotion** (EP13): the new world's Uma starts with an empty map, as today (D15); the
  same bodies come back with the tier's values. Tiers add weapon moons, never nodes on the core.
- **Extra Stats never adds a kind** ([weapon-research §2](../../archive/design/tier-rework/weapon-research.md#2-who-owns-what)): a weapon moon is flat
  offense on hits of a kind she already holds; weaknesses, locks and shields read only her weapons. **It never heals:**
  mends and Barriers read ATK or M.ATK without it (Prowess, which is ATK and M.ATK, does reach them).

## 3. Tier 1: the Planet and three moons

### 3.1 The bodies

| Body | Gives | Nodes | Grades · opens at | Jewel | In all, Tier 1 | Who uses it |
|---|---|---|---|---|---|---|
| **The Planet** | **Every core stat:** HP, MP, ATK, M.ATK, DEF, M.DEF | 5 | 1, 3, 5, 7, 9 · Lv 1, 11, 21, 31, 41 | Planet Jewel I–V | **+21 each** (HP +105) | Every class |
| **Prowess** | **Offense: her class's split** of each node between ATK and M.ATK ([§3.3](#33-prowess-one-offense-moon-split-by-her-class-ep23)) | 5 | 2, 4, 6, 8, 10 · Lv 6, 16, 26, 36, 46 | Moon Jewel I–V | **+30** split: Brawler ATK 30; Spell Blade ATK 21, M.ATK 9 … | Every class |
| **Vigor** | **Both pools:** HP (+5 a point) and MP | 5 | The same | Moon Jewel I–V | **+150 HP, +30 MP** | Every class |
| **Guard** | **Both defenses:** DEF and M.DEF | 5 | The same | Moon Jewel I–V | +30 DEF, +30 M.DEF | Every class |
| ★ **Her moon** ([§6](#6-her-moon-the-template-slot-in-full)) | I her knack, II her lead | 2 | 4, 8 · Lv 16, 36 | Moon Jewels II, IV | +4, +8 | Hers |

- **The Planet** gives less a stat than a moon because it gives to all six; it sits on the odd grades, the moons on the
  even, so the two alternate every five levels. Speed and Limit stay off the shared map (EP8).
- **A moon node is worth its grade** (D141, kept): +2, +4, +6, +8, +10.
- **Three moons, each a job:** Prowess her offense, Vigor her pools (EP4: the Spring Amulet's MP regen goes with the
  accessories change, and the pool takes its place), Guard her defenses. *Changed after owner review, 2026-10-24: the
  first draft's Strength (ATK) and Sorcery (M.ATK) are one moon, Prowess; Tier 1's Planet, Vigor and Guard and every
  value are as they were.*

### 3.2 Every node

Grants are points; HP is 5 a point. Tiers 2 and 3 are Tier 1 × 1.8 and × 2.6, rounded per node (EP7).

| Node | Grade | Opens at | Jewel | Tier 1 | Tier 2 (× 1.8) | Tier 3 (× 2.6) |
|---|---|---|---|---|---|---|
| **Planet I** | 1 | Lv 1 | Planet Jewel I | +1 to each of six (HP +5) | +2 (HP +10) | +3 (HP +15) |
| **Planet II** | 3 | Lv 11 | Planet Jewel II | +2 (HP +10) | +4 (HP +20) | +5 (HP +25) |
| **Planet III** | 5 | Lv 21 | Planet Jewel III | +4 (HP +20) | +7 (HP +35) | +10 (HP +50) |
| **Planet IV** | 7 | Lv 31 | Planet Jewel IV | +6 (HP +30) | +11 (HP +55) | +16 (HP +80) |
| **Planet V** | 9 | Lv 41 | Planet Jewel V | +8 (HP +40) | +14 (HP +70) | +21 (HP +105) |
| *The Planet in all* | | | 5 jewels | **+21 each (HP +105)** | **+38 (HP +190)** | **+55 (HP +275)** |
| **Moon I** (any moon) | 2 | Lv 6 | Moon Jewel I | +2 | +4 | +5 |
| **Moon II** | 4 | Lv 16 | Moon Jewel II | +4 | +7 | +10 |
| **Moon III** | 6 | Lv 26 | Moon Jewel III | +6 | +11 | +16 |
| **Moon IV** | 8 | Lv 36 | Moon Jewel IV | +8 | +14 | +21 |
| **Moon V** | 10 | Lv 46 | Moon Jewel V | +10 | +18 | +26 |
| *A moon in all* | | | 5 jewels | **+30** | **+54** | **+78** |

| Moon | I | II | III | IV | V | In all: Tier 1 · 2 · 3 |
|---|---|---|---|---|---|---|
| **Prowess** | +2, split by her class | +4 | +6 | +8 | +10 | +30 · +54 · +78, split ([§3.3](#33-prowess-one-offense-moon-split-by-her-class-ep23)) |
| **Vigor** | HP +10, MP +2 | HP +20, MP +4 | HP +30, MP +6 | HP +40, MP +8 | HP +50, MP +10 | HP +150 · +270 · +390; MP +30 · +54 · +78 |
| **Guard** | DEF and M.DEF +2 | +4 | +6 | +8 | +10 | Each +30 · +54 · +78 |

### 3.3 Prowess: one offense moon, split by her class (EP23)

**The owner (review, 2026-10-24):** "Mages and Brawlers requiring fewer jewels makes no sense; Spell Blades are likely
only to ever increase physical stats, or maybe get 70% of extra stats on the physical moon and 30% on the magic moon;
we have to make it symmetric to class identity." **The call: one offense moon, Prowess, whose every node splits its
points by her active class's damage split.** Every class opens it, so every class opens the same nodes and sets the
same jewels; what differs is only where her offense goes, as her class does.

| Class | Split (ATK / M.ATK) | Why | Prowess, Tier 1 · 2 · 3 (ATK / M.ATK) | With the Planet, Lv 50 (ATK / M.ATK) |
|---|---|---|---|---|
| **Brawler** | **100 / 0** | All physical (CP1) | 30 / 0 · 54 / 0 · 78 / 0 | 51 / 21 · 92 / 38 · 133 / 55 |
| **Mage** | **0 / 100** | All magical | 0 / 30 · 0 / 54 · 0 / 78 | 21 / 51 · 38 / 92 · 55 / 133 |
| **Spell Blade** | **70 / 30** | Her 70/30 (CP1; the owner's numbers) | 21 / 9 · 39 / 15 · 55 / 23 | 42 / 30 · 77 / 53 · 110 / 78 |
| **Summoner** | **30 / 70** | The mirror | 9 / 21 · 15 / 39 · 23 / 55 | 30 / 42 · 53 / 77 · 78 / 110 |
| **Paladin** | **80 / 20** | Her mends and Barriers read ATK; her acts at half hand, two Arms to one Tome: about half heals (all ATK) and half blows and spells (two thirds ATK), 0.5 × 1 + 0.5 × ⅔ ≈ 0.83, rounded to 80/20 | 24 / 6 · 43 / 11 · 63 / 15 | 45 / 27 · 81 / 49 · 118 / 70 |
| **Cleric** | **20 / 80** | The mirror: mends from M.ATK, two Tomes to one Arm | 6 / 24 · 11 / 43 · 15 / 63 | 27 / 45 · 49 / 81 · 70 / 118 |

**Every node, by class** (ATK / M.ATK; the larger share rounded half up, the node's total kept):

| Node (points: T1 · T2 · T3) | Brawler, Mage | Spell Blade · Summoner | Paladin · Cleric |
|---|---|---|---|
| **I** (2 · 4 · 5) | all on her channel | 1/1 · 3/1 · 4/1 (Summoner mirrored) | 2/0 · 3/1 · 4/1 (Cleric mirrored) |
| **II** (4 · 7 · 10) | all | 3/1 · 5/2 · 7/3 | 3/1 · 6/1 · 8/2 |
| **III** (6 · 11 · 16) | all | 4/2 · 8/3 · 11/5 | 5/1 · 9/2 · 13/3 |
| **IV** (8 · 14 · 21) | all | 6/2 · 10/4 · 15/6 | 6/2 · 11/3 · 17/4 |
| **V** (10 · 18 · 26) | all | 7/3 · 13/5 · 18/8 | 8/2 · 14/4 · 21/5 |
| *In all* (30 · 54 · 78) | 30 · 54 · 78 | 21/9 · 39/15 · 55/23 | 24/6 · 43/11 · 63/15 |

**Every class's map, Tier 1** (the same in Tiers 2 and 3, × tier, plus the weapon moons):

| Class | Nodes · jewels | Planet | Prowess | Vigor | Guard | Her Extra Stats at Lv 50 |
|---|---|---|---|---|---|---|
| Every class | **20 · 20** (5 Planet, 15 Moon) | +21 to all six | +30, her split | HP +150, MP +30 | DEF, M.DEF +30 | HP +255, MP +51, DEF +51, M.DEF +51, and ATK / M.ATK as the table above |

- **Why one moon and not capped counts on two** (the owner's other option): with Strength and Sorcery kept and a cap of
  five offense nodes, a 70/30 class would open Strength I–IV and Sorcery I (+20 / +2, not +21 / +9), her fifth offense
  node opening at Lv 6 and nothing at Lv 46; the in-order rule makes every capped split lumpy. One moon keeps the cadence
  (a node every ten levels at the moons' grades) and lands each class on its split within a point.
- **A class switch moves nothing:** Prowess's split follows her **active** class, read when a fight starts (points
  freeze there, as today). A Brawler who turns Mage keeps every node, and her Prowess turns to M.ATK; the first draft
  asked her for five Sorcery jewels.
- **What it costs the four between** (measured in [§8.4](#84-each-tiers-impact-on-her-damage)): a hybrid's or healer's
  offense from Extra Stats falls to her class's share (a Spell Blade's ATK +42 and M.ATK +30 at Lv 50, the first draft's
  +51 and +51): **−7% (Spell Blade), −8% (Summoner), −7% (healers) a Tier 1 act** against the first draft's map, and the
  same as the first draft from Tier 2 on (the weapon moons). The two hybrids stay mirrors (within 1%); the Tier 1
  re-baseline and the mirror check (README §9.5 items 1–2, CP9) re-tune **the hands, never the map**. A healer's mends
  read ATK or M.ATK, so a Paladin's +45 ATK (first draft +51) is her heals' Extra Stats part.

### 3.4 What she has, level by level

A stat with its moon (the Planet and a full moon: HP, MP, DEF and M.DEF for every class; ATK for the Brawler, M.ATK
for the Mage), on curve, and the Planet alone:

| Uma Lv | 1 | 6 | 11 | 16 | 21 | 26 | 31 | 36 | 41 | 46 |
|---|---|---|---|---|---|---|---|---|---|---|
| Opens | Planet I | Moons I | Planet II | Moons II, her moon I | Planet III | Moons III | Planet IV | Moons IV, her moon II | Planet V | Moons V |
| **Tier 1**, a stat with its moon | +1 | +3 | +5 | +9 | +13 | +19 | +25 | +33 | +41 | **+51** |
| Tier 1, the Planet alone | +1 | +1 | +3 | +3 | +7 | +7 | +13 | +13 | +21 | +21 |
| Tier 1, a Spell Blade's ATK (Planet + 70% Prowess) | +1 | +2 | +4 | +7 | +11 | +15 | +21 | +27 | +35 | **+42** |
| **Tier 2** (× 1.8) | +2 | +6 | +10 | +17 | +24 | +35 | +46 | +60 | +74 | **+92** |
| **Tier 3** (× 2.6) | +3 | +8 | +13 | +23 | +33 | +49 | +65 | +86 | +107 | **+133** |
| Tier 2, **a weapon moon** (Full · Split, on its kinds) | — | +7 · +5 | +7 · +5 | +20 · +14 | +20 · +14 | +38 · +27 | +38 · +27 | +61 · +43 | +61 · +43 | **+90 · +63** |
| Tier 3, a weapon moon (Full · Split) | — | +10 · +7 | +10 · +7 | +28 · +20 | +28 · +20 | +54 · +38 | +54 · +38 | +88 · +62 | +88 · +62 | **+130 · +91** |

### 3.5 Her choices

- **Which moon takes the next Moon Jewel.** A Moon Jewel is picked for a moon when set, never when made, so the crafter
  only decides how many. Every moon helps her, so the Set list offers them in map order (Prowess, Vigor, Guard, then the
  weapon moons) and suggests the one furthest behind.
- **The Planet needs no thought:** one Planet Jewel a grade.
- **No moon to skip:** the first draft's "whether to open her other offense moon" is gone with it.

### 3.6 Tier 1's complexity, today and proposed

| What a Tier 1 player handles for one Uma | Today | Proposed |
|---|---|---|
| Bodies | A Sun and 8 planets | **The Planet and 3 moons** (+ her moon) |
| Nodes | 100: 80 moons, 16 bridges, 4 Sun | **20:** 5 Planet, 15 moon (+ 2 hers) |
| Node kinds | 3 (moon, bridge, Sun) | **2** (Planet, moon) |
| Stats on the shared map | 8 | **6**, the profile's core stats |
| Item kinds · items | 3 · 100 Star Gems | **2 · 10** jewels |
| Items to finish her | 100 | **20** in every class, + 2 hers |
| Active slots | 5 → 30, re-chosen every 2 levels | **None** |
| What gates a node | Its gem, in order | Its jewel, in order, and her level |
| Decisions | Which of 100 gems; which 30 of up to 100 open nodes count | Which moon gets the next Moon Jewel |
| The Lapidary's picker | 3 tabs: Moons (80), Bridges (16), Sun (4) | One row: Planet I–V, Moon I–V |
| Refined items an Uma | 232 | 120 (+ 8 hers), with the proposed Planet Jewel of 12 (§11.2) |

## 4. Tier 2: a weapon moon

The core again, rebuilt empty in the Tier 2 world with values × 1.8, plus **one weapon moon: 25 shared nodes**, every
class. *Changed after owner review, 2026-10-24: the first draft's Halo (two nodes, one kind) and Valor (Limit start)
are replaced.*

### 4.1 Weapon moons (EP24)

**The owner's model:** "a single moon with multiple levels that increases a single weapon type's stats". A **weapon
moon** is a moon like the others (five nodes, Moon Jewels I–V, Lv 6–46) whose nodes give **flat offense on her hits of
a kind**.

| Node | Grade | Opens at | Jewel | Full: Tier 1 value (× tier) | Tier 2 Full | Tier 2 Split, each kind | Tier 3 Full | Tier 3 Split, each |
|---|---|---|---|---|---|---|---|---|
| **I** | 2 | Lv 6 | Moon Jewel I | +4 | **+7** | +5 | +10 | +7 |
| **II** | 4 | Lv 16 | Moon Jewel II | +7 | **+13** | +9 | +18 | +13 |
| **III** | 6 | Lv 26 | Moon Jewel III | +10 | **+18** | +13 | +26 | +18 |
| **IV** | 8 | Lv 36 | Moon Jewel IV | +13 | **+23** | +16 | +34 | +24 |
| **V** | 10 | Lv 46 | Moon Jewel V | +16 | **+29** | +20 | +42 | +29 |
| *In all* | | | 5 Moon Jewels | **+50** | **+90** | **+63 on each of two** | **+130** | **+91 on each of two** |

- **Its size: a Full moon gives its kind what the whole Tier 1 map gives a stat** (+50 × tier against the Planet and a
  moon's +51): the owner's "matter as much as Tier 1's map", on the kinds it serves. A node is worth its grade × 1.5 + 1
  (+4, +7, +10, +13, +16), × tier (EP7), a Split node 0.7 of the Full one, rounded per node.
- **Flat, as an Orb is:** it joins her offense on **every hit whose own kind is the moon's**: Attacks, skills, class
  skills cast through that weapon, a Bell's follow-up, both halves of a hybrid's pair (each half its own kind), summons
  and Limit Breaks of that kind. **Never a heal, never a kind:** weaknesses, locks and shields never read it.
- **It reads a hit's own kind** (WP13): a Dual's partner earns nothing, so no branch doubles it. The owner's "two
  weapon moons for the two kinds of her Dual weapon" is read through that rule: her Dual's partner never hits as its
  own kind in her slots (her slotted kinds are all different, partners included), so a Split serves **two kinds she
  slots**, most often her Dual and one more.
- **Its kinds are a setting, free outside fights,** like the Orb's kind; a kind she doesn't slot does nothing ("No Bow
  in her slots"). The picker lists her three slotted kinds first, then the rest by her class branch's groups.
- **Weapon groups (EP10):** a weapon moon serves kinds, never a group: a group moon would put +90 on two or three kinds
  at once. A focused class branch points its moons inside its group.
- **Outside the kind cap** (EP27; an interface change, [§18.1](#181-for-weapon-progression-follow-up-to-d193)): it is
  Extra Stats' build value, as Prowess is, bounded by its own size (+50 × tier on a kind). Under the approved cap (+68 ×
  tier, the Halo inside it), every Great Orb would cap in Tier 3 beside a moon (+114 + 91 > 177), breaking the
  accessories' viability (WP §5.7).
- **On screen:** "Lance moon +90" (Full) or "Lance moon +63 · Greatsword moon +63" (Split) in the Battle tab's Offense
  group, where "Halo · Katana +61" was.

### 4.2 Full or Split (EP25)

**The owner:** "let her either pick one weapon moon for one kind at full effect (Pure), or select two weapon moons for
the two kinds … at less effectiveness each." **Full:** one kind, the full values. **Split:** two different kinds, 0.7
of the Full values on each; drawn as **two moonlets on one track**: the same five nodes and five jewels light both, as
the Twin Orb is one slot with two kinds. Not "Pure" and "Dual" on screen: those words are the weapon branches'
(README §2.4); "Full" and "Split" say the same thing about a moon.

**Why 0.7:** each is someone's best. A Split is worth 1.4 Full moons spread over two kinds, so it wins where her damage
spreads (the campaign) and loses where one kind carries it (a tuned front, a long fight on one weakness). **Full beats
Split when her damage on the Full's kind is more than 2⅓ times her damage on the Split's second kind.** The damage model
(§8.4: offense² ÷ (offense + defense), foe defense 190 × tier; her acts spread over her weapons as §8.4 says):

| Class (Tier 2, default set) | Campaign: Full · Split (what the moon adds to her act) | Tuned (75% of her choosable acts on one kind): Full · Split | Tier 3: Full + Split · Full + Full |
|---|---|---|---|
| Brawler | Full Lance +10.4% · **Split Lance + Greatsword +12.6%** | **Full Lance +19.0%** · Split +15.4% | **+21.0%** · +17.9% |
| Mage | Full Fire +10.2% · **Split Fire + Ice +12.4%** | **Full Fire +18.6%** · Split +15.1% | **+20.5%** · +17.7% |
| Spell Blade | Full Lightning +11.0% · **Split Lightning + Katana +15.0%** | Full Katana +14.1% · **Split +17.6%** | **+22.1%** · +20.0% |
| Summoner | Full Bow +14.5% · **Split Bow + Dark +15.5%** | Full Dark +11.8% · **Split +18.5%** | **+23.2%** · +19.4% |
| Paladin | Full Light +11.6% · **Split Light + Greatsword +14.2%** | **Full Light +22.7%** · Split +18.5% | **+23.2%** · +18.2% |
| Cleric | Full Light +12.4% · **Split Light + Ice +15.1%** | **Full Light +21.3%** · Split +17.3% | **+23.2%** · +18.6% |

- **Split wins the campaign for every class; Full wins a tuned front for the pure classes and the healers** (the
  Rift's guided builds, a region she farms). **A hybrid's best is a Split on her pair** (her lone half's kind is in
  every act), as the Twin Orb is hers among the Orbs.
- **At 0.7 the margins are even:** Split leads the campaign by 1–4 points, Full leads a tuned front by 3.5–4 (the pure
  classes, the healers). **At 0.8** (the Twin Orb's share of a base Orb) Split would lead the campaign by 3–6 and Full
  keep a front by under 2: Split nearly everywhere. **At 0.6** Split would lead the campaign by under a point for most
  (the Summoner's Full would win it) and Full a front by 6–7: Full nearly everywhere. 0.7 is also the Twin Orb's 0.67
  of a Great Orb, rounded.

### 4.3 Tier 2's map, and what it adds

| Body | Nodes | Lv 50 grant, Tier 2 |
|---|---|---|
| The Planet | 5 | +38 to each core stat (HP +190) |
| Prowess · Vigor · Guard | 15 | +54 each (Prowess by her split; Vigor HP +270 and MP +54; Guard +54 to each defense) |
| **Weapon moon** | 5 | **Full +90 on one kind, or Split +63 on each of two** |
| ★ Her moon | 2 | Knack +7 points, lead +14 |
| **Shared** | **25**, every class | |

**What Tier 2 adds** (each class's preset, §5.3; the whole model in [§8.4](#84-each-tiers-impact-on-her-damage)):
the core holds its share (+26–34% a Tier 2 act, as Tier 1's map gave +27–37%), and **the weapon moon adds +12–16% to
her act**, +17–23% to every hit of its two kinds. The Halo added +5–8%. Extra Stats is **31–34%** of her Tier 2
damage (Tier 1: 21–27%).

## 5. Tier 3: the second weapon moon

The core and weapon moon 1 again, × 2.6, plus **a second weapon moon: 30 shared nodes**, every class.

### 5.1 The second weapon moon (EP26)

**The owner:** "Tier 3: one or two extra weapon moons for specific damage types, so we can improve all three weapon
types for a single Uma." **Weapon moon 2** is weapon moon 1's twin: five nodes at Lv 6–46, Moon Jewels I–V, Full or
Split.

| Her two weapon moons | Kinds served | At Lv 50 (Tier 3) | When |
|---|---|---|---|
| **Full + Split** (the preset) | **All three of her weapons** | +130 on one, +91 on each of the other two | Her act spreads over three weapons: every class's best in the campaign (+20.5–23.2% an act) |
| **Full + Full** | Two | +130 on each | Two kinds carry her damage (a front tuned to a twin set: a hybrid's pair, a pure class's two answers) |
| Split + Split | Four: she slots three own kinds | — | **Not offered:** the fourth kind would never hit |

- **Every weapon moon on a different kind.** Weapon moon 1 (her Tier 2 one) and weapon moon 2 are both rebuilt empty
  at promotion like the core; either may be the Full one.
- **One extra moon or two:** after a Tier 2 Split (two kinds), the second is a Full on her third; after a Tier 2 Full,
  a Split on the other two. Either way her three weapons are served.
- **Two-kind weapons:** Tier 3 gives the four between a second two-kind weapon (WP8); the moons still read each hit's
  own kind.

### 5.2 Tier 3's map, and what it adds

| Body | Nodes | Lv 50 grant, Tier 3 |
|---|---|---|
| The Planet | 5 | +55 to each core stat (HP +275) |
| Prowess · Vigor · Guard | 15 | +78 each (Prowess by her split; Vigor HP +390 and MP +78) |
| **Weapon moon 1** | 5 | Full +130, or Split +91 on each of two |
| **Weapon moon 2** | 5 | The same, on different kinds |
| ★ Her moon | 2 | Knack +10 points, lead +21 |
| **Shared** | **30**, every class | |

**What Tier 3 adds:** the two moons add **+21–23% to her act** (+24–31% to the Full's hits, +17–24% to the Split's),
on every weapon she slots. The Halo's two kinds added +9–12%. Extra Stats is **34–38%** of her Tier 3 damage.

### 5.3 Presets for every class and both branches (EP29)

The standard preset (D164) sets her weapon moons as the simulation plays them. **The rule:** Tier 2 **Split on her two
most-used kinds**; Tier 3 **Full on the most-used, Split on the other two**. Most-used: **a hybrid's lead half** (her
Spell Blade's two Arms, her Summoner's two Tomes: Tier 2 Split on both; Tier 3 Full on the lead-half kind that twins her
lone weapon, Split on her other lead kind and her lone weapon); everyone else her Dual (it answers the most foes, WP
§5.3), then her slots in order. *Follow-up to D196 (stat balancing), 2026-10-25 (logged against D194): was "a hybrid's
lone half (her Spell Blade Tome, her Summoner Arm: in every act), then her Dual". Stacked on her minor half, her Full moon
and single-kind forms pulled both hybrids toward 60/40 (the Summoner 53/47 in Tier 3); on her lead half both hold
70/30 ± 5 (SB10, [stat-balance §5.1](stat-balance.md#51-spell-blade-against-summoner)).* From Tier 2 the preset follows her class branch's set (CP40); "Use the Light/Dark set" offers
its moons in the same tap.

| Class | Branch 1 (default set): Tier 2 · Tier 3 | Branch 2 (reverse set): Tier 2 · Tier 3 |
|---|---|---|
| **Brawler** | Berserker: **Split Lance + Greatsword** · **Full Lance**, Split Greatsword + Axe | Warlord (Bow, Katana, Axe; Dual Bow): Split Bow + Katana · Full Bow, Split Katana + Axe |
| **Mage** | Sage: **Split Fire + Ice** · **Full Fire**, Split Ice + Lightning | Sorcerer (Light, Dark, Ice; Dual Light): Split Light + Dark · Full Light, Split Dark + Ice |
| **Spell Blade** | Rune Knight: **Split Lance + Katana** · **Full Lance**, Split Katana + Lightning (*follow-up to D196: was Split Lightning + Katana · Full Lightning, Split Katana + Lance*) | Blademaster (Katana, Bow, Dark): Split Katana + Bow · Full Katana, Split Bow + Dark (*was Split Dark + Katana · Full Dark, Split Katana + Bow*) |
| **Summoner** | Warlock: **Split Light + Dark** · **Full Light**, Split Dark + Bow (*follow-up to D196: was Split Bow + Dark · Full Bow, Split Dark + Light*) | Conjurer (Fire, Lightning, Greatsword; Dual Greatsword): Split Fire + Lightning · Full Fire, Split Lightning + Greatsword (*was Split Greatsword + Fire · Full Greatsword, Split Fire + Lightning*) |
| **Paladin** | Guardian: **Split Light + Greatsword** · **Full Light**, Split Greatsword + Axe | Templar (Bow, Katana, Light; Dual Bow): Split Bow + Katana · Full Bow, Split Katana + Light |
| **Cleric** | Bishop: **Split Light + Ice** · **Full Light**, Split Ice + Bow | Oracle (Light, Fire, Greatsword; Dual Greatsword): Split Greatsword + Light · Full Greatsword, Split Light + Fire |

- **The accessory presets (WP25) stand as written:** with the moons outside the kind cap, a Great Orb no longer needs
  a kind the moons leave free. A preset kind's accessories and moon stack (the Spell Blade's Tier 3 Lance: Great
  Pendant +51, Great Orb +114, Full moon +130). *Follow-up to D196 (stat balancing), 2026-10-25: WP25's hybrids' single-kind
  forms moved to the lead half with the moons (SB10); the example was her Lightning, with the Great Pendant's +49 (SB8).*

### 5.4 What retired: the Halo, Valor and Swiftness (EP9, EP11, EP28)

| Body (first draft) | What it gave | Now | Why |
|---|---|---|---|
| **The Halo** (Tier 2 one kind, Tier 3 two; 2 + 2 nodes) | +34 × tier on a kind, under the kind cap | **Folded into the weapon moons:** the same idea (flat offense on a kind she picks) on five nodes a moon, Full or Split, +50 × tier; Halo Jewels retire with it | The owner's weapon moons are the Halo grown up; two bodies doing one job would be one too many |
| **Valor** (Tier 2) | Limit start +2, +4 of the gauge's 12 | **Retired.** Limit start is her Gritty knack's (+1.6, [§6.2](#62-her-knack-node-i)) | The owner finds it negligible; Limit Breaks grow through LB+ at Bond 10 (CP28), not a head start |
| **Swiftness** (Tier 3) | Evasion +3%, +6% | **Retired.** Evasion is feet armor's (12% at G10) and her Fleet knack's (+2.4%) | "3% evasion, which does nothing." It was outside the foe budget (the toolbox term), so no foe moves |

- **Where their jewels went:** Valor's and Swiftness's Moon Jewels II and IV (2 · 4 an Uma) and the four Halo Jewels
  (10 · 20 refined) become the weapon moons' Moon Jewels I–V (5 · 10): more jewels for more worth.
- **Q9 (keep the Limit stat):** answered by her knack alone (Gritty), and the halls' Limit Breaks.
- **Tier 3's defense** keeps its share through SB1 (armor and the core × 2.6); Swiftness was never in it.

## 6. Her moon: the template slot, in full

**The owner (2026-10-24):** "I need more clarity on the Uma variance for stats, maybe flesh it out more as well."
**Her moon** is the two-node moon of her Uma Template ([variance §8](../../archive/design/tier-rework/variance.md#8-extra-stats-her-moon)) on its own
small orbit, starred and named for her template ("Ironhide's moon"). This section states everything the map does with
it; what the Uma Templates pass was to decide was marked **[for the pass]** (EP14), and is now decided: her moon's
values as written, node II on defense ([uma-templates §3.6](uma-templates.md#36-her-moon-ut10), UT10; *follow-up to
D197 (Uma Templates), 2026-10-25*). Drawn on [the her-moon page](previews/stars-uma.html).

### 6.1 The slot

| | Node I: her **knack** | Node II: her **lead** |
|---|---|---|
| **Read from** | Her top growth rate (variance U6) | Her calling's channel (U4): physical (Brawler, Spell Blade, Paladin) or magical (Mage, Summoner, Cleric) |
| **Opens** | Lv 16, Moon Jewel II | Lv 36, Moon Jewel IV |
| **Worth** | +4 points × tier (a moon node of grade 4) | +8 points × tier (grade 8) |
| **Gives** | Her knack's stat (§6.2) | **Her calling channel's defense** (recommended, §6.3): DEF if physical, M.DEF if magical |
| **Counts** | In every class | In every class (as a defense) |
| **Tier 1 · 2 · 3** | +4 · +7 · +10 points | +8 · +14 · +21 |

- **Outside the foe budget,** as today's off-curve nodes are: the balance party's average Uma has no template (XR12).
- **Rebuilt every tier** with the tier's values, like the core; ids `template:1`, `template:2` in every world.
- **Two nodes in every tier, never more** (XR3): a growing moon pushed Tier 3 past the work budget; the template's later
  depth is the signature tip (CP24) and the signature accessory (WP33; *follow-up to D197: was "if adopted", UT7, UT11*).

### 6.2 Her knack: node I

| Knack (top growth) | Word | Node I gives | Tier 1 | Tier 2 | Tier 3 | Scales? |
|---|---|---|---|---|---|---|
| Stamina | **Tireless** | HP (+5 a point) | **HP +20** | HP +35 | HP +50 | × tier |
| Wit | **Clever** | MP | **MP +4** | MP +7 | MP +10 | × tier |
| Power | **Mighty** | DEF and M.DEF, each (as Guard) | **+4 each** | +7 each | +10 each | × tier |
| Speed | **Fleet** | Evasion (4 Speed points × 0.6%) | **+2.4%** | +2.4% | +2.4% | A share: no |
| Guts | **Gritty** | Limit start (4 points × 0.4 of the gauge's 12) | **+1.6** | +1.6 | +1.6 | A share: no |

- **What each is worth at Lv 50** (a Brawler's sheet, §8.2): Tireless +1.4% of her HP; Clever +1.9% of her MP; Mighty
  +1.9% DEF and +2.2% M.DEF; Fleet 12% → 14.4% evasion with feet armor; Gritty a fight's start at 1.6 of 12.
- **Fleet and Gritty are now the map's only evasion and Limit start** (Swiftness and Valor retired): the two knacks
  that read as racing (a quick start, staying power) keep their own unit.

### 6.3 Her lead: node II

**Decided (UT10): her calling channel's defense, every class** (CP36's note; WP33; *follow-up to D197 (Uma Templates),
2026-10-25: was "Recommended"*). The first draft (variance U10) put
+8 on her calling channel's **offense** (ATK or M.ATK); CP36 noted moving it to defense so the affinity's +6% stays
the template's whole damage, and WP33 keeps it there beside the signature accessory.

| Option for node II | Gives (Tier 1 · 2 · 3) | Counts | Damage a matched Uma gains (§6.6) | The call |
|---|---|---|---|---|
| **Her calling channel's defense** | DEF (physical calling) or M.DEF (magical) +8 · +14 · +21 | Every class | None | **Decided (UT10):** the template's damage is the signature's alone, near U12's +5% |
| Her calling channel's offense (U10's draft) | ATK or M.ATK +8 · +14 · +21 | Classes that hit or mend with it | +2.5–4.4% (Tier 1) → +1.9–3.5% (Tier 3) | Pushes a matched Uma to +6.4–9.9% with the signature, past U12 |

- **The owner's "physical-only node" still holds:** a front runner's node II is DEF, a physical stat; as a Mage she
  still has it, as defense.
- **Decided (UT10):** node II is defense; the values as written. *Follow-up to D197 (Uma Templates), 2026-10-25: was
  "[For the pass] whether node II is defense or offense is the Uma Templates pass's, with the signature (WP33) and the
  affinity (CP36)".*

### 6.4 Gates and jewels

- **Node I opens at Lv 16 with a Moon Jewel II; node II at Lv 36 with a Moon Jewel IV,** in every tier, in order (I
  before II), as every moon node of those grades.
- **Two Moon Jewels a tier, 8 refined,** counted beside the shared demand (§11.3): in Tier 3 her Moon Jewel II is Tier
  2's pair (Cut Sapphire on a Gold Ingot), by the ladder (*Follow-up to the profession flavor change, 2026-10-24: was a Silver Ingot*).
- **Moon Jewels are any moon's,** so hers come from the same stock as the shared moons; the Set list offers her moon
  with the rest ("Moon Jewel II · Set on: Prowess · Vigor · Guard · weapon moon · ★ Ironhide's moon").

### 6.5 Six invented Umas, one per calling

Invented profiles, our own words; each template by variance §5's rule (calling ← her best style, Power against Wit;
stride ← her longest best distance; knack ← her top growth). Her moon at each tier's values; node II on defense.

| Uma (made up) | Profile | Template | ★ I, knack (T1 · T2 · T3) | ★ II, lead (T1 · T2 · T3) | Her Flourish (stride) |
|---|---|---|---|---|---|
| **Uma A** | Front A; Medium A, Long A; growth Stamina +20% | Brawler · Stayer: **Tireless Ironhide** | HP +20 · +35 · +50 | DEF +8 · +14 · +21 | Late reserve |
| **Uma B** | Pace A; Mile A; Power 96 > Wit 84; growth Speed +20% | Spell Blade · Dash: **Fleet Flashblade** | Evasion +2.4% (every tier) | DEF +8 · +14 · +21 | Clean break |
| **Uma C** | Pace A; Medium A; Wit 102 ≥ Power 90; growth Wit +20% | Mage · Middle: **Clever Spellwright** | MP +4 · +7 · +10 | M.DEF +8 · +14 · +21 | Even pace |
| **Uma D** | End A; Long A; growth Guts +20% | Summoner · Stayer: **Gritty Shepherd** | Limit start +1.6 (every tier) | M.DEF +8 · +14 · +21 | Late reserve |
| **Uma E** | Late A; Medium A; Power 104 > Wit 88; growth Power +20% | Paladin · Middle: **Mighty Warden** | DEF and M.DEF +4 · +7 · +10 each | DEF +8 · +14 · +21 (DEF +12 in all in Tier 1) | Even pace |
| **Uma F** | Late A (Pace B, End C); Mile A; Wit 98 ≥ Power 92; growth Stamina +20% | Cleric · Dash: **Tireless Lamplighter** | HP +20 · +35 · +50 | M.DEF +8 · +14 · +21 | Clean break |

*Follow-up to D197 (Uma Templates), 2026-10-25: each Flourish is **4% of her max HP a fight** in her stride's shape
(UT6): **Clean break** (a Barrier of 4% at the start; was "Opening", UT16), **Even pace** (1% a round, kept), **Late
reserve** (2% a round from round 3). [uma-templates §6.2](uma-templates.md#62-one-uma-per-calling) adds each Uma's
signature family and tip.*

- **As another class:** every node above counts in every class (node II is a defense); her Flourish and signature tip
  work only as her calling (UT12; *follow-up to D197: was variance U9, U16*). Uma A as a Mage keeps HP +20 and DEF +8.
- **Same calling, different knack:** a front runner at Long with Speed growth is a **Fleet Ironhide**: evasion +2.4%
  instead of HP +20, the same DEF +8 (variance §5.1's two front runners).

### 6.6 The template's budget, every tier

U12: a matched Uma (her calling's class, her template's pieces in use) gains **about +5% damage at most**. The pieces
that touch damage, measured on the full build at each tier's Lv 50 (the §8.4 model):

| Piece | Tier 1 | Tier 2 | Tier 3 |
|---|---|---|---|
| **Signature accessory** (WP33: ATK and M.ATK +10 · +18 · +26, worn) | +5.1–6.2% | +4.5–5.3% | +4.2–4.8% |
| ~~**Affinity**~~ (CP36: +6% on one twin set's two kinds) | Retired (UT11) | Retired | Retired |
| Her moon's lead on offense (U10's draft) | +2.5–4.4% | +2.1–3.6% | +1.9–3.5% |
| **Her moon's lead on defense** (recommended) | 0% | 0% | 0% |
| **Decided (UT11, UT13): the signature in the affinity's place, node II on defense** | **+5.1–6.2%** | **+4.5–5.3%** | **+4.2–4.8%** |
| The signature and the lead on offense | +8.5–9.9% | +7.4–8.2% | +6.4–7.8% |
| ~~The signature and the affinity~~ (≈ × 1.05) | Retired (UT11): was +10.4–11.5% | Was +9.7–10.6% | Was +9.4–10.0% |
| ~~The affinity and node II on defense~~ | Retired (UT11) | Retired | Retired |

*Follow-up to D197 (Uma Templates), 2026-10-25: the affinity rows are retired (UT11). **The Flourish leaves MP (UT6), so
no template piece moves pace**; its 4% of her max HP a fight is on the defense side ([uma-templates §4](uma-templates.md#4-the-budget-ut13):
damage +4.3–6.1% on the campaign's model, defense +4.7% plus her knack's 0–2.8%, pace 0).*

- **The recommended set stays near U12 in every tier;** the others pass it. Her knack adds no damage (a share of HP, MP,
  defense, evasion or Limit start).
- **The signature eases from +5–6% to +4–5% by Tier 3:** later tiers add flat offense on her kinds (the weapon moons,
  the accessory branches) faster than SB1's × tier, so a stat point is worth a little less. If the owner wants a
  stronger edge after playing it, the signature's rate per level (+0.2 × tier) is the dial (UT20); nothing here moves.
  *Follow-up to D197 (Uma Templates), 2026-10-25: was "[For the pass] if it wants +5% exactly …".*

### 6.7 How it shows

| Where | Tier 1 | Later tiers |
|---|---|---|
| **The Observatory's map** | ★ her moon on its own small orbit beside the three moons, named "Ironhide's moon" | The same, × tier |
| **A node, tapped** | "★ Ironhide's moon I · Tireless · HP +20 · Moon Jewel II · opens at Lv 16"; "★ Ironhide's moon II · Ironhide's lead · DEF +8 · Moon Jewel IV · opens at Lv 36" | "HP +35", "DEF +14" |
| **The header** | "Open 12 of 20 · ★ 1 of 2" | "of 25", "of 30" |
| **Totals under the map** | Her moon's points join their stats with a star: "DEF +51 ★ +8" | The same |
| **Her profile** | The template chip "★ Tireless Ironhide"; the template sheet: "Moon · I HP +20 (knack: Stamina +20%) · II DEF +8 (lead: a physical calling) · both count in every class"; beside it "Flourish · Late reserve · 4% of her max HP a fight, as a Brawler" (*follow-up to D197 (Uma Templates), 2026-10-25, UT6*) | Tier values |
| **The Battle tab** | Her moon's points in the green Extra Stats bracket, starred | The same |
| **The Racing tab's "Her template"** | Calling ← Front A; Stride ← Long A; Knack ← Stamina +20%; then each node "Active" | The same |

### 6.8 For the Uma Templates pass

**Decided: [uma-templates §3.6](uma-templates.md#36-her-moon-ut10)** (D197). *Follow-up to D197 (Uma Templates),
2026-10-25: the table below was "The pass decides"; each row is now its decision.*

| The pass decided | Decided | On the map |
|---|---|---|
| Node II: defense or offense | **Defense** (UT10) | One stat on `template:2`, as written |
| The signature (WP33) in the affinity's place | **Yes** (UT11, UT13) | Nothing on the map |
| The signature's rate across tiers | **+0.2 × tier a level** (SB15; the dial if it runs hot or cold, UT20) | Nothing on the map |
| Knack values (+4 points; Fleet 2.4%, Gritty 1.6) | **As written** (UT10) | `template:1`'s value |

## 7. Counts

| | Today | Tier 1 | Tier 2 | Tier 3 |
|---|---|---|---|---|
| Bodies (shared) | 9 | 4 | 5 | 6 |
| Shared nodes, **every class** | 100 | 20 | 25 | 30 |
| Her moon | — | 2 | 2 | 2 |
| Nodes a Brawler or a Mage uses | 30 active | 20 (the first draft: 20 of 25) | 25 | 30 |
| Stats on the map | 8 | 6 | 6 + one or two kinds | 6 + up to three kinds |
| Settings | 30 toggles | 0 | 1 (her weapon moon: Full or Split, its kinds) | 2 |
| Jewel kinds · items | 3 · 100 | 2 · 10 | 2 · 10 | 2 · 10 |

## 8. What it grants at Lv 50, by class

### 8.1 The grants

Extra Stats alone, at each tier's Lv 50, every node (her moon apart, §6); the weapon moons at her preset (§5.3):

| Class | Tier | HP | MP | ATK | M.ATK | DEF | M.DEF | Weapon moons |
|---|---|---|---|---|---|---|---|---|
| **Brawler** | 1 | +255 | +51 | +51 | +21 | +51 | +51 | — |
| | 2 | +460 | +92 | +92 | +38 | +92 | +92 | Lance, Greatsword +63 each |
| | 3 | +665 | +133 | +133 | +55 | +133 | +133 | Lance +130; Greatsword, Axe +91 |
| **Mage** | 1 | +255 | +51 | +21 | +51 | +51 | +51 | — |
| | 2 | +460 | +92 | +38 | +92 | +92 | +92 | Fire, Ice +63 |
| | 3 | +665 | +133 | +55 | +133 | +133 | +133 | Fire +130; Ice, Lightning +91 |
| **Spell Blade** | 1 | +255 | +51 | +42 | +30 | +51 | +51 | — |
| | 2 | +460 | +92 | +77 | +53 | +92 | +92 | Lance, Katana +63 |
| | 3 | +665 | +133 | +110 | +78 | +133 | +133 | Lance +130; Katana, Lightning +91 |
| **Summoner** | 1 | +255 | +51 | +30 | +42 | +51 | +51 | — |
| | 2 | +460 | +92 | +53 | +77 | +92 | +92 | Light, Dark +63 |
| | 3 | +665 | +133 | +78 | +110 | +133 | +133 | Light +130; Dark, Bow +91 |
| **Paladin** | 1 | +255 | +51 | +45 | +27 | +51 | +51 | — |
| | 2 | +460 | +92 | +81 | +49 | +92 | +92 | Light, Greatsword +63 |
| | 3 | +665 | +133 | +118 | +70 | +133 | +133 | Light +130; Greatsword, Axe +91 |
| **Cleric** | 1 | +255 | +51 | +27 | +45 | +51 | +51 | — |
| | 2 | +460 | +92 | +49 | +81 | +92 | +92 | Light, Ice +63 |
| | 3 | +665 | +133 | +70 | +118 | +133 | +133 | Light +130; Ice, Bow +91 |

### 8.2 The sheets

Her full sheet at each tier's Lv 50 (the balance simulation's average outfit, base 110, +10% growth in Speed, Stamina,
Power, from [stats-by-tier](previews/stats-by-tier.html)), fully built: armor G10 at weapon-progression's values (WP15:
HP +150, DEF and M.DEF +40, MP +30, +25 offense on her half, × tier), every Extra Stats node, **without her moon**.
**Offense on each of her three kinds:** her ATK or M.ATK, Might (68 · 122 · 177), her preset's accessories on that kind
under the kind cap (WP25), her weapon moons on it (§5.3). In brackets, Extra Stats' part of the stat. *Changed after
owner review, 2026-10-24: ATK and M.ATK for the four between follow Prowess's split; the offense columns carry the
weapon moons, not the Halo; HP, MP, DEF and M.DEF don't move.*

| Class | Tier | HP | MP | ATK | M.ATK | DEF | M.DEF | Offense on her three kinds (her weapon moon on it) |
|---|---|---|---|---|---|---|---|---|
| **Brawler** | 1 | 1,477 (255) | 213 (51) | 192 (51) | 116 (21) | 207 (51) | 182 (51) | Greatsword 260 · Axe 260 · Lance 260 |
| | 2 | 2,548 (460) | 368 (92) | 343 (92) | 206 (38) | 370 (92) | 326 (92) | 528 (+63) · 514 · 577 (+63) |
| | 3 | 3,628 (665) | 523 (133) | 495 (133) | 298 (55) | 534 (133) | 470 (133) | 763 (+91) · 838 (+91) · 877 (+130) |
| **Mage** | 1 | 1,244 (255) | 296 (51) | 116 (21) | 197 (51) | 186 (51) | 202 (51) | Fire 279 · Ice 279 · Lightning 279 |
| | 2 | 2,153 (460) | 507 (92) | 206 (38) | 352 (92) | 332 (92) | 361 (92) | 586 (+63) · 586 (+63) · 474 |
| | 3 | 3,068 (665) | 719 (133) | 298 (55) | 509 (133) | 480 (133) | 521 (133) | 891 (+130) · 852 (+91) · 777 (+91) |
| **Spell Blade** | 1 | 1,337 (255) | 247 (51) | 183 (42) | 130 (30) | 196 (51) | 192 (51) | Katana 265 · Lance 265 · Lightning 212 |
| | 2 | 2,311 (460) | 424 (92) | 328 (77) | 231 (53) | 351 (92) | 344 (92) | 513 (+63) · **562 (+63)** · **402** |
| | 3 | 3,292 (665) | 602 (133) | 472 (110) | 335 (78) | 507 (133) | 496 (133) | **791** (+91) · **944 (+130)** · **654 (+91)** |
| **Summoner** | 1 | 1,337 (255) | 247 (51) | 130 (30) | 183 (42) | 196 (51) | 192 (51) | Dark 251 · **Light 285** · **Bow 198** |
| | 2 | 2,311 (460) | 424 (92) | 231 (53) | 328 (77) | 351 (92) | 344 (92) | 513 (+63) · **562 (+63)** · **402** |
| | 3 | 3,292 (665) | 602 (133) | 335 (78) | 472 (110) | 507 (133) | 496 (133) | **791** (+91) · **944 (+130)** · **654 (+91)** |
| **Paladin** | 1 | 1,337 (255) | 296 (51) | 175 (45) | 111 (27) | 212 (51) | 192 (51) | Greatsword 257 · Axe 257 · Light 193 |
| | 2 | 2,311 (460) | 507 (92) | 313 (81) | 199 (49) | 379 (92) | 344 (92) | **532** (+63) · **469** · **492** (+63) |
| | 3 | 3,292 (665) | 719 (133) | 453 (118) | 286 (70) | 548 (133) | 496 (133) | **772** (+91) · **772** (+91) · **758** (+130) |
| **Cleric** | 1 | 1,337 (255) | 296 (51) | 111 (27) | 175 (45) | 196 (51) | 207 (51) | Light 243 · Ice 277 · Bow 179 |
| | 2 | 2,311 (460) | 507 (92) | 199 (49) | 313 (81) | 351 (92) | 370 (92) | 547 (+63) · 547 (+63) · 321 |
| | 3 | 3,292 (665) | 719 (133) | 286 (70) | 453 (118) | 507 (133) | 534 (133) | 835 (+130) · 796 (+91) · 668 (+91) |

- **Against the first draft's sheet** (class-progression §9, weapon-progression §4.4): HP, MP, DEF and M.DEF the same;
  ATK and M.ATK the same for the Brawler and the Mage; for the four between ATK and M.ATK lower by Prowess's split
  (a Spell Blade 192 → 183 and 151 → 130 in Tier 1). Her **lead kind's** offense (her first slot): Brawler 260 · 528 ·
  763 (first draft 260 · 526 · 760); the moons' kinds gain most (her Lance 514 → 577 in Tier 2).
- *Follow-up to D196 (stat balancing), 2026-10-25: in bold, what moved. The hybrids' weapon moons and single-kind forms
  sit on their lead half (EP29, WP25, SB10): the Summoner's Tier 1 Orb on her Light; in Tier 2 the Split on the lead
  half's two kinds (the Spell Blade's Lance and the Summoner's Light 499 → 562, their Thunder and Bow 465 → 402); in Tier 3
  the Full moon and the Great Orb on that kind (789 → 944), the Split on her lead kind and her lone weapon (805 → 654).
  The Great Pendant's 0.55 · 0.575 (SB8) adds +3 · +2 wherever a preset wears it (the Paladin's Tier 2 and 3, the hybrids'
  Tier 3). The lead-kind column moves only by that (the Spell Blade's Katana and the Summoner's Dark 789 → 791, the
  Paladin's Greatsword 529 → 532 and 770 → 772); HP, MP, ATK, M.ATK, DEF and M.DEF don't move.*
- **Where it shows:** a Brawler's ATK is 27% Extra Stats, her HP 17%, her MP 24%; a Mage's DEF 27%.

### 8.3 The build's share holds (SB1)

**Extra Stats' share of each core stat at each tier's Lv 50.** Under SB1 it holds; with flat values (the first round's
Extra Stats and armor) it halves by Tier 3. Selected rows; every class and stat is on
[the grants page](previews/stars-grants.html#share).

| Class · stat | Tier 1 | Tier 2 | Tier 3 | Flat values: Tier 1 → Tier 3 |
|---|---|---|---|---|
| Brawler HP | 17.3% | 18.1% | 18.3% | 17.3% → 8.6% |
| Brawler MP | 23.9% | 25.0% | 25.4% | 23.9% → 13.0% |
| Brawler ATK | 26.6% | 26.8% | 26.9% | 26.6% → 13.7% |
| Brawler M.DEF | 28.0% | 28.2% | 28.3% | 28.0% → 15.7% |
| Mage M.ATK | 25.9% | 26.1% | 26.1% | 25.9% → 13.2% |
| Spell Blade ATK | 23.0% | 23.5% | 23.3% | 23.0% → 11.5% |
| Spell Blade M.ATK | 23.1% | 22.9% | 23.3% | 23.1% → 10.5% |
| Paladin ATK (her mends) | 25.7% | 25.9% | 26.0% | 25.7% → 13.2% |
| Cleric MP | 17.2% | 18.1% | 18.5% | 17.2% → 8.7% |
| **Offense on her kinds** (Extra Stats' share, her acts' spread), Brawler | 19.6% | **24.9%** | **28.8%** | The first draft: 19.6% → 21.3% → 23.8% |

- **Every class, every core stat:** the share moves **at most 1.5 points** from Tier 1 to Tier 3 (Brawler MP 1.5;
  Spell Blade, Summoner 1.45; the rest 1.3 or less). With flat values it falls by **8.6 to 13.2 points**.
- **Why not exactly flat:** her HP and MP level parts grow a little slower than her other stats, so the build's share of
  them edges up a point. The overall balancing pass sets the final multipliers (README §2.5).
- **Offense rises by design, twice:** the core holds its share; the weapon moons are each tier's added depth (19.6% →
  24.9% → 28.8% for a Brawler; every class 15–20% → 22–25% → 26–29%). The first draft's Halo rose once, less.

### 8.4 Each tier's impact on her damage

**The owner's measure:** each tier's new bodies should matter as Tier 1's map does. **The model** (drafts for the
simulation): a hit's damage is offense² ÷ (offense + defense) (today's formula), foe defense 190 × tier (Tier 1's Lv 50
foe under SB1); her offense on each kind as §8.2; her acts spread over her weapons as she swings the one that lands
weak: a one-kind weapon 3 parts, a two-kind weapon 4 (it answers more foes); a hybrid's act is one Arm and one Tome at
her hands (Spell Blade 0.72 + 0.44, Summoner 0.56 + 0.58), a healer's at 0.5. **Her act** is that spread's damage.

| Class | Tier 1: the map (her act, with Extra Stats ÷ without) | Tier 2: the core · **the weapon moon** (on top) | Tier 3: the core · **the two weapon moons** | First draft's new bodies (the Halo): Tier 2 · 3 | Extra Stats' share of her damage: T1 · T2 · T3 (first draft) |
|---|---|---|---|---|---|
| **Brawler** | +37.2% | +33.8% · **+12.6%** | +33.6% · **+21.0%** | +5.1% · +10.3% | 27% · 34% · 38% (27 · 29 · 32) |
| **Mage** | +33.5% | +32.9% · **+12.4%** | +32.7% · **+20.5%** | +6.9% · +11.9% | 25% · 33% · 38% (25 · 30 · 33) |
| **Spell Blade** | +27.4% | +27.3% · **+15.0%** | +24.6% · **+22.1%** | +6.6% · +10.7% | 22% · 32% · 34% (27 · 32 · 32) |
| **Summoner** | +26.7% | +26.4% · **+15.5%** | +23.6% · **+23.2%** | +4.8% · +8.8% | 21% · 32% · 34% (28 · 31 · 31) |
| **Paladin** | +30.5% | +27.0% · **+14.2%** | +27.1% · **+23.2%** | +5.6% · +11.6% | 23% · 31% · 36% (29 · 31 · 34) |
| **Cleric** | +30.9% | +29.9% · **+15.1%** | +27.2% · **+23.2%** | +7.9% · +11.7% | 24% · 33% · 36% (29 · 33 · 34) |

**On the kinds the moons serve** (a hit of that kind, the moon on against off):

| Class | Tier 2 (Split, +63 each) | Tier 3 (Full +130 · Split +91 each) |
|---|---|---|
| Brawler | Lance +17.4%, Greatsword +19.6% | Lance +24.8% · Greatsword +19.6%, Axe +17.3% |
| Mage | Fire +17.0%, Ice +17.0% | Fire +24.2% · Ice +16.9%, Lightning +19.1% |
| Spell Blade | Lance +18.0%, Katana +20.4% | Lance +22.3% · Katana +18.6%, Lightning +24.2% |
| Summoner | Light +18.0%, Dark +20.4% | Light +22.3% · Dark +18.6%, Bow +24.2% |
| Paladin | Light +21.6%, Greatsword +19.4% | Light +30.6% · Greatsword +19.3%, Axe +19.3% |
| Cleric | Light +18.7%, Ice +18.7% | Light +26.6% · Ice +18.5%, Bow +23.5% |

*Follow-up to D196 (stat balancing), 2026-10-25: this table follows the hybrids' moons to their lead half (§5.3, SB10;
the Spell Blade's and the Summoner's rows were Lightning and Bow +23.4% and +28.0% on the first presets) and the Great
Pendant's 0.55 (the Paladin's, a tenth or two). The first table (her act) stays as measured on EP29's first presets and
the Summoner's 0.56 Arms hand (now 0.48, CP9); the balance model re-measures the moons as a whole, a quarter of each
tier's toolbox: ×1.14 of a Tier 2 act and ×1.23 of a Tier 3 act ([stat-balance §3.4](stat-balance.md#34-where-the-gain-comes-from)).*

- **Tier 2 and 3 now matter:** Extra Stats' total gain on her act is **+27–37% in Tier 1, +45–51% in Tier 2, +52–62% in
  Tier 3** (the first draft: +33–40%, +41–49%, +45–52%). A Full moon's kind gains a quarter or more a hit; Tier 1's
  whole map gives every hit +27–37%.
- **Against the first draft,** a Tier 2 act is +0–7% and a Tier 3 act +3–10% stronger; a Tier 1 act is the same for the
  Brawler and the Mage and 7–8% weaker for the four between (Prowess, §3.3; the hands are the knob, CP9).
- **Where the gain goes, the foes follow:** the weapon moons sit in each tier's toolbox term (Z4, §10), priced by its
  simulation; what the player feels is the build choice (which kinds, Full or Split) and the fronts tuned to them.
  *Follow-up to D196 (stat balancing), 2026-10-25: the terms are sized, Tier 2's +27% and Tier 3's ×1.08 → ×1.48 on the
  foes' HP and DEF (SB3, SB4).*

## 9. Defense and sustain, now that accessories deal damage

**The change (owner, 2026-10-24, weapon-progression.md):** accessories become damage-oriented. All ten Supports go
(WP17): the defensive ones (Iron, Ward, Bulwark, Veil, Vital), the MP ones (Spring, Siphon) and the rest; defense lives
in armor. *Unchanged by the owner's review: the Planet, Vigor and Guard keep their values; only Swiftness, which was
never in the budget, leaves.*

**Defense: Extra Stats is the defensive build the foe budget prices** (EP15).
- **The foe budget's formula prices points, never accessories.** A foe's offense is set so a 100% hit takes 28% of an
  on-curve Uma's HP, through `offenseBudgetPerLevel` (×1.49 at Lv 50): the HP, DEF and M.DEF that armor and Extra Stats
  add. weapon-progression moves **one support's worth into armor** (WP15). **No foe moves.**
- **Extra Stats alone meets that budget.** The share of her HP one 100% striker hit takes, Tier 1, a reference Uma
  (`rpgReferenceStat`), against the budget's target:

  | Uma Lv | 10 | 20 | 30 | 40 | 50 |
  |---|---|---|---|---|---|
  | The budget's target (`rpgFoeHitShare`) | 28.0% | 28.0% | 28.0% | 28.0% | 28.0% |
  | Bare (no build) | 28.5% | 30.1% | 32.8% | 36.7% | 41.7% |
  | **Extra Stats only** (Planet, Vigor, Guard) | **26.8%** | **26.4%** | **26.5%** | **27.4%** | **28.8%** |
  | Armor only (WP15's new values) | 25.0% | 24.9% | 26.3% | 28.9% | 32.6% |
  | Both (on curve) | 23.7% | 22.1% | 21.8% | 22.3% | 23.5% |

  At each tier's Lv 50 under SB1: 28.8%, 28.3%, 28.0% (Extra Stats only); 23.5%, 22.9%, 22.7% (both).
- **Its share of the defensive build at Lv 50:** HP 255 of 405 (63%), MP 51 of 81 (63%), DEF and M.DEF 51 of 91 each
  (56%): **three fifths**, in every tier and every class (the core is class-free in defense).
- **No new values.** Raising Guard or Vigor would only raise the foes' offense with them.
- **Tier 3 has no defensive body** now: Swiftness retired (EP28); its defense keeps its share through SB1.

**Sustain: MP, the pool and a base regen for every Uma** (EP4; SB18). *Follow-up to D196 (stat balancing), 2026-10-25
(logged against D194): was "MP moves from regen to the pool". Measured, a bigger pool can't hold a region's pace (a full
bar empties as surely; what the region lost is MP coming back), so the regen comes back as a rule of the game for every
Uma, never an item ([stat-balance §7](stat-balance.md#7-mp-after-the-regen-accessories)).*
- **What goes:** the Spring Amulet (+1 MP a round a grade) and the Siphon (MP from magical damage).
- **What replaces it:** Vigor gives MP as well as HP, a point for a point: **+30 MP** in Tier 1, with the Planet's +21
  **+51 MP an Uma** at Lv 46 (× 1.8, × 2.6 after), every Uma: **+255 MP a party**. Extra Stats is 17–25% of her MP at
  Lv 50 (armor's legs add 30 more). **Beside the pool, the base regen** (SB18): at the end of each round every Uma
  regains 0.8% of her max MP for each skill depth her class has open (4% from Class Rank 40), so a bigger pool also
  brings a little more back. Vigor's values don't change.
- **The Springs test** (README §9.5 item 5): a region on Auto still clears 10–12 of 12 stages with **+51 MP** from the
  map, armor's legs at +30 and the base regen, **and the party's pace in a region's last four stages stays within ±10%
  of today's** (the model: 0.94–1.05×). **Knobs, in order:** **SB18's share a depth** first, then **Vigor's MP rate**,
  then legs' MP a grade; never the foes, never an MP accessory. *Follow-up to
  D196: was legs, then Vigor's MP rate, then the Flourish (SB14 re-ranked them: Vigor's MP ×2 buys 10% more deep casts
  a bar, legs +1 a grade 3%).* *Follow-up to D197 (Uma Templates), 2026-10-25: "the Flourish's twists are the
  template's" removed: the Flourish is HP now (UT6), and no template piece touches MP.*
  **Measured by H81 (D215):** with no MP accessory and the regen at **1.0% a depth** (R2's value, 0.9% in R1), a region
  clears 11.9–12 of 12 and its last four stages run 0.93 · 0.95 · 0.90× today's pace at Lv 10 · 30 · 50; no deep act
  refunded by a round (a healer's 94% the most). Vigor's and legs' MP kept.

## 10. The foe budget

**The rates stay; the tier scaling moves to SB1** (EP16).
- **`rpgFoeBudget`** keeps its rates: HP and defense ×(1 + 0.035 (L − 1)² ÷ 49), ×2.715 at Lv 50; offense ×1.49.
- **`rpgFoeTierBudget`** keeps its restart at each tier's Lv 1 and **multiplies its build part by the tier**:
  `1 + (rpgFoeBudget(ℓ) − 1) × m × rpgReferenceStat(ℓ) ÷ rpgReferenceStat(L)`, m = 1, 1.8, 2.6. At each tier's Lv 50 it
  lands on the Tier 1 curve (×2.715 and ×1.49; ×2.719 and ×1.491; ×2.721 and ×1.492).
- **`onCurveStars` becomes every node her level opens on the core** (the Planet, Prowess at her class's split, Vigor,
  Guard), at her tier's values: **the same 20 nodes for every class.** *Changed after owner review, 2026-10-24: was "her
  class's bodies" (a Brawler or a Mage skipping a moon).* The average Uma has no template moon. **The weapon moons are
  the tier's tools,** priced in its toolbox term (Z4, XR15) as the Halo was. *Follow-up to D196 (stat balancing),
  2026-10-25 (logged against D194): was "Tier 2's term was drafted with the Halo (+5–8% an act) and now prices +12–16%;
  Tier 3's prices +21–23%".* Measured on the whole toolbox, **the weapon moons are about a quarter of Tier 2's (×1.14 of
  an act) and of Tier 3's (×1.23)**, beside the focus (×1.12), the weapon branches (×1.05, ×1.10) and the accessories
  (×1.13, ×1.25), and are priced in **Tier 2's term, +27% on the foes' HP and DEF by Lv 50, and Tier 3's, ×1.08 → ×1.48**
  (offense +10%, bosses × 1.1; SB3–SB5, [stat-balance §3.4](stat-balance.md#34-where-the-gain-comes-from)).
- **The core matches today's on-curve stars,** stat by stat, within 1.25 points at every five levels, for every stat a
  full moon serves (HP, MP, DEF, M.DEF for every class; ATK for the Brawler, M.ATK for the Mage):

  | Lv | 5 | 10 | 15 | 20 | 25 | 30 | 35 | 40 | 45 | 50 |
  |---|---|---|---|---|---|---|---|---|---|---|
  | Today's on curve (four stats' average) | 1 | 3 | 6 | 9.75 | 14.25 | 20 | 26 | 33.5 | 41.25 | 50.5 |
  | **A stat with its moon** | 1 | 3 | 5 | 9 | 13 | 19 | 25 | 33 | 41 | 51 |
  | The Planet alone (MP before Vigor; a pure class's other offense) | 1 | 1 | 3 | 3 | 7 | 7 | 13 | 13 | 21 | 21 |

- **What moves, at Tier 1 Lv 50** (README §9.5 item 1 measures it): the pure classes gain MP +51 (today 0); the four
  between take their class's split of offense (a Spell Blade ATK +42 and M.ATK +30, a Paladin +45 and +27), and every
  class gains the defense its old four-stat kit left out. The classes doc's mirror check re-tunes the hands, never the
  map (CP9, XR5).
- **The simulation may move** node values (Moon V's +10 first), Vigor's MP rate, the weapon moons' size (+50 × tier)
  and the Split's 0.7. **It may not move** the shape: one Planet, three moons and the tiers' weapon moons, five nodes
  each, every open node counting, every class the same nodes.

## 11. Jewels

"Gem" is the weapon line's word; Extra Stats' items are **jewels**, made by Jewel Crafting at the Lapidary
(glossary, [README §2.4](README.md#24-glossary)).

### 11.1 Kinds and grades (EP17)

| Jewel | Grade | Made from Craft Lv | Opens | From |
|---|---|---|---|---|
| **Planet Jewel I · II · III · IV · V** | 1 · 3 · 5 · 7 · 9 | 1 · 11 · 21 · 31 · 41 | Planet I–V | Tier 1 |
| **Moon Jewel I · II · III · IV · V** | 2 · 4 · 6 · 8 · 10 | 6 · 16 · 26 · 36 · 46 | Node I–V of **any** moon, picked when set: Prowess, Vigor, Guard, a weapon moon, her moon (II, IV) | Tier 1 |

- **Two kinds, ten items, in every tier.** *Changed after owner review, 2026-10-24: the Halo Jewels I–IV retire with
  the Halo; the weapon moons are moons and take Moon Jewels, so no tier adds a jewel kind.*
- **A jewel's numeral is the node it opens,** on every body: Planet Jewel III opens Planet III, Moon Jewel IV any
  moon's IV.
- **Grade g is made at Craft Lv 5g − 4 and set at Uma Lv 5g − 4,** the gear rule.
- **Names and icons (EP22):** "Planet Jewel III", "Moon Jewel II". Today's gem sheet supplies the icons (the Sun gems'
  gold prisms for Planet Jewels, one planet's moon-gem row for Moon Jewels). No new art.

### 11.2 Recipes: the interface for profession-progression.md (EP18)

**One fixed amount a jewel, the same in every tier:** a Moon Jewel 4 refined (3 cut stones on 1 ingot, unchanged), a
**Planet Jewel 12** (3 each of a cut stone, a plank, a prepared vegetable and a fillet; **proposed**, was 8). The type at
each grade follows [profession-progression.md](profession-progression.md)'s ladder (PP9) and catalog (PP8): in Tier 2
grades 5 and 10 take Tier 2's pair; in Tier 3 grades 4 and 9 Tier 2's and grades 5 and 10 Tier 3's.

**Why the Planet Jewel grows** (profession-progression owns the amounts; [§18.2](#182-for-profession-progression)):
with Prowess every class sets 20 jewels in Tier 1, not 25, so at today's recipes the Lapidary would make 100 an Uma, the
whole Uma 465, and the magical trade (Monster Den · Lapidary) would carry 17.2% of the work in Tier 1. A Planet Jewel
of 12 puts Tier 1 back exactly (120, 485) and keeps every trade at 18.6–23.3% in every tier (the first draft:
18.7–22.8%).

| Jewel (grade) | Refined | Tier 1 | Tier 2 | Tier 3 |
|---|---|---|---|---|
| **Planet Jewel I, II** (1, 3) | 12 | 3 each: Cut Quartz, Pine Plank, Chopped Carrot, Carp Fillet | The same | The same |
| **Planet Jewel III** (5) | 12 | The same | **3 each: Cut Sapphire, Cherry Plank, Sliced Bell Pepper, Sea Bream Fillet** | **3 each: Cut Starstone, Elderwood Plank, Golden Carrot Purée, Silverfin Fillet** |
| **Planet Jewel IV** (7) | 12 | 3 each: Cut Citrine, Cedar Plank, Shredded Cabbage, Sardine Fillet | The same | The same |
| **Planet Jewel V** (9) | 12 | The same | The same | **3 each: Cut Diamond, Ebony Plank, Trimmed Asparagus, Tuna Fillet** |
| **Moon Jewel I** (2) | 4 | 3 Cut Quartz, 1 Copper Ingot | The same | The same |
| **Moon Jewel II** (4) | 4 | 3 Cut Quartz, 1 Copper Ingot | The same | **3 Cut Sapphire, 1 Gold Ingot** |
| **Moon Jewel III, IV** (6, 8) | 4 | 3 Cut Citrine, 1 Iron Ingot | The same | The same |
| **Moon Jewel V** (10) | 4 | 3 Cut Citrine, 1 Iron Ingot | **3 Cut Diamond, 1 Titanium Ingot** | **3 Cut Philosopher's Stone, 1 Orichalcum Ingot** |

- **Easy to say:** a moon is cut stones on a metal mount; the Planet a bit of everything, three of each.
- **Every type is an existing uma-art icon** (PP8): no new icon. *Follow-up to the profession flavor change, 2026-10-24: profession-progression's
  Farming gathers Vegetables and its Fishing Fish, and one rule picks every line's pairs (its PP8), so the table's
  names follow (Cut Citrine, Cedar and Cherry Planks, a Gold Ingot; the vegetables and fish). Wording only: no amount
  moves.*
- **Make time** (PP12): one gather's time a refined item. At Craft Lv 25 (×1.25): a Moon Jewel 2.4 h, a Planet Jewel
  7.2 h.

### 11.3 Per Uma, per tier

**Jewels an Uma, every class the same** (*changed after owner review, 2026-10-24*):

| Jewel | Tier 1 | Tier 2 | Tier 3 |
|---|---|---|---|
| Planet Jewel I–V | 1 each (5) | 5 | 5 |
| Moon Jewel I–V | 3 each (15): Prowess, Vigor, Guard | 4 each (20): + weapon moon 1 | 5 each (25): + weapon moon 2 |
| **Shared, every class** | **20 · 120 refined** | **25 · 140** | **30 · 160** |
| ★ Her moon: Moon Jewels II and IV | 2 · 8 | 2 · 8 | 2 · 8 |

**Refined items an Uma, by gathering profession** (her moon apart; every type in
[the jewels page](previews/stars-jewels.html#materials)):

| Profession (what it gives) | Tier 1 | Tier 2 | Tier 3 |
|---|---|---|---|
| Hunting (cut stones) | 60 | 75 | 90 |
| Mining (ingots) | 15 | 20 | 25 |
| Wood Chopping (planks) | 15 | 15 | 15 |
| Farming (prepared vegetables) | 15 | 15 | 15 |
| Fishing (fillets) | 15 | 15 | 15 |
| **Lapidary, an Uma** | **120** | **140** | **160** |
| Of it, Tier 1's types · Tier 2's · Tier 3's | 120 · — · — | 112 · 28 · — | 96 · 32 · 32 |
| ★ Her moon | +8 | +8 | +8 |

- **Hunting carries the Lapidary,** as professions planned: 60 of Tier 1's 120 (50%).
- **A party** of any five classes: 600 · 700 · 800 refined (+40 for their moons); the first draft's "two of five skip a
  moon" (560 · 650 · 740) is gone.
- **The whole Uma** (profession-progression's gear, 365 in every tier): **485 · 505 · 525 refined** (493 · 513 · 533
  with her moon), about **822 · 856 · 890 hours** at Craft Lv 25's speed (835 · 869 · 903): **+4.1% and +8.2%** on
  Tier 1, inside PR10's tenth. The first draft: 485 · 503 · 521. Profession-progression.md owns the final amounts.
- **The tier's own pair** keeps its fifth: jewels made of Tier 2's types are 28 of 140 in Tier 2 (the first draft 34 of
  138, with the Halo Jewels); in Tier 3, 32 Tier 2's and 32 Tier 3's of 160.

## 12. The Observatory, tier by tier

One page, the same in every tier, growing with the map (EP19). Drawn in [the maps page](previews/stars-maps.html#screen).

| Part | Tier 1 | Tier 2 | Tier 3 |
|---|---|---|---|
| **Header** | Her face (tap to choose an Uma) · "Open 12 of 20 · ★ 1 of 2" | "Open 21 of 25 · ★ 2 of 2" | "Open 30 of 30" |
| **The map** (drawn in code, 360 × 360) | The Planet at the centre, its five nodes round it; Prowess (top), Vigor and Guard below on one orbit, five nodes each; ★ her moon on a small orbit | + **her weapon moon** on the outer orbit: one moon named for its kind ("Lance"), or two moonlets on one track ("Lance · Greatsword") | + **the second weapon moon** |
| **A node, tapped** | A sheet: "Prowess III · as Spell Blade ATK +4, M.ATK +2 · Moon Jewel III · open"; locked: "Guard IV · DEF and M.DEF +8 · needs a Moon Jewel IV · opens at Lv 36" | Values × 1.8; "Weapon moon III · Split · Lance +13, Greatsword +13" | × 2.6 |
| **Prowess's line** | "Prowess · Spell Blade 70/30: ATK +21, M.ATK +9"; a class switch re-splits it at once | The same | The same |
| **Totals under the map** | HP, MP, ATK, M.ATK, DEF, M.DEF: what's open | + "Lance +63 · Greatsword +63" | + the second moon's kinds |
| **The weapon moons' setting** | — | A chip under the map: "Weapon moon · Split · Lance + Greatsword ▾": Full or Split, then its kinds (her three slotted first, then by group); free outside fights | Two chips; every kind different; Full + Full or Full + Split |
| **Set** | Jewels in stock she can set now: "Planet Jewel III ×2 · Opens Planet III · +4 to every stat · Set". A Moon Jewel's Set asks which moon, in map order, the one furthest behind first | + the weapon moon | + the second |
| **Gone** | Active slots, the on/off toggle, "Active 12/30"; the first draft's dim moon "Her class doesn't use M.ATK" | The Halo's ring and chip; Valor | Swiftness |

- **Can upgrade** (H34, EP20): a jewel in stock she can set now.
- **Targets** (D100, EP20): plan the Planet, the three moons, the tier's weapon moons and her moon; **the same for every
  class** (*changed after owner review, 2026-10-24*: the first draft's "her active class's moons" filter goes with
  Strength and Sorcery).
- **The Lapidary's picker:** one row a kind, Planet I–V, Moon I–V, in every tier.
- **The Battle tab:** the green Extra Stats share on each core stat; from Tier 2 the weapon moons' lines in the Offense
  group ("Lance moon +90").
- **Promotion** empties the map in the new world (the old world's stays) and sets the weapon moons to the new tier's
  presets.

## 13. Provides

| To | What |
|---|---|
| **README §2** | Tier 1 "the Planet and three moons (Prowess, Vigor, Guard), 20 nodes, every open node counts, every class the same"; Tier 2 "+ a weapon moon: 25"; Tier 3 "+ a second weapon moon: 30"; her moon 2 in every tier; values × 1 / 1.8 / 2.6. **§2.2:** "Extra Stats nodes 20 · 25 · 30", jewel kinds · items **2 · 10 in every tier**, "Kind cap" row "(flat offense on one kind from accessories; weapon moons beside it)". **§2.3:** jewel rows **20 · 120, 25 · 140, 30 · 160** (Planet Jewel 12, Moon Jewel 15 · 20 · 25), her moon 2 · 8; one Uma **485 · 505 · 525** (493 · 513 · 533), 822 · 856 · 890 h; the "a Brawler or a Mage skips one moon" note goes. **§2.4 glossary:** **Prowess**, **weapon moon**, **Full · Split** (a weapon moon's setting; never the weapon branches' Pure and Dual); "Jewel" = Planet and Moon Jewels; "Planet · moons · Halo · Valor · Swiftness" → "Planet · moons (Prowess, Vigor, Guard) · weapon moons"; the Halo, Valor and Swiftness retired. **§8:** extra-stats-tier2's X1–X7 row and Q9's ("her knack alone"). **§9.2–§9.3:** v17 "weapon moons" for "the Halo; Valor"; v27's ids `prowess:1–5`; v28 `weapon-moon-1:1–5`, `stars.moons`. **§10:** EP1–EP29 |
| **weapon-progression.md** | [§18.1](#181-for-weapon-progression-follow-up-to-d193): the kind cap binds accessories only, weapon moons outside it (WP24); the stack's step 1 (WP31); presets name the weapon moons, the accessory forms unchanged (WP25); §4.4's ATK and M.ATK for the four between; evasion 12% in every tier (no Swiftness); every "Halo" mention reads "weapon moons". Unchanged: Vigor's MP, the defensive budget, Guard and the Planet |
| **profession-progression.md** | [§18.2](#182-for-profession-progression): two jewel kinds in every tier; **20 · 25 · 30 an Uma, every class**; Planet Jewel 12 proposed; Lapidary **120 · 140 · 160** (+8); the whole Uma 485 · 505 · 525; §6.3's new pieces are five Moon Jewels a tier |
| **class-progression.md** (its next pass; follow-ups logged against D192) | §0 and "Later tiers at a glance": Extra Stats rows read "a weapon moon (Full +90 on one kind or Split +63 on two)" and "a second weapon moon", not the Halo and Valor; §9's ATK and M.ATK for the four between (§8.2 here) and its offense column; §7.2's class skills carry "that weapon's kind, channel, Might, weapon moons and branch"; **CP36's note stands** (her moon's node II on defense, §6.3); the mirror re-check (CP9) on Prowess's split |
| **Uma Templates pass** | §6 in full: two nodes, Lv 16 and 36, Moon Jewels II and IV, × tier, outside the budget, ids `template:1–2`; five knacks (Fleet and Gritty don't scale and are now the map's only evasion and Limit start); node II on her calling channel's defense in every class (decided, UT10; *follow-up to D197: was "recommended"*); the template budget per tier (§6.6) and the signature's easing by Tier 3 |
| **The balance simulation** | `onCurveStars` → the core (the same 20 nodes for every class, Prowess at her split); `rpgFoeTierBudget`'s build part × tier; the weapon moons in Tiers 2's and 3's toolbox terms; Full against Split (§4.2); the hybrids' and healers' Tier 1 act (−7–8%) through the hands (CP9) |
| **The engine** | v16: Prowess's split (data: points by her class at a fight's start). v17: weapon moons, flat offense on her hits of a kind, outside the kind cap, its kinds frozen into the input. Tier 3's: the second weapon moon (data on v17's rule). The Halo, Valor and Swiftness never built |

## 14. Assumes

| From | Assumes | If not |
|---|---|---|
| README §2, tiers §5 (D15) | Tiers 1–3 of 50 levels; the map empties at promotion | A carried map breaks the budget's restart (D170) |
| SB1 (README §2.5) | Every flat build value × 1, 1.8, 2.6; the foes' build budget too | Flat values: Extra Stats' share falls 8.6–13.2 points by Tier 3 (§8.3) |
| weapon-progression.md | Accessories damage-oriented (WP17); armor's one support's worth (WP15) and feet evasion (12% at G10); the presets' accessories (WP25); a hit reads its own kind (WP13); **the kind cap reshaped to accessories only (§18.1)** | If the cap keeps weapon moons inside it: raise it to (68 + 50) × tier (118 · 212 · 307), else every Tier 3 Great Orb caps beside a moon |
| profession-progression.md | Jewel Crafting at the Lapidary on the 5g − 4 gate; the catalog (PP8) and ladder (PP9); **the Planet Jewel at 12 (§18.2)** | At 8: Lapidary 100 · 120 · 140, the Uma 465 · 485 · 505, the magical trade 17.2% in Tier 1 |
| class-progression.md | Six classes, their channels, hands and leans (§2.1–§2.2); the presets' sets (CP11, CP40); the focus reads a hit's own kind (CP39); CP9's knob is the hands | — |
| Uma Templates pass | Fills her moon's two nodes (§6; node II on defense). **Done: uma-templates §3.6 (UT10)**, *follow-up to D197 (Uma Templates), 2026-10-25* | — |
| Combat (D104) | A point is +1, +5 HP; 0.6% evasion; 0.4 of a 12 gauge; fights freeze points (and her class) at their start | — |
| Tier 2's world (Z4, XR15) | The weapon moons sit in each tier's toolbox term, priced by its simulation; her moon outside every budget. *Follow-up to D196: the terms sized by stat-balance SB3–SB5 (Tier 2 +27%, Tier 3 ×1.08 → ×1.48)* | — |

## 15. Save impact

*Versions re-planned by D198 (2026-10-25): the Planet, the three moons, her moon and the jewels ship with **R2, Tier 1's
economy (engine v17, save v28)**, so this section's "save v27" is v28 and §13's engine "v16" (Prowess's split) is v17;
the weapon moon's "save v28" and engine v17 are **R3, Tier 2's weapons (v18, v29)**; Tier 3's second weapon moon is **R5
(v20, v31)**. See [implementation.md](../../archive/design/tier-rework/implementation.md).*

**Deleted** (in every tier world):
- Every Uma's `stars.unlocked` and `stars.active`: today's `moon:`, `bridge:` and `sun:` ids.
- Every Star Gem in each world's `gems`: today's 100 ids, in stock and set on nodes.
- Lapidary cuts: running and queued ones recalled, finished uncollected ones collected first.

**Compensated by the owner's direction** (2026-10-24, the weapon review; [README §9.4](README.md#94-the-compensation);
EP21): **not item by item.** Every Craft Level resets to 1 and the player is granted **tickets for the time it took to
reach those levels**; deleted Star Gems and the old map are covered the same way. The Profession review works out the
amounts: [profession-progression §14](profession-progression.md#14-save-impact) (PP19, PP20, PP24), a Speed Ticket for
every 30 minutes of work, the Star Gems folded in. *(Link follow-up, 2026-10-24: wording only.)* *Changed after owner
review, 2026-10-24: the first draft refunded each gem's raw items.*

**New, save v27** (the Tier 1 rework's migration; v26 is taken on main, D190):
- `OwnedUma.stars: { open: string[], moons: { mode: 'full' | 'split', kinds: RpgDamageKind[] }[] }`: no `active`;
  `moons` empty until v28.
- **Node ids,** fresh so none reads as today's: `planet:1–5`; **`prowess:1–5`**, `vigor:1–5`, `guard:1–5`; her moon
  `template:1` (knack), `template:2` (lead). *Changed after owner review: `prowess` for `strength` and `sorcery`.*
- **Jewel ids:** `jewel-planet-1–5`, `jewel-moon-1–5` in the world's stock of made items; `gems` retires.
- **Strict parsing:** a body the world's tier doesn't have (a weapon moon node in Tier 1) is refused.

**Save v28** (Tier 2's toolbox): `weapon-moon-1:1–5`; `stars.moons` holding one entry, her preset (Split on her two
most-used kinds). **Tier 3's save:** `weapon-moon-2:1–5`; two entries, every kind different, at most one Split.
*Changed after owner review: the first draft's `halo:1–4`, `valor:1–2`, `swiftness:1–2`, `stars.halo` and
`jewel-halo-1–4` never ship.*

**Promotion** empties `stars.open` in the new world and sets `stars.moons` to the new tier's presets (the old world
keeps its own). Old fights replay unchanged: their allies' stats are frozen in the input.

## 16. Pacing

- **Uma progression doesn't move:** fights, EXP and rewards are untouched, and the core gives what today's on-curve map
  gives within 1.25 points at every five levels for every stat a full moon serves ([§10](#10-the-foe-budget)).
- **Something opens every five levels,** in every tier, alternating the Planet and the moons (the weapon moons with the
  moons).
- **The foes:** rates unchanged; tier scaling on SB1. The defensive budget is Extra Stats' alone at Lv 10–50 (§9).
- **MP:** +51 an Uma at Lv 46 and the base regen (SB18, *follow-up to D196*), tested in the Springs with the region's pace against today's.
- **Crafting:** 20 · 25 · 30 jewels an Uma, every class (+2 hers), against 100 Star Gems; the Lapidary 120 · 140 · 160
  refined (+8), **72 · 84 · 96 hours** of making at Craft Lv 25; the whole Uma 485 · 505 · 525 refined, 822 · 856 ·
  890 hours (835 · 869 · 903 with her moon), every tier inside PR10's tenth (§11.3).
- **Tiers 2 and 3:** the core gives the same share at each tier's Lv 50 (§8.3); the weapon moons are the tiers' added
  depth, +12–16% and +21–23% an act, priced in their toolbox terms (Z4), not the build curve (*follow-up to D196: the
  terms sized, Tier 2's +27% and Tier 3's ×1.08 → ×1.48, SB3, SB4*).
- **Simulation items** (README §9.5): the re-baseline with full maps and Prowess's split (item 1); the mirror on full
  maps, the four between's Tier 1 act through the hands (item 2); the Springs at **+51 MP** with the base regen (item 5); Tier 2: Full against
  Split (§4.2) and the stack with a weapon moon beside the accessories (WP31, weapon-research risk 3); her moon with the
  signature under U12's +5% (item 8, §6.6; *follow-up to D197 (Uma Templates), 2026-10-25: "or the affinity" removed,
  UT11; the Flourish moves no MP, UT6*).

## 17. Decisions

| Call | Recommendation | Alternatives, briefly | Why |
|---|---|---|---|
| **EP1** Tier 1's shape | **The Planet (5 nodes) and three moons (5 each): Prowess, Vigor, Guard; 20 nodes, every class;** her moon's 2 beside. *Changed after owner review, 2026-10-24: Strength and Sorcery become Prowess (EP23); was 25 nodes, 20 for a Brawler or a Mage* | Four moons (Strength and Sorcery apart: unequal jewels by class); three nodes a moon (steps of ten levels) | One node every five levels, as gear; the curve within 1.25 points; every class the same map |
| **EP2** The Planet | +1, +2, +4, +6, +8 points to all six core stats (+21 each) × tier, at Lv 1, 11, 21, 31, 41 | Worth its grade (+25); no MP | "Every stat" is the profile's six; fits today's curve. *Kept after owner review: "general stats, that's fine"* |
| **EP3** A moon node | Its grade, +2 … +10 (+30) × tier; Guard gives both defenses; Prowess splits by class (EP23) | Guard split per stat | D141 kept; every class needs both defenses |
| **EP4** Vigor, both pools | Each Vigor node gives its points to HP (×5) and to MP: +150 HP and +30 MP in Tier 1, × tier | A regen node; MP on the Planet at ×2; nothing | The Spring Amulet goes; **the pool and a base regen for every Uma** (SB18) replace it. *Follow-up to D196 (stat balancing), 2026-10-25 (logged against D194): was "the pool replaces regen for every Uma"; Vigor's values unchanged* |
| **EP5** What opens a node | Its jewel, in order, at Uma Lv 5g − 4 | Jewels only; level only | The budget stays exact; the gate matches gear's |
| **EP6** What counts | Every open node; no active slots | Three lit moons (toggles back) | The biggest single simplification |
| **EP7** Values across tiers | Every stat grant is its Tier 1 points × 1, × 1.8, × 2.6, rounded per node (half up); **Prowess's split rounds each node's larger share half up, the rest to the smaller; a Split weapon moon node is 0.7 of the Full one, rounded**; Limit start and evasion don't scale | Flat values; a core that adds nodes per tier | SB1: one curve, one number a tier |
| **EP8** Speed and Limit | **Off the shared map in every tier;** her knack (Fleet, Gritty) and feet armor keep them. *Changed after owner review, 2026-10-24: they returned as Valor (Tier 2) and Swiftness (Tier 3), now retired (EP28)* | Valor and Swiftness kept; a Speed or Limit moon in Tier 1 | The owner: "3% evasion, which does nothing"; the map shows the profile's six stats and her kinds' offense |
| **EP9** The Halo | **Retired: folded into the weapon moons (EP24);** Halo Jewels retire with it. *Changed after owner review, 2026-10-24: was Tier 2's one kind (+10 → +34 × tier) and Tier 3's second, under the kind cap* | Keep the Halo beside weapon moons (two bodies, one job); keep it and drop the moons | The owner's weapon moons are the Halo's idea, deeper and on every weapon by Tier 3 |
| **EP10** Weapon moons and weapon groups | **Weapon moons serve kinds, never a group;** a focused branch points them inside its group; the picker lists her slotted kinds first, then by group. No group moon. *Changed after owner review, 2026-10-24: restated for the weapon moons (was the Halo's)* | A group moon (+90 on two or three kinds) | Prowess already serves channels; the kinds reach a group without a new body |
| **EP11** Valor | **Retired (EP28).** *Changed after owner review, 2026-10-24: was Tier 2's Limit start +2, +4* | Kept; made larger (+8 of 12) | Negligible to the owner; Limit start stays her Gritty knack's |
| **EP12** Tier 3 | **A second weapon moon (EP26);** no class constellations. *Changed after owner review, 2026-10-24: was the Halo's second kind and Swiftness* | Class constellations; Swiftness kept | "Improve all three weapon types for a single Uma"; the map stays class-free |
| **EP13** The core across tiers | The same bodies, rebuilt empty at promotion, values × tier; tiers add weapon moons, never nodes on the core | The same values every tier | SB1: the core's share holds within 1.5 points (§8.3) |
| **EP14** Her moon | **Two nodes in every tier, in full (§6):** I her knack (Lv 16, Moon Jewel II; Tireless HP, Clever MP, Mighty DEF and M.DEF, Fleet evasion, Gritty Limit start), II her lead (Lv 36, Moon Jewel IV) **on her calling channel's defense, counted in every class** (CP36's note, WP33); × tier (Fleet, Gritty don't scale); outside the budget; the recommended template set (the signature in the affinity's place, node II on defense) stays at +4–6% in every tier. *Changed after owner review, 2026-10-24: fleshed out; node II's defense moves from a note to the recommendation; the pass decides.* *Follow-up to D197 (Uma Templates), 2026-10-25: **decided (UT10)**: node II on her calling channel's defense; the values as written; the affinity retired (UT11)* | Node II on offense (+6–10% with the signature); a moon that grows each tier; nodes on the shared bodies | The owner: clarity, not more nodes; U12's +5% at every tier |
| **EP15** Defense and sustain | No new values: the Planet, Vigor and Guard are the defensive build the foe budget prices (alone 26–29% a hit, against its 28%); MP moves from regen to the pool; Vigor's MP rate is the Springs' second knob. *Changed after owner review, 2026-10-24: Tier 3's Swiftness leaves; nothing else moves.* *Follow-up to D196 (stat balancing), 2026-10-25 (logged against D194): **MP: the pool, and a base regen for every Uma** (SB18); knobs **SB18's share a depth first**, then Vigor's MP rate, then legs; the Springs test measures region pace against today's (SB14).* *Follow-up to D197 (Uma Templates), 2026-10-25: "the Flourish's twists the template's" removed (UT6)* | Raise Guard and Vigor; a regen node | The budget prices points; the map keeps six stats |
| **EP16** The foe budget | Rates unchanged; `rpgFoeTierBudget`'s build part × tier; **`onCurveStars` = the core, the same 20 nodes for every class (Prowess at her split);** the weapon moons in each tier's toolbox term. *Changed after owner review, 2026-10-24: was "her class's bodies"; the Halo, Valor, Swiftness for the weapon moons.* *Follow-up to D196 (stat balancing), 2026-10-25 (logged against D194): the weapon moons are a quarter of Tier 2's toolbox (×1.14) and Tier 3's (×1.23), priced in **+27%** and **×1.08 → ×1.48** on the foes' HP and DEF (SB3, SB4; was "Tier 2's term … now prices +12–16%")* | Re-fit the rates; the weapon moons in the build curve | The core matches today's curve within 1.25 points; the tools are priced where the tier's term is |
| **EP17** Jewel kinds | **Planet Jewel I–V and Moon Jewel I–V (any moon, picked when set) in every tier: 2 kinds, 10 items.** *Changed after owner review, 2026-10-24: the Halo Jewels I–IV retire* | A Weapon Jewel for the weapon moons (a third kind for a moon like the others) | A weapon moon is a moon; one name, one recipe |
| **EP18** Recipes | Moon Jewel 4 refined (kept), **Planet Jewel 12 (proposed, was 8)**; the type at each grade by profession-progression's ladder; **Lapidary an Uma 120 · 140 · 160 (+8), every class; the whole Uma 485 · 505 · 525**. Profession-progression owns the final amounts (§18.2). *Changed after owner review, 2026-10-24: was Planet 8, Halo 5; 120 · 138 · 156* | Today's recipes (Lapidary 100 · 120 · 140; the magical trade 17.2% in Tier 1); a Moon Jewel of 5 (115 · 140 · 165; 25.2% in Tier 3) | Tier 1 lands back on 120 and 485; every trade 18.6–23.3% in every tier; inside PR10's tenth (+4.1%, +8.2%) |
| **EP19** The Observatory | One page in every tier: the map in code, "Open n of 20 · 25 · 30", totals, the weapon moons' chips from Tier 2, the Set list in map order; no toggles; no dim moon. *Changed after owner review, 2026-10-24* | Today's page with toggles; a page per tier | It grows with the map and teaches once |
| **EP20** Targets and "can upgrade" | Targets plan the Planet, the three moons, the tier's weapon moons and her moon, **the same for every class**; "can upgrade" counts a jewel she can set now. *Changed after owner review, 2026-10-24: no class filter* | Plan only her class's moons (the first draft) | Every moon helps every class |
| **EP21** Old maps and Star Gems | Delete every node and Star Gem; **compensate by the owner's direction: Craft Levels reset to 1, tickets for the time they took ([README §9.4](README.md#94-the-compensation); designed in [profession-progression §14](profession-progression.md#14-save-impact), PP20)**; no conversion. *Changed after owner review, 2026-10-24: was raw items back* | Raw items back (the first draft); convert old moons by grade | The owner's direction; different shapes, a clean rebuild |
| **EP22** Names and art | The Planet; **Prowess**, Vigor, Guard; **weapon moons** named by kind ("the Lance moon"), **Full** and **Split**; her moon by her template. "Planet Jewel III", "Moon Jewel II". Today's gem icons. *Changed after owner review, 2026-10-24: Strength, Sorcery, the Halo, Valor, Swiftness retire as names* | "Pure" and "Dual" for the moons (the weapon branches' words); "Strength" for the merged moon (reads physical); "Halo" for the weapon moons | One word, one meaning; "Prowess" fits both channels and collides with no skill or item |
| **EP23** Class symmetry: Prowess | **New after owner review, 2026-10-24.** One offense moon, every class: each node's points split by her active class, **Brawler 100/0, Mage 0/100, Spell Blade 70/30, Summoner 30/70, Paladin 80/20, Cleric 20/80** (ATK/M.ATK; the healers by what scales their mends and hands); every class opens 20 · 25 · 30 nodes and sets the same jewels; a class switch re-splits at the next fight | Capped node counts on Strength and Sorcery (lumpy splits; a Spell Blade's fifth offense node at Lv 6); both moons for everyone at full (hybrids double-served); a split by damage share (hybrids 47 points against 30) | The owner's symmetry and his 70/30; one cadence; no jewel wasted on a class switch |
| **EP24** Weapon moons | **New after owner review, 2026-10-24.** A moon of five nodes (Moon Jewels I–V, Lv 6, 16, 26, 36, 46) giving flat offense on her hits of a kind: +4, +7, +10, +13, +16 (+50) × tier, Full; on every hit whose own kind it is (never a heal, never a kind); its kinds a setting, free outside fights | +30 × tier (a moon's: below the Halo's +34 in Tier 2); +60 × tier (past a Tier 1 map's stat); its own jewel kind | A Full moon gives its kind what Tier 1's whole map gives a stat; Tier 2 +12–16% and Tier 3 +21–23% an act, where the Halo gave 5–8% and 9–12% |
| **EP25** Full or Split | **New after owner review, 2026-10-24.** **Full:** one kind at the full values. **Split:** two different kinds at 0.7 each, two moonlets on one track (five nodes, five jewels); Split best in the campaign, Full on a tuned front for the pure classes and healers, Split a hybrid's | 0.8 (Split nearly everywhere; Full's edge on a front under 2 points); 0.6 (Full nearly everywhere; Split under a point ahead in the campaign); two moons of five nodes each for a Split (double jewels) | The owner's Pure-or-Dual for the moons; each someone's best; the same jewels either way |
| **EP26** Tier 3: the second weapon moon | **New after owner review, 2026-10-24.** Weapon moon 2, the same five nodes, Full or Split; every kind different; Full + Split serves her three weapons (the preset), Full + Full two; Split + Split not offered | Three weapon moons in Tier 3 (15 nodes: past the work budget); Tier 3 values only on weapon moon 1 | "One or two extra weapon moons … improve all three weapon types" |
| **EP27** Weapon moons and the kind cap | **New after owner review, 2026-10-24.** **Outside the cap,** as Prowess is, bounded by their own size (+50 × tier a kind); the cap (+68 × tier, WP24) binds the accessory forms only. An interface change for weapon-progression (§18.1) | Inside the approved cap (every Tier 3 Great Orb capped beside a moon); a raised cap, (68 + 50) × tier, everything inside (the same bound, one more competition) | The cap stopped accessories and the Halo stacking; the moons are build value, and the accessories' viability (WP §5.7) holds |
| **EP28** Valor and Swiftness | **New after owner review, 2026-10-24: retired.** Limit start is her Gritty knack's, evasion feet armor's and her Fleet knack's | Make them meaningful (Limit start +8, evasion +15%: an unpriced defense, a gauge half full); fold them into the Planet from Tier 2 | The owner finds them negligible; their jewels buy the weapon moons |
| **EP29** Weapon-moon presets | **New after owner review, 2026-10-24.** Tier 2: Split on her two most-used kinds; Tier 3: Full on the most-used, Split on the other two; most-used a hybrid's lone half, then her Dual, else her Dual, then her slots in order; both class branches' sets (§5.3). *Follow-up to D196 (stat balancing), 2026-10-25 (logged against D194): **a hybrid's Full (and Tier 2's Split) on her lead half** (SB10): the Spell Blade Split Lance + Katana · Full Lance, Split Katana + Lightning; the Summoner Split Light + Dark · Full Light, Split Dark + Bow; the Blademaster Split Katana + Bow · Full Katana, Split Bow + Dark; the Conjurer Split Fire + Lightning · Full Fire, Split Lightning + Greatsword* | Full on her first slot (the Halo's preset) | The model's campaign best; one rule for twelve sets |

**The first round's calls, mapped:**

| Old | Now | | Old | Now |
|---|---|---|---|---|
| ES1 Tier 1's shape | **EP1** (three moons), EP23 | | ES9 Valor | **EP11, EP28** (retired) |
| ES2 the planet's values | EP2 (kept, × tier) | | ES10 Tier 3 | **EP12, EP26** (a second weapon moon) |
| ES3 a moon node | EP3, EP4 (Vigor gains MP), **EP23** (Prowess) | | ES11 the core across tiers | EP13 (× tier) |
| ES4 what opens a node | EP5 (kept) | | ES12 her moon | **EP14** (in full; node II on defense) |
| ES5 every open node counts | EP6 (kept) | | ES13 the foe budget | **EP16** (the core for every class), EP15 |
| ES6 Speed and Limit | **EP8** (off the map in every tier) | | ES14 old maps and gems | **EP21** (the owner's compensation) |
| ES7 two jewel kinds | **EP17** (two in every tier) | | ES15 names and art | **EP22** (Prowess, weapon moons) |
| ES8 the Halo | **EP9** (retired), **EP24–EP27** (weapon moons) | | ES16 targets | **EP20** (every class the same) |

In bold, the calls the owner's review (2026-10-24) changed or replaced. New after the review: **EP23** (Prowess),
**EP24** (weapon moons), **EP25** (Full or Split), **EP26** (Tier 3's second weapon moon), **EP27** (the kind cap),
**EP28** (Valor and Swiftness retired), **EP29** (presets). Earlier: EP7, EP15, EP18, EP19 were new in the first draft.

## 18. Interface changes

### 18.1 For weapon-progression (follow-up to D193)

> **Interface changes for weapon-progression.md (the owner's Extra Stats review, 2026-10-24; a follow-up to D193, for
> its next pass; not edited here):**
> 1. **The kind cap (WP24, §5.6):** "flat offense on one kind from the Pendant and Orb forms **and the Halo**" reads
>    "from the Pendant and Orb forms" (+68 · +122 · +177, unchanged). **Weapon moons sit outside it,** as Prowess and
>    the signature do, bounded by their own size (Full +50 × tier on a kind; Split +35 × tier on each of two). The
>    flat on one kind is then at most Might + the cap + a Full moon, (68 + 68 + 50) × tier: 334 in Tier 2 and 484 in
>    Tier 3, against the approved Might + cap's 244 and 354. §5.6's
>    examples become: "Tier 2: a Great Orb (+74) and a Channel Pendant (+49) on one kind cap at +122; a weapon moon adds
>    beside it". If weapon-progression prefers one cap: (68 + 50) × tier, everything inside (118 · 212 · 307).
> 2. **The damage stack (WP31, §2.4), step 1:** "+ flat offense on the hit's own kind: the Pendant and Orb forms under
>    the kind cap, **and her weapon moons on that kind (Extra Stats, outside it)**"; the pieces column: "a weapon moon
>    +50 × tier (Full) or +35 × tier (Split) a kind, Tier 2 on" for "the Halo +34 × tier a kind"; heals: "the weapon
>    moons, the Orb and Pendant forms and the signature's bonus never heal". The ceiling on one weak hit (steps 3–4) is
>    unchanged.
> 3. **Presets (WP25, §5.8):** "the Halo on her first slot (two in Tier 3)" reads "her weapon moons as
>    extra-stats-progression EP29 (Tier 2 Split on her two most-used kinds; Tier 3 Full on the most-used, Split on the
>    other two)". **The accessory forms stand as written;** the rule "a Great Orb sits elsewhere than the Halo" is no
>    longer needed (the moons don't share the cap).
> 4. **Her sheet (§4.4):** the defensive columns unchanged; class-progression §9's ATK and M.ATK for the four between
>    follow Prowess (Spell Blade 183 · 328 · 472 and 130 · 231 · 335; Summoner mirrored; Paladin 175 · 313 · 453 and
>    111 · 199 · 286; Cleric mirrored).
> 5. **Evasion (§4.2):** "18% in Tier 3 with the Swiftness moon" reads "12% in every tier (Swiftness retired); her
>    Fleet knack +2.4%".
> 6. **Wording:** every "Halo" reads "weapon moons" (§2.1's Extra Stats row, §5.3, §5.5's Bell, §5.10's Battle tab line
>    "Lance moon +63", §9, §10's Assumes row); "Swiftness +3%, +6% evasion" leaves §10.
> 7. **No change asked:** the signature (WP33) stays as written; this doc measures it at +5.1–6.2% in Tier 1 and
>    +4.2–4.8% in Tier 3 on the full build (the tiers' flat offense grows), for the Uma Templates pass (§6.6).

### 18.2 For profession-progression

> **Interface changes for profession-progression.md (the owner's Extra Stats review, 2026-10-24; for its review;
> not edited here):**
> 1. **Jewel kinds:** Planet Jewel I–V and Moon Jewel I–V **in every tier** (10 items); the Halo Jewels I–IV retire
>    (never made). The Lapidary's picker is the same two rows in every tier; §4.2's "Halo I–II" and "III–IV" chips go.
> 2. **Counts an Uma, every class the same:** **20 · 25 · 30** jewels (5 Planet; Moon 15 · 20 · 25: three moons, + weapon
>    moon 1, + weapon moon 2), + her moon's Moon Jewels II and IV in every tier. "A Brawler or a Mage skips her other
>    offense moon (20 · 24 · 28)" retires; a party is five times one Uma whatever the classes.
> 3. **Recipes (PP10), proposed:** **Planet Jewel 12** (3 each of a cut stone, a plank, a prepared vegetable and a
>    fillet, *follow-up to the profession flavor change, 2026-10-24*; was 8); Moon Jewel 4 unchanged; the ladder as PP9
>    (§11.2's table). Make time: a Planet Jewel 12 gathers (7.2 h at Craft Lv 25).
> 4. **Lapidary refined an Uma:** **120 · 140 · 160** (+8 her moon); by profession Hunting 60 · 75 · 90, Mining 15 · 20 ·
>    25, Wood Chopping, Farming, Fishing 15 each; Tier 2's types 28 of 140, Tier 3 32 Tier 2's and 32 Tier 3's of 160.
> 5. **The whole Uma:** **485 · 505 · 525** refined (493 · 513 · 533 with her moon), 822 · 856 · 890 hours (835 · 869 ·
>    903): +4.1%, +8.2% on Tier 1, inside PR10's tenth. **Trades:** 18.8–20.6% in Tier 1, 19.4–21.1% in Tier 2,
>    18.6–23.3% in Tier 3 (the first draft 18.7–22.8%). Alternatives weighed: today's recipes (Lapidary 100 · 120 · 140,
>    Uma 465 · 485 · 505, the magical trade 17.2% in Tier 1); a Moon Jewel of 5 (115 · 140 · 165, 480 · 505 · 530, the
>    magical trade 25.2% in Tier 3).
> 6. **§6.3, the tier's new pieces:** Tier 2's "Halo Jewel I, II" and "Valor I, II" rows become "**Weapon moon I–V:
>    Moon Jewels I–V** (5, by the ladder)"; Tier 3's "Halo Jewel III, IV", "Halo I, II (rebuilt)" and "Swiftness I, II"
>    become "**the second weapon moon: Moon Jewels I–V** (5); weapon moon 1 rebuilt (5)".
> 7. **No change:** the refund's approach (the owner's: Craft Levels reset, tickets for time), the gear amounts (365),
>    the ladder, places and slots.
