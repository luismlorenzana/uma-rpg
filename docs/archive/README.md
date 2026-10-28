# The archive

**History, not current rules.** Everything here was true, planned or decided at some point between 2026-10-10 and
2026-10-28. The game as it is now is [the manual](../game/README.md), the open work is [the handoff](../handoff/README.md),
and new decisions start at D238 in [decisions.md](../decisions.md). Moved here when Tier 1 hardening began (D238), so
sessions joining the repo don't read old plans as current ones. Nothing was deleted: this folder and git keep it all.

## What's here

| Where | What it was |
|---|---|
| [decisions-D1-D237.md](decisions-D1-D237.md) | The decision log from D1 to D237. Code comments and older docs cite these numbers: look them up here |
| [handoff-history.md](handoff-history.md) | The handoff index as it stood on 2026-10-28: every build's packet tables (the slices' tasks, the Rift, classes v2, the Tier rework's R1–R5, the owner's reviews, the farm by line, the Wilds' trios, weaknesses v2) and every Done row with its commit |
| [open-questions-answered.md](open-questions-answered.md) | Q9, Q10 and Q12–Q17, each answered by the Tier rework (D192–D197) |
| [design/](design/) | Specs that were built or superseded: the core loop, battles, the class rework and classes v2, combat balance, the forge, gear and targets, items, progression and ranks, after the farm, the game design (v1.0), tiers, and the Tier 2 proposals (advanced classes, weapon arts, the outer ring, the second profession, Tier 2's world) |
| [design/tier-rework/](design/tier-rework/) | The Tier rework's implementation plan (R1–R5, D198) and its first-round drafts (classes, skill trees, gear, Extra Stats, professions, variance) and the weapon research note. The approved designs stay in [docs/design/tier-rework/](../design/tier-rework/README.md) |
| [design/world/](design/world/) | The world map's design (W1–W3 built; W4's field effects never built), encounters, regions, themes, map art, research |
| [build-history/](build-history/) | The build plan, the slices S1–S7, their task list and the S1 acceptance check |

## The R3–R5 packets, removed

The Tier rework planned Tier 2 and Tier 3 as releases R3–R5 (H83–H105, D198). Tier 1's iterations then took the engine
and save versions they were written for (saves v29–v31, engine v18), and the owner chose to harden Tier 1 first. The
packets were removed on 2026-10-28; Tier 2 and Tier 3 will be re-planned from the approved designs. Read one with
`git show 4f0a1bf:docs/handoff/tasks/<file>`:

- `H83-engine-v19-weapon-branches.md`
- `H84-accessories-tier2.md`
- `H85-weapon-moon.md`
- `H86-secondary-profession.md`
- `H87-save-v29.md`
- `H88-r3-screens.md`
- `H89-r3-balance.md`
- `H90-r3-switch.md`
- `H91-engine-v20-class-branches.md`
- `H92-trees-tier2.md`
- `H93-weaknesses-term-tier2.md`
- `H94-save-v30-class-branches.md`
- `H95-r4-screens.md`
- `H96-r4-balance.md`
- `H97-r4-switch.md`
- `H98-engine-v21-t3-weapons.md`
- `H99-t3-accessories-weapon-moon-2.md`
- `H100-t3-trees-masteries.md`
- `H101-t3-weaknesses-term.md`
- `H102-save-v31-t3.md`
- `H103-t3-screens.md`
- `H104-t3-balance.md`
- `H105-t3-switch.md`
