# The farm by line: three steps for every trade, on G1–G10 materials

> **Recipes and step time superseded in part by D264 (2026-10-30):** an Arms Gem or Tome Ink takes 10, Armor Fittings 3, an
> Accessory Setting or a jewel 5, and a step 24 → 16 minutes, so a rank is exactly 30 refined items a line. The rest stands;
> current numbers are in [materials](../../game/materials.md).

> **Live from H112 (2026-10-26, save v30).** The owner's request, 2026-10-26 (D224); the main session's design. It replaces parts of
> [profession-progression](profession-progression.md) (§3, §4's processing, §6's recipes and times, PP7–PP13, PP17).
> It is built in four packets: H109 (the rules, dark), H110 (save v30, dark), H111 (the screens, inert) and H112 (the
> switch). Each packet cites the calls below by number (FL1…FL24).

## Why

The owner used the live farm (R2) and found it "greatly unbalanced":
- five trades gather, but **one trade processes** (Paladins and Clerics at the Workbench, for every line), and four make;
- in practice it is **three steps, Farming → Processing → Crafting**, so every trade should do all three for its own
  line: "Umas can only Craft their specific farmed items", five making places with one item each;
- **graded materials**: G1–G10 raw → G1–G10 refined → G1–G10 items. "Do not overcomplicate this": Tier 1 only, reuse
  every asset;
- the three steps' times should match.

## 1. Lines and places

| Line | Her trade (calling) | Gathers at | Processes and makes at | Makes | Raises |
|---|---|---|---|---|---|
| Metal | Brawler | Mine | Forge | **Arms Gem** G1–G10 | an Arms weapon (Greatsword, Axe, Lance, Bow, Katana) |
| Wood | Spell Blade | Forest | Armorer | **Armor Fittings** G1–G10 | an armor slot |
| Vegetables | Paladin, Cleric | Fields | Workbench | **Tome Ink** G1–G10 (new) | a Tome (Fire, Blizzard, Thunder, Light, Dark) |
| Fish | Summoner | Fishery | Charm Shop | **Accessory Setting** G1–G10 | the accessory slot |
| Stone | Mage | Monster Den | Lapidary | **Planet Jewels** I–V, **Moon Jewels** I–V | Extra Stats nodes |

- **FL1 · Trades don't move.** The ten places, their rows on the Wilds page, the trade by calling (PP2) and the open
  shop stay as they are.
- **FL2 · A making place does two jobs:** it processes its own line's raw items into refined ones, one for one, and it
  makes its item from its own line's refined items. No place touches another line. The Workbench stops processing for
  everyone and becomes the vegetables line's making place.
- **FL3 · One item a making place:** the table above. The Lapidary keeps both jewels, which are one ladder of grades
  (Planet n is grade 2n − 1, Moon n is grade 2n).
- **FL4 · Weapons split by channel.** An Arms weapon is raised with Arms Gems, a Tome with Tome Ink. A class's slots are
  Arms or Tome slots (CP2), so every Uma's need is fixed by her class.

## 2. Ten grades a line

**FL5 · Every line is one uma-art family of ten grades**, raw and refined, all already in uma-art's `items` atlas:

| Grade | Metal (`ores`) | Wood (`woods`) | Vegetables (`vegetables`) | Fish (`fish`) | Stone (`crystals`) |
|---|---|---|---|---|---|
| G1 | copper-ore → copper-ingot | pine-log → pine-plank | carrot → chopped-carrot | carp → carp-fillet | quartz → cut-quartz |
| G2 | tin-ore → tin-ingot | birch-log → birch-plank | potato → diced-potato | trout → trout-fillet | amethyst → cut-amethyst |
| G3 | iron-ore → iron-ingot | cedar-log → cedar-plank | cabbage → shredded-cabbage | sardine → sardine-fillet | citrine → cut-citrine |
| G4 | silver-ore → silver-ingot | maple-log → maple-plank | onion → diced-onion | mackerel → mackerel-fillet | garnet → cut-garnet |
| G5 | cobalt-ore → cobalt-ingot | oak-log → oak-plank | tomato → tomato-puree | salmon → salmon-fillet | emerald → cut-emerald |
| G6 | gold-ore → gold-ingot | cherry-log → cherry-plank | bell-pepper → sliced-bell-pepper | sea-bream → sea-bream-fillet | sapphire → cut-sapphire |
| G7 | platinum-ore → platinum-ingot | mahogany-log → mahogany-plank | eggplant → sliced-eggplant | eel → eel-fillet | ruby → cut-ruby |
| G8 | titanium-ore → titanium-ingot | ebony-log → ebony-plank | asparagus → trimmed-asparagus | tuna → tuna-fillet | diamond → cut-diamond |
| G9 | mythril-ore → mythril-ingot | elderwood-log → elderwood-plank | golden-carrot → golden-carrot-puree | silverfin → silverfin-fillet | starstone → cut-starstone |
| G10 | orichalcum-ore → orichalcum-ingot | yggdrasil-branch → yggdrasil-plank | emperor-pumpkin → pumpkin-puree | rainbow-koi → rainbow-koi-fillet | philosophers-stone → cut-philosophers-stone |

