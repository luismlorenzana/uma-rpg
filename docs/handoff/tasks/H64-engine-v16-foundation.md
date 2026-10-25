# H64 — Engine v16 foundation: the rework's switch, three weapon slots by channel, the owner's defaults (dark)

**uma-rpg · Claude · M · Needs: nothing · Unblocks: H65, H66, H67 (and through them H68–H72); R2's H74 and H77**

## Why

The Tier rework ships as five live releases (D198, [implementation.md](../../design/tier-rework/implementation.md)).
**R1, Tier 1's fight, is engine v16 and save v27**, built dark like classes v2 (H53–H61) and turned on by one switch
packet, H72. Every R1 packet after this one needs four things that don't exist yet:
- **one predicate per release stage** (`rpgRework`), read by the engine with the fight's version and by every other rule
  with the live default, so H72's single flip turns R1 on everywhere, and R2–R5 reuse it;
- **three weapon slots by channel** (CP2) with **the owner's defaults** (CP3), and every kind of a slot's channel
  equippable (CP12), as rules that answer by generation;
- **engine v16 accepted**, dark: three weapons, no side skills, no `legacy`;
- **proof that v6–v15 fights replay exactly** whatever the switch says: a frozen v15 fixture, as H53 froze v14's.

This packet builds them and nothing a player sees. It also logs the main session's R1 build decisions as a D-row, which
H65–H72 follow.

## Context (read first)

