# Handoff: open work, ranked

> **Status: 2026-10-12, after D112, pruned with the owner (D113).** Only work the owner asked for or the game's plan
> needs. Each task is a self-contained packet in [tasks/](tasks/); [master-prompt.md](master-prompt.md) starts a fresh
> ChatGPT session on them. Claude reviews and merges every pull request. When a task is done, its packet and its row
> here are deleted (D35).

## Ranked

| # | Task | Who | Size | Needs |
|---|---|---|---|---|
| **Now** | | | | |
| [H08](tasks/H08-battle-backdrops.md) | Battle backdrops by biome | ChatGPT | M | — |
| [H10](tasks/H10-battle-effects-and-familiars.md) | Battle hit effects and Summoner familiars (art published) | ChatGPT | M | — |
| [H11](tasks/H11-ui-icons.md) | Class emblems and status icons (art published) | ChatGPT | S | — |
| [H13](tasks/H13-w4-field-effects.md) | W4: field effects and home ground | Claude | M | — |
| [H20](tasks/H20-key-boss-faces.md) | Key bosses' faces (D76) | Claude, then the owner | S | The owner's picks |
| **Parked by the owner** | | | | |
| [H23](tasks/H23-tier-finale-and-promotion.md) | S8: Tier Finale and promotion | The owner decides, Claude builds | L | Q6 |
| [H24](tasks/H24-tier-2-3-design.md) | Tier 2 and 3 design | The owner and Claude | M | Q7, H23 |

**For ChatGPT, in order:** H08, H10, H11.

- **Balance** waits on the owner's play: the [pacing ledger](../design/pacing.md#simulated) gives the numbers, Claude
  retunes.
- **Releases:** the owner runs the [phone check](../testing/phone-check.md).
- **Other repos** (uma-racer phase 3, uma-puzzle phase 4) are in uma-platform's `docs/roadmap.md` and uma-racer's
  `docs/rearchitecture/`, not here.

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
