# H123 — Uma profile v2 with Classes v3: the Template tab, her uniqueness in one place, no calling pick

**uma-rpg · Claude · S–M · Needs: H120 (the Class tab), H121 (its accessory sheet), H122 (its node sheet) · Unblocks:
H125's re-run**

## Why

The owner asked to "click on an Uma and see all of their uniqueness bonuses, as well as picking anything that needs to
be picked". The approved profile v2 (D239, UP16–UP19) gives her uniqueness one tab: her template's name, the three
readings with what they read, her calling and trade, every ★ piece as a label, a number and a state that opens the sheet
where it changes, and her racing aptitudes as the template's sources. Classes v3 (D240, CV19, CV21, CV32) then **removes
the calling pick** (the calling is read from her running styles; the promotion is where she chooses), so this packet
builds §5 without the pick tiles and confirm sheet, and with v3's pieces: the Flourish that works as any class of her
Tier 0 family, her moon's node II by her calling's root, 15 template types.

H119 left this tab as a skeleton (the old template sheet inline, the calling card while a pick is open, the Racing tab's
chips). This packet rebuilds it. **Live after H120–H122** on engine v18; the v19 pieces come from the domain by
generation and stay **inert until the switch** (H134). On v18 an open calling pick keeps H119's interim calling card
until the switch retires the pick; no new pick screen is built.

No rule or save change beyond decision 6's dot reason. Screens and words.

## Context (read first)

