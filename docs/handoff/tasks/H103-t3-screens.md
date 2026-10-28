# H103 — Release 5's screens, inert until the switch: Tier 3's branch picks, the third slot, the second weapon moon, capstones, two lines held, the master slot, the mastery

**uma-rpg · Either · L · Needs: H102 (and through it H98–H100) · Unblocks: H105**

> **Versions re-planned by D221, D224 and D230 (2026-10-27):** saves v29 (tickets-only grant), v30 (the farm by line) and
> v31 (the Wilds' trios, H114) are taken and live. Read this packet's save v29 as **v32**, v30 as **v33** and v31 as
> **v34**; engines unchanged. Materials, recipes and the three-place rows are the farm by line's
> ([farm-by-line.md](../../design/tier-rework/farm-by-line.md)): re-read them before any step that names R2's pairs, the
> ladder or a cross-line recipe.

## Why

H98–H102 built Tier 3's toolbox dark. The player meets it on screens that don't know it yet:
- the **Gear tab**: a weapon's Tier 3 doors at G5 (Keen or Tempered, Tempered or Evolved), re-forging and the late step;
  the **third accessory row** and the branches' step;
- the **Observatory**: the **second weapon moon**;
- the **Skills tab**: **depth 6 capstones**, **two lines held** a tree with a tip each, the **master slot**, the branch
  capstone and **the mastery on the root**;
- the **fight screen**: the master slot's skill and the masteries' cues.

This packet builds them so they follow the domain's live stage (`rpgRework('t3')`), the active world's tier and a
fight's own version: the deployed game shows **nothing new** until H105 flips the switch, and nothing new in a Tier 1
or Tier 2 world ever. You preview them with a local switch, never committed.

## Context (read first)

Code pointers are by file and function: Releases 1–4 move the lines. Re-read the code before starting.

- `CLAUDE.md`, `AGENTS.md` (player-facing text is short; 44 pt targets; 390×844 and 375×667; main JS ≤ 230 KB), and
  [change-protocol.md](../../change-protocol.md): nothing uma-kit draws changes here. If a screen needs a kit change,
  stop and file a "Both apps:" request in uma-platform.
- **How inert screens were built:** `git show 5dd9f08:docs/handoff/tasks/H59-classes-v2-screens.md` (D185), and H88's
  and H95's packets and D-rows (Release 3's and 4's screens: the G5 pick and its partner, accessory branches, the weapon
  moon's chip, the class plate, the line pick, the tips, the focus mark).
- **The design's screens:** [weapon-progression](../../design/tier-rework/weapon-progression.md) §8 (the Gear tab, the
  weapon sheet's Tier 3 doors, the accessory sheet's tree with the step lit, "(capped)") and §3.3 (the Tier 2 sheet's
  look-ahead line, which H88 left for Release 5); [extra-stats-progression](../../design/tier-rework/extra-stats-progression.md)
  §12 (the Observatory's Tier 3 column: two chips, "Open 30 of 30", the Set's moon choice);
  [class-progression](../../design/tier-rework/class-progression.md) §6.1 (the Skills tab, CP23), §6.4, §6.7 (the root in
  Tier 3), §7.3 (each mastery's "On screen" line); [uma-templates](../../design/tier-rework/uma-templates.md) §3.5 (the
  signature tip at both forks), §9 (where a ★ shows).
- **H98–H102's packets and D-rows:** the doors, re-forge and late step and their refusals' words; the third slot, the
  step, `kindCap(3)`; weapon moon 2's setting, its refusals ("One Split moon at most", "Weapon moon 1 has the Lance") and
  the derived second moon; `second`, `secondTips`, `master` (null: her branch capstone), `setMasterSlot`; the masteries'
  names, lines and cue labels ("Resonance", "Spellbind", "Last Stand", "+N Barrier · Overflow"); the save's shape.
