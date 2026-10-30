# H134 — The switch: Classes v3 and Halls v2 go live (engine v19, save v32), and the manual rewritten

**uma-rpg · Claude · M · Needs: H130 (save v32), H131 (the balance), H132 (the reset sheet and the Exchange), H133 (the
Learning and Hall pages), H137 (the class tree and promotion on today's Skills tab; D252), H127 (the emblems, done);
through them H126, H128, H129 · Unblocks: the Tier 2 re-plan (D238); H135's own Sanctum becomes visible when it lands**

## Why

H126–H133 built Classes v3 (D240) and Halls v2 (D241) dark on engine v19 and save v32: thirteen classes in a tree, Tier 0
and promotion, the volley and the double, twenty Limit Breaks in five halls, the reset with its refund, the healer seats'
merge, the one-time sheet, the Exchange's Manual sheet, the profile's Class and Template tabs, the Learning page; H131
balanced them. **This packet turns them on in one commit**: new fights start on v19; on its first open, every world's
save becomes v32 (every Uma to her Tier 0 at Rank 1, her Class EXP back as Class Marks, the healer seats merged), the
screens show it and "The classes are rebuilt" explains it once; the manual says what the game now plays. Nothing reached
the owner before this: the reset, the tree, the halls and the new rules arrive in one release (CV31, HV24). **The deploy
changes the owner's save**, so it's rehearsed on a full-shaped scratch save first and watched to the end.

## Context (read first)

- `CLAUDE.md`, `AGENTS.md`; the D-rows and Done rows of **H126–H133** and **H127**: each says what it left for the
  switch (H120 and H123: their sections.md rows under a "From the switch (H134)" line; H123: the calling pick's pieces to
  retire; **H131: the numbers the manual needs**; H130's and H132's and H133's own notes). **Where this packet names a
  function H126–H133 created, the name in their packets wins.**
- **The designs:** [classes-v3.md](../../design/classes-v3/classes-v3.md) §8 (the reset: §8.1 what, §8.2 the refund,
  §8.4 work, §8.5 everything else, §8.6 the sheet, **§8.7 the worked examples**), §10.1 (the guidance by held classes),
  §13 (engine v19, save v32), §14.5 (the screens and the manual's pages), §17 (CV-G); [halls-v2.md](../../design/classes-v3/halls-v2.md)
  §7 (the seat map, the merge rule and its example), §9 (the manual), HV24.
- **How the last switches landed:** H82's packet (`git show 04e869a~1:docs/handoff/tasks/H82-economy-switch.md`: the
  fixture first, two kinds of tests, the scratch migration's numbers in the pull request) and H90's structure (`git show
  4f0a1bf:docs/handoff/tasks/H90-r3-switch.md`; never built: its "engine v19, save v29" are not these); H61's, H72's and
  H82's Done rows in [handoff-history.md](../../archive/handoff-history.md); weaknesses v2's switch (H116, D237).
- **The switch** (lines on `main`, `b9ce7c5`):
  1. `packages/domain/src/rpg/battle/caps.ts` 33: `BATTLE_ENGINE_VERSION = 19` (its header 13–31; `RPG_REWORK_ENGINE`
     40 as H126 left it: `{ fight: 16, economy: 17, weak: 18, classes: 19, t2Weapons: Infinity }`);
  2. `packages/domain/src/save/version.ts` 4: `SAVE_SCHEMA_VERSION = 32` (and its header comment);
  3. `packages/domain/src/save/migrations.ts` 205–211: `migrateWorld` chains H130's `toV32(world, tier)` after `toV31`
     (`version < 32`), with the world's tier ("Every step to v32"). `save/save.ts` 1319–1327: `parseSave`'s doc gains the
     v31 → v32 step. H130 wrote `toV32`, the v32 parse behind the stage, `TierWorld.classesV3` and the boot step
     `settleClassesV3Trades`; its tests already run `toV32` on CV §8.7's A–E (21, 13, 10, 0, 34).
- **The replays:** `rpg/battle/v14-…v17-replays.{fixture.json,fixture.ts,test.ts}` (H64's pattern); **H126 froze
  v18's** on the live engine before any v19 change (`v18-replays.fixture.{json,ts}`, `v18-replays.test.ts` live and
  `v18-replays-live19.test.ts` with the switch mocked to 19); `v17-replays.test.ts` 11–14 asserts the live engine 18
  and the stages. The switch mock: `rpg/battle/caps-at.fixture.ts` (`capsAt`) and every file that mocks 19 (H120's
  `class-view.v19.test.ts`, H123's
  `template-view.v19.test.ts`, H132's `manual-view.v19.test.ts`, H133's `hall-view.v19.test.ts` and its route test, and
  H126–H131's).
- **The manual** (`docs/game/`): `classes.md` (§ The six classes, § Her calling and her template, § Weapons, § Standard
  presets, § Skills, § Limit Breaks, § Ranks and levels), `skill-trees.md` (§ How to read a row, § The lines at a
  glance, § Pierce, § Every tree), `combat.md` (§ Damage, § Weaknesses, shields and Breaks, § Limit Breaks, § The Rift's
  foes, § Constants), `heroes.md` (all), `loops.md` (§ Ranks, § The Exchange, § The Tier rework's updates, § The Rift),
  `sections.md` (§ Stable, § Exchange, § Account, § Learning and § Halls of Heroes, § The Rift), `materials.md` (where it
  names a trade's callings), `architecture.md` (§ The save, § Save history); `docs/technical/architecture.md` (3, 24, 63,
  65, 77: the versions); `README.md` 16 (the status line); [phone-check.md](../../testing/phone-check.md).
- **The live blocks** (`packages/domain/src/docs/render.ts`): `classes` 149 (its `callingOf` 112 and `CALLING_ROW` 105,
  `special` 136, the "Limit Break power" column), `templates` 159, `presets` 172, `weapons` 182, `skill-trees` 208,
  `limits` 234, `heroes` 257, `battle-constants` 279, `ranks` 482, `facilities` 542 (its `callings` map 544),
  `rift-fronts` 682. Most read the live generation and move by themselves; read each against the code.
- **The Rift's guidance** (`apps/web/src/places/rift/rift-view.ts`): 37 `partyGuidance`, 66 `guidanceMatch` (a multiset
  match on 77 `partyClassesOf`, her **active** class), 87 `guidedWeapons`, 101 `bestParty`, 114 `suggestConvergence`;
  H126's v19 builds in `rift/fronts.ts` (`RIFT_FRONT_SPECS`, as H131 tuned them); `rift-view.test.ts`. H126 gives the
  guidance `umaHeldClasses(uma, tier, engine)` (the classes she may fight as now), `umaClassTree(uma, outfit, tier,
  engine)` (a tile's `'ready'` state) and `activeClass(outfit, uma, tier, engine)`.
- **The Stable's facets** (`apps/web/src/album/rows.ts` 36–40: Class and Calling list `RPG_CLASSES`; 97 reads her
  `calling.pick`).
- **Production:** [infrastructure.md](../../technical/infrastructure.md); the API copies a stored save to
  `saveBackups/{uid}-v{n}` before a newer version replaces it (D69; `apps/api/src/save/firestore-save.repository.ts`
  26–38) and refuses a client save older than the stored one (D45); its test, `firestore-save.repository.test.ts`
  (H114's v30 → v31 cases).

## Decisions made

- **One commit flips the three lines** and carries every test and doc change the flip needs. One commit comes before
  it in the same pull request: the dark pieces CV-G owns (below). Nothing else changes behaviour: a rule that needs
  fixing is a bug in H126–H133's work, fixed here with a test and named in the delivery.
- **The replays:** H126's v18 fixture is already frozen. With the flip, `v18-replays-live19.test.ts` (mocked) becomes
  the real one and merges into `v18-replays.test.ts`; `v17-replays.test.ts`'s and `v18-replays.test.ts`' switch lines
  move to 19 (`rpgRework('classes')` true). The v14–v18 fixtures all replay under 19.
- **Tests that pinned today as the live game** fall in two kinds (list both in the delivery):
  - about **old fights or v18 rules that still matter** (v18 replays, a v31 save's parse before its migration, the 24
    seats and six classes an open v18 fight reads, v18's hands): make the generation explicit (`engine: 18`, a v31
    fixture) and keep them;
  - about **the live game** (six classes in `RPG_CLASSES` and `pixel-icons.test.tsx`'s six, the calling pick, six halls,
    24 live seats, `${classId}-1` seats, the six-tile class sheet): move them to v19, or delete them where an H126–H133
    test covers the same. **Every file mocking 19 loses its mock**; a mocked twin merges into its live file.
- **The v18 rules stay** (H61's and H82's precedent): engine v18 and older replay on their classes, hands, trees and the
  24 Limit Breaks; the migration chain reads the old calling rows. No cleanup packet.
- **What retires at the flip** (unreachable once a save is v32): H123's interim calling card (`CallingCard`,
  `callingCard`, `chooseCalling`, `confirmCallingPick`); `save/calling-repair.ts` (`repairCallingChoices`,
  `repairCallingRule`; H130 left them inert from the stage for this) with its test, its `index.ts` export and its web call
  (`apps/web/src/save/game.ts` 120), keeping H130's `settleClassesV3Trades` call beside it (CV §5.3); the old Hall
  names H129 kept for the live game (`heroLimitsOf(classId)`, `heroLimitClass`) once H133's pages read the hall-based
  ones; any v18-only branch a screens packet's Done row names as left for
  the switch (H120 left none: its two generations are one code path). Keep anything an old fight's replay or the
  migration reads.
- **The dark pieces CV-G owns** (one commit before the flip, each gated by `rpgRework('classes', engine)`, inert until
  it):
  - **The Rift's guidance reads held classes** (CV §10.1; H126 left it to this packet). From v19 `guidanceMatch` counts
    a member for a guided class **she holds** (`umaHeldClasses`: the guided weapons' one tap switches her), so a rebuilt
    roster isn't 0 of 5; the front's guidance names each guided class no member of the suggested party holds, **"Needs
    an Arms Summoner"**, and under it up to three roster Umas who could fill it, **those who can promote into it now
    first** ("Ready to promote": its tile `'ready'` in `umaClassTree`), then those who hold it ("Holds it"); a row opens
    her profile's Class tab (H124's door). No new action. *Why:* after the reset every Uma is a Tier 0, so an
    active-class match reads nothing until she rebuilds.
  - **The Stable's Calling and Class facets** (CV §14.5), unless H126 or H132 built them: from v19 Calling lists the five
    Tier 0s (her calling by style; no pick), Class the thirteen in a Tier 0 and a Tier 1 group.
- **The migration runs as H130 tested it, first on a full-shaped scratch save** (every part §8.5 and HV §7 touch
  present), made by **today's build through the game's own code** (the API's local save on your own port, never the
  owner's; outfits from `@luismlorenzana/uma-data/testing`), then opened by the flipped build:
  - **Tier 1's world:** Umas **A–E exactly as CV §8.7** (A Front A: Brawler R34 bar 300, Paladin R12 bar 100; B Pace A
    and Late A, Power over Wit: Spell Blade R26 picked, Mage R8 bar 50, working a Forest job with one queued; C Late A:
    Cleric R24 bar 200; D Pace A, Lv 1, a Mage calling, no Class EXP; E Late A and End A: Summoner R50, Mage R15),
    **2,500 Class Marks** banked, a party of the five, a target on A; **ten more Umas at Lv 1 with no Class EXP**, each
    Front-only or Late-only (so the grant stays A–E's and no other trade moves), as the halls' Learners, their Bonds
    written into the scratch file; the halls as HV §7.2's example: `paladin-2` Hero A (Bond 4 on it) with six Learners,
    `paladin-3` Hero B (Bond 10 on it) with five, one Learner under both (ten different Umas); `paladin-1` and
    `paladin-4` with no Hero, one of the ten holding Bond 6 on `paladin-4`; `cleric-1` Hero C with three of them;
    `brawler-1` Hero E with two; **an open v18 world-map fight mid-round**; a Rift run with one sealed front and **an open
    Rift fight**.
  - **Tier 2's world:** Uma F Brawler R20 (bar 0), Uma G Mage R10 (bar 999).
  - **Expected, and the pull request's body carries what the sheet showed against it:**
    - **Tier 1: +78 Class Manuals = 78,000 Class Marks** (A 21, B 13, C 10, D 0, E 34), the wallet 80,500; A **Recruit**,
      B **Apprentice**, C **Acolyte**, D **Duelist**, E **Caller**, each at Rank 1, every class's rank, weapons, lines and
      equipped skills back to defaults, no calling pick; B's trade **Wood → Stone** (her Forest job finished into the
      Warehouse with its Craft EXP, her queue dropped), D's **Stone → Wood** (no work); B's template Spellfencer →
      Spellwright; grades, Levels, Extra Stats, Craft Levels, parties, targets, Laurels and items unchanged;
    - **the halls:** `healer-2`: Hero A (the lower Bond), B its first Learner at Bond 10, then nine of the ten pooled
      Learners by Bond, the tenth keeping her Bond unseated, the shared Learner seated once with a free second place;
      `healer-1`: no Hero, Bond 6 for the Uma who had it on `paladin-4`; `healer-3`: Hero C and her three; `brawler-1`
      untouched; the sheet's Halls line names A and B;
    - **Tier 2: +9 Manuals** (F ⌈5,320 ÷ 1,000⌉ = 6, G ⌈2,799 ÷ 1,000⌉ = 3; 1:1, no Tier 0), F Brawler R1, G Sorcerer R1;
    - **the open fights** still `version: 18`; each finishes and settles on v18, its class EXP going to the entrant's
      family Tier 0 (H130's `RPG_RESET_TIER0`) and its Bonds to the merged seats; the next fight starts as `version: 19`;
      the Rift run's sealed front and roster stay;
    - B's and D's trades settle on the first boot after the roster loads (H130's `settleClassesV3Trades`, not in
      `toV32`): check the Warehouse and her Craft EXP after that boot, and that a second boot changes nothing.
- **The manual says what the game now plays,** in its short style, with the live blocks regenerated (CV §14.5, HV §9):
  the class tree (three roots, thirteen classes, parents), Tier 0 (one skill, any three weapons, Rank 1–10 on its own
  curve), promotion at Rank 10 and the waiting EXP, reclassing's rules and costs, the calling by style (five rows, no
  pick), templates (five callings, fifteen types, the Flourish by family, moon II by root), trades by Tier 0, the five
  shapes and the re-paired twins, the B lines' moves (Barrage, Pierce), the two new hybrids' trees, the hands with their
  lead half, the Limit Break as its own power × her class's scale × her open depth, the five halls and twenty seats
  with the ladder, the merge's history, the Rift's builds by family and the guidance by held classes, the Exchange's
  Manual sheet, the one-time sheet and its Account row; **H131's measured numbers** where a page states one. Engine
  v18's behaviour stays only where an old fight still uses it ("Fights from v18 and before replay with six classes and
  the 24 Limit Breaks"). The "From the switch (H134)" lines in sections.md become the text and their v18 rows go.
  `render.ts`: `classes` prints thirteen rows with parents and **"Limit Break scale"** in place of "Limit Break power";
  `callingOf` the five style rows; `facilities`' `callings` the Tier 0 per trade; the rest as they read the live
  generation.
- **Design docs:** classes-v3.md and halls-v2.md: "Built and live (H126–H134, D…)" in their status lines (and "the
  Sanctum wears the Bastion's keep until H135" if H135 hasn't landed); class-progression.md and uma-templates.md: one line
  at the top, "Classes v3 (D240, live from H134) replaces the calling pick (CP29) and the six-class callings".
- **Versions:** the handoff README's Versions line: engine v19, save v32, and uma-art as pinned (2.16.0 from H127, or
  later).
- **The bundle:** main JS under 230 KB gzip (about 223.5 before H126). If the flip passes it, move what only replays
  read (v18-and-older class, tree and Limit Break tables) behind the replay's existing lazy import before merging; never
  cut a v19 piece; say the before and after.

## Do

1. **The dark pieces** (the Rift's guidance, the Stable's facets) with tests: `rift-view.test.ts` unchanged on v18, and
   a v19 file (the switch mocked to 19, merged into the live file at step 2): a party of rebuilt Umas counts held
   classes, "Needs an Arms Summoner" with a Ready-to-promote Uma first; the facets' v19 options. Commit them.
2. **The switch:** the three lines and the comments that name the current versions; the replay tests as decided; the
   retirements as decided.
3. **Run everything:** `pnpm lint && pnpm test && pnpm build`. Fix what the flip breaks as decided. The v14–v18
   fixtures replay under 19.
4. **The API:** `firestore-save.repository.test.ts` moves to "runs on save v32 since H134": a stored **v31** save
   (invented: a Tier 1 world with a Brawler R12 who is the `paladin-1` Hero, 1,000 Class Marks) and a v32 PUT keep
   `saveBackups/{uid}-v31` whole; a later v32 write backs nothing up; an old app's v31 body is parsed to v32 (its reset
   applied: she's a Recruit, `healer-1`'s Hero, Marks + her Manuals) with the same backup while v31 is stored, then
   refused once v32 is stored (D45).
5. **The scratch migration** as decided; keep its numbers for the pull request.
6. **Docs:** the manual pages and `render.ts`' blocks as decided; `pnpm docs:update`, then read every regenerated block
   against the code. `phone-check.md` (on top of H125's rewrite if it has landed): the preamble's versions; a step
   after sign-in for "The classes are rebuilt" (the grant, the lines, To the Exchange, the Account row); the Class tab's
   tree, a promotion and a reclass; the Exchange's "Her share" and "To Rank 10"; Learning's five halls and a Sanctum
   seat card; a v19 fight with a volley and a Limit Break's stack; the Rift's guidance. The design docs' lines;
   architecture.md, technical/architecture.md and README.md: engine v19, save v32, a v32 bullet in the save history;
   the handoff README's status and Versions lines; the D-row (fetch `main` first).
7. **Validate locally** on the migrated scratch save (the API on your own port with its local save; the web at 390×844
   and 375×667, light and dark, in a desktop browser, never the iOS Simulator):
   - the first open: **"The classes are rebuilt"** with +78 and 78,000, A–E's lines (B's "· trade Wood → Stone"), the
     Halls line; Later closes it for good; the Account row reopens it; To the Exchange opens the Manual sheet;
   - the Exchange: Uma A's Recruit, "Her share" 21, "To Rank 10" 4; read 16 on her Recruit: `R10 · +12,400 EXP waiting`
     (H132's wording); her Class tab's Ready dot and "Promote"; the promotion sheet (Brawler Suggested, the waiting EXP);
     **Promote to Brawler → R35** (§8.7); "Fight as Arms Summoner" from the tree; a closed class's gate; "Start Caller ·
     R1"; her Template tab's fixed calling, no pick card anywhere;
   - Learning's five halls (the Sanctum in the middle, the Observatory under it); `healer-2`'s seat card (home class,
     shape, ×2.0) with Hero A and B its first Learner;
   - the open v18 fight goes on to its end on v18 and settles; then v19 fights on Auto: the Tier 0 party in continent 1;
     a Brawler's Bow volley (the splash on every other foe), a Light double, an Arms Summoner's lingering summon's
     farewell, a Healer Sanctum Limit Break's Brave stack;
   - the Rift: a front's "Needs an Arms Summoner" with a roster Uma whose Recruit or Caller is at Rank 10 listed first,
     "Ready to promote"; the one-tap weapons;
   - the Stable's facets (Calling five, Class thirteen); the Party Hall's healer warning on a Paladin and a Cleric only;
   - on a **second scratch save** with a Tier 1 run ready to Ascend and a Tier 0 Uma at Rank 7: she arrives in Tier 2 as
     her suggested promotion at Class Rank 1, every Tier 1 class open there (CV §2.5).
   Describe what you saw; screenshots with original art stay local.
8. **Deploy and watch** (`gh run watch <id> -R luismlorenzana/uma-rpg --exit-status`; rerun the web job on Vitest's
   `Timeout calling "onTaskUpdate"`); https://uma-rpg.web.app/api/health shows the commit.

## Done when

- [ ] `BATTLE_ENGINE_VERSION` is 19, `SAVE_SCHEMA_VERSION` 32 and `migrateWorld` chains `toV32`, all in one commit.
- [ ] `pnpm lint && pnpm test && pnpm build` pass; the v14–v18 replay tests pass under 19; no test mocks the switch to
  19; the main JS is under 230 KB gzip (say the number and the change since H126).
- [ ] The API's v31 → v32 backup test passes.
- [ ] The scratch migration matched the expected numbers (or the delivery names each miss and its fix), and its sheet's
  numbers are in the pull request.
- [ ] The manual describes Classes v3 and Halls v2 as played; `pnpm docs:update` leaves no diff; the design docs, the
  phone check and the handoff index read right; the D-row is logged.
- [ ] The local validation in step 7 was done at both widths and both appearances, on scratch saves, and described.
  Nothing from the original games in git.
- [ ] Deployed green and https://uma-rpg.web.app/api/health shows the commit.

## Deliver

- **Claude, as a delegated worker:** a pull request from `feat/h134-classes-v3-live` with two commits: `feat: the
  Rift's guidance by held classes and the Stable's v19 facets, dark (H134)`, then `feat: Classes v3 and Halls v2 live,
  engine v19 and save v32 (H134)`. The body says what
  flipped, the tests made explicit or moved, what retired, the scratch migration's numbers against the expected, the
  local validation and the bundle. Fetch `main` before you push. Merge it yourself after green CI; this deploy changes
  the owner's save, so watch it to the end and check health.
- **Flag it done:** after the merge, a `docs(handoff): H134 done, Classes v3 and Halls v2 are live (D…)` commit deletes
  this file, adds an H134 Done row and sets the queue's status line.
- **Tell the owner,** plainly: on the phone's first sync the save becomes v32 and the v31 copy is kept in
  `saveBackups/{uid}-v31`; "The classes are rebuilt" opens once (the Account reopens it); the Class Marks are the
  Manuals, spent at the Exchange; the screens near the edges to check on the phone are the Class tab's tree, the
  promotion sheet and the Learning page's five halls.

## Notes from the main session (2026-10-29)

- **Kind colours follow the twins.** `apps/web/src/index.css` paints each Arm beside its twin element (`--kind-bow` beside
  Light, `--kind-katana` beside Dark, light and dark themes). With the twins re-paired to Katana–Light and Bow–Dark
  (CV13), swap the two Arms' tones in the flip commit so each Arm sits beside its new twin again; uma-art's icons are
  unchanged. Check the weapon chips and the Gear tiles in both themes.
- **The B-line knob in H131 is confirmed:** only the three moved lines (both Barrages and the Sorcerer's Light Pierce),
  within 0.85–1.15, by the CP15 / H71 line rule. The Stable's Calling and Class filters stay in this packet (no other
  packet owns them), inert until the flip.
- **Main JS:** H136 (the migration chain and the v1 economy out of the entry) lands before H126; measure against its
  freed budget.
- **The Exchange's wording after the flip** is H132's: a Tier 0 that read past Rank 10 shows `R10 · +12,400 EXP waiting`
  (16 Manuals in the worked example), not "Waits for her promotion"; check that line in the local validation.
- **D252 (2026-10-29): no longer needs H119, H120 or H123.** The class tree and the promotion screen are H137's, on today's
  Skills tab. You retire the calling card yourself, as already planned. Where a step here names H120's or H123's
  screens, use H137's sheets: the local validation promotes a Tier 0 through them.
- **From H137 (D253), for the flip:** pin uma-art 2.16.0 or later in `apps/web/package.json` and remove H126's
  `ClassEmblem` fallback, so the Tier 0 and hybrid tiles draw H127's emblems (D251's adoption moved here by D252). The
  Skills tab's Class Ranks grid under Inheritance would list all thirteen classes at v19 with the Tier 0 bars on the
  Tier 1 curve: hide the Tier 0s there or draw them to 10 (H120 removes the grid later). The Flourish line reads "No
  effect as …" for a Tier 0 at v19: check it against the templates' rule (Flourish by family) and fix the wording or the
  rule's reader.

