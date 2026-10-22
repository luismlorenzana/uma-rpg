# H61 — The switch: classes v2 goes live (engine v15, save v25, the Paladin), and the manual rewritten

**uma-rpg · Claude · M · Needs: H59, H60 (and through them H53–H58) · Unblocks: nothing (closes the classes v2 build)**

## Why

H53–H60 built classes v2 dark: engine v15, save v25's migration, the accessories, the screens and the balance, every
rule behind one switch, with v6–v14 replays pinned. This packet **flips it in one commit**: new fights start on engine
v15, saves become v25 (every Cleric's progress copied to the Paladin, the Chapel's seats 3–4 moved to the Bastion,
accessories in typed slots), the Paladin and the Bastion appear, and the manual describes the game as it now plays. No
deployed build before this one can put a Paladin in a fight or show one; this one does both.

## Context (read first)

- `CLAUDE.md`, `AGENTS.md`, [classes-v2.md](../../design/classes-v2.md) (with its "Built in" lines), and the D-rows of
  H53–H60 (the build decisions are H53's first row). Each of those packets' Done rows in `docs/handoff/README.md` says
  what it built and what it left for this packet (H59 lists the screens whose words go into `sections.md`; H60 the
  measured numbers).
- **The switch** (the local switch H59 and H60 used):
  1. `packages/domain/src/rpg/battle/caps.ts`: `BATTLE_ENGINE_VERSION = 15`;
  2. `packages/domain/src/save/save.ts` 45: `SAVE_SCHEMA_VERSION = 25`;
  3. `packages/domain/src/save/migrations.ts` 203–215: chain `toV25` after `toV24` (`version < 25`).
- **The replays:** `rpg/battle/v14-replays.fixture.json` and its two tests (H53): the mocked one becomes the real one.
- **The manual pages to rewrite:** [classes.md](../../game/classes.md) (the five classes, the summon-lines table, Hand,
  "Starts as", accessories, the standard preset), [combat.md](../../game/combat.md) (§ Support (v12), Orbs and weaknesses,
  Limit Breaks, the `limits` and `battle-constants` blocks), [heroes.md](../../game/heroes.md) (five halls, twenty seats,
  inheritance), [skill-trees.md](../../game/skill-trees.md), [sections.md](../../game/sections.md) (§ Learning 59 and
  144, § Stable, § Party Hall, the fight screen), [loops.md](../../game/loops.md) (§ The Rift, the guidance),
  [architecture.md](../../game/architecture.md) (42–43, 120, 155–175), `docs/technical/architecture.md` (3, 24, 44–54).
- **The live blocks' renderers:** `packages/domain/src/docs/render.ts` (`classes` 89–99, `presets` 102–107, `limits`
  148–158, `heroes` 160–175, `battleConstants` 177–205, `gear` 291–316). They read the live generation, so most move by
  themselves; `classes` still prints a Heal lean column and one hand number, and `battleConstants` lacks v15's rows.
- **Design docs that name the state:** classes-v2.md's status line and §8; [rift.md](../../design/rift.md) §5's "Today's
  party" column and §11; [tiers.md](../../design/tiers.md) §6 Option A's Accessories row ("Orbs are +% damage", stale
  since C4).
- **Production:** [infrastructure.md](../../technical/infrastructure.md); the API copies a stored save to
  `saveBackups/{uid}-v{n}` before a newer version replaces it (D69; `apps/api/src/save/firestore-save.repository.ts`
  32), and refuses a client save older than the stored one (D45), so an old PWA asks to update.
- The owner's phone check: [phone-check.md](../../testing/phone-check.md).

## Decisions made

- **One commit flips all three lines** and carries every test and doc change the flip needs. Nothing else changes
  behaviour: if a rule needs fixing, it's a bug in H53–H60's work, fixed here with a test and named in the delivery.
