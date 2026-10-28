# H84 — Accessories, Tier 2: the second slot, one of each family, the five branches, the kind cap and Tier 2's presets (dark)

**uma-rpg · Claude · M · Needs: H83 · Unblocks: H87, H89 (and through them H88, H90)**

## Why

Release 2 gave every Uma one accessory slot holding one of four base forms (Pendant, Orb, Bell, Insignia). Tier 2's
accessories ([weapon-progression.md](../../design/tier-rework/weapon-progression.md) §5) are the second half of the
owner's "more slots, more variety, branching paths similar to weapons":
- **a second slot** from Tier 2, untyped, **one accessory of each family** (WP19);
- **two branches a family**, opened when a slot reaches G5 (WP20–WP23, with SB8's Great Pendant 0.55 and Toll Bell
  +0.05 a grade each ring): Great Pendant, Channel Pendant, Great Orb, Twin Orb, Great Bell, **Toll Bell**, Great
  Insignia, **Onslaught Insignia**;
- **a form is a setting** of the slot, never an item (WP34);
- **the kind cap** on flat offense from the Pendant and Orb forms (WP24);
- **Tier 2's presets** for the default set (WP25, SB10's lead half, UT8's signature).

Two forms are new rules in the engine (the Toll Bell's ring count, Onslaught's first act a wave); the rest are data on
the paths Release 2 built. All of it is v19 and dark until H90.

## Context (read first)

Code pointers are by file and function: Releases 1 and 2 move the lines. Re-read the code before starting.

- `CLAUDE.md`, `AGENTS.md`; [implementation.md](../../design/tier-rework/implementation.md) (D198); **H83's two D-rows**
  (Release 3's build decisions: where R3 applies, Tier 3 worlds on Tier 2's shape, the save shapes, Ascend).
- The design:
  - [weapon-progression.md](../../design/tier-rework/weapon-progression.md) §2.4 (WP31: the flat forms in step 1 under
    the cap; Insignias as step 4 factors), §5.2 (WP18), §5.3 (WP19, WP34, the trees drawn), **§5.4 (the catalog and
    every value)**, §5.5 (WP21, the Bell), **§5.6 (WP24, the cap)**, §5.7 (viability; the Tier 2 campaign rows this
    packet's signature rule reads), **§5.8 (WP25, the presets)**, §8 (screens, for the sheet's words), §12;
  - [stat-balance.md](../../design/tier-rework/stat-balance.md) SB8 (§4.2), SB10 (§5.1);
  - [uma-templates.md](../../design/tier-rework/uma-templates.md) §3.4 (UT7, **UT8: presets wear her signature**).
