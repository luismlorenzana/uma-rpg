# Handoff: open work

> **Status: 2026-11-05, after D302.** Tier 1 is built and live: engine v21, save v37. That covers the Tier rework's R1
> and R2, the farm by line, the Wilds' trios, weaknesses v2, **Classes v3 with Halls v2** (thirteen classes in a tree,
> Tier 0 and promotion, five halls; H134), trimmed to sixteen Limit Breaks (D261), and **Uma profile v2** (H117–H125, D272). Tier 2 and Tier 3 worlds run Tier 1's rules × tier
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

**Queue** (packet ids continue from H167; decision numbers from D297). **Classes v3 and Halls v2 are done and live**
(H126–H137, D240–D257); their packet tables and Done rows are in [the archive](../archive/handoff-history.md). Art
packets go to ChatGPT, which draws, merges and publishes uma-art itself; the uma-rpg packet that first uses the art
pins it.

**Profile polish** ([proposal](../design/profile-polish/proposal.md), pages: [Details](../design/profile-polish/previews/details.html) and
[star chart](../design/profile-polish/previews/star-chart.html)) is finished and live. H144 pins H141's uma-art 2.19.0:
five native pixel crests and eight stat marks on the chart, totals and Details (D297).

**The combat pass** (H145–H149, D282) is built and live: foes no longer guard, one symbol per kind, the healers' one kit and
rescue, buffs and debuffs on their paths, pure Brawlers and Sorcerers, a Spellblade's bound familiar.

