# Extra Stats in Tier 2: the outer ring

> **Proposal, 2026-10-21, for the owner to decide; not built.**
> - One of five Tier 2 docs that follow [tiers](tiers.md) Option A (D159): [advanced classes](tier2-classes.md) (H39),
>   [weapon arts and armor sets](weapon-arts.md) (H40), this one (H41), [the second profession](second-profession.md)
>   (H42) and [Tier 2's world and its Rift](tier2-world.md) (H43).
> - It builds on [classes v2](classes-v2.md) §6 (flat Orbs) and [the Rift](rift.md) §5 (fronts that reward one channel).
> - **Owner calls** are marked **X1**, **X2** and so on, each with a recommendation. [§13](#13-owner-calls) lists them
>   all.
> - Numbers are drafts for the simulation.
> - "The ring" is this doc's working word until X1 names it.

## 1. What the owner asked for

- **Tiers §1:** "Extra Stats gain element and weapon-kind specialization after Tier 1."
- **Tiers §6, Option A's Extra Stats row** (approved, D159): Tier 2 gets "an outer ring: one node pair per damage kind
  (+% damage of that weapon kind or element), so an Uma can specialize, opened with Tier 2 Star Gems". Tier 3 gets
  "class constellations: a few nodes per master class".
- **Tiers §6, the Rift row:** Tier 2's Rift has "harder fronts that test weapon arts and the outer ring".
- **C4, the owner's change** (classes v2 §6.2, D160): Orbs are flat, "half a weapon's Might at their grade", not a
  percentage. Flat "scales the way weapons do" and "doesn't multiply with every other bonus, so the balance stays
  readable". The owner wasn't sure percentages were balanced.

The ring was approved as a percentage before C4 made the Orbs flat. So this doc asks that question again for the ring
(X3), with both options costed.

## 2. Today

**The map** (the Observatory, D58, D144):
- 100 nodes: 80 moons (eight stats × ten grades), 16 bridges (grades 3 and 7, between neighbouring planets) and 4 Sun
  nodes (grades 4, 6, 8, 10).
- **Points, worth the grade** (D141): a moon gives g to its stat, a bridge g ÷ 2 to each side, a Sun node g ÷ 8 to all
  eight. A point is +1 ATK, M.ATK, DEF, M.DEF or MP, +5 HP, 0.6% evasion or a 0.4 Limit head start (D104).
- **Active nodes:** 5 + ⌊level ÷ 2⌋ on her Uma Level: 5 at Lv 1, 30 at Lv 50. Changed freely outside fights.
- **In order (D119):** a gem waits until every lower node of its track is open.
- **What they're worth:** at Lv 50 the map is a fifth of her offense, and her hit loses 28% without it (D142, D143).

**Star Gems and the Lapidary** (D144):
- 100 gems, one per node, cut at the Lapidary, a Wilds station. A `cut` job takes two gathers' time. Grade g needs Craft
  Lv 5g − 4.
- Recipes take refined items of each stat's Wilds family, so every family is used 29 times per Uma (D86's symmetry
  test).
- Names: the grade's stone and the stat's virtue ("Garnet of Strength"). Grade 5 is Emerald, grade 10 Philosopher's
  Stone.

**Orbs after v14** (classes v2, approved, not built):
- One damage slot holds one Orb. It adds half its grade's weapon Might to its kind's offense: +10 at G5, +34 at G10.
- That's about +18–20% on that kind's hits at Tier 1 Lv 50. It no longer adds its kind for weaknesses.

**Promotion** (tiers §5): her map starts empty in the new tier, and her gems stay in the old world's stock. Craft Level
starts over too (D15), so a Tier 2 world cuts grade-10 gems only once one of its Umas reaches Craft Lv 46 again.

**The code:**

| Piece | Where |
|---|---|
| The planets' order, `RING` (HP, DEF, M.DEF, MP, M.ATK, ATK, Speed, Limit: M.ATK and ATK are neighbours); node ids `moon:<stat>:<1–10>`, `bridge:<a>-<b>:<1–2>`, `sun:<1–4>`; `starPoints`; `GEM_IDENTITIES`, `nodeGem`, `gemNodes`, `isStarNode`, `isGemId` | `packages/domain/src/economy/stars.ts` |
| Recipes and names | `economy/gems.ts` |
| `activeNodeSlots(level) = 5 + ⌊level ÷ 2⌋` | `economy/pacing.ts` |
| `gemBlock`, `setGem`, `setActiveNodes` (D119's order) | `save/observatory.ts` |
| `BattleAlly.might`: offense added per damage kind. `battleDamage` gets each hit part's kind, so it reaches every hit of that kind, Limit Breaks included | `rpg/battle/types.ts`, `rpg/battle/engine.ts` |
| The ten kinds (`RPG_DAMAGE_KINDS`), and each Arm's element twin (`RPG_KIND_PAIRS`) | `rpg/kinds.ts` |
| The map, drawn in SVG; the Lapidary's Moons, Bridges and Sun tabs | `apps/web/src/places/observatory/ObservatoryPage.tsx`, `places/work/FacilityPage.tsx` |

## 3. The ring's shape (X1, X2, X6)

**Twenty nodes:** each of the ten damage kinds has a pair.
- Node 1 opens with a grade-5 ring gem, node 2 with a grade-10 one.
- Node 2 needs node 1 first, by D119's order rule.

| Kind | Half | Node 1, grade 5 | Node 2, grade 10 |
|---|---|---|---|
| Greatsword | Arms | Emerald of the Greatsword | Philosopher's Stone of the Greatsword |
| Axe | Arms | Emerald of the Axe | Philosopher's Stone of the Axe |
| Lance | Arms | Emerald of the Lance | Philosopher's Stone of the Lance |
| Bow | Arms | Emerald of the Bow | Philosopher's Stone of the Bow |
| Katana | Arms | Emerald of the Katana | Philosopher's Stone of the Katana |
| Fire | Element | Emerald of Fire | Philosopher's Stone of Fire |
| Ice | Element | Emerald of Ice | Philosopher's Stone of Ice |
| Lightning | Element | Emerald of Lightning | Philosopher's Stone of Lightning |
| Light | Element | Emerald of Light | Philosopher's Stone of Light |
| Dark | Element | Emerald of Darkness | Philosopher's Stone of Darkness |

**Ids (draft, after X1):** nodes `halo:<kind>:1|2`, gems `gem-halo-<kind>-5|10`, so `halo:katana:2` and
`gem-halo-katana-10`. `isStarNode` and `isGemId` tell them from today's by the `halo` prefix, which no stat uses.

**X1, what do we call it?**

| Option | Nodes | On a chip | Feel |
|---|---|---|---|
| **The Halo** (recommended) | Katana I, Katana II | Halo · Katana | A ring of light around the whole map. Short |
| The Comet Belt | Katana comet I and II | Comets · Katana | Far bodies on their own orbit. Longer |
| The Outer Ring | Katana I, Katana II | Ring · Katana | Literal. But `RING` in the code already names the planets' order, and "ring" reads as jewellery beside Orbs and Amulets |

Recommendation: **the Halo.** It's short on a chip, it says "around the map", and it leaves "constellation" free for
Tier 3's class constellations.

**X2, a pair or a longer chain per kind?**
- **A pair, grades 5 and 10:** two steps that read clearly (half, then full); twenty gems; it matches H42's short
  ladder (a middle item and a top item).
- A chain of five (grades 2, 4, 6, 8, 10): fifty gems and smaller steps, and H42's ladder would need more grades.
- One node per kind: ten gems, but nothing to grow into across the tier.

Recommendation: **a pair,** as tiers §6 says.

**X6, where and when does it open?**
- **Where:** an outer orbit around the map, past the moons. The five Arms fan out from ATK toward Speed; the five
  elements fan out from M.ATK toward MP. They meet at the seam between M.ATK and ATK, which are neighbours in `RING`.
  Each Arm faces the element that shares its shape (`RPG_KIND_PAIRS`): Greatsword and Fire nearest the seam, Katana and
  Dark at the ends.
- **Gate:** none but its own order. No inner node has to be open first. The cut is the gate: Craft Lv 21 for a grade-5
  gem, 46 for grade 10, plus the second profession's grades (§7).
- **When:** Tier 2 worlds and later only. The Tier 1 world's Observatory and Lapidary don't show it, and a Tier 1 world
  can't hold ring nodes or ring gems.

Recommendation: **as above.** Arms by ATK and elements by M.ATK reads at a glance. A gate on inner nodes would add a
rule for nothing, since Craft Level already paces the gems.

## 4. What a node gives (X3)

Tiers §6 approved "+% damage" before C4 made the Orbs flat. Both options are costed here.

**Option F, flat (recommended): offense on her hits of its kind, half a weapon's Might at its grade, as an Orb is.**
- Node 1 (grade 5): **+10 offense**, a G5 Orb's.
- Node 2 (grade 10): **+24 more**, so the pair adds **+34**, a G10 Orb's.
- It joins the offense of every hit of its kind, before `offense² ÷ (offense + defense)`, as Might and the Orb do.

**Option P, percent (the approved draft):**
- Node 1: **+8%** damage on her hits of its kind. Node 2: **+12% more**, so the pair adds **+20%**.
- It multiplies the hit after the offense formula, in `battleDamage`, so only that kind's hits.

**Either way, it reaches every hit of its kind.**
- Attacks and skills, both Spell Blade halves, a summon's arrival and its farewell, and Limit Breaks, inherited ones
  included. Recommendation: **yes to Limit Breaks:** Extra Stats apply to every hit.
- `battleDamage` already receives each hit part's kind, as Might does.
- Under C3 an inherited hit swings with her higher offense but keeps its kind. So a Mage with a Katana ring adds it to
  an inherited Katana Limit Break.

**A worked example: an on-curve Tier 2 Lv 50 Brawler** (lifetime Lv 100), built through `projectRpgStats` as the
balance party builds her:
- Speed 185 (110 ÷ 5 + 99 × 1.5 × 1.1), so ATK 204 with the Brawler's ×1.1;
- the inner map +52 ATK, G10 armor +25, and her G10 Katana's Might +68: **offense 349 on Katana hits**;
- the foe: a regular striker at lifetime Lv 100 on [H43](tier2-world.md)'s draft budget (restarted at tier Lv 50, with
  its ×1.15 Tier 2 term): **DEF 448**;
- a raw 100% hit, before shields, weaknesses and statuses.

| Her Katana hit | Offense | Hit | Gain |
|---|---|---|---|
| No ring | 349 | 153 | — |
| Flat pair (+34) | 383 | 177 | **+15%** |
| Percent pair (+20%) | 349 | 183 | **+20%** |

- **Node 1 alone, at Tier 2 Lv 21** (G5 gear, offense 200, a DEF 146 foe): flat +7%, percent +8%. The two agree at
  node 1 and part at the top.
- **Flat's worth moves with the foe's DEF:** +15% at DEF 390–448, and +18% against today's formula, which doesn't
  restart (DEF 1,148). Percent is +20% everywhere.

**The cost of each:**

| | Flat (F) | Percent (P) |
|---|---|---|
| A full pair, her kind's hits, Tier 2 Lv 50 | +15% | +20% |
| With a G10 Orb on the same kind (§6) | +31%: exactly +68 offense, a second G10 weapon's Might | +39% |
| Against her G10 weapon's own Might (+41%) | Under it at every grade. At grade 5, Orb + node 1 is +20 offense against the G5 weapon's +19 | Under it at Tier 2 Lv 50 by about 2 points. Over it at Tier 2 Lv 21: +15.7% against +15.4% |
| On screen | "+34", the same unit as Might and the Orb | "+20%" beside offense numbers: a second unit |
| Fight code | No new rule. The ring's offense joins the per-kind offense frozen into `BattleAlly.might`, as the weapon's does. No engine version of its own | A per-kind multiplier on `BattleAlly` and a step in `battleDamage`: engine v15, with H39 and H40 |
| Later tiers | Worth less as lifetime stats grow, like Might and Orbs | Worth the same at every level |
| One job per lever ([H40](weapon-arts.md)) | Shares "flat offense to one kind" with the Orb; they differ by source, gear or Extra Stats | A job of its own: "% damage by kind" |
| The sibling docs | Two lines change (below) | No change |

**X3, flat or percent?** Recommendation: **flat (F).**
- **One scale.** Might, the Orb and the ring all add offense to the hits of a kind. Her Katana line reads "Might +68,
  Orb +34, Halo +34".
- **The owner's reason for C4 holds word for word.** It scales like weapons, and it doesn't multiply with every other
  bonus.
- **X7's bound holds by construction.** Orb plus ring is +68 at the top, a G10 weapon's Might, and about the weapon's
  Might at every grade. Percent passes the bound narrowly at Lv 50 and breaks it at grade 5.
- **It's the inner map's own unit.** Every node already gives flat points (D104).
- **It's cheaper.** No engine rule.
- **What it gives up:** the ring and the Orb do the same thing from two sources, as armor ATK and Extra Stats ATK
  already do. And its worth falls as lifetime stats grow. H43's budget and Tier 3's doc account for that, as they do
  for Might.
- **If the owner picks flat,** two lines elsewhere change. [H40](weapon-arts.md)'s lever table reads the ring as "flat
  offense to one kind, from Extra Stats". [H43](tier2-world.md)'s Tier 2 term prices the ring at +34 offense (about
  +15%), not +20%.
