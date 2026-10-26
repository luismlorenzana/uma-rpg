# H83 — Engine v18 foundation and the weapon branches: Pure or Dual at G5, the partner table, the two-kind cap (dark)

**uma-rpg · Claude · L · Needs: H82 (Release 2 live) · Unblocks: H84, H85, H87, H89 (and through them H88, H90)**

> **Versions re-planned by D221 (2026-10-26):** save v29 is taken (the owner's "grant is tickets only" step, live). Read
> this packet's save v29 as **v30**, v30 as **v31** and v31 as **v32**; engines unchanged.

## Why

Release 3 of the Tier rework ([implementation.md](../../design/tier-rework/implementation.md), D198) is **Tier 2's
weapons**: engine v18 and save v29, built dark and turned on by H90. Every R3 packet needs things that don't exist yet:
- the **`t2Weapons` stage** accepted by the engine, with v6–v17 fights proven to replay exactly whatever the switch says;
- **a weapon branch** on each weapon from Tier 2's G5 ([weapon-progression.md](../../design/tier-rework/weapon-progression.md)
  WP6, WP7): **Pure** (its weak hits ×1.5) or **Dual** (its fixed partner, of its own channel and the other weapon group,
  for weaknesses and locks only), so the engine's one `BATTLE_WEAK` becomes **a weak multiplier per weapon**;
- **the partner table** (WP32), **the two-kind cap** (WP8) and the rule that her slotted kinds stay all different,
  partners included;
- **the Branch Gem** (WP10): the item her G5 step takes from Tier 2, and **re-forging** (WP11);
- **the coverage check's Tier 2 run** (WP12): the default party answers a Tier 2 regular 2.0 times with best picks.

This packet builds them and nothing a player sees. It also logs Release 3's build decisions, which H84–H90 follow.

## Context (read first)

Code pointers are by file and function: Releases 1 and 2 move the lines. Re-read the code before starting.

