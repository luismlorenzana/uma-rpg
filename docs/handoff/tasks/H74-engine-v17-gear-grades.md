# H74 — Engine v17 foundation and the gear model: grades from G0, the Lv 5g − 4 gate, values × tier, armor's values; gear ranks retired (dark)

**uma-rpg · Claude · L · Needs: H64 · Unblocks: H75, H76 (and through them H78–H82). H77 runs beside it**

## Why

The Tier rework's second release, **R2, Tier 1's economy, is engine v17 and save v28** (D198,
[implementation.md](../../design/tier-rework/implementation.md) §1, §3). It replaces crafted gear with **grades**:
- she owns every weapon (all ten kinds), her five armor slots and her accessory slot at **G0**;
- **one made item raises one a grade**, worn at **Uma Lv 5g − 4**; Weapon, Armor and Accessory Ranks and Gear Marks
  retire;
- every flat value is its **Tier 1 value × 1, × 1.8 or × 2.6** (SB1);
- **armor carries all defense** at its new values (WP15).

Every R2 packet after this one needs these things, which don't exist yet:
- **engine v17 accepted**, dark, and every frozen fight still replaying under it;
- **the gear model** as data and pure rules (`UmaGrades`, the gate, the values by tier) and the save rules that raise a
  grade from the Warehouse;
- **the fight built from grades**: Might × tier on her weapons, armor's stats × tier;
- **two save shapes living side by side in the types** while R2 is dark;
- **gear ranks retired in the rules** for a graded Uma.

This packet builds them and nothing a player sees. It also logs the main session's R2 build decisions as a D-row, which
H75–H82 follow (H73, the art, is uma-platform's).

## Context (read first)

- `CLAUDE.md`, `AGENTS.md`, [change-protocol.md](../../change-protocol.md). Then:
  - [implementation.md](../../design/tier-rework/implementation.md) (D198): §1 (the releases and **between releases**),
    §2 (conventions), §3 (R2's table and waves), §4 (R2's column);
  - [weapon-progression.md](../../design/tier-rework/weapon-progression.md): §2.1–§2.3 (WP1–WP4), §3.1 (WP5, Might by
    tier), §3.10 (promotion), **§4.1–§4.4** (WP14–WP15: slots, halves, every value by tier, the sheet at Lv 50), §4.5
    (WP16), §6.1 (WP26), §11 (save), §12 (engine), §14 (the calls);
  - [stat-balance.md](../../design/tier-rework/stat-balance.md) §2 (SB1), §6 (SB13);
  - [README.md](../../design/tier-rework/README.md) §2.1, §2.5 (SB1), **§9.1 and §9.3 with their Release column** (R2's
    rows), §9.4;
  - D192–D198 in [decisions.md](../../decisions.md), and R1's build decisions (H64's first D-row).
- **The packet this one mirrors:** [H64](H64-engine-v16-foundation.md) (and `git show 5dd9f08:docs/handoff/tasks/H53-engine-v15-foundation.md`).
  H64 gives you `rpgRework(stage, engine)` and `RPG_REWORK_ENGINE` in `rpg/battle/caps.ts`, the v15 replay fixture and
  `rpg/battle/caps-at.fixture.ts`'s `capsAt(version, caps)` for mocking the switch.
