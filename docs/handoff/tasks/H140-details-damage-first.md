# H140 — Details v2: damage first, All stats a tap down

**uma-rpg · Claude or ChatGPT · M · Needs: H139 · Unblocks: H143 (its marks on the tiles)**

## Why

The owner's screenshot of Details: 26 rows in two columns, wrapped values, three rows that all start "Might", and the number they care about
nowhere on it. They want final damage for her three weapons with its sources in parentheses, in color, with the raw stats out of the way but
still there. The old Battle tab colored its sources; profile v2 lost that in passing, with no decision behind it.

This packet rebuilds the sheet as two pages: **Details** (Damage and Stats) and **All stats** (everything else). No rule changes.

## Context (read first)

- `CLAUDE.md`, `AGENTS.md`.
- **The design:** [proposal.md](../../design/profile-polish/proposal.md) §0–§2 and PP1–PP15. **Build to the
  [Details page](../../design/profile-polish/previews/details.html):** it draws both pages, a hybrid, both themes and both sizes, and its source
  holds the exact sizes.
- **The profile v2 contract:** [uma-profile-v2/proposal.md](../../design/uma-profile-v2/proposal.md) §3.3 (Details, which this replaces), §7.2 (wording),
  §7.4 (states: green is Ready's alone), §9 (G4, a sheet never opens a sheet; B3), §10.4 (how to measure).
- **H139's** `umaDamageSheet`, `DamageSheet` and `SheetRow.accessory`.
- **The code on `main` at `c885053`** (re-read after H139):
  - `apps/web/src/places/stable/DetailsSheet.tsx`, all of it; its `open` prop returns null when closed;
  - `apps/web/src/places/stable/copy.ts:117` `statParts`, `:122` `coreSource`, `:127` `statFormulaLines`; `copy.test.ts:104–109`;
  - `apps/web/src/battle/labels.tsx`: `KindMark`, `kindLabel`, `KIND_COLOR`, `WEAPON_LABEL`;
  - `apps/web/src/index.css:7–48`: the `--kind-*` tokens in their three blocks (light, `[data-theme='dark']`, the media query); put `--src-*` beside them;
  - `apps/web/src/places/stable/OutfitProfile.test.tsx:139–163`: the Details tests and their hooks, `data-profile-details` and `data-stat-formula`.
- **The manual:** [sections.md:205–210](../../game/sections.md) (the Details bullets); [phone-check.md](../../testing/phone-check.md) step 8.

## Decisions made

From the design, exact:

- **Page 1, "Details":** a **Damage** section, a **Stats** section, then an **All stats ›** row (44 pt, `bg-raised`).
- **Damage:** the section title with the chip `Bosses +3%` at its right, only when `bosses > 0`. Three rows, each a 26 px `KindMark`, the
  total in the display font at 24 px, then the parts in parentheses at 14 px: `86 (70 +8 +6 +2)`. Zero parts are dropped; the stat always
  shows. Under the numbers, the strip.
- **The strip:** 4 px tall, 2 px gaps, one segment per part in that part's color, its width the row's share of the largest of her three
  rows, so the three compare. No labels: the numbers above it are the labels.
- **The key,** one line at 11 px: a square for each stat she uses, `Might`, `Accessory`, `★ Signature`.
- **One line per stat she uses,** 11.5 px: `M.ATK 70 · base 52 · armor 10 · accessory 3 · Stars 5`, adding `★ 4` for her moon. Zero parts dropped.
- **Stats:** five tiles, `HP · MP · DEF · M.DEF · Evasion`, the value over the label. A healer adds `Mends ×1.43`, and the tiles become three across.
  Final numbers only.
- **Page 2, "All stats":** ‹ Details at the top, then one column: Offense, Defense, Sustain, Other (every row of `umaBattleSheet`, 0 included), Core,
  Work, Since, and **How stats add up** at the end. The close button closes the sheet from either page.
- **Colors** (`--src-*`, the same three blocks as `--kind-*`):

  | Token | For | Light | Dark |
  |---|---|---|---|
  | `--src-atk` | ATK | `#c2410c` | `#ff8f5e` |
  | `--src-matk` | M.ATK | `#1d6fd1` | `#5fb2ff` |
  | `--src-might` | Might, armor | `#3f4b5c` | `#c3ccd8` |
  | `--src-accessory` | Accessory, Bosses | `#a23ac8` | `#d48cf0` |
  | `--src-star` | ★ | `#8f6410` | `#e8b65a` |
  | `--src-stars` | Stars | `#0e7490` | `#7fd4e8` |

  Fixed in every tier's tint. All stats' source lines use the same colors.

Build decisions (log them in the D-row):

1. **Two pages, one sheet:** a `page` state in `DetailsSheet`; `BottomSheet`'s title follows it. The sheet resets to page 1 when it closes (PP2), and
   the body scrolls to the top on a swap.
2. **New components in `places/stable/`:** `DamageCard.tsx` (the section, on `DamageSheet`) and the existing `DetailSection` and `DetailRow` for All
   stats. A pure `damage-view.ts` builds each row's parts, in order, with their tokens and strip shares, so the rule is testable without a DOM.
3. **`copy.statParts(base, armor, accessory, stars, moon)`:** `gear` splits (PP14). `StatParts` draws each part in its token; `★` stays last.
   `BattleRow` reads armor as `gear - accessory`.
4. **New wording first** in `copy.ts` and the copy test: `Damage`, `Stats`, `All stats`, `Bosses +n%`, the stat line. `statFormulaLines` gains two lines:
   `Damage · stat + Might + Orb + ★` and `Hit · damage²/(damage + DEF) × skill`, so the list is 9 lines, and the test's length follows.
5. **A kind's name** is `KindMark`'s label, for a screen reader. Each row's own label reads the sum: "Fire 86: M.ATK 70, Might 8, Accessory 6, Signature 2".
6. **No Damage section** when `umaDamageSheet` returns null (PP15): page 1 opens on Stats.
7. **The strip is `aria-hidden`:** the row's label says it all.

## Do

1. **Tokens,** `damage-view.ts`, `DamageCard.tsx`, then the rework of `DetailsSheet.tsx`.
2. **`statParts`** and its callers.
3. **Tests:**
   - `damage-view.test.ts`: parts in order, zero parts dropped, the stat always kept, strip shares that sum to the row's share of the largest row.
   - `DetailsSheet` (extend `OutfitProfile.test.tsx`): page 1 shows three rows with their sums; a hybrid shows ATK and M.ATK with both stat lines;
     the chip only with an Insignia; a healer's Mends tile; **All stats** swaps the page, ‹ Details returns, closing and reopening lands on page 1;
     every `umaBattleSheet` row is on All stats, 0 included; `data-stat-formula` expands there; no `gear` word left in the sheet.
   - A contrast test on the token table: each `--src-*` ≥ 4.5:1 on `panel` and `raised`, in both themes. Read the tokens from `index.css`, so a
     later change fails it.
   - The copy test passes, with `DamageCard.tsx` in its JSX list.
4. **Measure** at 390×844 and 375×667 (proposal §10.4's method), light and dark, on a graded Sorcerer, a graded hybrid and a Cleric, Tier 1 and Tier 3:
   ```js
   const body = document.querySelector('[data-kit="sheet"] .overflow-y-auto'); body.scrollHeight <= body.clientHeight   // page 1, no scroll
   [...document.querySelectorAll('[data-kit="sheet"] *')].filter((el) => el.children.length === 0 && el.textContent.trim() && parseFloat(getComputedStyle(el).fontSize) < 11)   // []
   ```
   No row wraps on page 1 at 375 with Tier 3's largest numbers.
5. **Docs:** [sections.md](../../game/sections.md) Details bullets; [phone-check.md](../../testing/phone-check.md) step 8 and step 15; a status line at the top of
   [uma-profile-v2/proposal.md](../../design/uma-profile-v2/proposal.md) and a line in §3.3 pointing here; `pnpm docs:update`.
6. **Check it locally** on your own ports, on a scratch save: `.claude/launch.json`'s `rpg-api` and `rpg-web`, or `AUTH_MODE=disabled PORT=8091 LOCAL_SAVE_FILE=.data/scratch-h140.json` and web 5184.
   Compare a Sorcerer's Fire row by hand against her Gear tab: it must add up. Never the production save.
7. **Log the D-row** (fetch `main` first): "H140: Details, damage first and All stats a tap down", build decisions 1–7, and PP1–PP15 by reference.

## Done when

- [ ] `pnpm lint && pnpm test:ci && pnpm build` pass. Say the main JS number, of 230 KB, and this packet's change (0 expected: the Stable's chunk).
- [ ] The tests in step 3 pass; the copy test passes; every new fact is in the wording list.
- [ ] Page 1 doesn't scroll at 390×844 or 375×667, nothing is under 11 px, every target is 44 pt, and no row wraps at 375. Numbers in the delivery.
- [ ] All stats holds every row the old sheet had: a Sorcerer's, a Cleric's and a Tier 0's.
- [ ] `pnpm docs:update` leaves no diff; the manual and the phone check describe both pages.
- [ ] The local check in step 6 was done at both sizes, light and dark, and described. Nothing from the original games in git (`git status`).
- [ ] Deployed green (`gh run watch <id> -R luismlorenzana/uma-rpg --exit-status`) and https://uma-rpg.web.app/api/health shows the commit.

## Deliver

- **Claude:** commit to `main`, "feat(web): Details opens on damage, All stats a tap down (H140)".
- **ChatGPT:** a branch `feat/h140-details-damage` and a pull request with that title, the measurements in its body. Merge it yourself when the checks and CI are
  green, and watch the deploy. Fetch `main` before you push so the D-number is free.
- **Flag it done:** delete this file and add a Done row in [README.md](../README.md) with the commit.