Names come from the id as today ("Tomato Purée", "Cut Philosopher's Stone"); an icon is its family's row at its grade.

- **FL6 · One gate:** grade g opens at **Craft Lv 5g − 4** to gather, to process and to make (1, 6, 11 … 46). Using a made
  item of grade g still needs **Uma Lv 5g − 4**.
- **FL7 · A grade-g item takes grade-g refined items only.** A jewel's grade is its node's: Planet Jewel III takes Cut
  Emerald (G5), Moon Jewel V Cut Philosopher's Stone (G10).
- **FL8 · Every world uses these fifty types,** Tiers 2 and 3 included, until a later release gives them their own. The
  materials' tiers and bands, R2's Tier 2 and 3 pairs and the ladder (PP7–PP9, PP13) retire. Gear values stay × the
  tier.

## 3. Recipes

**FL9 · One line each, the same amount at every grade:**

| Made item | Takes (grade g) | A maxed Uma needs | Her refined, by line |
|---|---|---|---|
| Arms Gem | 7 Ingots | 15 on average (3 a grade on her Arms slots) | Metal 105 |
| Tome Ink | 7 vegetable cuts | 15 on average (on her Tome slots) | Vegetables 105 |
| Armor Fittings | 2 Planks | 50 (five slots) | Wood 100 |
| Accessory Setting | 10 Fillets | 10 (one slot) | Fish 100 |
| Planet Jewel n | 10 cut stones of grade 2n − 1 | 5 | Stone 110 (118 with her moon) |
| Moon Jewel n | 4 cut stones of grade 2n | 15 (17 with her moon) | |
| Branch Gem (R3, not live) | 7 Ingots G5, a placeholder R3 replaces | — | — |

"On average": on the 270 outfits' default classes (D220's head counts; healers counted half Paladins, half Clerics),
49% of weapon slots are Arms and 51% Tomes. The ledger's yardstick Uma holds 1.5 Arms and 1.5 Tomes a grade. Each line
carries about 100–110 refined items a maxed Uma.

## 4. Times

- **FL10 · Gathering and processing keep their times;** making takes **three quarters of a gather for each refined item
  in it** (was one gather). Each refined item then costs one gather of time at each of its line's two places (a gather
  at one; a quarter plus three quarters at the other), so a trade's two places stay equally busy at every grade.

| Job, one item | Craft Lv 1 | Craft Lv 50 |
|---|---|---|
| Gather a raw item | 54 min | 36 min |
| Process one | 13.5 min | 9 min |
| Arms Gem or Tome Ink (7) | 4 h 43 min | 3 h 9 min |
| Armor Fittings (2) | 1 h 21 min | 54 min |
| Accessory Setting or Planet Jewel (10) | 6 h 45 min | 4 h 30 min |
| Moon Jewel (4) | 2 h 42 min | 1 h 48 min |

All before the place's ×1.25. Batches stay: gathering and making 1–10, processing ×1, ×4, ×8, ×20, ×40. Craft EXP stays
2 a minute of the job before the place's speed.

- **FL11 · The pace holds.** H81's ledger (`economy/professions.sim.ts`: one maxed Uma at Craft Lv 25's times, before
  ×1.25):

