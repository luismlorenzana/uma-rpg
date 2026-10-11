# H12 — Fold settled rules into the design docs

**Priority P2 · ChatGPT · uma-rpg · M.**

## Why

The design docs are the source of truth (`AGENTS.md`), but several lag the decision log:

- `docs/design/game-design.md` is still "draft v0.4", with `[Proposed]` tags on rules settled since.
- `items.md` and §14 predate the item rebalance and D86's recipes.
- `AGENTS.md` says the main JS budget is 180 KB, but D56 raised it to 230.

Agents and the owner read stale rules.

## Context

- **`docs/decisions.md`** is the record: append-only. Read D25 → D86 in order. Later rows supersede earlier ones.
- **Docs that are current:**
  - `docs/design/class-rework.md`, `classes.md` and `battles.md` (D86);
  - `docs/design/world/*` (D72–D85);
  - `docs/design/loop.md`, `forge.md`, `kitchen.md` and `pacing.md`.

  Check each against the code before trusting it.
- **Docs to fold:** `docs/design/game-design.md` (its §2, §3, §6, §7 and §12–§14), `docs/design/items.md`,
  `docs/technical/architecture.md` (save schema v14, engine v6, routes) and `AGENTS.md` (the budget line).
- **Code is the tiebreaker** where docs disagree:
  - `packages/domain/src/economy/` (`pacing.ts`, `tokens.ts`, `gear.ts`, `dishes.ts`, `training.ts`);
  - `packages/domain/src/items/catalog.ts`;
  - `packages/domain/src/save/save.ts`.

## Do

1. For each `[Proposed]` tag in `game-design.md`:
   - if a decision settled it, state the settled rule, drop the tag and cite the decision ("(D79)");
   - if it's still open, keep it and make sure it's in `docs/open-questions.md`.
2. Rewrite the sections that describe retired systems so they point to their replacements, and delete the old text:
   - chapters → the world map (D72);
   - Rush → Time Tickets (D74);
   - builds → classes (D86).

   Bump the header to "v1.0, 2026-10-xx".
3. Update `items.md` to the catalog in code: families, grades and refined items, with the D86 gear recipes (four refined
   of the grade, one of each family of the type's half, plus a Crafting Token). Update the families-to-sites
   symmetry (`economy/materials.test.ts`).
4. Fix `AGENTS.md`'s budget line to D56's 230 KB gzip.
5. Keep the house style: short sentences, tables for comparisons, decision numbers in parentheses, no new rules. Where
   the docs and the code disagree and no decision explains it, list the case in the pull request rather than choosing.

## Done when

- `rg -n "\[Proposed\]" docs/design` only hits open questions.
- Every rule you touched cites a decision or matches the code.
- Every link resolves.
- The pull request lists each mismatch between code and docs that you found and how you resolved it.

## Deliver

A pull request on `docs/design-refresh`, titled `docs: fold settled rules into the design docs (H12)`.
