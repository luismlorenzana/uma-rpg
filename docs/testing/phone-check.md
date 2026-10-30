# Current phone check

Use this script for a release, in order, on the [live game](https://uma-rpg.web.app). It tests the game as it runs today
(engine v20, save v33); the screens are in [Game sections](../game/sections.md) and the rules in the [game
manual](../game/README.md). Record the App build, device, date and any failed step when reporting a problem.

Use your existing save; do not reset it. Before you start, have: one full party of five with one healer; an Uma at Lv 10
or more; a cleared regular stage; some Laurels, Speed Tickets, Sweep Tickets and Class Marks; and, for one Uma, a made
item that raises one of her slots now and a jewel she can set (make them in steps 20–21 first if you have none). Raising
grades, setting jewels, reading Manuals, promoting and spending tickets are real progress on the save. Jobs finish while
you are away, or with Speed Tickets (step 22).

**Phone only** means an installed iPhone app or the production service is required; local auth-off previews cannot check
it. Check the other steps at 390×844, then repeat the busy screens at 375×667: the Wilds page, the Skills and Gear tabs,
the Classes and promotion sheets, a Wilds job sheet, the Learning page, the fight and the Exchange's Manual sheet. Every
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
   and a head count on each value. Search the last word of an Uma's template chip: expect every Uma of that type. Switch
   faces → cards → list, save the view, reload: expect it kept.
7. **Unlock** (Tier 1). Open a locked outfit, tap **Unlock · 1 Ticket → Unlock for 1 Ticket**. Expect one Ticket spent,
   her profile at Lv 1 as her calling's Tier 0, and the **Owned** count up by one.
8. **Profile.** Expect `Lv n`, `current/next` EXP, `Rn`, `Craft n`, and compact Party/Work facts. Tap the 44 pt template
   chip: **Her template** uses one row each for Calling, Stride and Knack, her trade, the full ★ Flourish with **On** or
   **Off**, an always-listed ★ Signature with **Worn** or **Not worn**, and separate ★ Moon I/II rows. An All-Rounder
   calling's II reads `DEF +4 · M.DEF +4`. No calling card appears. Mark her as a target and unmark her. Tap the class
   cell (Skills opens) and the Party or Working cell (its place opens). A locked profile has **Unlock · 1 Ticket** and
   no ticket-balance sentence. (D206, D229, D240, D258)
9. **Skills tab: Classes.** On a Tier 0, the class button reads "R7/10" and her trees are one node each ("Drill Strike
   · Greatsword", "R7/10") with "Promotion at R10 · 3 to go" under them; **Change** lists all ten weapons. Tap the class
   button: **Classes** shows the tree, Warrior · All-Rounder · Mage over the Tier 0 row and the Tier 1 rows. Tap a
   closed Tier 1 tile: its line and the gate ("Opens with Warrior R10 or Summoner R10"), disabled. Tap another Tier 0:
   **Start Summoner · R1**; start it, expect it On, then switch back with **Fight as …**. (D253)
10. **Promotion and a reclass.** On a Tier 0 at Rank 10 (read her share at the Exchange first, step 24, if none is),
    expect **Promote** with the green dot on the class button, the Skills tab and her roster face. Tap it: the promotion
    sheet ("Promote · Warrior R10", Suggested on one child) with "Warrior R10 → Brawler R…" and "Depths 1–2 · 6 skills ·
    +n EXP". **Promote to …**: she fights as the child at Rank 10 or more, on its first tree with its lines. Reopen
    **Classes**: her siblings read **Ready**; promote one, then **Fight as** the first again. **Class Manuals ›** opens
    the Exchange's sheet on her, and Back returns to Classes. (D253)
11. **Skills tab: trees.** On a Tier 1 class, tap each of the three tree buttons. Tap a held node: its sheet shows rank
    pips, `Rank n · next Rn` and `Depth n · Line A/B`; **Equip** it, then tap it in **Equipped** to take it off. Tap the
    B square and **Take line B**: expect the tree's letter to read B and its equipped skills to follow; take A back.
    Tap **Back to auto** if shown. Tap **Change**: the slot sheet lists the channel's weapons with their grades; pick
    another, expect the tree to change, and put it back. Below, **Class Ranks** lists the five Tier 0s (bars to Rank 10)
    and the Tier 1 classes she holds. (D201, D206, D229)
12. **Battle tab.** Expect four groups in three columns: Offense (ATK, M.ATK, Might for each weapon, Accessory, and an
    always-listed ★ Signature), Defense, Sustain (HP, MP with `+n/round`, and the full ★ Flourish with **On** or **Off**)
    and Other (`Limit start n/12`); gear's part in blue and Extra Stats' in green. (D204, D217, D258)
13. **Gear → Equip.** On a promoted Uma, tap **Standard preset**: expect **Standard preset · On** and her preset's weapons. On a
    Healer, expect two rows, **Paladin** and **Cleric**: tap one, expect it to read **· On** and Loadout to show its three
    weapons; a Warrior or a Mage shows three rows. Expect **Accessory 1**, **2** and **3**, her old slot's grade on the first.
    In a slot, tap each accessory family: one detail at a time, her ★ family first with its signature line. On an Orb, the
    kind buttons are her three weapons'; **Set** one. Set the same accessory in two slots: both stick. Check the weapon chips' colours in both themes: the
    Katana jade, the Bow rose. (D223)
14. **Gear → Upgrade.** Expect three Accessory rows, each raising on its own. Expect "Upgrade · n" to match the green marks. Tap a ready pill: the grade goes up by one, one
    made item is spent and the count drops. A blocked row says why ("Needs Lv …", "Needs 1 Arms Gem G…", "Already G10").
    On a row with several grades in stock, open it, tap **Raise to G…**, read the list and **Confirm**. Tap **Extra Stats**:
    her Observatory map opens. (D217, D223)
15. **Work and Racing tabs.** Work shows her job, if any, and `Craft n · {her trade}` with compact Craft EXP and grade
    lines. Racing shows her aptitudes, racing stats and unique skill without a duplicate template block.
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
19. **Observatory.** Pick an Uma: expect `Open n/22` and her map with "★ {her type}". Tap a closed node: its sheet uses
    compact values such as `+21 · all six`, `HP +100 · MP +20` and `DEF/M.DEF +4`, then names its jewel. Tap **Set** on a
    ready jewel: the node fills, the counts and totals go up and
    the jewel is spent. A Moon Jewel that fits several nodes asks which. (D217)
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
32. **The Rift** (a tier with five Lv 50 Umas; skip otherwise). Open its quick look and page: each front's guidance by
    family ("2 Brawler · Arms Spellblade · Arms Summoner · Paladin"). Open an Echo: its foes ("Shield n · Weak:" and the
    ward), a party, its guided weapons with **Use the guided weapons**, and under them each guided class the party
    lacks ("Needs an Arms Summoner") with the Umas who could fill it, "Ready to promote" first, then "Holds it"; a row
    opens her Skills tab. **Fight**; win or give up, and expect "Back to the Rift". If a run is on, open a front's chain
    (the next stage ringed), its stage sheet and the Convergence card. Sign up twenty only for a run you mean to play.
    (H50, D206, CV23)
33. **Tiers.** Tap the crest: the Tier sheet shows one card per tier, a tier with no world locked with "Promote Umas
    through the Tier n Rift". With a Tier 2 world, pick it: expect the veil, Tier 2's Town Hall in dusk amber and its
    own wallet with no Uma Tickets chip; its Umas' Classes sheet has no Tier 0 row. Switch back. (H35, H36)
34. **Phone only — push.** In the Home Screen app open **Account → Notifications**, turn it on, allow the prompt and tap
    **Send a test**. Expect the test push. Leave a job near its end and close the app: expect "Work done" with its
    place, item and count within about five minutes of the end; tap it and expect that place on its tier, its Ready
    state and the app badge.
