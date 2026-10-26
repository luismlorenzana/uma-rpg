# H107 — The Gear tab in two views, Equip and Upgrade; one card for every accessory; the Orb on her kinds only

**uma-rpg · ChatGPT · M · Needs: H82 (live) · Unblocks: —**

## Why

The owner's review of the live game (D219, point 4), on an Uma's Gear tab: the accessories "look very asymmetrical, is
hard to even understand what is happening where":
- the **Bell** offers her three weapons' kinds;
- the **Orb** offers all ten kinds, though seven do nothing for her;
- the **Pendant** and **Insignia** offer only "Wear", and the one she wears shows no button;
- equipping, raising grades and her template's signature share one page.

The owner picked: **separate equipping from upgrading.** The Gear tab gets two views:
- **Equip:** what she wears, with one identical card for every accessory family.
- **Upgrade:** every slot's grade and the made item that raises it.

With it, **an Orb takes only a kind she can hit with**, as WP21's Bell already does (a WP22 follow-up).

## Context (read first)

- `CLAUDE.md`, `AGENTS.md` (player text short; 44 pt targets; 390×844 and 375×667; explanations behind the (i), D95),
  [change-protocol.md](../../change-protocol.md): the profile's tabs and their content are this game's, built from the
  kit's pieces (`Tabs`, buttons, chips, sheets), with **no kit change and no fork**.
- D219 (this review), D212 (H75: the four families, the signature), D217 (H79: the Gear tab by grade, the accessory
  sheet with ★), [weapon-progression](../../design/tier-rework/weapon-progression.md) WP18–WP23 and §5.8 (the presets),
  [uma-templates](../../design/tier-rework/uma-templates.md) (the signature: her family by her knack, ★ +0.2 a level
  × tier); the manual's [Stable](../../game/sections.md#stable) (Gear tab) and [classes](../../game/classes.md).
