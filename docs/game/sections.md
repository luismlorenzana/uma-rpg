# Game sections

Every screen and what is on it, as the game runs today (engine v18, save v31). This page says where things show; the
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

Once master data and the save are both in, the calling repair (D220) runs once (`CallingRuleRepair`). The kit's
`UpdateNotice` says "Update ready · Restart" when a new build is out.

## The Hub

Four pages, in the bottom bar's order: **Town Hall**, **Learning**, **Battle** and **Wilds** (D147). Tap a tab or swipe
sideways to the next page. Each page is a pixel-art map fitted to the screen (`hub/HubScreen.tsx` on uma-kit's `HubMap`,
Phaser).

- **A place** is a button over its building: a name pill, its slot pips, a Ready badge when work waits, a lock while
  shut.
  - On the Wilds, four pips hang over each roof in a half arch: a free slot is a small dot, a working Uma her face in a
    progress ring with her Craft Level on its lower left. The Ready badge sits at the building's foot (D233).
  - A hall's four pips are its seats' Heroes. Town Hall's and Battle's places have none.
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
  - a hall: its four seats, each with its Hero's face, its Limit Break and "3/10" Learners or "Open";
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
- **Learning:** the six Halls of Heroes face each other in pairs across the road (Brawler Dojo and Mage Tower, Spell
  Blade Salle and Summoner Circle, the Paladin Bastion and the Cleric Chapel), with the Observatory below (H59).
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

### A place's page

`places/PlacePage.tsx`: uma-kit's place header over a scrolling body, between the bars.
- **Back** returns to where the page was opened from: a sub-view to its place, a place to its Hub page.
- The place's name and its (i), which shows its line.
- A counter: Uma Tickets on the Stable (Tier 1 only), full parties out of twenty on the Party Hall, Laurels on the
  Scenario Gate and the Exchange.

A shut place's page sends you to its quick look.

## Town Hall

### Stable

Routes: `/town/stable`, then `outfit/:id` (her profile) and `outfit/:id/skills` (her Skills alone, reached from the
world map's party bar).

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
  - RPG: active class, Can upgrade;
  - Template: Calling (six; an owned Uma's pick counts), Stride (three), Knack (five) and Signature (Pendant, Orb, Bell,
    Insignia);
  - Trade: "Mine · Weapon Forge", "Forest · Armorer", "Fields · Tome Forge", "Fishery · Charm Forge" and "Monster Den ·
    Lapidary", each with its head count, locked outfits too.
- **Seven sorts:** Uma Level (the default, highest first), release, name, rarity, total base stats, Craft Level and
  Class Rank. Owned Umas stay before locked in either direction; ties go to the newest release, then the name.
- **Device preferences** (`album/preferences.ts`): the query and view, and up to 20 saved views. Nothing goes in the
  save. **NEW** marks an outfit added since this device's first visit and not opened yet; the first visit marks the
  catalogue of the day as seen.
- **Can upgrade** (`upgradesFor`, as her active class; `album/upgrades.ts`): a weapon, armor or accessory slot she can
  raise now (its made item in the Warehouse, her level allowing), an accessory slot at G1 or more with no family yet, or
  a jewel in the Warehouse that opens one of her nodes now. From the switch (H134), also a promotion waiting: she fights
  as a Tier 0 at Rank 10 with a child she doesn't hold (`rpgPromotionWaits`).

**Her profile** (`OutfitProfile.tsx` in the kit's `ProfileFrame`; its layout rules are [profile
UX](../design/profile-ux.md), D229):
- **Header:** "All outfits" (back), her bust, her name and title, "Lv 50 Uma Level", her rarity stars and her **template
  chip**, and the **target** icon top right (up to ten targets; the Wilds plan what maxing them takes, D100).