- `CLAUDE.md`, `AGENTS.md`, [change-protocol.md](../../change-protocol.md). Then:
  - [implementation.md](../../design/tier-rework/implementation.md) §1–§4 (D198): the releases, the conventions, R1's table;
  - [class-progression.md](../../design/tier-rework/class-progression.md) §3.1–§3.4 (CP2, CP3, CP12), §2.2 (hands), §14
    (save impact), §16 (CP2, CP3, CP12, CP31);
  - [stat-balance.md](../../design/tier-rework/stat-balance.md) §5.1 and SB11 (the Summoner's Arms hand 0.48);
  - [README.md](../../design/tier-rework/README.md) §2.1 (the frame), §9 (engine and save; §9.1 is the whole of Tier 1,
    which D198 now splits: R1 takes the fight rows only);
  - D178–D179 in [decisions.md](../../decisions.md) (how H53 built v15's switch) and D192–D198.
- `git show 5dd9f08:docs/handoff/tasks/H53-engine-v15-foundation.md`: the packet this one mirrors.
- **The code** (lines on `421eacd`):
  - `packages/domain/src/rpg/battle/caps.ts` 12–34: the one switch (`BATTLE_ENGINE_VERSION` 15 at 25, `RPG_V2_ENGINE` 27,
    `rpgV2` 29) and its header (12–22), the pattern every rule follows.
  - `rpg/battle/types.ts` 118–126 `BattleInput` (the `version` union at 119), 161–177 `BattleState` (`engineVersion` 162).
  - `rpg/battle/engine.ts`: 1–12 the header; 38 `VERSIONS`; 117–135 `validAlly` (125 weapons by
    `validRpgWeapons(…, version)`, 129–131 `tree`, `legacy` and `validRpgTree`); 179 `MAX_FOES`; 180–198 `validateInput`.
  - `rpg/rules.ts`: 30–31 `RPG_WEAPON_SLOTS`; 66–70 `byGeneration`; 72–89 the slots (`SLOTS_V1`, `slotsOf`,
    `rpgClassSlots`, `RPG_CLASS_SLOTS`); 102–103 `rpgPicksWeapons`; 104–117 the default spreads; 118–126 `validRpgWeapons`
    (counts only, not positions); 162–186 `RpgHand`, `HANDS_V1`, `handsOf` (the Summoner's v2 hand 0.58 + 0.56 at 182).
  - `rpg/node-identity.ts` 10–11 `rpgClassWeapons` (Brawler five Arms, Mage five Tomes, the others all ten: CP12 already).
  - `economy/ranks.ts` 141–158: `WEAPON_EXP_SHARE` 5 and `weaponExpShares` (5E over her weapons, double for each used).
  - `save/battle.ts` 86–120: `setClassWeapons`, `holdWeapon` (104 `RPG_CLASS_SLOTS`, 108 `rpgPicksWeapons`).
  - `save/presets.ts` 48–53 `classPreset` (weapons from `rpgDefaultWeapons`, the Orb on the first weapon's kind).
  - `rpg/battle/v14-replays.fixture.ts` and `v14-replays.test.ts`: the frozen-fixture pattern (specs, `cueDigest`,
    `UPDATE_V14=1`); `git show 20343a4:packages/domain/src/rpg/battle/v14-replays-live15.test.ts` for the mocked twin
    (`vi.mock('./caps', …)` overriding the constant **and** the predicate, since a default parameter closes over the
    module's own constant).
  - `world/balance-party.ts` 45–52 `BALANCE_KIT_V2`, 76–118 `balanceMember`/`balanceParty`, 121–122 `balanceStage`;
    `rift/generate.ts` 171–174 `riftBattleInput`; `rift/fronts.ts` 37–49 (v2's guided classes).
  - `docs/render.ts` 90–95 `slots()` and 377–386 `ranks()` (prints `WEAPON_EXP_SHARE`): both read live values.
  - Every `Record<…>` keyed by engine version: `MAX_FOES` (engine 179). tsc names the rest once the unions grow.

## Decisions made

**The main session's R1 build decisions** (2026-10-25, for the owner, who prefers no open questions). Log them as one
D-row before this packet's own (step 9):
1. **One switch for R1.** R1 is engine v16 and save v27, built dark: every R1 rule sits behind `rpgRework('fight',
   engine)`, and the deployed game stays on engine v15 and save v26 until H72 flips `BATTLE_ENGINE_VERSION` to 16,
   `SAVE_SCHEMA_VERSION` to 27 and chains `toV27`, in one commit. v6–v15 fights replay exactly, pinned by the frozen v14
   and v15 fixtures, each also run with the switch mocked to 16.
2. **On today's gear.** R1 keeps crafted weapons and armor, Weapon, Armor and Accessory Ranks, Gear Marks, the two typed
   accessory slots (Damage: an Orb; Support: a Talisman or an Amulet), the ten supports, Star Gems and today's Extra Stats
   map. Nothing of R2 lands here (grades, the four families, Extra Stats v3, professions, the compensation), nor her moon
   and the signature accessory (R2), nor the signature tip (R4). The presets keep an Orb on her first slot's kind, which
   puts a hybrid's Orb on her lead half (SB10's rule, met by the slot order), and today's supports.
3. **The base MP regen stacks with the Spring and the Siphon in R1.** SB18 is a rule from v16; the supports retire with
   R2. A Spring Amulet's `mpRegen` and the base regen add in the same round-end step; H71 measures the stack, R2's balance
   packet (H81) re-measures without the supports.
4. **The calling from R1, its trade from R2.** The calling pick (CP29) sets her calling, her template's type, the class
   her Flourish works in and, at Uma Lv 1, her starting class and armor half. Her trade (PP2) and the "refused while she
   works" rule land with R2's professions (H77, H78).
5. **The template shows only what works in R1:** its chip and card (the three readings and the Flourish), the root
   plate's ★ Flourish, the Battle tab's Sustain row, the fight log's ★, the Racing tab's "Her template" and the Stable's
   Calling, Stride and Knack facets. R2 adds the signature, her moon, the trade and the Signature facet; R4 the tip.
6. **No group names in R1.** The owner's Heavy, Lite, Elemental and Arcane land with R4's class branches.
7. **Docs:** the manual describes the deployed game, so H64–H71 leave `docs/game/` and `pnpm docs:update` unchanged
   (except the architecture lines below) and each adds a "Built in H6x (D…), live from H72" line under R1's table in
   implementation.md §3. H71 writes its measured numbers into the design docs. H72 rewrites the manual.
8. **The work, in waves:** 1) H64 → 2) H65 trees, H66 weaknesses and shields, H67 the template and the calling → 3) H68
   the MP regen and the Flourish, H69 save v27 → 4) H70 the screens, H71 the balance → 5) H72 the switch. R2's H74 and
   H77 may start after H64 and run beside R1's waves 2–4.
