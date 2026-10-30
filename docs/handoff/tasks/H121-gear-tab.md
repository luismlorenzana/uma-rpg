# H121 — Uma profile v2: the Gear tab, nine tiles, raise sheets with before → after, and Raise all

**uma-rpg · ChatGPT · M · Needs: H119 · Unblocks: H125 (with H122 and H124); H123 opens this packet's accessory sheet**

## Why

Today's Gear tab is two views, Equip and Upgrade, the choice reset every session, with a raise pill on every row: raising
one weapon several grades is five taps (row → sheet → "Up to G6" → list → Raise), and nothing shows what a raise does
before it happens (audit §4.9, §6.3). The approved v2 (D239, UP13, UP14, UP22) makes Gear **one view of nine tiles**
(three weapons, five armor slots, the accessory), each tile opening **one sheet** with the cost, **before → after**, the
target grade and one Raise button, and **Raise all** spends every ready slot behind one confirm. It is the tab that must
fit one screen (B2: Gear ≤ 1.0).

No rule or save change: every raise is today's `raiseGradeTo`, every family pick today's `chooseAccessoryForm`.

## Context (read first)

- `CLAUDE.md`, `AGENTS.md`; H119's frame as merged (the Gear tab carries today's Equip and Upgrade views stacked).
- **The proposal** ([proposal.md](../../design/uma-profile-v2/proposal.md), D239):
  - **§4.2 entire** (the drawing, the tiles, the four sheets, the edge states, "what changed");
  - §2.4 (the one grammar: first row, the system drawn, tap → one sheet, free on tap, spending in the footer with cost
    and before → after, the sheet stays open, never a sheet on a sheet);
  - §5.3's "one component, two doors" (H123's Signature row opens **this** accessory sheet), §5.5 (Gear's dot);
  - §7.2 (the wording list: Grade, Might, Armor stat, Accessory effect, Stale kind, Signature, An item and its count, the
    actions), §7.3 (type: the before → after at 22 px), §7.4 (states: Ready, Closed, On, Selected);
  - §9: G1–G5, V1–V3, **B2 (Gear ≤ 1.0 at 390×844), B3, B4**; §10.2 (Gear as drawn: 358 px under the tab bar, 0.97
    screens; 1.31 at 375×667) and §10.3 (raise a weapon as far as the Warehouse allows: 3 taps; raise every ready slot:
    3);
  - §14: UP6, UP13, UP14, UP22, UP23. The [tabs page](../../design/uma-profile-v2/previews/tabs.html) draws Gear and
    its sheets at 390×844.
- **The audit:** §1.1 (Gear › Equip, Upgrade, the grade sheet), §4.8–§4.9, §6.3, §7.1–§7.2 (every gear action and datum
  to keep).
- **The code on `main` at `6a6996f`** (H117 and H119 change it; re-read): `apps/web/src/places/stable/GearCardV3.tsx`
  (`GradeIcon`, `GradeSheet`, `AccessoryPicker`, `EquipView`, `UpgradeView`), `gear-equip.ts` (`accessoryCards`,
  `cardKind`, `cardButton`, `upgradeRows`), `gear-v3.ts` (`gradeUpgradeView`, the grade lines), `PresetButton.tsx`;
  `save/game.ts` (`edit :168`, `wieldWeapons` (several changes in one save write), `raiseGear :324`,
  `chooseAccessoryForm :327`); `album/upgrades.ts`. The domain: `economy/grades.ts` (`raiseBlock :115`, `gradeOf`,
  `mightAt`, `armorValues`, `gradeItemId`, `ARMOR_SLOTS`), `save/forge.ts` (`raisePlan :168`, `raiseGradeTo :189`),
  `economy/accessories.ts` (`accessoryFlatValue`, `signatureBonus`, `signatureWorn`, the Bell's factor, the form
  rules), `save/upgrades.ts :78–106` (`upgradesFor`: the ready grade targets, and an accessory slot at G1+ with no
  family).
- **The manual:** [sections § Stable](../../game/sections.md#stable) (its Gear tab), [classes](../../game/classes.md)
  `:129`, `:214`, `:218`, [loops](../../game/loops.md) `:317–:323`, [materials](../../game/materials.md) `:208`;
  [phone-check.md](../../testing/phone-check.md) steps 10–11.

## Decisions made

### From the proposal, exact

- **First row:** `Physical · 3 ready` (her class's armor half, then the ready slots), **Raise all**, (i). Nothing ready:
  `Physical`, no button.
- **The system drawn:** WEAPONS, three tiles; ARMOR, five tiles; ACCESSORY, one wide tile (`◇ Pendant · G7 · +7 · 3 kinds`,
  and `★ Bell not worn` when her family isn't worn). **A tile:** the glyph, the grade badge, one stat under it (`Might
  45`, `DEF 32`, `HP 105`, `MP 18`, `M.DEF 28`), the 6 px green **Ready** dot when it can be raised now. A G0 slot is an
  empty frame with one "G0".
- **Weapon sheet** ("Axe · Slot 2"): before → after at display size (`G6 → G8`, `Might 26 → 45`); each grade's cost
  (`Arms Gem G7 ×1 · 2 held`); **target grade chips** G7, G8 … as far as her level allows, closed ones faded with their
  gate (`Lv 41`), **starting on the highest grade the Warehouse covers**; the footer **Raise to G8**; blocked, disabled
  with what's missing (`Arms Gem G7 ×0` or `Lv 41`); at G10 `G10 · Max` and no button.
- **Armor sheet** ("Head · Physical"): `G8 → G9`, `DEF 32 → 36 · ATK 4 → 5`, the cost, the chips, **Raise to G9**.
- **Accessory sheet** ("Accessory · G7"): the worn family's effect at this grade (`Pendant · +7 · 3 kinds`), `★
  Signature · ATK/M.ATK +8 · Not worn`, before → after (`+7 → +9`); **Family:** four icons, her ★ family first, **a tap
  wears it** (free); **Kind** (Bell, Orb): her three weapons' kinds; a stale kind shows `Greatsword not held` in the
  warning colour; the footer **Raise to G8**. At G0: `None · G0`, its effect `Off` until G1.
- **Raise all:** every ready slot as far as items and level allow, one line each (`Axe G6 → G8 · Arms Gem G7 ×1 · G8
  ×1`), then `Uses 4 items`; slots draw on the stock **in the tab's order** (weapons, armor, accessory); a slot the
  stock no longer covers is left out; the footer **Raise 3**.
- **After an action the sheet stays open** on the new state (G5); it closes with Close, Back or a tap outside; never a
  sheet on a sheet; one (i), on the first row (UP31).
- **Gone from Gear:** the Equip/Upgrade split, the pill on every row, the loadout's "Set on Skills ›" (weapons are
  chosen on Class), the "Up to G6" list behind a second button, the Extra Stats button and its total (the Stars tab).
- **Budgets:** B2 Gear ≤ 1.0 screens at 390×844; B3 every sheet without scrolling at 390×844; B4 raise a weapon as far
  as the Warehouse allows in 3 taps (Gear → tile → Raise to G8), every ready slot in 3 (Gear → Raise all → Raise N).

### Build decisions (log them in the D-row)

1. **The standard preset moves to the top of the Class tab for now** (main session, 2026-10-29: if H120 has landed first, the preset is already the Classes sheet's footer; skip this decision and only remove it from Gear). The proposal puts it in the Class sheet's footer
   (H120), which waits for the Classes v3 design; Gear has no room for it under B2 (+52 px is 1.05 screens). So
   `PresetButton` (H117's wording, `Standard preset` / `Standard preset · On`; since D263 a Tier 0 lists one row a child, so
   it moves whole) becomes the first row of the Class tab's
   skeleton until H120 moves it. *Why:* its destination tab, and nothing lost meanwhile.
2. **The Can upgrade reasons stay as `upgradesFor` builds them**, including "an accessory slot at G1+ with no family"
   in Gear's count, until H123 moves the signature's reason to Template (§5.5). The accessory tile's Ready dot then means
   a raise or a family to pick. *Why:* no flag disappears while H123 waits.
3. **Tile dots read `upgrades.grades`**, the very targets the tab dot and the Stable's mark count, so a tile, the tab
   and the roster never disagree.
4. **One save write per action:** a sheet's raise is `raiseGear(outfitId, target, to)` (today's `raiseGradeTo`); Raise
   all is a new `raiseAll(outfitId, steps)` in `save/game.ts` reducing `raiseGradeTo` over the steps inside one `edit`
   (the `wieldWeapons` pattern). A step the rules refuse aborts the whole write with its message (nothing half-spent).
5. **The plan is pure** (`places/stable/gear-view.ts`): `gearTiles(…)`, `raiseSheet(…)` (before, after, costs with
   held counts, chips with their gates, the default target, the footer label or block) and `raiseAllPlan(world,
   outfitId, classId)`, which walks the slots in tab order and, for each, takes the highest grade `raisePlan` allows
   against a simulated stock (the Warehouse minus what earlier lines take). The before → after numbers come from the
   rules (`mightAt`, `armorValues`, `accessoryFlatValue`, the Bell's and the Insignia's rules), never from text.
6. **The chips:** current + 1 to G10. A grade above her level's gate is Closed (40%, its `Lv n`); a grade the Warehouse
   doesn't cover stays tappable and the footer shows the first missing item, disabled. Default: the highest grade with
   `raisePlan(…).block === null`, else current + 1. Tapping a chip selects it (the Selected ring).
7. **Family and kind apply on tap** through `chooseAccessoryForm` (D223's rules unchanged): a Bell or an Orb is worn on
   the kind today's `cardKind` picks unless one is tapped; tapping a kind re-wears it on that kind. A refusal shows its
   message in the sheet.
8. **Feet's stat is `Evasion 4.8%`**, the stat the slot adds (`armorValues(…).stat`); the §4.2 drawing's "Speed 10" is
   a mock slip.
9. **The (i):** H117's Grades lines and Accessory lines, and "Physical or Magical: her class's half of all five
   slots", one rule a line.
10. **`AccessorySheet` is one exported component** taking the Uma and the slot, so H123's ★ Signature row opens the
    same sheet with the same before → after (§5.3).
11. **New wording facts first** in `copy.ts` and the copy test: `{half} · {n} ready`, `Uses {n} items`, `Raise {n}`,
    `Raise to G{n}`, `None · G0`, the tile's one stat, the cost with held (`{Item} ×{n} · {held} held`) and without (a
    Raise all line).
12. **Deleted:** `EquipView`, `UpgradeView`, `GradeSheet`, `AccessoryPicker`, `GradeIcon`'s duplicate G0, `upgradeRows`,
    the card shapes nothing reads any more, and their tests (replaced by `gear-view.test.ts`).
13. **Bundle:** the tab is in the profile's lazy chunk. Expected main JS change: 0.

## Do

1. **`gear-view.ts`** (decisions 5, 6) and **`raiseAll`** in `save/game.ts` (decision 4).
2. **The Gear tab** (`GearTab.tsx` or in place of `GearCardV3.tsx`): the first row, the three sections of tiles, the
   weapon, armor and accessory sheets, the Raise all sheet; the states of §7.4; 44 pt for every tile and chip; nothing
   under 11 px.
3. **Move `PresetButton`** to the top of the Class tab (decision 1); delete what decision 12 lists.
4. **Tests:**
   - `places/stable/gear-view.test.ts`: nine tiles in order with their one stat (Feet `Evasion n%`), a G0 frame with
     one "G0", Ready from `upgrades.grades`; a weapon at G6 with Arms Gem G7 and G8 in stock at a level that allows G8 →
     default target G8, `G6 → G8`, the Might pair from `mightAt`, two cost lines with held counts, G9 and G10 Closed
     with their `Lv n`; with no G7 gem → footer `Arms Gem G7 ×0`, disabled; at G10 → `G10 · Max`, no action; an armor
     slot's DEF and ATK pairs from `armorValues`; the accessory at G0 (`None · G0`, `Off`), worn Pendant at G7 (the
     effect and the next grade's), the signature line Worn and Not worn, a Bell on a kind she no longer holds
     (`Greatsword not held`); `raiseAllPlan` with two weapons wanting one Arms Gem G8 (the first takes it, the second
     stops a grade lower or drops out), its lines, `Uses n items` and `Raise n`.
   - A component test (beside `OutfitProfile.test.tsx`, on `albumFixture`): tap a ready tile, then Raise to G… → the
     grade rises, the items fall, the sheet stays open on the new grade; Raise all → its lines, then Raise N → one save
     write (spy on the store's commit) and every slot raised; a family tap wears it with no button; the tab dot and the
     tile dots match `upgrades`.
   - H117's copy test passes, with this packet's `.tsx` files in its JSX list.
5. **Measure** at 390×844 and 375×667 with an Uma like §4's Uma A (three raises ready), with the snippet:
   ```js
   const main = document.querySelector('[data-place-page] main')
   +(main.scrollHeight / main.clientHeight).toFixed(2)          // B2: Gear ≤ 1.0 at 390×844
   const body = document.querySelector('[data-kit="sheet"] .overflow-y-auto'); body.scrollHeight <= body.clientHeight   // B3, each sheet
   ```
   and count the taps of B4. If Gear is over 1.0, tighten gaps and tile padding before touching content.
6. **Docs:** sections.md § Stable's Gear tab; the Gear lines in classes.md, loops.md and materials.md (the tab is one
   view; the preset sits on Class for now); phone-check.md steps 10–11; `pnpm docs:update`.
7. **Check it locally** at 390×844 and 375×667, light and dark, on your own ports (API `AUTH_MODE=disabled PORT=8091
   LOCAL_SAVE_FILE=.data/scratch-h121.json`, web 5184), on a scratch save with made items for several grades and slots:
   raise one grade, several grades, Raise all; wear each family; a stale kind; G0 and G10 slots. Never the iOS
   Simulator.
8. **Log the D-row** (fetch `main` first): "H121: the profile's Gear tab", decisions 1–13.

## Done when

- [ ] `pnpm lint && pnpm test && pnpm build` pass. Say the main JS number (gzip, of 230 KB) and this packet's change (0
  expected).
- [ ] The tests in step 4 pass; **the copy test passes**; the new facts are in the wording list.
- [ ] **B2 (Gear ≤ 1.0 at 390×844), B3 (every sheet) and B4 measured and met**; the numbers at both sizes in the pull
  request (375×667: 1.31 as drawn, reported).
- [ ] Every gear action and datum of audit §7 is still there (grade, Might, armor half and stat, accessory family, kind,
  effect, stale kind, signature, each raise's item or block, the counts).
- [ ] `pnpm docs:update` leaves no diff; the manual and the phone check describe the tab.
- [ ] The local check in step 7 was done at both sizes, light and dark, on a scratch save, and described. Nothing from
  the original games in git (`git status`).
- [ ] Deployed green (`gh run watch <id> -R luismlorenzana/uma-rpg --exit-status`) and
  https://uma-rpg.web.app/api/health shows the merge commit.

## Deliver

- **ChatGPT:** a branch `feat/h121-gear-tab` and a pull request, "feat(web): the profile's Gear tab, nine tiles, raise
  sheets and Raise all (H121)", the body saying why (D239, UP13, UP14, UP22) with the measurements. Fetch `main` before
  you push so the D-number is free. Merge it yourself when the checks and CI are green, and watch the deploy (rerun the
  web job on Vitest's `Timeout calling "onTaskUpdate"`).
- **Flag it done:** delete this file, add a Done row in [README.md](../README.md) with the merge commit, and set H125 to
  Ready when H122 and H124 are done too.
