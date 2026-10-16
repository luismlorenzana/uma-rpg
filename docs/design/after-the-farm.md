# After the farm: one profession, and Star Gems for Extra Stats

> **Status: built, 2026-10-16 (D144).** The owner approved every recommendation below and kept the names Wilds and
> Craft Level. §0 lists what the build added or settled; the rest is the proposal as approved. The farm is gone:
> Farm Level, ingredients, refining them, and dishes. uma-racer owns the farm now and reuses its buildings and art.

## 0. As built

- **Everything in §2–§8**, as written, on save v21 and with no farm id left in the code. The only mentions left are the
  migration tests' old-save fixtures, which have to spell the shape they migrate.
- **The Wilds map:** the Lapidary stands on the road between the Workbench and the Forge, and those two moved out to the
  row's ends (x 0.22 and 0.78). Placed higher, it cut a site's road to the trunk on some phone sizes.
- **The Forge's picker** is icons only (the owner, with D144): its 40 types in four rows of ten, physical then magical
  in each, then the grade chips and the picked piece's name, effect and recipe. It takes about a quarter of the height
  the labelled chips did. A type with no materials in stock is dimmed.
- **The Lapidary's picker** works the same way: Moons (eight planets × ten grades), Bridges and Sun tabs, a dot on gems
  the targets need, and the node a gem opens and what it gives.
- **Art:** Star Gems borrow the cut-crystal icons with a planet badge, and the Lapidary borrows the Arcane Armory's
  building. [H29](../handoff/tasks/H29-star-gem-and-lapidary-art.md) asks ChatGPT for their own art.
- **Splash cut-ins** hold about 1.5 s now (shipped first, separately).

## 1. What the farm does today

The game has two halves, mirrored site for site:

| | Farmlands (goes) | Wilds (stays) |
|---|---|---|
| Profession | **Farm Level** (`farming`) | **Craft Level** (`gathering`) |
| Sites | Fields, Orchard, Fishery, Herb Garden, Vegetable Garden, Mushroom Cave, Sugar Grove, Nut Grove | Monster Den, Ley Spring, Mine, Crystal Cavern, Quarry, Meadow, Forest, Fossil Dig |
| Families | Grains, Fruits, Fish, Herbs & Spices, Vegetables, Mushrooms, Sweets, Nuts & Seeds: 80 raw, 80 refined | Hides & Scales, Essences, Ores, Crystals, Stones, Fibers, Woods, Bones & Horns: 80 raw, 80 refined |
| Refining | Pantry | Workbench |
| Making | Kitchen: 100 dishes | Forge: 40 gear types × 10 grades |
| What it feeds | **Extra Stats**: eating a dish opens a node on her Observatory map | **Gear**: weapons, armor, accessories |
| Per Uma, maxed | 100 dishes from 232 refined items | 12 gear tracks from 240 refined items |
| Facility slots | 10 facilities, 2 / 3 / 3 slots by level: up to 30 | The same: up to 30 |

The owner called the Wilds side "the Mine". In the game it's the Wilds page, worked by Craft Level, and the Mine is one
of its eight sites (Ores). Those names stay (owner, 2026-10-16).

## 2. Extra Stats: keep them (recommended) or remove them

| | Keep them, fed from the Wilds | Remove them |
|---|---|---|
| Combat | Nothing to retune. Foes are budgeted for a party built on curve, Extra Stats included (D141–D143) | An on-curve Lv50 Uma loses 20% of her offense, a hit 28% smaller, plus her HP, defense and evasion points. Every foe's budget and the sims would be redone, right after D140–D143 |
| Builds | The Observatory stays the one build choice per Uma: which 5–30 of her 100 nodes are on | Gone. An Uma is her class, gear and skills |
| Saves | Every node already opened stays open. Only uneaten dishes go | Every opened node is lost |
| Work | Per Uma, the Wilds make about twice what they do today (472 refined items, not 240). That fits the owner's play, many Umas working at once, if the Wilds get more slots (§5) | Per Uma, half the work of today. The Wilds' current slots fit it |
| Code | Swaps dishes for gems: the map, nodes and points don't change | Deletes the Observatory, nodes, points and the targets' dish lines |

**Recommendation (approved): keep Extra Stats.** They're a fifth of a built Uma's power and the only build choice outside her class.
Combat balance assumes them, and nodes already opened survive. The farm's work moves to the Wilds instead of vanishing:
"shifting all the effort into the Mine".

## 3. Star Gems, cut at a new Wilds station: the Lapidary

Dishes become **Star Gems**, consumables cut at a new station so the Forge's picker doesn't grow. Setting a gem in a
node opens it, exactly as eating a dish did.

