# H79 — R2's screens, gear and stars (inert): the Gear tab by grade, the accessory picker, ★ the signature, the targets planner, "Can upgrade", the Observatory with her moon, the Signature facet

**uma-rpg · Either · L · Needs: R1's H70, H73, H75, H76, H78 · Unblocks: H82**

## Why

H74–H78 built R2's gear and Extra Stats dark. The player meets them on screens that don't know them yet:
- **the Gear tab** shows crafted pieces bound for good; R2 shows **grades**: three weapons, five armor slots and one
  accessory slot, each raised by a made item from the Warehouse at Uma Lv 5g − 4;
- **the accessory sheet** offers Talismans and Amulets; R2 offers **the four families' base forms**, her **★ signature**
  family first;
- **the Observatory** draws a Sun, eight planets and active toggles; R2 draws **the Planet, three moons and ★ her moon**,
  every open node counting, set with jewels;
- **"Can upgrade"** and **the targets planner** read crafted pieces and Star Gems; R2 reads grades, made items and jewels;
- **the Stable** filters by Calling, Stride and Knack (R1); R2 adds **Signature** (UT15).

This packet builds them so they follow the save's shape and the live stage, which means the deployed game shows
**nothing new** until H82. You preview them with the local switch, never committed.

## Context (read first)

- `CLAUDE.md`, `AGENTS.md` (player text short; 44 pt targets; 390×844 and 375×667; no slice jargon; explanations behind
  the (i) `HelpButton`, D95), [change-protocol.md](../../change-protocol.md) (nothing here is uma-kit's: the Stable's tabs,
  sheets and facet lists are this game's content on the kit's pieces).
- **R2's build decisions** (H74's first D-row: point 10 the art pin, point 14 the local switch) and the D-rows of H74–H78;
  **R1's H70** (its Done row and code: the Skills tab, the Gear tab's three weapon rows, the template chip and card, the
  Stable's Template facets) and H67 (`umaTemplate`).
