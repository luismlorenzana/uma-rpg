# H78 — Save v28 (dark) and the compensation: work settled, Craft Levels to 1, the Speed Ticket grant, gear to grades, the new map, items to the 20 types, upgrades back

**uma-rpg · Claude · L · Needs: R1's H69, H74, H75, H76, H77 · Unblocks: H79, H80, H82**

## Why

R2's economy needs its save ([README](../../design/tier-rework/README.md) §9.3's R2 rows, §9.4;
[profession-progression.md](../../design/tier-rework/profession-progression.md) §14, D195):
- **every v28 row that isn't R1's:** gear becomes grades, gear ranks and Manuals go, Gear Marks become Class Marks, the
  Extra Stats map is rebuilt with fresh ids, Star Gems and crafted gear go, the Warehouse's 160 item ids become the 20
  Tier 1 types, facility levels drop with their Laurels and items back, and the places change;
- **the compensation, the owner's direction** ("reset all farm/craft levels to 1, and then grant all tickets based on
  the amount of time it took"): work is settled first, every Craft Level goes back to 1, and each world is paid **a Speed
  Ticket for every 30 minutes of work** its Umas' Craft EXP records, never less than the deleted pieces' own making time;
- **`TierWorld.grant`,** the record the first launch's sheet reads (H80).

This is the one irreversible step of the rework. It is written and tested here, **dark**: `toV28` is exported and not
chained, the strict parse reads v28's shape only when the economy stage is live, and H82 chains it with the flip, after
running it on a scratch copy of a full-shaped save.

## Context (read first)

- `CLAUDE.md`, `AGENTS.md`, **R2's build decisions** (H74's first D-row: points 4–9 bind this packet), the D-rows of
  H74–H77, and **R1's H69** (save v27's shape, `toV27`, `OwnedUma.calling`; `toV28` runs after it).
