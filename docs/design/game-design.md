# Uma RPG — game design (v1.0, 2026-10-12)

> **Status: Tier 1 built through S7, W3 and the class rework; settled rules through D100.**
> This page records intent and the decisions behind the game. [The manual](../game/README.md) describes the running
> game and generates its lists from code (D92). The [decision log](../decisions.md) is append-only.
> Future-tier rules below are plans, not features. Only unanswered owner choices are marked as proposals.

## 1. What the game is

A personal party RPG on the owner's iPhone. Collect outfits, build parties, fight on the world map and run a Hub
where Umas farm, gather, cook, craft and train while the app is closed.

| Pillar | Intent |
|---|---|
| Collection | Unlock and level many Umas; each Tier 1 Lv50 Uma pays back an Unlock Ticket (D14, D40, D47) |
| A living Hub | Four pages of facilities, with work and training that continue offline (D21, D55) |
| Break battles | Shields, weaknesses, Limit Breaks and seeded replay; a world map instead of chapters (D53, D72, D91) |
| Make your own power | Dishes unlock Extra Stats; refined materials become bound equipment (D17, D28, D58, D86) |
| Symmetry | Mirrored families, grades, job times and recipe demand (D18–D20, D65, D86) |

The loop and its currencies are in [the manual](../game/loops.md). The design connection is
[fights feed the Hub](loop.md): tokens support training and cooking; forging takes materials, not tokens (D94).

## 2. Tiers

### 2.1 Tier = five scenarios, levels 1–50

A tier groups five scenarios in master-data release order, each covering ten levels (D2). **Only Tier 1 is
playable.** Its scenarios name five continents, not chapters (D72). The generated continent and region lists are in
[the world manual](../game/maps.md); the design is in [world/](world/README.md).

Each continent has forty regions in ten rows of four, twelve stages per region and five Springs. Twenty regions
climb the first five levels, twenty the last five; one party takes one region per half (D97). A tier still has
2,400 region stages (D71, D72). Capital Finals are separate work; their hooks do not implement them yet.

**[Proposed] (Q8)** A partially released later tier opens with its available scenarios; its Tier Finale waits for
the fifth. This is still an owner choice, not current behavior ([open questions](../open-questions.md)).

### 2.2 Tier worlds

The planned tier model keeps an independent roster, Hub, facilities, stock and progression in each world (D3, D15).
Promotion moves one Uma to the next tier; the old world and its other Umas stay.

| Planned carry-over | In the next tier (D15) |
|---|---|
| Uma Level | Starts at Lv1 |
| Base stat growth | Uses lifetime level: 50 × (tier − 1) + level |
| Profession levels, class ranks, gear levels, Extra Stats | Start over |
| Items and gear | Stay in the old world |

Tier 2 has no outfit unlocks; promotion is its planned entry. Later mechanics are not implemented.

### 2.3 Promotion and the Tier Finale

Every tier is intended to end with a harder event that tests more of the roster (D4).

**[Proposed] (Q6)** Manual, per-Uma promotion needs Lv50 and a Tier Finale win with her in the winning lineup.
Neither that requirement nor the Finale's form is approved. [Q6](../open-questions.md) retains the Gauntlet, Raid
and Siege options; Gauntlet first remains the recommendation. The Tier Finale and promotion are parked.

## 3. Collection (Tier 1 only)

Start with no Umas and 20 Unlock Tickets (D40). One Ticket unlocks one outfit permanently, after confirmation
(D14, D44). Shards arrive at Lv10/20/30/40/50; five automatically become one Ticket (D47, D51).
Thus one Uma reaching Lv50 replaces her unlock cost.