- `CLAUDE.md`, `AGENTS.md`.
- **The profile v2 proposal** ([proposal.md](../../design/uma-profile-v2/proposal.md), D239): **§5 entire** (§5.1 the
  gaps U1–U7, **§5.2 the tab top to bottom**, **§5.3 every piece: number, states, sheet, action**, §5.4 every pick (all
  but the calling's), **§5.5 the dot rule**, §5.6 four Umas), §2.4 (the grammar), §3.4 (locked and elsewhere), §7.1–§7.4
  (C1–C10, **the wording list's Reading, Trade, Signature, Flourish, Her moon, Unlock**, type, states), §9 (G1–G5,
  **B2, B3, B4**), §10.2 (Template as drawn: 590 px under the tab bar, 1.31 screens; 1.77 at 375×667), §10.3 (wear
  her signature 3, fight as her calling 3, her moon's jewel 3), §12's Racing rows, §14 UP16–UP19, UP23, UP28, UP29. The
  [Template page](../../design/uma-profile-v2/previews/template-tab.html) draws four Umas, every piece and state, and the
  dot rule.
- **Classes v3** ([classes-v3.md](../../design/classes-v3/classes-v3.md), D240): **§5** (the calling by styles, four
  rows, no pick), §6 (one trade a Tier 0), **§9 (templates: 5 × 3, the Healer's three names, the Flourish as any class
  of her Tier 0 family, moon II by root)**, **§14.4 (what this packet changes)**; CV19, CV20, CV21, CV32. The
  [promotion page](../../design/classes-v3/previews/promotion.html)'s last table lists H123's changes.
- **The code on `main` at `b9ce7c5`** (no code changed since `6a6996f`; H117, H119, H120, H121 and H122 change these
  files: re-read them). Paths under `apps/web/src/`:
  - `places/stable/template-view.ts`: `callingSources :38` (reads Power and Wit on rows 4–5), `strideSource :50`,
    `knackSource :57`, `rootFlourish :74`, `templateCard :89–115` (the readings, the Flourish, the signature, the moon
    line; `defense :104` picks moon II's stat by calling), `callingCard :143–156`, `templateTrade :159`;
  - `places/stable/TemplateCard.tsx` (the chip's sheet `:28–46`, `CallingCard :52–88`); H119's Template skeleton;
  - `places/stable/OutfitProfile.tsx`: `RacingTab :467–528` (the aptitude groups `:476–480`, the racing skill loaded with
    `loadSkills` and `skillText` `:469–474`), `GradeChip :65`;
  - H121's exported `AccessorySheet` (decision 10) and H122's exported `NodeSheet` (decision 5): the ★ rows open them
    (§5.3, "one component, two doors");
  - H119's `places/stable/profile-tabs.ts` (`tabDots`, `firstDotTab`) as H120 extended it (the Class dot);
    `album/upgrades.ts` (`umaUpgrades`, `withUpgrades`); the domain's `save/upgrades.ts :78–106` (`upgradesFor`; the
    accessory reason `:95–97` counts a slot at G1+ with no family), `economy/accessories.ts` (`signatureWorn :75`,
    `signatureBonus`), `economy/planet.ts` (`mapNodeGate :59`, `nodePoints :79`, `moonTemplate :98`),
    `roster/template.ts` (`umaCallingRow :108`, `umaCallingPick :143`, `umaTemplate :168`), `economy/professions.ts`
    (`tradeOfCalling :75`);
  - `save/game.ts` (`pickClass :178`).
- **H126** (merged; its Done row is in [the archive](../../archive/handoff-history.md); **where a name below differs from the merged code, the code wins**):
  `rpgRework('classes')`; `roster/template.ts`'s `umaCalling(outfit, pick, engine)`, `umaTemplate(outfit, pick,
  engine)` (15 types from v19), `umaFlourishActive(t, classId, engine)` (on as any class of her Tier 0's family),
  `umaCallingRowV3` and `UMA_ROW_CALLING_V3` (the styles-only rows), and `umaCallingPick` returning null from v19 (the
  pick retired); `economy/planet.ts`'s `moonTemplate(outfit, pick, engine)` with `channel: 'both'` (⌊8 ÷ 2⌋ on DEF, the
  rest on M.DEF); `economy/professions.ts`'s `umaTrade(outfit, pick, engine)`; `rpg/class-tree.ts`'s
  `rpgClassFamily(tier0)`, `rpgClassName(classId, engine)` (every class name on screen) and `RPG_TIER0_CLASSES`;
  `save/class.ts`'s `umaHeldClasses` and `activeClass(outfit, uma, tier, engine)`. **H130** makes `OwnedUma.calling`
  optional (absent from v32) and routes every read through `umaPick(uma)`: read the pick that way. H120's packet for the
  Class tab's words (`Fight as …`, `Start … · R1`).
- **The manual:** [sections § Stable](../../game/sections.md#stable) (the Template tab as H119 left it),
  [classes § Her calling and her template](../../game/classes.md#her-calling-and-her-template);
  [phone-check.md](../../testing/phone-check.md) (the profile's steps).

## Decisions made

### From the designs, exact

**The tab** (§5.2 without the pick, §14.4), top to bottom:

| Row | Reads (v18) | Reads (v19) | Tap |
|---|---|---|---|
| **Name** (first row, 22 px, ★ in the accent) and (i) | `★ Fleet Bruiser` | `★ Fleet Charger` (15 types) | — |
| **Readings**, three tiles: value, then `from {source}` | Calling `Brawler · from Front A` (a Pace or Late row adds its Power and Wit, as H117 wrote it); Stride `Middle · from Medium A`; Knack `Fleet · from Speed +20% · Bell` (the knack names her signature family) | Calling `Warrior · from Front A`; **styles only** (every style at her top grade: `from Pace A · Late A`) | — |
| **Calling** and her trade, one row | `Calling · Brawler · fixed` · `Mine · Weapon Forge`; a confirmed pick `Calling · Mage · Picked` | **Always** `Calling · Warrior · fixed` · `Mine · Weapon Forge` | — (her place is the header's Work cell) |
| **★ Flourish** | `★ Flourish · Even pace · 1%/round · max 4% · On`; `Off · as Mage` (faint, never a dot) | On as **any class of her Tier 0 family**; `Off · as Sorcerer` | **Flourish sheet** |
| **★ Signature** | `★ Signature · ATK/M.ATK +8 · Worn` / `Not worn` (Ready dot at G1+) / `G1 first` at G0 | The same | **H121's accessory sheet**, on her ★ family |
| **★ Moon I** | `★ Moon I · Evasion +2.4% · Open` / `Ready` / `Lv 16` | The same | **H122's node sheet** |
| **★ Moon II** | `★ Moon II · DEF +8 · …` (M.DEF for a magical calling) | **By root:** Warrior `DEF +8`, Mage `M.DEF +8`, Spellblade, Summoner, Healer `DEF/M.DEF +4` | H122's node sheet |
| **Racing** | Aptitude chips (Surface, Distance, Style), **the three sources ringed** (her calling's style or styles, her stride's distance, her knack's growth); growth `Speed +20% · Power +10%` | The same; the ringed styles are every style the calling read | — |
| **Racing skill** | `Racing skill ›` | The same | A sheet: its name and text (master data at runtime) |

- **The Flourish sheet** (§5.3): `{shape} · {number}` at 22 px; `Works as · Brawler` (v19: `Works as · Warrior, Brawler,
  Arms Spellblade, Arms Summoner`); `Now · On` or `Now · Off · as Sorcerer`. Off: her family's classes she can fight as
  are chips (Selected ring), and the footer **Fight as Brawler** (free, `pickClass`); a Tier 0 she hasn't started reads
  **Start Warrior · R1**. On: no footer.
- **Locked** (§3.4, UP29; CV §14.4): the same rows with numbers and no states, no taps; the calling reads v18's `Pick on
  unlock · Spell Blade or Mage` (H117) and v19's **`Calling on unlock · Spellblade`**.
- **The dot** (§5.5 without the pick): the Template tab's dot while **her signature family isn't worn and her accessory
  slot is G1 or more**; on v18 also while her calling pick is open (until the switch drops it). Never for the Flourish
  being off; her moon's jewel is Stars' dot and shows `Ready` inline.
- **Budgets:** **B2** Template ≤ 1.4 screens at 390×844 (1.31 as drawn); with v18's interim calling card open, ≤ 1.6
  (reported; it goes at the switch). **B3** the Flourish and racing skill sheets without scrolling. **B4** wear her
  signature 3 (Template → Signature → ★ Bell), fight as her family 3 (Template → Flourish → Fight as), her moon's jewel 3
  (Template → Moon → Set).

### Build decisions (log them in the D-row)

1. **The design's shorthands give way to the wording list** (C3, as H119 decision 7 did): CV §14.4's "Calling Warrior ·
   fixed · Trade Metal" shows its trade as the list's `{place} · {maker}` (`Mine · Weapon Forge`); its "DEF +4 · M.DEF
   +4" is the list's Guard value `DEF/M.DEF +4` (the same fact: both +4).
2. **No calling pick is built.** On v18, a Pace or Late Uma with an open pick keeps H119's interim calling card (today's
   `CallingCard` with H117's words) under the calling row; it renders only while `callingCard(…)` returns one, which no
   v32 save can (save v32 drops `OwnedUma.calling`, CV §13), so it vanishes at the switch. Deleting `CallingCard`,
   `callingCard`, `chooseCalling` and `confirmCallingPick` belongs with the pick's retirement in H134 (with
   `save/calling-repair.ts`, CV §5.3). *Why:* 176 Umas can still pick on the live game until then; a v2 pick screen
   would live a week.
3. **`places/stable/template-view.ts` is rebuilt as the tab's pure model:** `templateTab(outfit, uma, world, classId,
   tier)` returns the name, the three readings, the calling row, the trade, the four ★ rows (label, number, state, the
   sheet it opens), the racing chips with their rings and the growth line; `flourishSheet(...)` its rows, its family
   chips and footer. Every reading comes from the domain by generation (H126): the calling (`umaCalling`), its
   sources (v19: every style at her top grade, the row `umaCallingRowV3` read), the On state (`umaFlourishActive`), the
   family (`rpgClassFamily`), moon II's stat and value (`moonTemplate`; `both` reads `DEF/M.DEF +4`), the template's name
   (`umaTemplate`), the trade (`umaTrade`).
4. **The family's chips** in the Flourish sheet: `rpgClassFamily(her calling)` in its order, those `umaHeldClasses`
   holds tappable (the Tier 0 always: every Tier 0 is open, R2); the default selection is the one she holds with the
   highest Class Rank (a Tier 1 class before its Tier 0 at a tie). On v18 the family is her calling's one class.
5. **The rings:** the style chips her calling read (v18: the row's style, as `callingSources` reads it; v19: every style
   at her top grade), the distance her stride read (`strideSource`), the growth her knack read (`knackSource`): a 2 px
   accent ring, the Selected look. No green.
6. **The dot's reasons move to their owners** (H121 decision 2 said so): the domain's `upgradesFor` stops counting "an
   accessory slot at G1+ with no family" among Gear's raises (its test changes), and the web computes the Template's
   reason, `signatureDot(outfit, uma)` (slot G1+ and `signatureWorn` false for her ★ family), in `profile-tabs.ts`
   beside H120's `classDot`; `tabDots` takes it; `withUpgrades` sets the Stable's `upgrade` facet when any tab has a
   dot (§5.5's roster row); `firstDotTab` keeps H120's order (Class, Gear, Stars, Template).
7. **New wording facts go into `copy.ts` first** (C3), each with its copy-test example: `Calling · {class} · fixed` ·
   `Calling · {class} · Picked` · `Calling on unlock · {Tier 0}` · `Works as · {A}, {B}, …` · `Now · On` · `Now · Off ·
   as {class}` · `Off · as {class}` · `G1 first` · `Racing skill` · the growth line `{Stat} +{n}%` joined by ` · `.
   The Flourish, Signature, Her moon, Reading, Trade and Unlock facts keep the list's builders (H117).
8. **Gone:** the skeleton's inline template sheet, the template chip's leftovers in `TemplateCard.tsx` (all but the
   interim `CallingCard`), `templateCard`, `rootFlourish`'s "No effect as …" wording (H117 made it `Off · as …`), and
   `racingTemplate` if anything still imports it.
9. **The JSX check** (H117's copy test) lists this packet's new `.tsx` files (`TemplateTab.tsx`, `FlourishSheet.tsx`, or
   whatever they are named).
10. **Bundle:** the tab is in the Stable's lazy chunk; the racing skill loads as today. Expected main JS change: 0.
11. **Your ports:** API 8095, web 5188 (H120 8092/5185, H132 8093/5186, H133 8094/5187, H121–H124 8091/5184).

## Do

1. **`template-view.ts`** (decisions 3–5) and its tests; the new facts in `copy.ts` (decision 7).
2. **The tab** (`TemplateTab.tsx` in place of H119's skeleton): the name and (i), the readings, the calling row and
   trade, the four ★ rows opening H121's `AccessorySheet` and H122's `NodeSheet`, the Flourish sheet, the racing chips
   with their rings, growth, the racing skill row and its sheet; locked (§3.4); 44 pt for every tappable row; the type
   scale and the six states.
3. **The dot** (decision 6): `upgradesFor`'s accessory reason, `signatureDot`, `tabDots`, `withUpgrades`.
4. **Delete** what decision 8 lists.
5. **Tests:**
   - `places/stable/template-view.test.ts` (live, v18; invented outfits, as today's file): the three readings with
     their sources (a Front row; a Pace row with Power and Wit); `Calling · Brawler · fixed` with `Mine · Weapon Forge`;
     a confirmed pick `Picked`; each ★ row's number and every state (Flourish On and `Off · as Mage`; Signature Worn, Not
     worn, `G1 first`; Moon I and II Open, Ready, `Lv 16`); the rings; locked `Pick on unlock · Spell Blade or Mage`;
     the Flourish sheet's chips and footer.
   - `places/stable/template-view.v19.test.ts` (the switch mocked to 19 with `capsAt`, as H120's v19 tests): an
     Mage's reading `from Pace A · Late A` (no Power or Wit); `Calling · Warrior · fixed`; the 15 types (one name
     each of a Warrior, a Spellblade and a Healer: the Healer's three are Lamplighter, Mender and Pilgrim); a Warrior
     calling's Flourish `On` as Arms Spellblade and `Off · as Sorcerer`, `Works as · Warrior, Brawler, Arms Spellblade,
     Arms Summoner`; moon II `DEF +8` (Warrior), `M.DEF +8` (Mage), `DEF/M.DEF +4` (Spellblade); locked `Calling on
     unlock · Spellblade`; `callingCard` null for every outfit (no pick).
   - `places/stable/profile-tabs.test.ts`: `signatureDot` true at G1 with a Pendant on a Bell Uma and with no family,
     false at G0 and when worn; the Template dot on v18 also for an open pick; the roster facet set by any tab's dot.
   - The domain's `save/upgrades.test.ts`: a G1+ accessory with no family no longer counts as a raise.
   - A component test (on `albumFixture`, the real store): the Signature row opens the accessory sheet and a ★ family
     tap wears it (the dot goes); a Moon row opens the node sheet; the Flourish sheet's `Fight as` calls `pickClass` and
     the row reads On; the racing skill sheet shows its name and text.
   - H117's copy test passes, with this packet's `.tsx` files in its JSX list.
6. **Measure** at 390×844 and 375×667, light and dark, with H119's snippet, on Umas like §5.6's (A: fixed, signature
   not worn, moon II Ready; C: Flourish off; D: locked) and, with v18's card, an open pick; then the same with the switch
   flipped locally (step 8). Count B4's taps. Record every number in the pull request.
7. **Docs:** sections.md § Stable's Template tab (both generations, the v19 rows under a "From the switch (H134)" line),
   classes.md § Her calling and her template where it names the chip, the card or the Racing tab; phone-check.md's
   Template step; `pnpm docs:update`.
8. **Check it locally** in a desktop browser at 390×844 and 375×667, light and dark, never the iOS Simulator, on your
   own ports (API `AUTH_MODE=disabled PORT=8095 LOCAL_SAVE_FILE=.data/scratch-h123.json`, web on 5188 with
   `API_PROXY_TARGET=http://localhost:8095`), on a scratch save (a Front Uma with a Pendant at G3 and a Bell family, a
   Late Uma fighting outside her calling, an open Pace pick, a locked Pace outfit): every row, every sheet, the dots on
   the tab and the roster. Then **flip the switch locally** (H134's three lines, H126 decision 6: `caps.ts` 19,
   `version.ts` 32, `migrateWorld` chaining `toV32`), restart, let the save migrate, and walk an Mage, a Spellblade and a locked Uma. **Revert the flip before you
   commit.**
9. **Log the D-row** (fetch `main` first): "H123: the profile's Template tab, without the calling pick", decisions 1–11.

## Done when

- [ ] `pnpm lint && pnpm test && pnpm build` pass. Say the main JS number (gzip, of 230 KB) and this packet's change (0
  expected).
- [ ] The tests in step 5 pass, the v19 ones with the switch mocked; **the copy test passes**; the new facts are in the
  wording list.
- [ ] **B2, B3 and B4 measured and met** at 390×844 (375×667 reported), on both generations; the numbers in the pull
  request.
- [ ] Every datum of §12's Racing rows and the template sheet is on the tab (her aptitudes, growth, racing skill, the
  readings, the trade, the four ★ pieces); nothing from the calling pick is built new.
