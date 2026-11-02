# Current phone check

Use this script for a release, in order, on the [live game](https://uma-rpg.web.app). It tests the game as it runs today
(engine v21, save v35); the screens are in [Game sections](../game/sections.md) and the rules in the [game
manual](../game/README.md). Record the App build, device, date and any failed step when reporting a problem.

Use your existing save; do not reset it. Before you start, have: one full party of five with one healer; an Uma at Lv 10
or more; a cleared regular stage; some Laurels, Speed Tickets, Sweep Tickets and Class Marks; and, for one Uma, a made
item that raises one of her slots now and a jewel she can set (make them in steps 20–21 first if you have none). Raising
grades, setting jewels, reading Manuals, promoting and spending tickets are real progress on the save. Jobs finish while
you are away, or with Speed Tickets (step 22).

**Phone only** means an installed iPhone app or the production service is required; local auth-off previews cannot check
it. Check the other steps at 390×844, then repeat the busy screens at 375×667: the Wilds page, the profile's four tabs and Details,
the Classes and promotion sheets, a Wilds job sheet, the Learning page, the Window sheet, the Gallery, the Drills page, the fight and the Exchange's Manual sheet. Every
button and footer should stay reachable without horizontal page scrolling, in light and dark.

1. **Phone only — install.** In Safari open the live game, tap Share → Add to Home Screen, then open Uma RPG from its
   icon. Expect the app without Safari's address bar and with content clear of the notch and Home indicator. After a
   status-bar metadata change, remove the existing Home Screen app first: iOS freezes that metadata when it is
   installed. Expect an opaque status bar with no blur over the top bar. **iPhone 15, 393×852 (D149):** the bottom bar
   is docked to the screen's bottom edge, with no empty band below it. Its panel runs under the home indicator, and its
   tabs sit just above it. Place pages, the side panel and sheets reach the bottom too, and place pages scroll inside
   the frame. **Shell (D147):** the top bar shows your initial with the Tier crest, then Laurels, Speed Tickets and, in
   Tier 1, Uma Tickets `N · s/5`. The bottom bar reads Town Hall · Learning · Battle (raised) · Wilds · Menu. In
   **Account → Appearance**, Light and Dark switch the whole app at once and System follows the phone; a fight stays
   dark either way.
2. **Phone only — sign in.** Tap **Sign in with Google** with the owner's account. On a new save, enter a trainer name
   and tap **Enter the Hub**: expect an empty Stable and 20 Uma Tickets. On an existing save, expect your Hub on the
   last page you viewed.
3. **The classes are rebuilt** (the first open after save v32 only). Expect the sheet once, not over a fight: "+n Class
   Manuals" and "n,000 Class Marks · Exchange"; "Every Uma starts her class tree at Rank 1 of her Tier 0." with Warrior ·
   All-Rounder · Mage and the five Tier 0s; the two steps; Reset, Stays, Weapons, Trades (if any moved) and the Halls
   line ("Paladin Bastion · Cleric Chapel → Healer Sanctum"); then each Uma's line, most Manuals first ("Spell Blade
   R26 · Mage R8 → Mage R1 · trade Wood → Stone", her share on the right). Tap **To the Exchange**: the Manual
   sheet's picker opens; go back. Reload: the sheet doesn't open again. In **Account**, the row "The classes are rebuilt
   · n Class Manuals" reopens it; **Later** closes it. (D247, D250)
4. **Account.** Tap your initial, edit **Trainer name** and tap **Save**; reopen the Account. Expect the name kept, the
   **Tier 1 wallet**, the achievements list and the **App build** naming the release. **Cloud save** reads "Synced" and a
   time; no red line sits under the top bar (D260). In a world the Tier rework
   migrated, **The Tier rework's grant** row reopens "The Wilds are rebuilt"; **Later** closes it. **Phone only:** if
   **Update ready · Restart** appears, tap Restart and confirm the new build and your save after reopening.
5. **The Hub.** Swipe through the four pages. Expect Town Hall's plaza (up to five chibis; tap one for her sheet with
   **Fight**, **Profile** and **Feature another**, and feature another to see her step in front), Learning's five halls
   (the Warrior Dojo and the Mage Tower on top, the Spellblade Salle and the Summoner Circle below, the Healer Sanctum's
   temple in the middle) and the Observatory under them, Battle's Scenario Gate and Rift (locked with "Opens at five Lv
   50 Umas · n/5" until five are), and the Wilds' fifteen buildings in five rows, each tappable on its own at 375×667.
   Tap the Stable: its quick look opens in the side panel with **Enter Stable**; swipe it away. Tap the Scenario Gate:
   its page opens at once. Open **Menu**: "Every place" by page, with locks and ready counts, then the Account.
