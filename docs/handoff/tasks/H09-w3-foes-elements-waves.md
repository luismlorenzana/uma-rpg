# H09 — W3: up to eight foes, dual-element foes, waves

**Priority P2 · Claude · uma-rpg · L.** Core engine work right after the D86 engine v6; Claude keeps it.

## Why

The world map's variety (D66, D72) was cut down to fit today's engine. At most five foes, one element each, one wave:
pair signatures alternate their two elements across foes instead of a foe carrying both. W3 delivers what the owner
asked for:

- swarms of eight;
- fire+dark solos on volcanoes;
- fights that come in waves.

## Context

- `docs/design/world/encounters.md`, "What the engine and stage need": up to 8 foes, two elements per foe, two actions a
  round for solo elites, 1–3 waves with HP, MP and statuses kept, budget per formation template.
- `docs/design/world/README.md` (the shape table) and `regions.md` (signatures and formations).
- **Engine:** `packages/domain/src/rpg/battle/` (v6: `engine.ts`, `types.ts`), and `world/world.ts` (`regionChapter`,
  the seeded stage generator, versioned so stage ids never move).
- **Stage:** `apps/web/src/battle/stage-layout.ts` and `scene/BattleScene.ts` (today one row of up to five rivals).
- **Balance:** `packages/domain/src/world/balance.test.ts` (`SIM=1`).

## Do

1. **Engine v7:**
   - `BattleEnemy.element` becomes a list of one or two, and weaknesses follow `signatureWeaknesses`.
   - Foes' moves carry their own element.
   - A `twice` flag gives solo elites two actions a round.
   - A stage input holds `waves: BattleEnemy[][]`. When a wave falls, the next one enters, keeping the party's HP, MP,
     statuses, Limit gauge and lingering summons, and clearing the foes' side.
   - v6 inputs still replay unchanged (D52's frozen fights).
2. **Generator:**
   - The formation templates' real sizes, up to 8: swarm 6–8, squad 4–5.
   - Pair signatures as dual-element foes.
   - 1–3 waves by stage position (the crowd stage and the boss with waves).
   - A budget per template, so difficulty stays even.
   - Bump the generator version, keeping stage ids.
3. **Save:** if the open fight's version can't continue, close it with no loss, as D72 and D86 did.
4. **Stage:**
   - A two-row layout for 6–8 foes that keeps 44 pt targets at 375 px.
   - A wave banner and a short transition.
   - The dual-element mark on a foe: two glyphs.
5. **Retune** with `SIM=1` to D86's targets: regular stages about 100%, elites 100%, bosses 75–100% (100% with gear),
   at the on-time rank.

## Done when

- The engine tests cover dual weakness, `twice`, a wave change carrying state, and a v6 replay.
- The generator tests still pass: counts, no repeated combination, ids stable.
- The sim table is in the pull request.
- The preview shows an eight-foe swarm and a three-wave boss on a phone layout.
- A decision row is added, and `encounters.md` and `battles.md` are updated.

## Deliver

A pull request, or a direct push per CLAUDE.md, with the sim table and screenshots. Then deploy and tell the owner what
to test.
