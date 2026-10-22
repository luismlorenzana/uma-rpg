# H44 — Engine v14: the Rift's foe traits (the ward, a third act, mixed locks)

**uma-rpg · Claude · M · Needs: nothing · Unblocks: H47 (the generator), H51 (balance)**

## Why

[The Rift](../../design/rift.md) (D161) asks three things of the engine that no foe can do today:
- **the ward (R5, §5):** on the Iron and Arcane fronts, damage from the wrong channel is halved again, on top of the
  unbroken halving, and still halved when the foe is Broken;
- **the Duel champion acts three times a round** (§5: "She acts twice, three times at the champion");
- **a Duel lock set is always mixed** (§5, Locks: "at least one Arms kind and one element").

The main session decided (2026-10-21, for the owner) that the Rift is built **before** classes v2, so these ship now as
**engine v14**. Each is an optional field on `BattleEnemy` that only the Rift's generator (H47) sets, so every campaign
fight on v14 plays exactly as on v13. Classes v2 moves to engine v15, and the Tier 2 docs' v15 to v16.

This packet also logs the main session's Rift build decisions (below), which the other seven packets (H45–H51) follow.

## Context (read first)

- `CLAUDE.md`, `AGENTS.md`, [change-protocol.md](../../change-protocol.md). Then [rift.md](../../design/rift.md) §5 and
  §12, [classes-v2.md](../../design/classes-v2.md) §3.1 (the guard rail) and §8, and D159–D167 in
  [decisions.md](../../decisions.md).
- The manual: [combat.md](../../game/combat.md) § Weaknesses, shields and Breaks, § Charged moves, § Foes and the
  `battle-constants` live block; [architecture.md](../../game/architecture.md) line 43 (`battle/ (engine v13 …)`).
- **`packages/domain/src/rpg/battle/types.ts`** (lines on `527f33a`):
  - `BattleEnemy` (85–103): `twice?: boolean` (92) is the model for an optional, versioned foe field;
  - `BattleInput.version` (105) and `BattleState.engineVersion` (148) are the union `6 | … | 13`.
  - Careful: `'ward'` is already a **status** (`RpgStatusKind`, a foe's "Ward: guard up" buff, `BATTLE_FOE_STATUS_STEP`).
    The new trait is a field on the foe, not a status. Name it so the two never mix in code or text (see Decisions).
- **`packages/domain/src/rpg/battle/engine.ts`:**
  - `BATTLE_ENGINE_VERSION = 13` (31), `VERSIONS` (32), `MAX_FOES` (164);
  - `validEnemy` (148–162): `element2` and `twice` show how a field is refused before its version;
  - `intentFor` (211–222) and `intentsFor` (241–246): a `twice` foe gets a second intent with `turn` 1, hashed
    `:turn1`; `rested` (219) keeps a foe from charging on any turn after her first;
  - `armCharges` (225–237): each lock is `kinds[hash(seed:round:id:lock k) % kinds.length]` over
    `[...weapons, ...elements]`;
  - `battleDamage` (280–315): the weak, status, Broken and `pierce` steps; `BATTLE_UNBROKEN_FACTOR` is applied at 308;
  - `strike` (491–521): the `hit` cue (501–502) carries `label: 'Intercepted'` when a guard takes it.
- **`packages/domain/src/rpg/battle/skills.ts`:** `BATTLE_UNBROKEN_FACTOR` (8) and `battleChannel` (32): a hit's channel
  is physical for an Arms kind and magical for an element (or no kind).
- **`packages/domain/src/rpg/battle/auto.ts`:** `score` (10–16) ranks a skill or Attack by power, weakness and reach.
  It doesn't know the ward yet.
- **Tests that pin v13:** `save/forge.test.ts:176` and `save/heroes.test.ts:95` (`expect(input.version).toBe(13)`);
  `engine.test.ts:573` builds a v13 fight on purpose (keep it).
- **The docs that number engines and saves after this one** (grep `v14`, `v15`, `v24` in `docs/design/`):
  `classes-v2.md` (9, 95, 308–317), `tier2-classes.md` (7, 43, 57, 63, 84, 96–97, 129, 278, 301, 363, 366, 455, 477,
  479, 496, 520, 534, 544, 546, 581, 592, 596, 642), `weapon-arts.md` (7–8, 37, 50, 69, 101–102, 349, 403, 411–420,
  513, 530, 552, 636, 674), `extra-stats-tier2.md` (46, 166, 343, 345), `tier2-world.md` (458, 467, 520), `rift.md`
  (96, 222), `tiers.md` (239), and this repo's `docs/handoff/README.md` ("Next, packets to write").
  - **Leave alone:** save-version history (`class-rework.md` "Save v14", `game/architecture.md` 162–164's v14–v16 save
    bullets) and `combat-balance.md:393` ("v13 or v14", a past plan).

## Decisions made

**The main session's Rift build decisions** (2026-10-21, for the owner, who prefers no open questions). Log them as one
D-row before this packet's own (step 7):
1. **The Rift's foe traits ship first, as engine v14** (this packet). Classes v2 becomes engine v15 and the Tier 2 docs'
   v15 becomes v16. Saves move one step too: save v24 is the Rift's (H46), so classes v2's save is v25 and the Tier 2
   docs' "first after v24" is "first after v25".
2. **The Rift runs on today's five classes** (no Paladin yet). Its party guidance, per front: Iron 2 Brawler, 2 Spell
   Blade and a Cleric; Arcane 2 Mage, 2 Summoner and a Cleric; Duel 2 Brawler, 2 Mage and a Cleric; Horde 2 Spell
   Blade, 2 Summoner and a Cleric. The fronts are retuned when classes v2 lands.
3. **Tier 2 is playable from Lv 1:** H43's Z3 (the foe budget restarts at the tier's Lv 1, its build part scaled to her
   lifetime stats; the hit-share ramp and "acts twice from Lv 10" by tier level) and Z8 (a region's tier from its
   continent) are built in H45, Tier 1 unchanged. The other Tier 2 calls (Q12–Q16) wait.
