# The second profession

> **Proposal, 2026-10-21, for the owner to decide; not built.**
> - One of the Tier 2 docs written after [tiers](tiers.md) (D159), beside [advanced classes](tier2-classes.md),
>   [weapon arts and armor sets](weapon-arts.md), [the outer ring](extra-stats-tier2.md) and
>   [Tier 2's world](tier2-world.md).
> - It designs tiers §6's Professions row (Q7). Weapon arts, set steps and ring gems spend what it makes; their own
>   docs decide what they do and when they open.
> - **Owner calls** are marked **V1**, **V2** and so on, each with a recommendation. [§12](#12-owner-calls) lists them
>   all.
> - Numbers are drafts for the pacing simulation.

## 1. What the owner asked for

- **Q7** asked for "a third profession vertical, and in which tier?" when the farm and the Wilds were two. D159
  answered it: **Tier 2 brings a second vertical** next to Craft Level.
- **Tiers §6, Option A's Professions row:** "A second vertical (Q7), with its own families feeding the weapon arts and
  set bonuses". Tier 3's gets its own doc.
- **D144 removed the farm.** The owner found keeping a Farm and a Mine "unviable and unfun". So this vertical stays
  small.
- **What spends its items** (fixed across the Tier 2 docs):
  - a weapon-art node costs one item, learned once per Uma (H40's E4);
  - a set step costs one item, activated once per Uma (H40's E9);
  - a ring gem, cut at the Lapidary, takes one of its items of the gem's half (H41).

## 2. Today

| Piece | Today | Source |
|---|---|---|
| **Craft Level** | Each Uma's one profession (`OwnedUma.craft`, D144), Lv 1–50, raised by every Wilds job | `economy/pacing.ts` |
| Its curve | `1,425 + 15 × level` EXP to next: 12 hours of work at Lv 1, 18 at Lv 49, 735 hours to Lv 50 (D96) | `professionExpToNext` |
| Its gates | Grade g at Craft Lv 5g − 4 (1, 6 … 46) | `items/catalog.ts` |
| Its speeds | A gather takes 54 min at Lv 1, falling to 36 at Lv 50, for any grade (D139). Refining takes a quarter (D101); crafting and cutting twice. A level-3 facility is ×1.25 | `itemMinutes`, `makeMinutes` |
| Its EXP | 2 a minute of the job at her level, before the facility's speed | `EXP_PER_MINUTE` |
| **Facilities** | Eleven on the Wilds page: eight sites, the Workbench, the Forge and the Lapidary. 3 / 4 / 5 slots by level (D144). Upgrades cost 150 Laurels and grade-2 refined items, then 500 and grade-5. A site takes its own family and its partner; a building takes Stones and Woods | `economy/jobs.ts`, `FACILITY_SLOTS` |
| **The chain** | Gather → refine → craft (gear) or cut (Star Gems). 160 items in eight families, 40 gear types in ten grades, 100 gems | [materials](../../game/materials.md) |
| **The engine** | uma-work (D152): four kinds, `gather`, `refine`, `craft` and `cut`. Each reads `craftLevel` for its speed and calls `env.exp.gradeOpen`. `RPG_WORK_ENV` pays Craft EXP through `grantProfessionExp` | `work/env.ts`, `work/kinds/` |
| **The screens** | The kit's facility header, slot rows, target strip, stopped-queue card and Who → What → How many sheet (D157). The page passes Craft Level's words. The Forge and the Lapidary pick from icon grids (D144) | `places/work/FacilityPage.tsx` |
| **The Hub** | Four pages, Town Hall · Learning · Battle · Wilds, then Menu: the bottom bar's five slots (D147, D149). One `PLACES` list serves every tier | `hub/places.ts` |

**The Tier 2 facts:**
- **The workforce** is the twenty Umas of one Rift run. Later tiers have no unlocks (D5).
- **Each arrives** at Craft Lv 1 with Training gear and an empty map (D15, tiers §5).
- **Slots aren't the limit; workers are.** The new world's eleven Wilds facilities start at level 1, with 33 slots for
  twenty workers. With this doc's three, 42.
- **The Exchange** stocks nothing until the first `w6` win.

## 3. Lessons from the farm

This design keeps these rules:
- **No mirrored second half.** Two sites and one station, not eight sites and two stations.
- **No consumable eaten in a loop.** Every product opens something for good: an art node, a set step or a ring gem.
- **No daily chore.** Nothing spoils or needs feeding. Its jobs are the Wilds' jobs.
- **No refining step.** Gather → make is the whole chain.
- **No new Hub page.**
- **One curve and one gate rule to learn,** both Craft's, on its own level.
- **Every grade it gathers is used.**

## 4. The profession (V1, V6)

**V1, its name?**

| Name | On a chip | Feel |
|---|---|---|
| **Lore** (recommended) | Lore Lv 12 | The old masters' arms and spells, studied and written down. One short word beside Craft |
| Delve | Delve Lv 12 | Digging for relics, but it says nothing of the making |
| Rite | Rite Lv 12 | Seals and ceremony, but odd for gathering |

Recommendation: **Lore Level**, save key `lore`, short form "Lore". It reads well next to "Craft Lv 12" on a profile.

**The level:**
- Every Uma has `lore: { level, exp }` beside `craft` on `OwnedUma`.
- Lv 1–50. It starts at Lv 1 in every Tier 2+ world, and promotion resets it, like Craft (D15).
- A Tier 1 world's Umas keep it at Lv 1 and never see it.

**Gates, speeds and EXP:** Craft's rules, on Lore's own level.
- Grade g opens at **Lore Lv 10g − 9**: 1, 11, 21, 31, 41. That's five grades (§5).
- A gather takes `itemMinutes(lore)`: 54 minutes at Lv 1, 36 at Lv 50. A make takes twice that.
- 2 Lore EXP a minute of the job. A level-3 facility works a quarter faster.
- Batches of 1–10, three jobs queued, Repeat, recall and stopped queues, all as today.

**V6, its curve?** Recommendation: **a quarter of Craft's EXP a level:** `round((1,425 + 15 × level) ÷ 4)`.
- That's three hours of work at Lv 1, 4½ at Lv 49, and 184 hours to Lv 50 (Craft: 735).
- **Why:** an Uma's Lore work is about a fourteenth of her Craft work (§9). On Craft's curve, one specialist would need
  578 hours of work to reach grade 5, half the run's whole Lore work. At a quarter, the run's own Lore work takes four
  to six Umas to the top.

| Lore Lv | EXP to next | Hours for this level | Hours of work to reach it | Opens |
|---|---|---|---|---|
| 1 | 360 | 3.0 | 0 | Grade 1 |
| 11 | 398 | 3.3 | 31 | Grade 2 |
| 21 | 435 | 3.6 | 66 | Grade 3 |
| 31 | 473 | 3.9 | 104 | Grade 4 |
| 41 | 510 | 4.3 | 144 | Grade 5 |
| 50 | — | — | 184 | — |

Working without a break, an Uma gains about eight levels a day at first and five near the end. She reaches grade 5 in
six days and Lv 50 in eight.

## 5. What it gathers (V2)

**Two families, one per half, five grades each, raw only.** Ten items.

| Grade | Relics (`relics`, physical) | Glyphs (`glyphs`, magical) | Opens at Lore Lv | Exchange: continent of the tier |
|---|---|---|---|---|
| 1 | Arrowhead (`arrowhead`) | Chalk Glyph (`chalk-glyph`) | 1 | 1st (`w6` in Tier 2) |
| 2 | Broken Hilt (`broken-hilt`) | Ink Glyph (`ink-glyph`) | 11 | 2nd |
| 3 | Knight's Spur (`knights-spur`) | Gilded Glyph (`gilded-glyph`) | 21 | 3rd |
| 4 | General's Pauldron (`generals-pauldron`) | Radiant Glyph (`radiant-glyph`) | 31 | 4th |
| 5 | Royal Regalia (`royal-regalia`) | Primal Glyph (`primal-glyph`) | 41 | 5th |

- **Relics** are what old wars left behind. They feed the Arms things: the five Arms' arts, the physical suit and the
  Arms ring gems.
- **Glyphs** are the marks of old spells. They feed the Tomes' arts, the magical suit and the element ring gems.
- **No collisions.** The names and ids match none of the 160 Wilds items, the gear or the gems, and use no farm or
  cooking words. Nothing is a rune, since `Runestone` is a Stones item.

**Why five grades, not ten.** Its consumers have few steps:
- an art's core and its fork (Weapon Rank 4 and 8);
- a suit's three steps (its lowest grade 4, 7 and 10);
- the ring's two nodes.

That's five needs. Ten grades would leave five dead. Each Lore grade spans two Wilds grades: grade g opens at the level
where Craft opens Wilds grade 2g − 1.

**V2, what does it gather?** Recommendation: **the two families above, raw only: ten items.** A refining step would
double the jobs and add no choice.

## 6. What it makes (V5)

**At its station, the Scriptorium,** in a making job: twice a gather's time, 1–10 a job.

| Product | Id | Grade | Recipe | Spent on | Its gate |
|---|---|---|---|---|---|
| **Arms Scroll I** | `scroll-arms-1` | 1 | 2 Arrowhead | Learning the core of an Arms weapon's art | Weapon Rank 4 |
| **Arms Scroll II** | `scroll-arms-2` | 3 | 2 Knight's Spur | Learning one fork side of an Arms weapon's art | Weapon Rank 8 |
| **Spell Scroll I** | `scroll-spell-1` | 1 | 2 Chalk Glyph | Learning the core of a Tome's art | Weapon Rank 4 |
| **Spell Scroll II** | `scroll-spell-2` | 3 | 2 Gilded Glyph | Learning one fork side of a Tome's art | Weapon Rank 8 |
| **Plate Seal I** | `seal-plate-1` | 2 | 2 Broken Hilt | The physical suit's set step 1 | Its lowest grade 4 |
| **Plate Seal II** | `seal-plate-2` | 4 | 2 General's Pauldron | Step 2 | Grade 7 |
| **Plate Seal III** | `seal-plate-3` | 5 | 2 Royal Regalia | Step 3 | Grade 10 |
| **Mantle Seal I** | `seal-mantle-1` | 2 | 2 Ink Glyph | The magical suit's set step 1 | Its lowest grade 4 |
| **Mantle Seal II** | `seal-mantle-2` | 4 | 2 Radiant Glyph | Step 2 | Grade 7 |
| **Mantle Seal III** | `seal-mantle-3` | 5 | 2 Primal Glyph | Step 3 | Grade 10 |

**The ring makes nothing here.** Its raw items go to the Lapidary, beside a pair of refined Wilds items
([the outer ring](extra-stats-tier2.md) §7, which proposes the name "the Halo"):

| Ring gem | Takes |
|---|---|
| Node 1 of an Arms kind: a grade-5 gem, Craft Lv 21 ("Emerald of the Katana") | 1 Knight's Spur (grade 3) |
| Node 2 of an Arms kind: a grade-10 gem, Craft Lv 46 ("Philosopher's Stone of the Katana") | 1 Royal Regalia (grade 5) |
| Node 1 of an element ("Emerald of Fire") | 1 Gilded Glyph (grade 3) |
| Node 2 of an element ("Philosopher's Stone of Fire") | 1 Primal Glyph (grade 5) |

**The mapping H40 and H41 use:**

| Lore grade | Opens at | Spent on |
|---|---|---|
| 1 | Lore Lv 1 | Scroll I: art cores |
| 2 | Lore Lv 11 | Seal I |
| 3 | Lore Lv 21 | Scroll II: fork sides; ring node 1 |
| 4 | Lore Lv 31 | Seal II |
| 5 | Lore Lv 41 | Seal III; ring node 2 |

- **Every grade is used.**
- **Each grade opens before its consumer needs it:**
  - grade 3 at Lore Lv 21, while Weapon Rank 8 comes at about Uma Lv 36;
  - Seal II at Lore Lv 31, while a grade-7 suit needs Craft Lv 31;
  - Seal III at Lore Lv 41, while a grade-10 suit needs Craft Lv 46.
- **Twenty item types in all:** ten raw and ten made.
- **Where they go:** a new Warehouse shelf, **Scrolls & Seals**, in Tier 2+ worlds. Each is spent once, where H40's
  screens learn a node or activate a step.

**Recipes: two raw items of its half, at its grade. No Wilds items.**
- The packet's draft added one D125 pair of refined Wilds items. This doc leaves it out.
- **Why:** two thirds of an Uma's products are one type, her half's Scroll II (ten of a Brawler's fifteen). Any fixed
  pair would draw ten items from one pair of Wilds sites per Uma and break D86's ±4 per Uma.
- The Wilds still feed Tier 2's new pieces: each ring gem takes a D125 pair (H41), and the Scriptorium is upgraded with
  Stones and Woods.
- Tiers §6 asked for "its own families"; this is that.
- D86's tests don't change. A new test checks that the ten products use Relics and Glyphs alike, grade for grade.

**V5, what does it make?** Recommendation: **the ten products above.** One Scroll per art node and one Seal per set
step, by half and gate, each from two raw items. The ring takes raw items at the Lapidary.

## 7. Facilities and the Hub (V3, V4, V8)

**V3, its facilities?** Recommendation: **two gathering sites and one station, in Tier 2 worlds and later only.**

| Place | Id | Kind | Job | Makes | Upgraded with |
|---|---|---|---|---|---|
| **Battlefield** | `battlefield` | gather-site | Gather, Lore | Relics | Relics + Glyphs |
| **Shrine** | `shrine` | gather-site | Gather, Lore | Glyphs | Glyphs + Relics |
| **Scriptorium** | `scriptorium` | station | Make, Lore | Scrolls and Seals | Stones + Woods |

- **Slots:** 3 / 4 / 5 like every facility, ×1.25 at level 3. Nine slots at level 1.
- **Blurbs:** "Gathers relics while you're away, for Arms arts and the physical suit." "Gathers glyphs while you're
  away, for Tome arts and the magical suit." "Writes Scrolls for weapon arts and presses Seals for armor sets."

**V8, upgrades?** Recommendation: **the Wilds' rule.** A site takes its own family and its partner; the station takes
blocks and planks.

| To | Laurels | A site | The Scriptorium |
|---|---|---|---|
| Lv 2 | 150 | 1 Arrowhead and 1 Chalk Glyph (grade 1) | 1 Sandstone Block and 1 Birch Plank |
| Lv 3 | 500 | 2 Knight's Spur and 2 Gilded Glyph (grade 3) | 2 Basalt Block and 2 Oak Plank |

Lore grades 1 and 3 stand in for the Wilds' grades 2 and 5: grade 3 opens at Lore Lv 21, as Wilds grade 5 does at
Craft Lv 21. The two new families are each other's partner.

### Where they stand

**The packet's draft:** a second trio row (site · station · site) on the Wilds page. **The arithmetic says it doesn't
fit.**

**The kit's numbers** (uma-kit 0.9.1: `hub/grid.ts`, `PlaceTargets.tsx`, `Pips.tsx`):
- The map snaps to 24 px rows: 16-pixel art tiles drawn at 1.5× on a 2× screen.
- **A place is 112 px wide and 112 px tall:**
  - its 48-pixel building, drawn 72 px high, 66 px down to its ground line;
  - its name pill, 24 px;
  - one row of pips, 22 px.
- **Pips are 20 px, with 4 px gaps, in rows of four.** So a level-3 facility's five take two rows, and the place is
  136 px tall.
- **The three columns** (x 0.22, 0.5 and 0.78) sit 120 px apart. Places never touch sideways (8 px to spare), so only
  places in one column can collide.
- **The map's height** between the bars, in the Home Screen app:
  - **539 px** at 375×667 (a 20 px status bar);
  - **675 px** at 390×844 (47 px on top, 34 at the bottom).

A column of n places needs n − 1 steps plus one place. A step is five rows (120 px) for up to four pips, and six rows
(144 px) for five.

| Places in one column | Needs, up to 4 pips | Needs, 5 pips | At 375×667 (539 px) | At 390×844 (675 px) |
|---|---|---|---|---|
| 5 (today) | 592 px | 712 px | Over already: a place's pips reach 16 px into the building below | Fits until level 3 |
| 6 (a second trio row) | 712 px | 856 px | Over by 173 px | Over by 37 px |

The six-row try, as `WILDS_LAYOUT` rows:

| Row | y | Places |
|---|---|---|
| 1 | 0.08 | Monster Den · Ley Spring |
| 2 | 0.24 | Mine · Crystal Cavern |
| 3 | 0.40 | Workbench · Lapidary · Forge |
| 4 | 0.56 | Quarry · Meadow |
| 5 | 0.72 | Forest · Fossil Dig |
| 6 | 0.88 | Battlefield · Scriptorium · Shrine |

- At 375×667, every place overlaps the one below it, by 16–40 px at level 1 and 40–64 px at level 3, and the top row
  starts 24 px above the map.
- At 390×844, rows 1–2 and 4–5 overlap by 16 px even at level 1, and by up to 40 px at level 3.
- No fractions do better: the column needs 712 px, and the map has 675.

**So the Wilds page is full.** Smaller pips or buildings would be a kit change for both apps. So would a fifth page:
the bottom bar's five slots are the four pages and Menu (D147, D149).

**V4, where do they stand?** Recommendation: **the Battle page's free sides,** in Tier 2+ worlds:

| Place | At | Beside |
|---|---|---|
| Battlefield | (0.22, 0.3) | The Scenario Gate, on its left |
| Shrine | (0.78, 0.3) | The Scenario Gate, on its right |
| Scriptorium | (0.22, 0.72) | The Rift, on its left |

- **The Scenario Gate (0.5, 0.3) and the Rift (0.5, 0.72) don't move.** The most-tapped place stays where the hand
  expects it, in every tier.
- **It fits at both sizes,** five pips included. Every place clears the others, with at least 63 px to spare at the
  bottom for the Collect all pill.
- **It suits the page.** The drill ground already has weapon racks and training dummies, and these places make the arts
  and sets an Uma trains with.
- **The Battle tab counts ready jobs,** as the Wilds tab does (one line in `hub/Bars.tsx`). Collect all already covers
  every page.
- **The cost:** the Play page holds some Work in Tier 2+. That's the price of no new page.
- The spot right of the Rift stays free.

**`PLACES` per tier.** Today one list serves every tier. H35 brings the active tier; the registry then gives each tier
its places. Tier 1 has none of these three; Tier 2 and later have them. Place ids stay global, so a push link such as
`/battle/scriptorium?tier=2` works.

## 8. On uma-work and the kit's screens

Decided here, not owner calls:

- **Its own kinds: `lore-gather`** (the two sites) **and `lore-make`** (the Scriptorium), in `work/kinds/`.
  - They aren't `gather` or `craft`, so `gradeOpen(state, outfitId, kind, grade)` routes on `kind`. A Lore kind checks
    Lore Lv ≥ 10g − 9; the rest check Craft Lv ≥ 5g − 4.
  - `JobKind`, `maxJobCount` (1–10) and the save parser's `madeBy` learn the two.
  - Both pay into the Warehouse with uma-work's `payItems`.
- **EXP routes on her row's building.**
  - `grant(state, outfitId, exp, now)` isn't told the kind. But `payWork` calls it **before** it rewrites her row, so
    `state.work[outfitId].slot.building` still names where she worked.
  - One Uma works in one place, so one collect is one facility's EXP.
  - The adapter reads `facilitySpec(building).profession` and pays `craft` or `lore`. Its receipt detail names the
    profession, so a level-up reads "Lore Lv 12".
  - **The test that pins it:** `work/env.test.ts`, "pays a collect's EXP to the profession of the building she worked
    in". It collects a finished Scriptorium job with nothing queued, the case that frees her slot, and checks that Lore
    rises and Craft doesn't. It also covers a recall and a Repeat that collects first. If uma-work ever frees the slot
    before `grant`, this test fails first.
  - **Only if that read proves fragile:** a "Both apps:" request to uma-platform for `grant` to receive the slot's
    building ([change protocol](../../change-protocol.md)). It isn't needed today.
- **Each kind reads its own level for speed:** `loreLevel(world, outfitId)` beside `craftLevel` in
  `work/kinds/shared.ts`, with the same `itemMinutes`, `makeMinutes`, `secondsAt` and `jobExp`.
- **Facilities:** `FacilitySpec` gains `profession: 'craft' | 'lore'`, and the three specs join `FACILITIES` for Tier 2+
  worlds. An upgrade reads a raw item for a raw-only family.
- **The kit needs no change.**
  - At the three Lore facilities, the facility page passes Lore's words: `workLevel: 'Lore Level'`,
    `workLevelLabel: 'Lore Lv {level}'`.
  - Each picker row's `workLevel` (`album/rows.ts`) is her Lore level there, so the picker sorts and describes by it.
  - **The Scriptorium's picker is an icon grid,** like the Forge's and the Lapidary's (D144, D157). Two rows, physical
    then magical: Arms Scroll I and II, Plate Seal I–III; Spell Scroll I and II, Mantle Seal I–III. There are no grade
    chips: each product has one grade.
  - A product above her Lore level is locked, one without materials is dimmed, and a dot marks what the targets need.

## 9. Pacing

### Per Uma

At Lv 25's speed (a gather in 45 minutes, a make in 90), for one Uma with her class's five weapons, one suit and one
specialty. Her art and set needs are H40's placeholders; her ring is H41's.

| Need | Products | Raw items | Jobs | Work-hours |
|---|---|---|---|---|
| Weapon arts: 5 cores and 10 fork sides | 15 Scrolls | 30 | 30 gathers, 15 makes | 45.2 |
| Set bonus: one suit's three steps | 3 Seals | 6 | 6 gathers, 3 makes | 9.0 |
| The ring: one specialty's two gems | — | 2, to the Lapidary | 2 gathers | 1.5 |
| **Total** | **18** | **38** | **38 gathers, 18 makes** | **55.7** |

**Craft, recomputed beside it:**
- 472 gathers (355 hours), 472 refines (89), 120 crafts (181) and 100 cuts (151): **776 work-hours**.
- Tier 2 adds her two ring gems' cuts and their D125 pairs (7 hours): **782**.

**Lore is 7% of her Craft work**, under the draft target of a tenth.

**The most an Uma can take** is every weapon's art and both suits: 36 products from 74 raw items, 110 hours (14%). It
happens only if she trains a second class on the other half's weapons and suit.

### A twenty-Uma run

Four parties as the Rift's fronts ask: 4 Brawlers, 4 Mages, 4 Spell Blades, 4 Summoners, 2 Paladins and 2 Clerics.
That's 50 Arms and 50 Tomes, ten suits of each half, and (assumed) ten specialties of each.

| Grade | Relics | Glyphs | For, in each half |
|---|---|---|---|
| 1 | 100 | 100 | 50 Scroll I |
| 2 | 20 | 20 | 10 Seal I |
| 3 | 210 | 210 | 100 Scroll II; 10 ring node-1 gems |
| 4 | 20 | 20 | 10 Seal II |
| 5 | 30 | 30 | 10 Seal III; 10 ring node-2 gems |
| **Total** | **380** | **380** | 360 products in all |

| Work | Work-hours | Per worker, of twenty | Days, nonstop, level-1 facilities | At level 3 (×1.25) |
|---|---|---|---|---|
| Craft (Tier 2) | 15,650 | 782 | 32.6 | 26.1 |
| Lore | 1,115 | 56 | 2.3 | 1.9 |
| **The run** | **16,765** | **838** | **34.9** | **27.9** |

- **Specialists:** the run's 1,115 Lore hours take about six Umas from Lore Lv 1 to 50 (184 hours each), or four if
  they keep working past it. So **four to six specialists reach the top grade** on the run's own work, as the draft
  target asks. They're four to six of the twenty, and they fight too (D119).
- **Lore is never the bottleneck.** Each grade opens before its consumer (§6).
- **Slots:** 42 at level 1 (33 Wilds, 9 Lore) for twenty workers. Upgrades buy level 3's speed, not slots (H43).

### The Exchange (V7)

**V7, does the Exchange sell its raw items?** Recommendation: **yes, as it sells the Wilds' items.**
- Once a stage on continent n of a tier is won, the Exchange stocks Lore grade n: `w6` stocks grade 1, up to `w10`
  grade 5. Up to 99 a purchase.
- **Price:** `rawItemPrice(2n)`, so 30, 50, 70, 90 and 110 Laurels. That's the price of the higher Wilds grade on the
  same continent's shelf.
- **Selling** pays as a Wilds raw item of grade 2n (2 + 4n Laurels), and a product as a Star Gem of grade 2n (6 + 12n).
- **Why:** a Tier 2 Laurel buys twice what it did (H43). A twenty-Uma workforce buys what its few specialists can't
  gather, so their hours go to making.

## 10. Save and screens

| Area | After |
|---|---|
| **The save** | `OwnedUma.lore: { level, exp }` beside `craft`, at Lv 1 in every world. The new ids join the catalog, so the strict parser accepts them in stock, jobs and queues. Facility levels go in `buildings`; work rows keep their shape. The version is the next free one when it's built; no doc picks it |
| **Promotion** | Lore starts at Lv 1 in the new world (D15). Her Relics, Glyphs, Scrolls and Seals stay in the old world's stock (tiers §5) |
| **The Warehouse** | Materials gains Relics and Glyphs (raw only). A fourth shelf, **Scrolls & Seals**. Both in Tier 2+ only |
| **The profile** | In Tier 2+ the header shows Craft Lv and Lore Lv; in Tier 1, Craft only. The Work tab shows both |
| **The Stable** | A Lore Level sort in Tier 2+ worlds: eight sorts |
| **Targets** | The Scriptorium lists a Scroll for each art node of her class's five weapons not yet learned, and a Seal for each set step of her suit's half not yet active (H40). The Lapidary lists her specialty's ring gems (H41). The Battlefield and the Shrine list the raw items those still need. The cascade is today's |
| **Notifications** | Unchanged: "Work done" covers the three facilities, with `?tier=` links (tiers §4) |
| **The bottom bar** | The Battle tab counts ready jobs in Tier 2+ |
| **The Exchange** | Its Buy list gains the Lore grades stocked |

## 11. What it needs

| Piece | Where | Size |
|---|---|---|
| **Items:** two raw-only families of five grades, ten products, ids and names, the Lore symmetry test | `items/`, `economy/` | S |
| **The profession:** `lore` on `OwnedUma`, its curve and gates, the parser, and a migration that sets every Uma at Lv 1 | `economy/pacing.ts`, `save/` | S |
| **Work:** `lore-gather` and `lore-make`, `gradeOpen` by kind, `grant` by building and its test, three facility specs and their upgrades | `work/`, `economy/jobs.ts` | M |
| **Places:** the three on the Battle page of Tier 2+ worlds, with `PLACES` per tier (after H35) | `hub/places.ts` | S |
| **Exchange and targets:** Lore stock and prices; targets for arts, set steps and the specialty (with H40 and H41) | `save/exchange.ts`, targets | M |
| **Web:** Lore's words on the facility page, picker rows, the Scriptorium's icon grid, the profile, the Stable sort, the Warehouse shelf, the Battle tab's count | `apps/web/` | M |
| **Art** (a ChatGPT packet, uma-art): ten raw and ten product icons, and the Battlefield, Shrine and Scriptorium buildings. Until then, as D144 did: each icon borrows a frame with a badge (Relics the Fossil Dig's row, Glyphs the Ley Spring's, Scrolls a Tome, Seals the Cuirass and the Robe), and the Hub draws the kit's fallback marker | uma-platform | M |
| **The pacing simulation:** Lore in the capacity table; a twenty-Uma Tier 2 run | `economy/pacing.sim.ts` | S |
| **The manual,** when built: loops (Lore Level), materials (the families and products), sections (the Battle page) | `docs/game/` | S |

It's built after H35 (the active tier), together with H40 and H41, which spend its products.

## 12. Owner calls

| Call | Question | Recommendation |
|---|---|---|
| **V1** | Its name, and the chip | **Lore Level**, save key `lore`: "Lore Lv 12" |
| **V2** | What it gathers | **Relics** (physical) and **Glyphs** (magical), five grades each, raw only: ten items |
| **V3** | Its facilities | Two sites, the **Battlefield** and the **Shrine**, and one station, the **Scriptorium**. Tier 2 worlds and later only; 3 / 4 / 5 slots |
| **V4** | Where they stand | **The Battle page's free sides:** the sites flank the Scenario Gate, the Scriptorium stands left of the Rift. Not the Wilds: a sixth row doesn't fit. No new page |
| **V5** | What it makes | **Arms and Spell Scrolls I–II** (art cores, fork sides) and **Plate and Mantle Seals I–III** (set steps), each from two raw items of its half. The ring takes raw grades 3 and 5 at the Lapidary |
| **V6** | Its curve | Craft's minutes and 2 EXP a minute, at **a quarter of Craft's EXP a level** (184 hours to Lv 50). Grade g at Lore Lv 10g − 9 |
| **V7** | Does the Exchange sell its raw items? | **Yes,** as the Wilds': continent n of a tier stocks grade n, at `rawItemPrice(2n)` |
| **V8** | Upgrades | Sites take **Relics and Glyphs** (grade 1, then grade 3); the Scriptorium takes **Stones and Woods**, like every building |
