# H102 — Save v31, dark: two lines held, the master slot, Tier 3's weapon branches, the third slot, weapon moon 2

**uma-rpg · Claude · M · Needs: H99, H100 (and through them H98) · Unblocks: H103 (the local switch), H105 (the switch chains it)**

> **Versions re-planned by D221, D224 and D230 (2026-10-27):** saves v29 (tickets-only grant), v30 (the farm by line) and
> v31 (the Wilds' trios, H114) are taken and live. Read this packet's save v29 as **v32**, v30 as **v33** and v31 as
> **v34**; engines unchanged. Materials, recipes and the three-place rows are the farm by line's
> ([farm-by-line.md](../../design/tier-rework/farm-by-line.md)): re-read them before any step that names R2's pairs, the
> ladder or a cross-line recipe.

## Why

H98–H100 built Tier 3's toolbox as rules, engine v21 and save actions, with the save's types widened. The save itself
must hold it strictly and bring every existing world across:
- **the shape** ([README](../../design/tier-rework/README.md) §9.3's "Tier 3's save", weapon-progression §11,
  extra-stats-progression §15, class-progression §14): two lines held a tree and the master slot;
  `branch: 'keen' | 'tempered' | 'evolved'`; a third accessory slot; `weapon-moon-2:1–5` and up to two `stars.moons`
  entries, every kind different;
- **the migration:** a Tier 3 world that exists at the switch played Tier 2's shape (Release 5's build decision 4), so
  it gains a third slot and the new loadout fields, and keeps everything it has;
- **Ascend** into Tier 3 dresses a promoted Uma in Tier 3's shape.

This packet writes save v31's rules, **dark**: `toV31` is written and tested but not chained, and the parse's Tier 3
rules read the live stage. H105 chains `toV31`, sets `SAVE_SCHEMA_VERSION` to 31 and flips the engine in one commit.

## Context (read first)

Code pointers are by file and function: Releases 1–4 move the lines. Re-read the code before starting.

- `CLAUDE.md`, `AGENTS.md`. **How a dark save was built:** `git show 5dd9f08:docs/handoff/tasks/H58-save-v25-paladin.md`
  and D180; D45 (the API refuses a save older than it stores) and D69 (`saveBackups/{uid}-v{n}`).
- **The design's save sections:** README §9.3 (D198 renumbers Release 5's save **v31**), weapon-progression §11 and
  §3.10, extra-stats-progression §15 and §5.3, class-progression §14 and §6.4, weapon-progression §5.3 ("promotion:
  grades reset; the forms stay known").
- **H98, H99 and H100's packets and D-rows:** the branch `line` beside `branch: 'tempered'`, the late step; the third
  slot and the step derived from the slot's grade, every branch form open in Tier 3; weapon moon 2's rules and **the
  derived moons** (empty reads both presets; one entry derives moon 2 as its complement); `ClassLoadout.second`,
  `secondTips`, `master`; Tier 3's presets.
- **Releases 3 and 4's save packets and D-rows:** **H87** (`toV29(world, tier)`, the tier threaded through
  `migrateWorld`; the per-kind `{ grade, branch? }`; the second slot's rule "a Pendant, or an Insignia when slot 1 holds
  a Pendant", chosen so the migration needs neither her class nor master data; `stars.moons` empty reading her preset;
  Ascend with base forms), **H94** (`toV30`, `classBranch`, `tips` required and written by the migration so the strict
  parse proves the chain; new loadouts write the fields only when live), and how H90 and H97 chained them.
- **The code:**
  - `packages/domain/src/save/save.ts`: `SAVE_SCHEMA_VERSION` (30), `OwnedUma`, `ClassLoadout`, the gear, accessory and
    stars types, `parseUmas`, `parseLoadout` and the parsers R2–R4 added; `parseTierWorld` (the world's tier, the
    migration chain on the raw world); `parseSave`, `parseSaveAsync`, `parseSaveChecked`.
  - `save/migrations.ts`: `migrateWorld(raw, version, tier)` and its chain; `toV30`, the model: literals, never
    importing `save.ts` or the rules, overwriting so a current save relabelled older still parses, malformed data left
    to the strict parse.
  - `save/rift.ts`: `ascend` (what R2–R4 made it do to gear, stars and loadouts).
  - `save/tiers.fixture.ts`; `rpg/battle/caps-at.fixture.ts` (`capsAt`).
  - `apps/api/src/save/firestore-save.repository.ts` (the backup on a version bump): nothing changes there.

## Decisions made

