# H69 — Save v27, dark: three weapons, sides to branch picks, the loadout pruned, the calling pick stored; `toV27` written, not chained

**uma-rpg · Claude · M · Needs: H65, H67 · Unblocks: H70 (with H66, H68), H72 (with H70, H71); R2's H78**

## Why

R1 changes what a class keeps (CP31, [class-progression.md](../../design/tier-rework/class-progression.md) §14,
[README](../../design/tier-rework/README.md) §9.3's class rows):
- **three weapons**, the owner's defaults, instead of five;
- **a branch pick a tree** instead of side skills bought with points: B where she had learned any of that tree's B line;
- her **equipped skills pruned** to what she still holds;
- **`OwnedUma.calling`**, the one thing a template stores (UT17): the pick, and whether it is confirmed.

Nobody loses progress: Class Ranks, Hero seats, Bonds, gear and Marks don't move, and every crafted weapon stays equipped
on its kind. This packet writes it all as save v27's rules, **dark**: `toV27` is written and tested but not chained, and
the parse reads v27's shape only when the live engine is v16. H72 chains `toV27`, sets `SAVE_SCHEMA_VERSION` to 27 and
flips the engine in one commit. R2's save v28 (H78) chains after it.

## Context (read first)

- `CLAUDE.md`, `AGENTS.md`. class-progression §6.1 (CP14, CP23: a swap keeps her equipped skills on the other line),
  §10 (CP29, CP30), §14 (CP31's v27 rows), §16; [uma-templates.md](../../design/tier-rework/uma-templates.md) §2.3 (UT4),
  §9 (UT17). D45 (the API refuses a save older than it stores), D69 (`saveBackups` on a version bump), D180 and D190 (how
  saves v25 and v26 were written), H64's D-rows (decisions 1 and 4), H65's (the branch model) and H67's (the template).
- `git show 5dd9f08:docs/handoff/tasks/H58-save-v25-paladin.md`: the dark-migration packet this one mirrors.
- **The code** (lines on `421eacd`; H64, H65, H67 and H68 move some):
  - `save/save.ts`: 1–14 the header (it still says "Save v25"; v26 is D190's); 46 `SAVE_SCHEMA_VERSION = 26`; 75–81
    `ClassLoadout` (`weapons`, `tree`, `loadout`); 84–103 `OwnedUma`; 226–227 `newOwnedUma` (H67 writes the start);
    268–273 `object()` (refuses unknown keys); 593–608 `parseLoadout` (five weapons, `validRpgTree`, the loadout's ids);
    610–633 `parseUmas` (the keys list at 616); 757–773 `parseTierWorld` (runs the migration chain first); 1079–1127
    `parseSave`, `parseSaveAsync`, `parseSaveChecked`.
  - `save/migrations.ts`: 203–217 `migrateWorld`'s chain; 225–232 `toV26`; 236–343 `toV25`, the model (literals, frozen
    history, never imports the rules, idempotent, malformed data left to the strict parse).
  - `save/class.ts` 37–39 `classOf` (the default setup: `rpgDefaultWeapons`, `tree: []`, `loadout: null`).
  - `save/battle.ts`: 51–63 `umaProfile` (`tree` at 60); 65–70 `umaLoadout`; 86–120 `setClassWeapons`, `holdWeapon`;
    122–147 `learnSkill`, `forgetSkill`; 149–158 `equipSkills`; 222–235 `partyMembers` (H68's `umaFlourish` with a null
    pick); 383–409 `payEntrants` (world fights and Sweeps).
  - `save/rift.ts`: 297 `settleRiftFight`, 404 the Echo Sweeps' pay (`fillRanks`); 523–571 `ascend` (556: the arrival
    is `newOwnedUma` plus her class and armor kinds).
  - `save/rules.ts` 64–80 `unlockUma`.
  - H65: `RpgProfile.lines`, `RPG_BRANCH_B`, `rpgBranchNode`, `rpgHeldSkills`, `rpgSwapBranchLoadout`,
    `rpgActiveSlots(level, engine)`. H67: `UmaCalling`, `umaCallingPick`, `umaCallingPickBlock`, `umaCalling`.
  - `apps/api/src/save/firestore-save.repository.ts` 6 and 32: the backup on a version bump. Nothing changes there.

## Decisions made

**The approved calls (CP31's v27 part; README §9.3's class rows):**
- `classes[id].weapons` (5 → 3): **the class's new defaults** (CP3), in every class she has set up. Her per-tree picks
  stay, so slotting an old kind back restores its branch.
- `classes[id].tree` → **picks: B on a tree if she learned any node of that tree's B line** (H65's table: the catalog
  side letter by class and kind), else A. Every other side is deleted.
- `classes[id].loadout`: skills she no longer holds are removed; an empty loadout goes back to auto (`null`).
- `legacy`: retired (never stored in the save: nothing to migrate).
- Skill Ranks, the Paladin's revive: nothing stored.
- `OwnedUma.calling` (new): `{ pick, confirmed }`; owned Umas get the pre-selection, unconfirmed.
- Unchanged: class ids, Class Ranks, Hero seats, Bonds, Class Marks; gear, ranks and wallets (R2's); the open world-map
  and Rift fights (v15 inputs replay on v15).

**This packet's decisions:**
- **The field is `lines`, not `branches`** (main session, 2026-10-25): R3's weapon branches (H83) take `branches`, and
  R4/R5 call a tree's A/B/C its line.
- **v27's class shape:** `ClassLoadout = { weapons: RpgWeapon[] (three), lines: Partial<Record<RpgWeapon, 'B'>>,
  loadout: string[] | null }`: `lines` lists the trees she has on B (any kind of her class, slotted or not), A is
  absence. **While dark both shapes live:** `tree?` and `lines?` are optional on the type; v26 (the live 15) parses
  and writes `tree`, v27 (the live 16) `lines`. H72 makes `lines` required and drops `tree`.
- **`OwnedUma.calling: UmaCalling`** (`{ pick: RpgClass | null; confirmed: boolean }`, H67's type), on **every** Uma from
  v27: `pick` null means the rule's calling (her pre-selection). Optional on the type while dark; H72 makes it required.
  Why every Uma: the migration and the parse have no master data, so they can't tell who is pick-eligible; the rules that
  read the pick (H67) ignore a pick outside her row.
- **The parse, by the live generation** (`rpgRework('fight')`, as H58's parse read the live tables):
  - `parseLoadout` from v16: keys `weapons`, `lines`, `loadout`; three weapons by `validRpgWeapons` (positions, H64);
    `lines` an object whose keys are her class's kinds (`rpgClassWeapons`) and values `'B'`; the loadout at most
    `rpgActiveSlots(level)` ids, each a node she could hold: her three weapons' trees, the trunk (depths 1–2) or her
    branch's line at depths 3–5 (an open depth is checked when she fights, as today).
  - `parseUmas` from v16: `calling` required, `{ pick: null | 'spellblade' | 'mage' | 'paladin' | 'cleric', confirmed:
    boolean }` (only those four classes are ever picked).
  - To v15 both are today's, and v27's keys are refused (`object()` is strict).
- **`toV27(world)`** in `migrations.ts`, exported, **not chained** (`SAVE_SCHEMA_VERSION` stays 26; `migrateWorld`
  doesn't call it; the sync parse runs every step above a save's version, so chaining it now would migrate live saves).
  Literals only: its own tables `V27_DEFAULTS` (the six classes' three weapons) and `V27_BRANCH_B` (H65's table copied),
  frozen history. Per Uma, per class in `classes` that still has `tree` and no `lines` (a class with `lines` is
  v27 already: idempotent):
  1. `weapons` → `V27_DEFAULTS[classId]`.
  2. `lines[w] = 'B'` for each of her class's kinds `w` where `tree` holds a node `<class>-<w>.<1–5><V27_BRANCH_B>`;
     `tree` is removed.
  3. `loadout` (when not null): keep, in her order and once each, the ids she holds in v27: her three new weapons' trees,
     depths 1–2 the cores, depths 3–5 the core (A) or her B line's node (B); at most her v16 slot count at her Uma level
     (three, plus one each at Lv 10, 20, 30, 40); none left → `null`.
  Per Uma: `calling` → `{ pick: null, confirmed: false }` when absent. Nothing else moves. Anything malformed (a class that
  isn't an object, a `tree` that isn't a list of strings) is left for the strict parse.
  - Worked (ids without their `brawler-` prefix): a Brawler with five Arms and the sides `greatsword.4b`, `lance.3a`,
    `katana.2a`, `axe.3a` becomes Greatsword,
    Axe, Lance with `lines` `{ greatsword: 'B', lance: 'B', katana: 'B' }` (the Lance's and the Katana's B lines are the
    catalog's `a`; any depth counts; the Axe's `a` is not its B), and her loadout `[greatsword.5b, axe.3a, katana.5,
    greatsword.2]` becomes `[greatsword.5b, greatsword.2]`.
  - Why defaults, when grades don't reset in R1 (CP31 said "grades reset anyway"): weapon gear is equipped per kind
    (`uma.gear.equipped[weapon]`), so a crafted weapon she slots back fights with its piece at once: the defaults lose
    nothing, and they are what the balance is measured on.
- **The rules over the save, from v16 (the live generation):**
  - `umaProfile` builds `tree: []`, `legacy: []`, `lines: setup.lines ?? {}`; `umaLoadout` reads H65's v16 loadout
    rules. `classOf`'s default setup is `{ weapons: rpgDefaultWeapons(classId), lines: {}, loadout: null }` from v16.
  - **`pickBranch(save, outfit, classId, weapon, branch: 'A' | 'B', now, tier)`**: any kind of her class; sets or clears
    `lines[weapon]` and maps her loadout's ids of that tree with `rpgSwapBranchLoadout`. Free, any time (a fight's input
    is frozen). Refused before v16 ("No branches yet").
  - `learnSkill`, `forgetSkill`: refused from v16 ("Skills open with Class Rank").
  - **`pickCalling(save, outfit, pick, now, tier)`**: refused when `umaCallingPickBlock` says so (no pick for her, or
    confirmed) or `pick` isn't one of her two options; writes `{ pick, confirmed: false }`. **At Uma Lv 1** (her start, CP30)
    it also moves her class to the pick's when her active class is still her previous calling's, and her five armor kinds
    to the pick's half when she wears no armor piece. Above Lv 1 only her calling moves; she switches class freely.
  - **`confirmCalling(save, outfitId, now, tier)`**: the card's Confirm; sets `confirmed` (the pick, or null for the
    pre-selection, stays).
  - **Her first win confirms it:** every paid winner's `calling.confirmed` becomes true in `payEntrants` (world fights and
    Sweeps), `settleRiftFight` and the Echo Sweeps' pay. Every Uma, eligible or not: harmless for the fixed rows.
  - **Ascend keeps it:** an arrival carries her `calling` (save/rift.ts 556).
  - `newOwnedUma` writes `calling: { pick: null, confirmed: false }` from v16 (H67 already writes her start).
  - **H68's swap:** `partyMembers` passes `uma.calling?.pick ?? null` to `umaFlourish` (H68 passed null).
- **The API:** unchanged. At H72 the first v27 write of the owner's save copies the stored v26 to
  `saveBackups/{uid}-v26` (D69), and an old app's write is refused once v27 is stored (D45).
- **Docs:** the save's header comment gains the v26 line it lacks and "v27 (D…): written dark, chained by H72";
  implementation.md §3: "Built: H69 (D…)". The manual is unchanged.

## Do

1. **`save/migrations.ts`:** `toV27`, exported, with a doc comment (D…; steps 1–3 and the calling; "chained by H72").
2. **`save/save.ts`:** the optional `lines` and `calling`; `parseLoadout` and `parseUmas` by the live generation;
   `newOwnedUma`; the header.
3. **`save/class.ts`, `save/battle.ts`, `save/rift.ts`:** `classOf`, `umaProfile`, `umaLoadout`, `pickBranch`, the refusals,
   `pickCalling`, `confirmCalling`, the first-win confirmation, Ascend, the pick into `umaFlourish`. Export the new rules
   from `save/battle.ts`; the web's actions are H70's.
4. **Tests:**
   - `save/migrations-v27.test.ts` (pure, no mock): the worked Brawler above; a Mage's loadout of only side skills becomes
     `null`; a Lv 9 Uma's loadout keeps at most three; a Spell Blade with `spellblade-katana.4b` is B on her Katana and keeps
     it equipped; a Paladin with `paladin-tome-light.3b` keeps it (Valkyrie's Oath from v16) and loses
     `paladin-lance.4b` (Lance no longer slotted); a class with no `classes` entry is untouched; `calling` added to every
     Uma; running `toV27` twice equals once; a v27 class is untouched; the open world-map and Rift fights are byte-identical
     after it; a malformed `tree` is left for the parse.
   - `save/save-v27.test.ts` (the switch mocked to 16 with H64's `capsAt`, as `save-v25.test.ts` mocked 15): a rich v26
     world run through `toV27` parses (three weapons, `lines`, `calling`), and its open v15 fight replays; the same world
     unmigrated fails on five weapons; a v27 class with a `tree` key fails; a `calling.pick` of `brawler` fails. Unmocked,
     a v26 save parses as today and a world holding `lines` fails.
   - `save/calling.test.ts` (mocked to 16): `pickCalling` refuses a Front runner, a confirmed calling and a pick outside her
     options; at Lv 1 it moves her class and (no armor worn) her armor half; at Lv 5 only her calling; `confirmCalling`;
     a world win, a Sweep and a Rift win confirm it; Ascend carries it; `newOwnedUma` writes it.
   - `save/lines-v16.test.ts` (mocked to 16): `pickBranch` to B swaps an equipped Rend for Rending Combo and back;
     `learnSkill` is refused; `umaProfile` and `umaLoadout` read `lines`; `partyMembers` gives a Spell-Blade-picked
     Pace Uma her Flourish only as a Spell Blade.
   - Every existing test passes unchanged; both replay fixtures pass.
5. **Docs:** the D-row (fetch `main` first). `pnpm docs:update` leaves no diff.
6. **Check it locally** (your own ports, 390×844, desktop browser), on a scratch v26 save from the CJS build: the app as
   today (five weapons, sides, a fight at `"version": 15`). Then run `toV27` over that save's world in a node one-off (not
   committed) and parse it with the switch at 16 (`caps.ts` 16 locally, never committed): it parses; describe its classes.

## Done when

- [ ] `pnpm lint && pnpm test && pnpm build` pass; say the main JS number.
- [ ] The tests in step 4 pass; both replay fixtures pass untouched.
- [ ] `SAVE_SCHEMA_VERSION` is still 26 and `migrateWorld` doesn't call `toV27` (H72 does both).
- [ ] `docs/game/` is unchanged, `pnpm docs:update` leaves no diff, the D-row is logged.
- [ ] The local check in step 6 was done and described, and the local switch undone (`git diff` shows none). Nothing
  from the original games in git.
- [ ] Deployed green and https://uma-rpg.web.app/api/health shows the commit.

## Deliver

- **Claude, as a delegated worker:** a pull request from `feat/h69-save-v27-dark` with one commit,
  `feat(domain): save v27's migration, branch picks and the calling pick, dark (H69)`. H68 edits `partyMembers` in
  `save/battle.ts` at the same time: rebase on whichever lands first, and keep the pick swap in this commit. Fetch `main`
  before you push. The main session reviews and merges it, then watches the deploy.
- **Flag it done:** after the merge, a `docs(handoff): H69 done (D…)` commit deletes this file, sets H69 to Done with a
  Done row, and sets H70 to Ready if H65–H68 are done (and H72 when H70 and H71 are). R2's H78 can now be written against
  v27's shape.