| | Today (R2) | The farm by line |
|---|---|---|
| One Uma: pieces, refined (with her moon) | 110, 485 (493) | 110, 520 (528) |
| One Uma: hours (with her moon) | 822 (835) | 783.2 (795.2) |
| Each place's hours | 64–94 (the making places and the Workbench heaviest) | 75.3–82.8, every place |
| Trades' hours and shares | 154–169 h, 18.8–20.6% | Metal and Vegetables 158.1 h (20.2%), Wood and Fish 150.6 h (19.2%), Stone 165.7 h (21.2%) |
| Place supply, maxed Umas a day | 1.28 (Armorer) – 1.88 | Stone 1.45, Metal and Vegetables 1.52, Wood and Fish 1.59 |
| Forty Umas (9 · 8 · 9 · 7 · 7) | 1.27 a day; a run of twenty in 15.8 days | 1.27 a day (binds: Stone's 7 Umas); 15.8 days |
| Twenty Umas (5 · 4 · 5 · 3 · 3) | 0.54 a day | 0.54 a day |
| Grade days (Craft Lv 5g − 4) | G10 opens on day 22.1; the party holds it on 22.5 | the same |

## 5. The Exchange

- **FL12 · Buying raw:** G1–G5 30 Laurels, G6–G10 80, × the world's tier. G1–G5 are stocked after the tier's first win,
  G6–G10 after a win on continent 3 (today's low and high rule, read by grade). Up to 99 at a time.
- **FL13 · Selling:** raw G1–G5 6 Laurels, G6–G10 16; refined twice that; a made item 6 + 6 × its grade (Tome Ink too);
  all × the world's tier.

## 6. Names, art and words

- **FL14 · Names.** `weapon-gem-g1`…`g10` keep their ids and icons and read **Arms Gem G1**…. A new made line `tome-ink`,
  ids `tome-ink-g1`…`g10`, reads **Tome Ink G1**…. The professions' ids stay (`weapon-crafting`, `processing`; nothing
  stores them); their names become **Arms Crafting** (the Forge) and **Tome Crafting** (the Workbench, a making
  profession).
- **FL15 · No new art.** Material icons are their family's row at their grade. Tome Ink's icon is uma-art's `essences`
  refined row (the infusion bottles) at the same grade, atlas row 19, mapped in the web. No uma-art release.
- **FL16 · Words:**

| Where | Text |
|---|---|
| A material's facts | "Metal · G3 · raw", "Metal · G3 · refined" |
| Its pair | "Refines into Iron Ingot", "Refined from Iron Ore" (as today) |
| Arms Gem's use | "Raises an Arms weapon one grade" |
| Tome Ink's use | "Raises a Tome one grade" |
| A raise blocker | "Needs 1 Arms Gem G2", "Needs 1 Tome Ink G2", "Needs Tome Ink G2 and G3" |
| A gathering place's (i) | "Gathers metal, G1–G10. Grade g opens at Craft Lv 5g − 4." |
| A making place's (i) | "Processes its line's raw items into refined ones, one for one, in a quarter of a gather. Makes Arms Gems from Ingots, three quarters of a gather for each Ingot. Grade g opens at Craft Lv 5g − 4." |
| A making place's quick look | its item's G1–G10 chips, and "Processes Metal G1–G10" |
| A locked tile or chip | "From Craft Lv 11" |
| The Skills page's weapon line | "Each of her weapons has a grade, G0 to G10, raised with Arms Gems or Tome Ink on the Gear tab; any grade opens the tree." |
| Place blurbs (`hub/places.ts`) | Forge "Arms Crafting: Arms Gems.", Workbench "Tome Crafting: Tome Ink.", Armorer "Armor Crafting: Armor Fittings.", Charm Shop "Accessory Crafting: Accessory Settings.", Lapidary "Jewel Crafting: Planet and Moon Jewels."; a gathering place "Mining: metal, G1–G10." and the like |

## 7. Save v30

The engine stays v17: nothing in a fight changes.

- **FL17 · Work settles** as `toV28`'s step 1 does (no clock): every started entry's outputs from `collected` on go into
  `items` and pay their EXP into her `craft`; queued requests drop; `work` becomes `{}`.
- **FL18 · R2's types convert by the Craft Level they opened at:** a low type (any tier) becomes its line's G1 id, a high
  type its line's G6 id, raw to raw and refined to refined. The new stock is built from the old in one pass, so no id
  converts twice (Gold Ore is a source and a target). The table, raw ids (refined ids follow their raw):

| Line | Low types → G1 | High types → G6 |
|---|---|---|
| Metal | copper-ore, gold-ore, mythril-ore → copper-ore | iron-ore, titanium-ore, orichalcum-ore → gold-ore |
| Wood | pine-log, cherry-log, elderwood-log → pine-log | cedar-log, ebony-log, yggdrasil-branch → cherry-log |
| Vegetables | carrot, bell-pepper, golden-carrot → carrot | cabbage, asparagus, emperor-pumpkin → bell-pepper |
| Fish | carp, sea-bream, silverfin → carp | sardine, tuna, rainbow-koi → sea-bream |
| Stone | quartz, sapphire, starstone → quartz | citrine, diamond, philosophers-stone → sapphire |

  Refined: copper-ingot, gold-ingot, mythril-ingot → copper-ingot; iron-ingot, titanium-ingot, orichalcum-ingot →
  gold-ingot; and the same pattern in every line (pine-plank / cherry-plank, chopped-carrot / sliced-bell-pepper,
  carp-fillet / sea-bream-fillet, cut-quartz / cut-sapphire).
- **FL19 · Everything else stays:** made items (Weapon Gems now read Arms Gems), gear grades, set jewels, Craft Levels,
  Laurels, tickets, targets and `grant`.
- **FL20 · The server** needs nothing new: the first v30 write keeps `saveBackups/{uid}-v29`, and a v29 app is refused
  once v30 is stored (D45, D69).
- **FL21 · Versions:** R3, R4 and R5 keep engines v18–v20 and take saves **v31, v32 and v33**.

## 8. Screens

**FL22 · The place pages:**
- **A gathering place's What step:** its line's ten raw tiles, G1–G10, in two rows of five; a locked one says "From
  Craft Lv 11". Its quick look shows the ten icons.
- **A making place's What step:** two groups, **Process** (its line's ten refined tiles) and **Make** (its item's G1–G10
  chips; the Lapidary's Planet and Moon rows as today). The job's kind follows the picked id, and the size chips follow
  the kind (×1…×40 to process, 1–10 to make). A deep link with `job` opens on its kind.
- **Retired:** the Workbench's five-column grid, the tier rows, the grade chips' tier colours and their legend.
- **For your targets** at a making place: its made items, then its line's refined items; at a gathering place its raw
  items.

**FL23 · Elsewhere:**
- **The Warehouse:** materials carry their grade, so the kit's grade chips filter the material shelves too; each line's
  shelf orders raw then refined, by grade.
- **The Exchange:** the raw list behind the kit's `Tabs`, one tab a line (Metal, Wood, Vegetables, Fish, Stone), ten rows
  each with "G3 · have 12"; a locked row says the win that stocks it.
- **The Gear tab's Upgrade view:** an Arms weapon's row asks for Arms Gems, a Tome's for Tome Ink; "Can upgrade" counts
  both.
- **The Rift's Ascend** gives back Arms Gems or Tome Ink by each weapon's channel.

## 9. Not changed

**FL24:** the trade by calling, the ten places' slots and speed, Craft EXP, the Speed and Sweep Tickets, gear values, the
fight. Summoners are 12% of outfits (D220), so the Fish line keeps the fewest hands, as it has today.

## 10. The code contract (H109 builds it; H110–H112 use it)

The farm's switch, mirroring `rpgRework`:
- `packages/domain/src/save/version.ts`, a module with no imports: `SAVE_SCHEMA_VERSION` moves here (`save.ts`
  re-exports it), with `FARM_BY_LINE_SAVE = 30` and `farmByLine(save = SAVE_SCHEMA_VERSION): boolean`. Until H112 it is
  false in the game; tests pass `30`, or mock the module as `caps-at.fixture.ts` does for the engine.

New, beside R2's (R2's stay untouched until H112 deletes them):