Above-level fights support catch-up EXP, capped at double (D48). Replays never run out but pay a quarter of the
first clear's EXP and Laurels, with a quarter chance per token; Sweeps pay the same replay rewards (D79).
Current counts, restrictions and prices are in [collection and parties](../game/loops.md#collection-and-parties)
and [Springs, replays and Sweeps](../game/loops.md#springs-replays-and-sweeps).

## 4. An Uma's levels

| Track | Range | Raised by | Intent |
|---|---|---|---|
| Uma Level | 1–50 | Fights and Sweeps | Stats, side points, Shards and Extra Stats capacity (D51, D58, D86) |
| Farm Level | 1–50 | Farm sites, Pantry, Kitchen | Ingredient grades and dishes (D60, D96) |
| Craft Level | 1–50 | Wilds sites, Workbench, Forge | Material grades and gear (D60, D96) |
| Class rank, per class | 1–5 | The class hall | Skill depths, with Uma-level gates (D77) |
| Weapon Level, per class | 1–10 | The class hall | Weapon grades (D70, D94) |
| Armor / Accessory Level | 1–10 each | Armory / Jeweler | Armor / accessory grades (D70, D94) |

**[Proposed] (Q7)** A third profession vertical may become a later tier's new mechanic. Its purpose and tier remain
open ([Q7](../open-questions.md)).

### 4.1 Aptitudes set learning speed

| Aptitude | Speeds up |
|---|---|
| Turf / Dirt | Farm / Craft jobs respectively (D54, D60) |
| Front / Pace / Late / End | Brawler / Mage and Spell Blade / Cleric / Summoner halls (D70) |
| Best distance | Armor Level at the Armory (D70) |
| Best running style | Accessory Level at the Jeweler (D70) |

A and S take half the base time; G takes all of it, with even steps between (D54). Facilities add their own speed.
Exact shares and times are in [pacing](pacing.md) and [training](../game/loops.md#training).

## 5. Classes

Every Uma can switch freely outside a fight; each class retains its weapons, learned sides and loadout (D49, D86).
Five classes replace the old six builds. Each acts once per turn and wields five different weapons: Brawler the
five Arms, Mage the five Tomes, Summoner three Tomes and two Arms, Spell Blade three Arms and two Tomes, Cleric any
five (D86). The weapons in her five slots are her trees; every Uma holds a grade-0 Training weapon of each kind, with
no stats, that fills a slot until she wears a crafted one (D98).

Class rank and Uma Level jointly open depths; cores are free and each class has the full side-point budget from
Uma Level (D73, D77, D86). One point per level buys sides, one side of each fork; forgetting refunds it.
The design is [the Class Sheet](class-rework.md). Current trees and numbers are in
[classes](../game/classes.md) and [skill trees](../game/skill-trees.md).

## 6. Learning District and assignments

Five class halls train their class rank and Weapon Level. The Armory trains Armor Level; the Jeweler trains
Accessory Level (D70). The four old distance armories are retired.

Each class step is six base hours and one Promotion Token; each gear-level step is three base hours and one
Mastery Token (D68, D94). Tokens are spent on start and returned on recall. Ranks arrive on collect; Time Tickets
apply to training too (D55, D74). Facilities start with two slots, then gain a third and finally speed (D54).
See the generated [facility list](../game/sections.md#facilities) and [training rules](../game/loops.md#training).

Twenty saved parties hold five Umas each. An Uma belongs to at most one party, but party members may work (D41,
D46, D55). A working member prevents the party fighting; recall pays finished outputs and refunds unmade inputs.
One Uma takes one job at a time. A fight locks its lineup and its entrants' work until it ends (D52, D55).

## 7. Equipment

### 7.1 Slots, grades and binding

The active class uses five weapons, one armor and one accessory (D86). The save keeps one equipped piece per
weapon type, plus armor and accessory, so another class can reuse already equipped gear. That is twelve stored
slots, of which seven affect a class at once. An empty weapon slot is the Training weapon of that kind (D98).

Ten grades match the material ladder. Craft Level gates the grade made; gear levels gate the grade worn, with no
Uma-level gate (D29, D70). Gear binds on equip and stays in her locker; it cannot move to another Uma or be sold
(D28, D59). A weapon's equip gate uses the best Weapon Level among classes that can wield it (`gearLevel`).
Details and generated recipes are in [the materials manual](../game/materials.md#gear).

### 7.2 Types and recipes

Ten weapons replace Spear, Short Sword and the staves: five Arms and five elemental Tomes; armor, Ring, Charm and
ten Orbs complete the catalog (D86). Recipes use four same-grade refined items, one from each prescribed family.
The accent no longer adds a material, and **the Forge takes no token** (D86, superseded for tokens by D94).
See [items](items.md#gear-recipes) and [forge](forge.md).

### 7.3 Balance

Gear and Extra Stats are complementary small stat-point budgets (D17, D58, D59). Lighter armor contributes more
Speed/evasion; heavier armor more defense or HP. Weapon offense is split across the class's five weapons (D86).
Foes include expected progression and world formation tuning (D59, D75, D91).
Exact values come from [combat](../game/combat.md) and [gear](../game/materials.md#gear), not a second design table.

## 8. Professions: gather → refine → make

### 8.1 Depth and parity

Raw → refined → cooked or crafted is the whole chain; there is no packaging step (D18–D20).
Each family has its own site and effect. Farm and Craft share grades, time and profession EXP.
Their recipes need not have identical input counts: D86 gear always takes four, while D65 dishes keep rotating sides.

### 8.2 Families and grades

Sixteen families, eight per side, pair across eight effects. Each has ten raw and ten refined items: 320 in all.
Grade k opens at profession Lv 5k − 4 (D18–D20, D54). Grades 9–10 carry legendary glints (D24).
The generated [family/site table and full item catalog](../game/materials.md) are the reference; [items](items.md)
explains the symmetry.

### 8.3 Refining

Every raw item has one same-grade refined partner. Pantry handles farming items; Workbench handles gathering
materials, one-for-one (D19, D55).

### 8.4 Making

Kitchen dishes unlock Extra Stats; Forge gear supplies equipment points and Orb kinds (D58, D86).
Cooking uses refined ingredients plus stat-specific Cooking Tokens. Forging uses refined materials only (D94).
Recipes and grade gates are in [kitchen](kitchen.md), [forge](forge.md) and the [materials manual](../game/materials.md).

### 8.5 Equal time and family demand

Every site produces at the same rate for a grade; both professions share one curve. Gathering and refining have
the same time; making is twice that, on both sides (D65). Every gathering family is used equally across the gear
catalog and every farming family equally across dishes; `economy/materials.test.ts` checks this (D86).
That is catalog symmetry, not a promise that any single party consumes equal quantities of every family.

### 8.6 Jobs

Jobs use timestamps, finish offline, reserve inputs on start and grant profession EXP on collect (D55).
Each slot may queue three more jobs for the same Uma; a short-input queue stops, and recall drops it (D62).
New jobs make 1–10 outputs, not the old 50-output batches (D65). Profession leveling takes weeks per Uma; the
roster's many facilities work in parallel while one party fights (D96, [pacing](pacing.md)).

## 9. Hub

Four freely swappable pages organize the loop (D21, D30). Farmlands and Wilds mirror each other, Learning holds
seven halls, and Town holds the roster, parties, map, inventory, Exchange and Observatory.
The generated [place registry](../game/sections.md) is the full list.

A tap opens a quick look; Enter opens the place's full page. Every screen is a place route (D31, D38, D43).
Phaser draws pixel terrain, props and buildings; DOM buttons carry names, workers and progress (D33, D64).
Scrolling/zooming is deferred, not built. Upgrades belong to the tier world (D54).
Player text stays short; helpful explanations sit behind a help button, never in placeholder paragraphs (D95).

## 10. Extra Stats: the Sun and its planets

Each Uma has 100 nodes: eighty moons, sixteen bridges and four Sun nodes (D58).
Eating unlocks the lowest node the dish can reach. Active capacity grows with Uma Level; swaps are free outside
fights. One total point is split over a node's effects. The generated dish list and current point values are in
[materials](../game/materials.md#dishes) and [Extra Stats](../game/loops.md#extra-stats-and-gear).

## 11. Laurels and the Exchange

Laurels are each tier world's currency. Wins and Sweeps earn them; selling stock earns a smaller amount (D27,
D62, D79). The Exchange sells raw items, Time Tickets, Sweep Tickets and tokens (D74, D80).
One won stage on a continent stocks its grade pair; profession production is independently gated by level.
A Time Ticket cuts thirty minutes from any job or training. A Sweep replays a cleared regular stage; it earns
replay EXP, Laurels and tokens without spending MP (D74, D79).
Prices and reward multipliers are generated in [the manual](../game/loops.md#laurels-exp-and-tokens).

## 12. Difficulty

Biomes vary signatures, formations and faces, not the continent's level curve (D72, D83, D85).
World tuning budgets foes by formation; shields and different weaknesses reward party rotation (D75, D91).
The shared weakness-aware Auto policy also drives the battle simulation (D89).
Field effects and home ground are later work, not current rules. The owner validates balance in play; simulators
supply measurements, not permission to retune. The Tier Finale's difficulty remains part of Q6.

## 13. What carried over, and what retired

| Kept | Replacement / retirement |
|---|---|
| Seeded combat, shields, Breaks, Limit Breaks, saved input/actions | Engine v7 adds eight foes, dual elements and waves (D52, D91) |
| Five class identities | Per-class five-weapon loadouts replace six builds and old hands (D86) |
| Party collection and passive jobs | Twenty parties, one world run, Springs instead of camps (D41, D55, D72) |
| Campaign battle-building helpers | World regions replace player-facing chapter maps (D72) |
| Timed shortcuts | Time Tickets replace Rush (D74) |
| Private foe art | Six biome-linked packs, never in git (D83, D85, D88) |
| Independent game economy | No Inspiration rewards or payments into uma-racer (D1) |

## 14. Next steps

The game as built is in [the manual](../game/README.md). Remaining work is ranked in
[the handoff queue](../handoff/README.md) and [backlog](../backlog.md).
Open owner choices are [Q6–Q8](../open-questions.md): the Tier Finale/promotion, later-tier professions and a
partially released tier. No design review, catalog authoring or initial scaffold remains pending.
