# H94 — Save v30, dark: a class branch per class, branch C and the tip picks

**uma-rpg · Claude · S–M · Needs: H91, H92 · Unblocks: H95 (the screens' state and the local switch), H97 (the switch chains it)**

> **Versions re-planned by D221, D224 and D230 (2026-10-27):** saves v29 (tickets-only grant), v30 (the farm by line) and
> v31 (the Wilds' trios, H114) are taken and live. Read this packet's save v29 as **v32**, v30 as **v33** and v31 as
> **v34**; engines unchanged. Materials, recipes and the three-place rows are the farm by line's
> ([farm-by-line.md](../../design/tier-rework/farm-by-line.md)): re-read them before any step that names R2's pairs, the
> ladder or a cross-line recipe.

## Why

H91 and H92 built Tier 2's class rules in the engine: a class branch per class (the focus, the set, three class
skills), branch C on every tree, and the tip fork (Power, Break, or her signature tip). A player's choices among them
have to live in the save, and the fight's input has to freeze them (CP31's v30 part; UT17):
- **a class branch per class**, branch 1 by default (CP26: Ascend preselects it); the focus and the set derived, never
  stored; her weapons as she slots them (the set is a preset, not a lock);
- **branch C** as a third value of R1's per-tree pick;
- **a tip pick per tree:** Power (the default), Break, or the signature, "stored like every pick" (UT17).

This packet writes save v30's rules **dark**: `toV30` written and tested but not chained, the parse and the setters
behind the live predicate, the sheet freezing the picks into a v20 input. H97 chains `toV30`, sets
`SAVE_SCHEMA_VERSION` to 30 and flips the engine in one commit. Nothing is deleted or converted, so there is no
compensation.

## Context (read first)

Code pointers are by file and function: Releases 1–3 move the lines. Re-read the code before starting.

