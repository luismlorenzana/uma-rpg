# H63 — The hybrids' mirror: Spell Blade and Summoner deal equivalent damage (dark)

**uma-rpg · Claude · S–M · Needs: H60 (done) · Unblocks: H61 (it waits to push until this lands)**

## Why

The owner's rule for classes v2 (D160, C9; [classes-v2.md](../../design/classes-v2.md) §3.2): **the Summoner is the Spell
Blade's mirror. They deal equivalent damage, one 70/30 physical, the other 70/30 magical.** H60 (D186) left them apart:

| World Lv 50, damage a turn | Brawler | Mage | Spell Blade | Summoner | Cleric |
|---|---|---|---|---|---|
| After H60 | 1,042 | 1,150 | 825 | 969 (118%) | 419 |

- Summoner ÷ Spell Blade by context: single foe (Duel) 101%, world stages 117%, Horde 144%, Iron 83%, Arcane 158%.
- Splits: Spell Blade 72% physical (met); Summoner 84% magical (missed; her farewell is all magic).

H60 held the Summoner up to keep §9's "Summoner ≥ Mage's Blizzard on 3+ foes". **The owner ruled on 2026-10-22 that the
mirror wins.** This retunes v15 only, while v15 is still dark: once H61 makes v15 live, its numbers are frozen for
replays (an open fight is re-checked by replay on every save parse, D52), so this must land first.

## Context (read first)

- `CLAUDE.md`, `AGENTS.md`, classes-v2.md §3.1, §3.2, §9, and D183 (H55), D186 (H60) in `docs/decisions.md`.
- H60's harness: `packages/domain/src/rift/balance-sim.ts`, `rift/balance-v15.test.ts`, `world/balance-party.ts` (its
  SIM-gated tables print the numbers above). H60's raw outputs and scripts: the main session's scratchpad
  `/private/tmp/claude-502/-Users-luismartinez-workspace-uma-rpg/08d88001-8cc3-4bb7-8070-41edcb4e3f2f/scratchpad/h60/`.
- The knobs (all v15): `rpgHand` in `rpg/rules.ts` (Spell Blade arms 0.68 / tome 0.32; Summoner tome 0.58 / arms 0.32,
  linger 0.3, Bonded 0.4), `rpgClassStats` leans (both ATK/M.ATK 1.1 and 0.95, mirrored), `BATTLE_FAREWELL_FACTOR` 0.85
  in `rpg/battle/skills.ts`, and the Spell Blade's extra Arms hit (H55, total power unchanged).

## Decisions made (the main session, for the owner)

Targets, in priority order:
1. **Equivalent damage:** Summoner ÷ Spell Blade, damage a turn on the world's regular stages (Lv 30 and 50, the balance
   harness's formations), **within ±5%**.
2. **Mirrored channels:** Spell Blade 70% physical ± 5, Summoner 70% magical ± 5, each counted over all her damage
   (farewells included).
3. **Identity without dominance:** by context, Summoner ÷ Spell Blade **within ±15%** on a single foe (the Duel), on the
   Horde, on Iron and on Arcane (Iron favours the Spell Blade, Arcane the Summoner, through the ward; report them, and keep
   the ward's effect, but no context past ±25%). The Spell Blade still Breaks a shielded foe sooner, the Summoner still
   reaches every foe.
4. **Their level:** both land near the same damage a turn, between today's Spell Blade (825) and Summoner (969), around
   **880–920 at world Lv 50**: a hybrid's price for carrying two channels is a little below the pure classes (Brawler
   1,042, Mage 1,150). Say where they land.
5. **§9's "Summoner ≥ Mage on 3+ foes" is retired** (superseded by the owner's mirror rule); log it.
6. Everything else H60 met must still hold: the campaign within 3 points of v14, the Rift's §11 targets (champions about
   60–70% first try with the right party, the Convergence about 50%), the Duel guard rail (no single act chips 13), one
   healer keeps the party up. Retune `riftTuning(15)` only if the Rift's targets break.

Knob rules: v15 only; the ±0.05 hand limit H60 worked under is lifted for these two classes (the mirror matters more);
prefer the farewell factor and the hands' split first (the Summoner's 84% comes from the all-magic farewell, so a smaller
farewell with a larger Arms summon is the natural lever), leans second. The two classes' hands should read as a mirror in
the code where possible (e.g. Spell Blade arms a / tome b, Summoner tome a′ / arms b′ with the farewell inside a′).

## Do

1. Reproduce H60's numbers on `main`, then tune to the targets above. Keep always-on tests fast; long sims behind SIM.
2. Update H60's balance tests to pin the new targets (the mirror ±5%, the splits, the contexts ±15%).
3. Prove the live game is unchanged: v14 replays, today's world and Rift tables print as before (engine 14).
4. Docs: classes-v2.md §3.2 and §9 (the retired target, the measured table), and the D-row (fetch `main` first; the next
   free number). `docs/game/` stays as it is (H61 rewrites it); `pnpm docs:update` leaves no diff.

## Done when

- [ ] `pnpm lint && pnpm test && pnpm build` pass; main JS unchanged (say it).
- [ ] A before/after table for targets 1–6, every knob changed and why.
- [ ] Deployed green and https://uma-rpg.web.app/api/health shows the commit.

## Deliver

- **Claude:** commit to `main` as `feat(domain): the hybrids' mirror, equivalent damage (H63)`, push, watch the deploy.
- **Flag it done:** delete this file, add H63's Done row in `docs/handoff/README.md`, and tell the main session at once:
  H61 is waiting to rebase onto it.
