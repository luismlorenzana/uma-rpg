# H97 — R4's switch: Tier 2's classes go live (engine v19, save v30), and the manual rewritten

**uma-rpg · Claude · M · Needs: H94, H95, H96 (and through them H91–H93) · Unblocks: H98 (R5's foundation)**

> **Versions re-planned by D221, D224 and D230 (2026-10-27):** saves v29 (tickets-only grant), v30 (the farm by line) and
> v31 (the Wilds' trios, H114) are taken and live. Read this packet's save v29 as **v32**, v30 as **v33** and v31 as
> **v34**; engines unchanged. Materials, recipes and the three-place rows are the farm by line's
> ([farm-by-line.md](../../design/tier-rework/farm-by-line.md)): re-read them before any step that names R2's pairs, the
> ladder or a cross-line recipe.

## Why

H91–H96 built Release 4, Tier 2's classes, dark: engine v19 (the class branches and their focus, the 36 class skills,
branch C, the Power or Break tip and the signature tip, ten slots, LB+), Tier 2's weaknesses by rank, boss shields 9 and
the full term, save v30's picks, the screens and the balance, every rule behind one switch, with v6–v18 replays pinned.
This packet **flips it in one commit**: new fights start on engine v19, saves become v30 (every class at branch 1, no
tips picked), Tier 2 worlds show their class trees, their narrowed foes and their term, and the manual describes the
game as it now plays. No deployed build before this one can put a class skill in a fight or show one; this one does
both.

## Context (read first)

Code pointers are by file and function: Releases 1–3 move the lines. Re-read the code before starting.

- `CLAUDE.md`, `AGENTS.md`, [implementation.md](../../design/tier-rework/implementation.md) (R4, the conventions:
  "the switch packet does three things in one commit"), H61's packet (`git show
  5dd9f08:docs/handoff/tasks/H61-classes-v2-switch.md`) and the switch packets of R1–R3 (H72, H82, H90: their D-rows and
  Done rows say how each flipped and what each test kind became).
- **The D-rows of H91–H96** (H91's first: R4's build decisions) and their Done rows in `docs/handoff/README.md`: H95
  lists the screens whose words go into `sections.md`; H96 the measured numbers.
- **The switch** (the local switch H94–H96 used):
  1. `packages/domain/src/rpg/battle/caps.ts`: `BATTLE_ENGINE_VERSION = 19`;
  2. `packages/domain/src/save/save.ts`: `SAVE_SCHEMA_VERSION = 30`;
  3. `packages/domain/src/save/migrations.ts`: chain `toV30` after `toV29` (`version < 30`) in `migrateWorld`.
- **The replays:** `rpg/battle/v18-replays.fixture.json` and its two tests (H91): the mocked one becomes the real one.
- **The manual pages to rewrite** ([docs/game/](../../game/)): `classes.md` (the class branches, the groups and the
  focus, the sets, the presets by branch, class skills), `skill-trees.md` (Tier 2's tree: C, the tip fork, the
  signature tip, the class tree, ten slots), `combat.md` (the damage stack's focus, the new rules and statuses, E6's cap,
  Tier 2's weaknesses by rank, shields and term, the Rift's Tier 2 fronts), `heroes.md` (LB+ at Bond 10),
  `sections.md` (the Skills tab, the Battle tab, the fight screen, the halls, the Party Hall's note, the Rift's
  guidance), `maps.md` (Tier 2's foes by role, the regions' leans), `loops.md` (Ascend preselects branch 1; the Rift's
  Tier 2 guidance), `architecture.md` (engine v19, save v30), and `docs/technical/architecture.md`.
- **The live blocks' renderers** (`packages/domain/src/docs/render.ts`): `classes`, `presets`, `skill-trees`,
  `active-slots`, `limits`, `heroes`, `battle-constants`, `damage-sources`, `foe-roles`, `foe-scaling`, `rift-fronts`,
  `rift-rules`. They read the live engine, so most move by themselves; read each against the code.
- **Design docs that name the state:** class-progression's status lines and its "Built in H9x" lines; uma-templates
  §3.5; stat-balance §12; rift.md §5 and §11; the tier-rework README §9.2's R4 rows and §9.3's v30 note;
  implementation.md's R4 row.
- **Production:** [infrastructure.md](../../technical/infrastructure.md); the API copies a stored save to
  `saveBackups/{uid}-v{n}` before a newer version replaces it (D69), and refuses a client save older than the stored one
  (D45), so an old PWA asks to update. The owner's phone check: [phone-check.md](../../testing/phone-check.md).

## Decisions made

- **One commit flips all three lines** and carries every test and doc change the flip needs. Nothing else changes
  behaviour: if a rule needs fixing, it's a bug in H91–H96's work, fixed here with a test and named in the delivery.
- **Tests that pinned today as "the live game"** fall in two kinds:
  - about **old fights or v18 rules that still matter** (v18 replays, a Tier 2 fight without class skills, twin
    weaknesses for an open v18 fight, R3's term row): make the version explicit (`engine: 18`) and keep them;
  - about **the live game** (Tier 2 at seven slots, Tier 2 regulars weak to twins, no class branch on a profile, no
    term beyond R3's): move them to v19, or delete them where an H91–H96 test already covers the same thing.
  List both kinds in the delivery.
- **The v18 rows stay.** Engine v18 needs its rules to replay; the generator's v18 rows (lists, shields, R3's term) are
  small and document the old game. No cleanup packet.
- **The migration runs as `toV30` was tested.** An open world-map or Rift fight at migration replays and settles on v18
  (no class skills, twin weaknesses, its frozen foes); the next fight is v19. Every class starts at branch 1 with Power
  tips, so a Tier 2 Uma's first v19 fight already carries her focus (her default group) and her three class skills once
  she equips them; nothing is equipped for her.
- **The manual says what the game now plays,** in its short style, with the live blocks regenerated:
  - `classes` prints each class's two branches with their focus and sets, and the class skills by Class Rank (a new
    `class-branches` block if `classes` gets too wide);
  - `battle-constants` gains v19's rows (`BATTLE_FOCUS_BONUS`, E6's one extra point a foe an act, the self-Barrier
    share of Long guard) with "v19:" meanings; `foe-scaling` prints Tier 2's term and the bosses' tenth; `rift-fronts`
    Tier 2's column; `active-slots` Tier 2's ten; `limits` and `heroes` the LB+ line;
  - engine v18's behaviour stays only where an old fight still uses it ("Fights from v6–v18 replay with …").
- **Versions:** nothing here pins a new uma-kit or uma-art; the handoff README's Versions line is unchanged.

## Do

1. **The switch:** the three lines above, and the comments that name the current versions (`save.ts`' header and
   `parseSave`'s doc: "v29 → v30 (D…): a class branch per class, branch C and tip picks"; `engine.ts`' header;
   `types.ts`' header; `caps.ts`' comment on the rework's stages).
2. **Run everything:** `pnpm lint && pnpm test && pnpm build`. Fix what the flip breaks as decided. Both v18 replay
   tests pass (R1–R3's too); so do H96's always-on checks.
3. **Docs:**
   - rewrite the manual pages listed in Context; extend `docs/render.ts` as decided; run `pnpm docs:update` and read
     every regenerated block against the code;
   - class-progression: the status line "Tier 2's classes built and live (H91–H97, D…)" and each "Built in H9x" line →
     "live from H97 (D…)"; uma-templates §3.5 and §10: the tips live; stat-balance §12: its Tier 2 items "measured
     (H96) and live (H97)";
   - rift.md §5: the Tier 2 column of the fronts and the guidance with branches, live; §11 as H96 left it;
   - the tier-rework README §9.2 and §9.3: R4's rows "live (H97, D…)"; implementation.md's R4 row "Live (H97, D…)";
   - architecture.md and technical/architecture.md: engine v19, save v30, and a v30 bullet in the save history;
   - log the D-row (fetch `main` first).
4. **Validate locally** (the API on your port with its local save; the web at 390×844 and 375×667, light and dark, in
   a desktop browser, never the iOS Simulator), on a scratch **v29** save made before the flip, holding: a Tier 1 world
   and a Tier 2 world; in the Tier 2 world a Class Rank 40 Brawler whose calling is Brawler (Dash stride), a Hero at
   Bond 10, a Spell Blade and a Cleric; an open Tier 2 world-map fight mid-round; an open Tier 2 Rift front fight; a
   party missing the Bow. Then, on the flipped build:
   - the API parses it and stores v30 (`apps/api/.data/save.json`: `schemaVersion` 30, `classBranch: 1` and `tips: {}`
     on every class loadout, the open fights' inputs still `version: 18`);
   - the open world-map fight finishes on v18 and settles; the next fight starts as `version: 19`;
   - a Tier 2 region's regulars show one weakness icon and its boss two; a Tier 1 region is as before;
   - the Skills tab's branch tiles, the switch sheet and "Switch and use the set", the Class tab with its pips, C on a
     fork, the tip fork with ★ Quickstep on her Greatsword tree, the focus marks; the Battle tab's focus row; the chips
     and the Gear tab's group words;
   - a v19 Tier 2 fight casting a class skill through a picked focus weapon, a Break tip's double chip, an LB+ cut-in;
     the halls' LB+ lines; the Party Hall's "No Bow in this party"; the Rift's Tier 2 guidance with branches;
   - in the Tier 1 world nothing new shows: no branch, no C, no tips, seven slots, twin weaknesses.
   Describe what you saw; screenshots with original art stay local.
5. **Deploy and watch** (`gh run watch <id> -R luismlorenzana/uma-rpg --exit-status`); https://uma-rpg.web.app/api/health
   shows the commit. Tell the owner: on the phone's first sync the save becomes v30 and the v29 copy is kept in
   `saveBackups/{uid}-v29`; name the screens H95 said touch the edges (P60, phone check).

## Done when

- [ ] `BATTLE_ENGINE_VERSION` is 19, `SAVE_SCHEMA_VERSION` 30 and `migrateWorld` chains `toV30`, all in one commit.
- [ ] `pnpm lint && pnpm test && pnpm build` pass; the v18 replay tests and R1–R3's pass; the main JS is under 230 KB
  gzip (say the number and the change since H91).
- [ ] The manual describes Tier 2's classes as played; `pnpm docs:update` leaves no diff; class-progression,
  uma-templates, stat-balance, rift.md, the tier-rework README and implementation.md read right; the D-row is logged.
- [ ] The local validation in step 4 was done at both widths and both appearances, and described. Nothing from the
  original games in git.
- [ ] Deployed green (`gh run watch <id> -R luismlorenzana/uma-rpg --exit-status`), and
  https://uma-rpg.web.app/api/health shows the commit in `build`.

## Deliver

- **Claude, as a delegated worker:** a pull request from `feat/h97-r4-live` with one commit,
  `feat: Tier 2's classes live, engine v19 and save v30 (H97)`; the body says what flipped, the tests moved or made
  explicit, and the local validation. Fetch `main` before you push. The main session reviews and merges it, then watches
  the deploy; this deploy changes the owner's save, so it's watched to the end and health is checked.
- **Flag it done:** after the merge, a `docs(handoff): H97 done, Tier 2's classes are live (D…)` commit deletes this
  file, sets H97 to Done with a Done row, replaces R4's build status in `docs/handoff/README.md` with one line ("R4 is
  built and live …"), and sets H98 to Ready.
