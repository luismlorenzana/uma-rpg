# H77 — Professions v3: ten places, the five lines for every tier, the ladder, every recipe and item id, jobs and gates, the trade, the open shop, the Exchange (dark)

**uma-rpg · Claude · L · Needs: H64 · Unblocks: H78, H80, H81; H74–H76 consume its ids. Runs beside H74 and R1's
waves 2–4**

## Why

R2 rebuilds the Wilds ([profession-progression.md](../../design/tier-rework/profession-progression.md), D195):
- **ten professions in ten existing buildings**, four slots each, ×1.25 from day 1, **no upgrades**: five gathering
  (Mining, Wood Chopping, Farming, Fishing, Hunting), one processing (Material Processing at the Workbench) and four making
  (Weapon, Armor, Accessory and Jewel Crafting at the Forge, the Armorer, the Charm Shop and the Lapidary);
- **five material lines, a pair a tier** (two types a gathering profession in Tier 1, four in Tier 2, six in Tier 3), all
  existing uma-art icons, and **the ladder** (a grade decides its material);
- **one fixed recipe an item** (Weapon Gem 4, Armor Fittings 2 or 3, Accessory Setting 12, Planet Jewel 12, Moon Jewel
  4), one gather's time a refined item;
- **one trade an Uma by her calling**, the open shop when a world lacks a trade, and the Exchange by pair.

This packet owns **every item id** R2 introduces (materials and made items) and every rule of work, dark behind the
economy stage. It needs only R1's switch (H64), so it runs beside R1's waves 2–4 and H74. Nothing changes on screen (H80
draws the places); the save's migration and parse are H78's.

## Context (read first)

