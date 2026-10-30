# Handoff: open work

> **Status: 2026-10-28, after D238.** Tier 1 is built and live: engine v18, save v31. That covers the Tier rework's R1
> and R2, the farm by line, the Wilds' trios and weaknesses v2. Tier 2 and Tier 3 worlds run Tier 1's rules × tier until
> they are re-planned. **The current phase is Tier 1 hardening:** polish Tier 1 from the owner's playtests before Tier 2
> and Tier 3 are reworked.
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

**Queue** (packet ids continue from H137; decision numbers from D242), in four groups (the owner, 2026-10-29):

**Art** (ChatGPT draws, merges and publishes uma-art itself; the uma-rpg packet that first uses the art pins it):

| Id | Task | Who | Size | Needs | State |
|---|---|---|---|---|---|
| [H135](tasks/H135-healer-sanctum-art.md) | **Art, optional** (uma-platform): a Healer Sanctum building; until then the Bastion's frame | ChatGPT (draws and publishes) | S | — | Ready |

**Uma profile v2** (D239):

| Id | Task | Who | Size | Needs | State |
|---|---|---|---|---|---|
| [H117](tasks/H117-profile-copy-cleanup.md) | Uma profile v2 (D239): the copy cleanup on today's tabs (the 54 strings, the 3 wrong texts, F5, F11–F15), three 44 pt targets, the wording list as `copy.ts` and the copy test, the dead v1 preset sheet | ChatGPT | S–M | — | Ready |
| [H118](tasks/H118-kit-compact-profile-frame.md) | Both apps: a compact `ProfileFrame` header (`size`, `progress`) and a face door on `SlotRow` (`onFace`), uma-kit 0.16.0; uma-rpg pins it | Claude (uma-platform session) | S | — | Ready |
| [H119](tasks/H119-profile-frame.md) | Uma profile v2: the frame, four tabs (Class, Gear, Stars, Template) as a skeleton, the compact header and facts row (Party · Work · Details), the Details sheet, routes `outfit/:id/:tab` and the tab key, locked | Claude | M | H117, H118 | Waiting |
| [H120](tasks/H120-class-tab.md) | Uma profile v2 + Classes v3: the Class tab (live on v18), and the class tree sheet, the promotion sheet, the Tier 0 tree, the promotion dot and the Manuals door (inert until H134) | ChatGPT | M+ | H119, H126, H127, H129 | Waiting |
| [H121](tasks/H121-gear-tab.md) | Uma profile v2: the Gear tab, nine tiles, raise sheets with before → after, Raise all | ChatGPT | M | H119 | Waiting |
| [H122](tasks/H122-stars-tab-observatory-door.md) | Uma profile v2: the Stars tab, Set all, and the Observatory as a door (its old route redirects) | ChatGPT | M | H119 | Waiting |
| [H123](tasks/H123-template-tab.md) | Uma profile v2 + Classes v3: the Template tab without the calling pick; the family Flourish, moon II by root and 5 × 3 templates on v19 | Claude | S–M | H120, H121, H122, H126 | Waiting |
| [H124](tasks/H124-profile-doors-back-stepper.md) | Uma profile v2: every door opens a tab, Back returns to it, ‹ n/N › next and previous Uma | Claude | S–M | H119 | Waiting |
| [H125](tasks/H125-profile-measure-close.md) | Uma profile v2: the built screens measured against B1–B4, the phone check, profile-ux.md superseded, the manual read through | Claude | S | H117, H118, H119, H121, H122, H124 | Waiting |

**Classes v3** (D240; Claude implements it in four phases, each a group to pick up whole; within a phase, packets start on the branch they need as soon as its pull request is reviewed, and merge in dependency order):