9. **Balance is measured with explicit v16 inputs, never the switch** (H60's pattern); screens are previewed with a local
   switch that is never committed (H59's).

**This packet's decisions:**
- **The switch.** In `rpg/battle/caps.ts`, beside `rpgV2`:
  `export const RPG_REWORK_ENGINE = { fight: 16, economy: 17, t2Weapons: 18, t2Classes: 19, t3: 20 } as const`,
  `export type RpgReworkStage = keyof typeof RPG_REWORK_ENGINE` and
  `export const rpgRework = (stage: RpgReworkStage, engine: number = BATTLE_ENGINE_VERSION): boolean => engine >= RPG_REWORK_ENGINE[stage]`.
  `BATTLE_ENGINE_VERSION` stays **15**. The header comment gains the rework: "the Tier rework's five releases (D198) each
  open at their engine: `rpgRework(stage, engine)`, the same pattern". `engine.ts` re-exports `RPG_REWORK_ENGINE` and
  `rpgRework` with the rest.
- **The version unions gain 16 only** (`BattleInput['version']`, `BattleState['engineVersion']`); 17–20 come with their
  foundation packets. `VERSIONS` gains 16, `MAX_FOES[16] = 8`.
- **Class rules by generation, a third row.** Beside `byGeneration` (v1, v2) add one helper for "v2 or the rework's
  fight" (e.g. `byRework(v2, v16)` composed with `byGeneration`); every rule keeps its `engine` argument, defaulting to
  `BATTLE_ENGINE_VERSION`. The live tables (`RPG_CLASS_SLOTS`, `RPG_WEAPON_SLOTS` …) stay the live generation's:

  | Rule | ≤ v15 (today) | v16 (R1) |
  |---|---|---|
  | `rpgWeaponSlots(engine)` (new; `RPG_WEAPON_SLOTS` the live value) | 5 | **3** |
  | `rpgClassSlots(classId, engine)` | today's five | **Brawler** Arms ×3; **Mage** Tome ×3; **Spell Blade, Paladin** Arms, Arms, Tome; **Summoner, Cleric** Tome, Tome, Arms (CP2: the lead channel first) |
  | `rpgDefaultWeapons(classId, engine)` | today's spreads | **Brawler** Greatsword, Axe, Lance · **Mage** Fire, Blizzard, Thunder Tomes · **Spell Blade** Katana, Lance, Thunder Tome · **Summoner** Dark Tome, Light Tome, Bow · **Paladin** Greatsword, Axe, Light Tome · **Cleric** Light Tome, Blizzard Tome, Bow (CP3, in slot order) |
  | `validRpgWeapons(classId, weapons, engine)` | five, by count | **three different kinds of her class's trees, each in a slot of its channel, by position** (`weapons[i]` a Tome exactly when slot `i` is a Tome slot) |
  | `rpgPicksWeapons(classId, engine)` (gains `engine`) | the Brawler's and the Mage's fixed | **every class picks** (CP12: any three of her channel's kinds) |
  | `rpgHand(profile, engine)` | v2's | v2's, **the Summoner's Arms hand 0.48** (Tome 0.58, so her Tome still leads; SB11, CP9). H71 measures it and may move it |

  - **Why positions, not counts:** "the slot order is the lead channel first; the first slot leads the preset's
    accessories" (CP2, §3.1), and R4's signature tip reads her first slot (UT9). A fixed lead position makes "her first
    slot" always her lead channel. Swaps within a channel stay free.
  - **Why the Summoner's hand here:** it is a hand of the v16 generation, and H65–H68 build on it; H71 owns its final
    value (the band is in H71).
  - Leans, the HP projection (Guts), `rpgClassWeapons` and `RPG_CLASS_ARMOR` don't change.
- **Weapon EXP per weapon.** `weaponExpShares` pays **E a weapon she fights with** (double for each she used, as today):
  the total is `weapons.length` E, so five weapons pay today's 5E exactly and three pay 3E. `WEAPON_EXP_SHARE` becomes
  the live total (E × `RPG_WEAPON_SLOTS`, 5 until the switch), so the manual's `ranks` block doesn't move before H72.
  Why: R1 keeps Weapon Ranks (they gate today's grades), and 5E over three weapons would raise each 67% faster than today
  (pacing keeps today's order, README §2.1). R2 retires weapon ranks.
- **Engine v16 is accepted, dark.** From v16, `validAlly` also requires:
  - three weapons by `validRpgWeapons(a.classId, a.weapons, version)` (already passed the version);
  - `tree` empty: no side skills from v16 (CP14; H65 adds the branch picks);
  - `legacy` empty: legacy skills retire (CP31, tier2-classes A9).
  Everything else as v15 (six classes, one healer a party, no `orbs`). H65 adds branches, the equipped-slot count and
  Skill Ranks; H68 the base MP regen and the Flourish.
- **The rules call sites already pass the fight's version** (H53). Grep the engine, `limit.ts`, `skills.ts` and
  `auto.ts` once more for a rules call leaning on a default; add the version where one does.
- **v15 replays are pinned** by `rpg/battle/v15-replays.fixture.json`, generated on the engine **before** this packet's
  change (check out `421eacd` or regenerate first, then edit), with `v15-replays.fixture.ts` (`V15Replay`, `replayV15`,
  `loadV15Replays`, `regenerateV15Replays`, reusing v14's `cueDigest`). Eight v15 fights on Auto:
  - one world stage per Tier 1 continent (five): the v15 balance party on curve with inherited Limit Breaks
    (`balanceParty(level, { gear, stars, heroes, engine: 15 })`), the healer a Paladin in two of them and a Cleric in
    three, so both kits run (Barrier on every Uma, Aegis, Regen, drain);
  - a Rift Duel champion and a Rift Iron stage on `riftTuning(15)` (a third act, mixed locks, the ward);
  - **what R1 changes**, one fight whose party holds every node and Limit Break R1 moves: a Spell Blade with
    `spellblade-katana.3b`–`.5b` equipped (her Flurry line, Pierce's ids in v16), a Paladin with the spread Greatsword, Axe,
    Lance, Light Tome, Blizzard Tome and `paladin-lance.4b` (Valkyrie's Oath) and `paladin-tome-light.3b` equipped, a
    Summoner with an Axe summon equipped (renamed in v16), a Learner of `cleric-1` (Choir of Angels) and one of
    `paladin-3` (Rampart Charge). Pick the stage and seed so that a revive and both Limit Breaks fire; the coverage test
    asserts each.
  The fixture regenerates only with `UPDATE_V15=1` and its fights must say `version: 15`. Cues are digested without
  labels (presentation: v16 renames some nodes).
- **A shared mock for the switch.** `rpg/battle/caps-at.fixture.ts` (test-only, like the fixtures) exports
  `capsAt(version, caps)`: `caps` with `BATTLE_ENGINE_VERSION`, `rpgV2` and `rpgRework` all reading `version` as their
  default. A test file mocks the switch with
  `vi.mock('<path>/caps', async (orig) => (await import('<path>/caps-at.fixture')).capsAt(16, await orig()))`
  (a dynamic import, since `vi.mock` factories are hoisted above imports). H65–H71 use it for 16; R2 for 17.
- **No save change, nothing on screen.** `pnpm docs:update` leaves no diff: every live block reads live values.
- **Main JS:** the new tables sit in `rules.ts`, which the main bundle loads. Keep them as data; say the number (about
  201 KB gzip of 230 today).

## Do

1. **The fixture first:** on `421eacd`'s engine, write `v15-replays.fixture.ts` and generate
   `v15-replays.fixture.json` with `UPDATE_V15=1` (the eight fights above). Commit nothing yet; keep the JSON for step 7.
2. **`rpg/battle/caps.ts`:** `RPG_REWORK_ENGINE`, `RpgReworkStage`, `rpgRework`, each with a one-line comment; the header's
   new paragraph. `engine.ts` re-exports them and its header gains: "v16 the Tier rework's fight (D…), dark until H72:
   three weapons by channel, no side skills".
3. **`rpg/battle/types.ts`, `engine.ts`:** the unions, `VERSIONS`, `MAX_FOES`; v16's `validAlly` rules above. Doc comments:
   `tree` ("side skills to v15; empty from v16"), `legacy` ("retired from v16").
4. **`rpg/rules.ts`:** `rpgWeaponSlots`, the v16 rows of `rpgClassSlots`, `rpgDefaultWeapons`, `validRpgWeapons`
   (positions), `rpgPicksWeapons(classId, engine)`, `rpgHand`. Update the module header (five weapons → "five to v15,
   three from v16").
5. **`economy/ranks.ts`:** `weaponExpShares` on E a weapon; `WEAPON_EXP_SHARE` the live total.
6. **Call sites:** `save/battle.ts` 104–108 (`holdWeapon`) reads the live slots and `rpgPicksWeapons(classId)`; nothing
   else should need a change (`classPreset`, `classOf` and the parse read the live tables); `pnpm build` type-checks the rest.
7. **Tests:**
   - `rpg/rules-v16.test.ts`: each row of the table for v15 and v16 and all six classes; `rpgRework` per stage
     (`rpgRework('fight', 16)` true, `rpgRework('economy', 16)` false, every stage false at 15); a Brawler holding Bow,
     Katana, Axe is valid in v16, five Arms isn't; a Spell Blade holding Thunder Tome, Katana, Lance (Tome first) isn't; two
     of one kind isn't; v15 tables equal today's for all six classes; `weaponExpShares` with five weapons equals today's
     numbers exactly, with three unused weapons pays E each and a used one 2E of a 4E total.
   - `rpg/battle/engine-v16.test.ts`: a v16 input with one Uma of each class but one healer (three default weapons,
     cores only in her loadout, `tree: []`) plays two rounds on Auto; the same Umas with five weapons throw `Invalid battle
     ally` in v16, and with three in v15; a non-empty `tree` or `legacy` in v16 throws; a Paladin and a Cleric together
     still throw `Invalid battle party`.
   - `rpg/battle/v15-replays.test.ts` (live: asserts `BATTLE_ENGINE_VERSION` 15 and `rpgRework('fight')` false; every
     fixture fight replays byte for byte; a coverage case: all eight are `version: 15`, both healers, a Summoner pair and
     farewell, a Spell Blade pair, Regen and Revived heals, Barriers, locks, Breaks, warded hits, waves, a win, and the R1
     fight's nodes and Limit Breaks) and `v15-replays-live16.test.ts` (the switch mocked to 16 with `capsAt`: asserts
     `rpgRework('fight')` true, `RPG_CLASS_SLOTS.brawler` of length 3 and the Summoner's Arms hand 0.48, then replays
     **both** the v15 and the v14 fixtures byte for byte).
   - Every existing test passes unchanged, both v14 replay tests included.
8. **Docs:** `docs/game/architecture.md` line 43: "`battle/` (engine v15 …; v16, the Tier rework's fight, built behind
   `rpgRework`, live from H72 …)"; `docs/technical/architecture.md` line 69 the same; implementation.md §3 under R1's
   table: "Built: H64 (D…)". Run `pnpm docs:update`: no other diff.
9. **D-rows:** fetch `main` first; the next free numbers (D199 and D200 if `main` still ends at D198): the build decisions
   above, then this packet's.
10. **Check it locally** in a desktop browser at 390×844 (never the iOS Simulator; your own ports, per the master prompt),
    on a scratch save: a world-map stage on Auto plays as before and the open fight in `apps/api/.data/save.json` reads
    `"version": 15`; the Stable's Skills tab still shows five weapon slots and a Brawler's are fixed.

## Done when

- [ ] `pnpm lint && pnpm test && pnpm build` pass. Say the main JS number (gzip, of 230 KB).
- [ ] The tests in step 7 pass; the v14 and v15 replays pass live and with the switch mocked to 16.
- [ ] No rules call inside `rpg/battle/` relies on a default `engine` (grep the calls).
- [ ] `docs/game/` is unchanged apart from architecture.md line 43, `pnpm docs:update` leaves no diff, both D-rows are
  logged and implementation.md has its line.
- [ ] The local check in step 10 was done and described. Nothing from the original games in git (`git status`).
- [ ] Deployed green (`gh run watch <id> -R luismlorenzana/uma-rpg --exit-status`), and
  https://uma-rpg.web.app/api/health shows the commit in `build`.

## Deliver

- **Claude, as a delegated worker:** a pull request from `feat/h64-engine-v16-foundation` with one commit,
  `feat(domain): engine v16 foundation, the rework's switch and three weapon slots (H64)`; the body says why (dark, one
  switch a release, replays pinned). Fetch `main` before you push so the D-numbers are free. The main session reviews and
  merges it, then watches the deploy. Nothing on screen changes.
- **Flag it done:** after the merge, a `docs(handoff): H64 done (D…)` commit deletes this file, sets H64's State to Done
  in `docs/handoff/README.md` with the commit, adds a Done row, and sets H65, H66 and H67 (and R2's H74 and H77) to Ready.
