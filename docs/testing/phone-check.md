# Current phone check

Use this script for a release, in order, on the [live game](https://uma-rpg.web.app). It tests the game as it runs today
(engine v18, save v31); the screens are in [Game sections](../game/sections.md) and the rules in the [game
manual](../game/README.md). Record the App build, device, date and any failed step when reporting a problem.

Use your existing save; do not reset it. Before you start, have: one full party of five with one healer; an Uma at Lv 10
or more; a cleared regular stage; some Laurels, Speed Tickets and Sweep Tickets; and, for one Uma, a made item that
raises one of her slots now and a jewel she can set (make them in steps 17–18 first if you have none). Raising grades,
setting jewels and spending tickets are real progress on the save. Jobs finish while you are away, or with Speed Tickets
(step 19).

**Phone only** means an installed iPhone app or the production service is required; local auth-off previews cannot check
it. Check the other steps at 390×844, then repeat the busy screens at 375×667: the Wilds page, the Skills and Gear tabs,
a Wilds job sheet, the fight and the Exchange. Every button and footer should stay reachable without horizontal page
scrolling, in light and dark.

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
3. **Account.** Tap your initial, edit **Trainer name** and tap **Save**; reopen the Account. Expect the name kept, the
   **Tier 1 wallet**, the achievements list and the **App build** naming the release. In a world the Tier rework
   migrated, **The Tier rework's grant** row reopens "The Wilds are rebuilt"; **Later** closes it. **Phone only:** if
   **Update ready · Restart** appears, tap Restart and confirm the new build and your save after reopening.
4. **The Hub.** Swipe through the four pages. Expect Town Hall's plaza (up to five chibis; tap one for her sheet with
   **Fight**, **Profile** and **Feature another**, and feature another to see her step in front), Learning's six halls
   and the Observatory, Battle's Scenario Gate and Rift (locked with "Opens at five Lv 50 Umas · n/5" until five are),
   and the Wilds' fifteen buildings in five rows, each tappable on its own at 375×667. Tap the Stable: its quick look
   opens in the side panel with **Enter Stable**; swipe it away. Tap the Scenario Gate: its page opens at once. Open
   **Menu**: "Every place" by page, with locks and ready counts, then the Account.
