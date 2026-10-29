# Uma profile v2: the proposal

> **For the owner's review, 2026-10-28. Nothing here is built.** The rework of the Uma profile the owner asked for
> (2026-10-28): a full review of the compaction passes and ChatGPT's guideline (D229), the AI slop cleaned out of every
> profile string, one consistent structure for display, visuals and changes, and her uniqueness in one place with every
> pick. It builds on [audit.md](audit.md) (today's profile, measured) and [research.md](research.md) (seventeen games,
> platform and UX guidance). Calls are **UP1–UP33**, each with a recommendation ([§14](#14-decisions)). No open
> questions. On approval this doc **replaces [profile-ux.md](../profile-ux.md)** as the profile's contract (UP1).
>
> **What it proposes, in eight lines:**
> 1. **One profile, many doors.** No page per origin: every door opens the same profile on the tab it implies, and Back
>    returns to the door. Today every link out is one-way; all of them come back ([§6](#6-doors-and-back)).
> 2. **Four fixed tabs, each a system you change: Class · Gear · Stars · Template.** No display-only tab, no near-empty
>    tab, nothing left outside. A new system becomes a section, a sheet or a door, never a fifth tab ([§2](#2-the-information-architecture)).
> 3. **Three layers, one rule each.** The header says who she is and what she is doing; a tab draws its system; a tap
>    opens one sheet with the detail, the choices and the one action, cost and before → after shown ([§2.1](#21-three-layers)).
> 4. **Display-only facts leave the tabs.** Battle becomes a **Details** sheet, Work a cell in the header, Racing part
>    of Template. **Extra Stats come in** as the Stars tab; the Observatory becomes a door ([§3](#3-the-header-and-the-details-sheet), [§4](#4-the-tabs)).
> 5. **Her uniqueness has a home: the Template tab.** Her template, the three readings with their sources, the calling
>    and its pick, then every ★ piece as a label, a number and a state with its one action: fight as her calling, wear
>    her signature, set her moon's jewels ([§5](#5-her-uniqueness-the-template-tab)).
> 6. **A header half the height:** the tab bar moves from 284 px to 144 px on a 390×844 screen (from 532 px with an open
>    calling). Every tab fits in about 1.3 screens (Gear in one); reading everything about her goes from 9.5 screens to about 5.8 ([§10](#10-before-and-after)).
> 7. **Content rules that make slop fail the build:** a label and a number, one wording per fact (a wording list in
>    code), rules only behind (i), one state language, four type sizes, and a copy test in CI ([§7](#7-content-rules)).
> 8. **The 54 slop strings and the 3 wrong texts go first,** on today's tabs, as one small packet (H117) before the
>    rework ([§8](#8-the-cleanup-list), [§15](#15-build-plan)).
>
> **Pages** (full desktop, light and dark; every Uma, outfit and skill on them is made up):
> [**before and after**: today's six views against the four tabs, with the audit's numbers](previews/before-after.html) ·
> [**every tab** at 390×844 with its main sheet open, and every sheet](previews/tabs.html) ·
> [**the Template tab**: four Umas, the calling pick and every ★ piece](previews/template-tab.html) ·
> [**doors and Back**: the information architecture, every way in and out](previews/doors.html).

## The owner's points

| The owner's point (2026-10-28) | Answered in |
|---|---|
| "I did multiple iterations … space optimization … more information visible on each tab without too much scrolling": review what was done | [§1.1](#11-what-the-iterations-did): the passes shrank type rather than cutting repeats; [§10](#10-before-and-after): the numbers before and after |
| "I asked ChatGPT to create a guideline … I'm not sure if it did or if it was good at all" | [§1.2](#12-the-d229-guideline): it exists and its good parts stay, but it described the build more than it guided it; [§9](#9-the-contract-that-replaces-d229) replaces it |
| "Propose your own suggestion/solution" | This doc, [§0](#0-at-a-glance) |
| AI slop: "a single stat page bonus … should have the stat name and a single number"; "This is a +1 bonus to fire damage when this is equipped" | [§7](#7-content-rules) (C1: `Fire +1`), [§8](#8-the-cleanup-list) (54 strings, each with its replacement), UP25–UP27; [before and after](previews/before-after.html#slop) |
| Tabs that only display (Battle, Racing), tabs that modify trees (Skills), tabs that grant improvements (Gear), systems outside (Extra Stats) and useless tabs (Work) | [§2](#2-the-information-architecture): every tab is a system you change; [§12](#12-what-moves-where): where each of today's surfaces goes |
| "Where is information only for display, where is information complex and visual, where can I make changes" | [§2.1](#21-three-layers): display in the header and the Details sheet; visuals in the tabs; changes in the sheets |
| "The amount of information" | [§10](#10-before-and-after) and UP28: a budget per tab, checked in every packet |
| "Do we keep infinite tabs?" | **No:** four, fixed, with a growth rule (UP3, [§2.3](#23-four-tabs-fixed)) |
| "Do we split Uma Profile in different pages completely depending on where I navigate from?" | **No, one profile with many doors** (UP2, [§6.1](#61-one-profile-or-a-page-per-door)): none of the 17 surveyed games does it, and the two that split a character's systems spent years linking them back |
| "Do some research on UX patterns and how other games do this … not willy-nilly" | [research.md](research.md); [§2.5](#25-the-direction-tested) tests every call against it; each decision cites its pattern (P1–P10) |
| Uniqueness: "click on an Uma and see all of their uniqueness bonuses" | [§5](#5-her-uniqueness-the-template-tab): the Template tab, every piece with its number and state |
| "… as well as 'picking' anything that needs to be picked" | [§5.4](#54-every-pick), [§5.5](#55-what-flags-a-dot): the calling pick, her signature, her moon, her Flourish's class, each made from its own row on the tab |
| "Not sure if this was considered entirely" | [§5.1](#51-what-existed-and-the-gaps): it was half there (a read-only sheet on the chip); the seven gaps U1–U7 and how each closes |

## 0. At a glance

| | Today | Proposed |
|---|---|---|
| **Structure** | 5 tabs (Gear split in two views) over a 284 px header; Extra Stats, her work and her Halls outside | **4 tabs, fixed: Class · Gear · Stars · Template**, over a 144 px header; Extra Stats inside; work and Halls as doors with Back |
| **Kinds of tab** | Free edits, spending, display only, near-empty | **Every tab draws a system and changes it**; display-only numbers in one **Details** sheet |
| **Grammar** | Each tab its own (pills on every row, instant unequip, a card above the tabs) | **One:** first row (summary, batch action, (i)) → the system drawn → tap → one sheet → one action in its footer |
| **Header** | Back row, 112 px bust, level, chips, EXP bar and caption, calling card, a row of three | **64 px portrait, level and EXP on one line, one facts row:** Party · Work · Details |
| **Her uniqueness** | A read-only sheet on the chip, the calling card, and pieces on four tabs and a place | **The Template tab:** every piece with its number, state and action; a dot when a pick waits |
| **Doors** | Every link out one-way; three doors in return to the wrong place, three places have none; two Back controls | **Every door opens a tab and comes back;** next and previous Uma without leaving the tab |
| **Words** | 54 slop strings, 13 font sizes, green meaning 4 things | **Label and number,** a wording list in code with a CI check, 4 sizes, 6 states, green means Ready |
| **Kit** | — | **One "Both apps:" option:** a compact `ProfileFrame` header. Nothing forked |
| **Rules and save** | — | **No change** to any rule, the save or the engine. Screens and words only |

**The four tabs:**

| Tab | Draws | You change there | Free | Spends |
|---|---|---|---|---|
| **Class** | Her class and three weapons; the tree of the selected weapon; her equipped skills; her Limit Break | Class, weapon per slot, line A/B, equipped skills, Auto, the standard preset | Everything | — |
| **Gear** | Three weapons, five armor slots and the accessory, each at its grade | Grades (one, several, or every ready slot); the accessory's family and kind | Family, kind | Arms Gems, Tome Ink, Armor Fittings, Accessory Settings |
| **Stars** | Her Extra Stats map: the Planet, three moons and ★ her moon; the six totals | Nodes, one or every ready one | — | Planet and Moon Jewels |
| **Template** | Her template, its three readings and sources, the calling, every ★ piece, her aptitudes | The calling pick; and from each piece's row: her class (Flourish), her family (signature), her moon's jewels | All but the moon | Moon Jewels (the same sheet as Stars) |

## 1. The review

### 1.1 What the iterations did

From the audit ([§3.3–3.4](audit.md#33-iteration-history)): eight passes between 2026-10-10 and 2026-10-26, the last one
(#61, D229) the compaction and the guideline together.

| What #61 changed | What it left |
|---|---|
| The Target became an icon; class moved into the summary row; Battle rows became three columns; Class Ranks a grid; the tree became connected nodes with sheets; the accessory one row and one card | The Flourish sentence; Class Rank shown four times on one screen; "Fights as"; Racing's second copy of her template; the wrong "10 gathered"; the stale (i) sheets; the tab structure; Extra Stats outside |
| **Type and padding cut on every tab:** labels 11 → 9.5 px, sections p-3 → p-2 | 15 uses of text under 10 px (8 px badges); 13 font sizes from 8 to 15 px |

**Verdict:** the passes made each tab shorter by **shrinking what was there, not by removing what repeats**. Every
duplicate in the audit's [§4.2](audit.md#42-one-fact-many-wordings) survived them, and the header still takes 42% of
the first screen (78% with the calling card). The tab structure, the real cause of the scroll, was frozen by the
guideline itself ("no rule or save behavior changes"; Work and Racing "keep … data").

### 1.2 The D229 guideline

ChatGPT did write it ([profile-ux.md](../profile-ux.md), in the same PR as the compaction). Rule by rule it is
[audit §3.1](audit.md#31-rule-by-rule); in short:

| | |
|---|---|
| **Good, kept** | "A control surface, not a manual"; rules behind a deliberate tap; icons for repeated choices; one selection with one action; a real tree; 44 pt targets; a phone checklist |
| **Not followed by the build it shipped with** | One state language (green means four things; fill means three); icons choose, sheets explain (the Flourish and accessory sentences); 44 pt (three targets under it) |
| **Missing** | What belongs in the profile and what doesn't; links out and the way back; copy rules (label and number, one wording per fact); a type scale and a minimum size; uniqueness; measurable budgets; references for mobile character screens |
| **Wrong** | It froze the structure and the stale data; it exempted the busiest screen ("Upgrade may be denser"); it said "built" while failing its own checks |

**Verdict:** a decent description of the screen as it was, not a guide that would have stopped the slop or the scroll.
Its good rules move into [§9](#9-the-contract-that-replaces-d229), which adds what it lacked.

### 1.3 The slop

The owner's example ("This is a +1 bonus to fire damage when this is equipped") is the profile's pattern. Today's Orb
says **"+8 offense on one kind"** where it should say **`Fire +8`**; the Bell says **"After her Attack, one more hit of
that kind at 0.8"** where it should say **`Greatsword ×0.8`**. The audit counts **42 such strings in the profile and 12
in her sheets elsewhere**, plus **3 wrong texts** ([audit §4](audit.md#4-copy-inventory-and-the-slop-list)). Each has a
replacement in [§8](#8-the-cleanup-list), and [§7](#7-content-rules) is the set of rules that stops new ones.

## 2. The information architecture

### 2.1 Three layers

The owner's three questions ("where is information only for display, where is information complex and visual, where
can I make changes") get one answer each:

| Layer | Holds | Rule | Where |
|---|---|---|---|
| **1. Header** (always visible) | Who she is and what she is doing: portrait, name, title, rarity, level and EXP, target; her party, her work, the Details button | **Display only.** Each fact is a door at most (her party, her place) or opens Details | Above the tabs |
| **Details** (a sheet from the header) | Every number nobody changes directly: battle stats with their sources, core stats, Craft Level, unlock date | **Display only.** Read, never act | One sheet |
| **2. Tabs** (one system each) | The system drawn as itself: a tree, a gear grid, a star map, her template | **Complex and visual.** Facts sit on the drawing as labels and numbers; no sentences | Class · Gear · Stars · Template |
| **3. Sheets** (tap an element) | That element's detail, its choices and its **one action** | **Where changes happen.** Free choices apply on tap; spending and one-time choices go through the footer button, with cost and before → after | One sheet at a time |

### 2.2 The diagram

```
  DOORS IN (each opens a tab; Back returns to the door)
  Stable roster · Can upgrade filter · Party Hall · map party bar · plaza · Observatory · Halls · Wilds · link
                                         │
  ┌──────────────────────────────────────▼──────────────────────────────────────────┐
  │ PLACE HEADER (kit)   ‹ Back     Stable                       ‹  3 / 26  ›   (i) │
  │ HEADER   [64] Uma A                                                        (◎)  │
  │               Sample outfit A · ★★★                                              │
  │               Lv 40 ━━━━━━━━━━━━━━ 1,200/2,400                                   │
  │ FACTS    [ Party 1  › ]   [ Mine · 1h 20m  › ]   [ Details ]  ──────────────────┼──► Party Hall · her place
  │ TABS     [ Class ]  [ Gear • ]  [ Stars • ]  [ Template • ]        (sticky)     │    (Back returns to her)
  ├────────────────────┬──────────────────┬──────────────────┬──────────────────────┤
  │ CLASS              │ GEAR             │ STARS            │ TEMPLATE             │
  │ class + 3 weapons  │ Physical · 3 rdy │ Open 13/22 · 2   │ ★ Fleet Bruiser      │
  │ the selected tree  │ 3 weapons        │ Planet, Prowess, │ calling·stride·knack │
  │ equipped 7/7 · Auto│ 5 armor          │ Vigor, Guard,    │ the calling (pick)   │
  │ Limit line ────────┼──────────────────┼──────────────────┼──► her hall          │
  │                    │ accessory        │ ★ her moon       │ 4 ★ pieces, aptitudes│
  ├────────────────────┼──────────────────┼──────────────────┼──────────────────────┤
  │ SHEETS: class,     │ weapon, armor,   │ node, Set all    │ confirm pick,        │
  │ weapon, line, node,│ accessory,       │                  │ Flourish, racing     │
  │ Limit              │ Raise all        │                  │ skill; + Gear's and  │
  │                    │                  │                  │ Stars' own sheets    │
  └────────────────────┴──────────────────┴──────────────────┴──────────────────────┘
```

The [doors page](previews/doors.html) draws it with every door, link out and Back path.

### 2.3 Four tabs, fixed

**Why tabs and not a hub page** (research [§5.2](research.md#52-structure-options), options A and B): a hub costs one
more tap for every system and spends the first screen on navigation ([NN/g](https://www.nngroup.com/articles/mobile-navigation-patterns/)).
Most visits to an Uma are quick (check her, raise one thing, move on: [§5.1](research.md#51-what-makes-this-game-different)),
and each of the four systems fits in one screen and a third at most, so the extra room a hub page gives isn't needed. Family A (Genshin,
Star Rail, ZZZ, Wuthering Waves, Blue Archive, Azur Lane) is the closer model.

**Why four:** Apple's segmented control holds about five on an iPhone, NN/g says fewer is better, and every one of
today's systems fits one of four. Four one-word labels fit 375 px without truncating.

**Why fixed (the "infinite tabs" answer):** the tabs never change by state or by tier, and **a new system never adds a
fifth tab**. It joins the tab that holds its kind of change, as Genshin and Wuthering Waves add loadouts and planners as
buttons inside existing tabs (research [§2.4](research.md#24-what-developers-changed-later)):

| A later system | Lands in | As |
|---|---|---|
| Tier 2's ★ signature tip (UT9) | Class (the tip fork of her lead tree) and Template (a fifth ★ row) | A node and a row |
| Tier 2's class branch (CP26) | Class | A section of the Class sheet |
| Accessory slots 2 and 3 (WP18) | Gear | Two more accessory tiles |
| Weapon branches at G5 (WP6) | Gear | A choice in the weapon's sheet |
| Weapon moons (EP24) | Stars | Bodies on the map |
| Anything display-only | Details | A row |

### 2.4 One grammar

Every tab reads the same way (research [§3.7](research.md#37-consistent-controls)):

1. **First row:** the system's summary, its batch action and its (i). Class: her class and three weapons. Gear:
   "Physical · 3 ready" and **Raise all**. Stars: "Open 13/22 · 2 ready" and **Set all**. Template: her template's name.
2. **The system, drawn:** a tree, a gear grid, a star map, her template. Labels and numbers only.
3. **Tap an element → one sheet:** its detail, its choices, and **one action in the sheet's footer** (the kit's
   `BottomSheet` already has the footer).
4. **Kinds of change** (research [§3.3](research.md#33-viewing-and-changing)):
   - **free and reversible** (class, weapon, line, equip, family, kind): applies **on tap**, no button;
   - **spending** (grades, jewels): the footer button, with the cost and **before → after**;
   - **one-time** (the calling pick): the footer opens a confirm that lists what changes.
5. **After an action the sheet stays open** on the new state (so a second raise is one more tap), and closes with
   Close, Back or a tap outside. **A sheet never opens a sheet** (research [§3.4](research.md#34-sheets-and-pushed-pages)).

### 2.5 The direction tested

The main session's direction, against the audit and the research:

| # | Direction | Verdict | Evidence, and what changed |
|---|---|---|---|
| 1 | One profile, many doors; Back returns | **Kept** | P5; none of 17 games builds a page per origin; Android's back-stack rule; audit P2 (all four links out one-way; three doors in return to the wrong place or open a second page; three places have no door). Back already works through the kit's `useLeave` when a door pushes with `back: true`; the doors just don't today |
| 2 | Four fixed tabs, one grammar | **Kept, refined** | P2, P4. Refined: **weapons are chosen on Class and raised on Gear** (one home each; the green mark leaves the tree buttons, fixing audit P12); **the standard preset moves to the Class sheet** (it mostly sets weapons) |
| 2 | Gear: the Equip/Upgrade split removed | **Kept** | Games draw the line at spending, not at editing (research §3.3); Azur Lane and NIKKE spend on the slot itself. The split cost a tap and reset each session (audit §6.3). The distinction D223 wanted stays inside each sheet: a tap is free, the footer spends |
| 2 | Tab names | **Refined: "Her" → "Template"** | A tab label is a noun ([Apple](https://developer.apple.com/design/human-interface-guidelines/segmented-controls), [NN/g](https://www.nngroup.com/articles/tabs-used-right/)); "Her, tab 4 of 4" says nothing to a screen reader. "Template" is the game's own word (the chip, the Stable's filter group, the manual). "Skills" → "Class", "Extra Stats" → "Stars" (one word; its first row says "Extra Stats") |
| 3 | Stats to a details sheet from the header | **Kept, renamed "Details"** | Genshin's details overlay, ZZZ's Basic Stats button. Named **Details**, not "Stats": "Stats" beside the "Stars" tab is one letter apart |
| 3 | Work to a header line | **Kept** | P6: jobs live at the workplace. The cell links to her place; Craft Level's numbers go to Details |
| 3 | Racing into "Her" | **Kept, refined** | Aptitudes and growth go to Template **as the sources of her template**; the racing base stats go to Details as **the base of each core stat** (they feed it, `rules.ts:296`); the racing skill stays as one row |
| 3 | Bonds and Hall seats: header fact or Class line | **A Limit line on Class** | A Limit Break is a fight skill; the header holds cross-tab facts only |
| 4 | Slimmer header via a kit option; calling card leaves the header | **Kept** | Audit P3: 284 → 144 px. One opt-in kit option, racer unchanged |
| 5 | Content rules; adopt the 42 + 12 | **Kept, 9 amended** | [§8](#8-the-cleanup-list) lists the amendments (e.g. "G3 at Lv 11" for Craft Level reads as Uma Level: "G3 at Craft 11") |
| 6 | P7 next/previous | **Adopted, in the place header** | Pokémon, Persona 5; the play pattern (dozens of Umas). Arrows, not a swipe |
| 6 | P8 batch raises | **Adopted for Gear and Stars** | Genshin 4.3, Star Rail 4.4, PriConne, NIKKE. Every batch lists what it spends before it confirms. No separate roster-wide page (option C): the Stable's Can upgrade filter plus next/previous does that job |
| — | (new) | **Dots by owner** | P9, AFK Arena 1.28: a dot marks the tab that owns the action, and the Flourish being off is shown, never flagged ([§5.5](#55-what-flags-a-dot)) |

**Overturned:** only the tab name "Her". **Added:** the Details name, the preset's move, the dot rule, the copy test
(UP26) and the budgets (UP28).

## 3. The header and the Details sheet

### 3.1 The header

```
┌──────────────────────────────────────────────────┐
│ ‹      Stable                     ‹ 3 / 26 ›  ⓘ  │  place header (kit), 52 px, sticky
├──────────────────────────────────────────────────┤
│ ┌──────┐ Uma A                              (◎)  │  name 17 · target 44 pt
│ │  64  │ Sample outfit A · ★★★                   │  title 12.5
│ └──────┘ Lv 40 ━━━━━━━━━━━━━━━━━━━  1,200/2,400  │  level 14 bold · 4 px bar · caption 11
│ [ Party   Party 1 › ] [ Work  Mine · 1h 20m › ] [ Details ]  │  facts row, 44 pt cells
├──────────────────────────────────────────────────┤
│  Class │ Gear • │ Stars • │ Template •           │  tab bar (kit), sticky
└──────────────────────────────────────────────────┘
```

| Piece | Shows | Does | Changed from today |
|---|---|---|---|
| Place header | Back, "Stable", **‹ 3/26 ›**, (i) | Back returns to the door; ‹ › step through the list she came from (UP21) | "‹ All outfits", a second Back, goes |
| Portrait | 64 px bust (her icon while the bust loads) | — | 112 px |
| Name, title | Her name; her outfit title and rarity on one line | — | Rarity leaves the chips line |
| Level line | "Lv 40", a thin EXP bar, "1,200/2,400"; at max "Max · 301 EXP" | — | "Lv 50 Uma Level" and a separate bar and caption |
| Target | ◎, 44 pt | Toggle (ten at most; its error under it) | — |
| Template chip | — | — | **Moves to the Template tab** (its name heads the tab) |
| Calling card | — | — | **Moves to the Template tab** |
| Class cell | — | — | Her class heads the Class tab |

### 3.2 The facts row

Three cells, 44 pt, each a label over a value:

| Cell | Values | Tap | Back from there |
|---|---|---|---|
| **Party** | "Party 1" · "Fighting" (accent) · "No party" | Her party's editor in the Party Hall; with none, the party list | Her profile, same tab |
| **Work** | "Mine · 1h 20m" · "Mine · Done" · "Idle" | Her job's place; idle, her trade's first place | Her profile, same tab |
| **Details** | "Details" | Opens the Details sheet | — |

A working Uma also fights (D119), so Party and Work are two cells, never one.

### 3.3 The Details sheet

Today's Battle tab, Work's numbers and the racing base stats, in one read-only sheet (the kit's `BottomSheet`, which
scrolls under a fixed header). About one screen at 390×844. Every row is a label and a number; where a stat has
parts, they follow it.

| Section | Rows (Uma A, Lv 40, illustrative numbers) |
|---|---|
| **Offense** | ATK 176 (base 133 · gear 18 · Stars 25) · M.ATK 85 (base 72 · Stars 13) · Might Greatsword 45 · Axe 26 · Lance 35 · Pendant +7 · 3 kinds · ★ Signature Not worn |
| **Defense** | DEF 151 (base 100 · gear 32 · Stars 19) · M.DEF 129 · Evasion 8.4% (gear 6.0 · ★ 2.4) |
| **Sustain** | HP 1,140 · MP 120 · +10/round · ★ Flourish 4% · On |
| **Other** | Limit start 0/12 |
| **Core** | Speed 128 · Stamina 116 · Power 141 · Guts 97 · Wit 88, each with its base and growth on a second line ("98 · +20%") |
| **Work** | Craft 30 · 120/1,575 · G6 open · G7 at Craft 31 · Mine · Weapon Forge |
| **Since** | Unlocked 12 Oct 2026 |

- **Every row of `umaBattleSheet` stays, 0 included** (combat-balance §6.0); the healers' Mends row shows for a Paladin
  or a Cleric.
- **No (i) inside a sheet** (it would open a second sheet): "How stats add up" is an inline expander at the end, one
  source a line ("ATK, M.ATK ← Speed · HP ← Stamina, Power, Guts · …"), replacing today's wrong Battle (i) (F8).
- **Gone:** "Fights as Brawler · 7/7 skills · Party 1" (the Class tab and the header show all three), "10 gathered in …"
  (F3, wrong) and "Total with armor" (the same totals).

### 3.4 Locked and elsewhere

| State | Header | Facts row | Below |
|---|---|---|---|
| **Locked**, Tier 1 | Portrait dimmed with the lock; no level | **Unlock · 1 Ticket** (the kit's confirm); the ticket count stays in the top bar only | The Template tab's content, no tab bar |
| **Owned in another tier's world** | As locked | "In Tier 2" | The same |
| **Unowned, a tier above 1** | As locked | "Unlock in Tier 1" | The same |

A locked Pace or Late Uma's calling reads **"Pick on unlock · Spell Blade or Mage"** (closes U5). The tab bar is absent,
not emptied: a locked Uma has nothing to change (UP29).

## 4. The tabs

Uma A (made up) is the example throughout: a **Fleet Bruiser**, Lv 40, Brawler Class Rank 34, wearing a Pendant (not
her ★ Bell), with three raises and two jewels ready.

### 4.1 Class

**Draws:** her class and three weapons, the selected weapon's tree, her equipped skills, her Limit Break.
**Changes (all free):** class, the weapon in each slot, each tree's line, equipped skills, Auto, the standard preset.

```
[ ⚔ Brawler  R34 ━━━ ] [ Greatsword A ] [ Axe B ] (Lance B)   ⓘ     ← first row; ( ) = Selected ring
EQUIPPED 7/7                                            [ Auto ]
 ■ ■ ■ ■ ■ ■ ■            (kind marks + rank badge; tap → node sheet)
LANCE TREE                                            Change ›
            ●  d1                                 ● On (equipped)   ○ Available (held)
            ●  d2                                 · Off (other line)  ◌ Closed + "R40"
       [A]     [■B]       ← the line squares, same size as a node
        ·       ●  d3
        ·       ○  d4
        ·       ◌  d5 R40
LIMIT   Limit Break A · Learner · Bond 2/10                    ›
```

| Element | Shows | Tap |
|---|---|---|
| Class tile | Emblem, "Brawler", "R34", a thin Class Rank bar | **Class sheet** |
| Weapon tile ×3 | Weapon glyph, its line letter (A or B) | Shows that tree below (Selected ring) |
| Equipped row | One square per slot her level gives (3 → 7), kind marks and rank; empty ones dashed | **Node sheet** of that skill (Unequip) |
| Auto | "Auto" chip: On while the game picks; Available otherwise | Back to auto (one tap) |
| Tree header | "Lance tree" and **Change** | **Weapon sheet** |
| Line squares A/B | The held line On | **Line sheet** |
| Node | Kind marks and rank badge, or its gate | **Node sheet** |
| Limit line | Her Limit Break, seat and Bond, or "None" | **Limit sheet** |

**The sheets:**

| Sheet | Detail | Choices (free, on tap) | Footer action |
|---|---|---|---|
| **Class** | Six class tiles in two rows: emblem, name, "R34", bar; her hand ("Hand · Arms ×0.72 · Tome ×0.44"); "Party 1: 2 healers" in the warning colour when a switch makes one | Tap a class: she fights as it (free; each class keeps its own weapons, lines and loadout) | **Standard preset** ("Greatsword · Axe · Lance · ★ Bell"); "Standard preset · On" when it already matches |
| **Weapon** ("Slot 3 · Arms") | The channel's five weapons: "Axe · G6 · Might 26", Held, "Slot 2" (it swaps) | Tap a weapon: she holds it | — |
| **Line** ("Lance · Line B · Impale") | The line's three skills: name, "Depth 3 · R20", its skill line | — | **Take line B** (free; equipped skills follow); "Held" when it is hers |
| **Node** (the skill's name) | Five rank pips, "Rank 3 · next R36", "Depth 4 · Line B", its skill line ("one foe · 2 hits · 1.4× · 12 MP · cuts through the shield") | — | **Equip** · **Unequip** · when full, **Replace**: the seven equipped skills listed in the sheet with their names, tap one to swap · on the other line, **Take line A** · closed, "Opens · R40" (disabled) |
| **Limit** (the Limit Break's name) | "Learner · Brawler Hall · Seat 2", "Bond 2/10 · Strength 60%", "Next · 3/10"; or "Hero · Strength 100%"; or "None" | — | **Open Brawler Hall** (pushes; Back returns here); with none, her class's hall |

**Empty and edge states:** Lv 1, three slots; closed depths faded with "R10" … "R40"; a slot left empty after a weapon
swap shows dashed and Auto refills it; no Limit Break, "Limit · None".

**What changed:** the Flourish line, the second Class Rank bar, "Depths 1–5 open", the Inheritance card and the Class
Ranks grid leave the tab (the Flourish to Template, the six ranks into the Class sheet, Inheritance into the Limit line);
**an equipped skill no longer unequips on a blind tap** (it opens its sheet); "branch" becomes "line" everywhere (F11);
the tree buttons lose the green mark (raises live on Gear).

### 4.2 Gear

**Draws:** her three weapons, five armor slots and the accessory, each at its grade.
**Changes:** grades (spending); the accessory's family and kind (free).

```
Physical · 3 ready                                  [ Raise all ]  ⓘ
WEAPONS
 [ ⚔ G8 ]       [ ⚒ G6 •]       [ ⟋ G7 •]
 Might 45       Might 26        Might 35
ARMOR
 [Head G8] [Body G7] [Legs G6] [Arms G7] [Feet G5 •]
  DEF 32    HP 105    MP 18    M.DEF 28  Speed 10
ACCESSORY
 [ ◇ Pendant · G7 · +7 · 3 kinds          ★ Bell not worn ]
```

Each tile: the glyph, the grade badge, one stat under it, the green Ready dot when a raise can happen now. A G0 slot is
an empty frame with one "G0" (F15). The first row's "Physical" is her armor's half, set by her class.

**The sheets:**

| Sheet | Detail | Choices (free) | Footer action |
|---|---|---|---|
| **Weapon** ("Axe · Slot 2") | Before → after in display size: **G6 → G8**, **Might 26 → 45**; each grade's cost ("Arms Gem G7 ×1 · 2 held", "Arms Gem G8 ×1 · 2 held") | Target grade chips: G7, G8 … as far as her level allows, closed ones faded with "Lv 41"; **it starts on the highest grade the Warehouse covers** (tap G7 to raise one only) | **Raise to G8** · blocked: "Arms Gem G7 ×0" or "Lv 41" (disabled) · "G10 · Max" (no button) |
| **Armor** ("Head · Physical") | **G8 → G9**, **DEF 32 → 36 · ATK 4 → 5**, the cost | Target grade chips | **Raise to G9** |
| **Accessory** ("Accessory · G7") | The worn family's effect at this grade ("Pendant · +7 · 3 kinds"), "★ Signature · ATK/M.ATK +8 · Not worn", before → after "+7 → +9" | **Family:** four icons, ★ Bell first; tap wears it · **Kind** (Bell, Orb): her three weapons' kinds; a stale kind shows "Greatsword not held" in the warning colour | **Raise to G8** |
| **Raise all** | Every ready slot as far as items and level allow: "Axe G6 → G8 · Arms Gem G7 ×1 · G8 ×1", "Lance G7 → G8 · Arms Gem G8 ×1", "Feet G5 → G6 · Armor Fittings G6 ×1"; "Uses 4 items". Slots draw on the stock in the tab's order (weapons, armor, accessory); a slot the stock no longer covers is left out | — | **Raise 3** |

**Empty and edge states:** no item for the next grade, the button is disabled with the missing item; at G0 the
accessory reads "None · G0" and its effect "Off" until G1; at G10, "Max"; nothing ready, the first row hides Raise all
and reads "Physical".

**What changed:** Equip and Upgrade become one view (UP13). The preset moves to the Class sheet. The loadout's "Set on
Skills ›" goes (weapons are Class's). "weak ×1.3" leaves every line (F13). The pill on every row becomes a tile and a
sheet with before → after; **Raise to G6 at once is one sheet, not a list behind a second button**.

### 4.3 Stars

**Draws:** her Extra Stats map, as the Observatory draws it today (`StarMapV3`): the Planet in the middle, Prowess,
Vigor and Guard around it, five nodes each, and ★ her moon's two nodes; then the six totals.
**Changes:** nodes, by jewel (spending).

```
Extra Stats · Open 13/22 · 2 ready                     [ Set all ]  ⓘ
            ( Prowess )            ( ★ Bruiser )
                ● ● ●                  ● •
             ( Planet )
               ● ● ● ● ◌
     ( Vigor )            ( Guard )
       ● ● ●               ● ● •
HP +125   MP +25   ATK +25   M.ATK +13   DEF +19   M.DEF +19   (★ Evasion +2.4%)
```

| Sheet | Detail | Footer action |
|---|---|---|
| **Node** ("Guard III", "★ Bruiser's moon II") | What it gives, resolved for her class ("DEF/M.DEF +6"; Prowess "ATK +6" as a Brawler); before → after (**DEF 151 → 157**); its jewel "Moon Jewel III ×1 · 4 held"; its gate | **Set** · closed: "Lv 41" or "Guard II first" (disabled) · "Open" (no button) |
| **Set all** | Every jewel that fits now, one line each. A Planet Jewel can only open the Planet; a Moon Jewel goes to **her moon first** (it takes II and IV), then to the shared moon with the fewest open nodes (Prowess, Vigor, Guard on a tie) ("Moon Jewel IV → ★ moon II · DEF +8") | **Set 2** |

**The Observatory becomes a door** (UP15): its page lists her owned Umas, those with a jewel ready first, each "Open
13/22 · 2 ready". A tap opens her profile on Stars; Back returns to the list, and ‹ › step through it. The route
`/learning/observatory/:id` redirects to `/town/stable/outfit/:id/stars`. The place keeps its spot on the Learning page;
its blurb is fixed (F6).

**Empty and edge states:** under Lv 6 the moons are closed ("Lv 6"); nothing ready, the first row reads "Extra Stats ·
Open 4/22" with no button; Planet V at Lv 41.

**What changed:** the map comes into the profile; Gear's "Extra Stats" button (and its wrong route, F5) goes; the
Prowess split ("Brawler 100/0: ATK +30, M.ATK +0") becomes "Prowess · ATK +30"; Gritty's moon reads "Limit start +1"
(F12, the gauge is whole); one count format, "Open 13/22".

### 4.4 Template

The Template tab is [§5](#5-her-uniqueness-the-template-tab) in full.

## 5. Her uniqueness: the Template tab

### 5.1 What existed, and the gaps

Half of it existed: the template chip opened a read-only sheet, and the calling card sat above the tabs. The audit's
seven gaps ([§5.2](audit.md#52-click-an-uma-see-all-her-uniqueness-bonuses-pick-what-needs-picking-the-gaps)), and how
each closes:

| Gap | Today | Proposed |
|---|---|---|
| U1 No single view with every bonus as label + number + state | The sheet gives the Flourish no number, the moon one crammed line, and never says why her signature is a Bell | Four ★ rows, each **label · number · state**; the knack names the family on the Knack reading ("Fleet · Bell") |
| U2 The sheet is read-only | Each fix is 3–5 taps away on another tab or place | **Each row opens the sheet where it changes**, in place: Fight as Brawler, wear the Bell, set the jewel |
| U3 Only the calling flags itself | An unworn signature or a ready moon node shows nothing | The tab's dot: a pick waiting or her signature not worn; her moon's jewel on Stars' dot and as Ready on its row ([§5.5](#55-what-flags-a-dot)) |
| U4 The calling's alternative vanishes once confirmed | "← picked" | Both tiles stay: hers **On**, the other **Off** with what it would have been |
| U5 A locked Pace/Late Uma doesn't say she will have a pick | Racing shows the suggestion only | "Pick on unlock · Spell Blade or Mage" |
| U6 The Battle tab scatters it | Signature in Offense, Flourish in Sustain, moon in brackets | All on Template; Details keeps only their numbers in the stat they add to |
| U7 The calling card costs the first screen | 248 px above the tabs | In the tab, under the readings; the header is 144 px |

### 5.2 The tab, top to bottom

```
★ Fleet Bruiser                                                   ⓘ
[ Calling  Brawler      ] [ Stride  Middle        ] [ Knack  Fleet         ]
[ from Front A          ] [ from Medium A         ] [ from Speed +20% · Bell ]
CALLING   ⚔ Brawler · fixed                          Trade · Mine · Weapon Forge
★ Flourish     Even pace · 1%/round · max 4%                     On
★ Signature    Bell · ATK/M.ATK +8                         Not worn •  ›
★ Moon I       Evasion +2.4%                                    Open  ›
★ Moon II      DEF +8                                          Ready •  ›
RACING   Turf A · Dirt G   Sprint C · Mile B · Medium A · Long C   Front A · Pace B · Late C · End G
         Speed +20% · Power +10%                     Racing skill  ›
```

1. **Her template's name**, display size, ★ in accent. (i): the readings, the calling rule, the pick, what each ★ piece
   needs (the rules, one a line).
2. **The three readings**, three tiles: the value, then its source, in one wording ("from Front A"; a Pace pick "from
   Pace A · Power 96 > Wit 88"). The Knack tile names her signature family ("Fleet · Bell"), which closes U1's "why a
   Bell".
3. **The calling**: fixed ("Brawler · fixed"), confirmed (two tiles, hers On), or the open pick ([§5.4](#54-every-pick)).
   Her trade on the same row, since her calling sets it.
4. **The ★ pieces**, one row each: the Flourish, the signature, moon I, moon II. Tier 2's signature tip becomes a fifth
   ★ row then (reserved, not drawn in Tier 1).
5. **Racing**: her aptitudes as grade chips, with the three that set her template ringed (her best style, her stride's
   distance, her knack's growth), her growth rates, and one row for the racing skill (a sheet with its name and text,
   from the master data at runtime). Nothing else from the Racing tab is lost: the base stats are in Details.

### 5.3 Every piece: label, number, state, action

| Row | Number (Tier 1) | States | Tap → sheet | Its action |
|---|---|---|---|---|
| **Calling** | — | Fixed · Picked · open pick (Ready) · "Finish her work first" (a block, while she works) | Inline tiles; Confirm opens the confirm sheet | **Confirm** (one-time) |
| **Trade** | — | — | — (her place is the header's Work cell) | — |
| **★ Flourish** | Clean break: Barrier 4% at the start · Even pace: 1%/round · max 4% · Late reserve: 2%/round from round 3 · max 4% | **On** as her calling's class · **Off** in another ("Off · as Mage", faint) | **Flourish sheet**: shape, number, "Works as Brawler", state | **Fight as Brawler** when Off (free; the Class sheet's switch) |
| **★ Signature** | ATK/M.ATK +0.2 a level: +2 · +6 · +10 at Lv 10 · 30 · 50 (+8 at Lv 40) | **Worn** · **Not worn** (Ready dot when the slot is G1+) · "G1 first" at G0 | **The accessory sheet** (Gear's), opened on her ★ family | Tap ★ Bell to wear it (free); footer Raise as on Gear |
| **★ Moon I** | Her knack's stat: HP +20 · MP +4 · DEF/M.DEF +4 · Evasion +2.4% · Limit start +1 | **Open** · **Ready** (a Moon Jewel II and Lv 16) · **Lv 16** (Closed) | **The node sheet** (Stars') | **Set** |
| **★ Moon II** | Her calling's channel: DEF +8 or M.DEF +8 | **Open** · **Ready** · **Lv 36** | The node sheet | **Set** |
| **Racing skill** | — | — | Name and text | — |

**One component, two doors:** the signature and moon rows open the very sheets Gear and Stars use, so a change made from
Template is the same change, with the same before → after. A piece shows its number here and in Details (in the stat it
adds to); nowhere else.

### 5.4 Every pick

What "picking anything that needs to be picked" covers, and where each pick is made:

| Pick | Who has it | From the Template tab | Taps from another tab |
|---|---|---|---|
| **The calling pick** | Pace (Spell Blade or Mage) and Late (Paladin or Cleric) Umas until confirmed (176 of 270) | Tap a tile (Selected ring; free while open) → **Confirm** → the confirm sheet → **Confirm once** | 3 (the suggestion kept) or 4 |
| **Wear her signature** | Every owned Uma | Signature row → tap ★ Bell | 3 |
| **Fight as her calling** (Flourish on) | Every Uma fighting outside it | Flourish row → **Fight as Brawler** | 3 |
| **Her moon's nodes** | Lv 16 and Lv 36, with the jewel | Moon row → **Set** | 3 |
| Tier 2: her ★ tip | From Tier 2 (reserved) | Tip row → the node sheet on her lead tree | 3 |

**The calling pick, in the tab** (Uma B, made up: Pace A, Medium A, Power 96 > Wit 88, Wit growth +20%):

| | Spell Blade (Suggested) | Mage |
|---|---|---|
| Her template | ★ Clever Spellfencer | ★ Clever Spellwright |
| Trade | Forest · Armorer | Monster Den · Lapidary |
| ★ Moon II | DEF +8 | M.DEF +8 |
| Lead weapon | Katana | Fire Tome |
| ★ Flourish works as | Spell Blade | Mage |

- The tiles show **only what differs** (the audit's TC:76–77 fix): a Late pick's trade is the same either way, so its
  row doesn't show; the Flourish's shape never differs (her stride sets it), so only its class does.
- **"Suggested"** is a badge; its reason is the Calling reading's source ("from Pace A · Power 96 > Wit 88").
- **The confirm sheet** lists before → after: template name, trade, moon II, lead weapon, and at Lv 1 her class. Its
  one line of rule: **"Final · her class stays free"**. The rest ("her first win confirms it") moves to (i).
- **While she works,** the other tile is Off and the row reads "Finish her work first", the existing block (the pick
  moves her trade).
- **After it's confirmed,** both tiles stay: hers On with "Picked", the other Off (U4).

### 5.5 What flags a dot

**Rule: a green dot marks the tab that owns the action, and only something that can be done now.** Green means Ready
and nothing else (UP23).

| Tab | Dot when | Not a dot |
|---|---|---|
| Class | Never in Tier 1 (nothing to spend, nothing pending) | Equipped skills (the fill says it) |
| Gear | A slot can be raised now (its item in the Warehouse, her level allowing) | — |
| Stars | A jewel in the Warehouse opens one of her nodes now, ★ moon included | — |
| **Template** | **Her calling pick is open**, or **her signature family isn't worn** while her accessory slot is G1 or more | **The Flourish being off:** fighting as another class is a real choice (a party needs its healer); it shows "Off", never a dot. **Her moon's jewel:** Stars owns it; the row shows Ready inline |
| Stable roster | The green mark when **any** tab has a dot; the Can upgrade filter opens her on the first tab with one (Gear, Stars, Template) | NEW keeps its badge |

"No family at G1+", today a Gear reason, becomes the signature's (in Tier 1 her family always wins or ties: uma-templates
[§3.4](../tier-rework/uma-templates.md#34-the-signature-accessory-ut7-ut8)).

### 5.6 Four Umas

The [Template page](previews/template-tab.html) draws each one, live:

| Uma (made up) | Template | Calling | What the tab shows |
|---|---|---|---|
| **Uma A**, Lv 40 | ★ Fleet Bruiser | Brawler, fixed (Front A) | Signature Not worn (dot), moon II Ready, Flourish On |
| **Uma B**, Lv 12 | ★ Clever Spellfencer | **Open pick:** Spell Blade (suggested) or Mage | The pick (dot); signature Worn; moon I Closed "Lv 16" |
| **Uma C**, Lv 28 | ★ Tireless Pilgrim | Cleric, picked; fights as a Paladin | Flourish **Off · as Paladin** (no dot); the Paladin tile Off |
| **Uma D**, locked | ★ Mighty Flarecaster | "Pick on unlock · Mage or Spell Blade" | No states; Unlock · 1 Ticket |

## 6. Doors and Back

### 6.1 One profile, or a page per door?

**One profile** (UP2). The owner's question, answered from the research:

- **No precedent for a page per origin.** None of the seventeen games builds a different character page for each
  place you come from. They open the same screen on the part the door implies: FGO links party setup to the possible
  enhancement, ZZZ returns from a material's source to the upgrade, Pokémon opens one summary from the party, the boxes
  and battle (research [§3.6](research.md#36-opening-in-context)).
- **The split is what games spent years undoing.** FGO patched links back to the Servant from 2018 to 2025; FEH moved
  skills onto the profile (4.0.0) and its Enhance buttons too (10.8.0).
- **The cost of the alternative:** the same Uma would look different by route, so the player relearns her
  ([NN/g, consistency](https://www.nngroup.com/articles/consistency-and-standards/)); and every new system would need a
  page per door.
- **What a door does instead:** it picks the tab, sometimes opens the sheet, and Back returns to it. That is all the
  "depends on where I came from" the evidence supports.

### 6.2 Every door

Routes: `/town/stable/outfit/:id/:tab` (`class`, `gear`, `stars`, `template`); `outfit/:id` opens the remembered tab.
**A door that names a tab wins; otherwise the remembered tab** (per device, as today). Every door pushes with the kit's
`back: true`, so the place header's Back returns to it (`useLeave` already pops).

| Door | Opens on | Sheet | Back to | ‹ › steps through | Today's Back |
|---|---|---|---|---|---|
| **Stable roster**, a face | The remembered tab | — | The roster, same scroll and filter | The roster's sort and filter (owned) | ✓ |
| **Stable**, Can upgrade filter on | The first tab with a dot (Gear, Stars, Template) | — | The roster | The filtered roster | ✓ |
| **Party Hall**, View profile | Class | — | The party editor | The party, in slot order | ✗ roster |
| **World map party bar**, a face | Class | — | The map | The active party | ✗ (Skills alone) |
| **Plaza** (Hub), Profile | The remembered tab | — | The plaza | — | ✗ roster |
| **Observatory**, a row | Stars | — | The Observatory's list | That list (jewels ready first) | ✗ no link |
| **Hall of Heroes**, a Hero's or Learner's face | Class | — | The hall | That seat's Hero and Learners | ✗ no link |
| **Wilds place**, a working Uma's face | The remembered tab | — | The place | That place's workers | ✗ no link |
| **A shared link** | Its tab | — | The roster (replace) | The roster | — |

The `outfit/:id/skills` route (Skills alone) retires and redirects to `outfit/:id/class`.

### 6.3 Links out

Each pushes with `back: true` and remembers the tab, so Back lands on her profile where she was:

| From | To |
|---|---|
| Header › Party | Her party's editor (the list when she has none) |
| Header › Work | Her job's place, or her trade's first place |
| Class › Limit sheet | Her hall (her class's hall when she has none) |

"‹ All outfits" goes: the place header's Back does the same job (audit §1.2, 44 px back).

### 6.4 Next and previous (P7)

- **‹ 3/26 ›** in the place header's trailing slot (the kit's `PlaceHeader` takes children: no kit change). 44 pt
  arrows; the label says where she is in the list.
- **The list is the door's:** the roster's sort and filter, the party's order, the Observatory's list, the hall seat,
  the place's workers. A door passes the ids in its navigation state; a shared link uses the roster.
- **It keeps the tab** and closes any sheet. It replaces the history entry (‹ › never stack Backs), so Back still
  returns to the door.
- **Arrows, no swipe:** explicit, no conflict with the tree or the map, and one gesture to learn.
- Hidden when the list has one Uma, and on a locked profile.

## 7. Content rules

### 7.1 The rules

| # | Rule | Not this | This |
|---|---|---|---|
| **C1** | **A label and a number** (or a state word) on every surface | "This is a +1 bonus to fire damage when this is equipped" | `Fire +1` |
| **C2** | **No narration:** no "her", "this", "when", "will", "you" on a tab, a row or a chip. Sentences only in (i) and in a one-time confirm | "★ Her signature: ATK and M.ATK +10" | `★ Signature · ATK/M.ATK +10` |
| **C3** | **One wording per fact** across the game: the wording list ([§7.2](#72-the-wording-list)) is code; a new fact gets a row before it ships | 5 wordings of the Flourish | One |
| **C4** | **A fact once per screen** (the header, the tab and an open sheet are one screen) | Class Rank four times on Skills | Once, on the class tile |
| **C5** | **Never restate the drawing** | "Depths 1–5 open" beside the tree; "Hers" on every weapon | The faded depth and its gate |
| **C6** | **Rules live behind (i)**, one rule a line, never on a control | "After her Attack, one more hit of that kind at 0.8" | `Greatsword ×0.8`; the Bell's rule in (i) |
| **C7** | **States use the state words:** On, Off, Ready, Open, Worn, Held, Picked, and a gate | "Active", "Hers", "Her branch", "counts from G1" | `On`, `Held`, `Off` |
| **C8** | **Numbers:** thousands separators, ×0.8, +12%, /round, G1–G10, → for before/after | "1200", "1% of her max HP a round" | `1,200`, `1%/round` |
| **C9** | **Gates:** "Lv 21" (Uma Level), "R30" (Class Rank), "Craft 31" (Craft Level); "Opens · Lv 21" in a sheet | "needs a Planet Jewel III · opens at Lv 21" | `Planet Jewel III · Lv 21` |
| **C10** | **Only what is true now:** no constants on every row, nothing about retired systems | "weak ×1.3" on every weapon; Damage and Support slots | — |

**The word "her"** carries the game's voice (research [§4.1](research.md#41-copy-from-sentence-to-label)); it stays in
(i), in confirms and in the manual, and leaves controls, where it adds nothing.

### 7.2 The wording list

One wording per fact (C3). The packet that builds a screen reads its words from this list (as code, UP26).

| Fact | Wording | Example |
|---|---|---|
| Uma Level | `Lv {n}` | Lv 40 |
| EXP | `{exp}/{next}`; at max `Max · {banked} EXP` | 1,200/2,400 · Max · 301 EXP |
| Class Rank | `R{n}` (a11y "Class Rank {n}") | R34 |
| Craft Level | `Craft {n}` | Craft 30 |
| A gate | `Lv {n}` · `R{n}` · `Craft {n}` · a body's order `{Node} first` | Lv 41 · R40 · Guard II first |
| Grade | `G{n}`; a raise `G{a} → G{b}`; max `G10 · Max` | G6 → G7 |
| Might | `Might {n}` | Might 26 |
| Armor stat | `{STAT} {n}`; the half `Physical` / `Magical` | DEF 32 · Physical |
| Accessory effect | Pendant `+{n} · 3 kinds` · Orb `{Kind} +{n}` · Bell `{Kind} ×{x}` · Insignia `Bosses +{n}%` · G0 `Off` | Fire +8 · Greatsword ×0.7 |
| Stale kind | `{Weapon} not held` (warning colour) | Greatsword not held |
| Signature | `★ Signature · ATK/M.ATK +{n} · Worn` / `Not worn` | ★ Signature · ATK/M.ATK +8 · Not worn |
| Flourish | `★ Flourish · {shape} · {number} · On` / `Off` | ★ Flourish · Even pace · 1%/round · max 4% · On |
| Her moon | `★ Moon {I/II} · {stat} · Open` / `Ready` / `Lv {n}` | ★ Moon I · Evasion +2.4% · Open |
| Extra Stats count | `Open {n}/22` | Open 13/22 |
| Node value | Planet `+{n} · all six` · Prowess `ATK +{n}` (her class's split) · Vigor `HP +{a} · MP +{b}` · Guard `DEF/M.DEF +{n}` | ATK +6 |
| An item and its count | `{Item} ×{n} · {held} held` | Arms Gem G7 ×1 · 2 held |
| Reading | `{value} · from {source}` | Brawler · from Front A |
| Trade | `{place} · {maker}` | Mine · Weapon Forge |
| Party | `Party {n}` · `Fighting` · `No party` | Party 1 |
| Work | `{place} · {time}` · `{place} · Done` · `Idle` | Mine · 1h 20m |
| Equipped | `Equipped {n}/{slots}`; `Auto` | Equipped 7/7 · Auto |
| Line | `Line {A/B}` · `Line B · {name}`; action `Take line B` | Line B · Impale |
| Skill rank | `Rank {n} · next R{m}`; `Rank 5` | Rank 3 · next R36 |
| Depth | `Depth {n} · Line {A/B}` / `Trunk` | Depth 4 · Line B |
| Bond | `Bond {n}/10 · Strength {p}%`; a Hero `Hero · Strength 100%` | Bond 2/10 · Strength 60% |
| Limit start | `Limit start {n}/12` (whole) | Limit start 1/12 |
| MP | `MP {n} · +{r}/round` | MP 120 · +10/round |
| Hand | `Hand · Arms ×{a} · Tome ×{b}` | Hand · Arms ×0.72 · Tome ×0.44 |
| Standard preset | `Standard preset`; matched `Standard preset · On` | — |
| Unlock | `Unlock · 1 Ticket` · `In Tier {n}` · `Unlock in Tier 1` · locked pick `Pick on unlock · {A} or {B}` | — |

**Actions** (verbs, one word where possible): Raise to G7 · Raise all · Raise 3 · Set · Set all · Set 2 · Equip ·
Unequip · Replace · Take line B · Auto · Standard preset · Confirm · Confirm once · Fight as Brawler · Unlock · 1 Ticket
· Open {place}.

### 7.3 The type scale

Four sizes and one display size, nothing under 11 px (today: 13 sizes from 8 to 15 px, 15 uses under 10 px).

| Size | Weight | Used for |
|---|---|---|
| **22 px** display | 800 | One per sheet: the before → after ("G6 → G7"), a template's name |
| **17 px** | 700 | Her name; a sheet's title |
| **14 px** | 400 / 600 | Sheet rows; the header's level |
| **12.5 px** | 400 / 600 | Tab rows, values, tab labels (the kit's) |
| **11 px** | 600 / 700 | Captions, grade and rank badges, gates; **the one section label** (uppercase, +0.04 em, faint) |

Rows have one height (32 px for a fact row, 44 px for a tappable one); sections one gap (12 px).

### 7.4 The state language

Six states, one look each (the audit found fill meaning three things and green four):

| State | Means | Look | Used for |
|---|---|---|---|
| **On** | In effect now | Accent fill | Active class, held line's square, equipped skill, worn family, open node, picked calling, Auto |
| **Selected** | The one being shown or decided | 2 px accent ring | The weapon whose tree shows, the tile whose sheet is open, a pick tile not yet confirmed |
| **Available** | Can be taken now, free | Raised surface | Another class, the other line's square, a held skill not equipped, another family |
| **Closed** | A gate not met | 40% opacity and the gate badge | Depth 5 at R34, G9 at Lv 40, Planet V |
| **Ready** | A spend or a pick can happen now | 6 px green dot | Tiles, rows, tabs, roster faces |
| **Off** | Not hers or not working | Faint outline or faint text, "Off" | The other line's skills, the Flourish as another class, a G0 accessory |

**★** marks a template piece (not a state). The warning colour marks a block ("Greatsword not held", "Party 1: 2
healers"); the danger colour an error.

### 7.5 Making slop fail the build

The owner's complaint is that the slop came from AI coders. A rule in a doc didn't stop it (D95 already said "no
explainers"), so the rules become a check (UP26):

1. **`places/stable/copy.ts`**: every profile string comes from the wording list's builders (`grade(a, b)`,
   `accessoryEffect(family, grade, kind)`, …). Screens never build a string inline.
2. **A copy test** (Vitest) runs every builder over fixtures (each class, family, grade 0/1/10, locked, at max) and
   fails when a surface string has **more than six words** (names excepted), **a banned word** ("her", "this", "when",
   "will", "you", "your", "bonus", "is a"), or **a fact's wording differs from the list**. Exempt: (i) texts, one-time
   confirms, and error and empty states (a `SaveRuleError` message, "That outfit isn't in the current game data").
3. **A JSX check** in the same test scans the profile's `.tsx` files for text nodes over four words outside a
   `HelpButton`.
4. **The packet template** ([handoff README](../../handoff/README.md#how-a-packet-reads)) gets one Done-when line for
   profile work: "the copy test passes; new facts are in the wording list".

## 8. The cleanup list

Each row: the audit's reference ([§4](audit.md#4-copy-inventory-and-the-slop-list)), the string, the fix. **Adopted** as
the audit wrote it unless marked **Amended**. H117 applies all of it to today's tabs; v2's packets keep the wordings.
Where today's screen can't take v2's answer yet, the row says what H117 does ("H117:") and what v2 does.

### 8.1 In the profile (42)

| # | Where | Today | Fix |
|---|---|---|---|
| 1 | `OP:127` | "Lv 50" "Uma Level" | Lv 50 |
| 2 | `OP:183` | "Max level · 301 EXP banked" | Max · 301 EXP |
| 3 | `OP:203` | "Free" | No party |
| 4 | `OP:226` | "12 Uma Tickets left" | Drop (the top bar has it) |
| 5 | `OP:136` | "Unlocked in Tier 1" | Unlock in Tier 1 |
| 6 | `TC:68` | "Her calling · choose once" | Calling (the once-only rule in the confirm) |
| 7 | `TC:76` | "★ Even pace as a Paladin" | Drop (both tiles read the same) |
| 8 | `TC:77` | "Fields · Tome Forge · 2 Umas" | Only when the tiles differ |
| 9 | `TC:78` | "Suggested · Power 105 over Wit 88" | **Amended:** "Suggested" badge; the reason on the Calling reading ("from Late A · Power 105 > Wit 88"), not in (i) |
| 10 | `TC:84` | "Her first win confirms it." | To (i) |
| 11 | `TC:41` | "★ Even pace · as a Brawler · on" | **Amended:** ★ Flourish · Even pace · 1%/round · max 4% · On |
| 12 | `TC:42` | "Signature · Bell · +10 now · worn" / "Wear a Bell" | **Amended:** ★ Signature · ATK/M.ATK +10 · Worn / Not worn (the family is on the Knack reading) |
| 13 | `ST:131` | "★ Even pace · 1% of her max HP a round, up to 4%" | H117: the chip "★ Even pace · On" / "Off". v2: off the Class tab; Template's Flourish row |
| 14 | `ST:135` | "Brawler Rank 40" + bar | Drop; the bar goes inside the class tile |
| 15 | `ST:136` | "Depths 1–5 open" | Drop |
| 16 | `ST:78` | "All 7 skill slots are full: unequip one first" | **Amended:** H117: "Slots full · 7/7". v2: no message; the node sheet offers Replace |
| 17 | `ST:223` | The Flourish line in the Class sheet | Drop |
| 18 | `ST:347` | "Her branch" | Held |
| 19 | `WS:88–89` | "KATANA" heading over "Katana · G5 · …" | One row per weapon |
| 20 | `WS:95` | "· weak ×1.3" | Drop (F13) |
| 21 | `WS:96` | "Hers" | Drop |
| 22 | `OP:251–254` | "Fights as Brawler · 7/7 skills · Party 1" | Drop |
| 23 | `OP:266–271` | Battle (i): Damage and Support slots (wrong, F8) | One source a line: "ATK, M.ATK ← Speed · HP ← Stamina, Power, Guts · MP ← Wit · DEF ← Power · M.DEF ← Power, Wit · + gear, + Extra Stats, ★ her moon". H117: in the Battle (i). v2: Details' "How stats add up" |
| 24 | `SH:48–55` | "Pendant: +2 on her three kinds" · "Orb: Fire +8" · "Bell: Greatsword 0.8 after her Attack" · "Insignia: +6% on sub-bosses and bosses" | **Amended:** Pendant · +2 · 3 kinds · Orb · Fire +8 · Bell · Greatsword ×0.8 · Insignia · Bosses +6% |
| 25 | `OP:306` | "Unlocked 10/28/2026." | "Unlocked 28 Oct 2026" (H117: on Battle; v2: Details › Since) |
| 26 | `PB:42–47` | "Standard preset" · "Binds to her for good" · "Use the standard preset" (v1) | Delete with the v1 branch (F38) |
| 27 | `G3:37`, `:190` | "G0" twice on an empty armor slot | Badge only (F15) |
| 28 | `G3:180` | Loadout (i) repeating the headers | Drop |
| 29 | `GE:37–42` | "After her Attack, one more hit of that kind at 0.8" · "+2 on her three kinds" · "+8 offense on one kind" · "+12% on sub-bosses and bosses" | **Amended:** with a kind, `Greatsword ×0.8` · `Fire +8`; before one is set, `Extra hit ×0.8` · `+8 · 1 kind`; `+2 · 3 kinds`; `Bosses +12%` |
| 30 | `GE:56` | "From G1: …" | **Amended:** H117: "G1: …". v2: the sheet's before → after "Off → +1 · 3 kinds" |
| 31 | `GE:55` | "★ Her signature: ATK and M.ATK +10" | ★ Signature · ATK/M.ATK +10 |
| 32 | `G3:238` | Grades (i) naming gone places (wrong, F9) | G1–G10 · G*g* opens at Lv 5*g* − 4 · Arms Gem: Weapon Forge · Tome Ink: Tome Forge · Armor Fittings: Armorer · Accessory Setting: Charm Forge |
| 33 | `GV:30` | "Greatsword · G9 · Might 57 · weak ×1.3" | Drop "· weak ×1.3" |
| 34 | `GV:53–57` | "Bell · Greatsword · G8 · after her Attack, her Greatsword at 0.8 · ★ +10" | Bell · Greatsword ×0.8 · ★ +10 |
| 35 | `GV:47` | "Bell · Katana · G0 · counts from G1" | Bell · G0 · Off |
| 36 | `GV:44` | "Accessory · G0 · Pick a form" | **Amended:** None · G0 |
| 37 | `G3:62–63` | "Now · G9 · Might 57 · weak ×1.3" · "Next · …" | G9 → G10 · Might 57 → 68 |
| 38 | `G3:64` | "Her class's half · Helm" | Head · Physical |
| 39 | `G3:263` | "Total with armor: HP +375 · …" | Drop (Details has the totals) |
| 40 | `OP:451` | "10 gathered in 8h 26m" (wrong, F3) | Drop |
| 41 | `OP:455–456` | "· grade 2 open · grade 3 at Craft Lv 11" | **Amended:** G2 open · G3 at Craft 11 ("Lv 11" would read as Uma Level) |
| 42 | `OP:498–501` | Racing's "HER TEMPLATE" copy | Drop |

### 8.2 Her sheets elsewhere (12)

| # | Where | Today | Fix |
|---|---|---|---|
| 43 | `OB:153` | "Prowess · Brawler 100/0: ATK +30, M.ATK +0" | Prowess · ATK +30 |
| 44 | `OB:193` | "as Brawler ATK +6, M.ATK +0" | ATK +6 |
| 45 | `OB:206` | "needs a Planet Jewel III · opens at Lv 21" | Planet Jewel III · Lv 21 |
| 46 | `hub/places.ts:178` | "a Sun, eight planets and their moons" (wrong, F6) | (i) blurb: "Each Uma's Extra Stats: a Planet, three moons and her own moon." |
| 47 | `HP:64` | "Four Heroes, each with her own Limit Break, and their Learners." | Drop |
| 48 | `HP:144` | "{name} uses {Limit Break} as her only Limit Break, at full strength." | Hero · Strength 100% |
| 49 | `HP:149` | "Her own Bond with this seat: 3/10, kept if she becomes its Learner" | Bond 3/10 |
| 50 | `HP:157` | "Empty this seat (its 3 Learners leave; their Bonds stay)" | Empty seat, then a confirm that names the Learners |
| 51 | `HP:178` | "Inherits X, and Y from her other Hero." | Limit Breaks · X · Y |
| 52 | `HP:180` | "Leave this Hero (her Bond stays)" | Leave |
| 53 | `PH:151` | "Slot 3 · add an Uma" | Empty |
| 54 | `PH:198` | "Recall from Mine · what's made is kept" | Recall from Mine |

### 8.3 Wrong texts and the intake findings

| Finding | Fix | In |
|---|---|---|
| F3 "10 gathered" uses the old gather time | Dropped (#40) | H117 |
| F5 Gear's Extra Stats link goes to `/town/observatory/:id` | Goes with the button; the Observatory route redirects to Stars | H117 (point it at `/learning/…`), H122 (removed) |
| F8 Battle (i): Damage and Support slots | Rewritten (#23) | H117 |
| F9 Grades (i): gone places | Rewritten (#32) | H117 |
| F11 "branch" on the Skills tab | "line" everywhere: Line A/B, Take line B, Held | H117 |
| F12 Gritty's moon "Limit +1.6" | Limit start +1 | H117 |
| F13 "weak ×1.3" on every weapon | Dropped (#20, #33) | H117 |
| F14 Accessory (i): "a Pendant adds all three kinds" | One family a line: "Pendant · +n on each of her three kinds" … | H117 |
| F15 G0 twice | Badge only (#27) | H117 |

### 8.4 Touch targets

The template chip (32 pt), Back to auto (36 pt) and the Bond rows (19 pt) go to 44 pt in H117; in v2 the chip is gone
and Auto and the Limit line are 44 pt by design.

## 9. The contract that replaces D229

On approval this section is the profile's contract; [profile-ux.md](../profile-ux.md) gets a banner pointing here
(UP1). D229's rules, kept or replaced:

| D229 rule | Now |
|---|---|
| 1 Overview first | **Replaced by S1–S3** (the header holds only who she is and what she is doing; 144 px budget) |
| 2 Actions 44 pt; facts aren't cards | **Kept** (and checked: H117 fixes the three misses) |
| 3 Icons choose; sheets explain | **Kept, sharpened by C1–C6** (icons for repeated choices; one-off states get a word: research [§3.5](research.md#35-density-and-glanceability)) |
| 4 One selection, one action | **Kept as G3**, with no exemption for spending |
| 5 One state language | **Replaced by [§7.4](#74-the-state-language)** (six states, green = Ready) |
| 6 Structure visible | **Kept** (the tree as connected nodes; the map; the gear grid) |
| 7 Density consistent | **Replaced by [§7.3](#73-the-type-scale) and the budgets** |

**The contract, in full:**

| # | Rule |
|---|---|
| **S1** | One profile per Uma; every door opens it on a tab; Back returns to the door ([§6](#6-doors-and-back)) |
| **S2** | Four tabs, fixed: Class · Gear · Stars · Template. A new system joins one (as a section, a sheet, a tile or a row) or becomes a door; never a fifth tab |
| **S3** | The header shows only who she is and what she is doing; display-only numbers live in Details |
| **G1** | A tab's first row: summary, batch action, (i) |
| **G2** | The system is drawn; facts are labels and numbers on the drawing |
| **G3** | Tap an element → one sheet: detail, choices, one footer action. Free choices apply on tap; spending shows cost and before → after; one-time choices confirm with what changes |
| **G4** | A sheet never opens a sheet; (i) only on a tab's first row |
| **G5** | A sheet stays open after its action, on the new state |
| **C1–C10** | [§7.1](#71-the-rules); the wording list [§7.2](#72-the-wording-list); the copy test [§7.5](#75-making-slop-fail-the-build) |
| **V1** | The type scale ([§7.3](#73-the-type-scale)): 22 · 17 · 14 · 12.5 · 11, nothing smaller |
| **V2** | The state language ([§7.4](#74-the-state-language)): On, Selected, Available, Closed, Ready, Off; ★ for template pieces |
| **V3** | 44 pt for anything tappable; 32 px fact rows; 12 px section gaps |
| **B1** | The tab bar starts at ≤ 150 px (390×844) |
| **B2** | Each tab ≤ 1.4 screens at 390×844 (Template with an open pick ≤ 1.6); Gear ≤ 1.0. As drawn: 1.35 · 0.97 · 1.16 · 1.31 (1.57 open pick) |
| **B3** | A sheet ≤ one screen before it scrolls |
| **B4** | The common tasks within [§10.3](#103-taps)'s counts |

**Phone checks** (D229's list, kept, plus four): at 390×844 and 375×667, light and dark: target marks readable on every
portrait; 44 pt and an accessible name on every icon; nothing clipped on long names; the four tabs, the class row and
the five armor tiles fit without horizontal scroll; sheets fit above the bar and leave the selection as it was; **the
budgets B1–B3 measured; the copy test passes; no text under 11 px; green only for Ready.**

## 10. Before and after

Today's numbers are the audit's, measured on a scratch save ([§6](audit.md#6-measured-scroll-and-taps)). The proposed
ones are **measured on the preview mocks** ([tabs page](previews/tabs.html)), which draw each tab at 390×844 with the
kit's real sizes (the tab bar is 64 px with its padding); H125 measures the built screens the same way.

### 10.1 Header

| | Today | Proposed |
|---|---|---|
| Tab bar starts, 390×844 | 284 px, **42%** of the first screen | **144 px, 21%** |
| … with an open calling | 532 px, **78%** | **144 px, 21%** (the card is in Template) |
| Tab bar starts, 375×667 | 284 px, 56% | 144 px, 28% |
| … with an open calling | 546 px, **108%** (below the fold) | 144 px, 28% |
| Portrait | 112 px | 64 px |
| Rows above the tabs | Back row, bust block, EXP bar, caption, [card], summary row | Header block, facts row |

### 10.2 Scroll

Screens = (header + tab bar + content + the frame's 96 px) ÷ 683 (506 at 375×667), the audit's formula. The proposed
header and tab bar together are 208 px (144 + 64).

| Tab | Today, 390×844 | Proposed | Today, 375×667 | Proposed | Content under the tab bar (proposed, as drawn) |
|---|---|---|---|---|---|
| Skills → **Class** | 2.04–2.08 | **1.35** | 2.80 | 1.82 | Class row 64 · equipped 76 · tree 372 · Limit 48 · gaps 56 = 616 px |
| Equip + Upgrade → **Gear** | 1.50–1.57 + 1.73–1.77 | **0.97** | 2.12 + 2.39 | 1.31 | First row 44 · weapons 88 · armor 88 · accessory 72 · gaps 66 = 358 px |
| Observatory (outside) → **Stars** | 1.16 | **1.16** | — | 1.56 | First row 44 · map 300 · totals 93 · ★ line 15 · gaps 34 = 486 px |
| Racing → **Template** | 1.45–1.49 | **1.31** (1.57 with an open pick) | 2.05 | 1.77 | Name 44 · readings 59 · calling 52 (228 with an open pick) · four ★ rows 192 · racing 99 · racing skill 48 · gaps 96 = 590 px |
| Battle → **Details** sheet | 1.58–1.65 | **0.97** (a 660 px sheet, no scroll) | 2.21 | ≈1.3 | Six sections in two columns |
| Work → header cell | 1.00 | 0 | 1.08 | 0 | — |
| **Everything about her** | **9.5** (11.4 open calling) | **≈ 5.8** (6.0) | 12.7 (15.7) | ≈ 7.8 | — |

Gear and the Details sheet fit on one screen; every other tab is one screen and a third. The Observatory's map costs
the same as it did, but no longer costs a round trip (+4 taps back to her).

### 10.3 Taps

From her profile, on another tab than the one needed (the audit's method):

| Task | Today | Proposed | Path |
|---|---|---|---|
| See every uniqueness bonus with its number | 1 (no numbers, read-only) | **1** | Template |
| Make her calling pick | 1–2 (card above the tabs) | 3–4 | Template → (tile) → Confirm → Confirm once. **Two more taps, once per Uma:** the confirm shows what the choice changes before it is final, and the header stops paying 248 px for it on every visit |
| Wear her signature family | 3–5 | **3** | Template → Signature → ★ Bell |
| Set her moon's jewel | 4–5, and **+4 to come back** | **3** | Stars → ★ node → Set (or from Template) |
| Raise a weapon as far as the Warehouse allows | 3 (one grade), 5 (several) | **3** | Gear → tile → Raise to G8 (with before → after); one grade only when more are covered: 4 (tap G7 first) |
| Raise every ready slot (N slots) | 2 + N | **3** | Gear → Raise all → Raise N |
| Change her class | 3 | 3 | Class → class tile → class |
| Change a tree's line | 3–4 | 3–4 | Class → (tree) → square → Take line B |
| Equip a skill at 7/7 | 4–5, one blind unequip | **4** | Class → node → Replace → slot |
| See her stats | 1 | 1 | Details |
| The next Uma, same tab | 3 (Back → face) | **1** | › |
| Five Umas' ready raises, from the Stable | ≈ 34 | **≈ 15** | Can upgrade on → face (opens Gear) → Raise all → Raise → › … |
| Back to her after her party or place | 4 (Town → Stable → Enter → face) | **1** | Back |
| Seat her as a Learner | 5+ (no link) | 5 | Class → Limit → her hall → + → her |

## 11. Kit changes

**One "Both apps:" request** (the [change protocol](../../change-protocol.md)), for the uma-platform session:

> **Both apps: an opt-in compact header for `ProfileFrame`.** Add `size?: 'regular' | 'compact'` (default
> `'regular'`: uma-racer and today's uma-rpg unchanged) and `progress?: { value: number; max: number; label: string }`.
> **Compact:** a 64 px portrait (the lock badge scaled); the name at 17 px; the title at 12.5 px with `chips` after it on
> the same line (the title truncates first); the level at 14 px bold, with `progress` drawn on its line as a 4 px bar
> and its label at 11 px; the header block 64 px tall; `corner`, `summary`, the tab bar and its dots as today. Tests: the
> frame renders both sizes; compact at 375 px clips nothing with a 24-character name. A minor release (visible).

**Not kit changes** (each uses a slot the kit already has):

| Need | Uses |
|---|---|
| ‹ 3/26 › | `PlaceHeader`'s trailing children |
| The facts row | `ProfileFrame`'s `summary` |
| Four tabs with dots | `ProfileFrame`'s `tabs` (`dot`, `dotLabel`) |
| One footer action per sheet | `BottomSheet`'s `footer` |
| Back to the door | `useLeave` with `back: true` |

## 12. What moves where

Every surface in the audit's [§1.1](audit.md#11-every-surface-that-shows-one-uma) and every datum in its
[§7.2](audit.md#72-data-shown-today-the-redesign-can-move-it-not-lose-it). Nothing is dropped silently: the "Dropped"
rows are the slop list's.

| Today | Goes to |
|---|---|
| **Header:** "‹ All outfits" | Dropped (the place header's Back) |
| Bust, name, title, rarity | Header (64 px; rarity on the title line) |
| "Lv 50 Uma Level", EXP bar and caption | Header level line |
| Template chip and its sheet | **Template tab** |
| Target | Header (unchanged) |
| **Summary:** calling card | **Template tab**, the calling section |
| Class · Rank cell | Class tab, the class tile |
| Craft · Lv cell | Header Work cell (the place); Details › Work (the numbers) |
| Party / Working / Fighting cell | Header Party and Work cells |
| **Skills tab** | **Class tab** |
| Class and tree buttons | Class row (the green mark moves to Gear's tiles) |
| Flourish line | Template ★ Flourish; Details › Sustain |
| Class Rank bar, "Depths open" | Inside the class tile; dropped (the tree shows it) |
| Equipped row, Auto, Back to auto | Equipped row (a tap opens the sheet), Auto toggle |
| Class sheet (root, hand, six classes) | Class sheet, + the six Class Ranks, + Standard preset; its Flourish line dropped |
| Node, branch and weapon sheets | Node sheet (+ Replace, + Take line), line sheet, weapon sheet |
| Inheritance card | **Limit line** and Limit sheet |
| Class Ranks grid | Class sheet |
| **Battle tab** (all rows, core stats, unlock date) | **Details** sheet |
| "Fights as" row | Dropped |
| **Gear › Equip:** preset | **Class sheet** footer |
| Loadout icons | Gear tiles |
| Accessory family and kind | Accessory sheet (Gear; also from Template's signature row) |
| **Gear › Upgrade:** grade rows and pills | Gear tiles and their sheets; Raise all |
| Grade sheet, "Up to G6" | Weapon and armor sheets (target grade chips) |
| Extra Stats button and total | **Stars tab**; the total dropped (Details) |
| **Work tab:** job | Header Work cell |
| Craft Lv, trade, Craft EXP, grade gates | Details › Work; trade also on Template |
| "10 gathered" | Dropped (wrong) |
| **Racing tab:** aptitudes | Template › Racing (sources ringed) |
| Racing base stats and growth | Details › Core (base and growth under each core stat); growth also on Template |
| Racing unique skill | Template › Racing skill row |
| "Her template" copy | Dropped |
| **Locked profile:** Unlock, tickets | Facts row Unlock; the ticket line dropped (top bar) |
| **Skills alone** (`outfit/:id/skills`) | Redirect to the Class tab |
| **Observatory** (map, totals, Set) | **Stars tab**; the place becomes a door (a list) |
| Halls, Party Hall, Wilds, Exchange's Class Manual, Rift guided weapons, fight result | Stay where they are; their profile links become doors with Back; their slop cleaned (§8.2) |
| Tab memory `rpg.profile.tab.v2` | `rpg.profile.tab.v3`: skills, battle and work → class; gear → gear; racing → template |
| Can upgrade (roster mark and filter) | Any tab's dot; the filter opens the first tab with one |

## 13. Save, engine, bundle, manual

- **Save and engine: no change.** No rule moves; every action is one the save already has (`chooseCalling`,
  `confirmCallingPick`, `setAccessoryForm`, the grade raises, `setMapJewel`, class, weapon, line and equip). "Raise all"
  and "Set all" call the same actions in a loop inside one save write. The only stored change is the device's tab key.
- **Bundle:** the profile stays a lazy chunk; the Stars map moves into it from the Observatory's chunk. Main JS doesn't
  grow (223.46 of 230 KB, F36).
- **Manual:** each packet rewrites its part of [sections § Stable](../../game/sections.md#stable) and
  [§ Observatory](../../game/sections.md#observatory); [classes](../../game/classes.md) names the tabs ("set on her
  profile's Class tab"); H125 checks the whole.
- **Decisions:** one D-row on approval (fetch `main` for its number); each packet logs its own.

## 14. Decisions

| Call | Recommendation | Alternatives, briefly | Why |
|---|---|---|---|
| **UP1** This doc | **The profile's contract:** it replaces profile-ux.md (D229), bannered on approval; §9 is the rule list packets check against | Revise profile-ux.md in place | The old guideline froze the structure it should have fixed; one doc decides the structure, the words and the budgets |
| **UP2** One profile, many doors | **One profile; each door opens a tab and Back returns to it.** No page per origin | A page per origin (the owner's question); a reduced read-only view from fights (Pokémon's battle summary) | None of 17 games splits by origin; FGO and FEH spent years linking split systems back; one Uma looks the same from every door (P1, P5) |
| **UP3** Four tabs, fixed | **Four tabs that never change by state or tier;** a new system joins a tab or becomes a door | A hub page per system (option B: a tap more for each); more tabs (option D: the owner's "infinite tabs") | About five segments fit a phone; most visits are quick; games add features as buttons inside tabs (P4) |
| **UP4** Tab names | **Class · Gear · Stars · Template** | Skills; Extra Stats; Her, Traits, About, Unique | One-word nouns; the game's own words (Template on the chip and filters); Class names the root of what the tab holds; Stars fits 375 px and its first row says "Extra Stats" |
| **UP5** Three layers | **Header = display; tabs = the systems drawn; sheets = changes** | Display and changes mixed per tab (today) | Answers the owner's "where is display / visual / changes" with one rule each |
| **UP6** One grammar | **First row → system drawn → one sheet → one footer action;** free choices on tap; spending with cost and before → after; one-time with a confirm; the sheet stays open; never a sheet on a sheet | A global edit mode; a confirm on every change | Games draw the line at spending (research §3.3); no surveyed screen uses an edit mode; one shape everywhere (P2, P3) |
| **UP7** The header | **64 px portrait, level and EXP on one line, one facts row;** the template chip and calling card leave it; 284 → 144 px | Keep the 112 px bust; keep the card above the tabs | Audit P3: 42–108% of the first screen; the card belongs with her template |
| **UP8** Facts row | **Party · Work · Details**, 44 pt; Party and Work are doors with Back | Class and Craft cells (today); a single status cell | A working Uma fights too; class heads the Class tab; Work's numbers go to Details |
| **UP9** Details | **One read-only sheet:** Battle's rows with their parts, the core stats with their racing base and growth, Craft Level, unlock date; "How stats add up" as an inline expander | A Stats tab (today's Battle); a pushed page; stats on Gear | Genshin's overlay, ZZZ's button; display-only facts out of the tabs; named so it can't be misread beside "Stars" |
| **UP10** Class tab | **Class tile + three weapon tiles, the selected tree, the equipped row, the Limit line;** the Class sheet holds the six Class Ranks and the standard preset | Keep Inheritance and the Class Ranks grid on the tab; the preset on Gear | Each fact once; the preset sets weapons above all; the tab fits 1.35 screens |
| **UP11** Equipped skills | **A tap opens the skill's sheet** (Unequip there); a full loadout offers **Replace** inside the node sheet; **Auto** is a 44 pt toggle | Today's instant unequip on a mark-only slot | Audit §6.3: the tap that unequips blind; names belong in the sheet (Arknights' overflow lesson) |
| **UP12** Bonds and Hall seats | **A Limit line on Class** with a sheet and a door to her hall | A header fact; Template | A Limit Break is a fight skill; the header holds cross-tab facts |
| **UP13** Gear | **One view: weapons, armor and the accessory as tiles at their grades;** the Equip/Upgrade split goes; weapons are chosen on Class and raised on Gear | Keep the split (D223); weapons chosen and raised on Class | Spending sits with its slot (P3); the split cost a tap and reset each session; one home per action |
| **UP14** Raising | **Each slot's sheet: before → after in display size, target grade chips starting on the highest the Warehouse covers, one Raise button;** the sheet stays open | Today's pill per row; a confirm per grade | Genshin 4.3 put before/after on the screen; "Up to G6" was 5 taps |
| **UP15** Stars | **Extra Stats come in as a tab; the Observatory becomes a door** (its page a list of Umas, jewels ready first); the old route redirects | Extra Stats as a section of Gear; keep the Observatory as the home | One system, one home (P1); the round trip cost +4 taps; a section of Gear would push Gear to 1.6 screens |
| **UP16** Template | **Her uniqueness on one tab:** name; the three readings with sources; the calling and trade; every ★ piece as label · number · state, opening the sheet where it changes; her aptitudes and growth as sources; the racing skill | Keep the chip's sheet and add actions; a fifth "Racing" tab | The owner's ask; closes U1–U7; the same sheets as Gear and Stars, so one change has one behaviour |
| **UP17** The calling pick | **In Template:** tiles showing only what differs, "Suggested" with its reason on the Calling reading, Confirm → a confirm sheet with before → after; after it, both tiles stay (hers On, the other Off) | Keep the card above the tabs; no confirm sheet | Two more taps, once per Uma, against 248 px of header on every visit until then and a final choice made without seeing what it moves; U4 and U7 close |
| **UP18** Dots | **A dot marks the tab that owns the action, for something doable now:** Gear raises, Stars jewels, Template the open pick or the signature not worn at G1+; the Flourish off is shown, never flagged; the roster's mark is any tab's dot | Dots for everything uniqueness touches; no Template dot | AFK Arena 1.28 (fewer badges); a Mage-by-choice must not nag forever; in Tier 1 her family always wins, so not wearing it is a real miss (P9) |
| **UP19** Racing | **Aptitudes and growth on Template as her template's sources; racing base stats in Details under the core stats they feed; the racing skill as a row** | Drop the racing data; keep a Racing tab | Every number gets the job it does here; nothing is lost |
| **UP20** Doors | **The table in §6.2;** a door naming a tab wins, else the remembered tab; every door and link out pushes with `back: true`; "All outfits" and the Skills-alone route go | Fix Back per page as bugs come | Audit P2: every link out one-way, three doors back to the wrong place; Android's back stack rule; the kit already pops |
| **UP21** Next and previous | **‹ n/N › in the place header,** over the list the door passed; keeps the tab; replaces the history entry; no swipe | A swipe; arrows in the profile header; none | Pokémon, Persona 5; the play pattern (dozens of Umas); no kit change |
| **UP22** Batch | **Raise all (Gear) and Set all (Stars),** each listing every change before one confirm; Set all's rule: a Moon Jewel goes to her moon first, then the emptiest shared moon (Prowess, Vigor, Guard on ties); Planet Jewels can only open the Planet. **No roster-wide ready page:** the Can upgrade filter plus ‹ › | One grade each; a separate "ready" page (option C) | Genshin 4.3, Star Rail 4.4, PriConne, NIKKE; five Umas' raises ≈ 34 → 15 taps; the filter and the stepper reuse what exists |
| **UP23** State language | **Six states, one look each:** On (fill), Selected (ring), Available (raised), Closed (faded + gate), Ready (green dot), Off (faint); ★ marks template pieces | Keep D229's list | Today fill means three things and green four (audit §3.1) |
| **UP24** Type | **22 · 17 · 14 · 12.5 · 11 px, nothing smaller;** one section label | Keep compact 8–9.5 px badges | Octopath's demo: legibility first; 13 sizes today |
| **UP25** Content rules | **C1–C10** (§7.1): label and number; no narration on controls; one wording per fact; a fact once per screen; never restate the drawing; rules in (i); state words; number formats; gate formats; only what is true now | Style advice in the doc only (D95's "no explainers") | NN/g: concise + scannable + objective text scores 124% higher; Star Rail 2.5 made short text the default |
| **UP26** The wording list as code | **`copy.ts` builders and a copy test** (word count, banned words, list match, JSX text nodes); the packet template's Done when names it | Review by eye | D95 said it and the slop came anyway; a failing test stops an AI coder where a guideline didn't |
| **UP27** The cleanup | **The audit's 54 strings, 45 as written and 9 amended (§8), the three wrong texts and F11–F15, applied first on today's tabs (H117)** | Wait for v2 | The owner's most visible complaint; string-level, no conflict with v2 (it keeps the wordings) |
| **UP28** Budgets | **B1–B4:** header ≤ 150 px; tabs ≤ 1.4 screens (Template open pick ≤ 1.6, Gear ≤ 1.0); a sheet ≤ one screen; the tap counts of §10.3; measured in each packet | No numbers (D229) | "Compact" with no budget became smaller type; a number can be checked |
| **UP29** Locked and elsewhere | **Header, Unlock (or "In Tier 2", "Unlock in Tier 1") and the Template content, no tab bar;** a locked Pace or Late Uma reads "Pick on unlock · A or B" | Four tabs with three empty | A locked Uma has nothing to change; closes U5 |
| **UP30** Class Manuals | **Stay at the Exchange** (its picker and bars); no Class Marks spend in the profile | A Manual button in the Class sheet | Class Marks are a world bank spent rarely; the Class sheet keeps one footer action (the preset) |
| **UP31** Help | **One (i) per tab, on its first row; none inside a sheet;** Details' formula is an inline expander; every (i) one rule a line, the wrong ones rewritten | (i) where each rule applies | The kit's (i) opens a sheet, so (i) in a sheet stacks two |
| **UP32** Kit | **One "Both apps:" option (`ProfileFrame` compact + `progress`)**; everything else in existing slots; no fork | Fork the header; ask for a new profile component | The change protocol; racer stays untouched |
| **UP33** Build order | **H117 (cleanup) and H118 (kit) first, in parallel; H119 the frame; H120–H122 and H124 in parallel; H123 Template last of the tabs; H125 measures** | One big packet | Each step ships on its own; the cleanup lands this week |

## 15. Build plan

Packet ids from **H117**, decisions from the next free D number (fetch `main`). ChatGPT can take UI packets; the kit
request runs in the uma-platform session. Every packet: the manual's part in step, the copy test green, its budget
measured at 390×844 and 375×667, light and dark.

| Id | Packet | Scope | Who | Size | Needs | Ships |
|---|---|---|---|---|---|---|
| **H117** | **Profile copy cleanup** | The 54 strings of §8 on today's screens (profile, Observatory, Halls, Party Hall); the three wrong texts; F5 (point at `/learning/…`), F11–F15; the three 44 pt targets; `copy.ts` with the wording list's builders and the copy test (§7.5); the v1 preset sheet deleted | ChatGPT | S–M | — | **First**, on today's tabs |
| **H118** | **Both apps: compact `ProfileFrame`** | §11's request: `size`, `progress`, tests; a kit minor; uma-rpg pins it (no visible change until H119 uses it) | Claude, uma-platform session | S | — | Beside H117 |
| **H119** | **The new frame** | Four tabs (Class = today's Skills body, Gear = today's two views stacked, Stars = the Observatory map, Template = the template sheet's content) as a skeleton; the compact header and the facts row; the Details sheet (Battle's rows, Work's numbers, racing base stats); Battle, Work and Racing tabs retire; routes `outfit/:id/:tab`, the tab key v3; locked and elsewhere; "All outfits" goes | Claude | M | H117, H118 | After both |
| **H120** | **Class tab** | §4.1: class tile and Class sheet (six ranks, standard preset), weapon tiles, line wording, equipped row with sheets, Replace, Auto toggle, the Limit line and sheet | ChatGPT | M | H119 | Beside H121, H122, H124 |
| **H121** | **Gear tab** | §4.2: nine tiles, weapon, armor and accessory sheets with before → after and target chips, Raise all; the Ready dots on tiles; the roster mark's reasons | ChatGPT | M | H119 | Beside H120 |
| **H122** | **Stars tab and the Observatory door** | §4.3: the map in the tab, the node sheet with Set and before → after, the totals, Set all; the Observatory page as a list; the route redirect; the place's blurb | ChatGPT | M | H119 | Beside H120 |
| **H123** | **Template tab** | §5: readings with sources, the calling and its pick and confirm sheet, the ★ rows opening H121's accessory sheet and H122's node sheet, the Flourish sheet, aptitudes and growth, the racing skill, the dot rule (§5.5) | Claude | M | H120–H122 | After the three |
| **H124** | **Doors, Back, next and previous** | §6: every door with `back: true` and its tab, links out, the stepper in the place header with the door's list, the Skills-alone redirect | Claude | S–M | H119 | Beside H120 |
| **H125** | **Measure and close** | §10's numbers measured on the built screens (both sizes), the phone check, profile-ux.md's superseded banner, this doc's status, sections.md read through | Claude | S | H117–H124 | Last |

**Order:** H117 ∥ H118 → H119 → (H120 ∥ H121 ∥ H122 ∥ H124) → H123 → H125. **H117 can ship today without waiting on
anything:** it changes strings and three sizes on the existing screens, and v2 keeps every wording it sets.
