# Handoff: open work

> **Status: 2026-10-30, after D257.** Tier 1 is built and live: engine v19, save v32. That covers the Tier rework's R1
> and R2, the farm by line, the Wilds' trios, weaknesses v2, and **Classes v3 with Halls v2** (thirteen classes in a tree,
> Tier 0 and promotion, five halls and twenty Limit Breaks; H134). Tier 2 and Tier 3 worlds run Tier 1's rules × tier
> until they are re-planned. **The current phase is Tier 1 hardening:** polish Tier 1 from the owner's playtests before
> Tier 2 and Tier 3 are reworked.
>
> - **The manual of the game as it is:** [docs/game/](../game/README.md). Read it before any packet.
> - **History** (decisions D1–D237, finished build plans, done packets, superseded specs) is in
>   [docs/archive/](../archive/README.md). Don't follow it as current rules.
> - Each task is a self-contained packet in [tasks/](tasks/). Start a worker, Claude or ChatGPT, with uma-platform's
>   [master prompt](https://github.com/luismlorenzana/uma-platform/blob/main/docs/handoff/master-prompt.md) and name
>   the packet: "Take H117".
> - Workers decide what a packet leaves open, record it, and flag their own packets done: delete the packet and add a
>   Done row below (D35). Claude merges and deploys its own finished packets; ChatGPT merges its own.

## Tier 1 hardening (from 2026-10-28)

| Step | What | State |
|---|---|---|
| 1. Intake | The manual brought to the live game; finished work and history archived; the phases reset (D238). The code audit's 42 findings: [intake-findings.md](intake-findings.md) | Done |
| 2. General improvements | From the owner's playtest feedback: planned together, then packets | Next: the owner's feedback |
| 3. Specific improvements | Per system, from the same playtests | After step 2's plan |

**Queue** (packet ids continue from H138; decision numbers from D258). **Classes v3 and Halls v2 are done and live**
(H126–H137, D240–D257); their packet tables and Done rows are in [the archive](../archive/handoff-history.md). Art
packets go to ChatGPT, which draws, merges and publishes uma-art itself; the uma-rpg packet that first uses the art
pins it. Open now:

**Uma profile v2** (D239). Engine v19 has been live since H134 (D257): where a packet below builds a screen for both
generations or "inert until H134", build it for v19 only. The class tree and promotion sheets (H137), the calling card's
retirement and the hall-based names are already on `main`.

| Id | Task | Who | Size | Needs | State |
|---|---|---|---|---|---|
| [H117](tasks/H117-profile-copy-cleanup.md) | Uma profile v2 (D239): the copy cleanup on today's tabs (the 54 strings, the 3 wrong texts, F5, F11–F15), three 44 pt targets, the wording list as `copy.ts` and the copy test, the dead v1 preset sheet | ChatGPT | S–M | — | Ready |
| [H118](tasks/H118-kit-compact-profile-frame.md) | Both apps: a compact `ProfileFrame` header (`size`, `progress`) and a face door on `SlotRow` (`onFace`), uma-kit 0.16.0; uma-rpg pins it | Claude (uma-platform session) | S | — | Ready |
| [H119](tasks/H119-profile-frame.md) | Uma profile v2: the frame, four tabs (Class, Gear, Stars, Template) as a skeleton, the compact header and facts row (Party · Work · Details), the Details sheet, routes `outfit/:id/:tab` and the tab key, locked | Claude | M | H117, H118 | Waiting |
| [H120](tasks/H120-class-tab.md) | Uma profile v2: the Class tab, placing the class tree, promotion and Tier 0 sheets already on `main` (H137) | ChatGPT | M | H119 | Waiting |
| [H121](tasks/H121-gear-tab.md) | Uma profile v2: the Gear tab, nine tiles, raise sheets with before → after, Raise all | ChatGPT | M | H119 | Waiting |
| [H122](tasks/H122-stars-tab-observatory-door.md) | Uma profile v2: the Stars tab, Set all, and the Observatory as a door (its old route redirects) | ChatGPT | M | H119 | Waiting |
| [H123](tasks/H123-template-tab.md) | Uma profile v2: the Template tab (the calling by style, the family Flourish, moon II by root and 5 × 3 templates are live since H134) | Claude | S–M | H120, H121, H122 | Waiting |
| [H124](tasks/H124-profile-doors-back-stepper.md) | Uma profile v2: every door opens a tab, Back returns to it, ‹ n/N › next and previous Uma | Claude | S–M | H119 | Waiting |
| [H125](tasks/H125-profile-measure-close.md) | Uma profile v2: the built screens measured against B1–B4, the phone check, profile-ux.md superseded, the manual read through | Claude | S | H117, H118, H119, H121, H122, H124 | Waiting |

**After hardening:** Tier 2 and Tier 3 are re-planned. Their approved drafts stay in
[design/tier-rework/](../design/tier-rework/README.md) (Class, Weapon, Extra Stats and Profession Progression, stat
balance, Uma Templates). The old R3–R5 packets (H83–H105) were removed on 2026-10-28; the archive lists them.

**Also:**
- **Releases:** the owner checks each one on the phone with the [phone check](../testing/phone-check.md).
- **Versions:** engine v19, save v32; uma-kit 0.15.0, uma-art 2.17.0, uma-data 1.1.0, uma-work 0.1.0 and uma-server
  0.2.0. The change protocol for one game or both is [change-protocol.md](../change-protocol.md).
- **CI:** runs the test suites one package at a time (`pnpm test:ci`, D256), which ended Vitest's `Timeout calling
  "onTaskUpdate"` failures. If it ever recurs with every test passing, rerun the failed job.

## Done

Packets finished since the last archive go here, newest first; the archive keeps every earlier Done row.

| Id | Task | Commit |
|---|---|---|

## How a packet reads

Each packet stands alone:
- **Why** the work matters;
- **Context:** what to read and what exists;
- **Decisions made:** the decisions already taken;
- **Do:** the work;
- **Done when:** checks anyone can run;
- **Deliver:** the commit or pull request, and how to flag it done.

Profile work: the copy test passes; new facts are in the wording list (`apps/web/src/places/stable/copy.ts`) first.

A worker decides anything a packet leaves open, records it under Decisions, and logs the packet's D-decision in
[decisions.md](../decisions.md) (fetch `main` first for the number).
