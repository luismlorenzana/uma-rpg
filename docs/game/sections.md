# Game sections

Every screen and what you do there. The place list is generated from `packages/domain/src/hub/places.ts`; screens live in
`apps/web/src/places/<place>/`, registered in `places/registry.tsx`.

## Getting in

The gates, in order (`apps/web/src/app/Root.tsx`):
1. Splash.
2. "Sign in with Google" (Firebase).
3. On first launch: pick a trainer name, then 20 Unlock Tickets.
4. The Hub.

A global toast offers "Update ready · Restart" when a new build is out.

## The Hub

Four pages you switch by tab or by swiping (`hub/PageTabs.tsx`, `hub/swipe.ts`): **Farmlands**, **Wilds**,
**Learning** and **Town**. Each page is a pixel-art map (`hub/scene/HubScene.ts`, Phaser) fitted to the screen.

- Places are DOM buttons over the map, each with:
  - a name pill;
  - slot pips showing the working Umas' faces in progress rings;
  - a "Ready" badge.
- A floating **Collect all · N ready** button collects every finished job.
- **Taps:** a place opens its **quick look** (`/:page?peek=:id`). Its **Enter** button opens the full page
  (`/:page/:placeId/*`) in a side overlay.
- **Routes:** `/` returns to the last page you viewed. Every screen is a place (D31), with no other top-level routes.

<!-- live:places -->
### Farmlands (`farmlands`)

| Place | Id | Kind | Uma slots | What it is |
|---|---|---|---|---|
| Fields | `fields` | farm-site | 2 | Grows grains while you're away, for the HP stat. |
| Orchard | `orchard` | farm-site | 2 | Grows fruits while you're away, for the MP stat. |
| Fishery | `fishery` | farm-site | 2 | Grows fish while you're away, for the ATK stat. |
| Herb Garden | `herb-garden` | farm-site | 2 | Grows herbs & spices while you're away, for the M.ATK stat. |
| Vegetable Garden | `vegetable-garden` | farm-site | 2 | Grows vegetables while you're away, for the DEF stat. |
| Mushroom Cave | `mushroom-cave` | farm-site | 2 | Grows mushrooms while you're away, for the M.DEF stat. |
| Sugar Grove | `sugar-grove` | farm-site | 2 | Grows sweets while you're away, for the Speed stat. |
| Nut Grove | `nut-grove` | farm-site | 2 | Grows nuts & seeds while you're away, for the Limit Break charge stat. |
| Pantry | `pantry` | station | 2 | Refines raw ingredients, one into one: wheat into flour, fruit into preserves. |
| Kitchen | `kitchen` | station | 2 | Cooks dishes that grow Extra Stats. |

### Wilds (`wilds`)

| Place | Id | Kind | Uma slots | What it is |
|---|---|---|---|---|
| Monster Den | `monster-den` | gather-site | 2 | Gathers hides & scales while you're away, for the HP stat. |
| Ley Spring | `ley-spring` | gather-site | 2 | Gathers essences while you're away, for the MP stat. |
| Mine | `mine` | gather-site | 2 | Gathers ores while you're away, for the ATK stat. |
| Crystal Cavern | `crystal-cavern` | gather-site | 2 | Gathers crystals while you're away, for the M.ATK stat. |
| Quarry | `quarry` | gather-site | 2 | Gathers stones while you're away, for the DEF stat. |
| Meadow | `meadow` | gather-site | 2 | Gathers fibers while you're away, for the M.DEF stat. |
| Forest | `forest` | gather-site | 2 | Gathers woods while you're away, for the Speed stat. |
| Fossil Dig | `fossil-dig` | gather-site | 2 | Gathers bones & horns while you're away, for the Limit Break charge stat. |
| Workbench | `workbench` | station | 2 | Refines raw materials, one into one: ore into ingots, logs into planks. |
| Forge | `forge` | station | 2 | Crafts weapons, armor and accessories. |

