# Farm, refining and the Exchange

> **Status: built through D96, 2026-10-12.** [The job manual](../game/loops.md#professions) describes current
> behavior and generates times/grades. Code: `economy/jobs.ts`, `save/work.ts`, `save/exchange.ts`.

## Jobs

Facilities assign one owned Uma per slot, for 1–10 outputs made in sequence (D55, D65).
Sites gather raw items; Pantry and Workbench refine one-for-one.
Kitchen and Forge make dishes and gear with reserved inputs (D58, D86, D94).
Timers derive from start timestamps, so closing the app loses no progress.

Collect pays finished items and profession EXP. Recall pays finished outputs, refunds unmade inputs and drops the
queue; only the unfinished output's time is lost (D55, D62).
One Uma works one job at a time, and a working party member prevents fighting.
Up to three further jobs queue for the same worker; missing inputs stop the chain.

Time Tickets take thirty minutes off any job or training; Finish spends one per started thirty minutes remaining.
Rush retired in D74.

## Facilities and professions

Facility upgrades add a third slot, then ×1.25 speed; the tier world owns the upgrades (D54).
Farm and Craft are two shared-curve Lv1–50 professions. Turf and Dirt respectively set job speed.
Grade k opens at Lv 5k − 4. Profession EXP is paid per base minute, not per batch (D54, D65).
The longer curve takes weeks per Uma; the roster works many slots in parallel (D96).

## Warehouse and Exchange

Raw/refined items, tokens, dishes and unbound gear have separate shelves (D55, D58, D59).
The Exchange stocks a continent's grade pair after any stage there is won, and sells Time/Sweep Tickets and tokens.
Stock can sell for Laurels, but bound gear cannot (D62, D80).

Sweeps replay a cleared regular stage with a full, idle active party and no open fight.
They pay replay EXP, Shards, Laurels and seeded token drops, without touching MP (D79).
Exact prices, restrictions and facility lists are in [the manual](../game/loops.md) and
[sections](../game/sections.md#facilities).