- **The code** (lines on `421eacd`; R1's H64–H69 will have moved some, so search by name):
  - `rpg/battle/caps.ts` 24–29 (`BATTLE_ENGINE_VERSION`, `rpgV2`; H64 adds `rpgRework` beside them).
  - `rpg/battle/engine.ts`: 1–12 the header; 34 re-exports; 38 `VERSIONS`; 117–135 `validAlly`; 137–145 `validCharms`
    (the supports' fields, v11–v15); 179 `MAX_FOES`; 180–198 `validateInput`; 310–349 `battleDamage` (Might at 318–319).
  - `rpg/battle/types.ts` 15–66 `BattleAlly` (the support fields 37–62), 119 the version union, 162 `engineVersion`.
  - `economy/gear.ts` 66–71 (`MIGHT_BY_GRADE` 0, 1, 4, 8, 12, 19, 26, 35, 45, 57, 68; `armorOffense`;
    `ARMOR_DEFENSE_PER_GRADE` 2), 108–131 (`gearPoints`, `equippedPoints`, `equippedMight`).
  - `economy/gear-id.ts` 70–91 (`gearLevel`: the rank gate; `gearId`, `gearIdentity`).
  - `economy/ranks.ts` 8–9 (`GEAR_MAX_RANK`), 16–34 (armor slots, `ARMOR_SLOT_STAT`), 65–135 (tracks), 139–158 (EXP
    shares, `MARKS_SHARE`, `MANUAL_*`).
  - `economy/bonus.ts` 8–28 (`Points`, `applyPoints`: HP is `POINT_HP` 5 a point, Speed 0.6% evasion a point).
  - `rpg/rules.ts` 94 `RPG_CLASS_ARMOR` (the half by class).
  - `save/save.ts`: 59–71 `Wallet`; 84–104 `OwnedUma`; 110–118 `UmaGear`, `slotKind`, `Stars`; 220–227
    `startingArmorKinds`, `newOwnedUma`; 475–500 `parseUmaGear`; 533–549 `parseRanks`.
  - `save/battle.ts`: 161–182 (`umaPoints`, `umaPointParts`, `umaWeaponMight`); 224–236 `partyMembers`; 342–381
    `fillRanks`; 383–410 `payEntrants`.
  - `save/exchange.ts` 139–163 (Manuals); `save/rift.ts` 396–411 (`payEcho`), 519–570 (`ascend`: H78's).
  - **Readers of `uma.gear` to narrow** (tsc names them once the type is a union): `save/forge.ts` (all), `save/upgrades.ts`
    49–113, `save/presets.ts` 74–152, `save/targets.ts` 47–54, `save/sheet.ts` 29–31, `save/rift.ts` 535 and 557,
    `save/battle.ts` 167, 175, 233 and 356–361; the web's `places/stable/GearCard.tsx` 43–63, `SkillsPage.tsx` 88,
    `WeaponSheet.tsx` (`heldIn`, the sheets). `save/migrations.ts` works on raw records: leave it.
  - Tests that build a fight or mock the switch: `rpg/battle/v14-replays*.test.ts`, H64's `v15-replays*.test.ts`,
    `save/rift-hook.test.ts` 10–13 (a mocked module in a file of its own).

## Decisions made

**The main session's R2 build decisions** (2026-10-25, for the owner, who prefers no open questions). Log them as one
D-row before this packet's own (step 10):
1. **One switch, one stage.** R2 is engine v17 and save v28, built dark behind `rpgRework('economy', engine)`
   (`RPG_REWORK_ENGINE.economy = 17`, H64). H82 flips `BATTLE_ENGINE_VERSION` 16 → 17, `SAVE_SCHEMA_VERSION` 27 → 28
   and chains `toV28`, in one commit, after R1's switch (H72). Until then the deployed game plays R1, or today's game
   before H72.
2. **Who reads the predicate how:** the engine with the fight's version; every rule outside it with `engine =
   BATTLE_ENGINE_VERSION`; every non-fight R2 rule with the live default: the item catalogs, the places, the work env,
   the Warehouse, the Exchange, the strict parse's shape and new saves. Tests run the switched game with H64's
   `capsAt(17, …)` mock in a file of its own.
3. **Replays pinned.** H74 runs every frozen fixture (v14, H53; v15, H64) with the switch mocked to 17. **H82 freezes
   v16's** (`v16-replays.fixture.json`) from live v16 fights before it flips: v16 is final only once R1 is live (H72).
4. **The legacy catalogs freeze, unrenamed.** Today's 160 item ids (`items/families.ts`, `items/identity.ts`), 40 gear
   types (`economy/gear-id.ts`, `gear.ts`), 100 Star Gems (`economy/stars.ts`, `gems.ts`), eleven facilities
   (`economy/jobs.ts`) and the v1 work env (`work/env.ts`) keep their names and contents: they run the live game until
   H82 and the migration chain after it (`toV21` reads `isItemId` and `facilitySpec`). R2 adds v3 catalogs beside them.
5. **The item ids** (H77 owns them): **materials keep uma-art's ids** (PP8's sixty, `copper-ore` … `cut-philosophers-stone`);
   **made items** are `weapon-gem-g1`…`g10`, `armor-fittings-g1`…`g10`, `accessory-setting-g1`…`g10`, `branch-gem`,
   `jewel-planet-1`…`5`, `jewel-moon-1`…`5` (`items/made-id.ts`, below). **Made items live in the Warehouse
   (`world.items`) beside the materials:** the making kinds pay with uma-work's `payItems`, a grade or a node takes its
   item from there, the targets planner reads one stock. v28 has no `gear` and no `gems` shelf.
6. **Between releases** (implementation §1): until R3, **every tier has one accessory slot, base forms only**, so an
   Accessory Setting is 12 refined in every tier (PP10's 12 ÷ the slots); **the armor half is her class's in every
   tier** (WP14's per-piece halves land with R3); **no secondary** (H86); **the Branch Gem's id and recipe exist, but
   nothing makes or uses it**: a Tier 2 or 3 world's G5 is a Weapon Gem G5 on its pair by the ladder (R3's v29 turns them
   into Branch Gems). Values × 1.8 and × 2.6 and the ladder apply in Tier 2 and 3 worlds.
7. **Two shapes in the types while R2 is dark.** A reshaped key carries a union told apart by its fields
   (`OwnedUma.gear: UmaGearV1 | UmaGrades`, H74; `OwnedUma.stars: StarsV1 | StarMap`, H76); a field v28 retires becomes
   optional (`Ranks.weapons`, `armors`, `accessories`, H74; `TierWorld.gear`, `TierWorld.gems`, `Wallet.gearMarks`, H78);
   a new world field is optional (`TierWorld.grant`, H78). v1 readers narrow through one helper each (`gearV1(uma)`,
   `starsV1(uma)`): a mechanical change, no behaviour. The strict parse reads v28's shape when the economy stage is live
   (H78). H82 leaves the v1 branches in place, as H61 did: they replay old fights and document the old game.
8. **Templates come from the caller.** The signature (H75), her moon (H76) and UT8's preset read `umaTemplate(outfit,
   pick)` (R1's H67) wherever the fight or the screen has the outfit; the save's rules and its migration never read
   master data. So the migration (H78) leaves every accessory slot's family `null` (a G0 slot does nothing) and "Use the
   standard preset" sets it; the trade gate (H77) takes `tradeOf(outfitId)` from the caller and is open where the caller
   can't say (settles, the API's parse).
9. **Promotion with grades** (WP §3.10's promotion clause, GE14 kept; it lands now because R2 brings grades, H78): the
   ascending Uma starts the new world at G0, a fresh Uma as today, and **the made items her grades used return to the old
   world's Warehouse**, as her bound gear does today (D15); her opened jewels don't return, as Star Gems don't today.
10. **Art and versions:** uma-art's next minor (H73: the made items' rows in the `items` atlas) is pinned by the first
    screens packet that draws it (H79 or H80), as H59 pinned 2.12.0, because their web tests check the atlas; H82 checks
    the pin. No uma-kit change: a packet that finds it needs one stops and files "Both apps:" (change-protocol.md).
11. **Docs:** the manual describes the deployed game, so H74–H81 leave `docs/game/` and `pnpm docs:update` unchanged and
    each adds "Built: H7x (D…)" under R2's table in implementation.md §3 (H64's convention); H81 writes its measured
    numbers into the design docs; H82 rewrites the manual.
12. **Main JS** (230 KB gzip): v3 catalogs ship id-only in the main chunk (identity snapshots, as `items/identity.ts`);
    names, recipes and rules sit in modules the lazy subpaths load. Every delivery says the number.
13. **The work, in waves:** H73 any time; 1) H74, H77 after H64 (beside R1's waves 2–4) → 2) H75, H76 → 3) H78, and H81
    after R1's H71 → 4) H79, H80 after R1's H70 → 5) H82 after R1's H72. **H75 and H76 also need R1's H67**
    (`umaTemplate`: the signature's family, her moon's knack and channel, UT8's preset).
14. **Balance is measured with explicit v17 inputs, never the switch** (H60's pattern); screens are previewed with a local
    switch that is never committed (H59's): `caps.ts` `BATTLE_ENGINE_VERSION = 17`, `save.ts` `SAVE_SCHEMA_VERSION =
    28`, `migrations.ts` chaining `toV28`.

**Approved calls this packet builds** (exact values):
- **WP1:** weapons own which kinds and how hard a weak hit lands (×1.3 in Tier 1); armor owns defense; accessories add
  damage only (H75).
- **WP2:** she owns all ten weapons, five armor slots and her tier's accessory slots at **G0**, no stats at G0 (a G0
  weapon is the Training weapon: it opens its tree and adds no Might). **One made item raises one a grade**, G0 → G10,
  used up. The slot holds the grade; what fills it swaps freely (a weapon's grade sits on its kind, shared by every class
  that slots it; an armor slot's on the slot, either half; an accessory slot's on the slot, any family).
- **WP3:** grade g is worn at **Uma Lv 5g − 4** of her tier (G1 Lv 1, G5 Lv 21, G10 Lv 46). Weapon, Armor and Accessory
  Ranks retire, with Gear Marks (to Class Marks, H78) and the gear Manuals.
- **WP4, SB1:** every flat value is its Tier 1 value × 1, × 1.8, × 2.6, each per-grade value rounded half up; shares
  stay (the weak multiplier, evasion, a Bell's power, an Insignia's percentage).
- **WP5 · Might by grade:** Tier 1 **1, 4, 8, 12, 19, 26, 35, 45, 57, 68** (G1–G10); Tier 2 **2, 7, 14, 22, 34, 47, 63, 81,
  103, 122**; Tier 3 **3, 10, 21, 31, 49, 68, 91, 117, 148, 177**.
- **WP14:** five slots (head, body, legs, arms, feet); the half sets only the piece shown and its offense; every defensive
  stat is the slot's. Her class's half: Brawler, Spell Blade, Paladin physical; Mage, Summoner, Cleric magical.
- **WP15 · armor's values a grade, Tier 1:** head **DEF +4**, arms **M.DEF +4**, body **HP +15**, legs **MP +3**, feet
  **evasion 1.2%** (not × tier), each piece **offense ⌈g ÷ 2⌉** (ATK physical, M.ATK magical). The suit at G10: HP +150,
  DEF +40, M.DEF +40, MP +30, evasion 12%, offense +25; Tier 2 HP +270, DEF and M.DEF +72, MP +54, offense +45; Tier 3
  HP +390, DEF and M.DEF +104, MP +78, offense +65. Per-grade rows exactly WP §4.2's tables.
- **WP16:** no sets. **WP26:** the four products and pieces per Uma (30 · 50 · 10 in Tier 1). **WP28:** "Grade" G0–G10.
- **SB13:** armor as drafted; a regular's 100% hit 18.7% · 18.3% · 18.1% of an on-curve Brawler's HP at each tier's
  Lv 50 (H81 measures; its knob is armor's HP a grade).

**This packet's decisions:**
- **Engine v17 accepted, dark.** `VERSIONS` and `MAX_FOES` gain 17 (8 foes); `BattleInput['version']` and
  `BattleState['engineVersion']` gain 17. The header gains: "v17 the Tier rework's economy (D…), dark until H82: gear by
  grade and armor's values as data, the four accessory families' base forms and the signature (H75), Extra Stats v3
  (H76); the ten supports refused".
- **From v17 the supports' fields are refused** (`RangeError('Invalid battle ally')`): **`barrier`, `veil`, `regen`,
  `mpRegen`, `lifesteal`, `mpSteal`, `guard`, `resist`, `thorns`, `mirror`**. R1's H68 put nothing of its own in them:
  SB18's base MP regen has no input field (`rpgBaseMpRegen`, computed by the engine at a round's end beside the Spring's
  `mpRegen`), and the Flourish rides `BattleAlly.flourish`. So from v17 the round-end MP is the base regen alone, and no
  gear or accessory path fills these fields. v6–v16 validation is unchanged.
- **No engine rule changes here:** grades reach a fight as data (`stats`, `might`). H75 adds the accessory fields and
  rules; H76 changes no engine rule either.
- **`economy/grades.ts`** (new; main-bundle safe: data and pure rules, no names or recipes):
  - `UmaGrades = { weapons: Partial<Record<RpgWeapon, { grade: number }>>; armor: Partial<Record<ArmorSlot, { grade:
    number }>>; accessories: AccessorySlotState[] }`, absent being G0. **`{ grade }` objects, not numbers,** so R3 adds
    `branch` and R3's halves without reshaping (H83, H87 expect it).
  - `ACCESSORY_FAMILIES = ['pendant', 'orb', 'bell', 'insignia'] as const`, `AccessoryFamily` (the same union as R1's
    H67 `UmaFamily` in `roster/template.ts`: if H67 has merged, alias it; if not, H67 aliases yours);
    `AccessorySlotState = { grade: number; family: AccessoryFamily | null; form: 'base'; kind?: RpgDamageKind }`
    (H75 gives the forms their rules; `family` is null until set).
  - `GradeTarget = { kind: 'weapon'; weapon: RpgWeapon } | { kind: 'armor'; slot: ArmorSlot } | { kind: 'accessory';
    slot: number }`; `gradeOf(grades, target)`; `GRADE_MAX = 10`; `gradeGateLevel(g) = 5g − 4`.
  - `accessorySlotCount(tier, engine = BATTLE_ENGINE_VERSION)`: 1 (R3 makes it 2 from Tier 2); `newGrades(tier)`:
    `{ weapons: {}, armor: {}, accessories: [{ grade: 0, family: null, form: 'base' }] }`.
  - `TIER_SCALE_TENTHS = { 1: 10, 2: 18, 3: 26 }` and **`tierScaled(t1, tier) = Math.round(t1 × tenths ÷ 10)`** in
    integer arithmetic (× 18 and × 26 of an integer never end in .5, so half up holds without float drift). H75 and H76
    use it for every flat value.
  - `mightAt(grade, tier) = tierScaled(MIGHT_BY_GRADE[grade], tier)`; `gradeMight(grades, weapons, tier)`: her slotted
    weapons' kinds → Might (absent at G0).
  - `armorValues(slot, grade, tier)` → that slot's stat and the piece's offense, by WP §4.2; `gradePoints(grades, half,
    tier): Points` sums them: `def`, `mdef`, `mp` as values, `hp` as HP ÷ `POINT_HP`, evasion as Speed points (2 a feet
    grade = 1.2%, never × tier), offense on `atk` or `matk` by the half. `armorHalf(classId) = RPG_CLASS_ARMOR[classId]`
    in every tier until R3.
  - `gradeItemId(target, grade)`: `weapon-gem-g{g}`, `armor-fittings-g{g}`, `accessory-setting-g{g}` (by
    `items/made-id.ts`). A weapon's G5 is a Weapon Gem in every tier until R3.
  - `raiseBlock(grades, target, umaLevel, stock, to = next)`: the refusal or null: **"Already G10"**, **"Needs Lv 21"**
    (the highest grade asked), **"Needs 1 Weapon Gem G5"**, or for a climb **"Needs Weapon Gems G5, G6 and G7"** (every
    missing grade listed, so the sheet "lists the gems first", WP §3.1).
- **`items/made-id.ts`** (new, ids only; **H77 owns it**: whichever of H74 and H77 lands first creates it with exactly
  this content, and the other keeps it):

  ```ts
  // The made items' ids (R2, D…): what the Forge, the Armorer, the Charm Shop and the Lapidary make. Ids, lines and grades
  // only, safe for the main bundle and the save's parse; names, places and recipes are `items/made.ts`'s (H77).
  export const MADE_LINES = ['weapon-gem', 'armor-fittings', 'accessory-setting', 'branch-gem', 'jewel-planet', 'jewel-moon'] as const
  export type MadeLine = typeof MADE_LINES[number]
  export interface MadeIdentity { id: string; line: MadeLine; grade: number }
  const graded = (line: MadeLine): MadeIdentity[] => Array.from({ length: 10 }, (_, i) => ({ id: `${line}-g${i + 1}`, line, grade: i + 1 }))
  export const MADE_IDENTITIES: readonly MadeIdentity[] = [
    ...graded('weapon-gem'), ...graded('armor-fittings'), ...graded('accessory-setting'),
    { id: 'branch-gem', line: 'branch-gem', grade: 5 },
    ...[1, 2, 3, 4, 5].map((n): MadeIdentity => ({ id: `jewel-planet-${n}`, line: 'jewel-planet', grade: 2 * n - 1 })),
    ...[1, 2, 3, 4, 5].map((n): MadeIdentity => ({ id: `jewel-moon-${n}`, line: 'jewel-moon', grade: 2 * n })),
  ]
  const BY_ID = new Map(MADE_IDENTITIES.map((m) => [m.id, m]))
  export const madeIdentity = (id: string): MadeIdentity | undefined => BY_ID.get(id)
  export const isMadeId = (id: string): boolean => BY_ID.has(id)
  export const gradeItem = (line: 'weapon-gem' | 'armor-fittings' | 'accessory-setting', grade: number): string => `${line}-g${grade}`
  export const jewelId = (body: 'planet' | 'moon', numeral: number): string => `jewel-${body}-${numeral}`
  ```

  None of these ids collides with a gear id (`gearIdentity` refuses `weapon-gem` as a type) or a Star Gem (`gem-…`).
- **The save's types** (decision 7): today's `UmaGear` interface becomes **`UmaGearV1`** and `OwnedUma.gear: UmaGearV1 |
  UmaGrades`; `isGrades(gear)` tells them apart (`'locker' in gear` is v1); **`gearV1(uma)`** returns her v1 gear, or an
  empty one (`{ locker: [], equipped: {}, kinds: {} }`) for a graded Uma, and **`gradesOf(uma)`** her grades, or
  `newGrades(1)` for a v1 Uma. `slotKind` takes `UmaGearV1`. `Ranks.weapons`, `armors` and `accessories` become optional
  (absent is no track); every track reader defaults to `{}`. Every reader listed in Context narrows through `gearV1` or
  `gradesOf`; v1 behaviour is byte for byte today's. No parse change (H78 parses v28); `newOwnedUma` is unchanged (H78).
- **The save rules,** in `save/forge.ts` beside v1's (the web already loads them through `@rpg/domain/forge`; R3's H83
  extends `raiseGrade`):
  - **`raiseGrade(save, outfitId, target, now, tier = TIER_ONE)`**: takes one `gradeItemId(target, next)` from
    `world.items` (deleting a count that reaches 0) and raises the target one grade; refused with `raiseBlock`'s words
    (`SaveRuleError` `'bad-job'` or `'no-items'`), and "Not graded" for a v1 Uma.
  - **`raiseGradeTo(save, outfitId, target, to, now, tier)`**: "Up to G7": every grade from the next to `to`, all or
    nothing; **`raisePlan(world, outfitId, target, to)`** → `{ items: string[]; block: string | null }` for the sheet.
  - Her level is her tier level (`uma.level`); the tier is the `tier` argument.
- **The fight from grades** (a graded Uma; the branch reads her shape, since only a v28 save holds one):
  - `partyMembers` (save/battle.ts 224–236): `points` = `gradePoints(grades, armorHalf(classId), tier)` + her Extra
    Stats points (v1's `starPoints` until H76 wires the map); `might` = `gradeMight(grades, her class's weapons, tier)`;
    no `accessories` until H75. `umaPointParts` and `umaWeaponMight` the same way. Every other builder of `BattleAlly`
    from a save (the Rift's start and Echo paths) goes through `partyMembers`; check it.
  - `rpgPartyAllies` is unchanged: values are data.
- **Ranks retired in the rules** (a graded Uma): `fillRanks` fills **only her Class Rank** (2E) and banks no Gear Marks;
  `payEntrants` and `payEcho` add no Gear Marks and **never write `wallet.gearMarks` when the wallet has none** (v28's,
  H78); `FightResult.gearMarks` is 0. `manualBlock` and `readManuals` refuse a weapon, armor or accessory ref for a
  graded Uma: **"Gear Manuals are retired"**; Class Manuals stay. `RankRef` keeps its kinds for v1.
- **No save parse, no screen, no manual change.** `pnpm docs:update` leaves no diff: every live block reads live rules.
- **Main JS:** `economy/grades.ts` and `items/made-id.ts` are small and main-safe; say the number.

## Do

1. **`rpg/battle/caps.ts`:** check H64's `RPG_REWORK_ENGINE.economy` is 17 (add it if missing). **`engine.ts`,
   `types.ts`:** the version unions, `VERSIONS`, `MAX_FOES`, the header line; v17's refusals in `validCharms` (or beside
   it) as decided, with a doc comment on each support field ("refused from v17, D…").
2. **`economy/grades.ts`** and **`items/made-id.ts`** as decided, each with a module comment citing the calls.
3. **`save/save.ts`:** the `UmaGearV1` rename, the union, `isGrades`, `gearV1`, `gradesOf`; optional gear tracks in
   `Ranks` (`economy/ranks.ts`); then narrow every reader (domain and web) until `pnpm -r tsc` passes, changing no
   behaviour.
4. **`save/forge.ts`:** `raiseGrade`, `raiseGradeTo`, `raisePlan`.
5. **`save/battle.ts`, `save/rift.ts`, `save/exchange.ts`:** the graded branches of `partyMembers`, `umaPointParts`,
   `umaWeaponMight`, `fillRanks`, `payEntrants`, `payEcho`, `manualBlock`/`readManuals`.
6. **A test fixture,** `save/economy-v3.fixture.ts` (test-only): `gradedUma(overrides)` (an `OwnedUma` with `gear:
   UmaGrades`, today's other fields) and `gradedWorld(…)`, which H75–H78 extend.
7. **Tests:**
   - `economy/grades.test.ts`: `mightAt` for G0–G10 in Tiers 1–3 equals WP5's three rows exactly; `armorValues` for every
     slot and grade in Tiers 1–3 equals WP §4.2's three tables (DEF and M.DEF, HP, MP, evasion 1.2–12% in every tier,
     offense); the G10 suits' sums; `gradePoints` turns HP into points (Tier 2 body G1: 27 HP = 5.4 points) and feet into
     Speed points; `gradeGateLevel` 1, 6 … 46; `raiseBlock`'s four sentences; `newGrades` has one slot in Tiers 1–3.
   - `save/forge-v3.test.ts`: a graded Uma at Lv 1 raises her Greatsword G0 → G1, taking `weapon-gem-g1` (the count
     falls, a last one is deleted); G1 → G2 at Lv 5 is "Needs Lv 6", at Lv 6 it passes; with no `weapon-gem-g2` it is
     "Needs 1 Weapon Gem G2"; "Up to G4" from G1 takes G2, G3, G4 in order and with G3 missing takes none ("Needs Weapon
     Gems G3"); G10 is "Already G10"; her Greatsword's grade is the same as a Brawler and as a Paladin (the kind holds
     it); an armor slot and the accessory slot raise with Armor Fittings and Accessory Settings; a v1 Uma is "Not graded".
   - `save/battle-v3.test.ts` (the switch mocked to 17 with `capsAt`): a graded Brawler at Tier 1 Lv 46 with her three
     weapons and five armor slots at G10 enters a fight with Might 68 on each weapon's kind and HP +150, DEF +40, M.DEF +40,
     MP +30, ATK +25, evasion 120‰ over her projected stats; the same grades in Tier 2 give Might 122, HP +270, DEF +72,
     ATK +45, evasion 120‰; a Mage gets M.ATK +25 instead of ATK; `fillRanks` on a graded Uma returns only her class's
     gain and 0 Gear Marks; `payEntrants` on a world whose wallet has no `gearMarks` leaves it without one;
     `readManuals` for a weapon is "Gear Manuals are retired" and for her class works.
   - `rpg/battle/engine-v17.test.ts`: a v17 input built from graded Umas (one of each class but one healer) plays two
     rounds on Auto; v17 refuses an ally with `lifesteal`, `guard`, `thorns`, `veil`, a Spring's `mpRegen` or `orbs`,
     each; the same ally is legal at v15 (and v16, `orbs` aside); a v16 input runs unchanged; a v17 ally still regains
     SB18's base MP at a round's end (H68's rule, no field).
   - `rpg/battle/replays-live17.test.ts` (mocked to 17): asserts `rpgRework('economy')` is true, then replays **the v14
     and v15 fixtures** byte for byte.
   - Every existing test passes unchanged.
8. **Docs:** implementation.md §3 under R2's table: "Built: H74 (D…)"; `docs/game/architecture.md`'s battle line:
   "… v17, the Tier rework's economy, built behind `rpgRework`, live from H82". `pnpm docs:update`: no other diff.
9. **Check it locally** in a desktop browser at 390×844 (never the iOS Simulator; your own ports, per the master prompt),
   on a scratch save: the Gear tab and the Forge look as before, a world-map stage on Auto plays and settles, and the open
   fight in `apps/api/.data/save.json` reads the live engine version (15 or 16).
10. **D-rows:** fetch `main` first, then the next free numbers: R2's build decisions above, then this packet's.

## Done when

- [ ] `pnpm lint && pnpm test && pnpm build` pass. Say the main JS number (gzip, of 230 KB).
- [ ] The tests in step 7 pass; the v14 and v15 replays pass live and with the switch mocked to 17.
- [ ] No rules call inside `rpg/battle/` relies on a default `engine` (grep the calls you changed).
- [ ] `docs/game/` is unchanged apart from architecture.md's battle line, `pnpm docs:update` leaves no diff, both D-rows
  are logged and implementation.md has its line.
- [ ] The local check in step 9 was done and described. Nothing from the original games in git (`git status`).
- [ ] Deployed green (`gh run watch <id> -R luismlorenzana/uma-rpg --exit-status`), and
  https://uma-rpg.web.app/api/health shows the commit in `build`.

## Deliver

- **Claude, as a delegated worker:** a pull request from `feat/h74-engine-v17-gear-grades` with one commit,
  `feat(domain): engine v17 foundation and gear by grade, dark (H74)`; the body says why (dark, one switch a release,
  replays pinned, two shapes in the types). H77 runs at the same time: both may create `items/made-id.ts` (identical);
  rebase on whichever lands first. Fetch `main` before you push so the D-numbers are free. The main session reviews and
  merges it, then watches the deploy. Nothing on screen changes.
- **Flag it done:** after the merge, a `docs(handoff): H74 done (D…)` commit deletes this file, sets H74's State to Done
  in `docs/handoff/README.md` with the commit, adds a Done row, and sets H75 and H76 to Ready (if R1's H67 is done).
