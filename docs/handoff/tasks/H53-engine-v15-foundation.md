# H53 — Engine v15 foundation: the Paladin, the one switch and class rules by generation (dark)

**uma-rpg · Claude · M · Needs: nothing · Unblocks: H55, H56, H57, H58 (and through them H59–H61)**

## Why

[Classes v2](../../design/classes-v2.md) (D160) is engine v15 and save v25. The owner's main session decided it ships as
**one switch**: every v2 rule lands dark, behind the engine version, and one packet (H61) turns it on with save v25 and
the Paladin on screen. Every packet after this one needs four things that don't exist yet:
- the Paladin as a class id the engine, the catalog and the type system know, while the game's lists don't show her;
- **one place** that says which generation is live, read by the engine (lazy) and by the main bundle's rules;
- class rules (slots, spreads, leans, HP, hands) that answer **per generation**;
- proof that v6–v14 fights replay exactly whatever that switch says.

This packet builds them and nothing a player sees. It also logs the main session's classes v2 build decisions, which
H54–H61 follow.

## Context (read first)

- `CLAUDE.md`, `AGENTS.md`, [change-protocol.md](../../change-protocol.md). Then [classes-v2.md](../../design/classes-v2.md)
  in full (§3 and §3.3, §8, §10), D160 and D168–D169 in [decisions.md](../../decisions.md) (how H44 shipped v14), and
  `git show 7a95a98^:docs/handoff/tasks/H44-engine-v14-ward.md` for how a versioned engine change was done last time.
- The manual: [classes.md](../../game/classes.md) (live blocks `classes`, `weapons`, `presets`), [architecture.md](../../game/architecture.md)
  line 43 (`battle/ (engine v14 …)`).
- **The code** (lines on `c8d0cea`):
  - `packages/domain/src/rpg/kinds.ts` 19–22: `RPG_CLASSES`, `RpgClass`, `RpgTreeId`.
  - `rpg/battle/caps.ts` 1–8: bounds safe to read without the engine; the profile reads `BATTLE_HEAL_SCALE` here.
  - `rpg/battle/engine.ts`:
    - 31–33 `BATTLE_ENGINE_VERSION = 14`, `VERSIONS`;
    - 111–129 `validAlly` (119: `RPG_CLASSES.includes`, `validRpgWeapons(a.classId, a.weapons)`; 128: `battleSkillFor`);
    - 131–139 `validCharms` and `orbsOf`; 141–148 `validHeroes`; 170 `MAX_FOES`; 171–187 `validateInput`;
    - 767–770 `battleActorSkill`, 861–866 `halfOf`, 914 `const hand = rpgHand(ally)`.
  - `rpg/battle/skills.ts` 49–56 `battleSkillFor` (54: `rpgHand(ally)`).
  - `rpg/battle/limit.ts` 33–37 `heroPlan` (`HERO_LIMIT_POWER`, `heroLimit`), 45–56 `battleLimitPlan` (46 `rpgHand`, 49 `known`).
  - `rpg/battle/types.ts` 15–66 `BattleAlly` (`orb` 26–27, `might` 34–36, `orbs` 42–43), 116 and 159 (the version unions).
  - `rpg/rules.ts`: 54–56 (`dexterity`, "Her Heal"), 65–71 `RPG_CLASS_SLOTS`, 76–82 `RPG_CLASS_ARMOR`, 84 `rpgPicksWeapons`,
    86–93 `rpgDefaultWeapons`, 95–102 `validRpgWeapons`, 104–107 `rpgDefaultClass`, 110–116 `RPG_CLASS_STATS`,
    126–134 `RpgHand`/`rpgHand`, 171–192 `projectRpgStats` (HP at 185, Heal at 191).
  - `rpg/node-identity.ts` 10–25 (22 checks `RPG_CLASSES`); `rpg/hero-id.ts` 6–8 (seat ids from `RPG_CLASSES`), 23–27
    (`HERO_HALLS`, `hallClass`); `rpg/heroes.ts` 13 (`HERO_LIMIT_POWER`), 85–89 (`heroLimit`, `heroLimitsOf`).
  - `rpg/catalog.ts` 336–378: the Cleric's builder (`RPG_CLERIC_STATUS`, `CLERIC_NAMES`, `clericSupport`, `cleric()`,
    `RPG_REBIRTH_NODE`).
  - **Every `Record<RpgClass, …>`** (tsc names them once the type grows): the rules.ts tables, `HERO_HALLS`,
    `HERO_LIMIT_POWER`, `save/presets.ts` 20–26, `world/balance-party.ts` 27–33, `docs/render.ts` 60 and 71–78, and
    `apps/web/src/battle/labels.tsx` 15–22.
  - **Callers of the live lists** (they must keep working unchanged): `save/save.ts` 527–543 (`parseRanks`), 545–584
    (bonds and seats), 587–627 (`parseLoadout`, `parseUmas`); `save/battle.ts` 98–103 (`chooseClass`), 119–139
    (`holdWeapon`, `RPG_CLASS_SLOTS`); `save/heroes.ts` 14–20; `economy/ranks.ts` 157; the web's
    `places/stable/SkillsPage.tsx` 73, `OutfitProfile.tsx` 322, `exchange/ExchangePage.tsx` 119, `album/rows.ts` 31.
  - **A mocked module in a test file of its own:** `save/rift-hook.test.ts` 10–13.
  - Tests that read the engine version: `save/forge.test.ts` 177, `save/heroes.test.ts` 96, `rift/generate.test.ts` 195.