- **`toV31(world, tier)`** in `migrations.ts`, exported, **not chained**: `SAVE_SCHEMA_VERSION` stays 30 and
  `migrateWorld` doesn't call it. It takes the tier `migrateWorld` already threads (H87). Literals only; idempotent;
  anything malformed is left for the strict parse.
- **A Tier 1 or Tier 2 world is untouched** (byte for byte).
- **A Tier 3 world**, per Uma:
  1. **Weapons** keep their grades and branches. Nothing is stepped: a weapon at G5 or above still on Pure or Dual is
     offered its Tier 3 step by H98's late step (one Branch Gem, the grade kept).
  2. **Loadouts:** every class she has set up gains **`second: {}`, `secondTips: {}`** (each tree's second line is then
     the default, A, or B when her first is A; its tip Power) and **`master: null`** (her branch capstone, once open).
     Her first line and `tips` stay. An Uma already at Class Rank 50 meets her capstones open at the switch.
  3. **Accessories:** a **third slot** `{ grade: 0, family, form: 'base' }`: **a Pendant if she wears none, else an
     Insignia if she wears none**, else (she wears both) an **Orb** on the first weapon of her stored `classId`'s
     loadout, or of the first class she has set up in `RPG_ALL_CLASSES`' order, or the Greatsword with none set up. Why:
     H87's rule, kind-free families first, so the migration needs neither her class nor master data; G0 adds nothing;
     one tap of the standard preset dresses Tier 3's forms (H99). Her two slots keep grade, family, form and kind.
  4. **Weapon moons:** `stars.moons` stays as it is. Empty reads Tier 3's preset (both moons); one entry is her moon 1
     and moon 2 reads its complement (H99). Her open `weapon-moon-1:*` nodes stay; `weapon-moon-2` opens none.
  5. Nothing else moves: Class Ranks, the class branch, the core map, jewels, wallets, parties, Bonds, the open
     world-map fight (a v20 input replays and settles on v20).
- **Strict parsing, by tier** (each Tier 3 rule reads `rpgRework('t3')`, so before the switch a Tier 3 world parses as
  v30 does):

  | Data | Tier 1 · 2 | **Tier 3** |
  |---|---|---|
  | A weapon's `branch` | none · `pure`, `dual` (H87) | + **`keen`, `tempered`, `evolved`** at G5 or above (a Tier 3 step is taken at its G5); **`line: 'pure' \| 'dual'`** exactly when `tempered` |
  | Her slotted weapons | `rpgSlotBlock` (H87) | `rpgSlotBlock` with Tier 3's cap and partners, in every class she has set up |
  | Accessory slots | `accessorySlots(tier)`: 1 · 2 | **Exactly 3**, one of each family; a branch form at any grade (H99) |
  | `stars.open` | H87's | + `weapon-moon-2:1–5`, in order, at their level gates; refused outside Tier 3 |
  | `stars.moons` | none · at most 1 | **At most 2**, every kind different across them, **at most one Split** |
  | `second`, `secondTips` | absent | **Required** (may be empty); a second line differs from the first; a signature only on her first slot's tree, one a map |
  | `master` | absent | **Required**: `null` or a capstone she holds (a depth 6 node of one of her two lines, or her branch capstone `<class>-<branch>.6`), never also in her loadout, only at Class Rank 50 |

  A world `toV31` produced parses with the switch mocked to 20; the same Tier 3 world unmigrated fails (two accessory
  slots, no `master`): that's why H105 chains `toV31` with the bump.
- **New loadouts** write `second`, `secondTips` and `master` only in a Tier 3 world when v31 is live (H94's pattern), so
  a v30 app never meets a key it doesn't know.
- **Ascend into Tier 3** (`save/rift.ts`, while `rpgRework('t3')`): branches carry and grades reset (as today); her
  accessory slots arrive at G0 **keeping her two slots' families, forms and kinds** (WP §5.3: the forms stay known, and
  in Tier 3 a branch form is open at any grade, H99), plus a third by step 3's rule; `stars` empty with `moons: []`
  (Tier 3's preset, both moons); every class she has set up writes `second: {}`, `secondTips: {}`, `master: null`.
  Dark, Ascend builds Release 4's shape (H87's base forms), which `toV31` brings across at the switch.
- **The API is unchanged.** At H105 the first v31 write of the owner's save keeps `saveBackups/{uid}-v30` (D69); an old
  app's v30 write is refused once v31 is stored (D45).