- **The screens** (as Releases 1–4 left them; their names in H88's and H95's Done rows):
  - `apps/web/src/places/stable/`: `OutfitProfile.tsx` (`BattleTab`, `ClassChip`, `SkillsTab`), `SkillsPage.tsx` (R1's
    tree view: the root plate, weapon tabs, nodes with pips, `NodeCard`; H95's class tree and `classTreeView`),
    `GearCard.tsx`, `WeaponSheet.tsx` and the accessory sheet H79 wrote, `PresetButton.tsx`.
  - `apps/web/src/places/observatory/ObservatoryPage.tsx` (the map, H88's weapon-moon chip, the Set sheet).
  - `apps/web/src/battle/`: `labels.tsx`, `battle-view.ts` (the skill bar, cue text), `scene/BattleScene.ts`;
    `places/scenario-gate/FightScreen.tsx`.
  - The targets planner and "Can upgrade" (`save/targets.ts`, `save/upgrades.ts` and their rows).
  - Help sheets on the Gear tab, Skills tab and Observatory (`apps/web/src/ui/HelpButton.tsx`).

## Decisions made

- **Inert until the switch.** Every new state comes from the domain's live stage and the active world's tier, or from a
  fight's own `engineVersion`. Nothing tests `BATTLE_ENGINE_VERSION` directly. Before H105 every world looks exactly as
  it does today; after it, only Tier 3 worlds change (and Tier 2's one look-ahead line).
- **The local switch** (to preview; **never commit it**), exactly H105's change:
  1. `packages/domain/src/rpg/battle/caps.ts`: `BATTLE_ENGINE_VERSION = 21`;
  2. `packages/domain/src/save/save.ts`: `SAVE_SCHEMA_VERSION = 31`;
  3. `packages/domain/src/save/migrations.ts`: chain `toV31(world, tier)` after `toV30` (`version < 31`).
  Restart the API and the web; a scratch v30 save in your worktree's `apps/api/.data` migrates on load.
- **The Gear tab, Tier 3:**
  - A weapon row reads branch, grade, Might and multiplier from `rpgBranchName` and `rpgWeakMultiplier`: "Keen Lance ·
    G7 · Might 91 · weak ×1.7", "Tempered Lance + Katana · weak ×1.5", "Evolved Lance + Bow · weak ×1.5".
  - The weapon sheet's G5 step offers its line's two doors, each with what it is: a Pure's "Keen · weak ×1.7" and
    "Tempered · + Katana · both ×1.5"; a Dual's "Tempered · keep the Katana" and "Evolved · + Bow"; Base's "Pure ·
    Dual". Re-forge reads "Re-forge · 1 Branch Gem" with its line's other door; the late step "Take the Tier 3 step". A
    blocked door says why, in H98's words ("Two two-kind weapons in her slots in Tier 3").
  - **In Tier 2**, from the switch on, the sheet's look-ahead line names Tier 3's doors (§3.3): "Pure: Keen, or
    Tempered + Katana, in Tier 3" · "Dual + Katana: Tempered, or Evolved + Bow".
  - **Three accessory rows**; the accessory sheet draws each family's tree with every branch open in Tier 3 and the
    step lit from the slot's G5, each form's value at her grade ("Great Orb · Lance · G6 · +44"), a capped kind
    "(capped)", her signature family first with its ★. A family she wears in another slot is shown, not offered.
- **The Observatory, Tier 3:** weapon moon 2 on the outer orbit beside moon 1; **two chips** under the map ("Weapon
  moon 1 · Full · Lance ▾", "Weapon moon 2 · Split · Katana + Lightning ▾"); a derived moon (her preset, or moon 2's
  complement) reads "(preset)" until she sets it; each picker lists her three slotted kinds first and refuses as H99
  does; the header "Open 30 of 30"; totals with both moons' kinds; a Moon Jewel's Set asks which moon, the one furthest
  behind first.
- **The Skills tab, Tier 3:**
  - Each weapon tree draws depth 6 under each line's tip, faded with "Class Rank 50" until open; capstones show no
    rank pips (they open whole).
  - **Two lines held:** the fork's lines are tapped to hold two ("Holds A and B"); a third tap swaps out the second.
    Each held line shows its tip fork (Power, Break, and the ★ signature tip at **both** forks of her lead tree).
  - The class tree adds her branch capstone at Class Rank 50; **the root plate** shows her mastery, faded until Class
    Rank 50: "Spellbind · Both halves weak: +20%." (each class's line from CP27's "On screen" column).
  - **The master slot:** a slot beside her ten labelled "Master", from Class Rank 50, taking only a capstone she holds;
    empty reads "Chosen for her" (her branch capstone).
- **The fight screen** reads the fight's version: the master slot's skill on her skill bar beside her ten; cues
  "<Uma>'s Resonance" on an echo, "Spellbind" on a pair's first hit, "Last Stand" when an Uma stays at 1 HP,
  "+N Barrier · Overflow"; Menagerie's summons show their farewells as today's farewell cues. No new stage animation.
- **Targets and "Can upgrade"** (Tier 3): a Branch Gem in stock a weapon can use (its G5 step, the late step); the
  third slot's grades; weapon moon 2's jewels. Targets plan a Branch Gem at G5 and both moons' jewels.
- **Help sheets** on the Gear tab, Skills tab and Observatory get one Tier 3 line each, shown only in a Tier 3 world
  after the switch; no paragraph explains a formula (D95).
- **The manual** stays as it is (H105 rewrites it). Note in your delivery each screen whose words H105 must carry into
  `docs/game/sections.md`.
- **Main JS:** the Stable, the Observatory and the fight screen are lazy chunks; keep Tier 3's strings and helpers
  there. Say the number.

## Do

1. **The Gear tab:** weapon rows and the weapon sheet's doors, re-forge and late step; Tier 2's look-ahead line; the
   third accessory row and the sheet's stepped tree.
2. **The Observatory:** moon 2, its chip and picker, "(preset)", the Set's moon choice, the header and totals.
3. **The Skills tab:** depth 6, two held lines with their tips, the branch capstone, the mastery on the root plate, the
   master slot.
4. **The fight screen:** the master slot on the skill bar, the masteries' cue text.
5. **Targets, "Can upgrade" and help sheets** as decided.
6. **Tests** (pure helpers with an explicit engine or tier, extracted where a component holds the logic):
   - the weapon sheet's doors: a Tier 3 Pure at G4 offers Keen and Tempered + its partner; a Dual Tempered and Evolved;
     Base Pure and Dual; re-forge offers its line's other door; the late step on a G7 Pure; a Tier 2 weapon's look-ahead
     line names both doors; at engine 20 a Tier 3 world offers Release 4's doors and no look-ahead line;
   - the accessory sheet: three slots in Tier 3 at engine 21 (two at 19); a Great Orb at a Tier 3 slot's G3 open at its
     Tier 2 share (1.2, × 2.6) and at G6 at the step's (1.3: +44); "(capped)" at 177;
   - the Observatory's pickers: a kind on the other moon and a second Split refused, Full + Full allowed, a derived moon
     marked "(preset)";
   - the Skills tab (`classTreeView` and the tree view's helper): two held lines, a third tap swaps the second, the
     signature tip offered at both forks of the lead tree only, depth 6 faded below Class Rank 50, the master slot
     listing only held capstones;
   - `battle/battle-view.test.ts`: on a v21 state the master skill is on the bar and each mastery cue reads as decided;
     a v20 state shows neither;
   - every existing web test passes unchanged.
7. **Check it locally** (your own ports; a desktop browser; never the iOS Simulator), on a scratch v30 save from the CJS
   build with Tier 1, 2 and 3 worlds, the Tier 3 world in H102's fixture shapes (a Pure at G7, a Dual at G3, two
   accessory slots, a Split moon, a C line with a Break tip, an Uma at Class Rank 50):
   - **without** the local switch: every world's screens as today;
   - **with** it, at 390×844 and 375×667, light and dark: the Tier 3 Gear tab (the G7 Pure's "Take the Tier 3 step",
     the doors at a G4, re-forge, the third row and its stepped sheet), the Observatory's two moons and refusals, the
     Skills tab (two lines, tips, depth 6 at Class Rank 50, the master slot, the mastery on the root), a Tier 3 fight on
     Auto and by hand with the master skill and a mastery's cue; a Tier 1 world unchanged and a Tier 2 world changed
     only by the look-ahead line.
   - Describe what you saw. Say which screens touch the edges (the owner checks them on the phone after H105).

## Done when

- [ ] `pnpm lint && pnpm test && pnpm build` pass; say the main JS number (gzip, of 230 KB).
- [ ] The tests in step 6 pass; the domain's v20 replay tests stay green.
- [ ] `git diff` has no switch: `BATTLE_ENGINE_VERSION` 20, `SAVE_SCHEMA_VERSION` 30, `toV31` unchained.
- [ ] Both local checks in step 7 were done and described. Nothing from the original games in git; screenshots with
  original art stay local.
- [ ] `docs/game/` is unchanged and `pnpm docs:update` leaves no diff; the D-row is logged (fetch `main` first);
  weapon-progression §8, extra-stats-progression §12 and class-progression §6.7 gain "Screens built in H103 (D…), live
  from H105."
- [ ] Deployed green and https://uma-rpg.web.app/api/health shows the commit; the live game looks as before.

## Deliver

- **A delegated worker (Claude or ChatGPT):** a pull request from `feat/h103-t3-screens` with one commit,
  `feat(web): Release 5's screens, inert until the switch (H103)`. Fetch `main` before you push. Claude's main session
  reviews and merges it (ChatGPT may merge its own), then watches the deploy.
- **Flag it done:** after the merge, a `docs(handoff): H103 done (D…)` commit deletes this file, sets H103 to Done in
  `docs/handoff/README.md` with a Done row (the screens H105 must describe), and sets H105 to Ready if H104 is done.
