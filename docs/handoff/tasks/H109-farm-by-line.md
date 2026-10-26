# H109 — The farm by line: each trade gathers, processes and makes its own line; G1–G10 materials; one item a making place

**uma-rpg · ChatGPT · L · Needs: H82 (live) · Unblocks: R3 (its packets re-read the lines and recipes)**

## Why

The owner started using the farm and found it "greatly unbalanced" (2026-10-26, D224):
- Five trades gather, but **only one trade processes** (the Paladins and Clerics at the Workbench, for every line), and
  four trades make.
- In practice it is a **three-step process: Farming → Processing → Crafting**, so every trade should do all three for
  its own line: "Umas can only Craft their specific farmed items", **five making places**, each making **one item**
  ("1 phys weapon, 1 mage weapon, 1 armor, 1 accessory, 1 extra stats kind").
- **G1–G10 materials**: a G1–G10 raw item becomes a G1–G10 refined item, which makes the G1–G10 final item. "Do not
  overcomplicate this": **Tier 1 only** (Tiers 2 and 3 don't matter yet), **reuse all possible assets**.
- "Do proper rebalance of everything so that times still match" across the three steps.

The design below is decided (D224). Build it as written; record anything it leaves open in your D-row.

## The design

### 1. Five lines, three steps, two places a trade

| Line | Her trade (calling) | Gathers at | Processes and makes at | Makes | Raises |
|---|---|---|---|---|---|
| Metal | Brawler | Mine | Forge | **Arms Gem** G1–G10 | an Arms weapon (Greatsword, Axe, Lance, Bow, Katana) |
| Wood | Spell Blade | Forest | Armorer | **Armor Fittings** G1–G10 | an armor slot |
| Vegetables | Paladin, Cleric | Fields | Workbench | **Tome Ink** G1–G10 (new) | a Tome (Fire, Blizzard, Thunder, Light, Dark) |
| Fish | Summoner | Fishery | Charm Shop | **Accessory Setting** G1–G10 | the accessory slot |
| Stone | Mage | Monster Den | Lapidary | **Planet Jewels** I–V, **Moon Jewels** I–V | Extra Stats nodes |

- **Trades don't move:** the Wilds keep their ten places and rows; her calling still names her row (PP2). The Workbench
  stops processing for everyone and becomes the vegetables line's making place.
