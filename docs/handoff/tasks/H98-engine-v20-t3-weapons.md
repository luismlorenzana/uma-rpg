# H98 — Engine v20 foundation and Tier 3's weapons: Keen, Tempered, Evolved (dark)

**uma-rpg · Claude · L · Needs: H97 (Release 4 live) · Unblocks: H99, H100, H101 (and through them H102–H105)**

> **Versions re-planned by D221 and D224 (2026-10-26):** saves v29 (the owner's "grant is tickets only" step) and v30 (the
> farm by line, H112) are taken and live. Read this packet's save v29 as **v31**, v30 as **v32** and v31 as **v33**;
> engines unchanged. Materials, recipes and the Workbench are the farm by line's
> ([farm-by-line.md](../../design/tier-rework/farm-by-line.md)): re-read them before any step that names R2's pairs, the
> ladder or a cross-line recipe.

## Why

Release 5 is Tier 3's whole toolbox ([implementation.md](../../design/tier-rework/implementation.md) §1 and §3, D198):
engine v20 and save v31, built dark and turned on by H105. Every packet after this one needs three things that don't
exist yet:
- **engine v20 accepted dark**, as the `t3` stage of the rework's one predicate, with Tier 1 and Tier 2 allies playing
  exactly as on v19;
- **proof that v6–v19 fights replay** byte for byte whatever the switch says;
- **Tier 3's weapons** ([weapon-progression.md](../../design/tier-rework/weapon-progression.md) §3.3–§3.5, §3.10): at
  Tier 3's G5 a Pure weapon becomes **Keen** (weak ×1.7) or **Tempered** (+ its Tier 2 partner, both ×1.5), a Dual
  becomes **Tempered** or **Evolved** (+ its Tier 3 partner, both ×1.5); two two-kind weapons in her slots, the Brawler
  and the Mage one; re-forging within a line.

It also logs Release 5's build decisions, which H99–H105 follow.

## Context (read first)

Code pointers are by file and function: Releases 1–4 move the lines. Re-read the code before starting.

- `CLAUDE.md`, `AGENTS.md`, [change-protocol.md](../../change-protocol.md), and [the handoff README](../README.md)
  ("How a packet reads").
- **The plan:** [implementation.md](../../design/tier-rework/implementation.md) (D198) §1–§4, and D192–D198 in
  [decisions.md](../../decisions.md).
