# Game sections

Every screen and what you do there. The place list is generated from `packages/domain/src/hub/places.ts`; screens live in
`apps/web/src/places/<place>/`, registered in `places/registry.tsx`.

## Getting in

The gates, in order: uma-kit's `BootGates` (uma-platform P56, SD3) with this game's steps (`apps/web/src/app/Root.tsx`):
1. Splash.
2. "Sign in with Google" (Firebase, through `uma-kit/auth`); after a failed redirect it says "Sign-in didn't finish".
3. The boot: the device save, else the server's. If it fails, a retry.
4. On first launch: pick a trainer name, then 20 Uma Tickets.
5. The start page: the last Hub page viewed on this device, when the app opened at `/`. The boot also picks the tier
   on screen ([Tiers](#tiers)).

The kit's toast offers "Update ready · Restart" when a new build is out.

## The Hub

Four pages, in the bottom bar's order: **Town Hall**, **Learning**, **Battle** and **Wilds** (D147). Tap a tab or swipe
sideways to the next page. Each page is a pixel-art map fitted to the screen (uma-kit's Hub scene, Phaser).

The app runs in uma-kit's shell, the same as uma-racer's (`hub/Shell.tsx`, D147):
- a fixed full-screen frame;
- the account bar on top;
- the bottom bar docked full width to the screen's bottom edge, its panel running under the home indicator (D149).

Place pages open between the two bars and scroll inside them. A fight hides both bars.

- Places are buttons over the map, each with:
  - a name pill;
  - slot pips showing the working Umas' faces in progress rings;
  - a "Ready" badge.
- **Town Hall's plaza** (D150): up to five small chibis stand on the road, each bobbing on its own beat.
  - The featured Uma is in front. She is the one picked on this device, or else the highest Uma Level.
  - The active party's other members stand round her, then the next highest levels.
  - Tap any of them for her sheet: Fight, Profile or "Feature another" (`?sheet=featured&uma=:id`).
  - An outfit without a chibi stands as a round token of her icon.
- A floating **Collect all · N ready** button collects every finished job.
- **Taps:** a place opens its **quick look** in the side panel (`/:page?peek=:id`). Its **Enter** button opens the
  place's page (`/:page/:placeId/*`). The Scenario Gate skips the quick look and opens its page at once.
  A facility's quick look uses its compact live slot rows: start, collect, repeat and stopped-queue recovery stay two
  or three taps from the map.
- **Routes:**
  - `/` returns to the last page you viewed.
  - Every screen is a place (D31), with no other top-level routes.
  - A link to a place under another page, such as an old link or a push, moves to the place's own page.

<!-- live:places -->
### Town Hall (`town`)

| Place | Id | Kind | Uma slots | What it is |
|---|---|---|---|---|
| Stable | `stable` | town | — | Every Uma outfit, locked or yours. Uma Tickets open new ones. |
| Party Hall | `party-hall` | town | — | Twenty parties of five. |
| Warehouse | `warehouse` | town | — | Every item you own: materials, Star Gems and gear. |
| Exchange | `exchange` | town | — | Laurels buy raw items and tickets here; Marks buy Manuals. |

### Learning (`learning`)

| Place | Id | Kind | Uma slots | What it is |
|---|---|---|---|---|
| Brawler Dojo | `brawler-dojo` | class-hall | 4 | The Brawler Hall of Heroes: four Heroes, each with her own Limit Break, and their Learners. |
| Mage Tower | `mage-tower` | class-hall | 4 | The Mage Hall of Heroes: four Heroes, each with her own Limit Break, and their Learners. |
| Spell Blade Salle | `spell-blade-salle` | class-hall | 4 | The Spell Blade Hall of Heroes: four Heroes, each with her own Limit Break, and their Learners. |
| Cleric Chapel | `cleric-chapel` | class-hall | 4 | The Cleric Hall of Heroes: four Heroes, each with her own Limit Break, and their Learners. |
| Summoner Circle | `summoner-circle` | class-hall | 4 | The Summoner Hall of Heroes: four Heroes, each with her own Limit Break, and their Learners. |
| Observatory | `observatory` | town | — | Each Uma's Extra Stats map: a Sun, eight planets and their moons. |

### Battle (`battle`)

| Place | Id | Kind | Uma slots | What it is |
|---|---|---|---|---|
| Scenario Gate | `scenario-gate` | battle | — | The world map: five continents of regions to clear. |
| The Rift | `tier-finale` | battle | — | Twenty Lv 50 Umas seal four fronts, then ascend together. |

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
<!-- /live -->

The Wilds hold every facility: eight sites in two columns, and the Workbench, the Lapidary and the Forge across the
middle row, the Lapidary on the road between them (D144). Town Hall keeps its four places in the corners around the
plaza. The Battle page holds the Scenario Gate and the Rift on a drill ground of its own, with flagstone roads,
banners, weapon racks, training dummies and torches (H31, D148). The Rift draws uma-art's `rift` building (its place keeps
the Tier Finale's id, `tier-finale`, and names its frame in `Place.frame`, H50).
- **A place can wait on its world** (`placeOpen` and `placeLock`, `hub/places.ts`): the Rift opens with five Lv 50 Umas
  in Tiers 1 and 2. Shut, its building carries a lock, its quick look says "Opens at five Lv 50 Umas · 3/5" (or "No
  Rift in this tier yet" in Tier 3), it has no Enter, the menu locks it, and a link to its page goes to the quick look.

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
- **Shared facility header:** level, used slots, total slots, speed, **Upgrade**, and **Collect here** when work is ready.
- **One shared slot row per slot:** a free row starts a job; a working row shows its Uma, item, progress and queue.
  Ready work has **Collect** and **Repeat**. A running row has **Speed up** (−30m or Finish), **Queue next**, queue
  ordering and removal, and **Recall** with a preview of what is paid, returned or lost.
- **For your targets** (D100, D126): a horizontal strip of what the targets still need here. A badge is the short
  count, a check means work already covers it, and tapping a short item opens that job in a free slot.
- **A stopped queue** (SC3): a card naming the Uma, the job that couldn't start and what it lacked, with **Restart** and
  **Dismiss**.
- **The shared job sheet:** Who → What → How many. Its Uma picker opens free Umas first, then highest Craft Level, Uma
  Level, newest release and name. Locked Umas and workers show why they cannot start. Fighting does not block work
  (D119). Counts are 1–10, or ×1, ×4, ×8, ×20 or ×40 at the Workbench (D139).
- **Forge:** the 40 types as icons only, four rows of ten, each physical then magical (D144): weapons and Tomes, armor,
  Arms and Element Orbs, Talismans and Amulets. Then the grade, and the picked piece's name, effect and recipe below. A
  type with no materials in stock is dimmed.
- **Lapidary:** tabs for Moons (eight planets × ten grades), Bridges and Sun, each gem an icon. Grades above her Craft
  Level are locked, gems without materials are dimmed, and a dot marks those the targets need. The picked gem shows the
  node it opens, what that node gives and its materials.

**The Learning page** holds the five Halls of Heroes (D106), one page shared by all five (`places/halls/HallPage.tsx`).
Each shows its four seats: the seat's Limit Break with its kinds, its Hero large on the left, and her Learners below with
their Bond Levels. Tap an empty portrait to seat a Hero, a Hero to swap her or empty the seat, `+` to add a Learner, and a
Learner to see her Bond or send her away. The Observatory stands below the halls. See [Halls of Heroes](heroes.md).

Hero and Learner choices use the shared Uma picker, highest Uma Level first, then newest release and name. Ineligible
Umas remain visible with their reason: locked, already seated, already a Hero or Learner, or a seat/parent limit.
Small seats and Learners use faces; the large Hero portrait uses a bust. Eligibility and Bonds still come from the RPG.

## Town

### Stable

Routes: `/town/stable`, then `outfit/:id` and `outfit/:id/skills`.

- **Roster:**
  - All, Owned and Locked tabs, with counts.
  - Shared album views: **five columns of faces** by default, three columns of bust cards, or a one-column list.
  - Search, and a Filters sheet: rarity; surface, distance or running style A+; sex; New; Free now; active class; can
    upgrade. "Can upgrade" is also the sheet's quick pick.
  - Seven sorts: Uma Level (the default, highest first), release, name, rarity, total base stats, Craft Level and
    Class Rank. Owned Umas stay before locked in either direction. Level ties use newest release, then name.
  - Corner badges: class top left, working top right, target bottom left, and bottom right New, or a green mark when
    she can upgrade.
  - Device preferences remember the query and view, plus up to **20 saved views**. The old Stable view and sort move
    over once, then their v2 key is removed. Nothing is added to the game save.
  - **New** means an outfit added since this device's first album visit, not seen yet. Opening its profile clears
    the badge; today's catalogue is marked seen on the first visit.
  - **Can upgrade** (H34): one tap makes her stronger now, as her active class. Crafting doesn't count.
    - Gear: a better piece she can wear, in stock or her own, for one of her five weapons, an armor slot's kind, a
      worn accessory, or an empty accessory slot.
    - Points: her unspent side points, while a side skill of her five trees can be learned.
    - Extra Stats: a Star Gem in stock she can set, or an open node she can switch on.
- **An Uma's profile:**
  - **Header** (the kit's `ProfileFrame`, SD3): her bust, rarity, name, title and Uma Level, a target toggle; then
    her EXP, a class chip, her Craft Level, and a Working or Party card. A locked one shows Unlock, confirmed in the
    kit's `UnlockConfirm` (Uma Tickets N → N − 1).
  - **Tabs:**
    - Skills, with every Class Rank bar;
    - Battle;
    - Gear: the standard preset, five weapon slots, five armor slots, two accessory slots, the Extra Stats link, and
      Weapon, Armor and Accessory Rank cells;
    - Work;
    - Racing.
  - **Mark target**: up to ten Umas total; a target shows a crosshair in the Stable grid.
  - **Can upgrade marks:** a green dot on Skills while she has side points to spend, and on Gear while a piece or Extra
    Stats can be upgraded. The class chip's "N pts" shows in green only then. On the Gear tab, each slot that can take
    a better piece has the green mark, and Extra Stats has a green "N to set · N free" pill.
  - **Battle tab:** every battle stat, always listed, 0 included, in four groups (D140):
    - **Offense:** ATK, M.ATK, each weapon's Might, Orbs;
    - **Defense:** DEF, M.DEF, Evasion, damage cuts, starting Barrier and Veil, Thorns, Mirror;
    - **Sustain:** HP, HP Regen, Lifesteal, MP, MP Regen, MP Steal;
    - **Other:** the Limit Break head start.

    The six core stats show their total, then in brackets what gear adds (blue) and what active Extra Stats add
    (green) (D99). Might counts only for the hits of its own weapon. The domain builds the sheet (`umaBattleSheet`).
  - A locked outfit shows **Unlock · 1 Ticket**. An outfit another tier's world owns shows "In Tier n" instead, and in a
    tier above 1 an outfit nobody owns shows "Unlocked in Tier 1" (D5).
- **Skills page:**
  - Pick the **active class** and the **weapons in its five slots**, each shown as Training or its grade, with the green
    mark when it can take a better piece. A slot's sheet (shared with the Gear tab) lists her Training weapon and
    crafted pieces of each weapon the slot takes; Spell Blade, Cleric and Summoner can change the weapon, Brawler and
    Mage only the piece (D98). Each armor slot's sheet picks its physical or magical kind and the piece (D103).
  - The class's **Class Rank** bar, and the depths it opens (D102).
  - Browse her 5 or 10 **trees**, learn and forget side skills, and **equip** skills, or leave it on auto.

### Party Hall

Routes: `/town/party-hall` and `:n` (1–20).
- The list shows 20 parties of five. Working members fight like the rest (D119).
- **The editor:** rename the party, or tap a slot for the shared Uma picker, highest Uma Level first (newest release,
  then name for ties). Locked Umas, current members and Umas in an open fight show a disabled reason. A member of
  another party remains selectable and moves here (D46). Working does not stop her fighting (D119).
- Party slots show round outfit faces.
- **A filled slot:** Swap, View profile, Recall from her job, Remove.

### Scenario Gate

Routes: `/battle/scenario-gate`, `c/:continent`, `r/:region`, `capital/:continent` and `fight`. The world map ([maps](maps.md)).

- **On every screen:**
  - the **active party bar**: swap the whole party through the shared picker, see each Uma's face and MP. A party
    uses its highest-level member's face and level for ordering; partial parties stay selectable, empty ones stay
    hidden. The current party is labelled Active party, and an open fight locks swapping. Edit parties opens the Party Hall;
  - **Resume the open fight**, when there is one.
- **Map / List:** pixel maps by default, with the full lists one tap away; the choice is remembered on the device.
  The maps climb from low levels at the bottom, opening at the frontier. Biome icons also appear in the lists.
- **World:** five islands for the active tier's continents with stages cleared, under "Tier n · five continents" (in
  words: "four" for a partial tier). Levels read in their tier: "Lv 1–10" in Tier 1, "T2 Lv 1–10" in Tier 2. The tiers
  above with no world yet are locked.
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
  - **Stage:** foes on top, in two rows from six; the party below, as busts in spaced, bordered cards with solid dark
    backgrounds.
  - **Controls:** a weapon row, then **Attack**, **Skills** and **Guard**, and the **Limit Break** sheet.
- **Result:** Victory or Defeated, Laurels, Marks, Uma Shards and Uma Tickets; for each Uma her EXP and level bar, her Class Rank
  bar, and five Weapon and five Armor Rank cells, each glowing on a rank-up (D102). Then "Fight again" or back to the
  map.
- The fight screen plays a **fight source** (`battle/fight-source.ts`, H50): the world map's is its open fight, the
  region's title and biome, and foes sized by rank; the Rift hands it its own ([The Rift](#the-rift)).

### Warehouse

The kit's `ShelfView` (SD3) with this game's shelves:
- Materials (family by family, raw then refined), Star Gems and Gear, as icons with counts;
- grade chips: every grade, the highest of each line, or one grade;
- a stock sheet with what it is, and Sell ×1, 10 or All for Laurels.

### Exchange

- Your Laurels and ticket counts.
- **Buy** (the kit's `ExchangeRows`, SD3): Speed Tickets, Sweep Tickets, and raw items of the grades your continents
  unlock. A row's sheet offers ×1, ×5, ×10, ×25 or a typed quantity, the total, and "Need N more" when short.
- **Manuals** (D102): the shared Uma picker opens highest Uma Level first, with locked Umas disabled. Working Umas
  remain selectable. Then pick one of her bars (five classes, ten weapons, ten armor kinds); each Manual turns
  1,000 Gear or Class Marks into 1,000 EXP on it.

### Observatory

- A face and Choose an Uma open the shared picker, highest Uma Level first (newest release, then name for ties),
  with locked Umas disabled. Opens on the Uma named in its route, else the highest; working Umas remain selectable.
- Her Sun-and-planets map: tap a node to switch it on or off, up to her active limit. A locked node names the Star Gem
  that opens it.
- Effect totals, and a **Set** list of the Star Gems she can set now ([loops](loops.md#extra-stats-and-gear)).

### Account

Reached from the account bar. The kit's `AccountPage` (SD3) with this game's content:
- Rename your trainer.
- **Tier n wallet**, the active tier's: Uma Tickets, Uma Shards and Laurels in Tier 1; Laurels, Speed Tickets and Sweep
  Tickets in a tier above 1.
- **Appearance:** System, Light or Dark, kept on this device (D147).
- Notifications.
- **Achievements** (`achievements/AchievementList.tsx`, [loops](loops.md#achievements)): "n of N", then the earned
  ones, newest first, each with its badge, name and "21 Oct · Tier 1 run 2" (the Bestiary has no run), then the rest
  in catalog order, badge dimmed, with how each is earned. It lists Tier 1's seals and Rift Conquered, every other
  world's, and the nine titles; a seal reads "Iron Seal · Tier 1", and Untouched shows its front's crest beside it.
- **Info rows:** the tier world on screen, trainer since, Umas unlocked in every world, cloud save, game data version,
  app build.
- Sign out.

### The Rift

The end-of-tier event ([loops](loops.md#the-rift), [the Rift](../design/rift.md), H50). Routes: `/battle/tier-finale`,
`front/:front` (and `front/:front/:stage`, its sheet open), `convergence`, `signup` and `fight`. Screens in
`apps/web/src/places/rift/`. Open once the tier's world has five Lv 50 Umas.
- **Quick look:** the Rift's line, the Lv 50 count, or the run's four fronts ("5/12", "Sealed").
- **The Rift:**
  - "Tier 1 · Run 1 · 2 of 4 fronts sealed" (or the Lv 50 count), and "Resume the open fight" when a Rift fight is open;
  - no run: **Sign up twenty**, disabled with "12 of 20 at Lv 50" until twenty are;
  - a run: the four **fronts** (crest, name, "5/12" or "Sealed", the party guidance "2 Brawler · 2 Spell Blade ·
    Cleric") and the **Convergence** card ("Seal all four fronts", "Assign four parties · 2 attempts", or "Fight 2 of
    4 · Arcane");
  - a won run: **Ascend to Tier 2**;
  - the **Echoes:** four rows (crest, front) of Lv 45, 50 and 55, a ✓ on each won;
  - **Roster:** the run's twenty faces, with "Cancel sign-up" while the run is untouched.
- **Sign up twenty:** "Four parties" (the party picker, up to four, parties of five Lv 50 Umas) or "Twenty Umas" (the
  shared Uma picker, twenty, Lv 50 only), then a sheet of the twenty faces: "They fight this Rift together until it
  ends." · Sign up.
- **A front's chain:** its crest and count, its ward ("Wards Tomes" on Iron, "Wards Arms" on Arcane) and guidance, then
  twelve stages ("Stage 1" to "Champion"), each with its level, waves and foes and its leaders' faces: cleared ✓, the
  next ringed (the page opens on it), the rest locked. Any stage opens its **stage sheet**: the foes by wave as the
  fight will have them (face, elements, Boss or Elite by face, "Acts twice" or "Acts three times", shield, weaknesses,
  the ward); on the next stage a party of the roster (the best fit for the front's guidance first; others disabled
  with the reason) and **Fight**.
- **The Convergence:** four slots, Iron, Arcane, Duel and Horde, each with its fight's "Foes" and a party (suggested
  by the fronts' guidance); **Begin** when the four cover the twenty (else "Missing: …"), which starts the attempt and
  its first fight. With an attempt on: its four parties, "Won · 6 rounds" or "Next", **Fight: Arcane** and "End this
  attempt" (confirmed).
- **An Echo's sheet:** the front and level, its foes, a party of five Lv 50 Umas and **Fight**; once won, **Sweep ×1**
  and **Sweep ×5** with the Sweep Ticket count. A Sweep's result shows like a win.
- **Fight:** the shared fight screen on the Twilight Rift's backdrop, titled "Iron front · Stage 5", "Convergence ·
  Fight 2 of 4" or "Echo · Iron · Lv 55". Foes stand and are tagged by their face ([combat](combat.md#the-rifts-foes));
  a warded foe carries her front's crest. Back and the menu return to the Rift ("Give up" ends a Convergence attempt).
- **Result:** Victory or Defeated and the rounds; then "Stage 5 cleared · 5/12" or "Iron sealed", "Fight 2 of 4 won",
  "The Rift is won!" or "The attempt is over"; an Echo's rank bars and Marks, with no EXP line. Buttons: "Next stage"
  (the same five again while one party holds them, else the stage's sheet), "Retry", "Next: Arcane", "Fight again" or
  "Sweep again", and "Back to the Rift". An achievement earned plays its cut-in first, one at a time.
- **The finale** (H52): on the win that wins the run, before its achievements' cut-ins, a dark cut-in: "Tier 1", "The
  Rift is won", the champions' faces four to a row, revealed one after another (at rest under reduced motion), "Twenty
  Umas, four fronts, 14 champions" and Continue. The faces are every boss face of the four fronts' champions, Iron to
  Horde, then of the Convergence's four fights, each once: the faces the run fought.
- **Ascend** (a sheet): "20 Umas move to Tier 2 at Lv 1", "Ranks, skills and Extra Stats start over", "Their gear
  returns to Tier 1's stock", "Tier 2 gets 20,000 Laurels, 100 Speed Tickets and 3,450 Class Marks", and the reason
  when it can't yet. Ascend runs behind the tier veil and lands on the new tier's Town Hall.

## Tiers

Each tier is its own world, with its own Stable, parties, world map, Wilds, Warehouse, wallet and halls ([tiers](../design/tiers.md),
D159). The account, its achievements and each Uma's tier history are shared.
- **One world on screen at a time:** the active tier (`save/game.ts`, H35). Every screen reads its world and every
  action writes to it. A tier's world exists once the Rift below it has ascended Umas.
- **The tiers** (`TIERS`, `save/rules.ts`): three, as master data has, each with tiers.md §6's name and a look:

<!-- live:tiers -->
| Tier | Name | Look |
|---|---|---|
| 1 | Apprentice | Day |
| 2 | Adept | Dusk |
| 3 | Master | Night |
<!-- /live -->

- **The Tier sheet** (`?sheet=tier`, `hub/TierSheet.tsx`, H36): the top bar's crest opens it over the current page, and
  Back or ✕ closes it. One card per tier, 1 to 3:
  - a tier with a world shows its crest, "Tier n · Name", its Uma count ("No Umas yet", "1 Uma", "12 Umas") and its
    Rift (`riftLine`): "No Rift in this tier yet" (Tier 3), "The Rift opens at five Lv 50 Umas", "The Rift is open",
    "Rift run · 2 of 4 fronts sealed" or "Rift won · ready to ascend". The active tier's card has an accent border, and
    tapping it just closes the sheet;
  - a tier with no world is locked: its crest at half opacity, a lock, and "Promote Umas through the Tier n−1 Rift"
    (Tiers 2 and 3 until a Rift ascends).
- **Picking another tier** fades a veil in the page colour over the screen (120 ms), switches the active tier and lands
  on that tier's Town Hall in place of the sheet's entry, then fades the veil out (260 ms) once the new world has drawn
  (`hub/TierVeil.tsx`, rendered outside the shell so it survives the remount). Under reduced motion the switch is
  immediate, with no veil.
- **The looks** (uma-kit's `tint`): Tier 1 is day, the theme as it is. Tier 2 is dusk, an amber accent and a warm wash
  over the Hub map; Tier 3 is night, a violet accent and a deep blue wash. Only the accent changes, in light and dark:
  the bars' disc and marker, buttons, borders and sheets follow it. Fights keep their own dark stage.
- **Where the app opens:** a `?tier=n` link's tier, else the tier last viewed on this device (`rpg.tier`), else the
  highest tier whose world has an Uma, else Tier 1. Only a tier the save has a world for.
- **Switching** remounts the whole app on the new world, as a different app instance would: the bars, every place and
  the Hub's map start fresh. Nothing from one tier's screens survives into another's.
- **Links:** routes are the same in every tier. A link from outside carries `?tier=n` (a push notification's always
  does); the app switches to that tier when it has a world, then drops the param.
- **One Uma, one world:** an Uma lives in one tier world, and the save refuses an outfit two worlds own. A tier's lists
  and pickers show only its own Umas. Tier 1 also lists the outfits nobody owns, to unlock (D5); unlocking refuses an
  outfit another world owns.
- **Uma Tickets are Tier 1's** (D5): in a tier above 1 the top bar, the Stable's counter and its quick look show none.
- **The featured Uma** on Town Hall's plaza is remembered per tier.

## Global UI

- **Account bar** (top, `hub/Bars.tsx`):
  - your initial, which opens the Account, with the active tier's crest beside it, which opens the Tier sheet;
  - the active world's chips: **Laurels**, **Speed Tickets**, and in Tier 1 **Uma Tickets** with the Uma Shards toward
    the next (`N · s/5`). Laurels and Speed Tickets open the Exchange, and Uma Tickets the Stable;
  - Offline or Sync paused, when it applies.
- **Bottom bar:** Town Hall · Learning · **Battle** · Wilds · Menu, in five equal slots, docked to the bottom edge
  (D149). Battle is a disc in the tier's accent (gold in Tier 1) rising out of the bar. The active tab has a marker in
  the tier's accent on the bar's top edge and a filled icon. The Wilds tab counts the active world's jobs ready to collect.
- **Menu sheet** (`?sheet=menu`): every place by page, with a lock on locked ones, and the Account.
- **Tier sheet** (`?sheet=tier`): one card per tier, opened by the top bar's crest (see [Tiers](#tiers)).
- **Side panel:** a quick look slides in from the right. It closes with ✕, a swipe right, a backdrop tap, Escape or back.
- **Place pages:** they fill the space between the bars, and Back returns to where you opened them from. Bottom sheets
  are used for everything else (uma-kit's `Sheet`).
- **Appearance:** light or dark follows the phone unless the Account sets one. Fights stay dark either way.
- **Push notifications** (`apps/web/src/push/`, server `apps/api/src/push/`):
  - A server tick every five minutes sends "Work done" or "N jobs done": one notification per tier world with news,
    titled with its tier ("Tier 2 · Work done") when the save has several worlds.
  - Tapping one opens the place on its tier (`?tier=n`).
  - The app badge counts ready slots in every tier.
  - They need the Home Screen app on iOS.