- **A making place takes two kinds of job:** process (its own line's raw into refined, one for one) and make (its item
  from its own line's refined). No place touches another line. The open shop rule is unchanged.
- **Weapons split by channel:** Arms take Arms Gems (the Forge), Tomes take Tome Ink (the Workbench). A class's three
  slots are Arms or Tome slots (CP2), so every Uma knows which she needs.

### 2. Ten grades a line, all existing uma-art

Each line is one uma-art family of ten grades, raw and refined. Every icon already exists in uma-art's `items` atlas;
no art release.

| Line (atlas family) | Raw G1 → G10 | Refined G1 → G10 |
|---|---|---|
| Metal (`ores`) | copper-ore, tin-ore, iron-ore, silver-ore, cobalt-ore, gold-ore, platinum-ore, titanium-ore, mythril-ore, orichalcum-ore | copper-ingot … orichalcum-ingot |
| Wood (`woods`) | pine-log, birch-log, cedar-log, maple-log, oak-log, cherry-log, mahogany-log, ebony-log, elderwood-log, yggdrasil-branch | pine-plank … yggdrasil-plank |
| Vegetables (`vegetables`) | carrot, potato, cabbage, onion, tomato, bell-pepper, eggplant, asparagus, golden-carrot, emperor-pumpkin | chopped-carrot, diced-potato, shredded-cabbage, diced-onion, tomato-puree, sliced-bell-pepper, sliced-eggplant, trimmed-asparagus, golden-carrot-puree, pumpkin-puree |
| Fish (`fish`) | carp, trout, sardine, mackerel, salmon, sea-bream, eel, tuna, silverfin, rainbow-koi | carp-fillet … rainbow-koi-fillet |
| Stone (`crystals`) | quartz, amethyst, citrine, garnet, emerald, sapphire, ruby, diamond, starstone, philosophers-stone | cut-quartz … cut-philosophers-stone |

- **One gate for everything:** grade g opens at **Craft Lv 5g − 4** for gathering, processing and making alike (the
  made items' rule today). Using a made item of grade g still needs Uma Lv 5g − 4.
- **A grade-g item takes grade-g refined only.** A jewel's grade is its node's (Planet n is 2n − 1, Moon n is 2n), so
  Planet Jewel III takes Cut Emerald (G5) and Moon Jewel V Cut Philosopher's Stone (G10).
- **Every world uses these fifty types**, Tiers 2 and 3 included, for now. The materials' tier and band, the Tier 2 and 3
  pairs and the ladder (PP7–PP9, PP13) retire. Gear values stay × the tier (unchanged).

### 3. Recipes: one line each, the same amount at every grade

| Made item | Takes (grade g) | A maxed Uma needs | Her refined, by line |
|---|---|---|---|
| Arms Gem | 7 Ingots | 15 on average (3 a grade on her Arms slots) | Metal 105 |
| Tome Ink | 7 vegetable cuts | 15 on average (on her Tome slots) | Vegetables 105 |
| Armor Fittings | 2 Planks | 50 (five slots) | Wood 100 |
| Accessory Setting | 10 Fillets | 10 (one slot) | Fish 100 |
| Planet Jewel n | 10 cut stones of grade 2n − 1 | 5 | Stone 110 (118 with her moon) |
| Moon Jewel n | 4 cut stones of grade 2n | 15 (17 with her moon) | |
| Branch Gem (R3, not live) | 7 Ingots G5, a placeholder; R3 sets its own | — | — |

"On average": across the 270 outfits' default classes, 49% of weapon slots are Arms and 51% Tomes (D220's head counts:
Brawlers three Arms, Mages three Tomes, Spell Blades and Paladins two and one, Summoners and Clerics one and two;
healers counted half Paladins, half Clerics). So the
ledger's yardstick Uma holds 1.5 Arms and 1.5 Tomes a grade.

### 4. Times: the three steps match

- **Gather:** unchanged, by Craft Level only: 54 minutes at Lv 1 → 36 at Lv 50, before the place's ×1.25.
- **Process:** unchanged, a quarter of a gather per item, batches ×1, ×4, ×8, ×20, ×40.
- **Make:** **three quarters of a gather for each refined item in it** (was one gather).

So each refined item costs exactly one gather of time at **each** of its line's two places: one at the gathering place,
a quarter plus three quarters at the making place. Both places of a trade stay equally busy, whatever the grade.

| Job, one item | Craft Lv 1 | Craft Lv 50 |
|---|---|---|
| Gather a raw item | 54 min | 36 min |
| Process one | 13.5 min | 9 min |
| Arms Gem or Tome Ink (7) | 4 h 43 min | 3 h 9 min |
| Armor Fittings (2) | 1 h 21 min | 54 min |
| Accessory Setting or Planet Jewel (10) | 6 h 45 min | 4 h 30 min |
| Moon Jewel (4) | 2 h 42 min | 1 h 48 min |

All before the place's ×1.25. Craft EXP stays 2 a minute of the job before the place's speed.

**The pace holds** (H81's ledger, `economy/professions.sim.ts`: one maxed Uma at Craft Lv 25's times, before ×1.25):

| | Today (R2) | H109 |
|---|---|---|
| One Uma: pieces, refined (with her moon) | 110, 485 (493) | 110, 520 (528) |
| One Uma: hours (with her moon) | 822 (835) | 783 (795) |
| Each place's hours | 64–94 (the making places and the Workbench heaviest) | 75.3–82.8, every place |
| Trades' hours and shares | 154–169 h, 18.8–20.6% | Metal and Vegetables 158.1 h (20.2%), Wood and Fish 150.6 h (19.2%), Stone 165.7 h (21.2%) |
| Place supply, maxed Umas a day | 1.28 (Armorer) – 1.88 | Stone 1.45, Metal and Vegetables 1.52, Wood and Fish 1.59 |
| Forty Umas (9 · 8 · 9 · 7 · 7) | 1.27 a day; a run of twenty in 15.8 days | **1.27 a day** (binds: Stone's 7 Umas); **15.8 days** |
| Twenty Umas (5 · 4 · 5 · 3 · 3) | 0.54 a day | **0.54 a day** |
| Grade days (Craft Lv 5g − 4) | G10 opens day 22.1, the party holds it 22.5 | the same |

### 5. The Exchange and selling

- **Buying raw:** G1–G5 30 Laurels, G6–G10 80, × the world's tier. G1–G5 are stocked after the tier's first win, G6–G10
  after a win on continent 3: today's low and high rule, read by grade. Up to 99 at a time, as today.
- **Selling:** raw G1–G5 6, G6–G10 16; refined twice that; a made item 6 + 6 × its grade; × the world's tier (as today).

### 6. Names and art

- `weapon-gem-g1`…`g10` keep their ids and icons and read **Arms Gem G1**…: "Raises an Arms weapon one grade".
- **New `tome-ink-g1`…`g10`**, a made line `tome-ink`, **Tome Ink G1**…: "Raises a Tome one grade". Its icon is uma-art's
  `essences` refined row at the same grade (the infusion bottles; `apps/web/src/items/frames.ts`, atlas row 19), mapped
  in the web only.
- **Professions:** the Forge's `weapon-crafting` becomes `arms-crafting` "Arms Crafting"; the Workbench's `processing`
  becomes `tome-crafting` "Tome Crafting", a making profession. No save holds a profession id, so the rename is free.
  `ProfessionKind` keeps `gathering` and `making`.
- **A material's facts:** "Metal · G3 · raw" (no tier, no band); its pair as today ("Refines into Iron Ingot").

### 7. Save v30 (the engine stays v17)

`toV30` in `save/migrations.ts`, chained after `toV29`; `SAVE_SCHEMA_VERSION` 30. Per world, literals only:
1. **Settle work** as `toV28`'s step 1 does (no clock): every started entry's outputs from `collected` on go into
   `items` and pay their EXP into her `craft`; queued requests drop; `work` becomes `{}`. Extract the step into one helper
   both use.
2. **Convert the old types by the Craft Level they opened at:** every R2 **low** type, any tier, becomes its line's
   **G1** id, and every **high** type its line's **G6** id, raw to raw and refined to refined (Iron Ore → Gold Ore,
   Cedar Plank → Cherry Plank, Gold Ore → Copper Ore). Build the new map from the old one in one pass, so no id converts
   twice (Gold Ore is both a source and a target). A literal table of R2's sixty ids.
3. **Everything else stays:** made items (Weapon Gems now read Arms Gems), gear grades, set jewels, Craft Levels,
   Laurels, tickets, `grant`.

The server needs nothing new: the first v30 write keeps `saveBackups/{uid}-v29` and a v29 app is refused once v30 is
stored (D45, D69).

**Versions re-planned:** R3, R4 and R5 keep engines v18–v20 and take saves **v31, v32 and v33**.

### 8. Screens

- **A gathering place's What step:** its line's ten raw tiles, G1–G10 (two rows of five), "From Craft Lv 11" on a locked
  one. Its quick look shows the ten icons.
- **A making place's What step:** two groups, **Process** (its line's ten refined tiles) and **Make** (its item's G1–G10
  chips; the Lapidary's Planet and Moon rows as today). The job's kind follows the picked id. The sizes follow the
  kind: ×1…×40 to process, 1–10 to make. `PlaceV3` tracks the picked job's kind and passes the matching `sizeRule`; the
  kit's `JobSheet` reads `sizeRule` on every render, so **no kit change**. A deep link with `job` opens on its kind.
- **Retire:** the Workbench's five-column grid, the tier rows, the grade chips' tier colours and their legend.
- **Quick looks:** a making place shows its G1–G10 chips and "Processes Metal G1–G10".
- **Help (i):** a gathering place: "Gathers metal, G1–G10. Grade g opens at Craft Lv 5g − 4." A making place: "Processes
  its line's raw into refined, one for one, in a quarter of a gather. Makes Arms Gems from Ingots, three quarters of a
  gather for each Ingot. Grade g opens at Craft Lv 5g − 4."
- **For your targets** at a making place: its made items, then its line's refined; at a gathering place its raw.
- **The Warehouse:** materials carry their grade, so the kit's grade chips filter the material shelves too; order by
  line, raw then refined, by grade.
- **The Exchange:** the raw list behind the kit's `Tabs`, one a line (Metal, Wood, Vegetables, Fish, Stone), ten rows each,
  "G3 · have 12", locked rows saying the win that stocks them.
- **The Gear tab's Upgrade view:** an Arms weapon's row asks for Arms Gems, a Tome's for Tome Ink ("Needs 1 Tome Ink
  G2"); "Can upgrade" counts both. The Skills page's line says "raised with Arms Gems or Tome Ink".
- **The Rift's Ascend** gives back Arms Gems or Tome Ink by each weapon's channel (it reads `gradeItemId`).

## Context (read first)

- `CLAUDE.md`, `AGENTS.md` (commands; player text short; 44 pt targets; 390×844 and 375×667; explanations behind the (i),
  D95), [change-protocol.md](../../change-protocol.md): every screen here is this game's, built from the kit's pieces, with
  **no kit change and no fork**.
- D224 (this design), D221 (save v29, the last migration's shape), D222 (the Warehouse grid), D220 (head counts), D195 and
  [profession-progression](../../design/tier-rework/profession-progression.md) (the farm this replaces in part), the
  manual's [materials](../../game/materials.md), [loops](../../game/loops.md#craft-level) and
  [sections](../../game/sections.md#wilds).
- **The domain** (`packages/domain/src/`):
  - `items/materials-id.ts`, `items/materials.ts` (the catalog, names, art), `items/made-id.ts`, `items/made.ts`
    (recipes, `madePlace`, the ladder), `items/stock-id.ts`;
  - `economy/professions.ts` (professions, `PLACES_V3`, trades), `economy/pacing.ts` (`REFINE_SHARE`, `itemMinutes`),
    `economy/grades.ts` (`gradeItemId`, `raiseBlock`'s words);
  - `work/kinds-v3/material.ts` and `make.ts` (what a place takes, times, gates), `work/env-v3.ts`;
  - `save/save.ts` (`madeAtV28`, `parseRequestV28`: a place's one kind), `save/migrations.ts` (`toV28` step 1, `toV29`),
    `save/targets.ts` (`targetDemand`, `facilityTargets`), `save/exchange.ts` (stock, prices, selling), `save/rift.ts`
    (the climb back), `hub/places.ts` (place blurbs), `economy/professions.sim.ts` and its test (the ledger),
    `docs/render.ts` (the manual's generated tables).
- **The web** (`apps/web/src/`): `places/work/place-view.ts`, `PlaceV3.tsx`, `FacilityPage.tsx`;
  `places/exchange/exchange-rows.ts`, `ExchangePage.tsx`; `places/warehouse/warehouse-shelves.ts`; `items/v3-words.ts`,
  `items/frames.ts`; `places/stable/gear-v3.ts`, `GearCardV3.tsx`, `SkillTree.tsx`.
- **The API:** `apps/api/src/save/firestore-save.repository.test.ts` (v29 → v30).

## Do

1. **The catalog** (domain): the fifty types by line and grade (`MaterialIdentity`: `line`, `grade`, `refined`, `pair`),
   names and icons from the id and grade (`tomato-puree` reads "Tomato Purée"); `tome-ink` as a made line; the six
   recipes above; `madePlace` (`tome-ink` at the Workbench); the ladder, `MaterialTier`, `MaterialBand` and
   `worldMaterialTier`'s material uses retire (keep what gear still needs). `isStockItemId` takes `tome-ink-g*`.
2. **The places and work** (domain): `PlaceSpecV3` gets its `line` on every place and `kinds` (`['gather']`, or
   `['refine', 'craft']`, the Lapidary `['refine', 'cut']`); the professions' renames; `materialKindV3` processes only the
   place's line and gates by grade; `makeV3` takes three quarters of a gather a refined item (`MAKE_SHARE = 0.75` in
   `pacing.ts`, beside `REFINE_SHARE`); the v30 parse accepts exactly what the rules make.
3. **Gear and targets** (domain): `gradeItemId` and the words by the weapon's channel; `targetDemand`'s weapons the same;
   `facilityTargets` as in §8.
4. **The Exchange** (domain): §5.
5. **Save v30**: §7, with `migrations-v30.test.ts`.
6. **The ledger**: `professions.sim.ts`' yardstick Uma (1.5 Arms and 1.5 Tomes a grade), every place's own line, make at
   ¾; its test asserts §4's H109 column.
7. **Domain tests:**
   - the catalog: fifty raw and fifty refined ids, each name and icon against uma-art's atlas (`materials.test.ts`);
   - recipes for every made item and grade; the gate (G3 refused at Craft Lv 10, open at 11) for gather, process and make;
   - the Forge processes Copper Ore and refuses Pine Log (`not-here`); the Workbench processes only vegetables; the Mine
     gathers only metal;
   - make times (an Arms Gem is 7 × ¾ gathers);
   - an Arms weapon raised with an Arms Gem, a Tome with Tome Ink, and each refused with the other's item;
   - targets cascade per line; the Exchange's stock and prices by grade;
   - `toV30` on a v29 world with a running process, a running make, a queue, old low and high stock in every line and
     Weapon Gems: settled, converted, chained, idempotent, new saves at v30.
8. **The web:** §8; pure helpers for the What groups, with tests (`place-view.test.ts`, `exchange-rows.test.ts`,
   `warehouse-shelves.test.ts`, the Upgrade rows).
9. **The API:** `firestore-save.repository.test.ts` for v29 → v30 (backup `saveBackups/u-v29`).
10. **The manual:** `materials.md` (lines, types, made items, gear, recipes), `loops.md` (the loop, Craft Level, the
    trades, jobs, the Exchange, currencies), `sections.md` (the Wilds' tables, a place's page), `classes.md` (weapons
    raised with Arms Gems or Tome Ink), `architecture.md` (save v30 in the history); `render.ts`; run `pnpm docs:update`.
11. **The docs around it:**
    - a banner on [profession-progression.md](../../design/tier-rework/profession-progression.md): "Superseded in part
      by D224 (H109): §3, §4's processing, §6's recipes and times, PP7–PP13, PP17";
    - the version re-plan of §7 in [implementation.md](../../design/tier-rework/implementation.md) and the handoff index's
      R3, R4 and R5 headers;
    - in each R3–R5 packet, its D221 note becomes "read save v29 as v31, v30 as v32, v31 as v33 (D221, D224)";
    - one line under R3's header: H83 (the Branch Gem's recipe), H84 (the Setting split over two slots), H85 (Moon
      Jewels) and H86 (the secondary) re-read H109's lines and recipes.
12. **Check it locally:**
    - your own ports (avoid 8098 and 5198), in a desktop browser, never the iOS Simulator;
    - a **v29** save built from the CJS build, with:
      - a Paladin processing Iron Ore at the Workbench and a Brawler making a Weapon Gem, both running;
      - a queued job;
      - Copper Ingot, Iron Ore, Cabbage, Sardine Fillet and Citrine in stock;
      - Weapon Gems G1–G2.
    - Load it and confirm: the jobs settled; Iron Ore became Gold Ore, Cabbage Bell Pepper, Sardine Fillet Sea Bream
      Fillet, Citrine Sapphire; the Weapon Gems read Arms Gems.
    - Then play each line's three steps at G1: gather, process at its making place (×8), make one item.
    - Then raise a Katana with an Arms Gem and a Fire Tome with Tome Ink.
    - Then check the Exchange's tabs, the Warehouse's grade chips on a material shelf, and the targets strip at the
      Forge.
    - At 390×844 and 375×667, light and dark. Describe what you saw; screenshots with original art stay local.

## Done when

- [ ] `pnpm lint && pnpm test && pnpm build` pass; say the main JS number (budget 230 KB).
- [ ] The tests in steps 5–9 pass; the replay tests stay green (no engine change).
- [ ] The ledger test asserts §4's numbers: 520 refined, 783 hours, forty 1.27 a day, twenty 0.54.
- [ ] The manual matches the game; `pnpm docs:update` leaves no diff.
- [ ] A D-row is logged for the build (fetch `main` first so the number doesn't collide). Nothing from the original games
      in git.
- [ ] Deployed green, and https://uma-rpg.web.app/api/health shows the commit.

## Deliver

- A pull request from `feat/h109-farm-by-line`, one commit:
  `feat: the farm by line, G1–G10 materials, one item a making place, save v30 (H109)`. Fetch `main` before you push.
- **ChatGPT merges it itself** once CI is green (the owner, 2026-10-26: full autonomy to merge and deploy), then watches
  the deploy: `gh run watch <id> -R luismlorenzana/uma-rpg --exit-status`. Rerun a failed job once if it's the web
  suite's known flake (`Timeout calling "onTaskUpdate"`).
- This packet **changes a live save** (v29 → v30). The owner's save is protected by the server's backup on the first
  v30 write; still, run step 12's migration before you merge, and put its before and after stock in the pull request.
- **Flag it done:** a `docs(handoff): H109 done (D…)` commit deletes this file and adds a Done row to
  `docs/handoff/README.md`.