- `CLAUDE.md`, `AGENTS.md`, [change-protocol.md](../../change-protocol.md). The plan:
  [implementation.md](../../design/tier-rework/implementation.md) §1–§4 (R3's scope, the conventions, "Between
  releases") and D192–D198 in [decisions.md](../../decisions.md).
- The design (precedence: uma-templates.md > stat-balance.md > the four standalone docs > README):
  - [weapon-progression.md](../../design/tier-rework/weapon-progression.md) §2.4 (WP31, the damage stack: step 3 reads
    **both** kinds, every other step the hit's own), §3.2 (WP6, WP7, **the partner table WP32**), §3.3 (Tier 3, for what
    R3 must not build yet), §3.4 (WP8, the legal Duals by class), §3.5, §3.6 (WP12, coverage), §3.7, §3.9 (WP13), §3.10
    (WP11), §6.1 and §6.4 (WP10, the Branch Gem and its id), §11 (save), §12 (engine);
  - [class-progression.md](../../design/tier-rework/class-progression.md) §3.3 (CP12), §3.5 (CP33), §4.4 (CP8, shields by
    answers), §4.5 (CP4's checks);
  - [README.md](../../design/tier-rework/README.md) §9.2 (engine v17 as drafted: R3's rows are now v18's, R4's v19's);
  - [stat-balance.md](../../design/tier-rework/stat-balance.md) §3.4 (the toolbox by piece) and §10 (answers hold, chips
    don't).
- **Releases 1 and 2's packets and D-rows** (read them in `docs/handoff/` and `decisions.md`): H64 (`rpgRework`, the
  replay pattern, `capsAt`), H66 (the coverage checks in `world/coverage-v16.test.ts`, twin weaknesses,
  `rpgFoeShields`), H74 (gear grades per weapon kind, the Uma Lv 5g − 4 gate, the upgrade rule), H75 (the accessory
  fields in the input, the Bell's follow-up), H77 (made-item ids, the Forge's catalog and the ladder by tier), H82 (the
  switch to v17). Where this packet names a shape R2 introduced, use it as R2 built it.
- How a foundation was done last time: `git show 5dd9f08:docs/handoff/tasks/H53-engine-v15-foundation.md`.
- **The code:**
  - `packages/domain/src/rpg/battle/caps.ts`: `BATTLE_ENGINE_VERSION` (17 after H82), `RPG_REWORK_ENGINE`
    (`t2Weapons: 18`), `rpgRework(stage, engine)`, and the header comment on the one-switch pattern.
  - `rpg/battle/engine.ts`: `VERSIONS`, `MAX_FOES`, `validAlly`, `validateInput`; `battleHitIsWeak`; `battleDamage` (the
    `weak` line, `BATTLE_WEAK`, `HitOptions`); `strike` (the chip and the `popLocks` call); `popLocks`, `chip`.
  - `rpg/battle/skills.ts` (`BATTLE_WEAK`), `limit.ts` (`heroPlan`, `battleLimitPlan`: where a Limit Break's hits are
    struck), `auto.ts` (the weak premium in its skill score), `types.ts` (`BattleAlly`, the version unions in
    `BattleInput` and `BattleState`).
  - `rpg/kinds.ts` (`RPG_WEAPONS`, `RpgWeapon`, `RpgDamageKind`, Arms and Tomes); `rpg/rules.ts` (`validRpgWeapons`,
    `rpgClassSlots`, the hands).
  - The gear rules H74 wrote (the function that raises a weapon kind a grade with a Weapon Gem, its gate and refusals)
    and the Forge's made-item catalog H77 wrote (the Weapon Gem's grades and recipes by tier).
  - `save/battle.ts`: `setClassWeapons`, `holdWeapon`, `partyMembers` (builds `BattleAlly` from her save);
    `save/sheet.ts` `umaBattleSheet`.
  - The replay fixtures and their tests (`rpg/battle/v14-replays*`, and the ones H64 and H82 froze: H82 freezes v16's just before R2's flip);
    `rpg/battle/caps-at.fixture.ts` (H64's `capsAt(version, caps)`: how a test mocks the switch).

## Decisions made

**Release 3's build decisions** (the main session, 2026-10-25, for the owner, who prefers no open questions). Log them
as one D-row before this packet's own (step 10):
1. **One switch, one stage.** R3 is engine v18 and save v29 under the stage `t2Weapons` (`RPG_REWORK_ENGINE.t2Weapons
   = 18`, H64). Every R3 rule reads `rpgRework('t2Weapons', engine)`: the engine with the fight's version; rules outside
   the engine with `engine = BATTLE_ENGINE_VERSION`; non-fight rules (the Forge's G5, the secondary, the Observatory)
   with the live default. H90 flips `BATTLE_ENGINE_VERSION` 17 → 18, `SAVE_SCHEMA_VERSION` 28 → 29 and chains `toV29`
   in one commit. v6–v17 fights replay exactly (this packet's v17 fixture).
2. **Where R3 applies.** Tier 1 worlds don't change: a line of grades, one accessory slot, no weapon moon, no
   secondary. Tier 2 worlds get all of it. **Tier 3 worlds play Tier 2's shape until R5**: Pure or Dual at G5 (a weapon
   that arrived with a branch keeps it and may switch at its G5 step), one two-kind weapon, two accessory slots with
   Tier 2's branches at Tier 2's shares × 2.6, one weapon moon at Tier 3's values, the secondary's base work only.
   Why: D198's between-releases rule (a later tier plays the live shape × tier, SB1); R5 brings Keen, Tempered,
   Evolved, the third slot and its step, the second moon and the secondary's Tier 2 reach.
3. **Weaknesses stay R1's twins in every tier until R4** (H93). Between R3 and R4 a Tier 2 regular is answered about as
   often as a boss (3.5 times by the default party with best Duals, WP12's boss figure) instead of the design's 2.0.
   Kept: the narrowing is R4's with its share of the term. **Tier 2's shields move with the Duals, by CP8's own rule**
   (a shield grows with the answers its foe's list gets): H89's `rpgTierShield` starts v18's Tier 2 (and Tier 3) worlds
   at CP8's Tier 2 numbers, every regular-rank foe Tier 1's + 1, sub-bosses 7, **bosses 9** (SB6's boss 9 lands here,
   not in R4: the Duals that raise a boss's answers arrive here), and holds rounds to the first Break within ±0.5 of
   Tier 1's; R4's H93 writes v19's row and re-measures with the narrowing. Why not move the narrowing here: it would
   pull R4's weaknesses and the narrowing's part of the term into R3.
4. **Tier 2's term, this half.** SB3's +27% on HP and DEF, its +10% offense and SB5's bosses ×1.1 price R3's and R4's
   tools together. **R3 ships the weapons' share: a term on the foes' HP and DEF only** (H89's `rpgTierTerm`, v18's
   row), its slope set by H89's measurement (stat-balance §3.4's split at Tier 2's Lv 50: weapon branches ×1.05,
   accessories ×1.13, weapon moons ×1.14, about ×1.35 an act, against R4's focus ×1.12 and narrowing ×0.94, which net
   ×1.05: so R3's share is most of SB3's +27%). The offense +10% (it prices the healers' focus) and bosses ×1.1 (they
   price the narrowing that spares bosses) are R4's; H93 writes v19's row and H96 measures it.
   Tier 3 worlds take Tier 2's formula at their tier level until R5's SB4 (a start factor only if H89 measures a need).
5. **The Branch Gem replaces the G5 Weapon Gem in Tier 2+ worlds** (WP10; PP10: "the Branch Gem is the G5 Weapon Gem in
   its tier's metal and wood", 4 refined; id `branch-gem`, H77's). Save v29 (H87) converts stocked `weapon-gem-g5` and
   running or queued G5 jobs in Tier 2+ worlds one for one, and gives **one Branch Gem for every weapon kind an Uma
   raised to G5 or above during R2** (it took a G5 Weapon Gem; the Branch Gem is her branch pick, made on the weapon's
   sheet). Why: the same item under its new name; no grade is lost and no branch is forced on her.
6. **The loadout rule holds in every class she has set up.** The two-kind cap and "her slotted kinds all different,
   partners included" (WP7, WP8) are checked when a branch is picked or re-forged and when a weapon is slotted, for
   every class in `classes`; the parse (H87) and the engine enforce them as backstops. Why: a weapon's grade and branch
   are shared by every class that slots it (WP2), so checking only her active class could leave another loadout illegal.
7. **Save shapes (v29, H87).** Per weapon kind `{ grade, branch?: 'pure' | 'dual' }`, no partner stored (WP32); one
   accessory slot in Tier 1, two in Tier 2+; an accessory's `form` adds `'great' | 'channel' | 'twin' | 'toll' |
   'onslaught'`, `kind` holds one kind (a Twin Orb's twin set by its element), and **`kinds: [a, b]`** holds a Channel
   Pendant's two kinds of one channel (WP §11's "channel in `kind`" can't name two of a pure class's three);
   `stars.moons` stays empty until she sets her weapon moon, **an empty list reading her class's preset** (EP29), so the
   migration needs neither her class nor master data; `weapon-moon-1:1–5` in `stars.open`; `OwnedUma.secondary`
   absent until picked.
8. **Promotion (Ascend) from R3** carries weapon branches with every grade back to G0 (WP11); the new world's accessory
   slots start at G0 in base forms (a branch form needs its slot's G5, WP34); her weapon moon reads the new tier's
   preset; she arrives with no secondary (PP23). Built in H87.
9. **Screens inert until H90** (H88), previewed with a local switch never committed: `caps.ts` `BATTLE_ENGINE_VERSION
   = 18`, `save.ts` `SAVE_SCHEMA_VERSION = 29`, `migrations.ts` chaining `toV29` (`version < 29`). No uma-kit change and
   no new art (WP29: a branch shows its family's icon; the Branch Gem's icon is H73's).
10. **Names** (WP28, EP22): Pure, Dual, partner, Branch Gem, re-forge; Great, Channel Pendant, Twin Orb, Toll Bell,
    Onslaught Insignia; weapon moon, Full, Split; secondary. No screen names Keen, Tempered or Evolved before R5.
11. **Docs:** the manual (`docs/game/`) describes the deployed game, so dark packets leave it and `pnpm docs:update`
    unchanged and add "Built in H8x (D…), live from H90" lines to the design docs; H90 rewrites the manual.
12. **The work in waves:** 1) H83, H86 → 2) H84, H85 → 3) H87, H89 → 4) H88 → 5) H90. H89 also needs H86 (it measures a
    Tier 2 run of twenty with the secondary).
13. **Armor halves per piece, from Tier 2** (WP14: "her class's half in Tier 1, per piece for the four between from
    Tier 2"; added by the main session, 2026-10-25, since R2 kept her class's half in every tier). In a Tier 2+ world
    a Spell Blade, Summoner, Paladin or Cleric picks each piece's half; a Brawler's stay physical and a Mage's magical.
    The half sets only the piece shown and its offense (⌈g ÷ 2⌉ × tier, ATK or M.ATK); every defensive stat stays the
    slot's, so a change never trades defense. Her default: her class's half on every piece (R2's rule), so nothing
    moves until she picks. Free and instant outside fights, like a tree line. H83 builds the rule and the input
    (`armorOffense` by piece), H87 stores `armor[slot].half?`, H88 draws the picker.

**This packet's decisions:**
- **Engine v18 accepted, dark.** `VERSIONS`, `MAX_FOES` and the version unions gain 18 (8 foes). The engine's header
  comment gains one line: "v18 Tier 2's weapons (D…), dark until H90: weapon branches, the partner table, the two-kind
  cap; H84's accessory branches and H85's weapon moon".
- **`rpg/weapon-branches.ts`, new, data only** (main-bundle safe, no engine import; the screens read it):
  - `RPG_WEAPON_BRANCHES = ['pure', 'dual'] as const`, `RpgWeaponBranch`.
  - `RPG_PARTNERS: Record<RpgWeapon, { t2: RpgWeapon; t3: RpgWeapon }>`, WP32 exactly: Greatsword Bow · Katana; Axe
    Bow · Katana; Lance Katana · Bow; Bow Greatsword · Lance; Katana Axe · Lance; Fire Tome Dark · Light; Blizzard Tome
    Light · Dark; Thunder Tome Light · Dark; Light Tome Fire · Lightning; Dark Tome Ice · Lightning (Tomes as their
    weapon ids). Both columns now (one call, one table); **only `t2` is read until R5**.
  - `rpgPartnerOf(weapon)`: the Tier 2 partner (a Dual's), the only one R3 reads.
  - `rpgWeakMultiplier(branch: RpgWeaponBranch | null, engine)`: ≤ v17 1.3 for everything; from v18 **base 1.3, Pure
    1.5, Dual 1.3** (WP6). `BATTLE_WEAK` (1.3) stays the base and the Limit Break's.
  - `rpgTwoKindCap(classId, tier, engine)`: ≤ v17 0; from v18 **0 in Tier 1, 1 from Tier 2** (Tier 3 included until
    R5, which gives the four between 2 there).
  - `rpgDualBlock(loadouts, weapon, tier, engine)`: the refusal text for making `weapon` Dual against every set-up
    class's slots, or null: "Tier 1 weapons don't branch"; "One two-kind weapon in her slots in Tier 2" (WP §3.4's
    words; "in Tier 3" there); "Her Spell Blade slots the Katana, the Lance's partner" (class label, partner, weapon).
    A slotting check of the same shape, `rpgSlotBlock(weapons, branches, classId, tier, engine)`.
  - `rpgBranchName(weapon, branch)`: "Pure Greatsword", "Dual Lance + Katana"; Tomes by element ("Pure Fire", "Dual
    Ice + Light"), WP §3.5's names.
- **`BattleAlly.branches?: Partial<Record<RpgWeapon, RpgWeaponBranch>>`** (v18). Validation in `validAlly` (refuse
  with `RangeError('Invalid battle ally')`): any `branches` before v18; a branch on a Tier 1 ally; a branch on a weapon
  she doesn't slot; more Duals than `rpgTwoKindCap`; a Dual whose partner she slots. v6–v17 validation is unchanged.
- **A weak multiplier per weapon** (WP6, WP7, WP31 step 3), from v18 in `battleDamage`:
  - a hit made with one of her weapons (an Attack, a skill or summon of its tree, a Bell's follow-up: whatever H75
    strikes through her weapon) reads **that weapon's** branch: the ally's slotted weapon whose kind is the part's
    kind (her kinds are all different, partners included, so it is unique);
  - **Limit Breaks keep ×1.3 and no partner** (WP §3.10): `HitOptions.limit` (new, set from v18 on every Limit Break
    hit, a Hero's or a Learner's) skips the branch;
  - **a Dual's hit is weak when its kind or its partner's kind is on the foe's lists** (Hex's Light and Dark rule counts
    for either), and lands ×1.3; a Pure hit's own kind only, ×1.5;
  - foes' hits and every hit before v18 read today's code path (`BATTLE_WEAK`), byte for byte.
- **Shields and locks with a partner** (WP7: "one shield point and one lock a hit, whichever of its kinds matched,
  never two for one hit"): a weak part removes one shield point (two with a Breaker charge, as today); `popLocks` from
  v18 breaks **at most one** lock a part: its own kind's if the charge holds one, else its partner's. Before v18 it
  keeps breaking one lock per kind passed (the v11–v14 Orb path).
- **Every bonus reads the hit's own kind** (WP13): Might, flat accessory offense and the weapon moon (H85) stay keyed by
  the part's kind; the partner never earns one. No change needed beyond not passing the partner to them.
- **Auto:** its weak test asks one shared helper (`battleWeakFor(state, ally, foe, kind)`, exported from the engine,
  partner-aware, used by `battleDamage` too), and a Pure weapon's premium scales by its multiplier (×1.6 × 1.5 ÷ 1.3),
  so Auto aims a Dual at its partner's foes and leans on a Pure weapon's weak hits.
- **The Branch Gem and the G5 step** (WP10, WP11), rules outside the engine, live default, dark:
  - **The Forge** in a Tier 2 or 3 world makes `branch-gem` at grade 5 instead of `weapon-gem-g5`, from the stage: the
    same recipe by the ladder (Tier 2: 2 Gold Ingot, 2 Cherry Plank; Tier 3: 2 Mythril Ingot, 2 Elderwood Plank), Craft
    Lv 21. Tier 1 unchanged. Who may make it is H86's gate (PP15: the main trade's).
  - **The G4 → G5 step** of a weapon in a Tier 2+ world takes one `branch-gem` and a branch: the upgrade function H74
    wrote gains a `branch` argument, required at G5 from the stage ("Pick Pure or Dual"); G6–G10 take Weapon Gems as
    before. "Up to G7" stops at G5 for the pick.
  - **`reforgeWeapon(save, outfitId, weapon, branch, now, tier)`**: one Branch Gem changes Pure ↔ Dual, the grade
    kept; it also gives a branch to a weapon at G5 or above that has none (one raised during R2). Refused: "No Branch
    Gem in the Warehouse", "Tier 1 weapons don't branch", "Below G5" (a Tier 2 weapon below its G5 has no branch to
    change), the `rpgDualBlock` texts, "Already Pure".
  - **A weapon that arrived in Tier 3 with a branch** (H87's Ascend) keeps it from G0; its G5 step takes a Branch Gem
    and keeps the branch or switches it (the same pick). R5 replaces this step with Keen, Tempered or Evolved.
  - **Slotting** (`setClassWeapons`, `holdWeapon`): refused with `rpgSlotBlock`'s text when a set would break the cap
    or the partner rule.
  - All of these read `rpgRework('t2Weapons')` (live default), so the live game refuses nothing new and changes nothing.
- **The input:** `partyMembers` (and every other builder of `BattleAlly`: the Rift's, the balance harness's) writes
  `branches` from her stored branches when the fight's engine is v18; H87 adds the stored field, so until then the
  builder reads an optional `branch` on her weapon entries and tests construct it.
- **The coverage check's Tier 2 run** (WP12), `world/coverage-v18.test.ts` beside H66's `world/coverage-v16.test.ts`
  (always on, counts only; R4's H93 adds CP41's pairings in `world/coverage-t2.test.ts`): the default party (Brawler, Mage,
  Spell Blade, Summoner and a Cleric, then a Paladin) on the owner's defaults, Tier 2 regulars weak to one kind of their
  twins by role (CP6), bosses their twins, the 48 signatures' weights, **best picks** (each member's one legal Dual
  chosen for the most answers a regular, then every kind with two holders). Expected: **2.00 answers a regular with a
  Cleric, 2.03 with a Paladin; bosses 3.53 and 3.49; every kind held twice with a Cleric**; the best Duals are §3.6's
  (Brawler Lance + Katana, Mage Fire + Dark, Spell Blade Katana + Axe, Summoner Bow + Greatsword, Cleric Light + Fire).
  It also **prints R3's interim** (Tier 2 regulars still twin-weak until R4) for H89. Tier 3's 2.30 is R5's (it needs
  Tempered and Evolved).
- **v17 replays pinned:** `rpg/battle/v17-replays.fixture.json`, regenerated only with `UPDATE_V17=1`, every input
  `version: 17`: one world stage per Tier 1 continent with R2's on-curve party (a Bell and an Insignia among its
  accessories, so their rules run, and an inherited Limit Break), one Tier 2 world stage (`w6`), one Rift Duel stage
  (the ward, a third act, mixed locks). Generate it on the engine **before** this packet's change (as H64 did for v15),
  with `v17-replays.fixture.ts` (the spec, the cue digest, the replay helper) in H64's pattern: each cue's kind, actor,
  target, amount, channel, element and weak flag, in order, no labels, and the final `battleStateHash`.
- **No save change, nothing on screen.** `pnpm docs:update` leaves no diff.
- **Main JS:** `weapon-branches.ts` sits in the main bundle (the Gear tab reads it later); keep it data. Say the number.

## Do

1. **The fixture first:** on `main`'s engine (v17 live, before any change here), write `v17-replays.fixture.ts` and
   generate `v17-replays.fixture.json` with `UPDATE_V17=1`. Keep it for step 7.
   Then **`rpg/battle/caps.ts`, `engine.ts`, `types.ts`:** v18 accepted (the unions, `VERSIONS`, `MAX_FOES`, the header
   line).
2. **`rpg/weapon-branches.ts`** as decided, with doc comments citing WP6–WP8, WP32; export it from the rules index.
3. **The engine:** `BattleAlly.branches` and its validation; `battleWeakFor`; the per-weapon multiplier and the partner
   in `battleDamage`; `HitOptions.limit` set on every Limit Break hit in `limit.ts`'s path; `popLocks` once a part from
   v18; Auto's premium. Every rules call passes the fight's version.
4. **The gear rules:** the Forge's G5 item by tier, the G5 step with its branch, `reforgeWeapon`, the slotting checks,
   all behind the stage.
5. **The input builders:** `branches` from v18 in `partyMembers`, the Rift's and the balance harness's builders.
6. **The coverage check's Tier 2 run** as decided.
6a. **Armor halves per piece** (decision 13): the rule beside R2's armor values, the input builders' offense by
   piece, tests that a half change moves only ATK or M.ATK and never DEF, M.DEF, HP, MP or evasion, and that a
   Brawler or a Mage can't pick.
7. **The v17 fixture's two tests** on the fixture from step 1.
8. **Tests:**
   - `rpg/weapon-branches.test.ts`: all ten partner rows, both columns; every partner of its weapon's channel and of the
     other group (CP38's Ring and Light/Dark); WP §3.4's table (every class's default set: its listed legal Duals pass
     `rpgDualBlock`, e.g. a Spell Blade's Katana + Axe and Thunder + Light; her Lance refused with "… the Lance's
     partner"); the cap by tier, class and engine (0 everywhere at v17); `rpgWeakMultiplier`; `rpgBranchName`.
   - `rpg/battle/engine-v18.test.ts` (inputs at `version: 18`): on one fixed state, a Pure weapon's weak hit is the base
     weapon's same hit × 1.5 ÷ 1.3 (rounded as the engine rounds); a Dual Lance's hit on a Katana-weak foe is weak at
     ×1.3 and removes one shield point; on a foe weak to both its kinds it still removes one; a charge holding a Lance
     lock and a Katana lock loses only the Lance lock to one Dual Lance part, and a charge holding only the Katana lock
     loses it; a Limit Break hit of a Pure weapon's kind lands ×1.3; Auto aims a Dual Lance at the Katana-weak foe of
     two; refusals: `branches` in a v17 input, a branch on a Tier 1 ally, a branch on an unslotted weapon, two Duals in
     Tier 2, a Dual Lance beside a slotted Katana.
   - `rpg/battle/v17-replays.test.ts` (live: `rpgRework('t2Weapons')` false; every fight replays byte for byte; every
     input is `version: 17`) and `v17-replays-live18.test.ts` (the switch mocked to 18 with `capsAt`: asserts
     `rpgRework('t2Weapons')` true, then replays the v17 fixture **and every earlier one** byte for byte).
   - `save/branches-v18.test.ts` (the switch mocked to 18 with H64's `capsAt`): the G5 step with a Branch Gem and
     Pure; without a pick refused; Dual refused by the cap and by the partner rule in another set-up class;
     re-forge Pure → Dual keeps G7 and spends one gem; a G7 weapon with no branch takes one; a Tier 1 world refuses; a
     Tier 2 Forge offers `branch-gem` at G5 and no `weapon-gem-g5`; a Tier 3 weapon carrying Pure keeps it at G5 or
     switches. Unmocked, the same calls change nothing (the live game).
   - `world/coverage-v18.test.ts`: the expected figures above within ±0.02, and the five best Duals.
   - Every existing test passes unchanged.
9. **No rules call inside `rpg/battle/` relies on a default `engine`** (grep the calls you added).
10. **Docs:** log two D-rows (fetch `main` first; the next free numbers): Release 3's build decisions above, then this
    packet's. weapon-progression §3.2 and §3.4 gain "Built in H83 (D…), live from H90."; class-progression §3.3 (CP12,
    CP33) the same. `pnpm docs:update`: no diff.
11. **Check it locally** in a desktop browser at 390×844 (never the iOS Simulator; your own ports, per the master
    prompt), on a scratch save from the CJS build: a Tier 1 world-map stage and a Tier 2 (`w6`) stage on Auto play as
    before and the open fight in `apps/api/.data/save.json` reads `"version": 17`; the Gear tab and the Forge look as
    before.

## Done when

- [ ] `pnpm lint && pnpm test && pnpm build` pass. Say the main JS number (gzip, of 230 KB).
- [ ] The tests in step 8 pass, both v17 replay tests and every earlier replay test included.
- [ ] No rules call inside `rpg/battle/` relies on a default `engine`.
- [ ] `docs/game/` is unchanged, `pnpm docs:update` leaves no diff, both D-rows are logged, the design docs have their
  lines.
- [ ] The local check in step 11 was done at 390×844 on a scratch save and described. Nothing from the original games in
  git (`git status`).
- [ ] Deployed green (`gh run watch <id> -R luismlorenzana/uma-rpg --exit-status`), and
  https://uma-rpg.web.app/api/health shows the commit in `build`.

## Deliver

- **Claude, as a delegated worker:** a pull request from `feat/h83-engine-v18-weapon-branches` with one commit,
  `feat(domain): engine v18 foundation and weapon branches, dark (H83)`; the body says why (dark, one stage, v17
  replays pinned). Fetch `main` before you push so the D-numbers are free. The main session reviews and merges it, then
  watches the deploy. Nothing on screen changes; nothing at the screen's edges.
- **Flag it done:** after the merge, a `docs(handoff): H83 done (D…)` commit deletes this file, sets H83's State to
  Done in `docs/handoff/README.md` with the commit, adds a Done row, and sets H84 and H85 to Ready (H87 and H89 when
  their other needs are done).