6. **Stable roster.** Tap **Town → Stable → Enter Stable**. Expect Uma Level, highest first, by default, with owned Umas
   before locked in either sort direction. Open **Filters**: **Class** lists the thirteen (the five Tier 0s first) and
   **Calling** the five Tier 0s; pick a Calling, then a **Trade** ("Mine · Weapon Forge"): expect only matching Umas
   and a head count on each value. Search the last word of an Uma's template name: expect every Uma of that type. Switch
   faces → cards → list, save the view, reload: expect it kept.
7. **Unlock** (Tier 1). Open a locked outfit, tap **Unlock · 1 Ticket → Unlock for 1 Ticket**. Expect one Ticket spent,
   her profile at Lv 1 as her calling's Tier 0, and the **Owned** count up by one.
8. **Profile frame.** Expect the compact bust, name, title and stars, `Lv n` with `current/next` EXP, then the Party,
   Work and Details doors and the four tabs **Class · Gear · Stars · Template**. The tab bar starts within 150 px of
   the profile main. Tap Party and Work, then Back: expect the same profile tab. Mark her as a target and unmark her.
   Open **Details**: three damage rows, each a glyph and `total (base +Might +accessory +armor +Stars +★)`, a key, five stat tiles
   and **All stats**, with no scroll at 390×844 or 375×667. Add one row up by hand: it equals its total. Check its Might and accessory on Gear. **All
   stats**: every battle row, 0 included, with Core, Work and Since; **How stats add up** expands in place; ‹ Details returns; closing
   and reopening lands on the first page. A locked profile has **Unlock · 1 Ticket**,
   Template content, no level, no tabs and no ticket-balance sentence. (D206, D229, D240, D258, D276)
9. **Class tab: Classes.** On a Tier 0, the class tile reads "R7/10" with its bar, her weapon tiles carry no letters and her
   trees are one node each ("Drill Strike · Greatsword", "R7/10") with "Promotion at R10 · 3 to go" under them; **Change ›**
   lists all ten weapons, and a tap holds one with the sheet still open. Tap the class tile: **Classes** shows the tree,
   Warrior · All-Rounder · Mage over the Tier 0 row and the Tier 1 rows, with her **Standard preset** in the footer on her
   own class. Tap a closed Tier 1 tile: its line and the gate ("Opens with Warrior R10 or Summoner R10"), disabled. Tap another
   Tier 0: **Start Summoner · R1**; start it, expect it On, then switch back with **Fight as …**. (D253, D267)
10. **Promotion and a reclass.** On a Tier 0 at Rank 10 (read her share at the Exchange first, step 24, if none is),
    expect "R10 · Promote" with the green dot on the class tile, a dot on the Class tab and the mark on her roster face.
    Tap the tile: the promotion sheet ("Promote · Warrior R10", Suggested on one child) with "Warrior R10 → Brawler R…" and
    "Depths 1–2 · 6 skills · +n EXP". **Promote to …**: she fights as the child at Rank 10 or more, on its first tree with its
    lines. Reopen **Classes**: her siblings read **Ready**; promote one, then **Fight as** the first again. **Class Manuals ›**
    opens the Exchange's sheet on her, and Back returns to Classes. (D253, D267)
11. **Class tab: trees.** On a Tier 1 class, tap each of the three weapon tiles: a ring and that tree. Tap a held node: its
    sheet shows rank pips, `Rank n · next Rn` and `Depth n · Line A/B`; **Equip** it and the sheet stays open on **Unequip**.
    Tap a square in **Equipped**: its sheet opens and nothing comes off. At 7/7, a held node offers **Replace**: tap it, tap a
    skill, and it swaps. Tap **Auto** when it's off. Tap a node on the other line: **Take line …**. Tap the B square and **Take
    line B**: the footer reads Held, the tile reads B and the tree's equipped skills follow; take A back. A closed node reads
    `Opens · Rn`, disabled. Tap **Limit**: its sheet lists each Limit Break she casts, then her other Bonds; **Open {hall}** opens
    the hall, and Back returns to the sheet. (D201, D206, D229, D267)
