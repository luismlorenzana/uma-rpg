# Uma profile v2: the audit

> **What this is:** the Uma profile as built on `main` (2b186f8, engine v18, save v31), audited for a redesign. It
> reads the code, the manual ([sections § Stable](../../game/sections.md#stable)), the guideline ([profile
> UX](../profile-ux.md), D229) and D219–D234, and measures the running game. No code or other doc changed.
> [research.md](research.md) (how other games do character screens) is the companion; the proposal comes from both.
>
> **Checked locally, 2026-10-28:** API :8096 and web :5196 on a scratch save built from the domain's CJS build (never
> the owner's): eight Umas, Lv 1 to 50, three with an open calling pick, one working, two Heroes and two Learners, made
> items and jewels in the Warehouse. 390×844 for every number unless marked 375×667. Screenshots stayed in the session's
> scratchpad.

**File keys used below** (all under `apps/web/src/`, unless marked):

| Key | File |
|---|---|
| `OP` | `places/stable/OutfitProfile.tsx` (frame, header, Battle, Work, Racing, Inheritance, Class Ranks) |
| `TC` | `places/stable/TemplateCard.tsx` (template chip and sheet, calling card) |
| `TV` | `places/stable/template-view.ts` (the template's words) |
| `ST` | `places/stable/SkillTree.tsx` (Skills tab and its sheets) |
| `WS` | `places/stable/WeaponSheet.tsx` (a slot's weapon sheet) |
| `G3` | `places/stable/GearCardV3.tsx` (Gear tab: Equip, Upgrade, grade sheet) |
| `GE` | `places/stable/gear-equip.ts` · `GV` `places/stable/gear-v3.ts` (Gear words) |
| `PB` | `places/stable/PresetButton.tsx` |
| `OB` | `places/observatory/ObservatoryPage.tsx` |
| `HP` | `places/halls/HallPage.tsx` · `PH` `places/party-hall/PartyHallPage.tsx` |
| `SH` | `packages/domain/src/save/sheet.ts` (the Battle tab's rows) |

---

## 0. At a glance

| # | Problem | Where it shows |
|---|---|---|
| P1 | **Four kinds of tab under one bar:** free edits (Skills, Gear › Equip), spending (Gear › Upgrade), display only (Battle, Racing) and a near-empty one (Work). Three Uma systems sit outside it: Extra Stats, the Halls, her work. | [§1.3](#13-what-each-tab-is) |
| P2 | **Every link out is one-way.** Extra Stats, Inheritance, Party and Working open pages whose Back leads to the Hub, never back to her. Links in from the Party Hall and the plaza go back to the Stable roster, not where you came from. | [§1.2](#12-entry-points-and-where-back-goes) |
| P3 | **The header eats the first screen:** 42% of it (284 of 683 px); 78% with the calling card. At 375×667 the card pushes the tab bar below the fold. | [§6.2](#62-header-overhead) |
| P4 | **Every tab but Work scrolls.** Skills 2.1 screens, Upgrade 1.8, Battle 1.6. Reading a typical Uma end to end is 9.5 screens; 11.4 with an open calling. | [§6.1](#61-scroll-per-tab) |
| P5 | **One fact, many wordings.** The Flourish shows in 6 places with 5 wordings. Class Rank shows 4 times on the Skills screen and 5 in all. The signature bonus has 4 wordings, an accessory's effect 3. | [§4.2](#42-one-fact-many-wordings) |
| P6 | **42 slop strings in the profile, 54 counting her sheets elsewhere.** Most are rule sentences on control rows: the Flourish line, accessory effects, "weak ×1.3" on every weapon line. | [§4.1](#41-counts) |
| P7 | **Three wrong texts.** The Battle (i) names the retired Damage and Support slots. The Grades (i) names places that are gone. The Work tab's "10 gathered in …" uses the old farm's gather time. | [§4.7](#47-battle), [§4.9](#49-gear--upgrade-and-the-grade-sheet), [§4.10](#410-work) |
| P8 | **Her uniqueness has no home.** Its pieces are split across the read-only template sheet, the calling card, Skills, Gear › Equip and the Observatory. Only the calling flags that it needs a pick. The sheet gives the Flourish no number and has no actions. | [§5](#5-uniqueness-today) |
| P9 | **The guideline describes the build more than it guides it.** It was written in the same PR (#61) and froze the structure ("no rule or save behavior changes"; Work and Racing "keep … data"). The build breaks its own state and density rules: green means 4 things, there are 13 font sizes, 4 heading styles. | [§3](#3-the-guideline-reviewed) |
| P10 | **Compaction shrank type instead of cutting repeats.** It left 15 uses below 10 px (8 px badges, 9.5 px labels) while every duplicate above survived. | [§3.4](#34-what-61-actually-changed) |
| P11 | **Three touch targets under 44 pt:** the template chip (32), Back to auto (36), the Inheritance Bond rows (19). | [§6.4](#64-touch-targets-under-44-pt) |
| P12 | **Spending is buried.** Raising a grade is Gear → Upgrade → pill (3 taps, the view resets each session). A jewel is 4 taps and leaves the profile for good. The green mark on a Skills tree button doesn't lead to the raise. | [§6.3](#63-taps-to-common-tasks) |

---

## 1. Surfaces and entry points

### 1.1 Every surface that shows one Uma

| Surface | File | Shows | Changes there | Duplicates |
|---|---|---|---|---|
| **Profile header** (kit `ProfileFrame`) | `OP:116–153` | Back "All outfits", bust, name, title, "Lv 50 Uma Level", rarity, template chip, Target | Target on/off; template sheet opens | Ticket count (locked), Class Rank, Craft Lv, party |
| **Summary** | `OP:172–209` | EXP bar + "x / y EXP", calling card, Class · Rank, Craft · Lv, Party / Working / Fighting | Class cell → Skills tab; Party/Working cell → Party Hall or place | Class Rank (Skills ×4), Craft Lv (Work), party (Battle) |
| **Calling card** (Pace/Late, until confirmed) | `TC:52–88` | Two class tiles: template name, Flourish, trade and head count, Suggested + Power/Wit; Confirm; "Her first win confirms it." | Calling pick, Confirm | Flourish, trade |
| **Template sheet** (chip) | `TC:16–49`, `TV:89–115` | Name; Calling/Stride/Knack with sources; Trade; Flourish + state; Signature; Moon I/II | Nothing | Racing tab's "Her template"; Flourish; signature; moon |
| **Skills tab** | `ST:91–234`, `OP:313–339` | Class + 3 tree buttons, Flourish line, Class Rank bar, "Depths open", Equipped slots, one tree; Inheritance; Class Ranks ×6 | Tree, equip/unequip, Back to auto; sheets below | Class Rank, Flourish, weapon grades |
| ↳ Class sheet | `ST:214–228`, `ClassPicker.tsx` | Root "Class · Arms ×a + Tome ×b", Flourish, six classes + Rank | Switch class | Flourish, Class Ranks |
| ↳ Node sheet | `ST:298–323` | Name, pips, "Rank 3 · next at Class Rank 14", depth/line, skill line | Equip / Unequip | — |
| ↳ Branch sheet | `ST:326–350` | Three skills with depth, gate, line | Take branch A/B | — |
| ↳ Weapon sheet | `WS:65–134` | The slot channel's weapons with grade line | Hold another weapon (swaps) | Weapon grades (Upgrade) |
| ↳ Inheritance card | `OP:342–384` | Hero seat + Bond, or Heroes + Bond + % | Opens the hall | Halls page |
| **Battle tab** | `OP:239–309`, `SH` | "Fights as", Offense/Defense/Sustain/Other (3 cols), core stats, unlock date | Nothing ("Fights as" → Skills) | Class, skills count, party, Flourish, signature |
| **Gear › Equip** | `G3:146–211`, `PB` | Preset row, weapons ×3 + armor ×5 icons with G, accessory: 4 family buttons + selected card | Preset, accessory family + kind | Weapon grades (Skills, Upgrade), signature |
| **Gear › Upgrade** | `G3:217–269`, `GV` | Every slot's grade line + raise pill; Extra Stats button (to set, open, total) | Raise (one step) | Grades (Equip), Extra Stats (Observatory) |
| ↳ Grade sheet | `G3:42–87` | Now / Next, armor half, raise, Up to Gn | Raise one or several | Upgrade row |
| **Work tab** | `OP:426–463` | Job (place, item, count, time), Craft Lv · trade, "10 gathered in …", Craft EXP, grade gates | Nothing (job row → place) | Summary cell, template trade |
| **Racing tab** | `OP:467–528`, `TV:119–129` | Aptitudes, "Her template", racing base stats + growth, racing unique | Nothing | Template sheet |
| **Locked profile** | `OP:211–235` | Unlock · 1 Ticket, tickets left, Racing only | Unlock | Ticket count ×3 |
| **Skills alone** `outfit/:id/skills` | `StablePage.tsx:31–39` | The Skills tab without the frame | As Skills | Skills tab |
| **Observatory** | `OB:114–226` | Face + "Open 16 of 20 · ★ 1 of 2", map, Prowess split, six stat totals, Set list | Set a jewel | Upgrade's Extra Stats button, template Moon |
| **Halls of Heroes** | `HP` | Seats, Heroes, Learners + Bond; Hero and Learner sheets | Appoint, add/remove Learner | Inheritance card |
| **Party Hall** | `PH` | Face, Lv, class, ★ family; slot sheet | Slot, lead, recall, remove, View profile | Summary cell |
| **Wilds job sheet** (kit) | `places/work/PlaceV3.tsx:117–137` | Picker: face + "C30", her trade first, "Another trade" | Start/queue her job | Work tab |
| **Exchange › Class Manual** | `places/exchange/ExchangePage.tsx:138–176` | Picker, six Class Rank bars, ×1/×5 | Raise Class Rank (Class Marks) | Class Ranks |
| **Rift guided weapons** | `places/rift/GuidedWeapons.tsx` | Each member's weapons vs the front's guide | Sets her weapons | Skills weapons |
| **Active party bar** (world map) | `places/scenario-gate/ActiveParty.tsx` | Face, Lv, MP bar, class | Tap → Skills alone | Summary |
| **Fight result** | `places/scenario-gate/FightResult.tsx` | EXP, level up, Class Rank bar, skill rank-ups, Bonds | Nothing | — |
| **Plaza sheet** (Hub) | `hub/Featured.tsx:90–121` | Bust, Lv, title; Fight, Profile | Feature her | — |
| **Stable roster** | `StablePage.tsx` | Face, class emblem, target, NEW / can-upgrade mark; filters by template, trade | Opens profile | — |

### 1.2 Entry points and where Back goes

| From | To | How | The app's Back goes to | Verdict |
|---|---|---|---|---|
| Stable roster | Profile | face | "All outfits" → roster | ✓ |
| Top bar's Uma Ticket chip | Stable roster | 1 tap | Town | ✓ shortest way in |
| Party Hall slot sheet | Profile | **View profile** | roster (`navigation.ts:43`, not the party) | ✗ |
| Plaza sheet | Profile | **Profile** | roster | ✗ |
| World map's party bar | Skills alone | face | the map | ✗ the Back is labelled with her name; opened any other way it goes to the roster |
| Profile › Upgrade › Extra Stats | Observatory (`/town/observatory/:id` redirected to `/learning/…`) | button | Observatory root → Learning | ✗ no way back to her |
| Profile › Inheritance row | Her hall | row | Learning | ✗ |
| Profile › Party cell | Party Hall, party n (or the list) | cell | Party Hall → Town | ✗ |
| Profile › Working cell / Work tab | The place | cell | Wilds | ✗ |
| Observatory, Halls, Wilds pickers | — | — | no link to her profile | ✗ |
| Profile › Gear › "Set on Skills ›", Battle "Fights as", class cell | Skills tab | tab switch | — | three buttons to one tab |

The profile also has **two back controls that do the same thing**: the place header's ‹ ("Back to Stable") and the
"‹ All outfits" row (`OP:117–121`, 44 px of the first screen) both open the roster.

### 1.3 What each tab is

| Tab / place | Nature | Its actions | Spends |
|---|---|---|---|
| Skills | edit, free | class, weapon per slot, branch, equip, auto | — |
| Battle | display | one link (→ Skills) | — |
| Gear › Equip | edit, free | preset, accessory family and kind | — |
| Gear › Upgrade | spend | raise one or several grades | made items |
| Work | display | one link (→ the place) | — |
| Racing | display | none | — |
| *Observatory (outside)* | spend | set a jewel | jewels |
| *Halls (outside)* | edit | Hero, Learner | — |
| *Party Hall (outside)* | edit | party, lead, recall | — |
| *Wilds (outside)* | spend, edit | start, queue, recall, speed up | Speed Tickets |
| *Exchange (outside)* | spend | Class Manual | Class Marks |

---

## 2. Systems × surfaces

*Italics:* outside the profile.

| System | Viewed | Changed | Spent on |
|---|---|---|---|
| Identity, level, EXP | header, summary EXP; *roster, Party Hall, pickers, party bar, plaza, fight result* | *fights* | — |
| Class | summary, Skills class button, Class sheet, Battle "Fights as"; *roster emblem, Party Hall, party bar, pickers* | Class sheet (Skills) | — |
| Class Rank | summary, Skills button "R40", rank bar, Class Ranks grid, Class sheet; *fight result, Exchange* | *fights* | *Exchange: Class Manuals (Class Marks)* |
| Weapons (3 slots) | Skills tree buttons, Weapon sheet, Equip icons, Upgrade rows, Battle Might; *Rift guide* | Weapon sheet; preset (Equip); *Rift guided weapons* | — |
| Trees, branches, equipped skills | Skills tree, node and branch sheets, equipped row; Battle "7/7 skills"; *fight's skill sheet* | Skills: Take branch, Equip, unequip, Back to auto | — |
| Skill Ranks | node badges, node sheet, equipped badges; *fight result "… reached Rank 3"* | automatic (Class Rank) | — |
| Stats | Battle (sheet + core), Upgrade's Extra Stats total; *Observatory totals, party bar MP* | derived | — |
| Gear grades (weapons, armor, accessory) | Equip icons, Upgrade rows, grade sheet, Skills tree button G + mark, Battle Might; tab dot; *roster mark* | — | **Upgrade** (Arms Gems, Tome Ink, Armor Fittings, Accessory Settings) |
| Accessory form + signature | Equip cards, Upgrade accessory row, Battle Accessory + Signature rows, template Signature, preset row; *Party Hall "★ Pendant", roster filter* | Equip (family, kind), preset | — |
| Extra Stats + her moon | Upgrade's Extra Stats button, Battle green/★ brackets, template Moon line; tab dot/count; *Observatory* | — | *Observatory: Planet and Moon Jewels* |
| Calling and its pick | template sheet, calling card, Racing; *roster filter* | calling card (Pace/Late, until confirmed or first win) | — |
| Stride, knack | template sheet, Racing; *roster filters* | never | — |
| Flourish | Skills row, Class sheet, template sheet, Battle, Racing, calling tiles | indirectly: fight as her calling's class | — |
| Trade, Craft Level, work | summary Craft/Working, Work tab, template sheet, calling tiles; *Wilds pickers "C30", roster filter, Hub arch faces* | *Wilds job sheet; Party Hall recall* | *Wilds: Speed Tickets* |
| Bonds, Halls | Inheritance card; *Halls page, pickers, fight result* | *Halls page* | — |
| Racing aptitudes, stats, unique | Racing; *roster line* | never | — |
| Target, upgrade marks | Target icon, Gear dot, Upgrade count + pills, Skills tree marks; *roster badges, Wilds targets strip* | Target icon | — |
| Party | summary cell, Battle row; *Party Hall, party bar, Rift* | *Party Hall* | — |

**Read across:** of 18 systems, 6 change only outside the profile: level and Class Rank by fighting (and Class
Manuals at the Exchange), Extra Stats at the Observatory, work in the Wilds, Bonds in the Halls, parties in the Party
Hall. None of those pages links back to her. Stats and grades are each viewed in 4–5 places on the profile alone.

---

## 3. The guideline reviewed

### 3.1 Rule by rule

| Rule (profile-ux.md) | Verdict | Evidence |
|---|---|---|
| **1 Overview first:** header has only portrait, name, title, level, rarity/template, target; EXP one thin line; Class, Craft and Party/Work in one row | **Partly** | The header and the row match (`OP:123–133`, `OP:186–206`). But the calling card sits between EXP and the row (`OP:185`, about 250 px). The extra "All outfits" row comes first (`OP:117–121`). EXP is a bar plus a caption (`OP:182–183`). Tabs start at 42% of the screen, 78% with the card. |
| **2 Actions 44 pt; facts aren't cards** | **Partly** | Under 44 pt: chip 32 (`TC:24`), Back to auto 36 (`ST:144`), Bond rows 19 (`OP:374`). Facts shown as raised cards: Craft cell (`OP:195`), Class Ranks tiles (`OP:325`), Battle cells (`OP:278`). |
| **3 Icons choose; sheets explain; name the selection once** | **Not followed** | The Flourish rule is a full sentence on the Skills row (`ST:131`). Accessory effects are sentences on Equip (`GE:37–42`). "★ Her signature …" (`GE:55`). Class Rank shows 4× on Skills (`OP:192` summary, `ST:110`, `ST:135`, `OP:329`). |
| **4 One selection, one action** | **Mostly** | Followed for the accessory (`G3:91–143`) and the trees (`ST:105–130`). Upgrade puts an action on every row: 11 pills (`G3:239–252`), exempted by its own contract. |
| **5 One state language:** fill selected, ring held, raised available, low contrast other path, faded + gate closed, small green mark can improve | **Not followed** | Fill means *equipped* on tree nodes (`ST:288`), *active class* in the Class sheet (`ClassPicker.tsx:13`) and *branch B* on a tree button's letter (`ST:124`). A ring means *wearing* on accessories (`G3:109`) but *selected* on calling tiles (`TC:73`). **Green** means can improve (tab dot, `UpgradeMark`), *equipped* (`ST:293`), *calling open* (`TC:26`) and *jewels to set* (`G3:258`). |
| **6 Structure visible:** connected icon nodes, trunk, fork, square A/B the same size, rank/equipped/gate on the node | **Followed** | `ST:170–199`, both 48 px (`ST:187`, `ST:288`). Cost: the equipped row shows marks only, so you tap to learn which skill it is, and that tap unequips at once with no sheet (`ST:151`). |
| **7 Density consistent:** same small heading, 8 pt padding, 8 pt rhythm; Battle in 3 columns; Work and Racing compact | **Partly** | Battle uses 3 columns (`OP:276`). Headings come in 4 styles: `text-micro` (`G3:162`), 10 px uppercase (`OP:258`), 11 px sentence case (`OP:319`, `OP:351`), 14 px bold (`G3:257`). Padding is p-1.5 on Battle and p-2/p-2.5 elsewhere. 13 font sizes (8–15 px), 15 uses under 10 px. |

**Screen contract:** the shapes all match (header, Skills row, Battle three columns, Equip one row and one card,
Upgrade blockers beside the slot). The contract's "Work and Racing keep all current rules and data" kept the wrong
"10 gathered" line and Racing's duplicate template.

**Phone checks:** "every interactive icon has a 44 pt hit area" fails three times (§6.4). "Never clips long names":
nothing clipped at 375×667 on the test save. The rest hold.

### 3.2 The guideline itself

| | |
|---|---|
| **Good** | "A control surface, not a manual"; rules behind a deliberate tap; icons for repeated choices; one selection with one action; a real tree; 44 pt; a phone check list. Keep all of it. |
| **Missing: structure** | No rule for what belongs in the profile. Extra Stats, the Halls and work live outside, with no rule for links out or the way back. Nothing on tabs that mix display, free edits and spending. |
| **Missing: copy** | No copy rule (label + number, no sentences, one wording per fact, no "her …" narration). D95's "no explainers" isn't cited. |
| **Missing: one fact once** | No rule that a fact appears once per screen, which would have caught §4.2. |
| **Missing: type scale** | No type scale or minimum size. "Compact" became 8–9.5 px text. |
| **Missing: uniqueness** | Nothing on the template, pending picks or badges. The template is only "rarity/template" in the header. |
| **Missing: budgets** | No measurable budget: header height, screens per tab, taps per task. |
| **Missing: references** | Its references are desktop ARPG passive trees (Diablo IV, Path of Exile, Last Epoch), which only shape the tree. Nothing on mobile character sheets, the closer model ([research.md](research.md)). |
| **Wrong** | "No rule or save behavior changes" and "Work and Racing: keep all current rules and data" froze the structure and the stale data. |
| **Wrong** | "Gear / Upgrade … may be denser" exempted the busiest screen. |
| **Wrong** | It names green "can improve", while the same PR added a green dot for *equipped* (`ST:293`) beside the older *calling open* and *jewels to set*. |
| **Wrong** | "Status: built (D229)" claims checks it fails (§3.1). |

### 3.3 Iteration history

| When | Change | Ref |
|---|---|---|
| 2026-10-10 | First profile (S2), then its tabs | `2c60abe`, D60 `26b9cbe` |
| 2026-10-11 | "No placeholder or explainer text; help behind an (i)" | D95 `ed580d5` |
| 2026-10-21 | Standard preset; can-upgrade marks | H33, H34 |
| 2026-10-22 | Classes v2 screens | H59 `e9feef1` |
| 2026-10-25 | Template chip and sheet, calling card, the v16 tree | H70 `024f22b` |
| 2026-10-26 | Gear by grade; Extra Stats outside | H79 `5032fe6` |
| 2026-10-26 | Gear split into Equip and Upgrade | H107 `c07a463`, D223 |
| 2026-10-26 | Compact profile plus the guideline | #61 `f4b22c2`, D229 |

### 3.4 What #61 actually changed

435 lines in, 255 out across 9 files; `profile-ux.md` was added in the same commit.

**Changed:** the Target became an icon. Class moved into the summary row. Battle rows became 3-column cells, Class
Ranks a grid. The tree became connected nodes with sheets. The accessory became one row plus the selected card. Type
and padding were cut across every tab (labels 11 → 9.5 px, sections p-3 → p-2/p-1.5).

**Not touched:**
- the Flourish sentence (`ST:131`);
- the Class Rank repeats;
- "Fights as" (`OP:249–255`);
- Racing's "Her template";
- "10 gathered";
- the stale (i) sheets;
- tab structure;
- where Extra Stats lives.

The scrolling the owner found "exhausting" was cut mostly by smaller type, not by removing anything.

---

## 4. Copy inventory and the slop list

**Tags:** **label** names a thing · **value** a number or state · **action** a button · **help** an (i) text ·
**slop** prose where a label and a number would do, a restated rule, a repeat on the same screen, narration, or a
wrong text. Kit-drawn chrome (top bar, place header, bottom bar) is out of scope.

### 4.1 Counts

| Screen | Inventory rows | Slop |
|---|---|---|
| Header, summary, locked page | 20 | 5 |
| Calling card | 8 | 5 |
| Template sheet | 7 | 2 |
| Skills tab and its sheets (Class, node, branch, weapon) | 33 | 9 |
| Inheritance, Class Ranks | 8 | 0 |
| Battle | 12 | 4 |
| Gear › Equip | 18 | 6 |
| Gear › Upgrade, grade sheet | 17 | 8 |
| Work | 6 | 2 |
| Racing | 4 | 1 |
| **Profile total** | **133** | **42** |
| Observatory (her map) | 8 | 4 |
| Halls' Hero and Learner sheets | 7 | 6 |
| Party Hall slot sheet | 3 | 2 |
| **With her sheets elsewhere** | **151** | **54** |

A row is one string or one family of strings from the same line of code (the Battle rows of one group, the four
family effects).

### 4.2 One fact, many wordings

| Fact | Wordings, where | Keep one |
|---|---|---|
| **Flourish** (6 places, 5 wordings) | "★ Even pace · 1% of her max HP a round, up to 4%" (Skills row `ST:131`, Class sheet `ST:223`, `TV:64–70`) · "Even pace · 1% a round, up to 4%" (Battle, `SH:27–31`) · "★ Even pace · as a Brawler · on" (template, `TV:112`) · "Even pace · Active" (Racing, `TV:126–127`) · "★ Even pace as a Paladin" (calling tile, `TV:151`) · off: "No effect as Mage" | Name + On/Off where it's a chip; the number once, in her uniqueness view |
| **Class Rank** (4 on the Skills screen, 5 with the Class sheet) | "Rank 40" (summary `OP:192`) · "R40" (`ST:110`) · "Brawler Rank 40" + bar (`ST:135`) · "40" (Class Ranks `OP:329`) · "Rank 40" (Class sheet) | The class button's "R40" and one bar |
| **Signature bonus** (4) | "★ Her signature: ATK and M.ATK +10" (`GE:55`) · "· ★ +10" (`GV:56`) · "+10 ★" (`SH:103`) · "Signature · Bell · +10 now · worn" (`TV:99`) | "★ Signature · ATK/M.ATK +10" |
| **Accessory effect** (3) | "After her Attack, one more hit of that kind at 0.8" (`GE:40`) · "after her Attack, her Greatsword at 0.8" (`GV:53`) · "Bell: Greatsword 0.8 after her Attack" (`SH:52`) | "Bell · Greatsword ×0.8" |
| **Extra Stats opened** (2 formats) | "17/22 open" (`G3:260`) · "Open 16 of 20 · ★ 1 of 2" (`OB:145`) | One count |
| **Armor half** (2 words) | "Magic" (`PB:35`) · "Magical armor" (`G3:179`) | "Magical" |
| **Uma Tickets** (3 on the locked page) | top bar "12 · 0/5", place header "12", "12 Uma Tickets left" (`OP:226`) | the bars |
| **Her class, skills, party** (Battle) | summary row + "Fights as Brawler · 7/7 skills · Party 1" (`OP:249–255`) + Skills "Equipped · 7/7" | the summary |
| **Her template** (2 full copies) | template sheet (`TV:89–115`) · Racing "Her template" (`TV:119–129`) | one |

### 4.3 Header, summary, locked page

| File:line | Text | Tag | Fix |
|---|---|---|---|
| `OP:119` | "All outfits" | action | Drop: the place header's Back already goes there |
| `OP:124–125` | bust, name, title | value | — |
| `OP:127` | "Lv 50" "Uma Level" | **slop** | "Lv 50"; Craft has its own label |
| `OP:129` | "★★★" | value | — |
| `TC:25–26` | "★ Fleet Bruiser" + green dot | value · action | Raise to 44 pt; the dot means "pick waiting" |
| `OP:161` | Target (aria "Mark target" / "Remove target") | action | — |
| `OP:162` | "That didn't work." | value | — |
| `OP:183` | "1,200 / 2,400 EXP" | value | — |
| `OP:183` | "Max level · 301 EXP banked" | **slop** | "Max · 301 EXP" |
| `OP:191–192` | "Brawler" "Rank 40" | label · value | — |
| `OP:196–197` | "Craft" "Lv 30" | label · value | — |
| `OP:202` | "Party" / "Working" / "Fighting" | label | — |
| `OP:203–204` | "Party 1" / "Mine" / "Open fight" / "1h 20m" / "Done" | value | — |
| `OP:203` | "Free" | **slop** | "No party" (free of what?) |
| `OP:138` | tabs "Skills · Battle · Gear · Work · Racing", "Gear, can upgrade" | label | — |
| `OP:223` | "Unlock · 1 Ticket" | action | — |
| `OP:226` | "12 Uma Tickets left" / "No Uma Tickets left" | **slop** | Drop; the 3rd copy of the count on this page |
| `OP:135` | "In Tier 2" | value | — |
| `OP:136` | "Unlocked in Tier 1" | **slop** | "Unlock in Tier 1" (it reads as a past event) |
| `OP:108–109` | "That outfit isn't in the current game data." · "Back to the Stable" | value · action | — |

### 4.4 Calling card and template sheet

| File:line | Text | Tag | Fix |
|---|---|---|---|
| `TC:68` | "Her calling · choose once" | **slop** | "Calling", with the once-only rule in the Confirm step |
| `TC:74` | tile: emblem + "Paladin" | label | — |
| `TC:75` | "★ Mighty Warden" | value | — |
| `TC:76`, `TV:151` | "★ Even pace as a Paladin" | **slop** | Drop: the stride sets the Flourish, so both tiles read the same |
| `TC:77`, `TV:168` | "Fields · Tome Forge · 2 Umas" | **slop** (on a Late Uma both tiles are equal) | Show only when the tiles differ |
| `TC:78`, `TV:154` | "Suggested · Power 105 over Wit 88" | **slop** | "Suggested" badge; the reason in (i) |
| `TC:83` | "Confirm" | action | — |
| `TC:84` | "Her first win confirms it." / "Finish her work first" | **slop** / value | First: to (i). Second: keep, it's a block |
| `TC:29` | "Her template" | label | — |
| `TC:31` | "★ Fleet Bruiser" | value | — |
| `TC:35–36`, `TV:108–110` | "Calling ← Front A" "Brawler" · "Stride ← Medium A" "Middle" · "Knack ← Speed +20%" "Fleet" | label · value · help | Keep the sources; write "from Front A", the arrows are cryptic |
| `TC:40`, `TV:160` | "Trade · Mine · Weapon Forge" | label · value | — |
| `TC:41`, `TV:112` | "★ Even pace · as a Brawler · on" | **slop** | "Flourish · Even pace · 1%/round, max 4% · On" (the number is missing here) |
| `TC:42`, `TV:99` | "Signature · Bell · +10 now · worn" / "Wear a Bell" | **slop** | "Signature · Bell · ATK/M.ATK +10 · Worn / Not worn" |
| `TC:43`, `TV:113` | "Moon · I Evasion +2.4% (open) · II DEF +8 (Lv 36)" | value | Two rows: "Moon I · Evasion +2.4% · Open", "Moon II · DEF +8 · Lv 36" |

### 4.5 Skills tab and its sheets

| File:line | Text | Tag | Fix |
|---|---|---|---|
| `ST:95` | "Class and trees" | label | — |
| `ST:97–102` (i) | class blurb; "Switching class is free …"; "A party fights with one healer at most …"; depths, fork, Skill Ranks, equip slots; "Weapon grades are raised with Arms Gems or Tome Ink …" | help | Keep in (i); one rule a line |
| `ST:109–110` | class button "Brawler" "R40" | label · value | — |
| `ST:124–125` | tree button "A"/"B", "G9" / "T", upgrade mark | value | — |
| `ST:131–132`, `TV:69` | "★ Even pace · 1% of her max HP a round, up to 4%" (+ "· No effect as Mage") | **slop** | Chip "★ Even pace · On/Off"; the number lives in her uniqueness view |
| `ST:135` | "Brawler Rank 40" + bar | **slop** | Drop; the class button already shows R40 (put the bar inside it) |
| `ST:136` | "Depths 1–5 open" | **slop** | Drop; the tree fades closed depths with their gate |
| `ST:142` | "Equipped · 7/7" | label · value | — |
| `ST:143–144` | "Auto" / "Back to auto" | value / action | Raise Back to auto to 44 pt |
| `ST:154` | equipped slot rank badge "5" | value | — |
| `ST:78` | "All 7 skill slots are full: unequip one first" | **slop** | "Slots full · 7/7" |
| `ST:74` | "That didn't work." | value | — |
| `ST:165`, `ST:168` | "Greatsword tree" · "Change" | label · action | — |
| `ST:291` | node badge: rank or gate "20" | value | — |
| `ST:215` | Class sheet: "Class" | label | — |
| `ST:221` | "Spell Blade · Arms ×0.72 + Tome ×0.44" | value | Label it "Hand · Arms ×0.72 · Tome ×0.44" |
| `ST:223` | Flourish line again | **slop** | Drop |
| `ClassPicker.tsx:15–16` | "Brawler" "Rank 1" ×6 | label · value | — |
| `ST:306` | Node sheet: title = skill name | label | — |
| `ST:315` | pips + "Rank 3 · next at Class Rank 14" / "Rank 5" / "Class Rank 30" | value | — |
| `ST:316` | "Depth 4 · Trunk" / "Branch B" | value | — |
| `ST:319` | "one foe · 2 hits · 1.4× · 12 MP · cuts through the shield" | value | — |
| `ST:308` | "Equip" / "Unequip" | action | — |
| `ST:332` | Branch sheet: "Lance · B · Impale" | label | — |
| `ST:340–343` | skill name · "Depth 3 · Class Rank 20" · skill line | label · value | — |
| `ST:334` | "Take branch B" | action | — |
| `ST:347` | "Her branch" | **slop** | "Held", or nothing: the square's fill says it |
| `WS:84` | Weapon sheet: "Slot 1 · Arm" | label | "Slot 1 · Arms" |
| `WS:88–89` | heading "KATANA" + row "Katana · G5 · …" | **slop** | One row per weapon; the heading repeats the row |
| `WS:89` | "· swaps with slot 2" | value | — |
| `WS:95`, `GV:30` | "· weak ×1.3" on every weapon | **slop** | Drop: a constant for every weapon (in (i) once) |
| `WS:96` | "Held" | value | — |
| `WS:96` | "Hers" | **slop** | Drop: every option is hers |

### 4.6 Inheritance and Class Ranks

| File:line | Text | Tag | Fix |
|---|---|---|---|
| `OP:351` | "Inheritance" | label | — |
| `OP:353` (i) | "Seat her in a Hall of Heroes. A Hero owns that seat's Limit Break; a Learner borrows it and builds a Bond." | help | — |
| `OP:360` | "Brawler Hero · {Limit Break}" | value | — |
| `OP:361` | "Bond 0/10" | value | — |
| `OP:368` | "No inheritance yet" | value | Add a link to the halls (none today) |
| `OP:375` | "{Limit Break} · former Hero" | value | — |
| `OP:376` | "Bond 2/10 · 60% ›" | value | "60% strength": the % has no label. Row at 19 pt |
| `OP:319` | "Class Ranks" + six cells | label · value | — |

### 4.7 Battle

| File:line | Text | Tag | Fix |
|---|---|---|---|
| `OP:251–254` | "Fights as" "Brawler" "7/7 skills · Party 1" | **slop** | Drop the row: the summary and Skills show all three |
| `OP:259` | "OFFENSE" "DEFENSE" "SUSTAIN" "OTHER" | label | — |
| `OP:262–263` | legend "GEAR" "EXTRA STATS" (Offense only) | label | — |
| `OP:266–271` (i) | "Her core stats grow by level …"; "… Her Damage slot's Orb adds offense to every hit of its kind; her Support slot's Talisman or Amulet a defensive effect."; healers; evasion, Limit | **slop** (wrong) | Rewrite for one accessory slot with four families; one source a line: "ATK, M.ATK ← Speed · HP ← Stamina, Power, Guts · MP ← Wit · DEF ← Power · M.DEF ← Power, Wit · (+gear +Extra Stats, ★ her moon)" |
| `SH:101–107` | "ATK 190 (+20 +51)", "M.ATK", "DEF", "M.DEF", "HP", "MP · +10 a round", "Evasion 12%" | label · value | — |
| `SH:98` | "Might" "Greatsword +57" ×3 | label · value | — |
| `SH:48–55` | "Pendant: +2 on her three kinds" · "Orb: Fire +8" · "Bell: Greatsword 0.8 after her Attack" · "Insignia: +6% on sub-bosses and bosses" · "None" | **slop** | "Bell · Greatsword ×0.8", "Pendant · +2 ×3 kinds", "Insignia · bosses +6%" |
| `SH:103` | "Signature" "+10 ★" | value | "ATK/M.ATK +10": which stat isn't said |
| `SH:106`, `SH:29–31` | "★ Flourish" "Even pace · 1% a round, up to 4%" / "No effect as Brawler" | value | Keep here (its stat home) |
| `SH:107` | "Limit Break head start" "0 / 12" | label · value | "Limit start" |
| `OP:296–301` | "CORE STATS" Speed … Wit | label · value | — |
| `OP:306` | "Unlocked 10/28/2026." | **slop** | Drop, or move to an identity row |

### 4.8 Gear › Equip

| File:line | Text | Tag | Fix |
|---|---|---|---|
| `OP:416` | "Equip" / "Upgrade · 11" | label | — |
| `PB:33` | "Standard preset on" / "Use standard preset" | value / action | — |
| `PB:35` | "Brawler · Physical · Bell" / "Mage · Magic · Bell" | value | "Magical" (Equip's own header says "Magical armor") |
| `PB:42–47` | "Standard preset" · "Binds to her for good" · "Use the standard preset" | **slop** (v1 path, no graded save reaches it) | Delete with the v1 branch |
| `G3:162–163` | "Loadout" · "Set on Skills ›" | label · action | — |
| `G3:173`, `G3:190` | weapon and armor "G9" badges | value | — |
| `G3:37` + `G3:190` | an armor slot at G0 shows "G0" twice (empty frame + badge) | **slop** | Empty frame, badge only |
| `G3:179` | "Physical armor" / "Magical armor" | label | — |
| `G3:180` (i) | "Her three weapons set her skill trees. Her class sets the physical or magical half … Grades and their exact stats are on Upgrade." | **slop** | Drop: it repeats the screen's own headers |
| `G3:199` | "Accessory · G8" | label · value | — |
| `G3:201–202` (i) | "Pick one family. A Bell repeats her Attack, a Pendant adds all three kinds, an Orb …, an Insignia …" · "The form changes freely outside fights …" | help | — |
| `G3:120` | "★ Bell" | label | — |
| `GE:37–42` | "After her Attack, one more hit of that kind at 0.8" · "+2 on her three kinds" · "+8 offense on one kind" · "+12% on sub-bosses and bosses" | **slop** | "Extra hit ×0.8" · "+2 · 3 kinds" · "+8 · 1 kind" · "Bosses +12%" |
| `GE:56` | "From G1: …" | **slop** | "G1: …" |
| `GE:55` | "★ Her signature: ATK and M.ATK +10" | **slop** | "★ Signature · ATK/M.ATK +10" |
| `GE:60` | "No Greatsword in her slots" | value | "Greatsword not held" |
| `G3:127–133` | kind buttons (aria "Thunder Tome") | action | — |
| `GE:72–77` | "Equip" / "Equipped" / "Switch to Lance" | action | — |

### 4.9 Gear › Upgrade and the grade sheet

| File:line | Text | Tag | Fix |
|---|---|---|---|
| `G3:238` | "Grades" | label | — |
| `G3:238` (i) | "… Arms Gems, Tome Ink, Armor Fittings and Accessory Settings come from the Forge, the Workbench, the Armorer and the Charm Shop." | **slop** (wrong) | "G1–G10 · G*g* opens at Lv 5*g* − 4 · Arms Gem: Weapon Forge · Tome Ink: Tome Forge · Armor Fittings: Armorer · Accessory Setting: Charm Forge" |
| `G3:241` | "WEAPONS" "ARMOR" "ACCESSORY" | label | — |
| `GV:30` | "Greatsword · G9 · Might 57 · weak ×1.3" | **slop** | Drop "· weak ×1.3" |
| `GV:39` | "Head · Helm · G8 · DEF +32" | value | — |
| `GV:53–57` | "Bell · Greatsword · G8 · after her Attack, her Greatsword at 0.8 · ★ +10" | **slop** | "Bell · Greatsword · G8 · ×0.8 · ★ +10" |
| `GV:47` | "Bell · Katana · G0 · counts from G1" | **slop** | "… · G0 · off" |
| `GV:44` | "Accessory · G0 · Pick a form" | **slop** | "Accessory · G0 · no family", linked to Equip |
| `GV:25` | pill "G9 → G10 · 1 Arms Gem G10" | action | "Armor Fittings G9 ×1" reads better than "1 Armor Fittings G9" |
| `packages/domain/src/economy/grades.ts:123–130` | "Needs Lv 16" · "Needs 1 Arms Gem G4" · "Already G10" | value | — |
| `G3:59` | grade sheet title "Greatsword" | label | — |
| `G3:62–63` | "Now · G9 · Might 57 · weak ×1.3" · "Next · G10 · …" | **slop** | "G9 · Might 57 → G10 · Might 68" |
| `G3:64` | "Her class's half · Helm" | **slop** | "Helm · Physical" |
| `G3:70`, `G3:74–80` | "Up to G6" · item list · "Cancel" "Raise" | action | — |
| `G3:257–258` | "Extra Stats" + "2 to set" | label · value | — |
| `G3:260` | "17/22 open · map ›" | value | One format with the Observatory |
| `G3:263` | "Total with armor: HP +375 · MP +75 · … · Speed 12.0% evasion" | **slop** | Drop (Battle has the totals). Or a labelled grid ("Extra Stats + armor") with "Evasion 12%" |

### 4.10 Work

| File:line | Text | Tag | Fix |
|---|---|---|---|
| `OP:437–438` | "Working at Fields" · "Carrot · 1/5" | label · value | "Fields · Carrot · 1/5" |
| `OP:440` | "Done" / "1h 20m" | value | — |
| `OP:449` | "Craft Lv 10 · Fields · Tome Forge" | label · value | — |
| `OP:451` | "10 gathered in 8h 26m" | **slop** (wrong) | Drop: the old farm's gather time ([sections](../../game/sections.md#stable) admits it) |
| `OP:455` | "120 / 1,575 EXP" | value | — |
| `OP:455–456` | "· grade 2 open · grade 3 at Craft Lv 11" | **slop** | "G2 open · G3 at Lv 11" |

For an idle Uma the tab is one card of three lines (399 px with padding). It can't start, queue, recall or collect a
job; the job row only opens the place.

### 4.11 Racing

| File:line | Text | Tag | Fix |
|---|---|---|---|
| `OP:488–491` | "SURFACE" "DISTANCE" "STYLE", "Turf A" … | label · value | — |
| `OP:498–501`, `TV:119–129` | "HER TEMPLATE": Calling "Paladin · Late A · Power 105 > Wit 88", Stride, Knack, Flourish "Even pace · Active" | **slop** | Drop: a second full copy of the template sheet |
| `OP:504–511` | "RACING BASE STATS · GROWTH", 5 rows | label · value | — |
| `OP:518–524` | "UNIQUE SKILL (RACING)", its name and description · "Loading…" · "Not in the current game data." | label · value | — |

The tab never says what its numbers do in this game. The racing base stats and growth feed her core stats
(`packages/domain/src/rpg/rules.ts:296`: base ÷ 5 + levels × 1.5 × (1 + growth)). The aptitudes and growth are her
template's sources (calling, stride, knack). Only the racing unique has no RPG use.

### 4.12 Her sheets in other places

| File:line | Text | Tag | Fix |
|---|---|---|---|
| `OB:145` | "Open 16 of 20 · ★ 1 of 2" | value | — |
| `OB:151` (i) | "Each node opens with its jewel, in order. Every open node counts." | help | — |
| `OB:153` | "Prowess · Brawler 100/0: ATK +30, M.ATK +0" | **slop** | "Prowess · ATK +30" (the split is jargon) |
| `OB:158–159` | six stats "HP +255 …" with "★" part | label · value | — |
| `OB:163–170` | "SET" · "Moon Jewel II ×3" · "Opens Guard II · DEF and M.DEF +4" · "Set" · "No jewels ready." | label · value · action | — |
| `OB:193` | node value "as Brawler ATK +6, M.ATK +0" | **slop** | "ATK +6" |
| `OB:206` | "needs a Planet Jewel III · opens at Lv 21" / "Planet Jewel III · Open" | **slop** / value | "Planet Jewel III · Lv 21" |
| `packages/domain/src/hub/places.ts:178` (its quick look) | "Each Uma's Extra Stats map: a Sun, eight planets and their moons." | **slop** (wrong) | "Planet and three moons; her moon" |
| `HP:64` | "Four Heroes, each with her own Limit Break, and their Learners." | **slop** | Drop |
| `HP:144` | "{name} uses {Limit Break} as her only Limit Break, at full strength." | **slop** | "Hero · 100%" |
| `HP:149` | "Her own Bond with this seat: 3/10, kept if she becomes its Learner" | **slop** | "Bond 3/10" |
| `HP:157` | "Empty this seat (its 3 Learners leave; their Bonds stay)" | **slop** | "Empty seat", then a confirm that names the Learners |
| `HP:173–175` | "Bond 4/10 · 70% strength" · "3/10 to Bond 5" | value | — |
| `HP:178` | "Inherits X, and Y from her other Hero." | **slop** | "Limit Breaks · X · Y" |
| `HP:180` | "Leave this Hero (her Bond stays)" | **slop** | "Leave" |
| `PH:151` | "Slot 3 · add an Uma" | **slop** | "Empty" |
| `PH:182–192` | "Party lead" / "Make party lead" · "Swap with another Uma" · "View profile" · "Remove from Party 1" | action | — |
| `PH:198` | "Recall from Mine · what's made is kept" | **slop** | "Recall from Mine" |

---

## 5. Uniqueness today

### 5.1 Each piece: where it shows, where it's picked

| Piece | Visible | Picked or changed | Flags a pending pick? |
|---|---|---|---|
| **Template name** ("Fleet Bruiser") | header chip; calling tiles (both names); roster search | follows the calling pick | — |
| **Calling** | template sheet ("Calling ← Front A"), Racing, calling card | **calling card**, Pace/Late only, until Confirm or her first win; waits while she works | **yes:** green dot on the chip + the card |
| **Stride, knack** | template sheet, Racing | never | — |
| **Flourish** | 6 places (§4.2) | indirectly: fight as her calling's class (Skills › Class sheet) | **no:** "No effect as Mage" is grey text; nothing on the chip, tab or roster |
| **Signature family** | template sheet, Equip (★ first card), Upgrade row, Battle, Party Hall "★ Pendant", preset row | **Gear › Equip** family card, or the preset (which also resets weapons) | **no:** "Wear a Bell" sits only inside the template sheet |
| **Her moon** (2 nodes) | template sheet's Moon line, Observatory (★ body, node sheets, Set list), Battle's ★ brackets | **Observatory** › Set a Moon Jewel II (Lv 16) / IV (Lv 36) | **partly:** jewels count in the Gear dot with every other jewel |
| **Trade** | template sheet, calling tiles, Work tab, Wilds picker order | follows the calling | — |

### 5.2 "Click an Uma, see all her uniqueness bonuses, pick what needs picking": the gaps

| # | Gap |
|---|---|
| U1 | **No single view with every bonus as label + number + state.** The template sheet gives the Flourish no number and the moon as one crammed line. It never says *why* her signature is a Bell (knack Fleet → Bell). |
| U2 | **The sheet is read-only.** It has no Wear Bell, no Set Moon Jewel II, no Fight as Brawler. Each fix is 3–5 taps away on another tab or place (§6.3), and the Observatory one doesn't come back. |
| U3 | **Only the calling flags itself.** An unworn signature, a moon node she can open now, or fighting outside her calling's class (Flourish off) shows no dot on the chip. |
| U4 | **The calling's alternative vanishes once confirmed.** The sheet says "← picked"; the other tile's template name and trade are gone. |
| U5 | **A locked Pace/Late outfit doesn't say it will have a pick.** Its Racing tab shows the suggested calling only. |
| U6 | **The Battle tab scatters it too:** the signature in Offense, the Flourish in Sustain, the moon as ★ inside the brackets. |
| U7 | **The calling card costs the first screen** (about 250 px at 390, tabs at 78%) and repeats one Flourish and, on Late picks, one trade on both tiles. |

---

## 6. Measured scroll and taps

### 6.1 Scroll per tab

Screens = the scroll height ÷ the visible height (683 px at 390×844, 506 at 375×667). Each count includes the
header above the tabs and the kit frame's 96 px of bottom padding (`ProfileFrame` `pb-24`). Eight Umas measured.

| Tab | 390×844, typical (5 Umas) | 390×844, calling card open (3) | 375×667 typical / card | Content below the tab bar, typical |
|---|---|---|---|---|
| Skills | **2.04–2.08** | **2.40–2.42** | 2.80 / 3.27 | 1,134 px |
| Battle | 1.58–1.65 | 1.87–2.01 | 2.21 / 2.78 | 827 px |
| Gear › Equip | 1.50–1.57 | 1.89–1.95 | 2.12 / 2.57 | 787 px |
| Gear › Upgrade | 1.73–1.77 | 2.10 | 2.39 / 2.87 | 923 px |
| Work | 1.00 (fits) | 1.13–1.22 | 1.08 / 1.60 | 399 px |
| Racing | 1.45–1.49 | 1.84–1.87 | 2.05 / 2.57 | 724 px |
| **Every tab end to end** | **9.5 screens** | **11.4** | 12.7 / 15.7 | — |

Also: locked profile 1.35; the Skills-alone route 1.18; the Observatory 1.16.

### 6.2 Header overhead

| | 390×844 | 375×667 |
|---|---|---|
| Tab bar starts at, typical | 284 px = **42%** of the first screen | 284 px = **56%** |
| With the calling card | 532 px = **78%** | 546 px = **108%**: the tab bar is below the fold |
| What stacks above the tabs | place header (kit) · "All outfits" · 112 px bust block · EXP bar + caption · [calling card] · summary row | |

### 6.3 Taps to common tasks

Counted from her profile, on another tab than the one needed (the last tab is remembered per device; the Gear view
resets to Equip each session). From the Hub to her profile: 3 (Stable → Enter Stable → face), or 2 from the top bar's
Uma Ticket chip.

| Task | Path | Taps | Notes |
|---|---|---|---|
| See her template | chip | **1** | read-only |
| Make her calling pick | tile → Confirm | **2** | only while open; above the tabs |
| Change her class | class cell (→ Skills) → class button → class | **3** | 2 from the Skills tab |
| Change a tree line | Skills → tree button → B square → Take branch B | **3–4** | 2 if already on that tree |
| Change a slot's weapon | Skills → tree button → Change → weapon | **3–4** | — |
| Equip a skill at 7/7 | Skills → an equipped slot (unequips at once) → tree button → node → Equip | **4–5** | equipped slots show marks only, no names |
| Raise a weapon grade | Gear → Upgrade → pill | **3** | the green mark on a Skills tree button only selects the tree |
| Raise to G6 at once | Gear → Upgrade → row → Up to G6 → Raise | **5** | — |
| Wear her signature family | Gear → (Equip) → family → (kind) → Equip | **3–5** | or the preset, 2, which also resets her weapons |
| Set a jewel (her moon) | Gear → Upgrade → Extra Stats → Set (→ which node) | **4–5** | leaves the profile; coming back is Town → Stable → Enter → face, **+4** (+2 by the Tier 1 ticket chip) |
| Seat her as a Learner | (no link when she has none) Hub: Learning → hall → Enter → + → find her | **5+** | — |
| Put her in a party (she has none) | Party cell (→ the party list) → a party → an empty slot → her | **4** | she must be found again in the picker |

### 6.4 Touch targets under 44 pt

| Target | Size | File:line |
|---|---|---|
| Template chip | 32 pt tall | `TC:24` (`min-h-8`) |
| Back to auto | 36 pt | `ST:144` (`min-h-9`) |
| Inheritance Bond row (a Learner's Heroes) | 19 pt | `OP:374` |

Type: 13 sizes from 8 to 15 px across the profile's files, 15 uses below 10 px (8 px ×2, 8.5 ×4, 9 ×1, 9.5 ×8).

---

## 7. What a redesign must keep

### 7.1 Actions (every one the profile has today)

| Area | Actions |
|---|---|
| Header | Target on/off (ten at most, its error); open the template; Unlock · 1 Ticket via the kit's confirm (locked); calling pick and Confirm (disabled while she works; at Lv 1 it moves her class) |
| Class | switch class, free, each class keeping its own weapons, lines and loadout |
| Weapons | per slot: any kind of the slot's channel, three different, swap within the channel |
| Trees | pick a tree; Take branch A/B (free, her equipped skills follow); open a node; Equip / Unequip a held node at an open depth; Back to auto |
| Gear | standard preset; accessory family and, for a Bell or Orb, the kind among her weapons'; raise one grade; raise up to G*n* with the item list and Cancel/Raise |
| Links | Extra Stats map, her hall(s), her party, her place, Skills from the party bar (`outfit/:id/skills`) and the Observatory deep link (`/learning/observatory/:id`) |

### 7.2 Data (shown today; the redesign can move it, not lose it)

| Area | Data |
|---|---|
| Identity | bust, name, title, rarity, Uma Level, EXP (and banked at max), unlock date |
| Class | active class and Class Rank; all six Class Ranks with bars; her hand (Arms × / Tome ×) |
| Skills | equipped count / slots by level, Auto state; each node's rank, next-rank Class Rank, gate, depth, line, skill line at her Skill Rank; held branch per tree; closed depths |
| Battle | every row of `umaBattleSheet`, always listed with 0s (combat-balance §6.0): totals with gear and Extra Stats parts and her moon's ★; Might per weapon; accessory; signature; Evasion; HP, Mends, MP and regen; Flourish; Limit start; five core stats |
| Gear | each weapon's grade and Might; armor half, each slot's grade and stat; accessory grade, family, kind, effect at grade, stale-kind warning; signature bonus; each raise's item, block reason or readiness; the upgrade count |
| Extra Stats | nodes open, jewels to set, totals |
| Template | name; calling, stride, knack and what each read; calling pick options, suggestion, confirm state; trade; Flourish and on/off; signature family, bonus, worn; moon I/II values and gates |
| Work | Craft Level, EXP, grade open and next gate; trade; current job, item, count, time, done |
| Halls | Hero seat or Heroes, Bond level, strength %, former Hero |
| Racing | aptitudes by surface, distance, style; racing base stats and growth; the racing unique |
| Marks | can-upgrade per tree button and per raise; the Gear dot; target |

### 7.3 Behaviors

- The last tab is remembered per device (`rpg.profile.tab.v2`). The Gear view is remembered per session.
- A locked outfit shows only its racing data and Unlock. One owned in another tier's world says "In Tier n". In a
  tier above 1 an unowned one points to Tier 1 (D5).
- Errors come from `SaveRuleError` messages ("Finish her work first", "No Greatsword in her slots", slots full).
- 44 pt targets and full accessible names on icon buttons (aria labels such as "Lance, branch B, can upgrade").
- The profile is a lazy chunk (the tree model reads the catalog); the main JS budget is 230 KB gzip (D56).

### 7.4 Constraints

- **Kit-drawn:** `ProfileFrame` (bust size, name, level, chips, tab bar), `Tabs`, `BottomSheet`, the (i) button and
  `UnlockConfirm` are uma-kit's. A new header or tab bar shape is a "Both apps:" request and a kit release
  ([change protocol](../../change-protocol.md)), not a fork here.
- **No rule or save change** is needed for any problem above. Every fix is screens and words.
- **Cleanup while there:** the v27-shape branches no live save reaches can go: `WeaponSheet`'s pieces and binds, the
  preset's bind confirm, `BattleTab`'s pre-v2 help, `WorkTab`'s pre-economy line.
- **The manual follows:** [sections § Stable](../../game/sections.md#stable) and [profile UX](../profile-ux.md)
  describe the screen as built; both change with the redesign.
