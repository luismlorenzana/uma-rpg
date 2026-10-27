# H90 — Release 3's switch: Tier 2's weapons go live (engine v18, save v29), and the manual rewritten

**uma-rpg · Claude · M · Needs: H87, H88, H89 (and through them H83–H86) · Unblocks: H91 (Release 4)**

> **Versions re-planned by D221 and D224 (2026-10-26):** saves v29 (the owner's "grant is tickets only" step) and v30 (the
> farm by line, H112) are taken and live. Read this packet's save v29 as **v31**, v30 as **v32** and v31 as **v33**;
> engines unchanged. Materials, recipes and the Workbench are the farm by line's
> ([farm-by-line.md](../../design/tier-rework/farm-by-line.md)): re-read them before any step that names R2's pairs, the
> ladder or a cross-line recipe.

## Why

H83–H89 built Release 3 dark: weapon branches and the Branch Gem, the second accessory slot and its forms, the kind
cap, the weapon moon, the secondary profession, save v29's migration, the screens and the balance, every rule behind the
`t2Weapons` stage with v6–v17 replays pinned. This packet **flips it in one commit**: new fights start on engine v18,
saves become v29 (a branch per weapon kind, a second accessory slot in Tier 2+ worlds, G5 Weapon Gems there become
Branch Gems), the screens show it, and the manual describes the game as it now plays. It ends with a release the owner
checks on the phone.

## Context (read first)

Code pointers are by file and function: Releases 1 and 2 move the lines. Re-read the code before starting.

- `CLAUDE.md`, `AGENTS.md`; [implementation.md](../../design/tier-rework/implementation.md) (D198) §1, §2, §5; the
  D-rows of H83–H89 (**H83's first row is Release 3's build decisions**). Each of those packets' Done rows in
  `docs/handoff/README.md` says what it built and what it left for this packet (**H88 lists the screens and their words
  for `sections.md`; H89 the measured numbers**).
- How the last switches were done: `git show 5dd9f08:docs/handoff/tasks/H61-classes-v2-switch.md`, D188, and Release
  1's and 2's switches (H72, H82: their packets and D-rows).
- **The switch** (the local switch H88 and H89 used):
  1. `packages/domain/src/rpg/battle/caps.ts`: `BATTLE_ENGINE_VERSION = 18`;
  2. `packages/domain/src/save/save.ts`: `SAVE_SCHEMA_VERSION = 29`;
  3. `packages/domain/src/save/migrations.ts`: chain `toV29` after `toV28` (`version < 29`), with the world's tier.
- **The replays:** `rpg/battle/v17-replays.fixture.json` and its two tests (H83): the mocked one becomes the real one.
  Every earlier fixture stays green.
- **The manual pages to rewrite** (`docs/game/`, as Release 2 left them): `classes.md` (weapons: branches, partners,
  the cap; the standard preset by tier), `combat.md` (damage: the weak multiplier per weapon, a Dual's partner in
  weaknesses and locks, the accessory forms, the Toll Bell, Onslaught, the kind cap, the weapon moon; the
  `battle-constants` block), `loops.md` (Extra Stats and gear by tier, the weapon moon, promotion carrying branches, the
  secondary), `materials.md` (the Branch Gem, the Forge's G5 from Tier 2, two Accessory Settings a tier, the secondary's
  base work), `sections.md` (H88's screens), `architecture.md` (engine v18, save v29, the save history) and
  `docs/technical/architecture.md`.
- **The live blocks' renderers:** `packages/domain/src/docs/render.ts` (by the names Release 2 left: `weapons`, `gear`,
  `presets`, `battle-constants`, the Extra Stats block, the places and facilities blocks, `rift-fronts`,
  `foe-scaling`, `tiers`). Most read the live stage and move by themselves; check each.
