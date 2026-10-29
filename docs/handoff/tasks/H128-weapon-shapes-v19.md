# H128 — The weapon shapes at engine v19: Katana and Light double, Bow and Dark volley, the twins re-paired (dark)

**uma-rpg · Claude · M · Needs: H126 · Unblocks: H129, H131 (and H133's hall labels, H134)**

## Why

The owner asked for "a small rework for Light Tome to mirror Katana with double hits, and Dark Tome to mirror Bow with AoE
hits" (D240, [classes-v3.md §4](../../design/classes-v3/classes-v3.md#4-the-weapon-shapes)). So from engine v19:
- the **Katana and Light are a double** (two hits on one foe at every depth) and the **Bow and Dark a volley** (the tapped
  foe takes 0.8 of the depth's power, then one splash hit at 0.35 on every other foe), each pair a shape no other pair has;
- the **twins re-pair** to Katana–Light and Bow–Dark (Twilight stays the Bow and the Katana), so the Spellblades hold the
  multi-hit kinds and the Summoners the area kinds;
- **three B lines change** (CV14): the Brawler's Bow B becomes Barrage (the old Bow line A), the Sorcerer's Light B becomes
  Pierce and her Dark B becomes Barrage, so the twins' B lines mirror;
- **every reader of a twin** follows by engine, and v16–v18 keep theirs.

This packet builds the shapes, the lines and the twins, dark, and nothing a player sees. H129's halls read its volley
constants; H131 measures it (S6, S10).

## Context (read first)

- `CLAUDE.md`, `AGENTS.md`; D240, D241 and H126's two D-rows in [decisions.md](../../decisions.md) (Classes v3's build
  decisions: the `classes` stage, the dark pattern, the waves).
- **The design:** [classes-v3.md](../../design/classes-v3/classes-v3.md) §3 (the two pairs' identities, each hybrid's twin
  set), §3.1–§3.6 (each class's Bow, Katana, Light and Dark), §4.1 (CV12, the value table), §4.2 (every class's trees),
  §4.3 (CV13, every reader), §12 S6 and S10 (what H131 measures), §16 CV12–CV14; the preview
  [weapon-shapes.html](../../design/classes-v3/previews/weapon-shapes.html). [halls-v2.md](../../design/classes-v3/halls-v2.md)
  §5.2 and §8 (its volley seats read the same constants).
- **The manual:** `docs/game/combat.md` (shapes, riders, splash, the farewell), `skill-trees.md`, `classes.md`.
- **H126** (merged): the `classes` stage, `RpgHand.lead`, the two new hybrids' trees built on today's shapes, the v18
  replay fixture and its `capsAt(19)` test.
- **The code** (line numbers on `main` at `b9ce7c5`; H126 moves some, re-read them):
  - `rpg/kinds.ts`: `RPG_KIND_PAIRS` (:51), `RPG_TWIN_SETS` (:69), `RPG_TWIN_SET_IDS` (:74), `rpgTwinArm` (:76),
    `rpgTwinKind` (:78), `rpgTwinWeaknesses` (:83), `rpgTwinsOf` (:88), `rpgAnsweredTwinSets` (:95).
  - `rpg/catalog.ts`: `RpgSkillDef.splash` (:40), `RpgNode.skill16` (:100), `LIVE16` (:144), `RPG_LINE_B_POWER_V16`
    (:164), `addTree` (:170), `GH`/`SH`/`LH` (:190), the Brawler's Bow (:224) and Katana (:233), the Mage's Light (:273)
    and Dark (:281), `summon()` (:327), `BLADE_HITS` and `bladeCapstone` (:361–:374), `RPG_PIERCE_SCALE` (:377),
    `rpgNodeSkill` (:482), `rpgRankedSkill` (:487).
  - `rpg/node-identity.ts`: `RPG_BRANCH_B` (:37) and `RPG_BRANCH_B_NAME` (:46); `rpg/tree-view.ts` (:53, `bName`).
  - `rpg/battle/engine.ts`: `HitOptions` and the specials (:360, :396–:398), `cast()` (:912): its options (:915), `note`
    with the per-hit rider (:917–:926), the splash (:945), the per-foe rider over `log.struck` (:951); the farewell
    (`linger`, :1027). `rpg/battle/auto.ts` `score()` (:15, splash not counted).
  - Twin readers: `rift/generate.ts` (`RIFT_TWIN_SETS` :74, `twinSets` :76, `waveWeaknesses` :86 with its `engine`);
    `save/presets.ts` `presetKind` (:85, `rpgTwinKind` at :92); `apps/web/src/places/halls/hall-view.ts` (:12, :18,
    `rpgAnsweredTwinSets`); `world/world.ts:212` and `rpg/campaign/chapters.ts:145` (`rpgTwinsOf`, engines v16–v17 only:
    v18's dealer comes first); `rpg/campaign/weaknesses.ts` (reads no twin).
  - Colours: `apps/web/src/index.css:8` and `battle/labels.tsx` `KIND_COLOR` paint each Arm beside its old twin element.
  - Tests to keep green: `rpg/trees-v16.test.ts`, `rpg/battle/engine-v16-trees.test.ts`, `rift/generate-v16.test.ts`,
    `world/coverage-v16.test.ts`, every replay test.

## Decisions made

### The design's calls (exact values)

**CV12, the shapes from v19** ("depth power" = `RPG_SKILL_POWER[d − 1]`, before Skill Rank and hand):

| Pair | Shape | One act on line A (Brawler, Sorcerer) | MP | Depth 5 |
|---|---|---|---|---|
| Greatsword · Fire | Heavy | as today | as today | as today |
| Axe · Ice | Sweep | as today | as today | as today |
| Lance · Lightning | Scatter | as today | as today | as today |
| Katana · Light | **Double** | one foe, **2 hits** at every depth, the depth's power | base | ×1.3 on a Broken foe |
| Bow · Dark | **Volley** | the tapped foe: **1 · 1 · 2 · 2 · 3 hits sharing 0.8 × the depth's power**; then **one splash hit at 0.35 × the depth's power on every other living foe** | **base + 2** | on the tapped foe: Armor Break 2 (Bow), ×1.3 below half HP (Dark) |

**Riders and specials land on the tapped foe; the splash is plain** (no rider, no status, no special). A lingering volley
summon's farewell is any summon's farewell (one hit on every foe).

**§4.2, by class from v19:**

| Class | Bow | Katana | Light | Dark |
|---|---|---|---|---|
| Brawler | A: volley; **B: Barrage** (`.3b`–`.5b`: one foe, 4 · 4 · 6 hits at the depth's power, depth 5 Armor Break 2: the old core) | same | — | — |
| Sorcerer | — | — | A: double; **B: Pierce** (`.3b`–`.5b`) | A: volley; **B: Barrage** (`.3a`–`.5a`: one foe, 4 · 4 · 6 hits, depth 5 ×1.3 below half HP) |
| Arms and Tome Spellblade (one foe always) | same (2 → 4) | same (2) | **2 hits at every depth** (were 2 · 2 · 3 · 3 · 4) | **2 · 2 · 3 · 3 · 4** (were 2) |
| Arms and Tome Summoner | summons are **volleys**, depth 5 Armor Break 2 on the tapped foe | same | summons **double** (2 hits, Pack 3) | summons are **volleys**, depth 5 Enfeeble 2 on the tapped foe |
| Paladin, Cleric | same | same | same | same |

**Names from v19** (the live generation's, as names are presentation; ids never change): the Brawler's Bow depth 5 core
**Starfall Volley** (was Starfall Barrage); her Bow B **Quiver Barrage, Storm Barrage, Starfall Barrage**; the Sorcerer's
Light B **Luxaga Pierce, Luxaja Pierce, Holy Pierce**; her Dark B **Noxaga Barrage, Noxaja Barrage, Void Barrage**; the
branch names Brawler Bow "Barrage", Sorcerer Light "Pierce", Sorcerer Dark "Barrage". None equals a master-data string
(checked 2026-10-29 against the release, exact and as a word inside, counts only: 0 and 0 for each).

**CV13, the twins from v19:** Greatsword–Fire, Axe–Ice, Lance–Lightning, **Katana–Light**, **Bow–Dark**; Twilight stays
Bow + Katana. Every reader:

| Reader | From v19 | Before |
|---|---|---|
| The Rift's Duel and Horde draws (`rift/generate.ts`) | The Light set is Katana + Light, the Dark set Bow + Dark | v16–v18 unchanged |
| A hall seat's "Answers …", a Learner's "Adds …" (`hall-view.ts`) | `rpgAnsweredTwinSets` on v19's sets (live default; H133 owns the page) | unchanged |
| Presets (`presetKind` → `rpgTwinKind`) | Arms Summoner on her Bow, Tome Summoner on her Blizzard, Tome Spellblade on her Light, Arms Spellblade on her Lance | unchanged |
| Weaknesses v2 (`campaign/weaknesses.ts`) | Nothing: no twin is read | — |
| World and chapter foes of engines v16–v17 (`rpgTwinsOf`) | Nothing: pinned to v16's sets for their replays and regenerations | — |
| The manual's shape table and the defaults' rationale (F19, F33) | H134 rewrites them | — |

**Each hybrid holds one twin set in both halves:** Arms Spellblade Lightning (Lance + Thunder), Tome Spellblade Light
(Light + Katana), Arms Summoner Dark (Bow + Dark), Tome Summoner Ice (Blizzard + Axe): four different sets.

### This packet's decisions

- **A node's v19 def is `skill19`.** `RpgNode` gains `skill19?: RpgSkillDef`, set only where v19's def differs from what
  v16–v18 play; `rpgNodeSkill(node, version)` reads `skill19` from v19, then `skill16` from v16, then `skill`. The engine,
  Limit Breaks, Auto and the farewell already read nodes through it. Names follow the live generation at module load
  (`LIVE19 = rpgRework('classes')`, beside `LIVE16`).
- **The new hybrids change in place.** The Tome Spellblade's and the Arms Summoner's nodes (H126) have no older
  generation: their builders take v19's per-kind shapes and their `skill` is v19's. No `skill19` on them.
- **The volley's numbers are constants:** `RPG_VOLLEY = { target: 0.8, splash: 0.35 } as const` and `RPG_VOLLEY_MP = 2` in
  `catalog.ts`, read by every volley def here and by H129's volley seats, so H131's S6 tunes one place (splash 0.30–0.40,
  then target).
- **Volley and double defs:** a volley is `{ target: 'one', hits: pure(GH[d] + extra, RPG_VOLLEY.target × p, kind),
  splash: pure(1, RPG_VOLLEY.splash × p, kind)[0], mp: mp(d) + RPG_VOLLEY_MP, rider or special }`; a double `{ target:
  'one', hits: pure(2 + extra, p, kind), … }`; `p` is the depth's power × the side's scale (the Summoner's Pack 0.95; its
  extra hit goes to the tapped foe's hits, never the splash). No new def field: `splash` exists.
- **Barrage and Pierce defs:** Barrage is the old one-foe Bow core on its kind (`pure(SH[d], power(d), kind)`, base MP;
  depth 5 the kind's own: Armor Break 2 on the Bow, ×1.3 below half HP on Dark). The Sorcerer's Light Pierce is the
  Brawler's Katana Draw on Light: one hit at `RPG_PIERCE_SCALE` × power, +2 MP, `special: 'pierce'`, and its measured line
  factor moves with it: `RPG_LINE_B_POWER_V19 = { brawler: { lance: 0.95, katana: 0.9 }, mage: { 'tome-light': 0.9,
  'tome-ice': 1.1 } }` (the Dark Pierce's 0.9 goes to Light; both Barrages start at 1). H131 tunes them.
- **Branch names by generation:** `rpgBranchBName(classId, weapon, engine)`; `RPG_BRANCH_B_NAME` stays the live table the
  tree view reads. The side letters never change (Barrage sits on the Bow's `b` and Dark's `a`, Pierce on Light's `b`).
- **The splash is plain from v19** (engine `cast()`): a splash hit strikes with no `special`, and neither the per-hit rider
  nor the per-foe rider lands on a foe that only the splash struck; it still chips a weak foe's shield and breaks a lock,
  like any hit (S10 measures it). Before v19 the code path is today's, byte for byte (the v18 fixture's Bow B splash and
  the legacy Limit Breaks' splashes pin it).
- **Auto scores the splash from v19:** `score()` adds `splash.power × (living foes − 1)` to a def with a splash; before v19
  unchanged. Why: Auto otherwise rates a volley as a 0.8 single-target act and never aims it at a crowd.
- **Twins by engine** (`rpg/kinds.ts`): `RPG_KIND_PAIRS` keeps v16–v18's table and `RPG_KIND_PAIRS_V19` is new;
  `rpgKindPairs(engine)` and `rpgTwinSets(engine)` pick by `rpgRework('classes', engine)`; `rpgTwinArm`, `rpgTwinKind`,
  `rpgTwinWeaknesses` and `rpgAnsweredTwinSets` take `engine = BATTLE_ENGINE_VERSION`; `RPG_TWIN_SETS` is the live
  generation's. **`rpgTwinsOf` pins v16's sets** (`rpgTwinWeaknesses(set, 16)`): its only callers are engines v16–v17's
  world and chapter foes. The Rift's `twinSets` passes the fight's `engine` (already in `waveWeaknesses`), so a Rift fight
  started after H134 draws v19's sets and an older one replays from its frozen input.
- **The kinds' colours stay.** uma-art 2.15.0 paints each Arm beside its old twin element (the Bow jade by Light, the Katana
  rose by Dark; `index.css:8`, `KIND_COLOR`). That is art, not a rule: this packet leaves it, and the main session decides
  whether H127's uma-art release swaps the Bow's and the Katana's tones.
- **No save change, nothing on screen.** `pnpm docs:update` leaves no diff (the manual's shape table is H134's).
- **Main JS:** the pairs by engine sit in `kinds.ts` (main, tiny); the trees in the lazy catalog chunk. Expect under
  +0.3 KB gzip.

## Names other packets read

| Name | Where | Shape |
|---|---|---|
| `RPG_VOLLEY`, `RPG_VOLLEY_MP` | `rpg/catalog.ts` | `{ target: 0.8, splash: 0.35 }`, `2` |
| `RpgNode.skill19`, `rpgNodeSkill(node, version)` | `rpg/catalog.ts` | three generations |
| `RPG_LINE_B_POWER_V19`, `rpgBranchBName(classId, weapon, engine)` | `rpg/catalog.ts`, `rpg/node-identity.ts` | as decided |
| `RPG_KIND_PAIRS_V19`, `rpgKindPairs(engine)`, `rpgTwinSets(engine)` | `rpg/kinds.ts` | pairs `[arm, element][]`; sets `Record<RpgTwinSet, RpgDamageKind[]>` |
| `rpgTwinKind(kind, engine)`, `rpgTwinArm(element, engine)`, `rpgTwinWeaknesses(set, engine)`, `rpgAnsweredTwinSets(kinds, engine)` | `rpg/kinds.ts` | as today, by engine |

## Do

1. **`rpg/kinds.ts`:** the twins by engine as decided; `rpgTwinsOf` pinned to 16.
2. **`rpg/catalog.ts`:** `RPG_VOLLEY`, `RPG_VOLLEY_MP`; `skill19` and `rpgNodeSkill`'s third generation; `LIVE19` names;
   v19 defs for the Brawler's Bow (core and B), the Sorcerer's Light (core and B) and Dark (core and B), the Spell Blade's
   Light and Dark cores (`BLADE_HITS_V19`), the Summoner's Bow, Dark and Light summons (core and line B nodes); the Tome
   Spellblade's and Arms Summoner's builders on v19's shapes; `RPG_LINE_B_POWER_V19`. `rpg/node-identity.ts`:
   `rpgBranchBName`, the live `RPG_BRANCH_B_NAME`.
3. **The engine:** the plain splash from v19 in `cast()`; Auto's splash score from v19. Every rules call passes the
   fight's version.
4. **The readers:** `rift/generate.ts` (the fight's engine), `save/presets.ts` (`presetKind` with `rpgTwinKind(…,
   engine)`), the web's `hall-view.ts` (unchanged code, live default; say so in the PR).
5. **Tests:**
   - `rpg/kinds-v19.test.ts`: the pairs and the six sets at 18 and 19; `rpgTwinKind` both ways at 19 (Katana ↔ Light, Bow
     ↔ Dark) and 18; `rpgAnsweredTwinSets([katana], 19)` is the Light set and Twilight, `([bow], 19)` the Dark set and
     Twilight; `rpgTwinsOf` gives the same weaknesses at any switch (a few signatures, unmocked and under `capsAt(19)`).
   - `rpg/trees-v19-shapes.test.ts`: every row of the §4.2 table at 19 against 18 (hits per depth, target, splash power
     `0.35 ×` and hits' total `0.8 ×` the depth's power, MP + 2, the depth-5 rider or special); the Barrages and the
     Sorcerer's Light Pierce (`RPG_PIERCE_SCALE × 0.9`); the Summoner's Pack volley (its extra hit on the tapped foe, the
     splash ×0.95); the new hybrids' Light, Dark and Bow on v19's shapes; the Paladin's and Cleric's trees unchanged; the
     v19 names under a mocked live switch and the branch names; **Pierce on a line at v19: 66 nodes** (both Spellblades'
     30 each, the Brawler's Katana 3, the Sorcerer's Light 3); every node of v18 plays the same def at 18 as before this
     packet (a digest of all 750 `rpgNodeSkill(node, 18)`, taken before step 2); `skill19` exists exactly where v19's def
     differs.
   - `rpg/battle/engine-v19-shapes.test.ts` (inputs `version: 19`, three identical foes): a Sorcerer's Nox hits the tapped
     foe with its hits and each other foe with exactly one splash hit worth 0.35 ÷ 0.8 of the hits' total (as the engine
     rounds); a depth-5 Bow volley's Armor Break 2 lands on the tapped foe only, and a Black Hole's ×1.3 below half HP
     counts on the tapped foe only; a weak splash removes one shield point; a double lands two hits on one foe; an Arms
     Summoner's lingering Slinger bids farewell with one hit on every foe; on two foes with no weakness Auto prefers a
     Sorcerer's Nox (0.8 + 0.35) to her Fire of the same depth (1.0), and on one foe the Fire.
   - `save/presets-v19.test.ts` (`capsAt(19)`): `presetKind` with an Orb or Bell family for the four hybrids on their v19
     defaults: Arms Spellblade Lance, Tome Spellblade Light, Arms Summoner Bow, Tome Summoner Ice; each hybrid's defaults
     hold one twin set in both halves, four different sets.
   - `rift/generate-v19.test.ts`: at 19 a Duel boss and the Horde draw v19's sets (a Light-set foe weak to the Katana and
     Light); v16–v18 generation unchanged (the existing digests).
   - H126's v18 replay tests (live and at 19) and every earlier replay test pass unchanged.
6. **No rules call inside `rpg/battle/` relies on a default `engine`.**
7. **Docs:** a D-row (fetch `main` first; the next free number) for this packet's decisions. classes-v3.md §4.1–§4.3 gain
   "Built in H128 (D…), live from H134." `pnpm docs:update`: no diff.
8. **Check it locally** at 390×844 on a scratch save from the CJS build: a Tier 1 world stage and a Rift stage on Auto play
   as before (`"version": 18` in the open fight); the Skills tab and the Hall pages look as before.

## Done when

- [ ] `pnpm lint && pnpm test && pnpm build` pass. Say the main JS number (gzip, of 230 KB) and this packet's change.
- [ ] Step 5's tests pass, with every replay test live and at 19.
- [ ] No rules call inside `rpg/battle/` relies on a default `engine`.
- [ ] `docs/game/` is unchanged and `pnpm docs:update` leaves no diff; the D-row is logged; the design lines are in.
- [ ] Step 8's local check was done and described. Nothing from the original games in git (`git status`).
- [ ] Deployed green (`gh run watch <id> -R luismlorenzana/uma-rpg --exit-status`), and https://uma-rpg.web.app/api/health
  shows the commit in `build`.

## Deliver

- **Claude:** a branch `feat/h128-weapon-shapes-v19` and one pull request, commit `feat(domain): doubles, volleys and the
  re-paired twins on engine v19, dark (H128)`; the body says why and gives the main JS number. Fetch `main` before you
  push so the D-number is free. After CI passes, Claude merges it and watches the deploy.
- **Flag it done:** a `docs(handoff): H128 done (D…)` commit deletes this file, adds H128's Done row to
  `docs/handoff/README.md` with the commit, and sets H129 Ready (H131 when its other needs are done).
