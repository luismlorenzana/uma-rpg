# H72 — R1's switch: Tier 1's fight goes live (engine v16, save v27), and the manual rewritten

**uma-rpg · Claude · M · Needs: H69, H70, H71 (and through them H64–H68) · Unblocks: R2's H82 (closes R1)**

## Why

H64–H71 built R1, Tier 1's fight, dark: three weapons a class by channel, trees with a trunk and one free fork and Skill
Ranks, Pierce, twin weaknesses and Tier 1's shields, the calling and its pick, the template's name and Flourish, the base
MP regen, save v27's migration, the screens and the balance, every rule behind `rpgRework('fight')` with v6–v15 replays
pinned. This packet **flips it in one commit**: new fights start on engine v16, saves become v27 (three weapons, branch
picks, the calling pick), the screens show R1, and the manual describes the game as it now plays. It ends with a release
the owner checks on the phone ([implementation.md](../../design/tier-rework/implementation.md) §5).

## Context (read first)

- `CLAUDE.md`, `AGENTS.md`, [implementation.md](../../design/tier-rework/implementation.md) (with its "Built" lines), and
  the D-rows of H64–H71 (the R1 build decisions are H64's first row). Each of those packets' Done rows in
  `docs/handoff/README.md` says what it built and what it left for this packet (H70 lists the screens whose words go into
  `sections.md`; H71 the measured numbers).
- `git show 5dd9f08:docs/handoff/tasks/H61-classes-v2-switch.md` and H61's Done row: the switch this one mirrors.
- **The switch** (the local switch H70 and H71 used):
  1. `packages/domain/src/rpg/battle/caps.ts`: `BATTLE_ENGINE_VERSION = 16`;
  2. `packages/domain/src/save/save.ts`: `SAVE_SCHEMA_VERSION = 27`;
  3. `packages/domain/src/save/migrations.ts`: chain `toV27` after `toV26` (`version < 27`).
- **The replays:** `rpg/battle/v14-replays*` and `v15-replays*` (H64): the mocked-16 twin becomes the live case.
- **The dark shapes to tighten** (H69): `ClassLoadout`'s optional `tree` and `lines`, `OwnedUma.calling?`, and the
  parse's two branches by the live generation.
- **The manual pages to rewrite:** [classes.md](../../game/classes.md) (the `classes`, `weapons`, `presets`, `depths`,
  `active-slots` and `limits` blocks; "Starts as" at line 66; the weapons and armor text around 103–108; the Class Rank
  row at 184), [combat.md](../../game/combat.md) (the header at 3; a weak hit at 98; "Weaknesses, shields and Breaks"
  167–186; Hex 196; 208; mixed locks 253; the Rift's fronts 341–348; the `limits`, `foe-scaling`, `rift-fronts` and
  `battle-constants` blocks), [skill-trees.md](../../game/skill-trees.md) (the whole page and its `skill-trees` block),
  [heroes.md](../../game/heroes.md) (the `heroes` block, line 41), [sections.md](../../game/sections.md) (§ Stable, the
  Uma sheet, the fight screen, the Rift, the Halls), [loops.md](../../game/loops.md) (the `ranks` block at 65; "five
  weapons" at 98, 193 and 328), [maps.md](../../game/maps.md) (the `biomes` block: "Signatures (weak to)"),
  [architecture.md](../../game/architecture.md) (43, 123) and `docs/technical/architecture.md` (3, 69, the save history).
- **The live blocks' renderers** (`packages/domain/src/docs/render.ts`): `STARTS_AS` 84–88, `classes` 118–126,
  `presets` 129–134, `depths` 149–153, `skillTrees` 155–174, `limits` 176–193, `heroes` 196–216, `battleConstants` 218,
  `foeScaling` 308–326 (its shields line 322), `ranks` 377–391, `biomes` 448, `riftFronts` 566, `'active-slots'` 653. Most
  read the live generation and move by themselves; `STARTS_AS`, `depths`, `skillTrees`, `'active-slots'`, `ranks` and
  `biomes` print v15's words.
- **Production:** [infrastructure.md](../../technical/infrastructure.md); the API copies a stored save to
  `saveBackups/{uid}-v{n}` before a newer version replaces it (D69; `apps/api/src/save/firestore-save.repository.ts` 32,
  proven by `firestore-save.repository.test.ts` since H61) and refuses a client save older than the stored one (D45), so an
  old PWA asks to update. The owner's phone check: [phone-check.md](../../testing/phone-check.md).

## Decisions made

- **One commit flips all three lines** and carries every test, type and doc change the flip needs. Nothing else changes
  behaviour: if a rule needs fixing, it's a bug in H64–H71's work, fixed here with a test and named in the delivery.
- **The dark shapes are tightened in the same commit:** `ClassLoadout` is `{ weapons, lines, loadout }` (`tree` gone,
  `lines` required), `OwnedUma.calling` is required, and the parse keeps only v27's branch (a v26 save always reaches it
  through `toV27`). The save's header comment and `parseSave`'s doc gain "v26 → v27 (D…): three weapons, branch picks, the
  calling pick".
- **Tests that pinned today as "the live game"** fall in two kinds:
  - about **old fights or v15 rules that still matter** (the v14 and v15 replays, v15's five weapons and side skills in an
    open v15 fight, v15's Limit Breaks): make the generation explicit (`engine: 15`) and keep them; the mocked-16 replay
    twin merges into the live replay tests (as H61 did);
  - about **the live game** (five slots, sides and points, today's weaknesses and shields, 2–5 icons, the style start):
    move them to v16, or delete them where an H64–H71 test already covers the same thing. `world/tier1-foes.test.ts`'s
    digest **moves on purpose** (twins and shields; CP §14), and the D-row says so.
  List both kinds in the delivery.
- **What retires with the flip:** `STYLE_CLASSES`, `DISTANCE_GEAR`, `learningTime` and the Racing tab's old rows
  (uma-templates §9); `render.ts`'s `STARTS_AS` (the classes block prints the calling's rows); the save-level `learnSkill`
  and `forgetSkill` and the web's `learn`/`unlearn` (no tree can hold a side any more). **The v15 branches in the rules
  and the engine stay:** v6–v15 fights replay on them (H61's rule: no cleanup packet).
- **The migration runs as `toV27` was tested.** An open world-map or Rift fight at migration replays and settles on v15
  (five weapons, today's weaknesses); the next fight is v16. Every owned Uma's calling is unconfirmed on her pre-selection,
  with a dot on her template chip, until a tap or her first win.
- **The manual says what the game now plays,** in its short style, with the live blocks regenerated:
  - `classes`: three slots by channel, the calling's rows for "Starts as" (CP §2.1's last column), the Summoner's v16 hand;
  - `depths` and `'active-slots'`: no side skills or points; Skill Ranks (×0.95 → ×1.05, a rank every 2 Class Ranks);
    equipped 3 → 7;
  - `skillTrees`: each tree's eight nodes, the trunk, branch A and branch B (with its line's name), MP and what it does;
    no cost column;
  - `limits` and `heroes`: Rampart Charge's Axe, Choir of Angels' Lightning; "Fights from v15 replay with Rampart Charge's
    Greatsword and Choir of Angels' Light twice"; Limit Breaks don't rank;
  - `battleConstants`: rows for `RPG_BASE_MP_REGEN` (and its five-depth cap), `BATTLE_FLOURISH_SHARE`,
    `BATTLE_FLOURISH_RATE`, `BATTLE_FLOURISH_FROM` and `RPG_SKILL_RANK_FACTOR`, each "v16:";
  - `foeScaling`, `biomes`, `riftFronts`: Tier 1's shields, each signature's twins, the fronts' twins and guided builds;
  - `ranks`: Class Rank opens depths and ranks every skill; Weapon Rank E a weapon over her three;
  - combat.md's weakness section rewritten to the one rule (twins; Twilight), the base MP regen and its stack with a
    Spring, the Flourish; classes.md's calling and template; sections.md H70's screens.
  v15's behaviour stays only where an old fight still uses it ("Fights from v6–v15 replay with …").
- **Design docs that name the state:** implementation.md's R1 row "Built and live (H64–H72, D…)"; README §6's status
  (R1 live); class-progression and uma-templates gain one status line each ("R1 live from H72, D…"), logged as follow-ups.
- **Versions:** the handoff README's Versions line names the engine and save; nothing new is pinned (R1 has no art).

## Do

1. **The switch:** the three lines above; the type tightening; the comments that name the current versions (`save.ts`'
   header and `parseSave`'s doc; `migrations.ts`; `engine.ts`' and `types.ts`' headers; `caps.ts`).
2. **Run everything:** `pnpm lint && pnpm test && pnpm build`. Fix what the flip breaks as decided. Both replay fixtures
   pass live; so do H71's v16 always-on checks.
3. **Retire** what is listed above.
4. **Docs:** rewrite the manual pages listed in Context; `render.ts` as decided; run `pnpm docs:update` and read every
   regenerated block against the code (`classes`, `weapons`, `presets`, `depths`, `active-slots`, `skill-trees`, `limits`,
   `heroes`, `battle-constants`, `foe-scaling`, `ranks`, `biomes`, `rift-fronts`, `rift-rules`); architecture.md and
   technical/architecture.md (engine v16, save v27, a v27 bullet in the save history); the design docs' status lines; the
   handoff README's Versions line; the D-row (fetch `main` first).
5. **The API's backup:** extend `apps/api/src/save/firestore-save.repository.test.ts` with the v26 → v27 case: the first
   v27 write copies the stored v26 to `saveBackups/{uid}-v26`, none on the next, and an old app's v26 write is refused once
   v27 is stored.
6. **Validate locally** (the API on your port with its local save; the web at 390×844 and 375×667, light and dark, in a
   desktop browser, never the iOS Simulator), on a scratch **v26** save from the CJS build before the flip, holding: a
   Brawler with side skills on her Lance and Greatsword trees and a loadout with sides; a Paladin with `paladin-lance.4b`
   and `paladin-tome-light.3b` learned; a Cleric; a Pace Uma with Power over Wit; an open world-map fight mid-round; an
   open Rift front fight; a full party. Then, on the flipped build:
   - the API parses it and stores v27 (`apps/api/.data/save.json`: `schemaVersion` 27, three weapons a class, `lines`
     where the sides were, `calling` on every Uma, the open fights' inputs still `version: 15`);
   - the open world-map fight continues to its end on v15 and settles; the next fight starts as `version: 16`: twin
     weaknesses ("Weak:" with two icons), an elite's shield 5 and a boss's 6, an `mp` cue with the base regen, and for an
     Uma fighting as her calling her Flourish (★) in the log;
   - the Skills tab's tree (a branch swap moving an equipped skill, pips and "next at"), the Gear tab's three weapons, the
     template chip and card, the calling card on the Pace Uma (pick, confirm; or a win confirms it), the Battle tab's
     "MP · +n a round" and ★ row, a won fight's rank-up line, the Stable's Template filters and search, the Racing tab's
     "Her template", the Rift's guided weapons, a Hall seat's twin sets, Valkyrie's Oath on the Paladin's Light tree;
   - unlock a new Uma whose calling differs from her style's class (a Wit-led closer, or a Pace sprinter with Power): she
     starts in her calling, in its armor.
   Describe what you saw; screenshots with original art stay local.
7. **Deploy and watch** (`gh run watch <id> -R luismlorenzana/uma-rpg --exit-status`); https://uma-rpg.web.app/api/health
   shows the commit. Tell the owner: on the phone's first sync the save becomes v27 and the v26 copy is kept in
   `saveBackups/{uid}-v26`; every Uma's calling waits on her pre-selection until he confirms it or she wins; the screens
   that touch the edges are the Skills tab's tree (two columns at 375 pt), the calling card and the Stable's filters
   (phone check).

## Done when

- [ ] `BATTLE_ENGINE_VERSION` is 16, `SAVE_SCHEMA_VERSION` 27 and `migrateWorld` chains `toV27`, all in one commit, with
  the dark shapes tightened.
- [ ] `pnpm lint && pnpm test && pnpm build` pass; both replay fixtures pass; the main JS is under 230 KB gzip (say the
  number and the change since H64).
- [ ] The manual describes R1 as played; `pnpm docs:update` leaves no diff; implementation.md, README §6 and the two design
  docs read right; the D-row is logged (with the Tier 1 foe digest's move).
- [ ] The API's backup test covers v26 → v27.
- [ ] The local validation in step 6 was done at both widths and both appearances, and described. Nothing from the
  original games in git.
- [ ] Deployed green and https://uma-rpg.web.app/api/health shows the commit.

## Deliver

- **Claude, as a delegated worker:** a pull request from `feat/h72-r1-live` with one commit,
  `feat: R1 live, Tier 1's fight on engine v16 and save v27 (H72)`; the body says what flipped, the tests moved or made
  explicit, what retired, and the local validation. Fetch `main` before you push. The main session reviews and merges
  it, then watches the deploy; this deploy changes the owner's save, so it's watched to the end and health is checked.
- **Flag it done:** after the merge, a `docs(handoff): H72 done, R1 is live (D…)` commit deletes this file, sets H72 to
  Done with a Done row, replaces R1's build status with one line ("R1 is built and live"), and sets R2's H82 to Ready when
  its other needs are done.
