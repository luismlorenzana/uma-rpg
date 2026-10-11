# Farm, refining and the Exchange

> **Status: current (S4, 2026-10-10; D54–D56).** Numbers are in [pacing.md](pacing.md); items in [items.md](items.md).
> Code: `packages/domain/src/economy/` (jobs, pacing), `src/items/catalog.ts`, `src/save/work.ts` and
> `src/save/exchange.ts`.

## Jobs (D55)

- Every facility has **slots**. Put an owned Uma in a free slot and choose **what** she makes and **how many** (1–50).
  She makes them one after another while the app is closed; nothing ticks in the save, everything is computed from
  the start time.
- **Sites** (the 8 farming and 8 gathering sites) gather their family's raw items. **The Pantry and the Workbench**
  refine one raw item into its refined form; a refining job **reserves its inputs** when it starts.
- **Collect** moves finished items to the Warehouse and pays her profession EXP for them. Collect anytime; a finished
  job frees the slot when collected. **Recall** ends the job: what's made is collected, inputs for items never made
  come back, and the item in progress is lost.
- An Uma works **one job at a time**, never while she's in an open fight, and a party with a working member can't start
  a fight. Working members show **Busy** in their party; the Party Hall can recall them.
- A job's speed is fixed when it starts: her surface aptitude for the profession and the facility's speed.
- **Rush** finishes a farm job at once for one Rush Ticket per started hour left.

## Facilities

Levels 1–3: a third slot at level 2, a quarter faster at level 3. Upgrades cost Laurels and refined items of the
facility's two families (pacing.md). Facility levels belong to the tier world.

## Professions

Each Uma has Farming & Cooking and Gathering & Crafting levels (1–50). Grades open every five levels. Sites, the
Pantry and the Workbench raise them now; the Kitchen and the Forge will too (S6, S7).

## The Warehouse

One stock per tier world: every raw and refined item by id. Dishes (S6) and gear (S7) get their own shelves.

## The Exchange

Laurels buy raw items of reached chapters' grades, Rush Tickets and Sweep Tickets. A **Sweep** completes a regular
fight the party has beaten before: the same EXP and Shards as a win, no Laurels, MP untouched, the win counted. It
needs a full party with nobody working and no open fight.

## The Hub

Each place with slots shows them live: the face of each working Uma, ringed by her job's progress, and a **Ready**
tag when there's something to collect. Each page tab counts its places with something ready.