| Module | Exports |
|---|---|
| `items/lines.ts` | `LineItem { id, line, grade, refined, pair, name, art: { family, grade } }`; `LINE_ITEMS` (100: line by line, raw G1–G10 then refined G1–G10); `lineItem(id)`, `isLineItemId(id)`, `lineItemId(line, grade, refined)` |
| `items/made-id.ts` (extended) | `'tome-ink'` in `MADE_LINES`, its ten ids in `MADE_IDENTITIES`; `gradeItem` takes `'tome-ink'` |
| `items/made-v4.ts` | `RECIPE_V4` (line and amount a made line), `madeRecipeV4(id)` (refined id → amount), `madeRefinedV4(id)`, `madePlaceV4(line)`, `madeNameV4(id)` ("Arms Gem G3", "Tome Ink G3", the rest as `madeName`) |
| `economy/places-v4.ts` | `PlaceSpecV4 { id, profession, line, kinds, made }`, `PLACES_V4`, `placeSpecV4(id)`, `PROFESSION_NAMES_V4` |
| `economy/pacing.ts` (extended) | `MAKE_SHARE_V4 = 0.75`, `makeMinutesV4(level, refined)` |
| `work/kinds-v4/material.ts`, `make.ts`; `work/env-v4.ts` | `rpgWorkEnvV4(tier, context)`; `liveWorkEnv` picks it when `farmByLine()` |
| `economy/grades.ts` (extended) | `gradeItemId(target, grade, save?)` and `raiseBlock`'s words by the weapon's channel when `farmByLine(save)` |
| `save/targets.ts`, `save/exchange.ts` (extended) | the v4 cascade, stock, prices and selling when `farmByLine()` |
| `items/stock-id.ts` (extended) | `isStockItemId` takes `tome-ink-g*` only when `farmByLine()` |
| `economy/professions-v4.sim.ts` | the ledger of §4 |
| `hub/places.ts` (extended) | the FL16 blurbs when `farmByLine()` |