- `CLAUDE.md`, `AGENTS.md`, **R2's build decisions** (H74's first D-row; if H74 hasn't landed, they are in
  [H74's packet](H74-engine-v17-gear-grades.md): points 4 to 8 bind this packet).
- The design: [profession-progression.md](../../design/tier-rework/profession-progression.md) **§0, §2 (PP1–PP3), §3
  (PP7–PP9: the catalog, the ladder), §4 (PP4–PP6, PP15–PP16: places, frames, who takes a slot), §5 (PP12–PP13), §6
  (PP10–PP11: every recipe), §7 (Tier 1 in full), §10 (PP17, the Exchange)**, §12–§13, §15, §16 (the calls; PP23
  promotion); [weapon-progression.md](../../design/tier-rework/weapon-progression.md) §6.1 (WP26: the four products);
  [extra-stats-progression.md](../../design/tier-rework/extra-stats-progression.md) §11 (EP17–EP18: the jewels);
  [uma-templates.md](../../design/tier-rework/uma-templates.md) §3.2 and UT19 (her calling names her trade, nothing else);
  [class-progression.md](../../design/tier-rework/class-progression.md) CP29–CP30 (the pick moves a Pace Uma's trade).
- **R1's work:** H64's `rpgRework`, `capsAt`; H67's `umaTemplate(outfit, pick)` and calling (the trade reads it, through
  the caller); H69's `OwnedUma.calling`. R1's build decision 4 leaves to R2 the pick's "refused while she works" rule.
- **The code** (lines on `421eacd`):
  - `items/identity.ts` (the legacy 160 ids, `isItemId`), `items/families.ts`, `items/catalog.ts` 1–46 (`ItemDef`,
    `ITEM_FAMILIES`, `itemById`, `gradeUnlockLevel`), `items/identity.test.ts` (the identity-vs-catalog check to copy).
  - `economy/jobs.ts` (all: `JobKind`, `FACILITIES`, `facilitySpec`, the upgrade families); `economy/pacing.ts` 9–73
    (`grantProfessionExp`, `EXP_PER_MINUTE` 2, `itemMinutes` 54 → 36, `refineMinutes`, `makeMinutes`, `REFINE_BATCHES`,
    `FACILITY_*`), 85–95 (`rawItemPrice`, ticket prices, `chapterGrades`).
  - `work/env.ts` (all: `RPG_BUILDINGS`, `RPG_WORK_ENV`), `work/kinds/*.ts` (`gather`, `refine`, `madeKind`, `craft`,
    `cut`, `shared`), `work/request.ts`.
  - `save/work.ts` (all: `env` at 30, `refusalText` 47–58, `requestFor` 66–70, `planJob` 100–116, the operations
    145–326, `facilityLevel`, `upgradeCost`, `upgradeFacility`).
  - `save/exchange.ts` 21–53 (`stockedGrades`: a continent's band by `stageBand`; `buyRawItem`; `buyTickets`), 137–163
    (Manuals: H74 retired the gear ones), 165–188 (`Shelf`, `sellPrice`, `sellStock`).
  - `hub/places.ts` 56–126 (`WILDS_LAYOUT`, `GATHER_SITES`, `sites`, `WILDS`), 145–165 (`learningPlaces(engine)`: the
    model for a list by generation), 167–214 (`TOWN`'s Warehouse and Exchange details, `PLACES`).
  - `save/rift.ts` 519–570 (`ascend`: materials stay in the old world's `items`; H78 returns her grades' items).
  - **uma-work** (uma-platform `packages/work/src`): `buildings.ts` 17–44 (`buildingTable`: one level is `slots: [4],
    speed: [1.25], upgrades: []`), `kinds.ts` 20–50 (`PlanContext`, `WorkKindRules`), `refusal.ts` (`refuse(code,
    message, data)`), `collect.ts` (`payItems`).
  - **uma-art** (uma-platform `packages/art/items/atlas.json`): every material id below exists today, the farm's
    `vegetables` and `fish` families included; uma-rpg's web reads positions by art family and grade
    (`apps/web/src/items/frames.ts` 27–47).

## Decisions made

**Approved calls, exact values:**
- **PP1:** gathering (Mining, Wood Chopping, Farming, Fishing, Hunting), processing (Material Processing) and making
  (Weapon, Armor, Accessory and Jewel Crafting). The engine's job kinds stay four: `gather`, `refine`, `craft` (the Forge,
  the Armorer and the Charm Shop) and `cut` (the Lapidary); the player reads gather, process, make.
- **PP2, PP3 · the trade:** her calling's gathering and crafting pair on one Craft Level, never her active class:
  **physical** (Brawler) **Mine · Forge**; **physical hybrid** (Spell Blade) **Forest · Armorer**; **healer** (Paladin,
  Cleric) **Fields · Workbench**; **magical hybrid** (Summoner) **Fishery · Charm Shop**; **magical** (Mage) **Monster Den
  · Lapidary**. The calling pick (CP29) moves a Pace Uma between Forest · Armorer and Monster Den · Lapidary.
- **PP4, PP5, PP6 · ten places,** one existing building each, **four slots, ×1.25 from day 1, no upgrades**, the same map
  in every tier, at today's ten side spots:

  | Place (id) | Profession | Frame | At |
  |---|---|---|---|
  | Mine (`mine`) | Mining | `mine` | 0.24, 0.10 |
  | Forge (`forge`) | Weapon Crafting | `forge` | 0.74, 0.12 |
  | Forest (`forest`) | Wood Chopping | `forest` | 0.20, 0.30 |
  | Armorer (`armorer`) | Armor Crafting | `lancers-barracks` | 0.76, 0.32 |
  | Fields (`fields`) | Farming | `vegetable-garden` | 0.22, 0.51 |
  | Workbench (`workbench`) | Material Processing | `workbench` | 0.78, 0.51 |
  | Fishery (`fishery`) | Fishing | `fishery` | 0.22, 0.71 |
  | Charm Shop (`charm-shop`) | Accessory Crafting | `arcane-armory` | 0.78, 0.70 |
  | Monster Den (`monster-den`) | Hunting | `monster-den` | 0.26, 0.90 |
  | Lapidary (`lapidary`) | Jewel Crafting | `lapidary` | 0.74, 0.90 |

  Removed: `ley-spring`, `crystal-cavern`, `quarry`, `meadow`, `fossil-dig` (their frames stay in uma-art, unused).
- **PP7, PP8 · the catalog** (ids are uma-art's; a line's Tier 1 pair is its family's grades 1 and 3, Tier 2's 6 and 8,
  Tier 3's 9 and 10):

  | Line (profession) | Tier | Low type: raw → refined | High type: raw → refined |
  |---|---|---|---|
  | Metal (Mining) | 1 | `copper-ore` → `copper-ingot` | `iron-ore` → `iron-ingot` |
  | | 2 | `gold-ore` → `gold-ingot` | `titanium-ore` → `titanium-ingot` |
  | | 3 | `mythril-ore` → `mythril-ingot` | `orichalcum-ore` → `orichalcum-ingot` |
  | Wood (Wood Chopping) | 1 | `pine-log` → `pine-plank` | `cedar-log` → `cedar-plank` |
  | | 2 | `cherry-log` → `cherry-plank` | `ebony-log` → `ebony-plank` |
  | | 3 | `elderwood-log` → `elderwood-plank` | `yggdrasil-branch` → `yggdrasil-plank` |
  | Vegetables (Farming) | 1 | `carrot` → `chopped-carrot` | `cabbage` → `shredded-cabbage` |
  | | 2 | `bell-pepper` → `sliced-bell-pepper` | `asparagus` → `trimmed-asparagus` |
  | | 3 | `golden-carrot` → `golden-carrot-puree` | `emperor-pumpkin` → `pumpkin-puree` |
  | Fish (Fishing) | 1 | `carp` → `carp-fillet` | `sardine` → `sardine-fillet` |
  | | 2 | `sea-bream` → `sea-bream-fillet` | `tuna` → `tuna-fillet` |
  | | 3 | `silverfin` → `silverfin-fillet` | `rainbow-koi` → `rainbow-koi-fillet` |
  | Stone (Hunting) | 1 | `quartz` → `cut-quartz` | `citrine` → `cut-citrine` |
  | | 2 | `sapphire` → `cut-sapphire` | `diamond` → `cut-diamond` |
  | | 3 | `starstone` → `cut-starstone` | `philosophers-stone` → `cut-philosophers-stone` |

  Names are uma-art's ("Copper Ore", "Golden Carrot Purée", "Philosopher's Stone"). A world holds every tier's types up
  to its own: 20 ids in Tier 1, 40 in Tier 2, 60 in Tier 3.
- **PP9 · the ladder:** Tier 1 grades 1–5 take a line's low type, 6–10 its high type. **Tier 2:** G5 and G10 take Tier 2's
  pair. **Tier 3:** G4 and G9 Tier 2's, G5 and G10 Tier 3's. Amounts never change.
- **PP10, PP11 · recipes, the same amounts in every tier** (refined items; the ladder picks each type):
  - **Weapon Gem** (4): metal 2, wood 2 (low band Copper and Pine; high Iron and Cedar).
  - **Armor Fittings** (2 low, 3 high): low band vegetables 1, fish 1; high band metal 1, wood 1, stone 1.
  - **Accessory Setting** (12 ÷ the tier's accessory slots, half vegetables, half fish): **12 (6 + 6) in every tier
    while R2 gives every tier one slot**; R3 makes Tier 2's 6 and Tier 3's 4.
  - **Planet Jewel** I–V (12): stone 3, wood 3, vegetables 3, fish 3, by its grade (1, 3, 5, 7, 9).
  - **Moon Jewel** I–V (4): stone 3, metal 1, by its grade (2, 4, 6, 8, 10).
  - **Branch Gem** (4): the tier's G5 Weapon Gem (Tier 2: 2 Gold Ingot, 2 Cherry Plank; Tier 3: 2 Mythril Ingot, 2
    Elderwood Plank). **Defined here, made from R3** (R2's build decision 6): R2's Forges list Weapon Gems G1–G10.
  - **Process:** one raw item into its refined form.
  The tables are PP §6.2's, every row: build them from these rules and test them against the tables.
- **PP12 · make time:** **one gather's time a refined item in it**: a Weapon Gem or a Moon Jewel 4 gathers, Fittings 2 or
  3, a Setting 12, a Planet Jewel 12; processing a quarter of a gather, in batches ×1, 4, 8, 20, 40; gathering 54 → 36
  minutes by Craft Level, 1–10 items a job; **every job ×1.25** (real time ÷ 1.25); Craft EXP 2 a minute before the speed.
- **PP13 · gates:** a **low type at Craft Lv 1, a high type at Lv 26**, in every pair and tier; a made item of grade g at
  **Craft Lv 5g − 4** (a jewel's grade is its node's: Planet n 2n − 1, Moon n 2n); Craft Level restarts at Lv 1 each tier.
- **PP16 · the open shop:** a world with **no Uma of a trade** opens that trade's two places to every Uma for every job,
  until one arrives.
- **PP17 · the Exchange:** raw types only, by pair:

  | | Tier 1 | Tier 2 | Tier 3 |
  |---|---|---|---|
  | Base pair, low | after the tier's first win · 30 | first win · 60 | first win · 90 |
  | Base pair, high | after a win on continent 3 · 80 | continent 3 · 160 | continent 3 · 240 |
  | Tier 2's pair | — | low after continent 2 · 60; high after continent 4 · 160 | low after 2 · 90; high after 4 · 240 |
  | Tier 3's pair | — | — | low after continent 2 · 90; high after continent 4 · 240 |
  | Selling: raw low · high | 6 · 16 | 12 · 32 | 18 · 48 |
  | Selling: refined low · high | 12 · 32 | 24 · 64 | 36 · 96 |
  | Selling: made items | 6 + 6g | × 2 | × 3 |
  | Speed and Sweep Tickets | 10 and 15 Laurels, as today | the same | the same |

  "Continent n" is the n-th continent of the world's own tier (`stockedGrades`' reading of `stageBand`).
- **PP23 · promotion:** materials and made items stay in the old world (its own Warehouse); she arrives at Craft Lv 1
  with no secondary. (H78 returns the made items her grades used.)
- **WP26, EP17:** the products: Weapon Gem, Armor Fittings, Accessory Setting G1–G10, the Branch Gem, Planet and Moon
  Jewels I–V. **UT19:** her calling names her trade, nothing else.

**This packet's decisions:**
- **The legacy catalogs stay as they are** (R2's build decision 4): `items/identity.ts`, `families.ts`, `catalog.ts`,
  `economy/jobs.ts`, `work/env.ts` and `work/kinds/` run the live game and the migration chain (`toV21`'s `knownItems`
  and `facilitySpec`). Nothing in them is renamed. The v3 modules sit beside them, and the live selectors below pick by
  `rpgRework('economy')`.
- **The item id scheme** (fixed here; the other R2 packets consume it):
  - **Materials:** the sixty ids above, **uma-art's own**, no prefix (as today's items are). 36 of them are also legacy
    ids (Mining's, Wood Chopping's and Hunting's) with a different meaning (`iron-ore` is legacy Ores grade 3, v3's Tier 1
    high type): the two catalogs never answer for the same save (by the stage), and the migration converts by the
    legacy meaning (H78).
  - **Made items:** `items/made-id.ts`, exactly the block in H74's packet (`MADE_IDENTITIES`, `madeIdentity`, `isMadeId`,
    `gradeItem`, `jewelId`). **Create it if H74 hasn't merged;** if it has, keep H74's file.
  - **Professions:** `mining`, `wood-chopping`, `farming`, `fishing`, `hunting`, `processing`, `weapon-crafting`,
    `armor-crafting`, `accessory-crafting`, `jewel-crafting` (R3's H86 stores `OwnedUma.secondary` as one).
    **Trades:** `physical`, `physical-hybrid`, `healer`, `magical-hybrid`, `magical`. **Lines:** `metal`, `wood`,
    `vegetables`, `fish`, `stone`.
- **The v3 modules:**
  - `items/materials-id.ts` (id-only, main-bundle safe): `MATERIAL_IDENTITIES` (sixty `{ id, line, tier, band,
    refined, pair }`), `materialIdentity`, `isMaterialId`, `materialGateGrade(id)` (low 1, high 6: Craft Lv 1 and 26 by
    `gradeUnlockLevel`), `materialTypes(line, tier, band)`.
  - `items/materials.ts` (names and art): each id's name and **`art: { family, grade }`** (uma-art's family and grade:
    Mining `ores` 1, 3, 6, 8, 9, 10; Wood `woods`; Farming `vegetables`; Fishing `fish`; Hunting `crystals`), so the web
    finds each icon without a second table (H79, H80). A test compares it to the identity field for field, as
    `identity.test.ts` does.
  - `items/made.ts`: `madeName(id)` ("Weapon Gem G3", "Armor Fittings G3", "Accessory Setting G3", "Branch Gem",
    "Planet Jewel III", "Moon Jewel II"); `madePlace(line)`; **`ladderTier(grade, worldTier)`** and `band(grade)`;
    **`madeRecipe(id, worldTier, slots = accessorySlotCount(worldTier))`** → refined id → quantity; `madeRefined(id, …)`
    its total. Main-bundle safe: no names in the identity modules.
  - `economy/professions.ts` (main-bundle safe): `PROFESSIONS` (id, kind, place), `PLACES_V3` (id, profession, job kind,
    its line or made lines), `TRADES` (id, gathering profession, crafting profession), **`tradeOfCalling(calling:
    RpgClass)`**, `tradeProfessions(trade)`, `placeSpecV3(placeId)`; the live selector **`workPlace(placeId, engine)`**
    (v1's `facilitySpec` or v3's spec). R3's H86 adds the secondary beside the trade.
  - **Stock ids:** `isStockItemId(id, engine = BATTLE_ENGINE_VERSION)`: v1's `isItemId`, or a material or a made id (the
    Branch Gem only from `rpgRework('t2Weapons')`). H78's v28 parse uses it.
- **The places** (`hub/places.ts`): **`wildsPlaces(engine)`**, as `learningPlaces(engine)`: v1 today's eleven, byte for
  byte; v3 the ten above (`kind` `gather-site` for gathering, `station` for the rest; `slots: 4`; `frame` where it isn't
  the id; one-line blurbs such as "Mining: ores into ingots" and "Accessory Crafting: Accessory Settings"; short `details`).
  The Warehouse's and the Exchange's `details` by generation ("Materials and made items", "Raw materials by pair"). The
  live `PLACES` reads the live generation; a removed id has no place (H80 sends a stale link to the Wilds page).
- **The work env v3** (`work/env-v3.ts` and `work/kinds-v3/`; v1's untouched):
  - **`rpgWorkEnv(tier, context?)`**: the buildings (`slots: [4], speed: [1.25], upgrades: []` for the ten places), the
    four kinds planning by the world's `tier` (a `TierWorld` doesn't know its tier, so the env carries it), tickets,
    Craft EXP and money as v1's (no upgrade costs). **`liveWorkEnv(tier, context?)`** returns v1's `RPG_WORK_ENV` or v3's
    by `rpgRework('economy')`.
  - **gather:** a raw material of the place's line whose tier ≤ the world's; gate by its band; one gather's minutes at her
    Craft Level; pays into `items`.
  - **refine** (the Workbench): any refined material of the world's types, from its raw pair, a quarter of a gather,
    gated by its band as gathering is, `maxItems` 40.
  - **craft** (Forge, Armorer, Charm Shop) and **cut** (Lapidary): a live made item of the place's lines; inputs
    `madeRecipe(id, tier)`; minutes = `itemMinutes(level)` × its refined count; gate 5g − 4; **pays into `items`** with
    uma-work's `payItems` (made items live in the Warehouse, R2's build decision 5).
  - **The trade gate** in every v3 plan, from `context.tradeOf?: (outfitId) => TradeId | null` (the web builds it from
    `umaTemplate`'s calling, H80): her trade's two professions take any job of their places; any other place refuses with
    **`refuse('trade', 'Another trade')`**, **unless the open shop holds** (no owned Uma of the world has a trade with that
    place's profession, by `tradeOf`). Without `tradeOf` (or when it returns null) the gate is open: settles, queue starts
    already accepted and the API's parse can't read master data (R2's build decision 8). `refusalText` maps `'trade'`.
  - **`openShop(world, placeId, tradeOf)`** exported for the place header (H80: "Open shop: no Brawler in this world").
- **`save/work.ts`:** each function builds its env with `liveWorkEnv(Number(tier), context)` instead of the module
  constant; the player's operations (`startJob`, `queueJob`, `editWorkerQueue`, `repeatJob`, `restartStopped`,
  `checkRestartStopped`) and `planJob` take an optional last argument `context?: { tradeOf? }` (`planJob` also gains
  `tier`); collects, recalls, speed-ups and settles need none. `requestFor` reads `workPlace(placeId)`. **`upgradeCost`
  returns null and `upgradeFacility` refuses "Places have no levels" in v3.** v1 behaviour is today's.
- **The calling pick is refused while she works** (R1's build decision 4 and H67's note, PP2: the pick moves her trade):
  a `callingPickBlock(world, outfitId, now)` ("Finish her work first" while she has a started entry or a queue), called
  by R1's H69 `pickCalling(save, outfit, pick, now, tier)` **from the economy stage** (beside H67's
  `umaCallingPickBlock`); if `pickCalling` isn't merged when you land, H80 wires the call.
- **The Exchange v3** (`save/exchange.ts`, a v3 branch): **`stockedTypes(world, tier)`** (the raw ids it sells now, by
  the table above) and `rawPriceV3(id, tier)`; `buyRawItem` takes `stocked: readonly string[]` ids in v3 (the web passes
  `stockedTypes`; v1 keeps grades), refusing a type not stocked ("Not stocked yet"); `sellPrice` and `sellStock` v3 by the
  table (only the `items` shelf: materials and made items; `'gems'` and `'gear'` are v1's). Tickets unchanged.
- **Promotion** needs no code here: `ascend` leaves `items` in the old world and makes a fresh Uma (Craft Lv 1). A test
  pins it.
- **Not here:** the save's v28 parse and migration (H78), the targets planner (H79), the place pages, the Warehouse and
  the Exchange screens (H80), the profession pacing simulation (H81).
- **Main JS:** the id-only modules and `economy/professions.ts` are main-safe; names (`items/materials.ts`,
  `items/made.ts`) and the v3 kinds load with `save/work.ts`, which the entry keeps (H62): keep them small and say the
  number.

## Do

1. **`items/made-id.ts`** if absent; **`items/materials-id.ts`**, **`items/materials.ts`**, **`items/made.ts`**,
   **`economy/professions.ts`** as decided, with module comments citing PP1–PP13 and the ids' origin (uma-art).
2. **`hub/places.ts`:** `wildsPlaces(engine)`, the generation's Warehouse and Exchange details, the live `PLACES`.
3. **`work/env-v3.ts`, `work/kinds-v3/`:** the buildings, the four kinds, the trade gate, `openShop`, `liveWorkEnv`.
4. **`save/work.ts`:** the env per call and the optional context; `planJob(…, tier, context)`; v3's upgrade refusal;
   `refusalText` for `'trade'`.
5. **`save/exchange.ts`:** the v3 branch; **the calling pick's block** as decided.
6. **Tests** (v3 cases mock the switch to 17 with `capsAt`, in files of their own):
   - `items/materials.test.ts`: the sixty ids by line, tier, band and raw or refined exactly as the table; each art family
     and grade; the names catalog equals the identity field for field; `isMaterialId` refuses legacy-only ids (`tin-ore`,
     `limestone`).
   - `items/made.test.ts`: names, places and grades (jewels' 1, 3, 5, 7, 9 and 2 … 10; the Branch Gem 5); **`madeRecipe`
     for every made item in world Tiers 1–3 equals PP §6.2's tables** (Weapon Gem, Armor Fittings, Accessory Setting at 1
     slot: 6 + 6 in every tier, and at 2 and 3 slots: 3 + 3, 2 + 2; Planet Jewel; Moon Jewel; the Branch Gem in Tiers 2
     and 3); **one Uma's Tier 1 demand** (three weapons, five armor slots, one accessory slot G1–G10, Planet Jewels I–V,
     Moon Jewels I–V on three moons) is **110 pieces and 485 refined**: Copper Ingot 36, Iron Ingot 64, Pine Plank 39,
     Cedar Plank 61, Chopped Carrot 64, Shredded Cabbage 36, Carp Fillet 64, Sardine Fillet 36, Cut Quartz 27, Cut Citrine
     58; with her moon's Moon Jewels II and IV, **493** (Copper 37, Iron 65, Quartz 30, Citrine 61); the Forge 120, the
     Armorer 125, the Charm Shop 120, the Lapidary 120.
   - `economy/professions.test.ts`: ten professions, kinds and places; `tradeOfCalling` for all six classes; each trade's
     two places.
   - `hub/places-v3.test.ts`: v1's Wilds byte for byte (the eleven, `[4, 6, 2, 11]`-style counts as `places.test.ts`
     has them); v3's ten at the table's spots and frames, four slots each, every one on the Wilds page, the five removed
     ids absent; the other pages unchanged.
   - `work/kinds-v3.test.ts`: a Craft Lv 1 Uma gathers `copper-ore` at the Mine in 2,592 seconds an item (54 minutes ÷
     1.25) for 108 Craft EXP, `iron-ore` is "Needs Craft Lv26" until Lv 26, `carrot` there is "That isn't made here",
     `gold-ore` is refused in a Tier 1 world and planned in a Tier 2 one; the Workbench processes ×40; the Forge plans
     `weapon-gem-g3` from 2 Copper Ingot and 2 Pine Plank in 4 gathers' time and refuses `branch-gem`; the Charm Shop's
     `accessory-setting-g7` takes 6 Shredded Cabbage and 6 Sardine Fillet in 12 gathers' time; the Lapidary's
     `jewel-moon-5` in a Tier 2 world takes 3 Cut Diamond and 1 Titanium Ingot; made items pay into `items`; with a
     `tradeOf`, a Mage is "Another trade" at the Mine and works the Monster Den and the Lapidary; in a world with no Brawler
     the Mine and the Forge take her (the open shop); with no `tradeOf` everyone works everywhere.
   - `save/work-v3.test.ts`: `startJob` uses slots 0–3 of a v3 place and refuses slot 4; `upgradeFacility` is "Places
     have no levels"; a collect pays items and Craft EXP; a Speed Ticket takes 30 minutes off; v1 cases unchanged.
   - `save/exchange-v3.test.ts`: `stockedTypes` in Tier 1, 2 and 3 worlds before and after the continent wins; buying
     at 30 · 80 × tier, "Not stocked yet" otherwise; selling at the table's prices; the calling pick's block.
   - `save/ascend-v3.test.ts` (a small case): after `ascend`, the old world's `items` keep their made items and
     materials and the new Uma's Craft Level is 1.
   - Every existing test passes unchanged.
