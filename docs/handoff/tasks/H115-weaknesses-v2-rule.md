# H115 — Weaknesses v2, dark: every foe her own list, by rank, engine v18's generation

**uma-rpg · Claude · M · Needs: nothing · Unblocks: H116 (the switch)**

## Why

The owner found Tier 1's fights unfun since R1: every foe of a stage shares one two-kind list (her twins, CP5), so half
the party has nothing to break. The design is [weaknesses-v2.md](../../design/tier-rework/weaknesses-v2.md) (D235,
WK1–WK12) with its review page [weaknesses-v2.html](../../design/tier-rework/previews/weaknesses-v2.html). This packet
builds the rule and proves the balance, **dark**: engine v18's generation, `BATTLE_ENGINE_VERSION` stays 17, nothing a
player sees changes.

## Context (read first)

- `CLAUDE.md`, `AGENTS.md`; D202 (how H66 built the twins and keyed the generators by engine), D207 (H71's measure),
  D215 and H81's tables (R2's balance), D235.
- **The rule's home today:** `rpg/kinds.ts` (`RPG_TWIN_SETS`, `rpgTwinsOf`, `rpgElementWeakness`), `world/biomes.ts`
  (`signatureWeaknesses`, the 19 biomes' signatures, formations and roles).
- **The generators:** `world/world.ts` `stageWaves` (its `weaknesses` closure and `foe()`, slots counted by `next` in slot
  order across the waves), `world/capital.ts` (the Finals), `rpg/campaign/chapters.ts` (scenario chapters, line ~138).
- **The gate:** `rpg/battle/caps.ts` `RPG_REWORK_ENGINE` and `rpgRework(stage, engine)`.
- **Shields:** `rpg/campaign/enemies.ts` `rpgFoeShields`, `RPG_FOE_SHIELDS_V16` (6 and 8), formations' shields.
- **The checks today:** `world/twins-v16.test.ts`, `world/coverage-v16.test.ts`, `world/twins-live16.test.ts`.
- **The simulation:** `world/balance-v17.test.ts` (items 1, 2, 5–9), `balance-party.ts`, `balance-play.ts`,
  `balance-measure.ts`; `rift/balance-v17.test.ts`.

## Decisions made

1. **The gate (WK11):** `RPG_REWORK_ENGINE` gains `weak: 18`; R3's, R4's and R5's stages move to 19, 20 and 21 in the
   code now (nothing reads them yet; H116 moves the docs). `rpgRework('weak', engine)` picks the rule.
2. **One helper (WK10)**, in a new `rpg/weaknesses.ts` (exported through `rpg/rules`): a stage dealer,
   `rpgStageWeaknesses(stageId)` → `{ next(foe: { rank, element, element2? }): BattleWeaknesses }`, called once per foe in
   slot order, so the generators keep their single pass. It holds the stage's two decks and the previous foe's list.
3. **The rule (WK1–WK4):**
   - **counts:** a regular-rank foe 2 Arms + 2 elements; a sub-boss or boss 3, `fnv(stageId:slot:split)` even → 2 Arms
     + 1 element, odd → 1 + 2;
   - **elements:** the ring's answer to her lead element, or to her second when the first is her own; a two-element foe's
     second answer next; the rest dealt from the stage's element deck (the five shuffled by `stageId:edeck:n`,
     reshuffled when no card fits), never her own, preferring one that doesn't make the previous foe's element set;
     a Light + Dark foe draws only Fire, Ice and Lightning;
   - **Arms:** dealt from the stage's Arms deck (five shuffled by `stageId:deck:n`, reshuffled when empty), never twice
     in a foe, never the previous foe's whole Arms set;
   - seeded by the world's existing `hash` (no new randomness), so every visit, Sweep and stage sheet meets the same lists.
4. **Tiers 2 and 3 (WK8):** the helper takes the tier; from tier 2 every rank takes 3, a regular's split by her role
   (strikers and guards 1 Arm + 2 elements, casters and skirmishers 2 + 1), bosses and sub-bosses by seed. Their shields
   wait for R4 and R5 (H96, H104 read WK8).
5. **Shields and locks stay (WK5, WK6):** no change to `rpgFoeShields`, the formations or the lock draw. If the delivery
   tables (below) leave a band, adjust shields there and log the numbers; the prototype measured no need.
6. **The Rift stays (WK9):** `riftTuning(18)` is v17's; its fronts keep their own draws.
7. **v17's generation is frozen:** digests of Tier 1's regions, capitals and scenario chapters on v17 taken before the
   change (as H66 did for v15), and `twins-v16.test.ts` keeps proving v16–v17's twins.

## Do

1. Take the v17 digests first (every Tier 1 region chapter, the five capitals, scenario chapters 1–15; Tiers 2 and 3 too).
2. The gate and the helper (1–4), and the three generators reading it from v18.
3. **Tests:** `world/weaknesses-v18.test.ts`:
   - the counts by rank and tier; both channels on every foe;
   - the ring answer first, never her own element, Light + Dark from the ring trio;
   - in a wave of three or more, every Arm before a repeat; no neighbour with the same Arms set or the same whole list;
   - determinism (the same stage twice);
   - v17 against its digests; v18's generators against the rule re-derived from each foe.
4. **The checks (WK12)**, `world/coverage-v18.test.ts`, on the default party with a Cleric and with a Paladin:
   - every Tier 1 foe answered by both channels and two members or more;
   - no stage of two foes or more where every foe has the same list;
   - every member hits 75% of Tier 1's foes weak or more;
   - pin the measured table (D235: regulars 4.40 answers, elites 3.73, bosses 3.70; idle stages 5% and 4%).
5. **The balance (WK12's fourth check):** add v18 to `balance-v17.test.ts`'s tables (or a `balance-v18.test.ts` on the
   same harness):
   - items 1, 2, 5 and the Paladin swap at Lv 10–50, `SIM_SEEDS=32`;
   - rounds and the first Break within ±0.5 of v15's;
   - on-curve win rates unchanged;
   - the region runs (MP carried) within R2's bands;
   - the Tier 2 and 3 worlds (item 9);
   - put the tables in the pull request.

## Done when

- [ ] `pnpm lint && pnpm test && pnpm build` pass; replays untouched; `pnpm docs:update` leaves no diff (nothing live moved).
- [ ] The v18 tables in the pull request; WK12's checks pass with either healer.
- [ ] A D-row logs the build (fetch `main` first). Nothing from the original games in git.

## Deliver

A pull request from `feat/h115-weaknesses-v2`, one commit `feat(domain): weaknesses v2, dark, engine v18's generation
(H115)`; merge once green; flag it done (`docs(handoff): H115 done (D…)`).
