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
     weaknesses ("Weak:" with two icons), an elite's shield 6 and a boss's 8 (H71), an `mp` cue with the base regen, and for an
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

## Notes from the build (main session, 2026-10-25)

**From H70 (D206):**
- **Dead code to remove at the flip:** `SkillsPage`'s v6–v15 body (NodeCard, sides, the points line, Learn and Swap
  out); the store's `learn` and `unlearn`; ActiveParty's spare-point code; ClassChip's points pill and `tabDot`'s points
  check; RacingTab's old rows with `STYLE_CLASSES`, `DISTANCE_GEAR` and `learningTime`; `sheet.ts`'s v15 Sustain branch;
  the `rpgRework` gates in `template-view.ts`, `album/rows.ts`, `hall-view.ts`, `rank-ups.ts` and `rift-view.ts`'s
  `guidedWeapons`.
- **Keep** the fight-version paths (`WeaknessIcons({ engine })`, `describeCue`, the fight screen's "Weak:" gate): a v15
  fight can still be open after the flip.
- **Tests that assume the switch at 15** (H70 ran the suite at 16): web `places/stable/OutfitProfile.test.tsx`,
  `album/upgrades.test.ts`, `album/adoption.test.tsx`; domain about 71, among them `docs.test.ts` (the manual),
  `save/battle.test.ts`, `rpg/rules-v2.test.ts`, `rpg/rules-v16.test.ts`'s "live is 15" cases,
  `world/tier1-foes.test.ts`, `economy/pacing.sim.test.ts`, `save/accessories-v2.test.ts`, `save/forge.test.ts`,
  `save/healers-v2.test.ts`; H69's "not chained" test and `migrations-v27.test.ts`'s live-15 describe.
- **Manual (`sections.md`):** § Stable (the template chip and card, the calling card, Can-upgrade without points, the
  three weapon slots, the Skills tab tree, the Battle tab's MP and Flourish rows, "Her template", the Template filters
  and search); § Scenario Gate ("Weak:", the ★ cues, rank-up lines, three Weapon Rank cells, no spare-point dot); § The
  Rift (guided weapons, weaknesses, rank-ups); § Learning ("Answers …" and "Adds …").
- **Screen edges for the owner's phone check:** the Uma sheet header (the chip beside "Mark target"), the calling card,
  the fight footer's three weapon buttons above the home indicator, the Rift sheet footers (the guided-weapons block),
  the two tree columns at 375 pt.

**From H71 (D207):**
- **The numbers the manual carries** (all v16-only, read by the generated blocks once the switch is 16): Tier 1's
  sub-boss and boss shields **6 and 8** (`RPG_FOE_SHIELDS_V16`, today's values: the drafts 5 and 6 broke too soon at the
  real Class Rank pace); the base MP regen **0.9% a depth, 4.5% from Class Rank 40** (`RPG_BASE_MP_REGEN` 0.009; a
  Class Rank 40 Mage with 296 MP regains 13, 23 with a G10 Spring: the sheet reads "+13 a round"); the Summoner's v16 Arms
  hand **0.50** (Tome 0.58 + Arms 0.50, 1.08 a turn); four B lines' v16 power (`RPG_LINE_B_POWER_V16`: Impale ×0.95,
  Draw ×0.9, the Mage's Pierce ×0.9, Spike ×1.1; their nodes' summaries follow at the flip); the Rift's
  `RIFT_TUNING_V16` (Iron ×1.6 offense; Arcane ×1.6 HP and ×1.2 offense, its sub-bosses weak to one element; the elites'
  offense 2; the Duel's champion ×0.8, the Horde's ×1.3; the Convergence −0.1), which the manual's `riftFronts` block
  reads through `riftTuning()`.
- **Tests that pin v16's tuned values** move with them, not with the flip: `world/twins-v16.test.ts`,
  `rift/generate-v16.test.ts`, `rpg/battle/mp-regen-v16.test.ts`, `rpg/battle/flourish-v16.test.ts`,
  `save/sheet-v16.test.ts`, `rpg/trees-v16.test.ts`, `rpg/rules-v16.test.ts`, `rpg/battle/engine-v16.test.ts`,
  `rpg/battle/v15-replays-live16.test.ts`. H71's always-on checks (`world/balance-v16.test.ts`,
  `rift/balance-v16.test.ts`) pass with the switch at 16 and use explicit engines.
- **What R1 leaves open** (rift.md §11, stat-balance §12's R1 note): Arcane's wrong party wins its stages 5–8 75%; the
  mirror's Lv 50 (Summoner 92% of the Spell Blade); Combo, Pack, Reap, Bonded and the healers' Heavy behind their 10–20%
  (structural: one member's chips, the farewell ×0.1, the 3-stack cap); Auto's cancels off today's by up to 17 points;
  the late-region MP at the ±10% edge. None blocks the flip.