### Learning (`learning`)

| Place | Id | Kind | Uma slots | What it is |
|---|---|---|---|---|
| Brawler Dojo | `brawler-dojo` | class-hall | 4 | The Brawler Hall of Heroes: four Heroes, each with her own Limit Break, and their Learners. |
| Mage Tower | `mage-tower` | class-hall | 4 | The Mage Hall of Heroes: four Heroes, each with her own Limit Break, and their Learners. |
| Spell Blade Salle | `spell-blade-salle` | class-hall | 4 | The Spell Blade Hall of Heroes: four Heroes, each with her own Limit Break, and their Learners. |
| Cleric Chapel | `cleric-chapel` | class-hall | 4 | The Cleric Hall of Heroes: four Heroes, each with her own Limit Break, and their Learners. |
| Summoner Circle | `summoner-circle` | class-hall | 4 | The Summoner Hall of Heroes: four Heroes, each with her own Limit Break, and their Learners. |
| Armory | `armory` | armory | — | Arms and armor on display. |
| Jeweler | `jeweler` | armory | — | Orbs and fine settings. |

### Town (`town`)

| Place | Id | Kind | Uma slots | What it is |
|---|---|---|---|---|
| Stable | `stable` | town | — | Every Uma outfit, locked or yours. Unlock Tickets open new ones. |
| Party Hall | `party-hall` | town | — | Twenty parties of five. |
| Scenario Gate | `scenario-gate` | town | — | The world map: five continents of regions to clear. |
| Warehouse | `warehouse` | town | — | Every item you own: ingredients, materials, dishes and gear. |
| Exchange | `exchange` | town | — | Laurels buy raw items and tickets here; Marks buy Manuals. |
| Observatory | `observatory` | town | — | Each Uma's Extra Stats map: a Sun, eight planets and their moons. |
| Tier Finale | `tier-finale` | town | — | The tier's final event, and promotion to the next tier. |
<!-- /live -->

Farmlands and Wilds mirror each other site for site:
- Each farm site has a gathering twin that feeds the same stat.
- The Pantry mirrors the Workbench, and the Kitchen mirrors the Forge.

### Facilities