4. **The account's defeated faces** go in save v24 (H46), counted from Rift fights only.
5. **The Rift place** keeps the id `tier-finale`, is named "The Rift", opens when the tier's world has five Lv 50 Umas,
   and draws uma-art 2.11.0's `rift` frame (H49 pins 2.11.0, H50 wires it).
6. **Pay:** front and Convergence fights pay achievements only (no EXP, Laurels or Marks). Echoes pay 2× Class EXP and
   2× Weapon, Armor and Accessory Rank EXP for what she wears, no Uma EXP and no Laurels, and the existing Marks past
   the caps. Retries are free and unlimited, HP and MP are full every fight, and Sweeps clear won Echoes with Sweep
   Tickets.
7. **The work:** H44 engine v14 · H45 Tier 2 from Lv 1 · H46 save v24 · H47 the generator · H48 run rules and Ascend ·
   H49 achievements · H50 the Rift page and its art · H51 balance.

**This packet's decisions:**
- **Three optional `BattleEnemy` fields, v14 only** (refused on an older input, like `twice` before v7):
  - `ward?: BattleChannel`: the channel she wards. An ally's hit of that channel deals `BATTLE_WARD_FACTOR` (0.5) of its
    damage, Broken or not, `pierce` or not. With the unbroken ×0.5 a warded hit on a standing shield deals a quarter.
    In code and text call it "the ward" or `ward`; the existing foe buff stays the "Ward" status. The doc comment says so.
  - `thrice?: boolean`: she acts three times a round. Her third intent is `turn` 2, hashed `:turn2`, after every foe's
    second; like a second act it never starts a charge. `twice` and `thrice` together are refused.
  - `mixedLocks?: boolean`: when she is weak to at least one Arms kind and one element, her charged moves' locks
    alternate, an Arms kind first: lock k is drawn from her weapons when k is even and her elements when k is odd, with
    the same hash string as today. Weak to one channel only, she draws as today.
- **Only the ward changes damage**, only an ally's hit on a foe, and only in `battleDamage`, so previews
  (`previewTarget` applies the action) and the simulation see it with no extra code. A foe's hits are never warded.
- **A warded hit's cue** carries `label: 'Warded'` (unless a guard intercepted it, which keeps `'Intercepted'`). Cues are
  presentation only and never saved.
- **Auto knows the ward:** from v14, `score` multiplies a candidate by `1 − s × (1 − BATTLE_WARD_FACTOR)`, where `s` is
  the share of its hits' parts in the foe's warded channel. So a party prefers the right channel and still acts when it
  has only the wrong one.
- **New fights start on v14.** Nothing else changes: a campaign fight on v14 replays the same cues and units as on v13.
  v6–v13 fights, and an open one in a save, replay on their own engines.
- **No save change.** `BattleInput.version` 14 parses through the same replay check.

## Do

