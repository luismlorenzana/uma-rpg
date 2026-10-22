# H57 — Accessories v2: flat Orbs, typed Damage and Support slots, retuned supports, six presets (dark)

**uma-rpg · Either · M · Needs: H53 · Unblocks: H59 (the Gear tab), H60 (balance kits), H61**

## Why

Classes v2 turns the two accessory slots into a choice ([classes-v2.md](../../design/classes-v2.md) §6, C4, C5, C10):
- **one Damage slot** holding one Orb, and **one Support slot** holding one Talisman or Amulet;
- an **Orb adds flat offense** to its kind's hits, half a weapon's Might at its grade (+34 at G10), and no longer adds its
  kind for weaknesses or locks;
- the Vital Talisman and the Siphon Amulet are retuned so every support is a real pick;
- each class's standard preset (D164) grows to six and takes the flat Orb of her leading kind.

All of it is rules over the save and the fight's inputs. It lands dark: every v2 rule takes the generation (H53's
`engine` argument, defaulting to the live `BATTLE_ENGINE_VERSION`), so the deployed game keeps today's accessories until
H61 flips the switch. The engine already refuses `orbs` from v15 (H53).

## Context (read first)

- `CLAUDE.md`, `AGENTS.md`, classes-v2.md §6 and §7, D124 (two accessories), D142 (Might), D164 (presets: "accessory 1
  and 2 are v2's damage and support slots, so v2's migration maps them one to one"), D160, H53's D-rows.
- The manual: [classes.md](../../game/classes.md) § Weapons (accessory slots, standard preset, the `presets` block),
  [materials.md](../../game/materials.md) § Gear and the `gear` block (`docs/render.ts` 291–316), `presets` block (102–107).
- **The code** (lines on `c8d0cea`):
  - `economy/gear-id.ts`: 11–24 the accessory types; 41–57 `isOrb`, `orbKind`, `accessoryKindOf`; 84–103
    `AccessoryEffects` (`orbs`), `noAccessoryEffects`, `accessoryFightFields`.
  - `economy/ranks.ts` 35–37 `ACCESSORY_SLOTS` (`accessory-1`, `accessory-2`), 57 `ACCESSORY_SLOT_LABEL`.
  - `economy/gear.ts`: 58–65 `MIGHT_BY_GRADE` (0, 1, 4, 8, 12, 19, 26, 35, 45, 57, 68); 71–84 `CHARM_PER_GRADE`;
    86–102 `addAccessory` (an Orb pushes its kind); 120–127 `equippedMight`; 128–142 `equippedAccessories`,
    `accessoryEffects`.
  - `rpg/campaign/run.ts` 35–39 `RpgPartyMember`, 43–46 `rpgCarriedMp`, **54–69 `rpgPartyAllies`** (63 sends `orbs`, 65
    `might`): every fight's allies, the world map's and the Rift's.
  - `save/battle.ts`: 205–231 `umaBattleSheet` (221 the "Orbs" row, 227 the "Heal" row), **278–291 `partyMembers`**. H58
    edits `startingClass`, `activeClass` and `startFight` in the same file at the same time: stay in yours.
  - `save/forge.ts`: 48–58 `gearChoices`, 60–61 `freeAccessorySlot`, 63–90 `equipGear` (72–77 the accessory slot and "she
    already wears one of these"), 120–131 `wearAccessory`.
  - `save/presets.ts` 14–38 (`CLASS_PRESET_ACCESSORIES`, `classPreset`), 100–112 (the accessory picks).
  - `save/upgrades.ts` 100–116 (accessory slots in "Can upgrade").
  - `save/save.ts` 471–494 `parseUmaGear` (485–486 any accessory in either slot; 491–493 two of one type refused). H58
    edits other parts of this file.
  - The web's readers, for H59 (don't change them here): `apps/web/src/places/stable/GearCard.tsx` 63,
    `WeaponSheet.tsx` 180–190 (the accessory sheet: every type of a kind except the other slot's), `OutfitProfile.tsx`.
- **H53's work:** `rpgV2`, `BATTLE_HEAL_OFFENSE_SCALE`, `rpgDefaultWeapons(classId, engine)`, `projectRpgStats(profile,
  engine)`, `RPG_CLASS_ARMOR.paladin`, `rpgIsHealer`.

## Decisions made

- **Every v2 rule takes the generation** (`engine = BATTLE_ENGINE_VERSION`); v1 is today's behaviour, byte for byte.
- **Flat Orbs (C4):** `ORB_OFFENSE_BY_GRADE = [0, 1, 2, 4, 6, 10, 13, 18, 23, 29, 34]` (⌈Might ÷ 2⌉, §6.2's table) and
  `orbOffense(grade)`. In v2 `AccessoryEffects` carries `orbMight` (her Orb's offense on its kind) beside v1's `orbs`;
  `equippedAccessories(equipped, engine)` and `accessoryEffects(piece, engine)` fill the generation's field.
- **Into a fight (v2):** `rpgPartyAllies(party, mpOf, engine = …)` projects stats by the generation (HP with Guts), sends
  no `orbs`, and adds the Orb's offense into `might` on its kind, beside a weapon's Might of that kind. An Orb of a kind
  she doesn't wield still adds to that kind (her inherited Limit Breaks' hits). `partyMembers` passes the generation's
  accessories. A v1 fight's allies are exactly today's.
- **Typed slots (C10):** the slot keys stay `accessory-1` and `accessory-2` (D164's mapping, no save rename).
  - v2: `accessory-1` is the **Damage** slot (an Orb), `accessory-2` the **Support** slot (a Talisman or an Amulet).
    `ACCESSORY_SLOT_LABEL` is the live generation's ("Damage", "Support"; v1 "Accessory 1", "Accessory 2").
  - `accessorySlotFor(type, engine)`: v2 by type, v1 null (either). `accessoryFits(slot, type, engine)`: v1 any accessory,
    v2 by type. H59's sheets read these.
  - `equipGear` and `wearAccessory` (v2): an accessory goes to its type's slot; naming the other slot is refused,
    "The Damage slot takes an Orb" or "The Support slot takes a Talisman or an Amulet". v1 unchanged.
  - `parseUmaGear` (v2): `accessory-1` holds an Orb or nothing, `accessory-2` a support or nothing; v1 unchanged,
    including its "two of the same type" check.
  - Accessory Ranks stay four kinds (§6.1).
- **Support values (§6.3), v2:** Vital Talisman 0.6% of max HP a round a grade (6% at G10); Siphon Amulet 0.8% of magical
  damage as MP a grade (8%); the other eight as today. `charmPerGrade(engine)`. H60 enforces §6.3's rule (none under 60%
  of the best on a front's win rate) and may retune these.
- **Six presets (C6, v2):** weapons `rpgDefaultWeapons(classId, 15)`, armor `RPG_CLASS_ARMOR`, and:

  | Class | Orb (Damage) | Support |
  |---|---|---|
  | Brawler | Greatsword Orb | Vampire Talisman |
  | Mage | Fire Orb | Siphon Amulet |
  | Spell Blade | Greatsword Orb | Vampire Talisman |
  | Summoner | Fire Orb | Siphon Amulet |
  | Paladin | Greatsword Orb | Thorn Talisman |
  | Cleric | Light Orb | Spring Amulet |

  - The Orb is **her default spread's first weapon's kind**: a flat Orb strengthens her leading damage, which is §6.2's
    "her best weapon's kind". (v1's rule, a kind her spread lacks, made sense only while Orbs added weaknesses.)
  - The support is the first of the balance simulation's v2 kit (D164: the preset is what the game is tuned with);
    §6.3's roles pick them: Vampire for Brawler and Spell Blade sustain, Siphon for Mage and Summoner, Thorn for the
    guarding Paladin, Spring for the Cleric's casts. H60 starts from this table; if it changes a kit's support it changes
    the preset in the same packet.
  - `classPreset(classId, engine)`; `classPresetPlan`'s logic is unchanged (Orb to `accessory-1`, support to
    `accessory-2`).
- **"Can upgrade" (v2):** an empty Damage slot counts when an Orb she can wear is ready, an empty Support slot when a
  Talisman or Amulet is; v1 unchanged.
- **The battle sheet (v2):** Offense shows **"Orb"**: "Fire Orb +34", or "None". Sustain: a healer shows **"Mends"**:
  "×1.62 (from ATK)" for a Paladin, "(from M.ATK)" for a Cleric, from her sheet's ATK or M.ATK and
  `BATTLE_HEAL_OFFENSE_SCALE`; other classes show no Heal row (Heal retires, §3.3). v1 unchanged.
- **Docs:** the `gear` block's Orb line and the `presets` block read the live generation, so `pnpm docs:update` leaves no
  diff now and moves at the switch. classes-v2 §6 and §7 gain "Built in H57 (D…), live from H61."
- **Main JS:** `gear-id.ts`, `ranks.ts`, `presets.ts`, `upgrades.ts` and `save.ts` are in the main bundle. Keep the v2
  additions as small tables; say the number.

## Do

1. **`economy/gear.ts`, `economy/gear-id.ts`, `economy/ranks.ts`:** `ORB_OFFENSE_BY_GRADE`, `orbOffense`, `orbMight`,
   `charmPerGrade`, the generation-aware `equippedAccessories`/`accessoryEffects`, `accessorySlotFor`,
   `accessoryFits`, the live `ACCESSORY_SLOT_LABEL`.
2. **`rpg/campaign/run.ts`:** `rpgPartyAllies` and `rpgCarriedMp` by the generation as decided.
3. **`save/battle.ts`** (`partyMembers`, `umaBattleSheet` only), **`save/forge.ts`, `save/presets.ts`,
   `save/upgrades.ts`, `save/save.ts`** (`parseUmaGear` only): as decided.
4. **`docs/render.ts`:** the `gear` and `presets` blocks by the live generation (the Orb's line: "+34 offense on its
   kind's hits" in v2).
5. **Tests** (v2 cases pass `engine: 15`; the parse case runs in a file that mocks `rpg/battle/caps.ts` to 15, like
   `save/rift-hook.test.ts`):
   - `economy/accessories-v2.test.ts`: the Orb table; v2 effects have `orbMight` and no `orbs`; Vital and Siphon at G10
     are 6% and 8%; v1 effects equal today's for all twenty types;
   - `rpg/campaign/run-v2.test.ts`: v2 allies from `rpgPartyAllies` carry no `orbs`, their `might` adds the Orb's offense
     to its kind (and to a weapon's of the same kind), their HP includes Guts, and the v15 input passes `createBattle`;
     a v1 build equals today's;
   - `save/forge.test.ts` (v2 cases): an Orb lands in the Damage slot, a Talisman in the Support slot, the wrong slot is
     refused with its message; v1 cases unchanged;
   - `save/presets.test.ts` (v2 cases): the six rows; a Paladin's preset binds and wears her spread, physical armor, a
     Greatsword Orb and a Thorn Talisman;
   - `save/upgrades.test.ts` (v2 cases): an empty Support slot doesn't count an Orb in stock, and does count a Talisman;
   - `save/accessories-parse-v2.test.ts` (mocked to 15): a world with an Orb in `accessory-2` fails to parse, an Orb in
     `accessory-1` and a Talisman in `accessory-2` parse;
   - `save/battle.test.ts` (v2 sheet): "Fire Orb +34" and a Paladin's "Mends" row; no Heal row for a Brawler;
   - every existing test passes unchanged; the v14 replay fixture tests stay green.
6. **Docs:** log the D-decision (fetch `main` first); classes-v2 §6 and §7 lines; `pnpm docs:update` leaves no diff.
7. **Check it locally** (your own ports, 390×844, desktop browser): the Gear tab still shows "Accessory 1" and
   "Accessory 2", either takes any accessory, and the standard preset applies as before; a world-map fight starts and
   its stored input still carries `orbs` where she wears an Orb.

## Done when

- [ ] `pnpm lint && pnpm test && pnpm build` pass; say the main JS number.
- [ ] The tests in step 5 pass; both v14 replay tests pass untouched.
- [ ] `docs/game/` is unchanged, `pnpm docs:update` leaves no diff, the D-decision is logged, classes-v2 has its lines.
- [ ] The local check in step 7 was done and described. Nothing from the original games in git.
- [ ] Deployed green and https://uma-rpg.web.app/api/health shows the commit.

## Deliver

- **A delegated worker (Claude or ChatGPT):** a pull request from `feat/h57-accessories-v2` with one commit,
  `feat(domain): flat Orbs, typed accessory slots and six presets, dark (H57)`. H58 edits `save/battle.ts` and
  `save/save.ts` at the same time (other functions): rebase on whichever lands first. Fetch `main` before you push.
  Claude's main session reviews and merges it (ChatGPT may merge its own, per CLAUDE.md), then watches the deploy.
- **Flag it done:** after the merge, a `docs(handoff): H57 done (D…)` commit deletes this file, sets H57 to Done with a
  Done row, and sets H59 and H60 to Ready if their other needs are done.
