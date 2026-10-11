# H23 — S8: Tier Finale and promotion

**Priority P4 (parked by the owner) · the owner decides, Claude builds · uma-rpg · L.** Needs Q6.

## Why

Lv50 is the top of Tier 1. The design's end of a tier has four parts:

- a Tier Finale;
- promotion to Tier 2;
- legacy skills that carry over;
- a use for EXP banked at Lv50.

Without them, a maxed Uma has nowhere to go but other Umas. The difficulty spike of the Finale (design §12) is part of
this slice.

## The decision first

**Q6** (`docs/open-questions.md`): the Finale's form.

- **Gauntlet:** a fixed ladder of fights in a row, MP carried.
- **Raid:** one huge boss over many attempts, damage kept.
- **Siege:** waves defending a capital.

**Recommendation:** Gauntlet first. It reuses the world's stages, H09's waves and carried MP, so it's cheapest. Siege can
come as the long-term goal.

## Once Q6 is answered (Claude)

1. A slice spec, `docs/slices/S8-finale.md`, with tasks (D35). It covers:
   - the Finale's form, where it sits (a sixth "continent" or each capital's last fight, per the world README);
   - its spike and its rewards;
   - promotion at Lv50: what resets, what's kept (classes, ranks, gear), Tier 2's level band;
   - legacy skills: one learned skill per class carried as a passive;
   - banked EXP: overflow EXP converts to Laurels at a fixed rate, or feeds legacy slots.
2. Save v15 for tier and legacy; the Tier 2 world uses the same generator with a tier offset.
3. Balance with H14's simulator and `SIM=1`.

## Done when

The owner has answered Q6, and S8's spec is accepted. The slice's own exit check then applies.
