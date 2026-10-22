# H56 — Engine v15: the healers and the halls (offense scaling, doubled shares, Regen, the Paladin's kit, 24 Limit Breaks), dark

**uma-rpg · Claude · L · Needs: H53 · Unblocks: H59 (the halls and the cues), H60 (balance)**

## Why

Classes v2 splits today's Cleric into two healers and gives the party **one** of them ([classes-v2.md](../../design/classes-v2.md)
§3.3, §4, C7, C8):
- the **Paladin** heals and shields from **ATK**, the **Cleric** from **M.ATK**; Heal (from Guts) retires;
- with one healer a party, **every mend and Barrier share doubles** and the Barrier cap rises to 60%;
- they take over the Summoner's old supports: Blizzard Barriers, Greatsword Aegis, Axe Enfeeble and a Valkyrie revive go
  to the Paladin; Light's lingering mend (as **Regen**) and Dark's drain go to the Cleric;
- the Summoner keeps no support at all.

And the Halls of Heroes grow to six (§5): the Paladin Bastion takes the Chapel's seats 3–4, the Chapel and the Bastion
each gain two new Limit Breaks, two Limit Breaks change shape, the hybrids' Limit Break power rises to 2.2×, and an
inherited Limit Break hits with the Learner's higher offense (C3).

All of it is engine v15, dark: v6–v14 fights replay as they were, and nothing starts a v15 fight until H61.

## Context (read first)