- **Release 2's work** (its packets and D-rows): H74 (the accessory slot's grade, raised by an Accessory Setting at Uma
  Lv 5g − 4), H75 (the four base forms, the accessory fields on `BattleAlly`, the Bell's follow-up, the Insignia's
  factor, the damage stack's order, the signature, the Tier 1 presets and UT8's Tier 1 rule), H77 (the Accessory
  Setting's recipes: 6 refined in Tier 2, 4 in Tier 3).
- **The code** (as Release 2 left it): the accessory catalog and values in `economy/` (`orbOffense`,
  `ORB_OFFENSE_BY_GRADE` and whatever H75 added beside them); the accessory setter in `save/forge.ts` (today's
  `wearAccessory`) and its refusal texts; `save/presets.ts` (`classPreset`, `classPresetPlan`, `applyClassPreset`);
  `save/sheet.ts` (`umaBattleSheet`); `save/battle.ts` `partyMembers` (the accessory fields of `BattleAlly`);
  `rpg/battle/engine.ts` (`validAlly`, the Bell's follow-up, the Insignia's factor in `battleDamage`, the round and wave
  steps where `BattleState.wave` advances); `rpg/battle/auto.ts` (how it weighs a Bell); `rpg/weapon-branches.ts`
  (H83).

## Decisions made

**Approved calls, exact values** (Tier 2; Tier 3 worlds play the same shares until R5, D-row of H83 point 2):
- **WP19 · Slots:** one in Tier 1, **two from Tier 2**, untyped; **one accessory of each family at most**.
- **WP34 · Forms:** a slot holds its family's base form from G0 and, **in Tier 2 and 3 worlds, either branch once the
  slot reaches G5**, set freely outside fights; no item, no commitment. Accessory Settings stay 10 · 20 · 30 an Uma.
- **WP20 · Pendants:** base her three slotted kinds at 0.4 of an Orb each; **Great Pendant 0.55** each (SB8); **Channel
  Pendant** two of her kinds of one channel at 0.8 each.
- **WP22 · Orbs:** base one kind at 1.0 (half a weapon's Might × tier); **Great Orb 1.2**; **Twin Orb** one twin set's
  two kinds at 0.8 each.
- **WP21 · Bells:** base 0.1 a grade × her hand; **Great Bell 0.14 a grade** (0.7 at G5, 1.4 at G10); **Toll Bell** its
  first ring 0.05 a grade, **+0.05 a grade each ring** (SB8), up to 0.2 a grade (G10: 0.5, 1.0, 1.5, 2.0), the count
  resetting each fight. One hit an Attack in every form; its kind counts for weaknesses and locks and must be one she
  slots (H75's rule).
- **WP23 · Insignias:** base +1.5% a grade on her hits on sub-bosses and bosses; **Great Insignia +2% a grade** from G5
  (10% → 20%); **Onslaught Insignia +2.5% a grade** from G5 (12.5% → 25%) on her **first act in each wave**.
- **WP24 · The kind cap:** flat offense on one kind from her Pendant and Orb forms stops at **a G10 weapon's Might ×
  tier: +68 · +122 · +177**. Her weapon moons (H85), the signature and Prowess sit outside it.
- **WP25 · Tier 2's presets, branch 1 (her class's default set)** (WP §5.8, with SB10's lead half):

  | Class | First form | Second form |
  |---|---|---|
  | Brawler | Great Bell · Lance | Channel Pendant · Axe + Lance |
  | Mage | Channel Pendant · Fire + Ice | Onslaught Insignia |
  | Spell Blade | Twin Orb · the Lightning twins (Lance, Lightning) | Onslaught Insignia |
  | Summoner | Twin Orb · the Light twins (Bow, Light) | Onslaught Insignia |
  | Paladin | Great Pendant | Great Orb · Light |
  | Cleric | Channel Pendant · Light + Ice | Onslaught Insignia |

  Branch 2's presets (the reverse sets) come with R4's class branches.
- **UT8 · Her signature:** when her class's preset lacks her family, her family takes the place of the preset's form
  that adds least for her class in the campaign, in its best form for her (WP §5.7's Tier 2 campaign rows). Read from
  those rows, **it is always the second form**, and her family's form is:

  | Class | Pendant | Orb | Bell | Insignia |
  |---|---|---|---|---|
  | Brawler | (worn) | Great Orb · Lance | (worn) | Onslaught |
  | Mage | (worn) | Great Orb · Fire | Great Bell · Fire | (worn) |
  | Spell Blade | Great Pendant | (worn) | Great Bell · Katana | (worn) |
  | Summoner | Great Pendant | (worn) | Great Bell · Dark | (worn) |
  | Paladin | (worn) | (worn) | Great Bell · Greatsword | Onslaught |
  | Cleric | (worn) | Twin Orb · the Light twins | Great Bell · Light | (worn) |

  The balance party (no template) keeps the table above.

**This packet's decisions:**
- **Values by one rule** (EP7's rounding): a flat form at grade g in tier t is `round(round(share × ORB_T1[g]) ×
  multiplier(t))`, with `ORB_T1` the Tier 1 Orb (1, 2, 4, 6, 10, 13, 18, 23, 29, 34) and multipliers 1 · 1.8 · 2.6.
  Tier 2 at G5 · G10: Pendant 7 · 25, **Great Pendant 11 · 34**, Channel Pendant 14 · 49, Orb 18 · 61, Great Orb
  22 · 74, Twin Orb 14 · 49. Why: one rule for every form and every tier, Tier 3 worlds included. WP §5.4's Great
  Pendant cells were scaled ×1.1 from the 0.5 row and differ by a point at G5, G6, G8 and G9 (its G10 +34 holds); the
  rule wins and the delivery lists the cells. Bells' and Insignias' values are shares, the same in every tier.
- **Where a value lives:** one table module beside H75's (`economy/accessories.ts` or wherever H75 put the base
  forms), main-bundle safe: `ACCESSORY_FORMS` (family → its base and two branches), `accessorySlots(tier, engine)`,
  `accessoryFormOpen(form, slotGrade, tier, engine)`, `accessoryFormValue(family, form, grade, tier)`, `kindCap(tier)`
  (`round(68 × multiplier)`), `capKindOffense(map, tier)`. All read `rpgRework('t2Weapons', engine)`.
- **The setting** (the save shape is H83's point 7; H87 parses it): `{ grade, family, form, kind?, kinds? }`:
  - `kind` for an Orb, a Great Orb and every Bell form (one kind; a Bell's must be one she slots to strike, H75's
    "No Fire Tome in her slots"); for a Twin Orb, **the twin set by its element** (`'lightning'` is Lance + Lightning);
  - `kinds: [a, b]` for a Channel Pendant: two different kinds of one channel; a kind she doesn't slot adds nothing
    and the sheet says so ("No Axe in her slots"), as a Bell's does;
  - none for the Pendant, the Great Pendant and every Insignia form.
- **The setter** (H75's accessory setter, extended): refuses a branch below its slot's G5 ("Opens at G5"), a branch in
  a Tier 1 world ("From Tier 2"), a second accessory of a family ("She wears a Bell already"), a Channel Pendant across
  channels ("Two Arms or two Tomes"), a slot beyond her tier's count. Changing a form or kind never touches the grade.
- **The kind cap is applied where flat offense is computed** (the input builder and the sheet: `capKindOffense` over
  her Pendant and Orb forms' kinds, after adding them); the sheet shows "Lance +122 (capped)". The engine backstop from
  v19: an ally whose accessory flat offense on any kind exceeds `kindCap(tier)` is refused. If H75 folded accessory
  offense into `might`, the backstop reads `might[kind] ≤ 2 × G10 Might × tier` instead, and the delivery says which.
- **The engine, v19** (dark; every earlier version unchanged):
  - **validation:** accessories ≤ `accessorySlots(tier)`; one of each family; a branch form on a Tier 1 ally refused;
    the cap; all `RangeError('Invalid battle ally')`;
  - **the input** extends H75's accessory fields: a Bell gains `step` and `top` (a Toll Bell; a Bell or a Great Bell has
    neither, its power its value); an Insignia gains its scope, `'elite'` (base and Great) or `'first-act'` (Onslaught);
    the flat forms arrive by kind as H75's flat path takes them, already capped;
  - **the Toll Bell:** `BattleState.tolls?: Record<allyId, number>`, absent until the first ring so older states hash as
    they did; ring n (0 first) strikes at `min(first + step × n, top)` × her hand for its kind's channel, then the count
    rises; a fight starts at 0; it rings only when H75's follow-up fires;
  - **Onslaught:** `BattleState.firstActs?: string[]`, the allies who have acted in the current wave, absent until set
    and emptied when a later wave enters; every hit of her first act in a wave (its Bell follow-up included) takes
    ×(1 + its value) in step 4; any act spends it, a Guard and a Limit Break included (simple to read: "her first act");
  - **Auto** weighs a Toll Bell at its next ring's power and an Onslaught act as it weighs the Insignia (H75's way).
- **Presets** (`classPreset(classId, tier, engine)` and the plan and apply functions): two slots from Tier 2; **the first
  form goes to her higher-graded slot** (a tie: slot 1), the second to the other; **a slot below G5 takes its form's base
  instead** (Great X → X on the same kind; Channel Pendant → Pendant; a Twin Orb → an Orb on the set's kind of her lead
  half for a hybrid, else the set's kind she slots first: the Spell Blade's Lance, the Summoner's Light, the Cleric's
  Light; Toll Bell → Bell; Onslaught → Insignia). Why: a branch needs G5 (WP34), and the higher slot carries the form
  that adds most (in every row the first form is the campaign's larger). Then UT8 as decided. Tier 1 unchanged.
- **The battle sheet** (`umaBattleSheet`): one row a slot, its form, kind and value ("Great Orb · Light +74", "Toll Bell ·
  Lance · 0.5, +0.5 a ring, to 2.0", "Onslaught +25% · first act each wave"), "(capped)" where the cap bound, ★ on her
  signature family (H75's). Words follow WP §8.
- **No save change here:** H87 parses the second slot and the new forms; tests build worlds directly. Live, the setter
  and the presets answer as Release 2 does (the stage is off).

## Do

1. **The table module** as decided, beside H75's, with doc comments citing WP19–WP24, WP34, SB8.
2. **The setter and the presets** in `save/` as decided, behind the stage.
3. **The input builder** (`partyMembers` and the Rift's and the harness's builders): both slots, the new fields, the cap.
4. **The engine:** v19 validation, the Toll Bell, Onslaught, the new fields; Auto.
5. **The sheet's rows** in `save/sheet.ts`.
6. **Tests:**
   - `economy/accessory-forms.test.ts`: every Tier 2 value at G5 and G10 listed above (Great Bell 0.7 · 1.4; Toll Bell
     0.25, +0.25, to 1.0 · 0.5, +0.5, to 2.0; Great Insignia 10% · 20%; Onslaught 12.5% · 25%); a Tier 3 world's Great
     Orb at G10 is 107 (41 × 2.6); branches open only at a slot's G5 and only in Tier 2+; one slot in Tier 1, two
     after; `kindCap` 68 · 122 · 177; a Great Orb (74) and a Channel Pendant (49) on the Lance cap at 122, a Twin Orb
     (49) and a Great Pendant (34) stay at 83.
   - `rpg/battle/accessories-v19.test.ts` (inputs at `version: 19`): a G10 Toll Bell strikes at 0.5, 1.0, 1.5, 2.0, 2.0
     × her hand over five Attacks and a new fight starts at 0.5; a Great Bell stays 1.4; Onslaught lifts her first act
     in wave 1 and wave 2 only, in a two-wave fight, and a Guard spends it; a Great Insignia adds 20% on a boss and
     nothing on a regular; refused: two Bells, three accessories in Tier 2, two in Tier 1, a branch form on a Tier 1
     ally, a kind over the cap, any of the new fields in a v18 input.
   - `save/accessories-t2.test.ts` (mocking `caps.ts` to 18): the setter's refusals and a free form change; the presets
     for the six classes with slots at G7 and G3 (the first form on G7, the second's base on G3), both at G0 (two base
     forms) and both at G10 (the table); the UT8 table for every class and family above; the sheet's "(capped)".
   - Every existing test passes unchanged; every replay test stays green.
7. **Docs:** log the D-decision (fetch `main` first). weapon-progression §5.3–§5.6 and §5.8 gain "Built in H84 (D…),
   live from H90." `pnpm docs:update` leaves no diff.
8. **Check it locally** (your own ports, a desktop browser at 390×844, never the iOS Simulator) on a scratch save from
   the CJS build: a Tier 2 Uma's Gear tab shows one accessory slot as before, the preset button dresses it as Release 2
   did, and a `w6` stage on Auto plays and stores `"version": 17`.

## Done when

- [ ] `pnpm lint && pnpm test && pnpm build` pass; say the main JS number (of 230 KB).
- [ ] The tests in step 6 pass; every replay test passes untouched.
- [ ] `docs/game/` is unchanged, `pnpm docs:update` leaves no diff, the D-decision is logged, the design doc has its
  lines and the delivery lists the Great Pendant cells the rule moved.
- [ ] The local check in step 8 was done at 390×844 on a scratch save and described. Nothing from the original games in
  git.
- [ ] Deployed green and https://uma-rpg.web.app/api/health shows the commit.

## Deliver

- **Claude, as a delegated worker:** a pull request from `feat/h84-accessories-tier2` with one commit,
  `feat(domain): Tier 2's accessories, the kind cap and presets, dark (H84)`. H85 edits the engine, the input builder
  and the sheet at the same time (its weapon moon sits beside your flat forms): rebase on whichever lands first. Fetch
  `main` before you push. The main session reviews and merges it, then watches the deploy.
- **Flag it done:** after the merge, a `docs(handoff): H84 done (D…)` commit deletes this file, sets H84 to Done with a
  Done row, and sets H87 and H89 to Ready if their other needs are done.
