# H25 — uma-racer phase 3

**Priority P4 · the owner and Claude · uma-racer and uma-platform · L.** Waits on a Farm rework spec with the owner.

## Why

uma-platform's roadmap phase 3 has three parts:

- switch uma-racer to the platform's master data;
- extract the shared kit;
- strip the RPG and the puzzles from uma-racer (they live in their own games now), and rework its Farm.

Until then uma-racer gets no new RPG or puzzle features (P17), and Claude reads it only from `origin/main`.

## The decision first

The owner and Claude write the **Farm rework spec**: what uma-racer's Farm becomes once the RPG and the puzzles leave.

## Then (Claude)

Follow uma-platform `docs/roadmap.md` phase 3:

1. Tag `pre-split`.
2. Switch to `@luismlorenzana/uma-data`.
3. Extract shared packages (P11) once a second game needs them.
4. Strip the RPG and the puzzles.
5. Build the Farm rework.

Each step gets its own pull request in uma-racer, plus a uma-platform session for shared changes.

## Done when

The roadmap's phase 3 exit check passes.
