# H99 — Accessories, Tier 3, and the second weapon moon: the third slot, the branches' step, Tier 3's presets (dark)

**uma-rpg · Claude · M · Needs: H98 · Unblocks: H102, H104 (and through them H103, H105)**

## Why

Tier 3's damage toolbox grows in two places outside the weapons:
- **accessories** ([weapon-progression.md](../../design/tier-rework/weapon-progression.md) §5.3–§5.8; WP19, WP34,
  WP25): a **third slot** (three of the four families, one of each), and every branch **a step deeper** once a slot
  reaches Tier 3's G5;
- **Extra Stats** ([extra-stats-progression.md](../../design/tier-rework/extra-stats-progression.md) §5; EP12, EP26,
  EP29): **a second weapon moon**, so a Full and a Split serve all three of her weapons.

Together they are about half of Tier 3's added toolbox (accessories ×1.25, weapon moons ×1.23 of her act at Lv 50,
[stat-balance](../../design/tier-rework/stat-balance.md) §3.4), which Tier 3's term prices (H101, H104). This packet
builds both, dark, for Tier 3 allies and worlds only.

## Context (read first)

Code pointers are by file and function: Releases 1–4 move the lines. Re-read the code before starting.

- `CLAUDE.md`, `AGENTS.md`, [change-protocol.md](../../change-protocol.md). H98's packet and D-rows (**Release 5's build
  decisions**: one stage, Tier 3 only, existing Tier 3 worlds kept).
