# H85 — The weapon moon: Full or Split, its jewels and gates, outside the kind cap, the presets (dark)

**uma-rpg · Claude · M · Needs: H83 · Unblocks: H87, H89 (and through them H88, H90)**

## Why

The owner's Extra Stats review (D194): "Tier 2 and Tier 3 feel too low impact … a single moon with multiple levels that
increases a single weapon type's stats; if it's a Dual weapon vs Pure maybe we reflect that here". Release 2 built the
Planet and three moons for every tier. From Tier 2 the map gains **a weapon moon**
([extra-stats-progression.md](../../design/tier-rework/extra-stats-progression.md) §4):
- five nodes of **flat offense on her hits of one kind** (+50 × tier, Full) **or two** (0.7 each, Split), opened by
  Moon Jewels I–V at Lv 6–46 (EP24, EP25);
- **outside the kind cap**, never a heal, never a kind (EP27, EP10);
- **preset** on her two most-used kinds, a hybrid's on her lead half (EP29, SB10).

Measured in the design: +12–16% to her act in Tier 2 (+17–23% on its kinds' hits). It is engine v19 data on one new
input field and an Observatory body, all dark until H90.

## Context (read first)

Code pointers are by file and function: Releases 1 and 2 move the lines. Re-read the code before starting.

- `CLAUDE.md`, `AGENTS.md`; [implementation.md](../../design/tier-rework/implementation.md) (D198); **H83's two D-rows**
  (Release 3's build decisions: Tier 3 worlds play one weapon moon at Tier 3's values; `stars.moons` empty reads her
  preset; Ascend).
- The design: [extra-stats-progression.md](../../design/tier-rework/extra-stats-progression.md) §2 (the shared rules:
  in order, at Lv 5g − 4, EP7's rounding, never a heal or a kind), **§4.1–§4.3** (EP24, EP25, EP10, EP27), §5.3 (EP29,
  the presets table and the SB10 follow-up), §11 (Moon Jewels, by the ladder), **§12** (the Observatory, EP19, EP20),
  §15 (save). [weapon-progression.md](../../design/tier-rework/weapon-progression.md) §2.4 (WP31 step 1: the moon on the
  hit's own kind, outside the cap), §3.9 (WP13), §5.6 (WP24). [stat-balance.md](../../design/tier-rework/stat-balance.md)
  SB10, §3.4 (the moon a quarter of Tier 2's toolbox).
- **Release 2's work:** H76 (the Planet, Prowess, Vigor, Guard, her moon; `stars: { open, moons: [] }`; node ids
  `planet:1–5`, `prowess:1–5` …; the jewel setter and its order; gates), H77 (Moon Jewel recipes by the ladder: Tier 2's
  Moon Jewel V is 3 Cut Diamond, 1 Titanium Ingot), H79 (the Observatory page and the Battle tab's Offense group).
- **The code** (as Release 2 left it): the Extra Stats module in `economy/` (node values, `stars` points, the on-curve
  map) and `save/observatory.ts` (the jewel setter, blocks, counts); `save/presets.ts` (the standard preset); the input
  builder `partyMembers` in `save/battle.ts`; `save/sheet.ts` (`umaBattleSheet`'s Offense rows); `rpg/battle/engine.ts`
  (`validAlly`, the offense line of `battleDamage`, the heal paths that read ATK or M.ATK); `rpg/weapon-branches.ts`
  (H83); H84's accessory table (its flat forms sit under the cap the moon stays out of).

## Decisions made

**Approved calls, exact values:**
- **EP24 · A weapon moon:** five nodes, **Moon Jewels I–V, Lv 6, 16, 26, 36, 46**, in order; Full node values +4, +7,
  +10, +13, +16 (+50) × tier, **rounded per node**: **Tier 2 +7, +13, +18, +23, +29 = +90**; Tier 3 +10, +18, +26,
  +34, +42 = +130. It joins her offense on **every hit whose own kind it is**: Attacks, skills, summons, a Bell's
  follow-up, each half of a hybrid's pair by its own kind, and Limit Breaks of that kind.
- **EP25 · Full or Split:** Full one kind; **Split two different kinds, each node 0.7 of the Full node, rounded**:
  **Tier 2 +5, +9, +13, +16, +20 = +63** on each; Tier 3 +7, +13, +18, +24, +29 = +91. The same five nodes and jewels
  light both moonlets.
- **EP27 · Outside the kind cap**, bounded by its own size. **Never a heal** (mends and Barriers read ATK or M.ATK
  without it) and **never a kind** (weaknesses, locks and shields never read it). **WP13:** a Dual's partner never
  earns it.
- **EP10:** a weapon moon serves kinds, never a group. Its kinds are a setting, free outside fights; the picker lists her
  three slotted kinds first, then the rest (R4 orders them by her class branch's groups).
- **EP29 · Tier 2's preset:** **Split on her two most-used kinds**: a hybrid's lead half (SB10: the Spell Blade's two
  Arms, the Summoner's two Tomes), everyone else her Dual's kind first, then her slots in order. With §3.8's Duals this
  is the table's branch 1: Brawler Split Lance + Greatsword, Mage Fire + Ice, Spell Blade Lance + Katana, Summoner
  Light + Dark, Paladin Light + Greatsword, Cleric Light + Ice. Branch 2's column comes with R4.
- **EP19 · The Observatory:** "Open n of 25" in Tier 2; the weapon moon on the outer orbit, named for its kind ("Lance")
  or two moonlets on one track ("Lance · Greatsword"); a node's sheet ("Weapon moon III · Split · Lance +13,
  Greatsword +13"); totals "+ Lance +63 · Greatsword +63"; a chip under the map, "Weapon moon · Split · Lance +
  Greatsword ▾" (Full or Split, then its kinds). The screens are H88's; this packet gives them their data.
- **EP20:** targets plan the weapon moon's five jewels; "can upgrade" counts a jewel she can set on it now.

**This packet's decisions:**
- **Where Tier 3 worlds stand in R3:** one weapon moon at Tier 3's values (+130 Full, +91 Split), 25 nodes; the second
  weapon moon is R5's (H83's D-row, point 2).
- **`stars.moons` is stored only once she sets her moon; an empty list reads her preset** (H83's point 7), derived from
  her active class, weapons and branches each time, so an Uma who never touched it follows her preset as her weapons
  change. "Use the standard preset" clears her setting (back to the preset). Promotion empties it (H87's Ascend). Why:
  the migration can't know a class it would need master data for, and the template's rule is the same (U13: derived,
  not stored).
- **A kind she doesn't slot adds nothing:** the input builder adds the moon only on her three slotted kinds; the sheet
  says "No Bow in her slots" (EP §4.1's words). Why: it keeps the moon "on her weapons" and the engine's input honest.
- **Values module:** beside H76's Extra Stats values (main-bundle safe): `WEAPON_MOON_T1 = [4, 7, 10, 13, 16]`,
  `WEAPON_MOON_SPLIT = 0.7`, `weaponMoonNode(n, mode, tier)` (`round(T1[n] × multiplier)`, a Split node
  `round(0.7 × full node)`), `weaponMoonOffense(open, setting, tier)` (by kind), `weaponMoonPreset(classId, weapons,
  branches)`, `observatoryNodeCount(tier, engine)` (20, then 25 from Tier 2 at the stage), `weaponMoonOpen(tier,
  engine)`. All read `rpgRework('t2Weapons', engine)`.
- **Node ids `weapon-moon-1:1` … `:5`** in `stars.open` (EP §15). The jewel setter (H76's) takes the weapon moon as a
  target in Tier 2+ worlds at the stage; its "next moon" order is H76's map order with the weapon moon after Guard, the
  one furthest behind first. Refusals as H76's ("Opens at Lv 36", "Set Weapon moon III first"), plus "From Tier 2".
- **`setWeaponMoon(save, outfitId, setting, now, tier)`** and `clearWeaponMoon`: `{ mode: 'full', kinds: [a] }` or
  `{ mode: 'split', kinds: [a, b] }`, any kinds; refused in Tier 1 ("From Tier 2"), "Two different kinds", "Pick a kind".
  A change never touches open nodes or jewels.
- **The input, v19:** `BattleAlly.weaponMoon?: Partial<Record<RpgDamageKind, number>>` (flat offense by kind, frozen at the
  fight's start). In `battleDamage` it joins the offense in step 1 on a part whose own kind is a key, **after** the
  capped accessory offense and outside the cap check; Limit Break hits of the kind take it too (WP §3.10). Refused with
  `RangeError('Invalid battle ally')`: any `weaponMoon` before v19; in a Tier 1 ally; more than two kinds; a value above the
  tier's Full total (90 in Tier 2, 130 in Tier 3). The heal paths don't read it (they never read offense by kind).
- **The battle sheet:** the Offense group's lines "Lance moon +90" or "Lance moon +63 · Greatsword moon +63", grey
  "No Bow in her slots" where it applies; her Extra Stats share (H79's green part) unchanged.
- **The foe budget:** the moon is priced in the toolbox term (EP16; H89 measures R3's share), never in the build curve:
  `onCurveStars` (or H76's equivalent) keeps the core's 20 nodes; the balance harness's Tier 2 member adds her preset
  moon explicitly (H89).
- **No save change here:** H87 parses `weapon-moon-1:*` and `stars.moons`; tests build worlds directly.

## Do

1. **The values module** and its functions, with doc comments citing EP24–EP27, EP29, SB10.
2. **The jewel setter, `setWeaponMoon`, `clearWeaponMoon`** and the preset's clearing, behind the stage.
3. **The input:** `BattleAlly.weaponMoon` from v19 in `partyMembers`, the Rift's and the harness's builders; the engine's
   validation and offense line.
4. **The sheet's lines.**
5. **Tests:**
   - `economy/weapon-moon.test.ts`: the four node rows above (Tier 2 and 3, Full and Split) and their totals; no moon in
     Tier 1; `observatoryNodeCount` 20 · 25 (and 20 everywhere at v18); the preset for every class with §3.8's Duals
     equals EP29's branch 1 column; with no Dual the Brawler's is Greatsword + Axe; a Spell Blade's and a Summoner's
     stay on their lead half whatever their Dual.
   - `rpg/battle/moon-v19.test.ts` (inputs at `version: 19`): an Attack of the moon's kind deals exactly the damage of
     her offense + the moon's value; a Dual Lance's hit gains nothing from a Katana moon; a mend and a Barrier are the
     same with and without a moon; with a capped Lance (Great Orb + Channel Pendant at 122) a +90 Lance moon still adds
     90; refused: `weaponMoon` in a v18 input, in a Tier 1 ally, three kinds, a value of 91 in Tier 2.
   - `save/weapon-moon.test.ts` (mocking `caps.ts` to 18): Full and Split set and refused as decided; an empty list
     reads the preset and follows a weapon swap; the preset button clears a setting; Moon Jewel I opens
     `weapon-moon-1:1` at Lv 6, not before, and `:2` waits for `:1`; the default target order includes the weapon moon;
     the sheet's lines and "No Bow in her slots"; a Tier 1 world refuses everything. Unmocked, nothing changes.
   - Every existing test passes unchanged; every replay test stays green.
6. **Docs:** log the D-decision (fetch `main` first). extra-stats-progression §4.1–§4.2 and §5.3 gain "Built in H85
   (D…), live from H90 (Tier 3's second weapon moon: R5)." `pnpm docs:update` leaves no diff.
7. **Check it locally** (your own ports, a desktop browser at 390×844, never the iOS Simulator) on a scratch save from
   the CJS build: the Observatory of a Tier 2 Uma reads "Open n of 20" with no weapon moon, a Moon Jewel sets on a core
   moon as before, and a `w6` stage on Auto stores `"version": 17`.

## Done when

- [ ] `pnpm lint && pnpm test && pnpm build` pass; say the main JS number (of 230 KB).
- [ ] The tests in step 5 pass; every replay test passes untouched.
- [ ] `docs/game/` is unchanged, `pnpm docs:update` leaves no diff, the D-decision is logged, the design doc has its
  lines.
- [ ] The local check in step 7 was done at 390×844 on a scratch save and described. Nothing from the original games in
  git.
- [ ] Deployed green and https://uma-rpg.web.app/api/health shows the commit.

## Deliver

- **Claude, as a delegated worker:** a pull request from `feat/h85-weapon-moon` with one commit,
  `feat(domain): the weapon moon, Full or Split, dark (H85)`. H84 edits the engine, the input builder and the sheet at
  the same time: rebase on whichever lands first. Fetch `main` before you push. The main session reviews and merges it,
  then watches the deploy.
- **Flag it done:** after the merge, a `docs(handoff): H85 done (D…)` commit deletes this file, sets H85 to Done with a
  Done row, and sets H87 and H89 to Ready if their other needs are done.