- The design, in this order: [profession-progression.md](../../design/tier-rework/profession-progression.md) **§14 in full**
  (§14.1 the design, §14.2 the Speed Ticket, **§14.3 the rule and its table**, **§14.4 everything else**, **§14.5 the worked
  examples**, §14.6 the sheet: H80's, **§14.7 the stock conversion**, §14.8), PP19, PP20, PP24, PP25;
  [README.md](../../design/tier-rework/README.md) §9.3 (its Release column) and §9.4;
  [weapon-progression.md](../../design/tier-rework/weapon-progression.md) §3.10 (promotion), §11 (WP27, as reworked);
  [extra-stats-progression.md](../../design/tier-rework/extra-stats-progression.md) §15 (EP21);
  [uma-templates.md](../../design/tier-rework/uma-templates.md) §9 (UT17: only the calling pick is stored).
- Decisions: D45 (the API refuses a client save older than it stores), D69 (`saveBackups/{uid}-v{n}`), D144 (v21 kept the
  higher of two professions), D152 and SC3 (v22 settled work), D180 (`toV25`: the model, written dark and chained by H61).
- **The code** (lines on `421eacd`; R1's H69 moves `save.ts` and `migrations.ts`):
  - `save/migrations.ts`: 1–5 imports (live economy modules: toV22 already imports pacing's curve); 203–217
    `migrateWorld`; 225–231 `toV26`; **311–336 `toV25`** (literals, frozen history, idempotent, malformed left to the
    parse); **375–401 `toV22`** (every started job finishes into its shelf and pays its Craft EXP, queues drop); 405–438
    `toV21` (reads the legacy `isItemId` and `facilitySpec`: they stay legacy, R2's build decision 4).
  - `save/save.ts`: 46 `SAVE_SCHEMA_VERSION`; 59–71 `Wallet`; 84–104 `OwnedUma`; 128–155 `TierWorld`; 218–243
    `newWallet`, `newOwnedUma`, `newTierWorld`, `newSave`; 286–315 `parseWallet`, `parseCraft`, `parseItems`; 332–343
    `madeBy`, `parseRequest`; 352 `kindAt`; 418–457 `parseBuildings`, `parseWork`; 466–522 `parseStars`, `parseUmaGear`,
    `parseGearStock`, `parseGems`; 533–549 `parseRanks`; 610–633 `parseUmas`; **757–772 `parseTierWorld`** (the chain
    first, then the strict parse); 1069–1127 `schemaVersionOf`, `parseSave`, `parseSaveAsync`, `parseSaveChecked`.
  - `save/rules.ts` 70–80 `unlockUma`; `save/rift.ts` 519–570 `ascend` (v1 returns her bound gear to the old stock).
  - `economy/pacing.ts` 20–31 (`professionExpToNext` 1,425 + 15L, `grantProfessionExp`), 42–54 (`itemMinutes`), 65–73
    (`FACILITY_UPGRADE`: Lv 2 150 Laurels and one grade-2 refined item of each of the facility's two families; Lv 3 500
    and two grade-5 of each); `economy/jobs.ts` 20–33 (the legacy facilities' upgrade families); `items/identity.ts`
    (each legacy id's family and grade); `economy/gems.ts` 41–57 (each Star Gem's recipe), `economy/stars.ts` 60–65
    (`nodeGem`: the gem an open node took).
  - uma-work's `Entry` (uma-platform `packages/work/src/types.ts` 46–67: `outputs`, `exp` per item, `collected`).
  - The R2 shapes you parse: H74's `UmaGrades`, `newGrades`, `gearV1`, `gradesOf`; H75's slot rules; H76's `StarMap`,
    `MAP_NODES`, gates; H77's `isStockItemId`, `materialIdentity`, `PLACES_V3`, the v3 kinds.
  - `apps/api/src/save/firestore-save.repository.ts` 23–38: the first write of a newer version copies the stored save to
    `saveBackups/{uid}-v{stored}`. Nothing changes there.

## Decisions made

**Approved calls, exact values** (PP19, PP20, PP24, PP25; WP27 and EP21 as reworked; README §9.3's R2 rows):
- **Work is settled first, as save v22 did:** every started entry finishes into the Warehouse with its Craft EXP, so no
  minute is lost; queued entries drop (they had taken nothing); Repeat forgets.
- **The grant (PP24):** per Uma, **tickets = ⌈(E(L) + exp) ÷ 60⌉**, E(L) = 1,425 (L − 1) + 7.5 L (L − 1), `L` and `exp`
  her `craft` after the settle (her bank past Lv 50 counts). One ticket per 30 minutes of the manual's job time (2 Craft
  EXP a minute); a Craft Lv 50 Uma **1,470**. Computed per Uma, rounded up per Uma, **paid into her world's wallet**
  (`wallet.timeTickets`); every Uma the world holds counts. By level: Lv 1 **0**, 6 **123**, 11 **252**, 16 **387**, 21
  **528**, 26 **675**, 31 **829**, 36 **989**, 41 **1,155**, 46 **1,328**, 50 **1,470**.
- **Craft Levels to 1, 0 EXP**, every Uma in every world, after their EXP is read.
- **Gear and Star Gems are folded in, with a floor (PP20):** deleted crafted pieces (stock, bound, lockers; every Orb and
  support), Star Gems (stock and set) and the outputs of settled Forge and Lapidary entries are paid by the grant, which is
  **never less than their own making time** at Craft Lv 25's manual times (a gear piece about 203 minutes, a Star Gem
  about 221 on average); when that floor is higher, the difference is one more line, "Pieces whose makers have left this
  world".
- **Stock kept, converted one for one by family and grade band** (§14.7):

  | Legacy family (site) | Grades 1–5 → | Grades 6–10 → |
  |---|---|---|
  | Ores (Mine), Stones (Quarry) | `copper-ore` · `copper-ingot` | `iron-ore` · `iron-ingot` |
  | Woods (Forest) | `pine-log` · `pine-plank` | `cedar-log` · `cedar-plank` |
  | Fibers (Meadow) | `carrot` · `chopped-carrot` | `cabbage` · `shredded-cabbage` |
  | Essences (Ley Spring), Bones & Horns (Fossil Dig) | `carp` · `carp-fillet` | `sardine` · `sardine-fillet` |
  | Crystals (Crystal Cavern), Hides & Scales (Monster Den) | `quartz` · `cut-quartz` | `citrine` · `cut-citrine` |

  Raw stays raw, refined stays refined; every world alike (a Tier 2 world's old Gold Ore becomes Iron Ore).
- **Upgrades:** levels drop (places have none); **their Laurels back** (150 for level 2, 500 more for level 3: up to
  7,150 a world) **and their refined items** (up to 66), converted like stock.
- **Gear to grades:** every weapon kind, armor slot and her one accessory slot **at G0**. Weapon, Armor and Accessory
  Ranks and the gear Manuals deleted; **Gear Marks to Class Marks, one for one.**
- **Extra Stats:** `stars.unlocked` and `stars.active` → **`stars: { open: [], moons: [] }`** (fresh ids, H76); Star Gems
  deleted (EP21).
- **Places:** six ids kept (`mine`, `forest`, `monster-den`, `workbench`, `forge`, `lapidary`), five removed, four new
  (`fields`, `fishery`, `armorer`, `charm-shop`); `buildings` empty.
- **`TierWorld.grant`** (PP25): the grant's record for the first launch's sheet: tickets, the floor, each Uma's level,
  EXP and tickets, what was deleted and what came back, `seen`. A world with no Craft EXP and nothing deleted gets none.
- **The worked examples** (§14.5) are this packet's tests: a fresh player **720**; a mid player **13,482**; a fully built
  roster's Tier 1 world **63,800** and **7,150** Laurels; its Tier 2 world **16,580**; the floor example **32,533**
  (9,980 from the Umas, +22,553 for pieces whose makers left).
- **UT17:** only the calling pick is stored (R1's v27); the template, her family and her moon's values are derived.

**This packet's decisions:**
- **`toV28(world, tier)`** in `migrations.ts`, exported, **not chained**: `SAVE_SCHEMA_VERSION` stays 27 (26 if R1's H72
  hasn't landed) and `migrateWorld` doesn't call it; H82 chains it (`version < 28`) and bumps the version. **`migrateWorld`
  gains `tier`** (threaded from `parseTierWorld`, which has it): v28 doesn't read it, R3's `toV29` does (H87 asks for it).
- **Frozen history:** `toV28` never imports `save.ts`, the v3 catalogs or the live rules; it may read the frozen legacy
  catalogs (`items/identity.ts`, the legacy facilities' upgrade families, `economy/gems.ts` and `stars.ts`) and pacing's
  curve and `itemMinutes`, as `toV22` reads `grantProfessionExp`. The conversion table and every v28 id are literals.
- **Idempotent by shape:** a world already in v28's shape (no `gems`, a `grant` key) is returned as it is. A step that ran
  twice on items would be wrong, since 36 ids keep their name and change meaning (`iron-ore` is legacy Ores G3 and v3's
  Tier 1 high type). Anything malformed is left for the strict parse.
- **The steps, in §14's order:**
  1. **Settle work.** For every row and every started entry, its outputs from `collected` to the end are made now (v22's
     rule: no clock, so every load before the first v28 write computes the same grant): an `item` output of a gather or
     refine entry goes to `items` (legacy id); a craft entry's output (a gear piece) and a cut entry's (a Star Gem) count
     as deleted, their recipes joining the floor; each made item pays its `exp[i]` into her `craft` through
     `grantProfessionExp`. Queued requests drop with nothing to return; `work` becomes `{}`.
  2. **Read the EXP:** each Uma's tickets by PP24.
  3. **Count what goes:** gear pieces = the stock's counts + each Uma's locker (unique ids; `equipped` lies in it) + the
     settled craft outputs; Star Gems = the stock's counts + each Uma's `stars.unlocked` (an open node took one gem:
     `nodeGem(node)`) + the settled cut outputs; upgrades = Σ (level − 1) over `buildings`.
  4. **The floor:** minutes = `itemMinutes(25)` × (**4.5 × pieces** + Σ over the gems of **(2 + 1.25 × its refined
     inputs)**): a piece is two gathers, two refines and a craft of two gathers; a gem its cut of two gathers plus a gather
     and a refine an input. These are §14.4's 203 and about 221 minutes at Craft Lv 25. The floor in tickets is ⌈minutes ÷
     30⌉.
  5. **Pay:** the grant is the Umas' tickets summed, or the floor when higher; `wallet.timeTickets` += it.
  6. **Upgrades back:** each legacy facility at level 2 or 3 gives its Laurels (150, plus 500 at level 3) to
     `wallet.laurels` and its refined items (one grade-2 refined of each of its two families, plus two grade-5 of each at
     level 3, `FACILITY_UPGRADE`'s literals) to `items`, before the conversion.
  7. **Convert the stock** by the table; ids the legacy catalog doesn't know are left for the parse.
  8. **Each Uma:** `craft: { level: 1, exp: 0 }`; `gear: { weapons: {}, armor: {}, accessories: [{ grade: 0, family:
     null, form: 'base' }] }`; `stars: { open: [], moons: [] }`; `ranks: { classes }`; every other field (her level, EXP,
     class, classes, `calling`, bonds) as it was.
  9. **The world:** `wallet.classMarks += gearMarks`, `gearMarks` dropped; `gear` and `gems` dropped; `buildings: {}`;
     `targets`, `heroes`, `parties`, `rift` and `world` untouched (an open world-map or Rift fight keeps its frozen v15 or
     v16 input and replays on its engine).
  10. **`grant`:** `{ tickets, floor, umas: { [outfitId]: { level, exp, tickets } }, deleted: { gear, gems, upgrades },
      back: { laurels, items, stock }, seen: false }` (`level` her Craft Level before the reset, `exp` her bank past it,
      `back.items` the upgrades' refined items, `back.stock` the Warehouse's count after the conversion), or `null` when
      the world had no Craft EXP, no deleted piece or gem and no upgrade.
- **The accessory slot's family is `null`** at the migration (R2's build decision 8): a migration never reads master
  data, and a G0 slot does nothing; the Gear tab's standard preset (H75, H79) dresses it in one tap.
- **The types** (R2's build decision 7): `TierWorld.gear?`, `TierWorld.gems?` and `Wallet.gearMarks?` (v27 only),
  `TierWorld.grant?: TierGrant | null` (always present in v28), `TierGrant` as above; every v1 reader of the three narrows
  through a helper. H74's and H76's unions stay.
- **The strict parse, by the stage:** `parseTierWorld` reads **v28's shape when `rpgRework('economy')`** (the live
  default), v27's otherwise. v28 is v27's parse (H69: three weapons, branch picks, `calling`) with these changes:
  - the world's keys: `createdAt, wallet, umas, parties, world, items, buildings, work, targets, heroes, rift, grant`;
    the wallet's without `gearMarks`;
  - `items`: `isStockItemId` (H77); no material of a tier above the world's; no made item that isn't live (the Branch
    Gem until R3);
  - `buildings`: `{}` only;
  - `work`: rows on `PLACES_V3`, slot below 4, each entry's request planned by its place's v3 kind (`craft` a made item of
    the place's lines, `cut` a jewel, `gather` a raw material of its line, `refine` a refined one);
  - each Uma's `gear`: `UmaGrades`, every grade 0–10 and **at most the one her level allows** (5g − 4 ≤ her level), weapon
    keys weapons, armor keys slots; exactly `accessorySlotCount(tier)` slots, each `{ grade, family: null | one of four,
    form: 'base', kind? }` (a kind for an Orb or a Bell, one of the ten; none otherwise);
  - each Uma's `stars`: `StarMap`, `open` map ids only, each body in order, each node at or under her level's gate,
    `moons: []`; `ranks`: `{ classes }`; `craft` as today;
  - `grant`: `null` or the record, every count a whole number ≥ 0, `umas` keyed by outfit ids (not required to be owned:
    an Uma may leave the world later).
- **New saves by the stage:** `newOwnedUma`, `newTierWorld` and so `newSave` make v28's shape when the stage is live
  (grades from `newGrades`, an empty `StarMap`, ranks without gear tracks, no `gearMarks`, `grant: null`); v27's
  otherwise. `unlockUma` writes no armor kinds in v28 (the half is her class's, H74).
- **Promotion with grades** (R2's build decision 9; WP §3.10, GE14): `ascend`'s v28 branch returns to the old world's
  `items` the made items her grades used (for each weapon kind and armor slot at grade g: the line's G1 … Gg item; for
  her accessory slot: Accessory Settings G1 … Gg); her open jewels don't return; the new world's Uma is fresh (G0, an empty
  map) and keeps her accessory slot's family and kind (the forms stay known, WP §5.3).
- **`markGrantSeen(save, tier, now)`** (`save/rules.ts`): `seen: true` on that world's grant, for H80's sheet.
- **The API:** unchanged. At H82 the owner's first v28 write copies the stored v27 to `saveBackups/{uid}-v27`.

## Do

1. **`save/migrations.ts`:** `toV28(world, tier)` with a doc comment listing the ten steps (D…, "chained by H82"); thread
   `tier` through `migrateWorld` (`parseTierWorld` passes `Number(key)`; `parseSaveAsync` too).
2. **`save/save.ts`:** the types, `TierGrant`, the v28 parse branch, the v28 `newOwnedUma`/`newTierWorld`; narrow the v1
   readers of `world.gear`, `world.gems`, `wallet.gearMarks` (domain and web). **`save/rules.ts`:** `unlockUma`'s v28 path,
   `markGrantSeen`. **`save/rift.ts`:** `ascend`'s v28 branch.
3. **Fixtures:** `save/v27.fixture.ts` (if R1's H69 left none, build one): a rich v27 world, and the four §14.5 worlds as
   builders (`freshPlayer()`, `midPlayer()`, `fullRoster()`, `fullRosterTier2()`, `floorWorld()`), invented outfit ids.
4. **Tests:**
   - `save/grant.test.ts`: the tickets table at every level above; **the fresh player** (5 Umas at Craft Lv 6 with 8,640
     EXP each: 144 each, **720**); **the mid player** (8 at Lv 36 each with a running entry whose settle pays +50 EXP: 990
     each; 6 at Lv 26: 675; 6 at Lv 11: 252; **13,482**), with **7 facilities at level 2 and 4 at level 3: 3,650 Laurels and
     38 refined items** (§14.5 says "8 at level 2, 4 at level 3: 3,800 Laurels, 40 items", which needs twelve facilities of
     eleven; the test uses eleven and says so); **the fully built roster's Tier 1 world** (40 at Lv 50, 10 with 30,000
     banked: **63,800**; 11 facilities at level 3: **7,150 Laurels, 66 refined items**; 25 Umas with 120 bound pieces and
     100 open nodes each, 2,400 pieces in stock); **its Tier 2 world** (20 at Lv 31: **16,580**; 6 facilities at level 2:
     900 Laurels, 12 items); **the floor** (20 Umas at Lv 20, no bank: 499 each, 9,980; 4,800 pieces in stock, no open
     nodes: the floor ⌈4,800 × 4.5 × itemMinutes(25) ÷ 30⌉ = **32,533** is paid, the extra line **22,553**). Where §14.5
     gives a floor from the 221-minute average gem, assert it doesn't bind and record the exact value the recipes give in
     the test's name and your delivery.
   - `save/migrations-v28.test.ts`: the settle (a gather entry's uncollected items reach the converted stock; a craft
     entry's pieces count as deleted and add to the floor; a cut entry's gems the same; a queued request leaves no trace;
     each made item's EXP reaches her tickets); **the conversion** for every legacy family and band, collisions summed
     (legacy `iron-ore`, Ores G3, and `copper-ore` both become `copper-ore`; legacy `gold-ore`, G6, becomes `iron-ore`;
     `limestone-block` becomes `copper-ingot`); upgrades back before the conversion; each Uma reshaped (G0 grades, one slot
     with `family: null`, an empty map, ranks with only classes, Craft Lv 1, her calling and classes untouched); Gear Marks
     added to Class Marks; `gear`, `gems`, `buildings`, `work` gone or empty; the open world-map and Rift fights
     byte-identical; `grant` as specified, and `null` for an empty world; **`toV28` twice equals once**; `tier` reaches it.
   - `save/save-v28.test.ts` (the switch mocked to 17 with `capsAt`): the rich v27 world through `toV28` parses and its
     open v16 fight replays (a v15 one if R1's fixture has none); the same world unmigrated fails v28's parse; a Tier 2
     type in a Tier 1 world, a grade above her level's, a non-empty `buildings`, a `branch-gem` and a map node out of
     order are each refused; `newSave` is v28-shaped and round-trips through `parseSave`; unmocked, today's saves parse and
     round-trip unchanged.
   - `save/ascend-v3.test.ts` (added cases): an Uma with Greatsword G7, five armor slots at G5 and her slot at G3 ascends:
     the old world gains `weapon-gem-g1`–`g7`, five each of `armor-fittings-g1`–`g5` and `accessory-setting-g1`–`g3`, no
     jewels; her new world's Uma is at G0 with her slot's family and kind.
   - Every existing test passes unchanged; the replay tests stay green.
5. **Docs:** implementation.md §3: "Built: H78 (D…)". `pnpm docs:update`: no diff.
6. **Check it locally** (your own ports, 390×844, desktop browser): the game plays as before on a scratch v27 save. Then,
   without committing anything, run `toV28` from the CJS build over a copy of that save and print each world's grant; say
   what it showed.
7. **D-row:** fetch `main` first; log this packet's decisions (the steps' order, the floor's formula, idempotence by shape,
   `tier` in the chain, the null family, the eleven-facility example).

## Done when

- [ ] `pnpm lint && pnpm test && pnpm build` pass; say the main JS number.
- [ ] The tests in step 4 pass, every §14.5 number included; the replay tests pass live and mocked to 17.
- [ ] `SAVE_SCHEMA_VERSION` is unchanged and `migrateWorld` doesn't call `toV28` (H82 does both).
- [ ] `docs/game/` is unchanged, `pnpm docs:update` leaves no diff, the D-row is logged, implementation.md has its line.
- [ ] The local check in step 6 was done and described. Nothing from the original games in git.
- [ ] Deployed green and https://uma-rpg.web.app/api/health shows the commit.

## Deliver

- **Claude, as a delegated worker:** a pull request from `feat/h78-save-v28-compensation` with one commit,
  `feat(domain): save v28 and the Speed Ticket grant, dark (H78)`; the body lists the ten steps and the §14.5 numbers the
  tests assert. Fetch `main` before you push. The main session reviews and merges it, then watches the deploy.
- **Flag it done:** after the merge, a `docs(handoff): H78 done (D…)` commit deletes this file, sets H78 to Done with a
  Done row, and sets H79 and H80 to Ready if their other needs are done (H73, R1's H70).
