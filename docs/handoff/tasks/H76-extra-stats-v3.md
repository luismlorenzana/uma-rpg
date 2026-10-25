# H76 — Extra Stats v3: the Planet and three moons, Prowess by class, her moon, jewels and their gates, the foes' budget × tier (dark)

**uma-rpg · Claude · M · Needs: H74, R1's H67 · Unblocks: H78, H79, H81**

## Why

R2 rebuilds Extra Stats ([extra-stats-progression.md](../../design/tier-rework/extra-stats-progression.md), D194):
- today's Sun and eight planets (100 nodes, 30 active slots, 100 Star Gems) become **the Planet and three moons**:
  **Prowess** (offense, split by her class), **Vigor** (HP and MP) and **Guard** (DEF and M.DEF): **20 nodes, the same for
  every class, every open node counting**;
- **her moon**, two nodes of her Uma Template (UT10): her knack's stat and her calling channel's defense;
- a node opens with **its jewel, in order, at Uma Lv 5g − 4**: Planet Jewels I–V and Moon Jewels I–V, made at the
  Lapidary (H77);
- every value is Tier 1's **× 1, × 1.8, × 2.6** (SB1), and **the foes' build budget moves to the same multiplier**
  (EP16), so every source keeps its share at each tier's Lv 50.

The map's points reach a fight as stats (no engine rule changes); the foes' budget is the generator's. All of it is dark
behind the economy stage. Nothing changes on screen (H79 draws the Observatory).

## Context (read first)

- `CLAUDE.md`, `AGENTS.md`, **R2's build decisions** (H74's first D-row: point 5 the jewel ids and the Warehouse, point 7
  the two shapes in the types, point 8 templates from the caller), H74's own D-row and code (`economy/grades.ts`'s
  `tierScaled`, `items/made-id.ts`'s `jewelId`, `save/economy-v3.fixture.ts`).
- The design: [extra-stats-progression.md](../../design/tier-rework/extra-stats-progression.md) §0, **§2** (the shared
  rules), **§3** (Tier 1's bodies, every node, **§3.3 Prowess and its node table**, §3.4 by level), **§6** (her moon,
  decided by UT10), §7, §8.2 (the sheets), §9 (defense and sustain), **§10** (the foe budget, EP16), §11 (jewels: EP17;
  the recipes are H77's), §12 (the Observatory: H79's), **§15** (save), §17 (EP1–EP29);
  [uma-templates.md](../../design/tier-rework/uma-templates.md) §3.6 (UT10), §4 (UT13), §5 (UT14: the screens' ★, H79's);
  README §9.3's `stars` row (R2).
- **R1's H67 and H69:** `roster/template.ts`'s `umaTemplate(outfit, pick?)`: her `knack` (`'tireless' | 'clever' |
  'mighty' | 'fleet' | 'gritty'`) and her `calling` (a class; its channel: physical for Brawler, Spell Blade, Paladin; magical for Mage, Summoner, Cleric).
