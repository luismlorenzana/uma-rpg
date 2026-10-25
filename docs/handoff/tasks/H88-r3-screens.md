# H88 — Release 3's screens, inert until the switch: the G5 branch pick and its partner, accessory branches, the weapon moon, the secondary, targets and "Can upgrade"

**uma-rpg · Either · L · Needs: H87 (and through it H83–H86) · Unblocks: H90**

## Why

H83–H87 built Tier 2's weapons dark: weapon branches and their Branch Gem, the second accessory slot and its forms, the
weapon moon, the secondary profession, save v29. The player meets them on screens that don't know them yet:
- **the Gear tab and the weapon sheet:** a weapon's branch, its weak multiplier, the **G5 pick of Pure or Dual** with
  the Dual's partner and what it answers, re-forging, the two-kind cap's refusals
  ([weapon-progression.md](../../design/tier-rework/weapon-progression.md) §8);
- **the accessory rows and sheet:** two slots, each family's tree with the forms her slot's grade has opened, the cap;
- **the Observatory and the Battle tab:** the weapon moon, Full or Split
  ([extra-stats-progression.md](../../design/tier-rework/extra-stats-progression.md) §12);
- **the Work tab and the place pages:** the secondary pick, its fee, the pickers' order, "Her main trade's work"
  ([profession-progression.md](../../design/tier-rework/profession-progression.md) §2.3, §4.3, §4.4);
- **targets and "Can upgrade"** for all of it.

This packet builds them so they follow the domain's live stage (and a fight's own version): **the deployed game shows
nothing new until H90.** You preview them with a local switch, never committed.

## Context (read first)

Code pointers are by file and function: Releases 1 and 2 move the lines. Re-read the code before starting.

- `CLAUDE.md`, `AGENTS.md` (**player-facing text is short**; 44 pt targets; 390×844 and 375×667; main JS ≤ 230 KB),
  [change-protocol.md](../../change-protocol.md) (nothing uma-kit draws changes here: the rows, sheets and pages are
  uma-rpg's on the kit's existing `Sheet`, tabs and chips; if you find you need a kit change, stop and file a "Both
  apps:" request in uma-platform).
- [implementation.md](../../design/tier-rework/implementation.md) (D198) §2's conventions; **the D-rows of H83–H87**
  (H83's first row: Release 3's build decisions, point 9 the local switch, point 10 the names) and each of those
  packets' "Decisions made" for the exact rules, values and refusal texts.
- The design's screens: weapon-progression **§8**, §3.2 (the branch names, the partner table), §5.3–§5.6 (forms, the
  cap), §5.10 (★ lines); extra-stats-progression **§4.1, §12**; profession-progression **§2.3, §4.3, §4.4**, §4.2's
  quick-look row; uma-templates §3.4 and §5 (★ on her signature family).
- **Release 2's screens** (H79 and H80's Done rows say what they built and where): the Gear tab by grade, the
  weapon, armor and accessory sheets, the targets planner, "Can upgrade", the Observatory with her moon, the Battle
  tab's Offense group, the Work tab, the ten place pages and their quick looks.
- **The domain you read** (all stage-aware, defaulting to the live switch): `rpgRework('t2Weapons')`;
  `rpg/weapon-branches.ts` (`rpgPartnerOf`, `rpgWeakMultiplier`, `rpgTwoKindCap`, `rpgDualBlock`, `rpgSlotBlock`,
  `rpgBranchName`); the G5 step and `reforgeWeapon` (H83); H84's accessory table (`accessorySlots`,
  `accessoryFormOpen`, `accessoryFormValue`, `kindCap`) and setter; H85's `observatoryNodeCount`, `setWeaponMoon`,
  `clearWeaponMoon`, `weaponMoonPreset`; H86's `setSecondary`, `secondaryChoices`, `workerOrder`; `umaBattleSheet`;
  `battleWeakFor`; `save/targets.ts` (`targetDemand`, `targetPlan`, `facilityTargets`); `save/upgrades.ts`
  (`upgradesFor`).