1. **`rpg/battle/types.ts`:** add `ward?: BattleChannel`, `thrice?: boolean` and `mixedLocks?: boolean` to `BattleEnemy`
   with doc comments ("v14 (D…): the Rift's …"); add 14 to `BattleInput.version` and `BattleState.engineVersion`; update
   the header comment (v14: the Rift's ward, a third act and mixed locks).
2. **`rpg/battle/skills.ts`:** `export const BATTLE_WARD_FACTOR = 0.5`, with a one-line comment.
3. **`rpg/battle/engine.ts`:**
   - `BATTLE_ENGINE_VERSION = 14`, `VERSIONS` and `MAX_FOES` gain 14 (8 foes);
   - `validEnemy`: `ward` only from v14 and only `'physical' | 'magical'`; `thrice` and `mixedLocks` only from v14 and
     boolean; `twice && thrice` refused;
   - `intentsFor`: after the second intents, a third (`intentFor(s, u, 2)`) for each `thrice` foe in the same order; a
     `thrice` foe also gets the second intent;
   - `armCharges`: the alternating draw for `mixedLocks` foes, as Decisions says;
   - `battleDamage`: after the unbroken step, `if (s.engineVersion >= 14 && foe && attacker.side === 'ally' &&
     foe.ward === channel) amount *= BATTLE_WARD_FACTOR`; return `warded: boolean` beside `amount` and `weak`;
   - `strike`: the `'Warded'` label;
   - the header comment: one line for v14.
4. **`rpg/battle/auto.ts`:** the ward term in `score` (v14 only; `battleFoe` already gives the enemy).
5. **Fix the tests that pin v13:** `forge.test.ts:176` and `heroes.test.ts:95` become `toBe(BATTLE_ENGINE_VERSION)`.
6. **New tests** in `engine.test.ts` (and `auto` cases where the file keeps them):
   - **the ward:** against the same foe with and without `ward: 'magical'`, a magical hit deals half (to within
     rounding) unbroken and half Broken; a physical hit is unchanged; a `pierce` skill is still warded; a foe's hit on an
     Uma is unchanged; the cue reads `'Warded'`;
   - **refusals:** a v13 input with `ward`, `thrice` or `mixedLocks` throws `Invalid battle enemy`; so do `ward: 'fire'`
     and `twice` with `thrice`;
   - **a third act:** a `thrice` foe has three intents a round, the third after every second one; a charged move is
     never started on her second or third turn;
   - **mixed locks:** weaknesses `{ weapons: ['axe'], elements: ['fire'] }` and a charge of 3 give locks
     `['axe', 'fire', 'axe']`; weapons only draws as before;
   - **Auto:** with a choice of equal raw score in each channel, Auto picks the unwarded one on a warded foe and either
     on an unwarded one;
   - **v14 is v13 for the campaign:** one region stage per continent (`regionChapter(worldContinent(...))`, the
     balance party on Auto) played as version 13 and as 14 gives the same cue list and the same final units.
7. **Docs:**
   - **Renumber the later engines and saves** in the Context list. Do it in this order so nothing moves twice:
     every engine `v15` → `v16`; then every `v14` that names classes v2's engine → `v15`; every "save v24", "v24" as
     classes v2's save, and "first after v24" → `v25`; replay ranges ("v6–v13", "v6–v14") move up one where they speak
     of classes v2 or later. Then rewrite the ward's lines:
     - `rift.md` §5 (96): "It's a foe trait in engine v14 (H44, D…), shipped ahead of classes v2 (engine v15)"; §10's
       row: "The ward, a third act and mixed locks (engine v14, H44)" and a separate "Classes v2 (engine v15)" row;
     - `classes-v2.md` §8: "Engine v15 carries", drop the ward bullet and add "The Rift's ward shipped first, in engine
       v14 (H44)"; "Old fights replay: v6–v14 fights"; "Save (v25, after the Rift's v24)";
     - `tiers.md` §8 item 3: "(engine v15)";
     - `docs/handoff/README.md` "Next, packets to write": "Classes v2, engine v15 (C1–C7 …)", without "the ward".
     - Check with `grep -n "v14\|v15\|v16\|v24\|v25" docs/design/*.md` that every hit reads right.
   - **The manual:** `combat.md`: under § Weaknesses, shields and Breaks a "**The ward (v14, the Rift):**" bullet; under
     § Charged moves, mixed locks; under § Foes, "acts three times"; line 3 "engine v14"; add `BATTLE_WARD_FACTOR` to
     `battleConstants` in `docs/render.ts`. `architecture.md` 43: "engine v14". `docs/technical/architecture.md` line 3:
     "engine v14".
   - Run `pnpm docs:update`.
   - **Log two D-decisions** (fetch `main` first; the next free numbers, D168 and D169 if `main` still ends at D167):
     the main session's Rift build decisions (the seven points above), then engine v14 (this packet's decisions).
8. **Check it locally** (`.claude/launch.json`: `rpg-api` :8081, `rpg-web` :5174), 390×844 in a desktop browser, never
   the iOS Simulator: start a world-map stage, play it on Auto to the end, and see it play as before. The stored fight
   in `apps/api/.data/save.json` reads `"version": 14` while it's open.

## Done when

- [ ] `pnpm lint && pnpm test && pnpm build` pass. The build prints the main JS under 230 KB gzip (D56); the engine is
  lazy, so the number shouldn't move (it's about 224 KB now). Say the number in the delivery.
- [ ] The tests in step 6 pass, and every existing replay test passes unchanged.
- [ ] No test pins 13 as the current engine (grep `toBe(13)`, `version: 13` outside deliberate v13 fixtures).
- [ ] The renumbering grep in step 7 reads right, and the historical v14–v16 save mentions are untouched.
- [ ] `docs/game/` is in step, `pnpm docs:update` leaves no diff, and both D-decisions are logged.
- [ ] The local check in step 8 was done and described.
- [ ] Deployed green (`gh run watch <id> -R luismlorenzana/uma-rpg --exit-status`), and
  https://uma-rpg.web.app/api/health shows the commit in `build`.

## Deliver

- **Claude:** commit to `main` as `feat(domain): engine v14, the Rift's ward, third act and mixed locks (H44)`, push,
  and watch the deploy. Nothing on screen changes; nothing at the screen's edges.
- **Flag it done:** delete this file, set H44's State to Done in `docs/handoff/README.md`, and add a Done row with the
  commit.