Every site and station is a facility: Uma slots, a level, jobs ([loops](loops.md#professions)). The halls seat Heroes
instead ([Halls of Heroes](heroes.md)).

<!-- live:facilities -->
| Place | Job | Profession | Makes | Upgraded with |
|---|---|---|---|---|
| Fields | Gather | Farming | Grains | Grains + Hides & Scales |
| Orchard | Gather | Farming | Fruits | Fruits + Essences |
| Fishery | Gather | Farming | Fish | Fish + Ores |
| Herb Garden | Gather | Farming | Herbs & Spices | Herbs & Spices + Crystals |
| Vegetable Garden | Gather | Farming | Vegetables | Vegetables + Stones |
| Mushroom Cave | Gather | Farming | Mushrooms | Mushrooms + Fibers |
| Sugar Grove | Gather | Farming | Sweets | Sweets + Woods |
| Nut Grove | Gather | Farming | Nuts & Seeds | Nuts & Seeds + Bones & Horns |
| Monster Den | Gather | Gathering | Hides & Scales | Hides & Scales + Grains |
| Ley Spring | Gather | Gathering | Essences | Essences + Fruits |
| Mine | Gather | Gathering | Ores | Ores + Fish |
| Crystal Cavern | Gather | Gathering | Crystals | Crystals + Herbs & Spices |
| Quarry | Gather | Gathering | Stones | Stones + Vegetables |
| Meadow | Gather | Gathering | Fibers | Fibers + Mushrooms |
| Forest | Gather | Gathering | Woods | Woods + Sweets |
| Fossil Dig | Gather | Gathering | Bones & Horns | Bones & Horns + Nuts & Seeds |
| Pantry | Refine | Farming | Farming refined items | Stones + Woods |
| Workbench | Refine | Gathering | Gathering refined items | Stones + Woods |
| Kitchen | Cook | Farming | Dishes | Stones + Woods |
| Forge | Craft | Gathering | Gear | Stones + Woods |
<!-- /live -->

**The facility page** (`places/work/FacilityPage.tsx`), for the 16 sites, the Pantry, the Workbench, the Kitchen and
the Forge:
- **Header:** level, slots and **Upgrade**.
- **For your targets** (D100, D126): what the targets still need from this facility, lowest grade first.
  - **Each line:** the total need, how many are in the Warehouse and how many are coming, then how many are short.
    "On the way" when jobs already cover it.
  - **Tapping a short line** starts it in a free slot.
  - **Badges:** the item picker badges every line the targets need ("Target ×3").
- **Collect everything ready.**
- **Each job card:**
  - Collect;
  - Repeat ×N;
  - −30m and Finish (Time Tickets);
  - Recall;
  - a queue of up to three.
- **Assigning:** pick an Uma (free ones first, then the highest level here and its EXP; the level and her time per
  item show on the right), then what to make, then how many: 1–10, or ×1, ×4, ×8, ×20 or ×40 at the Pantry and
  Workbench (D139).
- **Kitchen:** tabs for Dishes, Duo, Feasts and "Can cook now".
- **Forge:** a type picker in eight rows of five (Arms, Tomes, Physical and Magical armor, Arms and Element Orbs,
  Talismans, Amulets), then grade (D124).

**The Learning page** holds the five Halls of Heroes (D106), one page shared by all five (`places/halls/HallPage.tsx`).
Each shows its four seats: the seat's Limit Break with its kinds, its Hero large on the left, and her Learners below with
their Bond Levels. Tap an empty portrait to seat a Hero, a Hero to swap her or empty the seat, `+` to add a Learner, and a
Learner to see her Bond or send her away. The Armory and Jeweler stay closed. See [Halls of Heroes](heroes.md).

## Town

### Stable

Routes: `/town/stable`, then `outfit/:id` and `outfit/:id/skills`.

- **Roster:**
  - All, Owned and Locked tabs, with counts.
  - Search, and a Filters sheet: rarity; surface, distance or style A+; sex; New 24h; Free now.
  - Eight sorts, grid or list. These choices are remembered per device.
- **An Uma's profile:**
  - **Header:** Uma Level and EXP, a class chip, Farm and Craft Levels, and a Working or Party card.
  - **Tabs:**
    - Skills, with every Class Rank bar;
    - Battle;
    - Gear: five weapon slots, five armor slots, two accessory slots, the Extra Stats link, and Weapon, Armor and
      Accessory Rank cells;
    - Work;
    - Racing.
  - **Mark target** (D100): up to five Umas; a target shows a crosshair in the Stable grid.
  - **Battle tab:** each stat's total, then in brackets what gear adds (blue) and what active Extra Stats add (green)
    (D99). Armor adds up; ATK and M.ATK add the average Might of her Arms and of her Tomes, since each hit uses its own
    weapon's. Her Orbs' kinds and each accessory effect follow (D119, D124).
  - A locked outfit shows **Unlock · 1 Ticket**.
- **Skills page:**
  - Pick the **active class** and the **weapons in its five slots**, each shown as Training or its grade. A slot's sheet
    (shared with the Gear tab) lists her Training weapon and crafted pieces of each weapon the slot takes; Spell Blade,
    Cleric and Summoner can change the weapon, Brawler and Mage only the piece (D98). Each armor slot's sheet picks its
    physical or magical kind and the piece (D103).
  - The class's **Class Rank** bar, and the depths it opens (D102).
  - Browse her 5 or 10 **trees**, learn and forget side skills, and **equip** skills, or leave it on auto.

### Party Hall

Routes: `/town/party-hall` and `:n` (1–20).
- The list shows 20 parties of five. Working members fight like the rest (D119).
- **The editor:** rename the party, or tap a slot to pick an Uma.
- **A filled slot:** Swap, View profile, Recall from her job, Remove.

### Scenario Gate

Routes: `/town/scenario-gate`, `c/:continent`, `r/:region`, `capital/:continent` and `fight`. The world map ([maps](maps.md)).

- **On every screen:**
  - the **active party bar**: swap the party, see each Uma's MP;
  - **Resume the open fight**, when there is one.
- **Map / List:** pixel maps by default, with the full lists one tap away; the choice is remembered on the device.
  The maps climb from low levels at the bottom, opening at the frontier. Biome icons also appear in the lists.
- **World:** five islands for the Tier 1 continents with stages cleared; higher tiers locked.
- **Continent:**
  - ten rows of four regions under two headings, the continent's first five levels and its last five (D97);
  - **Spring** buttons between rows, ready or dry;
  - the **capital marker** opens its three Finals routes.
- **Region:**
  - its level range, then twelve stages, each with its level, locked, open or cleared, its waves, ★ boss or ♛ elite.
  - **The stage sheet:**
    - foes by wave, elements, weaknesses, shields, "Acts twice";
    - **Fight**: the first clear pays triple, replays pay a quarter;
    - **Sweep** ×1, 5, 10 or All.
- **Fight** (`FightScreen.tsx`, Phaser stage `battle/scene/BattleScene.ts`):
  - **Header:** wave chip (W2/3), round, **Auto**, **speed** (1×, 2×, 4×) and a menu ("Back to the map" keeps the fight
    open; "Give up").
  - **Stage:** foes on top, in two rows from six; the party below.
  - **Controls:** a weapon row, then **Attack**, **Skills** and **Guard**, and the **Limit Break** sheet.
- **Result:** Victory or Defeated, Laurels, Marks, Shards and Tickets; for each Uma her EXP and level bar, her Class Rank
  bar, and five Weapon and five Armor Rank cells, each glowing on a rank-up (D102). Then "Fight again" or back to the
  map.

### Warehouse

Shelf tabs:
- Farm, Craft, Dishes and Gear;
- a grade filter (G1–G10);
- a stock sheet with Sell ×1, 10 or All.

### Exchange

- Your Laurels and ticket counts.
- **Buy:** Time Tickets, Sweep Tickets, and raw items of the grades your continents unlock.
- **Manuals** (D102): pick an Uma, then one of her bars (five classes, ten weapons, ten armor kinds); each Manual turns
  1,000 Gear or Class Marks into 1,000 EXP on it.

### Observatory

- An Uma picker.
- Her Sun-and-planets map: tap a node to switch it on or off, up to her active limit.
- Effect totals, and an **Eat** list of dishes ([loops](loops.md#extra-stats-and-gear)).

### Account

Reached from the account bar.
- Rename your trainer.
- **Tier 1 wallet:** Tickets, Shards and Laurels.
- Notifications.
- **Info rows:** cloud save, game data version, app build.
- Sign out.

### Tier Finale

A locked place (a lock on the map and in the menu). Promotion to Tier 2 isn't built.

## Global UI

- **Account bar** (top):
  - your initial and name, and a Tier 1 chip;
  - Offline or Sync paused, when it applies;
  - Tickets, Shards and Laurels.
- **Menu sheet** (☰): every place by page (locked ones show a lock), and the Account.
- **Overlays:** full place pages slide in from the right at 88% width. They close with ✕, a swipe right, a backdrop tap,
  Escape or back. Bottom sheets are used for everything else (`ui/BottomSheet.tsx`).
- **Push notifications** (`apps/web/src/push/`, server `apps/api/src/push/`):
  - A server tick every five minutes sends "Work done" or "N jobs done".
  - Tapping one opens the place.
  - The app badge counts ready slots.
  - They need the Home Screen app on iOS.