- **The code** (lines on `421eacd`):
  - `economy/stars.ts` (all: the v1 map, frozen; `STAR_NODES`, `starPoints`, `GEM_IDENTITIES`); `economy/gems.ts`
    (Star Gems, frozen); `economy/bonus.ts` 8–28 (`Points`, `applyPoints`: HP 5 a point, Speed 0.6% evasion, Limit 0.4).
  - `save/observatory.ts` (all: `gemBlock`, `setGem`, `setActiveNodes`, `extraStatPoints`): v1, kept.
  - `save/save.ts` 118 `Stars`, 466–473 `parseStars`; `save/battle.ts` 161–171 (`umaPoints`, `umaPointParts`), 224–236
    `partyMembers` (H74 and H75 edited it); `save/sheet.ts` 23 (`umaPointParts`); `save/upgrades.ts` 120–131,
    `save/targets.ts` 64 (v1 readers to narrow); the web's `places/observatory/ObservatoryPage.tsx` (reads
    `uma.stars`), `items/planets.ts`.
  - `rpg/campaign/enemies.ts` 6–7 `rpgReferenceStat`, 11–24 `RPG_FOE_TUNING` (`budgetPerLevel` 0.035,
    `offenseBudgetPerLevel` 0.01), 96–111 `rpgFoeBudget`, `rpgFoeTierBudget`, 121–140 `rpgFoe`; `world/world.ts` 219
    (the stage generator's `rpgFoe`); `rift/generate.ts` 115 `riftFight(ctx, ref, engine)`.
  - `world/balance-party.ts` 23–25 `onCurveGrade`, 55–63 `onCurveStars`.
  - `docs/render.ts` 308–325 (`foe-scaling`: reads `rpgFoeTierBudget` with the live default).

## Decisions made

**Approved calls, exact values:**
- **EP1, EP6:** the Planet (5 nodes) and three moons, Prowess, Vigor, Guard (5 each): **20 nodes, every class the same**;
  her moon's 2 beside. **Every open node counts**; no active slots, no toggles.
- **EP2 · the Planet:** **+1, +2, +4, +6, +8 points to all six core stats** (HP 5 a point), nodes I–V at **Lv 1, 11, 21,
  31, 41**, Planet Jewels I–V: **+21 each** in Tier 1 (HP +105). Tier 2 **+2, +4, +7, +11, +14** (+38); Tier 3 **+3, +5,
  +10, +16, +21** (+55).
- **EP3 · a moon node is worth its grade:** **+2, +4, +6, +8, +10** at **Lv 6, 16, 26, 36, 46**, Moon Jewels I–V: +30 a
  moon. Tier 2 **+4, +7, +11, +14, +18** (+54); Tier 3 **+5, +10, +16, +21, +26** (+78). **Guard** gives each node's points
  to DEF and to M.DEF; **EP4 · Vigor** to HP (× 5) and to MP (Tier 1 HP +150, MP +30).
- **EP23 · Prowess** splits each node's points by **her active class**, read when a fight starts: **Brawler 100/0, Mage
  0/100, Spell Blade 70/30, Summoner 30/70, Paladin 80/20, Cleric 20/80** (ATK / M.ATK); the larger share rounded half up,
  the rest to the smaller, so a node keeps its total. The node table is EP §3.3's (70/30: Tier 1 1/1, 3/1, 4/2, 6/2, 7/3
  = 21/9; Tier 2 3/1, 5/2, 8/3, 10/4, 13/5 = 39/15; Tier 3 4/1, 7/3, 11/5, 15/6, 18/8 = 55/23. 80/20: Tier 1 2/0, 3/1,
  5/1, 6/2, 8/2 = 24/6; Tier 2 3/1, 6/1, 9/2, 11/3, 14/4 = 43/11; Tier 3 4/1, 8/2, 13/3, 17/4, 21/5 = 63/15; the mirrors
  for the Summoner and the Cleric). A class switch re-splits at the next fight; no jewel is lost.
- **EP5:** a node opens with **its jewel, in order** (node n after node n − 1 of its body), at **Uma Lv 5g − 4**; a jewel
  above her level waits ("Opens at Lv 36").
- **EP7:** values are Tier 1's × 1, 1.8, 2.6, each node rounded half up; **Limit start and evasion don't scale**.
  **EP8:** Speed and Limit stay off the shared map.