- `CLAUDE.md`, `AGENTS.md`; D45 (the API refuses a save older than it stores), D69 (`saveBackups/{uid}-v{n}`), H58's
  packet (`git show 5dd9f08:docs/handoff/tasks/H58-save-v25-paladin.md`, the dark-migration model), and the D-rows of
  H69, H87 (saves v27 and v29: how this release's predecessors shaped `ClassLoadout` and the picks), H91 and H92.
- **The design:** [class-progression.md](../../design/tier-rework/class-progression.md) §14 (save v28's paragraph, now
  v30's), CP31, CP14 (equipped skills follow a swap), §7.2 ("Her weapons follow it", "Ascend preselects branch 1");
  [uma-templates.md](../../design/tier-rework/uma-templates.md) §3.5 (UT9: the tip follows her first slot), §3.8
  (UT12: as her calling only), §9 (UT17); the tier-rework README §9.3's "Save v28 (Tier 2)" paragraph (its class part
  is v30's, D198).
- **H91's and H92's shapes:** `classBranch` (on `BattleAlly` and the profile), `rpgBranchSet`, `classPreset(…,
  branch)`, class-tree node ids `<class>-<branch>.<depth>`, the tree line `RpgBranch` with `'C'` (`RPG_BRANCH_C`,
  `rpgBranchNode`), `BattleAlly.tips` (`'break' |
  'quickstep' | 'spillover' | 'long-guard'`), `BattleAlly.heroBond`.
- **The code:**
  - `save/save.ts`: `SAVE_SCHEMA_VERSION`; `ClassLoadout` (with the per-tree line H69 stores in v27, `RpgBranch`,
    set by its `pickBranch` through H65's `rpgSwapBranchLoadout`; use the names the code has);
    `OwnedUma` (`calling`, `bonds`); `parseLoadout`, `parseUmas`, `parseTierWorld`, `parseSave`; wherever a new class
    loadout is made (`newOwnedUma`, first use of a class).
  - `save/migrations.ts`: `migrateWorld`'s chain; `toV29` (H87), the model: literals, never imports `save.ts` or the
    rules, overwrites so a current save relabelled older still parses.
  - `save/battle.ts`: `chooseClass`, `setClassWeapons`, `holdWeapon`, R1's pick setter, `equipSkills`, `umaProfile`,
    `umaLoadout`; `save/class.ts` (`activeClass`, `classOf`); `save/presets.ts` (`wearClassPreset`); `save/sheet.ts`
    (`umaBattleSheet`); `save/rift.ts` (Ascend: the new world's Umas); `save/heroes.ts` (seats, Bonds).
  - Tests that mock the switch: H64's `capsAt` (`rpg/battle/caps-at.fixture.ts`), as H87's save tests do.
  - The API: `apps/api/src/save/firestore-save.repository.ts` (the backup on a version bump). Nothing changes there.

## Decisions made

- **`ClassLoadout` in v30**, every world:
  - **`classBranch: 1 | 2`**, required. Branch 1 is the default and the only value in a tier 1 world.
  - **H69's per-tree line** gains `'C'`, only in a world of tier 2 or more. Lines stay per tree when she unslots a kind
    (CP31), so slotting it back restores its line.
  - **`tips: Partial<Record<RpgWeapon, 'break' | 'signature'>>`**, required, absent keys meaning Power. Empty in a tier 1
    world. At most one `'signature'` in a loadout.
  - **Why required, written by the migration:** one shape in every world, and the strict parse proves the chain: an
    unmigrated v29 world fails under the mocked switch, as H58's did. **Why `classBranch`:** "branch" alone is R1's tree
    line and R3's Pure or Dual (H91's naming decision).
- **`toV30(world, tier)`** in `migrations.ts` (the chain's signature since H87; it writes the same in every tier),
  exported, **not chained** (`SAVE_SCHEMA_VERSION` stays 29 and `migrateWorld` doesn't call it; H97 does both).
  Literals only. Per Uma, per class loadout: `classBranch: 1` and `tips: {}` where
  absent. **Nothing else moves:** weapons, picks, loadouts, the open world-map and Rift fights (v19 inputs replay on v19),
  runs, wallets, Bonds. Running it twice equals running it once.
- **The parse** (`parseLoadout`) reads the new fields only when v30 is live (`rpgRework('t2Classes')`, the live default),
  so before the switch it is today's parse, byte for byte. Under the switch: both fields required; in a tier 1 world
  `classBranch` must be 1, `tips` empty, no `'C'` line; in tier 2 and later any branch, C line and tip, one signature at
  most; a loadout's class skills must be its branch's (`<class>-<branch>.<depth>`).
- **New loadouts write the fields only when v30 is live:** a new Uma, a class's first set-up and Ascend's new world start
  every class at `classBranch: 1`, `tips: {}` (CP26: Ascend preselects branch 1). Before the switch nothing new is
  written, so a v29 app never meets a key it doesn't know.
- **The setters** (`save/battle.ts` or a new `save/branches.ts`), tier 2 and later, outside fights as `chooseClass` is,
  each refusing in a tier 1 world with a short reason:
  - **`setClassBranch(save, outfitId, classId, branch, now, tier)`**: free and instant; her **equipped class skills
    follow depth for depth** (Frenzied Swing's slot takes Rallying Roar), as CP14 does for a tree's line. Her weapons
    don't move.
  - **The set in one tap** (CP40): `wearClassPreset(…, branch)` dresses the branch's set and its accessories and moons
    (H91's `classPreset`). A separate call, so switching branch never re-specs her uninvited.
  - **H69's `pickBranch`** takes `'C'`; her equipped skills of that tree follow depth for depth
    (`rpgSwapBranchLoadout`).
  - **`setTip(save, outfit, classId, weapon, tip, now, tier)`**, tip `'power' | 'break' | 'signature'`: `'signature'`
    only for her calling's class (`umaTemplate`'s calling, H67) on her first slot's tree; setting it clears any other
    `'signature'` in that loadout.
  - **The tip follows her first slot** (UT9): when `setClassWeapons` or `holdWeapon` changes `weapons[0]`, a
    `'signature'` moves to the new first slot's tree (replacing its Power or Break) and the tree it left falls back to
    Power.
- **The sheet** (`umaBattleSheet`), for a v20 input in a tier 2 or later world:
  - `classBranch` from her loadout;
  - `tips`: each `'break'` as is; a `'signature'` resolved to her stride's tip (Dash `'quickstep'`, Middle
    `'spillover'`, Stayer `'long-guard'`) **only when she fights as her calling's class and the tree is her
    `weapons[0]`**, else left out (she fights it as Power: UT12, "the option isn't offered");
  - `heroBond`: her Bond with her own seat when she is a Hero (`bonds[seat]`, D112);
  - her C line, through H65's per-tree line in the input (`'C'`), as her held line.
  In a tier 1 world, or for an engine below 19, none of these is sent (H91 and H92's validation would refuse them).
- **The API:** unchanged. At H97 the first v30 write of the owner's save copies the stored v29 to
  `saveBackups/{uid}-v29` (D69), and a v29 app's write is refused once v30 is stored (D45).
- **Docs:** class-progression §14 gains "Built in H94 (D…), live from H97"; the manual is unchanged; `pnpm docs:update`
  leaves no diff.

## Do

1. **`save/migrations.ts`:** `toV30`, exported, with a doc comment (D…; "chained by H97").
2. **`save/save.ts`:** `ClassLoadout`'s fields; `parseLoadout` under the live predicate; new loadouts' defaults under
   it.
3. **The setters and the sheet** as decided: `save/battle.ts` (or `save/branches.ts`), `save/presets.ts`'s branch
   argument, `save/sheet.ts`, Ascend in `save/rift.ts`. Export what H95 calls.
4. **Tests:**
   - `save/migrations-v30.test.ts`: every class loadout of every Uma in a tier 1 and a tier 2 world gains `classBranch:
     1` and `tips: {}` and nothing else changes (deep-equal apart from them); twice equals once; the open world-map and
     Rift fights are byte-identical; a world already carrying the fields is untouched.
   - `save/save-v30.test.ts`, the switch mocked to 19 with `capsAt`: a rich v29 world
     (tier 1 and tier 2 worlds, Duals, two accessory slots, a weapon moon, open fights) run through `toV30` parses, and
     its open v19 fight replays; the same world unmigrated fails on `classBranch`; a tier 1 loadout with branch 2, a C
     line or any tip fails; a tier 2 loadout with branch 2, C lines, a Break tip and one signature parses; two
     signatures fail; a branch 1 loadout equipping a branch 2 class skill fails.
   - `save/branches-v30.test.ts`, mocked to 19: `setClassBranch` swaps equipped class skills depth for depth and is
     refused in tier 1; `wearClassPreset(…, 2)` dresses the reverse set; `pickBranch` takes C in tier 2 and refuses it
     in tier 1; `setTip('signature')` works only as her calling's class on her first slot's tree; reordering her slots
     moves the signature and returns the old tree to Power; `umaBattleSheet` freezes `classBranch`, `tips` (a Dash Uma's
     signature as `'quickstep'`; none when she fights as another class) and `heroBond`, and a v20 fight from that sheet
     starts.
   - Unmocked: every existing save test passes unchanged; a new Uma's loadout has no `classBranch` before the switch.
5. **Docs:** log the D-row (fetch `main` first); class-progression §14's line. `pnpm docs:update` leaves no diff.
6. **Check it locally** (your own ports, 390×844, a desktop browser, never the iOS Simulator) on a scratch **v29** save
   with a Tier 2 world and an open fight:
   - without the switch, unlock an Uma, switch a class and start a world-map fight: all as before;
   - with the **local switch** (never committed: `caps.ts` 19, `SAVE_SCHEMA_VERSION` 30, `toV30` chained after `toV29`),
     restart the API: `apps/api/.data/save.json` reads `schemaVersion` 30, every class loadout has `classBranch: 1` and
     `tips: {}`, the open fight still says `version: 19` and finishes. Then undo the switch.

## Done when

- [ ] `pnpm lint && pnpm test && pnpm build` pass; say the main JS number (of 230 KB).
- [ ] The tests in step 4 pass; every existing test and the replay fixtures pass untouched.
- [ ] `SAVE_SCHEMA_VERSION` is still 29 and `migrateWorld` doesn't call `toV30`; `git diff` has no switch.
- [ ] `docs/game/` is unchanged, `pnpm docs:update` leaves no diff, the D-row is logged, class-progression has its line.
- [ ] The local check in step 6 was done and described, and the switch undone. Nothing from the original games in git.
- [ ] Deployed green (`gh run watch <id> -R luismlorenzana/uma-rpg --exit-status`), and
  https://uma-rpg.web.app/api/health shows the commit in `build`.

## Deliver

- **Claude, as a delegated worker:** a pull request from `feat/h94-save-v30-dark` with one commit,
  `feat(domain): save v30's class branches and tip picks, dark (H94)`. H96 edits the balance harness and the Rift's
  tuning at the same time; you may both touch `save/presets.ts` (rebase on whichever lands first). Fetch `main` before
  you push. The main session reviews and merges it, then watches the deploy.
- **Flag it done:** after the merge, a `docs(handoff): H94 done (D…)` commit deletes this file, sets H94 to Done with a
  Done row, and sets H95 to Ready (its other need, H93, lands in wave 2).
