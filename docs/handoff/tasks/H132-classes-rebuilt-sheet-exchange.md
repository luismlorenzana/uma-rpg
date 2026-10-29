# H132 — Classes v3: the sheet "The classes are rebuilt", its Account row, and the Exchange's Class Manual sheet

**uma-rpg · ChatGPT · S–M · Needs: H130 (save v32: the reset, its record `TierWorld.classesV3`, Halls v2's merge in it),
H126 (held classes, Tier 0 and its waiting EXP), H129 (the seats' names) · Unblocks: H134 (the switch)**

## Why

The switch to Classes v3 resets every Uma to her Tier 0 at Rank 1 and pays her Class EXP back as Class Marks, 1,000 a
Manual (CV25–CV28). The owner asked for "a proper UI to use this without major reworks". The design answers with two
sheets that already exist (CV30):

- **"The classes are rebuilt"**, a one-time sheet on the model of "The Wilds are rebuilt": the grant, how to rebuild an
  Uma, what reset and what stayed, the trades that moved, the healer seats Halls v2 merged, and each Uma's share; an
  Account row reopens it.
- **The Exchange's Class Manual sheet**, which spends those Marks, gains the Tier 0s and her held classes as bars, **To
  Rank 10** and **Her share** as counts, and a Tier 0 at Rank 10 that **banks for her promotion**.

Both are inert until the switch (H134): the sheet shows only on a world whose save carries the v32 record, and the Manual
sheet's v19 rows read the domain by generation. The Manual sheet's new shape (select a bar, a count, one footer with
before → after) ships live, because H120's door from the profile lands in it.

## Context (read first)

- `CLAUDE.md`, `AGENTS.md`.
- **Classes v3** ([classes-v3.md](../../design/classes-v3/classes-v3.md), D240): **§8 entire** (§8.1 what happens in each
  world, §8.2 the refund and why it is paid as Class Marks, §8.4 trades, §8.5 what stays, **§8.6 the sheet**, **§8.7 the
  five worked examples**), §2.3 and §2.6 (Tier 0's curve, 3,600 to Rank 10; EXP past Rank 10 waits, up to 23,680),
  **§14.3 (the Exchange's sheet)**, §13 (save v32's rows, `TierWorld.classesV3`); CV25–CV30. The
  [reset page](../../design/classes-v3/previews/reset.html) draws both sheets at 390×844 and computes the examples.
- **Halls v2** ([halls-v2.md](../../design/classes-v3/halls-v2.md), D241): **§7.1–§7.2** (the healer seats' merge: the
  higher Bond kept, the displaced Hero, Learners over ten; **item 5: the line on this sheet**), §7.3
  (the line lives in `classesV3`); HV18, HV19.
- **The profile v2 proposal** ([proposal.md](../../design/uma-profile-v2/proposal.md), D239): §2.4 (the grammar: a tap
  selects, spending in the footer with its cost and before → after, the sheet stays open), §7.2 (Class Rank `R{n}`,
  Trade, Unlock), §7.3 (type), §7.4 (states), UP30 (Manuals stay at the Exchange).
- **The code on `main` at `b9ce7c5`.** Paths under `apps/web/src/`:
  - `grant/GrantSheet.tsx` (the kit's `Sheet`, the footer's two buttons, the By Uma list with faces) and
    `grant/grant-lines.ts` (`grantLines`, `GRANT_TITLE`, `grantRow`: the words, pure, tested in `grant-lines.test.ts`):
    **the model for this sheet**;
  - `hub/Shell.tsx` (`GrantSheet` lazy `:16`, `grantDue :26`, `showGrant :30`, `grantLater`/`grantWilds :31–38`, the
    overlay `:54`; the global sheets `?sheet=…`); `save/game.ts` (`seeGrant :136` over the domain's `markGrantSeen`,
    `readManual :292`);
  - `places/account/AccountPage.tsx` (`sections :46`, `GrantRow :60–72`, `?sheet=grant`);
  - `places/exchange/ExchangePage.tsx` (the Manuals section `:77–93` and its (i), `marksLine :100`, **`ManualSheet
    :138–177`**: the shared picker, then "Which bar?" with ×1 and ×5 a row); `album/PickerStep.tsx`;
    `places/registry.tsx` (`PageProps.rest`; the Exchange's page takes none today);
  - the domain: `save/exchange.ts` (`manualBlock :198`, `readManuals :209`), `economy/ranks.ts` (`MANUAL_EXP`,
    `MANUAL_PRICE :154–155`, `classTrack`, `trackOf`), `save/migrations.ts :370` (`TierGrant`, a once-record with
    `seen`: the model H130 follows).
- **The packets this builds on** ([tasks/](.), each one's "Names other packets read"; **where their merged code differs
  from a name below, the code wins**):
  - **H130:** the record **`TierWorld.classesV3?: ClassesV3Record`** (`manuals`, `marks`, `umas` (a `ClassesV3Line` for
    every Uma the world had at v31: `classId`, `ranks` by v31 id, `pick`, `manuals`, **`left`** (her share not read
    yet), `trade?: { from, to }`), `halls: HallMergeLine[]` (`outfitId`, `from` her v31 seat, `to` her `healer-*` seat,
    `was` `hero`/`learner`, `now` `learner`/`unseated`, `bond`), `traded`, `seen`); **`markClassesV3Seen(save, tier,
    now)`**; `settleClassesV3Trades` (the web runs it on every boot after the roster loads: until it has, `traded` is
    false and the trade lines aren't written); `readManuals` counting `left` down; `umaPick(uma)`.
  - **H126:** `rpgClassName(classId, engine)` (names by generation), `RPG_ROOT_NAME`, `RPG_TIER0_ROOT`,
    `RPG_TIER0_CLASSES`, `umaCalling(outfit, null, 19)` (her Tier 0, which the record doesn't store), `umaHeldClasses`,
    `grantClassTrack`, `rpgClassMaxRank`, `rpgClassExpToNext`, `RPG_TIER0_BANK` (23,680), and `manualBlock` (a closed
    class refused with its gate; a Tier 0 at Rank 10 open until its bank is full); `rpgRework('classes')`.
  - **H129:** `heroLimitFor(id, version)` for the old and new seats' names (`paladin-3` at 18, `healer-2` at 19).
  - **H120:** the door `/town/exchange/manual/:outfitId` from the profile's Classes sheet; its decision 5 is the same
    contract as decision 6 here.
- **The manual:** [sections § Exchange and § Account](../../game/sections.md#exchange) (the grant's sheet is described
  under Account), [loops](../../game/loops.md) (the Tier rework's grant, as the model for the reset's section H134
  writes).

## Decisions made

### From the designs, exact

**"The classes are rebuilt"** (CV §8.6, the reset page):

| Part | Reads |
|---|---|
| Title | `The classes are rebuilt` and ✕ |
| Grant | `+78 Class Manuals` at 22 px; under it `78,000 Class Marks · Exchange` |
| Lead | "Every Uma starts her class tree at Rank 1 of her Tier 0." |
| The tree, small | `Warrior` · `All-Rounder` · `Mage`, with the five Tier 0 emblems and names under them (Recruit · Duelist, Acolyte, Caller · Apprentice) |
| How to rebuild an Uma | 1 `Exchange → Read a Class Manual → her Tier 0 → Her share`; 2 `Her profile → Class → Promote (Rank 10)`, and under it "EXP past Rank 10 goes with her into the new class" |
| Reset | `Class Ranks · weapons per class · lines · equipped skills · callings` |
| Stays | `Uma Levels · weapon, armor and accessory grades · Extra Stats · Craft Levels · Bonds · Hall seats · Laurels · items` |
| Weapons | `No Weapon Rank since R2: grades stay` |
| Trades | `2 Umas moved trade · their running work finished into the Warehouse` (left out when none moved) |
| Halls | Halls v2's merge (decision 5; left out when no seat merged) |
| Each Uma, by Manuals | One row each, most Manuals first: her face and name, her share on the right (`34`), and under them `Summoner R50 · Mage R15 → Caller R1` (her classes before, highest rank first), `· trade Wood → Stone` when hers moved |
| Footer | **To the Exchange** · **Later**. Both mark it seen; ✕ is Later |

- It opens by itself **once per world** whose record is unseen, never over a fight (the grant's rule), and **from the
  Account's row** `The classes are rebuilt · 78 Class Manuals` (`?sheet=classes`) for as long as the record lasts.
- **To the Exchange** opens the Exchange's Manual sheet on its Uma picker (`/town/exchange/manual`).

**The Exchange's Class Manual sheet** (CV §14.3, the reset page):

| Part | v18 (live) | v19 |
|---|---|---|
| Uma | The shared picker (highest Uma Level first), or the Uma the route names | The same |
| Head | `{Uma} · Class Marks 78,000` | Adds `Her share · 21` while the record lists her share |
| Bars, one row each, a tap selects (Selected ring) | Her six classes: emblem, name, `R34` and its bar | **The five Tier 0s, her calling's first** (`R1/10 · Calling`), then **the Tier 1 classes she holds**, in the tree's order (`R34`); a Tier 0 at Rank 10 reads `R10 · +400 EXP waiting`; a Tier 1 class she doesn't hold isn't listed |
| Counts (chips) | `1` · `5` · `10` · `Max · 78` | Adds **`To Rank 10 · 4`** on a Tier 0 below Rank 10 and **`Her share · 21`** |
| Before → after | `Brawler R34 → R36` | `Recruit R1 → R10 · +17,400 EXP waiting` |
| Footer | **Read 21 · 21,000 Class Marks**; blocked, disabled with the reason (`manualBlock`'s) | The same |

- **Past the top rank on a Tier 0** (CV §14.3): at Rank 10 the bar still reads; the EXP waits for her promotion, up to
  what Ranks 10–50 take (23,680); a count over that room is disabled.
- The sheet **stays open** on the new state after Read (G5); "Choose another Uma" as today.

### Build decisions (log them in the D-row)

1. **`grant/classes-lines.ts`** (pure, like `grant-lines.ts`): `classesLines(record, who, tier)` returns the sheet's
   parts, and `classesRow(record)` the Account's row. `who` names an Uma from master data (`An Uma` when it lacks one).
   A part with nothing in it is left out. Its lead and steps are sentences, as a one-time sheet's may be (H117's copy
   test exempts one-time confirms); every fact on it with a builder in `copy.ts` uses it (`R{n}`, the trade, `+{n} EXP
   waiting`).
2. **`grant/ClassesSheet.tsx`**, lazy, on the kit's `Sheet` as `GrantSheet`. The shell opens it on `?sheet=classes` or
   for an unseen record outside a fight, **once its trades have settled** (`traded` true, so the trade lines are
   complete). **One one-time sheet at a time:** an unseen grant first, then this one (a save that crosses v28 and v32 in
   one load has both).
3. **Seen:** `seeClassesRebuilt()` in `save/game.ts` over H130's `markClassesV3Seen` (the `seeGrant` pattern).
4. **The "before" names are engine v18's** (`rpgClassName(id, 18)`: Mage, Spell Blade, Summoner, as the record's v31 ids
   were then), so each line says what the owner had; her Tier 0 after the arrow is `umaCalling(outfit, null, 19)`'s, by
   v19's name.
5. **The Halls part** (Halls v2 §7.2 item 5; CV §8.6's one-liner gives way to it, since HV19 asks to name every Uma who
   moved), from `record.halls`: a head line `Paladin Bastion · Cleric Chapel → Healer Sanctum`, then one line per
   `HallMergeLine`, as label and value: `Uma A · Hero → Learner · Archdemon's Toll · Bond 7` (`was` hero, `now`
   learner); `Uma F · Learner → no seat · Seraph's Pyre · Bond 3` (`now` unseated: over ten, her Bond kept), the Limit
   Break being `to`'s at v19; then `Each Uma keeps her higher Bond`. With seats merged and no line, the head line and
   that last line only; a world whose Paladin Bastion and Cleric Chapel were empty shows no Halls part. **This packet
   owns the line** (H133 doesn't touch the sheet).
6. **The Exchange route** (shared with H120's decision 5 word for word): `ExchangePage` takes `PageProps` and reads
   `rest`: **`/town/exchange/manual/:outfitId`** opens the Manual sheet on that Uma's bars, **`/town/exchange/manual`**
   on the picker; closing the sheet replaces the URL with `/town/exchange`, keeping the navigation state, so the place
   header's Back still returns to the door. **Whichever of H120 and H132 lands first adds the route; the second keeps
   it.**
7. **`places/exchange/manual-view.ts`** (pure, tested): `manualBars(outfit, uma, world)` (by generation),
   `manualCounts(world, uma, ref, record)` (each chip's count, or why it is disabled), `manualStep(uma, ref, n)` (before
   → after from the domain's track grant on the class's own curve, never from text) and the footer's label. `To Rank 10`
   is the whole Manuals that reach Rank 10 from her track: ⌈(3,600 − her EXP from Rank 1) ÷ 1,000⌉.
8. **The new shape ships live** on v18 (six bars; 1 · 5 · 10 · Max): one shape for both generations, and H120's live
   door lands in it. The v19 rows (Tier 0 bars, To Rank 10, Her share, the waiting EXP) appear only by generation and
   data. *Why:* "×1 ×5" on every row can't hold four more counts, and the profile's grammar is a selection and one footer
   action with its cost.
9. **Her share** is her line's **`left`** (H130: it counts down as she reads Manuals on any class bar, so a share already
   read is never offered again); the chip shows while `left` is above 0. A hint, not a reservation (CV §8.2): it stays
   tappable for any of her bars.
10. **Words** (C3): the facts the profile shares come from `copy.ts`: H120's `R{n}/10` and `+{n} EXP waiting`, and
    `R{n}` (whichever of H120 and H132 lands first adds the first two; the second reuses them). The Exchange's own
    labels live in `manual-view.ts`, not in `copy.ts`: `To Rank 10`, `Her share` (CV30's name for the count; the copy
    test sweeps `copy.ts` and bans "her", and the Exchange isn't a profile screen), `Max`, `Read {n} · {marks} Class
    Marks`, `R{n}/10 · Calling`. The Account row `The classes are rebuilt · {n} Class Manuals`. CV §14.3's "Waits for
    her promotion" is the bar's `R10 · +400 EXP waiting` (one wording with the profile's promotion line).
11. **The Manuals (i)** gains, on v19: "A Tier 0 reads to Rank 10; past it the EXP waits for her promotion." and "Her
    share: her Manuals from the classes' reset."
12. **Later tiers' worlds** (CV §8.1, R6): no Tier 0 there, so the sheet's lead reads "Every Uma starts again at Rank 1
    of her class.", step 1 `Exchange → Read a Class Manual → her class → Her share`, no step 2, and each line `→ Brawler
    R1`; the Manual sheet's bars there are the eight Tier 1 classes (every one is open from Rank 1), her active class
    first, and no `To Rank 10`.
13. **Bundle:** the shell's check of an unseen record is a few bytes in the main bundle (as `grantDue`); the sheet and
    its words are lazy. Expected main JS change: under +0.1 KB.
14. **Your ports:** API 8093, web 5186 (H120 8092/5185, H133 8094/5187, H123 8095/5188, H121–H124 8091/5184).

## Do

1. **`classes-lines.ts`** and **`manual-view.ts`** (decisions 1, 4, 5, 7, 12) and their tests; the words in `copy.ts`
   where they are wording facts (decision 10).
2. **`ClassesSheet.tsx`** and the shell's wiring (decision 2), `seeClassesRebuilt` (decision 3), the Account row.
3. **The Exchange:** the route (decision 6), the Manual sheet's new shape (decision 8), the v19 bars and counts, the
   (i) lines.
4. **Tests:**
   - `grant/classes-lines.test.ts`, on a record holding **CV §8.7's five Umas** (A–E, made up as the doc's): `+78 Class
     Manuals`, `78,000 Class Marks`; the rows E 34, A 21, B 13, C 10, then D (no Manuals, a moved trade); B's `Spell
     Blade R26 · Mage R8 → Apprentice R1 · trade Wood → Stone`; E's `Summoner R50 · Mage R15 → Caller R1`; D's `No
     Class EXP → Duelist R1 · trade Stone → Wood`; `2 Umas moved trade`; the Halls part with a displaced Hero (`hero` →
     `learner`) and a Learner over ten (`learner` → `unseated`), and with merged seats and no line; no Trades or Halls part when the record has none; a Tier 2
     world's lead and step; `classesRow`.
   - `places/exchange/manual-view.test.ts` (live, v18): six bars with `R34`; counts 1, 5, 10 and `Max` by the Marks;
     `Brawler R34 → R36` for 2 Manuals; a bar at Rank 50 blocked with `manualBlock`'s reason.
   - `places/exchange/manual-view.v19.test.ts` (the switch mocked to 19 with `capsAt`, as H120's v19 tests): Uma A
     after the reset: five Tier 0 bars, Recruit first `R1/10 · Calling`, no Tier 1 bar; `To Rank 10 · 4`; `Her share ·
     21`; `Max · 78`; 21 Manuals → `Recruit R1 → R10 · +17,400 EXP waiting`; after reading 16, `Her share · 5` (`left`
     counts down) and at 0 no chip; a Tier 0 at Rank 10 reads `R10 · +400 EXP
     waiting` and caps the counts at the room left; a held Brawler listed after the Tier 0s; Arms Summoner, not held,
     absent.
   - Shell and Account: the sheet opens once for an unseen record whose trades have settled, and not over a fight, nor
     while `traded` is false; after the grant when both are unseen; Later and To the Exchange mark it seen (`seeClassesRebuilt` called); To the Exchange lands on
     `/town/exchange/manual` with the picker; the Account row opens `?sheet=classes`; no row without a record.
   - The Exchange's route: `/town/exchange/manual/81001` opens on her bars; closing it lands on `/town/exchange` with
     the navigation state kept.
5. **Measure** at 390×844 and 375×667, light and dark: the one-time sheet scrolls (it may: CV §8.6 draws it as one
   long sheet, its footer fixed); the Manual sheet with a Uma picked fits one screen without scrolling (B3) on both
   generations. Record the numbers in the pull request.
6. **Docs:** sections.md § Exchange (the Manual sheet's shape; the v19 rows under a "From the switch (H134)" line) and §
   Account (the row and the sheet, beside the grant's); `pnpm docs:update`.
7. **Check it locally** in a desktop browser at 390×844 and 375×667, light and dark, never the iOS Simulator, on your
   own ports (API `AUTH_MODE=disabled PORT=8093 LOCAL_SAVE_FILE=.data/scratch-h132.json`, web on 5186 with
   `API_PROXY_TARGET=http://localhost:8093`), on a scratch save at v31 built like CV §8.7's five Umas (and two Paladin
   Bastion Heroes with Learners, for the merge): the Manual sheet live. Then **flip the switch locally** (H134's three lines,
   H126 decision 6: `caps.ts` 19, `version.ts` 32, `migrateWorld` chaining `toV32`), restart, let the save migrate: the sheet opens once; read Uma A's share
   on her Recruit, promote her in her profile (H120, if merged), reopen from the Account. **Revert the flip before you
   commit.**
8. **Log the D-row** (fetch `main` first): "H132: 'The classes are rebuilt' and the Exchange's Class Manual sheet",
   decisions 1–14.

## Done when

- [ ] `pnpm lint && pnpm test && pnpm build` pass. Say the main JS number (gzip, of 230 KB) and this packet's change
  (under +0.1 KB expected); the sheet and its words are in lazy chunks.
- [ ] The tests in step 4 pass, the v19 ones with the switch mocked; H117's copy test still passes.
- [ ] The Manual sheet fits one screen at 390×844 with an Uma picked, on both generations; the numbers in the pull
  request.
- [ ] On the live engine nothing of the reset shows (no record, no sheet, no row, no Tier 0 bar).
- [ ] `pnpm docs:update` leaves no diff; the manual describes the sheet, the row and the Manual sheet.
- [ ] The local check in step 7 was done at both sizes, light and dark, on a scratch save, on both generations, and
  described; the flip is reverted. Nothing from the original games in git (`git status`).
- [ ] Deployed green (`gh run watch <id> -R luismlorenzana/uma-rpg --exit-status`) and
  https://uma-rpg.web.app/api/health shows the merge commit.

## Deliver

- **ChatGPT:** a branch `feat/h132-classes-rebuilt` in a worktree outside `~/workspace` (AGENTS.md), and a pull request,
  "feat(web): 'The classes are rebuilt' and the Exchange's Class Manual sheet, v19 parts inert (H132)", the body saying
  why (D240 CV25–CV30, D241 HV19). Fetch `main` before you push so the D-number is free. Merge it yourself when the
  checks and CI are green, and watch the deploy (rerun the web job on Vitest's `Timeout calling "onTaskUpdate"`).
- **Flag it done:** delete this file and add a Done row in [README.md](../README.md) with the merge commit; say in the
  delivery that the one-time sheet is first seen at the switch, so the owner reads it on the phone then.