- **The screens** (by file, as Release 2 left them): `apps/web/src/places/stable/` (`OutfitProfile.tsx`: `GearTab`,
  `BattleTab`, `WorkTab`, `tabDot`; `GearCard.tsx`, `WeaponSheet.tsx` and the accessory sheet H79 wrote,
  `PresetButton.tsx`); `places/observatory/ObservatoryPage.tsx`; `places/work/FacilityPage.tsx` and the quick looks;
  `battle/` (the fight screen's ally chip, `battle-view.ts`'s target hints); `ui/HelpButton.tsx`.

## Decisions made

- **Inert until the switch.** Every new screen state comes from the live stage (`rpgRework('t2Weapons')` through the
  domain's functions) or from a fight's own `engineVersion`. Before H90 the game looks exactly as it does today; an open
  v17 fight after the switch shows no Toll Bell pips.
- **The local switch** (to preview; **never commit it**), exactly H90's change:
  1. `packages/domain/src/rpg/battle/caps.ts`: `BATTLE_ENGINE_VERSION = 18`;
  2. `packages/domain/src/save/save.ts`: `SAVE_SCHEMA_VERSION = 29`;
  3. `packages/domain/src/save/migrations.ts`: chain `toV29` after `toV28` (`version < 29`), passing the world's tier.
  Restart the API and the web; a scratch v28 save in your worktree's `apps/api/.data` migrates on load.
- **The Gear tab's weapon rows** (WP §8): "Dual Lance + Katana · G7 · Might 63 · weak ×1.3", "Pure Greatsword · G10 ·
  Might 122 · weak ×1.5", a base weapon "Lance · G4 · Might 22 · weak ×1.3"; names from `rpgBranchName`, Tomes by
  element ("Pure Fire"). Tier 1 rows keep Release 2's words (no "weak" there; nothing branches).
- **The weapon sheet** (Tier 2 and 3 worlds):
  - **At G4, the G5 step** shows two choices, each one tap, under "G4 → G5 · 1 Branch Gem":
    "**Pure** · weak ×1.5" and "**Dual + Katana** · the Dark twins and Twilight" (the partner and the twin sets it
    answers: an Arm or an element answers its twin set; the Bow and the Katana also Twilight). A blocked Dual is shown
    disabled with its reason ("One two-kind weapon in her slots in Tier 2"; "Her Spell Blade slots the Katana, the
    Lance's partner"); no gem: "No Branch Gem in the Warehouse"; under Lv 21: "Opens at Lv 21". The pick asks once in a
    sheet ("Make the Lance Dual + Katana? · 1 Branch Gem"), as the preset's bind does (D164).
  - **A branched weapon** shows its line ("Dual + Katana · weak ×1.3") and **"Re-forge · 1 Branch Gem"** offering the
    other branch, with the same blocks. **A weapon at G5+ with no branch** (raised before R3) shows "Pick a branch · 1
    Branch Gem" with both choices.
  - **No Tier 3 doors line** (WP §3.3's "Pure: Keen, or Tempered + Katana, in Tier 3"): R5 adds it with the branches it
    names (H83's point 10). A Tier 3 world's weapon that arrived with a branch shows it from G0; its G5 step is the
    same pick.
- **Slotting a weapon** (the weapon picker) shows a refused kind disabled with `rpgSlotBlock`'s reason.
- **The accessory rows:** one in Tier 1, two from Tier 2: form, kind, grade, what it adds ("Great Bell · Lance · G6 ·
  her Attack, then her Lance at 0.84", "Great Orb · Light · G10 · +74", "Onslaught · G8 · first act each wave +20%"),
  "(capped)" where the cap bound, ★ on her signature family (H75's). Each has its Upgrade pill.
- **The accessory sheet** draws **each family's small tree**: the base and its two branches, the forms her slot's grade
  has opened lit with their value at her grade, the others dimmed with "Opens at G5"; her signature family first with
  its ★ and bonus (H75's line); a family she already wears in the other slot disabled ("She wears a Bell already").
  Picking a form that needs a kind opens one step: a kind (Orb, Great Orb, the Bells: her three slotted first), a twin
  set (Twin Orb: "the Lightning twins · Lance, Lightning"), or two of one channel (Channel Pendant). No new art: a branch
  shows its family's icon with its name on the chip (WP29).
- **The Observatory** (EP §12): "Open n of 25" in Tier 2 and 3 worlds (`observatoryNodeCount`); the weapon moon on the
  outer orbit, one moon named for its kind or two moonlets on one track ("Lance · Greatsword"), five nodes; a node's
  sheet ("Weapon moon III · Split · Lance +13, Greatsword +13 · Moon Jewel III · open" or locked "… opens at Lv 26");
  the totals add "Lance +63 · Greatsword +63"; **the chip** "Weapon moon · Split · Lance + Greatsword ▾" opens a sheet:
  Full or Split, then the kinds (her three slotted first, then the rest), "Use the preset" (it clears her setting, H85);
  a small "Preset" tag on the chip while she follows it. The Set list takes the weapon moon in its order. Tier 1
  unchanged.
- **The Battle tab's Offense group:** "Lance moon +90" (or the two Split lines), "(capped)" on a capped kind, grey "No
  Bow in her slots" where a setting names a kind she doesn't slot (H84, H85's sheet rows).
- **The Work tab** (from Tier 2): her places "Craft Lv 23 · Forest · Armorer · + Fishery" and **the secondary**: eight
  tiles in two rows (gathering, crafting) from `secondaryChoices`, each with its icon, the head count ("3 Umas") and a
  dot where its place's targets are short; hers marked; a tap asks in a sheet ("Fishing as her secondary? · Free" or
  "· 2,000 Laurels"), with the block if any ("She's working at the Fishery"). Tier 1 unchanged.
- **The place pages** (PP §4.4): the Who step lists `workerOrder`'s groups (her trade, then secondaries, then the rest
  greyed "Another trade"); a job a secondary can't take shows "Her main trade's work"; a gathering place's What step
  marks Tier 2's row "Main trade"; its quick look marks Tier 2's types "Main trade" (§4.2); the Forge's G5 in Tier 2+
  is the Branch Gem ("the branch is picked on her weapon's sheet", a one-line note).
- **Targets** (D100, WP §8, EP20): the planner lists the Branch Gem at a weapon's G5 from Tier 2 (a weapon at G5+ with
  no branch plans none: v29 gave its gem); the weapon moon's five Moon Jewels; both accessory slots' Settings, a slot's
  G5 labelled "opens two branches". Extend `targetDemand` and its tests in the domain.
- **"Can upgrade"** (H34, `upgradesFor`): a Branch Gem in stock for a weapon she can take to G5 (Lv 21+), or for a
  weapon at G5+ with no branch; **an accessory slot at G5+ still on its base form** (each Great branch beats its base
  everywhere, WP §5.7); a Moon Jewel she can set on her weapon moon. Each with its dot on the Gear tab or the
  Observatory as Release 2's are.
- **The fight screen:** a Toll Bell's rings as pips on her chip (from the state's `tolls`, v18 fights only); target hints
  read `battleWeakFor` so a Dual's partner-weak foe shows weak; no new cue or animation (a weak hit's cue is as today).
- **Help** (one (i) each, only where it helps, D95): the weapon sheet's "Pure: weak hits ×1.5. Dual: its partner's
  foes are weak to it too (×1.3). One two-kind weapon in her slots in Tier 2." The accessory sheet's "From a slot's G5,
  each family has two more forms. Change them any time." The Observatory's "A weapon moon adds offense to one kind
  (Full) or two at 0.7 (Split)."
- **The manual** stays as it is; H90 rewrites it. Note in your delivery each screen whose words H90 must carry into
  `sections.md`.
- **Main JS:** the Stable's pages, the Observatory and the place pages are lazy; `weapon-branches.ts` and the small
  tables are in the main bundle. Keep strings in the lazy pages; say the number.

## Do

0. **Armor halves** (H83's decision 13): on the Gear tab's armor rows in a Tier 2+ world, a Spell Blade, Summoner,
   Paladin or Cleric taps a piece to switch its half; the row shows the piece and "+n ATK" or "+n M.ATK", and the
   sheet says "Defense stays the same". A Brawler's and a Mage's rows don't offer it.
1. **Gear:** the weapon rows, the weapon sheet's G5 pick, re-forge and "Pick a branch", the weapon picker's blocks, the
   accessory rows and sheet.
2. **Observatory and Battle tab:** the weapon moon, its chip and sheet, the totals and the Offense lines.
3. **Work tab and place pages:** the secondary tiles and sheet; the pickers' order; "Her main trade's work"; "Main
   trade" rows; the Forge's G5 note.
4. **Targets and "Can upgrade"** in the domain selectors and their dots.
5. **The fight chip's pips** and the target hints; the three help lines.
6. **Tests** (extract each screen's pure helper with an `engine` argument where it isn't one already):
   - weapon rows: base, Pure and Dual texts at Tier 2; Tier 1 unchanged; the G5 step's two options with a legal Dual,
     a capped one and a partner-blocked one; re-forge's offer; "Pick a branch";
   - the accessory sheet's tree at a slot's G4 (branches dimmed "Opens at G5") and G5 (lit with values); the signature
     family first; the other slot's family disabled; "(capped)";
   - the Observatory: node count 20 and 25; the chip's text for Full, Split and the preset tag; a weapon-moon node's
     sheet;
   - the Work tab's eight tiles in two rows with head counts and the dot; the fee line; the place picker's three groups;
   - `targetDemand`: a Tier 2 Uma's Branch Gem at G5 and none for a G7 weapon without a branch; five Moon Jewels for
     the weapon moon; two slots' Settings; `upgradesFor`: each of the four new cases, the switch mocked to 18 with
     H64's `capsAt` (`rpg/battle/caps-at.fixture.ts`);
   - the fight chip's pips from a v18 state with `tolls`, and none on a v17 state;
   - every existing web test passes unchanged (the live screens are today's).
7. **Check it locally** (your own ports; a desktop browser; never the iOS Simulator) on a scratch **v28 two-tier save**
   from the CJS build with: a Tier 2 Uma with the Lance at G4 and a Branch Gem in stock, one with a weapon at G7 and no
   branch, one at Lv 30 with an accessory slot at G6, a Mage in a run with few Mages, a Forge queue:
   - **without** the local switch: every screen as today;
   - **with** it, at 390×844 and 375×667, light and dark: the G5 pick (Pure, Dual + Katana, a blocked Dual), re-forge,
     "Pick a branch" on the G7 weapon; two accessory rows, the sheet's trees, a Great Orb set and the cap; the
     Observatory's weapon moon, its chip, a Moon Jewel set on it; the Battle tab's moon line; the Work tab's eight tiles,
     a secondary picked free and changed for 2,000 Laurels; a place page's three groups and "Her main trade's work";
     the planner's Branch Gem and moon jewels; "Can upgrade" dots; a v18 Tier 2 fight on Auto with a Toll Bell's pips.
   Describe what you saw; say which screens touch the edges (the owner checks them on the phone after H90).

## Done when

- [ ] `pnpm lint && pnpm test && pnpm build` pass; say the main JS number (of 230 KB).
- [ ] The tests in step 6 pass; every domain replay test stays green.
- [ ] `git diff` has no switch: `BATTLE_ENGINE_VERSION` 17, `SAVE_SCHEMA_VERSION` 28, `toV29` unchained.
- [ ] Both local checks in step 7 were done and described. Nothing from the original games in git; screenshots with
  original art stay local.
- [ ] `docs/game/` is unchanged and `pnpm docs:update` leaves no diff; the D-decision is logged; weapon-progression §8,
  extra-stats-progression §12 and profession-progression §4.4 gain "Screens built in H88 (D…), live from H90."
- [ ] Deployed green and https://uma-rpg.web.app/api/health shows the commit; the live game looks as before.

## Deliver

- **A delegated worker (Claude or ChatGPT):** a pull request from `feat/h88-r3-screens` with one commit,
  `feat(web): Release 3's screens, inert until the switch (H88)`; the body lists every screen and its words for H90.
  H89 edits the domain's balance harness and generators at the same time (no web files): rebase if your domain edits
  (`save/targets.ts`, `save/upgrades.ts`) meet. Fetch `main` before you push so the D-number is free. Claude's main
  session reviews and merges it; ChatGPT may merge its own, logging its decisions (CLAUDE.md). Then the deploy is
  watched.
- **Flag it done:** after the merge, a `docs(handoff): H88 done (D…)` commit deletes this file, sets H88 to Done with a
  Done row (the screens and their words, for H90's `sections.md`), and sets H90 to Ready if H89 is done.
