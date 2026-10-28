# H105 — Release 5's switch: Tier 3 goes live (engine v21, save v31), and the manual rewritten

**uma-rpg · Claude · M · Needs: H102, H103, H104 (and through them H98–H101) · Unblocks: nothing (closes Release 5 and the Tier rework's build)**

> **H116 re-plan (D237):** Tier 3 keeps weaknesses v2's live three-kind WK8 world lists. Ignore every one-kind/twin
> instruction below; H101 only verifies the lists while adding Tier 3's term and shields. The Rift stays on WK9.

> **Versions re-planned by D221, D224 and D230 (2026-10-27):** saves v29 (tickets-only grant), v30 (the farm by line) and
> v31 (the Wilds' trios, H114) are taken and live. Read this packet's save v29 as **v32**, v30 as **v33** and v31 as
> **v34**; engines unchanged. Materials, recipes and the three-place rows are the farm by line's
> ([farm-by-line.md](../../design/tier-rework/farm-by-line.md)): re-read them before any step that names R2's pairs, the
> ladder or a cross-line recipe.

## Why

H98–H104 built Tier 3's whole toolbox dark: engine v21 (Keen, Tempered, Evolved; the third accessory slot and its step;
the second weapon moon; capstones, two lines held, the master slot, the six masteries), Tier 3's lists, shields and
term, the secondary's Tier 2 work, save v31's migration, the screens and the balance, every rule behind the `t3` stage,
with v6–v20 replays pinned. This packet **flips it in one commit**: new fights start on engine v21, saves become v31
(a Tier 3 world gains its third slot and the new loadout fields), Tier 3 worlds show their toolbox, and the manual
describes the game as it now plays. Tier 1 and Tier 2 worlds don't change, but for Tier 2's one look-ahead line on the
weapon sheet.

## Context (read first)

Code pointers are by file and function: Releases 1–4 move the lines. Re-read the code before starting.

- `CLAUDE.md`, `AGENTS.md`, [implementation.md](../../design/tier-rework/implementation.md) (Release 5, the conventions:
  "the switch packet does three things in one commit"), H61's packet (`git show
  5dd9f08:docs/handoff/tasks/H61-classes-v2-switch.md`) and the switches of Releases 1–4 (H72, H82, H90, H97: their
  D-rows and Done rows say how each flipped and what each test kind became).
- **The D-rows of H98–H104** (H98's first: Release 5's build decisions) and their Done rows in `docs/handoff/README.md`:
  H103 lists the screens whose words go into `sections.md`; H104 the measured and tuned numbers.
- **The switch** (the local switch H103 and H104 used):
  1. `packages/domain/src/rpg/battle/caps.ts`: `BATTLE_ENGINE_VERSION = 21`;
  2. `packages/domain/src/save/save.ts`: `SAVE_SCHEMA_VERSION = 31`;
  3. `packages/domain/src/save/migrations.ts`: chain `toV31(world, tier)` after `toV30` (`version < 31`) in
     `migrateWorld`, with the tier it already threads.
- **The replays:** `rpg/battle/v20-replays.fixture.json` and its two tests (H98): the mocked one becomes the real one.
  Every earlier fixture (v14, v15, v17, v19) stays green.
- **The manual pages to rewrite** ([docs/game/](../../game/)): `combat.md` (Keen, Tempered, Evolved and their
  multipliers; the Tier 3 partners; the two-kind cap in Tier 3; the masteries' rules and where they sit; Tier 3's
  weaknesses by rank, shields and term; the base MP regen's five-depth cap), `classes.md` (the masteries, the branch
  capstones, Tier 3's presets, the third slot and the step, the second weapon moon), `skill-trees.md` (depth 6, two
  lines held, the signature tip at both forks, ten slots and the master slot), `sections.md` (the Gear tab, the
  Observatory and the Skills tab in Tier 3, the fight screen's master skill and cues), `materials.md` (the Branch Gem's
  Tier 3 doors and re-forging, the secondary's Tier 2 work in Tier 3), `maps.md` (Tier 3's foes: sub-bosses one kind,
  boss shields 10, the term), `loops.md` (Tier 3's toolbox; Ascend into Tier 3; no Tier 3 Rift yet), `architecture.md`
  (engine v21, save v31), and `docs/technical/architecture.md`.
- **The live blocks' renderers** (`packages/domain/src/docs/render.ts`), as Releases 1–4 left them: `weapons`,
  `presets`, `skill-trees`, `depths`, `active-slots`, `battle-constants`, `damage-sources`, `foe-roles`, `foe-scaling`,
  `formations`, `classes`, `gear`, `families`, `tiers`. They read the live engine, so most move by themselves; read each
  against the code.
- **Design docs that name the state:** each standalone doc's status line and its "Built in H98–H104" lines
  (weapon-progression §3.3, §3.4, §5.3, §8, §11; extra-stats-progression §5.1, §12, §15; class-progression §3.5, §4.2,
  §4.4, §6.4, §6.7, §7.3, §14; stat-balance §3.6 and §12; profession-progression §2.3); uma-templates §3.5; the
  tier-rework README §9.2's "Tier 3, later" row and §9.3's "Tier 3's save"; implementation.md's Release 5 row;
  [tiers.md](../../design/tiers.md) §7 (T9 still stands).
- **Production:** [infrastructure.md](../../technical/infrastructure.md); the API copies a stored save to
  `saveBackups/{uid}-v{n}` before a newer version replaces it (D69), and refuses a client save older than the stored one
  (D45), so an old PWA asks to update. The owner's phone check: [phone-check.md](../../testing/phone-check.md).

## Decisions made

- **One commit flips all three lines** and carries every test and doc change the flip needs. Nothing else changes
  behaviour: if a rule needs fixing, it's a bug in H98–H104's work, fixed here with a test and named in the delivery.
- **Tests that pinned today as "the live game"** fall in two kinds:
  - about **old fights or v20 rules that still matter** (v20 replays, a Tier 3 fight on Tier 2's shape for an open v20
    fight, the interim Tier 3 term a₃ and b₃, Release 3's Tier 3 doors): make the version explicit (`engine: 19`) and
    keep them;
  - about **the live game** (a Tier 3 world with two accessory slots and one moon, one line a tree, Tier 3's G5 keeping
    or switching Pure or Dual, Tier 3 sub-bosses weak to twins, Tier 3 skills ranked at depth 5 at most): move them to
    v21, or delete them where an H98–H104 test already covers the same thing.
  List both kinds in the delivery.
- **The v20 rows stay.** Engine v20 needs its rules to replay; the generator's v20 rows (the interim Tier 3 term, Tier 3
  sub-bosses' twins, shields) are small and document the old game. No cleanup packet.
- **The migration runs as `toV31` was tested.** An open world-map fight in a Tier 3 world replays and settles on v20
  (Tier 2's shape, its frozen foes); the next fight is v21. Every Tier 3 Uma meets her toolbox as H102 decided: her
  weapons as they were (a weapon past G5 on Pure or Dual offers "Take the Tier 3 step"), a third slot at G0, her moons
  as stored or derived from her preset, A and B held (her own line first), the master slot chosen for her, and at Class
  Rank 50 her capstones and mastery open at once. Nothing is equipped for her beyond what the derived defaults give.
- **The manual says what the game now plays,** in its short style, with the live blocks regenerated:
  - `weapons` prints the Tier 3 branches with their multipliers and partners; `presets` Tier 3's rows (both class
    branches, three slots, both moons); `skill-trees` and `depths` depth 6 and the capstones; `active-slots` Tier 3's
    ten and the master slot; `classes` the masteries and the branch capstones;
  - `battle-constants` gains v21's rows (Keen 1.7, the six masteries' constants with H104's values, the healers' depth 6
    share 0.48) with "v21:" meanings; `foe-scaling` prints Tier 3's term and its bosses' tenth; `formations` Tier 3's
    shields;
  - engine v20's behaviour stays only where an old fight still uses it ("Fights from v6–v20 replay with …").
- **The Tier rework's build is complete** with this release: the handoff README's Release 5 status becomes one line
  ("Tier 3 is built and live (H98–H105, D…)"), as "The Rift is built and live" does. Tier 3's Rift still waits for the
  fifth scenario (T9); UT20's dial waits for the owner.
- **Versions:** nothing here pins a new uma-kit or uma-art; the handoff README's Versions line is unchanged.

## Do

1. **The switch:** the three lines above, and the comments that name the current versions (`save.ts`' header and
   `parseSave`'s doc: "v30 → v31 (D…): Tier 3's third slot, two lines held and the master slot"; `engine.ts`' header;
   `types.ts`' header; `caps.ts`' comment on the rework's stages: all five live).
2. **Run everything:** `pnpm lint && pnpm test && pnpm build`. Fix what the flip breaks as decided. Both v20 replay
   tests pass (and every earlier fixture); so do H104's always-on checks.
3. **Docs:**
   - rewrite the manual pages listed in Context; extend `docs/render.ts` as decided; run `pnpm docs:update` and read
     every regenerated block against the code;
   - each standalone doc's status line "Tier 3 built and live (H98–H105, D…)" and each "Built in H98–H104" line →
     "live from H105 (D…)"; uma-templates §3.5: the tip at both forks live; stat-balance §12: its Tier 3 items "measured
     (H104) and live (H105)";
   - the tier-rework README §9.2 and §9.3: Tier 3's rows "live (H105, D…)"; implementation.md's Release 5 row "Live
     (H105, D…)";
   - architecture.md and technical/architecture.md: engine v21, save v31, and a v31 bullet in the save history;
   - log the D-row (fetch `main` first).
4. **Validate locally** (the API on your port with its local save; the web at 390×844 and 375×667, light and dark, in a
   desktop browser, never the iOS Simulator), on a scratch **v30** save made before the flip from the CJS build,
   holding Tier 1, 2 and 3 worlds; in the Tier 3 world (H102's fixture shapes): a Brawler with Pure Greatsword at G7
   and Dual Lance + Katana at G3 and a Branch Gem in the Warehouse, a Mage with a Split Fire + Ice moon wearing a
   Pendant and an Insignia, a Spell Blade holding line C with a Break tip and the signature tip on her lead tree, a
   Cleric at Class Rank 50; an open Tier 3 world-map fight mid-round. Then, on the flipped build:
   - the API parses it and stores v31 (`apps/api/.data/save.json`: `schemaVersion` 31; in the Tier 3 world each Uma's
     third slot, `second`, `secondTips` and `master` on every class loadout; the Tier 1 and Tier 2 worlds unchanged;
     the open fight's input still `version: 20`);
   - the open fight finishes on v20 and settles; the next fight starts as `version: 21`;
   - the Brawler's G7 Pure offers "Take the Tier 3 step", Keen spends the gem and the row reads "weak ×1.7"; the Mage's
     Observatory shows two moons (moon 2 derived as a Full on her third kind, "(preset)"); her third slot at G0; the
     Spell Blade's Skills tab holds C and A with their tips; the Cleric's capstones, master slot and "Overflow" on her
     root;
   - a v21 Tier 3 fight on Auto and by hand with a capstone, the master skill and a mastery's cue; a Tier 3 region's
     sub-bosses with one weakness icon and a boss's shield 10;
   - a Tier 3 Work tab: a secondary offered Tier 2's pair, refused Tier 3's ("Her main trade's work");
   - in the Tier 1 and Tier 2 worlds nothing new shows but Tier 2's look-ahead line on the weapon sheet.
   Describe what you saw; screenshots with original art stay local.
5. **Deploy and watch** (`gh run watch <id> -R luismlorenzana/uma-rpg --exit-status`); https://uma-rpg.web.app/api/health
   shows the commit. Tell the owner: on the phone's first sync the save becomes v31 and the v30 copy is kept in
   `saveBackups/{uid}-v30`; Tier 3 shows only in a Tier 3 world; name the screens H103 said touch the edges (P60, the
   phone check).

## Done when

- [ ] `BATTLE_ENGINE_VERSION` is 21, `SAVE_SCHEMA_VERSION` 31 and `migrateWorld` chains `toV31`, all in one commit.
- [ ] `pnpm lint && pnpm test && pnpm build` pass; both v20 replay tests and every earlier fixture pass; the main JS is
  under 230 KB gzip (say the number and the change since H98).
- [ ] The tests that pinned the live game are moved or made explicit, both kinds listed in the delivery.
- [ ] The manual describes Tier 3 as played; `pnpm docs:update` leaves no diff after the regeneration; the design docs'
  status lines read right; the D-row is logged.
- [ ] The local validation in step 4 was done at both widths and both appearances on a scratch save, and described.
  Nothing from the original games in git (`git status`).
- [ ] Deployed green and https://uma-rpg.web.app/api/health shows the commit.

## Deliver

- **Claude, as a delegated worker:** a pull request from `feat/h105-t3-live` with one commit,
  `feat: Tier 3 live, engine v21 and save v31 (H105)`; the body says what flipped, the tests moved or made explicit, and
  the local validation. Fetch `main` before you push. The main session reviews and merges it, then watches the deploy;
  this deploy changes the owner's save, so it's watched to the end and health is checked.
- **Flag it done:** after the merge, a `docs(handoff): H105 done, Tier 3 is live (D…)` commit deletes this file, sets
  H105 to Done with a Done row, and replaces Release 5's build status in `docs/handoff/README.md` with one line, as
  "The Rift is built and live" does.
