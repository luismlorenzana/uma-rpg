# Handoff: open work, ranked

> **Status: 2026-10-12, after D112, pruned with the owner (D113).** Only work the owner asked for or the game's plan
> needs. Each task is a self-contained packet in [tasks/](tasks/); [master-prompt.md](master-prompt.md) starts a fresh
> ChatGPT session on them. Agents merge after required checks and green CI under D120. When a task is done, its packet and its row
> here are deleted (D35).

## Ranked

| # | Task | Who | Size | Needs |
|---|---|---|---|---|
| **Now** | | | | |
| [H31](tasks/H31-laurel-mark-and-battle-tiles.md) | Art for Phase A: a Laurel mark and the Battle tile page | ChatGPT, Claude releases | S–M | — |
| [H13](tasks/H13-w4-field-effects.md) | W4: field effects and home ground | Claude | M | — |
| **Parked by the owner** | | | | |
| [H23](tasks/H23-tier-finale-and-promotion.md) | S8: Tier Finale and promotion | The owner decides, Claude builds | L | Q6 |
| [H24](tasks/H24-tier-2-3-design.md) | Tier 2 and 3 design | The owner and Claude | M | Q7, H23 |

**For ChatGPT, in order:** H31. H08, H10, H11 and H28–H30 are complete.

- **Balance** waits on the owner's play: the [pacing ledger](../design/pacing.md#simulated) gives the numbers, Claude
  retunes. **Combat** was rebalanced by D140–D141 ([combat balance](../design/combat-balance.md)); its next pass comes
  from the owner's play.
- **The farm is gone** (D144, [after the farm](../design/after-the-farm.md)): Star Gems from the Lapidary feed Extra
  Stats, on one profession, Craft Level. H29 supplied their own art in uma-art 2.8.0.
- **Releases:** the owner runs the [phone check](../testing/phone-check.md).
- **Other repos** (uma-racer phase 3, uma-puzzle phase 4) are in uma-platform's `docs/roadmap.md` and uma-racer's
  `docs/rearchitecture/`, not here.
- **Sibling apps** (approved 2026-10-16, platform P48): one shell, Hub and Uma album shared with uma-racer through
  `@luismlorenzana/uma-kit`, planned in uma-platform's
  [`docs/sibling/`](https://github.com/luismlorenzana/uma-platform/blob/main/docs/sibling/README.md). This game's Phase 0
  is complete (H30); Phase A's art is H31. Claude builds the kit and moves this game onto it; uma-racer's session moves uma-racer.

## Removed on 2026-10-12

| Was | Why |
|---|---|
| H17, device and accessibility pass | Never asked for: one player on one phone. Problems get fixed when the owner hits them |
| H18, synthesized sound effects | Never asked for |
| H19, Hub pages that scroll and zoom | Never asked for; every Hub page fits the screen |
| H21, CI on Ubuntu 26 | Every deploy is watched; a runner break shows on the first push after 2026-10-19 |
| H22, PriConne name spellings | Never asked for |
| H25, H26, uma-racer and uma-puzzle phases | Tracked in uma-platform's roadmap and uma-racer's own plan |
| `docs/backlog.md` | Repeated this page |

## How a packet reads

Each packet stands alone: **Why**, **Context** (what to read, what exists), **Do** (the work, with decisions already
made), **Done when** (checks anyone can run) and **Deliver** (branch, pull request, what to attach). Decisions a packet
makes are logged in [decisions.md](../decisions.md) by Claude when the pull request merges.
