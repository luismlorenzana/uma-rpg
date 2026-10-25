# H75 — Accessories v3: the four families' base forms, the Bell and the Insignia, the damage stack, the signature, the presets (dark)

**uma-rpg · Claude · L · Needs: H74, R1's H67 · Unblocks: H78, H79, H81**

## Why

R2 turns accessories into damage only ([weapon-progression.md](../../design/tier-rework/weapon-progression.md) §5, D193):
- **the ten supports retire** (Talismans and Amulets: cuts, shields, returns, regen, lifesteal, both MP ones);
- **four families, every one from Tier 1,** each a simple **base form** in R2's one slot: the **Pendant** (flat offense on
  her three slotted kinds), the **Orb** (flat offense on one kind), the **Bell** (her weapon of its kind strikes once more
  after her Attack) and the **Insignia** (her hits on sub-bosses and bosses deal more);
- **one damage stack** orders every piece on a hit (WP31);
- **the signature accessory** (WP33, [uma-templates.md](../../design/tier-rework/uma-templates.md) UT7): her knack names
  a family, and while she wears it her ATK and M.ATK gain +0.2 a level × tier;
- **presets** dress one tap's best (WP25, UT8, SB10).

The Bell and the Insignia are new engine rules and the signature a new stat in the input: all engine v17, dark. The
flat forms and the presets are data and save rules, behind the economy stage. Nothing changes on screen (H79 draws it).

## Context (read first)

- `CLAUDE.md`, `AGENTS.md`, **R2's build decisions** (H74's first D-row), H74's own D-row and code (`economy/grades.ts`:
  `UmaGrades`, `AccessorySlotState`, `ACCESSORY_FAMILIES`, `tierScaled`, `accessorySlotCount`; `save/forge.ts`'s
  `raiseGrade`; `save/economy-v3.fixture.ts`).
