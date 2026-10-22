# H55 — Engine v15: the hybrids' hands (the Spell Blade's extra hit, the Summoner's mirrored pair and farewell), dark

**uma-rpg · Claude · M · Needs: H53 · Unblocks: H59 (the fight screen's pairs), H60 (balance)**

## Why

Classes v2 makes the two hybrids mirrors (C9, [classes-v2.md](../../design/classes-v2.md) §3.1–§3.2):
- the **Spell Blade** deals 70% physical and 30% magical, and **her Arms half gains one extra hit**, so an Attack chips
  three shield points: the physical front's shield breaker;
- the **Summoner** is her mirror: a pair of a **Tome summon ×0.63** that lingers and an **Arms summon ×0.27** that
  strikes and leaves; when her next pair comes, the lingering summon's **farewell strikes every foe**: her area identity.

H53 gave the engine their v2 hands (`rpgHand(…, 15)`: Arms 0.63 / Tome 0.27 and the mirror, MP ×0.5 a half). This
packet makes a v15 fight act on them, dark: nothing starts a v15 fight until H61.

## Context (read first)

- `CLAUDE.md`, `AGENTS.md`, classes-v2.md §3.1, §3.2 and §9 (rows 1, 2, 4, 6 and 7 are H60's targets for these hands),
  D160, D169 and D176 (the guard rail), H53's D-rows, and [tier2-classes.md](../../design/tier2-classes.md) §5.7 (the
  Greatsword summon called "Paladin").
- **H53's work:** `rpg/battle/caps.ts` (`rpgV2`), `rpgHand(profile, engine)` with `arms`, `tome`, `pair`, `linger`;
  `battleSkillFor(ally, ref, version)` takes each skill's power from `hand.arms` or `hand.tome`; the v14 replay fixture
  and its two tests (`rpg/battle/v14-replays*.test.ts`), which must stay green.
- **The engine** (`rpg/battle/engine.ts`, lines on `c8d0cea`; H53 shifted them a little):
  - 773–776 `randomFoe` (hits seeded by the actor, `s.acted.length`, the hit and a salt);
  - 778–840 `cast` and `CastLog`: a skill's `hits` on its target shape, then `focus`, `splash`, `other`, riders, `allies`,
    status and support;
  - 511–541 `strike`: each weak part of a hit on a standing shield chips one point (two with Breaker);
  - 857–866 `Half`, `halfOf`, `halfIsTome`; 868–882 `linger` (a summon's farewell re-casts its whole skill at the linger
    share, with its support at that share) and `stay`; 884–899 `resolveHalf` (a summon skill's half lingers its previous
    summon first, then casts, then stays);
  - 901–966 `applyBattleAction`: the acting branch 936–958 (one half, or a pair when `hand.pair`: one Arms half and one
    Tome half, either named first; MP is the halves' sum; both resolve at `hand.power`, the first with salt `random`, the
    second `pair`). The limit branch 921–935 is H56's: don't touch it.
- `rpg/battle/types.ts` 167–174: `BattleState.summons`, `BattleSummon` (`allyId`, `ref`, `scale`), `BattleHalf`.
- `rpg/battle/auto.ts` 81–122: `bestHalf`, `bestAction` (only a Spell Blade pairs: her best Arms half, then her best Tome
  half within the MP left), `firstAttack`. `supportScore` and `limitAction` are H56's.
- `rpg/catalog.ts` 246–307 (the Summoner): `LINGER` 0.3, `SUMMONS` names (the Greatsword line's depth 3 is "Paladin"),
  `summon()` shapes by kind (Fire and Greatsword one foe; Ice and Axe every foe at `RPG_AOE_SHARE`; Lightning and Lance
  random; Light and Bow one foe, many hits; Dark and Katana two), side A "Pack" (one more hit, ×0.95), side B "Bonded"
  (lingers at 0.4). 309–334: the Spell Blade's trees (every skill one foe; `BLADE_HITS`).
- **The guard rail** today (D176): each class's own best act chips at most 10 (the Spell Blade's Bow flurry with her
  Light flurry; the Summoner's summon with her last one lingering), and a Limit Break 12, against the Duel's lowest
  shield 13. `rift/balance.test.ts` 120–175 (`railChips`, `guardRail`) measures it.

## Decisions made

- **Every rule below is v15 only** (`s.engineVersion >= 15`). v6–v14 act as today, which the v14 fixture proves.
- **The halves' power:** each half resolves at its own power, `hand.arms` or `hand.tome` by its weapon (v1 hands have both
  equal to `power`, so this is a no-op below v15). A Spell Blade: Arms 0.63, Tome 0.27. A Summoner: Tome 0.63, Arms
  0.27. MP stays the halves' sum.
- **The leading half resolves first,** whatever order the action names: a Spell Blade's Arms half, a Summoner's Tome half
  (§3.2: "the leading half carries the identity"). It takes salt `random`, the other `pair`.
- **The Spell Blade's extra hit (§3.1):** her Arms half gains one hit, the total unchanged:
  - an **Attack** lands as two hits, each half its power;
  - a **skill** of n hits lands as n + 1: its `hits` plus a copy of its last hit, every hit's power × P ÷ (P + last),
    where P is the hits' total (for equal hits, × n ÷ (n + 1)). `focus`, `splash` and `other` are untouched (her trees
    have none); a per-hit rider lands on the extra hit too;
  - her Tome half and her Limit Breaks are unchanged. If the foe falls mid-half, the rest of the half stops as today.
  - Export the transform, `battleExtraHit(def)`, for the screens (H59) and the guard rail (H60).
