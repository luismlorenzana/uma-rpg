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
  A Wilds place's quick look uses its compact live slot rows: start, collect, repeat and stopped-queue recovery stay two
  or three taps from the map.
- **Routes:**
  - `/` returns to the last page you viewed.
  - Every screen is a place (D31), with no other top-level routes.
  - A link to a place under another page, such as an old link or a push, moves to the place's own page. A link to a
    place R2 removed (the Ley Spring, Crystal Cavern, Quarry, Meadow or Fossil Dig) opens the Wilds page.

<!-- live:places -->
### Town Hall (`town`)

| Place | Id | Kind | Uma slots | What it is |
|---|---|---|---|---|
| Stable | `stable` | town | — | Every Uma outfit, locked or yours. Uma Tickets open new ones. |
| Party Hall | `party-hall` | town | — | Twenty parties of five. |
| Warehouse | `warehouse` | town | — | Every item you own: materials and made items. |
| Exchange | `exchange` | town | — | Laurels buy raw items and tickets here; Marks buy Manuals. |

### Learning (`learning`)

| Place | Id | Kind | Uma slots | What it is |
|---|---|---|---|---|
| Brawler Dojo | `brawler-dojo` | class-hall | 4 | The Brawler Hall of Heroes: four Heroes, each with her own Limit Break, and their Learners. |
| Mage Tower | `mage-tower` | class-hall | 4 | The Mage Hall of Heroes: four Heroes, each with her own Limit Break, and their Learners. |
| Spell Blade Salle | `spell-blade-salle` | class-hall | 4 | The Spell Blade Hall of Heroes: four Heroes, each with her own Limit Break, and their Learners. |
| Summoner Circle | `summoner-circle` | class-hall | 4 | The Summoner Hall of Heroes: four Heroes, each with her own Limit Break, and their Learners. |
| Paladin Bastion | `paladin-bastion` | class-hall | 4 | The Paladin Hall of Heroes: four Heroes, each with her own Limit Break, and their Learners. |
| Cleric Chapel | `cleric-chapel` | class-hall | 4 | The Cleric Hall of Heroes: four Heroes, each with her own Limit Break, and their Learners. |
| Observatory | `observatory` | town | — | Each Uma's Extra Stats map: a Sun, eight planets and their moons. |

### Battle (`battle`)

| Place | Id | Kind | Uma slots | What it is |
|---|---|---|---|---|
| Scenario Gate | `scenario-gate` | battle | — | The world map: five continents of regions to clear. |
| The Rift | `tier-finale` | battle | — | Twenty Lv 50 Umas seal four fronts, then ascend together. |

### Wilds (`wilds`)

| Place | Id | Kind | Uma slots | What it is |
|---|---|---|---|---|
| Mine | `mine` | gather-site | 4 | Mining: ores into ingots. |
| Forge | `forge` | station | 4 | Weapon Crafting: Weapon Gems. |
| Forest | `forest` | gather-site | 4 | Wood Chopping: logs into planks. |
| Armorer | `armorer` | station | 4 | Armor Crafting: Armor Fittings. |
| Fields | `fields` | gather-site | 4 | Farming: vegetables for kitchen cuts. |
| Workbench | `workbench` | station | 4 | Material Processing: raw into refined. |
| Fishery | `fishery` | gather-site | 4 | Fishing: fish into fillets. |
| Charm Shop | `charm-shop` | station | 4 | Accessory Crafting: Accessory Settings. |
| Monster Den | `monster-den` | gather-site | 4 | Hunting: stones into cut stones. |
| Lapidary | `lapidary` | station | 4 | Jewel Crafting: Planet and Moon Jewels. |
<!-- /live -->