- **If the owner picks percent:** +8% and +12% as drafted, and nothing else changes.

## 5. One specialty (X4)

- **Its own slot:** the ring has one slot, apart from the planets' 5 + ⌊level ÷ 2⌋.
- **One kind at a time:** she picks a specialty kind. It's worth what she has opened of that kind's pair: node 1 alone
  +10 (or +8%), both +34 (or +20%).
- **Free to change** outside a fight, like active nodes. She may leave it empty.
- **From Tier 2 Lv 1:** no level gate. The gems' Craft Level paces it.
- **More kinds:** opening a second kind's pair costs its two gems. She then swaps between them freely. Between Rift
  fights the owner re-arranges the roster anyway (R2), so an Uma with several kinds open can match each stage's
  weakness.

**X4, how many ring nodes count at once?** Recommendation: **one specialty, one kind, in a slot of its own.**
- **Not the planets' slots:** twenty ring nodes in thirty planet slots would add the ring to every kind (+34 on all
  ten, or +20% on everything), which is no specialty. It would also cost inner nodes, so the ring would compete with
  HP and DEF instead of with other kinds.
- **Not two specialties:** the Orb is already a second kind pick (§6).

## 6. Orbs and the ring (X7)

She may put her Orb and her ring on the same kind. That's the specialization.