- **EP13:** the core is rebuilt empty at every promotion (a fresh Uma in the new world).
- **EP14 with UT10 · her moon:** node **`template:1`** opens at **Lv 16 with a Moon Jewel II**: **+4 points × tier** to her
  knack's stat: **Tireless HP +20** (+35, +50), **Clever MP +4** (+7, +10), **Mighty DEF and M.DEF +4 each** (+7, +10),
  **Fleet evasion +2.4%** (4 Speed points, every tier), **Gritty Limit start +1.6** (4 Limit points, every tier). Node
  **`template:2`** opens at **Lv 36 with a Moon Jewel IV**: her **calling's channel's defense**, **DEF** for a physical
  calling, **M.DEF** for a magical one, **+8** (+14, +21). Both count **in every class**; outside the foe budget (UT13: the
  defense side, +0.6–0.7% from node II, her knack's 0–2.8%).
- **EP15:** no new defensive values; MP is the pool and SB18's base regen (R1's H68).
- **EP16 · the foe budget:** the rates stay; `rpgFoeTierBudget`'s build part is **× the tier's multiplier**:
  `1 + (rpgFoeBudget(ℓ) − 1) × m × rpgReferenceStat(ℓ) ÷ rpgReferenceStat(L)`, m = 1, 1.8, 2.6. At each tier's Lv 50 it
  lands on Tier 1's curve: **HP and defense ×2.715, ×2.719, ×2.721; offense ×1.49, ×1.491, ×1.492**. `onCurveStars` is
  **the core's nodes her level opens, the same 20 for every class, Prowess at her split**; the average Uma has no
  template moon.
- **EP17, EP22:** two jewel kinds, ten items: **Planet Jewel I–V** (grades 1, 3, 5, 7, 9) and **Moon Jewel I–V** (grades
  2, 4, 6, 8, 10; any moon's node of its numeral, picked when set); ids `jewel-planet-1`…`5`, `jewel-moon-1`…`5` (H74's
  `items/made-id.ts`; H77 makes them). Names "the Planet", "Prowess", "Vigor", "Guard", her moon "{her type}'s moon"
  ("Ironhide's moon"), "Planet Jewel III", "Moon Jewel II".
- **EP21:** Star Gems and the old maps are deleted and compensated at the migration (H78).