The Wilds hold the ten places (R2, PP4–PP6): one row a trade, its gathering place on the left and its making place on
the right, the trunk road between (Mine and Forge, Forest and Armorer, Fields and Workbench, Fishery and Charm Shop,
Monster Den and Lapidary), each with four slot pips. Town Hall keeps its four places in the corners around the
plaza. The Battle page holds the Scenario Gate and the Rift on a drill ground of its own, with flagstone roads,
banners, weapon racks, training dummies and torches (H31, D148). The Rift draws uma-art's `rift` building (its place keeps
the Tier Finale's id, `tier-finale`, and names its frame in `Place.frame`, H50).
- **A place can wait on its world** (`placeOpen` and `placeLock`, `hub/places.ts`): the Rift opens with five Lv 50 Umas
  in Tiers 1 and 2. Shut, its building carries a lock, its quick look says "Opens at five Lv 50 Umas · 3/5" (or "No
  Rift in this tier yet" in Tier 3), it has no Enter, the menu locks it, and a link to its page goes to the quick look.

### Wilds

The ten places, four slots each at ×1.25 from day one, with nothing to upgrade ([loops](loops.md#craft-level)). The
halls seat Heroes instead ([Halls of Heroes](heroes.md)).

<!-- live:facilities -->
| Place | Profession | Job | What it does | Its trade (callings) |
|---|---|---|---|---|
| Mine | Mining | Gathering | Gathers metal | Brawler |
| Forge | Weapon Crafting | Making | Makes Weapon Gems | Brawler |
| Forest | Wood Chopping | Gathering | Gathers wood | Spell Blade |
| Armorer | Armor Crafting | Making | Makes Armor Fittings | Spell Blade |
| Fields | Farming | Gathering | Gathers vegetables | Paladin, Cleric |
| Workbench | Material Processing | Processing | Processes every line, raw into refined | Paladin, Cleric |
| Fishery | Fishing | Gathering | Gathers fish | Summoner |
| Charm Shop | Accessory Crafting | Making | Makes Accessory Settings | Summoner |
| Monster Den | Hunting | Gathering | Gathers stone | Mage |
| Lapidary | Jewel Crafting | Making | Makes Planet Jewels and Moon Jewels | Mage |

Every place has 4 slots at ×1.25 from day one, and nothing to upgrade. An Uma works her trade's two places; a place whose trade has no Uma in the world is an open shop, taking everyone until one arrives.
<!-- /live -->

**A place's page** (`places/work/FacilityPage.tsx` and `PlaceV3.tsx`), one page for all ten:
- **Header:** "Mine · Mining · 4 slots · ×1.25", with **Collect here** when work is ready and **Finish all · 14 Speed
  Tickets** when two or more of its slots are running. Finish all asks "Finish 3 jobs for 14 Speed Tickets?", or says
  "Needs 14 Speed Tickets" when the wallet is short. A place whose trade has no Uma in the world says so under it:
  "Open shop: no Brawler in this world" ("no Paladin or Cleric" at the Fields and the Workbench).
- **One shared slot row per slot:** a free row starts a job; a working row shows its Uma, item, progress and queue.
  Ready work has **Collect** and **Repeat**. A running row has **Speed up** (−30m or Finish), **Queue next**, queue
  ordering and removal, and **Recall** with a preview of what is paid, returned or lost.
- **For your targets** (D100, D126): a horizontal strip of what the targets still need here. Each icon names its grade,
  a badge is the short count, a check means work already covers it, and tapping a short item opens that job in a free slot.
- **A stopped queue** (SC3): a card naming the Uma, the job that couldn't start and what it lacked, with **Restart** and
  **Dismiss**.
- **The shared job sheet:** Who → How many → What. A chosen amount stays selected while What changes (and clamps if a
  recipe allows less). Its Uma picker puts Craft Level on each face and opens her trade's Umas first (free, then highest
  Craft Level); the rest are greyed "Another trade", unless the place is an open shop. Locked Umas and workers show why
  they cannot start. Fighting does not block work (D119). Counts are 1–10, or ×1, ×4, ×8, ×20 or ×40 at the Workbench.
- **A gathering place's What step:** its line's types as tiles, one row a tier up to the world's, the low type then
  the high one, which says "From Craft Lv 26" until then; the chosen type's card says "Tier 1 · high · raw · Refines into
  Iron Ingot" and what's held.
- **The Workbench:** five columns, one a line (Metal, Wood, Vegetables, Fish, Stone), a row a tier and band ("T1 low",
  "T1 high" …), and the chosen refined type's card.
- **The Forge, the Armorer and the Charm Shop:** ten grade chips, each underlined in its material's tier colour (Tier 2
  amber, Tier 3 violet) with a legend, a grade above her Craft Level locked; the chosen grade's recipe card ("Weapon Gem
  G5 · Raises a weapon one grade", each refined item and how many are held).
- **The Lapidary:** one row a kind, Planet I–V and Moon I–V, the same chips and recipe card ("Opens Planet III").
- **Quick look:** "Mine · Mining · 4 slots · ×1.25", the open shop's line, the type icons (2, 4 or 6 by the world's
  tier) or the line's G1–G10 chips, and the four slots' rows.