**The bound:** together they add no more to that kind's hits than her G10 weapon's Might does, at Tier 2 Lv 50. That's
**+41%**: her Katana hit is 153 with its Might and 108 without (D143's measure, what a hit loses without a source).

The Tier 2 Lv 50 Brawler of §4, against DEF 448:

| Orb | Ring | Katana hits | Greatsword hits |
|---|---|---|---|
| None | None | 153 | 153 |
| Katana | None | 177 (+15%) | 153 |
| None | Katana | Flat 177 (+15%) · percent 183 (+20%) | 153 |
| **Katana** | **Katana** | **Flat 201 (+31%) · percent 212 (+39%)** | 153 |
| Katana | Greatsword | 177 (+15%) | Flat 177 (+15%) · percent 183 (+20%) |
| *Her G10 Katana's own Might* | | *+41% (108 → 153)* | |

- **Flat holds the bound by construction.** Orb +34 and ring +34 are +68 offense, a second G10 weapon's Might, worth
  +31% on top of the first. It holds at every grade: at grade 5 it's +10 and +10 against the G5 weapon's +19.
- **Percent holds it at Tier 2 Lv 50** by about 2 points (+39% against +41%), and breaks it at grade 5. It would then
  need a cap rule.
- **The Orb's worth falls as her stats grow:** +19.5% at Tier 1 Lv 50 (classes v2 §6.2 rounds it to +18%), +15.5% at
  Tier 2 Lv 50.

**X7, Orb and ring on the same kind?** Recommendation: **yes.** That's the specialization the owner asked for. One Orb
slot and one specialty keep it bounded. With flat values (X3) it needs no cap rule: Orb plus ring is a G10 weapon's
Might, +68.

## 7. Tier 2 Star Gems (X5)

**Twenty ring gems,** one per ring node, cut at the Lapidary:
- a `cut` job like every gem: two gathers' time;
- grade 5 needs Craft Lv 21, grade 10 Craft Lv 46 (5g − 4);
- in the Lapidary of Tier 2 and later worlds only.

**Recipe (draft):**
- **One second-profession item of the kind's half:** the physical item for an Arms kind, the magical one for an
  element. Node 1's gem takes its middle grade and node 2's its top grade. [H42](second-profession.md) drafts five
  grades, so grade 3 (its Lv 21) and grade 5 (its Lv 41). H42's table maps them.
- **Plus one D125 pair of refined Wilds items** at the gem's grade. Kind k (in `RPG_DAMAGE_KINDS` order, from 0) takes
  pair k mod 4 at grade 5 and the pair two along at grade 10, walking the pairs as gear types do. So each kind's two
  gems use four different families, and across the twenty gems each Wilds family is used five times. D86's symmetry
  test keeps passing.

| Kind | Grade-5 gem | Grade-10 gem |
|---|---|---|
| Greatsword | Physical item G3, Cobalt Ingot, Cut Emerald | Physical item G5, Dragonhide, Unicorn Carving |
| Axe | Physical G3, Oak Plank, Tide Infusion | Physical G5, Meteorite Block, Cloudweave |
| Lance | Physical G3, Ironback Leather, Tusk Carving | Physical G5, Orichalcum Ingot, Cut Philosopher's Stone |
| Bow | Physical G3, Basalt Block, Wool Cloth | Physical G5, Yggdrasil Plank, Prismatic Infusion |
| Katana | Physical G3, Cobalt Ingot, Cut Emerald | Physical G5, Dragonhide, Unicorn Carving |
| Fire | Magical G3, Oak Plank, Tide Infusion | Magical G5, Meteorite Block, Cloudweave |
| Ice | Magical G3, Ironback Leather, Tusk Carving | Magical G5, Orichalcum Ingot, Cut Philosopher's Stone |
| Lightning | Magical G3, Basalt Block, Wool Cloth | Magical G5, Yggdrasil Plank, Prismatic Infusion |
| Light | Magical G3, Cobalt Ingot, Cut Emerald | Magical G5, Dragonhide, Unicorn Carving |
| Dark | Magical G3, Oak Plank, Tide Infusion | Magical G5, Meteorite Block, Cloudweave |

The pairs: Ores + Crystals, Woods + Essences, Hides & Scales + Bones & Horns, Stones + Fibers.

**Names:** today's pattern, the grade's stone and the kind: "Emerald of the Katana", "Philosopher's Stone of Fire".
Dark reads "of Darkness".

**What one specialty costs an Uma:** two gems.
- Two second-profession items, four refined Wilds items and two cuts.
- About **8 work-hours** at Craft Lv 25's speed: four gathers (3.0 h), four refines (0.8 h), two cuts (3.0 h) and two
  second-profession gathers (1.4 h).
- The inner map takes about 370 work-hours an Uma (232 gathers, 232 refines, 100 cuts). One specialty adds about 2%;
  all ten kinds, about 11%.
- A run of twenty with one specialty each: forty gems, about 165 work-hours, so about eight hours of each worker's time.
- The ring is paced by its gates (Craft Lv 21 and 46, the second profession's grades), not by volume.

**Art:** twenty gem icons appended to uma-art's gem sheet, a ChatGPT packet later. Until then, the cheapest stand-in,
as D144 did: the grade's ATK moon gem icon for an Arms kind and the grade's M.ATK one for an element (Emerald of
Strength, Philosopher's Stone of Sorcery), with the kind's icon as a badge.

**X5, Tier 2 Star Gems?** Recommendation: **a new family of twenty ring gems at the Lapidary,** each from the second
profession's item of its kind's half plus one pair of refined Wilds items. No new station: the Lapidary already cuts
every gem, and every input already exists in Tier 2's Wilds and H42's sites.

## 8. The inner map in Tier 2 (X8)

Unchanged: the same 100 nodes, gems, points and active slots.

| On-curve Brawler | Tier 1 Lv 50 | Tier 2 Lv 50 |
|---|---|---|
| Her own ATK (lifetime stats) | 113 | 204 |
| The inner map | +52, 20% of offense 258 | +52, 15% of offense 349 |
| Her hit without Extra Stats | −28% | −23% |
| Her specialty's hits, inner map and ring | — | Flat: +86, 22% of 383; −33% without both. Percent: −35% |

- Her lifetime stats grow; the inner map's points don't. Its share of her offense falls from a fifth to about a
  seventh.
- **On her specialty's hits, the ring gives that share back,** a little past Tier 1's.
- Its HP, DEF and M.DEF points shrink the same way against a lifetime-100 body.
- [H43](tier2-world.md)'s Tier 2 budget prices the smaller inner share and the ring together.

**X8, change the inner map in Tier 2?** Recommendation: **no.** Same nodes, gems and points. A Tier 2 inner map would be
a second set of 100 gems for the same job. The ring is Tier 2's Extra Stats growth, and H43's budget accounts for the
rest.

## 9. Promotion and later tiers

- **On promotion** the ring empties with the map, and her specialty clears. Her ring gems stay in the old world's stock
  (tiers §5), for the Umas still there.
- **Tier 3 keeps the ring:** its worlds show the same twenty nodes, cut again in Tier 3's Lapidary. Tier 3's doc
  decides whether flat values grow there, with Might and the Orbs.
- **Class constellations** are Tier 3's (tiers §6). They get their own doc later.

## 10. Screens

**The Observatory** (Tier 2 and later worlds):
- **The outer orbit**, drawn in code as the map is: no new map art. Arms in ATK's colour, elements in their battle
  colours.
- **The header** counts both: "Active 30/30 · 100/100 open · Halo 2/20".
- **The specialty row** under the map: "Halo · Katana +34". Tapping an open ring node makes its kind her specialty;
  tapping it again clears it.
- **A locked ring node** names its gem and the Lapidary, as moons do.
- **The Set list** includes the ring gems she can set now.

**The Lapidary:** a fourth tab, **Halo**, beside Moons, Bridges and Sun, in Tier 2 and later worlds. Ten rows (the five
Arms, then the five elements), each with its grade-5 and grade-10 gem as icons. Locked grades, dimmed gems and target
dots work as on the other tabs.

**Targets:** they plan the ring gems of her specialty that she hasn't opened. With no specialty, none.

**The profile's Battle tab:** the Offense group shows her specialty beside her Orb, in the same unit: "Orb · Katana
+34", "Halo · Katana +34".

**The "can upgrade" badge** (classes v2 §7, H34): it counts a ring gem of her specialty she can set, and an empty
specialty while she has a ring node open.

## 11. What it needs

| Piece | Where | Size |
|---|---|---|
| Ring ids and rules: twenty nodes, twenty gem ids, D119's order on each pair, Tier 2 and later only, the specialty | `economy/stars.ts`; `save/observatory.ts` (`setGem`, `gemBlock`, a new `setSpecialty`) | S |
| Recipes and names | `economy/gems.ts` | S |
| Save: the specialty on `OwnedUma.stars`, ring nodes in `unlocked`, ring gems in the world's stock; strict parsing refuses them in a Tier 1 world. The next save version after v24, taken when Tier 2 content is built | `save/save.ts` and its parser | S |
| Fights, flat: the ring's offense joins the per-kind offense frozen into `BattleAlly.might` at the fight's start. No engine rule | `save/battle.ts` (`startFight`), and the Rift's fight start | S |
| Fights, percent (only if X3 picks it): a per-kind multiplier on `BattleAlly` and a step in `battleDamage`, in engine v15 with H39's and H40's changes | `rpg/battle/` | M |
| The Battle tab's line, targets, the badge | `umaBattleSheet` in `save/battle.ts`; `save/targets.ts`; H34's badge rule | S |
| The Observatory: the outer orbit, the header, the specialty row | `places/observatory/ObservatoryPage.tsx`, `items/planets.ts` | M |
| The Lapidary's Halo tab | `places/work/FacilityPage.tsx` (`GemPicker`) | S |
| Art: twenty gem icons on uma-art's gem sheet (a ChatGPT packet); the stand-in until then | uma-platform; `items/outputs.ts` | S |
| The simulation: on-curve members get a specialty matched to the front; Tier 2 members as H43 builds them | `world/balance-party.ts`, `world/balance.test.ts` | M |
| The manual: Extra Stats, Star Gems, the Observatory and the Lapidary; `pnpm docs:update` for the gem list | `docs/game/` | S |

## 12. Balance targets

Drafts for `SIM=1`, at Tier 2 Lv 50, on curve:

| Target | Flat (recommended) | If percent |
|---|---|---|
| A full pair, her kind's hits | +15% (±3) | +20% |
| Her whole-fight damage (not every hit is her kind) | +5–9% | +6–12% |
| Orb plus ring on one kind | Never more than her G10 weapon's Might adds (+41%). Draft: +31% | The same bound. Draft: +39% |
| Specialists matched to the Tier 2 Iron and Arcane fronts, against the same party with no ring | Win stages at least 10 points more often | The same |
| Tier 2 campaign | On-curve win rates within 3 points of Tier 1's at matched tier levels, with the ring priced into H43's budget | The same |

**The simulation may move** the node values (flat +10 and +24, or +8% and +12%) and the recipe's grades. **It may not
move** the pair, one specialty, Tier 2 and later only, or the bound.

## 13. Owner calls

| Call | Question | Recommendation |
|---|---|---|
| **X1** | The ring's name, and its nodes' | **The Halo.** Nodes "Katana I" and "Katana II"; ids `halo:<kind>:1\|2`, gems `gem-halo-<kind>-5\|10`. "Constellation" stays free for Tier 3 |
| **X2** | A pair or a longer chain per kind? | A pair, as tiers §6 says: grades 5 and 10 |
| **X3** | What a node gives: flat or percent? | **Flat,** half a weapon's Might at its grade, as an Orb: +10, then +24, a pair +34 on her hits of its kind. One scale with Might and the Orb, and X7's bound holds by construction. (Percent, if preferred: +8%, +12%, a pair +20%.) Either way it reaches every hit of its kind, Limit Breaks included |
| **X4** | How many ring nodes count at once? | One specialty: one kind, in a slot of its own, apart from the planets' slots |
| **X5** | Tier 2 Star Gems | A new family of twenty ring gems at the Lapidary, from the second profession's item of the kind's half plus a pair of refined Wilds items |
| **X6** | Where and when it opens | An outer orbit, Arms by ATK and elements by M.ATK; Tier 2 and later; no gate but its own order |
| **X7** | Orb and ring on the same kind? | Yes: that's the specialization. Together they add no more to that kind than a G10 weapon's Might does (with flat values, exactly +68) |
| **X8** | Change the inner map in Tier 2? | No: the same nodes, gems and points; the Tier 2 foe budget (H43) accounts for it |