12. **Stars and Template tabs.** Stars reads "Extra Stats · Open n/22 · n ready", then the star chart on a night sky in both themes: Prowess a
    spearhead, Vigor a pentagon, Guard a shield, the Planet a ring, each star numbered, a label and count on each body. Filled and lit lines are
    Open, a green dot and a slow pulse are Ready, a bright ring is Next, a dim one Later; a full body closes its figure. Nothing overlaps at
    375×667, and no line bulges off its stars. Tap a body's middle: its next node's sheet, a strip of all its nodes with their values at the top. Tap
    the strip: the sheet moves along the body and never stacks. Below the chart, six totals with their marks, and her moon's ★ line. Tap a closed node: what it gives, before → after, its jewel with what's held, and **Set**, or
    disabled with `Lv n` or `{Node} first`. **Set**: the sheet stays open on Open and the count falls. **Set all** lists each jewel;
    **Set n** sets them. Her moon's nodes read "With its moons". On Template, expect her name, three reading tiles, "Calling · … ·
    fixed" and her trade, four ★ rows, her racing chips with the sources ringed, and **Racing skill ›**. Tap ★ Signature: Gear's
    accessory sheet; tap her ★ row and the row reads Worn. An Uma without her ★ reads Not worn, with no dot on the tab or the roster. Tap ★ Flourish on an
    Uma outside her family: **Fight as …** and the row reads On. Tap a ★ Moon row: Stars' node sheet. An All-Rounder Moon II reads
    `DEF/M.DEF +4`. (D204, D217, D258, D269, D270)
13. **Standard preset.** On a promoted Uma, in **Classes** on her own class, tap **Standard preset**: expect **Standard preset ·
    On** and her preset's weapons. On a Healer, expect two rows, **Paladin** and **Cleric**: tap one, expect it to read **· On**;
    a Warrior or a Mage shows three rows, each listing its accessories. Check the weapon chips' colours in both themes: the
    Katana jade, the Bow rose. (D223, D263, D266)
14. **Gear.** Expect eleven tiles on one screen at 390×844: three weapons, five armor slots, three accessories, each with its grade
    and one stat, and "Physical · n ready" matching the green dots. Tap a ready weapon: "G6 → G8", "Might a → b", each cost with
    what's held and the target chips; tap a lower chip, then **Raise to G…**: the sheet stays open on the new grade and the items
    fall. A blocked slot's footer names the missing item or the "Lv n", disabled; a G10 slot reads "G10 · Max". **Raise all** lists
    each slot and "Uses n items"; **Raise n** raises them. Tap an accessory tile: a list, her ★ family first, an Orb for each weapon
    she holds. Tap a row: the sheet closes and the tile shows it at once; a slot at G0 reads "Off". Set the same accessory in
    two slots, leave and come back: both stick. (D217, D223, D266, D268)
15. **Facts, Details and doors.** A working Uma's Work fact shows her place and time or Done; an idle one reads Idle and opens
    her trade's first place. All stats shows Craft Level and EXP, grade gates and trade. **Doors:** from the roster, a face opens the
    remembered tab; with **Can upgrade** on, the first tab with a dot. Expect **‹ n/N ›** in the place header (near the notch): › keeps
    the tab, closes any sheet and wraps at the end; Back returns to the roster at the same scroll. Open her from the Party Hall's
    **View profile** and the world map's party bar (Class, ‹ › through the party), a Hall's **Profile** in a Hero's or a Learner's
    sheet (Class, ‹ › through the seat), a Wilds worker's face and the plaza's **Profile**: each Back returns there. Party, Work and the
    Limit sheet's hall come back to her on the same tab. A locked profile has no stepper. (D271)
    **Across the profile, at both sizes, light and dark:** target marks readable on every portrait; nothing clipped on long names;
    the four tabs, the class row and the armor tiles fit with no horizontal scroll; sheets fit above the bar; green only on Ready
    dots. The budgets and the type sizes are checked locally: [How to measure](../design/uma-profile-v2/proposal.md#104-how-to-measure).
16. **Party Hall.** Open a party, edit its name → **Rename**, and fill five slots: expect the name and **5/5** in the
    list. Pick an Uma from another party: expect "Moves from …" and her gone from the first party. **Make party lead**
    on another member: the ring and flag move and nobody reorders. Put a Paladin and a Cleric in one party: expect "One
    healer a party" on its card and in the editor, and picking never refused; a Healer never counts. Restore the party.
17. **Reload and sync.** Reload, then reopen the Stable and the Party Hall: expect the unlock, names, slots, grades and
    promotions kept. **Phone only:** open the live game in another signed-in browser and expect the same save after
    cloud sync.
18. **Halls of Heroes.** Open the Healer Sanctum: its title, four seats each a card with "Seat 1 · Paladin" (its home
    class), its shape and power ("One foe · 4 hits · ×2.0 · Brave 1"), "Answers …" and its lore. Open the Warrior Dojo:
    two seats, "One foe · 1 hit · ×2.9" on seat 2. Seat a Hero with **+ Hero**, then tap
    **+** for a Learner: the picker shows `Bond n/10 · n/2 Heroes` and "Adds …", and Umas that can't sit there show why.
    Open the Learner's sheet: expect `Bond n/10 · Strength n%` and **Leave**. A Hero's sheet says
    `Hero · Strength 100%`; emptying its seat uses the compact **Empty seat** confirmation. (D106, D241, D255, D258)
19. **Windows and the Gallery** (save v35). On an owned Uma's profile expect her stained-glass window beside the bust, "n%"
    on its corner; a locked outfit has none. Tap it: the Window sheet, "Tier 1 · n/31 · n%", her window, six rows of five
    tiles with each row's share and the Rift tile; a lit tile shows its day, a row's next tile what's left ("Lv 34/40",
    "8 of 11 at G6"). Tap a tile: its rule and where it comes from under the board. Open **Learning → Gallery** (where the
    Observatory stood): "n full · n ready", "Collection n%", All · Ready · Owned · Locked, and the grid ranked most complete
    first, "1. Name" and "n/31 · n%", then the locked outfits dark with a lock. Tap an owned Uma: her Window sheet; a
    locked one: her Stable profile. Do something that crosses a step (a level, a grade): expect "Window +1 · …" with her
    name for a moment, and the tile lit with today's date. (D283, D287)