**This packet's decisions:**
- **`economy/planet.ts`** (new; main-bundle safe; R3's H85 adds the weapon moons beside it):
  - **Node ids:** `planet:1`–`5`, `prowess:1`–`5`, `vigor:1`–`5`, `guard:1`–`5`, `template:1`–`2` (`MAP_NODES`, map
    order: the Planet, Prowess, Vigor, Guard, her moon); `isMapNode`, `nodeBody`, `nodeNumeral`.
  - `mapNodeGrade(id)`: Planet n → 2n − 1, a moon's n → 2n, `template:1` → 4, `template:2` → 8;
    `mapNodeGate(id) = 5 × grade − 4`; `nodeJewel(id)`: `jewel-planet-n`, `jewel-moon-n`, `template:1` → `jewel-moon-2`,
    `template:2` → `jewel-moon-4`.
  - `PLANET_T1 = [1, 2, 4, 6, 8]`, `MOON_T1 = [2, 4, 6, 8, 10]`, `PROWESS_SPLIT` (ATK percent by class: 100, 0, 70, 30,
    80, 20), each node by `tierScaled` (H74), Prowess's split in integer percent so a .5 rounds up exactly (`points × pct
    ÷ 100`).
  - **`mapPoints(open, classId, tier, template?)`** → `Points`: Planet, Prowess (split by `classId`), Vigor, Guard, and,
    with `template = { knack, channel }`, her moon. HP in points (÷ `POINT_HP`), evasion as Speed points, Limit start as
    Limit points, so `applyPoints` makes the stats as today.
  - `StarMap = { open: string[]; moons: [] }` (README §9.3, EP §15: `moons` empty until R3's weapon moon).
- **The save's types** (R2's build decision 7): today's `Stars` becomes **`StarsV1`**, `OwnedUma.stars: StarsV1 |
  StarMap`; `isStarMap`, **`starsV1(uma)`** (her v1 map, or `{ unlocked: [], active: [] }` for a v3 one) and
  `starMapOf(uma)` (or `{ open: [], moons: [] }`). Narrow every v1 reader (domain and web), no behaviour moving.
  `parseStars` keeps v1's shape (H78 parses v28).
- **The jewel setter** (`save/observatory.ts`, a v3 branch beside v1's; the web loads `@rpg/domain/observatory`):
  - **`setJewel(save, outfitId, jewelId, node, now, tier = TIER_ONE)`**: takes one jewel from `world.items` (deleting a
    count that reaches 0) and adds `node` to `stars.open`. Refused (`SaveRuleError`): "None in the Warehouse"; "Already
    open"; "A Moon Jewel II opens a node II" (the jewel doesn't fit the node: a Planet Jewel n only `planet:n`; a Moon
    Jewel n `prowess:n`, `vigor:n`, `guard:n`, and her moon's node of that jewel); "Set Moon Jewel I first" (in order;
    `template:2` after `template:1`); "Opens at Lv 36" (the gate); "Not graded" for a v1 map.
  - **`jewelNodes(map, jewelId, level)`**: the nodes it can open now, in map order, **the moon furthest behind first**
    (EP §3.5: the Set list suggests it); `[]` when none.
  - It needs no master data: her moon's ids are fixed; only its values read her template.
- **The fight:** `partyMembers` (a graded Uma with a `StarMap`) adds `mapPoints(open, classId, tier, template)` to her
  armor's points (H74), the template from `umaTemplate(outfit, uma.calling?.pick ?? undefined)`'s knack and its calling's
  channel (H67, H69). `umaPointParts(uma, classId, tier?, template?)` returns the map as its `extra` part, so `umaBattleSheet` (H79
  rewrites its rows) keeps "gear" and "extra" apart. Prowess reads `classId`, her active class, when the fight starts.
- **The foe budget** (EP16), generation by generation: `rpgFoeTierBudget(lifetime, rate, engine = BATTLE_ENGINE_VERSION)`
  multiplies the build part by `m` of the lifetime level's tier (⌈lifetime ÷ 50⌉) **from v17**; v16 and older are
  byte for byte today's. `rpgFoe` gains `engine` (live default) and passes it; the world's stage generator reads the live
  default (only new fights: a fight freezes its foes); the Rift's generator passes its fight's version (check `riftFight`
  reaches `rpgFoe` with it). Tier 1 doesn't move (m = 1 and ℓ = L).
- **`onCurveStars(classId, level, engine)`** (`world/balance-party.ts`): from v17 the core nodes her level opens
  (`planet:n` from Lv 10n − 9, each moon's `n` from Lv 10n − 4), every class the same, no template moon. H81 builds the
  v17 member's points with `mapPoints` on them.
- **Star Gems retire in the rules:** nothing v3 reads `world.gems` or the gem catalog; the Lapidary's v3 catalog is H77's.
- **No parse, no screen, no manual change.** `pnpm docs:update` leaves no diff (`foe-scaling`, `gems`, `active-slots`
  read the live generation).
- **Main JS:** `economy/planet.ts` is small tables; say the number.

## Do

1. **`economy/planet.ts`** as decided, with a module comment citing EP1–EP8, EP13–EP17, EP23, UT10.
2. **`save/save.ts`** and the readers: `StarsV1`, `StarMap`, the union and helpers; narrow the domain's and the web's
   readers until `pnpm -r tsc` passes, with no behaviour change.
3. **`save/observatory.ts`:** `setJewel`, `jewelNodes`.
4. **`save/battle.ts`:** the map's points in `partyMembers` and `umaPointParts` (H75 edits `partyMembers` at the same
   time: rebase on whichever lands first).
5. **`rpg/campaign/enemies.ts`, `world/world.ts`, `rift/generate.ts`:** EP16 by generation; **`world/balance-party.ts`:**
   `onCurveStars`' v17 branch.
6. **The fixture:** `save/economy-v3.fixture.ts` gains a `StarMap` helper and templates per knack and channel (invented).
7. **Tests:**
   - `economy/planet.test.ts`: the 22 ids in map order; grades, gates (Lv 1, 11, 21, 31, 41; 6, 16, 26, 36, 46; her moon 16
     and 36) and jewels; the Planet's and a moon's per-node rows and sums in Tiers 1–3 (21 · 38 · 55; 30 · 54 · 78); EP
     §3.3's Prowess node table for all six classes in Tiers 1–3 (and the sums 30/0, 21/9, 24/6 … 78/0, 55/23, 63/15);
     Vigor and Guard; her moon for each knack and both channels in Tiers 1–3 (Fleet +2.4% and Gritty +1.6 in every tier);
     a full Tier 1 map for a Spell Blade gives HP +255, MP +51, ATK +42, M.ATK +30, DEF +51, M.DEF +51 after
     `applyPoints`.
   - `rpg/campaign/foe-budget-v17.test.ts`: at lifetime 50, 100 and 150, v17's `rpgFoeTierBudget` is 2.715, 2.719, 2.721
     (HP and defense) and 1.49, 1.491, 1.492 (offense) to three places; v16's is unchanged at every lifetime level 1–150
     (Tier 2 Lv 50 about ×1.96, D170); `onCurveStars` at v17 gives a stat with its moon +1, +3, +5, +9, +13, +19, +25,
     +33, +41, +51 at Lv 1, 6 … 46 (EP §3.4) and the same 20 ids for every class at Lv 46; v15 and v16 unchanged.
   - `save/observatory-v3.test.ts` (mocked to 17): a Lv 1 Uma sets `jewel-planet-1` on `planet:1` (the count falls);
     `jewel-planet-2` at Lv 10 is "Opens at Lv 11"; `jewel-moon-2` on `prowess:2` before `prowess:1` is "Set Moon Jewel I
     first"; `jewel-moon-3` on `vigor:2` is refused as not fitting; `jewel-moon-2` opens `template:1` at Lv 16 and
     `jewel-moon-4` `template:2` only after it; `jewelNodes` lists Prowess, Vigor, Guard and her moon, the one furthest
     behind first; a v1 map is "Not graded".
   - `save/battle-v3.test.ts` (added cases, mocked to 17): a graded Tier 1 Lv 46 Spell Blade (Tireless, physical calling)
     with the full core and both her moon's nodes enters with HP +255 + 20, MP +51, ATK +42, M.ATK +30, DEF +51 + 8,
     M.DEF +51 over her projected stats plus her armor; as a Mage the next fight's map gives ATK +21, M.ATK +51; the same
     map in Tier 2 gives +92 to a stat with its moon.
8. **Docs:** implementation.md §3: "Built: H76 (D…)". `pnpm docs:update`: no diff.
9. **Check it locally** (your own ports, 390×844, desktop browser): the Observatory sets a Star Gem and toggles nodes as
   before; a world-map fight starts at the live version with today's foes.
10. **D-row:** fetch `main` first; log this packet's decisions.

## Done when

- [ ] `pnpm lint && pnpm test && pnpm build` pass; say the main JS number.
- [ ] The tests in step 7 pass; the v14 and v15 replays pass live and mocked to 17.
- [ ] `docs/game/` is unchanged, `pnpm docs:update` leaves no diff, the D-row is logged, implementation.md has its line.
- [ ] The local check in step 9 was done and described. Nothing from the original games in git.
- [ ] Deployed green and https://uma-rpg.web.app/api/health shows the commit.

## Deliver

- **Claude, as a delegated worker:** a pull request from `feat/h76-extra-stats-v3` with one commit,
  `feat(domain): Extra Stats v3, the Planet, three moons, her moon and jewels, dark (H76)`. H75 edits `save/battle.ts`
  and the fixture at the same time: rebase on whichever lands first. Fetch `main` before you push. The main session
  reviews and merges it, then watches the deploy.
- **Flag it done:** after the merge, a `docs(handoff): H76 done (D…)` commit deletes this file, sets H76 to Done with a
  Done row, and sets H78 (if H75, H77 and R1's H69 are done) and H81 (if H75, H77 and R1's H71 are done) to Ready.
