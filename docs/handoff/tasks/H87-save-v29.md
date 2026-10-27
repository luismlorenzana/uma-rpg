# H87 — Save v29 (dark): a branch per weapon kind, the second accessory slot and its forms, the Branch Gem, the weapon moon, the secondary

**uma-rpg · Claude · M · Needs: H83, H84, H85, H86 · Unblocks: H88 (the screens and the local switch), H90 (the switch chains it)**

> **Versions re-planned by D221 and D224 (2026-10-26):** saves v29 (the owner's "grant is tickets only" step) and v30 (the
> farm by line, H112) are taken and live. Read this packet's save v29 as **v31**, v30 as **v32** and v31 as **v33**;
> engines unchanged. Materials, recipes and the Workbench are the farm by line's
> ([farm-by-line.md](../../design/tier-rework/farm-by-line.md)): re-read them before any step that names R2's pairs, the
> ladder or a cross-line recipe.

## Why

H83–H86 built Release 3's rules dark. The save must hold what they introduce, and every existing save must reach that
shape without losing anything ([weapon-progression.md](../../design/tier-rework/weapon-progression.md) §11,
[extra-stats-progression.md](../../design/tier-rework/extra-stats-progression.md) §15,
[profession-progression.md](../../design/tier-rework/profession-progression.md) §14; README §9.3's "Save v28 (Tier 2)"
paragraph, whose weapon, accessory, moon and secondary parts are now v29's and whose class-branch parts are R4's v30):
- **per weapon kind `{ grade, branch?: 'pure' | 'dual' }`**, no stored partner (WP32 fixes it);
- **a second accessory slot** in Tier 2+ worlds and `form` gaining the five branch forms;
- **the Branch Gem's shelf**, and the G5 Weapon Gems Release 2 made in Tier 2+ worlds becoming Branch Gems;
- **`weapon-moon-1:1–5`** and **`stars.moons`**;
- **`OwnedUma.secondary`**;
- **promotion** carrying weapon branches.

This packet writes `toV29` and the strict parse, **not chained**, as H58 wrote `toV25`. H90 chains it with the switch.

## Context (read first)

Code pointers are by file and function: Releases 1 and 2 move the lines. Re-read the code before starting.

- `CLAUDE.md`, `AGENTS.md`; [implementation.md](../../design/tier-rework/implementation.md) (D198); **H83's two D-rows**
  (Release 3's build decisions: points 2, 5, 6, 7 and 8 are this packet's rules) and the D-rows of H84, H85, H86.
- D45 (the API refuses a save older than it stores), D69 (the `saveBackups` copy on a version bump), D180 and D188 (how
  H58 wrote `toV25` and H61 chained it), and **Release 2's save packet H78** (save v28: the gear shape, the accessory
  slot `{ grade, family, form: 'base', kind? }`, `stars: { open, moons: [] }`, the made-item ids, how its migration
  receives the world's tier).
- How a dark save packet was done last time: `git show 5dd9f08:docs/handoff/tasks/H58-save-v25-paladin.md`.
- **The code** (as Release 2 left it):
  - `save/save.ts`: `SAVE_SCHEMA_VERSION` (28), `OwnedUma` and her gear's type, `TierWorld`, the parsers of her gear,
    accessories and stars, `parseUmas`, `parseTierWorld` (runs the migration chain on the raw world first),
    `parseSave`, `parseSaveAsync`.
  - `save/migrations.ts`: `migrateWorld`'s chain and `toV28`, the model: literals only, frozen history, never imports
    `save.ts` or the rules, idempotent, leaves malformed data to the strict parse.
  - `save/rift.ts` `ascend` (what the new world's Uma gets), `save/work.ts` (the shape of a work row's request and
    output id), the Warehouse's item-id check.
  - H83's `rpg/weapon-branches.ts` (`rpgTwoKindCap`, `rpgSlotBlock`), H84's accessory table (`accessorySlots`,
    `accessoryFormOpen`), H85's weapon-moon module (`observatoryNodeCount`, node ids), H86's `OwnedUma.secondary`.
  - The API: `apps/api/src/save/firestore-save.repository.ts` (the backup on a version bump). Nothing changes there.

## Decisions made

