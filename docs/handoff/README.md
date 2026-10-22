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
| H33 | A standard equipment preset per class, applied from the Gear tab | Either | S–M | H32 | Done (`9823201`) |
| [H34](tasks/H34-upgrade-badges.md) | "Can upgrade" badges: Stable tile, filter, profile tabs (with a small kit step) | Either | M | — | In progress (this session) |
| H35 | Tier switching: every screen, action and push on the active tier's world | Claude | M | — | Done (`061cdac`) |
| [H36](tasks/H36-tier-shifter.md) | The Tier shifter on the top bar's crest, and the dusk/night tints (kit options first) | Either | S–M | H35 (the kit part can start now) | In progress (this session) |
| H37 | Save v23: achievements, tier history, the Rift's slot | Claude | S | — | Done (`215fc93`) |
| H38 | **Art:** the Rift building, four front crests, achievement badges (uma-art) | ChatGPT | M | — | Done (uma-platform `e3da022`, uma-art 2.11.0) |

**Write now** (design docs for Tier 2, each with owner calls; no code):

| Id | Doc | Who | Size | Needs | State |
|---|---|---|---|---|---|
| H39 | Tier 2's advanced classes ([`tier2-classes.md`](../design/tier2-classes.md), calls A1–A10) | Claude | M | — | Done (`9cc1831`) |
| H40 | Weapon arts and armor sets ([`weapon-arts.md`](../design/weapon-arts.md), calls E1–E9) | Claude | M | — | Done (`919b361`) |
| H41 | The Extra Stats outer ring ([`extra-stats-tier2.md`](../design/extra-stats-tier2.md), calls X1–X8) | Claude | M | — | Done (`d15b84d`) |
| H42 | The second profession ([`second-profession.md`](../design/second-profession.md), calls V1–V8) | Claude | M | — | Done (`250f2ce`) |
| H43 | Tier 2's world and its Rift ([`tier2-world.md`](../design/tier2-world.md), calls Z1–Z10) | Claude | M | — | Done (`91ee4e7`) |

**Ready now:** H36 and H34 (H33 and H35 have landed).

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
| H35 | Every screen, action and push on the active tier's world (D165): `activeTier` in the store (`rpg.tier`), `useActiveTier()` and `setActiveTier(tier): boolean`, the shell remounted under `key={activeTier}`, `?tier=` links, one Uma in one world (unlock and parser refusals, the album's scope), Uma Tickets in Tier 1 only, the world map on the tier's continents, and one push per tier world. Tier 1 alone plays as before. Locally validated at both phone widths on Tier 1 and a synthetic two-tier save, and [deployed green](https://github.com/luismlorenzana/uma-rpg/actions/runs/39698646406) | `061cdac` |
| H41 | Doc: [the Extra Stats outer ring, "the Halo"](../design/extra-stats-tier2.md), calls X1–X8 (Q12) | `d15b84d` |
| H43 | Doc: [Tier 2's world and its Rift](../design/tier2-world.md), proposal for the owner with calls Z1–Z10 (Q16). Today a freshly ascended party wins none of `w6`'s opening stages (scratch simulation); the foe budget restarts at the tier's Lv 1 with its build part scaled to her lifetime stats, plus one Tier 2 term for the toolbox. New leans and pack table for `w6`–`w10`, shields +1, skill MP ×1.7 with H39's A10, tier levels on screen, Laurels ×2 with the regions' tier fixed, a first-week ledger (T5 stands), one added test per Rift front, the Twilight Rift biome renamed | `91ee4e7` |
| H33 | A standard preset per class, "Use the standard preset" at the top of the Gear tab: the default spread, the class's armor half, an Orb in accessory 1 and a support in accessory 2, with her best pieces or the stock's next grades her ranks allow; binding asks first in a sheet (D164). Locally validated at both phone widths and [deployed green](https://github.com/luismlorenzana/uma-rpg/actions/runs/39697022175) | `9823201` |
| H40 | Doc: [weapon arts and armor sets](../design/weapon-arts.md), proposal for the owner with calls E1–E9 (Q15). A core at Weapon Rank 4 and an A damage / B Break +1 fork at rank 8 for each weapon kind: thirty nodes from eight shape effects in mirrored Arm and element pairs. Set bonuses for a full physical suit (max HP) or magical suit (skill MP) in three steps. Nodes cost H42's Lore Scrolls, steps its Seals; the chip cap is H39's shared one, per foe. Flags the Duel shield against v14's multi-hit acts | `919b361` |
| H38 | The Rift's art in uma-art 2.11.0: the `rift` building (place 41, `page: battle`), four 16px `front/*` crests and eleven 24px `achievement/*` badges, append-only (uma-platform P66). The Rift page pins the release and points the `tier-finale` place at `rift` | uma-platform `e3da022` (release `4125858`) |
| H39 | Doc: [Tier 2's advanced classes](../design/tier2-classes.md), proposal for the owner with calls A1–A10 (Q14). Twelve passives within classes v2's slots, hands and 70/30, each pair winning a different Rift front; Duelist becomes Blademaster and three summons are renamed; Hero LB+ for anyone at Bond 10 with 24 drafted effects; skill MP ×1.7 in Tier 2 instead of ×tier | `9cc1831` |
| H42 | The second profession, a proposal with calls V1–V8 (Q13): Lore Level, Relics and Glyphs, Scrolls and Seals for weapon arts and set steps, raw items for the ring gems. Its three facilities stand on the Battle page's free sides: the kit's grid math shows a second Wilds trio row can't fit | `250f2ce` |
| H37 | Save v23: the account's achievements and each Uma's tier history, and each world's Rift (runs, Echo wins), all empty for existing saves and strictly parsed (D163). The owner's save upgrades on its next sync, with a `saveBackups/{uid}-v22` copy kept. Locally validated (a stored v22 row synced back as v23) and [deployed green](https://github.com/luismlorenzana/uma-rpg/actions/runs/39695592399) | `215fc93` |
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