- `CLAUDE.md`, `AGENTS.md`, classes-v2.md §3.3, §4, §5, §6.3 (the Thorn Talisman's row), §9 (rows 3 and 5 are H60's
  targets for this packet), §10 (C3, C7, C8), D106–D112 (the halls), D141 (v12's supports), D160, H53's D-rows.
- The manual for how it plays today: [combat.md](../../game/combat.md) § Support (v12) and the `battle-constants` block,
  [heroes.md](../../game/heroes.md) and its `heroes` block.
- **H53's work:** `caps.ts` (`rpgV2`, `BATTLE_HEAL_OFFENSE_SCALE` 300), `rpgIsHealer`, the Paladin's trees in `catalog.ts`
  (the Cleric's builder and names; Axe statuses on every foe from depth 4; Lance 4B "Valkyrie's Oath"; no `support`),
  `heroLimitFor(id, version)` and `heroLimitPower(classId, version)` in `heroes.ts` (today's table for every version), the
  v14 replay fixture and its two tests.
- **The engine** (`rpg/battle/engine.ts`, lines on `c8d0cea`; H53 shifted them a little):
  - 189–193 `clone`; 297–335 `battleDamage` (offense at 305–306: the hit's channel stat plus its kind's Might);
  - **the support section, 350–440:** `healOf` 353 (Heal from `stats.dexterity` ÷ `BATTLE_HEAL_SCALE`), `mostHurt`,
    `threatOn`, `mostThreatened`, `heal`, `cover` 378–383 (cap `BATTLE_COVER_CAP` 0.4), `support` 387–421 (mend, shield,
    drain, cleanse, revive 404–414, bless), `battleSupportValue` 424–440;
  - 558–592 `harm`: a guard who intercepts takes the hit at `BATTLE_GUARD_FACTOR`; Thorns and Mirror return a share of
    `taken`, the halved amount (583–591);
  - 726–735, the end of a round: skill Barriers clear, then each lingering summon that mends mends again;
  - 756–762 `addBarrier`; 781–840 `cast` (826 `allies`; 828–838 the support after the hits, `supportScale`);
  - **921–935, the limit branch** of `applyBattleAction`: each cast at `c.scale` (a Learner's capacity), support at 1.
  - H55 edits the acting section at the same time (`halfOf` to `resolveHalf`, the acting branch 936–958, `bestAction`,
    `firstAttack`): stay out of it.
- `rpg/battle/skills.ts` 23–31 (support constants), `types.ts` 158–172 (`BattleState`, `summons`).
- `rpg/catalog.ts`: 19–21 `RPG_SUPPORT_SHARE` [0.14 … 0.22] and `RPG_SUPPORT_ALL` 0.4; 27–51 `RpgSkillDef` (`support`
  is v12–v14's); 57–70 `RpgSupport`; 99–118 `describe` (the node summaries the skill screens and the manual print);
  246–307 the Summoner (`summonSupport` 264–275; the Light capstone's `allies` Barrier at 295); 336–378 the Cleric
  (`clericSupport` 358–363, `cleric()` 364–369, Rebirth 371–377).
- `rpg/heroes.ts`: 13 `HERO_LIMIT_POWER`; 15–27 `HeroHit`, `HeroCast` (a status, no support), `HeroLimit`; 34–83 the
  twenty Limit Breaks (Sunfire Edge 54–55, Archangel's Verdict `cleric-3` 67–69, Archdemon's Pact `cleric-4` 70–73,
  Moon Fox 81–82); 85–95; 101–110 `heroLimitSkills`.
- `rpg/battle/limit.ts` 21–37 (`BattleLimitPlan`, `heroPlan`: `from` is set only for a Learner), 45–56.
- `rpg/battle/auto.ts` 32–39 `supportScore`, 45–79 the Limit Break choice.
- Readers of the live table, which must not move before the switch: `docs/render.ts` 160–175 (`heroes` block),
  `apps/web/src/places/halls/HallPage.tsx` (`heroLimitsOf`), `apps/web/src/battle/battle-view.ts` 81–83 (`heroLimit`).

## Decisions made

- **Every rule below is v15 only.** v6–v14 read today's fields and numbers, which the v14 fixture proves.
- **The v15 kit has its own field.** `RpgSkillDef.support15?: RpgSupport`. From v15 the engine reads `support15` and never
  `support`; before v15 `support` and never `support15`. Cleric and Paladin nodes get `support15`; Summoner nodes get
  none, so from v15 her lines only strike (§3.2). From v15 `allies` (only the Light capstone summon's Barrier) is ignored,
  and lingering summons no longer mend at the round's end. `describe` prints the live generation's support, so the node
  summaries move at the switch.
- **Doubled shares (C8):** `RPG_SUPPORT_SHARE_V15 = [0.28, 0.32, 0.36, 0.40, 0.44]`; on every Uma still ×
  `RPG_SUPPORT_ALL` (0.4), so 11–18%. The Barrier cap from v15 is `BATTLE_COVER_CAP_V15` = 0.6. A revive stays 25% of max
  HP, the cleanse one status, the damage hand ×0.5.
- **Scaling (§3.3):** from v15 every mend, Barrier and revive is × (1 + offense ÷ `BATTLE_HEAL_OFFENSE_SCALE`), offense
  being the Paladin's `stats.atk`, the Cleric's `stats.matk`, and anyone else's higher of the two (a Learner casting a
  Chapel or Bastion Limit Break). A fight's `stats` already hold her base, Extra Stats and armor, and Might lives apart,
  so this is "not weapon Might" as §3.3 asks. Heal (`dexterity`) is never read from v15.
- **The kit both healers share** (today's Cleric kit at the doubled shares): her Arms blows put a Barrier on the Uma the
  shown moves threaten most (every Uma at depth 5); her Tome spells mend the most hurt (every Uma at depth 5) and
  cleanse; statuses as today.
- **The Paladin's extras (§4):**
  - **Blizzard Tome spells** also raise a Barrier on every Uma at 0.35 of their share: `RpgSupport.shieldShare`, so the
    mend keeps its own share;
  - **Greatsword blows** give Aegis 1 (2 at depth 5) to each Uma their Barrier reaches: `RpgSupport.aegis`;
  - **Axe statuses** on every foe from depth 4 (H53's tree data; tested here);
  - **Valkyrie's Oath** (Lance 4B): its Heavy shape plus `revive`: the first fallen Uma rises at 25% (× her scaling),
    once per Uma per fight, as Rebirth does.
- **The Cleric's extras (§4):**
  - **Light spells leave Regen:** their mend repeats at `BATTLE_REGEN_SHARE` (0.3) of its share at the end of each of the
    next `BATTLE_REGEN_ROUNDS` (2) rounds, choosing its target each time (the most hurt; every Uma at depth 5);
  - **Dark spells drain** 30% of their damage to the most hurt (`drain: 0.3`);
  - Rebirth (Light 3B) is unchanged, with Regen as a Light spell.
- **Regen is not a status.** It's a v15-only `BattleState.regens?: { allyId; mend: 'hurt' | 'all'; share; rounds }[]`, one
  per Cleric: her next Light spell replaces it, it ticks at the end of a round after skill Barriers clear (where lingering
  summons mended before), each heal a `heal` cue labelled "Regen", and it ends if she falls (as a lingering summon's did).
  Why: a status has stacks and turns, not a caster's offense and share, and `summons` already models one caster's
  lingering effect. Absent below v15, so older states hash as before; `clone` copies it.
- **Thorns on guarded hits (§6.3):** from v15 a guard's Thorn Talisman or Mirror Amulet returns its share of the whole
  hit she intercepts, before the guard halves it. (Since v11 a guard already returned her share of the half she took;
  this is the change the table asks for.)
- **The halls (§5), a v15 table of 24 Limit Breaks.** `heroLimitFor(id, 15)`:

  | Seat | Limit Break | v15 |
  |---|---|---|
  | `brawler-1…4`, `mage-1…4`, `spellblade-2…4`, `summoner-1…3`, `cleric-1…2` | as today | unchanged |
  | `spellblade-1` | Sunfire Edge | **three** Greatsword-and-Fire cleaves on one foe (0.7 in all), then its Fire splash (0.3) on every other foe after the last |
  | `summoner-4` | Moon Fox | eight strikes on **random** foes, Katana, Dark, Bow and Light in turn |
  | `cleric-3` | **Dawn Hymn** (new) | Fire on every foe, then a mend on every Uma |
  | `cleric-4` | **Frost Sanctuary** (new) | Ice on every foe, then a cleanse and a Barrier on every Uma |
  | `paladin-1` | Archangel's Verdict | today's `cleric-3`, moved, `classId: 'paladin'` |
  | `paladin-2` | Archdemon's Pact | today's `cleric-4`, moved |
  | `paladin-3` | **Rampart Charge** (new) | one Greatsword charge on one foe, then a Barrier on every Uma |
  | `paladin-4` | **Valkyrie Lances** (new) | four Lance hits at random foes, then the first fallen Uma rises (25%) |

  - Blurbs in today's voice ("Fire on every foe, then a mend on every ally"). Names are original and generic.
  - The new Limit Breaks' support goes in `HeroCast.support?` (→ `support15` on the cast's skill): a mend or Barrier at
    share **0.66** (1.5× the depth-5 doubled share, as their class's Limit Break power is 1.5×), × 0.4 on every Uma, ×
    the caster's scaling. H60 tunes it.
  - **A Limit Break's support works at its strength:** a Learner's at her capacity (50% + 5% a Bond), a Hero's at 100%
    (`supportScale` = the cast's `scale`). Careful: today `support()` reads a scale under 1 as "a lingering summon" and
    returns before its cleanse, revive and blessing (engine 395). From v15 keep those two apart: a Limit Break's strength
    scales only the shares, and a Learner's Frost Sanctuary still cleanses and her Valkyrie Lances still revive.
  - Why these shapes: §5's two seats per hall, Tome-led for the Chapel and Arms-led for the Bastion; each mends, shields
    or revives, so a Learner of any class can carry a healer's Limit Break.
- **Power (§5):** `heroLimitPower(classId, 15)`: Brawler 2, Mage 2.4, Spell Blade **2.2**, Summoner **2.2**, Paladin 1.5,
  Cleric 1.5.
- **Inheritance (C3):** from v15 a **Learner's** inherited Limit Break hits with the higher of her ATK and M.ATK as its
  base offense; each hit still adds its own kind's Might, and its kinds still decide weaknesses and locks. A Hero's own
  Limit Break uses each kind's offense as today: C3 names inherited ones.
- **Live readers stay live.** `HERO_LIMITS`, `heroLimit(id)` and `heroLimitsOf(classId)` return the live generation's table
  (so the Halls page and the `heroes` block move at the switch); the engine always calls `heroLimitFor(id, version)`.
- **Auto (v15):** `supportScore` reads the version's support; it values a Barrier-on-all share like a shield on all,
  Aegis like a blessing, and Regen as its two repeats at half weight (they may not be needed). The Limit Break choice is
  unchanged.
- **No save, no screen.** Main JS unchanged (engine, catalog and heroes are lazy; check `heroes-*.js` stays a lazy
  chunk).

## Do

1. **`rpg/catalog.ts`:** `support15` on `RpgSkillDef`; `RpgSupport` gains `shieldShare?`, `aegis?` and `regen?`;
   `RPG_SUPPORT_SHARE_V15`; the Cleric's and the Paladin's `support15` as decided (the Cleric's `support` stays exactly
   as it is); `describe` by the live generation.
2. **`rpg/battle/skills.ts`:** `BATTLE_COVER_CAP_V15`, `BATTLE_REGEN_SHARE`, `BATTLE_REGEN_ROUNDS`, each with a comment.
3. **`rpg/battle/types.ts`:** `BattleState.regens?` with a doc comment.
4. **`rpg/battle/engine.ts`** (your regions only: `clone`, `battleDamage`'s offense line for C3, the support section,
   `harm`'s Thorns, the end of a round, `cast`'s `allies` and support, the limit branch):
   - the v15 support (field, scaling, cap, `shieldShare`, `aegis`, `regen`, revive scaling) and `battleSupportValue`;
   - Regen's state and its tick; Thorns on guarded hits;
   - the limit branch: v15 tables through `heroLimitFor`, `supportScale` = the cast's scale, C3 for a Learner's plan.
5. **`rpg/heroes.ts`:** the v15 table and powers in `heroLimitFor`/`heroLimitPower`; `HeroCast.support?`;
   `heroLimitSkills` carries it to `support15`; the live `HERO_LIMITS`, `heroLimit`, `heroLimitsOf`.
6. **`rpg/battle/limit.ts`:** `heroPlan` by version (already threaded by H53); nothing else changes for v6–v9's class
   Limit Breaks.
7. **`rpg/battle/auto.ts`:** `supportScore` for v15 (your function only; H55 edits `bestAction` and `firstAttack`).
8. **Tests**, in new files `rpg/battle/healers-v15.test.ts` and `rpg/battle/halls-v15.test.ts` (inputs `version: 15`):
   - a Paladin's depth-1 Arms blow raises a Barrier, and a Cleric's depth-1 Tome spell a mend, of 28% × (1 + her ATK
     or M.ATK ÷ 300) of the target's max HP; at depth 5 each reaches every Uma at 44% × 0.4 × that scaling; a Barrier
     stops at 60% of max HP;
   - a v14 Cleric's mend still reads her Heal (and the fixture still passes);
   - a v15 Summoner's Light, Blizzard, Dark, Greatsword, Axe and Lance summons mend, shield, drain, bless, curse and
     revive nothing, her Light capstone raises no Barrier, and her lingering summon doesn't mend at the round's end;
   - the Paladin's Blizzard spell: its mend on the most hurt and a Barrier on every Uma at 0.35 of its share; her
     Greatsword blow: Aegis 1 on the threatened Uma, and at depth 5 Aegis 2 on every Uma; her depth-4 Axe Enfeebles
     every foe, the Cleric's depth-4 Axe one; Valkyrie's Oath raises the first fallen once;
   - the Cleric's Light spell: two round-end "Regen" heals at 0.3 of the mend, then none; her next Light spell replaces
     it; it ends when she falls; her Dark spell heals the most hurt by 30% of its damage;
   - a Thorn guard returns her share of the whole hit she intercepted (v15) and of the half she took (v14);
   - `heroLimitFor` gives 20 Limit Breaks for v14 (byte-identical to today's) and 24 for v15; `cleric-3` is Archangel's
     Verdict at v14 and Dawn Hymn at v15, `paladin-1` Archangel's Verdict at v15; Sunfire Edge's v15 shape lands three
     two-kind cleaves then the splash; Moon Fox hits random foes; each new Limit Break does what the table says; a
     Learner's at Bond 0 mends at half a Hero's, and her Frost Sanctuary still cleanses and her Valkyrie Lances still
     revive;
   - a Spell Blade's Limit Break power is 2.2× at v15 and 2× at v14;
   - C3: a Mage Learner of Arsenal Rush hits harder at v15 than at v14 (her M.ATK, not her ATK), and her hits' kinds are
     still Arms for weaknesses;
   - Auto: a party with a Paladin, then one with a Cleric, keeps a hurt Uma mended or shielded on a world boss stage;
   - the v14 fixture tests stay green, untouched.
9. **Docs:** classes-v2.md §3.3, §4 and §5 each gain "Built in H56 (D…), live from H61." Log the D-decision (fetch `main`
   first). `pnpm docs:update` leaves no diff (the `heroes` and `battle-constants` blocks read the live generation; H61
   adds the v15 rows).
10. **Check it locally** (your own ports, 390×844): a world-map stage with a Cleric and a Summoner on Auto plays as
    before; the Learning page's Cleric Chapel still lists Archangel's Verdict and Archdemon's Pact in seats 3–4.

## Done when

- [ ] `pnpm lint && pnpm test && pnpm build` pass; main JS unchanged (say the number).
- [ ] The tests in step 8 pass; both v14 replay tests pass untouched.
- [ ] `docs/game/` is unchanged, `pnpm docs:update` leaves no diff, the D-decision is logged, classes-v2 has its lines.
- [ ] The local check in step 10 was done and described. Nothing from the original games in git.
- [ ] Deployed green and https://uma-rpg.web.app/api/health shows the commit.

## Deliver

- **Claude, as a delegated worker:** a pull request from `feat/h56-engine-v15-healers-halls` with one commit,
  `feat(domain): engine v15 healers and the six halls' Limit Breaks (H56)`. H55 edits `engine.ts`'s acting section and
  `auto.ts`'s `bestAction`/`firstAttack` at the same time: stay in your regions and rebase on whichever lands first. Fetch
  `main` before you push. The main session reviews and merges it, then watches the deploy.
- **Flag it done:** after the merge, a `docs(handoff): H56 done (D…)` commit deletes this file, sets H56 to Done with a
  Done row, and sets H59 and H60 to Ready if their other needs are done.