- **`toV29(world, tier)`** in `migrations.ts`, exported, **not chained**: `SAVE_SCHEMA_VERSION` stays 28 and
  `migrateWorld` doesn't call it (the parse runs every step above a save's version, so chaining it now would migrate
  live saves). H90 chains it and bumps the version. It takes the world's tier as Release 2's chain passes it (if `toV28`
  didn't need one, thread the key through `migrateWorld` as an argument; Tier 1 is the default). Literals only, like
  `toV25`. Per world:
  1. **Every Uma's weapon kinds** become `{ grade }` (whatever v28's per-kind shape was; no branch).
  2. **Tier 2+ worlds only:**
     - **Branch Gems** (H83's point 5): the Warehouse's `weapon-gem-g5` become `branch-gem`, one for one; a started or
       queued work entry whose output is `weapon-gem-g5` makes `branch-gem` (the same recipe and time); and **one
       `branch-gem` for every weapon kind of every Uma at G5 or above** (raised during Release 2, it has no branch; she
       picks one with it on the weapon's sheet, H83's `reforgeWeapon`). Tier 1 worlds' G5 Weapon Gems stay.
     - **A second accessory slot** `{ grade: 0, family, form: 'base' }`: **a Pendant, or an Insignia when slot 1 holds a
       Pendant**. Why: the two families that need no kind, so the migration needs neither her class nor master data;
       one tap of the standard preset dresses her class's Tier 2 forms (H84).
  3. **`stars.moons`** stays `[]`: an empty list reads her preset (H85).
  4. **`secondary`** stays absent.
  5. **Open fights are untouched:** a v17 fight replays and settles on v17.
  Idempotent; overwrites so a current save relabelled older still parses; malformed rows are left to the parse.
- **The parse (strict), written now, live only with v29:**
  - **Weapons:** each kind `{ grade, branch? }`, grade 0–10. A branch only in Tier 2+ worlds; in a Tier 2 world only at
    G5 or above (a Tier 2 branch is taken at the G5 step); in a Tier 3 world at any grade (one carried from Tier 2,
    WP11). Every class she has set up respects `rpgSlotBlock` (the two-kind cap and partners not slotted).
  - **Accessories:** exactly `accessorySlots(tier)` slots (1 · 2); one of each family; a branch form only in Tier 2+
    and at its slot's G5 or above; `kind` and `kinds` as H84 set them (a Twin Orb's twin set by its element; a Channel
    Pendant's two kinds of one channel; none for Pendants and Insignias).
  - **Stars:** `weapon-moon-1:1–5` only in Tier 2+ worlds, in order, each at its level gate (Lv 6, 16, 26, 36, 46), as
    the core's nodes are checked; `moons` holds at most one entry in Tier 2+ (none in Tier 1): `{ mode: 'full', kinds:
    [a] }` or `{ mode: 'split', kinds: [a, b] }` with two different kinds.
  - **Items:** `branch-gem` accepted in Tier 2+ worlds' Warehouses (and their work rows); refused in Tier 1.
  - **`secondary`:** a profession id, only in Tier 2+ worlds. Not checked against her trade (the trade comes from her
    calling, which the parse can't read without master data); a secondary that later matches her trade (her calling
    pick moved) is harmless: her trade's gate already covers it, and the Work tab shows it as her trade.
- **Ascend (promotion) with v29** (`save/rift.ts` `ascend`, behind `rpgRework('t2Weapons')`, live default), H83's
  point 8:
  - her weapon kinds arrive as `{ grade: 0, branch }`, **carrying each branch** (WP11);
  - her accessory slots are the new tier's count at G0 in **base forms**: her families and kinds from the old world's
    slots in order (a branch form's base: Great X → X on its kind; a Channel Pendant → a Pendant; a Twin Orb → an Orb on
    the set's kind she slots first; Toll Bell → Bell; Onslaught → Insignia), a missing slot filled by the migration's
    Pendant-or-Insignia rule;
  - `stars` starts empty with `moons: []` (her new tier's preset, EP §12);
  - no `secondary` (PP23).
  Today's Ascend rules (her class, armor halves, used items back to the old world, seats, the purse) are unchanged.
- **The API:** unchanged. At H90 the first v29 write of the owner's save copies the stored v28 to
  `saveBackups/{uid}-v28` (D69).
- **Docs:** weapon-progression §11, extra-stats-progression §15 and profession-progression §14 gain "Save v29 built in
  H87 (D…), live from H90." The manual is unchanged.

## Do

1. **`save/migrations.ts`:** `toV29`, exported, with a doc comment (D…, steps 1–5; "chained by H90").
2. **`save/save.ts`:** the types (`OwnedUma`'s weapon entries with `branch?`, the accessory setting's `form` and
   `kinds`, `secondary?`, and `armor[slot].half?: 'physical' | 'magical'`, H83's decision 13: absent reads her class's
   half; only the four between classes may store one, only in a Tier 2+ world; the migration writes none) and the strict parse as decided. The live version stays 28: the new parse rules read the
   stage, so today's saves parse exactly as before.
3. **`save/rift.ts` `ascend`:** the v29 carry, behind the stage.
4. **Tests:**
   - `save/migrations-v29.test.ts`: a Tier 1 world's weapon kinds become `{ grade }` and nothing else moves (its
     `weapon-gem-g5` stay); a Tier 2 world: an Uma with the Lance at G7 and the Bow at G5 gets two Branch Gems, three
     stocked `weapon-gem-g5` become three more, a started Forge entry for `weapon-gem-g5` and a queued one now make
     `branch-gem`; slot 2 is a Pendant at G0 (an Insignia when slot 1 is a Pendant); `stars.moons` stays `[]`; no
     `secondary`; running `toV29` twice equals once; the open world-map and Rift fights are byte-identical after it.
   - `save/save-v29.test.ts`, the switch mocked to 18 with H64's `capsAt` (`rpg/battle/caps-at.fixture.ts`): a rich
     v28 two-tier world (Tier 1 and Tier 2, open v17 fights in both, a Forge queue, stock) run through `toV29` parses,
     and its open v17 fights replay to their frozen ends; the same world unmigrated fails on its Tier 2 world's one
     accessory slot (Tier 2 needs two). Refused, each with its path: a branch in a Tier 1 world; a branch below G5 in
     a Tier 2 world; two Duals in one class's slots in Tier 2; a Dual whose partner the same class slots; a branch form
     below its slot's G5; two Bells; three slots in Tier 2, two in Tier 1; `weapon-moon-1:1` in a Tier 1 world and
     `:2` without `:1`; a Split with one kind or two equal; a `secondary` in Tier 1; `branch-gem` in a Tier 1
     Warehouse. Accepted: a Tier 3 world's carried Pure at G0.
   - `save/ascend-v29.test.ts` (mocked): the new world's Uma carries her Pure Greatsword and Dual Lance at G0, wears two
     base forms (her Great Bell · Lance as a Bell · Lance, her Channel Pendant as a Pendant), has `moons: []` and no
     secondary; the old world keeps her grades, forms, moon and secondary. Unmocked, Ascend is Release 2's.
   - Every existing test passes unchanged; every replay test stays green.
5. **Docs:** log the D-decision (fetch `main` first); the design docs' lines. `pnpm docs:update` leaves no diff.
6. **Check it locally** (your own ports, a desktop browser at 390×844, never the iOS Simulator) on a scratch two-tier
   v28 save from the CJS build: the app loads it, a Tier 2 world-map fight starts and stores `"version": 17`, the
   Warehouse and the Gear tab look as before, and `apps/api/.data/save.json` still says `schemaVersion` 28.

## Done when

- [ ] `pnpm lint && pnpm test && pnpm build` pass; say the main JS number (of 230 KB).
- [ ] The tests in step 4 pass; every replay test passes untouched.
- [ ] `SAVE_SCHEMA_VERSION` is still 28 and `migrateWorld` doesn't call `toV29` (H90 does both).
- [ ] `docs/game/` is unchanged, `pnpm docs:update` leaves no diff, the D-decision is logged, the design docs have their
  lines.
- [ ] The local check in step 6 was done at 390×844 on a scratch save and described. Nothing from the original games in
  git.
- [ ] Deployed green and https://uma-rpg.web.app/api/health shows the commit.

## Deliver

- **Claude, as a delegated worker:** a pull request from `feat/h87-save-v29-dark` with one commit,
  `feat(domain): save v29's migration and parse, dark (H87)`; the body says why (written, tested, not chained). H89
  edits the balance harness and the generators at the same time; you share no files with it except, possibly,
  `save/battle.ts`: rebase on whichever lands first. Fetch `main` before you push. The main session reviews and merges
  it, then watches the deploy.
- **Flag it done:** after the merge, a `docs(handoff): H87 done (D…)` commit deletes this file, sets H87 to Done with a
  Done row, and sets H88 to Ready (H90 when H88 and H89 are done).
