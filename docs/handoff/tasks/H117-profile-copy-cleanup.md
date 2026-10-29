# H117 — Uma profile v2: the copy cleanup on today's tabs, the wording list in code and the copy test

**uma-rpg · ChatGPT · S–M · Needs: nothing · Unblocks: H119**

## Why

The owner's loudest complaint about the Uma profile is AI slop: "This is a +1 bonus to fire damage when this is
equipped" where `Fire +1` would do. The audit counted **42 slop strings in the profile and 12 in her sheets elsewhere**,
plus **3 wrong texts**, and found one fact shown in up to five wordings. The owner approved the Uma profile v2 (D239):
its content rules make slop fail the build, and its first packet cleans the words **on today's tabs**, before the
rework, because every wording it sets is the one v2 keeps.

This packet:
- applies the proposal's cleanup list (§8: the 54 strings, 45 as the audit wrote them and 9 amended) and the three wrong
  texts, with intake findings F5 and F11–F15;
- raises the three targets under 44 pt;
- writes **the wording list as code** (`copy.ts`, one builder per fact) and **a copy test** in CI that fails on
  sentences, banned words and off-list wordings (UP26);
- deletes the dead v1 preset sheet.

No rule, save or engine change. Screens and words only.

## Context (read first)

- `CLAUDE.md`, `AGENTS.md`, [change-protocol.md](../../change-protocol.md). Nothing here touches uma-kit.
- **The proposal** ([proposal.md](../../design/uma-profile-v2/proposal.md), approved as D239 in
  [decisions.md](../../decisions.md)):
  - §7 entire: the rules C1–C10 (§7.1), **the wording list (§7.2)**, the type scale (§7.3), the state language (§7.4),
    and **§7.5, the copy test**;
  - §8 entire: **the cleanup list** (§8.1 #1–#42, §8.2 #43–#54), the wrong texts and findings (§8.3), the targets
    (§8.4). A row marked "H117:" is what this packet does; "v2:" is a later packet's;
  - §14 UP25, UP26, UP27 (the calls), §15 (the build plan: this is its first packet).
  - The [before and after page](../../design/uma-profile-v2/previews/before-after.html#slop) shows the slop next to its
    fix.
- **The audit** ([audit.md](../../design/uma-profile-v2/audit.md)): the file keys table at the top (`OP`, `TC`, `TV`,
  `ST`, `WS`, `G3`, `GE`, `GV`, `PB`, `OB`, `HP`, `PH`, `SH`); §4.1–§4.12 (every string with its tag and fix); §4.2
  (one fact, many wordings); §6.4 (the three targets).
- **The intake findings** ([intake-findings.md](../intake-findings.md)): F3 (#40), F5, F6 (#46), F8 (#23), F9 (#32),
  F11–F15, and F38 (the preset's dead sheet).
- **The code on `main` at `6a6996f`.** The audit's line numbers were read at `2b186f8`; no code changed between them, so
  they hold. All paths under `apps/web/src/` unless marked:
  - `places/stable/OutfitProfile.tsx`: the header and `Summary` (`:116–209`), `UnlockBox` (`:217–235`), `BattleTab`
    (`:239–309`, its (i) `:264–272`), `InheritanceCard` (`:342–384`, the Bond rows `:370–378`), `WorkTab`
    (`:426–463`), `RacingTab` (`:467–528`, "Her template" `:497–502`);
  - `places/stable/TemplateCard.tsx` (the chip `:16–49`, the calling card `:52–88`) and `template-view.ts` (the words:
    `flourishLine :64`, `rootFlourish :74`, `templateCard :89–115`, `racingTemplate :119–129`, `callingCard :143–156`);
  - `places/stable/SkillTree.tsx` (the Skills tab: help `:96–103`, the class button `:106–111`, the tree buttons
    `:113–128`, the Flourish line `:131–133`, the rank row `:134–137`, Equipped `:140–159`, `rankText :31`,
    `branchTitle :41`, the Class sheet `:214–228`, `SkillNodeSheet :298–323`, `BranchSheet :326–350`), and
    `ClassPicker.tsx :16`;
  - `places/stable/WeaponSheet.tsx :84–98` (the graded rows), `gear-v3.ts` (the Upgrade rows and pills),
    `gear-equip.ts` (the Equip cards), `GearCardV3.tsx` (`GradeIcon :31–40`, `GradeSheet :42–87`, `EquipView
    :147–211`, `UpgradeView :218–269`), `PresetButton.tsx`;
  - `places/observatory/ObservatoryPage.tsx` (`ObservatoryV3 :114–180`, `mapNodeValue :190–199`, `NodeSheet
    :201–208`); `places/halls/HallPage.tsx` (`:64`, the Hero sheet `:139–163`, the Learner sheet `:166–184`);
    `places/party-hall/PartyHallPage.tsx` (`:151`, `:198`);
  - `packages/domain/src/save/sheet.ts` (`umaBattleSheet`: `flourishShort :27`, `accessorySheetLine :45–55`, the v3
    rows `:83–109`) and `packages/domain/src/hub/places.ts :176–180` (the Observatory's blurb and details).
- **Tests that pin today's strings** and change with them: `places/stable/template-view.test.ts`,
  `gear-equip.test.ts`, `gear-v3.test.ts`, `tree-view.test.tsx` (the "branch" aria labels, "next at Class Rank"),
  `OutfitProfile.test.tsx`; any domain test on `umaBattleSheet` or `accessorySheetLine`
  (`git grep -n "accessorySheetLine\|umaBattleSheet" -- '*.test.ts'`). Fixtures are invented
  (`album/testing.ts`'s `albumFixture`, the made-up outfits in `template-view.test.ts`).
- **The manual:** [sections § Stable](../../game/sections.md#stable), [§ Halls of
  Heroes](../../game/sections.md#halls-of-heroes), [§ Observatory](../../game/sections.md#observatory), [§ Party
  Hall](../../game/sections.md#party-hall) quote today's strings; so do [phone-check.md](../../testing/phone-check.md)
  steps 7–12, 15 and 16.

## Decisions made

### From the proposal (UP25–UP27), exact

- **Every row of §8.1 and §8.2 is applied as its "Fix" column says**, on today's screens. Where a row splits "H117:" and
  "v2:", do the H117 part (#13, #16, #23, #25, #30). The amended rows (#9, #11, #12, #16, #24, #29, #30, #36, #41) use the
  amended text.
- **The wrong texts and findings (§8.3):** F3 (drop "10 gathered", #40), F5 (Gear's Extra Stats link to
  `/learning/observatory/:id`), F8 (#23), F9 (#32), F11 ("line" everywhere), F12 (Gritty's moon `Limit start +1`), F13
  (no "weak ×1.3", #20, #33, #37), F14 (the Accessory (i), one family a line), F15 (G0 once, #27).
- **Targets (§8.4):** the template chip (`TC:24`, `min-h-8`), Back to auto (`ST:144`, `min-h-9`) and the Inheritance
  Bond rows (`OP:374`, none) become 44 pt (`min-h-11`).
- **The wording list (§7.2) is code:** `apps/web/src/places/stable/copy.ts`, one builder per row of the list, named
  after the fact (`level`, `exp`, `classRank`, `craftLevel`, `gate`, `grade`, `gradeStep`, `might`, `armorStat`,
  `accessoryEffect`, `staleKind`, `signature`, `flourish`, `moonNode`, `extraStatsCount`, `nodeValue`, `itemCount`,
  `reading`, `trade`, `party`, `work`, `equipped`, `line`, `skillRank`, `depth`, `bond`, `limitStart`, `mp`, `hand`,
  `standardPreset`, `unlock`, and the actions list). Each builder returns the list's "Wording" exactly; its examples are
  its tests.
- **The copy test (§7.5):** `apps/web/src/places/stable/copy.test.ts` (Vitest) fails when a surface string has **more
  than six words**, **a banned word** (her, this, when, will, you, your, bonus, and "is a"), or **a fact's wording off the
  list**; exempt are (i) texts, one-time confirms, error and empty states. Its JSX check flags text nodes over four words
  outside a `HelpButton`.
- **The handoff README's "How a packet reads"** gains one Done-when line for profile work (§7.5 item 4).

### Build decisions (made for this packet; log them in the D-row)

1. **The domain's words.** `umaBattleSheet` builds its rows in the domain (combat-balance §6.0: a rule change shows
   there; H57 keeps it out of the main bundle), and four of its facts are also on the Gear tab. So those four builders
   live in a new pure domain file, `packages/domain/src/save/sheet-words.ts` (`accessoryEffect`, `flourish`,
   `signature`, `limitStart`, `mp`; exported from the domain index), and `copy.ts` re-exports them beside the web-only
   builders. Screens import one module; each fact has one function. *Why:* C3 (one wording per fact) without a second
   copy in the web.
2. **How the test counts words.** Strip names first, then split on whitespace and on the list's separators (`·`, `→`,
   `/`, `>`, `≥`, `+`, `★`, `(`, `)`, `,`). **Names don't count** (the game's own name lists: classes, weapons, kinds,
   Flourishes, strides, knacks, aptitude keys, core and battle stat labels such as `ATK` and `M.ATK`, accessory
   families, armor slots and kinds, map bodies, places and trades, made items, skills, Limit Breaks, template names and
   the fixture's Uma names; match the longest name first). **Numbers don't count** (digits with signs, decimal and
   thousands separators, `%` and `×`). *Why:* the rule targets sentences; a label and a number stays well under six
   this way, every wording on the list passes (the longest, Late reserve's Flourish, counts six: Flourish, round, from,
   round, max, On), and the sentence-shaped slop fails (the self-test in step 3). Repeats and restated drawings (C4,
   C5) are review's job, not the test's.
3. **What the test sweeps:** every `copy.ts` builder, and the view-model functions the profile prints (`templateCard`,
   `callingCard`, `rootFlourish`, `accessoryCards` and `cardButton`, `upgradeRows` and `gradeUpgradeView`,
   `weaponGradeLine`, `armorGradeLine`, `accessoryGradeLine`, `handLine`, `rankText`, `umaBattleSheet`'s labels, values
   and notes, the Observatory's node words), over fixtures: each of the six classes, each family at G0, G1 and G10 with
   and without a kind, each Flourish and knack, Lv 1 and Lv 50 (max EXP), owned and locked (`uma: null`). **The JSX
   check** parses (TypeScript's compiler API; `typescript` is already a dev dependency) the profile's files:
   `places/stable/{OutfitProfile,TemplateCard,SkillTree,SkillsPage,WeaponSheet,GearCardV3,PresetButton,ClassPicker}.tsx`,
   listed in the test so a later packet adds its files. It flags `JsxText` nodes and string-literal JSX children over
   four words (same counting), outside a `<HelpButton>` subtree, minus an **allowlist of exempt strings**, each with
   its file and reason (error and empty states only: "That outfit isn't in the current game data.", "Not in the current
   game data.", "Unlock her first."). Aria labels and `title` attributes aren't surface strings.
4. **A label and a value in two cells** (a summary cell, a Battle row, the Racing template's rows before they go) show
   the list's leading word as the label and the rest as the value: "Craft" | "30", "Brawler" | "R40", "★ Flourish" |
   "Even pace · 1%/round · max 4% · On". Same wording, split.
5. **Every listed fact on today's screens takes its listed wording now, not only the 54** (§7.5 item 1: "every profile
   string comes from the wording list's builders"). The extra one-line swaps, beyond §8:

   | Fact | Today | Now |
   |---|---|---|
   | EXP (`OP:183`) | "1200 / 2400 EXP" | `1,200/2,400` |
   | Class Rank (`OP:192`, `ClassPicker :16`, `rankText`, `BranchSheet :341`) | "Rank 40", "next at Class Rank 14", "Class Rank 30" | `R40`, `Rank 3 · next R14`, gate `R30` (aria keeps "Class Rank {n}") |
   | Craft Level (`OP:196–197`, `OP:449`) | "Craft" "Lv 30", "Craft Lv 10 · Fields · Tome Forge" | "Craft" \| "30"; `Craft 10 · Fields · Tome Forge` |
   | Craft EXP (`OP:455`) | "120 / 1,575 EXP" | `120/1,575` |
   | Equipped (`ST:142`) | "Equipped · 7/7" | `Equipped 7/7` |
   | Hand (`ST:221`) | "Spell Blade · Arms ×0.72 + Tome ×0.44" | `Hand · Arms ×0.72 · Tome ×0.44` |
   | Line and depth (`ST:316`, `ST:332`) | "Depth 4 · Branch B", "Lance · B · Impale" | `Depth 4 · Line B`, title `Lance · Line B · Impale` |
   | Readings (`TC:35`) | "Calling ← Pace A, Wit 102 ≥ Power 90" | `Mage · from Pace A · Wit 102 ≥ Power 90`; a picked one `Spell Blade · Picked` |
   | Moon (`TC:43`, `TV:113`) | one line "Moon · I … (open) · II … (Lv 36)" | two rows: `★ Moon I · Evasion +2.4% · Open`, `★ Moon II · DEF +8 · Lv 36`; `Ready` when a jewel in the Warehouse opens it now (`jewelBlock` null) |
   | Battle rows (`SH:103–107`) | "Signature" "+10 ★" (only while worn), "MP · +10 a round", "Limit Break head start" "0 / 12" | "★ Signature" \| `ATK/M.ATK +10 · Worn`, **always listed** (`· Not worn`, combat-balance §6.0); MP note `+10/round`; "Limit start" \| `0/12` |
   | Stale kind (`GE:60`, `SH:52`) | "No Greatsword in her slots" | `Greatsword not held` (warning colour) |
   | Extra Stats count (`G3:260`, `OB:145`) | "17/22 open · map ›", "Open 16 of 20 · ★ 1 of 2" | `Open 17/22 ›`, `Open 17/22` |
   | Node values (`OB:190–199`, the Set list) | "+21 to every stat", "HP +100, MP +20", "DEF and M.DEF +4", "Fleet · Evasion +2.4%" | `+21 · all six`, `HP +100 · MP +20`, `DEF/M.DEF +4`, `Evasion +2.4%` |
   | Standard preset (`PB:33`, `PB:35`) | "Standard preset on" / "Use standard preset"; "Magic" | `Standard preset · On` / `Standard preset`; `Magical` |
   | Bond (`OP:376`, `HP:173`) | "Bond 2/10 · 60% ›", "Bond 4/10 · 70% strength" | `Bond 2/10 · Strength 60%` |
   | Upgrade pill (`GV:25`) | "G9 → G10 · 1 Arms Gem G10" | `G9 → G10 · Arms Gem G10 ×1` |
   | Grade sheet (`G3:62–64`) | "Now · …", "Next · …", "Her class's half · Helm" | one line `G9 → G10 · Might 57 → 68` (armor `G8 → G9 · DEF 32 → 36 · ATK 4 → 5`; at G10 `G10 · Max · Might 68`); `Head · Physical` (#38) |
6. **#34 and #35 are one row in two states, so both keep the grade:** `Bell · G8 · Greatsword ×0.8 · ★ +10` and `Bell
   · G0 · Off`; `None · G0` (#36). *Why:* #35 keeps "G0", and every other grade row shows its grade.
7. **#8 keeps the head count** ("Forest · Armorer · 8 Umas"): the fix is "only when the tiles differ", so a Late pick's
   tiles drop the line (both trades are the same) and a Pace pick's keep it. *Why:* the count is how the owner fills a
   short trade (H80).
8. **#9 and #10:** the tile shows a `Suggested` badge only; the reason moves to the Calling reading of the template
   sheet (`Mage · from Pace A · Wit 102 ≥ Power 90`). The calling card gets a header row "Calling" with an (i): "Final
   once confirmed; her class stays free.", "Her first win confirms it.", "At Lv 1 the pick moves her class too.", "While
   she works, the pick waits: it moves her trade." "Finish her work first" stays under Confirm (a block).
9. **#48:** the Hero sheet reads her name on one line, then `Hero · Strength 100%`. **#50:** "Empty seat" asks inside
   the same sheet (never a sheet on a sheet): with Learners, the button turns into a short confirm naming them ("Leaves:
   Uma B, Uma C") with **Empty seat** and **Cancel**; with none, one tap empties it as today. **#53:** the empty slot
   reads `Empty` with the aria label "Slot 3, empty".
10. **F5:** the Gear tab's Extra Stats button opens `/learning/observatory/:id` pushed with `{ back: true }`, so the
    Observatory's Back returns to her (H122 removes the button).
11. **F6 on the same object (#46):** the Observatory's blurb becomes "Each Uma's Extra Stats: a Planet, three moons and
    her own moon." and its two details lines "22 nodes per Uma" and "Planet and Moon Jewels open nodes in order"
    (`hub/places.ts :178–179`). *Why:* the details are the same stale fact; `pnpm docs:update` regenerates the manual's
    places table.
12. **The Battle (i) (#23, F8), one source a line:** "ATK, M.ATK ← Speed" · "HP ← Stamina, Power, Guts" · "MP ← Wit" ·
    "DEF ← Power" · "M.DEF ← Power, Wit" · "Then + gear, + Extra Stats, ★ her moon" · "Might: a weapon's own hits only" ·
    "Mends: a Paladin's from ATK, a Cleric's from M.ATK". Check each line against `projectRpgStats` and `applyPoints`
    before writing it; drop a line that isn't true.
13. **The Grades (i) (#32, F9):** "G1–G10" · "G*g* opens at Lv 5*g* − 4" · "Arms Gem: Weapon Forge" · "Tome Ink: Tome
    Forge" · "Armor Fittings: Armorer" · "Accessory Setting: Charm Forge". **The Accessory (i) (F14), one family a
    line:** "Pendant · +n on each of her three kinds" · "Orb · +n on one kind" · "Bell · one more hit of that kind
    after her Attack, ×0.1 a grade" · "Insignia · +1.5% a grade on sub-bosses and bosses", then today's second line
    ("The form changes freely outside fights …"). Check the numbers against `accessoryFlatValue` and the Bell's rule.
14. **The Skills tab (#13, #14, #15, #17):** the Flourish line becomes a chip `★ Even pace · On` / `· Off` (faint; its
    builder `flourishChip` is marked interim in `copy.ts`, since the list's Flourish wording is the full one and H120
    removes the chip);
    the rank row and "Depths open" go and a thin Class Rank bar (4 px) sits inside the class button under "R40"; the
    Class sheet loses its Flourish line. **#16:** `Slots full · 7/7`.
15. **The v1 preset (#26, F38):** `PresetButton` loses its bind confirm sheet ("Binds to her for good", "Use the
    standard preset") and its v1 branch (`classPreset`, the Orb and support labels): every live save is graded.
16. **Bundle:** `copy.ts` and its imports stay in the lazy chunks (the Stable, the Observatory, the Halls and the Party
    Hall are lazy; `sheet-words.ts` is imported only by lazy code and `sheet.ts`). `hub/places.ts` is in the main
    bundle; its strings change length by a few bytes. Expected main JS change: ±0.1 KB of today's 223.46 KB.

### What stays for v2 (and what this packet already settles)

| Item | Here (H117) | Later |
|---|---|---|
| Flourish on Skills (#13) | Chip `★ Even pace · On/Off` | H120/H123: off the Class tab; Template's ★ Flourish row |
| Slots full (#16) | `Slots full · 7/7` | H120: no message; the node sheet offers Replace |
| Battle (i) (#23) | Rewritten in the Battle (i) | H119: Details' inline "How stats add up" |
| Unlock date (#25) | `Unlocked 28 Oct 2026` on Battle | H119: Details › Since |
| Accessory at G0 (#30) | `G1: …` | H121: the sheet's before → after `Off → +1 · 3 kinds` |
| F5 | The link points at `/learning/…` | H122: the button goes; the Observatory route redirects to Stars |
| The template chip, Back to auto, Bond rows | 44 pt | H119/H120/H123: the chip is gone; Auto and the Limit line are 44 pt by design |
| The wording list | Every builder, used wherever today's screens show the fact | Each v2 packet reads its words from `copy.ts` and adds new facts to the list first |

## Do

1. **`packages/domain/src/save/sheet-words.ts`** and **`apps/web/src/places/stable/copy.ts`**, one builder per row of
   §7.2 (decision 1), with doc comments citing C1–C10. `copy.ts` re-exports the domain's five. Number formats per C8
   (`toLocaleString('en-US')`, `×0.8`, `+12%`, `/round`).
2. **Apply §8 by file** (each row's number in brackets), using the builders, never an inline string for a listed fact:
   - `OutfitProfile.tsx`: header and summary (#1, #2, #3, #4, #5; EXP, Class Rank, Craft cells), Battle (#22, #23, #25),
     Inheritance (Bond wording, rows 44 pt), Work (#40, #41; Craft and its EXP), Racing (#42: delete "Her template" and
     `racingTemplate`).
   - `TemplateCard.tsx` and `template-view.ts`: #6–#12, readings with "from", the two Moon rows (decision 5), the chip at
     44 pt, the calling card's (i) (decision 8), Gritty's `Limit start +1` (F12).
   - `SkillTree.tsx`, `ClassPicker.tsx`: #13–#18, F11 (every player-facing "branch" → "line": help, `Take line B`,
     `Held`, `Line B`, the sheet title, the aria labels "Lance, line B", "Line B · Impale, held"; code names such as
     `RpgBranch` and `takeBranch` stay), `R{n}`, `Hand`, `Equipped 7/7`, Back to auto at 44 pt.
   - `WeaponSheet.tsx`: #19 (one row a weapon: `Katana · G5 · Might 20`, then `Held` or `Slot 2` on the right), #20,
     #21.
   - `gear-v3.ts`, `gear-equip.ts`, `GearCardV3.tsx`: #27–#39 (decision 6), F5 (decision 10), F13, F14, F15, the pill and
     the grade sheet (decision 5).
   - `PresetButton.tsx`: decision 15 and the preset wording.
   - `packages/domain/src/save/sheet.ts`: #24 through `accessoryEffect`, the Flourish row through `flourish`, the
     Signature row always listed, MP and Limit start (decision 5).
   - `ObservatoryPage.tsx`: #43–#45, node values and the count (decision 5), F12; `hub/places.ts`: #46 and decision 11.
   - `HallPage.tsx`: #47–#52 (decision 9; the Learner sheet's Bond wording). `PartyHallPage.tsx`: #53, #54.
3. **The copy test**, `apps/web/src/places/stable/copy.test.ts` (decisions 2 and 3):
   - **the list:** each builder against every example in §7.2 (`level(40)` is `Lv 40`, `exp(1200, 2400)` is
     `1,200/2,400`, `accessoryEffect('bell', …, 'greatsword')` is `Greatsword ×0.8`, …), so a wording that drifts from
     the list fails;
   - **the sweep:** every builder and view-model function over the fixtures; each string ≤ 6 words and no banned word;
     a failure prints the string and its source;
   - **the JSX check** over the listed files, with the allowlist;
   - **a self-test:** the audit's slop strings (the owner's "This is a +1 bonus to fire damage when this is equipped",
     "After her Attack, one more hit of that kind at 0.8", "Empty this seat (its 3 Learners leave; their Bonds stay)")
     fail the checks, and their fixes pass.
4. **Update the tests that pinned today's strings** (Context), to the new wordings; add to `template-view.test.ts` a
   Late pick's tiles without the trade line and a Pace pick's with it; to `tree-view.test.tsx` the "line" aria labels;
   to `OutfitProfile.test.tsx` that the template chip, Back to auto and a Bond row have `min-h-11`, and the locked page
   has no tickets line.
5. **Docs:** rewrite the quoted strings in sections.md (§ Stable, § Halls of Heroes, § Observatory, § Party Hall),
   classes.md `:246` ("the Skills tab calls them branches" goes with F11), combat.md `:313` ("MP 296 · +15/round") and
   phone-check.md (steps 7–12, 15, 16; `git grep` the old strings across `docs/game` and `docs/testing`); `pnpm
   docs:update` (the places table follows `hub/places.ts`). In
   [README.md](../README.md#how-a-packet-reads) add under "How a packet reads": "Profile work: the copy test passes; new
   facts are in the wording list (`places/stable/copy.ts`) first."
6. **Check it locally** in a desktop browser at 390×844 and 375×667, light and dark (never the iOS Simulator), on your
   own ports (API `AUTH_MODE=disabled PORT=8091 LOCAL_SAVE_FILE=.data/scratch-h117.json`, web on 5184 with
   `API_PROXY_TARGET`), on a scratch save, never the owner's: unlock a few Umas, one with an open Pace pick and one Late,
   give one made items and a jewel (or build the save with the domain's CJS build). Walk every changed screen: header
   and summary, the template sheet and the calling card (both kinds of pick), Skills and its sheets, Battle, Gear's two
   views and the grade sheet, Work, Racing, the Observatory, a Hall (Hero and Learner sheets, Empty seat with Learners),
   the Party Hall. Nothing clipped at 375; no horizontal scroll.
7. **Log the D-row** (fetch `main` first for the next free number): "H117: the profile's copy cleanup on today's tabs,
   the wording list in code and the copy test", with decisions 1–16 in one line each.

## Done when

- [ ] `pnpm lint && pnpm test && pnpm build` pass. Say the main JS number (gzip, of 230 KB; 223.46 today) and the
  change (expected ±0.1 KB); `copy.ts` and `sheet-words.ts` are in lazy chunks only.
- [ ] **The copy test passes** with the list, the sweep, the JSX check and the self-test; every §8 row and finding above
  is applied (tick them off by number in the pull request).
- [ ] The three targets measure 44 pt in the browser (`getBoundingClientRect().height ≥ 44`).
- [ ] `pnpm docs:update` leaves no diff after your commit; the manual and the phone check quote the new strings; the
  README line is in.
- [ ] The local check in step 6 was done at both sizes, light and dark, on a scratch save, and described in the pull
  request (no screenshots of original art in git). Nothing from the original games in git (`git status`).
- [ ] Deployed green (`gh run watch <id> -R luismlorenzana/uma-rpg --exit-status`) and
  https://uma-rpg.web.app/api/health shows the merge commit in `build`.

## Deliver

- **ChatGPT:** one branch, `feat/h117-profile-copy-cleanup`, one pull request, "feat(web): the profile's copy cleanup,
  the wording list in code and the copy test (H117)"; the body says why (D239, UP25–UP27) and lists the rows by number.
  Fetch `main` before you push so the D-number is free. Merge it yourself when the checks and CI are green, and watch
  the deploy. The CI's web suite sometimes fails with Vitest's `Timeout calling "onTaskUpdate"` while every test passes:
  rerun the job.
- **Flag it done:** delete this file, add a Done row in [README.md](../README.md) with the merge commit, and set H119 to
  Ready when H118 is also done (H119 needs both).