- **The design** (precedence: uma-templates.md > stat-balance.md > the four standalone docs > README):
  [weapon-progression.md](../../design/tier-rework/weapon-progression.md) §0, §2.4 (the damage stack), §3.2's partner
  table (WP32), **§3.3 (WP9), §3.4 (WP8), §3.5 (every leaf), §3.6 (WP12's Tier 3 row), §3.8's Tier 3 column and branch
  2's table, §3.10 (WP11)**, §14's WP8–WP12 and WP32 rows; [class-progression.md](../../design/tier-rework/class-progression.md)
  §3.5 (CP33's Tier 3 line); [README](../../design/tier-rework/README.md) §9.2's "Tier 3, later" row and §9.3's "Tier 3's
  save" sentence (D198 renumbers them engine v20, save v31); [tiers.md](../../design/tiers.md) §7 and T9 (Tier 3's Rift
  waits for the fifth scenario).
- **How a dark engine was built last time:** `git show 5dd9f08:docs/handoff/tasks/H53-engine-v15-foundation.md` and
  D178–D179.
- **Releases 1–4's packets and D-rows** (their Done rows in [the handoff README](../README.md) name what shipped):
  - **H64:** `rpgRework(stage, engine)` and `RPG_REWORK_ENGINE` (`t3: 20`) in `rpg/battle/caps.ts`; the shared test
    mock `capsAt(version, caps)` in `rpg/battle/caps-at.fixture.ts`; the frozen-fixture pattern (v15's);
  - **H83 (Release 3's build decisions, its first D-row):** point 2 (Tier 3 worlds play Tier 2's shape until R5: a
    weapon that arrived with a branch keeps it and may switch at its G5 step; one two-kind weapon), point 6 (the loadout
    rule in every class she has set up), point 7 (the save's per-kind `{ grade, branch?: 'pure' | 'dual' }`, no stored
    partner); and its own: `rpg/weapon-branches.ts` (`RPG_WEAPON_BRANCHES`, `RpgWeaponBranch`, **`RPG_PARTNERS` with
    both columns, only `t2` read until R5**, `rpgPartnerOf`, `rpgWeakMultiplier`, `rpgTwoKindCap`, `rpgDualBlock`,
    `rpgSlotBlock`, `rpgBranchName`), `BattleAlly.branches`, `battleWeakFor`, `HitOptions.limit`, one lock a part,
    `reforgeWeapon`, the Forge's `branch-gem` at G5 by tier, the coverage script's Tier 2 run;
  - **H87:** the parse of weapon branches (a Tier 3 world's at any grade), Ascend carrying branches;
  - **H91 and H97:** the v18 fixture and how the last switch flipped.
- **The code:**
  - `packages/domain/src/rpg/battle/caps.ts`: `BATTLE_ENGINE_VERSION` (19 after H97), `rpgRework`, the header comment.
  - `rpg/battle/engine.ts`: `VERSIONS`, `MAX_FOES`, `validAlly`, `validateInput`, `battleWeakFor`, `battleDamage`
    (step 3), `strike`, `popLocks`; `types.ts` (`BattleAlly.branches`, the version unions); `auto.ts` (the weak premium).
  - `rpg/weapon-branches.ts` (H83) and its tests.
  - The gear rules: the G4 → G5 step's `branch` argument (H74's upgrade function, H83's change) and `reforgeWeapon`;
    the slotting checks in `save/battle.ts` (`setClassWeapons`, `holdWeapon`); the input builders that write
    `branches` (`partyMembers`, the Rift's, the balance harness's).
  - The coverage script (H66, H83) and its tests; H93's `world/coverage-t2.test.ts`.
  - The replay fixtures under `rpg/battle/` (`v14`, `v15`, `v17`, `v18`); tests that read the engine version (grep
    `BATTLE_ENGINE_VERSION` in `*.test.ts`).

## Decisions made

**Release 5's build decisions** (the main session, 2026-10-25, for the owner, who prefers no open questions). Log them
as one D-row before this packet's own (step 9):
1. **One switch, one stage.** Release 5 is engine v20 and save v31 under the stage `t3` (`RPG_REWORK_ENGINE.t3 = 20`,
   H64). Every Release 5 rule reads `rpgRework('t3', engine)`: the engine with the fight's version, rules outside it with
   `engine = BATTLE_ENGINE_VERSION`, non-fight rules (the Forge's doors, the secondary, the Observatory) with the live
   default. The deployed game stays on v19 and v30 until H105 flips `BATTLE_ENGINE_VERSION` 19 → 20,
   `SAVE_SCHEMA_VERSION` 30 → 31 and chains `toV31`, in one commit. v6–v19 fights replay byte for byte, pinned by this
   packet's v19 fixture, also run with the switch mocked to 20.
2. **Tier 3 only.** Every Release 5 rule acts on a Tier 3 ally or a Tier 3 world. Tier 1 and Tier 2 worlds play
   exactly as Release 4 left them, before and after the switch. A Tier 3 world plays Tier 2's shape until the switch
   (Release 3's and 4's build decisions, point 2) and Tier 3's whole toolbox after it.
3. **No Tier 3 Rift** (tiers T9): it waits for the fifth scenario. `RIFT_TIERS` stays `[1, 2]`; nothing here generates a
   Tier 3 front, Echo or Ascend. SB7's Tier 3 tuned-peak budget (×1.8 the campaign's act) is measured by H104 and
   recorded for that later doc.
4. **Tier 3 worlds that exist at the switch keep everything** (twenty ascended from a Tier 2 run, on Tier 2's shape):
   grades and branches stay; a weapon at G5 or above still on Pure or Dual is owed its Tier 3 step (one Branch Gem, the
   grade kept); each tree holds a second line; a third accessory slot at G0 and a second weapon moon read from her
   preset arrive (H102).
5. **Numbers:** the masteries' and Tier 3's term's values are the docs' drafts until H104 measures them; the masteries'
   shapes (CP27) never change.
6. **Docs:** dark packets leave `docs/game/` and `pnpm docs:update` unchanged and add "Built in H… (D…), live from
   H105." lines to the design docs they implement (the owning section, as H83 and H91 did); H104 writes its measured
   numbers there; H105 rewrites the manual.
7. **No uma-kit change and no new art** (WP29): branches and forms keep their icons with a text mark. A packet that
   finds it needs a kit change stops and files a "Both apps:" request in uma-platform ([change-protocol.md](../../change-protocol.md)).
8. **Names** (WP28): Keen, Tempered, Evolved, line, re-forge, the late step ("Take the Tier 3 step"), weapon moon 2,
   capstone, master slot, mastery, the six masteries' names. No screen shows them outside a Tier 3 world.
9. **The work in waves:** 1) H98 → 2) H99, H100, H101 → 3) H102, H104 → 4) H103 → 5) H105.

