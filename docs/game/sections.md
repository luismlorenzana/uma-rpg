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

Three pages you switch by tab or by swiping (`hub/PageTabs.tsx`, `hub/swipe.ts`): **Wilds**, **Learning** and **Town**
(D144). Each page is a pixel-art map (`hub/scene/HubScene.ts`, Phaser) fitted to the screen.
The app uses a fixed edge-to-edge frame, with the bottom tab bar's safe-area padding under the home indicator (H30).
Place pages scroll inside that frame; the document behind them does not set the screen height.

- Places are DOM buttons over the map, each with:
  - a name pill;
  - slot pips showing the working Umas' faces in progress rings;
  - a "Ready" badge.
- A floating **Collect all · N ready** button collects every finished job.
- **Taps:** a place opens its **quick look** (`/:page?peek=:id`). Its **Enter** button opens the full page
  (`/:page/:placeId/*`) in a side overlay.
- **Routes:** `/` returns to the last page you viewed. Every screen is a place (D31), with no other top-level routes.

<!-- live:places -->
### Wilds (`wilds`)

| Place | Id | Kind | Uma slots | What it is |
|---|---|---|---|---|
| Monster Den | `monster-den` | gather-site | 3 | Gathers hides & scales while you're away, for the HP stat. |
| Ley Spring | `ley-spring` | gather-site | 3 | Gathers essences while you're away, for the MP stat. |
| Mine | `mine` | gather-site | 3 | Gathers ores while you're away, for the ATK stat. |
| Crystal Cavern | `crystal-cavern` | gather-site | 3 | Gathers crystals while you're away, for the M.ATK stat. |
| Quarry | `quarry` | gather-site | 3 | Gathers stones while you're away, for the DEF stat. |
| Meadow | `meadow` | gather-site | 3 | Gathers fibers while you're away, for the M.DEF stat. |
| Forest | `forest` | gather-site | 3 | Gathers woods while you're away, for the Speed stat. |
| Fossil Dig | `fossil-dig` | gather-site | 3 | Gathers bones & horns while you're away, for the Limit Break charge stat. |
| Workbench | `workbench` | station | 3 | Refines raw materials, one into one: ore into ingots, logs into planks. |
| Forge | `forge` | station | 3 | Crafts weapons, armor and accessories. |
| Lapidary | `lapidary` | station | 3 | Cuts Star Gems that open nodes on an Uma’s Extra Stats map. |

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
| Warehouse | `warehouse` | town | — | Every item you own: materials, Star Gems and gear. |
| Exchange | `exchange` | town | — | Laurels buy raw items and tickets here; Marks buy Manuals. |
| Observatory | `observatory` | town | — | Each Uma's Extra Stats map: a Sun, eight planets and their moons. |
| Tier Finale | `tier-finale` | town | — | The tier's final event, and promotion to the next tier. |
<!-- /live -->

The Wilds hold every facility: eight sites in two columns, and the Workbench, the Lapidary and the Forge across the
middle row, the Lapidary on the road between them (D144).

### Facilities

Every site and station is a facility: Uma slots, a level, jobs ([loops](loops.md#craft-level)). The halls seat Heroes
instead ([Halls of Heroes](heroes.md)).

<!-- live:facilities -->
| Place | Job | Makes | Upgraded with |
|---|---|---|---|
| Monster Den | Gather | Hides & Scales | Hides & Scales + Bones & Horns |
| Ley Spring | Gather | Essences | Essences + Woods |
| Mine | Gather | Ores | Ores + Crystals |
| Crystal Cavern | Gather | Crystals | Crystals + Ores |
| Quarry | Gather | Stones | Stones + Fibers |
| Meadow | Gather | Fibers | Fibers + Stones |
| Forest | Gather | Woods | Woods + Essences |
| Fossil Dig | Gather | Bones & Horns | Bones & Horns + Hides & Scales |
| Workbench | Refine | Refined items | Stones + Woods |
| Forge | Craft | Gear | Stones + Woods |
| Lapidary | Cut | Star Gems | Stones + Woods |
<!-- /live -->

**The facility page** (`places/work/FacilityPage.tsx`), for the eight sites, the Workbench, the Forge and the
Lapidary:
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
  item show on the right), then what to make, then how many: 1–10, or ×1, ×4, ×8, ×20 or ×40 at the Workbench (D139).
- **Forge:** the 40 types as icons only, four rows of ten, each physical then magical (D144): weapons and Tomes, armor,
  Arms and Element Orbs, Talismans and Amulets. Then the grade, and the picked piece's name, effect and recipe below. A
  type with no materials in stock is dimmed.
- **Lapidary:** tabs for Moons (eight planets × ten grades), Bridges and Sun, each gem an icon. Grades above her Craft
  Level are locked, gems without materials are dimmed, and a dot marks those the targets need. The picked gem shows the
  node it opens, what that node gives and its materials.

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
  - Seven sorts, grid or list. Opens on **Uma Level, highest first**; owned Umas stay before locked in either direction.
    Level ties use newest release, then name. These choices are remembered per device; H30 resets the old default once.
- **An Uma's profile:**
  - **Header:** Uma Level and EXP, a class chip, her Craft Level, and a Working or Party card.
  - **Tabs:**
    - Skills, with every Class Rank bar;
    - Battle;
    - Gear: five weapon slots, five armor slots, two accessory slots, the Extra Stats link, and Weapon, Armor and
      Accessory Rank cells;
    - Work;
    - Racing.
  - **Mark target** (D100): up to five Umas; a target shows a crosshair in the Stable grid.
  - **Battle tab:** every battle stat, always listed, 0 included, in four groups (D140):
    - **Offense:** ATK, M.ATK, each weapon's Might, Orbs;
    - **Defense:** DEF, M.DEF, Evasion, damage cuts, starting Barrier and Veil, Thorns, Mirror;
    - **Sustain:** HP, HP Regen, Lifesteal, MP, MP Regen, MP Steal;
    - **Other:** the Limit Break head start.

    The six core stats show their total, then in brackets what gear adds (blue) and what active Extra Stats add
    (green) (D99). Might counts only for the hits of its own weapon. The domain builds the sheet (`umaBattleSheet`).
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
- **The editor:** rename the party, or tap a slot to pick an Uma, highest Uma Level first (newest release, then name for ties).
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
- Materials (by family), Star Gems and Gear;
- a grade filter (G1–G10);
- a stock sheet with Sell ×1, 10 or All.

### Exchange

- Your Laurels and ticket counts.
- **Buy:** Time Tickets, Sweep Tickets, and raw items of the grades your continents unlock.
- **Manuals** (D102): pick an Uma, highest Uma Level first, then one of her bars (five classes, ten weapons, ten armor kinds); each Manual turns
  1,000 Gear or Class Marks into 1,000 EXP on it.

### Observatory

- Uma tabs, highest Uma Level first (newest release, then name for ties). Opens on the Uma named in its route, else the highest.
- Her Sun-and-planets map: tap a node to switch it on or off, up to her active limit. A locked node names the Star Gem
  that opens it.
- Effect totals, and a **Set** list of the Star Gems she can set now ([loops](loops.md#extra-stats-and-gear)).

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