- **Production:** [infrastructure.md](../../technical/infrastructure.md); the API copies a stored save to
  `saveBackups/{uid}-v{n}` before a newer version replaces it (D69; `apps/api/src/save/firestore-save.repository.ts`)
  and refuses a client save older than the stored one (D45), so an old PWA asks to update. The owner's phone check:
  [phone-check.md](../../testing/phone-check.md).

## Decisions made

- **One commit flips all three lines** and carries every test and doc change the flip needs. Nothing else changes
  behaviour: if a rule needs fixing, it's a bug in H83–H89's work, fixed here with a test and named in the delivery.
- **Tests that pinned the live game** fall in two kinds (list both in the delivery):
  - about **old fights or v17 rules that still matter** (v17 replays, a Tier 2 weapon's G5 as a Weapon Gem in an old
    fight's world, Release 2's one-slot Tier 2 for an open v17 fight): make the generation explicit (`engine: 17`) and
    keep them;
  - about **the live game** (one accessory slot in Tier 2, `weapon-gem-g5` made in Tier 2, the Observatory's 20 nodes in
    Tier 2, Release 2's Tier 2 presets, Ascend without branches): move them to v18, or delete them where an H83–H89
    test already covers the same thing. The switch-mocked files lose their mock; mocked twins merge into one.
- **The v17 rules stay.** Engine v17 needs them to replay; the non-engine tables are small and document the old game.
  No cleanup packet.
- **The migration runs as `toV29` was tested.** An open v17 fight at migration replays and settles on v17; the next
  fight is v18. Tier 2+ worlds' G5 Weapon Gems and G5 jobs become Branch Gems, each weapon at G5+ brings one, and every
  Uma there has a second slot (a Pendant, or an Insignia beside a Pendant).
- **The manual says what the game now plays**, in its short style, with the live blocks regenerated: Tier 2's weapons,
  accessories, weapon moon and secondary; **Tier 3 worlds play Tier 2's shape** (Pure or Dual, two slots, one weapon
  moon, the secondary's base work) until Release 5, said in one line; Tier 2's weaknesses are still the twins (Release
  4 narrows them), with Tier 2's shields and R3's term as H89 set them. Engine v17's behaviour stays only where an old
  fight still uses it ("Fights from v17 and before replay with one weak multiplier").
- **`battle-constants`** gains v18's rows: the weak multiplier by branch (base 1.3, Pure 1.5, Dual 1.3), the two-kind
  cap by tier, the kind cap (68 · 122 · 177), the Toll Bell's ring and Onslaught's first act, the weapon moon's node
  values; **`weapons`** prints the partner table and each branch's name; **`gear`** the accessory forms and their values
  by grade and tier; **`presets`** Tier 2's (branch 1); the Extra Stats block the weapon moon (Full and Split, by tier);
  the places block the secondary's rule; `foe-scaling` R3's term and Tier 2's shields; `rift-fronts` the Tier 2 tuning.
- **Design docs** name the state: implementation.md's R3 row "Live (H83–H90, D…)"; weapon-progression, extra-stats-
  progression and profession-progression "Live from H90 (D…)" where H83–H89 wrote "Built in"; README §9.2 a note that
  R3's rows are engine v18, live.
- **Versions:** the handoff README's Versions line names the uma-kit, uma-art and uma-data versions this release runs on
  (unchanged by R3 unless H88 pinned one).

## Do

1. **The switch:** the three lines above, and the comments that name the current versions (`save.ts`' header and
   `parseSave`'s doc: "v28 → v29 (D…): a branch per weapon kind, a second accessory slot in Tier 2+, Branch Gems, the
   weapon moon, the secondary"; `engine.ts`' header; `types.ts`' header; `caps.ts`).
2. **Run everything:** `pnpm lint && pnpm test && pnpm build`. Fix what the flip breaks as decided. Every replay test
   passes; so do H89's v18 always-on checks.
3. **Docs:**
   - rewrite the manual pages listed in Context; `docs/render.ts` as decided; run `pnpm docs:update` and read every
     regenerated block against the code;
   - the design docs' lines and implementation.md's row; architecture.md and technical/architecture.md: engine v18, save
     v29, a v29 bullet in the save history;
   - `docs/handoff/README.md`: replace the "Release 3" build status with one line ("Release 3 is built and live (H83–H90,
     D…)"), the Versions line;
   - log the D-decision (fetch `main` first).
4. **Validate locally** (the API on your port with its local save; the web at 390×844 and 375×667, light and dark, in a
   desktop browser, never the iOS Simulator) on a scratch **v28** save from the CJS build before the flip, holding: a
   Tier 1 world; a Tier 2 world with an Uma whose Lance is at G7 (no branch) and Bow at G4, three stocked
   `weapon-gem-g5`, a started and a queued Forge entry for `weapon-gem-g5`, an Uma with her accessory slot at G6 and a
   Moon Jewel I in stock at Lv 30, a Mage among few Mages, an open v17 world-map fight mid-round and an open Rift fight.
   Then, on the flipped build:
   - the API parses it and stores v29 (`apps/api/.data/save.json`: `schemaVersion` 29; the Warehouse's Branch Gems,
     three plus one for the G7 Lance; both Forge entries make `branch-gem`; two accessory slots in Tier 2, one in Tier 1;
     the open fights' inputs still `version: 17`);
   - the open world-map fight continues to its end and settles; the next fight starts as `version: 18`;
   - the Gear tab: "Pick a branch" on the Lance (Dual + Katana), the Bow's G5 step with a Branch Gem (Pure), a blocked
     Dual with its reason, a re-forge; the second slot with a Great Orb and "(capped)" where it binds; the Observatory's
     weapon moon, its chip set to Full, a Moon Jewel set on it; the Battle tab's moon line; the Work tab's secondary
     picked free and changed for 2,000 Laurels; a place page's three groups and "Her main trade's work"; the planner's
     Branch Gems and moon jewels; "Can upgrade" dots; a v18 Tier 2 fight on Auto with a Dual's partner chipping a
     shield and a Toll Bell's pips;
   - on a second scratch save with a Tier 2 run ready to Ascend (as H50 checked), Ascend carries her branches to Tier 3
     at G0, two base-form slots, no secondary.
   Describe what you saw; screenshots with original art stay local.
5. **Deploy and watch** (`gh run watch <id> -R luismlorenzana/uma-rpg --exit-status`); https://uma-rpg.web.app/api/health
   shows the commit. Tell the owner: on the phone's first sync the save becomes v29 and the v28 copy is kept in
   `saveBackups/{uid}-v28`; the screens that touch the edges are the Gear tab, the Observatory, the Work tab and the place
   pages (the phone check, P60).

## Done when

- [ ] `BATTLE_ENGINE_VERSION` is 18, `SAVE_SCHEMA_VERSION` 29 and `migrateWorld` chains `toV29`, all in one commit.
- [ ] `pnpm lint && pnpm test && pnpm build` pass; every replay test passes; the main JS is under 230 KB gzip (say the
  number and the change since H83).
- [ ] The manual describes Release 3 as played; `pnpm docs:update` leaves no diff; the design docs and the handoff index
  read right; the D-decision is logged.
- [ ] The local validation in step 4 was done at both widths and both appearances, on a scratch save, and described.
  Nothing from the original games in git.
- [ ] Deployed green and https://uma-rpg.web.app/api/health shows the commit.

## Deliver

- **Claude, as a delegated worker:** a pull request from `feat/h90-r3-live` with one commit,
  `feat: Tier 2's weapons live, engine v18 and save v29 (H90)`; the body says what flipped, the tests moved or made
  explicit, and the local validation. Fetch `main` before you push. The main session reviews and merges it, then
  watches the deploy; this deploy changes the owner's save, so it's watched to the end and health is checked.
- **Flag it done:** after the merge, a `docs(handoff): H90 done, Release 3 is live (D…)` commit deletes this file, sets
  H90 to Done with a Done row, and sets H91 to Ready.