- **Tests that pinned today as "the live game"** fall in two kinds:
  - about **old fights or v1 rules that still matter** (v14 replays, a v14 Cleric's Heal, v1 slots for an open v14 fight):
    make the generation explicit (`engine: 14`) and keep them;
  - about **the live game** (five classes, "Accessory 1/2", two Orbs, the v1 presets and support values, H51's always-on
    checks with the v1 guidance): move them to v2, or delete them where an H53–H60 v2 test already covers the same thing.
  List both kinds in the delivery.
- **The v1 branches stay.** Engine v14 needs its rules to replay; the non-engine v1 tables (presets, support values, the
  projection) are small and document the old game. No cleanup packet.
- **The migration runs as `toV25` was tested.** An open world-map or Rift fight at migration replays and settles on v14
  (a one-half Summoner, a Cleric's Heal); the next fight is v15. A party left with two Clerics shows "One healer a party"
  until one of them changes to a damage class (a Paladin is a healer too, D178; H59 found the packet's earlier wording
  wrong).
- **The manual says what the game now plays,** in the manual's short style, with the live blocks regenerated. Engine
  v14's behaviour stays only where an old fight still uses it ("Fights from v6–v14 replay with …", as the `limits` block
  does for v6–v9).
- **`battleConstants`** gains v15's rows (`BATTLE_COVER_CAP_V15`, `RPG_SUPPORT_SHARE_V15`, `BATTLE_HEAL_OFFENSE_SCALE`,
  `BATTLE_REGEN_SHARE`, `BATTLE_REGEN_ROUNDS`, `BATTLE_FAREWELL_FACTOR`) with "v15:" meanings; `classes` drops the Heal
  lean and prints each half's power ("×0.63 Arms, ×0.27 Tome").
- **Versions:** the handoff README's Versions line names uma-art 2.12.0 (H59 pinned it).

## Do

1. **The switch:** the three lines above, and the comments that name the current versions (`save.ts`' header and
   `parseSave`'s doc: "v24 → v25 (D…): the Paladin from the Cleric, the Bastion's seats, typed accessories";
   `engine.ts`' header; `types.ts`' header).
2. **Run everything:** `pnpm lint && pnpm test && pnpm build`. Fix what the flip breaks as decided. Both v14 replay tests
   pass; so do H60's v15 always-on checks.
3. **Docs:**
   - rewrite the manual pages listed in Context; `docs/render.ts`' `classes` and `battleConstants` as decided; run
     `pnpm docs:update` and read every regenerated block (`classes`, `weapons`, `presets`, `skill-trees`, `limits`,
     `heroes`, `gear`, `places`, `rift-fronts`, `rift-rules`) against the code;
   - classes-v2.md: the status line "Built and live (H53–H61, D…)"; §8 "Live from H61 (D…)";
   - rift.md §5: the party column reads as classes v2's guidance, live; tiers.md §6's Accessories row: "Two slots, one
     Damage (a flat Orb) and one Support ([classes v2](classes-v2.md) §6)";
   - architecture.md and technical/architecture.md: engine v15, save v25, and a v25 bullet in the save history;
   - `docs/handoff/README.md`: the Versions line, and the "Left for later" bullet on Iron's wrong party points at H60's
     result;
   - log the D-decision (fetch `main` first).