**This packet's decisions** (WP8, WP9, WP11, WP32's Tier 3 column):
- **Engine v20 accepted, dark.** `VERSIONS`, `MAX_FOES` (8) and the version unions gain 20. The engine's header comment
  gains: "v20 Tier 3 (D…), dark until H105: Keen, Tempered, Evolved; H99's third accessory slot and weapon moon 2;
  H100's capstones, two lines held, the master slot and the masteries".
- **v20 changes nothing below Tier 3.** A v20 input whose allies are all Tier 1 or Tier 2 plays the same cues, units and
  outcome as at v19. Every v20 rule tests `rpgRework('t3', version)` and the ally's `tier` 3.
- **The branches** (WP9), in `rpg/weapon-branches.ts`: `RPG_WEAPON_BRANCHES` gains `'keen' | 'tempered' | 'evolved'`.

  | Branch | Kinds | A weak hit | At Tier 3's G5 (one Branch Gem), from |
  |---|---|---|---|
  | **Keen** | Its own | **×1.7** | Pure |
  | **Tempered** | Its own + its **Tier 2 partner** (`RPG_PARTNERS[w].t2`) | **×1.5 on both** | Pure, or Dual (keeps its partner) |
  | **Evolved** | Its own + its **Tier 3 partner** (`RPG_PARTNERS[w].t3`) | **×1.5 on both** | Dual |
  | Pure · Dual | As in Tier 2 | ×1.5 · ×1.3 | Base (the Tier 2 step a tier late) |

  - `rpgWeakMultiplier(branch, engine)` from v20: keen 1.7, tempered 1.5, evolved 1.5 (pure, dual, base as v18).
  - `rpgBranchPartner(weapon, branch)` (new): dual and tempered → `t2`, evolved → `t3`, else none; `battleWeakFor`,
    shields and `popLocks` read it, so a partner counts exactly as a Dual's does (one shield point and one lock a part,
    whichever kind matched). Every bonus still reads the hit's own kind (WP13). **A weak hit is never above ×1.7; no
    weapon holds three kinds.** Limit Breaks keep ×1.3 and no partner (`HitOptions.limit`).
  - `rpgBranchName`: "Keen Greatsword", "Tempered Lance + Katana", "Evolved Lance + Bow"; Tomes by element ("Keen
    Fire", "Tempered Ice + Light", "Evolved Fire + Light").
- **The Tier 3 partners** are `RPG_PARTNERS`' `t3` column, already data (WP32): Greatsword, Axe → Katana; Lance → Bow;
  Bow, Katana → Lance; Fire → Light; Ice, Lightning → Dark; Light, Dark → Lightning. From v20 an Evolved weapon reads it.
- **The limits in Tier 3** (WP8): `rpgTwoKindCap(classId, tier, engine)` from v20 in Tier 3 is **2, the Brawler and the
  Mage 1** (1 at v19, as H83 set). Two-kind weapons are Dual, Tempered and Evolved. Her slotted kinds stay all
  different, partners included (an Evolved's Tier 3 partner too), so with the cap she holds at most 5 kinds (the Brawler
  and the Mage 4) and at most 4 of one channel. `rpgDualBlock` and `rpgSlotBlock` check any two-kind branch, in every
  class she has set up (H83's point 6), with H83's words and Tier 3's numbers: "Two two-kind weapons in her slots in
  Tier 3", for the Brawler and the Mage "One two-kind weapon in her slots in Tier 3", the partner text as H83's.
- **A weapon's doors read its line** (WP9, WP11). Its **line** is `pure` or `dual`: Keen's is pure, Evolved's dual, and a
  Tempered weapon stores its own (`line?: 'pure' | 'dual'` beside `branch: 'tempered'`). README §9.3 names only the
  branch; WP11's re-forging needs to know which Tempered it is.
  - **At Tier 3's G5** (the G4 → G5 step takes a `branch-gem` and a pick, as H83's): Base → Pure or Dual; Pure → Keen
    or Tempered; Dual → Tempered or Evolved. This replaces H83's Tier 3 interim (keep or switch Pure or Dual).
  - **Re-forging** (`reforgeWeapon`, one Branch Gem, the grade kept): Pure ↔ Dual (a weapon still on its Tier 2
    branch, at any grade in Tier 3); Keen ↔ Tempered (pure line); Tempered (dual line) ↔ Evolved. Never across lines in
    one step.
  - **The late step:** a Tier 3 weapon at G5 or above still on Pure or Dual takes its line's doors for one Branch Gem,
    the grade kept, through `reforgeWeapon` (as H83 lets a G5+ weapon with no branch take one). Why: a Tier 3 world that
    exists at the switch played Tier 2's shape, so its weapons may have passed G5 without a Tier 3 step (build decision
    4). The doors never ask where a branch came from (nothing stores it), so a Base weapon that took Pure at Tier 3's G5
    may step on with a second gem: it costs a gem, never a cap.
  - Pure functions in `weapon-branches.ts`, each `fn(…, engine = BATTLE_ENGINE_VERSION)`: `rpgBranchDoors(state, grade,
    tier, engine)` (the G5 step and the late step) and `rpgReforgeTargets(state, tier, engine)`. Before v20 both answer
    as H83's for a Tier 3 world.
