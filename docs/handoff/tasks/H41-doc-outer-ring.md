# H41 — Doc: the Extra Stats outer ring

**uma-rpg · Claude · M · Needs: nothing · Unblocks: Tier 2 content (built after the doc is approved)**

## Why

D159 approved Option A: from Tier 2, Extra Stats gain **an outer ring**, one node pair per damage kind, so an Uma can
specialize in one Arms kind or one element ([tiers](../../design/tiers.md) §1 and §6). Nothing designs it yet: its
nodes, what they give, how they sit beside today's 100 nodes, the Star Gems that open them, and how they stack with
classes v2's flat Orbs. This packet asks for that design doc. It doesn't build anything.

## Context (read first)

- **House rules:** `CLAUDE.md`, `AGENTS.md`. Original-game content never goes in git: name continents by id, never a
  scenario's name.
- **The approved designs:**
  - [tiers.md](../../design/tiers.md): §1 (the owner's ask: "Extra Stats gain element and weapon-kind specialization
    after Tier 1"), §5 (Extra Stats on promotion: "Her map starts empty. The gems stay in the old world's stock"), §6
    (Option A's Extra Stats row: Tier 2's outer ring, Tier 3's class constellations), §8 (the build order).
  - [classes-v2.md](../../design/classes-v2.md) §6: one damage slot (an Orb) and one support slot. **§6.2: an Orb adds
    half its grade's weapon Might to its kind's offense** (1, 2, 4, 6, 10, 13, 18, 23, 29, 34 for G1–G10), about +18%
    on that kind's hits at Lv 50. That was the owner's change (C4): flat, not a percentage, so it scales like weapons
    and doesn't multiply with every other bonus.
  - [rift.md](../../design/rift.md) §5: the Iron and Arcane fronts reward one-channel damage.
  - D159, D160, D161 at the end of [decisions.md](../../decisions.md).
- **The sibling packets,** written for docs in parallel: [H39](H39-doc-tier2-classes.md) (advanced classes,
  `docs/design/tier2-classes.md`) and [H40](H40-doc-weapon-arts.md) (weapon arts and armor sets,
  `docs/design/weapon-arts.md`). **H40's "one job per lever" table already gives the outer ring "% damage by kind"**:
  Might is flat offense, Orbs flat offense to one kind, arts shape only, set bonuses sustain. Keep that split. If either
  doc exists when you start, read it.
- **The manual as built:** [loops.md](../../game/loops.md) "Extra Stats and gear" and "Craft Level";
  [materials.md](../../game/materials.md) "Star Gems" and "Gear"; [after-the-farm.md](../../design/after-the-farm.md)
  §3 (Star Gems, the Lapidary, D144).
- **The code:**
  - `packages/domain/src/economy/stars.ts`: `RING` (hp, def, mdef, mp, matk, atk, speed, limit, so M.ATK and ATK are
    neighbours), `STAR_NODES` (`moon:<stat>:<1–10>`, `bridge:<a>-<b>:<1–2>` at grades 3 and 7, `sun:<1–4>` at grades
    4, 6, 8, 10), `starPoints` (a node gives its grade), `GEM_IDENTITIES`, `nodeGem`, `gemNodes`;
  - `economy/gems.ts`: recipes and names ("Garnet of Strength": the grade's stone, the stat's virtue);
  - `economy/pacing.ts`: `activeNodeSlots(level) = 5 + ⌊level / 2⌋` on her Uma Level, so a promoted Uma has 5 again;
  - `save/observatory.ts`: `gemBlock`, `setGem`, `setActiveNodes` (D119: a gem waits until every lower node of its
    track is open);
  - `rpg/battle/types.ts`: `BattleAlly.might` is already a per-damage-kind map added to offense;
  - `rpg/kinds.ts`: `RPG_DAMAGE_KINDS` (greatsword, axe, lance, bow, katana, fire, ice, lightning, light, dark) and
    `RPG_KIND_PAIRS` (each Arm and the element that shares its shape);
  - `apps/web/src/places/observatory/ObservatoryPage.tsx`; the Lapidary's picker on `places/work/FacilityPage.tsx`.

### Fixed across H41, H42 and H43 (don't re-decide)

Three docs are written in parallel: this one, [H42's second profession](H42-doc-second-profession.md)
(`docs/design/second-profession.md`) and [H43's Tier 2 world](H43-doc-tier2-world.md) (`docs/design/tier2-world.md`).
Link them by path, and H39's and H40's docs too. These points hold in all of them:
- **The outer ring is the "% damage by kind" lever** (tiers §6, H40). It adds no flat offense and no damage kind.
- **The second profession** gathers two new families: a **physical** one and a **magical** one. This doc calls them
  "the second profession's physical item" and "its magical item"; H42 names them and sets their grades (it
  recommends a short ladder, so no grade goes unused).
- **Ring gems are cut at the Lapidary** (a Craft Level `cut` job). Each takes **one item of the second profession's
  family of its kind's half**: the physical one for an Arms kind, the magical one for an element. Node 1's gem takes
  a middle grade of it and node 2's its top grade; H42's table maps them.
- **Weapon-art nodes and set steps cost second-profession items too** (H40's E4 and E9: one item per node learned,
  one per set step). H40's grades are placeholders; H42 maps them onto its ladder.
- **The Tier 2 workforce is the promoted Umas only:** twenty a Rift run, with no unlocks in later tiers (D5). Craft
  Level, every rank and Extra Stats start over in the new tier (D15, tiers §5).
- **H43 owns the Tier 2 foe budget.** Its on-curve Tier 2 Lv 50 Uma has G10 gear, the full inner map (30 active
  nodes), **one full ring specialty**, weapon arts and a set bonus at their top, and an advanced class.
- **No doc picks a save version number.** Tier 2 content takes the next version after classes v2's v24 when it's built.

## The doc to write

**`docs/design/extra-stats-tier2.md`**, titled **"Extra Stats in Tier 2: the outer ring"**. House style as
[tiers.md](../../design/tiers.md) and [rift.md](../../design/rift.md): a status line (`> **Proposal, <date>, for the
owner to decide; not built.**`, with bullets linking the sibling docs, "owner calls are marked **X1**, **X2**…", and
"numbers are drafts for the simulation"); short sentences; tables; each owner call inline as "**X1, …?**
Recommendation: …" with its reason; a final owner-calls table.

### Sections, in order

1. **What the owner asked for.** Quote tiers §1 and the §6 Extra Stats row, and C4 (the owner made Orbs flat). Invent
   no new asks.
2. **Today.** The map (80 moons, 16 bridges, 4 Sun nodes; points worth the grade; 5 + ⌊level/2⌋ active, changed
   freely outside fights; D119's order), the 100 Star Gems and the Lapidary, flat Orbs after v14, and what promotion
   does to it all. A short table of the code above.
3. **The ring's shape (X1, X2, X6).** Twenty nodes: each of the ten kinds has a pair, opened by a grade-5 gem and then
   a grade-10 gem; the second needs the first, as D119's order rule. One table: kind, node, grade, gem. Where it sits
   on the Observatory map: an outer orbit, the five Arms kinds on the ATK side and the five elements on the M.ATK side
   (they're neighbours in `RING`). No other gate: no inner node has to be open first. Tier 2 worlds and later only;
   the Tier 1 world's Observatory and Lapidary don't show it. Propose ids (draft: nodes `ring:<kind>:1|2`, gems
   `gem-ring-<kind>-5|10`) that `isStarNode` and `isGemId` can tell from today's.
4. **What a node gives (X3).** **+% damage on her hits of its kind**, as tiers §6 approved and H40's lever table
   assumes. Draft: node 1 **+8%**, node 2 **+12%**, a full pair **+20%**. Say where it applies in `battleDamage`
   (after the offense formula, so it multiplies only that kind's hits) and whether it reaches inherited Limit Break
   hits of its kind (recommend yes: Extra Stats apply to every hit). Say why not flat: a flat ring would do the Orb's
   job twice, and the owner made Orbs flat (C4) to keep the flat lever readable. Show a worked example for an on-curve
   Tier 2 Lv 50 Brawler (lifetime 100, through `projectRpgStats`): a Katana hit with and without the pair.
5. **One specialty (X4).** The ring has its own slot, apart from the planets' 5 + ⌊level/2⌋: **one kind at a time**,
   worth what she has opened of that kind's pair. Free to change outside a fight, like active nodes. Say why not
   shared slots: twenty ring nodes in thirty planet slots would add +20% to every kind.
6. **Orbs and the ring (X7).** She may specialize her Orb and her ring in the same kind. **The bound: together they add
   no more to that kind's hits than a G10 weapon's Might (+68 offense) would, at Tier 2 Lv 50.** Compute both: a G10
   Orb (+34 offense) is worth about +18% at Tier 1 Lv 50 (classes v2 §6.2) and less at lifetime 100; the pair adds
   +20%. It holds by the numbers (one slot, one Orb), with no cap rule to explain. A table of the combinations (same
   kind, two kinds, ring only) and what each adds.
7. **Tier 2 Star Gems (X5).** Twenty ring gems, cut at the Lapidary (Craft Lv 21 for grade 5, Lv 46 for grade 10), two
   gathers' time like every gem. Recipe draft: one second-profession item of the kind's half (node 1 a middle grade,
   node 2 its top grade, as H42 maps them), plus one D125 pair of refined Wilds items at the gem's grade, walking the
   four pairs so each Wilds family is used five times
   across the twenty gems (D86's symmetry test keeps passing). Names in today's pattern (the grade's stone and the
   kind, for example "Emerald of the Katana"). The cost of one specialty per Uma. Art: twenty gem icons appended to
   uma-art's gem sheet (a ChatGPT packet later); until then the cheapest stand-in, as D144 did.
8. **The inner map in Tier 2 (X8).** Unchanged: the same 100 gems, nodes and points. Show what Extra Stats are worth at
   Tier 2 Lv 50 (lifetime 100) next to Tier 1 Lv 50 (D142's table gives 20% of offense today); H43's budget absorbs
   the smaller share.
9. **Promotion and later tiers.** The ring empties with the map on promotion; ring gems stay in the old world's stock
   (tiers §5). Tier 3 keeps the ring. Class constellations are Tier 3's and get their own doc later: one line, no
   design.
10. **Screens.** The Observatory draws the ring in code (no new map art); the Set list includes ring gems; a specialty
    picker. The Lapidary gets a Ring tab beside Moons, Bridges and Sun. Targets plan ring gems only for her chosen
    specialty. The profile's Battle tab shows the specialty's offense with the Orb's. The "can upgrade" badge
    (classes v2 §7) counts a ring gem she can set.
11. **What it needs.** A build table, as rift §10: domain (`stars.ts`, `gems.ts`, `observatory.ts`, save parsing),
    a per-kind damage multiplier frozen into `BattleAlly` (land it in engine v15 with H39's and H40's changes; H40
    assumes v15), web (Observatory, Lapidary), the art packet, the simulation. Sizes S/M/L.
12. **Balance targets.** Drafts for `SIM=1`: at Tier 2 Lv 50 on curve, a full pair raises her own kind's hits by 20%
    and her whole-fight damage by 6–12% (not every hit is her kind); Orb plus ring on one kind never adds more than a
    G10 weapon's Might would; a party of specialists matched to the Tier 2 Iron and Arcane fronts wins stages at least
    10 points more often than the same party with no ring. Say which numbers the sim may move.
13. **Owner calls.** The table.

### Owner calls to raise (ids fixed; each with this recommendation)

| Call | Question | Recommendation |
|---|---|---|
| **X1** | The ring's name, and its nodes' | The doc offers two or three short names and picks one. Keep "constellation" free for Tier 3 |
| **X2** | A pair or a longer chain per kind? | A pair, as tiers §6 says: grades 5 and 10 |
| **X3** | What a node gives | +% damage on her hits of its kind, as tiers §6 says: +8% and +12%, a pair +20%. Not flat: that's the Orb's job (C4, H40) |
| **X4** | How many ring nodes count at once? | One specialty: one kind, in a slot of its own, apart from the planets' slots |
| **X5** | Tier 2 Star Gems | A new family of twenty ring gems at the Lapidary, from the second profession's item of the kind's half plus a pair of refined Wilds items |
| **X6** | Where and when it opens | An outer orbit, Arms by ATK and elements by M.ATK; Tier 2 and later; no gate but its own order |
| **X7** | Orb and ring on the same kind? | Yes: that's the specialization. Together they add no more to that kind than a G10 weapon's Might would |
| **X8** | Change the inner map in Tier 2? | No: same nodes, gems and points; the Tier 2 foe budget (H43) accounts for it |

### Out of scope

- Tier 3's class constellations (named only as later).
- Weapon arts and set bonuses (H40), advanced classes (H39).
- The second profession itself (H42) beyond the contract above; the Tier 2 foe budget (H43).
- Engine v14's Orb implementation (classes v2); art production; any code.

## Done when

- [ ] `docs/design/extra-stats-tier2.md` exists in the house style, with every section above and calls X1–X8, each
  with a recommendation and a reason.
- [ ] [tiers.md](../../design/tiers.md) §6 links it: one line under the Option A table, beside any line H42 or H43
  added.
- [ ] [open-questions.md](../../open-questions.md) has a new row for it: the next free Q number after fetching `main`
  (Q11 was the last used; numbers are never reused), listing X1–X8, linking the doc.
- [ ] No code changed. `pnpm lint && pnpm test` still pass.

## Deliver

- Fetch `main` first (H42 and H43 may land beside you), then commit to `main`:
  `docs(design): Extra Stats in Tier 2, the outer ring (H41)`. Check `git status` first: no original-game content.
- Docs-only pushes run no deploy (`deploy.yml` ignores `docs/**`).
- **Flag it done:** delete this packet and add a Done row to [docs/handoff/README.md](../README.md).
- The owner then decides the calls.