## Decisions made

**The main session's classes v2 build decisions** (2026-10-22, for the owner, who prefers no open questions). Log them
as one D-row before this packet's own (step 9):
1. **One switch.** Classes v2 is engine v15 and save v25, built dark: every v2 rule sits behind the generation
   (`engine >= 15`), and the deployed game stays on engine v14 and save v24 until H61 flips `BATTLE_ENGINE_VERSION`
   (moved to `rpg/battle/caps.ts`), `SAVE_SCHEMA_VERSION` and the `toV25` migration in one commit, with the Paladin on
   screen. v6–v14 fights replay exactly, pinned by a frozen fixture that also runs with the switch mocked on.
2. **The Paladin** is a class id from H53 (`RPG_ALL_CLASSES`); the game's lists (`RPG_CLASSES`, hero seats, the save,
   the pickers) gain her only at the switch, and the engine refuses her before v15.
3. **One healer a party (C8):** at most one Paladin or Cleric fights in a party. It's enforced where a party fights: the
   world map's fight, a Rift front or Echo fight, and the Convergence's begin (each of its four parties); engine v15
   refuses an input with two as a backstop. The Party Hall and the Rift's party slots show "One healer a party". Party
   edits and class switches are never refused, Sweeps don't fight so they don't check, and the migration changes no
   party: a party left with two Clerics shows the warning until one changes class. It's a v2 rule: v14 fights and the
   live game before the switch are unchanged.
4. **Starting class (§3.3):** a new Uma whose best style is Late starts as a Paladin when her Power beats her Wit (ties:
   Cleric), written as her class at unlock. Umas who never picked keep today's style mapping, so no existing Uma changes
   class at the switch.
5. **The Rift's guidance (v2):** Iron 2 Brawler, 2 Spell Blade, Paladin; Arcane 2 Mage, 2 Summoner, Cleric; Duel
   2 Brawler, 2 Mage, Paladin; Horde 2 Spell Blade, 2 Summoner, Cleric. The Duel's single heavy hitter is the Paladin's
   threat-aimed Barrier, the Horde's spread damage the Cleric's mends; H60 measures both healers on both and may swap.
6. **Art:** the Paladin's class emblem in uma-art 2.12.0 (H54). The Paladin Bastion draws uma-art's existing, unused
   `knights-bastion` keep (a stone keep with a blue banner and gold star, drawn with the halls), no new building.
7. **The Learning page (v2):** physical-led halls on the left, magic-led on the right, the mirrors across: Brawler Dojo
   and Mage Tower, Spell Blade Salle and Summoner Circle, Paladin Bastion and Cleric Chapel, the Observatory below (H59).
8. **Docs:** the manual describes the deployed game, so dark packets leave `docs/game/` and `pnpm docs:update`
   unchanged and add "Built in H… (D…), live from H61" lines to classes-v2.md; H61 rewrites the manual.
9. **The work, in waves:** 1) H53 foundation, H54 art → 2) H55 the hybrids' hands, H56 the healers and the halls, H57
   accessories, H58 save v25 → 3) H59 the screens, H60 balance → 4) H61 the switch.

