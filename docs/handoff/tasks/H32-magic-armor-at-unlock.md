# H32 — Magic armor at unlock

**uma-rpg · Either · S · Needs: nothing · Unblocks: H33**

## Why

The owner wants Umas that start as a Mage or a Summoner to start in magic armor. Classes v2 (D160, §7 "Starting armor
by class") adds the Cleric and says it can ship now. Today every new Uma starts all-physical, whatever her class
(classes v2 §2), so a new Mage wears a Training Helm, Cuirass, Greaves, Gauntlets and Boots, and her first wins rank
armor she won't keep. New unlocks start in their class's armor, through one class → armor table. The Paladin/Cleric
split then adds one row.

## Context (read first)

- `CLAUDE.md`, `AGENTS.md`, `docs/change-protocol.md`, and uma-platform's `docs/handoff/master-prompt.md`. Checks are
  local only: the repo's checks and the dev server in a desktop browser at phone width, never the iOS Simulator (P60).
- **Design:** `docs/design/classes-v2.md` §7 (first bullet) and §3's Armor column. §3.3's "Starting class" (Paladin
  if Power beats Wit) comes later with v2, not here. D160 is at the end of `docs/decisions.md`.
- **Manual:** `docs/game/classes.md` (the `live:classes` table's "Starts as" column, the "Starts as" paragraph,
  "Armor slots (D103, D124)"); `docs/game/loops.md` § Collection and parties ("Classes:"); `docs/game/materials.md`
  § Gear ("Training pieces").
- **The starting class** (`packages/domain/src`):
  - `rpgDefaultClass(style)` in `rpg/rules.ts:94`: front Brawler, pace Mage, late Cleric, end Summoner. A Spell Blade
    is never a default.
  - `activeClass(outfit, uma)` in `save/battle.ts:57` is `uma.classId ?? rpgDefaultClass(best(outfit.aptitudes.strategy)[0])`.
    `best` is in `roster/aptitudes.ts:31`; ties keep the order front, pace, late, end.
  - The save keeps `classId: null` until the player picks a class, so the class is worked out from master data each
    time.
- **Where a new `OwnedUma` is made:**
  - `newOwnedUma(now)` in `save/save.ts:194` sets `gear: { locker: [], equipped: {}, kinds: {} }`.
  - `slotKind` (`save.ts:107`) reads an absent kind as `ARMOR_SLOT_KINDS[slot][0]`, the physical one.
    `ARMOR_SLOT_KINDS` (`economy/ranks.ts:17`) lists each slot's [physical, magical] pair: helm/circlet, cuirass/robe,
    greaves/leggings, gauntlets/bracers, boots/slippers.
  - `unlockUma(save, outfitId, now, tier = TIER_ONE)` in `save/rules.ts:32` is the only path in the game.
    - The web's `unlock(outfitId)` (`apps/web/src/save/game.ts:86`) calls it.
    - `unlock` is called only by `UnlockBox` (`apps/web/src/places/stable/OutfitProfile.tsx:198`), which has the
      `RosterOutfit`, a `BattleOutfit` fit.
  - `resetTierWorld` (`save.ts:696`) restarts saves older than v10. Those are existing Umas, so they keep the default.
  - First launch makes no Uma: `createAccount` → `newSave` gives 20 Uma Tickets (D153).
  - **Tests and the sim** use string ids and no master data:
    - domain: `save/rules.test.ts:8–33`, `forge.test.ts:22`, `battle.test.ts:36`, the ranks, heroes, notify and
      targets tests, `world/capital.test.ts:32`, and `economy/pacing.sim.ts:34`;
    - web: `places/scenario-gate/RegionMap.test.tsx:40` and `album/testing.ts:22` (`newOwnedUma(NOW)`);
    - API: `apps/api/src/push/push.service.test.ts:16`.

    `apps/web/src/save/game.test.ts` calls `unlock('…')` at lines 38, 98, 99 and 110.
- **The save is ready:** `UmaGear.kinds` is already stored and strictly parsed (`parseUmaGear`, `save.ts:442`). The
  schema stays v22 and the API changes nothing.
- **What follows on its own:**
  - armor EXP goes to the kinds she wears (`save/battle.ts:413`);
  - targets plan those kinds (`save/targets.ts:47`);
  - the Gear tab draws each slot's kind (`GearCard.tsx:45`).
- **The manual's table:** `classes()` in `packages/domain/src/docs/render.ts:81` renders the live classes table, with
  `STARTS_AS` at `:70`.

## Decisions made

- **One table:** `RPG_CLASS_ARMOR: Readonly<Record<RpgClass, 'physical' | 'magical'>>` in `rpg/rules.ts`, after
  `RPG_CLASS_SLOTS`:
  - Brawler physical, Mage magical, Spell Blade physical, Cleric magical, Summoner magical;
  - a `Record` over `RpgClass` makes v2's `paladin` a compile error until its row (physical) is added.
- **All five slots** take the class's half, with no mix. D160 §7 says "a new Uma's five armor slots start in her
  class's armor".
- **Only magical kinds are written.** A physical start keeps `kinds: {}`, since an absent kind already means physical.
  New Brawlers stay exactly as they are today, and tests comparing with `newOwnedUma(T)` still hold.
- **Existing Umas don't change** and there's no migration. That's the owner's call, and D160 §7's.
- **The class is today's rule, applied at unlock**, by a new `startingClass(outfit)`. The save's `classId` stays
  `null`: only the armor needs the class at unlock.
- **The class is passed in.** Save rules take no master data, so it's
  `unlockUma(save, outfitId, now, tier = TIER_ONE, startClass?: RpgClass)`, an optional last argument like
  `equipGear`'s `accessorySlot`. Without it (tests, the pacing sim), the Uma starts all-physical, as today.
- **The web's `unlock` takes the outfit**, not its id, so the game can't forget the class.
- **No UI change:** the Gear tab already shows Training Circlet and the rest.
- **Out of scope:** promotion (not built), the Paladin row (v2), and any change to the balance simulation's kit.

## Do

1. `rpg/rules.ts`: add `RPG_CLASS_ARMOR`, with a comment citing D160 §7.
2. `economy/ranks.ts`: add `armorKindFor(slot: ArmorSlot, half: 'physical' | 'magical'): ArmorKind`, which returns
   `ARMOR_SLOT_KINDS[slot][half === 'magical' ? 1 : 0]`.
3. `save/save.ts`:
   - add `startingArmorKinds(classId)`: the five magical kinds for a magical class, `{}` for a physical one;
   - `newOwnedUma(now, startClass?: RpgClass)` sets `kinds` from it;
   - update the comments on `UmaGear` (`:102`) and `slotKind`: absent means physical, and a magical class's new Uma
     has all five set.
4. `save/battle.ts`: add `startingClass(outfit: Pick<BattleOutfit, 'aptitudes'>): RpgClass`, which returns
   `rpgDefaultClass(best(outfit.aptitudes.strategy)[0])`. `activeClass` calls it. v2's Paladin split changes only
   this function.
5. `save/rules.ts`: `unlockUma(…, startClass?)` passes the class to `newOwnedUma(now, startClass)`.
6. Web:
   - `game.ts`: `unlock(outfit: Pick<BattleOutfit, 'outfitId' | 'aptitudes'>)` calls
     `unlockUma(save, outfit.outfitId, nowIso(), TIER_ONE, startingClass(outfit))`;
   - `OutfitProfile.tsx:198` calls `unlock(outfit)`;
   - `game.test.ts` passes small invented outfits, `{ outfitId, aptitudes: { strategy: { front, pace, late, end } } }`.
7. **Tests:**
   - `save/rules.test.ts`, "starts a new Mage, Summoner or Cleric in magical armor and a Brawler or Spell Blade in
     physical (D160)":
     - for each class, `ARMOR_SLOTS.map((s) => slotKind(uma.gear, s))` after `unlockUma(…, TIER_ONE, c)`;
     - without `startClass`, `kinds` is `{}`;
     - the Umas already owned are untouched;
     - a JSON round trip through `parseSave` keeps the kinds.
   - The same file: `RPG_CLASS_ARMOR` is magical for exactly Mage, Summoner and Cleric.
   - `save/battle.test.ts`: extend "starts in her best running style's class". `startingClass` of the four style
     fixtures (`outfit()`, `:19`) is brawler, mage, cleric and summoner.
   - `apps/web/src/save/game.test.ts`: unlocking a pace outfit stores five magical kinds.
8. **Docs:**
   - `render.ts` `classes()`: add a "Starting armor" column after "Starts as", from `RPG_CLASS_ARMOR`;
   - `classes.md`:
     - the "Starts as" paragraph gains "and in that class's armor: magical for a Mage, a Cleric or a Summoner,
       physical for a Brawler (this packet's D-number). Umas unlocked before keep theirs.";
     - "Armor slots" links to it;
   - `loops.md` § Collection: the "Classes:" bullet says the same in one clause;
   - `materials.md` § Gear "Training pieces": a new Uma's armor slots hold her starting class's Training pieces;
   - run `pnpm docs:update`.
9. **Log the decision:** fetch `main` and take the next free D-number (D162 if `main` still ends at D161). For
   example: "New Umas start in their class's armor (H32, D160 §7). `RPG_CLASS_ARMOR`: magical for Mage, Summoner and
   Cleric. Set at unlock from today's starting class; existing Umas keep theirs; save v22 unchanged."

## Done when

- [ ] `pnpm lint && pnpm test && pnpm build` pass.
- [ ] The new and extended tests pass in `save/rules.test.ts`, `save/battle.test.ts` and `apps/web/src/save/game.test.ts`.
      The docs test (`src/docs/docs.test.ts`) is green after `pnpm docs:update`.
- [ ] **Local check** in the dev server (`.claude/launch.json` or your own ports), at 390×844 and 375×667:
  - in the Stable, open a locked Uma whose best style is Pace (Filters → running style) and unlock her;
  - her class chip says Mage, and the Gear tab lists Training Circlet, Robe, Leggings, Bracers and Slippers, all G0;
  - a Front runner unlocked the same way lists Training Helm, Cuirass, Greaves, Gauntlets and Boots;
  - an Uma unlocked before the change shows the armor she had;
  - Nothing touches the screen's edges.
- [ ] The main JS is under 230 KB gzip (the web build's `scripts/check-size.mjs`).
- [ ] The manual and the D-decision are in.
- [ ] The deploy is green, and `https://uma-rpg.web.app/api/health` shows the commit in `build`.

## Deliver

- Claude: commit to `main` as `feat(domain): new Mages, Summoners and Clerics start in magic armor (H32)`, then watch
  the deploy (`gh run watch <id> -R luismlorenzana/uma-rpg --exit-status`).
- ChatGPT: branch `h32-magic-armor-at-unlock`, a pull request with that title, merged after green CI.
- **Flag it done:**
  - delete this file;
  - add a Done row to `docs/handoff/README.md` with the commit;
  - set H32 to Done in uma-platform's queue, if it's listed there.