4. **Validate locally** (the API on your port with its local save; the web at 390×844 and 375×667, light and dark, in a
   desktop browser, never the iOS Simulator), on a scratch **v24** save from the CJS build before the flip, holding: a
   Cleric with four Arms who is the Hero of Chapel seat 3 with two Learners; a party of two Clerics; an Uma wearing two
   Orbs and one wearing an Amulet in accessory 1 and an Orb in accessory 2; an open world-map fight mid-round with a
   Summoner and that Cleric; an open Rift front fight. Then, on the flipped build:
   - the API parses it and stores v25 (`apps/api/.data/save.json`: `schemaVersion` 25, the Paladin entries, seats
     `paladin-1` with its Learners, typed accessories, the open fights' inputs still `version: 14`);
   - the open world-map fight continues to its end with a one-half Summoner and settles; the next fight starts as
     `version: 15`;
   - the Learning page's six halls, the Bastion's page, the Chapel's new seats; the Stable's Paladin; Gear's Damage and
     Support; the Party Hall's note on the two-Cleric party, fixed by switching one to Paladin; a v15 fight with the
     Summoner's pair and farewell, a Spell Blade's extra hit and a Cleric's Regen; the Rift's guidance with a Paladin;
   - unlock a Late Uma whose Power beats her Wit: she starts as a Paladin in physical armor.
   Describe what you saw; screenshots with original art stay local.
5. **Deploy and watch** (`gh run watch <id> -R luismlorenzana/uma-rpg --exit-status`); https://uma-rpg.web.app/api/health
   shows the commit. Tell the owner: on the phone's first sync the save becomes v25 and the v24 copy is kept in
   `saveBackups/{uid}-v24`; the screens that touch the edges are the Learning page and the Gear tab (P60, phone check).

## Done when

- [ ] `BATTLE_ENGINE_VERSION` is 15, `SAVE_SCHEMA_VERSION` 25 and `migrateWorld` chains `toV25`, all in one commit.
- [ ] `pnpm lint && pnpm test && pnpm build` pass; both v14 replay tests pass; the main JS is under 230 KB gzip (say
  the number and the change since H53).
- [ ] The manual describes classes v2 as played; `pnpm docs:update` leaves no diff; classes-v2, rift.md and tiers.md
  read right; the D-decision is logged.
- [ ] The local validation in step 4 was done at both widths and both appearances, and described. Nothing from the
  original games in git.
- [ ] Deployed green and https://uma-rpg.web.app/api/health shows the commit.

## Deliver

- **Claude, as a delegated worker:** a pull request from `feat/h61-classes-v2-live` with one commit,
  `feat: classes v2 live, engine v15 and save v25 (H61)`; the body says what flipped, the tests moved or made explicit,
  and the local validation. Fetch `main` before you push. The main session reviews and merges it, then watches the
  deploy; this is the one deploy that changes the owner's save, so it's watched to the end and health is checked.
- **Flag it done:** after the merge, a `docs(handoff): H61 done, classes v2 is live (D…)` commit deletes this file, sets
  H61 to Done with a Done row, and replaces the "Classes v2 build" status with one line, as "The Rift is built and live"
  does.

## Notes from H59 (main session, 2026-10-22)

- Two existing tests pin the live game and must be updated in the switch commit: `hub/places.test.ts` (23 places,
  `[4, 6, 2, 11]`, the Rift as the only `frame`) and `battle/pixel-icons.test.tsx` (five emblems). Every H59 test passes
  with the switch on.
- H59's Done row in `docs/handoff/README.md` lists the screens whose words go into `sections.md`.
- The Rift's guidance shows the five-class parties until H60's generation-aware `RIFT_FRONT_SPECS` lands; with it, the
  page names the Paladin with no further work. Check it after the flip.

## Notes from H60 (2026-10-22, D186)

- H60's numbers are all v15 values, so the flip carries them: the hybrids' hands, the farewell ×0.85, the Paladin's and
  the Cleric's support numbers, v2's supports, and the Rift's v15 override (`riftTuning(15)`, `RIFT_TUNING_V15`).
  `RIFT_FRONT_SPECS` turns to v2's guidance by itself (`riftParty`).
- `docs/render.ts`'s Rift block (`riftFronts`, 518–553) reads `RIFT_TUNING` for its offense line, Arcane's scale and
  the Echo numbers while `riftShape` follows the live engine: read `riftTuning()` there at the switch and name the
  champion scales (`champions`) and the Duel's and Horde's numbers, so `rift-fronts` says what v15 plays.
- With the switch on, `rift/balance.test.ts`, `rift/balance-v15.test.ts` and `world/balance.test.ts` pass as they are
  (their defaults become v15). `rift/generate.test.ts` pins `version` 14 (lines 27–29) and `RIFT_TUNING.convergence`
  (138): read the live version and `riftTuning()`.
- classes-v2.md §9 and rift.md §11 carry H60's measured columns; the manual's Rift and combat pages take those numbers.