- **The code:**
  - `apps/web/src/places/stable/OutfitProfile.tsx`:
    - `TABS` and the tab dot, lines 48–53 ("Can upgrade" dots Gear while a piece or Extra Stats can);
    - `GearTab`, lines 379–410 (the preset, the gear card, the Extra Stats row; the v1 Ranks block, dead since H82).
  - `GearCardV3.tsx` (all):
    - `GradeSheet` (the multi-grade climb);
    - `AccessorySheetV3` (today's accessory sheet: chips for Bell and Orb, "Wear" for the others);
    - `GearCardV3` (the weapon, armor and accessory rows with their raise buttons; the "Wear a Bell for ★ +10" line).
  - `gear-v3.ts` (`gradeUpgradeView`, the row lines), `accessory-v3.ts` (`accessoryChoicesV3`: the Orb's ten kinds),
    `PresetButton.tsx`, `GearCard.tsx` (the v1/v3 switch).
- **The domain:** `packages/domain/src/save/forge.ts`:
  - `accessoryFormBlock` (lines 218–231: a Bell must be a kind in her slots);
  - `setAccessoryForm`, `raiseGrade` and the grade gate (Lv 5g − 4).
  - Also `economy/accessories.ts` (`signatureWorn` from G1, `signatureBonus`, `accessoryParts`) and `classPresetV3`.

## Decisions made

- **Two views inside the Gear tab**, as the kit's `Tabs`: **Equip** and **Upgrade**.
  - The profile keeps its five tabs.
  - Equip opens first. Remember the last view per session (`sessionStorage`, in a try/catch; it may be unavailable).
  - The profile tab's "Can upgrade" dot stays, and the **Upgrade** view's tab label gets the same dot.
- **Equip** (what she wears, nothing to spend):
  - **The preset row** (`PresetButton`), first.
  - **Weapons:** her class's three, each with its grade ("Katana G1"), and a small "Set on Skills ›" link to the Skills
    page. Weapons are chosen there, not here.
  - **Armor:** her half ("Physical armor", by `armorHalf`) and the five slots' grades in one line.
  - **Accessory**, one section a slot ("Accessory · G1"; R3 adds the second slot), with the four families as **cards of
    one shape**:
    - icon, name, and **★ and "Her signature: ATK and M.ATK +10"** on her signature family's card;
    - its effect at the slot's grade (G0: "Counts from G1");
    - **a kind row only for the Bell and the Orb**, listing her kinds as the Bell does today, labelled by weapon ("Katana
      · Lance · Thunder Tome") for both;
    - **one button on every card**: **Equip**, or **Equipped** (disabled) on the one she wears.
  - On the Bell and Orb cards a kind chip picks the kind, and Equip wears that family with that kind. Picking another
    kind on the card she wears turns its button back into Equip, then "Switch to Lance".
  - Her signature card comes first, then the other three in a fixed order: Bell, Pendant, Orb, Insignia.
  - The cards are inline in the view, so today's accessory sheet retires.
  - A Bell or Orb left on a kind she no longer slots shows "No Greatsword in her slots" on its card, as today.
- **Upgrade** (what she spends):
  - every slot's grade row: three weapons, five armor slots, the accessory slot or slots;
  - each row's raise button, or its blocker ("Needs 1 Weapon Gem G2", "Needs Lv 6"), as `GearCardV3` has them today;
    `GradeSheet` stays for climbing several grades;
  - then the **Extra Stats** row (open nodes, jewels to set, the map link), as today;
  - the "Grades" (i) help moves here.
- **The Orb on her kinds (WP22 follow-up):**
  - Add one domain helper, `accessoryKinds(uma, classId)`: the kinds she can hit with, which in Tier 1 are her three
    weapons' kinds. R3 adds a Dual's partner kind to this one helper, so write it as the single source.
  - `accessoryFormBlock` refuses an Orb on any other kind, with the Bell's words ("No Greatsword in her slots").
  - `accessoryChoicesV3` (or its replacement) lists only those kinds.
  - Existing saves: an Orb already on another kind stays set and does nothing (`accessoryParts`); its card says so, and
    Equip with one of her kinds fixes it.
  - Check every `classPresetV3` Orb (the Summoner's Bow, the Cleric's Blizzard) passes the new block.
  - No engine change. The fight already ignored flat offense on a kind she doesn't use, so no replay moves.
- **v1's leftovers in the tab retire.** `GearTab`'s Ranks block and `GearCard`'s v1 path are dead since H82; remove them
  and their tests with them.
- **Words** stay short. The (i) on Equip says: "What she wears. A form changes freely outside fights; its strength
  follows the slot's grade."

## Do

1. **Domain:**
   - `accessoryKinds(uma, classId)` and the Orb's block in `accessoryFormBlock`.
   - Tests in `packages/domain/src/save/`, with a fixture you make for the class: a Spell Blade's Orb on Katana is set;
     on Fire it is refused with "No Fire Tome in her slots"; the Bell is unchanged; every class's `classPresetV3`
     passes.
2. **Web:**
   - A pure `equipView(...)` (the sections and the cards: family, label, ★, effect, kinds, button state) and an
     `upgradeRows(...)` (the rows, their states).
   - The two views in `GearTab`; `accessoryChoicesV3` narrowed or replaced; `AccessorySheetV3` removed; the v1 Ranks
     block and `GearCard`'s v1 path removed.
3. **Web tests:**
   - `equipView`: four cards; ★ on her family; kind rows only on Bell and Orb, three kinds each, labelled by weapon;
     one Equipped; G0's "Counts from G1"; an Orb on an unheld kind.
   - `upgradeRows`: the rows, a ready raise, the blockers.
   - The tab dot and the Upgrade dot.
4. **The manual:** `docs/game/sections.md`, the Stable's Gear tab (both views, the cards, the Orb's kinds) and
   `classes.md`' accessory lines; a WP22 follow-up note is in weapon-progression already (D219). Run `pnpm docs:update`.
5. **Check it locally:**
   - your own ports, in a desktop browser, never the iOS Simulator;
   - a v28 save built from the CJS build: a Spell Blade and a Mage with grades, an Accessory Setting and made items in
     stock;
   - at 390×844 and 375×667, light and dark:
     - the Equip view's cards for her signature family and another;
     - equipping each family; a kind switched on the Bell and on the Orb;
     - the Orb offering only her three kinds;
     - the Upgrade view raising a weapon;
     - the dots; a G0 accessory.
   - Describe what you saw. Screenshots with original art stay local.

## Done when

- [ ] `pnpm lint && pnpm test && pnpm build` pass; say the main JS number (budget 230 KB).
- [ ] The tests in steps 1 and 3 pass; the replay tests stay green (no engine change).
- [ ] The manual matches both views; `pnpm docs:update` leaves no diff.
- [ ] A D-row is logged (fetch `main` first so the number doesn't collide). Nothing from the original games in git.
- [ ] Deployed green and https://uma-rpg.web.app/api/health shows the commit.

## Deliver

- A pull request from `feat/h107-gear-equip-upgrade` with one commit,
  `feat(web): the Gear tab's Equip and Upgrade views, one card a family, the Orb on her kinds (H107)`. Fetch `main`
  before you push. H106 may run at the same time; the two touch different files.
- **ChatGPT merges it itself** once CI is green (the owner, 2026-10-26: full autonomy to merge and deploy), then watches
  the deploy: `gh run watch <id> -R luismlorenzana/uma-rpg --exit-status`. Rerun a failed job once if it's the web
  suite's known flake (`Timeout calling "onTaskUpdate"`).
- **Flag it done:** a `docs(handoff): H107 done (D…)` commit deletes this file and adds a Done row to
  `docs/handoff/README.md`.