20. **Wilds: gather.** At **Wilds → Mine** (or her trade's gathering place) tap a free slot. Expect Who → How many →
    What: her trade's Umas first with "C{Craft Level}", others greyed "Another trade" (unless the header says "Open
    shop: …"); sizes ×1, ×2, ×3, ×5, ×10, ×15 and ×20, each with its time, about half an hour to 8 hours; ten raw tiles,
    the higher ones "From Craft Lv …". Start ×1. Expect her face in the arch over the Mine with her Craft Level and a
    progress ring, and the job in its slot row. (D230, D233)
21. **Wilds: process and make.** At the row's workbench, process a raw item: ten refined tiles. At its making place (the
    Weapon Forge for Metal), pick an Arms Gem G1: the recipe card names its refined input, the count needed and what is
    held, and the sizes stop near 8 hours. Start, finish and collect: expect the item under **Warehouse → Made items**
    and Craft EXP paid. (D232)
22. **Speed Tickets, Finish all, queues.** On a running job tap Speed up: **−30m** spends one Speed Ticket and cuts 30
    minutes; **Finish · N** spends N (a warning when minutes would go unused). With two or more slots running, tap
    **Finish all · N Speed Tickets** → "Finish n jobs for N Speed Tickets?" → **Yes**: expect every slot Done. Collect:
    the Ready badge, the Collect all pill and the Wilds tab's count update. On a running job, **More → Queue next**
    (three at most), then **Recall**: expect the preview of what is collected, what comes back, the minutes lost and the
    queued jobs dropped. (D74, D216)
23. **Targets.** With an Uma marked as a target, open her trade's places: **For your targets** lists what she still
    needs there; tap a short icon and expect the job sheet on that item with that count. A queue that stopped for want
    of inputs shows its card with **Restart** and **Dismiss**.
24. **Warehouse and Exchange.** In the Warehouse, expect the header's two counts and seven shelves: All, Metal, Wood,
    Vegetables, Fish, Stone and Made items, with Every grade, Highest and the grades held as chips; open a stack and
    Sell ×1. At the Exchange, buy one Speed Ticket (10 Laurels) and one Sweep Ticket (15), and ×5 of an open raw item.
    Then **Read a Class Manual** → an Uma with a share: the head's "Her share · n", her five Tier 0 bars (her calling's
    "R1/10 · Calling" first) and the Tier 1 classes she holds; on her Tier 0 the chips "Her share · n", "To Rank 10 · 4",
    1 · 5 · 10 · Max. Read **To Rank 10**, then more: her bar reads "R10 · +n EXP waiting", her share counts down, and
    the sheet stays open. (D102, D250)
25. **World map.** Open **Scenario Gate**. Expect **Map / List** remembered, and the party bar: "Party n · swap" opens
    "Who fights?", **Edit parties** opens the Party Hall, and the five faces show their MP. Open a continent and a Lv 1
    region: twelve stages, the first uncleared one open. Tap an open stage: its sheet lists the foes by wave, each with
    "Shield n · Weak:" and her icons (in Tier 1 four kinds on a regular, three on an elite or boss), and **Fight**.
    (D72, D237)