H110 adds `toV30` and the v30 parse; H111 the screens, shown when `farmByLine()`; H112 turns it on and deletes R2's farm.

## 11. The trios: fifteen places (D230)

> **The owner's request, 2026-10-27; the main session's design.** Built by H113 (art, uma-platform) and H114 (uma-rpg).
> The owner, after playing the farm by line: "I really like the new loop of Farming → Processing → Crafting"; now each
> step gets its own building, five rows of three, connected by roads.

**Live from H114 (save v31).**

- **FL25 · A trio a line.** Each line works three places, left to right: its gathering place (exactly as today), a new
  **workbench** that only processes, and its making place, which only makes and is renamed. The Wilds' rows follow the
  owner's order: Metal, Vegetables, Wood, Fish, Stone.

| Row (her trade) | 1 · Gather | 2 · Process (new) | 3 · Make |
|---|---|---|---|
| Metal (Brawler) | Mine `mine` · Mining | Mine Workbench `mine-workbench` · Smelting | Weapon Forge `weapon-forge` · Arms Crafting (was the Forge) |
| Vegetables (Paladin, Cleric) | Fields `fields` · Farming | Fields Workbench `fields-workbench` · Prepping | Tome Forge `tome-forge` · Tome Crafting (was the Workbench) |
| Wood (Spell Blade) | Forest `forest` · Wood Chopping | Forest Workbench `forest-workbench` · Sawing | Armorer `armorer` · Armor Crafting |
| Fish (Summoner) | Fishery `fishery` · Fishing | Fishery Workbench `fishery-workbench` · Filleting | Charm Forge `charm-forge` · Accessory Crafting (was the Charm Shop) |
| Stone (Mage) | Monster Den `monster-den` · Hunting | Den Workbench `den-workbench` · Stonecutting | Lapidary `lapidary` · Jewel Crafting |

- **FL26 · Ids.** Three making places take new ids (`forge` → `weapon-forge`, `workbench` → `tome-forge`, `charm-shop` →
  `charm-forge`), because `workbench` would now name the wrong thing; place ids live only in work rows, which save v31
  settles (FL31). Five processing professions are new (`smelting`, `prepping`, `sawing`, `filleting`, `stonecutting`);
  `weapon-crafting` becomes `arms-crafting` and `processing` becomes `tome-crafting` (no save holds a profession id).
- **FL27 · Her trade works its three places** (PP2): a trade has twelve slots. The trade gate and the open shop work per
  place as today.
- **FL28 · Equal steps.** Every step takes the same time, `stepMinutes`: **36 minutes at Craft Lv 1, falling evenly to
  24 at Lv 50**, to gather a raw item, to process one, and for each refined item in a made item. A refined item still
  costs 108 minutes in all at Lv 1 (72 at Lv 50), as it does today (54 + 13½ + 40½), so a maxed Uma's hours and Craft
  EXP don't move, and each building of a trio is exactly as busy as the other two. Today's split (process a quarter, make
  three quarters) would leave the new workbenches idle three quarters of the time. Batches don't change (gather and make
  1–10, process ×1 … ×40); v1's `itemMinutes` (54 → 36) stays for v1's rules and the migrations.