- **`BattleAlly.branches`** carries the three new values from v20, for a Tier 3 ally only; `validAlly` refuses
  (`RangeError('Invalid battle ally')`) a Tier 3 branch before v20 or on a Tier 1 or Tier 2 ally, more two-kind weapons
  than `rpgTwoKindCap`, and a partner (either column) she slots. The input builders pass her stored branch as is.
- **The save's weapon state type widens** (`branch` gains the three, `line?`); the actions above write it, gated by
  `rpgRework('t3')`, so the live game offers exactly Release 4's doors. H102 parses it strictly and migrates.
- **Promotion is unchanged:** branches carry, grades reset (WP11, H87). No Tier 4 exists, so a Tier 3 step never carries.
- **Bells and class skills** follow WP31 with no new code: a Bell's follow-up and a class skill through `via` are hits
  of that weapon, so Keen's ×1.7 and a Tempered's partner ride them.
- **The coverage script gains Tier 3** (WP12): §3.8's Tier 3 picks, best picks reached from Tier 2's (a Pure's Keen or
  Tempered, a Dual's Tempered or Evolved), regulars and sub-bosses one kind by role, bosses their twins (CP6): **2.30
  answers a regular with a Cleric and with a Paladin; a boss 3.67 (Cleric) and 3.90 (Paladin)**; every kind held at
  least twice with a Cleric (3 · 2 · 2 · 2 · 2 · 3 · 2 · 2 · 3 · 2, Greatsword to Dark). Tier 1's and Tier 2's runs print
  as before.
- **v19 replays pinned:** `rpg/battle/v19-replays.fixture.json` (helpers in `v19-replays.fixture.ts`, regenerated only
  with `UPDATE_V19=1`, every input `version: 19`), generated on the engine **before** this packet's change (H64's
  pattern: each fight's input, actions, final `battleStateHash`, rounds, outcome and a cue digest without labels). The
  fights, all on Auto with inherited Limit Breaks: a Tier 1 world stage; a Tier 2 world stage and a Tier 2 region boss
  (Pure and Dual weapons with a partner's weak hit and lock, two accessory slots with a Toll Bell ringing twice and
  Onslaught, a weapon moon, the focus, a class skill through `via`, Frenzy, a guard skill, a C line, a Break tip, the
  signature tip, LB+, twins and shield 9); **a Tier 3 world stage on Tier 2's shape**; a Tier 2 Rift Horde stage; a Duel
  champion. Two tests: live, and in a file mocking `caps.ts` with `capsAt(20, …)`. Every earlier fixture stays green.
- **No save parse change, nothing on screen.** `pnpm docs:update` leaves no diff.
- **Main JS:** `weapon-branches.ts` is main-bundle data; keep it data. Say the number.

## Do

1. **The fixture first:** on the engine before this change, write `v19-replays.fixture.ts` and generate the JSON with
   `UPDATE_V19=1`.
2. **`rpg/battle/caps.ts`, `engine.ts`, `types.ts`:** v20 accepted, the header line, v20's validation as decided.
3. **`rpg/weapon-branches.ts`:** the three branches, `rpgWeakMultiplier`, `rpgBranchPartner`, `rpgTwoKindCap`'s Tier 3
   row, the generalized blocks, `rpgBranchName`, `rpgBranchDoors`, `rpgReforgeTargets`.
4. **The engine:** `battleWeakFor` and step 3 read `rpgBranchPartner` and the multiplier by the fight's version; Auto's
   premium follows the multiplier (check it, test it).
5. **The gear rules:** the G5 step's Tier 3 doors, `reforgeWeapon`'s lines and late step, the slotting checks, gated.
6. **The coverage script's Tier 3 run.**
7. **Tests:**
   - `rpg/battle/engine-v20.test.ts` (inputs at `version: 20`): a Tier 3 Brawler's Keen Greatsword weak hit is the same
     hit at Pure × 1.7 ÷ 1.5 (rounded as the engine rounds); a Tempered Lance + Katana is weak on a Katana-weak foe at
     ×1.5, removes one shield point and breaks a Katana lock; an Evolved Lance + Bow is weak on a Bow-weak foe and not on
     a Katana-weak one; a Limit Break hit of a Keen weapon's kind lands ×1.3; refusals: Keen at v19, Keen on a Tier 2
     ally, two two-kind weapons on a Tier 3 Brawler (a Tier 3 Spell Blade's two pass, three don't), an Evolved whose
     Tier 3 partner she slots; a v20 input of Tier 1 and Tier 2 allies plays the same cues and outcome as at v19.
   - `rpg/weapon-branches.test.ts` (H83's file): all ten `t3` partners, each of its own channel and the other group;
     `rpgWeakMultiplier` by engine; the cap by class, tier and engine; `rpgBranchDoors` by line (and H83's interim at
     v19), the late step, `rpgReforgeTargets` (a pure-line Tempered can't become Evolved); §3.8's Tier 3 picks and
     branch 2's are legal for every class; the names.
   - `save/branches-v20.test.ts`, mocked with `capsAt(20, …)`: Pure G4 → G5 offers Keen or Tempered and spends one
     `branch-gem`; Dual offers Tempered or Evolved; Base Pure or Dual; Keen → Tempered → Keen keeps the grade; a
     dual-line Tempered → Evolved; the late step on a G7 Pure; the cap's refusal in another set-up class; unmocked, a
     Tier 3 world offers H83's interim.
   - The coverage script's Tier 3 figures within ±0.02.
   - `v19-replays.test.ts` and `v19-replays-live20.test.ts`; a third case: every fixture input is `version: 19`.
   - Every existing test passes unchanged.
8. **No rules call inside `rpg/battle/` relies on a default `engine`** (grep the calls you changed).
9. **Docs:** log two D-rows (fetch `main` first; the next free numbers): Release 5's build decisions above, then this
   packet's. weapon-progression §3.3 and §3.4 gain "Built in H98 (D…), live from H105."; class-progression §3.5 (CP33)
   the same. `pnpm docs:update`: no diff.
10. **Check it locally** in a desktop browser at 390×844 (your own ports, per the master prompt; never the iOS
    Simulator), on a scratch save from the CJS build with Tier 1, 2 and 3 worlds (`save/tiers.fixture.ts`' helpers,
    extended for a third): a Tier 1 and a Tier 3 world-map stage on Auto play as before, each open fight in
    `apps/api/.data/save.json` reads `"version": 19`; the Tier 3 Gear tab offers Release 4's doors only.

## Done when

- [ ] `pnpm lint && pnpm test && pnpm build` pass. Say the main JS number (gzip, of 230 KB).
- [ ] The tests in step 7 pass, both v19 replay tests and every earlier replay test included.
- [ ] No rules call inside `rpg/battle/` relies on a default `engine`.
- [ ] `git diff` shows no switch: `BATTLE_ENGINE_VERSION` 19, `SAVE_SCHEMA_VERSION` 30.
- [ ] `docs/game/` is unchanged, `pnpm docs:update` leaves no diff, both D-rows are logged, the design docs have their
  lines.
- [ ] The local check in step 10 was done at 390×844 on a scratch save and described. Nothing from the original games in
  git (`git status`).
- [ ] Deployed green (`gh run watch <id> -R luismlorenzana/uma-rpg --exit-status`), and
  https://uma-rpg.web.app/api/health shows the commit in `build`.

## Deliver

- **Claude, as a delegated worker:** a pull request from `feat/h98-engine-v20-t3-weapons` with one commit,
  `feat(domain): engine v20 foundation and Tier 3's weapons, dark (H98)`; the body says why (dark, one stage, Tier 3
  only, v19 replays pinned). Fetch `main` before you push so the D-numbers are free. The main session reviews and merges
  it, then watches the deploy. Nothing on screen changes; nothing at the screen's edges.
- **Flag it done:** after the merge, a `docs(handoff): H98 done (D…)` commit deletes this file, sets H98's State to
  Done in `docs/handoff/README.md` with the commit, adds a Done row, and sets H99, H100 and H101 to Ready.
