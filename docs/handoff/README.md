# Handoff: open work, ranked

> **Status: 2026-10-21, after D161.** The open work is the approved tiers, classes v2 and the Rift
> ([tiers](../design/tiers.md), [classes v2](../design/classes-v2.md), [the Rift](../design/rift.md); D159–D161).
> Each task is a self-contained packet in [tasks/](tasks/).
> - Start a worker, Claude or ChatGPT, with uma-platform's
>   [master prompt](https://github.com/luismlorenzana/uma-platform/blob/main/docs/handoff/master-prompt.md). Name the
>   packet: "Take H35".
> - Workers decide what a packet leaves open, record it, and flag their own packets done: delete the packet and add a
>   Done row below (D35).
> - **The owner dispatches.** On 2026-10-21 the owner had Claude's main session dispatch all twelve to its worker agents, in waves, and review each.

## This repo's packets

**Build now** (approved designs; checks are local, the owner checks screen edges on the phone, P60):

| Id | Task | Who | Size | Needs | State |
|---|---|---|---|---|---|
| H32 | Mage, Cleric and Summoner unlock in magic armor (one class → armor table) | Either | S | — | Done (`b535754`) |
| [H33](tasks/H33-class-presets.md) | A standard equipment preset per class, applied from the Gear tab | Either | S–M | H32 | Ready |
| [H34](tasks/H34-upgrade-badges.md) | "Can upgrade" badges: Stable tile, filter, profile tabs (with a small kit step) | Either | M | — | Ready |
| [H35](tasks/H35-active-tier.md) | Tier switching: every screen, action and push on the active tier's world | Claude | M | — | Ready |
| [H36](tasks/H36-tier-shifter.md) | The Tier shifter on the top bar's crest, and the dusk/night tints (kit options first) | Either | S–M | H35 (the kit part can start now) | Waiting |
| [H37](tasks/H37-save-v23.md) | Save v23: achievements, tier history, the Rift's slot | Claude | S | — | In progress (this session) |
| [H38](tasks/H38-rift-art.md) | **Art:** the Rift building, four front crests, achievement badges (uma-art) | ChatGPT | M | — | In progress (this session) |

**Write now** (design docs for Tier 2, each with owner calls; no code):

| Id | Doc | Who | Size | Needs | State |
|---|---|---|---|---|---|
| [H39](tasks/H39-doc-tier2-classes.md) | Tier 2's advanced classes (`tier2-classes.md`, calls A1–A9) | Claude | M | — | In progress (this session) |
| [H40](tasks/H40-doc-weapon-arts.md) | Weapon arts and armor sets (`weapon-arts.md`, calls E1–E9) | Claude | M | — | In progress (this session) |
| [H41](tasks/H41-doc-outer-ring.md) | The Extra Stats outer ring (`extra-stats-tier2.md`, calls X1–X8) | Claude | M | — | In progress (this session) |
| [H42](tasks/H42-doc-second-profession.md) | The second profession (`second-profession.md`, calls V1–V8) | Claude | M | — | In progress (this session) |
| [H43](tasks/H43-doc-tier2-world.md) | Tier 2's world and its Rift, including the ascended party's starting difficulty (`tier2-world.md`, calls Z1–Z10) | Claude | M | — | In progress (this session) |

**Ready now, in parallel:** H33, H34, H35, H37, H38 and H39–H43. H36 follows H35.

**Overlaps to know:**
- **Gear tab:** H33 and H34 both touch it. Whichever lands second rebases.
- **uma-kit releases:** H34 and H36 each ship a kit minor. Fetch `main` and take the next version.
- **Doc pairs:** H39 and H40 share engine v15, and H41, H42 and H43 cross-reference each other. Each doc matches the
  others that already exist.

**Next, packets to write after these:**
- **Classes v2, engine v14** (C1–C7: Paladin and Cleric, Spell Blade, Summoner, the halls, accessories, the ward,
  balance and release), plus a small art packet for the Paladin's class emblem and the Paladin Bastion building.
- **Tier 1 simplification** (D1).
- **The Rift:** generator, run rules and Ascend, achievements, page, balance (E1–E5).

**Also:**
- **Balance** waits on the owner's play: the [pacing ledger](../design/pacing.md#simulated) gives the numbers, Claude
  retunes.
- **Releases:** the owner runs the [phone check](../testing/phone-check.md).
- **Versions:** this game runs on uma-kit 0.9.1, uma-data 1.1.0, uma-work 0.1.0 and uma-server 0.2.0. The change
  protocol for one game or both is [change-protocol.md](../change-protocol.md).

## Done

| Id | Task | Commit |
|---|---|---|
| H32 | New Mages, Summoners and Clerics unlock in magic armor through one class → armor table, `RPG_CLASS_ARMOR`; existing Umas keep theirs (D162). Locally validated at both phone widths and [deployed green](https://github.com/luismlorenzana/uma-rpg/actions/runs/39695099232) | `b535754` |
| SE3 | Master data, release art and private enemy content through `uma-kit/content` and `uma-server/content` (D158). Locally validated and [deployed green](https://github.com/luismlorenzana/uma-rpg/actions/runs/39633132807) | `18dbd4b` |
| SC4 | All 11 Wilds facilities and quick looks on `uma-kit/work`'s shared rows, sheets, targets and stopped queues (D157). Locally validated at both phone widths and [deployed green](https://github.com/luismlorenzana/uma-rpg/actions/runs/39590331919) | `c8bded0` |
| SB5 | Party busts in spaced, solid bordered cards; slower breath, victory hop/glow, no fight chibi requests (D156). Locally validated and [deployed green](https://github.com/luismlorenzana/uma-rpg/actions/runs/39167185219) | `11e39f9` |
| SB4 | Shared Stable, all six Uma picker contexts and plaza chooser, outfit faces, saved views and New (D154); ten target Umas (D155). Locally validated and deployed | `b205b52` (CI timeout repair `21b4fa9`) |
| SC3 | Work on `@luismlorenzana/uma-work` 0.1.0: four kinds, save v22, Repeat and stopped queues (D152) | `6063b95` |
| SD3 | Getting in, Account, Warehouse, Exchange and the profile frame on uma-kit 0.7.0; the API's guard from uma-server 0.2.0 (D153) | `3ea66a4` |

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