**The Learning page** holds the six Halls of Heroes (D106; classes v2, H59), one page shared by all six
(`places/halls/HallPage.tsx`). The mirrors face each other across the road: Brawler Dojo and Mage Tower, Spell Blade
Salle and Summoner Circle, the **Paladin Bastion** (a stone keep with a blue banner) and the Cleric Chapel; the
Observatory stands below. Each hall shows its four seats: the seat's Limit Break with its kinds and the twin sets it
answers ("Answers Fire · Light"; engine v16, CP28), its Hero large on the left, and her Learners below with their Bond
Levels. Tap an empty portrait to seat a Hero, a Hero to swap her or empty the seat, `+` to add a Learner, and a Learner
to see her Bond or send her away. Its help says a Learner's inherited hits use the higher of her ATK and M.ATK. See
[Halls of Heroes](heroes.md).

Hero and Learner choices use the shared Uma picker, highest Uma Level first, then newest release and name. Ineligible
Umas remain visible with their reason: locked, already seated, already a Hero or Learner, or a seat/parent limit. A
Learner candidate's row adds the sets the seat answers that her active class's weapons miss ("Adds Light, Dark,
Twilight"); one that adds none shows nothing.
Small seats and Learners use faces; the large Hero portrait uses a bust. Eligibility and Bonds still come from the RPG.

## Town

### Stable

Routes: `/town/stable`, then `outfit/:id` and `outfit/:id/skills`.

- **Roster:**
  - All, Owned and Locked tabs, with counts.
  - Shared album views: **five columns of faces** by default, three columns of bust cards, or a one-column list.
  - Search, and a Filters sheet: rarity; surface, distance or running style A+; sex; New; Free now; active class; can
    upgrade; a **Template** group after RPG (engine v16, UT15): Calling (six), Stride (three), Knack (five) and, from R2,
    Signature (Pendant, Orb, Bell, Insignia), an owned Uma's calling pick counting; and a **Trade** group (PP21): "Mine ·
    Forge", "Forest · Armorer", "Fields · Workbench", "Fishery · Charm Shop", "Monster Den · Lapidary", each with its head
    count, locked outfits too. Search also finds her template's name ("ironhide" finds every Ironhide). "Can upgrade" is
    also the sheet's quick pick.
  - Seven sorts: Uma Level (the default, highest first), release, name, rarity, total base stats, Craft Level and
    Class Rank. Owned Umas stay before locked in either direction. Level ties use newest release, then name.
  - Corner badges: class top left, target bottom left, and bottom right New, or a green mark when
    she can upgrade.
  - Device preferences remember the query and view, plus up to **20 saved views**. The old Stable view and sort move
    over once, then their v2 key is removed. Nothing is added to the game save.
  - **New** means an outfit added since this device's first album visit, not seen yet. Opening its profile clears
    the badge; today's catalogue is marked seen on the first visit.
  - **Can upgrade** (H34): one tap makes her stronger now, as her active class. Making doesn't count.
    - Gear: a made item in the Warehouse that raises one of her slots now (the next grade, her level allowing), or an
      accessory slot at G1 or more with no family yet.
    - Extra Stats: a jewel in the Warehouse that opens one of her nodes now.
    - Skills never count: no skill costs points (engine v16, CP14).
- **An Uma's profile:**
  - **Header** (the kit's `ProfileFrame`, SD3): her bust, rarity and **template chip**, name, title and Uma Level, a
    target toggle; then her EXP, her **calling pick card** while it's open, a class chip (her class, Class Rank and her
    three weapons' icons), her Craft Level, and a Working or Party card. A locked one shows Unlock, confirmed in the
    kit's `UnlockConfirm` (Uma Tickets N → N − 1).
  - **The template chip** (engine v16, UT14): "★ Clever Spellwright" after her rarity stars, locked outfits too, a small
    tag that wraps to two lines beside "Mark target"; a green dot while an owned Uma's calling is open. It opens **Her
    template**: her name, the three readings with their sources ("Calling ← Pace A, Wit 102 ≥ Power 90", or "← picked";
    "Stride ← Medium A"; "Knack ← Wit +20%"), then her Flourish and its state ("★ Even pace · as a Mage · on", "· no
    effect as Brawler"; a locked outfit's has neither), her **Signature** (the family her knack names) and **Moon** lines,
    and her trade: "Trade · Monster Den · Lapidary".
  - **The calling pick card** (CP29): above her class chip, for a Pace or Late Uma until her calling is confirmed. "Her
    calling · choose once", two class tiles (emblem, class, "★ Clever Spellfencer" her name with that pick, "★ Even pace
    as a Spell Blade"), the suggested one marked ("Suggested · Power 96 over Wit 88") and her pick selected; tapping the
    other picks it. Each tile names the trade it gives and its head count in her world ("Forest · Armorer · 8 Umas").
    **Confirm**, and "Her first win confirms it." At Uma Lv 1 a pick moves her class too. While she has work started or
    queued, the other tile is off and the card says "Finish her work first": the pick moves her trade.
  - **Tabs:**
    - Skills, with every Class Rank bar;
    - Battle;
    - Gear: "Use the standard preset" (or "Standard preset on"), then her grade rows: three weapons ("Greatsword · G3 ·
      Might 8"), five armor slots ("Head · Helm · G2 · DEF +8") and her accessory ("Pendant · G4 · +2 on her three kinds
      · ★ +10", or "Accessory · G0 · Pick a form"), each with a pill that raises it ("G3 → G4 · 1 Weapon Gem G4") or says
      why not ("Needs Lv 16", "Already G10"). A row's sheet climbs several grades at once when the Warehouse holds each.
      The accessory sheet picks the family, her ★ family first, an Orb's kind (any of the ten) or a Bell's (one she
      holds), and says what the form gives; a line under the rows says "Wear a Bell for ★ +10" while she doesn't wear her
      family. Then the Extra Stats link ("8/22 open · map ›");
    - Work: her job, and her Craft Level with her trade: "Craft Lv 23 · Forest · Armorer";
    - Racing: her aptitudes, **Her template** (Calling, Stride, Knack and Flourish, each with its note: the calling's
      sources or "Picked", the Flourish's "Active" or "No effect as Brawler", a locked outfit's "As a Mage"), her racing
      base stats and growth, and her unique skill.
  - **Mark target**: up to ten Umas total; a target shows a crosshair in the Stable grid.
  - **Can upgrade marks:** a green dot on Gear while a slot or Extra Stats can be upgraded (no skill costs points, so
    Skills never dots). On the Gear tab and the Skills tab's weapon slots, each slot she can raise now has the green
    mark, and Extra Stats has a green "N to set" pill.
  - **Battle tab:** every battle stat, always listed, 0 included, in four groups (D140):
    - **Offense:** ATK, M.ATK, each weapon's Might, her accessory ("Pendant: +2 on her three kinds", "Orb: Fire +8",
      "Bell: Greatsword 0.4 after her Attack", "Insignia: +6% on sub-bosses and bosses", or "None") and, while she wears
      her family, her Signature ("+10 ★");
    - **Defense:** DEF, M.DEF, Evasion, damage cuts, starting Barrier and Veil, Thorns, Mirror;
    - **Sustain:** HP, a healer's Mends ("×1.33 (from M.ATK)" for a Cleric, "(from ATK)" for a Paladin), HP Regen,
      Lifesteal, MP with what she regains a round ("296 · +13 a round": the base regen by her Class Rank and her
      Spring's), MP Steal, and **★ Flourish** ("Even pace · 1% a round, up to 4%", or "No effect as Brawler");
    - **Other:** the Limit Break head start.

    Its help names Guts in HP, her accessory and signature as offense, and the healers' ATK and M.ATK.

    The six core stats show their total, then in brackets what gear adds (blue) and what Extra Stats add (green) (D99);
    her moon's points are starred. Might counts only for the hits of its own weapon. The domain builds the sheet (`umaBattleSheet`).
  - A locked outfit shows **Unlock · 1 Ticket**. An outfit another tier's world owns shows "In Tier n" instead, and in a
    tier above 1 an outfit nobody owns shows "Unlocked in Tier 1" (D5).
- **Skills page** (`SkillTree.tsx`, engine v16, H70; class-progression §6.1, CP23):
  - **The root plate:** her class's emblem and name and her hand by her slots' halves ("Spell Blade · Arms ×0.72 + Tome
    ×0.44"), then her ★ Flourish line ("★ Even pace · 1% of her max HP a round, up to 4%"), dimmed with "No effect as
    Mage" outside her calling's class.
  - Pick the **active class**, six in two rows of three, each with its emblem and Class Rank, then her **three weapon
    slots**: kind, its grade ("G3"), her line's letter, and the green mark when she can raise it. A slot's sheet lists
    each weapon of the slot's channel with its grade ("Lance · G2 · Might 4"); every class changes a slot's weapon within
    its channel (CP12). Grades are raised on the Gear tab.
  - The class's **Class Rank** bar, and the depths it opens (D102).
  - **Equipped · 4/7**, her equipped skills as chips (tap to unequip), and "Back to auto" or "Auto". No points line.
  - **The tree:** three tabs, one a slot (its kind and line letter), and the open tree drawn as a tree: depths 1–2 full
    width (the trunk), then a fork into the A and B columns down to depth 5, joined by lines filled on her path. Her
    line's nodes are outlined and the other's dimmed; a closed depth fades with its gate ("Class Rank 30"). Every node
    shows five rank pips and "Rank 3 · next at Class Rank 14" ("Rank 5" at the top), its line at her rank, and
    **Equip** on a held node at an open depth. Two columns at 375 pt.
  - **A branch header** ("A", "B · Combo", "B · Pierce") opens a sheet with its three skills, depth and gate each, and
    "Take branch B"; her equipped skills of that tree follow in place. Her own branch's sheet says "Her branch" and has
    no button.
  - The help explains her three slots, the trunk and fork, lines and Skill Ranks; the class help adds "A party fights
    with one healer at most: a Paladin or a Cleric."

### Party Hall

Routes: `/town/party-hall` and `:n` (1–20).
- The list shows 20 parties of five. Faces stay clear; Uma Level and class sit beneath each one. The chosen lead has a
  thin accent ring and flag. Working members fight like the rest (D119).
- **The editor:** rename the party, or tap a slot for the shared Uma picker, highest Uma Level first (newest release,
  then name for ties). Unowned Umas are hidden. Current members and Umas in an open fight show a disabled reason; all
  party members are gray, while a free Uma is full colour. A member of another party remains selectable and moves here
  (D46). Working does not stop her fighting (D119).
- Party slots show round outfit faces.
- **A filled slot:** Make party lead, Swap, View profile, Recall from her job, Remove. Lead is independent of slot order:
  choosing her never moves anybody. A party without one falls back to its first member.
- **One healer a party:** a party with two healers (Paladins or Clerics) shows "One healer a party" in the warning
  colour, on its card in the list and under the editor's slots. Picking Umas is never refused; the note goes once one
  of them fights as a damage class.

### Scenario Gate

Routes: `/battle/scenario-gate`, `c/:continent`, `r/:region`, `capital/:continent` and `fight`. The world map ([maps](maps.md)).

- **On every screen:**
  - the **active party bar**: swap the whole party through the shared picker, see each Uma's face and MP. A party
    uses its chosen lead's face and its highest member's level for ordering; partial parties stay selectable, empty ones
    stay hidden. The current party is labelled Active party, and an open fight locks swapping. Edit parties opens the Party
    Hall. A party with two healers shows "One healer a party" beside it;
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
    - foes by wave, elements, "Shield 4 · Weak:" and her twins' icons (the Arm first, then the element; Twilight's Bow
      and Katana), "Acts twice";
    - **Fight**: the first clear pays triple, replays pay a quarter. With two healers in the active party the button
      reads "One healer a party", disabled;
    - **Sweep** ×1, 5, 10 or All.
- **Fight** (`FightScreen.tsx`, Phaser stage `battle/scene/BattleScene.ts`):
  - **Header:** wave chip (W2/3), round, **Auto**, **speed** (1×, 2×, 4×) and a menu ("Back to the map" keeps the fight
    open; "Give up").
  - **Stage:** foes on top, in two rows from six; the party below, as busts in spaced, bordered cards with solid dark
    backgrounds.
  - **Foe cards:** each foe's element, a small "Weak:" and her weakness icons in the fight's own order, her shield.
  - **Controls:** a weapon row (her three weapons, in three columns), then **Attack**, **Skills** and **Guard**, and the
    **Limit Break** sheet. The line above says what a tap on a rival does:
    - a Spell Blade or a Summoner picks a pair, and the line names both halves, a Summoner's Tome half first ("Tap a
      rival: Snow Sentinel + Shield Knight · 16 MP", "Tap a rival: Fire Tome Attack + Greatsword Attack");
    - the Skills sheet counts a Spell Blade's extra hit on her Arms skills ("2 hits" for a one-hit cleave) and lists a
      healer's support ("heals the most hurt, Regen 2 rounds, cleanses, revives the fallen");
    - a lingering summon's farewell reads "<Uma>'s Snow Sentinel strikes every foe", then its hits land on each foe;
      a Cleric's Regen reads "<Uma> +90 HP · Regen";
    - her Flourish reads "Aster ★ +30 HP", Clean break's Barrier "Aster: ★ Barrier 37", and the round's MP back
      "+13 MP".

    A fight keeps its own rules: one started before engine v17 keeps its pieces and supports; one before engine v16
    still plays five weapons, v15's weaknesses ("weak" and its icons) and no base regen or Flourish; one before classes
    v2 a one-half Summoner and v14's support.
- **Result:** Victory or Defeated, Laurels, Class Marks, Uma Shards and Uma Tickets; for each Uma her EXP and level bar,
  and her Class Rank bar with a line under it for each skill that rose ("Cleave reached Rank 3"; a depth that just
  opened, "Sunder opened"; none for a fight before v16).
  Then "Fight again" or back to the map.
- The fight screen plays a **fight source** (`battle/fight-source.ts`, H50): the world map's is its open fight, the
  region's title and biome, and foes sized by rank; the Rift hands it its own ([The Rift](#the-rift)).

### Warehouse

The kit's `ShelfView` (SD3) as an icon grid with counts:
- **Shelves:** All, Metal, Wood, Vegetables, Fish, Stone and Made items. Materials stay raw then refined and tier by
  tier; made items stay line by line and grade by grade.
- **Grade chips:** every grade, the highest of each line, or one grade. They filter made items; materials have no grades,
  so their line shelves show no chips.
- The header counts both: "120 materials · 35 made items".
- A stock sheet says what it is ("Tier 1 · high · raw · Refines into Iron Ingot", "Grade 5 · Raises a weapon one grade",
  "Opens Planet III"), with Sell ×1, 10 or All for Laurels.

### Exchange

- Your Laurels and ticket counts.
- **Buy** (the kit's `ExchangeRows`, SD3): Speed Tickets, Sweep Tickets, and **raw materials** by line, every type of the
  world's tier and below with its tier and band ("Tier 1 · low · have 12"); a type not stocked yet is locked with the win
  that stocks it ("After the tier's first win", "After a win on continent 3"). A row's sheet offers ×1, ×5, ×10, ×25 or a
  typed quantity, the total, and "Need N more" when short.
- **Read a Class Manual** (D102): the shared Uma picker opens highest Uma Level first, with locked Umas disabled. Working
  Umas remain selectable. Then pick one of her six classes; each Manual turns 1,000 Class Marks into 1,000 EXP on it.

### Observatory

- A face and Choose an Uma open the shared picker, highest Uma Level first (newest release, then name for ties),
  with locked Umas disabled. Opens on the Uma named in its route, else the highest; working Umas remain selectable. The
  face's line counts her open nodes ("Open 8 of 20 · ★ 1 of 2").
- **Her map:** the Planet in the middle, Prowess, Vigor and Guard around it, five nodes each, and ★ her moon's two. Tap a
  node for its sheet: what it gives ("+4 to every stat", "as Brawler ATK +6, M.ATK +0", "HP +30, MP +6") and its jewel
  ("needs a Planet Jewel III · opens at Lv 21", or "Open"). Its help: "Each node opens with its jewel, in order. Every
  open node counts."
- Prowess's split ("Prowess · Brawler 100/0: ATK +6, M.ATK +0"), the six stats' totals with her moon's starred, and a
  **Set** list of the jewels she can set now (a Moon Jewel asks which moon), or "No jewels ready"
  ([loops](loops.md#extra-stats-and-gear)).

### Account

Reached from the account bar. The kit's `AccountPage` (SD3) with this game's content:
- Rename your trainer.
- **Tier n wallet**, the active tier's: Uma Tickets, Uma Shards and Laurels in Tier 1; Laurels, Speed Tickets and Sweep
  Tickets in a tier above 1.
- **Appearance:** System, Light or Dark, kept on this device (D147).
- Notifications.
- **The Tier rework's grant** (save v28, H80; tickets only since v29, D221): a row "The Tier rework's grant · 63,800 Speed Tickets" for a world with
  a grant, which reopens "The Wilds are rebuilt" ([loops](loops.md#the-tier-reworks-grant)).
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
    Paladin") and the **Convergence** card ("Seal all four fronts", "Assign four parties · 2 attempts", or "Fight 2 of
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
  the ward); on the next stage a party of the roster (the best fit for the front's guidance first, never one with two
  healers; others disabled with the reason, "One healer a party" among them), the **guided weapons** (engine v16, CP7:
  each member's three build weapons as icons under her face, "—" for one the build has no place for, and **Use the
  guided weapons**, which sets them in one save, or "On the guided weapons") and **Fight**.
- **The Convergence:** four slots, Iron, Arcane, Duel and Horde, each with its fight's "Foes" and a party (suggested
  by the fronts' guidance); **Begin** when the four cover the twenty (else "Missing: …"), which starts the attempt and
  its first fight. With an attempt on: its four parties, "Won · 6 rounds" or "Next", **Fight: Arcane** and "End this
  attempt" (confirmed).
- **An Echo's sheet:** the front and level, its foes, a party of five Lv 50 Umas, its guided weapons as on a stage
  sheet, and **Fight**; once won, **Sweep ×1** and **Sweep ×5** with the Sweep Ticket count. A Sweep's result shows like
  a win.
- **Fight:** the shared fight screen on the Twilight Rift's backdrop, titled "Iron front · Stage 5", "Convergence ·
  Fight 2 of 4" or "Echo · Iron · Lv 55". Foes stand and are tagged by their face ([combat](combat.md#the-rifts-foes));
  a warded foe carries her front's crest. Back and the menu return to the Rift ("Give up" ends a Convergence attempt).
- **Result:** Victory or Defeated and the rounds; then "Stage 5 cleared · 5/12" or "Iron sealed", "Fight 2 of 4 won",
  "The Rift is won!" or "The attempt is over"; an Echo's rank bars and Marks, with no EXP line, and its rank-up lines as
  on the world map's. Buttons: "Next stage"
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
