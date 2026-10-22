# Extra Stats: a planet and its moons

> **Fan-out draft, 2026-10-22. Nothing here is built.** One of the six Tier rework docs ([brief](README.md)). It
> replaces today's 100-node map from Tier 1 on, and absorbs [the Halo](../extra-stats-tier2.md) (H41, Q12) into Tier 2.
> Calls are **ES1–ES16**, each with a recommendation ([Decisions](#decisions)). Numbers are drafts for the simulation.
>
> Previews: [the map at each tier](previews/extra-stats-maps.html) · [what it gives, against today](previews/extra-stats-budget.html).

## The owner's points

| The owner's point | Answered in |
|---|---|
| Heavy Tier 1 simplification | [Tier 1](#tier-1-one-planet-four-moons), [its complexity](#tier-1-today-and-proposed) |
| One planet that raises every stat | [Tier 1](#tier-1-one-planet-four-moons): Planet I–V, +21 to each of the six core stats |
| Moons with a few stat nodes each | [Tier 1](#tier-1-one-planet-four-moons): four moons, five nodes each, one a continent |
| More as the tiers progress | [Tier 2](#tier-2-the-halo-and-the-valor-moon), [Tier 3](#tier-3-a-second-halo-kind-and-the-swiftness-moon) |
| Preview it | [maps](previews/extra-stats-maps.html), [budget](previews/extra-stats-budget.html) |
| (Brief) What opens a node, how many count | [Tier 1](#tier-1-one-planet-four-moons): its jewel and her level; every open node |
| (Brief) The gems, who makes them | [Jewels](#jewels), [Provides](#provides) |
| (Brief) Template-only nodes | [Her moon](#her-moon) |
| (Brief) The same foe budget per level | [Pacing](#pacing) |

## Today

The Observatory, as built ([loops](../../game/loops.md#extra-stats-and-gear),
[materials](../../game/materials.md#star-gems), [sections](../../game/sections.md#observatory)):
- **A Sun, eight planets, 100 nodes:** 80 moons (eight stats × ten grades), 16 bridges, 4 Sun nodes.
- **A node is worth its grade** (D141): moon 7 gives 7 points; a bridge g ÷ 2 to each side, a Sun node g ÷ 8 to all.
  A point is +1 (+5 HP), 0.6% evasion (Speed) or 0.4 Limit head start (D104).
- **Opening:** one Star Gem per node, 100 gem kinds, set in order on each track (D119). Cut at the Lapidary.
- **Active:** 5 + ⌊level ÷ 2⌋ nodes count at once (5 at Lv 1, 30 at Lv 50), switched by hand.
- **On curve** (`onCurveStars`, the balance party): the best moons her level's grade allows, across four stats her
  class picks. About +1, +3, +6, +10, +14, +20, +26, +33, +41, +50 to each at Lv 5, 10 … 50 (52 ATK at Lv 50, 18% of
  a Brawler's offense, [combat](../../game/combat.md#where-damage-comes-from)).
- **Each tier** rebuilds the same map from empty (tiers §5, D15). H41 proposed the Halo for Tier 2, not decided (Q12).
- **Code:** `economy/stars.ts`, `economy/gems.ts`, `economy/bonus.ts`, `save/observatory.ts`, `save/upgrades.ts`,
  `world/balance-party.ts` (`onCurveStars`), `places/observatory/ObservatoryPage.tsx`.

## The proposal

| | Tier 1 | Tier 2 | Tier 3 |
|---|---|---|---|
| **The core** (every tier, rebuilt) | Planet I–V and four moons I–V: Strength, Sorcery, Vigor, Guard | The same | The same |
| **New this tier** | — | **The Halo** (one damage kind, 2 nodes) and **the Valor moon** (Limit start, 2 nodes) | The Halo's **second kind** (2 nodes) and **the Swiftness moon** (evasion, 2 nodes) |
| [Her moon](#her-moon) ([variance](variance.md)) | 2 nodes | 4 | 6 |
| Shared nodes | **25** | 29 | 33 |
| Jewel kinds | **2:** Planet, Moon (10 items) | 3: + Halo (12 items) | 3 (12 items) |
| Active slots | **None: every open node counts** | None | None |

Every tier keeps one rhythm: **something opens every five levels**, planet and moons in turn, so each region's climb
brings one step, as gear grades do.

### Tier 1: one planet, four moons

**The bodies:**

| Body | Gives | I | II | III | IV | V | In all |
|---|---|---|---|---|---|---|---|
| **The Planet** | Every core stat: HP, MP, ATK, M.ATK, DEF, M.DEF | +1 · Lv 1 | +2 · Lv 11 | +4 · Lv 21 | +6 · Lv 31 | +8 · Lv 41 | **+21 each** |
| **Strength** | ATK | +2 · Lv 6 | +4 · Lv 16 | +6 · Lv 26 | +8 · Lv 36 | +10 · Lv 46 | +30 |
| **Sorcery** | M.ATK | +2 · Lv 6 | +4 · Lv 16 | +6 · Lv 26 | +8 · Lv 36 | +10 · Lv 46 | +30 |
| **Vigor** | HP (+5 a point) | +10 HP | +20 HP | +30 HP | +40 HP | +50 HP | +150 HP |
| **Guard** | DEF and M.DEF, each | +2 | +4 | +6 | +8 | +10 | +30 each |

- **A moon node is worth its grade** (D141): the moons sit on the even grades (2, 4 … 10). The planet sits on the odd
  grades (1, 3 … 9) and gives less per stat, since it gives to all six.
- **A stat with its moon** reaches +51 at Lv 46, against today's on-curve +49–52: within 2 points at every level
  ([Pacing](#pacing)).
- **"Every stat"** is the profile's six core stats. Speed and Limit leave the shared map in Tier 1 (ES6). Evasion stays
  on feet armor ([gear](gear.md) §3.2 keeps it), and both remain as a knack on [her moon](#her-moon). Limit joins the
  shared map in Tier 2, evasion in Tier 3.

**What opens a node (ES4):** both its jewel and her level.
- A Planet Jewel opens the planet's next node; a Moon Jewel opens the next node of the moon she picks.
- **In order:** II after I, on each body (D119's rule, kept).
- **Her Uma Level** reaches the node's level: grade g at Lv 5g − 4, the gear cadence ([gear](gear.md) uses the same gate
  for every grade). A jewel in stock above her level waits: "Opens at Lv 36".

**What counts (ES5):** every open node, always. No active slots, no switching. A pure class simply skips her other
offense moon; a hybrid opens all four.

**Decisions left in Tier 1:** which moon the next Moon Jewel goes to, and whether to open her other offense moon. The
planet is the obvious first pick, so it needs no thought.

#### Jewels

"Gem" is the weapon line's word ([gear](gear.md) GE12), so Extra Stats' items are **jewels**, made by Jewel Crafting.

| Jewel | Grades (today's ladder) | Opens | Craftable from |
|---|---|---|---|
| **Planet Jewel I–V** | 1, 3, 5, 7, 9 | Planet I–V | Lv 1, 11, 21, 31, 41 |
| **Moon Jewel I–V** | 2, 4, 6, 8, 10 | Node I–V of any moon | Lv 6, 16, 26, 36, 46 |

- **Two kinds, ten items** instead of 100 Star Gems. The moon is picked when setting, not when crafting, so the crafter
  only decides how many.
- **A jewel is craftable when the node it opens is reachable:** a jewel for a node of level ℓ from profession Lv ℓ
  (today's 5g − 4). [Professions](professions.md) owns the recipes and the building.
- **Per Uma:** 5 Planet Jewels and 15 Moon Jewels (a pure class, three moons) or 20 (all four): 20 or 25. Today: 100.
- **Names and art (ES15):** "Planet Jewel III", "Moon Jewel II". Today's gem sheet supplies the icons (lean assets):
  the Sun gems' gold prisms for Planet Jewels, one planet's moon-gem row for Moon Jewels. No new art in Tier 1.

#### Tier 1, today and proposed

| | Today | Proposed |
|---|---|---|
| Bodies | A Sun and 8 planets | **1 planet and 4 moons** (+ her moon) |
| Nodes | 100: 80 moons, 16 bridges, 4 Sun | **25:** 5 planet, 20 moon (+ 2 on her moon) |
| Node kinds | 3 (moon, bridge, Sun) | 2 (planet, moon) |
| Stats on the shared map | 8 | 6, the profile's core stats |
| Item kinds · items | 3 · 100 | **2 · 10** |
| Items to finish one Uma | 100 | 20 (one offense) or 25 (+ 2) |
| Active slots | 5 → 30, chosen by hand, re-chosen every 2 levels | **None** |
| What gates a node | Its gem, in order | Its jewel, in order, and her level |
| Decisions per Uma | Which of 100 gems; which 30 of up to 100 open nodes count | Which moon gets the next Moon Jewel; open the other offense moon or not |
| The crafting picker | 3 tabs: Moons (80), Bridges (16), Sun (4) | One row: Planet I–V, Moon I–V |

#### Screens

- **The Observatory:** her planet and four moons, drawn in code as today. The header reads "Open 13 of 25". Tapping a
  node shows what it gives and its jewel; a locked one names its jewel and level. The six stat totals sit under the
  map, then the **Set** list. No on/off toggle.
- **A moon her active class doesn't use** is drawn dimmer, with "Her class doesn't use M.ATK" on its sheet. It can
  still be opened (classes switch freely).
- **Can upgrade** (H34): a jewel in stock she can set now. "Free active slots" goes.
- **Targets** (D100): the planet, the moons her active class uses (all four for a hybrid), her moon, and the tier's
  Halo and small moons.
- **The Battle tab:** unchanged, the green Extra Stats share on each core stat.

### Tier 2: the Halo and the Valor moon

The core again, rebuilt in the Tier 2 world at the same values per tier level, plus two small bodies.

**The Halo (ES8),** H41's idea in a smaller form: a ring round the planet, tuned to **one damage kind** she picks.

| Node | Opens | Gives | Jewel |
|---|---|---|---|
| Halo I | Lv 21 | +10 offense on her hits of that kind | Halo Jewel I (grade 5) |
| Halo II | Lv 46 | +24 more: **+34** | Halo Jewel II (grade 10) |

- **Flat** (H41's X3): half a weapon's Might at the grade, as an Orb. It joins the kind's offense before the damage
  formula, on every hit of that kind (Attacks, skills, both hybrid halves, summons, Limit Breaks).
- **The kind is a setting, free to change outside fights,** and may be empty. So two nodes and two jewels, not H41's
  twenty and twenty. Specializing costs nothing more; matching a front's weakness is a tap.
- **The bound** (H41's X7, [gear](gear.md)'s Extra Stats row): the Orb returns in Tier 2, and Orb and Halo on one kind
  add +68 at the top, a second G10 weapon's Might.
- **On screen:** "Halo · Katana +34" beside "Orb · Katana +34" in the Battle tab's Offense group.

**The Valor moon (ES9):** Limit start +2 at Lv 16, +2 more at Lv 36 (+4 of the gauge's 12), with Moon Jewels II and
IV. It answers Q9 (keep Limit), where Limit Breaks matter more.

**Jewels:** Planet, Moon and **Halo** (I–II): 12 items. Per Uma: 29 with every moon (24 for one offense), plus her
moon's 4.

### Tier 3: a second Halo kind and the Swiftness moon

The core and Tier 2's bodies again, plus:
- **The Halo's second kind (ES10):** Halo III (Lv 21, +10) and Halo IV (Lv 46, +24 more) on a second kind she picks,
  with Halo Jewels I and II. A hybrid can tune both halves; a pure class two of her three weapons. Orb and Halo on one
  kind still stop at +68.
- **The Swiftness moon:** +3% evasion at Lv 16, +3% more at Lv 36, with Moon Jewels II and IV.

No new jewel kind. Per Uma: 33 with every moon (28 for one offense), plus her moon's 6.

**Class constellations** (tiers §6's Tier 3 row) are dropped (ES10): the shared map stays class-free, so a class
switch never changes what it gives, and class identity belongs to [classes](classes.md) and
[skill trees](skill-trees.md).

### Her moon

[Variance](variance.md) §8 gives each Uma **a moon of her own**, named for her template ("Ironhide's moon"), on its
own small orbit, starred. This doc holds its slot (ES12):
- **Two tracks, lead and knack, one node each per tier reached:** 2 nodes in Tier 1, 4 in Tier 2, 6 in Tier 3.

  | Track | Tier 1 | + Tier 2 | + Tier 3 |
  |---|---|---|---|
  | Knack: HP, MP, DEF and M.DEF (half each), Speed or Limit, in every class | Grade 4 · Lv 16 · +4 | Grade 6 · Lv 26 · +6 | Grade 8 · Lv 36 · +8 |
  | Lead: ATK or M.ATK, only in classes of that channel | Grade 6 · Lv 26 · +6 | Grade 8 · Lv 36 · +8 | Grade 10 · Lv 46 · +10 |

- **Worth a moon node of its grade (×1).** Variance drafted ×1.5 inside an active cap; with every node counting, its
  own fallback is ×1.
- **Jewels:** the Moon Jewel of the grade (II–V). No new kind.
- **Out of channel:** a lead node her class can't use stays open and reads "No effect as Mage".
- **Outside the foe budget**, like today's off-curve nodes, within variance's ≤ +5% for a matched Uma: +6 ATK and +4 of
  her knack in Tier 1.
- Its knack is Tier 1's only Extra Stats home for Speed and Limit.

## Provides

| To | What |
|---|---|
| [Professions](professions.md) | **Jewel kinds and grades per tier** (drafts): Tier 1 Planet Jewel I–V and Moon Jewel I–V; Tier 2 + Halo Jewel I–II; Tier 3 no new kind. A jewel for a node of level ℓ is craftable from profession Lv ℓ (5g − 4) |
| Professions | **Demand per Uma, per tier:** Planet Jewel one of each grade. Moon Jewel I, III, V three or four each (one a moon); II and IV the same, plus one per small moon (Valor from Tier 2, Swiftness from Tier 3). Her moon adds Moon Jewels II and III in Tier 1, + III and IV in Tier 2, + IV and V in Tier 3. Halo Jewel I and II one each per Halo kind. Shared totals: 20–25, 24–29, 28–33; her moon 2, 4, 6 |
| Professions | **The Lapidary's budget stays professions.md's:** 120 refined items per Uma in Tier 1, +12 a tier. It assumed 30 jewels (10 planet, 20 moon); at 25 (+2 hers), its own rule rescales a jewel to about 4–5 refined items |
| [Variance](variance.md) | **Her moon's slot:** lead and knack tracks as variance §6 draws them, at Lv 5g − 4; ×1 a moon node of the grade (no cap); Moon Jewels; ids `lead:1–3`, `knack:1–3` |
| [Classes](classes.md) | The shared map is class-free. A class uses the planet, Vigor, Guard and the offense moon(s) of its channels |
| [Gear](gear.md) | The Halo is flat offense to one kind from Tier 2, bounded with the Orb at a G10 weapon's Might (+68), as gear.md asks |
| Cross-reference | The rows for `character-tiers.html` and `progression.html`: Tier 1 "Planet and 4 moons, 25 nodes"; Tier 2 "+ Halo (1 kind), + Valor"; Tier 3 "+ Halo's 2nd kind, + Swiftness"; her moon 2 · 4 · 6 |

## Assumes

| From | Assumes | If not |
|---|---|---|
| §2 frame, tiers §5 (D15) | Tiers 1–3 of 50 levels; the map empties at promotion and is rebuilt in the new world | A map that carries over breaks the budget's restart (D170) |
| Combat (D104) | A point is +1 to its stat, +5 HP; fights freeze points at their start, so no engine version is needed | — |
| [Professions](professions.md) | Jewel Crafting, at the Lapidary, makes the jewels above on today's 5g − 4 gate, within its Lapidary budget per Uma | — |
| [Gear](gear.md) | As drafted: Orbs flat at half a weapon's Might, back in Tier 2 (the Halo's bound); feet armor keeps evasion; Lv 5g − 4 gates every grade | Without feet evasion, Tier 1's only evasion is a Fleet knack: acceptable |
| [Classes](classes.md) | The ten damage kinds stay. **H63's mirror is re-checked** with full maps: the Summoner's Arms half gains ATK (about +10–15% damage a turn, a hand estimate) and the Spell Blade gains M.DEF. The knob is the hybrids' hands | — |
| [Variance](variance.md) | Her moon as §6 and §8 draw it, at ×1 (its own no-cap fallback); Limit and Speed knacks keep their units | Her moon isn't drawn; nothing else changes |
| Tier 2's world (H43, Z4) | The Halo, Valor and Swiftness sit in each tier's toolbox term (Z4's draft for Tier 2: +15% HP and defense, +10% offense by Lv 50). The cross-reference sets that term with the other docs' tools. Her moon stays outside every budget | — |

## Save impact

**Deleted** (for the refund):
- Every Uma's `stars.unlocked` and `stars.active`, in every tier world: today's `moon:`, `bridge:` and `sun:` ids.
- Every Star Gem in each world's `gems`: today's 100 ids (`gem-<stat>-<g>`, `gem-<a>-<b>-<g>`, `gem-sun-<g>`).
- Lapidary work making those gems: running and queued cuts are recalled (inputs back to the Warehouse); finished,
  uncollected ones collect first, then count as stock.

**The refund** can be computed from the save alone: each open node names its gem (`nodeGem`), each gem its refined
inputs (`gems.ts`), each refined item its raw one (1:1). Recommendation (ES14): nothing converts; the refund returns
the raw items, as the brief leans.

**New** (the next save version after v25, whichever the rework takes):
- `stars: { open: string[], halo: (RpgDamageKind | null)[] }`: no `active`; `halo` holds 0, 1 or 2 kinds by tier.
- **Node ids, fresh so none reads as today's:** `planet:1–5`; `strength:`, `sorcery:`, `vigor:`, `guard:1–5`;
  `valor:1–2`, `swiftness:1–2`; `halo:<kind slot 1–2>:<1–2>`; her moon `lead:1–3`, `knack:1–3`.
- **Jewel ids:** `jewel-planet-1–5`, `jewel-moon-1–5`, `jewel-halo-1–2`, in each world's stock (today's `gems` record,
  renamed or kept). No collision with any gem id.
- **Strict parsing** refuses a body the world's tier doesn't have (a Halo node in Tier 1).
- Old fights replay unchanged: their allies' stats are frozen in the input.

## Pacing

**Uma progression doesn't move:** fights, EXP and rewards are untouched, and the core gives what today's on-curve
map gives at every level. The level gate means a roster that crafts ahead can't push an Uma past her curve.

**The foe budget (ES13): unchanged.** `rpgFoeBudget` and `rpgFoeTierBudget` keep their rates. They price "a party
built on curve"; the core matches today's on-curve build per stat:

| Lv | 5 | 10 | 15 | 20 | 25 | 30 | 35 | 40 | 45 | 50 |
|---|---|---|---|---|---|---|---|---|---|---|
| Today, on curve (four stats' average) | 1 | 3 | 6 | 9.75 | 14.25 | 20 | 26 | 33.5 | 41.25 | 50.5 |
| Proposed, a stat with its moon | 1 | 3 | 5 | 9 | 13 | 19 | 25 | 33 | 41 | 51 |
| Proposed, planet only (MP, the other offense) | 1 | 1 | 3 | 3 | 7 | 7 | 13 | 13 | 21 | 21 |

**What moves, by class, at Tier 1 Lv 50:**

| Class | Today (on curve) | Proposed | Change |
|---|---|---|---|
| Brawler, Paladin | ATK 52, HP 52, DEF 49, M.DEF 49 | ATK 51, HP 51, DEF 51, M.DEF 51, MP 21 | −1 to +2; MP +21 |
| Mage, Cleric | M.ATK 52, HP 52, M.DEF 49, DEF 49 | M.ATK 51, HP 51, DEF 51, M.DEF 51, MP 21 | The same |
| Spell Blade | ATK 52, M.ATK 52, HP 49, DEF 49 | All five 51, MP 21 | **M.DEF +51** |
| Summoner | M.ATK 52, HP 52, DEF 49, M.DEF 49 | All five 51, MP 21 | **ATK +51** on her Arms half |

- **MP +21** from the planet, about +10–15% of a Lv 50 Uma's MP. MP isn't in the foe budget; it means a few more
  skills a region. The Springs test checks it.
- **The hybrids** gain the stat their four-stat kit left out. The Spell Blade's damage doesn't move; the Summoner's
  does. The classes doc re-tunes the mirror ([Assumes](#assumes)).
- **The simulation:** `onCurveStars` becomes every node her level opens on the planet and the moons of her class's
  channels; the average Uma has no template moon. Win rates stay within 3 points of today's at Lv 5–50. **It may move**
  node values (moon V's +10 first). **It may not move** the shape: one planet, four moons, five nodes each, every
  open node counting.

**Tiers 2 and 3:** the core gives the same per tier level, so D170's restart-and-scale (Z3) holds as is. The Halo,
Valor and Swiftness are the tier's new tools, priced in its toolbox term (Z4), not in the build curve; her moon stays
outside, as in Tier 1.

| Tier 2 Lv 50, on-curve Brawler, today's gear | Offense |
|---|---|
| Her stats 204, core 51, G10 Might 68, Orb 34, armor 25 | 382 (today: 383) |
| + Halo +34, on her Halo kind's hits | 416, about +15% a hit (H41's measure) |

**Crafting:** 20–33 shared jewels per Uma (plus her moon's 2–6) instead of 100 Star Gems. Professions sizes each jewel
to its Lapidary budget, so the time to build an Uma on curve keeps today's order.

## Decisions

| Call | Recommendation | Alternatives | Why |
|---|---|---|---|
| **ES1** Tier 1's shape | One planet (5 nodes) and four moons (5 nodes each): Strength, Sorcery, Vigor, Guard | 3 nodes a moon: steps of 10 levels, up to 5 points off today's curve at Lv 35–40. Five moons (DEF and M.DEF apart): 5 more nodes, nothing gained | One node every five levels, as gear grades; matches the budget within 2 points |
| **ES2** The planet's values | +1, +2, +4, +6, +8 to each of the six core stats (+21) | Worth its grade (1 … 9, +25): 9–13% over today at Lv 41–50. No MP | "Every stat" is the profile's six; these fit today's curve |
| **ES3** A moon node's value | Its grade: +2, +4, +6, +8, +10. Guard to both DEF and M.DEF | Guard split per stat | D141's rule kept; every class needs both defenses |
| **ES4** What opens a node | Its jewel, in order, and her Uma Level (Lv 5g − 4) | Jewels only (a crafting roster pushes a low Uma past her curve); level only (no Jewel Crafting) | The budget is exact, the gate matches gear's, and the jewel keeps the profession |
| **ES5** How many count | Every open node; no active slots | Three lit moons (keeps today's hybrid kits; brings back toggles and class-switch chores) | The biggest single simplification. A cap would mostly trim the hybrids, whose mirror the classes doc re-tunes anyway |
| **ES6** Speed and Limit in Tier 1 | Not on the shared map. Her moon's knack and feet armor keep them; Limit joins as Tier 2's Valor moon (Q9: keep), evasion as Tier 3's Swiftness | Both moons in Tier 1: 10 more nodes, two units to explain, evasion unbudgeted once every node counts | The shared map shows the six stats the profile shows |
| **ES7** Jewels | Two kinds in Tier 1: Planet Jewel I–V, Moon Jewel I–V (any moon); ten items | One per moon (25 items); one kind for all (10 items, names say less) | The choice of moon happens on the map, not at the bench |
| **ES8** Tier 2's specialty | The Halo: one kind, a free setting, Halo I (+10, Lv 21) and II (+24, Lv 46), flat, two jewels | H41 as written: 20 nodes and 20 gems, swaps among opened kinds. Percent (+8%, +12%) | H41's X3 and X7 kept at a tenth of the nodes |
| **ES9** Tier 2's Limit | The Valor moon: Limit start +2 (Lv 16), +2 more (Lv 36) | Drop Limit from the shared map | Q9's recommendation, kept small |
| **ES10** Tier 3's growth | The Halo's second kind (Halo III–IV) and the Swiftness moon (+3%, +3%) | Class constellations (tiers §6): 6 × 3 nodes tied to class | The shared map stays class-free; class identity is the class and tree docs' |
| **ES11** The core across tiers | The same planet and moons, same values per tier level, rebuilt each tier | A core that grows by tier: D170's budget scaling rewritten | Z3 holds unchanged; new tiers add tools, not stat inflation |
| **ES12** Template-only nodes | Her moon, as variance draws it: lead and knack tracks, one node each per tier reached, ×1 a moon node of the grade, Moon Jewels | On the planet or the shared moons (mixes everyone's with hers); ×1.5 (needs a cap) | Personal, small, outside the budget, and easy to leave out |
| **ES13** The foe budget | Unchanged rates; `onCurveStars` becomes "every node her level opens on her class's bodies" | Re-fit the budget to the new map | The core matches today's curve within 2 points |
| **ES14** Old maps and gems | Delete every node and Star Gem; refund raw materials; no conversion | Convert old moons to new by grade | Different shapes; a partial conversion would confuse more than a clean rebuild |
| **ES15** Names and art | The Planet; Strength, Sorcery, Vigor, Guard; Valor, Swiftness; the Halo; her moon by her template. "Planet Jewel III", "Moon Jewel II", "Halo Jewel I". Today's gem icons reused | "Gems" (gear.md keeps the word for weapons, GE12); today's stone names ("Citrine of the Planet") | Roman numerals match the nodes they open; no new art |
| **ES16** Targets and "can upgrade" | Targets plan the planet, her active class's moons, her moon, and the tier's Halo and small moons. "Can upgrade" counts a jewel she can set now | Plan every moon | A Brawler's target shouldn't ask for Sorcery jewels |
