# H101 — Weakness-v2 coverage and Tier 3's term: boss shields 10; the secondary reaches Tier 2's work (dark)

**uma-rpg · Claude · M · Needs: H98 · Unblocks: H104 (and through it H105)**

> **H116 plan correction (D237): read [weaknesses-v2.md §7, WK8–WK10](../../design/tier-rework/weaknesses-v2.md#7-later-tiers-and-the-rift-wk8wk10) before this packet.**
> Engine v18 already made every world rank use WK8's three dealt weaknesses, and later tiers keep that exact rule.
> This packet must not narrow regulars, sub-bosses or bosses and must not change the Rift. Its weakness work is only a
> regression check that the v18 lists remain byte-identical at v21; the Tier 3 term, shields and profession work remain
> in scope. Every one-kind/twin-list instruction and coverage number below is superseded by WK8.

## Why

Tier 3's toolbox compounds to **+88% an act** at Lv 50 (the focus, Keen and a second two-kind weapon, three accessory
slots with the step, two weapon moons; [stat-balance](../../design/tier-rework/stat-balance.md) §3.3–§3.4). Without
its own term a Tier 3 party fells a regular **1.85×** as fast as Tier 1 at the same tier level. The approved answer is
on the foes' side, generated, never saved:
- **the live three-kind weakness lists stay unchanged** (WK8);
- **boss shields 10** (CP8, SB6), sub-bosses 6;
- **Tier 3's term** (SB4): the foes' HP and DEF × (1.08 + 0.40 (ℓ − 1) ÷ 49), offense +10% by Lv 50, bosses × 1.1 on
  top (SB5).

The same packet carries Tier 3's one profession rule ([profession-progression](../../design/tier-rework/profession-progression.md)
§2.3, PP14): **the secondary also does its Tier 2 work.**

## Context (read first)

Code pointers are by file and function: Releases 1–4 move the lines. Re-read the code before starting.

- `CLAUDE.md`, `AGENTS.md`, [change-protocol.md](../../change-protocol.md). H98's packet and D-rows (**Release 5's build
  decisions**: one stage, Tier 3 only, no Tier 3 Rift).
- **The design:**
  - [weaknesses-v2.md](../../design/tier-rework/weaknesses-v2.md) **§7, WK8–WK10**, and
    [class-progression.md](../../design/tier-rework/class-progression.md) **§4.4** (CP8: shields per tier), §15.
  - stat-balance **§3.3** (the measure, the proposed column), **§3.6** (the terms' shape, bosses × 1.1), **§10** (shields
    against answers), §11's tunings 2–4, §12 items 3–4, §14's SB4–SB6 rows.
  - [weapon-progression.md](../../design/tier-rework/weapon-progression.md) §3.6 (WP12: answers by tier).
  - profession-progression **§2.3** (the secondary's Tier 3 row), **§3.4** (the ladder: in Tier 3, G4 and G9 on Tier 2's
    pair, G5 and G10 on Tier 3's), §4.3 (PP15), §9.1–§9.4, §15's PP14 row.
  - [tiers.md](../../design/tiers.md) §7 and T9: Tier 3 has four continents and no Rift yet.
- **Releases 1, 3 and 4's packets and D-rows:** H66 (twin weaknesses, Tier 1's shields); **H93** (Tier 2's lists by role,
  `rpgTierShield(rank, tier1Shield, tier, engine)`, `rpgTierTerm(tier, curveLevel, rank, engine)` read by `rpgFoe`, the
  term keyed by engine, "until R5 a tier 3 world takes Tier 2's formula at its tier level", the Tier 1 digest pinned);
  H83's point 4, H89's and H96's D-rows (the interim term on Tier 3 worlds, a₃ and b₃, which this packet replaces at
  v21); **H86** (the secondary: "a job is base work when every material it
  takes or gives is of Tier 1's types", the gate in each job kind's `plan`, "Her main trade's work").
