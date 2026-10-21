# H42 — Doc: the second profession

**uma-rpg · Claude · M · Needs: nothing · Unblocks: Tier 2 content (built after the doc is approved)**

## Why

D159 answered Q7: **Tier 2 brings a second profession vertical** next to Craft Level, "with its own families feeding
the weapon arts and set bonuses" ([tiers](../../design/tiers.md) §6, Option A's Professions row). The outer ring's
Star Gems need its items too (H41). Nothing designs it yet: what it gathers and makes, where it stands on the Hub, its
level curve, and how it runs on the shared work engine. D144 removed the farm because a second mirrored half was
unviable and unfun, so this one has to stay lean. This packet asks for that design doc. It doesn't build anything.

## Context (read first)

- **House rules:** `CLAUDE.md`, `AGENTS.md`, [change-protocol.md](../../change-protocol.md) (anything uma-kit draws,
  the bottom bar included, changes in uma-platform as a "Both apps:" request). Original-game content never goes in git.
- **The approved designs:**
  - [tiers.md](../../design/tiers.md): §3 (each world has its own Wilds, buildings, work and stock), §5 (promotion:
    work must be free; the new world starts with level-1 buildings and an empty Warehouse), §6 (the Professions row),
    T5 (the Ascension purse).
  - [after-the-farm.md](../../design/after-the-farm.md), all of it, and D144 in [decisions.md](../../decisions.md):
    why the farm went (the owner: keeping a Farm and a Mine was "unviable and unfun"), one profession, Star Gems at the
    Lapidary, 3 / 4 / 5 slots.
  - [game-design.md](../../design/game-design.md) §8 (gather → refine → make, parity, equal time) and D96, D101, D139
    (the curve and speeds).
  - D152 (work on uma-work, save v22) and D157 (the kit's shared work screens).
  - D5 (later tiers have no unlocks) and D15 (profession levels start over in the new tier).
- **The manual as built:** [loops.md](../../game/loops.md) "Craft Level" (gates, speeds, EXP, queues, targets,
  upgrades); [materials.md](../../game/materials.md) (the eight families, D86's symmetry, D125's recipe pairs);
  [sections.md](../../game/sections.md) "The Hub" and "Facilities" (four pages; the Wilds' eleven facilities).
- **The code:**
  - `packages/domain/src/economy/pacing.ts`: `CRAFT_LABEL`, `professionExpToNext = 1,425 + 15 × level`,
    `grantProfessionExp`, `itemMinutes` (54 → 36 min), `makeMinutes` (×2), `FACILITY_SLOTS`, `FACILITY_UPGRADE`;
  - `economy/jobs.ts`: `JobKind`, `FACILITIES`, the upgrade partners;
  - `items/catalog.ts` (`FAMILY_SPECS`: ids match uma-art's icon atlas) and `items/kinds.ts`;
  - `work/env.ts` (`RPG_WORK_ENV`) and `work/kinds/*.ts` (each kind reads `craftLevel` for its speed and calls
    `env.exp.gradeOpen`);
  - `hub/places.ts`: `HUB_PAGES` (four), `WILDS_LAYOUT` (eight sites in two columns, then Workbench · Lapidary · Forge
    across the middle row), `PLACES` (one list for every tier today);
  - `save/save.ts` (`OwnedUma.craft`), `save/exchange.ts` (`stockedGrades`);
  - web: `apps/web/src/places/work/FacilityPage.tsx` (passes `words={{ workLevel: CRAFT_LABEL, workLevelLabel: 'Craft
    Lv {level}' }}` to the kit) and `album/rows.ts` (sets each picker row's `workLevel`).
- **uma-work** (uma-platform `packages/work/`, README "What the game supplies"; `src/kinds.ts`, `src/collect.ts`):
  - `ExpRules.gradeOpen(state, outfitId, kind, grade)` receives the kind;
  - `ExpRules.grant(state, outfitId, exp, now)` doesn't. But `payWork` calls it **before** it rewrites her row, so
    `state.work[outfitId]` still holds her slot (`slot.building`) and her entries' requests. One Uma works in one
    place, so one collect is one facility's EXP. The adapter can route on that with no package change.
- **The sibling packets,** written for docs in parallel: [H39](H39-doc-tier2-classes.md) (advanced classes),
  [H40](H40-doc-weapon-arts.md) (weapon arts and armor sets, `docs/design/weapon-arts.md`), and
  [H41](H41-doc-outer-ring.md) and [H43](H43-doc-tier2-world.md) below. **H40 writes a demand table** (items per art
  node and per set step, per Uma and for a twenty-Uma run) and says "the second vertical's own doc sizes its output
  against it". If H40's doc exists when you start, use its table; otherwise use its packet's placeholders: art nodes at
  Weapon Rank 4 (the core) and 8 (the fork's two sides), each learned once per Uma for one item (E2, E4); set steps
  at the suit's lowest grade 4, 7 and 10, each activated once per Uma for one item (E8, E9).

### Fixed across H41, H42 and H43 (don't re-decide)

Link the sibling docs by path (`docs/design/extra-stats-tier2.md`, `weapon-arts.md`, `tier2-classes.md`,
`tier2-world.md`). These points hold in all of them:
- **Two new families, one per half:** a **physical** one (it feeds Arms things) and a **magical** one (Tome and
  element things). You name them and set their grades.
- **Ring gems are cut at the Lapidary** (Craft Level). Each takes one item of the second profession's family of its
  kind's half: node 1's gem a middle grade, node 2's the top grade. Your table maps them (H41).
- **Weapon-art nodes and set steps cost one item each** (H40's E4 and E9). H40's grades are placeholders: map them
  onto your ladder.
- **The Tier 2 workforce is the promoted Umas only:** twenty a Rift run, no unlocks (D5). Craft Level and every rank
  start over in the new tier (D15, tiers §5). The new profession exists in Tier 2 worlds and later only.
- **H43 owns the Tier 2 world's economy** (rewards, the first week, the purse). **No doc picks a save version number.**

## The doc to write

**`docs/design/second-profession.md`**, titled **"The second profession"**. House style as
[tiers.md](../../design/tiers.md) and [rift.md](../../design/rift.md): a status line (`> **Proposal, <date>, for the
owner to decide; not built.**`, with bullets linking the sibling docs, "owner calls are marked **V1**, **V2**…", and
"numbers are drafts for the pacing simulation"); short sentences; tables; each owner call inline as "**V1, …?**
Recommendation: …" with its reason; a final owner-calls table.

### Sections, in order

1. **What the owner asked for.** Q7 as D159 answered it, tiers §6's Professions row, and D144's reason for removing
   the farm. Invent no new asks.
2. **Today.** Craft Level (one profession, its curve, gates, speeds, EXP per minute), the Wilds' eleven facilities at
   3 / 4 / 5 slots, the chain (gather → refine → craft or cut), uma-work's kinds and hooks, the kit's work screens,
   and the four-page Hub. **The Tier 2 facts:** twenty workers a run, all starting at Craft Lv 1 with Training gear;
   eleven Wilds facilities hold 33 slots at level 1, so slots aren't the limit there, workers are.
3. **Lessons from the farm.** A short list of rules this design keeps: no mirrored second half of eight sites; no
   consumable eaten in a loop; no cooking-style daily chore; no new Hub page; one curve and one gate rule to learn;
   every product opens something permanent (an art node, a set step, a ring gem); every grade it gathers is used.
4. **The profession (V1, V6).** Its name and save key (beside `craft` on `OwnedUma`). Its level, 1–50, starting at 1
   in every Tier 2+ world (D15). Gates, speeds and EXP: the same minutes as Craft by its own level (gather 54 → 36,
   make twice that) and 2 EXP a minute. **The curve, draft: a quarter of Craft's EXP a level**
   (`(1,425 + 15 × level) ÷ 4`), since its work per Uma is a small fraction of Craft's (§9). A table: level, EXP to
   next, hours of work, grade opened.
5. **What it gathers (V2).** Two families, **five grades each, raw only, no refining** (draft gates: its Lv 1, 11, 21,
   31, 41). Ten items. Draft names and ids that collide with none of the 160 Wilds items (`Runestone` is a Stones item;
   avoid farm and cooking words). Say why five, not ten: its consumers have few steps (H40's 4 / 8 and 4 / 7 / 10, the
   ring's two nodes), so ten grades would leave dead ones.
6. **What it makes (V5).** At its one station, in a making job (twice a gather's time):
   - **for weapon arts:** one item per art node learned, by half (physical for the five Arms, magical for the five
     Tomes) and by node gate;
   - **for set bonuses:** one item per set step, by half and step;
   - **for the ring:** nothing made: the raw items go to the Lapidary (H41).

   A table: product, id draft, grade, recipe (its own raw items plus one D125 pair of refined Wilds items, so D86's
   symmetry test still passes), and which consumer and grade it serves (the mapping H40 and H41 use). Keep the new
   item types to about twenty in all (ten raw, about ten made).
7. **Facilities and the Hub (V3, V4, V8).** **Two gathering sites and one station**, on the **Wilds page** of Tier 2+
   worlds only, as a **second trio row** (site · station · site) like the Workbench · Lapidary · Forge row. Give the
   six-row layout as `WILDS_LAYOUT` fractions and show the arithmetic that names, five pips (22 px each) and 48 px
   buildings clear each other at 375×667 and 390×844. No fifth page: the bottom bar's five slots are the four pages
   and Menu (D147, D149), and a new page is a kit change for both apps. If the row can't fit, say so and recommend the
   Battle page's free space instead. Slots 3 / 4 / 5 like every facility. Upgrades: a site takes its own family and
   the other new family; the station takes Stones and Woods like every building; draft grades and Laurels. Note that
   `PLACES` becomes per tier (H35 brings the active tier).
8. **On uma-work and the kit's screens.** Decided, not an owner call:
   - its own kind ids (a gathering kind and a making kind), not `gather` or `craft`, so `gradeOpen` routes on `kind`;
   - `grant` routes on her row's building, read before `payWork` rewrites it (see Context). Name the test that pins
     it. Only if that read proves fragile, write the uma-work change as a "Both apps:" request (`grant` receives the
     building) instead;
   - each kind reads its own level for speed, as `work/kinds/shared.ts` reads Craft Level;
   - the facility page passes its own level words and each picker row its own `workLevel`, so the kit needs no
     change; its station uses an icon grid like the Forge's and the Lapidary's (D144, D157).
9. **Pacing.** Per Uma, from H40's demand table and H41's ring (one specialty): the items, jobs and work-hours to
   finish her arts, her set steps and her ring gems. Set them beside Craft's per Uma: about **780 work-hours** (472
   gathers, 472 refines, 120 crafts, 100 cuts at Craft Lv 25's speed; recompute it). **Draft target: the second
   profession is under a tenth of Craft's work per Uma**, so a twenty-Uma run needs about four to six specialists at
   its top grade. Then the whole run: Craft plus the new work over twenty workers, in days. **The Exchange (V7)**
   sells its raw items like the Wilds' (continent n of a tier stocks its grade n), at a price from `rawItemPrice`.
10. **Save and screens.** The new level on `OwnedUma` (a Tier 1 world's Umas don't use it), the Warehouse shelf for
    its items, the profile header and Work tab showing both levels in Tier 2+, the Stable's sort, targets (what a
    target's arts, set steps and specialty still need), and "Work done" notifications (unchanged).
11. **What it needs.** A build table, as rift §10: domain (items, kinds, env, places, save parse), web (facility pages,
    profile, Stable sort), art (ten raw and about ten made icons, two site buildings and one station building in
    uma-art, a ChatGPT packet later; until then the cheapest stand-in, as D144 did), the pacing simulation. Sizes
    S/M/L.
12. **Owner calls.** The table.

### Owner calls to raise (ids fixed; each with this recommendation)

| Call | Question | Recommendation |
|---|---|---|
| **V1** | Its name, and the level's label on a chip ("Craft Lv 12") | The doc offers two or three short names and picks one (for example Lore Level, save key `lore`) |
| **V2** | What it gathers | Two families, one per half, five grades each, raw only: ten items |
| **V3** | Its facilities | Two gathering sites and one station, in Tier 2 worlds and later only |
| **V4** | Where they stand | The Wilds page, as a second trio row. No new page |
| **V5** | What it makes | One item per weapon-art node (by half and gate) and one per set step (by half and step); the ring takes its raw items at the Lapidary |
| **V6** | Its curve | Craft's gates, speeds and EXP per minute, at a quarter of Craft's EXP a level |
| **V7** | Does the Exchange sell its raw items? | Yes, as the Wilds' items: continent n stocks grade n |
| **V8** | Upgrades | Sites take their own family and the other new family; the station takes Stones and Woods |

### Out of scope

- Weapon arts' and set bonuses' effects and gates (H40), the ring's design (H41), advanced classes (H39).
- The Tier 2 world's rewards, the first week and the purse (H43).
- Tier 3's professions ("its own doc", tiers §6).
- Art production; any code; any uma-work or uma-kit change, except naming one as a "Both apps:" request if §8 needs it.

## Done when

- [ ] `docs/design/second-profession.md` exists in the house style, with every section above and calls V1–V8, each
  with a recommendation and a reason.
- [ ] [tiers.md](../../design/tiers.md) §6 links it: one line under the Option A table, beside any line H40, H41 or
  H43 added.
- [ ] [open-questions.md](../../open-questions.md) has a new row for it: the next free Q number after fetching `main`
  (Q11 was the last used; numbers are never reused), listing V1–V8, linking the doc.
- [ ] No code changed. `pnpm lint && pnpm test` still pass.

## Deliver

- Fetch `main` first (the sibling docs may land beside you), then commit to `main`:
  `docs(design): the second profession (H42)`. Check `git status` first: no original-game content.
- Docs-only pushes run no deploy (`deploy.yml` ignores `docs/**`).
- **Flag it done:** delete this packet and add a Done row to [docs/handoff/README.md](../README.md).
- The owner then decides the calls.