**Collections** ([design](../design/collections/collections.md), approved D283; pages: [window](../design/collections/previews/window.html),
[board](../design/collections/previews/board.html), [content](../design/collections/previews/content.html) and
[screens](../design/collections/previews/screens.html)): every Uma's stained-glass window, lit by a 31-step board a
tier and standing beside her bust; the Gallery, ranked, in the Observatory's place; Ascend one Uma at a time once her
window is full; Trials (the Echoes' own place); Drills paying Training Logs. Live since H157 (save v35, D288), with a
Weapons track since save v36 (D289). H156's three buildings are published in uma-art 2.20.0 and adopted by H158 (D299).
The series' first phase is finished and live.

**Done:** H150–H158 (below), including the Gallery, Trials and Drill Yard's own Hub buildings.
uma-platform's `latest` is release `01ba1c71f403` (2026-11-02),
which carries the pane maps; undo with `pnpm release:publish -- --rollback f8ab287029e8` in uma-platform.

**The reclass** ([doc](../design/reclass/reclass.md), [preview](../design/reclass/previews/reclass.html)) is live (D290):
the Warrior and the Mage promote into three Tier 1 classes, the Spellblade, the Summoner and the Healer into four (D291).

**Capitals v2** ([design](../design/capitals/capitals.md), [preview](../design/capitals/previews/capitals.html), approved
D293): each capital becomes runs of four full parties, four lanes of three generals, then four final bosses; World n
lights on a won run. Save v37 activates the run rules and screens (H162); the old three-route capital is removed.

| Id | What | Who | Size | Needs | State |
|---|---|---|---|---|---|
| H159 | The fourth Finals route for every scenario, and the run's foes | Claude | M | — | Done (D296), below |
| H160 | The run rules and save v37, dark: start, lanes, the Final, pay, the World step | ChatGPT | L | H159 | Done (D300), below |
| H161 | The screens, dark: the capital page, New run, a run's page, the result | ChatGPT | L | H160 | Done (D301), below |
| H162 | The switch: save v37 live, the old capital removed, the manual, the phone check | ChatGPT | M | H159–H161 | Done (D302), below |

**The honeycomb continent map** ([design](../design/world-map/honeycomb.md), [preview](../design/world-map/previews/honeycomb.html),
approved D295): every continent as an SVG honeycomb of 48 regions (eight new) for 24 parties, the capital at the centre
ringed by six run seats, Lv 6–10 inside and Lv 1–5 on the shore, six Springs each serving its nearest eight, and the five
who claimed and cleared each region on its hex. Built dark behind `honeycombLive()` (save v38), switched on by H166.
Every packet can go to ChatGPT; no art packet.

| Id | What | Who | Size | Needs | State |
|---|---|---|---|---|---|
| [H163](tasks/H163-honeycomb-world-shape.md) | The world's shape, dark: eight new regions a continent, six Springs, the layout, each region's Spring | ChatGPT or Claude | M | — | Ready |
| [H164](tasks/H164-honeycomb-save.md) | Save v38, dark: who claimed and cleared each region, 24 parties, six open runs | ChatGPT or Claude | L | H160, H163 | Waits |
| [H165](tasks/H165-honeycomb-screen.md) | The screen, dark: the SVG honeycomb, its hexes, the quick looks, zoom, 24 parties on screen | ChatGPT or Claude | L | H161, H164 | Waits |
| [H166](tasks/H166-honeycomb-switch.md) | The switch: save v38 live, the pixel continent map removed, the manual, the phone check | ChatGPT or Claude | M | H162, H165 | Waits |

**Order:** H160–H162 are done; H163 can start now. Then H164 after H163, H165 after H164, and H166 after H165.

**Pinned for later:** foes covering each other, as a feature of special boss fights (D282, B1). Engine v20's rule is in
`guardOf` and `chooseTarget`'s `ally` target; a boss that does it should show who she covers on screen.

**After hardening:** Tier 2 and Tier 3 are re-planned. Their approved drafts stay in
[design/tier-rework/](../design/tier-rework/README.md) (Class, Weapon, Extra Stats and Profession Progression, stat
balance, Uma Templates). The old R3–R5 packets (H83–H105) were removed on 2026-10-28; the archive lists them.

**Also:**
- **Releases:** the owner checks each one on the phone with the [phone check](../testing/phone-check.md).
- **Versions:** engine v21, save v37; uma-kit 0.17.0, uma-art 2.20.0, uma-data 1.3.0, uma-work 0.1.0 and uma-server
  0.2.0. The change protocol for one game or both is [change-protocol.md](../change-protocol.md).
- **CI:** runs the test suites one package at a time (`pnpm test:ci`, D256), which ended Vitest's `Timeout calling
  "onTaskUpdate"` failures. If it ever recurs with every test passing, rerun the failed job.

## Done

Packets finished since the last archive go here, newest first; the archive keeps every earlier Done row.

| Id | Task | Commit |
|---|---|---|
| H162 | Capital runs live, save v37 and engine v21 (D302): four parties, twelve generals, four finals and World credit for all twenty; old capital stages and champion masks removed, frozen open fights settle safely. Full checks, both phone sizes/themes, exact scratch migration and repeat pay passed; initial JS 224.94 KB gzip. [Production green](https://github.com/luismlorenzana/uma-rpg/actions/runs/42026926548); exact health commit, deployed entry and capital-page chunk verified; the [phone check](../testing/phone-check.md) includes the run flow. | `076d601` ([#106](https://github.com/luismlorenzana/uma-rpg/pull/106)) |
| H161 | Capital-run screens, dark on live v36 (D301): the capital list, inline four-party sign-up, frozen lane rosters, foe sheets, locked/open finals, Abandon, shared fights/results and World tiles. Full checks and both phone sizes/themes passed; scratch play won generals and a run, with all twenty World steps persisted. Initial JS 226.02 KB gzip; [production green](https://github.com/luismlorenzana/uma-rpg/actions/runs/42020081836), exact health commit, deployed entry and capital-screen chunks verified. | `33b63a4` ([#104](https://github.com/luismlorenzana/uma-rpg/pull/104)) |
| H160 | Capital-run rules and strict save v37 parsing, dark on live v36 (D300): four frozen parties, twelve generals and four finals, per-entrant pay, World credit, abandon and Ascend lock; carried MP and map wins unchanged. Full checks and 38 new tests passed; current Finals checked locally; [production green](https://github.com/luismlorenzana/uma-rpg/actions/runs/41959244976), health commit and exact deployed entry verified. | `5c0f0e3` ([#102](https://github.com/luismlorenzana/uma-rpg/pull/102)) |
| H158 | Collections' first phase complete: uma-art 2.20.0 pinned, Gallery → `gallery`, Trials → `trials`, Drills → `drill-yard` (D299). Full checks and both phone sizes/themes passed; [production green](https://github.com/luismlorenzana/uma-rpg/actions/runs/41950893931), health at the merge commit and deployed building-atlas bytes verified. | `e7d5d7e` ([#100](https://github.com/luismlorenzana/uma-rpg/pull/100)) |
| H156 | Gallery, Trials and Drills: three original native 48px buildings (platform P86), filling the last cells on the unchanged 288×432 atlas. All 51 older records and pixels remain exact; native/2× comparisons and ≥25% silhouette guards passed, with full platform checks. Uma-art 2.20.0 is [published](https://github.com/luismlorenzana/uma-platform/actions/runs/41908742455) and adopted by H158 above. | Art `9323162` ([platform #67](https://github.com/luismlorenzana/uma-platform/pull/67)) |
| H167 | Skill names, one grammar for every Tier 1 tree (D298, [skill-names.md](../design/skill-names/skill-names.md)): a word a tree, Greater · Grand · Supreme, a capstone, line B as A's name with its word; 528 of the 560 live names, the Summoners' Bonded line now Oath and the healers' Heavy Surge; names only, no engine or save change | `9d88510` |
| H144 | Profile polish finished: uma-art 2.19.0 pinned, five native 24px star crests and eight native 16px stat marks replace the vector stand-ins (D297). Full checks and both phone widths/themes passed; [production green](https://github.com/luismlorenzana/uma-rpg/actions/runs/41906774018), health at the merge commit and deployed atlas bytes verified. | `5017f41` ([#88](https://github.com/luismlorenzana/uma-rpg/pull/88)) |
| H141 | Five native 24px star crests and eight native 16px stat marks (platform P80); the 120×220 UI atlas preserves every earlier frame, and native/2×/4× white, dark and night-sky previews passed review. Uma-art 2.19.0 is [published](https://github.com/luismlorenzana/uma-platform/actions/runs/41880067892) and adopted by H144 above; H156's 2.20.0 art is published above. | Art `b612403` ([platform #64](https://github.com/luismlorenzana/uma-platform/pull/64)) |
| H159 | Capital runs' foes: a fourth Finals route for all fourteen scenarios, the run's ids and its sixteen fights, the map's capitals byte for byte as before (D296) | `2938491` |
| H157 | Collections live, save v35: the switch, the run-wide Ascend and the Observatory removed, the manual and the phone check (D288) | `ceab990` |
| H155 | Windows on screen, dark: her window beside her bust, the Window sheet, the Gallery, Ascend one Uma at a time, latching and the "Window +1" note (D287) | `3bc65cc` |
| H154 | Drills and Training Logs, dark: five Drills a tier, ten runs a day banked to thirty, Logs a third of her next level (D286) | `11d2d05` |
| H153 | Trials: the Echoes' own place on the Battle page, live, on the Knights' Bastion until H156 (D285) | `30b9902` |
| H152 | Windows, the rules, dark: the board, latching, the World record and the Rift step, save v35's fields, Ascend one Uma at a time (D284) | `cc81286` |
| H151 | Both apps: `ProfileFrame`'s companion square, uma-kit 0.17.0 (platform P85) | Kit `82c23db`, release `a6bef9f` |
| H150 | The window's pane map, `outfit-glass-order`, uma-data 1.3.0; all 272 windows byte for byte as before, the maps 2.8 MB; candidate release `01ba1c71f403` (platform P84) | Platform `fc7906f`, release `a6bef9f` |
| H143 | Profile polish: a body's strip in the node sheet, stat marks on the totals and Details (D278) | `12229df` |
| H142 | Profile polish: the star chart, on one checked table of coordinates, with vector crests (D277) | `a96132e` |
| H140 | Profile polish: Details opens on damage, All stats a tap down, sources in color (D276) | `b3d4d67` |
| H139 | Profile polish: `umaDamageSheet`, each weapon's sum proved equal to a real fight's (D275) | `380d798` |
| H125 | Uma profile v2 measured: everything about her 5.73 screens from 9.5; the phone check; D229 superseded (D272) | `021ef11` |
| H124 | Uma profile v2: every door opens a tab, Back returns to it, ‹ n/N › (D271) | `518557f` |
| H123 | Uma profile v2: the Template tab, no calling pick (D270); B2 1.28 at 390×844 | `36ee376` |
| H122 | Uma profile v2: the Stars tab, Set all and the Observatory as a door (D269); B2 1.16 at 390×844 | `81e536f` |
| H121 | Uma profile v2: the Gear tab, eleven tiles, raise sheets, Raise all (D268); B2 1.00 at 390×844 | `39e8be4` |
| H120 | Uma profile v2: the Class tab, the class tree, promotion and the Limit line (D267); B2 1.38 at 390×844 | `6c5df6e` |
| H119 | Uma profile v2: the frame, four tabs, the compact header, the facts row and Details (D265) | `1b807d4` ([#86](https://github.com/luismlorenzana/uma-rpg/pull/86)) |
| H118 | Compact `ProfileFrame`/progress and optional worker face doors (platform P79), uma-kit 0.16.0 [published](https://github.com/luismlorenzana/uma-platform/actions/runs/41116447663) and pinned; both games' full checks, default markup frozen, four native size/theme checks and a 44pt worker-face tap. RPG keeps its existing display until H119/H124; H119 is Ready after H117 and H118. | Kit `5662009` ([platform #62](https://github.com/luismlorenzana/uma-platform/pull/62)); RPG pin `d5c733a` ([#84](https://github.com/luismlorenzana/uma-rpg/pull/84)), [production workflow](https://github.com/luismlorenzana/uma-rpg/actions/runs/41117831299) |
| H138 | Five base-class family emblems in place and the uma-art 2.18.0 pin (D262, platform P78); all other UI pixels and metadata frozen; actual native Classes-sheet acceptance at both phone widths, light/dark | Art `9dc40f3` ([platform #60](https://github.com/luismlorenzana/uma-platform/pull/60)), [2.18.0 published](https://github.com/luismlorenzana/uma-platform/actions/runs/41099542585); RPG pin `d48ed93` ([#83](https://github.com/luismlorenzana/uma-rpg/pull/83)) |
| H117 | Uma profile v2: the live profile's compact copy, one wording list in code, copy enforcement in CI and three 44 pt targets (D258) | `e14a93c` |

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
