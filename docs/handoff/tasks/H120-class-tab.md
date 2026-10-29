# H120 — Uma profile v2 with Classes v3: the Class tab, the Classes sheet (the class tree), promotion and the Limit line

**uma-rpg · ChatGPT · M+ · Needs: H119 (the frame), H126 (Classes v3 in the domain, engine v19, dark), H129 (the Limit
Breaks' halls and power), H127 (the seven class emblems) · Unblocks: H123, H134 (the switch), H125's re-run**

## Why

The Class tab is where the owner changes how an Uma fights: her class, her three weapons, each tree's line, her equipped
skills and her Limit Break. The approved profile v2 (D239, UP10–UP12) redraws it on one grammar: the class and three
weapons as the first row, the selected tree below, the equipped row whose tap opens a sheet (never a blind unequip), and
a Limit line that replaces the Inheritance card. Classes v3 (D240, CV32) then turns its Class sheet into **the class
tree**, the owner's "visible in game, whenever I want to reclass": three roots, five Tier 0 classes over eight Tier 1
classes, each tile in the state language, the footer acting on the selection. It adds **the promotion sheet** at a Tier
0's Class Rank 10, **the Tier 0 tree** (one skill), **the promotion dot**, and **a door to the Exchange's Class
Manuals**. Halls v2 (D241) renames the halls her Limit line points at.

The packet has two halves that ship together:
- **Live after H119:** today's six classes in the new layout (the tab, every sheet, the Limit line). The Classes sheet
  draws the six as tiles with the same selection and footer it will have on the tree.
- **Inert until the switch (H134):** everything that only exists on engine v19 (Tier 0, the tree's columns and five
  states, promotion, the dot, the Halls v2 names and power). It reads the domain by generation, so the live game looks
  as above until H134 moves the engine; tests mock the switch to 19.

No rule or save change here: every action is one the domain already has or H126 adds (`chooseClass`, the line, equip,
the preset, promote).

## Context (read first)

- `CLAUDE.md`, `AGENTS.md`, [change-protocol.md](../../change-protocol.md) (nothing here changes uma-kit).
- **The profile v2 proposal** ([proposal.md](../../design/uma-profile-v2/proposal.md), D239):
  - §2.4 (one grammar), **§4.1 entire** (the Class tab: the drawing, the elements, the five sheets, the edge states,
    "what changed"), §5.5 (the dot rule), §6.3 (links out: the Limit sheet's hall);
  - §7.1 (C1–C10), **§7.2 (the wording list: Class Rank, gate, Equipped, Line, Skill rank, Depth, Bond, Hand,
    Standard preset, the actions)**, §7.3 (type: 22 · 17 · 14 · 12.5 · 11, nothing smaller), §7.4 (the six states);
  - §9 (G1–G5, V1–V3, **B2, B3, B4**), §10.2 (Class as drawn: 616 px under the tab bar, 1.35 screens; 1.82 at 375×667),
    §10.3 (change her class, change a line, equip at 7/7, seat her as a Learner), §12 (the Skills tab's rows, the Class
    sheet, the Inheritance card, the Class Ranks grid, Gear › Equip's preset);
  - §14: UP6, UP10, UP11, UP12, UP18, UP23, UP28, UP30, UP31. The
    [tabs page](../../design/uma-profile-v2/previews/tabs.html) draws the tab and its sheets at 390×844.
- **Classes v3** ([classes-v3.md](../../design/classes-v3/classes-v3.md), D240):
  - §0 (the thirteen by root, the Tier 1 table), §1 (the tree: three root columns, Tier 0 over Tier 1, the Arms child on
    the Warrior side, the Tome child on the Mage side), §2.1–§2.4 (Tier 0: names, the one skill, the 1–10 curve, any
    three weapons), **§2.6 (promotion: when, what opens, the waiting EXP, siblings, Suggested)**, §3 (each Tier 1 class's
    slots, defaults and hand), **§7 (reclassing R1–R6; R4's gate wording)**, **§14.1–§14.2 (what this packet builds)**;
  - §16: CV6, CV8, CV9, CV11, CV22, CV30, **CV32**, CV33.
  - The [promotion page](../../design/classes-v3/previews/promotion.html) draws, at 390×844, a Tier 0 Uma's tab, the
    promotion sheet, the Classes sheet with its five states and footers, and every Tier 0's promotion sheet; the
    [class tree page](../../design/classes-v3/previews/class-tree.html) the tree with each class's sheet.
- **Halls v2** ([halls-v2.md](../../design/classes-v3/halls-v2.md), D241): §2.1 (five halls by family, their names and
  place ids), §2.3 (home classes; any Uma in any seat), §3.1 (power = the Limit Break's own × her class's scale × her
  open depth; the Paladin and the Cleric 0.75), §6 (Bonds unchanged), §7.1 (seat ids: `healer-1` … `healer-4`); HV5,
  HV20, HV21.
- **The code on `main` at `b9ce7c5`** (no code changed since `6a6996f`, the base of H117–H125; H117, H119, H121 and H124
  change these files, so re-read them after they land). Paths under `apps/web/src/`:
  - `places/stable/SkillTree.tsx`: today's Skills tab (`handLine :26`, `rankText :31`, `nodeLine :36`, the help
    `:96–103`, the class button `:106–111`, the tree buttons `:113–128`, the Flourish line `:131–133`, the rank row
    `:134–137`, Equipped and Back to auto `:140–159` (`toggleEquip :76` unequips on a tap), "Change" `:167`, the tree
    `:170–200`, the Class sheet `:214–228`, `TreeNodeButton :277`, `SkillNodeSheet :298–323`, `BranchSheet :326–350`);
  - `places/stable/ClassPicker.tsx :7–21` (six tiles in two rows), `SkillsPage.tsx`, `WeaponSheet.tsx` (the slot's
    weapons by grade), `PresetButton.tsx` (H117 deletes its bind sheet; H121 decision 1 moves it to the top of the Class
    tab "until H120");
  - `places/stable/OutfitProfile.tsx`: `SkillsTab :313–339` and the Class Ranks grid `:318–335`, **`InheritanceCard
    :342–384`** (her seat, her Heroes, every Bond, "former Hero"; H124 decision 11 makes its rows push with `{ back: true
    }` until this packet);
  - H119's frame: the Class tab's skeleton (today's Skills content, the Inheritance card and the Class Ranks grid), and
    `places/stable/profile-tabs.ts` (`tabDots`, `firstDotTab`, `profileDoor`; nav state `{ back: true, list? }`);
  - `save/game.ts`: `pickClass :178`, `takeBranch :180`, `equip :192`, `wearPreset :317`, `readManual :292`;
    `album/upgrades.ts` (`umaUpgrades`, `withUpgrades`: the Stable's mark and Can upgrade facet);
  - `places/party-hall/healer-note.ts` (`healerNote`, over the domain's `healerBlock`);
  - `places/exchange/ExchangePage.tsx` (`ManualSheet :139–177`: a picker, then "Which bar?"); `places/registry.tsx`
    (`PageProps.rest`, the sub-route inside a place); `places/PlacePage.tsx` (Back pops an entry pushed with `{ back:
    true }`);
  - `battle/labels.tsx` (`CLASS_LABEL`, `CLASS_BLURB`, `skillLine`, `WeaponGlyph`, `KindMark`), `battle/pixel-icons.tsx`
    (`ClassEmblem :22`, a `class/{id}` frame of uma-art's `ui` atlas);
  - the domain: `rpg/tree-view.ts` (`rpgTreeView :41`: a tree a slot, the trunk and lines A/B), `save/battle.ts`
    (`chooseClass :90`), `economy/ranks.ts` (`classTrack`, `classRankOf`), `save/heroes.ts` (`heroSeatOf :14`, `parentsOf
    :18`), `rpg/hero-id.ts` (`HERO_HALLS`, `heroLimitClass`, `bondCapacity`), `rpg/battle/caps.ts` (the one switch) and
    `caps-at.fixture.ts` (`capsAt`).
  - **The precedent for an inert web test:** `places/stable/tree-view.test.tsx` (H70) mocks the domain's switch from the
    web: `vi.mock('../../../../../packages/domain/src/rpg/battle/caps', async (orig) => (await
    import('../../../../../packages/domain/src/rpg/battle/caps-at.fixture')).capsAt(19, await orig()))`, in a file of
    its own.
- **The packets this builds on** ([tasks/](.)); **where a name below differs from their merged code, theirs wins**:
  - **H126** ("Names other packets read"): `rpgRework('classes')`; `rpgClasses(19)`, `RPG_TIER0_CLASSES`, `rpgIsTier0`;
    `rpg/class-tree.ts`'s `RPG_ROOT_NAME`, `RPG_TIER0_ROOT`, `RPG_CLASS_PARENTS`, `RPG_CLASS_CHILDREN`,
    `rpgClassFamily`, `rpgSuggestedPromotion`, `RPG_TIER0_SKILL`, `RPG_TIER0_POWER`, **`rpgClassName(classId, engine)`**
    (the one source of player-facing class names: "Arms Spellblade" from v19, "Spell Blade" before) and
    `rpgClassGate`; `save/class.ts`'s **`umaClassTree(uma, outfit, tier, engine)`** (one tile a class of her world, with
    its state `on` · `available` · `ready` · `open` · `closed`, `rank`, `waiting`, `gate`, `suggested`),
    `umaHeldClasses` and `activeClass(outfit, uma, tier, engine)`; `save/battle.ts`'s **`promoteUma(save, outfitId,
    from, to, now, tier)`** and **`promotionPlan(uma, from, to, engine)`** (`{ from, to, rank, exp, waiting, depths,
    skills, block }`); `rpgTreeView`'s Tier 0 trees of one node (`root.tier`, the node's `rank` = her Class Rank,
    `nextRankAt`; its name the skill alone, "Drill Strike", the screen adding the weapon); `grantClassTrack`,
    `RPG_TIER0_BANK`; H126 decision 6 (screens inert; the local switch).
  - **H127** (the seven emblems, `class/recruit` …; until they land `ClassEmblem` falls back to the model's, H126);
    **H129** (Halls v2's twenty: a seat's hall, each Limit Break's power, the class scale, the class → hall map by
    generation; its "Decisions made" names them); H130 (save v32: a held Tier 1 class is one with a track).
- **The manual:** [sections § Stable](../../game/sections.md#stable) (the Class tab as H119 left it),
  [classes](../../game/classes.md) (classes, lines, ranks), [heroes](../../game/heroes.md) (Bonds);
  [phone-check.md](../../testing/phone-check.md) (the profile's steps).

## Decisions made

### From the designs, exact

**The tab** (UP10, §4.1; CV32 §14.1), top to bottom:

| Element | Shows | Tap |
|---|---|---|
| **Class tile** (first row) | Emblem, name, a thin Class Rank bar; `R34` (Tier 1); a Tier 0 `R7/10` with the bar to 10; **a Tier 0 at R10 with a child she doesn't hold: the Ready dot and `R10 · Promote`** | The **promotion sheet** while a promotion waits; else the **Classes sheet** |
| **Weapon tiles ×3** (first row) | Glyph and its line letter (`A`/`B`); a Tier 0's carry no letter (no fork) | Shows that tree below (Selected ring) |
| **(i)** (first row) | The tab's rules, one a line (decision 13) | — |
| **Equipped** | `Equipped 7/7`, one square a slot her level gives (3 → 7), kind marks and rank badge, empty ones dashed; **Auto**, a 44 pt chip, On while the game picks | A square: its **node sheet** (never an unequip); Auto while Off: back to auto |
| **Tree header** | `Lance tree` and **Change ›** | The **weapon sheet** |
| **The tree** (Tier 1) | Trunk (depths 1–2), the line squares A/B the size of a node, lines to depth 5; held line On, the other Off; closed depths faded with `R20` … `R40` | A node: **node sheet**; a square: **line sheet** |
| **The tree** (Tier 0, CV §14.1) | One node: `Drill Strike · Greatsword`, its rank badge = her Class Rank, its skill line; under it `Promotion at R10 · 3 to go` with a bar to 10; at R10 `Promotion · +400 EXP waiting` (44 pt, opens the promotion sheet); no line squares | The node: its node sheet |
| **Limit line** | `{Limit Break} · Learner · Bond 2/10`, `{Limit Break} · Hero`, or `None`; a second Hero adds ` · +1` | The **Limit sheet** |

**The sheets:**

| Sheet | Detail | Choices | Footer |
|---|---|---|---|
| **Classes** (the class tree, CV32) | v19: three root columns, `Warrior` · `All-Rounder` · `Mage`, rows `Tier 0` and `Tier 1`, as the promotion page draws them (below). v18: the six classes in two rows of three. Each tile: emblem, name, its state's word. Under the tiles, **one line for the selection**: its name and state, `{slots} · {role}` with its three default weapons (a Tier 0: `Any 3 weapons · {skill}` and `Promotes to {A}, {B}, {C}`), and `Hand · …`. `Party 1: 2 healers` in the warning colour when the selected class is a healer and her party already fights with one. Then the row **`Class Manuals ›`** (`Exchange`, faint) | Tap a tile: it is Selected (2 px ring); the footer follows | By the selection's state (below) |
| **Promotion** (`Promote · Recruit R10`, CV §14.2) | `Free · the others stay open`; one tile a child: emblem, name, `Suggested` or `Held`, its slots, its three defaults, its role (**a row the same on every tile is left out**); before → after: `Recruit R10 → Brawler R10` at 22 px, then `Depths 1–2 · 6 skills · +400 EXP`; a row **`Classes ›`** | Tap a tile: Selected; on a Held child the footer is `Fight as …` | **Promote to Brawler** (free, no confirm) |
| **Weapon** (`Slot 3 · Arms`; a Tier 0's `Slot 3 · Any`) | The slot's kinds, one row each: `Axe · G6 · Might 26`, then `Held` or `Slot 2`; a Tier 0's: all ten, Arms first | Tap a weapon: she holds it (one in another slot swaps) | — |
| **Line** (`Lance · Line B · Impale`) | Its three skills: name, `Depth 3 · R20`, its skill line | — | **Take line B** (free; equipped skills follow), or `Held` disabled |
| **Node** (the skill's name) | Five rank pips (none on a Tier 0 node), `Rank 3 · next R36`, `Depth 4 · Line B` (`Trunk`), its skill line | — | **Equip** · **Unequip** · at a full loadout **Replace**: the equipped skills listed by name, a tap swaps · on the other line **Take line A** · closed `Opens · R40` disabled |
| **Limit** (her Limit Break's name) | One block a Limit Break she casts: `Learner · Warrior Dojo · Seat 2` (`Hero · …`), `Bond 2/10 · Strength 60%` (a Hero `Hero · Strength 100%`), `Next · 3/10`, `Hero · Uma F`; v19 adds `Power · ×2.9` (her class's scale when not 1: `×2.9 · ×0.75 as Paladin`); then her other Bonds, one row each, `{Limit Break} · Bond 4/10` | With two blocks, tap one: Selected; the footer follows | **Open {hall}** (pushes; Back returns here); with none, her class's hall |

**The Classes sheet's tree** (v19; the promotion page's grid, five columns at 390 and 375):

| | Warrior | All-Rounder | | | Mage |
|---|---|---|---|---|---|
| **Tier 0** | Recruit | Duelist | Acolyte | Caller | Apprentice |
| **Tier 1** | Brawler | Arms Spellblade | Paladin | Arms Summoner | Sorcerer |
| | — | Tome Spellblade | Cleric | Tome Summoner | — |

**Five states** (UP23, CV32), one look and one footer each:

| State | Which tile | Tile reads | Look | Footer |
|---|---|---|---|---|
| **On** | Her active class | `R34` (`R7/10`) | Accent fill | **Standard preset** (`Greatsword · Axe · Lance · ★ Bell` under it); `Standard preset · On` disabled when matched |
| **Available** | A class she holds (a Tier 0 she started; a Tier 1 class she promoted into) | `R12` (`R4/10`) | Raised | **Fight as Arms Spellblade** (free) |
| **Ready** | A child she doesn't hold of a Tier 0 she holds at R10 | `Ready` | 6 px green dot | **Promote to Arms Summoner**: closes this sheet and opens the promotion sheet on that child |
| **Open** | A Tier 0 she hasn't started | `R1 · free` | Dashed outline | **Start Caller · R1** (free) |
| **Closed** | Any other Tier 1 class | `Closed` | 40% | Disabled: `Opens with Duelist R10 or Apprentice R10` (R4) |

On v18 a tile is On or Available, nothing else. **In a Tier 2 or Tier 3 world** (R6, CV10): no Tier 0 row, no
promotion and no dot; a Tier 1 class she doesn't hold is **Open** (`R1 · free`, footer **Start Brawler · R1**).

- **Suggested** (CV11): Recruit → Brawler; Apprentice → Sorcerer; Duelist and Caller → the Arms child with Power over Wit,
  the Tome child otherwise; Acolyte → the Paladin with Power over Wit, the Cleric otherwise. The promotion sheet opens on
  the Suggested child unless it was opened from a Ready tile (that child).
- **Promotion** (CV8): free, closes nothing; the child opens at R10 with its defaults; the waiting EXP lands in it at
  once; she fights as it. **The dot** (CV §14.1, UP18): on the Class tab while she **fights as** a Tier 0 at R10 with a
  child she doesn't hold; never once she fights as a Tier 1 class.
- **The Manuals door** (CV32, UP30): no spending in the profile; the row opens the Exchange's Manual sheet with her
  picked, and Back returns to her Class tab with the Classes sheet open.
- **Budgets:** **B2** Class ≤ 1.4 screens at 390×844 (1.35 as drawn), for a Tier 1 Uma and a Tier 0 one; **B3** every
  sheet above without scrolling at 390×844; **B4** (§10.3, amended in decision 2): change her class **4**, change a line
  3–4, equip at 7/7 **4**, promote **3**, seat her as a Learner 5.

### Build decisions (log them in the D-row)

1. **One component a sheet, two generations.** Every element reads the domain by generation, so the v18 and v19 layouts
   are the same code: the Classes sheet's model returns six tiles in two rows on v18 and the tree on v19 (`rpgRework`'s
   `classes` stage, H126); a Tier 0 tile, a Ready tile, the dot and the one-node tree appear only when the data has a
   Tier 0, which no v18 save does. *Why:* the switch is one constant (CV31); nothing to remove at H134.
2. **Conflicts between the designs, settled** (the later approval wins where they differ):
   - **A Classes sheet tap selects; the footer acts** (CV32), where UP6 applied a free class change on tap: the tree has
     five states and a tap on a Ready, Open or Closed tile can't act. The v18 sheet does the same, so the sheet doesn't
     change behaviour at the switch. **B4's "change her class" becomes 4 taps** (Class → class tile → tile → Fight as),
     from 3; H125's re-run checks 4.
   - **G4 (never a sheet on a sheet):** the Ready tile's **Promote to …** and the promotion sheet's **Classes ›** *swap*
     one sheet for the other (the first closes, the second opens); two sheets are never open at once.
   - **G5 (a sheet stays open after its action):** the promotion sheet **closes** after Promote and the tab redraws on
     the new class's first tree (CV §14.2's "after"); every other sheet here stays open on its new state.
   - **The class tile at a promotion** opens the promotion sheet (CV §14.2); its `Classes ›` row reaches the tree, so the
     tree is never out of reach.
   - **The promotion sheet's caption** is `Free · the others stay open`: CV §14.2's "Choose her class. Free; the others
     stay open." is a sentence with "her" (C2; the copy test fails it).
   - **The tile's role** shows only where siblings differ (the TC:76–77 rule, as H117 decision 7): Duelist's and
     Caller's children share theirs, so those sheets show slots and defaults only.
3. **`places/stable/class-view.ts`** (pure, tested) is the one home for the tab's rules, **on H126's data, never
   re-deriving a rule**: `classTile(outfit, uma, tier)`; `classesSheet(outfit, uma, world, tier, selected)` lays
   `umaClassTree`'s tiles into the grid (v19) or two rows of three (v18: every tile `on` or `available`), with each
   state's word, the selection's line, the healer note (`healerNote` run as if she fought as the selected class), and the
   footer's label, action and gate (`tile.gate`); `promotionSheet(outfit, uma, from, selected)` (the children from
   `RPG_CLASS_CHILDREN`, `tile.suggested`, Held from `umaHeldClasses`, the rows that differ, and before → after from
   `promotionPlan`: its `rank`, `depths`, `skills` and `waiting`); `tier0Tree(...)`; `limitView(world, outfitId,
   classId)` (blocks, other Bonds, the hall, v19's power); `classDot(outfit, uma, tier)` (her active class `rpgIsTier0`
   with a `ready` child in `umaClassTree`). Names through `rpgClassName`, roots through `RPG_ROOT_NAME`. Components only
   draw what it returns.
4. **The promotion's parent.** The sheet's Tier 0 (its title, its children, its waiting EXP) is the one she fights as
   when it is a Tier 0; from a Ready tile with two parents at R10, the parent she fights as if it is one, else the first
   in `RPG_TIER0_CLASSES`' order (Recruit, Duelist, Acolyte, Caller, Apprentice). The action is H126's `promoteUma`
   through a new `save/game.ts` wrapper, `promoteClass(outfitId, from, to)` (the `pickClass` pattern); its refusals
   (`promotionPlan`'s `block`) show in the sheet.
5. **The Exchange door** is a route, shared with H132 word for word: **`/town/exchange/manual/:outfitId`** opens the
   Exchange with its Manual sheet open on that Uma (no picker); **`/town/exchange/manual`** opens it on the picker.
   `ExchangePage` takes `PageProps` and reads `rest`; closing the sheet replaces the URL with `/town/exchange`, keeping
   the navigation state, so the place header's Back still returns to the door. **Whichever of H120 and H132 lands first
   adds the route; the second keeps it.** The door pushes with `{ back: true }`.
6. **Back to the open Classes sheet:** before pushing the Exchange, the door replaces the profile's entry with its state
   plus `sheet: 'classes'`; the profile opens the Classes sheet when it reads `sheet: 'classes'` and replaces it away.
   `profile-tabs.ts`'s nav state becomes `{ back: true, list?, sheet? }` (H119 decision 4's one shape, extended).
7. **The standard preset** is the Classes sheet's footer on her active class (`wearPreset`, H117's wording); the
   interim row H121 put at the top of the Class tab goes. **If this packet lands before H121**, there is no interim row
   to remove, and H121's decision 1 is moot: say so in H121's thread (the main session updates the packet).
8. **Dots:** `classDot` joins H119's `tabDots` (`dotLabel` "Class, ready"); `firstDotTab` becomes Class, Gear, Stars,
   Template; `withUpgrades` sets the Stable's `upgrade` facet when `upgrades.any` **or** `classDot`, so the roster's mark
   and the Can upgrade filter agree with the tab.
9. **The Limit line** shows the Limit Break Auto fires (a Hero's own; a Learner's strongest Bond, ties in seat order);
   the sheet lists every Limit Break she casts and then **every other Bond she has** (today's "former Hero" rows), so
   nothing the Inheritance card showed is lost. **Its hall** uses H129's hall-based names, never `HERO_HALLS`,
   `hallClass` or `heroLimitClass` (H134 drops them): her seat's `heroLimitHall(id)` → `HERO_HALL_PLACES` → the place's
   name; with no seat, **her class's hall**, `classHall(classId)` in `class-view.ts`: v18 the hall named after her class;
   v19 the hall holding a seat whose `heroSeatHome` is her class (a Tier 0 reads its `RPG_TIER0_MODEL`'s: Recruit the
   Warrior Dojo, Duelist the Spell Blade Salle, Acolyte the Healer Sanctum, Caller the Summoner Circle, Apprentice the
   Mage Tower, as Halls v2 §2.1 pairs them). **Power** is v19's only: `limit.power`, and her active class's
   `heroLimitScale` when it isn't 1.
10. **The Tier 0 node sheet** uses the wording list as it is: `Rank 7 · next R8` (her Class Rank is the skill's rank),
    no pips, `Depth 1 · Trunk`, its skill line from `skillLine`; Equip and Unequip as any node.
11. **New wording facts go into `copy.ts` first** (C3), each with its copy-test example:

    | Fact | Wording | Example |
    |---|---|---|
    | Tier 0 rank | `R{n}/10` | R7/10 |
    | Class tile at a promotion | `R10 · Promote` | — |
    | Promotion line | `Promotion at R10 · {k} to go`; at R10 `Promotion · +{n} EXP waiting` (no waiting EXP: `Promotion · Ready`) | Promotion at R10 · 3 to go |
    | Waiting EXP | `+{n} EXP waiting` (shared with H132) | +17,400 EXP waiting |
    | Tree tile | `R{n}` · `R{n}/10` · `Ready` · `R1 · free` · `Closed` | — |
    | Class gate | `Opens with {A} R10` · `Opens with {A} R10 or {B} R10` | Opens with Recruit R10 or Caller R10 |
    | Roots and rows | `Warrior` · `All-Rounder` · `Mage`; `Tier 0` · `Tier 1` | — |
    | Slots | `3 Arms` · `3 Tomes` · `2 Arms + 1 Tome` · `2 Tomes + 1 Arm` · `Any 3 weapons` | — |
    | Role | Brawler `One act ×1` · Sorcerer `One cast ×1` · both Spellblades `Multi-hit` · both Summoners `Area · lingers` · Paladin `Healer · ATK` · Cleric `Healer · M.ATK` | — |
    | Promotes to | `Promotes to {A}, {B}, {C}` | — |
    | Promotion before → after | `{Tier 0} R10 → {class} R{n}`; `Depths 1–{d} · {s} skills · +{n} EXP` | Recruit R10 → Brawler R10 |
    | Badges | `Suggested` · `Held` | — |
    | Caption | `Free · the others stay open` | — |
    | Healer note | `Party {n}: 2 healers` | Party 1: 2 healers |
    | Limit line | `{Limit Break} · Learner · Bond {n}/10` · `{Limit Break} · Hero` · `None`; ` · +1` | — |
    | Limit seat | `{Hero/Learner} · {hall} · Seat {n}` | Learner · Warrior Dojo · Seat 2 |
    | Limit power | `×{p}`; `×{p} · ×{s} as {class}` (shared with H133's `×{p}`) | ×2.9 · ×0.75 as Paladin |
    | Doors and rows | `Class Manuals` (`Exchange`) · `Classes` | — |
    | Actions | `Promote to {class}` · `Fight as {class}` · `Start {Tier 0} · R1` · `Open {hall}` | — |

    The copy test's name lists read `rpgClassName` over `rpgClasses(19)` and `rpgClasses(18)`, `RPG_ROOT_NAME`,
    `RPG_TIER0_SKILL` and the hall names, so names don't count as words.
12. **No green but Ready** (UP23): the class tile's bar and the promotion line's bar are in the accent; the Ready dot is
    the only green.
13. **The (i)** on the first row (UP31), one rule a line: "Switching class is free; each class keeps its own weapons,
    lines and skills." · "One healer a party: a Paladin or a Cleric." · "Depths open at R1, R10, R20, R30 and R40." ·
    "A skill gains a rank every 2 Class Ranks, up to 5." · "Uma Level sets how many skills she equips; Auto picks until
    you do." v19 adds: "Tier 0: Class Rank 1–10, one skill, any three weapons." · "At R10 each of its classes opens at
    R10, free; the others stay open." · "EXP past R10 waits for the promotion." · "Another family's class opens through
    its Tier 0 at R10." Check each against H126's rules before writing it.
14. **Removed:** `ClassPicker.tsx`, `SkillsPage.tsx` (H124 retired the Skills-alone route; H119's skeleton was its last
    user), today's `SkillTree.tsx` body
    (rebuilt as the tab's files), `InheritanceCard`, the Class Ranks grid (every rank is on its tile), H117's interim
    `flourishChip` (the Flourish lives on Template, H123) and `Slots full · 7/7` (Replace instead), `toggleEquip`'s
    blind unequip.
15. **Layout at 375:** five tree columns of about 62 px; a two-word name wraps at its space (`Arms` / `Spellblade`),
    never truncates; tiles at least 44 pt tall (64 as drawn); text at 11 px at the least.
16. **Bundle:** the tab, its sheets and `class-view.ts` are in the Stable's lazy chunks; the Exchange route is a few
    bytes in its lazy page. Expected main JS change: 0 (the tab and dots change lazy code; `album/upgrades.ts` is lazy).
17. **Your ports:** API 8092, web 5185, so this packet can run beside H121–H124 (8091/5184), H132 (8093/5186) and H133
    (8094/5187).

## Do

1. **`class-view.ts`** (decisions 3, 4, 9) and its tests; the new facts in `copy.ts` (decision 11).
2. **The tab:** the first row (class tile, weapon tiles, (i)), the equipped row and Auto, the tree header, the Tier 1
   tree and the Tier 0 tree, the Limit line. Rebuild `SkillTree.tsx` as `ClassTab.tsx` and one file per sheet (or one
   `class-sheets.tsx`), 44 pt for every target, the type scale and the six states.
3. **The sheets:** Classes (both generations), promotion, weapon (a Tier 0's ten), line, node (Replace at a full
   loadout), Limit. The swaps of decision 2; the preset footer (decision 7); the Manuals door and Back to the open sheet
   (decisions 5, 6), with the Exchange route if H132 hasn't added it.
4. **Dots:** `classDot` into `tabDots`, `firstDotTab`'s order and `withUpgrades` (decision 8).
5. **Delete** what decision 14 lists; replace the skeleton's Class tab body.
6. **Tests:**
   - `places/stable/class-view.test.ts` (live, v18): the class tile `R34`; the Classes sheet's six tiles in two rows, On
     and Available only, no roots; the footer for her class (`Standard preset`, and `Standard preset · On` matched) and
     for another (`Fight as Mage`); the healer note when a Cleric selects Paladin with a Paladin in Party 1; `limitView`
     for a Hero, a Learner under one Hero and under two (the strongest first, ` · +1`), none (her class's hall), and a
     former Hero's Bond listed; `classDot` false; `firstDotTab` with Class first.
   - `places/stable/class-view.v19.test.ts` (the switch mocked to 19 with `capsAt`): the tree's rows and columns in the
     order above; **Uma C** of the promotion page (Brawler R34 On, Arms Spellblade R12 held, Recruit at R10, an Acolyte
     started at R4): Brawler On, Arms Spellblade Available, **Arms Summoner Ready**, Acolyte Available `R4/10`, Duelist
     Open `R1 · free`, Tome Spellblade Closed `Opens with Duelist R10 or Apprentice R10`; each state's footer label;
     a Tier 0 tile `R7/10` and at R10 `R10 · Promote`; `promotionSheet` for each Tier 0 (its children; Suggested with a
     Power-over-Wit outfit and a Wit-over-Power one; `Held` on a held child; the role row left out for the Duelist's and
     the Caller's); before → after with 0 and with 17,400 EXP waiting (the rank after it lands, its depths and skills);
     `Promotion at R10 · 3 to go`; `classDot` true for a Tier 0 at R10 with an unheld child, false holding every child,
     false as a Tier 1 class; `limitView`'s hall `Warrior Dojo` for a Brawler with no seat, `Healer Sanctum · Seat 3` for
     a `healer-3` Learner, and `×2.9 · ×0.75 as Paladin`.
   - `places/stable/ClassTab.test.tsx` (live, on `albumFixture`, the real store with a test save): an equipped square
     opens its node sheet and nothing unequips; at 7/7 a held node's Replace swaps (`equip` with the new loadout); Auto
     returns to auto; a line square's Take line B calls `takeBranch`; the Classes sheet: select Mage → `Fight as Mage` →
     `pickClass`, the sheet stays open with Mage On; `Standard preset` calls `wearPreset`; `Class Manuals` pushes
     `/town/exchange/manual/:id` with `{ back: true }`, and Back lands on the Class tab with the Classes sheet open; the
     Limit sheet's `Open {hall}` pushes with `{ back: true }`.
   - `places/stable/ClassTab.v19.test.tsx` (mocked to 19): a Tier 0 tab (one node, no line squares, the promotion line,
     no letters on the weapon tiles; the weapon sheet lists ten); a Tier 0 at R10: the tab's dot, the tile opens the
     promotion sheet, Promote calls the promotion action and the sheet closes on the new class's tree; the Classes
     sheet's Ready tile swaps to the promotion sheet on that child, and `Classes ›` swaps back; `Start Caller · R1` calls
     `pickClass(…, 'caller')`.
   - `exchange`: `/town/exchange/manual/81001` opens the Manual sheet on that Uma (if this packet adds the route).
   - H117's copy test passes, with this packet's `.tsx` files in its JSX list.
7. **Measure** at 390×844 and 375×667, light and dark, with H119's snippet (`screens` for the tab; a sheet open: its
   body fits without scrolling), on a Tier 1 Uma like §4's Uma A (Lv 40, Brawler R34, a Learner) and, with the switch
   flipped locally (step 9), a Tier 0 at R7 and one at R10. Count B4's taps. Record every number in the pull request. If
   the tab is over 1.4, tighten gaps before touching content.
8. **Docs:** sections.md § Stable's Class tab (both generations: the v19 rows under a "From the switch (H134)" line, as
   the manual marks dark work), classes.md where it names the Skills tab or the Class sheet, phone-check.md's Class
   steps; `pnpm docs:update`.
9. **Check it locally** in a desktop browser at 390×844 and 375×667, light and dark, never the iOS Simulator, on your own
   ports (API `AUTH_MODE=disabled PORT=8092 LOCAL_SAVE_FILE=.data/scratch-h120.json`, web on 5185 with
   `API_PROXY_TARGET=http://localhost:8092`), on a scratch save (several Umas: a Brawler at R34 who also holds a Mage,
   a Learner under two Heroes with a former Hero's Bond, a Hero, a Paladin in a party with a Cleric, one at Lv 1). Then
   **flip the switch locally** (H134's three lines, H126 decision 6: `caps.ts` 19, `version.ts` 32, `migrateWorld`
   chaining `toV32`), restart, let the scratch save migrate, and walk a Tier 0 at R7, one at R10 (read Class
   Manuals at the Exchange to get there), the promotion, a sibling's promotion, a reclass to another family's Tier 0,
   the Manuals door and Back. **Revert the flip before you commit** (`git diff` lists only this packet's files).
10. **Log the D-row** (fetch `main` first): "H120: the profile's Class tab with Classes v3's tree and promotion", with
    decisions 1–17 and the measured numbers.

## Done when

- [ ] `pnpm lint && pnpm test && pnpm build` pass. Say the main JS number (gzip, of 230 KB; about 223.5 before the
  profile packets) and this packet's change (0 expected); the tab and its sheets are in lazy chunks.
- [ ] The tests in step 6 pass, the v19 ones with the switch mocked; **the copy test passes**; every new fact is in the
  wording list.
- [ ] **B2, B3 and B4 measured and met** at 390×844 (375×667 reported), for a Tier 1 Uma on the live engine and a Tier
  0 Uma on the local flip; the numbers in the pull request.
- [ ] Nothing the Skills tab, the Class sheet, the Inheritance card or the Class Ranks grid showed is lost (tick §12's
  rows in the pull request): every rank on its tile, every Bond in the Limit sheet, the hand, the preset.
- [ ] On the live engine the tab shows the six classes and no Tier 0, tree column, promotion or dot (the live tests and
  the local check say so).
- [ ] `pnpm docs:update` leaves no diff; the manual and the phone check describe the tab.
- [ ] The local check in step 9 was done at both sizes, light and dark, on a scratch save, on both generations, and
  described; the flip is reverted. Nothing from the original games in git (`git status`).
- [ ] Deployed green (`gh run watch <id> -R luismlorenzana/uma-rpg --exit-status`) and
  https://uma-rpg.web.app/api/health shows the merge commit.

## Deliver

- **ChatGPT:** a branch `feat/h120-class-tab` in a worktree outside `~/workspace` (AGENTS.md), and a pull request,
  "feat(web): the profile's Class tab, the class tree and promotion, v19 parts inert (H120)", the body saying why
  (D239 UP10–UP12, D240 CV32, D241) with the measurements and the conflicts settled in decision 2. Fetch `main` before
  you push so the D-number is free. Merge it yourself when the checks and CI are green, and watch the deploy (rerun the
  web job on Vitest's `Timeout calling "onTaskUpdate"`).
- **Flag it done:** delete this file, add a Done row in [README.md](../README.md) with the merge commit, set H123 to
  Ready when H121 and H122 are done too, and say in the delivery that the class row and the tree columns sit near the
  screen's edges, so the owner checks them on the phone after the switch.
