# Handoff: open work, ranked

> **Status: 2026-10-16, after D150.** The open work is the sibling apps plan, phases B to E (uma-platform P48,
> [phases](https://github.com/luismlorenzana/uma-platform/blob/main/docs/sibling/phases.md)). Unrelated packets were
> archived by the owner's call (D151). Each task is a self-contained packet in [tasks/](tasks/).
> - Start a worker, Claude or ChatGPT, with uma-platform's
>   [master prompt](https://github.com/luismlorenzana/uma-platform/blob/main/docs/handoff/master-prompt.md).
> - The whole program, across uma-platform, uma-rpg and uma-racer, is uma-platform's
>   [queue](https://github.com/luismlorenzana/uma-platform/blob/main/docs/handoff/README.md).
> - Workers flag their own packets done: delete the packet, add a Done row below, and set its State in uma-platform's
>   queue (D35).

## This repo's packets

| Id | Task | Who | Size | Needs | State |
|---|---|---|---|---|---|
| **Phase B: one Uma album** | | | | | |
| [SB5](tasks/SB5-rpg-battle-busts.md) | Busts on the battle stage, no chibis | Either | S | — | Ready |
| [SB4](tasks/SB4-rpg-album.md) | The Stable, six pickers and every small Uma on the kit album, with faces | Either | L | SB3 (SB1 for faces) | Waiting |
| **Phase C: one work system** | | | | | |
| [SC3](tasks/SC3-rpg-on-uma-work.md) | Work on `@luismlorenzana/uma-work`: kinds, save v22, the API | Claude | L | SC1 | Waiting |
| [SC4](tasks/SC4-rpg-work-screens.md) | The Wilds on `uma-kit/work`'s screens | Either | M | SC2, SC3 | Waiting |
| **Phase D: places, profile and getting in** | | | | | |
| [SD3](tasks/SD3-rpg-places.md) | Getting in, Account, Warehouse, Exchange and the profile frame on the kit; the API's guard from `uma-server` | Either | M | SD1, SD2 | Waiting |
| **Phase E: platform plumbing** | | | | | |
| [SE3](tasks/SE3-rpg-content.md) | Master data and art through `uma-kit/content` and `uma-server/content` | Either | S | SE2 | Waiting |

**Ready now:** SB5. The rest wait on uma-platform's packets (SB1–SB3, SC1–SC2, SD1–SD2, SE2), which run in parallel
there.

- **Balance** waits on the owner's play: the [pacing ledger](../design/pacing.md#simulated) gives the numbers, Claude
  retunes. Combat was rebalanced by D140–D141 ([combat balance](../design/combat-balance.md)).
- **Releases:** the owner runs the [phone check](../testing/phone-check.md).
- **Sibling apps so far:**
  - **Phase 0:** H30 (D146).
  - **Phase A:** uma-kit (D147–D150), and H31's art in uma-art 2.9.0 (D148).

  This game runs on uma-kit 0.3.0. The change protocol for one game or both is [change-protocol.md](../change-protocol.md).

## Done

| Id | Task | Commit |
|---|---|---|

## Archived on 2026-10-16 (D151)

The owner asked to clear open work unrelated to the sibling plan. These packets are deleted; read one with
`git show 3ee16bf:docs/handoff/tasks/<file>`.

| Was | File |
|---|---|
| H13, W4: field effects and home ground | `H13-w4-field-effects.md` |
| H23, S8: Tier Finale and promotion (parked) | `H23-tier-finale-and-promotion.md` |
| H24, Tier 2 and 3 design (parked) | `H24-tier-2-3-design.md` |

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

Each packet stands alone:
- **Why** the work matters;
- **Context:** what to read and what exists;
- **Decisions made:** the decisions already taken;
- **Do:** the work;
- **Done when:** checks anyone can run;
- **Deliver:** the commit or pull request, and how to flag it done.

A worker decides anything a packet leaves open, records it under Decisions, and logs the packet's D-decision in
[decisions.md](../decisions.md) (fetch `main` first for the number).
