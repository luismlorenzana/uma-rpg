# H33 — A standard equipment preset per class

**uma-rpg · Either · S–M · Needs: H32 · Unblocks: nothing**

## Why

The owner asked for equipment presets per class. Classes v2 §7 and C6 (D160) settle it: **one standard preset per
class, applied on tap** from her profile ("Use the standard preset"). A preset is the class's default weapon spread,
its armor half in all five slots (H32's table), and a suggested Orb and support accessory. Applying it wears what she
can: her best pieces, or the stock's next grades her ranks allow, else Training pieces. It ships now for five classes;
v2 adds the Paladin's row. Custom saved presets can come later.

## Context (read first)

- `CLAUDE.md`, `AGENTS.md`, `docs/change-protocol.md`, and uma-platform's `docs/handoff/master-prompt.md`. Checks are
  local only (P60).
- **Design:** `docs/design/classes-v2.md` §7 (presets), §6.1 (typed slots, C5 and C10, with v2), §6.2 (flat Orbs, v2)
  and §6.3 (the support accessories' roles). D160 is at the end of `docs/decisions.md`.
- **From H32:** `RPG_CLASS_ARMOR` (`rpg/rules.ts`) and `armorKindFor` (`economy/ranks.ts`).
- **Class loadouts:** `ClassLoadout { weapons, tree, loadout }` (`save/save.ts:69`). `classOf(uma, classId)`
  (`save/battle.ts:62`) falls back to `rpgDefaultWeapons(classId)` (`rpg/rules.ts:75`): Brawler and Mage their fixed
  five; Summoner Fire, Blizzard and Thunder Tomes, Greatsword, Lance; Spell Blade Greatsword, Lance, Katana, Fire and
  Thunder Tomes; Cleric Greatsword, Axe, Bow, Fire and Light Tomes. See also `RPG_CLASS_SLOTS` (`:65`),
  `validRpgWeapons` (`:84`), `setClassWeapons` and `holdWeapon` (`save/battle.ts:101`, `:114`).
- **Her gear:** `UmaGear { locker, equipped, kinds }` (`save.ts:105`). `equipped` is keyed by weapon type (shared by
  every class holding it), the five armor slots, and `accessory-1`/`accessory-2`. Every equipped piece is in her
  locker (`parseUmaGear`, `:442`).
- **Binding** (`save/forge.ts`): `boundGrade` (`:21`); `equipBlock` (`:32`): her rank must reach the grade, and from
  the stock only the grade above her best on that track (D119); `gearChoices` (`:48`); `equipGear` (`:65`) binds one
  piece from `world.gear`; `wearArmor` (`:105`) sets `kinds[slot]` even for a Training piece; `wearAccessory` (`:121`)
  never lets the two slots share a type. `ownGear` (`:18`) is private.
- **Ranks and ids** (`economy/gear-id.ts`): `gearLevel(ranks, type)` (`:62`) reads the Weapon Rank, the armor kind's
  Armor Rank, or the Accessory Rank of the kind (Arms Orb, Elemental Orb, Talisman, Amulet). Every type is its own
  track (`gearTrackOf`, `gear.ts:145`). `gearId(type, grade)` is `<type>-g<grade>`. `ORB_TYPES`, `TALISMAN_TYPES`,
  `AMULET_TYPES` (`:13–24`); `RPG_KIND_PAIRS` (`rpg/kinds.ts:35`). Today an Orb only adds its kind to every hit, for
  weaknesses (`materials.md` § Gear).
- **The balance simulation's kit**, "what an average player would choose" (`world/balance-party.ts:27`): two supports,
  no Orb. Brawler Vampire + Iron; Mage Siphon + Ward; Spell Blade Vampire + Spring; Cleric Spring + Vital; Summoner
  Spring + Veil.
- **The UI:** `GearTab` (`places/stable/OutfitProfile.tsx:346`) → `GearCard` (`GearCard.tsx:18`); the slot sheets in
  `WeaponSheet.tsx` (rows read "Stock ×N · binds"); `ui/BottomSheet.tsx` wraps the kit's `Sheet`, and `ProfileFrame`
  is the kit's too: neither changes. Mutations: `save/game.ts:165–181`. Labels: `CLASS_LABEL` (`battle/labels.tsx:15`),
  `EQUIP_LABEL`, `outputView`, `ItemIcon`. H34 also edits the Gear tab: whichever lands second rebases.
- **Targets** plan from what she wears (`save/targets.ts:47`), so a preset updates her plan by itself.

## Decisions made

- **The table.** Weapons are `rpgDefaultWeapons(c)` and armor is `RPG_CLASS_ARMOR[c]`, one source each. A new
  `CLASS_PRESET_ACCESSORIES: Readonly<Record<RpgClass, { orb: OrbType; support: TalismanType | AmuletType }>>` holds
  the rest; `Record<RpgClass, …>` forces v2's Paladin row.

  | Class | Armor | Orb (accessory 1) | Support (accessory 2) |
  |---|---|---|---|
  | Brawler | Physical | Fire Orb | Vampire Talisman |
  | Mage | Magical | Greatsword Orb | Siphon Amulet |
  | Spell Blade | Physical | Dark Orb | Vampire Talisman |
  | Cleric | Magical | Ice Orb | Spring Amulet |
  | Summoner | Magical | Axe Orb | Spring Amulet |

  - **Orb:** today an Orb only adds a weakness kind, so each is a kind her default spread lacks: the shape partner
    (`RPG_KIND_PAIRS`) of her first weapon whose partner she doesn't wield.
  - **Support:** the first accessory of the simulation's kit, so the preset is what the game is tuned with. It also
    matches v2 §6.3's roles for Brawler, Spell Blade and Mage.
- **Today's two slots, v2's typed slots.** The Orb goes in `accessory-1` and the support in `accessory-2`. That's valid
  today (two different types) and is v2's damage and support slots, so v2's save migration maps them one to one. v2's
  packet changes the Orb column: with flat Orbs (§6.2) an Orb boosts its own kind, so it becomes a kind she wields.
- **The class:** the UI uses her active class (`activeClass`); the domain takes any class.
- **Weapons:** the class's five become the default spread. Learned sides and picked skills stay; a picked skill
  outside the new trees stops being used, as with `holdWeapon`. Skills aren't part of a preset (C6).
- **Pieces, per type:** her best own piece her rank allows; then the climb: from her best grade on the track, bind
  each next grade while it's in stock and within her rank, and wear the top. D119 binds in order, and this is what
  tapping a sheet grade by grade does. With nothing, a weapon or armor slot holds its Training piece.
- **Never bound:** a grade above her rank, armor of the other half, accessories of other types, weapons outside the
  spread. Pieces on weapons outside the spread stay on (they serve her other classes); armor of the other half goes
  back to her locker.
- **An accessory slot with nothing of its type** keeps what it holds, unless that piece is the type the other slot now
  takes; then it empties. A preset never takes off a useful piece for nothing, and the slots never share a type.
- **Kinds:** all five `kinds` are written explicitly, as `wearArmor` does.
- **The tap:** nothing binds from the stock → it applies at once. Something binds → a sheet first lists those pieces,
  "Binds to her for good", with "Use the standard preset": binding is permanent, the rest can be undone by hand.
  Nothing would change → the button is disabled and reads "Standard preset on".
- **The place:** the top of the profile's Gear tab, a full-width 48 px row like GearCard's.
- **Unchanged:** the save (v22), the engine, the kit. **Out of scope:** custom presets, H34's badges, the
  simulation's kit, and planning targets for empty accessory slots.

## Do

1. **Domain:** a new `packages/domain/src/save/presets.ts`, exported from `src/index.ts` (no new package subpath: the
   Gear tab needs it in the main chunk anyway).
   - `CLASS_PRESET_ACCESSORIES`; `ClassPreset { classId; weapons; armor: 'physical' | 'magical'; orb; support }` and
     `classPreset(classId)`.
   - `PresetPlan { classId; weapons; kinds: Record<ArmorSlot, ArmorKind>; wear: Partial<Record<GearSlot, string | null>>; binds: string[]; changes: number }`.
     `wear` is the piece each preset slot ends on (`null`: a Training piece, or an emptied accessory slot; an accessory
     slot kept as it is is left out). `binds` lists the stock pieces bound on the way, lowest grade first per track.
     `changes` counts slots that end differently: weapon positions, weapon pieces, an armor slot's kind or piece,
     accessory slots.
   - `classPresetPlan(world, outfitId, classId): PresetPlan`: pure; throws `SaveRuleError` `not-owned` or `bad-class`.
   - `applyClassPreset(world, outfitId, classId): TierWorld`: the class's weapons as `{ ...classOf(uma, classId),
     weapons }` only when they change; stock counts down (deleted at 0); bound pieces into her locker; `equipped` and
     `kinds` set. It returns the same world when `changes === 0`.
   - `wearClassPreset(save, outfitId, classId, now, tier = TIER_ONE): Save`, the save step; `save` itself when nothing
     changes.
   - A private `bestReachable(uma, stock, type): { id: string | null; binds: string[] }`. Export `ownGear` from
     `forge.ts`, or read `uma.gear.locker`.
2. **Tests:** `packages/domain/src/save/presets.test.ts`, with invented outfits as in `battle.test.ts:19`, ranks set
   with `withTrack`, and stock in `world.gear`:
   - the table: every class has a row; weapons pass `validRpgWeapons`; armor is `RPG_CLASS_ARMOR`; the Orb's kind isn't
     among `rpgWeaponKind` of her spread; the Orb is an Orb, the support a Talisman or an Amulet;
   - "a new Uma already wears her standard preset": after H32's unlock, `changes === 0` for each starting class;
   - the climb: a Mage with Robe Rank 2 and robe-g1, g2 and g3 in stock binds g1 and g2, wears robe-g2, and the stock
     keeps robe-g3; with Robe Rank 1 and only robe-g2 in stock, nothing binds and the Training Robe is worn;
   - the other half: a Brawler's preset binds none of the stock's Circlets or Robes; a Robe she wears goes back to her
     locker, and the slot holds the Training Cuirass;
   - weapons: a Spell Blade with her own spread gets the default one; her tree and loadout are kept; a piece on a
     weapon outside the spread stays on;
   - accessories: a Fire Orb from the stock goes to `accessory-1`; a Vampire Talisman she wore in `accessory-1` moves
     to `accessory-2`; with no Orb to wear, `accessory-1` keeps its piece unless it's the support's type;
   - the save: the result passes `parseSave` after a JSON round trip; `wearClassPreset` with no changes returns the
     same save; an Uma not owned and an unknown class are refused.
3. **Web:**
   - `save/game.ts`: `wearPreset(outfitId, classId)`, importing `wearClassPreset` statically from `@rpg/domain`, like
     `unlock`.
   - A new `places/stable/PresetButton.tsx`, `PresetButton({ outfit, uma, world })`. It reads "Use the standard
     preset", with a second line such as "Mage · Magical armor · Greatsword Orb · Siphon Amulet" (`CLASS_LABEL`,
     `EQUIP_LABEL`). With `changes === 0` it's disabled and reads "Standard preset on". A tap applies, or, with
     `binds`, opens a `BottomSheet` listing each piece (`ItemIcon`, "Name · G#"), the line "Binds to her for good" and
     a footer button "Use the standard preset". Errors show the `SaveRuleError` message, as `WeaponSheet` does.
   - `OutfitProfile.tsx`: `GearTab` renders it first.
4. **Docs:**
   - `render.ts`: a `presets()` block (Class | Weapons | Armor | Orb, accessory 1 | Support, accessory 2), registered
     in `renderBlock`;
   - `classes.md`: after the accessory slots, a "**Standard preset**" paragraph (with its D-number) and
     `<!-- live:presets -->`; its `Code:` line adds `save/presets.ts`;
   - `sections.md` § Stable: the Gear tab line gains "the standard preset";
   - `loops.md` § Extra Stats and gear: a "Standard preset" bullet: what it wears, the climb, what it never binds;
   - run `pnpm docs:update`.
5. **Log the decision:** fetch `main` and take the next free D-number (D163 after H32): "A standard preset per class
   (H33, C6)", with the table, the climb, accessory 1 and 2 as v2's damage and support slots, and the confirm when
   binding.

## Done when

- [ ] `pnpm lint && pnpm test && pnpm build` pass.
- [ ] `packages/domain/src/save/presets.test.ts` passes with the cases above; the docs test is green after
      `pnpm docs:update`.
- [ ] **Local check** in the dev server at 390×844 and 375×667, on a scratch save (`LOCAL_SAVE_FILE` outside the
      repo), with stock from Forge jobs finished with Speed Tickets, or seeded by editing the JSON while the API is
      stopped:
  - **a Mage unlocked before H32:** the button is on ("Mage · Magical armor · …"); with no stock a tap applies at
    once: five Training magical pieces, and the button reads "Standard preset on";
  - **with a G1 Robe and a G1 Siphon Amulet in stock:** the tap opens the sheet listing both; after confirming, the
    Gear tab's Body and Accessory 2 rows show them, and the Body sheet marks the Robe "Worn";
  - **a Spell Blade with her own spread:** the Skills page shows the default five after the tap;
  - the new sheet sits at the bottom edge (the kit's `Sheet`): say so in the delivery for the owner's phone check.
- [ ] The main JS is under 230 KB gzip (`scripts/check-size.mjs`, run by the web build).
- [ ] The manual and the D-decision are in.
- [ ] The deploy is green, and `https://uma-rpg.web.app/api/health` shows the commit in `build`.

## Deliver

- Claude: commit to `main` as `feat(stable): a standard equipment preset per class (H33)`, then watch the deploy
  (`gh run watch <id> -R luismlorenzana/uma-rpg --exit-status`).
- ChatGPT: branch `h33-class-presets`, a pull request with that title, merged after green CI.
- **Flag it done:**
  - delete this file;
  - add a Done row to `docs/handoff/README.md` with the commit;
  - set H33 to Done in uma-platform's queue, if it's listed there.
