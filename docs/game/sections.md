# Game sections

Every screen and what is on it, as the game runs today (engine v19, save v32). This page says where things show; the
rules and numbers behind them are on the other pages, linked from each section. The place list comes from
`packages/domain/src/hub/places.ts`. Each place's screens live in `apps/web/src/places/<place>/`, registered in
`places/registry.tsx`; the shell and the Hub are `apps/web/src/hub/`.

## Getting in

The kit's `BootGates` with this game's steps (`app/Root.tsx`):
1. Splash.
2. **Sign in with Google** (Firebase, through `uma-kit/auth`). A failed redirect says "Sign-in didn't finish. Try
   again."
3. The boot: the device save, else the server's. If it fails: "The game couldn't open on this phone." and Try again.
4. First launch only: "Welcome, trainer", a trainer name (1–24 characters) and **Enter the Hub**. Tier 1 opens with 20
   Uma Tickets.
5. The start page: the last Hub page viewed on this device (`hub/start.ts`), Town Hall the first time. The boot also
   picks the tier on screen ([Tiers](#tiers)).

Once master data and the save are both in, save v32's trade step runs in a world whose class reset still waits for it
(`ClassResetTrades`, `settleClassesV3Trades`; [loops](loops.md#the-classes-are-rebuilt-save-v32)), once. The kit's
`UpdateNotice` says "Update ready · Restart" when a new build is out.

## The Hub

Four pages, in the bottom bar's order: **Town Hall**, **Learning**, **Battle** and **Wilds** (D147). Tap a tab or swipe
sideways to the next page. Each page is a pixel-art map fitted to the screen (`hub/HubScreen.tsx` on uma-kit's `HubMap`,
Phaser).

- **A place** is a button over its building: a name pill, its slot pips, a Ready badge when work waits, a lock while
  shut.
  - On the Wilds, four pips hang over each roof in a half arch: a free slot is a small dot, a working Uma her face in a
    progress ring with her Craft Level on its lower left. The Ready badge sits at the building's foot (D233).
  - A hall's pips are its seats' Heroes, two in the Warrior Dojo and the Mage Tower, four in the others. Town Hall's and
    Battle's places have none.
- **Town Hall's plaza** (`hub/Featured.tsx`, D150): up to five small chibis stand on the road, each bobbing on its own
  beat.
  - The featured Uma is in front: the one picked on this device for this tier, else the highest Uma Level.
  - The active party's other members stand round her, then the next highest levels.
  - An outfit without a chibi stands as a round token of her icon.
  - Tap one for her sheet (`?sheet=featured&uma=:id`): her bust, level and title, **Fight** (the Scenario Gate),
    **Profile**, and **Feature another**, a grid of the tier's Umas.
- **Collect all · N ready** floats over the map while any job is done. It collects every finished job and says "+12
  collected".
- **A tap** opens the place's quick look in the side panel (`/:page?peek=:id`), with **Enter {place}** when it has a
  page. The Scenario Gate skips its quick look and opens its page at once.
- **Quick looks** (each place's `Peek`; a place without one shows its line):
  - the Stable: Umas owned out of all, Uma Tickets (Tier 1) and the latest four unlocks;
  - the Party Hall: full parties out of twenty, Umas placed out of owned;
  - a hall: its seats, each with its Hero's face, its Limit Break and "3/10" Learners or "Open";
  - a Wilds place: [its compact page](#wilds);
  - the Rift: [its line and fronts](#the-rift);
  - the Warehouse, the Exchange and the Observatory: their line from the list below.
- **Routes** (`app/router.tsx`): `/:page` and `/:page/:placeId/*`, nothing else (D31). `/` returns to the last page
  viewed. A link to a place under another page (an old link, a push) moves to the place's own page. A link to a place
  that no longer exists (the Ley Spring, the Quarry, the Workbench, the Forge, the Charm Shop…) opens the page it names,
  without a quick look.

**The pages' maps:**
- **Town Hall:** the Stable and the Party Hall in the top corners, the Warehouse and the Exchange in the bottom ones,
  the plaza between. The Account is a Town Hall place with no building.
- **Learning:** the five Halls of Heroes, one per family (Halls v2, H133, D255; [heroes](heroes.md#the-five-halls)):
  physical-led halls on the left, magic-led on the right. The Warrior Dojo (the Brawler Dojo's id) and the Mage Tower on
  top, the Spellblade Salle and the Summoner Circle below them, the **Healer Sanctum** (`healer-sanctum`, uma-art's own
  temple) in the middle where the Paladin Bastion and the Cleric Chapel stood, the Observatory under it.
- **Battle:** a drill ground of its own, with flagstone roads, banners, weapon racks, training dummies and torches (H31,
  D148): the Scenario Gate above, the Rift below. The Rift keeps the Tier Finale's id, `tier-finale`, and draws
  uma-art's `rift` building (`Place.frame`, H50).
- **Wilds:** fifteen places in five rows of three, a row a line, in the order Metal, Vegetables, Wood, Fish and Stone.
  The gathering place is on the left, its workbench on the trunk road, its making place on the right (D230, H114). The
  rows sit at y 0.155 … 0.795 so they keep an even spacing on a short screen (D233).

**A place can wait on its world** (`placeOpen` and `placeLock`): the Rift opens with five Lv 50 Umas in Tiers 1 and 2.
Shut, its building carries a lock, its quick look says "Opens at five Lv 50 Umas · 3/5" (or "No Rift in this tier yet"
in Tier 3), it has no Enter, the menu locks it, and a link to its page goes to the quick look.

Every place, page by page. Its line shows in the place's (i), and is the quick look of a place without its own:

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
| Warrior Dojo | `brawler-dojo` | class-hall | 4 | The Warrior Dojo: power from self-training. Four Heroes, each with her own Limit Break, and their Learners. |
| Mage Tower | `mage-tower` | class-hall | 4 | The Mage Tower: power from self-study. Four Heroes, each with her own Limit Break, and their Learners. |
| Spellblade Salle | `spell-blade-salle` | class-hall | 4 | The Spellblade Salle: power from pacts with familiars. Four Heroes, each with her own Limit Break, and their Learners. |
| Summoner Circle | `summoner-circle` | class-hall | 4 | The Summoner Circle: power from familiars, summoned. Four Heroes, each with her own Limit Break, and their Learners. |
| Healer Sanctum | `healer-sanctum` | class-hall | 4 | The Healer Sanctum: power from a followed deity. Four Heroes, each with her own Limit Break, and their Learners. |
| Observatory | `observatory` | town | — | Each Uma's Extra Stats: a Planet, three moons and her own moon. |

### Battle (`battle`)

| Place | Id | Kind | Uma slots | What it is |
|---|---|---|---|---|
| Scenario Gate | `scenario-gate` | battle | — | The world map: five continents of regions to clear. |
| The Rift | `tier-finale` | battle | — | Twenty Lv 50 Umas seal four fronts, then ascend together. |

### Wilds (`wilds`)

| Place | Id | Kind | Uma slots | What it is |
|---|---|---|---|---|
| Mine | `mine` | gather-site | 4 | Mining: metal, G1–G10. |
| Mine Workbench | `mine-workbench` | station | 4 | Smelting: ores into ingots. |
| Weapon Forge | `weapon-forge` | station | 4 | Arms Crafting: Arms Gems. |
| Fields | `fields` | gather-site | 4 | Farming: vegetables, G1–G10. |
| Fields Workbench | `fields-workbench` | station | 4 | Prepping: vegetables into cuts. |
| Tome Forge | `tome-forge` | station | 4 | Tome Crafting: Tome Ink. |
| Forest | `forest` | gather-site | 4 | Wood Chopping: wood, G1–G10. |
| Forest Workbench | `forest-workbench` | station | 4 | Sawing: logs into planks. |
| Armorer | `armorer` | station | 4 | Armor Crafting: Armor Fittings. |
| Fishery | `fishery` | gather-site | 4 | Fishing: fish, G1–G10. |
| Fishery Workbench | `fishery-workbench` | station | 4 | Filleting: fish into fillets. |
| Charm Forge | `charm-forge` | station | 4 | Accessory Crafting: Accessory Settings. |
| Monster Den | `monster-den` | gather-site | 4 | Hunting: stone, G1–G10. |
| Den Workbench | `den-workbench` | station | 4 | Stonecutting: stones into cut stones. |
| Lapidary | `lapidary` | station | 4 | Jewel Crafting: Planet and Moon Jewels. |
<!-- /live -->

A hall's line is its lore and its tail ("The Warrior Dojo: power from self-training. Four Heroes, each with her own Limit
Break, and their Learners."), and its details open with its seats' home classes ("Home: Arms Spellblade 1–2, Tome
Spellblade 3–4"), from `learningPlaces`' engine v19 generation (H133). An old link to `/learning/paladin-bastion` or
`/learning/cleric-chapel` (a bookmark from before save v32) lands on `/learning/healer-sanctum`,
keeping the rest of the path, the query and the navigation state (`movedPlace`, read in `PlaceRoute` only for an id
with no place).

### A place's page

`places/PlacePage.tsx`: uma-kit's place header over a scrolling body, between the bars.
- **Back** returns to where the page was opened from: a sub-view to its place, a place to its Hub page.
- The place's name and its (i), which shows its line.
- A counter: Uma Tickets on the Stable (Tier 1 only), full parties out of twenty on the Party Hall, Laurels on the
  Scenario Gate and the Exchange.

A shut place's page sends you to its quick look.

## Town Hall

### Stable

Routes: `/town/stable`, then `outfit/:id/:tab` (her profile's Class, Gear, Stars or Template tab). A bare `outfit/:id` opens
the last profile tab used on this device; a tab named in the route wins. The old `outfit/:id/skills` lands on the Class tab.

**One profile, many doors** (H124, D271; `profile-tabs.ts`, `profile-nav.ts`): every door pushes, so the place header's Back returns
to it, and passes the list ‹ › step through. A link out (the facts row's Party and Work, the Limit sheet's hall, Class Manuals)
pushes too, and Back returns to her on the same tab.

| Door | Opens on | ‹ › step through |
|---|---|---|
| Stable roster, a face | The remembered tab; with the Can upgrade filter on, the first tab with a dot (Class, Gear, Stars, Template). Back restores the roster's scroll | The roster's owned Umas, in the view's sort and filter |
| Party Hall, **View profile** | Class | The party, in slot order |
| World map's party bar, a face | Class | The active party |
| Rift, a guided Uma | Class | That guidance's Umas |
| Plaza, **Profile** | The remembered tab | No list: the roster's |
| Observatory, a row | Stars | That list, jewels ready first |
| Hall of Heroes, **Profile** in a Hero's or a Learner's sheet | Class | That seat's Hero and Learners |
| A Wilds place, a worker's face | The remembered tab | That place's workers, in slot order |
| A shared link | Its tab | The roster's |

**‹ 3/26 ›** sits in the place header on a profile (the roster's Uma Tickets go: they stay in the top bar). A step keeps the tab,
closes any open sheet, returns to the top and replaces the history entry, so Back still returns to the door; the ends wrap. It
hides with one Uma in the list and on a locked profile. Arrows only, no swipe.

**The roster** (`StablePage.tsx` on the kit's `AlbumChrome` and `AlbumGrid`; rows and facets in `album/rows.ts`):
- "Stable" and "26/270 owned", then All, Owned and Locked tabs with counts. Tier 1 also lists the outfits nobody owns,
  to unlock; a later tier lists only its own Umas ([Tiers](#tiers)).
- **Views:** five columns of faces (the default), three columns of bust cards, or a one-column list. Under each face:
  her title (or her rarity stars) and her best aptitudes; sorted by Craft Level or Class Rank, that number instead.
- **Corner badges:** her class top left, a crosshair bottom left on a target, and bottom right **NEW** or the green
  can-upgrade mark.
- **Search** finds her name, title or template name ("ironhide" finds every Ironhide).
- **Filters**, with a "Can upgrade" quick pick:
  - Collection: rarity, real horse (mare, stallion or unknown), New, Free now;
  - Aptitudes: surface, distance and running style at A or better;
  - RPG: Class, her active class, the thirteen in the tree's order (the five Tier 0s, then Brawler, Arms Spellblade, Arms
    Summoner, Paladin, Cleric, Tome Summoner, Tome Spellblade, Sorcerer); Can upgrade;
  - Template: Calling (the five Tier 0s, read from her running styles: Warrior, Spellblade, Mage, Summoner, Healer),
    Stride (three), Knack (five) and Signature (Pendant, Orb, Charm, Insignia);
  - Trade: "Mine · Weapon Forge", "Forest · Armorer", "Fields · Tome Forge", "Fishery · Charm Forge" and "Monster Den ·
    Lapidary", each with its head count, locked outfits too.
- **Seven sorts:** Uma Level (the default, highest first), release, name, rarity, total base stats, Craft Level and
  Class Rank. Owned Umas stay before locked in either direction; ties go to the newest release, then the name.
- **Device preferences** (`album/preferences.ts`): the query and view, and up to 20 saved views. Nothing goes in the
  save. **NEW** marks an outfit added since this device's first visit and not opened yet; the first visit marks the
  catalogue of the day as seen.
- **Can upgrade** (`upgradesFor`, as her active class; `album/upgrades.ts`): a promotion waiting (she fights as a Tier 0 at Rank 10
  with a child she doesn't hold, `umaPromotionWaits`), a weapon, armor or accessory slot she can raise now (its made item in the
  Warehouse, her level allowing), an accessory slot at G1 or more with no family yet, or a jewel in the Warehouse that opens one of
  her nodes now. Her template never counts: it is optional (D274).

**Her profile** (`OutfitProfile.tsx` in the kit's compact `ProfileFrame`; its contract is [Uma profile
v2](../design/uma-profile-v2/proposal.md#9-the-contract-that-replaces-d229), D239):
- **Header:** a 64 px bust, her name, title and rarity stars, "Lv 50", the EXP bar and the **target** icon (up to ten
  targets; the Wilds plan what maxing them takes, D100). The place header's Back is the only Back.
- **Facts:** one row of three 44 pt doors. **Party** reads "Party 1", "Fighting" or "No party" and opens the party
  editor or list. **Work** reads "Mine · 1h 20m", "Mine · Done" or "Idle" and opens that place (an idle Uma opens her
  trade's first place). **Details** opens what she hits with and her stats, read-only. Back from Party or Work returns to
  this profile and tab.
- **Details (H140):** two pages in one sheet, and it always opens on the first.
  - **Damage:** one row for each of her class's three weapons: its kind's glyph, the total, and its parts in parentheses,
    `86 (70 +8 +6 +2)`: her ATK or M.ATK, the weapon's Might, her Orbs on that kind and her signature, each in its source's color,
    zero parts dropped. A strip under each row shows the same parts, scaled to her largest row. That sum is what a fight uses before
    the skill and the foe ([combat](combat.md#damage)). Below them a key, then a line for each stat her weapons use:
    `M.ATK 70 · base 52 · armor 10 · accessory 3 · Stars 5`, ★ for her Moon. An Insignia reads `Bosses +3%` beside the title.
  - **Stats:** HP, MP, DEF, M.DEF and Evasion as tiles, and a healer's Mends.
  - **All stats** swaps the page, and ‹ Details returns: one column. Offense, Defense, Sustain and Other preserve every row of
    `umaBattleSheet`, including 0; stat rows show their base, armor, accessory and Stars parts, with her Moon marked ★. Core lists
    Speed, Stamina, Power, Guts and Wit with the racing base and growth. Work lists Craft Level and EXP, grades and trade; Since
    lists her unlock date. **How stats add up** expands the formula one source a line.
- **A locked outfit** has a dimmed portrait, no level and no tabs. Its facts row becomes **Unlock · 1 Ticket**, "In
  Tier 2" or "Unlock in Tier 1"; its Template content remains below. The unlock uses the kit's `UnlockConfirm`.
- **Tabs:** Class, Gear, Stars and Template, always in that order; the last one used is remembered on the device. Class
  carries a Ready dot while a promotion waits, Gear while a grade can rise, Stars while a jewel can be set. Template never does:
  her uniqueness is optional (D274).

**Class tab** (`ClassTab.tsx`, `class-sheets.tsx`, `ClassesSheet.tsx`, `PromotionSheet.tsx`, `WeaponSheet.tsx`, `class-view.ts`;
H120, D267; the rules are [classes](classes.md#the-class-tree) and [skill trees](skill-trees.md)). Every change here is free,
and a tap opens one sheet.
- **First row:** the **class tile** (emblem, name, "R34", a thin Class Rank bar; a Tier 0's "R7/10" with its bar to 10), her
  three **weapon tiles** (the glyph and her line's letter A or B, none on a Tier 0; a tap shows that tree, with a ring), and
  the (i). While she fights as a Tier 0 at Rank 10 with a child she doesn't hold, the tile reads "R10 · Promote" with the
  green Ready dot, the Class tab carries a dot and her roster face the can-upgrade mark.
- **The class tile** opens **Classes**, the class tree, or, while a promotion waits, the promotion sheet:
  - **Classes:** Warrior · All-Rounder · Mage over five columns, the Tier 0 row (Warrior, Spellblade, Healer, Summoner,
    Mage) over the Tier 1 rows (Brawler, Arms Spellblade, Paladin, Arms Summoner, Sorcerer; Tome Spellblade, Cleric,
    Tome Summoner), each Tier 1 class under its All-Rounder parent or its only one. Each tile: emblem, name and its word,
    "R34" (On, the accent fill; or Held, raised), "R7/10" on a Tier 0, **Ready** with a green dot (a child of a Tier 0 she
    holds at Rank 10), "R1 · free" dashed (a Tier 0 she hasn't started), **Closed** at 40%. A later tier's world has no
    Tier 0 row and every Tier 1 class "R1 · free" until she starts it.
  - A tap selects (a ring) and writes the line under the tree: "Arms Summoner · Ready", "2 Arms + 1 Tome · Area ·
    lingers", its preset's weapons and "Hand · Arms ×0.57 · Tome ×0.46" (a Tier 0: "Any 3 weapons · Drill Strike" and
    "Promotes to Brawler, Arms Spellblade, Arms Summoner"), and "Party 1: 2 healers" in the warning colour when the
    selected healer would make two in her party.
  - The footer acts on the selection: **Fight as Arms Spellblade** or **Start Summoner · R1** (free; the sheet stays open,
    the class On), **Promote to Arms Summoner** (the promotion sheet replaces this one on that child), and on a closed one
    its gate, "Opens with Spellblade R10 or Mage R10", disabled. On her own class it is her **standard preset** (`presetRows`;
    D263): one row, "Standard preset" or "Standard preset · On", with her class's emblem, "Lance · Greatsword · Light Tome" and
    "Pendant · Pendant · Orb" under it. A Tier 0 shows a "Standard preset" heading and one row for each class it promotes
    into, each with that class's emblem and name ("Paladin", "Cleric · On"). A tap sets those weapons and all three
    accessory slots, her ★ family first; no grade moves ([classes](classes.md#standard-presets)).
  - **Class Manuals ›** ("Exchange") opens the Exchange's Manual sheet on her at `/town/exchange/manual/:outfitId`; its
    Back returns to the Class tab with Classes open.
  - **The promotion sheet** ("Promote · Warrior R10", "Free · the others stay open"): one tile a child, **Suggested** on
    the suggested one (opened on it, or on the Ready tile's child), **Held** on one she holds; each with its slots, the
    preset she lands on and role, a row the same on every tile left out. Under them "Warrior R10 → Brawler R11" and "Depths 1–2 · 6
    skills · +400 EXP" (the EXP waiting on her Tier 0 lands at once). **Promote to Brawler** (free, no confirm) closes it
    and the tab shows the Brawler's first tree; on a held child **Fight as …**. **Classes ›** swaps back to the tree.
- **Equipped 4/7**: one square per skill slot her Uma Level gives, each equipped skill with its kind marks and rank; empty
  squares are dashed. A tap opens its node sheet: nothing unequips on a tap. **Auto** is On while the game picks for her;
  while she has her own pick, a tap returns to auto.
- **A Tier 1 class's tree** ("Lance tree", with **Change ›**): two trunk nodes, a fork, then lines A and B down to depth 5,
  each under a square A or B button, the held line's filled.
  - A node is a circle with the skill's kind marks and a badge: its rank, or the Class Rank that opens a closed depth.
  - Held nodes have an accent ring; equipped ones are filled. The other line is dimmed and a closed depth faded. The lines
    fill along her path.
- **A node's sheet:** its name, five rank pips, "Rank 3 · next R36" ("Rank 5" at the top, "R30" while closed), "Depth 4 · Line
  B", and its line at her Skill Rank ("one foe · 2 hits · 1.4× · 12 MP · cuts through the shield"). Its footer: **Equip**,
  **Unequip**, at a full loadout **Replace**, which lists what she equips so a tap swaps one; **Take line A** on the other
  line; closed, "Opens · R40", disabled. The sheet stays open on its new state.
- **A line's sheet** ("Lance · Line B · Impale"): its three skills, each with "Depth 3 · Line B · R20" and its line; **Take
  line B** (free; her equipped skills follow), or "Held", disabled.
- **A Tier 0's trees** are one node each and no fork: "Drill Strike · Greatsword", its line at her Class Rank ("one foe · 1 hit
  · 2.1× · 10 MP") and "R7/10"; its sheet has no pips ("Rank 7 · next R8", "Depth 1 · Trunk"). Under it "Promotion at R10 · 3
  to go" with a bar to Rank 10, or at Rank 10 "Promotion · +400 EXP waiting" ("Promotion · Ready" with none), which opens the
  promotion sheet.
- **Change ›** opens the slot's sheet ("Slot 1 · Arms", a Tier 0's "Slot 1 · Any"): each weapon of the slot's channel (all
  ten for a Tier 0, Arms first) with its grade line ("Lance · G2 · Might 4"), "Held", or "Slot 2" when she holds it in
  another slot, which swaps them. A tap holds it and the sheet stays open. Grades are raised on the Gear tab.
- **Limit**, one row at the bottom: the Limit Break Auto fires, "{Limit Break} · Learner · Bond 2/10" (" · +1" for a second
  Hero), "{Limit Break} · Hero", or "None". Its sheet has a block for each Limit Break she casts ("Learner · Warrior Dojo ·
  Seat 2", "Bond 2/10 · Strength 60%", "Next · 3/12" of the Bond EXP to the next level, "Hero · {name}", "Power · ×2.5 · ×0.95 as
  Brawler"; a Hero's reads "Hero · Strength 100% · Bond 3/10"), then every other Bond she has. With two blocks a tap selects
  one. **Open {hall}** opens that hall, or her class's hall with none; its Back returns here with the sheet open.
- The (i) on the first row covers switching, one healer a party, depths, Skill Ranks, equip slots, Tier 0, promotion and
  Heroes and Learners, one rule a line.

**Gear tab** (`GearTab.tsx`, `gear-view.ts`, `gear-equip.ts`, `gear-v3.ts`; H121, D268; the rules are
[classes](classes.md#armor-and-the-accessory), [loops](loops.md#gear) and [materials](materials.md#gear)): one view of eleven
tiles, Gear's budget one screen at 390×844. Weapons are chosen on the Class tab and raised here.
- **First row:** "Physical · 3 ready" (her class's armor half, then the ready slots; "Physical" alone with none), **Raise all**
  while a slot can rise, and the (i) with the grades', the forges' and the accessories' rules, one a line.
- **Weapons**, **Armor** and **Accessories:** three, five and three tiles. A tile shows its icon, its grade badge and one stat
  ("Might 45", "DEF 32", "HP 105", "MP 18", "M.DEF 28", "Evasion 4.8%"); an accessory what the slot does ("ATK +4", "Lance +8",
  "Bosses +4%"), "Charm · Off" at G0, "Empty" with no family, or "Greatsword not held" in the warning colour on an Orb left on
  a kind she no longer holds. A slot at G0 is an empty frame. The green Ready dot marks a slot that can rise now, or an
  accessory slot at G1 or more with no family: the very list the tab's dot and the roster's mark count.
- **A weapon's or armor's sheet** ("Axe · Slot 2", "Head · Physical"): before → after at display size ("G6 → G8", "Might 26 →
  45"; "DEF 32 → 36 · ATK 4 → 5", an unchanged stat left out), each grade's cost ("Arms Gem G7 ×1 · 2 held"), and **target grade
  chips** up to G10, a grade above her level faded with its "Lv 41". It opens on the highest grade the Warehouse covers; a tap on
  a chip picks another, and a grade the stock doesn't cover stays tappable. The footer is **Raise to G8**, or disabled with what's
  missing ("Arms Gem G7 ×0", "Lv 41"). At G10 it reads "G10 · Max" with no button. The sheet stays open on the new grade.
- **An accessory's sheet** ("Accessory 1 · G4"), the same raise with "Pendant · G4 · ATK +4 · ★ +5" and "★ Signature · ATK/M.ATK +5
  · Worn" on top, and its list: one row a choice, her ★ family first, then Pendant, Charm, an Orb for each weapon she holds, and
  Insignia, with what each does at the slot's grade ("ATK +4"; "G1: ATK +1" at G0). The row she wears is ringed with a ✓. **A tap
  wears the row and closes the sheet** (D266): there is no Set button, so what a tile shows is what the save holds.
- **Raise all:** every ready slot as far as items and level allow, one line each ("Axe G6 → G8 · Arms Gem G7 ×1 · G8 ×1"), then
  "Uses 4 items". Slots draw on the stock in the tab's order, and one the stock no longer covers stops lower or drops out.
  **Raise 3** spends it all in one save write.

**Stars tab** (`StarsPanel.tsx`, `stars-view.ts`, `StarChart.tsx`, `star-chart.ts`; H122, D269, H142, D277; the rules are
[loops](loops.md#extra-stats) and [jewels](materials.md#jewels)):
- **First row:** "Extra Stats · Open 13/22 · 2 ready" ("Extra Stats · Open 4/22" with none ready), **Set all** while a jewel fits,
  and the (i): each node opens with its jewel in order, a Planet node takes three, her moon takes none, Set all's rule.
- **Her star chart,** on the night sky in both themes: the Planet in the middle on its ring, Prowess, Vigor and Guard on one orbit around it,
  and her own moon's two beside a crescent. Each moon draws a figure, clockwise from I: Prowess a spearhead, Vigor a pentagon, Guard a shield.
  Each star carries its numeral, its jewel's numeral, and each body a label with its count ("Guard 3/5", "★ Bruiser 1/2"). **Open** is filled, with
  the line to it lit; **Ready** (a jewel in the Warehouse opens it now) has a green dot and a slow pulse; **Next** is a bright ring; **Later** a dim one.
  A full body closes its figure. A star opens its sheet; a body opens the sheet on its next node, its last when full. The crests are vector
  stand-ins until uma-art's own (H141, H144).
- **The six totals** ("HP +125", "MP +25", "ATK +25", "M.ATK +13", "DEF +19", "M.DEF +19") of the shared map, then her moon's line in
  the accent ("★ Evasion +2.4% · DEF +8").
- **A node's sheet** ("Guard III", "★ Bruiser's moon II"): what it gives for her class ("DEF/M.DEF +6"; Prowess "ATK +6" as a Brawler;
  "+4 · all six"), before → after, the first at display size ("DEF 151 → 157", then "M.DEF 129 → 135"), from her battle sheet, a
  moon node it brings included, and its jewel ("Moon Jewel III ×1 · 4 held", "Planet Jewel III ×3 · 4 held"). The footer is **Set**,
  or disabled with what stops it: "Guard II first", "Lv 41", or the jewels held ("Planet Jewel I ×1"). An open node reads Open with no
  button, and the sheet stays open on it after Set. Her moon's nodes have no jewel and read "With its moons".
- **Set all:** every jewel that fits, one line each ("Moon Jewel IV → Guard IV · DEF/M.DEF +8", "Planet Jewel III ×3 → Planet III · +4 ·
  all six"). Planet Jewels go first; a Moon Jewel goes to the shared moon with the fewest open nodes, Prowess, Vigor, Guard on a tie.
  **Set 4** sets them all in one save write.

**Template tab** (`TemplateTab.tsx`, `template-view.ts`; H123, D270; the rules are [classes](classes.md#her-calling-and-her-template)):
her uniqueness in one place, and the only body shown for a locked or elsewhere outfit.
- **First row:** her template's name at display size, the ★ in the accent, and the (i).
- **Three readings,** a tile each: **Calling** "Warrior", "from Front A" (every style at her top grade: "from Pace A · Late A");
  **Stride** "Middle", "from Medium A"; **Knack** "Fleet", "from Speed +20% · Charm", which names her signature family.
- **Her calling and trade,** one row: "Calling · Warrior · fixed", "Mine · Weapon Forge". Her calling is read from her running
  styles, so nothing here is picked.
- **The ★ pieces,** a label, a number and a state, each opening the sheet where it changes:
  - **★ Flourish** "Even pace · 1%/round · max 4%": **On** as any class of her calling's family, or faint "Off · as Sorcerer",
    never a dot. Its sheet has the shape and number at display size, "Works as · Warrior, Brawler, Arms Spellblade, Arms Summoner"
    and "Now · On". While it's off, "Now · Off · as Sorcerer", her family's classes as chips (the highest she holds selected) and
    the footer **Fight as Brawler**, or **Start Warrior · R1** on a Tier 0 she hasn't started; a class she can't enter yet is faded.
    A later tier's world has no Tier 0 chip.
  - **★ Signature** "ATK/M.ATK +8": **Worn**, **Not worn**, or "G1 first" with every slot at G0. It opens Gear's accessory sheet, on
    the slot wearing her ★, else an empty slot at G1 or more, else her highest. It never carries a dot: wearing her ★ is her
    choice (D274).
  - **★ Moon I** ("HP +20", her knack's stat) and **★ Moon II** (by her calling's root: "DEF +8", "M.DEF +8", "DEF/M.DEF +4"):
    **Open**, "Lv 16", or "With its moons" once her level is there. They open Stars' node sheet.
- **Racing:** Surface, Distance and Style chips, with what her template read ringed in the accent (her calling's styles, her
  stride's distance), then her growth rates ("Speed +20% · Power +10%").
- **Racing skill ›** opens its name and text.
- **A locked or elsewhere outfit** has the same rows with numbers and no states or taps: "Calling on unlock · Spellblade", and the
  signature at its Lv 50 value ("ATK/M.ATK +5 · Lv 50").

### Party Hall

Routes: `/town/party-hall` and `:n` (1–20); `PartyHallPage.tsx`.
- **The list:** twenty parties, each with its name, "5/5 · Edit" (green when full) and five faces with level, class and
  her signature family ("★ Pendant"). The lead has an accent ring and a flag. A party with two healers says "One healer
  a party" in the warning colour.
- **The editor:** "All parties" (back), the name with **Rename**, then five slots (face, name and "Lead · Sorcerer"; an
  empty one "Slot 3 · add an Uma") and the healer note.
- **An empty slot** opens the shared picker, "Choose an Uma": owned Umas, highest Uma Level first. One in another party
  is dimmed with "Moves from Party 2" and moves here when picked (D46). "In this party" and "In a fight" are disabled.
- **A filled slot** opens her sheet: **Make party lead** (or "Party lead"), **Swap with another Uma**, **View profile** (her Class tab; ‹ › step through the party),
  "Recall from Mine · what's made is kept" while she works, and **Remove from Party 1**. Picking a lead never moves
  anyone; a party without one leads with its first member. Working Umas fight like the rest (D119).

### Warehouse

`places/warehouse/` on the kit's `ShelfView` (H106, D222; what each item is: [materials](materials.md); prices:
[loops](loops.md#the-exchange)):
- "2,100 materials · 102 made items", then seven shelves: **All**, Metal, Wood, Vegetables, Fish, Stone and **Made
  items**. Every stack is on All and on its own shelf.
- An icon grid with counts: each line raw G1–G10, then refined G1–G10; made items by family (Arms Gems, Tome Ink, Armor
  Fittings, Accessory Settings, Planet Jewels, Moon Jewels), grade by grade.
- Grade chips on every shelf: Every grade, Highest, and one per grade held.
- A stack's sheet: what it is ("Metal · G3 · raw · Refines into Iron Ingot", "Grade 5 · Raises an Arms weapon one
  grade", "Opens Planet III", "Opens a moon's node II"), how many are held, and Sell ×1, ×10 or All for Laurels.

### Exchange

`ExchangePage.tsx` and `exchange-rows.ts` (prices: [loops](loops.md#the-exchange)):
- The Laurels held, and "Speed 500 · Sweep 20".
- **Tickets** (the kit's `ExchangeRows`): Speed Ticket, "30 minutes off any job", and Sweep Ticket, "Instant replay of a
  cleared stage".
- **Raw materials** behind five line tabs (Metal first; the tab is remembered for the session): the line's ten raw
  grades, "G3 · have 12". One not stocked yet is locked with the win that stocks it: "After the tier's first win"
  (G1–G5) or "After a win on continent 3" (G6–G10).
- A row's sheet: ×1, ×5, ×10, ×25 or a typed amount, the total, and "Need N more" when the Laurels fall short.
- **Manuals** (its (i): Class Marks bank past a max Class Rank, a Manual's price and EXP, a Tier 0's waiting room and
  what her share is): **Read a Class Manual** with "Class Marks 3,000". It opens the Class Manual sheet (`manual-view.ts`,
  D102, D250; the rules are in [loops](loops.md#the-exchange)) at `/town/exchange/manual`: the shared picker (highest Uma
  Level first, locked Umas disabled), then her bars at `/town/exchange/manual/:outfitId` (a link may open it there, as
  the Class tab's Class Manuals › does; closing the sheet returns to `/town/exchange` and the place's Back still leads
  where it came from).
  - The head reads "Aster · Class Marks 78,000", and "Her share · 21" while she has one.
  - **Her bars,** one row each (emblem, name, its caption and bar): in Tier 1's world the five Tier 0s, her calling's
    first ("R1/10 · Calling"), then the Tier 1 classes she holds in the tree's order ("R34", "R50 · Max"); a class she
    can't fight as yet isn't listed. A later tier's world lists the eight Tier 1 classes, her active class first. The
    class she fights as is selected first; a tap selects another (its ring). A Tier 0 at Rank 10 with EXP waiting reads
    "R10 · +12,400 EXP waiting", its bar filling toward the 23,680 her promotion can take.
  - **The counts** are chips: "Her share · 21" (her reset Manuals not read yet, counting down on any bar she reads; the
    sheet starts on it while it lasts), "To Rank 10 · 4" on a Tier 0 below Rank 10, then 1 · 5 · 10 · "Max · 78" (as many
    as the Marks buy, up to 99). One the Marks can't buy is disabled; on a Tier 0 at Rank 10 the counts stop at its room
    ("Room for 4").
  - **The footer** shows before → after from the class's own curve ("Brawler R34 → R36"; "Warrior R1 → R10 · +12,400 EXP
    waiting"; "+360 Class Marks back" for EXP past the top) and **Read 16 · 16,000 Class Marks**, or the reason it can't
    ("Already at the top rank", "Needs 10,000 Class Marks"). After a read the sheet stays open on the new state; "Choose
    another Uma" returns to the picker.

### Account

Reached from the top bar's initial (`/town/account`). `places/account/AccountPage.tsx` on the kit's `AccountPage`:
- **Trainer name**, with Save.
- **Tier n wallet**, the active tier's: Uma Tickets, Uma Shards and Laurels in Tier 1; Laurels, Speed Tickets and Sweep
  Tickets in a tier above 1.
- **Appearance:** System, Light or Dark, kept on this phone (D147).
- **Notifications** ("Work and training done"): the switch, a note when it can't turn on (not the Home Screen app,
  blocked, unsupported), and **Send a test** while it is on.
- **The Tier rework's grant**, only in a world migrated through save v28: "The Tier rework's grant · 63,800 Speed
  Tickets", which reopens "The Wilds are rebuilt".
- **The classes' reset**, only in a world migrated through save v32: "The classes are rebuilt · 78 Class Manuals", which
  reopens "The classes are rebuilt" (`?sheet=classes`).
- **Achievements** (`achievements/AchievementList.tsx`, [loops](loops.md#achievements)): "3 of 14", the earned ones
  newest first with "21 Oct · Tier 1 run 2" (the Bestiary has no run), then the rest dimmed with how each is earned. It
  lists Tier 1's four seals and Rift Conquered, every other world's, and the nine titles; a seal reads "Iron Seal · Tier
  1", and Untouched shows its front's crest.
- **Safety copies** (D260, only when this device has one): each row its date, why it was kept and what it held ("Replaced
  by a newer save · 29 Umas · best Lv 20"). **Restore** confirms in a sheet; the current save becomes a safety copy and
  the restored one uploads as the newest.
- **About:** Tier world, Trainer since, Umas unlocked in every world ("26 / 270"), Cloud save ("Paused · last Oct 27, 7:40
  PM" while uploads fail), Game data, App build.
- "Update ready · Restart" while a new build waits, and **Sign out**.

**"The Wilds are rebuilt"** (`grant/GrantSheet.tsx`, `grant-lines.ts`; the grant is in
[loops](loops.md#the-tier-reworks-grant)): it opens by itself once per world with an unseen grant (never over a
world-map fight), and from the Account's row (`?sheet=grant`). Its lead (still "Ten professions, each in its own
place."), "+63,800 Speed Tickets" and the hours of work, then What went, What came back, What stays, and By Uma ("Craft
Lv 30 → 1 · 1,470", with her trade). **To the Wilds** and **Later** both mark it seen.

**"The classes are rebuilt"** (`grant/ClassesSheet.tsx`, `classes-lines.ts`, D250; the reset is in
[loops](loops.md#the-classes-are-rebuilt-save-v32)): it opens by itself once per world whose save v32 record is unseen,
once the reset's trades have settled and never over a world-map fight, after "The Wilds are rebuilt" when both wait; and
from the Account's row. "+78 Class Manuals" and "78,000 Class Marks · Exchange"; "Every Uma starts her class tree at
Rank 1 of her Tier 0." with the three roots and their Tier 0s; How to rebuild an Uma (Exchange → Read a Class Manual →
her Tier 0 → Her share; Her profile → Class → Promote (Rank 10), "EXP past Rank 10 goes with her into the new class");
At a glance: Reset, Stays, Weapons ("No Weapon Rank since R2: grades stay"), Trades ("2 Umas moved trade · their
running work finished into the Warehouse") and Halls ("Paladin Bastion · Cleric Chapel → Healer Sanctum", each Uma whose
role moved, "Hero → Learner · Archdemon's Toll · Bond 7", then "Each Uma keeps her higher Bond"); then each Uma with a
share or a moved trade, most Manuals first, with her face ("Spell Blade R26 · Mage R8 → Mage R1 · trade Wood →
Stone", her share on the right; the names before the arrow are engine v18's). A later tier's world reads "Every Uma
starts again at Rank 1 of her class." with one step and no tree. **To the Exchange** (the Manual sheet's picker) and
**Later** both mark it seen.

## Learning

### Halls of Heroes

The five halls share `places/halls/HallPage.tsx` (D106; Halls v2's page, H133, D255: `hall-view.ts`'s `seatCard` and
`hallHelp`; the rules are [Halls of Heroes](heroes.md)).
- The hall's name ("Warrior Dojo", "Healer Sanctum") with its (i), and "Four Heroes, each with her own Limit Break, and
  their Learners." The (i), one rule a line: "Five halls, one per family; any Uma sits in any seat." · "A Hero casts her
  seat's Limit Break at full strength." · "Its power is the seat's (×1.9 to ×2.9), × her class's scale (×0.95; a
  Paladin's or a Cleric's ×0.8; a Tier 0's ×1), × her deepest skill." · "Up to 10 Learners a Hero, 2 Heroes a Learner,
  at 50% + 5% a Bond Level." · "A won fight raises each Bond: a stage 2, an elite or a boss 3, 12 a level." · "A Bond
  stays when she leaves."
- **Four seats**, each a card: the Hero's bust (or **+ Hero**), "Seat 2 · Brawler" (its home class, faint), the Limit
  Break's name and kind icons, then its shape and power, read from its casts, never its name: "One foe · 1 hit · ×2.9",
  "One foe · 6 hits · ×2.2" (a double counts two), "Every foe · 3 hits · ×2.2", "Random · 8 hits · ×1.9", "Volley · 4 +
  2 a foe · ×2.2" (hits on her foe + splash hits on each other foe); a Healer Sanctum seat adds its stack ("· Brave 1",
  "· Armor Break 1", "· Faith 1", "· Mind Break 1"). The power is the seat's own (ink, the only weight on the line), not
  her class's scale; the line wraps under the name, never truncated. Then the twin sets it answers ("Answers Dark ·
  Twilight", CP28, on the Katana–Light and Bow–Dark pairs), its lore in italics, and the Hero's name or "No Hero yet".
  Under a seated Hero: "Learners 3/10", each a face with her Bond level and bar, and **+** to add one.
- **The pickers** ("Hero for {Limit Break}", "Learner for {Limit Break}"; the shared picker, highest Uma Level first):
  Umas that can't take the seat stay listed with why ("Locked", "Already seated here", "Already a Hero", "A Learner:
  leave her Heroes first", "A Hero", "Already learning here", "Already has 2 Heroes", "10 Learners at most"). A Learner
  candidate shows "Bond 2 · 1/2 Heroes" and the sets the seat adds to her weapons' ("Adds Light, Twilight").
- **A Hero's sheet:** "Hero · Strength 100%"; her own Bond with the seat; **Profile**; **Change Hero**; **Empty seat**, which lists
  the Learners who'd leave before it confirms.
- **A Learner's sheet:** "Bond 4/10 · Strength 70%", its bar, "Limit Breaks · {Limit Break} · {another}", **Profile** and **Leave**.
- The map's pips, the quick look, the Hero and Learner sheets and the pickers are Halls v1's; her profile's Limit sheet opens the
  seat's hall (`HERO_HALL_PLACES`).

### Observatory

`places/observatory/ObservatoryPage.tsx` (the rules are [loops](loops.md#extra-stats), [jewels](materials.md#jewels) and [Extra
Stats](../design/tier-rework/extra-stats-progression.md)): a door to her Stars tab (H122, D269). The page lists the world's owned
Umas, those with a jewel ready first, then by Uma Level: a face, a name and "Open 13/22 · 2 ready" ("Open 13/22" with none), with the
green dot on a ready one, or "Unlock an Uma first." A tap opens her profile on **Stars**, and Back returns to the list. The route
`/learning/observatory/:id` redirects to `/town/stable/outfit/:id/stars`. Its quick look and (i) show the place's line, "Each Uma's
Extra Stats: a Planet, three moons and her own moon."

## Battle

### Scenario Gate

Routes: `/battle/scenario-gate`, then `c/:continent`, `r/:region`, `capital/:continent` and `fight`
(`places/scenario-gate/`; the world is [the world map](maps.md)).

- **Every map screen's header:** its name and levels, **Map / List** (remembered on the device), the active party bar,
  and **Resume the open fight** while one is open.
- **The active party bar** (`ActiveParty.tsx`):
  - "Party 1 · swap", which opens "Who fights?": every party with members, by its lead's face and its highest level
    ("5/5 · Lv 50"). Off while a fight is open.
  - **Edit parties** (the Party Hall), then "A fight needs five" or "One healer a party" when it applies.
  - The five: face with "Lv 50", the MP she carries between stages (Springs refill it), her class. A tap opens her Class
    tab; ‹ › step through the party.
- **World:** five islands on the map; in the list, "Tier 1 · five continents" ("four" for a partial tier), each
  continent with its crest, "Lv 1–10" ("T2 Lv 1–10" in Tier 2) and "21/480 stages cleared". The tiers above with no
  world yet show "Tier 2 locked".
- **Continent:** forty regions in ten rows of four, climbing from the bottom, under two headings: its first five levels,
  then its last five (D97). **Springs** sit between rows ("◆ Spring · refill the party's MP", or "recharges in 1h 20m";
  off during a fight). The **Capital** shows "Capital · Lv 10" and "2/6". Each region shows its biome icon, name and
  "5/12" or "Cleared ✓".
- **Region:** "Lv 1–5 · 3/12 cleared", **Spring · MP** beside Map/List, and its twelve stages on a path or in a list.
  Each stage: its number (a boss or elite stage, her leader's face), name with ★ (boss) or ♛ (elite), elements, "Lv 3 ·
  2 waves · 9 foes", and "✓ ×3", "open" or "locked".
- **Capital:** three routes, each with its name, its line, its elements and "1/2": a Vanguard ♛, then a Champion ★.
- **The stage sheet:** "Lv 3 · Stage" ("Elite", "Region boss"; a capital's "Vanguard" and "Champion"), its elements and
  waves, then the foes by wave (`battle/FoeRow.tsx`): face, elements, name, Boss or Elite, "Acts twice", and "Shield 4 ·
  Weak:" with her weakness icons, Arms first (up to four, [combat](combat.md#weaknesses-shields-and-breaks)). Footer:
  **Fight** ("Fight again" once cleared; "Locked", "Fight open" or "One healer a party", disabled), and on a cleared
  regular stage **Sweep · 12** (the Sweep Tickets held).
- **The Sweep sheet** ([Springs, replays and Sweeps](loops.md#springs-replays-and-sweeps)): the tickets held, its (i),
  and ×1, ×5, ×10 or "All 12". Its result shows like a win ("Swept 5 times"), with **Sweep again · 7**.

**The fight** (`FightScreen.tsx`, the Phaser stage in `battle/scene/BattleScene.ts`; the rules are
[combat](combat.md#the-actions)). It fills the screen, dark in either appearance:
- **Header:** Back (the fight stays open), the region and the stage, the wave chip ("W2/3"), "Round 4", **Auto**, the
  speed (1×, 2×, 4×; both remembered on the device) and the menu (**Back to the map**, **Give up**).
- **Stage:** the foes on top, six to eight in two rows; the party below as busts.
- **Foe cards:** elements, the ward's mark (her front's crest, in the Rift), name, HP bar, the shield badge ("!" while
  broken, pale while Steeled) and up to four weakness icons (no "Weak:" from engine v18; a v16 or v17 fight keeps it);
  "Locks" and their kinds while she charges; and her intents ("{move} → all ~120", "Charging: {move}", "2/3"). With an
  ally picked, the damage a tap would deal shows above each foe ("85 −1", "BREAK"; yellow when weak).
- **The party:** HP and MP bars, "640 HP · Barrier 37" or "KO", status chips, and **LB** when her Limit Break is ready.
- **Controls:** a line that says what a tap does ("{Uma}: tap a rival to attack with her Lance"; a pair's two halves,
  "Tap a rival: Fire Tome Attack + Greatsword Attack · 16 MP", her lead half first; "Tap an ally for {Uma} to
  guard"). While cues play it reads them ("{Uma} ★ +30 HP", "{Uma}: ★ Barrier 37", "{Uma} +13 MP", "{foe} BREAK!").
  Below: her three weapons, then **Attack**, **Skills (n)** and **Guard**.
- **The Skills sheet** ("{Uma} · 120 MP"): her equipped skills in weapon order, each with its weapon, kinds, reach,
  hits, support ("heals the most hurt, Regen 2 rounds"), the foes weak to it, and its MP; one she can't afford is off.
- **The Limit Break sheet:** her own, then "From her Heroes", each with its Hero's face and strength ("70%"), at 0 MP; a
  pair picks an Arms and a Tome skill; "Ready on her next turn".
- A fight keeps its own engine's rules and labels (`state.engineVersion`), so a fight opened before an engine change
  finishes as it began.
- **The result** (`FightResult.tsx`): the stage, **Victory!** or **Defeated**, "6 rounds · First clear!", chips for
  Laurels, Uma Shards and Uma Tickets, and "+40 Class Marks". For each Uma: her EXP and level ("Level up! Lv 9 → 10"),
  her Class Rank bar with a line for each skill that rose ("{skill} reached Rank 3", or "{skill} opened" for a new
  depth), and her Bonds ("Bond up! 2 → 3"). A loss says "No penalty", with tips in its (i). Buttons: **Fight again** (or
  **Retry**) and **Back to the map**.

The fight screen plays a **fight source** (`battle/fight-source.ts`, H50): the world map's open fight, the region's
title and biome, and foes sized by rank; the Rift hands it its own.

### The Rift

The end-of-tier event ([the Rift](../design/rift.md), H50; its rules in [loops](loops.md#the-rift) and
[combat](combat.md#the-rifts-foes)). Routes: `/battle/tier-finale`, `front/:front` (and `front/:front/:stage`, its sheet
open), `convergence`, `signup` and `fight`; screens in `places/rift/`. It opens once the tier's world has five Lv 50
Umas (Tiers 1 and 2).
- **Quick look:** the Rift's line ("The Rift is open", "Rift run · 2 of 4 fronts sealed", "Rift won · ready to ascend")
  and "12 of 20 at Lv 50 to sign up", or the run's four fronts ("5/12", "Sealed").
- **The Rift:**
  - "Tier 1 · 21 Lv 50 Umas" (or "Tier 1 · Run 1 · 2 of 4 fronts sealed"), and **Resume the open fight** when a Rift
    fight is open;
  - no run: **Sign up twenty**, disabled with "12 of 20 at Lv 50" until twenty are;
  - a run: its four **fronts** (crest, name, "5/12" or "Sealed", the party guidance "2 Brawler · Arms Spellblade · Arms
    Summoner · Paladin") and the **Convergence** card ("Seal all four fronts", "Assign four parties · 2 attempts",
    "Fight 2 of 4 · Arcane", "Won");
  - a won run: **Ascend to Tier 2**;
  - the **Echoes:** four rows (crest, front) of Lv 45, 50 and 55, "✓" on each won;
  - **Roster:** the run's twenty faces, with **Cancel sign-up** while the run is untouched.
- **Sign up twenty:** **Four parties** (the party picker: four parties of five Lv 50 Umas) or **Twenty Umas** (the Uma
  picker, twenty, "Below Lv 50" disabled), then a sheet of the twenty faces: "They fight this Rift together until it
  ends." and **Sign up**.
- **A front's chain:** its crest, name and count, its ward ("Wards Tomes" on Iron, "Wards Arms" on Arcane) and guidance,
  then twelve stages ("Stage 1" to "Champion"), each with "Lv 50 · 3 waves · 15 foes" and its leaders' faces: cleared ✓,
  the next ringed (the page opens on it), the rest locked. Any stage opens its **stage sheet**:
  - the foes by wave as the fight will have them (`FoeRow`: tagged Boss or Elite by face, "Acts twice" or "Acts three
    times", "Shield 6 · Weak:" and her icons, the ward);
  - on the next stage, a party of the roster (the best fit for the front's guidance first, counting every class each
    member holds; a party that can't fight there, "One healer a party" among the reasons, is disabled), the **guided
    weapons** (each member's three build weapons under her face, matched by any class she holds, "—" where the build
    has no place for her; **Use the guided weapons** sets them in one save, and switches a member into the guided class
    she holds when she fights as another; or "On the guided weapons"), and **Fight**;
  - under the party, each guided class it leaves empty ([loops](loops.md#the-rift)): "Needs an Arms Summoner" ("Needs
    2 Brawlers"), and up to three roster Umas outside the party who could fill it, those who can promote into it now
    first ("Ready to promote", in the accent), then those who hold it ("Holds it"); a row opens her Class tab.
- **The Convergence:** four rows, Iron, Arcane, Duel and Horde, each with its fight's size, **Foes** and a party
  (suggested from the fronts' guidance; a party picked for another row is disabled). **Begin** when the four cover the
  twenty (else "Missing: …") starts the attempt and its first fight. With an attempt on: its four parties, "Won · 6
  rounds", "Next" or "—", **Fight: Arcane** and **End this attempt** ("The next attempt starts from Iron.").
- **An Echo's sheet** ("Iron Echo · Lv 55"): its foes, a party of five Lv 50 Umas, its guided weapons and needs (from
  the world's Lv 50 Umas), and **Fight** ("Fight again" once won). Once won, **Sweep ×1** and **Sweep ×5** with the
  Sweep Tickets held; a Sweep's result shows like a win.
- **The fight:** the shared fight screen on the Twilight Rift's backdrop, titled "Iron front · Stage 5", "Convergence ·
  Fight 2 of 4" or "Echo · Iron · Lv 55". Foes stand and are tagged by their face; a warded foe carries her front's
  crest. Back and the menu return to the Rift ("Give up" ends a Convergence attempt).
- **The result** (`RiftResult.tsx`): Victory! or Defeated and the rounds; then "Stage 5 cleared · 5/12", "Iron sealed",
  "Fight 2 of 4 won", "The Rift is won!" or "The attempt is over"; each Uma's Class Rank bar and rank-up lines and the
  Class Marks (no EXP line). Buttons: **Next stage** (the same five again while one party holds them, else the stage's
  sheet), **Retry**, **Next: Arcane**, **Fight again** or **Sweep again · n**, and **Back to the Rift**. An achievement
  earned plays its cut-in first, one at a time.
- **The finale** (`RiftFinale.tsx`, H52): on the win that wins the run, before its achievements' cut-ins, a dark cut-in:
  "Tier 1", "The Rift is won", the champions' faces four to a row, revealed one after another (at rest under reduced
  motion), "Twenty Umas, four fronts, 14 champions" and **Continue**. The faces are every boss face of the four fronts'
  champions, Iron to Horde, then of the Convergence's four fights, each once.
- **Ascend** (`AscendSheet.tsx`): "20 Umas move to Tier 2 at Lv 1", "Ranks, skills and Extra Stats start over", "Their
  gear returns to Tier 1's stock", "Tier 2 gets 20,000 Laurels, 100 Speed Tickets and 3,450 Class Marks", the reason
  when it can't yet, and **Ascend**, which runs behind the tier veil and lands on the new tier's Town Hall.

## Wilds

The fifteen places, three to a line: each gathers, processes or makes, for the trade that works it
([loops](loops.md#craft-level), [materials](materials.md#lines), [the farm by
line](../design/tier-rework/farm-by-line.md)).

<!-- live:facilities -->
| Place | Profession | Job | What it does | Its trade (calling) |
|---|---|---|---|---|
| Mine | Mining | Gathering | Gathers metal, G1–G10 | Warrior |
| Mine Workbench | Smelting | Processing | Processes metal raw into refined, one for one | Warrior |
| Weapon Forge | Arms Crafting | Making | Makes Arms Gems | Warrior |
| Fields | Farming | Gathering | Gathers vegetables, G1–G10 | Healer |
| Fields Workbench | Prepping | Processing | Processes vegetables raw into refined, one for one | Healer |
| Tome Forge | Tome Crafting | Making | Makes Tome Ink | Healer |
| Forest | Wood Chopping | Gathering | Gathers wood, G1–G10 | Spellblade |
| Forest Workbench | Sawing | Processing | Processes wood raw into refined, one for one | Spellblade |
| Armorer | Armor Crafting | Making | Makes Armor Fittings | Spellblade |
| Fishery | Fishing | Gathering | Gathers fish, G1–G10 | Summoner |
| Fishery Workbench | Filleting | Processing | Processes fish raw into refined, one for one | Summoner |
| Charm Forge | Accessory Crafting | Making | Makes Accessory Settings | Summoner |
| Monster Den | Hunting | Gathering | Gathers stone, G1–G10 | Mage |
| Den Workbench | Stonecutting | Processing | Processes stone raw into refined, one for one | Mage |
| Lapidary | Jewel Crafting | Making | Makes Planet Jewels and Moon Jewels | Mage |

Every place has 4 slots at ×1.25 from day one, and nothing to upgrade. An Uma works her trade's three places; a place whose trade has no Uma in the world is an open shop, taking everyone until one arrives.
<!-- /live -->

**A place's page** is one page for all fifteen: `places/work/FacilityPage.tsx` (the provider: save, trade, words) and
`PlaceV3.tsx` (the page), with `PlaceV4.tsx` and `place-view-v4.ts` (the What step, sizes, help and quick look), on the
kit's `uma-kit/work`.
- **Header:** "Mine · Mining · 4 slots · ×1.25" and its (i) (what the place does, "Grade g opens at Craft Lv 5g − 4",
  and the open shop). A place whose trade has no Uma in the world says so: "Open shop: no Warrior in this world" (each
  trade's Tier 0: "no Healer" on the Vegetables row). **Collect here** when work is done; **Finish all · 14 Speed Tickets** when
  two or more slots run, which asks "Finish 3 jobs for 14 Speed Tickets?" (Yes, Not now), or says "Needs 14 Speed
  Tickets".
- **Four slot rows.** A free one ("Free") starts a job. A working one shows her face, the item, "· 1/3", and the time
  left or "Done".
  - Done work has **Collect** and **Repeat**.
  - A running row has **Speed up**: **−30m** (one Speed Ticket), **Finish · 4**, or "Buy 2 and finish · 20" when short,
    with a warning when a ticket's minutes would go unused.
  - Its **More** sheet has **Queue next** (three at most, each movable earlier or removable) and **Recall**, which
    previews what is collected, what comes back, the minutes lost and the queued jobs dropped ("Nothing is lost.").
- **For your targets** (D100, D126): a strip of what the targets still need from this place, each icon with its grade
  and short count. Tapping a short one opens that job in a free slot with that count.
- **A stopped queue** (SC3): "{Uma}'s queue stopped", where and how long ago, what it lacked, **Restart** and
  **Dismiss**.
- **The job sheet:** Who → How many → What, then "Start · ×5 · 1h 56m" (or **Queue next**), the inputs held/needed and
  the Craft EXP it pays.
  - **Who:** the shared Uma picker; her trade's Umas first (free ones, then the highest Craft Level), each face with her
    Craft Level ("C30"). Anyone else is greyed "Another trade", unless the place is an open shop. Locked and busy Umas
    say why. Fighting doesn't block work (D119).
  - **How many** follows the picked job (D233), each size with its time: ×1, ×2, ×3, ×5, ×10, ×15, ×20 or ×30 to gather or
    process (about half an hour to 8 hours); a make's sizes all reach the same longest job, 8 hours at Craft Lv 25 (Armor Fittings to
    ×10, an Accessory Setting or a jewel ×6, an Arms Gem or Tome Ink ×3). A targets link keeps its own count. A chosen
    size stays while What changes.
  - **What:** a gathering place's ten raw items, or a workbench's ten refined ones, G1–G10 in two rows of five (a locked
    one "From Craft Lv 31"), with the picked item's card ("Gold Ore", "Have 40", "Metal · G6 · raw · Refines into Gold
    Ingot"). A making place shows its item's ten grade chips (the Lapidary: Planet I–V and Moon I–V) and its recipe card
    ("Arms Gem G3", "Raises an Arms weapon one grade", "Iron Ingot ×7 (12)"). The sheet opens on the highest grade her
    Craft Level opens.
- **Quick look:** the header's line, the open shop's line, the place's ten item icons (a making place's grade chips),
  and the four slots as compact rows: start, collect, repeat and queue are two or three taps from the map, and a stopped
  queue's card shows there too.

## Tiers

Each tier is its own world, with its own Stable, parties, world map, Wilds, Warehouse, wallet and halls (D159). The
account, its achievements and each Uma's tier history are shared.
- **One world on screen at a time:** the active tier (`apps/web/src/save/game.ts`, `save/tier.ts`, H35). Every screen
  reads its world and every action writes to it. A tier's world exists once the Rift below it has ascended Umas.
- **The tiers** (`TIERS`, `packages/domain/src/save/rules.ts`): three, as master data has, each with a name and a look:

<!-- live:tiers -->
| Tier | Name | Look |
|---|---|---|
| 1 | Apprentice | Day |
| 2 | Adept | Dusk |
| 3 | Master | Night |
<!-- /live -->

- **The Tier sheet** (`?sheet=tier`, `hub/TierSheet.tsx`, H36): the top bar's crest opens it over the current page; Back
  or ✕ closes it. One card per tier, 1 to 3:
  - a tier with a world shows its crest, "Tier 1 · Apprentice", its Uma count ("No Umas yet", "1 Uma", "12 Umas") and
    its Rift (`riftLine`): "No Rift in this tier yet" (Tier 3), "The Rift opens at five Lv 50 Umas", "The Rift is open",
    "Rift run · 2 of 4 fronts sealed" or "Rift won · ready to ascend". The active tier's card has an accent border, and
    tapping it just closes the sheet;
  - a tier with no world is locked: its crest at half opacity, a lock, and "Promote Umas through the Tier 1 Rift".
- **Picking another tier** fades a veil in the page colour over the screen (120 ms), switches the active tier and lands
  on that tier's Town Hall, then fades the veil out (260 ms) once the new world has drawn (`hub/TierVeil.tsx`, outside
  the shell so it survives the remount). Under reduced motion the switch is immediate.
- **The looks** (uma-kit's `tint`): Tier 1 is day, the theme as it is; Tier 2 is dusk, an amber accent and a warm wash
  over the Hub map; Tier 3 is night, a violet accent and a deep blue wash. Only the accent changes, in light and dark:
  the bars' disc and marker, buttons, borders and sheets follow it. Fights keep their own dark stage.
- **Where the app opens:** a `?tier=n` link's tier, else the tier last viewed on this device (`rpg.tier`), else the
  highest tier whose world has an Uma, else Tier 1; only a tier the save has a world for.
- **Switching** remounts the whole app on the new world (`hub/TierShell.tsx`): the bars, every place and the Hub's map
  start fresh. Nothing from one tier's screens survives into another's.
- **Links:** routes are the same in every tier. A link from outside carries `?tier=n` (a push notification's always
  does); the app switches to that tier when it has a world, then drops the param.
- **One Uma, one world:** an Uma lives in one tier world, and the save refuses an outfit two worlds own. A tier's lists
  and pickers show only its own Umas; Tier 1 also lists the outfits nobody owns, to unlock (D5).
- **Uma Tickets are Tier 1's** (D5): in a tier above 1 the top bar, the Stable's counter and its quick look show none.
- **The featured Uma** on Town Hall's plaza is remembered per tier.

## Global UI

- **The frame** (`hub/Shell.tsx`, uma-kit's `AppFrame`, D147): a fixed full-screen frame with the top bar, the page
  between, and the bottom bar. Place pages fill the space between the bars and scroll inside it. A fight fills the whole
  screen.
- **Top bar** (`hub/Bars.tsx`, the kit's `AccountBar`):
  - your initial, which opens the Account, with the active tier's crest beside it, which opens the Tier sheet;
  - the active world's chips: **Laurels**, **Speed Tickets**, and in Tier 1 **Uma Tickets** with the Uma Shards toward
    the next ("34 · 2/5"). Laurels and Speed Tickets open the Exchange, Uma Tickets the Stable;
  - "Offline" or "Sync paused", when it applies.
  - Under the bar, a red line that opens the Account (D260): "Not backed up since Oct 27, 7:40 PM. Your progress is only on
    this device." once uploads have failed with unsynced changes for ten minutes, or "A newer save replaced this device’s
    changes. They’re kept in Account." until the Account is opened.
- **Bottom bar** (the kit's `BottomBar`): Town Hall · Learning · **Battle** · Wilds · Menu, in five equal slots, docked
  full width to the screen's bottom edge, its panel running under the home indicator (D149). Battle is a disc in the
  tier's accent (gold in Tier 1) rising out of the bar. The active tab has a marker in the tier's accent on the bar's
  top edge and a filled icon. The Wilds tab counts the world's slots ready to collect.
- **Menu sheet** (`?sheet=menu`, "Every place", `hub/MenuSheet.tsx`): every place by page, a lock on shut ones and a
  count on ready ones, then the Account.
- **Tier sheet** (`?sheet=tier`): see [Tiers](#tiers).
- **Side panel** (the kit's `PeekPanel`): a quick look slides in from the right, with its (i) and Enter. It closes with
  ✕, a swipe right, a backdrop tap, Escape or Back.
- **Sheets:** everything else opens in a bottom sheet (the kit's `Sheet`, or `ui/BottomSheet.tsx`). An (i)
  (`ui/HelpButton.tsx`) opens a sheet with a rule's words; screens keep labels short (D95).
- **Appearance:** light or dark follows the phone unless the Account sets one. Fights and their results stay dark.
- **Push notifications** (`apps/web/src/push/`; the API's `apps/api/src/push/`; the words in
  `packages/domain/src/save/notify.ts`):
  - A server tick every five minutes ([infrastructure](../technical/infrastructure.md)) sends one notification per tier
    world with news: "Work done" ("Mine: Copper Ore ×3") or "3 jobs done" with up to four lines, titled with its tier
    ("Tier 2 · Work done") when the save has several worlds.
  - Tapping one opens its place (several jobs: the app) on its tier (`?tier=n`).
  - The app badge counts ready slots in every tier.
  - They need the Home Screen app on iOS.