- **The Summoner's pair (§3.2):** a v15 Summoner always acts in a pair, a Tome half and an Arms half (a single half, or
  two of one kind, is `invalid-skill`), each a summon skill or an Attack.
  - **The farewell:** at the start of her pair, before either half, her lingering summon (if any) strikes **each living
    foe once**: a `summon` cue, then one hit of the summon's kind at power = its linger share × the summon's total hit
    power (`Σ hits.power`; for an every-foe summon that's its per-foe power) × `BATTLE_FAREWELL_FACTOR` (1; H60 tunes
    it). No riders, statuses or support; never intercepted by a guard; a weak hit chips as any hit. Then it leaves.
  - **Arrivals:** a Tome-half summon casts as today and then lingers at its node's share (0.3; Bonded 0.4). An Arms-half
    summon casts and leaves. An Attack leaves nothing lingering.
  - A Limit Break or a Guard neither triggers nor clears the farewell; it waits for her next pair, across waves. If she
    falls, it never comes.
  - Why one strike per foe (§3.2, clarified 2026-10-21): the farewell is the area identity, not a second full summon.
- **Support stays H56's.** From v15 the engine reads `support15`, which no Summoner node has, and ignores `allies`, so her
  lines only strike; this packet adds no support code and calls no support on the farewell.
- **Auto (v15):** a Summoner pairs like a Spell Blade, her leading half first: her best Tome half, then her best Arms half
  within the MP left; the action names the Tome half as `skill`/`weapon` and the Arms half as `pair`. `firstAttack`
  pairs her two first Attacks of each kind. A Spell Blade's Auto is unchanged. v6–v14 unchanged.