- The design's screens: [weapon-progression.md](../../design/tier-rework/weapon-progression.md) **§8** (the Gear tab, the
  weapon and accessory sheets, the planner, the art), §3.1 (the upgrade line's words), §4.4, §5.10 (the signature's
  lines), WP29; [extra-stats-progression.md](../../design/tier-rework/extra-stats-progression.md) **§12** (EP19, EP20),
  §6.7 (her moon on screen), §3.5 (the Set list's order); [uma-templates.md](../../design/tier-rework/uma-templates.md)
  **§5** (UT14: every ★; UT15: the Signature facet); the previews `previews/uma-profile.html`,
  `previews/weapon-accessories.html`, `previews/stars-maps.html` (layouts to follow, words from the docs).
- **The domain you read** (H74–H78): `gradesOf`, `isGrades`, `gradeOf`, `mightAt`, `armorValues`, `raiseBlock`,
  `raiseGrade`, `raiseGradeTo`, `raisePlan`, `accessorySlotCount`; `accessoryParts`, `accessoryFlatValue`,
  `ACCESSORY_FAMILY_LABEL`, `signatureBonus`, `signatureWorn`, `setAccessoryForm`, `classPresetV3`, `wearClassPreset(…,
  family)`; `MAP_NODES`, `mapPoints`, `mapNodeGate`, `nodeJewel`, `jewelNodes`, `setJewel`, `starMapOf`; `madeName`,
  `madeRecipe`, `materialIdentity`, `items/materials.ts`' `art`; `TierGrant`.
- **The code** (lines on `421eacd`; H70 moved the Stable's):
  - `apps/web/src/places/stable/GearCard.tsx` 20–72; `WeaponSheet.tsx` 1–233 (`pieceLine`, `WeaponSheet`, `ArmorSheet`,
    `AccessorySheet`); `accessory-slots.ts`; `PresetButton.tsx`; `OutfitProfile.tsx` (the tabs and their "Can upgrade"
    dots at 47, the battle sheet's rows at 260–275, the rank bars).
  - `places/observatory/ObservatoryPage.tsx` (all); `items/planets.ts`; `items/frames.ts` 5–48 (`SHEET_SIZE`, the rows,
    `iconFrame`) and `frames.test.ts`; `items/ItemIcon.tsx`; `items/outputs.ts`.
  - `album/rows.ts` and H70's `stableFacets(engine)` (the Stable's live facet list); `places/party-hall/PartyHallPage.tsx` (the Uma chip).
  - `save/game.ts` 256–290 (the Observatory's, the Forge's and the preset's actions; `hold`).
  - The domain's `save/sheet.ts` (`umaBattleSheet`), `save/upgrades.ts` (`upgradesFor`), `save/targets.ts`
    (`targetDemand`, `targetPlan`, `facilityTargets`): their v3 branches are this packet's.
  - `apps/web/package.json` 15: `@luismlorenzana/uma-art` 2.12.0.

## Decisions made

- **Inert until the switch.** A v3 screen shows only for a graded Uma (`isGrades`) or a `StarMap`, which only a v28 save
  holds, or where a rule reads `rpgRework('economy')`. Before H82 the game looks exactly as it does today. **The local
  switch** (to preview; never commit it), exactly H82's: `caps.ts` `BATTLE_ENGINE_VERSION = 17`, `save.ts`
  `SAVE_SCHEMA_VERSION = 28`, `migrations.ts` chaining `toV28` (`version < 28`); restart the API and the web, and a
  scratch v27 save in your worktree's `apps/api/.data` migrates on load.
- **uma-art 2.13.0** (H73's release, or the version it reports): pin it, with `SHEET_SIZE.items` 320×1216 (the web test
  checks the atlas). If H80 pinned it first, keep its pin.
- **Icons** (`items/frames.ts`; WP29, EP22, no new art beyond H73's):
  - a **material** by its `art` family and grade on the `items` sheet (raw rows: `fish` 4, `vegetables` 8, `ores` 20,
    `crystals` 22, `woods` 28; refined one row below), so `iron-ore` still draws Ores G3 and `carrot` the farm's Carrot;
  - a **made item** on H73's rows: Weapon Gem row 34, Armor Fittings 35, Accessory Setting 36 (x by grade), the Branch Gem
    at (0, 1184);
  - **Planet Jewels I–V** on the gem sheet's Sun prisms **`gem-sun-4`, `gem-sun-4`, `gem-sun-6`, `gem-sun-8`,
    `gem-sun-10`**: EP22 names the Sun prisms, which are four for five jewels, so I and II share the 4-ray prism (the
    nearest at or above its grade); their names and grade chips tell them apart everywhere they show;
  - **Moon Jewels I–V** on the `limit` crescent row, **`gem-limit-2`, `-4`, `-6`, `-8`, `-10`** (EP22's "one planet's
    moon-gem row"; the crescent reads as a moon, and Limit is off the v3 map, so no stat is confused);
  - **accessory forms** on the gear sheet at the slot's grade: a **Pendant** the `charm` row, an **Insignia** the `ring`
    row, an **Orb** its `orb-<kind>` row, a **Bell** the Talisman rows for Arms kinds (Greatsword `talisman-vital`, Axe
    `-vampire`, Lance `-bulwark`, Bow `-iron`, Katana `-thorn`) and the Amulet rows for Tome kinds (Fire `amulet-spring`,
    Ice `-siphon`, Lightning `-veil`, Light `-ward`, Dark `-mirror`), each with its kind badge (`IconFrame.kind`); a G0
    slot or one with no family draws a dashed frame, as a Training piece does.
  H80 needs the same table: if it lands first it writes it, verbatim from here; the second packet rebases.
- **The Gear tab** (a graded Uma; WP §8's words, short):
  - **Weapons**, her class's three (H70's rows): "Greatsword · G7 · Might 35 · weak ×1.3" (Might × tier).
  - **Armor**, five slots, her class's half: "Head · Helm · G4 · DEF +16" (the slot's stat × tier; feet "Evasion 4.8%").
  - **Accessory**, one slot: "Bell · Greatsword · G6 · after her Attack, her Greatsword at 0.6"; "Pendant · G6 · +5 on
    her three kinds"; "Orb · Fire · G6 · +13 Fire offense"; "Insignia · G6 · +9% on sub-bosses and bosses"; "★ +6" on it
    when it is her signature family; "Accessory · G0 · Pick a form" when it has none.
  - **Each row's Upgrade pill:** "G4 → G5 · 1 Weapon Gem G5" when the Warehouse holds it and her level allows (one tap,
    `raiseGrade`), else the reason ("Needs Lv 21", "Needs 1 Weapon Gem G5"); "Up to G7" in the sheet climbs several
    grades after a confirm that lists the items first (`raisePlan`, `raiseGradeTo`).
  - **"Use the standard preset"** (H33's button) calls `wearClassPreset(…, family)` with her template's family; its
    confirm sheet lists the changes, as D164's does.
  - The Weapon, Armor and Accessory Rank bars go for a graded Uma; Class Rank stays.
- **The sheets:** the weapon sheet (H70's tree sheet) gains its grade line (now and next Might, the upgrade); the armor
  sheet its slot's grade, stat and offense now and next, and the upgrade (the half isn't a choice in R2: "Her class's
  half"); **the accessory sheet** lists the four families' base forms with their values at her slot's grade, **her family
  first with ★ and "ATK and M.ATK +6 (her signature)"**, an Orb's kind picker (ten kinds) and a Bell's (her three
  weapons' kinds; a Bell set on a kind she no longer slots reads "No Fire Tome in her slots"), and the slot's upgrade.
  Changing a form never touches the grade (`setAccessoryForm`). Unworn, her signature is a grey line on the Gear tab:
  "Wear a Bell for ★ +6".
- **The battle sheet** (`save/sheet.ts`, a v3 branch; lazy, as H57 placed it): Offense: ATK, M.ATK (gear and Extra Stats
  parts), Might per weapon, the accessory's line ("Bell: Greatsword 1.0 after her Attack", "Orb: Fire +34", "Pendant: +14
  on her three kinds", "Insignia: +15% on sub-bosses and bosses"), **"Signature +10 ★"** when worn; Defense: DEF, M.DEF,
  Evasion (no cut, shield, Thorns or Mirror rows); Sustain: HP, a healer's Mends, MP and R1's rows (the base regen, the
  Flourish); Other: Limit start. Her moon's points show starred in the Extra Stats part ("DEF +51 ★ +8").
- **The template card and chips** (UT14): H70's card gains "Signature · Bell · +6 now · worn" (or "Wear a Bell") and
  "Moon · I HP +20 (open) · II DEF +8 (Lv 36)"; the Party Hall's Uma chip carries "★ Bell" (WP §5.10).
- **The Observatory** (a `StarMap`; EP19, EP20; §6.7):
  - header: her face (tap to choose) and **"Open 12 of 20 · ★ 1 of 2"**;
  - **the map in code, 360×360:** the Planet at the centre with its five nodes round it; Prowess at the top, Vigor and
    Guard below on one orbit, five nodes each; **★ her moon** on a small orbit of its own, named "{type}'s moon"
    ("Ironhide's moon");
  - a tapped node's sheet: "Prowess III · as Spell Blade ATK +4, M.ATK +2 · Moon Jewel III · open"; locked: "Guard IV ·
    DEF and M.DEF +8 · needs a Moon Jewel IV · opens at Lv 36"; her moon's "★ Ironhide's moon I · Tireless · HP +20 · Moon
    Jewel II · opens at Lv 16";
  - Prowess's line: "Prowess · Spell Blade 70/30: ATK +21, M.ATK +9" (re-split when her class changes);
  - totals under the map: HP, MP, ATK, M.ATK, DEF, M.DEF, starred where her moon adds;
  - **Set:** jewels in stock she can set now ("Planet Jewel III ×2 · Opens Planet III · +4 to every stat · Set"); a Moon
    Jewel's Set asks which moon, in `jewelNodes`' order, the one furthest behind first, ★ her moon among them; no toggles.
  The v1 Observatory stays for a v1 map.
- **"Can upgrade"** (`save/upgrades.ts`, a v3 branch, pure and cheap as H34's): a weapon of her three, an armor slot or the
  accessory slot whose next grade's made item is in the Warehouse and her level allows; an accessory slot at G1 or above
  with no family; jewel kinds in stock she can set now (`jewelNodes` not empty). No side points (R1), no free nodes.
  `UmaUpgrades` gains `grades: GradeTarget[]` and `jewels`; `any` covers them, so the Stable's mark and the profile's dots
  (H34) follow unchanged.
- **The targets planner** (`save/targets.ts`, a v3 branch; D100, D126 kept): a graded target's demand, as her active
  class: every grade above hers to G10 on her class's three weapons, her five armor slots and her accessory slot (their
  made items), and every map node not open, the 20 shared and her moon's two (`template:1` a Moon Jewel II, `template:2` a
  Moon Jewel IV); recipes `madeRecipe(id, tier)` then each refined item's raw pair; `targetPlan(world, activeClassOf,
  tier)` gains `made` (v1's `gear` and `gems` stay for v1, empty in v3); `facilityTargets(plan, placeId)` v3: a gathering
  place its line's raw types, the Workbench refined types, the Forge Weapon Gems, the Armorer Fittings, the Charm Shop
  Settings, the Lapidary jewels. H80's place strips read it.
- **The Stable's Signature facet** (UT15): the Template group gains **Signature** (Pendant, Orb, Bell, Insignia) with its
  counts, from `umaTemplate`'s family, on locked outfits too, in H70's `stableFacets(engine)` by the economy stage (no kit
  change). H80 adds the
  Trade facet in the same list: rebase on whichever lands first.
- **Help:** one (i) on the Gear tab, "Grades": "A made item raises one slot a grade, up to G10. Grade g opens at Lv 5g − 4.
  Weapon Gems, Armor Fittings and Accessory Settings come from the Forge, the Armorer and the Charm Shop." The
  Observatory's (i): "Each node opens with its jewel, in order. Every open node counts." Nothing else explains a rule on
  screen.
- **The manual** stays (H82 rewrites it from what you built): list in your delivery every screen's words H82 must carry
  into `sections.md`.
- **Main JS:** the Stable, the Observatory and the sheets are lazy; `items/frames.ts` loads with `ItemIcon`: keep its v3
  tables small. Say the number.

## Do

1. Pin uma-art 2.13.0; `pnpm install`; `items/frames.ts` and its test as decided.
2. **The domain's v3 branches:** `save/sheet.ts`, `save/upgrades.ts`, `save/targets.ts`, with their tests (below).
3. **The Stable:** the Gear tab's rows and pills, the three sheets, the preset, the battle sheet's rows, the rank bars, the
   template card's lines, the Signature facet; the Party Hall's chip.
4. **The Observatory:** the v3 page as decided (extract the map's layout as a pure function for its test).
5. **Tests:**
   - `apps/web/src/items/frames.test.ts`: every v3 material id at the frame the pinned atlas gives its art family and
     grade; every made id at H73's frame; the jewels and accessory forms at the decided frames; the sheet sizes; the v1
     cases unchanged.
   - `packages/domain/src/save/sheet-v3.test.ts`: a graded Tier 1 Lv 50 Brawler (Fleet, a G10 Bell on Greatsword, G10
     weapons and armor, the full map) reads "Greatsword +68 · Axe +68 · Lance +68", "Bell: Greatsword 1.0 after her Attack",
     "Signature +10" and no cut or shield row; a Tier 2 one reads Might +122 and "Signature +18".
   - `save/upgrades-v3.test.ts` (mocked to 17): `weapon-gem-g2` in stock counts her G1 Greatsword at Lv 6 and not at Lv 5;
     a settable `jewel-moon-2` counts; a G1 slot with no family counts; nothing else does.
   - `save/targets-v3.test.ts` (mocked to 17): a fresh graded Tier 1 target with an empty Warehouse needs 30 Weapon Gems,
     50 Armor Fittings, 10 Accessory Settings, 5 Planet Jewels and 17 Moon Jewels, **493 refined and 493 raw items**
     (profession-progression §7.1 with her moon); each place's lines; in a Tier 2 world her G5 and G10 lines take Tier 2's
     pair; a G4 Greatsword asks only G5–G10.
   - `apps/web` pure helpers, each with a test: the Gear tab's row text and pill state by target, grade, tier and stock;
     the accessory sheet's list (four families, her family first, the Bell's kinds); the Observatory's layout (22 nodes
     inside 360×360, none overlapping, her moon's orbit apart).
   - Every existing web and domain test passes unchanged.
6. **Check it locally** (your own ports; a desktop browser; never the iOS Simulator), on a scratch v27 save from the CJS
   build holding a few Umas of different classes and templates:
   - **without** the local switch: every screen as today;
   - **with** it, at 390×844 and 375×667, light and dark: the save migrates (the API's `.data/save.json` reads 28); add a
     few `weapon-gem-g1`, `armor-fittings-g1`, `accessory-setting-g1`, `jewel-planet-1` and `jewel-moon-2` to the scratch
     Warehouse by hand; raise a weapon, an armor slot and the accessory slot; "Up to G3" lists its items; pick a Bell and
     an Orb; see ★ on her family and the grey line off it; use the standard preset; open the battle sheet; on the
     Observatory set Planet I and Moon II on her moon at Lv 16; see the "Can upgrade" marks come and go; mark a target;
     filter the Stable by Signature; see "★ Bell" on the Party Hall's chip. Describe what you saw; screenshots with
     original art stay local. Say which screens touch the screen's edges.

## Done when

- [ ] `pnpm lint && pnpm test && pnpm build` pass; say the main JS number.
- [ ] The tests in step 5 pass; the domain's replay tests stay green.
- [ ] `git diff` has no switch: `BATTLE_ENGINE_VERSION`, `SAVE_SCHEMA_VERSION` and the chain are as they were.
- [ ] Both local checks in step 6 were done and described. Nothing from the original games in git; screenshots with
  original art stay local.
- [ ] `docs/game/` is unchanged and `pnpm docs:update` leaves no diff; the D-row is logged; implementation.md §3 has
  "Built: H79 (D…)".
- [ ] Deployed green and https://uma-rpg.web.app/api/health shows the commit; the live game looks as before.

## Deliver

- **A delegated worker (Claude or ChatGPT):** a pull request from `feat/h79-screens-gear-stars` with one commit,
  `feat(web): R2's gear and stars screens, inert until the switch (H79)`. H80 runs at the same time: it may pin uma-art
  and write the icon table first, and it edits the Stable's facet list; rebase on whichever lands first. Fetch `main`
  before you push (for the D-number). Claude's main session reviews it (ChatGPT may merge its own, per CLAUDE.md), then
  the deploy is watched.
- **Flag it done:** after the merge, a `docs(handoff): H79 done (D…)` commit deletes this file, sets H79 to Done with a
  Done row (listing the words H82 carries into the manual), and sets H82 to Ready if its other needs are done.