- **FL29 · The amounts stay** (FL9): the review below.
- **FL30 · The pace.** Per maxed Uma: 520 refined (528 with her moon), 783 hours (795), each trade 150.6–165.7 hours, as
  today; each place 50.2–55.2 hours (step at Craft Lv 25, before ×1.25). A roster bound by its trades' head counts paces
  as today (forty Umas 1.27 maxed a day, twenty 0.54); a trade with more than eight Umas now puts up to twelve to work, so
  a large roster gears up to half again as fast (place supply 2.17–2.39 maxed Umas a day, up from 1.45–1.59).
- **FL31 · Save v31.** Work settles as `toV30`'s did (`settleWork`, no clock; queued requests drop); nothing else
  changes. R3, R4 and R5 take saves **v32, v33 and v34**.
- **FL32 · The map.** Fifteen spots, five even rows (y 0.15 · 0.31 · 0.47 · 0.63 · 0.79); the gathering place on
  the left (x ≈ 0.2), the workbench in the middle **on the trunk road** (x 0.5), the making place on the right (x ≈ 0.8,
  clear of the stream). uma-kit lays the roads itself: a branch from each side building's door to the trunk, and a lane
  round each building on it. At 375–390 px the map is 17 columns, the buildings at columns 3, 8 and 13, the three
  112 px place links side by side; no kit change is expected.
- **FL33 · Art** (H113): five new workbench buildings, one shared silhouette with each line's props, and three restyled
  making buildings (Weapon Forge, Tome Forge, Charm Forge). The gathering places, the Armorer (`lancers-barracks`) and
  the Lapidary keep their art.

- **FL34 · Sizes in steps (D233, after H114).** With every step equal, a job's sizes are brackets of steps up to about
  8 hours: ×1, ×2, ×3, ×5, ×10, ×15 or ×20 to gather or process; a make the sizes up to about twenty steps (Armor
  Fittings ×10, a Moon Jewel ×5, an Arms Gem or Tome Ink ×3, an Accessory Setting or a Planet Jewel ×2). A gather holds
  up to 20 a job (was 10). Times don't change.

### The per-Uma review (D230)

The owner asked whether one Uma's upgrades take equal amounts and times on every line, and whether splitting weapons and
Tomes leaves two trades' Umas behind. What a maxed Uma takes (Tier 1, G1–G10):

| Upgrade | Made items | Refined each | Refined in all | Line |
|---|---|---|---|---|
| 3 weapons (her slots: Arms or Tomes) | 30 | 7 | 210 | Metal for Arms, Vegetables for Tomes |
| 5 armor slots | 50 | 2 | 100 | Wood |
| 1 accessory slot | 10 | 10 | 100 | Fish |
| The Sun (Planet I–V) | 5 | 10 | 50 | Stone |
| The moons (three × I–V, and her moon's two) | 15 (17) | 4 | 60 (68) | Stone |

By her class (refined items a line; time follows, 108 minutes of work a refined item at Craft Lv 1):

| Her class (slots) | Metal | Vegetables | Wood | Fish | Stone |
|---|---|---|---|---|---|
| Brawler (3 Arms) | 210 | 0 | 100 | 100 | 118 |
| Spell Blade, Paladin (2 Arms, 1 Tome) | 140 | 70 | 100 | 100 | 118 |
| Summoner, Cleric (1 Arm, 2 Tomes) | 70 | 140 | 100 | 100 | 118 |
| Mage (3 Tomes) | 0 | 210 | 100 | 100 | 118 |
| Averaged over the 270 outfits (49% Arms) | 103 | 107 | 100 | 100 | 118 |

- **Equal for one Uma?** Armor, accessory and jewels, yes, within 18% (Stone the heaviest). Her weapons, no: a pure
  Brawler's or Mage's weapons put 210 on one line, twice her armor's work, and a hybrid's split 140 and 70.
- **Do the Metal and Vegetables Umas fall behind?** No. A weapon item costs 7 because the 30 weapon items split over two
  lines: averaged over a mixed roster each weapon line carries about 105 a maxed Uma, as Wood and Fish carry 100, so all
  five trades get the same work and the same Craft EXP. Halving the weapon cost would even out one pure Uma but give the
  two weapon trades half the others' work, and their Umas would level half as fast. **The amounts stay.**
- **Stone** is the heaviest line by up to 18%; it stays, as the Mage is the most common calling (its trade has the most
  hands).
