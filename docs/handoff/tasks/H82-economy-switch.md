# H82 — R2's switch: engine v17 and save v28 go live, uma-art pinned, the first launch checked on a full-shaped save, the manual rewritten

**uma-rpg · Claude · M · Needs: R1's H72, H78, H79, H80, H81 (and through them H73–H77) · Unblocks: R3's H83 and H86**

## Why

H73–H81 built R2, Tier 1's economy, dark: engine v17 (the four accessory families, the signature, gear and Extra Stats as
data) and save v28 (grades, the new map, the ten places, the made items, the compensation), every rule behind
`rpgRework('economy')`, with older fights replaying exactly. This packet **flips it in one commit**: new fights start on
v17, saves become v28, the Wilds become ten places, and the manual describes the game as it now plays.

**This is the one irreversible moment of the rework** (implementation.md §5): v28 resets every Craft Level to 1 and pays
the Speed Ticket grant. So before the flip ships, you run the migration on a scratch copy of a full-shaped save and put
the first launch's numbers in the pull request.

## Context (read first)

- `CLAUDE.md`, `AGENTS.md`, [implementation.md](../../design/tier-rework/implementation.md) §2 and §5; **R2's build
  decisions** and the D-rows of H74–H81; their Done rows in `docs/handoff/README.md` (H79's and H80's list the screens'
  words for the manual; H81's the measured numbers).
- **How a switch landed before:** `git show 5dd9f08:docs/handoff/tasks/H61-classes-v2-switch.md` and H61's Done row
  (D188); R1's [H72](H72-r1-switch.md) packet and Done row (the switch this one follows).
- **The switch** (the local switch H79–H81 used):
  1. `packages/domain/src/rpg/battle/caps.ts`: `BATTLE_ENGINE_VERSION = 17` (16 since H72);
  2. `packages/domain/src/save/save.ts`: `SAVE_SCHEMA_VERSION = 28` (27 since H72);
  3. `packages/domain/src/save/migrations.ts`: `migrateWorld` chains `toV28` after `toV27` (`version < 28`, with the
     world's `tier`, H78).
- **The replays:** `rpg/battle/v14-replays*` (H53), H64's `v15-replays*`, H74's `replays-live17.test.ts`. No v16 fixture
  exists yet: R2's build decision 3 gives it to you, frozen before you flip.
- **The manual to rewrite:** [materials.md](../../game/materials.md) (all: today's eight families, Star Gems and gear),
  [loops.md](../../game/loops.md) (§ Ranks, § Currencies, § Craft Level, § Extra Stats and gear), [sections.md](../../game/sections.md)
  (§ Wilds, § Facilities, § Stable's Gear tab, § Warehouse, § Exchange, § Observatory, § Account),
  [combat.md](../../game/combat.md) (§ Damage and § Where damage comes from, § Support, § Constants),
  [classes.md](../../game/classes.md) (§ Weapons: accessory slots and presets; § Ranks and levels),
  [architecture.md](../../game/architecture.md) (the engine and save lines, the domain map, the save's history) and
  `docs/technical/architecture.md`.
- **The live blocks** (`packages/domain/src/docs/render.ts`): `families` 328, `items` 331, `gems` 341, `gear` 345, `ranks`
  377, `prices` 405, `jobs` 413, `places` 429, `facilities` 437, `presets` 128, `damage-sources` 272, `foe-scaling` 308,
  `battle-constants` 218, and `active-slots` (lines on `421eacd`; R1's H72 moved some). They read the live generation, so
  most move by themselves; some still print v1's words.
- **Production:** [infrastructure.md](../../technical/infrastructure.md); `apps/api/src/save/firestore-save.repository.ts`
  23–38: **the first write of a newer save version copies the stored document to `saveBackups/{uid}-v{stored}`**, so the
  owner's first v28 write keeps `saveBackups/{uid}-v27` (D69); a client save older than the stored one is refused (D45),
  so an old PWA asks to update. The owner's phone check: [phone-check.md](../../testing/phone-check.md).

## Decisions made

- **One commit flips all three lines** and carries every test and doc change the flip needs. Nothing else changes
  behaviour: a rule that needs fixing is a bug in H74–H81's work, fixed here with a test and named in the delivery.
- **The v16 fixture first** (R2's build decision 3): before changing a line, freeze `rpg/battle/v16-replays.fixture.json`
  (with `v16-replays.fixture.ts`, `UPDATE_V16=1`, cues digested without labels, H64's pattern) from live v16 fights: one
  world stage per Tier 1 continent with R1's on-curve party on today's gear (a Spring Amulet and a Talisman worn, so the
  supports run), a Rift Duel stage and a Rift Iron stage. `v16-replays.test.ts` replays it live; with the flip, the v14,
  v15 and v16 fixtures all replay under 17 (H74's mocked test becomes the real one).
- **Tests that pinned today as "the live game"** fall in two kinds, as H61 sorted them:
  - about **old fights or v1 rules that still matter** (v16's supports in a replay, a v27 save's parse before its
    migration, the legacy catalogs the chain reads): make the generation explicit (`engine: 16`, a v27 fixture) and keep
    them;
  - about **the live game** (eleven facilities, crafted pieces, Star Gems, gear ranks, "Accessory 1/2"): move them to v3,
    or delete them where an H74–H81 test already covers the same thing.
  List both kinds in the delivery.
- **The v1 branches stay** (H61's precedent): engine v16 and older replay with their rules; the legacy catalogs run the
  migration chain; the v1 economy's save rules document the old game. No cleanup packet.
- **uma-art:** the release H73 made (2.13.0, or the version it reported) is pinned by H79 or H80; check it, and the
  handoff README's Versions line names it.
- **The scratch migration before the flip ships** (implementation §5):
  - Build, from the CJS build of the flipped domain, a **full-shaped v27 save**: Tier 1 the fully built roster of
    profession-progression §14.5 (H78's `fullRoster()`: forty Craft Lv 50 Umas, ten with 30,000 EXP banked; 25 with 120
    bound pieces and 100 open Star Gem nodes; 2,400 pieces in stock; eleven facilities at level 3; about 2,000 items in
    stock; a running job and a queued one; an open world-map fight and an open Rift fight), and a Tier 2 world of twenty at
    Craft Lv 31 with six facilities at level 2.
  - Run the flipped API locally on a copy, let the web load it, and record **the first launch's sheet for each world**:
    the grant (expected **63,800** Speed Tickets for Tier 1, **16,580** for Tier 2), its hours, what went, what came back
    (**7,150** Laurels and **66** refined items; 900 and 12), the stock converted, every Uma's line, the floor's line if it
    paid. **The pull request's body carries these numbers** and says whether each matched H78's tests.
  - Check on the migrated copy: every Uma at Craft Lv 1; every grade G0 and one accessory slot with no family; every map
    empty; Gear Marks added to Class Marks; the Warehouse in the 20 Tier 1 types; places with no levels and no work; the
    open fights still `version` 15 or 16, which finish and settle on their engine; the next fight `version: 17`.
- **The manual says what the game now plays,** in its short style, with the live blocks regenerated: the five lines and
  their pairs by tier, the made items and the ladder, grades and the Lv 5g − 4 gate, armor's values, the four accessory
  families' base forms and the signature, the Planet and three moons with her moon, jewels, the ten places and trades,
  the Exchange by pair, Class Rank only, and the compensation's one-time sheet. Engine v16's and older behaviour stays
  only where an old fight still uses it ("Fights from v6–v16 replay with …"). `render.ts`' blocks print v3's tables
  (`families` the lines; `gems` the jewels; `gear` grades and values by tier; `ranks` Class Rank; `prices` the Exchange
  by pair; `jobs` make time by refined count; `places` the ten; `facilities` "four slots, ×1.25, no upgrades"; `presets`
  WP25's forms; `damage-sources` WP31's stack; `foe-scaling` EP16; `battle-constants` v17's rows: the Bell's 0.1 a grade,
  the Insignia's 1.5% a grade, the signature's 0.2 a level × tier); `active-slots` goes or says "every open node counts".
- **Design docs:** implementation.md's R2 line "Built and live (H73–H82, D…)"; the README's §6 status; the status lines
  of weapon-progression, extra-stats-progression and profession-progression: "Tier 1's economy live in R2 (H82, D…)".

## Do

1. **The v16 fixture** on the live engine (16), before any switch line changes; its live test passes.
2. **The switch:** the three lines; the comments that name the current versions (`save.ts`' header and `parseSave`'s doc:
   "v27 → v28 (D…): gear by grade, the Planet and three moons, ten places and the five lines' items, Craft Levels to 1
   and the Speed Ticket grant"; `engine.ts`' and `types.ts`' headers).
3. **Run everything:** `pnpm lint && pnpm test && pnpm build`. Fix what the flip breaks as decided. The v14, v15 and v16
   replays pass under 17; H81's always-on checks pass.
4. **The API:** a fake-Firestore case in `firestore-save.repository.test.ts`: a stored v27 save and a v28 PUT keep
   `saveBackups/{uid}-v27`; a v27 client's PUT after that is refused (D45).
5. **The scratch migration** as decided; keep its numbers for the pull request.
6. **Docs:** rewrite the manual pages listed in Context and `render.ts`' blocks; run `pnpm docs:update` and read every
   regenerated block against the code; the design docs' status lines; `docs/handoff/README.md`'s Versions line; log the
   D-row (fetch `main` first).
7. **Validate locally** (the API on your port with its local save; the web at 390×844 and 375×667, light and dark, in a
   desktop browser, never the iOS Simulator), on the scratch v27 save: the sheet "The Wilds are rebuilt" once per world
   with the numbers above, Later, the Account's row; the ten places; a gather, a process and a make chained; a Weapon Gem
   raising a weapon at its level; a jewel set on Prowess and on her moon; an accessory form and ★ her signature; a v17
   fight with a Bell and an Insignia on Auto; the open v16 fight finishing on v16; the Exchange by pair; a new account
   starting v28. Describe what you saw; screenshots with original art stay local.
8. **Deploy and watch** (`gh run watch <id> -R luismlorenzana/uma-rpg --exit-status`); https://uma-rpg.web.app/api/health
   shows the commit. Tell the owner: on the phone's first sync the save becomes v28, every Craft Level goes to 1 and the
   grant is paid; the v27 copy is kept in `saveBackups/{uid}-v27`; the screens at the edges are the sheet, the Wilds page
   and the Gear tab (P60, the phone check).

## Done when

- [ ] `BATTLE_ENGINE_VERSION` is 17, `SAVE_SCHEMA_VERSION` 28 and `migrateWorld` chains `toV28`, all in one commit.
- [ ] `pnpm lint && pnpm test && pnpm build` pass; the v14, v15 and v16 replays pass; the main JS is under 230 KB gzip (say
  the number and the change since H74).
- [ ] The scratch migration's first-launch numbers are in the pull request, and each matches H78's tests or is explained.
- [ ] The manual describes R2 as played; `pnpm docs:update` leaves no diff; the design docs' status lines and the D-row are
  logged; the handoff README names the uma-art version.
- [ ] The local validation in step 7 was done at both widths and both appearances, and described. Nothing from the
  original games in git.
- [ ] Deployed green and https://uma-rpg.web.app/api/health shows the commit.

## Deliver

- **Claude, as a delegated worker:** a pull request from `feat/h82-economy-live` with one commit,
  `feat: Tier 1's economy live, engine v17 and save v28 (H82)`; the body says what flipped, the tests moved or made
  explicit, the scratch migration's numbers and the local validation. Fetch `main` before you push. The main session
  reviews and merges it, then watches the deploy to the end and checks health: this deploy changes the owner's save.
- **Flag it done:** after the merge, a `docs(handoff): H82 done, Tier 1's economy is live (D…)` commit deletes this file,
  sets H82 to Done with a Done row, replaces R2's build status in the handoff README with one line ("R2 is built and
  live"), and sets R3's H83 and H86 to Ready.