5. **Stable roster.** Tap **Town → Stable → Enter Stable**. Expect Uma Level, highest first, by default, with owned Umas
   before locked in either sort direction. Open **Filters** and pick a **Calling**, then a **Trade** ("Mine · Weapon
   Forge"): expect only matching Umas and a head count on each value. Search the last word of an Uma's template chip:
   expect every Uma of that type. Switch faces → cards → list, save the view, reload: expect it kept.
6. **Unlock** (Tier 1). Open a locked outfit, tap **Unlock · 1 Ticket → Unlock for 1 Ticket**. Expect one Ticket spent,
   her profile at Lv 1 and the **Owned** count up by one.
7. **Profile.** Tap the template chip: expect **Her template** with Calling, Stride and Knack and what each read, her
   trade, her Flourish and its state, her Signature and her Moon. On a Pace or Late Uma whose calling is open, expect
   the calling card: two tiles, each with its trade and head count, the suggested one marked. Tap the other tile and
   back; don't **Confirm** unless you mean it ("Her first win confirms it."). Mark her as a target and unmark her. Tap
   the class cell (Skills opens) and the Party or Working cell (its place opens). (D206, D216, D229)
8. **Skills tab.** Tap the class: the Class sheet lists six classes; switch to another and back, and expect each class
   to keep its own weapons and skills. Tap each of the three tree buttons. Tap a held node: its sheet shows rank pips,
   "Rank n · next at Class Rank n" and its line; **Equip** it, then tap it in **Equipped** to take it off. Tap the B
   square and **Take branch B**: expect the tree's letter to read B and its equipped skills to follow; take A back. Tap
   **Back to auto** if shown. Tap **Change**: the slot sheet lists the channel's weapons with their grades; pick
   another, expect the tree to change, and put it back. (D201, D206, D229)
9. **Battle tab.** Expect four groups in three columns: Offense (ATK, M.ATK, Might for each weapon, Accessory, and
   Signature while she wears her family), Defense, Sustain (HP, MP with "+n a round", ★ Flourish, or "No effect as …"
   outside her calling's class) and Other; gear's part in blue and Extra Stats' in green. (D204, D217)
10. **Gear → Equip.** Tap **Use standard preset**: expect "Standard preset on". Tap each accessory family: one detail at
    a time, her ★ family first with its signature line. On a Bell or an Orb, the kind buttons are her three weapons';
    **Equip** one, then pick another kind and tap "Switch to …". (D223)
11. **Gear → Upgrade.** Expect "Upgrade · n" to match the green marks. Tap a ready pill: the grade goes up by one, one
    made item is spent and the count drops. A blocked row says why ("Needs Lv …", "Needs 1 Arms Gem G…", "Already G10").
    On a row with several grades in stock, open it, tap **Up to G…**, read the list and **Raise**. Tap **Extra Stats**:
    her Observatory map opens. (D217, D223)
12. **Work and Racing tabs.** Work shows her job, if any, and "Craft Lv n · {her trade}" with her Craft EXP bar. Racing
    shows her aptitudes, **Her template**, her racing stats and her unique skill.
13. **Party Hall.** Open a party, edit its name → **Rename**, and fill five slots: expect the name and **5/5** in the
    list. Pick an Uma from another party: expect "Moves from …" and her gone from the first party. **Make party lead**
    on another member: the ring and flag move and nobody reorders. Put two healers in one party: expect "One healer a
    party" on its card and in the editor, and picking never refused. Restore the party.
14. **Reload and sync.** Reload, then reopen the Stable and the Party Hall: expect the unlock, names, slots and grades
    kept. **Phone only:** open the live game in another signed-in browser and expect the same save after cloud sync.
15. **Halls of Heroes.** Open a hall: four seats, each with "Answers …". Seat a Hero with **+ Hero**, then tap **+** for
    a Learner: the picker shows "Bond n · n/2 Heroes" and "Adds …", and Umas that can't sit there show why. Open the
    Learner's sheet: her Bond, its strength and **Leave this Hero**. (D106, D206)
16. **Observatory.** Pick an Uma: expect "Open n of 20 · ★ n of 2" and her map with "★ {her type}". Tap a closed node:
    its sheet names its value and jewel. Tap **Set** on a ready jewel: the node fills, the counts and totals go up and
    the jewel is spent. A Moon Jewel that fits several nodes asks which. (D217)
17. **Wilds: gather.** At **Wilds → Mine** (or her trade's gathering place) tap a free slot. Expect Who → How many →
    What: her trade's Umas first with "C{Craft Level}", others greyed "Another trade" (unless the header says "Open
    shop: …"); sizes ×1, ×2, ×3, ×5, ×10, ×15 and ×20, each with its time, about half an hour to 8 hours; ten raw tiles,
    the higher ones "From Craft Lv …". Start ×1. Expect her face in the arch over the Mine with her Craft Level and a
    progress ring, and the job in its slot row. (D230, D233)
18. **Wilds: process and make.** At the row's workbench, process a raw item: ten refined tiles. At its making place (the
    Weapon Forge for Metal), pick an Arms Gem G1: the recipe card names its refined input, the count needed and what is
    held, and the sizes stop near 8 hours. Start, finish and collect: expect the item under **Warehouse → Made items**
    and Craft EXP paid. (D232)
19. **Speed Tickets, Finish all, queues.** On a running job tap Speed up: **−30m** spends one Speed Ticket and cuts 30
    minutes; **Finish · N** spends N (a warning when minutes would go unused). With two or more slots running, tap
    **Finish all · N Speed Tickets** → "Finish n jobs for N Speed Tickets?" → **Yes**: expect every slot Done. Collect:
    the Ready badge, the Collect all pill and the Wilds tab's count update. On a running job, **More → Queue next**
    (three at most), then **Recall**: expect the preview of what is collected, what comes back, the minutes lost and the
    queued jobs dropped. (D74, D216)
20. **Targets.** With an Uma marked as a target, open her trade's places: **For your targets** lists what she still
    needs there; tap a short icon and expect the job sheet on that item with that count. A queue that stopped for want
    of inputs shows its card with **Restart** and **Dismiss**.
21. **Warehouse.** Expect the header's two counts and seven shelves: All, Metal, Wood, Vegetables, Fish, Stone and Made
    items, with Every grade, Highest and the grades held as chips. Open a stack: its line ("Metal · G1 · raw · Refines
    into Copper Ingot"). Sell ×1: one fewer, Laurels up. (D222)
22. **Exchange.** Buy one Speed Ticket (10 Laurels) and one Sweep Ticket (15): expect the counts up. Under **Raw
    materials**, switch line tabs: G1–G5 open after the tier's first win and G6–G10 after a win on continent 3, else
    locked with that reason; buy ×5 of an open one. If you have Class Marks, **Read a Class Manual** → an Uma → ×1 on a
    class: 1,000 Class Marks for 1,000 EXP on that bar. (D102)
23. **World map.** Open **Scenario Gate**. Expect **Map / List** remembered, and the party bar: "Party n · swap" opens
    "Who fights?", **Edit parties** opens the Party Hall, and the five faces show their MP. Open a continent and a Lv 1
    region: twelve stages, the first uncleared one open. Tap an open stage: its sheet lists the foes by wave, each with
    "Shield n · Weak:" and her icons (in Tier 1 four kinds on a regular, three on an elite or boss), and **Fight**.
    (D72, D237)
24. **Fight.** Tap **Fight**. Expect the header (the wave chip on a multi-wave stage, Round, Auto, speed, menu), foe
    cards with the shield badge and up to four weakness icons and no "Weak:" word, and the party's HP and MP bars. Pick
    a weapon in the three-weapon row and tap a foe: its preview shows above it (yellow when weak), then the hit; a weak
    hit chips the shield. Open **Skills**: each skill's MP and "weak: …"; cast one. With a Spell Blade or a Summoner,
    the line above the buttons names both halves. Use **Guard** on an ally. When **LB** appears, open it and use a Limit
    Break at 0 MP. (D206, D237)
25. **Auto and speed.** Tap **Auto**, then the speed: 1× → 2× → 4×. Expect allies to act without input and effects to
    speed up; a manual tap stops Auto. Reload between fights: expect Auto and the speed remembered. (D89)
26. **Leave and resume.** Mid-fight, open the menu → **Back to the map**, then reload. Tap **Resume the open fight**:
    expect the same round, HP and MP. Then **Give up**: expect no rewards, no clear and MP as before the fight.
27. **Result.** Win a stage. Expect **Victory!**, the rounds and "First clear!" on a first win, the Laurels chip, and
    for each Uma her EXP, her Class Rank bar and any "… reached Rank n" or "… opened" line; a Learner's Bond. Tap
    **Fight again** and win: no "First clear!", a smaller pay, and the map keeps the clear and counts the win. (D79,
    D206)
28. **Sweep.** On a cleared regular stage tap **Sweep · n → ×1**. Expect one Sweep Ticket spent, a "Swept with a ticket"
    result like a win, and MP unchanged. An elite, a boss or an uncleared stage offers no Sweep. (D79)
29. **Spring.** With some MP spent, tap the region's **Spring · MP** (or a continent's Spring). Expect the party's MP
    refilled and its recharge time; it is off during an open fight. (D72)
30. **The Rift** (a tier with five Lv 50 Umas; skip otherwise). Open its quick look and page. Open an Echo: its foes
    ("Shield n · Weak:" and the ward), a party, its guided weapons with **Use the guided weapons**, and **Fight**; win
    or give up, and expect "Back to the Rift". If a run is on, open a front's chain (the next stage ringed), its stage
    sheet and the Convergence card. Sign up twenty only for a run you mean to play. (H50, D206)
31. **Tiers.** Tap the crest: the Tier sheet shows one card per tier, a tier with no world locked with "Promote Umas
    through the Tier n Rift". With a Tier 2 world, pick it: expect the veil, Tier 2's Town Hall in dusk amber and its
    own wallet with no Uma Tickets chip; switch back. (H35, H36)
32. **Phone only — push.** In the Home Screen app open **Account → Notifications**, turn it on, allow the prompt and tap
    **Send a test**. Expect the test push. Leave a job near its end and close the app: expect "Work done" with its
    place, item and count within about five minutes of the end; tap it and expect that place on its tier, its Ready
    state and the app badge.