- **The Lapidary:** a station on the Wilds page, beside the Workbench and the Forge. It cuts Star Gems from refined
  Wilds items. Like the Forge, it's a Craft Level job: one gem takes two gathers' time (108 minutes at Lv1, 72 at Lv50),
  and grade g needs Craft Lv 5g − 4. It's upgraded with Stones and Woods, like every building.
- **The same 100 as the dishes:** 80 moon gems (eight stats × ten grades), 16 bridge gems (grades 3 and 7) and four Sun
  gems (grades 4, 6, 8, 10). Same nodes, gates and points, and the same order rule (D119): a gem waits until every lower
  node of its track is open.
- **Recipes, the dishes' recipes moved to the Wilds:** each stat already has a Wilds family (HP Hides & Scales, MP
  Essences, ATK Ores, M.ATK Crystals, DEF Stones, M.DEF Fibers, Speed Woods, Limit Bones & Horns). A moon gem takes one
  refined item of its stat's family at its grade, plus the same half-grade side items from grade 4 (one) and grade 8
  (two). A bridge gem takes one of each of its two families, plus a side at grade 7. A Sun gem takes one refined item of
  every family. That's 29 refined items of every family per Uma, so every Wilds site stays in equal demand (D86's
  symmetry test keeps checking it).
- **Names:** the grade's gemstone, from the Crystal Cavern's own ladder (Quartz, Amethyst, Citrine, Garnet, Emerald,
  Sapphire, Ruby, Diamond, Starstone, Philosopher's Stone), and the stat as a virtue:

  | Stat | HP | MP | ATK | M.ATK | DEF | M.DEF | Speed | Limit |
  |---|---|---|---|---|---|---|---|---|
  | Virtue | Vigor | Spirit | Strength | Sorcery | Fortitude | Resolve | Swiftness | Valor |

  - A moon gem: **Garnet of Strength**, which opens ATK moon 4 and is made from a Silver Ingot and a Cut Amethyst.
  - A bridge gem: **Citrine of Vigor & Fortitude**.
  - A Sun gem: **Garnet of the Sun**.
- **Icons, no new art:** the grade's cut crystal from the items atlas (Cut Garnet for grade 4), with a badge in its
  planet's Observatory colour (two colours for a bridge, gold for the Sun). The Warehouse and the lists already show
  the grade. Dedicated gem art can come later from uma-platform, if you want it.
- **The Observatory:** "Eat" becomes **Set**. The list shows the gems she can set now, and a locked node says which gem
  opens it and that the Lapidary cuts it.
- **Targets (D100):** the Lapidary lists a gem for each node a target hasn't opened, as the Kitchen listed dishes. The
  Workbench and sites list what those gems need.

**Recommendation (approved): build it as above.** It's the smallest change that keeps everything Extra Stats do. The map, the
points and the balance don't move, and the recipes are the dishes' structure on families that already exist.

## 4. One profession: Craft Level

- Every Uma has one profession level, **Craft Level**, 1–50 on today's curve. It runs every Wilds site, the Workbench,
  the Forge and the Lapidary. Farm Level is gone from the save, the profile, the roster's sorts and every page.
- **The carry-over:** each Uma's new Craft Level is the higher of her two levels today, with that level's EXP. An Uma who
  farmed for weeks can cut gems at the grade she reached. This is a one-line `max` in the migration, not a backup.
- **Why one level, not two:** the Wilds now make both halves of an Uma's power, so one level opens both. A Craft Lv46
  Uma makes grade-10 gear and grade-10 gems. Today that took two Lv46 specialists, one per profession.

## 5. More slots on the Wilds

Today the roster can work 60 slots at once, 30 a side. Without the farm, the Wilds alone give 33 (11 facilities, three
slots each at level 3), and they make both halves of every Uma's power.

| Facility level | Slots today | Proposed | Speed |
|---|---|---|---|
| 1 | 2 | **3** | ×1 |
| 2 | 3 | **4** | ×1 |
| 3 | 3 | **5** | ×1.25 |

- **The result:** 11 facilities give 33 slots at level 1 and 55 at level 3, close to today's 60, so the roster keeps
  working as many Umas at once.
- **Upgrades:** the same prices (150 Laurels and grade-2 refined items, then 500 and grade-5). A site took its own
  family and its farm mirror; now it takes its own family and its gear-recipe partner: Ores with Crystals, Woods with
  Essences, Hides & Scales with Bones & Horns, Stones with Fibers.
- **The map:** five pips fit under a building's name (22 px each, in the 128 px label).

**Recommendation (approved): 3 / 4 / 5 slots.** Without it, the work an Uma's power takes doubles on one half of the slots.

## 6. Everything else that changes

| Area | After |
|---|---|
| The Hub | Three pages: **Wilds**, Learning, Town. Wilds is the first. The Lapidary takes the Wilds map's middle row (§0) |
| The Warehouse | Shelves **Materials** (raw and refined), **Star Gems** and **Gear**, with the grade filter |
| The Exchange | Sells Wilds raw items only, by the same continent grades. Selling pays the same: a gem like a dish, 6 + 6g |
| The profile | Header and Work tab show Craft Level only. "Works fastest at" goes: aptitude hasn't set job speed since D139 |
| The Stable | The Farm Level sort and the grid's Farm badge go |
| Notifications | Unchanged: "Work done" covers the Lapidary |
| The halls, Armory and Jeweler | Unchanged. The two locked placeholders stay as they are |
| Combat | Unchanged. The damage-sources table, the world sim and the battle sheet read the same numbers |
| The pacing sim | Its capacity table shows the Wilds only |

## 7. The save

Save version 21, one migration. No backups beyond the copy the API already makes of the old document on every version
bump:
- **Dropped:** every farm item and every uneaten dish in stock; the farm facilities with their levels and jobs (those
  Umas become free); Farm Level.
- **Kept:** every opened node and active set; Wilds items, gear, Wilds facility levels and jobs; targets.
- **Craft Level:** the higher of her two levels (§4).
- **New:** an empty Star Gem shelf.

The migration names nothing from the farm. It keeps only ids the catalog still knows, and only places that are still
facilities. So no farm id is left in the code. The save parser is strict, so the migration also strips farm ids from job
inputs and queues. The API checks saves with the domain's own parser and deploys with the web, so both move to v21
together.

## 8. What leaves the code

Every reference goes, not only the screens: about 60 files.
- **Domain:**
  - **Items:** the eight farming families and their 160 items (catalog, identity snapshot), and the `side` field with
    its type.
  - **Dishes:** dishes and eating (`dishes.ts`, `dish-id.ts`, `kitchen.ts`). The map's own rules (nodes, ring, points,
    active slots) move to a stars module, and the web's `@rpg/domain/kitchen` entry becomes `observatory`.
  - **Jobs:** the farm, Pantry and Kitchen facility specs, the `cook` job kind, and the farm mirrors used for upgrades.
  - **Professions:** the `farming` profession and its labels, and the Stable's Farm Level sort.
  - **Places:** the farm sites and the Farmlands page in the place registry.
  - **Elsewhere:** farm lines in targets, the Exchange, selling, notifications and the pacing sim, and the farm columns
    of every generated doc block.
  - **Tests:** every test built on Fields, wheat or the Pantry moves to Wilds fixtures.