| Id | Task | Who | Size | Needs | State |
|---|---|---|---|---|---|
| [H136](tasks/H136-entry-budget.md) | Main JS headroom before Classes v3: the save's migration chain lazy again and the v1 economy's tables out of the entry (F36), with a size guard | Claude | S–M | — | Done (`e0e5c92`) |
| [H126](tasks/H126-classes-v3-domain.md) | Classes v3 (D240) in the domain, dark at engine v19: 13 classes and the tree, Tier 0, promotion and reclass, the two new hybrids, the calling by running style, trades, templates 5 × 3, the Rift's builds; v18 replays pinned | Claude | L | H136 | Done (`e209585`) |
| [H128](tasks/H128-weapon-shapes-v19.md) | Classes v3: Katana and Light doubles, Bow and Dark volleys, the twins re-paired, three line B changes, every twin reader | Claude | M | H126 | Done (`bf7e5fc`) |
| [H130](tasks/H130-save-v32-class-reset.md) | Save v32, dark: the class reset and refund as Class Marks, trade moves, the healer seats' merge; `toV32` not chained | Claude | M–L | H126, H129, H136 | Done (`2bea968`) |
| [H131](tasks/H131-classes-v3-balance.md) | Balance on engine v19: Classes v3's S1–S10 and Halls v2's targets, knobs as the designs name them | Claude | M–L | H126, H128, H129 | Done (`598060e`) |
| [H132](tasks/H132-classes-rebuilt-sheet-exchange.md) | "The classes are rebuilt" sheet and its Account row, the Exchange's Manual sheet | Claude | S–M | H126, H129, H130 | Done (`7890105`) |
| [H134](tasks/H134-classes-v3-switch.md) | **The switch:** engine v19 and save v32 live with `toV32` chained, the kind colours swapped, the manual rewritten | Claude | M | H120, H123, H127, H130, H131, H132, H133 | Waiting |