- The design: [weapon-progression.md](../../design/tier-rework/weapon-progression.md) **§2.4 (WP31)**, §5.1–§5.8 (WP17–WP25:
  §5.3's tree, §5.4's catalog with every value, §5.5 the Bell, §5.6 the kind cap, §5.7 viability, §5.8 the presets after
  SB10), §5.10 (WP33), §8 (the sheet's words, for H79), §12, §14; [uma-templates.md](../../design/tier-rework/uma-templates.md)
  §3.4 (UT7, UT8 and its clarification), §3.8 (UT12), §4 (UT13), §10 (UT18); [stat-balance.md](../../design/tier-rework/stat-balance.md)
  §4.2–§4.3 (SB8, SB9), §5.1 (SB10), §8 (SB15); README §9.1's R2 rows (the signature is engine v17 under D198, not v16).
- **R1's H67 and H69:** `roster/template.ts`'s `umaTemplate(outfit, pick?)` → `{ calling, stride, knack, type, …,
  family }` (the family by UT7's `KNACK_FAMILY`; `UmaFamily` is the same union as H74's `AccessoryFamily`), and the pick
  as H69 stores it, `OwnedUma.calling: { pick: RpgClass | null; confirmed }` (optional on the type until H72).
- **The code** (lines on `421eacd`; R1 moves some, so search by name):
  - `economy/gear.ts` 73–106 (`orbOffense`, `ORB_OFFENSE_BY_GRADE` 1, 2, 4, 6, 10, 13, 18, 23, 29, 34; `charmPerGrade`;
    `addAccessory`); `economy/gear-id.ts` 93–116 (`AccessoryEffects`, `accessoryFightFields`): v1 and v2's, kept.
  - `rpg/campaign/run.ts` 35–40 `RpgPartyMember`, 62–80 `rpgPartyAllies` (v2 folds the Orb into `might`).
  - `rpg/battle/types.ts` 15–66 `BattleAlly`.
  - `rpg/battle/engine.ts`: 117–147 `validAlly`, `validCharms`; **306–349 `HitOptions`, `battleDamage`** (offense at
    318–319, the weak step at 325–326, statuses after); 560–590 `strike` (chips at 581–589, locks at 575); 834–… `cast`;
    924–927 `halfIsTome`, `battleAttackDef`; 973–985 `resolveHalf`; **987–1066 `applyBattleAction`** (the Attack branch
    1029–1056, `halves.forEach` at 1054, the Limit gauge at 1057).
  - `rpg/battle/auto.ts` 137 `autoAction` and how it scores an Attack.
  - `save/presets.ts` 14–162 (`classPreset`, `classPresetPlan`, `applyClassPreset`, `wearClassPreset`).
  - `save/battle.ts` 224–236 `partyMembers` (H74 added the graded branch); `save/forge.ts` 128–141 (v1's
    `wearAccessory`, kept).
  - `world/balance-party.ts` 76–118 (`balanceMember`: H81 builds its v3 member on your functions).

## Decisions made

**Approved calls, exact values** (R2: one slot, base forms only, in every tier; R2's build decisions point 6):
- **WP17:** all ten supports retire in every tier (H74's v17 refuses their fields; no v3 path makes one).
- **WP18, WP19:** four families, Pendant, Orb, Bell, Insignia, damage only; **one untyped slot**, its family and form a
  setting changed freely outside fights, the grade on the slot; G0 does nothing. R3 adds the second slot and the
  branches (H84).
- **WP20 · Pendant:** flat offense on **each of her three slotted weapons' own kinds**: Tier 1 **1, 1, 2, 2, 4, 5, 7, 9,
  12, 14** (G1–G10); Tier 2 **2, 2, 4, 4, 7, 9, 13, 16, 22, 25**; Tier 3 **3, 3, 5, 5, 10, 13, 18, 23, 31, 36**
  (`tierScaled` of Tier 1's row).
- **WP22 · Orb:** flat offense on **one kind she sets, any of the ten**: Tier 1 **1, 2, 4, 6, 10, 13, 18, 23, 29, 34**;
  Tier 2 **2, 4, 7, 11, 18, 23, 32, 41, 52, 61**; Tier 3 **3, 5, 10, 16, 26, 34, 47, 60, 75, 88**. An Orb of a kind she
  doesn't wield still adds to that kind (her inherited Limit Breaks' hits), as v2's did.
- **WP21 · Bell:** when her act includes an **Attack** (a Brawler's Attack, either half of a hybrid's pair, a healer's
  Attack; never a skill, a Guard or a Limit Break), **her weapon of the Bell's kind strikes once**, at **0.1 a grade**
  (1.0 at G10, a share: the same in every tier) **× her hand for that kind's channel**. One hit, never split (no Spell
  Blade extra hit), **once an act**, on the foe her Attack struck, or a random living foe (seeded) if that one fell. It is
  a hit of that weapon: its channel and offense, its Might, flat offense on its kind, the weak multiplier; **a weak
  follow-up removes a shield point and breaks a lock**; it adds nothing to the Limit gauge. **Its kind must be one of her
  three slotted weapons' own kinds:** otherwise it does nothing ("No Fire Tome in her slots").
- **WP23 · Insignia:** her hits on a **sub-boss or a boss** (by rank: the Horde's regular-rank leaders don't count) deal
  **+1.5% a grade** (+15% at G10), a percentage, the same in every tier.
- **WP24 · the kind cap** is R3's (H84): R2's one slot never reaches it (at most an Orb, +88 in Tier 3, under +177).
- **WP31 · the damage stack,** on every hit, whatever casts it:
  1. **offense** = her ATK or M.ATK (by the hit's channel) **+ the signature** (while worn) **+ the weapon's Might + flat
     offense on the hit's own kind** (the Pendant and Orb forms);
  2. **the hit:** offense² ÷ (offense + defense) × power (× her hand, × her Skill Rank: R1's);
  3. **× the weak multiplier** (×1.3);
  4. **× each percentage as its own factor:** the Insignia (R4 adds the focus);
  5. today's statuses, riders, the unbroken halving, the ward, evasion.
  **Heals take none of steps 1's additions and 3:** a mend or a Barrier reads her ATK or M.ATK without the signature
  and without flat offense (Prowess, a stat, does reach them).
- **WP33, UT7, SB15 · the signature accessory:** her knack names her family: **Fleet a Bell, Mighty an Orb, Tireless a
  Pendant, Gritty and Clever an Insignia.** While she wears **any form of it**, her ATK and M.ATK each gain **+0.2 a level
  × tier** (Tier 1 +2 · +6 · +10 at Lv 10 · 30 · 50; Tier 2 +18 and Tier 3 +26 at Lv 50); on anyone else it is the plain
  item. **UT12:** in any class. **UT13:** about +4.3–6.1% damage matched at Lv 50 (H81 measures). **UT18:** a stat in the
  fight's input, frozen; outside the kind cap and the foe budget.
- **WP25 · Tier 1 presets** (branch 1; every tier in R2), after SB10: **Brawler Bell · Greatsword; Mage Pendant; Spell
  Blade Pendant; Summoner Orb · Light; Paladin Pendant; Cleric Orb · Ice** (her Blizzard Tome).
- **UT8, with the main session's ruling (2026-10-25): UT8 picks the family, SB10 picks the kind.** Her preset wears her
  signature family: when her class's preset form isn't of her family, her family takes the slot in its base form. When
  that form has a kind (an Orb, a Bell) and **she is a hybrid**, it sits on **SB10's kind, her lead half's kind that twins
  her lone weapon** (the Spell Blade's **Lance**, the twin of her Thunder Tome; the Summoner's **Light**, the twin of her
  Bow), not automatically her first slot; anyone else's sits on **her lead kind, her first slot's** (Brawler Greatsword,
  Mage Fire, Paladin Greatsword, Cleric Light). A Pendant or an Insignia has no kind. When her class's preset is already
  her family, it stays as WP25 has it. **The balance party (no template) keeps WP25's rows.**
- **SB9:** channel parity holds by construction (H81 checks: within 1 point at an equal Attack share). **SB10:** a
  hybrid's single-kind forms on her lead half (the presets above).

**This packet's decisions:**
- **`economy/accessories.ts`** (new; main-bundle safe: data and pure rules; R3's H84 extends it beside these):
  - `PENDANT_T1 = [1, 1, 2, 2, 4, 5, 7, 9, 12, 14]`, `ORB_T1 = [1, 2, 4, 6, 10, 13, 18, 23, 29, 34]` (equal to
    `ORB_OFFENSE_BY_GRADE` from G1), `accessoryFlatValue(family, grade, tier)` by `tierScaled`;
    `BELL_PERMILLE_PER_GRADE = 100`, `INSIGNIA_PERMILLE_PER_GRADE = 15`.
  - `ACCESSORY_FAMILY_LABEL` ("Pendant", "Orb", "Bell", "Insignia").
  - **`accessoryParts(slot, weapons, tier)`** → `{ flat: Partial<Record<RpgDamageKind, number>>; bell?: { kind; power };
    insignia?: { value } }`: a Pendant adds its value to each of her weapons' kinds; an Orb to its kind; a Bell only when
    its kind is one of her weapons' kinds (power `100 × grade` per mille of an Attack); an Insignia `15 × grade` per mille.
    A G0 slot or a null family gives nothing.
  - `signatureBonus(level, tier) = Math.round(2 × level × tenths ÷ 100)` (integer: 0.2 × level × tier);
    `signatureWorn(grades, family)`: some slot holds that family **at G1 or above**.
  - **Why G1:** a G0 slot is an empty setting that "does nothing" (WP19); her signature is "while she wears" an
    accessory, and the first Setting (Lv 1) makes one, so the bonus never comes free. Log it.
- **Engine v17 input** (`BattleAlly`, each refused before v17):
  - **`flat?: Partial<Record<RpgDamageKind, number>>`**: her accessory forms' flat offense by kind, **apart from `might`**
    (v15's Orb folded into `might`), so R3's kind cap (H84) and weapon moons (H85) can read it apart; 0–1,000 a kind.
  - **`bell?: { kind: RpgDamageKind; power: number }`**: power in per mille of an Attack, 1–3,000 (R3 adds `step` and
    `top` for the Toll Bell); its kind must be one of her weapons' kinds.
  - **`insignia?: { value: number }`**: per mille, 1–1,000 (R3 adds a scope for Onslaught).
  - **`signature?: number`**: 0–1,000, added to her ATK and M.ATK on her hits only.
  - **One slot in v17:** at most one of `flat` (non-empty), `bell`, `insignia`; R3 relaxes it with the slot count.
- **The rules in the engine, v17 only** (every earlier version byte for byte unchanged):
  - `battleDamage`, for an ally's hit: offense += `signature` + `flat[kind]` (step 1; not on v12's percent path); after
    the weak step, × (1 + `insignia.value` ÷ 1,000) when the defender is a `sub-boss` or a `boss` (step 4). Mends,
    Barriers and revives don't call `battleDamage` with these: check `support` and the cover rules read `stats` only.
  - **The Bell** (`ring`, after the act's halves resolve in `applyBattleAction`, inside the attack-or-skill branch): when
    v17, `ally.bell`, the actor still standing and at least one half was an Attack (`half.kind === 'attack'`), strike once
    with **her weapon of the Bell's kind**: one part of that kind, power `bell.power ÷ 1,000 × (hand.arms or hand.tome by
    its channel)`, through `strike` as an Attack's hit is (interception, chips, locks, drain all as for an Attack), on the
    act's target if it stands, else a seeded random living foe (salt `'bell'`); a `hit` cue labelled `'Bell'`. No
    `battleExtraHit`. The Limit gauge is unchanged (it fills per act).
  - **Auto** (`auto.ts`) scores an Attack with its Bell follow-up (the follow-up's damage on the struck foe, weak when its
    kind is on the foe's lists), so Auto takes a free Attack when the Bell makes it worth it. The Insignia needs nothing:
    Auto's previews go through `battleDamage`.
  - Limit Breaks' hits take `flat` and `signature` on their kinds and the Insignia (WP §3.10: every hit takes the stack),
    since they go through `battleDamage`; nothing to add.
- **The input builders:** `RpgPartyMember` gains `accessory?: AccessoryParts` and `signature?: number`;
  `rpgPartyAllies` (engine ≥ 17) sends `flat`, `bell`, `insignia` and `signature` when present and never v1's or v2's
  accessory fields. `partyMembers` (a graded Uma) fills them: `accessoryParts(gradesOf(uma).accessories[0], her class's
  weapons, tier)`, and the signature when `signatureWorn(grades, umaTemplate(outfit, uma.calling?.pick ?? undefined).family)`
  (H67, H69), `signatureBonus(uma.level, tier)`.
- **The setter** (`save/forge.ts`, beside v1's `wearAccessory`; R3's H84 extends it):
  **`setAccessoryForm(save, outfitId, classId, slot, family, kind, now, tier = TIER_ONE)`**: sets a slot's family
  (`form: 'base'`) and kind; the grade never changes. Refused (`SaveRuleError` `'bad-loadout'`): an unknown family; a
  slot beyond `accessorySlotCount(tier)`; an Orb without a kind; a Bell whose kind isn't one of `classId`'s weapons ("No
  Fire Tome in her slots"); a kind for a Pendant or an Insignia; a v1 Uma ("Not graded"). `classId` is her active class,
  which the caller passes (as `upgradesFor` takes it), since the save can't read her style. A Bell left on a kind she no
  longer slots after a class or weapon change stays set and does nothing; the sheet says so (H79).
- **Presets v3** (`save/presets.ts`, a graded branch; v1 and v2 unchanged):
  - `classPresetV3(classId, engine)` → `{ classId, weapons: rpgDefaultWeapons(classId, engine), armor: RPG_CLASS_ARMOR[classId],
    accessory: { family, kind? } }` by WP25's rows; `presetAccessory(classId, weapons, family?)` applies UT8 and SB10 as
    decided (the twin of her lone weapon by `twinOf`: Greatsword–Fire, Axe–Ice, Lance–Lightning, Bow–Light, Katana–Dark).
  - `classPresetPlan` and `applyClassPreset` for a graded Uma: her class's three weapons (as v1 counts weapon changes),
    the slot's family and kind; **grades untouched** (they sit on kinds and slots), nothing bound. `changes` counts the
    weapon positions and the slot's family or kind that differ, so the confirm sheet (D164) still asks first.
  - `wearClassPreset(…, engine, family?)`: the web passes her family from her template.
- **No screen, no parse, no manual change.** The battle sheet's lines (`save/sheet.ts`) and the Gear tab are H79's;
  `pnpm docs:update` leaves no diff (the `presets` and `gear` blocks read the live generation).
- **Main JS:** `economy/accessories.ts` is small; the engine is lazy (H62). Say the number.

## Do

1. **`economy/accessories.ts`** as decided, with a module comment citing WP17–WP25, WP31, WP33, UT7, UT8, SB10.
2. **`rpg/battle/types.ts`, `engine.ts`:** the four fields with doc comments (v17, D…); their validation in `validAlly`;
   the stack's steps 1 and 4 in `battleDamage`; `ring` after the halves; the header's v17 line names them.
3. **`rpg/battle/auto.ts`:** the Bell in an Attack's score.
4. **`rpg/campaign/run.ts`, `save/battle.ts`:** the builders as decided (H76 edits `partyMembers` at the same time:
   rebase on whichever lands first).
5. **`save/forge.ts`:** `setAccessoryForm`. **`save/presets.ts`:** the v3 branch.
6. **The fixture:** extend `save/economy-v3.fixture.ts` with an accessory slot helper and an outfit per knack (invented
   profiles, as uma-templates §6 does; never a real Uma).
7. **Tests:**
   - `economy/accessories.test.ts`: the Pendant and Orb rows for Tiers 1–3 exactly as above; Bell power 100–1,000 per
     mille and Insignia 15–150 per mille by grade; `accessoryParts` (a Pendant on her three kinds; an Orb on a kind she
     doesn't wield; a Bell on a kind she doesn't slot gives no `bell`; G0 and a null family give nothing);
     `signatureBonus` (Tier 1 Lv 10, 30, 50: 2, 6, 10; Tier 2 Lv 50: 18; Tier 3 Lv 50: 26; Tier 2 Lv 10: 4);
     `signatureWorn` false at G0; UT7's five knacks.
   - `rpg/battle/accessories-v17.test.ts` (fixed seeds; v17 inputs built directly):
     - **flat:** a Greatsword hit deals more with `flat.greatsword` 34 than without, by offense² ÷ (offense + defense)
       with offense + 34; an Axe hit is unchanged;
     - **signature:** a Brawler's hit with `signature` 10 equals one with ATK + 10; a Cleric's mend and a Paladin's
       Barrier are equal with and without it;
     - **Insignia:** at G10 a weak hit on a boss is ×1.3 × 1.15 of the same hit without it (the factors in order), a
       sub-boss's the same, a regular's unchanged;
     - **Bell:** a Brawler's Attack with a G10 Greatsword Bell adds one `hit` cue labelled `'Bell'` on the same foe at
       power 1.0 × her hand; weak, it removes a shield point and breaks a lock; a skill act, a Guard and a Limit Break
       don't ring; a Spell Blade's pair with an Attack half rings once, as one hit; when the Attack fells its foe the Bell
       strikes a living one (seeded, the same every replay); the Limit gauge after the act equals the act without a Bell;
     - **validation:** each field refused at v16; a Bell of a kind she doesn't slot, a Bell with an Insignia, or a
       `flat` above 1,000 refused at v17;
     - replays: H74's `replays-live17.test.ts` still passes (v14, v15 unchanged).
   - `save/presets-v3.test.ts`: WP25's six rows; UT8 and the ruling: a Mighty Brawler gets an Orb on Greatsword, a Fleet
     Spell Blade a Bell on Lance, a Fleet Summoner a Bell on Light, a Mighty Summoner keeps Orb · Light, a Tireless
     Cleric a Pendant, a Clever Mage an Insignia, a Fleet Brawler keeps Bell · Greatsword, no family keeps WP25; applying
     it leaves every grade as it was and counts its changes.
   - `save/forge-v3.test.ts` (added cases): `setAccessoryForm`'s refusals and a family change keeping the grade.
   - `save/battle-v3.test.ts` (added cases, mocked to 17): a graded Tier 1 Lv 50 Brawler with a G10 Bell on Greatsword
     and a Fleet template enters with `bell` { greatsword, 1,000 } and `signature` 10; with a Pendant (not her family)
     she gets `flat` 14 on each of her three kinds and no signature; a G0 slot gives none of these; the input passes
     `createBattle`.
8. **Docs:** implementation.md §3: "Built: H75 (D…)". `pnpm docs:update`: no diff.
9. **Check it locally** (your own ports, 390×844, desktop browser): the Gear tab, the standard preset and a world-map
   fight behave as before; the open fight in `apps/api/.data/save.json` reads the live version.
10. **D-row:** fetch `main` first; log this packet's decisions (the G1 rule for the signature, the separate `flat`
    field, the setter's `classId`, the UT8 and SB10 ruling).

## Done when

- [ ] `pnpm lint && pnpm test && pnpm build` pass; say the main JS number.
- [ ] The tests in step 7 pass; the v14 and v15 replays pass live and mocked to 17.
- [ ] `docs/game/` is unchanged, `pnpm docs:update` leaves no diff, the D-row is logged, implementation.md has its line.
- [ ] The local check in step 9 was done and described. Nothing from the original games in git.
- [ ] Deployed green and https://uma-rpg.web.app/api/health shows the commit.

## Deliver

- **Claude, as a delegated worker:** a pull request from `feat/h75-accessories-v3` with one commit,
  `feat(domain): accessories v3, the base forms, the Bell, the Insignia and the signature, dark (H75)`. H76 edits
  `save/battle.ts`'s `partyMembers` and the fixture at the same time: rebase on whichever lands first. Fetch `main`
  before you push. The main session reviews and merges it, then watches the deploy.
- **Flag it done:** after the merge, a `docs(handoff): H75 done (D…)` commit deletes this file, sets H75 to Done with a
  Done row, and sets H78 (if H76, H77 and R1's H69 are done) and H81 (if H76, H77 and R1's H71 are done) to Ready.