- **The design:**
  - weapon-progression **§5.3** (slots 1 · 2 · 3; forms as settings; "promotion: grades reset; the forms stay known …
    before her slot's G5 in Tier 3 a branch holds at its Tier 2 share; at G5 it takes its Tier 3 step"), **§5.4** (the
    forms' values, the Bells' and Insignias' Tier 3 step), §5.5, **§5.6** (the kind cap: +177 in Tier 3), §5.7's Tier 3
    table (H104 checks it), **§5.8** (both presets tables' Tier 3 columns), §5.10; §14's WP19–WP25 and WP34 rows.
  - extra-stats-progression **§4.1–§4.2**, **§5.1–§5.3** (the second moon, Tier 3's map, the presets), §12 (the
    Observatory's Tier 3 column: H103's), §15 (the save: H102's), §17's EP12, EP24–EP27 and EP29 rows.
  - [uma-templates.md](../../design/tier-rework/uma-templates.md) §3.4 (UT8: a matched Uma's preset wears her signature).
  - stat-balance SB8 (the Great Pendant 0.575, the Toll Bell to 2.5 in Tier 3) and §4.
- **Releases 2–4's packets and D-rows:**
  - **H84:** `accessorySlots(tier, engine)`, `accessoryFormOpen(form, slotGrade, tier, engine)`,
    `accessoryFormValue(family, form, grade, tier)`, `kindCap(tier)`, `capKindOffense(map, tier)`, the value rule
    `round(round(share × ORB_T1[g]) × multiplier(t))`, the setting `{ grade, family, form, kind?, kinds? }`, the setter's
    refusals, the input's Bell `step` and `top`, the Insignia's scope, `BattleState.tolls` and `firstActs`, Tier 2's
    presets (first form to her higher-graded slot; a slot below G5 takes its form's base), UT8's swap.
  - **H85:** `WEAPON_MOON_T1`, `weaponMoonNode`, `weaponMoonOffense(open, setting, tier)`, `weaponMoonPreset`,
    `observatoryNodeCount(tier, engine)`, `weaponMoonOpen(tier, engine)`, `setWeaponMoon`/`clearWeaponMoon`, node ids
    `weapon-moon-1:1–5`, **`stars.moons` stored only once she sets it, an empty list reading her preset**,
    `BattleAlly.moon` (flat offense by kind; v18 refuses more than two kinds or a value above the tier's Full total).
  - **H87:** promotion's accessory slots at G0 in base forms (Release 3: a branch needs its slot's G5); the parse.
  - **H91:** `classPreset(classId, …, branch)` (branch 2's sets, accessories and moons).
- **The code:** the accessory and weapon-moon modules H84 and H85 wrote (beside H75's and H76's), `save/presets.ts`
  (`classPreset`, `applyClassPreset`, `wearClassPreset`), `save/sheet.ts` (`umaBattleSheet`), the jewel setter (H76's,
  extended by H85), `rpg/battle/engine.ts` (`validAlly`), `world/balance-party.ts` (H104 dresses Tier 3 from your
  presets).

## Decisions made

- **Tier 3 only, behind the stage.** Every rule below reads `rpgRework('t3', engine)` and the world's or ally's tier.
  Before v20 a Tier 3 world keeps Release 3's two slots, branches at G5 and one moon.
- **Slots** (WP19): `accessorySlots(tier, engine)` is **1 · 2 · 3** by tier from v20, untyped, **one accessory of each
  family** (three of Pendant, Orb, Bell, Insignia in Tier 3). The third slot starts at G0 and rises on Accessory
  Settings like the others.
- **Forms in Tier 3** (WP34, §5.3):
  - **Every branch form is open in Tier 3 at any grade** (`accessoryFormOpen` from v20 in Tier 3). WP §5.3 says the
    forms stay known at promotion; an Uma reaches Tier 3 only through Tier 2's Rift at Lv 50, where an on-curve slot is
    G10, so what she opened is derived, never stored (README §9.3: "the accessory step derived from the slot's grade (no
    field)"). This replaces Release 3's interim for Tier 3 (a branch at its slot's G5).
  - **Below a slot's G5 a branch holds its Tier 2 share; from the slot's G5 it takes its Tier 3 step.** The base forms
    never step. `accessoryFormValue` gains the engine (`…, tier, engine`) and applies H84's rule with the step's share:

    | Form | Tier 2 share | **Tier 3 step** (a Tier 3 slot's G5 on) | Tier 3 at G10, by H84's rule |
    |---|---|---|---|
    | Great Pendant, each of her three kinds | 0.55 | **0.575** (SB8) | **+52** |
    | Channel Pendant, two kinds of one channel | 0.8 | **0.85** | **+75** |
    | Great Orb, one kind | 1.2 | **1.3** | **+114** |
    | Twin Orb, each kind of one twin set | 0.8 | **0.85** | **+75** |
    | Great Bell, the follow-up's power a grade | 0.14 | **0.15** | **1.5** |
    | Toll Bell: first ring, + a step each ring, up to a top (a grade) | 0.05, +0.05, top 0.2 | **top 0.25** | **0.5, +0.5 a ring, to 2.5** |
    | Great Insignia, sub-bosses and bosses, a grade | +2% | **+2.25%** | **+22.5%** |
    | Onslaught Insignia, her first act each wave, a grade | +2.5% | **+2.75%** | **+27.5%** |

    **The rule wins over §5.4's printed cells,** as H84 decided for Tier 2: the Great Pendant's G10 is +52 by
    `round(round(0.575 × 34) × 2.6)` where §5.4 prints +51 (0.575 × 88); its G5 16 where §5.4 prints 17. The delivery
    lists every Tier 3 cell that differs.
- **The kind cap in Tier 3** (WP24): `kindCap(3)` is **+177** (round(68 × 2.6)). A Great Orb (+114) and a Channel
  Pendant (+75) on one kind cap at +177; a Great Orb and a Great Pendant (+166) stay under. The weapon moons sit outside
  it (EP27). The sheet reads "Lance +177 (capped) · Lance moon +130".
- **The second weapon moon** (EP26): node ids **`weapon-moon-2:1–5`**, Lv 6, 16, 26, 36, 46, Moon Jewels I–V, Full or
  Split at Tier 3's values (`weaponMoonNode`: Full +10, +18, +26, +34, +42 = +130; Split +7, +13, +18, +24, +29 = +91
  on each kind). `observatoryNodeCount(3, engine)` is **30** from v20.
  - **Every weapon moon on a different kind; at most one Split:** Full + Split (three kinds) or Full + Full (two);
    Split + Split refused ("One Split moon at most"); a kind the other moon holds refused ("Weapon moon 1 has the
    Lance"). Either moon may be the Full one.
  - **`stars.moons` stays derived where she hasn't set it** (H85's rule): **empty reads Tier 3's preset, both moons;
    one entry is her moon 1, and moon 2 reads its complement:** her slotted kinds moon 1 doesn't hold, a Full on the one
    left when moon 1 is Split, a Split on the first two left when moon 1 is Full. Why: a Tier 3 world that exists at the
    switch holds one moon (Tier 2's shape); deriving the second needs her class and weapons, which the input builder
    has and a literal migration doesn't (H102 leaves `moons` as it is).
  - `setWeaponMoon(save, outfitId, setting, now, tier, moon = 1)` and `clearWeaponMoon(…, moon)` take which moon; in
    Tier 3 setting moon 2 stores both entries (moon 1's derived setting written out). A moon's kind she doesn't slot adds
    nothing ("No Bow in her slots"), as H85's.
  - **The jewel setter** in Tier 3 offers weapon moon 2 as a target; its "next moon" order puts it after weapon moon 1,
    the one furthest behind first (EP §12).
  - `weaponMoonOffense` sums both moons by kind; `weaponMoonPreset(…, tier, engine)` returns two settings in Tier 3.
- **The engine** (v20, a Tier 3 ally only), no new rule:
  - accessories: up to **three**, one of each family, the step's numbers in the fields H84 freezes (a Toll Bell's `top`
    up to 0.25 a grade, Onslaught's and the Great Insignia's Tier 3 values), the flat forms capped at 177;
  - `BattleAlly.moon`: up to **three kinds** (Full + Split), each at most a Full moon's Tier 3 total (130).
  Before v20, or on a Tier 1 or Tier 2 ally, v19's limits (`RangeError('Invalid battle ally')`).
- **Tier 3's presets** (WP25, EP29), by class branch (H91's `classPreset(classId, tier, engine, branch)`), applied in one
  tap as Release 4's are (the branch's set, its accessories, its moons). The forms go to her slots highest grade first
  in the table's order (H84's rule); **no base fallback in Tier 3** (every branch is open). Moon 1 is the Full, moon 2
  the Split.

  | Class · branch | Accessories (three slots) | Weapon moons |
  |---|---|---|
  | Brawler · Berserker | Great Bell · Lance; Channel Pendant · Axe + Lance; Onslaught | Full Lance; Split Greatsword + Axe |
  | Brawler · Warlord | Great Bell · Bow; Channel Pendant · Bow + Axe; Onslaught | Full Bow; Split Katana + Axe |
  | Mage · Sage | Channel Pendant · Fire + Ice; Onslaught; Great Bell · Fire | Full Fire; Split Ice + Lightning |
  | Mage · Sorcerer | Channel Pendant · Light + Ice; Onslaught; Great Bell · Light | Full Light; Split Dark + Ice |
  | Spell Blade · Rune Knight | Great Pendant; Great Orb · Lance; Onslaught | Full Lance; Split Katana + Lightning |
  | Spell Blade · Blademaster | Great Pendant; Great Orb · Katana; Onslaught | Full Katana; Split Bow + Dark |
  | Summoner · Warlock | Great Pendant; Great Orb · Light; Onslaught | Full Light; Split Dark + Bow |
  | Summoner · Conjurer | Great Orb · Fire; Onslaught; Great Pendant | Full Fire; Split Lightning + Greatsword |
  | Paladin · Guardian | Great Pendant; Great Orb · Light; Onslaught | Full Light; Split Greatsword + Axe |
  | Paladin · Templar | Channel Pendant · Bow + Katana; Onslaught; Great Orb · Light | Full Bow; Split Katana + Light |
  | Cleric · Bishop | Channel Pendant · Light + Ice; Onslaught; Great Orb · Bow | Full Light; Split Ice + Bow |
  | Cleric · Oracle | Great Pendant; Great Orb · Greatsword; Onslaught | Full Greatsword; Split Light + Fire |

  - **UT8:** when the row lacks her signature family, it takes the slot of the form that adds least for her class in
    §5.7's Tier 3 campaign row, in its best Tier 3 form (H84's table read from Tier 3's rows; the delivery prints it).
  - Every preset kind stays under the cap; the balance party (no template) plays the table as written (H104).
- **The save actions** (H84's setter, H85's moon setter and jewel setter, the preset's apply): a form in the third slot,
  moon 2, a Moon Jewel on it, Tier 3's preset. They act in a Tier 3 world while `rpgRework('t3')`; dark, Release 3's.
  The save's types widen here (a third slot, two `stars.moons` entries, `weapon-moon-2:*` ids); H102 parses them
  strictly and brings Ascend into Tier 3's shape.
- **No screen, no manual change.** `pnpm docs:update` leaves no diff.

## Do

1. **The accessory module:** slots by tier, `accessoryFormOpen` and `accessoryFormValue` with Tier 3's step, `kindCap(3)`.
2. **The weapon-moon module:** weapon moon 2's nodes and values, the settings' checks, the derived second moon,
   `setWeaponMoon`'s `moon`, the jewel setter's target, `observatoryNodeCount`.
3. **The engine's v20 validation** for a Tier 3 ally's three accessories and two moons.
4. **Presets:** Tier 3's table (both branches) through `classPreset`, with UT8.
5. **The save actions** as decided, gated.
6. **Tests** (beside H84's and H85's; mock with `capsAt(20, …)`):
   - accessories: slots 1 · 2 · 3 (3 only from v20 in a Tier 3 world); one of each family; each step row above at G5
     and G10 by the rule; a branch at a Tier 3 slot's G3 open at its Tier 2 share (and refused "Opens at G5" at v19); the
     base forms unchanged; the cap at 177 (a Great Orb and a Channel Pendant on one kind) and a Great Orb with a Great
     Pendant under it.
   - weapon moons: moon 2's node values at Lv 6, 26 and 46; Full + Split serves three kinds, Full + Full two; Split +
     Split and a shared kind refused; an empty `moons` reads both presets; one entry derives moon 2 as its complement
     (a Split Fire + Ice → a Full on her third slotted kind); a moon kind not slotted adds nothing; 30 nodes in Tier 3.
   - `save/presets-t3.test.ts`: the twelve rows for Tier 3; every kind under the cap; a matched Uma with a Bell
     signature in a row without a Bell takes it in the least form's slot.
   - `rpg/battle/engine-v20.test.ts` (H98's file): a Tier 3 ally with three accessories and three moon kinds plays a
     round on Auto at v20; a fourth accessory, two of one family, a fourth moon kind or a moon above 130 throws `Invalid
     battle ally`; the same ally at v19 or as a Tier 2 ally throws.
   - The actions: the third slot takes a form, a fourth family refused; setting moon 2; a Moon Jewel set on it;
     unmocked, a Tier 3 world keeps two slots and one moon.
   - H98's v19 replay tests and every existing test pass unchanged.
7. **Docs:** weapon-progression §5.3 and extra-stats-progression §5.1 gain "Built in H99 (D…), live from H105." Log the
   D-row (fetch `main` first). `pnpm docs:update` leaves no diff.
8. **Check it locally** (your own ports; a desktop browser at 390×844; never the iOS Simulator), on a scratch save from
   the CJS build with a Tier 3 world of Tier 2's shape: its Gear tab shows two accessory rows and its Observatory one
   weapon moon, as before; a Tier 3 world stage on Auto plays and its open fight reads `"version": 19`.

## Done when

- [ ] `pnpm lint && pnpm test && pnpm build` pass; say the main JS number (gzip, of 230 KB).
- [ ] The tests in step 6 pass; both v19 replay tests pass untouched.
- [ ] `git diff` shows no switch (`BATTLE_ENGINE_VERSION` 19, `SAVE_SCHEMA_VERSION` 30).
- [ ] `docs/game/` is unchanged, `pnpm docs:update` leaves no diff, the D-row is logged, the design docs have their
  lines.
- [ ] The local check in step 8 was done and described. Nothing from the original games in git.
- [ ] Deployed green and https://uma-rpg.web.app/api/health shows the commit.

## Deliver

- **Claude, as a delegated worker:** a pull request from `feat/h99-t3-accessories-weapon-moon-2` with one commit,
  `feat(domain): Tier 3's accessories and the second weapon moon, dark (H99)`. H100 and H101 run beside you: H100 edits
  `engine.ts`' validation and H98's test file too, so rebase on whichever lands first; H101 shares no file. Fetch
  `main` before you push. The main session reviews and merges it, then watches the deploy.
- **Flag it done:** after the merge, a `docs(handoff): H99 done (D…)` commit deletes this file, sets H99 to Done in
  `docs/handoff/README.md` with a Done row, and sets H102 to Ready if H100 is done, and H104 if H100 and H101 are.