- **The template chip** ("★ Clever Spellwright"; locked outfits too; a green dot while an owned Uma's calling is open)
  opens **Her template** (`TemplateCard.tsx`, `template-view.ts`; [her calling and
  template](classes.md#her-calling-and-her-template)):
  - her name, then Calling, Stride and Knack, each with what it read ("Calling ← Pace A, Wit 102 ≥ Power 90", "←
    picked"; "Stride ← Medium A"; "Knack ← Wit +20%");
  - her trade: "Trade · Monster Den · Lapidary";
  - her Flourish and its state: "★ Even pace · as a Mage · on", or "· no effect as Brawler" (a locked outfit's has no
    state);
  - on an owned Uma, her **Signature** ("Signature · Pendant · +10 now · worn", or "Wear a Pendant") and her **Moon**
    ("Moon · I HP +20 (Lv 16) · II DEF +8 (open)").
- **Under the header:** her EXP bar ("1,200 / 2,400 EXP", or "Max level · 300 EXP banked"), her calling pick card while
  it is open, then one row of three: her class ("Mage · Rank 40"; opens Skills), "Craft · Lv 30", and "Party · Party 1",
  "Working · Mine · 1h 20m", "Fighting · Open fight" or "Party · Free" (opens her place, or the Party Hall).
- **The calling pick card** (CP29), for a Pace or Late Uma until her calling is confirmed:
  - "Her calling · choose once" and two tiles: emblem and class, "★ {her name with that pick}", "★ Even pace as a Spell
    Blade", the trade it gives and its head count in her world ("Forest · Armorer · 8 Umas"), and on the suggested one
    "Suggested · Power 96 over Wit 88". Her pick is selected; tapping the other picks it.
  - **Confirm**, and "Her first win confirms it." At Uma Lv 1 a pick moves her class too.
  - While she has work started or queued, the other tile is off and the card says "Finish her work first": the pick
    moves her trade.
- **A locked outfit** shows **Unlock · 1 Ticket** and "20 Uma Tickets left", confirmed in the kit's `UnlockConfirm`
  ("Unlock {name}?", Uma Tickets 20 → 19, "Unlocking is final.", **Unlock for 1 Ticket**), and only the Racing tab. An
  outfit another tier's world owns shows "In Tier 2" instead; in a tier above 1, an outfit nobody owns shows "Unlocked
  in Tier 1" (D5).
- **Tabs:** Skills, Battle, Gear, Work and Racing; the last one opened is remembered on the device. Gear carries a green
  dot while a slot can be raised or a jewel set.

**Skills tab** (`SkillsPage.tsx`, `SkillTree.tsx`, `ClassPicker.tsx`, `WeaponSheet.tsx`; the rules are
[classes](classes.md#skills-depths-lines-and-ranks) and [skill trees](skill-trees.md)):
- **Class and trees**, one row of four: her class (emblem, name, "R40") and her three weapon trees (the weapon's glyph,
  her line's letter A or B, the slot's grade "G3", and the green mark when it can be raised). A tree button shows that
  tree below.
- Her ★ Flourish ("★ Even pace · 1% of her max HP a round, up to 4%"), dimmed with "· No effect as Mage" outside her
  calling's class; her Class Rank bar and "Depths 1–3 open".
- **The class button** opens **Class**: her root ("Spell Blade · Arms ×0.72 + Tome ×0.44" and her Flourish), then the
  six classes in two rows of three, each with its emblem and Class Rank. Switching is free.
- **Equipped · 4/7**: one square per skill slot her Uma Level gives. Each equipped skill shows its kind marks and its
  rank; a tap unequips it. Empty squares are dashed. **Auto** while the game picks for her, else **Back to auto**.
- **The tree** ("Lance tree", with **Change**): two trunk nodes, a fork, then branches A and B down to depth 5, each
  under a square A or B button.
  - A node is a circle with the skill's kind marks and a badge: its rank, or the Class Rank that opens a closed depth.
  - Held nodes have an accent ring; equipped ones are filled, with a green dot. The other branch is dimmed and a closed
    depth faded. The lines fill along her path.
- **A node's sheet:** its name, five rank pips, "Rank 3 · next at Class Rank 14" ("Rank 5" at the top, "Class Rank 30"
  while closed), "Depth 4 · Branch B", its line at her Skill Rank ("one foe · 2 hits · 1.4× · 12 MP · cuts through the
  shield"), and **Equip** or **Unequip** on a held node at an open depth.
- **A branch's sheet** ("Lance · B · Impale"): its three skills, each with "Depth 3 · Class Rank 20" and its line;
  **Take branch B** (free; her equipped skills follow), or "Her branch".
- **Change** opens the slot's sheet ("Slot 1 · Arm"): each weapon of the slot's channel with its grade line ("Lance · G2
  · Might 4 · weak ×1.3"), Held or Hers, and "swaps with slot 2" when she holds it in another slot. Grades are raised on
  the Gear tab.
- Its (i) covers the class, switching, one healer a party, depths, the fork, Skill Ranks, equip slots and weapon grades.
- Below: **Inheritance**, with her Hall seat as a Hero ("Brawler Hero · {Limit Break} · Bond 3/10"), or her Heroes'
  Limit Breaks with "Bond 2/10 · 60%" (" · former Hero" for one she left), or "No inheritance yet"; each opens its hall.
  Then **Class Ranks**: six cells, each class's rank and bar.
- **From the switch (H134)**, Classes v3's rows (`class-view.ts`, `ClassesSheet.tsx`, `PromotionSheet.tsx`; D253; the
  rules are [Classes v3](../design/classes-v3/classes-v3.md) §2, §7, §14):
  - The class button reads her rank, a Tier 0's "R7/10". While she fights as a Tier 0 at Rank 10 with a child she
    doesn't hold, it reads **Promote** with the green Ready dot, the Skills tab carries the same dot, and her roster face
    the can-upgrade mark (the "Can upgrade" filter finds her). Tapping it opens the promotion sheet; otherwise **Classes**
    replaces the Class sheet.
  - **Classes**, the class tree: Warrior · All-Rounder · Mage over five columns, the Tier 0 row (Recruit, Duelist,
    Acolyte, Caller, Initiate) over the Tier 1 rows (Brawler, Arms Spellblade, Paladin, Arms Summoner, Sorcerer; Tome
    Spellblade, Cleric, Tome Summoner). Each tile: emblem, name and its word, "R34" (On, the accent fill; or Held,
    raised), "R7/10" on a Tier 0, **Ready** with a green dot (a child of a Tier 0 she holds at Rank 10), "R1 · free"
    dashed (a Tier 0 she hasn't started), **Closed** at 40%. A later tier's world has no Tier 0 row and every Tier 1
    class "R1 · free".
  - A tap selects (a ring) and writes the line under the tree: "Arms Summoner · Ready", "2 Arms + 1 Tome · Area ·
    lingers", its three defaults and "Hand · Arms ×0.57 · Tome ×0.46" (a Tier 0: "Any 3 weapons · Drill Strike" and
    "Promotes to Brawler, Arms Spellblade, Arms Summoner"), and "Party 1: 2 healers" in the warning colour when the
    selected healer would make two in her party.
  - The footer acts on the selection: **Fight as Arms Spellblade** or **Start Caller · R1** (free; the sheet stays open,
    the class On), **Promote to Arms Summoner** (the promotion sheet replaces this one on that child), "Fights as
    Brawler" on her own class, and on a closed one its gate, "Opens with Duelist R10 or Initiate R10", disabled.
  - **Class Manuals ›** ("Exchange") opens the Exchange's Manual sheet on her at `/town/exchange/manual/:outfitId`; its
    Back returns to the Skills tab with Classes open.
  - **The promotion sheet** ("Promote · Recruit R10", "Free · the others stay open"): one tile a child, **Suggested** on
    the suggested one (opened on it, or on the Ready tile's child), **Held** on one she holds; each with its slots, three
    defaults and role, a row the same on every tile left out. Under them "Recruit R10 → Brawler R11" and "Depths 1–2 · 6
    skills · +400 EXP" (the EXP waiting on her Tier 0 lands at once). **Promote to Brawler** (free, no confirm) closes it
    and the tab shows the Brawler's first tree; on a held child **Fight as …**. **Classes ›** swaps back to the tree.
  - **A Tier 0's trees** are one node each, no letters on the weapon buttons and no fork: "Drill Strike · Greatsword",
    its line at her Class Rank ("one foe · 1 hit · 2.1× · 10 MP") and "R7/10"; its sheet has no pips ("Rank 7 · next at
    Class Rank 8", "Depth 1 · Trunk"). Under it "Promotion at R10 · 3 to go" with a bar to Rank 10, or at Rank 10
    "Promotion · +400 EXP waiting" ("Promotion · Ready" with none), which opens the promotion sheet. Her rank row and
    depths line are left out. **Change** lists all ten weapons for any of her three slots.

**Battle tab** (`umaBattleSheet`, `packages/domain/src/save/sheet.ts`; the rules are
[combat](combat.md#where-damage-comes-from)):
- "Fights as Mage" with "5/7 skills · Party 1" (opens Skills).
- Four groups in three columns, every row always listed, 0 included:
  - **Offense:** ATK, M.ATK, Might for each of her three weapons ("Fire Tome +8"), Accessory ("Pendant: +2 on her three
    kinds", "Orb: Fire +8", "Bell: Katana 0.4 after her Attack", "Insignia: +6% on sub-bosses and bosses", or "None"),
    and Signature ("+10 ★") while she wears her family;
  - **Defense:** DEF, M.DEF, Evasion;
  - **Sustain:** HP, a healer's Mends ("×1.33 (from M.ATK)" for a Cleric, "(from ATK)" for a Paladin), MP with what she
    regains a round ("296 · +13 a round"), and ★ Flourish ("Even pace · 1% a round, up to 4%", or "No effect as
    Brawler");
  - **Other:** Limit Break head start ("1 / 12").
- The six core battle stats show their total, then in brackets what gear adds (blue) and what Extra Stats add (green),
  her moon's points starred. Its (i) gives the stat formula in words.
- Then her five core stats (Speed, Stamina, Power, Guts, Wit) and the date she was unlocked.

**Gear tab** (`GearCardV3.tsx`, `gear-equip.ts`, `gear-v3.ts`, `PresetButton.tsx`; H107, D223; the rules are
[classes](classes.md#armor-and-the-accessory), [loops](loops.md#gear) and [materials](materials.md#gear)): two views,
**Equip** first and **Upgrade** ("Upgrade · 12" counts the raises ready and the jewels to set), the choice remembered
for the session.
- **Equip**, what she wears:
  - the standard preset: "Use standard preset · Spell Blade · Physical · Pendant", or "Standard preset on". It sets her
    class's default weapons and puts her ★ family on its kind; no grade moves.
  - **Loadout** ("Set on Skills ›"): her three weapons' icons with their grades, then "Physical armor" or "Magical
    armor" with the five slots' icons and grades. A slot at G0 is an empty frame.
  - **Accessory · G4**: four family buttons in one row, her ★ family first, then Bell, Pendant, Orb and Insignia; the
    one she wears is ringed. Below, the selected family only: its name; what it does at the slot's grade ("+2 on her
    three kinds"; "From G1: …" at G0); "★ Her signature: ATK and M.ATK +10" on her family; "No Greatsword in her slots"
    on a Bell or Orb left on a kind she no longer holds; for a Bell or an Orb, one kind button per weapon she holds; and
    one button: **Equip**, **Equipped**, or "Switch to Lance".
- **Upgrade**, what she spends:
  - **Grades**, in three groups: Weapons ("Greatsword · G3 · Might 8 · weak ×1.3"), Armor ("Head · Helm · G2 · DEF +8")
    and Accessory ("Pendant · G4 · +2 on her three kinds · ★ +10", "Bell · Katana · G0 · counts from G1", "Accessory ·
    G0 · Pick a form"). Each row's pill raises it at once ("G3 → G4 · 1 Arms Gem G4"; Tome Ink on a Tome), with the
    green mark, or says why not ("Needs Lv 16", "Needs 1 Arms Gem G4", "Already G10").
  - A row's sheet: "Now · G3 · Might 8 · weak ×1.3", "Next · …", an armor slot's half ("Her class's half · Helm"), the
    raise button, and **Up to G6** when the Warehouse holds several grades, which lists the items and asks Cancel or
    Raise.
  - **Extra Stats:** "3 to set" while jewels can be set, "8/22 open · map ›" (her Observatory map), and "Total with
    armor: HP +55 · …".

**Work tab:** her job ("Working at Mine", the item, "1/3" and the time left; opens the place), then "Craft Lv 30 · Mine
· Weapon Forge" (her trade), "10 gathered in 7h 13m", her Craft EXP bar, and "grade 6 open · grade 7 at Craft Lv 31".
The "10 gathered" time is still the old farm's gather (54 → 36 minutes an item, no ×1.25), not the trios' steps the
places use ([loops](loops.md#craft-level)).

**Racing tab:** her aptitudes (Surface, Distance and Style, each grade on a coloured chip), **Her template** (Calling,
Stride, Knack and Flourish, each with its note: what it read or "Picked"; "Active" or "No effect as Brawler"; a locked
outfit's "As a Mage"), her racing base stats and growth, and her unique skill (racing).

### Party Hall

Routes: `/town/party-hall` and `:n` (1–20); `PartyHallPage.tsx`.
- **The list:** twenty parties, each with its name, "5/5 · Edit" (green when full) and five faces with level, class and
  her signature family ("★ Pendant"). The lead has an accent ring and a flag. A party with two healers says "One healer
  a party" in the warning colour.
- **The editor:** "All parties" (back), the name with **Rename**, then five slots (face, name and "Lead · Mage"; an
  empty one "Slot 3 · add an Uma") and the healer note.
- **An empty slot** opens the shared picker, "Choose an Uma": owned Umas, highest Uma Level first. One in another party
  is dimmed with "Moves from Party 2" and moves here when picked (D46). "In this party" and "In a fight" are disabled.
- **A filled slot** opens her sheet: **Make party lead** (or "Party lead"), **Swap with another Uma**, **View profile**,
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
- **Manuals** (its (i): Class Marks bank past a max Class Rank, and a Manual's price and EXP): **Read a Class Manual**
  with "Class Marks 3,000". It opens the Class Manual sheet (`manual-view.ts`, D102, D250) at `/town/exchange/manual`:
  the shared picker (highest Uma Level first, locked Umas disabled), then her bars at `/town/exchange/manual/:outfitId`
  (a link may open it there; closing the sheet returns to `/town/exchange` and the place's Back still leads where it
  came from). The head reads "Aster · Class Marks 78,000". Her six classes are one row each (emblem, name, "R34" and its
  bar; "R50 · Max"), the class she fights as selected first; a tap selects another (its ring). The counts are chips, 1 ·
  5 · 10 · "Max · 78" (as many as the Marks buy, up to 99); one the Marks can't buy is disabled. The footer shows before →
  after from the class's own curve ("Brawler R34 → R36", and "+360 Class Marks back" for EXP past Rank 50) and **Read 2
  · 2,000 Class Marks**, or the reason it can't ("Already at the top rank", "Needs 10,000 Class Marks"). After a read the
  sheet stays open on the new state; "Choose another Uma" returns to the picker.
- **From the switch (H134)**, Classes v3's rows: in Tier 1's world the bars are the five Tier 0s, her calling's first
  ("R1/10 · Calling"), then the Tier 1 classes she holds in the tree's order (a closed one isn't listed); a later tier's
  world lists the eight Tier 1 classes, her active class first. A Tier 0 at Rank 10 reads "R10 · +400 EXP waiting": its
  EXP waits for her promotion up to 23,680, and its counts stop at that room ("Room for 4"). The chips add "To Rank 10 ·
  4" on a Tier 0 below Rank 10 and "Her share · 21" (her reset Manuals not read yet, counting down on any bar she reads;
  shown in the head too) while the reset's record lists one; the sheet starts on her share. The (i) adds the Tier 0's
  bank and what her share is.

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
- **From the switch (H134), the classes' reset**, only in a world migrated through save v32: "The classes are rebuilt ·
  78 Class Manuals", which reopens "The classes are rebuilt" (`?sheet=classes`).
- **Achievements** (`achievements/AchievementList.tsx`, [loops](loops.md#achievements)): "3 of 14", the earned ones
  newest first with "21 Oct · Tier 1 run 2" (the Bestiary has no run), then the rest dimmed with how each is earned. It
  lists Tier 1's four seals and Rift Conquered, every other world's, and the nine titles; a seal reads "Iron Seal · Tier
  1", and Untouched shows its front's crest.
- **About:** Tier world, Trainer since, Umas unlocked in every world ("26 / 270"), Cloud save, Game data, App build.
- "Update ready · Restart" while a new build waits, and **Sign out**.

**"The Wilds are rebuilt"** (`grant/GrantSheet.tsx`, `grant-lines.ts`; the grant is in
[loops](loops.md#the-tier-reworks-grant)): it opens by itself once per world with an unseen grant (never over a
world-map fight), and from the Account's row (`?sheet=grant`). Its lead (still "Ten professions, each in its own
place."), "+63,800 Speed Tickets" and the hours of work, then What went, What came back, What stays, and By Uma ("Craft
Lv 30 → 1 · 1,470", with her trade). **To the Wilds** and **Later** both mark it seen.

**"The classes are rebuilt"** (from the switch, H134; `grant/ClassesSheet.tsx`, `classes-lines.ts`, D250; the reset is
classes-v3.md §8): it opens by itself once per world whose save v32 record is unseen, once the reset's trades have
settled and never over a world-map fight, after "The Wilds are rebuilt" when both wait; and from the Account's row. "+78
Class Manuals" and "78,000 Class Marks · Exchange"; "Every Uma starts her class tree at Rank 1 of her Tier 0." with the
three roots and their Tier 0s; How to rebuild an Uma (Exchange → Read a Class Manual → her Tier 0 → Her share; Her
profile → Class → Promote at Rank 10); At a glance: Reset, Stays, Weapons, Trades ("2 Umas moved trade · their running
work finished into the Warehouse") and Halls (the Paladin Bastion and the Cleric Chapel into the Healer Sanctum, each Uma
whose role moved, "Each Uma keeps her higher Bond"); then each Uma with a share or a moved trade, most Manuals first, with
her face ("Spell Blade R26 · Mage R8 → Initiate R1 · trade Wood → Stone", her share on the right). A later tier's world
reads "Every Uma starts again at Rank 1 of her class." with one step and no tree. **To the Exchange** (the Manual sheet's
picker) and **Later** both mark it seen.

## Learning

### Halls of Heroes

The six halls share `places/halls/HallPage.tsx` (D106; the rules are [Halls of Heroes](heroes.md)).
- "Brawler Hall of Heroes" with its (i), and "Four Heroes, each with her own Limit Break, and their Learners."
- **Four seats**, each with: the Hero's bust (or **+ Hero**), "Seat 1 · Limit Break", its name and kind icons, the twin
  sets it answers ("Answers Fire · Light", CP28), its line, and the Hero's name or "No Hero yet". Under a seated Hero:
  "Learners 3/10", each a face with her Bond level and bar, and **+** to add one.
- **The pickers** ("Hero for {Limit Break}", "Learner for {Limit Break}"; the shared picker, highest Uma Level first):
  Umas that can't take the seat stay listed with why ("Locked", "Already seated here", "Already a Hero", "A Learner:
  leave her Heroes first", "A Hero", "Already learning here", "Already has 2 Heroes", "10 Learners at most"). A Learner
  candidate shows "Bond 2 · 1/2 Heroes" and the sets the seat adds to her weapons' ("Adds Light, Dark, Twilight").
- **A Hero's sheet:** she uses the seat's Limit Break at full strength; her own Bond with the seat; **Change Hero**;
  "Empty this seat (its 3 Learners leave; their Bonds stay)".
- **A Learner's sheet:** "Bond 4/10 · 70% strength", its bar and the EXP to the next, "Inherits {Limit Break}, and
  {another} from her other Hero.", and "Leave this Hero (her Bond stays)".

### Observatory

`places/observatory/ObservatoryPage.tsx`, route `/learning/observatory/:outfitId` (the rules are
[loops](loops.md#extra-stats), [jewels](materials.md#jewels) and [Extra
Stats](../design/tier-rework/extra-stats-progression.md)). It opens on the Uma its route names, else the highest Uma
Level.
- Her face and name with "Open 8 of 20 · ★ 1 of 2"; a tap opens the shared picker, "Observatory Uma" (locked Umas
  disabled, working ones selectable).
- **Extra Stats**, with its (i): "Each node opens with its jewel, in order. Every open node counts."
- **Her map:** the Planet in the middle; Prowess, Vigor and Guard around it, five nodes each; and her own moon's two, "★
  Longblade". An open node is filled. A tap opens its sheet: "Prowess II"; what it gives ("+4 to every stat", "as
  Brawler ATK +6, M.ATK +0", "HP +30, MP +6", "DEF and M.DEF +6"; her moon's "Tireless · HP +20" and "DEF +8"); and its
  jewel ("needs a Planet Jewel III · opens at Lv 21", or "Planet Jewel III · Open").
- Prowess's split ("Prowess · Brawler 100/0: ATK +6, M.ATK +0"), then the six stats' totals, her moon's part starred.
- **Set:** each jewel in the Warehouse that opens one of her nodes now ("Moon Jewel I ×4", "Opens Prowess I · …",
  **Set**), or "No jewels ready." A jewel that fits several nodes asks which one.

Its quick look and (i) show the place's line, which still reads "a Sun, eight planets and their moons".

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
  - The five: face with "Lv 50", the MP she carries between stages (Springs refill it), her class. A tap opens her
    Skills.
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
  "Tap a rival: Fire Tome Attack + Greatsword Attack · 16 MP", a Summoner's Tome half first; "Tap an ally for {Uma} to
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
  - a run: its four **fronts** (crest, name, "5/12" or "Sealed", the party guidance "2 Brawler · 2 Spell Blade ·
    Paladin") and the **Convergence** card ("Seal all four fronts", "Assign four parties · 2 attempts", "Fight 2 of 4 ·
    Arcane", "Won");
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
  - on the next stage, a party of the roster (the best fit for the front's guidance first; a party that can't fight
    there, "One healer a party" among the reasons, is disabled), the **guided weapons** (each member's three build
    weapons under her face, "—" where the build has no place for her; **Use the guided weapons** sets them in one save,
    or "On the guided weapons"), and **Fight**.
- **The Convergence:** four rows, Iron, Arcane, Duel and Horde, each with its fight's size, **Foes** and a party
  (suggested from the fronts' guidance; a party picked for another row is disabled). **Begin** when the four cover the
  twenty (else "Missing: …") starts the attempt and its first fight. With an attempt on: its four parties, "Won · 6
  rounds", "Next" or "—", **Fight: Arcane** and **End this attempt** ("The next attempt starts from Iron.").
- **An Echo's sheet** ("Iron Echo · Lv 55"): its foes, a party of five Lv 50 Umas, its guided weapons, and **Fight**
  ("Fight again" once won). Once won, **Sweep ×1** and **Sweep ×5** with the Sweep Tickets held; a Sweep's result shows
  like a win.
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
| Place | Profession | Job | What it does | Its trade (callings) |
|---|---|---|---|---|
| Mine | Mining | Gathering | Gathers metal, G1–G10 | Brawler |
| Mine Workbench | Smelting | Processing | Processes metal raw into refined, one for one | Brawler |
| Weapon Forge | Arms Crafting | Making | Makes Arms Gems | Brawler |
| Fields | Farming | Gathering | Gathers vegetables, G1–G10 | Paladin, Cleric |
| Fields Workbench | Prepping | Processing | Processes vegetables raw into refined, one for one | Paladin, Cleric |
| Tome Forge | Tome Crafting | Making | Makes Tome Ink | Paladin, Cleric |
| Forest | Wood Chopping | Gathering | Gathers wood, G1–G10 | Spell Blade |
| Forest Workbench | Sawing | Processing | Processes wood raw into refined, one for one | Spell Blade |
| Armorer | Armor Crafting | Making | Makes Armor Fittings | Spell Blade |
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
  and the open shop). A place whose trade has no Uma in the world says so: "Open shop: no Brawler in this world" ("no
  Paladin or Cleric" on the Vegetables row). **Collect here** when work is done; **Finish all · 14 Speed Tickets** when
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
  - **How many** follows the picked job (D233), each size with its time: ×1, ×2, ×3, ×5, ×10, ×15 or ×20 to gather or
    process (about half an hour to 8 hours); a make's sizes stop near 8 hours (Armor Fittings to ×10, a Moon Jewel ×5,
    an Arms Gem or Tome Ink ×3, an Accessory Setting or a Planet Jewel ×2). A targets link keeps its own count. A chosen
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