**This packet's decisions:**
- **The switch.** `BATTLE_ENGINE_VERSION` moves to `rpg/battle/caps.ts`, typed as `BattleInput['version']` (a type-only
  import), still **14**; `engine.ts` re-exports it, so every import keeps working. Beside it: `RPG_V2_ENGINE = 15` and
  `rpgV2(engine = BATTLE_ENGINE_VERSION): boolean` (`engine >= RPG_V2_ENGINE`), and `BATTLE_HEAL_OFFENSE_SCALE = 300`
  (v15's healer scaling divisor, here so the profile can read it without the engine; H56 uses it, H60 tunes it).
- **The rule for every v2 rule outside the engine:** it takes an `engine` argument defaulting to `BATTLE_ENGINE_VERSION`,
  so the live game follows the switch. **The engine never uses that default:** every rules call it makes passes the
  fight's version.
- **Classes.** `RPG_ALL_CLASSES = ['brawler', 'mage', 'spellblade', 'cleric', 'summoner', 'paladin']` defines `RpgClass`,
  tree ids, node ids and hero seat ids. `RPG_CLASSES` becomes the **live** list, `rpgV2() ? RPG_ALL_CLASSES : the first
  five`, typed `readonly RpgClass[]`. Paladin last, so no list's existing order moves. `RPG_HEALERS = ['paladin',
  'cleric']` and `rpgIsHealer(classId, engine = …)`: true only from v15 (a v1 Cleric shares support with the Summoner).
- **Class rules by generation** (v1 = today; v2 = classes v2). Each is `fn(…, engine = BATTLE_ENGINE_VERSION)`:

  | Rule | v1 (≤ 14) | v2 (≥ 15) |
  |---|---|---|
  | `rpgClassSlots(classId)` | today's table | Cleric Tome, Tome, Tome, Arms, Arms; Paladin Arms, Arms, Arms, Tome, Tome; the rest as today |
  | `validRpgWeapons(classId, weapons)` | today's | by the v2 slots |
  | `rpgDefaultWeapons(classId)` | today's | Cleric: Light, Dark, Thunder Tomes, Katana, Bow. Paladin: Greatsword, Axe, Lance, Blizzard, Fire Tomes |
  | `rpgClassStats(classId)` (leans) | today's | Spell Blade ATK ×1.1, M.ATK ×0.95; Summoner ATK ×0.95, M.ATK ×1.1, MP ×1; Paladin HP 1, ATK 1, M.ATK 0.8, DEF 1.15, M.DEF 1, MP 1.3; Cleric as today; every `heal` 0 |
  | `projectRpgStats(profile)` | HP (100 + 5 Sta + 2 Pow) × lean | HP (100 + 5 Sta + 2 Pow + **1 Guts**) × lean (C1); `dexterity` (Heal) 0 |
  | `rpgHand(profile)` | today's, with `arms = tome = power` | Spell Blade `arms` 0.63, `tome` 0.27, `mp` 0.5, `pair`; Summoner `tome` 0.63, `arms` 0.27, `mp` 0.5, `linger` 0.3, `pair`; Paladin and Cleric 0.5, MP 0.6 |

  - `RpgHand` gains `arms` and `tome`: the power of a skill or Attack of that half. `power` stays: a one-half class's
    power, and a pair class's leading half (each half's in v1).
  - `RPG_CLASS_SLOTS` and `RPG_CLASS_STATS` stay exported as the live tables. `RPG_CLASS_ARMOR.paladin = 'physical'`.
    A Paladin row in a v1 table holds her v2 values: the type needs it, and no v1 fight or save has a Paladin.
  - Why the Cleric's and the Paladin's spreads: the Cleric's Light (mends, Rebirth), Dark (Clarity, drain), Thunder
    (Breaker), Katana (Hex makes Light and Dark weak) and Bow (Shatter) serve the Arcane party's shields; the Paladin's
    Greatsword (Aegis, Armor Break), Axe (Enfeeble), Lance (Valkyrie's Oath), Blizzard (a Barrier on every Uma) and Fire
    (Brave) serve the physical one. Mirror leans are classes-v2 §3.2's; the Paladin mirrors today's Cleric.
- **Guts into HP is a projection rule, not an engine rule.** A fight freezes its allies' stats, so it reaches fights
  started after the switch only.
- **Engine v15 is accepted, dark.** `VERSIONS` and `MAX_FOES` gain 15 (8 foes). From v15:
  - `validAlly(a, version)`: a Paladin only from v15; weapons by `validRpgWeapons(a.classId, a.weapons, version)`;
  - `orb` and `orbs` are refused: an Orb's flat offense arrives in `might` (H57), and it no longer adds kinds;
  - hero seats by `isHeroLimitId(id, version)`, a Paladin seat only from v15;
  - `validateInput` refuses two healers in the party, `RangeError('Invalid battle party')`.
  v6–v14 validation is unchanged: two Clerics, a Cleric with four Arms and two Orbs stay legal there.
- **Every rules call in the engine passes the fight's version:** `rpgHand`, `validRpgWeapons`, `battleSkillFor` (gains a
  required `version`; it already takes each skill's power from `hand.arms` or `hand.tome` by its weapon, equal in v1),
  `isHeroLimitId`, and, through `limit.ts`, `heroLimitFor(id, version)` and `heroLimitPower(classId, version)` (new in
  `heroes.ts`; both return today's table for every version until H56 fills v15). So with the switch mocked to 15, a v14
  fight still reads v1 rules everywhere.
- **The Paladin's trees** (`catalog.ts`): ten trees `paladin-<weapon>`, built with the Cleric's builder (the same hits,
  statuses, stacks, turns and MP) and **the Cleric's names**, except:
  - her Arms statuses reach every foe from depth 5 as the Cleric's do, and **her Axe's from depth 4** (classes-v2 §4);
  - her Light 3B is "Heavy Devotion" (the Cleric's is Rebirth);
  - her Lance 4B is **"Valkyrie's Oath"**, the Heavy shape (H56 gives it its revive);
  - no `support` on her nodes: that field is v12–v14's, and H56 adds the v15 kit to both healers.
  Why the Cleric's names: §3.3 calls them one kit in two halves, it spares 150 invented names, and the migration maps
  `cleric-x` to `paladin-x` one to one (H58).
- **Hero seats:** `ALL_HERO_LIMIT_IDS` (24) are identities; `HERO_LIMIT_IDS` stays the live list (20 until the switch);
  `isHeroLimitId(id, engine = …)`. `HERO_HALLS.paladin = 'paladin-bastion'`; `HERO_LIMIT_POWER.paladin = 1.5`.
- **Node identity** (`node-identity.ts`) covers all six classes, so the engine can validate a Paladin's tree; the save
  refuses her keys before the switch through the live `RPG_CLASSES`.
- **Rows the type forces:** `CLASS_LABEL.paladin = 'Paladin'` and a short `CLASS_BLURB.paladin` (H59 rewrites all six
  for v2); `docs/render.ts`'s `CLASS_NAME`, `STARTS_AS` ('Late surgers, Power over Wit'), `RETIRED_LIMIT_OF` ('none:
  she came with engine v15'); a presets row (`talisman-thorn` and the v1 Orb rule's `orb-lightning`; H57 sets v2's); a
  balance kit row (physical armor, `talisman-thorn`, `talisman-vital`, stats atk, hp, def, mdef; H60 sets v2's). None of
  them shows before the switch.
- **v14 replays are pinned by a frozen fixture**, `rpg/battle/v14-replays.fixture.json`: six v14 fights with their
  inputs, action logs, final `battleStateHash` and a digest of their cues (each cue's kind, actor, target, amount,
  channel, element and weak flag, in order; **not labels**, which are presentation: H55 renames a summon by the live
  generation, and an old fight may show the new name): one world stage per Tier 1 continent (the
  balance party on curve with inherited Limit Breaks, played on Auto, so Clerics' and Summoners' supports, Spell Blade
  pairs and Limit Breaks all run) and one Rift Duel stage (the ward, a third act, mixed locks). Two tests replay it: one
  under the live engine, one in a file that mocks `caps.ts` to `BATTLE_ENGINE_VERSION: 15`. The fixture regenerates
  only with `UPDATE_V14=1` and its fights must say `version: 14`. H55–H61 keep both green; H61's switch is the second
  test made real.
- **No save change, nothing on screen.** `pnpm docs:update` must leave no diff: every live block reads the live lists.
- **Main JS:** the generation tables sit in `rules.ts` and `kinds.ts`, which the main bundle loads. Keep them as data,
  not code paths, and say the number (225.54 KB on CI today, of 230).

## Do

1. **`rpg/battle/caps.ts`:** the switch, `RPG_V2_ENGINE`, `rpgV2`, `BATTLE_HEAL_OFFENSE_SCALE`, each with a one-line
   comment. `engine.ts` keeps `export const BATTLE_ENGINE_VERSION` as a re-export; its header comment gains one line for
   v15 ("v15 classes v2 (D…), dark until H61: the Paladin, the hybrids' hands, healers from ATK or M.ATK, flat Orbs").
2. **`rpg/kinds.ts`:** `RPG_ALL_CLASSES`, `RpgClass` from it, the live `RPG_CLASSES`, `RPG_HEALERS`, `rpgIsHealer`.
3. **`rpg/rules.ts`:** the v2 tables and the generation-aware functions in the table above. `rpgDefaultClass` (the
   style mapping) is unchanged. Update the `dexterity` doc comment (v15: 0; healers scale from ATK or M.ATK).
4. **`rpg/node-identity.ts`, `rpg/hero-id.ts`, `rpg/heroes.ts`:** identity over all six; `ALL_HERO_LIMIT_IDS`, the live
   `HERO_LIMIT_IDS`, `isHeroLimitId(id, engine)`; `HERO_HALLS.paladin`; `HERO_LIMIT_POWER.paladin`; `heroLimitFor` and
   `heroLimitPower`.
5. **`rpg/catalog.ts`:** the Paladin's ten trees as above. Export a helper the migration can mirror if useful, but the
   migration (H58) writes its own literal mapping.
6. **The engine, `skills.ts`, `limit.ts`, `types.ts`:** the version unions gain 15; v15 validation as above; every rules
   call passes the fight's version. Doc comments on `orb`/`orbs` ("refused from v15") and `might` ("from v15 it also
   carries her Orb's offense on its kind, H57").
7. **The forced rows** in rules, hero-id, heroes, presets, balance-party, docs/render and the web's labels.
8. **Tests:**
   - `rpg/rules-v2.test.ts`: each table row above for v1 and v2; `RPG_CLASSES` is the five and `RPG_ALL_CLASSES` the six;
     a Paladin's projected HP at Lv 50 with and without Guts; `rpgHand` v1 equals today's for all five classes.
   - `rpg/battle/engine-v15.test.ts`: a v15 input with a Paladin (her spread, a learned side in a `paladin-*` tree) plays
     a round on Auto (leave the Summoner out of v15 parties here: her v2 hand pairs, and her pair and its Auto are H55's);
     the same Paladin in a v14 input throws `Invalid battle ally`; `orbs` in v15 throws; a Paladin and a
     Cleric together in v15 throw `Invalid battle party`, two Clerics in v14 don't; a Cleric with four Arms is legal in
     v14 and refused in v15; a `paladin-1` hero seat is refused in v14.
   - `rpg/battle/v14-replays.test.ts` and `v14-replays-live15.test.ts` (the mock) on the fixture; a third case asserts
     every fixture input is `version: 14`.
   - Every existing test passes unchanged.
9. **Docs:**
   - Log two D-decisions (fetch `main` first; the next free numbers, D178 and D179 if `main` still ends at D177): the
     build decisions above, then this packet's.
   - [classes-v2.md](../../design/classes-v2.md) §8: "Built in H53 (D…): the Paladin as a class id, the one switch,
     class rules by generation and engine v15's validation, dark until H61."
   - [architecture.md](../../game/architecture.md) line 43: "`battle/` (engine v14; v15 built behind the switch, H61)".
   - Run `pnpm docs:update`: no diff.
10. **Check it locally** in a desktop browser at 390×844 (never the iOS Simulator; your own ports, per the master
    prompt): a world-map stage on Auto plays as before, and the open fight in `apps/api/.data/save.json` reads
    `"version": 14`. The Stable's class picker still shows five classes.

## Done when

- [ ] `pnpm lint && pnpm test && pnpm build` pass. Say the main JS number (gzip, of 230 KB).
- [ ] The tests in step 8 pass, both v14 replay tests included, and every existing test passes unchanged.
- [ ] No rules call inside `rpg/battle/` relies on a default `engine` (grep the calls you changed).
- [ ] `docs/game/` is unchanged apart from architecture.md line 43, `pnpm docs:update` leaves no diff, both D-rows are
  logged and classes-v2 §8 has its line.
- [ ] The local check in step 10 was done and described. Nothing from the original games in git (`git status`).
- [ ] Deployed green (`gh run watch <id> -R luismlorenzana/uma-rpg --exit-status`), and
  https://uma-rpg.web.app/api/health shows the commit in `build`.

## Deliver

- **Claude, as a delegated worker:** a pull request from `feat/h53-engine-v15-foundation` with one commit,
  `feat(domain): engine v15 foundation, the Paladin and the one switch (H53)`; the body says why (dark, one switch,
  replays pinned). Fetch `main` before you push so the D-numbers are free. The main session reviews and merges it, then
  watches the deploy. Nothing on screen changes; nothing at the screen's edges.
- **Flag it done:** after the merge, a `docs(handoff): H53 done (D…)` commit deletes this file, sets H53's State to Done
  in `docs/handoff/README.md` with the commit, adds a Done row, and sets H55, H56, H57 and H58 to Ready.