- [ ] `pnpm docs:update` leaves no diff; the manual and the phone check describe the tab.
- [ ] The local check in step 8 was done at both sizes, light and dark, on a scratch save, on both generations, and
  described; the flip is reverted. Nothing from the original games in git (`git status`).
- [ ] Deployed green (`gh run watch <id> -R luismlorenzana/uma-rpg --exit-status`) and
  https://uma-rpg.web.app/api/health shows the merge commit.

## Deliver

- **Claude:** a branch `feat/h123-template-tab` (a worktree outside `~/workspace`) and a pull request, "feat(web): the
  profile's Template tab, her uniqueness without the calling pick (H123)", the body saying why (D239 UP16–UP19, D240
  CV19, CV21, CV32) with the measurements. Fetch `main` before you push so the D-number is free. Merge it yourself when
  green and watch the deploy.
- **Flag it done:** delete this file, add a Done row in [README.md](../README.md) with the merge commit, and note on
  H125's row that its re-run of "How to measure" now covers Class and Template.

## Notes from the main session
- **2026-10-30: H134 made Classes v3 live (D257) and did part of this packet.** The calling pick is retired everywhere
  (`CallingCard`, `chooseCalling`, `confirmCallingPick`, `calling-repair.ts`); today's template card reads her calling
  by her best running styles, the Flourish by family (`umaFlourishActive`) and moon II by root. Build the Template tab on
  that, for v19 only, and drop any step that only switched these at the flip.