7. **Docs:** implementation.md §3: "Built: H77 (D…)". `pnpm docs:update`: no diff (the `families`, `items`, `jobs`,
   `places`, `facilities` and `prices` blocks read the live generation).
8. **Check it locally** (your own ports, 390×844, desktop browser): the Wilds page shows today's eleven places; a gather,
   a refine and a craft start, finish and collect as before; the Exchange buys and sells as before.
9. **D-row:** fetch `main` first; log this packet's decisions (the id scheme first).

## Done when

- [ ] `pnpm lint && pnpm test && pnpm build` pass; say the main JS number.
- [ ] The tests in step 6 pass; every existing test passes unchanged.
- [ ] `docs/game/` is unchanged, `pnpm docs:update` leaves no diff, the D-row is logged, implementation.md has its line.
- [ ] The local check in step 8 was done and described. Nothing from the original games in git.
- [ ] Deployed green and https://uma-rpg.web.app/api/health shows the commit.

## Deliver

- **Claude, as a delegated worker:** a pull request from `feat/h77-professions-v3` with one commit,
  `feat(domain): professions v3, ten places, five lines, every recipe and item id, dark (H77)`. H74 runs at the same
  time: both may create `items/made-id.ts` (identical); rebase on whichever lands first. Fetch `main` before you push.
  The main session reviews and merges it, then watches the deploy.
- **Flag it done:** after the merge, a `docs(handoff): H77 done (D…)` commit deletes this file, sets H77 to Done with a
  Done row, and sets H78 (if H74, H75, H76 and R1's H69 are done), H80 (if H73, H78 and R1's H70 are done) and H81 (if
  H75, H76 and R1's H71 are done) to Ready.