26. **Fight.** Tap **Fight**. Expect the header (the wave chip on a multi-wave stage, Round, Auto, speed, menu), foe
    cards with the shield badge and up to four weakness icons and no "Weak:" word, and the party's HP and MP bars. Pick
    a weapon in the three-weapon row and tap a foe: its preview shows above it (yellow when weak), then the hit; a weak
    hit chips the shield. Open **Skills**: each skill's MP and "weak: …"; cast one. On a stage with several foes, cast a
    **volley** (a Bow or Dark Tome skill): her foe takes the hits and every other foe one splash hit. With a Spellblade or
    a Summoner, the line above the buttons names both halves, her lead half first; after a Summoner's second pair, her
    lingering summon strikes every foe in farewell. Use **Guard** on an ally. When **LB** appears, open it and use a
    Limit Break at 0 MP; a Healer Sanctum one leaves its stack (Brave or Faith on every ally, or Armor Break or Mind
    Break on the foe first). (D206, D237, D246, D248)
27. **Auto and speed.** Tap **Auto**, then the speed: 1× → 2× → 4×. Expect allies to act without input and effects to
    speed up; a manual tap stops Auto. Reload between fights: expect Auto and the speed remembered. (D89)
28. **Leave and resume.** Mid-fight, open the menu → **Back to the map**, then reload. Tap **Resume the open fight**:
    expect the same round, HP and MP. Then **Give up**: expect no rewards, no clear and MP as before the fight.
29. **Result.** Win a stage. Expect **Victory!**, the rounds and "First clear!" on a first win, the Laurels chip, and
    for each Uma her EXP, her Class Rank bar and any "… reached Rank n" or "… opened" line; a Learner's Bond. Tap
    **Fight again** and win: no "First clear!", a smaller pay, and the map keeps the clear and counts the win. (D79,
    D206)
30. **Sweep.** On a cleared regular stage tap **Sweep · n → ×1**. Expect one Sweep Ticket spent, a "Swept with a ticket"
    result like a win, and MP unchanged. An elite, a boss or an uncleared stage offers no Sweep. (D79)
31. **Spring.** With some MP spent, tap the region's **Spring · MP** (or a continent's Spring). Expect the party's MP
    refilled and its recharge time; it is off during an open fight. (D72)
32. **Drills** (save v35; after the tier's first map win). Open **Battle → Drills**: "Runs n · +10 at 4:00", **Read Logs ·
    n** and five rows, "Drill I · Lv 10" to "Drill V · Lv 50", "2 Logs a win" to "6". Fight Drill I: expect the fight,
    "+2 Training Logs" and one run fewer. Then **Sweep ×1**: one run spent and the Logs added. **Read Logs**: pick an Uma
    below Lv 50, a count, **Read n**: "Lv a → b · Ra → Rb", and the sheet stays open. (D286)
33. **The Rift and Trials** (a tier with five Lv 50 Umas; skip otherwise). Open the Rift's quick look and page: each
    front's guidance by family ("2 Brawler · Arms Spellblade · Arms Summoner · Paladin"). Open **Battle → Trials** and a
    Trial: its foes ("Shield n · Weak:" and the ward), a party, its guided weapons with **Use the guided weapons**, and
    under them each guided class the party lacks ("Needs an Arms Summoner") with the Umas who could fill it, "Ready to
    promote" first, then "Holds it"; a row opens her Class tab. **Fight**; win or give up, and expect "Back to Trials". If
    a run is on, open a front's chain (the next stage ringed), its stage sheet, the Convergence card and **Roster**: the
    twenty windows with "n/31". After a won run, the Rift shows a **Gallery** door, "Rift won · n ready", and **Sign up
    twenty** again. With a ready Uma, the Gallery's **Ascend n** lists her ticked, "Lv 1 in Tier 2" and the purse;
    ascend only an Uma you mean to move up. Sign up twenty only for a run you mean to play. (H50, H153, D206, D283, CV23)
34. **Tiers.** Tap the crest: the Tier sheet shows one card per tier, a tier with no world locked with "Promote Umas
    through the Tier n Rift". With a Tier 2 world, pick it: expect the veil, Tier 2's Town Hall in dusk amber and its
    own wallet with no Uma Tickets chip; its Umas' Classes sheet has no Tier 0 row. Switch back. (H35, H36)
35. **Phone only — push.** In the Home Screen app open **Account → Notifications**, turn it on, allow the prompt and tap
    **Send a test**. Expect the test push. Leave a job near its end and close the app: expect "Work done" with its
    place, item and count within about five minutes of the end; tap it and expect that place on its tier, its Ready
    state and the app badge.