- **Web:**
  - **Hub:** the Farmlands page, with its palette, terrain props and fallback markers.
  - **Facilities:** the Kitchen's tabs and assign branches.
  - **Icons:** the dishes atlas import. Wilds icons keep their rows in the shared items atlas, which still holds the farm
    rows for uma-racer.
  - **Pages:** the Warehouse's Farm and Dishes shelves, the Exchange's Ingredients tab, the Observatory's eat flow, and
    Farm Level on the profile and in the Stable.
- **API:** only the push test, which uses a Fields job. The API has no item list of its own.
- **Docs:**
  - **The manual:** the farm sections of loops, materials, sections, architecture and dependencies.
  - **Live design pages:** pacing, items and gear-and-targets.
  - **Deleted:** the design pages `farm.md` and `kitchen.md`. Git keeps their history.
  - **History:** the slice specs and the decision log stay as written; the slices get a "superseded" line.
- **Stays in uma-art:** the farm buildings, dishes atlas and farm icons. uma-racer uses them, and this game stops loading
  them.
- **Stays, not the farm:** the targets feature (D100) and the capital Finals route "Kitchen Fire", which is a fight's
  flavor text.

## 9. The build

1. **Domain:** gems and the Lapidary, one profession, the slots, then delete the farm. The migration and its test come
   with it. Every test, the symmetry test included, passes on the Wilds alone.
2. **Web:** the three-page Hub, the Lapidary on the facility page (tabs Moons, Bridges, Sun, Can cut now), the
   Observatory's Set list, the Warehouse shelves, the profile and Stable.
3. **API** checks, then `pnpm docs:update`, the manual pages and a decision in the log.
4. **Checks:** `pnpm lint && pnpm test && pnpm build`. A grep finds no farm id, dish or Farm Level left. Then a local run
   from an old save: the migration, a gem cut and set, and the Observatory showing the node.
5. One commit to `main`, and the deploy is watched.
