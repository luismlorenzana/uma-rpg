# H58 — Save v25, dark: the Paladin's migration, one healer a party, the Paladin's start

**uma-rpg · Claude · M · Needs: H53 · Unblocks: H59 (the warnings and the local switch), H61 (the switch chains it)**

## Why

The Paladin needs the save as much as the engine ([classes-v2.md](../../design/classes-v2.md) §8, §3.3, C7, C8):
- **nobody loses progress:** every Uma's Cleric progress is copied to the Paladin (Class Rank, trees, a loadout), the
  Cleric's "any five" weapons become 3 Tomes + 2 Arms, the Chapel's seats 3–4 become the Bastion's seats 1–2 with their
  Heroes, Learners and Bonds, and the two accessories land in their typed slots;
- **one healer a party:** at most one Paladin or Cleric fights in a party;
- **a new Uma** whose best style is Late starts as a Paladin when her Power beats her Wit.

This packet writes all of it as save v25's rules, **dark**: the migration `toV25` is written and tested but not chained,
and the healer rule and the new start are v2 rules behind H53's switch. H61 chains `toV25`, sets `SAVE_SCHEMA_VERSION`
to 25 and flips the engine in one commit.

## Context (read first)

- `CLAUDE.md`, `AGENTS.md`, classes-v2.md §3.3 ("Starting class"), §5 ("Moving seats"), §6.1, §8 ("Save"); D45 (the API
  refuses a save older than it stores), D69 (the `saveBackups` copy), D162 (start armor; `classId` stays null), D163 and
  D171 (how H37 and H46 shipped saves v23 and v24), D164 (accessory 1 and 2 are v2's damage and support slots), H53's
  D-rows (the build decisions: one healer, the start, one switch).
- **The save** (`packages/domain/src/save/`, lines on `c8d0cea`):
  - `save.ts`: 45 `SAVE_SCHEMA_VERSION = 24`; 76–103 `ClassLoadout`, `OwnedUma` (`classId` null means her style's class);
    105–107 `BondTrack`, `HeroSeat`; 217–224 `startingArmorKinds`, `newOwnedUma`; 527–543 `parseRanks`; 545–584
    `parseBonds`, `parseHeroes`; 587–627 `parseLoadout`, `parseUmas`; 629–647 `parseParties`; 748–764 `parseTierWorld`
    (runs the migration chain on the raw world first); 1060–1117 `parseSave`, `parseSaveAsync`, `parseSaveChecked`.
    H57 edits `parseUmaGear` (471–494) at the same time: stay out of it.
  - `migrations.ts`: 203–215 `migrateWorld`'s chain; 218–233 `toV24`, the model: literals, frozen history, never imports
    `save.ts` or the rules, overwrites so a current save relabelled older still parses, leaves malformed data to the strict
    parse.
  - `battle.ts`: 56–64 `startingClass` (her best style's class) and `activeClass` (`classId ?? startingClass`); 97–103
    `chooseClass`; 294–306 `startFight`. H57 edits `partyMembers` and `umaBattleSheet` at the same time.
  - `rules.ts` 64–79 `unlockUma` (takes the start class, D162), 94–108 `setPartySlot`.
  - `rift.ts`: 113–137 sign-up (a roster, no parties); 168–193 `riftFightBlock` (no `outfits` today); 199–223
    `startRiftFight` (has `outfits`); 338–371 `convergenceBlock`, `beginConvergence` (no `outfits`); 404–450 Sweeps.
  - `heroes.ts` 13–30 (seats by `HERO_LIMIT_IDS`, the live list from H53).
- `roster/aptitudes.ts` 5–10 `STYLE_CLASSES` (the profile's "Learns fastest": late → Cleric).
- **H53's work:** `RPG_ALL_CLASSES`, the live `RPG_CLASSES`, `rpgIsHealer`, `rpgDefaultWeapons(classId, 15)` (Cleric
  Light, Dark, Thunder Tomes, Katana, Bow; Paladin Greatsword, Axe, Lance, Blizzard, Fire Tomes), `isHeroLimitId`, the
  Paladin's trees (`paladin-<weapon>.<depth><side>`, the Cleric's shapes). H57's: `accessoryFits`, typed slots (if it
  hasn't merged yet, your migration only needs the literal rule below).
- **The web's call sites** you'll pass `outfits` from: `apps/web/src/save/game.ts` 127 (`unlock`) and 189
  (`startConvergence`); `places/rift/StageSheet.tsx` 52, `EchoSheet.tsx` 31, `ConvergenceView.tsx` 62 (the block calls);
  the world map's `startFight` already takes `outfits` (`save/game.ts` 160).
- The API: `apps/api/src/save/firestore-save.repository.ts` 6 and 32 (the backup on a version bump). Nothing changes
  there.

## Decisions made

- **`toV25(world)`** in `migrations.ts`, exported, **not chained**: `SAVE_SCHEMA_VERSION` stays 24 and `migrateWorld`
  doesn't call it (the sync `parseSave` runs every step whose version is above the save's, so chaining it now would
  migrate live saves). H61 chains it and bumps the version. Literals only, like `toV24`. Per Uma:
  1. **The Paladin from the Cleric**, when she has Cleric progress (`ranks.classes.cleric` or `classes.cleric`) and no
     Paladin entry yet:
     - `ranks.classes.paladin` is a copy of her Cleric track;
     - `classes.paladin` (when `classes.cleric` exists): her Cleric tree with `cleric-` renamed `paladin-` (same depths,
       sides and costs: Rebirth becomes Heavy Devotion, Heavy Transfix becomes Valkyrie's Oath); weapons as in 3; loadout
       `null` if hers was, else her Cleric loadout renamed, keeping the skills of her Paladin weapons' trees, **Arms skills
       first**, then Tome skills, each in her order (§8: "re-picked from her Arms skills").
  2. **The Cleric's weapons** (when `classes.cleric` exists): her Tomes, first three in her order, then her Arms, first
     two; empty places filled from the v2 Cleric spread (Light, Dark, Thunder Tomes; Katana, Bow) in that order,
     skipping ones she holds. Ordered Tome, Tome, Tome, Arms, Arms (the slots' kinds by position).
  3. **The Paladin's weapons**, from her old Cleric weapons the other way round: her Arms (first three), then her Tomes
     (first two), filled from the v2 Paladin spread (Greatsword, Axe, Lance; Blizzard, Fire Tomes). Ordered Arms ×3,
     Tomes ×2.
  4. **Bonds:** `bonds['cleric-3']` moves to `bonds['paladin-1']` and `bonds['cleric-4']` to `bonds['paladin-2']`, when
     the target is empty.
  5. **Accessories (C10):** the **Damage** slot (`accessory-1`) takes the Orb she wore in `accessory-1`, else the one in
     `accessory-2`; the **Support** slot (`accessory-2`) takes the Talisman or Amulet she wore in `accessory-2`, else the
     one in `accessory-1`. A piece left over (her second Orb or second support) stays bound in her locker, unworn. Why:
     D164 put the Orb in 1 and the support in 2, so most Umas don't move; a second piece of one group can't be worn in v2.

  And per world: **seats** `heroes['cleric-3']` → `heroes['paladin-1']`, `heroes['cleric-4']` → `heroes['paladin-2']`,
  with their Hero and Learners, when the target is empty (§5: the Archangel's and Archdemon's Heroes keep their Limit
  Breaks, which move to the Bastion). **Nothing else moves:** active classes, parties, the open world-map fight and the
  open Rift fight (v14 inputs replay on v14), Rift runs and Convergence attempts, wallets, other ranks.
- **One healer a party (v2, the build decisions' point 3).** `healerBlock(world, ids, outfits, engine = …)` is "One
  healer a party" when two or more of `ids` fight as a healer (`activeClass` and `rpgIsHealer`), else null. It's checked
  by:
  - `startFight` (the world map);
  - `riftFightBlock(save, ref, party, tier, outfits?)` for front and Echo fights (the world party) and Convergence fights
    (the attempt's frozen party), and `startRiftFight`, which has `outfits`;
  - `convergenceBlock(save, parties, tier, outfits?)` for each of the four parties, and `beginConvergence(…, outfits)`, so
    an attempt never begins with a party that can't fight.
  - **Not** by party edits, class switches, sign-up (a roster, not parties) or Sweeps (nothing fights).
  - The web passes `outfits` (the master roster its pages already hold) at the three Rift block calls and
    `startConvergence`. Before the switch `rpgIsHealer` is false for everyone, so nothing changes.
  - An open Convergence attempt frozen with two healers (none in today's guidance) can't fight its next fight; the player
    abandons it (the attempt is spent). The migration doesn't touch it.
- **The Paladin's start (v2, §3.3).** `startingClass(outfit, engine = …)`: front Brawler, pace Mage, **late: a Paladin if
  her base Power beats her base Wit, else a Cleric**, end Summoner. `unlockUma` already takes the start: a Paladin start
  gets physical armor (`RPG_CLASS_ARMOR`), and `newOwnedUma` **writes `classId: 'paladin'`** for her, the one start the
  style mapping can't name. `activeClass` keeps today's mapping for `classId: null` (a style function, `styleClass`),
  so no existing Uma changes class at the switch. `STYLE_CLASSES.late` reads "Paladin / Cleric" in v2.
- **The parse needs no new code for v2:** `RPG_CLASSES`, `validRpgWeapons`, `isHeroLimitId` (H53) and the typed slots
  (H57) are live tables. A world `toV25` produced parses under the mocked switch; an unmigrated one with a Cleric
  holding four Arms doesn't (that's why H61 chains `toV25` with the bump).
- **The API:** unchanged. At H61 the first v25 write of the owner's save copies the stored v24 to
  `saveBackups/{uid}-v24` (D69).
- **Docs:** classes-v2 §8 (save) and §3.3 (start) gain "Built in H58 (D…), live from H61." The manual is unchanged.

## Do

1. **`save/migrations.ts`:** `toV25`, exported, with a doc comment (D…, steps 1–5 and the seats; "chained by H61").
2. **`save/battle.ts`** (`startingClass`, `activeClass`, `startFight` only), **`save/save.ts`** (`newOwnedUma` only),
   **`save/rules.ts`**, **`save/rift.ts`**, **`roster/aptitudes.ts`:** as decided. Export `healerBlock`.
3. **The web's plumbing:** `outfits` into the Rift's block calls and `startConvergence`. No visible change.
4. **Tests:**
   - `save/migrations-v25.test.ts`: a Cleric with four Arms and a Fire Tome becomes a Cleric with Fire, Light and Dark
     Tomes and her first two Arms, and a Paladin with her first three Arms, her Fire Tome and Blizzard, her tree renamed
     (Rebirth and Heavy Transfix included) and her rank copied; a loadout renamed, Arms first; a null loadout stays null;
     an Uma with only Cleric ranks gets only the rank; seats 3–4 move with their Learners and Bonds; two Orbs leave one
     worn and one in the locker; an Orb in `accessory-2` and an Amulet in `accessory-1` swap; a Brawler is untouched;
     running `toV25` twice equals running it once; the open world-map and Rift fights are byte-identical after it;
   - `save/save-v25.test.ts`, mocking `rpg/battle/caps.ts` to 15 (as `save/rift-hook.test.ts` mocks): a rich v24 world
     run through `toV25` parses (six classes, the moved seats, typed accessories), and its open v14 fight replays;
     the same world unmigrated fails on the Cleric's weapons;
   - `save/healers-v2.test.ts`, mocked to 15: `startFight` refuses a Paladin and a Cleric together with "One healer a
     party" and fights with one; `riftFightBlock` and `convergenceBlock` say the same given `outfits`; a Sweep with two
     healers pays; switching an Uma in a Paladin's party to Cleric is allowed; build the test Umas without Orbs if H57
     hasn't merged (H53's engine refuses `orbs` in v15). An unmocked case keeps two Clerics fighting today;
   - `save/battle.test.ts`: `startingClass` v2 (Power over Wit → Paladin, a tie → Cleric, v1 → Cleric); `unlockUma` with a
     Paladin start writes `classId: 'paladin'` and no magical kinds; an unpicked Late Uma's `activeClass` is Cleric in
     both generations;
   - every existing test passes unchanged; both v14 replay tests stay green.
5. **Docs:** log the D-decision (fetch `main` first); classes-v2 §3.3 and §8 lines. `pnpm docs:update` leaves no diff.
6. **Check it locally** (your own ports, 390×844, desktop browser): unlock an Uma, start a world-map fight, open a Rift
   stage sheet and the Convergence view on a scratch save from the CJS build (as H48–H52 did): all as before.

## Done when

- [ ] `pnpm lint && pnpm test && pnpm build` pass; say the main JS number.
- [ ] The tests in step 4 pass; both v14 replay tests pass untouched.
- [ ] `SAVE_SCHEMA_VERSION` is still 24 and `migrateWorld` doesn't call `toV25` (H61 does both).
- [ ] `docs/game/` is unchanged, `pnpm docs:update` leaves no diff, the D-decision is logged, classes-v2 has its lines.
- [ ] The local check in step 6 was done and described. Nothing from the original games in git.
- [ ] Deployed green and https://uma-rpg.web.app/api/health shows the commit.

## Deliver

- **Claude, as a delegated worker:** a pull request from `feat/h58-save-v25-dark` with one commit,
  `feat(domain): save v25's migration and one healer a party, dark (H58)`. H57 edits other functions of
  `save/battle.ts` and `save/save.ts` at the same time: rebase on whichever lands first. Fetch `main` before you push.
  The main session reviews and merges it, then watches the deploy.
- **Flag it done:** after the merge, a `docs(handoff): H58 done (D…)` commit deletes this file, sets H58 to Done with a
  Done row, and sets H59 to Ready if its other needs are done.