- **The code:**
  - `packages/domain/src/world/world.ts`: `stageWaves` (the `weaknesses` closure H93 rewrote, `role(slot)`, the
    sub-boss and boss branches), `WORLD_FORMATIONS`, `ELITE_ASSISTANTS`; `world/capital.ts` and
    `rpg/campaign/chapters.ts` (a capital's sub-bosses and Finals, role `captain` and `champion`).
  - `rpg/campaign/enemies.ts`: `RPG_FOE_TUNING`, `rpgFoe`, `rpgFoeCurveLevel`, the `ROLE` shapes (`captain`: DEF =
    M.DEF), and H93's `rpgTierShield` and `rpgTierTerm`.
  - `world/tier1-foes.test.ts` and any Tier 2 digest H93 or H96 pinned; `world/coverage-t2.test.ts`.
  - `rift/state.ts` `RIFT_TIERS` (stays `[1, 2]`); `rift/generate.ts` (reads `rpgFoe`; no Tier 3 front).
  - The job kinds' `plan` and H86's gate (`work/`, `save/work.ts`); H77's catalog (each type's tier) and ladder.

## Decisions made

- **Tier 3 only, behind the stage.** The generator applies Tier 3's lists, shields and term to a Tier 3 world's foes at
  v21, through the engine argument H93's rules take (default live). **Before v21 a Tier 3 world's foes are exactly as
  Release 4 left them** (Tier 2's lists and shields, and the interim term H89 and H96 tuned for Tier 3 worlds, its a₃
  and b₃); **from v21 Tier 3's own term replaces that interim, never stacks on it.** Tier 1
  and Tier 2 foes never move: their digests stay byte-identical at both versions.
- **The lists stay on WK8**, Tier 3 at v21:

  | Foe | Tier 3 |
  |---|---|
  | Regulars and the elites' Keys | Their three dealt weaknesses |
  | **Sub-bosses** (an elite's, a capital's) | Their three dealt weaknesses |
  | Bosses (a region's, the capitals' Finals) | Their three dealt weaknesses |

  - Role, rank and tier do not narrow the list. Locks continue to draw from those three dealt weaknesses.
- **Shields** (CP8, SB6): `rpgTierShield` gains Tier 3's row at v21: **bosses 10**, **sub-bosses 6** (Z2's
  floor, Tier 1's 5 + 1), regular-rank foes Tier 1's + 1 (as Tier 2's), each never below its Tier 1 value + 1. Rounds
  to the first Break stay within ±0.5 of Tier 1's (the chip index: bosses −0.39, sub-bosses +0.11; H104 measures).
- **Tier 3's term** (SB4, SB5): `rpgTierTerm` gains Tier 3's row at v21, ℓ the tier level (`rpgFoeCurveLevel`):

  | | Factor | Lv 1 · 10 · 20 · 30 · 40 · 50 |
  |---|---|---|
  | HP, DEF and M.DEF | 1.08 + 0.40 (ℓ − 1) ÷ 49 | 1.08 · 1.15 · 1.24 · 1.32 · 1.40 · **1.48** |
  | Offense (ATK and M.ATK) | 1 + 0.10 (ℓ − 1) ÷ 49 | 1.00 · 1.02 · 1.04 · 1.06 · 1.08 · **1.10** |
  | Bosses' HP and DEF | the term × **1.1** | 1.19 · 1.27 · 1.36 · 1.45 · 1.54 · **1.63** |

  It multiplies as H93's does (after the build budget; offense after the hit share). Its constants (1.08, 0.40, the
  offense's 0.10, the boss tenth) sit in one row H104 may tune. It starts above 1 because a Tier 3 Uma arrives with her
  branches, three slots and her focus (stat-balance §3.4: the toolbox is ×1.28 at Lv 10).
- **No Tier 3 Rift** (T9): the Rift's generator and `riftTuning` are untouched; `RIFT_TIERS` stays `[1, 2]`.
- **The secondary's Tier 3 reach** (PP14, PP15): H86's rule grows by one tier. **In a Tier 3 world, from the stage, a
  secondary's job is in reach when every material it takes or gives is of Tier 1's or Tier 2's types** (by the
  catalog's tier for each type): gathering or processing Tier 2's pair, and making the grades the ladder puts on it (G4
  and G9 in Tier 3: Planet Jewel V and Moon Jewel II among them). **Tier 3's pair and every grade made of it (G5 and G10,
  the Branch Gem included) stay her main trade's** ("Her main trade's work"). No engine change, no save change. Dark, a
  Tier 3 world's secondary keeps base work only (H86).
