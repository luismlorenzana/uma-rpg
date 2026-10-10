# Build plan

How uma-rpg gets built: **vertical slices**, each playable on the owner's iPhone. The design
([game-design.md](design/game-design.md)) says what the game is; this file says in what order it gets built.

**How a slice is written (D35).** Right before a slice starts, Claude writes:

1. a **slice spec** in `docs/slices/`: what the owner sees and does, and the exit check;
2. **implementable tasks** in `docs/tasks/`: files, contracts, steps and acceptance checks.

The owner reviews both, then the tasks get built. A task file is deleted in the commit that finishes it, since the
design docs carry the resulting rules and git keeps the history (uma-racer's D104). Later slices are only outlined
here, so their specs can use what earlier slices taught.

**The Hub comes first (D30).** Every screen in the game is a **place** on one of the Hub's four pages, so later
features slot into places that already exist instead of growing global routes.

## Slices

| Slice | Delivers | Places that come alive | Exit check |
|---|---|---|---|
| **S1 — Hub and foundation** ([spec](slices/S1-hub.md)) · *done 2026-10-10* | Repo, cloud, sign-in, save and sync, master data, the four-page Hub with all 36 places visible, account bar and global menu | Stable (browse all 268 outfits), Scenario Gate (Tier 1 chapters), Account | On the iPhone: sign in, see every place on every page, browse the Umas; the save survives a reload and syncs |
| **S2 — Collection and parties** ([spec](slices/S2-collection.md)) · *built; deploying* | 20 Unlock Tickets, outfit unlocks, Uma profiles, 20 permanent parties, busy members greyed out | Stable (unlock), Party Hall | Unlock Umas and build parties |
| **S3 — Battles and leveling** | The battle engine and campaign ported from uma-racer, Tier 1's five 10-level chapters, free classes, EXP, Shards → Tickets, Laurels | Scenario Gate (fight), Stable (levels) | The core loop: unlock, fight, level, earn Shards, unlock more |
| **S4 — Farmlands and Wilds** | Timed jobs at the 16 sites, profession levels, raw items, refining, Uma icons on places, the Exchange (raw items, Rush and Sweep Tickets) | 16 sites, Pantry, Workbench, Warehouse, Exchange | Assign Umas, collect and refine while away, spend Laurels |
| **S5 — Learning District** | Class ranks and gear mastery, aptitude speeds, ranks gating skill depths | 5 class halls, 4 armories | Train ranks while away; deeper skills unlock |
| **S6 — Kitchen and Extra Stats** | The dish catalog, cooking (Duo dishes, Feasts), the Sun-and-planets map | Kitchen, Observatory | Cook, eat, build Extra Stats |
| **S7 — Forge and equipment** | The gear catalog, crafting, bound gear and lockers, the balance pass with equipment | Forge | Craft and equip; difficulty tuned with gear |
| **S8 — Tier Finale and promotion** | The Tier Finale (open question Q6), promotion, the Tier 2 world | Tier Finale landmark | Promote an Uma into Tier 2 |

Before S4, a **pacing model** sets the timers, XP curves, Laurel payouts and prices. Before S4 there's also one
platform task: publish the original art (item icons) as a package that the games install.