- **A real-shaped fixture**, `save/v31.fixture.ts`: a v30 save with Tier 1 and Tier 2 worlds and a Tier 3 world of
  twenty ascended Umas on Tier 2's shape, among them: a Brawler with Pure Greatsword at G7 and Dual Lance + Katana at G3;
  a Mage whose moon is Split Fire + Ice with four nodes open, slots Pendant and Insignia; a Spell Blade holding line C
  with a Break tip on one tree and the signature tip on her lead tree; a Cleric at Class Rank 50; an Uma with `moons: []`;
  an open Tier 3 world-map fight at version 20, mid-round.
- **The manual** is unchanged (H105 rewrites it). `pnpm docs:update` leaves no diff.

## Do

1. **`save/migrations.ts`:** `toV31(world, tier)`, exported, with a doc comment (D…, steps 1–5; "chained by H105").
2. **`save/save.ts`:** the strict Tier 3 rules as decided, each through the live stage; the types H98–H100 widened, now
   parsed; new loadouts' fields gated.
3. **`save/rift.ts`:** Ascend into Tier 3's shape, gated.
4. **The fixture** `save/v31.fixture.ts`.
5. **Tests:**
   - `save/migrations-v31.test.ts`: the fixture's Tier 1 and Tier 2 worlds are byte-identical after `toV31`; in its
     Tier 3 world every set-up class gains `second: {}`, `secondTips: {}`, `master: null`; each Uma gains a third slot at
     G0 by the rule (the Mage, wearing a Pendant and an Insignia, an Orb on her first weapon); `moons` unchanged (the
     Mage's one Split entry, the empty one); weapons, grades, open nodes, tips, Class Ranks and the open fight
     byte-identical; running `toV31` twice equals once; a malformed loadout or accessory list is left as it was.
   - `save/save-v31.test.ts`, with `capsAt(21, …)`: the migrated fixture parses; its open v20 fight replays to the frozen
     end; the Spell Blade's C tree holds C and A, her other trees A and B; unmigrated, the Tier 3 world fails on its
     accessory slots; each strict rule refuses its bad case (a `keen` in a Tier 2 world, a `keen` at G3, a `tempered`
     without `line`, a fourth slot, two of one family, two Split moons, a kind on both moons, a third moon entry, a
     second line equal to the first, a signature off her first slot's tree, a master slot holding a non-capstone or one
     also in her loadout, a master slot below Class Rank 50).
   - `save/ascend-t3.test.ts`, with `capsAt(21, …)`: an Ascend from Tier 2 lands each of the twenty in Tier 3's shape
     (three slots keeping her forms, `moons: []`, the new loadout fields, branches carried, grades G0); unmocked, Ascend
     is Release 4's.
   - H98's v20 replay tests and every existing test pass unchanged (the earlier migration tests included).
6. **Docs:** weapon-progression §11, extra-stats-progression §15 and class-progression §14 gain "Save v31 built in H102
   (D…), live from H105." Log the D-row (fetch `main` first). `pnpm docs:update` leaves no diff.
7. **Check it locally** (your own ports; a desktop browser at 390×844; never the iOS Simulator): load the fixture's
   shape as a scratch v30 save built from the CJS build; the API parses it and stores v30 unchanged; the Tier 3 world's
   Stable, Gear tab, Observatory and world map read as before; its open fight continues on v20.

## Done when

- [ ] `pnpm lint && pnpm test && pnpm build` pass; say the main JS number (gzip, of 230 KB; `toV31` is in no chunk until
  H105 chains it).
- [ ] The tests in step 5 pass; both v20 replay tests pass untouched.
- [ ] `SAVE_SCHEMA_VERSION` is still 30 and `migrateWorld` doesn't call `toV31` (H105 does both); `BATTLE_ENGINE_VERSION`
  is 19.
- [ ] `docs/game/` is unchanged, `pnpm docs:update` leaves no diff, the D-row is logged, the design docs have their
  lines.
- [ ] The local check in step 7 was done and described. Nothing from the original games in git.
- [ ] Deployed green and https://uma-rpg.web.app/api/health shows the commit.

## Deliver

- **Claude, as a delegated worker:** a pull request from `feat/h102-save-v31-dark` with one commit,
  `feat(domain): save v31's migration and Tier 3's strict parse, dark (H102)`. H104 runs beside you in the balance
  harness and the knobs; you share no files. Fetch `main` before you push. The main session reviews and merges it, then
  watches the deploy.
- **Flag it done:** after the merge, a `docs(handoff): H102 done (D…)` commit deletes this file, sets H102 to Done in
  `docs/handoff/README.md` with a Done row, and sets H103 to Ready.