- **The Greatsword summon at depth 3 is "Knight Captain" from v15** ("Knight Captain Pack", "Bonded Knight Captain"), as
  tier2-classes §5.7 drafted: "Paladin" becomes a class. The id `summoner-greatsword.3` stays. Names are presentation,
  so the catalog takes them from the live generation (`rpgV2()`), and nothing reads differently before the switch (an
  old fight replayed after it shows the new name; H53's fixture digests cues without labels for this reason). The
  other two renames there wait on the owner's A4.
- **The guard rail with the new hands** (each class's own best act, one Uma, no ally's Breaker): the Spell Blade's Bow
  flurry (5 + 1 hits) with her Light flurry (5) chips **11**; the Summoner's lingering Light Pack farewell (1), Light Pack
  (5) and Bow Pack (5) chip **11**. Both stay under the Duel's 13. H60 re-runs the whole rail with all 24 Limit Breaks.
- **No save, no screen.** Main JS is unchanged: the engine and the catalog are lazy chunks.

## Do

1. **`rpg/battle/skills.ts`:** `BATTLE_FAREWELL_FACTOR = 1`, one comment ("v15 (D…): a lingering summon's farewell
   strike on every foe, × its linger share × its hits' power").
2. **`rpg/battle/engine.ts`** (the acting section only):
   - `battleExtraHit(def)`, exported;
   - in the acting branch: per-half power, the v15 order, the Summoner's farewell before the halves;
   - `resolveHalf`: from v15, no per-half `linger`; a Spell Blade's Arms half through `battleExtraHit` (an Attack as two
     half hits); a Tome-half summon `stay`s, an Arms-half summon doesn't;
   - a `farewell(s, actor, cues)` helper beside `linger` (which v6–v14 keep using unchanged).
3. **`rpg/battle/auto.ts`:** the v15 Summoner's pair in `bestAction` and `firstAttack`, reading `rpgHand(actor,
   state.engineVersion).pair`.
4. **`rpg/catalog.ts`:** the Knight Captain names from the live generation.
5. **Tests** in a new `rpg/battle/hands-v15.test.ts` (fixtures built like `engine.test.ts`'s, every input `version: 15`):
   - a Spell Blade's Attack pair on a foe weak to her Arm and her element (shield 10, so nothing Breaks mid-act): two
     Arms hits and one Tome hit, three `shield` cues; with the same ally stats, her Arms damage is 0.63 ÷ 0.45 of the
     same pair on v14 (within rounding), her Tome damage 0.27 ÷ 0.45;
   - a Spell Blade's n-hit Arms skill lands n + 1 hits with the same total (within rounding); `battleExtraHit` on unequal
     hits keeps the total; a per-hit rider lands n + 1 times;
   - the leading half resolves first when the action names the other half first, for both classes;
   - a v15 Summoner: a single half and two Tome halves are `invalid-skill`; her pair's cues are the Tome summon's hits,
     then the Arms summon's; afterwards `summons` holds only the Tome summon;
   - her next pair: a `summon` cue, one hit on each living foe at the farewell power (assert it against `battleDamage`
     for one foe), then the arrivals; a Bonded summon's farewell at 0.4; a Tome Attack leaves nothing lingering after its
     farewell; a Limit Break in between leaves the summon lingering; a farewell lands on the next wave's foes;
   - no Summoner skill heals, shields, drains, blesses or revives in v15 once H56 lands (leave this case `it.todo` if
     H56 hasn't merged when you deliver; whichever lands second turns it on);
   - Auto: a party with a v15 Summoner and a Spell Blade plays a world stage to its end with every action accepted, and
     every Summoner act is a pair;
   - the rail numbers above: 11 and 11 against a foe weak to every kind with shield 20;
   - the v14 fixture tests stay green, untouched.
6. **Docs:** classes-v2.md §3.1 and §3.2 each gain "Built in H55 (D…), live from H61." Log the D-decision (fetch `main`
   first; the next free number). `pnpm docs:update` leaves no diff.
7. **Check it locally** (your own ports, 390×844, desktop browser): a world-map stage with a Summoner and a Spell Blade
   on Auto plays as before; the stored fight reads `"version": 14`.

## Done when

- [ ] `pnpm lint && pnpm test && pnpm build` pass; main JS unchanged (say the number).
- [ ] The tests in step 5 pass; both v14 replay tests pass untouched.
- [ ] `docs/game/` is unchanged, `pnpm docs:update` leaves no diff, the D-decision is logged, classes-v2 has its lines.
- [ ] The local check in step 7 was done and described. Nothing from the original games in git.
- [ ] Deployed green and https://uma-rpg.web.app/api/health shows the commit.

## Deliver

- **Claude, as a delegated worker:** a pull request from `feat/h55-engine-v15-hands` with one commit,
  `feat(domain): engine v15 hands, the Spell Blade's extra hit and the Summoner's farewell (H55)`. H56 edits other
  regions of `engine.ts` and `auto.ts` at the same time (its support section, `harm`, the end-of-round step, the limit
  branch, `supportScore` and `limitAction`): stay in yours, and rebase on whichever lands first. Fetch `main` before you
  push so the D-number is free. The main session reviews and merges it, then watches the deploy.
- **Flag it done:** after the merge, a `docs(handoff): H55 done (D…)` commit deletes this file, sets H55 to Done with a
  Done row, and sets H59 and H60 to Ready if their other needs are done.