- **No screen, no manual change.** The world map's weakness icons, shields and the Work tab's greyed reasons follow the
  domain by themselves at the switch (H103 checks them). `pnpm docs:update` leaves no diff (the `foe-scaling`,
  `foe-roles` and `formations` blocks read the live engine).

## Do

1. **The generator** (`rpg/campaign/enemies.ts`, the capital's builder): Tier 3's shield row, Tier 3's term row and its
   boss tenth, all keyed by engine. Leave the v18 weakness generator unchanged.
2. **The work gate:** the secondary's Tier 2 work in a Tier 3 world, gated.
3. **Tests** (mock with `capsAt(21, …)` where a live default matters):
   - `world/tier3-foes.test.ts`, generating a region of the first Tier 3 continent at engine 21 and 20: regulars, Keys,
     sub-bosses and bosses keep WK8's three dealt weaknesses exactly; boss shields 10 and sub-bosses 6 at v21
     (Release 4's at v20); a regular's HP and DEF at ℓ 1, 30 and 50 are ×1.08, ×1.32 and ×1.48 of the termless foe
     (rounding aside), offense ×1.00, ×1.06 and ×1.10, a boss's HP and DEF × 1.1 more; at engine 20 the region equals
     Release 4's output byte for byte.
   - `world/tier1-foes.test.ts` and the Tier 2 digests pass untouched at both engines.
   - `work/secondary-t3.test.ts` (beside H86's tests): in a Tier 3 world at the stage a secondary gathers Tier 2's pair
     and makes a G4 and a G9 piece at her secondary's place; a Tier 3 pair's job and a G5 or G10 piece are refused "Her
     main trade's work"; in a Tier 2 world nothing moves; unmocked, a Tier 3 world's secondary keeps base work only.
   - H98's v20 replay tests and every existing test pass unchanged.
4. **Docs:** class-progression §4.2 and §4.4, stat-balance §3.6 and profession-progression §2.3 gain "Built in H101
   (D…), live from H105." Log the D-row (fetch `main` first). `pnpm docs:update` leaves no diff.
5. **Check it locally** (your own ports; a desktop browser at 390×844; never the iOS Simulator), on a scratch save from
   the CJS build with a Tier 3 world: a Tier 3 region's stage sheet shows its foes and weakness icons as before; a stage
   on Auto plays and its open fight reads `"version": 19`; the Work tab's secondary picker reads as before.

## Done when

- [ ] `pnpm lint && pnpm test && pnpm build` pass; say the main JS number (gzip, of 230 KB).
- [ ] The tests in step 3 pass; Tier 1's and Tier 2's foe digests and both v20 replay tests pass untouched.
- [ ] `git diff` shows no switch (`BATTLE_ENGINE_VERSION` 20, `SAVE_SCHEMA_VERSION` 30).
- [ ] `docs/game/` is unchanged, `pnpm docs:update` leaves no diff, the D-row is logged, the design docs have their
  lines.
- [ ] The local check in step 5 was done and described. Nothing from the original games in git.
- [ ] Deployed green and https://uma-rpg.web.app/api/health shows the commit.

## Deliver

- **Claude, as a delegated worker:** a pull request from `feat/h101-t3-weaknesses-term` with one commit,
  `feat(domain): Tier 3's weaknesses, shields and term, and the secondary's Tier 2 work, dark (H101)`. H99 and H100 run
  beside you in the engine and the catalog; you share no files with them. Fetch `main` before you push. The main
  session reviews and merges it, then watches the deploy.
- **Flag it done:** after the merge, a `docs(handoff): H101 done (D…)` commit deletes this file, sets H101 to Done in
  `docs/handoff/README.md` with a Done row, and sets H104 to Ready if H99 and H100 are done.