| Phase | Packets | What it leaves on main | Needs from other groups |
|---|---|---|---|
| 1. Foundation | H136 → H126 | Main JS back to ~215 KB; the 13 classes, the tree, Tier 0 and promotion in the domain, dark at engine v19 | — |
| 2. Rules and save | H128 ∥ H130 (both start on H126's reviewed branch; H130's healer-seat step waits for H129) → H129 (on H128's branch) → H131 | Weapon shapes, the twenty Limit Breaks, save v32 and the reset written, balance measured; all dark | H129 is the Halls group's domain packet: Phase 2 builds it, since H130 migrates the healer seats with the classes. H133 (ChatGPT) can start once H128 and H129 merge |
| 3. The reset's screens | H132 (starts once H130's pull request is up) | "The classes are rebuilt" sheet and the Exchange's Manual sheet, inert | — |
| 4. The switch | H134 | Engine v19 and save v32 live, the manual rewritten | H120 and H123 (Uma profile v2: the Class tab's promotion and the Template tab), H133 (Halls), H127 (Art) merged |

**Halls of Heroes v2** (D241):

| Id | Task | Who | Size | Needs | State |
|---|---|---|---|---|---|
| [H129](tasks/H129-halls-v2-limit-breaks.md) | Halls v2 (D241): five halls, the twenty Limit Breaks with their own power, class scale and the 10-hit cap | Claude | M | H126, H128 | Done (`d5cf696`) |
| [H133](tasks/H133-halls-v2-pages.md) | Halls v2: the Learning page's five halls and the Hall page (home class, shape, power), inert until H134 | ChatGPT | S–M | H128, H129 | Ready |

**After hardening:** Tier 2 and Tier 3 are re-planned. Their approved drafts stay in
[design/tier-rework/](../design/tier-rework/README.md) (Class, Weapon, Extra Stats and Profession Progression, stat
balance, Uma Templates). The old R3–R5 packets (H83–H105) were removed on 2026-10-28; the archive lists them.

**Also:**
- **Releases:** the owner checks each one on the phone with the [phone check](../testing/phone-check.md).
- **Versions:** engine v18, save v31; uma-kit 0.15.0, uma-art 2.15.0, uma-data 1.1.0, uma-work 0.1.0 and uma-server
  0.2.0. The change protocol for one game or both is [change-protocol.md](../change-protocol.md).
- **CI:** the web suite sometimes fails with Vitest's `Timeout calling "onTaskUpdate"` while every test passes. Rerun
  the failed job.

## Done

| Id | Task | Commit |
|---|---|---|
| H131 | Classes v3's and Halls v2's balance on engine v19, dark (D249), 32 seeds on Auto against v18: every Tier 1 stage still wins (S1, H2: 0 points); the mirrors within 2–6% (S3, S4); the Rift's right builds 91–100% a stage, champions 60–68%, the Convergence 50%. Tuned, v19 only: Tier 0 power ×1.05 (1.60 → 2.31), `HANDS_V19` (Tome Spellblade Arms 0.48, Arms Summoner Tome 0.46, both Summoners' lead 0.57), Light Pierce 0.85, the Limit Break scale 0.95 (healers 0.8), `RIFT_TUNING_V19`. **Recorded misses:** Paladin ÷ Cleric 117% (147% at Lv 30), Limit Breaks above the analytic for the hybrids and Summoners (133–150%: home seats now strike in her own weapons' kinds), Iron's stages 9–11 +16 points, the Arms Spellblade at 79–80% physical from Lv 30, the Bow Barrage and Light Pierce B lines, Lv 20's pace 90%. Main JS 219.44 KB gzip on CI | `598060e` |
| H127 | Seven Classes v3 emblems, delivered in [uma-platform #56](https://github.com/luismlorenzana/uma-platform/pull/56), P76/D251: five plain Tier 0 motifs and two mirrored channel hybrids, every older UI frame preserved; [uma-art 2.16.0 published](https://github.com/luismlorenzana/uma-platform/actions/runs/40932890896). H120 pins this version or later and removes the temporary class-emblem fallback. | platform `45bdebb` |
| H132 | "The classes are rebuilt" and the Exchange's Class Manual sheet (D250): the one-time sheet reads H130's record (each Uma's Manuals and trade, the Healer Sanctum's merge lines) with an Account row; the Manual sheet selects a bar and a count with one footer button (live on v18), and from v19 shows the Tier 0 bars, To Rank 10, her share counting down and EXP waiting past Rank 10 (`R10 · +12,400 EXP waiting`); route `/town/exchange/manual/:outfitId`. Main JS 219.35 KB gzip on CI | `7890105` |
| H130 | Save v32 written dark (D247): `toV32` resets every Uma to her Tier 0 at Rank 1 in Tier 1 (her mapped Tier 1 class elsewhere), refunds each class's EXP plus up to 1,800 as Class Marks rounded up per class with each Uma's share recorded, merges the healer seats into the Healer Sanctum (each Uma keeps her higher Bond), and records it all in `TierWorld.classesV3` for the sheet; trades that move settle on boot (`settleClassResetTrades`); the v32 parse reads `heroLimitIds(19)`. A full-shaped scratch save paid Tier 1 78 Manuals and Tier 2 15, and with a local switch the next fight started on v19 with five Tier 0s. `toV32` sits in the lazy migrations chunk. Main JS 219.01 KB gzip on CI | `2bea968` |
| H129 | Halls v2's twenty Limit Breaks, dark at engine v19 (D248): five halls (`heroHalls(19)`), seat ids `${hall}-${n}` (`heroLimitIds(19)`: brawler, mage, spellblade, summoner, healer), each Limit Break's own power, kinds, shapes, statuses and lore, the class scale (healers 0.75), the 10-hit cap, a random double's follow-up on the same foe (`RpgHit.follow`); today's six halls and every replay unchanged. Main JS 217.66 KB gzip on CI | `d5cf696` |
| H128 | Classes v3's weapon shapes, dark at engine v19 (D246): Katana and Light doubles, Bow and Dark volleys (`RPG_VOLLEY` 0.8 + 0.35, +2 MP), the twins re-paired (`RPG_KIND_PAIRS_V19`, every twin reader by engine), the three line B changes (`RPG_LINE_B_POWER_V19`), the splash plain from v19 and Auto counting it; every v14–v18 replay and node pinned. Main JS 217.47 KB gzip on CI | `bf7e5fc` |
| H126 | Classes v3 in the domain, dark at engine v19 (D244 build decisions, D245): the 13 classes and the tree, Tier 0 and promotion, the two new hybrids, the calling by running style, trades, templates 5 × 3, the Rift's builds; v14–v18 replay byte for byte live and at 19; the Tier 0 Mage shows as Initiate ("Apprentice" is Tier 1's name). Main JS 217.31 KB gzip on CI | `e209585` |
| H136 | The entry's budget (D243): the save's migration chain loads only for an old save again (a local copy of `toV26`'s lead rule in `save.ts`), the v1 economy's names move to a lazy `items/names-v1.ts`, and `scripts/check-size.mjs` guards both. Main JS 224.34 → 214.93 KB gzip on CI; nothing on screen changes; checked with a v30 device copy (the chunk fetched once) and offline in headless Chrome | `e0e5c92` |

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
