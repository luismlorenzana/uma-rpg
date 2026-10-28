# H116 — Weaknesses v2 live: engine v18, the fight card's icons, the manual, R3–R5 on engines v19–v21

**uma-rpg · Claude · M · Needs: H115 · Unblocks: R3 (H83, on engine v19)**

## Why

H115 builds weaknesses v2 dark on engine v18 ([weaknesses-v2.md](../../design/tier-rework/weaknesses-v2.md), D235). This
packet turns it on, fits the longer lists on the fight screen, rewrites the manual and moves the Tier rework's later
releases one engine up.

## Context (read first)

- H115's D-row and pull request (its tables); D210 and D218 (how R1's and R2's switches froze the replays).
- `rpg/battle/caps.ts` (`BATTLE_ENGINE_VERSION`), `rpg/battle/v15-replays.test.ts`, `v16-replays.test.ts` (the pattern for
  freezing v17's fights).
- **The screens:** `apps/web/src/places/scenario-gate/FightScreen.tsx` (the foe card: `ShieldBadge`, the "Weak:" word,
  `WeaknessIcons`), `apps/web/src/battle/FoeRow.tsx` (the stage sheet's rows), `battle/labels.tsx` (`WeaknessIcons`'s
  order and its VoiceOver line).
- **The manual:** `docs/game/combat.md` "Weaknesses, shields and Breaks", `maps.md` (stage sheets), `classes.md` where it
  cites twins, `docs/game/README` history; `packages/domain/src/docs/render.ts` if a generated table names them.
- **The re-plan:** [implementation.md](../../design/tier-rework/implementation.md), the handoff index's R3–R5 headers,
  every R3–R5 packet that names engine v18, v19 or v20 (about 58 mentions in 18 files: `grep -rn "engine v1[89]\|engine v20"
  docs`), [class-progression.md](../../design/tier-rework/class-progression.md) §4 (a pointer to weaknesses-v2.md).

## Decisions made

1. **Engine v18 live:** `BATTLE_ENGINE_VERSION` 18; v17's fights frozen by a `v17-replays.test.ts` taken before the flip;
   an open v17 fight keeps its foes and plays on v17. No save change.
2. **The fight card (WK7):** the foe card drops the word "Weak:" (from v18; older fights keep theirs) and shows up to four
   icons after the shield badge, Arms first, at 12 px; `WeaknessIcons`' VoiceOver line reads "weak to Greatsword, Katana,
   Ice and Lightning". The stage sheet keeps "Shield 3 · Weak:" and the icons. Check four icons fit a quarter-width card at
   375 px (two rows of four in an eight-foe swarm).
3. **The Summoner's Tome 0.62 (WK13, H115):** her sheet's hand line and classes.md's hands table read v18's; the mirror's
   numbers in the manual, if any, H115's (D236).
4. **The manual:** combat.md's section rewritten as WK1–WK6 (counts by rank, the ring first, the decks, shields and locks
   unchanged, Light + Dark, Tiers 2 and 3 per WK8, the Rift unchanged), the twins kept as the Rift's vocabulary; the
   v16–v17 rule moves to "Older fights".
5. **The re-plan (WK11):** R3, R4 and R5 read engines **v19, v20 and v21** ("read this packet's engine v18 as v19, v19 as
   v20, v20 as v21 (D235)"), saves unchanged (v32–v34); class-progression §4.1 and §4.2 point to weaknesses-v2.md; H93 and
   H101 (Tier 2's and Tier 3's weaknesses) and H96 and H104 (their balance) re-read WK8.

## Do

1. Freeze v17's replays; flip the engine; the tests that pin the live engine move to 18.
2. The fight card and `WeaknessIcons` (2); a web test that a four-kind foe's card has no "Weak:" and four icons in order.
3. The manual (3, 4); `pnpm docs:update`.
4. The re-plan (5).
5. **Check it locally** (your own ports, a desktop browser at phone width, never the iOS Simulator):
   - a Twilight Rift squad, a Meadow pair, a Forest elite and a Coast boss on the scratch API at 390×844 and 375×667,
     light and dark: four icons and the shield on each card, nothing clipped;
   - the stage sheet's rows;
   - play one stage on Auto.

## Done when

- [ ] `pnpm lint && pnpm test && pnpm build` pass; main JS under 230 KB; replays v6–v17 green.
- [ ] The manual matches the game; `pnpm docs:update` leaves no diff.
- [ ] A D-row logs the switch (fetch `main` first); deployed green; https://uma-rpg.web.app/api/health shows the commit.
- [ ] Tell the owner what to check on the phone: the Twilight Rift and Meadow stages from the screenshots.

## Deliver

A pull request from `feat/h116-weaknesses-v2-live`, one commit `feat: weaknesses v2 live, engine v18 (H116)`; merge,
watch the deploy (`gh run watch <id> -R luismlorenzana/uma-rpg --exit-status`), flag it done.
